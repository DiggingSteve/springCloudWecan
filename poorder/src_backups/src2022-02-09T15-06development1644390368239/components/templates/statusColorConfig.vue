<template>
  <div class="status-color-config">
    <h3 class="title">
      显示字段
      <!-- <span v-if="activeStatusColorTemp.name" class="temp-name">（当前模板：{{ activeStatusColorTemp.name }}）</span> -->
    </h3>
    <!-- {{viewData}} -->
    <!-- {{defaultStatusColorTemp}} -->
    <div class="field-container">
      <div class="status-c">
        <div :class="['status-item', {'active': activeStatusKey === statusKey }]"
          v-for="statusKey of Object.keys(viewData)" :key="statusKey" @click="activeStatusKey = statusKey">
          <i class="selected-icon"></i>
          {{ viewData[statusKey].title }}
        </div>
      </div>
      <div class="options-c" v-if="activeStatusKey">
        <div class="option" v-for="(option, index) of viewData[activeStatusKey].options" :key="option.value">
          <span class="number">{{ String(index+1).padStart(2, '0') }}</span>
          <span class="label" :style="{color: option.color || ''}" :val="option.value">{{ option.label }}</span>
          <el-color-picker v-model="option.color" size="mini" :predefine="predefineColors"></el-color-picker>
        </div>
      </div>
    </div>

    <div class="btn-c">
      <!-- <el-button type="primary" @click="showSaveTemp = true">保存模板</el-button> -->
      <el-button type="primary" @click="saveUserTemp">保存</el-button>
      <el-button type="primary" @click="updateStatusOptionColor(defaultStatusColorTemp)">恢复默认</el-button>
    </div>

    <!-- <div class="savetemp-c" v-show="showSaveTemp">
      <el-input v-model="inputTempName" placeholder="请输入模板名称" class="input-required" ref="inputTempNameRef"></el-input>
      <el-button type="primary" @click="saveStatusColorTemp('2')" v-if="activeStatusColorTemp.name !== ''">修改当前模板</el-button>
      <el-button type="primary" @click="saveStatusColorTemp('1')">保存为新模板</el-button>
    </div> -->

    <!-- <el-button @click="updateDefaultTemp">更新默认模板-开发用</el-button> -->
    <!-- <el-button @click="saveDefaultTemp">添加默认模板-开发用</el-button> -->
  </div>
</template>

