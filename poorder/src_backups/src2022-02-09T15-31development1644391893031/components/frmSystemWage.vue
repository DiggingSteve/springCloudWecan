<template>
  <div class="frm-system-wage">
    <div class="page-container-box">

      <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync='pageshow'
        :chinese-where.sync="chineseWhere"
        :pagetype="1">
      </newFormCmpt>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <!-- <el-button @click="importDialogVisible = true">导入</el-button> -->
        <el-button type="primary" @click="addWage">杂费新增</el-button>
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="1"
      @transmitMsg="getZimessage"
      :expansionSubcolumn="'wagestandard'"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      :showZiConfig="true"
      :showTotal="{ all: false }">

      <template slot="wagestandard" slot-scope="props">
        <!-- <i class="el-icon-download" style="color:#1a7dbf;font-weight:bold;margin-left: 0;" title="导出" @click="exportWageExcel(props.data.index)"></i> -->
        <span class="poczColor" @click="openWageDialog(props.data.row)">{{ props.data.value }}</span>
      </template>

    </tableCompt>

    <el-dialog
      :title="'应收杂费维护' + (wtkhUsr_name ? ` - ${wtkhUsr_name}` : '')"
      class="frmSystemWage-dialog dialogPage"
      width="100%"
      top="0"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="wageDialogVisible">
      <wageDialogPage
        :visible="wageDialogVisible"
        :wageDialogParam="wageDialogParam"
        @usrNameChange="wtkhUsr_name = $event">
      </wageDialogPage>
    </el-dialog>

    <!-- <el-dialog
      :visible.sync="importDialogVisible"
      title="导入模板"
      width="1000px">
      <wageImportPage></wageImportPage>
    </el-dialog> -->
  </div>
</template>

<script>
import { searCondition, getChangeValue, computedWeight, formatDate, getCharCol } from '../api/localStorage.js'
import wageDialogPage from './orderDetails/wageDialogPage'
import wageImportPage from './orderDetails/wageImportPage'

