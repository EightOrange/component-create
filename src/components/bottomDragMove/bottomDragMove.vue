<!--底部上拉组件V2-->
<!--author:yuzhuofan-->
<!--time:2022.08.12-->
<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";


interface VmrempxTransParams {
  value: number;
  from: string;
  pageWidth: number;
  fontsize: number;
}

/**
 * 长度单位转换
 * @param value 数值
 * @param type 传入的数值单位类型
 * @param pageWidth px单位的页面宽度
 * @param fontsize px单位的页面字体大小
 */
function vmrempxTrans({value, from, pageWidth = 750, fontsize = 16}: VmrempxTransParams) {
  let res: { vw: number, px: number, rem: number } = {
    'vw': 0,
    'px': 0,
    'rem': 0,
  };

  switch (from) {
    case 'vw':
      res["vw"] = value;
      res["px"] = value * pageWidth / 100;
      res["rem"] = value * pageWidth / 100 / fontsize;
      break;
    case 'px':
      res["vw"] = value * (100 / pageWidth);
      res["px"] = value;
      res["rem"] = value / fontsize;
      break;
    case 'rem':
      res["vw"] = (value * fontsize) * (100 / pageWidth);
      res["px"] = value * fontsize;
      res["rem"] = value;
      break;
    default:
      throw Error('传入的类型错误或不支持');
  }
  return res;
}

/**
 * =================================================
 * =================================================
 *                惯性滑动类部分  START
 * =================================================
 * =================================================
 */

interface DragLeaveParams {
  pageHeight: number;
}

/**
 * 惯性滑动
 */
class DragLeave {
  get pageHeight(): number {
    return this._pageHeight;
  }

  set pageHeight(value: number) {
    this._pageHeight = value;
  }

  get inertiaDistance(): number {
    return this._inertiaDistance;
  }

  private _startTime: number = 0;//开始时间戳
  private _endTime: number = 0;//结束时间戳
  private _intervalTime: number = 0;//滑动使用的毫秒数
  private _slidingDistance: number = 0;//滑动距离
  private _friction: number = 0;//滑动力度
  private _inertiaDistance: number = 0;//需要惯性滑动的距离
  private _startingPosition: number = 0;//开始滑动时的位置
  private _pageHeight: number = 0;//页面高度


  constructor({pageHeight = 1080}: DragLeaveParams) {
    this._pageHeight = pageHeight;
  }

  start(startingPosition: number) {
    this._startTime = new Date().getTime();
    this._startingPosition = startingPosition;
  }

  stop(endingPosition: number) {
    this._endTime = new Date().getTime();//记录结束时间
    this._intervalTime = this._endTime - this._startTime;//计算间隔时间毫秒数
    this._slidingDistance = endingPosition - this._startingPosition;
    this.inertia();
  }

  /**
   * 计算惯性
   */
  inertia() {
    this._friction = this._slidingDistance / this._intervalTime;
    console.log("滑动力度", this._friction);
    this._inertiaDistance = this._friction * this._pageHeight * 0.2;
    console.log("需要惯性滑动的距离", this._inertiaDistance);
  }


}


/**
 * =================================================
 * =================================================
 *                惯性滑动类部分  END
 * =================================================
 * =================================================
 */


/**
 * =================================================
 * =================================================
 *                抽屉业务部分  START
 * =================================================
 * =================================================
 */

interface ListenTouchParams {
  dominit: any;
}

interface ChangeDragHeightParams {
  height: number;
  time: number;
}

let isToped = ref(true),//判断列表的第一个元素是否位于顶部
    isScollToTop = ref(true),//true 向顶部滑动
    defaultHeight = ref(0),//记录默认高度 %
    currentHeight = ref(0);//记录当前窗体高度%

// !!!!可能会导致触摸卡顿，过渡完成后及时关掉!!!!!!
let isTransClass = reactive({
  trans: false,
  transfast: false,
  transfastest: false
});//是否开启高度变化动画

//惯性滚动相关参数
let slidOption = reactive({
  offset: 50,  // 最大溢出值
  cur: 0, // 列表滑动位置
  vy: 0,  // 本次滑动的距离
  fl: 150,  // 弹力，值越大，到底或到顶后，可以继续拉得越远
  isInTransition: false // 是否在滚动中
})


const window = reactive({
  startHeight: 0,
  endHeight: 100,
});

let startPos = reactive({
      y: 0,
    }),
    endPos = reactive({
      y: 0,
    });


//高度样式绑定
const heightStyle = computed(() => {
  return {
    height: currentHeight.value + '%'
  }
});


/**
 * 手动变更抽屉高度
 * @param height
 */
function changeDragHeight({height, time = 300}: ChangeDragHeightParams) {
  isTransClass.trans = true;
  if (time != 0) {
    setTimeout(function () {
      isTransClass.trans = false;
    }, time);
  }

  if (time <= 200 && time > 50) {
    isTransClass.trans = false;
    isTransClass.transfast = true;
    isTransClass.transfastest = false;
  } else if (time <= 50 && time > 0) {
    isTransClass.trans = false;
    isTransClass.transfast = false;
    isTransClass.transfastest = true;
  }

  currentHeight.value = height;
}

// 向父组件暴露changeDragHeight方法
defineExpose({
  changeDragHeight
})


