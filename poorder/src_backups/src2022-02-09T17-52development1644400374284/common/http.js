import axios from 'axios'
import router from '../router'
import {
  Message,
  MessageBox
} from 'element-ui';
import store from "../store"
import {
  Logout,
  formatDate
} from "@/api/localStorage.js"
axios.defaults.timeout = 90000;

// 添加请求拦截器
// var CancelToken = axios.CancelToken;
// var source = CancelToken.source();

axios.interceptors.request.use(function (config) {
 
  // 在发送请求之前做些什么
  if (sessionStorage.loginDate) {
    if (formatDate(new Date(Number(sessionStorage.loginDate)), 'yyyy-MM-dd') !== formatDate(new Date(), 'yyyy-MM-dd')) {
      store.state.showloading = false
      MessageBox.confirm('您的登录已过期，请重新登录！', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        showClose: false,
        type: 'warning'
      }).then(() => {
        Logout();
      })
      return;
    }
  }
  // if(!sessionStorage.limitTime){
  //   sessionStorage.setItem('limitTime', new Date().getTime())
  // }else{
  //   if((Number(new Date().getTime())-Number(sessionStorage.limitTime))>30*60*1000){
  //     store.state.showloading = false
  //     MessageBox.confirm('您的登录已过期，请重新登录！', '提示', {
  //       confirmButtonText: '确定',
  //       showCancelButton: false,
  //       closeOnClickModal: false,
  //       closeOnPressEscape: false,
  //       closeOnHashChange: false,
  //       showClose: false,
  //       type: 'warning'
  //     }).then(() => {
  //       sessionStorage.removeItem("limitTime");
  //       Logout();
  //     })
  //     return;
  //   }else{
  //     sessionStorage.setItem('limitTime', new Date().getTime())
  //   }
  // }

  var area = store.state.areaState
  //config.onUploadProgress=function(progressEvent){//console.log( (progressEvent.loaded / progressEvent.total * 100 | 0) + '%')}
  if (process.env.buildVersionNumber && process.env.NODE_ENV == "production") {
    config.headers['System'] = sessionStorage.system || 'bo'
    config.headers['Version'] = process.env.buildVersionNumber
  }

  let token = sessionStorage.getItem('ticket')
  if (token) {
    config.headers.Authorization = token; //携带权限参数
  } else {
    router.push({
      name: 'login'
    })
  }
  if (config.loading == true) {
    store.state.showloading = true
  };

  if (config.method != "get") {
    config.data.czman = config.data.czman || localStorage.getItem('usrname')
    config.data.logExtraData = store.state.logExtraDataForBuild

    if (!config.data.dom) {
      config.data.dom = '出口部'
    }


    if (!config.data.czman) {
      Message({
        type: 'error',
        message: '无操作人数据，请重新登录！',
        duration: 1800
      })
      return
    }


    if (!config.noarea&&sessionStorage.system!='outside') {
      if (!config.data.area) {
        if ((!area || (area.split(',').length !== 1))) {
          Message({
            type: 'error',
            message: '请选择指定区域！',
            duration: 1800
          })
          return
        } else {
          config.data.area = area
        }
      }
    }

  } else {
       if (config.params.json && !area&&sessionStorage.system!='outside') {
          Message({
            type: 'error',
            message: '请选择指定区域！',
            duration: 1800
          })
          return;
        }



    
    if (config.params.json) {
      let newconfig = JSON.parse(config.params.json)
      //console.log(config.params.routerName)
      //console.log(config.params.json)
      //console.log(router.currentRoute.name)
      let curRoute = config.params.routerName || router.currentRoute.name
      if (curRoute == 'documentConfirmation') {
        curRoute = localStorage.documentConfirmation || 'danhaoConfirm'
      }

      if (!newconfig.where.area && !config.noarea&&sessionStorage.system!='outside') {
        if (area.split(',').length == 1) {
          newconfig.where.area = area
        } else {
          // let authorityAreas = store.state.cities.map(i => i.options).flat().map(i => i.value); //权限中所有可选的站点
          // let authorityAreas = store.state.cities.map(i => i.options).flat().map(i => i.value); //权限中所有可选的站点
          let localAreas = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53).map(i => i.typename); //本地缓存中所有可选的站点
          //当两者相等时不传，
          if (area.split(',').length < localAreas.length) {
            newconfig.where.area = {
              in: area
            }
          }
        }
      }
      if (!newconfig.where.dom && !config.nodom&&sessionStorage.system!='outside') {
        newconfig.where.dom = '出口部'
      }
      if (!newconfig.where.service&&sessionStorage.system!='outside') {
        if (!store.state.ifServicesAllChecked) {
          newconfig.where.servicecodelist = store.state.serviceState
        }
      }
      if (store.state.systemCheck && !config.nosystem&&sessionStorage.system!='outside') {
        if (curRoute == 'customsContactSend') {
          if (store.state.systemCheck != '国内服务') {
            newconfig.where.system = {
              in: store.state.systemCheck.split(',').filter(i => i != '国内服务').join()
            }
          }
        } else {
          newconfig.where.system = {
            in: store.state.systemCheck
          }
        }
      }
      //console.log(router.currentRoute.params)
      if (router.currentRoute.params && router.currentRoute.params.id && !config.nosystem&&sessionStorage.system!='outside') {
        let othername = store.state.navDataById[router.currentRoute.params.id].othername
        if (othername && othername.includes('操作')) {
          newconfig.where.system = {
            in: othername.includes('国内') ? '国内服务' : othername.substr(0, 2)
          }
        }
      }

      if (newconfig.where && !config.nofield) {
        let showField = []
        if (store.state.tablePageTmp[curRoute]) {
          showField = store.state.tablePageTmp[curRoute][0].concat(store.state.tablePageTmp[curRoute][1])
        }

        let allField = {
          'reason': 'examineremark,cancelreason,routedelreason,delbillreason,overseasaccreason,wagecommitreason',
          'fpbl_in': 'self_real_bp_freight_in,cus_real_bp_freight_in',
          'fpbl_out': 'self_real_bp_freight_out,cus_real_bp_freight_out',
          'freightfee_in': 'currencyin,inwageallinprice',
          'freightfee_out': 'currencyout,outwageallinprice',
          'ybjzt': 'ybpiece,ybweight,ybvolume',
          'sjjzt': 'realpiece,realweight,realvolume',
          'signjzt': 'signpiece,signweight,signvolume', //签单件重体
          'dzjzt': 'zdpiece,zdweight,zdvolume',
          'profitquota': 'profitmode,self_profitvalue,cus_profitvalue,profitprice,currency',
          'mawbjzt': 'mawbzdpiece,mawbzdweight',
          'hawbjzt': 'hawbzdpiece,hawbzdweight',
          'mawbjz': 'zdpiece,zdweight'
        }
        let showAllField = ['axplineDzHawbSearch', 'amsSendDirect', 'amsSendManual', 'axplineDzMawbSearch', 'companyDzLetterSearch', 'credentialMng', 'credentialMngOut', 'customsContactSend', 'manifastSearch', 'orderTaking', 'reconciliationMng', 'reconciliationMngOut', 'reconMngSecOut', 'settleSearch', 'settleSearchOut', 'amsCargoPouch', 'cwSearch', 'airLineSearch', 'masterSearch', 'asignSearch', "asignSpaceSearch","tzOperation","mawbManageNew","alertManage"] //查询全部字段

        let arr = ['isclock', 'mawb', 'system', 'opersystem', 'boguid', 'area', 'guid', 'status', 'fid', 'gid', 'realgid', 'boardgys', 'confirmstatus_in', 'confirmstatus_out', 'wageall_in', 'wageall_out', 'wageprofit', 'ybpiece', 'ybweight', 'ybvolume', 'realpiece', 'realweight', 'realvolume', 'zdpiece', 'zdweight', 'zdvolume', 'yqhbh', 'yqhbrq', 'hbrq', 'rejectstatus', 'commbillmodifystatus', 'hawbnum', 'orderdom', 'czlx', 'cancelreason', 'canceling', 'tgreason', 'iscomboine', 'pono', 'shipperno']

        if (showAllField.indexOf(curRoute) != '-1' || showField.length == 0) {
          arr = ['']
        } else if (curRoute == 'businessUquCancel' || curRoute == 'businessUquery') {
          arr = arr.concat(['islocal', 'isreject', 'creditisbackstatus', 'serviceguid', 'status', 'iscomboine', 'comboine', 'isinwageallin'])
        } else if (curRoute == 'cabinUnconfirmed') {
          arr = arr.concat(['islocal', 'isreject', 'creditisbackstatus', 'childguid'])
        } else if (curRoute == 'costMakingApSearch' || curRoute == 'costMakingApSearchOperate') {
          arr = arr.concat(['islocal'])
        } else if (curRoute == 'costConfirmation' || curRoute == 'costConfirmationBack' || curRoute == 'costConfirmationCancel' || curRoute == 'costConfirmStation' || curRoute == 'costConfirmationMonitor') {
          arr = arr.concat(['wageall_in', 'wageall_out', 'wageprofit', 'wagerejectstatusout', 'wagerejectstatusin', 'childguid','tzType','sett_axpid'])
        } else if (curRoute == 'costMakingApSearchCzz') {
          arr = arr.concat(['islocal', 'commitstatus'])
        } else if (curRoute == 'creditControl') {
          arr = arr.concat([])
        } else if (curRoute == 'documentConfirm') {
          arr = arr.concat(['hbh', 'islocal'])
        } else if (curRoute == 'orderCancel') {
          arr = arr.concat([])
        } else if (curRoute == 'orderConfirm') {
          arr = arr.concat(['hbh', 'islocal'])
        } else if (curRoute == 'orderIncomplete') {
          arr = arr.concat(['islocal', 'isreject', 'creditisbackstatus', 'serviceguid'])
        } else if (curRoute == 'orderSearch') {
          arr = arr.concat(['hbh', 'islocal', 'czlx', 'system', 'sfg', 'mdg', 'hbrq', 'currencyin', 'inwageallinprice', 'iscomboine', 'comboine', 'isinwageallin', 'companytitle_shr_mawb', 'companytitle_fhr_mawb', 'hwlx', 'hwxz', 'hbzl', 'dzstatus', 'companytitle_shr_hawb', 'companytitle_fhr_hawb'])
        } else if (curRoute == 'orderUnfinish') {
          arr = arr.concat(['hbh', 'islocal'])
        } else if (curRoute == 'ownSubmissionStation' || curRoute == 'ownSubmissionStl') {
          arr = arr.concat([])
        } else if (curRoute == 'managerExamine') {
          arr = arr.concat(['realwagein', 'realwageout', 'realprofit', 'realprofitrmb', 'cny_wagein', 'cny_wageout', 'usd_wagein', 'usd_wageout', 'eur_wagein', 'eur_wageout', 'hkd_wagein', 'hkd_wageout', 'storeinfo', 'id', 'wagedom', 'realwageoutrmb', 'realwageinrmb', 'accountweightin_sett', 'examineisback_sett', 'examineremark_sett', 'backjson', 'wagerejectstatusin', 'wagerejectstatusout','tzType','salesDzstatus'])
        } else if (curRoute == 'customerSearch') {
          arr = arr.concat(['shipaceid'])
        } else if (curRoute == 'danhaoConfirm' || curRoute == 'danzhengConfirm') {
          arr = arr.concat(['mawbnoconfirmstatus', 'hawbnoconfirmstatus', 'mawbconfirmstatus', 'hawbconfirmstatus', 'realhwstatus'])
        } else if (curRoute == 'listConfirm') {
          arr = arr.concat(['iscomboine', 'pono', 'inwageallinprice', 'inwageallinprice_trans', 'self_real_bp_freight_in', 'cus_real_bp_freight_in', 'self_real_bp_trans_in', 'cus_real_bp_trans_in', 'orderguid', 'profitmode', "creditisbackstatus", 'outsidedom', 'operguid', 'customprice', 'hbzl', 'ddrq', 'priceabout', 'isshipace'])
        } else if (curRoute == 'pfreportSearch' || curRoute == 'txdreportSearch') {
          arr = arr.concat(['hbrq', 'qfsj', 'hbh', 'nothawbnum', 'mawbtype', 'pactlsendstatus'])
        } else if (curRoute == 'gnSearch') {
          arr = arr.concat(['truckgid'])
        } else if (curRoute == 'costConfirmationkf'||curRoute == 'gnCostConfirm') {
          arr = arr.concat(['wagerejectstatusin', 'wagerejectstatusout','tzType','sett_axpid'])
        }else if(curRoute=='costConfirmFob'||curRoute=='costCheckFob'){
          arr=arr.concat(['wagerejectstatusin'])
        }else if(curRoute=='frmCustomJob'){
          arr=arr.concat(['id','sid','backstatus','creditcontent','creditisbackstatus','isdel','isinwageallin','lockstatus','locktitle','locktype','remark','usr_code','approvalstatus'])
        }

        if (showAllField.indexOf(curRoute) == '-1') {
          showField.forEach((item, index) => {
            if (allField[item.field]) {
              arr = arr.concat(allField[item.field].split(','))
            } else {
              if (item.field != 'operation' && item.field != 'checkbox')
                arr.push(item.field)
            }
          })
        }
        newconfig.select = [...new Set(arr)].toString() //去重复字段
        if (!newconfig.select || curRoute == 'frmSystemWage') { //价格管理不传select
          delete newconfig.select
        }
      }
      config.params.json = JSON.stringify(newconfig)
      if(sessionStorage.system!='outside'){
         config.params.czman = config.params.czman || localStorage.usrname
      }
    }

    if (config.params.area&&sessionStorage.system!='outside') {
      config.params.area = config.params.area
    }

  }

  if (config.method == 'get' && !store.state.projectIsWecan && JSON.stringify(config.params).includes('唯凯')) {
    config.params = JSON.parse(JSON.stringify(config.params).replace('唯凯', '恒丰')) //方便恒丰项目在本地调试
  }
  return config;
}, function (error) {
  Message({
    type: 'error',
    message: error.data.resultmessage,
    duration: 1800
  })

  return Promise.reject(error.data.resultmessage);
  //return Promise.reject(error);
});



