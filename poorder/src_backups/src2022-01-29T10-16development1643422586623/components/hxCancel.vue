<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync='pageshow'
        :pagetype="1"
        :chinese-where.sync="chineseWhere">
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <template v-if="btnGroupShow">
          <el-button @click="costControlDialog=true">批量成本分摊</el-button>
          <el-button @click="shareRecordDialog=true">批量成本分摊记录</el-button>
        </template>
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      @transSelIndex="openDialog"
      :nestedTableType="2"
      @transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      showZiConfig
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere">
       <template slot="operate" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.checkDisabled}">
          <i class="el-icon-back" title="撤单" style="color:red" @click="orderCancel=true,selectTableIndex=props.data.index"></i>
        </span>
      </template>
      <!-- <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)" :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template> -->

    </tableCompt>
  <!-- 撤单 -->
      <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" dom=7 :inputModelData="tableDataRes[selectTableIndex]"  @success="tableDataRes.splice(selectTableIndex, 1)"></cancelOper>

    <!-- 总单费用制作非合并 -->
    <el-dialog
      title="费用未确认(本站订单)"
      :visible.sync="costMakingVisible"
      width="100%"
      top="0"
      v-if="costMakingVisible"
      @close="uncostMaking"
      :close-on-press-escape="false"
      class="dialogPage"
      :modal="false"
      center>
      <!-- <costmakingkf :showSuggestWage="true" :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmakingkf> -->

      <costmaking :showSuggestWage="true" :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" costDom="客服" ref="costDialog"></costmaking>
    </el-dialog>

    <el-dialog :visible.sync="costControlDialog" title="批量成本分摊" width="90%" top="4%" center v-if="costControlDialog" :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
      </span>
      <costControlTool></costControlTool>
    </el-dialog>

    <el-dialog :visible.sync="shareRecordDialog" width="90%" title="批量成本分摊记录" top="4%" center v-if="shareRecordDialog" :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
      </span>
      <shareRecord></shareRecord>
    </el-dialog>

    <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
import { searCondition, reset, filterGroupid, getChangeValue } from '../api/localStorage.js'
//import costmakingkf from './orderDetails/costMakingkf'
import {systemCheck, openZimessage} from '@/components/mixins/topPageMixin'


export default {
  name: 'hxCancel',
   mixins:[openZimessage],
  components: {  },
  data () {
    return {
      name: 'hxCancel.vue',
      mawbguid: '', // 费用制作详细参数
      boguid: '', // 费用制作详细参数
      costMakingVisible: false,
      isBackShow: { value: false },
      inputViewData: {
        canceltype: { title: '撤单类型', type: 5, whereStr: 'in', groupid: 135, disabled: true },
        cancelman: { 'title': '撤单人', type: 1, disabled: true },
       // status: { 'title': '订单状态', type: 5, dom: '订单状态', system: '空出', 'whereStr': 'in', hidden: false },
        hbrq: { title: "航班日期", type: 15, defaultEnd:true },
        adddate: { title: "创建日期", type: 15, defaultVal: false }
      },
      inputModelData: {
        // status: 'AO5060'
        confirmstatus: '1'
      },
      selectedTableIndex: '',
      costControlDialog: false, // 批量分摊弹窗
      shareRecordDialog: false,
      orderCancel:false,
      selectTableIndex:-1
    }
  },
  computed: {
    btnGroupShow () {
      // 客服确认隐藏这两个按钮
      return false
    }
  },
  methods: {
    search () {
      this.tableDataRes = []
      this.ziTableData = []
      var search = JSON.parse(JSON.stringify(this.searchData))
      // search.delbillreason = ''
       search.wagedom = '客服'
      search.canceling = 2

      var jsonArr2 = {
        where: search,
        'order': 'hbrq asc,qfsj asc'
      }
      var json = { 'json': JSON.stringify(jsonArr2) }

      this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/startCancel', params: json, loading: true, tip: true })
        .then(({ data }) => {
          console.log(data)
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
    reset () {
      this.inputModelData = {
        status: 'AO5060'
      }
    },
    openDialog (indexData) {
      this.selectedTableIndex = indexData
      this.mawbguid = this.tableDataRes[indexData].guid
      this.boguid = this.tableDataRes[indexData].boguid
      this.costMakingVisible = true
    },
    uncostMaking () {
      this.costMakingVisible = false

      // 重新计算应收应付金额
      this.tableDataRes[this.selectedTableIndex].wageall_in = this.$refs.costDialog.zdtotalCharge
      this.tableDataRes[this.selectedTableIndex].wageall_out = this.$refs.costDialog.zdtotalPayment
      this.tableDataRes[this.selectedTableIndex].wageprofit = Number(Number(this.$refs.costDialog.zdtotalCharge) - Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
    }
  }
}
</script>
