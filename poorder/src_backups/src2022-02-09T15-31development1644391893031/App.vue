<template>
  <div id="app" :style="{'filter':againShow?'blur(5px)':''}">
    <router-view></router-view>
    <loading></loading>

    <el-dialog
      :title="searData.title"
      :visible.sync="mainSearch"
      v-if="mainSearch"
      width="90%"
      top="2%"
      :close-on-press-escape="false"
      :modal="true"
      append-to-body
      :fullscreen="true"
      @close="close('1')"
      center
    >
      <new-order-add
        :boguid="searData.boguid"
        pagetype="2"
        :visible.sync="mainSearch"
        v-if="searData.ordertype == 2"
        frompage="3"
      ></new-order-add>

      <mawbaddput
        :visible.sync="mainSearch"
        :mawbguid="searData.mawbguid"
        v-else
        :boguid="searData.boguid"
        :area="searData.area"
        :orderdom="searData.orderdom"
        :pagetype="searData.pagetype"
      ></mawbaddput>
    </el-dialog>

    <!-- 客服费用 -->
    <el-dialog
      :title="customeData.title"
      :visible.sync="customeData.show"
      v-if="customeData.show"
      width="90%"
      top="2%"
      :close-on-press-escape="false"
      :modal="true"
      append-to-body
      :fullscreen="true"
      @close="close('2')"
      center
    >
      <costMaking
        :visible.sync="customeData.show"
        :mawbguid="customeData.mawbguid"
        :boguid="customeData.boguid"
        :area="customeData.area"
        :showSuggestWage="customeData.showSuggestWage"
        :pagetype="customeData.pagetype"
        :costDom="customeData.costDom"
        :switchHxKh="false"
      ></costMaking>
    </el-dialog>

    <!-- 航线费用 -->

    <el-dialog
      :title="airLineSearchData.title"
      :visible.sync="airLineSearchData.show"
      v-if="airLineSearchData.show"
      width="90%"
      top="2%"
      :close-on-press-escape="false"
      :modal="true"
      append-to-body
      :fullscreen="true"
      @close="close('3')"
      center
    >
      <airPlanDetail
        :visible.sync="airLineSearchData.show"
        :boguid="airLineSearchData.boguid"
        :activeTab="airLineSearchData.activeTab"
        :switchHxKh="false"
        :pagetype="'watch'"
      ></airPlanDetail>
    </el-dialog>

        <!-- append-to-body -->
      <el-dialog
        :visible.sync="againShow"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        width="320px"
        top="8%"
        custom-class="againDialog"
        style="background:rgba(6,22,32,.9)"
        >
        <div class="topIcon">
          <i class="el-icon-lock"></i>
        </div>
        <p class="textFirst">
          安全模式启用
        </p>
        <p class="textSecond">
          {{logname}}
        </p>

        <div class="inputGroup">
           <input placeholder="请输入登录密码解锁" @keyup.enter="relogin" type="password" v-model="rePassword">
           <i class="el-icon-arrow-right" style="font-size:16px;color:#333;cursor:pointer;" @click="relogin"></i>
        </div>
        
        
      </el-dialog>
    </div>
</template>

