<template>
  <div class="costDetail">
   <infoList :inputModelData="detailData"></infoList>
<!--     <div class="detail mawbInformation">
      <div class="detail-title">
        <p>总单基本信息</p>
      </div>
      <div class="detail-c">

   <el-row>
            <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtkhname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtkhname'] }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtxmname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtxmname'].split('-')[0] }}</span>
            </p>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['pono'] }}</span>
              <span class="value color-red">{{ mawbInformation['pono'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mawb'] }}</span>
              <span class="value color-red">{{ mawbInformation['mawb'] }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="label">分运单号：</span>


              <span class="value color-red" :title="hawbShow">

              {{hawbShow.indexOf(',')!='-1'?hawbShow.split(',')[0]+','+hawbShow.split(',')[1]+','+hawbShow.split(',')[2]:hawbShow}}

              </span>
            </p>
          </el-col>
        </el-row>


        <el-row>

          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['czlx'] }}</span>
              <span class="value">{{ mawbInformation['czlx'] }}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hwxz'] }}</span>
              <span class="value">{{ mawbInformation['hwxz'] }}</span>
            </p>
          </el-col>

           <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hwlx'] }}</span>
              <span class="value">{{ mawbInformation['hwlx'] }}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">分运单票数：</span>
              <span class="value">{{hawbList.length-1}}</span>
            </p>
          </el-col>
        </el-row>


           <el-row>
            <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['sfg'] }}</span>
              <span class="value">{{ mawbInformation['sfg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mdg'] }}</span>
              <span class="value">{{ mawbInformation['mdg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hbh'] }}</span>
              <span class="value">{{ mawbInformation['hbh'] }}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hbrq'] }}</span>
              <span class="value">{{ mawbInformation['hbrq'] }}</span>
            </p>
          </el-col>
        </el-row>


             <el-row>
            <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['ybtjz'] }}</span>
              <span class="value">{{ mawbInformation['ybtjz'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['realweight'] }}</span>
              <span class="value">{{ mawbInformation['realweight'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['accountweightin'] }}</span>
              <span class="value">{{ mawbInformation['accountweightin'] }}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['accountweightout'] }}</span>
              <span class="value">{{ mawbInformation['accountweightout'] }}</span>
            </p>
          </el-col>
        </el-row>

         <el-row>
            <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['realtjz'] }}</span>
              <span class="value">{{ mawbInformation['realtjz'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['realjfweight'] }}</span>
              <span class="value">{{ mawbInformation['realjfweight'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['zdtjz'] }}</span>
              <span class="value">{{ mawbInformation['zdtjz'] }}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['zdjfweight'] }}</span>
              <span class="value">{{ mawbInformation['zdjfweight'] }}</span>
            </p>
          </el-col>
        </el-row>


         <el-row>
            <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['isinwageallin'] }}</span>
              <span class="value" v-if="profitmode.indexOf('利润')==-1||profitmode.indexOf('利润')!=-1&&Number(orderguid)<0">{{ mawbInformation['isinwageallin'] }}</span>
              <span class="value" v-else>--</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['inwageallinprice'] }}</span>
              <span class="value" v-if="profitmode.indexOf('利润')==-1||profitmode.indexOf('利润')!=-1&&Number(orderguid)<0">{{ (Number(mawbInformation['inwageallinprice']).toFixed(2)==666666.00?'--':Number(mawbInformation['inwageallinprice']).toFixed(2))||0.00 }}</span>
               <span class="value" v-else>--</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['fpbl'] }}</span>


              <span class="value"  v-if="profitmode.indexOf('利润')==-1||profitmode.indexOf('利润')!=-1&&Number(orderguid)<0">WFF:{{ Number(mawbInformation['self_real_bp_freight_in']) }}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{ Number(mawbInformation['cus_real_bp_freight_in']) }}</span>
               <span class="value" v-else>--</span>

            </p>
          </el-col>

          <el-col :span="6">
            <p>
              <span class="label">分配模式</span>
              <span class="value"  v-if="profitmode">{{profitmode}}</span>
              <span class="value" v-else>--</span>
            </p>
          </el-col>


        </el-row>


      </div>
    </div> -->

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid #00cc00;background:#f8f8f8;padding-left:16px;">

  <div style="float:left;margin-right:16px;letter-spacing:0.1em">
    <span style="color:#00cc00;font-weight:bold;">总应收:</span>
    <span v-for="(item,index) in currencyCost.charge" :style="{'color':'#00CC00','margin-left':index>0?'15px':'','font-weight':'bold'}">
    <span style="margin-right:8px;">{{item.currencyFh}}</span>
    <span :title="item.currency">{{item.money}}</span>
    </span>
  </div>

     <span v-if="!isFromFob" style="float:left;color:orange;font-weight:bold;letter-spacing:0.1em">折合人民币盈利:￥{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>
  </div>



    <div class="detail mawbCharge detailPaneYoung">
      <el-row class="detail-title">
      <el-col :span="3">
        <p @click="handleSettname(1,'')">应收费用总览</p>
        </el-col>

<!--         <el-col :span="3" style="color:#00CC00;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">

             <span >总应收：</span><span>{{zdtotalCharge}}</span>

        </el-col>
        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>
        <el-col :span="3" style="color:orange;font-size:12px;font-weight:normal;margin-right:20px;font-weight:bold">

             <span >总盈利：</span><span>{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>

        </el-col> -->
               <el-col :span="15" style="font-size:12px;font-weight:bold;letter-spacing:0.1em;text-indent:0">

              <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-left" style="margin-right:-8px;" @click="changeDirectionAcn(1,1)"></i>
             </div>
             <div style="width:94%;overflow:hidden;display:inline-block" class="wrapSetname">
               <div style="width:10000px" class="setnameAll">
                 <span style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap" v-for="(item,index) in yssettname" @click="handleSettname(1,item.gid,index)" :class="[activeSettnameYs==item.gid?'activeset':'']">
                 <i class="el-icon-circle-check" v-if="item.status=='700'" style="font-size:14px;"></i>
                 {{item.settname}}
                 </span>
               </div>
             </div>
             <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-right" @click="changeDirectionAcn(2,1)" ></i>
             </div>
        </el-col>
      </el-row>
      <div class="detail-c">
       <el-row style="line-height:30px;">
         <!--  <el-col :span="6">
            <p style="color:red">
             <span>总应收：</span><span>{{zdtotalCharge}}</span>
            </p>
          </el-col> -->
         <!--  <el-col :span="6">
            <p style="color:#00CC00">
            <span>总应付：</span><span>{{zdtotalPayment}}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p style="color:orange">
           <span>总盈利：</span><span>{{zdtotalIn}}</span>
            </p>
          </el-col> -->
         <!--  <el-col :span="6">
            <p style="text-align:right">
              <el-button type="primary" size="mini" plain :disabled="ysConfirm" @click="confirmButton(1,700)">应收确认</el-button><el-button type="primary" size="mini" plain :disabled="ysUconfirm" @click="confirmButton(1,1)">取消确认</el-button><el-button type="primary" size="mini" plain @click="recon('1')" :disabled="ysUconfirm">对账</el-button>
            </p>
          </el-col> -->
        </el-row>


        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="margin-top:20px;" :tableIndex="0" v-if="mawbCharge">

        </commonTable>
      </div>
    </div>


<!--   <div class="detail detailPaneRed">
                      <div class="detail-title">
                        <p>空运服务应付</p>
                      </div>
                      <div class="detail-c">
                        <costTable  wagedom="空运" :wageinout="2" :costdata="costdata" :mawbguid="mawbguid"></costTable>
                      </div>
                    </div> -->


  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid red;background:#f8f8f8;padding-left:16px;">

  <div style="float:left;margin-right:16px;letter-spacing:0.1em">
    <span style="color:red;font-weight:bold;">总应付:</span>
             <span v-for="(item,index) in currencyCost.payment" :style="{'color':'red','margin-left':index>0?'15px':'','font-weight':'bold'}">
             <span style="margin-right:8px;">{{item.currencyFh}}</span>
             <span :title="item.currency">{{item.money}}</span>
             </span>
  </div>

  </div>





    <div class="detail mawbPayment detailPaneRed">
      <el-row class="detail-title">
         <el-col :span="3">
        <p @click="handleSettname(2,'')">应付费用总览</p>
        </el-col>

      <!--   <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold;margin-left:-20px;">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col> -->
            <el-col :span="15" style="font-size:12px;font-weight:bold;letter-spacing:0.1em;text-indent:0">
            <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-left" style="margin-right:-8px;" @click="changeDirectionAcn(1,2)"></i>

             </div>
          <div style="width:94%;overflow:hidden;display:inline-block" class="wrapSetname">
               <div style="width:10000px" class="setnameAllf">
                 <span style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap" v-for="(item,index) in yfsettname" @click="handleSettname(2,item.gid,index)" :class="[activeSettnameYf==item.gid?'activeset':'']">
                 <i class="el-icon-circle-check" v-if="item.status=='700'" style="font-size:14px;"></i>
                 {{item.settname}}
                 </span>
               </div>
             </div>

             <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">

               <i class="el-icon-caret-right" @click="changeDirectionAcn(2,2)"></i>
             </div>

        </el-col>



      </el-row>
      <div class="detail-c">

         <!-- <el-row style="line-height:30px;">

          <el-col :span="18">
            <p style="color:#00CC00">
            <span>总应付：</span><span>{{zdtotalPayment}}</span>
            </p>
          </el-col>

          <el-col :span="6">
            <p style="text-align:right">
              <el-button type="primary" size="mini" plain :disabled="yfConfirm" @click="confirmButton(2,700)">应付确认</el-button><el-button type="primary" size="mini" plain :disabled="yfUconfirm" @click="confirmButton(2,1)">取消确认</el-button><el-button type="primary" size="mini" plain @click="recon('2')" :disabled="yfUconfirm">对账</el-button>
            </p>
          </el-col>
        </el-row> -->





        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbPayment" style="margin-top:20px;" :tableIndex="1" v-if="mawbPayment">


        </commonTable>
      </div>
    </div>

    <hawbTabs :mawbguid="mawbguid" :showAddHawbBtn="false" @togglehawb="togglehawb" :showRemoveHawb="true" v-if="orderdom!='直单'">

      <div class="detail hawbInformation" >

        <div class="detail-c" v-if="hawb_data_list[cur_hawb]">
          <el-row>
            <el-col :span="8">
              <p>
                <span class="label">分单预报件/重/体：</span>
                <span class="value">{{hawb_data_list[cur_hawb].hawbInformation.ybpiece}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.ybweight).toFixed(2)}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.ybvolume).toFixed(3)}}</span>
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <span class="label">分单实际件/重/体：</span>
                <span class="value">{{hawb_data_list[cur_hawb].hawbInformation.realpiece}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.realweight).toFixed(2)}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.realvolume).toFixed(3)}}</span>
              </p>
            </el-col>
            <el-col :span="8">
              <p>
                <span class="label">分单制单件/重/体：</span>
                <span class="value">{{hawb_data_list[cur_hawb].hawbInformation.zdpiece}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.zdweight).toFixed(2)}}/{{Number(hawb_data_list[cur_hawb].hawbInformation.zdvolume).toFixed(3)}}</span>
              </p>
            </el-col>
          </el-row>

        </div>
      </div>

      <div class="detail detailPaneRed">
        <el-row class="detail-title">
           <el-col :span="3">
        <p>分单应付</p>
        </el-col>

        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold;margin-left:-20px;">

             <span >总应付：</span><span>{{fdPayment}}</span>

        </el-col>
        </el-row>
        <div class="detail-c">
       <!--  <p>
            <span>总应付：</span><span>{{fdPayment}}</span>
            </p> -->
        <commonTable class="commonTable" :head="hawb_table_model" :table-data="hawb_data_list[cur_hawb] && hawb_data_list[cur_hawb].hawbPayment" :tableIndex="2" v-if="hawb_data_list[cur_hawb] && hawb_data_list[cur_hawb].hawbPayment">

        </commonTable>
        </div>
      </div>



    </hawbTabs>

    <div class="footer">



      <div class="btn-c">
        <div class="left-btn">

           <el-button  @click="back">返回</el-button>
        </div>
        <div class="right-btn">
          <el-button @click="submit(detailData.status >= 800 ? 700 : 800)" :disabled="detailData.status==1100" type="primary" v-if="(Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0)">{{ detailData.status >= 800 ? '取消结算' : '提交结算' }}</el-button>
          <el-button @click="submit(detailData.status == 1100 ? 800 : 1100)" type="primary" v-if="(Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0)">{{ detailData.status == 1100 ? '取消审核' : '提交并审单' }}</el-button>
        </div>
      </div>

    </div>






  </div>
