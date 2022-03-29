import formCompt from '../templates/formCompt.vue';
import newFormCmpt from '../templates/newFormCmpt.vue';
import newSearchComp from '../templates/newSearchComp.vue';
import tableCompt from '../templates/tableCompt.vue';
import commonTable from '../templates/commonTable.vue';
import serviceItem from '../templates/serviceItem.vue';
import jjdwh from '../templates/jjdwh.vue';
import jsdxwh from '../templates/jsdxwh.vue';

import hwxzCompt from '../templates/hwxzCompt.vue';
import hwxzComptNew from '../templates/hwxzComptNew.vue';
import loading from '../templates/loading.vue';
import commonTabs from '../templates/commonTabs.vue';//自定义的tab切换表头
import newOrderAdd from '@/components/newOrderAdd'

import costTable from '../orderDetails/costTable.vue';
import infoList from '../orderDetails/infoList.vue';
import mawbaddput from '../orderDetails/mawbAddPut.vue';
import cancelReason from '../orderDetails/cancelReason.vue';
import costmaking from "../orderDetails/costMaking"
import costmakingApply from "../orderDetails/costMakingApply"
import costControlTool from '../orderDetails/costControlTool' //成本分摊工具
import shareRecord from '../orderDetails/shareRecord' //分摊记录
import cancelOper from '../orderDetails/cancelOper' //撤单

import myInput from '../smallTemplate/myInput' //一般输入框
import myAlert from '../smallTemplate/myAlert' //
import myRadio from '../smallTemplate/myRadio' //单选
import multiSelect from '../smallTemplate/multiSelect' //下拉多选
import mySelect from '../smallTemplate/mySelect' //
import explainTooltip from '../smallTemplate/explainTooltip' //
import currencySelect from '../smallTemplate/currencySelect' //币种下拉
//import mytabs from '../smallTemplate/mytabs' //币种下拉

import pageSelect from '../smallTemplate/pageSelect' //
import setBhicon from "../orderDetails/setBhicon"
import areaSelect from '@/components/smallTemplate/areaSelect'
import switchTabs from '@/components/smallTemplate/switchTabs' 
import goodsInfo from '@/outsideDom/orderDetails/goodsInfo'
import docUpload from '@/components/docSystem/docUpload'

// const components = [
//   formCompt,
//   newFormCmpt,
//   newSearchComp,
//   tableCompt, commonTable, serviceItem ,  costTable ,  infoList ,  myInput ,  myAlert ,  myRadio ,  explainTooltip ,  multiSelect ,
//    mySelect ,  currencySelect ,  pageSelect ,  hwxzCompt ,  loading ,  jjdwh ,  jsdxwh ,  mawbaddput ,  cancelReason ,  costmaking ,  costmakingApply ,
//    costControlTool ,  shareRecord ,  cancelOper
// ]

export default (Vue) => {
    //  components.forEach(component => {
    //   Vue.component(component.name, component);//需要在组件中定义组件名
    // });
  Vue.component("formCompt", formCompt);
  Vue.component("newFormCmpt", newFormCmpt);
  Vue.component("newSearchComp", newSearchComp);
  Vue.component("tableCompt", tableCompt);
  Vue.component("commonTable", commonTable);
  Vue.component("serviceItem", serviceItem);
  Vue.component("costTable", costTable);
  Vue.component("infoList", infoList);
  Vue.component("myInput", myInput);
  Vue.component("myAlert", myAlert);
  Vue.component("myRadio", myRadio);
  Vue.component("commonTabs", commonTabs);
  Vue.component("explainTooltip", explainTooltip);
  Vue.component("multiSelect", multiSelect);
  Vue.component("mySelect", mySelect);
  Vue.component("currencySelect", currencySelect);
  Vue.component("pageSelect", pageSelect);
  Vue.component("hwxzCompt", hwxzCompt);
  Vue.component("hwxzComptNew", hwxzComptNew);
  Vue.component("loading", loading);
  Vue.component("jjdwh", jjdwh);
  Vue.component("jsdxwh", jsdxwh);
  Vue.component("mawbaddput", mawbaddput);
  Vue.component("newOrderAdd", newOrderAdd);
  Vue.component("cancelReason", cancelReason);
  Vue.component("costmaking", costmaking);
  Vue.component("costmakingApply", costmakingApply);
  Vue.component("costControlTool", costControlTool);
  Vue.component("shareRecord", shareRecord);
  Vue.component("cancelOper", cancelOper);
  Vue.component("setBhicon", setBhicon);
  Vue.component("areaSelect", areaSelect);
  Vue.component("switchTabs", switchTabs);
  Vue.component("goodsInfo", goodsInfo);
  Vue.component("docUpload", docUpload);
  
  //Vue.component("mytabs", mytabs);
}
