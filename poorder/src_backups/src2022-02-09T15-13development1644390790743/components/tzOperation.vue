
<template>
  <div>
    <div class="page-container-box">
   <!--  {{name}} -->
      <!-- {{selectTableIndex}} -->
       <!-- {{inputModelData}} -->
      <!-- <hr> -->
     <!-- {{searchData}} -->
      <!-- {{inputViewData}} -->
      <!-- <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
      ></newFormCmpt> -->
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :chinese-where.sync="chineseWhere"
        :pageshow.sync="pageshow"
      ></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <!-- <el-button @click="addMultiply(true)">新增多票调账</el-button> -->
        <!-- <el-button @click="openMergeDialog" v-if="$store.state.ifMergeHawb">订单合并</el-button> -->
      </div>
    </div>
    <!-- 获取配舱选中数据 -->


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      @transSelIndex="openDialog"
      :chinese-where="chineseWhere"
      v-if="tableDataRes"
      showZiConfig
    >
    <template slot="operate" slot-scope="props">
    	<i class="el-icon-document" title="调账"  @click="addMultiply(false,'',props.data.row)" v-if="props.data.row.billStatus!=0&&monitor=='1'" ></i>
        <i class="el-icon-delete" title="删除" v-show="props.data.row.billStatus=='1'" @click="cancelTz(props.data.row.jobid)" ></i>
    </template>
    <template slot="jobno" slot-scope="props">
     <span style="color:#1a7dbf;cursor:pointer;" @click="getMawbAddPut(props.data.row)">{{props.data.value}}</span>
   <!--  <span style="color:#1a7dbf;cursor:pointer;" @click="getWffDetail(props.data.row)">{{props.data.value}}</span> -->
    </template>
    <template slot="billStatus" slot-scope="props">
    	{{ getbillStatus(props.data.value) }}
    </template>

    <template slot="profit" slot-scope="props">
    	<span :style="{'color':Number(props.data.value)>0?'#93de6e':'#f56c6c'}">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
    </template>

    <template slot="profitrmb" slot-scope="props">
    	<span :style="{'color':Number(props.data.value)>0?'#93de6e':'#f56c6c'}">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
    </template>
    <template slot="changebillwage" slot-scope="props">
    	<span :style="{'color':Number(props.data.value)>0?'#93de6e':'#f56c6c'}">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
    </template>
    <template slot="changebillwageallinrmb" slot-scope="props">
    	<span style="color:#93de6e">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
    </template>
     <template slot="changebillwagealloutrmb" slot-scope="props">
    	<span style="color:#f56c6c">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
    </template>
    <template slot="wageallinrmb" slot-scope="props">
    	<span style="color:#93de6e">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>

      <!-- <span class="el-icon-meiyuan" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px" @click="showCost(props.data.row)" v-if="monitor=='1'"></span> -->
      <span class="el-icon-meiyuan" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px" @click="getWffDetail(props.data.row)" v-if="monitor=='1'"></span>
    </template>
    <template slot="wagealloutrmb" slot-scope="props">
    	<span style="color:#f56c6c">
    		{{Number(props.data.value).toFixed(2)}}
    	</span>
      <!-- <span class="el-icon-meiyuan" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px" @click="showCost(props.data.row)" v-if="monitor=='1'"></span> -->
     <span class="el-icon-meiyuan" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px" @click="getWffDetail(props.data.row)" v-if="monitor=='1'"></span>
      

    </template>

    <template slot="confirmstatus_in" slot-scope="props">
         <span>
            <span
              :style="{'color':props.data.row['confirmstatus_in']=='1'?'#f56c6c':'#93de6e'}">费用{{props.data.row['confirmstatus_in']=='1'?'未确认':'已确认'}}</span>
            <span style="color:#c8c8c8;margin-left:5px">|</span>
          </span>
            <i :class="(props.data.row.wagerejectstatusin==100||props.data.row.wagerejectstatusin==200||props.data.row.wagerejectstatusin==500)?'el-icon-shenhebohui':'el-icon-meiyuan'" :title="wagerejectstatusTitle(props.data.row.wagerejectstatusin,1)" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px"  :style="wagerejectstatusTitle(props.data.row.wagerejectstatusin,1,2)" @click="getWffDetail(props.data.row)" v-if="props.data.row.billStatus!='0'">
            </i>
    </template>

    <template slot="confirmstatus_out" slot-scope="props">
       <span>
            <span
              :style="{'color':props.data.row['confirmstatus_out']=='1'?'#f56c6c':'#93de6e'}">费用{{props.data.row['confirmstatus_out']=='1'?'未确认':'已确认'}}</span>
            <span style="color:#c8c8c8;margin-left:5px">|</span>
          </span>
            <i :class="(props.data.row.wagerejectstatusout==100||props.data.row.wagerejectstatusout==200||props.data.row.wagerejectstatusout==500)?'el-icon-shenhebohui':'el-icon-meiyuan'" :title="wagerejectstatusTitle(props.data.row.wagerejectstatusout,2)" style="font-size:16px;cursor:pointer;float:right;vertical-align:middle;margin-top:8px"  :style="wagerejectstatusTitle(props.data.row.wagerejectstatusout,2,2)" @click="getWffDetail(props.data.row)" v-if="props.data.row.billStatus!='0'">
           </i>
    </template>

    </tableCompt>

   <transition enter-active-class="animate__animated animate__zoomInDown" leave-active-class="animate__animated animate__zoomOutRight">
    <el-dialog 
      title="调账新增"
      center
      :visible.sync="dialogShow"
       v-if="dialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false">
    <tzDetail :visible.sync="dialogShow" :multiply="multiply" :rowData="rowData" :monitor="monitor"></tzDetail>
    </el-dialog>
	</transition>


            <el-dialog :visible.sync="bohuiVisible" width="1360px" :title="`驳回详情(${wageBohuiData[0]&&wageBohuiData[0].wagecommitlist[0].wageinout==1?'应收':'应付'})`" top="4%" v-if="bohuiVisible" :close-on-press-escape="false" append-to-body :close-on-click-modal="false" center @close="closeBohuiDialog">
             <commonTabs :list="hawbListTab" :checkedIndex.sync="tabindex" :showContent="false" @toggle="handleClick">
             </commonTabs>

            <div style="min-height:400px" v-show="allmaindata.boguid">
            <infoList :inputModelData="allmaindata" v-if="showInfoList" name="详细" :costBiaozhu="false" :ifopendetail="false" :showBtnGroup="false">
            </infoList>
           <!--   <infoList :inputModelData="inputModelDataInfoList" v-if="showInfoList" :pono="mawbInfo.jobno" name="详细" :costBiaozhu="false" :ifopendetail="false":showBtnGroup="false"/> -->
            <div>

                <el-tabs class="tabsTile" :value="String(childBohuiChecked)" @tab-click="handleClickBohui" style="margin-bottom:10px;">
                    <el-tab-pane :label="item.items" v-for="(item,index) in wageBohuiData" :key="index">
                        <span slot="label" :class="{checked:childBohuiChecked==index}" :style="spanstyle(item.status==-1?'black':(item.status==500?'green':(item.receiver=='initiator'?'red':'green')),childBohuiChecked==index)">{{item.items}}</span>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <template v-for="(item,index) in wageBohuiData">
                <myCommonTable v-show="childBohuiChecked==index" :ifNeedFrashWage.sync="ifNeedFrashWage" ref="myCommonTable" :ifPiliangBohui="isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length" v-if="childBohuiCheckedList.includes(index)||(isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length)" :mawbinfo="allmaindata" :wageBohuiData.sync="wageBohuiData[index]" :key="index" :initiator="initiator" name="tZsearch"></myCommonTable>
            </template>

            <div v-if="isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length">
                <h4 style="margin:15px 0">驳回理由</h4>
                <el-input type="textarea" v-model="rollbackreason" rows="4" placeholder="请输入你的驳回理由"></el-input>
                <div style="text-align:right;margin:20px 0">
                    <el-button type="primary" @click="piliangWagebohui">批量确认驳回</el-button>
                    <el-button @click="bohuiVisible=false">返回</el-button>
                </div>
            </div>

        </div>
    </el-dialog>
    

     <el-dialog title="调账详细" :visible.sync="OrderVisible" :close-on-press-escape="false" :close-on-click-modal="false"
      class="dialogPage" width="100%" top="20px" :modal="false" center>
              <infoList style="margin-bottom:25px" v-if="ponoDetail&&ponoDetail.guid&&listBillChangeJob.length" :inputModelData="ponoDetail"
          :pono="listbillCheckedRow.basicInfo&&listbillCheckedRow.basicInfo.jobno" name="详细">
          <template slot="exinfo">
            <div class="showpaneinfo" style="width:100%">
              <div>
                <span>销售员：</span>
                <span>{{ponoDetail.salesname||'--'}}</span>
              </div>
              <div>
                <span>单证状态：</span>
                <span>{{ponoDetail.dzstatusCn }}</span>
              </div>
              <div>
                <span>审单人：</span>
                <span>{{ponoDetail.submitman_2_sett}}</span>
              </div>
              <div>
                <span>审单日期：</span>
                <span>{{ponoDetail.submitdate_2_sett}}</span>
              </div>
            </div>
          </template>
        </infoList>

      <commonTabs :list="listBillChangeJob" :checkedIndex.sync="listBillChecked" titlefield="billno"
          @toggle="handleClickJob" v-if="listBillChangeJob.length">
          <template v-for="(item,index) in listBillChangeJob">
            <managerDetailTz v-if="listBillOpened.includes(index)" :showListInfo="false"
              :listBillChangeJob="listBillChangeJob" :listBillChecked="listBillChecked"
              :showBtnfoot="false" v-show="index==listBillChecked"
              :listbillCheckedRow.sync="listbillCheckedRow" :id="item.billsid" :jobnosid="item.jobnosid"
              :visible.sync="OrderVisible" :wagedom="item.billwagedom" :area="cur_area" initiator="60"
              @dzstatusChange="status => {cur_row.dzstatus = status}" @backOrder="removeOrderFromTable(cur_rowindex)">
            </managerDetailTz>
          </template>
        </commonTabs>

        <managerDetail v-if="OrderVisible&&!listBillChangeJob.length" :id="cur_id" :wagedom="cur_wagedom" :area="cur_area"
        :visible.sync="OrderVisible" initiator="60" :showBtnfoot="false">
      </managerDetail>

     </el-dialog>

    <!-- 费用明细 -->
    <el-dialog
      title="费用明细"
      :visible.sync="costMakingVisible"
      width="100%"
      top="0"
      v-if="costMakingVisible"
      :close-on-press-escape="false"
      class="dialogPage"
      :modal="false"
      center
    >
     
      <costmaking v-if="costMakingVisible" :mawbguid="mawbguid" :boguid="boguid" :pagetype="2" :showSuggestWage="false" :showDuizhang="false"></costmaking>
    </el-dialog>

    <!-- 综合查询 -->
    <el-dialog
      title="综合查询"
      v-if="mawbShow"
      center
      :visible.sync="mawbShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="mawbShow"
        :pagetype="20"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
      ></mawbaddput>
    </el-dialog>

 
  </div>
