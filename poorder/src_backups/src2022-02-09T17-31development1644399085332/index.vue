<template>
  <div>
    <div
      class="main"
      v-show="!outsidePage"
      :class="{ isoutside: system == 'outside' }"
    >
      <div class="main-left" :class="[mainLeftShow ? 'aniShow' : 'aniHide']">
        <div>
          <div class="logo" :class="system + 'logo'">
            <i
              :class="
                recorderNumberLoading
                  ? 'el-icon-loading'
                  : 'el-icon-refresh-right'
              "
              v-show="projectIsWecan"
              style="color:#fff;font-size:16px"
              @click="getRecorderNumber()"
              title="刷新左侧菜单待处理的票数"
            ></i>
          </div>
          <!-- 站点系统服务选择框 -->
          <navTopSel
            :cities="cities"
            v-if="cities.length"
            :serviceBasic="serviceBasic"
          >
          </navTopSel>
          <!-- 展开按钮 -->
          <div
            v-if="cities.length || system == 'outside'"
            style="width:100%;display:flex;justify-content: center;align-items:center;cursor:pointer;margin-top: 20px;"
            :class="[
              toggleSystemShow
                ? 'animate__animated animate__flipInY'
                : 'animate__animated animate__flipInX'
            ]"
          >
            <span @click="toggleSystem" class="toggleSystem">{{
              toggleSystemShow ? "全部展开" : "全部收起"
            }}</span>
            <i
              :class="[
                toggleSystemShow ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
              ]"
              class="toggleSystem"
            ></i>
          </div>
        </div>
        <!-- 导航树 -->
        <navlist
          :list="newnavdata"
          :recorderNumberNew="recorderNumberNew"
          style="height: auto;margin-top:12px"
        >
        </navlist>
      </div>
      <!-- 侧边栏 -->
      <div
        class="displayArrow"
        :style="{ left: !mainLeftShow ? 0 : 260 + 'px' }"
      >
        <a
          class="pngf"
          :class="[mainLeftShow ? 'pngfix' : 'pngfixshow']"
          href="javascript:void(0);"
          @click="ArrowToggle"
        ></a>
      </div>

      <div class="main-right">
        <!-- 各个设置等功能按钮 -->
        <navSetting
          @success="userSettingSuccess"
          @backindex="outsidePage = true"
          :cities="cities"
          :serviceBasic="serviceBasic"
          :userSetting.sync="userSetting"
          v-if="
            (cities.length && serviceBasic.length > 0) || system == 'outside'
          "
          :system="system"
        ></navSetting>
        <!-- 头部导航 -->
        <navtabs :tabRelKeep.sync="tabRelKeep" ref="navtabs"></navtabs>

        <div class="shadow"></div>

        <div class="main-right-content"  >
          <keep-alive :include="tabRelKeep">
            <router-view
              ref="search"
              :class="$route.name"
              v-if="$store.state.isLocalhost"
            ></router-view>
            <!-- 本地不加key,方便开发；线上加key,需要匹配整个路由以缓存页面 -->
            <router-view
              ref="search"
              :class="$route.name"
              :key="$route.fullPath"
            ></router-view>
          </keep-alive>
          <!-- <div class="maximize" @click="maximize">
            <img src="@/assets/minimize.png" alt="" />
          </div> -->
        </div>
      </div>
      <span class="backtop"></span>
    </div>

    <Chat
      v-if="$store.state.chatStore.roomStatus"
      :orderInfo="$store.state.chatStore"
    />

    <!-- 外网导引页 -->
    <outside
      v-show="outsidePage"
      @linkto="linkto"
      :autList="outsideNav"
    ></outside>
  </div>
</template>

<script>
import{queueKey,SystemMessage} from './store/systemMessage';
import router from "./router/index.js";
import { Logout } from "./api/localStorage";

import { createPage } from "@/common/searchPage";
import { systemCheck } from "./components/mixins/topPageMixin";

import navTopSel from "@/components/smallTemplate/navTopSel";
import navlist from "@/components/smallTemplate/navlist";
import navtabs from "@/components/smallTemplate/navtabs";
import navSetting from "@/components/smallTemplate/navSetting";
import Chat from "@/components/orderChat/index.vue";
import { getOrderInfo } from "@/api/order.js";
import outside from "@/outsideDom/outside";
import { cassifyObj, basicDataPages } from "@/common/fields";
import {
  getStorage,
  getWtdata,
  getAllTemplates,
  getTzxm
} from "@/api/getBasicStorageData";

