<template>
  <div class="storeComp">
 <!--    {{modelData}}-->
    <!-- {{storeList}} -->
    <newFormCmpt :view-data.sync="viewData" :model-data.sync="modelData" :pagetype="2">
      <template slot="btngroup">
        <el-button @click="save" type="primary">保存</el-button>
        <el-button
          v-show="editIndex !=-1"
          style="margin-left: 15px;"
          @click="clearCurNumber"
          type="primary"
        >取消编辑</el-button>
      </template>
    </newFormCmpt>

    <commonTable :head="TableHead" :table-data="storeList" style="width: 650px;margin-left:110px">
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
    piece:[Number,String],
    storeList: Array
  },
  data() {
    return {
      viewData: {
        packagetypename: {
          title: "包装类型：",
          type: 4,
          groupid: 31,
          required: true,
          bindValue: "typename",
          filterable: true
        },
        piece: {
          title: "尺寸件数：",
          verify: "integer",
          type: 1,
          itemStyle: { width: "200px", minWidth: "200px" },
          required: true
        },
        longs: {
          title: "长：",
          verify: "float",
          type: 1,
          itemStyle: { width: "150px", minWidth: "150px" },
          titleStyle: { width: "70px", minWidth: "70px" },
          required: true
        },
        widths: {
          title: "宽：",
          verify: "float",
          type: 1,
          itemStyle: { width: "150px", minWidth: "150px" },
          titleStyle: { width: "70px", minWidth: "70px" },
          required: true
        },
        heights: {
          title: "高：",
          verify: "float",
          type: 1,
          itemStyle: { width: "150px", minWidth: "150px" },
          titleStyle: { width: "70px", minWidth: "70px" },
          required: true
        },
        btngroup: {
          contentStyle: { width: "120px" },
          titleStyle: { width: "80px" }
        }
      },
      modelData: { guid: -1 },
      TableHead: [
        { title: "操作", field: "operate" },
        { title: "包装类型", field: "packagetypename" },
        { title: "件数", field: "piece" },
        { title: "长", field: "longs" },
        { title: "宽", field: "widths" },
        { title: "高", field: "heights" }
      ],
      editIndex: -1
    };
  },
  created () {
  },
  methods: {
    save() {
      for (let i in this.viewData) {
        if (this.viewData[i].required && !this.modelData[i]) {
          this.$message.error("请填写完整信息！");
          return;
        }
      }
      let tonum=this.storeList.length>0?this.storeList.map((i,k)=>{ return (k!=this.editIndex)?Number(i.piece):0}).reduce((a,b)=>{return a+b}):0
   /*     console.log(this.piece)
       console.log(tonum) */

       if(this.modelData.piece>(this.piece-tonum)){
           this.$message.error('件数超过总件数！');return;
       }
      if (this.editIndex == -1) {
        this.storeList.push({ ...this.modelData });
      } else {
        this.storeList.splice(this.editIndex, 1, { ...this.modelData });
      }

      this.clearCurNumber();
      this.$emit('success',true)
    },
    clearCurNumber() {
      this.modelData = { guid: -1 };
      this.editIndex = -1;
    },
    edit(index) {
      this.modelData = JSON.parse(JSON.stringify(this.storeList[index]));
      this.editIndex = index;
    },
    del(index) {
      this.$confirm("是否删除进仓编号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.storeList.splice(index, 1);
        this.$emit('success',true)
        return;
      });
    }
  }
};
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
    .table-head,
    .table-cell {
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
