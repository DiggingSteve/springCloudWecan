<template>
<div class="nodeBtn">
  <el-button 
    v-for="item in nodeBtn" 
    :key="item.text" 
    :disabled="item.disabled || jsxmData.length == 0"
    @click="nodeFn(item)"
    type="primary">
    {{ item.text }}
  </el-button>
  
  <el-dialog 
    :title="activeNode.text" 
    append-to-body 
    :visible.sync="nodewageVisible"
    :close-on-click-modal="false"
    width="400px"
    top="7%"
    center>

    <el-row style="margin-bottom: 14px;" v-if="hasWage">
      <el-col :span="7" style="text-align: right;">
        费用：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-input v-model="nodeWage.wage" v-verify="'fixedThree'"></el-input>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 14px;" v-if="hasWage">
      <el-col :span="7" style="text-align: right;">
        币种：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-select v-model="nodeWage.currency">
          <el-option v-for="(item,index) in currency_option"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 14px;">
      <el-col :span="7" style="text-align: right;">
        操作人：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-input v-model="nodeWage.czman"></el-input>
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 14px;">
      <el-col :span="7" style="text-align: right;">
        完成时间：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" v-model="nodeWage.nodedate" style="width: 175px;"></el-date-picker>
      </el-col>
    </el-row>

    <el-row>
      <el-col style="text-align: center;">
        <el-button type="primary" @click="node_append"><span style="padding: 0 20px;">确认</span></el-button>
      </el-col>
    </el-row>

  </el-dialog>
  
</div>  
</template>

<script>
import { getChangeRate } from '../../api/localStorage.js'

