<template>
  <div>
  	<p style="height:28px;margin-bottom:20px;">
<!--     {{autList}} -->
  		<span style="float:left;font-size:14px;">{{$t('userManage.userLists')}}</span>
  		<span style="float:right">
  			<el-button type="info" @click="newAddOpen">{{$t('userManage.userAdd')}}</el-button>
  			<el-button type="info" @click="closeOpen('2')">{{$t('userManage.userDis')}}</el-button>
  			<el-button type="info" @click="closeOpen('1')">{{$t('userManage.userOpen')}}</el-button>
<!--   			<el-button type="info">权限设置</el-button> -->
  		</span>
  	</p>
     <commonTable class="commonTable" :head="userListHead" :table-data="userList" :isMultiSelect="true">
       <template slot="index" slot-scope="props">
         {{props.data.index+1}}
       </template>
       <template slot="operation2" slot-scope="props">
         <span style="color:#0084fb;cursor:pointer" @click="modifyUser(props.data.row,props.data.index)">{{$t('userManage.modify')}}</span>
         <span style="color:#0084fb;cursor:pointer" @click="delUser(props.data.row.id,props.data.index)">{{$t('userManage.delete')}}</span>
        <!--  <span style="color:#0084fb;cursor:pointer">移交管理员</span> -->
       </template>
     </commonTable>

     <div v-show='newAdd' class="newAdd">
      <h3 style="color:#000;letter-spacing:0.1em;" v-if="modifyIndex=='-1'">{{$t('userManage.userInfoAdd')}}</h3>
      <h3 style="color:#000;letter-spacing:0.1em;" v-else>{{$t('userManage.userInfoMod')}}</h3>
      <el-row>
        <el-col :span="6">
          <p>
          {{$t('userManage.name')}}<span style="color:red;font-weight:bold">*</span>
          </p>
          <el-input :placeholder="$t('placeHolder.username')" v-model="userInfo.logname" >

          </el-input>

        </el-col> 
         <el-col :span="6">
          <p>
            {{$t('userManage.code')}}<span style="color:red;font-weight:bold">*</span>
          </p>
          <el-input :placeholder="modifyIndex=='-1'?$t('placeHolder.password'):'******'" v-model="userInfo.upwd" type="password" class="input-required">

          </el-input>

        </el-col> 
         <el-col :span="6">
          <p>
            {{$t('userManage.mobile')}}<span style="color:red;font-weight:bold">*</span>
          </p>
          <el-input :placeholder="$t('placeHolder.cellphone')" v-model="userInfo.mobile" class="input-required">

          </el-input>

        </el-col> 
         <el-col :span="6">
          <div>
          <p>
            Email
          </p>
          <div>
          <el-input :placeholder="$t('placeHolder.emailInfo')" class="email" style="width:120px;" v-model="userInfo.emailpre" @keyup.native="filterEmail">

          </el-input>
          <input disabled  style="width:80px;height:26px;border-bottom:1px solid #DCDFE6;border-left:1px solid #DCDFE6;margin-left:-2px;text-indent:2px;background:none!important" :value="userInfo.emailpex">
        </div>
          </div>


        </el-col> 
         </el-row>
        <el-row>
