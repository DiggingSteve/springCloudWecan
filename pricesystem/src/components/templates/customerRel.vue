<template>
  <div class="customer-rel">
    <el-button class="rel-btn" :disabled="!fid" style="padding:8px" @click="customerRelDialogVisible = true"
      icon="el-icon-document">
      本票客户{{ customerRelType }}联系人
    </el-button>

    <el-dialog class="customer-rel-dialog" :visible.sync="customerRelDialogVisible" width="1150px" append-to-body>
      <div slot="title">
        <div class="rel-title">
          <h3 class="active">本票客户{{ customerRelType }}联系人</h3>
          <p class="descript">为了便于联系和信息推送,请仔细维护本票的客户{{ customerRelType }}联系人(维护完成后请勾选并点击按钮"确认并选中联系人")</p>
          <!-- <div class="tip">(请填写对方客户的{{ customerRelType }}联系人！)</div> -->
          <div class="tip">(请填写对方委托客户的{{ customerRelType }}联系人!&nbsp;&nbsp;&nbsp;请勿填写委托客户发货人的{{ customerRelType }}联系人!)
          </div>
        </div>
      </div>
      <!-- {{relList}} -->
      <!-- {{checkedRelData}} -->
      <div class="rel-title">
        <h3 :class="{active: activeLxrss === 2}" @click="activeLxrss = 2">客户联系人</h3>
        <h3 :class="{active: activeLxrss === 1}" @click="activeLxrss = 1">唯凯联系人</h3>
      </div>

      <el-table v-if="customerRelDialogVisible" :data="customerRelData" ref="customerRelTable" :fit="false"
        style="border: 1px solid #e8e8e8;" @row-click="rowClick" @selection-change="customerRelTableSelectionChange">
        <ElTableColumn type="selection" width="55" :selectable="canSelect"></ElTableColumn>

        <ElTableColumn label="抬头" prop="lxrtitle" width="80"></ElTableColumn>
        <ElTableColumn label="姓名" :show-overflow-tooltip="true" prop="name" width="130"></ElTableColumn>
        <ElTableColumn label="手机" :show-overflow-tooltip="true" prop="mobile" width="190"></ElTableColumn>
        <ElTableColumn label="电话" :show-overflow-tooltip="true" prop="phone" width="150"></ElTableColumn>
        <ElTableColumn label="创建人" :show-overflow-tooltip="true" prop="addman" width="80"></ElTableColumn>
        <ElTableColumn label="邮箱" :show-overflow-tooltip="true" prop="email" width="210">
          <a class="email-link" slot-scope="scope" :href="'mailto:'+scope.row.email">{{ scope.row.email }}</a>
        </ElTableColumn>
        <ElTableColumn fixed="right" width="160">
          <template slot="header" slot-scope="scope">
            <el-input style="width: 152px;padding-right: 0;" v-model="customerSearchText" size="mini"
              placeholder="输入关键字搜索" />
          </template>
          <div class="edit-btn-c" slot-scope="scope">
            <el-button size="mini" type="primary"
              :disabled="customerRelData[scope.$index].lxrtitle=='财务'||customerRelData[scope.$index].lxrss==1"
              @click="currentEditRelIndex = scope.$index">修改</el-button>
            <el-button size="mini" type="danger"
              :disabled="customerRelData[scope.$index].lxrtitle=='财务'||customerRelData[scope.$index].lxrss==1"
              @click="deleteCustomerRel(scope.$index)">删除</el-button>
          </div>
        </ElTableColumn>

        <table slot="append" class="el-table__header edit-table" :style="editTableStyle">
          <colgroup>
            <col width="55">
            <col name="el-table_column_1" width="80">
            <col name="el-table_column_2" width="130">
            <col name="el-table_column_3" width="190">
            <col name="el-table_column_4" width="150">
            <col name="el-table_column_5" width="80">
            <col name="el-table_column_6" width="210">
            <col name="el-table_column_7" width="160">
          </colgroup>
          <tbody>
            <tr>
              <td></td>
              <td colspan="1" rowspan="1" class="el-table_column_1">
                <div class="cell">
                  {{ currentEditRelData.lxrtitle }}
                  <!-- <el-input v-model="currentEditRelData.lxrtitle" placeholder="抬头" disabled></el-input> -->
                </div>
              </td>
              <td colspan="1" rowspan="1" class="el-table_column_2">
                <div class="cell input-cell">
                  <el-input v-model="currentEditRelData.name" placeholder="姓名" class="input-required"></el-input>
                </div>
              </td>
              <td colspan="1" rowspan="1" class="el-table_column_3">
                <div class="cell input-cell">
                  <el-input v-model="currentEditRelData.mobile" placeholder="手机"
                    :class="{'invalid-value': isInvalidMobile}" @input="checkValidMobile"
                    @blur="isInvalidMobile && invalidMessage('手机')">
                  </el-input>
                </div>
              </td>

              <td colspan="1" rowspan="1" class="el-table_column_4">
                <div class="cell input-cell">
                  <el-input v-model="currentEditRelData.phone" placeholder="电话">
                  </el-input>
                </div>
              </td>

              <td colspan="1" rowspan="1" class="el-table_column_5">
                <div class="cell input-cell">
                  <el-input v-model="currentEditRelData.addman" placeholder="创建人" class="input-required"></el-input>
                </div>
              </td>

              <td colspan="1" rowspan="1" class="el-table_column_6">
                <div class="cell input-cell">
                  <el-input v-model="currentEditRelData.email" placeholder="邮箱"
                    :class="['input-required',{'invalid-value': isInvalidEmail}]" @input="checkValidEmail"
                    @blur="isInvalidEmail && invalidMessage('邮箱')">
                  </el-input>
                </div>
              </td>
              <td colspan="1" rowspan="1" class="el-table_column_7">
                <div class="cell edit-btn-c">
                  <el-button size="mini" type="primary"
                    @click="currentEditRelIndex === -1 ? addCustomerRel() : editCustomerRel()">保存</el-button>
                  <el-button size="mini" @click="currentEditRelIndex = null">取消</el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </el-table>

      <div slot="footer" v-show="activeLxrss==2">
        <el-button type="primary" @click="chooseRel" :disabled="checkedRelData === null">确认并选中联系人</el-button>
        <el-button type="primary" @click="currentEditRelIndex = -1">新增联系人</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import _debounce from 'lodash.debounce'

  export default {
    props: {
      fid: {
        required: true,
        type: [Number, String]
      },
      gid: {
        type: [Number, String]
      },
      area: String,
      man: {
        type: String
      },
      // 订单新增: 客服
      // 对账:    结算
      // 开票:    财务
      customerRelType: {
        type: String,
        default() {
          return '客服'
        }
      },
      immediate: {
        type: Boolean,
        default: false
      },
      isoutside: {
        type: Boolean,
        default: false
      },
      relList: {
        type: Array,
        default: () => { }
      }
    },
    data() {
      return {
        customerRelDialogVisible: false,

        // 系统的ID，新增联系人时需要
        // groupid > 57：空出380
        system: '380',

        // lxrss > 1：我司联系人，2：客户联系人
        customerRelDataAll: [],
        customerSearchText: '',

        currentEditRelData: {
          lxrtitle: '',
          name: '',
          mobile: '',
          phone: '',
          email: '',
          addman: ''
        },
        // null:  隐藏修改框
        // -1:    新增联系人
        // index: 修改联系人
        currentEditRelIndex: null,
        isInvalidMobile: false,
        isInvalidEmail: false,

        // 勾选的客户联系人
        checkedRelData: null,
        activeLxrss: 2

      }
    },
    computed: {
      pageArea() {
        return this.area || this.$store.state.areaState
      },
      customerRelData() {
        // 可用于搜索的字段
        let searchField = ['lxrtitle', 'name', 'mobile', 'phone', 'email', 'addman']

        return this.customerRelDataAll.filter(item => {
          for (let field of searchField) {
            if (item[field].includes(this.customerSearchText) && item.lxrss == this.activeLxrss) return true
          }
          return item.lxrss == this.activeLxrss
        })
      },
      // 计算修改信息的table的高度
      editTableStyle() {
        // 单行高度
        const cellHeight = 42

        if (this.currentEditRelIndex === null) {
          return {
            display: 'none'
          }
        } else if (this.currentEditRelIndex === -1) {
          return {
            position: 'static'
          }
        } else {
          return {
            display: 'block',
            top: this.currentEditRelIndex * cellHeight + 1 + 'px'
          }
        }
      }
    },
    created() {
      if (this.immediate) {
        this.$watch(() => {
          return this.gid
        }, (val) => {
          if (val && this.fid && this.checkedRelData == null && this.relList.length == 0) {
            setTimeout(() => {
              this.customerRelDialogVisible = true
            }, 500)
          } else {
            this.checkedRelData = null
          }
        })
      }
      if(this.isoutside){
        this.activeLxrss=1
      }

    },
    watch: {
      fid: {
        handler(fid) {
          if (!fid) return
          this.getCustomerRelData()
        },
        immediate: true
      },
      customerRelDialogVisible(val) {
        let area = this.pageArea
        console.log(area)
        if (area.includes(',')) {
          this.customerRelDialogVisible = false
          return this.$message.error('请选择区域')
        }

        if (val) {
          this.currentEditRelIndex = null

          if (this.checkedRelData) {
            this.$refs.customerRelTable && this.$refs.customerRelTable.toggleRowSelection(this.checkedRelData, true)
          }

        } else {
          if (!this.checkedRelData) {
            this.emitRelData()
          }
          this.customerSearchText = ''
        }
      },
      currentEditRelIndex(index) {
        if (index === null) return

        Object.keys(this.currentEditRelData).forEach(key => {
          // -1时是新增联系人，把输入框里的值清空
          this.currentEditRelData[key] = index === -1 ? '' : this.customerRelData[index][key] || ''
          if (index === -1 && key === 'lxrtitle') {
            this.currentEditRelData[key] = this.customerRelType
          }
          if (index === -1 && key === 'addman') {
            this.currentEditRelData[key] = localStorage.usrname
          }
        })
      }
    },
    methods: {
      canSelect(row, index) {
        return row.lxrss == 2
      },
      checkValidMobile() {
        const vm = this
        vm.checkValidMobile = _debounce(() => {
          // 加号可选，后面数字空格横杆最多16位
          let reg = /^\+?[0-9 -]{0,16}$/
          vm.isInvalidMobile = !reg.test(vm.currentEditRelData.mobile)
        }, 300)
      },
      checkValidEmail() {
        const vm = this
        vm.checkValidEmail = _debounce(() => {
          // Almost Perfect Email Regex
          // https://emailregex.com/
          let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          vm.isInvalidEmail = !reg.test(vm.currentEditRelData.email)
        }, 300)
      },
      invalidMessage(field) {
        this.$message.error(`输入的${field}无效，请输入有效${field}`)
      },
      emitRelData() {
        let data = [
          this.checkedRelData
        ]
        //console.log(this.checkedRelData)
        //alert('2')
        if (this.checkedRelData) {
          this.$emit('changeRelData', data)
        }

      },
      chooseRel() {
        if (!this.checkedRelData.mobile && !this.checkedRelData.phone) {
          return this.$message.error('联系人信息缺失')
        }
        if (!this.checkedRelData.name || !this.checkedRelData.email) {
          return this.$message.error('联系人信息缺失')
        }

        this.emitRelData()
        this.customerRelDialogVisible = false
        this.$message.success('已选择')
      },
      rowClick(row, column) {
        if (row.lxrss == 1) return;
        this.$refs.customerRelTable.clearSelection()
        this.$refs.customerRelTable.toggleRowSelection(row, true)
      },
      customerRelTableSelectionChange(val) {
        if (val.length === 1) {
          this.checkedRelData = val[val.length - 1]

        } else if (val.length > 1) {

          let row = val[val.length - 1]
          this.$refs.customerRelTable.clearSelection()
          this.$refs.customerRelTable.toggleRowSelection(row, true)
          this.checkedRelData = row
        } else {
          this.checkedRelData = null
        }
      },
      getCompanyRel(rel) {
        this.currentEditRelData.email = rel.email
        this.currentEditRelData.mobile = rel.longmobile
      },
      getCustomerRelData() {
        let params = {
          fid: this.fid,
          post: this.customerRelType,
          lxrtitle: this.customerRelType,
          department: this.customerRelType
        }
        let api = 'api/CustomerRel/GetCustomerRel';
        if (this.isoutside) {
          params = {
            gid: this.gid,
            lxrss: 1,
            area: this.pageArea
          };
          api = "api/ExCustomRel"
        }

        this.$axios({ method: 'get', url: this.$store.state.webApi + api, params, loading: false, tip: false })
          .then(({ data }) => {
            this.customerRelDataAll = data.filter(i => {
              i.area = this.pageArea
              return (i.comxz === '1'||this.isoutside) && this.pageArea.includes(i.area)
            })
            if (this.man) {
              this.$emit('changeRelData', this.customerRelDataAll.filter(i => { return i.name == this.man }) || [])
            } else {
              // console.log(this.customerRelDataAll)
              // this.$emit('changeRelData', this.customerRelDataAll||[])
            }
          })
      },
      addCustomerRel() {
        if (!this.currentEditRelData.mobile && !this.currentEditRelData.phone) {
          return this.$message.error('手机和电话必须填写其中一项')
        }
        if (!this.currentEditRelData.name || !this.currentEditRelData.email) {
          return this.$message.error('请输入完整的联系人信息')
        }
        if (this.isInvalidEmail || this.isInvalidMobile) {
          return this.$message.error('请输入有效的手机或邮箱')
        }

        let postData = {
          "fid": this.fid,
          "sid": this.gid || -1,
          "system": this.system,
          // 客户联系人
          "lxrss": 2,
          "area": this.pageArea,
          "addmam": localStorage.usrname,
          "department": this.customerRelType,
          "post": this.customerRelType,
          "lxrtitle": this.currentEditRelData.lxrtitle,
          "mobile": this.currentEditRelData.mobile,
          "phone": this.currentEditRelData.phone,
          "qq": '',
          "name": this.currentEditRelData.name,
          "email": this.currentEditRelData.email,
        }

        this.$axios({ method: 'post', url: this.$store.state.webApi + 'api/CustomerRel/AddCustomerRel', data: postData, loading: true, tip: true })
          .then(({ data }) => {
            if (data.resultstatus === 0) {
              this.getCustomerRelData()
              this.currentEditRelIndex = null
            }
          })
      },
      editCustomerRel() {
        let editData = this.customerRelData[this.currentEditRelIndex]
        let postData = {
          "id": editData.id,
          "fid": this.fid,
          "sid": this.gid || -1,
          "system": editData.system,
          "lxrss": editData.lxrss,
          "addman": editData.addman,
          "area": this.pageArea,
          "department": editData.department,
          "post": editData.post,
          "lxrtitle": editData.lxrtitle,
          "mobile": this.currentEditRelData.mobile,
          "phone": this.currentEditRelData.phone,
          "qq": '',
          "name": this.currentEditRelData.name,
          "email": this.currentEditRelData.email,
        }

        this.$axios({ method: 'post', url: this.$store.state.webApi + 'api/CustomerRel/EditCustomerRel', data: postData, loading: true, tip: true })
          .then(({ data }) => {
            if (data.resultstatus === 0) {
              Object.keys(postData).forEach(key => {
                this.customerRelData[this.currentEditRelIndex][key] = postData[key]
              })
              this.currentEditRelIndex = null
            }
          })
      },
      async deleteCustomerRel(index) {
        let confirmDelete = await this.$confirm('是否删除联系人', '删除联系人', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => { })

        if (!confirmDelete) return

        let deleteData = {
          id: this.customerRelData[index].id
        }

        this.$axios({ method: 'delete', url: this.$store.state.webApi + 'api/CustomerRel/DeleteCustomerRel', data: deleteData, loading: true, tip: true })
          .then(({ data }) => {
            if (data.resultstatus === 0) {
              this.customerRelDataAll = this.customerRelDataAll.filter(i => {
                return i.id !== deleteData.id
              })
            }
          })
      },
      setSelectedRel(relData) {
        this.checkedRelData = { ...relData[0] }
      }
    }
  }
