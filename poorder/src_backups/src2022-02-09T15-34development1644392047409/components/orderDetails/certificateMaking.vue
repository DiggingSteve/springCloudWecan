<template>
<div class="certificateMaking" style="width:1200px;margin:0 auto">
  <div class="pono">
    <p v-if="billid&&String(billid).split(',').length==1"><span>对账单号：</span><b>{{ billno }}</b></p>
  </div>
  <div class="certificateType">
    <p>
      <span>凭证类型：</span>
      <el-radio v-model="certificateType" label="1" v-if="wageinout == '1'">发票 I/V</el-radio>
      <el-radio v-model="certificateType" label="2">账单 D/N</el-radio>
    </p>
  </div>
  
  <div class="detail">
    <div class="detail-title">
      <p>结算对象</p>
    </div>
    <div class="detail-c">
      <commonTable class="settlement-table" :head="settlement_table_model" :table-data="sjcAllData">
        
        <template slot="checkboxo" slot-scope="props">
        <input type="checkbox" :value="props.data.index" v-model="jsValue" ref="test" :disabled="props.data.disabled" @change="getJobList(props.data.index)">
       

        </template>
          <template slot="num" slot-scope="props">{{sjcAllData[props.data.index].jobnolist.length}}</template>
      </commonTable>
    </div>
  </div>

  <div class="detail">
    <div class="detail-title">
        <p>
        订单号&nbsp;&nbsp;&nbsp;&nbsp;共{{jobListData?jobListData.length:''}}票

      
        <el-input placeholder="订单筛选" style="width:150px;float:right;margin-right:20px;"  v-model="order" @input="filterOrder(order)"></el-input>
        </p>
    </div>
    <div class="detail-c">
      <commonTable class="order-table" :head="order_table_model" :table-data="jobListData" :checkValue="{source:'orderValue',checkvalue:orderValue,length:jobListData.length}" @checkboxall="allCheck">
        
        <template slot="checkbox" slot-scope="props">
        <input type="checkbox" :value="props.data.index" v-model="orderValue" @change="getCostList(props.data.index,props.data.firstParentIndex)" >
       
        </template>

      </commonTable>
    </div>
  </div>

<!--   <div class="btn-c">

    <el-button @click="costIn">费用导入</el-button>
    <el-button @click="orderIn">订单号导入</el-button>
    <el-button @click="back">取消并返回</el-button>
  </div> -->

  <div class="detail">
    <div class="detail-title">
      <p>清单明细&nbsp;&nbsp;&nbsp;&nbsp;共{{costListData?costListData.length:''}}条</p>
    </div>
    <div class="detail-c">
<!-- {{costValue}} -->

      <commonTable class="detail-table" :head="detail_table_model" :table-data="costListData" :paginationShow=true :checkValue="{source:'costValue',checkvalue:costValue,length:costListData.length}" @checkboxall="allCheck">
        
        <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index"  v-model="costValue" @change="costHandle(props.data.indexAll,props.data.index)"></template>

        <!-- <template slot="wageall" slot-scope="props"><input type="checkbox" :value="props.data.index"  v-model="costValue" @change="costHandle(props.data.indexAll,props.data.index)"></template> -->
        <template slot="dwageall" slot-scope="props"><el-input type="text"  v-model="props.data.row.dwageall" @blur="getdwageall(props.data.row.dwageall,props.data.index,props.data.indexAll)"></el-input></template>

         
      </commonTable>
    </div>
  </div>

  <div class="footer">
    <div>
      <p>
        不含税开票总计：<span>{{ ExcludingTax }}</span>元
      </p>
    </div>
    <div>
      <p>
        含税开票总计：<span>{{ IncludingTax }}</span>元
      </p>
    </div>

    <div style="float:right;margin-right:0">
      
       <el-button @click="costIn" v-if="certificateType=='1'" type="primary">生成发票</el-button>
       <el-button @click="costIn" v-if="certificateType=='2'" type="primary">生成账单</el-button>
         <el-button @click="dzing"  type="primary">设为对账中</el-button>
      <!--  <el-button @click="reconOpen=true" v-if="singleDzData.billstatus==900" type="primary">设为已对账</el-button>
       <el-button @click="cancelDz" type="primary" :disabled="singleDzData.billstatus==1000?true:false">取消对账</el-button> -->
    </div>
  </div>