// 添加响应拦截器
axios.interceptors.response.use(async function (response) {
  //  console.log(response)
  if (!response) {
    Message({
      type: 'error',
      message: '请求错误',
      duration: 1800
    })
    throw '请求错误或被拦截';
  }
  if (response.config.loading == true) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        store.state.showloading = false
        resolve()
      }, 5)
    })
  }


  if (response.data && response.data.resultstatus == 666666) {
    MessageBox.confirm(response.data.resultmessage, '紧急提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      showClose: false,
      type: 'warning'
    }).then(() => {
      Logout()
    })
    throw '请求错误或被拦截';
  }


  if (sessionStorage.getItem("ticket")) {
    if (response.data && response.data.resultstatus && response.data.resultstatus != 0) {
      if (response.config.tip == true || response.data.resultstatus == 66666) {
        Message({
          type: 'error',
          message: response.data.resultmessage,
          duration: 1800
        })
        throw '请求错误或被拦截';
      }
    } else {
      if (response.config.tip == true) {
        Message({
          type: 'success',
          message: '成功',
          duration: 1000
        })
      }

    }


  }

  return response;
}, async function (error) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      store.state.showloading = false
      resolve()
    }, 5)
  })
  ////console.log(error.response.status)
  // 对响应错误做点什么
  if (error.response.status) {

    if (error.response.status == 401) {
      router.push({
        path: '/login'
      })
    }

    if (error.response.status != 200) {
      Message({
        type: 'error',
        message: '请求错误',
        duration: 1800
      })

    }

    if (error.response.status == 408) {
      Message({
        type: 'error',
        message: '请求超时',
        duration: 1800
      })
    }
    if (error.response.status == 500) {
      Message({
        type: 'error',
        message: '服务器错误',
        duration: 1800
      })

    }
    return Promise.reject(error);
  }
});



export default axios;
