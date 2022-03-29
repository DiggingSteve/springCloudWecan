<template>
  <div>
    <div class="fdinformation fdinformationOper">
      <!-- {{dom}} -->
      <!-- {{pagetype}} -->
      <!-- {{itemdata}} -->
      <!-- {{mawbinfo}} -->
      <!-- {{hawbdata}} -->
      <!-- {{hawbdataBackups}} -->
      <div
        class="detail hawbinfo"
        v-if="pagetype!=3"
      >
        <div class="detail-title">
          <p>报关单基本信息</p>
          <el-button
            type="primary"
            @click="confirmHawb"
            v-show="!disabledStatus"
          >{{changeStatus? '取消确认':'确认'}}</el-button>
        </div>
        <div
          class="detail-c"
          style="max-width:1300px"
          :class="{paneDisabled:(pagetype==1&&hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2)||(pagetype==1&&dom==1),
            'disabled': changeStatus
          }"
        >
          <div style="padding:12px">
            <newFormCmpt
              :view-data.sync="hawbViewData"
              :model-data.sync="hawbdata"
              :pagetype="2"
            >

            </newFormCmpt>

          </div>
        </div>
      </div>

      <div
        class="detail basic-information"
        style="margin-top:30px;margin-bottom:20px"
        v-if="pagetype!=3"
      >
        <div class="detail-title">
          <p>收发货人信息</p>
        </div>
        <div
          class="detail-c"
          style="max-width:1300px;padding:20px"
          :class="{paneDisabled:pagetype==1&&hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2,
            'disabled': changeStatus
          }"
        >
          <revSedHawb
            :dzinfo="hawbdata"
            ref="makeBillRevSed"
            :detailType="pagetype==2?'海关':''"
            :needLimit="needLimit"
          >
          </revSedHawb>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import makingBill from "./makingBill";
import revSedHawb from "../templates/revSedHawb";

import {
    computedWeight,
    formatDate
} from "../../api/localStorage.js";

