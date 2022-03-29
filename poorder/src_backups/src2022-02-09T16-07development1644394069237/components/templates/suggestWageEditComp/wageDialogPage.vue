<template>
  <div class="wage-dialog-page">
    <div class="wage-header">
      <el-select v-model="wageData.area" placeholder="请选择区域" class="area-select">
        <el-option v-for="option in optionType.area" :key="option" :value="option"></el-option>
      </el-select>
      <el-select v-model="wageData.system" placeholder="请选择系统" class="system-select">
        <el-option v-for="option in optionType.system" :key="option" :value="option"></el-option>
      </el-select>
      <el-select v-model="wagestandard" placeholder="请选择标准" class="type-select">
        <el-option v-for="option in optionType.wagestandardOption" :key="option" :value="option"></el-option>
      </el-select>
      <!-- 委托客户 -->
      <pageSelect
        v-if="wagestandard === '客户标准'"
        style="display: inline-block;width: 300px;"
        placeholder="请选择委托客户"
        :pagetype="1"
        :modelval.sync="wageData.fid"
        @change="fidChange">
      </pageSelect>

    </div>
    <div class="service-list">
      <div 
        v-for="item in serviceList" 
        :class="['service-item', {active: activeServicecode === item.servicecode}]" 
        :key="item.servicecode"
        @click="activeServicecode = item.servicecode">
        {{ item.servicename }}
        <span :class="['count', { 'active': serviceCount[item.servicename] }]">({{ serviceCount[item.servicename] || 0 }})</span>
      </div>
    </div>
    <div class="wage-form" v-show="showWageContent">
      <el-button class="add-wage" type="primary" icon="el-icon-plus" v-show="wageFormState === '0'" @click="wageFormState = '1'">新增费用</el-button>
      <wageFormComp
        v-show="wageFormState !== '0'"
        :servicecode="activeServicecode"
        :specialWageField="specialWageField"
        :wagestandard="wagestandard"
        :wageData="wageData"
        ref="wageFormCompRef">
      </wageFormComp>
      <div class="wage-edit-btn-c">
        <el-button type="text" v-if="wageFormState !== '0'" @click="confirmBtn">确认</el-button>
        
        <el-button type="text" v-if="wageFormState === '2'" @click="addWageByWage">以此基础新建</el-button>

        <el-button type="text" v-if="wageFormState === '2' && wageData.itemstatus === 2" @click="statusChange(wageData.guid, 1)">启用</el-button>
        <el-button type="text" v-if="wageFormState === '2' && wageData.itemstatus === 1" @click="statusChange(wageData.guid, 2)">禁用</el-button>

        <el-button type="text" v-if="wageFormState === '2'" @click="deleteWage(wageData.guid)">删除</el-button>

        <el-button type="text" v-if="wageFormState !== '0'" @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="wage-table" v-show="showWageContent">
      <wageTableComp :tableData="curServiceTableData" :selectedWageGuid="selectedWageGuid" @operate="tableRowOperate"></wageTableComp>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../../../api/localStorage'
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
    let serviceList = []
    JSON.parse(localStorage.serviceData).forEach(service => {
      if (service.dom === '总单') {
        serviceList.push(service)
      }
    })

    return {
      tableDataRes: [],  // 查询出来的所有费用数据

      wagestandard: '',
      wageData: {
        // 常用条件
        area: '',
        system: '',
        items: '', // 费用名称
        sid: '',  // 费用id
        fid: '', // 委托客户
        gid: '', // 委托项目
        sfg: '',
        mdg: '',
        mawbthreecode: '',
        hbh: '',
        hwxz: '',
        begindate: '',
        enddate: '',
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
        // 结果
        pricetype: '1',  // 价格类型默认单价
        currency: '人民币',
        wagetype: '',
        childwagetype: '',
        minimal: '',
        price: ''
      },

      // 服务对应的特殊条件，根据接口返回的字段动态显示
      specialWageField: [],

      activeServicecode: '', // 选中的服务
      wageFormState: '0', // 0: 显示新增按钮， 1: 新增费用， 2: 修改费用

      selectedWageGuid: '', // 费用表格选中行的guid

      serviceList,
      optionType: {
        area: [],
        system: [],
        wagestandardOption: ['唯凯标准', '客户标准']
      }
    }
  },
  created () {
    this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubServiceField', params: {area: ''}, loading: true, tip: false})
    .then(({ data }) => {
      this.PubServiceField = data
    })

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

    let params = {
      json: JSON.stringify({
        where: {
          area: this.wageDialogParam.area,
          system: this.wageDialogParam.system,
          wagestandard: this.wageDialogParam.wagestandard,
          items: this.wageDialogParam.items
        },
        order: 'adddate desc'
      })
    }
    this.$axios({ method: 'get', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', params, loading: true, tip: false})
    .then(({ data }) => {
      data.forEach(item => {
        item.list.forEach(i => {
          i.itemstatus = i.itemstatus === 1 ? '有效' : '无效'
          i.begindate = formatDate(i.begindate, 'yyyy-MM-dd') || ''
          i.enddate = formatDate(i.enddate, 'yyyy-MM-dd') || ''
        })
      })
      this.tableDataRes = data
    })
  },
  computed: {
    serviceCount () {
      let result = {}
      for (let item of this.curTableData) {
        result[item.servicename] = (result[item.servicename] || 0) + 1
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
          if (this.wagestandard === '客户标准') {
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
      if (!this.activeServicename) return []
      return this.curTableData.filter(i => {
        return i.servicename === this.activeServicename
      })
    },
    activeServicename: {
      get () {
        for (let item of this.serviceList) {
          if (item.servicecode === this.activeServicecode) {
            return item.servicename
          }
        }
        return ''
      },
      set (val) {
        for (let item of this.serviceList) {
          if (item.servicename === val) {
            this.activeServicecode = item.servicecode
            break
          }
        }
      }
    },
    showWageContent () {
      if (!this.wageData.area || !this.wageData.system || !this.wagestandard || !this.activeServicecode) return false
      if (this.wagestandard === '客户标准' && !this.wageData.fid) return false
      return true
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        // 关闭窗口时重置组件状态
        this.wagestandard = ''
        this.wageData.area = ''
        this.wageData.system = ''
        this.activeServicecode = ''
        this.selectedWageGuid = ''
        this.cancel()
      }
    },
    wagestandard () {
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
          }
        }

        if (val.servicename) {
          this.activeServicename = val.servicename
        }

        // 点击子表格进入
        if (val.ziTable) {
          if (val.ziTable.field === 'servicename') {
            // 服务名称
            this.activeServicename = val.ziTable.servicename
          } else if (val.ziTable.field === 's_name') {
            // 费用名称
            this.activeServicename = val.ziTable.servicename
            this.selectedWageGuid = val.ziTable.guid
          }
        }
      }
    },
    activeServicecode: {
      immediate: true,
      handler (code) {
        // 清空原先特殊条件的值
        let field = [
          'cancelorder',
          'trayweightbegin',
          'trayweightend',
          'bglx',
          'inspection',
          'materialpm',
          'materialstd',
          'weightbegin',
          'weightend',
          'istodoor',
          'clothtype',
          'clothstd',
          'volumebegin',
          'volumeend'
        ]
        for (let key of field) {
          this.wageData[key] = ''
        }

        // 切换特殊条件
        this.specialWageField = []
        ;(this.PubServiceField || []).forEach(item => {
          if(item.servicecode === this.activeServicecode) {
            this.specialWageField.push(item.fieldname)
          }
        })
      }
    }
  },
  methods: {
    confirmBtn () {
      if (!this.$refs.wageFormCompRef.checkRequiredField()) return

      // 新增
      if (this.wageFormState === '1') {
        let data = {...this.wageData, wageinout: 1, itemstatus: 1}

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

        this.$axios({ method: 'post', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true})
        .then(({ data }) => {
          this.$emit('newWage')
          this.cancel()
        })
      } else if (this.wageFormState === '2') {
        // 修改
        let data = {...this.wageData}

        if (this.wagestandard === '唯凯标准') {
          data.fid = '-1'
          data.gid = ''
        }
        this.$axios({ method: 'put', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true, noarea: true})
        .then(({ data }) => {
          this.$emit('updateWage', this.wageData.guid)
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
        if (this.wagestandard === '客户标准' && key === 'fid') continue
        if (key === 'pricetype') {
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
      for (let key of Object.keys(this.wageData)) {
        this.wageData[key] = row[key]
      }
      this.wageData['guid'] = row['guid']
      this.wageData['items'] = row['s_name']
      this.wageData['itemstatus'] = row['itemstatus'] === '有效' ? 1 : 2
    },
    statusChange (guid, status) {
      let data = {
        guid,
        status
      }
      this.$axios({ method: 'put', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data, loading: true, tip: true, noarea: true})
      .then(({ data }) => {
        this.$emit('updateWage', guid)
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
        
        this.$axios({ method: 'delete', url: this.$store.state.BasicWebApi + 'api/ExSystemWage', data: {guid}, loading: true, tip: true, noarea: true})
        .then(({ data }) => {
          if (data.resultstatus !== 0) return
          this.$emit('deleteWage', guid)
          if (this.wageFormState === '2' && guid === this.wageData.guid) {
            this.cancel()
          }
        })

      })
    },
    fidChange (data) {
      this.$emit('usrNameChange', data.usr_name)
    }
  }
}
</script>

<style lang="less" scoped>
.wage-dialog-page {
  display: flex;
  flex-direction: column;
  .wage-header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
    .el-select {
      width: 130px;
      margin-right: 5px;
      color: #0e5a8c;
    }
    .import-btn {
      float: right;
    }
  }
  .service-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    .service-item {
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
      &:nth-child(9n) {
        margin-right: 0;
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