</template>

<script>
import hawbTabs from '../templates/hawbTabs'
import reconMngDetail from './reconMngDetail'
import {getChangeRate,computedWeight} from '../../api/localStorage.js'
export default {
  components: {
    hawbTabs,reconMngDetail
  },
  props: {
    mawbguid: {
      type: [Number, String],
      required: true
    },
    boguid: {
      type: [Number, String],
      required: true
    },
    orderdom:{
      type:String
    },
    isFromFob:''
   // visible:Boolean
  },
  data () {
    return {
      cur_hawb: '',
      curHawbGuid:'',
      zdtotalCharge:0,
      zdtotalPayment:0,
      fdPayment:0,
      wageinout:"",//对账传应收应付
      ponolist:[],//订舱编号选项
      system:"空出",
      detailData:{},
      mawbInformation: {
        pono: '',
        mawb: '',
        wtkhname:'',
        wtxmname:'',
        czlx:'',
        hwxz:'',
        hwlx:'',
        sfg: '',
        mdg: '',
        hbh: '',
        hbrq: '',
        ybtjz: '',
        realweight: '',
        accountweightin:'',
        accountweightout:'',
        realtjz: '',
        realjfweight:'',
        zdtjz: '',
        zdjfweight:'',
        isinwageallin:'',
        inwageallinprice:'',
        self_real_bp_freight_in:'',
        cus_real_bp_freight_in:''
        // hxzl: '',
        // hwstatus: '',
        // dzstatus: '',


        //hbzl: '',




        //ybtjz: '',





      },
      translate_text: {
        wtkhname: '委托客户：',wtxmname: '项目：',pono: '订舱编号：',mawb: '总运单号：',hawb:'分运单号：',allpiece: '总件数：',allweight: '总重量：',allvolume: '总体积：',zdpiece: '制单件数：',zdweight: '制单重量：',zdvolume: '制单体积：',
        jfweight: '实际计费重量：',czlx: '配舱操作：',hwxz: '货物性质：',hwlx:'货物类型：',realweight: '报关重量：',hbzl: '航班种类：',
        hbh: '航班号：',hbrq: '航班日期：',sfg: '始发港：',mdg: '目的港：',zzg: '中转港：',ybtjz: '总单预报体/重/件：',realtjz: '总单实际件/重体/：',zdtjz:'总单制单件重体：',accountweightin:'应收结算重量：',accountweightout:'应付结算重量：',realtjz:'实际件/重/体：',zdjfweight:'制单计费重量：',realjfweight:'实际计费重量：',isinwageallin:'应收运价类型：',inwageallinprice:'应收运费价格：',fpbl:'应收运费分泡比例：'
      },
      mawb_table_model: [
        // {field: 'operate', title: '操作'},
        {field: "isfree", title: "免"},
        // {field: "pono", title: "订舱编号"},
        {field: "settname", title: "结算对象"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "计费方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        { field: "otherno", title: "分运单号" },
        {field: "remark", title: "备注"}
      ],


      mawbCharge: [],

      mawbPayment: [],
      hawbShow:'',



      hawb_table_model: [
       {field: 'operate', title: '操作'},
        {field: "isfree", title: "免"},
        {field: "settname", title: "结算对象"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "计费方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        {field: "remark", title: "备注"}
      ],
      hawb_data_list: {},
      // 订单号、分运单号
      ordernoList:[],
      //orderdom:'',//订单来源
      hawbList:[{name:'本票',id:'-1'}],
      //基础数据 结算方式
      jsfs:[],
      currencyList:[],
      orderguid:-1,//销售站，操作站区分
      profitmode:'',//利润分配模式
      yssettname:[],//应收结算对象
      activeSettnameYs:'',//激活结算对象
      yfsettname:[],//应付结算对象
      activeSettnameYf:'',//激活结算对象
      arrowAcnIndex:0,//结算对象箭头 应收
      arrowAcnIndexf:0,//结算对象箭头 应付
      currentGidCost:{charge:[],payment:[]},
      currencyCost:{charge:[],payment:[],profit:[]},
      currencyFuHao:{'人民币':'￥:','港币':'HK$:','美元':'$:','欧元':'€:','日元':'¥:','英镑':'￡:'},
      //typename:''

    }
  },
  created () {

  this.mawbDeatil()
  },
  computed: {
    mawbInformationKeys () {
      return Object.keys(this.mawbInformation)
    },

    zdtotalIn(){
      return (this.zdtotalCharge-this.zdtotalPayment).toFixed(2)
    },



  },
  watch:{

},


  methods: {
// 总单详细
mawbDeatil(){

    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid: this.boguid},loading:true,tip:false}).then(results=>{
      this.detailData=results.data

      if(results.data){
        //this.orderdom=results.data.orderdom
         Object.keys(this.mawbInformation).forEach(key => {
        if (results.data[key]) {
          this.mawbInformation[key] = results.data[key]
        }else if(key=="ybtjz"){
          this.mawbInformation[key]=(results.data['ybpiece']?results.data['ybpiece']:'0')+'/'+(results.data['ybweight']?Number(results.data['ybweight']).toFixed(2):'0')+'/'+(results.data['ybvolume']?Number(results.data['ybvolume']).toFixed(3):'0')
        }else if(key=="realtjz"){
          this.mawbInformation[key]=(results.data['realpiece']?results.data['realpiece']:'0')+'/'+(results.data['realweight']?Number(results.data['realweight']).toFixed(2):'0')+'/'+(results.data['realvolume']?Number(results.data['realvolume']).toFixed(3):'0')
        }else if(key=="zdtjz"){
           this.mawbInformation[key]=(results.data['zdpiece']?results.data['zdpiece']:'0')+'/'+(results.data['zdweight']?Number(results.data['zdweight']).toFixed(2):'0')+'/'+(results.data['zdvolume']?Number(results.data['zdvolume']).toFixed(3):'0')
        }
      })
      this.mawbInformation['hbh']= results.data.shipaceInfo.hbh
      this.mawbInformation['hbrq']=results.data.shipaceInfo.hbrq.indexOf('1900')==-1?results.data.shipaceInfo.hbrq.substring(0,11):''
      this.mawbInformation['accountweightin']=Number(results.data.accountweightin).toFixed(2)
      this.mawbInformation['jfweight']=Number(results.data.jfweight).toFixed(2)
      this.mawbInformation['gid']=results.data.fid
      this.mawbInformation['area']=results.data.area


     if(this.mawbInformation.isinwageallin=='1'){
          this.mawbInformation.isinwageallin='单价ALLIN'
        }else if(this.mawbInformation.isinwageallin=='2'){
          this.mawbInformation.isinwageallin='总价ALLIN'
        }else if(this.mawbInformation.isinwageallin=='3'){
          this.mawbInformation.isinwageallin='单价++'
        }else if(this.mawbInformation.isinwageallin=='4'){
          this.mawbInformation.isinwageallin='Cost+'
        }

      if(results.data.orderguid>0){//已分配结算对象

        results.data.serviceList.forEach(item=>{
          if(item.servicecode=='OA0010'){
            //this.curObjectKyYs['gid']=Number(item.orderpgid)
            this.orderpgid=item.orderpgid
            this.profitmode=item.profitmode
          }
        })
      }else{
        results.data.serviceList.forEach(item=>{
          if(item.servicecode=='OA0010'){
            this.profitmode=item.profitmode
          }
        })
      }

      this.orderguid=results.data.orderguid


      this.ponolist.push(results.data.pono)
      }

    })

  let groupIdData=JSON.parse(localStorage.getItem('groupType'))
    groupIdData.forEach(item=>{
      if(item.groupid==33){
       // //console.log(item)
        this.jsfs.push({value:item.id,typename:item.typename})
      }
    })

    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currencyList.push(item.cname)
    })


    this.mawbCost()
    this.getAllHawb()
    this.fdPayment=Number(this.fdPayment).toFixed(2)
    //this.hawbCost()


},






    togglehawb (hawb_obj) {
      this.curHawbGuid=hawb_obj.guid
      this.cur_hawb = hawb_obj.hawb

      if (!this.hawb_data_list[this.cur_hawb]) {

   this.$set(this.hawb_data_list, this.cur_hawb, {hawbInformation: {}, hawbCharge: [], hawbPayment: []})
        this.$axios({"method":"get",url:this.$store.state.webApi+'api/ExAxpline',params:{guid: this.curHawbGuid},loading:true,tip:false}).then(results=>{

this.hawb_data_list[this.cur_hawb].hawbInformation=results.data
        }).catch(error=>{

        })

      }
      //this.hawbCost()
    },





    //总单费用查询
    mawbCost(){

      this.mawbCharge=[]
      this.mawbPayment=[]
      var totalCharge=0
      var totalPayment=0
       //this.zdtotalCharge=0
       //this.zdtotalPayment=0

          // 总单费用
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxplineWage',params:{sid: this.mawbguid,boguid:this.boguid},loading:true,tip:false}).then(results=>{
      //console.log(results.data)
      this.typename=''
      results.data.forEach(i => {
        if(i.yssys!=2){

              i.isfree == 1 ? i.isfree = '否' : i.isfree = '是'
        // wageinout 1应收 2应付
        i.price=Number(i.price).toFixed(2)
        i.wageall=Number(i.wageall).toFixed(2)
        i.leastwageall=Number(i.leastwageall).toFixed(2)
        i.changerate=Number(i.changerate).toFixed(4)
        if (i.wageinout == 1) {
          this.mawbCharge.push(i)
          this.ysConfirm=i.confirmstatus==1?false:true
          this.ysUconfirm=i.confirmstatus==1?true:false
          if(i.isfree=='否'){
            totalCharge+=Number(i.wageall)
          }

          //this.mawbChargeTem.push(i)
        } else if (i.wageinout == 2) {

          this.mawbPayment.push(i)
          this.yfConfirm=i.confirmstatus==1?false:true
          this.yfUconfirm=i.confirmstatus==1?true:false
          if(i.isfree=='否'){
            totalPayment+=Number(i.wageall)
          }

        }
        }

      })
      //console.log(totalCharge)
      //console.log(totalPayment)
      this.zdtotalCharge=totalCharge.toFixed(2)
      this.zdtotalPayment=totalPayment.toFixed(2)

      var ysgid=[]

      this.mawbCharge.forEach(item=>{
if(!ysgid.includes(item.gid)){
  this.yssettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
   ysgid.push(item.gid)
}
      })



      var yfgid=[]

        this.mawbPayment.forEach(item=>{
if(!yfgid.includes(item.gid)){
  this.yfsettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
  yfgid.push(item.gid)
}

        })

//alert(this.activeSettnameYs)
if(this.activeSettnameYs!=0||this.activeSettnameYs!=''){
this.handleSettname(1,this.activeSettnameYs)
}else{
  this.handleSettname(1,'')//默认显示全部结算对象
}

if(this.activeSettnameYf!=0||this.activeSettnameYf!=''){
this.handleSettname(2,this.activeSettnameYf)
}else{
  this.handleSettname(2,'')//默认显示全部结算对象
}


      if(!this.isFromFob){
      var itemsArrPayment=[]
      var itemsArrCharge=[]
      var costAll=this.mawbCharge.concat(this.mawbPayment)
      var currencyAlone=[]
      this.currencyCost={charge:[],payment:[],profit:[]}


     costAll.forEach(item=>{
      if(!currencyAlone.includes(item.currency)){
        currencyAlone.push(item.currency)
        var numC=0
        var numP=0

          this.mawbCharge.forEach((item3,index3)=>{
            if(item3.currency==item.currency&&item3.isfree=='否'){
              numC+=Number(item3.leastwageall)
            }

        })

            this.mawbPayment.forEach((item2,index2)=>{
            if(item2.currency==item.currency&&item2.isfree=='否'){
              numP+=Number(item2.leastwageall)
            }

        })

this.currencyCost.charge.push({currency:item.currency,money:numC.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})
this.currencyCost.payment.push({currency:item.currency,money:numP.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})
this.currencyCost.profit.push({currency:item.currency,money:(numC-numP).toFixed(2),currencyFh:this.currencyFuHao[item.currency]})


      }
     })
      }else{
//          this.currencyCost={charge:[],payment:[],profit:[]}
//           var currencyAlone=[]
//              this.mawbCharge.forEach(item=>{
//           if(!currencyAlone.includes(item.currency)){
//             currencyAlone.push(item.currency)
//         var numC=0

//           this.mawbCharge.forEach((item3,index3)=>{
//             if(item3.currency==item.currency&&item3.isfree=='否'){
//               numC+=Number(item3.leastwageall)
//             }

//         })

// this.currencyCost.charge.push({currency:item.currency,money:numC.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})

//       }
//      })
      }

    })

  },
    //分单费用
   hawbCost(){
    this.hawb_data_list[this.cur_hawb].hawbCharge=[]
    this.hawb_data_list[this.cur_hawb].hawbPayment=[]
    var fdPaymentTotal=0
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineWage',params:{sid: this.curHawbGuid,boguid:this.boguid},loading:true,tip:false}).then(results=>{
          //console.log(results)
          results.data.forEach(i => {
              i.price=Number(i.price).toFixed(2)
        i.wageall=Number(i.wageall).toFixed(2)
        i.leastwageall=Number(i.leastwageall).toFixed(2)
        i.changerate=Number(i.changerate).toFixed(4)
            i.isfree == 1 ? i.isfree = '否' : i.isfree = '是'
            if (i.wageinout == 1) {
              this.hawb_data_list[this.cur_hawb].hawbCharge.push(i)
            } else if (i.wageinout == 2) {
              this.hawb_data_list[this.cur_hawb].hawbPayment.push(i)
              if(i.isfree=='否'){
                fdPaymentTotal+=Number(i.wageall)
              }


            }
          })
          this.fdPayment=Number(fdPaymentTotal).toFixed(2)

        })
  },


  //查询总单下所有分单
  getAllHawb(){
      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxpline',params:{hpoidHawbGroup:this.mawbguid},loading:true,tip:false}).then(results=>{
        //console.log("分单号")
          var hawbShow=""
        var resultsData=results.data
        for(var i in resultsData){
           this.hawbList.push({name:resultsData[i].hawb,id:resultsData[i].guid})
            hawbShow+=resultsData[i].hawb+','
        }
         this.hawbShow=hawbShow.substring(0,hawbShow.length-1)
        //console.log(this.hawbList)
        // this.guidHawbGroup=results.data

        // this.hawb_list = this.guidHawbGroup.map(function(item){
        //   this.hawbList.push(item.hawb)
        // })



      })
  },
  //返回
  back(){
    this.$emit('back',false)
  }
  ,//提交结算
