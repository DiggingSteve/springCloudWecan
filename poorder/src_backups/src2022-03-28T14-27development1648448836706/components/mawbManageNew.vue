
<template>
  <div>
     <div class="buttonGroup" v-if="monitor=='1'">
       <el-button @click="setButton('first')" :class="[buttonGroup.first?'active':'']">正常运单</el-button>
       <el-button @click="setButton('second')" :class="[buttonGroup.second?'active':'']">预定运单</el-button>
       <el-button @click="setButton('third')" :class="[buttonGroup.third?'active':'']">外借运单</el-button>
        <el-button @click="setButton('forth')" :class="[buttonGroup.forth?'active':'']">
         <el-badge is-dot class="item" v-if="tableDataRes2.some(i=>i.alert=='1')">
        预警管理
        </el-badge>
        <span v-else>预警管理</span>
        </el-button>
     </div>

     <div class="buttonGroup" v-if="monitor=='2'">
       <el-button @click="setButton('fifth')" :class="[buttonGroup2.fifth?'active':'']">外站运单</el-button>
       <el-button @click="setButton('sixth')" :class="[buttonGroup2.sixth?'active':'']">供应商运单</el-button>
     </div>
    <div class="page-container-box">
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
        <template v-if="!buttonGroup.forth&&monitor=='1'">
        	<el-button @click="openDetail('','1')" v-if="buttonGroup.first">新增运单</el-button>
        	<el-button @click="mawbOperation(1,'转移')" v-if="buttonGroup.first&&showFirst">站点外借</el-button>
        	<el-button @click="mawbOperation(2,'预定')" v-if="buttonGroup.first&&showFirst">客户预定</el-button>
        	<el-button @click="cancelYd(1)" v-if="buttonGroup.second">取消预定</el-button>
          <el-button @click="deleteMawb('','',true)">批量删除</el-button>
        </template>
        <template v-if="monitor=='2'">
          <el-button @click="openDetail('','1')">新增运单</el-button>
          <el-button @click="cancelYd(2)" v-if="buttonGroup2.fifth">站点归还</el-button>
          <el-button @click="mawbOperation(2,'预定')" v-if="buttonGroup2.sixth">客户预定</el-button>
          <el-button @click="cancelYd(1)" v-if="buttonGroup2.sixth">取消预定</el-button>
          <el-button @click="deleteMawb('','',true)">批量删除</el-button>
        </template>
      </div>
    </div>
    <!-- 获取配舱选中数据 -->


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      name="mawbManageNew.vue"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      :chinese-where="chineseWhere"
      v-if="tableDataRes"
      showZiConfig
      v-show="!buttonGroup.forth"
      :showTotal="{all:false}"
    >
    <template slot="operate" slot-scope="props" >
    	<i class="el-icon-delete" @click="deleteMawb(props.data.row,props.data.index)"></i>
      <i class="el-icon-tickets"   @click="getHistory(props.data.row)"></i>
    </template>

    <template slot="mawb" slot-scope="props">
        <span @click="openDetail(props.data.row,'2')" style="color:#1a7dbf;cursor:pointer;">{{props.data.value}}</span>
    </template>

    <template slot="status" slot-scope="props">
    	<span :style="statusStyle(props.data.value)">{{getStatus(props.data.value)}}</span>
    </template>

    <template slot="bookingstatus" slot-scope="props">
      <span :style="statusBookingStyle(props.data.value)">{{getBookingStatus(props.data.value)}}</span>
    </template>

   
    </tableCompt>

    <tableCompt  name="alertManage.vue"
      :table-data-res="tableDataRes2"
      :nestedTableType="2"
      :chinese-where="chineseWhere"
      v-if="tableDataRes"
      showZiConfig
      v-show="buttonGroup.forth"
      :showTotal="{all:false}">

    <template slot="operate" slot-scope="props" >
       <i class="el-icon-yujingguanli" style="margin-left:20px;" @click="setWarning(props.data.row,props.data.row.index)"></i>
    </template>

    <template slot="alert" slot-scope="props">
      <span :style="alertStyle(props.data.value)">{{getAlert(props.data.value)}}</span>
    </template>

    </tableCompt>
    
    <!-- 新增修改运单 -->
     <el-dialog
      :title="mawbDialogTitle"
      top="50px"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="mawbAddDialogVisible"
       v-if="mawbAddDialogVisible"
      :before-close="mawbAddBeforeClose"
      custom-class="mawbDialog"
      >
      <mawbAdd
        :visible.sync="mawbAddDialogVisible"
        :before-close="mawbAddBeforeClose"
        :type="mawbAddDialogType"
        :mawbid="mawbid"
        pagefrom="维护"
        :mng="mng"
        ref="mawbAdd">
      </mawbAdd>
    </el-dialog>

    <el-dialog title="总运单配置" top="50px" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="mawbDialog" v-if="mawbHistoryShow" :visible.sync="mawbHistoryShow">
    <commonTable :head="mawbHistoryHead" :tableData="mawbHistoryData"></commonTable>
    </el-dialog>


   <!-- 运单一系列操作 -->
     <el-dialog
      :title="operateTitle"
      top="50px"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="operateDialog"
      custom-class="mawbDialog"
      >
      <mawbOperate
        v-if="operateDialog"
        :visible.sync="operateDialog"
        :type="operateType"
        :list="operateList"
        :title="operateTitle"
        >
      </mawbOperate>
    </el-dialog>
  
  </div>
