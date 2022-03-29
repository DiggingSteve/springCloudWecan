<template>
<div class="LyOrderDetail">

<div class="content" >
    <div class="detail">
<!-- {{thrAddressData}} -->
<!-- {{inputModelData}} -->
  <!-- <storeComp
                :guid="-1"
                :storeList.sync="inputModelData[id]"
                :piece="inputModelData.piece"
                :weight="inputModelData.weight"
                :volume="inputModelData.volume"
                @success="successStore"
                :type="1">
              </storeComp> -->

        <div class="sfd">
          <div class="header">
            <div class="title">货物提货地</div>
            <div class="radio">
              <el-radio v-model="sfdtabs" label="客户地址">客户地址</el-radio>
              <el-radio v-model="sfdtabs" label="机场货站">机场货站</el-radio>
              <el-radio v-model="sfdtabs" label="唯凯仓库">唯凯仓库</el-radio>
            </div>
          </div>
          <div class="content">
            <div class="khdz" v-show="sfdtabs == '客户地址'" v-enterfocus>

              <addressCompt
                ref="thraddress"
                :addressData.sync="thrAddressData"
                :gid="inputModelData.gid"
                addresstype="1">
              </addressCompt>

            </div>
            <div class="jchz" v-show="sfdtabs == '机场货站'">


              <div>
                <span>港口：</span>
                <pageSelect :pagetype="6" :modelval.sync="inputModelData.port_thr_mdg" class="input-required" style="width: 186px;display:inline-block;"></pageSelect>
              </div>

              <div>
                <span>请选择货站：</span>
                <el-select v-model="inputModelData.terminal_thr_mdg" class="input-required" clearable>
                  <el-option
                    v-for="(option, index) in cargo_station_option"
                    v-if="option.sfg == inputModelData.port_thr_mdg"
                    :key="index"
                    :value="option.cname">
                  </el-option>
                </el-select>
              </div>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="inputModelData.lxr_thr_mdg"  placeholder="姓名" clearable></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="inputModelData.phone_thr_mdg"  placeholder="电话" clearable></el-input>
                </el-col>
              </el-row>
            </div>

            <div class="wecanck" v-show="sfdtabs == '唯凯仓库'">


              <el-row>
                <el-col :span="6">
                  <span>出库地区：</span>
                  <el-select v-model="inputModelData.address_thrstorearea_mdg" clearable>
                    <el-option v-for="(area, index) in areaArr" :value="area" :label="area" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <span>出库仓库：</span>
                  <el-select v-model="inputModelData.store_thr_mdg" clearable>
                    <el-option v-for="(store, index) in storeArr" :value="store" :label="store" :key="index"></el-option>
                  </el-select>
                </el-col>

              </el-row>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="inputModelData.lxr_thr_mdg"  placeholder="姓名" clearable></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="inputModelData.phone_thr_mdg"  placeholder="电话" clearable></el-input>
                </el-col>
              </el-row>
<!--    <storeComp
                :guid="-1"
                :storeList.sync="inputModelData[id]"
                :piece="inputModelData.piece"
                :weight="inputModelData.weight"
                :volume="inputModelData.volume"
                @success="successStore"
                :type="1">
              </storeComp> -->

            </div>
          </div>
        </div>
        <div class="mdd">
          <div class="header">
            <div class="title">货物送货地</div>
            <div class="radio">
              <el-radio v-model="mddtabs" label="客户地址">客户地址</el-radio>
              <el-radio v-model="mddtabs" label="机场货站">机场货站</el-radio>
              <el-radio v-model="mddtabs" label="唯凯仓库">唯凯仓库</el-radio>
            </div>
          </div>
          <div class="content">
            <div class="khdz" v-show="mddtabs == '客户地址'" v-enterfocus>

              <addressCompt
                ref="shraddress"
                :addressData.sync="shrAddressData"
                :gid="inputModelData.gid"
                addresstype="2">
              </addressCompt>

            </div>
            <div class="jchz" v-show="mddtabs == '机场货站'">

              <div>
                <span>港口：</span>
                <pageSelect :pagetype="6" :modelval.sync="inputModelData.port_shr_mdg" class="input-required" style="width: 186px;display:inline-block;"></pageSelect>
              </div>

              <div>
                <span>请选择货站：</span>
                <el-select v-model="inputModelData.terminal_shr_mdg" class="input-required" clearable>
                  <el-option
                    v-for="(option, index) in cargo_station_option"
                    v-if="option.sfg == inputModelData.port_shr_mdg"
                    :key="index"
                    :value="option.cname">
                  </el-option>
                </el-select>
              </div>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="inputModelData.lxr_shr_mdg"  placeholder="姓名" clearable></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="inputModelData.phone_shr_mdg"  placeholder="电话" clearable></el-input>
                </el-col>
              </el-row>
            </div>

            <div class="wecanck" v-show="mddtabs == '唯凯仓库'">


              <el-row>
                <el-col :span="6">
                  <span>入库地区：</span>
                  <el-select v-model="inputModelData.address_shrstorearea_mdg">
                    <el-option v-for="(area, index) in areaArr" :value="area" :label="area" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <span>入库仓库：</span>
                  <el-select v-model="inputModelData.store_shr_mdg">
                    <el-option v-for="(store, index) in storeArr2" :value="store" :label="store" :key="index"></el-option>
                  </el-select>
                </el-col>
              </el-row>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="inputModelData.lxr_shr_mdg"  placeholder="姓名" clearable></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="inputModelData.phone_shr_mdg"  placeholder="电话" clearable></el-input>
                </el-col>
              </el-row>
    <!--    <storeComp
                :guid="-1"
                :storeList.sync="inputModelData[id]"
                :piece="inputModelData.piece"
                :weight="inputModelData.weight"
                :volume="inputModelData.volume"
                :type="2"
                @success="successStore"
                v-show="sfdtabs != '唯凯仓库'">
              </storeComp> -->

            </div>
          </div>
        </div>
        </div>
        </div>
      </div>




