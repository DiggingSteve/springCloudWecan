<template>
    <div style="margin:0 40px;" class="addcontent" v-enterfocus>

        <div class="contents" style="margin-top: 30px;">
            <div v-show="pagestep==1">
                <h1 style="text-align: center;margin-bottom:20px" v-if="pagetype==1">感谢选择<span
                        style="color:#006AFF">唯凯订舱系统</span>，您可以通过填写如下信息来向我们订舱</h1>

                <div class="detail">
                    <div class="detail-title">
                        请选择基础信息
                    </div>
                    <div class="detail-c">
                        <newFormCmptAdd :system="inputModelData.system" :required.sync="basicinfoRequired"
                            :view-data.sync="basicinfoView" :model-data.sync="inputModelData" :pagetype="2"
                            :area="inputModelData.area">
                            <el-button type="default" slot="lxr" style="margin-left: 14px;"
                                :disabled="!inputModelData.area" @click="panelDisplay.lxrShow=true">唯凯联系人</el-button>
                        </newFormCmptAdd>
                    </div>
                </div>

                <div class="reconciliationMng" style="text-align: center;" v-show="pagetype==1">
                    <el-button-group class="buttonTabs">
                        <el-button @click.native="inputModelData.isimperfect=2"
                            :class="[inputModelData.isimperfect==2?'active':'']">预订舱</el-button>
                        <el-button @click.native="inputModelData.isimperfect=1"
                            :class="[inputModelData.isimperfect==1?'active':'']">正式订舱</el-button>
                    </el-button-group>
                </div>


                <div class="detail" id="goodsinfoView">
                    <div class="detail-title">
                        请填写订舱信息
                    </div>
                    <div class="detail-c">
                        <newFormCmptAdd :system="inputModelData.system" :view-data.sync="goodsinfoView"
                            :required.sync="goodsinfoRequired" :model-data.sync="inputModelData" :pagetype="2"
                            :area="inputModelData.area" ref="formCompt">
                            <hwxzComptNew slot="exForm1" showGuageString :gooodsOutgauge="gooodsOutgauge"
                                :inputModelData="inputModelData">
                            </hwxzComptNew>
                        </newFormCmptAdd>

                    </div>
                </div>

                <div class="detail" id="houseNumberAdd" v-show="inputModelData.isimperfect==1&&detailPaneDisplay(2)">
                    <div class="detail-title">
                        请填写货物信息
                    </div>
                    <div class="detail-c">

                        <houseNumberAdd :serviceSelArr="serviceSelArr" @goodsHawbChange="goodsHawbChange"
                            :inputModelData="inputModelData" ref="houseNumberAdd" applicationPage="2"></houseNumberAdd>
                    </div>
                </div>


                <div class="detail" v-show="detailPaneDisplay(1)">
                    <div class="detail-title">
                        请填写运价信息
                    </div>
                    <div class="detail-c">
                        <newFormCmptAdd :view-data.sync="fareInputViewData" v-enterfocus
                            :model-data.sync="inputModelData" :required.sync="fareinfoRequired"
                            :area="inputModelData.area" :pagetype="2">
                        </newFormCmptAdd>
                    </div>
                </div>

                <div class="detail" id="revSedMawb" v-show="inputModelData.isimperfect==1&&detailPaneDisplay(3)">
                    <div class="detail-title">
                        请选择需要唯凯提供的服务
                    </div>
                    <div class="detail-c">

                        <serviceListNew pagetype="1" v-if="pagetype==1" :newService.sync="newService"
                            :opersystemdom="inputModelData.opersystemdom" :orderdom="inputModelData.orderdom"
                            ref="service" :system="inputModelData.system" @exInfoClick="exInfo">
                        </serviceListNew>

                        <serviceListNew :newService.sync="newService" v-if="pagetype==2&&inputModelData.boguid"
                            :opersystem="inputModelData.opersystem" pagetype="2"
                            :serviceList="inputModelData.serviceList" ref="serviceTemp"
                            :orderguid="inputModelData.orderguid" :orderdom="inputModelData.orderdom"
                            :system="inputModelData.system" @exInfoClick="exInfo"></serviceListNew>
                    </div>
                </div>


                <div style="margin-bottom:20px;position: relative;" id="supplementView"
                    v-show="detailShow.supplementView&&inputModelData.isimperfect==1&&detailPaneDisplay(4)">
                    <!-- <p style="margin-bottom: 10px;">以下为选填信息
                    </p> -->
                    <el-button @click="detailShow.supplement=!detailShow.supplement;"
                        style="cursor:pointer;position: absolute;padding:8px;right:4px;top:8px;z-index: 999;"
                        :icon="detailShow.supplement?'el-icon-caret-top':'el-icon-caret-bottom'">
                        {{!detailShow.supplement?'展开面板':'收起面板'}}</el-button>
                    <commonTabs :list="tabsList" :showExpanionBtn="false" :showContent="detailShow.supplement"
                        :checkedIndex.sync="tabsChecked" titlefield="title" color="rgb(255,0,5)" @toggle="handleClick"
                        :showTooltip="false">
                        <div v-show="tabsChecked==0" style="padding: 20px;">
                            <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSed"
                                v-if="inputModelData.orderdom!='分单'" style="grid-column: 1 / 5; " needLimit
                                fieldRequired>
                            </revSedMawb>
                            <revSedHawb :dzinfo="inputModelData" ref="makeBillRevSedHawb"
                                v-if="inputModelData.orderdom=='分单'" style="grid-column: 1 / 5; " needLimit
                                fieldRequired>
                            </revSedHawb>
                        </div>
                        <!-- 
                        <div v-show="tabsChecked==1">
                            <newFormCmptAdd :system="inputModelData.system" :view-data.sync="supplementView"
                                :model-data.sync="inputModelData" :pagetype="2" :required.sync="supplementRequired"
                                :area="inputModelData.area">
                            </newFormCmptAdd>
                        </div> -->
                        <div v-show="tabsChecked==1">
                            <!-- 分单信息 -->
                            <hawbAdd :mawbdetail="inputModelData" ref="hawbtab"></hawbAdd>
                        </div>
                    </commonTabs>
                </div>

                <div style="text-align:right">
                    <el-button type="primary" @click="pageChange(2)" v-if="pagetype==1||frompage==4"
                        v-show="detailPaneDisplay(4)">下一步</el-button>
                    <el-button type="primary" @click="saveMawbInfo" v-if="pagetype==2&&frompage!=4">保存</el-button>
                    <el-button @click="$emit('success',1);" v-if="pagetype==2">返回</el-button>
                </div>
            </div>







            <div class="pages" v-show="pagestep==2" v-if="pagetype==1||frompage==4">
                <!-- <h1 style="text-align: center;margin-bottom:20px">您的订单如下，请仔细核对，如确认无误，可点击<span
                        style="color:#006AFF;cursor:pointer">“确认订舱”</span></h1> -->
                <goodsInfo :modelData="inputModelData" :hawbinfoList="inputModelData.hawbList"
                    :serviceList="serviceList" pagetype=2>
                </goodsInfo>


                <div v-if="inputModelData.isimperfect==2" class="textrequirement">
                    <i class="el-icon-jinggao"></i>
                    <div>
                        <p>1.请确认上述预订舱信息。</p>
                        <p>2.待唯凯航线确认您的预订舱后，请完善订舱信息。</p>
                        <p>3.订舱信息不完善，本次委托无效。</p>
                    </div>

                </div>

                <div style="display: flex;justify-content: center;margin:24px 0 8px;"
                    v-if="inputModelData.isimperfect==1">
                    <el-checkbox style="margin-right: 6px;margin-top: 2px;" v-model="reader"></el-checkbox>
                    <span @click="reader=!reader" style="cursor: pointer;user-select: none;">已阅读并同意</span>
                    <span style="color:#006AFF;cursor: pointer;"
                        @click="panelDisplay.clause=!panelDisplay.clause">《权利义务条款》</span>
                </div>



                <div style="text-align: right;">
                    <el-button class="foot-btn" style="color:#006AFF;background-color:#fff" @click="pageChange(1)">
                        上一步
                    </el-button>
                    <el-button type="primary" @click="saveMawbInfo" :disabled="!reader" v-if="frompage==4">保存
                    </el-button>
                    <el-button type="primary" :disabled="!reader" v-if="frompage!=4" @click="pageChange(3);">确认订舱
                    </el-button>
                </div>
            </div>












            <div class="pages" v-show="pagestep==3" v-if="pagetype==1">
                <div class="elSteps" style="margin-top:35px;margin-bottom: 40px;">
                    <!-- 填运价后不显示中间的报价模块 -->
                    <template v-for="(item,index) in elStepsArr">
                        <div :class="{checked:index<=pagestep}">
                            <i :class="item.class" :style="{color:item.color}"></i>
                            <p>{{item.title}}</p>
                        </div>
                        <div v-if="index!=(elStepsArr.length-1)" :class="{checked:index<=pagestep}">
                            <span></span>
                            <p></p>
                        </div>
                    </template>
                </div>
                <el-divider></el-divider>
                <div style="display: grid;place-items: center;margin-top:130px">
                    <i class="el-icon-circle-check" style="font-size: 160px;color:#14A207;"></i>
                </div>

                <div style="display: flex;justify-content:  center;font-size:24px;margin-top:40px;">
                    <span>恭喜您</span><span style="color:#14A207">订舱成功！</span>
                </div>
                <div
                    style="display: flex;justify-content:  center;font-size:18px;color:#7A8189;margin-top:8px;margin-bottom: 56px;">
                    <span>恭喜您订舱成功 ! 唯凯将尽快对您的订单进行受理，请耐心等候</span>
                </div>

                <div style="text-align: center;">
                    <el-button type="primary" @click="initDataFunc()">完成</el-button>
                </div>

            </div>


        </div>






        <!-- -------------------------------------------弹窗     ----------------------------------------------------------------------------- -->
        <div class="clause" v-if="panelDisplay.clause">
            <div class="clause-shadow" @click="panelDisplay.clause=false">
            </div>
            <div class="clause-content">
                <i class="el-icon-close" @click="panelDisplay.clause=false"></i>

                <h2>权利义务条款</h2>
                <p>欢迎您/贵公司使用唯凯国际物流股份有限公司（以下简称“唯凯”）开发的“国际货运代理业务委托”模块（以下简称“本模块”）。您/贵公司可以通过本模块进行国际货物航空或海洋运输业务委托。</p>
                <p>您/贵公司通过本模块提交的业务信息经唯凯确认后,双方将基于民事代理法律关系产生相应债权债务。鉴于此，请您/贵公司在通过本模块提交相关业务委托前务必仔细阅读本条款：</p>

                <h3>1.账号确认</h3>
                <p>1.1.您/贵公司在使用账号（详见本模块右上角账号信息，以下简称为“本账号”）提交业务信息前，请务核对账号所绑定的公司信息是否正确，并确保本账号处于您/贵公司的控制之下，账号操作人员已取得您/贵公司的授权，且该授权处于有效状态。
                </p>
                <p>1.2.您/贵公司通过本账号在本模块内进行的任何操作，包括并不限于业务信息的录入、修改、删除、提交等，都将视为贵公司的有效商业行为，您/贵公司应承担因前述操作产生的全部法律后果。</p>
                <p>1.3.如您/贵公司账号出现被盗、持有人变动、忘记密码等情形，应及时书面通知唯凯，唯凯将采取协助措施，防止您/贵公司相关损失扩大。</p>
                <p>1.4.如您并非本账号的合法持有人，或本账号绑定的公司信息与您/贵公司实际信息不一致，请立刻停止操作并退出本模块。否则，您/贵公司可能因此产生民事或刑事责任。</p>

                <h3>2.业务信息确认、修改、删除</h3>
                <p>2.1.您/贵公司在提交相关业务信息时应仔细检查，确保录入的信息真实准确。</p>
                <p>2.2.您/贵公司提交的信息一经唯凯确认，即对您/贵公司产生法律效力，因此衍生的责任义务亦将由您/贵公司承担。</p>
                <p>2.3.您/贵公司提交的业务信息在唯凯确认前，您/贵公司可以在本模块内对相关信息进行修改或删除操作。</p>
                <p>2.4.唯凯在确认中如发现异常，唯凯会通知您/贵公司进行调整。您/贵公司如无异议，应及时在本模块内进行调整操作，将调整后的业务信息重新提交。</p>
                <p>2.5.如需对唯凯已确认信息进行调整或删除，您/贵公司应征得唯凯同意，并在唯凯指定的时间内在本模块内操作完毕。</p>
                <p>2.6.本模块内的业务信息在您/贵公司提交后，如24个工作小时内（节假日顺延）唯凯未予确认或在唯凯确认前您/贵公司进行删除操作，该信息视为无效，对双方均不发生法律效力。</p>

                <h3>3.费用结算</h3>
                <p>3.1.您/贵公司通过本模块提交的业务委托所产生的费用，您/贵公司应支付给唯凯。</p>
                <p>3.2.双方如签有代理协议，结算期限按协议约定处理。如双方未签订代理协议，您/贵公司最迟应于每票货物起运后三十天内将该票货物所涉全部费用支付给唯凯。</p>
                <p>3.3.唯凯将向您/贵公司提供等额的增值税普通发票。</p>

                <h3>4.信息保密</h3>
                <p>4.1.唯凯将为您/贵公司提交的业务信息保密，唯凯不会将相关信息透露给业务无关方。</p>
                <p>4.2.您/贵公司应为唯凯提供的服务价格进行保密，不得向任何第三方透露。</p>
                <p>4.3.任一方违反上述约定的保密义务，应赔偿另一方因此产生的损失。</p>
                <p>4.4.除不可抗力外，唯凯将为您/贵公司在本模块中的业务信息至少保留1年。</p>

                <h3>5.免责约定</h3>
                <p>5.1.<strong>唯凯在本模块中提供选择的运输线路、航班、船次、运输时间、各项服务单价等信息，仅供您/贵公司参考选择，不构成要约。</strong>您/贵公司提交的业务信息未经唯凯确认，此类信息不生效
                </p>
                <p>5.2.双方认可国际货运代理业务中存在诸多不确定风险，唯凯在本模块中确认的信息，<strong>非因唯凯过错导致无法达成的，唯凯不承担责任。</strong>如存在责任方，唯凯将协助您/贵公司向责任方索赔。
                </p>
                <p>5.3.唯凯将根据需要不定期对本模块进行更新维护工作，<strong>如因不可抗力导致本模块无法正常运行导致您/贵公司业务受到影响，唯凯不承担相关责任。</strong>但唯凯应协助您/贵公司进行线下业务对接处理。
                </p>
                <p>5.4.为了确保业务操作效率，唯凯可视情形将贵司委托的业务转委托有资质的第三方操作，唯凯应为该第三方选任过失向您/贵公司承担法定责任。</p>

                <h3>6.特别约定</h3>
                <P>6.1.本账号在本模块下以其他企业或个体名义提交的业务信息，不影响您/贵公司在此类业务中的委托人身份，您/贵公司须向唯凯承担业务委托人的全部责任和义务。您/贵公司应在录入相关信息前获得被录入企业或个体的有效授权。
                </P>
                <P>6.2.在您/贵公司与唯凯已签有书面协议的情形下，本账号在本模块内提交的业务委托，应优先适用本条款。本条款没有约定的内容，依照双方签订的书面协议。</P>
                <P>6.3.如您/贵公司因使用本模块向唯凯委托业务产生的任何纠纷，双方应友好协商处理，如协商不成，双方同意由上海市浦东新区人民法院管辖处理。如您/贵公司为中国境外自然人或企业，双方同意提交中国国际经济贸易仲裁委员会上海分会，按照仲裁申请时中国国际经济贸易仲裁委员会现行有效的仲裁规则进行仲裁。仲裁裁决是终局的，对双方均有约束力。败诉方应承担胜诉方因此支出的律师费。
                </P>
                <P>6.4.如您/贵公司对本条款有任何异议，请点击本页面中的“取消”按钮，停止业务操作。您/贵公司仍可以选择通过线下传统方式进行业务委托。</P>
                <P>6.5.如您/贵公司认可并同意本条款，请点击本页面中的“同意”按钮，继续业务数据提交操作。</P>
                <P>6.6.如您/贵公司对本条款有任何疑问，可在点击确认前致电021-50104582进行讨论、咨询。</P>
                <P>6.7.唯凯保留对本条款的最终解释权。</P>
            </div>
        </div>

        <div class="clause" v-if="panelDisplay.thdinfo">
            <div class="clause-shadow" @click="panelDisplay.thdinfo=false">
            </div>
            <div class="clause-content" style='width:600px' v-if="selServicecode">
                <i class="el-icon-close" @click="panelDisplay.thdinfo=false"></i>
                <h2 style="text-align: left;">
                    {{selServicecode=='AA0510'?'请填写提货地信息':`请填写${newService[selServicecode].title}信息`}}</h2>
                <div style="display: grid;">
                    <template v-if="selServicecode=='AA0510'">
                        <new-form-cmpt :view-data.sync="thViewData" :modelData.sync="inputModelData.ysservice"
                            isAddPage>
                        </new-form-cmpt>
                    </template>
                    <template v-if="selServicecode=='AA0410'">
                        <div class="elitem">
                            <div class="input-title">预计进仓仓库</div>
                            <div class="input-content">
                                <el-input v-model="inputModelData.ysservice.store_thr" disabled
                                    style="width:252px;margin-right:12px"></el-input>
                                <el-button type="default" @click="panelDisplay.expressShow=true" :disabled="!ckmapUrl">
                                    仓库地图</el-button>
                            </div>
                        </div>
                        <!-- <div class="elitem">
                            <div class="input-title">要求进仓日期</div>
                            <div class="input-content">
                                <el-date-picker style="width:252px" v-model="inputModelData.ysservice.yqfinishdate_org"
                                    class="input-required" type="date" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                        </div> -->
                    </template>
                    <div class="elitem">
                        <div class="input-title">{{selServicecode=='AA0410'?'进程日期':'要求完成日期'}}</div>
                        <div class="input-content">
                            <el-date-picker style="width:252px"
                                :class="{'input-required':selServicecode=='AA0410'||selServicecode=='AA0510'}"
                                v-model="newService[selServicecode].yqfinishdate" type="date" value-format="yyyy-MM-dd"
                                @change="datePickerChange">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="elitem">
                        <div class="input-title">操作要求</div>
                        <div class="input-content">
                            <el-input type="textarea" v-model="newService[selServicecode].oprequest" :rows="2"
                                placeholder="请输入内容">
                            </el-input>
                        </div>
                    </div>
                    <div style="text-align: right;margin-top:12px;">
                        <el-button type="primary" @click="thdDialog(1)">确认</el-button>
                        <el-button @click="thdDialog(2)">
                            取消</el-button>
                    </div>
                </div>

            </div>
        </div>


        <el-dialog :visible.sync="panelDisplay.lxrShow" v-if="panelDisplay.lxrShow" append-to-body width="1080px"
            title="联系人信息" center>
            <contacts pagetype=2 :area="inputModelData.area"></contacts>
        </el-dialog>

        <el-dialog center :visible.sync="panelDisplay.expressShow" :close-on-click-modal="false"
            :close-on-press-escape="false" width="1200px" top="20px" :modal="false" custom-class="setDialog"
            height="100%">
            <h2>
                仓库地图
            </h2>
            <embed :src="ckmapUrl" width="98%" v-if="ckmapUrl" height="800px" name="pdf">
        </el-dialog>


    </div>
