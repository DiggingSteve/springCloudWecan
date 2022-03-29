<!--
 * @Description: 
 * @Version: 
 * @Autor: ZX
 * @Date: 2021-11-18 10:46:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-18 15:23:57
-->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="form">
        <div class="form-item">
          <span></span>
        </div>
      </div>

      <pageSelectMultiple
        :pagedata="formItem[key].pagedata"
        :viewdata="formItem[key].viewdata"
        :multiple="formItem[key].multiple"
        :modelval.sync="wageData[key]"
        ref="pageSelectMultiple"
      >
      </pageSelectMultiple>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "dialogX",
  components: { pageSelectMultiple },
  props: {
    dialogTitle: {
      type: String,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogForm: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {
    // 关闭弹窗
    handleClose() {}
  }
};
</script>

<style lang="less" scoped>
.form {
  .form-item {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

<style lang="less" scoped>
/deep/ .el-dialog__title {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
}
</style>
