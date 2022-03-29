import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../common/http'
import webpackConfig from '../../config'
var buildSystem = webpackConfig.build.buildSystem
var logExtraDataForBuild = webpackConfig.build.logExtraDataForBuild
Vue.use(Vuex);
var ipstr = ''
var socketApi=""
var host = window.location.host
var isLocalhost = host.includes('localhost') || host.includes('192.168.98.170') || host.includes('192.168.98.168') || host.includes('192.168.98.198') || host.includes('192.168.98.172') || host.includes('192.168.98.206')

let ipstr1 = "";
ipstr1 = '192.168.0.113'
let ipstr2 = "";
//ipstr1 = 'erp.wecanintl.com'
//ipstr1 = '192.168.98.178'
//ipstr1 = '192.168.98.161'
//ipstr1= '192.168.0.167'
//ipstr1 = '192.168.0.162'
//ipstr1 = '192.168.0.165'
//ipstr1='192.168.98.203'
//ipstr1 = '192.168.0.115'
//ipstr=host.replace(/localhost|192.168.98.241/g,'192.168.0.115')
if (isLocalhost) {
  // ipstr = '192.168.0.115:8080'
  ipstr = '192.168.0.113'
  ipstr2 = '192.168.98.203:9000'
  if (buildSystem != 'wecan') {
    ipstr = 'erp.hfl-logistics.com'
  }
  socketApi='192.168.98.205:9000'
} else {
  ipstr = host
  ipstr1 = host
  if(host.includes('wecanintl.com')){
    socketApi='erp.wecanintl.com:9001'
  }else if(host.includes('192.168.0.113')){
    socketApi='192.168.98.205:9000'
  }else{
    socketApi='192.168.0.186:9000'
  }

  // 经理审核
  if (host.indexOf('erp')>-1) {
    ipstr2 = 'erp.wecanintl.com:9001'
  }
  else if (host.indexOf('96')>-1) {
    ipstr2 = '192.168.0.186:9000'
  }
  else if(host.indexOf("113")>-1){
    ipstr2 = '192.168.98.203:9000'
  }
}

let paramsObj = (getHrefParams && getHrefParams()) || {}
let system = sessionStorage.system || paramsObj.system || 'bo' //bo outside
//console.log(paramsObj)
if (system == 'outside' && paramsObj.system) {
  localStorage.setItem('system', paramsObj.system)
  sessionStorage.setItem('system', paramsObj.system)

  localStorage.setItem('usrname', decodeURI(paramsObj.usrname))
  sessionStorage.setItem('usrname', decodeURI(paramsObj.usrname))

  localStorage.setItem('ticket', paramsObj.ticket)
  sessionStorage.setItem('ticket', paramsObj.ticket)

  localStorage.setItem('gid', paramsObj.gid)
  sessionStorage.setItem('gid', paramsObj.gid)
}
// console.log(paramsObj)
var publicWebApi = `http://${ipstr || ipstr }/${system=='bo'?'PublicWebApi':'outsidewebapi'}/`
var webApi = `http://${ipstr1 || ipstr}/${system=='bo'?'BoManagementWebApi':'outsidewebapi'}/`

// var publicWebApi = `http://${ipstr}/outsidewebapi/`
// var webApi = `http://${ipstr1 || ipstr}/outsidewebapi/`



var imageWebApi = `http://${ipstr1 || ipstr}/ImageWebApi/`
var imgWebApi = `http://${ipstr}/`

// var publicWebApi = `http://${ipstr}:8090/`

// if (ipstr1 == '192.168.0.165' || ipstr == '192.168.0.165') {
//   webApi = `http://${ipstr1||ipstr}/BoManagementWebApitransfer/`
// }
// var webApi = `http://${ipstr}:8080/`

// 贺朝辉  经理审批
var wcWebApi = `http://${ipstr1 ||ipstr}/${system=='bo'?'WffManagementWebApi':'outsidewebapi'}/`
// var wcWebApi = `http://192.168.98.178/WffManagementWebApi/`
var customWebApi = `http://${ipstr1 ||ipstr}/CustomWebApi/`
var BasicWebApi = `http://${ipstr}/BasicWebApi/`
var feeWebApi=`http://${ipstr2 || ipstr }/fee/api/`
var websocketApi=socketApi

