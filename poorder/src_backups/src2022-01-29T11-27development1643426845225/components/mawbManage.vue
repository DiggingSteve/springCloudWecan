
<template>
  <div>
    <div class="page-container-box">
      <el-tabs>
        <el-tab-pane label="总运单借用">
          <newFormCmpt
            :name="name"
            :view-data.sync="inputViewData"
            :model-data.sync="inputModelData"
            :search-data.sync="searchData"
            :pagetype="1"
            :whereTmpShow="false"
          ></newFormCmpt>
          <div class="searchForm">
            <el-button @click="search">查询</el-button>
            <el-button @click="dialogShow('1')">借用</el-button>
            <el-button @click="dialogShow('4')">归还</el-button>
            <!-- <el-button>清单</el-button>
            -->
            <el-button @click="sendDialog=true">寄出</el-button>
            <el-button @click="closeDialog">返回</el-button>
            <el-button>重置</el-button>
          </div>

          <commonTable :head="mawbHead" :table-data="mawbData" class="commonTable" paginationShow></commonTable>
        </el-tab-pane>
        <el-tab-pane label="总运单预定">
          <newFormCmpt
            :name="name"
            :view-data.sync="preViewModel "
            :model-data.sync="preModelData"
            :search-data.sync="presearchData"
            :pagetype="1"
            :whereTmpShow="false"
          ></newFormCmpt>
          <div class="searchForm">
            <el-button @click="preSearch">查询</el-button>
            <el-button @click="dialogShow('3')">新增</el-button>
            <el-button @click="cancelPre">取消预定</el-button>
            <el-button @click="closeDialog">返回</el-button>
            <el-button>重置</el-button>
          </div>

          <commonTable
            :head="preTableHead"
            :table-data="preTableData"
            class="commonTable"
            isMultiSelect
            paginationShow
          ></commonTable>
        </el-tab-pane>
      </el-tabs>

      <!-- {{ziTableIndex}}
      {{dataGrouping}}-->
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <!--  <tableCompt :name="name" :table-data-res="tableDataRes"  :chinese-where="chineseWhere" :showTotal="showTotal"></tableCompt>
    -->

    <!-- 借用、寄出表格 -->

    <el-dialog
      :visible.sync="dialog"
      class="addPcDialog"
      :close-on-click-modal="false"
      v-if="dialog"
      width="1300px"
      append-to-body
    >
      <mawbOB :pageType="pagetype" :jcpch="jcpchno" :bRowData="bRowData"></mawbOB>
    </el-dialog>

    <!-- 寄出 -->
    <el-dialog
      title="寄出"
      :visible.sync="sendDialog"
      class="addPcDialog"
      :close-on-click-modal="false"
      v-if="sendDialog"
      width="1300px"
      append-to-body
    >
      <newFormCmpt
        :view-data.sync="sendViewModel"
        :model-data.sync="sendModelData"
        :pagetype="1"
        :search-data.sync="sendSearchData"
        :whereTmpShow="false"
      ></newFormCmpt>
      <div class="searchForm">
        <el-button @click="bOutSearch">查询</el-button>
        <el-button @click="sendDialog=false">返回</el-button>
      </div>

      <commonTable :head="sendTableHead" :table-data="sendTableData" class="commonTable">
        <template slot="operation" slot-scope="props">
          <i
            class="el-icon-setting"
            @click="dialog=true;jcpchno=props.data.row.jcpchno;pagetype='2';bRowData=props.data.row"
          ></i>
        </template>
      </commonTable>
    </el-dialog>
  </div>
