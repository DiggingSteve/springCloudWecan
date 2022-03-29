<template>
  <div class="cost-confirmationhx">
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere"
        @reset="reset">
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>

       

      </div>
    </div>

    <tableCompt ref="tableComponet" :name="name" :table-data-res="tableDataRes" :nestedTableType="2"
      @transmitMsg="getZimessage" @transSelIndex="openDialog" :ziTableData="ziTableData" showZiConfig
      :showTotal="showTotal" :dataGrouping="dataGrouping" :expansionSubShow='false' isGroup :isSort="false"
      :isPaging="false" showMargeColumn :chinese-where.sync="chineseWhere" @rightF="contextMenuFn"
      @wageConfirmStatus="openAirPlane" tableWagedom='航线' :explainInfoArr="explainInfoArr">
      <!-- <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)" class="poczColor">{{props.data.value}}</span></template> -->
    <template slot="operate" slot-scope="props">
    <el-badge is-dot class="item"  v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "     :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
    <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
</el-badge>
    </template>
    </tableCompt>

    <!-- 撤单 -->
    <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" dom=6
      :inputModelData="tableDataRes[selectTableIndex]" @success="tableDataRes.splice(selectTableIndex, 1)"></cancelOper>

    <!-- 主菜单右键 -->
    <el-card class="box-card" v-if="contextMenuVisible"
      :style="{'position':'fixed','left':contextMenuPosition.left,'top':contextMenuPosition.top,'width':'200px','zIndex':'999999999'}">
      <p @click="costConfirmDialogVisible = true">批量费用制作应收/付</p>
    </el-card>

    <el-dialog :visible.sync="costConfirmDialogVisible" :close-on-click-modal="false" custom-class="plqr" width="1200px" v-if="costConfirmDialogVisible">
      <costConfirmhxPage :rowData="JSON.parse(JSON.stringify(rowData))" :visible.sync="costConfirmDialogVisible" :dataGrouping="dataGrouping[rowData.list[0]['boguid']]" v-if="rowData.list&&costConfirmDialogVisible"></costConfirmhxPage>
    </el-dialog>

    <el-dialog title="航线费用修改及确认" v-if="airPlaneDialogVisible" center :visible.sync="airPlaneDialogVisible"
      class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px"
      :modal="false">
      <airPlaneDeatil :boguid="boguid" :visible.sync="airPlaneDialogVisible" initiator="20"
        :activeTab="airPlaneDeatilActiveTab" @rowDataUpdate="rowDataUpdate"></airPlaneDeatil>
    </el-dialog>

    <!-- 综合查询 -->
    <el-dialog title="航线综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :pagetype='20' :mawbguid="mawbguid" :boguid="boguid" :area="area"
        :orderdom="orderdom"></mawbaddput>
    </el-dialog>

    <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
    <component :is="childrenComponent" v-if="OrderVisible"></component>
    
   
  </div>
</template>

