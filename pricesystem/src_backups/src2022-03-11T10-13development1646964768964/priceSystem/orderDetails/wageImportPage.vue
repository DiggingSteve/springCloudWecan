<template>
  <div class="wage-import-page">
    <el-select v-model="importData.area" placeholder="请选择区域" class="area-select">
      <el-option v-for="option in optionType.area" :key="option" :value="option"></el-option>
    </el-select>
    <el-select v-model="importData.system" placeholder="请选择系统" class="system-select">
      <el-option v-for="option in optionType.system" :key="option" :value="option"></el-option>
    </el-select>
    <el-select v-model="importData.wagestd" placeholder="请选择标准" class="type-select">
      <el-option v-for="option in optionType.wagestdOption" :key="option" :value="option"></el-option>
    </el-select>
    <!-- 委托客户 -->
    <pageSelect
      v-if="importData.wagestd === '客户标准'"
      style="display: inline-block;width: 200px;"
      placeholder="请选择委托客户"
      :pagetype="1"
      :modelval.sync="importData.fid">
    </pageSelect>

    <wageImportComp :importData="importData" :disabled="disableImprtComp" style="float: right;"></wageImportComp>
  </div>  
</template>

<script>
import wageImportComp from './wageImportComp'

export default {
  components: { wageImportComp },
  data () {
    return {
      importData: {
        area: '',
        system: '',
        wagestd: '',
        fid: ''
      },
      optionType: {
        area: [],
        system: [],
        wagestdOption: ['唯凯标准', '客户标准']
      }
    }
  },
  created () {
    let groupType = JSON.parse(localStorage.groupType)
    groupType.forEach(item => {
      if (item.groupid === 53) this.optionType.area.push(item.typename)
      if (item.groupid === 57) this.optionType.system.push(item.typename)
    })
  },
  computed: {
   disableImprtComp () {
      if (!this.importData.area || !this.importData.system || !this.importData.wagestd) return true
      if (this.importData.wagestd === '客户标准' && !this.importData.fid) return true
      return false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
