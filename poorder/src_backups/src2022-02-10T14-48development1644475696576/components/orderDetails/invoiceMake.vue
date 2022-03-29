<template>
  <div class="invoice" style="width:1200px;margin:0 auto">

<div class="detail mawbCharge" v-enterfocus>
      <div class="detail-title">
        <p>发票制作</p>
      </div>
      <div class="detail-c">

        <p>
  	<el-row>
  	<el-col :span="6">
  	<span>发票号:</span>
  	<el-input style="width:140px;" v-model="invoiceObject.invoicecode" :disabled="invoicecodeDisable"></el-input>
  	</el-col>
     <el-col :span="6">
  	<span>开票人:</span>
    {{invoiceObject.invoiceman}}
  	</el-col>
  	 <el-col :span="6">
  	<span>开票日期:</span>
  	<el-date-picker
         v-model="invoiceObject.invoicedate"
         type="date"
         value-format="yyyy-MM-dd"
         placeholder="选择日期"
         style="width:140px"
        >
       </el-date-picker>
  	</el-col>
  	<el-col :span="6">
  	<span>发票种类:</span>

  		<el-select  placeholder="请选择" style="width:140px;" v-model="invoiceObject.invoicetype">
            <el-option
              v-for="selitem in fptype"
              :key="selitem"
              :label="selitem"
              :value="selitem">
            </el-option>

        </el-select>

  	</el-col>
  	</el-row>
  </p>
  <p>
  	<el-row>
  	<el-col :span="12">
  	<span>结算对象:</span>
<el-input disabled style="width:73%" v-model="invoiceObject.settname"></el-input>

  	</el-col>

  	<el-col :span="12">
  	<span>开票抬头:</span>
   		<el-input disabled style="width:73%" v-model="invoiceObject.titlename"></el-input>

  	</el-col>
  	</el-row>
  </p>

  <p>
  	<el-row>
  	<el-col :span="12">
  	<span>收付对象:</span>
    <page-select :modelval.sync="invoiceObject.paymentgid" :pagetype="1" @change="getData" style="width:73%;display:inline-block"></page-select>

  	</el-col>

<!--   	<el-col :span="6">
  	<span>结算方式:</span>
  	<el-select v-model="invoiceObject.settType" style="width:140px;">
  	<el-option label="全部" value="0"></el-option>
  	<el-option label="单票" value="1"></el-option>
  	<el-option label="月结" value="2"></el-option>
  	<el-option label="多票" value="3"></el-option>
  	</el-select>


  	</el-col>

  	<el-col :span="6" style="text-align:right;margin-left:-38px;">
  	<el-button @click="reWriteInfo">回写客户信息</el-button>


  	</el-col> -->
  	</el-row>
  </p>