<script>
  import { searCondition, filterGroupid, getChangeValue, formatDate } from '../api/localStorage.js'
  import costConfirmhxPage from './orderDetails/costConfirmhxPage'
  import airPlaneDeatil from './orderDetails/airPlaneDeatil'// 备注
  import managerDetail from "../wffmanagement/orderDetail/managerDetail";
  import managerDetailTz from "../wffmanagement/orderDetail/managerDetailTz";
  import { systemCheck, openZimessage, searchCmptMixins,manageShMethod,renderHtml } from '@/components/mixins/topPageMixin'

  var parentComponent={
 name: 'costConfirmationhx',
    mixins: [systemCheck, openZimessage, searchCmptMixins,manageShMethod],
    components: { costConfirmhxPage, airPlaneDeatil,managerDetail,managerDetailTz },
    props: {
      monitor: {
        type: [Number, String],
        default: 1//未驳回的 2已驳回的
      }
    },
    data() {
      return {
        name: 'costConfirmationhx.vue',
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
          //  confirmstatus: {
          //   title: "费用状态",
          //   type: 5,
          //   whereStr: "in",
          //   fieldtype: 5,
          //   options: [
          //     { label: "航线未确认", value: "1" },
          //     { label: "航线已确认", value: "700" }
          //   ]
          // },
          canceltype: { title: '撤单类型', type: 5, whereStr: 'in', groupid: 135, disabled: true },
          cancelman: { 'title': '撤单人', type: 1, disabled: true },
          // status: { 'title': '订单状态', type: 5, dom: '订单状态', system: '空出', 'whereStr': 'in',hidden: true  },
          hbrq: { title: "航班日期", type: 15, defaultVal: false, defaultEnd: true },

        },
        inputModelData: {
          status: this.monitor == 1 ? 'AO5060,AO5065' : 'AO5060,AO5070',
          confirmstatus: '1',
          signman: localStorage.usrname
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
        orderCancel: false,
        selectTableIndex: -1,
        wageRejectin: false,
        wageRejectout: false,
        initiator:'20'
      }
    },
    computed: {
      rowData() {
        return this.resultData[this.rowDataIndex] || { hbh: '', hbrq: '' }
      },
      // costConfirmDialogTitle() {
      //   return `应付运费批量确认   航班号: ${this.rowData.hbh}   航班日期: ${this.rowData.hbrq.substring(0, 10)}`
      // }
    },
    watch: {
      contextMenuVisible(val) {
        if (val) {
          document.body.addEventListener('click', this.closeContextMenu)
        } else {
          document.body.removeEventListener('click', this.closeContextMenu)
        }
      }
    },
    created() {


    },
    methods: {
      search() {
        this.$refs.tableComponet.ziTableIndex = -1
        this.tableDataRes = []
        this.ziTableData = []
        var search = JSON.parse(JSON.stringify(this.searchData))
        // search.delbillreason = ''
        search.wagedom = '航线'
        // search.shipaceid = { begin: '0' } // 限制必须要有shipaceid
        // 费用未确认的情况下，传入30天前的开始日期
        if (search.confirmstatus && search.confirmstatus.in == '1' && !this.$store.state.isWorkUnFinish) {
          if (search.hbrq && !search.hbrq.begin) {
            let begin = new Date()
            begin.setMonth(begin.getMonth() - 2)
            search.hbrq.begin = formatDate(begin, 'yyyy-MM-dd') + ' 00:00:00'
          }
        }
        var jsonArr2 = {
          where: search,
          'order': 'hbrq asc,qfsj asc'
        }
        var json = { 'json': JSON.stringify(jsonArr2) }
        let url = this.monitor == 1 ? 'api/ExHpoboAxplineWageRouteDomConfirm' : 'api/ExHpoboAxplineWageRouteDomReject'
        this.$axios({ method: 'get', url: this.$store.state.webApi + url, params: json, loading: true, tip: true, nofield: true })
          .then(({ data }) => {
            this.resultData = data
            if (data.length == 0) {
              this.$message('无查询结果'); return
            } else {
              this.pageshow = false
            }

            let tableData = []
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
                qfsj: item.qfsj && item.qfsj.indexOf('1900') == '-1' && item.qfsj.indexOf('0001') == '-1' ? item.qfsj.substring(11, 16) : '',
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

            setTimeout(() => {
              this.tableDataRes = tableData
              this.dataGrouping = parentGroupData
            }, 20)
          })
      },
      //上传情况说明
      uploadState(){
        this.dialogShow = true
      },
      openChatRoome(row){
          //this.$emit('openChatRoome',obj)
          //从表格列表项进入 使用下面代码
          this.$store.commit("setChat", { status: true, data: row });
      },
      // reset () {
      //   this.inputModelData = {
      //     status: 'AO5060',
      //     confirmstatus: '1',
      //     signman: localStorage.usrname
      //   }
      // },
      openDialog(indexData) {

        this.selectTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.orderdom = this.tableDataRes[indexData].orderdom
        this.area = this.tableDataRes[indexData].area
        this.dialogShow = true
        // if(this.tableDataRes[index].canceling==1){
        //        this.selectTableIndex=index;
        //        this.orderCancel=true
        // }

      },
      // 右键菜单
      contextMenuFn(data) {
        if (data.type === '2'||this.monitor=='2') {
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
      closeContextMenu() {
        this.contextMenuVisible = false
      },
      openAirPlane(index, wageinout) {
        //alert('1')
        
        let rowdata = this.tableDataRes[index]
        if(rowdata.tzType=='单票'){
          this.getWffDetail(rowdata)
        }else{
          if (rowdata.canceling == 1) {
            this.selectTableIndex = index;
            this.orderCancel = true
          } else {
            this.boguid = rowdata.boguid
            this.airPlaneDialogVisible = true
            this.airPlaneDeatilActiveTab = (rowdata.wagerejectstatusout == 100 || rowdata.wagerejectstatusin == 100 || rowdata.wagerejectstatusout == 200 || rowdata.wagerejectstatusin == 200) ? '费用总览' : wageinout
          }
        }

        // this.boguid = boguid
        // this.airPlaneDialogVisible = true
        // this.airPlaneDeatilActiveTab = wageinout
      },
      rowDataUpdate(data) {
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
    },
    mounted() {
      this.childrenComponent = renderHtml.call(
        this,
        parentComponent,
        1,
        {
          title:'费用审批',
          origin:'航线'
        }
      );
    }

  }
  export default parentComponent
</script>

<style lang="less" scoped>
  .cost-confirmationhx {
    /deep/.el-card__body {
      padding: 10px 0 10px;

      p {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        text-indent: 0.5em;

        &:hover {
          background: #9cd7ff;
          color: #fff;
        }

        i {
          margin-right: 10px;
          font-size: 14px;
        }
      }

      .disabled {
        &:hover {
          background: #c0c4cc;
          color: #333;
        }
      }
    }
    /deep/.plqr{
      .el-dialog__header{
         padding:0;
      }
      .el-dialog__body{
        padding-top:20px;
      }
    }
  }
</style>