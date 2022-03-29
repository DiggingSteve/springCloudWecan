<template>
  <div class="wage-dialog-page">
    <div class="wage-header">
      <el-select v-model="wageData.area" placeholder="请选择区域" class="area-select">
        <el-option v-for="option in optionType.area" :key="option" :value="option"></el-option>
      </el-select>
      <el-select v-model="wageData.system" placeholder="请选择系统"  disabled class="system-select">
        <el-option v-for="option in optionType.system" :key="option" :value="option"></el-option>
      </el-select>
      <el-select v-model="wagestandard" placeholder="请选择标准" class="type-select">
        <el-option v-for="option in optionType.wagestandardOption" :key="option" :value="option"></el-option>
      </el-select>
      <!-- 委托客户 -->             
      <pageSelect
        v-if="wagestandard === '客户标准' || wagestandard === '供应商标准' "
        style="display: inline-block;width: 300px;"
        placeholder="请选择委托客户"
        :pagetype="1"
        :modelval.sync="wageData.fid"
        @change="fidChange">
      </pageSelect>

      <el-button v-show="showWageContent" type="primary" class="export-btn" @click="exportWageExcel">导出模板</el-button>

    </div>
    <div class="service-list">
      <div
        v-for="item in serviceTypeList"
        :class="['service-type-item', {active: activeServicetype === item}]"
        :key="item"
        @click="activeServicetype = item">
        {{ item }} 
        <span :class="['count', { 'active': serviceCount[item] }]">({{ serviceCount[item] || 0 }})</span>
      </div>
    </div>
    <div class="wage-form" v-show="showWageContent">
      <el-button class="add-wage" type="primary" icon="el-icon-plus" v-show="wageFormState === '0'" @click="wageFormState = '1'"  :disabled="componentName === 'AISOUT' || componentName === 'AISIN'">新增费用</el-button>
      <wageFormComp
        v-show="wageFormState !== '0'"
        :serviceList="serviceList"
        :wageDataSystem="wageData.system"
        :activeServicetype="activeServicetype"
        :curServicenameList="curServicenameList"
        :tag="tag"
        :wagestandard="wagestandard"
        :wageData="wageData"
        ref="wageFormCompRef">
      </wageFormComp>
      <div class="wage-edit-btn-c">
        <el-button type="text" v-if="wageFormState !== '0'" @click="confirmBtn">确认</el-button>

        <el-button type="text" v-if="wageFormState === '2'" @click="addWageByWage">以此基础新建</el-button>

        <el-button type="text" v-if="wageFormState === '2' && wageData.itemstatus === 2 " @click="statusChange(wageData.guid, 1)"  >启用</el-button>
        <el-button type="text" v-if="wageFormState === '2' && wageData.itemstatus === 1 " @click="statusChange(wageData.guid, 2)"  >禁用</el-button>

        <el-button type="text" v-if="wageFormState === '2' " @click="deleteWage(wageData.guid)"    :disabled="componentName === 'AISOUT' || componentName === 'AISIN'">删除</el-button>

        <el-button type="text" v-if="wageFormState !== '0'" @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="wage-table" v-show="showWageContent">
      <wageTableComp :tableData="curServiceTableData" :selectedWageGuid="selectedWageGuid" @operate="tableRowOperate" :componentName="componentName"></wageTableComp>
    </div>
  </div>
</template>

<script>
import { getChangeValue, getCharCol, formatDate } from '../../api/localStorage.js'
import wageFormComp from './wageFormComp'
import wageTableComp from './wageTableComp'