<script>
  // type: 150
  export default {
    data() {
      return {
        tempType: 150,

        activeStatusKey: 'status',
        viewData: {
          status: { title: '订单状态', dom: '订单状态' },
          dzstatus: { title: '单证状态', dom: '单证状态' },
          pcstatus: { title: '配舱状态', dom: '配舱状态' },
          hwstatus: { title: '货物状态', dom: '货物状态' },
          bgstatus: { title: '报关状态', dom: '报关状态' },
          customstatus: { title: '海关联系单发送状态', groupid: 148 },
          pdfinishstatus: {
            title: '配单完成状态', options: [
              { label: '未完成', nodeindex: '1',color: '#f56c6c' },
              { label: '已完成', nodeindex: '100',color: '#5bb01d' }
            ]
          },
        },
        predefineColors: [
          '#333333',
          '#5bb01d',
          '#f56c6c',
          '#93de6e'
        ],

        showSaveTemp: false,
        inputTempName: ''
      }
    },
    computed: {
      defaultStatusColorTemp() {
        return this.$store.getters.defaultStatusColorTemp || { name: '', type: 150, isactivate: 1, jsondata: JSON.stringify(this.$options.defaultTemp) }
      },
      statusColorTempAll() {
        return this.$store.getters.statusColorTempAll
      },
      activeStatusColorTemp() {
        let temp = null
        for (let item of this.statusColorTempAll) {
          if (item.isactivate === 1) {
            temp = item
            break
          }
        }
        if (!temp) temp = this.defaultStatusColorTemp

        return temp
      }
    },
    watch: {
      activeStatusColorTemp(temp) {
        this.updateStatusOptionColor()
      }
    },
    created() {
      let statusData = JSON.parse(localStorage.getItem('statusData'))
      let groupData = JSON.parse(localStorage.getItem("groupType"));

      this.inputTempName = this.activeStatusColorTemp.name || ''

      for (let item of Object.values(this.viewData)) {
        this.$set(item, 'options', item.options || [])

        if (item.dom) {
          let system = item.system || '空出'

          if (item.options.length === 0) {
            for (let statusItem of statusData) {
              if (item.dom === statusItem.dom && system === statusItem.system) {
                item.options.push({
                  label: statusItem.nodename,
                  nodeindex: statusItem.nodeindex,
                  color: ''
                })
              }
            }
          }
        }
        if (item.groupid) {
          let index = 0;
          for (let j in groupData) {
            if (item.groupid == groupData[j].groupid) {
              this.$set(item.options, index, {
                nodeindex: groupData[j][item.bindValue || "ready01"],
                label: groupData[j][item.bindLabel || "typename"],
                color: ''
              });
              index += 1;
            }
          }
        }
      }

      this.updateStatusOptionColor()
    },
    methods: {
      updateStatusOptionColor(temp) {
        //  console.log(temp)
        let jsondata = ''
        if (temp) {
          // jsondata =JSON.parse(temp.jsondata)
          jsondata = this.$options.defaultTemp
        } else {
          jsondata = JSON.parse(this.activeStatusColorTemp.jsondata)
        }
        for (let key of Object.keys(this.viewData)) {
          let options = this.viewData[key].options || []
          for (let option of options) {
            option.color = jsondata[key] ? jsondata[key][option.nodeindex] : ''
          }
        }
      },
      async getTableTmpAll() {
        // 获取全部模板数据
        if (localStorage.getItem('usrname')) {
          await this.$axios({
            method: 'get',
            url: this.$store.state.publicWebApi + 'api/UserTemplet',
            params: {
              logname: localStorage.getItem('usrname'),
              project: 'bomanagement'
            },
            loading: false,
            tip: false
          }).then(({ data }) => {
            this.$store.commit('setTableTmpAll', data)
          })
        }
      },
      // 保存用户模板，每个用户只需要一个模板，不需要添加多个模板的功能
      saveUserTemp() {
        let jsondata = Object.keys(this.viewData).reduce((prev, key) => {
          prev[key] = {}
          this.viewData[key].options.forEach(i => {
            prev[key][i.nodeindex] = i.color
          })
          return prev
        }, {})

        let method = ''
        let data = [{
          czman: localStorage.getItem('usrname'),
          dom: '出口部',
          isactivate: 1,
          jsondata: JSON.stringify(jsondata),
          logname: localStorage.getItem('usrname'),
          name: 'userColorTemp',
          type: this.tempType,
          url: '',
          project: 'bomanagement',
          logExtraData: this.logExtraDataForBuild
        }]

        let userColorTemp = this.statusColorTempAll.find(i => i.type === this.tempType && i.name === 'userColorTemp')
        if (userColorTemp) {
          method = 'put'
          data[0].id = userColorTemp.id
        } else {
          method = 'post'
        }

        this.$axios({ method, url: this.$store.state.publicWebApi + 'api/UserTempletList', data, loading: false, tip: true, noarea: 1 })
          .then(async result => {
            if (result.data.resultstatus == 0) {
              await this.getTableTmpAll()
              this.$emit('change', true)
            }
          })
      },
      // type: 1.新增模板  2.修改模板
      // saveStatusColorTemp (type) {
      //   if (!this.inputTempName) {
      //     return this.$message.error('请输入模板名称')
      //   }

      //   let jsondata = Object.keys(this.viewData).reduce((prev, key) => {
      //     prev[key] = {}
      //     this.viewData[key].options.forEach(i => {
      //       prev[key][i.nodeindex] = i.color
      //     })
      //     return prev
      //   }, {})

      //   let method = ''
      //   let data = [{
      //     czman: localStorage.getItem('usrname'),
      //     dom: '出口部',
      //     isactivate: 1,
      //     jsondata: JSON.stringify(jsondata),
      //     logname: localStorage.getItem('usrname'),
      //     name: this.inputTempName,
      //     type: this.tempType,
      //     url: '',
      //     project: 'bomanagement',
      //     logExtraData: this.logExtraDataForBuild
      //   }]

      //   if (type === '1') {
      //     method = 'post'
      //     for (let item of this.statusColorTempAll) {
      //       if (item.name === this.inputTempName) {
      //         this.$refs.inputTempNameRef.select()
      //         return this.$message.error('模板名称重复')
      //       }
      //       if (item.jsondata === jsondata) {
      //         return this.$message.error('模板内容重复，请修改颜色后保存')
      //       }
      //     }
      //   } else {
      //     method = 'put'
      //     for (let item of this.statusColorTempAll) {
      //       if (item.id === this.activeStatusColorTemp.id) continue

      //       if (item.name === this.inputTempName) {
      //         this.$refs.inputTempNameRef.select()
      //         return this.$message.error('模板名称重复')
      //       }
      //       if (item.jsondata === jsondata) {
      //         return this.$message.error('模板内容重复，请修改颜色后保存')
      //       }
      //     }

      //     data[0].id = this.activeStatusColorTemp.id
      //   }

      //   this.$axios({method, url: this.$store.state.publicWebApi + 'api/UserTempletList', data, loading: false, tip: true, noarea: 1})
      //   .then(async result => {
      //     if (result.data.resultstatus == 0) {
      //       await this.getTableTmpAll()
      //       this.inputTempName = ''
      //       this.$emit('change', true)
      //     }
      //   })
      // },
      /**
       * 开发使用，更新默认模板
       * 默认模板: type === 150 && name === ''
       */
      updateDefaultTemp() {
        if (process.env.NODE_ENV !== 'development') {
          return
        }

        let jsondata = JSON.stringify(this.$options.defaultTemp)

        let id = this.defaultStatusColorTemp.id

        if (!id) {
          return this.$message.error('默认模板ID不存在')
        }

        let data = [{
          jsondata,
          url: '',
          logExtraData: this.logExtraDataForBuild,
          isactivate: 1,
          logname: 'public',
          project: "bomanagement",
          czman: localStorage.getItem('usrname'),
          name: '',
          type: this.tempType,
          dom: '出口部',
          id
        }]

        // return

        this.$axios({ method: 'put', url: this.$store.state.publicWebApi + 'api/UserTempletList', data, noarea: true, loading: false, tip: true })
          .then(({ data }) => {
            console.log(data)
            if (data.resultstatus == 0) {
              this.$message.success(data.resultmessage)
              this.getTableTmpAll()
            } else {
              this.$message.error(data.resultmessage)
            }
          })
      },
      saveDefaultTemp() {
        if (process.env.NODE_ENV !== 'development') {
          return
        }

        let jsondata = JSON.stringify(this.$options.defaultTemp)

        let data = [{
          jsondata,
          url: '',
          logExtraData: this.logExtraDataForBuild,
          isactivate: 1,
          logname: 'public',
          project: "bomanagement",
          czman: localStorage.getItem('usrname'),
          name: '',
          type: this.tempType,
          dom: '出口部'
        }]

        console.log(data)
        // return

        this.$axios({ method: 'post', url: this.$store.state.publicWebApi + 'api/UserTempletList', data, noarea: true, loading: false, tip: true })
          .then(({ data }) => {
            console.log(data)
            if (data.resultstatus == 0) {
              this.$message.success(data.resultmessage)
              this.getTableTmpAll()
            } else {
              this.$message.error(data.resultmessage)
            }
          })
      }
    },
    defaultTemp: {
      status: {
        '1': '#f56c6c',
        '100': '#5bb01d',
        '110': '#5bb01d',
        '150': '#5bb01d',
        '400': '#5bb01d',
        '300': '#5bb01d',
        '200': '#5bb01d',
        '600': '#5bb01d',
        '500': '#5bb01d',
        '800': '#5bb01d',
        '1100': '#5bb01d',
        '1200': '#5bb01d'
      },
      dzstatus: {
        '1': '#f56c6c',
        '900': '#f56c6c',
        '100': '#5bb01d',
        '150': '#5bb01d',
        '200': '#f56c6c',
        '300': '#5bb01d',
        '350': '#5bb01d',
        '400': '#5bb01d',
        '700': '#5bb01d',
        '600': '#5bb01d',
        '750': '#5bb01d',
        '800': '#5bb01d',
        '1100': '#5bb01d'
      },
      pcstatus: {
        '1': '#f56c6c',
        '100': '#5bb01d',
        '200': '#5bb01d',
        '300': '#f56c6c',
        '400': '#5bb01d'
      },
      hwstatus: {
        '1': '#f56c6c',
        '100': '#f56c6c',
        '300': '#f56c6c',
        '400': '#5bb01d',
        '500': '#5bb01d',
        '600': '#5bb01d',
        '700': '#5bb01d',
        '800': '#5bb01d',
        '900': '#5bb01d'
      },
      bgstatus: {
        '1': '#f56c6c',
        '100': '#5bb01d',
        '150': '#5bb01d',
        '180': '#5bb01d',
        '200': '#5bb01d',
        '300': '#5bb01d',
        '500': '#5bb01d',
        '400': '#5bb01d',
        '600': '#5bb01d',
        '900': '#5bb01d'
      },
      customstatus: {
        '1': '#f56c6c',
        '2': '#5bb01d',
        '5': '#5bb01d',
        '6': '#5bb01d',
        '10': '#5bb01d',
        '4': '#5bb01d'
      },
      pdfinishstatus: {
        '1': '#f56c6c',
        '100': '#5bb01d',
      }
    }
  }
</script>

<style lang="less" scoped>
  .status-color-config {
    .title {
      margin-bottom: 10px;
    }

    .field-container {
      display: flex;
      height: 583px;
      padding: 15px 0;
      padding-left: 2px;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      white-space: nowrap;

      .status-c {
        width: 215px;
        height: 100%;
        padding: 0 15px;
        border-right: 1px solid #e8e8e8;

        .status-item {
          display: flex;
          align-items: center;
          width: 100%;
          height: 28px;
          line-height: 28px;
          margin: 3px 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;
          cursor: pointer;

          .selected-icon {
            display: inline-block;
            margin-right: 8px;
            width: 5px;
            height: 14px;
            background: #fff;
          }

          &.active {
            color: #409EFF;

            .selected-icon {
              background: #409EFF;
            }
          }
        }
      }

      .options-c {
        flex: 1;
        height: 100%;
        padding: 0 15px;

        .option {
          display: flex;
          align-items: center;
          height: 33px;
          line-height: 33px;
          margin: 3px 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;

          .number {
            font-family: Arial, Helvetica, sans-serif;
            color: #c5c5c5;
            font-style: italic;
            margin-right: 8px;
          }

          .label {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>