<!--          <el-col :span="6">
          <p>
            部门
          </p>
          <el-input placeholder="请填写用户部门" style="border:none;border-bottom:1px" v-model="userInfo.post">

          </el-input>

        </el-col>  -->
        <el-col :span="6">
          <p>
            {{$t('userManage.userStatus')}}
          </p>
          <p>
           {{$t('userManage.enable')}}<el-radio v-model="userInfo.status" :label="'1'"><span style="display:none">启用</span></el-radio>
          {{$t('userManage.disable')}}<el-radio v-model="userInfo.status" :label="'2'"><span style="display:none">禁用</span></el-radio>
        </p>

        </el-col> 
        </el-row>

        <div class="qx">
           <h3 style="color:#000;letter-spacing:0.1em;margin-top:10px;margin-bottom:12px;">{{$t('userManage.PermissionSettings')}}</h3>
           
            <el-checkbox v-model="userInfo.authorityList" :label="String(item.aorder)" v-for="item in autList" :key="item.autname">{{item.autname}}</el-checkbox>
           <!--  <el-tooltip class="item" effect="light" :content="$t('userManage.bussinessIncludes')" placement="bottom-start">
            <el-checkbox v-model="userInfo.authorityList" label="100">{{$t('userManage.bussiness')}}</el-checkbox>
            </el-tooltip>
            <el-tooltip class="item" effect="light" :content="$t('userManage.financeIncludes')" placement="bottom-start">
            <el-checkbox v-model="userInfo.authorityList" label="300">{{$t('userManage.Finance')}}</el-checkbox>
            </el-tooltip>
            <el-tooltip class="item" effect="light" :content="$t('userManage.statisticsIncludes')" placement="bottom-start">
            <el-checkbox v-model="userInfo.authorityList" label="400">{{$t('userManage.Statistics')}}</el-checkbox>
            </el-tooltip> -->
        </div>

        <p style="text-align:center;margin-top:30px;">
        <el-button tyle="primary" @click="saveUserInFo">{{$t('common.save')}}</el-button>
        <el-button tyle="primary" @click="reset">{{$t('common.cancel')}}</el-button>
        </p>
     
     </div>

  </div>
</template>
<script>

