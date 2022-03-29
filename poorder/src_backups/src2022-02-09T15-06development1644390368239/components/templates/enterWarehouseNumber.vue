<template>
  <div class="enterWarehouseNumber">
    <!-- {{serviceSelArr}} -->
    <div v-enterfocus>
      <el-row class="first-row">
        <el-col :span="5">
          <span>进仓编号：</span>
          <el-input v-model="curObj.khjcno" style="width: 60%;" class="input-required"></el-input>
        </el-col>
        <el-col :span="4" style="margin-right: 7px;"><span>件数：</span>
          <el-input class="input-required" v-model="curObj.piece" v-verify="'integer'"></el-input>
        </el-col>
        <el-col :span="4"><span>重量：</span>
          <el-input class="input-required" v-model="curObj.weight" v-verify="'float'"></el-input>
        </el-col>
        <el-col :span="4"><span>体积：</span>
          <el-input class="input-required" v-model="curObj.volume" v-verify="'float'"></el-input>
        </el-col>

        <el-col :span="5">
          <span>入库类型：</span>
          <!-- <el-input class="input-required" v-model="curObj.volume" v-verify="'float'"></el-input> -->
          <el-select v-model="curObj.storeType" clearable>
            <el-option v-for="type of storeTypeOptions" :key="type" :value="type">{{ type }}</el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="curObj.storeType=='晚入库'||curObj.storeType=='入库'">
        <el-col :span="6">
          <span>入库仓库：</span>
          <el-select v-model="curObj.storename_yb" clearable filterable class="input-required" style="width:170px">
            <el-option v-for="(item, index) in getStoreArr()" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row v-for="(item, index) in curObj.ybstorevolumeList" :key="index">
        <el-col :span="5">
          <span>包装类型：</span>
          <el-select v-model="item.packagetypename" :clearable="true" filterable style="width: 60%"
            :class="{'input-required': isRequired(item)}">
            <el-option v-for="(item, index) in packageType" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4"><span>尺寸件数：</span>
          <el-input v-model="item.piece" v-verify="'integer'" @input="sizePieceChange(index)"
            :class="{'input-required': isRequired(item)}"></el-input>
        </el-col>
        <el-col :span="10">
          <span>尺寸(CM)：</span>
          <p class="size">
            长<el-input v-model="item.longs" :class="{'input-required': isRequired(item)}"></el-input>
            宽<el-input v-model="item.widths" :class="{'input-required': isRequired(item)}"></el-input>
            高<el-input v-model="item.heights" :class="{'input-required': isRequired(item)}"></el-input>
          </p>
          <i @click="packageFn(index)"
            :class="['package-icon', {'el-icon-circle-plus': index == 0, 'el-icon-remove': index != 0}]"></i>
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
        <el-col :span="2">件数</el-col>
        <el-col :span="2">重量</el-col>
        <el-col :span="2">体积</el-col>
        <el-col :span="3">入库类型</el-col>
        <el-col :span="3">状态</el-col>
        <el-col :span="3">入库仓库</el-col>
      </el-row>
      <div class="table-row" v-for="(item, index) in saveNumberList" :key="index">
        <el-row :class="{'expansion': showSubTable == index}">
          <el-col :span="3">
            <i title="编辑" class="el-icon-setting" @click="edit(index)"></i>
            <i title="删除" class="el-icon-delete" @click="del(index)"></i>
          </el-col>
          <el-col :span="6"><i class="el-icon-circle-plus-outline" @click="exSubTable(index)"></i>{{ item.khjcno }}
          </el-col>
          <el-col :span="2">{{ item.piece }}</el-col>
          <el-col :span="2">{{ item.weight }}</el-col>
          <el-col :span="2">{{ item.volume }}</el-col>
          <el-col :span="3">{{ item.storeType }}</el-col>
          <el-col :span="3">{{ getStatus(item.khjcno) ? '已配置' : '未配置' }}</el-col>
          <el-col :span="3">{{ item.storename_yb||'--'}}</el-col>
        </el-row>
        <div class="sub-table" v-if="showSubTable == index">
          <el-row class="title">
            <el-col :span="9">包装类型</el-col>
            <el-col :span="6">件数</el-col>
            <el-col :span="9">尺寸(cm)</el-col>
          </el-row>
          <el-row v-for="(subItem, subIndex) in item.ybstorevolumeList" :key="subIndex">
            <el-col :span="9">{{ subItem.packagetypename }}</el-col>
            <el-col :span="6">{{ subItem.piece }}</el-col>
            <el-col :span="9">{{ subItem.longs }}*{{ subItem.widths }}*{{ subItem.heights }}</el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      saveNumberList: {
        type: Array,
        default() {
          return []
        }
      },
      serviceSelArr: {
        type: Array,
        default() {
          return []
        }
      },
      guid: Number,
      statusArr: {
        type: Array,
        default: () => []
      },
      mawb: {
        type: [Number, String],
        default: () => ''
      },
      piece: {
        type: [Number, String],
        default: () => ''
      },
      weight: {
        type: [Number, String],
        default: () => ''
      },
      volume: {
        type: [Number, String],
        default: () => ''
      },
      czlx: {
        type: [Number, String],
        default: () => ''
      },
      isMawbImport: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      return {
        packageType: [],
        showSubTable: -1,
        curObj: {
          khjcno: '',
          piece: '',
          weight: '',
          volume: '',
          storeType: this.serviceSelArr.includes('AA0410') || this.serviceSelArr.includes('AG0145') ? '入库' : '不入库',
          storename_yb: '',
          ybstorevolumeList: [{
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
    computed: {
      cur_piece() {
        let result = this.piece - this.saveNumberList.reduce((prev, i) => prev += Number(i.piece), 0)
        return result >= 0 ? Math.round((result) * 100) / 100 : 0
      },
      cur_weight() {
        let result = this.weight - this.saveNumberList.reduce((prev, i) => prev += Number(i.weight), 0)
        return result >= 0 ? Math.round((result) * 100) / 100 : 0
      },
      cur_volume() {
        let result = this.volume - this.saveNumberList.reduce((prev, i) => prev += Number(i.volume), 0)
        return result >= 0 ? Math.round((result) * 100) / 100 : 0
      },
      showRkType() {
        return this.$store.state.areaState == this.conditionalAreaForBuild
      }
    },
    created() {
      // 导入页面不带这些数据
      if (!this.isMawbImport) {
        this.$watch(
          () => {
            return this.mawb
          },
          (val) => {
            this.curObj.khjcno = val
          }
        )

        this.$watch(
          () => {
            return this.weight + this.volume
          },
          () => {
            this.curObj.weight = this.weight
            this.curObj.volume = this.volume
          }
        )
      }

      let groupData = JSON.parse(localStorage.getItem('groupType') || '[]')

      groupData.forEach(item => {
        if (item.groupid === 31) this.packageType.push(item.typename)
        if (item.groupid === 170) this.storeTypeOptions.push(item.ready01)
      })

    },
    watch: {
      statusArr: {
        handler(newVal) {
          this.saveNumberList.forEach(el => {
            this.$set(el, 'status', this.getStatus(el.khjcno))
          })

          this.$emit('update:saveNumberList', this.saveNumberList)
        },
        immediate: true
      },
      serviceSelArr: {
        handler(newVal) {
          this.curObj.storeType = newVal.includes('AA0410') || newVal.includes('AG0145') ? '入库' : '不入库'
        },
        immediate: true
      },
      'curObj.piece'(newVal) {
        if (this.curObj.editIndex >= 0) {
          if (Number(newVal) > (this.cur_piece + Number(this.saveNumberList[this.curObj.editIndex].piece))) {
            this.$nextTick(() => {
              this.curObj.piece = this.cur_piece + Number(this.saveNumberList[this.curObj.editIndex].piece)
            })
            this.$message.error('总件数不能大于预报件数')
          }
        } else if (Number(newVal) > this.cur_piece) {
          this.$nextTick(() => {
            this.curObj.piece = this.cur_piece
          })
          this.$message.error('总件数不能大于预报件数')
        }
      },
      piece() {
        this.curObj.piece = this.cur_piece
      }
    },
    methods: {
      saveNumber() {
        if (!this.curObj.khjcno) {
          return this.$message.error('请输入或选择进仓编号')
        }
        if (this.curObj.editIndex == undefined) {
          if (!this.saveNumberList.every((item => item.khjcno.toUpperCase() !== this.curObj.khjcno.toUpperCase()))) {
            return this.$message.error('进仓编号重复')
          }
        }
        if (!this.curObj.piece || !this.curObj.weight || !this.curObj.volume) {
          return this.$message.error('请填写完整信息')
        }
        // if (this.curObj.ybstorevolumeList.length !== 0) {
        //   for (let i in this.curObj.ybstorevolumeList) {
        //     if (this.isRequired(this.curObj.ybstorevolumeList[i]) && this.hasEmptyValue(this.curObj.ybstorevolumeList[i])) {
        //       return this.$message.error('请填写完整信息')
        //     }
        //   }
        // }
        // if(this.czlx=='自货'){
        //   let sizePiece = this.curObj.ybstorevolumeList.reduce((a, b) => a += Number(b.piece), 0);
        //   if (sizePiece == 0) {
        //     return this.$message.error('请填写尺寸信息!')
        //   }

        //   if (sizePiece != this.curObj.piece) {
        //     return this.$message.error('尺寸件数之和必须等于进仓编号件数！')
        //   }
        // }
       
        let save_obj = Object.assign({}, this.curObj)
        // if(!this.showRkType){
        //   save_obj.storeType='不入库'
        // }
        if ((save_obj.storeType == '晚入库' || save_obj.storeType == '入库') && !save_obj.storename_yb) {
          return this.$message.error('请选择入库类型')
        }
        if (save_obj.storeType !== '晚入库' && save_obj.storeType !== '入库') {
          save_obj.storename_yb = ''
        }
        // 过滤空尺寸信息
        save_obj.ybstorevolumeList = save_obj.ybstorevolumeList.filter(i => {
          let isEmpty = !Object.keys(i).every(key => i[key] == '')
          if (!isEmpty) {
            i.guid = -1
          }
          return isEmpty
        })

        if (this.curObj.editIndex !== undefined) {
          delete save_obj.editIndex
          this.saveNumberList.splice(this.curObj.editIndex, 1, save_obj)
        } else {
          this.saveNumberList.push(save_obj)
        }

        this.clearCurObj()
      },
      clearCurObj() {
        this.curObj = {
          khjcno: '',
          piece: this.cur_piece,
          weight: this.cur_weight,
          volume: this.cur_volume,
          storeType: this.serviceSelArr.includes('AA0410') || this.serviceSelArr.includes('AG0145') ? '入库' : '不入库',
          storename_yb: '',
          ybstorevolumeList: [{
            packagetypename: '',
            piece: '',
            longs: '',
            widths: '',
            heights: ''
          }]
        }
      },
      packageFn(index) {
        if (index == 0) {
          this.curObj.ybstorevolumeList.push({
            packagetypename: '',
            piece: '',
            longs: '',
            widths: '',
            heights: ''
          })
        } else {
          this.curObj.ybstorevolumeList.splice(index, 1)
        }
      },
      exSubTable(index) {
        if (this.showSubTable == index) {
          this.showSubTable = -1
        } else {
          this.showSubTable = index
        }
      },
      edit(index) {
        if (this.saveNumberList[index].status == true) {
          return this.$message.error('已配置分单不可修改')
        }

        this.curObj = { ...JSON.parse(JSON.stringify(this.saveNumberList[index])), editIndex: index }

        if (!this.curObj.ybstorevolumeList || this.curObj.ybstorevolumeList.length == 0) {
          this.curObj.ybstorevolumeList = [{
            packagetypename: '',
            piece: '',
            longs: '',
            widths: '',
            heights: ''
          }]
        }
      },
      del(index) {
        if (this.saveNumberList[index].status == true) {
          return this.$message.error('已配置分单不可删除')
        }

        this.$confirm('是否删除进仓编号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveNumberList.splice(index, 1)
          this.curObj.piece = this.cur_piece
          this.curObj.weight = this.cur_weight
          this.curObj.volume = this.cur_volume
        }).catch(() => {

        })
      },
      getStatus(khjcno) {
        return this.statusArr.includes(khjcno)
      },
      sizePieceChange(index) {
        let totalSize = this.curObj.ybstorevolumeList.reduce((prev, i) => prev += Number(i.piece), 0)
        let otherSize = this.curObj.ybstorevolumeList.reduce((prev, item, i) => {
          if (i == index) {
            return prev
          } else {
            return prev += Number(item.piece)
          }
        }, 0)

        if (totalSize > this.curObj.piece) {
          this.$message.error('尺寸件数总数不能大于进仓编号件数')
          this.$nextTick(() => {
            this.curObj.ybstorevolumeList[index].piece = this.curObj.piece - otherSize
          })
        }
      },
      isRequired(item) {
        let required = false
        for (let key in item) {
          item[key] ? required = true : ''
        }
        return required
      //  return  this.czlx == '自货'
      },
      hasEmptyValue(item) {
        let empty = false
        for (let key in item) {
          item[key] == '' ? empty = true : ''
        }
        return empty
      }
      , getStoreArr() { //入库仓库
        let cargoData = JSON.parse(localStorage.cargoData);
        let arr = [];
        cargoData.map(item => {
          if (item.area == this.area || this.$store.state.areaState) {
            arr.push(item.storename);
          }
        });
        return arr;
      },
    }
  }
</script>

<style lang="less" scoped>
  .enterWarehouseNumber {
    width: 100%;

    >div:first-child {
      >.el-row {
        margin-bottom: 10px;
      }

      .first-row {
        margin-bottom: 20px;
      }
    }

    span {
      display: inline-block;
      width: 85px;
      text-align: right;

      +.el-input {
        width: 50%;
      }
    }

    .size {
      display: inline-block;

      .el-input {
        width: 80px;
        margin: 0 12px 0 11px;
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
      @table-width: 900px;
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

      .table-row:last-child>.el-row .el-col {
        border-bottom: @table-border;
      }

      .title {
        +.el-row .el-col {
          border-top: none;
        }

        +.table-row>.el-row .el-col {
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