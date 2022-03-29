<template>
  <div class="storeComp">
<!--     {{piece}}
{{this.storeList}} -->
    <el-row>
      <el-col :span="5">
        <span>进仓编号：</span>
        <el-input v-model="cur_number.khjcno" class="input-required" clearable></el-input>
      </el-col>
      <el-col :span="3">
        <span>件数：</span>
        <el-input v-model.number="cur_number.piece" v-verify="'integer'" class="input-required" clearable></el-input>
      </el-col>
      <el-col :span="3">
        <span>重量：</span>
        <el-input v-model.number="cur_number.weight" v-verify="'float'" class="input-required" clearable></el-input>
      </el-col>
      <el-col :span="3">
        <span>体积：</span>
        <el-input v-model.number="cur_number.volume" v-verify="'float'" class="input-required" clearable></el-input>
      </el-col>
      <el-col :span="1">
        <el-button @click="save" type="primary">保存</el-button>
      </el-col>
      <el-col :span="1">
        <el-button style="margin-left: 15px;" @click="clearCurNumber" type="primary" >取消</el-button>
      </el-col>
    </el-row>

    <commonTable :head="TableHead" :table-data="storeList" style="width: 650px;margin-left:64px">
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
    volume: [Number, String],
    khjcno: [Number, String]
  },
  data () {
    return {
      cur_number: {
        type: 1,
        piece: null,
        weight: null,
        volume: null,
        khjcno: "",
        guid:-1
      },
      TableHead:[
        {title:"操作", field:"operate"},
        {title:"进仓编号", field:"khjcno"},
        {title:"件数", field:"piece"},
        {title:"重量", field:"weight"},
        {title:"体积", field:"volume"}
      ]
    }
  },
  computed: {
    cur_piece () {
      if (!this.piece) return ''
      let result = this.piece - this.storeList.reduce((prev, i) => prev += Number(i.piece), 0)
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
      if (!this.cur_number.khjcno) {
        return this.$message.error('请输入进仓编号')
      }
      if (!this.cur_number.piece || !this.cur_number.weight || !this.cur_number.volume) {
        return this.$message.error('请输入件/重/体')
      }
      if (this.cur_number.editIndex == undefined) {
        if (!this.storeList.every(item => item.khjcno !== this.cur_number.khjcno)) {
          return this.$message.error('进仓编号重复')
        }
      }

      let tonum=this.storeList.length>0?this.storeList.map((i,k)=>{ return (k!=this.cur_number.editIndex)?Number(i.piece):0}).reduce((a,b)=>{return a+b}):0
      if(this.cur_number.piece>(this.piece-tonum)){
           this.$message.error('件数超过总件数！');return;
       }

      this.cur_number.type = this.type

      if (this.cur_number.editIndex !== undefined) {
        if (this.guid&&this.guid!=-1) {

          let data = {
            ...this.cur_number,
            poId: this.guid&&this.guid!=-1,
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
        if (this.guid&&this.guid!=-1) {

          let data = {
            ...this.cur_number,
            poId: this.guid&&this.guid!=-1,
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

      this.$emit('success',true)
      this.clearCurNumber()

    },
    clearCurNumber () {
      this.cur_number = {
        type: 1,
        piece: this.cur_piece,
        weight: this.cur_weight,
        volume: this.cur_volume,
        khjcno: "",
        guid:-1
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

        if (this.guid&&this.guid!=-1) {
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
     /*      this.$message({
            type: 'success',
            message: '删除成功'
          }) */
          this.$emit('success',true)
              this.clearCurNumber()

        }
      })
    }
  },
  created() {
     this.$watch(
      function () {
        return this.piece+this.weight+this.volume+this.khjcno
      },
      function(){
        if(this.guid==-1){
          let piece=this.piece - this.storeList.reduce((prev, i) => prev += Number(i.piece), 0)
          let weight = this.weight - this.storeList.reduce((prev, i) => prev += Number(i.weight), 0)
          let volume = this.volume - this.storeList.reduce((prev, i) => prev += Number(i.volume), 0)

          this.cur_number.piece= piece>0?piece:0
          this.cur_number.weight=weight>0?weight:0
          this.cur_number.volume=volume>0?volume:0

          this.cur_number.khjcno=this.khjcno||''

        }
      },{immediate:true}
    )
  }


}
</script>

<style lang="less" scoped>
.storeComp {
  margin: 10px 0 20px 44px;
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
