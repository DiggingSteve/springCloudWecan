<template>
  <div class="enterWarehouseNumber">
    <div v-enterfocus>
      <el-row class="first-row">
        <el-col :span="6">
          <span >进仓编号：</span>
          <el-input v-model="curObj.khjcno" style="width: 60%;" class="input-required"></el-input>
        </el-col>
        <el-col :span="4" style="margin-right: 5px;"><span>件数：</span><el-input class="input-required" v-model="curObj.piece" v-verify="'integer'"></el-input></el-col>
        <el-col :span="4"><span>重量：</span><el-input class="input-required" v-model="curObj.weight" v-verify="'float'"></el-input></el-col>
        <el-col :span="4"><span>体积：</span><el-input class="input-required" v-model="curObj.volume" v-verify="'float'"></el-input></el-col>
           <el-col :span="5" v-show="showRkType">
          <span>入库类型：</span>
          <!-- <el-input class="input-required" v-model="curObj.volume" v-verify="'float'"></el-input> -->
          <el-select v-model="curObj.storeType" class="input-required" clearable>
            <el-option v-for="type of storeTypeOptions" :key="type" :value="type">{{ type }}</el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="4">
          <el-button @click.native="saveNumber" type="primary">保存进仓编号</el-button>
          <el-button @click.native="clearCurObj" type="primary">取消编辑</el-button>
        </el-col> -->
      </el-row>
      <el-row v-for="(item, index) in curObj.storevolumeList" :key="index">
        <el-col :span="6">
          <span>包装类型：</span>
          <el-select v-model="item.packagetypename" style="width: 60%;" filterable clearable :class="{'input-required': isRequired(item)}">
            <el-option
              v-for="(item, index) in packageType"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4"><span>尺寸件数：</span><el-input v-model="item.piece" v-verify="'integer'" :class="{'input-required': isRequired(item)}"></el-input></el-col>
        <el-col :span="10">
          <span style="width: 90px;">尺寸(CM)：</span>
          <p class="size">
            长<el-input v-model="item.longs" :class="{'input-required': isRequired(item)}"></el-input>
            宽<el-input v-model="item.widths" :class="{'input-required': isRequired(item)}"></el-input>
            高<el-input v-model="item.heights" :class="{'input-required': isRequired(item)}"></el-input>
          </p>
          <i @click="packageFn(index)" :class="['package-icon', {'el-icon-circle-plus': index == 0, 'el-icon-remove': index != 0}]"></i>
        </el-col>
      </el-row>
    </div>

      <div style="margin:20px 0px 0px 20px">
          <el-button @click.native="saveNumber" type="primary">保存进仓编号</el-button>
          <el-button @click.native="clearCurObj" type="primary">取消编辑</el-button>
      </div>


    <div class="table-box">
      <el-row class="title">
        <el-col :span="3">操作</el-col>
        <el-col :span="6">进仓编号</el-col>
        <el-col :span="3">件数</el-col>
        <el-col :span="3">重量</el-col>
        <el-col :span="3">体积</el-col>
            <el-col :span="3">入库类型</el-col>
        <el-col :span="3">状态</el-col>
      </el-row>
      <div class="table-row" v-for="(item, index) in saveNumberList" :key="index">
        <el-row :class="{'expansion': showSubTable == index}">
          <el-col :span="3">
            <i title="编辑" class="el-icon-setting" @click="edit(index)"></i>
            <i title="删除" class="el-icon-delete" @click="del(item.guid, index)"></i>
          </el-col>
          <el-col :span="6">
            <i class="el-icon-circle-plus-outline" @click="exSubTable(index)"></i>{{ item.khjcno }}
          </el-col>
          <el-col :span="3">{{ item.piece }}</el-col>
          <el-col :span="3">{{ item.weight }}</el-col>
          <el-col :span="3">{{ item.volume }}</el-col>
             <el-col :span="3">{{ item.storeType }}</el-col>
          <el-col :span="3">{{ getStatus(item.khjcno) ? '已配置' : '未配置' }}</el-col>
        </el-row>
        <div class="sub-table" v-if="showSubTable == index && item.storevolumeList">
          <el-row class="title">
            <el-col :span="9">包装类型</el-col>
            <el-col :span="6">件数</el-col>
            <el-col :span="9">尺寸(cm)</el-col>
          </el-row>
          <el-row v-for="(subItem, subIndex) in item.storevolumeList" :key="subIndex">
            <el-col :span="9">{{ subItem.packagetypename }}</el-col>
            <el-col :span="6">{{ subItem.piece }}</el-col>
            <el-col :span="9">{{ subItem.longs }}*{{ subItem.widths }}*{{ subItem.heights }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- {{saveNumberList}} -->
  </div>
</template>

<script>
export default {
  props: {
    saveNumberList: {
      type: Array,
      default () {
        return []
      }
    },
    guid: {
      type: [Number,String],
      required: true
    },
    statusArr: {
      type: Array,
      default: () => []
    },
    piece: {
      type: [Number,String],
      default: () => ''
    },
    weight: {
      type: [Number,String],
      default: () => ''
    },
    volume: {
      type: [Number,String],
      default: () => ''
    }
  },
  data () {
    return {
      packageType: [],
      showSubTable: -1,
      curObj: {
        khjcno: '',
        piece: '',
        weight: '',
        volume: '',
        storeType: '',
        storevolumeList: [{
          packagetypename: '',
          piece: '',
          longs: '',
          widths: '',
          heights: ''
        }]
      },

      storeTypeOptions: []
    }
  },
  created () {
    this.$watch(
      () => {
        return this.piece + this.weight + this.volume
      },
      () => {
        this.curObj.piece = this.piece
        this.curObj.weight = this.weight
        this.curObj.volume = this.volume
      },
      {
        immediate: true
      }
    )

    let groupData = JSON.parse(localStorage.getItem('groupType') || '[]')

    groupData.forEach(item => {
      if (item.groupid == 31) this.packageType.push(item.typename)
      if (item.groupid === 170) this.storeTypeOptions.push(item.ready01)
    })

    this.getStoreInfo()
  },
  watch: {
    statusArr: {
      handler(newVal){
        let newArr = this.saveNumberList.map(el => {
          el.status = this.getStatus(el.khjcno)
          return el
        })

        this.$emit('update:saveNumberList', newArr)
      },
      immediate:true
    }
  },
  methods: {
    saveNumber () {
      if (!this.curObj.khjcno) {
        this.$message.error('请输入或选择进仓编号')
        return
      }
      if (!this.saveNumberList.every((item => item.khjcno.toUpperCase() !== this.curObj.khjcno.toUpperCase() || item.guid == this.curObj.guid ))) {
        return this.$message.error('进仓编号重复')
      }
      if (!this.curObj.piece || !this.curObj.weight || !this.curObj.volume || !this.curObj.storeType) {
        return this.$message.error('请填写完整信息')
      }
      if (this.curObj.storevolumeList.length !== 0) {
        for (let i in this.curObj.storevolumeList) {
          if (this.isRequired(this.curObj.storevolumeList[i]) && this.hasEmptyValue(this.curObj.storevolumeList[i])) {
            return this.$message.error('请填写完整信息')
          }
        }
      }

      if (this.curObj.guid) {
        this.editStoreInfo(this.curObj)
      } else {
        this.addStoreInfo(this.curObj)
      }

    },
    clearCurObj () {
      this.curObj = {
        khjcno: '',
        piece: this.piece,
        weight: this.weight,
        volume: this.volume,
         storeType: '',
        storevolumeList: [{
          packagetypename: '',
          piece: '',
          longs: '',
          widths: '',
          heights: ''
        }]
      }
    },
    packageFn (index) {
      if (index == 0) {
        this.curObj.storevolumeList.push({
          packagetypename: '',
          piece: '',
          longs: '',
          widths: '',
          heights: ''
        })
      } else {
        this.curObj.storevolumeList.splice(index, 1)
      }
    },
    exSubTable (index) {
      if (this.showSubTable == index) {
        this.showSubTable = -1
      } else {
        this.showSubTable = index
      }
    },
    edit (index) {
      if (this.saveNumberList[index].status == true) {
        return this.$message.error('已配置分单不可修改')
      }

      if (this.curObj.guid) {
        return this.$message.error('请先保存编辑中的进仓编号')
      }
      this.curObj = JSON.parse(JSON.stringify(this.saveNumberList[index]))
      if (!this.curObj.storevolumeList || this.curObj.storevolumeList.length == 0) {
        this.curObj.storevolumeList = [{packagetypename: '',piece: '',longs: '',widths: '',heights: ''}]
      }
    },
    del (guid, index) {
      if (this.saveNumberList[index].status == true) {
        return this.$message.error('已配置分单不可删除')
      }

      //console.log(guid)
      this.$confirm('是否删除进仓编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delStoreInfo(index)

      }).catch(() => {

      })
    },
    getStoreInfo(){
      if(this.guid){
        this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineStoreBasic',params:{sid:this.guid},loading:true,tip:false}).then(results=>{
         // //console.log("分单仓库信息")
         // //console.log(JSON.stringify(results.data))

          results.data.forEach(item => {
            item.storevolumeList = item.storevolumeList.filter(i => i.guid !== '0')
            this.$set(item, 'status', this.getStatus(item.khjcno))
          })

          this.$emit('update:saveNumberList', results.data)

        //  //console.log(this.saveNumberList)
        })
      }

    },
    addStoreInfo(storedata){
      if(!this.guid){
        this.$message.error('不存在guid');return;
      }

      let json = Object.assign({sid: this.guid,store_childguid:-1}, storedata)
      json.storevolumeList = json.storevolumeList.filter(i => {
        let isEmpty = Object.keys(i).every(key => i[key] == '')
        if (!isEmpty) {
          i.guid = -1
        }
        return !isEmpty
      })

      //console.log(JSON.stringify(json))

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplineStore',data:json,noarea:true,loading:true,tip:true}).then(results=>{
        //console.log("仓库信息新增")
        //console.log(JSON.stringify(results.data))
        if(results.data.resultstatus==0){
          this.getStoreInfo()
          this.clearCurObj()
        }
      })
    },
    editStoreInfo (storedata) {
      let json = Object.assign({sid: this.guid}, storedata)
     /*  if(!this.showRkType){
        save_obj.storeType='不入库'
      } */
      // 过滤掉guid为0的尺寸信息
      json.storevolumeList = json.storevolumeList.filter(i => {
        let isEmpty = Object.keys(i).every(key => i[key] == '')
        if (isEmpty) return false
        if (i.guid == '0') return false
        i.guid ? '' : i.guid = -1
        return true
      })

      json.sid=this.guid
      //console.log(JSON.stringify(json));

      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAxplineStore',data:json,noarea:true,loading:true,tip:false}).then(results=>{
        //console.log("仓库信息修改")
        //console.log(JSON.stringify(results.data))

        if(results.data.resultstatus==0){
          this.getStoreInfo()
          this.curObj = {
            khjcno: '',
            piece: this.piece,
            weight: this.weight,
            volume: this.volume,
            storevolumeList: [{
              packagetypename: '',
              piece: '',
              longs: '',
              widths: '',
              heights: ''
            }]
          }
           this.$message.success(results.data.resultmessage)
        } else {
           this.$message.error(results.data.resultmessage)
        }
      })
    },
    delStoreInfo(index){
      this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExAxplineStore',data:{guid:this.saveNumberList[index].guid,isdel:"2",sid:this.guid,store_childguid:this.saveNumberList[index].store_childguid},noarea:true,loading:true,tip:true}).then(results=>{
        //console.log("删除仓库信息")
        //console.log(JSON.stringify(results.data))

        if(results.data.resultstatus==0){
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getStoreInfo()
        }
      })
    },
    getStatus (khjcno) {
      return this.statusArr.includes(khjcno)
    },
    isRequired (item) {
      let required = false

      let keys = ['packagetypename', 'piece', 'longs', 'widths', 'heights']
      for (let i in keys) {
        item[keys[i]] ? required = true : ''
      }
      return required
    },
    hasEmptyValue (item) {
      let empty = false

      let key = ['packagetypename', 'piece', 'longs', 'widths', 'heights']
      for (let i in key) {
        item[key[i]] == '' ? empty = true : ''
      }
      return empty
    }
  },
  computed: {
    showRkType(){
      return this.$store.state.areaState==this.conditionalAreaForBuild
    }
  },
}
</script>

