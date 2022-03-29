<template>
  <div  class="clearafter" :class="[pagetype==1?'pagetype1':'pagetype2']">
    <!-- {{ifHasLimit()}} -->
    <!-- 发货人 -->
    <div class="hawb">
        <div style="position:relative">
          <div class="itemTitle" style="margin-bottom:5px;;font-weight:600" v-if="pagetype==1">Shipper's Name and Address*</div>
             <div class="rowright" v-if="pagetype==1" style="width:190px;position:absolute;right:0;top:16px;border-left:1px solid #e8e8e8;padding-left:5px;margin-top:10px;;">
                          <div class="itemTitle">Shipper's Account Number</div>
                          <!-- <div><el-input></el-input></div> -->
               </div>
          <!-- {{billRSinfo[0].title}} -->
        <!-- <el-input v-model="billRSinfo[0].model" style="width:200px;margin-left:20px;"></el-input> -->
        <recsedField :search="billRSinfo[0].jsonArr" :hawbInfo="billRSinfo" :type="0" :dom="dom" :area="area"  :model="billRSinfo[0].model" @rsdata="rsdata"></recsedField>

        </div>
        <div style="width:100%;margin-top:15px">
                         <p v-if="lengthAlert&&alertFunc(companytitleFhr)" style="color:red">{{alertFunc(companytitleFhr)}}</p>
            <el-popover placement="bottom" trigger="focus" :disabled="!lengthAlert||!companytitleFhr">
<div style="max-width:700px;font-size:12px;">
    <!-- <template v-for="(f,i) in companytitleFhr">
      <span  :style="{color:(i>=limitLength&&i<companytitleFhr.split('\n')[0].length)?'red':''}" :key='i' v-if="!(f=='\n')">{{f}}</span>
        <span v-else :key='i'></br></span>
    </template> -->
     <template v-for="(f,n) in companytitleFhr.split('\n')">
       <template v-for="(b,i) in f">
                <span  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"  v-if="!(f=='\n')">{{b}}</span>
       </template>
      </br>
    </template>
</div>
       <el-input slot="reference" type="textarea" rows="6" :placeholder="isCustoms?'抬头,最多输入35字符':'抬头'"  v-if="dom==1" v-model="billRSinfo[0].companytitle_fhr_mawb" v-verify="'uppercase'"  class="input-required"></el-input>
       <el-input slot="reference" type="textarea" rows="6"  :placeholder="isCustoms?'抬头,最多输入35字符':'抬头'"  v-if="dom==2" v-model="billRSinfo[0].companytitle_fhr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
           </el-popover>



        </div>
        <div style="width:100%;margin-top:15px">
              <p v-if="lengthAlert&&alertFunc(addressFhr)" style="color:red">{{alertFunc(addressFhr)}}</p>
             <el-popover placement="bottom" trigger="focus"  :disabled="!lengthAlert||!addressFhr" >
