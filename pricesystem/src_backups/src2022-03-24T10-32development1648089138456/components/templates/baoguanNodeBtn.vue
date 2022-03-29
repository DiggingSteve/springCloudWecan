<template>
<div class="nodeBtn">
  <!-- {{childpgid}}
  {{orderpgid}} -->
  <!-- {{mawbinfo.old_sendhpoid}} -->
  <!-- {{bindeguid}} -->
  <el-button
    v-for="item in nodeBtn"
    :key="item.text"
    :disabled="item.disabled"
    @click="nodeFn(item)"
    :type="item.type">
    {{ item.text }}
  </el-button>

  <el-dialog
    :title="activeNodeBtn.text"
    append-to-body
    :visible.sync="nodewageVisible"
    :close-on-click-modal="false"
    class="taskFinish"
    width="400px"
    top="7%"
    center>

    <!-- <el-row v-if="activeNodeBtn.nodecode == 'AA0410'">
      <el-col :span="7" style="text-align: right;line-height: 28px;">
        供应商：
      </el-col>
      <el-col :span="12" :offset="3">
        <pageSelect :pagetype="3" :modelval.sync="nodeWage.gid" @change="pageSelectChange"></pageSelect>
      </el-col>
    </el-row> -->

    <el-row>
      <el-col :span="7" style="text-align: right;line-height: 28px;">
        操作人：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-input v-model="nodeWage.nodeman"></el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" style="text-align: right;line-height: 28px;">
        完成时间：
      </el-col>
      <el-col :span="12" :offset="3">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd hh:mm" format="yyyy-MM-dd hh:mm" v-model="nodeWage.nodedate" style="width: 175px;"></el-date-picker>
      </el-col>
    </el-row>

    <!-- <el-row style="margin-bottom: 14px;" v-if="hasWage">
      <el-col :span="7" style="text-align: right;line-height: 28px;">
        {{ wageText }}
      </el-col>
      <el-col :span="12" :offset="3">
        <el-input v-model="nodeWage.wage" v-verify="'float'"></el-input>
      </el-col>
    </el-row> -->

    <!-- <el-row class="wage-row" v-if="hasWage">
      <el-col :span="7">
        <el-select v-model="nodeWage.currency">
          <el-option v-for="(item,index) in currency_option"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12" :offset="3">
        <el-input v-model="nodeWage.wage" :placeholder="wageText" v-verify="'float'"></el-input>
      </el-col>
    </el-row> -->

    <el-row>
      <el-col style="text-align: center;">
        <el-button type="primary" @click="node_append"><span style="padding: 0 20px;">确认</span></el-button>
      </el-col>
    </el-row>

  </el-dialog>

</div>
</template>

<script>
import { getChangeRate, formatDate} from '../../api/localStorage.js'