export default {
  name: "app",
  components: {
    navlist,
    navtabs,
    navTopSel,
    navSetting,
    outside,
    Chat
  },
  data() {
    //设置当前默认的系统；编译价格管理系统时候设置下面的
    let buildSystem = sessionStorage.system || "bo"; //bo系统
    //let buildSystem="priceManagement";// priceManagement 价格管理系统
    if (location.pathname.toLowerCase().includes("pricemanagement")) {
      buildSystem = "priceManagement";
    }

    if (location.pathname.toLowerCase().includes("wffcustomoutsidenew")) {
      buildSystem = "outside";
    }

    let createPageArr = [
      "asignSpaceSearch",
      "gnUnfinish",
      "orderTakingOverDate",
      "listConfirm",
      "listConfirmOut",
      "orderTaking",
      "cabinUnconfirmed",
      "listConfirmOverDate",
      "asignSearchMonitor",
      "dataAnaly",
      "outMawbAdd",
      "portData"
    ]; //通过mixin注入的页面

    createPageArr = [
      ...createPageArr,
      ...Object.keys(cassifyObj),
      ...Object.keys(basicDataPages)
    ]; //合并多tab页面的路由和基础数据层页面
      // 运价系统
      // if (location.pathname.toLowerCase().includes("priceSystem")) {
      //   buildSystem = "priceSystem";
      // }

    return {
      cities: [], //所有可选站点
      serviceBasic: [], //分组后的服务
      system: buildSystem, //当前系统  默认bo
      recorderNumberArrayNew: [], //所有记录
      recorderNumberNew: {}, //处理后的，根据站点系统动态计算
      locale: "Chinese",
      newnavdata: [], //多级导航结构
      navDataGroup: {}, //分组数据，可以通过id改变里面的设置
      tabRelKeep: [], //缓存组件名
      mainLeftShow: true, //是否显示左侧导航
      area: this.$store.state.areaState,
      usrname: localStorage.getItem("usrname"),
      userSetting: {}, //用户设置
      toggleSystemShow: true, //展开导航
      workUnFinishResult: {}, //登录界面返回的控制权限
      recorderNumberLoading: false, //图标显示
      createPageArr: createPageArr,
      controlSh: [], //上海，有几个导航模块需要根据系统站点显示隐藏，记录这些模块的id以修改对应的hidden
      // controlDn: [],//海外D/N
      outsidePage: false,
      outsideNav: [], //外网传导航
      timeout:null,//记录锁屏超时
    };
  },


  created: function() {
    window.name = "index";
      let createPageArr = ["asignSpaceSearch", "gnUnfinish", "orderTakingOverDate", "listConfirm", "listConfirmOut", "orderTaking", "cabinUnconfirmed", "listConfirmOverDate", "asignSearchMonitor","dataAnaly","outMawbAdd","portData","norAirlineFee","souAirlineFee","eurAirlineFee","japAirlineFee","estAirlineFee"];//通过mixin注入的页面
    sessionStorage.setItem(
      "buildVersionNumber",
      process.env.buildVersionNumber
    );
    // 从IE跳转到首页的时候没有缓存数据，需要重新获取
    if (!localStorage.usrname) {
      return;
    }

    Promise.all(getStorage.call(this)).then(() => {
      // console.log(3333333);
      this.serviceBasic = JSON.parse(localStorage.serviceDataGroup);
      let allservice = [];
      for (let item of this.serviceBasic) {
        for (let item2 of item.serviceBasicList) {
          item2.selectValue = item2.system + "|" + item2.servicecode; //注意：这里有赋值selectValue,所以需要将serviceBasic传入后面的组件，
          if (!allservice.includes(item2.servicecode)) {
            allservice.push(item2.servicecode);
          }
        }
      }
      this.$store.commit("setAllServiceCheck", allservice);
    });

    this.$watch(
      () => {
        return this.recorderNumberArrayNew;
      },
      () => {
        this.setRecorderNumberNew(2);
      },
      { deep: true }
    );

    this.$watch(
      () => {
        return this.$store.state.areaState + this.$store.state.systemCheck;
      },
      () => {
        this.setRecorderNumberNew(1);
        this.setNavDisplay();
      },
      { immediate: true }
    );

    let recorderNumberInterval = "";

    this.$watch(
      () => {
        return (
          this.userSetting.showSystemCount + this.userSetting.refreshInterval
        );
      },
      () => {
        if (recorderNumberInterval) {
          clearInterval(recorderNumberInterval);
          recorderNumberInterval = "";
        }
        if (
          this.userSetting.showSystemCount &&
          this.userSetting.refreshInterval
        ) {
          recorderNumberInterval = setInterval(() => {
            this.getRecorderNumber();
          }, this.userSetting.refreshInterval * 60 * 1000);
        } else {
          clearInterval(recorderNumberInterval);
          recorderNumberInterval = "";
        }
      },
      { immediate: true }
    );

     window.opener.queueObj.boState["isOpen"]=true;
     var self=this;
     setTimeout(()=>{
         var gotoNav= window.opener.queueObj.boState["gotoNav"]
    if(gotoNav){
       let data=JSON.parse(sessionStorage.nav).filter(i=>i.auturl==gotoNav+".vue")[0]
      self.$router.push({ name:gotoNav, params: { id: data.id}})
      window.opener.queueObj.boState["gotoNav"]="";
    }
    
     },3000)
   window.opener.queueObj.subscribe(queueKey.gotoNav,"app",function(d){
        let data=JSON.parse(sessionStorage.nav).filter(i=>i.auturl==d+".vue")[0]
      self.$router.push({ name:d, params: { id: data.id}})
      window.opener.queueObj.boState["gotoNav"]="";
    });
   
  },
  mounted() {
    if (!localStorage.usrname) {
      return;
    }

    window.addEventListener('storage', (e) => {
      console.log(e)
      if(e.key=='againShow'){
        this.$store.commit('setAgainShow',eval(e.newValue))
      }
    })

    $(".backtop").click(function() {
      $(".dialogPage").scrollTop(0);
    });

    var nav = sessionStorage.getItem("nav");

    let appname = "唯凯订单管理系统";

    if (location.pathname.toLowerCase().includes("wffmanagement")) {
      appname = "management";
      this.system = "wffmanagement";
    } else if (this.system == "priceManagement") {
      appname = "唯凯价格管理系统";
    } else {
      if (nav) {
        this.system = sessionStorage.getItem("system") || "bo";
      } else {
        let temp =
          this.$route.fullPath.split("=")[1] || this.$route.path.substr(1);

        if (temp == "index") {
          //如果是首页，跳转到第一个导航
          appname = "唯凯订单管理系统";
          this.system = sessionStorage.getItem("system") || "bo";
        } else {
          if (temp == "OrderAccept") {
            appname = "唯凯联运管理系统";
            this.system = "ly";
          }
          if (temp == "BgOrderAccept") {
            appname = "唯凯报关管理系统";
            this.system = "bg";
          }
        }
      }
    }

    this.outsidePage = this.system == "outside";

    getAllTemplates.call(this, this.system == "bo").then(res => {
      // console.log(res)
    });

    getTzxm.call(this);

    let works = getWtdata.call(this);
    // console.log(typeof works)
    if (typeof works == "object") {
      Promise.all(works).then(() => {
        if (nav) {
          this.assignFunc(JSON.parse(nav));
        } else {
          this.$axios({
            method: "get",
            url: this.$store.state.publicWebApi + "api/UserAut",
            params: {
              logname: localStorage.getItem("usrname"),
              appname: appname,
              area: "",
              scope: "1"
            },
            loading: false,
            tip: false
          }).then(res => {
            // console.log(res.data)
            // this.assignFunc(res.data);
            let resdata = res.data;
            this.outsideNav = res.data;
            this.assignFunc(resdata);
            sessionStorage.setItem("nav", JSON.stringify(resdata));
            sessionStorage.setItem("system", this.system);
          });
        }
      });
    }

    // webskoet
//     this.$websoketGlobal.ws.onmessage = res => {
      
//       const result = JSON.parse(res.data);
//       console.log(result.resultdata.messagetype === "jobinfomessage")
//       if (result.resultdata.pushtype === "call"  ) {
//         if (result.resultdata.messagetype === "nodemessage" ||result.resultdata.messagetype === "textmessage") {
//           let showTitle = null;
//           let showContent = null;
//           if (result.resultdata.messagetype === "nodemessage") {
//             showTitle = `${
//               result.resultdata.mawb !== ""
//                 ? `${result.resultdata.mawb}`
//                 : `${result.resultdata.pono}`
//             } 节点更新`;
//             showContent = `<p>系统：${result.resultdata.inputConent}<span style="color:#0066ff;cursor:pointer">查看</span></p>`;
//           } else if (result.resultdata.messagetype === "textmessage") {
//             console.log(result.resultdata);
//             showTitle = `${
//               result.resultdata.mawb !== ""
//                 ? `${result.resultdata.mawb}`
//                 : `${result.resultdata.pono}`
//             } 有新的消息`;
//             showContent = `<p>${result.resultdata.loginName}：${result.resultdata.inputConent}<span style="color:#0066ff;cursor:pointer">查看</span> 
// </p>`;
//           }
//           const notify = this.$notify({
//             title: showTitle,
//             dangerouslyUseHTMLString: true,
//             message: showContent,
//             position: "bottom-right",
//             type: "success",
//             duration: 4000,
//             customClass: "notify-contact "
//           });

//           notify.$el.querySelector("span").onclick = () => {
//             // your code
//             this.getToChat(result.resultdata);
//             // 点击后关闭notify 不需要的话可删掉
//             notify.close();
//           };

//           // 右上角历史列表增加
//           this.$store.commit("setPushMessage", {
//             type: "add",
//             data: result.resultdata
//           });


//             if(this.$store.state.chatStore.data.boguid === result.resultdata.boguid) {
//             // 聊天室数据增加    聊天历史数据 新增加发送的数据
//               this.$store.commit("setWebsoketPushChatData", {
//                 obj: result.resultdata
//               });
//             }
  
          
//         }
//       } else if (result.resultdata.messagetype === "historymessage") {
//         // 获取聊天室   历史数据
//         this.$store.commit("setWebsoketPushChatData", {
//           data: result.resultdata.datalist
//         });
//       }  else if(result.resultdata.messagetype === "bufferpercent"){
//         return false
//       }else if(result.resultdata.messagetype === "historyjoblistmessage"){
//         console.log("未读 订单历史记录")
//         console.log(result.resultdata.joblist)
//         result.resultdata.joblist != "" ?  this.$store.commit('setreadMessageList',{status:'add',data:result.resultdata.joblist}) : console.log(this.$store.state.readMessageList)
//       } else if(result.resultdata.messagetype === "jobinfomessage"){ 
//           console.log("执行了---------------jobinfomessage ")
          
//           this.$store.commit('setreadMessageList',{status:'addOne',guid:result.resultdata.guid}) 
//       } else {

//           // 聊天室  历史数据 新增加发送的数据
//           this.$store.commit("setWebsoketPushChatData", {
//             obj: result.resultdata
//           });
      
//       }
//     };
    // 30分钟不操作弹框
    document.onmousemove=(()=>{
      this.getTime()
    })
    document.onkeydown=(()=>{
      this.getTime()
    })
    document.onscroll=(()=>{
      this.getTime()
    })

  },

  methods: {
    getTime(){
        clearInterval(this.timeout)
        this.timeout = setInterval(()=>{
          //localStorage.setItem('againShow',true)
          //window.againShow=true
          //sessionStorage.setItem('againShow',true)
          //this.resetSetItem('againShow', true);
          //sessionStorage.setItem('againShow',true)
          //setCookie('againShow', true)
          this.$store.commit('setAgainShow',true)
        }, 1000 * 60 * 30)
    },
    redirectRoute(i) {
      this.$router.push({
        name: i.temp,
        params: {
          id: i.id
        }
      });
      this.$nextTick(() => {
        this.setWorkUnFinishSearchData(i.temp);
        if (i.module) {
          this.newnavdata[0].children.forEach(e => {
            if (e.autname == i.module) {
              e.ifShow = true;
              this.toggleSystemShow = false;
            }
          });
        }
      });
    },
    maximize() {
      if (this.$store.state.chatStore.data != null) {
        this.$store.commit("setChat", { status: "maximize" });
      } else {
        return false;
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
    redirectRouteByid(id) {
      //跳转路由
      if (id && this.navDataGroup[id]) {
        this.redirectRoute(this.navDataGroup[id][0]);
      }
    },
    linkto(data) {
      // console.log(data)
      // console.log(this.navDataGroup);
      this.outsidePage = false;
      this.redirectRoute(this.navDataGroup[data][0]); //外网跳转
    },
    setNavDisplay() {
      if (this.system == "bo" && this.newnavdata.length > 0) {
        //选择系统，隐藏导航模块

        // note: 去掉上海菜单显示设置
        let flage =
          (this.$store.state.systemCheck.length == 0 ||
            this.$store.state.systemCheck.includes("空出")) &&
          this.$store.state.areaState.includes(this.conditionalAreaForBuild);

        this.$nextTick(() => {
          this.controlSh.forEach(i => {
            if (this.navDataGroup[i]) {
              this.navDataGroup[i][0].hidden = !flage;
            }
          });

          this.newnavdata[0].children.forEach(i => {
            if (i.autname && i.autname.includes("操作层")) {
              if (
                this.$store.state.systemCheck.includes(i.autname.substr(0, 2))
              ) {
                i.hidden = false;
              } else {
                i.hidden = true;
                if (this.$refs.navtabs) {
                  let name = i.autname.replace("层", "");
                  if (
                    this.$refs.navtabs.classification[name] &&
                    this.$refs.navtabs.classification[name].length > 0
                  ) {
                    this.$refs.navtabs.closeTags(7, name);
                  }
                }
              }
            }
          });
        });
      }
    },
    userSettingSuccess(val) {
      if (val) {
        this.getRecorderNumber();
      }
    },
    toggleSystem() {
      //顶部导航的全部展开与收起
      this.newnavdata[0].children.forEach(i => {
        i.ifShow = this.toggleSystemShow;
      });

      this.toggleSystemShow = !this.toggleSystemShow;
    },

    setWorkUnFinishSearchData(temp) {
      //权限控制，赋值查询条件
      let resultdic = this.workUnFinishResult.resultdic;
      let resultid = this.workUnFinishResult.resultid;
      if (!resultid) return;
      let vm = this;
      let vmsearch = "";

      let intervalID = setInterval(() => {
        if (
          temp == "costConfirmationkf" ||
          temp == "costConfirmationhx" ||
          temp == "gnCostConfirm" ||
          temp == "asignSearch"
        ) {
          if (
            resultid == 11 ||
            resultid == 12 ||
            resultid == 16 ||
            resultid == 30
          ) {
            //航线驳回费用  11       客服驳回费用12  国内服务驳回费用16  签单确认已签单30 需要打开第二个tab
            vm.$refs.search.mng = false;
            // vm.$nextTick(() => {
            vmsearch = vm.$refs.search.$refs.sec;
            // })
          } else {
            vmsearch = vm.$refs.search.$refs.fir;
          }
        } else {
          vmsearch = vm.$refs.search;
        }
        // 电脑卡的时候页面打开会很慢，轮询判断页面打开成功时才设置查询条件
        if (vmsearch) {
          clearInterval(intervalID);
        } else {
          return;
        }
        if (
          (resultid == 4 && temp == "costConfirmation") ||
          (resultid == 5 && temp == "costConfirmation") ||
          (resultid == 15 && temp == "gnSearch") ||
          resultid == 30 ||
          resultid == 16 ||
          ![4, 5, 15].includes(resultid)
        ) {
          //console.log(2323232323)
          vmsearch.inputModelData = {};
          vmsearch.searchData = {};

          let fieldArr = [
            { field: "hbrq", title: "航班日期" },
            { field: "real_hbrq", title: "航班日期" },
            { field: "adddate", title: "创建日期" },
            { field: "orderfinishdate", title: "订单完成日期" },
            { field: "confirmdate", title: "费用确认日期" }
          ];

          for (let key of Object.keys(resultdic)) {
            let arr = fieldArr.filter(i => i.field == key);
            if (arr.length) {
              vm.$set(vmsearch.inputModelData, key, "");
              vm.$set(vmsearch.inputViewData, key, {
                title: arr[0].title,
                type: 15,
                fieldtype: 6,
                defaultVal: false,
                defaultEnd: false
              });
              vmsearch.inputModelData[key] = {
                begin:
                  (resultdic[key].begin &&
                    new Date(resultdic[key].begin).Format("yyyy-MM-dd")) ||
                  "",
                end:
                  (resultdic[key].end &&
                    new Date(resultdic[key].end).Format("yyyy-MM-dd")) ||
                  ""
              };
              // if(key=='rollbackcust'||key=='rollbackroute'){
              //   vmsearch.inputModelData[key]= resultdic[key]
              // }
            } else {
              vm.$set(
                vmsearch.inputModelData,
                key,
                resultdic[key] !== undefined ? String(resultdic[key]) : ""
              );
              if (!vmsearch.inputViewData[key]) {
                console.log(key + "未维护在查询模板中");
              }
              if (
                vmsearch.inputViewData[key] &&
                vmsearch.inputViewData[key].type == 1
              ) {
                vm.$set(
                  vmsearch.inputViewData[key],
                  "whereStr",
                  //"equal"
                  key != "rollbackcust" && key != "rollbackroute"
                    ? "equal"
                    : "like"
                );
                if (key == "rollbackcust" || key == "rollbackroute") {
                  vmsearch.inputModelData[key] = resultdic[key].like;
                }

                // console.log(vmsearch.inputModelData[key])
              }
            }
          }

          if (resultid !== 15) {
            //多个页面，会导致切换即查询
            setTimeout(() => {
              vmsearch.search();
            }, 200);
          }
          vm = null;
          temp = null;
        }
      }, 200);
    },
    ArrowToggle() {
      //显示隐藏侧边导航区
      this.mainLeftShow = !this.mainLeftShow;
      this.$store.commit("setTableHeadShow", this.mainLeftShow);
      let dialogPage = $(".dialogPage");
      if (!this.mainLeftShow) {
        dialogPage.css({ width: "auto", left: "44px" });
      } else {
        dialogPage.css({
          width: () => {
            return $(window).width() - "330";
          },
          left: "auto"
        });
      }
      dialogPage = undefined;
    },
    Logout,
    assignFunc(data) {
      //处理导航数据
      let dataArr = [];
      let areaArr = [];
      let tempArea = [];
      data.forEach(i => {
        if (i.type !== 5) {
          if (i.auturl.includes(".vue") || i.auturl == "") {
            dataArr.push(i);
          }
        } else {
          if (!tempArea.includes(i.autname) && i.regionarea) {
            tempArea.push(i.autname);
            areaArr.push(i);
          }
        }
      });
      //  console.log(areaArr)

      let areaList = areaArr.map(i => i.regionarea.split("丨")[1]).toString();
      // console.log(areaList)
      if (!localStorage.usrname) return;

      this.assignArea(areaArr); //生成权限选择的站点

      if (this.system == "bo") {
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExBoBase/WorkUnFinishNew",
          params: { czman: localStorage.usrname, area: areaList || "PVG" },
          loading: true,
          tip: false
        }).then(res => {
          this.createNav(dataArr, res.data);
        });
      } else {
        this.createNav(dataArr, {
          resultguid: "0",
          resultmessage: "",
          resultstatus: 0
        });
      }
    },
    assignArea(areadata) {
      //生成权限地域选项
      var areaArr = [];
      let cityCode = [];
      // 如果已经通过用户设置赋值了站点，则不重新初始化站点

      areadata.forEach(i => {
        var area = i.autname;
        if (area && area != "主体") {
          cityCode.push({
            label: i.regionarea.split("丨")[0],
            value: i.regionarea.split("丨")[1]
          });

          if (!areaArr.includes(i.region)) {
            areaArr.push(i.region);
            this.cities.push({
              label: i.region,
              options: [
                { value: i.regionarea.split("丨")[0], label: i.regionarea }
              ]
            });
          } else {
            let len = areaArr.indexOf(i.region);
            this.cities[len].options[this.cities[len].options.length] = {
              value: i.regionarea.split("丨")[0],
              label: i.regionarea
            };
          }
        }
      });

      // console.log(cityCode);
      localStorage.setItem("cityCode", JSON.stringify(cityCode));
      this.$store.commit("setCities", this.cities);

      //当设置默认显示待处理的票数时，初始进来需要设置
      setTimeout(() => {
        if (this.$store.getters.userSetting.showSystemCount) {
          this.getRecorderNumber();
        }
      }, 400);
    },

    createNav(getNav, kzdata) {//创建路由
         console.log(getNav)
        if (this.system == 'wffmanagement' && window.opener && window.opener.resultdicWffmanagement) {
          this.workUnFinishResult = window.opener && window.opener.resultdicWffmanagement//经理审核在登录页控制
        } else {
          this.workUnFinishResult = kzdata;
        }

        let filternav = [];//根据权限过滤的导航
        let newrouter = [];//没有嵌套结构的路由
        let navDataById = {};//保存每个页面的路由信息；路由信息也可从navDataGroup获取，
        for (let i in getNav) {
          let item = getNav[i];
          let temp = item.auturl.split(".")[0];
          let othername = item.othername;

          if (item.auturl !== "admin/frmPoSearch.aspx") {
            if (!othername) {
              othername = item.module;
            }


            let comp_url = "";
            if (this.system == "bo") comp_url = "./components/";
            if (this.system == "ly") comp_url = "./components/lianyunSystem/";
            if (this.system == "bg") comp_url = "./components/baoguanSystem/";
            if (this.system == "wffmanagement") comp_url = "./wffmanagement/";
            //if (this.system == "priceSystem") comp_url = "./priceSystem/";
            if (this.system == "priceManagement") comp_url = "./components/";
            if (this.system == "outside") comp_url = "./outsideDom/";
            
            if (kzdata.resultstatus > 0&& item.module!='基础数据层') {
             
              this.$store.commit("setIsWorkUnFinish", kzdata.resultid);

              
              if (kzdata.resultid == 1 || kzdata.resultid == 6 || kzdata.resultid == 11) {
                if (
                  !(temp == "costConfirmationhx" || item.autname == "航线操作")
                ) {
                  continue;
                }
              }

              if (kzdata.resultid == 2 || kzdata.resultid == 7 || kzdata.resultid == 12) {
                if (
                  !(temp == "costConfirmationkf" || item.autname == "客服操作")
                ) {
                  continue;
                }
              }

              if (kzdata.resultid == 3 || kzdata.resultid === 30) {
                if (!(temp == "asignSearch" || item.autname == "航线操作")) {
                  continue;
                }
              }

              if (kzdata.resultid == 34) {
                if (!(temp == "asignSearchMonitor" || item.autname == "航线操作")) {
                  continue;
                }
              }

              if (kzdata.resultid == 4 || kzdata.resultid == 5) {
                if (
                  !(
                    temp == "orderSearch" ||
                    temp == "costConfirmation" ||
                    temp == "orderUnfinish" ||
                    item.autname == "费用确认" ||
                    item.autname == "费用未确认" ||
                    item.name == "费用制作"
                  )
                ) {
                  continue;
                }
              }

              if (kzdata.resultid === 10) {
                if (!(temp == "gnSearch" || item.autname == "国内服务操作")) {
                  continue;
                }
              }

              if (kzdata.resultid === 15) {
                if (
                  !(
                    temp == "gnSearch" || temp == "gnCostConfirm" ||
                    (item.autname == "费用制作" && item.module == '国内服务操作层') || item.autname == "费用确认" && item.module == '国内服务操作层')
                ) {
                  continue;
                }
              }

              if (kzdata.resultid === 16) {
                if (
                  !(
                    temp == "gnCostConfirm" || (item.autname == "费用制作" && item.module == '国内服务操作层') || item.autname == "费用确认" && item.module == '国内服务操作层')
                ) {
                  continue;
                }
              }


              if (kzdata.resultid === 20) {
                //上榜人
                if (!(temp == "orderUnfinish" || item.autname == "操作未完成")) {
                  continue;
                }
              }

              if (kzdata.resultid === 33) {
                //
                if (!(temp == "customerSearch" || item.autname == "客服操作")) {
                  continue;
                }
              }
            }
            console.log(temp)
            //放入平级的路由中
            if (temp) {
              console.log(temp)
              newrouter.push(
                {
                  path: temp + "/:id",
                  name: temp,
                  temp: temp,
                  id: item.id,
                  text: item.id,
                  component: this.createPageArr.includes(temp)
                    ? createPage(temp)
                    : resolve => require([comp_url + temp + ".vue"], resolve),
                  compname: comp_url + temp + ".vue"
                }
              )

            }

            navDataById[item.id] = {
              text: item.id,
              id: item.id,
              autname: item.autname,
              temp: temp,
              othername: othername,
              ready01: item.ready01
            };
          }
          filternav.push(item)
        }

         console.log(newrouter)

        this.$store.commit("setNavDataById", navDataById);


        this.$router.addRoutes(
          [{
            path: "",
            component: resolve => require(["./index.vue"], resolve),
            name: 'index',
            children: newrouter
          }]
        );
        console.log(filternav)
        this.newnavdata = this.setRoutes(JSON.parse(JSON.stringify(filternav)))
        this.setNavDisplay()


        if (kzdata.resultstatus > 0) {
          this.$confirm(kzdata.resultmessage, "提示", {
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定",
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            type: "warning"
          }).then(() => {
            if (
              kzdata.resultid == 15 ||
              kzdata.resultid == 4 ||
              kzdata.resultid == 5 || kzdata.resultid == 16
            ) {
              //当这个类型要显示多个页面，需要指定初始打开其中一个页面
              for (let i of newrouter) {
                // 默认打开国内服务费用确认页面
                if (
                  i.temp && ((kzdata.resultid == 15 && i.temp === "gnSearch") || (kzdata.resultid == 4 && i.temp === "costConfirmation") || (kzdata.resultid == 5 && i.temp === "costConfirmation") || (kzdata.resultid == 16 && i.temp === "gnCostConfirm"))
                ) {
                  this.redirectRoute(i);
                  break;
                }
              }
            } else {
              //注意：由于存在多个操作层，为定位正确，目前默认只打开“空出操作层”，国内服务操作层在上面配置，后面如果要跳转到其他操作层，则需要修改目前的判断条件
              newrouter.forEach(i => {
                if (i.name && this.navDataGroup[i.id][0].module == '空出操作层') {
                  this.redirectRoute(i);
                }
              });
            }

          });
        }




        if (this.system == 'wffmanagement') {//经理审核直接打开
         var localHref=location.href
          setTimeout(() => {
            if (this.system == 'wffmanagement') {
              let resultdic = window.opener && window.opener.resultdicWffmanagement && window.opener.resultdicWffmanagement.resultdic
               console.log(resultdic)
              if (resultdic && resultdic.area) {
                this.$store.commit("setAreaState", resultdic.area);

              }
              if (resultdic && resultdic.system) {
                this.$store.commit("setSystemCheck", resultdic.system);
              }
            }
            //console.log()
            console.log(newrouter)
            //console.log(location.href)
            newrouter.forEach(i=>{
              if(localHref.includes(i.temp)){
                 this.redirectRoute(i);
              }
            })
          }, 1000);
        }

        // if(this.system == 'priceSystem'){
        //   setTimeout(() => {
        //     this.redirectRoute(newrouter[0]);
        //   })
        // }

        if (getCookie('isrelogin') == 2) {
          this.redirectRouteByid(getCookie('routerid'))//自动重新登录并跳转
        }

        setCookie('isrelogin', 1);//默认状态


      },
    setRoutes(nav) {
      //生成导航ui的树结构

      let obj = {};
      let moduleArr = {};
      let navroutes = [];
      nav.forEach(i => {
        let id = i.id;
        let pid = i.ready01;
        i.ifShow = false;
        i.level = 2;
        i.temp = i.auturl.split(".")[0] || ""; //组件名字
        i.recorderName = i.autcode + i.module; //推送数字的键名
        i.hidden = false;

        //我们的路由本质上并不是嵌套路由，只是导航结构是嵌套的，如果设置嵌套路由的结构，子路由反而无法渲染到顶级的view

        if (i.type != 5) {
          //生成嵌套的结构
          if (!obj[id]) {
            obj[id] = [i];
          } else {
            obj[id].push(i);
          }

          if (pid) {
            if (obj[pid]) {
              if (!obj[pid][0].children) {
                obj[pid][0].children = [i];
              } else {
                obj[pid][0].children.push(i);
              }
              i.level = obj[pid][0].level + 1;
            }
          }
          //一级模块包含的子菜单id
          if (!pid) {
            if (!moduleArr[i.module]) {
              moduleArr[i.module] = [id];
            } else {
              moduleArr[i.module].push(id);
            }
          }
        }

        if (
          ["客服操作", "航线操作", "单证操作", "运控操作"].includes(i.autname)
        ) {
          this.controlSh.push(i.id);
        }

        // if (['海外D/N'].includes(i.autname)) {
        //   this.controlDn.push(i.id)
        // }
      });
      // console.log(moduleArr)
      // console.log(obj)
      // console.log(JSON.stringify(obj))
      Object.keys(moduleArr).forEach(i => {
        let ids = moduleArr[i];
        navroutes.push({
          path: "",
          mate: { title: i },
          level: 1,
          autname: i,
          ifShow: false,
          hidden: false,
          // component: resolve => require(["./index.vue"], resolve),
          children: [
            ...ids.map(e => {
              return obj[e];
            })
          ].flat()
        });
      });
      this.navDataGroup = obj;
      return [{ children: navroutes, ifShow: true, level: 0 }];
    },

    getRecorderNumber(item) {
      //获取导航待处理数字
      if (!this.projectIsWecan || this.recorderNumberLoading) {
        return;
      }
      this.recorderNumberLoading = true;
      let data = {
        area: JSON.parse(localStorage.cityCode)
          .map(i => i.label)
          .toString()
      };
      if (this.system == "bo") {
        data.username = localStorage.usrname;
      }
      if (item && item.module) {
        data.module = item.module;
      } else {
        data.module = [
          ...new Set(JSON.parse(sessionStorage.nav).map(i => i.module))
        ].toString();
      }
      this.$axios({
        method: "get",
        url:
          (this.system == "bo"
            ? this.$store.state.webApi
            : this.$store.state.wcWebApi) + "api/SystemCount",
        params: data,
        loading: false
      })
        .then(res => {
          this.recorderNumberArrayNew = res.data;
          this.recorderNumberLoading = false;
        })
        .catch(error => {
          this.recorderNumberLoading = false;
          this.$message.error("请求失败，请重试！");
        });
    },
    setRecorderNumberNew(type = 1) {
      //计算待处理数字
      //type1 全部模板 2单独模块
      let obj = {};
      let moduleArr = [];

      this.recorderNumberArrayNew.forEach(i => {
        let name = i.autcode + i.module;
        if (!moduleArr.includes(i.module)) {
          moduleArr.push(i.module);
        }
        if (
          (this.$store.state.areaState.includes(i.area) &&
            this.$store.state.systemCheck.includes(i.system)) ||
          this.system == "outside"
        ) {
          if (!obj[name]) {
            obj[name] = i.countnum;
          } else {
            obj[name] += i.countnum;
          }
        }
      });
      if (type == 2) {
        Object.keys(this.recorderNumberNew).forEach((i, k) => {
          if (!i.includes(moduleArr[0])) {
            obj[i] = this.recorderNumberNew[i];
          }
        });
      }

      this.recorderNumberNew = obj;
    }
  },
  computed: {},
      watch: {
      system() {
        let title = "";
        if (this.system == "bo") {
          title = "唯凯订单管理系统";
        } else if (this.system == "ly") {
          title = "联运订单管理系统";
        } else if (this.system == "bg") {
          title = "报关订单管理系统";
        } else if (this.system == "wffmanagement") {
          title = "审批管理系统";
        } else if (this.system == "priceManagement") {
          title = "唯凯价格管理系统";
        }
        // else if(this.system == "priceSystem"){
        //   title = "唯凯运价管理系统";
        // } 
        else if (this.system == "outside") {
          title = "唯凯外网管理系统";
        }
        title ? (document.title = title) : "";
      },
      $route: {
        handler(val) {
          // console.log(this.$router)

          this.$store.state.mainSearch = false
          if (!localStorage.usrname) {
            Logout();
            return;
          }
          this.$store.commit(
            "setTableHeadShow",
            !this.$store.state.tableHeadShow
          );

          $(".backtop").css("visibility", "hidden");
          setTimeout(() => {
            if (!this.mainLeftShow) {
              $(".dialogPage").css({ width: "auto", left: "44px" });
            } else {
              $(".dialogPage").css({
                width: () => {
                  return $(window).width() - "330";
                },
                left: "auto"
              });
            }
          }, 0);

        },
        immediate: true
      },


      locale(val) {
        //console.log(val)
        this.$i18n.locale = val;
      },


    }

        // console.log(this.$router)



};
</script>