<script>
import { Logout, setHtmlHead } from "./api/localStorage.js";
import costMaking from "./components/orderDetails/costMaking";
import airPlanDetail from "./components/orderDetails/airPlaneDeatil";
import { getOrderInfo } from "@/api/order.js";
import{queueKey,SystemMessage} from './store/systemMessage';
export default {
  name: "app",

  data() {
    return {
      rePassword:'',
    };
  },
  components: {
    costMaking,
    airPlanDetail

  },
  methods: {
    close(type) {
      switch (type) {
        case "1":
          this.$store.state.mainSearch = false;
          break;
        case "2":
          this.$store.state.customeData.show = false;
          break;
        case "3":
          this.$store.state.airLineSearchData.show = false;
          break;
      }
    },
    getToChat(row) {
      getOrderInfo(row.boguid)
        .then(res => {
          if (res.data) {
            this.$store.commit("setChat", { status: true, data: res.data });
          }
        })
        .catch(errors => {});
    },
    initWebsoket() {
      const that = this 
  
      if ("WebSocket" in window) {
        // console.log("您的浏览器支持 WebSocket!");
        // location.host
        const logname = localStorage.getItem("usrname");
        if (logname && logname.length > 0) {
          that.ws = new WebSocket(
            `ws://${that.$store.state.websocketApi}/websocket?logname=${logname}`
          );
          that.$websoketGlobal.setWs(that.ws);
          that.$websoketGlobal.ws.onopen = function() {
            console.log("websocket连接成功");
          };


    that.$websoketGlobal.ws.onmessage = res => {
      
      const result = JSON.parse(res.data);
      console.log(result.resultdata.messagetype === "jobinfomessage")
      console.log(111111,result)
      // 关闭安全模式
     
      if (result.resultdata.pushtype === "call"  ) {
        if (result.resultdata.messagetype === "nodemessage" ||result.resultdata.messagetype === "textmessage") {
          let showTitle = null;
          let showContent = null;
          if (result.resultdata.messagetype === "nodemessage") {
            showTitle = `${
              result.resultdata.mawb !== ""
                ? `${result.resultdata.mawb}`
                : `${result.resultdata.pono}`
            } 节点更新`;
            showContent = `<p>系统：${result.resultdata.inputConent}<span style="color:#0066ff;cursor:pointer">查看</span></p>`;
          } else if (result.resultdata.messagetype === "textmessage") {
            console.log(result.resultdata);
            showTitle = `${
              result.resultdata.mawb !== ""
                ? `${result.resultdata.mawb}`
                : `${result.resultdata.pono}`
            } 有新的消息`;
            showContent = `<p>${result.resultdata.loginName}：${result.resultdata.inputConent}<span style="color:#0066ff;cursor:pointer">查看</span> 
</p>`;
          }
          const notify = that.$notify({
            title: showTitle,
            dangerouslyUseHTMLString: true,
            message: showContent,
            position: "bottom-right",
            type: "success",
            duration: 4000,
            customClass: "notify-contact "
          });

          notify.$el.querySelector("span").onclick = () => {
            // your code
            that.getToChat(result.resultdata);
            // 点击后关闭notify 不需要的话可删掉
            notify.close();
          };

          // 右上角历史列表增加
          that.$store.commit("setPushMessage", {
            type: "add",
            data: result.resultdata
          });


            if(that.$store.state.chatStore.data.boguid === result.resultdata.boguid) {
            // 聊天室数据增加    聊天历史数据 新增加发送的数据
              that.$store.commit("setWebsoketPushChatData", {
                obj: result.resultdata
              });
            }
        }else if(result.resultdata.messagetype == "againShow"){
          that.$store.commit('setAgainShow',false)
        }
      } else if (result.resultdata.messagetype === "historymessage") {
        // 获取聊天室   历史数据
        that.$store.commit("setWebsoketPushChatData", {
          data: result.resultdata.datalist
        });
      }  else if(result.resultdata.messagetype === "bufferpercent"){
        return false
      }else if(result.resultdata.messagetype === "historyjoblistmessage"){
        console.log("未读 订单历史记录")
        console.log(result.resultdata.joblist)
        result.resultdata.joblist != "" ?  that.$store.commit('setreadMessageList',{status:'add',data:result.resultdata.joblist}) : console.log(this.$store.state.readMessageList)
      } else if(result.resultdata.messagetype === "jobinfomessage"){ 
          console.log("执行了---------------jobinfomessage ")
          
          that.$store.commit('setreadMessageList',{status:'addOne',guid:result.resultdata.guid}) 
      }else {

          // 聊天室  历史数据 新增加发送的数据
          that.$store.commit("setWebsoketPushChatData", {
            obj: result.resultdata
          });
      
      }
    };


          that.$websoketGlobal.ws.onclose = function() {
      
            //断线重新连接'
            that.$websoketGlobal.ws = null
            setTimeout(() => {
              that.initWebsoket();
            }, 2000);
          };
        }
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
        that.openNotificationWithIcon(
          "error",
          "浏览器",
          "您的浏览器不支持显示消息请更换",
          1,
          1
        );
      }
    },
    relogin(){
      if(!this.rePassword){
        return this.$message.error('请输入您的密码')
      }
      let login_data = {
          usrname:localStorage.usrname,
          pwd: this.rePassword,
      }
       var api = sessionStorage.system !='outside'? 'api/UserLogin' : 'api/User'
       var publicWebApi=sessionStorage.system !='outside'? this.$store.state.publicWebApi : this.$store.state.publicWebApi.replace('PublicWebApi', 'outsidewebapi')
      if (api == 'api/User') {
        login_data.usrtype = 2
      }
      this.$axios({ method: 'get', url: publicWebApi + api, params: login_data, loading: true, tip: true })
       .then(result => {
          if (result.data.resultstatus == 0) {
            this.$message.success('已解锁')
            this.$websoketGlobal.ws.send(JSON.stringify({
              messagetype: "againShow",
              calllist:[{"logname":localStorage.usrname}]
            }));
            this.$store.commit('setAgainShow',false)
            this.rePassword=""
            return
          }else{
            this.$message.error(result.data.resultmessage)
          }
       })
    }
  },
  mounted: function() {
    //刷新既重新登录
    if (sessionStorage.getItem("nav") && localStorage.usrname) {
      Logout();
    }
    this.initWebsoket();

  },
  provide: {},
  created() {
    var self=this;
    setHtmlHead(this.projectIsWecan);
    window.opener.queueObj.boState["isOpen"]=true;
    var gotoNav= window.opener.queueObj.boState["gotoNav"]
    if(gotoNav){
       let data=JSON.parse(sessionStorage.nav).filter(i=>i.auturl==gotoNav+".vue")[0]
      self.$router.push({ name:gotoNav, params: { id: data.id}})
    }
    window.opener.queueObj.subscribe(queueKey.gotoNav,"app",function(d){
        let data=JSON.parse(sessionStorage.nav).filter(i=>i.auturl==d+".vue")[0]
      self.$router.push({ name:d, params: { id: data.id}})
    });
  },
  computed: {
    mainSearch: {
      get() {
        return this.$store.state.mainSearch;
      },
      set() {}
    },
    searData: {
      get() {
        console.log(this.$store.state.searchData);
        return this.$store.state.searchData;
      },
      set() {}
    },
    airLineSearchData: {
      get() {
        return this.$store.state.airLineSearchData;
      },
      set() {}
    },
    customeData: {
      get() {
        //console.log(this.$store.state.searchData);
        return this.$store.state.customeData;
      },
      set() {}
    },
    againShow:{
      get(){
        console.log(this.$store.state.againShow)
        return this.$store.state.againShow
      },
      set(){

      }
    },
    logname(){
      return localStorage.usrname
    }
  },

  watch: {
    // '$store.state.openedWindows':{
    //    handler(val){
    //      console.log(val[0]['document']['title'])
    //      val.forEach(windowD=>{
    //         windowD.addEventListener('setItemEvent', (e)=> {
    //             if(e.key=='againShow'){
    //               this.againShow=e.newValue
    //             }
    //             console.log(e)
    //         })
    //      })
           
    //    },
    //    deep:true
    // }
  }
};
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}

