<template>
  <div class="cost-confirmationhx">
    <div class="page-container-box">
      <!-- {{inputModelData}}
      {{searchData}} -->
      <newSearchComp
        :name="'costConfirmation.vue'"
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
      </div>
    </div>

    <tableCompt
      ref="tableComponet"
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      @transmitMsg="getZimessage"
      :ziTableData="ziTableData"
      showZiConfig
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere"
      @rightF="contextMenuFn"
      @wageConfirmStatus="openAirPlane"
      :explainInfoArr="explainInfoArr">
            <template slot="operate" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.checkDisabled}">
          <i class="el-icon-back" title="撤单" style="color:red" @click="orderCancel=true,selectTableIndex=props.data.index"></i>
        </span>
      </template>
    </tableCompt>

  <!-- 撤单 -->
      <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" dom=6 :inputModelData="tableDataRes[selectTableIndex]"  @success="tableDataRes.splice(selectTableIndex, 1)"></cancelOper>


    <!-- 主菜单右键 -->
    <el-card
      class="box-card"
      v-if="contextMenuVisible"
      :style="{'position':'fixed','left':contextMenuPosition.left,'top':contextMenuPosition.top,'width':'200px','zIndex':'999999999'}">
      <p @click="costConfirmDialogVisible = true">应付运费批量确认</p>
    </el-card>

    <el-dialog
      :title="costConfirmDialogTitle"
      :visible.sync="costConfirmDialogVisible"
      :close-on-click-modal="false">
      <costConfirmhxPage :rowData="rowData" :visible.sync="costConfirmDialogVisible"></costConfirmhxPage>
    </el-dialog>

    <el-dialog
      title="航线费用修改及确认"
      v-if="airPlaneDialogVisible"
      center
      :visible.sync="airPlaneDialogVisible"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false" >
      <airPlaneDeatil :boguid="boguid" :visible.sync="airPlaneDialogVisible" :activeTab="airPlaneDeatilActiveTab" @rowDataUpdate="rowDataUpdate"></airPlaneDeatil>
    </el-dialog>

    <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
  </div>
</template>

<script>
import { searCondition, reset, filterGroupid, getChangeValue } from '../api/localStorage.js'
import costConfirmhxPage from './orderDetails/costConfirmhxPage'
import airPlaneDeatil from './orderDetails/airPlaneDeatil'// 备注
import {systemCheck, openZimessage} from '@/components/mixins/topPageMixin'