var store = new Vuex.Store({
  state: {
    projectIsWecan: buildSystem == 'wecan', //wecan 或者 hengfeng; 编译为恒丰项目时需要设置 config目录下的index.js中将buildSystem设置为hengfeng
    logExtraDataForBuild: logExtraDataForBuild,
    isLocalhost: isLocalhost,
    publicWebApi: publicWebApi,
    imgWebApi: imgWebApi,
    webApi: webApi,
    imageWebApi: imageWebApi,
    wcWebApi,
    customWebApi,
    BasicWebApi,
    feeWebApi,
    websocketApi,
    tableTmpAll: [],
    userSettingTmpAll: [],
    tablePageTmp: {},
    childrenTableTmpAll: [],
    childrenTablePageTmp: {},
    showloading: false,
    mainSearch: false, //全局的订单详细页面，在某些页面跳转到订单详细页面
    searchData: {},
    airLineSearchData: {
      show: false
    },
    customeData: {
      show: false
    },
    cities: "", //权限中包含的站点，所有可选的站点
    areaState: "", //左侧菜单栏选择的站点
    areaStateCode: "", //所选站点的三字码
    systemCheck: "", //左侧菜单栏选中的系统
    allServiceCheck: [], //左侧菜单栏所有可选的服务
    serviceState: "", //左侧菜单栏选中的服务
    ifServicesAllChecked: false, //是否左侧的服务全选了
    rwxdArr: ['AA0510', 'AG0115', 'AG0120', 'AG0125', 'AG0130', 'AA0810', 'AA0830', 'AA0840', 'AA0850', 'AG0110'], //需要任务下达的服务节点
    ifMergeHawb: true, //是否分单合并
    ifLimitSearch: true, //是否禁止查询列表的查询条件为空，方便全局控制
    isWorkUnFinish: false, // 当前账号是否是被控状态
    navDataById: {}, //导航数据
    tableHeadShow: true, //用于切换左侧导航列的时候出发表格固定表头重新渲染
    sameTableHeadValue: {}, //存储相同表格模板的已选value值，key为sameTableHeadComp的index值
    sameTableHeadComp: [ // 需要同步表格模板的组件名称，每个数组表示该数组内的组件需要同步
      [ // 综合查询
        'orderSearch.vue',
        'orderTaking.vue', // 外站订单
        'businessUquery.vue', // 订单未分配
        'orderUnfinish.vue', // 操作未完成
        'customerSearch.vue' // 客服综合查询
      ],
      [ // 费用未确认
        'costConfirmation.vue',
        'costConfirmStation.vue',
        'costConfirmationCancel.vue',
        'costConfirmationBack.vue',
        'costMakingApSearchCzz.vue',
        'costMakingApSearch.vue',
        'hxCancel.vue',
      ],
      [ // 未提交结算
        'ownSubmissionStl.vue',
        'ownSubmissionStation.vue',
        'orderCancel.vue',
      ],
      [ // 海外
        'costConfirmFob.vue',
        'costCheckFob.vue',
        'reconMngFirFob.vue',
      ],
      [ // AMS发送
        'amsSendDirect.vue',
        'amsSendManual.vue',
        'companyDzLetterSearch.vue',
        'amsCargoPouch.vue'
      ]
    ],
    area_port: { // 区域端口
      '上海': '',
      '杭州': ':200',
      '香港': ':201',
      '北京': ':202',
      '西安': ':203',
      '广州': ':204',
      '昆明': ':205',
      '成都': ':206',
      '重庆': ':207',
      '厦门': ':208',
      '宁波': ':209',
      '深圳': ':210',
      '郑州': ':211',
      '武汉': ':212',
      '青岛': ':213',
      '南京': ':214'
    },
    systemArrList: [{
        label: "出口",
        options: [{
            value: "空出",
            title: "空运"
          },
          {
            value: "海出",
            title: "海运"
          },
          {
            value: "陆出",
            title: "陆运"
          },
          {
            value: "铁出",
            title: "铁运"
          }
        ]
      },
      {
        label: "进口",
        options: [{
            value: "空进",
            title: "空运"
          },
          {
            value: "海进",
            title: "海运"
          },
          {
            value: "陆进",
            title: "陆运"
          },
          {
            value: "铁进",
            title: "铁运"
          }
        ]
      },
      {
        label: "国内服务",
        options: [{
          value: "国内服务",
          title: "国内服务"
        }]
      }
    ],
    emailpushlist: sessionStorage.getItem('out_emailpushlist') || '', //外网邮件推送
    smspushlist: sessionStorage.getItem('out_smspushlist') || '', //外网短信推送
    status: '',
    contactList:[],
    pushMessageList:{
      type: null,
      data:[],
      index:null,
    },
    // 聊天室主体   状态    /  订单数据 
    chatStore:{
      roomStatus:false, 
      data:null
    },
    // websoket 推送的聊天数据 / 
    websoketPushChatData:{
      data:[],
      obj:{}
    },
    // 已读/未读  消息历史记录
    readMessageList:[],
    // 订单 节点联系人
    orderNodenameList:[],
    // 节点联系人
    nodemanList:[],
    againShow:false,
    // 情况补充说明 - 模块区分
    situationState: ""
  },
  getters: {
    userSetting: state => {
      // 没有设置时使用默认值
      if (state.userSettingTmpAll.length == 0) {
        return {
          autoSearch: false, // 自动搜索设置
          autoCollapse: false, // 搜索后自动折叠查询条件设置
          showSystemCount: false, //默认显示左侧菜单待处理的票数
          refreshInterval: 60,
          showInfoList: false, // 显示订单详细摘要信息
          wageoutCarryIn: false, // 自动应付带应收
          mawbAddType: '', // 订单新增类型
          // 搜索默认设置
          areaChecked: '', // 区域设置
          systemChecked: '', // 系统设置
          serviceChecked: '', // 服务设置
          serviceCheckedSystem: '', // 服务代码对应的系统，index一一对应
          // 订单新增默认设置
          mawbAddArea: '', // 默认站点
          mawbAddSystem: {
            opersystem: '',
            opersystemdom: ''
          }, // 默认系统
          mawbAddService: '', // 默认服务
          amsOpen: true,
          defaultCurrency: '人民币', // 新增费用默认币种
          showSearchTotalInfo: true // 显示查询后的汇总信息
        }
      }
      // 暂时不按系统区分设置，只需要取其中一个设置来使用就行，更新的时候会所有系统的设置同步更新
      let setting = state.userSettingTmpAll.find(i => (i.project == 'bomanagement'))
      let json = JSON.parse(setting.jsondata)

      if (json.autoSearch === undefined) json.autoSearch = false
      if (json.autoCollapse === undefined) json.autoCollapse = false
      if (json.showSystemCount === undefined) json.showSystemCount = false
      if (json.refreshInterval === undefined) json.refreshInterval = 60
      if (json.showInfoList === undefined) json.showInfoList = false
      if (json.wageoutCarryIn === undefined) json.wageoutCarryIn = false
      if (json.mawbAddType === undefined) json.mawbAddType = '出口'
      if (json.areaChecked === undefined) json.areaChecked = ''
      if (json.systemChecked === undefined) json.systemChecked = ''
      if (json.serviceChecked === undefined) json.serviceChecked = ''
      if (json.serviceCheckedSystem === undefined) json.serviceCheckedSystem = ''
      if (json.mawbAddArea === undefined) json.mawbAddArea = ''
      if (json.mawbAddSystem === undefined) json.mawbAddSystem = {
        opersystem: '',
        opersystemdom: ''
      }
      if (json.mawbAddService === undefined) json.mawbAddService = ''
      if (json.amsOpen === undefined) json.amsOpen = false
      if (json.defaultCurrency === undefined) {
        if (state.areaState === '香港') {
          json.defaultCurrency = '港币'
        } else {
          json.defaultCurrency = '人民币'
        }
      }
      if (json.showSearchTotalInfo === undefined) json.showSearchTotalInfo = true
      return json
    },
    mawbImportTemplateAll: state => {
      return state.tableTmpAll.filter(i => {
        return i.type == 120
      })
    },
    // 状态配色默认模板
    defaultStatusColorTemp(state) {
      return state.tableTmpAll.filter(i => {
        return i.name === '' && i.type === 150
      })[0]
    },
    // 用户状态配色模板
    statusColorTempAll(state) {
      return state.tableTmpAll.filter(i => {
        return i.name !== '' && i.type === 150
      })
    }
  },
  mutations: {
    setTableTmpAll(state, val) {
      if (val.index) {
        Vue.set(state.tableTmpAll, val.index, val.value)
      } else {
        state.tableTmpAll = val;
      }
    },
    setTableData(state, val) {
      Vue.set(state.tablePageTmp, val[0], val[1])
    },
    setChildTableTmpAll(state, val) {
      state.childrenTableTmpAll = val;
    },
    setChildTableData(state, val) {
      Vue.set(state.childrenTablePageTmp, val[0], val[1])
    },
    setAreaState(state, val) {
      state.areaState = val;
    },
    setCities(state, val) {
      state.cities = val;
    },
    setAreaStateCode(state, val) {
      state.areaStateCode = val;
    },
    setServiceState(state, val) {
      state.serviceState = val;
    },
    setifServicesAllChecked(state, val) {
      state.ifServicesAllChecked = val;
    },
    setSystemCheck(state, val) {
      state.systemCheck = val;
    },
    setAllServiceCheck(state, val) {
      state.allServiceCheck = val;
    },
    setTableHeadShow(state, val) {
      state.tableHeadShow = val;
    },
    setSameTableHeadValue(state, val) {
      state.sameTableHeadValue = val
    },
    setMainSearch(state, val) {
      state.searchData = val
    },
    searchData(state, val) {
      if (val.active == '航线') {
        state.airLineSearchData = val
      } else if (val.active == '客服') {
        state.customeData = val
      }
    },
    setUserSettingTmpAll(state, val) {
      state.userSettingTmpAll = val
    },
    setIsWorkUnFinish(state, val) {
      state.isWorkUnFinish = val
    },
    setNavDataById(state, val) {
      state.navDataById = val
    },
    setEmailpushlist(state, val) {
      sessionStorage.setItem('out_emailpushlist', val)
      state.emailpushlist = val
    },
    setSmspushlist(state, val) {
      sessionStorage.setItem('out_smspushlist', val)
      state.smspushlist = val
    },
    setGroupData(state, val) {
      //state.groupData=[]
      // val.forEach(i => {
      //   state.groupData.push(i)  
      // })
      state.groupData = val
    },
    setStatus(state, val) {
      state.status = val
    },
    setAgainShow(state,val){
      state.againShow = val
    },

    /**
     * @description:  @通知历史列表记录   
     * @param {*} state    pushMessageList 列表数据
     * @param {*} payload
     * @return {*}
     */    
    setPushMessage(state, payload) {
      console.log(payload)
      if( payload.type === "add"){
        state.pushMessageList.data.push(payload.data)
      } else if(payload.data && payload.data.type === "delete"){
        state.pushMessageList = []
      } else if( payload.type === 'clear') {
        state.pushMessageList.data.splice(0)

      } else if(payload.id){
        var historyList = state.pushMessageList.data
        for(let i = 0; i < historyList.length; i++){
          if(historyList[i].boguid === payload.id){
            state.pushMessageList.data.splice(i,1)
          }
        }
      }
      
    },
    /**
     * @description: 聊天框口的状态以及数据
     * @param {*} state  status 聊天窗口状态  data 订单对象的信息(boguid, guid ......)
     * @param {*} payload.status   入口组件传递过来的数据  
     * @return {*}
     */    
    setChat(state, payload){
     
      // state.chatStore.roomStatus = payload.status
        if(payload.status === true ){
          state.chatStore.roomStatus = true
          if(payload.data){
            state.chatStore.data = payload.data
          }
          
          
          // state.pushMessageList.data
          console.log(state.chatStore)

        } else if (payload.status === false) {
          state.chatStore.roomStatus = false
          state.chatStore.data = null
          state.websoketPushChatData.data = null
        } else if(payload.status === 'minimize' ){
          state.chatStore.roomStatus = false
        } else if(payload.status === 'maximize' ){
          state.chatStore.roomStatus = true 
        }
        console.log(state.chatStore)
        console.log(state.chatStore.data)
    
    },

    /**
     * @description: 
     * @param {*} state  data  历史数据     obj 新发送的数据 
     * @param {*} payload  入口组件传递过来的数据  
     * @return {*}
     */    
    setWebsoketPushChatData(state, payload){  
      if(payload.data){                                             
        state.websoketPushChatData.data = payload.data
        console.log(state.websoketPushChatData.data)
      }else if(payload.obj){
        state.websoketPushChatData.data.push(payload.obj)
      }
    },
    // 已读/未读 历史订单记录 修改
    setreadMessageList(state, payload){
      if(payload.status === "add"){
        payload.data.forEach(item => {
          state.readMessageList.push(item.guid)
        })
        
        console.log(state.readMessageList)
      } else if(payload.status === "addOne"){
        state.readMessageList.push(payload.guid)
      } else if(payload.status = "delete"){
        console.log("执行了 delete")
        for(var i = 0; i < state.readMessageList.length; i++){
           if(state.readMessageList[i] === payload.guid){
            state.readMessageList.splice(i, 1);
           }
        }
      }
      console.log("===========================")
      console.log(state.readMessageList)
    },

    // 订单节点联系人
    setorderNodenameList(state, payload){
      state.orderNodenameList = payload.data
    },
    // 节点联系人
    setnodemanList(state, payload){
      if(payload.status === "add"){
        state.nodemanList = payload.data
      } else if(payload.status === "clear"){
        state.nodemanList = []
      }
    },
    // 修改 状态
    setSituationState(state, payload){
      state.situationState = payload
    }
  },
  actions: {
    updateUserSetting({
      commit,
      state
    }, setting) {
      return new Promise((resolve, reject) => {
        // type: 110用户设置
        let userSettingTmpAll = JSON.parse(JSON.stringify(state.userSettingTmpAll))

        let newUserSettingJSON = JSON.stringify(setting)
        let method = "";
        let data = [];
        let logExtraData = logExtraDataForBuild
        if (userSettingTmpAll.length == 0) {
          // 初次修改时模板里没有这些设置， 直接进行新增
          method = "post";
          data = [{
              logname: localStorage.getItem("usrname"),
              isactivate: 1,
              name: "userSetting",
              type: 110,
              url: "all",
              project: "bomanagement",
              czman: localStorage.getItem("usrname"),
              logExtraData: logExtraData,
              jsondata: newUserSettingJSON
            },
            {
              logname: localStorage.getItem("usrname"),
              isactivate: 1,
              name: "userSetting",
              type: 110,
              url: "all",
              project: "wffmanagement",
              czman: localStorage.getItem("usrname"),
              logExtraData: logExtraData,
              jsondata: newUserSettingJSON
            }
          ];
        } else {
          method = "put";
          userSettingTmpAll.forEach(item => {
            data.push({
              id: item.id,
              logname: localStorage.getItem("usrname"),
              isactivate: item.isactivate,
              name: item.name,
              type: item.type,
              url: item.url,
              project: item.project,
              czman: localStorage.getItem("usrname"),
              logExtraData: logExtraData,
              jsondata: newUserSettingJSON
            });
          });
        }

        axios({
          method: method,
          url: state.publicWebApi + "api/UserTempletList",
          data,
          noarea: true,
          loading: true,
          tip: true
        }).then(async result => {
          if (result.data.resultstatus == 0) {
            if (method == "post") {
              // 如果是新增，则需要重新请求获取数据保证拿到id，否则没有id后续更新会出错
              let promises = ["bomanagement", "wffmanagement"].map(project => {
                return axios({
                  method: "get",
                  url: state.publicWebApi + "api/UserTemplet",
                  params: {
                    logname: localStorage.getItem("usrname"),
                    project
                  },
                  loading: false,
                  tip: false
                }).then(result => {
                  console.log(result.data)
                  return {
                    ...result.data.find(i => i.type == 110),
                    project
                  };
                });
              });

              await Promise.all(promises).then(userSettingTmpAll => {
                commit("setUserSettingTmpAll", userSettingTmpAll);
              })
            } else {
              userSettingTmpAll = userSettingTmpAll.map(i => {
                i.jsondata = newUserSettingJSON;
                return i;
              });
              commit("setUserSettingTmpAll", userSettingTmpAll);
            }
          }
          resolve(result)
        })

      })
    },
    updateXmdata({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: state.publicWebApi + "api/PubCustom",
          params: {
            type: "all",
            comxz: "-1",
            area: "",
            timestamp: 0,
            system: ""
          },
          loading: false
        }).then(results => {
          //usr_status=  1有效 2无效
          let xmdata1 = results.data.filter(e => e.usr_status_cw == 1).map(i => {
            delete i.isdmdlgys;
            delete i.comhy;
            delete i.iskyydgys;
            delete i.khjcno;
            delete i.zddlcode;
            delete i.zddlzh;
            delete i.zdiatacode;
            //delete i.usr_status_cw;
            return i;
          });
          // commit('setXmdata', xmdata);
          window.xmdata = xmdata1
          resolve()
        });
      })
    }
  }

})


export default store
