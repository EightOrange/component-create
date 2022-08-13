<!--底部上拉组件V1-->
<!--author:yuzhuofan-->
<!--time:2022.08.12-->
<template>
  <div class="mainbox" :style="heightStyle">
    <div @click="openDrawable()">===============</div>
    <div id="bottomDrag" ref="bottomDrag">
      <slot></slot>
    </div>
  </div>

</template>

<script lang="ts">

interface ListenTouchParams {
  dominit: any;
}

export default {
  name: "bottomDragMove",
  data() {
    return {
      isToped: true, //判断列表的第一个元素是否位于顶部
      isScollToTop: true, //true 向顶部滑动
      defaultHeight: 46, //记录默认高度 %
      currentHeight: 46, //记录当前窗体高度%
      window: {
        startHeight: 25,
        endHeight: 100,
      },
      startPos: {
        y: 0,
      },
      endPos: {
        y: 0,
      },

    };
  },
  watch: {},
  computed: {
    heightStyle() {
      const that: any = this;
      return {
        height: that.currentHeight + '%',
      }
    },
  },
  methods: {
    /**
     * 初始化函数
     */

    initTab: function () {
      const that: any = this;
      //获取组件体dom
      const bottomDrag = that.$refs.bottomDrag;

      that.listenTouchStart({dominit: bottomDrag});
      that.listenTouchMove({dominit: bottomDrag});
      that.listenTouchEnd({dominit: bottomDrag});
    },
    /**
     * 监听触摸开始
     * @param dominit
     */
    listenTouchStart({dominit}: ListenTouchParams) {
      const that: any = this;

      dominit.addEventListener('touchstart', (event: any) => {
        //记录点击坐标
        that.startPos.y = event.targetTouches[0].pageY as any;
        that.defaultHeight = that.currentHeight as number;
        console.log(that.defaultHeight)
        console.log(that.startPos.y)
      })
    },
    /**
     * 监听触摸过程
     * @param dominit
     */
    listenTouchMove({dominit}: ListenTouchParams) {
      const that: any = this;
      dominit.addEventListener('touchmove', (event: any) => {
        //计算移动距离
        if (event.targetTouches.length > 1) {
          return
        }
        let touch = event.targetTouches[0]
        let dy = ((that.startPos.y - touch.pageY) * 100) / 667

        if (that.isToped && !that.isScollToTop && dy < 0) {
          that.endPos.y = touch.pageY
          that.currentHeight = Math.max(
              that.window.startHeight,
              that.defaultHeight + dy
          )
          console.log(that.currentHeight)
          event.preventDefault()
        } else if (that.isToped && dy > 0 && that.isScollToTop) {
          //向上
          event.preventDefault()
          that.endPos.y = touch.pageY
          that.currentHeight = Math.min(
              that.window.endHeight,
              that.defaultHeight + dy
          )
          console.log(that.currentHeight)
        }
      })
    },
    /**
     * 监听触摸结束
     * @param dominit
     */
    listenTouchEnd({dominit}: ListenTouchParams) {
      const that: any = this;
      dominit.addEventListener('touchend', (event: any) => {
        console.log('====touchend======', event)
        // 阈值 = 差值的20%


        const threshold =
            Math.abs(that.defaultHeight - that.currentHeight) * 0.2
        if (!that.isToped || threshold === 0) {
          return
        }
        const scrollDy = Math.abs(that.endPos.y - that.startPos.y)
        const isDirectorTop = that.endPos.y - that.startPos.y < 0
        const isToTop =
            (isDirectorTop && scrollDy > threshold) ||
            (!isDirectorTop && scrollDy < threshold)

        // 60Hz, 16.6ms
        let id = setInterval(() => {
          if (isToTop) {
            that.isScollToTop = false
            // that.currentHeight = that.window.endHeight
            clearInterval(id)
          } else {
            // that.currentHeight = that.window.startHeight
            that.isScollToTop = true
            clearInterval(id)
          }
        }, 10)


      })
    },
    /**
     * 用户点击头部打开或关闭抽屉事件处理
     */
    openDrawable() {
      const that: any = this;
      console.log(123)
      // 60Hz, 16.6ms
      let id = setInterval(() => {
        if (that.isScollToTop) {
          that.isScollToTop = false
          that.currentHeight = that.window.endHeight
          clearInterval(id)
        } else {
          that.currentHeight = that.window.startHeight
          that.isScollToTop = true
          clearInterval(id)
        }
      }, 10)
    },
  },
  mounted() {
    const that: any = this;
    that.initTab();
  }
}
</script>

<style scoped>
.mainbox {
  width: 100vw;
  /*height: 100vh;*/
  position: fixed;
  bottom: 0;
}

#bottomDrag {
  width: 100vw;
  background-color: lightgreen;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

}


</style>
