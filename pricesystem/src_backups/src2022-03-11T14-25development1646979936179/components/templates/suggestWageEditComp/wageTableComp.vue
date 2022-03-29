<template>
  <div class="wage-table-comp">
    <el-table 
      class="wage-table"
      :data="tableData"
      style="width: 100%;"
      :row-class-name="rowClassName"
      :cell-style="cellStyle"
      border
      stripe>
      <el-table-column label="操作" width="150" fixed>
        <template slot-scope="scope">
          <div class="operate">
            <i class="el-icon-edit-outline" title="修改" @click="iconClick(scope, 'edit')"></i>
            <i class="el-icon-delete" title="删除" @click="iconClick(scope, 'delete')"></i>
            <i class="el-icon-circle-check" title="启用" v-if="scope.row.itemstatus === '无效'" @click="iconClick(scope, 'statusChange', 1)"></i>
            <i class="el-icon-circle-close" title="禁用" v-if="scope.row.itemstatus === '有效'" @click="iconClick(scope, 'statusChange', 2)"></i>
            <i class="el-icon-document-add" title="以此标准新建" @click="iconClick(scope, 'new')"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column  
        v-for="(item, i) of tableHeader"
        show-overflow-tooltip
        :width="item.width || '120'"
        :fixed="i === 0"
        :label="item.label"
        :prop="item.prop"
        :key="item.label"
        :formatter="tableColumnFormat">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    selectedWageGuid: String
  },
  data () {
    return {
      tableHeader: [
        { label: '费用名称', prop: 's_name' },
        // { label: '委托客户', prop: 'usr_name', width: '300' },
        { label: '状态', prop: 'itemstatus' },
        { label: '始发港', prop: 'sfg' },
        { label: '目的港', prop: 'mdg' },
        { label: '航空公司', prop: 'mawbthreecode' },
        { label: '航班号', prop: 'hbh' },
        { label: '货物性质', prop: 'hwxz' },
        { label: '价格类型', prop: 'pricetype' },
        { label: '币种', prop: 'currency' },
        { label: '计费方式', prop: 'wagetype' },
        { label: '子计费方式', prop: 'childwagetype' },
        { label: 'Min单价', prop: 'minimal' },
        { label: '单价', prop: 'price' }
      ]
    }
  },
  methods: {
    tableColumnFormat (row, column, val) {
      if (column.property === 'pricetype') {
        return val === '1' ? '单价' : '总价'
      }
      // if (column.property === 'mawbthreecode') {
      //   return this.getAirCompanyCName(val)
      // }
      return val || '--'
    },
    // getAirCompanyCName (threecode) {
    //   if (!this.AirCompany) this.AirCompany = JSON.parse(sessionStorage.AirCompany)

    //   return threecode.split(',').reduce((p, v) => {
    //     for (let item of this.AirCompany) {
    //       if (item.ThreeCode === v) {
    //         p.push(item.CName)
    //         break
    //       }
    //     }
    //     return p
    //   }, []).join(',')
    // },
    rowClassName (data) {
      if (data.row.guid === this.selectedWageGuid) {
        return 'selected-wage-row'
      }
    },
    cellStyle (data) {
      if (data.column.property === 'itemstatus') {
        if (data.row.itemstatus === '无效') {
          return { color: 'red' }
        }
      }
      return ''
    },
    iconClick (scope, operate, status) {
      this.$emit('operate', {
        row: scope.row,
        operate,
        status
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wage-table-comp {
  .wage-table {
    .operate {
      display: flex;
      justify-content: space-around;
      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
    /deep/ .selected-wage-row {
      background: #bfffa6;
      & > td {
        background: #bfffa6;        
      }
    }
  }
}
</style>
