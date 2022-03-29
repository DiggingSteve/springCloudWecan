<template>
<div>
    <div class="fdinformation fdinformationOper">
        <!-- {{dom}} -->
        <!-- {{pagetype}} -->
        <!-- {{itemdata}} -->
        <!-- {{mawbinfo}} -->
        <!-- {{hawbdata}} -->
        <!-- {{hawbdataBackups.smallpiece}} -->

        <!-- 分单基本信息 -->
        <div class="detail hawbinfo" v-if="pagetype!=3">
            
            <div class="detail-title">
                <p>分单基本信息<slot name="title"></slot>
                </p>
                <!-- <el-button
            v-if="pagetype==1&&dom==1&&hawbdata.hawbConfirmOverStatus!=1"
            :type="hawbdata.hawbnoconfirmstatus==1?'primary':'danger'"
            style="height:28px;"
            @click="confirmHawbDanhaoFunc"
          >{{hawbdata.hawbnoconfirmstatus==1?'分运单号确认':'取消确认'}}</el-button> -->
                <section>
                   <el-button v-if="pagetype==1&&(dom==2||isOrderConfirm)&&hawbdata.hawbConfirmOverStatus!=1" :type="hawbdata.hawbconfirmstatus==1?'primary':'danger'" style="height:28px;" @click="confirmHawbFunc">{{hawbdata.hawbconfirmstatus==1?'分运单确认':'取消确认'}}</el-button>
                    <el-button v-if="(dom==2||isOrderConfirm)&&hawbdata.hawbConfirmOverStatus==1&&pagetype==1" type="primary" style="height:28px;" @click="dzmodifystatusFunc">{{hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2?'单证待修改':'单证确认'}}</el-button>     
                </section>
                
            </div>
            <div class="detail-c" style="max-width:1300px" :class="{paneDisabled:(pagetype==1&&hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2)||(pagetype==1&&dom==1&&!this.isOrderConfirm)||hawbdata.hawbconfirmstatus!=1}">
                <div style="padding:12px">
                    <newFormCmpt :view-data.sync="hawbViewData" :model-data.sync="hawbdata" :pagetype="2">
                        <template slot="exForm1">
                            <hwxzCompt style="margin-bottom:-14px" :inputModelData="hawbdata" :hidehwxz="true"></hwxzCompt>
                        </template>
                    </newFormCmpt>

                   
                    <!-- <div style="width:600px;margin-top:20px;margin-top:1px;margin-left:40px;">
                        <div class="input-title" style="margin-bottom:10px;margin-left:-14px">分单进仓编号：</div>

                        <commonTable :head="jcnoTableHead" :table-data="hawbdata.ybstoreList" :zi-index="ziIndex" v-if="hawbdata.ybstoreList">
                            <template slot="khjcno" slot-scope="props">
                                <div>
                                    <i class="el-icon-circle-plus-outline pointerAll" @click="openZitable(props.data.index)" style="float:left;"></i>
                                    {{props.data.value}}
                                </div>
                            </template>
                            <template slot="ziTable" v-if="hawbdata.ybstoreList[ziIndex]&&ziIndex!=-1">
                                <commonTable :head="ziTableHead" :table-data="hawbdata.ybstoreList[ziIndex].ybstorevolumeList">
                                    <template slot="size" slot-scope="props">
                                        <div>{{props.data.row.longs}}*{{props.data.row.widths}}*{{props.data.row.heights}}</div>
                                    </template>
                                </commonTable>
                            </template>
                        </commonTable>
                    </div> -->

                    
                </div>
                
            </div>
        </div>
        
        <!-- 分单收发货人信息 -->
        <div class="detail basic-information" style="margin-top:30px;margin-bottom:20px" v-if="pagetype!=3">
            <div class="detail-title">
                <p>分单收发货人信息</p>
            </div>
            <div class="detail-c" style="max-width:1300px;padding:20px" :class="{paneDisabled:pagetype==1&&hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2}">
                <!-- {{hawbdata}} -->

                <revSedHawb :dzinfo="hawbdata" ref="makeBillRevSed" :detailType="pagetype==2?'海关':''" :needLimit="needLimit" :isOrderConfirm="ifDanzhengConfirmUseDisabled" 
                >
                    <!-- <el-input  slot="textCode" v-if="pagetype==2" type="textarea" rows="4" placeholder="信用代码"  v-model="hawbdata.taxcode_fhr_hawb" class="input-required" v-verify="'creditCode'"></el-input>
            <el-input  slot="textCode2" v-if="pagetype==2" type="textarea" rows="4" placeholder="信用代码"  v-model="hawbdata.taxcode_shr_hawb" class="input-required" v-verify="'creditCode'"></el-input>-->
                </revSedHawb>
                <revSed :dzinfo="hawbdata">
                                            <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码" v-model="hawbdata.taxcode_tzr_mawb"
                                                v-verify="'creditCode'"></el-input>
                                        </revSed>
            </div>
        </div>

        <div class="detail" v-if="pagetype!=2" style="margin-bottom:30px" v-show="isOrderConfirm">
            <div class="detail-title">
                <p>分单制作信息</p>
                <span
                    style="color:#999;margin-right:6px;cursor:pointer"
                    @click="billShow=!billShow"
                >
                    {{billShow?'点击折叠':'点击展开'}}
                    <i
                    :class="[!billShow?'el-icon-caret-bottom':'el-icon-caret-top']"
                    style="font-size:18px"
                    ></i>
                </span>
            </div>
            <div class="detail-c" v-if="hawbdata.guid" :class="{paneDisabled:pagetype==1&&hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2}">
                <!-- <el-collapse-transition>
          <div v-show="billShow">-->
                <makingBill 
                :mawbguid="hawbdata.guid" 
                orderdom="分单" 
                @setMawbSmallpiece="$emit('setMawbSmallpiece',true)" 
                :mawbhawbLinkage="pagetype==1||pagetype==4" 
                :mawbinfo="coverMawbinfo" :hawbBillData="hawbdata" ref="hawbMakingbill" :hideSaveBtn="pagetype==1" :billShow.sync="billShow" :fromPage="fromPage" bottomFixed v-if="coverMawbinfo.gid" :needLimit="needLimit" 
                :parentFormdata="hawbdata"
                :isOrderConfirm="isOrderConfirm"
                :active-name="activeName">
                    <!-- <span  v-if="isOrderConfirm">
                <el-button v-if="pagetype==1&&(dom==2||isOrderConfirm)&&hawbdata.hawbConfirmOverStatus!=1" :type="hawbdata.hawbconfirmstatus==1?'primary':'danger'" style="height:28px;" @click="confirmHawbFunc">{{hawbdata.hawbconfirmstatus==1?'分运单确认完成':'取消确认'}}</el-button>
                <el-button v-if="(dom==2||isOrderConfirm)&&hawbdata.hawbConfirmOverStatus==1&&pagetype==1" type="primary" style="height:28px;" @click="dzmodifystatusFunc">{{hawbdata.hawbConfirmOverStatus==1&&hawbdata.dzmodifystatus!=2?'单证待修改':'单证确认'}}</el-button>
            </span> -->
                </makingBill>
                <!-- </div>
          </el-collapse-transition>-->
            </div>
        </div>
    </div>
