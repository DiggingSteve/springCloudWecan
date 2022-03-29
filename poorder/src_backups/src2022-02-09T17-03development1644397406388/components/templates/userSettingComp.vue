<template>
  <el-dialog title="用户设置" width="550px" top="30px" center v-if="userSettingVisible" custom-class="user-setting-dialog"
    :close-on-click-modal="false" :visible.sync="userSettingVisible" append-to-body>
    <div class="setting-c">
      <div class="setting-group">
        <h3 class="group-title">左侧菜单默认设置</h3>

        <div class="setting-item areaSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的站点
              <explainTooltip text="查询订单时将只显示与所选站点有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="areaCheckedBackup" ref="userSettingAreaSelect" multiple placeholder="请选择"
            popper-class="userSettingAreaSelect" @visible-change="areaSelectVisibleChange">
            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeAreaChecked=false;$refs.userSettingAreaSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>区域选择</h3>
              </div>
              <div class="title-right">
                <p @click="areaCheckedAll = !areaCheckedAll" :class="['check-all', {'active': areaCheckedAll}]">全选</p>
                <p @click="changeAreaChecked=true;$refs.userSettingAreaSelect.blur()" class="confirm">确定</p>
              </div>
            </div>
            <table>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 0">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 1">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
            </table>
          </el-select>

        </div>

        <div class="setting-item systemSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的系统
              <explainTooltip text="查询订单时将只显示与所选系统有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="systemCheckedBackup" ref="userSettingSystemSelect" multiple placeholder="请选择"
            popper-class="userSettingSystemSelect" @visible-change="systemSelectVisibleChange">
            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeSystemChecked=false;$refs.userSettingSystemSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>系统选择</h3>
              </div>
              <div class="title-right">
                <p @click="systemCheckedAll = !systemCheckedAll" :class="['check-all', {'active': systemCheckedAll}]">全选
                </p>
                <p @click="changeSystemChecked=true;$refs.userSettingSystemSelect.blur()" class="confirm">确定</p>
              </div>
            </div>
            <table>
              <tr>
                <td v-for="(group) in systemArrList" :key="group.label">
                  <el-option-group :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                      style="width:204px;"></el-option>
                  </el-option-group>
                </td>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item serviceSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的服务
              <explainTooltip text="查询订单时将只显示与所选服务有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="serviceCheckedBackup" multiple clearable popper-class="userSettingServiceSelect"
            ref="userSettingServiceSelect" placeholder="请选择" @visible-change="serviceSelectVisibleChange">

            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeServiceChecked=false;$refs.userSettingServiceSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>服务选择</h3>
              </div>
              <div class="title-right">
                <p @click="serviceCheckedAll = !serviceCheckedAll"
                  :class="['check-all', {'active': serviceCheckedAll}]">全选</p>
                <p @click="changeServiceChecked=true;$refs.userSettingServiceSelect.blur()" class="confirm">确定</p>
              </div>
            </div>

            <el-tabs v-model="activeServiceTab" type="card" class="serviceTabCard">
              <el-tab-pane v-for="system in Object.keys(serviceOptions)" :name="system" :label="system" :key="system">
                <table>
                  <template v-for="portItem of serviceOptions[system]">
                    <div :key="portItem.port">
                      <tr style="color:#333;font-weight:600;font-size:15px;">{{ portItem.port }}</tr>
                      <div :style="{'font-size':'15px'}" valign="top" class="portItemDiv">
                        <div v-for="type in getServiceType(portItem.serviceBasicList)">
                          <span style="margin-bottom:6px;">{{type}}</span>
                          <div>
                            <el-option style="width: 130px"
                              v-for="item in portItem.serviceBasicList.filter(i => i.servicetype == type)"
                              :key="item.servicecode" :label="item.servicename" :value="item.selectValue">
                            </el-option>
                          </div>
                        </div>
                      </div>

                    </div>
                  </template>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-select>
        </div>

        <div class="setting-item" v-show="projectIsWecan">
          <div class="setting-info">
            <p class="item-text">默认显示左侧菜单待处理的票数</p>
            <p :class="['item-status', {'active': userSettingBackup.showSystemCount}]">{{
              userSettingBackup.showSystemCount ? '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showSystemCount"></el-switch>
        </div>

        <div class="setting-item" v-show="projectIsWecan&&userSettingBackup.showSystemCount">
          <div class="setting-info">
            <p class="item-text">自动刷新左侧菜单待处理的票数的间隔
              <explainTooltip text="当开启‘默认显示左侧菜单待处理的票数’时，每隔一段时间自动获取最新数据"></explainTooltip>
            </p>
          </div>

          <el-select v-model="userSettingBackup.refreshInterval" placeholder="请选择" style="width:150px">
            <el-option v-for="item in timeInterval" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </div>





      </div>

      <div class="setting-group">
        <h3 class="setting-title">各页面默认设置</h3>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">查询后查询条件自动收缩</p>
            <p :class="['item-status', {'active': userSettingBackup.autoCollapse}]">{{ userSettingBackup.autoCollapse ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.autoCollapse"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">列表页汇总显示</p>
            <p :class="['item-status', {'active': userSettingBackup.showSearchTotalInfo}]">{{
              userSettingBackup.showSearchTotalInfo ? '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showSearchTotalInfo"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">进入页面默认查询</p>
            <p :class="['item-status', {'active': userSettingBackup.autoSearch}]">{{ userSettingBackup.autoSearch ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.autoSearch"></el-switch>
        </div>

        <div class="setting-item" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">操作提醒(AMS)</p>
            <p :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
              '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.amsOpen"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">订单摘要页面显示</p>
            <p :class="['item-status', {'active': userSettingBackup.showInfoList}]">{{ userSettingBackup.showInfoList ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showInfoList"></el-switch>
        </div>
      </div>

      <div class="setting-group" v-show="paneShow">
        <h3 class="setting-title">新增订单默认设置</h3>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">
              新增订单默认匹配的站点
              <explainTooltip text="新增订单时默认选中选择的站点。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="userSettingBackup.mawbAddArea" placeholder="请选择" popper-class="userSettingAreaSelect">
            <div class="title">
              <div class="title-left">
                <h3>区域选择</h3>
              </div>
            </div>
            <table>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 0">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 1">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">
              新增订单默认匹配的系统
              <explainTooltip text="新增订单时默认选中选择的系统。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="mawbAddSystemBackup" placeholder="请选择" popper-class="userSettingSystemSelect">
            <div class="title">
              <div class="title-left">
                <h3>系统选择</h3>
              </div>
            </div>
            <table>
              <tr>
                <td v-for="(group) in mawbAddSystemOptions" :key="group.label">
                  <el-option-group :label="group.label">
                    <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.label"
                      style="width:204px;"></el-option>
                  </el-option-group>
                </td>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">新增费用时默认币种</p>
          </div>
          <el-select v-model="userSettingBackup.defaultCurrency" placeholder="请选择币种">
            <el-option v-for="item in currencyList" :key="item" :label="item" :value="item" style="padding:0 20px;">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="footer">
        <div class="btn-c">
          <el-button type="primary" @click="updateUserSetting">保存</el-button>
          <el-button @click="userSettingVisible = false">取消</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        required: true,
        type: Boolean
      },
      serviceBasic: Array,
    },
    data() {

      return {
        userSettingBackup: {},
        areaCheckedBackup: [],
        changeAreaChecked: false,

        systemCheckedBackup: [],
        changeSystemChecked: false,

        serviceCheckedBackup: [],
        changeServiceChecked: false,
        activeServiceTab: '',

        // mawbAddServiceBackup: [],
        // changeMawbAddService: false,

        mawbAddSystemOptions: [
          {
            label: "出口",
            options: [
              { label: "空出", value: "空运" },
              { label: "海出", value: "海运" },
              { label: "陆出", value: "陆运" },
              { label: "铁出", value: "铁运" }
            ]
          },
          {
            label: "进口",
            options: [
              { label: "空进", value: "空运" },
              { label: "海进", value: "海运" },
              { label: "陆进", value: "陆运" },
              { label: "铁进", value: "铁运" }
            ]
          },
          {
            label: "国内服务",
            options: [{ value: "国内服务", label: "国内服务" }]
          }
        ]
      }
    },
    computed: {
      cities() {
        return this.$store.state.cities
      },
      systemArrList() {
        return this.$store.state.systemArrList;
      },
      currencyList() {
        return JSON.parse(localStorage.currencyData).map(i => i.cname);
      },
      paneShow(){
            return sessionStorage.system!='outside'
      },
      timeInterval() {
        let options = [{ label: '不自动刷新', value: 0 }]
        for (let i = 1; i <= 6; i++) {
          options.push({ label: i * 10 + '分钟', value: i * 10 })
        }
        return options
      },
      userSettingVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        }
      },
      // 服务选项，根据所选系统联动
      serviceOptions() {
        let options = {}
        if (!this.userSettingBackup.systemChecked) return options

        for (let item of this.serviceBasic) {
          if (this.userSettingBackup.systemChecked.includes(item.system)) {
            if (!options[item.system]) options[item.system] = []
            options[item.system].push(item)
          }
        }

        this.activeServiceTab = Object.keys(options)[0]
        return options
      },
      // 平铺的服务选项
      serviceOptionsArr() {
        let arr = []
        if (!this.userSettingBackup.systemChecked) return arr

        for (let item of this.serviceBasic) {
          if (this.userSettingBackup.systemChecked.includes(item.system)) {
            for (let item2 of item.serviceBasicList) {
              arr.push(item2)
            }
          }
        }
        return arr
      },
      serviceOptionsLength() {
        return this.serviceOptionsArr.length
      },
      servicetypeArr() {
        let type = []
        for (let system of Object.keys(this.serviceOptions)) {
          if (system !== this.activeServiceTab) continue
          for (let item of this.serviceOptions[system]) {
            for (let item2 of item.serviceBasicList) {
              if (!type.includes(item2.servicetype)) {
                type.push(item2.servicetype)
              }
            }
          }
        }
        return type
      },
      areaCheckedAll: {
        get() {
          let length = 0;
          this.cities.forEach(item => {
            length += item.options.length
          })

          if (this.areaCheckedBackup.length === length) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          if (val) {
            this.cities.forEach(item => {
              item.options.forEach(item2 => {
                if (!this.areaCheckedBackup.includes(item2.value)) {
                  this.areaCheckedBackup.push(item2.value)
                }
              })
            })
          } else {
            this.areaCheckedBackup = []
          }
        }
      },
      systemCheckedAll: {
        get() {
          let length = 0
          this.systemArrList.forEach(i => {
            length += i.options.length
          })

          if (this.systemCheckedBackup.length === length) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          if (val) {
            this.systemArrList.forEach(item => {
              item.options.forEach(item2 => {
                if (!this.systemCheckedBackup.includes(item2.value)) {
                  this.systemCheckedBackup.push(item2.value)
                }
              })
            })
          } else {
            this.systemCheckedBackup = []
          }
        }
      },
      serviceCheckedAll: {
        get() {
          if (this.serviceCheckedBackup.length === this.serviceOptionsLength) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          // console.log(22222222222)
          if (val) {
            for (let system of Object.keys(this.serviceOptions)) {
              for (let item of this.serviceOptions[system]) {
                for (let item2 of item.serviceBasicList) {
                  if (!this.serviceCheckedBackup.includes(item2.selectValue)) {
                    this.serviceCheckedBackup.push(item2.selectValue)
                  }
                }
              }
            }
          } else {
            this.serviceCheckedBackup = []
          }
        }
      },
      // mawbAddServiceCheckedAll: {
      //   get () {
      //     let length = 0
      //     length = this.service.sfg.length + this.service.mdg.length

      //     if (this.mawbAddServiceBackup.length === length) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   },
      //   set (val) {
      //     if (val) {
      //       this.service.sfg.forEach(item => {
      //         if (!this.mawbAddServiceBackup.includes(item.servicecode)) {
      //           this.mawbAddServiceBackup.push(item.servicecode)
      //         }

      //         this.service.mdg.forEach(item => {
      //           if (!this.mawbAddServiceBackup.includes(item.servicecode)) {
      //             this.mawbAddServiceBackup.push(item.servicecode)
      //           }
      //         })
      //       })
      //     } else {
      //       this.mawbAddServiceBackup = []
      //     }
      //   }
      // },
      mawbAddSystemBackup: {
        get() {
          let system = ''
          let mawbAddSystem = this.userSettingBackup.mawbAddSystem
          if (mawbAddSystem && mawbAddSystem.opersystem && mawbAddSystem.opersystemdom) {
            this.mawbAddSystemOptions.forEach(item => {
              if (item.label === mawbAddSystem.opersystem) {
                item.options.forEach(option => {
                  if (option.value === mawbAddSystem.opersystemdom) {
                    system = option.label
                  }
                })
              }
            })
            return system
          } else {
            return ''
          }
        },
        set(val) {
          let opersystem = '', opersystemdom = ''
          for (let item of this.mawbAddSystemOptions) {
            for (let option of item.options) {
              if (option.label === val) {
                opersystem = item.label
                opersystemdom = option.value
              }
            }
          }
          this.userSettingBackup.mawbAddSystem = { opersystem, opersystemdom }
        }
      }
    },
    watch: {
      userSettingVisible(val) {
        if (!val) return
        this.userSettingBackup = { ...this.$store.getters.userSetting }
        this.areaCheckedBackup = this.userSettingBackup.areaChecked ? this.userSettingBackup.areaChecked.split(',') : []
        this.systemCheckedBackup = this.userSettingBackup.systemChecked ? this.userSettingBackup.systemChecked.split(',') : []
        // this.mawbAddServiceBackup = this.userSettingBackup.mawbAddService ? this.userSettingBackup.mawbAddService.split(',') : []

        if (this.userSettingBackup.serviceChecked) {
          this.setServiceCheckedBackup(this.userSettingBackup.serviceChecked.split(','))
        }
      },
      serviceOptions: {
        deep: true,
        handler() {
          if (this.serviceOptionsArr.length === 0) return
          let valueArr = this.serviceOptionsArr.map(i => i.selectValue)
          // 去除选项里没有的数据
          for (let i = 0; i < this.serviceCheckedBackup.length; i++) {
            if (!valueArr.includes(this.serviceCheckedBackup[i])) {
              this.serviceCheckedBackup.splice(i, 1)
              i--
            }
          }

          this.setServiceChecked(this.serviceCheckedBackup)
        }
      }
    },
    methods: {
      getServiceType(item) {
        return [...new Set(item.map(i => i.servicetype))]
      },
      areaSelectVisibleChange(val) {
        if (!val && this.changeAreaChecked) {
          this.userSettingBackup.areaChecked = this.areaCheckedBackup.join(',')
          this.changeAreaChecked = false
        }

        this.areaCheckedBackup = this.userSettingBackup.areaChecked ? this.userSettingBackup.areaChecked.split(',') : []
      },
      systemSelectVisibleChange(val) {
        if (!val && this.changeSystemChecked) {
          this.userSettingBackup.systemChecked = this.systemCheckedBackup.join(',')
          this.changeSystemChecked = false
        }

        this.systemCheckedBackup = this.userSettingBackup.systemChecked ? this.userSettingBackup.systemChecked.split(',') : []
      },
      serviceSelectVisibleChange(val) {
        if (!val && this.changeServiceChecked) {
          this.setServiceChecked(this.serviceCheckedBackup)
          this.changeServiceChecked = false
        }

        this.setServiceCheckedBackup(this.userSettingBackup.serviceChecked.split(','))


        this.activeServiceTab = Object.keys(this.serviceOptions)[0]
      },
      setServiceChecked(serviceCheckedBackup) {
        let serviceArr = serviceCheckedBackup.map(i => i.split('|'))
        let tempService = {}
        serviceArr.forEach(i => {
          if (!tempService[i[1]]) tempService[i[1]] = ''
          tempService[i[1]] += i[0] + '|'
        })

        let serviceCheckedArr = [], serviceCheckedSystemArr = []
        for (let servicecode of Object.keys(tempService)) {
          serviceCheckedArr.push(servicecode)
          serviceCheckedSystemArr.push(tempService[servicecode].slice(0, -1))
        }
        this.userSettingBackup.serviceChecked = serviceCheckedArr.join(',')
        this.userSettingBackup.serviceCheckedSystem = serviceCheckedSystemArr.join(',')
      },
      setServiceCheckedBackup(serviceChecked) {
        // 服务选项里需要区分系统，不同系统里存在相同的servicecode，为了区分系统，使用 "系统|服务代码" 当临时数据
        let system = this.userSettingBackup.serviceCheckedSystem ? this.userSettingBackup.serviceCheckedSystem.split(',') : []
        let serviceArr = []
        serviceChecked.forEach((servicecode, index) => {
          if (system[index]) {
            system[index].split('|').forEach(item => {
              serviceArr.push(item + '|' + servicecode)
            })
          } else {
            for (let item of this.serviceOptionsArr) {
              if (item.servicecode === servicecode) {
                serviceArr.push(item.system + '|' + servicecode)
                break
              }
            }
          }
        })
        //    console.log(1111111111)
        // console.log(serviceArr)
        this.serviceCheckedBackup = serviceArr
      },
      // mawbAddServiceVisibleChange (val) {
      //   if (!val && this.changeMawbAddService) {
      //     this.userSettingBackup.mawbAddService = this.mawbAddServiceBackup.join(',')
      //     this.changeMawbAddService = false
      //   }

      //   this.mawbAddServiceBackup = this.userSettingBackup.mawbAddService ? this.userSettingBackup.mawbAddService.split(',') : []
      // },
      updateUserSetting() {
        // console.log(JSON.parse(JSON.stringify(this.userSettingBackup)))
        // return
        this.$store.dispatch('updateUserSetting', this.userSettingBackup)
          .then(({ data }) => {
            if (data.resultstatus === 0) {
              this.userSettingVisible = false
              this.$emit('success', this.userSettingBackup.showSystemCount)
            }
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-setting-dialog {
    .setting-c {
      padding: 10px 30px;

      .setting-group {
        margin-bottom: 30px;

        .setting-title {
          margin-top: 30px;

          &:first-child {
            margin-top: 0;
          }
        }

        .setting-item {
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 65px;
          border-bottom: 1px solid #e8e8e8;

          .setting-info {
            .item-text {
              font-size: 14px;
            }

            .item-status {
              color: #c8c8c8;

              &.active {
                color: #409eff;
              }
            }
          }

          .el-switch {
            margin-top: 10px;
          }
        }
      }

      .footer {
        overflow: hidden;

        .btn-c {
          float: right;

          .el-button {
            padding: 8px 20px;
          }
        }
      }
    }
  }

  .portItemDiv {
    display: flex;
    padding-left: 114px;
    transform: translateY(-30px);

    >div {
      display: flex;
      flex-direction: column;
    }

    li.el-select-dropdown__item {
      padding: 0px
    }
  }
</style>

<style lang="less">
  .userSettingAreaSelect {
    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          width: 165px !important;

          &:after {
            right: 35px !important;
          }
        }
      }
    }
  }

  .userSettingSystemSelect {
    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          width: 165px !important;

          &:after {
            right: 20px !important;
          }
        }
      }
    }
  }

  .userSettingServiceSelect {
    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          padding: 0;

          &:after {
            right: 20px !important;
          }
        }
      }
    }
  }
</style>