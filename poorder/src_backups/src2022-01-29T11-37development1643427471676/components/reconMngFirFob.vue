<template>
  <div>

<div  class="page-container-box">
<!-- {{inputModelData}}<br>-->
<!-- {{searchData}} -->

 <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"  :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere" @reset="reset">
                </newSearchComp>


<!-- {{hawbCost}} -->
<div class="searchForm">
  <el-button  @click="search">查询</el-button>
  <el-button @click="openDialog('',2)">批量对账</el-button>
</div>


</div>
<!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
 <tableCompt :name="name" :table-data-res="tableDataRes" @transSelIndex="openDialogDetail" :nestedTableType="2" v-on:transmitMsg="getZimessage" :ziTableData="ziTableData"  showZiConfig :showTotal="showTotal" :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog($event,1)">


 <!-- <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)"   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template> -->

 <template slot="delbillreason" slot-scope="props">
   <span>
   <i class="el-icon-question"  v-if="props.data.value" @click="showReasonF(props.data.row)" title="取消应收对账原因"></i>
   <span v-else>--</span>
   </span>
 </template>

 </tableCompt>


<!-- 总单费用制作非合并 -->
 <el-dialog
        title="海外D/N开票"
        :visible.sync="costMaking"
        width="100%"
        top="0"
        v-if="costMaking"
        @close="uncostMaking"
        :close-on-press-escape=false
        :close-on-click-modal="false"
        class="dialogPage"
        :modal="false"
        center>

        <reconMngDetail  @unVisible="uncostMaking" :jobid="boguid" :area="area" :system="system" :wageinout='1' :tranMethod="Fob" :gid="accountgid" v-if="costMaking"></reconMngDetail>
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

    <el-dialog title="操作未完成" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false"  :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :mawbguid="mawbguid" pagetype="8" :area="area" :boguid="boguid"
         ></mawbaddput>
    </el-dialog>




  <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
