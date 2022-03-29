<template>

    <div class="fenpei">
        <!-- 没有用v-if 是担心原来的组件实例化的时候可能修改了一些值，用v-if可能不会生成这些值 -->
        <div v-show="pagetype==1">
            <div :class="{fenpeidiv:pagetype==1}">

                <div>
                    <el-row v-if="showFp">
                        <el-col :span="4">

                            <p style="margin-bottom:15px;">Step1.请选择服务</p>
                            <el-checkbox v-model="allCheck">全选</el-checkbox>
                            <div v-for="i in fpPorts">
                                {{i}}:
                                <el-checkbox-group v-model="sfgwkfw">
                                    <!-- <el-checkbox v-for="(item,index) in fpsfg" :label="item.servicecode" :key="index" style="display:block;margin-bottom:10px"   @change="getsfgfw(item.servicecode)" :disabled="sfgfpdataShow.length>0" v-if="item.port==i"><span :class="[item.orderindex=='0'?'fdzy':'']" >{{item.assignname}}</span></el-checkbox> -->
                                    <el-checkbox v-for="(item,index) in fpsfg" :label="item.servicecode" :key="index"
                                        style="display:block;margin-bottom:10px" @change="getsfgfw(item.servicecode)"
                                        v-if="item.port==i" :disabled="item.assignstatus=='1'"><span
                                            :class="[item.orderindex=='0'?'fdzy':'']">{{item.assignname}}</span>
                                    </el-checkbox>

                                </el-checkbox-group>
                            </div>



                        </el-col>
                        <el-col :span="3">
                            <p style="margin-bottom:53px;">分配状态</p>

                            <div v-for="i in fpPorts" style="margin-bottom:22px;">

                                <p v-for="(item,index) in fpsfg" style="height:29px" v-if="item.port==i">
                                    <span v-if="item.assignstatus==0" style="color:red">未分配</span>
                                    <span v-if="item.assignstatus==1" style="color:green">已分配</span>
                                </p>
                            </div>
                            <!-- <p v-for="(item,index) in fpsfg" :style="{'margin-top':item.port=='目的港服务'?item.top:'','height':'29.23px'}">
 <span v-if="item.assignstatus==0" style="color:red">未分配</span>
 <span v-if="item.assignstatus==1" style="color:green">已分配</span>
</p> -->


                        </el-col>
                        <el-col :span="5">
                            <p style="margin-bottom:20px;">Step2.请选择分配区域</p>
                            <!-- <p v-if="area==conditionalAreaForBuild&&(realsfgwkfw.indexOf('提货服务')!='-1'||realsfgwkfw.indexOf('送货服务')!='-1')" style="margin-bottom:10px;margin-top:-3px;">
 <el-radio v-model="station" label="1" :disabled="!((realsfgwkfw.indexOf('提货服务')!='-1'&&realsfgwkfw.length==1)||(realsfgwkfw.indexOf('送货服务')!='-1'&&realsfgwkfw.length==1)||(realsfgwkfw.indexOf('提货服务')!='-1'&&realsfgwkfw.indexOf('送货服务')!='-1'&&realsfgwkfw.length==2))">本站</el-radio>
 <el-radio v-model="station" label="2">外站</el-radio>