export default {
    components: {
        makingBill,
        revSedHawb
    },
    props: {
        itemdata: Object,
        mawbinfo: Object,
        pagetype: {
            type: [String, Number],
            default: 1 //总分单确认 2 海关联系单
        },
        needLimit: {
            //是否需要判断必填，总分单确认里面需要动态判断是否必填
            type: Boolean,
            default: true
        },
        dom: {
            type: [String, Number],
            default: 2 //1单号2单证
        },
        ifFromMawbaddput: { //是否是嵌入综合查询页面，如果是，需要提交状态
            type: Boolean,
            default: false
        },
        fromPage: String,

        // 海关联系单禁用状态
      disabledStatus: {
        type: Boolean,
        default: false,
      }
    },
    data() {
        return {
            hawbViewData: {
                hawb: {
                    title: "分运单号：",
                    type: 1,
                    disabled: true,
                    hidden: true
                },
                pono: {
                    title: "报关单号：",
                    type: 1,
                    disabled: true
                },
                sfg: {
                    title: "始发港：",
                    type: 1,
                    disabled: true
                },
                mdg: {
                    title: "目的港：",
                    type: 1,
                    disabled: true
                },
                piece: {
                    title: "件数：",
                    type: 1,
                    disabled: true
                },
                weight: {
                    title: "重量：",
                    type: 1,
                    disabled: true
                },
                bglx: {
                    title: "报关类型：",
                    type: 4,
                    groupid: 19,
                    disabled: true
                },
                lds: {
                    title: "连单数：",
                    type: 1,
                    disabled: true
                },
                bggys: {
                    title: "报关供应商：",
                    type: 20,
                    pagetype: 3,
                    disabled: true
                },
                chinesepm: {
                    title: "中文品名：",
                    type: 17,
                    itemStyle: {
                        width: "560px"
                    },
                    required: true
                }
            },
            hawbdata: {
                companytitle_fhr_hawb: '',
                address_fhr_hawb: '',
                companycode_fhr_hawb: '',
                state_fhr_hawb: '',
                city_fhr_hawb: '',
                postcode_fhr_hawb: '',
                lxr_fhr_hawb: '',
                phone_fhr_hawb: '',
                fax_fhr_hawb: '',
                email_fhr_hawb: '',
                companytitle_shr_hawb: '',
                address_shr_hawb: '',
                tcompanycode_shr_hawb: '',
                state_shr_hawb: '',
                city_shr_hawb: '',
                postcode_shr_hawb: '',
                lxr_shr_hawb: '',
                phone_shr_hawb: '',
                fax_shr_hawb: '',
                email_shr_hawb: '',
                taxcode_fhr_hawb: '',
                taxcode_shr_hawb: ''
            },
            hawbdataBackups: {}, //数据备份
            coverMawbinfo: {},
            billShow: false,
            changeStatus: this.disabledStatus,
        };
    },
    created() {

        this.getHawbDetail();

    },

    watch: {
        hawbdata: {
            handler(val) {
                val.ifHasLimit =
                    this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit();
                this.$emit("update:allHawbInfo", val);
            },
            immediate: true,
            deep: true
        },
        mawbinfo: {
            handler(val) {
                this.sethawbData();
            },
            immediate: true,
            deep: true
        },
        changeStatus: {
            handler(val) {
              this.$emit('changeStatus', val)
            },
            immediate: true,
        },
         // 回显海关联系单数据      
        itemdata() {
          if (this.disabledStatus) {
            this.getHawbDetail();
          }
        }
    },
    computed: {},
    methods: {
        /**
         * @desc 校验分单
         */
        confirmHawb() {
            const self = this;

            if(this.changeStatus) {
                this.changeStatus = false;
            } else {
                let taxcodeReg = /^[9]{4}[\+]{1}[0-9a-zA-Z]{8,50}/; //信用代码验证正则

            function changeStatus(status) {
                self.changeStatus = status
            }
            
            let hawb = {
                ybpiece: "件数",
                ybweight: "重量",
                chinesepm: "中文品名",
                companytitle_fhr_hawb: "发货人的抬头",
                address_fhr_hawb: "发货人的地址",
                companycode_fhr_hawb: "发货人的国家二字码",
                //  lxr_fhr_hawb:'发货人的联系人',
                phone_fhr_hawb: "发货人的联系电话",
                taxcode_fhr_hawb: "发货人的信用代码",
                companytitle_shr_hawb: "收货人的抬头",
                address_shr_hawb: "收货人的地址",
                companycode_shr_hawb: "收货人的国家二字码",
                phone_shr_hawb: "收货人的联系电话",
                //  lxr_shr_hawb:'收货人的联系人',
                taxcode_shr_hawb: "收货人的信用代码"
            };
            //let taxcodeReg=/^(?=.*[\+])(?=.*[0-9])[0-9a-zA-Z\+]{8,50}/   //信用代码验证正则
            let arr1 = Object.keys(hawb);

            let obj = this.hawbdata;

            for (let i in arr1) {
                let field = arr1[i];
                let title = hawb[arr1[i]];
                if (!obj[field]) {
                    changeStatus(false)
                    return this.$message.error("请填写报关单" + obj.hawb + "的" + title);
                } else {
                    if (obj.hawb.length > 12) {
                    changeStatus(false)
                    return this.$message.error("报关单" + obj.hawb + "分单号不能超出12位！");
                    }
                    if (obj.chinesepm.length > 256) {
                    changeStatus(false)
                    return this.$message.error("报关单" + obj.hawb + "中文品名的长度不能超出256字符！");
                    }
                    if (obj.ifHasLimit) {
                    changeStatus(false)
                    return this.$message.error("报关单" + obj.hawb + "收发货人信息超出字符限制！");
                    }
                    /*    if(obj.companytitle_fhr_hawb.length>35||obj.companytitle_shr_hawb.length>35){
                                    return this.$message.error('分单'+obj.hawb+'收发货人的抬头不能超过35位！');
                                    }
                                if(obj.address_fhr_hawb.length>70||obj.address_shr_hawb.length>70||obj.companytitle_fhr_hawb.length>70||obj.companytitle_shr_hawb.length>70){
                                    return this.$message.error('分单'+obj.hawb+'收发货人的地址不能超过70位！');
                                    } */

                    if (
                    obj.companycode_fhr_hawb.length != 2 ||
                    obj.companycode_shr_hawb.length != 2
                    ) {
                    changeStatus(false)
                    return this.$message.error("报关单" + obj.hawb + "收发货人的国家二字码必须是两位数！");
                    }

                    if (obj.lxr_fhr_hawb.length > 30 || obj.lxr_shr_hawb.length > 30) {
                        changeStatus(false)
                        return this.$message.error("报关单" + obj.hawb + "收发货人的联系人不能超过30位！");
                    }
                    if (
                        !/^[0-9 -]+$/.test(obj.phone_shr_hawb) ||
                        !/^[0-9 -]+$/.test(obj.phone_fhr_hawb)
                        ) {
                            changeStatus(false)
                        return this.$message.error("报关单" + obj.hawb + "收发货人的联系电话格式不正确！");
                    }
                    if (
                    !taxcodeReg.test(obj.taxcode_shr_hawb) ||
                    !taxcodeReg.test(obj.taxcode_fhr_hawb)
                    ) {
                        changeStatus(false)
                    return this.$message.error(
                        "报关单" +
                        obj.hawb +
                        "收发货人的信用代码格式不正确，" +
                        "必须是'9999+'加数字字母组合,至少10位！"
                        );
                    }

                    changeStatus(true)
                    /*   if (
                        this.hawbTableData.filter(i => i.guid == obj.guid)[0].declList
                        .length == 0
                    ) {
                        return this.$message.error("分单" + obj.hawb + "无报关单！");
                    } */
                }
            }
            }
            
        },

        getHawbDetail() {
            //获取分单详细

            //  console.log(results)
            if (this.changeStatus) {
              this.hawbdata = Object.assign({}, this.hawbdata, this.itemdata)
            } else {
              this.hawbdata = Object.assign({}, this.itemdata, this.hawbdata)
            }
            this.hawbdata.ybpiece = this.itemdata.piece
            this.hawbdata.ybweight = this.itemdata.weight
            this.hawbdata.sfg = this.itemdata.sfg
            this.hawbdata.mdg = this.itemdata.mdg
            if (this.changeStatus) {
              this.hawbdataBackups = JSON.parse(JSON.stringify(this.hawbdata));
            }
            this.sethawbData();

        },
        sethawbData() {

            if (this.pagetype == 2) {
                let arr = [
                    'companytitle_fhr_hawb', 'address_fhr_hawb', 'companycode_fhr_hawb', 'state_fhr_hawb', 'city_fhr_hawb', 'postcode_fhr_hawb', 'lxr_fhr_hawb', 'phone_fhr_hawb', 'fax_fhr_hawb', 'email_fhr_hawb', 'taxcode_fhr_hawb',
                    'companytitle_shr_hawb', 'address_shr_hawb', 'companycode_shr_hawb', 'state_shr_hawb', 'city_shr_hawb', 'postcode_shr_hawb', 'lxr_shr_hawb', 'phone_shr_hawb', 'fax_shr_hawb', 'email_shr_hawb', 'taxcode_shr_hawb',
                ]
                arr.forEach(i => {
                    this.hawbdata[i] = this.hawbdataBackups[i] || this.mawbinfo[i.replace('_hawb', '_mawb')]
                })
            }
            this.hawbdata.area = this.hawbdataBackups.area = this.mawbinfo.area;
            this.hawbdata.gid = this.hawbdataBackups.gid = this.mawbinfo.gid;
            this.hawbdata.chinesepm = this.hawbdataBackups.chinesepm || this.mawbinfo.chinesepm;
        },

    }
};
</script>

