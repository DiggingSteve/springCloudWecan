<template>
    <div>
        <div class="page-container-box">
            <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
                :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1"
                :chinese-where.sync="chineseWhere" @reset="reset">
            </newSearchComp>

            <!-- {{hawbCost}} -->
            <div class="searchForm">
                <el-button @click="search">查询</el-button>
            </div>

        </div>
        <!-- <el-button  @click="costMaking = true" type="text">费用制作</el-button> -->
        
       
        <tableCompt :name="name" tableWagedom='结算' :table-data-res="tableDataRes" :nestedTableType="2"
            v-on:transmitMsg="getZimessage" :ziTableData="ziTableData" showZiConfig :showTotal="showTotal"
            :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog" @transSelIndex="openDialog2">

            <!--  <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)"   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template> -->
            <template slot="operate" slot-scope="props">
                <el-badge is-dot class="item"   v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "    :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
                    <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
                </el-badge>
            </template> 

        </tableCompt>

        <!-- 总单费用制作非合并 -->
        <el-dialog title="费用未确认(本站订单)" :visible.sync="costMaking" width="100%" top="0" v-if="costMaking"
            @close="uncostMaking" :close-on-press-escape=false class="dialogPage" :modal="false" center>
            <!-- 销售站BOAE2009020003PVG(HGH)是35，操作站 BOAE2010130004PVG-OSD 30； -->
            <costmaking :mawbguid="mawbguid" :initiator="tableDataRes[selectedTableIndex].childguid>0?35:30"
                @unvisible="uncostMaking" :showSuggestWage="!projectIsWecan" :boguid="boguid" ref="costDialog">
            </costmaking>
            <!-- <span slot="footer">

        </span> -->
        </el-dialog>

        <el-dialog :visible.sync="costControlDialog" title="批量成本分摊" width="90%" top="4%" center v-if="costControlDialog"
            :close-on-press-escape="false" append-to-body>
            <span slot="title">
                <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
                <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
                    @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
            </span>
            <costControlTool></costControlTool>
        </el-dialog>

        <el-dialog :visible.sync="shareRecordDialog" width="90%" title="批量成本分摊记录" top="4%" center
            v-if="shareRecordDialog" :close-on-press-escape="false" append-to-body>
            <span slot="title">
                <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
                <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
                    @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
            </span>
            <shareRecord></shareRecord>
        </el-dialog>

        <!-- 综合查询 -->
        <el-dialog title="综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
            :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
            <mawbaddput :visible.sync="dialogShow" :pagetype='20' :mawbguid="mawbguid" :boguid="boguid" :area="area"
                :orderdom="orderdom"></mawbaddput>
        </el-dialog>

        <i class="backtop" v-backtop v-scrollshow:100='isBackShow' v-show="isBackShow.value"></i>
        <component :is="childrenComponent" v-if="OrderVisible"></component>
    </div>
</template>

