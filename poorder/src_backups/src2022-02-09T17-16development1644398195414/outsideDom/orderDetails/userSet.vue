<template>
  <div class="userSet">
<!-- {{emailpushlist}}
{{smspushlist}} -->
    <div class="userInformation" >
      <div style="float:left;">
        <img src="../static/images/logname.png" height="30" width="30" style="display:inline-block">
        <div style="display:inline-block;margin-left:8px;padding:3px;font-size:12px;color:#999;">
        {{$t('mysets.logname')}}<br>
        <span style="font-size:14px;color:#116cf3;cursor:pointer;display:block;margin-top:3px">
       <!--  {{logname}} -->
       <el-input  :placeholder="email.split('@')[0]" style="width:90px;" v-model="newUserInfo.emailpre" @keyup.native="filterEmail" :clearable="true"></el-input>
       <input disabled  style="width:140px;height:26px;border-left:1px solid #DCDFE6;margin-left:-2px;text-indent:2px;background:none!important;color:#C8CCD8" :value="'@'+email.split('@')[1]">

        </span>
          </div>
      </div>

      <div style="float:right;text-align:right">
        <span style="display:block;color:#f35611;font-size:10px;background:rgba(253,221,207,.2);border-radius:10px;padding:3px;text-align:center;width:80px;cursor:pointer;margin-left:45px;margin-bottom:3px">
          {{flag=='2'?$t('mysets.gly'):$t('mysets.ptzh')}}
        </span>

        <span style="font-size:14px;color:#116cf3;cursor:pointer;margin-top:3px" v-if="flag!='2'" @click="getManagement">{{$t('mysets.qryAdmInfo')}}</span>
      </div>
    </div>

    <div class="userInformation" style="height:48px;line-height:28px;cursor:pointer">
      <div style="float:left;" class="secondLine">
        <img src="../static/images/pwd.png">
        <div class="word">
        {{$t('mysets.codeC')}}
          </div>
      </div>   
       <div style="float:right">
       <el-input type="password" :placeholder="$t('placeHolder.password')" v-model="newUserInfo.upwd" :clearable="true"></el-input>
        <!-- <i class="el-icon-arrow-right"></i> -->
      </div>
    </div>

    <div class="userInformation" style="height:48px;line-height:28px;cursor:pointer">
      <div style="float:left;" class="secondLine">
        <img src="../static/images/mobile.png">
        <div class="word">
        {{$t('mysets.mobileC')}}
          </div>
      </div>   
       <div style="float:right">
            <el-input  :placeholder="mobile.substring(0,4)+'****'+mobile.substring(7)" v-model="newUserInfo.mobile" :clearable="true"></el-input>
      </div>
    </div>

<!--      <div class="userInformation" style="height:48px;line-height:28px;cursor:pointer">
      <div style="float:left;" class="secondLine">
        <img src="../../../static/images/email.png">
        <div class="word">
        {{$t('mysets.emailC')}}
          </div>
      </div>   
       <div style="float:right">
       <el-input  :placeholder="email.split('@')[0]" style="width:120px;" v-model="newUserInfo.emailpre" @keyup.native="filterEmail" :clearable="true"></el-input>
       <input disabled  style="width:80px;height:26px;border-left:1px solid #DCDFE6;margin-left:-2px;text-indent:2px;background:none!important;color:#C8CCD8" :value="'@'+email.split('@')[1]">
      </div>
    </div> -->

