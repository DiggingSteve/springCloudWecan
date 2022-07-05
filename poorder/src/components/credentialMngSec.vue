<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
        @reset="reset"
        :system="markTip=='4'?'空进':'空出'"
      ></newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere"
    >

      <template slot="showjobno" slot-scope="props">
        <i class="el-icon-document" @click="showJobno(props.data.index)" title="显示工作号"></i>
      </template>
      <template slot="void" slot-scope="props">
        <i
          class="el-icon-close"
          @click="abandonShow(props.data.index,props.data.row.pzdom)"
          title="作废"
        ></i>
      </template>
      <template slot="deljobno" slot-scope="props">
        <i
          class="el-icon-delete"
          @click="delPZ(props.data.index,props.data.row.pzdom)"
          title="删除凭证号"
        ></i>
      </template>
      <!-- <template slot="invoiceExport" slot-scope="props" v-if="tableDataRes[props.data.index].pzdom&&tableDataRes[props.data.index].pzdom=='发票'"><i class="el-icon-tickets" title="发票导出"></i></template> -->
      <!--   <template slot="printC" slot-scope="props" v-if="tableDataRes[props.data.index].pzdom=='账单'"><i class="el-icon-printer"></i></template> -->
      <!-- <template slot="printE" slot-scope="props" v-if="tableDataRes[props.data.index].pzdom&&tableDataRes[props.data.index].pzdom=='账单'"><i class="el-icon-printer" title="账单打印"></i></template> -->

      <!--    <template slot="dzEmail" slot-scope="props"><i class="el-icon-check"></i></template> -->

      <template slot="pzno" slot-scope="props">
        <span
          @click="openDialog(props.data.index)"
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
        >{{tableDataRes[props.data.index].pzno}}</span>
      </template>

      <template slot="isreceive" slot-scope="props">
        <span
          @click="changeReceive(props.data.index)"
          style="cursor:pointer;"
        >{{props.data.row.isreceive=='1'?'已收到':'未收到'}}</span>
      </template>
    </tableCompt>

    <!-- 费用制作 -->
    <el-dialog
      width="100%"
      title="已开凭证"
      top="0"
      center
      :visible.sync="showAccount"
      @close="showImport=false"
      v-if="showAccount"
      class="dialogPage"
      :modal="false"
    >
      <accountMake
        @UnVisibleAccount="accountClose"
        :wageinout="wageinout"
        :pzid="pzid"
        :system="system"
        :accountno="accountno"
        :area="area"
      ></accountMake>
    </el-dialog>

    <!-- 发票制作 -->
    <el-dialog
      width="100%"
      :title="markTip=='4'?'现结费用已开具':'已开凭证'"
      top="4%"
      center
      @close="showImport=false"
      :visible.sync="showInvoice"
      v-if="showInvoice"
      class="dialogPage"
      :modal="false"
    >
      <invoicemake
        :wageinout="wageinout"
        @UnVisibleInvoice="invoiceClose"
        :pzid="pzid"
        :invoicecodeDisable="true"
        :system="system"
        :area="area"
      ></invoicemake>
    </el-dialog>

    <!-- 显示工作号 -->
    <el-dialog
      width="800px"
      top="0"
      center
      :visible.sync="showJobList"
      v-if="showJobList"
      :modal="false"
    >
      <div class="detail" v-if="showJobList">
        <div class="detail-title">
          <p>订舱编号信息</p>
        </div>
        <div class="detail-c">
          <commonTable :head="jobHead" :table-data="jobData">
            <template slot="indexNum" slot-scope="props">{{Number(props.data.index)+1}}</template>
          </commonTable>
        </div>
      </div>
    </el-dialog>

    <!-- 删除提示 -->
    <el-dialog
      width="400px"
      top="4%"
      center
      :visible.sync="delInvoice"
      v-if="delInvoice"
      append-to-body
    >
      <div v-if="delInvoice" style="text-align:center">
        <p style="margin-bottom:18px;">删除发票后状态:</p>
        <el-radio v-model="invoiceState" label="1">不可用</el-radio>
        <el-radio v-model="invoiceState" label="2">可用</el-radio>
        <p style="text-align:center;margin-top:18px;">
          <el-button @click="delInvoiceFun">确定</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 作废弹框 -->
    <el-dialog
      width="400px"
      top="4%"
      center
      :visible.sync="abanInvoice"
      v-if="abanInvoice"
      append-to-body
    >
      <!-- <el-input type="textarea" v-model="abanReason"></el-input>
  <el-button @click="abandon(invoiceIndex)">确定</el-button>
      <el-button @click="abanInvoice=false">取消</el-button>-->
      <div style="text-align:center">
        <p style="margin-bottom:18px;text-align:left;font-size:14px;">作废理由:</p>
        <el-input type="textarea" v-model="invalidreason"></el-input>

        <p style="text-align:center;margin-top:18px;">
          <el-button @click="abandon(invoiceIndex)">确定</el-button>
          <el-button @click="abanInvoice=false">取消</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {  searCondition, getChangeValue } from "../api/localStorage.js";
