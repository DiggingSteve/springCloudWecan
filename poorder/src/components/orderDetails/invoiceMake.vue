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
  	<el-input style="width:140px;" v-model="invoiceObject.invoicecode" :disabled="invoicecodeDisable||invoiceType=='2'"></el-input>
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

  		<el-select  placeholder="请选择" style="width:140px;" v-model="invoiceObject.invoicedom">
            <el-option
              v-for="(selitem,index) in fptype"
              :key="index"
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
    <page-select :modelval.sync="invoiceObject.paymentgid" :pagetype="1" @change="getData" style="width:73%;display:inline-block" width="100%"></page-select>

  	</el-col>

  	<el-col :span="6">

      <span>结算方式:</span>
        <el-select v-model="invoiceObject.settType" style="width:140px;">
          <el-option v-for="(item, index) in jsfs" :label="item.typename" :value="item.ready01" :key="index">
          </el-option>
      </el-select>

  	</el-col>

  	<el-col :span="6" style="text-align:right;margin-left:-38px;" v-if="invoiceType&&invoiceType!='1'">
  	<el-button @click="reWriteInfo">回写客户信息</el-button>
  	</el-col>
  	</el-row>
  </p>

  <p v-if="invoiceType&&invoiceType!='1'">
  	<el-row>
  	<el-col :span="12">
  	<span>单位地址:</span>


    <!-- <el-select v-model="invoiceObject.address_thr.country" placeholder="请选择"   @change="getPro(invoiceObject.address_thr.country,'proData',null,'pro,city,areade,addressjson')" :country="countryData" ref="ccc" style="width:103px;">
       <el-option
          v-for="item in countryData"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
     </el-select>

      <el-select v-model="invoiceObject.address_thr.pro" placeholder="请选择"   @change="getPro(invoiceObject.address_thr.pro,'cityData',invoiceObject.address_thr.country,'city,areade,addressjson')" :pro="proData" ref="ppp" style="width:103px;">
        <el-option
            v-for="item in proData"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
      </el-select>

      <el-select v-model="invoiceObject.address_thr.city" placeholder="请选择"   @change="getPro(invoiceObject.address_thr.city,'areadeData',invoiceObject.address_thr.pro,'areade,addressjson')" :city="cityData" ref="cici" style="width:103px;">
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

      </el-col> -->
     

          <el-input  v-model="invoiceObject.customerAddressTel" style="width:73%;"></el-input>

      </el-col>

   </el-row>

  </p>


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
   
    <el-select v-model="invoiceObject.wszh" style="width:73%;">
      <el-option v-for="(item, index) in wszhList" :label="item" :value="item" :key="index">
      </el-option>
  	</el-select>

    </el-col>

  	</el-row>

  </p>

  <p v-if="invoiceType&&invoiceType!='1'">
    <el-row>
      <el-col :span="12">
        <span>邮箱:</span>
         <el-input style="width:73%;"  v-model="invoiceObject.email"></el-input>
      </el-col>
      <el-col :span="6" style="margin-left:26px;">
        <customerRel
          :fid="invoiceObject.paymentgid||invoiceObject.settgid || (information && (information.accountcomgid||information.settgid)) || ''"
          customerRelType="财务"
          @changeRelData="customerRelList = $event">
        </customerRel>
  	  </el-col>
    </el-row>
  </p>

  <p v-if="invoiceType&&invoiceType!='1'">
    <el-row>
      <el-col :span="12">
        <span>客户联系人:</span>
         <el-input style="width:73%;"  v-model="invoiceObject.cusLxrname"></el-input>
      </el-col>
      <el-col :span="12">
  	    <span>客户联系人手机:</span>
        <el-input style="width:73%;"  v-model="invoiceObject.cusLxrMobile"></el-input>
  	  </el-col>
    </el-row>
  </p>

  <p v-if="invoiceType&&invoiceType!='1'">
    <el-row>
      <el-col :span="12">
        <span>快递单号:</span>
         <el-input style="width:73%;"  v-model="invoiceObject.expressno"></el-input>
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
  <p v-if="invoiceType=='1'">
    <el-row>
      <ElCol :span="24">
        <customerRel
          style="margin-left: 123px;"
          :fid="invoiceObject.paymentgid||invoiceObject.settgid || (information && (information.accountcomgid||information.settgid)) || ''"
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
          <commonTable  :head="costHead" :table-data="costData" v-if="invoiceType=='1'">


          </commonTable>
          <div v-else>
            <el-button plain @click="pushInvoiceCostData(false)" style="margin-bottom:8px">新增服务项目</el-button>
            <commonTable  :head="invoiceHead" :table-data="invoiceCostData">
                <template slot="operate" slot-scope="props">
                    <i class="el-icon-delete" @click="delInvoice(props.data.index)"></i>
                </template>
                <template slot="productName" slot-scope="props">
                   <el-select v-model="props.data.row.productName" @change="changeTaxCode($event,props.data.index)">
                      <el-option v-for="i in invoiceTableSelectList" :key="i.TaxName" :label="i.TaxName" :value="i.TaxName"></el-option>
                   </el-select>
                </template>
                <template slot="unitPrice" slot-scope="props">
                    <el-input v-model="props.data.row.unitPrice"></el-input>
                </template>
                <template slot="productAmount" slot-scope="props">
                    <el-input v-model="props.data.row.productAmount"></el-input>
                </template>
                <template slot="productUnit" slot-scope="props">
                   <el-input v-model="props.data.row.productUnit"></el-input>
                </template>
                <template slot="productSize" slot-scope="props">
                    <el-input v-model="props.data.row.productSize"></el-input>
                </template>
                <template slot="taxMark" slot-scope="props">
                    <el-checkbox v-model="props.data.row.taxMark"></el-checkbox>
                </template>

            </commonTable>  
          </div>
          
      </div>

      <div class="costTotalMoney" v-if="invoiceType=='1'">
      	<p style="color:orange" v-for="(item,index) in invoiceCostAll" :key="index">本票开票合计{{item.currency}}金额：<span style="margin-right:10px;">{{item.total}}</span>元<span style="margin-left:10px;text-align:left">{{item.ctotal}}</span></p>
      <!-- 	<p style="color:orange">本票开票合计税额：<span style="margin-right:10px;"></span>元<span style="margin-left:10px;text-align:left"></span></p>
      	<p style="color:orange">本票开票价税合计：<span style="margin-right:10px;"></span>元<span style="margin-left:10px;text-align:left"></span></p> -->

      </div>
      <div v-else class="costTotalMoney">
        	<p style="color:orange">剩余开票金额：<span style="margin-right:10px;margin-left:28px;">{{leastAmount.toFixed(2)}}</span>元<span style="margin-left:10px;text-align:left">{{cleastAmount}}</span></p>

          <p style="color:orange">本票开票合计金额：<span style="margin-right:10px;">{{Number(invoiceObject.sumTotalAmount).toFixed(2)}}</span>元
          <span style="margin-left:10px;text-align:left">{{csumTotalAmount}}</span></p>

          <p style="color:orange">本票开票合计税额：<span style="margin-right:10px;">{{Number(invoiceObject.sumTaxAmount).toFixed(2)}}</span>元
          <span style="margin-left:10px;text-align:left">{{csumTaxAmount}}</span></p>

          <p style="color:orange">本票开票价税合计：<span style="margin-right:10px;">{{Number(invoiceObject.total).toFixed(2)}}</span>元
          <span style="margin-left:10px;text-align:left">{{ctotal}}</span></p>

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
   markTip:"",//现结费用开具标识
   invoiceType:{//开票种类 1.不开 2.开纸质发票 3.开电子发票
     type:[Number,String],
     default:'1'
   },
  },
  data () {
    return {

    fptype:[],//发票类型
    jsfs:[],//结算方式
    khbank:[],//开户银行
    wszhList:[],//我司账号
    invoiceObject:{
      invoicecode:"",
      invoiceman:localStorage.getItem('usrname'),
      settname:'',//结算对象
      invoicedate:getMomentDate().split(' ')[0],
      invoicedom:'增值税普通发票',
      titlename:'',
      paymentname:'',//收付对象中文名
      settType:'',//结算方式
      address_thr:{country:'',pro:'',city:'',areade:'',addressjson:''},
      taxCode:'',//客户税号
      bankaccount:'',//客户银行账号
      bank:'',//开户银行
      mawb:'',//总运单号
      hbh:'',//航班号
      hbrq:'',//航班日期
      mdg:'',//目的港
      sfg:'',//始发港
      wszh:'',//我司账号
      remark:'',//备注
      paymentgid:'',//收付对象ID
      email:'',//邮箱
      cusLxrMobile:'',//手机
      cusLxrname:'',//联系人
      customerAddressTel:'',//单位地址
      sumTotalAmount:'0',//合计金额
      sumTaxAmount:'0',//合计税额
      total:'0',//价税合计
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
      invoiceHead:[
       {field:'operate',title:'操作'},
       {field:'productName',title:'发票服务项目'},
       {field:'unitPrice',title:'单价'},
       {field:'productAmount',title:'数量'},
       {field:'productUnit',title:'单位'},
       {field:'productSize',title:'规格型号'},
       {field:'totalAmount',title:'金额',formatType: 4,format: row => (Number(row.unitPrice)*Number(row.productAmount)).toFixed(2)}, 
       {field:'rate',title:'汇率'},
       {field:'taxMark',title:'是否含税'},
       {field:'taxRate',title:'税率'},
       {field:'taxAmount',title:'税率金额'},
      ],//开票表格表头
      invoiceCostData:[],//开票表格数据
      invoiceTableSelectList:[],//开票表格服务项目下拉框
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
      customerRelList: [],
      totalMoney:0,//总开票金额
    }
  },
  created () {
    let groupData = JSON.parse(localStorage.getItem('groupType'))
    var currency=[]
    this.fptype=[]
    this.khbank=[]
    this.wszhList=[]
    this.jsfs=[]
    groupData.forEach(item=>{
    	if(item.groupid=='49'){
    		this.fptype.push(item.typename)
    		////console.log(item)
    	}
    	if(item.groupid=='46'){
    		this.khbank.push(item.typename)
      }
      if(item.groupid=='255'){
        this.wszhList.push(item.typename)
        this.invoiceObject.wszh=this.wszhList[0]
      }
      if(item.groupid=='256'){
        this.jsfs.push(item)
      }
    })
    ////console.log(this.information)

    if(this.information){
    this.informationBackUp=JSON.parse(JSON.stringify(this.information))
    ////console.log(this.information)
    this.invoiceObject.settname=this.informationBackUp.accountcomname
    this.invoiceObject.titlename=this.informationBackUp.accountcomname
    this.invoiceObject.accountcomgid=this.informationBackUp.settgid
    this.invoiceObject.paymentname=this.informationBackUp.accountcomname
    ////console.log(typeof(this.informationBackUp.accountcomgid))
    this.invoiceObject.paymentgid=Number(this.informationBackUp.accountcomgid)||this.informationBackUp.paymentgid

    var jobListData=this.informationBackUp.jobnolistdata||this.informationBackUp.jobnolist
    
    if(jobListData.length==1){
      let remark=""
      let rowData=jobListData[0].job||jobListData[0].jobListData
      if(rowData.system=='空出'||rowData['system']=='空出'){
        remark=`${rowData.mawb}/${rowData.hawb}`
      }else{
        remark=`${rowData.mawb}/${rowData.orderno}/${rowData.hawb}`
      }
      this.invoiceObject.mawb=jobListData[0].job?jobListData[0].job.mawb:jobListData[0].jobListData['mawb']
      this.invoiceObject.hbh=jobListData[0].job?jobListData[0].job.hbh:jobListData[0].jobListData['hbh']
      this.invoiceObject.hbrq=jobListData[0].job?jobListData[0].job.hbrq:jobListData[0].jobListData['hbrq']
      this.invoiceObject.sfg=jobListData[0].job?jobListData[0].job.sfg:jobListData[0].jobListData['sfg']
      this.invoiceObject.mdg=jobListData[0].job?jobListData[0].job.mdg:jobListData[0].jobListData['mdg']
      this.invoiceObject.remark=remark
    }

        jobListData.forEach(item=>{
        item.wagelist.forEach(item2=>{
          item2.dwageall=Number(Number(item2.dwageall)/Number(item2.changerate)).toFixed(2)
          item2.realwageall=Number(Number(item2.realwageall)/Number(item2.changerate)).toFixed(2)
          this.totalMoney+=Number(item2.dwageall)
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

    }else if(this.pzid){
      var data={area:this.area,system:this.system,pzid:this.pzid,pzdom:'发票'}
      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpPzFinishDetail',params:data})
      .then(results=>{
        //console.log(results.data)
        results.data.paymentgid=Number(results.data.paymentgid)
        results.data.settType=String(results.data.settType)
        
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
mounted(){
  this.getData({id:this.invoiceObject.accountcomgid||this.invoiceObject.paymentgid})
  if(this.invoiceType!='1'){
     if(this.invoiceType=='2'){//纸质发票获取发票号无法更改
      this.getInvoiceNum()
     }
     this.invoiceCostData=[]
     this.$axios({method:'get',url:this.$store.state.settlementWebApi+'api/InvoiceTax/GetTaxType',params:"",loading:false,tip:false})
     .then(results=>{
       this.invoiceTableSelectList=results.data
       this.pushInvoiceCostData(true)
     })
  }
  
  // getxmdata('wtkh').forEach(item=>{   
  //   if(item.usr_name==this.invoiceObject.paymentname){
  //     this.invoiceObject.taxCode=item.taxCode
  //     this.invoiceObject.bankaccount=item.bankno
  //     this.invoiceObject.bank=item.bank
  //   }
  // })
},
  computed: {
    csumTotalAmount(){
      return convertCurrency(this.invoiceObject.sumTotalAmount)
    },
    csumTaxAmount(){
      return convertCurrency(this.invoiceObject.sumTaxAmount)
    },
    ctotal(){
      return convertCurrency(this.invoiceObject.total)
    },
    leastAmount(){
      return Number(this.totalMoney)-Number(this.invoiceCostData.reduce((a,b)=>{
            return a+=Number(b.unitPrice)*Number(b.productAmount)
      },0))
    },
    cleastAmount(){
      return convertCurrency(String(this.leastAmount))
    }
  },
  watch:{
  
  customerRelList:{//获取联系人的同时获取用户名、邮箱和电话
    handler(val){
      this.invoiceObject.email=val[0]['email']
      this.invoiceObject.cusLxrMobile=val[0]['mobile']
      this.invoiceObject.cusLxrname=val[0]['name']
    },
    deep:true
  },
  'invoiceObject.invoicedom'(val){//切换发票类型
    if(this.invoiceType==2){
      this.getInvoiceNum()
    }
  },
  'invoiceCostData':{
    handler(val){
      this.invoiceObject.sumTotalAmount=Number(this.invoiceCostData.reduce((a,b)=>{
            return a+=Number(b.unitPrice)*Number(b.productAmount)
    },0))
    this.invoiceObject.total=Number(this.invoiceCostData.reduce((a,b)=>{
            return a+=Number(b.unitPrice)*Number(b.productAmount)
    },0))
    },
    deep:true,
  },

  },
  methods: {
    getData(data){//切换收付对象获取地址等信息
    console.log(data)
        if(data.id){
        // this.invoiceObject.paymentname=data.usr_name
        // this.invoiceObject.paymentgid=data.id
        // this.invoiceObject.taxCode=data.taxCode?data.taxCode:''
        // this.invoiceObject.bankaccount=data.bankno?data.bankno:''
        // this.invoiceObject.bank=data.bank?data.bank:''

        this.$axios({method:'get',url:this.$store.state.settlementWebApi+'api/InvoiceTax/GetCustomInfo',params:{id:data.id},loading:false,tip:false})
        .then(results=>{
          if(results.data){
            this.invoiceObject.customerAddressTel=results.data.invoiceSettAddress||''
            this.invoiceObject.paymentname=results.data.usr_name||''
            this.invoiceObject.taxCode=results.data.taxCode||''
            this.invoiceObject.bankaccount=results.data.bankno||''
            this.invoiceObject.bank=results.data.bank||''
            this.invoiceObject.settType=String(results.data.settType)||''
            this.invoiceObject.titlename=results.data.usr_name
            //this.invoiceObject.paymentname=data.usr_name
            //this.invoiceObject.customerAddressTel=results.data.invoiceSettAddress
          }
        })
        }

  },

// 返回
back(){
  this.$emit('UnVisibleInvoice',{noclose:1})
},
// 删除发票服务项目
delInvoice(i){
  if(this.invoiceCostData.length==1){
    return
  }
	this.invoiceCostData.splice(i,1)
},
//保存发票号
saveInvoice(){
  var method=""
  if(this.invoiceType!='1'&&Number(this.leastAmount)!=0){
    return this.$message.error('开票金额与实际金额不一致')
  }
  if(this.pzid){
    method="put"
      var data={czman:localStorage.getItem('usrname'),settgid:this.invoiceObject.accountcomgid,area:this.area,wageinout:this.wageinout,pzdom:'发票',isdel:'1',system:this.system,accountcomgid:this.invoiceObject.accountcomgid}
        data.jobnolist=this.invoiceObject.jobnolist
  }else{
    method="post"
      var data={czman:localStorage.getItem('usrname'),settgid:this.information.settgid,area:this.area,wageinout:this.wageinout,pzdom:'发票',isdel:'1',system:this.system,accountcomgid:this.information.settgid}
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
  var api=!this.markTip?"api/ExAiraxpPz":"api/ExAiraxpCheckBillPch"
  if(this.markTip){
    data.isinvoice=1
  }
  data.invoiceList=JSON.parse(JSON.stringify(this.invoiceCostData))
  data.invoiceList.forEach(i=>{
    i.taxMark=i.taxMark?'1':'0'
    i.totalAmount=(Number(i.unitPrice)*Number(i.productAmount)).toFixed(2)
    })
  data.invoicemode=this.invoiceType
  //console.log(JSON.stringify(data))
  //return
  this.$axios({method:method,url:this.$store.state.webApi+api,data:data,loading:true,tip:false})
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

var data={name:this.invoiceObject.paymentname,customAddress:this.invoiceObject.customerAddressTel,taxCode:this.invoiceObject.taxCode,bank:this.invoiceObject.bank,settType:this.invoiceObject.settType,id:this.invoiceObject.paymentgid,bankNo:this.invoiceObject.bankaccount}

this.$axios({method:'post',url:this.$store.state.settlementWebApi+'api/InvoiceTax/SaveCustomInfo',data:data,loading:false,tip:false})
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
   getPro(value,field,lastValue,clearField){
    console.log(clearField)
    var id=""  
    var firstList=this.cou.filter(i=>i.name==value)
               
    if(lastValue){//存在相同情况，继续匹配上一层value
     var lastId=this.cou.filter(i=>i.name==lastValue)[0]['id']
     id=firstList.filter(i=>i.parentid==lastId)[0]['id']
     console.log(lastId)
     console.log(id)
    }else{
     id=firstList[0]['id']
    }
    this[field]=this.cou.filter(i=>i.parentid==id)
    if(clearField){

    }
    clearField.split(',').forEach(i=>{  //重新选择清空选项
     this.invoiceObject['address_thr'][i]=''
    }) 
 },

//       getCity(value){
//      var pro=this.$refs.ppp.$attrs.pro
//     var id=""
//     for(var i in pro){
//        if(pro[i].name==value){
//         id=pro[i].id
//        }
//     }

//  for(var j in this.cou){
//     if(this.cou[j].parentid==id){
//       this.cityData.push(this.cou[j])
//     }

//    }
//    },
//          getAreade(value){
//       var city=this.$refs.cici.$attrs.city
//     var id=""
//     for(var i in city){
//        if(city[i].name==value){
//         id=city[i].id
//        }
//     }

//  for(var j in this.cou){
//     if(this.cou[j].parentid==id){
//       this.areadeData.push(this.cou[j])
//     }

//    }
//    },

  getSelectD(){
     for(var i in this.cou){
    if(this.cou[i].parentid==0){
      this.countryData.push(this.cou[i])
    }
  }
    if(this.invoiceObject.address_thr.country){
      this.getPro(this.invoiceObject.address_thr.country,'proData',null,'pro,city,areade,addressjson')
   }
   if(this.invoiceObject.address_thr.pro){
      this.getPro(this.invoiceObject.address_thr.pro,'cityData',this.invoiceObject.address_thr.country,'city,areade,addressjson')
   }
   if(this.invoiceObject.address_thr.city){
     this.getPro(this.invoiceObject.address_thr.city,'areadeData',this.invoiceObject.address_thr.pro,'areade,addressjson')
   }
  },
  // 处理地址结束
  getInvoiceNum(){//获取发票号
    this.$axios({method:'get',url:this.$store.state.settlementWebApi+'api/InvoiceTax/GetNextInvoiceNoApi',params:{AddMan:localStorage.usrname,Fplxdm:this.invoiceObject.invoicedom},loading:true,tip:false})
    .then(results=>{
      //var result = JSON.parse(results.data);
      //var flag = result.output.OperateFlag;
      // if (flag == '0') {
      //   this.invoiceObject.invoicecode=result.output.dqfphm
      // }
      // else {
      //   this.$message.error(result.output.returnmsg)
      // }
      if(results.data.resultstatus==0){
        this.invoiceObject.invoicecode=results.data.resultdic.dqfphm
      }else{
        this.$message.error(results.data.resultmessage)
      }

    })
  },
  pushInvoiceCostData(isfirst){//添加服务项目  //是否第一次push
      
    this.invoiceCostData.push({
      'unitPrice':isfirst?this.totalMoney:'',
      'productAmount':isfirst?1:'',
      'productUnit':'',
      'productSize':'',
      'totalAmount':'',
      'rate':'1.00',
      'taxMark':true,
      'taxAmount':'0.00',
      'productName':this.invoiceTableSelectList[0].TaxName,
      'taxRate':Number(this.invoiceTableSelectList[0].TaxRate).toFixed(2),
      'productCode':this.invoiceTableSelectList[0].TaxCode,
    })
  },
  changeTaxCode(data,index){
    this.invoiceCostData[index]['productCode']=this.invoiceTableSelectList.filter(i=>i.TaxName==data)[0]['TaxCode']
  }


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
