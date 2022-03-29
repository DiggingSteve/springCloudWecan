<template>
  <div class="mawbAddPut">

    <div style="background:#fff;margin-bottom:20px;">
<!-- {{inputModelData}} -->
      <infoList :inputModelData="inputModelData" :showBtnArr="[70,80]" :ifopendetail="false" :showDeatil="'2'" :showDcno="false" >
              <div slot="titlearea" class="infoListPono" style="margin-top:6px">
                 <span>进仓编号:</span><span>{{inputModelData.khjcno}}</span>
              </div>
      </infoList>

            <!-- <infoListOutside :inputModelData="inputModelData" :ifopendetail="false" :showDeatil="'2'" :title="'khjcbh'" ref="infoButton">
              <template slot="back">
                <span style="margin-left:100px;cursor:pointer" @click="closeDialog">
                  <i class="el-icon-arrow-left" style="font-weight:bolder;font-size:16px;color:#000;"></i>
                  <span style="color:#000;font-size:16px;">{{$t('common.back')}}</span>
                </span>
              </template>
            </infoListOutside> -->


    </div>
    <!-- 标题 -->
    <switchTabs :value="'1'" :tabList="[{ label: $t('cargoDetail.realcargoinfo'), value: '1' }]"></switchTabs>

    <!-- 订单详细 -->
    <div class="detail basic-information">
      <div class="detail-title">
        <p>{{$t('cargoDetail.basicinfo')}}</p>
      </div>
      <div class="detail-c" style="width:100%">

        <formCompt :input-view-data="basicInformation" :input-model-data="inputModelData" :area="area" v-if="inputModelData.khjcno">

          <template slot="ycstatus">
            <p>{{$t('cargoDetail.break')}}<i style="color:red;font-style:normal">{{inputModelData.breakpiece}}</i>{{$t('cargoDetail.badpiece')}}，{{$t('cargoDetail.moist')}}<i style="color:red;font-style:normal">{{inputModelData.moistpiece}}</i>{{$t('cargoDetail.badpiece')}}，{{$t('cargoDetail.deform')}}<i style="color:red;font-style:normal">{{inputModelData.deformpiece}}</i>{{$t('cargoDetail.badpiece')}}
              <i style="margin-left:30px;cursor:pointer;color:#4795FA;font-style:normal" @click="picShow" v-if="Number(inputModelData.breakpiece)>0||Number(inputModelData.moistpiece)>0||Number(inputModelData.deformpiece)>0">
                查看照片
              </i>
            </p>
          </template>

          <template slot="weight">
          <span :style="{'color':inputModelData.weight=='未称重'?'red':'#000'}">{{inputModelData.weight}}</span>
          </template>

        </formCompt>

      </div>

    </div>
    <!-- 实际尺寸信息 -->
    <div class="detail">
      <div class="detail-title">
        <p>{{$t('cargoDetail.realSize')}}</p>
      </div>
      <commonTable :head="realSizeHead" :table-data="inputModelData.ybstorevolumeList||[]" :lineClick='true'>
      </commonTable>
    </div>

    <!-- 垫仓板信息 -->
    <div class="detail">
      <div class="detail-title">
        <p>{{$t('cargoDetail.dcbInfo')}}</p>
      </div>
      <commonTable :head="dcbHead" :table-data="inputModelData.storedcbList||[]">
      </commonTable>
    </div>

 <el-dialog :visible.sync="dialogImg2" class="dialogImgDoc" :close-on-click-modal="false" v-if="dialogImg2" width="980px" append-to-body top="4%">
      <iframe :src="imgUrl" frameborder="0" allowtransparency="true" style="width: 100%; height: 800px; border: 0px none;" v-if="dialogImg2"></iframe>
    </el-dialog>

  </div>

</template>

<script>
/*
    操作站(ordertype 2)判断有没有分配 配舱服务(主营服务)，如果分配了才能做空运服务，否则只能做始发港服务 在空运的四个服务加判断(ordertype==2&&!getServiceGuid('OA0010','profitmode'))

*/
//import enterWarehouseNumber from "../templates/enterWarehouseNumber"
//import enterWarehouseNumberPut from "../templates/enterWarehouseNumberPut"
//import mawbRevSed from "../templates/mawbRevSed"
//import linkageAddress from "../templates/linkageAddress"


