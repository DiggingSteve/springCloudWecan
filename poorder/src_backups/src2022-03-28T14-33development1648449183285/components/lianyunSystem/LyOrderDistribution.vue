<template>
  <div class="LyOrderDistribution">
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

      <template slot="mainorder" slot-scope="props">
        {{  props.data.value || '--' }}
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
      title="联运号分配"
      class="dialog"
      :visible.sync="dialogVisible"
      width="450px"
      top="4%"
      center>

      <!-- <div class="assignSelect">
        <span>请选择分配地：</span>
        <div>
          <el-radio v-model="distributionTo" label="bz">分配至本站</el-radio>
          <el-radio v-model="distributionTo" label="wz">分配至外站</el-radio>
        </div>
      </div> -->

      <!--  v-show="distributionTo == 'wz'" -->
      <div>
        <div>
          <span>请选择地区：</span>
          <div>
            <el-select v-model="assignData.assignarea" class="input-required">
              <el-option v-for="(item, index) in area_option" :value="item.value" :label="item.label" :key="index"></el-option>
            </el-select>
          </div>
        </div>
        <div class="currency">
          <span>币种：</span>
          <div>
            <el-select v-model="assignData.profitcurrency" class="input-required">
              <el-option v-for="(item,index) in currency_option"
              :key="index"
              :label="item"
              :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="price">
          <span>卡车费：</span>
          <div>
            <el-input v-model="assignData.profitprice" class="input-required"></el-input>
            <span>总价</span>
          </div>
        </div>
        <!-- <div class="fpbl">
          <span>分泡比例：</span>
          <div>
            <p>
              销售站<el-input v-model="assignData.self_profitvalue" class="input-required"></el-input>
              操作站<el-input v-model="assignData.cus_profitvalue" class="input-required"></el-input>
            </p>
          </div>
        </div> -->
      </div>
      <div class="btn-c">
        <el-button @click="dialogVisible = false">取消返回</el-button>
        <el-button @click="confirmAssign">确认分配</el-button>
      </div>
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

      <LyOrderDetail :visible.sync="OrderDetailVisible" :id="cur_order_id" :guid="cur_guid" @delSuccess="deleteOrderFromTable" @assignSuccess="deleteOrderFromTable" :hideWage="true" :isAssign="true"></LyOrderDetail>

    </el-dialog>
  </div>
</template>

<script>
import { searCondition } from '../../api/localStorage.js'
import LyOrderDetail from './LyOrderDetail'

export default {
  name: 'LyOrderDistribution',
  components: {
    LyOrderDetail
  },
  data () {
    return {
      name:"OrderDistribution.vue",
      OrderDetailVisible: false,
      dialogVisible: false,
      area_option: [],
      currency_option: [],

      distributionTo: 'bz',
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
        yqpickupdate: {title: '完成时间', type: 15},
        yqfinishdate: {title: '提货时间', type: 15},
        addman: {title: '创建人', type: 1, whereStr: 'like'},
        adddate: {title: '创建日期', type: 15}
      },
      newFormCmptShow: false,
      inputModelData: {},
      searchData: {},

      assignData: {
        assignarea: '',
        assignCode: '',
        assigndom: '出口部',// 分配部门
        assignSystem: '联运',
        system: '联运',// 分配系统
        profitcurrency: '人民币',
        profitprice: '',
        profitmode: 'Co-Load模式',// 分配模式
        self_profitvalue: '',
        cus_profitvalue: ''
      }
    }
  },
  watch: {
    'assignData.assignarea' (newVal) {
      this.assignData.assignCode = this.getAreaCode(newVal)
    },
    dialogVisible (newVal) {
      if (newVal) {
        this.area_option = []
        let temp = []
        for(let i in this.PubTypecode){

          let typename = this.PubTypecode[i].typename.split('丨')
          if (typename[0] == this.$store.state.areaState) continue
          if(temp.indexOf(typename[0])==-1){
            this.area_option.push({label: this.PubTypecode[i].typename, value: typename[0]})
            temp.push(typename[0])
          }
        }
      }
    }
  },
  created () {
    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })

    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubTypecode',params:{groupid:101},loading:false,tip:false})
    .then(response=>{
      this.PubTypecode = response.data
      this.area_option = []
      let temp = []
      for(let i in this.PubTypecode){

        let typename = this.PubTypecode[i].typename.split('丨')
        if (typename[0] == this.$store.state.areaState) continue
        if(temp.indexOf(typename[0])==-1){
          this.area_option.push({label: this.PubTypecode[i].typename, value: typename[0]})
          temp.push(typename[0])
        }
      }
    })
  },
  methods: {
    getAreaCode (area) {
      for (let i in this.PubTypecode) {
        if (this.PubTypecode[i].typename.indexOf(area) !== -1) {
          return this.PubTypecode[i].typename.split('丨')[1]
        }
      }
    },
    deleteOrderFromTable (guids) {
      if (typeof guids == 'string') {
        guids = [guids]
      }
      this.tableDataRes = this.tableDataRes.filter((item, index) => {
        if (guids.includes(item.guid)) return false
        return true
      })
    },
    reset(){
      this.inputModelData = {}
    },
    search () {


      this.searchData.status = this.searchData.status || {in: '250'}
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
      .catch(errors=>{

      })
    },
    openDetail (row) {
      this.cur_order_id = row.id
      this.cur_guid = row.guid
      this.OrderDetailVisible = true
    },
    cancelAssign () {
      this.$confirm('是否取消分配', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.distributionTo = 'bz'
        this.assign()
      })
    },
    confirmAssign () {
      this.distributionTo = 'wz'
      this.assign()
    },
    assign () {
      let save_data = {
        ...this.assignData
      }

      if (this.distributionTo == 'wz') {
        if (!save_data.assignarea || !save_data.profitprice || !save_data.profitcurrency) {
          return this.$message.error('请填写完整信息')
        }
      } else if (this.distributionTo == 'bz') {
        save_data.assignarea = this.$store.state.areaState
        save_data.assignCode = this.getAreaCode(save_data.assignarea)
      }

      let ids = ''
      this.tableDataRes.forEach(row => {
        if (row.checked) ids += `${row.id},`
      })
      ids = ids.slice(0, -1)

      if (ids.length == 0) {
        return this.$message.error('请选择订单')
      }
      save_data.ids = ids

      //console.log(save_data)
      this.$axios({method:'post',url:this.$store.state.webApi+'api/exTransport/InsertExternalBatch',data:save_data,loading:true,tip:true})
      .then(results=>{
        //console.log(results)
        if (results.data.resultstatus == 0) {
          this.deleteOrderFromTable(ids.split(','))
          this.dialogVisible = false
          this.assignData.assignarea = ''
          this.assignData.assignCode = ''
          this.assignData.profitcurrency = '人民币'
          this.assignData.profitprice = ''
        } else {
          this.$message.error(results.data.resultmessage)
        }
      })
      .catch(errors=>{

      })
    }
  }
}
</script>

<style lang="less" scoped>
.LyOrderDistribution {
  .dialog {
    .assignSelect {
      margin-bottom: 30px;
    }
    div {
      margin-bottom: 8px;
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
        margin-right: 8px;
        width: 150px;
      }
    }
    .fpbl {
      .el-input {
        width: 60px;
        margin: 0 10px;
      }
    }
    .btn-c {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
