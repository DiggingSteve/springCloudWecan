<template>
  <div class="wage-form-comp">
    <div class="wage-title">
      {{ wageTitleText }}
    </div>
    <div class="form-c">
      <template v-for="formItem of formData">
        <template v-for="key in Object.keys(formItem)">

          <p v-if="key.includes('title')" class="form-title" :key="formItem[key].label">{{ formItem[key].label }}</p>

          <div
            v-else-if="!formItem[key].hidden"
            :class="['form-item', key, {'input-required': formItem[key].required}]"
            :key="formItem[key].label">

            <div class="item-title">{{ formItem[key].label }}</div>
            <div class="item-content">

              <template v-if="formItem[key].formtype === 1">
                <el-input v-model="wageData[key]" clearable></el-input>
              </template>

              <template v-if="formItem[key].formtype === 2">
                <div>
                  <el-radio
                    v-for="option of formItem[key].options"
                    v-model="wageData[key]"
                    :key="option.value"
                    :label="option.value">
                    {{ option.label }}
                  </el-radio>
                </div>
              </template>

              <template v-if="formItem[key].formtype === 3">
                <el-select v-model="wageData[key]" clearable style="width: 100%" @change="selectChange(key, $event)">
                  <el-option
                    v-for="option in formItem[key].options"
                    :key="option.value"
                    :value="option.value"
                    :label="option.label">
                  </el-option>
                </el-select>
              </template>

              <template v-if="formItem[key].formtype === 4">
                <el-select v-model="multipleVal[key]" clearable multiple style="width: 100%">
                  <li class='el-select-dropdown__item' @click='selmultiAll(key)'>
                    <span>全部</span>
                  </li>
                  <el-option
                    v-for="(option, index) in formItem[key].options"
                    :key="index"
                    :value="option.value"
                    :label="option.label">
                  </el-option>
                </el-select>
              </template>

              <template v-if="formItem[key].formtype === 5">
                <pageSelectMultiple
                  :pagetype="formItem[key].pagetype"
                  :pagedata="formItem[key].pagedata"
                  :viewdata="formItem[key].viewdata"
                  :multiple="formItem[key].multiple"
                  :modelval.sync="wageData[key]"
                  ref="pageSelectMultiple">
                </pageSelectMultiple>
              </template>

              <template v-if="formItem[key].formtype === 6">
                <el-input v-model="wageData[formItem[key].beginField]" clearable></el-input>
                -
                <el-input v-model="wageData[formItem[key].endField]" clearable></el-input>
              </template>

              <template v-if="formItem[key].formtype === 7">
                <pageSelect
                  :pagetype="formItem[key].pagetype"
                  :modelval.sync="wageData[key]"
                  @change="key === 'fid' ? getWtkh($event.id) : ''"
                  ref="pageSelect">
                </pageSelect>
              </template>

              <template v-if="formItem[key].formtype === 8">
                <el-date-picker
                  v-model="wageData[key]"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;">
                </el-date-picker>
              </template>

            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * formtype:
 * 1、输入框
 * 2、单选框
 * 3、下拉单选
 * 4、下拉多选
 * 5、组合下拉框多选 pageSelectMultiple
 * 6、范围输入框
 * 7、组合下拉框 pageSelect
 * 8、日期选择器
 */
import pageSelectMultiple from '../smallTemplate/pageSelectMultiple'