export default {
  name: 'wageDialogPage',
  components: {
    wageFormComp,
    wageTableComp
  },
  props: {
    visible: Boolean,
    wageDialogParam: Object
  },
  data () {
    let serviceListBackup = []
    JSON.parse(localStorage.serviceData).forEach(service => {
     
      if (service.dom === '总单') {
        serviceListBackup.push(service)
      }
    })
    console.log(serviceListBackup)
    serviceListBackup.sort((a, b) => a.orderindex - b.orderindex)

    return {
      tableDataRes: [],
      buttonStatus:null,
      componentName:"",     // 组件名字
      wagestandard: '',
      wtkhname: '',
      wageData: {
        servicename: '',
        servicecode:'',
        // 常用条件
        area: '',
        system: '',
        items: '', // 费用名称
        sid: '',  // 费用id
        fid: '', // 委托客户
        gid: '', // 委托项目
        sfg: '',
        mdg: '',
        pos: '',
        mawbthreecode: '',
        loadingmodel:'',
        czlx:'',
        hbh: '',
        hwxz: '',
        jjd: '',
        begindate: '',
        enddate: '',
        serviceincl: '',
        // 特殊条件
        cancelorder: '',
        trayweightbegin: '',
        trayweightend: '',
        bglx: '',
        inspection: '',
        materialpm: '',
        materialstd: '',
        weightbegin: '',
        weightend: '',
        istodoor: '',
        clothtype: '',
        clothstd: '',
        volumebegin: '',
        volumeend: '',
        packagetype: '',
        packagestyle: '',
        // 结果
        pricetype: '1',  // 价格类型默认单价
        currency: '人民币',
        relation: '',
        freedays: '',
        wagetype: '',
        childwagetype: '',
        minimal: '',
        isfree: '1',
        defaultcheck:'1',
        price: '',
        ysfs: ''
      },


      
      // 服务对应的特殊条件，根据接口返回的字段动态显示
      specialWageField: [],

      activeServicetype: '',

      wageFormState: '0', // 0: 显示新增按钮， 1: 新增费用， 2: 修改费用

      wageinoutStatus: null,  //1 应付  2应收

      selectedWageGuid: '', // 费用表格选中行的guid

      serviceListBackup,
      tag:"",
      
      optionType: {
        area: [],
        system: [],
        wagestandardOption: ['唯凯标准']
      }
    }
  },
  created () {
    /**
     * 53: 区域
     * 57: 系统
     * 32: 货物性质
     * 19: 报关方式
     * -10: 材料品名
     * -20: 材料规格
     * 162: 挂衣类型
     * 163: 挂衣规格
     */
    let groupType = JSON.parse(localStorage.groupType)
    groupType.forEach(item => {
      if (item.groupid === 53) this.optionType.area.push(item.typename)
      if (item.groupid === 57) this.optionType.system.push(item.typename)
    })

    // 修改区域、系统、标准时请求接口查询费用数据
    this.$watch(
      () => {
        console.log(this.wageData.area)
        console.log(this.wageData.system)
        console.log(this.wagestandard)
        console.log(this.wageData.fid)
        return this.wageData.area + this.wageData.system + this.wagestandard + this.wageData.fid
      
      },
      () => {
        this.getWageData()
      },
      {
        immediate: true
      }
    )
  },
  computed: {
    /**
     * 根据所选系统动态过滤服务
     * system 为 空出、海出、陆出、铁出 时过滤条件为
     * dom === '总单' && port === '始发港服务'
     *
     * system 空进、海进、陆进、铁进
     * dom === '总单' && port === '目的港服务' && servicename !== 'OB0020'
     *
     * system 国内服务
     * dom === '总单' && servicecode !== 'OA0010' && servicecode !== 'OB0020'
     */
    serviceList () {
      const system = this.wageData.system
      const serviceListBackup = this.serviceListBackup
      if (!system) return serviceListBackup

      let list = []
/*       if (['空出', '海出', '陆出', '铁出'].includes(system)) {
        list = serviceListBackup.filter(item => {
          return (item.dom === '总单' && item.port === '始发港服务')
        })

        // 出口添加代操作，servicecode写死AA9998
        for (let i in list) {
          if (list[i].servicetype === '空出订舱') {
            list.splice(i + 1, 0, {
              servicetype: '代操作',
              servicename: '代操作',
              servicecode: 'AA9998'
            })
            break
          }
        }
      } else if (['空进', '海进', '陆进', '铁进'].includes(system)) {
        list = serviceListBackup.filter(item => {
          return (item.dom === '总单' && item.port === '目的港服务' && item.servicecode !== 'OB0020')
        })
      } else if (['国内服务'].includes(system)) {
        list = serviceListBackup.filter(item => {
          return (item.dom === '总单' && item.servicecode !== 'OA0010' && item.servicecode !== 'OB0020')
        })
      } */
    list = serviceListBackup.filter(item=>{
      return (item.dom=='总单')&&item.system.includes(system)
    })

         // 出口添加代操作，servicecode写死AA9998
       if (this.wageData.system=== '空出') {
          list.push({
            servicetype: '代操作',
            servicename: '代操作',
            servicecode: 'AA9998'
          })   
        }

      return list
    },
    serviceTypeObj () {
      let Obj = { '总览': [] }
      this.serviceList.forEach(item => {
      
        if (!Obj[item.servicetype]) {
          Obj[item.servicetype] = []
        }

        Obj['总览'].push(item.servicename)
        Obj[item.servicetype].push(item.servicename)
      })
      console.log(Obj)
      return Obj
    },
    serviceTypeList () {
      return Object.keys(this.serviceTypeObj)
    },
    curServicenameList () {
      console.log(this.serviceTypeObj)
      console.log( this.serviceTypeObj[this.activeServicetype])
      console.log( this.serviceList)
      return this.serviceTypeObj[this.activeServicetype]
    },
    serviceCount () {
      let result = {}

      for (let item of this.curTableData) {
        for (let type of this.serviceTypeList) {
          if (this.serviceTypeObj[type].includes(item.servicename)) {
            result[type] = (result[type] || 0) + 1
          }
        }
      }
      return result
    },
    // 对应当前区域、系统、标准、客户的所有费用数据
    curTableData () {
      let result = []
      let { area, system } = this.wageData
      if (!area || !system || !this.wagestandard) return result

      for (let item of this.tableDataRes) {
        if (item.area === area && item.system === system && item.wagestandard.includes(this.wagestandard)) {
          if (this.wagestandard === '客户标准' || this.wagestandard === '供应商标准') {
            if (this.wageData.fid && item.list[0].fid === this.wageData.fid) {
              result = result.concat(item.list)
            }
          } else {
            result = result.concat(item.list)
          }
        }
      }
      return result
    },
    // 对应当前选中的服务的费用数据
    curServiceTableData () {
      if (!this.activeServicetype) return []
      return this.curTableData.filter(i => {
        return this.curServicenameList.includes(i.servicename)
      })
    },
    showWageContent () {
      if (!this.wageData.area || !this.wageData.system || !this.wagestandard || !this.activeServicetype) return false
      // if (this.wagestandard === '客户标准' || this.wagestandard === '供应商标准' && !this.wageData.fid) return false
      return true
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        // 关闭窗口时重置组件状态
        this.wagestandard = ''
        this.wageData.area = ''

        this.activeServicetype = ''
        this.selectedWageGuid = ''
        this.cancel()
      }
    },
   '$route'(val){
      switch (val.params.ready08) {
        case 'AEWIN' :
          this.wageData.system = "空出"
          this.componentName = "AEWIN"
          this.wagestandard = ""

           this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
           this.optionType.wagestandardOption.push('客户标准')
           this.optionType.wagestandardOption.push('唯凯标准')
        break
        case 'AESIN' :
          this.componentName = "AESIN"
          this.wageData.system = "空出"
          this.wagestandard = ""

           this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
           this.optionType.wagestandardOption.push('客户标准')
           this.optionType.wagestandardOption.push('唯凯标准')
        break
        case 'AIWIN' :
          this.componentName = "AIWIN"
          this.wageData.system = "空进"
          this.wagestandard = ""

           this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
           this.optionType.wagestandardOption.push('客户标准')
           this.optionType.wagestandardOption.push('唯凯标准')
        break
        case 'AIWOUT' :
          this.componentName = "AIWOUT"
          this.wageData.system = "空进"
          this.wagestandard = ""
this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
          this.optionType.wagestandardOption.push( '供应商标准')

        break
        case 'AISIN' :
          this.componentName = "AISIN"
          this.wageData.system = "空进"
          this.wagestandard = ""

           this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
           this.optionType.wagestandardOption.push('客户标准')
           this.optionType.wagestandardOption.push('唯凯标准')
        break
        case 'AISOUT' :
          this.componentName = "AISOUT"
          this.wageData.system = "空进"
          this.wagestandard = ""

           this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
           this.optionType.wagestandardOption.push('客户标准')

    
      }
    },
    activeServicetype (val) {
      this.tag = val

      this.cancel()
    },
    wagestandard (val) {
      this.cancel()
    },
    wageDialogParam: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val.addWage) {
          this.wageFormState = '1'
          return
        }
        if (val.area) this.wageData.area = val.area
        if (val.system) this.wageData.system = val.system
        if (val.wagestandard) {
          if (val.wagestandard === '唯凯标准') {
            this.wagestandard = '唯凯标准'
          } else if (val.wagestandard.includes('客户标准')) {
            this.wagestandard = '客户标准'
            this.wageData.fid = val.fid
            this.wtkhname = val.wagestandard.split('/')[1]
          }else if (val.wagestandard.includes('供应商标准')) {
            this.wagestandard = '供应商标准'
            this.wageData.fid = val.fid
            this.wtkhname = val.wagestandard.split('/')[1]
          }
        }
      }
    }
  },
  methods: {
    
    getWageData () {
        console.log('000')
      if (!this.wageData.area || !this.wageData.system || !this.wagestandard) return
      console.log('11111')
      console.log(this.wagestandard)
      console.log(this.wageData.fid)
      if ((this.wagestandard === '客户标准' || this.wagestandard === '供应商标准') && !this.wageData.fid) return
       console.log('2222')
      let jsonArr2 = {
        where: {
          wagestandard: this.wagestandard,
          area: { in: this.wageData.area },
          system: { in: this.wageData.system }
        },
        order: "adddate desc"
      }
       console.log(3333)
      if (this.wagestandard === '客户标准' || this.wagestandard === '供应商标准') {
        jsonArr2.where.fid = { in: this.wageData.fid }
      }
      let json = { 'json': JSON.stringify(jsonArr2) }

      this.$axios({ method: 'get', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', params: json, loading: false, tip: false}).then(result => {
        let resultData = result.data

        if (resultData.length == 0) {
          
          return this.$message('无数据')
        }
        let data = []

        resultData.forEach((i, index) => {
          if (i.list.length === 0)  return
          i.zitablenum = i.list.length
          i.list.forEach(this.formatWage)
          this.sortByServicename(i.list)

        })

        data = getChangeValue(resultData, '空出')



            // console.log(String(obj.hwplace),String(obj.relation))

        this.tableDataRes = data

        console.log(this.tableDataRes)

      })
    },
    confirmBtn () {
      
      if (!this.$refs.wageFormCompRef.checkRequiredField()) return

      // 新增
      if (this.wageFormState === '1') {
        
        if(this.$router.history.current.params.ready08 === 'AIWOUT' ){
          this.wageinoutStatus = 2
        } else {
          this.wageinoutStatus = 1
        }
        console.log(this.wageData)
        let data = {...this.wageData, wageinout: this.wageinoutStatus, itemstatus: 1,servicecode:this.$refs.wageFormCompRef.servicecode }
        delete data.servicename
        // 材料规格全选时传 -1
        // if (data.materialstd.split(',').length === this.$refs.wageFormCompRef.formDataObj.materialstd.options.length) {
        //   data.materialstd = '-1'
        // }

        // 设置默认值
        ;['trayweightbegin', 'trayweightend', 'volumebegin', 'volumeend', 'weightbegin', 'weightend', 'minimal'].forEach(key => {
          if (!data[key]) data[key] = 0
        })
        ;['istodoor', 'cancelorder', 'inspection'].forEach(key => {
          if (!data[key]) data[key] = -1
        })

        if (this.wagestandard === '唯凯标准') {
          data.fid = '-1'
          data.gid = ''
        }
        //alert(data.area)
        this.$axios({ method: 'post', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true})
        .then(({ data }) => {
          // this.$refs.wageFormCompRef.formData[2].freedays = {}
          this.getWageData()
          this.cancel()
        })
      } else if (this.wageFormState === '2') {
        // 修改
        let data = {...this.wageData}
        // 材料规格全选时传 -1
        // if (data.materialstd.split(',').length === this.$refs.wageFormCompRef.formDataObj.materialstd.options.length) {
        //   data.materialstd = '-1'
        // }

        // 设置默认值
        ;['freedays', 'weightbegin', 'weightend', 'minimal', 'minimal_price', 'maximal_price', 'maximal', 'trayweightbegin', 'trayweightend', 'volumebegin', 'volumeend'].forEach(key => {
          if (!data[key]) data[key] = 0
        })

        if (this.wagestandard === '唯凯标准') {
          data.fid = '-1'
          data.gid = ''
        }
        this.$axios({ method: 'put', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true, noarea: true})
        .then(({ data }) => {
          
          //this.$refs.wageFormCompRef.formData[2].freedays = {}
          this.getWageData()
          this.cancel()
        })
      }
    },
    cancel () {
      this.clearWageData()
      this.wageFormState = '0'
    },
    clearWageData () {
      
      
      for (let key in this.wageData) {
        if (key === 'area' || key === 'system') continue
        if ((this.wagestandard === '客户标准' || this.wagestandard === '供应商标准') && key === 'fid') continue
        if (key === 'pricetype') {
          this.wageData[key] = '1'
          continue
        }
        if (key === 'isfree') {
          this.wageData[key] = '1'
          continue
        }
        if (key === 'defaultcheck') {
          this.wageData[key] = '1'
          continue
        }
        if (key === 'currency') {
          this.wageData[key] = '人民币'
          continue
        }
        this.wageData[key] = ''
    
      }
      if (this.wageFormState === '2') {
        this.$delete(this.wageData, 'guid')
      }
    },
    tableRowOperate (data) {
      this.selectedWageGuid = data.row.guid
      switch (data.operate) {
        case 'edit':
          this.editWage(data.row)
          break
        case 'delete':
          this.deleteWage(data.row.guid)
          break
        case 'statusChange':
          this.statusChange(data.row.guid, data.status)
          break
        case 'new':
          this.wageFormState = '1'
          for (let key of Object.keys(this.wageData)) {
            this.wageData[key] = data.row[key] || this.wageData[key]
          }
          this.wageData['items'] = data.row['s_name']
          this.wageData['itemstatus'] = data.row['itemstatus'] === '有效' ? 1 : 2
          break
      }
    },
    addWageByWage () {
      this.$delete(this.wageData, 'guid')
      this.wageFormState = '1'
    },
    editWage (row) {
   
      this.wageFormState = '2'
      console.log(row)
      
      for (let key of Object.keys(this.wageData)) {
        
        if (key === 'fid' && row[key] === -1) continue
        this.wageData[key] = row[key]
      }
      
      this.wageData['guid'] = row['guid']

      this.wageData['items'] = row['items']
      this.wageData['itemstatus'] = row['itemstatus'] === '有效' ? 1 : 2
      console.log(this.wageData['ysfs'] )
      console.log(this.wageData)
    },
    statusChange (guid, status) {

      let data = {
        area: this.wageData.area,
        guid:guid,
        status:status
      }
      // 
      console.log(data)
      this.$axios({ method: 'put', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true, noarea: true})
      .then(({ data }) => {
        this.getWageData()
        // 如果修改的是当前在编辑中的费用，需要同步修改wageData里的状态
        if (this.wageFormState === '2' && guid === this.wageData.guid) {
          this.wageData.itemstatus = status
        }
      })
    },
    deleteWage (guid) {
      this.$confirm('是否删除费用？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios({ method: 'delete', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data: {guid}, loading: true, tip: true, noarea: true,servicecode:this.$refs.wageFormCompRef.servicecode})
        .then(({ data }) => {
          if (data.resultstatus !== 0) return
          this.getWageData()
          if (this.wageFormState === '2' && guid === this.wageData.guid) {
            this.cancel()
          }
        })

      })
    },
    fidChange (data) {
      this.wtkhname = data.usr_name
      this.$emit('usrNameChange', data.usr_name)
    },
    formatWage (wage) {
      wage.gid = wage.gid == '0' ? '' : wage.gid
      wage.hwplace = String(wage.hwplace)
      wage.isjmyq = String(wage.isjmyq)
      wage.relation = String(wage.relation)
      wage.itemstatus = wage.itemstatus === 1 ? '有效' : '无效'
      wage.isfree = String(wage.isfree)
      wage.defaultcheck = String(wage.defaultcheck)
      wage.cancelorder = String(wage.cancelorder === -1 ? '2' : wage.cancelorder)
      wage.begindate = formatDate(new Date(wage.begindate), 'yyyy-MM-dd') || ''
      wage.enddate = formatDate(new Date(wage.enddate), 'yyyy-MM-dd') || ''
    },
    sortByServicename (list) {
      let servicenameObj = {}
      list.forEach(item => {
        // servicecode AA9998为代操作
        if (item.servicecode === 'AA9998') {
          item.servicename = '代操作'
        }
        if (!servicenameObj[item.servicename]) servicenameObj[item.servicename] = []
        servicenameObj[item.servicename].push(item)
      })
      list.splice(0) // 清空
      for (let key in servicenameObj) {
        list.push(...servicenameObj[key])
      }
    },
    s2ab (s) { // 字符串转字符流
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF
      }
      return buf
    },
    // https://www.jianshu.com/p/869375439fee
    exportWageExcel (index) {
      let { area, system } = this.wageData
      let excelFileTitle = `${area}-${system}-${this.wagestandard}`
      if (this.wagestandard === '客户标准' || this.wagestandard === '供应商标准') {
        excelFileTitle += `-${this.wtkhname}`
      }

      let excelHead = [ // excel表头
        { title: '服务名称', field: 'servicetype' },
        { title: '服务类别', field: 'servicename' },
        { title: '费用名称', field: 'items' },
        { title: '单价', field: 'price' },
        { title: 'Min', field: 'minimal' },
        { title: '计费方式', field: 'wagetype' },
        { title: '币种', field: 'currency' },
        { title: '始发港', field: 'sfg' },
        { title: '目的港', field: 'mdg' },
        { title: '航空公司', field: 'mawbthreecode' },
        { title: '航班号', field: 'hbh' },
        { title: '货物性质', field: 'hwxz' },
        { title: '其他条件', field: [
          'weightbegin',
          'volumebegin',
          'bglx',
          'materialpm',
          'materialstd',
          'clothtype',
          'clothstd',
          'packagetype',
          'istodoor',
          'trayweightbegin'
        ]}
      ]

      let excelData = {}
      excelData['!merges'] = []

      // excel标题
      excelData['A2'] = {
        v: '应收杂费维护-' + excelFileTitle,
        s: { font: { bold: true } }
      }

      let { addman, adddate } = this.curTableData[this.curTableData.length - 1]
      excelData['A3'] = {
        v: `创建人：${addman || ''}，创建日期：${formatDate(new Date(adddate), 'yyyy-MM-dd') || ''}`,
        s: { font: { bold: true } }
      }

      // 表格头
      for (let index in excelHead) {
        let col = getCharCol(index)
        excelData[col + '6'] = {
          v: excelHead[index].title,
          s: { font: { bold: true } }
        }
      }

      // 数据从第7行开始写入
      let excelTypeIndex = 7
      let excelNameIndex = 7
      let excelWageIndex = 7
      let colValueCount = {}  // 记录每一列是否有值写入，没有值的列最后需要删除

      for (let type of Object.keys(this.serviceCount)) {
        if (type === '总览') continue
        // 服务名称
        excelData['A' + excelTypeIndex] = {
          v: type,
          t: 's',
          s: { alignment: { vertical: 'center' } }
        }
        excelData['!merges'].push({
          s: { c: 0, r: excelTypeIndex - 1 },
          e: { c: 0, r: (excelTypeIndex += this.serviceCount[type]) - 2 }
        })

        let servicenameList = this.serviceTypeObj[type]
        for (let servicename of servicenameList) {
          let wageList = this.getWageListByServicename(servicename)
          if (wageList.length === 0) continue
          // 服务类别
          excelData['B' + excelNameIndex] = {
            v: servicename,
            t: 's',
            s: { alignment: { vertical: 'center' } }
          }
          excelData['!merges'].push({
            s: { c: 1, r: excelNameIndex - 1 },
            e: { c: 1, r: (excelNameIndex += wageList.length) - 2 }
          })

          for (let wageItem of wageList) {
            for (let colIndex in excelHead) {
              let field = excelHead[colIndex].field
              if (field === 'servicetype' || field === 'servicename') continue

              let col = getCharCol(colIndex)
              let v = this.excelCellDataFormat(wageItem, field)

              if (!colValueCount[col]) colValueCount[col] = 0
              if (v) colValueCount[col]++

              excelData[col + excelWageIndex] = {
                v,
                t: 's',
                s: { alignment: { vertical: 'center' } }
              }
            }
            excelWageIndex++
          }
        }
      }

      // 如果某列每一行都没有值时，删除该列
      let insertCol = null
      let lastInsertCol = null
      for (let colkey of Object.keys(colValueCount)) {
        if (insertCol !== null && colValueCount[colkey] !== 0) {
          let rowIndex = 6 // 从表头开始往前移
          while (rowIndex < excelWageIndex) {
            excelData[insertCol + rowIndex] = excelData[colkey + rowIndex]
            delete excelData[colkey + rowIndex]
            rowIndex++
          }
          [colValueCount[insertCol], colValueCount[colkey]] = [colValueCount[colkey], 0]
          lastInsertCol = insertCol
          insertCol = null
        }
        if (insertCol === null && colValueCount[colkey] === 0) {
          insertCol = colkey
        }
      }
      // 删除后面没有数据的多余的列
      let startDelete = false
      for (let i = 0; i < excelHead.length; i++) {
        let col = getCharCol(i)
        if (startDelete) {
          delete excelData[col + 6]
        }
        if (lastInsertCol === col) startDelete = true
      }

      excelData['!ref'] = 'A1:' + getCharCol(excelHead.length) + excelWageIndex
      let excelWB = {
        SheetNames: ['Sheet1'],
        Sheets: {
          'Sheet1': excelData
        }
      }
      let tmpDown = new Blob([
        this.s2ab(XLSX.write(excelWB,{ bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true }))
      ])

      let a = document.createElement('a')
      a.download = excelFileTitle + '.xlsx'
      a.href = URL.createObjectURL(tmpDown)
      a.click()

      setTimeout(() => {
        URL.revokeObjectURL(tmpDown)
      }, 100)
    },
    getWageListByServicename (servicename) {
      return this.curTableData.filter(item => {
        return item.servicename === servicename
      })
    },
    excelCellDataFormat (data, field) {
      if (typeof field === 'string') {
        field = [field]
      }
      let resultArr = []

      field.forEach(item => {
        if (!data[item] || data[item] == '-1') return

        if (item === 'packagetype') {
          if (data[item] === '0') return
        } else if (item === 'weightbegin') {
          if (data['weightbegin'] || data['weightend']) {
            resultArr.push(data['weightbegin'] + '-' + data['weightend'])
          }
        } else if (item === 'volumebegin') {
          if (data['volumebegin'] || data['volumeend']) {
            resultArr.push(data['volumebegin'] + '-' + data['volumeend'])
          }
        } else if (item === 'trayweightbegin') {
          if (data['trayweightbegin'] || data['trayweightend']) {
            resultArr.push(data['trayweightbegin'] + '-' + data['trayweightend'])
          }
        } else {
          resultArr.push(data[item])
        }
      })
      return resultArr.join(',')
    }
  },
  mounted(){
    this.componentName = this.$router.history.current.params.ready08
      if(this.$router.history.current.params.ready08 === 'AIWIN' ||  this.$router.history.current.params.ready08 === 'AIWOUT'  || this.$router.history.current.params.ready08 === 'AISIN'  || this.$router.history.current.params.ready08 === 'AISOUT'){
          this.wageData.system = '空进'
      } else if(this.$router.history.current.params.ready08 === 'AEWIN' ||  this.$router.history.current.params.ready08 === 'AESIN'){
          this.wageData.system = '空出'
      }

      if(this.$router.history.current.params.ready08 ===  'AIWOUT'){
         this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
        this.optionType.wagestandardOption.push('供应商标准')
    } else if(this.$router.history.current.params.ready08 ===  'AISOUT'){
      this.optionType.wagestandardOption.splice(0,this.optionType.wagestandardOption.length)
        this.optionType.wagestandardOption.push('客户标准')
    } else {
      this.optionType.wagestandardOption.push('客户标准')
    }

    console.log(this.wageData)
  }
}
</script>

<style lang="less" scoped>
.wage-dialog-page {
  display: flex;
  flex-direction: column;
  .wage-header {
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
    .el-select {
      width: 130px;
      margin-right: 5px;
      color: #0e5a8c;
    }
    .export-btn {
      float: right;
    }
  }
  .service-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    .service-type-item {
      width: 161px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #999;
      background: #f8f8f8;
      border: 1px solid #e8e8e8;
      margin: 0 10px 10px 0;
      cursor: pointer;
      span {
        color: #00cc00;
        &.active {
          color: red;
        }
      }
      &.active {
        color: #0e5a8c;
      }
    }
  }
  .wage-form {
    overflow: hidden;
    margin-bottom: 20px;
    .add-wage {
      float: right;
    }
    .wage-edit-btn-c {
      display: flex;
      justify-content: flex-end;
      .el-button {
        margin: 0 5px;
        padding: 5px;
        color: #0e5a8b;
        font-size: 16px !important;
        font-weight: bold;
      }
    }
  }
}
</style>
