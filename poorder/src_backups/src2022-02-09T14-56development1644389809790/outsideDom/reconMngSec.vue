<template>
  <div>
        <div  class="page-container-box" >
         <newSearchComp
                  :name="name"
                  :view-data.sync="inputViewData"
                  :model-data.sync="inputModelData"
                  :search-data.sync="searchData"
                  :pageshow.sync='pageshow'
                  :chinese-where.sync="chineseWhere"
                  :pagetype="1"
                  >
         </newSearchComp>
         <div class="searchForm">
          <p style="float:left">
          <el-button @click="search" type="primary">{{$t('outside.inquiry')}}</el-button>
          </p>
          <!-- <p style="float:right">
           <el-button @click="reset" type="default" style="margin-right:2px;" v-if="pageshow">{{$t('outside.reset')}}</el-button> -->
          <!--  <el-button  @click="setPageshow=!setPageshow" >
          {{setPageshow?'收起':'展开'}}
          </el-button> -->
          <!-- </p> -->
          </div>
        </div>
       
        <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
<div class="tableWraper" >
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal" ref="tableRef" :overIndex.sync="overIndex">

<template slot="print" slot-scope="props">
<!--  <el-tooltip class="item" effect="light" :content="$t('tips.download')" placement="bottom-start">
<a :href="$store.state.webApi+'api/ExAiraxpCheckBillPchDoc?id='+props.data.row.billid" target="_blank"><span class="download"></span></a>
  </el-tooltip> -->
  <el-tooltip class="item" effect="light" :content="$t('tips.preview')" placement="bottom-start" >

 <i class="el-icon-view" @click="urlF(props.data.index,props.data.row)"></i>

 </el-tooltip>
</template>
<!--  <template slot="confirm" slot-scope="props">
 <i class="el-icon-check" style="color:green" @click.stop=""></i>
 
 </template>

 <template slot="back" slot-scope="props">
    <i class="el-icon-close" @click.stop=""></i>

 </template> -->


 </tableCompt>
 </div>

  <el-dialog  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false"  >
         <cargoDeatil :visible.sync="dialogShow"  :area="area"  :storeguid="storeguid"></cargoDeatil>
 </el-dialog>


  <el-dialog  center :visible.sync="expressShow"  :close-on-click-modal="false" :close-on-press-escape="false" width="1200px" top="0%" :modal="false"  custom-class="setDialog" height="100%" @close="url=''">
   <h2>
      {{pzNumber}}
    </h2>

   <embed :src="url" width="98%" v-if="url" height="800px" name="pdf">


 </el-dialog>


   <!-- 取消对账弹框 -->
<!--   <el-dialog width="800px"
  top="4%"
  center
  :visible.sync="abanDz"
  v-if="abanDz" append-to-body
    @close="closeAbanDz"
  custom-class="reason"
  >

        <div>



<div class="orderSystem-c">
      <h3>取消原因</h3>
      <p class="orderNo">
        <span style="color:#004d84;float:left;font-weight:bold">{{jobListData[cancelCostIndex].pono}}</span>
        <span style="color:#333;float:right">{{jobListData[cancelCostIndex].accountcomname}}</span>
      </p>
      <ul>
        <li>总运单号</li>
        <li>始发港</li>
        <li>目的港</li>
        <li>实际件重体</li>
        <li>航班号</li>
        <li>航班日期</li>
      </ul>
      <ul style="margin-top:3px;">
        <li>{{jobListData[cancelCostIndex].mawb}}</li>
        <li>{{jobListData[cancelCostIndex].sfg}}</li>
        <li>{{jobListData[cancelCostIndex].mdg}}</li>
        <li>{{jobListData[cancelCostIndex].realjzt}}</li>
        <li>{{jobListData[cancelCostIndex].hbh}}</li>
        <li>{{jobListData[cancelCostIndex].hbrq.substring(0,10)}}</li>
      </ul>

      <el-input type="textarea" v-model="abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="工作号取消原因输入框"></el-input>

      <div class="costItems">
      <div  style="width:710px;overflow:hidden;display:inline-block" >
        <ul class="costItemsList" style="width:10000px;overflow:hidden;">
           <li v-for="(item,index) in jobListData[cancelCostIndex].wagelist" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
           <el-badge is-dot class="item" v-if="item.abandonReason">{{item.items}}</el-badge>
           <span v-else>{{item.items}}</span>
           </li>
        </ul>
      </div>

        <div style="display:inline-block">
          <i class="el-icon-caret-left"  @click="changeDirection(1)"></i>
          <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
        </div>

      </div>

      <div class="costItemsContent" style="margin-top:16px;">
        <ul>
        <li>对账金额</li>
        <li>单价</li>
        <li>数量</li>
        <li>货币</li>
  </ul>
  <ul style="margin-top:3px;">
        <li>{{jobListData[cancelCostIndex].wagelist[costItemsActive].thisfinishwageall_checkbill}}</li>
        <li>{{jobListData[cancelCostIndex].wagelist[costItemsActive].price}}</li>
        <li>{{jobListData[cancelCostIndex].wagelist[costItemsActive].num}}</li>
        <li>{{jobListData[cancelCostIndex].wagelist[costItemsActive].currency}}</li>
  </ul>

  <el-input type="textarea" v-model="jobListData[cancelCostIndex].wagelist[costItemsActive].abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:8px;color:#c8c8c8" :placeholder="jobListData[cancelCostIndex].wagelist[costItemsActive].items+'取消原因输入框'"></el-input>

      </div>


