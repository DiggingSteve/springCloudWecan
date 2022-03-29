<template>
  <div class="BgOrderDistribution">
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
        <el-button type="primary" @click="dialogVisible = true">订单分配</el-button>
        <el-button type="primary" @click="cancelAssign">本站操作</el-button>
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all:false}">

      <template slot="checkbox" slot-scope="props">
        <el-checkbox v-model="props.data.row.checked"></el-checkbox>
      </template>

      <template slot="orderfrom" slot-scope="props">
        {{ props.data.row.salesarea + props.data.row.salesdom }}
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
      title="联运号分配"
      class="dialog"
      :visible.sync="dialogVisible"
      width="450px"
      top="4%"
      center>

      <!-- <div class="assignSelect">
        <span>请选择分配地：</span>
        <div>
          <el-radio v-model="assignTo" label="bz">分配至本站</el-radio>
          <el-radio v-model="assignTo" label="wz">分配至外站</el-radio>
        </div>
      </div> -->

      <!--  v-show="assignTo == 'wz'" -->
      <assignwz :visible="dialogVisible" :assign-data="assignData"></assignwz>

      <div class="assignBtn">
        <el-button @click="dialogVisible = false">取消返回</el-button>
        <el-button @click="assign('wz')">确认分配</el-button>
      </div>
    </el-dialog>

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
        :isAssign="true"
        v-if="OrderDetailVisible"
        :visible.sync="OrderDetailVisible"
        @deleteorder="deleteOrderFromTable"
        @assignSuccess="deleteOrderFromTable"
        :id="cur_order_id"
        :guid="cur_guid">
      </BgOrderDetail>

    </el-dialog>

  </div>
</template>

<script>
import assignwz from './assignwz'
import BgOrderDetail from './BgOrderDetail'

export default {
  name: 'BgOrderDistribution',
  components: {
    assignwz, BgOrderDetail
  },
  data () {
    return {
      name:"BgOrderDistribution.vue",

      cur_order_id: '',
      cur_guid: '',
      cur_index: -1,
      OrderDetailVisible: false,
      bz_area: this.$store.state.areaState,

      dialogVisible: false,
      assignTo: 'bz',
      tableDataRes: [],

      inputViewData: {
        pono: {title: '订舱编号', type: 1, whereStr: 'like'},
        wtkhid: {title: '委托客户', type: 14},
        gid: {title: '项目', type: 13},
        system: {title: '所属系统', type: 5, whereStr: 'in', groupid: 51},
        mainorder: {title: '主营订舱编号', type: 1, whereStr: 'like'},
        bglx: {title: '报关类型', type: 5, whereStr: 'in', groupid: 19},
        // ordertype: {title: '订单来源', type: 5, whereStr: 'in', options: []}, //{value: '自增', label: '自增'},{value: '外部', label: '外部'}
        salesarea: {title: '销售地', type: 23, whereStr: 'in', groupid: 101},
        sfg: {title: '始发港', type: 20, pagetype: 6},
        mdg: {title: '目的港', type: 20, pagetype: 6},
        hbrq: {title: '航班日期', type: 15},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        adddate: {title: '创建日期', type: 15}
      },
      newFormCmptShow: true,
      inputModelData: {},
      searchData: {},

      assignData: {
        assignarea: '',// 分配区域
        assigndom: '出口部',// 分配部门
        system: '报关',// 分配系统
        profitcurrency: '人民币',// 运费币种
        profitprice: '',// 价格
        profitmode: 'Co-Load模式',// 分配模式
        self_profitvalue: '',// 销售站利润分配比例
        cus_profitvalue: ''// 操作站利润分配比例
      }
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
      this.searchData.status = this.searchData.status || {in: '150'}
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
    cancelAssign () {
      this.$confirm('是否取消分配', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.assignTo = 'bz'
        this.assign('bz')
      })
    },
    assign (assignTo) {
      if (assignTo == 'wz') {
        //  || !this.assignData.self_profitvalue || !this.assignData.cus_profitvalue
        if (!this.assignData.assignarea || !this.assignData.profitprice) {
          this.$message.error('请填写完整信息')
          return
        }
      }

      let save_data = []
      let assignIndex = []

      this.tableDataRes.forEach((row, index) => {
        if (row.checked) {
          save_data.push(row)
          assignIndex.push(index)
        }
      })

      if (save_data.length == 0) {
        return this.$message.error('请选择订单')
      }

      let area = this.$store.state.areaState
      save_data = save_data.map(row => {

        row = {...row, ...this.assignData, czman: localStorage.usrname, assignsystem: '报关'}
        row.stassignToatus = 400
        if (assignTo == 'bz') {
          row.assignarea = area
          row.addtype = 3
        } else {
          row.addtype = 2
        }
        return row
      })

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDecl',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.tableDataRes = this.tableDataRes.filter((item, index) => {
            if (assignIndex.includes(index)) return false
            return true
          })
        }
        this.dialogVisible = false
        this.assignData.assignarea = ''
        this.assignData.profitcurrency = '人民币'
        this.assignData.profitprice = ''
      })
      .catch(error=>{

      })
    },
    openDetail (row, index) {
      this.cur_order_id = row.id
      this.cur_guid = row.guid
      this.cur_index = index
      this.OrderDetailVisible = true
    },
    deleteOrderFromTable () {
      this.tableDataRes.splice(this.cur_index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.BgOrderDistribution {
  .dialog {
    .assignSelect {
      margin-bottom: 20px;
    }
    div {
      > span:first-child {
        float: left;
        width: 110px;
        text-align: right;
        + div {
          margin-left: 120px;
        }
      }
    }
    .currency {
      > span + div {
        .el-radio {
          width: 125px;
        }
        .el-radio:nth-child(3) {
          margin-left: 0;
        }
      }
    }
    .price {
      .el-input {
        margin-right: 10px;
        width: 150px;
      }
    }
    .fpbl {
      .el-input {
        width: 60px;
        margin: 0 10px;
      }
    }
    .assignBtn {
      margin-top: 30px;
      text-align: center;
    }
  }
}
</style>
