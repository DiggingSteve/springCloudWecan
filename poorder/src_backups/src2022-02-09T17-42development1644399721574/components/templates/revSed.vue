<template>
  <div class="clearafter">
    <!-- {{dzinfo}} -->
    <div class="hawb">
      <div style="position:relative">
        <div class="itemTitle" style="margin-bottom:5px;;font-weight:600" v-if="pagetype==2">Notifier's Name and
          Address*</div>
        <div class="rowright" v-if="pagetype==2"
          style="width:180px;position:absolute;right:0;top:16px;border-left:1px solid #e8e8e8;padding-left:5px;margin-top:10px;;">
          <div class="itemTitle">Notifier's Account Number</div>
        </div>
        <recsedFieldTzr :mawbinfo="dzinfo" :model="dzinfo[getField('code_tzr_mawb')]" :dom="dom" @rsdata="rsdata" :area="dzinfo.area"
          :gid="dzinfo.gid"></recsedFieldTzr>

      </div>
      <div style="width:100%;margin-top:15px">
        <p v-if="lengthAlert&&alertFunc(dzinfo[getField('companytitle_tzr_mawb')])" style="color:red">
          {{alertFunc(dzinfo.companytitle_tzr_mawb)}}</p>
        <el-popover placement="bottom" trigger="focus" :disabled="!lengthAlert||!dzinfo[getField('companytitle_tzr_mawb')]">
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo[getField('companytitle_tzr_mawb')]&&dzinfo[getField('companytitle_tzr_mawb')].split('\n')">
              <template v-for="(b,i) in f">
                <span :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}" v-if="!(f=='\n')">{{b}}</span>
              </template>
              </br>
            </template>
          </div>
          <el-input slot="reference" type="textarea" rows="6" placeholder="抬头" v-model="dzinfo[getField('companytitle_tzr_mawb')]"
            v-verify="'uppercase'"></el-input>
        </el-popover>



      </div>
      <div style="width:100%;margin-top:15px">
        <p v-if="lengthAlert&&alertFunc(dzinfo[getField('address_tzr_mawb')])" style="color:red">
          {{alertFunc(dzinfo[getField('address_tzr_mawb')])}}</p>
        <el-popover placement="bottom" trigger="focus" :disabled="!lengthAlert||!dzinfo[getField('address_tzr_mawb')]">
          <div style="max-width:700px;font-size:12px;">
            <template v-for="(f,n) in dzinfo[getField('address_tzr_mawb')]&&dzinfo[getField('address_tzr_mawb')].split('\n')">
              <template v-for="(b,i) in f">
                <span :style="{color:(i>=(n==0?limitLength:isams?500:50))?'red':''}" v-if="!(f=='\n')">{{b}}</span>
              </template>
              </br>
            </template>

          </div>
          <el-input slot="reference" type="textarea" rows="6" placeholder="地址" v-model="dzinfo[getField('address_tzr_mawb')]"
            v-verify="'uppercase'"></el-input>
        </el-popover>

      </div>

      <div
        style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input placeholder="国家二字码" v-model="dzinfo[getField('companycode_tzr_mawb')]" v-verify="'uppercase'"
            :maxlength="isams?2:''"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="州名" v-model="dzinfo[getField('state_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="城市" v-model="dzinfo[getField('city_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="邮编" v-model="dzinfo[getField('postcode_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
      </div>

      <div
        style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
        <div style="width:23%">
          <el-input placeholder="联系人" v-model="dzinfo[getField('lxr_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="电话" v-model="dzinfo[getField('phone_tzr_mawb')]" v-verify="'phone'"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="传真" v-model="dzinfo[getField('fax_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
        <div style="width:23%">
          <el-input placeholder="Email" v-model="dzinfo[getField('email_tzr_mawb')]" v-verify="'uppercase'"></el-input>
        </div>
      </div>

      <div style="margin-top:15px;">
        <slot name="textCode">
          <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码" v-model="dzinfo[getField('taxcode_tzr_mawb')]"
            v-verify="'creditCode'"></el-input>
        </slot>
      </div>
    </div>



  </div>


</template>



<script>

  import recsedFieldTzr from './recsedFieldTzr'

  export default {
    props: {
      dzinfo: Object,
      dom: { // 1总单 2分单
        type: Number | Boolean,
        default: 1
      },
      pagetype: {//1新增修改页面  2在制单里面用
        type: [Number, String],
        default: 1
      },
      isams: { //ams发送
        type: Boolean,
        default: false
      },
      limitLength: {
        type: [Boolean, Number],
        default: 35
      },
      lengthAlert: {//是否提示字符长度限制,收发货人与地址
        type: Boolean,
        default: true
      },
    },
    components: {
      recsedFieldTzr
    },
    data() {
      return {

      }
    },
    methods: {
      rsdata(data) {

      },
      alertFunc(data) {
        if (!data) return '';
        let arr = data && data.split('\n')
        let limitLength = this.limitLength == 100 ? 150 : this.limitLength
        let str1 = '', str2 = '';
        for (let i in arr) {
          if (i == 0 && (arr[i].length > limitLength)) {
            str1 = `首行已超出${limitLength}字数限制;`
          }
          if (i > 0 && (arr[i].length > 50)) {
            str2 = `第${Number(i) + 1}行已超出50字数限制;`;
            break;
          }
        }
        return this.isams ? str1 : str1 + str2 + (arr.length > 9 ? '已超出9行限制;' : '')
      },
      ifHasLimit() {
        return this.alertFunc(this.dzinfo[this.getField('companytitle_tzr_mawb')]) || this.alertFunc(this.dzinfo[this.getField('address_tzr_mawb')])

      },
      getField(field) {
        return this.dom == 1 ? field : field.replace('_mawb','_hawb')
      }
    },
    computed: {

    },
    created() {
      this.$watch(
        function () {
          return this.dzinfo[this.getField('address_tzr_mawb')]
        },
        function (val) {

          if (this.dzinfo[this.getField('address_tzr_mawb')]) {
            if (this.dzinfo[this.getField('address_tzr_mawb')] && this.dzinfo[this.getField('address_tzr_mawb')].split('\n').length > 9) {
              this.$message.error('最多只能输入9行'); return
            }
          }
        }

      )

    }
  }


</script>
<style scoped lang="less">
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
    border-bottom: 1px solid #e8e8e8
  }

  .pagetype2 {
    display: flex;
    border: 1px solid #e8e8e8;
  }
</style>