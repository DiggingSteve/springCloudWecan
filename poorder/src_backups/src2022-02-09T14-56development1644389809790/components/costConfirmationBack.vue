<template>
  <div>
    <div class="page-container-box">
      <!-- {{inputModelData}}<br>-->
      <!-- {{searchData}} -->

      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
        @reset="reset"
      ></newSearchComp>

      <!-- {{hawbCost}} -->
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>
    <!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      showZiConfig
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere"
      @wageConfirmStatus="openDialog"
      @transSelIndex="openDialog2"
    ></tableCompt>

    <!-- 总单费用制作非合并 -->
    <el-dialog
      title="费用未确认(驳回)"
      :visible.sync="costMaking"
      width="100%"
      top="0"
      v-if="costMaking"
      @close="uncostMaking"
      :close-on-press-escape="false"
      class="dialogPage"
      :modal="false"
      center
    >
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmaking>
      <!-- <span slot="footer">

      </span>-->
    </el-dialog>

    <!-- 综合查询 -->
    <el-dialog
      title="综合查询"
      v-if="dialogShow"
      center
      :visible.sync="dialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="dialogShow"
        :pagetype="20"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
        :orderdom="orderdom"
      ></mawbaddput>
    </el-dialog>

    <i class="backtop" v-backtop v-scrollshow:100="isBackShow" v-show="isBackShow.value"></i>
  </div>
</template>

<script>
import { systemCheck, openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

import {
  searCondition,
  filterGroupid,
  getChangeValue
} from "../api/localStorage.js";
export default {
  name: "costConfirmationBack",
   mixins:[openZimessage, searchCmptMixins],
  components: {},
  data() {
    return {
      name: "costConfirmationBack.vue",
      costMaking: false,
      isBackShow: { value: false },
      inputViewData: {
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          defaultEnd: true
        },
        cancelman: { title: "撤单人", type: 1, disabled: true },
        canceltype: {
          title: "撤单类型",
          type: 5,
          whereStr: "in",
          groupid: 135,
          disabled: true
        },
        status: {
          title: "订单状态",
          type: 5,
          dom: "订单状态",
          system: "空出",
          whereStr: "in",
          hidden: true
        }
      },
      inputModelData: {
        status: "AO5060,AO5065,AO5070",
        commitstatus: "200"
      },
      selectedTableIndex: "",
      showReason: false,
      reasonData: {}, //取消对账原因数据
      accountNameItemsActive: "", //结算对象激活
      delbillmanActive: 0, //取消对账人激活
      costItemsActive: 0, //费用激活
      arrowIndex: 0, //费用箭头
      arrowDelBillManIndex: 0, //取消对账人箭头
      arrowAcnIndex: 0, //结算对象箭头
      hawbCost: false, //分单费用弹窗
      confirmStatusout: "",
      confirmStatusin: "",
      dialogShow: false,
      selectTableIndex: "-1",
      orderdom: "",
      area: ""
    };
  },
  watch: {
    accountNameItemsActive(newVal) {
      this.delbillmanActive = 0;
      this.costItemsActive = 0;
      // 重置取消对账人位置
      this.arrowDelBillManIndex = 1;
      this.changeDirectionDelBillMan(1);
    }
  },
  methods: {
    search() {
      //var jsonArr=searCondition(this.inputViewData)
      this.tableDataRes = [];
      this.ziTableData = [];
      var search = JSON.parse(JSON.stringify(this.searchData));
      //search.rejectreason={'unequal':''}
      search.rejectstatus = { begin: "112" };
      //search.ispriorcheck='2'
      //search.orderguid=-1
      var jsonArr2 = {
        where: search,
        order: "hbrq asc,qfsj asc"
      };
      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineWageConfirmGeneral",
        params: json,
        loading: true,
        tip: true
      })
        .then(results => {
          //console.log(results)
          //results.data.filter(item=>{return item.unequal !=''})

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(results.data, "空出");

          setTimeout(() => {
            // this.tableDataRes=results.data.filter(i=>{
            //     return i.pono.indexOf('-')<0
            // });
            this.tableDataRes = results.data;
          }, 20);
        })
        .catch(errors => {});
    },
    // reset() {
    //   this.inputModelData = {
    //     status: "AO5060,AO5065,AO5070"
    //   };
    // },
    openDialog(indexData) {
      this.selectedTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.costMaking = true;
      //this.confirmStatusout=this.tableDataRes[indexData].confirmstatus_out
      //this.confirmStatusin=this.tableDataRes[indexData].confirmstatus_in
    },
    openDialog2(indexData) {
      //综合明细
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      this.dialogShow = true;
    },
    uncostMaking() {
      this.costMaking = false;
      ////console.log(this.$refs.costDialog)
      // 重新计算应收应付金额
      this.tableDataRes[
        this.selectedTableIndex
      ].wageall_in = this.$refs.costDialog.zdtotalCharge;
      this.tableDataRes[
        this.selectedTableIndex
      ].wageall_out = this.$refs.costDialog.zdtotalPayment;
      this.tableDataRes[this.selectedTableIndex].wageprofit = Number(
        Number(this.$refs.costDialog.zdtotalCharge) -
          Number(this.$refs.costDialog.zdtotalPayment)
      ).toFixed(2);
      if (this.$refs.costDialog.ysConfirm == false) {
        this.tableDataRes[this.selectedTableIndex].confirmstatus_in = 1;
      } else {
        this.tableDataRes[this.selectedTableIndex].confirmstatus_in = 700;
      }

      if (this.$refs.costDialog.yfConfirm == false) {
        this.tableDataRes[this.selectedTableIndex].confirmstatus_out = 1;
      } else {
        this.tableDataRes[this.selectedTableIndex].confirmstatus_out = 700;
      }

      //this.search()
    }
  },
  created() {},
  mounted() {},
  computed: {}
};
</script>

