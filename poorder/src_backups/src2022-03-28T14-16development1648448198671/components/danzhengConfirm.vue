<template>
  <div>
    <div class="page-container-box">
<!-- {{tableDataRes}} -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere" :pagetype="1" @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>


    <tableCompt :name="name" :table-data-res="tableDataRes" @transSelIndex="openDialog" :nestedTableType="2"
      v-on:transmitMsg="getZimessage" v-on:transAmsMsg="clickHawb" :ziTableData="ziTableData"
      :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
    </tableCompt>


    <el-dialog v-if="dialogShowDz" title="单证确认" center :visible.sync="dialogShowDz" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false"
      style="min-height:600px">
      <confirmDetail :mawbdetail="tableDataRes[selectTableIndex]" :visible.sync="dialogShowDz" pagetype="1"
        :showHawb="showHawb" dom="2"></confirmDetail>
    </el-dialog>

    <el-dialog title="综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :pagetype="20" :mawbguid="mawbguid" :boguid="boguid" :area="area"
        :orderdom="orderdom"></mawbaddput>
    </el-dialog>
  </div>
</template>
<script>
  import confirmDetail from "./orderDetails/confirmDetail";
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate,
    getValByGrouid
  } from "../api/localStorage.js";

  export default {
    name: "danzhengConfirm",
    mixins: [openZimessage, searchCmptMixins],
    components: {
      confirmDetail
    },
    data() {
      return {
        name: "danzhengConfirm.vue",
        dialogShow:false,
        dialogShowDz: false,
        inputViewData: {
          hbrq: {
            title: "航班日期",
            type: 15,
            titleStyle: { minWidth: "100px" },
            defaultVal: true
          },
          noconfirmstatus: {
            title: "单号确认状态",
            type: 5,
            groupid: 195,
            whereStr: "in",
            disabled: true
          },
          dzstatus: {
            title: "单证状态",
            type: 5,
            dom: "单证状态",
            system: "空出",
            whereStr: "in",
            fieldtype: 5,
            hideLabel: ["上榜未确认", "上榜已确认", "单证确认"]
          }
        },
        inputModelData: {
          dzconfirmstatus: "1"
        },
        selectTableIndex: -1,
        putIndex: -1, //点击打开展开分单索引
        showHawb: ""
      };
    },

    methods: {
      clickHawb(data) {
        this.openDialog(this.putIndex);
        this.showHawb = data.row.hawb;
        // console.log(data.index)
        // console.log(data.row)
      },
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };

        if (!this.searchData.dzstatus) {
          this.searchData.dzstatus = { begin: 199 };
        }

        var json = { json: JSON.stringify(jsonArr2), selectType: "单证" };

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/GetMawbHawbConfirmList",
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
            this.tableDataRes = getChangeValue(results.data, "空出");
          })
          .catch(errors => { });
      },
      openDialog(indexData) {
        this.showHawb = "";
        this.selectTableIndex = indexData;
        this.dialogShowDz = true;
      }
    },
    watch: {},

    created() { },
    computed: {}
  };
</script>


<style scoped lang="less">
</style>