</p> -->
<!--                             <el-select v-model="sfgarea" placeholder="请选择">
                                <el-option-group v-for="group in fparea" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-option-group>
                            </el-select> -->

                            <areaSelect :model.sync="sfgarea" pagetype="1" :multiple="false" :required="true" valuetype="2" :usedarea="fparea.map(i=>i.options).flat().map(i=>i.label).join(',')" style="width:186px;">
                                
                            </areaSelect>

                            <div v-if="sfgarea">
                                <p style="margin-bottom:20px;margin-top:24px;">Step3.请选择分配模式</p>
                                <el-select v-model="sfgfpmsv" placeholder="请选择">
                                    <el-option v-for="item in sfgfpms" :key="item" :label="item" :value="item" :disabled="orderguid>0&&item.indexOf('利润分配')>=0">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="12" v-if="sfgfpmsv&&pagetype==1">
                            <p style="margin-bottom:20px;">Step4.利润参数</p>
                            <!-- <div v-if="sfgfpmsv=='利润分配模式'&&realsfgwkfw.indexOf('配舱服务')!=-1">
    <formcompt :input-view-data="sfglrfpmodel" style="margin-left:-60px;" :sfgfpmsv="sfgfpmsv"></formcompt>
  </div> -->
                            <!-- <div v-if="sfgfpmsv=='利润分配模式'&&realsfgwkfw.indexOf('配舱服务')==-1">
  </div> -->

                            <div v-if="sfgfpmsv=='利润分配模式'">
                                <formcompt :input-view-data="sfglrfpmodel" style="margin-left:-60px;"
                                    :sfgfpmsv="sfgfpmsv">
                                </formcompt>
                            </div>

                            <div v-else-if="sfgfpmsv=='Co-Load模式'">

                                <formcompt :input-view-data="sfgcoloadms" style="margin-left:-60px;"
                                    :input-model-data="sfgcoloadmsModelData">
                                </formcompt>
                            </div>

                            <!-- <div v-else-if="sfgfpmsv=='Co-Load模式'&&realsfgwkfw.indexOf('配舱服务')!=-1">
  
     <formcompt :input-view-data="sfgcoloadms" style="margin-left:-60px;" :input-model-data="sfgcoloadmsModelData">

   
                        </formcompt>
                      </div> -->

                            <!-- <div v-else-if="sfgfpmsv=='Co-Load模式'&&realsfgwkfw.indexOf('配舱服务')==-1&&sfgcoloadNo.length>2">
                        <formcompt :input-view-data="sfgcoloadNo" style="margin-left:-60px;"></formcompt>
                      </div> -->



                        </el-col>
                    </el-row>

                    <el-button type="primary" style="margin-top:15px;" @click="assignH" v-if="showFp"
                        :disabled="disabledFp">分配
                    </el-button>
                    <el-button @click="cancelFpAll" v-if="showAllFp">取消所有分配</el-button>

                    <table style="table-layout: fixed;" class="fpTable">
                        <tr>
                            <th>操作</th>
                            <th>服务</th>
                            <th>分配区域</th>
                            <th>分配模式</th>
                            <!--  <th>本站操作人</th> -->
                            <th>费用</th>
                            <th>类型</th>
                            <th>币种</th>
                            <th>分利(WFF:操作站)</th>
                        </tr>
                        <!--     {{sfgfpdataShow}} -->
                        <tr v-for="(item,index) in sfgfpdata" :style="{background:index%2==0?'white':'#f8f8f8'}">
                            <td>
                                <el-button style="height:26px;line-height:10px;"
                                    @click="cancelFp(item.servicecode,index)">
                                    取消分配
                                </el-button>
                            </td>
                            <td :title="item.assignname"
                                style="width:280px;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;">
                                {{item.assignname}}</td>
                            <td>{{item.assignarea}}</td>
                            <td>{{item.profitmode }}</td>
                            <!--     <td>{{item.czr}}</td> -->
                            <td>{{item.profitmode=='利润分配模式'?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}
                            </td>
                            <td>{{item.isinwageallin?(item.isinwageallin=='1'?'单价ALLIN':item.isinwageallin=='2'?'总价':'单价++'):''}}
                            </td>
                            <td>{{item.inwageallinprice?item.currency:'--'}}</td>
                            <td>
                                {{item.profitmode=='Co-Load模式'&&item.isinwageallin=='2'||!item.inwageallinprice?'--':item.self_profitvalue}}:{{item.profitmode=='Co-Load模式'&&item.isinwageallin=='2'||!item.inwageallinprice?'--':item.cus_profitvalue}}
                            </td>
                        </tr>
                    </table>

                </div>



            </div>



            <slot>
                <el-button @click="confirmFp" :disabled="assignDisable" type="primary">确认分配</el-button>
            </slot>

        </div>
        <div v-show="pagetype==2&&inputModelData.area" style="position: relative;min-width: 600px;">

            <!-- 新增页面的分配 -->
            <newFormCmpt :view-data.sync="basicinfoView" :model-data.sync="sfgareaobj" :pagetype="2">
            </newFormCmpt>
            <p style="color:red;position: absolute;left:300px;top:10px;" v-if="inputModelData.isneedfenpei">
                注意：所有选中服务都将被分配</p>

            <div class="contentCmpt page-container-main" v-if="sfgarea&&!sfgarea.includes(inputModelData.area)">

                <!-- <div>
                    <div class="input-item">
                        <div class="input-title">请选择分配区域</div>
                        <div class="input-content">
                            <el-select v-model="sfgarea" placeholder="请选择">
                                <el-option-group v-for="group in fparea" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </div>
                    </div>
                </div> -->


                <div style="width:100%">
                    <div class="input-item">
                        <div class="input-title">请选择分配模式</div>
                        <div class="input-content input-required">
                            <el-select v-model="sfgfpmsv" placeholder="请选择">
                                <el-option v-for="item in sfgfpms" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>

                <div v-if="sfgfpmsv=='利润分配模式'">
                    <formcompt :input-view-data="sfglrfpmodel" :sfgfpmsv="sfgfpmsv">
                    </formcompt>

                    <!-- <newFormCmpt :view-data.sync="newsfglrfpmodel" :model-data.sync="inputModelData" :pagetype="2">
                    </newFormCmpt> -->
                </div>

                <div v-else-if="sfgfpmsv=='Co-Load模式'">

                    <formcompt :input-view-data="sfgcoloadms" :input-model-data="sfgcoloadmsModelData">
                    </formcompt>
                    <!-- <newFormCmpt :view-data.sync="newsfgcoloadms" :model-data.sync="sfgcoloadmsModelData" :pagetype="2">
                    </newFormCmpt> -->


                </div>



            </div>



        </div>

    </div>

</template>

<script>
    ////console.log($('.mdgIm').length)
    //$('.input-content').eq(1).css("padding-top",'5px')
    //import { Notification } from 'element-ui';
    import formcompt from "../templates/formCompt"
    import { filterGroupid } from "../../api/localStorage.js"
    export default {
        // 始发港服务   //目的港服务   //总分单区别 1：分单  2：总单
        props: {
            fenpeiguid: {
                type: String
            },
            information: {//主营服务orderIndex 0
                type: Array
            },
            showFp: {
                type: Boolean,
                default: true
            },
            showAllFp: {
                type: Boolean,
                default: true
            },
            newAdd: {
                type: Number,
                default: 0
            },
            area: {
                type: String
            },
            orderIncompletePage: {
                type: Boolean,
                default: false
            },
            opersystem: {
                type: String,
                default: '出口',
            },
            system: '',
            pagetype: {//引用页面类型
                type: [Number, String],
                default: 1 //1正常引用 2订单新增页面

            },
            inputModelData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            orderguid:{
                type:[Number,String],
                default:-1
            },
            origin:String

        },
        components: {
            formcompt
        },
        data() {
            // && !i.typename.includes('海外部')
            let usedarea = JSON.parse(localStorage.groupType).filter(i => i.groupid == 101 && !i.typename.includes('大客户部')  && !i.typename.includes('市场部')).map(i => i.typename).join()
            return {
                areaBeifen: "",
                assignDisable: false,//请求静止点击分配按钮
                //serviceList:[],//分配List
                sfgwkfw: [],  //始发港勾选，显示的服务
                realsfgwkfw: [],//始发港真正需要处理服务

                // fparea:[],//始发港分配地区所有选项
                sfgfpmsv: "",//始发港分配模式值
                sfgarea: '',//始发港分配地区值
                mdgwkfw: [],  //目的港勾选的服务
                realmdgwkfw: [],//目的港真正需要处理服务
                mdgfpmsv: "",//目的港分配模式值
                mdgarea: '',//目的港分配地区值

                sfgfpdata: [],//始发港分配数据
                mdgfpdata: [],//目的港分配数据

                sfgfpdataShow: [],//始发港分配数据显示
                mdgfpdataShow: [],//目的港分配数据显示

                fpsfg: [],//始发港服务选项
                fpmdg: [],//目的港服务选项

                sfgfpms: ['Co-Load模式'],//始发港分配模式数据
                mdgfpms: ['Co-Load模式'],//目的港分配模式数据
                sfgcoloadmsModelData: {},
                // newsfglrfpmodel: {
                //     lrft: {
                //         title: "利润分配:",
                //         type: 9,
                //         options: [{ "title": "销售站", "id": "self_profitvalue", linkage: "cus_profitvalue", required: true }, { "title": "操作站", "id": "cus_profitvalue", linkage: "self_profitvalue", required: true }]
                //     }
                // },
                sfglrfpmodel: [{ "title": "利润分配:", class: 'width579', type: 9, options: [{ "title": "销售站", "model": "", "id": "self_profitvalue", required: true }, { "title": "操作站", "model": "", "id": "cus_profitvalue", required: true }], seque: "first", required: true }],
                //coload分配模式(始发港带主营)
                // newsfgcoloadms: {
                //     currency: {
                //         title: "币种",
                //         type: 3,
                //         idStyle: {
                //             width: "100%"
                //         },
                //         itemStyle: {
                //             width: "100%"
                //         },
                //         options: [],
                //     },
                //     inwageallinprice: {
                //         "title": "费用总价",
                //         verify: 'fixedFTwo',
                //         required: true,
                //         type: 1
                //     },
                //     isinwageallin: {
                //         type: 3,
                //         hidden: true,
                //         options: [{ "label": "单价ALLIN", "value": "1" }, { "label": "单价++", "value": "3" }, { "label": "总价", "value": "2" }],
                //     },
                //     first: {
                //         title: "分泡比例",
                //         type: 9,
                //         options:
                //             [
                //                 { "title": "销售站", "id": "self_profitvalue", required: true, linkage: "cus_profitvalue" },
                //                 { "title": "操作站", "id": "cus_profitvalue", required: true, linkage: "self_profitvalue" }
                //             ]
                //     },
                //     inwageallinprice_trans: {
                //         title: "中转费价格",
                //         verify: 'fixedFTwo',
                //         type: 1
                //     },
                //     isinwageallin_trans: {
                //         type: 3,
                //         hidden: true,
                //         options: [{ label: "单价", value: "1" }, { label: "总价", value: "2" }],
                //         verify: 'fixedFTwo',
                //     },
                //     second: {
                //         title: "中转分泡比例",
                //         type: 9,
                //         options:
                //             [
                //                 { "title": "销售站", "id": "self_real_bp_trans_in", required: true, linkage: "cus_real_bp_trans_in" },
                //                 { "title": "操作站", "model": "", "id": "cus_real_bp_trans_in", required: true, linkage: "self_real_bp_trans_in" }
                //             ]
                //     }
                // },
                sfgcoloadms: [
                    { "title": "币种", minW: '20', model: "", defaultModel: "", type: 4, options: [], idStyle: { width: '280px' }, id: "currency", required: true },
                    { "title": "费用总价", class: "width305", model: "", defaultModel: "", type: 1, id: "inwageallinprice", verify: 'fixedFTwo', required: true },
                    { "title": "", minW: '', class: "width350", model: "1", left: 8, defaultModel: "1", type: 3, options: [{ "label": "单价ALLIN", "value": "1" }, { "label": "单价++", "value": "3" }, { "label": "总价", "value": "2" }], id: "isinwageallin", paddingTop: '5px', hidden: true },
                    { "title": "分泡比例", class: 'width579', type: 9, options: [{ "title": "销售站", "model": "", "id": "self_profitvalue", required: true }, { "title": "操作站", "model": "", "id": "cus_profitvalue", required: true }], seque: "first", 'left': '28', required: true, hidden: true },
                    { "title": "中转费价格", class: "width305", model: "", defaultModel: "", type: 1, id: "inwageallinprice_trans", verify: 'fixedFTwo', hidden: true },
                    { "title": "", minW: '', class: "width350", left: 8, model: "1", defaultModel: "1", type: 3, options: [{ label: "单价", value: "1" }, { label: "总价", value: "2" }], id: "isinwageallin_trans", paddingTop: '5px', hidden: true },
                    { "title": "中转分泡比例", class: 'width579', type: 9, options: [{ "title": "销售站", "model": "", "id": "self_real_bp_trans_in", required: true }, { "title": "操作站", "model": "", "id": "cus_real_bp_trans_in", required: true }], seque: "second", 'left': '28', hidden: true },
                ],

                // 查询数据备份
                backUpData: [],
                disabledFp: false,
                station: '1',
                fpPorts: [],//服务有多少港口
                basicinfoView: {//第一步
                    sfgarea: {
                        title: '唯凯操作站点',
                        type: 37,
                        required: true,
                        multiple: false,
                        idStyle: { width: '100%' },
                        placeholder: '请选择唯凯操作站点',
                        usedarea: usedarea,
                        valuetype: 2,
                        disabled:false
                    },
                },
                sfgareaobj: { sfgarea: '' },

            }
        },
        methods: {
            initFunc() {

                //var newarr=[]
                //this.areaBeifen=this.$store.state.areaState
                if (this.showFp) {//非订单查询操作总分单分配信息
                    var num = 0
                    var sfgArrList = []
                    var mdgArrList = []
                    if (this.fenpeiguid) {

                        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxpline', loading: false, params: { boguidlist: this.fenpeiguid }, tip: false }).then(results => {
                            var jsonData = JSON.parse(localStorage.serviceData)
                            // filter(data=>data.wagedom==this.origin)
                            var data=[]
                            //if(this.area!='上海'){
                               data=results.data
                            //}
                            // else{
                            //    data=results.data.filter(data=>data.wagedom==this.origin)
                            // }
                            console.log(this.area)
                            console.log(data)
                            console.log(this.origin,11)
                            data.forEach(item => {

                                let serviced = jsonData.filter(i => { return i.servicecode == item.servicecode })[0]

                                item.port = serviced.port.split(',')[serviced.system.split(',').indexOf(this.system)]

                                if (!this.fpPorts.includes(item.port)) {
                                    this.fpPorts.push(item.port)
                                }

                                sfgArrList.push(item)


                                this.fpsfg = sfgArrList
                                // 默认勾选
                                //this.sfgwkfw.push(item.servicecode)
                                //this.getsfgfw(item.servicecode)


                            })


                            this.backUpData = JSON.parse(JSON.stringify(results.data))
                            var attachsfgShow = []
                            var aloneothersfgShow = []
                            var typenamesfg = ""
                            var servicecodesfg = ""
                            // var attachmdgShow=[]
                            // var aloneothermdgShow=[] 
                            // var typenamemdg=""

                            // 分配要传的数据
                            results.data.forEach(item => {
                                if (item.assignstatus == 1) {
                                    this.sfgfpdata.push(item)
                                }
                            })

                            // 分配显示的数据
                            this.backUpData.forEach(item => {

                                if (item.assignstatus == 1) {

                                    if (item.servicetype == "Attach") {
                                        typenamesfg += item.assignname + ',';
                                        servicecodesfg += item.servicecode + ',';
                                        attachsfgShow[0] = item
                                        attachsfgShow[0].assignname = typenamesfg.substring(0, typenamesfg.length - 1)
                                        attachsfgShow[0].servicecode = servicecodesfg.substring(0, servicecodesfg.length - 1)
                                    } else {
                                        aloneothersfgShow.push(item)
                                    }
                                    this.sfgfpdataShow = attachsfgShow.concat(aloneothersfgShow)
                                }



                            })


                        })
                            .catch(error => {

                            })
                    } else {


                        this.information.forEach(item => {

                            if (!this.fpPorts.includes(item.port)) {
                                this.fpPorts.push(item.port)
                            }

                            sfgArrList.push(item)

                            this.fpsfg = JSON.parse(JSON.stringify(sfgArrList))

                            var attachsfgShow = []
                            var aloneothersfgShow = []
                            var typenamesfg = ""
                            var servicecodesfg = ""


                        })
                        this.backUpData = JSON.parse(JSON.stringify(this.information))

                    }


                }


                // let groupData = JSON.parse(localStorage.getItem('groupType'))
                filterGroupid(this.sfgcoloadms)
            },

            getsfgfw(name) {//

                let currencyData = JSON.parse(localStorage.getItem('currencyData'))


                if (this.sfgwkfw.indexOf(name) != -1) {
                    if (name == "OA0010") {

                        this.sfgcoloadms[1]['title'] = '费用总价'
                        this.sfgcoloadms[2]['model'] = '1'
                        this.sfgcoloadms.forEach((i, index) => {
                            if (index >= 2) {
                                i.hidden = false
                            }
                        })
                        this.fpsfg.forEach(item => {
                            if (item.assignstatus == 0 && item.servicecode == name) {
                                if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf(item.servicecode) == -1) {
                                    this.realsfgwkfw.push(item)
                                }
                            }
                        })

                    } else {
                        if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf(name) == -1) {
                            this.realsfgwkfw.push(this.fpsfg.filter(i => { return i.servicecode == name })[0])
                        }
                    }
                } else if (this.sfgwkfw.indexOf(name) == -1) {
                    this.realsfgwkfw = this.realsfgwkfw.filter(i => { return i.servicecode != name })
                }


                if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf("OA0010") != -1) {
                    if (this.sfgfpms.indexOf('利润分配模式') == -1) {
                        this.sfgfpms.push('利润分配模式')
                    }
                } else {

                    if (this.sfgfpms.indexOf('利润分配模式') != -1) {
                        this.sfgfpms.splice(this.sfgfpms.indexOf('利润分配模式'), 1)
                    }

                    this.sfgcoloadms[1]['title'] = '运费总价'
                    this.sfgcoloadms[2]['model'] = '2'

                    this.sfgcoloadms[2]['hidden'] = true
                    this.sfgcoloadms.forEach((i, index) => {
                        if (index >= 2) {
                            i.hidden = true
                        }
                    })


                    //this.$forceUpdate()
                    console.log(this.sfgcoloadms)

                }

                if (name == 'OA0010') {
                    this.sfgfpmsv = ''
                }




            },
            verifyAssignment() { //验证分配信息
                if (this.realsfgwkfw.filter(i => i.assignstatus != '1').length == 0) {
                    this.$message.error('请选择服务')

                    return false
                }
                if (!this.sfgarea) {
                    this.$message.error('请选择分配区域')

                    return false
                }
                if (!this.sfgfpmsv) {
                    this.$message.error('请选择分配模式')
                    return false
                }

                if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf('OA0010') != -1) {

                    if (this.sfgfpmsv == '利润分配模式' && (!this.sfglrfpmodel[0].options[0].model || !this.sfglrfpmodel[0].options[1].model)) {
                        this.$message.error('操作站分泡比例不能为0');
                        return false
                    } else if (!this.sfgcoloadms[0].model && this.sfgfpmsv == 'Co-Load模式') {
                        this.$message.error('币种不能为空');
                        return false
                    } else if ((!Number(this.sfgcoloadms[1].model)) && this.sfgfpmsv == 'Co-Load模式') {
                        this.$message.error('费用不能为空');
                        return false
                    } else if (this.sfgcoloadms[2].model == '2' && Number(this.sfgcoloadms[1].model) < 100) {
                        this.$message.error('费用不能小于100');
                        return false
                    } else if (this.sfgfpmsv == 'Co-Load模式' && this.sfgcoloadms[2].model!='2'&&!(this.sfgcoloadms[3].options[0].model)) {
                        this.$message.error('分泡比例不能为0');
                        return false
                    }
                }else{
                    if (!this.sfgcoloadms[0].model && this.sfgfpmsv == 'Co-Load模式') {
                        this.$message.error('币种不能为空');
                        return false
                    }else if((!Number(this.sfgcoloadms[1].model)) && this.sfgfpmsv == 'Co-Load模式'){
                        this.$message.error('费用不能为空');
                        return false
                    }
                }

                return true
            },

            assignH() {//   始发港分配
                if (!this.verifyAssignment()) {
                    return
                };
                var assignname = ""
                var servicecode = ""


                var servicetype = ""
                if (this.realsfgwkfw.filter(i => i.assignstatus != '1').map(i => { return i.servicecode }).indexOf('OA0010') != -1) {
                    servicetype = "Attach"
                } else {
                    servicetype = "Alone"
                }

                if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf('OA0010') != -1) {

                    if (this.sfgfpmsv == '利润分配模式' && (!this.sfglrfpmodel[0].options[0].model || !this.sfglrfpmodel[0].options[1].model)) {
                        this.$message.error('操作站分泡比例不能为0');
                        return false
                    } else if (!this.sfgcoloadms[0].model && this.sfgfpmsv == 'Co-Load模式') {
                        this.$message.error('币种不能为空');
                        return false
                    } else if ((!Number(this.sfgcoloadms[1].model)) && this.sfgfpmsv == 'Co-Load模式') {
                        this.$message.error('费用不能为空');
                        return false
                    } else if (this.sfgcoloadms[2].model == '2' && Number(this.sfgcoloadms[1].model) < 100) {
                        this.$message.error('费用不能小于100');
                        return false
                    } else if (this.sfgfpmsv == 'Co-Load模式' && this.sfgcoloadms[2].model!='2'&&!(this.sfgcoloadms[3].options[0].model)) { //!(this.sfgcoloadms[3].options[0].model)
                        this.$message.error('分泡比例不能为0');
                        return false
                    }

                    this.realsfgwkfw.filter(i => i.assignstatus != '1').forEach(item => {
                        this.sfgfpdata.push({
                            port: this.getPort(item.servicecode),
                            servicecode: item.servicecode,
                            assignname: item.assignname,
                            servicetype: servicetype,//若要更改配舱服务的servicetype在这边做三元处理
                            assignarea: this.sfgarea.split('丨')[0],
                            assigncode: this.sfgarea.split('丨')[1],
                            assignsystem: this.system,
                            assigndom: '出口部',
                            profitmode: this.sfgfpmsv,
                            self_profitvalue: this.sfgfpmsv.indexOf('利润分配') != '-1' ? this.sfglrfpmodel[0].options[0].model : this.sfgcoloadms[2].model == '1' || this.sfgcoloadms[2].model == '3' ? this.sfgcoloadms[3].options[0].model : 10,
                            cus_profitvalue: this.sfgfpmsv.indexOf('利润分配') != '-1' ? this.sfglrfpmodel[0].options[1].model : this.sfgcoloadms[2].model == '1' || this.sfgcoloadms[2].model == '3' ? this.sfgcoloadms[3].options[1].model : 0,
                            inwageallinprice: this.sfgcoloadms[1].model||666666,
                            isinwageallin: this.sfgcoloadms[2].model,
                            currency: this.sfgcoloadms[0].model,
                            czr: localStorage.getItem('usrname'),
                            inwageallinprice_trans: this.sfgcoloadmsModelData.inwageallinprice_trans||666666,
                            isinwageallin_trans: this.sfgcoloadmsModelData.isinwageallin_trans||666666,
                            self_real_bp_trans_in: this.sfgcoloadmsModelData.self_real_bp_trans_in||10,
                            cus_real_bp_trans_in: this.sfgcoloadmsModelData.cus_real_bp_trans_in||0,
                        })


                        this.fpsfg.forEach(item2 => {

                            if (item2.servicecode == item.servicecode) {
                                item2.assignstatus = 1
                            }
                            item2.disabled = true
                        })
                        assignname += item.assignname + ','
                        servicecode += item.servicecode + ','
                    })

                } else {


                    this.realsfgwkfw.filter(i => i.assignstatus != '1').forEach(item => {
                        this.sfgfpdata.push({
                            port: this.getPort(item.servicecode),
                            servicecode: item.servicecode,
                            assignname: item.assignname,
                            servicetype: servicetype,
                            assignarea: this.sfgarea.split('丨')[0],
                            assigncode: this.sfgarea.split('丨')[1],
                            assignsystem: this.system,
                            assigndom: '出口部',
                            profitmode: this.sfgfpmsv,
                            self_profitvalue: this.sfglrfpmodel[0].options[0].model||10,
                            cus_profitvalue: this.sfglrfpmodel[0].options[1].model||0,
                            inwageallinprice: this.sfgcoloadmsModelData.inwageallinprice||666666,
                            isinwageallin: '2',
                            currency: this.sfgcoloadmsModelData.currency,
                            czr: localStorage.getItem('usrname'),
                            inwageallinprice_trans: this.sfgcoloadmsModelData.inwageallinprice_trans||666666,
                            isinwageallin_trans: this.sfgcoloadmsModelData.isinwageallin_trans||666666,
                            self_real_bp_trans_in: this.sfgcoloadmsModelData.self_real_bp_trans_in||10,
                            cus_real_bp_trans_in: this.sfgcoloadmsModelData.cus_real_bp_trans_in||0,
                        })
                        this.fpsfg.forEach(item2 => {


                            if (item2.servicecode == item.servicecode) {
                                item2.assignstatus = 1
                            }
                            item2.disabled = true
                        })




                    })

                }

                //this.sfgwkfw=[];
                this.realsfgwkfw = []
                // 清空值
                this.sfgarea = "";
                this.sfgfpmsv = "";
                this.sfglrfpmodel[0].model = "";

                for (var i in this.sfgcoloadms) {
                    if (this.sfgcoloadms[i].model) {
                        this.sfgcoloadms[i].model = ""
                    } else if (this.sfgcoloadms[i].options) {
                        for (var j in this.sfgcoloadms[i].options) {
                            if (this.sfgcoloadms[i].options[j].model) {
                                this.sfgcoloadms[i].options[j].model = "";
                            }
                        }
                    }
                }




            },

            getPort(name) {
                var str = "";
                this.fpsfg.forEach(item => {
                    if (name == item.servicecode) {
                        str = item.port
                    }
                })
                return str
            },
            yanzhen() {
                if (this.sfgfpdata.map(i => i.online != 1).length > 0) {
                    return true
                } else {
                    this.$message.error('无数据分配');
                    return false
                }
            },
            // 确认分配
            confirmFp(guid, bono) {
                //bono 订单新增成功后的订单编号
                //this.assignDisable=true
                var sfgFpO = []
                var mdgFpO = []
                //console.log(this.sfgfpdata)
                this.sfgfpdata.forEach(item => {
                    if (item.online != 1) {
                        sfgFpO.push(item)
                    }
                })

                // this.mdgfpdata.forEach(item=>{
                //   if(item.assignstatus!=1){
                //     mdgFpO.push(item)
                //   }
                // })
                if (sfgFpO.length == 0) {
                    this.$message.error('无数据分配');
                    this.assignDisable = false
                    return
                }
                //console.log(sfgFpO)
                var data = { boguidlist: this.fenpeiguid || guid, serviceList: sfgFpO.concat(mdgFpO), status: 400 }
                //console.log(JSON.stringify(data))
                if (!data.serviceList) {
                    return this.$message.info('请填写分配信息')
                }
                if (this.orderIncompletePage) {
                    data.isimpertect = 1
                }
                this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/ExAxplineAssignOMS', data: data, loading: true, tip: false })
                    .then(results => {

                        if (results.data.resultstatus == 0) {
                            let title = bono ? `分配成功,订单编号为：${bono}` : '分配成功!'
                            this.$alert(
                                title,
                                "提示", {
                                showClose: false,
                                closeOnPressEscape: false,
                                closeOnClickModal: false,
                                distinguishCancelAndClose: true,
                                dangerouslyUseHTMLString: true,
                                confirmButtonText: "确定"
                            }
                            ).then(() => {

                                // this.$message.success('分配成功')
                                var mark = 0
                                // 带主营的分配需要删除此记录
                                data.serviceList.forEach(item => {
                                    if (item.servicetype == "Attach") {
                                        mark = 1
                                    } else {
                                        mark = 0
                                    }
                                })
                                if (mark == 0) {
                                    this.$emit('back', false)
                                } else if (mark == 1) {
                                    this.$emit('back', { nodel: '2' })
                                }
                                this.$emit('success', false)



                            })

                            //alert(mark)
                        } else {
                            this.$message.error(results.data.resultmessage)
                        }

                    })
                    .catch(error => {

                    })
                setTimeout(() => {
                    this.assignDisable = false
                }, 800)
            },

            // 取消所有分配始发港
            cancelFpAll() {

                var searchdata = []
                var success = 1
                this.sfgfpdata.forEach(item => {
                    if (item.online == 1) {
                        searchdata.push(item)
                    }
                })

                if (searchdata.length > 0) {

                    var data = { boguidlist: this.fenpeiguid, serviceList: searchdata, status: 1 }

                    this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/ExAxplineAssignOMS', data: data })
                        .then(results => {
                            if (results.data.resultstatus == 0) {

                                success = 1
                                this.$emit('success', false)
                                this.$message.success(results.data.resultmessage)
                            } else {

                                success = 0
                                this.$message.error(results.data.resultmessage)

                            }
                        })
                        .catch(error => {
                            success = 0
                        })
                } else {
                    setTimeout(() => {
                        if (success == 1) {


                            this.$message.success('操作成功')
                            this.sfgfpdataShow = []
                            this.sfgfpdata = []
                            this.sfgwkfw = []
                            this.realsfgwkfw = []
                            this.fpsfg.forEach(item => {
                                item.assignstatus = 0
                                item.disabled = false
                                item.online = 0
                            })

                        }
                    }, 500)
                }






                // this.sfgfpdata=[]
                // this.sfgwkfw=[]
                // this.realsfgwkfw=[]
                // this.fpsfg.forEach(item=>{
                //   item.assignstatus=0
                // })


            },


            // 取消分配始发港
            cancelFp(val, index) {
                //alert('1')
                //console.log(val)
                var servicenameList = val.split(',')
                this.$confirm('是否删除此分配?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {

                        var data = { boguidlist: this.fenpeiguid, serviceList: [], status: 1 }
                        var serviceListTem = []
                        //console.log(this.sfgfpdata)
                        this.sfgfpdata.forEach(item2 => {
                            servicenameList.forEach(item => {
                                if (item2.servicecode == item && item2.online == 1) {
                                    serviceListTem.push(item2)
                                }
                            })
                        })
                        data.serviceList = serviceListTem
                        //alert('1')
                        ////console.log(this.sfgfpdata)
                        if (data.serviceList.length > 0) {//需走接口取消分配
                            //alert('1')
                            //console.log(data)
                            this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/ExAxplineAssignOMS', data: data })
                                .then(results => {
                                    if (results.data.resultstatus == 0) {

                                        this.sfgfpdataShow.splice(index, 1)

                                        // 始发港分配数据
                                        var sfgfpdataH = []
                                        this.sfgfpdata.forEach(item => {
                                            ////console.log('2',item.assigname)
                                            if (servicenameList.indexOf(item.servicecode) == -1) {
                                                sfgfpdataH.push(item)
                                            }
                                        })
                                        this.sfgfpdata = sfgfpdataH
                                        //console.log('1',this.sfgfpdata)

                                        // 始发港服务选择List数据
                                        this.fpsfg.forEach(item => {
                                            servicenameList.forEach(item2 => {
                                                if (item.servicecode == item2) {
                                                    //item.disabled=tru
                                                    item.assignstatus = 0
                                                    item.online = 0
                                                }
                                            })
                                        })
                                        //始发港分配勾选服务
                                        var sfgwkfwH = []
                                        this.sfgwkfw.forEach(item => {
                                            if (servicenameList.indexOf(item) == -1) {
                                                sfgwkfwH.push(item)
                                            }
                                        })
                                        this.sfgwkfw = sfgwkfwH


                                        // 真实始发港勾选数据
                                        var realsfgwkfwH = []
                                        this.realsfgwkfw.forEach(item => {
                                            if (servicenameList.indexOf(item) == -1) {
                                                realsfgwkfwH.push(item)
                                            }
                                        })
                                        this.realsfgwkfw = realsfgwkfwH

                                        this.$message.success('操作成功')
                                        this.$emit('success', false)
                                    } else {
                                        this.$message.error(results.data.resultmessage)
                                    }
                                })
                                .catch(error => {

                                })
                        } else {//本地操作取消分配

                            this.$message.success('操作成功')

                            this.sfgfpdataShow.splice(index, 1)

                            // 始发港分配数据
                            var sfgfpdataH = []
                            this.sfgfpdata.forEach(item => {
                                if (servicenameList.indexOf(item.servicecode) == -1) {
                                    sfgfpdataH.push(item)
                                }
                            })
                            this.sfgfpdata = sfgfpdataH

                            // 始发港服务选择List数据
                            this.fpsfg.forEach(item => {
                                servicenameList.forEach(item2 => {
                                    if (item.servicecode == item2) {
                                        item.assignstatus = 0
                                        // if(this.newAdd=='1'){
                                        //   item.disabled=false
                                        //   item.assignstatus=0
                                        // }else{
                                        //   item.assignstatus=0
                                        // }
                                    }
                                })
                            })
                            //始发港分配勾选服务
                            var sfgwkfwH = []
                            this.sfgwkfw.forEach(item => {
                                if (servicenameList.indexOf(item) == -1) {
                                    sfgwkfwH.push(item)
                                }
                            })
                            this.sfgwkfw = sfgwkfwH


                            // 真实始发港勾选数据
                            var realsfgwkfwH = []
                            this.realsfgwkfw.forEach(item => {
                                if (servicenameList.indexOf(item) == -1) {
                                    realsfgwkfwH.push(item)
                                }
                            })
                            this.realsfgwkfw = realsfgwkfwH

                        }

                        this.showFp = true

                    })
                    .catch(() => {
                        //alert('2')
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        })
                    })


            },

            //sfgcoloadmsModelData

        }
        , computed: {
            fparea: {
                get() {

                    let groupData = JSON.parse(localStorage.getItem('groupType'))
                    var returnDate = []
                    var ready04 = []
                    var returnDate2 = []

                    for (var i in groupData) {
                        // && !groupData[i].typename.includes('海外部')
                        if (groupData[i].groupid == '101' && !groupData[i].typename.includes('大客户部') && !groupData[i].typename.includes('市场部') && !groupData[i].typename.includes('项目管理部')) {

                            if (this.$store.state.areaState.indexOf(groupData[i].typename.split('丨')[0]) == -1) {
                                // console.log(groupData[i])
                                if (this.opersystem != '进口') {
                                    returnDate.push(groupData[i])
                                    if (ready04.indexOf(groupData[i].ready04) == -1) {
                                        ready04.push(groupData[i].ready04)
                                    }
                                } else {
                                    if (groupData[i].typename.split('丨')[0] != this.conditionalAreaForBuild) {
                                        returnDate.push(groupData[i])
                                        if (ready04.indexOf(groupData[i].ready04) == -1) {
                                            ready04.push(groupData[i].ready04)
                                        }
                                    }

                                }
                            }

                        }
                    }

                    ready04.forEach(item => {

                        returnDate2.push({ "label": item, options: [] })
                    })

                    returnDate2.forEach((item, index) => {
                        returnDate.forEach((item2, index2) => {
                            if (item.label == item2.ready04) {


                                item.options.push({ 'label': item2.typename, 'value': item2.typename })


                            }
                        })
                    })


                    // console.log(returnDate2)

                    return returnDate2
                },
                set() {

                }
            },

            allCheck: {
                get() {

                    return this.realsfgwkfw.length == this.fpsfg.filter(i => i.assignstatus == 0).length
                },
                set(val) {
                    this.realsfgwkfw = []
                    this.sfgwkfw = []
                    //console.log(val)
                    if (val) {
                        this.fpsfg.forEach(i => {
                            if (i.assignstatus == 0) {
                                this.realsfgwkfw.push(i)
                                this.sfgwkfw.push(i.servicecode)
                            }
                        });
                        if (this.realsfgwkfw.map(i => i.servicecode).includes('OA0010')) {
                            this.sfgcoloadms[1]['title'] = '运费单价'
                            this.sfgcoloadms[2]['model'] = '1'
                            this.sfgcoloadms.forEach((i, index) => {
                                if (index >= 2) {
                                    i.hidden = false
                                }
                            })
                            if (this.sfgfpms.indexOf('利润分配模式') == -1) {
                                this.sfgfpms.push('利润分配模式')
                            }
                        } else {
                            this.sfgcoloadms[1]['title'] = '运费总价'
                            this.sfgcoloadms[2]['model'] = '2'
                            this.sfgcoloadms.forEach((i, index) => {
                                if (index >= 2) {
                                    i.hidden = true
                                }
                            })
                            if (this.sfgfpms.indexOf('利润分配模式') != -1) {
                                 this.sfgfpms.splice(this.sfgfpms.indexOf('利润分配模式'), 1)
                            }
                        }
                    }


                }
            },



        }
        , created() {
            this.initFunc();
            //  this.basicinfoView.sfgarea.disabled=this.inputModelData.frompage==4
        }
        , watch: {
            "inputModelData.area": {
                handler() {
                    if (this.pagetype == 2) {
                        this.sfgareaobj.sfgarea = JSON.parse(localStorage.groupType).filter(i => i.groupid == 101 && i.typename.includes(this.inputModelData.area)).map(i => i.typename).join()
                        this.sfgarea = this.sfgareaobj.sfgarea
                    }
                }, immediate: true, deep: true

            },
            information: {
                handler(val) {
                    if (this.pagetype == 2) {
                        // console.log(val)
                        if (val.length > 0) {
                            this.initFunc()
                            setTimeout(() => {
                                this.allCheck = true;
                                this.sfgcoloadms[0].idStyle = { width: '100%' }
                            }, 1000);
                        }

                    }
                }, immediate: true, deep: true

            },
            'sfgareaobj.sfgarea'(val) {
                // console.log(val)
                this.sfgarea = val;
                this.inputModelData.isneedfenpei = false;
                this.inputModelData.czlx = '';
                this.$parent.$parent.basicinfoView.czlx.disabled = false;
                if (val && !val.includes(this.inputModelData.area) && this.inputModelData.area) {
                    if (this.pagetype == 2) {
                        this.inputModelData.czlx = '自货';
                        this.$parent.$parent.basicinfoView.czlx.disabled = true;
                        this.inputModelData.isneedfenpei = true;//当操作站点与销售站点不同时候代表要分配，
                    }
                }
            },
            sfgcoloadms: {
                handler(val) {
                    if (this.realsfgwkfw.map(i => { return i.servicecode }).indexOf("OA0010") != -1) {
                        if (val[2].model == '1' || val[2].model == '3') {
                            val[3].hidden = false
                        } else {
                            val[3].hidden = true
                        }
                    }
                },
                deep: true,
                //immediate:true
            },
            sfgfpdataShow: {
                handler(val) {
                    console.log(val)
                    this.fpsfg.forEach(item => {
                        if (val.length == 0) {
                            item.disabled = false

                        } else {
                            item.disabled = true

                        }
                    })

                    if (val.length == 0) {
                        this.disabledFp = false
                    } else {
                        //this.disabledFp=true
                    }
                },
                deep: true
            }
            //this.$store.state.areaState


        }




    }

</script>


<style lang="less" scoped>
    @import '../smallTemplate/small.css';


    .fenpeidiv {
        border: 1px solid #304156;
        margin-bottom: 20px;
        padding-bottom: 20px;

        >div {
            padding: 20px 30px 30px 30px;
        }
    }

    .fenpei {
        .fpTable {
            width: 1200px;
            text-align: center;
            margin-top: 28px;

            tr {
                height: 36px;
                line-height: 36px;

                th {
                    border: 1px solid #e8e8e8;
                }

                td {
                    border: 1px solid #e8e8e8;
                }
            }
        }

        .fdzy {
            //font-weight:bold;
            font-size: 14px;
        }

        .el-checkbox {
            margin-left: 0;
        }
    }
</style>