//import fenpei  from './fenpei'
//import fenpeiTable  from './fenpeiTable'
//import costmaking from './costMaking'
//import service from "../templates/serviceItem"
//import hawbtabs from "./hawbTabsNew"
//import hawbtabsoper from "./hawbTabsOper"
//import storeServiceInfo from "./storeServiceInfo" //仓库服务信息
//import takeDeliveryGoods from "./takeDeliveryGoods" //提货服务信息
//import declareAtcustoms from "./declareAtcustoms" //报关信息
//import makingBill from "./makingBill" //制单信息
//import jiedian from "./jiedian" //节点
//import mawbContacts from "./mawbContacts" //总单联系人
//import increaseService from"./increaseService" //延伸服务
//import flightAssignment from"./flightAssignment" //航班配舱
//import baoguanNodeBtn from '../templates/baoguanNodeBtn' //报关节点按钮组
//import entrustBill from './entrustBill'  //委托单
//import costMaking from './costMaking'
//import makeBillRevSed from '../templates/makeBillRevSed'
import infoListOutside from "@/components/orderDetails/infoListOutside"


import { searCondition, getStorage, otherService, computedWeight, formatDate, getChangeRate,getLanguage } from '../api/sessionStorage.js'

export default {
  components: {
    //enterWarehouseNumber,
    //enterWarehouseNumberPut,
    //mawbRevSed,
    //hawbtabs,
    //storeServiceInfo,
    //hawbtabsoper,
    //takeDeliveryGoods,
    //linkageAddress,
    // declareAtcustoms,
    // makingBill,
    //jiedian,
    //mawbContacts,
    //increaseService,
    //flightAssignment,
    //baoguanNodeBtn,
    //fenpei,
    //entrustBill,
    //costMaking,
    //makeBillRevSed,
    //fenpeiTable
    infoListOutside
  },
  props: {
    area: {
      type: String,
    },
    storeguid: [Number, String],
    visible: Boolean,
  },
  data() {
    return {
      basicInformation: [
        { 'title': 'cargoDetail.hzdno', id: "hzdno", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.piece', id: "piece", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.weight', id: "weight", class: 'width289' },
        { 'title': 'cargoDetail.volume', id: "volume", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.storename', id: "storename", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.jcdate', id: "jcdate", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.gfweight', id: "gfweight", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.jcno', id: "jcno", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.goodstype', id: "goodstype", type: 18, class: 'width289' },
        { 'title': 'cargoDetail.fdocument', id: "fdocument", type: 18, class: 'width289' },
        {},
        {},
        { 'title': 'cargoDetail.goodsmark', id: "goodsmark", type: 18, class: 'width579' },
        { 'title': 'cargoDetail.goodsremark', id: "goodsremark", type: 18, class: 'width579' },
        { 'title': 'cargoDetail.ycstatus', id: "ycstatus", class: 'width579' },

      ],
      inputModelData: {},
      realSizeHead: [
        { "title": "包装类型", field: "packagetypename" },
        { "title": "件数", field: "piece" },
        { "title": "长", field: "longs" },
        { "title": "宽", field: "widths" },
        { "title": "高", field: "heights" },
      ],
      dcbHead: [
        { "title": "库区号", field: "bh" },
        { "title": "垫仓板", field: "dcbno" },
        { "title": "件数", field: "piece" },
        { "title": "重量", field: "weight" },

      ],
      dialogImg2:false,
      imgUrl:'',
    }
  },

  created() {
    //alert(this.boguid)
    this.$watch(
      function () {
        return this.visible
      }, function (val) {

        if (this.inputModelData&&this.inputModelData.guid&&this.inputModelData.guid != this.storeguid) {
          //打开上次关闭的页面不用初始
       
          //alert('2')
          this.initAllData()
          this.$refs.infoButton.jiediandata = []
        }

      }
    )


    //货物明细
    this.cargoSearch()

    //货物节点
    //this.getCargoNode()





  },
  methods: {
    //货物明细
    cargoSearch() {
     // alert('1')
      this.$axios({ method: 'get', url: this.$store.state.webApi + "api/ExHpoStore", params: { storeguid: this.storeguid, area: this.area }, loading: true, tip: false })
        .then(results => {
          console.log(results.data)
          this.inputModelData = results.data
          this.inputModelData.weight = this.inputModelData.weight?this.inputModelData.weight.toFixed(2):'未称重'
          this.inputModelData.volume = this.inputModelData.volume
           this.inputModelData.gfweight = this.inputModelData.gfweight.toFixed(2)
           this.inputModelData.goodstype=getLanguage('109',this.inputModelData.goodstype,this.$i18n.locale,'1')
          this.inputModelData.storedcbList.forEach(item => {
            item.weight = item.weight.toFixed(2)
          })
          // this.inputModelData.storevolumeList.forEach(item=>{
          //   item.packagetypename=getLanguage('31',item.packagetypecode,this.$i18n.locale)
          // })

          this.inputModelData.pono = this.inputModelData.pono||results.data.khjcno

        })
        .catch(error => {

        })
    },
    picShow(){
     this.dialogImg2=true;
        let mawbtype = this.inputModelData.orderdom == '直单' ? 1 : 2
        let usrname = sessionStorage.out_logname
        this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/imgUploadPage.html?jcno=${this.inputModelData.jcno}&uploadButton=2&system=${this.inputModelData.pono.indexOf('PVG')!='-1'?'wff':'bo'}`;
    },
    //节点明细
    // getCargoNode(){
    //   this.$axios({method:'get',url:this.$store.state.webApi+"api/ExAiraxpNode",params:{sid:this.storeguid},loading:true,tip:false})
    //   .then(results=>{
    //      console.log(results.data)

    //  })
    //   .catch(error=>{

    //   })
    // },
    closeDialog() {
      if (this.visible) {
        this.$emit('update:visible', false)
        this.$store.state.mainSearch = false
      }
    },
    initAllData() {
      this.inputModelData={}
      this.cargoSearch()
      //this.cargoSearch()
    }


  }
  , computed: {





  },
  mounted() {


  },
  watch: {

  },
  beforeDestroy: function () {

  }


}
/*
initAllData 初始所有数据
servicesDisabled 控制服务面板的权限
btnJurisdic   控制按钮显示权限
peicheBill    派车单
isServiceAllFinish 判断所有小服务是否已经完成
setAccountweightout 计算结算重量
initFunc       修改费用后，重新取值，重置状态
getMawbGys 获取总单供应商的数据
openDialogJh  交货文件地址
openServiceFinish  打开服务完成的弹窗
serviceFinishFunc 服务完成与取消完成，总单制单及后面的小服务
isServiceFinish  服务是否完成
qfsjDialogFunc 起飞时间维护地址
submit 提交结算
tabclick 判断tab是否是初次打开
getAreaPrice 总单杂费
setIncidentalWage 设置应收应付的杂费数据
handleO 受理
backO 退回
assignXsPlation 分配至销售站查询
assignCzPlation 分配信息操作站查询
closeDialog 关闭弹窗
relieveMawbConfig 点击解除总运单
choiseDialogMawb 选择总单配置弹窗里面总运单，获取当行数据
mawbConfigFunc 配置总运单
initHawbForm 重置分单配置进仓编号的表单
hawbChange 分单切换
getServiceNodeData 获取服务节点
getMawbdetail  获取总单详细信息
fareAddclass 设置费用模块的可用状态
getJjdFunc 设置交接地数据
getMawbCost 获取总单费用信息
setServiceInfo 设置总单服务项目
changeTabshow 用于判断服务是否选择已显示相应的服务tab
hawbSelFunc 选中进仓编号,分单配置进仓编号里面的
changeIndex 大模块，一级tab初次切换
getHawbForm 获取分单配置进仓编号表单数据
saveHawbForm 保存分单信息
addHawbList 分单批量新增
upHawbList 分单详细修改
setHawbForm
resetHawbForm
delHawbForm
selOptionShow 判断进仓编号是否已经使用
getServiceGuid   获取服务节点参数
orderFinishFunc 点击总单完成
wtdataP
flightAssFunc 配舱
cancelFlightAss 取消配舱
getInfo 获取总单表单信息
getHawbNum 获取分单号
saveMawbInfo 保存总单数据
operationSave WFF操作
saveJcnoinfo 保存进仓编号信息
getQfsj 起飞时间
edit_node_success
saveServiceFunc 保存服务信息
getJsxmData 设置四个大服务完成时的节点与费用数据
cancelOrderFunc 1 撤单 2 配货完成 3取消配货
setRound 校正重量的值
JudgeBubblesFunc 1判断实际计重 2，制单计重

计算属性
hasMaincamp
allDisabled
hawbArr
statusArr
mdgTabshow
isDistribution

*/
</script>

<style lang="less" scoped>
.mawbAddPut {
  .detail {
    margin-bottom: 20px;
    //border: 1px solid #e8e8e8;
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      display: flex;
      align-items: center;
      height: 32px;
      // text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #000;
      font-weight: bold;
      margin-bottom: 8px;
      //background: #f8f8f8;
      //border-bottom: 1px solid #e8e8e8;
    }
    .detail-c {
      padding: 20px;
      border: 1px solid #e8e8e8;
    }
  }
  .basic-information {
    /deep/ .el-date-editor.el-input {
      width: 100%;
    }
    /deep/ .el-input__icon {
      line-height: 28px;
    }
    p {
      span {
        display: inline-block;
        color: #999;
        height: 28px;
        line-height: 28px;
        width: 100px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: bold;
        text-align: center;
        &:hover {
          background: rgba(71, 149, 250, 0.3);
          color: #006bfa;
        }
      }
      .active {
        background: rgba(71, 149, 250, 0.3);
        color: #006bfa;
      }
      .bwInfo {
        padding: 5px;
        width: 110px;
        font-style: normal;
        text-align: center;
        border: 1px solid #e8e8e8;
        display: inline-block;
        border-radius: 3px;
        margin-left: 8px;
        color: #006bfa;
        cursor: pointer;
      }
    }
  }
  .mdgserviceTitle,
  .sfgserviceTitle {
    margin-top: 20px;
    margin-left: 6px;
    width: 145px;
    height: 28px;
    font-size: 14px;
    color: #333;
    font-weight: bolder;
  }

  .footer {
    overflow: hidden;
    margin-top: 25px;
    .left-btn {
      float: left;
    }
    .right-btn {
      float: right;
    }
  }
}
.servicediv {
  display: flex;
  align-items: center;
  border: 1px solid #eee;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
}
.service {
  width: 50%;
}
.servicediv-title {
  height: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 15px;
  padding-right: 15px;
  width: 30px;
  word-wrap: break-word;
}
.codeAA0210 .serviceItem {
  /deep/ div {
    display: none !important;
    color: red;
  }
}
.codeAA0220 {
  position: absolute;
  left: 220px;
  margin-top: -43px;
}
.codeAA0220 .serviceItem {
  /deep/ div {
    display: none !important;
    color: red;
  }
}
// .codeAA0230,.codeAA0240{
//   margin-left:44px
// }
.imul {
  font-style: normal;
  display: inline-block;
  width: auto;
}

.forstLevel {
  display: flex;
  align-items: center;
  height: 50px;
  i {
    width: 8px;
    height: 8px;
    display: inline-block;
    background: #0f5a8c;
    margin-right: 5px;
  }
  span {
    margin-right: 25px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    color: #999999;
  }
  span.checked {
    color: #256998;
  }
}
.content .el-tab-pane {
  padding: 0px;
}

.fdpzPanel {
  /deep/ .el-form-item {
    min-width: 300px;
  }
  /deep/ .el-input__inner {
    width: 167px;
  }
}
.infoPane(@minw,@lin) {
  /deep/ .el-form-item {
    min-width: @minw;
  }
  /deep/ .el-form-item__label {
    line-height: @lin;
    color: #333;
    font-size: 12px;
  }
}

.maPane {
  .infoPane(400px, 28px);
}
.zdPane {
  .infoPane(260px, 40px);
}
.detailPaneMidinfo {
  display: flex;
  width: 800px;
  position: relative;
  height: 100%;
  justify-content: space-between;
  color: #333;
  font-weight: normal;
  margin-left: 20px;
  padding-left: 10px;
  align-items: center;
  border-left: 1px solid #e8e8e8;
  > div {
    display: flex;
    align-items: center;
  }
  /deep/ .input-item {
    margin-bottom: 0px !important;
  }
  /deep/ .el-textarea__inner {
    position: absolute;
    width: 250px;
    height: 110px;
    z-index: 1000;
  }
}
.sanjiao {
  width: 130px;
  height: 0;
  border-bottom: 30px solid;
  position: relative;
  top: 6px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
  color: #fff;
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
  }
}
.detail-title p {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
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
.fpTable {
  width: 100%;
  text-align: center;
  margin-top: 28px;
}
.fpTable tr {
  height: 36px;
  line-height: 36px;
}
.fpTable tr th,
.fpTable tr td {
  border: 1px solid #e8e8e8;
}
.fenpei .fdzy {
  font-weight: bold;
  font-size: 14px;
}
.lrfp {
  margin-bottom: 20px;
  padding-bottom: 20px;
  p {
    margin-bottom: 13px;
    font-size: 14px;
    span {
      display: inline-block;
      &:nth-child(1) {
        min-width: 100px;
        width: 100px;
        text-align: right;
        margin-right: 12px;
      }
      &:nth-child(2) {
        min-width: 100px;
        width: 100px;
        text-align: left;
      }
    }
  }
  .profitvalue {
    span {
      &:nth-child(2) {
        min-width: 60px;
        width: 60px;
        text-align: left;
      }
      &:nth-child(3) {
        min-width: 40px;
        width: 40px;
        text-align: left;
      }
      &:nth-child(4) {
        min-width: 60px;
        width: 40px;
        text-align: right;
        margin-right: 12px;
      }
      &:nth-child(5) {
        min-width: 40px;
        width: 40px;
        text-align: left;
      }
    }
  }

  .green {
    color: green;
  }
}

.coload {
  p {
    margin-bottom: 13px;
    font-size: 14px;
    span {
      display: inline-block;
      &:nth-child(1) {
        min-width: 100px;
        width: 100px;
        text-align: right;
        margin-right: 12px;
      }
      &:nth-child(2) {
        min-width: 120px;
        width: 120px;
        text-align: left;
      }
    }
  }

  .profitvalue {
    span {
      &:nth-child(2) {
        min-width: 60px;
        width: 60px;
        text-align: left;
      }
      &:nth-child(3) {
        min-width: 40px;
        width: 40px;
        text-align: left;
      }
      &:nth-child(4) {
        min-width: 60px;
        width: 40px;
        text-align: right;
        margin-right: 12px;
      }
      &:nth-child(5) {
        min-width: 40px;
        width: 40px;
        text-align: left;
      }
    }
  }

  .green {
    color: green;
  }
}

.dialogImgDoc {
  /deep/ .el-dialog__body {
    padding: 0px;
    height: calc(100% - 40px);
    /* overflow: scroll; */
  }
}
.paneDisabled {
  cursor: not-allowed;
  > div {
    pointer-events: none;
  }
  /deep/ button {
    // pointer-events: all;
  }
  /deep/ input {
    pointer-events: none;
  }
  /deep/ .add-hawb {
    pointer-events: none;
  }
  /deep/ .icon-c {
    pointer-events: none;
  }
  /deep/ .tabs-header {
    pointer-events: all;
  }
  /deep/ .hide-tabs {
    pointer-events: all;
  }
  /deep/ #khjcno {
    pointer-events: all;
    cursor: pointer;
  }
  /deep/ #hwlx {
    pointer-events: all;
    cursor: pointer;
  }
  /deep/ #tradeterm {
    pointer-events: all;
    cursor: pointer;
  }
  /deep/ .el-tabs__nav {
    pointer-events: all;
  }
}
.bgFinishDis {
  /deep/ .add-hawb {
    pointer-events: none;
  }
  /deep/ .icon-c {
    pointer-events: none;
  }
  /deep/ .tabs-header {
    pointer-events: all;
  }
  /deep/ .el-tabs__nav {
    pointer-events: all;
  }
}
.finishIcno {
  display: inline-block;
  width: 36px;
  height: 28px;
  position: absolute;
  top: 6px;
  left: 35px;
  //background: url(../../../static/images/finish.png);
  background-size: 100% 100%;
}

.finishBtn {
  float: right;
  margin-right: 2px;
}
.numspan {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 0px;
  cursor: pointer;
  color: #3d6891;
  user-select: none;
  border-right: none;
}
.inwageal {
  /deep/ .el-input {
    top: -1px;
  }
  /deep/ input {
    border-radius: 0px;
    border-right: none;
  }
}
.orderTakingPage,
.xinkongPage {
  //订单受理页，把按钮都去掉
  /deep/ button {
    display: none;
  }
  /deep/ button[btnnum="240"] {
    display: inline-block;
  }
}
.jumpPage {
  /deep/ button {
    display: none;
  }
}
.finishInfo {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
.finishDetail {
  .detail-title {
    border-bottom: none !important;
  }
  .detail-c {
    padding: 0px !important;
  }
}
.shuoding {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  background-size: cover;
  vertical-align: -5px;
  margin-left: 5px;
}
.lock {
  //background-image: url(../../../static/images/lock.png);
}

.unlock {
  //background-image: url(../../../static/images/unlock.png);
}
</style>