<style lang="less" scoped>
@first-nav-bg: #384954; //一级导航
@zi-nav-bg: #384954; //顶部栏 二级导航 导航标签
@zi-nav-hover-bg: #021629; //子导航hover

@first-nav-font-color: #9cd7ff;
@zi-nav-font-color: rgb(191, 203, 217);
@zi-nav-text-color: #fff;
/* 子导航选中颜色 */

.logo {
  height: 86px;
  line-height: 86px;
  text-align: right;
  background: url("./../boStatic/images/kclogo.png") no-repeat;
  background-size: 100%;

  /deep/.el-input__suffix-inner {
    display: none;
  }

  /deep/.el-select__tags {
    width: 0;
  }

  /deep/.el-input--suffix {
    margin-left: -32px;
    opacity: 0;
  }

  i {
    position: relative;
    right: 34px;
    top: 13px;
    cursor: pointer;
  }
}

.outsidelogo {
  background: url("./../boStatic/images/outsidelogo.png") no-repeat;
  background-position: 20px 44px;
}

.bologo {
  background: url("./../boStatic/images/kclogo.png") no-repeat;
}
  // .priceSystemlogo{
  //   background: url("./../boStatic/images/priceSystemlogo.png") no-repeat;
  // }

.lylogo {
  background: url("./../boStatic/images/lylogo.png") no-repeat;
}