export default {
  name: 'frmSystemWage',
  components: { wageDialogPage, wageImportPage },
  data () {
    return {
      name: 'frmSystemWage.vue',
      wageDialogVisible: false,
      wageDialogParam: {},

      // importDialogVisible: false,

      tableDataRes: [],
      ziTableIndex: -1,

      wtkhUsr_name: '',

      inputViewData: {
        wagestandard: { title: '标准', type: 4, options: [{ label: '唯凯标准', value: '唯凯标准' }, { label: '客户标准', value: '客户标准' }] },
        fid: { title: '委托客户', type: 11, hidden: true },
        items: { title: '费用', type: 1, whereStr: 'like' },
        status: { title: '状态', type: 4, options: [{ label: '有效', value: '1' }, { label: '无效', value: '2' }] }
        // system: { title: '所属系统', type: 4, options: [], groupid: 57, bindValue: 'typename', bindLabel: 'typename' },
        // sfg: { 'title': '始发港', type: 1 },
        // mdg: { 'title': '目的港', type: 1 }
      },
      inputModelData: {},
      searchData: {},
      chineseWhere: [],
      pageshow: true,

      pageSelectViewData: [
        { title: 's_name', field: 's_name' },
        { title: '费用名称', field: 's_name' },
        { title: '费用代码', field: 's_code' }
      ]
    }
  },
  computed: {
    ziTableData () {
      if (!this.tableDataRes[this.ziTableIndex] || !this.tableDataRes[this.ziTableIndex].list) return []

      return this.tableDataRes[this.ziTableIndex].list.map(item => {
        let newitem = {...item}
        ;['istodoor', 'cancelorder', 'inspection'].forEach(key => {
          if (newitem[key] === -1) newitem[key] = ''
        })
        return newitem
      })
    }
  },
  watch: {
    wageDialogVisible (val) {
      if (val === false) {
        this.wageDialogParam = {}
        this.wtkhUsr_name = ''
      }
    },
    inputModelData: {
      deep: true,
      handler (val) {
        if (val.wagestandard === '客户标准') {
          this.inputViewData.fid.hidden = false
        } else {
          this.inputViewData.fid.hidden = true
          this.inputModelData.fid = ''
        }
      }
    }
  },
  methods: {
    reset () {
      this.inputModelData = {}
    },
    addWage () {
      this.wageDialogParam = { addWage: true }

      this.wageDialogVisible = true
    },
    search (isNewWage) {
      this.tableDataRes = []
      // 新增费用后需要重新查询，但是不重置子表格的index，否则后续的删除操作会出现问题
      if (!isNewWage) {
        this.ziTableIndex = -1
      }
      let jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      }
      let json = { 'json': JSON.stringify(jsonArr2) }

      this.$axios({ method: 'get', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', params: json, loading: true, tip: false}).then(result => {
        let resultData = result.data

        if (resultData.length == 0) {
          return this.$message('无查询结果')
        } else {
          this.pageshow = false
        }
        let data = []

        resultData.forEach((i, index) => {
          if (i.list.length === 0)  return
          i.zitablenum = i.list.length
          i.list.forEach(this.formatWage)
          this.sortByServicename(i.list)
        })

        data = getChangeValue(resultData, '空出')

        setTimeout(() => {
          this.tableDataRes = data
        }, 0)
      })
    },
    getZimessage (msg) {
      this.ziTableIndex = msg.index
    },
    openWageDialog (row) {
      this.wageDialogParam = {}
      this.wtkhUsr_name = ''

      this.wageDialogParam.area = row.area
      this.wageDialogParam.system = row.system
      this.wageDialogParam.wagestandard = row.wagestandard
      if (row.wagestandard.includes('客户标准')) {
        this.wageDialogParam.fid = row.list[0].fid
        this.wtkhUsr_name = row.list[0].usr_name
      }

      this.wageDialogVisible = true
    },
    formatWage (wage) {
      wage.gid = wage.gid == '0' ? '' : wage.gid
      wage.itemstatus = wage.itemstatus === 1 ? '有效' : '无效'
      wage.begindate = formatDate(new Date(wage.begindate), 'yyyy-MM-dd') || ''
      wage.enddate = formatDate(new Date(wage.enddate), 'yyyy-MM-dd') || ''
    },
    sortByServicename (list) {
      let servicenameObj = {}
      list.forEach(item => {
        if (!servicenameObj[item.servicename]) servicenameObj[item.servicename] = []
        servicenameObj[item.servicename].push(item)
      })
      list.splice(0) // 清空
      for (let key in servicenameObj) {
        list.push(...servicenameObj[key])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.frm-system-wage {
  display: flex;
  flex-direction: column;
  height: 100%;
  .page-container-box {
    .searchForm {
      .search-type {
        display: inline;
        margin-left: 20px;
      }
    }
  }
}
/deep/ .wagestandard{
  max-width: 800px!important;
  min-width: 800px!important;
}
</style>

<style lang="less">
.frmSystemWage-dialog {
  .el-dialog {
    padding: 28px;
  }
  .el-dialog__header {
    padding: 0 0 10px;
  }
  .el-dialog__body {
    padding: 0px;
  }
  .wage-dialog-content {
    .wage-header {
      padding-bottom: 15px;
      border-bottom: 1px solid #e8e8e8;
      /deep/ .el-select {
        .el-input__inner {
          height: 32px !important;
        }
      }
      .wage-select {
        display: inline-block;
        width: 210px;
      }
      .wage-add-btn {
        margin-left: 10px;
      }
      .wage-extra-info {
        float: right;
      }
    }
    .wage-list {
      .wage-item {
        border-bottom: 1px solid #e8e8e8;
        .item-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 15px 0;
          font-size: 15px;
          .price-c {
            color: #999;
            cursor: pointer;
            .price {
              margin: 0 4px 0 6px;
              color: red;
              font-weight: bold;
            }
            .el-icon-caret-bottom {
              color: #105a89;
              font-size: 20px;
              transition: transform .3s;
              &.reverse {
                transform: rotateZ(180deg);
              }
            }
          }
        }
        .item-form {
          transition: height .3s;
          height: 500px;
          overflow: hidden;
          &.collapse {
            height: 0;
          }
          // /deep/ .page-container-main {
          //   > div:nth-child(2),
          //   > div:nth-child(5) {
          //     .input-item {
          //       margin-right: 0;
          //     }
          //   }
          // }
          .sub-title {
            width: 100%;
            margin-bottom: 10px;
            font-size: 15px;
            color: #a6a6a6;
          }
          .multiple-form {
            padding-bottom: 10px;
            border-bottom: 1px solid #e8e8e8;
            margin-bottom: 20px;
            .row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              margin-bottom: 12px;
              .input-item-c {
                display: flex;
                justify-content: space-between;
                width: 49%;
                height: 30px;
                border: 1px solid #c0c9d0;
                border-radius: 4px;
                line-height: 28px;
                .input-label {
                  // width: 80px;
                  padding: 0 6px;
                  color: #555;
                }
                .el-input {
                  flex: 1;
                  .el-input__inner {
                    border: none;
                    text-align: right;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
