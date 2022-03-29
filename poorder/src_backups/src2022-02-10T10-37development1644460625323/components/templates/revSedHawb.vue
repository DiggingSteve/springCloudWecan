<template>
  <div
    class="clearafter"
    style="display:flex"
    :style="{'flex-direction':pagetype==1?'row':'column'}"
  >
    <!-- {{dzinfo}} -->
    <!-- {{ifHasLimit()}} -->
    <div class="hawb">
      <div style="position:relative">
        <div
          style="margin-bottom:5px;;font-weight:600"
          v-if="pagetype==2"
        >Shipper's Name and Address*</div>
        <div
          class="rowright"
          v-if="pagetype==2"
          style="width:190px;position:absolute;right:0;top:16px;border-left:1px solid #e8e8e8;padding-left:5px;margin-top:10px;;"
        >
          <div>Shipper's Account Number</div>
        </div>
        <recsedFieldMawbHawb
          :mawbinfo="dzinfo"
          type=1
          dom=2
          :model="dzinfo.code_fhr_hawb"
          @rsdata="rsdata"
          :area="dzinfo.area"
          :gid="dzinfo.gid"
          :disabled="isOrderConfirm"
        ></recsedFieldMawbHawb>

      </div>
      <div style="width:100%;margin-top:15px">
        <p
          v-if="lengthAlert&&alertFunc(dzinfo.companytitle_fhr_hawb)"
          style="color:red"
        >{{alertFunc(dzinfo.companytitle_fhr_hawb)}}</p>
        <el-popover
          placement="bottom"
          trigger="focus"
          :disabled="!lengthAlert||!dzinfo.companytitle_fhr_hawb"
        >
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo.companytitle_fhr_hawb&&dzinfo.companytitle_fhr_hawb.split('\n')">
              <template v-for="(b,i) in f">
                <span
                  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"
                  v-if="!(f=='\n')"
                >{{b}}</span>
              </template>
              </br>
            </template>
          </div>
          <el-input
            slot="reference"
            type="textarea"
            rows="6"
            placeholder="抬头"
            v-model="dzinfo.companytitle_fhr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm"
          ></el-input>
        </el-popover>

      </div>
      <div style="width:100%;margin-top:15px">
        <p
          v-if="lengthAlert&&alertFunc(dzinfo.address_fhr_hawb)"
          style="color:red"
        >{{alertFunc(dzinfo.address_fhr_hawb)}}</p>
        <el-popover
          placement="bottom"
          trigger="focus"
          :disabled="!lengthAlert||!dzinfo.address_fhr_hawb"
        >
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo.address_fhr_hawb&&dzinfo.address_fhr_hawb.split('\n')">
              <template v-for="(b,i) in f">
                <span
                  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"
                  v-if="!(f=='\n')"
                >{{b}}</span>
              </template>
              </br>
            </template>

          </div>
          <el-input
            slot="reference"
            type="textarea"
            rows="6"
            placeholder="地址"
            v-model="dzinfo.address_fhr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm"
          ></el-input>
        </el-popover>

      </div>

      <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input
            placeholder="国家二字码"
            v-model="dzinfo.companycode_fhr_hawb"
            v-verify="'uppercase'"
            :maxlength="isams?2:''"
            :class="{'input-required':needLimit}"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="州名"
            v-model="dzinfo.state_fhr_hawb"
            v-verify="'uppercase'"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="城市"
            v-model="dzinfo.city_fhr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="邮编"
            v-model="dzinfo.postcode_fhr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit&&detailType!=='海关'}"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
      </div>

      <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input
            placeholder="联系人"
            v-model="dzinfo.lxr_fhr_hawb"
            v-verify="'uppercase'"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="电话"
            v-model="dzinfo.phone_fhr_hawb"
            v-verify="'phone'"
            :class="{'input-required':needLimit&&detailType=='海关'}"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="传真"
            v-model="dzinfo.fax_fhr_hawb"
            v-verify="'uppercase'"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="Email"
            v-model="dzinfo.email_fhr_hawb"
            v-verify="'uppercase'"
             :disabled="isOrderConfirm"
          ></el-input>
        </div>
      </div>

      <div style="margin-top:15px;">
        <!-- <slot name="textCode"></slot> -->
        <el-input
          slot="textCode"
          type="textarea"
          placeholder="信用代码"
          v-model="dzinfo.taxcode_fhr_hawb"
          v-verify="'creditCode'"
          :class="{'input-required':needLimit&&detailType=='海关'}"
           :disabled="isOrderConfirm"
        ></el-input>

      </div>
    </div>

    <div
      class="hawb"
      :style="{'border-top':pagetype==1?'':'1px solid #e8e8e8','border-bottom':pagetype==1?'':'1px solid #e8e8e8'}"
    >
      <div style="position:relative">
        <div
          v-if="pagetype==2"
          style="margin-bottom:5px;;font-weight:600"
        >Consignee's Name and Address*</div>
        <div
          v-if="pagetype==2"
          style="width:190px;position:absolute;right:0;top:16px;border-left:1px solid #e8e8e8;padding-left:5px;margin-top:10px;;"
        >
          <div class="itemTitle">Consignee's Account Number</div>
        </div>
        <recsedFieldMawbHawb
          :mawbinfo="dzinfo"
          type=2
          dom=2
          :model="dzinfo.code_shr_hawb"
          @rsdata="rsdata"
          :area="dzinfo.area"
          :gid="dzinfo.gid"
          :disabled="isOrderConfirm&&disabledAll"
        ></recsedFieldMawbHawb>

      </div>
      <div style="width:100%;margin-top:15px">
        <p
          v-if="lengthAlert&&alertFunc(dzinfo.companytitle_shr_hawb)"
          style="color:red"
        >{{alertFunc(dzinfo.companytitle_shr_hawb)}}</p>
        <el-popover
          placement="bottom"
          trigger="focus"
          :disabled="!lengthAlert||!dzinfo.companytitle_shr_hawb"
        >
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo.companytitle_shr_hawb&&dzinfo.companytitle_shr_hawb.split('\n')">
              <template v-for="(b,i) in f">
                <span
                  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"
                  v-if="!(f=='\n')"
                >{{b}}</span>
              </template>
              </br>
            </template>
          </div>
          <el-input
            slot="reference"
            type="textarea"
            rows="6"
            placeholder="抬头"
            v-model="dzinfo.companytitle_shr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </el-popover>

      </div>
      <div style="width:100%;margin-top:15px">
        <p
          v-if="lengthAlert&&alertFunc(dzinfo.address_shr_hawb)"
          style="color:red"
        >{{alertFunc(dzinfo.address_shr_hawb)}}</p>
        <el-popover
          placement="bottom"
          trigger="focus"
          :disabled="!lengthAlert||!dzinfo.address_shr_hawb"
        >
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo.address_shr_hawb&&dzinfo.address_shr_hawb.split('\n')">
              <template v-for="(b,i) in f">
                <span
                  :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}"
                  v-if="!(f=='\n')"
                >{{b}}</span>
              </template>
              </br>
            </template>

          </div>
          <el-input
            slot="reference"
            type="textarea"
            rows="6"
            placeholder="地址"
            v-model="dzinfo.address_shr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </el-popover>

      </div>

      <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input
            placeholder="国家二字码"
            v-model="dzinfo.companycode_shr_hawb"
            v-verify="'uppercase'"
            :maxlength="isams?2:''"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="州名"
            v-model="dzinfo.state_shr_hawb"
            v-verify="'uppercase'"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="城市"
            v-model="dzinfo.city_shr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="邮编"
            v-model="dzinfo.postcode_shr_hawb"
            v-verify="'uppercase'"
            :class="{'input-required':needLimit&&detailType!=='海关'}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
      </div>

      <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input
            placeholder="联系人"
            v-model="dzinfo.lxr_shr_hawb"
            v-verify="'uppercase'"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="电话"
            v-model="dzinfo.phone_shr_hawb"
            v-verify="'phone'"
            :class="{'input-required':needLimit&&detailType=='海关'}"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="传真"
            v-model="dzinfo.fax_shr_hawb"
            v-verify="'uppercase'"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
        <div style="width:23%">
          <el-input
            placeholder="Email"
            v-model="dzinfo.email_shr_hawb"
            v-verify="'uppercase'"
            :disabled="isOrderConfirm&&disabledAll"
          ></el-input>
        </div>
      </div>

      <div style="margin-top:15px;">
        <!-- <slot name="textCode2"></slot> -->
        <el-input
          slot="textCode"
          type="textarea"
          placeholder="信用代码"
          v-model="dzinfo.taxcode_shr_hawb"
          :class="needLimit&&detailType=='海关'?'input-required':''"
          v-verify="'creditCode'"
          :disabled="isOrderConfirm&&disabledAll"
        ></el-input>

      </div>
    </div>

  </div>