<!-- 费用制作 -->
  <el-dialog width="1260px"
  top="4%"
  center
  :visible.sync="showAccount"
  @close="closeShow"
  v-if="showAccount" append-to-body>
  <accountMake @UnVisibleAccount="accountClose" :information="information" :wageinout="wageinout" :system="system" :selectTableIndex="selectTableIndex" :area="area"></accountMake>

  </el-dialog>

  <!-- 发票制作 -->
   <el-dialog width="1260px"
  top="4%"
  center
  @close="closeShow"
  :visible.sync="showInvoice"
  v-if="showInvoice" append-to-body>

  <invoicemake :information="information" :wageinout="wageinout" @UnVisibleInvoice="invoiceClose" :system="system" :selectTableIndex="selectTableIndex" :area="area"></invoicemake>

  </el-dialog>



</div>  
</template>

<script>

import invoicemake from './invoiceMake'
import accountMake from './accountMake'



export default {

  components: {
   invoicemake,accountMake
  },

  props: {
    visible: Boolean,
    billid:"",
    wageinout:"",
    billno:"",
    system:{
      type:String
    },
    selectTableIndex:"",
    area:""
  },
  data () {
    return {
order:'',
      //dzdh:"",
      certificateType: this.wageinout == '1' ?  '1' : '2',
      ExcludingTax:0,
      IncludingTax:0,
      information:{},//费用导入，订单号导入传值
      showImport:false,//显示制作弹框
      //showAccount:false,//账单制作
      //showInvoice:false,//发票制作

      settlement_table_model: [
        {field: "checkboxo", title: "请选择"},
        {field: "accountcomname", title: "结算对象"},
        {field: "leastpzwageall", title: "剩余凭证金额"},
        {field: "dwageall", title: "当前凭证金额"},
        // {field: "leastpzwageall", title: "剩余凭证金额(折合人民币)"},
        // {field: "dwageall", title: "当前凭证金额(折合人民币)"},
        {field: "num", title: "订单数"},
         {field:'name',title:'联系人姓名'},
        {field:'mobile',title:'联系电话'},
        {field:'email',title:'联系邮箱'}
      ],
      order_table_model: [
        {field: "checkbox", title: ""},
        {field: "pono", title: "订舱编号"},
         {field: "orderno", title: "订单来源号"},
        {field: "mawb", title: "总运单号"},
          {field: "hawb", title: "分运单号"},
            {field: "sfg", title: "始发港"},
         {field: "mdg", title: "目的港"},
          {field: "realjzt", title: "实际件重体"},
        {field: "hbh", title: "航班号"},
        {field: "hbrq", title: "航班日期"},
        {field: "leastpzwageall", title: "剩余凭证金额"},
        {field: "dwageall", title: "当前凭证金额"}
        // {field: "leastpzwageall", title: "剩余凭证金额(折合人民币)"},
        // {field: "dwageall", title: "当前凭证金额(折合人民币)"}
      ],
      detail_table_model: [
        {field: "checkbox", title: ""},
        {field: "pono", title: "订舱编号"},
        {field: "mawb", title: "总运单号"},
        {field: "items", title: "服务项目"},
        {field: "dwageall", title: "当前凭证金额"},
        {field: "leastpzwageall", title: "剩余凭证金额"},
        {field: "pricewageall", title: "不含税金额"},
        {field: "tax", title: "税"},
        {field: "realwageall", title: "金额"},
        {field: "currency", title: "币种"},
        {field: "changerate", title: "汇率"},
        {field: "realwageallrmb", title: "人民币总额"},
        {field: "billno", title: "对账批次号"},
        {field: "mawb", title: "总运单号"},
        {field: "remark", title: "备注"}
      ],
       jsValue:[],//结算对象多选
       orderValue:[],//订单号多选
       costValue:[],//选择费用
       jobListData:[],//订单List
       costListData:[],//费用List
       sjcAllData:[],//查询初始数据
       dzRecorderListData:[],//已对账记录List查询
       backupAllData:[],//查询初始数据备份
    }
  },
  methods: {
        filterOrder(val){
      val=val.toLowerCase()
     

     this.jobListData.forEach((item,index)=>{
       var num=1
      Object.keys(item).forEach(item2=>{
    

        if(item2!="accountgid"&&item2!="jobid"&&item2!="settjobid"&&item[item2]!=""&&item2!="firstParentIndex"){
   var stringN=String(item[item2]).toLowerCase()
         if(stringN.indexOf(val)==-1){
          num=num*1
        }else{
          num=0
          
        }
        }
       
      })
      console.log(num)
      if(num>0){
        this.$set(item,'thisListHide',true)
      }else if(num==0){
        this.$set(item,'thisListHide',false)
      }

})
    },
    // back () {
    //   this.$emit('unVisible', false)
    // },
    // 可开凭证明细
    searchDetail(){
      console.log(this.area)
                   //查询数据
  this.$axios({"method":"get",url:this.$store.state.webApi+'api/ExAiraxpPzUnFinishDetail',params:{area:this.area,system:this.system,billidArr:this.billid,wageinout:this.wageinout}}).then(results=>{
     //console.log(results.data)
     this.sjcAllData=results.data

     this.sjcAllData.forEach((item,index)=>{
            //item.dwageall=""
            this.$set(item,'dwageall','')
            item.leastpzwageall=Number(item.leastpzwageall).toFixed(2)
          item.jobnolist.forEach((item2,index2)=>{
            item2.firstParentIndex=index+','+index2
            item2.leastpzwageall=Number(item2.leastpzwageall).toFixed(2)
            item2.hbrq=item2.hbrq.substring(0,11)
              item2.realjzt=item2.realpiece+'/'+Number(item2.realweight).toFixed(2)+'/'+Number(item2.realvolume).toFixed(2)
            //item2.dwageall=""
             this.$set(item2,'dwageall','')
            item2.wagelist.forEach((item3,index3)=>{
              //item3.dwageall=""
               this.$set(item3,'dwageall','')
              item3.indexAll=index+','+index2+','+index3
              item3.leastpzwageall=Number(item3.leastpzwageall).toFixed(2)
              item3.pricewageall=Number(item3.pricewageall).toFixed(2)
              item3.realwageall=Number(item3.realwageall).toFixed(2)
              //item3.otherwageall=Number(item3.otherwageall).toFixed(2)
              item3.num=Number(item3.num).toFixed(2)
              item3.changerate=Number(item3.changerate).toFixed(4)
              //item3.otherwageall=item3.otherwageall?Number(item3.otherwageall).toFixed(2):''
              item3.realwageallrmb=item3.realwageallrmb?Number(item3.realwageallrmb).toFixed(2):''

            })

          })

     })

      this.backupAllData=JSON.parse(JSON.stringify(this.sjcAllData))


  }).catch(error=>{
      //console.log(error)
  })

    },
 /////@@@@@@@待处理
    //获取工作号List(待处理方案：1、选择结算对象后订单号设置为全选、2、勾掉结算对象后将所有订单号中的对账和剩余对账改为初始值)
    getJobList(val){
    this.costListData=[]
    if(this.jsValue&&this.jsValue.length>0){
      var resultsData=[]
      var jsList=this.jsValue
      jsList.forEach((item,index)=>{
          //item.thisIndex=index
          var concatData=this.sjcAllData[item].jobnolist
          //concatData[index].thisIndex=index
          resultsData=resultsData.concat(concatData)
      })
      
    this.jobListData=resultsData

    // @@临时加上测试效果出现问题注释

    // this.jobListData.forEach((item,index)=>{
    //   if(this.orderValue.indexOf(index)==-1){
    //      this.orderValue.push(index)
    //   }
     

    // })
  
    }else{
      this.jobListData=[]
      this.costListData=[]
    }

    if(this.jsValue.indexOf(val)==-1){
      this.sjcAllData[val].dwageall=Number('').toFixed(2)
      this.sjcAllData[val].leastpzwageall=Number(this.backupAllData[val].leastpzwageall).toFixed(2)
      //console.log(this.sjcAllData[val].jobnolist)
      this.sjcAllData[val].jobnolist.forEach((item,index)=>{
    item.dwageall=Number('').toFixed(2)
      item.leastpzwageall=Number(this.backupAllData[val].jobnolist[index].leastpzwageall).toFixed(2)
      item.wagelist.forEach((item2,index2)=>{
        item2.dwageall=Number('').toFixed(2)
        item2.leastpzwageall=Number(this.backupAllData[val].jobnolist[index].wagelist[index2].leastpzwageall).toFixed(2)
      })
    })
    }


    // if(this.jsValue.indexOf(val)!=-1){

    // }else{
    //   this.sjcAllData[val].jobnolist=this.backupAllData[val].jobnolist
    //   this.sjcAllData[val].dwageall=Number('').toFixed(2)
    //   this.sjcAllData[val].leastpzwageall=this.backupAllData[val].leastpzwageall
    // }
    },

    //获取费用(本条索引，上一级索引)
    getCostList(val,index){

     ////console.log()
     let parentIndex=index.split(',')
     //console.log(parentIndex)
      var firstIndex=parentIndex[0]
      var secondIndex=parentIndex[1]
      //var thirdIndex=parentIndexAll[2]

    if(this.orderValue&&this.orderValue.length>0){
      var resultsData=[]
      var orderArry=this.orderValue

      orderArry.forEach(item=>{
      
        var concatData=this.jobListData[item].wagelist
        //concatData.
        resultsData=concatData.concat(resultsData)
        
      })


      resultsData.forEach((item,index2)=>{
      if(!this.costValue.includes(index2))
      this.costValue.push(index2)
    })


    if(orderArry.indexOf(val)!=-1){
         // //console.log(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall)
          this.sjcAllData[firstIndex].dwageall=Number(Number(this.sjcAllData[firstIndex].dwageall)+Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall)).toFixed(2)
          this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall)-Number(this.sjcAllData[firstIndex].dwageall)).toFixed(2)
          this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)
   
         
    }else{
      //console.log(this.sjcAllData[firstIndex])
      //console.log(this.sjcAllData[firstIndex].jobnolist[secondIndex])

           this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach((item,index)=>{
               if(!item.thisListHide){
                item.dwageall=""
               item.leastpzwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[index].leastpzwageall).toFixed(2)
               }
               
           })

        //this.sjcAllData[firstIndex].dwageall=''
        this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall= Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)
        this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall= Number('').toFixed(2)

        // let jsReconValue=0
        // this.orderValue.forEach(item=>{
        //     jsReconValue=jsReconValue+Number(item.)
        // })
         var jsReconValue=0
     
        this.sjcAllData[firstIndex].jobnolist.forEach(item=>{
      
         jsReconValue+=Number(item.dwageall)
            
        })
     
        
        this.sjcAllData[firstIndex].dwageall=Number(jsReconValue).toFixed(2)

        this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].dwageall).toFixed(2)).toFixed(2)
      
       
    }

    }else{
 
       this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach((item,index)=>{
               if(!item.thisListHide){
                item.dwageall=""
               item.leastpzwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[index].leastpzwageall).toFixed(2)
               }
               
           })

        this.sjcAllData[firstIndex].dwageall=""
        this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall= Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)
        this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall= Number('').toFixed(2)
        this.sjcAllData[firstIndex].leastpzwageall=Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)
        resultsData=[]
    }

    this.costListData=resultsData
   //console.log(this.costListData)
 

    },
    // 当前对账、剩余对账处理(参数为父级索引，本条索引)
    costHandle(i,val){
     


      let parentIndexAll=i.split(',')
      var firstIndex=parentIndexAll[0]
      var secondIndex=parentIndexAll[1]
      var thirdIndex=parentIndexAll[2]



     if(!this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].thisListHide){
              if(this.costValue.indexOf(val)!=-1){

        //若选中没有对账金额，提示填写对账金额
        if(!this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall){
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall=this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall=Number('').toFixed(2)

          // this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall

           let orderNowRecon=0
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach(item=>{
            if(!item.thisListHide){
              orderNowRecon=orderNowRecon+Number(item.dwageall)
            }
          
       })
          this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(orderNowRecon).toFixed(2)
          this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall=Number('').toFixed(2)

       var jsReconValue=0
     
        this.sjcAllData[firstIndex].jobnolist.forEach(item=>{
      
         jsReconValue+=Number(item.dwageall)
            
        })
        ////console.log(jsReconValue)
     
        //结算对象当前对账
        this.sjcAllData[firstIndex].dwageall=Number(jsReconValue).toFixed(2)
        //结算对象剩余对账
        this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].dwageall).toFixed(2)).toFixed(2)

        // this.orderValue.forEach(item=>{

        // })
          // this.$message.error('请填写对账金额')
          // this.costValue.forEach((item,index)=>{
          //   if(item==val){
          //     this.costValue.splice(index,1)
          //   }
          // })
          // return false
        }



      }else{
        //费用明细当前对账金额
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall=""

        //费用明细剩余对账
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall).toFixed(2)

        //订单列表当前对账
        let orderNowRecon=0
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach(item=>{

            if(!item.thisListHide){
              orderNowRecon=orderNowRecon+Number(item.dwageall)
            }
          
       })
          this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(orderNowRecon).toFixed(2)

         // alert(orderNowRecon)
          // 若为0则取消相应订单勾选状态
          // if(Number(orderNowRecon)==0){
          //    this.jobListData.forEach((item,index)=>{
          //   if(item==this.sjcAllData[firstIndex].jobnolist[secondIndex]){
          //     //console.log(index)
          //     ////console.log(index)
          //     ////console.log(item)
          //     this.orderValue.splice(index,1)
          //   }
          // })
          // }
         
          

        //订单列表剩余对账

        this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)-Number(orderNowRecon).toFixed(2)).toFixed(2)

        var jsReconValue=0
     
        this.sjcAllData[firstIndex].jobnolist.forEach(item=>{
      
         jsReconValue+=Number(item.dwageall)
            
        })
        //console.log(jsReconValue)
     
        
        this.sjcAllData[firstIndex].dwageall=Number(jsReconValue).toFixed(2)

        this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].dwageall).toFixed(2)).toFixed(2)
      }

      var tot1=0
      var tot2=0
 this.costValue.forEach((item,index)=>{
            
      tot1+=Number(this.costListData[item].pricewageall)
      tot2+=Number(this.costListData[item].realwageall)
})
 this.ExcludingTax=tot1.toFixed(2)
 this.IncludingTax=tot2.toFixed(2)
     }

 
    },
    //当前对账金额输入改变
    getdwageall(val,index,i){

      let parentIndexAll=i.split(',')
      var firstIndex=parentIndexAll[0]
      var secondIndex=parentIndexAll[1]
      var thirdIndex=parentIndexAll[2]

      if(val&&Number(val)!=0&&this.costValue.indexOf(index)==-1){
        //this.costListData[index].dwageall=Number(val).toFixed(2)
        this.costValue.push(index)
      }else if(Number(val)<=0&&val!=''){
        //alert(1)
           if(this.costValue.length>0){
      
              this.costListData[index].dwageall=this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall
              this.costListData[index].leastpzwageall=Number('').toFixed(2)
              if(this.costValue.indexOf(index)==-1){
                this.costValue.push(index)
              }
        //
          }else{
            this.costListData[index].dwageall=this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall 
             this.costListData[index].leastpzwageall=Number('').toFixed(2)
            this.costValue.push(index)
          }

           //订单列表当前对账
          let orderNowRecon=0
          this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach(item=>{
            if(!item.thisListHide){
                orderNowRecon=orderNowRecon+Number(item.dwageall)
            }
        
       })
          this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(orderNowRecon).toFixed(2)

        //订单列表剩余对账

        this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)-Number(orderNowRecon).toFixed(2)).toFixed(2)

        var jsReconValue=0
     
        this.sjcAllData[firstIndex].jobnolist.forEach(item=>{
      
         jsReconValue+=Number(item.dwageall)
            
        })
        
        this.sjcAllData[firstIndex].dwageall=Number(jsReconValue).toFixed(2)

        this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].dwageall).toFixed(2)).toFixed(2)


      }else if(Number(val)==0){
        this.costValue.splice(index,1)
        this.costHandle(i,index)
        //alert('2')
      }

      
      


 
//Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall)
if(Number(val)>Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall)){
        //this.$set(this.costListData[index],'dwageall',0)
        this.costListData[index].dwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall).toFixed(2)
        this.$message.error('对账金额超出范围')
        return false
      }else{
        if(Number(val)>0){
            this.costListData[index].dwageall=Number(val).toFixed(2)
            //费用明细剩余对账
 this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall=(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall).toFixed(2)-Number(val).toFixed(2)).toFixed(2)

   //订单号当前对账

   let orderNowRecon=0
   this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach(item=>{
    if(!item.thisListHide){
         orderNowRecon=orderNowRecon+Number(item.dwageall)
    }
 
   })
   this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(orderNowRecon).toFixed(2)

 //订单号剩余对账
   this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall=(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)-orderNowRecon).toFixed(2)

       var jsReconValue=0
     
        this.sjcAllData[firstIndex].jobnolist.forEach(item=>{
      
         jsReconValue+=Number(item.dwageall)
            
        })
        //console.log(jsReconValue)
     
        
        this.sjcAllData[firstIndex].dwageall=Number(jsReconValue).toFixed(2)

        this.sjcAllData[firstIndex].leastpzwageall=Number(Number(this.backupAllData[firstIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].dwageall).toFixed(2)).toFixed(2)

      }

}
 //税额累加
