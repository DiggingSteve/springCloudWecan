<template>
  <div class="wage-detail">
    <div class="detail-title">
      <p>费用信息</p>
    </div>
    <div class="detail-c wageInformation">
      <div class="charge">
        <div class="header">
          <div class="title">应收费用</div>
          <div class="header-right">
            <p>应收总额：{{ charge_total }} 元</p>
            <p>总盈利：{{ profit_total }} 元</p>
            <div class="right-btn">
              <el-button type="primary" :disabled="charge_confirm" @click="confirm(1, 700)">应收确认</el-button>
              <el-button type="primary" :disabled="basicInformation.status < 500 || basicInformation.status >= 800" @click="confirm(1, 1)">取消确认</el-button>
              <el-button type="primary" :disabled="!charge_confirm" @click="costBill(1)">应收对账</el-button>
            </div>
          </div>
        </div>
        <div class="content">

          <commonTable class="commonTable" :head="charge_table_model" :table-data="ChargeData.filter(i => i.yssys !== 2)" :tableIndex="0">
            <template slot="firstTd" slot-scope="props">
              <td>
                <i class="icon-save" @click="saveCost(1)" title="保存"></i>
                <i class="el-icon-close" @click="delCurCost(cur_charge, 1)" title="删除"></i>
              </td>
              <td></td>
              <td>
                <input type="checkbox" v-model="cur_charge.isfree">
              </td>
              <td style="display:inline-block;border:none;width:200px;">
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <!-- <pageSelect :pagetype="2" :modelval.sync="cur_charge.gid" :area="basicInformation.area"></pageSelect> -->
                  <pageSelect :pagetype="2" :modelval.sync="cur_charge.gid" :ifRefreshData.sync="ifRefreshData" :area="basicInformation.area" :fid="basicInformation.wtkhid">
                    <template slot="other">
                      <jsdxwh :fid="basicInformation.wtkhid" :area="basicInformation.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
                    </template>
                  </pageSelect>
              </td>
              <td>
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <page-select :modelval.sync="cur_charge.items" :pagetype="5"></page-select>
              </td>
              <td>
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <el-select v-model="cur_charge.wagetype" style="width:120px;" size="mini">
                  <el-option v-for="(item, index) in wagetype_option" :value="item.typename" :label="item.typename" :key="index"></el-option>
                </el-select>
              </td>
              <td>
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <el-input v-model="cur_charge.num" v-verify="'float'" style="width:75px;"></el-input>
              </td>
              <td>
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <el-input v-model="cur_charge.price" v-verify="'float'" style="width:75px;"></el-input>
              </td>
              <td>
                <!--  :disabled="basicInformation.orderfrom == '外部'" -->
                <el-select v-model="cur_charge.currency" style="width:90px;" size="mini">
                  <el-option v-for="(item,index) in currency_option"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_charge.leastwageall" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_charge.wageall" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_charge.changerate" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input v-model="cur_charge.remark" style="width:120px;"></el-input>
              </td>

            </template>
            <template slot="operate" slot-scope="props" v-if="!(props.data.row.confirmstatus >= 700)">
              <i class="el-icon-setting" @click="editCost(props.data.index, 1, props.data.row)" title="编辑"></i>
              <i class="el-icon-delete" @click="delCost(props.data.index, 1, props.data.row)" title="删除"></i>
            </template>
            <template slot="isfree" slot-scope="props">
              {{ props.data.value | isfreeformat }}
            </template>
            <template slot="settname" slot-scope="props">
              {{ props.data.value | settnameFormat }}
            </template>
            <template slot="confirmstatus" slot-scope="props">
              {{ props.data.value | wageStatusFormat }}
            </template>

          </commonTable>
        </div>
      </div>
      <div class="payment">
        <div class="header">
          <div class="title">应付费用</div>
          <div class="header-right">
            <p>应付总额：{{ payment_total }} 元</p>
            <div class="right-btn">
              <el-button type="primary" :disabled="payment_confirm" @click="confirm(2, 700)">应付确认</el-button>
              <el-button type="primary" :disabled="basicInformation.status < 500 || basicInformation.status >= 800" @click="confirm(2, 1)">取消确认</el-button>
            </div>
          </div>
        </div>
        <div class="content">

          <commonTable class="commonTable" :head="payment_table_model" :table-data="PaymentData.filter(i => i.yssys !== 2)" :tableIndex="1">
            <template slot="firstTd" slot-scope="props">
              <td>
                <i class="icon-save" @click="saveCost(2)" title="保存"></i>
                <i class="el-icon-close" @click="delCurCost(cur_payment, 2)" title="删除"></i>
              </td>
              <td></td>
              <td>
                <input type="checkbox" v-model="cur_payment.isfree">
              </td>
              <td style="display:inline-block;border:none;width:200px;">

                <pageSelect :pagetype="3" :modelval.sync="cur_payment.gid" :area="basicInformation.area"></pageSelect>
              </td>
              <td>
                <page-select :modelval.sync="cur_payment.items" :pagetype="5"></page-select>
              </td>
              <td>
                <el-select v-model="cur_payment.wagetype" style="width:120px;">
                  <el-option v-for="(item, index) in wagetype_option" :value="item.typename" :label="item.typename" :key="index"></el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="cur_payment.num" v-verify="'float'" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input v-model="cur_payment.price" v-verify="'float'" style="width:75px;"></el-input>
              </td>
              <td>
                <el-select v-model="cur_payment.currency" style="width:90px;">
                  <el-option v-for="(item,index) in currency_option"
                  :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_payment.leastwageall" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_payment.wageall" style="width:75px;"></el-input>
              </td>
              <td>
                <el-input :disabled="true" v-model="cur_payment.changerate" style="width:70px;"></el-input>
              </td>
              <td>
                <el-input v-model="cur_payment.remark" style="width:120px;"></el-input>
              </td>

            </template>
            <template slot="operate" slot-scope="props" v-if="!(props.data.row.confirmstatus >= 700)">
              <i class="el-icon-setting" @click="editCost(props.data.index, 2, props.data.row)" title="编辑"></i>
              <i class="el-icon-delete" @click="delCost(props.data.index, 2, props.data.row)" title="删除" v-if="paymentWageCanDelete(props.data.row)"></i>
            </template>
            <template slot="isfree" slot-scope="props">
              {{ props.data.value | isfreeformat }}
            </template>
            <template slot="settname" slot-scope="props">
              {{ props.data.value | settnameFormat }}
            </template>
            <template slot="confirmstatus" slot-scope="props">
              {{ props.data.value | wageStatusFormat }}
            </template>

          </commonTable>
        </div>
      </div>
    </div>

    <el-dialog
      title="对账"
      append-to-body
      :visible.sync="confirmVisible"
      width="1350px"
      top="4%"
      center>

      <reconMngDetail :jobid="guid" :wageinout="confirm_wageinout" :area="basicInformation.area" :system="'报关'" v-if="confirmVisible" @unVisible='confirmVisible=false'></reconMngDetail>

    </el-dialog>
  </div>
