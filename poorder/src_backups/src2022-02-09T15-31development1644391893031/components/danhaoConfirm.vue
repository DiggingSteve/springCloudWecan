<template>
  <div>
    <div class="page-container-box">
      <!-- {{peicangGuidArr}} -->
      <!-- {{selectTableIndex}} -->
      <!--   {{inputModelData}}
        {{searchData}}
      {{chineseWhere}}-->
      <!-- {{mawbguid}}-->
      <!-- {{ziTableData}} -->
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
            <template slot="operate" slot-scope="props">
                <el-badge is-dot class="item"   v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "    :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
                  <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
            </el-badge>
            </template> 
    </tableCompt>

    <el-dialog v-if="dialogShowDh" title="单号确认" center :visible.sync="dialogShowDh" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false"
      style="min-height:600px">
      <confirmDetail :mawbdetail="tableDataRes[selectTableIndex]" :visible.sync="dialogShowDh" pagetype="1"
        :showHawb="showHawb" dom="1"></confirmDetail>
    </el-dialog>

    <el-dialog title="综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :pagetype="20" :mawbguid="mawbguid" :boguid="boguid"
        :area="area" :orderdom="orderdom"></mawbaddput>
    </el-dialog>

  </div>
</template>
<script>
  import confirmDetail from "./orderDetails/confirmDetail";
  import { openZimessage, searchCmptMixins} from "@/components/mixins/topPageMixin";

  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate,
    getValByGrouid
  } from "../api/localStorage.js";

  export default {
    name: "danhaoConfirm",
    components: {
      confirmDetail
    },
    props:{
    monitor:{
      type:[String,Number],
      default:'1'
    }
  },
    mixins: [openZimessage, searchCmptMixins],
    data() {
      return {
        name: "danhaoConfirm.vue",
        dialogShow:false,
        dialogShowDh: false,
        inputViewData: {
          hbrq: {
            title: "航班日期",
            type: 15,
            titleStyle: { minWidth: "100px" },
            defaultVal: true
          },
          dzconfirmstatus: {
            title: "单证确认状态",
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
          noconfirmstatus: "1"
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
        console.log(data.index);
        console.log(data.row);
      },
                  openChatRoome(row){
                //this.$emit('openChatRoome',obj)
                //从表格列表项进入 使用下面代码
                this.$store.commit("setChat", { status: true, data: row });
            },
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };

        if (!this.searchData.dzstatus) {
          this.searchData.dzstatus = { begin: 200 };
        }

        var json = { json: JSON.stringify(jsonArr2) };

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
        this.dialogShowDh = true;
      }
    },
    watch: {},
    mounted(){
      this.$watch(()=>{
      return this.monitor
      },(val)=>{
        if(val=='1'){
          this.inputModelData={noconfirmstatus:'1'}
          this.inputViewData.noconfirmstatus.disabled=true
          this.inputViewData.hbrq.defaultVal=false
        }else{
          this.inputModelData={noconfirmstatus:'2'}
          this.inputViewData.hbrq.defaultVal=true
        }
      },{immediate:true})
    },
    created() { },
    computed: {}
  };
</script>


<style scoped lang="less">
</style>