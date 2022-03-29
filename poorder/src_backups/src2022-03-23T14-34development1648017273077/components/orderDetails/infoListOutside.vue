<template>
  <div v-if="!(showDeatil==2&&nesting)">
<!-- {{effect}} -->
    <div style="display:flex;justify-content:space-between;align-items:center;background:#fff;height:50px;" v-fixtop="nesting">
      <div>
        <span style="color:#000;font-size:16px;font-weight:bold"  v-if="!effect">{{showDeatil=='2'?inputModelData.khjcno:inputModelData.pono}}</span><br>
      
        <span style="color:#999"  v-if="!effect">{{$t('message.'+title)}}<span style="color:red;font-weight:bold;letter-spacing:0.1em;" v-if="showDeatil=='1'&&cancelType">({{$t('message.cdyy')}}:{{cancelType}})</span></span>
        </span>

      </div>
      <div class="flex-between" v-if="!nesting">

        <div>
          <slot name="betgroup"></slot>
        </div>

        <div style="margin-left:20px;">
          <slot name="betgroup2"></slot>

          <slot name="confirmDz"></slot>
          <slot name="backDz"></slot>
          <el-button type="primary" btnnum="60" @click="getNodeList" class="nodeButton"  v-if="showDeatil=='1'||showDeatil=='2'" :disabled="effect&&effect.length>0">{{$t('message.node')}}</el-button>
          <el-button type="primary" btnnum="50" @click="detailShow.lxrShow=!detailShow.lxrShow" v-if="showDeatil=='1'">{{$t('message.name')}}</el-button>
          <el-button type="primary" btnnum="70" @click="dialogImg=true" v-if="showDeatil=='1'||showDeatil=='2'" :disabled="effect&&effect.length>0">{{$t('message.pic')}}</el-button>
          <el-button type="primary" btnnum="80" @click="dialogDoc=true" :disabled="effect&&effect.length>0">{{$t('message.doc')}}</el-button>
          <slot name="back"></slot>
          </span>
        </div>

      </div>
    </div>
    <!-- 节点 -->
    <el-dialog :visible.sync="detailShow.jiedianShow" v-if="detailShow.jiedianShow" append-to-body width="1300px" title="节点信息" center>
      <infoList :inputModelData="inputModelData" :showDeatil="showDeatil" :title="title" :ifopendetail="ifopendetail" nesting :cancelType="cancelType"> </infoList>     
      <jiedian :mawbinfo="inputModelData" :orderdom="inputModelData.orderdom" v-show="inputModelData.area&&detailShow.jiedianShow" :jiediandata="jiediandata"></jiedian>
    </el-dialog>



    <!-- 总单信息摘要 -->

    <div class="showpanediv" style="margin-top:6px;" v-if="showDeatil=='1'&&!effect">

      <div class="showpaneinfo" style="width:100%">
        <div><span>{{ $t('mawb.mawb') }}：</span><span>{{ inputModelData.mawb||'--'}}</span></div>
        <div><span>{{$t('infoList.hawbNum')}}：</span><span>{{ inputModelData.hawb&&inputModelData.hawb.split(',').length||0}}</span></div>
        <div><span>{{ $t('mawb.hawb') }}：</span><span>{{ inputModelData.hawb||'--'}}</span></div>
        <div></div>
      </div>

      <div class="showpaneinfo" style="width:100%">
        <div><span>{{$t('message.sfg')}}：</span><span>{{ inputModelData.sfg||'--'}}</span></div>
        <div><span>{{$t('message.mdg')}}：</span><span>{{ inputModelData.mdg||'--'}}</span></div>
        <div><span>{{$t('message.hbh')}}：</span><span>{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbh)||'--'}}</span></div>
        <div><span>{{$t('message.hbrq')}}：</span><span>{{ (inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbrq)| formatDate('yyyy-MM-dd') || '--'}}</span></div>
      </div>

      <div class="showpaneinfo" style="width:100%">
        <div><span>{{$t('infoList.ybjzt')}}：</span><span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight)!='0'?Number(inputModelData.ybweight).toFixed(2):'--'}}/{{ Number(inputModelData.ybvolume)!='0'?Number(inputModelData.ybvolume).toFixed(3):'--'}}</span></div>
        <div><span>{{$t('infoList.bgweight')}}：</span><span>{{ Number(inputModelData.realweight)!='0'?Number(inputModelData.realweight).toFixed(2):'--' }}</span></div>
        <div><span>{{$t('infoList.hwxz')}}：</span><span>{{ $i18n.locale=='Chinese'?inputModelData.hwxz||'--':getLanguage('115',inputModelData.hwxz,'English')||'--'}}</span></div>
        <div><span>{{$t('infoList.hwlx')}}：</span><span>{{ $i18n.locale=='Chinese'?inputModelData.hwlx||'--':getLanguage('109',inputModelData.hwlx,'English','1')||'--'}}</span></div>
      </div>

      <div class="showpaneinfo" style="width:100%">

        <div><span>{{$t('infoList.realjzt')}}：</span><span>{{ inputModelData.realpiece||'--'}}/{{ Number(inputModelData.realweight)!='0'?Number(inputModelData.realweight).toFixed(2):'--'}}/{{ Number(inputModelData.realvolume)!='0'?Number(inputModelData.realvolume).toFixed(3):'--'}}</span></div>

        <div><span>{{$t('infoList.zdjzt')}}：</span><span>{{ inputModelData.zdpiece||'--'}}/{{ Number(inputModelData.zdweight)!='0'?Number(inputModelData.zdweight).toFixed(2):'--'}}/{{ Number(inputModelData.zdvolume)!='0'?Number(inputModelData.zdvolume).toFixed(3):'--'}}</span></div>

        <div><span>{{$t('infoList.zdjfweight')}}：</span><span>{{Number(inputModelData.jfweight)!='0'?Number(inputModelData.jfweight).toFixed(2):'--'}}</span></div>
         <div><span>{{$t('infoList.ysjsweight')}}：</span><span>{{ Number(inputModelData.accountweightin)!='0'?Number(inputModelData.accountweightin).toFixed(2):'--' }}</span></div>
      </div>



      <slot name='exinfo'></slot>
    </div>

    <el-dialog :visible.sync="detailShow.lxrShow" v-if="detailShow.lxrShow" append-to-body width="1080px" title="联系人信息" center>
      <infoList :inputModelData="inputModelData" :showDeatil="showDeatil" :title="title" :ifopendetail="ifopendetail" nesting :cancelType="cancelType" v-if="!effect"> </infoList>     
      <mawbContacts :mawbguid="inputModelData.boguid" :area="inputModelData.area" v-if='inputModelData.boguid&&detailShow.lxrShow' :pagetype="effect?2:1" :nodecode="effect==2?'AO5017':(effect==3?'AO5013':'')"></mawbContacts>
    </el-dialog>

    <!-- 照片文档 -->
    <el-dialog :visible.sync="dialogImg" class="dialogImgDoc" :close-on-click-modal="false" v-if="dialogImg" width="1080px" append-to-body top="4%">
      <infoList :inputModelData="inputModelData" :showDeatil="showDeatil" :title="title" style="padding:12px" :ifopendetail="ifopendetail" nesting :cancelType="cancelType"> </infoList>     
      <iframe :src="imgUrl" frameborder="0" allowtransparency="true" style="width: 100%; height: 800px; border: 0px none;" v-if="inputModelData.guid"></iframe>
    </el-dialog>

  <docUpload :dialogShow.sync="dialogDoc" :modelData="inputModelData" v-if="inputModelData.guid&&dialogDoc" system="out" pagetype="2">
    <template slot="infolist">
      <infoList :inputModelData="inputModelData" :showDeatil="showDeatil" :title="title"  :ifopendetail="ifopendetail" nesting :cancelType="cancelType"> </infoList>     
    </template>
  </docUpload>

    <el-dialog :visible.sync="detailShow.reasonShow" width="900px" top="4%" v-if="detailShow.reasonShow" center append-to-body>
      <cancelReason :jobData="inputModelData" :pagetype="4" :visible.sync="detailShow.reasonShow">
      </cancelReason>
    </el-dialog>

  </div>