<div style="max-width:700px;font-size:12px;">
    <template v-for="(f,n) in addressFhr.split('\n')">
       <template v-for="(b,i) in f">
                <span  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"  v-if="!(f=='\n')">{{b}}</span>
       </template>
      </br>
    </template>
   </div>
            <el-input slot="reference" type="textarea" rows="6" :placeholder="isCustoms?'地址,最多输入70字符':'地址'" v-if="dom==1" v-model="billRSinfo[0].address_fhr_mawb" v-verify="'uppercase'"  class="input-required"></el-input>
            <el-input slot="reference" type="textarea"   rows="6" :placeholder="isCustoms?'地址,最多输入70字符':'地址'"  v-if="dom==2" v-model="billRSinfo[0].address_fhr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
           </el-popover>

        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
            <div style="width:23%">
                <el-input  placeholder="国家二字码" v-if="dom==1"  v-model="billRSinfo[0].companycode_fhr_mawb" v-verify="'english'" :maxlength="isams?2:''" class="input-required"></el-input>
                <el-input  placeholder="国家二字码" v-if="dom==2"  v-model="billRSinfo[0].companycode_fhr_hawb" v-verify="'english'"   :maxlength="isams?2:''"  class="input-required"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="州名"  v-if="dom==1"  v-model="billRSinfo[0].state_fhr_mawb" v-verify="'english'"></el-input>
                <el-input placeholder="州名"  v-if="dom==2"  v-model="billRSinfo[0].state_fhr_hawb" v-verify="'english'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="城市"  v-if="dom==1" v-model="billRSinfo[0].city_fhr_mawb" v-verify="'english'"  class="input-required"  ></el-input>
                <el-input placeholder="城市"  v-if="dom==2" v-model="billRSinfo[0].city_fhr_hawb" v-verify="'english'"  class="input-required"  ></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="邮编"  v-if="dom==1" v-model="billRSinfo[0].postcode_fhr_mawb" v-verify="'uppercase'" :class="{'input-required':dom==1}" ></el-input>
                <el-input placeholder="邮编"  v-if="dom==2" v-model="billRSinfo[0].postcode_fhr_hawb" v-verify="'uppercase'" :class="{'input-required':dom==1}" ></el-input>
            </div>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
             <div style="width:23%">
                <el-input placeholder="联系人" v-if="dom==1"  v-model="billRSinfo[0].lxr_fhr_mawb" v-verify="'uppercase'" ></el-input>
                <el-input placeholder="联系人" v-if="dom==2" v-model="billRSinfo[0].lxr_fhr_hawb" v-verify="'uppercase'" ></el-input>
            </div>
            <div style="width:23%">
                <el-input  placeholder="电话"  v-if="dom==1"  v-model="billRSinfo[0].phone_fhr_mawb" :class="{'input-required':isCustoms}" v-verify="'phone'"></el-input>
                <el-input  placeholder="电话"  v-if="dom==2" v-model="billRSinfo[0].phone_fhr_hawb" :class="{'input-required':isCustoms}" v-verify="'phone'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="传真" v-if="dom==1"  v-model="billRSinfo[0].fax_fhr_mawb" v-verify="'uppercase'"></el-input>
                <el-input placeholder="传真" v-if="dom==2" v-model="billRSinfo[0].fax_fhr_hawb" v-verify="'uppercase'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="Email" v-if="dom==1"  v-model="billRSinfo[0].email_fhr_mawb" v-verify="'uppercase'"></el-input>
                <el-input placeholder="Email" v-if="dom==2" v-model="billRSinfo[0].email_fhr_hawb" v-verify="'uppercase'"></el-input>
            </div>
        </div>
<div style="margin-top:15px;">
            <slot name="textCode"></slot>
</div>

    </div>
<!-- 收货人 -->
    <div  class="hawb">

<div style="position:relative">
  <!-- {{billRSinfo[1].title}} -->
<!-- <el-input v-model="billRSinfo[1].model" style="width:200px;margin-left:20px;"></el-input> -->
   <div class="itemTitle" v-if="pagetype==1" style="margin-bottom:5px;;font-weight:600">Consignee's Name and Address*</div>
             <div class="rowright" v-if="pagetype==1" style="width:190px;position:absolute;right:0;top:16px;border-left:1px solid #e8e8e8;padding-left:5px;margin-top:10px;;">
                          <div class="itemTitle">Consignee's Account Number</div>

               </div>

<recsedField :search="billRSinfo[1].jsonArr" :hawbInfo="billRSinfo" :type='1' :area="area"  :dom="dom" :model="billRSinfo[1].model" @rsdata="rsdata"></recsedField>

</div>
        <div style="width:100%;margin-top:15px">
          <!-- {{(dom==1?billRSinfo[1].companytitle_shr_mawb:billRSinfo[1].companytitle_shr_hawb).replace(/\n/g,'5')}} -->
       <p v-if="lengthAlert&&alertFunc(companytitleShr)" style="color:red">{{alertFunc(companytitleShr)}}</p>

<el-popover placement="bottom" trigger="focus" :disabled="!lengthAlert||!companytitleShr">
<div style="max-width:700px;font-size:12px;">
     <template v-for="(f,n) in companytitleShr.split('\n')">
       <template v-for="(b,i) in f">
                <span  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"  v-if="!(f=='\n')">{{b}}</span>
       </template>
      </br>
    </template>
