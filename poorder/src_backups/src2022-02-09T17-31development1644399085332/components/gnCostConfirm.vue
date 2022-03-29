<template>
  <div>
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere"
        @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" @transSelIndex="openDialog2" :nestedTableType="2"
      @transmitMsg="getZimessage" :ziTableData="ziTableData" showZiConfig :showTotal="showTotal"
      :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog">
    </tableCompt>

    <!-- 总单费用制作非合并 -->
    <el-dialog title="费用未确认(本站订单)" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
      <!-- <costmakingkf :showSuggestWage="true" :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmakingkf> -->
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" initiator="10">
      </costmaking>
    </el-dialog>
    <el-dialog title="客服综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" pagetype='20' :mawbguid="mawbguid" :boguid="boguid" :area="area"
        :orderdom="orderdom"></mawbaddput>
    </el-dialog>

    <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
  import { searCondition, filterGroupid, getChangeValue } from '../api/localStorage.js'
  //import costmakingkf from './orderDetails/costMakingkf'
  import { systemCheck, openZimessage, searchCmptMixins } from '@/components/mixins/topPageMixin'


  export default {
    name: 'gnCostConfirm',
    mixins: [systemCheck, openZimessage, searchCmptMixins],
    components: { },
    props: {
      isMonitor: {//是否是订单监控页面
        type: Boolean,
        default: false
      },
      pagetype: {
        type: [String, Number],
        default: 1 //1正常未确认 2 已驳回未确认
      }
    },
    data() {
      return {
        name: 'gnCostConfirm.vue',
        costMakingVisible: false,
        isBackShow: { value: false },
        inputViewData: {
          hbrq: { title: "航班日期", type: 15, defaultVal: false, defaultEnd: true, endtype: 3 },
        },
        inputModelData: {
          confirmstatus: '1'
        },
        selectedTableIndex: '',
      }
    },
    computed: {

    },
    methods: {
      search() {
        this.tableDataRes = []
        this.ziTableData = []
        var search = JSON.parse(JSON.stringify(this.searchData))
        // search.delbillreason = ''
        search.wagedom = '客服'

        var jsonArr2 = {
          where: search,
          'order': 'hbrq asc,qfsj asc'
        }
        var json = { 'json': JSON.stringify(jsonArr2), routerName: this.name.split('.')[0] }

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoServiceGeneral', params: json, loading: true, tip: true })
          .then(({ data }) => {
            // console.log(data)
            if (data.length == 0) {
              this.$message('无查询结果'); return
            } else {
              this.pageshow = false
            }
            setTimeout(() => {
              this.tableDataRes = getChangeValue(data, "空出");
            }, 0)
          })
      },
      // reset () {
      //   this.inputModelData = {
      //     status: 'AO5060'
      //   }
      // },
      openDialog(indexData) {
        this.selectedTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.costMakingVisible = true
      },
      openDialog2(indexData) {

        this.selectTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.orderdom = this.tableDataRes[indexData].orderdom
        this.area = this.tableDataRes[indexData].area
        this.dialogShow = true

      },
      uncostMaking() {
        this.costMakingVisible = false

        // 重新计算应收应付金额
        this.tableDataRes[this.selectedTableIndex].wageall_in = this.$refs.costDialog.zdtotalCharge
        this.tableDataRes[this.selectedTableIndex].wageall_out = this.$refs.costDialog.zdtotalPayment
        this.tableDataRes[this.selectedTableIndex].wageprofit = Number(Number(this.$refs.costDialog.zdtotalCharge) - Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
      }
    },
    created() {
      if (this.isMonitor) {
        this.$set(this.inputModelData, "status", "AO5060");
        this.inputViewData.hbrq = {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          defaultEnd: true,
          endtype: 3,
        };
      } else {
        this.inputModelData.status = this.pagetype == '1' ? 'AO5060,AO5065' : 'AO5060,AO5070,AO5090'

      }
    }
  }
</script>