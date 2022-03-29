<template>
  <div class="hawb-decl-back">
    <el-form>
      <el-form-item label="退关原因：">
        <my-select :groupid="240" class="input-required" v-model="tgReasonForm.canceltype"></my-select>
      </el-form-item>

      <el-form-item label="退关描述：">
        <el-input
          type="textarea"
          style="width:78%"
          :rows="2"
          class="input-required"
          v-model="tgReasonForm.delbillreason"
        ></el-input>
      </el-form-item>
    </el-form>

    <div>
      <commonTable
        style="margin:20px 0"
        class="hawb-table"
        :head="hawbTableHead"
        :tableData="hawbTableData"
        isMultiSelect
        :stripe="false"
        emptyCellText=""
        :empty-text="inputModelData.orderdom === '直单' ? '该订单是直单' : ''"
        @multiSelectChange="tableSelectChange"
        @multiSelectCheckAll="tableSelectCheckAll">

        <template slot="ybpiece" slot-scope="props">
          <div v-if="props.data.row.isdecl">{{ props.data.row.piece }}</div>
          <div v-else>
            <!-- <el-input type="number" v-model="props.data.row.backybpiece" @change="inputVerify($event, props.data.row, 'backybpiece')" :disabled="props.data.row.declList.length !== 0"></el-input> / {{ props.data.value }} -->
            {{ props.data.row.backybpiece }} / {{ props.data.value }}
          </div>
        </template>
        <template slot="ybweight" slot-scope="props">
          <div v-if="props.data.row.isdecl">{{ props.data.row.weight }}</div>
          <div v-else>
            <!-- <el-input type="number" v-model="props.data.row.backybweight" @change="inputVerify($event, props.data.row, 'backybweight')" :disabled="props.data.row.declList.length !== 0"></el-input> / {{ props.data.value }} -->
            {{ props.data.row.backybweight }} / {{ props.data.value }}
          </div>
        </template>
        <template slot="ybvolume" slot-scope="props">
          <div v-if="props.data.row.isdecl"></div>
          <div v-else>
            <!-- <el-input type="number" v-model="props.data.row.backybvolume" @change="inputVerify($event, props.data.row, 'backybvolume')" :disabled="backybvolumeInputDisabled(props.data.row)"></el-input> / {{ props.data.value }} -->
            {{ props.data.row.backybvolume }} / {{ props.data.value }}
          </div>
        </template>

      </commonTable>

      <div class="footer" >
        <el-button type="primary" style="background:#FA1A1A" @click="declBack('1')">直接退关</el-button>
        <el-button type="primary" @click="openServiceListDialog" v-show="!isAssignOrder">重新上榜</el-button>
        <el-button type="primary" @click="openCombineDialog" v-show="!isAssignOrder">合并到现有单号</el-button>
      </div>
    </div>

    <el-dialog
      title="重新上榜服务编辑"
      :visible.sync="serviceListDialogVisible"
      top="1%"
      append-to-body
      :close-on-click-modal="false"
      width="1200px">
      <div class="detail">
        <div class="detail-c">
          <serviceList
            v-if="serviceListDialogVisible"
            :newService.sync="newService"
            :opersystem="inputModelData.opersystem"
            pagetype="1"
            :orderguid="inputModelData.orderguid"
            orderdom="总单"
          ></serviceList>
          <div style="text-align:right">
            <el-button @click="declBack('2')">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      custom-class="combine-dialog"
      title="合并到现有单号"
      width="1000px"
      :visible.sync="combineDialogVisible"
      append-to-body>
      <div>
        <newFormCmpt :view-data.sync="combineViewData" :model-data="combineModelData" :search-data.sync="combineSearchData" pagetype='1' :exForm="true"></newFormCmpt>
        <!-- <el-button type="primary" @click="combineSearch">合并</el-button> -->
        <el-button type="primary" @click="declBack('3')">合并</el-button>

        <!-- <div v-show="combineSearchResult.length > 0">
          <div class="pono-list-c">
            <div class="pono-item" v-for="item of combineSearchResult" :key="item.pono">
              <el-radio v-model="flagPono" :label="item.pono" :title="item.pono"></el-radio>
            </div>
          </div>
          <el-button class="combine-btn" type="primary" @click="declBack('3')">合并</el-button>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../../api/localStorage.js"