<!--   <p>
  	<el-row>
  	<el-col :span="12">
  	<span>单位地址:</span>


                <el-select v-model="invoiceObject.address_thr.country" placeholder="请选择"   @change="getPro(invoiceObject.address_thr.country)" :country="countryData" ref="ccc" style="width:103px;">
       <el-option
                                          v-for="item in countryData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>




                 <el-select v-model="invoiceObject.address_thr.pro" placeholder="请选择"   @change="getCity(invoiceObject.address_thr.pro)" :pro="proData" ref="ppp" style="width:103px;">
       <el-option
                                          v-for="item in proData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>




                  <el-select v-model="invoiceObject.address_thr.city" placeholder="请选择"   @change="getAreade(invoiceObject.address_thr.city)" :city="cityData" ref="cici" style="width:103px;">
       <el-option
                                          v-for="item in cityData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>




                 <el-select v-model="invoiceObject.address_thr.areade" placeholder="请选择"  :area="areadeData" style="width:103px;">
       <el-option
                                          v-for="item in areadeData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>





            </el-col>
                   <el-col class="xxdz" :span="12">

                <el-input  v-model="invoiceObject.address_thr.addressjson" style="width:73%;margin-left:120px;"></el-input>

            </el-col>

          </el-row>

  </p> -->


  <p>

      <el-row>
    <el-col :span="12">
    <span>客户税号:</span>
    <el-input  style="width:73%" v-model="invoiceObject.taxCode"></el-input>
    </el-col>

    <el-col :span="12">
    <span>客户银行账号:</span>
    <el-input  style="width:73%" v-model="invoiceObject.bankaccount"></el-input>
    </el-col>
    </el-row>

  </p>



  <p>
  	<el-row>

  	<el-col :span="12">
  	<span>开户银行:</span>
    <el-select v-model="invoiceObject.bank" style="width:73%;">
  	<el-option v-for="(item, index) in khbank" :label="item" :value="item" :key="index">

  	</el-option>

  	</el-select>
  	</el-col>

  <el-col :span="12">
    <span>我司账号:</span>
    <el-input style="width:73%" v-model="invoiceObject.wszh"></el-input>
    </el-col>

  	</el-row>

  </p>


  <p>
  	<el-row>
  	<el-col :span="6">
  	<span>总运单号:</span>
  	<el-input style="width:140px;"  v-model="invoiceObject.mawb"></el-input>
  	</el-col>
  	<el-col :span="6">
  	<span>航班号:</span>
       <el-input style="width:140px;" v-model="invoiceObject.hbh"></el-input>
  	</el-col>

  		<el-col :span="6">
  	<span>航班(到港)日期:</span>
       <el-date-picker
         v-model="invoiceObject.hbrq"
         type="date"
         value-format="yyyy-MM-dd"
         placeholder="选择日期"
         style="width:140px"
        >
       </el-date-picker>
  	</el-col>

  	</el-row>

  </p>


    <p>
  	<el-row>
  	<el-col :span="6">
  	<span>始发港:</span>
  	<el-input style="width:140px;" v-model="invoiceObject.sfg"></el-input>
  	</el-col>
  	<el-col :span="6">
  	<span>目的港:</span>
       <el-input style="width:140px;" v-model="invoiceObject.mdg" v-verify="'sfgmdg'"></el-input>
  	</el-col>



  	</el-row>

  </p>

   <p>
  	<el-row>
  	<el-col :span="24">
  	<span>开票备注:</span>
  	<el-input type="textarea" style="width:86%;vertical-align:middle" v-model="invoiceObject.remark"></el-input>
  	</el-col>


  	</el-row>

  </p>
  <p>
    <el-row>
      <ElCol :span="24">
        <customerRel
          style="margin-left: 123px;"
          :fid="invoiceObject.settgid || (information && information.accountcomgid) || ''"
          customerRelType="财务"
          @changeRelData="customerRelList = $event">
        </customerRel>
      </ElCol>
    </el-row>
  </p>


      </div>
    </div>

<div class="detail mawbCharge">
      <div class="detail-title">
        <p>发票费用</p>
      </div>
      <div class="detail-c">

     <!--  	<el-button plain @click="addInvoiceData" style="margin-bottom:8px;display:none">新增服务项目</el-button>
      	 <commonTable class="settlement-table" :head="invoiceCost" :table-data="invoiceCostData">
        <template slot="invoiceItems" slot-scope="props" style="width:120px;">
        	<el-select v-model="invoiceItems" @change="changeInvoiceItems(invoiceItems,props.data.index)">
        	    <el-option label="代理国际运费" value="代理国际运费">代理国际运费</el-option>
        	    <el-option label="报关费" value="报关费">报关费</el-option>
        	</el-select>
        </template>

        <template slot="operation" slot-scope="props">
        	<i class="el-icon-delete" @click="delInvoice(props.data.index)"></i>
        </template>

        <template slot="num" slot-scope="props" style="width:120px;">
        	<el-input v-model="invoiceCostData[props.data.index].num"  style="width:120px;"></el-input>
        </template>

         <template slot="price" slot-scope="props" style="width:120px;">
        	<el-input v-model="invoiceCostData[props.data.index].price"  style="width:120px;"></el-input>
        </template>

         </commonTable> -->
   <!--       {{costData}} -->
          <commonTable  :head="costHead" :table-data="costData">


          </commonTable>
      </div>

      <div class="costTotalMoney">
      	<p style="color:orange" v-for="item in invoiceCostAll">本票开票合计{{item.currency}}金额：<span style="margin-right:10px;">{{item.total}}</span>元<span style="margin-left:10px;text-align:left">{{item.ctotal}}</span></p>
      <!-- 	<p style="color:orange">本票开票合计税额：<span style="margin-right:10px;"></span>元<span style="margin-left:10px;text-align:left"></span></p>
      	<p style="color:orange">本票开票价税合计：<span style="margin-right:10px;"></span>元<span style="margin-left:10px;text-align:left"></span></p> -->

      </div>
</div>

  <div class="footer">



      <div class="btn-c">
        <div class="left-btn">
          <el-button   @click="back">取消并返回</el-button>
        </div>
        <div class="right-btn">
          <el-button  @click="saveInvoice" type="primary">保存</el-button>
        </div>
      </div>

    </div>





  </div>