.bglogo {
  background: url("./../boStatic/images/bglogo.png") no-repeat;
}

.wffmanagementlogo {
  background: url("./../boStatic/images/wffmanagementlogo.png") no-repeat;
}

.main {
  display: flex;
  position: absolute;
  top: 0px;
  width: 100%;
  overflow: hidden;
  bottom: 0px;
  min-width: 1300px;
  overflow-x: auto;
}

.main-left {
  flex-shrink: 0;
  width: 250px;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
  background: -webkit-linear-gradient(#526c7c, #3d4e5a);
  /* Safari 5.1 - 6.0 */
  /* background: -o-linear-gradient(#526c7c, #3d4e5a); */
  /* Opera 11.1 - 12.0 */
  /* background: -moz-linear-gradient(#526c7c, #3d4e5a); */
  /* Firefox 3.6 - 15 */
  /* background: linear-gradient(#526c7c, #3d4e5a); */

  /* 标准的语法 */
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Chrome/Safari/Opera */
  -khtml-user-select: none;
  /* Konqueror */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;

  /* Non-prefixed version, currently
  not supported by any browser */

  .toggleSystem {
    font-size: 14px;
    color: #aeb6c1;
  }
}

.main-left::-webkit-scrollbar {
  display: none; //隐藏导航栏的滚动条，仍然可以滚动
}

/* isoutside外网时候的导航样式 */
/deep/ .isoutside {
  .main-left {
    background: transparent linear-gradient(180deg, #feae2d 0%, #ef8609 100%) 0%
      0% no-repeat padding-box;

    .toggleSystem {
      color: #fff;
    }

    div[level]:hover {
      background: #b97b1c;
    }

    .level-2 {
      color: #fff;
      background-color: #d28a1f;
    }

    .router-link-exact-active {
      background-color: #b97b1c;
    }

    .level-1 span.title::before {
      background-color: #fff;
    }
  }

  .main-right {
    .tabNav .tabChecked {
      background-color: #fdad2c;
      border-color: #fdad2c;
      color: #fff;
    }
  }

  .tabNav .tabChecked .bgnone {
    background-color: #fdad2c;
  }
}

.main-right {
  min-width: 1040px;
  flex: 1;
  border-left: 1px solid #e8e8e8;
  position: relative;

  /deep/.el-badge {
    vertical-middle: normal;
  }
}

.main-right-content {
  height: calc(100% - 45px);
  padding: 15px 20px;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
  // position: relative;
}

.maximize {
  width: 56px;
  height: 56px;
  position: absolute;
  right: 20px;
  bottom: 14px;
  z-index: 99999999999999999999;
}

.displayArrow {
  z-index: 10;
  transition: left 0.2s ease 0s;
}

.pngf {
  position: absolute;
  display: block;
  width: 17px;
  height: 61px;
  top: 50%;
  margin-top: -30px;
  outline: none;
}

.pngfix {
  background: url("./../boStatic/images/icon_arrow.png") no-repeat 0 0;
}

.pngfix:hover {
  background-position: right 0px;
}

.pngfixshow {
  background: url("./../boStatic/images/icon_arrow.png") no-repeat 0 bottom;
}

.pngfixshow:hover {
  background-position: right bottom;
}

.systemicn {
  position: relative;
  top: 2px;
  display: inline-block;
  width: 20px;
  height: 16px;
  margin-right: 2px;
}

.bo {
  background: url("./../boStatic/images/boicn.png") no-repeat 0 0;
}

.cz {
  background: url("./../boStatic/images/czicn.png") no-repeat 0 0;
}

.ly {
  background: url("./../boStatic/images/lyicn.png") no-repeat 0 0;
}

.bg {
  background: url("./../boStatic/images/bgicn.png") no-repeat 0 0;
}

.aniShow {
  width: 260px;
  transition: width 0.2s ease 0s;
}

.aniHide {
  width: 0px;
  transition: width 0.2s ease 0s;
}
</style>

<style>
.notify-contact {
  width: 330px !important;
  transition: all 0.3;
}

.el-notification__title {
  font-weight: 400;
}
</style>



<style lang="less">
/*  左侧导航上的站点系统服务样式，写在navTopSel.vue中不起作用  */

.mainLeftCitiesSelect {
  top: 60px !important;
  left: 275px !important;

  .el-select-dropdown__wrap {
    max-height: none;
  }

  .popper__arrow {
    left: -7px !important;
    top: 34px !important;
    border-left-width: 0 !important;
    border-right-color: #ebeef5 !important;
    border-top-width: 6px !important;
    border-bottom-color: transparent !important;

    &:after {
      top: -6px !important;
      margin-left: 1px !important;
      border-left-width: 0 !important;
      border-right-color: #fff !important;
      border-top-width: 6px !important;
      border-bottom-color: transparent !important;
    }
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      vertical-align: top;

      .el-select-dropdown__item {
        width: 165px !important;

        &:after {
          right: 35px !important;
        }
      }
    }
  }
}

.mainLeftCitiesSelect2 {
  top: 110px !important;
  left: 275px !important;

  .el-select-dropdown__wrap {
    max-height: none;
  }

  .popper__arrow {
    left: -7px !important;
    top: 34px !important;
    border-left-width: 0 !important;
    border-right-color: #ebeef5 !important;
    border-top-width: 6px !important;
    border-bottom-color: transparent !important;

    &:after {
      top: -6px !important;
      margin-left: 1px !important;
      border-left-width: 0 !important;
      border-right-color: #fff !important;
      border-top-width: 6px !important;
      border-bottom-color: transparent !important;
    }
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      vertical-align: top;

      .el-select-dropdown__item {
        width: 165px !important;

        &:after {
          right: 20px !important;
        }
      }
    }
  }
}

