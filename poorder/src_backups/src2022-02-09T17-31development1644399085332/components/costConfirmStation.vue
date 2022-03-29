<template>
  <div>

<div  class="page-container-box">
<!-- {{inputModelData}}<br>-->
<!-- {{searchData}} -->

 <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"  :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere" @reset="reset">
                </newSearchComp>



<div class="searchForm">
  <el-button  @click="search">查询</el-button>
</div>


</div>
<!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage" :ziTableData="ziTableData"  showZiConfig :showTotal="showTotal" :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog"   @transSelIndex="openDialog2">


<!--  <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)"   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template> -->

 </tableCompt>


<!-- 费用制作 -->
 <el-dialog
        title="费用未确认(外站订单)"
        :visible.sync="costMaking"
        width="100%"
        top="0"
        v-if="costMaking"
        @close="uncostMaking"
        :close-on-press-escape=false
        class="dialogPage"
        :modal="false"
        center>

        <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmaking>
        <!-- <span slot="footer">

        </span> -->
      </el-dialog>

   <!-- 取消对账原因 -->
      <el-dialog
        width="900px"
        top="4%"
        center
        custom-class="reason"
        :visible.sync="showReason"
        v-if="showReason" append-to-body
        @close="showReason=false;reasonData={};">

        <div class="orderSystem-c">
          <h3>取消原因</h3>
          <p class="orderNo">
            <span style="color:#004d84;font-weight:bold">{{reasonData.pono}}</span>
          </p>
          <ul>
            <li style="width:120px">总运单号</li>
            <li style="width:100px">始发港</li>
            <li style="width:100px">目的港</li>
            <li style="width:120px">实际件重体</li>
            <li style="width:100px">航班号</li>
            <li style="width:100px">航班日期</li>
          </ul>
          <ul style="margin-top:3px;">
            <li style="width:120px">{{reasonData.mawb}}</li>
            <li style="width:100px">{{reasonData.sfg}}</li>
            <li style="width:100px">{{reasonData.mdg}}</li>
            <li style="width:120px">{{reasonData.realpiece+'/'+Number(reasonData.realweight).toFixed(2)+'/'+Number(reasonData.realvolume).toFixed(3)}}</li>
            <li style="width:100px">{{reasonData.hbh}}</li>
            <li style="width:100px">{{reasonData.hbrq.substring(0,10)}}</li>
          </ul>

          <div class="accountNameItems" style="padding-bottom:0;border-bottom:none">
            <div style="width:800px;overflow:hidden;display:inline-block" >
              <ul class="accountNameItemsList" style="width:10000px;overflow:hidden;">
                <li v-for="(item,key,index) in reasonData.delbillreason" :key="index" :style="{'color':accountNameItemsActive==key?'#004d84':'','padding-bottom':'10px','position':'relative','z-index':'99','border-bottom':accountNameItemsActive==key?'1px solid #004d84':''}" @click="accountNameItemsActive=key;">
                  <span>{{key}}</span>
                </li>
              </ul>
            </div>

            <div class="arrow">
              <i class="el-icon-caret-left" @click="changeDirectionAcn(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirectionAcn(2)"></i>
            </div>
            <p></p>
          </div>

          <div class="accountNameItemsContent" style="margin-top: 12px;">
            <div class="delbillman-wrap">
              <ul class="delbillmanList">
                <li
                  @click="delbillmanActive = index-1;costItemsActive=0"
                  :class="{'active': delbillmanActive == index-1}"
                  v-for="index in reasonData.delbillreason[accountNameItemsActive].length"
                  :key="index">
                  <p>
                    <span class="left">取消对账人</span>
                    <span class="right">{{reasonData.delbillreason[accountNameItemsActive][index-1].delbillman}}</span>
                  </p>
                  <p class="time">
                    <span class="left">{{reasonData.delbillreason[accountNameItemsActive][index-1].delbilldate.split(' ')[0].replace(/(-)/g, '.')}}</span>
                    <span class="right">{{reasonData.delbillreason[accountNameItemsActive][index-1].delbilldate.split(' ')[1]}}</span>
                  </p>
                  <i class="el-icon-caret-right"></i>
                </li>
              </ul>
            </div>

            <div class="arrow">
              <i class="el-icon-caret-left" @click="changeDirectionDelBillMan(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirectionDelBillMan(2)"></i>
            </div>
            <el-input type="textarea" v-model="reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" :disabled="true"></el-input>
          </div>

          <div class="accountNameItems" v-if="reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson">
            <div  style="width:800px;overflow:hidden;display:inline-block" >
              <ul class="costItemsList" style="width:10000px;overflow:hidden;">
                <li v-for="(item,index) in reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
                  <el-badge is-dot class="item" v-if="item.delbillreason">{{item.items}}</el-badge>
                  <span v-else>{{item.items}}</span>
                </li>
              </ul>
            </div>

            <div class="arrow">
              <i class="el-icon-caret-left" @click="changeDirection(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
            </div>
          </div>

          <div class="costItemsContent" style="margin-top:16px;" v-if="reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson">
            <ul>
              <li>人民币金额</li>
              <li>单价</li>
              <li>数量</li>
              <li>货币</li>
            </ul>
            <ul style="margin-top:3px;">
              <li>{{Number(reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].realwageall).toFixed(2)}}</li>
              <li>{{Number(reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].price).toFixed(2)}}</li>
              <li>{{Number(reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].num).toFixed(2 )}}</li>
              <li>{{reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].currency}}</li>
            </ul>
            <el-input type="textarea" v-model="reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:16px;color:#c8c8c8" :disabled="true"></el-input>
          </div>
          <!-- {{accountNameItemsActive}} \ {{reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillman}} \ {{reasonData.delbillreason[accountNameItemsActive][delbillmanActive].delbillreasonJson[costItemsActive].items}} -->
        </div>
      </el-dialog>



     <el-dialog
          :visible.sync="costControlDialog"
          title="批量成本分摊"
          width="90%"
          top="4%"
          center
          v-if="costControlDialog"
          :close-on-press-escape="false"
          append-to-body>
            <span slot="title">
              <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
              <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
          </span>
              <costControlTool></costControlTool>
        </el-dialog>

     <el-dialog
          :visible.sync="shareRecordDialog"
          width="90%"
          title="批量成本分摊记录"
          top="4%"
          center
          v-if="shareRecordDialog"
          :close-on-press-escape="false"
          append-to-body>
             <span slot="title">
  <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
              <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
          </span>
              <shareRecord></shareRecord>
        </el-dialog>


                    <!-- 综合查询 -->
    <el-dialog  title="综合查询" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
       <mawbaddput   :visible.sync="dialogShow"  :pagetype='20' :mawbguid="mawbguid" :boguid="boguid" :area="area" :orderdom="orderdom"></mawbaddput>
   </el-dialog>



  <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'

