<template>
  <div class="elform">
    <!-- {{inputModelData}}
    {{checkRequier}} -->
    <el-form ref="form" label-width="115px" :inline="true" style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap">
    <el-form-item label="延伸服务号：" style="width:100%" v-if="pagetype==1">
        <!-- <el-input disabled style="width:165px" v-model="inputModelData.pono"></el-input> -->
        <span>{{inputModelData.pono}}</span>
    </el-form-item>
   <el-form-item label="服务类别：" v-if="pagetype==1">
                     <el-select v-model="inputModelData.servicename" placeholder="请选择">
                    <el-option
                      v-for="item in fwlbArr"
                      :key="item.id"
                      :label="item.sort"
                      :value="item.sort">
                    </el-option>
                  </el-select>
    </el-form-item>
       <el-form-item label="要求完成时间：" style="margin-left:20px">
              <el-date-picker
                          v-model="inputModelData.yqdate"
                          type="datetime"
                          placeholder="选择日期"
                          format="yyyy-MM-dd HH:mm"
                          >
                        </el-date-picker>
    </el-form-item>

<el-row style="width:100%;margin-top:10px">
     <el-form-item label="服务内容：" >
              <el-input type="textarea" v-model="inputModelData.servicecontent" style="width:530px"></el-input>
    </el-form-item>
</el-row>

    <el-form-item style="width:100%;margin-top:10px;margin-left:40px;">
        <el-button @click="saveListInfo">保存</el-button> <el-button @click="resetFunc">重置</el-button>
    </el-form-item>

    </el-form>

    <div>

    </div>
       <commonTable class="commonTable" :head="tableHead" :table-data="tableData" style="margin-top:8px;">
           <template slot="operate" slot-scope="props">
             <i class="el-icon-setting" @click="setListInfo(props.data.index)"></i>
           <i class="el-icon-delete" @click="delListInfo(props.data.index)"></i>
           </template>
        </commonTable>

  </div>
</template>
<script>

import {getChangeRate} from '../../api/localStorage.js'
export default {
  props:{
    mawbguid:[Number,String],
    type:{ //1 始发港 2 目的港
      type:Number,
      default:1
    },
     pagetype:{ //1延伸 2延伸拆分的
      type:Number,
      default:1
    }
    ,serviceguid:[Number,String]
  },
    components: {

  },

   data(){
     return {
       disabled:false,
       putIndex:-1,
       tableHead:[
          {title:"操作",field:"operate"},
          {title:"延伸服务号",field:"pono"},
          {title:"服务类别",field:"servicename"},
          {title:"服务内容",field:"servicecontent"},
          {title:"要求完成日期",field:"yqdate"},
          {title:"创建人",field:"addman"},
          {title:"创建时间",field:"adddate"},
       ]
       ,tableData:[
       ]
        ,inputViewData: [
      ],
      inputModelData:{pono:"",servicename:"",servicecontent:"",yqdate:''},
      fwlbArr:[],
     }
   }
   ,methods:{
        resetFunc(){
          this.inputModelData={pono:"",servicename:"",servicecontent:"",yqdate:''},
          this.putIndex=-1
        },
     getListInfo(){
              this.$axios({method:"get",url:this.$store.state.webApi+"api/ExYsService",params:{sid:this.mawbguid},loading:true,tip:false}).then(results=>{
                       //console.log("增值信息")
                       //console.log(results.data)
                       this.tableData=results.data.filter(i=>{
                         return i.type==this.type
                       })
                       this.$emit('getJsxmData',this.tableData,1)
              })
     },
     saveListInfo(){
           if(this.checkRequier!=''){
             this.$message.error("请填写"+this.checkRequier);return;
           }
          var json=JSON.parse(JSON.stringify(this.inputModelData))
           json.serviceguid=this.serviceguid
           var method=""
          if(this.putIndex==-1){
                json.type=this.type;
                json.sid=this.mawbguid;
                method="post"
          }else{
                method="put"
                json={json:json}
          }
               this.$axios({method:method,url:this.$store.state.webApi+'api/ExYsService',data:json,loading:true,tip:false}).then(results=>{
                        //console.log(results.data)
                        if(results.data.resultstatus==0){
                          // json.guid=results.data.resultguid
                          //   this.tableData.push(json)
                          //   this.initFunc()
                           // this.disabled=true;
                           layer.msg("成功");
                           this.putIndex=-1
                            this.inputModelData={pono:"",servicename:"",servicecontent:"",yqdate:''},
                           this.getListInfo()
                        }else{
                              this.$message.error(results.data.resultmessage)
                        }
               })
     },
     setListInfo(index){
        this.putIndex=index
        this.$nextTick(()=>{
              this.inputModelData=JSON.parse(JSON.stringify(this.tableData[index]))
        })
      //  this.disabled=false;
     },
     delListInfo(index){
        this.$confirm('请确认是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
               this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExYsService',data:{id:this.tableData[index].id,sid:this.tableData[index].sid,serviceguid:this.serviceguid},loading:true,tip:false}).then(results=>{
                   //console.log(results)
                   if(results.data.resultstatus==0){
                     this.tableData.splice(index,1)
                     this.putIndex=-1
                   }else{
                     this.$message.error(results.data.resultmessage)
                   }
               })
        }).catch(() => {

        });
     }
}
,computed:{
   checkRequier(){ //检查是否必填，除备注外全部必填
    var require="";
    Object.keys(this.inputModelData).reverse().forEach(i=>{
       if((!this.inputModelData[i])&&(i!='pono')){
             this.tableHead.forEach(item=>{
               if(i==item.field){
                  require=item.title;
               }
             })

       }

    })
    return require
  }

},
created () {
    this.getListInfo()
    this.fwlbArr=JSON.parse(localStorage.fwlb)

},
watch: {

}

}
</script>
<style lang="less" scoped>
 .elform{
   /deep/ .el-select{
     width:165px
   }
   /deep/ .el-form-item__label{
     padding-right:5px;
     color:#333;
   }
   /deep/ .el-form-item{
            margin-bottom:0px;
   }
 }
</style>


