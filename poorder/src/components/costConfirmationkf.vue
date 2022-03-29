<template>
  <div>
    <div class="page-container-box">
      <!-- {{inputModelData}} -->
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

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      @transSelIndex="openDialog2"
      :nestedTableType="2"
      @transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      showZiConfig
      @wageConfirmStatus="openDialog"
      :showTotal="showTotal"
      tableWagedom="客服"
      :chinese-where.sync="chineseWhere"
    >
    <template slot="operate" slot-scope="props">
      <el-badge is-dot class="item"  v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "     :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
          <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
      </el-badge>
    </template>

    </tableCompt>

    <!-- 撤单 -->
    <cancelOper
      :orderCancel.sync="orderCancel"
      v-if="orderCancel"
      dom="7"
      :inputModelData="tableDataRes[selectedTableIndex]"
      @success="tableDataRes.splice(selectedTableIndex, 1)"
    ></cancelOper>

    <!-- 总单费用制作非合并 -->
    <el-dialog
      title="费用未确认(本站订单)"
      :visible.sync="costMakingVisible"
      width="100%"
      top="0"
      v-if="costMakingVisible"
      @close="uncostMaking"
      :close-on-press-escape="false"
      class="dialogPage"
      :modal="false"
      center
    >
      <!-- <costmakingkf :showSuggestWage="true" :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmakingkf> -->

      <costmaking
        :showSuggestWage="monitor=='1'?true:false"
        :mawbguid="mawbguid"
        @unvisible="uncostMaking"
        :boguid="boguid"
        costDom="客服"
        initiator="10"
        ref="costDialog"
      ></costmaking>
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
    <component :is="childrenComponent" v-if="OrderVisible"></component>
  </div>
</template>

<script>
import {
  searCondition,
  filterGroupid,
  getChangeValue,
  formatDate
} from "../api/localStorage.js";
//import costmakingkf from "./orderDetails/costMakingkf";
  import managerDetail from "../wffmanagement/orderDetail/managerDetail";
  import managerDetailTz from "../wffmanagement/orderDetail/managerDetailTz";
import { systemCheck, openZimessage, searchCmptMixins ,manageShMethod,renderHtml } from "@/components/mixins/topPageMixin";
var parentComponent={
  name: "costConfirmationkf",
  mixins: [systemCheck, openZimessage, searchCmptMixins,manageShMethod],
  components: { managerDetail,managerDetailTz },
  props:{
    monitor:{
      type:[String,Number],
      default:1
    }
  },
  data() {
    return {
      name: "costConfirmationkf.vue",
      mawbguid: "", // 费用制作详细参数
      boguid: "", // 费用制作详细参数
      costMakingVisible: false,
      isBackShow: { value: false },
      inputViewData: {
        // confirmstatus: {
        //   title: "费用状态",
        //   type: 5,
        //   whereStr: "in",
        //   fieldtype: 5,
        //   options: [
        //     { label: "客服未确认", value: "1" },
        //     { label: "客服已确认", value: "700" }
        //   ]
        // },
        canceltype: {
          title: "撤单类型",
          type: 5,
          whereStr: "in",
          groupid: 135,
          disabled: true
        },
        cancelman: { title: "撤单人", type: 1, disabled: true },
        // status: { 'title': '订单状态', type: 5, dom: '订单状态', system: '空出', 'whereStr': 'in', hidden: false },
        hbrq: { title: "航班日期", type: 15, defaultVal:false, defaultEnd:true},

      },
      inputModelData: {
        status: this.monitor=='1'?'AO5060,AO5065':'AO5060,AO5070',
        confirmstatus: '1',
        applysignman: localStorage.usrname
      },
      selectedTableIndex: "",
      orderCancel: false,
      selectTableIndex: "-1",
      orderdom: "",
      area: "",
      wageRejectin: false,
      wageRejectout: false,
      initiator:'10'
    };
  },
  computed: {},
  methods: {
    search() {
      this.tableDataRes = [];
      this.ziTableData = [];
      var search = JSON.parse(JSON.stringify(this.searchData));
      // search.delbillreason = "";
      search.wagedom = "客服";
      // 费用未确认的情况下，传入30天前的开始日期
      if (
        search.confirmstatus &&
        search.confirmstatus.in == "1" &&
        !this.$store.state.isWorkUnFinish
      ) {
        if (search.hbrq && !search.hbrq.begin) {
          let begin = new Date();
          begin.setMonth(begin.getMonth() - 2);
          search.hbrq.begin = formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
        }
      }
      var jsonArr2 = {
        where: search,
        order: "hbrq asc,qfsj asc"
      };
      var json = { json: JSON.stringify(jsonArr2) };
      let url= this.monitor == 1 ? "api/ExHpoboAxplineWageDomConfirm" : "api/ExHpoboAxplineWageDomReject"
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + url,
        params: json,
        loading: true,
        tip: true
      }).then(({ data }) => {
        console.log(data);
        if (data.length == 0) {
          this.$message("无查询结果");
          return;
        } else {
          this.pageshow = false;
        }
        setTimeout(() => {
          this.tableDataRes = getChangeValue(data, "空出");
        }, 0);
      });
    },
    openChatRoome(row){
        //this.$emit('openChatRoome',obj)
        //从表格列表项进入 使用下面代码
        this.$store.commit("setChat", { status: true, data: row });
    },
    // reset() {
    //   this.inputModelData = {
    //     status: "AO5060",
    //     confirmstatus: "1",
    //     applysignman: localStorage.usrname
    //   };
    // },
    openDialog(indexData) {
      //console.log(this.tableDataRes[indexData].tzType)
      if(this.tableDataRes[indexData].tzType=='单票'){
        //alert('111')
      this.getWffDetail(this.tableDataRes[indexData])
      }else{
      this.selectedTableIndex = indexData;
      let td = this.tableDataRes[indexData];
      this.mawbguid = td.guid;
      this.boguid = td.boguid;
      if (td.canceling == 1 || td.canceling == 2) {
        this.orderCancel = true;
      } else {
        this.costMakingVisible = true;
      }
      }

    },
    openDialog2(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      this.dialogShow = true;
    },
    uncostMaking() {
      this.costMakingVisible = false;

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
    },

  },

  mounted() {
      this.childrenComponent = renderHtml.call(
        this,
        parentComponent,
        1,
        {
          title:'费用审批',
          origin:'客服'
        }
      );
    }
}
export default parentComponent
</script>


