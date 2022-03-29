

<template>

<div style="position:relative;display:inline-block">
<!-- 委托项目 -->
  <el-input v-model="tableDataName2"  @focus="hawbShuJu" @input="showDetail=true"  @keyup.native="filter2" @click.native="showDetail2"  style="width:270px;" @blur="clearNowValue" :placeholder="type=='1'?'收货人查询':'发货人查询'">
<i slot="prefix" class="el-input__icon el-icon-search" style="margin-top:-5px;"></i>
  </el-input>


     <el-button style="margin-left:10px;" @click="hawbData" v-show='!hideBtn'>保存</el-button>
     <el-button style="margin-left:10px;" @click="deldata" v-show='!hideBtn'>清除</el-button>
<!--     <el-button type="primary" @click="openData">展示数据</el-button>   -->

    <div v-if="showDetail" class="infoPane" >
    <el-table :data="tableDataN2" border  height="200" :fit="false" style="width: 100%;overflow:hidden"  @row-click='select2' id="receiveTable">

     <el-table-column
      label="操作"
      width="50"
      align="center"
      >
      <template slot-scope="scope" >
      <i class="el-icon-delete" @click.stop="delRowData(scope.row)"></i>
      </template>
    </el-table-column>
    <el-table-column  prop="usr_code"  :label="search.codetype==2?'收货人':'发货人'" width='220' ></el-table-column>
    <el-table-column  prop="companytitle"  label="抬头" width='200' :show-overflow-tooltip=true></el-table-column>
    <el-table-column  prop="address"  label="地址" width='230' :show-overflow-tooltip=true></el-table-column>
    <el-table-column  prop="companycode"  label="国家二字码" width='100' ></el-table-column>
    </el-table>

    <div @click.stop="showDetail=true" class="pagination" >
    <el-pagination  @size-change="handleSizeChange2"  @current-change="handleCurrentChange2"  :current-page="currentPage2"  :page-sizes="[10, 30, 50]"  :page-size="pageSize2"  layout="total, sizes, prev, pager, next, jumper"  :total="totalItems2" >
    </el-pagination>
    </div>
    </div>

</div>
</template>

<script>