</template>
<script>
import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate,
  getMomentDate,
  dateFormat
} from "../api/localStorage.js";
import mawbOB from "./orderDetails/mawbOB";
export default {
  name: "mawbManage",
  components: {
    mawbOB
  },
  props: {
    visible: Boolean
  },
  data() {
    return {
      name: "mawbManage.vue",

      pageshow: true,
      //借用
      inputViewData: {
        //借用查询条件
        mawb: {
          title: "总运单号",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        czlx: {
          title: "操作类型",
          type: 4,
          groupid: 132,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        // dzstatus:{'title':'单证状态',type:5,dom:'单证状态',whereStr:'in',itemStyle: { width: "280px" ,minWidth:'280px'}},
        jydate: {
          title: "借出日期",
          type: 15,
          defaultVal: true,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        jyr: {
          title: "借出人",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        jykhif: {
          title: "借出对象",
          type: 14,
          pagetype: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        jystatus: {
          title: "借出状态",
          type: 5,
          whereStr: "in",
          options: [
            { label: "未借", value: "1" },
            { label: "已借", value: "2" }
          ],
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        jyremark: {
          title: "借出备注",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        gysname: {
          title: "供应商",
          type: 20,
          pagetype: 3,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        status: {
          title: "状态",
          type: 5,
          whereStr: "in",
          options: [
            { label: "可用", value: "1" },
            { label: "已领用", value: "2" },
            { label: "已制单", value: "3" },
            { label: "不可用", value: "4" },
            { label: "作废", value: "5" }
          ],
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        djdate: {
          title: "登记日期",
          type: 15,
          defaultVal: true,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        ydxs: {
          title: "运单形式",
          type: 4,
          options: [
            { label: "实体运单", value: "实体运单" },
            { label: "非实体运单", value: "非实体运单" }
          ],
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        mawbss: {
          title: "运单所属",
          type: 4,
          options: [
            { label: "我司运单", value: "我司运单" },
            { label: "非我司运单", value: "非我司运单" }
          ],
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        jcpchno: {
          title: "寄出批次号",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        }
        // hbrq:{'title':'航班日期',type:15,defaultVal:true,itemStyle: { width: "280px" ,minWidth:'280px'}}
      },
      inputModelData: {},
      searchData: {},
      // chineseWhere:[],
      mawbHead: [
        // {field:'checkbox',title:'请选择'},
        { field: "mawb", title: "总运单号" },
        { field: "gysname", title: "供应商" },
        { field: "czlx", title: "操作类型" },
        { field: "status", title: "状态" },
        { field: "jystatus", title: "借出状态" },
        // {field:'dzstatus',title:'单证状态'},
        { field: "jyr", title: "借出人" },
        {
          field: "jydate",
          title: "借出日期",
          formatType: 1,
          format: "yyyy-MM-dd HH:mm"
        },
        { field: "jykhname", title: "借出对象" },

        { field: "jywffareaname", title: "借出分区" },
        { field: "jymdg", title: "借出目的港" },
        { field: "remark", title: "借出备注" },
        { field: "jcpchno", title: "寄出批次号" }
      ],
      mawbData: [],
      dialog: false, //借用弹框
      pagetype: "", //借出1、归还4、寄出2、预定3 区分
      //寄出
      sendDialog: false, //寄出弹框
      sendViewModel: {
        //寄出查询条件
        jcpchno: {
          title: "批次号：",
          type: 1,
          itemStyle: { width: "289px", minWidth: "289px" }
        },
        mawb: {
          title: "总运单号",
          type: 1,
          itemStyle: { width: "289px", minWidth: "289px" }
        },
        jykhid: {
          title: "借出对象：",
          type: 13,
          itemStyle: { width: "289px", minWidth: "289px" },
          pagetype: 2
        },
        jyqsr: {
          title: "对方签收人",
          type: 1,
          itemStyle: { width: "289px", minWidth: "289px" }
        },
        jydate: {
          title: "借出日期：",
          type: 15,
          itemStyle: { width: "289px", minWidth: "289px" },
          defaultVal: true
        },
        // sfjc:{title:'是否寄出：',type:4,itemStyle: { width: "289px" ,minWidth:'289px'},options:[{label:'是',value:'1'},{label:'否',value:'2'}]},
        jyqsaddress: {
          title: "签收地址",
          type: "1",
          itemStyle: { width: "289px", minWidth: "289px" }
        }
      },
      sendModelData: {},
      sendSearchData: {},
      //sendChineseWhere:[],
      sendTableHead: [
        { field: "operation", title: "操作" },
        // {field:'sfjc',title:'是否寄出'},
        { field: "jcpchno", title: "批次号" },
        { field: "jykhname", title: "借出对象" },
        { field: "jyqsr", title: "对方签收人" },
        { field: "jyqsaddress", title: "签收地址" },
        { field: "jydate", title: "借出日期" },
        { field: "jynum", title: "借出份数" }
      ],
      sendTableData: [],
      jcpchno: "", //寄出传值
      bRowData: {}, //寄出行数据

      //预定
      preViewModel: {
        //预定查询条件
        mawb: {
          title: "总运单号：",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        czlx: {
          title: "操作类型",
          type: 4,
          itemStyle: { width: "280px", minWidth: "280px" },
          groupid: 132
        },
        // dzstatus:{title:'单证状态',type:5,itemStyle: { width: "280px" ,minWidth:'280px'},dom:'单证状态',whereStr:'in'},
        status: {
          title: "状态",
          type: 5,
          itemStyle: { width: "280px", minWidth: "280px" },
          whereStr: "in",
          options: [
            { label: "可用", value: "1" },
            { label: "已领用", value: "2" },
            { label: "已制单", value: "3" },
            { label: "不可用", value: "4" },
            { label: "作废", value: "5" }
          ]
        },
        bookinger: {
          title: "预订人",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        bookingdate: {
          title: "预定日期",
          type: 15,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        bookingwffid: {
          title: "预定分区",
          type: 5,
          whereStr: "in",
          options: [
            { label: "南美航线", value: "2" },
            { label: "欧洲航线", value: "3" },
            { label: "亚洲航线", value: "4" },
            { label: "北美航线", value: "7" },
            { label: "非洲航线", value: "8" },
            { label: "澳洲航线", value: "9" },
            { label: "印巴中东航线", value: "10" }
          ],
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        bookingmdg: {
          title: "预定目的港",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        },
        bookingkhname: {
          title: "预定客户",
          type: 11,
          itemStyle: { width: "280px", minWidth: "280px" },
          pagetype: 1
        },
        remark: {
          title: "预定备注",
          type: 1,
          itemStyle: { width: "280px", minWidth: "280px" }
        }
      },
      preModelData: {},
      presearchData: {},
      preTableHead: [
        { field: "mawb", title: "总运单号" },
        { field: "gysname", title: "供应商" },
        { field: "czlx", title: "操作类型" },
        { field: "status", title: "状态" },
        // {field:'dzstatus',title:'单证状态'},
        { field: "bookinger", title: "预订人" },
        { field: "bookingkhname", title: "预定客户" },
        {
          field: "bookingdate",
          title: "预定日期",
          formatType: 1,
          format: "yyyy-MM-dd"
        },
        { field: "bookingwffareaname", title: "预定分区" },
        { field: "bookingmdg", title: "预定目的港" },
        { field: "bookingremark", title: "预定备注" }
      ],
      preTableData: []
    };
  },

  methods: {
    //弹框
    dialogShow(type) {
      if (this.$store.state.areaState.split(",").length > 1) {
        this.$message.error("请选择区域");
        return;
      }
      //console.log(this.$store.state.areaState)
      this.pagetype = type;
      this.dialog = true;
      this.jcpchno = "";
      this.bRowData = {};
    },
    /************************************预定方法************************************/
    // 预定查询
    preSearch() {
      var jsonArr2 = {
        where: this.presearchData,
        order: "djdate desc"
      };
      var json = {
        json: JSON.stringify(jsonArr2)
      };
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetGeneralBookingList",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          this.preTableData = results.data;
          this.preTableData.forEach(i => {
            //  i.bookingdate=dateFormat(i.bookingdate,'yyyy-MM-dd HH:mm')

            if (i.status == "1") {
              i.status = "可用";
            } else if (i.status == "2") {
              i.status = "已领用";
            } else if (i.status == "3") {
              i.status = "已制单";
            } else if (i.status == "4") {
              i.status = "不可用";
            } else if (i.status == "5") {
              i.status = "作废";
            }
            // if(i.bookingdate.indexOf('1990')!='-1'){
            // 	i.bookingdate='--'
            // }
          });
        })
        .catch(error => {});
    },
    // 取消预订
    cancelPre() {
      //alert('1')
      var mawbList = [];
      this.preTableData.forEach(i => {
        if (i.checked) {
          mawbList.push({ id: i.id });
        }
      });
      console.log(mawbList);
      this.$axios({
        method: "put",
        url: this.$store.state.BasicWebApi + "api/UpdateInfoByMawbUnBooking",
        data: { mawbList: JSON.stringify(mawbList) },
        loading: true,
        tip: false
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.preTableData.forEach(i => {
              if (i.checked) {
                this.$set(i, "thisListHide", true);
              }
            });
            //this.$message.success(results.data.resultmessage)
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },

    /****************************************借出方法*******************************/
    // 借出查询
    search() {
      var jsonArr2 = {
        where: this.searchData,
        order: "djdate desc"
      };
      var json = {
        json: JSON.stringify(jsonArr2)
      };

      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetGeneralBorrowOutList",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results.data)

          this.mawbData = results.data;
          this.mawbData.forEach(i => {
            //console.log(i.jydate[0])
            //  i.jydate=dateFormat(i.jydate,'yyyy-MM-dd HH:mm')
            i.jystatus = i.jystatus == "1" ? "未借" : "已借";
            if (i.status == "1") {
              i.status = "可用";
            } else if (i.status == "2") {
              i.status = "已领用";
            } else if (i.status == "3") {
              i.status = "已制单";
            } else if (i.status == "4") {
              i.status = "不可用";
            } else if (i.status == "5") {
              i.status = "作废";
            }
          });
          console.log(this.mawbData);
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          }
        })
        .catch(errors => {});
    },
    /****************************************寄出方法*******************************/
    bOutSearch() {
      //寄出查询
      var jsonArr2 = {
        where: this.sendSearchData,
        order: "djdate desc"
      };
      var json = {
        json: JSON.stringify(jsonArr2)
      };

      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetGeneralBorrowOutJcList",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results.data)
          this.sendTableData = results.data;

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          }
        })
        .catch(errors => {});
    },

    reset() {
      this.inputModelData = {};
    },

    closeDialog() {
      if (this.visible) {
        this.$emit("update:visible", false);
      }
    }
  },
  watch: {},

  created() {},
  computed: {}
};
</script>


<style scoped lang="less">
</style>