export default {
  props: {
    guid: {
      type: [Number, String],
      required: true
    },
    nodeList: {
      type: Array,
      default: () => []
    },
    jsxmData: {
      type: Array,
      required: true
    },
    wagetype: {
      type: [Number, String]
    },
    wagedom: {
      type: String,
      default: () => '报关'
    },
    // 费用确认状态
    wageConfirm: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      currency_option: [],
      activeNode: {
        text: '',
        disabled: '',
        nodecode: ''
      },
      nodewageVisible: false,

      nodeWage: {
        wage: '',
        currency: '人民币',
        czman: localStorage.getItem('usrname'),
        nodedate: new Date().toLocaleString('chinese',{hour12:false})
      }
    }
  },
  computed: {
    hasWage () {
      return !this.activeNode.text.includes('放行') && !this.activeNode.text.includes('收单') && !this.activeNode.text.includes('取消')
    },
    nodeDateList () {
      let date = {}
      this.nodeList.forEach(node => {
        if (node.nodedate !== '' && node.nodedate.indexOf('1900') == -1) {
          date[node.nodename] = node.nodedate
        }
      })
      return date
    },
    nodeBtn () {
      let result = []
      let date = this.nodeDateList

      let Btn = [
        {text: '取消收单', disabled: false, nodecode: 'BG0015'},
        {text: '一次放行', disabled: false, nodecode: 'BG0070'},
        {text: '查验', disabled: false, nodecode: 'BG0020'},
        {text: '查验放行', disabled: false, nodecode: 'BG0030'},
        {text: '扣货', disabled: false, nodecode: 'BG0050'},
        {text: '扣货放行', disabled: false, nodecode: 'BG0060'},
        {text: '退关', disabled: false, nodecode: 'BG0040'}
      ]
      result = Btn

      let datelen = Object.keys(date).length

      if (datelen == 0) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '取消收单') {
            i.disabled = false
            i.text = '收单'
          }
          return i
        })
      }
      if (date['已收单']) {
        result = Btn.map(i => {
          if (!(i.text == '一次放行' || i.text == '查验')) {
            i.disabled = true
          }
          return i
        })
      }
      if (date['已查验']) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '查验') {
            i.text = '取消查验'
          }
          if (i.text == '取消查验' || i.text == '查验放行' || i.text == '扣货') {
            i.disabled = false
          }
          return i
        })
      }
      if (date['一次放行']) {
        result = Btn.map(i => {
          if (i.text == '一次放行') {
            i.text = '取消放行'
          } else {
            i.disabled = true
          }
          return i
        })
      }
      if (date['查验放行']) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '查验') {
            i.text = '取消查验'
          } else if (i.text == '查验放行') {
            i.text = '取消放行'
            i.disabled = false
          }
          return i
        })
      }
      if (date['已扣货']) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '查验') i.text = '取消查验'
          if (i.text == '扣货') {
            i.text = '取消扣货'
            i.disabled = false
          }
          if (i.text == '扣货放行') i.disabled = false
          if (i.text == '退关') i.disabled = false
          return i
        })
      }
      if (date['扣货放行']) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '查验') i.text = '取消查验'
          if (i.text == '扣货') i.text = '取消扣货'
          if (i.text == '扣货放行') {
            i.text = '取消放行'
            i.disabled = false
          }
          return i
        })
      }
      if (date['已退关']) {
        result = Btn.map(i => {
          i.disabled = true
          if (i.text == '查验') i.text = '取消查验'
          if (i.text == '扣货') i.text = '取消扣货'
          if (i.text == '退关') {
            i.text = '取消退关'
            i.disabled = false
          }
          return i
        })
      }
      
      return result
    }
  },
  created () {
    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })
  },
  methods: {
    nodeFn (nodebtn) {
      for(let i in this.jsxmData) {
        if (this.jsxmData[i].bggys == -1 || !this.jsxmData[i].bggys) {
          return this.$message.error('请输入报关供应商')
        }
      }

      if (this.wageConfirm) {
        return this.$message.error('费用确认后无法操作节点')
      }
      this.activeNode = nodebtn
      let iscancel = false
      if (nodebtn.text.indexOf('取消') !== -1) {
        iscancel = true
      }

      if (iscancel) {
        this.$confirm(`是否${nodebtn.text}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.node_append()

        }).catch(() => {
          
        })
      } else {
        this.nodewageVisible = true
        this.nodeWage.nodedate = new Date().toLocaleString('chinese',{hour12:false})
      }

    },
    node_append () {
      let date = this.nodeDateList
      let addwage = false

      let save_data = {
        boguid: this.guid,
        nodelist: []
      }

      if (this.hasWage) {
        // if (!this.nodeWage.wage || !this.nodeWage.currency) {
        //   return this.$message.error('请填写完整信息')
        // }
        save_data.wagetype = this.wagetype
        // save_data.wagelist = this.get_node_wage(this.activeNode.text, this.nodeWage)
        addwage = true
      }
      if (!this.nodeWage.czman || !this.nodeWage.nodedate) {
        return this.$message.error('请填写完整信息')
      }

      let node, iscancel = false

      if (this.activeNode.text.indexOf('取消') !== -1) {
        iscancel = true
        node = this.nodeList.find(item => {
          return item.nodecode == this.activeNode.nodecode
        })

      } else {
        node = this.nodeList.find(item => {
          return item.nodecode == this.activeNode.nodecode
        })
      }
      
      node = {...node}

      if (iscancel) {
        node.nodedate = ''
      } else {
        node.nodedate = this.nodeWage.nodedate        
      }
      node.nodeman = this.nodeWage.czman
      
      save_data.nodelist.push(node)
      
      //console.log(save_data)

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAiraxpNode',data: save_data,loading:false,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.nodeList.forEach(item => {
            if (item.nodename == node.nodename) {
              item.nodedate = node.nodedate
              item.nodeman = node.nodeman
            }
          })

          if (addwage && this.nodeWage.wage) {
            let save_data = this.get_node_wage(this.activeNode.text, this.nodeWage)[0]

            this.$axios({method: 'post',url:this.$store.state.webApi+'api/ExDeclWage',data:save_data,loading:false,tip:false})
            .then(result=>{
              if (result.data.resultstatus == 0) {
                this.$emit('edit-node-success',true)
              }
            })
          }

          this.nodewageVisible = false

          this.nodeWage.wage = ''
          this.nodeWage.czman = localStorage.getItem('usrname'),
          this.nodeWage.nodedate = new Date().toLocaleString('chinese',{hour12:false})

        }
      })
      .catch(errors=>{

      })
    },
    get_node_wage (activename, nodeWage) {
      let wagelist = []
      this.jsxmData.forEach(item => {
        // wagelist.push({
        //   sid: this.guid,
        //   isfree: 2,
        //   gid: item.gid,
        //   items: activename + '费',
        //   wagetype: '票',
        //   num: '1',
        //   price: nodeWage.wage,
        //   currency: nodeWage.currency,
        //   changerate: getChangeRate(nodeWage.currency),
        //   leastwageall: nodeWage.wage,
        //   wageall: nodeWage.wage,
        //   wageinout: 1,
        //   confirmstatus: 1,
        //   remark: '',
        //   wagedom: this.wagedom
        // })
        wagelist.push({
          sid: this.guid,
          isfree: 1,
          gid: item.bggys,
          items: activename + '费',
          wagetype: '票',
          num: '1',
          price: nodeWage.wage,
          currency: nodeWage.currency,
          changerate: getChangeRate(nodeWage.currency),
          leastwageall: nodeWage.wage,
          wageall: nodeWage.wage,
          wageinout: 2,
          confirmstatus: 1,
          remark: '',
          wagedom: this.wagedom
        })
      })
      
      return wagelist
    }
  }
}
</script>

<style lang="less" scoped>

</style>
