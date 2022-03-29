<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
        @reset="reset"
      ></newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      :chinese-where.sync="chineseWhere"
      showZiConfig
    >
      <template slot="pono" slot-scope="props">
        <span
          @click="openDialog(props.data.index)"
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
        >{{props.data.value}}</span>
      </template>
      <template slot="operate" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.checkDisabled}">
          <i
            class="el-icon-error"
            title="撤单"
            style="color:red"
            @click="orderCancel=true,selectTableIndex=props.data.index"
          ></i>
        </span>
      </template>
    </tableCompt>

    <!-- 分配 -->
    <el-dialog
      :visible.sync="assignShow"
      class="dialogPage"
      :close-on-click-modal="false"
      v-if="assignShow"
      width="96%"
      top="0px"
      :modal="false"
    >
      <fenpei
        :fenpeiguid="fenpeiguid"
        @back="delFenPIndex"
        :visible.sync="assignShow"
        :area="area"
        :orderIncompletePage="true"
      ></fenpei>
    </el-dialog>

    <!-- 详细 -->
    <el-dialog
      title="舱位未确认"
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
        :mawbguid="mawbguid"
        :area="area"
        :boguid="boguid"
        :pagetype="2"
        @update="delFenPIndex2"
        @fenpei="fenpeiDialog($event.boguid,$event.area)"
        :visible.sync="dialogShow"
      ></mawbaddput>
    </el-dialog>

    <!-- 撤单 -->
    <cancelOper
      :orderCancel.sync="orderCancel"
      v-if="orderCancel"
      dom="1"
      :inputModelData="tableDataRes[selectTableIndex]"
      @success="tableDataRes.splice(selectTableIndex, 1)"
    ></cancelOper>
  </div>
</template>

<script>
import fenpei from "./orderDetails/fenpei";
import { getChangeValue, formatDate } from "../api/localStorage.js";
import { openZimessage , searchCmptMixins} from "@/components/mixins/topPageMixin";

export default {
  // 舱位未确认
  name: "cabinUnconfirmed",
  components: {
    fenpei
  },
  mixins: [openZimessage, searchCmptMixins],
  data() {
    return {
      name: "cabinUnconfirmed.vue",
      fenpeiguid: "", //分配传过去guid
      assignShow: false,
      orderCancel: false, //撤单弹窗
      inputViewData: {
          hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          fieldtype: 2
        },
      },
      inputModelData: {
        status: "AO5010,AO5025"
      },
      orderCancelForm: {
        //撤单表单
        canceltype: "",
        cancelreason: "",
        status: "1",
        iswage: "1",
        boguid: this.boguid,
        sid: this.mawbguid,
        nodelist: [{ nodedate: "", nodeman: "", nodecode: "AO5065", sid: "" }]
      }
    };
  },
  methods: {
    delFenPIndex(data) {
      this.assignShow = false;
      if (data.nodel == "2") {
        var nowTableData = [];
        var fenpeiguidArray = this.fenpeiguid.split(",");
        this.tableDataRes.forEach((item, index) => {
          if (item.boguid.indexOf(fenpeiguidArray) == -1) {
            nowTableData.push(item);
          }
          this.tableDataRes = nowTableData;
        });
      }
    },
    delFenPIndex2(data) {
      this.dialogShow = false;
      if (data.nodel == "2") {
        this.tableDataRes.splice(this.selectTableIndex, 1);
      }
    },
    search() {
      // this.searchData.routedelreason = ''
      // this.searchData.status = this.searchData.status || {in:'150,400'}
      // this.searchData.islocal = '1'

      this.tableDataRes = [];
      this.ziTableData = [];

      var jsonArr2 = {
        where: this.searchData,
        order: "hbrq asc,adddate asc"
      };

      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineLocalGeneral",
        params: json,
        loading: true,
        tip: true
      }).then(results => {

        if (results.data.length == 0) {
          this.$message("无查询结果");
          return;
        } else {
          this.pageshow = false;
        }
        setTimeout(() => {
          this.tableDataRes = getChangeValue(results.data, "空出").map(i => {
            if (i.childguid>-1) {
              i.checkDisabled = true;
            }
            return i;
          });
        }, 0);
      });
    },
    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.area = this.tableDataRes[indexData].area;
      this.dialogShow = true;
    },
    fenpeiDialog(boguid, area) {
      //分配弹框
      console.log(boguid, area);
      this.area = area;
      if (boguid) {
        this.fenpeiguid = boguid;
      } else {
        if (this.guidAll.length == 0) {
          this.$message.error("请选择分配订单号");
          return false;
        } else {
          var guid = [];
          this.guidAll.forEach(item => {
            guid.push(this.tableDataRes[item].boguid);
          });
          this.fenpeiguid = guid.join(",");
        }
      }

      this.assignShow = true;
    }
  },
  computed: {
    guidAll() {
      var arr = [];
      this.tableDataRes.forEach((i, index) => {
        if (i.checked) {
          arr.push(index);
        }
      });
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
