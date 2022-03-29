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

<!-- 预览 -->
<el-tooltip class="item" effect="light" :content="$t('tips.preview')" placement="bottom-start" v-if="props.data.row.pdfurl!=''">
<i class="el-icon-view" @click="urlF(props.data.index,props.data.row)" v-if="props.data.row.pdfurl!=''"></i>
</el-tooltip>

<!-- 快递单号 -->
<el-tooltip class="item" effect="light" :content="$t('tips.kdInfo')" placement="bottom-start" v-if="props.data.row.expressno!=''">
<i class="el-icon-tickets tickets" v-if="props.data.row.expressno!=''" @click="getExpress(props.data.row.expressno)"></i>
</el-tooltip>

 </template>

<!-- 确认收到 -->
 <template slot="detail" slot-scope="props">
   <el-tooltip class="item" effect="light" :content="$t('tips.receive')" placement="bottom-start" v-if="props.data.row.pztype=='纸质凭证'&&props.data.row.isreceive=='2'">
  <i class="el-icon-success receive" @click="receive(props.data.row.pzid,props.data.row.pzdom,props.data.index)" style="float:right;margin-right:30px;" v-if="props.data.row.pztype=='纸质凭证'&&props.data.row.isreceive=='2'"></i>
   </el-tooltip>
 </template>

 </tableCompt>
 </div>


<!-- 预览dialog -->
 <el-dialog  center :visible.sync="pdfShow"  :close-on-click-modal="false" :close-on-press-escape="false" width="1200px" top="0%" :modal="false"  custom-class="setDialog" height="100%" @close="url=''">
   <h2>
   {{pzNumber}}<span style="font-weight:bold;color:red">({{$t('tips.tips4')}})</span>
    </h2>

   <embed :src="url" width="98%" v-if="url" height="800px" name="pdf">

 </el-dialog>

<!-- 快递单号dialog -->
    <el-dialog  center :visible.sync="expressShow"  :close-on-click-modal="false" :close-on-press-escape="false" width="800px" top="10%" :modal="false"  custom-class="setDialog">
   <h2>
      {{$t('tips.kdInfo')}}({{kdno}})
    </h2>

   <el-timeline>
   <el-timeline-item  placement="top" v-for="(item, index) in expressData" :key="index" :timestamp="item.time">{{item.text}}</el-timeline-item>
   </el-timeline>
 </el-dialog>




  </div>
</template>

<script>

import { searCondition,getChangeValue,computedWeight,formatDate } from './api/sessionStorage.js'
export default {
  name: 'invoiceGet',
  components: {
    //cargoDeatil
  },
  data () {
    return {
      name:"invoiceGet.vue",
      showTotal:{all:true,ybjzt:true,sjjzt:true,zdjzt:true,wageprofit:true,realwageall:false,billwageall:false,wageall:false,finishwageall:false,finishwageall_checkbill:false,wageall:true},
      inputViewData:{
        pono:{'title':'订舱编号',type:1},
        mawb:{'title':'总运单号',type:1,verify:'mawb'},
        hawb:{'title':'分运单号',type:1},
        pzno:{'title':'凭证号',type:1},
        hbh:{'title':'航班号',type:1},
        hbrq:{'title':'航班日期',type:15},
         qsd: { 'title': '起始地', type: 1 },
        sfg: { 'title': '始发港', type: 1 },
        mdg: { 'title': '目的港', type: 1 },
        mdd: { 'title': '目的地', type: 1 },
         pzdom:{'title':'凭证类型',type:5,options:[{label:'账单 D/N',value:'账单'},{label:'发票 I/V',value:'发票'}],"whereStr":"in"},
        pzdate:{'title':'已开凭证日期',type:15,titleStyle:{'minWidth':'100px'},defaultVal:true},
        isreceive:{'title':'是否收到',type:4,options:[{label:this.$i18n.locale=='Chinese'?'收到':'Received',value:'1'},{label:this.$i18n.locale=='Chinese'?'未收到':'Unreceived',value:'2'}],pagetype:5}

      },
      inputModelData:{isreceive:'2'},
      searchData:{},
      chineseWhere:[],
      pageshow:true,
      tableDataRes:[],
      ziTableData:[],
      putIndex:-1, //点击打开展开分单索引
      dialogShow:false,
      storeguid:'',
      area:'',
      expressData:[],
      expressShow:false,
      kdno:'',
      overIndex:'-1',
      url:'',
      pzNumber:'',
      pdfShow:false,
      //setPageshow:true,
    }


  },
  created(){
 





  },
  computed: {
     czname(){
      return sessionStorage.getItem('out_uname')
    }

  },
  watch:{
   

  },
  methods: {
    getZimessage(msg){
     this.getHawbList(msg)
   },
   // 预览
   urlF(index,data){
    this.url=`${this.$store.state.webApi}api/ExAiraxpPzDoc?pzno=${data.pzno}&pzid=${data.pzid}&pzdom=${data.pzdom}&pdfurl=${data.pdfurl}&czman=${this.czname}&logExtraData=PC,上海`

    this.pdfShow=true
    
     this.pzNumber=data.pzno
   },
     //确认收到
  receive(pzid,pzdom,index){
     this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAiraxpPzReceive',data:{pzid:pzid,pzdom:pzdom},loading:true,tip:false})
     .then(results=>{
        if(results.data.resultstatus==0){
         this.$message.success(results.data.resultmessage)
         this.tableDataRes.splice(index,1)
        }else{
        this.$message.error(results.data.resultmessage)
        }
     })
     .catch(error=>{

     })
  },

   // downLoad(){
   // console.log('下载')
   // },
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
      order:"adddate desc"

    }
    //jsonArr2.where.pztype='电子凭证'
    //jsonArr2.where.billstatus='1000'
    var json={'json':JSON.stringify(jsonArr2)}
    //json.pztype="电子凭证"
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpPzFinishCollect',params:json,loading:true,tip:false})
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
  getExpress(express){
    this.$axios({method:'get',url:this.$store.state.webApi+'api/PubExpress',params:{expressno:express},loading:true,tip:false})
    .then(results=>{
      this.expressData=results.data
      if(this.expressData.length>0){
        this.expressShow=true
        this.kdno=express
      }
    })
    .catch(error=>{

    })
  },
   dialogOpen(row){
    //this.dialogShow=true
    //this.boguid=row.boguid
    //this.storeguid=row.id
    //this.storeguid='1449614'
    //this.area='上海'
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
