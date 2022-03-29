<template>
  <div class="storeComp">
    
    <el-row>
      <el-col :span="5">
        <span>进仓编号：</span>
        <el-input v-model="cur_number.storeNo" class="input-required"></el-input>
      </el-col>
      <el-col :span="3" :offset="1">
        <span>件数：</span>
        <el-input v-model="cur_number.num" v-verify="'integer'" class="input-required"></el-input>
      </el-col>
      <el-col :span="3">
        <span>重量：</span>
        <el-input v-model="cur_number.weight" v-verify="'float'" class="input-required"></el-input>
      </el-col>
      <el-col :span="3">
        <span>体积：</span>
        <el-input v-model="cur_number.volume" v-verify="'float'" class="input-required"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button @click="save" type="primary">保存进仓编号</el-button>
      </el-col>
      <el-col :span="2">
        <el-button style="margin-left: 15px;" @click="clearCurNumber" type="primary">取消编辑</el-button>
      </el-col>
    </el-row>
    <!-- <div class="customTable">
      <div class="table-head">
        <div>操作</div>
        <div class="storeno">进仓编号</div>
        <div>件数</div>
        <div>重量</div>
        <div>体积</div>
      </div>
      <div class="table-cell" v-for="(item, index) in storeList" :key="index">
        <div>
          <i title="编辑" class="el-icon-setting" @click="edit(index)"></i>
          <i title="删除" class="el-icon-delete" @click="del(index)"></i>
        </div>
        <div class="storeno">{{ item.storeNo }}</div>
        <div>{{ item.num }}</div>
        <div>{{ item.weight }}</div>
        <div>{{ item.volume }}</div>
      </div>
    </div> -->
    
    <commonTable :head="TableHead" :table-data="storeList" style="width: 650px;">
      <template slot="operate" slot-scope="props">
        <i title="编辑" class="el-icon-setting" @click="edit(props.data.index)"></i>
        <i title="删除" class="el-icon-delete" @click="del(props.data.index)"></i>
      </template>
    </commonTable>
  </div>  
</template>