</div>

  <el-input  slot="reference" type="textarea" rows="6" :placeholder="isCustoms?'抬头,最多输入35字符':'抬头'" v-if="dom==1"  v-model="billRSinfo[1].companytitle_shr_mawb" v-verify="'uppercase'" class="input-required"></el-input>
  <el-input  slot="reference"  type="textarea" rows="6" :placeholder="isCustoms?'抬头,最多输入35字符':'抬头'"  v-if="dom==2" v-model="billRSinfo[1].companytitle_shr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
</el-popover>

        </div>
        <div style="width:100%;margin-top:15px">
               <p v-if="lengthAlert&&alertFunc(addressShr)" style="color:red">{{alertFunc(addressShr)}}</p>

   <el-popover placement="bottom" trigger="focus" :disabled="!lengthAlert||!addressShr">
     <div style="max-width:700px;font-size:12px;">
    <template v-for="(f,n) in addressShr.split('\n')">
       <template v-for="(b,i) in f">
                <span  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"  v-if="!(f=='\n')">{{b}}</span>
       </template>
      </br>
    </template>
</div>
          <el-input  slot="reference"  type="textarea" rows="6" :placeholder="isCustoms?'地址,最多输入70字符':'地址'" v-if="dom==1"  v-model="billRSinfo[1].address_shr_mawb"  v-verify="'uppercase'" class="input-required"></el-input>
          <el-input  slot="reference"  type="textarea"  rows="6" :placeholder="isCustoms?'地址,最多输入70字符':'地址'" v-if="dom==2" v-model="billRSinfo[1].address_shr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
 </el-popover>

       </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
            <div style="width:23%">
                <el-input placeholder="国家二字码"  v-if="dom==1" v-model="billRSinfo[1].companycode_shr_mawb" v-verify="'english'" class="input-required"  :maxlength="isams?2:''" ></el-input>
                <el-input placeholder="国家二字码" v-if="dom==2" v-model="billRSinfo[1].companycode_shr_hawb" v-verify="'english'" class="input-required" :maxlength="isams?2:''" ></el-input>
            </div>
            <div style="width:23%">
                <el-input  placeholder="州名" v-if="dom==1"  v-model="billRSinfo[1].state_shr_mawb" v-verify="'english'"></el-input>
                <el-input  placeholder="州名" v-if="dom==2" v-model="billRSinfo[1].state_shr_hawb" v-verify="'english'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="城市" v-if="dom==1"  v-model="billRSinfo[1].city_shr_mawb"  v-verify="'english'" class="input-required"  ></el-input>
                <el-input placeholder="城市" v-if="dom==2" v-model="billRSinfo[1].city_shr_hawb"  v-verify="'english'"  class="input-required"  ></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="邮编" v-if="dom==1"  v-model="billRSinfo[1].postcode_shr_mawb" v-verify="'uppercase'" :class="{'input-required':dom==1}" ></el-input>
                <el-input placeholder="邮编" v-if="dom==2" v-model="billRSinfo[1].postcode_shr_hawb"  v-verify="'uppercase'" :class="{'input-required':dom==1}" ></el-input>
            </div>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
             <div style="width:23%">
                <el-input placeholder="联系人" v-if="dom==1"  v-model="billRSinfo[1].lxr_shr_mawb"  v-verify="'uppercase'" ></el-input>
                <el-input placeholder="联系人" v-if="dom==2" v-model="billRSinfo[1].lxr_shr_hawb" v-verify="'uppercase'" ></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="电话" v-if="dom==1"  v-model="billRSinfo[1].phone_shr_mawb" :class="{'input-required':isCustoms}" v-verify="'phone'"></el-input>
                <el-input placeholder="电话" v-if="dom==2" v-model="billRSinfo[1].phone_shr_hawb" :class="{'input-required':isCustoms}" v-verify="'phone'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="传真" v-if="dom==1"  v-model="billRSinfo[1].fax_shr_mawb" v-verify="'uppercase'"></el-input>
                <el-input placeholder="传真" v-if="dom==2" v-model="billRSinfo[1].fax_shr_hawb" v-verify="'uppercase'"></el-input>
            </div>
            <div style="width:23%">
                <el-input placeholder="Email" v-if="dom==1"  v-model="billRSinfo[1].email_shr_mawb" v-verify="'uppercase'"></el-input>
                <el-input placeholder="Email" v-if="dom==2"  v-model="billRSinfo[1].email_shr_hawb" v-verify="'uppercase'"></el-input>
            </div>
        </div>


