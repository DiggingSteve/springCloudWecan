<template>
  <div class="frmCustomJob">
    <div class="page-container-box">
      <newSearchComp :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="newFormCmptShow"
        :pagetype="1">
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all: false}" class="tableCompt">
      <template slot="operate" slot-scope="props">
        <p>
          <i @click="openDetail(props.data.row, props.data.index)" class="el-icon-setting" title="详细"></i>
        </p>
      </template>
      <template slot="commitstatus" slot-scope="props">
        {{ getCommitstatusCN(props.data.row.commitstatus) }}
      </template>
      <template slot="commitxs" slot-scope="props">
        {{ getCommitxsCN(props.data.row.commitxs) }}
      </template>
      <template slot="commitlb" slot-scope="props">
        {{ getCommitlbCN(props.data.row.commitlb) }}
      </template>
      <template slot="usr_status" slot-scope="props">
        {{ getUsr_statusCN(props.data.row.usr_status) }}
      </template>
      <template slot="usr_status_cw" slot-scope="props">
        {{ getUsr_statusCN(props.data.row.usr_status_cw) }}
      </template>
    </tableCompt>

    <!-- 公司详细 -->
    <el-dialog
      :title="cur_row.usr_name || ''"
      :visible.sync="companyVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="false"
      class="dialogPage"
      width="90%"
      top="20px"
      center>
      <companyDetail v-if="companyVisible" :id="cur_row.id" @closeDialog="closeDetail"></companyDetail>
    </el-dialog>

    <!-- 项目详细 -->
    <el-dialog
      :title="cur_row.usr_name || ''"
      :visible.sync="projectVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="false"
      class="dialogPage"
      width="90%"
      top="20px"
      center>
      <projectDetail v-if="projectVisible" :id="cur_row.id" @closeDialog="closeDetail"></projectDetail>
    </el-dialog>

  </div>
</template>

<script>
import companyDetail from './orderDetail/companyDetail'
import projectDetail from './orderDetail/projectDetail'

export default {
  name: 'companyproject',
  components: {
    companyDetail,
    projectDetail
  },
  data () {
    return {
      name: 'companyproject.vue',
      companyVisible: false,
      projectVisible: false,
      cur_row: {},

      tableDataRes: [],
      inputViewData: {
        usr_name: {title: '公司名称', type: 1, whereStr: 'like'},
        usr_code: {title: '公司代码', type: 1, whereStr: 'like'},
        usr_status_cw: {title: '状态(财务)', type: 5, whereStr: 'in', options: [
          { label: '有效', value: '1' },
          { label: '无效', value: '2' }
        ]},
        accountno: {title: '财务编码', type: 1, whereStr: 'like'},
        commitxs: {title: '申请形式', type: 5, whereStr: 'in', options: [
          { label: '公司申请', value: '1' },
          { label: '项目申请', value: '2' }
        ]},
        commitlb: {title: '申请类型', type: 5, whereStr: 'in', options: [
          { label: '新增申请', value: '1' },
          { label: '修改申请', value: '2' }
        ]},
        commitstatus: {title: '申请状态', type: 5, whereStr: 'in', groupid: 93, options: []},
        commitman: {title: '申请人', type: 1, whereStr: 'like'},
        carea: {title: '申请操作地', type: 5, whereStr: 'in', options: []},
        commitdate: {title: '申请日期', type: 15}
      },
      newFormCmptShow: true,
      inputModelData: {
        commitstatus: '2'
      },
      searchData: {}

    }
  },
  created () {
    JSON.parse(localStorage.groupType).filter(i => i.groupid == '53').forEach(item => {
      this.inputViewData.carea.options.push({
        label: item.typename, value: item.typename
      })
    })
  },
  methods: {
    search () {
      var jsonArr2={
        where: this.searchData,
        order: "adddate desc"
      }

      var json={'json':JSON.stringify(jsonArr2)}

      this.$axios({method:'get',url:this.$store.state.customWebApi+'api/BasicViewCommit',params:json,loading:true,tip:false})
      .then(results=>{
        if (results.data.length == 0) {
          this.tableDataRes = []
          return this.$message('无查询结果')
        }

        this.tableDataRes = results.data.map(item => {
          Object.entries(item).map(([key, value]) => {
            if (key.includes('status')) item[key] = String(value)
            if (key != 'isupdate' && key.includes('date') && item[key]) {
              item[key] = item[key].includes('1900') ? '' : new Date(item[key]).Format('yyyy-MM-dd')
            }
          })
          return item
        })

        setTimeout(() => {
          this.newFormCmptShow = false
        }, 100)
      })
    },
    reset () {
      this.inputModelData = {}
    },
    openDetail (row, index) {
      this.cur_row = row
      this.cur_index = index
      if (row.commitxs == 1) {
        this.companyVisible = true
      } else if (row.commitxs == 2) {
        this.projectVisible = true
      }
    },
    closeDetail (commitxs) {
      this.tableDataRes.splice(this.cur_index, 1)
      if (commitxs == 1) {
        this.companyVisible = false
      } else {
        this.projectVisible = false
      }
    },
    getCommitstatusCN (status) {
      let text = ''
      switch (status) {
        case '1':
          text = '待申请'
          break
        case '2':
          text = '老板待审'
          break
        case '3':
          text = '老板通过'
          break
        case '4':
          text = '老板驳回'
          break
        case '5':
          text = '已删除'
          break
        case '6':
          text = '法务待审'
          break
        case '7':
          text = '法务通过'
          break
        case '8':
          text = '法务驳回'
          break
      }
      return text
    },
    getCommitxsCN (status) {
      let text = ''
      switch (status) {
        case 1:
          text = '公司申请'
          break
        case 2:
          text = '项目申请'
          break
      }
      return text
    },
    getCommitlbCN (status) {
      let text = ''
      switch (status) {
        case 1:
          text = '新增'
          break
        case 2:
          text = '修改'
          break
      }
      return text
    },
    getUsr_statusCN (status) {
      let text = ''
      switch (status) {
        case '1':
          text = '有效'
          break
        case '2':
          text = '无效'
          break
      }
      return text
    }
  }
}
</script>

<style lang="less" scoped>

</style>