</div>
</template>

<script>
import makingBill from "./makingBill";
import revSedHawb from "../templates/revSedHawb";
import revSed from "../templates/revSed";

import {
    computedWeight,
    formatDate
} from "../../api/localStorage.js";

export default {
    components: {
        makingBill,
        revSedHawb,
        revSed,
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
         // 是否是单号确认tab
        isOrderConfirm: {
          type: Boolean,
          default: false,
        },
        activeName: { // 当前激活tab
            type: String,
            default: ''
        }
    },
    data() {
        return {
            hawbViewData: {
                fid: {
                    title: "委托客户：",
                    type: 11,
                    required: true,
                    contentStyle: {
                        display: "flex"
                    },
                    itemStyle: {
                        width: "560px"
                    },
                    linkage: "gid",
                    disabled: true
                },
                gid: {
                    title: "项目：",
                    type: 10,
                    required: true,
                    itemStyle: {
                        width: "560px"
                    },
                    disabled: true
                },
                hawb: {
                    title: "分运单号：",
                    type: 1
                },
                smallpiece: {
                    title: "小件数：",
                    type: 1
                },
                sfg: {
                    title: "始发港：",
                    type: 1,
                    verify: "uppercase"
                },
                mdg: {
                    title: "目的港：",
                    type: 1,
                    verify: "uppercase"
                },
                ybpiece: {
                    title: "件数：",
                    type: 1
                },
                ybweight: {
                    title: "重量：",
                    type: 1
                },
                ybvolume: {
                    title: "体积：",
                    type: 1,
                    idStyle: {
                        width: "50%"
                    }
                },
                realpiece: {
                    title: "实际件数：",
                    type: 18,
                    hidden: true
                },
                realweight: {
                    title: "实际重量：",
                    type: 18,
                    hidden: true
                },
                realvolume: {
                    title: "实际体积：",
                    type: 18,
                    idStyle: {
                        width: "50%",
                        display: 'none'
                    },
                    hidden: true
                },
                zdpiece: {
                    title: "制单件数：",
                    type: 1,
                    verify: "integer"
                },
                zdweight: {
                    title: "制单重量：",
                    type: 1,
                    verify: "fixedTwo"
                },
                zdvolume: {
                    title: "制单体积：",
                    type: 1,
                    verify: "fixedThree"
                },
                jfweight: {
                    title: "计费重量：",
                    type: 1,
                    verify: "fixedTwo"
                },
                // hbzl: {
                //   title: "航班种类：",
                //   type: 3,
                //   groupid: "6",
                //   idStyle: { width: "100%" },
                //   itemStyle: { width: "100%" }
                // },
                exForm1: {
                    idStyle: {
                        width: "100%"
                    },
                    itemStyle: {
                        width: "100%"
                    },
                    titleStyle: {
                        display: "none"
                    }
                },
                // hwxz:{title:'货物性质：',type:21,},
                // hwlx:{title:'货物类型：',type:22,},
                tradeterm: {
                    title: "贸易方式：",
                    type: 16,
                    idStyle: {
                        width: "100%"
                    },
                    itemStyle: {
                        width: "100%"
                    },
                    options: [{
                            title: "Freight  Prepaid",
                            detailS: []
                        },
                        {
                            title: "Freight  Collect",
                            detailS: []
                        }
                    ]
                },
                currency: {
                    title: "运费币种：",
                    type: 3,
                    options: [],
                    idStyle: {
                        width: "100%"
                    },
                    itemStyle: {
                        width: "100%"
                    }
                },
                rate: {
                    title: "运费单价：",
                    type: 1,
                    idStyle: {
                        width: "100%"
                    },
                    verify: "fixedThree"
                },
                englishpm: {
                    title: "英文品名：",
                    type: 17,
                    verify: "uppercase",
                    itemStyle: {
                        width: "560px"
                    }
                },
                chinesepm: {
                    title: "中文品名：",
                    type: 17,
                    itemStyle: {
                        width: "560px"
                    }
                },
                remark: {
                    title: "唛头：",
                    type: 17,
                    idStyle: {
                        width: "560px"
                    },
                    itemStyle: {
                        width: "100%"
                    }
                },
                handlinginfo: {
                    title: "Handing Information：",
                    type: 17,
                    verify: "uppercase",
                    occupyAline: true, 
                    hidden: true,
                    titleStyle: {
                        'line-height': 'initial',
                        'word-break': 'break-word',
                    },
                }
            },
            hawbdata: {
                /*    companytitle_fhr_hawb:'',
                      address_fhr_hawb:'',
                      companycode_fhr_hawb:'',
                      state_fhr_hawb:'',
                      city_fhr_hawb:'',
                      postcode_fhr_hawb:'',
                      lxr_fhr_hawb:'',
                      phone_fhr_hawb:'',
                      fax_fhr_hawb:'',
                      email_fhr_hawb:'',
                      companytitle_shr_hawb:'',
                      address_shr_hawb:'',
                      tcompanycode_shr_hawb:'',
                      state_shr_hawb:'',
                      city_shr_hawb:'',
                      postcode_shr_hawb:'',
                      lxr_shr_hawb:'',
                      phone_shr_hawb:'',
                      fax_shr_hawb:'',
                      email_shr_hawb:'',
                      taxcode_fhr_hawb:'',
                      taxcode_shr_hawb :'' */
            },
            hawbdataBackups: {}, //数据备份
            coverMawbinfo: {},
            billShow: this.isOrderConfirm,

            jcnoTableHead: [
                {
                    title: "进仓编号",
                    field: "khjcno"
                },
                {
                    title: "件数",
                    field: "piece"
                },
                {
                    title: "重量",
                    field: "weight"
                },
                {
                    title: "体积",
                    field: "volume"
                }
            ],
            ziTableHead: [
                {
                    title: "包装类型",
                    field: "packagetypename"
                },
                {
                    title: "件数",
                    field: "piece"
                },
                {
                    title: "尺寸",
                    field: "size"
                }
            ],
            ziIndex: -1,
        };
    },
    created() {
        if (this.mawbinfo.area == "市场部" || this.mawbinfo.area == "海外部") {
            this.hawbdata.tradeterm = this.hawbdata.tradeterm || "FOB";
        } else {
            this.hawbdata.tradeterm = this.hawbdata.tradeterm || "CIF";
        }
      

        if (
            !this.hawbdata.jfweight ||
            Number(this.hawbdata.jfweight).toFixed(2) ==
            Number(
                computedWeight(this.hawbdata.zdvolume, this.hawbdata.zdweight, true)
            ).toFixed(2)
        ) {
            this.$watch(
                function () {
                    return this.hawbdata.zdvolume + this.hawbdata.zdweight;
                },
                function (newVal, oldVal) {
                    this.hawbdata.jfweight = computedWeight(
                        this.hawbdata.zdvolume,
                        this.hawbdata.zdweight, true
                    );
                }, {
                    immediate: true
                }
            );
        }

        if (this.pagetype == 2) {
            this.hawbViewData.hawb.disabled = true;
            this.hawbViewData.chinesepm.required = true;
            this.hawbViewData.ybpiece.title = "件数：";
            this.hawbViewData.ybweight.title = "重量：";
            this.hawbViewData.ybvolume.title = "体积：";
            this.hawbViewData.ybpiece.type = 18;
            this.hawbViewData.ybweight.type = 18;
            this.hawbViewData.ybvolume.type = 18;
            this.hawbViewData.sfg.type = 18;
            this.hawbViewData.mdg.type = 18;

            this.hawbViewData.ybpiece.required = true;
            this.hawbViewData.ybweight.required = true;
            this.hawbViewData.hawb.required = true;
            this.hawbViewData.zdpiece.hidden = true;
            this.hawbViewData.zdweight.hidden = true;
            this.hawbViewData.zdvolume.hidden = true;
            this.hawbViewData.jfweight.hidden = true;
            this.hawbViewData.tradeterm.hidden = true;
            this.hawbViewData.currency.hidden = true;
            this.hawbViewData.rate.hidden = true;
        }

        if (this.pagetype == 1 && (this.dom == 2 || this.isOrderConfirm)) {
            this.hawbViewData.hawb.disabled = true;
            // this.hawbViewData.smallpiece.disabled = true;
            this.hawbViewData.sfg.disabled = true;
            this.hawbViewData.mdg.disabled = true;
            this.hawbViewData.ybpiece.disabled = true;
            this.hawbViewData.ybweight.disabled = true;
            // this.hawbViewData.ybvolume.disabled = true;
            this.hawbViewData.zdpiece.disabled = true;
            this.hawbViewData.zdweight.disabled = true;
            // this.hawbViewData.zdvolume.disabled = true;
            this.hawbViewData.jfweight.disabled = true;
        }

        if (this.mawbinfo.iscomboine == 1) {
            this.hawbViewData.fid.hidden = false
            this.hawbViewData.gid.hidden = false
        } else {
            this.hawbViewData.fid.hidden = true
            this.hawbViewData.gid.hidden = true
        }

        this.getHawbDetail();

        if (this.pagetype == 3 || this.pagetype == 4) {
            this.billShow = true;
        }
        
        // note: 只读
        if(this.isOrderConfirm) {
            const ONLYREADTYPE = 18;
            // 只读类型
            const ONLYREADSTATUS = false;
            // 只读disabed false=不禁用
            const HIDDENSTATUS = true;
            // 隐藏状态 true=隐藏
            
            // 只读列表字段
            let onlyReadList = {
                // 显示只读字段
                'hawb': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                // 'smallpiece': {
                //     type: ONLYREADTYPE,
                //     disabled: ONLYREADSTATUS,
                // },
                'sfg': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                'mdg': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                'zdpiece': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                'zdweight': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                'zdvolume': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },
                'jfweight': {
                    type: ONLYREADTYPE,
                    disabled: ONLYREADSTATUS,
                },

                // 隐藏字段
                'fid': {
                    hidden: HIDDENSTATUS,
                },
                'ybpiece': {
                    hidden: HIDDENSTATUS,
                },
                'ybweight': {
                    hidden: HIDDENSTATUS,
                },
                 'ybvolume': {
                    hidden: HIDDENSTATUS,
                },
                 'realpiece': {
                    hidden: HIDDENSTATUS,
                },
                 'realweight': {
                    hidden: HIDDENSTATUS,
                },
                 'realvolume': {
                    hidden: HIDDENSTATUS,
                    idStyle: {}
                },
                 'exForm1': {
                    hidden: HIDDENSTATUS,
                },
                 'chinesepm': {
                    hidden: HIDDENSTATUS,
                },
                 'remark': {
                    hidden: HIDDENSTATUS,
                },
                'handlinginfo': {
                    hidden: false,
                },
                
            }
               
            // 遍历赋值
            Object.entries(onlyReadList).forEach(([key, value]) => {
                 for(let sub in value) {
                      this.hawbViewData[key][sub] = value[sub];
                 }   
            })
        }
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
        }
    },
    computed: {
        ifDanzhengConfirmUseDisabled() {
             if (this.pagetype==1&&(this.dom==2||this.isOrderConfirm)&&this.hawbdata.hawbConfirmOverStatus!=1) {
                return this.hawbdata.hawbconfirmstatus!==1
            }

        if ((this.dom==2||this.isOrderConfirm)&&this.hawbdata.hawbConfirmOverStatus==1&&this.pagetype==1) {
                return this.hawbdata.hawbConfirmOverStatus==1&&this.hawbdata.dzmodifystatus!=2
            }
        }
    },
    methods: {

        openZitable(index) {
            //  alert(index)
            if (index == this.ziIndex) {
                this.ziIndex = -1;
            } else {
                this.ziIndex = index;
            }
        },
        confirmHawbDanhaoFunc() {
            let url =
                this.hawbdata.hawbnoconfirmstatus == 1 ?
                "api/ExAxpline/ConfirmOneHawbNo" :
                "api/ExAxpline/RevertConfirmHawbNo";
            let json = {};
            if (this.hawbdata.hawbnoconfirmstatus == 1) {
                json = this.hawbdata;
                json.sid = this.mawbinfo.guid;
                json.boguid = this.mawbinfo.boguid;
            } else {
                json = {
                    guid: this.hawbdata.guid,
                    czman: localStorage.usrname,
                    hpoid: this.mawbinfo.guid
                };
            }

            this.yanzhengConfirm(this.hawbdata.hawbnoconfirmstatus, json, url);
        },
        confirmHawbFunc() {
            //单证状态 1.未确认 ，2已确认
            let url = "",
                json = {};
            if (this.hawbdata.hawbconfirmstatus == 1) {
                url = "api/ExAxpline/ConfirmHawb";
                json = this.hawbdata;
                json.sid = this.mawbinfo.guid;
                json.boguid = this.mawbinfo.boguid;
                if (json.ybstoreList.length == 0) {
                    return this.$message.error("未配置进仓编号！");
                }
            } else {
                url = "api/ExAxpline/RevertConfirmHawb";
                json = {
                    guid: this.hawbdata.guid,
                    sid: this.mawbinfo.guid
                };
            }

            this.yanzhengConfirm(this.hawbdata.hawbconfirmstatus, json, url);
        },
        yanzhengConfirm(type, json, url) {
            if (type == 1) {
                if (
                    this.hawbdata.zdpiece == 0 ||
                    this.hawbdata.zdweight == 0 ||
                    this.hawbdata.zdvolume == 0
                ) {
                    return this.$message.error("制单件重体不能为0！");
                }
                let temp =
                    this.$refs.hawbMakingbill && this.$refs.hawbMakingbill.getInfo(1);
                if (temp && temp != "undefined") {
                    this.$refs.hawbMakingbill
                        .saveBillInfo(99)
                        .then(res => {
                            if (res) {
                                // this.confrimBillApi(json, url);
                            }
                        });

                        this.confrimBillApi(json, url);
                } else {
                    return;
                }
            } else {
                this.confrimBillApi(json, url);
            }
        },
        dzmodifystatusFunc() {

            let modelData = this.hawbdata
            let url = "api/ExAxpline/HawbDzWaitEdit "
            let data = {
                czman: localStorage.usrname,
                guid: modelData.guid
            };
            if (modelData.dzmodifystatus == 2 || modelData.dzmodifystatusams == 2 || modelData.dzmodifystatusdz == 2 || modelData.dzmodifystatustyt == 2) {
                url = 'api/ExAxpline/HawbDzWaitEditSave'
                data = Object.assign({}, data, modelData)
                data.dzmodifystatus = 3;
                data.dzmodifystatusman = localStorage.usrname;
                data.dzmodifystatusdate = formatDate(new Date(), 'yyyy-MM-dd hh:mm');
                data.dzmodifystatusams = 3;
                data.dzmodifystatusdz = 3;
                data.dzmodifystatustyt = 3;
                data.sid = this.mawbinfo.guid;
                data.boguid = this.mawbinfo.boguid
            }
            this.confrimBillApi(data, url);
        },
        confrimBillApi(json, url) {
            this.$axios({
                method: "post",
                url: this.$store.state.webApi + url,
                data: json,
                loading: true,
                noarea: true,
                tip: false
            }).then(results => {
                //  console.log(results)
                if (results.data.resultstatus == 0) {
                    this.$message.success(results.data.resultmessage);
                    this.getHawbDetail();
                    if (this.ifFromMawbaddput) {
                        this.$emit('success', true)
                    }
                } else {
                    this.$message.error(results.data.resultmessage);
                }
            });
        },
        getHawbDetail() {
            //获取分单详细
            this.$axios({
                method: "get",
                url: this.$store.state.webApi + "api/ExAxpline",
                params: {
                    guid: this.itemdata.guid
                },
                loading: true,
                tip: false
            }).then(results => {
                //  console.log('分单详细')
                //  console.log(results.data)
                results.data.smallpiece = results.data.smallpiece || results.data.zdpiece

                this.hawbdata = results.data;
                this.hawbdataBackups = JSON.parse(JSON.stringify(this.hawbdata));
                this.sethawbData();
                this.getnewdata();

                if (this.pagetype == 1 && (this.dom == 2|| this.isOrderConfirm)) {
                    if (this.ifDanzhengConfirmUseDisabled) {
                        this.hawbViewData.englishpm.idClass = '';
                        this.hawbViewData.chinesepm.idClass = '';
                        this.hawbViewData.handlinginfo.idClass = '';
                        this.hawbViewData.smallpiece.idClass = '';
                    } else {
                        this.hawbViewData.englishpm.idClass = 'pointerAll'
                        this.hawbViewData.chinesepm.idClass = 'pointerAll'
                        this.hawbViewData.handlinginfo.idClass = 'pointerAll'
                        this.hawbViewData.smallpiece.idClass = 'pointerAll'
                    }
                }

            });
        },
        sethawbData() {
            this.hawbdata.chinesepm =
                this.hawbdataBackups.chinesepm || this.mawbinfo.chinesepm;
            if (this.pagetype == 2) {
                let arr = [
                    'companytitle_fhr_hawb', 'address_fhr_hawb', 'companycode_fhr_hawb', 'state_fhr_hawb', 'city_fhr_hawb', 'postcode_fhr_hawb', 'lxr_fhr_hawb', 'phone_fhr_hawb', 'fax_fhr_hawb', 'email_fhr_hawb', 'taxcode_fhr_hawb',
                    'companytitle_shr_hawb', 'address_shr_hawb', 'companycode_shr_hawb', 'state_shr_hawb', 'city_shr_hawb', 'postcode_shr_hawb', 'lxr_shr_hawb', 'phone_shr_hawb', 'fax_shr_hawb', 'email_shr_hawb', 'taxcode_shr_hawb',
                ]
                arr.forEach(i => {
                    this.hawbdata[i] = this.hawbdataBackups[i] || this.mawbinfo[i.replace('_hawb', '_mawb')]
                })
            }
            // this.hawbdata.gid = this.hawbdataBackups.gid = this.mawbinfo.gid;

            this.hawbdata.area = this.hawbdataBackups.area = this.mawbinfo.area;
        },
        getnewdata() {
            //用分单信息覆盖一部分总单信息，这样制单里面不用传分单数据
            var data = JSON.parse(JSON.stringify(this.mawbinfo));
            // console.log(data)
            // alert(3)
           if(this.mawbinfo.iscomboine==1){
            data.gid = this.hawbdata.gid;
            }
            data.mdg = this.hawbdata.mdg;
            data.zdpiece = this.hawbdata.zdpiece;
            data.zdweight = this.hawbdata.zdweight;
            data.zdvolume = this.hawbdata.zdvolume;
            data.smallpiece = this.hawbdata.smallpiece;
            data.englishpm = this.hawbdata.englishpm;
            data.hawb = this.hawbdata.hawb;
            data.guid = this.hawbdata.guid;
            data.jfweight = this.hawbdata.jfweight;
            this.coverMawbinfo = data;
        }
    }
};
</script>

<style lang="less" scoped>
.paneDisabled {
    cursor: not-allowed;

    >div {
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
        height: 36px;
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

            ~.checkbox {
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

        >div {
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

            +label {
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

.handing-infmation {
    margin:0 33px 12px;
    pointer-events: auto;
    div {
        pointer-events: auto;
    }
}

.bottom-tip {
  position: fixed;
  text-align: right;
  margin-right: 15px;
  width: 1588px;
  bottom: 14px;
  background: #fff;
  padding: 10px 0px;
  right: 31px;
  padding-right: 28px;
  border-top: 1px solid #ccc;
  -webkit-box-shadow: 0px 0px 10px #666;
  box-shadow: 0px 0px 10px #666;
  z-index: 999;
}
</style>
