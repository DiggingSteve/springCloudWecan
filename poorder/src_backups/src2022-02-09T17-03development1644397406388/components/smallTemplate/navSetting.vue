<template>
  <div class="top">
    <div>
      <div></div>
      <div class="tabnav-right" style="margin-right:24px;">
        <div
          class="user-setting"
          v-if="system != 'priceManagement'"
          style="display: grid;grid-auto-flow: column;margin-right: 18px;"
        >
        <el-badge  :is-dot="historyData.length > 0 ? true : false" class="item">
          <i
            style="font-size:18px;cursor:pointer;"
            class="el-icon-chat-line-round push"
            @click="chat"
            title="通讯聊天"
          ></i>
        </el-badge>
         
        <div>
          <i
            style="font-size:18px;cursor:pointer;"
            class="el-icon-setting"
            @click="userSettingVisible = true"
            title="用户设置"
          ></i>
        </div>

      
        <div>
          <i
            class="el-icon-edit-outline"
            v-if="usrname == 'admin'"
            style="font-size:18px;cursor:pointer;"
            @click="ue = true"
          ></i>
        </div>

        <div>
          <i
            style="font-size:18px;cursor:pointer;"
            class="el-icon-refresh"
            @click="updateProductionVersion"
            title="更新线上版本号"
            v-if="showUpdateVersion"
          ></i>
        </div>

        </div>
        <div style="display: inline-flex;align-items: center;">
          <span class="nameBac"></span>
          <span
            style="max-width: 185px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
            >{{ usrname }}</span
          >
        </div>
        <div @click="Logout" v-if="system == 'bo'" style="cursor:pointer">
          注销
        </div>
        <i
          class="el-icon-location-outline"
          style="cursor: pointer;font-size: 18px;"
          v-if="islocal && system == 'bo'"
          title="重新登录并跳转到当前路由页;目前只在本地开发使用"
          @click="relogin"
        ></i>
        <div
          @click="$emit('backindex', true)"
          v-if="system == 'outside'"
          style="cursor:pointer"
        >
          返回首页
        </div>
      </div>
    </div>
    <transition name="el-fade-in-linear">
      <div class="contactList" v-if="showHistory">
        <div class="head">
          <span class="title">通讯</span>
          <span class="close" @click="closeHistoryDialog"> X </span>
          <span class="closeMessage" @click="closeMessage">清空未读</span>
        </div>
        <div class="listHistory">
          
              <div
            class="listHistory-item"
            v-for="(item,index) in historyData"
            :key="index"
            @click="toChatRoom(item)"
          >
          
           <el-tooltip class="item" effect="light" content="Left Center 提示文字"  placement="left" >
             <div slot="content">
               <h4>{{item.sfg}}->{{item.mdg}}</h4> <br>
               <span>委托客户: {{formDataClient(item.fid)}}</span><br>
              <span>预保件重体：{{item.ybpiece}} / {{item.ybweight}} /  {{item.ybvolume}} </span> <br>
              <span>实际件重体：{{item.ybpiece}} / {{item.ybweight}} /  {{item.ybvolume}} </span> <br>
              <span>航班号:  {{item.hbh}}</span> <br>
              <span>航班日期: {{item.hbrq}}  {{item.qfsj}}</span>
             </div>
              <div>
                      <span class="orderID">
                        {{  item.mawb !==  "" ? item.mawb : item.pono}}
                      </span>
                      <span class="content" v-html="$options.filters.formatData(item.inputConent )">  </span>
                      <span class="time">{{ item.time }}</span>
              </div>
    </el-tooltip>

               
          </div>


        </div>
      </div>
    </transition>

    <!-- 富文本编辑 -->
    <el-dialog
      width="1100px"
      top="4%"
      height="800px"
      center
      :visible.sync="ue"
      v-if="ue"
      append-to-body
      :close-on-click-modal="false"
    >
      <ue v-if="ue"></ue>
    </el-dialog>
    <userSettingComp
      :visible.sync="userSettingVisible"
      :serviceBasic="serviceBasic"
      @success="$emit('success', true)"
    >
    </userSettingComp>
    
  </div>
</template>
<script>
import ue from "@/components/templates/ue";
import userSettingComp from "@/components/templates/userSettingComp";
import { Logout,getWtxmname } from "@/api/localStorage";
import {getOrderInfo} from "@/api/order.js"
import Chat from "@/components/orderChat"