//布局
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-around {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

//内容
.main-right-content {
  input {
    font-size: 12px !important;
  }

  .el-button {
    font-size: 12px !important;
  }

  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.tableFieldConfig .el-input__inner {
  height: 28px;
  line-height: 28px;
  padding: 0 8px;
}

.page-container-box input {
  height: 28px;
}

.page-container-box .el-input__inner {
  height: 28px !important;
  line-height: 28px !important;
  width: 100%;
  padding: 0 8px;
}

.el-input__suffix {
  right: 1px;
  display: flex;
  align-items: center;
}

.sel-title {
  display: inline-block;
}

.el-select-dropdown__empty {
  padding: 10px 15px;
}

.el-textarea__inner {
  //  min-height:65px;
  min-height: 33px;
  font-size: 12px;
}

.el-select input {
  height: 28px !important;
}

.el-select__tags {
  overflow: hidden;
  max-height: 28px;
}

.el-select .el-select__tags > span {
  display: flex;
}

.el-select__tags span {
  display: flex;
}

.el-tag .el-icon-close {
  top: 5px;
}

.width100 {
  width: 100% !important;
  min-width: 560 !important;
  max-width: 560 !important;
  display: flex;
  align-items: center;
}

.allwidth {
  width: 100% !important;
}

.widthfix(@num) {
  width: @num !important;
  min-width: @num !important;
  max-width: @num !important;
}

.width200 {
  .widthfix(200px);
}

.width250 {
  .widthfix(250px);
}

.width579 {
  .widthfix(579px);
}

.width289 {
  .widthfix(289px);
}

.width400 {
  .widthfix(400px);
}

.width350 {
  .widthfix(350px);
}

.width305 {
  .widthfix(305px);
}

.width25 {
  width: 25% !important;
  max-width: 320px;
}

.page-container-box {
  margin-bottom: 8px;
}

.page-container-box h2 {
  height: 32px;
  line-height: 32px;
  text-indent: 5px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  font-size: 16px;
  color: #444;
}

.page-container-box h3 {
  color: #0f5a8c;
  margin-bottom: 5px;
}

.page-container-main {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.page-tab-checkbox .el-checkbox {
  min-width: 110px;
}

.el-tab-pane {
  padding: 0px 20px;
}

.el-date-editor--daterange.el-input {
  width: 100%;
}

.el-dialog--small {
  width: auto;
  min-width: 400px;
  padding: 0 30px;
}

.el-table {
  border: 0px solid #ccc;
  width: auto;
  table-layout: fixed;
  word-break: break-all;
}

table {
  border-collapse: collapse;
  border-spacing: 0px;
  padding: 0px;
  margin: 0px;
  // table-layout:fixed;word-break:break-all;
  white-space: nowrap;
}

.el-radio + .el-radio {
  // margin-left:16px;
}

.el-radio {
  margin-right: 20px;
}

.el-table .cell {
  white-space: nowrap;
}

.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: auto;
}

.el-radio__inner {
  width: 14px;
  height: 14px;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #0f5a8c;
  background: #0f5a8c;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #0f5a8c;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #0f5a8c;
  background: #0f5a8c;
}

.el-input__inner {
  line-height: 28px;
  height: 28px;
  padding: 0 8px;
}

//.el-select .el-input .el-select__caret{line-height:0}
.el-date-editor .el-range__icon {
  line-height: 8px;
}

.el-date-editor .el-input__icon {
  line-height: 8px;
}

.el-date-editor .el-range-separator {
  line-height: 20px;
}

.searchForm {
  margin: 10px 0px;
  display: inline-block;
}

.searchForm > button,
.searchForm > button:focus {
  background-color: #0f5a8c;
  // border: 1px solid #176FA7;
  color: #fff;
  border: none;
}

.searchForm > button:hover {
  background-color: #0d4c77;
  // border: 1px solid #176FA7;
  color: #fff;
  border: none;
}

.searchForm > button.is-disabled {
  background-color: #c8c9cc;
  color: #fff;
  border: none;
}

.searchForm > button.is-disabled:hover {
  background-color: #c8c9cc;
  color: #fff;
  border: none;
}

@media screen and(max-width:1800px) {
  .seizeSeat {
    display: none !important;
  }
}

.el-date-editor .el-range-separator {
  width: auto;
}

.el-date-editor .el-range__close-icon {
  line-height: 20px;
}

.el-popper[x-placement^="bottom"] {
  margin-top: 6px;
}

.el-button {
  padding: 8px 20px;
}

.el-button--default,
.el-button--default.is-active,
.el-button--default:active,
.el-button--default:focus {
  color: #0f5a8c;
  border: 1px solid #e8e8e8;
  //border:none
}

.el-button--default:hover {
  background: #f8f8f8;
  color: #0f5a8c;
  border: 1px solid #e8e8e8;
  //border:none
}

.el-button--primary,
.el-button--primary.is-active,
.el-button--primary:active,
.el-button--primary:focus {
  background: #0f5a8c;
  border: none;
  color: #fff;
}

.el-button--success,
.el-button--success.is-active,
.el-button--success:active,
.el-button--success:focus {
  background: #519d1a;
  border: none;
}

.el-button--primary:hover {
  background: #0d4c77;
  border: none;
  color: #fff;
}

.el-button--primary.is-disabled,
.el-button--primary.is-disabled:active,
.el-button--primary.is-disabled:focus,
.el-button--primary.is-disabled:hover {
  background-color: #ccc;
  border: none;
}

.el-button--success:hover {
  background: #418013;
  border: none;
}

.el-checkbox__inner {
  border: 1px solid #ccc;
}

.el-select .el-tag__close.el-icon-close {
  top: 4px;
}

.input-content .el-date-editor.el-input {
  width: 100%;
}

.icon-save {
  width: 16px;
  height: 16px;
  background: url(./icon/save.png);
  display: inline-block;
}

.icon-user {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/loginman.png) no-repeat;
  display: inline-block;
}

.icon-yzm {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/yzm.png) no-repeat;
  display: inline-block;
}