</template>

<script>

import reconMngDetail from '../orderDetails/reconMngDetail'
import { getChangeRate } from '../../api/localStorage.js'

export default {
  props: {
    guid: {
      type: [Number,String],
      required: true
    },
    ChargeData: {
      type: Array,
      default: () => []
    },
    PaymentData: {
      type: Array,
      default: () => []
    },
    bggys: {},
    wtxm: {},
    weight: {},
    basicInformation: {}
  },
  components: {
     reconMngDetail
  },
  filters: {
    isfreeformat (value) {
      return value == 1 ? '否' : '是'
    },
    wageStatusFormat (value) {
      switch (value){
        case 700:
          return '已确认'
          break
        case 800:
          return '已提交'
          break
        case 1100:
          return '已对账'
          break
        default:
          return ''
      }
    },
    settnameFormat (value) {
      return value && value.split('-')[1]
    }
  },
  data () {
    return {
      confirm_wageinout: '1',
      confirmVisible: false,
      ifRefreshData: false,

      wagetype_option: [],
      currency_option: [],

      charge_table_model: [
        {field: "operate", title: "操作",width: ''},
        {field: "confirmstatus", title: "状态"},
        {field: "isfree", title: "免"},
        {field: "settname", title: "结算项目"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "结算方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        {field: "remark", title: "备注"}
      ],
      cur_charge: {
        isfree: false,
        confirmstatus: '',
        gid: '',
        settname: '',
        items: '',
        wagetype: '',
        num: '',
        price: '',
        currency: '人民币',
        leastwageall: '',
        wageall: '',
        changerate: '',
        remark: '',
        wagedom: '报关'
      },
      payment_table_model: [
        {field: "operate", title: "操作"},
        {field: "confirmstatus", title: "状态"},
        {field: "isfree", title: "免"},
        {field: "settname", title: "结算项目"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "结算方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        {field: "remark", title: "备注"}
      ],
      cur_payment: {
        isfree: false,
        confirmstatus: '',
        gid: '',
        settname: '',
        items: '',
        wagetype: '',
        num: '',
        price: '',
        currency: '人民币',
        leastwageall: '',
        wageall: '',
        changerate: '',
        remark: '',
        wagedom: '报关'
      }
    }
  },
  computed: {
    charge_total () {
      return this.ChargeData.reduce((i, data) => {
        if (data.isfree == 2) return i
        return (i+Number(data.wageall))
      },0).toFixed(2)
    },
    payment_total () {
      return this.PaymentData.reduce((i, data) => {
        if (data.isfree == 2) return i
        return (i+Number(data.wageall))
      },0).toFixed(2)
    },
    profit_total () {
      return (Number(this.charge_total) - Number(this.payment_total)).toFixed(2)
    },
    charge_confirm () {
      if (this.ChargeData.length == 0) {
        return false
      } else {
        return this.ChargeData.every(item => {
          return item.confirmstatus >= 700
        })
      }
    },
    payment_confirm () {
      if (this.PaymentData.length == 0) {
        return false
      } else {
        return this.PaymentData.every(item => {
          return item.confirmstatus >= 700
        })
      }
    }
  },
  watch: {
    'charge_confirm' (newVal) {
      this.$emit('chargeConfirm', newVal)
    },
    'payment_confirm' (newVal) {
      this.$emit('paymentConfirm', newVal)
    },
    'cur_charge.wagetype' (newVal) {
      if (newVal == '票') {
        this.cur_charge.num = 1
      } else if (newVal == '计重' || newVal == '结算重量' || newVal == '毛重') {
        this.cur_charge.num = this.weight
      }
    },
    'cur_charge.currency': {
      handler (newVal) {
        this.cur_charge.changerate = getChangeRate(newVal) || 0
      },
      immediate: true
    },
    'cur_payment.wagetype' (newVal) {
      if (newVal == '票') {
        this.cur_payment.num = 1
      } else if (newVal == '计重' || newVal == '结算重量' || newVal == '毛重') {
        this.cur_payment.num = this.weight
      }
    },
    'cur_payment.currency': {
      handler (newVal) {
        this.cur_payment.changerate = getChangeRate(newVal) || 0
      },
      immediate: true
    },
    'bggys': {
      handler (newVal) {
        this.cur_payment.gid = newVal
      },
      immediate: true
    },
    'wtxm': {
      handler (newVal) {
        this.cur_charge.gid = newVal
      },
      immediate: true
    }
  },
  created () {
    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })

    let groupIdData=JSON.parse(localStorage.getItem('groupType'))
    groupIdData.forEach(item=>{
      if(item.groupid==33){
        this.wagetype_option.push({value:item.id,typename:item.typename})
      }
    })

    this.$watch(
      function () {
        return this.cur_charge.num + this.cur_charge.price + this.cur_charge.currency
      },
      function (newVal, oldVal) {
        var leastwageall= Number(this.cur_charge.num) * Number(this.cur_charge.price)
        this.cur_charge.wageall = (leastwageall * Number(this.cur_charge.changerate)).toFixed(2) || 0
        this.cur_charge.leastwageall = leastwageall.toFixed(2) || 0
      }
    )

    this.$watch(
      function () {
        return this.cur_payment.num + this.cur_payment.price + this.cur_payment.currency
      },
      function (newVal, oldVal) {
        var leastwageall= Number(this.cur_payment.num) * Number(this.cur_payment.price)
        this.cur_payment.wageall = (leastwageall * Number(this.cur_payment.changerate)).toFixed(2) || 0
        this.cur_payment.leastwageall = leastwageall.toFixed(2) || 0
      }
    )
  },
  methods: {
    saveCost (wageinout) {
      if (this.basicInformation.status >= 800) {
        return this.$message.error('提交结算后无法新增费用')
      }
      // if ( (wageinout == 1 && this.charge_confirm) || (wageinout == 2 && this.payment_confirm) ) {
      //   return this.$message.error('费用确认后无法删除、修改和新增费用')
      // }
      // if (wageinout == 1 && this.basicInformation.orderfrom == '外部' && !this.cur_charge.guid) {
      //   return this.$message.error('外站订单无法新增应收费用')
      // }
      let cur_data = wageinout == 1 ? this.cur_charge : this.cur_payment

      if (!cur_data.gid || !cur_data.items || !cur_data.wagetype || !cur_data.num || !cur_data.price || !cur_data.currency) {
        return this.$message.error('请填写完整信息')
      }

      let save_data = Object.assign({}, cur_data)

      save_data.isfree = save_data.isfree ? 2 : 1

      if (!save_data.guid) {
        save_data.wageinout = wageinout
        save_data.confirmstatus = 1
        save_data.sid = this.guid
      }

      new Promise((resolve, reject) => {
        if (save_data.guid) {
          this.$axios({method: 'put',url:this.$store.state.webApi+'api/ExDeclWage',data:save_data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })
        } else {
          this.$axios({method: 'post',url:this.$store.state.webApi+'api/ExDeclWage',data:save_data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })
        }
      })
      .then((result) => {
        if (result.data.resultstatus == 0) {
          let cur_data = null
          if (wageinout == 1) {
            cur_data = this.cur_charge
          } else if (wageinout == 2) {
            cur_data = this.cur_payment
          }

          Object.keys(cur_data).forEach(key => {
            if (key == 'guid') return this.$delete(cur_data, key)
            if (key == 'gid' || key == 'changerate') return
            if (key == 'currency') return cur_data[key] = '人民币'
            cur_data[key] = key == 'isfree' ? false : ''
          })

          this.$emit('savewageSuccess')
        }
      })

    },
    delCurCost (cur_data, wageinout) {
      Object.keys(cur_data).forEach(key => {
        switch(key) {
          case 'isfree':
            cur_data[key] = false
            break
          case 'currency':
            cur_data[key] = '人民币'
            break
          case 'gid':
            cur_data[key] = wageinout == 1 ? this.wtxm : this.bggys
            break
          case 'changerate':
            break
          default:
            cur_data[key] = ''
        }
      })
    },
    editCost (index, wageinout, row) {
      // if ( (wageinout == 1 && this.charge_confirm) || (wageinout == 2 && this.payment_confirm) ) {
      //   return this.$message.error('费用确认后无法删除、修改和新增费用')
      // }
      if (this.basicInformation.status >= 800) {
        return this.$message.error('提交结算后无法编辑费用')
      }

      if (wageinout == 1) {
        this.cur_charge = {...this.ChargeData.filter(i => i.yssys !== 2)[index]}
        this.cur_charge.isfree = this.cur_charge.isfree == 2 ? true : false
      } else if (wageinout == 2) {
        this.cur_payment = {...this.PaymentData.filter(i => i.yssys !== 2)[index]}
        this.cur_payment.isfree = this.cur_payment.isfree == 2 ? true : false
      }
    },
    delCost (index, wageinout, row) {
      // if ( (wageinout == 1 && this.charge_confirm) || (wageinout == 2 && this.payment_confirm) ) {
      //   return this.$message.error('费用确认后无法删除、修改和新增费用')
      // }
      if (this.basicInformation.status >= 800) {
        return this.$message.error('提交结算后无法删除费用')
      }

      this.$confirm('是否删除费用信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFn.call(this)

      }).catch(() => {

      })

      function delFn () {
        if (this.method == 'add') {
          if (wageinout == 1) {
            this.ChargeData.splice(index, 1)
          } else if (wageinout == 2) {
            this.PaymentData.splice(index, 1)
          }
          return
        }

        new Promise((resolve, reject) => {
          let data = null
          if (wageinout == 1) {
            data = {guid: this.ChargeData.filter(i => i.yssys !== 2)[index].guid, sid: this.guid}
          } else if (wageinout == 2) {
            data = {guid: this.PaymentData.filter(i => i.yssys !== 2)[index].guid, sid: this.guid}
          }
          this.$axios({method: 'delete',url:this.$store.state.webApi+'api/ExDeclWage',data: data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })

        }).then((result) => {
          if (result.data.resultstatus == 0) {
            if (wageinout == 1) {
              this.ChargeData.splice(index+1, 1)

            } else if (wageinout == 2) {
              for (let i in this.ChargeData) {
                if (this.ChargeData[i].isshare == row.guid) {
                  this.ChargeData.splice(i, 1)
                  break
                }
              }
              this.PaymentData.splice(index+1, 1)
            }
          }
        })

      }
    },
    paymentWageCanDelete (row) {
      let guid = row.guid
      for (let i in this.ChargeData) {
        if (this.ChargeData[i].isshare == guid && this.ChargeData[i].confirmstatus >= 700) {
          return false
        }
      }
      return true
    },
    confirm (wageinout, confirm) {
      if (wageinout == 1) {
        for (let i of this.ChargeData) {
          if (i.yssys !== 2 && i.wageall == 0) {
            return this.$message.error('金额为0无法费用确认')
          }
        }
      }
      if (wageinout == 2) {
        for (let i of this.PaymentData) {
          if (i.yssys !== 2 && i.wageall == 0) {
            return this.$message.error('金额为0无法费用确认')
          }
        }
      }

      let confirmData = null

      if (wageinout == 1) {
        confirmData = this.ChargeData
      } else if (wageinout == 2) {
        confirmData = this.PaymentData
      }

      this.$confirm(`是否${confirm == 1 ? '取消确认' : '进行确认'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          sid: this.guid,
          status: confirm,
          wageinout: wageinout,
          wagedom: '报关'
        }
        this.$axios({method: 'put',url:this.$store.state.webApi+'api/ExDeclConfirm',data: data,loading:true,tip:true})
        .then(result=>{
          if (result.data.resultstatus == 0) {
            if (confirm == 1) {
              confirmData.forEach(item => {
                item.confirmstatus == 700 ? item.confirmstatus = 1 : ''
              })
            } else {
              confirmData.forEach(item => {
                item.confirmstatus == 1 ? item.confirmstatus = 700 : ''
              })
            }
          }
        })

      }).catch(() => {

      })

    },
    costBill (wageinout) {
      this.confirm_wageinout = String(wageinout)
      this.confirmVisible = true
    },
    jsxmdata (jsxm, wageinout) {
      if (wageinout == 1) {
        this.cur_charge.gid = jsxm.id
        this.cur_charge.settname = jsxm.jsxmdata
      } else if (wageinout == 2) {
        this.cur_payment.gid = jsxm.id
        this.cur_payment.settname = jsxm.jsxmdata
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wage-detail {
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
  /deep/ .commonTable {
    div {
      padding-bottom: 0 !important;
    }
    i {
      margin: 0 3px;
    }
    .fwxmField {
      /deep/ .el-input__inner {
        width: 90px;
      }
    }
  }
  .detail-title {
    height: 36px;
    line-height: 36px;
    text-indent: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #0f5a8c;
    background: #f8f8f8;
    border-bottom: 1px solid #e8e8e8;
  }
  .detail-c {
    padding: 20px;
  }

  .charge, .payment {
    margin: 10px 0;
    .header {
      position: relative;
      .title, .title + div{
        display: inline-block;
        height: 35px;
        line-height: 35px;
        padding-left: 10px;
      }
      .title {
        position: relative;
        color: white;
        margin-right: 30px;
        &:after {
          position: absolute;
          top: 0;
          right: -40px;
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-right: 40px solid transparent;
        }
      }
      .header-right {
        p {
          display: inline-block;
          margin-right: 50px;
        }
        .right-btn {
          position: absolute;
          top: -5px;
          right: 0;
        }
      }
    }
    .content {
      padding: 20px;
    }
  }
  .charge {
    @chargecolor: #00cc00;
    margin-bottom: 30px;
    .title {
      background: @chargecolor;
      &:after {
        border-bottom: 35px solid @chargecolor;
      }
    }
    .header-right {
      p:first-child {
        color: @chargecolor;
        + p {
          color: #FF9900;
        }
      }
    }
    .content {
      border: 1px solid @chargecolor;
    }
  }
  .payment {
    @paymentcolor: #ff3300;
    .title {
      background: @paymentcolor;
      &:after {
        border-bottom: 35px solid @paymentcolor;
      }
    }
    .header-right {
      p:first-child {
        color: @paymentcolor;
      }
    }
    .content {
      border: 1px solid @paymentcolor;
    }
  }
}
</style>
