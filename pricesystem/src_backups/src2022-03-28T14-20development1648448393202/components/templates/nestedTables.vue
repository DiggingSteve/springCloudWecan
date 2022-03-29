<template>
  <table style="width:100%;text-align:center;">
    <tr>
      <th v-for="item in head">
        {{item.title}}
      </th>
    </tr>
    <tr v-for="(row,index) in tableData5">
          
           
          <td v-for="item in head" >
            
            <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="row[item.field] && item.field !== 'iszd' && item.field !== 'price_status' && item.field !== 'enddate' && item.field !== 'modifydate' && item.field !== 'adddate' && item.field !== 'begindate'">{{row[item.field]}} </slot>

            <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="!row[item.field]&&item.title&&row[item.field]!==0"></slot> 
            

           <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='iszd'">{{row.iszd === 1 ? '是' : '否'}} </slot>  
           <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='price_status'">{{row.status === 1 ? '有效' : '无效'}} </slot>
           <!-- 结束日期 -->
           <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='enddate'">{{ (row.enddate === '1900-01-01 00:00:00' || row.enddate === '') ? '' :  row.enddate | formatDate("yyyy-MM-dd") }} </slot>
            <!-- 修改日期 -->
            <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='modifydate'">{{row.modifydate === '1900-01-01 00:00:00' || row.modifydate === '' ? '' : row.modifydate | formatDate("yyyy-MM-dd") }} </slot>
            <!-- 创建日期 -->
            <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='adddate'">{{row.adddate === '1900-01-01 00:00:00' || row.adddate === '' ? '' : row.adddate| formatDate("yyyy-MM-dd") }} </slot>
            <!-- 开始日期 -->
            <slot :name="item.field" :data="{value:row[item.field],index:index,row:row}" v-if="item.field==='begindate'">{{row.begindate === '1900-01-01 00:00:00' || row.begindate === '' ? '' : row.begindate | formatDate("yyyy-MM-dd") }} </slot>
         <!--    <slot name="mawbFixed" :data="{value:row['hawb'],index:index,row:row}" v-if="item.field==='mawbFixed'&&name=='pfreportSearch.vue'"></slot> -->

           <!-- <span v-if="item.field==='hawbjz'&&name=='pfreportSearch.vue'"><span>{{row.hawbzdpiece}}/{{Number(row.hawbzdweight).toFixed(2)}}</span></span> -->
          </td>


    </tr>
  </table>
<!--   <el-table
    :data="tableData5"
   >

    <template  v-for="item in head">
        <el-table-column :prop="item.field" :label="item.title" :width="item.width" >
        </el-table-column>
   </template>


  </el-table> -->
</template>


<script>
  export default {
        props:["head","tableData5","name"],
    data() {
      return {

      }
    },
    mounted(){
      console.log(this.head);
      console.log(this.tableData5)
    }
  }
</script>




<style lang="less" scoped>

.nestedtable{
  padding:0 8px 0 7px;
  box-sizing: content-box;
  border:#fff;
}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }








//  table tr:nth-child(even){background:#f8f8f8;}
//  table tr:nth-child(odd){background:#fff;}

tr{
 color:#333;
 font-size:12px;
}
 td,th{
  height:32px;
  line-height:32px;
  min-width:30px;
  text-align:center;
  padding:0px 8px;
  border:1px solid #e8e8e8;
  white-space:nowrap;

}

 th{
   border-top:0px solid #e8e8e8;
}




td i{
  display:inline-block;
  width:16px;
  height:16px;
  margin:0 6px;
  font-size:14px;
  cursor:pointer;
}




</style>