var tot1=0
var tot2=0
 this.costValue.forEach((item,index)=>{
            
      tot1+=Number(this.costListData[item].pricewageall)
      tot2+=Number(this.costListData[item].realwageall)
})
 this.ExcludingTax=tot1.toFixed(2)
 this.IncludingTax=tot2.toFixed(2)
    },
    // 费用导入
costIn(){
  // if(this.costValue.length==0){
  //   this.$message.error('请选择费用')
  //   return false
  // }else{
    this.showImport=true
    var costInData={accountcomename:this.sjcAllData[0].accountcomename,accountcomgid:this.sjcAllData[0].accountcomgid,jobnolistdata:[],jobnolist:[]}

            var orderList=this.orderValue
            //console.log(orderList)
            orderList.forEach((item,index)=>{
              costInData.jobnolistdata.push({job:this.jobListData[item],wagelist:[]})
              costInData.jobnolist.push({settjobid:this.jobListData[item].settjobid,wagelist:[],system:this.jobListData[item].system})
           
              //console.log(this.costValue)
              this.jobListData[item].wagelist.forEach(item2=>{

                this.costValue.forEach(item3=>{
                  if(this.costListData[item3]==item2){
                    //console.log(this.costListData[item3])
                    //console.log(item2)
                    
                    costInData.jobnolistdata[index].wagelist.push(item2)
                    costInData.jobnolist[index].wagelist.push(item2)
                   
                  }
                })
              })
            })
            this.information=costInData
            console.log(this.information)
       
  //}

},
// 订单号导入
orderIn(){
  if(this.orderValue.length==0){
    this.$message.error('请选择订单号')
    return false
  }else{
    this.showImport=true
    var costInData={accountcomname:this.sjcAllData[0].accountcomname,accountcomgid:this.sjcAllData[0].accountcomgid,jobnolistdata:[],jobnolist:[]}

    // var jobnolist=[]
            var orderList=this.orderValue
            //console.log(orderList)
            orderList.forEach((item,index)=>{
              costInData.jobnolistdata.push({job:this.jobListData[item]})
               costInData.jobnolist.push(this.jobListData[item])
              ////console.log(this.jobListData[item].wagelist)
              // //console.log(this.costValue)
              // this.jobListData[item].wagelist.forEach(item2=>{

              //   this.costValue.forEach(item3=>{
              //     if(this.costListData[item3]==item2){
              //       //console.log(this.costListData[item3])
              //       //console.log(item2)
              //       //jobnolist
              //       costInData.jobnolist[index].wagelist.push(item2)
              //       //jobnolist[index].wagelist.push(item2)
              //     }
              //   })
              // })
            })
            //console.log(costInData)
            this.information=costInData
  }
},
accountClose(data){
  //console.log(data.noclose)
   if(data.noclose==2){//账单保存后关闭此页面
    this.$emit('Unvisible',{noclose:2})
   //this.back()
  }
  this.showImport=false
  
},