</template>
<script>
import {systemCheck,mergeFunc, openZimessage} from '@/components/mixins/topPageMixin'
  import {
    myCommonTable,
    setBhiconColorMixin
  } from "@/common/detailPagesMixin"

import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate
} from "../api/localStorage.js";
import tzDetail from './orderDetails/tzDetail.vue'
import managerDetail from '../wffmanagement/orderDetail/managerDetail'
import managerDetailTz from '../wffmanagement/orderDetail/managerDetailTz'

export default {
  name: "tzOperation",
  mixins:[mergeFunc, openZimessage,setBhiconColorMixin],
  components: {
   tzDetail,myCommonTable,managerDetail,managerDetailTz
  },
   props:{
     monitor:{
      type:[Number,String],
      default:1
     }
  },
  data() {
    return {
      name: this.monitor=='1'?"tzOperation.vue":"tzMonitor.vue",
      dialogShow:false,
      inputViewData: {
        hbrq: { title: "航班日期", type: 15,begintype:this.monitor=='1'?'6':'',defaultVal:this.monitor=='1'},
        billStatus:{title:'订单号关账状态',type: 5,options:[]},
        adddate:{title: "调账日期", type: 15,begintype:this.monitor=='2'?'3':'',defaultVal:this.monitor=='2'},
        addman:{title:'创建人',type:1}
      },
      inputModelData: {
        // addman:localStorage.usrname
      },

      selectTableIndex: "",
      multiply:false,
      //initiator:60,
      bohuiVisible: false, //费用驳回弹窗 // 费用中的 status：-1 未发起，100 待通过，200 已驳回，500，已通过
      wageBohuiData: [], //驳回的数据
      childBohuiChecked: 0,
      childBohuiCheckedList: [0],
      ifNeedFrashWage: false,
      rollbackreason: '',
      showInfoList: true,
      initiator:'60',
      rowData:{},//行数据
      allmaindata:{},
      OrderVisible:false,//WFF详细页面
      cur_id:'',
      cur_wagedom:'', 
      cur_area:'',
      cur_row:{},
      hawbListTab:[],//多票
      tabindex:0,
      bohuiAllObjet:{},
      listBillChangeJob: [//关联的调账
        ],
      listBillChangeJobWage: {},//关联的调账的费用
      listBillChecked: 0,
      listbillCheckedRow: {},
      listBillOpened: [],
      ponoDetail: {},
      costMakingVisible:false,//费用弹框
      mawbShow:false,//明细弹框
      mawbguid:'',
      boguid:'',
      area:'',
      //activeBoguid:0
    };
  },
  created(){
    this.$nextTick(()=>{
    if(this.monitor=='1'){
    this.inputViewData.billStatus.title="订单号关账状态"
    this.inputViewData.billStatus.options=[{ label: "未关账", value: "0" },{ label: "已关账", value: "3" }]
    this.inputModelData['billStatus']=3
    }else{
    this.inputViewData.billStatus.title="调账号完成状态"
    this.inputViewData.billStatus.options=[{ label: "未完成", value: "1" },{ label: "已完成", value: "2" },{ label: "已关账", value: "3" },{label: "已审核", value: "4" }]
    this.$set(this.inputModelData,'addman',localStorage.usrname)
    //this.inputModelData['billStatus']=3
   }
    })

  },

  methods: {
  showCost(data){
  this.costMakingVisible=true
  this.mawbguid=data.jobid
  this.boguid=data.oldid 
  },
  getMawbAddPut(data){
  if(this.monitor=='1'){
  this.mawbShow=true
  this.mawbguid=data.jobid
  this.boguid=data.oldid 
  this.area=data.area
  }else{

    this.addMultiply(false,'',data)
    //this.getWffDetail(data)
  }

  
  },
  getbillStatus(val){
	if(val==0){
		return '未关账'
	}else if(val==1){
		return '未完成'
	}else if(val==2){
		return '已完成'
	}else if(val==3){
		return '已关账'
	}else if(val==4){
    return '已审核'
  }
   },

   wagerejectstatusTitle(status, wageinout,type=1){
        let c={color:'#0EB000',cursor:'pointer'},b={color:'#FF9300',cursor:'pointer'},a={color:"#EB0000",cursor:'pointer'};
        if (status == 500) {
          return type==1?"费用驳回已反馈至结算":c;
        } else if (status == 100) {
          return type==1?"费用驳回已反馈至业务,待业务处理":b;
        } else if (status == 200) {
          return type==1?"费用已驳回至业务,待业务处理":a;
        } else {
          return wageinout == 1 ? "修改应收费用" : "修改应付费用";
        }
     },

    search() {
      this.selectTableIndex=-1;

      this.tableDataRes = [];
      this.ziTableData = [];
      if(this.monitor=='1'){
        this.searchData.wagedom={not:'调账'}
      }else{
        this.searchData.wagedom={in:'调账'}
      }
      if(this.inputModelData.billStatus){
        this.searchData.billStatus={in:this.inputModelData.billStatus}
      }
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"    
      };
      var json = { json: JSON.stringify(jsonArr2)};

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/changebill/getList",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }

          setTimeout(() => {
             this.tableDataRes=getChangeValue(results.data, "空出");
          }, 0);
        })
        .catch(errors => {});
    },

    reset() {
     
      this.inputModelData = {
        
      };
    },
    openDialog(indexData) {
      this.dialogShow = true;
      this.multiply=false;
    },
    addMultiply(type,bohui='',data={}){
      this.rowData={}
      
      if(!bohui){
      	this.rowData=data
      	this.multiply=type?type:this.rowData.oldid=='-1'?true:false
      	this.dialogShow = true;
      }else{
      	this.gethawbListTab(data)
      }
      
    },
    gethawbListTab(data){

      this.$axios({
      	method:"get",
      	url:this.$store.state.webApi + "api/changebill/GetRejectJobTab",
      	params:{jobid:data.jobid},
	    loading: true,
	    tip: false
      })
      .then(results=>{
        this.hawbListTab=results.data
        this.hawbListTab.map(i=>{
        	i.guid=i.wageguidList
        	this.$set(this.bohuiAllObjet,i.boguid,{allmaindata:{},wageBohuiData:[]})
        	return i
        })
        //console.log(this.bohuiAllObjet)
        this.handleClick({index:0})
        //return results.data
        //this.getMawbDetail(this.hawbListTab[0])
        //this.$set(this.bohuiAllObjet,this.hawbListTab[0])
        //this.getBohuiWageDetail()
      })
      .catch(error=>{

      })
    },
     getMawbDetail(data){
      
      this.$axios({
      method: "get",
      url: this.$store.state.webApi + "api/ExHpoAxpline",
      params: { boguid: data.boguid },
      loading: true,
      tip: false
    })
     .then(result => {
        this.allmaindata = result.data;
        this.getBohuiWageDetail(data).then(results=>{
        	this.bohuiAllObjet[data.boguid]['allmaindata']=this.allmaindata
            this.bohuiAllObjet[data.boguid]['wageBohuiData']=results
            this.childBohuiChecked=0
        })
     })
    },
    //删除调账
    cancelTz(id){
       this.$confirm('是否确认删除', '提示', {
      	confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{

        	this.$axios({
	      	method:'POST',
	      	url: this.$store.state.webApi + "api/changebill/DeleteChangeBill",
	      	data:{jobid:id},
	      	loading: true,
	        tip: false
	        })
	        .then(results=>{
             if(results.data.resultstatus==0){
             	this.$message.success(results.data.resultmessage)
             	this.search()
             }else{
                this.$message.error(results.data.resultmessage)
             }
	        })
     
      })
      .catch(()=>{
        this.$message.info('已取消操作')
      })
    },
    getWffDetail(data){//获取详细
    this.listBillChecked = 0
    this.listBillOpened = []
    this.listbillCheckedRow = {}
    this.listBillChangeJob = []

     this.cur_row=data
     this.cur_id=data.jobid
     this.cur_area=data.area
     this.cur_wagedom=data.wagedom
     
     let params = {
          sid: data.jobid,
          wagedom: data.wagedom
     };

      this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/Details",
          params: params,
          loading: true,
          tip: false
     })
      .then(results=>{
      	
      	this.getmawbdetail(results.data.basicInfo.oldid).then(res => {
      		  if(res){
      		  	this.ponoDetail = res;
              this.ponoDetail.boguid = results.data.basicInfo.oldid;
      		  }else{
      		  	this.ponoDetail = {}
      		  }
              // if (data.wagedom == '调账' && data.jobno && !data.jobno.includes('TZTS') && !data.jobno.includes('TZCW') && !data.jobno.includes('TZ2') && !data.jobno.includes('TZYW')) {
              //   this.getTzList(params).then(res => {
              //     this.OrderVisible = true;
              //   });
              // } else {
              //   this.OrderVisible = true;
              // }
                    this.getTzList(params).then(res => {
                  this.OrderVisible = true;
                });
           


          })
      })


     //this.OrderVisible=true
     

    },

    async getmawbdetail(boguid) {//获取调账列表
        if (boguid == -1) return false
        return await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: boguid },
          loading: true,
          tip: false
        }).then(result => {
          return result.data
        })
      },

     async getTzList(data) {//获取调账列表
        return await this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/GetChangeBill",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          this.listBillChangeJob = result.data.tzinfo
          this.listBillChangeJobWage = result.data.wageinfo
          this.$nextTick(() => {
            this.handleClickJob({ index: this.listBillChangeJob.findIndex(i => i.billno == this.cur_row.jobno) })
          })
          return result.data
        })
    },

    async piliangWagebohui() { //批量确认驳回
    let editlist = []
    this.$refs.myCommonTable.forEach(i => {
        editlist.push(JSON.parse(JSON.stringify(i.editData)))
    })

    if (!this.rollbackreason) return this.$message.error('请填写驳回理由！');

    editlist.forEach(i => {
        i.czman = localStorage.usrname
        i.initiator = this.initiator
        i.status = -1
        i.rollbackreason = this.rollbackreason
        i.isfree = (i.isfree == '是' || i.isfree == 2) ? 2 : 1

        i.wagedom = this.resetJieshuanWagedom(i, this.allmaindata);
        delete i.confirmstatus
    })
    // console.log(editlist);return;
    let confirm = await this.$confirm("请确认操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    })
    if (!confirm) return;
    this.$axios({
        method: 'post',
        url: this.$store.state.webApi + 'api/WageReject/Reject',
        loading: true,
        data: editlist
    }).then(res => {

        if (res.data.resultstatus == 0) {
            this.$message.success(res.data.resultmessage);
            this.bohuiVisible = false;
            this.getReconDeatil()
        } else {
            this.$message.error(res.data.resultmessage)
        }
    })

},
handleClick(tab){
let data=this.hawbListTab[tab.index]
//this.handleClick(this.hawbListTab[tab.index]).then(results=>console.log(results))
console.log(data)
if(!this.bohuiAllObjet[data.boguid]['allmaindata']['boguid']){
  this.getMawbDetail(data)
  console.log(this.bohuiAllObjet)	
}else{
  this.allmaindata=	this.bohuiAllObjet[data.boguid]['allmaindata']
  this.wageBohuiData= this.bohuiAllObjet[data.boguid]['wageBohuiData']
}

//console.log(tab)
},
handleClickJob(tab) {
	let index = Number(tab.index || 0)
	this.listBillChecked = index
	if (!this.listBillOpened.includes(index)) {
	  this.listBillOpened.push(index)
	}
},


  

  },
  computed: {

  }
};
</script>


<style scoped lang="less">

</style>