</template>

<script>
import storeComp from './storeComp'
import addressCompt from '../templates/addressCompt'

import { getChangeRate,computedWeight } from '../../api/localStorage.js'

export default {
  props: {
    inputModelData:Object,//项目
    pagetype:{
      type: [Number,String],
      default:1//1新增页面 2修改页面
    },
    id:{
      type:String,
      default:'ybTransstoreListMdg'
    }
  },
  components: {
     storeComp, addressCompt,
  },

  data () {
    return {
      store_list_option: {},
      storeList: [],
      cargo_station_option :[],
      address_type:['客户地址','机场货站','唯凯仓库']

    }
  },
  computed: {
     sfdtabs:{
            get(){
                   return this.address_type[this.inputModelData.address_thrtype_mdg-1]
            },
            set(val){
                   this.inputModelData.address_thrtype_mdg=this.address_type.indexOf(val) + 1
            }
     },
     mddtabs:{
            get(){
                   return this.address_type[this.inputModelData.address_shrtype_mdg-1]
            },
            set(val){
                    this.inputModelData.address_shrtype_mdg=this.address_type.indexOf(val) + 1
            }
     },
    thrAddressData: {
      get () {
        return {
          addressname:this.inputModelData.company_thr_mdg,
          address: this.inputModelData.address_thr_mdg,
          linkman: this.inputModelData.lxr_thr_mdg,
          phone: this.inputModelData.phone_thr_mdg,
          addressjson: this.inputModelData.address_thrjson_mdg
        }
      },
      set (value) {
        this.inputModelData.company_thr_mdg=value.addressname||"",
        this.inputModelData.address_thr_mdg = value.address||""
        this.inputModelData.lxr_thr_mdg = value.linkman||""
        this.inputModelData.phone_thr_mdg = value.phone||""
        this.inputModelData.address_thrjson_mdg = value.addressjson||""
      }
    },
    shrAddressData: {
      get () {
        return {
          addressname:this.inputModelData.company_shr_mdg,
          address: this.inputModelData.address_shr_mdg,
          linkman: this.inputModelData.lxr_shr_mdg,
          phone: this.inputModelData.phone_shr_mdg,
          addressjson: this.inputModelData.address_shrjson_mdg
        }
      },
      set (value) {
        this.inputModelData.company_shr_mdg=value.addressname,
        this.inputModelData.address_shr_mdg = value.address
        this.inputModelData.lxr_shr_mdg = value.linkman
        this.inputModelData.phone_shr_mdg = value.phone
        this.inputModelData.address_shrjson_mdg = value.addressjson
      }
    }
        ,areaArr(){
    let cargoData=JSON.parse(localStorage.cargoData);
     let arr=[]
    cargoData.map(item=>{
      if(!arr.includes(item.area)){
              arr.push(item.area)
      }
    })
    return arr
    },
      storeArr(){
    let cargoData=JSON.parse(localStorage.cargoData);
             let arr=[]
    cargoData.map(item=>{
      if(item.area==this.inputModelData.address_thrstorearea_mdg){
              arr.push(item.storename)
      }
    })
    return arr
    },
    storeArr2(){
    let cargoData=JSON.parse(localStorage.cargoData);
             let arr=[]
    cargoData.map(item=>{
      if(item.area==this.inputModelData.address_shrstorearea_mdg){
              arr.push(item.storename)
      }
    })
    return arr
    },
  },
  watch: {

  },
  created () {
    this.cargo_station_option = JSON.parse(localStorage.jjd)


  },
  methods: {
  successStore(){
      this.$emit('success',true)
    },

    saveAddress () {
      //新增保存里面的地址
           if (this.inputModelData.address_thrtype_mdg == 1) {
            this.$refs.shraddress.collectAddress()
          }
          if (this.inputModelData.adaddress_shrtype_mdg == 1) {
            this.$refs.thraddress.collectAddress()
          }
    },
    check_data () {

// if(!this.inputModelData.lxr_thr_mdg || !this.inputModelData.phone_thr_mdg||!this.inputModelData.lxr_shr_mdg || !this.inputModelData.phone_shr_mdg){
//           this.$message.error('请填写送货服务的完整信息')
//           return false
// }
      if (this.sfdtabs == '客户地址') {
         if ( !this.inputModelData.address_thr_mdg ) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        }

        if (!this.$refs.thraddress.checkInputRequired()) {
          return this.$message.error('请填写送货服务的完整信息')
        }

      } else if (this.sfdtabs == '机场货站') {
        if (!this.inputModelData.port_thr_mdg||!this.inputModelData.terminal_thr_mdg) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        }
      } else if (this.sfdtabs == '唯凯仓库') {
    /*     if ( this.inputModelData[this.id].length == 0) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        } */
      }



      if (this.mddtabs == '客户地址') {
        if (!this.inputModelData.address_shr_mdg ) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        }
        if (!this.$refs.shraddress.checkInputRequired()) {
          return this.$message.error('请填写送货服务的完整信息')
        }
      } else if (this.mddtabs == '机场货站') {
        if (!this.inputModelData.terminal_shr) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        }
      } else if (this.mddtabs == '唯凯仓库') {
     /*    if (this.inputModelData[this.id].length == 0) {
          this.$message.error('请填写送货服务的完整信息')
          return false
        } */
      }

      return true
    }


  }
}
</script>