<!--    <div class="userInformation" style="height:48px;line-height:28px;margin-top:30px;">
      <div style="float:left;" class="secondLine">
        <div class="word">
        {{$t('mysets.openMes')}}
          </div>
      </div>   
       <div style="float:right">

       <el-select v-model="smspushlist" multiple placeholder="请选择" @change="SelectChange(smspushlist,'1')" v-if="messageTz">
         <el-option value="全部" key="全部"></el-option>   
         <el-option
         v-for="item in nodeArryList"
         :key="item.nodecode"
         :label="item.nodename"
         :value="item.nodecode">
        </el-option>
      </el-select>

      <el-switch v-model="messageTz"></el-switch>
      </div>
    </div> -->

        <div class="userInformation" style="height:48px;line-height:28px;border:none" v-if="projectIsWecan">
      <div style="float:left;" class="secondLine">
        <div class="word">
        {{$t('mysets.openEml')}}
          </div>
      </div>   
       <div style="float:right">
       <el-select v-model="emailpushlist" multiple :placeholder="$t('placeHolder.nodeselect')" @change="SelectChange(emailpushlist,'2')" v-if="emailTz">
         <el-option value="全部" key="全部" :label="$t('outside.all')"></el-option>  
         <el-option
         v-for="item in nodeArryList"
         :key="item.nodecode"
         :label="$i18n.locale=='English'?item.operename:item.opername"
         :value="item.nodecode">
        </el-option>
      </el-select>
       <el-switch v-model="emailTz"></el-switch>
      </div>

    </div>
       <span v-if="emailTz" style="color:red;font-size:12px;font-weight:bold">{{$t('tips.tips3')}}</span>
    <div style="text-align:center;margin-top:18px;position:relative">
     
      <el-button type="primary" @click="saveSet">{{$t('common.save')}}</el-button>
      <!-- <a style="position:absolute;right:20px;font-size:14px;top:6px;color:#999" :href="url" target="_self" @click="loginout">{{$t('mysets.loginout')}}</a> -->

    </div>
<!-- 管理员信息弹框 -->
<el-dialog
    :visible.sync="managementShow"
    width="50%"
    top="10%"
    center
    v-if="managementShow"
    :show-close='false'
    custom-class="setDialog"
    append-to-body>
    <h2 style="margin-bottom:20px;">
      {{$t('outside.managementInfo')}}
      <i class="el-icon-close" @click="managementShow=false" style="float:right;cursor:pointer;"></i>
    </h2>

    <commonTable class="commonTable" :head="managementHead" :table-data="managementInfo">

      <template slot="email" slot-scope="props">
        <a :href="'mailto:'+props.data.row.email" style="color:#4795FA">{{$t('mysets.emailto')}}</a>
      </template>

    </commonTable>
</el-dialog>
  </div>
</template>
<script>

