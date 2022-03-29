<template>
  <div class="LyOrderAccept">
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
        <el-checkbox v-model="props.data.row.checked"></el-checkbox>
      </template>

      <template slot="operate" slot-scope="props">
        <div class="operate-c">
          <span title="退回" @click="oneAccept(200, props.data.row)" :class="['el-icon-error',{'disabled': props.data.row.status != 1}]"></span>
          <span title="受理" @click="oneAccept(100, props.data.row)" :class="['el-icon-success',{'disabled': props.data.row.status != 1}]"></span>
        </div>
      </template>

      <template slot="orderfrom" slot-scope="props">
        {{ props.data.row.salesarea + props.data.row.salesdom }}
      </template>

      <template slot="mainorder" slot-scope="props">
        {{ props.data.value || '--' }}
      </template>

      <template slot="pono" slot-scope="props"><span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDetail(props.data.row)">{{props.data.value}}</span></template>

      <template slot="pieceweightvolume" slot-scope="props">
        {{ `${props.data.row.piece}/${props.data.row.weight}/${props.data.row.volume}` }}
      </template>

      <template slot="exFcustom" slot-scope="props">
        {{ props.data.value && props.data.value.usr_name }}
      </template>

      <template slot="exCustom" slot-scope="props">
        {{ props.data.value && props.data.value.usr_name.split('-')[0] }}
      </template>

    </tableCompt>

    <el-dialog
      title="独立联运订单详情"
      :visible.sync="OrderDetailVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-if="OrderDetailVisible"
      class="dialogPage"
      width="100%"
      top="0px"
      :modal="false"
      center>

      <LyOrderDetail
      v-if="OrderDetailVisible"
        :visible.sync="OrderDetailVisible"
        :id="cur_order_id"
        :guid="cur_guid"
        @delSuccess="search()"
        @acceptSuccess="search()"
        :hideWage="true"
        :isAccept="true">
      </LyOrderDetail>

    </el-dialog>
  </div>
</template>

<script>
import LyOrderDetail from './LyOrderDetail'

export default {
  name: 'LyOrderAccept',
  components: {
    LyOrderDetail
  },
  data () {
    return {
      name:"OrderAccept.vue",
      OrderDetailVisible: false,
      cur_order_id: '',
      cur_guid: '',
      showTotal:{all:false},
      tableDataRes: [],

      inputViewData: {
        pono: {title: '订舱编号', type: 1, whereStr: 'like'},
        fid: {title: '委托客户', type: 14},
        gid: {title: '项目', type: 13},
        // orderfrom: {title: '订单来源', type: 5, whereStr: 'in', options: []}, // {label: '自增', value: '自增'}, {label: '外部', value: '外部'}
        // system: {title: '所属系统', type: 5, whereStr: 'in', groupid: 51},
        mawb: {title: '总运单号', type: 1, whereStr: 'like'},
        address_thr: {title: '提货地', type: 1, whereStr: 'like'},
        address_shr: {title: '送货地', type: 1, whereStr: 'like'},
        yqpickupdate: {title: '完成时间', type: 15},
        yqfinishdate: {title: '提货时间', type: 15},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        adddate: {title: '创建日期', type: 15},
        salesarea: {title: '订单销售站', type: 23, whereStr: 'in', groupid: 101},
        // salesdom: {title: '销售部门', type: 5, whereStr: 'in', groupid: 2}
      },
      newFormCmptShow: false,
      inputModelData: {},
      searchData: {}
    }
  },
  methods: {
    delSuccess (guid) {
      this.tableDataRes.forEach((item, index) => {
        if (item.guid == guid) {
          this.tableDataRes.splice(index, 1)
        }
      })
    },
    openDetail (row) {
      this.cur_order_id = row.id
      this.cur_guid = row.guid
      this.OrderDetailVisible = true
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

      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExTransport',params:json,loading:true,tip:true})
      .then(results=>{
        if (results.data.length == 0) {
          this.tableDataRes = []
          return this.$message('无查询结果')
        }

        // let tableData = []
        // if (this.searchData.orderfrom) {
        //   if (this.searchData.orderfrom.in.includes('自增') && this.searchData.orderfrom.in.includes('外部')) {
        //     tableData = results.data
        //   } else if (this.searchData.orderfrom.in.includes('自增')) {
        //     tableData = results.data.filter(item => {
        //       return item.orderno ? false : true
        //     })
        //   } else if (this.searchData.orderfrom.in.includes('外部')) {
        //     tableData = results.data.filter(item => {
        //       return item.orderno ? true : false
        //     })
        //   }
        // } else {
        //   tableData = results.data
        // }
        // this.tableDataRes = tableData

        this.tableDataRes = results.data

        setTimeout(() => {
          this.newFormCmptShow = false
        }, 100)
      })
    },
    batchAccept (status) {
      let guids = ''
      this.tableDataRes.forEach(row => {
        if (row.checked) guids += `${row.guid},`
      })
      guids = guids.slice(0, -1)

      if (guids.length == 0) {
        return this.$message.error('请选择订单')
      }
      let accept_data = {guids: guids, status: status}
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExTransport/TransportAcceptance',data: accept_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.search()
        }
      })
      .catch(errors=>{
        if (errors) {
          //console.log(errors)
        }
      })
    },
    oneAccept (status, row) {
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

        let accept_data = {guids: guids, status: status}
        this.$axios({method:'put',url:this.$store.state.webApi+'api/ExTransport/TransportAcceptance',data: accept_data,loading:true,tip:true})
        .then(result=>{
          if (result.data.resultstatus == 0) {
            this.search()
          }
        })
        .catch(errors=>{
          if (errors) {
            //console.log(errors)
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="less" scoped>
.LyOrderAccept {
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
