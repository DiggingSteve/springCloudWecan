<template>
  <div>
 <switchTabs v-model="activeTab" :tabList="tabList" > </switchTabs>
<!--  {{chartExtend}} -->
 <!-- {{tableTitle}} -->
<!--  {{tableData}} -->
<!-- {{tableData}} -->
<!-- {{totalData}} -->
 <!-- 货/单量统计 -->
 <keep-alive>
 <div v-if="activeTab=='1'">
 <div class="search">
   <div style="float:left">
     <span class="grey">
       {{$t('outside.timeType')}}
     </span>
     <span>

     <el-select v-model="timeType" style="width:110px;border-radius:10px;margin-left:10px;display:inline-block;height:32px;">
        <el-option
        key="1"
        :label="$t('placeHolder.month')"
        value="1">
        </el-option>
        <el-option
        key="2"
         :label="$t('placeHolder.quarter')"
        value="2">
        </el-option>
        <el-option
        key="3"
         :label="$t('placeHolder.year')"
        value="3">
        </el-option>
      </el-select>

      <div style="display:inline-block;border-radius:20px;border:1px solid #DCDFE6;margin-left:10px;height:32px;position:relative;background:#fff8ef">
                    <el-date-picker
                     
                      v-model="hbrqbegin"
                      :type="timeType=='2'||timeType=='3'?'year':'month'"
                      :value-format="timeType=='2'||timeType=='3'?'yyyy':'yyyy-MM'"
                     
                      :placeholder="$t('placeHolder.begin')"
                      class="rangeDate input-required"
                      style="width:100px;"
                      clearable
                    ></el-date-picker>
                    <span style="color:#666;padding-top:7px;">{{$t('placeHolder.to')}}</span>
                    <el-date-picker
                   
                      v-model="hbrqend"
                      :type="timeType=='2'||timeType=='3'?'year':'month'"
                       :value-format="timeType=='2'||timeType=='3'?'yyyy':'yyyy-MM'"
                      :placeholder="$t('placeHolder.end')"
                      class="rangeDate input-required"
                      style="width:100px"
                      clearable
                    ></el-date-picker>
     </div>   

        <div class="searchItem">
          <span style="text-indent:0.6em;font-size:14px;"> {{$t('outside.qsd')}}</span>
          <el-input v-model="searchData.sfg.like" :clearable="true"></el-input>
        </div>
     <div class="searchItem">
         <span style="text-indent:0.6em;font-size:14px;"> {{$t('outside.sfg')}}</span>
         <el-input v-model="searchData.sfg.like" :clearable="true"></el-input>
     </div>

     <div class="searchItem">
         <span style="text-indent:0.6em;font-size:14px;"> {{$t('outside.mdg')}}</span>
         <el-input v-model="searchData.mdg.like" :clearable="true"></el-input>
     </div>
      <div class="searchItem">
        <span style="text-indent:0.6em;font-size:14px;"> {{$t('outside.mdd')}}</span>
        <el-input v-model="searchData.mdg.like" :clearable="true"></el-input>
      </div>

     <div class="searchItem">
         <span style="text-indent:0.6em;font-size:14px;"> {{$t('outside.hbh')}}</span>
         <el-input v-model="searchData.hbh.like" :clearable="true"></el-input>
     </div>

     </span>

      <div style="margin-top:12px;">
       <!--  <el-button @click="searchShow=!searchShow">{{$t('message.moreCondition')}}</el-button> -->
        <el-button @click="searchTotalData" type="primary">{{$t('common.search')}}</el-button>
<!--         <div class="searchDiv" v-if="searchShow">
          <el-collapse-transition>
          <div>
            <div style="display:inline-block">
               <span style="text-indent:0.6em;font-size:14px;"> {{$t('message.sfg')}}</span>
               <br>
               <el-input v-model="searchData.sfg.like"></el-input>
            </div>
            <div style="display:inline-block">
             <span style="text-indent:0.6em;font-size:14px;">{{$t('message.mdg')}}</span><br>
               <el-input v-model="searchData.mdg.like"></el-input>
            </div>
            <div style="display:inline-block">
             <span style="text-indent:0.6em;font-size:14px;">{{$t('message.hbh')}}</span><br>
               <el-input v-model="searchData.hbh.like"></el-input>
            </div>
            <br>
            <el-button type="primary" style="margin-top:12px;" @click="searchTotalData">{{$t('common.search')}}</el-button>
          </div>

          

          </el-collapse-transition>
        </div> -->
     </div>  

   </div>
