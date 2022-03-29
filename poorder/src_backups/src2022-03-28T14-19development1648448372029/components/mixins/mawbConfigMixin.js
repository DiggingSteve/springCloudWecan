export const mawbConfigMixin=function(){
    //pageype 1 弹窗 2查询页面
    return {
        data(){
            return {
                showZuofei:false,//是否显示作废表单
                objGysss: {}, //总运单单条数据
                zdBasicInfoSave: { //制单备注信息
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
                zuofeiInputView:{
                 deprecateremark:{title:'作废备注',type:'17',itemStyle:{width:'100%'},idStyle:{width:'100%'}},
                },
                zuofeiInputModel:{
                }
            }
        },
        methods: {
            choiseDialogMawb(row) { //选择总单配置弹窗里面总运单，获取当行数据
                this.dialogMawb = row.mawb;
                this.objGysss = row;
                this.getMawbGys()
            },
            getMawbGys() { //获取总单供应商的数据
                if (!this.dialogMawb) {
                    return;
                }
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                    params: {
                        mawb: this.dialogMawb,
                        area: this.rowData.area,
                        gid: this.rowData.gid,
                        sfg: this.rowData.sfg,
                        mdg: this.rowData.mdg,
                        czlx: this.rowData.czlx == '唯凯配舱' || this.rowData.czlx == '自货' ? '自货' : '代操作'
                    },
                    loading: false,
                    tip: false
                }).then(results => {

                    if (results.data.resultstatus == 0) {
                        let res = results.data.resultdic.mawbInfo;
                        res.iszddl = results.data.resultdic.iszddl
                        res.zddlcode = results.data.resultdic.zddlcode
                        res.zddlzh = results.data.resultdic.zddlzh
                        res.zdiatacode = results.data.resultdic.zdiatacode
                        this.rowData.gysname = res.gysname;
                        this.rowData.mawbss = res.mawbss;
                        this.rowData.mawbgid = Number(res.gysid);
                        this.objGysss = res;
                        this.rowData.self_real_bp_freight_out = res.xyfp1_in;
                        this.rowData.cus_real_bp_freight_out = res.xyfp2_in;
                        this.rowData.self_real_bp_trans_out = res.xyfp1_in;
                        this.rowData.cus_real_bp_trans_out = res.xyfp2_in;
                        //this.$message.success(results.data.resultmessage)
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },

            mawbConfigFunc(type, status) { //配置总运单 //type 1配置总运单 2解除总运单

                var mawb = "";
                var url = "";

                if (type == 1) {
                    url = "api/ExHpoAxplineSureMawb";
                    mawb = this.dialogMawb;
                    console.log(this.dialogMawb)
                    if (!this.objGysss.iszddl || !this.objGysss.zddlcode) {
                        return this.$message.error('请选择制单代码并填写制单代理代码！')
                    }
                } else {
                    url = "api/ExHpoAxplineUnSureMawb";
                    mawb = this.rowData.mawb;
                }
                if (!mawb) {
                    this.$message.error("请填写总运单号");
                    return;
                }
                var json = {
                    mawb: mawb,
                    gysname: this.objGysss && this.objGysss.gysname,
                    mawbss: this.objGysss && this.objGysss.mawbss,
                    mawbgid: this.objGysss && this.objGysss.gysid,
                    iszddl: this.objGysss && this.objGysss.iszddl,
                    zddlcode: this.objGysss && this.objGysss.zddlcode,
                    guid: this.rowData.guid,
                    gid: this.rowData.gid,
                    sfg: this.rowData.sfg,
                    mdg: this.rowData.mdg,
                    area: this.rowData.area,
                    hwxz: this.rowData.hwxz,
                    xyfp1_in: this.objGysss && this.objGysss.xyfp1_in||'',
                    xyfp2_in: this.objGysss && this.objGysss.xyfp2_in||'',
                };

                if (type == 1) {
                    json.system = this.rowData.system;
                    json.boguid = this.rowData.boguid;
                    json.czlx = this.rowData.czlx == '唯凯配舱' || this.rowData.czlx == '自货' ? '自货' : '代操作';
                    json.mdg = this.rowData.mdg;
                    json.ismawb_onboard_confirm = 1
                    if (!json.gysname) {
                        this.$message.error('无供应商信息')
                        return
                    }
                    
                    //有航班号覆盖原来列表上的
                    if(this.mawbInputData.hbh){
                       json.yqhbh= this.mawbInputData.hbh
                    }
                    //old版本为只有有值的时候才覆盖
                    // if(this.rowData.yqhbh&&this.mawbInputData.hbh){
                    //    json.yqhbh= this.mawbInputData.hbh
                    // }
                }
                if (type == 2) {
                    json.status = status;
                    if(status=='5'){
                      json.deprecateremark=this.zuofeiInputModel.deprecateremark
                    }
                }
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    loading: false,
                    tip: false
                }).then(results => {
                    //console.log("配置总运单")
                    //console.log(results.data)
                    if (results.data.resultstatus == 0) {
                        layer.msg("操作成功");
                        if (type == 1) {
                            this.rowData.mawb = this.dialogMawb;
                            // this.getMawbGys();
                            this.dialogMawbConfig = false;
                        }
                        if (type == 2) {
                            this.rowData.mawb = "";
                            this.rowData.gysname = "";
                            this.rowData.mawbss = "";
                            this.rowData.mawbgid = "";
                            this.mawbConfigConfim = false;
                            this.rowData.self_real_bp_freight_out = 10;
                            this.rowData.cus_real_bp_freight_out = 0;
                            this.rowData.self_real_bp_trans_out = 10;
                            this.rowData.cus_real_bp_trans_out = 0;
                            //this.getMawbCost(3); //解除总运单后删除带出的运费杂费
                            if(status=='5'){
                               this.showZuofei=false 
                               this.zuofeiInputModel.deprecateremark=''
                            }
                        }

                        
                        
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
        }
    }
}