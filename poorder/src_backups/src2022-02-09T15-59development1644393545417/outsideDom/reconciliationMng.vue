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
                  @reset="reset"
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

<div class="tableWraper">
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal" ref="tableRef" :overIndex.sync="overIndex" @transSelIndex="dialogOpen">



<!--  <template slot="confirm" slot-scope="props">
<el-tooltip class="item" effect="light" :content="$t('tips.confirm')" placement="bottom-start">
 <i class="el-icon-check" style="color:#01AA00;font-weight:bold;margin-left:-10px;" @click.stop="confirmDz(props.data.index,props.data.row)"></i>
</el-tooltip>
 </template>

 <template slot="back" slot-scope="props">
 <el-tooltip class="item" effect="light" :content="$t('tips.back')" placement="bottom-start">
    <i class="el-icon-close" style="font-weight:bold" @click.stop="backDz(props.data.index,props.data.row)"></i>
</el-tooltip>
 </template> -->

  <!-- <template slot="funall1" slot-scope="props">
   <el-tooltip class="item" effect="light" :content="$t('tips.detail')" placement="bottom-start">
    <i class="el-icon-arrow-right detail" @click="dialogOpen(props.data.row,props.data.index)" :style="{'color':overIndex==props.data.index?'#fff':'','background':overIndex==props.data.index?'#116cf3':''}">
    </i>

  </el-tooltip>
 </template> -->



<!--  <template slot="pono" slot-scope="props">
   {{props.data.value}}
 </template>
 -->
 </tableCompt>
 </div>

  <el-dialog  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false"   v-if="dialogShow">
  <reconDetail :rowData="rowData" :visible.sync="dialogShow" :openIndex="openIndex" @spliceTab="tableDataSplice"></reconDetail>
 </el-dialog>


 <!-- 取消对账弹框 -->
 <!--  <el-dialog width="800px"
  top="4%"
  center
  :visible.sync="abanDz"
  v-if="abanDz" append-to-body

  custom-class="reason"
  >

        <div>



<div class="orderSystem-c">
      <h3>{{$t('cancelDzDialog.cancelReason')}}</h3>
      <p class="orderNo">
        <span style="color:#004d84;float:left;font-weight:bold">{{tableDataResBack[cancelCostIndex].wageList[0].pono}}</span>
        <span style="color:#333;float:right">{{tableDataRes[cancelCostIndex].accountcomname}}</span>
      </p>
      <ul>
        <li>{{$t('cancelDzDialog.mawb')}}</li>
        <li>{{$t('cancelDzDialog.sfg')}}</li>
        <li>{{$t('cancelDzDialog.mdg')}}</li>
        <li>{{$t('cancelDzDialog.realjzt')}}</li>
        <li>{{$t('cancelDzDialog.hbh')}}</li>
        <li>{{$t('cancelDzDialog.hbrq')}}</li>
      </ul>
      <ul style="margin-top:3px;">
        <li>{{tableDataResBack[cancelCostIndex].mawb}}</li>
        <li>{{tableDataResBack[cancelCostIndex].sfg}}</li>
        <li>{{tableDataResBack[cancelCostIndex].mdg}}</li>
        <li>{{tableDataResBack[cancelCostIndex].realjzt}}</li>
        <li>{{tableDataResBack[cancelCostIndex].hbh}}</li>
        <li>{{tableDataResBack[cancelCostIndex].hbrq.substring(0,10)}}</li>
      </ul>

      <el-input type="textarea" v-model="abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="工作号取消原因输入框"></el-input>

      <div class="costItems">
      <div  style="width:710px;overflow:hidden;display:inline-block" >
        <ul class="costItemsList" style="width:10000px;overflow:hidden;">
           <li v-for="(item,index) in tableDataResBack[cancelCostIndex].wageList" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
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
        <li>{{$t('cancelDzDialog.realwageallrmb')}}</li>
        <li>{{$t('cancelDzDialog.price')}}</li>
        <li>{{$t('cancelDzDialog.num')}}</li>
        <li>{{$t('cancelDzDialog.currency')}}</li>
  </ul>
  <ul style="margin-top:3px;">
        <li>{{tableDataResBack[cancelCostIndex].wageList[costItemsActive].realwageallrmb}}</li>
        <li>{{Number(tableDataResBack[cancelCostIndex].wageList[costItemsActive].price).toFixed(2)}}</li>
        <li>{{tableDataResBack[cancelCostIndex].wageList[costItemsActive].num}}</li>
        <li>{{tableDataResBack[cancelCostIndex].wageList[costItemsActive].currency}}</li>
  </ul>

  <el-input type="textarea" v-model="tableDataResBack[cancelCostIndex].wageList[costItemsActive].abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:8px;color:#c8c8c8" :placeholder="tableDataResBack[cancelCostIndex].wageList[costItemsActive].items+'取消原因输入框'"></el-input>

      </div>


