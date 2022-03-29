<template>
    <div>
        <div class="input-item " >
            <!-- <div class="input-title">总运单号</div> -->
            <div class="input-content">
                <el-input v-model="inputModelData.mawb" style="width:240px;" disabled></el-input>
                <el-button @click="getMawbConfig" :disabled="inputModelData.mawb?true:false">配置总运单</el-button>
                <el-button @click="relieveMawbConfig">解除总运单</el-button>
                <span style="margin-left:60px;margin-right:20px"
                    v-if="inputModelData.gysname">运单供应商：{{inputModelData.gysname&&inputModelData.gysname.split('-')[1]}}</span>
                <span v-if="inputModelData.mawb&&inputModelData.mawbss">总运单所属：{{inputModelData.mawbss}}</span>
            </div>
        </div>

        <el-dialog title="配置总单" :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" append-to-body
            :close-on-click-modal="false" width="1200px" @close="mawbConfigDialogClose">

             <mawbConfigNew :rowData="inputModelData" pagetype="2" ref="mawbConfig" :visible.sync="dialogMawbConfig"></mawbConfigNew>
            <!-- {{objGysss}} -->
            <!-- <div class="detail">
                <div style="position:relative;top:-16px;">
                    <strong>总运单号</strong>：
                    <span>
                        <el-input style="width:160px;" v-model="dialogMawb" placeholder="请选择总运单号" v-verify="'mawb'"
                            @blur="getMawbGys()"></el-input>
                        <new-form-cmpt :view-data.sync="zdBasicInfoSave" :model-data.sync="objGysss"
                            style="display: inline-flex;" :pagetype="2"></new-form-cmpt>
                        <span @click="mawbConfigFunc(1)">
                            <el-button btnnum="490" @click.stop="mawbConfigFunc(1)" size="mini">保存</el-button>
                        </span>
                        <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialog=true"
                            style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:10px;top:2px"></i>
                        <i title="刷新" class="el-icon-refresh" @click="getMawbConfig"
                            style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:14px;top:2px"></i>
                    </span>
                </div>

                <commonTable :head="mawbConfigHead" :table-data="mawbConfigtableData" style="margin-top:8px;"
                    divStyle="max-height:600px">
                    <template slot="mawb" slot-scope="props">
                        <span style="cursor:pointer"
                            @click="choiseDialogMawb(props.data.row);getMawbGys()">{{props.data.value}}</span>
                    </template>
                </commonTable>
            </div> -->
        </el-dialog>

        <el-dialog :visible.sync="mawbConfigConfim" width="320px" append-to-body :close-on-click-modal="false" top="15%"
            center>
            <el-button btnnum="500" type="primary" plain @click="mawbConfigFunc(2,1)">可用</el-button>
            <!-- <el-button btnnum="510" type="primary" plain @click="mawbConfigFunc(2,4)">不可用</el-button> -->
            <el-button btnnum="520" type="primary" plain @click="mawbConfigFunc(2,5)">作废</el-button>
        </el-dialog>

        <el-dialog :visible.sync="mawbDialog" width="1300px" top="4%" v-if="mawbDialog" :close-on-press-escape="false"
            append-to-body>
            <iframe
                :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman()}&area=${area}`"
                frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;"></iframe>
        </el-dialog>

    </div>
</template>
<script>
   /*配置总运单*/
    import mawbConfigNew from '@/components/templates/mawbConfigNew'
    export default {
        props: {
            inputModelData: Object,
        },
        components: {mawbConfigNew},
        data() {
            return {
                dialogMawbConfig: false,
                zdBasicInfoSave: {
                    iszddl: {
                        title: '制单代码：',
                        type: 3,
                        disabled: false,
                        options: [{
                            label: 'WFF',
                            value: 1
                        }, {
                            label: '非WFF',
                            value: 2
                        }],
                        elEvent: {
                            eventName: 'change',
                            eventFunc: this.iszddlChange,
                        }
                    },
                    zddlcode: {
                        title: '制单代理代码：',
                        type: 1,
                        disabled: false,
                        verify: "uppercase",
                        required: true
                    },
                },
                dialogMawb: "",
                objGysss: {},
                mawbDialog: false,
                mawbConfigConfim: false,
                mawbConfigHead: [
                    //配置总单表头数据
                    {
                        title: "总运单号",
                        field: "mawb"
                    },
                    {
                        title: "供应商",
                        field: "gysname"
                    },
                    {
                        title: "总运单所属",
                        field: "mawbss"
                    },
                    {
                        title: "总运单类型",
                        field: "mawblx"
                    },
                    {
                        title: "总运单形式",
                        field: "mawbxs"
                    },
                    {
                        title: "总运单性质",
                        field: "mawbxz"
                    },
                    {
                        title: "运输分类",
                        field: "ysfl"
                    },
                    {
                        title: "运输条件",
                        field: "ystj"
                    },
                    {
                        title: "操作类型",
                        field: "czlx"
                    },
                    {
                        title: "始发港",
                        field: "sfg"
                    },
                    {
                        title: "备注",
                        field: "remark"
                    }
                ],
                mawbConfigtableData: [
                    //配置总单表格数据
                ],
            };
        },
        created() {

        },
        computed: {

        },
        methods: {
            mawbConfigFunc(type, status) {
                //配置总运单
                //type 1配置总运单 2解除总运单
                var mawb = "";
                var url = "";
                var objGysss=''

                if (type == 1) {
                    url = "api/ExHpoAxplineSureMawb";
                    mawb = this.$refs.mawbConfig.dialogMawb;
                    objGysss=this.$refs.mawbConfig.objGysss;
                    //mawb = this.dialogMawb;
                    if (!objGysss.iszddl || !objGysss.zddlcode) {
                        return this.$message.error('请选择制单代码并填写制单代理代码！')
                    }
                } else {
                    url = "api/ExHpoAxplineUnSureMawb";
                    mawb = this.inputModelData.mawb;
                }
                if (!mawb) {
                    this.$message.error("请填写总运单号");
                    return;
                }
                var json = {
                    mawb: mawb,
                    gysname: objGysss && objGysss.gysname,
                    mawbss: objGysss && objGysss.mawbss,
                    mawbgid: objGysss && objGysss.gysid,
                    iszddl: objGysss && objGysss.iszddl,
                    zddlcode: objGysss && objGysss.zddlcode,
                    guid: this.inputModelData.guid,
                    area: this.inputModelData.area,
                    hwxz: this.inputModelData.hwxz,
                    gid: this.inputModelData.gid,
                    sfg: this.inputModelData.sfg
                };
                if (type == 1) {
                    json.system = this.inputModelData.system;
                    json.boguid = this.inputModelData.boguid;
                    json.czlx = this.inputModelData.czlx;
                    json.mdg = this.inputModelData.mdg;
                }
                if (type == 2) {
                    json.status = status;
                }
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log("配置总运单")
                    //console.log(results.data)
                    if (results.data.resultstatus == 0) {

                        this.$message.success(results.data.resultmessage);
                       

                        if (type == 1) {
                            this.inputModelData.mawb = mawb;
                            this.inputModelData.iszddl = objGysss && Number(objGysss.iszddl);
                            this.inputModelData.zddlcode = objGysss && objGysss.zddlcode;
                            this.getMawbGys(mawb);
                            this.dialogMawbConfig = false;
                        }
                        if (type == 2) {
                            this.inputModelData.mawb = "";
                            this.inputModelData.gysname = "";
                            this.inputModelData.mawbss = "";
                            this.inputModelData.mawbgid = "";
                            this.mawbConfigConfim = false;
                            this.inputModelData.self_real_bp_freight_out = 10;
                            this.inputModelData.cus_real_bp_freight_out = 0;
                            this.inputModelData.self_real_bp_trans_out = 10;
                            this.inputModelData.cus_real_bp_trans_out = 0;
                            // this.getMawbCost(3); //解除总运单后删除带出的运费杂费
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            getMawbConfig() {
                //获取总单配置表格数据
                this.dialogMawbConfig = true;
                this.inputModelData.wtkh=getxmdata("wtkh").filter(i=>i.id == this.inputModelData.fid)[0]['usr_name']
                // this.dialogMawb = this.inputModelData.mawb;
                // var json = {
                //     area: this.inputModelData.area,
                //     hbh: (this.inputModelData.yqhbh || this.inputModelData.hbh).substr(0, 2),
                //     czlx: this.inputModelData.czlx,
                //     sfg: this.inputModelData.sfg,
                //     hwxz: this.inputModelData.hwxz,
                //     ystj: ""
                // };
                // this.$axios({
                //     method: "get",
                //     url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                //     params: json,
                //     loading: true,
                //     tip: false
                // }).then(results => {
                //     // //console.log("总单配置")
                //     // //console.log(results)
                //     this.mawbConfigtableData = results.data || [];
                // });
            },
            relieveMawbConfig() {
                //点击解除总运单
                if (!this.inputModelData.mawb) {
                    this.$message.error("请先配置总运单号");
                    return;
                }
                this.mawbConfigConfim = true;
            },
            mawbConfigDialogClose() {
                if (!this.inputModelData.mawb) {
                    this.inputModelData.mawbss = ''
                    this.inputModelData.gysname = ''
                }
            },
            async getMawbGys() {
                //获取总单供应商的数据
                if (!this.dialogMawb) {
                    return;
                }
                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                    params: {
                        mawb: this.dialogMawb,
                        area: this.inputModelData.area
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    console.log("运单");
                    console.log(results.data);
                    if (results.data.resultstatus == 0) {
                        let res = results.data.resultdic.mawbInfo;
                        this.inputModelData.gysname = res.gysname;
                        this.inputModelData.mawbss = res.mawbss;
                        this.inputModelData.mawbgid = Number(res.gysid || res.gid);
                        this.objGysss = results.data.resultdic;
                        this.objGysss.gysname = res.gysname
                        this.objGysss.mawbss = res.mawbss
                        this.objGysss.gysid = res.gysid
                        this.inputModelData.self_real_bp_freight_out = res.xyfp1_in;
                        this.inputModelData.cus_real_bp_freight_out = res.xyfp2_in;
                        this.inputModelData.self_real_bp_trans_out = res.xyfp1_in;
                        this.inputModelData.cus_real_bp_trans_out = res.xyfp2_in;
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            choiseDialogMawb(row) {
                //选择总单配置弹窗里面总运单，获取当行数据
                //console.log(row)
                this.dialogMawb = row.mawb;
                this.objGysss = row;
            },
            iszddlChange() {
                this.inputModelData.zddlcode = this.inputModelData.iszddl == 1 ? 'WFF/SHA' : ''
            },
        },
        watch: {}
    };
</script>
<style lang="less" scoped>

</style>