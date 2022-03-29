
<template>
  <div>
    <div class="page-container-box">
      <!-- {{inputModelData}}
      {{searchData}}-->
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
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>
    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg"
      :ziTableData="ziTableData"
      showZiConfig
      :chinese-where.sync="chineseWhere"
    >
      <template slot="pono" slot-scope="props">
        <span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
          @click="openDialog(props.data.index)"
        >{{props.data.value}}</span>
      </template>
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <el-dialog
      v-if="dialogShow"
      title="信控待通过"
      center
      :visible.sync="dialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <!-- <mawbaddput
        :visible.sync="dialogShow"
        :pagetype="4"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
        :orderdom="orderdom"
      ></mawbaddput> -->
      <new-order-add :boguid="boguid" pagetype=2 :visible.sync="dialogShow" frompage="2"></new-order-add>
    </el-dialog>
  </div>
</template>
<script>
import makingBill from "./orderDetails/makingBill";
import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate
} from "../api/localStorage.js";
export default {
  name: "creditControl",
  mixins: [openZimessage, searchCmptMixins],
  components: {
    makingBill
  },
  data() {
    return {
      name: "creditControl.vue",
      dialogPeicang: false,
      inputViewData: {
        creditisbackstatus: {
          title: "信控状态",
          type: 5,
          whereStr: "in",
          options: [
            { label: "待通过", value: "4" },
            { label: "已通过", value: "3" },
            { label: "已驳回", value: "5" }
          ]
        },
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          fieldtype: 2
        }
      },
      inputModelData: {
        creditisbackstatus: "4"
      },
      mawbDetail: {},
      printIndex: -1,
      putIndex: -1, //点击打开展开分单索引
      //selectTableIndex:'',
    };
  },

  methods: {
    delTableIndex(data) {
      this.dialogShow = false;
      // if(data.nodel==2){
      //    this.tableDataRes.splice(this.selectTableIndex,1)
      // }
    },

    transmitZiMsg(msg) {
      this.printIndex = msg.index;

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: { boguid: this.tableDataRes[this.putIndex].boguid },
        loading: false,
        tip: false
      }).then(results => {
        var data = results.data;
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxpline",
          params: { guid: this.ziTableData[msg.index].guid },
          loading: true,
          tip: false
        }).then(res => {
          var hawbdata = res.data;

          //  //console.log(222222222)
          //  //console.log(JSON.stringify(hawbdata))

          data.mdg = hawbdata.mdg;
          data.zdpiece = hawbdata.zdpiece;
          data.zdweight = hawbdata.zdweight;
          data.zdvolume = hawbdata.zdvolume;
          data.smallpiece = hawbdata.smallpiece;
          data.englishpm = hawbdata.englishpm;
          data.jfweight = computedWeight(hawbdata.zdvolume, hawbdata.zdweight);
          data.hawb = hawbdata.hawb;
          data.guid = hawbdata.guid;
          data.orderdom = "分单";
          this.mawbDetail = data;
          setTimeout(() => {
            this.$refs.makingbill && this.$refs.makingbill.printFunc();
            this.printIndex = -1;
          }, 500);
        });
      });
    },
    search() {
      if (
        this.$store.state.ifLimitSearch &&
        Object.keys(this.searchData).length == 0
      ) {
        return this.$message.error("请输入或选择查询条件！");
      }
      this.searchData.canceling = 0;
      this.tableDataRes = [];
      this.ziTableData = [];
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineGeneral",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 20);
        })
        .catch(errors => {});
    },
    // reset() {
    //   // reset(this.inputViewData)
    //   this.inputModelData = { creditisbackstatus: "4" };
    // },
    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      //console.log(this.mawbguid)
      this.dialogShow = true;
    }
  },
  created() {},
  computed: {}
};
</script>


<style scoped>
</style>
