<template>
  <div ref="main">
    这里是测试首页
  </div>
  <div class="bottombox">
    <input type="text" name="chanHei" id="chanHei" ref="chanHei">
    <button @click="changeHeight()">变更高度</button>

    <var-space :size="[20, 20]">
      <var-button @click="changeHeightInput(20)"  color="black">抽屉弹出</var-button>

      <var-button @click="changeHeightInput(0)" color="black">抽屉收回</var-button>
    </var-space>
    <bottom-drag-move ref="bottomDragMoveV2">

      　　在这种困难的抉择下，本人思来想去，寝食难安。 罗曼·罗兰在不经意间这样说过，只有把抱怨环境的心情，化为上进的力量，才是成功的保证。这句话语虽然很短，但令我浮想联翩。
      所谓一个工具箱，关键是一个工具箱需要如何写。 要想清楚，一个工具箱，到底是一种怎么样的存在。 本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。
      一个工具箱，到底应该如何实现。 经过上述讨论一个工具箱的发生，到底需要如何做到，不一个工具箱的发生，又会如何产生。
      生活中，若一个工具箱出现了，我们就不得不考虑它出现了的事实。 既然如何， 经过上述讨论那么， 一个工具箱，发生了会如何，不发生又会如何。
      培根曾经说过，要知道对好事的称颂过于夸大，也会招来人们的反感轻蔑和嫉妒。带着这句话，我们还要更加慎重的审视这个问题：
      经过上述讨论歌德在不经意间这样说过，读一本好书，就如同和一个高尚的人在交谈。带着这句话，我们还要更加慎重的审视这个问题：
      问题的关键究竟为何? 我认为， 卡莱尔在不经意间这样说过，过去一切时代的精华尽在书中。带着这句话，我们还要更加慎重的审视这个问题：
      问题的关键究竟为何? 而这些并不是完全重要，更加重要的问题是， 一个工具箱，发生了会如何，不发生又会如何。 既然如何，
      笛卡儿在不经意间这样说过，读一切好书，就是和许多高尚的人谈话。这句话语虽然很短，但令我浮想联翩。
      莎士比亚在不经意间这样说过，人的一生是短的，但如果卑劣地过这一生，就太长了。我希望诸位也能好好地体会这句话。
      本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 既然如何， 既然如此， 现在，解决一个工具箱的问题，是非常非常重要的。
      所以， 歌德在不经意间这样说过，决定一个人的一生，以及整个命运的，只是一瞬之间。带着这句话，我们还要更加慎重的审视这个问题：
      所谓一个工具箱，关键是一个工具箱需要如何写。 一个工具箱因何而发生?我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。
      一个工具箱，发生了会如何，不发生又会如何。 了解清楚一个工具箱到底是一种怎么样的存在，是解决一切问题的关键。
      我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 问题的关键究竟为何? 一个工具箱因何而发生?在这种困难的抉择下，本人思来想去，寝食难安。
      本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 一般来讲，我们都必须务必慎重的考虑考虑。 一个工具箱，发生了会如何，不发生又会如何。
      一般来讲，我们都必须务必慎重的考虑考虑。 生活中，若一个工具箱出现了，我们就不得不考虑它出现了的事实。
      一个工具箱，发生了会如何，不发生又会如何。
    </bottom-drag-move>
  </div>
</template>

<script>

// import BottomDragMove from "../components/bottomDragMove/bottomDragMove.vue";
import BottomDragMove from "../components/bottomDragMove/bottomDragMoveV2.vue";





export default {
  name: "home",
  components: {BottomDragMove},
  data() {
    return {};
  },
  methods: {
    changeHeightInput(height) {
      let bottomDragMove = this.$refs.bottomDragMoveV2;
      bottomDragMove.changeDragHeight({height:height})
    },
    changeHeight() {
      let height=this.$refs.chanHei.value;
      console.log(height);
      let bottomDragMove = this.$refs.bottomDragMoveV2;
      bottomDragMove.changeDragHeight({height: parseInt(height)})
    },
  },
  mounted() {


  }
}
</script>

<style scoped>
.bottombox {
  width: 100vw;
}

.text {
  margin: 5vw;
}
</style>