</div>

     <p style="margin-top:18px;text-align:right">
       <el-button @click="cancelDzFw(wageIdS)" type="primary">{{$t('common.confirm')}}</el-button>
       <el-button @click="closeAbanDz">{{$t('common.cancel')}}</el-button>
     </p>
   </div>
  </el-dialog> -->



  </div>
</template>

<script>

import { searCondition,getChangeValue,computedWeight,formatDate,getMomentDate } from './api/sessionStorage.js'
import reconDetail from './orderDetails/reconDetail'
export default {
  name: 'reconciliationMng',
  components: {
   reconDetail
  },
  data () {
    return {
      name:"reconciliationMng.vue",
      showTotal:{all:true,ybjzt:false,sjjzt:false,zdjzt:false,wageprofit:false,realwageall:true,billwageall:false,wageall:false,finishwageall:false,finishwageall_checkbill:false},
      inputViewData:{
        pono:{'title':'订舱编号',type:1},
        mawb:{'title':'总运单号',type:1,verify:'mawb'},
        hawb:{'title':'分运单号',type:1},
        hbh:{'title':'航班号',type:1},
        hbrq:{'title':'航班日期',type:15,defaultVal:true},
          qsd: { 'title': '起始地', type: 1 },
        sfg: { 'title': '始发港', type: 1 },
        mdg: { 'title': '目的港', type: 1 },
        mdd: { 'title': '目的地', type: 1 },
     
      },
      inputModelData:{},
      searchData:{},
      chineseWhere:[],
      pageshow:true,
      tableDataRes:[],
      tableDataResBack:[],
      ziTableData:[],
      putIndex:-1, //点击打开展开分单索引
      dialogShow:false,
      storeguid:'',
      area:'',
      // wageinout:'',
      // costItemsActive:0,//激活费用服务
      // abandonReason:'',//工作号取消原因
      // abanDz:false,//取消对账弹框显示
      // cancelCostIndex:'',//取消对账index
      // wageIdS:'',//取消对账ids
      overIndex:'-1',
      rowData:{},//整条数据
      openIndex:'-1',

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
     this.getHawbList(msg)
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
    this.dialogShow=true
    this.rowData=this.tableDataResBack[msg.index]
    this.openIndex=msg.index
    this.$refs.tableRef.ziTableIndex='-1'
   }
     
   },

   getHawbList(msg){

      this.putIndex=msg.index

     this.ziTableData=[];

     this.ziTableData=this.tableDataRes[msg.index].wageList


  //    let guid=this.tableDataRes[msg.index].guid

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
    }
    jsonArr2.where.billstatus='900'
    var json={'json':JSON.stringify(jsonArr2)}
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchUnFinishCollect',params:json,loading:true,tip:false})
    .then(results=>{
     this.tableDataResBack=[...results.data]

     if(results.data.length>0){
       this.pageshow=false
     }else{
      this.$message(this.$t('common.noresults'));
     }

      results.data=getChangeValue(results.data,'空出')
      setTimeout(()=>{
       this.tableDataRes=results.data;
       this.tableDataResBack.forEach(item=>{
        this.$set(item.wageList,'abandonReason','')
        item.realjzt=item.realpiece+'/'+Number(item.realweight).toFixed(2)+'/'+Number(item.realvolume).toFixed(3)
       })


     },20)
     // console.log(this.$refs.tableRef.ziTableIndex)
     this.$refs.tableRef.ziTableIndex='-1'
    })
    .catch(error=>{

    })
   },
   dialogOpen(index){
    this.dialogShow=true
    this.rowData=this.tableDataResBack[index]
    this.openIndex=index
    this.$refs.tableRef.ziTableIndex='-1'
   },
   tableDataSplice(index){
    this.tableDataRes.splice(index,1)
   },
   //确认对账
  //  confirmDz(index,data){
  //   var data={czman:sessionStorage.logname,settjobid:data.settjobid,fid:sessionStorage.gid}
  //   this.$axios({"method":"post",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchBySid',data:data,loading:true})
  //   .then(results=>{
  //     if(results.data.resultstatus==0){
  //       this.$message.success(results.data.resultmessage+',  唯凯对账号为:'+results.data.resultno)
  //       this.tableDataRes.splice(index,1)
  //     }else{
  //       this.$message.error(results.data.resultmessage)
  //     }
  //   })
  //   .catch(error=>{

  //   })
  // },
   //取消对账弹框
   // backDz(index,data){
   //   this.wageIdS=""
   //   this.costItemsActive=0
   //   this.abanDz=true
   //   this.cancelCostIndex=index
   //   data.wageList.forEach(item=>{
   //    this.$set(item,'abandonReason','')
   //    this.wageIdS+=item.wageguid+','
   //  })
   //   this.area=data.area
   //   this.wageinout=data.wageinout

   // },
   //取消操作
  //  closeAbanDz(){
  //   this.abanDz=false;
  //   this.abandonReason="";
  //   this.tableDataResBack.forEach(item=>{
  //     item.wageList.forEach(item2=>{
  //       this.$set(item2,'abandonReason','')

  //     })
  //   })
  // },
    //取消对账方法