.mainLeftCitiesSelect3 {
  top: 130px !important;
  left: 275px !important;

  .el-select-dropdown__wrap {
    max-height: none;
  }

  .popper__arrow {
    left: -7px !important;
    top: 34px !important;
    border-left-width: 0 !important;
    border-right-color: #ebeef5 !important;
    border-top-width: 6px !important;
    border-bottom-color: transparent !important;

    &:after {
      top: -6px !important;
      margin-left: 1px !important;
      border-left-width: 0 !important;
      border-right-color: #fff !important;
      border-top-width: 6px !important;
      border-bottom-color: transparent !important;
    }
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      //height: 90px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      //vertical-align: text-top;

      .el-select-dropdown__item {
        // width: 140px !important;
        &:after {
          right: 18px !important;
        }
      }
    }
  }

  .hoverService {
    &:hover {
      color: #409eff;
    }
  }
}

.userSettingCitiesSelect {
  .el-select-dropdown__wrap {
    max-height: none;
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      vertical-align: top;

      .el-select-dropdown__item {
        width: 165px !important;

        &:after {
          right: 35px !important;
        }
      }
    }
  }
}

.userSettingServiceSelect {
  .el-select-dropdown__wrap {
    max-height: none;
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      vertical-align: top;

      .el-select-dropdown__item {
        &:after {
          right: 20px !important;
        }
      }
    }
  }
}