<script>
export default {
  props: {
    guid: [Number, String],
    storeList: Array,
    type: {
      type: Number,
      default: () => 1
    },
    piece: [Number, String],
    weight: [Number, String],
    volume: [Number, String]
  },
  data () {
    return {
      cur_number: {
        type: 1,
        num: null,
        weight: null,
        volume: null,
        storeNo: ""
      },
      TableHead:[
        {title:"操作", field:"operate"},
        {title:"进仓编号", field:"storeNo"},
        {title:"件数", field:"num"},
        {title:"重量", field:"weight"},
        {title:"体积", field:"volume"}
      ]
    }
  },
  computed: {
    cur_piece () {
      if (!this.piece) return ''
      let result = this.piece - this.storeList.reduce((prev, i) => prev += Number(i.num), 0)
      return result >= 0 ? Math.round((result)*100)/100 : 0
    },
    cur_weight () {
      if (!this.weight) return ''
      let result = this.weight - this.storeList.reduce((prev, i) => prev += Number(i.weight), 0)
      return result >= 0 ? Math.round((result)*100)/100 : 0
    },
    cur_volume () {
      if (!this.volume) return ''
      let result = this.volume - this.storeList.reduce((prev, i) => prev += Number(i.volume), 0)
      return result >= 0 ? Math.round((result)*100)/100 : 0
    }
  },
  methods: {
    save () {
      if (!this.cur_number.storeNo) {
        return this.$message.error('请输入进仓编号')
      }
      if (!this.cur_number.num || !this.cur_number.weight || !this.cur_number.volume) {
        return this.$message.error('请输入件/重/体')
      }
      if (this.cur_number.editIndex == undefined) {
        if (!this.storeList.every(item => item.storeNo !== this.cur_number.storeNo)) {
          return this.$message.error('进仓编号重复')
        }
      }
      // if (this.cur_number.editIndex == undefined) {
      //   if (this.cur_number.num > this.cur_piece || this.cur_number.weight > this.cur_weight || this.cur_number.volume > this.cur_volume) {
      //     return this.$message.error('进仓编号件重体不能大于预报件重体')
      //   }
      // } else {
      //   let index = this.cur_number.editIndex
      //   if (Number(this.cur_number.num) > (this.cur_piece + Number(this.storeList[index].num)) || 
      //       Number(this.cur_number.weight) > (this.cur_weight + Number(this.storeList[index].weight)) || 
      //       Number(this.cur_number.volume) > (this.cur_volume + Number(this.storeList[index].volume))) {

      //     return this.$message.error('进仓编号件重体不能大于预报件重体')          
      //   }
      // }

      this.cur_number.type = this.type
      
      if (this.cur_number.editIndex !== undefined) {
        if (this.guid) {

          let data = {
            ...this.cur_number,
            poId: this.guid,
            addman: localStorage.usrname,
            adddate: new Date().toLocaleString('chinese', {hour12: false})
          }
          let editIndex = this.cur_number.editIndex
          
          this.$axios({method:'post',url:this.$store.state.webApi+"api/ExTransportStore",data: data,loading:false,tip:true})
          .then(result=>{
            if (result.data.resultstatus == 0) {
              this.storeList.splice(editIndex, 1, {...data})
              delete this.storeList[editIndex].editIndex
            }
          })

        } else {
          for (let key in this.cur_number) {
            this.storeList[this.cur_number.editIndex][key] = this.cur_number[key]
          }
          delete this.storeList[this.cur_number.editIndex].editIndex
        }
      } else {
        if (this.guid) {

          let data = {
            ...this.cur_number,
            poId: this.guid,
            addman: localStorage.usrname,
            adddate: new Date().toLocaleString('chinese', {hour12: false})
          }

          this.$axios({method:'post',url:this.$store.state.webApi+"api/ExTransportStore",data: data,loading:false,tip:true})
          .then(result=>{
            
            if (result.data.resultstatus == 0) {
              this.storeList.push({
                ...data,
                guid: result.data.resultguid,
                id: result.data.resultid
              })
              
              //console.log(this.storeList)
            }
          })

        } else {
          this.storeList.push(this.cur_number)
        }
      }

      this.clearCurNumber()
    },
    clearCurNumber () {
      this.cur_number = {
        type: 1,
        num: this.cur_piece,
        weight: this.cur_weight,
        volume: this.cur_volume,
        storeNo: ""
      }
    },
    edit (index) {
      this.cur_number = JSON.parse(JSON.stringify(this.storeList[index]))
      this.cur_number.editIndex = index
    },
    del (index) {
      this.$confirm('是否删除进仓编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        if (this.guid) {
          let data = {
            guid: this.storeList[index].guid
          }
          this.$axios({method:'delete',url:this.$store.state.webApi+"api/ExTransportStore",data: data,loading:false,tip:true})
          .then(result=>{
            if (result.data.resultstatus == 0) {
              this.storeList.splice(index, 1)
            }
          })
        } else {
          if (this.cur_number.editIndex) {
            if (this.cur_number.editIndex == index) {
              this.clearCurNumber()
            } else if (this.cur_number.editIndex > index) {
              this.cur_number.editIndex--
            }
          }
          this.storeList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.storeComp {
  margin-top: 30px;
  .el-row {
    margin-bottom: 20px;
    .el-col {
      .el-input {
        width: 60%;
      }
    }
  }
  .customTable {
    overflow: auto;
    display: inline-block;
    border: 1px solid #e8e8e8;
    min-height: 86px;
    .table-head, .table-cell {
      div {
        float: left;
        width: 110px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #e8e8e8;
        border-top: 0;
        border-left: 0;
        text-align: center;
        &:last-child {
          border-right: 0;
        }
        .el-icon-setting,
        .el-icon-delete {
          cursor: pointer;
          font-size: 16px;
          margin-right: 5px;
        }
      }
      .storeno {
        width: 200px;
      }
    }
    .table-head div {
      background: #f6f6f6;
    }
  }
}
</style>
