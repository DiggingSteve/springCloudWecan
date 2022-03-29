import {
  getChangeRate,
  computedWeight,
  formatDate
} from "@/api/localStorage.js";
//const urlPre=location.href.indexOf('wffmanagement')!='-1'?this.$store.state.wcWebApi:this.$store.state.webApi
export const setBhiconColor = function (status, type = 1) { //返回驳回图标的颜色与标题
  //type 1返回颜色 2返回title
  if (!status && status != 0) return ''
  let color = "#333";
  let title = "未发起"
  switch (status) {
    case 0:
      color = '#999'
      title = "发起驳回的原始数据"
      break;
    case -1:
      color = '#272727'
      title = "未发起"
      break;
    case 100:
      color = '#FF9600';
      title = "驳回未处理"
      break;
    case 110:
      color = '#FF9600';
      title = "外站驳回未处理"
      break;
    case 200:
      color = '#EB0000';
      title = "驳回不同意"
      break;
    case 210:
      color = '#EB0000';
      title = "外站驳回不同意"
      break;
    case 500:
      color = '#0EB000';
      title = "驳回已同意"
      break;
    case 510:
      color = '#0EB000';
      title = "外站驳回已同意"
      break;
    // case 800:
    //   color = '#2356FD';
    //   title = "驳回已处理"
    //   break;
    case 600:
      color = '#EB0000'
      title = "已删除"
      break;
  }
  return type == 1 ? {
    color: color,
    cursor: 'pointer',
    fontSize: '14px',
    width: '14px',
    height: '14px',
    background: status == -1 ? '' : '#fff',
    borderRadius: '50%'
  } : title;
}
export const setBhiconColorMixin = { //在客服，结算，航线驳回中使用
  data() {
    return {

    }
  },
  methods: {
    resetJieshuanWagedom(row, mawbinfo) { //发起驳回的时候，如果wagedom是结算,需要重置为航线或者客服
      // console.log(row)
      // console.log(mawbinfo)
      let wagedom = row.wagedom
      // console.log(row.wagedom, row.status == -1)
      // console.log(mawbinfo.czlx)
      if (row.wagedom == '结算' && row.status == -1) {
        if (mawbinfo.czlx == '代操作' || mawbinfo.islocal == 2) {
          wagedom = '客服'
        } else {
          if (row.servicecode == 'OA0010' && ['航司运费', '航司中转费', '航司战争附加费', '航司燃油附加费', '锂电池操作费'].includes(row.items)) {
            wagedom = '航线'
          } else {
            if (['航司分单信息费', '分单制作费', '航司总单信息费', '总单制单费', '数据传输费', '小货操作费', '航司信息更改费', '航司杂费', '拆板费', '空仓费', '纸质总运单费', '危险品附加费', '空运手续费', '换单费'].includes(row.items)) {
              wagedom = row.wageinout == 1 ? '客服' : '航线'
            } else {
              wagedom = '客服'
            }
          }
        }
      //  console.log(row.servicecode)
      //  console.log(row.items)
        if (row.servicecode == 'AA0240' && ['货站地面服务费', '货站地面费'].includes(row.items)) {
          wagedom = mawbinfo.czlx == '自货' ? '航线' : '客服'
        }
      }
      return wagedom
    },
    closeBohuiDialog() {
      this.rollbackreason = '';
      this.wageBohuiData = [];
      this.childBohuiChecked = 0;
      this.childBohuiCheckedList = [0];
      if (this.ifNeedFrashWage) {
        if (location.href.indexOf('wffmanagement') != '-1') {
          this.parent.fetchData()
        } else {
          if (this.name == 'reconMngDetail') {
            this.parent.getReconDeatil()
            //alert('1')
          } else if (this.name == 'singleDz') {
            this.parent.singleDz()
          } else {
            if(this.name!='tzOperation'){
               if (this.parent) {
                this.$parent.$parent.$parent.mawbCost()
               } else {
                this.parent.mawbCost()
              }
            }else{
              this.parent.search()
            }
          }
        }
        this.ifNeedFrashWage = false;
      }
    },
    // setBhiconColor(status, type = 1) {
    //   return setBhiconColor(status, type)
    // },
    setBhiconColor,
    spanstyle(color = 'rgb(102,102,102)', checked = false) {
      if (color == 'black') {
        color = "rgb(102,102,102)"
      }
      if (color == 'red') {
        color = "rgb(235,0,0)"
      }
      if (color == 'green') {
        color = "rgb(14,176,0)"
      }
      if (color == 'blue') {
        color = "rgb(14,121,223)"
      }
      let c = color.replace(/[rgb|(|)]/ig, '')
      if (checked) {
        return {
          color: '#fff',
          background: `rgba(${c},1)`
        }
      } else {
        return {
          color: `rgba(${c},0.7)`,
          background: `rgba(${c},0.1)`
        }
      }
    },
    handleClickBohui(tab) {
      let index = typeof (tab) == "object" ? Number(tab.index) : tab
      this.childBohuiChecked = index
      if (!this.childBohuiCheckedList.includes(index)) {
        this.childBohuiCheckedList.push(index)
      }
    },
    async getBohuiWageDetail(row, type = 1) { //获取驳回详细数据
      //type 1单条 2多选
      let urlPre = location.href.indexOf('wffmanagement') != '-1' ? this.$store.state.wcWebApi : this.$store.state.webApi
      let guid = row.guid || row.wageguid;
      let boguid = -1;
      let wagedomObj = {
        10: '客服',
        20: '航线',
        30: '结算',
        35: '结算',
        40: '经理',
        50: '结算对账时',
        60: '调账',
        70: 'D/N制作',
        75: 'D/N审核',
      };
      // 唯凯结算对象驳回中无法显示，默认此条费用的结算对象
      if(this.initiator=='40'){
        if(JSON.parse(window.xmdata).filter(i=>i.id==row.gid)[0]['usr_name'].indexOf('唯凯')>=0){
          this.mawbInfo.wtxmname=row.wtkhname.split('-')[1]
        }
      }
      //console.log(this.ponoDetail.boguid)
      if (type == 2) {

        guid = location.href.indexOf('wffmanagement') != '-1' ? row.map(i => i.wageguid).toString() : row.map(i => i.guid).toString()
      } else {
        if (row.status == 100 || row.status == 200 || row.status == 110 || row.status == 210 || row.status == 500) {
          boguid = location.href.indexOf('wffmanagement') != '-1'||this.basicInfo&&this.basicInfo.oldid ? this.basicInfo.oldid : this.allmaindata.boguid
        }
      }
      return await this.$axios({
        method: "get",
        url: urlPre + 'api/ExBoBaseWageReject',
        params: {
          guid: guid,
          wagedom: wagedomObj[this.initiator] || '',
          boguid: boguid
        },
        loading: true,
        tip: false
      }).then(res => {
        // console.log('驳回详细')
        // console.log(res.data)
        // console.log(row)
        if (res.data.length) {
          this.wageBohuiData = res.data;
          this.bohuiVisible = true;
          if (type == 1 && res.data.length > 1) {
            this.handleClickBohui({
              index: res.data.findIndex(i => i.guid == row.guid)
            })
          }
        }
        //return new 
        return res.data
      })
    },
  },
  computed: {
    isSponsor() { //是否是发起方
      return this.initiator == 30 || this.initiator == 35 || this.initiator == 40 || this.initiator == 50 || this.initiator == 60 || this.initiator==75
    }
  }
}
export const wageTableOper = {

  data() {
    return {

    }
  },
  created() {
    this.$watch(
      function () {
        return this.editData.num + this.editData.price + this.editData.currency;
      },
      function (newVal, oldVal) {
        let leastwageall =
          Number(this.editData.num || 0) * Number(this.editData.price || 0);
        this.editData.wageall =
          (leastwageall * Number(this.editData.changerate)).toFixed(2) || 0;
        this.editData.leastwageall = leastwageall.toFixed(2) || 0;
      }
    );
  },
  watch: {
    "editData.currency": {
      handler(val) {
        this.editData.changerate = getChangeRate(val) || 0;
      },
      immediate: true
    },
    "editData.wagetype"(val) {
      if (
        (this.tableData[this.putIndex] &&
          this.tableData[this.putIndex].wagetype) == val
      ) {
        return;
      }
      switch (val) {
        case "总运单票数":
          this.editData.num = 1;
          break;
        case "总运单件数":
          this.editData.num = this.mawbinfo.zdpiece;
          break;
        case "分运单票数":
          this.editData.num = this.mawbinfo.hawbnum;
          break;
        case "箱":
          this.editData.num = this.mawbinfo.realpiece;
          break;
        case "票":
          this.editData.num = "1";
          break;
        case "计重":
          this.editData.num = computedWeight(
            this.mawbinfo.zdvolume,
            this.mawbinfo.zdweight
          );
          break;
        case "结算重量":
          this.editData.num =
            this.wageinout == 1 ?
            this.mawbinfo.accountweightin :
            this.mawbinfo.accountweightout;
          break;
        case "毛重":
          this.editData.num = this.mawbinfo.realweight;
          break;
      }
    }
  }
}

