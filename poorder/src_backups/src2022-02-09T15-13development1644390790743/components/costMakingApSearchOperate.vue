<template>
  <div>

    <div class="page-container-box">
      <!-- {{inputModelData}}<br>-->
      <!-- {{searchData}} -->

      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere"
        @reset="reset">
      </newSearchComp>


      <!-- {{hawbCost}} -->
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
      </div>


    </div>
    <!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData" showZiConfig :showTotal="showTotal" :chinese-where.sync="chineseWhere">
      <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)"
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template>
    </tableCompt>


    <!-- 总单费用制作非合并 -->
    <el-dialog title="费用修改申请" :visible.sync="costMaking" width="100%" top="0" v-if="costMaking" @close="uncostMaking"
      :close-on-press-escape=false class="dialogPage" :modal="false" center>

      <costmakingApply :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog">
      </costmakingApply>
      <!-- <span slot="footer">

        </span> -->
    </el-dialog>

    <el-dialog title="费用未确认" :visible.sync="costMakingApp" width="100%" top="0" v-if="costMakingApp"
      @close="costMakingApp=false" :close-on-press-escape=false class="dialogPage" :modal="false" center>

      <costmaking :mawbguid="mawbguid" :boguid="boguid" ref="costDialog"></costmaking>
      <!-- <span slot="footer">

        </span> -->
    </el-dialog>




    <el-dialog :visible.sync="costControlDialog" title="批量成本分摊" width="90%" top="4%" center v-if="costControlDialog"
      :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
          @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
      </span>
      <costControlTool></costControlTool>
    </el-dialog>

    <el-dialog :visible.sync="shareRecordDialog" width="90%" title="批量成本分摊记录" top="4%" center v-if="shareRecordDialog"
      :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
          @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
      </span>
      <shareRecord></shareRecord>
    </el-dialog>



    <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>

  import { searCondition, filterGroupid, getChangeValue } from '../api/localStorage.js'
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  export default {
    name: 'costMakingApSearch',
    mixins: [openZimessage, searchCmptMixins],
    components: {

    },
    data() {
      return {
        name: "costMakingApSearch.vue",
        costMaking: false,
        isBackShow: { value: false },
        inputViewData: {
          cancelman: { 'title': '撤单人', type: 1, disabled: true },
          canceltype: { title: '撤单类型', type: 5, whereStr: 'in', groupid: 135, disabled: true },
          status: { 'title': '订单状态', type: 5, dom: '订单状态', system: '空出', "whereStr": "in", hidden: true },
        },
        inputModelData: {
          // status:'AO5060',


        },
        selectedTableIndex: "",
        showReason: false,
        reasonData: {},//取消对账原因数据
        accountNameItemsActive: '',//结算对象激活
        delbillmanActive: 0,//取消对账人激活
        costItemsActive: 0,//费用激活
        arrowIndex: 0,//费用箭头
        arrowDelBillManIndex: 0,//取消对账人箭头
        arrowAcnIndex: 0,//结算对象箭头
        costControlDialog: false,//批量分摊弹窗
        shareRecordDialog: false,
        hawbCost: false,//分单费用弹窗
        confirmStatusout: '',
        confirmStatusin: '',
        costMakingApp: '',//审批完成后跳到费用未确认页面
      }
    },
    watch: {
      accountNameItemsActive(newVal) {
        this.delbillmanActive = 0
        this.costItemsActive = 0
        // 重置取消对账人位置
        this.arrowDelBillManIndex = 1
        this.changeDirectionDelBillMan(1)
      }
    },
    methods: {
      search() {
        //var jsonArr=searCondition(this.inputViewData)
        this.tableDataRes = []
        this.ziTableData = []
        var search = JSON.parse(JSON.stringify(this.searchData))
        //search.delbillreason=''
        //search.orderguid="-1"//本站
        search.commitstatus = '100'
        //search.ispriorcheck='2'

        var jsonArr2 = {
          where: search,
          "order": "hbrq asc,qfsj asc"
        }
        var json = { 'json': JSON.stringify(jsonArr2) }

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExBoBaseWageCommit', params: json, loading: true, tip: true }).then(results => {
          //results.data.filter(item=>{return item.unequal ==''})
          //console.log(results)
          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          results.data = getChangeValue(results.data, '空出')

          setTimeout(() => {
            // this.tableDataRes=results.data.filter(i=>{
            //     return i.pono.indexOf('-')<0
            // });
            this.tableDataRes = results.data
          }, 20)
        })
          .catch(errors => {

          })
      },
      openDialog(indexData) {
        this.selectedTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.costMaking = true
        //this.confirmStatusout=this.tableDataRes[indexData].confirmstatus_out
        //this.confirmStatusin=this.tableDataRes[indexData].confirmstatus_in
      },



      uncostMaking(mark) {



        this.costMaking = false;

        // 重新计算应收应付金额
        // this.tableDataRes[this.selectedTableIndex].wageall_in=this.$refs.costDialog.zdtotalCharge
        // this.tableDataRes[this.selectedTableIndex].wageall_out=this.$refs.costDialog.zdtotalPayment
        // this.tableDataRes[this.selectedTableIndex].wageprofit=Number(Number(this.$refs.costDialog.zdtotalCharge)-Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
        if (mark == '1') {
          this.costMakingApp = true
        }

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

        // var ysconfirm=[]
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
        //     }







        //this.search()
      }
    },
    created() {
      //this.search()
      //filterGroupid(this.inputViewData)
    },
    mounted() {
      // setTimeout(()=>{
      //   this.search()
      // },500)

    },
    computed: {

    }

  }
</script>