import reconMngDetail from "./orderDetails/reconMngDetail"
import costControlTool from './orderDetails/costControlTool' //成本分摊工具
import shareRecord from './orderDetails/shareRecord' //分摊记录
import { searCondition,filterGroupid,getChangeValue } from '../api/localStorage.js'
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  export default {
    name: 'reconMngFirFob',
    mixins: [openZimessage, searchCmptMixins],
    components: {
      reconMngDetail,costControlTool,shareRecord
    },
    props:{
    monitor:{
     type:[Number,String],
     default:1
    }
    },
    data() {
      return {
     name:"reconMngFirFob.vue",
           costMaking:false,
           isBackShow:{value:false},
           dialogShow:false,
          inputViewData:{
                  status:{'title':'订单状态',type:5,dom:'订单状态',system:'空出',"whereStr":"in",hidden:true},
                  hbrq: { title: "航班日期", type: 15},
                  overseasaccdate:{title: "海外DN审核时间", type: 15,defaultEnd: true},
                },
                inputModelData:{
                  //status:'AO5060'
                   //confirmstatusall:'2'
                   confirmstatus_in:'700'
                },
                selectedTableIndex:"",
                showReason:false,
                reasonData:{},//取消对账原因数据
                accountNameItemsActive:'',//结算对象激活
                delbillmanActive:0,//取消对账人激活
                costItemsActive:0,//费用激活
                arrowIndex:0,//费用箭头
                arrowDelBillManIndex:0,//取消对账人箭头
                arrowAcnIndex:0,//结算对象箭头
                hawbCost:false,//分单费用弹窗
                confirmStatusout:'',
                confirmStatusin:'',
                Fob:'Fob',
                jobid:'',
                system:'',
                area:'',
                accountgid:''
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
var search=JSON.parse(JSON.stringify(this.searchData))
// search.orderguid=-1
search.ispriorcheck='1'
search.overseasacc={'in':'10'}
search.confirmstatus_in={"in":"700,800,1100,1200"}
            var jsonArr2={
              where:search,
               "order":"hbrq asc,qfsj asc"
            }
            var json={'json':JSON.stringify(jsonArr2)}

            this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoboAxplineOverseas3',params:json,loading:true,tip:true}).then(results=>{
              //console.log(results)
              if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         this.pageshow=false
                       }
                results.data=getChangeValue(results.data,'空出')

                      setTimeout(()=>{
                        this.tableDataRes=results.data.filter(i=>{
                            return i.pono.indexOf('-')<0
                        });
                      },20)
            })
            .catch(errors=>{

            })
     },
      openDialog (indexData,type=1) {
            if(type==1){

              this.selectedTableIndex=indexData
              this.mawbguid=this.tableDataRes[indexData].guid
              this.boguid=this.tableDataRes[indexData].boguid
              this.jobid=this.tableDataRes[indexData].boguid
              this.area=this.tableDataRes[indexData].area
              this.system=this.tableDataRes[indexData].system||''
              this.accountgid=this.tableDataRes[indexData].gid

            }else{

              if(!this.tableDataRes.filter(i=>i.checked).every(i=>i.area==this.tableDataRes.filter(i=>i.checked)[0]['area'])){
                return this.$message.error('请选择相同区域')
              }
              this.area=this.tableDataRes.filter(i=>i.checked).map(i=>i.area)[0]
              this.jobid=this.tableDataRes.filter(i=>i.checked).map(i=>i.boguid).join(',')
              this.boguid=this.tableDataRes.filter(i=>i.checked).map(i=>i.boguid).join(',')
              this.system=this.tableDataRes.filter(i=>i.checked).map(i=>i.system).reduce((a,b)=>{if(a.indexOf(b)<0){a.push(b)};return a},[]).join(',')
              this.accountgid=this.tableDataRes.filter(i=>i.checked).map(i=>i.gid).reduce((a,b)=>{if(a.indexOf(b)<0){a.push(b)};return a},[]).join(',')
              //console.log(this.jobid)
              
            }
            this.costMaking = true
            //console.log(this.jobid,this.area,this.system,this.accountgid)
            
            //this.confirmStatusout=this.tableDataRes[indexData].confirmstatus_out
            //this.confirmStatusin=this.tableDataRes[indexData].confirmstatus_in
          },
          openDialogDetail(indexData){
            this.selectedTableIndex = indexData
            this.mawbguid = this.tableDataRes[indexData].guid
            this.boguid = this.tableDataRes[indexData].boguid
            this.jobid = this.tableDataRes[indexData].boguid
            this.area = this.tableDataRes[indexData].area
            this.system = this.tableDataRes[indexData].system || ''
            this.accountgid = this.tableDataRes[indexData].gid
            this.dialogShow = true
          },
          uncostMaking(){
            this.costMaking=false;
            ////console.log(this.$refs.costDialog)
            // 重新计算应收应付金额
            // this.tableDataRes[this.selectedTableIndex].wageall_in=this.$refs.costDialog.zdtotalCharge
            // this.tableDataRes[this.selectedTableIndex].wageall_out=this.$refs.costDialog.zdtotalPayment
            // this.tableDataRes[this.selectedTableIndex].wageprofit=Number(Number(this.$refs.costDialog.zdtotalCharge)-Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
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
          },
          showReasonF(val){
            //console.log(val)
            this.showReason=true;
            this.reasonData=val

            if(this.reasonData.delbillreason[0]=="["){

              this.reasonData.delbillreason=JSON.parse(this.reasonData.delbillreason)
            }else{

              this.reasonData.delbillreason=this.reasonData.delbillreason
            }

            this.reasonData.delbillreason.sort((a, b) => a.delbilldate >= b.delbilldate)

            let delbillObj = {}
            for (let i in this.reasonData.delbillreason) {
              if (!delbillObj[this.reasonData.delbillreason[i].accountname]) {
                delbillObj[this.reasonData.delbillreason[i].accountname] = [JSON.parse(JSON.stringify(this.reasonData.delbillreason[i]))]
              } else {
                delbillObj[this.reasonData.delbillreason[i].accountname].push(JSON.parse(JSON.stringify(this.reasonData.delbillreason[i])))
              }
            }
            console.log(delbillObj)
            this.reasonData.delbillreason = delbillObj

            this.accountNameItemsActive = Object.keys(this.reasonData.delbillreason)[0]
            this.delbillmanActive = 0
            this.costItemsActive = 0

          },
         changeDirection(type){
       var clientWidth=0
      if(type==1){
        this.arrowIndex--;
        if(this.arrowIndex<0){
          layer.msg('已至头部');
          this.arrowIndex=0
          return false;
        }
      }else if(type==2){

        $('.costItemsList').find('li').each(function(){

          clientWidth=clientWidth+$(this).innerWidth()
        })

        if(clientWidth<800){
           this.arrowIndex=0
         return false
        }else{
          this.arrowIndex++
        }

        if(this.arrowIndex>Math.ceil((clientWidth-800)/200)){
          layer.msg('已至尾部');
          this.arrowIndex=Math.ceil((clientWidth-800)/200)
          return false
        }
      }

       $('.costItemsList').css('transform','translateX(-'+this.arrowIndex*200+'px)')


    },
    changeDirectionAcn(type){
       var clientWidth=0
      if(type==1){
        this.arrowAcnIndex--;
        if(this.arrowAcnIndex<0){
          layer.msg('已至头部');
          this.arrowAcnIndex=0
          return false;
        }
      }else if(type==2){

        $('.accountNameItemsList').find('li').each(function(){

          clientWidth=clientWidth+$(this).innerWidth()
        })

        if(clientWidth<800){
           this.arrowAcnIndex=0
         return false
        }else{
          this.arrowAcnIndex++
        }

        if(this.arrowAcnIndex>Math.ceil((clientWidth-800)/360)){
          layer.msg('已至尾部');
          this.arrowAcnIndex=Math.ceil((clientWidth-800)/360)
          return false
        }
      }

       $('.accountNameItemsList').css('transform','translateX(-'+this.arrowAcnIndex*360+'px)')
      },
      changeDirectionDelBillMan(type){
        var clientWidth = 0
        if(type==1){
          this.arrowDelBillManIndex--;
          if(this.arrowDelBillManIndex<0){
            layer.msg('已至头部');
            this.arrowDelBillManIndex=0
            return false;
          }
        } else if(type==2){
          $('.delbillmanList').find('li').each(function(){
            clientWidth=clientWidth+165
          })
          if(clientWidth<800){
            this.arrowDelBillManIndex=0
            return false
          }else{
            this.arrowDelBillManIndex++
          }
          if(this.arrowDelBillManIndex>Math.ceil((clientWidth-800)/165)){
            layer.msg('已至尾部');
            this.arrowDelBillManIndex=Math.ceil((clientWidth-800)/165)
            return false
          }
        }

        $('.delbillmanList').css('transform','translateX(-'+this.arrowDelBillManIndex*165+'px)')
      },
    },
    created(){
      //this.search()
        //filterGroupid(this.inputViewData)
    },
      mounted(){
  },
    computed:{

    }

  }
</script>

