

<template>

<div style="position:relative;display:inline-block" >
<!-- 委托项目 -->

 <input v-model="tableDataName2" placeholder=""  @keyup="filter2" @click="showDetail2" class="el-input__inner" :style="{width:width+'px'}">

 </input>

<!--     <el-button type="primary" @click="openData">展示数据</el-button>   -->

    <div v-if="showDetail" style="position:absolute;top:30px;left:0px;height:240px;z-index:99;width:auto;overflow-y:auto;border:1px solid #20a0ff;background:#fff" >
    <el-table :data="tableDataN2" border  style="width: 100%"  @row-click='select2'>
    <el-table-column  prop="usr_name"  label="公司名称" :width='360'>  </el-table-column>
    <el-table-column  prop="usr_code"  label="公司代码" :width='290'>  </el-table-column>
    </el-table>

    <div @click.stop="showDetail=true" class="pagination" >
    <el-pagination  @size-change="handleSizeChange2"  @current-change="handleCurrentChange2"  :current-page="currentPage2"  :page-sizes="[10, 30, 50]"  :page-size="pageSize2"  layout="total, sizes, prev, pager, next, jumper"  :total="totalItems2" >
    </el-pagination>
    </div>
    </div>

</div>
</template>

<script>



    export default {
         //查询条件，此报关供应商所在list,报关供应商的值
         props:['search','bggysIndex','model','width'],
        data () {
            return {
                   tableDataS2: [],
         tableDataName2: "",   //加载时此值为数据model值
         tableDataN2: [],
         currentPage2: 1,
         pageSize2:10,
         totalItems2: 0,
         filterTableDataEnd2:[],
         flag2:false,
         showDetail:false,

			   }
        },

			methods: {
				 select2(row, event, column){

        this.tableDataName2=row.usr_name


         this.$emit('gysdata',{gysdata:this.tableDataName2,id:row.id,index:this.bggysIndex});

        this.showDetail=false

      },
      showDetail2(){

 this.showDetail=true;

      },
      closeDetail2(){
       this.showDetail=false
      },
     filter2() {


      if (this.tableDataName2 == " ") {
//console.log(this.tableDataName2)
      this.flag2=false
      }else{
        ////console.log(this.tableDataName2)
      this.tableDataN2 = []
      this.filterTableDataEnd2=[]
      this.tableDataS2.forEach((value, index) => {
      if(value.usr_name){
      if(value.usr_name.indexOf(this.tableDataName2.toUpperCase())>=0||value.usr_code.indexOf(this.tableDataName2.toUpperCase())>=0){
      this.filterTableDataEnd2.push(value)
      }
      }
      });
      ////console.log( JSON.stringify(this.filterTableDataEnd))

      this.currentPage2=1
      this.totalItems2=this.filterTableDataEnd2.length
      // //console.log(this.totalItems)
      // this.tableDataN= this.filterTableDataEnd
      this.tableDataN2=this.filterTableDataEnd2.slice((this.currentPage2-1)*this.pageSize2,this.currentPage2*this.pageSize2)

      this.flag2=true
      }

    },

      handleSizeChange2(val) {

      ////console.log(`每页 ${val} 条`);
       this.pageSize2 = val;
       //console.log((this.currentPage2 - 1) * this.pageSize2)
       //console.log(val)
       if(!this.flag2){

            this.tableDataN2=this.tableDataS2.slice((this.currentPage2 - 1) * val,val*this.currentPage2)


         }else{

              this.tableDataN2=this.filterTableDataEnd2.slice((this.currentPage2 - 1) * val,val*this.currentPage2)


         }


      },
      handleCurrentChange2(val) {


      this.currentPage2 = val;
      //console.log((val - 1) * this.pageSize2)
      //console.log(this.pageSize2)
      ////console.log(this.tableDataS)
      ////console.log(val)
      if(!this.flag2){

      this.tableDataN2=this.tableDataS2.slice((val - 1) * this.pageSize2,this.pageSize2*val)


      }else{

           this.tableDataN2=this.filterTableDataEnd2.slice((val - 1) * this.pageSize2,this.pageSize2*val)


      }

      }

			},
			computed:{


           },

			mounted () {

      },
      created(){
       var that=this
        if(!sessionStorage.getItem('wtxm')){
          this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCustom',params:this.search,loading:false,tip:false}).then(response=>{
           ////console.log(response.data)
           sessionStorage.setItem('wtxm',JSON.stringify(response.data))
           that.tableDataS2=response.data;
           that.totalItems2 = that.tableDataS2.length;
        //console.log(that.tableDataS2)
      if (that.totalItems2 > that.pageSize2) {
        for (let index = 0; index < that.pageSize2; index++) {
          that.tableDataN2.push(that.tableDataS2[index]);
        }
      } else {
        that.tableDataN2 = that.tableDataS2;

      }
        }).catch(error=>{

        })
      }else{
        that.tableDataS2=JSON.parse(localStorage.getItem('wtxm'));
        that.totalItems2 = that.tableDataS2.length;
        //console.log(that.tableDataS2)
      if (that.totalItems2 > that.pageSize2) {
        for (let index = 0; index < that.pageSize2; index++) {
          that.tableDataN2.push(that.tableDataS2[index]);
        }
      } else {
        that.tableDataN2 = that.tableDataS2;

      }
      }

      that.tableDataName2=this.model


      },
      watch:{
        showDetail(value){
           if(value){
             document.body.addEventListener('click',this.closeDetail2)
           }else{
            document.body.removeEventListener('click',this.closeDetail2)
           }
        }
        ,tableDataName2(value){
          if(!value){
            this.$emit('gysdata',{gysdata:value,id:"",index:this.bggysIndex});
          }
        },
        model(value){
          this.tableDataName2=value
        }

    }


}











</script>
  <style scoped lang="less">
.input-content input{
  min-width:80px;
}
.el-pagination__editor{
  width:20px;
}
.el-pagination{
  height:40px;
  padding:5px 5px;
}

.pagination input{box-shadow:none;border:1px solid #20a0ff;}
.pagination .el-pagination .el-select .el-input{width:80px;}
.pagination .page-container-box .el-input__inner{width:80px!important;}
  </style>