export default {
  props:{
   
  },
    components: {
     
  },

   data(){
     return {
       logname:localStorage.usrname,
       flag:sessionStorage.out_flag,
       email:sessionStorage.out_email,
       mobile:sessionStorage.out_mobile,
       managementShow:false,
       managementInfo:[],
       managementHead:[
       {field:'logname',title:'姓名'},
       {field:'mobile',title:'手机'},
       {field:'email',title:'操作'}
       ],
       newUserInfo:{upwd:'',mobile:'',emailpre:''},
       messageTz:false,
       emailTz:false,
       emailpushlist:[],
       smspushlist:[],
       nodeArryList:JSON.parse(sessionStorage.out_nodeArr),
       url:'http://www.wecanintl.com'
   }
  }
   ,methods:{
  //获取管理员
  getManagement(){
     this.managementInfo=[]
     this.$axios({method:'get',url:this.$store.state.webApi+'api/ExCustomUserAdmin',params:{gid:sessionStorage.out_gid},loading:false,tip:false})
     .then(results=>{
          this.managementInfo.push(results.data)
          this.managementShow=true
     })
     .catch(error=>{

     })
  },
        //email 邮箱设置格式
      filterEmail(){
        //console.log(this.userInfo.emailpre)
        if(this.newUserInfo.emailpre.charAt(this.newUserInfo.emailpre.length-1)=="@"){
          this.newUserInfo.emailpre=this.newUserInfo.emailpre.split('@')[0]
        }
      },
      //选择邮件通知
      SelectChange(val,type){
        console.log(val)
        if(type=='1'){
          if(val.indexOf('全部')!='-1'){
          
          if(this.nodeArryList.length==val.length-1){
            this.smspushlist=[];
          }else{
            this.smspushlist=[];
            this.nodeArryList.forEach(item=>{
            this.smspushlist.push(item.nodecode)
          })
          }
        }else{
          if(this.nodeArryList.length==val.length){
            this.smspushlist=[]
            this.nodeArryList.forEach(item=>{
            this.smspushlist.push(item.nodecode)
          })
          }
        }
        }else if(type=='2'){
            if(val.indexOf('全部')!='-1'){
          
          if(this.nodeArryList.length==val.length-1){
            this.emailpushlist=[];
          }else{
            this.emailpushlist=[];
          this.nodeArryList.forEach(item=>{
            this.emailpushlist.push(item.nodecode)
          })  
          }
          
        }else{
          if(this.nodeArryList.length==val.length){
            this.emailpushlist=[]
            this.nodeArryList.forEach(item=>{
            this.emailpushlist.push(item.nodecode)
          })
          }
        }
        }
        
      },
      saveSet(){
        var emailpushlist=this.emailpushlist.join(',')
        var smspushlist=this.smspushlist.join(',')
        var data={}
        var upwd=1
        var mobile=1
        Object.keys(this.newUserInfo).forEach(item=>{
          if(this.newUserInfo[item]){
            
            if(item=='emailpre'){
              data['email']=this.newUserInfo[item]+'@'+email.split('@')[1]
            }else if(item=='upwd'){
              var reg = /^[a-zA-Z]{1}[0-9a-zA-Z]{7,14}$/
                    if(!reg.test(this.newUserInfo[item])){
                      upwd=0
                    }
            }else if(item=='mobile'){
               var reg2=/^[1]\d{10}$/g;
               if(!reg2.test(this.newUserInfo[item])){
                      mobile=0
                    }
            }
            data[item]=this.newUserInfo[item]
          }
        })
        data.emailpushlist=emailpushlist
        data.smspushlist=smspushlist
        data.gid=sessionStorage.out_gid
        data.id=sessionStorage.out_id

        if(upwd==0){
          this.$message.error(this.$t('tips.errorCode'))
          return
        }else if(mobile==0){
          this.$message.error(this.$t('tips.errorMobile'))
          return
        }

        this.$axios({method:'put',url:this.$store.state.webApi+'api/ExCustomUser',data:data,loading:false,tip:false})
        .then(results=>{
            if(results.data.resultstatus==0){
              this.$message.success(results.data.resultmessage)
              this.$store.commit("setEmailpushlist", data.emailpushlist)
              this.$store.commit("setSmspushlist", data.smspushlist);
            }else{
              this.$message.error(results.data.resultmessage)
             }
        })
        .catch(error=>{

        })



      },
      loginout(){
        sessionStorage.clear()
        //this.url="http://www.wecanintl.com/test0.html"
      }

    }
    ,computed:{
     
    },
    created () {
      
    },
    watch: {

      '$store.state.emailpushlist':{
         handler(val){
          if(val){

          this.emailTz=true
          this.emailpushlist=val.split(',')
         }else{
          this.emailTz=false
          this.emailpushlist=[]
         }
         },
         immediate:true
         
         
      },
      '$store.state.smspushlist':{
        handler(val){
          if(val){
          this.messageTz=true
          this.smspushlist=val.split(',')
         }else{
          this.messageTz=false
          this.smspushlist=[]
         }
         },
         immediate:true
         
      },
      emailTz(val){
        if(!val){
          this.emailpushlist=[]
          //this.$store.commit("setEmailpushlist", '')
        }
      },



    }

}
</script>
<style scoped lang="less">
.userSet{
  padding:20px;
  margin-top:-20px;
  .userInformation{
    padding-bottom:10px;
    padding-top:10px;
    border-bottom:1px solid #EDEDED;
    &:after{
      content:'';
      display:block;
      clear:both;
    }
    .secondLine{
           img{
              display:inline-block;
              margin-left:8px;
              margin-right:20px;
           }
           .word{
            display:inline-block;
          
            font-size:14px;
            color:#222;
           }

    }
    /deep/.el-input{
      //margin-left:30px;
      /deep/.el-input__inner{
      border:none;
      padding-left:0;
      //text-align:right
    }
    }
    
  }
  /deep/.el-button{
    width:120px;
    height:32px;
  }
  /deep/.el-select{
    /deep/.el-select__tags{
      max-width:100%!important;

    }
    /deep/.el-input__inner{
      vertical-align:middle
    }
  }
  



}
  



</style>


