<!--底部上拉组件V2-->
<!--author:yuzhuofan-->
<!--time:2022.08.12-->
<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";

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
}

let isToped = ref(true),//判断列表的第一个元素是否位于顶部
    isScollToTop = ref(true),//true 向顶部滑动
    defaultHeight = ref(0),//记录默认高度 %
    currentHeight = ref(0);//记录当前窗体高度%

// !!!!可能会导致触摸卡顿，过渡完成后及时关掉!!!!!!
let isTransClass = ref(false);//是否开启高度变化动画

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
function changeDragHeight({height}: ChangeDragHeightParams) {

  isTransClass.value = true;
  setTimeout(function () {
    isTransClass.value = false;
  }, 300);
  currentHeight.value = height;
}

// 向父组件暴露changeDragHeight方法
defineExpose({
  changeDragHeight
})


//获取组件体dom
const bottomDrag = ref(null);


onMounted(() => {
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
    let touch = event.targetTouches[0]
    let dy = ((startPos.y - touch.pageY) * 100) / 667

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
      if (currentHeight.value == window.endHeight) {
        window.endHeight++;
      }
      endPos.y = touch.pageY;
      currentHeight.value = Math.min(
          window.endHeight,
          defaultHeight.value + dy
      )


      console.log('向上滑动')

    }
  })
}


/**
 * 监听触摸结束
 * @param dominit
 */
function listenTouchEnd({dominit}: ListenTouchParams) {

  dominit.addEventListener('touchend', (event: any) => {

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
        (!isDirectorTop && scrollDy < threshold)

    // 60Hz, 16.6ms
    // let id = setInterval(() => {
    //   if (isToTop) {
    //     isScollToTop.value = false
    //     // that.currentHeight = that.window.endHeight
    //     clearInterval(id)
    //   } else {
    //     // that.currentHeight = that.window.startHeight
    //     isScollToTop.value = true
    //     clearInterval(id)
    //   }
    // }, 10)


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
  <div class="mainbox" :class="{trans:isTransClass}" :style="heightStyle" ref="bottomDrag">
    <div class="drag-top-line">===============</div>
    <div id="bottomDrag">
      <slot></slot>
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

#bottomDrag {
  margin: 3vw 2vw;
  height: calc(100% - 3vw - 2rem - 3vw);


}


</style>
