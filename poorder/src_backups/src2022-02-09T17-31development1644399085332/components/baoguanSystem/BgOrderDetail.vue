<template>
<div :class="['BgOrderDetail',{'iscancel': basicInformation.status >= 500 || basicInformation.creditisbackstatus == 4}]">
  
  <div class="node-c" :style="{height: showNode ? '80px' : '0'}" v-if="detailMethod == 'detail'">
    <div class="node">
      
      <el-button 
        v-if="!isAccept && basicInformation.status !== 600" 
        class="right-text" 
        @click="nodeDetailEdit">

        {{ nodeBtnEdit ? '保存' : '编辑' }}

      </el-button>

      <div class="content">
        <div class="item bg">
          <div>
            <p>报关</p>
          </div>
        </div>

        <div class="item" v-for="(node, index) in nodeList" :key="index">
          <template v-if="!nodeBtnEdit">
            <i :class="['el-icon-success',{'node-exist': node.nodedate.indexOf('1900') == -1}]"></i>
            <div>

              <div :style="{'display': 'block', margin: '0', overflow: 'hidden'}">
                <el-tooltip effect="light" :content="`操作人：${node.nodeman}`" placement="top-start">
                  <p :style="{'float': 'left'}">{{ node.nodename }}</p>
                </el-tooltip>
              </div>

              <p>{{ node.nodedate | nodeDataFormat }}</p>
              
            </div>
          </template>

          <template v-else-if="nodeBtnEdit && node.nodedate.indexOf('1900') == -1">
            <i class="el-icon-success node-exist"></i>
            <div>
              <div :style="{'display': 'inline', margin: '0', overflow: 'hidden'}">
                <el-tooltip effect="light" :content="`操作人：${node.nodeman}`" placement="top-start">
                  <p :style="{'float': 'left'}">{{ node.nodename }}</p>
                </el-tooltip>
              </div>
              <el-input v-if="nodeBtnEdit" class="nodeman" v-model="node.nodeman" placeholder="请输入操作人"></el-input>

              <el-date-picker 
                v-model="node.nodedate" 
                type="datetime" 
                v-if="nodeBtnEdit"
                :editable="false"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm" 
                format="yyyy-MM-dd HH:mm">
              </el-date-picker>
              
            </div>
          </template>

        </div>

      </div>
    </div>
  </div>

  <div class="title" v-if="detailMethod == 'detail'">
    <p>订舱编号：<span>{{ basicInformation.pono }}</span></p>
    <p v-if="basicInformation.creditcontent && basicInformation.creditisbackstatus !== 3"><span style="font-size:12px;">{{ `信控${getCreditisbackstatus(basicInformation.creditisbackstatus)}，${basicInformation.creditcontent}` }}</span></p>
    <p>操作人：<span>{{ basicInformation.modifyman }}</span></p>
    <p>操作时间：<span>{{ basicInformation.modifydate | dateFilter }}</span></p>
    <div>
      <template v-if="isAccept">
        <el-button type="primary" @click="batchAccept(200)">退回</el-button>
        <el-button type="primary" @click="batchAccept(100)">受理</el-button>
      </template>
      <el-button type="success" @click="profitVisible = true" v-if="showProfit">利润信息</el-button>
      <el-button type="success" @click="showNode = !showNode">节点信息</el-button>
    </div>
  </div>

  <div class="content">
    <div class="detail">
      <div class="detail-title">
        <p>基础信息</p>
      </div>
      <div class="detail-c basicInformation">

        <formCompt :input-view-data="inputViewData" :inputModelData="inputModelData" v-if="inputModelData.gid || detailMethod == 'add'"></formCompt>

        <el-row>
          <el-col :span="12" class="bggys">
            <span style="float:left;line-height: 28px;">报关供应商：</span>
            <pageSelect style="margin-left: 110px;width: 450px;" :pagetype="3" :modelval.sync="basicInformation.bggys" :area="basicInformation.area"></pageSelect>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" class="remark">
            <span>备注：</span>
            <el-input v-model="basicInformation.remark" type="textarea"></el-input>
          </el-col>
        </el-row>
      </div>

    </div>

    <wageComp 
      :class="{'isdel': basicInformation.canceltype == '误上榜'}"
      v-if="!hideWage && detailMethod == 'detail' && basicInformation.creditisbackstatus !== 4" 
      @savewageSuccess="getWageList" 
      @chargeConfirm="charge_confirm = $event"
      @paymentConfirm="payment_confirm = $event"
      :guid="guid" 
      :ChargeData="ChargeData" 
      :PaymentData="PaymentData" 
      :basicInformation="basicInformation"
      :weight="basicInformation.weight"
      :bggys="basicInformation.bggys"
      :wtxm="inputModelData.gid">
    </wageComp>

  </div>
  
  <div 
    :class="['footer', {'isdel': basicInformation.canceltype == '误上榜'}]"
    v-if="detailMethod == 'detail'">

    <el-row style="margin-left: 20px;margin-bottom: 40px;line-height: 30px;">
      <el-col :span="5">
        <p>创建人：<span>{{ basicInformation.addman }}</span></p>
      </el-col>
      <el-col :span="5">
        <p>创建时间：<span>{{ basicInformation.adddate | dateFilter }}</span></p>
      </el-col>
      <el-col :span="14">

        <nodeBtn 
          v-if="inAssignArea && basicInformation.status !== 600 && !isAccept && basicInformation.creditisbackstatus !== 4"
          :guid="guid" 
          :wageConfirm="charge_confirm || payment_confirm" 
          :node-list="nodeList" 
          :wagetype="3" 
          :jsxm-data="jsxmData" 
          @edit-node-success="edit_node_success">
        </nodeBtn>

      </el-col>
    </el-row>

    <div class="btn-c" v-if="isAccept || basicInformation.creditisbackstatus == 4">
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
      </div>

      <!-- <div class="right-btn">
      </div> -->
    </div>

    <div class="btn-c" v-else-if="isAssign">
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
      </div>

      <div class="right-btn">
        <el-button type="primary" @click="assignVisible = true">分配至外站</el-button>
        <el-button type="primary" @click="assignFn(3)">本站操作</el-button>
      </div>
    </div>

    <div class="btn-c" v-else>
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
        <el-button type="primary" style="background:red;" @click="orderCancel = true" v-if="basicInformation.status < 500">撤单</el-button>
        <el-button type="primary" @click="assignVisible = true" v-if="!inAssignArea && basicInformation.status < 300">分配</el-button>
      </div>
      
      <div class="right-btn">
        <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(basicInformation.status >= 800 ? 700 : 800)">
          {{ basicInformation.status >= 800 ? '取消结算' : '提交结算' }}
        </el-button>
        <!-- <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(basicInformation.status >= 1100 ? 800 : 1100)">
          {{ basicInformation.status >= 1100 ? '取消审核' : '提交并审核' }}
        </el-button> -->
        <!-- <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(800)">
          {{ '取消审核' }}
        </el-button> -->
        <el-button type="primary" @click="finish(basicInformation.finished ? 20 : 10)" v-if="basicInformation.status !== 600 && basicInformation.status < 800">
          {{ basicInformation.finished ? '取消完成' : '任务完成' }}
        </el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </div>
  </div>

  <div class="footer" v-else-if="detailMethod == 'add'">
    <div class="btn-c">
      <div class="left-btn">
        <el-button @click="reset_page">重置页面内容</el-button>
      </div>
      <div class="right-btn">
        <el-button type="primary" @click="self_operation(300, 1)">保存待分配</el-button>
        <el-button type="primary" @click="assignVisible = true">分配至外站</el-button>
        <el-button type="primary" @click="self_operation(400, 3, 'bz')">本站操作</el-button>
      </div>
    </div>
  </div>

  <el-dialog 
    title="分配" 
    append-to-body 
    :visible.sync="assignVisible"
    :close-on-click-modal="false"
    width="450px"
    top="7%"
    center>

    <assignwz :assign-data="assignData" :visible="assignVisible"></assignwz>

    <div style="margin-top: 40px;text-align:center;">
      <el-button @click="assignVisible = false">取消返回</el-button>
      <el-button @click="assignFn(2)">确认分配</el-button>
    </div>
  </el-dialog>

  <el-dialog 
    title="利润信息" 
    append-to-body 
    :visible.sync="profitVisible"
    width="350px"
    top="7%"
    center>

    <el-row style="margin-bottom: 20px;" v-if="!inAssignArea">
      <el-col :span="7" style="text-align: right;">
        分配站：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ basicInformation.assignarea }}
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        销售站：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ basicInformation.salesarea }}
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        部门：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ basicInformation.salesdom }}
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        分配模式：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ basicInformation.profitmode }}
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        币种：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ basicInformation.profitcurrency }}
      </el-col>
    </el-row>

    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        报关费：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        <span style="margin-right: 40px;">{{ basicInformation.profitprice }}</span>
        <span>总价</span>
      </el-col>
    </el-row>

  </el-dialog>
  
  <el-dialog
    :visible.sync="orderCancel"
    width="500px"
    top="4%"
    v-if="orderCancel"
    :close-on-press-escape="false"
    append-to-body
    :close-on-click-modal="false"
    center>

    <el-form>
      <el-form-item label="撤单类型：">
        <my-select :groupid="135" v-model='orderCancelForm.type'></my-select>
      </el-form-item>
      <el-form-item label='撤单理由：'>
        <el-input type="textarea" :rows="2" v-model="orderCancelForm.reason"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right;margin-top:12px;">
        <el-button @click="orderCancel = false">取消</el-button>
        <el-button type="primary" @click="cancelOrderFunc">确定</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</div>