export default {
  name: "navSetting",
  components: {
    ue,
    userSettingComp,
    Chat
  },
  props: {
    system: String,
    userSetting: Object,
    serviceBasic: Array
  },
  data() {
    return {
      usrname: "",
      userSettingVisible: false,
      ue: false,
      historyData: [],
      showHistory:false,
      chatInfo:{
        roomStatus: false
      }
    };
  },
   filters: {
    //当渲染的文字超出30字后显示省略号
    formatData(value) {
      if (!value) return "";
      if(value.includes('img')){
        return '有图片消息'
      } else if (value.length > 40) {
        return value.slice(0, 20) + "...";
      }
      return value;
    }
  },

  methods: {
    Logout,
    relogin() {
      setCookie("isrelogin", 2); //2是点击重载入
      setCookie("systemTitle", document.title); //保存当前系统
      this.Logout();
    },
    async updateProductionVersion() {
      //更新线上版本号
      let confirm = await this.$confirm(
        "将更新线上版本号为当前最新版本，是否继续？",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      if (!confirm) return;

      //打包后更新版本号
      this.$axios({
        method: "post",
        url: this.$store.state.publicWebApi + `api/PubSystemVersion`,
        data: {
          system: sessionStorage.system,
          version: process.env.buildVersionNumber,
          addman: window.location.host
        },
        loading: true,
        tip: false,
        noarea: true
      })
        .then(response => {
          // console.log(response);
          if (response.data.resultstatus == 0) {
            this.$message.success(response.data.resultmessage);
          } else {
            this.$message.error("新增版本号失败");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    chat() {
      console.log("=====================");
      this.showHistory = !this.showHistory
      // this.$nextTick(() => {
      //   this.historyData = this.$store.state.pushMessageList.data;
      // });

      console.log(this.$store.state.pushMessageList.data);
    },
    closeMessage(){
      if(this.$store.state.pushMessageList.data.length > 0){
          this.$store.commit('setPushMessage',{type:'clear'});
      }
      
    },
    toChatRoom(row){
      console.log(row)
      this.showHistory = !this.showHistory
      this.$store.commit('setPushMessage',{id:row.boguid})
      getOrderInfo(row.boguid).then(res => {
          if(res.data){

            this.$store.commit('setChat',{status:true,data:res.data})
          }


        })
        .catch(errors => {});
     
    },
    closeHistoryDialog(){
      this.showHistory = false;
    },
    formDataClient(fid){
      return getWtxmname(fid,1)
    }
    // formatData(row){
    //   console.log(2222222)
    //   if(row.includes('img')){
    //     return '有图片消息'
    //   } else if() {
    //     return row
    //   }
    // }
  },
  mounted() {
    console.log(this.historyData)
    this.usrname =
      sessionStorage.system == "outside"
        ? sessionStorage.out_uname
        : localStorage.getItem("usrname");
  },
  computed: {
    showUpdateVersion() {
      return (
        this.projectIsWecan &&
        process.env.buildVersionNumber &&
        process.env.NODE_ENV == "production" &&
        sessionStorage.system != "priceManagement" &&
        localStorage.usrname == "admin"
      );
    },
    islocal() {
      return window.location.hostname == "localhost";
    }
  },
  watch: {
    userSettingVisible() {
      this.$emit("update:userSetting", { ...this.$store.getters.userSetting });
    },
    '$store.state.pushMessageList.data'(val){
      if(val.length > 0){

this.$nextTick(() => {
        this.historyData = this.$store.state.pushMessageList.data;
      });
      }
      
    }
  }
};
</script>
<style scoped lang="less">
.top {
  width: 350px;
  position: absolute;
  right: 0px;
  

  > div {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 48px;
    line-height: 48px;
    text-align: left;
    font-weight: 999;
    text-indent: 15px;
    color: #333;
  }

  /deep/.el-badge__content {
    padding: 0 !important;
    width: 10px;
    height: 10px;
    text-indent: 0em;
    line-height: 18px;
    border-radius: 18px;
  }

  /deep/.el-badge__content.is-fixed {
    top: 8px;
  }
  .contactList {
    width: 380px;
    height: 346px;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 100px;
    top: 54px;
    padding: 0px 16px;
    border: 1px solid none;
    border-radius: 8px;
    cursor: pointer;
    z-index: 999999999999 !important;
    -moz-box-shadow: 2px 2px 10px #333333;
    -webkit-box-shadow: 2px 2px 10px #333333;
    box-shadow: 2px 2px 10px #333333;
    .head {
      width: 100%;
      height: 16px;
      line-height: 16px;
      margin: 16px 0px;
      display: flex;
      flex-direction: column;
      position: relative;
      .title {
        width: 80px;
        font-weight: bold;
        font-size: 12px;
        color: #222222;
      }
      .close {
        width: 40px;
        font-weight: bold;
        font-size: 12px;
        color: #d8d8d8;
        // color: red;
        position: absolute;
        right: 14px;
      }
      .closeMessage{
        width: 80px;
        height: 24px;
        line-height: 24px;
        color: rgb(122, 122, 122);
        background: #F8F8F8 ;
        position: absolute;
        right: 75px;
        font-size: 12px;
        border-radius: 8px;
      }
    }
    .listHistory {
      width: 100%;
      height: 300px;

      overflow-y: scroll; //超出高度滚动
      scrollbar-width: none;
      .listHistory-item {
        width: 100%;
        height: 58px;
        display: flex;
        flex-direction: column;
        padding: 5px 0px;
        border-bottom: 1px solid #b8b8b829;
        position: relative;
        cursor: pointer;
        .orderID {
          width: 186px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow:ellipsis;
          font: normal normal normal 14px/17px Helvetica;
          font-weight: bold;
          color: #0f5a8c;
          margin: 3px 0px;
          position: absolute;
          top: 0px;
          left: 0px;
        }
        .content {
          width: 339px;
          font: normal normal normal 14px/17px Helvetica;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 3px 0px;
          position: absolute;
          top: 26px;
          left:-4px;
        }
        .time {
          width: 150px;
          position: absolute;
          top: 0px;
          left: 174px;
          color: #999999;
          font-weight: bold;
          font: normal normal normal 14px/17px Helvetica;
        }
      }
    }
    .listHistory::-webkit-scrollbar {
      display: none; //谷歌隐藏滚动条
    }
  }
}

.tabnav-right {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  // background: #fff;
}

.nameBac {
  background: url("../../../boStatic/images/usrname.png");
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: -4px;
  margin-right: 10px;
  background-size: 16px 16px;
}
</style>