import { searCondition,filterGroupid,getChangeValue } from '../api/localStorage.js'
  export default {
    name: 'costConfirmStation',
    mixins:[systemCheck, openZimessage, searchCmptMixins],
    components: {

    },
    data() {
      return {
     name:"costConfirmStation.vue",
           costMaking:false,
           isBackShow:{value:false},
       inputViewData:{
                   hbrq: { title: "航班日期", type: 15},
                   ccz_confirmstatus_in:{'title':'操作站费用状态',type:4,options:[{label:'应收未确认',value:'1'},{label:'应收已确认',value:'700'}],"whereStr":"in",titleStyle:{'minWidth':'116px'},'disabled':true},
                   canceltype:{title:'撤单类型',type:5,whereStr: 'in',groupid:135,disabled:true},
                   cancelman:{'title':'撤单人',type:1,disabled:true},
                },
                inputModelData:{
                 // status:'AO5060',
                  "confirmstatus": "1",
                },
                selectedTableIndex:"",
                showReason:false,
                reasonData:{},//取消对账原因数据
                accountNameItemsActive:'',//结算对象激活
                delbillmanActive:0,//取消对账人激活
                costItemsActive:0,//费用激活
                arrowIndex:0,//费用箭头
                arrowDelBillManIndex:0,//取消对账人箭头
                arrowAcnIndex:0//结算对象箭头
                , costControlDialog:false,//批量分摊弹窗
                shareRecordDialog:false,
                confirmStatusout:'',
                confirmStatusin:'',
                selectTableIndex:'-1',
                orderdom:'',
                area:''
      }
    },
    watch: {
      accountNameItemsActive (newVal) {
        this.delbillmanActive = 0
        this.costItemsActive = 0
        // 重置取消对账人位置
        this.arrowDelBillManIndex = 1
        this.changeDirectionDelBillMan(1)
      }
    },
    methods:{
     search(){
      //var jsonArr=searCondition(this.inputViewData)
          this.tableDataRes=[]
          this.ziTableData=[]
          this.searchData.delbillreason=''
         // this.searchData.orderguid={"unequal":"-1"} //外站
          this.searchData.status={"begin":"500"}
          if($('.level-first-ul').length==1){
             this.searchData.orderfinishman=localStorage.usrname
          }
//this.searchData.ispriorcheck='2'
            var jsonArr2={
              where:this.searchData,
               "order":"hbrq asc,qfsj asc"
            }
            var json={'json':JSON.stringify(jsonArr2)}

            this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoboAxplineWageConfirm',params:json,loading:true,tip:true}).then(results=>{
              //console.log(results)
               //results.data.filter(item=>{return item.unequal ==''})
              if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         this.pageshow=false
                       }
                results.data=getChangeValue(results.data,'空出')
//this.tableDataRes=results.data
                      setTimeout(()=>{
                        // this.tableDataRes=results.data.filter(i=>{
                        //     return i.pono.indexOf('-')>=0
                        // });
                        this.tableDataRes=results.data
                      },20)
            })
            .catch(errors=>{

            })
     },
      openDialog (indexData) {
            this.selectedTableIndex=indexData
            this.mawbguid=this.tableDataRes[indexData].guid
            this.boguid=this.tableDataRes[indexData].boguid
            this.costMaking = true

          },
     openDialog2(indexData){//综合明细
       this.selectTableIndex = indexData
       this.mawbguid = this.tableDataRes[indexData].guid
       this.boguid = this.tableDataRes[indexData].boguid
       this.orderdom = this.tableDataRes[indexData].orderdom
       this.area = this.tableDataRes[indexData].area
       this.dialogShow = true
    },
          uncostMaking(){
            this.costMaking=false;
            ////console.log(this.$refs.costDialog)
            // 重新计算应收应付金额
            this.tableDataRes[this.selectedTableIndex].wageall_in=this.$refs.costDialog.zdtotalCharge
            this.tableDataRes[this.selectedTableIndex].wageall_out=this.$refs.costDialog.zdtotalPayment
            this.tableDataRes[this.selectedTableIndex].wageprofit=Number(Number(this.$refs.costDialog.zdtotalCharge)-Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
            // if(this.$refs.costDialog.ysConfirm==false){
            //   this.tableDataRes[this.selectedTableIndex].confirmstatus_in=1
            // }else{
            //   this.tableDataRes[this.selectedTableIndex].confirmstatus_in=700
            // }

            // if(this.$refs.costDialog.yfConfirm==false){
            //   this.tableDataRes[this.selectedTableIndex].confirmstatus_out=1
            // }else{
            //   this.tableDataRes[this.selectedTableIndex].confirmstatus_out=700
            // }

            //this.search()
          }

    },
    created(){
      //this.search()
        //filterGroupid(this.inputViewData)
    },
      mounted(){
    // setTimeout(()=>{
    //   this.search()
    // },500)

  },
    computed:{

    }

  }
</script>