</template>



<script>

import recsedFieldMawbHawb from './recsedFieldMawbHawb'

    export default {
        props:{
          dzinfo:Object,
          isams:{ //ams发送
            type:Boolean,
            default:false
          },
          showTaxcode:{ //是否显示信用代码
            type:Boolean,
            default:true
          },
          limitLength:{
            type:[Boolean,Number],
            default:35
          },
            lengthAlert:{//是否提示字符长度限制,收发货人与地址
            type:Boolean,
            default:true
          },
           pagetype:{//1在基本信息里面用，横向排列 2在制单里面用，竖向排列
            type:[Number,String],
            default:1
          },
          detailType:{//详细页面的类型,‘海关’的时候信用代码必填
             type:String,
             default:""
          },
          needLimit:{//是否需要判断必填，总分单确认里面需要动态判断是否必填
            type:Boolean,
            default:true
          },
           fieldRequired:{//是否需要验证必填字段
            type:Boolean,
            default:false
          },
            isOrderConfirm: { // 是否单证确认，是的话，发货人，收货人信息禁止填写
              type: Boolean,
              default: false,
            },
            disabledAll: { // 收货人信息是否禁用
              type: Boolean,
              default: true,
            }
          },
        components: {
              recsedFieldMawbHawb
        },
        data () {
            return {

            }
        },
        methods: {
              rsdata(data){
               // console.log(data)
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
                   if(this.fieldRequired){
                    let arr=[
                      'companytitle_shr_hawb','address_shr_hawb','city_shr_hawb','postcode_shr_hawb' ,'companycode_shr_hawb',
                      'companytitle_fhr_hawb' ,'address_fhr_hawb' ,'city_fhr_hawb' ,'postcode_fhr_hawb' ,'companycode_fhr_hawb']
                      for(let i in arr){
                          if(!this.dzinfo[arr[i]]){
                            return '分单收发货人有必填字段为空！'
                          }
                        }
                      }else{
                         if(this.alertFunc(this.dzinfo.companytitle_shr_hawb)||this.alertFunc(this.dzinfo.address_shr_hawb)||this.alertFunc(this.dzinfo.companytitle_fhr_hawb)||this.alertFunc(this.dzinfo.address_fhr_hawb)){
                                 return '请检查分单收发货人是否超出字符限制！'
                         }
                      }
              }
        },
        computed: {

        },
        created(){
           this.$watch(
             function(){
              return  this.dzinfo.address_fhr_hawb
             },
             function(val){

                 if(this.dzinfo.address_fhr_hawb){
                    if(this.dzinfo.address_fhr_hawb.split('\n').length>9){
                            this.$message.error('最多只能输入9行');return
                    }
                 }
               }

           )

        }
    }


</script>
<style scoped>
.clearafter:after {
  content: "";
  display: block;
  clear: both;
}

.hawb .el-table td,
.hawb .el-table th {
  padding: 6px 0;
}
.hawb {
  padding: 15px;
  /* border-bottom:1px solid #e8e8e8 */
}
</style>