</script>

<style scoped lang="less">
  .customer-rel {
    .rel-btn {
      // background: #fff8ef;
    }
  }

  .customer-rel-dialog {
    /deep/ .el-dialog {
      padding: 0 10px;

      .el-dialog__header {
        padding-top: 20px;
      }

      .el-dialog__body {
        padding-bottom: 10px;
      }

      .el-table-column--selection.is-leaf .cell {
        visibility: hidden;
      }

      .rel-title {
        h3 {
          display: inline-block;
          font-size: 18px;
          color: #606266;
          margin-right: 20px;
          cursor: pointer;
        }

        .active {
          color: #0f5a8c;
        }

        .descript {
          display: inline;
          color: red;
          font-size: 14px;
          font-weight: bold;
        }

        .tip {
          color: #0f5a8c;
          font-size: 16px;
          font-weight: bold;
          margin-top: 15px;
        }
      }

      .el-table th>.cell {
        text-align: left;
      }

      /deep/ .el-table {
        .email-link:focus {
          color: #00e;
        }

        .edit-btn-c {
          float: right;

          /deep/ .el-button {
            height: 28px;
            width: 64px;

            &:first-child {
              position: relative;
              top: -1px;
            }
          }
        }

        /deep/ .edit-table {
          position: absolute;
          top: 1px;
          left: 0;

          td {
            padding: 6px 0;

            &.el-table_column_6 {
              background: white;
              z-index: 4;
            }

            .input-cell {
              padding-left: 0;
            }

            .invalid-value {
              .el-input__inner {
                border-color: red;
              }
            }
          }
        }
      }
    }
  }

  .rel-title {
    margin-bottom: 20px;

    h3 {
      display: inline-block;
      font-size: 18px;
      color: #999;
      margin-right: 20px;
      cursor: pointer;
    }

    .active {
      color: #0f5a8c;
    }
  }
</style>