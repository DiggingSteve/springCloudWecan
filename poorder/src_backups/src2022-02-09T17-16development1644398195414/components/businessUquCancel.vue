<template>
  <div>
    <div class="page-container-box">
      <!-- {{inputModelData}}
      {{searchData}} -->
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
        <!-- <el-button @click="fenpeiDialog">订单分配</el-button>
        <el-button @click="operationSave">本站操作</el-button>-->
      </div>
    </div>

    <!-- {{selectTableIndex}} -->

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      :chinese-where.sync="chineseWhere"
      showZiConfig
    >
      <!-- <template slot="checkbox" slot-scope="props"><input type="checkbox"  :value="props.data.index" v-model="guidAll"></template> -->
      <template slot="pono" slot-scope="props">
        <span
          @click="openDialog(props.data.index)"
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
        >{{props.data.value}}</span>
      </template>
      <template slot="operate" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.checkDisabled}">
          <!-- :class="{idisabled:props.data.row.dzstatus=='航线驳回'}"  -->
          <i
            class="el-icon-edit"
            title="本站操作"
            style="color:#5BB01D;margin-left:25px;margin-right:10px"
            :dz="props.data.row.dzstatus"
            @click="operationSave(props.data.row.boguid)"
          ></i>
          <i
            class="el-icon-back"
            title="分配"
            style="color:orange;margin-left:14px"
            @click="fenpeiDialog(props.data.row.boguid,props.data.row.area)"
          ></i>
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
      <fenpei :fenpeiguid="fenpeiguid" @back="delFenPIndex" :visible.sync="assignShow" :area="area" origin="客服"></fenpei>
    </el-dialog>

    <!-- 详细 -->
    <el-dialog
      title="订单被驳回"
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
      <!-- <mawbaddput
        :mawbguid="mawbguid"
        :area="area"
        :boguid="boguid"
        :orderdom="orderdom"
        pagetype="3"
        @update="delFenPIndex2"
        :visible.sync="dialogShow"
      ></mawbaddput> -->
      <new-order-add :boguid="boguid" pagetype=2 :visible.sync="dialogShow"></new-order-add>
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
import {
  searCondition,
  filterGroupid,
  getChangeValue,
  formatDate
} from "../api/localStorage.js";
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

export default {
  name: "businessUquCancel",
  components: {
    fenpei
  },
  mixins: [openZimessage, searchCmptMixins],
  data() {
    return {
      name: "businessUquCancel.vue",
      // guidAll:[],//复选框选中集合
      fenpeiguid: "", //分配传过去guid
      area:'',//分配area
      assignShow: false, //分配弹框显示隐藏
      orderCancel: false, //撤单弹窗
      inputViewData: {
        status: {
          title: "订单状态",
          type: 5,
          dom: "订单状态",
          sstem: "空出",
          whereStr: "in",
         // hidden: true
        }, hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          fieldtype: 2
        },
      },
      inputModelData: {
        status: "AO5025,AO5020"
      },
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
      this.searchData.routedelreason = { unequal: "" };
      this.searchData.islocal = 2;
      this.searchData.canceling = 0;
      this.tableDataRes = [];
      this.ziTableData = [];
      var jsonArr2 = {
        where: this.searchData,
        order: "hbrq asc,adddate asc"
      };
      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxpline",
        params: json,
        loading: true,
        tip: true
      })
        .then(results => {
          //console.log(results)

          var data = results.data;
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }

          data = getChangeValue(data, "空出");

          setTimeout(() => {
            // this.tableDataRes=results.data
            this.tableDataRes = data.map(i => {
              /*  if(!(i.orderguid==-1&&((i.islocal==1&&i.isreject==1)||(i.islocal==2&&i.isreject==2)))){
                             i.checkDisabled=true;
                           } */
              if (
                (i.islocal == "是" && i.isreject == 2) ||
                i.creditisbackstatus == 4 ||
                i.creditisbackstatus == "待通过"
              ) {
                i.checkDisabled = true;
              }
              return i;
            });
          }, 20);
        })
        .catch(errors => {});
    },
    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.area = this.tableDataRes[indexData].area;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.dialogShow = true;
    },
    fenpeiDialog(boguid,area) {
      //分配弹框
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
      this.area=area
      this.assignShow = true;
      ////console.log(this.fenpeiguid)
    },

    cancelWfp() {
      //取消待分配
      var guid = [];
      if (this.guidAll.length == 0) {
        this.$message.error("请选择分配订单号");
        return false;
      } else {
        this.guidAll.forEach(item => {
          guid.push(this.tableDataRes[item].boguid);
        });
        this.fenpeiguid = guid.join(",");
      }
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxplineUnAssign",
        data: { boguid: this.fenpeiguid },
        loading: false,
        tip: false
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            var handleData = [];
            this.tableDataRes.forEach((item, index) => {
              if (guid.indexOf(item.boguid) == -1) {
                handleData.push(item);
              }
            });
            this.tableDataRes = handleData;
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
      //this.$axios()
    },
    operationSave(boguid) {
      //WFF操作
      var boguidArr = [];
      if (boguid) {
        boguidArr = [boguid];
      } else {
        this.tableDataRes.forEach(i => {
          if (i.checked) {
            boguidArr.push(i.boguid);
          }
        });
        console.log(boguidArr);
        if (boguidArr.length == 0) {
          this.$message.error("请先选择需操作的订单号！");
          return;
        }
      }

      this.$confirm("请确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExAxplineAssignLocal",
            data: { boguid: boguidArr.toString() },
            loading: true,
            tip: false
          }).then(results => {
            console.log(results);
            if (results.data.resultstatus == 0) {
              this.$message(results.data.resultmessage);
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        })
        .catch(() => {});
    }
  },
  created: function() {
    //this.search()
    //filterGroupid(this.inputViewData)
  },
  mounted() {
    // setTimeout(()=>{
    //   this.search()
    // },500)
  },

  watch: {},
  computed: {
    screenWidth() {
      if (document.body.clientWidth >= 1920) {
        //alert('1')
        return "70%";
      } else if (document.body.clientWidth <= 1480) {
        //alert('1')
        return "90%";
      }
    },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.spanDisabled {
  cursor: not-allowed;
}

.spanDisabled > i {
  pointer-events: none;
}
.idisabled {
  pointer-events: none;
}
</style>