<style lang="less" scoped>
.LyOrderDetail {
  @nodeheight: 80px;
  .node-c {
    height: @nodeheight;
    margin-bottom: 16px;
    transition: .4s height;
    overflow: hidden;
    .node {
      height: @nodeheight;
      border: 1px solid #ccc;
      position: relative;
      .right-text {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .content {
        margin-top: 14px;
        overflow: hidden;
        .item {
          float: left;
          position: relative;
          margin: 0 20px;
          width: 200px;
          height: 55px;
          i {
            position: absolute;
            top: 14px;
            color: #bcbcbc;
            &::before {
              font-size: 20px;
            }
          }
          .node-exist {
            color: #3366ff;
          }
          div {
            margin-left: 30px;
            span {
              line-height: 24px;
              color: #868686;
            }
            .node-man {
              margin-left: 10px;
              width: 100px;
              /deep/ .el-input__inner {
                height: 24px;
                padding: 3px 3px;
              }
            }
          }
          .el-date-editor {
            margin-left: 0px;
            width: 150px;
            /deep/ .el-input__inner {
              padding: 0 10px;
            }
            /deep/ .el-input__prefix {
              display: none;
            }
          }
        }
        .bg {
          margin-left: 40px;
          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #3366ff;
            border-radius: 50%;
          }
          div {
            p {
              line-height: 48px;
            }
          }
        }
      }
    }
  }
  > .title {
    margin-bottom: 10px;
    p {
      display: inline-block;
      margin-right: 40px;
      font-size: 14px;
    }
    span {
      color: red;
    }
  }

  .detail {
    margin-bottom: 20px;
   // border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      span {
        cursor: pointer;
        color: #8f8f8f;
      }
      .active {
        color: #0f5a8c;
      }
    }
    .detail-c {
      padding: 20px;
      .basic-form {
        .el-row {
          width: 1120px;
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 26px;
          }
          &:first-child {
            overflow: hidden;
            > div {
              float: left;
            }
          }
          .el-col {
            span {
              display: inline-block;
              text-align: right;
              width: 106px;
            }
            .el-input {
              width: 170px;
            }
            .pageSelect {
              display: inline-block;
              width: 170px;
            }
            .jzt .el-input {
              width: 48px;
              /deep/ .el-input__inner {
                padding: 0 5px;
              }
            }
          }
        }
        .remark {
          span {
            width: 105px;
            vertical-align: top;
          }
          .el-textarea {
            width: 450px;
          }
        }
      }
    }
    .sfd, .mdd, .charge, .payment {
      margin: 10px 0;
      .contacts {
        float: left;
        margin-right: 5px;
        &.block {
          float: none;
          + .el-row {
            margin-top: 10px;
          }
        }
      }
      .header {
        position: relative;
        .title, .title + div{
          display: inline-block;
          height: 35px;
          line-height: 35px;
          padding-left: 10px;
        }
        .title {
          position: relative;
          color: white;
          margin-right: 30px;
          &:after {
            position: absolute;
            top: 0;
            right: -40px;
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-right: 40px solid transparent;
          }
        }
        .header-right {
          p {
            display: inline-block;
            margin-right: 50px;
          }
          .right-btn {
            position: absolute;
            top: -5px;
            right: 0;
          }
        }
      }
      .content {
        padding: 20px;
        .khdz {
          .el-row {
            margin-bottom: 10px;
            .el-col {
              margin-right: 20px;
            }
          }
        }
        .jchz {
          > div {
            margin-bottom: 10px;
          }
          span, p {
            display: inline-block;
            width: 80px;
            height: 28px;
            line-height: 28px;
          }
        }
        .wecanck {
          > div {
            margin-bottom: 10px;
            span {
              display: inline-block;
              width: 100px;
              height: 28px;
              line-height: 28px;
            }
          }
          .contacts {
            width: 100px;
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
    .sfd {
      @sfdcolor: #09c;
      .title {
        background: @sfdcolor;
        &:after {
          border-bottom: 35px solid @sfdcolor;
        }
      }
      .content {
        border: 1px solid @sfdcolor;
      }
    }
    .mdd {
      @mddcolor: #f89828;
      .title {
        background: @mddcolor;
        &:after {
          border-bottom: 35px solid @mddcolor;
        }
      }
      .content {
        border: 1px solid @mddcolor;
      }
    }
    .charge {
      @chargecolor: #00cc00;
      margin-bottom: 30px;
      .title {
        background: @chargecolor;
        &:after {
          border-bottom: 35px solid @chargecolor;
        }
      }
      .header-right {
        p:first-child {
          color: @chargecolor;
          + p {
            color: #FF9900;
          }
        }
      }
      .content {
        border: 1px solid @chargecolor;
      }
    }
    .payment {
      @paymentcolor: #ff3300;
      .title {
        background: @paymentcolor;
        &:after {
          border-bottom: 35px solid @paymentcolor;
        }
      }
      .header-right {
        p:first-child {
          color: @paymentcolor;
        }
      }
      .content {
        border: 1px solid @paymentcolor;
      }
    }
  }
  .node-status {
    .el-row {
      margin-bottom: 10px;
      &:first-child {
        text-align: center;
      }
      .el-col {
        margin-right: 30px;
      }
      .el-date-editor {
        width: 100%;
      }
    }
  }

  .distribution {
    div {
      margin-bottom: 10px;
      > span:first-child {
        float: left;
        width: 110px;
        text-align: right;
        + div {
          margin-left: 120px;
        }
      }
    }
    .currency {
      > span + div {
        .el-radio {
          width: 125px;
        }
        .el-radio:nth-child(3) {
          margin-left: 0;
        }
      }
    }
    .price {
      .el-input {
        margin-right: 10px;
        width: 150px;
      }
    }
    .fpbl {
      .el-input {
        width: 60px;
        margin: 0 10px;
      }
    }
    .btn-c {
      margin-top: 40px;
      text-align: center;
    }
  }

  .footer {
    margin: 20px 0;
    .btn-c {
      margin: 20px 0;
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
    }
  }

  &.iscancel {
    .content {
      .detail:first-child {
        cursor: not-allowed;
        .basicInformation {
          pointer-events: none;
          /deep/ .el-input__suffix-inner {
            pointer-events: none;
          }
        }
      }
    }
    .isdel {
      cursor: not-allowed;
      .feeInformation {
        pointer-events: none !important;
        div {
          pointer-events: none !important;
        }
        /deep/ .el-input__suffix-inner {
          pointer-events: none;
        }
      }
      .right-btn {
        pointer-events: none;
      }
    }
  }
}
</style>