</template>

<script>
import {getMomentDate,convertCurrency} from '../../api/localStorage.js'
import customerRel from '../templates/customerRel'

export default {
  components: {
   customerRel
  },
  props: {
   information:{
   	type:Object
   },
   wageinout:"",
   pzid:"",
   invoicecodeDisable:{
    type:Boolean,
    default:false
   },
   system:{
    type:String
   },
   selectTableIndex:"",
   area:"",
  },
  data () {
    return {

    fptype:[],//发票类型
    jsfs:[],//结算方式
    khbank:[],//开户银行
    invoiceObject:{
      invoicecode:"",
      invoiceman:localStorage.getItem('usrname'),
      settname:'',
      invoicedate:getMomentDate().split(' ')[0],
      invoicetype:'增值税普通发票',
      titlename:'',
      paymentname:'',
      settType:'',
      //customAddress:'',
      address_thr:{country:'',pro:'',city:'',areade:'',addressjson:''},
      taxCode:'',
      bankaccount:'',
      bank:'',
      mawb:'',
      hbh:'',
      hbrq:'',
      mdg:'',
      sfg:'',
      wszh:'',
      remark:'',
      paymentgid:'',
    },
     cou:[],
     countryData:[],//国家
     proData:[],//省
     cityData:[],//区
     areadeData:[],//街道
    // invoiceCostData:[


    // ],
    // invoiceCost:[
    //     {field: "invoiceItems", title: "发票服务项目"},
    //     {field: "price", title: "单价"},
    //     {field: "num", title: "数量"},
    //     {field: "dwageall", title: "金额"},
    //     {field: "changerate", title: "汇率"},
    //     {field: "taxyn", title: "是否含税"},
    //     {field: "tax", title: "税率"},
    //     {field: "taxCurrency", title: "税率金额"},
    //      // {field: "operation", title: "操作"}
    // ],
     costHead:[
       {field: "items", title:"服务项目"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "dwageall", title: "金额"}
      ],
      costData:[],
      fpservice:[],//发票服务项目列表
      invoiceCostAll:[],//本票合计金额
      //invoiceItems:"代理国际运费",//发票服务项目值
      //invoiceCostAll:0,//本票合计金额
      //invoiceCostAllC:'',//本票合计金额中文
      //taxCost:0,//本票税额
      //taxCostC:"",//本票税额中文
      //invoiceCTA:0,//本票税额+合计
      //invoiceCTAC:'',//本票税额+合计中文
      informationBackUp:[],//备份数据
      customerRelList: []
    }
  },
  created () {
    let groupData = JSON.parse(localStorage.getItem('groupType'))
    var currency=[]
    groupData.forEach(item=>{
    	if(item.groupid=='49'){
    		this.fptype.push(item.typename)
    		////console.log(item)
    	}
    	if(item.groupid=='46'){
    		this.khbank.push(item.typename)
    	}
    })
    ////console.log(this.information)

    if(this.information){
this.informationBackUp=JSON.parse(JSON.stringify(this.information))

      ////console.log(this.information)
    this.invoiceObject.settname=this.informationBackUp.accountcomname
    this.invoiceObject.titlename=this.informationBackUp.accountcomname
    this.invoiceObject.paymentname=this.informationBackUp.accountcomname
    ////console.log(typeof(this.informationBackUp.accountcomgid))
    this.invoiceObject.paymentgid=Number(this.informationBackUp.accountcomgid)
    if(this.informationBackUp.jobnolistdata.length==1){
      this.invoiceObject.mawb=this.informationBackUp.jobnolistdata[0].job.mawb
      this.invoiceObject.hbh=this.informationBackUp.jobnolistdata[0].job.hbh
      this.invoiceObject.hbrq=this.informationBackUp.jobnolistdata[0].job.hbrq
      this.invoiceObject.sfg=this.informationBackUp.jobnolistdata[0].job.sfg
      this.invoiceObject.mdg=this.informationBackUp.jobnolistdata[0].job.mdg
    }

        this.informationBackUp.jobnolistdata.forEach(item=>{
        item.wagelist.forEach(item2=>{
          item2.dwageall=Number(Number(item2.dwageall)/Number(item2.changerate)).toFixed(2)
          item2.realwageall=Number(Number(item2.realwageall)/Number(item2.changerate)).toFixed(2)
        this.costData.push(item2)
        if(currency.indexOf(item2.currency)==-1){
          currency.push(item2.currency)
        }
        //this.invoiceCostAll+=Number(item2.dwageall)
      })
    })

        currency.forEach(item=>{
      var total=0
      this.costData.forEach(item2=>{
        if(item==item2.currency){
          total+=Number(item2.dwageall)
        }
      })
      this.invoiceCostAll.push({currency:item,total:total.toFixed(2),ctotal:convertCurrency(total)})
    })


      //this.invoiceCostAll=Number(this.invoiceCostAll).toFixed(2)
      //this.invoiceCostAllC=convertCurrency(this.invoiceCostAll)

      if(!this.$store.getters.wtkhData.length){
         this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubFCustom',params:this.search,loading:false,tip:false})
         .then(results=>{
            // sessionStorage.setItem('wtkhData',JSON.stringify(results.data))
            this.$store.state.commit('setWtkhData', results.data)
            results.data.forEach(item=>{
              if(item.usr_name==this.invoiceObject.paymentname){
                this.invoiceObject.taxCode=item.taxCode
                this.invoiceObject.bankaccount=item.bankno
                this.invoiceObject.bank=item.bank
              }
            })
         })
         .catch(error=>{

         })
      }else{
        var results=getxmdata('wtkh');
        results.forEach(item=>{
              if(item.usr_name==this.invoiceObject.paymentname){
                this.invoiceObject.taxCode=item.taxCode
                this.invoiceObject.bankaccount=item.bankno
                this.invoiceObject.bank=item.bank
              }
            })
      }


    }else if(this.pzid){
      var data={area:this.area,system:this.system,pzid:this.pzid,pzdom:'发票'}
      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpPzFinishDetail',params:data})
      .then(results=>{
        //console.log(results.data)
        results.data.paymentgid=Number(results.data.paymentgid)
        this.invoiceObject=Object.assign(this.invoiceObject,results.data)
       // //console.log(this.invoiceObject)
       results.data.jobnolist.forEach(item=>{
          item.wagelist.forEach(item2=>{
          item2.dwageall=item2.pzwageall
          this.costData.push(item2)
          //this.invoiceCostAll+=Number(item2.pzwageall)
           if(currency.indexOf(item2.currency)==-1){
          currency.push(item2.currency)
        }

       })
    })
        currency.forEach(item=>{
      var total=0
      this.costData.forEach(item2=>{
        if(item==item2.currency){
          total+=Number(item2.dwageall)
        }
      })
      this.invoiceCostAll.push({currency:item,total:total.toFixed(2),ctotal:convertCurrency(total)})
    })
        //this.invoiceCostAll=Number(this.invoiceCostAll).toFixed(2)
        //this.invoiceCostAllC=convertCurrency(this.invoiceCostAll)

      })
      .catch(error=>{

      })
    }

// 处理地址
  if(!localStorage.getItem('address')){
    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCityName',params:"",loading:false,tip:false})
  .then(results=>{
   // //console.log(results.data)
    localStorage.setItem('address',JSON.stringify(results.data))
   this.cou=results.data
  this.$nextTick(function(){
    this.getSelectD()
 // //console.log(this.countryData)
 })
  })
  .catch(error=>{

  })
}else{
  this.cou=JSON.parse(localStorage.getItem('address'))
   this.$nextTick(function(){
this.getSelectD()

 })
}




  },
  computed: {


  },
  watch:{


  },
  methods: {
    getData(data){
        this.invoiceObject.paymentname=data.wtdata
        this.invoiceObject.paymentgid=data.id
        this.invoiceObject.taxCode=data.taxCode?data.taxCode:''
        this.invoiceObject.bankaccount=data.bankno?data.bankno:''
        this.invoiceObject.bank=data.bank?data.bank:''
  },

// 返回
back(){
  this.$emit('UnVisibleInvoice',{noclose:1})
},
// 删除发票服务项目
delInvoice(i){
	this.invoiceCostData.splice(i,1)
	////console.log(i)
},
// 选择发票服务项目
changeInvoiceItems(val,i){
	this.invoiceCostData[i].invoiceItems=val
},
//添加服务项目
addInvoiceData(){
	this.invoiceCostData.push({invoiceItems:"",price:100,num:33,leastpzwageall:33,changerate:"",taxyn:'是',tax:0.03,taxCurrency:0.99})
},
//保存发票号
saveInvoice(){
  var method=""
  if(this.pzid){
    method="put"
      var data={czman:localStorage.getItem('usrname'),settgid:this.invoiceObject.accountcomgid,area:this.area,wageinout:this.wageinout,pzdom:'发票',isdel:'1',system:this.system}
        data.jobnolist=this.invoiceObject.jobnolist
  }else{
    method="post"
      var data={czman:localStorage.getItem('usrname'),settgid:this.information.accountcomgid,area:this.area,wageinout:this.wageinout,pzdom:'发票',isdel:'1',system:this.system}
        data.jobnolist=this.information.jobnolist
  }

    Object.keys(this.invoiceObject).forEach(key=>{
      if(key=="invoicecode"){
        data[key]=$.trim(this.invoiceObject[key])
      }
      data[key]=this.invoiceObject[key]
  })

  if (this.wageinout == '1') {
    if (this.customerRelList.length === 0) {
      return this.$message.error('请选择本票客户财务联系人')
    }
    data.customerRelList = this.customerRelList
  }

  //console.log(data)
  this.$axios({method:method,url:this.$store.state.webApi+'api/ExAiraxpPz',data:data,loading:true,tip:false})
  .then(results=>{
  if(results.data.resultstatus==0){
    this.$message.success(results.data.resultmessage)
    this.$emit('UnVisibleInvoice',{noclose:2})
    //this.back()
  }else{
   this.$message.error(results.data.resultmessage)
  }
  })
.catch(error=>{

})
},
// 回写信息
reWriteInfo(){

var data={name:this.invoiceObject.settname,customAddress:this.invoiceObject.address_thr.country+this.invoiceObject.address_thr.pro+this.invoiceObject.address_thr.city+this.invoiceObject.address_thr.areade+this.invoiceObject.address_thr.addressjson,taxCode:this.invoiceObject.taxCode,bank:this.invoiceObject.bank,settType:this.invoiceObject.settType}
this.$axios({method:'post',url:this.$store.state.webApi+'api/InvoiceTax/SaveCustomInfo',data:data,loading:false,tip:false})
.then(results=>{
if(results.data.resultstatus==0){
  this.$message.success('回写成功')
}else{
 this.$message.error('回写失败')
}
})
.catch(error=>{

})
////console.log(data)
},
  callback () {
    //console.log("callback")
   },
// 处理地址 开始
   getPro(value){
   //console.log(value)
    var country=this.$refs.ccc.$attrs.country
    var id=""
    for(var i in country){
       if(country[i].name===value){
        id=country[i].id
       }
    }
//console.log(this.cou)
 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.proData.push(this.cou[j])
    }

   }
//console.log(this.proData)
 },
      getCity(value){
     var pro=this.$refs.ppp.$attrs.pro
    var id=""
    for(var i in pro){
       if(pro[i].name==value){
        id=pro[i].id
       }
    }

 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.cityData.push(this.cou[j])
    }

   }
   },
         getAreade(value){
      var city=this.$refs.cici.$attrs.city
    var id=""
    for(var i in city){
       if(city[i].name==value){
        id=city[i].id
       }
    }

 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.areadeData.push(this.cou[j])
    }

   }
   },

  getSelectD(){
     for(var i in this.cou){
    if(this.cou[i].parentid==0){
      this.countryData.push(this.cou[i])
    }
  }
    if(this.invoiceObject.address_thr.country){
      this.getPro(this.invoiceObject.address_thr.country)
   }
   if(this.invoiceObject.address_thr.pro){
      this.getCity(this.invoiceObject.address_thr.pro)
   }
   if(this.invoiceObject.address_thr.city){
     this.getAreade(this.invoiceObject.address_thr.city)
   }
  }
  // 处理地址结束

  }
}
</script>

<style lang="less" scoped>
.invoice {

    span{display:inline-block;min-width:120px;text-align:right}
    p{margin-bottom:16px;}
    .detail{
      margin-bottom: 20px;
      border: 1px solid #e8e8e8;
      .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .detail-c {
      padding: 20px;
    }
    .costTotalMoney{
    	margin-left:20px;
    	color:orange;
    	p{
    		font-weight:bold;
    		span{
    			color:red;
    		}
    	}
    }
          .thd {
        span {
          vertical-align: text-bottom;
        }
        .info {
          display: inline-block;
          width: 90px;
          margin-right: 23px;
          span {
            text-align: left;
            + div {
              width: 100%;
            }
          }
          .el-input {
            width: 100%;
          }
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
</style>
