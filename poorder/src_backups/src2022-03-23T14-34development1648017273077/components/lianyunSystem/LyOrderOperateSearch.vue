<template>
  <div class="LyOrderOperateSearch">
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
        <!-- <el-button type="primary" @click="OrderCreateVisible = true">独立联运新增</el-button> -->
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all:false}">

      <template slot="status" slot-scope="props">
        <span style="color:#5bb01d;">{{ getStatus(props.data.value) }}</span>
      </template>

      <template slot="orderfrom" slot-scope="props">
        {{ props.data.row.salesarea + props.data.row.salesdom }}
      </template>

      <template slot="pono" slot-scope="props">
        <span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDetail(props.data.row)">{{props.data.value}}</span>
      </template>

      <template slot="mainorder" slot-scope="props">
        {{ props.data.value || '--' }}
      </template>

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
      title="独立联运订单新增"
      :visible.sync="OrderCreateVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="dialogPage"
      width="100%"
      top="0px"
      :modal="false"
      center>

      <LyOrderDetail :visible.sync="OrderCreateVisible" :method="'add'" @createSuccess="openDetail($event)" v-if="OrderCreateVisible"></LyOrderDetail>

    </el-dialog>

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

      <LyOrderDetail :visible.sync="OrderDetailVisible" :id="cur_order_id" :guid="cur_guid" @delSuccess="delSuccess"></LyOrderDetail>

    </el-dialog>
  </div>
</template>

<script>
import LyOrderDetail from './LyOrderDetail'

export default {
  name: 'LyOrderOperateSearch',
  components: {
    LyOrderDetail
  },
  data () {
    return {
      name:"OrderOperateSearch.vue",
      OrderCreateVisible: false,
      OrderDetailVisible: false,
      cur_order_id: '',
      cur_guid: '',
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
        yqfinishdate: {title: '完成时间', type: 15},
        yqpickupdate: {title: '提货时间', type: 15},
        status: {title: '订单状态', type: 5, whereStr: 'in', options: [
          {label: '未受理', value: '1'},
          {label: '已受理', value: '100'},
          {label: '已退回', value: '200'},
          {label: '已确认', value: '300'},
          {label: '已分配', value: '400'},
          {label: '已完成', value: '500'},
          {label: '已提交', value: '800'},
          {label: '已审核', value: '1200'},
          {label: '已撤单', value: '600'}
        ]},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        adddate: {title: '创建日期', type: 15, defaultVal: true},
        salesarea: {title: '订单销售站', type:23, whereStr: 'in', groupid: 101},
        // salesdom: {title: '销售部门', type: 5, whereStr: 'in', groupid: 2},
        assignarea: {title: '操作地',  type:23, whereStr: 'in', groupid: 101}
      },
      newFormCmptShow: true,
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
    reset(){
      this.inputModelData = {}
    },
    search () {

      this.searchData.status = this.searchData.status || {not: '0,1,250,600'}
      this.searchData.dom = localStorage.dom || '出口部'

      var jsonArr2={
        where: this.searchData,
        order: "adddate desc"
      }

      var json={'json':JSON.stringify(jsonArr2)}

      this.$axios({method:'get',url:this.$store.state.webApi+'api/extransport',params:json,loading:true,tip:false})
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
    getStatus (value) {
      switch (value){
        case 1:
          return '未受理'
          break
        case 100:
          return '已受理'
          break
        case 200:
          return '已退回'
          break
        case 250:
          return '已受理待分配'
          break
        case 300:
          return '已确认'
          break
        case 400:
          return '已分配'
          break
        case 500:
          return '已完成'
          break
        case 600:
          return '已撤单'
          break
        case 800:
          return '已提交'
          break
        case 1200:
          return '已审核'
          break
      }
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
// .LyOrderOperateSearch {
//
// }
</style>