//     cancelDzFw(){

//      var abandonReasonLength=0
//      var delbillreasonJson=[]
//      this.tableDataResBack[this.cancelCostIndex].wageList.forEach(item=>{
//       abandonReasonLength+=item.abandonReason.length
//       delbillreasonJson.push({delbillreason:item.abandonReason,wageguid:item.wageguid})
//     })
//      console.log(abandonReasonLength)
//      if(!this.abandonReason&&abandonReasonLength==0){
//       this.$message.error('请填写取消对账原因');
//       return false;
//     }

//     let data = {
//       area:this.area,
//       system:'外网',
//       wageguidArr:this.wageIdS.substring(0,this.wageIdS.length-1),
//       delbillreason:this.abandonReason,
//       delbillreasonJson:delbillreasonJson,
//       isoutside :true,
//     //boguid:this.jobListData[this.cancelCostIndex].boguid,
//       accountcomname:sessionStorage.usr_name,
//       reasontype: this.wageinout == '1' ? '应收对账驳回' : '应付对账驳回'
//   }
//   //console.log(data)
//   this.$axios({"method":'delete',url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchWage',data: data})
//   .then(results=>{
//    if(results.data.resultstatus!=0){
//     this.$message.error(results.data.resultmessage)
//   }else{
//     this.$message.success(results.data.resultmessage)

//     this.abanDz=false
//     this.abandonReason=""
//     this.tableDataRes.splice(this.cancelCostIndex,1)
//   }
//   this.wageIdS=""
// })
//   .catch(error=>{

//   })

// },


// changeDirection(type){
//  var clientWidth=0
//  if(type==1){
//   this.arrowIndex--;
//   if(this.arrowIndex<0){
//     layer.msg('已至头部');
//     this.arrowIndex=0
//     return false;
//   }
// }else if(type==2){

//   $('.costItemsList').find('li').each(function(){

//           clientWidth=clientWidth+$(this).innerWidth()
//         })
    
//         if(clientWidth<710){
//          this.arrowIndex=0
//          return false
//        }else{
//         this.arrowIndex++
//       }
        
//         if(this.arrowIndex>Math.ceil((clientWidth-710)/200)){
//           layer.msg('已至尾部');
//           this.arrowIndex=Math.ceil((clientWidth-710)/200)
//           return false
//         }
//       }

//       $('.costItemsList').css('transform','translateX(-'+this.arrowIndex*200+'px)')


//     },

    reset(){
      this.inputModelData={}
    }











  }
}
</script>

<style lang="less" scoped>
@import './outSearch.css';



</style>
