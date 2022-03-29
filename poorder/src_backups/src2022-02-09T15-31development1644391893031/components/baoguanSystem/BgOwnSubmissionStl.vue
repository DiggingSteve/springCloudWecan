<template>
  <div class="BgOwnSubmissionStl">
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
        <!-- <el-button type="primary" @click="OrderCreateVisible = true">独立报关新增</el-button> -->
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all:false}">

      <template slot="pono" slot-scope="props">
        <span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDetail(props.data.row)">{{props.data.value}}</span>
      </template>

      <template slot="statuscn" slot-scope="props">
        <span style="color:#5bb01d;">{{ props.data.value }}</span>
      </template>

      <template slot="orderfrom" slot-scope="props">
        {{ props.data.row.salesarea + props.data.row.salesdom }}
      </template>

      <template slot="mainorder" slot-scope="props">
        {{ props.data.row.ordertype == 1 ? '--' : props.data.row.mainorder }}
      </template>

      <template slot="pieceweight" slot-scope="props">
        {{ pieceweight(props.data.row) }}
      </template>

      <template slot="wtxmname" slot-scope="props">
        {{ props.data.value ? props.data.value.split('-')[0] : '' }}
      </template>

      <template slot="hbrq" slot-scope="props">
        {{ props.data.value.split(' ')[0] }}
      </template>

    </tableCompt>

    <el-dialog
      :visible.sync="OrderDetailVisible"
      v-if="OrderDetailVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="dialogPage"
      width="100%"
      top="0px"
      :modal="false"
      center>

      <BgCostDetail
        :visible.sync="OrderDetailVisible"
        @back="OrderDetailVisible = false"
        :id="cur_order_id"
        :guid="cur_guid">
      </BgCostDetail>

    </el-dialog>
  </div>
</template>

<script>
import BgCostDetail from './BgCostDetail'

export default {
  name: 'BgOwnSubmissionStl',
  components: {
    BgCostDetail
  },
  data () {
    return {
      name:"BgOrderOperateSearch.vue",
      OrderDetailVisible: false,
      cur_order_id: '',
      cur_guid: '',
      tableDataRes: [],

      inputViewData: {
        pono: {title: '订舱编号', type: 1, whereStr: 'like'},
        wtkhid: {title: '委托客户', type: 14},
        gid: {title: '项目', type: 13},
        system: {title: '所属系统', type: 5, groupid: 51},
        mainorder: {title: '主营订舱编号', type: 1, whereStr: 'like'},
        bglx: {title: '报关类型', type: 5, groupid: 19, whereStr: 'in'},
        sfg: {title: '始发港', type: 20, pagetype: 6},
        mdg: {title: '目的港', type: 20, pagetype: 6},
        hbrq: {title: '航班日期', type: 15},
        assignarea: {title: '操作地', type: 23, groupid: 101, whereStr: 'in'},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        // adddate: {title: '创建日期', type: 15}
      },
      newFormCmptShow: true,
      inputModelData: {},
      searchData: {}
    }
  },
  methods: {
    deleteorder (guid) {
      this.tableDataRes.forEach((item, index) => {
        if (item.guid == guid) {
          this.tableDataRes.splice(index, 1)
          return
        }
      })
    },
    pieceweight (row) {
      let str = ''
      str += row.piece || ''
      str += ' / '
      str += row.weight || ''
      return str
    },
    reset(){
      this.inputModelData = {}
    },
    search () {
      this.searchData.dom = localStorage.dom || '出口部'
      this.searchData.status = {'in': '500'}

      var jsonArr2={
        where: this.searchData,
        order: "adddate desc"
      }
      var json={
        'json':JSON.stringify(jsonArr2),
        status: 700
      }

      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExDecl/SubmitDecl',params:json,loading:true,tip:false})
      .then(results=>{
        if (results.data.length == 0) {
          this.tableDataRes = []
          return this.$message('无查询结果')
        }

        this.tableDataRes = results.data

        setTimeout(() => {
          this.newFormCmptShow = false
        }, 100)
      })
      .catch(errors=>{

      })
    },
    openDetail (row) {
      this.cur_order_id = row.id
      this.cur_guid = row.guid
      this.OrderDetailVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.BgOwnSubmissionStl {
  .btn-c {
    margin: 17px 0;
    overflow: hidden;
    .el-button {
      // float: right;
      margin-left: 50px;
    }
  }
}
</style>