.icon-mm {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/mm.png) no-repeat;
  display: inline-block;
}

.icon-artificial {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/artificial.png) no-repeat;
  display: inline-block;
}

.icon-cancelIgnore {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/cancelIgnore.png) no-repeat;
  display: inline-block;
}

.icon-ignore {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/ignore.png) no-repeat;
  display: inline-block;
}

.icon-send {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/send.png) no-repeat;
  display: inline-block;
}

.icon-temporStorage {
  width: 16px;
  height: 16px;
  background: url(../boStatic/images/temporStorage.png) no-repeat;
  display: inline-block;
}

.icon-peihuo {
  width: 22px !important;
  height: 16px;
  background: url(../boStatic/images/peihuo.png) no-repeat;
  display: inline-block;
}

.icon-cancelPeihuo {
  width: 22px !important;
  height: 16px;
  background: url(../boStatic/images/cancelPeihuo.png) no-repeat;
  display: inline-block;
}

.icon-peidanO {
  width: 22px !important;
  height: 16px;
  background: url(../boStatic/images/peidanO.png) no-repeat;
  display: inline-block;
  background-position: center;
}

.icon-peidanN {
  width: 22px !important;
  height: 16px;
  background: url(../boStatic/images/peidanN.png) no-repeat;
  display: inline-block;
  background-position: center;
}

//等分布局
.showpanediv {
  //  background-color:#FFFDF1;
  padding: 10px 15px 4px;
  margin-bottom: 10px;
  border: 1px solid #e8e8e8;
}

.showpaneinfo {
  display: flex;
  width: 800px;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  div {
    display: flex;
    // flex: 1;
    width: 25%;
    margin-bottom: 7px;

    span {
      display: flex;
      align-items: center;
      margin-right: 10px;
      white-space: nowrap;
    }
  }
}

.showpanediv > div {
  span:nth-child(1) {
    display: inline-block;
    min-width: 110px;
    text-align: right;
  }

  span:last-child {
    display: inline-block;
    width: auto;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #009900;
  }

  span.color-red {
    color: red;
  }
}

.content .el-tabs__content {
  overflow: visible;
}

input[disabled] {
  background: #f0f0f0 !important;
}

.el-input.is-disabled .el-input__inner {
  color: #999;
}

.el-table td,
.el-table th {
  padding: 6px 0px;
}

.el-select-dropdown__item {
  height: 26px;
  line-height: 26px;
}

.el-form-item {
  margin-bottom: 0px;
}

//禁用样式
.disabled {
  cursor: not-allowed !important;
  input {
    border-color: #e4e7ed !important;
    color: #999;
    background: #f0f0f0;

    i {
        cursor: not-allowed !important;
        pointer-events: none;
    }
  }

  button {
    pointer-events: none;
  }

  table {
    pointer-events: none;
    cursor: none;
  }

  .el-input__suffix-inner {
    pointer-events: none;
  }

  div {
    pointer-events: none;
  }
}

.disabled > div {
  pointer-events: none;
}

.tdDisabled {
  pointer-events: none;
  cursor: not-allowed !important;
}

td .disabled {
  cursor: not-allowed;
  //pointer-events: none
}

.input-required .inputGroup {
  .input-item {
    background: #fff8ef;
  }
}

.contentDisabled {
  .inputGroup {
    background-color: #f0f0f0;
  }
}

.input-required input {
  background: #fff8ef;
}

.notrequired input {
  background: #fff;
}