import accountMake from "./orderDetails/accountMake";
import invoicemake from "./orderDetails/invoiceMake";
import {  searchCmptMixins } from '@/components/mixins/topPageMixin'

export default {
  name: "credentialMngSec",
  components: {
    accountMake,
    invoicemake
  },
  mixins: [ searchCmptMixins],
  props: {
    // system: {
    //   type: String,
    //   default: '空出'
    // },
    wageinout: {
      type: String,
      default: "1"
    },
  
    monitor:{
     type:[Number,String],
     default:1
    },
    markTip:[Number,String]
 
  },
  data() {
    return {
      name: "credentialMngSec.vue",
      showTotal: {
        all: true,
        ybjzt: false,
        sjjzt: false,
        zdjzt: false,
        wageprofit: false,
        realwageall: false,
        billwageall: false,
        wageall: true,
        finishwageall: true,
        finishwageall_checkbill: false
      },
      certificateType: "-1",
      pzid: "",
      tableDataRes: [],
      showImport: false,
      abanInvoice: false, //发票作废弹框
      invalidreason: "", //作废理由
      showJobList: false, //显示工作号
      jobData: [], //工作号date
      invoiceIndex: "", //删除发票号数据索引
      delInvoice: false, //删除发票弹框
      invoiceState: "1", //删除发票状态1、不可用 2、可用
      inputViewData: {
        pzno: { title: "凭证号", type: 1, whereStr: "like" },
        pzdom: {
          title: "凭证类型",
          type: 5,
          options: [
            { label: "账单 D/N", value: "账单" },
            { label: "发票 I/V", value: "发票" }
          ],
          whereStr: "in"
        },
        accountcomgid: { title: "结算对象", type: 20, pagetype: 1 },
        paymentcomgid: { title: "收付对象", type: 20, pagetype: 1 },
        wageinout: {
          title: "收付类型",
          type: 4,
          options: [
            { label: "应收", value: "1" },
            { label: "应付", value: "2" }
          ],
          hidden: true
        },
        pzdate: {
          title: "已开凭证日期",
          type: 15,
          titleStyle: { minWidth: "100px" },
          defaultVal: true,
          begintype: 3
        },
        pono: { title: "订舱编号", type: 1, whereStr: "like" },
        mawb: { title: "总运单号", type: 1, whereStr: "like" },
        isreceive: {
          title: "是否收到",
          type: 4,
          options: [
            { label: "收到", value: "1" },
            { label: "未收到", value: "2" }
          ],
          pagetype: 5
        },
        hbrq: { title: this.markTip?"到港日期":"航班日期", type: 15, defaultVal: false}

      },
      inputModelData: {
        wageinout: this.wageinout
      },
      searchData: {},
      pageshow: true,
      jobHead: [
        { field: "indexNum", title: "序号" },
        { field: "orderno", title: "订舱编号" },
        { field: "mawb", title: "总运单号" },
        { field: "hbrq", title: "航班日期" },
        { field: "pzwageall", title: "凭证总额" }
      ],
      accountno: "",
      chineseWhere: [],
      area: "",
      system: ""
    };
  },
  methods: {
    search() {
      //var jsonArr=searCondition(this.inputViewData)
      this.tableDataRes = [];

      var api=this.markTip||this.monitor=='2'?'api/ExAiraxpPzFinishOverseas3':'api/ExAiraxpPzFinishCollect'

      if(this.monitor=='2'){
       this.searchData.overseasacc={'in':'10'}
      }
      if(this.markTip=='4'){
        this.searchData.overseasacc = {'in':'30'}
      }
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate asc"
      };
      var json = { json: JSON.stringify(jsonArr2) };
      json.area = this.$store.state.areaState;
      //   if(json.area.split(',').length>1){
      //   this.$message.error('只能勾选一个区域');
      //   return false
      // }
      //json.system=this.system
      json.system = "";

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + api,
        params: json,
        loading: true,
        tip: true,
        noarea: 1,
        nofield: 1
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(
            results.data,
            this.markTip=='4'?'空进':'空出',
            "credentialMngSec"
          );
          // 处理日期和件重体
          //    setTimeout(()=>{

          //    results.data.forEach((item,index)=>{

          //  if(item.hbrq){
          //    item.hbrq=dateFormat(item.hbrq,"yyyy-mm-dd")

          //  }

          //  item.ybjzt=item.ybpiece+"/"+pointChange(item.ybweight,2)+"/"+pointChange(item.ybvolume,3)
          //  item.areadom=this.$store.state.areaState+item.dom

          // })
          //    },10)
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 20);
        })
        .catch(errors => {});
    },
    // reset() {
    //   this.inputModelData = { wageinout: this.wageinout };
    // },
    changeReceive(index) {
      if (this.tableDataRes[index].wageinout == "2") {
        return false;
      }
      this.$axios({
        method: "PUT",
        url: this.$store.state.webApi + "api/ExAiraxpPzReceive",
        data: {
          pzid: this.tableDataRes[index].pzid,
          pzdom: this.tableDataRes[index].pzdom,
          isreceive: this.tableDataRes[index].isreceive == "1" ? "2" : "1"
        }
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.tableDataRes[index].isreceive =
              this.tableDataRes[index].isreceive == "1" ? "2" : "1";
          }
        })
        .catch(error => {});
      //this.tableDataRes[index].isreceive=this.tableDataRes[index].isreceive=='1'?'2':'1'
    },
    wtdataP(data) {
      var inputData = this.inputViewData;
      for (var i in inputData) {
        if (inputData[i].type == data.type) {
          if (data.type == 10) {
            this.wtxmid = data.id;
          } else if (data.type == 11) {
            this.wtkhid = data.id;
          }
          inputData[i].model = data.wtdata;
        }
      }
    },
    cancel_reconciliation() {
      ////console.log('cancel_reconciliation')
    },

    send_email() {
      ////console.log('send_email')
    },
    invoiceClose() {
      //关闭发票
      this.showImport = false;
      //this.search()
    },
    accountClose(data) {
      //关闭账单
      this.showImport = false;

      //this.search()
    },
    // 打开发票、账单对话框
    openDialog(i) {
      console.log(this.tableDataRes[i].area);
      this.showImport = true;
      this.accountno = this.tableDataRes[i].pzno;
      this.pzid = this.tableDataRes[i].pzid;
      this.certificateType = this.tableDataRes[i].pzdom == "发票" ? "1" : "2";
      this.area = this.tableDataRes[i].area;
    },

    // 删除凭证号
    delPZ(i, pzdom) {
      if (this.tableDataRes[i].addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }

      //alert(i)
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.invoiceIndex = i;
          if (this.tableDataRes[i].pzdom == "账单") {
            var data = {
              area: this.tableDataRes[i].area,
              pzid: this.tableDataRes[i].pzid,
              pzdom: this.tableDataRes[i].pzdom,
              system: this.tableDataRes[i].system
            };
            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/ExAiraxpPz",
              data: data
            })
              .then(results => {
                if (results.data.resultstatus == 0) {
                  this.$message.success(results.data.resultmessage);
                  this.tableDataRes.splice(i, 1);
                  //this.search()
                } else {
                  this.$message.error(results.data.resultmessage);
                }
              })
              .catch(error => {});
          } else if (this.tableDataRes[i].pzdom == "发票") {
            this.delInvoice = true;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除发票号
    delInvoiceFun() {
      //{id:id,delman:getUsrName(),oldid:oldid,status:$('#drpStatus').find("input:radio:checked").val()}
      var data = {
        area: this.$store.state.areaState,
        pzid: this.tableDataRes[this.invoiceIndex].pzid,
        pzdom: this.tableDataRes[this.invoiceIndex].pzdom,
        status: this.invoiceState
      };
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExAiraxpPz",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.tableDataRes.splice(this.invoiceIndex, 1);
            this.delInvoice = false;
            this.invoiceIndex = "";
            //this.search()
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },

    // 显示工作号
    showJobno(i) {
      this.showJobList = true;
      var data = {
        area: this.tableDataRes[i].area,
        system: this.tableDataRes[i].system || "",
        pzid: this.tableDataRes[i].pzid,
        pzdom: this.tableDataRes[i].pzdom
      };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpPzFinishDetail",
        params: data
      })
        .then(results => {
          ////console.log()

          results.data.jobnolist.forEach(item => {
            ////console.log(item.hbrq)
            //item.hbrq=item.hbrq.toString().replace(/\//g,'-').substring(0,10)
            var time = item.hbrq.substring(0, 10);
            var timeArry = time.split("/");

            timeArry.forEach((item, index) => {
              if (item.length == 1) {
                timeArry[index] = "0" + item;
                //console.log(item)
              }
            });
            item.hbrq = timeArry[0] + "-" + timeArry[1] + "-" + timeArry[2];
            ////console.log(timeArry)
          });

          ////console.log(results.data.jobnolist)
          this.jobData = results.data.jobnolist;
        })
        .catch(error => {});
    },
    // 作废弹框显示隐藏
    abandonShow(i, pzdom) {
      if (this.tableDataRes[i].addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }
     
      this.invoiceIndex = i;
      this.abanInvoice = true;
    },
    // 作废
    abandon(i) {
      var data = {
        area: this.tableDataRes[i].area,
        pzid: this.tableDataRes[i].pzid,
        pzdom: this.tableDataRes[i].pzdom,
        invalidreason: this.invalidreason,
        system: this.tableDataRes[i].system
      };
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExAiraxpPzInvalid",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.invoiceIndex = "";
            this.abanInvoice = false;
            this.search();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    }
  },
  created() {},
  watch: {},
  computed: {
    showAccount: {
      get: function() {
        if (this.showImport && this.certificateType == 2) {
          return true;
        }
      },
      set: function() {}
    },
    showInvoice: {
      get: function() {
        if (this.showImport && this.certificateType == 1) {
          return true;
        }
      },
      set: function() {}
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  margin-bottom: 20px;
  margin-top: 20px;
  border: 1px solid #e8e8e8;
  /deep/ .commonTable {
    div {
      padding-bottom: 0 !important;
    }
  }
  .detail-title {
    height: 36px;
    line-height: 36px;
    text-indent: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #999999;
    background: #f8f8f8;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .detail-c {
    padding: 20px;
    .settlement-table {
      width: 70%;
    }
  }
}
</style>