import serviceList from "../orderDetails/serviceList" //服务列表组件

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    inputModelData: Object
  },
  components: { serviceList },
  data () {
    return {
      tgReasonForm: {
        canceltype: '',
        delbillreason: ''
      },
      hawbDataAll: [],
      hawbTableHead: [
        { title: '分单号', field: 'hawb' },
        { title: '报关单号', field: 'pono' },
        { title: '退关件数/原件数', field: 'ybpiece' },
        { title: '退关重量/原重量', field: 'ybweight' },
        { title: '退关体积/原体积', field: 'ybvolume' },
        { title: '始发港', field: 'sfg' },
        { title: '目的港', field: 'mdg' }
        // { title: "预报进仓编号", field: "khjcno",style:{'pointer-events':'all'} },
        // { title: "预报件/重/体", field: "ybjzt",formatType:4,format:row=>`${row.piece}/${row.weight}/${row.volume}`},
        // { title: "实际件/重/体", field: "sjjzt",formatType:4,format:row=>`${row.pieceReal}/${row.weightReal}/${row.volumeReal}`},
        // { title: "入库类型", field: "storeType",formatType:2,format:(x=>x=='请选择'?'--':x) },
        // { title: "入库仓库", field: "storename_yb" },
        // { title: "分运单号", field: "hawb" }
      ],
     // hawbTableData:[],
      serviceListDialogVisible: false,
      newService: {},

      combineDialogVisible: false,
      combineViewData: {
        pono: { title: "订舱编号", type: 1, whereStr: "equal" },
        // fid: { title: "委托客户", type: 14, pagetype: "1" },
        mawb: { title: "总运单号", type: 1, whereStr: "equal" },
        // hbh: { title: "航班号", type: 1, whereStr: "like" },
        // hbrq: { title: "航班日期", type: 15 },
      },
      combineModelData: {},
      combineSearchData: {},
      // combineSearchResult: [],
      // flagPono: ''
    }
  },
  computed: {
    hawbTableData () {
      // 将分单和报关单转换到同一个数组并插入对应的序号，方便表格显示
      let data = []
      this.hawbDataAll.forEach((hawb, hawbindex) => {
        hawb.hawbindex = hawbindex
        this.$set(hawb, 'backybpiece', 0)
        this.$set(hawb, 'backybweight', 0)
        this.$set(hawb, 'backybvolume', 0)
        data.push(hawb)
        hawb.declList.forEach((decl, declindex) => {
          decl.isdecl = true
          decl.hawbindex = hawbindex
          decl.declindex = declindex
          this.$set(decl, 'style', { background: '#f8f8f8' })
          data.push(decl)
        })
      })
      return data
    },
    isAssignOrder () {
      // 一货两站 操作站订单只能撤单
      if (this.inputModelData && this.inputModelData.orderguid && this.inputModelData.orderguid !== '-1') {
        return true
      }
      return false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        if (!val || this.inputModelData.orderdom === '直单') {
          this.hawbDataAll = []
          return
        }

        let params = {
          hpoid: this.inputModelData.guid
        }
        this.$axios({ method: "get", url: this.$store.state.webApi + "api/axpline/GetAxplineDecl", params, loading: true, tip: false })
        .then(({ data }) => {
          // 有报关服务时才显示报关单，没有报关服务时过滤掉报关单
          let hasDeclService = false
          for (let service of this.inputModelData.serviceList) {
            if (service.servicecode === 'AA0610' && service.isdel == 1) {
              hasDeclService = true
              break
            }
          }
          if (hasDeclService) {
            this.hawbDataAll = data
          } else {
            this.hawbDataAll = data.map(i => {
              i.declList = []
              return i
            })
          }
        })

  

      }
    }
  },
  methods: {
    declBack (declbackType) {
      if (declbackType === '3' && !this.combineModelData.pono && !this.combineModelData.mawb) {
        return this.$message.error('请输入订舱编号或总运单号')
      }
      if (!this.tgReasonForm.canceltype) {
        return this.$message.error('请选择退关原因')
      }
      if (!this.tgReasonForm.delbillreason) {
        return this.$message.error('请输入退关描述')
      }

      let tgreason = [{
        reasontype: '退关',
        delbillreason: this.tgReasonForm.delbillreason,
        delbillman: localStorage.usrname,
        delbilldate: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
        canceltype: this.tgReasonForm.canceltype,
        area:this.inputModelData.area||''
      }]
      if (this.inputModelData.tgreason) {
        try {
          let json = JSON.parse(this.inputModelData.tgreason)
          json.push(tgreason[0])
          tgreason = json
        } catch (error) {
          console.error(error)
        }
      }

      let axpList = []
      if (this.inputModelData.orderdom !== '直单') {
        axpList = this.hawbDataAll.filter(i => i.checked).map(i => {
          let hawb = {...i}
          hawb.backybpiece = Number(hawb.backybpiece)
          hawb.backybweight = Number(hawb.backybweight)
          hawb.backybvolume = Number(hawb.backybvolume)
          hawb.declList = hawb.declList.filter(i => i.checked)
          delete hawb.checked
          return hawb
        })
        if (axpList.length === 0) {
          return this.$message.error('请选择分运单')
        }
      }

      let data = {
        tgReason: JSON.stringify(tgreason),
        area: this.inputModelData.area,
        system: this.inputModelData.system,
        orderdom: this.inputModelData.orderdom,
        gid: this.inputModelData.gid,
        fid: this.inputModelData.fid,
        hbrq: this.inputModelData.hbrq,
        pono: this.inputModelData.pono,
        czlx: this.inputModelData.czlx,
        nodecode: 'AO5025',
        guid: this.inputModelData.guid,
        boguid: this.inputModelData.boguid,
        isAll: this.hawbDataAll.every(i => i.checked) ? '1' : '2',
        isCancel: declbackType
      }
      data.serviceList = this.inputModelData.serviceList.map(i => {
        return { servicecode: i.servicecode, oprequest: i.oprequest, isdel: i.isdel }
      })
      data.axpList = axpList

      let api = ''
      if (declbackType === '1') {
        api = 'api/CancelCustom'
      } else if (declbackType === '2') {
        api = 'api/againCustom'
        data.serviceList = Object.values(this.newService).map(i => {
          return { servicecode: i.servicecode, oprequest: i.oprequest, isdel: i.model ? '1' : '2' }
        })
      } else if (declbackType === '3') {
        api = 'api/comboineCustom'
        data.flagPono = this.combineModelData.pono || ''
        data.flagMawb = this.combineModelData.mawb || ''
        delete data.isCancel
      }

      // return
      this.$axios({ method: "put", url: this.$store.state.webApi + api, data, loading: true, tip: false })
      .then(({ data }) => {
        this.$message.success(data.resultmessage)
        this.$emit('update:visible', false)
        this.combineDialogVisible = false
      })
    },
    openServiceListDialog () {
      if (this.hawbDataAll.every(i => !i.checked)) {
        return this.$message.error('请选择分运单')
      }
      this.serviceListDialogVisible = true
    },
    openCombineDialog () {
      if (this.hawbDataAll.every(i => !i.checked)) {
        return this.$message.error('请选择分运单')
      }
      this.combineDialogVisible = true
    },
    // combineSearch () {
    //   if (Object.keys(this.combineSearchData).length === 0) {
    //     return this.$message.error('请输入查询条件')
    //   }

    //   this.combineSearchResult = []
    //   let jsonArr2 = {
    //     where: {
    //       // 默认查询条件
    //       orderguid: '-1',
    //       childguid: '-1',
    //       system: '空出',
    //       orderdom: '总单',
    //       area: this.inputModelData.area,
    //       customstatus: { in: '1' },
    //       dzstatus: { in: '1,100,150,200' },
    //       isdel: '1',
    //       status: { notlike: '1,500,600' },
    //       fid: this.inputModelData.fid,
    //       ...this.combineSearchData
    //     },
    //     order: "adddate desc"
    //   }
    //   let json={'json': JSON.stringify(jsonArr2)}

    //   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoboAxplineGeneral',params:json,loading:true,tip:false,nofield:true})
    //   .then(({ data })=>{
    //     if (data.length === 0) {
    //       return this.$message('无查询结果')
    //     }
    //     this.combineSearchResult = data
    //   })
    // },
    // backybvolumeInputDisabled (row) {
    //   if (row.declList.length > 0 && row.declList.every(i => i.checked)) return true
    //   return false
    // },
    tableSelectChange (data) {
      let hawbindex = data.row.hawbindex
      if (data.row.isdecl) {
        if (data.row.checked) {
          this.hawbDataAll[hawbindex].checked = true
          this.hawbDataAll[hawbindex].backybpiece += Number(data.row.piece)
          this.hawbDataAll[hawbindex].backybweight += Number(data.row.weight)
        } else {
          // 如果分单下的报关单号全部取消勾选了，则分单号也取消勾选
          let declNoCheck = this.hawbDataAll[hawbindex].declList.every(decl => !decl.checked)
          if (declNoCheck) this.hawbDataAll[hawbindex].checked = false
          this.hawbDataAll[hawbindex].backybpiece -= Number(data.row.piece)
          this.hawbDataAll[hawbindex].backybweight -= Number(data.row.weight)
        }
      } else {
        if (data.row.checked) {
          if (data.row.declList.length === 0) {
            data.row.backybpiece = data.row.ybpiece
            data.row.backybweight = data.row.ybweight
            data.row.backybvolume = data.row.ybvolume
          } else {
            // 勾选分单时把分单下的报关单号也勾选上
            data.row.declList.forEach(decl => {
              decl.checked = true
              data.row.backybpiece += Number(decl.piece)
              data.row.backybweight += Number(decl.weight)
            })
          }
        } else {
          if (data.row.declList.length === 0) {
            data.row.backybpiece = 0
            data.row.backybweight = 0
            data.row.backybvolume = 0
          } else {
            // 取消时把报关单号也取消
            data.row.declList.forEach(decl => {
              if (decl.checked === true) {
                decl.checked = false
                data.row.backybpiece -= Number(decl.piece)
                data.row.backybweight -= Number(decl.weight)
              }
            })
          }
        }
      }
      // 当分单下的报关单全部被勾选时，退关体积等于原体积
      if (this.hawbDataAll[hawbindex].declList.length !== 0) {
        if (this.hawbDataAll[hawbindex].declList.every(i => i.checked)) {
          this.hawbDataAll[hawbindex].backybvolume = this.hawbDataAll[hawbindex].ybvolume
        } else {
          this.hawbDataAll[hawbindex].backybvolume = 0
        }
      }
    },
    tableSelectCheckAll (val) {
      // 全选
      if (val) {
        this.hawbDataAll.forEach(hawb => {
          hawb.backybvolume = hawb.ybvolume
          if (hawb.declList.length === 0) {
            hawb.backybpiece = hawb.ybpiece
            hawb.backybweight = hawb.ybweight
          } else {
            hawb.backybpiece = 0
            hawb.backybweight = 0
            hawb.declList.forEach(decl => {
              hawb.backybpiece += Number(decl.piece)
              hawb.backybweight += Number(decl.weight)
            })
          }
        })
      } else {
        // 全取消
        this.hawbDataAll.forEach(hawb => {
          hawb.backybpiece = 0
          hawb.backybweight = 0
          hawb.backybvolume = 0
        })
      }
    },
    inputVerify (value, row, key) {
      value = Number(value)
      if (key === 'backybpiece') {
        if (value > row.ybpiece) {
          this.$message.error('退关件数不能大于原件数')
          row.backybpiece = row.ybpiece
        }
        if (value < 0) {
          this.$message.error('退关件数不能为负数')
          row.backybpiece = 0
        }
      } else if (key === 'backybweight') {
        if (value > row.ybweight) {
          this.$message.error('退关重量不能大于原重量')
          row.backybweight = row.ybweight
        }
        if (value < 0) {
          this.$message.error('退关重量不能为负数')
          row.backybweight = 0
        }
      } else if (key === 'backybvolume') {
        if (value > row.ybvolume) {
          this.$message.error('退关体积不能大于原体积')
          row.backybvolume = row.ybvolume
        }
        if (value < 0) {
          this.$message.error('退关体积不能为负数')
          row.backybvolume = 0
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
//.hawb-decl-back-dialog {
  .hawb-table {
    margin-bottom: 20px;
    .el-input {
      width: 60px;
    }
  //}
  // .footer {
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-between;
  //   align-items: center;
  // }
}
.combine-dialog {
  .pono-list-c {
    display: flex;
    flex-wrap: wrap;
    width: 810px;
    margin: 10px 0;
    .pono-item {
      width: 270px;
      border: 1px solid #e8e8e8;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-radio {
        width: 100%;
        padding-left: 10px;
        line-height: 35px;
      }
    }
  }
}
</style>