<style lang="less" scoped>
.enterWarehouseNumber {
  width: 100%;
  > div:first-child {
    > .el-row {
      margin-bottom: 10px;
      .el-button {
        margin-left: 20px;
        //padding: 5px 20px;
      }
    }
    .first-row {
      margin-bottom: 20px;
    }
  }
  span {
    display: inline-block;
    width: 85px;
    text-align: right;
    + .el-input {
      width: 50%;
    }
  }
  .size {
    display: inline-block;
    .el-input {
      width: 80px;
      margin: 0 9px 0 8px;
    }
    .el-input:last-child {
      margin-right: 0;
    }
  }
  .package-icon {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
    width: 18px;
    height: 18px;
    font-size: 18px;
    border-radius: 50%;
    cursor: pointer;
  }
  .el-icon-circle-plus {
    color: #f56c6c;
  }
  .el-icon-remove {
    color: #5daf34;
  }
  .table-box {
    @table-width: 800px;
    @table-border: 1px solid #e8e8e8;

    margin: 30px 16px 16px;
    width: @table-width;
    border: @table-border;
    .el-row {
      width: @table-width - 1;
      .el-col {
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-right: @table-border;
        border-top: @table-border;
      }
      .el-icon-circle-plus-outline {
        position: absolute;
        top: 6px;
        left: 140px;
        pointer-events: all;
      }
      .el-icon-circle-plus-outline,
      .el-icon-setting,
      .el-icon-delete {
        cursor: pointer;
        font-size: 16px;
        margin-right: 5px;
      }
    }
    .expansion {
      .el-col {
        border-bottom: @table-border;
      }
    }
    .table-row:last-child > .el-row .el-col {
      border-bottom: @table-border;
    }
    .title {
      + .el-row .el-col {
        border-top: none;
      }
      + .table-row > .el-row .el-col {
        border-top: none;
      }
      .el-col {
        border-top: none;
        border-bottom: @table-border;
      }
    }
    .sub-table {
      width: @table-width * 0.7;
      .el-row {
        width: (@table-width * 0.7) - 1;
        .el-col:last-child {
          border-right: @table-border;
        }
      }
    }
  }
}
</style>