export const myCommonTable = { //费用驳回的弹窗
  mixins: [wageTableOper, setBhiconColorMixin],
  props: {
    guid: '', //单条费用的guid,用来查询
    mawbinfo: Object,
    temptype: { //模板应用的类型 1 正常 2 合并 3
      type: [String, Number],
      default: 1
    },
    area:String,
    initiator: {
      type: [Number, String],
      default: -1
    }, //驳回发起方(30/40),"receiver":驳回操作方（10/20）;10客服 操作方 20航线 操作方 30操作站结算 发起方 35 销售站结算  发起方 40经理 发起方
    wagetype: {
      type: [String, Number],
      default: 1 //1应收 2应付
    },
    tableIndex: {
      type: [String, Number],
      default: 0
    },
    wageBohuiData: {
      type: Object,
      default: {}
    },
    servicecode: {
      type: String,
      default: ""
    },
    ifPiliangBohui: { //是否是批量发起驳回
      type: Boolean,
      default: false
    },
    ifNeedFrashWage: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    isFromFob:{
      type: String,
      default: ""
    }
  },
  data() {
    return {
      editData: {
        isfree: '1',
        rollbackman: '',
        rollbackdate: '',
        wagedom: "",
        settname: "",
        gid: null,
        items: "",
        wagetype: "",
        num: "",
        price: "",
        currency: "人民币",
        leastwageall: 0,
        wageall: 0,
        changerate: "1.0000",
        remark: ""
      }, //编辑行数据
      tableHead: [{
          title: "操作",
          field: "operate"
        },
        {
          title: "操作人",
          field: "rollbackman"
        },
        {
          title: "操作时间",
          field: "rollbackdate",
          formatType: 1,
          format: 'yyyy-MM-dd hh:mm'
        },
        {
          title: "驳回状态",
          field: "status",
          formatType: 2,
          format: x => setBhiconColor(x, 2),
          tdStyleFunc: (x => x == 500 ? {
            color: 'green'
          } : x == 200 || x == 210 ? {
            color: 'red'
          } : '')
        },
        {
          title: "流向",
          field: "fromTo"
        },
        {
          title: "免",
          field: "isfree",
          formatType: 2,
          format: (x => x == 2 ? '是' : '否')
        },
        {
          title: "结算对象",
          field: "gid",
          formatType: 3
        },
        {
          title: "服务项目",
          field: "items"
        },
        {
          title: "结算方式",
          field: "wagetype"
        },
        {
          title: "数量",
          field: "num"
        },
        {
          title: "单价",
          field: "price",
          formatType: 2,
          format: x => Number(x).toFixed(2)
        },
        {
          title: "币种",
          field: "currency"
        },
        {
          title: "金额",
          field: "leastwageall",
          formatType: 2,
          format: x => Number(x).toFixed(2)
        },
        {
          title: "RMB金额",
          field: "wageall",
          formatType: 2,
          format: x => Number(x).toFixed(2)
        },
        {
          title: "汇率",
          field: "changerate"
        },
        {
          title: "备注",
          field: "remark"
        }
      ],
      tableData: [],
      // wageBohuiData: {}, //外面费用列表驳回的行数据
      reasonInput: true, //驳回理由
      rollbackStatus: -1, //驳回状态
      historyPane: true,
      // wageRejectDetail:[],
      ifRefreshData: false,
      putIndex: -1,
    }
  },
  computed: {
    parent() {
      return this.$parent.$parent
    },
    wagedom() {
      switch (this.initiator) {
        case '10':
          return '客服'
          break;
        case '20':
          return '航线'
          break;
        case '30':
          return '结算'
        case '35':
          return '结算'
          break;
        case '40':
          return '经理'
          break;
        case '50':
          return '结算对账时'
          break;
        case '60':
          return '调账'
          break;
        case '70':
          return 'D/N制作'
        break;
        case '75':
          return 'D/N审核'
        break;
        default:
          return ''
          break;
      }
    }
  },
  created() {
    this.initWageFormData()
  },
  methods: {
    initWageFormData() {
      this.reasonInput = true
      this.rollbackStatus = -1
      this.historyPane = true
      this.putIndex = -1
      this.tableData = []
      let data = this.wageBohuiData && this.wageBohuiData.wagecommitlist
      let lastrow = data[data.length - 1]
      if ((this.wageBohuiData.status == -1 || this.wageBohuiData.status == 500 || this.wageBohuiData.status == 510) && this.isSponsor) {
        this.putIndex = data.length - 1
        this.editData = {
          ...lastrow
        }
        this.$set(this.editData, 'rollbackreason', '');
      }
      this.tableData = data
      this.positionTr(-1)
      if (this.wageBohuiData.status != -1 && this.wageBohuiData.status != 500 && this.wageBohuiData.status != 510) {
        this.reasonInput = false
      }
      if (this.wageBohuiData.status == 500 || this.wageBohuiData.status == 510) {
        if (this.isSponsor) {
          this.historyPane = false
        } else {
          this.reasonInput = false
        }
      }
    },
    initFunc() {
      this.editData = {
        isfree: '1',
        rollbackman: '',
        rollbackdate: '',
        wagedom: "",
        settname: "",
        gid: null,
        items: "",
        wagetype: "",
        num: "",
        price: "",
        currency: "人民币",
        leastwageall: 0,
        wageall: 0,
        changerate: "1.0000",
        remark: "",
        rollbackreason: ''
      };
      this.putIndex = -1;
    },
    jsxmdata(data) {
      this.editData.settname = data.usr_name;
    },
    formatDate(d, f) {
      return formatDate(d, f)
    },
    wageBohuiFunc() {
      //type 1申请驳回  2执行驳回
      //status  :驳回/同意（200/500）
      let method = "post";
      let json = {};
      json = {
        ...this.editData
      }
      if (!json.rollbackreason && this.rollbackStatus != 500) {
        return this.$message.error('请填写驳回理由!')
      }

      json.wagedom = this.resetJieshuanWagedom(json, this.mawbinfo);
      console.log(json.wagedom)

      if (this.rollbackStatus != -1) {
        method = "put";
        json.status = this.rollbackStatus;
      }
      json.czman = localStorage.usrname

      if (this.isSponsor) {
        //console.log(this.isSponsor)
        //alert('1')
        json.initiator = json.initiator=='40'||json.initiator=='50'||json.initiator=='60'?json.initiator:this.initiator
      }
      //console.log(json)
      this.rollbackApi(json, method)
    },
    wageBohuiFuncAgree(data) { //同意
      let json = {
        ...data
      }
      json.status = 500;
      json.czman = localStorage.usrname
      //console.log(json)
      this.rollbackApi(json, 'put');
    },
    async rollbackApi(json, method, type) {
      let methodNow = location.href.indexOf('wffmanagement') != '-1' || json.initiator == '40' || json.initiator == '50'|| json.initiator == '60'? 'POST' : method
      let urlPre = location.href.indexOf('wffmanagement') != '-1' ? this.$store.state.wcWebApi : this.$store.state.webApi
      let api = location.href.indexOf('wffmanagement') != '-1' || json.initiator == '40' || json.initiator == '50' || json.initiator == '60'? 'api/WageReject/Reject' : this.isFromFob?'api/ExCostCheckFobReject':'api/ExBoBaseWageReject'
      json.isfree = (json.isfree == '是' || json.isfree == 2) ? 2 : 1
      delete json.confirmstatus
      //alert('1')
      console.log(this.isFromFob)
      let confirm = await this.$confirm("请确认操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
      if (!confirm) return;
      this.$axios({
        method: methodNow,
        url: urlPre + api,
        loading: true,
        noarea:true,
        data: [json]
      }).then(res => {
        //alert('2')
        // console.log('费用驳回')
        // console.log('res')
        if (res.data.resultstatus == 0) {
          this.$message.success(res.data.resultmessage);
          if (this.parent.wageBohuiData.length == 1 || this.ifPiliangBohui) {
            this.parent.bohuiVisible = false;
            if (location.href.indexOf('wffmanagement') != '-1'||this.name=='managerDetailTz') {
              this.parent.fetchData()
            } else {
              if (this.name == 'reconMngDetail') {
                this.parent.getReconDeatil()
              } else if (this.name == 'singleDz') {
                this.parent.singleDz()
              } else {
                if(this.name!='tzOperation'){
                  this.$parent.$parent.$parent.mawbCost()
                }else{
                  this.parent.search()
                }
              }
            }

          } else {
            this.getBohuiWageDetail().then(data => {
              this.initWageFormData()
            })
            this.$emit('update:ifNeedFrashWage', true) //父级在关闭弹窗时是否需要刷新费用
          }
          this.rollbackStatus = -1;
          // setTimeout(() => {
          //   this.parent.mawbCost()
          // }, 100);
        } else {
          this.$message.error(res.data.resultmessage)
        }
      })
    },
    async getBohuiWageDetail() { //获取驳回详细数据
      // let firstListItems = this.wageBohuiData.items
      // if (this.wageBohuiData.status == -1) return [];
      let urlPre = location.href.indexOf('wffmanagement') != '-1' ? this.$store.state.wcWebApi : this.$store.state.webApi
      return await this.$axios({
        method: "get",
        url: urlPre + 'api/ExBoBaseWageReject',
        params: {
          guid: this.wageBohuiData.guid,
          wagedom: this.wagedom,
          boguid: -1
        },
        loading: true,
        tip: false
      }).then(res => {
        this.$emit('update:wageBohuiData', res.data[0])
        return res.data
      })
    },
    agreeBtn(type, index) {
      //type 1取消编辑 2不同意 3,同意
      // rollbackStatus = 200; reasonInput = true; putIndex = props.data.index; editData = { ...props.data.row }; editData.rollbackreason = '';
      if (type != 1) {
        this.reasonInput = true;
        this.rollbackStatus = type == 2 ? 200 : 500;
        this.historyPane = false;
        this.putIndex = index
        let editData = {
          ...this.tableData[index]
        }
        editData.rollbackreason = ''
        let arr = this.tableData.filter(i => (i.initiator == this.initiator) || i.status === 0)
        if (arr.length && type == 2) {
          this.tableHead.forEach(i => {
            if (i.field != 'operate') {
              editData[i.field] = arr[arr.length - 1][i.field]
            }
          })
        }
        this.editData = editData
      }
      if (type == 1) {
        this.reasonInput = false;
        this.historyPane = true;
        this.initWageFormData()
      }
    },
    operateFunc(type, index, row) {
      //操作按钮 type 1新增保存 2取消编辑 3修改设置 4删除 
      let urlPre = location.href.indexOf('wffmanagement') != '-1' ? this.$store.state.wcWebApi : this.$store.state.webApi
      console.log(urlPre)
      if (type == 3) {
        this.putIndex = index;
        this.editData = {
          ...row
        }
      }
      if (type == 2) {
        this.putIndex = -1;
        if (this.editData.status != -1 && this.editData.status != 500) {
          this.reasonInput = false;
        }
        this.initFunc()
      }
      if (type == 4){
        var data = {
          czman: localStorage.usrname,
          guid: row.guid
        }
      if (location.href.indexOf('wffmanagement') != '-1' || this.name) {
        data.initiator = this.initiator
      }

      //var api=
      //console.log(urlPre)

      this.$axios({
        method: 'delete',
        url: urlPre + (this.isFromFob?'api/ExCostCheckFobReject':'api/ExBoBaseWageReject'),
        data: data,
        loading: true,
        noarea:true
      }).then(res => {
        console.log(333333)
        console.log(res)
        if (res.data.resultstatus == 0) {
          this.$message.success(res.data.resultmessage);
          this.getBohuiWageDetail().then(data => {
            this.initWageFormData()
          })
          // if(location.href.indexOf('wffmanagement')!='-1'){
          //    this.parent.fetchData()
          // }else{
          //   if(this.name=='reconMngDetail'){
          //     this.parent.getReconDeatil()
          //   }else if(this.name=='singleDz'){
          //     this.parent.singleDz()
          //   }else{
          //     this.parent.mawbCost()
          //   }
          // }
          this.$emit('update:ifNeedFrashWage', true) //父级在关闭弹窗时是否需要刷新费用
        } else {
          this.$message.error(res.data.resultmessage);
        }


      })
      }

    },
    positionTr(index) {
      this.tableData.forEach((i, k) => {
        this.$set(i, 'background', i.status === 0 ? '#ccc' : (k == index ? '#B9FFB6' : '#fff'))
      })
    },
    getFrom(num,area) {
      let wagedomObj = {
        10: '客服',
        20: '航线',
        30: '结算',
        35: '结算',
        40: '经理',
        50: '结算对账时',
        60: '调账',
        70: 'D/N制作',
        75: 'D/N审核',
      };
      return area+wagedomObj[num]
    }
  },
  //&&!((props.data.row.initiator=='50'||props.data.row.initiator=='40')&&props.data.row.receiver=='30') 删除控制备注
  template: `
  <div>
<commonTable class="commonTable" :head="tableHead" :firstTdShow="false" :table-data="tableData"  :tableIndex="tableIndex"    :wagetype="wagetype" :putIndex="putIndex">
    <template slot="firstTd" slot-scope="props">
       <td>
       <span v-if="wageBohuiData.status==500||wageBohuiData.status==510?isSponsor:editData.initiator!=initiator">
             <i class="el-icon-error"  title="取消编辑" v-if="wageBohuiData.status!=-1&&reasonInput&&wageBohuiData.status!=500&&wageBohuiData.status!=510"  @click="agreeBtn(1)"></i> 
         </span><span v-else>--</span> 
       </td>
    <td>
       {{!reasonInput?editData.rollbackman:'--'}}
    </td>
    <td>
       {{!reasonInput?formatDate(editData.rollbackdate,'yyyy-MM-dd hh:mm'):'--'}}
    </td>
       <td>
       {{!reasonInput?setBhiconColor(editData.status,2):'--'}}
    </td>
    <td>-- -> --</td>
    <td><el-checkbox v-model="editData.isfree"  :true-label="2" :false-label="1"></el-checkbox></td>
    <td>
        <pageSelect
        :pagetype="editData.wageinout==1?2:3"
        :modelval.sync="editData.gid"
        :ifRefreshData.sync="ifRefreshData"
        @change="jsxmdata"
        :area="mawbinfo.area||area"
        :fid="mawbinfo.fid"
        :wtxmname="mawbinfo.wtxmname"
        >
        <template slot="other" v-if="editData.wageinout==1">
        <jsdxwh
        :fid="mawbinfo.fid"
        :area="mawbinfo.area||area"
        @success="ifRefreshData=!ifRefreshData"
        ></jsdxwh>
        </template>
        </pageSelect>
    </td>
    <td>
        <page-select
        :modelval.sync="editData.items"
        :servicecode="servicecode"
        :pagetype="5"
        :area="mawbinfo.area||area"
        ></page-select>
    </td>
    <td>
        <my-select
        :groupid="33"
        itemstyle="min-width:110px;width:100%;margin-bottom:0px;max-width:130px"
        v-model="editData.wagetype"
        ></my-select>
    </td>
    <td>
       <el-input v-model="editData.num" style="min-width:80px" v-verify="'fixedTwo'"></el-input>
    </td>
    <td>
          <el-input
          v-model="editData.price"
          style="min-width:80px"
          v-verify="'fixedFTwo'"
          ></el-input>
    </td>
    <td>
          <currencySelect
          itemstyle="min-width:80px;width:100%;margin-bottom:0px;max-width:130px"
          v-model="editData.currency"
          ></currencySelect>
    </td>
    <td>
        <el-input v-model="editData.leastwageall" disabled style="min-width:80px"></el-input>
    </td>
    <td>
        <el-input v-model="editData.wageall" disabled style="min-width:80px"></el-input>
    </td>
    <td>
        <el-input v-model="editData.changerate" disabled style="min-width:80px"></el-input>
    </td>
    <td>
        <el-input v-model="editData.remark"  style="min-width:80px"></el-input>
    </td>
    </template>
    <template slot="operate" slot-scope="props">

         <i class="el-icon-delete" @click="operateFunc(4,props.data.index,props.data.row)" v-show="props.data.index==(tableData.length-1)&&(props.data.row.status==100||props.data.row.status==110)&&isSponsor&&initiator!=35"></i>            
         <span v-show="props.data.index==(tableData.length-1)&&(props.data.row.status==500||props.data.row.status==510?isSponsor:props.data.row.receiver==initiator)">
              <i class="el-icon-success" style="color:#00CD00;" title="同意" @click="agreeBtn(3,props.data.index)"></i>
              <i class="el-icon-error" style="color:red;" title="驳回" @click="agreeBtn(2,props.data.index)"></i>
         </span>
  </template>
  <template slot="fromTo" slot-scope="props">
        {{props.data.row.initiator=='-1'?'--':getFrom(props.data.row.initiator,props.data.row.initiatorarea)}}->{{props.data.row.receiver=='-1'?'--':getFrom(props.data.row.receiver,props.data.row.receiverarea)}}
  </template>
  </commonTable> 
      <div v-show="reasonInput&&!ifPiliangBohui" >
      <el-input type="textarea" style="margin-top:15px" v-model.trim="editData.rollbackreason" rows="4" :placeholder="rollbackStatus==500||rollbackStatus==510?'备注:':'驳回理由:'" ></el-input>
      <div style="text-align:right;margin:20px 0">
        <el-button type="primary" @click="wageBohuiFunc()" >确认{{rollbackStatus==500||rollbackStatus==510?'同意':'驳回'}}</el-button>
        <el-button @click="parent.bohuiVisible=false;parent.closeBohuiDialog()">返回</el-button>
      </div>
    </div>
     <p @click="historyPane=!historyPane" v-show="wageBohuiData.status!=-1&&tableData.length" style="text-align:center;margin-top:18px"><i :class="historyPane?'el-icon-arrow-up':'el-icon-arrow-down'"></i>{{historyPane?'收起':'展开'}}驳回历史记录</p>
     <el-collapse-transition>
     <div v-show="historyPane">
    <div ex="驳回历史记录" v-show="wageBohuiData.status!=-1" class="wagediv">
      <div v-for="(item,index) in tableData" :class="{rightWageitem:item.initiator==initiator}" v-if="item.rollbackreason" >
        <p><span class="el-icon-user-solid" :style="{color:item.initiator==initiator?'#5ABFFF':'#F9A527'}"></span><span style="margin:0 12px">{{item.rollbackman}}</span><span style="color:#B0B0B0;">{{item.rollbackdate}}</span></p>
        <p @click="positionTr(index)">{{item.rollbackreason}}</p>
      </div>
    </div>
   </div> 
 </el-collapse-transition>
</div>
    `
}