</template>
<script>
    import serviceListNew from "@/outsideDom/orderDetails/serviceListOutside"
    import houseNumberAdd from '@/components/templates/houseNumberAdd'
    import hawbTabsNew from '@/components/orderDetails/hawbTabsNew'
    import hawbAdd from '@/components/orderDetails/hawbAdd'
    import newFormCmptAdd from "@/components/templates/newFormCmpt"
    import hwxzComptNew from "@/components/templates/hwxzComptNew"

    import revSedMawb from "@/components/templates/revSedMawb";
    import revSedHawb from "@/components/templates/revSedHawb";
    import contacts from "@/outsideDom/smallTemplate/contacts";

    import { computedWeight, formatDate, JudgeBubblesFunc, isNumber } from "@/api/localStorage"


    export default {
        name: 'outMawbAdd',
        props: {
            guid: [String, Number],
            boguid: [String, Number],
            pagetype: {
                type: [String, Number],
                default: 1 //1新增 2修改
            },
            visible: Boolean,
            frompage: {//从哪个页面进入的
                type: [String, Number],
                default: 1 //1默认页面 2 订单信控预览 3.操作层订单摘要进去的 4.订单未完善
            }
        },
        components: { houseNumberAdd, hawbTabsNew, hawbAdd, newFormCmptAdd, revSedMawb, revSedHawb, serviceListNew, hwxzComptNew, contacts },
        data() {
            return this.getInitData()
        },
        methods: {
            getInitData() {
                return {
                    name: "newOrderAdd.vue",
                    pagestep: 1,
                    basicinfoView: {//第一步
                        wtkhname: {
                            title: "委托客户",
                            type: 18,
                            disabled: true,
                            occupyRestSpace: true,
                            itemStyle: { width: '320px' },
                        },
                        area: {
                            title: '唯凯销售站点',
                            type: 37,
                            required: true,
                            multiple: false,
                            itemStyle: { width: '350px' },
                            placeholder: '请选择唯凯站点',
                            pagetype: 1,
                            hidden: false,
                            usedarea: sessionStorage.out_gidarea
                        },
                        lxr: {
                            titleStyle: { display: 'none' },
                            occupyRestSpace: true
                        },
                        // isimperfect: {
                        //     title: '新增类型',
                        //     type: 3,
                        //     options: [
                        //         { label: '预订舱', value: 2 },
                        //         { label: '正式订舱', value: 1 }
                        //     ],
                        //     idStyle: { width: '100%' },
                        //     itemStyle: { width: '100%' },
                        //     default: 2,
                        // },
                        system: {
                            title: '运输种类',
                            type: 3,
                            options: [
                                { label: '空出', value: "空出" },
                                { label: '空进', value: "空进" },
                                { label: '海出', value: "海出" },
                                { label: '海进', value: "海进" },
                                { label: '陆出', value: "陆出" },
                                { label: '陆进', value: "陆进" },
                                { label: '铁出', value: "铁出" },
                                { label: '铁进', value: "铁进" },
                                { label: '国内服务', value: "国内服务" },
                            ],
                            idStyle: { width: '100%' },
                            itemStyle: { width: '100%' },
                            default: '空出',
                            disabled: true,
                            // hidden: () => { return !this.inputModelData.area },
                            required: true
                        },
                        creditlevel: {
                            title: '客户等级',
                            type: 18,
                            occupyRestSpace: true,
                            hidden: true,
                            idStyle: { width: '100%' },
                            itemStyle: { width: '100%' },
                        },
                        ispay_pre: {
                            title: "是否要预付款",
                            type: "3",
                            options: [{
                                label: '是',
                                value: 1
                            }, {
                                label: '否',
                                value: 2
                            },],
                            // default: 2,
                            titleStyle: {
                                'font-size': '12px',
                                'font-weight': 'bold',
                                'color': 'red'
                            },
                            idStyle: {
                                width: "100%"
                            },
                            itemStyle: {
                                width: "560px"
                            },
                            expInfo: true,
                            hidden: true,

                        },
                        czlx: {
                            title: "配舱操作",
                            type: 3,
                            options: [{
                                label: "唯凯配舱",
                                value: "自货"
                            },
                            {
                                label: "唯凯代操作",
                                value: "代操作"
                            }
                            ],
                            itemStyle: {
                                width: "560px"
                            },
                            default: '自货',
                            hidden: false,
                            required: true,
                            disabled: true
                        },
                        orderdom: {
                            title: '订单类型',
                            type: 3,
                            options: [
                                { label: () => { return this.inputModelData.czlx == '自货' ? '总单(货代委托)' : '总分单' }, value: "总单" },
                                { label: '总直单', value: "直单", hidden: () => { return this.inputModelData.czlx == '自货' } },
                                { label: () => { return this.inputModelData.czlx == '自货' ? '分单(直客委托)' : '分单' }, value: "分单" }
                            ],
                            idStyle: { width: '100%' },
                            itemStyle: { width: '100%' },
                            default: '总单',
                            hidden: false,
                            required: true,
                            disabled: true

                        },
                        ordertype: {
                            title: '订单形式',
                            type: 3,
                            options: [
                                { label: '单票', value: 1 },
                                { label: '批量', value: 2 },
                            ],
                            idStyle: { width: '100%' },
                            // default: 1,
                            disabled: false,
                            hidden: true,
                            required: true
                        }
                    },
                    goodsinfoView: {//订舱信息
                        ybpiece: {
                            title: "预报件数",
                            type: 1,
                            required: true,
                            verify: "integer",
                            alertTitle: '预报件数',
                            itemStyle: { width: '200px', 'margin-right': '6px' },
                        },
                        goodsybpiece: {
                            type: 18,
                            verify: "integer",
                            itemStyle: { width: '74px' },
                            titleStyle: { display: 'none' },
                            disabled: true
                        },
                        ybweight: {
                            title: "预报重量",
                            type: 1,
                            required: true,
                            verify: "fixedTwo",
                            alertTitle: '预报重量',
                            itemStyle: { width: '200px', 'margin-right': '6px' },
                        },
                        goodsybweight: {
                            type: 18,
                            verify: "fixedTwo",
                            itemStyle: { width: '74px' },
                            titleStyle: { display: 'none' },
                            disabled: true
                        },
                        ybvolume: {
                            title: "预报体积",
                            type: 1,
                            required: true,
                            verify: "fixedThree",
                            alertTitle: '预报体积',
                            itemStyle: { width: '200px', 'margin-right': '6px' },
                        },
                        goodsybvolume: {
                            type: 18,
                            verify: "fixedThree",
                            itemStyle: { width: '74px' },
                            titleStyle: { display: 'none' },
                            disabled: true,
                            occupyRestSpace: true
                        },
                        sfg: {
                            title: "始发港",
                            type: 20,
                            pagetype: 6,
                            required: true
                        },
                        mdg: {
                            title: "到达港",
                            type: 20,
                            pagetype: 6,
                            required: true,
                            occupyRestSpace: true
                        },
                        deliverydate: {
                            title: "货好日期",
                            type: 12,
                            format: "yyyy-MM-dd HH:mm"
                        },
                        hbrq: {
                            title: "要求航班日期",
                            type: 6,
                            format: "yyyy-MM-dd",
                            pickerOptionsType: 1,
                            required: true,
                            elEvent: {
                                eventName: 'change',
                                funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
                            },
                        },
                        // qfsj: {
                        //     title: "预计起飞时间",
                        //     type: 34
                        // },
                        hbh: {
                            title: "要求航班号",
                            type: 1,
                            verify: "uppercase",
                            elEvent: {
                                eventName: 'blur',
                                funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
                            }
                        },
                        ddrq: {
                            title: "要求到达日期",
                            type: 6,
                            format: "yyyy-MM-dd",
                        },
                        exForm1: {
                            idStyle: {
                                width: "100%",
                                marginBottom: "-14px"
                            },
                            itemStyle: {
                                width: "100%"
                            },
                            titleStyle: {
                                display: "none"
                            }
                        }
                    },
                    fareInputViewData: {
                        inwageallinprice: {
                            title: '空运费单价',
                            type: 1,
                            verify: "fixedThree",
                            idStyle: {
                                width: "560px"
                            },
                            itemStyle: {
                                width: "360px"
                            },
                            text: '(含燃油战险)',
                            append: 'CNY',
                            required: true,
                            explainText: '如您已在线下就此次委托咨询过唯凯运费单价,可在此处填写'
                        },
                        priceFp: {
                            title: "分泡比例",
                            itemStyle: {
                                width: "560px"
                            },
                            type: 9,
                            options: [{
                                title: "唯凯",
                                linkage: "cus_real_bp_freight_in",
                                id: "self_real_bp_freight_in",
                                defalut: "",
                                required: true
                            },
                            {
                                title: "客户",
                                linkage: "self_real_bp_freight_in",
                                id: "cus_real_bp_freight_in",
                                defalut: "",
                                required: true
                            }
                            ],
                            seque: "first",
                            hidden: false,
                            explainText: '如您已在线下就此次委托咨询过唯凯分泡比例,可在此处填写'
                        },
                        priceabout: {
                            title: '销售人名称',
                            type: 1,
                            idStyle: {
                                width: "100%"
                            },
                            itemStyle: {
                                width: "360px"
                            },
                            explainText: '如您已在线下就此次委托咨询过唯凯销售,可在此处填写其姓名',
                            // hidden: () => { return !this.inputModelData.inwageallinprice }
                        },
                        inwageallinprice_trans: {
                            title: '中转费单价',
                            type: 1,
                            verify: "fixedThree",
                            idStyle: {
                                width: "560px"
                            },
                            itemStyle: {
                                width: "360px"
                            },
                            text: '(含燃油战险)',
                            append: 'CNY',
                            explainText: '如您已在线下就此次委托咨询过唯凯中转费单价,可在此处填写'
                        },
                        zzFp: {
                            title: "分泡比例",
                            itemStyle: {
                                width: "560px"
                            },
                            type: 9,
                            options: [{
                                title: "唯凯",
                                linkage: "cus_real_bp_trans_in",
                                id: "self_real_bp_trans_in"
                            },
                            {
                                title: "客户",
                                linkage: "self_real_bp_trans_in",
                                id: "cus_real_bp_trans_in"
                            }
                            ],
                            seque: "second",
                            hidden: false,
                            explainText: '如您已在线下就此次委托咨询过唯凯分泡比例,可在此处填写'
                        }
                    },
                    supplementView: {//补充信息
                        hawb: {
                            title: "分运单号",
                            idStyle: {
                                width: "560px"
                            },
                            itemStyle: {
                                width: "280px"
                            },
                            type: 1,
                            required: true,
                            hidden: true
                        },
                        comboine: {
                            title: "可否拼单",
                            type: 3,
                            options: [{
                                label: "可拼",
                                value: 1
                            },
                            {
                                label: "不可拼",
                                value: 2
                            }
                            ],
                            hidden: true
                        },
                        yqqcts: {
                            title: "要求全程天数",
                            type: 1,
                            verify: "integer",
                        },
                        zzg: {
                            title: "中转港",
                            type: 20,
                            verify: "uppercase",
                            pagetype: 6
                        },
                        hbzl: {
                            title: "要求航班种类",
                            type: 3,
                            groupid: "6",
                            idStyle: {
                                width: "100%"
                            },
                            itemStyle: {
                                width: "100%"
                            }
                        },
                        bglx: {
                            title: "报关类型",
                            type: 4,
                            groupid: "19",
                            hidden: false,
                            filterable: true
                        },
                        bgpiece: {
                            title: "报关件数",
                            type: 1,
                            verify: "integer",
                            hidden: false,
                            required: false
                        },
                        bgweight: {
                            title: "报关重量",
                            type: 1,
                            verify: "fixedTwo",
                            hidden: false,
                            required: false
                        },
                        paymode: {
                            title: "运费条款",
                            type: 3,
                            groupid: "125",
                            idStyle: {
                                width: "100%"
                            },
                            itemStyle: {
                                width: "100%"
                            }
                        },
                        tradeterm: {
                            title: "贸易方式",
                            type: 16,
                            idStyle: {
                                width: "100%"
                            },
                            itemStyle: {
                                width: "100%"
                            },
                            options: [{
                                title: "Freight  Prepaid",
                                detailS: [

                                ]
                            },
                            {
                                title: "Freight  Collect",
                                detailS: [

                                ]
                            }
                            ]
                        },
                        englishpm: {
                            title: "英文品名",
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
                            },
                            hidden: true
                        },
                        remark: {
                            title: "备注",
                            type: 17,
                            itemStyle: {
                                width: "560px"
                            }
                        },
                        // sfhinfo: {
                        //     title: '总单发货人',
                        //     idStyle: { width: '100%' },
                        //     itemStyle: { width: '100%' },
                        //     titleStyle: {
                        //         'align-self': 'flex-start',
                        //         'margin-top': '15px'
                        //     }
                        // }
                    },
                    thViewData: {
                        company_thr_org: {
                            title: '提货单位',
                            type: 1,
                            required: true,
                            itemStyle: { width: 'calc(50% - 4px)' }
                        },
                        khjcno: {
                            title: '客户进仓编号',
                            required: true,
                            idStyle: { width: 'calc(50% - 4px)', 'margin-right': '8px' },
                            placeholder: '多个用逗号隔开',
                            // type: 1,
                            type: 5,
                            options: []

                        },
                        piece: {
                            title: '件数 PCS',
                            type: 1,
                            required: true,
                            idStyle: { width: '84px' },
                            idClass: "input-group-a",
                            translate: 'pieceP',
                            verify: 'integer',
                            disabled: true
                        },
                        weight: {
                            title: '重量 KG',
                            type: 1,
                            required: true,
                            idStyle: { width: '84px' },
                            idClass: "input-group-m",
                            translate: 'weightP',
                            verify: 'fixedTwo',
                            disabled: true
                        },
                        volume: {
                            title: '体积 CBM',
                            type: 1,
                            idStyle: { width: '84px' },
                            idClass: "input-group-f",
                            translate: 'volumeP',
                            verify: 'fixedThree',
                            disabled: true
                        },
                        address_thr_org: {
                            title: '提货地址',
                            type: 39,
                            linkage: 'address_thrjson_org'//放json字段
                        },
                        lxr_thr_org: {
                            title: '联系人姓名',
                            type: 1,
                            required: true,
                            idStyle: { width: 'calc(50% - 4px)', 'margin-right': '8px' }
                        },
                        phone_thr_org: {
                            title: '联系人电话',
                            type: 1,
                            required: true,
                            idStyle: { width: 'calc(50% - 4px)' }
                        },
                        pickupdate_org: {
                            title: '要求提货完成日期',
                            type: 6,
                            required: true,
                            hidden: true,
                            itemStyle: { width: 'calc(50% - 4px)' }
                        },
                    },
                    inputModelData: {
                        ysservice: { company_thr_org: '', khjcno: '', piece: '', weight: '', volume: '', address_thr_org: '', address_thrjson_org: '', lxr_thr_org: '', phone_thr_org: '', pickupdate_org: '', yqfinishdate_org: '', store_thr: '' },//提货信息
                        orderdom: '',
                        system: '',
                        opersystem: '出口',
                        opersystemdom: '空运',
                        area: '',
                        ordertype: '',
                        guid: -1,
                        sfg: "",
                        comboine: 1,
                        creditlevel: '',
                        realpiece: 0,
                        mawb: "",
                        czlx: "",
                        orderno: "",
                        hawb: "",
                        fid: "",
                        gid: sessionStorage.out_gid,
                        wtkhname: sessionStorage.out_usr_name,
                        mdg: "",
                        qsd: '',
                        mdd: '',
                        zzg: "",
                        deliverydate: "",
                        piece: "",
                        weight: "",
                        volume: "",
                        ybpiece: "",
                        ybweight: "",
                        ybvolume: "",
                        hbh: "",
                        hbrq: "",
                        qfsj: "",
                        yqqcts: "",
                        hbzl: "全部",
                        exForm1: "",
                        paymode: "PP",
                        englishpm: "CONSOLIDATION CARGO AS PER ATTACHED MANIFEST",
                        chinesepm: "",
                        hwxz: "",
                        // hwlx: "普货",
                        hwxz: "",
                        hwlx: "",
                        // ispay_pre: "",
                        batterymodel: "",
                        tradeterm: "CIF",
                        // ctype: false, //c类客户
                        "remark": "",
                        "bglx": '',
                        "bgpiece": '',
                        "bgweight": '',
                        //费用部分
                        currency: "人民币",
                        isinwageallin: "1",
                        inwageallinprice: "",
                        self_real_bp_freight_in: "",
                        cus_real_bp_freight_in: "",
                        isinwageallin_trans: "",
                        inwageallinprice_trans: "",
                        self_real_bp_trans_in: "",
                        cus_real_bp_trans_in: "0",
                        yjstorearea: '',
                        yjstorename: "",
                        yjstoredate: "",
                        companytitle_fhr_mawb: "",
                        address_fhr_mawb: "",
                        companycode_fhr_mawb: "",
                        state_fhr_mawb: "",
                        city_fhr_mawb: "",
                        postcode_fhr_mawb: "",
                        lxr_fhr_mawb: "",
                        phone_fhr_mawb: "",
                        fax_fhr_mawb: "",
                        email_fhr_mawb: "",
                        taxcode_fhr_mawb: "",
                        companytitle_shr_mawb: "",
                        address_shr_mawb: "",
                        companycode_shr_mawb: "",
                        state_shr_mawb: "",
                        city_shr_mawb: "",
                        postcode_shr_mawb: "",
                        lxr_shr_mawb: "",
                        phone_shr_mawb: "",
                        fax_shr_mawb: "",
                        email_shr_mawb: "",
                        taxcode_shr_mawb: "",
                        companytitle_fhr_hawb: "",
                        address_fhr_hawb: "",
                        companycode_fhr_hawb: "",
                        state_fhr_hawb: "",
                        city_fhr_hawb: "",
                        postcode_fhr_hawb: "",
                        lxr_fhr_hawb: "",
                        phone_fhr_hawb: "",
                        fax_fhr_hawb: "",
                        email_fhr_hawb: "",
                        taxcode_fhr_hawb: "",
                        companytitle_shr_hawb: "",
                        address_shr_hawb: "",
                        companycode_shr_hawb: "",
                        state_shr_hawb: "",
                        city_shr_hawb: "",
                        postcode_shr_hawb: "",
                        lxr_shr_hawb: "",
                        phone_shr_hawb: "",
                        fax_shr_hawb: "",
                        email_shr_hawb: "",
                        taxcode_shr_hawb: "",
                        ybstoreList: [],
                        customerRelList: [],
                        hawbList: [],
                        inoperationprice: '',//操作费单价
                        ybvolumeremark: '',
                        isimperfect: 2 //2预定舱 1正式订舱
                    },
                    newService: {},
                    detailShow: {
                        supplement: true,//选填信息展开
                        ybstoreList: false,
                        fareInputViewData: false,
                        serviceDetail: false,
                        supplementView: true,
                    },
                    tabsList: [{ title: '总单信息' }, { title: '分单信息' }],
                    tabsChecked: 0,
                    goodsinfoRequired: '',//订舱信息必填
                    fareinfoRequired: '',//订舱信息必填
                    supplementRequired: '',//补充信息必填
                    basicinfoRequired: '',
                    gnServiceRequired: '',
                    // gnSeviceContent: ['AA0410', 'AG0145', 'AB0420', 'AA0510', 'AB0520', 'AA0610', 'AG0150', 'AA0850', 'AB0620', 'AA0110', 'AA0120', 'AG0110', 'AA0230', 'AA0240', 'AG0115', 'AG0120', 'AA0810', "AA0830", 'AA0840', 'AG0125', 'AG0130', 'AG0135'],//国内服务有详细内容信息的
                    pointArr: [
                        { title: '货物信息', href: "#goodsinfoView", show: true },
                        { title: '运价信息', href: "#fareInputViewData", show: false },
                        { title: '服务项目', href: "#serviceDetail", show: false },
                        { title: '选填信息', href: "#supplementView", show: false },
                    ],
                    // pointIndex: 0,
                    // mawbguid: '',
                    pricefieldArr: [
                        "inwageallinprice",
                        "outwageallinprice",
                        "outwageallinprice_trans",
                        "inwageallinprice_trans",
                        "inwagecostprice",
                        "inwageallinprice_record"
                    ], //单证确认详细不覆盖本页面的字段
                    hawbListBackup: [],
                    ybstoreListBackup: [],
                    // nextstepshow: false,
                    // tempConfigShow: true,//用于初始化服务模板组件
                    panelDisplay: {
                        clause: false,//条款
                        thdinfo: false,//提货地信息
                        lxrShow: false,//联系人
                        expressShow: false//仓库地图
                    },
                    ckmapUrl: '',
                    selServicecode: '',
                    reader: false
                }
            },
            initDataFunc() {//初始化所有数据
                let data = this.getInitData()
                Object.keys(data).forEach(i => {
                    if (!['basicinfoView', "goodsinfoView", 'fareInputViewData', "supplementView", "thViewData"].includes(i)) {
                        this[i] = data[i]
                    }
                })
                this.otherInitData();
                this.tempConfigShow = false;
                this.$nextTick(() => {
                    this.tempConfigShow = true;
                })
            },
            otherInitData() {
                if (this.pagetype == 1) {

                }
                setTimeout(() => {
                    this.$refs.houseNumberAdd && this.$refs.houseNumberAdd.initfunc()
                }, 100);


            },
            goodsHawbChange(val, field) {//根据货物信息改变对应的分运单号，自动带出与删除分运单号，自动配置分运单号中进仓编号
                // if (this.pagetype == 2) return;//修改页面，ybstorelist里面的sid是分单的guid
                let ybstoreListHawbArr = [...new Set(this.inputModelData.ybstoreList.filter(i => i.hawb).map(i => i.hawb))]
                let hawbListHawbArr = [...new Set(this.inputModelData.hawbList.filter(i => i.hawb).map(i => i.hawb))]
                let addhawblist = ybstoreListHawbArr.filter(i => !hawbListHawbArr.includes(i))
                let delhawblist = hawbListHawbArr.filter(i => !ybstoreListHawbArr.includes(i))
                if (addhawblist.length > 0) {//分单列表不存在所属分运单,要新增分运单
                    addhawblist.forEach(i => {
                        this.$refs.hawbtab && this.$refs.hawbtab.addHawb({ hawb: i })
                    })
                }
                if (delhawblist.length > 0) {//分单中有但是仓库没有该分运单，说明要删除
                    delhawblist.forEach(i => {
                        this.inputModelData.hawbList.splice(this.inputModelData.hawbList.findIndex(e => e.hawb == i), 1)
                    })
                }

                this.inputModelData.hawbList.forEach(i => {
                    this.$set(i, 'khjcno', this.inputModelData.ybstoreList.filter(e => e.hawb == i.hawb).map(i => i.khjcno).toString())
                })
            },
            handleClick(e) {
                this.detailShow.supplement = true
            },
            verificationSize(){//验证是否需要判断预报尺寸备注是必填
                    return  this.$refs.houseNumberAdd && this.$refs.houseNumberAdd.hasSize
            },
            detailPaneDisplay(type) {
                //判断信息模块是否显示隐藏
                //type 1 运价模块 2货物模块
                let isimperfect = this.inputModelData.isimperfect
                let fareshow = !this.goodsinfoRequired && this.inputModelData.hwlx
                let goodsshow = Boolean(this.inputModelData.ybstoreList.filter(i => !i.isadd).length > 0 && (this.verificationSize()?true:this.inputModelData.ybvolumeremark))
                let serviceshow = !this.fareinfoRequired && isNumber(this.inputModelData.self_real_bp_freight_in) && isNumber(this.inputModelData.cus_real_bp_freight_in)


                if (isimperfect == 2) {//预订舱
                    if (type == 1) {
                        return fareshow
                    }
                    if (type == 4) {
                        return fareshow&&serviceshow
                    }
                } else {
                    if (type == 1) {
                        return fareshow && goodsshow
                    }
                    if (type == 2) {
                        return fareshow
                    }
                    if (type == 3 || type == 4) {
                        return fareshow && goodsshow && serviceshow
                    }

                }


                return false
            },
            areaChange(e) {
                if (this.inputModelData.ysservice) {
                    this.inputModelData.ysservice.store_thr = '';
                }

                if (e) {
                    let options = JSON.parse(localStorage.groupType).filter(i => i.groupid == '101' && i.typename.includes(e))
                    if (options.length) {
                        this.inputModelData.sfg = options[0].typename.split('丨')[1]
                    }
                }
                let options = JSON.parse(sessionStorage.out_storelist).filter(i => i.area == this.inputModelData.area) || []
                if (options.length) {
                    if (this.inputModelData.ysservice) {
                        this.inputModelData.ysservice.store_thr = options[0].storename;
                    }
                    //   this.ckmapUrl = 'http://erp.wecanintl.com/outsidewebapi/api/ExAiraxpCheckBillPchUnFinishImage?sid=1272932&fid=1719&accountcomname=德迅（中国）货运代理有限公司'
                    if (options[0].isexistmap == 1) {//有图片
                        this.ckmapUrl = `${this.$store.state.webApi}api/PubStoreMapImage?area=${e}&storename=${options[0].storename}`
                    } else {
                        this.ckmapUrl = ''
                    }

                }
            },
            exInfo(data) {
                if (data && data.code) {
                    this.panelDisplay.thdinfo = true
                    this.selServicecode = data.code
                }
            },
            thdDialog(type) {
                //1 确认 2取消
                let data = this.inputModelData.ysservice
                if (type == 1) {
                    if (this.selServicecode == 'AA0510') {
                        if (!data.company_thr_org || !data.address_thr_org || !data.pickupdate_org || !data.lxr_thr_org || !data.phone_thr_org || !data.khjcno || !data.piece || !data.weight) {
                            this.$message.error('请填写完整信息！');
                            return false;
                        }
                    }
                    if (this.selServicecode == 'AA0410') {
                        if (!data.yqfinishdate_org) {
                            this.$message.error('请填写完整信息！');
                            return false;
                        }
                    }
                    this.newService[this.selServicecode].model = true
                    this.panelDisplay.thdinfo = false;

                }
                if (type == 2) {
                    this.panelDisplay.thdinfo = false;
                }

            },
            pageChange(pagestep) {
                if (pagestep == 3) {
                    this.saveMawbInfo().then(res => {
                        if (res) {
                            this.panelDisplay.clause = false;
                            this.pagestep = pagestep;
                        }
                    })
                } else {
                    if (this.getInfo()) {
                        this.pagestep = pagestep;
                        if (pagestep == 2) {
                            this.reader = this.inputModelData.isimperfect == 2
                        }
                    } else {
                        return
                    }
                }
                this.scrollTop(0);
            },
            scrollTop(num) {
                if (this.pagetype == 1) {
                    $('.addcontent').parents('.main-right-content').scrollTop(num || 0);
                } else {
                    $('.addcontent').parents('.dialogPage').scrollTop(num || 0);
                }
            },
            checkFirstPage() {

                if (this.basicinfoRequired) {
                    this.$message.error("请选择" + this.basicinfoRequired);
                    this.scrollTop(0);
                    return false;
                }

                if (this.goodsinfoRequired) {
                    this.$message.error("请填写" + this.goodsinfoRequired);
                    this.scrollTop(250);
                    return false;
                }

                if (!this.inputModelData.hwlx) {
                    this.scrollTop(350);
                    this.$message.error("请选择货物类型!");
                    return false;
                }

                if (this.fareinfoRequired) {
                    this.$message.error("请填写" + this.fareinfoRequired);
                    this.scrollTop(350);
                    return false;
                }

                if (!isNumber(this.inputModelData.self_real_bp_freight_in) || !isNumber(this.inputModelData.cus_real_bp_freight_in)) {
                    this.$message.error("请填写空运费单价的分泡比例！");
                    this.scrollTop(350);
                    return false;
                }



                if (this.inputModelData.isimperfect == 1) {

                    if (this.supplementRequired) {
                        this.$message.error("请填写" + this.supplementRequired);
                        return false;
                    }

                    if (
                        this.$refs.makeBillRevSed &&
                        this.$refs.makeBillRevSed.ifHasLimit()
                    ) {
                        this.$message.error(this.$refs.makeBillRevSed.ifHasLimit());
                        this.scrollTop(1150);
                        return false;
                    }
                }

                return true;
            },
            getInfo(checkRequired = true, isSave = true) {
                if (checkRequired) {
                    if (!this.checkFirstPage()) return;

                    if (this.serviceSelArr.length == 0) {
                        this.$message.error("请选择服务！");
                        return;
                    }
                }
                let mawbInfo = JSON.parse(JSON.stringify(this.inputModelData));

                if (mawbInfo.isimperfect == 1) {

                    let ybstoreList = mawbInfo.ybstoreList.filter(i => !i.isadd);
                    if (ybstoreList.length == 0) {
                        this.$message.error("请至少输入一条进仓编号信息");
                        this.scrollTop(650);
                        return;
                    }
                    let emptyybstoreList = ybstoreList.filter(i => !i.khjcno || !i.piece || !i.weight || !i.volume || !i.storeType || ((i.storeType == '入库' || i.storeType == '晚入库') && !i.storename_yb))

                    if (emptyybstoreList.length > 0) {
                        this.scrollTop(650);
                        this.$message.error("请完善进仓编号信息！");
                        return;
                    }

                    if (mawbInfo.czlx == '自货' && (!this.verificationSize()&&!mawbInfo.ybvolumeremark)) {
                        this.scrollTop(700);
                        this.$message.error("请填写尺寸备注！");
                        return;
                    }

                    function isValidateNumber(val) {
                        return !Number.isNaN(Number(val));
                    }

                    // console.log(this.hawbListBackup)
                    if (mawbInfo.orderdom == "总单" && this.pagetype == 2) {
                        this.hawbListBackup.forEach(i => {
                            let isold = mawbInfo.hawbList.filter(e => e.guid == i.guid)
                            if (isold.length == 0) {
                                let e = { ...i };
                                e.isdel = 2;
                                mawbInfo.hawbList.push(e)
                            } else {
                                let item = isold[0]
                                if (item.isdel != 2) {
                                    i.ybstoreList && i.ybstoreList.forEach(n => {
                                        let isstoreold = item.ybstoreList.filter(e => e.guid == n.guid);
                                        if (isstoreold.length == 0) {
                                            let e = { ...n };
                                            e.isdel = 2;
                                            item.ybstoreList.push(e)
                                        } else {
                                            let itemstore = isstoreold[0]
                                            if (itemstore.isdel != 2) {
                                                n.ybstorevolumeList && n.ybstorevolumeList.forEach(m => {
                                                    let isvolumeold = itemstore.ybstorevolumeList.filter(e => e.guid == m.guid);
                                                    if (isvolumeold.length == 0) {
                                                        let e = { ...m };
                                                        e.isdel = 2;
                                                        itemstore.ybstorevolumeList.push(e)
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                        this.ybstoreListBackup.forEach(i => {
                            let isstoreold = ybstoreList.filter(e => e.guid == i.guid);
                            if (isstoreold.length == 0) {
                                let e = { ...i };
                                e.isdel = 2;
                                ybstoreList.push(e)
                            }
                        })
                    }


                    for (let item of ybstoreList) {
                        // delete item.ybstorevolumeList;
                        item.ybstorevolumeList && item.ybstorevolumeList.forEach((i, k) => {
                            if (i.packagetypename && i.piece && i.longs && i.widths && i.heights) {
                                if (item.guid) {
                                    i.sid = item.guid;
                                }
                            } else {
                                item.ybstorevolumeList.splice(k, 1)
                            }

                        })
                    }

                    if (this.pagetype == 2) {
                        mawbInfo.hawbList.forEach(i => {
                            i.ybstoreList.forEach((e, k) => {
                                let arr = mawbInfo.ybstoreList.filter(n => n.guid == e.guid)
                                if (arr.length > 0) {
                                    i.ybstoreList[k] = arr[0]
                                }
                            })
                        })
                    }

                    mawbInfo.ybstoreList = ybstoreList.filter(i => {//配置在分单上的不传给总单
                        return mawbInfo.hawbList.filter(e => e.hawb == i.hawb).length == 0
                    });



                    mawbInfo.ybstoreList.forEach(i => {
                        delete i.timestamp
                    })
                    mawbInfo.hawbList.forEach(i => {
                        delete i.timestamp;
                        if (i.ybstoreList) {
                            i.ybstoreList.forEach(e => {
                                delete e.timestamp;
                                // delete e.ybstorevolumeList
                            })
                        }
                    })




                    if (checkRequired) {
                        if (mawbInfo.hawbList && mawbInfo.hawbList.length > 0) {
                            var flag = false;
                            var tradeterm = false;
                            mawbInfo.hawbList.forEach(e => {
                                if (
                                    !e.companytitle_fhr_hawb ||
                                    !e.address_fhr_hawb ||
                                    !e.companycode_fhr_hawb ||
                                    !e.city_fhr_hawb ||
                                    !e.companytitle_shr_hawb ||
                                    !e.address_shr_hawb ||
                                    !e.companycode_shr_hawb ||
                                    !e.city_shr_hawb
                                ) {
                                    flag = true;
                                }
                                if (!e.tradeterm) {
                                    tradeterm = true;
                                }
                            });
                            /*    if(flag){
                                      this.$message.error("请填写分单收发货人");return
                              } */
                            if (tradeterm) {
                                let message = "";
                                this.scrollTop(1700);
                                this.tabsChecked = 1;
                                this.detailShow.supplement = true;
                                this.$message.error(message + "请选择分单贸易方式");
                                return;
                            }

                            // if (this.$refs.hawbtab && this.$refs.hawbtab.checkHasLimit()) {
                            //   this.$message.error(
                            //     `请检查分单${this.$refs.hawbtab.checkHasLimit()}的收发货人是否超出字符限制！`
                            //   );
                            //   return;
                            // }
                        }
                    }

                }
                if (this.pagetype == 1) {
                    mawbInfo.serviceList = this.serviceList
                    mawbInfo.fid = sessionStorage.out_gid;
                    mawbInfo.gid = -1;
                    mawbInfo.ordertype = "";
                    mawbInfo.dom = localStorage.dom || "出口部";
                    mawbInfo.salesarea = mawbInfo.area;
                    mawbInfo.salesdom = "出口部";
                    mawbInfo.assignarea = mawbInfo.area;
                    mawbInfo.assigndom = "出口部";

                    mawbInfo.freightfee_remark = "";
                    mawbInfo.czlx = mawbInfo.opersystem == "出口" ? mawbInfo.czlx : mawbInfo.system;

                    mawbInfo.customerRelList = [
                        {
                            area: mawbInfo.area,
                            comxz: "1",
                            department: "客服",
                            email: sessionStorage.out_email,
                            jobno: null,
                            lxrss: 2,
                            lxrtitle: "客服",
                            mobile: sessionStorage.out_mobile,
                            name: sessionStorage.out_uname,
                            phone: "",
                            post: "客服",
                            qq: "",
                            system: "-1",
                        }
                    ]
                } else {
                    mawbInfo.serviceList = mawbInfo.serviceList.map(i => {
                        return Object.assign({}, i, this.serviceList.find(e => e.servicecode == i.servicecode))
                    })

                    mawbInfo.serviceList.forEach(i => {
                        i.oprequest = this.newService[i.servicecode].oprequest
                        i.isdel = this.newService[i.servicecode].model ? 1 : 2
                        i.yqfinishdate = this.newService[i.servicecode].yqfinishdate
                    })
                    mawbInfo.ysservice.guid = mawbInfo.ysservice.guid || -1;
                }

                if (!this.serviceSelArr.includes('AA0510')) {
                    mawbInfo.ysservice.company_thr_org = '';
                    mawbInfo.ysservice.khjcno = '';
                    mawbInfo.ysservice.piece = '';
                    mawbInfo.ysservice.weight = '';
                    mawbInfo.ysservice.volume = '';
                    mawbInfo.ysservice.address_thr_org = '';
                    mawbInfo.ysservice.address_thrjson_org = '';
                    mawbInfo.ysservice.lxr_thr_org = '';
                    mawbInfo.ysservice.phone_thr_org = '';
                    mawbInfo.ysservice.pickupdate_org = '';
                }

                if (!this.serviceSelArr.includes('AA0410')) {
                    mawbInfo.ysservice.yqfinishdate_org = '';
                    mawbInfo.ysservice.store_thr = '';
                }
                mawbInfo.yqhbh = mawbInfo.hbh
                mawbInfo.yqhbrq = mawbInfo.hbrq
                mawbInfo.yjqfsj = mawbInfo.qfsj
                mawbInfo.customprice = mawbInfo.inwageallinprice ? 2 : 1;

                mawbInfo.inwageallinprice_trans =
                    mawbInfo.inwageallinprice_trans || 666666;
                mawbInfo.inwageallinprice_record =
                    mawbInfo.inwageallinprice_record || 666666;
                mawbInfo.isinwageallin_trans =
                    mawbInfo.isinwageallin_trans || 666666;
                mawbInfo.inwageallinprice =
                    mawbInfo.inwageallinprice || 666666;
                mawbInfo.inwageallinprice = mawbInfo.inwageallinprice || 666666;
                mawbInfo.inwageallinprice_trans =
                    mawbInfo.inwageallinprice_trans || 666666;

                delete mawbInfo.jsonArr;
                delete mawbInfo.khjcnolist;

                if (mawbInfo.isimperfect == 2) {
                    mawbInfo.ybstoreList = []
                }
                return mawbInfo;
            },
            async saveMawbInfo() {
                let mawbInfo = this.getInfo();
                // console.log(11111111111);
                // console.log(mawbInfo); return;
                if (!mawbInfo) {
                    return;
                }

                if (this.pagetype == 1) {
                    if (mawbInfo.system == "空出" && mawbInfo.area == '上海') {
                        mawbInfo.nodecode = "AO5025";
                    } else {
                        mawbInfo.nodecode = "AO5020";
                    }
                    console.log(mawbInfo);
                    await this.$axios({
                        method: "post",
                        url: this.$store.state.webApi + "api/ExHpoAxplineOutsideInsert",
                        data: mawbInfo,
                        loading: true,
                        tip: false
                    }).then(results => {
                        if (results.data.resultstatus == 0) {
                            let str = '';
                            if (mawbInfo.isimperfect == 2) {
                                str = "预订舱成功" + "，订舱编号为：" + results.data.resultno + ",待唯凯确认后请在\"订单未完善\"页面中完善订舱信息。"
                            } else {
                                str = "订舱成功" + "，订舱编号为：" + results.data.resultno + "。"
                            }
                            this.$alert(str, "提示", {
                                confirmButtonText: "确定",
                                callback: action => {
                                    this.panelDisplay.clause = false;
                                    this.pagestep = 3;
                                }
                            });
                            return true
                        } else {
                            this.$message.error(results.data.resultmessage);
                            return false

                        }
                    })

                } else {
                    await this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/ExHpoAxplineOutsideUpdate",
                        data: mawbInfo,
                        loading: true,
                        tip: false
                    })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                this.$message.success(results.data.resultmessage);
                                if (this.frompage == 4) {
                                    // setTimeout(() => {
                                    //     this.getMawbdetail()
                                    // }, 8000);
                                    this.$emit('success', true)
                                } else {
                                    this.$emit('success', 2)
                                }
                                return true
                            } else {
                                this.$message.error(results.data.resultmessage);
                                return false

                            }
                        })

                }
            },
            async getMawbdetail() {
                //获取总单详细信息
                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxpline",
                    params: {
                        boguid: this.boguid,
                        isallinfo: true
                    },
                    loading: true,
                    tip: false
                }).then(results => {
                    if (!results.data) {
                        return this.$message.error("查询错误，无详细信息！");
                    }
                    console.log("总单详细");
                    console.log(JSON.stringify(results.data));
                    let data = results.data;

                    data.serviceList = data.serviceList.filter(i => {
                        if (data.opersystem == "国内服务") {
                            return i.servicecode != "OA0010" && i.servicecode != "YS0010";
                        } else {
                            return i.servicecode != "YS0010";
                        }
                    });
                    data.deliverydate = formatDate(data.deliverydate, "yyyy-MM-dd hh:mm");
                    data.ddrq = formatDate(data.ddrq, "yyyy-MM-dd");
                    data.hbrq = formatDate(data.hbrq, "yyyy-MM-dd");
                    data.ysservice = data.ysservice || { company_thr_org: '', khjcno: '', piece: '', weight: '', volume: '', address_thr_org: '', address_thrjson_org: '', lxr_thr_org: '', phone_thr_org: '', pickupdate_org: '', yqfinishdate_org: '', store_thr: '' }//提货信息
                    if (this.pagetype == 2 && data.yjqfsj) {
                        data.qfsj = formatDate(data.yjqfsj, 'yyyy-MM-dd hh:mm')
                    }

                    this.pricefieldArr.forEach(i => {
                        data[i] = !data[i] || data[i] == 666666 ? "" : String(data[i]);
                    });

                    if (data.ybstoreList) {
                        data.ybstoreList.forEach(i => {
                            if (i.sid > 0) {
                                i.timestamp = i.sid
                            } else {
                                i.timestamp = new Date().getTime()
                            }
                        })
                        this.ybstoreListBackup = JSON.parse(JSON.stringify(data.ybstoreList))
                    }


                    Object.keys(data).forEach(i => {
                        this.inputModelData[i] = data[i]
                    })

                    setTimeout(() => {
                        this.serviceList = this.inputModelData.serviceList
                        this.$refs.houseNumberAdd && this.$refs.houseNumberAdd.initfunc()
                    }, 100);
                    //    this.getHawbNum()
                    this.inputModelData.hawbList = this.inputModelData.axpList;

                    this.inputModelData.hawbList.forEach(i => {
                        this.$set(i, 'khjcno', i.ybstoreList && i.ybstoreList.map(i => i.khjcno).toString() || '')
                        this.$set(i, 'timestamp', i.guid)
                    })
                    this.hawbListBackup = JSON.parse(JSON.stringify(this.inputModelData.hawbList));

                });
                return this.inputModelData
            },
            async getHawbNum() {
                //获取分单号
                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxpline",
                    params: {
                        hpoid: this.inputModelData.guid
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    let data = results.data
                    data.forEach(i => {
                        i.khjcno = i.ybstoreList && i.ybstoreList.map(i => i.khjcno).toString() || '';
                        i.timestamp = i.guid
                    })

                    this.hawbListBackup = JSON.parse(JSON.stringify(data));
                    this.inputModelData.hawbList = data
                });

                return this.hawbListBackup;
            },
            datePickerChange(e) {
                console.log(e)
                console.log(this.selServicecode)
                if (this.selServicecode == 'AA0410') {
                    this.inputModelData.ysservice.yqfinishdate_org = e
                }
                if (this.selServicecode == 'AA0510') {
                    this.inputModelData.ysservice.pickupdate_org = e
                }
            }
        },
        computed: {
            elStepsArr() {
                //客户不报价的情况下,节点改为 订舱成功->唯凯报价->客户确认报价->唯凯操作中->唯凯操作完成
                if (this.inputModelData.isimperfect == 2) {
                    return [
                        { class: 'el-icon-addsuccess', title: '预订舱成功', index: 0 },
                        { class: 'el-icon-dengdeng', title: '唯凯确认', color: '#DADEE3', index: 1 },
                        { class: 'el-icon-dengdeng', title: '客户完善订舱信息', color: '#DADEE3', index: 2 },
                        { class: 'el-icon-dengdeng', title: '唯凯操作', color: '#DADEE3', index: 3 },
                    ]
                } else {

                    let arr = [
                        { class: 'el-icon-addsuccess', title: '订舱成功', index: 0 },
                        { class: 'el-icon-nodetime', title: '唯凯受理', color: '#6D7D95', index: 1 },
                        { class: 'el-icon-dengdeng', title: '唯凯报价', color: '#DADEE3', index: 2 },
                        { class: 'el-icon-dengdeng', title: '唯凯确认', color: '#DADEE3', index: 3 },
                        { class: 'el-icon-dengdeng', title: '客户确认', color: '#DADEE3', index: 4 },
                        { class: 'el-icon-dengdeng', title: '唯凯操作中', color: '#DADEE3', index: 5 },
                        { class: 'el-icon-dengdeng', title: '唯凯操作完成', color: '#DADEE3', index: 6 },
                    ]
                    let showIndex = [];
                    if (!this.serviceSelArr.includes('OA0010')) {//代操作
                        showIndex = [0, 1, 5, 6]
                    } else {
                        if (!this.inputModelData.inwageallinprice) {
                            showIndex = [0, 2, 4, 5, 6]
                        } else {
                            showIndex = [0, 3, 5, 6]
                        }
                    }
                    return showIndex.length ? showIndex.map(i => arr[i]) : arr

                }

            },
            serviceSelArr() {
                let arr = [];
                // this.serviceTabsList = []
                for (let i in this.newService) {
                    if (this.newService[i].model) {
                        let code = this.newService[i].servicecode
                        arr.push(code);
                        // if (this.gnSeviceContent.includes(code)) {
                        //     this.serviceTabsList.push({ title: this.newService[i].title, code })
                        // }
                    }
                }
                return arr;
            },
            serviceList: {
                get() {
                    var serviceList = [];
                    for (let i in this.newService) {
                        let item = this.newService[i];
                        serviceList.push({
                            servicecode: item.servicecode,
                            oprequest: item.oprequest,
                            isdel: item.model ? 1 : 2,
                            assignname: item.title,
                            port: item.port,
                            assignstatus: item.assignstatus,
                            title: item.title,
                            yqfinishdate: item.yqfinishdate
                        });
                    }
                    return serviceList;
                },
                set(val) {
                    //this.initFunc()
                    val.forEach(item => {
                        if (item.servicecode&& this.newService[item.servicecode]) {
                            this.newService[item.servicecode].model =
                                item.servicecode == 'OA0010' ? this.inputModelData.system != '国内服务' && this.inputModelData.czlx == '自货' : item.isdel == 1;
                            this.newService[item.servicecode].oprequest = item.oprequest;
                        }
                    });
                }
            },
            gooodsOutgauge() {
                //进仓编号中的货物是否超规，当进仓编号中，单件重量过2吨 或 宽超过160 或 高超过185 则显示超规
                // return this.inputModelData.ybstoreList.filter(i => {
                //   return i.weight >= 2000 || (i.ybstorevolumeList.filter(e => e.widths >= 160 || e.heights >= 185)).length
                // }).length > 0
                return this.inputModelData.ybstoreList && this.inputModelData.ybstoreList.filter(i => i.khjcno && i.isstorelimit == 1).length > 0
            }
        },
        created() {
            if (this.pagetype == 2) {
                this.getMawbdetail().then(res => {
                    this.$set(this.inputModelData, 'isimperfect', 1);
                    // this.basicinfoView.isimperfect.disabled = true;
                })
            }
            this.$watch(() => {
                return this.inputModelData.ybstoreList
            }, (val) => {
                this.inputModelData.goodsybpiece = val.reduce((a, b) => { return a += Number(b.piece) }, 0);
                // this.inputModelData.goodssmallpiece = val.reduce((a, b) => { return a += Number(b.smallpiece) }, 0);
                this.inputModelData.goodsybweight = val.reduce((a, b) => { return a += Number(b.weight) }, 0);
                this.inputModelData.goodsybvolume = (val.reduce((a, b) => { return a += Number(b.volume) }, 0)).toFixed(3);
                if (Number(this.inputModelData.goodsybpiece) || Number(this.inputModelData.goodsybweight) || Number(this.inputModelData.goodsybvolume)) {
                    this.goodsinfoView.goodsybweight.hidden = false
                    this.goodsinfoView.goodsybpiece.hidden = false
                    this.goodsinfoView.goodsybvolume.hidden = false
                    this.goodsinfoView.ybvolume.occupyRestSpace = false
                    this.goodsinfoView.ybpiece.itemStyle = { width: '200px', 'margin-right': '6px' }
                    this.goodsinfoView.ybweight.itemStyle = { width: '200px', 'margin-right': '6px' }
                    this.goodsinfoView.ybvolume.itemStyle = { width: '200px', 'margin-right': '6px' }

                } else {
                    this.goodsinfoView.goodsybweight.hidden = true
                    this.goodsinfoView.goodsybpiece.hidden = true
                    this.goodsinfoView.goodsybvolume.hidden = true
                    this.goodsinfoView.ybvolume.occupyRestSpace = true
                    this.goodsinfoView.ybpiece.itemStyle = {}
                    this.goodsinfoView.ybweight.itemStyle = {}
                    this.goodsinfoView.ybvolume.itemStyle = {}
                }

                this.thViewData.khjcno.options = this.inputModelData && this.inputModelData.ybstoreList.filter(i => i.khjcno).map(i => { return { label: i.khjcno, value: i.khjcno } })

            }, { deep: true })

            this.$watch(() => {
                return this.inputModelData.ysservice && this.inputModelData.ysservice.khjcno
            }, (val) => {
                if (this.inputModelData.ysservice) {
                    let piece = 0, weight = 0, volume = 0;
                    if (val && val.split(',').length > 0) {
                        this.inputModelData.ybstoreList && this.inputModelData.ybstoreList.forEach(i => {
                            if (val.split(',').includes(i.khjcno)) {
                                piece += Number(i.piece);
                                weight += Number(i.weight);
                                volume += Number(i.volume);
                            }
                        })
                    }
                    this.inputModelData.ysservice.piece = piece
                    this.inputModelData.ysservice.weight = Number(weight).toFixed(2)
                    this.inputModelData.ysservice.volume = Number(volume).toFixed(3)
                }

            })


            this.$watch(() => {
                return this.inputModelData.area
            }, (val) => {
                this.areaChange(val)
            })

            this.$watch(
                function () {
                    return (
                        this.inputModelData.ybvolume + this.inputModelData.ybweight
                    );
                },
                function (newVal, oldVal) {
                    let volume = this.inputModelData.ybvolume;
                    let weight = this.inputModelData.ybweight;
                    this.inputModelData.jfWeight = computedWeight(volume, weight);

                    // let bubble = JudgeBubblesFunc(weight, volume) < 0;//只有泡货，显示分泡
                    // console.log(bubble)
                    // this.fareInputViewData.zzFp.hidden = !bubble
                    // this.fareInputViewData.priceFp.hidden = !bubble
                }, { immediate: true }
            );





        }


    }



</script>
<style lang='less' scoped>
    @import './smallTemplate/small.less'; //必须加;号

    .contents>div {
        margin-bottom: 100px;
    }

    /deep/ .detail {
        position: relative;
        margin: 20px 0px;
        border: 1px solid #e8e8e8;

        &:last-child {
            margin-bottom: 0;
        }

        >.detail-title {
            position: relative;
            height: 36px;
            line-height: 36px;
            padding-left: 12px;
            font-size: 14px;
            font-weight: bolder;
            color: #0f5a8c;
            background: #f8f8f8;
            border-bottom: 1px solid #e8e8e8;
            display: flex;
            justify-content: flex-start;
        }

        .detail-c {
            padding: 20px;

            .mawb-import {
                //  position: absolute;
                // top: 4px;
                //  right: 5px;
                margin-left: 5px;
            }
        }
    }

    .clause {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;

        .clause-shadow {
            width: 100%;
            height: 100%;
            background: #000000;
            opacity: 0.4;
            position: absolute;
        }

        .clause-content {
            position: absolute;
            width: 1100px;
            max-height: 850px;
            overflow: hidden scroll;
            background: #FFFFFF;
            border-radius: 8px;
            opacity: 1;
            padding: 40px;

            h2 {
                font-size: 18px;
                color: @titleColor;
                text-align: center;
                margin-bottom: 24px;
            }

            h3 {
                margin-top: 20px;
                margin-bottom: 8px;
            }

            p {
                font-size: 14px;
                color: @contentColor;
                line-height: 26px;
                letter-spacing: 1px;
                text-indent: 30px;

                strong {
                    font-weight: bold;
                    color: #000;
                }

            }

            i {
                font-size: 22px;
                position: absolute;
                right: 15px;
                cursor: pointer;
                top: 20px
            }
        }
    }


    .elSteps {
        display: flex;
        align-items: center;
        justify-content: center;

        div {
            display: grid;
            place-items: center;
            row-gap: 8px;

            p {
                height: 20px;
            }
        }

        i {
            font-size: 48px;
        }

        span {
            display: inline-block;
            width: 86px;
            height: 2px;
            background-color: #DADEE3;
            margin: 16px;
        }

        .checked {

            i,
            p {
                color: #14A207;
            }

            span {
                background: transparent linear-gradient(270deg, #6D7D95 0%, #14A207 100%) 0% 0% no-repeat padding-box;
            }
        }

    }

    .textrequirement {
        width: 440px;
        background-color: #FDEDD9;
        border: 1px solid #FDEDD9;
        border-radius: 8px;
        margin-left: calc(50% - 220px);
        margin-top: 20px;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        padding: 10px 0;

        i {
            font-size: 68px;
            color: #F7892A;
            margin-left: 12px;
        }

        >div {
            p {
                margin: 10px;
                color: #F7892A;
            }
        }


    }
</style>