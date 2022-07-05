<template>
  <div>
<div  class="page-container-box">
<!-- {{inputModelData}}<br>-->
<!-- {{searchData}} -->

 <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"  :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere" @reset="reset" system="空进">
</newSearchComp>



<!-- {{hawbCost}} -->
<div class="searchForm">
  <el-button  @click="search">查询</el-button>
</div>


</div>
<!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" @transSelIndex="openDialog2" v-on:transmitMsg="getZimessage" :ziTableData="ziTableData"  showZiConfig :showTotal="showTotal" :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog">

 <!-- <template slot="pono" slot-scope="props"><span @click="openDialog2(props.data.index)"   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template> -->

 <template slot="delbillreason" slot-scope="props">
   <span>
   <i class="el-icon-question"  v-if="props.data.value" @click="showReasonF(props.data.row)" title="取消应收对账原因"></i>
   <span v-else>--</span>
   </span>
 </template>

  <template slot="overseasaccreason" slot-scope="props">
   <span>
   <i class="el-icon-question"  v-if="props.data.value"  title="驳回原因" @click="showBHF(props.data.row)"></i>
   <span v-else>--</span>
   </span>
 </template>


 </tableCompt>


<!-- 总单费用制作非合并 -->
 <el-dialog
        :title="markTip=='2'?'现结费用待制作':'现结费用已制作'"
        :visible.sync="costMaking"
        width="100%"
        top="0"
        v-if="costMaking"
        :close-on-press-escape=false
        class="dialogPage"
        :modal="false"
        :close-on-click-modal="false"
        center>
<!--         @close="uncostMaking" -->
        <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" :markTip="markTip" :area="area" :gid="wtgid" :initiator="70" :visible.sync="costMaking" isFromFob="Fob1" :showSuggestWage="markTip=='2'?true:false"></costmaking>
        <!-- <span slot="footer">

        </span> -->
      </el-dialog>

      <el-dialog  title="综合查询" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
              <mawbaddput   :visible.sync="dialogShow"  pagetype='20' :mawbguid="mawbguid" :boguid="boguid" :area="area" :orderdom="orderdom" ></mawbaddput>
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


      <!-- 临时驳回原因 -->
<el-dialog
        width="900px"
        top="4%"
        center
        custom-class="reason"
        :visible.sync="showBH"
        v-if="showBH" append-to-body
        @close="showBH=false;reasonData={};">

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

            <el-input type="textarea" v-model="reasonData.overseasaccreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" :disabled="true"></el-input>







        </div>
      </el-dialog>







  <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
 import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'
import { searCondition,filterGroupid,getChangeValue } from '../api/localStorage.js'
  export default {
    name: 'costCashWage',
    mixins:[openZimessage, searchCmptMixins],
    props:{
    monitor:{
    type:[Number,String],
    default:1
    },
    markTip:{// 1.现结费用待开具 2.现结待制作 3.现结已制作
    type:[Number,String],
    default:1
    }

   },
    components: {

    },
    data() {

      return {
           name:"costCashWage.vue",
           costMaking:false,
           isBackShow:{value:false},
              inputViewData:{
                  status:{'title':'订单状态',type:5,dom:'订单状态',system:'空出',"whereStr":"in",hidden:true},
                  hbrq: { title: "到港日期", type: 15},
                  overseasaccsettdate:{title: "海外DN提交审核日期", type: 15,hidden:this.monitor=='1',nosearch:this.monitor=='1',defaultEnd: true}
                },
                inputModelData:{
                  //confirmstatusall:'2'
                  //status:'AO5060'
                },
                selectedTableIndex:"",
                showReason:false,
                showBH:false,//驳回原因
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
                Fob:'Fob1',
                area:'',
                wtgid:'',
                orderdom:''
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
        //search.ispriorcheck='1'
 
        if(this.markTip=='1'||this.markTip=='3'){//待开具,已制作
            search.overseasacc={'in':'1'}
        }else if(this.markTip=='2'){//待制作
            search.overseasacc={'in':'-1'}
        }

        var jsonArr2={
        where:search,
        "order":"hbrq asc,qfsj asc"
        }
        var json={'json':JSON.stringify(jsonArr2)}

        this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoboAxplineCash',params:json,loading:true,tip:true}).then(results=>{
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
      openDialog (indexData) {
            this.selectedTableIndex=indexData
            this.mawbguid=this.tableDataRes[indexData].guid
            this.boguid=this.tableDataRes[indexData].boguid
            this.area=this.tableDataRes[indexData].area
            this.wtgid=this.tableDataRes[indexData].gid
            //this.boguid=this.tableDataRes[indexData].boguid
            this.costMaking = true
            //this.confirmStatusout=this.tableDataRes[indexData].confirmstatus_out
            //this.confirmStatusin=this.tableDataRes[indexData].confirmstatus_in
          },
      openDialog2 (indexData) {
      this.selectTableIndex=indexData
      this.mawbguid=this.tableDataRes[indexData].guid
      this.boguid=this.tableDataRes[indexData].boguid
      this.orderdom=this.tableDataRes[indexData].orderdom
      this.area=this.tableDataRes[indexData].area
      this.dialogShow = true

          },
          uncostMaking(){
            this.costMaking=false;

            // 重新计算应收应付金额
            this.tableDataRes[this.selectedTableIndex].wageall_in=this.$refs.costDialog.zdtotalCharge
            this.tableDataRes[this.selectedTableIndex].wageall_out=this.$refs.costDialog.zdtotalPayment
            this.tableDataRes[this.selectedTableIndex].wageprofit=Number(Number(this.$refs.costDialog.zdtotalCharge)-Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
            this.search()
            //var data=this.$refs.costDialog.mawbCharge.concat(this.$refs.costDialog.mawbPayment)

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


  //            var ysconfirm=[]
  // var yfconfirm=[]
  //  data.forEach(i => {

  //         if(i.wageinout == 1){
  //           ysconfirm.push(i.confirmstatus)
  //         }else if (i.wageinout == 2) {

  //         yfconfirm.push(i.confirmstatus)

  //       }

  //     })

  //     if(ysconfirm.length>0){

  //       if(ysconfirm.indexOf('已确认')!=-1||ysconfirm.indexOf('对账中')!=-1){
  //         if(this.$refs.costDialog.orderguid>0&&this.$refs.costDialog.profitmode.indexOf('利润')!=-1){

  //         }else{

  //         }



  //       }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){


  //       }else{

  //       }


  //       if(ysconfirm.indexOf('--')!=-1){

  //         if(this.$refs.costDialog.orderguid>0&&this.$refs.costDialog.profitmode.indexOf('利润')!=-1){

  //            this.tableDataRes[this.selectedTableIndex].confirmstatus_in=700
  //         }else{
  //            this.tableDataRes[this.selectedTableIndex].confirmstatus_in=1

  //         }

  //       }else{

  //         this.tableDataRes[this.selectedTableIndex].confirmstatus_in=700
  //       }


  //     }


  //     if(yfconfirm.length>0){

  //      if(yfconfirm.indexOf('已确认')!=-1||yfconfirm.indexOf('对账中')!=-1){


  //       }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){


  //       }else{

  //       }

  //       if(yfconfirm.indexOf('--')!=-1){

  //         this.tableDataRes[this.selectedTableIndex].confirmstatus_out=1
  //       }else{

  //         this.tableDataRes[this.selectedTableIndex].confirmstatus_out=700
  //       }
      //}

          },

          showReasonF(val){

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
          //显示临时驳回原因
          showBHF(val){
              this.showBH=true;
            this.reasonData=val
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
    },
      mounted(){
  },
    computed:{

    }

  }
</script>