invoiceClose(data){
  if(data.noclose==2){//发票保存后关闭此页面
    this.$emit('Unvisible',{noclose:2})
   //this.back()
  }
  this.showImport=false
  
  //this.searchDetail()
},

closeShow(){
 this.showImport=false
},

//返回
back(){
 this.$emit('Unvisible',{noclose:2})
},

dzing(){
var data={area:this.area,system:this.system,id:this.billid,billstatus:900,wageinout:this.wageinout}

this.$axios({"method":"put",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPch',data:data})
.then(results=>{
  if(results.data.resultstatus==0){
      this.$message.success('操作成功')
       this.$emit('Unvisible',{deleteIndex:1})
  }
})
.catch(error=>{
 
})
},

  allCheck(data){//全选
      if(data.source=='orderValue'){
        // if(data.checkvalue==[]){
        //   //console.log(data.checkvalue)
        //   //alert('1')
        //   this.orderValue=[]
        //   //this.costListData=[]
        // }
         this.orderValue=data.checkvalue
         if(this.orderValue.length>0){

           this.jsValue.forEach(item=>{
            var least=0
          this.sjcAllData[item].dwageall=Number('').toFixed(2)
          this.sjcAllData[item].jobnolist.forEach(item2=>{
             least+=Number(item2.dwageall)
          })
          this.sjcAllData[item].leastpzwageall=least.toFixed(2)
          
          })


           this.orderValue.forEach(item=>{
            // this.sjcAllData[this.jobListData[item].firstParentIndex.split(',')[0]].dwageall=Number('').toFixed(2)
            // this.sjcAllData[this.jobListData[item].firstParentIndex.split(',')[0]].leastpzwageall=Number(this.backupAllData[this.jobListData[item].firstParentIndex.split(',')[0]].leastpzwageall).toFixed(2)

            this.getCostList(item,this.jobListData[item].firstParentIndex)
           })
         }else{
          
          this.jsValue.forEach(item=>{
            var least=0
          this.sjcAllData[item].dwageall=Number('').toFixed(2)
          this.sjcAllData[item].jobnolist.forEach(item2=>{
             least+=Number(item2.dwageall)
          })
          this.sjcAllData[item].leastpzwageall=least.toFixed(2)
          
          })
          //this.jobListData
          ////console.log(this.sjcAllData)
          this.costListData=[]
         }
       
      }else if(data.source=='costValue'){
         this.costValue=data.checkvalue
         if(this.costValue.length>0){
           this.costValue.forEach(item=>{
            //console.log(item)
            this.costHandle(this.costListData[item].indexAll,item)
           })
         }else{
          this.costListData.forEach(item=>{
            this.costHandle(item.indexAll,item)
          })
          //this.orderValue=[]
         }
      }
    },






  },

  created(){
    this.searchDetail()
  },
  watch:{
     order(val){
          if(val.length){
            this.order_table_model[0].disabled=true
          } else{
            this.order_table_model[0].disabled=false
          }
      },
          jsValue(newvalue,oldvalue){
        //console.log(newvalue)
        //console.log(oldvalue)
        if(newvalue&&newvalue.length>0){
            newvalue.forEach(item=>{
          this.sjcAllData.forEach(item2=>{
            if(this.sjcAllData[item].accountcomgid!=item2.accountcomgid){
              item2.disabled=true
            }
          })
        })
          }else{
          this.sjcAllData.forEach(item2=>{
          
              item2.disabled=false
          
          })
           //this.jobListData=[]
           //this.costListData=[]
          }

          // @@@待定方法
          // if(oldvalue.length>newvalue.length){
          //   this.orderValue=newvalue
          // }else{
          //   this.orderValue=[]
          // }
          
          this.orderValue=[]
          this.costValue=[]

},
      'orderValue' () {
        
        this.$nextTick(() => {
          //console.log('watch', this.costListData)
          var tot1=0
          var tot2=0
         //this.costListData=[]
        
          this.costValue = this.costListData ? this.costListData.map((i, index) => index) : []
          if(this.costListData&&this.costListData.length>0){
             this.costListData.forEach((item,index)=>{
             this.costHandle(item.indexAll,index)
           
      tot1+=Number(item.pricewageall)
      tot2+=Number(item.realwageall)
             
            
      let parentIndexAll=item.indexAll.split(',')
      var firstIndex=parentIndexAll[0]
      var secondIndex=parentIndexAll[1]
      var thirdIndex=parentIndexAll[2]
   //   // this.costListData=[]

   //费用明细当前对账（备份剩余对账金额数据）
      this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall=Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall).toFixed(2)

      
      //费用明细剩余对账（备份剩余对账金额减去当前对账金额）
      this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall=(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].leastpzwageall).toFixed(2)-Number(this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist[thirdIndex].dwageall).toFixed(2)).toFixed(2)

     
     //订单号对账金额(累加费用明细当前对账)
      let orderNowRecon=0
         this.sjcAllData[firstIndex].jobnolist[secondIndex].wagelist.forEach(item=>{
           if(!item.thisListHide){
            orderNowRecon=orderNowRecon+Number(item.dwageall)
           }
           
      })
   this.sjcAllData[firstIndex].jobnolist[secondIndex].dwageall=Number(orderNowRecon).toFixed(2)

      
     //订单号剩余对账（备份订单号剩余对账数据-订单号对账金额）
      this.sjcAllData[firstIndex].jobnolist[secondIndex].leastpzwageall=(Number(this.backupAllData[firstIndex].jobnolist[secondIndex].leastpzwageall).toFixed(2)-orderNowRecon.toFixed(2)).toFixed(2)


          })
             this.ExcludingTax=tot1.toFixed(2)
             this.IncludingTax=tot2.toFixed(2)
          }
         
          //this.costHandle()
        })

    
    }

  
  },
  computed:{
    showAccount:{
      get:function(){
         if(this.showImport&&this.certificateType==2){
        return true
      }
    },
      set:function(){
        
      }
     
    },
    showInvoice:{
          get:function(){
         if(this.showImport&&this.certificateType==1){
        return true
      }
    },
      set:function(){
        
      }
    }
  }
}
</script>

<style lang="less" scoped>
.certificateMaking {
  .pono, .certificateType {
    margin-bottom: 16px;
    span:first-child {
      margin-right: 20px;
    }
    b {
      color: red;
    }
  }
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
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
      .settlement-table {
        width: 100%;
      }
    }
  }
  .btn-c {
    margin-bottom: 20px;
  }
  .footer {
    div {
      display: inline-block;
      margin-right: 70px;
      span {
        margin: 0 10px;
        color: red;
      }
    }
  }
}
</style>