</template>
<script>
import mawbContacts from "@/components/orderDetails/mawbContacts" //总单联系人
import jiedian from "@/components/orderDetails/jiedian" //节点
import { computedWeight } from '@/api/localStorage.js'
export default {
  props: {
    inputModelData: Object,
    ifopendetail: {
      type: Boolean,
      default: true
    },
    showDeatil: {//1订单查询，2货物查询，3未对账
      type: String,
      default: '1'
    },
    title: {
      type: String,
      default: 'pono'
    },
    cancelType:String,
    nesting:{
      type:Boolean,
      default:false
    },
    effect:String

  },
  components: {
    mawbContacts, jiedian
  },

  data() {
    return {
      detailShow: { pane1: false, pane2: false, jiedianShow: false, lxrShow: false, reasonShow: false },
      dialogImg: false, //图片弹窗
      dialogDoc: false,//文档弹窗
      jiediandata: [],
    }
  },
  filters: {
    inwageallinpriceFmt(val) {
      if (isNaN(Number(val))) return '0.00'
      if (Number(val) === 666666) return '--'
      return Number(val).toFixed(2)
    }
  },
  methods: {

    getWageinType(isinwageallin) {

      if (isinwageallin == '1') {
        return '单价ALLIN'
      } else if (isinwageallin == '2') {
        return '总价ALLIN'
      } else if (isinwageallin == '3') {
        return '单价++'
      } else if (isinwageallin == '4') {
        return 'Cost+'
      }
    }
    , getServiceGuid(code, field) { //获取服务节点参数
      //field 传guid orderpgid childpgid
      if (this.inputModelData.serviceList) {
        let guid;
        field = field || 'guid'
        this.inputModelData.serviceList.forEach(i => {
          if (i.servicecode == code) {
            guid = i[field]
          }
        })
        return guid
      }

    },
    openDetail() {
      if (this.ifopendetail && this.inputModelData.guid != -1) {
        this.$store.state.mainSearch = true
        var object = { 'title': '订单详细信息', 'mawbguid': this.inputModelData.guid, 'boguid': this.inputModelData.boguid, 'area': this.inputModelData.area, 'orderdom': this.inputModelData.orderdom, pagetype: 10 }
        this.$store.commit("setMainSearch", object);
      }
    },
    getNodeList() {
      this.detailShow.jiedianShow = true
      if (this.showDeatil=='1') {
        if (this.detailShow.jiedianShow && !this.jiediandata.length) {
          this.$axios({ method: 'get', url: this.$store.state.webApi + "api/ExAiraxpNode", params: { boguid: this.inputModelData.boguid, guid: this.inputModelData.guid, area: this.inputModelData.area, system: '系统' }, loading: true, tip: false })
            .then(results => {
              this.jiediandata = results.data
            })
        }
      } else if(this.showDeatil=='2'){
        //alert('1')
        if (this.detailShow.jiedianShow && !this.jiediandata.length) {
          //alert('1')
          this.$axios({ method: 'get', url: this.$store.state.webApi + "api/ExAiraxpNode", params: { boguid: this.inputModelData.guid, guid: this.inputModelData.guid, area: this.inputModelData.area, system: '系统' }, loading: true, tip: false })
            .then(results => {
              this.jiediandata = results.data
            })
        }
      }

    },

    getLanguage(groupid,val,language,mul){
 var groupType=JSON.parse(sessionStorage.out_groupType)
   var data=''
   var tmpList=[]
   groupType.forEach(item=>{
        if(!mul){
          if(item.groupid==groupid&&item.ready01==val){
             data=language=='Chinese'?item.typename:item.entypename
          }
        }else{
          val.split(',').forEach(item2=>{
            if(item.groupid==groupid&&item.ready01==item2){
              tmpList.push(language=='Chinese'?item.typename:item.entypename)
            }
          })
          data=tmpList.join(',')
        }
   })
   return data
   
    },



    //},

    routeTo() {
      //this.$router.push({ path:'/outerAdd'})
      $('#outerAdd').click()
    }
  }
  , computed: {


  },
  created() {

    this.$watch(
      function () {
        return this.inputModelData
      },
      function (data) {
       console.log(data)
         let mawbtype = this.inputModelData.orderdom == '直单' ? 1 : 2
        let usrname = sessionStorage.out_logname
        if(this.showDeatil=='2'){
          if(data.pono){
              // this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/imgUploadPage.html?jcno=${data.jcno}&uploadButton=1&system=${data.pono.indexOf('PVG')!='-1'?'wff':'bo'}`;
              this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/#/imgpage?jcno=${data.jcno}&uploadButton=1&system=${data.pono.indexOf('PVG')!='-1'?'wff':'bo'}`;
          }
        }else{
          if(data.pono&&data.pono.indexOf('PVG')!='-1'){
            // this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/imgUploadPage.html?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.operid}&mawbtype=${mawbtype}&cwid=${data.shipaceInfo.operid||'-1'}&area=${data.area}&uploadButton=1&system=wff`;
            this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.operid}&mawbtype=${mawbtype}&cwid=${data.shipaceInfo.operid||'-1'}&area=${data.area}&uploadButton=1&system=wff`;
        }else{
            // this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/imgUploadPage.html?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid||'-1'}&area=${data.area}&uploadButton=1&system=bo`;
            this.imgUrl = `${this.$store.state.imgWebApi}imgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid||'-1'}&area=${data.area}&uploadButton=1&system=bo`;
          }
        }
        

        

        //   this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/imgUploadPage.html?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${data.area}&uploadButton=1`;
        // this.docUrl = `${this.$store.state.imgWebApi}boimgCommon/newDocUploadPage.html?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${data.area}&uploadButton=1`;


        // this.inputModelData.sjComWeight = this.inputModelData.sjComWeight || computedWeight(this.inputModelData.realvolume, this.inputModelData.realweight)
        // var profitmode = this.getServiceGuid('OA0010', 'profitmode')
        // if (profitmode && profitmode.indexOf("Co-Load") != '-1') {
        //   let currencyData = JSON.parse(sessionStorage.getItem('currencyData'))
        //   let currency = this.getServiceGuid('OA0010', 'profitcurrency')
        //   if (currency) {
        //     for (let m in currencyData) {
        //       if (currencyData[m].cname == currency) {
        //         currency = currencyData[m].fcode
        //       }
        //     }
        //   }
        //   this.inputModelData.profitquota = Number(this.getServiceGuid('OA0010', 'profitprice')).toFixed(2) + currency
        // }

        // if (profitmode && profitmode.indexOf('利润') != '-1') {
        //   //  this.inputModelData.profitquota = Number(data.self_profitvalue).toFixed(0) + '/' + Number(data.cus_profitvalue).toFixed(0)
        //   if (data.pono.indexOf('-') >= 0) {
        //     this.inputModelData.profitquota = Number(data.self_profitvalue).toFixed(0) + "(" + data.pono.split('-')[0].substr(-3) + ')/' + Number(data.cus_profitvalue).toFixed(0) + "(" + data.pono.split('-')[1] + ")"
        //   } else if (data.pono.indexOf('(') >= 0) {
        //     this.inputModelData.profitquota = Number(data.self_profitvalue).toFixed(0) + "(" + data.pono.split('(')[0].substr(-3) + ')/' + Number(data.cus_profitvalue).toFixed(0) + "(" + data.pono.split('(')[1].substr(0, 3) + ")"
        //   } else {
        //     this.inputModelData.profitquota = Number(data.self_profitvalue).toFixed(0) + '/' + Number(data.cus_profitvalue).toFixed(0)
        //   }
        // }


      }, { immediate: true, deep: true }

    )

  },
  watch: {


  },
  destroy: function () {
    //detailShow:{pane1:false,pane2:false,jiedianShow:false,lxrShow:false,reasonShow:false},

  }

}
</script>
<style scoped lang="less">
.dialogImgDoc {
  /deep/ .el-dialog__body {
    padding: 0px;
    height: calc(100% - 40px);
  }
}
</style>