.userSettingSystemSelect {
  .el-select-dropdown__wrap {
    max-height: none;
  }

  .el-select-dropdown__list {
    position: relative;
    padding: 10px 40px;

    .el-icon-close {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ccc;
      cursor: pointer;
    }

    .title {
      overflow: hidden;
      height: 60px;
      border-bottom: 1px solid #e6e6e6;
      padding: 20px 0;
      margin-bottom: 10px;

      .title-left {
        float: left;

        h3 {
          font-size: 20px;
          color: #004f82;
        }
      }

      .title-right {
        float: right;
        padding-top: 6px;

        p {
          display: inline;
          font-size: 14px;
          margin-left: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #ccc;

          &.confirm {
            color: #004f82;
          }

          &.active {
            color: #004f82;
          }
        }
      }
    }
  }

  table {
    tr {
      border-bottom: 10px solid transparent;
    }

    td {
      vertical-align: top;

      .el-select-dropdown__item {
        width: 165px !important;

        &:after {
          right: 20px !important;
        }
      }
    }
  }
}

.colorBlue {
  color: #c5ff9a;
}

.level-link3 {
  padding-left: 6px;
}

.portItemDiv {
  display: flex;
  padding-left: 114px;
  transform: translateY(-30px);

  > div {
    display: flex;
    flex-direction: column;
  }
}
</style>