</div>

     <p style="margin-top:18px;text-align:right">
       <el-button @click="cancelDzFw(wageIdS)" type="primary">确定</el-button>
       <el-button @click="closeAbanDz">取消</el-button>
     </p>
   </div>
  </el-dialog> -->



  </div>
</template>

<script>

import { searCondition,getChangeValue,computedWeight,formatDate } from './api/sessionStorage.js'
import cargoDeatil from './orderDetails/cargoDeatil'
export default {
  name: 'reconMngSec',
  components: {
    cargoDeatil
  },
  data () {
    return {
      name:"reconMngSec.vue",
      showTotal:{all:true,ybjzt:true,sjjzt:true,zdjzt:true,wageprofit:true,realwageall:false,billwageall:false,wageall:false,finishwageall:false,finishwageall_checkbill:false,thisfinishwageall_checkbillrmb:true},
      inputViewData:{
        pono:{'title':'订舱编号',type:1},
        mawb:{'title':'总运单号',type:1,verify:'mawb'},
        hawb:{'title':'分运单号',type:1},
        pchno:{'title':'对账批次号',type:1},
        hbh:{'title':'航班号',type:1},
        hbrq:{'title':'航班日期',type:15},
            qsd: { 'title': '起始地', type: 1 },
        sfg: { 'title': '始发港', type: 1 },
        mdg: { 'title': '目的港', type: 1 },
        mdd: { 'title': '目的地', type: 1 },
        addman:{'title':'创建人',type:1},
        adddate:{'title':'创建时间',type:15,defaultVal:true},
      },
      inputModelData:{},
      searchData:{},
      chineseWhere:[],
      pageshow:true,
      tableDataRes:[],
      ziTableData:[],
      putIndex:-1, //点击打开展开分单索引
      dialogShow:false,
      storeguid:'',
      area:'',
      overIndex:'-1',
      expressShow:false,
      url:'',
      pzNumber:'',
      //setPageshow:true,
    }


  },
  created(){
 





  },
  computed: {
    

  },
  watch:{
   

  },
  methods: {
    getZimessage(msg){
     // alert(msg.index)
     this.getHawbList(msg)
   },
   downLoad(){
   console.log('下载')
   },

   // 预览
   urlF(index,data){
    this.url=`${this.$store.state.webApi}api/ExAiraxpCheckBillPchDoc?id=${data.billid}&czman=${this.czname}&logExtraData=PC,上海`

    this.expressShow=true
    
     this.pzNumber=data.pchno
   },
   // 打印？
   transmitZiMsg(msg){

     if(!msg.row){
      this.printIndex=msg.index

     this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid:this.tableDataRes[this.putIndex].boguid},loading:false,tip:false}).then(results=>{
       var data=results.data
       this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxpline',params:{guid:this.ziTableData[msg.index].guid},loading:true,tip:false}).then(res=>{
         var hawbdata=res.data
         data.mdg=hawbdata.mdg
         data.zdpiece=hawbdata.zdpiece
         data.zdweight=hawbdata.zdweight
         data.zdvolume=hawbdata.zdvolume
         data.smallpiece=hawbdata.smallpiece
         data.englishpm=hawbdata.englishpm
         data.jfweight=computedWeight(hawbdata.zdvolume,hawbdata.zdweight)
         data.hawb=hawbdata.hawb
         data.guid=hawbdata.guid
         data.orderdom='分单'
         this.mawbDetail=data
         setTimeout(() => {
          this.$refs.makingbill&&this.$refs.makingbill.printFunc()
          this.printIndex=-1
        }, 500);

       })
     })
   }else{
    //console.log(msg.row.boguid)
    //this.dialogShow=true
    //this.boguid=msg.row.boguid
    //this.boguid="18981895065518080"
   }
     
   },

   getHawbList(msg){
     this.putIndex=msg.index

     this.ziTableData=[];

     this.ziTableData=this.tableDataRes[msg.index].wageList
     //let guid=this.tableDataRes[msg.index].guid

  //    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxpline',params:{hpoidHawbList:guid},loading:false,tip:false}).then(results=>{

  //     if(results.data.length==0){
  //      this.$message('无查询结果！');
  //      return;
  //    }else{
  //     results.data=getChangeValue(results.data,'空出')
  //     setTimeout(()=>{
  //       this.ziTableData=results.data;
  //     },20)

  //   }



  // })
   },
   search(){
 this.tableDataRes=[];
    this.ziTableData=[]; 
    var jsonArr2={
      where:this.searchData,
      order:"adddate desc"

    }
    jsonArr2.where.billstatus='1000'
    var json={'json':JSON.stringify(jsonArr2)}
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchFinishCollect',params:json,loading:true,tip:false})
    .then(results=>{
    
     if(results.data.length>0){
       this.pageshow=false
     }else{
      this.$message(this.$t('common.noresults'));
     }
      results.data=getChangeValue(results.data,'空出')
      setTimeout(()=>{
       this.tableDataRes=results.data;

     },20)
      this.$refs.tableRef.ziTableIndex='-1'
    })
    .catch(error=>{

    })
   },
   dialogOpen(row){
    this.dialogShow=true
    //this.boguid=row.boguid
    //this.storeguid=row.id
    this.storeguid='1449614'
    this.area='上海'
    //this.area=row.area
   },
   reset(){
    this.inputModelData={}
   }











  }
}
</script>

<style lang="less" scoped>
@import './outSearch.css';
</style>
