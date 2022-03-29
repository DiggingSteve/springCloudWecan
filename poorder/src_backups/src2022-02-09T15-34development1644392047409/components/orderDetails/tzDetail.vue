<template>
  <div>
      <div v-fixtop style="background:#fff;overflow:hidden">
        <div class="topLeft" v-if="rowData.oldid">
        	<span v-if="!multiply">单票调账</span>
        	<span v-else>多票调账</span>
        	<span>{{inputModelData.jobno}}</span>
        </div>
        <div class="topRight">
        	<el-button type="primary" @click="saveFinish('1')" v-if="monitor=='1'||rowData.billStatus<2">保存</el-button>
        	<el-button type="primary" @click="saveFinish('2')" v-if="monitor=='1'||rowData.billStatus<2">保存并完成</el-button>
        	<el-button type="primary" v-if="rowData.billStatus>=2&&monitor=='2'" @click="cancelFh">取消完成</el-button>
        	<el-button  @click="$emit('update:visible',false)">返回</el-button>
        </div>
      </div>
      <!-- 基本信息 -->
      <div>
        <div class="detail basic-information">
  	      <div class="detail-title">
  	        <p>基本信息</p>
  	      </div>
  	      <div class="detail-c" style="max-width:1300px">
  	        <newFormCmpt :view-data.sync="basicView" :model-data.sync="inputModelData" :area="inputModelData.area"></newFormCmpt>
  	      </div>
        </div>
      </div>
      
      <div class="detail basic-information">
          <div class="detail-title">
	        <p>查询订单号</p>
	      </div>

	      <div class="detail-c" style="max-width:1300px" v-show="multiply">
	        <newFormCmpt :view-data.sync="jobView" :model-data.sync="jobViewData" :search-data.sync="searchData" :area="inputModelData.area"></newFormCmpt>
	        <el-button type="primary" style="margin-left:40px;" @click="searchJob">查询</el-button>
	      </div>
	      	<!-- 工作号表格 -->
	      	<div :class="[!multiply?'nomultiply':'multiply']">
	      		<commonTable :head="jobTableHead" :table-data="jobTableData" isMultiSelect paginationShow allchecked>
	      	
	            </commonTable>
	      	</div>
	      
      </div>
      

      <!-- 调账 -->
      <div class="detail basic-information">
	      <div class="detail-title">
	        <p>调账</p>
	      </div>
	      <div class="detail-c" style="max-width:1300px">
	        <newFormCmpt :view-data.sync="tzView" :model-data.sync="tzViewData" :area="inputModelData.area">
	        	<template slot="items" slot-scope="props">
	        		<page-select :modelval.sync="tzViewData.items" :pagetype="5"></page-select>
	        	</template>
	        </newFormCmpt>
	        <el-button type="primary" style="margin-left:120px;" @click="ftFuncion">确认</el-button>
	      </div>

      </div>

      <!-- 分摊表格 -->
      <div class="detail basic-information">
	      <div class="detail-title">
	      <p>分摊结果 <span class="ftTotalCost">费用总计:￥{{totalPrice}}</span></p>
	      </div>
	      <div class="detail-c">
	        <commonTable :head="ftTableHead.filter(i=>!i.parentHide)" :table-data="ftTableData" :showZiIndex="showZiIndex">
	        	<template slot="operation" slot-scope="props">
	        		<i class="el-icon-plus" v-if="!showZiIndex.includes(props.data.index)" @click="showZiIndex.push(props.data.index)"></i>
	        		<i class="el-icon-minus" @click="showZiIndex.splice(showZiIndex.indexOf(props.data.index),1)" v-if="showZiIndex.includes(props.data.index)"></i>
	        		<i class="el-icon-delete" @click="delDzCost(props.data.row.id,props.data.index)"></i>
	        	</template>
	        	<template slot="ziTable" slot-scope="props">
	        		<commonTable :head="ftTableHead" :table-data="props.data.row.costwagelist">
	        			
	        		</commonTable>
	        	</template>
            </commonTable>
	      </div>
      </div>


      
  </div>