<!--    <div style="float:right">
     <span class="grey">
       {{$t('message.contrastiveTerms')}}
     </span>
     <el-select v-model="dataType" style="width:120px;border-radius:10px;display:inline-block;height:32px;margin-right:10px;margin-left:10px;" @change="dataTypeChange">
        <el-option
        key="1"
        :label="$t('placeHolder.airarea')"
        value="1">
        </el-option>
        <el-option
        key="2"
        :label="$t('placeHolder.aircom')"
        value="2">
        </el-option>
        
      </el-select>
   </div> -->
 </div>

 <div style="width:100px;clear:both;position:relative">
   <el-select v-model="mark"  @change="markChange" style="position:absolute;top:40px;z-index:9999"  v-if="totalData.data.length>0" id="select2">
      <el-option
        key="1"
        :label="$t('placeHolder.num')"
        value="1">
        </el-option>
        <el-option
        key="2"
        :label="$t('placeHolder.piece')"
        value='2'>
        </el-option>
        <el-option
        key="3"
         :label="$t('placeHolder.jfweight')"
        value="3">
        </el-option>
        <el-option
        key="4"
        :label="$t('placeHolder.hwweight')"
        value="4">
        </el-option>
   </el-select>
  </div>
    <!-- 图表内容 -->
    <div id="charts" ref="charts" style="width:98%;height:400px;margin-top:18px;">
      

    </div>
    <!-- 对比 -->
     <div v-if="tableData.length>0" style="margin-bottom:20px;">
     <span class="grey" style="font-weight:bold;font-size:16px;color:#444;margin-right:20px;">
       {{$t('outside.contrastiveTerms')}}:
     </span>
     <el-radio v-model="dataType" label="1" @change="dataTypeChange">{{$t('placeHolder.airarea')}}</el-radio>
     <el-radio v-model="dataType" label="2" @change="dataTypeChange">{{$t('placeHolder.aircom')}}</el-radio>
     <!-- <el-select v-model="dataType" style="width:120px;border-radius:10px;display:inline-block;height:32px;margin-right:10px;margin-left:10px;" @change="dataTypeChange">
        <el-option
        key="1"
        :label="$t('placeHolder.airarea')"
        value="1">
        </el-option>
        <el-option
        key="2"
        :label="$t('placeHolder.aircom')"
        value="2">
        </el-option>
        
      </el-select> -->
   </div>
    <!-- 表格头部 -->
    <div style="display: inline-flex; justify-content: space-between; align-items: center; flex: 1 1 0%; padding-right: 8px;margin-bottom:10px;" v-if="tableData.length>0">
    <h2 class="tableTitle">{{$t('outside.survey')}}</h2>
    <div class="tableTotal">
      <span class="totalList" v-for="item in tableTitle">
        {{$t(item.field)}}:
        <span class="resultBlue">
          {{item.num}}
        </span>
      </span>
    </div>
    </div>

    <!-- 表格 -->
     <commonTable class="commonTable" :head="dataTabeHead" :table-data="tableData" :paginationShow='true' v-if="tableData.length>0">
       <template slot="contrastive" slot-scope="props">
         <div style="width:100px;margin:0 auto">
           <span><i :style="{'display':'inlineBlock','width':'8px','height':'8px','background':props.data.row.color}"></i></span>
           <span>{{props.data.row.contrastive}}</span>
         </div>
       
       </template>
     </commonTable>
<!--  <ve-line :extend="chartExtend" style="margin-top:20px;" height="580px" :init-options="dom" id="canvas" :events="chartEvents"></ve-line>
 <ve-histogram :extend="chartExtend2"></ve-histogram> -->
