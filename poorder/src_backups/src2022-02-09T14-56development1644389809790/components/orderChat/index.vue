<template>
  <div>
    <!-- :style="width:fullStatus === true? 84+'vw': 900+'px';height: fullStatus === true? 91+'vh' : 600+'px';top:fullStatus === true? -52+'vh'" -->
     
    <transition name="el-fade-in-linear" :duration="4000">
      <div
        class="chat-container"
        v-drag
        :style="{
          width: fullStatus === true ? 1631 + 'px' : 900 + 'px',
          height: fullStatus === true ? 844 + 'px' : 600 + 'px',
          top: fullStatus === true ? 7 + 'vh' : 25 + 'vh',
          left: fullStatus === true ? 14 + 'vw' : 25 + 'vw',
          display: windowStatus === true ? 'none' : ''
        }"
      >
        <div
          class="left-concat"
          :style="{ width: fullStatus === true ? 180 + 'px' : 200 + 'px' }"
        >
          <Concat @toParent="innerHtmlToChat" />
        </div>
        <div
          class="right-chatRoom"
          :style="{ width: fullStatus === true ? 1451 + 'px' : 700 + 'px' }"
        >
          <ChatRoom
            @fullScreen="getFullStatus"
            @closeWindow="close"
            ref="chatRoom"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Concat from "./concat.vue";
import ChatRoom from "./chatRoom.vue";
export default {
  name: "chatRoom",
  props: {
    //订单信息
    orderInfo: Object
  },
  components: {
    Concat,
    ChatRoom
  },
  provide() {
    return {
      orderFormInfo: this.orderInfo //订单数据
    };
  },
  data() {
    return {
      fullStatus: null,
      windowStatus: null
    };
  },
  methods: {
    innerHtmlToChat(data) {
      this.$refs.chatRoom.$refs.inputConents.innerHTML += `&nbsp;@&nbsp;${data.logname}`;
      this.$refs.chatRoom.contactList.push({
        logname: data.logname
      });
      console.log(this.$refs.chatRoom);
    },
    getFullStatus(status) {
      console.log(status);
      if (status === true) {
        this.fullStatus = true;
      } else {
        this.fullStatus = false;
      }
    },
    close(status) {
      console.log(status);
      if ((status = true)) {
        this.windowStatus = true;
      } else {
        this.windowStatus = false;
      }
    },
    getHistoryChatData(){
      console.log("-----------------------------------");
      console.log(this.$store.state.chatStore.data.guid)
      console.log(this.$store.state.chatStore.data.boguid )
      console.log("-----------------------------------");
    this.$websoketGlobal.ws.send(
      JSON.stringify({
        boguid:
          this.$store.state.chatStore.data.boguid ||
          this.$store.state.chatStore.data.jobid,
        guid:
          this.$store.state.chatStore.data.guid ||
          this.$store.state.chatStore.data.hpoguid,
         czman: localStorage.getItem("usrname"),
         logExtraData: this.$store.state.logExtraDataForBuild,
        messagetype: "historymessage"
      })
    );
    }
  },
  watch: {
    "$store.state.chatStore.data"(val){
      this.getHistoryChatData()
    },
  },
  mounted() {
    console.log(this.$store.state.chatStore.data)
    console.log(this.orderInfo)
    this.getHistoryChatData()
  }
};
</script>

<style lang="less" scoped>
.chat-container {
  background: white;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  // position: relative;
  // left: 20vw;
  z-index: 9999;
  -moz-box-shadow: 2px 2px 20px #333333;
  -webkit-box-shadow: 2px 2px 20px #333333;
  box-shadow: 2px 2px 20px #333333;
  .left-concat {
    height: 98%;
    overflow-y: scroll; //超出高度滚动
    scrollbar-width: none;

    // margin: 1% 1%;
    background: #f4f5f5;
  }
  .left-concat::-webkit-scrollbar {
    display: none; //谷歌隐藏滚动条
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .left-concat::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .left-concat::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  .left-concat::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #c8c8c8;
  }
  .right-chatRoom {
    width: 694px;
    height: 100%;
    border: 1px solid rgb(209, 204, 204);
  }
}
</style>
