
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
      @transSelIndex="openDialog"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      showZiConfig
      :showTotal="showTotal"
    >
    </tableCompt>

    <el-dialog
      title="签单申请"
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
        :pagetype="13"
        :mawbguid="tableDataRes[selectTableIndex].guid"
        :boguid="tableDataRes[selectTableIndex].boguid"
        :area="tableDataRes[selectTableIndex].area"
        :orderdom="tableDataRes[selectTableIndex].orderdom"
      ></mawbaddput>
    </el-dialog>
  </div>
</template>
<script>
import { getChangeValue } from "../api/localStorage.js";

import { systemCheck , openZimessage, searchCmptMixins} from "@/components/mixins/topPageMixin";

export default {
  name: "applicationDocuments",
  props:{
    monitor:{
      type:String,
      default:'1'
    }
  },
  mixins: [systemCheck, openZimessage, searchCmptMixins],
  components: {},
  data() {
    return {
      name: "applicationDocuments.vue",
      inputViewData: {
        // hbrq: {
        //   title: "航班日期",
        //   type: 15,
        //   titleStyle: { minWidth: "100px" },
        //   defaultVal: true
        // }
      },
      inputModelData: {
        //dzstatus: "AO0020"
      },
    };
  },

  methods: {

    search() {
      this.tableDataRes = [];
      this.ziTableData = [];
      if(this.monitor=='1'){
        this.searchData.status={less:500}
      }
      //this.searchData.dzstatus = { in: 100 };
      // this.searchData.hwstatus={in:400}
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      var json = { json: JSON.stringify(jsonArr2) };
      //ExHpoboAxplineGeneral
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineCommitBill",
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
        .catch(errors => {});
    },

    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.dialogShow = true;
    }
  },
  mounted(){
  this.$watch(()=>{
  return this.monitor
  },(val)=>{
    if(val=='1'){
      this.inputModelData={dzstatus:'AO0020'}
      this.inputViewData.dzstatus.disabled=true
    
      this.inputViewData.hbrq.defaultVal=false

      console.log(this.inputViewData)
      
    }else{
       this.inputModelData={dzstatus:'AO0030'}
       this.inputViewData.hbrq.defaultVal=true
    }
  },{immediate:true})
  },
  watch: {},

  created() {
    
  },
  computed: {}
};
</script>


<style scoped lang="less">
</style>
