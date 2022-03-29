<template>
    <div>
        <!-- {{newService}} -->
        <!-- {{pagetype}} -->
        <!-- {{signApplicationCanEdit}} -->
        <!-- ordertype 2操作站 3销售站 -->
        <!-- {{firstLevelTab}} -->
 <!--        {{ifSecond}}
        {{ifThird}} -->
        <!-- {{activeName}} -->
        <div class="mawbAddPut" v-if="!newMawbShow" :ordertype="ordertype" :pagetype="pagetype">
            <div v-fixtop style="background:#fff">
                <infoList :inputModelData="inputModelData" ref="refInfoList" :jiediandata.sync="jiediandata" :ifopendetail="false"
                    v-if="inputModelData.guid" name="详细" :showMawbSearch="inputModelData.groupid<0"
                    @success="getNewMawbinfo" :pagetype="pagetype" :positionDocUpload="positionDocUpload">
                    <!-- <template slot="betgroup2"> -->
                    <!-- <el-button type="success" btnnum="30" v-if="btnJurisdic(30)" @click="assignXsPlation" pagetype="3">分配信息</el-button> -->
                    <!-- <el-button type="success" btnnum="40" v-if="btnJurisdic(40)" @click="assignXsPlation" pagetype="2">分配信息</el-button> -->
                    <!-- </template> -->
                </infoList>



                <div  class="serviceTabs">
                    <!-- <div>
                        <span  class="servicetitle"  @click="changeIndex(-1);tabclick({name:'tab1-first'},1)" :class="{'is-active':activeName=='tab1-first'}">基本信息</span>
                        <div class="servicePort" >
                        </div>
                    </div> -->
                    <div v-for="(item,index) in  firstLevelTab" v-if="inputModelData.guid&&newService">
                       <div @click="changeIndex(index,true);tabclick({name:'tab1-first'},1)"  class="servicetitle"  :class="{'is-active':activeName=='tab1-first'&&index==firstLevelIndex}"  v-show="!(ifOperSysHome&&item=='出港操作')"><p>{{item}}</p><p style="font-size:12px">(基本信息)</p></div>
                        <div class="servicePort">
                            <!-- item=='出港操作'&&  4月份开始只有出港操作才显示 8月份发现问题现取消此条件-->
                            <div class="el-tabs__item is-top" v-for="tabitem in cgportTtabs" v-if="!ifOperSysHome" v-show="(item=='出港操作'||item=='进港服务'&&inputModelData.opersystem=='进口')&&showCgportTab(tabitem.tabcode)" :class="{'is-active':activeName==tabitem.tabcode}"
                                @click="changeIndex(index);tabclick({name:tabitem.tabcode},1)">
                                <myTabBadge   type="2"   :color="tabitem.nobgcolor?'badgeGrey':setTabBadgeType(tabitem.tabcode)" :noareacode="tabitem.noareacode" :label="getTitle(tabitem.label)" >
                                </myTabBadge>
                            </div><div class="el-tabs__item is-top" v-for="tabcode in getPortChildren(item)" v-show="hasServiceContent.includes(tabcode)" :class="{'is-active':activeName==tabcode}" :tabcode="tabcode" @click="changeIndex(index);tabclick({name:tabcode},1)">
                                <myTabBadge v-if="inputModelData.guid&&newService[tabcode]" :tabcode="tabcode" type="2" :color="setTabBadgeType(tabcode)"
                                    :label="newService[tabcode].title" v-show="serviceSelArr.includes(tabcode)">
                                </myTabBadge>
                            </div>
                        </div>
                </div>

                    <div class="forstLevel" style="display: none;">
                        <el-button-group size="small" class="buttonTabs">
                            <el-button v-for="(item,index) in firstLevelTab" :key="index" style="height: 32px;"
                                :style="{border:index==firstLevelIndex?'1px solid #0F649B':''}"
                                :type="index==firstLevelIndex?'primary':''" @click="changeIndex(index)">
                                {{ifOperSysHome&&item=='出港操作'?"基本信息":item}}
                            </el-button>
                        </el-button-group>
                    </div>



                    <div style="position:absolute;right:0px;top:10px;z-index:1000" v-if="inputModelData.guid">
                        <template v-if="showOrderIncompleteBtn">
                            <el-button @click="operationSave" type="primary">本站操作</el-button>
                            <el-button @click="$emit('fenpei', {boguid: boguid, area: area})" type="primary">分配
                            </el-button>
                        </template>

                        <el-button btnnum="98" type="primary" @click="qdModify(1)" v-if="btnJurisdic(98)">待修改
                        </el-button>

                        <el-button btnnum="99" type="success" @click="qdModify(2)" v-if="btnJurisdic(99)">待修改完成
                        </el-button>

                        <!-- <el-button btnnum="101" type="primary" @click="signApplicationFunc" v-if="btnJurisdic(101)">签单申请</el-button>

                    <el-button btnnum="102" type="danger" @click="signBillFunc" v-if="btnJurisdic(102)">取消签单申请</el-button> -->

                        <el-button btnnum="105" @click="receiveBognXd(inputModelData.status==1?1:2)"
                            v-if="btnJurisdic(105)" :type="inputModelData.status==1?'primary':'danger'">
                            {{inputModelData.status==1?'任务接收':"取消接收"}}</el-button>

                        <!-- <el-button
              btnnum="107"
              type="primary"
              style="background:#FA1A1A"
              @click="hawbDeclBackVisible = true"
              v-if="btnJurisdic(107)"
            >退关</el-button> -->

                        <el-button btnnum="108" type="primary" @click="peicheBill(3)" v-if="btnJurisdic(108)">派遣单打印
                        </el-button>

                        <!-- 用于bogn -->
                        <el-button btnnum="111" type="primary" @click="peicheBill(4)" v-if="btnJurisdic(111)">操作流转单
                        </el-button>

                        <!-- <el-button
              btnnum="151"
              @click="orderSplit"
              type="primary"
              v-if="btnJurisdic(151)"
            >拆分</el-button> -->

                        <el-button btnnum="109" type="primary" @click="printDz" v-if="btnJurisdic(109)">预付通知单
                        </el-button>

                         <el-button btnnum="115" type="primary" @click="checkLxdDialogShow" v-if="btnJurisdic(115)">海关联系单
                        </el-button>

                        <el-button btnnum="110" type="primary" @click="peicheBill(2)" v-if="btnJurisdic(110)">操作流转单
                        </el-button>
                        <!-- note:  取消外站的"交货文件"按钮 -->
                        <!-- <el-button btnnum="120" type="primary" @click="jhwjDialog=true" v-if="btnJurisdic(120)">交货文件
                        </el-button> -->

                        <el-button btnnum="121" :disabled="this.ifServiceAllBind" type="primary" @click="operBinding()"
                            v-if="btnJurisdic(121)">{{this.ifServiceAllBind?'已绑定':'手动绑定'}}</el-button>

                        <el-button btnnum="130" @click="orderCancel=true" type="primary" style="background:#FA1A1A"
                            v-if="btnJurisdic(130)">撤单/驳回/退关</el-button>

                        <el-button btnnum="131" @click="mergeDialog=true" type="primary" style="background:#FA1A1A"
                            v-if="btnJurisdic(131)">编辑合并</el-button>

                        <el-button btnnum="132" @click="changeOrderdom(inputModelData.guid)" type="primary"
                            style="background:#FA1A1A" v-if="btnJurisdic(132)">转为一主一分</el-button>

                        <!-- <el-button btnnum="140" @click="cancelOrderFunc(1)" type="primary" style="background:#FA1A1A" v-if="cdFinish">取消撤单</el-button> -->
                        <!-- <template v-if="pagetype==3&&inputModelData.islocal==1"> -->
                        <el-button btnnum="150" @click="assignShow=true" type="primary" v-if="btnJurisdic(150)">分配至外站
                        </el-button>
                        <!-- </template> -->
                        <el-button btnnum="160" @click="operationSave" type="primary" v-if="btnJurisdic(160)">本站操作
                        </el-button>

                        <el-button btnnum="170" @click="orderFinishFunc" v-if="btnJurisdic(170)" type="primary">订单完成
                        </el-button>
                        <el-button btnnum="180" @click="orderFinishFunc" v-if="btnJurisdic(180)" type="danger">取消完成
                        </el-button>

                        <el-button btnnum="190" type="primary" @click="costDialog=true" v-if="btnJurisdic(190)">费用信息
                        </el-button>

                        <!-- <el-button
              btnnum="191"
              type="primary"
              @click="costDialog1=true"
              v-if="btnJurisdic(191)&&$store.state.ifMergeHawb"
            >费用信息-分单</el-button> -->

                        <!--  <el-button btnnum="200" v-if="btnJurisdic(200)" @click="submit(inputModelData.status >= 800 ? 700 : 800)" :disabled="inputModelData.status==1100" type="primary">{{ inputModelData.status >= 800 ? '取消结算' : '提交结算' }}</el-button>
          <el-button btnnum="210" v-if="btnJurisdic(210)" @click="submit(inputModelData.status == 1100 ? 800 : 1100)" type="primary">{{ inputModelData.status == 1100 ? '取消审单' : '提交并审单' }}</el-button>
            -->
                        <el-button btnnum="220" @click="saveMawbInfo" type="primary" v-if="btnJurisdic(220)">保存
                        </el-button>
                        <el-button type="primary" v-if="pageFrom=='order'" btnnum="230"
                            :disabled="odConfirm||(pageFrom=='order'&&inputModelData.dzstatus>=120)"
                            @click="saveMawbInfo('1')">订单确认</el-button>
                        <el-button type="primary" v-if="pageFrom=='document'" btnnum="240"
                            :disabled="odConfirm||(pageFrom=='document'&&inputModelData.dzstatus>=150)"
                            @click="saveMawbInfo('1')">单证确认</el-button>
                        <el-button type="primary" btnnum="250"
                            :disabled="!((pageFrom=='order'&&inputModelData.dzstatus>='120')||(pageFrom=='document'&&inputModelData.dzstatus>='150'))"
                            @click="saveMawbInfo('2')" v-if="pageFrom=='order'||pageFrom=='document'">取消确认</el-button>
                        <el-button type="primary" v-if="pageFrom=='document'&&inputModelData.ispriorcheck=='1'"
                            btnnum="260" @click="oversea=true">海外D/N制作</el-button>

                        <el-button @click="closeDialog">返回</el-button>
                    </div>
                </div>
            </div>

            <!-- tab内容页 -->
            <div class="content"
                :class="contentClass"
                style="position:relative;padding:6px;min-height:200px" v-if="inputModelData.guid">
                <div style="position:absolute;right:16px;top:-30px;z-index:1000">
                    <!-- 总单确认后不能编辑服务 -->
                    <el-popover placement="bottom" :title="badgePopoverTitle(1)" width="150" trigger="hover">
                        <div class="badgePopover">
                            <p v-show="ifOperSysHome&&!isBognTesk">
                                <i style="backgroundColor:rgba(121, 121, 121, 1)"></i>
                                <strong>未绑定</strong>
                            </p>

                            <p>
                                <i style="backgroundColor:#EA0000"></i>
                                <strong>{{badgePopoverTitle(2)}}</strong>
                            </p>

                            <p
                                v-show="!ifOperSysHome&&!['tab1-second','tab1-third','tab1-fifth','tab1-ninth'].includes(activeName)">
                                <i style="backgroundColor:#FE9600"></i>
                                <strong>已分配</strong>
                            </p>
                            <p
                                v-show="!ifOperSysHome&&!['tab1-second','tab1-third','tab1-fifth','tab1-ninth'].includes(activeName)">
                                <i style="backgroundColor:#0D79DD"></i>
                                <strong>已确认</strong>
                            </p>

                            <p>
                                <i style="backgroundColor:#0CAF00"></i>
                                <strong>{{badgePopoverTitle(3)}}</strong>
                            </p>
                        </div>
                        <i v-show="badgePopoverTitle(1)" slot="reference" class="el-icon-info"
                            style="color:#409EFF;font-size:16px;cursor:pointer;transform: translateY(5px);"></i>
                    </el-popover>

                    <!-- <el-button btnnum="271" :disabled="!showFwbjBtn" @click="serviceEditDialog">服务编辑</el-button> -->

                    <el-button btnnum="271" notHide @click="serviceEditDialog">服务编辑</el-button>
                </div>

                <div class="servicePort addputServicePort">
                    <el-tabs type="border-card" ref="serviceTabs" @tab-click="tabclick($event,1)" v-model="activeName">

                        <el-tab-pane name="tab1-first">
                            <!-- <span slot="label" class="badgeLabel"  v-show="activeName=='tab1-first'"
                                style="line-height:44px;padding:0px 20px">{{inputModelData.orderdom=='分单'?'分单信息':"基本信息"}}</span> -->
                            <div class="detail basic-information" v-if="ifOperSysHome&&ifThird.includes('tab1-first')">
                                <div class="detail-title" v-show="!ifOperSysHome">
                                    <p>基本信息</p>
                                </div>
                                <div class="detail-c" style="max-width:1300px">
                                    <newFormCmpt :view-data.sync="homeInformation" :model-data.sync="inputModelData"
                                        :pagetype="2" @wtdataP="wtdataP" :area="area" :system="inputModelData.system">
                                        <template slot="khjcnolist">
                                            <enterWarehouseBogn :hpoid="inputModelData.guid"
                                                :serviceSelArr="serviceSelArr" :boguid="inputModelData.boguid"
                                                :btnused="inputModelData.old_sendhpoid==-1&&inputModelData.bindeguid==-1"
                                                :khjcnolist="inputModelData.khjcnolist"></enterWarehouseBogn>
                                        </template>
                                    </newFormCmpt>
                                </div>
                            </div>
                            <div :class="{paneDisabled:allDisabled()||(inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!=2)}"
                                v-if="!ifOperSysHome&&ifThird.includes('tab1-first')">
                                <div class="detail basic-information">
                                    <div class="detail-title">
                                        <p>基本信息</p>
                                    </div>
                                    <div class="detail-c" style="max-width:1300px">
                                        <newFormCmpt :view-data.sync="basicInformation"
                                            :model-data.sync="inputModelData" :pagetype="2" @wtdataP="wtdataP"
                                            :area="area">
                                            <template slot="mawbAe">
                                                <el-input v-model="inputModelData.mawb" style="width:240px;"
                                                    :disabled="inputModelData.opersystem!='进口'" clearable
                                                    v-verify="'mawb'"></el-input>
                                            </template>
                                            <template slot="yjqfsj">
                                                <div
                                                    v-if="(inputModelData.opersystem=='出口'&&inputModelData.opersystemdom=='空运')">
                                                    <div style="height:28px;display:flex;align-items:center">
                                                        <span style="width:125px">{{inputModelData.yjqfsj |
                                                            formatDate('hh:mm')}}</span>
                                                        <i class="el-icon-edit-outline" title="航班维护"
                                                            @click="qfsjDialogFunc(1)"
                                                            style="font-size:20px;color:#30C76C;cursor:pointer"></i>
                                                        <i class="el-icon-refresh" title="刷新" @click="getQfsj(1)"
                                                            style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:12px;"></i>
                                                    </div>
                                                </div>

                                                <div v-else>
                                                    <el-time-picker v-model="inputModelData.yjqfsj" :picker-options="{
                                                        selectableRange: '00:00:00 - 23:59:59'
                                      }" value-format="yyyy-MM-dd HH:mm" format="HH:mm" style="width:120px">
                                                    </el-time-picker>
                                                </div>
                                            </template>
                                            <template v-if="!ifOperSysHome&&inputModelData.opersystem!='进口'">
                                                <template v-if="inputModelData.shipaceInfo.guid!=-1">
                                                    <template slot="hbh">
                                                        <span style="padding-left:8px;">{{inputModelData.shipaceInfo.hbh
                                                            }}</span>
                                                    </template>

                                                    <template slot="hbrq">
                                                        <span
                                                            style="padding-left:8px;">{{inputModelData.shipaceInfo.hbrq
                                                            | formatDate('yyyy-MM-dd')}}</span>
                                                    </template>

                                                    <template slot="qfsj">
                                                        <span>{{inputModelData.shipaceInfo.qfsj |
                                                            formatDate('hh:mm')}}</span>
                                                    </template>

                                                    <template slot="qcts">
                                                        <span
                                                            style="padding-left:8px;">{{inputModelData.shipaceInfo.qcts
                                                            }}</span>
                                                    </template>
                                                </template>
                                            </template>

                                            <template v-if="ifOperSysImport">
                                                <template slot="qfsj">
                                                    <el-time-picker v-model="inputModelData.qfsj" :picker-options="{
                                                selectableRange: '00:00:00 - 23:59:59'
                              }" value-format="yyyy-MM-dd HH:mm" format="HH:mm" style="width:120px"></el-time-picker>
                                                </template>
                                            </template>

                                            <template slot="exForm1">
                                                <hwxzCompt :inputModelData="inputModelData"
                                                    :disabledArr="basicInformation.exForm1.disabledArr"></hwxzCompt>
                                            </template>
                                        </newFormCmpt>
                                    </div>
                                </div>

                                <div class="detail basic-information"
                                    v-if="inputModelData.orderdom!='分单'&&area!=conditionalAreaForBuild">
                                    <div class="detail-title">
                                        <p>总单收发货人信息</p>
                                    </div>
                                    <div class="detail-c" style="max-width:1300px">
                                        <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSed"></revSedMawb>
                                        <revSed :dzinfo="inputModelData">
                                            <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码" v-model="inputModelData.taxcode_tzr_mawb"
                                                v-verify="'creditCode'"></el-input>
                                        </revSed>
                                    </div>
                                </div>

                                <div class="detail basic-information"
                                    v-if="inputModelData.orderdom=='分单'&&inputModelData.hawbAddress">
                                    <div class="detail-title">
                                        <p>分单收发货人信息</p>
                                    </div>
                                    <div class="detail-c" style="max-width:1300px">
                                        <revSedHawb :dzinfo="inputModelData.hawbAddress" ref="makeBillRevSedHawb">
                                        </revSedHawb>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>

                        <template v-if="!ifOperSysHome">

                            <el-tab-pane :label="getTitle('航线操作')" name="tab1-third"
                                v-if="showCgportTab('tab1-third')">
                                <myTabBadge v-show="showServiceTab('tab1-third')"
                                    :color="area==conditionalAreaForBuild?(inputModelData.pcstatus<100?'badgeRed':'badgeGreen'):(inputModelData.shipaceInfo.guid!=-1?'badgeGreen':'badgeRed')"
                                    :label="getTitle('航线操作')" slot="label"  tabcode="tab1-third" ></myTabBadge>
                                <!-- <span slot="label" class="badgeLabel"
                                    :class="[inputModelData.pcstatus<100?'badgeRed':'badgeGreen']"
                                    :label="getTitle('航线操作')"
                                    v-show="area==conditionalAreaForBuild&&firstLevelIndex==0&&zhuYinIsdel&&activeName=='tab1-third'">{{getTitle('航线操作').split(',')[0]}}
                                    <p style="width:100%;font-size:12px;text-align:center">
                                        ({{getTitle('航线操作').split(',')[1]}})</p></span> -->

                                <div v-if="inputModelData.opersystem!='进口'&&ifThird.includes('tab1-third')"
                                    :class="{paneDisabled:iscomboineChildren}">
                                    <div :class="{paneDisabled:inputModelData.isshipace==2}">
                                         <div class="detail"
                                            v-if="inputModelData.opersystem=='出口'&&inputModelData.opersystemdom=='空运'">
                                            <div class="detail-title">
                                                <p>配置总运单</p>
                                            </div>
                                            <div class="detail-c"
                                                :class="{paneDisabled:(orderFinish||(inputModelData.area==conditionalAreaForBuild&&inputModelData.dzstatus>200))&&inputModelData.commbillmodifystatus!=2||!hasMaincamp}">
                                                <div class="input-item width100"
                                                    style="margin-left: 40px;margin-bottom:15px;">
                                                    <div class="input-title">总运单号：</div>
                                                    <div class="input-content">
                                                        <el-input v-model="inputModelData.mawb" style="width:240px;"
                                                            disabled></el-input>
                                                        <el-button btnnum="340" @click="getMawbConfig"
                                                            :disabled="inputModelData.mawb?true:false"
                                                            v-if="btnJurisdic(340)">配置总运单</el-button>
                                                        <el-button btnnum="350" @click="relieveMawbConfig"
                                                            v-if="btnJurisdic(350)">解除总运单</el-button>
                                                        <span style="margin-left:60px" v-if="inputModelData.mawb&&inputModelData.system=='空出'">
                                                            航空公司：{{inputModelData.airCompanyName}}
                                                        </span>
                                                    </div>
                                                </div>
                                                <new-form-cmpt :view-data.sync="zdBasicInfoSave"
                                                    :model-data.sync="inputModelData" :pagetype="2" style="width:50%;display:inline-block"></new-form-cmpt>
                                                <div style="display:inline-block;margin-left:-92px;">
                                                    <span style="margin-right:20px"
                                                    v-if="inputModelData.gysname&&this.inputModelData.isshipace==1">运单供应商：{{inputModelData.gysname&&inputModelData.gysname.indexOf('-')!=-1?inputModelData.gysname.split('-')[1]:inputModelData.gysname}}</span>
                                                    <!-- ordertype!='3' -->
                                                <span
                                                    v-if="inputModelData.mawb&&inputModelData.mawbss&&this.inputModelData.isshipace==1">总运单所属：{{inputModelData.mawbss}}</span>
                                                </div>    
                                                
                                            </div>
                                        </div>

                                        <div class="detail" :class="{paneDisabled: inputModelData.area == '上海' && inputModelData.czlx == '自货'}">
                                            <div class="detail-title" >
                                                <!-- <p>签单&制单信息</p> -->
                                                <myServiceTitlePane code="OA0010" style="width:100%;display:flex"
                                                    :input-model-data="airModelData"
                                                    :monitor="airmonitor">
                                                </myServiceTitlePane>
                                            </div>
                                            <!-- (综合查询 ||  等于上海 || 不是主营 || 不是唯凯) => 禁用 -->
                                            <!-- 初使的 -->
                                            <!-- <div class="detail-c"
                                                style="padding: 0px; margin: -1px; overflow: hidden;"
                                                :class="{paneDisabled:allDisabled()||pagetype==14||area==conditionalAreaForBuild||!hasMaincamp||!projectIsWecan}"
                                                >  -->

                                                <div class="detail-c"
                                                style="padding: 0px; margin: -1px; overflow: hidden;"
                                                >

                                                    <airPlaneDeatil 
                                                        class="airPlaneDeatil" 
                                                        :boguid="boguid" 
                                                        :visible-i="false" 
                                                        ref="airPlaneDeatil" 
                                                        :mawb-data="inputModelData"
                                                        :shipace-info-data="shipaceInfoData"
                                                        @getAirInputModelData="val => airModelData = val"
                                                        @airmonitor="val => airmonitor = val"
                                                        v-if="activeName=='tab1-third'"
                                                        key="routeOperation"
                                                        />
                                                <!-- <el-form :inline="true" label-width="110px" class="zdPane"
                                                    style="padding-left:8px;">
                                                    <el-row>
                                                        <el-form-item label="预报件数：">
                                                            <span>{{getKeys('ybpiece')}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="预报重量：">
                                                            <span>{{Number(getKeys('ybweight')).toFixed(2)}}</span>
                                                        </el-form-item>

                                                        <el-form-item label="预报体积：">
                                                            <span>{{Number(getKeys('ybvolume')).toFixed(3)}}</span>
                                                        </el-form-item>
                                                        <el-form-item></el-form-item>
                                                    </el-row>

                                                    <el-row>
                                                        <el-form-item label="实际件数：">
                                                            <span>{{getKeys('realpiece')}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="实际重量：">
                                                            <span>{{Number(getKeys('realweight')).toFixed(2)}}</span>
                                                        </el-form-item>

                                                        <el-form-item label="实际体积：">
                                                            <span>{{Number(getKeys('realvolume')).toFixed(3)}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="实际计重：">
                                                            <span
                                                                style="margin-right:20px;display:inline-block;width:90px">{{iscomboineChildren?getIscomboineChildrenJz(1):inputModelData.sjComWeight}}</span>
                                                            <span style="color:#51A74E;"
                                                                v-if="JudgeBubblesFunc(1)>0">重货</span>
                                                            <span v-if="JudgeBubblesFunc(1)==0">平货</span>
                                                            <span style="color:#FF5850"
                                                                v-if="JudgeBubblesFunc(1)<0">泡货</span>
                                                        </el-form-item>
                                                    </el-row>

                                                    <el-row v-show="pagetype!=21">
                                                        <el-form-item label="制单件数：">
                                                            <span>{{getKeys('zdpiece')}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="制单重量：">
                                                            <span
                                                                v-if="iscomboineChildren">{{getKeys('zdweight')}}</span>
                                                            <el-input v-else v-model="inputModelData.zdweight"
                                                                v-verify="'fixedTwo'" style="width:120px"></el-input>
                                                        </el-form-item>

                                                        <el-form-item label="制单体积：">
                                                            <span
                                                                v-if="iscomboineChildren">{{getKeys('zdvolume')}}</span>
                                                            <el-input v-else v-model="inputModelData.zdvolume"
                                                                v-verify="'fixedThree'" style="width:120px"></el-input>
                                                        </el-form-item>
                                                        <el-form-item label="制单计重：">
                                                            <span
                                                                style="margin-right:20px;display:inline-block;width:90px">
                                                                <span
                                                                    v-if="iscomboineChildren">{{getIscomboineChildrenJz(2)}}</span>
                                                                <el-input v-else v-model="inputModelData.jfweight"
                                                                    v-verify="'fixedTwo'"></el-input>
                                                            </span>
                                                            <span style="color:#51A74E;"
                                                                v-if="JudgeBubblesFunc(2)>0">重货</span>
                                                            <span v-if="JudgeBubblesFunc(2)==0">平货</span>
                                                            <span style="color:#FF5850"
                                                                v-if="JudgeBubblesFunc(2)<0">泡货</span>
                                                        </el-form-item>
                                                    </el-row>
                                                </el-form> -->
                                            </div>
                                        </div>

                                        <div class="detail"
                                            :class="{paneDisabled:allDisabled('航线操作')||area==conditionalAreaForBuild}">
                                            <div class="detail-title">
                                                <p>舱位信息<span v-html="getTabsTooltip('已配舱')"
                                                        style="margin-right: auto"></span></p>
                                                <div style="display:flex">
                                                    <el-button 
                                                        btnnum="310" 
                                                        type="primary" 
                                                        @click="tuoshuDialog=true"
                                                        v-if="inputModelData.mawbss=='非我司运单'&&btnJurisdic(310)&&projectIsWecan">
                                                        唯凯托书
                                                    </el-button>
                                                    <el-button 
                                                        btnnum="320" 
                                                        class="finishBtn" 
                                                        v-if="btnJurisdic(320)"
                                                        :type="inputModelData.shipaceInfo.guid!=-1?'danger':'primary'"
                                                        @click="flightAssFunc">
                                                        {{inputModelData.shipaceInfo.guid!=-1?'取消配舱':'配舱完成'}}
                                                    </el-button>
                                                </div>
                                            </div>
                                            <div class="detail-c peicDetail" style="position:relative;"
                                                :class="{disabled:inputModelData.shipaceInfo.guid!=-1}">
                                                <newFormCmpt :view-data.sync="shipaceInfoView"
                                                    :model-data.sync="shipaceInfoData" :pagetype="2">
                                                    <!-- <template slot="hbh">
                          <el-input
                            v-model.trim="shipaceInfoData.hbh"
                            style="width:174px;"
                            clearable
                            @blur="getQfsj(2)"
                            v-verify="'uppercase'"
                          ></el-input>
                        </template>
                        <template slot="hbrq">
                          <el-date-picker
                            v-model="shipaceInfoData.hbrq"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            style="width:174px;"
                            @blur="getQfsj(2)"
                          ></el-date-picker>
                        </template> -->

                                                    <template slot="qfsj">
                                                        <div
                                                            v-if="(inputModelData.opersystem=='出口'&&inputModelData.opersystemdom=='空运')">
                                                            <span
                                                                style="display:inline-block;width:125px">{{shipaceInfoData.qfsj
                                                                | formatDate('hh:mm') }}</span>
                                                            <i title="航班维护" class="el-icon-edit-outline"
                                                                @click="qfsjDialogFunc(2)"
                                                                style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;top:4px;"></i>
                                                            <i title="刷新" class="el-icon-refresh" @click="getQfsj(2)"
                                                                style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:6px;position:relative;top:4px;"></i>
                                                        </div>
                                                        <div v-else>
                                                            <el-time-picker v-model="shipaceInfoData.qfsj"
                                                                :picker-options="{
                                                selectableRange: '00:00:00 - 23:59:59'
                              }" value-format="yyyy-MM-dd HH:mm" format="HH:mm" style="width:120px"></el-time-picker>
                                                        </div>
                                                    </template>

                                                    <template slot="terminalname">
                                                        <el-select v-model="shipaceInfoData.terminalname"
                                                            style="width:120px" ref="terminalnameid">
                                                            <el-option v-for="(item,index) in jjdArr" :key="index"
                                                                :label="item.label" :value="item.value"></el-option>
                                                        </el-select>
                                                        <jjdwh @success="getJjdFunc" :sfg="inputModelData.sfg"
                                                            :area="area"></jjdwh>
                                                    </template>
                                                </newFormCmpt>

                                                <el-button btnnum="330" @click="dialogFlightAss=true"
                                                    style="position:relative;left: 600px;top: 0px;"
                                                    v-show="inputModelData.mawb">舱位查询</el-button>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div style="position:relative;margin-top:20px"
                                        v-if="inputModelData.czlx!='代操作'&&pagetype!=2&&!iscomboineChildren&&(ordertype==2?inputModelData.isshipace==1:true)&&!(inputModelData.isshipace==2&&ordertype==4)">
                                        <!-- <div
                                            style="position:absolute;z-index:1000;display:inline-flex;height:40px;align-items:center;left:250px;width:400px;justify-content:space-between">
                                            <span style="color:#FF0000">应付：{{kongchuCost.yingfu}} 元</span>
                                            <span style="color:#00CC00">应收：{{kongchuCost.yingshou}} 元</span>
                                            <span style="color:#FFA500">盈利：{{kongchuCost.profit}} 元</span>
                                        </div> -->
<!--                                      
                                        <el-tabs type="border-card">
                                            <el-tab-pane label="应付运价" v-if="pagetype!=21"
                                                :class="{paneDisabled:allDisabled()||area==conditionalAreaForBuild||pagetype==14||(ordertype!=2&&inputModelData.isshipace==2)}">
                                                <span slot="label" style="color:#FF0000" class="badgeLabel">应付运价</span>
                                                <div class="detail">
                                                    <div class="detail-title">
                                                        <p>应付运费信息</p>
                                                    </div>
                                                    <div class="detail-c">
                                                        <newFormCmpt :view-data.sync="yingfuViewData"
                                                            :model-data.sync="inputModelData" :pagetype="2">
                                                        </newFormCmpt>
                                                    </div>
                                                </div>
                                                <costTable wagedom="航线" :wageinout="2"
                                                    :orderpgid="getServiceGuid('OA0010','orderpgid')"
                                                    :childpgid="getServiceGuid('OA0010','childpgid')"
                                                    :serviceguid="getServiceGuid('OA0010')" :costdata="costdata"
                                                    :mawbinfo="inputModelData" @success="getMawbCost"
                                                    :incidentalWage="incidentalWageOut" ref="incidentalRefOut">
                                                </costTable>
                                            </el-tab-pane> -->
                                            <!-- <el-tab-pane label="应收运价"  :class="{paneDisabled:allDisabled()&&!(inputModelData.dzstatus>200&&area==conditionalAreaForBuild)}"> -->
                                            <!-- <el-tab-pane label="应收运价" v-if="inputModelData.iscomboine!=1"
                                                :class="{paneDisabled:allDisabled()||area==conditionalAreaForBuild||pagetype==14||(ordertype!=1&&ordertype!=3)}">
                                                <span slot="label" style="color:#00CC00" class="badgeLabel">应收运价</span>

                                                <div class="detail" id="farePane">
                                                    <div class="detail-title">
                                                        <p>应收运费信息</p>
                                                    </div>
                                                    <div class="detail-c">
                                                        <newFormCmpt :view-data.sync="fareInputViewData"
                                                            :model-data.sync="inputModelData" :pagetype="2"
                                                            class="farePane"
                                                            @inwageallinpriceFunc="inwageallinpriceFunc">
                                                        </newFormCmpt>
                                                    </div>
                                                </div>
                                                <costTable wagedom="航线" :wageinout="1"
                                                    :orderpgid="getServiceGuid('OA0010','orderpgid')"
                                                    :childpgid="getServiceGuid('OA0010','childpgid')"
                                                    :serviceguid="getServiceGuid('OA0010')"
                                                    :class="{disabled:ordertype==2&&getServiceGuid('OA0010','profitmode')=='利润分配模式'}"
                                                    :costdata="costdata" :incidentalWage="incidentalWageIn"
                                                    ref="incidentalRefIn" :mawbinfo="inputModelData"
                                                    @success="getMawbCost"></costTable>
                                            </el-tab-pane>
                                        </el-tabs> -->
                                    </div>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane :label="getTitle('配货操作')" v-if="showCgportTab('tab1-second')"
                                :class="{paneDisabled:allDisabled()&&pagetype!=2}" name="tab1-second">
                                <myTabBadge :color="setTabBadgeType('tab1-second')" :label="getTitle('配货操作')"
                                    v-show="showServiceTab('tab1-second')" slot="label"  tabcode="tab1-second"  ></myTabBadge>
                                <div class="detail peihuodetail"
                                    :class="{paneDisabled:(ordertype==2&&!getServiceGuid('OA0010','profitmode'))}">
                                    <div class="detail-title"
                                        :class="{paneDisabled:(inputModelData.area==conditionalAreaForBuild&&inputModelData.dzstatus>200)}">
                                        <p>
                                            进仓编号操作(实际货物件重体)
                                            <span v-html="getTabsTooltip('已配货')" style="margin-right: auto"></span>
                                            <!-- <el-button
                        btnnum="270"
                        class="finishBtn"
                        type="primary"
                        v-if="btnJurisdic(270)"
                        @click="cancelOrderFunc(2)"
                      >配货完成</el-button> -->
                                            

                                            <template>
                                                <el-button 
                                                    btnnum="270" 
                                                    class="finishBtn" 
                                                    type="primary"
                                                    v-if="btnJurisdic(270)" 
                                                    @click="cancelOrderFunc(2)">
                                                    配货完成
                                                </el-button>

                                                <el-button 
                                                    btnnum="280" 
                                                    class="finishBtn" 
                                                    type="danger"
                                                    v-if="btnJurisdic(280)" 
                                                    @click="cancelOrderFunc(3)">
                                                    取消配货
                                                </el-button>
                                            </template>
                                        </p>
                                    </div>
                                    <el-collapse-transition>
                                        <div>
                                            <div class="detail-c" :class="{paneDisabled:phFinish}">
                                                <!-- <enterWarehouseNumberPut
                                                :saveNumberList.sync="saveNumberList"
                                                :guid="mawbguid"
                                                :statusArr="statusArr"
                                                ></enterWarehouseNumberPut>-->
                                                <peihuo :saveNumberList.sync="saveNumberList"
                                                    :allkhjcnoData.sync="allkhjcnoData" :hawblist="hawbTableData"
                                                    :serviceguid="getServiceGuid('AA0610')" :phfinished="phFinish"
                                                    :mawbinfo="inputModelData" :guid="mawbguid"
                                                    :oldhpoid="iscomboineChildren?inputModelData.guid:''"
                                                    :boguid="boguid" ref="peihuo" :statusArr="statusArr"
                                                    :ifSellSite="ordertype==3" @success="getMawbdetail"
                                                    @getHawbNum="getHawbNum">
                                                </peihuo>
                                            </div>
                                        </div>
                                    </el-collapse-transition>
                                </div>

                                <div class="detail" v-if="inputModelData.orderdom=='总单'" v-enterfocus
                                    :class="{paneDisabled:bgFinish.finish}" style="display:none">
                                    <div class="detail-title">
                                        <p>分单配置进仓编号操作</p>
                                    </div>

                                    <div class="detail-c fdpzPanel">
                                        <el-form ref="form" label-width="110px" :inline="true">
                                            <el-form-item label="分运单号：">
                                                <el-select v-model="hawbForm.hawb" filterable allow-create
                                                    default-first-option @blur="hawbBlur" @change="hawbChange">
                                                    <el-option v-for="item in hawbArr" :key="item.id"
                                                        :label="item.label" :value="item.value"></el-option>
                                                </el-select>
                                            </el-form-item>

                                            <el-form-item label="目的港：">
                                                <el-input v-model="hawbForm.mdg" v-verify="'sfgmdg'"></el-input>
                                            </el-form-item>

                                            <el-form-item label="进仓编号：">
                                                <el-select placeholder="请选择" multiple v-model="hawbForm.khjcno"
                                                    @change="hawbSelFunc" size="mini">
                                                    <li>
                                                        <span style="float: left;margin-left:20px;">进仓编号</span>
                                                        <span style="float: right;margin-right:30px;">
                                                            <i class="imul">件</i>/
                                                            <i class="imul">重</i>/
                                                            <i class="imul">体</i>
                                                        </span>
                                                    </li>
                                                    <el-option v-for="(item,i) in saveNumberList" :key="i"
                                                        :label="item.khjcno" :value="item.khjcno" style="width:300px;"
                                                        v-if="!selOptionShow(item)">
                                                        <span style="float: left">{{ item.khjcno }}</span>
                                                        <span style="float: right;margin-right:10px;">
                                                            <i class="imul">{{ item.piece }}</i>/
                                                            <i class="imul">{{ item.weight }}</i>/
                                                            <i class="imul">{{ item.volume }}</i>
                                                        </span>
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>

                                            <br />
                                            <el-form-item label="预报件数：">
                                                <el-input v-model="hawbForm.ybpiece"></el-input>
                                            </el-form-item>

                                            <el-form-item label="预报重量：">
                                                <span>
                                                    <el-input v-model="hawbForm.ybweight"></el-input>
                                                </span>
                                            </el-form-item>
                                            <el-form-item label="预报体积：">
                                                <span>
                                                    <el-input v-model="hawbForm.ybvolume"></el-input>
                                                </span>
                                            </el-form-item>

                                            <br />

                                            <el-form-item label="实际件数：">
                                                <span>{{hawbForm.realpiece}}</span>
                                            </el-form-item>

                                            <el-form-item label="实际重量：">
                                                <span>{{hawbForm.realweight}}</span>
                                            </el-form-item>
                                            <el-form-item label="实际体积：">
                                                <span>{{hawbForm.realvolume}}</span>
                                            </el-form-item>
                                        </el-form>

                                        <div style="margin-right:40px;">
                                            <el-button btnnum="290" type="primary" size="mini" @click="saveHawbForm">
                                                保存配置</el-button>
                                            <el-button btnnum="300" type="primary" size="mini" @click="resetHawbForm">
                                                取消编辑</el-button>
                                        </div>
                                        <div style="width:905px;margin-top:20px;">
                                            <commonTable :head="hawbTableHead" :table-data="hawbTableData">
                                                <template slot="operate" slot-scope="props">
                                                    <i class="el-icon-setting"
                                                        @click="setHawbForm(props.data.index)"></i>
                                                    <i class="el-icon-delete"
                                                        @click="delHawbForm(props.data.index)"></i>
                                                </template>
                                            </commonTable>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>

 

                            <el-tab-pane name="tab1-tenth"
                                v-if="showCgportTab('tab1-tenth')" :class="{'paneDisabled': inputModelData.area !== '上海' || inputModelData.czlx == '代操作'}">
                                <!-- note: 无论是外站还是上海代操作,签单申请页面禁用 -->
                                <myTabBadge :color="setTabBadgeType('tab1-tenth')"
                                    v-show="showServiceTab('tab1-tenth')" :label="getTitle('签单申请')" slot="label"  tabcode="tab1-tenth" ></myTabBadge>
                                <div class="detail">
                                    <div class="detail-title">
                                        <p>签单申请操作<span v-html="getTabsTooltip('签单申请')"
                                                style="margin-right: auto"></span></p>
                                        <div style="text-align:right;">
                                            <!-- <el-button type="primary" @click="signApplicationSure">确定</el-button>
                             <el-button @click="signApplicationDialog=false;signApplicationDialogClose()">取消</el-button> -->
                                            <el-button btnnum="101" type="primary" @click="signApplicationSure"
                                                v-if="btnJurisdic(101)">签单申请完成</el-button>
                                            <el-button btnnum="102" type="danger" @click="signBillFunc"
                                                v-if="btnJurisdic(102)">取消签单申请</el-button>
                                        </div>
                                    </div>
                                    <div class="detail-c"
                                        v-if="ifSecond.includes('tab1-tenth')&&ifThird.includes('tab1-tenth')"
                                        style="padding:20px">
                                        <h3 style="margin-bottom: 15px;">请确认制单代理代码</h3>
                                        <newFormCmpt :view-data.sync="zdBasicInfo" :model-data.sync="inputModelData"
                                            :pagetype="2">
                                        </newFormCmpt>
                                        <h3 style="margin-top: 25px;">请确认客户确认尺寸</h3>
                                        <commonTable style="margin:20px 0" class="hawb-table" :head="khqrTableHead"
                                            :tableData="signApplicationTableData" :showAllZiTable="true">
                                            <template slot="ziTable" slot-scope="props">
                                                <commonTable :head="khqrZiTableHead"
                                                    :table-data="props.data.row.vollist"
                                                    v-if="props.data.row.vollist.length>0"
                                                    :style="{height:(props.data.row.vollist.length+1)*32+'px'}"
                                                    class="peihuoZiTable">
                                                </commonTable>
                                            </template>
                                        </commonTable>

                                        <div class="signApplicationInfo">
                                            <h3 style="margin:20px 0;">汇总信息</h3>
                                            <p style="font-weight:600">
                                                <span>提交至签单的件/重/体</span><span>{{computeSignApplijzt(4)}}</span></p>
                                            <p style="grid-template-columns:60px repeat(4,140px);"><span
                                                    style="text-align:right;margin-right:6px">其中：</span><span>实际入库件/重/体</span><span>{{computeSignApplijzt(2)}}</span><span>客户确认件/重/体</span><span>{{computeSignApplijzt(3)}}</span>
                                            </p>
                                        </div>


                                    </div>
                                </div>

                            </el-tab-pane>


                            <!-- 总分单号确认/总分单确认状态 1，未确认 100，总分单号确认 ，200 总分单确认 -->
                            <el-tab-pane name="tab1-fifth"
                                v-if="showCgportTab('tab1-fifth')">
                                <myTabBadge :color="setTabBadgeType('tab1-fifth')"
                                    :label="getTitle('单号确认')" slot="label" tabcode="tab1-fifth" v-show="showServiceTab('tab1-fifth')">
                                </myTabBadge>

                                <!--                             <span slot="label" class="badgeLabel" v-show="firstLevelIndex==0&&zhuYinIsdel">
                            单号确认
                            <p style="width:100%;text-align:center;">({{getTitle()}})</p>
                            </span> -->

                                <div v-if="ifSecond.includes('tab1-fifth')&&ifThird.includes('tab1-fifth')">
                                    <confirmDetail :mawbdetail="inputModelData" pagetype="1" dom="1"
                                        :showBasicInfo="false" :oldhpoid="iscomboineChildren?inputModelData.guid:''"
                                        :hpoid="mawbguid" ref="danhaoConfirm" @success="confirmDetailSucs"
                                        @confirmHawbRefresh="confirmHawbRefresh"
                                         :is-order-confirm="isOrderConfirm"
                                         :active-name="activeName"
                                        >
                                        <span v-html="getTabsTooltip('总单号确认')"></span>
                                    </confirmDetail>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane name="tab1-sixth" v-if="showCgportTab('tab1-sixth')">
                                <!-- <span slot="label" class="badgeLabel"
                                    :class="setTabBadgeType('tab1-sixth')"
                                    v-show="showServiceTab('tab1-sixth')">{{getTitle('单证确认').split(',')[0]}}<p
                                        style="width:100%;font-size:12px;text-align:center">
                                        ({{getTitle('单证确认').split(',')[1]}})</p></span> -->

                                   <myTabBadge :color="setTabBadgeType('tab1-sixth')"
                                    :label="getTitle('单证确认')" slot="label" tabcode="tab1-sixth" v-show="showServiceTab('tab1-sixth')">
                                </myTabBadge>


                                <div v-if="ifSecond.includes('tab1-sixth')&&ifThird.includes('tab1-sixth')">
                                    <confirmDetail :mawbdetail="inputModelData" ref="danzhengConfirm" pagetype="1"
                                        dom="2" :showBasicInfo="false"
                                        :oldhpoid="iscomboineChildren?inputModelData.guid:''" :hpoid="mawbguid"
                                        @success="confirmDetailSucs" @confirmHawbRefresh="confirmHawbRefresh"
                                         :is-order-confirm="isOrderConfirm"
                                        >
                                        <span v-html="getTabsTooltip('总运单确认')"></span>
                                    </confirmDetail>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane label="分单信息"
                                v-if="showCgportTab('tab1-forth')"
                                name="tab1-forth">
                                <span slot="label" class="badgeLabel" v-show="showServiceTab('tab1-forth')"
                                    style="line-height:44px;padding:0px 20px">分单信息</span>
                                <div :class="{paneDisabled:(allDisabled()&&inputModelData.dzstatus!=200)||(pagetype!=12?(pagetype==3&&area==conditionalAreaForBuild&&inputModelData.islocal==1)||(ordertype==2&&!getServiceGuid('OA0010','profitmode')):false),'bgFinishDis':bgFinish.finish}"
                                    v-if="ifSecond.includes('tab1-forth')&&ifThird.includes('tab1-forth')&&activeName=='tab1-forth'">
                                    <hawbTabsOper ref="hawbtab" :pagetype="1" @success="getHawbNum()"
                                        :mawbdetail="inputModelData" :saveNumberList="saveNumberList"
                                        :hawbTableData="hawbTableData" :pageFrom="pageFrom"></hawbTabsOper>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane label="分配信息" v-if="showCgportTab('tab1-seventh')" name="tab1-seventh">
                                <span slot="label" class="badgeLabel" v-show="showServiceTab('tab1-seventh')">分配信息</span>

                                <fenpeiTable :fenpeidata.sync="assignXsDataSfg" @success="newFenpeiD"
                                    :fenpeiIndex.sync="fenpeiIndex" v-if="ifThird.includes('tab1-seventh')">
                                </fenpeiTable>
                            </el-tab-pane>


                            <el-tab-pane label="Amazon信息" name="tab1-eighth"
                                v-if="showCgportTab('tab1-eighth')">
                                <span slot="label" class="badgeLabel" v-show="showServiceTab('tab1-eighth')">Amazon信息</span>
                                <div v-if="ifThird.includes('tab1-eighth')">
                                    <hawbTabs :mawbguid="inputModelData.guid" :showAddHawbBtn="false"
                                        @togglehawbN="togglehawbN" v-if="childrenList.length&&inputModelData.groupid>0"
                                        :hawbListCost="childrenList" :boguid="childrenList[0].boguid">
                                        <amazon :inputModelData="childData" v-if="childData.outsidedom=='AMAZON'">
                                        </amazon>

                                        <iframe :src="amazonUrl" frameborder="0" allowtransparency="true"
                                            style="width: 100%; height:895px; border: 0px none;" class="iframeScroll"
                                            v-if="childData.outsidedom=='GTN'"></iframe>
                                    </hawbTabs>

                                    <div v-if="inputModelData.groupid<0">
                                        <amazon :inputModelData="inputModelData"
                                            v-if="inputModelData.outsidedom=='AMAZON'"></amazon>

                                        <iframe :src="amazonUrl" frameborder="0" allowtransparency="true"
                                            style="width: 100%; height:895px; border: 0px none;" class="iframeScroll"
                                            v-if="inputModelData.outsidedom=='GTN'"></iframe>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </template>
                        <!-- </el-tabs>
        </div>

        <div v-show="firstLevelIndex!=0" v-if="ifFirst.includes(firstLevelIndex)" class="servicePort">
          <el-tabs type="border-card" @tab-click="tabclick($event,2)" v-model="activeNameSfg"> -->
                        <el-tab-pane :label="newService.AA0410.title" name="AA0410" v-if="newService.AA0410">
                            <myTabBadge :color="setTabBadgeType('AA0410')" :label="newService.AA0410.title" slot="label"
                                v-show="serviceSelArr.includes('AA0410')&&showServiceTab('AA0410')"  tabcode="AA0410" ></myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0410')||servicesDisabled('AA0410')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0410"></myServiceTitlePane>
                                        <div
                                            :class="{paneDisabled:(ordertype==3&&getServiceGuid('AA0410','profitmode'))}">
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" :boguid="boguid"
                                                btnnum="362" v-if="pagetype!=3&&btnJurisdic(362,'AA0410')"
                                                servicecode="AA0410" :serviceguid="getServiceGuid('AA0410')"
                                                :itemsname="serviceInfo.AA0410.itemsname"
                                                :wagedom="serviceInfo.AA0410.wagedom"
                                                :url="!ckFinish.finish?'api/ExAxplineStoreFinish':'api/ExAxplineStoreUnFinish'"
                                                :jsxm-data="ckJsxmData" @edit-node-success="edit_node_success"
                                                :serviceNodeData="serviceNodeData" :isFinished="ckFinish.finish">
                                            </baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:ckFinish.finish}">
                                    <storeServiceInfo :saveNumberList="saveNumberList"
                                        :serviceguid="getServiceGuid('AA0410')" servicecode="AA0410"
                                        :area="inputModelData.area" :mawbguid="mawbguid" @getJsxmData="getJsxmData"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0410')"></storeServiceInfo>

                                    <div v-if="ifOperSysHome&&ifThird.includes('AA0410')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AA0410ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList"
                                            :piece="inputModelData.piece" @success="saveMawbInfo(4)"></storeCompSize>
                                    </div>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0410')">
                                <myServiceCostTable code="AA0410"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0145.title" name="AG0145" v-if="newService.AG0145">
                            <myTabBadge :color="setTabBadgeType('AG0145')" :label="newService.AG0145.title"  tabcode="AG0145"  slot="label"
                                v-show="serviceSelArr.includes('AG0145')&&showServiceTab('AG0145')"></myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0145')||servicesDisabled('AG0145')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0145"></myServiceTitlePane>
                                        <div
                                            :class="{paneDisabled:(ordertype==3&&getServiceGuid('AG0145','profitmode'))}">
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" :boguid="boguid"
                                                btnnum="362" v-if="pagetype!=3&&btnJurisdic(362,'AG0145')"
                                                servicecode="AG0145" :serviceguid="getServiceGuid('AG0145')"
                                                :itemsname="serviceInfo.AG0145.itemsname"
                                                :wagedom="serviceInfo.AG0145.wagedom"
                                                :url="!ckFinish.finish?'api/ExAxplineStoreFinish':'api/ExAxplineStoreUnFinish'"
                                                :jsxm-data="ckJsxmData" @edit-node-success="edit_node_success"
                                                :serviceNodeData="serviceNodeData" :isFinished="ckFinish.finish">
                                            </baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:ckFinish.finish}">
                                    <storeServiceInfo :saveNumberList="saveNumberList"
                                        :serviceguid="getServiceGuid('AG0145')" servicecode="AG0145"
                                        :area="inputModelData.area" :mawbguid="mawbguid" @getJsxmData="getJsxmData"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0145')"></storeServiceInfo>

                                    <div v-if="ifOperSysHome&&ifThird.includes('AG0145')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AG0145ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList"
                                            :piece="inputModelData.piece" @success="saveMawbInfo(4)"></storeCompSize>
                                    </div>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0145')">
                                <myServiceCostTable code="AG0145"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0510.title" name="AA0510" v-if="newService.AA0510">
                            <myTabBadge :color="setTabBadgeType('AA0510')" :label="newService.AA0510.title" tabcode="AA0510"  slot="label"
                                v-show="serviceSelArr.includes('AA0510')&&showServiceTab('AA0510')"></myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0510') || servicesDisabled('AA0510')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0510"></myServiceTitlePane>
                                        <div
                                            :class="{paneDisabled:(ordertype==3&&getServiceGuid('AA0510','profitmode'))}">
                                            <myBindBetton code="AA0510"></myBindBetton>
                                            <el-button btnnum="370" v-show="!ifOperSysHome" type="primary"
                                                @click="peicheBill(1)" v-hide="this.area==conditionalAreaForBuild">派车单
                                            </el-button>
                                            <el-button btnnum="371"
                                                v-show="this.area==conditionalAreaForBuild&&(getServiceGuid('AA0510','assignstatus')==0||getServiceGuid('AA0510','assignstatus')==5)&&!this.orderFinish&&ifOperSysHome&&inputModelData.status!=1&&projectIsWecan"
                                                type="primary" @click="thOperDialog=true">派车操作</el-button>
                                            <el-button btnnum="372"
                                                v-show="this.area==conditionalAreaForBuild&&getServiceGuid('AA0510','assignstatus')==2&&!this.orderFinish"
                                                type="primary" @click="thOperFunc(2)">取消派车</el-button>
                                            <el-button type="primary" @click="taskDelivery('AA0510')"
                                                v-if="getServiceGuid('AA0510','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" btnnum="361"
                                                v-if="pagetype!=3&&btnJurisdic(361,'AA0510')" :boguid="boguid"
                                                :serviceguid="getServiceGuid('AA0510')" servicecode="AA0510"
                                                :bindeguid="getServiceGuid('AA0510','bindeguid')"
                                                :itemsname="serviceInfo.AA0510.itemsname"
                                                :wagedom="serviceInfo.AA0510.wagedom"
                                                :url="!thFinish.finish?'api/ExAxplineStoreTransportFinish':'api/ExAxplineStoreTransportUnFinish'"
                                                :jsxm-data="thJsxmData" @edit-node-success="edit_node_success"
                                                :serviceNodeData="serviceNodeData" :isFinished="thFinish.finish"
                                                :mawbinfo="inputModelData"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:thFinish.finish}">
                                    <takeDeliveryGoods :saveNumberList="saveNumberList"
                                        :serviceguid="getServiceGuid('AA0510')" servicecode="AA0510"
                                        :mawbguid="mawbguid" :mawbinfo="inputModelData"
                                        :hasData.sync="ysSmallService.AA0510" :boguid="boguid"
                                        @getJsxmData="getJsxmData" @edit-node-success="edit_node_success"
                                        @success="getServiceNodeData" ref="AA0510" :ordertype="ordertype"
                                        :orderFinish="orderFinish" v-if="!ifOperSysHome&&ifThird.includes('AA0510')">
                                    </takeDeliveryGoods>

                                    <div v-if="ifOperSysHome&&ifThird.includes('AA0510')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AA0510ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <takeGoodsAdd :inputModelData="inputModelData" ref="takeGoodsAddRef"
                                            id="ybTransstoreList" @success="saveMawbInfo(4)"></takeGoodsAdd>
                                    </div>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0510')">
                                <myServiceCostTable code="AA0510"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <!-- note: 配单操作 -->
                        <!-- 空出报关 -->
                        <el-tab-pane :label="newService.AA0610.title" v-if="newService.AA0610" name="AA0610">
                            <myTabBadge :color="setTabBadgeType('AA0610')" :label="newService.AA0610.title" tabcode="AA0610" 
                                v-show="serviceSelArr.includes('AA0610')&&showServiceTab('AA0610')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0610')||servicesDisabled('AA0610')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0610"></myServiceTitlePane>
                                        <div
                                            :class="{paneDisabled:ordertype==3&&getServiceGuid('AA0610','profitmode')}">
                                            <baoguanNodeBtn btnnum="359" v-if="pagetype!=3&&btnJurisdic(359,'AA0610')"
                                                :area="area" :mawbguid="mawbguid" :boguid="boguid" servicecode="AA0610"
                                                :serviceguid="getServiceGuid('AA0610')"
                                                :orderpgid="getServiceGuid('AA0610','orderpgid')"
                                                :childpgid="getServiceGuid('AA0610','childpgid')"
                                                :itemsname="serviceInfo.AA0610.itemsname"
                                                :wagedom="serviceInfo.AA0610.wagedom"
                                                :url="!bgFinish.finish?'api/ExAxplineDeclFinish':'api/ExAxplineDeclUnFinish'"
                                                :jsxm-data="bgJsxmData" :serviceNodeData="serviceNodeData"
                                                @edit-node-success="edit_node_success(1)" :isFinished="bgFinish.finish">
                                            </baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:(pagetype==3&&!ifOperSysHome)}"
                                    v-if="activeName=='AA0610'">
                                    <!-- 空出报关信息内容 -->
                                    <declareAtcustoms ref="bgCmpt" :mawbguid="mawbguid" :hawblist="hawbTableData"
                                        :serviceguid="getServiceGuid('AA0610')" servicecode="AA0610"
                                        :jiediandata="jiediandata" :mawbinfo="inputModelData" @getJsxmData="getJsxmData"
                                        @edit-node-success="edit_node_success(1)"
                                        :orderpgid="getServiceGuid('AA0610','orderpgid')"
                                        :childpgid="getServiceGuid('AA0610','childpgid')"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0610')">
                                        <peihuo :saveNumberList.sync="saveNumberList" :hawblist="hawbTableData"
                                            :serviceguid="getServiceGuid('AA0610')" :phfinished="phFinish"
                                            :mawbinfo="inputModelData" :guid="mawbguid" :boguid="boguid"
                                            :statusArr="statusArr" :sjGoodsTableData="sjTableData"
                                            :ifSellSite="ordertype==3" @success="getMawbdetail" @getHawbNum="getHawbNum"
                                            mark="peidan"
                                            :pdfinishstatus="inputModelData.pdfinishstatus=='1'?false:true"
                                            :khjcnoListArray="allkhjcnoData">
                                        </peihuo>
                                    </declareAtcustoms>
                                    <div v-if="ifOperSysHome&&ifThird.includes('AA0610')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AA0610ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"
                                            @success="saveMawbInfo(4)"></declareAtcustomsAdd>
                                        <div style="display:flex;justify-content: flex-end;margin-bottom:15px">
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" :node-list="jiediandata"
                                                :boguid="boguid" :jsxm-data="jsxmData(1)"
                                                :orderpgid="getServiceGuid('AA0610','orderpgid')"
                                                :childpgid="getServiceGuid('AA0610','childpgid')"
                                                @edit-node-success="edit_node_success(1)"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0610')">
                                <myServiceCostTable code="AA0610"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <!-- 海关联系单 -->
                        <el-tab-pane :label="newService.AA0160.title" v-if="newService.AA0160" name="AA0160">
                            <confirmDetail :mawbdetail="inputModelData"  :customstatus="inputModelData.customstatus"
                            pagetype="2"
                            :disabledStatus="true"
                            v-if="activeName == 'AA0160'"
                        ></confirmDetail>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0150.title" v-if="newService.AG0150" name="AG0150">
                            <myTabBadge :color="setTabBadgeType('AG0150')" :label="newService.AG0150.title" tabcode="AG0150" 
                                v-show="serviceSelArr.includes('AG0150')&&showServiceTab('AG0150')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0150')||servicesDisabled('AG0150')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0150"></myServiceTitlePane>
                                        <div
                                            :class="{paneDisabled:ordertype==3&&getServiceGuid('AG0150','profitmode')}">
                                            <baoguanNodeBtn btnnum="359" v-if="pagetype!=3&&btnJurisdic(359,'AG0150')"
                                                :area="area" :mawbguid="mawbguid" :boguid="boguid" servicecode="AG0150"
                                                :serviceguid="getServiceGuid('AG0150')"
                                                :orderpgid="getServiceGuid('AG0150','orderpgid')"
                                                :childpgid="getServiceGuid('AG0150','childpgid')"
                                                :itemsname="serviceInfo.AG0150.itemsname"
                                                :wagedom="serviceInfo.AG0150.wagedom"
                                                :url="!bgFinish.finish?'api/ExAxplineDeclFinish':'api/ExAxplineDeclUnFinish'"
                                                :jsxm-data="bgJsxmData" :serviceNodeData="serviceNodeData"
                                                @edit-node-success="edit_node_success(1)" :isFinished="bgFinish.finish">
                                            </baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:(pagetype==3&&!ifOperSysHome)}">
                                    <declareAtcustoms ref="bgCmpt" :mawbguid="mawbguid" :hawblist="hawbTableData"
                                        :serviceguid="getServiceGuid('AG0150')" servicecode="AG0150"
                                        :jiediandata="jiediandata" :mawbinfo="inputModelData" @getJsxmData="getJsxmData"
                                        @edit-node-success="edit_node_success(1)"
                                        :orderpgid="getServiceGuid('AG0150','orderpgid')"
                                        :childpgid="getServiceGuid('AG0150','childpgid')"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0150')"></declareAtcustoms>

                                    <div v-if="ifOperSysHome&&ifThird.includes('AG0150')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AG0150ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"
                                            @success="saveMawbInfo(4)"></declareAtcustomsAdd>
                                        <div style="display:flex;justify-content: flex-end;margin-bottom:15px">
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" :node-list="jiediandata"
                                                :boguid="boguid" :jsxm-data="jsxmData(1,'AG0150')"
                                                :orderpgid="getServiceGuid('AG0150','orderpgid')"
                                                :childpgid="getServiceGuid('AG0150','childpgid')"
                                                @edit-node-success="edit_node_success(1)"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0150')">
                                <myServiceCostTable code="AG0150"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                      <!-- 单证制作，原总单 分单制作合并到一个tab中 -->
                        <el-tab-pane label="单证制作" v-if="(newService.AA0110||newService.AA0120)&&ifThird.includes('tab1-dzmake')" name="tab1-dzmake">
                           
                             <commonTabs :list="dzmaketabs" @close="removehawb" titlefield="title" :checkedIndex.sync="dzmaketabindex" v-if="dzmaketabs.length"
                             >
                                <!-- 总单制作 -->
                                <div v-show="dzmaketabs[dzmaketabindex]&&dzmaketabs[dzmaketabindex].title=='总单制作'" v-if="serviceSelArr.includes('AA0110')">
                                        <!-- -->
                                        <div class="detail" :class="{paneDisabled:(allDisabled('AA0110')||servicesDisabled('AA0110'))&&!isPaper}">
                                            <div class="detail-title">
                                                <div class="finishInfo">
                                                    <myServiceTitlePane code="AA0110" ref="myServiceTitlePaneAA0110" isdeep></myServiceTitlePane>
                                                    <div :class="{paneDisabled:getServiceGuid('AA0110','childpgid')>0}">
                                                        <myServiceFinishBtn btnnum="380" isdeep v-if="btnJurisdic(380,'AA0110')" code="AA0110"></myServiceFinishBtn>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="detail-c">
                                                <myAlert servicecode="AA0110" v-if="(ifThird.includes('tab1-dzmake')||serviceSelArr[ifOperSysHome?0:1]=='AA0110')">
                                                </myAlert>
                                                <makingBill :mawbguid="mawbguid" 
                                                    :class="{makingBillPage:iscomboineChildren}" 
                                                    style="border:1px solid #e8e8e8"
                                                    ref="makingbill" servicecode="AA0110"
                                                    v-if="(ifThird.includes('tab1-dzmake')||serviceSelArr[ifOperSysHome?0:1]=='AA0110')" orderdom="总单"
                                                    :pagetype="ifOperSysHome?2:1" 
                                                    :mawbinfo="inputModelData"
                                                    :bottomFixed="isPaper"
                                                    :needLimit="isPaper?billNeed:true"
                                                    :afreshRateCharge="afreshRateCharge"
                                                    :isPaper="isPaper"
                                                    @success="handleInfoSuccess"
                                                    :is-order-confirm="isOrderConfirm"
                                                    :is-confirm="setTabBadgeType('AA0110')=='badgeRed'"
                                                    :active-name="activeName"
                                                    :allkhjcnoData="allkhjcnoData"
                                                    :isShowVolume="true"
                                                    >
                                                </makingBill>
                                            </div>
                                        </div>
                                        
                                        <div v-if="ifThird.includes('tab1-dzmake')" >
                                            <myServiceCostTable code="AA0110" isdeep></myServiceCostTable>
                                        </div>
                                </div>

                                <!-- Manifest制作 -->
                                <div v-show="dzmaketabs[dzmaketabindex]&&dzmaketabs[dzmaketabindex].title=='Manifest制作'" 
                                v-if="serviceSelArr.includes('AA0110')||serviceSelArr.includes('AA0120')">
                                   <div style="padding: 5px;text-align: right;">
                                    <el-button type="success" @click="$refs.myServiceTitlePaneAA0110.uploadFunc(true)">文档上传</el-button>
                                  </div>
                                    <manifastPirnt :mawb="inputModelData.mawb" v-if="inputModelData.guid"></manifastPirnt>                                                   
                                </div>

                                <!-- 分单 -->
                                <div 
                                    v-show="dzmaketabs[dzmaketabindex].ishawb" 
                                    v-if="dzmaketabs[dzmaketabindex]&&activeName=='tab1-dzmake'&&serviceSelArr.includes('AA0120')">          

                                    <!-- 分单->详情 -->
                                    <div 
                                        class="detail"
                                        :class="{paneDisabled:(allDisabled('AA0120')||servicesDisabled('AA0120'))&&!isPaper}">

                                        <!-- 分单->详情->标题 -->
                                        <div class="detail-title">
                                            <div class="finishInfo">
                                                <myServiceTitlePane code="AA0120" isdeep></myServiceTitlePane>
                                                <div :class="{paneDisabled:getServiceGuid('AA0120','childpgid')>0}">
                                                    <myServiceFinishBtn btnnum="390" isdeep v-if="btnJurisdic(390,'AA0120')"
                                                        code="AA0120"></myServiceFinishBtn>
                                                </div>
                                            </div>
                                        </div>

                                         <!-- 分单->详情-> -->
                                        <div class="detail-c">
                                            <myAlert servicecode="AA0120" v-if="!ifOperSysHome"></myAlert>
                                            <hawbTabsOper ref="hawbZdtab" :pagetype="2" :mawbdetail="inputModelData"
                                                v-if="!ifOperSysHome&&(ifThird.includes('tab1-dzmake')||serviceSelArr[ifOperSysHome?0:1]=='AA0120')"
                                                :saveNumberList="saveNumberList"  :showtabtitle="false" :nosave="1" :hawbPosition="dzmaketabs[dzmaketabindex].ishawb?dzmaketabs[dzmaketabindex].title:''"
                                                
                                                :isPaper="isPaper"
                                                :bottomFixed="isPaper"
                                                :needLimit="isPaper?billNeed:true"
                                                :afreshRateCharge="afreshRateCharge"
                                                @success="handleInfoSuccess"
                                                :is-order-confirm="isOrderConfirm"
                                                :is-confirm="setTabBadgeType('AA0120') !=='badgeRed'"
                                                :active-name="activeName"
                                                ></hawbTabsOper>

                                            <makingBill :mawbguid="mawbguid" style="border:1px solid #e8e8e8" orderdom="分单"
                                                v-if="ifOperSysHome&&(ifThird.includes('tab1-dzmake')||serviceSelArr[ifOperSysHome?0:1]=='AA0120')"
                                                :pagetype="ifOperSysHome?2:1" :mawbinfo="inputModelData"
                                                ></makingBill>
                                        </div>
                                    </div>

                                    <div v-if="ifThird.includes('tab1-dzmake')">
                                        <myServiceCostTable code="AA0120" isdeep></myServiceCostTable>
                                    </div>
                                </div>  

                             </commonTabs>

                        </el-tab-pane>

                        <!-- <el-tab-pane :label="newService.AA0110.title" v-if="newService.AA0110" name="AA0110">
                            <myTabBadge :color="setTabBadgeType('AA0110')" :label="newService.AA0110.title" slot="label" tabcode="AA0110" 
                                v-show="serviceSelArr.includes('AA0110')&&showServiceTab('AA0110')">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0110')||servicesDisabled('AA0110')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0110"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0110','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="380" v-if="btnJurisdic(380,'AA0110')"
                                                code="AA0110"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c">
                                    <myAlert servicecode="AA0110"
                                        v-if="(ifThird.includes('AA0110')||serviceSelArr[ifOperSysHome?0:1]=='AA0110')">
                                    </myAlert>

                                    <makingBill :mawbguid="mawbguid" :class="{makingBillPage:iscomboineChildren}"
                                        style="border:1px solid #e8e8e8" ref="makingbill" servicecode="AA0110"
                                        v-if="(ifThird.includes('AA0110')||serviceSelArr[ifOperSysHome?0:1]=='AA0110')"
                                        orderdom="总单" :pagetype="ifOperSysHome?2:1" :mawbinfo="inputModelData">
                                    </makingBill>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0110')">
                                <myServiceCostTable code="AA0110"></myServiceCostTable>
                            </div>
                        </el-tab-pane> -->

                        <!-- <el-tab-pane :label="newService.AA0120.title" name="AA0120"
                            v-if="inputModelData.orderdom!='直单'&&newService.AA0120&&inputModelData.iscomboine!=1">
                            <myTabBadge :color="setTabBadgeType('AA0120')" :label="newService.AA0120.title" slot="label"  tabcode="AA0120" 
                                v-show="inputModelData.orderdom!='直单'&&serviceSelArr.includes('AA0120')&&showServiceTab('AA0120')">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0120')||servicesDisabled('AA0120')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0120"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0120','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="390" v-if="btnJurisdic(390,'AA0120')"
                                                code="AA0120"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c">
                                    <myAlert servicecode="AA0120" v-if="!ifOperSysHome"></myAlert>

                                    <hawbTabsOper ref="hawbZdtab" :pagetype="2" :mawbdetail="inputModelData"
                                        v-if="!ifOperSysHome&&(ifThird.includes('AA0120')||serviceSelArr[ifOperSysHome?0:1]=='AA0120')"
                                        :saveNumberList="saveNumberList" :nosave="1"></hawbTabsOper> 

                                    <makingBill :mawbguid="mawbguid" style="border:1px solid #e8e8e8" orderdom="分单"
                                        v-if="ifOperSysHome&&(ifThird.includes('AA0120')||serviceSelArr[ifOperSysHome?0:1]=='AA0120')"
                                        :pagetype="ifOperSysHome?2:1" :mawbinfo="inputModelData"></makingBill>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0120')">
                                <myServiceCostTable code="AA0120"></myServiceCostTable>
                            </div>
                        </el-tab-pane> -->

                            <el-tab-pane :label="newService.AA0320.title" name="AA0320" v-if="newService.AA0320">
                            <myTabBadge :color="setTabBadgeType('AA0320')" :label="newService.AA0320.title" slot="label" tabcode="AA0320" 
                                v-show="inputModelData.orderdom!='直单'&&serviceSelArr.includes('AA0320')&&showServiceTab('AA0320')">
                            </myTabBadge>
                            <div class="detail finishDetail"
                                :class="{paneDisabled:allDisabled('AA0320')||servicesDisabled('AA0320')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0320"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0320','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="420" v-if="btnJurisdic(420,'AA0320')"
                                                code="AA0320"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c"></div>
                            </div>

                            <div v-if="ifThird.includes('AA0320')">
                                <myServiceCostTable code="AA0320"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

  


                        <el-tab-pane :label="newService.AA0130.title" v-if="newService.AA0130" name="AA0130">
                            <myTabBadge :color="setTabBadgeType('AA0130')" :label="newService.AA0130.title" tabcode="AA0130" 
                                v-show="serviceSelArr.includes('AA0130')&&showServiceTab('AA0130')" slot="label">
                            </myTabBadge>
                            <div class="detail finishDetail"
                                :class="{paneDisabled:allDisabled('AA0130')||servicesDisabled('AA0130')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0130"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0130','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="400" v-if="btnJurisdic(400,'AA0130')"
                                                code="AA0130"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c"></div>
                            </div>

                            <div v-if="ifThird.includes('AA0130')">
                                <myServiceCostTable code="AA0130"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0140.title" v-if="newService.AA0140" name="AA0140">
                            <myTabBadge :color="setTabBadgeType('AA0140')" :label="newService.AA0140.title" tabcode="AA0140"
                                v-show="serviceSelArr.includes('AA0140')&&showServiceTab('AA0140')" slot="label">
                            </myTabBadge>

                            <div class="detail" :class="{paneDisabled:allDisabled('AA0140')||servicesDisabled('AA0140')}" v-if="ifThird.includes('AA0140')">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0140"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0140','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="422" v-if="btnJurisdic(422,'AA0140')" code="AA0140">
                                            </myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0140')}" >
                                       <sendBill :mawbguid="inputModelData.guid" :orderdom="inputModelData.orderdom" :mawbinfo="inputModelData" applicationPage=2></sendBill>
                                </div>
                            </div>
                        
                         </el-tab-pane>

                        <el-tab-pane :label="newService.AA0150.title" v-if="newService.AA0150" name="AA0150">
                            <myTabBadge :color="setTabBadgeType('AA0150')" :label="newService.AA0150.title" tabcode="AA0150"
                                v-show="serviceSelArr.includes('AA0150')&&showServiceTab('AA0150')" slot="label">
                            </myTabBadge>

                            <div class="detail" :class="{paneDisabled:allDisabled('AA0150')||servicesDisabled('AA0150')}" v-if="ifThird.includes('AA0150')">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0150"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0150','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="424" v-if="btnJurisdic(424,'AA0150')" code="AA0150">
                                            </myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0150')}">
                                      <pactlPut  :sid="inputModelData.guid" applicationPage=2 :orderdom="inputModelData.orderdom" :gid="inputModelData.gid" :openType="1" :pactlsendstatus="10" :sendtype="1"></pactlPut>
                                </div>
                            </div>
                        
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0310.title" v-if="newService.AA0310" name="AA0310">
                            <myTabBadge :color="setTabBadgeType('AA0310')" :label="newService.AA0310.title" tabcode="AA0310" 
                                v-show="serviceSelArr.includes('AA0310')&&showServiceTab('AA0310')" slot="label">
                            </myTabBadge>
                            <div class="detail finishDetail"
                                :class="{paneDisabled:allDisabled('AA0310')||servicesDisabled('AA0310')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0310"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0310','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="410" v-if="btnJurisdic(410,'AA0310')"
                                                code="AA0310"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c"></div>
                            </div>

                            <div v-if="ifThird.includes('AA0310')">
                                <myServiceCostTable code="AA0310"></myServiceCostTable>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="newService.AA0320.title" name="AA0320" v-if="newService.AA0320">
                            <myTabBadge :color="setTabBadgeType('AA0320')" :label="newService.AA0320.title" slot="label" tabcode="AA0320" 
                                v-show="inputModelData.orderdom!='直单'&&serviceSelArr.includes('AA0320')&&showServiceTab('AA0320')">
                            </myTabBadge>
                            <div class="detail finishDetail"
                                :class="{paneDisabled:allDisabled('AA0320')||servicesDisabled('AA0320')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0320"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0320','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="420" v-if="btnJurisdic(420,'AA0320')"
                                                code="AA0320"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c"></div>
                            </div>

                            <div v-if="ifThird.includes('AA0320')">
                                <myServiceCostTable code="AA0320"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0230.title" v-if="newService.AA0230" name="AA0230">
                            <myTabBadge :color="setTabBadgeType('AA0230')" :label="newService.AA0230.title" tabcode="AA0230" 
                                v-show="serviceSelArr.includes('AA0230')&&showServiceTab('AA0230')" slot="label">
                            </myTabBadge>
                            <!-- <span
                                style="position: absolute;right:186px;top:22px;z-index: 2000;color:#333">交接地：{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.terminalname)||'--'}}</span>
                                 -->
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0230')||servicesDisabled('AA0230')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0230"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0230','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="430" v-if="btnJurisdic(430,'AA0230')"
                                                code="AA0230"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0230')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0230ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0230')" :pagetype="2"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0230')" servicecode="AA0230"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0230" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AA0230"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0230')">
                                <myServiceCostTable code="AA0230"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0240.title" name="AA0240" v-if="newService.AA0240">
                            <myTabBadge :color="setTabBadgeType('AA0240')" :label="newService.AA0240.title" tabcode="AA0240" 
                                v-show="serviceSelArr.includes('AA0240')&&showServiceTab('AA0240')" slot="label">
                            </myTabBadge>
                            <!-- <span
                                style="position: absolute;right:186px;top:22px;z-index: 2000;color:#333">交接地：{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.terminalname)||'--'}}</span> -->
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0240')||servicesDisabled('AA0240')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0240"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0240','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="440" v-if="btnJurisdic(440,'AA0240')"
                                                code="AA0240"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0240')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0240ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0240')" :pagetype="2"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0240')" servicecode="AA0240"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0240" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AA0240"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0240')">
                                <myServiceCostTable code="AA0240"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0110.title" v-if="newService.AG0110" name="AG0110">
                            <myTabBadge :color="setTabBadgeType('AG0110')" :label="newService.AG0110.title" tabcode="AG0110" 
                                v-show="serviceSelArr.includes('AG0110')&&showServiceTab('AG0110')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0110')||servicesDisabled('AG0110')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0110"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0110','childpgid')>0}">
                                            <myBindBetton code="AG0110"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AG0110')"
                                                v-if="getServiceGuid('AG0110','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="441" v-if="btnJurisdic(441,'AG0110')"
                                                code="AG0110"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0110')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0110ViewData']"
                                        :model-data.sync="inputModelData" :pagetype="2"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0110')"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0110')" servicecode="AG0110"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0110" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0110"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0110')">
                                <myServiceCostTable code="AG0110"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0115.title" v-if="newService.AG0115" name="AG0115">
                            <myTabBadge :color="setTabBadgeType('AG0115')" :label="newService.AG0115.title" tabcode="AG0115" 
                                v-show="serviceSelArr.includes('AG0115')&&showServiceTab('AG0115')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0115')||servicesDisabled('AG0115')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0115"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0115','childpgid')>0}">
                                            <myBindBetton code="AG0115"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AG0115')"
                                                v-if="getServiceGuid('AG0115','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="442" v-if="btnJurisdic(442,'AG0115')"
                                                code="AG0115"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0115')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0115ViewData']"
                                        :model-data.sync="inputModelData" :pagetype="2"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0115')"></newFormCmpt>

                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0115')" servicecode="AG0115"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0115" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0115"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0115')">
                                <myServiceCostTable code="AG0115"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0140.title" v-if="newService.AG0140" name="AG0140">
                            <myTabBadge :color="setTabBadgeType('AG0140')" :label="newService.AG0140.title" tabcode="AG0140" 
                                v-show="serviceSelArr.includes('AG0140')&&showServiceTab('AG0140')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0140')||servicesDisabled('AG0140')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0140"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0140','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="452" v-if="btnJurisdic(452,'AG0140')"
                                                code="AG0140"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0140')}">

                                </div>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0120.title" v-if="newService.AG0120" name="AG0120">
                            <myTabBadge :color="setTabBadgeType('AG0120')" :label="newService.AG0120.title" tabcode="AG0120" 
                                v-show="serviceSelArr.includes('AG0120')&&showServiceTab('AG0120')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0120')||servicesDisabled('AG0120')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0120"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0120','childpgid')>0}">
                                            <el-button type="primary" @click="ckFunc(1,0,'AG0120')"
                                                v-if="ifOperSysHome&&projectIsWecan" style="margin-right:8px;">出库
                                            </el-button>
                                            <myBindBetton code="AG0120"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AG0120')"
                                                v-if="getServiceGuid('AG0120','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="443" v-if="btnJurisdic(443,'AG0120')"
                                                code="AG0120"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0120')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0120ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0120')" :pagetype="2">
                                        <template :slot="listView['AG0120']">
                                            <listViewSlot code="AG0120"></listViewSlot>
                                        </template>

                                        <template :slot="listView['AG0120pm']">
                                            <listViewSlot code="AG0120pm"></listViewSlot>
                                        </template>

                                    </newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0120')" servicecode="AG0120"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0120" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0120"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0120')">
                                <myServiceCostTable code="AG0120"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0810.title" v-if="newService.AA0810" name="AA0810">
                            <myTabBadge :color="setTabBadgeType('AA0810')" :label="newService.AA0810.title" tabcode="AA0810" 
                                v-show="serviceSelArr.includes('AA0810')&&showServiceTab('AA0810')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0810')||servicesDisabled('AA0810')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <!-- {{allDisabled('AA0810')}}
                                        {{allDisabled('AA0810')}} -->
                                        <myServiceTitlePane code="AA0810"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0810','childpgid')>0}">
                                            <!-- BOGN才有出库 -->
                                            <el-button type="primary" @click="ckFunc(1,0,'AA0810')"
                                                v-if="ifOperSysHome&&projectIsWecan" style="margin-right:8px;">出库
                                            </el-button>
                                            <myBindBetton code="AA0810"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AA0810')"
                                                v-if="getServiceGuid('AA0810','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="447" v-if="btnJurisdic(447,'AA0810')"
                                                code="AA0810"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0810')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0810ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0810')" :pagetype="2">
                                        <template :slot="listView['AA0810']">
                                            <listViewSlot code="AA0810"></listViewSlot>
                                        </template>
                                    </newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0810')" servicecode="AA0810"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0810" :boguid="boguid"
                                        :pono="inputModelData.pono" @success="getServiceNodeData" ref="AA0810">
                                    </increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0810')">
                                <myServiceCostTable code="AA0810"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0830.title" v-if="newService.AA0830" name="AA0830">
                            <myTabBadge :color="setTabBadgeType('AA0830')" tabcode="AA0830"  :label="newService.AA0830.title"
                                v-show="serviceSelArr.includes('AA0830')&&showServiceTab('AA0830')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0830')||servicesDisabled('AA0830')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0830"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0830','childpgid')>0}">
                                            <myBindBetton code="AA0830"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AA0830')"
                                                v-if="getServiceGuid('AA0830','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="448" v-if="btnJurisdic(448,'AA0830')"
                                                code="AA0830"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0830')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0830ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0830')" :pagetype="2"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0830')" servicecode="AA0830"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0830" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AA0830"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0830')">
                                <myServiceCostTable code="AA0830"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0840.title" v-if="newService.AA0840" name="AA0840">
                            <myTabBadge :color="setTabBadgeType('AA0840')" tabcode="AA0840"  :label="newService.AA0840.title"
                                v-show="serviceSelArr.includes('AA0840')&&showServiceTab('AA0840')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0840')||servicesDisabled('AA0840')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0840"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0840','childpgid')>0}">
                                            <myBindBetton code="AA0840"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AA0840')"
                                                v-if="getServiceGuid('AA0840','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="449" v-if="btnJurisdic(449,'AA0840')"
                                                code="AA0840"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0840')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0840ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0840')" :pagetype="2"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0840')" servicecode="AA0840"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0840" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AA0840"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0840')">
                                <myServiceCostTable code="AA0840"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AA0850.title" v-if="newService.AA0850" name="AA0850">
                            <myTabBadge :color="setTabBadgeType('AA0850')" tabcode="AA0850"  :label="newService.AA0850.title"
                                v-show="serviceSelArr.includes('AA0850')&&showServiceTab('AA0850')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AA0850')||servicesDisabled('AA0850')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AA0850"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AA0850','childpgid')>0}">
                                            <myBindBetton code="AA0850"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AA0850')"
                                                v-if="getServiceGuid('AA0850','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="451" v-if="btnJurisdic(451,'AA0850')"
                                                code="AA0850"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AA0850')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AA0850ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AA0850')" :pagetype="2"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AA0850')" servicecode="AA0850"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AA0850" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AA0850"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AA0850')">
                                <myServiceCostTable code="AA0850"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0125.title" v-if="newService.AG0125" name="AG0125">
                            <myTabBadge :color="setTabBadgeType('AG0125')"  tabcode="AG0125" :label="newService.AG0125.title"
                                v-show="serviceSelArr.includes('AG0125')&&showServiceTab('AG0125')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0125')||servicesDisabled('AG0125')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0125"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0125','childpgid')>0}">
                                            <myBindBetton code="AG0125"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AG0125')"
                                                v-if="getServiceGuid('AG0125','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="444" v-if="btnJurisdic(444,'AG0125')"
                                                code="AG0125"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0125')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0125ViewData']"
                                        :model-data.sync="inputModelData"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0125')" :pagetype="2"></newFormCmpt>

                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0125')" servicecode="AG0125"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0125" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0125"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0125')">
                                <myServiceCostTable code="AG0125"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0130.title" v-if="newService.AG0130" name="AG0130">
                            <myTabBadge :color="setTabBadgeType('AG0130')" tabcode="AG0130"  :label="newService.AG0130.title"
                                v-show="serviceSelArr.includes('AG0130')&&showServiceTab('AG0130')" slot="label">
                            </myTabBadge>

                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0130')||servicesDisabled('AG0130')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0130"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0130','childpgid')>0}">
                                            <el-button type="primary" @click="ckFunc(1,0,'AG0130')"
                                                v-if="ifOperSysHome&&projectIsWecan" style="margin-right:8px;">出库
                                            </el-button>
                                            <myBindBetton code="AG0130"></myBindBetton>
                                            <el-button type="primary" @click="taskDelivery('AG0130')"
                                                v-if="getServiceGuid('AG0130','status')==100&&!isBognTesk&&ifShowTeskBtn">
                                                任务下达</el-button>
                                            <myServiceFinishBtn btnnum="445" v-if="btnJurisdic(445,'AG0130')"
                                                code="AG0130"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0130')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0130ViewData']"
                                        :model-data.sync="inputModelData" :pagetype="2"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0130')">
                                        <template :slot="listView['AG0130']">
                                            <listViewSlot code="AG0130"></listViewSlot>
                                        </template>

                                        <template :slot="listView['AG0130pm']">
                                            <listViewSlot code="AG0130pm"></listViewSlot>
                                        </template>
                                    </newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0130')" servicecode="AG0130"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0130" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0130"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0130')">
                                <myServiceCostTable code="AG0130"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AG0135.title" v-if="newService.AG0135" name="AG0135">
                            <myTabBadge :color="setTabBadgeType('AG0135')" tabcode="AG0135"  :label="newService.AG0135.title"
                                v-show="serviceSelArr.includes('AG0135')&&showServiceTab('AG0135')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AG0135')||servicesDisabled('AG0135')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AG0135"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AG0135','childpgid')>0}">
                                            <myServiceFinishBtn btnnum="446" v-if="btnJurisdic(446,'AG0135')"
                                                code="AG0135"></myServiceFinishBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AG0135')}">
                                    <newFormCmpt :view-data.sync="serviceViewData['AG0135ViewData']"
                                        :model-data.sync="inputModelData" :pagetype="2"
                                        v-if="ifOperSysHome&&ifThird.includes('AG0135')"></newFormCmpt>
                                    <increaseServiceSplit :ordertype="ordertype" :mawbinfo="inputModelData"
                                        :orderFinish="orderFinish" :saveNumberList="saveNumberList"
                                        v-if="!ifOperSysHome&&ifThird.includes('AG0135')" servicecode="AG0135"
                                        :mawbguid="inputModelData.guid" :area="area"
                                        :hasData.sync="ysSmallService.AG0135" :boguid="boguid"
                                        @success="getServiceNodeData" ref="AG0135"></increaseServiceSplit>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AG0135')">
                                <myServiceCostTable code="AG0135"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AB0420.title" v-if="newService.AB0420" name="AB0420">
                            <myTabBadge :color="setTabBadgeType('AB0420')" tabcode="AB0420" :label="newService.AB0420.title" slot="label"
                                v-show="serviceSelArr.includes('AB0420')&&showServiceTab('AB0420')"></myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AB0420')||servicesDisabled('AB0420')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AB0420"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AB0420','childpgid')>0}">
                                            <baoguanNodeBtn btnnum="363" v-if="pagetype!=3&&btnJurisdic(363,'AB0420')"
                                                :area="area" :mawbguid="mawbguid" :boguid="boguid" servicecode="AB0420"
                                                :serviceguid="getServiceGuid('AB0420')"
                                                :orderpgid="getServiceGuid('AB0420','orderpgid')"
                                                :childpgid="getServiceGuid('AB0420','childpgid')"
                                                :itemsname="serviceInfo.AB0420.itemsname"
                                                :wagedom="serviceInfo.AB0420.wagedom"
                                                :url="!isServiceFinish('AB0420')?'api/ExAxplineStoreFinish':'api/ExAxplineStoreUnFinish'"
                                                :jsxm-data="ifOperSysHome?getJsxmData([],5):ckJsxmDataMdg"
                                                :serviceNodeData="serviceNodeData"
                                                @edit-node-success="edit_node_success"
                                                :isFinished="isServiceFinish('AB0420')"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AB0420')}">
                                    <storeServiceInfo :saveNumberList="saveNumberList"
                                        :serviceguid="getServiceGuid('AB0420')" servicecode="AB0420"
                                        :mawbguid="mawbguid" @getJsxmData="getJsxmData"
                                        v-if="!ifOperSysHome&&ifThird.includes('AB0420')"></storeServiceInfo>

                                    <template v-if="ifOperSysHome&&ifThird.includes('AB0420')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AB0420ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeListMdg"
                                            :piece="inputModelData.piece" @success="saveMawbInfo(4)"></storeCompSize>
                                    </template>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AB0420')">
                                <myServiceCostTable code="AB0420"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AB0520.title" v-if="newService.AB0520" name="AB0520">
                            <myTabBadge :color="setTabBadgeType('AB0520')" tabcode="AB0520" :label="newService.AB0520.title"
                                v-show="serviceSelArr.includes('AB0520')&&showServiceTab('AB0520')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AB0520')||servicesDisabled('AB0520')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AB0520"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AB0520','childpgid')>0}">
                                            <baoguanNodeBtn btnnum="364" v-if="pagetype!=3&&btnJurisdic(364,'AB0520')"
                                                :area="area" :mawbguid="mawbguid" :boguid="boguid" servicecode="AB0520"
                                                :serviceguid="getServiceGuid('AB0520')"
                                                :orderpgid="getServiceGuid('AB0520','orderpgid')"
                                                :childpgid="getServiceGuid('AB0520','childpgid')"
                                                :itemsname="serviceInfo.AB0520.itemsname"
                                                :wagedom="serviceInfo.AB0520.wagedom"
                                                :url="!isServiceFinish('AB0520')?'api/ExAxplineStoreTransportFinish':'api/ExAxplineStoreTransportUnFinish'"
                                                :jsxm-data="ifOperSysHome?getJsxmData([],6):thJsxmDataMdg"
                                                :serviceNodeData="serviceNodeData"
                                                @edit-node-success="edit_node_success"
                                                :isFinished="isServiceFinish('AB0520')"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c" :class="{disabled:isServiceFinish('AB0520')}">
                                    <takeDeliveryGoods :saveNumberList="saveNumberList"
                                        :serviceguid="getServiceGuid('AB0520')" servicecode="AB0520"
                                        :mawbguid="mawbguid" :mawbinfo="inputModelData" @getJsxmData="getJsxmData"
                                        :boguid="boguid" v-if="!ifOperSysHome&&ifThird.includes('AB0520')"
                                        @edit-node-success="edit_node_success" @success="getServiceNodeData"
                                        :ordertype="ordertype" :orderFinish="orderFinish" ref="AB0520">
                                    </takeDeliveryGoods>

                                    <template v-if="ifOperSysHome&&ifThird.includes('AB0520')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AB0520ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <takeGoodsAddMdg :inputModelData="inputModelData" ref="takeGoodsAddRefMdg"
                                            id="ybTransstoreListMdg" @success="saveMawbInfo(4)"></takeGoodsAddMdg>
                                    </template>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AB0520')">
                                <myServiceCostTable code="AB0520"></myServiceCostTable>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="newService.AB0620.title" v-if="newService.AB0620" name="AB0620">
                            <myTabBadge :color="setTabBadgeType('AB0620')" tabcode="AB0620" :label="newService.AB0620.title"
                                v-show="serviceSelArr.includes('AB0620')&&showServiceTab('AB0620')" slot="label">
                            </myTabBadge>
                            <div class="detail"
                                :class="{paneDisabled:allDisabled('AB0620')||servicesDisabled('AB0620')}">
                                <div class="detail-title">
                                    <div class="finishInfo">
                                        <myServiceTitlePane code="AB0620"></myServiceTitlePane>
                                        <div :class="{paneDisabled:getServiceGuid('AB0620','childpgid')>0}">
                                            <baoguanNodeBtn btnnum="365" v-if="pagetype!=3&&btnJurisdic(365,'AB0620')"
                                                :area="area" :mawbguid="mawbguid" :boguid="boguid" servicecode="AB0620"
                                                :serviceguid="getServiceGuid('AB0620')"
                                                :orderpgid="getServiceGuid('AB0620','orderpgid')"
                                                :childpgid="getServiceGuid('AB0620','childpgid')"
                                                :itemsname="serviceInfo.AB0620.itemsname"
                                                :wagedom="serviceInfo.AB0620.wagedom"
                                                :url="!isServiceFinish('AB0620')?'api/ExAxplineDeclFinish':'api/ExAxplineDeclUnFinish'"
                                                :jsxm-data="ifOperSysHome?getJsxmData([],7):bgJsxmDataMdg"
                                                :serviceNodeData="serviceNodeData"
                                                @edit-node-success="edit_node_success(2)"
                                                :isFinished="isServiceFinish('AB0620')"></baoguanNodeBtn>
                                        </div>
                                    </div>
                                </div>
                                <div class="detail-c"
                                    :class="{disabled:isServiceFinish('AB0620')||(pagetype==3&&!ifOperSysHome)}">
                                    <template v-if="!ifOperSysHome&&ifThird.includes('AB0620')">
                                        <declareAtcustoms ref="bgCmptMdg" :mawbguid="mawbguid"
                                            :serviceguid="getServiceGuid('AB0620')" servicecode="AB0620"
                                            :hawblist="hawbTableData" :jiediandata="jiediandata"
                                            :mawbinfo="inputModelData" @getJsxmData="getJsxmData"
                                            @edit-node-success="edit_node_success(2)"
                                            :orderpgid="getServiceGuid('AB0620','orderpgid')"
                                            :childpgid="getServiceGuid('AB0620','childpgid')"></declareAtcustoms>
                                    </template>

                                    <template v-if="ifOperSysHome&&ifThird.includes('AB0620')">
                                        <newFormCmpt :view-data.sync="serviceViewData['AB0620ViewData']"
                                            :model-data.sync="inputModelData" :pagetype="2"></newFormCmpt>
                                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="2"
                                            @success="saveMawbInfo(4)"></declareAtcustomsAdd>
                                        <div style="display:flex;justify-content: flex-end;margin-bottom:15px">
                                            <baoguanNodeBtn :area="area" :mawbguid="mawbguid" :node-list="jiediandata"
                                                :boguid="boguid" :jsxm-data="jsxmData(2)"
                                                :orderpgid="getServiceGuid('AB0620','orderpgid')"
                                                :childpgid="getServiceGuid('AB0620','childpgid')"
                                                @edit-node-success="edit_node_success(2)"></baoguanNodeBtn>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div v-if="ifThird.includes('AB0620')">
                                <myServiceCostTable code="AB0620"></myServiceCostTable>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <el-dialog title="总单服务编辑" :visible.sync="dialogFormVisible"
                :style="{visibility:inputModelData.guid?'':'hidden'}" append-to-body :close-on-click-modal="false"
                width="1440px" @close="setServiceInfo(serviceListBackups)">
                <div class="detail" :style="{visibility:inputModelData.guid?'':'hidden'}">
                    <div class="detail-c">
                        <serviceList :newService.sync="newService" :opersystem="inputModelData.opersystem" pagetype="2"
                            :serviceList="inputModelData.serviceList" ref="serviceTemp"
                            :orderguid="inputModelData.orderguid" :orderdom="inputModelData.orderdom"
                            :system="inputModelData.system" :danhaoConfirmd="inputModelData.dzstatus>=350"></serviceList>
                        <div style="text-align:right">
                            <!-- 服务保存 -->
                            <el-button btnnum="480" :disabled="!showFwbjBtn" @click="saveServiceFunc">保存</el-button>
                        </div>
                    </div>
                </div>
            </el-dialog>

            <el-dialog title="配置总单" :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" append-to-body
                :close-on-click-modal="false" width="1200px" @close="mawbConfigDialogClose" custom-class="mawbDialog">
                <mawbConfigNew :rowData="inputModelData" pagetype="2" ref="mawbConfig" :visible.sync="dialogMawbConfig"></mawbConfigNew>
                <!-- {{objGysss}} -->
<!--                 <div class="detail">
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

            <el-dialog :visible.sync="mawbDialog" width="1300px" top="4%" v-if="mawbDialog"
                :close-on-press-escape="false" append-to-body>
                <iframe
                    :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman()}&area=${area}`"
                    frameborder="0" allowtransparency="true"
                    style="width: 100%; height:700px; border: 0px none;"></iframe>
            </el-dialog>

            <el-dialog title="航班配舱" :visible.sync="dialogFlightAss" v-if="dialogFlightAss" append-to-body
                :close-on-click-modal="false" width="1200px">
                <div class="detail">
                    <flightAssignment :mawbinfo="inputModelData" :dialogshow.sync="dialogFlightAss"
                        :shipaceInfoData.sync="shipaceInfoData"></flightAssignment>
                </div>
            </el-dialog>

            <el-dialog title="请确认制单代理代码,分运单票数以及客户确认尺寸" :visible.sync="signApplicationDialog"
                v-if="signApplicationDialog" @close="signApplicationDialogClose" append-to-body
                :close-on-click-modal="false" width="1000px">
                <h3 style="margin-bottom: 15px;">请确认制单代理代码</h3>
                <newFormCmpt :view-data.sync="zdBasicInfo" :model-data.sync="inputModelData" :pagetype="2">
                </newFormCmpt>
                <!-- {{signApplicationTableData}} -->
                <h3 style="margin-top: 25px;">请确认客户确认尺寸</h3>
                <commonTable style="margin:20px 0" class="hawb-table" :head="khqrTableHead"
                    :tableData="signApplicationTableData" :showAllZiTable="true">
                    <template slot="ziTable" slot-scope="props">
                        <commonTable :head="khqrZiTableHead" :table-data="props.data.row.vollist"
                            v-if="props.data.row.vollist.length>0"
                            :style="{height:(props.data.row.vollist.length+1)*32+'px'}" class="peihuoZiTable">
                        </commonTable>
                    </template>
                </commonTable>

                <div class="signApplicationInfo">
                    <h3 style="margin:20px 0;">汇总信息</h3>
                    <!-- <p><span>预报件/重/体</span><span>{{computeSignApplijzt(1)}}</span></p> -->
                    <!-- <p>
        <span>关封件/重</span>
        <span style="display:flex;width:230px">
            {{inputModelData.bgpiece||0}}/{{inputModelData.bgweight||0.00}}
        </span>
    </p> -->
                    <p style="font-weight:600"><span>提交至签单的件/重/体</span><span>{{computeSignApplijzt(4)}}</span></p>
                    <p style="grid-template-columns:60px repeat(4,140px);"><span
                            style="text-align:right;margin-right:6px">其中：</span><span>实际入库件/重/体</span><span>{{computeSignApplijzt(2)}}</span><span>客户确认件/重/体</span><span>{{computeSignApplijzt(3)}}</span>
                    </p>
                </div>


                <div style="text-align:right;margin-top:10px;margin-right:15px;">
                    <el-button type="primary" @click="signApplicationSure">确定</el-button>
                    <el-button @click="signApplicationDialog=false;signApplicationDialogClose()">取消</el-button>
                </div>

            </el-dialog>

            <el-dialog :visible.sync="mawbConfigConfim" width="380px" append-to-body :close-on-click-modal="false"
                top="15%" center>
                <el-button btnnum="500" type="primary" plain @click="showZuofei=false;mawbConfigFunc(2,1)">可用</el-button>
                <!-- <el-button btnnum="510" type="primary" plain @click="mawbConfigFunc(2,4)">不可用</el-button> -->
                <el-button btnnum="520" type="primary" plain @click="showZuofei=true;">作废</el-button>
                 
                <div v-if="showZuofei" style="margin-top:10px;height:80px;">
                    <span>作废备注</span>
                    <span> <el-input type="textarea" v-model="deprecateremark" style="width:80%;vertical-align:middle"></el-input></span>
                    <el-button type="primary" style="float:right;margin-top:5px;" @click="mawbConfigFunc(2,5)">确认</el-button>
                </div>  
                

            </el-dialog>

            <!-- 分配 -->
            <el-dialog :visible.sync="assignShow" :close-on-click-modal="false" v-if="assignShow" width="1300px"
                append-to-body>
                <fenpei :fenpeiguid="String(boguid)" @success="initFunc" :opersystem="inputModelData.opersystem"
                    :system="inputModelData.system" :origin="pagetype=='15'?'航线':'客服'" :area="inputModelData.area" :orderguid="inputModelData.orderguid"></fenpei>
            </el-dialog>

            <!-- 分配信息销售站 -->
            <el-dialog :visible.sync="assignXsInfo" :close-on-click-modal="false" v-if="assignXsInfo" append-to-body
                width="900px" center>
                <table style="width:860px!important;table-layout:fixed;" class="fpTable">
                    <tr>
                        <th style="width:260px;">服务</th>
                        <th style="width:80px">分配区域</th>
                        <th>分配模式</th>

                        <th>费用</th>
                        <th>类型</th>
                        <th>币种</th>
                        <th style="width:150px">分利(销售站:操作站)</th>
                    </tr>
                    <tr v-for="(item,index) in assignXsDataSfg" :style="{background:index%2==0?'white':'#f8f8f8'}"
                        :key="index">
                        <td style="width:260px;text-overflow:ellipsis;overflow:hidden;" :title="item.assignname">
                            {{item.assignname}}</td>
                        <td style="width:80px">{{item.assignarea}}</td>
                        <td>{{item.profitmode }}</td>

                        <td>{{item.profitmode=="利润分配模式"?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}
                        </td>
                        <td>
                            <span
                                v-if="item.profitmode">{{item.profitmode!='利润分配模式'&&item.isinwageallin?(item.isinwageallin=='1'?'单价ALLIN':item.isinwageallin=='2'?'总价':'单价++'):'--'}}</span>
                            <span v-else></span>
                        </td>
                        <td>{{item.currency||'--'}}</td>
                        <td style="width:150px">
                            {{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.self_profitvalue}}:{{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.cus_profitvalue}}
                        </td>
                    </tr>
                </table>
            </el-dialog>

            <el-dialog :visible.sync="detailShow.lxrShow" v-if="detailShow.lxrShow" append-to-body width="900px"
                title="联系人信息" center>
                <mawbContacts :mawbguid="inputModelData.guid" v-if="detailShow.lxrShow"></mawbContacts>
            </el-dialog>

            <!-- 分配信息操作站 -->
            <el-dialog :visible.sync="assignCzInfo" :close-on-click-modal="false" v-if="assignCzInfo" append-to-body width="900px">
                <!-- 销售站 -->
                <div v-if="assignXsDataSfg.saleservice&&assignXsDataSfg.saleservice.length>0">
                    <h4>销售站</h4>
                    <table style="width:860px!important;table-layout:fixed;" class="fpTable">
                        <tr>
                            <th style="width:260px;">服务</th>
                            <th style="width:80px">分配区域</th>
                            <th>分配模式</th>
            
                            <th>费用</th>
                            <th>类型</th>
                            <th>币种</th>
                            <th style="width:150px">分利(销售站:操作站)</th>
                        </tr>
                        <tr v-for="(item,index) in assignXsDataSfg.saleservice" :style="{background:index%2==0?'white':'#f8f8f8'}"
                            v-if="item.assignarea" :key="index">
                            <td style="width:260px;text-overflow:ellipsis;overflow:hidden;" :title="item.assignname">
                                {{item.assignname}}</td>
                            <td style="width:80px">{{item.assignarea}}</td>
                            <td>{{item.profitmode }}</td>
                            <td>{{item.profitmode=="利润分配模式"?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}
                            </td>
                            <td>
                                <span
                                    v-if="item.profitmode">{{item.profitmode!='利润分配模式'&&item.isinwageallin?(item.isinwageallin=='1'?'单价ALLIN':item.isinwageallin=='2'?'总价':'单价++'):'--'}}</span>
                                <span v-else></span>
                            </td>
                            <td>{{item.currency||'--'}}</td>
                            <td style="width:150px">
                                {{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.self_profitvalue}}:{{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.cus_profitvalue}}
                            </td>
                        </tr>
                    </table>
                </div>
            
                <!-- 操作站 -->
                <div v-if="assignXsDataSfg.operservice&&assignXsDataSfg.operservice.length>0">
                    <h4>操作站</h4>
                    <table style="width:860px!important;table-layout:fixed;" class="fpTable">
                        <tr>
                            <th style="width:260px;">服务</th>
                            <th style="width:80px">分配区域</th>
                            <th>分配模式</th>
            
                            <th>费用</th>
                            <th>类型</th>
                            <th>币种</th>
                            <th style="width:150px">分利(销售站:操作站)</th>
                        </tr>
                        <tr v-for="(item,index) in assignXsDataSfg.operservice" :style="{background:index%2==0?'white':'#f8f8f8'}"
                            v-if="item.assignarea" :key="index">
                            <td style="width:260px;text-overflow:ellipsis;overflow:hidden;" :title="item.assignname">
                                {{item.assignname}}</td>
                            <td style="width:80px">{{item.assignarea}}</td>
                            <td>{{item.profitmode }}</td>
                            <td>{{item.profitmode=="利润分配模式"?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}
                            </td>
                            <td>
                                <span
                                    v-if="item.profitmode">{{item.profitmode!='利润分配模式'&&item.isinwageallin?(item.isinwageallin=='1'?'单价ALLIN':item.isinwageallin=='2'?'总价':'单价++'):'--'}}</span>
                                <span v-else></span>
                            </td>
                            <td>{{item.currency||'--'}}</td>
                            <td style="width:150px">
                                {{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.self_profitvalue}}:{{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.cus_profitvalue}}
                            </td>
                        </tr>
                    </table>
                </div>
            
            </el-dialog>

            <!-- 总费用 -->
            <el-dialog :visible.sync="costDialog" width="1480px" top="4%" v-if="costDialog"
                :close-on-press-escape="false" append-to-body center>
                <!-- {{pagetype}} -->
                <costMaking v-if="costDialog" :mawbguid="mawbguid"
                    style="min-height:400px;display:flex;flex-direction:column;justify-content:space-around"
                    @success="wageSuccess" :boguid="boguid" :pagetype="2" :inputModelData="inputModelData"
                    :costDom="pagetype=='14'?'客服':pagetype=='15'?'航线':''"
                    :initiator="pagetype=='14'?'10':pagetype=='15'?'20':''"
                    :showSuggestWage="(pagetype == '14'||!projectIsWecan) ? true : false"></costMaking>
            </el-dialog>

            <!-- 
      <el-dialog
        :visible.sync="costDialog1"
        width="1480px"
        top="4%"
        v-if="costDialog1"
        :close-on-press-escape="false"
        append-to-body
        center
      >
        <costMaking
          v-if="costDialog1"
          :mawbguid="mawbguid"
          style="min-height:400px;display:flex;flex-direction:column;justify-content:space-around"
          @success="wageSuccess"
          :boguid="boguid"
          :pagetype="2"
          :inputModelData="inputModelData"
          :costDom="pagetype=='14'?'客服':pagetype=='15'?'航线':''"
          :showSuggestWage="pagetype == '14' ? true : false"
        ></costMaking>
      </el-dialog> -->

            <!-- 唯凯托书 -->
            <el-dialog :visible.sync="tuoshuDialog" width="1300px" top="4%" v-if="tuoshuDialog"
                :close-on-press-escape="false" append-to-body center>
                <entrustBill :mawbinfo="getInfo()" :saveNumberList="saveNumberList"></entrustBill>
            </el-dialog>
            <!-- 交货文件 -->
            <el-dialog :visible.sync="jhwjDialog" width="900px" top="8%" v-if="jhwjDialog"
                :close-on-press-escape="false" append-to-body center>
                <!-- {{jhTableData}} -->
                <commonTable :head="jhHead" :table-data="jhTableData" style="margin-top:8px;">
                    <template slot="filename" slot-scope="props">
                        <span style="cursor:pointer;color:blue"
                            @click="openDialogJh(props.data.row)">{{props.data.value}}</span>
                    </template>
                </commonTable>
            </el-dialog>

            <el-dialog :visible.sync="dialogJh" class="dialogImgDoc" v-if="dialogJh" :fullscreen="true" width="850px"
                append-to-body top="4%">
                <iframe :src="jhDocUrl" frameborder="0" allowtransparency="true"
                    style="width: 100%; height: 100%; border: 0px none;"></iframe>
            </el-dialog>

            <el-dialog :visible.sync="dialogPcd" class="dialogImgDoc" v-if="dialogPcd" width="1200px" append-to-body
                top="1%" @close="dialogPcdClosed">
                <iframe :src="pcdUrl" frameborder="0" allowtransparency="true"
                    style="width: 100%; height: 100%; border: 0px none;"></iframe>
            </el-dialog>

            <!-- 手动绑定 -->
            <el-dialog :visible.sync="operBindDialog" v-if="operBindDialog" :close-on-click-modal="false"
                :close-on-press-escape="false" width="1200px" append-to-body top="4%">
                <newFormCmpt :view-data.sync="operBindView" :model-data.sync="operBindData"
                    :search-data.sync="operBindSearch" :pagetype="2"></newFormCmpt>

                <el-button type="primary" style="margin-bottom:10px;margin:15px" @click="operBinding(2)">查询</el-button>

                <el-button type="primary" style="margin-bottom:10px;" @click="operBinding(3)">手动绑定</el-button>

                <commonTable :head="operBindTableHead" :table-data="operBindTableData" isRadioSelect></commonTable>
            </el-dialog>

            <!-- 任务完成 -->
            <el-dialog :visible.sync="finishCostDialog" width="400px" top="4%" v-if="finishCostDialog"
                :close-on-press-escape="false" append-to-body :close-on-click-modal="false" center>
                <el-form label-width="110px" :inline="true" style="padding-left:20px;">
                    <!-- {{finishCostForm}} -->
                    <el-form-item label="操作人：">
                        <el-input v-model="finishCostForm.addman" style="width:180px;" class="input-required">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="操作时间：">
                        <el-date-picker v-model="finishCostForm.adddate" type="datetime" value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm" placeholder="选择日期" style="width:178px;" class="input-required">
                        </el-date-picker>
                    </el-form-item>

                    <!-- <el-form-item label="供应商：" v-if="noNeedWage">
          <pageSelect :pagetype="3" :modelval.sync="finishCostForm.gid" style="width:180px"></pageSelect>
        </el-form-item>

        <el-form-item label="币种：" style="position:relative;top:0px" v-if="noNeedWage">
          <currencySelect
            v-model="finishCostForm.currency"
            style="display:inline-block;margin-left:6px;"
            itemstyle="width:176px;min-width:176px;"
          ></currencySelect>
        </el-form-item>

        <el-form-item style="position:relative;top:-8px" v-if="noNeedWage">
          <span
            style="display: inline-block; width: 110px;text-align: right;padding-right:13px;"
          >{{finishWetWageName}}：</span>
          <el-input placeholder="请填写费用" style="width:180px" v-model="finishCostForm.wage"></el-input>
        </el-form-item>

        <el-form-item label="计费方式：" v-if="noNeedWage">
          <my-select
            :groupid="33"
            itemstyle="min-width:180px;width:100%;margin-bottom:0px;display:inline-block;max-width:180px"
            v-model="finishCostForm.wagetype"
          ></my-select>
          </el-form-item>-->
                    <el-form-item>
                        <el-button btnnum="530" type="primary" style="margin-left:120px;width:100px"
                            @click="serviceFinishNeedSave">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" :dom="pagetype==15?5:3"
                :inputModelData="inputModelData" @success="newCancelOrder">
                <hawbDeclBackCancel :inputModelData="inputModelData" :visible.sync="orderCancel"
                    @success="refreshPeihuo" slot="back" v-if="projectIsWecan"
                    :signApplicationCanEdit="signApplicationCanEdit"></hawbDeclBackCancel>
                <hawbDeclBackCancelOld :inputModelData="inputModelData" :visible.sync="orderCancel" slot="back"
                    v-if="!projectIsWecan"></hawbDeclBackCancelOld>
            </cancelOper>

            <el-dialog :visible.sync="qfsjDialog" width="1300px" top="4%" v-if="qfsjDialog"
                :close-on-press-escape="false" append-to-body>
                <iframe :src="qfsjUrl" frameborder="0" allowtransparency="true"
                    style="width: 100%; height:700px; border: 0px none;"></iframe>
            </el-dialog>

            <!-- 海外N/N制作 -->
            <el-dialog title="海外D/N制作" :visible.sync="oversea" width="100%" top="0" v-if="oversea"
                @close="oversea=false" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
                <costMaking :mawbguid="inputModelData.guid" v-if="oversea" @unvisible="oversea=false"
                    :boguid="inputModelData.boguid" :isFromFob="'Fob1'" :area="inputModelData.area"
                    :gid="inputModelData.gid"></costMaking>
            </el-dialog>

            <el-dialog :visible.sync="thOperDialog" width="490px" top="4%" :close-on-press-escape="false"
                append-to-body>
                <!-- {{transList}} -->
                <el-form label-width="120px" :inline="true">
                    <el-form-item label="供应商：">
                        <span>上海唯凯国际空运出口操作部</span>
                    </el-form-item>

                    <template v-for="(item,index) in transList">
                        <el-row>
                            <el-form-item label="卡车费(总价)：">
                                <el-input v-model.number="item.transprice" class='input-required' clearable>
                                    <template slot="append">CNY</template>
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <i @click="addTransList(index)"
                                    style="width:18px;height:18px;font-size:18px;cursor:pointer;transform: translateY(-5px)"
                                    :style="{color:index!=0?'red':'#67C23A'}"
                                    :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                                    :title="index!=0?'删除此条':'新增一条'"></i>

                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item label="卡车备注：">
                                <el-input v-model="item.transremark" style="width:281px" clearable></el-input>
                            </el-form-item>
                        </el-row>

                    </template>

                    <!-- <el-form-item label="卡车费(总价)：">
            <el-input v-model.number="transprice">
              <template slot="append">CNY</template>
            </el-input>
          </el-form-item>
          <el-form-item label="卡车备注：">
            <el-input v-model="transremark"></el-input>
          </el-form-item> -->

                </el-form>

                <div style="text-align:right;margin-top:12px;">
                    <el-button btnnum="540" @click="thOperDialog=false" type="default">取消</el-button>
                    <el-button btnnum="550" type="primary" @click="thOperFunc(1)">确定</el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="mergeDialog" title="合并订单信息" width="90%" top="1%" v-if="mergeDialog"
                :close-on-press-escape="false" append-to-body>
                <mergeBill :mawbinfo="inputModelData" @success="mergeSucs"></mergeBill>
            </el-dialog>

            <hawbDeclBack :inputModelData="inputModelData" :visible.sync="hawbDeclBackVisible"></hawbDeclBack>

        </div>

        <!-- 用于总单搜索切换新订单，实际上是隐藏了原来的详细内容，显示新的订单内容 -->
        <mawbaddput v-if="newMawbShow" @closeDialog="closeDialog" :pagetype="pagetype" :mawbguid="newMawbinfo.guid"
            :boguid="newMawbinfo.boguid" :area="newMawbinfo.area" :orderdom="newMawbinfo.orderdom"></mawbaddput>

        <!-- 生成对账单 -->
        <el-dialog width="100%" top="0" center :visible.sync="dzdMakeS" v-if="dzdMakeS" class="dialogPage"
            :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">

            <dzdMake v-if="inputModelData.guid" :dzdMakeD="dzdMakeD" @Unvisible="dzdMakeS=false" :area="area"
                :cshowInfo="cshowInfo" :Cshow="true" :mawbguid="inputModelData.guid" :boguid="inputModelData.boguid">
            </dzdMake>

        </el-dialog>

        <el-dialog title="海关联系单" v-if="lxdDialogShow" center :visible.sync="lxdDialogShow" class="dialogPage"
            :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" append-to-body>
            <confirmDetail :mawbdetail="inputModelData" :visible.sync="lxdDialogShow" :customstatus="inputModelData.customstatus"
                pagetype="2"></confirmDetail>
        </el-dialog>

    

    </div>
</template>

<script>
    /*
        操作站(ordertype 2)判断有没有分配 配舱服务(主营服务)，如果分配了才能做空运服务，否则只能做始发港服务 在空运的四个服务加判断(ordertype==2&&!getServiceGuid('OA0010','profitmode'))
    
    */
    import enterWarehouseBogn from "../templates/enterWarehouseBogn";
    import enterWarehouseNumberPut from "../templates/enterWarehouseNumberPut";
    import peihuo from "../templates/peihuo";
    import khjcnoSlot from '@/components/templates/khjcnoSlot'
    import fenpei from "./fenpei";
    import fenpeiTable from "./fenpeiTable";
    //import costmaking from "./costMaking";
    import service from "../templates/serviceItem";
    import serviceList from "./serviceList"; //服务列表组件
    import hawbDeclBack from "../templates/hawbDeclBack"; // 退关弹窗
    import hawbDeclBackCancel from "../templates/hawbDeclBackCancel"; // 退关弹窗
    import hawbDeclBackCancelOld from "../templates/hawbDeclBackCancelOld"; // 退关弹窗
    import amazon from "./amazon"; //amazon组件

    import hawbTabsOper from "./hawbTabsOper";
    import hawbTabs from '../templates/hawbCostTabs'
    import makingBill from "./makingBill"; //制单信息
    import mawbContacts from "./mawbContacts"; //总单联系人
    import flightAssignment from "./flightAssignment"; //航班配舱
    import entrustBill from "./entrustBill"; //委托单
    import costMaking from "./costMaking";
    //import costMaking1 from "./costMaking1";
    // import makeBillRevSed from "../templates/makeBillRevSed";
    import revSedMawb from "../templates/revSedMawb";
    import revSedHawb from "../templates/revSedHawb";
    import baoguanNodeBtn from "../templates/baoguanNodeBtn"; //报关节点按钮组

    /* 空出服务模块 */
    import increaseService from "./increaseService"; //延伸服务
    import increaseServiceSplit from "./increaseServiceSplit"; //延伸服务
    import storeServiceInfo from "./storeServiceInfo"; //仓库服务信息
    import takeDeliveryGoods from "./takeDeliveryGoods"; //提货服务信息
    import declareAtcustoms from "./declareAtcustoms"; //报关信息

    /* 国内服务模块 */
    import storeCompSize from "./storeCompSize"; //始发港与目的港仓库里面的件重体信息
    import takeGoodsAdd from "./takeGoodsAdd"; //联运始发港
    import takeGoodsAddMdg from "./takeGoodsAddMdg"; //联运目的港
    import declareAtcustomsAdd from "./declareAtcustomsAdd"; //报关信息 与清关信息
    import confirmDetail from "./confirmDetail"; //总分单确认
    import mergeBill from "./mergeBill";
    import sendBill from '@/components/orderDetails/sendBill'
    import pactlPut from '@/components/orderDetails/pactlPut'
    /*配置总运单*/
    import mawbConfigNew from '@/components/templates/mawbConfigNew'
    


    /*C类对账单*/
    import dzdMake from './dzdMake' //C类客户对账单

    import revSed from '@/components/templates/revSed'
    import manifastPirnt from "@/components/orderDetails/manifastPirnt"

    import airPlaneDeatil from '@/components/orderDetails/airPlaneDeatil'

    //childguid>0代表已分配
    //  100  已受理
    //   300  已分配
    //   400  已确认
    //   500 已完成

    //服务tab上的状态提示
    var myTabBadge = {
        props: {
            label: String,
            color: String,
            content: String,
            tabcode:String,
            type:{
                type:[String,Number],
                default:1
            },
            noareacode: {//true,不显示地域代码；默认显示
                type: Boolean,
                default: false
            }
        },
        computed: {
            parent() {
                // return this.$parent
            }
        },
        created() {
        },
        template: `
    <el-tooltip  :disabled="!content" placement="bottom">
         <div slot="content"><div v-html="content"></div></div>
         <div :class="[color]" class="badgeLabel" :tabcode="tabcode">
            <p :style="{transform: noareacode?'translateY(10px)':0}"  >{{label.split(',')[0]}}</p>
            <p style="font-size:12px;">{{noareacode?"&nbsp":'('+label.split(',')[1]+')'}}</p><slot></slot>
        </div>
     </el-tooltip>       
        `
    };

    //绑定按钮,bogn可以下达的才可以绑定
    var myBindBetton = {
        props: {
            code: String
        },
        computed: {
            parent() {
                //return this.$parent.$parent.$parent;
            }
        },
        template: `

        `
        // <el-button
        //                   type="primary"
        //                   @click="parent.operBinding(1,code)"
        //                   v-if="parent.ifOperSysHome&&!parent.isBognTesk&&!parent.isServiceFinish(code)"
        //                   class="pointerAll"
        //                 >手动绑定</el-button>
    };

    //服务完成按钮
    var myServiceFinishBtn = {
        props: {
            code: String,
            isdeep: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            parent() {
                if(this.isdeep){
                    return this.$parent.$parent.$parent.$parent;
                }else{
                    return this.$parent.$parent.$parent;
                }
            }
        },
        template: `
               <el-button
                      class="finishBtn"
                      :type="!parent.isServiceFinish(code)?'primary':'danger'"
                      @click="parent.openServiceFinish(code)"
                      :disabled="parent.finishBtnDisabled(code)"
                    >{{!parent.isServiceFinish(code)?'任务完成':'取消完成'}}</el-button>
        `
    };

    //服务tab完成信息
    var myServiceTitlePane = {
        props: {
            code: String,
            isdeep:{
                type:Boolean,
                default:false
            },
            inputModelData: {
                type: Object,
                default: () => {},
            },
            monitor: {
                type: [Number, String],
            }
        },
        created() {
            // console.log(this.code)
            // console.log(this.parent.newService[this.code])
        },
        computed: {
            parent() {
                if(this.isdeep){
                    return this.$parent.$parent.$parent.$parent;
                }else{
                    return this.$parent.$parent.$parent;
                }
            },
            saveDisabled() {
                let isZh = (this.inputModelData.czlx!='自货'&&this.inputModelData.czlx!='唯凯配舱'); // 不是自货 && 不是唯凯配舱

                let status = (this.inputModelData.commbillmodifystatus != '2' && this.inputModelData.dzstatus >= 300)
                || (this.inputModelData.zddrstatus!='2' || !this.inputModelData.zzg)
                || this.monitor == 2
                || !this.inputModelData.zddlcode
                || (this.inputModelData.zzyfweight == 'NaN' && isZh)
                || (this.inputModelData.zzysweight == 'NaN' && isZh)
                || (this.inputModelData.accountweightin == 'NaN' && isZh)
                || (this.inputModelData.accountweightout == 'NaN' && isZh)
                return status
            },

            cancelDisabled() {
                let status = this.inputModelData.dzstatus < 300
                || this.inputModelData.dzstatus >= 400
                || this.inputModelData.status >= 500
                || this.monitor == 2;
                return status;
            },

            editDisabled() {
                let status = this.inputModelData.dzstatus < 400
                || this.inputModelData.commbillmodifystatus == '2'
                || this.inputModelData.status >= 500
                || this.monitor == 2;
                return status;
            }
        },
        methods: {
            uploadFunc(ismanifest=false){
                //是否是manifest,如果是不传servicecode
                if(this.parent.$refs.refInfoList){
                    this.parent.$refs.refInfoList.selectTableIndex = -1;
                    this.parent.$refs.refInfoList.openDoc();
                    this.parent.$refs.refInfoList.servicecode= ismanifest?"":this.code;
                }

            },
            saveDocument() {
               this.parent.$refs.airPlaneDeatil.saveDocument('2','0');
               this.parent.getMawbdetail();
            },
             CancelDocument() {
               this.parent.$refs.airPlaneDeatil.CancelDocument();
               this.parent.getMawbdetail();
            },
             qdModify() {
               this.parent.$refs.airPlaneDeatil.qdModify();
               this.parent.getMawbdetail();
            },
        },
        template: `
        <div class="ServiceTitlePane" v-if="parent.newService[code]" style="align-items: center;">
                    <div>{{code!='OA0010'?parent.newService[code].title.split(',')[0]:'签单&制单'}}信息</div>
                    <div class="detailPaneMidinfo" style="position:relative;">
                    <div>
                        <span>状态：</span>
                        <span>{{parent.isServiceFinish(code)?'已完成':'未完成'}}</span>
                      </div>
                      <div>
                        <span>操作人：</span>
                        <span>{{parent.isServiceFinish(code,'nodeman')}}</span>
                      </div>
                      <div>
                        <span>完成时间：</span>
                        <span>{{parent.isServiceFinish(code,'nodedate') | formatDate('yyyy-MM-dd hh:mm')}}</span>
                      </div>
                      <div style="pointer-events: all;">
                        <span style="cursor:pointer" @click.stop="parent.showTextareaFunc(code)">
                          操作要求：
                          <i
                            class="el-icon-edit"
                            :style="{color:parent.newService[code].oprequest?'red':''}"
                          ></i>
                        </span>
                        <span class="yqspan" @click.stop="parent.showTextarea=code">
                            <p class="yqp" style="cursor:pointer">{{parent.newService[code].oprequest}}</p>
                              <div  v-if="parent.showTextarea==code" class="yqdiv">
                                <el-input
                                type="textarea"
                                :disabled="!parent.showFwbjBtn"
                                v-model="parent.newService[code].oprequest"
                              ></el-input>
                               <el-button size='mini'  :disabled="!parent.showFwbjBtn" @click.stop="parent.showTextarea=''">取消</el-button>
                              <el-button size='mini' type="primary"  :disabled="!parent.showFwbjBtn" @click="parent.saveServiceFunc">保存</el-button>
                              </div>
                        </span>
                      </div>
                      <div v-if="['AA0230','AA0240'].includes(code)" style="margin-right:40px">
                        <span style="color:#333">交接地：{{(parent.inputModelData.shipaceInfo&&parent.inputModelData.shipaceInfo.terminalname)||'--'}}</span>
                    </div>
                      <div v-if="code!='OA0010'">
                        <el-button type="success" @click="uploadFunc()">文档上传</el-button>
                      </div>
                      <div v-if="code =='OA0010'">
                        <el-button type="primary" @click="saveDocument" :disabled="saveDisabled">签单完成</el-button>
                        <el-button type="primary" @click="CancelDocument" :disabled="cancelDisabled">取消签单</el-button>
                        <el-button type="primary" @click="qdModify" :disabled="editDisabled">签单待修改</el-button>
                      </div>
                    </div>
                  </div>
   `
    };

    //服务tab完成信息
    var myServiceCostTable = {
        props: {
            code: String,//AA0410 AA0510  AA0610 要特殊处理
            isdeep:{//单证制作服务里面多嵌套了一层父级
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                specialCodeArr: ["AA0410", "AA0510", "AA0610", "AG0145", "AG0150"],
                paneShow: false
            };
        },
        computed: {
            parent() {
                if(this.isdeep){
                     return this.$parent.$parent.$parent.$parent;
                }else{
                    return this.$parent.$parent.$parent;
                }
            },
            newcode() {
                return this.specialCodeArr.includes(this.code) ? this.code : "OA0010";
            }
        },
        template: `
            <div  class="detail">
                <div class="detail-title" @click="paneShow=!paneShow;" style="display:flex;justify-content:space-between;height: 40px;align-items: center;" >
                    <p style="text-indent:6px;color:#0F5A8C;font-weight:700">服务费用制作</p>
                     <el-button  :icon="paneShow?'el-icon-caret-top':'el-icon-caret-bottom'">{{!paneShow?'显示服务费用制作':'隐藏服务费用制作'}}</el-button>
                </div>
                <el-collapse-transition>
                <div v-show="paneShow" class="detail-c" style="padding:10px;border-top: 1px solid #e8e8e8;">
                    <costTable
                        :wagedom="parent.serviceInfo[code].wagedom"
                        wageinout="2"
                        :orderpgid="parent.getServiceGuid(newcode,'orderpgid')"
                        :childpgid="parent.getServiceGuid(newcode,'childpgid')"
                        :serviceguid="parent.getServiceGuid(newcode)"
                        :costdata="parent.costdata"
                        :servicecode="code"
                        :mawbinfo="parent.inputModelData"
                        :ifShowConfirmBtn="parent.isBognTesk||parent.getServiceGuid(code,'bindeguid',2)"
                        :thJsxmData="code=='AA0510'?parent.thJsxmData:[]"
                        @success="parent.getMawbCost"
                        v-show="parent.pagetype!=21"
                    ></costTable>
                    <costTable
                        :wagedom="parent.serviceInfo[code].wagedom"
                        wageinout="1"
                        :orderpgid="parent.getServiceGuid(newcode,'orderpgid')"
                        :childpgid="parent.getServiceGuid(newcode,'childpgid')"
                        :serviceguid="parent.getServiceGuid(newcode)"
                        :costdata="parent.costdata"
                        :servicecode="code"
                        :mawbinfo="parent.inputModelData"
                        v-if="!parent.isBognTesk"
                        :class="{disabled:parent.ordertype==2&&parent.getServiceGuid(code,'profitmode')=='利润分配模式'&&specialCodeArr.includes(code)}"
                        :ifShowConfirmBtn="parent.isBognTesk||parent.getServiceGuid(code,'bindeguid',2)"
                        @success="parent.getMawbCost"
                    ></costTable>
                </div>
                </el-collapse-transition>
             </div>
   `
        //v-if="!parent.isBognTesk&&!parent.getServiceGuid(code,'bindeguid',2)"
        //||newcode=='AA0510'||newcode=='AB0520'

    };

    import {
        computedWeight,
        formatDate,
        getChangeRate,
        configData,
        getWtxmname,
        getWtkhname
    } from "../../api/localStorage.js";

    import {
        getServiceView,
        serviceSplit
    } from '../mixins/service'
    import {
        mergeFunc
    } from '@/components/mixins/topPageMixin'

    import { deleteTab } from '@/api/commonUtil.js'

    export default {
        name: 'mawbAddPut',
        mixins: [getServiceView(2), serviceSplit(2), mergeFunc],
        components: {
            storeServiceInfo,
            hawbTabsOper,
            hawbTabs,
            takeDeliveryGoods,
            enterWarehouseBogn,
            enterWarehouseNumberPut,
            peihuo,
            khjcnoSlot,
            declareAtcustoms,
            makingBill,
            mawbContacts,
            increaseService,
            increaseServiceSplit,
            flightAssignment,
            baoguanNodeBtn,
            fenpei,
            entrustBill,
            costMaking,
            //costMaking1,
            // makeBillRevSed,
            revSedMawb,
            revSedHawb,
            fenpeiTable,
            storeCompSize,
            takeGoodsAdd,
            takeGoodsAddMdg,
            declareAtcustomsAdd,
            serviceList,
            myTabBadge,
            confirmDetail,
            myServiceTitlePane,
            hawbDeclBack,
            hawbDeclBackCancel,
            hawbDeclBackCancelOld,
            amazon,
            mergeBill,
            myServiceCostTable,
            myBindBetton,
            myServiceFinishBtn,
            dzdMake,
            revSed,
            manifastPirnt,
            sendBill,
            pactlPut,
            mawbConfigNew,
            airPlaneDeatil,
        },
        props: {
            orderdom: {
                type: String,
                default: "总单"
            },
            mawbguid: [Number, String],
            boguid: [Number, String],
            visible: Boolean,
            pageFrom: String,
            area: "", //从外面传值避免计算属性里面无法取到
            pagetype: {
                //调用此页面的类型 1订单新增修改页面调用 2 订单受理(本站订单 外站订单) 3分配页面调用(订单待处理) 4.信控页面调用 6综合查询 8操作未完成 10,跳转到详细页 11批量导入页面 12 海关联系单 13签单申请 14客服综合查询页面 15航线综合查询 20 只读的详细页面 21外网订单查询详细页面
                type: [Number, String],
                default: 1
            },
            customstatus: {
                //海关联系单的发送状态 ，1未发送
                type: [String, Number],
                default: "未发送"
            },
            positionDocUpload:{//是否直接定位到文档上传页
                type:Boolean,
                default:false
            },

            defaultActiveName: { // 默认激活页
                type: String,
            },

            afreshRateCharge:{//是否需要刷新mingbill里面的内容
                type:Boolean,
                default:false
            },
            
            isOrderConfirm: { // 单证确认改造，如单证制作->禁用收发货
                type: Boolean,
                default: true,
            }


        },
        data() {

            return {
                name: "mawbAddPut.vue",
                showZuofei:false,//显示作废表单
                deprecateremark:'',//作废备注
                activeName: "tab1-first",
                fenpeiIndex: "-1",
                odConfirm: false, //订单确认取消确认
                oversea: false, //海外D/N制作
                assignShow: false, //分配弹框
                assignCzInfo: false, //分配信息操作站弹框
                assignCzDatalrfp: [], //分配信息操作站利润分配模式数据
                assignCzDatacoload: [], //分配信息操作站coload模式数据
                assignXsInfo: false, //分配信息销售站弹框
                assignXsDataSfg: [], //分配信息销售站数据
                jiediandata: [], //节点数据
                ifShowTeskBtn: false, //是否显示任务下达按钮
                pricefieldArr: [
                    "inwageallinprice",
                    "outwageallinprice",
                    "outwageallinprice_trans",
                    "inwageallinprice_trans",
                    "inwagecostprice",
                    "inwageallinprice_record"
                ], //单证确认详细不覆盖本页面的字段
                detailShow: {
                    pane1: false,
                    pane2: false,
                    jiedianShow: false,
                    lxrShow: false
                },
                dialogFormVisible: false, //总单服务编辑弹窗
                dialogFlightAss: false, //航班配舱弹窗
                dialogMawbConfig: false, // 总单配置弹窗
                mawbConfigConfim: false, // 取消总单配置
                hawbDeclBackVisible: false, // 退关弹窗
                qfsjDialog: false, //起飞时间
                qfsjUrl: "", //起飞时间地址
                mawbDialog: false,
                costDialog: false, //费用
                costDialog1: false, //费用
                orderCancel: false, //撤单
                tuoshuDialog: false, //唯凯托书
                jhwjDialog: false, //交货文件表格弹窗
                finishCostDialog: false, //服务完成费用弹窗
                thOperDialog: false, //提货操作信息
                mergeDialog: false, //订单合并
                showTextarea: -1, //服务里面的操作要求
                transList: [{
                    transprice: "",
                    transremark: ""
                }], //派车操作多条
                finishCostForm: {
                    gid: null,
                    addman: localStorage.usrname,
                    adddate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
                    currency: "人民币",
                    wage: null,
                    wagetype: ""
                },
                dialogMawb: "", //配置总单里面的总运单号
                putIndex: -1, //修改分单号的索引
                setHawb: "", //记录修改分单时候的分单号，然后传入分单组件，以判断是修改的哪一个
                firstLevelTab: ["出港操作"],
                shipaceInfoBackups: {}, //配舱数据备份，用于判断是否修改过配舱信息
                ifFirst: [], //用于判断是否是第一次打开tab
                ifSecond: [], //判断二级tab打开
                ifThird: ['tab1-first'], //延伸服务里面的小tab
                firstLevelIndex: 0, //一级tab选中索引
                newService: {},
                inputModelData: {},
                inputModelDataBackup: {},
                ysSmallService: {
                    AA0510: false,
                    AG0115: false,
                    AG0120: false,
                    AG0125: false,
                    AG0130: false,
                    AG0135: false,
                    AA0810: false,
                    AA0830: false,
                    AA0840: false,
                    AA0850: false,
                    AG0110: false
                }, //10个进口延伸服务是否有值，用于服务完成
                saveNumberList: [], //进仓编号数据，实际配置的进仓编号
                allkhjcnoData: [], //全部预报的进场编号
                signApplicationCanEdit: false,
                jjdArr: [],
                shipaceInfoView: {
                    terminalname: {
                        title: "始发港货站：",
                        itemStyle: {
                            width: "290px"
                        }
                    },
                    hbh: {
                        title: "实际航班号：",
                        verify: "uppercase",
                        type: 1,
                        elEvent: {
                            eventName: 'blur',
                            eventFunc: this.getQfsj,
                            params: 2
                        }
                    },
                    hbrq: {
                        title: "实际航班日期：",
                        type: 6,
                        format: "yyyy-MM-dd HH:mm",
                        elEvent: {
                            eventName: 'change',
                            eventFunc: this.getQfsj,
                            params: 2
                        },
                        hidden: () => { return this.inputModelData.shipaceInfo.qcts > 3 },
                    },
                    qfsj: {
                        title: "实际起飞时间：",
                        itemStyle: {
                            width: "290px"
                        }
                    },
                    qcts: {
                        title: "实际全程天数：",
                        type: "1",
                        verify: "integer"
                    },
                    loadingmodel: {
                        title: "配载方式：",
                        type: 3,
                        groupid: "37",
                        options: [],
                        idStyle: {
                            width: "100%"
                        },
                        itemStyle: {
                            width: "100%"
                        }
                    },
                    // shipvendor: {
                    //     title: "组板供应商：",
                    //     type: 1,
                    //     hidden:  true,
                    // },
                    shipspace: {
                        title: "板位描述：",
                        type: 1
                    },
                     splitstring: {
                        title: "分隔符：",
                        type: 1
                    },
                    pzcontent: {
                        title: "舱位内容：",
                        type: 17,
                        idStyle: {
                            width: '100%'
                        },
                        itemStyle: {
                            width: '560px'
                        },
                    }
                }, //配舱
                shipaceInfoData: {}, //配舱绑定数据
                serviceListBackups: "", //服务数据备份
                costdata: [], //总单服务费用
                increaseServiceData: [], //各个服务项目的表格数据，延伸服务表格数据
                ckJsxmData: [], //仓库
                ckJsxmDataMdg: [], //仓库
                thJsxmData: [], //提货
                thJsxmDataMdg: [], //送货
                bgJsxmData: [], //报关
                bgJsxmDataMdg: [], //清关
                weightLocking: false, //用于是否给结算项目赋值
                serviceNodeData: [], //服务节点数据
                orderFinish: false, //总单完成状态
                ckFinish: {}, //仓库 已对象形式，保存有完成时间人等
                thFinish: {}, //提货
                bgFinish: {}, //报关
                phFinish: false, //配货
                cdFinish: false, //撤单状态
                orderCancelForm: {
                    //撤单表单
                    canceltype: "",
                    cancelreason: "",
                    status: "1",
                    iswage: "",
                    boguid: this.boguid,
                    sid: this.mawbguid,
                    nodelist: [{
                        nodedate: "",
                        nodeman: "",
                        nodecode: "AO5065",
                        sid: ""
                    }]
                },
                incidentalWageIn: [], //总单应收杂费
                incidentalWageOut: [], //总单应付杂费
                ordertype: 1, //1本站 2操作站 3销售站
                finishWetWageName: "费用",
                jhHead: [
                    //交货文件表头
                    {
                        title: "地域",
                        field: "area"
                    },
                    {
                        title: "货站名称",
                        field: "terminalname"
                    },
                    {
                        title: "文件名",
                        field: "filename"
                    },
                    {
                        title: "需要的份数",
                        field: "num"
                    }
                ],
                jhTableData: [
                    //交货文件表格内容
                ],
                dialogJh: false, //交货弹窗
                jhDocUrl: "", //交货文件链接地址
                dialogPcd: false, //派车单弹窗
                signApplicationDialog: false, //签单申请
                signApplicationForm: {
                    realpiece: {
                        title: "实际件数：",
                        type: 18,
                        required: true,
                        verify: "integer"
                    },
                    realweight: {
                        title: "实际重量：",
                        type: 18,
                        verify: "fixedTwo",
                        required: true,
                    },
                    realvolume: {
                        title: "实际体积：",
                        type: 18,
                        required: true,
                        verify: "fixedThree",
                    },
                    signpiece: {
                        title: "签单件数：",
                        type: 18,
                        required: true,
                    },
                    signweight: {
                        title: "签单重量：",
                        type: 18,
                        verify: "fixedTwo",
                        required: true,
                    },
                    signvolume: {
                        title: "签单体积：",
                        type: 18,
                        required: true,
                        verify: "fixedThree",
                    },
                },
                signApplicationHead: [{
                    title: "入库类型",
                    field: "storeType"
                },
                {
                    title: "客户进仓编号",
                    field: "khjcno"
                },
                {
                    title: "预报件重体",
                    field: "ybjzt",
                    formatType: 4,
                    format: row => row.storeType != '实际入库' ? `${row.piece}/${row.weight}/${row.volume}` : '--/--/--'
                },
                {
                    title: "实际件重体",
                    field: "sjjzt",
                    formatType: 4,
                    format: row => row.storeType == '实际入库' ? `${row.piece}/${row.weight}/${row.volume}` : '--/--/--'
                },
                {
                    title: "客户确认件重体",
                    field: "customCommitjzt",
                    style: {
                        'width': '260px'
                    }
                },
                {
                    title: "入库仓库",
                    field: "storeName"
                },
                {
                    title: "分运单号",
                    field: "hawb"
                }
                ],
                signApplicationTableData: [],
                pcdUrl: "", //派车单
                kongchuCost: {}, //航线费用
                amazonUrl: "", //亚马逊iframe
                hawbList: "",
                showOrderIncompleteBtn: false, // 订单未完善页面，保存之后把本站操作和分配按钮显示出来
                operBindDialog: false, //手动绑定弹窗
                operBindView: {
                    khjcno: {
                        title: "客户进仓编号",
                        type: 1
                    },
                    pono: {
                        title: "订舱编号",
                        type: 1
                    },
                    mawb: {
                        title: "总运单号",
                        type: 1
                    }
                },
                operBindData: {}, //手动绑定相关
                operBindCode: "", //手动绑定相关
                operBindSearch: {},
                operBindTableHead: [{
                    title: "订舱编号",
                    field: "pono"
                },
                {
                    title: "客户进仓编号",
                    field: "khjcno"
                },
                {
                    title: "委托客户",
                    field: "wtkhname"
                },
                {
                    title: "所属地区",
                    field: "area"
                },
                {
                    title: "总运单号",
                    field: "mawb"
                },
                {
                    title: "分运单号",
                    field: "hawb"
                }
                ],
                operBindTableData: [],
                serviceInfo: configData(1),
                newMawbShow: false, //页头总单搜索后替换当前页面，注意新页面是嵌套在之前的详细页面内的，这是为了使页面用v-if初始化，否则手动初始页面内容存在风险
                newMawbinfo: {}, //查询的新的总单信息
                dzdMakeS: false, //打印对话框显示隐藏
                dzdMakeD: {}, //对账打印数据传
                cshowInfo: "",
                childData: {}, //切换子订单数据
                childrenList: [], //合并订单数据
                zdBasicInfo: { //制单备注信息
                    mawb: {
                        title: '总运单号：',
                        type: 18,
                        idStyle: {
                            width: "100%"
                        },
                        hidden: false
                    },
                    mawbss: {
                        title: '总运单所属：',
                        type: 18,
                        idStyle: {
                            width: "100%"
                        },
                        hidden: false
                    },
                    gysname: {
                        title: '总运单供应商：',
                        type: 18,
                        idStyle: {
                            width: "100%"
                        },
                        itemStyle: {
                            width: "100%"
                        },
                        hidden: false
                    },
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
                        },
                    },
                    zddlcode: {
                        title: '制单代理代码：',
                        type: 1,
                        disabled: false,
                        verify: "uppercase",
                        occupyRestSpace: true
                    },
                    orderdom: {
                        title: '订单类型：',
                        type: 3,
                        options: [
                            {
                                label: "总分单(货代委托)",
                                value: "总单"
                            },
                            {
                                label: "总直单(货代委托)",
                                value: "直单"
                            },
                        ],
                        idStyle: { width: '100%' },
                        itemStyle: { width: '100%' },
                        required: true
                    },
                    hawbcount: {
                        title: '分运单票数：',
                        type: 1,
                        hidden: false,
                        verify: "integer",
                        hidden: () => { return this.inputModelData.orderdom == '直单' }
                    }
                },

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
                objGysss: {},
                khqrTableHead: [
                    {
                        title: "预报进仓编号",
                        field: "khjcno",
                    },
                    {
                        title: "客户确认件/重/体",
                        field: "ybjzt",
                        formatType: 4,
                        format: row => `${row.customCommitPiece || 0}/${row.customCommitWeight || 0}/${row.customCommitVolume || 0}`
                    },
                    {
                        title: "入库类型",
                        field: "storeType",
                        formatType: 2,
                        format: x => (x == "请选择" ? "--" : x)
                    },
                ],
                khqrZiTableHead: [
                    {
                        title: "包装类型",
                        field: "packagetypename",
                    },
                    {
                        title: "件数",
                        field: "piece",
                    },
                    {
                        title: "尺寸",
                        formatType: 4,
                        format: row => `${row.longs}*${row.widths}*${row.heights}`
                    },
                    {
                        title: "体积",
                        formatType: 4,
                        format: row => (row.longs * row.widths * row.heights / 1000000 * row.piece).toFixed(3)
                    },

                ],
                showSize: true,//配单显示实际尺寸按钮
                rightTableCheckedIndex: -1,
                sjTableHead: [],//陪档实际尺寸表格 ,
                sjTableData: [],
                lxdDialogShow:false,//海关联系单弹窗
                hasServiceContent:['AA0410', 'AA0510', 'AA0610', 'AG0145', 'AG0150', 'AA0110', 'AA0120','AA0130','AA0140', 'AA0150', 'AA0160', 'AA0310', 'AA0320', 'AA0230', 'AA0240', 'AG0110', 'AG0115', "AG0120", "AG0140", "AA0810", "AA0830", "AA0840", "AA0850", "AG0125", "AG0130", "AG0135", "AB0420", "AB0520", "AB0620"], //存在服务内容的
                cgportTtabs:[
                    {label:'航线操作',tabcode:'tab1-third',show:true },
                    {label:'配货操作',tabcode:'tab1-second',show:true},
                    { label: '签单申请', tabcode: 'tab1-tenth', show: true },
                    { label: '分单信息', tabcode: 'tab1-forth', show: true , nobgcolor: true, noareacode: true},
                    {label:'单证确认',tabcode:'tab1-fifth',show:true},
                    // {label: '单证确认',tabcode: 'tab1-sixth',show: true},
                    {label: '分配信息',tabcode: 'tab1-seventh',show: true, nobgcolor: true, noareacode: true},
                    { label: 'Amazon信息', tabcode: 'tab1-eighth', show: true ,nobgcolor:true,noareacode:true},
                    { label: '单证制作', tabcode: 'tab1-dzmake', show: true },                 
                ],
                dzmaketabindex:0,
                isPaper: false, // 是否单证制作

                airModelData: {},
                airmonitor: 1,
            };
        },

        created() {

            // dialog是懒加载，而这里需要初始就加载内容
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.dialogFormVisible = false;
            });

            this.getMawbdetail().then(res => {
                // console.log(123)
                // if (this.isBognTesk) {
                //   this.changeIndex(1);
                // }
                
                this.getHawbNum(); //报关服务需要取分单号列表
          
                this.getServiceNodeData();
              
                this.getJiedianInfoFunc()
              
                if ((this.ifOperSysHome && this.serviceSelArr.length > 0) || !this.ifOperSysHome) {
                    this.getMawbCost();
                }
   
                this.watchYsService();

                // this.getQfsj(1);
                this.$watch(
                    function () {
                        return (
                            this.shipaceInfoData.hbh +
                            this.shipaceInfoData.hbrq +
                            this.shipaceInfoData.qfsj
                        );
                    },
                    function (val) {
                        if (this.ifOperSysHome) return;

                        if (!this.inputModelData.hasOwnProperty("hbrq")) {
                            this.$set(this.inputModelData, "hbrq", this.shipaceInfoData.hbrq);
                        }
                        if (!this.inputModelData.hasOwnProperty("hbh")) {
                            this.$set(this.inputModelData, "hbh", this.shipaceInfoData.hbh);
                        }
                        if (!this.inputModelData.hasOwnProperty("qfsj")) {
                            this.$set(this.inputModelData, "qfsj", this.shipaceInfoData.qfsj);
                        }
                    }, {
                    immediate: true
                }
                );

                this.$watch(
                    () => {
                        return this.allkhjcnoData
                    },
                    () => {
                        //  signApplicationCanEdit(){//签单件重体是否可编辑
                        //  对于是空出自货的PVG订单且进仓编号入库类型只要有一条是不入库或晚入库的,在点击签单申请时,弹窗可填写其签单件数、签单重量、
                        // 签单体积;如果是自货的PVG订单但进仓编号入库类型没有不入库或晚入库的，则不弹出但接口中实际件重体就是签单件重体
                        let flag = this.inputModelData.system == '空出' && this.inputModelData.area == this.conditionalAreaForBuild && this.inputModelData.czlx == '自货' && this.allkhjcnoData.filter(i => i.storeType == '不入库' || i.storeType == '晚入库').length > 0
                        // this.basicInformation.signpiece.type=flag?1:18
                        // this.basicInformation.signweight.type=flag?1:18
                        // this.basicInformation.signvolume.type=flag?1:18
                        this.signApplicationCanEdit = flag;
                        this.sjTableData = this.$refs.peihuo && this.$refs.peihuo.sjTableData || []
                        this.sjTableHead = this.$refs.peihuo && this.$refs.peihuo.sjTableHead.slice(1)
                    }
                )

                this.$watch(
                    function () {
                        return this.inputModelData.mawb;
                    },
                    function (val) {
                        if (this.ifOperSysHome) return;
                        if (val) {
                            this.basicInformation.exForm1.disabledArr = 'hwxz';
                            // if (this.pagetype == 6 && this.inputModelData.iscomboine != 1) {
                            //     this.basicInformation.sfg.disabled = true;
                            //     this.basicInformation.mdg.disabled = true;
                                //  this.basicInformation.zzg.disabled = true;
                            // }
                        } else {
                            this.basicInformation.exForm1.disabledArr = '';

                            if (this.pagetype == 6 && this.inputModelData.iscomboine != 1) {
                                this.basicInformation.sfg.disabled = false;
                                this.basicInformation.mdg.disabled = false;
                                // this.basicInformation.zzg.disabled = false;
                            }
                        }
                    }, {
                    immediate: true
                }
                );

                this.$watch(
                    function () {
                        return this.inputModelData.hbh;
                    },
                    function (val) {
                        if (this.ifOperSysHome) return;

                        if (!val) {
                            return;
                        }
                        if (val.length == 2 && this.inputModelData.aircompany) {
                            if (
                                !this.inputModelData.aircompany
                                    .split(",")
                                    .includes(val.toUpperCase())
                            ) {
                                this.$message.error("此航班号与运单所属航司不匹配！");
                                this.shipaceInfoData.hbh = "";
                                return;
                            }
                        }
                    }
                );

                this.$watch(
                    function () {
                        return this.inputModelData.yqhbh;
                    },
                    function (val) {
                        if (this.ifOperSysHome) return;

                        if (val.length == 2 && this.inputModelData.aircompany) {
                            if (
                                !this.inputModelData.aircompany
                                    .split(",")
                                    .includes(val.toUpperCase())
                            ) {
                                this.$message.error("此要求航班号与运单所属航司不匹配！");
                                this.inputModelData.yqhbh = "";
                                return;
                            }
                        }
                    }
                );

                //取总单杂费
                this.$watch(
                    function () {
                        return (
                            this.inputModelData.mawb +
                            this.inputModelData.sfg +
                            this.inputModelData.mdg +
                            this.inputModelData.hbrq
                        );
                    },
                    function () {
                        this.getAreaPrice();
                    }, {
                    immediate: true
                }
                );

                //取中转港
                this.$watch(
                    function () {
                        return (
                            this.inputModelData.sfg +
                            this.inputModelData.hbh +
                            this.inputModelData.hbrq
                        );
                    },
                    function () {
                        if ((this.inputModelData.czlx == '代操作' || !this.projectIsWecan) && !this.inputModelData.zzg) {
                            this.getZzg()
                        }
                    }, {
                    immediate: true
                }
                );

                //计算实际计重 实际计费重量
                this.$watch(
                    function () {
                        return (
                            this.inputModelData.realvolume + this.inputModelData.realweight
                        );
                    },
                    function (newVal, oldVal) {
                        if (this.ifOperSysHome) return;

                        let volume = this.inputModelData.realvolume;
                        let weight = this.inputModelData.realweight;
                        this.inputModelData.sjComWeight = computedWeight(volume, weight);
                    }, {
                    immediate: true
                }
                );
                //计算计费重量
                if (
                    !this.inputModelData.jfweight ||
                    Number(this.inputModelData.jfweight).toFixed(2) ==
                    Number(
                        computedWeight(
                            this.inputModelData.zdvolume,
                            this.inputModelData.zdweight
                        )
                    ).toFixed(2)
                ) {
                    this.$watch(
                        function () {
                            return this.inputModelData.zdvolume + this.inputModelData.zdweight;
                        },
                        function (newVal, oldVal) {
                            if (this.ifOperSysHome) return;

                            let volume = this.inputModelData.zdvolume;
                            let weight = this.inputModelData.zdweight;
                            this.inputModelData.jfweight = computedWeight(volume, weight);
                        }, {
                        immediate: true
                    }
                    );
                }

                if (
                    !this.inputModelData.accountweightin ||
                    Number(this.setAccountweightout(1)).toFixed(2) ==
                    Number(this.inputModelData.accountweightin).toFixed(2) ||
                    Number(this.inputModelData.accountweightin).toFixed(2) == "0.00"
                ) {
                    //如果相同就是没有人工修改过，仍然系统计算带出
                    this.$watch(
                        function () {
                            return (
                                this.inputModelData.jfweight +
                                this.inputModelData.zdweight +
                                this.inputModelData.zdvolume +
                                this.inputModelData.cus_real_bp_freight_in
                            );
                        },
                        function (newVal, oldVal) {
                            if (this.ifOperSysHome) return;

                            this.inputModelData.accountweightin = this.setAccountweightout(1);
                        }
                    );
                }

                if (
                    !this.inputModelData.accountweightout ||
                    Number(this.setAccountweightout(2)).toFixed(2) ==
                    Number(this.inputModelData.accountweightout).toFixed(2) ||
                    Number(this.inputModelData.accountweightout).toFixed(2) == "0.00"
                ) {
                    //如果相同就是没有人工修改过，仍然系统计算带出
                    this.$watch(
                        function () {
                            return (
                                this.inputModelData.jfweight +
                                this.inputModelData.zdweight +
                                this.inputModelData.zdvolume +
                                this.inputModelData.self_real_bp_freight_out
                            );
                        },
                        function (newVal, oldVal) {
                            if (this.ifOperSysHome) return;

                            this.inputModelData.accountweightout = this.setAccountweightout(2);
                        }
                    );
                }

                //设置应收杂费
                this.$watch(
                    function () {
                        return (
                            this.inputModelData.inwagecostprice +
                            this.inputModelData.inwageallinprice +
                            this.inputModelData.isinwageallin +
                            this.inputModelData.currency +
                            this.inputModelData.accountweightin
                        );
                    },
                    function (newval, oldval) {
                        if (this.ifOperSysHome) return;

                        if (
                            this.inputModelData.isinwageallin &&
                            this.inputModelData.currency &&
                            this.inputModelData.accountweightin
                        ) {
                            if (
                                this.inputModelData.inwageallinprice ||
                                this.inputModelData.inwagecostprice
                            ) {
                                this.setIncidentalWage(1);
                            } else {
                                this.incidentalWageIn = [];
                                this.getMawbCost(1);
                            }
                        }
                    }
                );

                //设置应付杂费
                this.$watch(
                    function () {
                        return (
                            this.inputModelData.outwageallinprice +
                            this.inputModelData.isoutwageallin +
                            this.inputModelData.currency_out +
                            this.inputModelData.accountweightout
                        );
                    },
                    function (newval, oldval) {
                        if (this.ifOperSysHome) return;

                        //外层引用没有使用v-if 导致watch里面重复执行，要使数据完全加载后执行，屏蔽之前数据没有完成加载的执行
                        if (
                            this.inputModelData.isoutwageallin &&
                            this.inputModelData.currency_out
                        ) {
                            if (
                                this.inputModelData.outwageallinprice ||
                                this.inputModelData.outwageallinprice
                            ) {
                                this.setIncidentalWage(2);
                                if (this.inputModelData.isinwageallin == 4) {
                                    //cost+模式代
                                    this.$nextTick(() => {
                                        this.setIncidentalWage(1);
                                    });
                                }
                            } else {
                                this.incidentalWageOut = [];
                                if (
                                    this.ordertype == 2 &&
                                    this.getServiceGuid("OA0010", "profitmode") == "利润分配模式"
                                ) {
                                    this.getMawbCost(3);
                                    this.incidentalWageIn = [];
                                } else {
                                    this.getMawbCost(2);
                                }
                            }
                        }
                    }
                );

            }); //获取总单详细
        },
        methods: {
            /**
             * 校验海关联系单状态 customstatus != 1
             */
            checkLxdDialogShow() {
                if (this.inputModelData.customstatus == 2 || this.inputModelData.customstatus == 5) {
                    this.$confirm('本票联系单已发送，是否确认再次发送？', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        this.lxdDialogShow=true
                    }).catch(() => {
                    });
                } else if (this.inputModelData.customstatus == 4 || this.inputModelData.customstatus == 900){
                    this.$message.error('本票联系单发送成功并可交付，无法再次发送！')
                }
                else {
                    this.lxdDialogShow=true
                }
            },

            /**
             * @desc 总单分单保存成功后，刷新状态
             */
            handleInfoSuccess() {
                this.getMawbdetail(); //刷新工单数据
                this.getServiceNodeData() // 刷新节点
            },
            /**
             * @method
             * @desc 调用删除按钮调用接口
             * @param { String } index-> 删除tab的title
             *  */ 
            removehawb(index) {
                let title=this.dzmaketabs[index].title
                let comUrl = null;
                let reqest = null
                if (title == "总单制作") {
                    comUrl = "api/ExHpoAxplineMawbDoc";
                    reqest = {
                        czman: localStorage.usrname,
                        guid: this.inputModelData.guid, 
                    }
                } else {
                    comUrl = "api/ExAxplineHawbDoc";
                    reqest = {
                        czman: localStorage.usrname,
                        guid: this.hawbTableData.filter(i => i.hawb == title)[0].guid,
                    };
                }
                deleteTab({
                    url: this.$store.state.webApi + comUrl,
                    data: reqest,
                    callback: this.getServiceNodeData
                })
                
            },
            closeCommonTabs(index){
            },
            getTitle(name) {
                let areaList = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53)

                let area = this.inputModelData.serviceList.filter(i => name!='单证制作'?i.servicecode == 'OA0010':i.servicecode == 'AA0110').length&&this.inputModelData.serviceList.filter(i => name!='单证制作'?i.servicecode == 'OA0010':i.servicecode == 'AA0110')[0]['assignarea']
                let threeCode = area ? areaList.filter(i => i.typename == area)[0]['ready06'] : '本站'
                //console.log(`${name}(${threeCode})`)
                // return `${name=='单证确认'?'收发货人确认':name},${threeCode}`
                return `${name},${threeCode}`
            },
            getKeys(key) {
                return this.iscomboineChildren ? this.inputModelData.cboinfo[key] : this.inputModelData[key]
            },
            getIscomboineChildrenJz(type) {//获取合并子订单的实际与制单计费重量
                //type 1实际 2制单
                return type == 1 ? computedWeight(
                    this.inputModelData.cboinfo.realvolume,
                    this.inputModelData.cboinfo.realweight
                ) : computedWeight(
                    this.inputModelData.cboinfo.zdvolume,
                    this.inputModelData.cboinfo.zdweight
                );
            },
            iszddlChange() {
                this.inputModelData.zddlcode = this.inputModelData.iszddl == 1 ? 'WFF/SHA' : ''
            },
            getTabsTooltip(nodenam) {
                let arr = this.jiediandata.filter(i => i.nodename == nodenam)
                if (nodenam == '已配单') {
                    return `<span style="color:#333;margin-left:30px;font-weight: normal">完成人：${this.inputModelData.pdfinishman}</span><span  style="color:#333;margin-left:20px;font-weight: normal">完成时间：${this.inputModelData.pdfinishdate}</span>`
                } else if (nodenam == '签单申请') {
                    if (this.inputModelData.applysignman && this.inputModelData.applysigndate) {
                        return `<span style="color:#333;margin-left:30px;font-weight: normal">完成人：${this.inputModelData.applysignman}</span><span  style="color:#333;margin-left:20px;font-weight: normal">完成时间：${formatDate(this.inputModelData.applysigndate, "yyyy-MM-dd hh:mm")}</span>`
                    }
                } else {

                    if (arr.length) {
                        if (arr[0].nodeman && arr[0].nodedate) {
                            return `<span style="color:#333;margin-left:30px;font-weight: normal">完成人：${arr[0].nodeman}</span><span  style="color:#333;margin-left:20px;font-weight: normal">完成时间：${arr[0].nodedate}</span>`
                        }
                    }
                }    

            },
            getPortChildren(port){//获取该服务模块下选中的服务，还要过滤到总单制单AA0110和分单制单AA0120
              let result = this.inputModelData.serviceList.filter(i=> this.newService[i.servicecode]&&((this.newService[i.servicecode].port==port&&i.servicecode!='AA0160')||(i.servicecode=='AA0160' && port=='出港配套服务'))&&i.isdel==1&&!['AA0110','AA0120'].includes(i.servicecode)).map(i=>i.servicecode);

              if (port == '出港配套服务') {
                  if (result.length>=2) {
                      let [first, second] = result
                      if (first == 'AA0160' && second == 'AA0610') {
                          result[0] = second;
                          result[1] = first;
                      }
                  }
              }
              return result;
            },
            refreshPeihuo() {
                this.getMawbdetail()
                this.$refs.peihuo && this.$refs.peihuo.getPeihuoInfo()
            },
            getJiedianInfoFunc() {
                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + "api/ExAiraxpNode",
                    params: {
                        guid: this.inputModelData.guid,
                        boguid: this.inputModelData.boguid,
                        area: this.inputModelData.area,
                        system: '系统'
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    console.log("节点信息")
                    //  console.log(JSON.stringify(results.data))
                    this.jiediandata = results.data
                })
            },
            //配单完成
            pdFinish(type) {
                this.$axios({
                    method: 'post',
                    url: this.$store.state.webApi + 'api/pd',
                    data: {
                        guid: this.inputModelData.boguid,
                        status: type,
                        czman: localStorage.usrname
                    },
                    noarea: true,
                    loading: true,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        //this.inputModelData.commbillmodifystatus = '2'
                        if (type == '1') {
                            this.inputModelData.pdfinishstatus = '100'
                            this.inputModelData.pdfinishdate = results.data.resultdic.pdfinishdate
                            this.inputModelData.pdfinishman = results.data.resultdic.pdfinishman
                        } else {
                            this.inputModelData.pdfinishstatus = '1'
                        }
                        this.$message.success(results.data.resultmessage)
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
            },
            getOutsidedom(sendData) { //获取amazon链接地址
                if (this.inputModelData.outsidedom) {
                    let host = window.location.host;
                    let api = '';
                    let data = sendData ? sendData : this.inputModelData
                    //console.log(data)
                    if (
                        host.indexOf("192.168.0.96") != -1 ||
                        host.indexOf("erp.wecanintl.com") != -1
                    ) {
                        api = host + '/poManagement'
                    } else {
                        api = '192.168.0.115/po'
                    }

                    this.amazonUrl = `http://${api}/detailPages/businessBoAmazon.html?ids=${data.boguid
                        }&realpiece=${data.realpiece}&realweight=${data.realweight
                        }&realvolume=${data.realvolume}&mawb=${data.mawb
                        }&hawb=${data.hawb}&jfweightin=${data.jfweight}&sfg=${data.sfg
                        }&mdg=${data.mdg}&hbh=${data.hbh
                        }&hbrq=${data.hbrq.substring(
                            0,
                            10
                        )}&orderno=${data.orderno
                        }&potype=0&hpoid=${data.boguid
                        }&addman=${localStorage.getItem("usrname")}`;
                }

            },

            dialogPcdClosed() {
                if (this.pcdUrl.indexOf('frmBognOutStore') >= 0) {
                    //  this.getMawbCost()
                    this.getMawbdetail()
                }
            },
            getNewMawbinfo(data) {
                //表头中搜索打开新的运单信息
                // console.log(111111111)
                //  console.log(data)
                this.newMawbShow = true;
                this.newMawbinfo = data;
                // this.inputModelData=data;
            },
            qdModify(type) {
                //type 1待修改 2待修改完成
                if (type == 1) {
                    this.$axios({
                        method: 'put',
                        url: this.$store.state.webApi + 'api/ExHpoAxplineCommbillModify',
                        data: {
                            operguid: this.inputModelData.guid
                        },
                        noarea: true,
                        loading: true,
                        tip: false
                    })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                this.inputModelData.commbillmodifystatus = '2'
                                this.$message.success(results.data.resultmessage)
                            } else {
                                this.$message.error(results.data.resultmessage)
                            }
                        })
                } else {

                    this.saveMawbInfo(6).then(res => {
                        // console.log(11111111)
                        // console.log(res)
                    })

                }

            },
            mergeSucs(flag) {
                //  console.log(flag)
                if (flag) {
                    this.getMawbdetail();
                } else {
                    this.mergeDialog = false;
                    this.$emit("update:visible", false);
                    this.$emit("success", true);
                }
            },
            badgePopoverTitle(type) {
                //状态提醒标题
                let title = "";
                let exp1 = "";
                let exp2 = "";
                //  if (this.firstLevelIndex != 0) {
                title = "服务状态说明";
                exp1 = "已受理";
                exp2 = "已完成";
                //  }

                if (this.activeName == "tab1-second") {
                    title = "配货状态说明";
                    exp2 = "已配货";
                    exp1 = "未配货";
                }
                if (this.activeName == "tab1-third") {
                    title = "配舱状态说明";
                    exp2 = "已配舱";
                    exp1 = "未配舱";
                }
                if (this.activeName == "tab1-fifth") {
                    //||this.activeName=='tab1-sixth'
                    title = "确认状态说明";
                    exp2 = "已确认";
                    exp1 = "未确认";
                }
                if (this.activeName == "tab1-ninth") {
                    title = "配单状态说明";
                    exp2 = "已配单";
                    exp1 = "未配单";
                }

                if (type == 1) {
                    return title;
                } else {
                    return type == 2 ? exp1 : exp2;
                }
                return "";
            },
            confirmDetailSucs(data) {
                //总分单确认查询后同步详细页的状态

                if (JSON.stringify(data) != JSON.stringify(this.inputModelData)) {
                    Object.keys(this.inputModelData).forEach(k => {
                        if (
                            this.inputModelData[k] != data[k] &&
                            !this.pricefieldArr.includes(k) &&
                            data.hasOwnProperty(k)
                        ) {
                            // console.log(k)
                            this.inputModelData[k] = data[k];
                            if (k == 'dzstatus') {
                                this.getJiedianInfoFunc()
                            }
                        }
                    });
                }
            },
            confirmHawbRefresh(dom) {
                ///总分单确认分单信息修改后更新另一个确认里面的分单信息
                if ( dom == 5) { //从汇总信息，总运单信息 => confirmHawbRefresh
                    this.getMawbdetail()
                } else {
                    if (dom == 2) {
                        this.$refs.danhaoConfirm && this.$refs.danhaoConfirm.getHawbList();
                        // this.$refs.danhaoConfirm && this.$refs.danhaoConfirm.getMawbDetail();
                        // // TODO: 刷新单证制作总单数据如
                        // this.getMawbdetail()
                    } else {
                        this.$refs.danzhengConfirm && this.$refs.danzhengConfirm.getHawbList();
                    }
                }
               
                this.getHawbNum(dom);
            },
            ckFunc(type, index, servicecode) {
                //出库，type 1大出库按钮 2服务里面的小出库图标
                //servicecode 服务代码
                let url = "";
                if (type == 1) {
                    url = `${this.$store.state.imgWebApi}WffProductionManagement/anonymous/frmBognOutStore.aspx?boguid=${this.boguid}&pono=${this.inputModelData.pono}&addman=${localStorage.usrname}&area=${this.inputModelData.flowarea_cltg}&dir=${this.inputModelData.flowpoint_cltg}&servicecode=${servicecode}`;
                } else {
                    let data = this.inputModelData;

                    if (servicecode == "AA0810") {
                        //材料
                        let pg = this.inputModelData.cltglist[index];
                        if (
                            !pg.materialpm ||
                            !pg.materialstd ||
                            !pg.num ||
                            !pg.wagetype ||
                            !data.flowpoint_cltg
                        ) {
                            return this.$message.error("请先完善信息！");
                        }
                        let pm = JSON.parse(localStorage.groupType).filter(
                            i => i.groupid == -10 && i.typename == pg.materialpm
                        )[0];
                        let gg = JSON.parse(localStorage.groupType).filter(
                            i =>
                                i.groupid == -20 &&
                                i.typename == pg.materialstd &&
                                i.ready02 == pm.ready02
                        )[0];
                        url = `${this.$store.state.imgWebApi}WffProductionManagement/anonymous/frmBognOutStore.aspx?boguid=${this.boguid}&pono=${this.inputModelData.pono}&pcode=${pm.ready01}&pname=${pg.materialpm}&pnameid=${pm.id}&gnameid=${gg.id}&addman=${localStorage.usrname}&area=${data.flowarea_cltg}&dir=${data.flowpoint_cltg}&num=${pg.num}&servicecode=${servicecode}`;
                    }
                }

                this.pcdUrl = url;
                this.dialogPcd = true;

            },
            taskDelivery(servicecode) {
                //任务下达,提货的下达与其他服务下达接口不同
                let url = ["AA0510"].includes(servicecode) ?
                    "api/BoAEToBoGn/YsStore" :
                    "api/BoAEToBoGn/Other";
                let json = {
                    boguid: this.boguid,
                    serviceguid: this.getServiceGuid(servicecode),
                    servicecode: servicecode,
                    sid: this.inputModelData.guid
                };

                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    loading: true,
                    tip: false,
                    nofield: true
                }).then(results => {
                    console.log(results);
                    if (results.data.resultstatus == 0) {
                        this.getServiceNodeData();
                        this.$message.success(results.data.resultmessage);
                        this.$refs[servicecode] && this.$refs[servicecode].getListInfo();
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            showCgportTab(code) {    //统一维护以下服务的显示条件     
              let flag=true;

              if(code=='tab1-third'){
                   flag=this.inputModelData.opersystem != '进口' && this.pagetype != 12 && this.inputModelData.orderdom != '分单'
               }

               if(code=='tab1-second'){
                   flag =this.inputModelData.iscomboine != 1 && this.zhuYinIsdel
               }

                // note: 签单申请
                if (code == 'tab1-tenth') {
                    //  flag =this.inputModelData.opersystem != '进口'&&this.inputModelData.czlx != '代操作' && this.inputModelData.area == this.conditionalAreaForBuild && this.pagetype != 21
                    flag = this.pagetype != 21;
                   
                }

                // note: 分单信息
                if (code == 'tab1-forth') {
                //    flag =this.area != this.conditionalAreaForBuild && this.inputModelData.orderdom == '总单' && !(this.inputModelData.iscomboine == 1 && this.ordertype == 3)                 
                    flag = false;
                }

                if (code == 'tab1-fifth') {
                     let forthStatus = this.area != this.conditionalAreaForBuild && !(this.inputModelData.iscomboine == 1 && this.ordertype == 3)

                    flag = (this.inputModelData.opersystem != '进口'&&((this.area == this.conditionalAreaForBuild) || !this.projectIsWecan && this.zhuYinIsdel) && this.pagetype != 21) || forthStatus;
                }
                if (code == 'tab1-sixth') {
                    flag =this.inputModelData.opersystem != '进口'&&(this.area == this.conditionalAreaForBuild) && this.zhuYinIsdel && this.pagetype != 21
                }

                if (code == 'tab1-seventh') {
                    flag =this.inputModelData.opersystem != '进口'&&this.pageFrom == 'order' && this.assignXsDataSfg
                }

                 if (code == 'tab1-eighth') {
                    flag =this.inputModelData.opersystem != '进口'&&(this.inputModelData.outsidedom == 'AMAZON' || this.inputModelData.outsidedom == 'GTN') && this.pagetype != 12
                }

                 if (code == 'tab1-dzmake') {             
                    flag = this.serviceSelArr.includes('AA0110') || this.serviceSelArr.includes('AA0120')
                }

                
            
                return !this.ifOperSysHome&&flag
            },
            showServiceTab(code) {
                 //切换tab显示对应的小服务
                //return  this.ifFirst.includes(this.firstLevelTab.indexOf(this.newService[code].port))
                 return false;
                 
                if(this.cgportTtabs.filter(i=>i.tabcode==code).length>0){
                    return   this.activeName == code
                }else{
                    return this.newService[code] && (this.newService[code].port == this.firstLevelTab[this.firstLevelIndex]) && this.activeName == code
                }
            },
            setTabBadgeType(code) {
                //服务tab提示状态类型

                //  100  已受理
                //   300  已分配
                //   400  已确认
                //   500 已完成



                if (code == 'tab1-second') {
                    return this.phFinish ? 'badgeGreen' : 'badgeRed'
                }


                if (code == 'tab1-third') {
                    // 航线操作 单证状态大于等于 300 状态 => 变绿
                     return  this.inputModelData.shipaceInfo.guid != -1 && this.inputModelData.dzstatus >= 300 && this.inputModelData.pcstatus > 1 ? 'badgeGreen' : 'badgeRed'
                    // if(this.inputModelData.area != this.conditionalAreaForBuild) {
                    //   return  this.inputModelData.shipaceInfo.guid != -1 && this.inputModelData.dzstatus >= 300 ? 'badgeGreen' : 'badgeRed'
                    // }else{ 
                    //   return  this.inputModelData.pcstatus < 100 && !this.inputModelData.dzstatus >= 300? 'badgeRed' : 'badgeGreen'
                    // }
                }


                if(code=='tab1-tenth'){//签单申请
                    return  this.btnJurisdic(103) ? 'badgeGreen' : 'badgeRed'
                }

                if (code == 'tab1-fifth') {
                    return this.inputModelData.mawbhawbdzstatus >= 100 ? 'badgeGreen' : 'badgeRed'
                }

                if (code == 'tab1-sixth') {
                    return (this.inputModelData.dzstatus >= 700 || this.inputModelData.status == 500) ? 'badgeGreen' : 'badgeRed'
                }
      
                 if (code == 'tab1-dzmake') {
                    return (this.serviceSelArr.includes('AA0110')?this.getServiceGuid('AA0110', "status")==500:true) && (this.serviceSelArr.includes('AA0120')?this.getServiceGuid('AA0120', "status") == 500:true) ? 'badgeGreen' : 'badgeRed'
                }

                let status = this.getServiceGuid(code, "status");
                let className = "badgeRed";
                switch (status) {
                    case 100:
                        if (
                            this.ifOperSysHome &&
                            !this.isBognTesk &&
                            !this.getServiceGuid(code, "bindeguid", 2) &&
                            this.$store.state.rwxdArr.includes(code)
                        ) {
                            className = "badgeGray";
                        } else {
                            className = "badgeRed";
                        }

                        break;
                    case 300:
                        className = "badgeYellow";
                        break;
                    case 400:
                        className = "badgeBlue";
                        break;
                    case 500:
                        className = "badgeGreen";
                        break;
                }
                return className;
            },

            computeSignApplijzt(type) {
                //type 1预报件重体 2实际件重 3 客户确认 4签单
                //入库类型如果是实际入库，实际件重体显示，预报不显示；若不为入库，实际件重体不显示，预报显示为实际的
                //客户确认件重体实际入库不显示，否则需要填写
                let ybpiece = 0,
                    ybweight = 0,
                    ybvolume = 0,
                    sjpiece = 0,
                    sjweight = 0,
                    sjvolume = 0,
                    customCommitPiece = 0,
                    customCommitWeight = 0,
                    customCommitVolume = 0;
                this.signApplicationTableData.forEach(i => {
                    if (i.storeType == '实际入库') {
                        sjpiece += Number(i.piece)
                        sjweight += Number(i.weight)
                        sjvolume += Number(i.volume)
                    } else {
                        ybpiece += Number(i.piece)
                        ybweight += Number(i.weight)
                        ybvolume += Number(i.volume)
                        customCommitPiece += Number(i.customCommitPiece)
                        customCommitWeight += Number(i.customCommitWeight)
                        customCommitVolume += Number(i.customCommitVolume)
                    }
                })

                if (type == 1) {
                    return `${ybpiece}/${ybweight.toFixed(2)}/${ybvolume.toFixed(3)}`
                }
                if (type == 2) {
                    return `${sjpiece}/${sjweight.toFixed(2)}/${sjvolume.toFixed(3)}`
                }
                if (type == 3) {
                    return `${customCommitPiece}/${customCommitWeight.toFixed(2)}/${customCommitVolume.toFixed(3)}`
                }
                if (type == 4) {
                    return `${this.inputModelData.bgpiece || (sjpiece + customCommitPiece)}/${this.inputModelData.bgweight || (sjweight + customCommitWeight).toFixed(2)}/${(sjvolume + customCommitVolume).toFixed(3)}`
                }

                return '--/--/--'

            },
            operBinding(type, code) {
                //type 1打开弹窗 2点击查询 3点击手动绑定
                if (!type) {
                    type = this.inputModelData.boaeguid < 0 ? 1 : 3;
                }
                //  alert(type)
                if (type == 1 || type == 2) {
                    if (type == 1) {
                        this.operBindTableData = [];
                        this.operBindCode = code;
                        this.operBindDialog = true;
                        this.operBindData = {};
                        this.operBindSearch = {};
                        return;
                    }

                    if (type == 2) {
                        if (
                            !this.operBindSearch.khjcno &&
                            !this.operBindSearch.pono &&
                            !this.operBindSearch.mawb
                        ) {
                            return this.$message.error("请先填写查询数据");
                        }
                    }
                    let serObj = {
                        servicecode: this.operBindCode,
                        area: this.inputModelData.area
                    };
                    if (this.inputModelData.gid&&this.inputModelData.gid != -1) {
                        serObj.gid = this.inputModelData.gid;
                    }
                    let search= Object.assign({}, this.operBindSearch, serObj);

                    let json = {
                        json: JSON.stringify({
                            where: search
                        })
                    };

                    this.$axios({
                        method: "get",
                        url: this.$store.state.webApi + "api/getGnTransport",
                        params: json,
                        loading: true,
                        tip: false,
                        nofield: true
                    }).then(results => {
                        console.log(results);
                        if (results.data.length > 0) {
                            this.operBindTableData = results.data;
                        } else {
                            this.$message.error("无查询数据！");
                        }
                    });
                }

                if (type == 3) {
                    let arr = this.operBindTableData.filter(i => i.checked);
                    if (arr.length == 0 && this.inputModelData.boaeguid < 0) {
                        this.$message.error("请先选择将绑定的数据！");
                        return;
                    }
                    //  let json={boguid:this.boguid,transguid:arr[0].guid,servicecode:this.operBindCode}
                    let json = {
                        boguid: this.inputModelData.boaeguid > 0 ?
                            this.inputModelData.boaeguid : arr[0].boguid,
                        transguid: this.boguid
                        // servicecode: this.operBindCode
                    };
                    this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/UpdateGnTransport",
                        data: json,
                        noarea: true,
                        loading: true,
                        tip: false
                    }).then(results => {
                        if (results.data.resultstatus == 0) {
                            console.log(results.data);
                            this.$message(results.data.resultmessage);
                            this.operBindDialog = false;
                            this.getMawbdetail();
                            this.getServiceNodeData();
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                }

                if (type == 4) {
                    this.$axios({
                        method: "delete",
                        url: this.$store.state.webApi + "api/DeleteGnTransport",
                        data: {
                            boguid: this.boguid
                        },
                        loading: false,
                        tip: false
                    }).then(results => {
                        if (results.data.resultstatus == 0) {
                            this.$message(results.data.resultmessage);
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                }
            },
            signApplicationFunc() {
                // if (this.inputModelData.mawb && this.inputModelData.czlx == '自货'&&this.inputModelData.ismawb_onboard_confirm!=1|| this.signApplicationCanEdit) {
                // this.zdBasicInfo.mawb.hidden = false
                // this.zdBasicInfo.mawbss.hidden = false
                // this.zdBasicInfo.gysname.hidden = false
                this.zdBasicInfo.zddlcode.required = !this.serviceSelArr.includes('AA0230')
                // this.zdBasicInfo.hawbcount.hidden=false
                // this.$set(this.inputModelData,'hawbcount', this.inputModelData.hawbcount || this.inputModelData.hawbnum)
                this.getSignApplication()
                // this.signApplicationDialog = true
                // } else {
                //     this.signBillFunc()
                // }

            },
            signApplicationSure() {
                if ((this.zdBasicInfo.zddlcode.required && !this.inputModelData.zddlcode) || !this.inputModelData.iszddl) {
                    this.$message.error('请填写制单代码和制单代理代码！');
                    return
                }
                 if(this.inputModelData.sfg=='PVG'&&!this.inputModelData.zddlcode.toLowerCase().includes('sha')&&this.inputModelData.iszddl=='2'){
                   this.$message.error('始发港为PVG的情况下制单代理代码必须含有SHA')
                   return
                }

                this.signBillFunc();
            },
            signApplicationDialogClose() {
                //签单申请中的制单代理代码与配置总运单里面的代理代码是同一个表单，需要弹窗切换状态；关闭弹窗回到制单代理代码的初始状态
                // this.zdBasicInfo.mawb.hidden = true
                // this.zdBasicInfo.mawbss.hidden = true
                // this.zdBasicInfo.gysname.hidden = true
                this.zdBasicInfo.zddlcode.required = false
                // this.zdBasicInfo.hawbcount.hidden = true
            },
            signBillFunc() {
                //签单申请与取消签单申请
                if (!this.inputModelData.yqhbh && !this.iscomboineChildren) {
                    return this.$message.error("请填写要求航班号！");
                }
                if (this.inputModelData.dzstatus == 100) {
                    this.saveMawbInfo().then(res => {
                        if (res) {
                            this.signBillApi();
                        }
                    });
                } else {
                    this.signBillApi();
                }
            },
            signBillApi() {
                let json = {
                    czman: localStorage.usrname,
                    hpoid: this.inputModelData.guid,
                    boguid: this.inputModelData.boguid
                }

                let api =
                    this.inputModelData.dzstatus == 100 ?
                        "Airline/ApplySignBill" :
                        "Airline/CancelSignBill";

                if (this.inputModelData.dzstatus == 100) {
                    let signjztTotal = this.$refs.peihuo && this.$refs.peihuo.signjztTotal.split('/')
                    console.log(signjztTotal)
                    json.signpiece = signjztTotal[0]
                    json.signweight = signjztTotal[1]
                    json.signvolume = signjztTotal[2]
                }
                json.iszddl = this.inputModelData.iszddl
                json.zddlcode = this.inputModelData.zddlcode
                json.hawbcount = this.inputModelData.hawbcount || 0

                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + api,
                    data: json,
                    noarea: true,
                    loading: true,
                    tip: false
                }).then(results => {
                    console.log(results);
                    if (results.data.resultstatus == 0) {
                        this.$message(results.data.resultmessage);
                        this.signApplicationDialog = false
                        //  if(this.inputModelData.dzstatus != 100){
                        this.getMawbdetail();
                        // } 
                        this.signApplicationDialogClose();
                    } else if (results.data.resultstatus == 99) {
                        this.$alert(results.data.resultmessage, "提示", {
                            confirmButtonText: "确定",
                            dangerouslyUseHTMLString: true,
                            callback: action => {
                                //this.getMawbdetail();
                                this.signApplicationDialogClose();
                            }
                        });
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            thOperFunc(type) {
                //type 1 派车  2取消派车
                if (type == 1) {
                    if (this.transList.filter(i => !i.transprice).length > 0) {
                        this.$message.error("请填写卡车费用！");
                        return;
                    }
                    let json = {
                        boguid: this.boguid,
                        transList: this.transList.filter(i => i.transprice)
                    };
                    this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/UpdateTransportGys",
                        data: json,
                        loading: true,
                        tip: false,
                        noarea: true
                    }).then(results => {
                        if (results.data.resultstatus == 0) {
                            console.log(results.data);
                            this.$message("操作成功！");
                            this.transList = [{
                                transprice: "",
                                transremark: ""
                            }];
                            this.thOperDialog = false;
                            this.getServiceNodeData();
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                } else {
                    this.$axios({
                        method: "delete",
                        url: this.$store.state.webApi + "api/DeleteTransportGys",
                        data: {
                            boguid: this.boguid
                        },
                        loading: false,
                        tip: false
                    }).then(results => {
                        console.log("取消派车");
                        console.log(results.data);

                        if (results.data.resultstatus == 0) {
                            this.$message("操作成功！");
                            this.getServiceNodeData();
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                }
            },

            jsxmData(type, code) {
                //type 1始发港 2目的港
                if (!this.ifOperSysHome) return [];
                let arr = [];
                let list =
                    type == 1 ?
                        this.inputModelData.declList :
                        this.inputModelData.declListMdg;
                list.forEach(i => {
                    if (i.checked) {
                        arr.push({
                            otherguid: i.sid,
                            sid: this.inputModelData.guid,
                            guid: i.guid,
                            gid: this.inputModelData.gid,
                            wtxmname: this.inputModelData.wtxmname,
                            bggys: i.bggys,
                            bggysname: i.bggysname,
                            status: i.status,
                            boguid: this.boguid,
                            orderpgid: this.getServiceGuid(
                                code || (type == 1 ? "AA0610" : "AB0620"),
                                "orderpgid"
                            ),
                            childpgid: this.getServiceGuid(
                                code || (type == 1 ? "AA0610" : "AB0620"),
                                "childpgid"
                            )
                        });
                    }
                });
                return arr;
            },
            setServiceInfo(serviceList) {
                let arr=this.hasServiceContent
                this.$refs.serviceTemp && this.$refs.serviceTemp.initFunc(serviceList);
                if (this.inputModelData.serviceList) {
                    setTimeout(() => {
                        this.firstLevelTab = this.inputModelData.opersystem == '进口' ? ["进港服务"] : ["出港操作"];
                        this.inputModelData.serviceList.forEach(i => {
                            if (i.isdel == 1 && i.servicecode != 'OA0010') {
                                let port = this.newService[i.servicecode] && this.newService[i.servicecode].port
                                if (port && !this.firstLevelTab.includes(port) && this.inputModelData.iscomboine != 1) {
                                    this.firstLevelTab.push(port)
                                }
                            }
                        })

                        if (this.firstLevelIndex >= this.firstLevelTab.length) {
                            this.firstLevelIndex = 0
                        }
                        if (this.isBognTesk) {
                            this.changeIndex(1);
                        }
                        //  this.firstLevelTab.sort()
                        // this.firstLevelTab.sort((a, b) => a - b)
                    }, 10);
                }
            },
            initAllData() {
                //初始所有数据

                this.activeName = "tab1-first";
                this.fenpeiIndex = "-1";
                this.odConfirm = false;
                this.oversea = false;
                this.assignShow = false; //分配弹框
                this.assignCzInfo = false; //分配信息操作站弹框
                this.assignCzDatalrfp = []; //分配信息操作站利润分配模式数据
                this.assignCzDatacoload = []; //分配信息操作站coload模式数据
                this.assignXsInfo = false; //分配信息销售站弹框
                this.assignXsDataSfg = []; //分配信息销售站数据
                this.jiediandata = []; //节点数据
                this.detailShow = {
                    pane1: false,
                    pane2: false,
                    jiedianShow: false,
                    lxrShow: false
                };
                this.hawbForm = {
                    hawb: "",
                    khjcno: [],
                    mdg: "",
                    ybpiece: "",
                    ybweight: "",
                    ybvolume: "",
                    realpiece: 0,
                    realweight: 0,
                    realvolume: 0
                };
                this.dialogFormVisible = false; //总单服务编辑弹窗
                this.dialogFlightAss = false; //航班配舱弹窗
                this.dialogMawbConfig = false; // 总单配置弹窗
                this.mawbConfigConfim = false; // 取消总单配置
                this.qfsjDialog = false; //起飞时间
                this.qfsjUrl = ""; //起飞时间地址
                this.mawbDialog = false;
                this.costDialog = false; //费用
                this.orderCancel = false; //撤单
                this.tuoshuDialog = false; //唯凯托书
                this.jhwjDialog = false; //交货文件表格弹窗
                this.operBindDialog = false;
                this.finishCostDialog = false; //服务完成费用弹窗
                this.showTextarea = -1; //服务里面的操作要求
                this.finishCostForm = {
                    gid: null,
                    addman: localStorage.usrname,
                    adddate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
                    currency: "人民币",
                    wage: null,
                    wagetype: ""
                };
                this.dialogMawb = ""; //配置总单里面的总运单号
                this.putIndex = -1; //修改分单号的索引
                this.setHawb = ""; //记录修改分单时候的分单号，然后传入分单组件，以判断是修改的哪一个
                this.firstLevelTab = ["出港操作"];
                this.shipaceInfoBackups = {}; //配舱数据备份，用于判断是否修改过配舱信息
                this.ifFirst = []; //用于判断是否是第一次打开tab
                this.ifSecond = []; //判断二级tab打开
                this.ifThird = ['tab1-first']; //判断三级tab打开
                this.firstLevelIndex = 0; //一级tab选中索引
                this.hawbTableData = []; //分单配置进仓编号数据
                this.saveNumberList = []; //进仓编号数据
                this.allkhjcnoData = []; //进仓编号数据
                this.signApplicationCanEdit = false;
                this.jjdArr = [];
                this.shipaceInfoData = {
                    loadingmodel: "交散"
                }; //配舱绑定数据
                this.serviceListBackups = ""; //服务数据备份
                this.costdata = []; //总单服务费用
                this.mawbConfigtableData = [
                    //配置总单表格数据
                ];
                this.increaseServiceData = []; //各个服务项目的表格数据，延伸服务表格数据
                this.ckJsxmData = []; //仓库
                this.ckJsxmDataMdg = []; //仓库
                this.thJsxmData = []; //提货
                this.thJsxmDataMdg = []; //提货
                this.bgJsxmData = []; //报关
                this.bgJsxmDataMdg = []; //报关
                this.weightLocking = false; //用于是否给结算项目赋值
                this.imgUrl = ""; //图片文档请求地址
                this.docUrl = "";
                this.serviceNodeData = []; //服务节点数据
                this.orderFinish = false; //总单完成状态
                this.ckFinish = {}; //仓库 已对象形式，保存有完成时间人等
                this.thFinish = {}; //提货
                this.bgFinish = {}; //报关
                this.phFinish = false; //配货
                this.cdFinish = false; //撤单状态

                this.orderCancelForm = {
                    //撤单表单
                    canceltype: "",
                    cancelreason: "",
                    status: "1",
                    iswage: "",
                    boguid: this.boguid,
                    sid: this.mawbguid,
                    nodelist: [{
                        nodedate: "",
                        nodeman: "",
                        nodecode: "AO5065",
                        sid: ""
                    }]
                };
                this.incidentalWageIn = []; //总单应收杂费
                this.incidentalWageOut = []; //总单应付杂费
                this.ordertype = 1; //1本站 2操作站 3销售站
                this.finishWetWageName = "费用";
                this.jhTableData = [
                    //交货文件表格内容
                ];
                this.dialogJh = false; //交货弹窗
                this.jhDocUrl = ""; //交货文件链接地址
                this.dialogPcd = false; //派车单弹窗
                this.pcdUrl = ""; //派车单
                this.kongchuCost = {}; //航线费用
                this.getMawbdetail(); //获取总单详细
                this.getHawbNum();
                this.getServiceNodeData();
                this.getMawbCost();
            },
            finishBtnDisabled(servicecode) {
                //任务完成按钮的禁用状态
                let rwxdArr = this.$store.state.rwxdArr;
                if (rwxdArr.includes(servicecode)) {
                    return (
                        typeof this.ysSmallService[servicecode] == "boolean" &&
                        !this.ysSmallService[servicecode] &&
                        this.inputModelData.opersystem == "出口"
                    );
                } else {
                    return false;
                }
            },
            allDisabled(code) {
                //判断页面状态已设置是否禁用页面内容 allDisabled
                       //信控页面 
                let flag = this.inputModelData.creditisbackstatus == 4 || this.inputModelData.creditisbackstatus == 5 || this.pagetype == 20 || this.pagetype == 21;

                if (code) { //代表服务模板
                    if(code!='航线操作'){
                       return (
                        (this.orderFinish && !this.isBognTesk) || flag
                    ); 
                   }else{
                    return (this.orderFinish ||
                        this.cdFinish ||
                        flag ) && this.inputModelData.commbillmodifystatus != 2
                   }
                    

                } else {
                    // PS 配货操作不用判断撤单完成
                    return (this.orderFinish ||
                        flag || this.inputModelData.dzstatus >= 350) && this.inputModelData.commbillmodifystatus != 2
                    // return (this.orderFinish ||
                    //     this.cdFinish ||
                    //     flag || this.inputModelData.dzstatus >= 350) && this.inputModelData.commbillmodifystatus != 2
                }
            },
            servicesDisabled(code) {
                //  控制服务面板的权限
                //  上海所有始发港和目的港的服务是否禁用
                //  其他地方看主营和具体服务是否分配出去了
                //  返回true是禁用
                //  console.log(this.inputModelData.opersystem)
                if (this.inputModelData.opersystem == "国内服务" || code == "AA0510")
                    return false;

                if (this.ordertype == 2) {
                    return false;
                }

                if (this.ordertype == 3) {
                    return this.getServiceGuid(code, "profitmode");
                }
                return false;
            },
            btnJurisdic(num, servicecode) {
                /*
                    控制按钮显示权限
                    num是按钮的编号
                    页面
                    地域
                    站点
                    订单状态
                    true 显示
                    servicecode
                  */
                // console.log(num)
                var ifshow = true;
                //受理和退回按钮，只在订单受理页面调用
                if (num == 10 || num == 20) {
                    ifshow = this.pagetype == 2;
                }
                //销售站分配按钮在本站或者销售站被分配后
                if (num == 30) {
                    // ifshow =
                    //     this.ordertype == 3 ||
                    //     (this.ordertype == 1 ? this.isDistribution : false);
                    ifshow = this.ordertype != 1
                    //  debugger;
                }
                //操作站分配按钮在操作站显示
                // if (num == 40) {
                //     ifshow = this.ordertype == 2;
                // }
                if (num == 98) {
                    ifshow = this.inputModelData.dzstatus >= 700 && this.inputModelData.commbillmodifystatus != '2' && this.inputModelData.status < 500 && this.inputModelData.czlx == '代操作';
                }

                if (num == 99) {
                    ifshow = this.inputModelData.dzstatus >= 700 && this.inputModelData.commbillmodifystatus == '2' && this.inputModelData.status < 500 && this.inputModelData.czlx == '代操作';
                }
                //签单申请
                if (num == 101) {
                    // ifshow = this.phFinish&&this.pagetype==13;
                    ifshow =
                        this.phFinish &&
                        this.inputModelData.dzstatus == 100 &&
                        this.inputModelData.czlx != "代操作" &&
                        this.inputModelData.area == this.conditionalAreaForBuild && this.inputModelData.iscomboine != 1;
                }
                //取消签单申请
                if (num == 102) {
                    ifshow =
                        this.phFinish &&
                        this.inputModelData.dzstatus == 200 &&
                        this.inputModelData.czlx != "代操作" &&
                        this.inputModelData.area == this.conditionalAreaForBuild && this.inputModelData.iscomboine != 1;
                }

                //签单申请tab绿色
                if (num == 103) {
                    ifshow =
                        this.phFinish &&
                        this.inputModelData.dzstatus >= 200 &&
                        // this.inputModelData.czlx != "代操作" &&
                        // this.inputModelData.area == this.conditionalAreaForBuild && 
                        this.inputModelData.iscomboine != 1;
                }

                //签单申请tab红色
                if (num == 104) {
                    ifshow =
                        this.phFinish &&
                        this.inputModelData.dzstatus <= 100 &&
                        this.inputModelData.czlx != "代操作" &&
                        this.inputModelData.area == this.conditionalAreaForBuild && this.inputModelData.iscomboine != 1;
                }


                if (num == 105) {
                    //bogn下达的接收与取消接收
                    ifshow = !this.orderFinish && this.isBognTesk;
                }

                // 退关按钮，签单待修改状态为 2 时显示
                if (num == 107) {
                    ifshow =
                        this.inputModelData.system === "空出" &&
                        this.inputModelData.commbillmodifystatus == 2;
                }

                // 派遣单打印
                if (num == 108 || num == 111) {
                    ifshow =
                        this.inputModelData.opersystem == "国内服务" &&
                        this.serviceSelDelGuid;
                }

                // 预付通知单
                if (num == 109) {
                    ifshow =
                        this.inputModelData.isclock > 0
                }
                //操作流转单和交货文件 除上海外显示
                if (num == 110 || num == 120) {
                    ifshow =
                        this.inputModelData.opersystem != "国内服务" &&
                        this.inputModelData.opersystem != "进口";
                }

                // if(num==111||num==110){//操作流转单
                //   ifshow=ifshow&&this.projectIsWecan
                // }

                 if (num == 115) {
                    // ifshow =  this.inputModelData.dzstatus < 700 && this.inputModelData.customstatus <= 1&& !this.bgFinish.finish;
                    ifshow =  this.inputModelData.dzstatus < 700 && !this.bgFinish.finish
                }
               

                if (num == 120) {
                    ifshow = ifshow && this.area != this.conditionalAreaForBuild && this.projectIsWecan;
                }

                if (num == 121) {
                    ifshow = this.ifOperSysHome && !this.isBognTesk;
                }

                //注意单独判断与集合判断中交叉的部分，撤单
                if (num == 130) {
                    // ifshow=!this.cdFinish&&!this.orderFinish&&!(this.pagetype==3&&this.inputModelData.islocal==1&&this.inputModelData.isreject==2)&&this.inputModelData.creditisbackstatus==4&&this.inputModelData.creditisbackstatus==5
                    ifshow = !this.cdFinish &&
                        !this.orderFinish &&
                        !this.isBognTesk &&
                        !(
                            this.inputModelData.serviceList &&
                            this.inputModelData.serviceList.find(i => i.bindeguid > 0)
                        ) && this.pagetype != 15 && !this.iscomboineChildren && !this.outsideDisabled&&!this.wffisimperfect;
                }

                if (num == 131) {
                    //编辑合并
                    ifshow =
                        this.inputModelData.iscomboine == 1 &&
                        this.inputModelData.dzstatus < 100;
                }

                if (num == 132) {
                    //转为一主一分
                    ifshow = this.pagetype == 3 && this.inputModelData.status == 150 && this.inputModelData.orderdom == '分单'
                }

                //分配至外站
                if (num == 150) {
                    ifshow = !this.orderFinish &&!this.cdFinish &&
                        // this.inputModelData.czlx != "代操作" &&
                        !(this.pagetype == 8 && this.area == this.conditionalAreaForBuild) &&
                        !(
                            this.pagetype == 3 &&
                            this.inputModelData.islocal == 1 &&
                            this.inputModelData.isreject == 2
                        ) &&
                        this.pagetype != "12" &&
                        this.pagetype != "13" &&
                        !this.isBognTesk &&
                        !(this.ifOperSysHome && this.inputModelData.boaeguid > 0) && this.inputModelData.orderdom != '分单' && this.inputModelData.groupid < 0;
                }
                if (num == 151) {
                    let service = this.inputModelData.serviceList.filter(i => i.isdel == 1)
                    ifshow = this.inputModelData.opersystem == "国内服务" && service.length == 1 && service[0].servicecode == 'AA0510' && !this.orderFinish
                }
                //本站操作
                if (num == 160) {
                    ifshow = !this.orderFinish &&
                        (this.ordertype == 3 || this.ordertype == 1) &&
                        !this.cdFinish &&
                        this.inputModelData.czlx != "代操作" &&
                        this.pagetype == 3 &&
                        !(this.area == this.conditionalAreaForBuild && this.inputModelData.islocal == 1) &&
                        this.inputModelData.islocal != 1 && this.inputModelData.orderdom != '分单';
                }
                //订单完成
                if (num == 170) {
                    if (this.area == this.conditionalAreaForBuild && !this.ifOperSysHome && this.ordertype != 3) {
                        //pcstatus==400已交接就可以点完成，bogn下达的自动完成无需显示
                        // ifshow = this.inputModelData.pcstatus == 400
                        ifshow = true
                    } else {
                        if (this.ordertype == 3) { //销售站不判断服务完成
                            ifshow = true;
                        } else {
                            ifshow =
                                (this.ckFinish.isdel == 1 ? this.ckFinish.finish : true) &&
                                (this.thFinish.isdel == 1 ? this.thFinish.finish : true) &&
                                (this.bgFinish.isdel == 1 ? this.bgFinish.finish : true) &&
                                this.isServiceAllFinish() == 0
                        }

                    }

                    ifshow = ifshow && this.pagetype != 3 && !this.isBognTesk && this.pagetype != 11 && !this.orderFinish && !this.cdFinish;
                    // if (this.pagetype == 6 && this.ordertype == 3) {
                    //   ifshow =  true;
                    // }
                }
                //取消完成
                if (num == 180) {
                    //  ifshow=this.orderFinish&&this.ordertype==3
                    ifshow =
                        this.orderFinish &&
                        this.inputModelData.status !== 1200 &&
                        !this.isBognTesk;
                }

                //结算
                if (num == 200) {
                    ifshow =
                        ((this.ckFinish.isdel == 1 ? this.ckFinish.finish : true) &&
                            (this.thFinish.isdel == 1 ? this.thFinish.finish : true) &&
                            (this.bgFinish.isdel == 1 ? this.bgFinish.finish : true)) ||
                        this.cdFinish;
                }
                //审核
                if (num == 210) {
                    ifshow =
                        (this.ckFinish.isdel == 1 ? this.ckFinish.finish : true) &&
                        (this.thFinish.isdel == 1 ? this.thFinish.finish : true) &&
                        (this.bgFinish.isdel == 1 ? this.bgFinish.finish : true);
                }
                //费用信息
                if (num == 190) {
                    ifshow =
                        this.pagetype != 3 &&
                        this.pagetype != 2 &&
                        this.pagetype != 10 &&
                        this.pagetype != 11 &&
                        !this.isBognTesk &&
                        this.pagetype != 15 &&
                        this.inputModelData.gid != -1;
                }
                //保存
                if (num == 220) {
                    //签单申请之后状态不显示按钮 >=200是不显示
                    if (this.area == this.conditionalAreaForBuild && !this.ifOperSysHome) {
                        //ifshow = this.inputModelData.dzstatus <=200;
                        ifshow = this.inputModelData.dzstatus < 700 || this.inputModelData.commbillmodifystatus == 2;
                    } else {
                        ifshow = this.inputModelData.status < 500;
                        //  ifshow = true;
                    }
                    ifshow =
                        ifshow &&
                        !this.orderFinish &&
                        !(this.isBognTesk && this.inputModelData.status == 1);
                }

                /*   if([130,150,160,170,180].includes(num)){
                  ifshow=ifshow&&this.inputModelData.wageconfirmstatus<700
                  } */
                if ([200, 210].includes(num)) {
                    ifshow =
                        ifshow &&
                        this.inputModelData.wageconfirmstatus >= 700 &&
                        !(
                            this.ordertype == 2 &&
                            this.getServiceGuid("OA0010", "profitmode") == "利润分配模式"
                        );
                }

                //集合判判显示这些操作区按钮
                if ([98, 99, 101, 102, 108, 109, 110, 111,115, 120, 131, 150, 160, 170, 180, 190, 191, 200, 210, 220].includes(num)) {
                    ifshow =
                        ifshow &&
                        this.pagetype != 2 &&
                        this.inputModelData.creditisbackstatus != 4 &&
                        this.inputModelData.creditisbackstatus != 5 &&
                        this.pagetype != 10 &&
                        this.inputModelData.status != 1 && !this.outsideDisabled&&!this.wffisimperfect;
                }

                if ([98, 99, 101, 102, 105, 108, 109, 110, 111, 115,120, 121, 130, 131, 150, 160, 170, 180, 190, 191, 200, 210, 220, 230, 240, 250, 260, 270, 280, 310, 320, 330, 340, 350, 480].includes(num)) {
                    if (this.pagetype == 20 || this.pagetype == 21) {
                        $(`button[btnnum=${num}]`).addClass('is-disabled').attr({
                            'disabled': 'disabled'
                        })
                    }
                }

                //配货完成
                if (num == 270) {
                    // ifshow = !this.phFinish&&this.ordertype!=3;        
                    ifshow = !this.phFinish && (this.inputModelData.orderdom != "分单" && this.allkhjcnoData.filter(i => !i.statusPz).length == 0);
                }

                if (num == 280) {
                    ifshow = this.phFinish;
                }
                //主营分配后禁用
                if ([320].includes(num)) {
                    //  ifshow=ifshow&&!this.getServiceGuid('OA0010','profitmode')
                    // if (this.ordertype == 1 || this.ordertype == 2) {
                    //     if (this.getServiceGuid("OA0010", "profitmode")) {
                    //         if (this.area == this.conditionalAreaForBuild) {
                    //             ifshow = ifshow && false;
                    //         } else {
                    //             ifshow = ifshow && true;
                    //         }
                    //     } else {
                    //         ifshow = ifshow && true;
                    //     }
                    // } else {
                    //     ifshow = ifshow && false;
                    // }
                    ifshow = ifshow && this.inputModelData.isshipace == 1
                }
                //任务完成
                if (
                    [
                        270,
                        280,
                        320,
                        361, //提货
                        362,
                        363,
                        364,
                        365,
                        359,
                        380,
                        390,
                        400,
                        410,
                        420,
                        422,
                        424,
                        430,
                        440,
                        441,
                        442,
                        443,
                        444,
                        445,
                        446,
                        447,
                        448,
                        449,
                        450,
                        451
                    ].includes(num)
                ) {
                    ifshow =
                        ifshow &&
                        this.pagetype != 3 &&
                        !(this.isBognTesk && this.inputModelData.status == 1);

                    if (servicecode && !this.isBognTesk && !this.ifOperSysHome) {
                        let rwxdArr = this.$store.state.rwxdArr;
                        if (rwxdArr.includes(servicecode)) {
                            //isServiceFinish(servicecode)?getServiceGuid(servicecode,'status')==500:getServiceGuid(servicecode,'status')==350
                            //  ifshow = ifshow&&typeof(this.ysSmallService[servicecode])=='boolean'&&this.ysSmallService[servicecode]&&this.inputModelData.opersystem=='出口'
                            ifshow = false;
                        } else {
                            ifshow = false;
                        }
                    }
                }

                if (num == 340) {
                    ifshow = this.pagetype != 3;
                }
                if (num == 350) {
                    ifshow = this.pagetype != 3;
                }

                if (num == 360) {
                    ifshow = this.increaseServiceData.length != 0 && this.pagetype != 3;
                }

                return ifshow;
            },
            getSignApplication() {
                let rightData = []
                let data = JSON.parse(JSON.stringify(this.allkhjcnoData))
                data.forEach(i => {
                    rightData = rightData.concat(i.realList).concat(i.autoMapRealList)
                })
                rightData.forEach(i => {
                    delete i.background
                    delete i.statusPz
                    i.ziTableHidden = i.vollist.length == 0;
                })
                this.signApplicationTableData = rightData;

                // this.$axios({
                //   method: "get",
                //   url: this.$store.state.webApi + "api/ExAxplineStoreVol",
                //   params: { hpoid: this.inputModelData.guid },
                //   loading: true,
                //   tip: false,
                //   nofield: true
                // }).then(results => {
                //   console.log(222222222);
                //   console.log(results);     
                //   // let sortarr = ['实际入库', '不入库', '晚入库']
                //   // this.signApplicationTableData = results.data.map(i => { i.sortIndex = sortarr.indexOf(i.storeType); return i }).sort((a, b) => {
                //   //   return a.sortIndex - b.sortIndex
                //   // })
                // });
            },
            peicheBill(type) {
                //1派车单 2操作流转单 3派遣单 4bogn的操作流转单
                if (type == 3) {
                    this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=BOGNtempletNEW.frx&pono=${this.inputModelData.pono}&czman=${localStorage.usrname}&multipage=false&shipaceid=-1`;
                    this.dialogPcd = true;
                } else if (type == 4) {
                    this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=BOGNtemplet.frx&guid=${this.serviceSelDelGuid}&area=${this.inputModelData.area}&shipaceid=-1`;
                    this.dialogPcd = true;
                } else {
                    var dom = type == 1 ? "派车" : "操作流转单";
                    var row = JSON.parse(localStorage.jhAddress).filter(
                        i =>
                            i.dom == dom &&
                            i.area == this.area &&
                            i.system == this.inputModelData.system
                    )[0];
                    if (row) {
                        var str = "";
                        var parmjson = row.parmjson.split(",");
                        parmjson.forEach(i => {
                            str += i + "=" + this.inputModelData[i] + "&";
                        });
                        str = str.substr(0, str.length - 1); //这是guid
                        this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=${row.templetename}&${str}`;
                        this.dialogPcd = true;
                    } else {
                        this.$message.error("无数据！");
                    }
                }
            },
            isServiceAllFinish() {
                //判断所有小服务是否已经完成
                var finish = []; //放入未完成的servicecode
                this.serviceNodeData.forEach(i => {
                    //&&i.servicecode!='YS0010'
                    if (
                        i.isdel == 1 &&
                        i.servicecode != "YS0010" &&
                        i.servicecode != "OA0000" &&
                        i.servicecode != "OA0010" &&
                        i.servicecode != "OB0020"
                    ) {
                        let n = [];
                        i.nodeList.forEach(e => {
                            if (e.nodecode.indexOf("5060") >= 0) {
                                n.push(e);
                            }
                        });
                        if (n.length == 1) {
                            if (n[0].nodedate.indexOf("1900") >= 0) {
                                finish.push(i.servicecode);
                            }
                        }
                    }
                });
                return finish.length;
            },
            setAccountweightout(type) {
                //计算结算重量
                //type  2应付结算对象  1应收结算对象
                let accountweightin = 0;
                let jftype_in = this.inputModelData.jftype_in;
                let khfenpao = 10;
                if (jftype_in == 2) {
                    accountweightin = this.inputModelData.realweight;
                } else {
                    if (type == 1) {
                        khfenpao = this.inputModelData.self_real_bp_freight_in;
                    } else {
                        khfenpao = this.inputModelData.cus_real_bp_freight_out;
                    }

                    if (this.inputModelData.czlx == "代操作") {
                        khfenpao = 0;
                    }
                    var hwjz = computedWeight(
                        this.inputModelData.realvolume,
                        this.inputModelData.realweight
                    );

                    if (
                        Number(this.inputModelData.jfweight) >= Number(hwjz) &&
                        Number(hwjz)
                    ) {
                        accountweightin = this.inputModelData.jfweight;
                    } else {
                        if (
                            this.inputModelData.jfweight &&
                            this.inputModelData.jfweight > 0
                        ) {
                            accountweightin = (
                                ((Number(hwjz) - Number(this.inputModelData.jfweight)) *
                                    Number(khfenpao)) /
                                10 +
                                Number(this.inputModelData.jfweight)
                            ).toFixed(2);
                        }
                    }

                    var wc = accountweightin - parseInt(accountweightin);
                    if (wc == 0 || wc == 0.5) {
                        accountweightin = accountweightin;
                    } else {
                        accountweightin =
                            wc > 0.5 ?
                                parseInt(accountweightin) + 1 :
                                parseInt(accountweightin) + 0.5;
                    }
                    //this.inputModelData.accountweightin=Number(accountweightin).toFixed(2)
                    accountweightin = Number(accountweightin).toFixed(2);
                }

                return accountweightin;
            },
            wageSuccess(data) { //费用确认
                if (data) {
                    this.inputModelData.wageconfirmstatus = data;
                }
            },
            initFunc() {
                //修改费用后，重新取值，重置状态
                this.getServiceNodeData();
                this.getMawbdetail(); //获取总单详细
                this.assignShow = false;
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
                        area: this.area
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
            openDialogJh(row) {
                //交货文件地址
                var str = "";
                //console.log(JSON.stringify(row));
                var parmjson = row.parmjson.split(",");
                // var parmjson=['guid']
                parmjson.forEach(i => {
                    str += i + "=" + this.inputModelData[i] + "&";
                });
                str = str.substr(0, str.length - 1); //这是guid
                this.jhDocUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=${row.templetename}&${str}`;
                this.dialogJh = true;
            },
            showTextareaFunc(index) {
                //打开服务的textarea
                this.showTextarea = this.showTextarea == index ? -1 : index;
            },
            inwageallinpriceFunc(num) {
                //计算cost+的值
                this.inputModelData.inwagecostprice = Number(
                    Number(this.inputModelData.inwagecostprice) + num
                ).toFixed(2);
            },
            openServiceFinish(servicecode) {
                if (!this.isServiceFinish(servicecode)) {
                    if (this.ifOperSysHome) {
                        if (
                            servicecode == "AG0110" &&
                            (!this.inputModelData.servicecontent_deli ||
                                !this.inputModelData.yqdate_deli)
                        ) {
                            this.$message.error("请填写快递服务的完整信息!");
                            return;
                        }
                        if (
                            servicecode == "AG0115" &&
                            (!this.inputModelData.servicecontent_inspect ||
                                !this.inputModelData.yqdate_inspect)
                        ) {
                            this.$message.error("请填写磁检服务的完整信息!");
                            return;
                        }
                        // if (
                        //   servicecode == "AG0120" &&
                        //   (!this.inputModelData.servicecontent_pack ||
                        //     !this.inputModelData.yqdate_pack ||
                        //     this.inputModelData.gbzlist.filter(
                        //       i => i.packagetype && i.packagestyle
                        //     ).length == 0)
                        // ) {
                        //   this.$message.error("请填写改包装服务的完整信息!");
                        //   return;
                        // }
                        // if (
                        //   servicecode == "AA0810" &&
                        //   (!this.inputModelData.flowpoint_cltg ||
                        //     !this.inputModelData.flowarea_cltg ||
                        //     !this.inputModelData.yqdate_cltg ||
                        //     !this.inputModelData.servicecontent_cltg ||
                        //     this.inputModelData.cltglist.filter(
                        //       i => i.materialpm && i.materialstd && i.num && i.wagetype
                        //     ).length == 0)
                        // ) {
                        //   this.$message.error("请填写材料提供服务的完整信息!");
                        //   return;
                        // }

                        if (
                            servicecode == "AA0830" &&
                            (!this.inputModelData.cranetype_tzcc ||
                                !this.inputModelData.yqdate_tzcc ||
                                !this.inputModelData.servicecontent_tzcc)
                        ) {
                            this.$message.error("请填写特种铲车服务的完整信息!");
                            return;
                        }
                        if (
                            servicecode == "AA0840" &&
                            (!this.inputModelData.servicecontent_fh ||
                                !this.inputModelData.yqdate_fh)
                        ) {
                            this.$message.error("请填写分货服务的完整信息!");
                            return;
                        }
                        if (
                            servicecode == "AA0850" &&
                            (!this.inputModelData.servicecontent_zx ||
                                !this.inputModelData.yqdate_zx)
                        ) {
                            this.$message.error("请填写装卸服务的完整信息!");
                            return;
                        }

                        if (
                            servicecode == "AG0125" &&
                            (!this.inputModelData.servicecontent_chem ||
                                !this.inputModelData.yqdate_chem)
                        ) {
                            this.$message.error("请填写化工鉴定服务的完整信息!");
                            return;
                        }
                        // if (
                        //   servicecode == "AG0130" &&
                        //   (!this.inputModelData.servicecontent_safe ||
                        //     !this.inputModelData.yqdate_safe ||
                        //     this.inputModelData.gylist.filter(i => i.clothtype && i.clothstd)
                        //       .length == 0)
                        // ) {
                        //   this.$message.error("请填写挂衣服务的完整信息!");
                        //   return;
                        // }
                        if (
                            servicecode == "AG0135" &&
                            (!this.inputModelData.servicecontent_stick ||
                                !this.inputModelData.yqdate_stick)
                        ) {
                            this.$message.error("请填写贴签服务的完整信息!");
                            return;
                        }
                    } else {
                        if (this.ysSmallService.hasOwnProperty(servicecode)) {
                            if (typeof this.ysSmallService[servicecode] == "string") {
                                this.$message.error(this.ysSmallService[servicecode]);
                                return;
                            } else {
                                if (!this.ysSmallService[servicecode]) {
                                    this.$message.error("请添加至少一条数据！");
                                    return;
                                }
                            }
                        }
                    }
                }

                //打开服务完成的弹窗
                this.finishServicecode = servicecode;

                this.finishWetWageName = this.serviceInfo[servicecode] && this.serviceInfo[servicecode].items;
                if (!this.isServiceFinish(servicecode)) {
                    this.finishCostDialog = true;
                    this.finishCostForm.adddate = formatDate(
                        new Date(),
                        "yyyy-MM-dd hh:mm"
                    );
                } else {
                    this.serviceFinishFunc();
                }
            },
            serviceFinishNeedSave() {
                //任务下达的bogn在服务完成时需要先保存
                if (this.isBognTesk || this.ifOperSysHome) {
                    this.saveMawbInfo(5).then(res => {
                        if (res) {
                            this.serviceFinishFunc(5);
                        }
                    });
                } else {
                    this.serviceFinishFunc();
                }
            },
            serviceFinishFunc(type) {
                //服务完成与取消完成，总单制单及后面的小服务
                var servicecode = this.finishServicecode;
                if (!this.isServiceFinish(servicecode)) {
                    if (!this.finishCostForm.addman) {
                        this.$message.error("请填写操作人");
                        return;
                    }
                    if (!this.finishCostForm.adddate) {
                        this.$message.error("请填写操作时间");
                        return;
                    }
                }

                var json = {
                    boguid: this.boguid,
                    area: this.area,
                    sid: this.mawbguid,
                    servicelist: [{
                        nodedate: this.finishCostForm.adddate,
                        nodeman: this.finishCostForm.addman,
                        servicecode: servicecode,
                        sid: this.getServiceGuid(servicecode)
                    }]
                };
                // if(this.$store.state.rwxdArr.includes(this.finishServicecode)){
                json.old_sendhpoid = this.inputModelData.old_sendhpoid || -1;
                json.bindeguid = this.getServiceGuid(servicecode, "bindeguid");
                // }
                let serObj = JSON.parse(localStorage.serviceData).filter(
                    i => i.servicecode == servicecode
                )[0];
                let url = "";
                if (this.isServiceFinish(servicecode)) {
                    url = serObj.unfinishapi;
                    json.servicelist = [{
                        nodedate: "",
                        nodeman: "",
                        servicecode: servicecode,
                        sid: this.getServiceGuid(servicecode)
                    }];
                } else {
                    url = serObj.finishapi;
                    // if (
                    //   (this.finishCostForm.wage && !this.finishCostForm.gid) ||
                    //   (!this.finishCostForm.wage && this.finishCostForm.gid)
                    // ) {
                    //   this.$message.error("请选择费用与供应商！");
                    //   return;
                    // }

                    if (this.finishCostForm.wage && this.finishCostForm.gid) {
                        let items = this.serviceInfo[servicecode].items;
                        let parentguid = -1;
                        let wagedom = this.serviceInfo[servicecode].wagedom;
                        let num = 1;
                        let wagetype = this.finishCostForm.wagetype || "票";
                        if (wagetype == "总运单票数") {
                            num = 1;
                        } else if (wagetype == "总运单件数") {
                            num = this.inputModelData.realpiece;
                        } else if (wagetype == "箱") {
                            num = this.inputModelData.realpiece;
                        } else if (wagetype == "票") {
                            num = 1;
                        } else if (wagetype == "计重") {
                            num = this.inputModelData.sjComWeight;
                        } else if (wagetype == "结算重量") {
                            //  num=this.inputModelData.accountweightin
                            // this.wageinout==1?this.mawbinfo.accountweightin:this.mawbinfo.accountweightout
                        } else if (wagetype == "毛重") {
                            num = this.inputModelData.realweight;
                        } else if (wagetype == "分运单票数") {
                            num = this.inputModelData.hawbnum;
                        } else if (wagetype == "报关单票数") {
                            num = this.bgJsxmData.length;
                        }

                        let orderpgid = this.getServiceGuid("OA0010", "orderpgid");
                        let gid = orderpgid > 0 ? orderpgid : this.inputModelData.gid;

                        json.wagelist = [{
                            boguid: this.boguid,
                            confirmstatus: 1,
                            changerate: getChangeRate(this.finishCostForm.currency),
                            currency: this.finishCostForm.currency,
                            czman: this.finishCostForm.addman,
                            gid: gid,
                            isfree: 1,
                            items: items,
                            num: wagetype == "结算重量" ?
                                this.inputModelData.accountweightin : num,
                            parentguid: parentguid,
                            price: this.finishCostForm.wage,
                            //  sid: this.mawbguid,
                            remark: "",
                            wagedom: wagedom,
                            wageinout: 1,
                            wagetype: wagetype
                        },
                        {
                            boguid: this.boguid,
                            confirmstatus: 1,
                            changerate: getChangeRate(this.finishCostForm.currency),
                            currency: this.finishCostForm.currency,
                            czman: this.finishCostForm.addman,
                            gid: this.finishCostForm.gid,
                            isfree: 1,
                            items: items,
                            num: wagetype == "结算重量" ?
                                this.inputModelData.accountweightout : num,
                            parentguid: parentguid,
                            price: this.finishCostForm.wage,
                            // sid: this.mawbguid,
                            remark: "",
                            wagedom: wagedom,
                            wageinout: 2,
                            wagetype: wagetype
                        }
                        ];
                        json.wagetype = 5;
                    }
                }

                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message("操作成功！");
                        this.finishCostDialog = false;
                        this.getServiceNodeData();
                        // this.getMawbCost();
                        this.finishCostForm.wage = null;
                        this.finishCostForm.gid = null;
                        this.finishCostForm.wagetype = null;
                        if (
                            this.isBognTesk &&
                            results.data.resultdic &&
                            results.data.resultdic.status
                        ) {
                            this.inputModelData.status = results.data.resultdic.status;
                        }
                        if (type == 5) {
                            this.getMawbdetail();
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            isServiceFinish(servicecode, name) {
                //服务是否完成
                //name 需要返回的字段 操作人 操作时间
                var iffinish = false;
                var str = "";
                this.serviceNodeData.forEach(e => {
                    if (e.servicecode == servicecode) {
                        e.nodeList.forEach(i => {
                            if (
                                i.nodecode.indexOf("5060") >= 0 &&
                                i.nodedate.indexOf("1900") == -1
                            ) {
                                iffinish = true;
                                if (name) {
                                    str = i[name];
                                }
                            }
                        });
                    }
                });

                return name ? str : iffinish;
            },
            getAddman() {
                return localStorage.usrname;
            },
            qfsjDialogFunc(type) {
                //起飞时间维护地址
                var sfg = this.inputModelData.sfg;
                if (type == 1) {
                    var hbh = this.inputModelData.yqhbh;
                    var hbrq = this.inputModelData.yqhbrq;
                } else {
                    var hbh = this.shipaceInfoData.hbh;
                    var hbrq = this.shipaceInfoData.hbrq;
                }

                var addman = localStorage.usrname;
                if (!hbh || !hbrq || !sfg) {
                    if (type == 1) {
                        this.$message.error("请填写要求航班号，要求航班日期，始发港！");
                        return;
                    } else {
                        this.$message.error("请填写航班号，航班日期，始发港！");
                        return;
                    }
                } else {
                    this.qfsjDialog = true;
                    this.qfsjUrl = `${this.$store.state.imgWebApi}WffBasic/basic/frmflightAdd.aspx?sid=${this.qfsjsid}&mawb=${this.inputModelData.mawb}&hbh=${hbh}&sfg=${sfg}&addman=${addman}&area=${this.area}`;
                }
            },
            //提交结算
            submit(status) {
                var submittype = this.inputModelData.orderdom == "总单" || "直单" ? 2 : 1;
                var json = {
                    submittype: submittype,
                    guid: this.boguid,
                    area: this.area,
                    status: status
                };
                ////console.log(json)
                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + "api/ExAxplineSubmit",
                    data: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log(results)
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage);
                        this.getMawbdetail(); //获取总单详细
                    } else {
                        this.$message.error("失败！" + results.data.resultmessage);
                    }
                });
            },
            tabclick(val, type) {
                //判断tab是否是初次打开

                if (type == 1) {
                    if (!this.ifSecond.includes(val.name)) {
                        this.ifSecond.push(val.name);
                    }
                    if (!this.ifThird.includes(val.name)) {
                        this.ifThird.push(val.name);
                    }
                    if (val.name == 'tab1-tenth') {
                        this.signApplicationFunc()
                    }
                } else if (type == 2) {

                    if (!this.ifThird.includes(val.name)) {
                        this.ifThird.push(val.name);
                    }
                }
                // console.log(val.name)
                // this.$refs.serviceTabs.activeName == val.name
                this.activeName =val.name

            },
            getAreaPrice() {
                //总单杂费
                if (this.inputModelData.opersystem == '国内服务') return;
                var mawb = this.inputModelData.mawb;
                var sfg = this.inputModelData.sfg;
                var mdg = this.inputModelData.mdg;
                var hbrq = this.inputModelData.hbrq;

                if (!mawb || !sfg || !mdg || !hbrq) {
                    return;
                }
                if (this.inputModelData.czlx == "代操作") {
                    return;
                }

                let json = {
                    area: this.area,
                    mawbthreecode: mawb.substr(0, 3),
                    sfg: sfg,
                    mawbmdg: mdg,
                    hbrq: hbrq
                };
                this.$axios({
                    method: "get",
                    url: this.$store.state.publicWebApi + "api/PubAirCompanyAreaPrice",
                    params: json,
                    loading: false,
                    tip: false
                }).then(results => {
                    // console.log('总单杂费信息')
                    //  console.log(JSON.stringify(results.data,null,4))

                    this.incidentalWageData = results.data;
                    if (
                        (this.inputModelData.inwageallinprice &&
                            this.inputModelData.inwageallinprice != 0) ||
                        this.inputModelData.inwagecostprice
                    ) {
                        this.setIncidentalWage(1);
                    }
                    if (this.inputModelData.outwageallinprice) {
                        this.setIncidentalWage(2);
                    }
                });
            },
            setIncidentalWage(type) {
                //设置应收应付的杂费数据
                //type 1应收 2应付
                //&&this.inputModelData.dzstatus>200
                // 销售站应付不带费用
                console.log(this.inputModelData)
                if (this.getServiceGuid("OA0010", "profitmode") == "利润分配模式") {
                    return;
                }
                if (
                    !(
                        this.inputModelData.opersystem == "出口" &&
                        this.inputModelData.opersystemdom == "空运"
                    )
                )
                    return;
                if (!this.inputModelData.mawb) {
                    return;
                }
                if (this.area == this.conditionalAreaForBuild) {
                    return;
                }

                if (this.inputModelData.wtkhname == "临时客户") {
                    return;
                }
                if (this.pagetype == 14) {
                    //客服综合查询页面不带
                    return;
                }
                // 销售站应付不带费用
                //  console.log(this.ordertype)
                //  console.log(type)
                if (this.ordertype == 3 && type == 2) {
                    return;
                }

                if (this.inputModelData.wageconfirmstatus >= 700) {
                    return;
                }

                if (
                    new Date(this.inputModelData.adddate) < new Date("2018-7-10 00:00:00")
                ) {
                    return;
                }

                var data = this.incidentalWageData;
                if (!data) {
                    return;
                }

                if (type == 1) {
                    this.incidentalWageIn = [];
                } else {
                    this.incidentalWageOut = [];
                }

                //  if(this.inputModelData.orderguid>0||(this.inputModelData.orderguid==-1&&this.inputModelData.childguid==-1)){
                if (type == 1) {
                    var inwageallinprice = this.inputModelData.inwageallinprice;
                    var isinwageallin = this.inputModelData.isinwageallin;
                } else {
                    var inwageallinprice = this.inputModelData.outwageallinprice;
                    var isinwageallin = this.inputModelData.isoutwageallin;
                }

                var priceC = Number(inwageallinprice);
                var arr = [];
                let orderpgid = this.getServiceGuid("OA0010", "orderpgid");
                // let gid=orderpgid>0?orderpgid:this.inputModelData.gid

                let account =
                    type == 1 ?
                        this.inputModelData.accountweightin :
                        this.inputModelData.accountweightout;
                // alert(account)
                let currency =
                    type == 1 ?
                        this.inputModelData.currency :
                        this.inputModelData.currency_out;
                let gid, settname;
                if (type == 1) {
                    gid =
                        this.getServiceGuid("OA0010", "orderpgid") > 0 ?
                            this.getServiceGuid("OA0010", "orderpgid") :
                            this.inputModelData.gid;
                    settname = getxmdata("wtxm").find(i => i.id == gid) && getxmdata("wtxm").find(i => i.id == gid).usr_name.split("-")[1]

                } else {
                    if (this.ordertype != 3) {
                        gid =
                            this.inputModelData.mawb && this.inputModelData.mawbgid > 0 ?
                                this.inputModelData.mawbgid :
                                "";
                    } else {
                        gid = this.getServiceGuid("OA0010", "childpgid");
                    }
                    settname =
                        getxmdata("gysxm").filter(i => i.id == gid)[0] &&
                        getxmdata("gysxm").filter(i => i.id == gid)[0].usr_name;
                }
                let yingfuCost =
                    this.$refs.incidentalRefOut &&
                    this.$refs.incidentalRefOut.tableData.filter(
                        v =>
                            (v.wagedom == "航线" || (v.wagedom == "航线" && v.yssys != 2)) &&
                            v.wageinout == 2 &&
                            v.items == "航司运费"
                    );

                if (isinwageallin == 2) {
                    account = 1;
                }

                if (isinwageallin == 4) {
                    //  alert(this.costdata.filter(v=>v.orderdom=='航线'&&v.wageinout==2).length)
                    if (yingfuCost.length > 0) {
                        // priceC=priceC+Number(yingfuCost[0].price)
                        priceC =
                            Number(this.inputModelData.inwagecostprice) +
                            Number(yingfuCost[0].price);
                    } else {
                        return;
                    }
                }

                data.forEach(i => {
                    var num = 1;
                    let itemstype = type == 1 ? i.itemstype_in : i.itemstype_out;

                    if (i.isallin == 1) {
                        if (isinwageallin == 1 && type == 2) {
                            priceC = priceC - i.price;
                        }

                        if (isinwageallin == 2 || (isinwageallin == 1 && type == 1)) {
                            return;
                        }

                        if (itemstype == "总运单票数") {
                            num = 1;
                        } else if (itemstype == "总运单件数") {
                            num = this.inputModelData.zdpiece;
                        } else if (itemstype == "票") {
                            num = 1;
                        } else if (itemstype == "计重") {
                            num = this.inputModelData.sjComWeight;
                        } else if (itemstype == "结算重量") {
                            num = account;
                        } else if (itemstype == "毛重") {
                            num = this.inputModelData.realweight;
                        } else if (itemstype == "箱") {
                            num = this.inputModelData.realpiece;
                        }
                        let wageall = num * i.price;
                        if (wageall < i.min_price) {
                            wageall = i.min_price;
                            num = Math.round(i.min_price / i.price);
                        }

                        arr.push({
                            boguid: this.boguid,
                            changerate: getChangeRate(currency),
                            currency: currency,
                            czman: localStorage.usrname,
                            gid: gid,
                            settname: settname,
                            isfree: 1,
                            items: i.items,
                            leastwageall: Number(wageall).toFixed(2),
                            num: num,
                            price: i.price,
                            //sid: this.mawbguid,
                            wageall: Number(wageall * getChangeRate(currency)).toFixed(2),
                            wagedom: this.inputModelData.area == '上海' ? "航线" : '客服',
                            wageinout: type,
                            wagetype: itemstype,
                            isallin: 1
                        });
                    }
                });

                arr.push({
                    boguid: this.boguid,
                    changerate: getChangeRate(currency),
                    currency: currency,
                    czman: localStorage.usrname,
                    gid: gid,
                    settname: settname,
                    isfree: 1,
                    items: "航司运费",
                    leastwageall: Number(account * priceC).toFixed(2),
                    num: isinwageallin == 2 ? 1 : account,
                    price: Number(priceC).toFixed(2),
                    // sid: this.mawbguid,
                    wageall: Number(account * priceC * getChangeRate(currency)).toFixed(2),
                    wagedom: this.inputModelData.area == '上海' ? "航线" : '客服',
                    wageinout: type,
                    wagetype: isinwageallin == 2 ? "票" : "结算重量",
                    isallin: 1
                });

                //  console.log('总单杂费')
                // console.log(JSON.stringify(arr,null,4))
                if (type == 1) {
                    this.incidentalWageIn = arr;
                } else {
                    this.incidentalWageOut = arr;

                    if (
                        this.ordertype == 2 &&
                        this.getServiceGuid("OA0010", "profitmode") == "利润分配模式"
                    ) {
                        this.incidentalWageIn = [];
                        this.incidentalWageIn = JSON.parse(JSON.stringify(arr)).map(e => {
                            e.wageinout = 1;
                            e.gid =
                                this.getServiceGuid("OA0010", "orderpgid") > 0 ?
                                    this.getServiceGuid("OA0010", "orderpgid") :
                                    this.inputModelData.gid;
                            e.settname = getxmdata("wtxm").filter(
                                i => i.id == e.gid
                            )[0].usr_name;
                            return e;
                        });
                    }
                }
            },
          // 分配至销售站查询
            assignXsPlation(type) {
                //type 1分配至销售站查询 2操作站
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxplineServiceSearch",
                    loading: false,
                    params: {
                        boguidlist: this.boguid
                    },
                    tip: false
                })
                    .then(results => {
                        //operservice 操作站  saleservice销售站
                        this.assignXsDataSfg = results.data
                        //this.assignXsDataSfg=[]
                        //var attachsfgShow = [];
                        //var aloneothersfgShow = [];
                        //var typenamesfg = "";
                        //var servicecodesfg = ""

                        //var attachmdgShow = [];
                        // var aloneothermdgShow = [];
                        //var typenamemdg = "";

                        // 分配显示的数据
                        // results.data.forEach(item => {
                        //     if (item.assignstatus == (type == 1 ? 1 : 0)) {
                        //         // if (item.servicetype == "Attach") {
                        //         //     typenamesfg += item.assignname + ",";
                        //         //     servicecodesfg += item.servicecode + ',';
                        //         //     attachsfgShow[0] = item;
                        //         //     attachsfgShow[0].assignname = typenamesfg.substring(
                        //         //         0,
                        //         //         typenamesfg.length - 1
                        //         //     );
                        //         //     attachsfgShow[0].servicecode = servicecodesfg.substring(
                        //         //         0,
                        //         //         typenamesfg.length - 1
                        //         //     );
                        //         // } else {

                        //         //     aloneothersfgShow.push(item);
                        //         // }
                        //         //console.log(attachsfgShow)
                        //         aloneothersfgShow.push(item);
                        //         this.assignXsDataSfg = attachsfgShow.concat(aloneothersfgShow);
                        //     }
                        // });

                        ////console.log(this.assignXsDataSfg.length)
                        //console.log(this.assignXsDataSfg.length)
                        if (this.assignXsDataSfg.operservice && this.assignXsDataSfg.operservice.length > 0 || this.assignXsDataSfg.saleservice && this.assignXsDataSfg.saleservice.length > 0) {
                            this.assignCzInfo = true;
                            // if (type == 1) {
                            //     this.assignXsInfo = true;
                            // } else {
                            //     this.assignCzInfo = true;
                            // }
                        } else {
                            this.$message.error("无分配信息");
                        }
                    })
                    .catch(errors => { });
            },
            closeDialog() {
                //关闭弹窗
                //  console.log(this.visible)
                //  console.log(this.newMawbShow)
                //  if (this.visible) {
                this.$emit("update:visible", false);
                this.$emit("closeDialog", true);
                this.$store.state.mainSearch = false;
                sessionStorage.removeItem("mawbRestaurants"); //清除页头的总单搜索
                // }

            },
            relieveMawbConfig() {
                //点击解除总运单
                if (!this.inputModelData.mawb) {
                    this.$message.error("请先配置总运单号");
                    return;
                }
                this.mawbConfigConfim = true;
            },
            choiseDialogMawb(row) {
                //选择总单配置弹窗里面总运单，获取当行数据
                this.dialogMawb = row.mawb;
                this.objGysss = row;
            },
            mawbConfigFunc(type, status) {
                //配置总运单
                //type 1配置总运单 2解除总运单
                var mawb = "";
                var objGysss=''
                var url = "";

                if (type == 1) {
                    url = "api/ExHpoAxplineSureMawb";
                    //mawb = this.dialogMawb;
                    mawb = this.$refs.mawbConfig.dialogMawb;
                    objGysss=this.$refs.mawbConfig.objGysss;
                    if(!objGysss.iszddl||!objGysss.zddlcode){
                       return this.$message.error('请选择制单代码并填写制单代理代码！') 
                    }
                    // if (!this.objGysss.iszddl || !this.objGysss.zddlcode) {
                    //     return this.$message.error('请选择制单代码并填写制单代理代码！')
                    // }
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
                    area: this.area,
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
                     if(status=='5'){
                      json.deprecateremark=this.deprecateremark
                    }
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
                            this.inputModelData.mawb=mawb
                            this.inputModelData.iszddl=objGysss&&objGysss.iszddl
                            this.inputModelData.zddlcode=objGysss&&objGysss.zddlcode
                            this.inputModelData.gysname=objGysss&&objGysss.gysname
                            this.inputModelData.mawbss=objGysss&&objGysss.mawbss
                            this.inputModelData.mawbgid = objGysss&&objGysss.gysid; // 解决配置总运单 => 无mawbgid
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
                            this.getMawbCost(3); //解除总运单后删除带出的运费杂费

                            if(status=='5'){
                              this.showZuofei=false 
                              this.deprecateremark=''
                            } 
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            initHawbForm() {
                //重置分单配置进仓编号的表单
                this.putIndex = -1;
                this.hawbForm = {
                    hawb: "",
                    khjcno: [],
                    mdg: this.inputModelData.mdg,
                    ybpiece: "",
                    ybweight: "",
                    ybvolume: "",
                    realpiece: 0,
                    realweight: 0,
                    realvolume: 0
                };
            },
            hawbChange(val) {
                //分单切换
                this.hawbTableData.forEach((item, index) => {
                    if (item.hawb == val) {
                        this.setHawbForm(index);
                    }
                });
            },
            hawbBlur(ev) {
                // this.changeSelect(ev.target.value)
                this.hawbForm.hawb = ev.target.value;
            },
            getServiceNodeData() {
                //获取服务节点
                //  if(this.ifOperSysHome) return

                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxplineServiceNode",
                    params: {
                        boguid: this.boguid
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    /*     console.log('服务')
                    console.log(results.data);
                    console.log(JSON.stringify(results.data)); */
                    this.serviceNodeData = JSON.parse(JSON.stringify(results.data));

                    results.data.forEach(i => {
                        //  if (i.servicecode == (this.ifOperSysHome||this.ifOperSysImport ? "OA0000" : "OA0010")) {
                        if (i.servicecode == "OA0000") {
                            i.nodeList.forEach(e => {
                                if (e.nodecode == "AO5060") {
                                    //总单完成
                                    if (e.nodedate.indexOf("1900") >= 0) {
                                        this.orderFinish = false;
                                    } else {
                                        this.orderFinish = true;
                                    }
                                }
                                if (e.nodecode == "AO5065") {
                                    //总单撤单
                                    if (e.nodedate.indexOf("1900") >= 0) {
                                        this.cdFinish = false;
                                    } else {
                                        this.cdFinish = true;
                                    }
                                }
                            });
                        }
                        //始发港仓库
                        if (i.servicecode == "AA0410" || i.servicecode == "AG0145") {
                            i.nodeList.forEach(e => {
                                if (e.nodecode == "PB5060") {
                                    this.ckFinish = e;
                                    this.ckFinish.isdel = i.isdel;
                                    if (e.nodedate.indexOf("1900") >= 0) {
                                        this.ckFinish.finish = false;
                                    } else {
                                        this.ckFinish.finish = true;
                                    }
                                }
                            });
                        }

                        if (i.servicecode == "AA0510") {
                            i.nodeList.forEach(e => {
                                if (e.nodecode == "PB5060") {
                                    this.thFinish = e;
                                    this.thFinish.isdel = i.isdel;
                                    if (e.nodedate.indexOf("1900") >= 0) {
                                        this.thFinish.finish = false;
                                    } else {
                                        this.thFinish.finish = true;
                                    }
                                }
                            });
                        }
                        if (i.servicecode == "AA0610" || i.servicecode == "AG0150") {
                            i.nodeList.forEach(e => {
                                if (e.nodecode == "PB5060") {
                                    this.bgFinish = e;
                                    this.bgFinish.isdel = i.isdel;
                                    if (e.nodedate.indexOf("1900") >= 0) {
                                        this.bgFinish.finish = false;
                                    } else {
                                        this.bgFinish.finish = true;
                                    }
                                }
                            });
                        }
                    });
                });
            },
            async getMawbdetail() {
                //获取总单详细信息
                let json = {
                    boguid: this.boguid
                };
                this.signApplicationDialog = false;

                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxpline",
                    params: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    if (!results.data) {
                        return this.$message.error("查询错误，无详细信息！");
                    }
                    console.log("总单详细");
                    console.log(JSON.stringify(results.data));
                    let data = results.data;
                    //设置数据
                    if (data.orderguid == -1 && data.childguid == -1) {
                        this.ordertype = 1;
                    }
                    if (data.orderguid > 0 && data.childguid > 0) {
                        this.ordertype = 2; //操作站1，分配过
                    }
                    if (data.orderguid > 0 && data.childguid == -1) {
                        this.ordertype = 4; //操作站2，未分配
                    }

                    if (data.childguid > 0 && data.orderguid == -1) {
                        this.ordertype = 3; //销售站
                    }
                    data.ordertype = this.ordertype;
                    data.pagetype = this.pagetype;

                    data.serviceList = data.serviceList.filter(i => {
                        if (data.opersystem == "国内服务") {
                            return i.servicecode != "OA0010" && i.servicecode != "YS0010";
                        } else {
                            return i.servicecode != "YS0010";
                        }
                    });
                    if(this.inputModelData.mawb&&this.inputModelData.system=='空出')
                    data.airCompanyName=JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==data.mawb.split('-')[0])[0]['CName']
                    this.serviceListBackups = [...data.serviceList];
                    // if(data.orderdom&&data.orderdom!='分单'&&(data.orderdom!=this.orderdom)){//如果详细里面改了orderdom,就和外面列表打开时不同了
                    //   this.$emit('orderdom',data.orderdom)
                    // }
                    data.wtkhname = data.wtkhname || getWtkhname(data.fid)
                    data.wtxmname = data.wtxmname || getWtxmname(data.gid)
                    if(data.zdweight){
                        this.$nextTick(()=>{
                         this.basicInformation.bgweight.disabled=true
                        })
                       
                    }
                    console.log(data.wtkhname)
                    console.log(data.wtxmname)
                    console.log(data.gid)
                    if (data.opersystem == "国内服务") {
                        data.hbrq = formatDate(data.hbrq, "yyyy-MM-dd");
                        let dateArr = [
                            'yjjcdate_org', 'pickupdate_org', 'pickupdate_mdg', 'finishdate_org', 'finishdate_mdg', 'yqfinishdate_org', 'yqfinishdate_mdg', 'yjjcdate_mdg', 'yqdate_deli', 'yqdate_inspect',
                            'yqdate_pack', 'yqdate_tzcc', 'yqdate_cltg', 'yqdate_fh', 'yqdate_zx', 'yqdate_wkjd', 'yqdate_wkaj', 'yqdate_chem', 'yqdate_safe', 'yqdate_stick'
                        ]

                        dateArr.forEach(i => {
                            data[i] = formatDate(data[i], "yyyy-MM-dd hh:mm");
                        })

                        data.gylist =
                            data.gylist && data.gylist.length > 0 ?
                                data.gylist : [{
                                    clothtype: "",
                                    clothstd: "",
                                    servicecode: 'AG0130'
                                }];

                        data.gylistpm =
                            data.gylistpm && data.gylistpm.length > 0 ?
                                data.gylistpm : [{
                                    materialpm: "",
                                    materialstd: "",
                                    num: "",
                                    wagetype: "",
                                    servicecode: 'AG0130',
                                    costwage: '',
                                    saleswage: ''
                                }];

                        data.gbzlist =
                            data.gbzlist && data.gbzlist.length > 0 ?
                                data.gbzlist : [{
                                    packagetype: "",
                                    packagestyle: "",
                                    servicecode: 'AG0120'
                                }]

                        data.gbzlistpm =
                            data.gbzlistpm && data.gbzlistpm.length > 0 ?
                                data.gbzlistpm : [{
                                    materialpm: "",
                                    materialstd: "",
                                    num: "",
                                    wagetype: "",
                                    servicecode: 'AG0120',
                                    costwage: '',
                                    saleswage: ''
                                }];

                        data.cltglist =
                            data.cltglist && data.cltglist.length > 0 ?
                                data.cltglist : [{
                                    materialpm: "",
                                    materialstd: "",
                                    num: "",
                                    wagetype: "",
                                    servicecode: 'AA0810',
                                    costwage: '',
                                    saleswage: ''
                                }];

                        this.shipaceInfoData = {
                            guid: -1,
                            loadingmodel: "交散"
                        };

                        this.inputModelData = data;
                        this.inputModelDataBackup = JSON.parse(
                            JSON.stringify(data)
                        );

                        this.getJsxmData([], 2);
                        this.getJsxmData([], 3);
                        this.getJsxmData(this.inputModelData.declList, 4);
                        this.firstLevelIndex=1
                        console.log(this.inputModelData.gid)
                    } else {
                        data.smallpiece = Number(data.smallpiece || 0) || ''
                        data.bgweight = Number(data.bgweight) || ''
                        data.bgpiece = Number(data.bgpiece) || ''
                        data.yqqcts = Number(data.yqqcts) || ''
                        
                        this.pricefieldArr.forEach(i => {
                            data[i] = !data[i] || data[i] == 666666 ? "" : String(data[i]);
                        });

                        data.yqhbrq = formatDate(data.yqhbrq, "yyyy-MM-dd hh:mm");
                        data.deliverydate = formatDate(data.deliverydate, "yyyy-MM-dd hh:mm");

                        if (data.orderdom == "直单") {
                            if(data.bgweight&&data.bgweight!=0){
                              data.zdweight=data.zdweight&&data.zdweight!=0?data.zdweight:data.bgweight&&Number(data.bgweight).toFixed(2)
                            }else{
                              data.zdweight =data.zdweight&&data.zdweight!=0?data.zdweight:data.realweight && Number(data.realweight).toFixed(2)
                            }
                             data.zdvolume =
                                data.zdvolume ||
                                (data.realvolume && Number(data.realvolume).toFixed(2));

                        }
                        if (data.opersystem == "进口") {
                            data.qfsj = formatDate(data.qfsj, "yyyy-MM-dd hh:mm");
                            data.yjqfsj = formatDate(data.yjqfsj, "yyyy-MM-dd hh:mm");
                        }

                        this.inputModelData = data;

                        if (data.opersystem == "出口") {
                            this.shipaceInfoData = data.shipaceInfo;
                            this.shipaceInfoData.loadingmodel =
                                data.shipaceInfo.loadingmodel || "交散";
                            this.shipaceInfoData.hbrq =
                                this.shipaceInfoData.hbrq.indexOf("1900") >= 0 ?
                                    data.yqhbrq :
                                    this.shipaceInfoData.hbrq;
                            this.shipaceInfoData.qfsj = !this.shipaceInfoData.qfsj ||
                                this.shipaceInfoData.qfsj.indexOf("1900") >= 0 ||
                                this.shipaceInfoData.qfsj.indexOf("0001") >= 0 ?
                                formatDate(results.data.yjqfsj, "yyyy-MM-dd hh:mm") :
                                this.shipaceInfoData.qfsj;
                            this.shipaceInfoData.hbh = this.shipaceInfoData.hbh || data.yqhbh;
                            this.shipaceInfoData.qcts =
                                this.shipaceInfoData.qcts || data.yqqcts;

                            this.shipaceInfoData.splitstring =
                                this.shipaceInfoData.splitstring || data.splitstring;

                             this.shipaceInfoData.pzcontent =
                                this.shipaceInfoData.pzcontent || data.pzcontent;

                                
                            this.shipaceInfoBackups = {
                                ...this.shipaceInfoData
                            };
                            this.inputModelData.oldshipaceid = data.shipaceid;
                        } else {
                            this.shipaceInfoData = {
                                guid: -1
                            };
                            this.inputModelData.shipaceInfo = {
                                guid: -1,
                                hbh: data.hbh,
                                hbrq: data.hbrq,
                                qfsj: data.qfsj,
                                qcts: data.qcts
                            };
                        }

                        if (!this.inputModelData.hasOwnProperty("hbrq")) {
                            this.$set(this.inputModelData, "hbrq", this.shipaceInfoData.hbrq);
                        }
                        if (!this.inputModelData.hasOwnProperty("hbh")) {
                            this.$set(this.inputModelData, "hbh", this.shipaceInfoData.hbh);
                        }
                        if (!this.inputModelData.hasOwnProperty("qfsj")) {
                            this.$set(this.inputModelData, "qfsj", this.shipaceInfoData.qfsj);
                        }

                        this.inputModelData.czlx = data.opersystem == "出口" ? data.czlx : "";
                        // this.inputModelData.wtxmname =
                        //   data.wtxmname && data.wtxmname.split("-")[0];
                        this.inputModelData.zdpiece = data.realpiece;
                        this.inputModelData.sjComWeight = computedWeight(
                            this.inputModelData.realvolume,
                            this.inputModelData.realweight
                        );

                        this.jhTableData = JSON.parse(localStorage.jhAddress).filter(
                            i =>
                                i.area == data.area &&
                                i.system == data.system &&
                                i.dom == "交货"
                        );
                        if (
                            this.ordertype == 3 &&
                            this.getServiceGuid("OA0010", "profitmode") == "利润分配模式"
                        ) {
                            this.inputModelData.outwageallinprice = "";
                            this.getMawbCost(2);
                        }
                        this.$set(this.inputModelData, 'hawbcount', this.inputModelData.hawbcount || this.inputModelData.hawbnum)

                    }

                    this.hbInfoChanged = `${data.sfg}${data.mdg}${data.yqhbh}${data.yqhbrq}${data.hwxz}${data.hwlx}`
                    this.phFinish = this.inputModelData.hwstatus >= 400;
                    
                    this.setServiceInfo(data.serviceList);
 
                    this.getOutsidedom();

                    this.getJjdFunc();

                    //控制表单显示
                    this.controlFormDisplay()
                    //console.log(this.inputModelData.iscomboine)
                    if (this.inputModelData.iscomboine == 1) { //合并订单查询子订单
                        this.childrenDetail()
                    }
                    console.log(this.inputModelData.gid)
                    console.log(this.inputModelData)
                });
                console.log(this.inputModelData.gid)
                return this.inputModelData
            },
            //合并子订单LIST
            childrenDetail() {
                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxpline',
                    params: {
                        groupid: this.boguid
                    },
                    loading: true,
                    tip: false
                })
                    .then(results => {
                        results.data.forEach(i => {
                            this.childrenList.push(i)
                        })

                        this.childData = this.childrenList[0]
                        //console.log(this.childData)
                    })
                    .catch(error => {

                    })
            },
            togglehawbN(data) {
                this.childData = data
                this.getOutsidedom(data);
            },
            controlFormDisplay() { //控制表单字段显示

                if (this.inputModelData.opersystem == '国内服务') {
                    this.$nextTick(() => {
                        this.gnFieldDisplay()
                    })
                } else {

                    let dzarr = [
                        "sfg",
                        "mdg",
                        'zzg',
                        "ybpiece",
                        "ybweight",
                        "ybvolume",
                        'bgweight',
                        'bgpiece'
                    ];

                    if ( this.inputModelData.dzstatus >= 300 && this.inputModelData.commbillmodifystatus != 2) {
                        dzarr.forEach(i => {
                            this.basicInformation[i].disabled = true;
                        })
                    } else {
                        dzarr.forEach(i => {
                            this.basicInformation[i].disabled = false;
                        })
                    }

                    if (this.inputModelData.opersystem == "出口") {
                        let arr = [
                            // "sfg",
                            //  "mdg",
                            "ybpiece",
                            "ybweight",
                            "ybvolume",
                            "paymode",
                            "tradeterm",
                            "yqhbh",
                            "yqhbrq"
                        ];
                        if (this.inputModelData.shipaceInfo.guid != -1) {
                            arr.forEach(i => {
                                this.basicInformation[i].disabled = true;
                            });

                            this.basicInformation.exForm1.disabledArr = 'hwxz';

                            $(".hawbTabs")
                                .find("#tradeterm")
                                .removeClass("disabled");
                        } else {
                            this.basicInformation.exForm1.disabledArr = '';

                            arr.forEach(i => {
                                this.basicInformation[i].disabled = false;
                            });
                        }
                    }

                    let jkArr = [
                        "yqhbh",
                        "yqhbrq",
                        "yjqfsj",
                        "yqqcts",
                        "zdpiece",
                        "zdweight",
                        "zdvolume",
                        "jfweight",
                    ];
                    if (this.inputModelData.opersystem == "进口") {
                        this.basicInformation.hbh.type = 1;
                        this.basicInformation.hbrq.type = 6;
                        this.basicInformation.qcts.type = 1;
                        jkArr.forEach(i => {
                            this.basicInformation[i].hidden = true;
                        });
                        this.basicInformation.mawb.idStyle = {
                            width: "560px"
                        };
                    } else {
                        if (this.serviceSelArr.includes("AA0410") || this.serviceSelArr.includes("AG0145")) {
                            this.basicInformation.yjstorename.required = true;
                        }
                        this.basicInformation.hbh.type = "";
                        this.basicInformation.hbrq.type = "";
                        this.basicInformation.qcts.type = "";
                        jkArr.forEach(i => {
                            this.basicInformation[i].hidden = false;
                        });
                        this.basicInformation.mawb.idStyle = {
                            width: "100%"
                        };
                    }

                    let creditlevelArr = getxmdata('wtkhData').filter(i => {
                        return i.id == this.inputModelData.fid
                    })
                    this.basicInformation.ispay_pre.disabled = creditlevelArr.length > 0 && (creditlevelArr[0].creditlevel != 'C' && this.inputModelData.isclock > 0 || creditlevelArr[0].creditlevel == 'C')

                }

                if (this.inputModelData.orderdom == "分单") {
                    this.basicInformation.mawb.hidden = true;
                    this.basicInformation.mawbAe.hidden = true;
                    this.basicInformation.hawb.hidden = false;
                    this.basicInformation.orderdom.hidden = true;
                    // this.basicInformation.hawb.idStyle = { display: "inline-block" };

                    this.basicInformation.remark.title = "唛头：";
                    this.basicInformation.comboine.disabled = true;

                    if (this.inputModelData.hawbAddress) {
                        this.inputModelData.hawbAddress.area = this.inputModelData.area;
                    }
                } else {
                    this.basicInformation.hawb.hidden = true;
                    //this.basicInformation.hawb.idStyle = { display: "none" };

                    this.basicInformation.remark.title = "备注：";

                    if (this.inputModelData.opersystem == "出口" && this.inputModelData.opersystemdom == "空运") {
                        this.basicInformation.mawb.hidden = true;
                        this.basicInformation.mawbAe.hidden = false;
                    } else {
                        this.basicInformation.mawb.hidden = false;
                        this.basicInformation.mawbAe.hidden = true;
                    }
                }

                if (this.inputModelData.orderdom == "总单" && !this.ifOperSysHome) {
                    this.inputModelData.englishpm =
                        this.inputModelData.englishpm || "CONSOL";
                    this.basicInformation.chinesepm.hidden = true;
                    this.basicInformation.tradeterm.hidden = true;
                } else {
                    this.basicInformation.chinesepm.hidden = false;
                    this.basicInformation.tradeterm.hidden = false;
                }

                if (this.inputModelData.dzstatus > 200 && this.inputModelData.area == this.conditionalAreaForBuild) {
                    //签单申请后
                    // this.basicInformation.sfg.disabled = true;
                    // this.basicInformation.mdg.disabled = this.inputModelData.commbillmodifystatus != 2;
                    this.basicInformation.yqhbh.disabled = true;
                    this.basicInformation.yqhbrq.disabled = true;
                }

                // if(this.inputModelData.dzstatus > 200 ){
                //    this.basicInformation.signpiece.disabled=true
                //    this.basicInformation.signweight.disabled=true
                //    this.basicInformation.signvolume.disabled=true
                // }
                if (this.inputModelData.iscomboine == 1) { //合并的订单
                    //hpo页面
                    [
                        "sfg",
                        "deliverydate",
                        "ybpiece",
                        "ybweight",
                        "ybvolume",
                        "smallpiece",
                        // "yqqcts",
                        // "yqhbh",
                        // "yqhbrq",
                        "bglx",
                        "bgpiece",
                        "bgweight",
                        // "hbzl",
                        "exForm1",
                        "remark"
                    ].forEach(i => {
                        this.basicInformation[i].disabled = true;
                    });

                    [
                        "orderdom",
                        "czlx",
                        "orderno",
                        "fid",
                        "gid",
                        //  "deliverydate",
                        // "realpiece",
                        // "realweight",
                        // "realvolume",
                        // "yqqcts",
                        // "yqhbh",
                        // "yqhbrq",
                        // "yjqfsj",
                        // "qcts",
                        "jfweight",
                        // "bglx",
                        // "bgpiece",
                        // "bgweight",
                        // "hbzl",
                        "ispay_pre"
                    ].forEach(i => {
                        this.basicInformation[i].hidden = true;
                    });
                    // this.basicInformation.zzg.idStyle = {
                    //     width: "50%"
                    // }
                    this.basicInformation.zdvolume.idStyle = {
                        width: "50%"
                    }

                }
                if (this.iscomboineChildren) {//合并前的子订单

                }

                if (this.projectIsWecan) {
                    // this.shipaceInfoView.pzcontent.hidden = true
                } else {
                    this.shipaceInfoView.shipspace.hidden = true
                    // this.shipaceInfoView.shipvendor.hidden = true
                }
             
                if(this.isoutsideSystem){
                    ['signpiece','signweight','signvolume','zdpiece','zdweight','zdvolume'].forEach(i=>{
                        this.basicInformation[i].hidden=true
                    })
                }

                this.zdBasicInfo.iszddl.disabled = this.inputModelData.dzstatus > 100 && this.inputModelData.commbillmodifystatus != 2
                this.zdBasicInfo.zddlcode.disabled = this.inputModelData.dzstatus > 100 && this.inputModelData.commbillmodifystatus != 2
                this.zdBasicInfo.hawbcount.disabled = this.inputModelData.dzstatus > 100 && this.inputModelData.commbillmodifystatus != 2
            },
            getJjdFunc() {
                //设置交接地数据
                var area = this.area;
                if (area == "市场部" || area == "海外部") {
                    area = "香港";
                }
                this.jjdArr = JSON.parse(localStorage.jjd)
                    .filter(e => e.sfg == this.inputModelData.sfg)
                    .map(i => {
                        return {
                            label: i.cname,
                            value: i.cname,
                            id: i.id
                        };
                    });
            },
            getMawbConfig() {
                //获取总单配置表格数据
                this.dialogMawbConfig = true;
                this.inputModelData.wtkh=getxmdata("wtkh").filter(i=>i.id == this.inputModelData.fid)[0]['usr_name']
                // var hbh = this.shipaceInfoData.hbh || this.inputModelData.yqhbh;
                // var sfg = this.inputModelData.sfg;
                // this.dialogMawbConfig = true;
                // this.dialogMawb = this.inputModelData.mawb;
                // var json = {
                //     area: this.area,
                //     hbh: hbh.substr(0, 2),
                //     czlx: this.inputModelData.czlx,
                //     sfg: sfg,
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
                //     this.mawbConfigtableData = results.data || [];
                // });
            },
            getMawbCost(wageinout) {
                //获取总单费用信息
                // wageinout 1应收 2应付

                let json = {
                    sid: this.mawbguid,
                    boguid: this.boguid
                };
                if (wageinout && typeof (wageinout) == 'number') {
                    //传了wageinout代表要删除带出的运费杂费
                    json.wageinout = wageinout;
                    json.isallin = 1;
                }
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxplineWage",
                    params: json,
                    loading: false,
                    tip: false
                }).then(results => {
                    /*         console.log("总单费用");
                    console.log(JSON.stringify(results.data)); */
                    this.costdata = results.data;

                    var yingshou = 0;
                    var yingfu = 0;
                    this.costdata.forEach(i => {
                        if (
                            (i.wagedom == "航线" || (i.wagedom == "航线" && i.yssys != 2)) &&
                            i.isfree == 1
                        ) {
                            if (i.wageinout == 1) {
                                yingshou += Number(i.wageall);
                            } else {
                                yingfu += Number(i.wageall);
                            }
                        }
                    });
                    var profit = Number(yingshou - yingfu).toFixed(2);

                    this.kongchuCost = {
                        yingshou: Number(yingshou).toFixed(2),
                        yingfu: Number(yingfu).toFixed(2),
                        profit: profit
                    };
                });
            },

            hawbSelFunc(val) {
                //选中进仓编号,分单配置进仓编号里面的

                var piece = 0;
                var weight = 0;
                var volume = 0;
                val.forEach(item => {
                    this.saveNumberList.forEach(element => {
                        if (item == element.khjcno) {
                            piece += Number(element.piece);
                            weight += Number(element.weight);
                            volume += Number(element.volume);
                        }
                    });
                });

                this.hawbForm.realpiece = piece;
                this.hawbForm.realweight = weight.toFixed(2);
                this.hawbForm.realvolume = volume.toFixed(3);
                if (this.putIndex == -1) {
                    this.hawbForm.ybpiece = piece;
                    this.hawbForm.ybweight = weight.toFixed(2);
                    this.hawbForm.ybvolume = volume.toFixed(3);
                }
                // this.inputModelData.realpiece=piece
                // this.inputModelData.realweight=weight
                // this.inputModelData.realvolume=volume
            },
            changeIndex(index,isfirsttab=false) {

                //大模块，一级tab初次切换
                this.firstLevelIndex = index;
                if (!this.ifFirst.includes(index)) {
                    this.ifFirst.push(index);
                } 
            
                if (this.firstLevelIndex >= 0 && !isfirsttab) {
                    if(this.firstLevelTab[index]=='出港操作'){
                        for (let item of this.cgportTtabs) {
                            if (this.showCgportTab(item.tabcode)) {
                                this.activeName = item.tabcode;
                                break;
                            }
                        }
                    }else{
                        this.activeName = this.getPortChildren(this.firstLevelTab[index]).filter(i => this.hasServiceContent.includes(i))[0]
                    }
                } else {
                    this.activeName = 'tab1-first'
                }

                if (!this.ifThird.includes(this.activeName)) {
                    this.ifThird.push(this.activeName);
                }
                //  if (!this.ifThird.includes(this.activeNameSfg)) {
                //     this.ifThird.push(this.activeNameSfg);
                //   }
            },
            getHawbForm() {
                //获取分单配置进仓编号表单数据
                if (!this.hawbForm.hawb) {
                    this.$message.error("请填写分运单号");
                    return;
                }
                if (
                    !this.hawbForm.ybpiece ||
                    !this.hawbForm.ybweight ||
                    !this.hawbForm.ybvolume
                ) {
                    this.$message.error("请填写预报件重���");
                    return;
                }
                var n = 0;
                this.hawbTableData.forEach(element => {
                    if (element.hawb == this.hawbForm.hawb) {
                        n += 1;
                    }
                });

                if (n >= 1 && this.putIndex == -1) {
                    this.$message.error("分运单号重复，请重新填写");
                    return;
                }
                var ybArr = [];
                let newKhjcnoArr = this.hawbForm.khjcno;
                let oldKhjcnoArr = this.hawbTableData[this.putIndex] ?
                    this.hawbTableData[this.putIndex].khjcno.split(",") : [];
                newKhjcnoArr.forEach(i => {
                    if (!oldKhjcnoArr.includes(i)) {
                        ybArr.push({
                            isdel: 1,
                            khjcno: i
                        });
                    }
                });
                oldKhjcnoArr.forEach(i => {
                    if (!newKhjcnoArr.includes(i)) {
                        ybArr.push({
                            isdel: 2,
                            khjcno: i
                        });
                    }
                });

                var ybstoreList = [];
                ybArr.forEach(el => {
                    this.saveNumberList.forEach(item => {
                        if (el.khjcno == item.khjcno) {
                            ybstoreList.push({
                                isdel: el.isdel,
                                guid: item.guid,
                                khjcno: el.khjcno
                            });
                        }
                    });
                });

                let hawbInfo = {
                    hawb: this.hawbForm.hawb,
                    guid: this.hawbForm.guid || -1,
                    mdg: this.hawbForm.mdg,
                    sfg: this.inputModelData.sfg,
                    khjcno: this.hawbForm.khjcno.toString(),
                    ybpiece: this.hawbForm.ybpiece,
                    ybweight: this.hawbForm.ybweight,
                    ybvolume: this.hawbForm.ybvolume,
                    ybstoreList: ybstoreList
                };
                return hawbInfo;
            },
            async orderSplit() {
                if (!this.inputModelData.khjcno) {
                    return this.$message.error('请填写进仓编号!')
                };

                if (this.inputModelData.khjcno && this.inputModelData.khjcno.split(',').length == 1) {
                    return this.$message.error('只有一个进仓编号，不能拆分!')
                };
                let confirm = await this.$confirm('是否确认操作？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                if (confirm) {
                    this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/HpoServiceSplit",
                        data: {
                            boguid: this.inputModelData.boguid,
                            guid: this.inputModelData.guid,
                            czman: localStorage.usrname
                        },
                        loading: false,
                        tip: false
                    }).then(results => {
                        // console.log(results)
                        if (results.data.resultstatus == 0) {
                            this.$message.success(results.data.resultmessage);
                            this.$emit("update:visible", false);
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                }
            },
            saveHawbForm() {
                //保存分单信息
                let hawbInfo = this.getHawbForm();
                if (!hawbInfo) {
                    return;
                }
                if (this.putIndex == -1) {
                    //新增
                    this.addHawbList(hawbInfo);
                } else {
                    //修改
                    this.upHawbList(hawbInfo);
                }
            },
            addHawbList(hawbInfo) {
                //分单批量新增
                var json = {
                    sid: this.mawbguid,
                    hawbList: [hawbInfo],
                    boguid: this.boguid,
                    area: this.area
                };
                //console.log(JSON.stringify(json))

                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + "api/ExAxpline",
                    data: json,
                    loading: false,
                    tip: false
                }).then(results => {
                    //console.log("分单批量新增")
                    //console.log(results)
                    if (results.data.resultstatus == 0) {
                        hawbInfo.guid = results.data.resultdic.hawbMsg[0].guid;
                        this.hawbTableData.push(hawbInfo);
                        this.initHawbForm();
                        this.$refs.hawbtab && this.$refs.hawbtab.getHawbNum();
                        this.$refs.hawbZdtab && this.$refs.hawbZdtab.getHawbNum();
                        this.$refs.bgCmpt && this.$refs.bgCmpt.getListInfo();
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            upHawbList(hawbInfo) {
                //分单详细修改
                //console.log(hawbInfo);
                hawbInfo.sid = this.mawbguid;
                hawbInfo.boguid = this.boguid;
                hawbInfo.area = this.area;
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + "api/ExAxpline",
                    data: hawbInfo,
                    loading: false,
                    tip: false
                }).then(results => {
                    //console.log("分单详细修改")
                    //console.log(results)
                    if (results.data.resultstatus == 0) {
                        this.hawbTableData.splice(this.putIndex, 1, hawbInfo);
                        this.initHawbForm();
                        this.putIndex == -1;
                        this.$refs.hawbtab && this.$refs.hawbtab.getHawbNum();
                        this.$refs.hawbZdtab && this.$refs.hawbZdtab.getHawbNum();
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            setHawbForm(index) {
                this.hawbForm = Object.assign({}, this.hawbTableData[index]);
                this.hawbForm.khjcno = this.hawbTableData[index].khjcno ?
                    this.hawbTableData[index].khjcno.split(",") : [];
                this.putIndex = index;
            },
            resetHawbForm() {
                this.initHawbForm();
                this.putIndex = -1;
            },
            delHawbForm(index) {
                //  if(this.inputModelData.mawb){
                //    this.$message.error('总运单已配，无法删除！');return
                //  }

                this.$confirm("确定删除此单号?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    var json = {
                        guid: this.hawbTableData[index].guid,
                        orderdom: this.inputModelData.orderdom,
                        isdel: 2,
                        sid: this.mawbguid,
                        boguid: this.boguid
                    };
                    this.$axios({
                        method: "delete",
                        url: this.$store.state.webApi + "api/ExAxpline",
                        data: json,
                        loading: false,
                        tip: false
                    }).then(results => {
                        //console.log("删除分单详细")
                        //console.log(JSON.stringify(results.data))
                        if (results.data.resultstatus == 0) {
                            this.hawbTableData.splice(index, 1);
                            this.$refs.hawbtab && this.$refs.hawbtab.getHawbNum();
                            this.$refs.hawbZdtab && this.$refs.hawbZdtab.getHawbNum();
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                });
            },
            selOptionShow(item) {
                //判断进仓编号是否已经使用
                var isUse = false;
                this.hawbTableData.forEach((element, i) => {
                    if (
                        element.khjcno.split(",").includes(item.khjcno) &&
                        this.putIndex != i
                    ) {
                        isUse = true;
                    }
                });
                return isUse;
            },
            getServiceGuid(code, field = "guid", type = 1) {
                //获取服务节点参数
                //field 传guid orderpgid childpgid
                //type 默认1 返回guid ,2 判断服务是否绑定
                if ((this.ifOperSysHome || this.ifOperSysImport) && code == "OA0010") {
                    code = "OA0000";
                }
                let guid;

                this.serviceNodeData.forEach(i => {
                    if (i.servicecode == code) {
                        guid = i[field];
                    }
                });
                if (type == 2) {
                    return guid > 0; //服务是否绑定
                } else {
                    return guid;
                }
            },
            test() {
                if (this.visible) this.$emit("update:visible", false);
                // //console.log(this.basicInformation)
            },
            receiveBognXd(type) {
                //1接收 2取消接收
                //  let url = "api/ExAiraxpNode"
                let url =
                    type == 1 ? "api/BoAEToBoGn/Receive" : "api/BoAEToBoGn/CancelReceive";
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: {
                        // area: this.area,
                        //sid: this.mawbguid,
                        boguid: this.boguid,
                        guid: this.inputModelData.guid,
                        czman: localStorage.usrname
                        // nodelist: [
                        //   {
                        //     nodedate: type==1?formatDate(new Date(), "yyyy-MM-dd hh:mm"):'',
                        //     nodeman:type==1?localStorage.usrname:"",
                        //     nodecode: "AO5020",
                        //     sid: this.boguid
                        //   }
                        // ]
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message("操作成功！");
                        // this.getMawbdetail();
                        // this.getServiceNodeData();
                        if (
                            this.isBognTesk &&
                            results.data.resultdic &&
                            results.data.resultdic.status
                        ) {
                            this.inputModelData.status = results.data.resultdic.status;
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            orderFinishFunc() {
                //点击总单完成
                if (!this.orderFinish) {

                    // if (!this.ckFinish.finish && this.ckFinish.isdel == 1) {
                    //   this.$message.error("仓库服务未完成！");
                    //   return;
                    // }
                    // if (!this.thFinish.finish && this.thFinish.isdel == 1) {
                    //   this.$message.error("提货服务未完成！");
                    //   return;
                    // }
                    // if (!this.bgFinish.finish && this.bgFinish.isdel == 1) {
                    //   this.$message.error("报关服务未完成！");
                    //   return;
                    // }
                    if (
                        this.inputModelData.orderdom == "总单" &&
                        this.inputModelData.hawbnum == 0 &&
                        !this.orderFinish &&
                        !this.ifOperSysHome && !(this.inputModelData.isshipace == 2 && this.ordertype == 2)
                    ) {
                        this.$message.error("无分单数据，无法完成！");
                        return;
                    }

                }

                let url = !this.orderFinish ?
                    "api/ExHpoAxplineFinish " :
                    "api/ExHpoAxplineUnFinish";

                let data = {
                    area: this.area,
                    sid: this.mawbguid,
                    boguid: this.boguid
                };
                if (this.inputModelData.area != this.conditionalAreaForBuild) {
                    data.nodeList = [{
                        nodedate: "",
                        nodeman: "",
                        servicecode: "AO5060",
                        sid: this.getServiceGuid("OA0010")
                    }];
                }
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: data,
                    loading: false,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message("操作成功！");
                        this.getMawbdetail();
                        this.getServiceNodeData();
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            // 监听委托客户、项目  根据传过来的type判断客户还是项目
            wtdataP(data) {
                this.inputModelData.wtkhname = data.wtkhname;
                this.inputModelData.wtxmname = data.wtxmname;
            },
            flightAssFunc() {
                //配舱
                if (
                    new Date(formatDate(this.inputModelData.hbrq, "yyyy-MM-dd")) <
                    new Date(formatDate(this.inputModelData.yqhbrq, "yyyy-MM-dd"))
                ) {
                    this.$message.error("实际航班日期不能小于要求航班日期！");
                    return;
                }
                var json = {
                    guid: this.mawbguid,
                    oldshipaceid: this.inputModelData.oldshipaceid,
                    boguid: this.inputModelData.boguid,
                    area: this.area
                };
                var url = "";
                if (this.inputModelData.shipaceInfo.guid == -1) {
                    url = "api/ExHpoAxplineSureShipace";
                    json.shipaceInfo = this.shipaceInfoData;
                    // //console.log(JSON.stringify(json.shipaceInfo))
                    if (json.shipaceInfo.hbh.length < 2) {
                        this.$message.error("航班号至少为两位！");
                        return;
                    }
                    if (
                        (!json.shipaceInfo.hbrq ||
                            !json.shipaceInfo.qfsj ||
                            !json.shipaceInfo.terminalname) &&
                        (this.inputModelData.opersystem == "出口" &&
                            this.inputModelData.opersystemdom == "空运")
                    ) {
                        this.$message.error("请填写完整信息！");
                        return;
                    }
                    if (!json.shipaceInfo.hbrq && this.inputModelData.opersystemdom == "海运") {
                        this.$message.error("请填写实际航班日期！");
                        return;
                    }
                } else {
                    url = "api/ExHpoAxplineUnSureShipace";
                }

                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log("配舱操作")
                    //console.log(JSON.stringify(results.data))
                    if (results.data.resultstatus == 0) {
                        this.$message("操作成功！");
                        this.getMawbdetail();
                        this.getServiceNodeData();
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            getInfo() {
                //获取总单表单信息

                var mawbInfo = JSON.parse(JSON.stringify(this.inputModelData));
                mawbInfo = this.dealList(mawbInfo)
                // if(this.orderdom=='总单'){
                //     mawbInfo.hawbList=this.$refs.hawbtab.getAllhawbinfo();
                // }else{
                //   mawbInfo.hawbList=[]
                // }
                //this.$refs.makingbill&&this.$refs.makingbill.saveBillInfo()
                mawbInfo.zdpiece = this.inputModelData.realpiece;
                mawbInfo.czlx = this.inputModelData.czlx;

                mawbInfo.smallpiece = Number(mawbInfo.smallpiece) || 0
                mawbInfo.bgweight = Number(mawbInfo.bgweight) || 0
                mawbInfo.bgpiece = Number(mawbInfo.bgpiece) || 0
                mawbInfo.yqqcts = Number(mawbInfo.yqqcts) || 0

                this.pricefieldArr.forEach(i => {
                    mawbInfo[i] = mawbInfo[i] ? Number(mawbInfo[i]) : 666666;
                });


                if (!this.ifOperSysImport) {//进口需要保留
                    delete mawbInfo.qfsj;
                    delete mawbInfo.hbh;
                    delete mawbInfo.hbrq;
                }
                // console.log(JSON.stringify(mawbInfo));
                if (mawbInfo.hwlx && mawbInfo.hwlx.indexOf('锂电池') < 0) {
                    mawbInfo.batterymodel = ''
                }

                if (this.pagetype == 14 && this.inputModelData.czlx == '自货') {
                    //客服综合查询详细页不保存制单信息
                    delete mawbInfo.zdpiece;
                    delete mawbInfo.zdweight;
                    delete mawbInfo.zdvolume;
                    delete mawbInfo.jfweight;
                }

                delete mawbInfo.isimperfect

                return mawbInfo;
            },
            serviceEditDialog() {
                //点击总单服务编辑
                this.dialogFormVisible = true;
            },
            async getHawbNum(num) {
                //获取分单号
                if (this.inputModelData.opersystem == '国内服务') return;
                let guid = this.iscomboineChildren ? this.inputModelData.guid : this.mawbguid;
                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxpline",
                    params: {
                        hpoidHawbGroup: guid
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    //  console.log("分单号");
                    //   console.log(JSON.stringify(results.data));
                    this.hawbTableData = results.data;
                });
                this.$refs.bgCmpt && this.$refs.bgCmpt.getListInfo();
                //同步配货和单证确认里面的订单号数据
                if (num == 1) {
                    this.$refs.danhaoConfirm && this.$refs.danhaoConfirm.getHawbList();
                    this.$refs.danzhengConfirm && this.$refs.danzhengConfirm.getHawbList();
                    this.refreshPeihuo()
                } else if (num == 2) {
                    this.$refs.peihuo && this.$refs.peihuo.getPonoList();
                }

                return this.hawbTableData;
            },
            async saveMawbInfo(type) {
                //保存总单数据  type: 1(订单确认)  2(取消确认)
                //type 4服务里面列表的保存后的回调，不用判断必填信息
                //5 gong任务完成时先保存 6待修改完成
                let mawbInfo = {};
                if (this.ifOperSysHome) {
                    if (type != 4) {
                        for (let i in this.homeInformation) {
                            if (
                                this.homeInformation[i].required &&
                                !this.inputModelData[i] &&
                                !this.homeInformation[i].hidden
                            ) {
                                this.$message.error(
                                    "请填写" + this.homeInformation[i].title.replace("：", "")
                                );
                                return;
                            }
                        }
                        for (let code in this.serviceSelArr) {
                            let item = this.serviceViewData[
                                this.serviceSelArr[code] + "ViewData"
                            ];
                            if (item) {
                                for (let e in item) {
                                    if (
                                        item[e].required &&
                                        !this.inputModelData[e] &&
                                        item[e].required &&
                                        !item[e].hidden
                                    ) {
                                        this.$message.error(
                                            "请填写" + item[e].title.replace("：", "")
                                        );
                                        return;
                                    }
                                }
                            }
                        }

                        //判断始发港提货里面的必填
                        if (
                            this.serviceSelArr.includes("AA0510") &&
                            this.$refs.takeGoodsAddRef
                        ) {
                            if (!this.$refs.takeGoodsAddRef.check_data()) {
                                return;
                            }
                        }

                        //判断目的港送货里面的必填
                        if (
                            this.serviceSelArr.includes("AB0520") &&
                            this.$refs.takeGoodsAddRefMdg
                        ) {
                            if (!this.$refs.takeGoodsAddRefMdg.check_data()) {
                                return;
                            }
                        }
                    }

                    if (this.inputModelData.address_thrtype_org == 3) {
                        this.inputModelData.address_thr_org = JSON.parse(localStorage.cargoData).filter(i => i.storename == this.inputModelData.store_thr)[0].remark
                        this.inputModelData.address_thrjson_org = ''
                        this.inputModelData.company_thr_org = ""
                    }

                    if (this.inputModelData.address_shrtype_org == 3) {
                        this.inputModelData.address_shr_org = JSON.parse(localStorage.cargoData).filter(i => i.storename == this.inputModelData.store_shr)[0].remark
                        this.inputModelData.address_shrjson_org = ''
                        this.inputModelData.company_shr_org = ""
                    }

                    //判断必填
                    // mawbInfo = {};
                    for (let i in this.inputModelData) {
                        let item = this.inputModelData[i];
                        let olditem = this.inputModelDataBackup[i];
                        if (
                            item != undefined &&
                            item != null &&
                            ![
                                "wtxmname",
                                "sjComWeight",
                                "serviceList",
                                "accountweightout",
                                "ybpiece",
                                "zdpiece",
                                "realpiece",
                                "ybweight",
                                "zdweight",
                                "realweight",
                                "ybvolume",
                                "zdvolume",
                                "realvolume"
                            ].includes(i)
                        ) {
                            if (JSON.stringify(item) != JSON.stringify(olditem)) {
                                //  console.log(i);
                                //   console.log(item)
                                if (
                                    Array.isArray(item) &&
                                    !["gbzlist", "gylist", "cltglist", "gbzlistpm", "gylistpm", 'khjcnolist'].includes(i)
                                ) {
                                    //有几个小服务里面的list与通常list判断不同，所以不用在此判断
                                    let newarr = [];
                                    for (let n in olditem) {
                                        let parr = item.filter(e => e.guid == olditem[n].guid); //看是否依然存在
                                        if (parr.length == 0) {
                                            //没有被删除
                                            newarr.push({
                                                guid: olditem[n].guid,
                                                isdel: 2
                                            });
                                        } else {
                                            //有，但有可能修改了
                                            let a = JSON.parse(JSON.stringify(parr[0]));
                                            delete a.checked;
                                            if (JSON.stringify(a) != JSON.stringify(olditem[n])) {
                                                parr[0].isdel = 3;
                                                newarr.push(parr[0]);
                                            }
                                        }
                                    }

                                    mawbInfo[i] = newarr.concat(item.filter(e => e.guid == -1));
                                    console.log(JSON.stringify(mawbInfo[i]));
                                    if (mawbInfo[i].length == 0) {
                                        delete mawbInfo[i];
                                    }
                                } else {
                                    mawbInfo[i] = item;
                                }
                            }
                        }
                    }

                    if (Object.keys(mawbInfo).length != 0) {
                        mawbInfo.boguid = this.inputModelData.boguid;
                        mawbInfo.opersystem = this.inputModelData.opersystem;
                        mawbInfo.opersystemdom = this.inputModelData.opersystemdom;
                        mawbInfo.guid = this.inputModelData.guid;
                        mawbInfo.truckgid = this.inputModelData.truckgid || -1;
                        mawbInfo.hbInfoChanged = !!(mawbInfo.mdg || mawbInfo.sfg)
                        mawbInfo = this.dealList(mawbInfo)
                        if (mawbInfo.khjcnolist && (mawbInfo.khjcnolist.filter(i => i.khjcno && i.piece && i.weight).length != mawbInfo.khjcnolist.length)) {
                            this.$message.error("请填写进仓编号与件数,重量");
                            return;
                        }
                        // console.log(mawbInfo.hbInfoChanged);
                        //  return
                        await this.$axios({
                            method: "put",
                            url: this.$store.state.webApi + "api/ExHpoAxpline",
                            data: mawbInfo,
                            loading: false,
                            tip: true
                        }).then(results => {
                            console.log(results);
                            if (results.data.resultstatus == 0) {
                                this.$message.success(results.data.resultmessage);
                                //  this.inputModelDataBackup=JSON.parse(JSON.stringify(this.inputModelData))

                                if (type != 5) {
                                    this.getMawbdetail(); //还是需要重新取，否则无法获取新增多条表格数据类的guid,bogn在服务完成后去取
                                }
                            } else {
                                this.$message.error(results.data.resultmessage);
                            }
                        });
                    } else {
                        if (!this.ifOperSysHome) {
                            return this.$message.error("无数据修改！");
                        } else {
                            if (type == 5) {
                                return true;
                            } else {
                                return this.$message.error("无数据修改！");
                            }
                        }
                    }
                } else {
                    mawbInfo = this.getInfo();

                    if (
                        this.inputModelData.opersystem == "出口" &&
                        this.inputModelData.opersystemdom == "空运"
                    ) {
                        if(this.inputModelData.mawb&&this.inputModelData.sfg=='PVG'&&!this.inputModelData.zddlcode.toLowerCase().includes('sha')&&this.inputModelData.iszddl=='2'){
                          this.$message.error('始发港为PVG的情况下制单代理代码必须含有SHA')
                          return
                        }
                        delete mawbInfo.mawb;
                    }
                    delete mawbInfo.dzstatus;
                    delete mawbInfo.status;

                    if (this.inputModelData.zdpiece) {
                        if (
                            parseInt(this.inputModelData.zdpiece) !=
                            parseInt(this.inputModelData.realpiece)
                        ) {
                            this.$message.error("制单件数与实际件数不匹配！");
                            return;
                        }
                    }

                    mawbInfo.area = this.area;

                    if (mawbInfo.area == this.conditionalAreaForBuild) {
                        if (this.$refs.danzhengConfirm) {
                            let row = this.$refs.danzhengConfirm.getSfhInfo();
                            // console.log(row)
                            if (row) {
                                let arr = [
                                    "code_shr_mawb",
                                    "companytitle_shr_mawb",
                                    "address_shr_mawb",
                                    "city_shr_mawb",
                                    "companycode_shr_mawb",
                                    "state_shr_mawb",
                                    "lxr_shr_mawb",
                                    "phone_shr_mawb",
                                    "email_shr_mawb",
                                    "fax_shr_mawb",
                                    "taxcode_shr_mawb",
                                    "code_fhr_mawb",
                                    "companytitle_fhr_mawb",
                                    "address_fhr_mawb",
                                    "city_fhr_mawb",
                                    "postcode_fhr_mawb",
                                    "companycode_fhr_mawb",
                                    "state_fhr_mawb",
                                    "lxr_fhr_mawb",
                                    "phone_fhr_mawb",
                                    "email_fhr_mawb",
                                    "fax_fhr_mawb",
                                    "taxcode_fhr_mawb"
                                ];
                                arr.forEach(i => {
                                    mawbInfo[i] = row[i];
                                });
                            } else {
                                this.$message.error("请检查总单收发货人信息是否超出字符限制！");
                                return;
                            }
                        }
                    } else {
                        if (
                            this.$refs.makeBillRevSed &&
                            this.$refs.makeBillRevSed.ifHasLimit()
                        ) {
                            this.$message.error("请检查收发货人信息是否超出字符限制！");
                            return false;
                        }
                    }

                    if (mawbInfo.isinwageallin != 4) {
                        delete mawbInfo.inwagecostprice;
                    }
                    if (
                        mawbInfo.isinwageallin == 2 && this.inputModelData.isshipace == 1 &&
                        Number(mawbInfo.inwageallinprice) < 10
                    ) {
                        this.$message.error("应收运费价格必须大于等于10");
                        return;
                    }
                    if (
                        mawbInfo.isoutwageallin == 2 && this.inputModelData.isshipace == 1 &&
                        Number(mawbInfo.outwageallinprice) < 10
                    ) {
                        this.$message.error("应付运费价格必须大于等于10");
                        return;
                    }
                    if (
                        mawbInfo.isinwageallin_trans == 2 && this.inputModelData.isshipace == 1 &&
                        Number(mawbInfo.inwageallinprice_trans) < 10
                    ) {
                        this.$message.error("应收中转费价格必须大于等于10");
                        return;
                    }
                    if (
                        mawbInfo.isoutwageallin_trans == 2 && this.inputModelData.isshipace == 1 &&
                        Number(mawbInfo.outwageallinprice_trans) < 10
                    ) {
                        this.$message.error("应付中转费价格必须大于等于10");
                        return;
                    }

                    // mawbInfo.inwageallinprice=mawbInfo.inwageallinprice||0
                    // mawbInfo.outwageallinprice=mawbInfo.outwageallinprice||0
                    // console.log(JSON.stringify(mawbInfo));

                    //  this.$refs.hawbtab && this.$refs.hawbtab.upHawbDetail(); //保存总单同时更新分单模块当前显示tab数据
                    this.$refs.incidentalRefIn &&
                        this.$refs.incidentalRefIn.saveIncidentalWage(); //更新应收应付运费杂费数据，保存或修改
                    this.$refs.incidentalRefOut &&
                        this.$refs.incidentalRefOut.saveIncidentalWage();

                    if (type == "1") {
                        this.pageFrom == "order" ?
                            (mawbInfo.dzstatus = "120") :
                            (mawbInfo.dzstatus = "150");

                        if (
                            !mawbInfo.address_shr_mawb ||
                            !mawbInfo.companytitle_shr_mawb ||
                            !mawbInfo.city_shr_mawb ||
                            !mawbInfo.companycode_shr_mawb
                        ) {
                            this.$message.error("请补充分单收货人信息");
                            return false;
                        } else if (
                            !mawbInfo.address_fhr_mawb ||
                            !mawbInfo.companytitle_fhr_mawb ||
                            !mawbInfo.city_fhr_mawb ||
                            !mawbInfo.companycode_fhr_mawb
                        ) {
                            this.$message.error("请补充分单发货人信息");
                            return false;
                        }

                        var fenpeiD = [];
                        this.assignXsDataSfg.forEach(item => {
                            if (!item.profitmode) {
                                fenpeiD.push(item);
                            } else {
                                if (item.servicecode.indexOf("OA0010") != -1) {
                                    if (
                                        item.profitmode == "利润分配模式" &&
                                        (!item.self_profitvalue || !item.cus_profitvalue)
                                    ) {
                                        fenpeiD.push(item);
                                    } else if (
                                        !Number(item.inwageallinprice) &&
                                        item.profitmode == "Co-Load模式"
                                    ) {
                                        fenpeiD.push(item);
                                    } else if (
                                        item.profitmode == "Co-Load模式" &&
                                        !item.self_profitvalue
                                    ) {
                                        fenpeiD.push(item);
                                    } else if (!item.currency && item.profitmode == "Co-Load模式") {
                                        fenpeiD.push(item);
                                    } else if (
                                        item.isinwageallin == "2" &&
                                        Number(item.inwageallinprice) < 100
                                    ) {
                                        fenpeiD.push(item);
                                    }
                                } else {
                                    if (
                                        item.isinwageallin == "2" &&
                                        Number(item.inwageallinprice) < 100
                                    ) {
                                        fenpeiD.push(item);
                                    }
                                }
                            }
                        });

                        if (fenpeiD.length > 0) {
                            this.$message.error("请补充分配信息");
                            return false;
                        } else {
                            mawbInfo.fenpeiList = [];
                            this.assignXsDataSfg.forEach(item => {
                                item.servicecode.split(",").forEach((item2, index2) => {
                                    mawbInfo.fenpeiList.push({});
                                    Object.keys(item).forEach(item3 => {
                                        if (item3 == "servicecode") {
                                            mawbInfo.fenpeiList[index2][item3] = item2;
                                        } else {
                                            mawbInfo.fenpeiList[index2][item3] = item[item3];
                                        }
                                    });
                                });
                            });
                        }
                    } else if (type == "2") {
                        this.pageFrom == "order" ?
                            (mawbInfo.dzstatus = "100") :
                            (mawbInfo.dzstatus = "1");
                    }
                    // 订单未完善点保存之前先要判断所有必填项
                    // 订单未完善页面，加一些字段
                    if (this.pagetype == 11) {
                        mawbInfo.isimperfect = 2;
                        mawbInfo.pono = this.inputModelData.pono;
                        mawbInfo.area = this.inputModelData.area;

                        if (this.$store.state.areaState == this.conditionalAreaForBuild) {
                            mawbInfo.nodecode = "AO5025";
                        } else {
                            mawbInfo.nodecode = "AO5020";
                        }

                        if (!this.checkRequiredField(mawbInfo)) {
                            return this.$message.error("请填写完整字段");
                        }
                    }
                    delete mawbInfo.mawbgid;
                    delete mawbInfo.mawbss;
                    delete mawbInfo.gysname;
                    delete mawbInfo.signpiece;
                    delete mawbInfo.signweight;
                    delete mawbInfo.signvolume;

                    mawbInfo.hbInfoChanged = `${mawbInfo.sfg}${mawbInfo.mdg}${mawbInfo.yqhbh}${mawbInfo.yqhbrq}${mawbInfo.hwxz}${mawbInfo.hwlx}` != this.hbInfoChanged

                    if (type == 6) {
                        mawbInfo.commbillmodifystatus = 3
                        mawbInfo.commbillmodifystatusdz = 3
                        mawbInfo.commbillmodifystatusams = 3
                        mawbInfo.commbillmodifystatustyt = 3
                        mawbInfo.hbInfoChanged = true
                    }
                    if (mawbInfo.iscomboine == 1 && (!mawbInfo.yqhbh || !mawbInfo.yqhbrq)) {
                        return this.$message.error('请填写要求航班号和要求航班日期！')
                    }

                    // console.log(JSON.stringify(mawbInfo))
                    await this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/ExHpoAxpline",
                        data: mawbInfo,
                        loading: false,
                        tip: true
                    }).then(results => {
                        //console.log(results)
                        if (results.data.resultstatus == 0) {
                            if (this.pagetype == 11) {
                                this.showOrderIncompleteBtn = true;
                            }

                            if (!type) {
                                let resultguid =
                                    results.data.resultdic.shipaceInfo &&
                                    results.data.resultdic.shipaceInfo.resultguid;
                                if (resultguid && resultguid != "0") {
                                    this.inputModelData.shipaceid = resultguid;
                                    this.inputModelData.shipaceInfo.guid = resultguid;
                                }
                            }

                            this.getMawbdetail();
                            this.$message.success(results.data.resultmessage);
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                }

                return true;
            },
            // 检查必填项，所有字段填写完整返回true，有必填字段没有填写返回false
            checkRequiredField(mawbInfo) {
                let requi = false;
                let requireFiled = [
                    "fid",
                    "gid",
                    "sfg",
                    "mdg",
                    "ybpiece",
                    "ybweight",
                    "ybvolume",
                    "yqhbrq"
                ];
                requireFiled.forEach(item => {
                    if (!mawbInfo[item]) {
                        requi = true;
                    }
                });
                if (requi) {
                    return false;
                }

                if (this.$store.state.areaState == this.conditionalAreaForBuild) {
                    if (mawbInfo.mawb && (!mawbInfo.hbh || mawbInfo.hbh.length < 2)) {
                        return false;
                    }
                }
                if (mawbInfo.czlx == "自货" && !mawbInfo.inwageallinprice) {
                    return false;
                }

                return true;
            },
            operationSave() {
                //WFF操作
                let data = {
                    boguid: this.boguid
                };
                // 订单未完善页面，加isimpertect字段
                if (this.pagetype == 11) {
                    data.isimperfect = 2;
                }

                this.$confirm("请确认操作?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$axios({
                            method: "put",
                            url: this.$store.state.webApi + "api/ExAxplineAssignLocal",
                            data: data,
                            loading: true,
                            tip: false
                        }).then(results => {
                            //  console.log(results);
                            if (results.data.resultstatus == 0) {
                                this.$message({
                                    message: results.data.resultmessage,
                                    type: "success"
                                });
                                this.$emit('update:visible', false)

                                // this.inputModelData.islocal = results.data.resultdic.islocal;

                            } else {
                                this.$message.error(results.data.resultmessage);
                            }
                        });
                    })
                    .catch(() => { });
            },
            saveJcnoinfo() {
                //保存进仓编号信息
                var n = 0;
                for (var i in this.saveNumberList) {
                    var item = this.saveNumberList[i];
                    if (!item.ybstoreList[0].khjcno) {
                        n = 1;
                    }
                }
                if (n == 0) { } else {
                    this.$message.error("请输入进仓编号及其件重体信息！");
                }
            },
            getQfsj(type) {
                // console.log(11111111)
                // console.log(type)
                //type 1 取预计起飞时间 2 取实际起飞时间
                var sfg = this.inputModelData.sfg;
                if (this.inputModelData.opersystem == '国内服务') return;
                //   console.log(this.$refs.terminalnameid.hoverIndex)
                if (
                    this.$refs.terminalnameid &&
                    this.$refs.terminalnameid.hoverIndex >= 0
                ) {
                    var terminalnameid =
                        this.$refs.terminalnameid &&
                        this.jjdArr[this.$refs.terminalnameid.hoverIndex].id;
                } else {
                    var terminalnameid = "";
                }
                if (type == 1) {
                    var hbh = this.inputModelData.yqhbh || "";
                    var hbrq = this.inputModelData.yqhbrq;
                } else {
                    var hbh = this.shipaceInfoData.hbh || "";
                    var hbrq = this.shipaceInfoData.hbrq;
                }

                var json = {
                    area: this.area == "市场部" || this.area == "海外部" ? "香港" : this.area,
                    sfg: sfg,
                    hbh: hbh,
                    hbrq: hbrq,
                    jid: ""
                };
                if (sfg && hbh.length > 2 && hbrq) {
                    this.$axios({
                        method: "get",
                        url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
                        params: json,
                        loading: true,
                        tip: false
                    }).then(results => {
                        // console.log("起飞时间");
                        // console.log(results.data);
                        var qfsj = results.data.resultdic && results.data.resultdic.flytime;
                        this.qfsjsid = results.data.resultdic && results.data.resultdic.sid;
                        if (qfsj && qfsj.indexOf("1900") == -1) {
                            if (type == 1) {
                                this.inputModelData.yjqfsj = qfsj;
                            } else {
                                this.shipaceInfoData.qfsj = qfsj;
                                this.shipaceInfoData.terminalname =
                                    results.data.resultdic.jjdname;
                            }
                        } else {
                            // layer.msg('未查询到相应的起飞时间!');
                            this.$message.error(results.data.resultmessage);
                            if (type == 1) {
                                this.inputModelData.yjqfsj = "";
                            } else {
                                this.shipaceInfoData.qfsj = "";
                            }
                        }
                    });
                }
            },
            edit_node_success(type) {

                // this.getMawbCost();
                if (
                    type === 1 || type === 2
                ) {

                    if (this.inputModelData.opersystem == "国内服务") {

                        //操作节点时候会修改报关状态 1报关 2清关
                        //查询报关信息
                        this.$axios({
                            method: "get",
                            url: this.$store.state.webApi + "api/ExAxplineDecl",
                            params: {
                                sid: type == 1 ?
                                    this.inputModelData.bg_guid : this.inputModelData.bg_guid_mdg,
                                serviceguid: this.getServiceGuid(type == 1 ? "AG0150" : "AB0620"),
                                servicecode: type == 1 ? "AG0150" : "AB0620"
                            },
                            loading: true,
                            tip: false
                        }).then(results => {
                            console.log("报关信息");
                            console.log(results.data);
                            if (results.data.length == 0 || !results.data) return;
                            results.data.forEach((i, k) => {
                                if (type == 1) {
                                    if (this.inputModelData.declList) {
                                        this.inputModelData.declList[k].status = i.status;
                                        this.inputModelDataBackup.declList[k].status = i.status;
                                    }
                                } else {
                                    if (this.inputModelData.declListMdg) {
                                        this.inputModelData.declListMdg[k].status = i.status;
                                        this.inputModelDataBackup.declListMdg[k].status = i.status;
                                    }

                                }
                            });
                            // this.tableData=results.data
                        });
                    } else {
                        this.getMawbdetail()
                    }

                }

                this.getServiceNodeData();

                this.detailShow.jiedianShow = false;
            },
            saveServiceFunc() {
                //保存服务信息
                if (this.orderFinish) {
                    this.$message.error("订单已完成，无法编辑！");
                    this.setServiceInfo(this.serviceListBackups);
                    return;
                }

                //服务列表
                var serviceList = []; // {servicecode:"服务code",requestcode:"要求code",oprequest:"服务要求",isdel:"1.选中 2.未选中"}

                for (let i in this.newService) {
                    let item = this.newService[i];
                    if (this.ifOperSysHome && item.servicecode == "OA0010") {
                        continue;
                    }
                    serviceList.push({
                        guid: item.guid,
                        sid: item.sid,
                        servicecode: item.servicecode,
                        requestcode: "",
                        oprequest: item.oprequest,
                        profitmode: item.profitmode,
                        isdel: item.model ? 1 : 2,
                        pgid: item.pgid,
                        orderpgid: item.orderpgid,
                        childpgid: item.childpgid
                        /*
                            servicetype:item.servicetype,
                            profitcurrency:item.servicetype,
                            profitprice:item.profitprice */
                    });
                }

                var arr = this.serviceListBackups
                    .filter(e => e.servicecode != "YS0010")
                    .map(i => {
                        delete i.servicetype;
                        delete i.profitcurrency;
                        delete i.profitprice;
                        delete i.assignstatus;
                        return i;
                    });
                /*       console.log(JSON.stringify(serviceList))
                console.log(JSON.stringify(arr))
                console.log(JSON.stringify(serviceList)==JSON.stringify(arr)); */

                if (JSON.stringify(serviceList) == JSON.stringify(arr)) {
                    layer.msg("未修改数据！");
                    return;
                }
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + "api/ExAxplineService",
                    data: {
                        sid: this.inputModelData.guid,
                        serviceList: serviceList,
                        boguid: this.boguid
                    },
                    noarea: true,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log('保存服务信息');
                    //console.log(results.data)
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage);
                        this.showTextarea = -1;
                        this.dialogFormVisible = false;
                        this.serviceListBackups = serviceList;
                        this.getServiceNodeData();
                        this.getMawbdetail();
                        this.detailShow.jiedianShow = false;
                        this.inputModelData.czlx =
                            this.inputModelData.opersystem == "出口" ?
                                this.serviceSelArr.includes("OA0010") ?
                                    "自货" :
                                    "代操作" :
                                "";
                        if (
                            this.inputModelData.opersystem == "出口" &&
                            (this.serviceSelArr.includes("AA0410") || this.serviceSelArr.includes("AG0145"))
                        ) {
                            this.basicInformation.yjstorename.required = true;
                        } else {
                            this.basicInformation.yjstorename.required = false;
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                        this.setServiceInfo(this.serviceListBackups);
                    }
                });
            },
            getJsxmData(data, type, code) {
                //设置四个大服务完成时的节点与费用数据
                //data 表格数据
                //type 类型 1增值 2.仓库 3，提货 4， 报关
                //国内服务下 5目的港入仓 6提货 7清关
                // 进口下 8仓库 9送货 10 清关

                //  alert(type)
                let arr = [];
                let wtxmname = this.inputModelData.wtxmname;
                let gid = this.inputModelData.gid;
                let sid = this.inputModelData.guid;
                let boguid = this.inputModelData.boguid;
                if (type == 1) {
                    this.increaseServiceData = data; //延伸服务表格数据
                }
                if (type == 2) {
                    if (this.inputModelData.opersystem == "国内服务") {
                        arr = [{
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: "",
                            bggysname: "",
                            storeList: this.inputModelData.ybstorevolumeList,
                            parentguid: this.inputModelData.store_guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid("AG0145"),
                            orderpgid: this.getServiceGuid("AG0145", "orderpgid"),
                            childpgid: this.getServiceGuid("AG0145", "childpgid")
                        }];
                    } else {
                        data.forEach(i => {
                            arr.push({
                                sid: sid,
                                gid: gid,
                                wtxmname: wtxmname,
                                bggys: "",
                                bggysname: "",
                                storeList: i.storeList,
                                parentguid: i.store_guid,
                                boguid: boguid,
                                serviceguid: this.getServiceGuid("AA0410"),
                                orderpgid: this.getServiceGuid("AA0410", "orderpgid"),
                                childpgid: this.getServiceGuid("AA0410", "childpgid")
                            });
                        });
                    }
                    this.ckJsxmData = arr;
                }
                if (type == 8) {
                    data.forEach(i => {
                        arr.push({
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: "",
                            bggysname: "",
                            storeList: i.storeList,
                            parentguid: i.store_guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid("AB0420"),
                            orderpgid: this.getServiceGuid("AB0420", "orderpgid"),
                            childpgid: this.getServiceGuid("AB0420", "childpgid")
                        });
                    });
                    this.ckJsxmDataMdg = arr;
                }
                if (type == 3) {
                    if (this.inputModelData.opersystem == "国内服务") {
                        arr = [{
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: this.inputModelData.truckgid,
                            bggysname: "",
                            storeList: this.inputModelData.ybTransstoreList,
                            parentguid: this.inputModelData.transport_guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid("AA0510"),
                            orderpgid: this.getServiceGuid("AA0510", "orderpgid"),
                            childpgid: this.getServiceGuid("AA0510", "childpgid")
                        }];
                    } else {
                        data.forEach(i => {
                            arr.push({
                                sid: sid,
                                gid: gid,
                                wtxmname: wtxmname,
                                bggys: i.truckgid,
                                bggysname: i.truckname,
                                storeList: i.storeList,
                                parentguid: i.transport_guid,
                                boguid: boguid,
                                serviceguid: this.getServiceGuid("AA0510"),
                                orderpgid: this.getServiceGuid("AA0510", "orderpgid"),
                                childpgid: this.getServiceGuid("AA0510", "childpgid")
                            });
                        });
                    }

                    this.thJsxmData = arr;
                }

                if (type == 9) {
                    data.forEach(i => {
                        arr.push({
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: i.truckgid,
                            bggysname: i.truckname,
                            storeList: i.storeList,
                            parentguid: i.transport_guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid("AB0520"),
                            orderpgid: this.getServiceGuid("AB0520", "orderpgid"),
                            childpgid: this.getServiceGuid("AB0520", "childpgid")
                        });
                    });
                    this.thJsxmDataMdg = arr;
                }

                if (type == 4) {
                    data.forEach(i => {
                        arr.push({
                            otherguid: i.sid,
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: i.bggys,
                            bggysname: i.bggysname,
                            status: i.status,
                            parentguid: i.guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid(code),
                            orderpgid: this.getServiceGuid(code, "orderpgid") || -1,
                            childpgid: this.getServiceGuid(code, "childpgid") || -1
                        });
                    });

                    this.bgJsxmData = arr;
                }

                if (type == 10) {
                    data.forEach(i => {
                        arr.push({
                            otherguid: i.sid,
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: i.bggys,
                            bggysname: i.bggysname,
                            status: i.status,
                            parentguid: i.guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid(code),
                            orderpgid: this.getServiceGuid(code, "orderpgid") || -1,
                            childpgid: this.getServiceGuid(code, "childpgid") || -1
                        });
                    });

                    this.bgJsxmDataMdg = arr;
                }

                if (type == 5) {
                    if (!this.ifOperSysHome) return [];
                    return [{
                        sid: sid,
                        gid: gid,
                        wtxmname: wtxmname,
                        bggys: "",
                        bggysname: "",
                        storeList: this.inputModelData.ybstorevolumeListMdg,
                        parentguid: this.inputModelData.store_guid_mdg,
                        boguid: boguid,
                        serviceguid: this.getServiceGuid("AB0420"),
                        orderpgid: this.getServiceGuid("AB0420", "orderpgid"),
                        childpgid: this.getServiceGuid("AB0420", "childpgid")
                    }];
                }
                if (type == 6) {
                    if (!this.ifOperSysHome) return [];
                    return [{
                        sid: sid,
                        gid: gid,
                        wtxmname: wtxmname,
                        bggys: this.inputModelData.truckgid_mdg,
                        bggysname: "",
                        storeList: this.inputModelData.ybTransstoreListMdg,
                        parentguid: this.inputModelData.transport_guid_mdg,
                        boguid: boguid,
                        serviceguid: this.getServiceGuid("AB0520"),
                        orderpgid: this.getServiceGuid("AB0520", "orderpgid"),
                        childpgid: this.getServiceGuid("AB0520", "childpgid")
                    }];
                }
                if (type == 7) {
                    let newarr = [];
                    if (!this.ifOperSysHome) return [];
                    this.inputModelData.declListMdg.forEach(i => {
                        newarr.push({
                            otherguid: i.sid,
                            sid: sid,
                            gid: gid,
                            wtxmname: wtxmname,
                            bggys: i.bggys,
                            bggysname: i.bggysname,
                            status: i.status,
                            parentguid: i.guid,
                            boguid: boguid,
                            serviceguid: this.getServiceGuid("AB0620"),
                            orderpgid: this.getServiceGuid("AB0620", "orderpgid") || -1,
                            childpgid: this.getServiceGuid("AB0620", "childpgid") || -1
                        });
                    });
                    return newarr;
                }
            },
            cancelOrderFunc(type) {
                //type 1 撤单 2 配货完成 3取消配货
                var url = "";
                var json = {};
                if (type == 1) {
                    url = !this.cdFinish ?
                        "api/ExHpoAxplineCancel" :
                        "api/ExHpoAxplineUnCancel";
                    this.orderCancelForm.nodelist[0].nodeman = !this.cdFinish ?
                        localStorage.usrname :
                        "";
                    this.orderCancelForm.nodelist[0].nodedate = !this.cdFinish ?
                        formatDate(new Date(), "yyyy-MM-dd  hh:mm") :
                        "1900-01-01";
                    this.orderCancelForm.nodelist[0].sid = this.getServiceGuid(
                        "OA0010",
                        "guid"
                    );
                    json = JSON.parse(JSON.stringify(this.orderCancelForm));
                    if (!this.hasMaincamp) {
                        json.status = -1;
                    }
                    // 订单未完善页面，加isimpertect字段
                    if (this.pagetype == 11) {
                        json.isimperfect = 2;
                    }
                    // console.log(JSON.stringify(this.orderCancelForm));return
                    if (!this.cdFinish) {
                        if (!json.canceltype) {
                            this.$message.error("请选择撤单类型！");
                            return;
                        }
                        if (json.canceltype == "其他原因" && !json.cancelreason) {
                            this.$message.error("请填写撤单理由！");
                            return;
                        }
                        if (!json.iswage) {
                            this.$message.error("请选择有无费用！");
                            return;
                        }

                        json.cancelreason = JSON.stringify([{
                            reasontype: "撤单",
                            delbillreason: json.cancelreason,
                            delbillman: localStorage.usrname,
                            delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
                            canceltype: json.canceltype,
                            status: json.status,
                            iswage: json.iswage,
                            ifshowRes: this.inputModelData.mawb && this.hasMaincamp
                        }]);
                    }
                } else if (type == 2 || type == 3) {
                    //  url = "api/ExAiraxpNode";
                    url = "api/Store/Complete";
                    json.boguid = this.boguid;
                    json.sid = this.iscomboineChildren ? this.inputModelData.guid : this.mawbguid;
                    

                    let nodelist = [];
                    this.saveNumberList.forEach(i => {
                        nodelist.push({
                            nodeman: localStorage.usrname,
                            nodedate: type == 2 ? formatDate(new Date(), "yyyy-MM-dd hh:mm") : "1900-01-01",
                            nodecode: "AO2050",
                            sid: i.guid
                        });

                        i.realList.forEach(e => {
                            nodelist.push({
                                nodeman: localStorage.usrname,
                                nodedate: type == 2 ? formatDate(new Date(), "yyyy-MM-dd hh:mm") : "1900-01-01",
                                nodecode: "AO2050",
                                sid: e.guid
                            });
                        });

                        if (type == 3) {
                            i.realList.forEach(e => {
                                nodelist.push({
                                    nodeman: localStorage.usrname,
                                    nodedate: "1900-01-01",
                                    nodecode: "AO2060",
                                    sid: e.guid
                                });
                            });
                        }

                    });
                    json.nodelist = nodelist;
                }

                if (this.inputModelData.orderdom != "分单" && type == 2) {
                    if (this.allkhjcnoData.filter(i => !i.statusPz).length > 0) {
                        this.$message.error("有预报进仓编号未配置实际货物信息！");
                        return;
                    }

                    // if (
                    //   this.inputModelData.ybpiece !=
                    //   this.allkhjcnoData.reduce((prev, i) => (prev += Number(i.piece)), 0)
                    // ) {
                    //   return this.$message.error(
                    //     "进仓编号预报件数之和必须等于总单预报件数！"
                    //   );
                    // }
                }
                json.area = this.area;

                // if(type==1&&json.iswage==1){

                //               this.$confirm('是否确认删除?', '提示', {
                //               confirmButtonText: '确定',
                //               cancelButtonText: '取消',
                //               type: 'warning'
                //             }).then(() => {

                //              this.cancelOrderFuncApi(json,url,type);

                //             }).catch(() => {
                //               this.$message({
                //                 type: 'info',
                //                 message: '已取消删除'
                //               });
                //             });
                //   }else{
                this.cancelOrderFuncApi(json, url, type);
                //}
            },
            cancelOrderFuncApi(json, url, type) {
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + url,
                    data: json,
                    area: this.area,
                    loading: true,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage);

                        if (type == 1) {
                            this.orderCancel = false;
                            this.orderCancelForm = {
                                //撤单表单
                                canceltype: "",
                                cancelreason: "",
                                status: "1",
                                iswage: "",
                                boguid: this.boguid,
                                sid: this.mawbguid,
                                nodelist: [{
                                    nodedate: "",
                                    nodeman: "",
                                    nodecode: "AO5065",
                                    sid: ""
                                }]
                            };
                            // alert(json.iswage)
                            if (json.iswage == 1) {
                                this.orderCancel = false;
                                this.$nextTick(() => {
                                    this.costDialog = true;
                                })
                            } else {
                                this.test(); //撤单之后关闭弹窗
                            }
                        } else if (type == 2) {
                            this.phFinish = true;
                            this.$refs.peihuo.getPeihuoInfo()
                        } else if (type == 3) {
                            this.phFinish = false;
                            this.$refs.peihuo.getPeihuoInfo()
                        }

                        this.getServiceNodeData();
                        this.getMawbdetail().then(res => {
                            this.getZzg()
                        });
                    } else if (results.data.resultstatus == 99) {
                        // this.$alert(results.data.resultmessage, "提示", {
                        //   confirmButtonText: "确定",
                        //   dangerouslyUseHTMLString: true,
                        //   callback: action => {
                        this.phFinish = true;
                        this.cshowInfo = results.data.resultmessage
                        this.getMawbdetail().then(res => {
                            if (res.isclock == 1) {
                                this.printDz()
                            }
                        });
                        //     return;
                        //   }
                        // });
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },
            newCancelOrder() { //新撤单
                this.orderCancel = false;
                this.getServiceNodeData();
                this.getMawbdetail();
            },
            closeMenu() {
                //关闭服务的textarea
                this.showTextarea = -1;
            },
            setRound(jfweight) {
                //校正重量的值
                var val = 0;
                var jfweight = Number(jfweight);
                var wc = jfweight - parseInt(jfweight);
                if (wc == 0 || wc == 0.5) {
                    val = jfweight;
                } else {
                    val = wc > 0.5 ? parseInt(jfweight) + 1 : parseInt(jfweight) + 0.5;
                }
                return val;
            },
            JudgeBubblesFunc(type) {
                //type 1判断实际计重 2，制单计重

                if (type == 1) {
                    return (
                        this.setRound(this.getKeys('realweight')) -
                        this.setRound(this.getKeys('realvolume') / 0.006)
                    );
                } else {
                    return (
                        this.setRound(this.getKeys('zdweight')) -
                        this.setRound(this.getKeys('zdvolume') / 0.006)
                    );
                }
            },
            getWageinType(isinwageallin) {
                if (isinwageallin == "1") {
                    return "单价ALLIN";
                } else if (isinwageallin == "2") {
                    return "总价ALLIN";
                } else if (isinwageallin == "3") {
                    return "单价++";
                } else if (isinwageallin == "4") {
                    return "Cost+";
                }
            },
            newFenpeiD(data) {
                //console.log(data)
                this.fenpeiIndex = data.modIndex;
                // console.log(data);
                if (data.currentMod) {
                    this.$set(this.assignXsDataSfg, data.modIndex, data.currentMod);
                }

                //this.assignXsDataSfg[data.modIndex]=data.currentMod
            },
            addTransList(index) { //派车单多条数据处理
                if (index == 0) {
                    this.transList.push({
                        transprice: "",
                        transremark: ""
                    })
                } else {
                    this.transList.splice(index, 1)
                }
            },
            printDz() { //对账单
                var printData = {
                    area: this.inputModelData.area,
                    system: this.inputModelData.system || '空出',
                    //accountcomname:results.data[0].accountcomname,
                    //settgid:results.data[0].accountcomgid,
                    //settjobid: results.data[0].jobnolist[0].settjobid,
                    wageinout: '1',
                    //jobnolist:jobnolist,
                    noPrint: 2,
                    hpoid: this.inputModelData.guid,
                    //confirmman:results.data[0].confirmman,
                    //confirmdate:results.data[0].confirmdate,
                    //confirmremark:results.data[0].confirmremark,
                    //ourconfirmman:results.data[0].ourconfirmman,
                    //ourconfirmdate:results.data[0].ourconfirmdate,
                    useremail: localStorage.userEmail,
                    isNeedEmail: false,
                    cusemail: ''
                }
                this.dzdMakeS = true
                this.dzdMakeD = printData

                // this.$axios({method:'get',url:this.$store.state.webApi+'api/CheckBill/GetCheckBill',params:{boguid:this.inputModelData.boguid}})
                // .then(results=>{
                // var jobnolist=[]
                //        results.data.forEach((item,index)=>{
                //         item.jobnolist.forEach((item2,index2)=>{
                //             item2.realjzt=item2.realpiece+'/'+Number(item2.realweight).toFixed(2)+'/'+Number(item2.realvolume).toFixed(2)
                //            item2.hbrq=item2.hbrq.substring(0,10)
                //            jobnolist.push({jobListData:item2,wagelist:[]})
                //            item2.wagelist.forEach(item3=>{
                //              item3.realjzt=item2.realjzt
                //               item3.hbh=item2.hbh
                //             item3.dwageall=item3.finishwageall_checkbill
                //             item3.hbrq=item2.hbrq.substring(0,10)
                //             jobnolist[index2].wagelist.push(item3)
                //            })
                //         })
                //        })
                //        //console.log(jobnolist)
                //         var printData={
                //           area:this.inputModelData.area,
                //           area:this.inputModelData.system||'空出',
                //           accountcomname:results.data[0].accountcomname,
                //           settgid:results.data[0].accountcomgid,
                //           settjobid: results.data[0].jobnolist[0].settjobid,
                //           wageinout:'1',
                //           jobnolist:jobnolist,
                //           noPrint:2,
                //           hpoid:this.inputModelData.guid,
                //           confirmman:results.data[0].confirmman,
                //           confirmdate:results.data[0].confirmdate,
                //           confirmremark:results.data[0].confirmremark,
                //           ourconfirmman:results.data[0].ourconfirmman,
                //           ourconfirmdate:results.data[0].ourconfirmdate,
                //           useremail:localStorage.userEmail,
                //           isNeedEmail:false,
                //           cusemail:''
                //         }
                //         this.dzdMakeS=true
                //         this.dzdMakeD=printData
                // })
                // .catch(error=>{

                // })
            }
        },
        computed: {
             billNeed() {
                let isexport = 0;
                if (this.inputModelData.mawb && localStorage.airinfo) {
                  JSON.parse(localStorage.airinfo).forEach(i => {
                    if (i.ThreeCode == this.inputModelData.mawb.substr(0, 3)) {
                      isexport = i.isexport;
                    }
                  });
                }
                return this.inputModelData.mawbss == "我司运单" && isexport == 1&& this.inputModelData.ismakemawb == 1;
            },
            isoutside(){//是否是外网订单
             return this.inputModelData.outsidedom == 'OUTSIDE'
            },
            isoutsideSystem(){//是否是外网系统
              return sessionStorage.system=='outside'
            },
            wffisimperfect(){//内网未完善
               return !this.isoutsideSystem&&this.inputModelData.isimperfect == 2
            },
            outsideDisabled(){//外网禁用的条件，未受理和未完善
                 return (this.inputModelData.outsidedom == 'OUTSIDE' && (this.inputModelData.status < 100 || this.inputModelData.isimperfect == 2))
            },
            contentClass(){
               return {
                    orderTakingPage: (this.inputModelData.status == 1 && this.isoutside) || this.outsideDisabled||this.wffisimperfect, 
                    xinkongPage: this.inputModelData.creditisbackstatus == 4 || this.inputModelData.creditisbackstatus == 5,
                    jumpPage: this.pagetype == 10 
                    }
            },
            dzmaketabs:{
                get(){
                        let tabs=[];
                        if(this.serviceSelArr.includes('AA0110')){
                            tabs.push({title:"总单制作",class: this.setTabBadgeType('AA0110'),ismawb:true,
                            showClose: this.inputModelData.area == '上海'&&this.isPaper
                            })
                        }

                        // if(!this.isPaper) {
                            tabs.push({title: 'Manifest制作',class:"badgeGray",ismanifest:true})
                        // }
                        // 单证制作分单tab => 单证制作修改 || 综合查询 || 客户综合查询 => 显示关闭按钮
                        if(this.serviceSelArr.includes('AA0120')){
                            tabs.push(...this.hawbTableData.map(i=>{return {title: i.hawb,ishawb:true,class: this.setTabBadgeType('AA0120'),showClose: this.inputModelData.area == '上海'&& (this.isPaper ||this.pagetype == '6' || this.pagetype == '14')}}))
                        }

                        return tabs 
                },set(val){
                    console.log(val)
                }
     
            },

            zhuYinIsdel() {//主营分配才显示Lable
                // if(this.inputModelData.serviceList.filter(i=>i.servicecode=="OA0010"&&i.isdel==2).length){
                //     return false
                // }else{
                //     return true
                // }  
                return true
            },
            iscomboineChildren() {//合并前的boae，groupid与boguid不同,合并后的cbo groupid也大于0但与boguid相同;合并前的boae的配货和分单查询的接口用列表中的oldhpoid
                return this.inputModelData.groupid > 0 && this.inputModelData.groupid != this.inputModelData.boguid
            },
            ifServiceAllBind() {
                //是否可绑定的服务已全部绑定
                let arr = this.inputModelData.serviceList.filter(
                    i => i.isdel == 1 && this.$store.state.rwxdArr.includes(i.servicecode)
                );
                return (
                    arr.length > 0 && arr.length == arr.filter(i => i.bindeguid > 0).length
                );
            },
            serviceSelDelGuid() {
                //已选择服务的guid,派遣单打印时候用
                return (
                    this.inputModelData.serviceList &&
                    this.inputModelData.serviceList
                        .filter(i => i.isdel == 1)
                        .map(e => e.guid)
                        .toString()
                );
            },
            showdzTab() {
                //是否显示单证确认tab
                let isexport = 0;
                if (this.inputModelData.mawb && localStorage.airinfo) {
                    JSON.parse(localStorage.airinfo).forEach(i => {
                        if (i.ThreeCode == this.inputModelData.mawb.substr(0, 3)) {
                            isexport = i.isexport;
                        }
                    });
                }
                return !(
                    this.inputModelData.ismakemawb == 1 &&
                    this.inputModelData.ismakehawb == 1 &&
                    this.inputModelData.mawbss == "我司运单" &&
                    isexport == 1
                );
            },
            isBognTesk() {
                //是否是任务下达
                return (
                    this.inputModelData.opersystem == "国内服务" &&
                    this.inputModelData.old_sendhpoid > 0
                );
            },
            activeNameSfg: {
                get() {
                    //return this.ifThird[0];
                },
                set(val) { }
            },
            showFwbjBtn() {
                //是否显示服务编辑按钮 
                //dzstatus 400是总单已确认   this.inputModelData.dzstatus <= 400 &&
                //cbo合并的订单不能编辑服务
                //外网订单不能保存
                return (
                    this.inputModelData.status < 500 && !this.isBognTesk && !this.orderFinish && this.inputModelData.iscomboine != 1 && !this.outsideDisabled&&!this.isoutsideSystem
                );
            },
            noNeedWage() {
                return ![
                    "YS0010",
                    "AA0230",
                    "AA0240",
                    "AG0110",
                    "AG0115",
                    "AG0120",
                    "AG0140",
                    "AG0125",
                    "AG0130",
                    "AG0135",
                    "AB0620",
                    "AB0420",
                    "AB0520",
                    "AA0810",
                    "AA0830",
                    "AA0840",
                    "AA0850"
                ].includes(this.finishServicecode);
            },
            ifOperSysHome() {
                //是否是国内服务
                return this.inputModelData.opersystem == "国内服务";
            },
            ifOperSysImport() {
                //是否是进口
                return this.inputModelData.opersystem == "进口";
            },
            hasMaincamp() {
                //true 为有主营

                // isshipace 1有主营 2无
                // var flag = false;
                // if (this.ordertype == 1) {
                //     flag = true;
                // }
                // if (this.ordertype == 2) {
                //     if (this.getServiceGuid("OA0010", "profitmode")) {
                //         flag = true;
                //     } else {
                //         flag = false;
                //     }

                // }
                // if (this.ordertype == 3) {
                //     if (this.getServiceGuid("OA0010", "profitmode")) {
                //         flag = false;
                //     } else {
                //         flag = true;
                //     }
                // }

                // return flag;
                return this.inputModelData.isshipace == 1
            },
            hawbArr() {
                var arr = [];
                this.hawbTableData.map(item => {
                    if (!item.khjcno) {
                        arr.push({
                            label: item.hawb,
                            value: item.hawb
                        });
                    }
                });
                return arr;
            },
            statusArr() { //分单已经配置的进仓编号
                var arr = [];
                this.hawbTableData.forEach(element => {
                    if (element.khjcno) {
                        arr = arr.concat(element.khjcno.split(","));
                    }
                });
                return arr;
            },
            serviceSelArr: {
                get() {
                    let arr = [];
                    // console.log(this.newService)
                    for (let i in this.newService) {
                        let item = this.newService[i];
                        if (item.model) {
                            arr.push(item.servicecode);
                        } else {
                            if (this.ifThird.includes(item.servicecode)) {
                                this.ifThird.splice(item.servicecode, 1);
                            }

                        }
                    }
                    return arr;
                },
                set(val) { }
            },
            isDistribution() {
                //判断是否是分配过来的
                var flag = false;
                if (this.ordertype == 1 && this.inputModelData.serviceList) {
                    this.inputModelData.serviceList.forEach(i => {
                        if (i.orderpgid != -1) {
                            flag = true;
                        }
                    });
                }
                return flag;
            }
        },
        mounted() { 
             // 判断默认激活tab页&&存在tab中    
            if ( this.defaultActiveName && this.cgportTtabs.find( item => item.tabcode === this.defaultActiveName) ) {
                this.activeName = this.defaultActiveName;
                this.ifThird.push(this.defaultActiveName);
                // 判断是单证制作，显示底部多功能菜单
                this.isPaper = this.defaultActiveName === 'tab1-dzmake';
            } else {
                this.isPaper = false;
            }
        },
        watch: {
            activeName(val, oldValue) {
                if(oldValue == 'tab1-third' && val == 'tab1-second') {
                    this.getMawbdetail()
                }
            },
            showTextarea(value) {
                if (value != -1) {
                    document.body.addEventListener("click", this.closeMenu);
                } else {
                    document.body.removeEventListener("click", this.closeMenu);
                }
            },
            "inputModelData.sfg"(val) {
                if (val && val.length == 3) {
                    if (this.hawbTableData.length > 0) {
                        this.hawbTableData.forEach(i => {
                            if (i.sfg.toUpperCase() != val.toUpperCase()) {
                                this.$message.error("总单始发港与分单始发港不同！");
                                return;
                            }
                        });
                    }
                }
            },
            "inputModelData.mdg"(val) {
                if (val) {
                    if (this.hawbForm.mdg.length != 3) {
                        this.hawbForm.mdg = this.inputModelData.mdg;
                    }
                }
            },
            "inputModelData.hbzl": {
                handler(val) {
                    setTimeout(() => {
                        [
                            "isinwageallin_trans",
                            "inwageallinprice_trans",
                            "second",
                            "zhanwei"
                        ].forEach(i => {
                            this.fareInputViewData[i].hidden = val == "直达";
                        });

                        [
                            "isoutwageallin_trans",
                            "outwageallinprice_trans",
                            "second",
                            "zhanwei"
                        ].forEach(i => {
                            this.yingfuViewData[i].hidden = val == "直达";
                        });
                    }, 0);
                },
                immediate: true
            },
            // "inputModelData.iszddl": {
            //     handler(val) {
            //         // this.inputModelData.zddlcode = val == 1 ? (this.inputModelData.zddlcode || 'WFF/SHA') : (this.inputModelData.zddlcode == 'WFF/SHA' ? '' : this.inputModelData.zddlcode)
            //         this.inputModelData.zddlcode = val == 1 ? 'WFF/SHA' : ''

            //     },
            //     immediate: false
            // },
            "inputModelData.czlx": {
                handler(val) {
                    this.$nextTick(() => {
                        if (val !== "代操作") {
                            [
                                "accountweightin",
                                "inwageallinprice_trans",
                                "second",
                                "zhanwei"
                            ].forEach(i => {
                                this.fareInputViewData[i].hidden =
                                    this.inputModelData.hbzl == "直达";
                            });
                        }

                        if (val == '自货') {
                            this.basicInformation.zzg.disabled = true;
                        } else {
                            this.basicInformation.zzg.disabled = false;
                        }

                    });
                },
                immediate: true
            },
            "inputModelData.bglx"(val) {
                // this.basicInformation.bgweight.required = !!val;
            },
            "inputModelData.bgweight"(val){
               if(!this.inputModelDataBackup.zdweight&&this.inputModelData.orderdom == "直单"&&val){
                   this.inputModelData.zdweight=Number(val).toFixed(2)
               }
            },
            "shipaceInfoData.loadingmodel": {
                handler(val) {
                    this.$nextTick(() => {
                        if (this.projectIsWecan) {
                            if (val == "装板") {
                                // this.shipaceInfoView.shipvendor.hidden = true;
                                this.shipaceInfoView.shipspace.hidden = false;
                            } else if (val == "自交接") {
                                // this.shipaceInfoView.shipvendor.hidden = true;
                                this.shipaceInfoView.shipspace.hidden = true;
                            } else {
                                // this.shipaceInfoView.shipvendor.hidden = true;
                                this.shipaceInfoView.shipspace.hidden = true;
                            }
                        }
                    });
                },
                immediate: true
            },
            "hawbForm.khjcno"(val) {
                if (val) {
                    //console.log(val)
                    if (this.putIndex == -1) {
                        this.hawbSelFunc(val);
                    }
                }
            },
            saveNumberList(val, old) {

                /*       var piece = 0;
                var weight = 0;
                var volume = 0;
    
                this.saveNumberList.forEach(element => {
                  piece += Number(element.piece);
                  weight += Number(element.weight);
                  volume += Number(element.volume);
                });
    
                this.inputModelData.realpiece = piece;
                this.inputModelData.realweight = weight.toFixed(2);
                this.inputModelData.realvolume = volume.toFixed(3);
                this.inputModelData.zdpiece = piece; */
                // console.log('新增或修改进仓编号');
                // console.log(JSON.stringify(val) !== JSON.stringify(old))
                if (JSON.stringify(val) !== JSON.stringify(old)) {

                    this.$refs.danhaoConfirm && this.$refs.danhaoConfirm.getRealList();

                    this.$refs.danhaoConfirm && this.$refs.danhaoConfirm.getHawbList();

                    this.$refs.danzhengConfirm && this.$refs.danzhengConfirm.getRealList();

                    this.$refs.danzhengConfirm && this.$refs.danzhengConfirm.getHawbList();
                }

            },
            hawbTableData: {
                handler(val) {
                    if (this.pageFrom == "order") {
                        //  console.log(val);
                        this.odConfirm = val.some(item => {
                            return item.dzstatus < 120;
                        });
                        //  console.log(this.odConfirm);
                    } else if (this.pageFrom == "document") {
                        this.odConfirm = val.some(item => {
                            return item.dzstatus < 150;
                        });
                    }
                    //console.log(val)
                },
                deep: true
            },
            pageFrom: {
                handler(val) {
                    //alert(val)
                    if (val && this.inputModelData.orderdom != "直单" && this.inputModelData.orderdom != "分单") {
                        this.ifSecond.push("tab1-forth");
                        this.activeName = "tab1-forth";

                        this.$axios({
                            method: "get",
                            url: this.$store.state.webApi + "api/ExAxplineService",
                            loading: false,
                            params: {
                                boguidlist: this.boguid
                            },
                            tip: false
                        })
                            .then(results => {
                                var attachsfgShow = [];
                                var aloneothersfgShow = [];
                                var typenamesfg = "";
                                var servicecodesfg = ""

                                var attachmdgShow = [];
                                var aloneothermdgShow = [];
                                var typenamemdg = "";

                                // 分配显示的数据
                                results.data.forEach(item => {
                                    if (item.assignstatus == 1) {
                                        if (item.servicetype == "Attach") {
                                            typenamesfg += item.assignname + ",";
                                            servicecodesfg += item.servicecode + ',';
                                            attachsfgShow[0] = item;
                                            attachsfgShow[0].assignname = typenamesfg.substring(
                                                0,
                                                typenamesfg.length - 1
                                            );
                                            attachsfgShow[0].servicecode = servicecodesfg.substring(
                                                0,
                                                typenamesfg.length - 1
                                            );
                                        } else {
                                            aloneothersfgShow.push(item);
                                        }
                                        //console.log(attachsfgShow)
                                        this.assignXsDataSfg = attachsfgShow.concat(
                                            aloneothersfgShow
                                        );
                                    }
                                });
                            })
                            .catch(errors => { });
                    }
                },
                immediate: true
            }
        }
    };
/*
            initAllData 初始所有数据
            servicesDisabled 控制服务面板的权限
            btnJurisdic   控制按钮显示权限
            peicheBill    派车单
            isServiceAllFinish 判断所有小服务是否已经完成
            setAccountweightout 计算结算重量
            initFunc       修改费用后，重新取值，重置状态
            getMawbGys 获取总单供应商的数据
            openDialogJh  交货文件地址
            openServiceFinish  打开服务完成的弹窗
            serviceFinishFunc 服务完成与取消完成，总单制单及后面的小服务
            isServiceFinish  服务是否完成
            qfsjDialogFunc 起飞时间维护地址
            submit 提交结算
            tabclick 判断tab是否是初次打开
            getAreaPrice 总单杂费
            setIncidentalWage 设置应收应付的杂费数据
            handleO 受理
            backO 退回
            assignXsPlation 分配至销售站查询
            assignCzPlation 分配信息操作站查询
            closeDialog 关闭弹窗
            relieveMawbConfig 点击解除总运单
            choiseDialogMawb 选择总单配置弹窗里面总运单，获取当行数据
            mawbConfigFunc 配置总运单
            initHawbForm 重置分单配置进仓编号的表单
            hawbChange 分单切换
            getServiceNodeData 获取服务节点
            getMawbdetail  获取总单详细信息
            getJjdFunc 设置交接地数据
            getMawbCost 获取总单费用信息
    
            hawbSelFunc 选中进仓编号,分单配置进仓编号里面的
            changeIndex 大模块，一级tab初次切换
            getHawbForm 获取分单配置进仓编号表单数据
            saveHawbForm 保存分单信息
            addHawbList 分单批量新增
            upHawbList 分单详细修改
            setHawbForm
            resetHawbForm
            delHawbForm
            selOptionShow 判断进仓编号是否已经使用
            getServiceGuid   获取服务节点参数
            orderFinishFunc 点击总单完成
            wtdataP
            flightAssFunc 配舱
            getInfo 获取总单表单信息
            getHawbNum 获取分单号
            saveMawbInfo 保存总单数据
            operationSave WFF操作
            saveJcnoinfo 保存进仓编号信息
            getQfsj 起飞时间
            edit_node_success
            saveServiceFunc 保存服务信息
            getJsxmData 设置四个大服务完成时的节点与费用数据
            cancelOrderFunc 1 撤单 2 配货完成 3取消配货
            setRound 校正重量的值
            JudgeBubblesFunc 1判断实际计重 2，制单计重
    
            计算属性
            hasMaincamp
            allDisabled
            hawbArr
            statusArr
            isDistribution
    
    */
</script>

<style lang="less" scoped>
    .mawbAddPut {
        .detail {
            margin-bottom: 20px;
            border: 1px solid #e8e8e8;

            &:last-child {
                margin-bottom: 0;
            }

            .detail-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 32px;
                text-indent: 8px;
                font-size: 14px;
                font-weight: bolder;
                color: #0f5a8c;
                background: #f8f8f8;
                border-bottom: 1px solid #e8e8e8;
            }

            .detail-c {
                padding: 20px;
            }
        }

        .basic-information {
            /deep/ .el-date-editor.el-input {
                width: 100%;
            }

            /deep/ .el-input__icon {
                line-height: 28px;
            }
        }

        .mdgserviceTitle,
        .sfgserviceTitle {
            margin-top: 20px;
            margin-left: 6px;
            width: 145px;
            height: 28px;
            font-size: 14px;
            color: #333;
            font-weight: bolder;
        }

        .footer {
            overflow: hidden;
            margin-top: 25px;

            .left-btn {
                float: left;
            }

            .right-btn {
                float: right;
            }
        }
    }

    .imul {
        font-style: normal;
        display: inline-block;
        width: auto;
    }

    .forstLevel {
        display: flex;
        align-items: center;
        height: 50px;

        i {
            width: 8px;
            height: 8px;
            display: inline-block;
            background: #0f5a8c;
            margin-right: 5px;
        }

        >div {
            span:first-child {
                border-radius: 4px 0px 0px 4px;
            }

            span:last-child {
                border-radius: 0px 4px 4px 0px;
            }
        }

        span {
            height: 28px;
            line-height: 28px;
            //margin-right: 25px;
            padding: 14px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            color: #999999;
            //margin-right: 12px;
            background-color: #e8e8e8;
            //border-radius: 4px;
        }

        span.checked {
            //color: #256998;
            background-color: #0F5A8C;
            color: #fff;
            border-radius: 4px !important;
        }
    }

    /* .content {
  /deep/ .el-tabs__header {
    max-width:1400px;
    width:calc(100% - 120px);
  }
} */

    .content .el-tab-pane {
        padding: 0px;
    }

    .fdpzPanel {
        /deep/ .el-form-item {
            min-width: 300px;
            font-size: 12px;
        }

        /deep/ .el-input__inner {
            width: 167px;
        }
    }

    .infoPane(@minw, @lin) {
        /deep/ .el-form-item {
            min-width: @minw;
        }

        /deep/ .el-form-item__label {
            line-height: @lin;
            color: #333;
            font-size: 12px;
        }
    }

    .maPane {
        .infoPane(400px, 28px);
    }

    .zdPane {
        .infoPane(260px, 40px);
    }

    .sanjiao {
        width: 130px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 26px solid transparent;
        color: #fff;
    }

    .test(@color) {
        border: 1px solid #fff !important;

        .sanjiao {
            border-bottom-color: @color;
        }

        .detail-title p {
            &:extend(.sanjiao);
            border-bottom-color: @color;
        }

        .detail-c {
            border: 1px solid @color;
        }
    }

    .detail-title p {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }

    .detailPaneBlue {
        .test(#0f5a8c);
    }

    .detailPaneRed {
        .test(red);
    }

    .detailPaneYoung {
        .test(#00cc00);
    }

    .el-form-item {
        margin-bottom: 0px;
    }

    .fpTable {
        width: 100%;
        text-align: center;
        margin-top: 28px;
    }

    .fpTable tr {
        height: 36px;
        line-height: 36px;
    }

    .fpTable tr th,
    .fpTable tr td {
        border: 1px solid #e8e8e8;
    }

    .fenpei .fdzy {
        font-weight: bold;
        font-size: 14px;
    }

    .lrfp {
        margin-bottom: 20px;
        padding-bottom: 20px;

        p {
            margin-bottom: 13px;
            font-size: 14px;

            span {
                display: inline-block;

                &:nth-child(1) {
                    min-width: 100px;
                    width: 100px;
                    text-align: right;
                    margin-right: 12px;
                }

                &:nth-child(2) {
                    min-width: 100px;
                    width: 100px;
                    text-align: left;
                }
            }
        }

        .profitvalue {
            span {
                &:nth-child(2) {
                    min-width: 60px;
                    width: 60px;
                    text-align: left;
                }

                &:nth-child(3) {
                    min-width: 40px;
                    width: 40px;
                    text-align: left;
                }

                &:nth-child(4) {
                    min-width: 60px;
                    width: 40px;
                    text-align: right;
                    margin-right: 12px;
                }

                &:nth-child(5) {
                    min-width: 40px;
                    width: 40px;
                    text-align: left;
                }
            }
        }

        .green {
            color: green;
        }
    }

    .coload {
        p {
            margin-bottom: 13px;
            font-size: 14px;

            span {
                display: inline-block;

                &:nth-child(1) {
                    min-width: 100px;
                    width: 100px;
                    text-align: right;
                    margin-right: 12px;
                }

                &:nth-child(2) {
                    min-width: 120px;
                    width: 120px;
                    text-align: left;
                }
            }
        }

        .profitvalue {
            span {
                &:nth-child(2) {
                    min-width: 60px;
                    width: 60px;
                    text-align: left;
                }

                &:nth-child(3) {
                    min-width: 40px;
                    width: 40px;
                    text-align: left;
                }

                &:nth-child(4) {
                    min-width: 60px;
                    width: 40px;
                    text-align: right;
                    margin-right: 12px;
                }

                &:nth-child(5) {
                    min-width: 40px;
                    width: 40px;
                    text-align: left;
                }
            }
        }

        .green {
            color: green;
        }
    }

    .dialogImgDoc {
        /deep/ .el-dialog__body {
            padding: 0px;
            height: calc(100% - 40px);
        }

        /deep/ .el-dialog {
            height: 100%;
        }
    }

    .paneDisabled {
        cursor: not-allowed;

        >div {
            pointer-events: none;
        }

        /deep/ button {
            // pointer-events: all;
        }

        /deep/ input {
            pointer-events: none;
           
        }

        /deep/  .input-required input{
                background-color: #F0F0F0;
         }
        /deep/ .el-input__suffix-inner {
            pointer-events: none;
        }

        /deep/ .add-hawb {
            pointer-events: none;
        }

        /deep/ .icon-c {
            pointer-events: none;
        }

        /deep/ td {
            pointer-events: none;
        }

        /deep/ .tabs-header {
            pointer-events: all;
        }

        /deep/ .hide-tabs {
            pointer-events: all;
        }

        /deep/ #khjcno {
            pointer-events: all;
            cursor: pointer;
        }

        /deep/ #hwlx {
            pointer-events: all;
            cursor: pointer;
        }

        /deep/ #tradeterm {
            pointer-events: all;
            cursor: pointer;
        }

        /deep/ .el-tabs__nav {
            pointer-events: all;
        }
    }

    .bgFinishDis {
        /deep/ .add-hawb {
            pointer-events: none;
        }

        /deep/ .icon-c {
            pointer-events: none;
        }

        /deep/ .tabs-header {
            pointer-events: all;
        }

        /deep/ .el-tabs__nav {
            pointer-events: all;
        }
    }

    .finishIcno {
        display: inline-block;
        width: 36px;
        height: 28px;
        position: absolute;
        top: 6px;
        left: 35px;
        background: url(../../../boStatic/images/finish.png);
        background-size: 100% 100%;
    }

    .finishBtn {
        float: right;
        margin-right: 2px;
    }

    .numspan {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 28px;
        border: 1px solid #dcdfe6;
        border-radius: 0px;
        cursor: pointer;
        color: #3d6891;
        user-select: none;
        border-right: none;
    }

    .inwageal {
        /deep/ .el-input {
            top: -1px;
        }

        /deep/ input {
            border-radius: 0px;
            border-right: none;
        }
    }

    .orderTakingPage,.xinkongPage {
        //订单受理页，把按钮都去掉
       /deep/ button{
            display: none;
        }

         .peihuodetail,.expansion-hawb{
            button{
                display: inline-block;
            }
        }
         button[btnnum="240"] {
            display: inline-block;
        }

         button[notHide] {
            display: inline-block;
        }
    }

    .jumpPage {
        /deep/ button:not(.expansion-hawb) {
            display: none;
        }
    }

    .makingBillPage {
        cursor: not-allowed;

        /deep/ div {
            pointer-events: none;
        }
    }

    .finishInfo {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        align-items: center;

        >div {
            display: flex;
            align-items: center;
            height: 100%;
        }

        >div:first-child {
            flex: 1;
        }
    }

    .finishDetail {
        .detail-title {
            border-bottom: none !important;
        }

        .detail-c {
            padding: 0px !important;
        }
    }

    .shuoding {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        background-size: cover;
        vertical-align: -5px;
        margin-left: 5px;
    }

    .lock {
        background-image: url(../../../boStatic/images/lock.png);
    }

    .pointerAll {
        pointer-events: all;
    }

    /deep/ .el-tabs--border-card>.el-tabs__header {
        //width:calc(100% - 120px);
        padding-right: 130px;
        min-height: 42px;

    }

    .iconTruck {
        width: 18px;
        height: 18px;
        font-size: 18px;
        cursor: pointer;
        margin-top: 5px;
        margin-left: 20px;
        color: #0f5a8c;
    }

    .signApplicationInfo {
        p {
            margin: 14px 0px;
            display: grid;
            grid-template-columns: 200px auto;
            align-items: center;
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

    .servicePort {
        .el-tabs__item {
            /* line-height: inherit; */
            /* vertical-align: bottom; */
            min-height: 42px;
            margin-top: -2px !important;
            padding: 0px!important;
            /* height: auto; */
            line-height: 18px;
            display: inline-grid;
            place-items: center;
            &:first {
                vertical-align: top;
            }
        }
    }
    .badgeGrey{
        background-color: #F5F7FA;
        display:flex;
        align-items: center;
    }
    .is-active{
        .badgeGrey{
            color:#666
        }
    }
.serviceTabs{
    position:relative;
    padding-top:56px;
    >div{
       margin-bottom: 10px;
       display:flex; 
    }

     .badgeLabel{
        cursor:pointer;
        min-width:110px;
        display:grid;
        place-items:center;
        border: 1px solid #DCDFE6;
        height:46px;    
    }
    .servicetitle{
        margin-top: -2px;
        font-weight: bold;
        padding:3px 0;
        .badgeLabel;
    }
    .is-active{
     background-color:#0F5A8C ;
     color:#fff;
     font-weight:bold;
    }
  
}
   /deep/.mawbDialog{
    border-radius: 8px;
        .el-dialog__header{
           text-align:center;
           font-weight:bold;
        }
        .spanTitle{
            display:inline-block;
            width:400px;
            .titleColor{
                color:red;
            }  
        }

    }

    .airPlaneDeatil {
        margin-top: -20px;
        /deep/.left-item {
            width: 470px  !important;
            left: 50px;
        }
        /deep/.content-pay {
            width: 1300px !important;
        }
    }
</style>