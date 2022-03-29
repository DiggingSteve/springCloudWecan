<template>
 <div>
              <el-popover
              placement="right"
              width="500"
              trigger="click"
              @hide="$emit('update:tableCheckedIndex',-1)"
              @show="$emit('update:tableCheckedIndex',propsIndex)"
            >
              <el-table :data="propsData.row[field]" max-height="400">
                <el-table-column width="150" property="packagetypename" label="包装类型" align="left"></el-table-column>
                <el-table-column width="100" property="piece" label="件数" align="left"></el-table-column>
                <el-table-column width="100" label="尺寸" align="left">
                  <template
                    slot-scope="scope"
                  >{{ scope.row.longs }}*{{scope.row.widths}}*{{scope.row.heights}}</template>
                </el-table-column>
                <el-table-column width="50"  label="体积" align="left">
                      <template slot-scope="scope">{{ (scope.row.longs *scope.row.widths*scope.row.heights/1000000*scope.row.piece).toFixed(3)}}</template>
                </el-table-column>
              </el-table>
              <span slot="reference">
                    <el-tooltip class="item" effect="dark" :content="propsData.value" :disabled="propsData.value&&propsData.value.length<20" placement="top-start">
                                <span  style="color: #004c82;cursor: pointer;" @click="$emit('update:tableCheckedIndex',propsIndex)">
                                  <i
                                    :class="[tableCheckedIndex==propsIndex?'el-icon-minus':'el-icon-plus']"
                                  ></i>
                                  {{propsData.value}}
                                </span>
                        </el-tooltip>
              </span>
            </el-popover>
 </div>
</template>

<script>
export default {
  props:{
     tableCheckedIndex:'',
      propsData:{},
      pagetype:{
        type:[String,Number],
        default:1
      }
  },
  computed:{
    field(){
         return this.pagetype==1?'volYbList':'vollist'
      },
    propsIndex(){
        return  this.propsData.value+'@'+this.propsData.index
    }  
  }

}
</script>

<style lang="less" scoped>

</style>
