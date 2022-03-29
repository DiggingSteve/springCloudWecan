<template>
    <div style="display: inline;">
        <i class="el-icon-chicun" @click="sizeRowData" style="cursor: pointer;" v-if="pagetype==1"></i>

        <span v-if="pagetype==2" @click="sizeRowData">
            <slot></slot>
        </span>
        <!--左键弹框 -->
        <!--尺寸 -->
        <el-dialog :visible.sync="sizeDialog" width="1000px" top="4%" center v-if="sizeDialog&&sizeInfo" append-to-body
            :close-on-press-escape="false" custom-class="sizeDialogClass">
            <h3>订舱编号：{{sizeInfo.hpoInfo&&sizeInfo.hpoInfo.pono}}</h3>
            <div style="width:900px">
                <!-- 运价信息 -->
                <h4><span class="sizeLeft">运价信息</span><span class="sizeRight" @click="copyContent('yjinfo')">复制内容</span>
                </h4>
                <div class="info">
                    <table id="yjinfo" v-if="sizeInfo.hpoInfo">
                        <tr>
                            <td>销售站运价类型：{{sizeInfo.xshpoInfo?sizeInfo.xshpoInfo.isinwageallin=='-1'?'':sizeInfo.xshpoInfo.isinwageallin:'--'}}
                            </td>
                            <td>销售站运价单价：{{sizeInfo.xshpoInfo?sizeInfo.xshpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeInfo.xshpoInfo.inwagecostprice).toFixed(2):'--'}}
                            </td>
                        </tr>
                        <tr>
                            <td>应收运价类型：{{sizeInfo.hpoInfo.isinwageallin=='-1'?'':sizeInfo.hpoInfo.isinwageallin}}</td>
                            <td>应收运价单价：{{sizeInfo.hpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeInfo.hpoInfo.inwagecostprice).toFixed(2)}}
                            </td>
                        </tr>
                        <tr>
                            <td>应付运价类型：{{sizeInfo.hpoInfo.isoutwageallin=='-1'?'':sizeInfo.hpoInfo.isoutwageallin}}</td>
                            <td>应付运价单价：{{sizeInfo.hpoInfo.outwageallinprice=='666666'?'0.00':Number(sizeInfo.hpoInfo.outwageallinprice).toFixed(2)}}
                            </td>
                        </tr>
                    </table>
                </div>


                <!-- 预报尺寸 -->
                <h4><span class="sizeLeft">预报尺寸(上榜时填写)</span><span class="sizeRight" @click="copyContent('ybcc')">复制内容</span>
                </h4>

                <div class="info" style="padding:0px;border:none">
                    <table id="ybcc" v-if="sizeInfo.hpoInfo">
                        <tr>
                            <td>
                                <el-input type="textarea" rows="3" v-model="sizeInfo.hpoInfo.ybvolumeremark"></el-input> 
                            </td>
                        </tr>
                    </table>
                </div>


                <!-- 预报尺寸 -->
                <h4><span class="sizeLeft">预报尺寸(操作时填写)</span><span class="sizeRight" @click="copyContent('ybccc')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="ybccc">
                        <tr v-for="(i,index) in sizeInfo.ybList">
                            <td v-for="(i2,index2) in i">
                                ({{2*index+index2+1}}){{Number(i2.vol_longs_yb)}}*{{Number(i2.vol_widths_yb)}}*{{Number(i2.vol_heights_yb)}}*{{Number(i2.vol_piece_yb)}}={{StringNum(Number((i2.vol_longs_yb*i2.vol_widths_yb*i2.vol_heights_yb))/1000000*Number(i2.vol_piece_yb))}}{{i2.packagetypename_yb}}
                            </td>
                        </tr>

                    </table>


                </div>


                <h4><span class="sizeLeft">客户确认尺寸</span><span class="sizeRight" @click="copyContent('qrcc')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="qrcc">
                        <tr v-for="(i,index) in sizeInfo.qrList">
                            <td v-for="(i2,index2) in i">
                                <span>({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}</span>
                            </td>
                        </tr>

                    </table>

                </div>

                <h4><span class="sizeLeft">入库尺寸</span><span class="sizeRight" @click="copyContent('sjcc')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="sjcc">
                        <tr v-for="(i,index) in sizeInfo.sjList">
                            <td v-for="(i2,index2) in i">
                                <span>({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}</span>
                            </td>
                        </tr>

                    </table>

                </div>
                <h4><span class="sizeLeft">中英文品名</span><span class="sizeRight" @click="copyContent('zywpm')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="zywpm">
                        <tr v-for="(i,index) in sizeInfo.axpList">
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                <span>({{index+1}}){{i.hawb}}:{{i.chinesepm}},{{i.englishpm}}</span>
                            </td>
                        </tr>

                    </table>

                </div>

                <h4><span class="sizeLeft">备注信息</span><span class="sizeRight" @click="copyContent('bzxx')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="bzxx" v-if="sizeInfo.hpoInfo">
                        <tr>
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                <span>{{sizeInfo.hpoInfo.remark}}</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <h4><span class="sizeLeft">航线尺寸备注</span><span class="sizeRight"
                        @click="copyContent('hxccbz')">复制内容</span></h4>

                <div class="info">
                    <table id="hxccbz" v-if="sizeInfo.hpoInfo">
                        <tr>
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                <span>{{sizeInfo.hpoInfo.volumeremark}}</span>
                            </td>
                        </tr>
                    </table>
                </div>

            </div>

        </el-dialog>
    </div>
</template>
<script>

    export default {
        props: {
            boguid: [String, Number],
            pagetype: {
                type: [String, Number],
                default: 1//以尺寸图标的形式显示，2
            }
        },
        components: {},
        data() {
            return {
                sizeDialog: false,
                sizeInfo: {}
            };
        },

        created() {
        },
        computed: {

        },
        methods: {

            /*****************************尺寸信息************************************/
            sizeRowData() {
                this.sizeDialog = true
                let sizeArr = []
                let sizeArr2 = []
                let sizeArr3 = []
                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineGetBillSize',
                    params: {
                        boguid: this.boguid
                    },
                    loading: true,
                    tip: false
                })
                    .then(results => {
                        this.sizeInfo = results.data

                        if (this.sizeInfo.hpoInfo) {
                            if (this.sizeInfo.hpoInfo.isinwageallin == '1') {
                                this.sizeInfo.hpoInfo.isinwageallin = '单价ALLIN'
                                this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
                            } else if (this.sizeInfo.hpoInfo.isinwageallin == '2') {
                                this.sizeInfo.hpoInfo.isinwageallin = 'M级++'
                                this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
                            } else if (this.sizeInfo.hpoInfo.isinwageallin == '3') {
                                this.sizeInfo.hpoInfo.isinwageallin = '单价++'
                                this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
                            } else if (this.sizeInfo.hpoInfo.isinwageallin == '4') {
                                this.sizeInfo.hpoInfo.isinwageallin = 'Cost++'
                                //this.sizeInfo.hpoInfo.isinwageallin = 'Cost++'
                            }
                            if (this.sizeInfo.hpoInfo.isoutwageallin == '1') {
                                this.sizeInfo.hpoInfo.isoutwageallin = '单价ALLIN'
                            } else if (this.sizeInfo.hpoInfo.isoutwageallin == '2') {
                                this.sizeInfo.hpoInfo.isoutwageallin = 'M级++'
                            } else if (this.sizeInfo.hpoInfo.isoutwageallin == '3') {
                                this.sizeInfo.hpoInfo.isoutwageallin = '单价++'
                            }
                        }

                        if (this.sizeInfo.xshpoInfo) {
                            if (this.sizeInfo.xshpoInfo.isinwageallin == '1') {
                                this.sizeInfo.xshpoInfo.isinwageallin = '单价ALLIN'
                                this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
                            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '2') {
                                this.sizeInfo.xshpoInfo.isinwageallin = 'M级++'
                                this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
                            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '3') {
                                this.sizeInfo.xshpoInfo.isinwageallin = '单价++'
                                this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
                            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '4') {
                                this.sizeInfo.xshpoInfo.isinwageallin = 'Cost++'
                                //this.sizeInfo.hpoInfo.isinwageallin = 'Cost++'
                            }
                        }

                        let ybList = [];
                        let sjList = [];
                        let qrList = [];
                        let ybStoreList = [];
                        let sjStoreList = [];
                        let qrStoreList = [];

                        this.sizeInfo.storeList.forEach(i => {
                            if (sjList.indexOf(i.vol_guid) == '-1' && i.vol_guid != 0) {
                                // i.vol_heights=Number(i.vol_heights/100).toFixed(2)
                                // i.vol_longs=Number(i.vol_longs/100).toFixed(2)
                                // i.vol_widths=Number(i.vol_widths/100).toFixed(2)
                                sjList.push(i.vol_guid)
                                sjStoreList.push(i)
                            }
                        })

                        this.sizeInfo.storeYbList.forEach(i => {
                            if (ybList.indexOf(i.vol_guid_yb) == '-1' && i.vol_guid_yb != 0) {
                                // i.vol_heights_yb=Number(i.vol_heights_yb/100).toFixed(2)
                                // i.vol_longs_yb=Number(i.vol_longs_yb/100).toFixed(2)
                                // i.vol_widths_yb=Number(i.vol_widths_yb/100).toFixed(2)
                                ybList.push(i.vol_guid_yb)
                                ybStoreList.push(i)
                            }
                        })

                        this.sizeInfo.customstoreList.forEach(i => {
                            if (qrList.indexOf(i.vol_guid) == '-1' && i.vol_guid != 0) {
                                // i.vol_heights_yb=Number(i.vol_heights_yb/100).toFixed(2)
                                // i.vol_longs_yb=Number(i.vol_longs_yb/100).toFixed(2)
                                // i.vol_widths_yb=Number(i.vol_widths_yb/100).toFixed(2)
                                qrList.push(i.vol_guid)
                                qrStoreList.push(i)
                            }
                        })

                        for (var i = 0; i < ybStoreList.length; i += 2) {
                            sizeArr.push(ybStoreList.slice(i, i + 2));
                        }

                        for (var i = 0; i < sjStoreList.length; i += 2) {
                            sizeArr2.push(sjStoreList.slice(i, i + 2));
                        }

                        for (var i = 0; i < qrStoreList.length; i += 2) {
                            sizeArr3.push(qrStoreList.slice(i, i + 2));
                        }

                        this.sizeInfo.sjList = sizeArr2
                        this.sizeInfo.ybList = sizeArr
                        this.sizeInfo.qrList = sizeArr3


                        console.log(this.sizeInfo)


                    })
                    .catch(error => {

                    })

            },

            copyContent(element) {
                var range = document.createRange();
                var startNode = document.getElementById(element);
                range.selectNode(startNode);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range)
            },
            //浮点数   
            StringNum(num) {
                var returnNum = num.toLocaleString();
                returnNum = returnNum.replace(/[,]/g, '');
                return Number(returnNum).toFixed(2)
            },

        },
        watch: {}
    };
</script>
<style lang="less" scoped>
    .sizeDialogClass {
        h3 {
            color: #0f5a8c;
            font-weight: bolder;
            margin-top: -25px;
        }

        h4 {
            margin-top: 10px;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            font-weight: normal;
            margin-bottom: 15px;

            .sizeLeft {
                float: left;
                display: inline-block;
            }

            .sizeRight {
                float: right;
                display: inline-block;
                background: #e8eef5;
                border-radius: 20px;
                color: #517da3;
                padding: 2px;
                padding-left: 10px;
                padding-right: 10px;
                cursor: pointer;
            }
        }

        .info {
            width: 900px;
            min-height: 50px;
            border: 1px solid #e7e7e7;
            border-radius: 3px;
            padding: 12px;
            margin-top: 10px;
            letter-spacing: 0.1em;

            table {
                table-layout: fixed;
                width: 900px;

                td {
                    width: 400px;
                }
            }
        }
    }
</style>