export default {
  name: 'wageFormComp',
  components: { pageSelectMultiple },
  props: {
    serviceList: Array,
    curServicenameList: Array,
    wageData: {
      type: Object,
      required: true
    },
    wagestandard: String
  },
  data () {
    // 币种选项
    let currencyOptions = JSON.parse(localStorage.currencyData).map(i => ({ label: i.cname, value: i.cname }))
    // 航空公司航班号选项
    let AirCompanyOptions = JSON.parse(localStorage.airinfo)
    // 交接地选项
    let jjdOptions = JSON.parse(localStorage.jjd).map(i => {
      return { label: i.cname, value: String(i.id) }
    })

    return {
      multipleVal: {}, // 代理type4的多选
      PubServiceField: '',
      specialWageField: [],

      formData: [
        {
          title: { label: '常用条件' },
          // servicename: { label: '服务类别', formtype: 3, options: [], required: true },
          servicename: { label: '服务类别', formtype: 5, pagetype: -1, pagedata: [], multiple: false, required: true, viewdata: [
            { title: 'servicename', field: 'servicename' },
            { title: '服务类别', field: 'servicename' }
          ]},
          items: { label: '费用名称', formtype: 5, pagetype: -1, pagedata: [], multiple: false, required: true, viewdata: [
            { title: 'label', field: 'label' },
            { title: '费用名称', field: 'label' }
          ]},
          // fid: { label: '委托客户', formtype: 7, pagetype: 1, hidden: true },
          gid: { label: '项目', formtype: 5, pagetype: -1, pagedata: [] },
          sfg: { label: '始发港', formtype: 5, pagetype: 6 },
          mdg: { label: '目的港', formtype: 5, pagetype: 6 },
          pos: { label: '航线区域', formtype: 4, options: [] },
          mawbthreecode: { label: '航空公司', formtype: 5, pagetype: -1, pagedata: AirCompanyOptions, viewdata: [
            { title: 'ThreeCode', field: 'CName' },
            { title: '航空公司', field: 'CName' },
            { title: '三字码', field: 'ThreeCode' }
          ]},
          hbh: { label: '航班号', formtype: 5, pagetype: -1, pagedata: AirCompanyOptions, viewdata: [
            { title: 'TwoCode', field: 'TwoCode' },
            { title: '航空公司', field: 'CName' },
            { title: '航班号', field: 'TwoCode' }
          ]},
          hwxz: { label: '货物性质', formtype: 4, groupid: 32, bindLabel: 'typename', options: [] },
          jjd: { label: '交接地', formtype: 4, options: jjdOptions },
          begindate: { label: '开始日期', formtype: 8, required: true },
          enddate: { label: '结束日期', formtype: 8 },
          serviceincl: { label: '服务包含', formtype: 5, pagetype: -1, pagedata: this.serviceList, viewdata: [
            { title: 'servicecode', field: 'servicename' },
            { title: '服务名称', field: 'servicename' },
            { title: '服务代码', field: 'servicecode' }
          ]},
          czlx:{'label':'操作类型',formtype:3,groupid:132,options:[],bindLabel: 'typename',bindValue: 'ready01'},
          loadingmodel: {
            label: "配载方式",
            formtype: 4,//注意：下拉多选类型为4，而且定义的字段与bo有区别
            groupid: 37,
            options:[]
          }
        },
        {
          title: { label: '特殊条件' },
          cancelorder: { label: '是否撤单', formtype: 2, options: [{ label: '是', value: '1' }, { label: '否', value: '2' }], hidden: true },
          trayweightbegin: { label: '垫仓板重量', formtype: 6, beginField: 'trayweightbegin', endField: 'trayweightend', hidden: true },
          bglx: { label: '报关类型', formtype: 4, groupid: 19, options: [], hidden: true },
          inspection: { label: '是否海关查验', formtype: 2, options: [{ label: '是', value: '1' }, { label: '否', value: '2' }], hidden: true },
          materialpm: { label: '材料品名', formtype: 3, groupid: -10, bindLabel: 'typename', options: [], hidden: true },
          materialstd: { label: '材料规格', formtype: 4, groupid: -20, bindLabel: 'typename', options: [], hidden: true },
          weightbegin: { label: '货物重量', formtype: 6, beginField: 'weightbegin', endField: 'weightend', hidden: true },
          volumebegin: { label: '货物体积', formtype: 6, beginField: 'volumebegin', endField: 'volumeend', hidden: true },
          istodoor: { label: '是否上门服务', formtype: 2, options: [{ label: '是', value: '1' }, { label: '否', value: '2' }], hidden: true },
          clothtype: { label: '挂衣类型', formtype: 2, groupid: 162, options: [], hidden: true },
          clothstd: { label: '挂衣规格', formtype: 4, groupid: 163, options: [], hidden: true },
          packagetype: { label: '改包装方式', formtype: 3, groupid: 181, options: [], hidden: true },
          packagestyle: { label: '改包装类型', formtype: 3, options: [], hidden: true }
        },
        {
          title: { label: '结果' },
          pricetype: { label: '价格类型', formtype: 3, options: [{ label: '单价', value: '1' }, { label: '总价', value: '2' }], required: true },
          currency: { label: '币种', formtype: 3, options: currencyOptions, required: true },
          wagetype: { label: '计费方式', formtype: 3, groupid: 33, bindLabel: 'typename', options: [], required: true },
          childwagetype: { label: '子计费方式', formtype: 3, options: [{ label: '天', value: '天' }], hidden: true }, // 暂时隐藏
          minimal: { label: 'Min单价' , formtype: 1 },
          isfree: { label: '是否免费', formtype: 2, options: [{ label: '是', value: '2' }, { label: '否', value: '1' }], required: true },
          defaultcheck: { label: '是否打勾', formtype: 2, options: [{ label: '是', value: '1' }, { label: '否', value: '2' }], required: true },
          price: { label: '价格', formtype: 1, required: true }
        }
      ]
    }
  },
  created () {
    let formDataObj = this.formDataObj

    let groupidObj = {}
    for (let key in formDataObj) {
      let formItem = formDataObj[key]

      if (formItem.formtype === 4) {
        this.setMultipleValue(key)
      }

      if (formItem.groupid) {
        groupidObj[formItem.groupid] = key
      }
    }

    Object.keys(formDataObj).reduce((p, key) => {
      if (formDataObj[key].groupid) {
        p[formDataObj[key].groupid] = key
      }
      return p
    }, {})

    // 通过formData选项里的groupid配置options
    let groupidArr = Object.keys(groupidObj).map(i => Number(i))
    JSON.parse(localStorage.groupType).forEach(item => {
      if (groupidArr.includes(item.groupid)) {
        let formItem = formDataObj[groupidObj[item.groupid]]
        formItem.options.push({
          value: item[formItem.bindValue || 'typename'],
          label: item[formItem.bindLabel || 'ready01'],
          ...item
        })
      }
    })

    // 处理材料品名和材料规格的联动
    this.formDataObj.materialstd.optionsBackup = this.formDataObj.materialstd.options
    this.formDataObj.materialstd.options = []

    // 获取特殊字段对应关系
    this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubServiceField', params: {area: ''}, loading: false, tip: false})
    .then(({ data }) => {
      this.PubServiceField = data
    })

    // 航线区域选项
    this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubWffArea', params: {area: ''}, loading: false, tip: false})
    .then(({ data }) => {
      this.formDataObj.pos.options = data.map(i => {
        return { label: i.Areaname, value: String(i.id) }
      })
    })
  },
  computed: {
    fwxm () {
      return JSON.parse(localStorage.fwxm)
    },
    // 拍平成对象的form数据
    formDataObj () {
      return Object.assign({}, ...this.formData)
    },
    activeServicecode () {
      let code = ''
      for (let item of this.serviceList) {
        if (item.servicename === this.wageData.servicename) {
          code = item.servicecode
          break
        }
      }
      return code
    },
    wageTitleText () {
      let textArr = []
      let excludeField = ['area', 'system', 'sid', 'fid', 'guid', 'itemstatus']

      for (let key of Object.keys(this.wageData)) {
        if (excludeField.includes(key) || !this.wageData[key]) continue

        // if (key === 'fid' && this.wageData[key] !== -1) {
        //   if (this.$refs.pageSelect) {
        //     textArr.push(this.$refs.pageSelect[0].usr_name)
        //   }
        // } else
        if (key === 'price') {
          textArr.push(Number(this.wageData[key]).toFixed(2))

        } else if (key === 'gid') {
          if (this.$refs.pageSelectMultiple) {
            textArr.push(this.$refs.pageSelectMultiple[0].usr_name)
          }

        } else if (key === 'pricetype') {
          textArr.push(this.wageData[key] === '1' ? '单价' : '总价')

        } else if (key === 'cancelorder' && this.specialWageField.includes('cancelorder')) {
          textArr.push(this.wageData[key] === '1' ? '撤单' : '非撤单')

        } else if (key === 'isfree') {
          textArr.push(this.wageData[key] === '1' ? '不免' : '免')

        } else if (key === 'defaultcheck') {
          textArr.push(this.wageData[key] === '1' ? '打勾' : '不打勾')

        } else if (key === 'serviceincl') {
          let inclArr = this.wageData[key].split(',')
          textArr.push(this.formDataObj.serviceincl.pagedata.filter(i => inclArr.includes(i.servicecode)).map(i => i.servicename).join(','))

        } else if (key === 'pos') {
          let posLabelArr = []
          let posValueArr = this.wageData[key].split(',')
          this.formDataObj.pos.options.forEach(option => {
            if (posValueArr.includes(option.value)) {
              posLabelArr.push(option.label)
            }
          })
          textArr.push(posLabelArr.join(','))

        } else if (key === 'jjd') {
          let jjdLabelArr = []
          let jjdValueArr = this.wageData[key].split(',')
          this.formDataObj.jjd.options.forEach(option => {
            if (jjdValueArr.includes(option.value)) {
              jjdLabelArr.push(option.label)
            }
          })
          textArr.push(jjdLabelArr.join(','))

        } else if (this.wageData[key] != '-1') {
          textArr.push(this.wageData[key])

        }
      }
      return textArr.join(' - ')
    }
  },
  watch: {
    curServicenameList (val) {
      if (val) {
        // this.formDataObj['servicename'].options = val.map(i => ({ label: i, value: i }))
        this.formDataObj['servicename'].pagedata = val.map(i => ({ servicename: i }))
      }
    },
    activeServicecode: {
      immediate: true,
      handler (val) {
        // 切换特殊条件
        this.specialWageField = []
        ;(this.PubServiceField || []).forEach(item => {
          if (item.servicecode === val) {
            this.specialWageField.push(item.fieldname)
          }
        })

        // 设置服务对应的费用选项
        this.formData[0].items.pagedata = []
        if (val) {
          // system 为 空出、海出、陆出、铁出 时排除s_group === '运费类' 的费用
          let excludeWageGroup = ['空出', '海出', '陆出', '铁出'].includes(this.wageData.system)

          this.fwxm.forEach(item => {
            if (item.servicecode !== val) return
            if (excludeWageGroup && item.s_group === '运费类') return

            this.formData[0].items.pagedata.push({
              value: item.s_name,
              label: item.s_name
            })
          })
        }
      }
    },
    // 切换服务动态显示对应的特殊条件
    specialWageField: {
      immediate: true,
      handler (val) {
        for (let key in this.formData[1]) {
          this.formData[1][key].hidden = val.includes(key) ? false : true
        }
      }
    },
    wagestandard: {
      immediate: true,
      handler (val) {
        if (val === '唯凯标准') {
          // this.formData[0].fid.hidden = true
          this.formData[0].gid.hidden = true
        } else {
          // this.formData[0].fid.hidden = false
          this.formData[0].gid.hidden = false
        }
      }
    },
    'wageData.servicename' (val) {
      let excludeService
      this.formDataObj.serviceincl.pagedata = this.serviceList.filter(i => {
        if (i.servicename === val) {
          excludeService = i
          return false
        }
        return true
      })

      if (!excludeService) return
      let serviceinclArr = this.wageData.serviceincl.split(',')
      let indexOf = serviceinclArr.indexOf(excludeService.servicecode)
      if (indexOf !== -1) {
        serviceinclArr.splice(indexOf, 1)
        this.wageData.serviceincl = serviceinclArr.join(',')
      }
    },
    'wageData.items' (val) {
      // 获取sid
      if (!val) this.wageData.sid = ''
      for (let item of this.fwxm) {
        if (item.s_name === val && item.servicecode === this.activeServicecode) {
          this.wageData.sid = item.id
          break
        }
      }
    },
    'wageData.fid' (fid) {
      this.getWtkh(fid)
    },
    'wageData.materialpm' (val) {
      let ready02 = ''
      for (let item of this.formDataObj.materialpm.options) {
        if (item.typename === val) {
          ready02 = item.ready02
          break
        }
      }
      this.formDataObj.materialstd.options = this.formDataObj.materialstd.optionsBackup.filter(i => {
        return i.ready02 === ready02
      })
      // 材料规格为 -1 时是全选
      // if (this.wageData.materialstd === '-1') {
      //   this.wageData.materialstd = this.formDataObj.materialstd.options.map(i => i.value).join(',')
      // }
    }
  },
  methods: {
    // 设置type4多选的代理
    setMultipleValue (key) {
      this.$set(this.multipleVal, key, [])

      this.$watch(
        function () {
          return this.wageData[key]
        },
        function (val) {
          this.multipleVal[key] = val ? val.toString().split(',') : []
        },
        { immediate: true }
      )

      this.$watch(
        function () {
          return this.multipleVal[key]
        },
        function (val) {
          this.wageData[key] = val.join(',')
        }
      )
    },
    // type5 全选按钮
    selmultiAll (key) {
      if (this.multipleVal[key].length === this.formDataObj[key].options.length) {
        this.multipleVal[key] = []
      } else {
        this.multipleVal[key] = this.formDataObj[key].options.map(i => i.value)
      }
    },
    getWtkh (id) {
      if (!id) return []

      let data = getxmdata('xmdata').filter(i =>{
        return i.comxz == 1 && i.fid == id && i.customxz != 2
      }).map(i => {
        i.usr_name = i.usr_name.split('-')[0]
        i.usr_code = i.usr_code.split('-')[1]
        return i
      })

      this.formData[0].gid.pagedata = data
    },
    checkRequiredField () {
      for (let key in this.formDataObj) {
        if (this.formDataObj[key].required && !this.wageData[key]) {
          this.$message.error('请输入' + this.formDataObj[key].label)
          return false
        }
      }
      return true
    },
    selectChange (key, value) {
      if (key === 'materialpm') {
        this.wageData['materialstd'] = ''
      } else if (key === 'packagetype') {
        this.wageData['packagestyle'] = ''

        let groupType = JSON.parse(localStorage.groupType)
        let data = groupType.filter(i => i.groupid === 181 && i.ready01 === this.wageData[key])

        if (data.length > 0) {
          this.formDataObj.packagestyle.options = groupType.filter(i => i.groupid === 166 && i.ready02 == data[0].id).map(n => ({ label: n.typename, value: n.typename }))
        }
      } else if (key === 'servicename') {
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
          'volumeend',
          'packagetype'
        ]
        for (let key of field) {
          this.wageData[key] = ''
        }

        // 切换服务时清空费用
        this.wageData.items = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wage-form-comp {
  .wage-title {
    margin-bottom: 15px;
    color: #000;
    font-weight: bold;
    font-size: 16px;
  }
  .form-c {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .form-title {
      width: 100%;
      margin: 16px 0 5px;
      &:first-child {
        margin-top: 0;
      }
    }
    .form-item {
      display: flex;
      align-items: center;
      width: 300px;
      min-width: 300px;
      height: 30px;
      margin: 0 20px 12px 0;
      border: 1px solid #c9c9c9;
      border-radius: 4px;
      &.input-required {
        background: #fff8ef;
      }
      &.price {
        /deep/ input {
          color: red;
        }
      }
      .item-title {
        color: #555;
        text-align: left;
        padding-left: 6px;
        min-width: 80px;
      }
      /deep/ .item-content {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        input {
          border: none;
          text-align: right;
        }
        .el-radio {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