export default {
  props: {
    // 总单guid
    mawbguid: {
      type: [Number, String],
      default: () => ''
    },
    boguid: {
      type: [Number, String],
      default: () => ''
    },
    orderpgid: {
      type: [Number, String],
      default: () => ''
    },
    childpgid: {
      type: [Number, String],
      default: () => ''
    },
    transport_guid: {
      type: String,
      default: () => ''
    },
    nodeList: {
      type: Array,
      default: () => []
    },
     mawbinfo: {
      type: Object,
      default: () => {}
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
    servicecode: {
      type: String,
      default: () => ''
    },
    serviceguid:[String,Number],
    // 服务项目名称
    itemsname: {
      type: String,
      default: () => ''
    },
    url: {
      type: String,
      default: () => 'api/ExAiraxpNode'
    },
    serviceNodeData: Array,
    isFinished: {
      type: Boolean,
      default: () => false
    },
    bindeguid:{
      type: [Number,String],
      default: () => -1
    },
    area:String
  },
  data () {
    return {
      currency_option: [],
      activeNodeBtn: {
        text: '',
        nodecode: []
      },
      nodewageVisible: false,

      nodeWage: {
        gid: '',
        settname: '',
        wage: '',
        currency: '人民币',
        nodeman: localStorage.getItem('usrname'),
        nodedate: formatDate(new Date(),'yyyy-MM-dd hh:mm')
      }
    }
  },
  computed: {
    wageText () {
      let text = ''
      switch (this.activeNodeBtn.nodecode[0]){
        // 仓库服务
        case 'AA0410':
          text = '仓储费'
          break
            case 'AG0145':
          text = '仓储费'
          break
        // 提货服务
        case 'AA0510':
          text = '卡车费'
          break
        // 报关服务
        case 'AA0610':
          text = '报关费'
          break
            case 'AG0150':
          text = '报关费'
          break
        default:
          text = '费用'
      }
      return text
    },
    baoguanNodeList () {
      return this.nodeList.filter(i => i.nodedom == '报关')
    },
    hasWage () {
      return !this.activeNodeBtn.text.includes('放行') && !this.activeNodeBtn.text.includes('收单') && !this.activeNodeBtn.text.includes('取消')
    },
    isSameStatus () {
      let status = null
      for (let i in this.jsxmData) {
        if (status == null) {
          status = this.jsxmData[i].status
        } else {
          if (status != this.jsxmData[i].status) {
            this.$message.error('节点状态不相同')
            return false
          }
        }
      }
      return true
    },
    nodeBtn () {

      if (this.servicecode !== '') {
        return [
          {text: this.isFinished ? '取消完成' : '任务完成', disabled: false, nodecode: [this.servicecode],type:this.isFinished ? 'danger' : 'primary'}
        ]
      }

      let Btn = [
        {text: '取消收单', disabled: false, nodecode: ['AO3015']},
        {text: '正报关', disabled: false, nodecode: ['AO3018']},
        {text: '可交付', disabled: false, nodecode: ['AO3070']},
        {text: '查验', disabled: false, nodecode: ['AO3020']},
        {text: '查验放行', disabled: false, nodecode: ['AO3030']},
        {text: '扣货', disabled: false, nodecode: ['AO3050']},
        {text: '扣货放行', disabled: false, nodecode: ['AO3060']},
        {text: '退关', disabled: false, nodecode: ['AO3040']}
      ]

      if (this.jsxmData.length == 0 || !this.isSameStatus) {
        return Btn.map(i => {
          if (i.text == '取消收单') i.text = '收单'
          i.disabled = true
          return i
        })
      }

      if (this.jsxmData.length >= 1) {
        let status = this.jsxmData[0].status

        if (status == 1) {
          // 未收单
          return Btn.map(i => {
            i.disabled = true
            if (i.text == '取消收单') {
              i.text = '收单'
              i.disabled = false
            }
            return i
          })
        } else if (status == 100) {
          // 已收单
          return Btn.map(i => {
            if (!(i.text == '正报关' || i.text == '查验' || i.text == '取消收单')) {
              i.disabled = true
            }
            return i
          })
        } else if (status == 150) {
          // 正报关
          return Btn.map(i => {
            if (i.text == '正报关') {
              i.text = '取消正报关'
            }
            if (!(i.text == '取消正报关' || i.text == '可交付')) {
              i.disabled = true
            }
            return i
          })
        } else if (status == 180) {
          // 可交付
          return Btn.map(i => {
            if (i.text == '可交付') {
              i.text = '取消可交付'
            } else {
              i.disabled = true
            }
            return i
          })
        } else if (status == 200) {
          // 已查验
          return Btn.map(i => {
            if (i.text == '查验') {
              i.text = '取消查验'
            }
            if (!(i.text == '取消查验' || i.text == '查验放行' || i.text == '扣货')) {
              i.disabled = true
            }
            return i
          })
        } else if (status == 300) {
          // 查验放行
          return Btn.map(i => {
            i.disabled = true
            if (i.text == '查验') {
              i.text = '取消查验'
            } else if (i.text == '查验放行') {
              i.text = '取消放行'
              i.disabled = false
            }
            return i
          })
        } else if (status == 400) {
          // 已退关
          return Btn.map(i => {
            i.disabled = true
            if (i.text == '查验') i.text = '取消查验'
            if (i.text == '扣货') i.text = '取消扣货'
            if (i.text == '退关') {
              i.text = '取消退关'
              i.disabled = false
            }
            return i
          })
        } else if (status == 500) {
          // 已扣货
          return Btn.map(i => {
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
        } else if (status == 600) {
          // 扣货放行
          return Btn.map(i => {
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
      }
    }
  },
  created () {
    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })

  },
  watch: {
    'nodewageVisible' (newVal) {
      if (newVal) {
        this.nodeWage.wage = ''
        this.nodeWage.currency = '人民币'
        this.nodeWage.nodeman = localStorage.getItem('usrname')
        this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
      }
    }
  },
  methods: {
    nodeFn (nodebtn) {
      if (this.jsxmData.length == 0) {
        return this.$message.error('无数据不能操作')
      }
      if (this.servicecode !== 'AA0410'&&this.servicecode !== 'AB0420'&&this.servicecode !== 'AG0145') {
        let text = ''
        if (this.servicecode == 'AA0510') text = '卡车'
        if (this.servicecode == 'AA0610'||this.servicecode == 'AG0150') text = '报关'
        for(let i in this.jsxmData) {
          if (!this.jsxmData[i].bggys && !this.jsxmData[i].bggysname) {
            return this.$message.error(`请补全${text}供应商`)
          }
        }
      }

      this.activeNodeBtn = nodebtn
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
        this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
        this.nodewageVisible = true
      }

    },
    node_append () {
      if (!this.activeNodeBtn.text.includes('取消')) {
        // if (this.hasWage && (!this.nodeWage.wage || !this.nodeWage.currency)) {
        //   return this.$message.error('请填写完整信息')
        // }
        // if (this.activeNodeBtn.nodecode[0] == 'AA0410') {
        //   if ( (this.nodeWage.gid && !this.nodeWage.wage) || (!this.nodeWage.gid && this.nodeWage.wage) ) {
        //     return this.$message.error('请填写完整信息')
        //   }
        // }
        if (!this.nodeWage.nodedate || !this.nodeWage.nodeman) {
          return this.$message.error('请填写完整信息')
        }
      }

      if (this.servicecode !== '') {
        this.finish()
        return
      }

      if (this.activeNodeBtn.text.includes('可交付')) {
        this.kjfFn()
        return
      }

      let save_data = {
        nodelist: [],
        boguid:this.boguid
      }
      save_data.wagetype = 5

      if (this.activeNodeBtn.text == '查验' || this.activeNodeBtn.text == '扣货' || this.activeNodeBtn.text == '退关') {
        if (this.nodeWage.wage) {
          save_data.wagelist = this.get_node_wage(this.activeNodeBtn.text + "费", this.nodeWage)
        }
      }

      let iscancel = false
      if (this.activeNodeBtn.text.includes('取消')) iscancel = true

      this.activeNodeBtn.nodecode.forEach(code => {
        let addnode = {
          nodecode: code
        }
        if (iscancel) {
          addnode.nodeman = localStorage.usrname
          addnode.nodedate = ''
        } else {
          addnode.nodeman = this.nodeWage.nodeman
          addnode.nodedate = this.nodeWage.nodedate
        }
        this.jsxmData.forEach(jsxm => {
          addnode = {...addnode, sid: jsxm.guid}
          save_data.nodelist.push(addnode)
        })

      })
      save_data.area=this.area||this.$store.state.areaState

      //console.log(save_data)

      this.$axios({method:'put',url:this.$store.state.webApi+this.url,data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.nodewageVisible = false

          // this.nodeList.forEach(item => {
          //   if (item.nodename == node.nodename) {
          //     item.nodedate = node.nodedate
          //     item.nodeman = node.nodeman
          //   }
          // })

          this.nodeWage.wage = ''
          this.nodeWage.nodeman = localStorage.getItem('usrname')
          this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')

          this.$emit('edit-node-success',true)
        }
      })
      .catch(errors=>{

      })
    },
    kjfFn () {
      let data = {
        hpoguid: this.mawbguid,
        boguid: this.boguid,
        declguid: this.jsxmData.map(i => i.guid).join(',')
      }
      // 可交付
      if (!this.activeNodeBtn.text.includes('取消')) {
        this.$axios({method:'put',url:this.$store.state.webApi+'api/SetCustomsStatus',data,loading:true,tip:true})
        .then(({ data }) => {
          if (data.resultstatus === 0) {
            this.nodewageVisible = false
            this.nodeWage.wage = ''
            this.nodeWage.nodeman = localStorage.getItem('usrname')
            this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')

            this.$emit('edit-node-success',true)
          }
        })
      } else {
        // 取消可交付
        this.$axios({method:'put',url:this.$store.state.webApi+'api/CancelCustomsStatus',data,loading:true,tip:true})
        .then(({ data }) => {
          if (data.resultstatus === 0) {
            this.nodewageVisible = false
            this.nodeWage.wage = ''
            this.nodeWage.nodeman = localStorage.getItem('usrname')
            this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')

            this.$emit('edit-node-success',true)
          }
        })
      }
    },
    finish () {
      let save_data = {
        servicelist: []
      }

      let iscancel = false
      if (this.activeNodeBtn.text.includes('取消')) iscancel = true

      if (this.activeNodeBtn.nodecode == 'AA0410' || this.activeNodeBtn.nodecode == 'AA0510'|| this.activeNodeBtn.nodecode == 'AG0145') {
        this.jsxmData.forEach(jsxm => {
          jsxm.storeList.forEach(item => {
            save_data.servicelist.push({
              nodeman: iscancel ? '' : this.nodeWage.nodeman,
              nodedate: iscancel ? '' : this.nodeWage.nodedate,
              servicecode: this.servicecode,
              sid: item.guid
            })
          })
        })
      } else {
        save_data.servicelist.push({
          nodeman: iscancel ? '' : this.nodeWage.nodeman,
          nodedate: iscancel ? '' : this.nodeWage.nodedate,
          servicecode: this.servicecode,
          sid: this.mawbguid
        })
      }

      save_data.servicelist.push({
        nodeman: iscancel ? '' : this.nodeWage.nodeman,
        nodedate: iscancel ? '' : this.nodeWage.nodedate,
        servicecode: this.servicecode,
        sid: this.serviceguid
      })

      save_data.wagetype = 5
      if (this.jsxmData.length !== 0 && !this.isFinished && this.nodeWage.wage) {
        save_data.wagelist = this.get_node_wage(this.itemsname, this.nodeWage, true)
      }
      save_data.sid=this.mawbguid
      save_data.boguid=this.boguid
      save_data.area=this.area||locationbar.area
      //console.log('保存')
      //console.log(save_data)
      if(this.servicecode){
         save_data.servicecode=this.servicecode
      }
    if(this.servicecode=='AA0510'){

          save_data.old_sendhpoid=this.mawbinfo.old_sendhpoid||-1
          save_data.bindeguid=this.bindeguid
    }
      this.$axios({method:'put',url: this.$store.state.webApi + this.url,data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {

          this.nodewageVisible = false

          this.nodeWage.wage = ''
          this.nodeWage.nodeman = localStorage.getItem('usrname')
          this.nodeWage.nodedate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')

          this.$emit('edit-node-success',true)
        }
      })
      .catch(errors=>{

      })
    },
    pageSelectChange (data) {
      this.nodeWage.settname = data.usr_name
    },
    get_node_wage (itemsname, nodeWage, isfinish) {
      let wagelist = []
      this.jsxmData.forEach(item => {
        wagelist.push({
          sid: item.boguid,
          otherguid: item.otherguid,
        //  guid: item.guid ? item.guid : undefined,
          isfree: 1,
          gid: (!item.orderpgid||item.orderpgid==-1)?item.gid:item.orderpgid,
          settname: item.wtxmname,
          items: itemsname,
          wagetype: '票',
          num: '1',
          price: nodeWage.wage,
          currency: nodeWage.currency,
          changerate: getChangeRate(nodeWage.currency),
         /*  leastwageall: nodeWage.wage,
          wageall: nodeWage.wage, */
          wageinout: 1,
          confirmstatus: 1,
          remark: '',
          wagedom: this.wagedom,
          parentguid: isfinish ? item.parentguid : undefined
        })
        wagelist.push({
          sid: item.boguid,
          otherguid: item.otherguid,
         // guid: item.guid ? item.guid : undefined,
          isfree: 1,
          gid: (!item.childpgid||item.childpgid==-1)?(this.activeNodeBtn.nodecode == 'AA0410'|| this.activeNodeBtn.nodecode == 'AG0145'? this.nodeWage.gid : item.bggys):item.childpgid,
          settname: this.activeNodeBtn.nodecode == 'AA0410'|| this.activeNodeBtn.nodecode == 'AG0145' ? this.nodeWage.settname : item.bggysname,
          items: itemsname,
          wagetype: '票',
          num: '1',
          price: nodeWage.wage,
          currency: nodeWage.currency,
          changerate: getChangeRate(nodeWage.currency),
     /*      leastwageall: nodeWage.wage,
          wageall: nodeWage.wage, */
          wageinout: 2,
          confirmstatus: 1,
          remark: '',
          wagedom: this.wagedom,
          parentguid: isfinish ? item.parentguid : undefined
        })
      })

      return wagelist
    }
  }
}
</script>

<style lang="less" scoped>
.taskFinish {
  .el-row {
    margin-bottom: 14px;
    .el-col:first-child {
      text-align: right;
      line-height: 28px;
    }
    /deep/ .el-input__inner {
      font-size: 12px;
    }
  }
  .wage-row {
    margin-bottom: 20px;
    .el-col:first-child {
      .el-select {
        width: 80px;
        height: 28px;
      }
    }
  }
}
</style>