</template>

<script>
import gysField from '../templates/gysField'
import wageComp from './wageComp'
import assignwz from './assignwz'
import nodeBtn from './nodeBtn'

function hawbVerify (event, item) {
  // 中文匹配
  let reg = /[\u3400-\u9FFF]+/g

  if (reg.test(item.model)) {
    item.model = item.model.slice(0, -1)
  }
}

export default {
  props: {
    method: {
      type: String,
      default: () => 'detail'
    },
    id: {
      type: Number
    },
    guid: {
      type: [Number,String]
    },
    visible: Boolean,
    hideWage: {
      type: Boolean,
      default: () => false
    },
    // 标记不同入口，切换详细中显示的内容
    isAccept: {
      type: Boolean,
      default: () => false
    },
    isAssign: {
      type: Boolean,
      default: () => false
    }
  },
  filters: {
    nodeDataFormat (value) {
      if (!value) return ''
      if (value.indexOf('1900') !== -1) {
        return '----:--:--'
      } else {
        let result = value.split(' ')
        return `${result[0]} ${result[1].slice(0,5)}`
      }
    }
  },
  components: {
    wageComp, gysField, assignwz, nodeBtn
  },
  data () {
    return {
      orderCancel: false,
      orderCancelForm: { // 撤单
        type: '',
        reason: '',
        del: 0
      },

      assignVisible: false,
      profitVisible: false,
      showNode: false,
      nodeBtnEdit: false,

      charge_confirm: false,
      payment_confirm: false,

      bglx_option: [],
      bggysmodel: '',

      inputModelData: {},
      inputViewData:[
        {"title":"业务类型：",id:"ywlx",type:3,"model":"",width:"50",class:'width100',"defaultModel":"出口报关",options:[{label: '出口报关', value: '出口报关'}, {label: '进口清关', value: '进口清关'}]},
        {"title":"报关类型：",id:"bglx",type:4,"model":"",width:"50",class:'width100',"defaultModel":"普货",options: [],groupid: 19},
        {"title":"委托客户：",id:"fid",type:11,"model":"",width:"50",class:'width100',"defaultModel":"", required: true, disabled: false},
        {"title":"项目：",id:"gid",type:10,"model":"",width:"50",class:'width100',"defaultModel":"", required: true, disabled: false},
        {"title":"总运单号：",id:"mawb",type:1,"model":"","defaultModel":"", verify: 'mawb'},
        {"title":"分运单号：",id:"hawb",type:1,"model":"","defaultModel":"", verify: hawbVerify},
        {"title":"航班日期：",id:"hbrq",type:6,"model":"","defaultModel":"",required: true, editable: false},
        {"title":"件数：",id:"piece",type:1,"model":"","defaultModel":"",required: true, verify: 'integer'},
        {"title":"重量：",id:"weight",type:1,"model":"","defaultModel":"",required: true, verify: 'float'},
        {"title":"连单数：",id:"lds",type:1,"model":"","defaultModel":"0",required: true, verify: 'integer'},
        {"title":"始发港：",id:"sfg",type:1,"model":"","defaultModel":"",required: true, verify: 'sfgmdg'},
        {"title":"目的港：",id:"mdg",type:1,"model":"","defaultModel":"",required: true, verify: 'sfgmdg'}
      ],

      basicInformation: {
        ywlx: '',
        bglx: '',
        gid: '',
        bggys: '',
        piece: '',
        weight: '',
        lds: '',
        sfg: '',
        mdg: '',
        mawb: '',
        hawb: '',
        remark: ''
      },
      
      ChargeData: [],
      PaymentData: [],

      nodeList: [],

      assignData: {
        assignarea: '',// 分配区域
        assigndom: '出口部',// 分配部门
        system: '报关',// 分配系统
        profitcurrency: '人民币',// 运费币种
        profitprice: '',// 价格
        profitmode: 'Co-Load模式',// 分配模式
        self_profitvalue: '',// 销售站利润分配比例
        cus_profitvalue: ''// 操作站利润分配比例
      },

      regionAreaAll: []
    }
  },
  computed: {
    detailMethod () {
      return !this.guid ? 'add' : this.method
    },
    showProfit () {
      return this.basicInformation.assignarea !== '' && this.basicInformation.salesarea !== this.basicInformation.assignarea && this.basicInformation.status !== 200
    },
    inAssignArea () {
      return (this.basicInformation.orderguid == '-1' && this.basicInformation.salesarea != this.basicInformation.assignarea) ? false : true
    },
    nodeDateList () {
      let date = {}
      this.nodeList.forEach(node => {
        if (node.nodedate.indexOf('1900') == -1) {
          date[node.nodename] = node.nodedate
        }
      })
      return date
    },
    jsxmData () {
      return [{
        gid: this.basicInformation.gid,
        wtxmname: this.basicInformation.wtxmname,
        bggys: this.basicInformation.bggys,
        bggysname: this.basicInformation.bggysname
      }]
    }
  },
  created () {
    if (this.detailMethod == 'detail') {
      this.inputViewData[2].disabled = true
      this.inputViewData[3].disabled = true
    }

    this.regionAreaAll = JSON.parse(sessionStorage.nav).filter(i => i.type == 5).map(i => i.regionarea)

    if (!this.$store.state.areaState.includes(',') && this.$store.state.areaState.length > 0) {
      this.inputModelData.sfg = this.regionAreaAll.find(i => i.includes(this.$store.state.areaState)).split('丨')[1]
    }

    this.$watch(
      () => this.inputModelData.piece,
      (newVal, oldVal) => {
        if (!newVal) return
        let num = Number(newVal)
        if (!Number.isInteger(num) || Number(num) <= 0) {
          this.$message.error('件数必须大于0')
          return
        }
      }
    )

    this.$watch(
      () => this.inputModelData.weight,
      (newVal, oldVal) => {
        if (!newVal) return
        let num = Number(newVal)
        if (isNaN(num) || num <= 0) {
          this.$message.error('重量必须大于0')
          return
        }
      }
    )

    this.$watch(
      () => this.inputModelData.lds,
      (newVal, oldVal) => {
        if (!newVal) return
        let num = Number(newVal)
        if (isNaN(num) || num < 0) {
          this.$message.error('连单数必须大于等于0')
          return
        }
      }
    )

    if (this.detailMethod == 'add') return

    // 基本信息
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExDecl',params: {guid: this.guid},loading:true,tip:false})
    .then(result=>{
      if (result.data) {
        this.basicInformation = result.data
  
        this.inputViewData.forEach(item => {
          
          if (item.id == 'fid') {
            this.inputModelData[item.id] = Number(result.data['wtkhid'])
          } else if (item.id == 'gid') {
            this.inputModelData[item.id] = Number(result.data['gid'])
          } else if (result.data[item.id]) {
            this.inputModelData[item.id] = result.data[item.id]
          }
        })
        
        this.bggysmodel = result.data.bggysname
      }
    })
    
    // 费用
    this.getWageList()

    // 节点
    let nodeparam = {
      guid: this.guid,
      boguid: this.guid,
      area: this.$store.state.areaState,
      system: '报关'
    }
    this.$axios({method: 'get',url:this.$store.state.webApi+'api/ExAiraxpNode',params: nodeparam,loading:false,tip:false})
    .then(result=>{
      result.data.splice(-1)
      this.nodeList = result.data.filter(i => {
        if (i.nodename == '已受理') return false
        return true
      })
    })

  },
  methods: {
    reset_page () {
      Object.keys(this.basicInformation).forEach(i => {
        this.basicInformation[i] = ''
      })
      this.inputModelData = {}
      
      if (!this.$store.state.areaState.includes(',') && this.$store.state.areaState.length > 0) {
        this.inputModelData.sfg = this.regionAreaAll.find(i => i.includes(this.$store.state.areaState)).split('丨')[1]
      }
    },
    cancelOrderFunc () {
      if (this.basicInformation.status == 600) {
        return this.$message.error('订单已撤单')
      }
      if (this.basicInformation.status == 1) {
        return this.$message.error('未受理状态无法撤单')
      }
      //console.log(this.orderCancelForm)
      let data = {
        ...this.orderCancelForm,
        guid: this.basicInformation.guid,
      }
      data.type == '误上榜' ? data.del = 1 : ''

      //console.log(data)
      this.$axios({method: 'post',url:this.$store.state.webApi+'api/ExDeclRevokeOrder',data: data,loading:false,tip: true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.orderCancel = false
          this.$emit('cancelOrderSuccess', this.basicInformation.guid)
          this.back()
        }
      })
    },
    getWageList () {
      // 费用
      this.$axios({method: 'get',url:this.$store.state.webApi+'api/ExDeclWage',params:{sid: this.guid},loading:false,tip:false})
      .then(result=>{
        if (result.data.length > 0) {
          this.ChargeData = []
          this.PaymentData = []
          
          result.data.forEach(item => {
            if (Number.isInteger(item.changerate)) item.changerate = Number(item.changerate).toFixed(2)
            if (Number.isInteger(item.leastwageall)) item.leastwageall = Number(item.leastwageall).toFixed(2)
            if (Number.isInteger(item.wageall)) item.wageall = Number(item.wageall).toFixed(2)
            if (item.wageinout == 1) {
              this.ChargeData.push(item)
            } else if (item.wageinout == 2) {
              this.PaymentData.push(item)
            }
          })

        }
      })
    },
    back () {
      this.$emit('update:visible', false)
    },
    del () {
      // if (this.charge_confirm || this.payment_confirm) {
      //   return this.$message.error('费用确认后无法删除订单')
      // }
      // if (this.basicInformation.status == 100) {
      //   return this.$message.error('已受理的订单不可删除')
      // }
      this.$confirm(`是否撤单`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExDecl',data: {guid: this.guid, mainorder: this.basicInformation.mainorder},loading:true,tip:true})
        .then(result=>{
          if (result.data.resultstatus == 0) {
            this.$emit('update:visible', false)
            this.$emit('deleteorder', this.guid)
          }
        })
        .catch(error=>{

        })
        
        // let save_data = {
        //   nodelist: [{
        //     nodecode: 'BG5065',
        //     nodeman: localStorage.usrname,
        //     nodedate: new Date().toLocaleString('chinese',{hour12:false})
        //   }]
        // }
        
        // this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAiraxpNode',data: save_data,loading:false,tip:true})
        // .then(result=>{
        //   if (result.data.resultstatus == 0) {

        //   }
        // })
      }).catch(() => {
        
      })
    },
    finish (status) {
      //任务完成
      // if (status == 10) {
      //   if (this.basicInformation.status == 1) {
      //     return this.$message.error('未受理状态不能任务完成')
      //   }
      //   if (this.basicInformation.status == 150) {
      //     return this.$message.error('未分配状态不能任务完成')          
      //   }
      //   if (this.charge_confirm && this.payment_confirm) {
      //     return this.$message.error('费用未确认无法任务完成')
      //   }
      // }
      
      // let save_data = {
      //   nodelist: [
      //     {
      //       nodecode: 'BG5060',
      //       sid: this.basicInformation.guid,
      //       nodedate: new Date().toLocaleString('chinese',{hour12:false}), //new Date().toLocaleString('chinese',{hour12:false})
      //       nodeman: localStorage.usrname
      //     }
      //   ]
      // }
      let save_data = {
        nodecode: 'BG5060',
        status: status,
        guid: this.basicInformation.guid
      }
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDeclFinish',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.basicInformation.status = 500
          this.basicInformation.finished = true
        }
      })
      .catch(errors=>{

      })

    },
    save (status) {
      let save_data = {...this.basicInformation}
      
      this.inputViewData.forEach(item => {
        if (item.id == 'wtkh') return
        if (item.id == 'gid' && typeof item.model == 'string') return
        save_data[item.id] = item.model
      })

      if (!save_data['gid'] || !save_data['hbrq'] || !save_data['piece'] || !save_data['weight'] || !save_data['lds'] || !save_data['sfg'] || !save_data['mdg']) {
        this.$message.error('请填写完整信息')
        return
      }
      
      if (status !== undefined) {
        save_data.status = status
      }
      if (status == 600) {
        save_data.modifyman = localStorage.usrname
        // save_data.modifydate = new Date().getTime().toLocaleString().replace(/[上午|下午]/g, '')
      }

      save_data.czman = localStorage.usrname
      //console.log(save_data)

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDecl',data: [save_data],loading:true,tip:true})
      .then(results=>{
        if (results.data.resultstatus == 0) {
          // this.back()
        }
      })
      .catch(errors=>{

      })
    },
    submit (status) {

      let save_data = {
        submittype: 3,
        guid: this.guid,
        area: this.$store.state.areaState,
        system: '报关',
        status: status
      }

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplineSubmit',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.basicInformation.status = status
        }
        //console.log(result)
        // this.back()
      })
      .catch(errors=>{

      })
    },
    self_operation (status, addtype, assign) {
      let save_data = {...this.basicInformation}
      
      this.inputViewData.forEach(item => {
        if (item.id == 'wtkh') return
        save_data[item.id] = item.model
      })
      if (!save_data['gid'] || !save_data['hbrq'] || !save_data['piece'] || !save_data['weight'] || !save_data['lds'] || !save_data['sfg'] || !save_data['mdg']) {
        this.$message.error('请填写完整信息')
        return
      }

      if (assign == 'wz') {
        //  || !this.assignData.self_profitvalue || !this.assignData.cus_profitvalue
        if (!this.assignData.assignarea || !this.assignData.profitprice) {
          this.$message.error('请填写完整信息')
          return
        }
      }

      save_data.status = status
      save_data.addtype = addtype

      save_data = {...save_data, ...this.assignData}
      save_data.salesarea = this.$store.state.areaState  // 销售地
      save_data.salesname = localStorage.getItem('usrname')  // 销售人
      save_data.salesdom = localStorage.getItem('dom') || '出口部'  // 销售部门

      if (status == 400 && assign == 'bz') {
        save_data.assignarea = this.$store.state.areaState
      }
      
      save_data.salessystem = '报关'
      save_data.assignsystem = '报关'

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExDecl',data: save_data,loading:true,tip:false})
      .then(result=>{
        function success () {
          this.reset_page()
          this.$emit('update:visible', false)
          if (assign == 'bz') {
            this.$emit('openDetailDialog', {
              guid: result.data.resultguid,
              id: result.data.resultid
            })
          }
        }

        if (result.data.resultstatus == 0) {
          this.$alert('订单创建成功，订舱编号为'+result.data.resultno, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              success.call(this)
            }
          });
        } else if (result.data.resultstatus == 99) {
          this.$alert(result.data.resultmessage, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              success.call(this)
            }
          });
        } else {
          this.$message.error(result.data.resultmessage)
        }
      })
      .catch(errors=>{

      })
    },
    batchAccept (status) {
      let accept_data = {guids: this.basicInformation.guid, status: status, czmandepart: localStorage.dom, mainorder: this.basicInformation.mainorder}
      
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDeclAcceptance',data: accept_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.$emit('update:visible', false)
          this.$emit('acceptSuccess')
        }
      })
    },
    assignFn (addtype) {
      if (!this.basicInformation.guid) {
        return this.self_operation(400, 2, 'wz')
      }
      
      let save_data = {...this.basicInformation}

      this.inputViewData.forEach(item => {
        if (item.id == 'fid') return
        if (item.id == 'gid' && typeof item.model == 'string') return
        save_data[item.id] = item.model
      })

      if (!save_data['gid'] || !save_data['hbrq'] || !save_data['piece'] || !save_data['weight'] || !save_data['lds'] || !save_data['sfg'] || !save_data['mdg']) {
        this.$message.error('请填写完整信息')
        return
      }

      if (addtype == 2) {
        if (!this.assignData.assignarea || !this.assignData.profitprice) {
          return this.$message.error('请填写完整信息')
        }
      }

      save_data.addtype = addtype
      save_data.czman = localStorage.usrname
      save_data.assignsystem = '报关'

      for (let key in this.assignData) {
        if (key == 'salesarea' || key == 'salesname' || key == 'salesdom') continue
        save_data[key] = this.assignData[key]
      }

      if (addtype == 3) {
        save_data.assignarea = this.$store.state.areaState
      }
      
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExDecl',data: [save_data],loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.$emit('update:visible', false)
          this.$emit('assignSuccess')
        }
      })
      .catch(error=>{

      })
    },
    gysdata (data) {
      this.basicInformation.bggys = Number(data.id)
    },
    edit_node_success () {
      // 获取费用
      this.$axios({method: 'get',url:this.$store.state.webApi+'api/ExDeclWage',params:{sid: this.guid},loading:false,tip:false})
      .then(result=>{
        this.ChargeData = []
        this.PaymentData = []
        result.data.forEach(item => {
          if (item.wageinout == 1) {
            this.ChargeData.push(item)
          } else if (item.wageinout == 2) {
            this.PaymentData.push(item)
          }
        })
      })
    },
    nodeDetailEdit () {
      if (!this.nodeBtnEdit) {
        return this.nodeBtnEdit = true
      }

      let save_data = {
        boguid: this.basicInformation.guid,
        nodelist: []
      }

      for (let i in this.nodeList) {
        if (!this.nodeList[i].nodedate.includes('1900')) {
          save_data.nodelist.push(this.nodeList[i])
        }
      }

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAiraxpNode',data: save_data,loading:false,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.nodeBtnEdit = false
        }
      })
    },
    getCreditisbackstatus (value) {
      if(String(value).length){
        if(value==3){
          return '已通过'
        }else if(value==4){
          return '待通过'
        } else if (value == 5) {
          return '已驳回'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.BgOrderDetail {
  @nodeheight: 80px;
  .node-c {
    height: @nodeheight;
    margin-bottom: 16px;
    transition: .4s height;
    overflow: hidden;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    .node {
      height: @nodeheight;
      border: 1px solid #ccc;
      position: relative;
      .right-text {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .content {
        margin-top: 14px;
        overflow: hidden;
        .item {
          float: left;
          position: relative;
          margin: 0 20px;
          i {
            position: absolute;
            top: 14px;
            color: #cccccc;
            &::before {
              font-size: 20px;
            }
          }
          .node-exist {
            color: #5daf34;
          }
          div {
            margin-left: 30px;
            p {
              line-height: 24px;
              color: #868686;
            }
            .nodeman {
              width: 70px;
              display: block;
              margin-left: 50px;
            }
            /deep/ .el-date-editor {
              margin-left: 0;
              width: 120px;
              span {
                display: none;
              }
              .el-input__inner {
                padding: 0 10px;
              }
            }
          }
        }
        .bg {
          margin-left: 20px;
          div {
            p {
              line-height: 48px;
              font-size: 18px;
            }
          }
        }
      }
    }
  }

  > .title {
    overflow: hidden;
    margin-bottom: 10px;
    p {
      float: left;
      margin-right: 30px;
      font-size: 14px;
    }
    div {
      float: right;
      // button {
      //   background: #009900;
      //   color: white;
      //   border: none;
      // }
    }
    span {
      color: red;
    }
  }

  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
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
      span {
        cursor: pointer;
        color: #8f8f8f;
      }
      .active {
        color: #0f5a8c;
      }
    }
    .detail-c {
      padding: 20px;
    }

    .basicInformation {
      .bggys, .remark {
        margin-bottom: 16px;
        span {
          display: inline-block;
          width: 106px;
          text-align: right;
          vertical-align: top;
        }
        .el-textarea {
          width: 87%;
        }
      }
    }

  }

  .node-status {
    .el-row {
      margin-bottom: 10px;
      &:first-child {
        text-align: center;
      }
      .el-col {
        margin-right: 30px;
      }
      .el-date-editor {
        width: 100%;
      }
    }
  }

  .footer {
    margin: 20px 0;
    .btn-c {
      margin: 20px 0;
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
      .node-btn {
        float: left;
        margin-left: 40px;
      }
    }
  }

  &.iscancel {
    .content .detail {
      cursor: not-allowed;
      .basicInformation {
        pointer-events: none;
        /deep/ .el-input__suffix-inner {
          pointer-events: none;
        }
      }
    }
    .isdel {
      cursor: not-allowed;
      /deep/ .wageInformation {
        pointer-events: none;
      }
      .right-btn {
        pointer-events: none;
      }
    }
  }
}
</style>