</template>
<script>
  import {
        formatDate
    } from "../../api/tools.js";

export default {

  name: 'tzDetail',
  props:{
  	multiply:{//多票、单票
		type: Boolean,
	    default: false
  	},
  	rowData:{
  		type: Object
  	},
    monitor:''
  },
  data () {
      var pickerOptions={//日期限制前一个月不能跨年
         disabledDate(time) {
            var myDate=new Date()
            //console.log(myDate.getFullYear())
            var oneMonths=new Date(myDate.getFullYear(),myDate.getMonth()-1,1).getTime()
 
            //console.log(lastMonth)
            //myDate.setFullYear(2010,0,14)
            //let curDate = lastMonth.getTime();
            //let one = 30 * 24 * 3600 * 1000;
            //let oneMonths = curDate - one;

            return time.getTime() > Date.now() || time.getTime() < oneMonths || time.getFullYear()!=new Date().getFullYear()
       }
    }
    return {
    	basicView:{//基本信息表单
          area:{
          	type: 37,
          	title:'所属地区',
          	itemStyle:{width:'280px'},
          	disabled:!this.multiply,
          	multiple:false,
          	required:true,
            alone:true,
          	//groupid: 13
          },
          system:{
          	type:4,
          	title:'所属系统',
          	idStyle:{width:'50%'},
          	itemStyle:{width:'280px'},
          	disabled:!this.multiply,
          	groupid: 57,
          	options: [],
          	required:true
          },
          gid: {
              title: this.multiply?"结算对象":"委托客户",
              type: 20,
              required: true,
              contentStyle: {
                display: "flex"
              },
               itemStyle: {
                width: "560px"
              },
              disabled:!this.multiply,
              pagetype: '13',
              //hidden:this.multiply
            },
            // gid: {
            //   title: "项目",
            //   type: 10,
            //   required: true,
            //   itemStyle: {
            //     width: "500px"
            //   },
            //   contentStyle: {
            //     display: "flex"
            //   },
            //   disabled:!this.multiply,
            //   //showCustomerRel: true,
            //   isnewadd: true
            // },
          // gid:{
          // 	title:'委托项目',
          // 	idStyle:{width:'100%'},
          // 	itemStyle:{width:'560px'},
          // 	type: 20,
          // 	pagetype:'2',
          // 	required:true,
          // 	//hidden:this.multiply,
          // 	disabled:!this.multiply
          // },
          // gid:{
          // 	title:'结算对象',
          // 	idStyle:{width:'100%'},
          // 	itemStyle:{width:'560px'},
          // 	type: 20,
          // 	pagetype:13,
          // 	hidden:!this.multiply
          // },
          hbrq:{
          	title:'航班(到港)日期',
          	itemStyle:{width:'280px'},
          	type: 6,
            pickerOptions:pickerOptions,
          	//disabled:!this.multiply,
          	required:true
          },
          submitman_1_sett:{
          	title:'调账人',
          	itemStyle:{width:'280px'},
          	type: 1,
          	disabled:true,
          },
          submitdate_1_sett:{
          	title:'调账日期',
          	itemStyle:{width:'280px'},
          	type: 6,
          	disabled:true,
          	defaultVal:true,
          },
          remark:{
          	title:'备注',
          	itemStyle:{width:'560px'},
          	idStyle:{width:'100%'},
          	type: 17,
          }
    	},
    	inputModelData:{submitman_1_sett:localStorage.usrname,servicetype:'1',wagedom:'调账',ftsid:'',id:0,jobno:'',system:'空出',area:''},//基本信息数据
    	jobTableHead:[//工作号表格头
    	{field:'jobno',title:'工作号'},
    	{field:'mawb',title:'总运单号'},
    	{field:'storeweight',title:'实际重量',style:{'color':'#65A835'}},
    	{field:'jfweight',title:'计费重量',style:{'color':'#65A835'}},
    	{field:'accountweightin_sett',title:'应收结算重量',style:{'color':'#65A835'}},
    	{field:'accountweightout_sett',title:'应付结算重量',style:{'color':'#65A835'}},
    	{field:'zdweight',title:'制单重量',style:{'color':'#65A835'}},
    	{field:'hbh',title:'航班号'},
    	{field:'hbrq',title:'航班(到港)日期'},
    	//{field:'wtkhname',title:'委托项目'},
    	{field:'gid',title:'委托客户',formatType:'3'},
    	],
    	jobTableData:[],//工作号数据
    	tzView:{//调账表单
    		wageinout:{
             title:'收付类型',
             type:4,
             options:[{label:'应收',value:'1'},{label:'应付',value:'2'}],
             itemStyle:{'width':'250px'},
             disabled:this.multiply,
             required:true
    		},

    		// fid: {
      //         title: "委托客户",
      //         type: 11,
      //         contentStyle: {
      //           display: "flex"
      //         },
      //          itemStyle: {
      //           width: "250px"
      //         },
      //         linkage: "gid",
      //         pagetype: 8,
      //         hidden:this.multiply
      //       },
      //       gid: {
      //         title: "项目",
      //         type: 10,
      //         itemStyle: {
      //           width: "250px"
      //         },
      //         contentStyle: {
      //           display: "flex"
      //         },
      //         hidden:this.multiply
      //       },

    		gid:{
             title:'结算对象',
             type:20,
             pagetype:'13',
             itemStyle:{'width':'500px'},
             hidden:this.multiply,
             wageinout:'',
             required:true
    		},

    		wagetype:{
             title:'分摊方式',
             type:4,
             options:!this.multiply?[{label:'票',value:'票'}]:[{label:'票',value:'票'},{label:'实际重量',value:'实际重量'},{label:'计费重量',value:'计费重量'},{label:'结算重量',value:'结算重量'},{label:'制单重量',value:'制单重量'}],
             itemStyle:{'width':'250px'},
             disabled:true,
             required:true,
             required:true
    		},
    		items:{
             title:'服务项目',
             // type:4,
             // options:[{label:'空运费',value:'空运费'}],
             itemStyle:{'width':'250px'},
             required:true
    		},
    		currency:{
             title:'币种',
             type:4,
             options:[],
             itemStyle:{'width':'250px'},
             required:true
    		},
    		changeRate:{
             title:'汇率',
             type:'1',
             itemStyle:{'width':'250px'},
             disabled:true,
             required:true
    		},
    		price:{
             title:'含税单价',
             type:'1',
             itemStyle:{'width':'250px'},
             verify:'fixedFTwo',
             required:true
    		},
    		num:{
             title:'数量',
             type:'1',
             itemStyle:{'width':'250px'},
             verify:'fixedFTwo',
             required:true
    		},
    		wageall:{
              title:'总价',
              type:'1',
              itemStyle:{'width':'250px'},
              disabled:true,
              required:true
    		},
    		remark:{
              title:'备注',
              type:'17',
              itemStyle:{'width':'750px'},
              idStyle:{width:'100%'}

    		}


    	},
    	tzViewData:{wageinout:'',wagetype:'票'},//调账表单数据
    	jobView:{
    	 fid: {
              title: "委托客户",
              type: 11,
              contentStyle: {
                display: "flex"
              },
               itemStyle: {
                width: "250px"
              },
              linkage: "gid",
              pagetype: 1,
            },
            gid: {
              title: "项目",
              type: 10,
              itemStyle: {
                width: "250px"
              },
              contentStyle: {
                display: "flex"
              },
            },	
        // gid:{
        // 	title:'委托项目',
        // 	type:11,
        //     pagetype:1,
        //     itemStyle:{'width':'500px'}
        // },
        mawb:{
        	title:'总运单号',
        	type:1,
        	itemStyle:{'width':'250px'},
        	"whereStr":"like"
        },
        jobno:{
        	title:'订单号',
        	type:1,
        	itemStyle:{'width':'250px'},
        	"whereStr":"like"
        },
        hbrq:{
          	title:'航班(到港)日期',
          	itemStyle:{width:'500px'},
          	idStyle:{width:'500px'},
          	titleStyle:{width:'110px'},
          	type: 15,
        },
        settdate:{
          	title:'结算日期',
          	itemStyle:{width:'500px'},
          	idStyle:{width:'500px'},
          	titleStyle:{width:'110px'},
          	type: 15,
        }
    	},
    	jobViewData:{},
    	searchData: {},
    	ftTableHead:[//分摊表格头
    	{field:'operation',title:'操作'},
    	{field:'wageinout',title:'收付类型',formatType:'2',format:value=>value=='1'?'应收':'应付'},
    	{field:'wagetype',title:'分摊方式'},
    	{field:'items',title:'服务项目'},
    	{field:'currency',title:'币种'},
    	{field:'changerate',title:'汇率'},
    	{field:'price',title:'单价'},
    	{field:'num',title:'数量'},
    	{field:'wageall',title:'外币金额'},
    	{field:'wageallrmb',title:'RMB金额'},
    	{field:'settname',title:'结算对象'},
    	{field:'jobno',title:'工作号',parentHide:true},
    	{field:'mawb',title:'总运单号',parentHide:true},
    	{field:'wtkhname',title:'委托项目',parentHide:true},
    	],
    	ftTableData:[],//分摊表格数据
      showZiIndex:[],//子表格显示

    }
  },
  components:{
  },
  methods:{
  	// 处理分摊数据
  	getRatePrice(num,type){//num分摊方式对应数量、type 1外币 2RMB  //计算外币、RMB金额
  		var num=Number(num)
  		var field={'计费重量':'jfweight','实际重量':'storeweight','结算重量':'accountweightin_sett','制单重量':'zdweight'}
        var totalWeight=this.jobTableData.filter(i=>i.checked).reduce((a,b)=>{
  	    if(this.tzViewData['wagetype']!='票'){
  	    	a+=Number(b[field[this.tzViewData['wagetype']]])
  	    }else{
  	    	a=this.jobTableData.filter(i=>i.checked).length
  	    }		
        return a
  		},0)
  		if(type=='1'){
        console.log(this.tzViewData.wageall)
  			return (num/totalWeight)*Number(this.tzViewData.wageall)

  		}else if(type=='2'){
  			return (num/totalWeight)*Number(this.tzViewData.wageall)*Number(this.tzViewData.changeRate)
  		}
  	},
  	getPrice(num){//计算单价
      console.log(num)
  		return this.getRatePrice(num,'1')/Number(num)
  	},
  	getNum(data){//获取数量
        let fieldAll=[{label:'计费重量',field:'jfweight'},{label:'实际重量',field:'storeweight'},{label:'结算重量',field:'accountweightin_sett'},{label:'制单重量',field:'zdweight'}]
        if(this.tzViewData.wagetype=='票'){
        	return 1
        }else{
        	let field=fieldAll.filter(i=>i.label==this.tzViewData.wagetype)[0]['field']
        	return data[field]
        } 
  	},
  	// =================end=====================

  	//分摊方法
  	ftFuncion(){
    var data=[]		
    if(!this.inputModelData.gid){
    	return this.$message.error('请填写结算对象')
    }else if(!this.inputModelData.hbrq){
    	return this.$message.error('请填写航班日期')
    }else if(!this.multiply&&!this.tzViewData.gid){
    	return this.$message.error('请填写调账结算对象')
    }else if(!this.jobTableData.filter(i=>i.checked).length){
    	return this.$message.error('请勾选工作号')
    }
    
    for(var i in this.tzView){
    	//console.log(i)
    	 if(this.tzView[i]['required']&&!this.tzViewData[i]){
    	 	return this.$message.error(`请填写${this.tzView[i]['title']}`)
    	 }
    	// 	return this.$message.error(`请填写${this.tzView[i]['title']}`)
    	// 	break
    	// }
    }
 
 
    	data.push({
    	wageinout:this.tzViewData.wageinout,
    	wagetype:this.tzViewData.wagetype,
    	items:this.tzViewData.items,
    	currency:this.tzViewData.currency,
    	changerate:this.tzViewData.changeRate,
    	price:this.tzViewData.price,
    	num:this.tzViewData.num,
    	wageallrmb:(Number(this.tzViewData.wageall)*Number(this.tzViewData.changeRate)).toFixed(2),
    	wageall:this.tzViewData.wageall,
    	jobno:this.multiply?'--':this.jobTableData.filter(i=>i.checked)[0]['jobno'],
    	mawb:this.multiply?'--':this.jobTableData.filter(i=>i.checked)[0]['mawb'],
    	remark:this.tzViewData.remark,
    	pricetype:this.tzViewData.wagetype=='票'?'总价':'单价',
    	originalprice:this.tzViewData.price,
    	originalnum:this.tzViewData.num,
    	wagedom:'调账',
    	cwstatus:1,
    	isfree:1,
    	isjobnowage:2,
    	yssys:1,
    	gid:this.multiply?this.inputModelData.gid:this.tzViewData.gid,
    	settname:this.getwtkh(this.multiply?this.inputModelData.gid:this.tzViewData.gid),
    	wtkhname:'--',
    	//wtxmgid:'--',
    	id:0,
    	costwagelist:[]
    })

    
    data.forEach(i=>{
      var plusData={wageallrmb:0,wageall:0}
      this.jobTableData.filter(i2=>i2.checked).forEach((i2,index2)=>{
         
      	 if(index2!=this.jobTableData.filter(i2=>i2.checked).length-1){
      	 	i.costwagelist.push({
              wageinout:this.tzViewData.wageinout,
		      wagetype:this.tzViewData.wagetype,
		      items:this.tzViewData.items,
		      currency:this.tzViewData.currency,
		      changerate:this.tzViewData.changeRate,
		      price:this.getPrice(this.getNum(i2)).toFixed(2),
		      num:this.getNum(i2),
		      wageallrmb:this.getRatePrice(this.getNum(i2),'2').toFixed(2),
		      wageall:this.getRatePrice(this.getNum(i2),'1').toFixed(2),
		      jobno:i2.jobno,
		      mawb:i2.mawb,
		      wagedom:'调账',
		      //accountcomgid:this.multiply?this.inputModelData.accountcomgid:this.tzViewData.accountcomgid,
		      //gid:i2.gid,
		      gid:this.multiply?this.inputModelData.gid:this.tzViewData.gid,
		      wtkhname:i2.wtkhname,
		      settname:this.getwtkh(this.multiply?this.inputModelData.gid:this.tzViewData.gid),
		      isfree:1,
		      pricetype:'总价',
		      id:0,
		      sid:i2.jobid,
      	 	})
      	 	plusData.wageallrmb+=Number(this.getRatePrice(this.getNum(i2),'2').toFixed(2))
      	 	plusData.wageall+=Number(this.getRatePrice(this.getNum(i2),'1').toFixed(2))
      	 }else{
      	 	
          i.costwagelist.push({
          wageinout:this.tzViewData.wageinout,
		      wagetype:this.tzViewData.wagetype,
		      items:this.tzViewData.items,
		      currency:this.tzViewData.currency,
		      changerate:this.tzViewData.changeRate,
		      price:((Number(i.wageall)-plusData.wageall)/this.getNum(i2)).toFixed(2),
		      //price:this.tzViewData.wagetype!='票'?((Number(i.wageallrmb)-plusData.wageallrmb)/this.getNum(i2)).toFixed(2):i.wageall,
		      num:this.getNum(i2),
		      wageallrmb:(Number(i.wageallrmb)-plusData.wageallrmb).toFixed(2),
		      wageall:(Number(i.wageall)-plusData.wageall).toFixed(2),
		      //wageallrmb:this.tzViewData.wagetype!='票'?(Number(i.wageallrmb)-plusData.wageallrmb).toFixed(2):i.wageallrmb,
		      //wageall:this.tzViewData.wagetype!='票'?(Number(i.wageall)-plusData.wageall).toFixed(2):i.wageall,
		      jobno:i2.jobno,
		      mawb:i2.mawb,
		      wagedom:'调账',
		      // accountcomgid:this.multiply?this.inputModelData.accountcomgid:this.tzViewData.accountcomgid,
		      // gid:i2.gid,
		      gid:this.multiply?this.inputModelData.gid:this.tzViewData.gid,
		      wtkhname:i2.wtkhname,
		      settname:this.getwtkh(this.multiply?this.inputModelData.gid:this.tzViewData.gid),
		      isfree:1,
		      pricetype:'总价',
		      id:0,
		      sid:i2.jobid,
              })

      }
    })
  })

    this.ftTableData=this.ftTableData.concat(data)

    this.tzViewData={wageinout:this.tzViewData.wageinout,wagetype:'票'}

 
  	},
    // 查询可调账单号
    searchJob(){ 
      this.jobTableData=[]

      var jsonArr2 = {
        where: this.searchData,
        //order: "adddate desc"    
      };
      var json = { json: JSON.stringify(jsonArr2)};

      this.$axios({
      	method: "get",
        url: this.$store.state.webApi + "api/changebill/getClosedList",
        params: this.multiply?json:{oldid:this.rowData.oldid},
        loading: true,
        tip: false
      })
      .then(results=>{
      	this.jobTableData=results.data
      })
    },
    searchDetail(){//调账明细
     this.$axios({
      	method: "get",
        url: this.$store.state.webApi + "api/changebill/GetDetail",
        params: {jobid:this.rowData.jobid},
        loading: true,
        tip: false
      })
      .then(results=>{
      	this.inputModelData=results.data.axpline
        if(this.inputModelData.submitdate_1_sett.indexOf('1900')>=0){
          this.inputModelData.hbrq=''
        }
      	if(!this.inputModelData.submitman_1_sett){
      		this.inputModelData.submitman_1_sett=localStorage.usrname
      	}
      	if(!this.inputModelData.submitdate_1_sett||this.inputModelData.submitdate_1_sett.indexOf('1900')>=0){
           this.inputModelData.submitdate_1_sett=formatDate(new Date(), "yyyy-MM-dd")
      	}
      	

      	this.ftTableData=results.data.axplinewagelist
      	if(this.inputModelData.oldid=='-1'){
  		this.basicView.area.disabled=true
  		this.basicView.system.disabled=true
  		this.basicView.gid.disabled=true
  		//this.basicView.fid.disabled=true
  		this.basicView.hbrq.disabled=true
  	    }
  	    this.inputModelData.fid=getxmdata('xmdata').filter(i=>i.id==this.inputModelData.gid)[0]['fid']
  	    //return results.data
      })
    },

    saveFinish(type){ //type 1保存 2保存完成
      let axpline={...this.inputModelData}
      let wagelist=[...this.ftTableData]	
      axpline.ftsid=this.ftTableData.reduce((a,b)=>{
      	b.costwagelist.forEach(i=>{
      		if(!a.includes(i.sid)){
      			a.push(i.sid)
      		}
      	})
        return a
      },[]).join(',')
      if(!axpline.area){
      	return this.$message.error('请选择地区')
      }
      if(!axpline.system){
      	return this.$message.error('请选择系统')
      }

      this.$axios({
      	method:'POST',
      	url: this.$store.state.webApi + "api/changebill/save",
      	data:{axpline:axpline,wagelist:wagelist,isfinish:type=='1'?false:true,ismulit:this.multiply,singlejobno:''},
      	loading: true,
        tip: false
      })
      .then(results=>{
         if(results.data.resultstatus==0){
         	//this.searchDetail().then(results=>console.log(results))
         	this.$alert(`${results.data.resultmessage},调账号:${results.data.resultno}`,'提示',{
         		confirmButtonText: '确定',
         		  callback: action => {
                  this.$emit('update:visible',false)
                  }
         	})
         	if(type=='2'){
         		this.rowData.billStatus='2'
         	}
         	
         }else{
         	this.$message.error(results.data.resultmessage)
         }
      })
      .catch(error=>{

      })
      //let data={}
    },
    //删除调涨费用
    delDzCost(id=0,index){
      console.log(id)
      console.log(index)
      this.$confirm('是否确认删除此费用', '提示', {
      	confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{

        if(!id){
        	this.ftTableData.splice(index,1)
        	this.showZiIndex.splice(this.showZiIndex.indexOf(index),1)
        }else{
        	this.$axios({
	      	method:'POST',
	      	url: this.$store.state.webApi + "api/changebill/DeleteWage",
	      	data:{wageid:id,jobid:this.inputModelData.id},
	      	loading: true,
	        tip: false
	        })
	        .then(results=>{
             if(results.data.resultstatus==0){
             	this.ftTableData.splice(index,1)
        	    this.showZiIndex.splice(this.showZiIndex.indexOf(index),1)
             	this.$message.success(results.data.resultmessage)
             }else{
                this.$message.error(results.data.resultmessage)
             }
	        })
        }
      })
      .catch(()=>{
        this.$message.info('已取消操作')
      })
     //ftTableData.splice(props.data.index,1);showZiIndex.splice(showZiIndex.indexOf(props.data.index),1)
    },
    //取消完成
    cancelFh(){
      this.$confirm('是否确认取消完成', '提示', {
      	confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
      	//alert('1')
        
        	this.$axios({
	      	method:'POST',
	      	url: this.$store.state.webApi + "api/changebill/UnFinishChangeBill",
	      	data:{jobid:this.inputModelData.id},
	      	loading: true,
	        tip: false
	        })
	        .then(results=>{
             if(results.data.resultstatus==0){
                //this.ftTableData.splice(index,1)
        	    //this.showZiIndex.splice(this.showZiIndex.indexOf(index),1)
             	this.$message.success(results.data.resultmessage)
             	this.rowData.billStatus='1'
             	//this.searchDetail()
             }else{
                this.$message.error(results.data.resultmessage)
             }
	        })
     
      })
      .catch(()=>{
        this.$message.info('已取消操作')
      })
    },
    getwtkh(id){//通过id获取委托客户
    console.log(id)
    console.log(getxmdata('tzjs').filter(i=>i.id==id)[0])
    return getxmdata('tzjs').filter(i=>i.id==id)[0]['usr_name']
    },


  },
  mounted(){
  	var currencyData=JSON.parse(localStorage.currencyData)
  	this.tzView.currency.options=currencyData.reduce((a,b)=>{
    a.push({
    	label:b.cname,
    	value:b.cname
    })
    return a
  	},[])  
  },

  created(){
  	//模拟数据
   // this.jobTableData=[
   // {jobno:'BOAE1111111',mawb:'121-121212121',storeweight:1111,jfweight:2222,accountweightin_sett:3333,accountweightout_sett:4444,zdweight:5555,hbh:'PO123',hbrq:'2020-20-20',gid:4399},
   // {jobno:'BOAE2222222',mawb:'121-121212121',storeweight:1234,jfweight:2345,accountweightin_sett:3456,accountweightout_sett:4567,zdweight:5678,hbh:'PO123',hbrq:'2020-20-20',gid:4399},
   // {jobno:'BOAE3333333',mawb:'121-121212121',storeweight:1234,jfweight:2345,accountweightin_sett:3456,accountweightout_sett:4567,zdweight:5678,hbh:'PO123',hbrq:'2020-20-20',gid:4399}
   // ]

     	// 总价
    this.$watch(
    function() {
        return this.tzViewData.num + this.tzViewData.price
    },
    function(newVal, oldVal){
		if(newVal&&this.tzViewData.num&&this.tzViewData.price){
			this.tzViewData.wageall=(Number(this.tzViewData.num)*Number(this.tzViewData.price)).toFixed(2)
		}
    }

   )
   // 币种
   this.$watch(
   function(){
   	return this.tzViewData.currency
   },
   function(newVal, oldVal){
   	if(newVal){
   		this.tzViewData.changeRate=JSON.parse(localStorage.currencyData).filter(i=>
   			i.cname==newVal)[0]['basicprice'].toFixed(4)
   	}
   }
   ) 

   // 结算对象
   // this.$watch(
   // function(){
   // 	return this.inputModelData.gid
   // },
   // function(newVal, oldVal){
   // 	if(newVal&&getxmdata('xmdata').filter(i=>i.id==newVal).length>0){
   //      this.$nextTick(()=>{
   //       this.tzViewData.wageinout=JSON.parse(window.xmdata).filter(i=>
   // 			i.id==newVal)[0]['comxz']
   //      })
   // 	}
   // },
   //  { immediate: true }
   // ) 


   if(!this.multiply){
   	this.searchJob()
   	this.searchDetail()
   }else{
   	if(this.rowData.oldid=='-1'){
   	this.searchDetail()	
   	}
   }


   if(!this.inputModelData.area){
   	this.inputModelData.area=this.$store.state.areaState
   }




  },
  computed:{
  	totalPrice(){
  		return this.ftTableData.reduce((a,b)=>{
           a+=Number(b.wageallrmb)
           return a
  		},0).toFixed(2)
  	},

  },
  watch:{
  'inputModelData.gid':{
  	handler:function(val){
      if(this.multiply){
      if(val&&getxmdata('xmdata').filter(i=>
        i.id==val).length>0){
        
        this.tzViewData.wageinout=JSON.parse(window.xmdata).filter(i=>
        i.id==val)[0]['comxz']
    
      }else{
        this.tzViewData.wageinout=''
      }
      }
   			//console.log(this.tzViewData)	
  	},
  	immediate:true,
  	deep:true
  },
  'tzViewData.wageinout':{
    handler:function(val,old){
       this.tzView.gid.wageinout=val

    },
    immediate:true,
    deep:true
  }
  }
}
</script>
<style lang="less" scoped>
.topLeft{
	float:left;
	height:32px;
	background-color:#FEEAE9;
	border-radius:18px;
	font-size:14px;
	padding:0 12px;
	span{
		display:inline-block;
		color:red;
		height:32px;
		line-height:32px;
		&:first-child{
			text-align:center;
			padding-right:8px;
			border-right:1px solid #FCD8D8;
			margin-right: 8px;
		}
	}
}
.topRight{
	float:right;
	height:30px;
}

.detail {
	margin-bottom: 20px;
	margin-top:20px;
	border: 1px solid #e8e8e8;
	&:last-child {
	    margin-bottom: 0;
	}
	.detail-title {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    height: 32px;
	    text-indent: 8px;
	    font-size: 14px;
	    font-weight: bolder;
	    color: #0f5a8c;
	    background: #f8f8f8;
	    border-bottom: 1px solid #e8e8e8;
	    .ftTotalCost{
	    	color:red;
	    	margin-left: 20px;
	    	font-size:13px;
	    }
	}
	.detail-c {
	    padding: 20px;
	    .contentCmpt .input-item{
	    	margin-bottom: 10px;
	    	.input-title{margin-right:10px;}
	    }
	}
	.nomultiply{
		padding:20px;
	}
	.multiply{
		padding:0 20px 20px;
	}
}


</style>