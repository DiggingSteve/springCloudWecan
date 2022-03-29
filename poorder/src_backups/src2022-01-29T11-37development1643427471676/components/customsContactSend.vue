
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

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      :expansionSubShow="false"
      @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage"
      v-on:transAmsMsg="transAmsMsg"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      showZiConfig
      :showTotal="showTotal"
    >
     <template slot="operate" slot-scope="props"><span  class="el-icon-edit" style="color:green;cursor:pointer" title="海关联系单" @click="openDialog(props.data.index,2)"></span></template>
     <template slot="customstatus" slot-scope="props"><span :style="{color:props.data.value=='发送失败'?'red':(props.data.value=='未发送'?'':'green')}">{{props.data.value}}</span></template>
      <template slot="print" slot-scope="props" >
        <span :class="{spanDisabled:props.data.row.customstatus=='未发送'}">
        <i
          class="el-icon-printer"
          title="打印海关联系单"
          :style="{color:props.data.row.customstatus=='未发送'?'':'green'}"
          @click="printFunc(props.data.row)"
        ></i>
        </span>
      </template>
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <el-dialog
      title="海关联系单"
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
      <confirmDetail
        :mawbdetail="tableDataRes[selectTableIndex]"
        :visible.sync="dialogShow"
        :customstatus="customstatus"
        pagetype="2"
      ></confirmDetail>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPcd"
      class="dialogImgDoc"
      v-if="dialogPcd"
      width="1200px"
      top="1%"
    >
      <iframe
        :src="pcdUrl"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"
      ></iframe>
    </el-dialog>

    <el-dialog
      title="综合查询"
      v-if="dialogPono"
      center
      :visible.sync="dialogPono"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="dialogPono"
        :pagetype="20"
        :mawbguid="tableDataRes[selectTableIndex].guid"
        :boguid="tableDataRes[selectTableIndex].boguid"
        :area="tableDataRes[selectTableIndex].area"
        :orderdom="tableDataRes[selectTableIndex].orderdom"
      ></mawbaddput>
    </el-dialog>
  </div>
</template>
<script>
import confirmDetail from "./orderDetails/confirmDetail";

import { getChangeValue } from "../api/localStorage.js";
import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

export default {
  name: "customsContactSend",
  props:{
    monitor:{
      type:String,
      default:'1'
    }
  },
  mixins: [openZimessage, searchCmptMixins],
  components: {
    confirmDetail
  },
  data() {
    return {
      name: "customsContactSend.vue",
      dialogShow: false,
      dialogPono: false,
      dialogPeicang: false,
      addPcShow: false,
      pcdUrl: "",
      dialogPcd: false,
      mawbguid: null,
      boguid: null,
      area: "",
      customstatus: "",
      inputViewData: {
          pcstatus: {
          title: "配舱状态",
          type: 5,
          dom: "配舱状态",
          whereStr: "in",
          fieldtype: 5,
          hideLabel:['已交接']
        },
          dzstatus: {
          title: "单证状态",
          type: 5,
          dom: "单证状态",
          system: "空出",
          whereStr: "in",
          fieldtype: 5,
          hideLabel:['上榜未确认']
        },
      },
      inputModelData: {
        //  "status": "AO5020,AO5030,AO5040,AO5050,AO5025"
        customstatus: "1"
      },
      mawbinfo: {},
      selectTableIndex: -1,
      putIndex: -1 //点击打开展开分单索引
    };
  },

  methods: {
    search() {
      if (
        this.$store.state.ifLimitSearch &&
        Object.keys(this.searchData).length == 0
      ) {
        return this.$message.error("请输入或选择查询条件！");
      }
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/EXhpoAxpline",
        params: { times: 2 },
        loading: true,
        tip: false
      }).then(results => {
        this.tableDataRes = [];
        this.ziTableData = [];

        if(!this.searchData.pcstatus&&this.monitor=='1'){
          this.searchData.pcstatus={less:400}
          this.searchData.status={less:500}
        }
          if(!this.searchData.dzstatus){
          this.searchData.dzstatus={begin:2}
        }
        this.searchData.area="上海";

        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };

        jsonArr2.where.canceling = 0;
        var json = { json: JSON.stringify(jsonArr2) };
        //ExHpoboAxplineGeneralCustoms  //ExHpoboAxplineGeneral
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
              /*   this.tableDataRes=results.data.map(i=>{
                           if(!i.mawb||i.hbh){
                             i.checkDisabled=true;
                           }
                             return i
                        }) */
            }, 0);
          })
          .catch(errors => {});
      });
    },

    getHawbList(msg) {
      this.putIndex = msg.index;
      //获取分单列表
      this.ziTableData = [];
      let guid = this.tableDataRes[msg.index].guid;
      let json = { hpoid: guid };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/GetDeclByHpoid",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
        //  //console.log("分单列表")
        //   //console.log(JSON.stringify(this.ziTableData))
        if (results.data.length == 0) {
          this.$message("无查询结果！");
          return;
        } else {
          results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            this.ziTableData = results.data;
          }, 20);
        }
      });
    },
    // reset() {
    //   // reset(this.inputViewData)
    //   this.inputModelData = {
    //     status: "AO5040,AO5020,AO5060,AO5090,AO5030,AO5050"
    //   };
    // },
    openDialog(indexData, type) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.area = this.tableDataRes[indexData].area;
      this.customstatus = this.tableDataRes[indexData].customstatus;
      //console.log(this.mawbguid)
      if (type == 2) {
        this.dialogShow = true;
      } else {
        this.dialogPono = true;
      }
    },

    transAmsMsg(data) {
      return;
      console.log(data.row);
      this.mawbinfo = data.row;
      this.mawbguid = data.row.hpoid;
      this.area = data.row.area;
      //console.log(this.mawbguid)
      this.dialogShow = true;
    },
    printFunc(data) {
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/GetDeclGuidByHpoid",
        params: { hpoid: data.guid },
        loading: false,
        tip: false
      }).then(results => {
        console.log(results.data);

        if (data.orderdom == "总单") {
          if (!results.data) {
            return this.$message.error("无数据！");
          }
          this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=CustomsFDReport.frx&guid=${results.data}&area=${data.area}&shipaceid=-1`;
          this.dialogPcd = true;
        } else {
          this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=CustomsZDReport.frx&guid=${data.guid}&area=${data.area}&shipaceid=-1`;
          this.dialogPcd = true;
        }
      });
    }
  },
  watch: {
  },

  mounted(){
  this.$watch(()=>{
  return this.monitor
  },(val)=>{
    if(val=='1'){
      this.inputModelData={customstatus:'1'}
      this.inputViewData.customstatus.disabled=true
      this.inputViewData.hbrq.defaultVal=false
    }else{
       this.inputModelData={customstatus:'2,5,6,10,4'}
       this.inputViewData.hbrq.defaultVal=true
    }
  },{immediate:true})
  },

  created() {},
  computed: {}
};
</script>


<style scoped lang="less">

</style>
