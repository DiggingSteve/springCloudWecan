<template>
  <div class="BgOrderAccept">
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
        <el-button type="primary" @click="batchAccept(100)">批量受理</el-button>
        <el-button type="primary" @click="batchAccept(200)">批量退回</el-button>
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all:false}">

      <template slot="checkbox" slot-scope="props">
        <el-checkbox :disabled="props.data.row.status != 1" v-model="props.data.row.checked"></el-checkbox>
      </template>

      <template slot="orderfrom" slot-scope="props">
        {{ props.data.row.salesarea + props.data.row.salesdom }}
      </template>

      <template slot="operate" slot-scope="props">
        <div class="operate-c">
          <span title="退回" @click="oneAccept(200, props.data.row, props.data.index)" :class="['el-icon-error',{'disabled': props.data.row.status != 1}]"></span>
          <span title="受理" @click="oneAccept(100, props.data.row, props.data.index)" :class="['el-icon-success',{'disabled': props.data.row.status != 1}]"></span>
        </div>
      </template>

      <template slot="pono" slot-scope="props">
        <span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDetail(props.data.row, props.data.index)">{{props.data.value}}</span>
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
      title="独立报关订单详情"
      :visible.sync="OrderDetailVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="dialogPage"
      width="100%"
      top="0px"
      :modal="false"
      center>

      <BgOrderDetail
        :hideWage="true"
        v-if="OrderDetailVisible"
        :isAccept="true"
        :visible.sync="OrderDetailVisible"
        @deleteorder="search()"
        @acceptSuccess="search()"
        :id="cur_order_id"
        :guid="cur_guid">
      </BgOrderDetail>

    </el-dialog>

  </div>
</template>

<script>
import BgOrderDetail from './BgOrderDetail'

export default {
  name: 'BgOrderAccept',
  components: {
    BgOrderDetail
  },
  data () {
    return {
      name:"BgOrderAccept.vue",

      OrderDetailVisible: false,
      cur_order_id: '',
      cur_guid: '',
      cur_index: -1,

      tableDataRes: [],

      inputViewData: {
        pono: {title: '订舱编号', type: 1, whereStr: 'like'},
        wtkhid: {title: '委托客户', type: 14},
        gid: {title: '项目', type: 13},
        system: {title: '所属系统', type: 5, groupid: 51},
        mainorder: {title: '主营订舱编号', type: 1, whereStr: 'like'},
        bglx: {title: '报关类型', type: 5, groupid: 19, whereStr: 'in'},
        // ordertype: {title: '订单来源', type: 5, whereStr: 'in', options: []}, //{value: '自增', label: '自增'},{value: '外部', label: '外部'}
        salesarea: {title: '销售地', type: 23, groupid: 101, whereStr: 'in'},
        sfg: {title: '始发港', type: 20, pagetype: 6},
        mdg: {title: '目的港', type: 20, pagetype: 6},
        hbrq: {title: '航班日期', type: 15},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        adddate: {title: '创建日期', type: 15}
      },
      newFormCmptShow: false,
      inputModelData: {},
      searchData: {}
    }
  },
  methods: {
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
      this.searchData.status = this.searchData.status || 1
      this.searchData.dom = localStorage.dom || '出口部'

      var jsonArr2={
        where: this.searchData,
        order: "adddate desc"
      }
      var json={'json':JSON.stringify(jsonArr2)}

      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExDecl',params:json,loading:true,tip:true})
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
    openDetail (row, index) {
      this.cur_order_id = row.id
      this.cur_guid = row.guid
      this.cur_index = index
      this.OrderDetailVisible = true
    },
    deleteorder () {
      this.tableDataRes.splice(this.cur_index, 1)
    },
    batchAccept (status) {
      let guids = ''
      let mainorder = ''
      let acceptIndex = []

      this.tableDataRes.forEach((row, index) => {
        if (row.checked) {
          guids += `${row.guid},`
          mainorder += `${row.mainorder},`
          acceptIndex.push(index)
        }
      })

      guids = guids.slice(0, -1)
      mainorder = mainorder.slice(0, -1)

      if (guids.length == 0) {
        return this.$message.error('请选择订单')
      }

      let accept_data = {guids: guids, status: status, czmandepart: localStorage.dom, mainorder}

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDeclAcceptance',data: accept_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.search()
          // this.tableDataRes = this.tableDataRes.filter((item, index) => {
          //   if (acceptIndex.includes(index)) return false
          //   return true
          // })
        }
        //console.log(result)
      })
      .catch(errors=>{
        if (errors) {
          //console.log(errors)
        }
      })
    },
    oneAccept (status, row, index) {
      let text = ''
      if (status == 100) {
        text = '受理'
      } else if (status == 200) {
        text = '退回'
      }

      this.$confirm(`是否${text}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let guids = String(row.guid)
        let mainorder = String(row.mainorder)

        let accept_data = {guids: guids, status: status, czmandepart: localStorage.dom, mainorder}

        this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDeclAcceptance',data: accept_data,loading:true,tip:true})
        .then(result=>{
          if (result.data.resultstatus == 0) {
            this.search()
            // this.tableDataRes = this.tableDataRes.filter((item, i) => {
            //   if (index == i) return false
            //   return true
            // })
          }
          //console.log(result)
        })
      })

    }
  }
}
</script>

<style lang="less" scoped>
.BgOrderAccept {
  .operate-c {
    cursor: default;
    span {
      font-size: 16px;
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
      }
    }
    .el-icon-error {
      color: #f00;
    }
    .el-icon-success {
      color: #3c9;
    }
    .disabled {
      pointer-events: none;
      opacity: .4;
    }
  }
}
</style>