submit(status){

      var submittype=this.orderdom=='总单'||'直单'?2:1
      var json={submittype:submittype,guid:this.boguid,area:this.mawbInformation.area,status:status}
      ////console.log(json)
                    this.$axios({method:'post',url:this.$store.state.webApi+"api/ExAxplineSubmit",data:json,loading:true,tip:false}).then(results=>{
                //console.log(results)
                if(results.data.resultstatus==0){
                   this.$message.success(results.data.resultmessage)
                   //this.mawbDeatil()
                   this.detailData.status=status
                }else{
                  this.$message.error("失败！"+results.data.resultmessage)
                }

          })


},
 //切换结算对象
  handleSettname(type,val,gidIndex){ //type 1应收 2应付  val结算对象gid

    var changeData=[]
    var activeysf=""

   if(type=='1'){
         this.currentGidCost.charge=[]
         changeData=this.mawbCharge
         this.activeSettnameYs=val
         this.ysGidIndex=gidIndex
         activeysf=val



    }else if(type=='2'){
       this.currentGidCost.payment=[]
        changeData=this.mawbPayment
        this.activeSettnameYf=val
        this.yfGidIndex=gidIndex
        activeysf=val

       }

    if(activeysf==''||activeysf==0){//如果当前结算对象为空则表示显示全部
      changeData.forEach(item=>{
        this.$set(item,'thisListHide',false)
      })
    }else{
      changeData.forEach(item=>{//当前匹配的结算对象显示，不匹配隐藏
        if(String(item.gid)!=activeysf){
           this.$set(item,'thisListHide',true)
        }else{
          this.$set(item,'thisListHide',false)
        }

      })
    }


 var currencyAlone=[]

    var newData=[];
    changeData.forEach(item=>{//当前匹配结算对象确认状态

      if(item.thisListHide==false){
        newData.push(item)
        if(!currencyAlone.includes(item.currency)){
          currencyAlone.push(item.currency)
        }



      }
    })

       currencyAlone.forEach(item=>{//每个结算对象总收付
        var num=0
          changeData.forEach(item2=>{

          if(item2.isfree=='否'&&item==item2.currency&&item2.thisListHide==false){
             num+=Number(item2.leastwageall)
          }

          })
          if(type=='1'){
           this.currentGidCost.charge.push({currency:item,money:Number(num).toFixed(2),currencyFh:this.currencyFuHao[item]})
          }else if(type=='2'){
          this.currentGidCost.payment.push({currency:item,money:Number(num).toFixed(2),currencyFh:this.currencyFuHao[item]})
          }
        })


  },

      changeDirectionAcn(type,wageinout){
        if(wageinout=='1'){
            var clientWidth=0
      if(type==1){
        // if(this.ysarrowLeft){
        //   return false
        // }
        this.arrowAcnIndex--;
        if(this.arrowAcnIndex<0){
          layer.msg('已至头部');
          this.arrowAcnIndex=0
          return false;
        }
      }else if(type==2){
        // if(this.ysarrowRight){
        //   return false
        // }
        $('.setnameAll').find('span').each(function(){
          clientWidth=clientWidth+$(this).outerWidth()
        })
        if(clientWidth<820){
           this.arrowAcnIndex=0
         return false
        }else{
          this.arrowAcnIndex++
        }
        if(this.arrowAcnIndex>Math.ceil((clientWidth-820)/160)){
          layer.msg('已至尾部');
          this.arrowAcnIndex=Math.ceil((clientWidth-820)/160)
          return false
        }
      }

       $('.setnameAll').css('transform','translateX(-'+this.arrowAcnIndex*160+'px)')
     }else{
            var clientWidth=0
      if(type==1){
        // if(this.yfarrowLeft){
        //   return false
        // }
        this.arrowAcnIndexf--;
        if(this.arrowAcnIndexf<0){
          layer.msg('已至头部');
          this.arrowAcnIndexf=0
          return false;
        }
      }else if(type==2){
        // if(this.yfarrowRight){
        //   return false
        // }
        $('.setnameAllf').find('span').each(function(){
          clientWidth=clientWidth+$(this).outerWidth()
        })
        if(clientWidth<820){
           this.arrowAcnIndexf=0
         return false
        }else{
          this.arrowAcnIndexf++
        }
        if(this.arrowAcnIndexf>Math.ceil((clientWidth-820)/160)){
          layer.msg('已至尾部');
          this.arrowAcnIndexf=Math.ceil((clientWidth-820)/160)
          return false
        }
      }

       $('.setnameAllf').css('transform','translateX(-'+this.arrowAcnIndexf*160+'px)')
     }

      },





},






  }