</div>


 <!-- 运费统计 -->


 <div v-if="activeTab=='2'">
   22
 </div>
 </keep-alive>


  </div>
</template>

<script>
 // import VeLine from 'v-charts/lib/line.common'
 // import VeHistogram from 'v-charts/lib/histogram.common'
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/legend');
require('echarts/lib/component/tooltip');
//require('echarts/lib/component/axis');
require('echarts/lib/component/axisPointer');

export default {
 components: {
    // VeLine,VeHistogram
  },
  data () {
    return {
      activeTab:'1',
      dataIndex:'',
      tabList:[
      { label: 'outside.total1', value: '1' }
      ],
      timeType:'3',
      searchData:{sfg:{'like':''},mdg:{'like':''}, qsd: { 'like': '' }, mdd: { 'like': '' },hbh:{'like':''}},
      hbrqbegin:'',
      hbrqend:'',
      searchShow:false,
      totalData:{columns:{areanameList:[],aircompanyList:[]},data:[]},
      dataType:'1',//数据切换
      mark:'1',//指标
      myChart:null,//空图表,
      tableData:[],//表格数据    
      dataTabeHead:[//表格头
      {field:"contrastive",title:'对比项'},
      {field:"allnum",title:'总票数',ifsort:true},
      {field:"allpiece",title:'总件数',ifsort:true},
      {field:"alljfweight",title:'总计费重量',ifsort:true},
      {field:"allstoreweight",title:'总货物重量',ifsort:true},
      ],
      tableTitle:[
      {'field':'tableHeadRs.allNum',title:'总票数',num:0},
      {'field':'tableHeadRs.allPiece',title:'总件数',num:0},
      {'field':'tableHeadRs.alljfweight',title:'总计费重量',num:0},
      {'field':'tableHeadRs.allstoreweight',title:'总货物重量',num:0},
      ],
      colors:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],

      chartExtend:{
       legend:{
         data:[],
         select:{},
         height:'',
         width:'90%',
         right:0
       },
       axisPointer: {
        link: [{
          xAxisIndex: [0, 1]
        }]
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      graphic:{
        type: 'group',
        left: 'center',
        top: 70,
        width: 300,
        bounding: 'raw',
      },
      xAxis: [
      {
       type: 'category',
       boundaryGap: true,
       data: [],
       axisLine: {show:false},
       axisPointer: {
        show: true
      },
      axisTick:{lineStyle:{color:'#EEEEEE'}}  
    },
    {
      type: 'category',
      gridIndex: 1,
      data: [],
      splitLine: {show: false},
      axisLabel: {show: false},
      axisTick: {show: false},
      axisLine: {show:false},
      axisPointer: {
        type: 'none',
        label: {show: false},
        triggerTooltip: true,
                // handle: {
                //     show: true,
                //     margin: 30,
                //     color: '#B80C00'
                // }
              }

            }

            ]

            ,  
            yAxis:[
            {
              type: 'value',
              axisLine: {show:false},
              axisTick:{lineStyle:{color:'#EEEEEE'}}   
            }
            ,{
              gridIndex: 1,
              axisLine: false,
              axisTick: {show: false},
              splitLine: {show: false},

            }

            ] 

            ,
            grid:[
            {
              top:80,
              left:0,
              height: 220,
              width:'100%',
              containLabel:true
            },
            {
            left: 10,
            height:30,
            top:330,
            width:'100%',
            containLabel: true
      }

      ],
          series: [
        ]
      },

    }
  },

  created(){
 

  },
  mounted(){
    //alert('1')
    this.$nextTick(()=>{
        if(!this.myChart){
          //alert('1')
          this.setEchart()
        }
        
    })

  },
  updated () {
    
    
        this.setEchart()
    
    
    // this.dataTypeChange(this.dataType)

  },
  computed: {
    

  },
  watch:{


  },
  methods: {
    //查询
    searchTotalData(){
      if(!this.hbrqbegin||!this.hbrqend){
        this.$message.error(this.$t('tips.reqiuredTip',{'msg':this.$t('outside.hbrq')}));
        return false
      }
      this.chartExtend.xAxis[0].data=[]
      this.chartExtend.xAxis[1].data=[]

      var data={sfg:{'like':''},mdg:{'like':''},hbh:{'like':''}, qsd: { 'like': '' }, mdd: { 'like': '' }}
      Object.keys(this.searchData).forEach(item=>{
        if(data[item].like!=''){

          data[item].like=data[item].like
        }else{
          delete data[item]
        }
      })
      var jsonArr2={
        where:data,
      }
      var json={'json':JSON.stringify(jsonArr2)}
      json.type=this.timeType
      json.hbrqbegin=this.hbrqbegin
      json.hbrqend=this.hbrqend

      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExStatistics',params:json,loading:true,tip:false})
      .then(results=>{
       console.log(results.data)
       this.totalData=results.data
       this.searchShow=false

       this.totalData.data.forEach(item=>{
        this.chartExtend.xAxis[0].data.push(item.hbrq)
        this.chartExtend.xAxis[1].data.push(item.hbrq)
      })
 
       this.dataTypeChange(this.dataType)
       
  

     })
      .catch(error=>{

      })
    },

//切换航线还是航空公司
dataTypeChange(val){


  if(val=='1'&&this.totalData.columns.areanameList.length>0){
    this.chartExtend.legend.data=[]
    this.chartExtend.legend.selected={}
    this.chartExtend.series=[]
     this.tableData=[]
    this.totalData.columns.areanameList.forEach((item,index)=>{
      this.chartExtend.legend.data.push(item)
      this.tableData.push({'contrastive':item,allnum:0,allpiece:0,alljfweight:0,allstoreweight:0,color:this.colors[index]})
      this.chartExtend.series.push({'name':item,type:'line',data:[],smooth: true})
    })
    
  }else if(val=='2'&&this.totalData.columns.aircompanyList.length>0){
    this.chartExtend.legend.data=[]
    this.chartExtend.legend.selected={}
    this.chartExtend.series=[]
     this.tableData=[]
    this.totalData.columns.aircompanyList.forEach((item,index)=>{
      this.chartExtend.legend.data.push(item)
      this.tableData.push({'contrastive':item,allnum:0,allpiece:0,alljfweight:0,allstoreweight:0,color:this.colors[index]})
      this.chartExtend.series.push({'name':item,type:'line',data:[],smooth: true})
    })
     
  }
  this.chartExtend.series.push({'name':'TotalAll',type:'bar',data:[],xAxisIndex: 1, yAxisIndex: 1,itemStyle: {
            normal: {

                color: '#e1e1e1'
            },  
            emphasis: {
                color: '#116cf3'
            }
        },})
   if(this.chartExtend.legend.data.length>8){
    for(var i=8;i<this.chartExtend.legend.data.length;i++){
       this.$set(this.chartExtend.legend.selected,this.chartExtend.legend.data[i],false)
    }
   }else{
    for(var i=0;i<this.chartExtend.legend.data.length;i++){
       this.$set(this.chartExtend.legend.selected,this.chartExtend.legend.data[i],true)
    }
   }
   this.markChange(this.mark)
   this.getTableData()
},

markChange(val){
    
    this.chartExtend.series.forEach(item=>{
      item.data=[]
    })

 var mark="";
  var dataType=""

  if(val=='1'){
    mark='num'
  }else if(val=='2'){
    mark='piece'
  }else if(val=='3'){
    mark='jfweight'
  }else if(val=='4'){
    mark='storeweight'
  } 

  if(this.dataType=='1'){
    dataType='areanameList'
  }else if(this.dataType=='2'){
    dataType='aircompanyList'
  }

  this.chartExtend.series.forEach((item,index)=>{
       this.totalData.data.forEach((item2,index2)=>{
        var all=0
        var shao=true
      if(item2[dataType].length>0){
       item2[dataType].forEach(item3=>{
        
        //all=Number(Number(all).toFixed(2)+Number(item3[mark]).toFixed(2)).toFixed(2)
        all+=item3[mark]
        if(item.name==item3.mainKey){
         shao=false
         item.data.push(item3[mark])
       }else if(item.name=='TotalAll'){
         item.data[index2]=Number(all).toFixed(2)
       }
     })
       if(shao){ 
        item.data.push(0)
       }
     }else{
      item.data.push(0)
    }
  })
  })
//console.log(this.myChart)
console.log(this.chartExtend)
   this.myChart.setOption(this.chartExtend,true)


 

 


},

//初始化
setEchart () {

var dom = document.getElementById('charts')
this.myChart = echarts.init(dom);
 
},

//获取表格数据
getTableData(){
      this.tableTitle=[
      {'field':'tableHeadRs.allNum',title:'总票数',num:0},
      {'field':'tableHeadRs.allPiece',title:'总件数',num:0},
      {'field':'tableHeadRs.alljfweight',title:'总计费重量',num:0},
      {'field':'tableHeadRs.allstoreweight',title:'总货物重量',num:0},
      ]
var dataType=''
   if(this.dataType=='1'){
    dataType='areanameList'
  }else if(this.dataType=='2'){
    dataType='aircompanyList'
  }

this.tableData.forEach(item=>{
  this.totalData.data.forEach(item2=>{
      if(item2[dataType].length>0)
      item2[dataType].forEach(item3=>{
        if(item3.mainKey==item.contrastive){
          item.allnum+=item3['num']
          item.allpiece+=item3['piece']
          item.alljfweight+=item3['jfweight']
          item.allstoreweight+=item3['storeweight']
        }
      })
  })
   this.tableTitle[0].num+=item.allnum
   this.tableTitle[1].num+=item.allpiece
   this.tableTitle[2].num=Number(Number(this.tableTitle[2].num)+item.alljfweight).toFixed(2)
   this.tableTitle[3].num=Number(Number(this.tableTitle[3].num)+item.allstoreweight).toFixed(2)

   item.alljfweight=Number(item.alljfweight).toFixed(2)
  
   item.allstoreweight=Number(item.allstoreweight).toFixed(2)

   // setTimeout(()=>{
   // this.tableTitle[2].num=Number(this.tableTitle[2].num).toFixed(2)
   // this.tableTitle[3].num=Number(this.tableTitle[3].num).toFixed(2)
   // },1000)
   
  
})
// this.tableTitle[2].num=this.tableTitle[2].num).toFixed(2)
// this.tableTitle[3].num=Number(this.tableTitle[3].num).toFixed(2)

},



  }
}
</script>