import { Notification } from 'element-ui';

    export default {
         //查询条件、收发货人(1、发货人 2、收货人)、(分单数据、总单数据)、总分单(1、总单 2、分单)、收发货人值
        // from    如果是制单页面，要修改一下过滤框宽度
        //  props:['search','type','hawbInfo','dom','model'],
         props:{
           area:{
             type:String,
             default:''
           },
           search:Object,
           type:Number,
           hawbInfo:Array,
           dom:Number,
           model:[Number,String],
           hideBtn:{
             type:Boolean,
             default:false
           }
         }
        ,data () {
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
        //是去焦点没有数据清空
        clearNowValue(){
           if(this.tableDataN2.length==0){
            this.tableDataName2=""
            this.showDetail=false
            this.filter2()
           }
        },




				 select2(row, event, column){

        this.tableDataName2=row.usr_code
      if(this.dom=='2'){
        if(this.type==1){

          this.$emit('rsdata',{usr_code:this.tableDataName2,fdshrId:row.id,companytitle_shr_hawb:row.companytitle,address_shr_hawb:row.address,companycode_shr_hawb:row.companycode,state_shr_hawb:row.state,city_shr_hawb:row.city,postcode_shr_hawb:row.postcode,lxr_shr_hawb:row.lxr,phone_shr_hawb:row.phone,fax_shr_hawb:row.fax,email_shr_hawb:row.email,type:this.type})

    this.hawbInfo[1].model=this.tableDataName2
    this.hawbInfo[1].address_shr_hawb=row.address
    this.hawbInfo[1].city_shr_hawb=row.city
    this.hawbInfo[1].companycode_shr_hawb=row.companycode
    this.hawbInfo[1].companytitle_shr_hawb=row.companytitle
    this.hawbInfo[1].email_shr_hawb=row.email
    this.hawbInfo[1].fax_shr_hawb=row.fax
    this.hawbInfo[1].fdshrId=row.id
    this.hawbInfo[1].lxr_shr_hawb=row.lxr
    this.hawbInfo[1].phone_shr_hawb=row.phone
    this.hawbInfo[1].postcode_shr_hawb=row.postcode
    this.hawbInfo[1].state_shr_hawb=row.state
        }else if(this.type==0){
          this.$emit('rsdata',{usr_code:this.tableDataName2,fdfhrId:row.id,companytitle_fhr_hawb:row.companytitle,address_fhr_hawb:row.address,companycode_fhr_hawb:row.companycode,state_fhr_hawb:row.state,city_fhr_hawb:row.city,postcode_fhr_hawb:row.postcode,lxr_fhr_hawb:row.lxr,phone_fhr_hawb:row.phone,fax_fhr_hawb:row.fax,email_fhr_hawb:row.email,type:this.type})
    this.hawbInfo[0].model=this.tableDataName2
    this.hawbInfo[0].address_fhr_hawb=row.address
    this.hawbInfo[0].city_fhr_hawb=row.city
    this.hawbInfo[0].companycode_fhr_hawb=row.companycode
    this.hawbInfo[0].companytitle_fhr_hawb=row.companytitle
    this.hawbInfo[0].email_fhr_hawb=row.email
    this.hawbInfo[0].fax_fhr_hawb=row.fax
    this.hawbInfo[0].fdfhrId=row.id
    this.hawbInfo[0].lxr_fhr_hawb=row.lxr
    this.hawbInfo[0].phone_fhr_hawb=row.phone
    this.hawbInfo[0].postcode_fhr_hawb=row.postcode
    this.hawbInfo[0].state_fhr_hawb=row.state
        }


      }else if(this.dom=='1'){
        if(this.type==1){
this.$emit('rsdata',{usr_code:this.tableDataName2,zdshrId:row.id,companytitle_shr_mawb:row.companytitle,address_shr_mawb:row.address,companycode_shr_mawb:row.companycode,state_shr_mawb:row.state,city_shr_mawb:row.city,postcode_shr_mawb:row.postcode,lxr_shr_mawb:row.lxr,phone_shr_mawb:row.phone,fax_shr_mawb:row.fax,email_shr_mawb:row.email,type:this.type})
    this.hawbInfo[1].model=this.tableDataName2
    this.hawbInfo[1].address_shr_mawb=row.address
    this.hawbInfo[1].city_shr_mawb=row.city
    this.hawbInfo[1].companycode_shr_mawb=row.companycode
    this.hawbInfo[1].companytitle_shr_mawb=row.companytitle
    this.hawbInfo[1].email_shr_mawb=row.email
    this.hawbInfo[1].fax_shr_mawb=row.fax
    this.hawbInfo[1].zdshrId=row.id
    this.hawbInfo[1].lxr_shr_mawb=row.lxr
    this.hawbInfo[1].phone_shr_mawb=row.phone
    this.hawbInfo[1].postcode_shr_mawb=row.postcode
    this.hawbInfo[1].state_shr_mawb=row.state
        }else if(this.type==0){
          this.$emit('rsdata',{usr_code:this.tableDataName2,zdfhrId:row.id,companytitle_fhr_mawb:row.companytitle,address_fhr_mawb:row.address,companycode_fhr_mawb:row.companycode,state_fhr_mawb:row.state,city_fhr_mawb:row.city,postcode_fhr_mawb:row.postcode,lxr_fhr_mawb:row.lxr,phone_fhr_mawb:row.phone,fax_fhr_mawb:row.fax,email_fhr_mawb:row.email,type:this.type})
    this.hawbInfo[0].model=this.tableDataName2
    this.hawbInfo[0].address_fhr_mawb=row.address
    this.hawbInfo[0].city_fhr_mawb=row.city
    this.hawbInfo[0].companycode_fhr_mawb=row.companycode
    this.hawbInfo[0].companytitle_fhr_mawb=row.companytitle
    this.hawbInfo[0].email_fhr_mawb=row.email
    this.hawbInfo[0].fax_fhr_mawb=row.fax
    this.hawbInfo[0].zdfhrId=row.id
    this.hawbInfo[0].lxr_fhr_mawb=row.lxr
    this.hawbInfo[0].phone_fhr_mawb=row.phone
    this.hawbInfo[0].postcode_fhr_mawb=row.postcode
    this.hawbInfo[0].state_fhr_mawb=row.state
        }

      }


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

      this.tableDataN2 = []
      this.filterTableDataEnd2=[]
      this.tableDataS2.forEach((value, index) => {
      if(value.usr_code){
      if(value.usr_code.indexOf(this.tableDataName2.toUpperCase())>=0||value.address.indexOf(this.tableDataName2.toUpperCase())>=0||value.companytitle.indexOf(this.tableDataName2.toUpperCase())>=0){
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
		, hawbShuJu(type){
   //alert(type)
      var that=this;
      that.search.area=this.area||this.$store.state.areaState
     // alert('1')
     // console.log(JSON.stringify(that.search))
      if(!that.search.mdg||!that.search.gid||that.search.mdg.length<2){
        return;
      }
     // console.log(that.search.area)
      if(!that.search.area||that.search.area.split(',').length!=1){
        return;
      }

    //console.log(2222)
        //查收发货人
this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCustomZd',params:that.search,loading:false,tip:false}).then(response=>{
           ////console.log(response.data)

           that.tableDataS2=response.data;
           that.totalItems2 = that.tableDataS2.length;
       // //console.log(that.tableDataS2)
      if (that.totalItems2 > that.pageSize2) {
        for (let index = 0; index < that.pageSize2; index++) {
          that.tableDataN2.push(that.tableDataS2[index]);
        }
      } else {
        that.tableDataN2 = that.tableDataS2;

////console.log(this.hawbInfo[this.type].model)
      }
      ////console.log()
      that.tableDataName2=this.hawbInfo[this.type].model
        }).catch(error=>{

        })
            //that.hawbInfo[0].model
    }
    ,hawbData(){//保存
      var hw=this.hawbInfo
    ////console.log(this.hawbInfo)
    var json={}
    var method;
    if(this.tableDataName2){
      method="put"
    }else{
      method="post"
    }
    //console.log(method)
    if(this.dom==2){//分单
      if(this.type==0){//发货人 codetype:1
        json={codetype:1,ready01:2,id:hw[0].fdfhrId,mdg:hw[0].jsonArr.mdg,gid:hw[0].jsonArr.gid,companytitle:hw[0].companytitle_fhr_hawb,address:hw[0].address_fhr_hawb,city:hw[0].city_fhr_hawb,postcode:hw[0].postcode_fhr_hawb,companycode:hw[0].companycode_fhr_hawb,state:hw[0].state_fhr_hawb,lxr:hw[0].lxr_fhr_hawb,phone:hw[0].phone_fhr_hawb,email:hw[0].email_fhr_hawb,fax:hw[0].fax_fhr_hawb}
      }else if(this.type==1){//收货人codetype:2
        json={codetype:2,ready01:2,id:hw[1].fdshrId,mdg:hw[1].jsonArr.mdg,gid:hw[1].jsonArr.gid,companytitle:hw[1].companytitle_shr_hawb,address:hw[1].address_shr_hawb,city:hw[1].city_shr_hawb,postcode:hw[1].postcode_shr_hawb,companycode:hw[1].companycode_shr_hawb,state:hw[1].state_shr_hawb,lxr:hw[1].lxr_shr_hawb,phone:hw[1].phone_shr_hawb,email:hw[1].email_shr_hawb,fax:hw[1].fax_shr_hawb}
      }
    }else if(this.dom==1){//总单
      if(this.type==0){//发货人 codetype:1
        json={codetype:1,ready01:1,id:hw[0].zdfhrId,mdg:hw[0].jsonArr.mdg,gid:hw[0].jsonArr.gid,companytitle:hw[0].companytitle_fhr_mawb,address:hw[0].address_fhr_mawb,city:hw[0].city_fhr_mawb,postcode:hw[0].postcode_fhr_mawb,companycode:hw[0].companycode_fhr_mawb,state:hw[0].state_fhr_mawb,lxr:hw[0].lxr_fhr_mawb,phone:hw[0].phone_fhr_mawb,email:hw[0].email_fhr_mawb,fax:hw[0].fax_fhr_mawb}
      }else if(this.type==1){//收货人codetype:2
        json={codetype:2,ready01:1,id:hw[1].zdshrId,mdg:hw[1].jsonArr.mdg,gid:hw[1].jsonArr.gid,companytitle:hw[1].companytitle_shr_mawb,address:hw[1].address_shr_mawb,city:hw[1].city_shr_mawb,postcode:hw[1].postcode_shr_mawb,companycode:hw[1].companycode_shr_mawb,state:hw[1].state_shr_mawb,lxr:hw[1].lxr_shr_mawb,phone:hw[1].phone_shr_mawb,email:hw[1].email_shr_mawb,fax:hw[1].fax_shr_mawb}
      }

    }

    //var requiredArray=[{id:"companytitle",tip:'请输入抬头'},{id:"address",tip:"请输入地址"},{id:"companycode",tip:"请输入二字码"},{id:"state",tip:"请输入城市名"}]
    //if(!json.)



    if(method=="put"){
      json.modifyman=localStorage.getItem('usrname')
    }else if(method=="post"){
       json.id="-1";
    }
  json.area=this.area||this.$store.state.areaState
    if(!json.gid){
       this.$message.error('请填写委托客户')
       return false
    }

    if(!json.mdg){
      this.$message.error('请填写港口')

       return false
    }

    if(!json.companytitle){
      this.$message.error('请输入抬头')

       return false
    }

      if(!json.address){
      this.$message.error('请输入地址')

       return false
    }

     if(!json.companycode){
      this.$message.error('请输入二字码')

       return false
    }

    if(!json.city){
      this.$message.error('请输入城市名')

       return false
    }






    // if(!json.companytitle&&!json.address&&!json.city&&!json.postcode&&!json.companycode&&!json.state&&!json.lxr&&!json.phone&&!json.email&&!json.fax){
    //    this.$message.error('信息不能为空')
    //    return false
    // }
//console.log(json)
    this.$axios({method:method,url:this.$store.state.publicWebApi+'api/PubCustomZd',data: json,loading:true,tip:true})
    .then(results=>{
      //console.log(results.data.resultstatus)
        if(results.data.resultstatus==0){
        //  this.hawbShuJu()
        }
    })
    .catch(error=>{

    })

},
delRowData(data){
  //console.log(data)
       this.$confirm('是否删除此数据?','提示',{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      })
      .then(()=>{
        this.$axios({method:'put',url:this.$store.state.publicWebApi+'api/PubCustomZd',data:{id:data.id,isdel:'2',area:this.area||this.$store.state.areaState}})
       .then(results=>{
        if(results.data.resultstatus==0){
          this.$message.success('删除成功')
       //   this.hawbShuJu()
           this.deldata()
          }
        })
      .catch(error=>{

       })
    })
      .catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })


},deldata(){
           if(this.type==0){
            Object.keys(this.hawbInfo[0]).forEach(key=>{
              if(key!="jsonArr"){
                this.hawbInfo[0][key]=""
              }

            })
            //console.log(this.hawbInfo[0])
          }else if(this.type==1){
              Object.keys(this.hawbInfo[1]).forEach(key=>{
              if(key!="jsonArr"){
                this.hawbInfo[1][key]=""
              }
            })
            //console.log(this.hawbInfo[1])
          }
}

			},
			computed:{



           },

			mounted () {

      },
      created(){
//alert(4)
     //  this.hawbShuJu(1)

       ////console.log(this.hawbInfo[this.type].model)
        //this.tableDataName2==this.hawbInfo[this.type].model


      },
      watch:{
        showDetail(value){
           if(value){
             document.body.addEventListener('click',this.closeDetail2)
           }else{
            document.body.removeEventListener('click',this.closeDetail2)
           }
        },
        tableDataName2(value){
          ////console.log(value)
          if(!value){
            //alert('11')
               if(this.dom=='2'){
        if(this.type==1){

          this.$emit('rsdata',{usr_code:value,fdshrId:"",companytitle_shr_hawb:"",address_shr_hawb:"",companycode_shr_hawb:"",state_shr_hawb:"",city_shr_hawb:"",postcode_shr_hawb:"",lxr_shr_hawb:"",phone_shr_hawb:"",fax_shr_hawb:"",email_shr_hawb:"",type:1})

        }else if(this.type==0){
          this.$emit('rsdata',{usr_code:value,fdfhrId:"",companytitle_fhr_hawb:"",address_fhr_hawb:"",companycode_fhr_hawb:"",state_fhr_hawb:"",city_fhr_hawb:"",postcode_fhr_hawb:"",lxr_fhr_hawb:"",phone_fhr_hawb:"",fax_fhr_hawb:"",email_fhr_hawb:"",type:0})
    // this.hawbInfo[0].address_fhr_hawb=row.address
    // this.hawbInfo[0].city_fhr_hawb=row.city
    // this.hawbInfo[0].companycode_fhr_hawb=row.companycode
    // this.hawbInfo[0].companytitle_fhr_hawb=row.companytitle
    // this.hawbInfo[0].email_fhr_hawb=row.email
    // this.hawbInfo[0].fax_fhr_hawb=row.fax
    // this.hawbInfo[0].fdfhrId=row.id
    // this.hawbInfo[0].lxr_fhr_hawb=row.lxr
    // this.hawbInfo[0].phone_fhr_hawb=row.phone
    // this.hawbInfo[0].postcode_fhr_hawb=row.postcode
    // this.hawbInfo[0].state_fhr_hawb=row.state
        }


      }else if(this.dom=='1'){
        if(this.type==1){
this.$emit('rsdata',{usr_code:value,zdshrId:"",companytitle_shr_mawb:"",address_shr_mawb:"",companycode_shr_mawb:"",state_shr_mawb:"",city_shr_mawb:"",postcode_shr_mawb:"",lxr_shr_mawb:"",phone_shr_mawb:"",fax_shr_mawb:"",email_shr_mawb:"",type:1})
    // this.hawbInfo[1].address_shr_mawb=row.address
    // this.hawbInfo[1].city_shr_mawb=row.city
    // this.hawbInfo[1].companycode_shr_mawb=row.companycode
    // this.hawbInfo[1].companytitle_shr_mawb=row.companytitle
    // this.hawbInfo[1].email_shr_mawb=row.email
    // this.hawbInfo[1].fax_shr_mawb=row.fax
    // this.hawbInfo[1].zdshrId=row.id
    // this.hawbInfo[1].lxr_shr_mawb=row.lxr
    // this.hawbInfo[1].phone_shr_mawb=row.phone
    // this.hawbInfo[1].postcode_shr_mawb=row.postcode
    // this.hawbInfo[1].state_shr_mawb=row.state
        }else if(this.type==0){
          this.$emit('rsdata',{usr_code:value,zdfhrId:"",companytitle_fhr_mawb:"",address_fhr_mawb:"",companycode_fhr_mawb:"",state_fhr_mawb:"",city_fhr_mawb:"",postcode_fhr_mawb:"",lxr_fhr_mawb:"",phone_fhr_mawb:"",fax_fhr_mawb:"",email_fhr_mawb:"",type:0})
    // this.hawbInfo[0].address_fhr_mawb=row.address
    // this.hawbInfo[0].city_fhr_mawb=row.city
    // this.hawbInfo[0].companycode_fhr_mawb=row.companycode
    // this.hawbInfo[0].companytitle_fhr_mawb=row.companytitle
    // this.hawbInfo[0].email_fhr_mawb=row.email
    // this.hawbInfo[0].fax_fhr_mawb=row.fax
    // this.hawbInfo[0].zdfhrId=row.id
    // this.hawbInfo[0].lxr_fhr_mawb=row.lxr
    // this.hawbInfo[0].phone_fhr_mawb=row.phone
    // this.hawbInfo[0].postcode_fhr_mawb=row.postcode
    // this.hawbInfo[0].state_fhr_mawb=row.state
        }
          }
        }
        },
        model(value){//设默认值
           this.tableDataName2=value
        },
        search:{
          handler(newvalue){
            // this.hawbShuJu(2)
          },deep:true
        }


    }


}











</script>
  <style scoped lang="less">
  .infoPane{
    position:absolute;
    top:30px;
    left:0px;
    height:240px;
    z-index:99;
    width:800px;
    border:1px solid #e8e8e8;
    background:#fff;
    box-shadow: 4px 5px 5px #ccc;
    font-size: 12px;
    overflow: hidden;
  }
  .infoPane>div{
  font-size: 12px;
  }
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



#receiveTable .el-table__body-wrapper,#receiveTable .el-table__footer-wrapper,#receiveTable .el-table__header-wrapper{width:800px!important;}
#receiveTable .el-table__body,#receiveTable .el-table__footer,#receiveTable .el-table__header{table-layout:fixed!important;}

  </style>














