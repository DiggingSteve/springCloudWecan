<template>
  <div class="wage-table-comp">
    <el-table 
      class="wage-table"
      :data="tableData"
      :row-class-name="rowClassName"
      :cell-style="cellStyle"
      border
      stripe>
      <el-table-column label="操作" width="150" fixed>
        <template slot-scope="scope">
          <div class="operate">
            <i class="el-icon-edit-outline" title="修改" @click="iconClick(scope, 'edit')" ></i>
            <i class="el-icon-delete" title="删除" @click="iconClick(scope, 'delete')"  v-if="componentName !== 'AISOUT' && componentName !== 'AISIN'"></i>
            <i class="el-icon-circle-check" title="启用" v-if="scope.row.itemstatus === '无效' && (componentName !== 'AISOUT' && componentName !== 'AISIN')" @click="iconClick(scope, 'statusChange', 1)" ></i>
            <i class="el-icon-circle-close" title="禁用" v-if="scope.row.itemstatus === '有效' && (componentName !== 'AISOUT' && componentName !== 'AISIN')" @click="iconClick(scope, 'statusChange', 2)" ></i>
            <i class="el-icon-document-add" title="以此标准新建" @click="iconClick(scope, 'new')" v-if="componentName !== 'AISOUT' && componentName !== 'AISIN'"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column  
        v-for="item of tableHeader"
        show-overflow-tooltip
        sortable
        :width="item.width || '120'"
        :fixed="item.fixed || false"
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
    selectedWageGuid: String,
    componentName:String,
  },
  data () {
    return {
      tableHeader: [
        { label: '服务类别', prop: 'servicename', fixed: true },
        { label: '费用名称', prop: 's_name', fixed: true, width: '150' },
        // { label: '委托客户', prop: 'usr_name', width: '300' },
        { label: '状态', prop: 'itemstatus' },
        { label: '单价', prop: 'price' },
        { label: '价格类型', prop: 'pricetype' },
        { label: '币种', prop: 'currency' },
        { label: '计费方式', prop: 'wagetype' },
        // { label: '子计费方式', prop: 'childwagetype' },
        { label: 'Min单价', prop: 'minimal' },
        { label: '始发港', prop: 'sfg' },
        { label: '目的港', prop: 'mdg' },
        { label: '航空公司', prop: 'mawbthreecode' },
        { label: '航班号', prop: 'hbh' },
        { label: '货物性质', prop: 'hwxz' }
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
    //   if (!this.AirCompany) this.AirCompany = JSON.parse(localStorage.airinfo)

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