<style lang="less" scoped>
.paneDisabled {
  cursor: not-allowed;

  > div {
    pointer-events: none;
  }

  /deep/ div {
    pointer-events: none;
  }
}

.fdinformation {
  .detail {
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
  }

  .detailTitle {
    font-size: 14px;
    color: #333;
  }

  .detail-title {
    display: flex;
    align-items: center;
    height: 32px;
    text-indent: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #0f5a8c;
    background: #f8f8f8;
    border-bottom: 1px solid #e8e8e8;
    justify-content: space-between;
    padding-right: 5px;
  }

  .hawbinfo {
    position: relative;

    .service-edit-btn {
      margin-left: 5px;
      float: right;
      height: 28px;
      padding: 0 15px;
      color: #0f5a8c;
    }

    .service-edit-c {
      position: absolute;
      overflow: hidden;
      top: 34px;
      left: -1px;
      box-sizing: content-box;
      width: 100%;
      z-index: 1;
      margin: 0 !important;
      background: #fff;
      border: 1px solid #e8e8e8;
      box-shadow: 0 10px 20px -10px;
      transition: height 0.5s;
      height: 0;

      &.show {
        height: 218px;
      }
    }
  }

  /deep/ .service {
    margin: 8px 200px 10px 60px;

    .serviceTitle {
      display: inline-block;
      width: 150px;
      margin-left: 20px;
      text-align: left;

      ~ .checkbox {
        float: left;
        width: 14px;
        height: 14px;
      }
    }

    .oprequest,
    .oprequest p {
      position: relative;
      display: inline-block;
    }

    .oprequest .oprequest-text {
      position: absolute;
      top: 0;
      left: 100px;
      width: 200px;
      height: 70px;
    }

    .operating {
      width: 145px;
      height: 28px;
      margin-bottom: 10px;

      span {
        position: relative;
        font-size: 14px;
        font-weight: bolder;
        color: #0f5a8c;

        &::after {
          content: " ";
          display: block;
          position: absolute;
          top: 7px;
          right: -15px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8c8c8;
        }
      }
    }
  }

  .content-c {
    margin: 16px 20px 15px;

    > div {
      margin-bottom: 20px;
    }

    span {
      display: inline-block;
      min-width: 90px;
      margin-right: 5px;
      text-align: right;
    }

    b {
      display: inline-block;
      width: 110px;
      margin-right: 20px;

      + label {
        min-width: 60px;
      }
    }

    .el-input {
      width: 65%;
    }

    .el-textarea {
      width: 500px;
      vertical-align: top;
    }
  }

  .mdgserviceTitle,
  .sfgserviceTitle {
    margin-left: 6px;
    width: 145px;
    height: 28px;
    font-size: 14px;
    color: #333;
    font-weight: bolder;
    margin-bottom: 10px;
  }

  /deep/ .mdgService .detail:last-child {
    margin-bottom: 0;
  }

  .sfgCarSv /deep/ .detail,
  .sfgincargo .detail {
    margin: 0;
    border: 0;
  }
}

.servicePanel {
  margin-bottom: 25px;

  strong {
    font-size: 16px;
    color: #0f5a8c;
  }

  small {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
