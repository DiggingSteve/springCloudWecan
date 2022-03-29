<template>
    <div class="enterWarehouseNumber" :class="{disabled:(editType==2&&!curObj.guid)||curObj.statusPz}">
        <!-- {{curObj}} -->
        <!--     {{editType}} -->
        <!-- {{isadd}} -->
        <div class="divTitle" v-if="editType!=2">预报货物信息操作</div>
        <div class="divTitle" v-if="editType==2">客户确认货物信息操作</div>

        <div v-enterfocus class="formRow">
            <el-row class="first-row">
                <el-col :span="6">
                    <span>进仓编号：</span>
                    <el-input v-model.trim="curObj.khjcno" class="input-required"></el-input>
                </el-col>
                <el-col :span="4" style="margin-right: 5px;">
                    <span>件数：</span>
                    <el-input class="input-required" v-model="curObj.piece" v-verify="'integer'"></el-input>
                </el-col>
                <el-col :span="4">
                    <span>重量：</span>
                    <el-input class="input-required" @blur="weightBlur($event)" ref="weight" v-model="curObj.weight"
                        v-verify="'float'"></el-input>
                </el-col>
                <el-col :span="4">
                    <span>体积：</span>
                    <el-input class="input-required" v-model="curObj.volume" v-verify="'float'"></el-input>
                </el-col>
                <el-col :span="5">
                    <span>入库类型：</span>
                    <el-select v-model="curObj.storeType" class="input-required" style="width:120px" clearable
                        :disabled="editType==2">
                        <el-option v-for="type of storeTypeOptions" :key="type" :value="type">{{ type }}</el-option>
                    </el-select>
                </el-col>
            </el-row>

            <!-- <el-row class="first-row" v-if="editType!=2&&mawbinfo.area==conditionalAreaForBuild&&mawbinfo.czlx=='自货'">
                <p style="color:red;text-indent: 6px;">如在此填写了尺寸信息,则会代替上榜时填写的"预报尺寸备注"并带到航线签单页面的"预报尺寸"栏</p>
            </el-row> -->

            <!-- 选填内容 =>  预计入库仓库：+ 预计入库日期： -->
            <el-row v-if="curObj.storeType=='晚入库'||curObj.storeType=='入库'" class="optional-content">
                <el-col :span="6">
                    <span style="width: 100px;">预计入库仓库：</span>
                    <el-select v-model="curObj.storename_yb" clearable filterable :disabled="editType==2"
                        class="input-required">
                        <el-option v-for="(item, index) in getStoreArr()" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>

                <!-- 新增预计入库日期： -->
                <el-col :span="6">
                    <span style="width: 100px;">预计入库日期：</span>
                     <el-date-picker 
                        v-model="curObj.yjstoredate" 
                        :type="'datetime'"
                        :value-format="'yyyy-MM-dd HH:mm:ss'"
                        :placeholder="'选择日期'" 
                        :picker-options="setPickerOptions()"    
                         :default-value="nowDate"            
                        clearable>
                    </el-date-picker>
                </el-col> 
            </el-row>
             <!-- 选填内容 =>  预计入库仓库：+ 预计入库日期： -->

            <el-row v-for="(item, index) in curObj.volYbList" :key="index">
                <el-col :span="6">
                    <span>包装类型：</span>
                    <el-select v-model="item.packagetypename" clearable filterable
                        :class="{'input-required': isRequired(item)}">
                        <el-option v-for="(item, index) in packageType" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <span>尺寸件数：</span>
                    <el-input v-model="item.piece" v-verify="'integer'" :class="{'input-required': isRequired(item)}">
                    </el-input>
                </el-col>
                <el-col :span="14">
                    <span style="width: 90px;">尺寸(CM)：</span>
                    <p class="size">
                        长
                        <el-input v-model="item.longs" :class="{'input-required': isRequired(item)}"></el-input>宽
                        <el-input v-model="item.widths" :class="{'input-required': isRequired(item)}"></el-input>高
                        <el-input v-model="item.heights" :class="{'input-required': isRequired(item)}"></el-input>
                    </p>
                    <p class="size" style="margin-left:18px;width:110px">
                        体积：{{ (item.longs*item.widths*item.heights/1000000*item.piece).toFixed(3)}}
                    </p>
                    <i @click="packageFn(index)"
                        :class="['package-icon', {'el-icon-circle-plus': index == 0, 'el-icon-remove': index != 0}]"></i>
                </el-col>

            </el-row>
        </div>

        <div style="margin-left:20px">
            <el-button @click.native="saveNumber" type="primary">确认</el-button>
            <el-button @click.native="clearCurObj" type="primary" v-if="isadd">取消</el-button>
        </div>

        <div class="table-box" v-if="!curObj.guid&&isadd">
            <el-row class="title">
                <el-col :span="3">操作</el-col>
                <el-col :span="4">客户进仓编号</el-col>
                <el-col :span="2">件数</el-col>
                <el-col :span="2">重量</el-col>
                <el-col :span="2">体积</el-col>
                <el-col :span="3">入库类型</el-col>
                <el-col :span="2">状态</el-col>
                <el-col :span="3">预计入库仓库</el-col>
                <el-col :span="3">预计入库日期</el-col>
            </el-row>
            <div class="table-row" v-for="(item, index) in allTableData" :key="index">
                <el-row :class="{'expansion': showSubTable == index}">
                    <el-col :span="3">
                        <i title="编辑" class="el-icon-setting" @click="edit(allTableData[index])"></i>
                        <i title="删除" class="el-icon-delete" @click="del(allTableData[index])"></i>
                    </el-col>
                    <el-col :span="4">
                        <i class="el-icon-circle-plus-outline" @click="exSubTable(index)"></i>
                        {{ item.khjcno }}
                    </el-col>
                    <el-col :span="2">{{ item.piece }}</el-col>
                    <el-col :span="2">{{ item.weight }}</el-col>
                    <el-col :span="2">{{ item.volume }}</el-col>
                    <el-col :span="3">{{ item.storeType }}</el-col>
                    <el-col :span="2">{{ item.statusPz ? '已配置' : '未配置' }}</el-col>
                    <el-col :span="3">{{ item.storename_yb||'--'}}</el-col>
                    <!-- 在表格中显示预计入库日期 -->
                    <el-col :span="3">{{ item.yjstoredate||'--'}}</el-col>
                </el-row>
                <div class="sub-table" v-if="showSubTable == index && item.volYbList">
                    <el-row class="title">
                        <el-col :span="6">包装类型</el-col>
                        <el-col :span="6">件数</el-col>
                        <el-col :span="6">尺寸(cm)</el-col>
                        <el-col :span="6">体积</el-col>
                    </el-row>
                    <el-row v-for="(subItem, subIndex) in item.volYbList" :key="subIndex">
                        <el-col :span="6">{{ subItem.packagetypename }}</el-col>
                        <el-col :span="6">{{ subItem.piece }}</el-col>
                        <el-col :span="6">{{ subItem.longs }}*{{ subItem.widths }}*{{ subItem.heights }}</el-col>
                        <el-col :span="6">{{ (subItem.longs
                            *subItem.widths*subItem.heights/1000000*subItem.piece).toFixed(3)}}</el-col>
                    </el-row>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        props: {
            isadd: { //true 新增 false 修改
                type: Boolean,
                default: true
            },
            editType: { //1预报 2实际
                type: [Number, String],
                default: 1
            },
            allTableData: Array,
            mawbinfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            guid: {
                type: [Number, String],
                required: true
            },
            boguid: {
                type: [Number, String],
                required: true
            },
            oldhpoid: {
                type: [Number, String],
                required: true
            },
            piece: {
                type: [Number, String],
                default: () => ""
            },
            weight: {
                type: [Number, String],
                default: () => ""
            },
            volume: {
                type: [Number, String],
                default: () => ""
            },

        },
        data() {
            return {
                packageType: [],
                showSubTable: -1,
                curObj: {
                    khjcno: "",
                    piece: "",
                    weight: "",
                    volume: "",
                    storeType: "",
                    storename_yb: "",
                    yjstoredate: "", // from 实例化预计入库日期参数
                    volYbList: [{
                        packagetypename: "",
                        piece: "",
                        longs: "",
                        widths: "",
                        heights: ""
                    }]
                },
                storeTypeOptions: [],
                dialogVisible: false, //新增与修改进仓编号
                inputViewData: {
                    khjcno: {
                        title: "客户进仓编号",
                        type: 1,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    jcdate: {
                        title: "入库日期",
                        type: 15
                    },
                    fid: {
                        title: "委托客户",
                        type: 14,
                        pagetype: "1"
                    }
                },
                inputModelData: {},
            };
        },
        created() {
            this.clearCurObj()
            this.$watch(
                () => {
                    return this.piece + this.weight + this.volume;
                },
                () => {
                    this.curObj.piece = this.piece;
                    this.curObj.weight = this.weight;
                    this.curObj.volume = this.volume;
                }, {
                immediate: true
            }
            );

            let groupData = JSON.parse(localStorage.getItem("groupType") || "[]");

            groupData.forEach(item => {
                if (item.groupid == 31) this.packageType.push(item.typename);
                if (item.groupid === 170) this.storeTypeOptions.push(item.ready01);
            });

            //this.getStoreInfo();

        },
        watch: {

        },
        methods: {
            /**
             * @desc 设置预计入库日期 => 禁用日期选择
             */
           setPickerOptions() {
                return {
                            disabledDate(time) {
                                return time.getTime() + 3600 * 1000 * 24 < Date.now();
                            }
                        }
            },  

            getStoreArr() { //入库仓库
                let cargoData = JSON.parse(localStorage.cargoData);
                let arr = [];
                cargoData.map(item => {
                    if (item.area == this.mawbinfo.area || this.$store.state.areaState) {
                        arr.push(item.storename);
                    }
                });
                return arr;
            },

            saveNumber() {
                if (!this.curObj.khjcno) {
                    this.$message.error("请输入或选择进仓编号");
                    return;
                }
                // if (!this.allTableData.every((item => item.guid||item.khjcno.toUpperCase() !== this.curObj.khjcno.toUpperCase() || item.guid == this.curObj.guid ))) {
                //   return this.$message.error('进仓编号重复')
                // }
                if (
                    this.allTableData.filter(
                        i =>
                            i.guid &&
                            i.khjcno.toUpperCase() == this.curObj.khjcno.toUpperCase() &&
                            i.guid != this.curObj.guid
                    ).length > 0
                ) {
                    return this.$message.error("进仓编号重复");
                }
                if (!this.curObj.piece || !this.curObj.weight || !this.curObj.volume) {
                    return this.$message.error("请填写完整信息");
                }
                if (this.mawbinfo.area == "上海" && !this.curObj.storeType) {
                    return this.$message.error("请选择入库类型");
                }

                if ((this.curObj.storeType == '晚入库' || this.curObj.storeType == '入库') && !this.curObj.storename_yb) {
                    return this.$message.error("请选择入库仓库");
                }
                if (this.curObj.storeType != '晚入库' && this.curObj.storeType != '入库') {
                    this.curObj.storename_yb = ''
                    this.curObj.yjstoredate = ''; // 入库类型 ！= '晚入库' && 入库类型 ！= '入库' => 预计入库日期清空
                }

                // note: 预计入库时间 => yjstoredate === null || yjstoredate === 1900 => yjstoredate = ''
                this.curObj.yjstoredate = (this.curObj.yjstoredate === undefined || this.curObj.yjstoredate === null || this.curObj.yjstoredate.includes('1900')) ? "" : this.curObj.yjstoredate;   

                if (this.curObj.volYbList.length !== 0) {
                    for (let i in this.curObj.volYbList) {
                        if (
                            this.isRequired(this.curObj.volYbList[i]) &&
                            this.hasEmptyValue(this.curObj.volYbList[i])
                        ) {
                            return this.$message.error("请填写完整信息");
                        }
                    }
                }

                if (this.curObj.guid) {
                    this.editStoreInfo(this.curObj);
                } else {
                    this.addStoreInfo(this.curObj);
                }
            },

            /**
             * @desc 新增货物信息后，清空货物
             */
            clearCurObj() {
                this.curObj = {
                    khjcno: "",
                    piece: this.piece,
                    weight: this.weight,
                    volume: this.volume,
                    storeType: "",
                    storename_yb: '',
                    yjstoredate: '',
                    volYbList: [{
                        packagetypename: "",
                        piece: "",
                        longs: "",
                        widths: "",
                        heights: ""
                    }]
                };
            },
            packageFn(index) {
                if (index == 0) {
                    this.curObj.volYbList.push({
                        packagetypename: "",
                        piece: "",
                        longs: "",
                        widths: "",
                        heights: ""
                    });
                } else {
                    this.curObj.volYbList.splice(index, 1);
                }
            },
            exSubTable(index) {
                if (this.showSubTable == index) {
                    this.showSubTable = -1;
                } else {
                    this.showSubTable = index;
                }
            },
            edit(row) {
                //type 1入库的预报货物信息修改 2实际货物信息修改   3不入库或晚入库的货物信息修改 
                // if (row.statusPz == true && row.storeType == "入库") {
                //   return this.$message.error("已配置分单不可修改");
                // }

                // if (this.curObj.guid) {
                //   return this.$message.error("请先保存编辑中的进仓编号");
                // }
                if (!row) return;
                this.curObj = Object.assign({}, this.curObj, JSON.parse(JSON.stringify(row)));
                console.log(this.curObj)
                if (this.editType == 2) {
                    this.curObj.piece = this.curObj.customCommitPiece
                    this.curObj.weight = this.curObj.customCommitWeight
                    this.curObj.volume = this.curObj.customCommitVolume
                    this.curObj.storename_yb = this.curObj.storeName
                    this.curObj.yjstoredate = this.curObj.yjstoredate; // 编辑时, 给预计入库日期赋值
                    this.curObj.volYbList = this.curObj.vollist
                }

                if (!this.curObj.volYbList || this.curObj.volYbList.length == 0) {
                    this.curObj.volYbList = [{
                        packagetypename: "",
                        piece: "",
                        longs: "",
                        widths: "",
                        heights: ""
                    }];
                }
            },
            del(row) {
                if (row.statusPz == true && row.storeType == "入库") {
                    return this.$message.error("已配置分单不可删除");
                }

                //console.log(guid)
                this.$confirm("是否删除进仓编号", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.delStoreInfo(row);
                    })
                    .catch(() => { });
            },

            getStoreInfo() {
                if (this.guid) {
                    this.$emit('success', true)
                    return;
                }
            },
            addStoreInfo(storedata) {
                if (!this.guid) {
                    this.$message.error("不存在guid");
                    return;
                }

                let json = Object.assign({
                    sid: this.guid,
                    store_childguid: -1
                },
                    storedata
                );
                json.volYbList = json.volYbList.filter(i => {
                    let isEmpty = Object.keys(i).every(key => i[key] == "");
                    if (!isEmpty) {
                        i.guid = -1;
                    }
                    return !isEmpty;
                });
                json.oldhpoid = this.oldhpoid
                //console.log(JSON.stringify(json))
                let url = "api/store/addYbInfo"; //旧'api/ExAxplineStore'
                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + url,
                    data: json,
                    noarea: true,
                    loading: true,
                    tip: true
                }).then(results => {
                    //console.log("仓库信息新增")
                    //console.log(JSON.stringify(results.data))
                    if (results.data.resultstatus == 0) {
                        this.getStoreInfo();
                        this.clearCurObj();
                        this.$emit("success", true);
                    }
                });
            },
            editStoreInfo(storedata) {
                let json = Object.assign({
                    sid: this.guid
                }, storedata);
                // 过滤掉guid为0的尺寸信息
                json.volYbList = json.volYbList.filter(i => {
                    let isEmpty = Object.keys(i).every(key => i[key] == "");
                    if (isEmpty) return false;
                    if (i.guid == "0") return false;
                    i.guid ? "" : (i.guid = -1);
                    return true;
                });

                json.sid = this.guid;
                //console.log(JSON.stringify(json));
                let api = this.editType == 1 ? "api/store/EditYbInfo" : 'api/store/EditCustomCommitInfo'
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + api,
                    data: json,
                    noarea: true,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log("仓库信息修改")
                    //console.log(JSON.stringify(results.data))

                    if (results.data.resultstatus == 0) {
                        this.getStoreInfo();
                        this.$emit("success", true);
                        this.$message.success(results.data.resultmessage);
                        if (storedata.guid && storedata.guid != -1) {
                            this.dialogVisible = false
                        } else {
                            this.curObj = {
                                khjcno: "",
                                piece: this.piece,
                                weight: this.weight,
                                volume: this.volume,
                                storeType: "",
                                storename_yb: '',
                                yjstoredate: '', // 仓库信息修改后
                                volYbList: [{
                                    packagetypename: "",
                                    piece: "",
                                    longs: "",
                                    widths: "",
                                    heights: ""
                                }]
                            };
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            delStoreInfo(row) {
                this.$axios({
                    method: "delete",
                    url: this.$store.state.webApi + "api/store/DeleteYbInfo",
                    data: {
                        guid: row.guid,
                        isdel: "2",
                        store_childguid: row.store_childguid,
                        storeType: row.storeType,
                        hpoid: this.mawbinfo.guid,
                        khjcno: row.khjcno
                    },
                    noarea: true,
                    loading: true,
                    tip: true
                }).then(results => {
                    //console.log("删除仓库信息")
                    //console.log(JSON.stringify(results.data))

                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage);
                        this.getStoreInfo();
                        this.$emit("success", true);
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            isRequired(item) {
                let required = false;

                let keys = ["packagetypename", "piece", "longs", "widths", "heights"];
                for (let i in keys) {
                    item[keys[i]] ? (required = true) : "";
                }
                return required;
            },
            hasEmptyValue(item) {
                let empty = false;

                let key = ["packagetypename", "piece", "longs", "widths", "heights"];
                for (let i in key) {
                    item[key[i]] == "" ? (empty = true) : "";
                }
                return empty;
            },
            weightBlur(e) {
                let val = e.target.value
                if (val && val.split('.').length > 1 && val.split('.')[1] != 5) {
                    this.$message.error('预报/客户确认件重体只能录入精确到0.5以及整数！');
                    this.$refs.weight.focus()
                    return
                }
            }
        },
        computed: {
             nowDate() {
                let now = new Date();
                let year = now.getFullYear();
                let month = now.getMonth() ;
                let day = now.getDate();
                let hour = now.getHours();
                return new Date(year, month, day, hour,);
            },
        },
    };
</script>

<style lang="less" scoped>
    .enterWarehouseNumber {
        width: 100%;
        padding-bottom: 18px;
        border: 1px solid #e8e8e8;

        .formRow {
            .el-row {
                margin-bottom: 15px;

                .el-button {
                    margin-left: 20px;
                }
            }
        }

        .formRow {
            padding: 10px;
        }

        .divTitle {
            font-size: 18px;
            padding: 8px;
            border-bottom: 1px solid;
            margin-bottom: 15px;
            //  color: #31708f;
            // background-color: #d9edf7;
            // border-color: #bce8f1;
            color: #0f5a8c;
            background: #f8f8f8;
            border-bottom: 1px solid #e8e8e8;
        }

        span {
            display: inline-block;
            width: 100px;
            text-align: right;

            +.el-input,
            .el-select {
                //width: 50%;
                width: calc(100% - 110px);
            }

            +.el-select {
                width: calc(100% - 110px);
            }
        }

        // .optional-content span {
        //      +.el-input,
        //     .el-select {
        //         //width: 50%;
        //         width: calc(100% - 110px);
        //     }

        //     +.el-select {
        //         width: calc(100% - 110px);
        //     }
        // }        

        .size {
            display: inline-block;

            .el-input {
                width: 80px;
                margin: 0 9px 0 8px;
            }

            .el-input:last-child {
                margin-right: 0;
            }
        }

        .package-icon {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            width: 18px;
            height: 18px;
            font-size: 18px;
            border-radius: 50%;
            cursor: pointer;
        }

        .el-icon-circle-plus {
            color: #f56c6c;
        }

        .el-icon-remove {
            color: #5daf34;
        }

        .table-box {
            @table-width: 100%;
            @table-border: 1px solid #e8e8e8;
            margin: 15px;
            // width: @table-width;
            border: @table-border;

            .el-row {
                .el-col {
                    height: 28px;
                    line-height: 28px;
                    overflow: hidden;
                    text-align: center;
                    border-right: @table-border;
                    border-top: @table-border;
                }

                .el-icon-circle-plus-outline {
                    position: absolute;
                    top: 6px;
                    left: 110px;
                    pointer-events: all;
                }

                .el-icon-circle-plus-outline,
                .el-icon-setting,
                .el-icon-delete {
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 5px;
                }
            }

            .expansion {
                .el-col {
                    border-bottom: @table-border;
                }
            }

            .table-row:last-child>.el-row .el-col {
                border-bottom: @table-border;
            }

            .title {
                +.el-row .el-col {
                    border-top: none;
                }

                +.table-row>.el-row .el-col {
                    border-top: none;
                }

                .el-col {
                    border-top: none;
                    border-bottom: @table-border;
                }
            }

            .sub-table {
                width: @table-width * 0.7;

                .el-row {
                    width: (@table-width * 0.7) - 1;

                    .el-col:last-child {
                        border-right: @table-border;
                    }
                }
            }
        }
    }

    .content {
        display: flex;
        max-height: 600px;
        overflow: scroll;

        h4 {
            height: 30px;
            line-height: 30px;
            color: #000;
        }

        .left {
            flex: 1;
            // width:500px;
        }

        .right {
            flex: 1;

            //  margin-left:10px;
            /deep/ td:first-child {
                border-left: none;
            }

            /deep/ th:first-child {
                border-left: none;
            }
        }

        .cblue {
            color: #004c82;
            cursor: pointer;
            vertical-align: middle;
            padding: 0 2px;
            font-size: 16px;

            span {
                font-size: 14px;
            }
        }

        .peihuoZiTable {
            padding: 0px;

            /deep/ th {
                background-color: #dfffd0;
            }

            /deep/ td {
                background-color: #dfffd0;
            }
        }
    }

    .hawbpane {
        margin-top: 20px;

        span {
            color: #004c82;
            display: inline-block;
            width: 80px;
        }
    }
</style>