<div style="margin-top:15px;">
            <slot name="textCode2"></slot>
</div>

    </div>


  </div>


</template>



<script>

import recsedField from './recsedField'

    export default {
        props:{
          billRSinfo:Array,
          dom:{ // 1总单 2分单
            type:Number,
            default:1
          }
          ,area:String,
          pagetype:{
            type:Number,
            default:1
          },
          isams:{ //ams发送
            type:Boolean,
            default:false
          },
           isCustoms:{//海关联系单
            type:Boolean,
            default:false
          },
          limitLength:{
            type:[Boolean,Number],
            default:35
          }
           ,
            lengthAlert:{//是否提示字符长度限制,收发货人与地址
            type:Boolean,
            default:true
          },
          isHasLimit:String,
          },
        components: {
              recsedField
        },
        data () {
            return {

            }
        },
        methods: {
              rsdata(data){
                  this.$emit('rsdataP',data)
              },
              alertFunc(data){
                if(!data) return '';
                  let arr=data.split('\n')
                  let limitLength=this.limitLength==100?150:this.limitLength
                  let str1='',str2='';
                  for(let i in arr){
                    if(i==0&&(arr[i].length>limitLength)){
                       str1=`首行已超出${limitLength}字数限制;`
                    }
                     if(i>0&&(arr[i].length>50)){
                       str2=`第${Number(i)+1}行已超出50字数限制;`;
                       break;
                    }
                  }
                return this.isams?str1:str1+str2+(arr.length>9?'已超出9行限制;':'')
              },
              ifHasLimit(){
                if(this.dom==1){
                       return this.alertFunc(this.billRSinfo[0].companytitle_fhr_mawb)||this.alertFunc(this.billRSinfo[0].address_fhr_mawb)||this.alertFunc(this.billRSinfo[1].companytitle_shr_mawb)||this.alertFunc(this.billRSinfo[1].address_shr_mawb)
                }else{
                       return this.alertFunc(this.billRSinfo[0].companytitle_fhr_hawb)||this.alertFunc(this.billRSinfo[0].address_fhr_hawb)||this.alertFunc(this.billRSinfo[1].companytitle_shr_hawb)||this.alertFunc(this.billRSinfo[1].address_shr_hawb)
                }
              }
        },
        computed: {
            companytitleFhr(){
              return this.dom==1?this.billRSinfo[0].companytitle_fhr_mawb:this.billRSinfo[0].companytitle_fhr_hawb
            }
            ,addressFhr(){
              return this.dom==1?this.billRSinfo[0].address_fhr_mawb:this.billRSinfo[0].address_fhr_hawb
            },
            companytitleShr(){
             return this.dom==1?this.billRSinfo[1].companytitle_shr_mawb:this.billRSinfo[1].companytitle_shr_hawb
            },
             addressShr(){
             return this.dom==1?this.billRSinfo[1].address_shr_mawb:this.billRSinfo[1].address_shr_hawb
            }
        },
        created(){
          /*  this.$watch(
             function(){
              return  this.billRSinfo[0].address_fhr_hawb
             },
             function(val){
               if(this.billRSinfo[0]){
                 if(this.billRSinfo[0].address_fhr_hawb){
                    if(this.billRSinfo[0].address_fhr_hawb.split('\n').length>10){
                            this.$message.error('最多只能输入9行');return
                    }
                 }
               }
             }
           )
                 this.$watch(
             function(){
              return  this.billRSinfo[1].address_shr_hawb
             },
             function(val){
               if(this.billRSinfo[1]){
              if(this.billRSinfo[1].address_shr_hawb){
                  if(this.billRSinfo[1].address_shr_hawb.split('\n').length>10){
                            this.$message.error('最多只能输入9行');return
                    }
              }

               }


             }
           ) */

        }
    }


</script>
<style scoped lang="less">
.clearafter:after{content:"";display:block;clear:both;}

.hawb .el-table td, .hawb .el-table th{padding:6px 0;}
.hawb{
  padding:15px;
  border-bottom:1px solid #e8e8e8
}
.pagetype2{
  display: flex;
  border:1px solid #e8e8e8;
}

</style>
