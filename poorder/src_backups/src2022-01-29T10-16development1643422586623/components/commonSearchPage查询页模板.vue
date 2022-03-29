<template>
  <div>
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :chinese-where.sync="chineseWhere" :pageshow.sync="pageshow" @reset="reset"></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"
      :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
    </tableCompt>
    <el-dialog title="综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :pagetype="20" :mawbguid="mawbguid" :boguid="boguid" :area="area"
        :orderdom="orderdom"></mawbaddput>
    </el-dialog>
  </div>
</template>
<script>
  import { openZimessage , searchCmptMixins} from "@/components/mixins/topPageMixin";
  import {
    getChangeValue
  } from "../api/localStorage.js";

  export default {
    mixins: [openZimessage, searchCmptMixins],
    data() {
      return {
        inputViewData: {
          hbrq: {
            title: "航班日期", type: 15, defaultVal: true,
          },
        },
        inputModelData: {
        },
      };
    },

    methods: {
      search() {
        this.selectTableIndex = -1;
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
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            setTimeout(() => {
              let data = results.data.map(i => {
                if (i.czlx != '唯凯配舱' || i.mawb || i.system != '空出' || i.iscomboine == 1 || i.comboine != 1 || i.status >= 300 || i.isinwageallin == 4 || i.canceling != 0) {
                  i.checkDisabled = true;
                }
                return i
              })
              this.tableDataRes = getChangeValue(data, "空出");
            }, 0);
          })
          .catch(errors => { });
      },
      openDialog(indexData) {
        this.selectTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.orderdom = this.tableDataRes[indexData].orderdom;
        this.area = this.tableDataRes[indexData].area;
        this.dialogShow = true;
      },

    },
    computed: {

    },
    created() {

    }
  };
</script>


<style scoped lang="less">


</style>