<script>
    import {
        systemCheck, openZimessage, searchCmptMixins, manageShMethod, renderHtml
    } from '@/components/mixins/topPageMixin'
    import managerDetail from "../wffmanagement/orderDetail/managerDetail";
    import managerDetailTz from "../wffmanagement/orderDetail/managerDetailTz";
    import {
        searCondition,
        filterGroupid,
        getChangeValue,
        formatDate
    } from '../api/localStorage.js'
    var parentComponent = {
        name: 'costConfirmation',
        mixins: [systemCheck, openZimessage, searchCmptMixins, manageShMethod],
        components: { managerDetail, managerDetailTz },
        props: {
            isMonitor: {
                type: Boolean,
                default: false
            },
            pagetype:{
                type:[Number,String]
            }
        },
        data() {
            return {
                name: "costConfirmation.vue",
                costMaking: false,
                isBackShow: {
                    value: false
                },
                inputViewData: {
                    //  confirmstatus: {
                    //   title: "费用状态",
                    //   type: 5,
                    //   whereStr: "in",
                    //   fieldtype: 5,
                    //   options: [
                    //     { label: "结算未确认", value: "1" },
                    //     { label: "结算已确认", value: "700" }
                    //   ]
                    // },
                    hbrq: {
                        title: "航班日期",
                        type: 15,
                        defaultEnd: true
                    },
                    canceltype: {
                        title: '撤单类型',
                        type: 5,
                        whereStr: 'in',
                        groupid: 135,
                        disabled: true
                    },
                    cancelman: {
                        'title': '撤单人',
                        type: 1,
                        disabled: true
                    },
                },
                inputModelData: {
                    status: this.pagetype == 2 ? 'AO5060,AO5070' : 'AO5060,AO5065',
                    "confirmstatus": "1",
                    //signman:  this.pagetype == 2?localStorage.getItem("usrname"):''
                },
                selectedTableIndex: "",
                showReason: false,
                reasonData: {}, //取消对账原因数据
                accountNameItemsActive: '', //结算对象激活
                delbillmanActive: 0, //取消对账人激活
                costItemsActive: 0, //费用激活
                arrowIndex: 0, //费用箭头
                arrowDelBillManIndex: 0, //取消对账人箭头
                arrowAcnIndex: 0, //结算对象箭头
                costControlDialog: false, //批量分摊弹窗
                shareRecordDialog: false,
                hawbCost: false, //分单费用弹窗
                confirmStatusout: '',
                confirmStatusin: '',
                dialogShow: false,
                selectTableIndex: '-1',
                orderdom: '',
                area: '',
                wageRejectin: false,
                wageRejectout: false,
                initiator: ''
            }
        },
        watch: {
            accountNameItemsActive(newVal) {
                this.delbillmanActive = 0
                this.costItemsActive = 0
                // 重置取消对账人位置
                this.arrowDelBillManIndex = 1
                this.changeDirectionDelBillMan(1)
            }
        },
        methods: {
            search() {
                //var jsonArr=searCondition(this.inputViewData)

                if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
                    return this.$message.error('请输入或选择查询条件！');
                }

                this.tableDataRes = []
                this.ziTableData = []
                var search = JSON.parse(JSON.stringify(this.searchData))
                // search.delbillreason = ''
                //search.orderguid="-1"//本站
                if (this.isMonitor) {
                    search.delbillreason = ''
                    if (search.hbrq && !search.hbrq.begin) {
                            let begin = new Date();
                            begin.setFullYear(begin.getFullYear() - 1);
                            search.hbrq.begin = formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
                    }
                } else {
                    if (!search.status) {
                        search.status = {
                            "begin": "500"
                        }
                    }

                    if (
                        search.confirmstatus &&
                        search.confirmstatus.in == "1" &&
                        !this.$store.state.isWorkUnFinish
                    ) {
                        if (search.hbrq && !search.hbrq.begin) {
                            let begin = new Date();
                            begin.setMonth(begin.getMonth() - 2);
                            search.hbrq.begin = formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
                        }
                    }
                }


                //search.ispriorcheck='2'

                var jsonArr2 = {
                    where: search,
                    "order": "hbrq asc,qfsj asc"
                }
                var json = {
                    'json': JSON.stringify(jsonArr2),
                    routerName: this.name.split('.')[0]
                }
                let api = this.isMonitor ? 'api/ExHpoboAxplineWageConfirmMonitor' : 'api/ExHpoboAxplineWageConfirm'
                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + api,
                    params: json,
                    loading: true,
                    tip: true
                }).then(results => {
                    //results.data.filter(item=>{return item.unequal ==''})
                    //console.log(results)
                    if (results.data.length == 0) {
                        this.$message('无查询结果');
                        return;
                    } else {
                        this.pageshow = false
                    }
                    results.data = getChangeValue(results.data, '空出')

                    setTimeout(() => {
                        // this.tableDataRes=results.data.filter(i=>{
                        //     return i.pono.indexOf('-')<0
                        // });
                        this.tableDataRes = results.data
                        //  this.tableDataRes=results.data.sort(function(a, b) {
                        //       return this.SortByProps(a, b, {
                        //           "hbrq": "ascending",
                        //           "qfsj": "ascending"
                        //       });
                        //   });
                    }, 20)
                })
                    .catch(errors => {

                    })
            },
            openChatRoome(row){
                //this.$emit('openChatRoome',obj)
                //从表格列表项进入 使用下面代码
                this.$store.commit("setChat", { status: true, data: row });
            },
            SortByProps(item1, item2, obj) {
                let props = [];
                if (obj) {
                    props.push(obj)
                }
                let cps = [];
                // 存储排序属性比较结果。
                // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
                // 记录下两个排序项按照各个排序属性进行比较得到的结果
                let asc = true;
                if (props.length < 1) {
                    for (let p in item1) {
                        if (item1[p] > item2[p]) {
                            cps.push(1);
                            break;
                            // 大于时跳出循环。
                        } else if (item1[p] === item2[p]) {
                            cps.push(0);
                        } else {
                            cps.push(-1);
                            break;
                            // 小于时跳出循环。
                        }
                    }
                } else {
                    for (let i = 0; i < props.length; i++) {
                        let prop = props[i];
                        for (let o in prop) {
                            asc = prop[o] === "ascending";
                            if (item1[o] > item2[o]) {
                                cps.push(asc ? 1 : -1);
                                break;
                                // 大于时跳出循环。
                            } else if (item1[o] === item2[o]) {
                                cps.push(0);
                            } else {
                                cps.push(asc ? -1 : 1);
                                break;
                                // 小于时跳出循环。
                            }
                        }
                    }
                }
                // 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
                for (let j = 0; j < cps.length; j++) {
                    if (cps[j] === 1 || cps[j] === -1) {
                        return cps[j];
                    }
                }
                return false;
            },
            openDialog(indexData) {
                if (this.tableDataRes[indexData].tzType == '单票') {
                    this.initiator = this.tableDataRes[indexData].childguid > 0 ? 35 : 30
                    this.getWffDetail(this.tableDataRes[indexData])
                } else {
                    this.selectedTableIndex = indexData
                    this.mawbguid = this.tableDataRes[indexData].guid
                    this.boguid = this.tableDataRes[indexData].boguid
                    this.costMaking = true
                }

                //this.confirmStatusout=this.tableDataRes[indexData].confirmstatus_out
                //this.confirmStatusin=this.tableDataRes[indexData].confirmstatus_in
            },
            openDialog2(indexData) { //综合明细
                this.selectTableIndex = indexData
                this.mawbguid = this.tableDataRes[indexData].guid
                this.boguid = this.tableDataRes[indexData].boguid
                this.orderdom = this.tableDataRes[indexData].orderdom
                this.area = this.tableDataRes[indexData].area
                this.dialogShow = true
            },

            uncostMaking() {
                this.costMaking = false;
                // 重新计算应收应付金额
                this.tableDataRes[this.selectedTableIndex].wageall_in = this.$refs.costDialog.zdtotalCharge
                this.tableDataRes[this.selectedTableIndex].wageall_out = this.$refs.costDialog.zdtotalPayment
                this.tableDataRes[this.selectedTableIndex].wageprofit = this.$refs.costDialog.zdtotalProfit
            }
        },
        created() {
            if (this.isMonitor) {
                this.inputViewData.hbrq = {
                    title: "航班日期",
                    type: 15,
                    defaultVal: false,
                    defaultEnd: true,
                    endtype: 3
                }
            }
        },
        mounted() {
        console.log(this.mng)
            this.childrenComponent = renderHtml.call(
                this,
                parentComponent,
                1,
                {
                    title: '费用审批',
                    origin: '结算'
                }
            )

        },
        computed: {}


    }
    export default parentComponent
</script>