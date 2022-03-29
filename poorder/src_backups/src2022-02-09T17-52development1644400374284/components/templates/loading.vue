<template>
  <transition name="fade">
    <div class="loading" v-show="loadding">
      <div class="container">
        <img src="boStatic/images/loading_logo.png" alt="" v-if="projectIsWecan">
        <div class="load-c">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      intervalID: 0
    }
  },
  methods: {
    
  },
  computed:{
    loadding(){
      return this.$store.state.showloading
    }
  }

}
</script>

<style lang="less" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.loading {
  position: fixed;
  z-index: 99999;
  background: rgba(0,0,0,.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .container {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    background: transparent;
    border-radius: 10px;
    .load-c {
      margin: 10px auto 0;
      width: 80px;
      text-align: center;
    }
    .load-c > div {
      width: 8px;
      height: 8px;
      margin: 0 1.4px;
      background-color: #fff;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
      animation: bouncedelay 1.4s infinite ease-in-out;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
    .load-c .bounce1 {
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }
    .load-c .bounce2 {
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
    }
  }
}
@-webkit-keyframes bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0.0) }
  40% { -webkit-transform: scale(1.0) }
}
@keyframes bouncedelay {
  0%, 80%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 40% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