//获取组件体dom
const bottomDrag = ref(null);
const slotDom = ref(null);

//页面高度
let clientHeight: number;
//声明计时类
const drag = new DragLeave({pageHeight: 0});

onMounted(() => {
  clientHeight = document.documentElement.clientHeight;
  drag.pageHeight = clientHeight;
  initTab();
});


/**
 * ========================================================
 * 监听触摸函数定义部分   START
 * ========================================================
 */

/**
 * 初始化函数
 */
function initTab() {
  document.body.addEventListener('touchmove', function (event) {
    event.preventDefault()
  }, {passive: false})

  watchEffect(() => {
    if (bottomDrag.value) {

      window.endHeight = slotDom.value.clientHeight;
      console.log(window.endHeight)

      //启动监听函数
      listenTouchStart({dominit: bottomDrag.value});
      listenTouchMove({dominit: bottomDrag.value});
      listenTouchEnd({dominit: bottomDrag.value});
      listenTouchCancel({dominit: bottomDrag.value});

    } else {
      // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
    }
  })


}

/**
 * 监听触摸开始
 * @param dominit
 * @param dominit
 */
function listenTouchStart({dominit}: ListenTouchParams) {
  dominit.addEventListener('touchstart', (event: any) => {
    //记录点击坐标
    startPos.y = event.targetTouches[0].pageY as any;
    defaultHeight.value = currentHeight.value;

    slidOption.vy = 0;//复原滑动力度

    drag.start(currentHeight.value);

  })
}

/**
 * 监听触摸过程
 * @param dominit
 */
function listenTouchMove({dominit}: ListenTouchParams) {

  dominit.addEventListener('touchmove', (event: any) => {
    //计算移动距离
    if (event.targetTouches.length > 1) {
      return
    }
    let touch = event.targetTouches[0];
    let dy = ((startPos.y - touch.pageY) * 100) / 667;

    console.log('clientY', event.targetTouches[0].clientY)
    console.log('startPos.y', startPos.y)
    console.log('event.targetTouches[0].clientY - startPos.y', event.targetTouches[0].clientY - startPos.y)
    slidOption.vy = event.targetTouches[0].clientY - startPos.y;

    console.log(slidOption.vy)

    console.log("isToped", isToped.value);
    console.log("isScollToTop", isScollToTop.value);
    console.log("dy", dy);

    //if (isToped.value && !isScollToTop.value && dy < 0) {
    if (isToped.value && dy < 0) {
      // 向下
      event.preventDefault()

      endPos.y = touch.pageY
      currentHeight.value = Math.max(
          window.startHeight,
          defaultHeight.value + dy
      )

      console.log('向下滑动')

      //} else if (isToped && dy > 0 && isScollToTop) {
    } else if (isToped.value && dy > 0) {
      //向上
      event.preventDefault()
      console.log(currentHeight.value)
      // if (currentHeight.value == window.endHeight) {
      //   window.endHeight++;
      // }
      endPos.y = touch.pageY;
      currentHeight.value = Math.min(
          window.endHeight,
          defaultHeight.value + dy
      )


      console.log('向上滑动')

    }
    console.log(endPos.y)
  })
}


/**
 * 监听触摸结束
 * @param dominit
 */
function listenTouchEnd({dominit}: ListenTouchParams) {

  dominit.addEventListener('touchend', (event: any) => {
    //停止滑动
    drag.stop(currentHeight.value);
    console.log(currentHeight.value)

    changeDragHeight({
      height: currentHeight.value + drag.inertiaDistance,
      time: 0
    });


    // 阈值 = 差值的20%
    const threshold =
        Math.abs(defaultHeight.value - currentHeight.value) * 0.2
    if (!isToped || threshold === 0) {
      return
    }
    const scrollDy = Math.abs(endPos.y - startPos.y)
    const isDirectorTop = endPos.y - startPos.y < 0
    const isToTop =
        (isDirectorTop && scrollDy > threshold) ||
        (!isDirectorTop && scrollDy < threshold);

  })
}


function listenTouchCancel({dominit}: ListenTouchParams) {
  dominit.addEventListener('touchcancel', (event: any) => {
    console.log('=====touchcancel=====', event)
  })
}

/**
 * ========================================================
 * 监听触摸函数定义部分   END
 * ========================================================
 */


/**
 * =================================================
 * =================================================
 *                抽屉业务部分  END
 * =================================================
 * =================================================
 */


</script>


<template>
  <div class="mainbox" :class="isTransClass" :style="heightStyle" ref="bottomDrag">
    <div class="drag-top-line">===============</div>
    <div id="bottomDrag">
      <div id="slotDom" ref="slotDom">
        <slot></slot>
      </div>

    </div>
  </div>

</template>

<style scoped>
.mainbox {
  position: fixed;
  z-index: 999;
  width: 100vw;
  /*height: 100vh;*/
  position: fixed;
  bottom: 0;
  background-color: lightgreen;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.drag-top-line {
  height: 2rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
}

.trans {
  transition: 0.3s height ease;
}

.transfast {
  transition: 0.1s height ease;
}

.transfastest {
  transition: 0.05s height ease;
}

#bottomDrag {
  margin: 3vw 2vw;
  height: calc(100% - 3vw - 2rem - 3vw);


}


</style>