</script>

<style lang="less" scoped>
.costDetail {
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      //background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .detail-c {
      padding: 20px;
    }
  }
  .mawbInformation, .hawbInformation {
    .el-row {
      margin-bottom: 8px;
      .label {
        display: inline-block;
        width: 130px;
        text-align: right;
        margin-right: 10px;
      }
      .value {
        color: #009900;
      }
      .color-red {
        color: red;
      }
    }
  }

  .footer {
    margin-top: 20px;
    .el-row {
      margin: 20px 0;
    }
    .btn-c {
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
    }
  }
}
.sanjiao{
  width:130px;
  height: 0;
  border-bottom: 30px solid;
  position: relative;
  top: 6px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
   color:#fff;
}
.test(@color){
  border:1px solid #fff!important;
  .sanjiao{
      border-bottom-color: @color;
  }
  .detail-title p{
    &:extend(.sanjiao);
     border-bottom-color: @color;
  }
  .detail-c{
    border: 1px solid @color
  }
}

.detailPaneRed{
   .test(red)
}
.detailPaneYoung{
   .test(#00CC00)
}
  .arrow{
    i{
      &:hover{color:#0f5a8c}
    }
  }
  .wrapSetname{
    div{
      span{
        display:inline-block;
        //margin-right:35px;
        color:#999;
        height:24px;
        line-height:24px;
        margin-top:6px;
        padding-left:12px;
        padding-right:12px;
      &:hover{color:#0f5a8c}
    }
    }

  }
  .activeset{
    background:#0f5a8c;
    color:#fff!important;
    border-radius:32px;

  }
</style>