</template>
<script>
import {systemCheck,mergeFunc, openZimessage} from '@/components/mixins/topPageMixin'
import mawbAdd from '@/components/templates/mawbAdd'
import mawbOperate from '@/components/templates/mawbOperate'

import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate,
  getMomentDate
} from "../api/localStorage.js";


export default {
  name: "mawbManageNew",
  mixins:[mergeFunc, openZimessage],
  components: {
  	mawbAdd,mawbOperate
  },
   props:{
     monitor:{
      type:[Number,String],
      default:1
     }
  },
  data() {
    return {
      name: "mawbManageNew.vue",
      inputViewData: {
      	status:{
      		title: "运单状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options:[ 
              { label: '可用', value: '1' },
              { label: '已领用', value: '2' },
              { label: '作废', value: '5' },
              { label: '外借', value: '8' },
              { label: '删除', value: '10' }
              ],
              disabled:false
      	},
        gid:{
            title: "运单供应商",
            whereStr: "like",
            fieldtype: 4,
            type: 20,
            pagetype: 3,
        },
        bookingstatus:{
           title:"预定状态",
           type: 5,
           whereStr: "in",
           fieldtype: 3,
           options: [
              { label: "未预定", value: "1" },
              { label: "已预定", value: "2" }
            ],
            disabled:true
          },
      	// djdate: { title: "运单登记日期", type: 15,defaultVal:true},
      },
      inputModelData: {
        status:'1',
        bookingstatus:'1'
      },
      mawbAddDialogVisible:false,//新增弹框
      mawbAddDialogType:'1',//新增
      mawbid:'-1',//总运单ID
      operateDialog:false,//转移、预定弹框
      operateType:'',//操作type 1转移 2预定
      operateList:[],//勾选List
      operateTitle:'',//转移、预定标题
      mawbHistoryShow:false,//总运单历史弹框
      mawbHistoryHead:[
      {field:'title',title:'操作类型'},
      {field:'jobno',title:'订单编号'},
      {field:'gid',title:'委托客户',formatType:3},
      {field:'addman',title:'操作人'},
      {field:'adddate',title:'操作时间'},
      ],
      mawbHistoryData:[],//配置历史
      buttonGroup:{first:true,second:false,third:false,forth:false},
      buttonGroup2:{fifth:true,sixth:false},
      dataGroup:{//记录查询激活的数据
        first:{searchValue:{},tableData:[]},
        second:{searchValue:{},tableData:[]},
        third:{searchValue:{},tableData:[]},
        forth:{searchValue:{},tableData:[]},
        fifth:{searchValue:{},tableData:[]},
        sixth:{searchValue:{},tableData:[]},
      },
      tableDataRes:[],//非预警数据
      tableDataRes2:[],//预警数据
      mng:'唯凯本站',//唯凯本站OR唯凯外站
    };
  },
  created(){
   this.searchAlert()
  },

  mounted(){
   
  },

  methods: {
  //按钮激活
  setButton(type){
  var buttonGroupObj=this.monitor=='1'?this.buttonGroup:this.buttonGroup2
  Object.keys(buttonGroupObj).forEach(i=>{
    buttonGroupObj[i]=i==type?true:false
  })

  if(!this.dataGroup[type]['tableData']){
  this.tableDataRes=[]
  }else{
  this.tableDataRes=this.dataGroup[type]['tableData']
  }

  if(this.dataGroup[type]['searchValue']){
  this.inputModelData=this.dataGroup[type]['searchValue']
  }
  
  


  //this.inputModelData={}
  this.inputViewData.bookingstatus.disabled=false
  this.inputViewData.status.disabled=false
  delete this.searchData.status
  delete this.searchData.bookingstatus

  this.name=type=='forth'?'alertManage.vue':'mawbManageNew.vue'
  
  //控制查询条件
  if(type=='first'||type=='forth'){
    this.$set(this.inputModelData,'status','1')
    if(type=='first'){
      this.$set(this.inputModelData,'bookingstatus','1')
      this.searchData.status={"in":"1"}
      this.inputViewData.bookingstatus.disabled=true
    }
  }else if(type=='second'){
    this.$set(this.inputModelData,'bookingstatus','2')
    this.searchData.bookingstatus={"in":"2"}
    this.inputViewData.bookingstatus.disabled=true
  }else if(type=='third'){
    this.$set(this.inputModelData,'status','8')
    this.searchData.status={"in":"8"}
    this.inputViewData.status.disabled=true
  }
  
  //this.search()
  
  } ,

 //预警状态
 getAlert(value){
  if(value=='1'){
    return '已预警'
  }else{
   return '未预警'
  }
 },
  //运单状态
 getStatus(value){
 //console.log(value)
  if(value=='1'){
    return '可用'
  }else if(value=='2'){
   return '已领用'
  }else if(value=='5'){
   return '作废'
  }else if(value=='8'){
   return '外借'
  }else if(value=='10'){
    return '删除'
  }
 },
  //预定状态
 getBookingStatus(value){
 //console.log(value)
  if(value=='1'){
    return '未预定'
  }else if(value=='2'){
   return '已预定'
  }
 },
 //预警颜色
 alertStyle(value){
 if(value=='1'){
 	return {color:'red'}
 }
 },
  //预警颜色
statusStyle(value){
 if(value=='2'){
 	return {color:'red'}
 }else{
 	return {color:'#93de6e'}
 }
 },
   //预定颜色
statusBookingStyle(value){
 if(value=='2'){
  return {color:'#93de6e'}
 }else{
  return {color:'red'}
 }
 },


    search() {
      this.selectTableIndex=-1;
      this.tableDataRes = [];

      var api=this.buttonGroup.forth?'api/MawbAlert':'api/MawbManagement'
      
      if(this.monitor=='1'){
        this.searchData.mawbsswk='唯凯本站'
      }else{
        this.searchData.mawbsswk=this.buttonGroup2.fifth?'唯凯外站':'非唯凯'
      }
      
      var jsonArr2 = {
        where: this.searchData,
        order: !this.buttonGroup.forth?"id desc":"threecode desc"
        //order: "adddate desc"    
      };

      var json = { json: JSON.stringify(jsonArr2)};

      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + api,
        params: json,
        loading: true,
        tip: false,
        nosystem:true,
        select:false,
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }

          setTimeout(() => {
             if(!this.buttonGroup.forth){
               this.tableDataRes=getChangeValue(results.data, "空出");
               var objSearch=this.monitor=='1'?this.buttonGroup:this.buttonGroup2
               Object.keys(objSearch).forEach(i=>{
                if(objSearch[i]){
                  this.dataGroup[i]['tableData']=this.tableDataRes
                  this.dataGroup[i]['searchValue']=this.inputModelData
                }
               })
             }else{
               this.tableDataRes2=getChangeValue(results.data, "空出");
               this.dataGroup['forth']['tableData']=this.tableDataRes2
               this.dataGroup['forth']['searchValue']=this.inputModelData
             }
          }, 0);
        })
        .catch(errors => {});
    },
    //预警先查
    searchAlert(){
      var api='api/MawbAlert'
   
      this.searchData.mawbsswk='唯凯本站'

      var jsonArr2 = {
        where: this.searchData,
        order: "threecode desc"
        //order: "adddate desc"    
      };

      var json = { json: JSON.stringify(jsonArr2)};

      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + api,
        params: json,
        //loading: true,
        tip: false,
        nosystem:true
      }).then(results=>{

        this.tableDataRes2=results.data
      })
    },

    reset() {
     
      this.inputModelData = {
        
      };
    },

    
    // 关闭新增运单弹框
    mawbAddBeforeClose (done) {
    	if(this.mawbAddDialogType==='1'){
    	this.$confirm('总运单号尚未保存，是否确认返回')
        .then(_ => {
          done()
        })
    	}else{
    	done()
    	}
    },
    //删除
    deleteMawb(data,index,ismultiply=false){
    let dataIdString=""
    if(!ismultiply){
       if(data.status=='8'){
    	 return this.$message.error('此状态无法删除')
    }	
    }else{
      if(this.tableDataRes.filter(i=>i.checked).some(i=>i.status=='8')){
         return this.$message.error('存在状态无法删除')
      }else{
        dataIdString=this.tableDataRes.filter(i=>i.checked).map(i=>i.id).join(',')
      }
    }  
    
    this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                })
    .then(()=>{
     this.$axios({method:'DELETE',url:this.$store.state.BasicWebApi+'api/MawbManagement',data:{id:(!ismultiply?data.id:dataIdString)},loading:true,tip:false})
             .then(results=>{
        	if(results.data.resultstatus==0){
            this.$message.success(results.data.resultmessage)
            if(!ismultiply){
             this.tableDataRes.splice(index,1)
            }else{
             this.tableDataRes=this.tableDataRes.filter(i=>!i.checked)
            }
                
        	}else{
        		this.$message.error(results.data.resultmessage)
        	}
        })
    })
    .catch(() => {
        this.$message.info('已取消操作')
    })
    },
    //获取历史
    getHistory(data){
     //
     this.$axios({method:'get',url:this.$store.state.BasicWebApi+'api/MawbManagement',params:{mawb:data.mawb},loading:true,tip:false})
     .then(({data})=>{
       if(!data.length){
        return this.$message.info('无历史数据')
       }else{
        this.mawbHistoryShow=true
        this.mawbHistoryData=data.map(i=>{return {title:'配置总运单',...i}})
       }
     })

    },
    //新增、修改运单
    openDetail(data,type){

    if(this.$store.state.areaState.includes(',')){
      return this.$message.info('请选择一个区域')
    } 
    if(type=='1'){
       this.mawbAddDialogType='1'
    } else{
       this.mawbid=data.id
       this.mawbAddDialogType='2'
    }
    this.mng=this.monitor=='1'?'唯凯本站':this.buttonGroup2.fifth?'唯凯外站':'非唯凯'
    console.log(this.mng)
    this.mawbAddDialogVisible=true
    
    },
    // mawbAdd(){
    // if(this.$store.state.areaState.includes(',')){
    //   return this.$message.info('请选择一个区域')
    // } 
    // this.mawbAddDialogVisible=true
    // this.mawbAddDialogType='1'
    // this.mng=this.buttonGroup2.fifth?'唯凯外站':'非唯凯'
    // },
    //转移、归还、预定
    mawbOperation(type,title){//1转移 2预定 3归还
     if(!this.tableDataRes.filter(i=>i.checked).length>0){
     	return this.$message.error('请选择总运单号')
     }else{
     	if(this.tableDataRes.filter(i=>i.checked).every(i=>i.area!=this.tableDataRes.filter(i=>i.checked)[0]['area'])){
     		return this.$message.error('不同区域无法操作')
     	}

     	if(type=='1'&&this.tableDataRes.filter(i=>i.checked).some(i=>i.mawbsswk=='唯凯外站')){
     		return this.$message.error('唯凯外站运单无法转移操作')
     	}

     	if(type=='2'&&this.tableDataRes.filter(i=>i.checked).some(i=>i.status!='1')){
           return this.$message.error('非可用订单无法操作')
     	}
     }	
     this.operateType=type
     this.operateTitle=title
     this.operateDialog=true
     this.operateList=this.tableDataRes.filter(i=>i.checked)
    },
   
    //取消预定、归还
    cancelYd(type){ //1预定 2归还
    if(!this.tableDataRes.filter(i=>i.checked).length>0){
     	return this.$message.error('请选择总运单号')
     }else{
     	if(this.tableDataRes.filter(i=>i.checked).some(i=>i.bookingstatus!='2')&&type=='1'){
           return this.$message.error('非已预定订单无法操作')
     	}
     }		
     let api=type=='1'?'api/UpdateInfoByMawbUnBooking':'api/ExMawbManagerBorrowBack'
     let data={}
     if(type=='1'){
        data={mawbList:this.tableDataRes.filter(i=>i.checked).map(i=>{return {id:i.id,mawb:i.mawb}})}
     }else{
     	data={mawbList:this.tableDataRes.filter(i=>i.checked).map(i=>{return {id:i.id,mawb:i.mawb}}),ghr:localStorage.usrname,ghdate:getMomentDate(),remark:''}
     }
     //console.log(data)
     //return
    this.$axios({method:'PUT',url:this.$store.state.BasicWebApi+api,data:data,loading:true,tip:false})
        .then(({data})=>{
            if(data.resultstatus==0){
        		this.$message.success(data.resultmessage)
        		this.search()
        	}else{
        		this.$message.error(data.resultmessage)
        	}
    	})

    },
    //设置预警
    setWarning(data,index){
    	this.$prompt('请输入预警份数','提示',{
    		    confirmButtonText: '确定',
            inputValue:data.alertpiece,
            cancelButtonText: '取消',
            //inputPattern:/^[1-9]\d*$/,
            closeOnClickModal:false,
            customClass:'warnClass',
            beforeClose:(action,instance,done)=>{
              if(!/^[1-9]\d*$/.test(instance.inputValue)&&action=='confirm'){
                return this.$message.info('请输入大于0的数字')
              }else{
                done()
              }
            }
    	})
    	.then(({value})=>{
          
	        this.$axios({method:'POST',url:this.$store.state.BasicWebApi+'api/MawbAlert',data:{aid:data.aid,area:data.area,alertpiece:value},loading:true,tip:false})
	    	.then(({data})=>{
	            if(data.resultstatus==0){
	            	this.search()
	        		this.$message.success(data.resultmessage)
	        		//this.tableDataRes[index]['alert']='1'
	        	}else{
	        		this.$message.error(data.resultmessage)
	        	}
	    	})
	    	.catch(error=>{

	    	})
	    	})
    	.catch(()=>{
    		this.$message({
            type: 'info',
            message: '取消操作'
          });      
    	})

    }

  },
  computed: {
   mawbDialogTitle(){
   	return this.mng+(this.mawbAddDialogType=='1'?'总运单操作(新增)':'总运单操作(修改)')
   },
   showFirst(){//显示预定、转移
    if(this.tableDataRes.filter(i=>i.checked).length>0){
       if(this.tableDataRes.filter(i=>i.checked).some(i=>i.status!='1')){
        return false
       }else{
        return true
       }
    }else{
      return true
    }
   },
   // showSecond(){//显示归还
   //  if(this.tableDataRes.filter(i=>i.checked).length>0){
   //     if(this.tableDataRes.filter(i=>i.checked).some(i=>i.status!='8')){
   //      return false
   //     }else{
   //      return true
   //     }
   //  }else{
   //    return true
   //  }
    
   // }
   
  },
  watch:{
    monitor(val){
      var buttonObj=val=='1'?this.buttonGroup:this.buttonGroup2
     
        Object.keys(buttonObj).forEach(i=>{
          if(buttonObj[i]){
            this.setButton(i)
          }
        })
     
    }
  }
};
</script>
	<style>
.warnClass{
	min-width:180px!important;
}
	</style>

<style scoped lang="less">
/deep/.mawbDialog{
	border-radius: 8px;
	.el-dialog__header{
       text-align:center;
       font-weight:bold;
	}
}
.buttonGroup{
  text-align:center;
  margin-bottom: 20px;
  .el-button{
    background:rgba(141, 237, 223, 0.3);
    border: 1px solid #DFF9F6;
    color: #4D6160;
    font-size: 14px !important;
    border-radius:20px;
    &:hover{
      background:#8DEDDF;
      color:#222;
    }
  }
  .active{
    background: #8DEDDF;
    border: 1px solid #8DEDDF !important;
    color: #222;
    font-weight: 600;
  }
}


</style>