export default {
  name: 'kfCancel',
  mixins:[openZimessage],
  components: { costConfirmhxPage, airPlaneDeatil },
  data () {
    return {
      name: 'kfCancel.vue',
      resultData: [],
      dataGrouping: {},
      airPlaneDialogVisible: false,
      boguid: '',
      airPlaneDeatilActiveTab: '',
      contextMenuVisible: false,
      contextMenuPosition: {
        left: '',
        top: ''
      },
      mawbguid: '', // 费用制作详细参数
      boguid: '', // 费用制作详细参数
      isBackShow: { value: false },
      inputViewData: {
        canceltype: { title: '撤单类型', type: 5, whereStr: 'in', groupid: 135, disabled: true },
        cancelman: { 'title': '撤单人', type: 1, disabled: true },
       // status: { 'title': '订单状态', type: 5, dom: '订单状态', system: '空出', 'whereStr': 'in',hidden: true  },
        hbrq: { title: "航班日期", type: 15, defaultEnd: true },
        adddate: { title: "创建日期", type: 15, defaultVal: false }
      },
      inputModelData: {
        // status: 'AO5060'
        confirmstatus: '1'
      },
      rowDataIndex: '',
      costConfirmDialogVisible: false,

      explainInfoArr: [{
        title: '航班号',
        field: 'hbh'
      }, {
        title: '航班日期',
        field: 'hbrq'
      }, {
        title: '预报',
        field: 'ybjzt'
      }, {
        title: '实际',
        field: 'realjzt'
      }, {
        title: '制单',
        field: 'zdjzt'
      }, {
        title: '配载方式',
        field: 'loadingmodel'
      }, {
        title: '分隔符',
        field: 'splitstring'
      }, {
        title: '交接地',
        field: 'terminalname'
      }, {
        title: '舱位性质',
        field: 'shipacexz'
      }, {
        title: '舱位内容',
        field: 'pzcontent'
      }],
      orderCancel:false,
      selectTableIndex:-1
    }

  },
  computed: {
    rowData () {
      return this.resultData[this.rowDataIndex] || {hbh: '', hbrq: ''}
    },
    costConfirmDialogTitle () {
      return `应付运费批量确认   航班号: ${this.rowData.hbh}   航班日期: ${this.rowData.hbrq.substring(0, 10)}`
    }
  },
  watch: {
    contextMenuVisible (val) {
      if (val) {
        document.body.addEventListener('click', this.closeContextMenu)
      } else {
        document.body.removeEventListener('click', this.closeContextMenu)
      }
    }
  },
  methods: {
    search () {
      this.$refs.tableComponet.ziTableIndex = -1
      this.tableDataRes = []
      this.ziTableData = []
      var search = JSON.parse(JSON.stringify(this.searchData))
      // search.delbillreason = ''
       search.wagedom = '航线'
      // search.shipaceid = { begin: '0' } // 限制必须要有shipaceid
      search.canceling=1

      var jsonArr2 = {
        where: search,
        'order': 'hbrq asc,qfsj asc'
      }
      var json = { 'json': JSON.stringify(jsonArr2) }

      this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/startCancel', params: json, loading: true, tip: true, nofield: true })
        .then(({ data }) => {
          this.resultData = data
          if (data.length == 0) {
            this.$message('无查询结果'); return
          } else {
            this.pageshow = false
          }

/*           let tableData = []
          let parentGroupData = {}
          let listLength = 0
          data.forEach((item, index) => {
            if (item.list.length === 0) return
            let ybpiece = 0
            let ybweight = 0
            let ybvolume = 0
            let realpiece = 0
            let realweight = 0
            let realvolume = 0
            let zdpiece = 0
            let zdweight = 0
            let zdvolume = 0

            item.list.forEach(mawb => {
              ybpiece += Number(mawb.ybpiece)
              ybweight += Number(mawb.ybweight)
              ybvolume += Number(mawb.ybvolume)
              realpiece += Number(mawb.realpiece)
              realweight += Number(mawb.realweight)
              realvolume += Number(mawb.realvolume)
              zdpiece += Number(mawb.zdpiece)
              zdweight += Number(mawb.zdweight)
              zdvolume += Number(mawb.zdvolume)
            })

            listLength += item.list.length
            parentGroupData[item.list[0].boguid] = {
              index,
              hbh: item.hbh ? item.hbh : '',
              hbrq: item.hbrq ? item.hbrq.substring(0, 11) : '',
              pcstatus: item.list[0].pcstatus,
              shipaceid: item.shipaceid,
              area: item.list[0].area,
              ybjzt: ybpiece + '/' + Number(ybweight).toFixed(2) + '/' + Number(ybvolume).toFixed(3),
              realjzt: realpiece + '/' + Number(realweight).toFixed(2) + '/' + Number(realvolume).toFixed(3),
              zdjzt: zdpiece + '/' + Number(zdweight).toFixed(2) + '/' + Number(zdvolume).toFixed(3),
              qfsj: item.qfsj && item.qfsj.indexOf('1900') == '-1'&& item.qfsj.indexOf('0001') == '-1'? item.qfsj.substring(11, 16) : '',
              loadingmodel: item.loadingmodel ? item.loadingmodel : '', // 配载方式
              splitstring: item.splitstring ? item.splitstring : '', // 分隔符
              terminalname: item.terminalname ? item.terminalname : '', // 交接地
              shipacexz: item.shipacexz ? item.shipacexz : '', // 舱位性质
              pzcontent: item.pzcontent ? item.pzcontent : '', // 舱位内容
              listLength: listLength,
              len: item.list.length
            }
            tableData = tableData.concat(item.list)
          })

          tableData = getChangeValue(tableData, '空出')
 */
          setTimeout(() => {
            //this.tableDataRes = tableData
             this.tableDataRes = getChangeValue(data, '空出')
         //   this.dataGrouping = parentGroupData
          }, 20)
        })
    },
    reset () {
      this.inputModelData = {
        status: 'AO5060'
      }
    },
    // 右键菜单
    contextMenuFn (data) {
      if (data.type === '2') {
        this.contextMenuVisible = false
        return
      }

      let decreaseTop = 0
      // 如果右键点击的位置在底部会被挡住
      if (data.top >= document.body.offsetHeight - 52) {
        decreaseTop = 52
      }

      this.contextMenuVisible = true
      this.contextMenuPosition.left = data.left + 'px'
      this.contextMenuPosition.top = data.top - decreaseTop + 'px'
      this.rowDataIndex = data.rowData.index
    },
    closeContextMenu () {
      this.contextMenuVisible = false
    },
    openAirPlane (boguid, wageinout) {
      this.boguid = boguid
      this.airPlaneDialogVisible = true
      this.airPlaneDeatilActiveTab = wageinout
    },
    rowDataUpdate (data) {
      console.log(data)
      for (let item of this.tableDataRes) {
        if (item.boguid === data.boguid) {
          item.confirmstatus_in = data.confirmstatus_in || item.confirmstatus_in
          item.wageall_in = data.wageall_in || item.wageall_in
          item.confirmstatus_out = data.confirmstatus_out || item.confirmstatus_out
          item.wageall_out = data.wageall_out || item.wageall_out
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cost-confirmationhx {
  /deep/.el-card__body{
    padding:10px 0 10px;
    p{
      height:30px;
      line-height:30px;
      cursor:pointer;
      text-indent:0.5em;
      &:hover{
        background:#9cd7ff;
        color:#fff;
      }
      i{
        margin-right:10px;
        font-size:14px;
      }
    }
    .disabled{
      &:hover{
        background:#c0c4cc;
        color:#333;
      }
    }
  }
}
</style>