.input-required .el-date-editor--daterange {
  /*border: none;
    box-shadow: 0px 0px 1px 1px #fda8a8;*/
  border: 1px solid #fda8a8;
}

.input-required .el-range-input {
  box-shadow: none;
}

//费用标题样式
.sanjiao {
  width: 150px;
  border-bottom: 30px solid;
  position: relative;
  top: 0px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
  color: #fff;
  text-indent: 12px;
  font-size: 14px;
}

.test(@color) {
  border: 1px solid #fff !important;

  .sanjiao {
    border-bottom-color: @color;
  }

  .detail-title p {
    &:extend(.sanjiao);
    border-bottom-color: @color;
  }

  .detail-c {
    border: 1px solid @color;
    padding: 14px 10px;
  }
}

.detailPaneBlue {
  .test(#0f5a8c);
}

.detailPaneRed {
  .test(red);
}

.detailPaneYoung {
  .test(#00cc00);
}

.el-form-item {
  margin-bottom: 0px;
}

.el-dialog__header {
  padding-top: 15px;
  padding-bottom: 0px;
}

.el-dialog--center .el-dialog__body {
  padding: 15px;
}

.dialogPage {
  //详细页弹窗
  z-index: 2002;
  display: inline;
  width: calc(100% - 330px);
  left: auto;
  right: 44px;
  min-width: 1300px;
  background: #fff;
  box-shadow: 0px 0px 40px #000;
  position: fixed;
  top: 60px;
  overflow: auto;
  border-radius: 4px;
  margin: 0 auto;
  bottom: inherit;
  max-height: 92%;
  height: 100%;

  .el-dialog {
    margin: 0px;
    box-shadow: none;
  }

  .el-dialog__header {
    padding-top: 10px;
    padding-bottom: 0px;
  }

  .el-dialog__headerbtn {
    top: 10px;
    font-size: 22px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    font-size: 22px;
    font-weight: 600;
  }

  .el-dialog--center {
    margin: auto;
  }

  .el-dialog__body {
    padding: 20px 25px 30px;
    padding-bottom: 40px;
  }
}

@media screen and(max-width:1800px) {
  .dialogPage {
    width: auto;
    left: 44px;
  }
}

@media screen and(min-width:1677px) {
  .zhanwei {
    display: inline-block;
  }
}

@media screen and(max-width:1676px) {
  .farePane {
    width: 880px;
  }

  .zhanwei {
    display: none;
  }
}

@media screen and(max-width:1300px) {
  .dialogPage {
    width: 100%;
    left: 0px;
    right: 0px;
  }
}

.backtop {
  position: fixed;
  bottom: 2%;
  visibility: hidden;
  display: block;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
  background: url("../boStatic/images/backtop.png");
  background-size: 36px 36px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  z-index: 3000;
}

.el-badge__content {
  height: 16px;
  line-height: 15px;
  padding: 0 6px;
  border: none;
  border-radius: 20px;
}

.el-radio__input.is-disabled + span.el-radio__label {
  color: #606266;
}

.poczColor {
  color: #1a7dbf;
  cursor: pointer;
}

.redColor {
  color: red;
  cursor: pointer;
}

.el-tabs__item.is-active,
.el-tabs__item:hover,
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active,
.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #0f5a8c;
}

.el-tabs__active-bar {
  background: #0f5a8c;
  height: 3px;
}

.costDetail {
  min-width: 1234px;
  margin: 0 auto;
}

//.el-scrollbar__wrap{max-height:720px;}
.input-required textarea {
  // border:1px solid #F7CBCB;
  background-color: #fff8ef;
}

.dropdown-wrapper-box::-webkit-scrollbar-thumb {
  background-color: #b8babd;
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.el-message {
  top: 45% !important;
}

.tableTotalDiv {
  width: 100%;
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.totalInfo {
  min-height: 60px;
  height: 60px;
  display: flex;
  background-color: #fffdf1;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  margin-bottom: 14px;
  justify-content: flex-start;

  > div {
    width: auto;
    width: 260px;
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    justify-content: center;

    .totalInfo-title {
      color: #46433e;
      margin-bottom: 5px;
    }

    .totalInfo-content {
      color: #476e84;
    }
  }
}

#jzt {
  input {
    min-width: 50px !important;
  }
}

.spanDisabled {
  cursor: not-allowed;
}

.spanDisabled > i {
  pointer-events: none;
}

.spanDisabled > a {
  pointer-events: none;
}

/* @font-face {
  font-family: "方正晶宋";
  src: url("../boStatic/方正晶宋.ttf");
} */

.cargoPouchPrint {
  font-family: "方正晶宋";
}

.cargoPouch {
  width: 100%;
  height: 760px;
  position: relative;

  img {
    position: absolute;
    width: 380px;
    left: 50%;
    margin-left: -190px;
  }

  div {
    position: absolute;
    //left:50%;
    font-size: 16px;
    color: #666;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.el-tooltip__popper.is-light {
  /*     border: 1px solid #999;
    color: #666 */
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;

  .popper__arrow {
    border-bottom-color: #4ad5fc !important;
  }
}

.el-tooltip__popper.is-white {
  color: #fff;
  background-color: #999;
  border: 1px solid #999;

  .popper__arrow {
    border-bottom-color: #999 !important;
  }

  .popper__arrow::after {
    border-bottom-color: #999 !important;
  }
}

.el-select-group__title {
  color: #333;
  font-weight: 600;
}

.dialogImgDoc {
  .el-dialog__body {
    padding: 0px;
    height: calc(100% - 40px);
  }

  .el-dialog {
    height: 100%;
  }
}

.detail-title span.yqspan {
  flex: 1;
  height: 19px;
  position: relative;
}

.detail-title p.yqp {
  // width: 160px!important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  position: absolute;
  top: 4px;
  color: #666;
  display: inline-block !important;
  padding-right: 20px;
  text-indent: 0px;
  height: 16px;
  line-height: 16px;
}

.badgePopover {
  p {
    line-height: 24px;
    height: 24px;
    padding-left: 10px;
  }

  i {
    width: 10px;
    height: 10px;
    display: inline-block;
    background-color: red;
    //  border-radius: 50%;
    margin-right: 8px;
  }
}

.itabbadge {
  width: 9px;
  height: 9px;
  background-color: #fff;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  right: -3px;
  top: -6px;
}

.zipage {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.pointerAll {
  pointer-events: all !important;

  * {
    pointer-events: all !important;
  }
}

.servicePort {
  .el-tabs__item {
    padding: 0px 8px !important;
    height: auto;
  }

  .el-tabs__item:not(:first-child) {
    border: none !important;
    margin-left: 0px !important;
  }

  .is-active {
    .badgeRed {
      .red(1);
    }

    .badgeYellow {
      .yellow(1);
    }

    .badgeBlue {
      .blue(1);
    }

    .badgeGray {
      .gray(1);
    }

    .badgeGreen {
      .green(1);
    }

    .badgeRed,
    .badgeYellow,
    .badgeBlue,
    .badgeGreen,
    .badgeGray {
      color: #fff !important;
    }
  }

  .badgeLabel {
    position: relative;
    padding: 5px 20px;
    width: 100%;
    min-height: 46px;
    display: grid;
    place-items: center;
  }

  .red(@n) {
    background-color: rgba(234, 0, 0, @n) !important;
    color: rgba(234, 0, 0, 1) !important;
  }

  .badgeRed {
    .red(0.2);
  }

  .badgeRed:hover {
    .red(1);
    color: #fff !important;
  }

  .yellow(@n) {
    background-color: rgba(254, 150, 0, @n) !important;
    color: rgba(254, 150, 0, 1) !important;
  }

  .badgeYellow:hover {
    .yellow(1);
    color: #fff !important;
  }

  .badgeYellow {
    .yellow(0.2);
  }

  .blue(@n) {
    background-color: rgba(13, 121, 221, @n) !important;
    color: rgba(13, 121, 221, 1) !important;
  }

  .gray(@n) {
    background-color: rgba(121, 121, 121, @n) !important;
    color: rgba(121, 121, 121, 1) !important;
  }

  .badgeBlue:hover {
    .blue(1);
    color: #fff !important;
  }

  .badgeBlue {
    .blue(0.2);
  }

  .badgeGray:hover {
    .gray(1);
    color: #fff !important;
  }

  .badgeGray {
    .gray(0.2);
  }

  .green(@n) {
    background-color: rgba(12, 175, 0, @n) !important;
    color: rgba(12, 175, 0, 1) !important;
  }

  .badgeGreen:hover {
    .green(1);
    color: #fff !important;
  }

  .badgeGreen {
    .green(0.2);
  }
}

.commontabs {
  .active.badgeRed {
    background-color: rgba(234, 0, 0, 1) !important;
    color: #fff !important;
  }

  .active.badgeGreen {
    background-color: rgba(12, 175, 0, 1) !important;
    color: #fff !important;
  }

  .active.badgeGray {
    background-color: rgba(121, 121, 121, 1) !important;
    color: #fff !important;
  }
}

.listViewBtn {
  width: 18px;
  height: 18px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 5px;
  margin-left: 8px;
}

.detailPaneMidinfo {
  display: flex;
  //width: 800px;
  flex: 1;
  position: relative;
  height: 100%;
  justify-content: space-between;
  color: #333;
  font-weight: normal;
  // margin-left: 20px;
  // padding-left: 10px;
  align-items: center;
  border-left: 1px solid #e8e8e8;

  > div {
    display: flex;
    align-items: center;
  }

  > div:nth-child(1) {
    width: 140px;
  }

  > div:nth-child(2) {
    width: 160px;
  }

  > div:nth-child(3) {
    width: 240px;
  }

  > div:nth-child(4) {
    flex: 1;
    margin-right: 100px;
  }

  .input-item {
    margin-bottom: 0px !important;
  }

  .el-textarea__inner {
    height: 148px;
    width: 276px;
  }

  .yqdiv {
    position: absolute;
    width: 300px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    height: 200px;
    z-index: 1000;
    padding-top: 12px;
    top: 25px;

    button {
      //width:250px;
      margin-right: 11px;
      margin-top: 4px;
      float: right;
    }
  }
}

.ServiceTitlePane {
  > div {
    display: flex;
    align-items: center;
    height: 100%;
    min-width: 130px;
  }

  > div:nth-child(2) {
    flex: 1;
  }
}

.jdetail {
  position: relative;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;

  &:last-child {
    margin-bottom: 0;
  }

  > .jdetail-title {
    position: relative;
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #363636;
    background: #f8f8f8;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 5px;
  }

  .jdetail-c {
    padding: 20px;
  }
}

.el-autocomplete-suggestion li {
  padding: 0 10px;
  line-height: 26px;
}

.el-message-box__status + .el-message-box__message {
  max-height: 800px;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}

@media screen and(max-height:900px) {
  .el-message-box__status + .el-message-box__message {
    max-height: 600px;
  }
}

.reason {
  h3 {
    font-size: 18px;
    color: #004d84;
  }

  .el-dialog__body {
    padding: 8px 40px;
  }

  .orderNo {
    margin-top: 12px;
    font-size: 13px;
    margin-bottom: 8px;
  }

  ul li {
    display: inline-block;
    width: 110px;
    text-align: left;
    color: #999;
  }

  .accountNameItems {
    margin-top: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    overflow: hidden;

    p {
      height: 1px;
      border-bottom: 1px solid #e8e8e8;
      margin-top: -4px;
      width: 860px;
    }

    li {
      display: inline-block;
      cursor: pointer;
      padding-right: 16px;
      width: auto;
      font-size: 14px;

      &:hover {
        color: #004d84;
      }

      .el-badge__content.is-fixed.is-dot {
        right: 2px;
      }

      .el-badge__content.is-fixed {
        top: 3px;
        transform: translateY(-46%) translateX(100%);
      }

      .el-badge {
        vertical-align: inherit;
      }
    }
  }

  .delbillman-wrap {
    width: 800px;
    overflow: hidden;
    display: inline-block;

    .delbillmanList {
      width: 10000px;

      li {
        position: relative;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        font-size: 13px;
        cursor: pointer;
        width: 136px;
        padding: 5px 8px;
        color: #4c4c4c;
        margin-right: 29px;

        p:first-child {
          margin-bottom: 3px;

          .left {
            color: #999;
          }
        }

        .left {
          text-align: left;
        }

        .right {
          float: right;
          width: 50px;
          overflow: hidden;
          text-align: right;
        }

        .el-icon-caret-right {
          position: absolute;
          font-size: 18px;
          right: -25px;
          top: 15px;
          color: #606266;
        }

        &.active {
          background: #004e82;
          border-color: #004e82;
          color: #fff;

          p:first-child {
            .left {
              color: #fff;
            }
          }
        }

        &:last-child {
          .el-icon-caret-right {
            display: none;
          }
        }
      }
    }

    + .arrow {
      margin-top: 16px;
    }
  }

  .accountNameItems,
  .accountNameItemsContent {
    .arrow {
      display: inline-block;
      vertical-align: top;

      .el-icon-caret-left {
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: #004d84;
        }
      }

      .el-icon-caret-right {
        font-size: 16px;
        cursor: pointer;
        margin-left: -8px;

        &:hover {
          color: #004d84;
        }
      }
    }
  }

  .input-required .el-textarea__inner {
    background-color: #fff8ef;
    color: #333;
  }
}

.serviceTabCard {
  .el-tabs__item.is-active {
    background-color: #409eff;
    color: #fff;
  }
}

.wagediv {
  margin: 8px 0px;
  padding: 15px 20px;
  background: #f2f2f2;
  min-height: 100px;
  border-radius: 6px;
  max-height: 400px;
  overflow: scroll;
  overflow-y: auto;
  overflow-x: hidden;

  > div {
    margin: 10px 0px;

    p:nth-child(odd) {
      font-size: 12px;

      span:first-child {
        // background:#F9A527;
        // border-radius:10px;
        // color:#fff;
        // padding:0 4px;
        font-size: 16px;
      }
    }

    p:nth-child(even) {
      background: #ffd395;
      border-radius: 4px;
      padding: 6px;
      margin-top: 8px;
      display: inline-block;
      min-width: 350px;
      max-width: 90%;
      text-align: left;
      cursor: pointer;
    }
  }

  > div.rightWageitem {
    text-align: right !important;

    p:nth-child(odd) {
      display: flex;
      flex-direction: row-reverse;
      // span:first-child{
      //   background:#5089F5;
      // }
    }

    p:nth-child(even) {
      background: #dff3fe;
      text-align: right !important;
    }
  }
}

.tabsTile {
  .el-tabs__header {
    border: 1px solid #e4e7ed;
  }

  .el-tabs__nav {
    display: flex;
    flex-wrap: wrap;
  }

  .el-tabs__active-bar {
    display: none;
  }

  .el-tabs__nav-wrap::after {
    height: 0px;
  }

  .el-tabs__item {
    padding: 0px;

    span {
      display: inline-block;
      min-width: 80px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      border-radius: 4px;
      color: rgba(102, 102, 102, 0.7);
      background: rgba(102, 102, 102, 0.1);
      cursor: pointer;
      margin-left: 2px;
      padding: 0 8px;
    }

    span.checked {
      background: rgba(102, 102, 102, 1);
      color: #fff;
    }
  }
}

.underlineRred {
  text-decoration: underline red;
}

i[icondisabled] {
  /* pointer-events: none; */
  position: relative;
  user-select: none;
}

i[icondisabled]::after {
  content: "\e629";
  cursor: not-allowed;
  position: absolute;
  left: -8px;
  color: red;
  font-size: 32px;
  margin-top: -11px;
  z-index: 1000;
}

i[icondisabled]:hover {
  pointer-events: none;
}

i[icondisabled]:link {
  pointer-events: none;
}

i[icondisabled]:visited {
  pointer-events: none;
}

i[icondisabled]:active {
  pointer-events: none;
}

i[icondisabled]:hover::after {
  content: "禁";
  font-size: 12px;
  top: 14px;
  left: 20px;
  color: red;
  z-index: 9999;
  background-color: #fff;
}

.mytablist {
  display: inline-flex;
  // align-items: center;
  flex-direction: column;
  // background-color: rgb(248, 248, 248);
  width: 100%;

  > div.tabtitle {
    width: 100%;
    display: inline-flex;

    span:first-child {
      border-radius: 4px 0px 0px 4px;
    }

    span:last-child {
      border-radius: 0px 4px 4px 0px;
    }

    span {
      height: 32px;
      line-height: 32px;
      padding: 0px 18px;
      min-width: 100px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      color: #999999;
      background-color: #f8f8f8;
    }

    span.checked {
      background-color: #0f5a8c;
      color: #fff;
      border-radius: 4px !important;
      height: 34px;
      transform: translateY(-1px);
    }
  }

  .tabcontent {
    width: 100%;
  }
}

.removeTo {
  min-width: 140px;

  ul li {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #f3f3f3;
    cursor: pointer;

    i {
      color: #d5d5d5;
      float: right;
      margin-top: 10px;
    }

    &:last-child {
      border: none;
    }
  }
}

.mypopper {
  min-width: 80px;
}

.reconciliationMng {
  .buttonTabs {
    display: inline-flex;
    justify-content: center;
    margin-bottom: 12px;

    /* .el-button:hover {
      background: #0f5a8c;
      border: 1px solid #0f5a8c;
      color: #fff;
    }
      .el-button.active {
      background: #0d4c77;
      border: 1px solid #0f5a8c!important;
      color: #fff;
    } */
    > button:nth-child(1) {
      border-radius: 20px 0 0 20px;
    }

    > button:nth-child(2) {
      border-radius: 0px 20px 20px 0px;
    }

    .el-button--default {
      height: 36px;
      color: #4d6160;
      /* background-color: #DFF9F6; */
      border: 1px solid #dff9f6;
      /* margin-right: 20px !important; */
      /* border-radius: 20px; */
      background: rgba(141, 237, 223, 0.3);
      font-size: 14px !important;
    }

    .el-button:hover {
      background: #8deddf;
      border: 1px solid #8deddf;
      color: #222;
    }

    .el-button.active {
      background: #8deddf;
      border: 1px solid #8deddf !important;
      color: #222;
      font-weight: 600;
    }
  }

  .cre {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);
  }
}

.el-icon-meiyuan {
  color: #ff9e10;
}

.costConfirmationMonitor {
  .el-icon-shenhebohui {
    pointer-events: all;
  }
}

.noWrap {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.addputServicePort > div {
  > .el-tabs__header {
    display: none;
  }
}

.infoListPono {
  display: inline-block;
  margin-right: 2px;
  padding: 4px 10px;
  background-color: #edf4e4;
  border-radius: 14px;
  color: #76a24e;
  font-size: 16px;
}

.viewer-container {
  z-index: 9999 !important;
}

.el-message-box {
  min-width: 520px;
}

.el-message-box__message {
  font-size: 18px;
}

.el-icon-plus {
  transition: all 0.5s;
  transform: rotate(180deg);
}

.el-icon-minus {
  transition: all 0.5s;
  transform: rotate(360deg);
}

.el-icon-arrow-up {
  transition: all 0.5s;
  transform: rotate(180deg);
}

.el-icon-arrow-down {
  transition: all 0.5s;
  transform: rotate(-180deg);
}
.docSelect-option{
    z-index: 999999999 !important;
 }
 .contactTip{
  z-index: 99999999999999 !important;
}
// .again /deep/ .el-dialog__wrapper {
//     background-color:rgba(0,0,0,0.8);
// }

  .el-dialog__wrapper{
      .againDialog{
        background:transparent;
        box-shadow:none;
       .el-dialog__header{
        padding:0
      }
      .el-dialog__body{
        padding:0;
        color:#fff;
        text-align:center;
        .topIcon{
          width:168px;
          height:168px;
          border-radius:168px;
          text-align:center;
          line-height:168px;
          background:rgba(255,255,255,.1);
          font-size:104px;
          margin:0 auto;
        }
        .textFirst{
          color:#fff;
          opacity:0.3;
          font-size:16px;
          margin-top:16px;
          margin-bottom:32px;
        }
        .textSecond{
          margin-bottom:23px;
          font-size:32px;
        }
        .inputGroup{
          width:316px;
          height:56px;
          background:#fff;
          border-radius:28px;
          text-indent:0.5em;
          line-height:60px;
          input{
            background:transparent;
            width:228px;
            display:inline-block;
            font-size:16px;
            margin:0 auto;
          }
        }
      }
  }
   }
  


</style>

