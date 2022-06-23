<template>
  <div>

           <div class="tableFieldConfig">



           <el-select v-model="value" :placeholder="placeholder||'可自定义模板数据'"  style="width:180px" @change='changeFunc'>
      <el-option
        v-for="item in tmpArr"
        :key="item.value"
        :label="item.name"
        :value="item.id">
         <span style="float: left">{{ item.name }}</span>

        <!-- <span style="float: right; color: #8492a6; font-size: 10px;width:13px;height:13px;color:#fff;background:red;border-radius:13px;text-align:center;line-height:13px!important;margin-left:5px;">x</span> -->
        <i class="el-icon-circle-close" style="float: right;color:#F56C6C;margin-left:3px;margin-top:5px;" @click="delTemp(item.id)"></i>

        <!-- <span :style="{background:item.isactivate==1?'orange':'grey'}" class="jihuo" @click="defaultActive(item.id)"></span> -->
      </el-option>

    </el-select>


    <el-button  type="info" plain  @click="dialogTableVisible = true">模板设置</el-button>
      </div>



<!-- 提示框 -->
<el-dialog title="提示" :visible.sync="dialogTableVisible" style="" class="tableTem" width="600px" append-to-body>
  <div>
     <el-radio v-model="tem" label="1">保存新模板</el-radio>
     <el-radio v-model="tem" label="2">替换原模板</el-radio>
  </div>
        <div style="margin-top:20px;" v-if="tem==1">
        <span style="font-size:14px;">请输入模板名称：</span>
            <el-input v-model="tableTemName" placeholder="请输入模板名称" style="width:180px;"></el-input>
            <el-button type="primary" @click="saveTemp('post')">保存</el-button>
         </div>

          <div style="margin-top:20px;" v-if="tem==2">
          <span style="font-size:14px;">请选择被替换模板：</span>
           <el-select v-model="mubanid" placeholder="请选择" style="width:180px;" @change="selChange">
    <el-option
      v-for="item in tmpArr"
        :key="item.value"
        :label="item.name"
        :value="item.id">
    </el-option>
  </el-select>





            <el-button type="primary" @click="saveTemp('put')">保存</el-button>
         </div>
</el-dialog>



  </div>
</template>

<script>

export default {
    props:{
      name:String, //页面名称
      type:Number, //类型 80是服务项目
      jsondata:[Array,Object],
      initCompt:Boolean,
      placeholder:String
    },
    data(){
       return {
          tmpArr:[],  //模板选择数组
          value:"", //下拉框的value
          dialogTableVisible: false, //全屏弹窗
          tableTemVisible:false,//表格新增修改弹窗
          tem:'1',
          tableTemName:'',//模板新名称
          mubanid:'',//被替换模板id
          isactivate:-1,//模板激活
       }
    },
    computed: {
      muban () { //被替换模板名称
        for (let item of this.tmpArr) {
          if (item.id === this.mubanid) {
            return item.name
          }
        }
        return ''
      }
    },
    methods:{
      changeFunc(val){
        this.tmpArr.forEach(i=>{
           if(i.id==val){
              this.$emit('update:jsondata',JSON.parse(i.jsondata))
           }
        })

      },
      selChange(val){
          //  alert(val)
          this.mubanid=val
      },
      getTemp(){
        this.tmpArr=[]
      //  if(this.$store.state.tableTmpAll.length==0){
              this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/UserTemplet',params:{logname:localStorage.getItem('usrname'),project:'bomanagement'},loading:true,tip:false}).then(results=>{
          // console.log(results.data)
           results.data.forEach(el => {
                  if((this.name==el.url)&&(this.type==el.type)){
                        this.tmpArr.push(el)
                  }
                  });
             this.$store.commit("setTableTmpAll", results.data);
                })
  /*       }else{
           this.$store.state.tableTmpAll.forEach(el => {
                  if((this.name==el.url)&&(this.type==el.type)){
                        this.tmpArr.push(el)
                  }
                  });
        } */

      },
      saveTemp(method){


       var json= {isactivate:0,jsondata:'',logname:localStorage.getItem('usrname'),name:'',type:this.type,url:this.name,project:"bomanagement",logExtraData:this.logExtraDataForBuild}
        if(method=='post'){
           json.name=this.tableTemName
        }else{
             json.name=this.muban
             json.id=this.mubanid
        }
         json.jsondata=JSON.stringify(this.jsondata)

          if(!json.name){
            this.$message.error('请选择或输入模板名');return;
          }

          let url = ''
          if (method === 'post') {
            url = 'api/UserTemplet'
          } else {
            url = 'api/UserTempletList'
            json = [json]
          }
           this.$axios({method:method,url:this.$store.state.publicWebApi+url, data:json,loading:true,tip:true,noarea:true}).then((results)=>{
                      if(results.data.resultstatus==0){
                          layer.msg('操作成功');
                           this.tableTemName=this.mubanid=''
                           this.getTemp()
                           this.dialogTableVisible=false
                      }else{
                        this.$message.error(results.data.resultmessage)
                      }
                })


      }
      ,delTemp(id){
              this.$confirm('您将删除本模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action => {
            if(action=='confirm'){
               this.$axios({method:'delete',url:this.$store.state.publicWebApi+'api/UserTemplet',data:{id:id,logname:'admin',logExtraData:this.logExtraDataForBuild},noarea:true,loading:false,tip:true})
               .then(results=>{
                if(results.data.resultstatus!=0){

                }else{
                    this.value=''
                    this.getTemp()

                }

               })
               .catch(error=>{

               })
            }else if(action=='cancel'){
                this.$message({
            type: 'info',
            message: '已取消删除'
          });
            }

          }
        })
      }

     },
    mounted(){
      if(this.$store.state.tableTmpAll.length>0){
        this.$store.state.tableTmpAll.forEach(el => {
                  if((this.name==el.url)&&(this.type==el.type)){
                        this.tmpArr.push(el)
                  }
                  });
      }else{
         this.getTemp()
      }

    },
    watch:{
      initCompt(val){
        // alert(val)
        if(val){
          this.value=''
        }
      }
    },
}
</script>
<style>
  .tableSetMuban{
    display: inline-block;
    min-width: 70px;
    height: 28px;
    line-height: 28px;
    color: #444;
    margin: 0px;
    text-align: center;
    background: #F8F8F8;
    border: 1px solid #ccc;
    cursor: pointer;
    margin-right: 5px;
    text-decoration: none;
  }
  .jihuo{
    float:right; color:#8492a6;width:13px;height:13px;border-radius:13px;margin-top:12px;
  }
.tableTem .el-dialog--small{min-width: 0}
.el-input__inner{
   font-size:12px!important;
}

.tableConfig .el-dialog__body{width:600px!important;margin:0 auto;}
.tableConfig .el-button{padding:8px;}

</style>