export default {
  props:{
    autList:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
    components: {
     
  },

   data(){
     return {
    userListHead:[
    // {field:'checkbox',title:''},
    {field:'index',title:'序号'},
    {field:'logname',title:'用户名'},
    {field:'email',title:'邮箱'},
    // {field:'post',title:'部门'},
    {field:'status',title:'状态'},
    {field:'cargoaut',title:'权限'},
    {field:'operation2',title:'操作'},
    ],
    newAdd:false,
    userInfo:{logname:'',upwd:'',mobile:'',emailpex:'@'+sessionStorage.out_email.split('@')[1],emailpre:'',post:'',status:'1',authorityList:[],id:''},
    userList:[],
    modifyIndex:'-1',
    //autList:[],//权限选择
    }
   }
   ,methods:{
      //用户新增保存
      saveUserInFo(){
          var data=this.userInfo
          var reg = /^[a-zA-Z]{1}[0-9a-zA-Z]{7,14}$/;
         var reg2=/^[1]\d{10}$/g;
         if(!data.logname){ 
          this.$message.error(this.$t('tips.errorUser'))
          return 
         }else if(!reg.test(data.upwd)){
         this.$message.error(this.$t('tips.errorCode'))
         return 
         }
         else if(!reg2.test(data.mobile)){
          this.$message.error(this.$t('tips.errorMobile'))
          return
         }

          data.gid=sessionStorage.out_gid
          data.id=this.userInfo.id?this.userInfo.id:''
          data.flag = 3;
          data.usr_max=5
          data.isdel=2
          data.adddate=new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
          data.email=data.emailpre+data.emailpex
          var method=data.id?'put':'post'
          //delete data.authorityList

          new Promise(resolve=>{
            this.$axios({method:method,url:this.$store.state.webApi+'api/ExCustomUser',data:data,loading:false,tip:false})
          .then(results=>{
             if(results.data.resultstatus==0){
               if(method=='post'){
                resolve(results.data.resultid)
              }else{
                resolve(data.id)
              }
               this.$message.success(results.data.resultmessage)
             }else{
              this.$message.error(results.data.resultmessage)
             }
          })
          .catch(error=>{

          })
          })
          .then(id=>{
            this.setAuthority(id,method)//处理权限
          })
          
      },
      //权限保存后处理用户列表
      setAuthority(id,method){
        //alert(method)
        var jsonArr=[]
        var json={
          "usrId": id,
          "authorityList": this.userInfo.authorityList.join(',')
        }
        jsonArr.push(json)
        console.log(jsonArr)
        this.setAuthorityF(jsonArr,method)

      },
      setAuthorityF(json,method){
         
         this.$axios({method:method,url:this.$store.state.webApi+'api/ExAuthorityUser',data:json,loading:false,tip:false})
         .then(results=>{
              if(results.data.resultstatus==0){
               this.$message.success(results.data.resultmessage)
               var data=this.userInfo
               data.id=json[0].usrId
               data.status=data.status=='1'?'启用':'禁用'
               data.cargoaut=[]
               console.log(data)
               data.authorityList.forEach(item=>{

                  data.cargoaut.push(this.autList.filter(i=>String(i.aorder)==item)[0]['autname'])
                  
                })
                data.cargoaut=data.cargoaut.join(',')
               if(method=='post'){
                this.userList.push(data)
              }else{
                this.userList[this.modifyIndex]=data
              }
              this.modifyIndex=-1
              this.newAdd=false
              this.userInfo={logname:'',upwd:'',mobile:'',emailpex:'@'+sessionStorage.out_email.split('@')[1],emailpre:'',post:'',status:'1',authorityList:[]}
             }else{
              this.$message.error(results.data.resultmessage)
             }
         })
         .catch(error=>{

         })
      },
      //email 邮箱设置格式
      filterEmail(){
        console.log(this.userInfo.emailpre)
        if(this.userInfo.emailpre.charAt(this.userInfo.emailpre.length-1)=="@"){
          this.userInfo.emailpre=this.userInfo.emailpre.split('@')[0]
        }
      },
      //删除用户
      delUser(id,index){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=>{//确定
          this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExCustomUser',data:{id:id},loading:false,tip:false})
          .then(results=>{
            if(results.data.resultstatus==0){
              this.userList.splice(index,1)
              this.$message.success(results.data.resultmessage)
            }else{
              this.$message.error(results.data.resultmessage)
            }
          })
          .catch(error=>{

          })
        })
        .catch(()=>{//取消
         this.$message.info('已取消操作')        
        })
        
      },
      //用户禁用启用
      closeOpen(flag){
        //  this.$confirm('是否确认操作?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        //  .then(()=>{
        //    var userId=[]
        //    var userIndex=[]
        //    var recorder=this.userList.some((item=>{
        //     return item.checked
        //    }))
        //    if(!recorder){
        //     this.$message.error('请选择用户');
        //     return
        //    }else{
        //     this.userList.forEach((item,index)=>{
        //       if(item.checked){
        //         userId.push(item.id)
        //         userIndex.push(index)
        //       }
        //     })

        //     this.$axios({method:'put',url:this.$store.state.webApi+'api/ExCustomUser',data:{id:userId.join(','),status:flag},loading:false,tip:false})
        //     .then(results=>{
        //         if(results.data.resultstatus==0){
        //           this.$message.success(results.data.resultmessage)
        //           userIndex.forEach(item=>{
        //             this.userList[item].status=flag=='1'?'启用':'禁用'
        //           })
                  
        //         }else{
        //           this.$message.error(results.data.resultmessage)
        //         }
        //     })
        //     .catch(error=>{

        //     })

            
        //    }
        //  })
        //  .catch(()=>{
        //   this.$message.info('已取消操作')     
        //  })


           var recorder=this.userList.some((item=>{
            return item.checked
           }))
           if(!recorder){
            this.$message.error('请选择用户');
            return
           }else{
            this.userList.forEach((item,index)=>{
              if(item.checked){
                this.$axios({method:'put',url:this.$store.state.webApi+'api/ExCustomUser',data:{id:item.id,status:flag},loading:false,tip:false})
            .then(results=>{
                if(results.data.resultstatus==0){
                  this.$message.success(results.data.resultmessage)
                 
                    this.userList[index].status=flag=='1'?'启用':'禁用'
                  
                  
                }else{
                  this.$message.error(results.data.resultmessage)
                }
            })
            .catch(error=>{

            })
              }
            })
           }

      },
      //修改用户名
      modifyUser(data,index){
         //console.log(data)
         this.modifyIndex=index
         this.newAdd=true
         this.userInfo=Object.assign({},this.userInfo,data)
         var backDetail={...this.userInfo}
         console.log(backDetail)
         backDetail['emailpex']='@'+data.email.split('@')[1]
         backDetail['emailpre']=data.email.split('@')[0]
         backDetail['status']=this.userInfo['status']=='启用'?'1':'2'
         backDetail['authorityList']=[]
         if(backDetail['cargoaut']){
           backDetail['cargoaut'].split(',').forEach(item=>{
            backDetail['authorityList'].push(this.autList.filter(i=>i.autname==item)[0]['aorder'])
           })
         }

         this.userInfo=backDetail
      },
      //新增用户
      newAddOpen(){
        if(this.modifyIndex==-1){
          this.newAdd=!this.newAdd
        }else{
          this.modifyIndex='-1'
          this.userInfo={logname:'',upwd:'',mobile:'',emailpex:'@'+sessionStorage.out_email.split('@')[1],emailpre:'',post:'',status:'1',authorityList:[]}
        }
      },
      //取消
      reset(){
       this.newAdd=false
       this.modifyIndex='-1'
       this.userInfo={logname:'',upwd:'',mobile:'',emailpex:'@'+sessionStorage.out_email.split('@')[1],emailpre:'',post:'',status:'1',authorityList:[],id:''}
      },
      //查询用户
      userInfoList(){
        console.log(this.autList)
        this.$axios({method:'get',url:this.$store.state.webApi+'api/ExCustomUser',params:{gid:sessionStorage.out_gid},loading:false,tip:false})
        .then(results=>{
          results.data.forEach(item=>{
            var cargoautList=[]
            item.status= item.status=='1'?'启用':'禁用'
            if(item.autcodeval){
                 item.autcodeval.split(',').forEach(item=>{
                  cargoautList.push(this.autList.filter(i=>String(i.aorder)==item)[0]['autname'])
                  // if(item=='100'){
                  //   cargoautList.push('订单查询')
                  // }else if(item=='200'){
                  //   cargoautList.push('货物查询')
                  // }else if(item=='300'){
                  //   cargoautList.push('外网订舱')
                  // }else if(item=='400'){
                  //   cargoautList.push('外网对账')
                  // }else if(item=='500'){
                  //   cargoautList.push('发票获取')
                  // }else if(item=='600'){
                  //   cargoautList.push('统计分析')
                  // }else if(item=='700'){
                  //   cargoautList.push('运价查询')
                  // }
            })
            }

            item.cargoaut=cargoautList.join(',')
          })
          
          this.userList=results.data
        })

      },

    }
    ,computed:{


    },
    created () {
     this.userInfoList()
     //this.autList=JSON.parse(sessionStorage.out_autList)


    },
    watch: {
          

    }

}
</script>
<style scoped lang="less">
.newAdd{
  border:1px solid #E7E7E7;
  background:#F8F8F8;
  padding:16px;
  margin-top:20px;
  p{font-size:14px;text-indent:10px;margin-bottom:6px;margin-top:10px;}
  el-row{margin-top:10px;}
  .email {
    /deep/.el-input__inner{
    width:120px;
    border:none;
    border-bottom:1px solid #DCDFE6;
    border-radius:0;
    background:none;
    margin-bottom:10px;
  }
  }
   /deep/.el-input__inner{
    width:220px;
    border:none;
    border-bottom:1px solid #DCDFE6;
    border-radius:0;
    background:none;
    margin-bottom:10px;
  }
  
  
}


</style>