<style lang="less" scoped>
  .search{
    height:32px;
    //margin-bottom:80px;
    span{
      display:inline-block;
      vertical-align:top;

     .searchDiv{
      padding:20px;
      margin-top:12px;
      box-shadow:0 0 2px #DCDFE6;
      position:absolute;
      background:#fff;
      color:#606266;
      z-index:99999;
      /deep/.el-input__inner{
        border:none;
        border-bottom:1px solid #DCDFE6;
      }
     }
   }
   .grey{
    color:#B5B5B5;
    margin-top:8px;
  }
}
      /deep/.el-select .el-input__inner{
        border-radius:20px;
      }
      /deep/#select2{
        border:none!important;
      }
      .rangeDate {
        /deep/ .el-input__prefix {
          display: none;
        }
        /deep/ .el-input__inner {
          padding: 0 12px;
          border:none;
          border-left:1px solid #DCDFE6;
          border-radius:20px;
          height:30px;
          &:nth-child(1){
           border:none;
           //border-left:1px solid #DCDFE6;
         }
       }
     }
     .tableTitle{
     font-weight: bold;
    font-size: 18px;
    color: #444;
     }
     .tableTotal{
      margin-left:100px;
      .totalList{
        margin-right:8px;
        .resultBlue{
         color:#4795FA
        }
      }
     }
     .searchItem{
      display:inline-block;
      width:220px;
      height:32px;
      border-radius:20px;
      border:1px solid #DCDFE6;
      line-height:30px;
      vertical-align:middle;
      color:#B5B5B5;
      margin-left:5px;
      margin-top:-3px;
      /deep/.el-input{
        width:150px;     

        /deep/.el-input__inner{
          border:none;
        }
      }
     }
</style>
