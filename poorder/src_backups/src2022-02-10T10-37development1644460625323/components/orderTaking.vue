

<template>
  <div>
    <!-- {{inputModelData}}-->
    <!-- {{searchData}} -->
    <!-- {{isDclBz}} -->
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :chinese-where.sync="chineseWhere"
        :pageshow.sync="pageshow"
        :pagetype="1"
      ></newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <!-- <el-button   @click="handleO('all')">批量受理</el-button>
        <el-button   @click="backO('all')">批量退回</el-button>-->
      </div>
    </div>
    <!--          <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
                <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="80%">
  <submissionStl></submissionStl>
    </el-dialog>-->
    <!-- -->
    <div>
      <el-dialog :visible.sync="cancelVisible" width="800px" top="4%" v-if="cancelVisible" center>
        <!-- {{abandonReason}} -->
        <cancelReason
          :jobData="tableDataRes[putIndex]"
          :abandonReason.sync="abandonReason"
          :pagetype="1"
          :visible.sync="cancelVisible"
        >
          <template slot="footerBtngroup">
            <el-button type="primary" @click="backO('single',putIndex)">确定</el-button>
            <el-button @click="cancelVisible=false;putIndex=-1;abandonReason=''">取消</el-button>
          </template>
        </cancelReason>
      </el-dialog>
    </div>

    <tableCompt
      :name="isDclBz?'cabinUnconfirmed.vue':name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      :chinese-where.sync="chineseWhere"
      :showZiConfig="true"
    >
      <!-- <template slot="checkbox" slot-scope="props">
        <input type="checkbox"  :value="props.data.index" v-model="guidAll">
      </template>-->
      <!-- <template slot="backO" slot-scope="props"><i class="el-icon-error" @click="backO('single',props.data.index)" style="color:#f00;font-size:16px;" title="退回"></i></template> -->

      <template slot="backO" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.area==conditionalAreaForBuild&&props.data.row.ordersystem!='国内服务'}">
          <i
            class="el-icon-error"
            @click="putIndex=props.data.index;cancelVisible=true"
            style="color:#f00;font-size:16px;"
            title="退回"
          ></i>
        </span>
      </template>
      <template slot="handleO" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.area==conditionalAreaForBuild&&props.data.row.ordersystem!='国内服务'}">
          <i
            class="el-icon-success"
            @click="handleO('single',props.data.index)"
            style="color:#3c9;font-size:16px;"
            title="受理"
            v-if="props.data.row.islocal!=1||props.data.row.isreject!=1"
          ></i>
        </span>
      </template>
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

    <el-dialog
      v-if="dialogShow"
      title="外部订单受理"
      center
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
      :visible.sync="dialogShow"
    >
      <mawbaddput
        :mawbguid="mawbguid"
        :area="area"
        :boguid="boguid"
        :orderdom="orderdom"
        :pagetype="2"
        @update="delIndex"
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
import {
  searCondition,
  getChangeValue,
  formatDate
} from "../api/localStorage.js";
export default {
  name: "orderTaking",
  components: {},
  data() {
    return {
      name: "orderTaking.vue",
      dialogVisible: false,
      orderCancel: false, //撤单弹窗
      area: "",
      dialogShow: false,
      mawbguid: null,
      boguid: null,
      orderdom: "",
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
      searchData: {},
      pageshow: true,
      tableDataRes: [],
      ziTableData: [],
      cancelVisible: false,
      mawbMakeVisible: false,
      complexSearchMawbVisible: false,
      costDetailVisible: false,
      certificateMakingVisible: false,
      selectTableIndex: "", //选择table索引(受理退回此记录去除)
      chineseWhere: [],
      putIndex: -1,
      abandonReason: ""
    };
  },
  methods: {
    search() {
      this.tableDataRes = [];
      this.ziTableData = [];
      //var jsonArr=searCondition(this.inputViewData)

      var jsonArr2 = {
        where: this.searchData,
        order: "hbrq asc,adddate asc"
        // skip:"0",
        // take:"10",
        // top:"10",
      };
      var json = { json: JSON.stringify(jsonArr2) };
      var url="api/ExHpoboAxplineExternalGeneral";

          // if(this.name == "orderTakingOverDate.vue")
          // { 
          //   // let parid= this.$store.state.navDataById[this.$route.params.id].ready01
          //   // let autname= JSON.parse(sessionStorage.nav).find(i=>i.id==parid).autname
          //   if(autname.includes('本站')){
          //     url ="api/ExHpoboAxplineLocalGeneral"
          //   }
          // }
          if(this.isDclBz){
            url ="api/ExHpoboAxplineLocalGeneral"
          }

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + url,
        params: json,
        loading: true,
        tip: true
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          //results.data[0].profitmode="co-load"
         // let data = getChangeValue(results.data, "空出");
        setTimeout(() => {
          this.tableDataRes = getChangeValue(results.data, "空出").map(i => {
            if (i.childguid>-1) {
              i.checkDisabled = true;
            }
            return i;
          });
        }, 0);


      
        })
        .catch(errors => {});
    },
    reset() {
      // this.inputModalData={ddly:[],bglx:[],hwxz:[]};
      this.inputModelData = { status: "AO5010,AO5025" };
    },

    backO(type, index) {
      //退回
      if (type == "single") {
        //单条退回
        let guid = String(this.tableDataRes[index].boguid);
        var routedelreason = {
          reasontype: "外站驳回",
          delbillreason: this.abandonReason,
          delbillman: localStorage.usrname,
          delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
          area: this.area
        };
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAxplineAcceptance",
          data: {
            boguid: guid,
            status: "200",
            routedelreason: JSON.stringify(routedelreason)
          },
          loading: true
        }).then(results => {
          ////console.log(results.data)
          if (results.data.resultstatus == 0) {
            this.$message.success("更新成功");
            this.tableDataRes.splice(index, 1);
            this.cancelVisible = false;
            this.putIndex = -1;
            this.abandonReason = "";
            //this.search()
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
        //alert(index)
      } else if (type == "all") {
        //多条退回
        if (this.guidAll.length == 0) {
          this.$message.error("请选择订单");
        } else {
          var items = [];
          ////console.log(this.guidAll.join(','))
          this.guidAll.forEach(item => {
            items.push(this.tableDataRes[item].boguid);
          });
          var guids = items.join(",");
          //console.log(guids)
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExAxplineAcceptance",
            data: { boguid: guids, status: "200" },
            loading: true
          }).then(results => {
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              var nowTableData = [];
              this.$message.success("更新成功");
              this.cancelVisible = false;
              this.putIndex = -1;
              this.abandonReason = "";

              this.tableDataRes.forEach(item => {
                if (items.indexOf(item.boguid) == -1) {
                  nowTableData.push(item);
                }
              });
              //console.log(nowTableData)
              this.tableDataRes = nowTableData;
              //this.tableDataRes=[]

              //this.search()
            } else {
              this.$message.error(results.data.resultmessage);
            }
            this.guidAll = [];
          });
        }
      }
    },

    handleO(type, index) {
      //受理
      if (type == "single") {
        //单条受理
        //let guid=this.tableDataRes[index].guid
        //alert(index)
        let guid = String(this.tableDataRes[index].boguid);
        if (
          this.tableDataRes[index].islocal == 1 &&
          this.tableDataRes[index].isreject == 1
        ) {
          this.$message.error("不能受理！");
          return;
        }
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAxplineAcceptance",
          data: { boguid: guid, status: "100" },
          loading: true
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success("更新成功");
            this.tableDataRes.splice(index, 1);
            //this.search()
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      } else if (type == "all") {
        //多条受理

        if (this.guidAll.length == 0) {
          this.$message.error("请选择订单");
        } else {
          var items = [];
          var ifPiShouli = true;
          // console.log(this.guidAll)
          this.guidAll.forEach(item => {
            items.push(this.tableDataRes[item].boguid);
          });
          this.tableDataRes.forEach(item => {
            if (item.islocal == 1 && item.isreject == 1) {
              ifPiShouli = false;
            }
          });

          if (!ifPiShouli) {
            this.$message.error("不能批量受理！");
            return;
          }

          var guids = items.join(",");
          ////console.log(guids)
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExAxplineAcceptance",
            data: { boguid: guids, status: "100" },
            loading: true
          }).then(results => {
            if (results.data.resultstatus == 0) {
              var nowTableData = [];
              this.$message.success("更新成功");
              this.tableDataRes.forEach(item => {
                if (items.indexOf(item.boguid) == -1) {
                  nowTableData.push(item);
                }
              });
              this.tableDataRes = nowTableData;
              //this.search()
            } else {
              this.$message.error(results.data.resultmessage);
            }
            this.guidAll = [];
          });
        }
      }
    },

    //选中多选框
    getGuid(index) {
      //console.log(this)

      this.guidAll.push(index);
    },

    //获得
    getZimessage(msg) {
      this.getHawbList(msg);
    },

    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.area = this.tableDataRes[indexData].area;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.dialogShow = true;
      //console.log(this.dialogShow)
      //alert('1')
    },

    delIndex(data) {
      if (data.nodel == "2") {
        this.tableDataRes.splice(this.selectTableIndex, 1);
      }
      this.dialogShow = false;
    }
  },
  created() {
  // console.log(this.$route.params)
  if(this.name=='orderTakingOverDate.vue'){
    this.$set(this.inputViewData,'hbrq',{
          title: "航班日期",
          type: 15,
          defaultEnd: true,
          endtype: 5
        })
  }
  },
  mounted() {

  },
  watch: {
    locale(val) {
      //console.log(val)
      this.$i18n.locale = val;
    }
  },
  computed: {
    isDclBz(){//是否是预期待处理本站
          if(this.name == "orderTakingOverDate.vue")
          { 
            return JSON.parse(sessionStorage.nav).find(i=>i.id==this.$route.params.id).autcode=="SH_POMANAGEMENT_PAGE_ORDERTAKINGOVERDATELOCAL"
          }
          return false
    },
    guidAll: {
      get() {
        var arr = [];
        this.tableDataRes.forEach((i, index) => {
          if (i.checked) {
            arr.push(index);
          }
        });
        return arr;
      },
      set() {}
    }
  }
};
</script>
<style>

</style>
