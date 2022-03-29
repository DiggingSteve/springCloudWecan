<template>
    <div class="mawbAddNew">
        <!-- {{inputModelData}} -->
        <!-- {{inputModelData.khjcnolist}} -->
        <!-- {{area}} -->
        <!-- {{system}} -->
        <!-- {{inputModelData.ispay_pre}} -->
        <!-- {{importMawbData}} -->
        <!-- {{areaStateCode}} -->
        <!-- {{system}} -->
        <!-- {{orderdom}}
    {{orderdomAdd}}-->
        <!-- {{opersystemdom}} -->
        <!-- {{inputModelData}} -->
        <!-- {{serviceList}} -->
        <!-- {{newService}} -->
        <!-- <el-button @click="peicheBill(2)"  type="primary">打印流转单</el-button> -->
        <!-- {{inputModelData}} -->
        <!-- {{basicInformation}} -->
        <!-- {{opersystem}} -->
        <!-- {{inputModelData.serviceList}} -->
        <!-- <hr> -->
        <!-- {{serviceSelArr}} -->
        <!-- {{inputModelData.serviceList}}  -->
        <!-- {{customerRelList}} -->
        <div class="page" v-show="page==1">
            <div class="detail" style="position:relative">
                <div class="detail-title">
                    <p>请选择服务项目</p>
                </div>
                <div class="detail-c">
                    <div style="position:absolute;top:3px;right:0px;display:flex;padding-right:5px;">
                        <tempConfig :name="name" v-if="initCompt" :initCompt.sync="initCompt" :system="system"
                            :type="80" :jsondata.sync="serviceList"></tempConfig>

                        <mawbImport v-if="orderdom == '总单' && !isMawbImport&&system=='空出'" class="mawb-import"
                            :area="area"></mawbImport>
                    </div>

                    <el-form size="medium" class="orderdomRadio" style="margin-left:-8px;margin-bottom:20px;"
                        v-show="(opersystem&&opersystem!=='国内服务')">
                        <el-form-item label="选择新增上榜类型">
                            <el-radio v-model="orderdomAdd" label="总单">总单上榜</el-radio>
                            <el-radio v-model="orderdomAdd" label="直单">直单上榜</el-radio>
                            <el-radio v-model="orderdomAdd" label="分单" v-if="$store.state.ifMergeHawb&&projectIsWecan">
                                分单上榜</el-radio>
                        </el-form-item>
                    </el-form>

                    <serviceList pagetype="1" :newService.sync="newService" :opersystem="opersystem"
                        :orderdom="orderdom" :system="system"></serviceList>
                </div>
            </div>

            <div style="display:flex;justify-content:flex-end;">
                <el-button @click="nextPageFunc(2)">下一步</el-button>
            </div>
        </div>

        <div class="page" v-show="page==2">
            <div class="detail basic-information">
                <div class="detail-title">
                    <p>基本信息</p>
                </div>
                <div class="detail-c">
                    <!-- <mawbImport v-if="orderdom == '总单' && !isMawbImport" class="mawb-import"></mawbImport> -->

                    <newFormCmpt :system="system" :view-data.sync="homeInformation" :model-data.sync="inputModelData"
                        :pagetype="2" @wtdataP="wtdataP" v-show="opersystem=='国内服务'" :area="area"
                        @changeRelData="customerRelList = $event" style="max-width:1260px">
                        <template slot="khjcnolist">
                            <enterWarehouseBogn :khjcnolist="inputModelData.khjcnolist"
                                :inputModelData="inputModelData"></enterWarehouseBogn>
                        </template>
                    </newFormCmpt>

                    <newFormCmpt :system="system" :view-data.sync="basicInformation" :model-data.sync="inputModelData"
                        :area="area" :pagetype="2" @wtdataP="wtdataP" v-show="opersystem!='国内服务'" ref="formCompt"
                        @changeRelData="customerRelList = $event">
                        <template slot="mawbAe">
                            <el-input v-model.lazy="inputModelData.mawb" style="width:240px;"
                                :disabled="importActiveName === 'repeatOrder'" clearable
                                v-verify="basicInformation.mawbAe.verify" maxlength="12"></el-input>
                                <!-- @@暂时去掉总运单维护图标 -->
                           <!--  <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialogFunc"
                                style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:10px;top:2px"></i> -->
                            <span style="margin-left:30px;" v-if="mawbgys">运单供应商：{{mawbgys.split('-')[1]}}</span>
                            <!-- <span style="margin-left:20px;" v-if="inputModelData.zddlcode">制单代理代码：{{inputModelData.zddlcode}}</span>
              <span style="margin-left:10px;" v-if="inputModelData.zddlzh">制单代理账号：{{inputModelData.zddlzh}}</span>
              <span style="margin-left:10px;" v-if="inputModelData.zdiatacode">制单IATA代码：{{inputModelData.zdiatacode}}</span>-->
                        </template>
                        <template slot="exForm1">
                            <hwxzCompt :inputModelData="inputModelData"></hwxzCompt>
                        </template>
                    </newFormCmpt>
                </div>
            </div>

            <div class="detail" id="farePane" v-if="inputModelData.czlx!='代操作'&&opersystem=='出口'">
                <div class="detail-title">
                    <p>应收运费信息</p>
                </div>
                <div class="detail-c">
                    <newFormCmpt :view-data.sync="fareInputViewData" :model-data.sync="inputModelData" :area="area"
                        :pagetype="2" class="farePane" @inwageallinpriceFunc="inwageallinpriceFunc"></newFormCmpt>
                </div>
            </div>
            <!--
入唯凯仓 AA0410
唯凯报关 AA0610
唯凯提货 AA0510
唯凯制作总单 AA0110
唯凯制作分单 AA0120
唯凯制作Manifest AA0130
唯凯制作总标签 AA0310
唯凯制作分标签 AA0320
唯凯安检 AA0230
唯凯交单 AA0240
快递服务 AG0110
磁检服务 AG0115
改包装服务 AG0120  多条
化工鉴定 AG0125
      挂衣服务 AG0130 多条

      材料提供服务 AA0810 多条
特种铲车服务  AA0830
分货服务   AA0840  只有公共字段
装卸服务  AA0850 只有公共字段
仓储-国内 AG0145
报关-国内 AG0150

      -->
            <div v-if="opersystem=='国内服务'">
                <!-- 始发港入唯凯仓 -->
                <myServicePane code="AA0410">
                    <template slot="extraComp">
                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList" :piece="inputModelData.piece">
                        </storeCompSize>
                    </template>
                </myServicePane>

                <myServicePane code="AG0145">
                    <template slot="extraComp">
                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList" :piece="inputModelData.piece">
                        </storeCompSize>
                    </template>
                </myServicePane>

                <!-- 目的港入唯凯仓 -->
                <myServicePane code="AB0420">
                    <template slot="extraComp">
                        <storeCompSize :storeList.sync="inputModelData.ybstorevolumeListMdg"
                            :piece="inputModelData.piece"></storeCompSize>
                    </template>
                </myServicePane>

                <!-- 唯凯提货 -->
                <myServicePane code="AA0510">
                    <template slot="extraComp">
                        <takeGoodsAdd :inputModelData.sync="inputModelData" ref="takeGoodsAddRef" id="ybTransstoreList">
                        </takeGoodsAdd>
                    </template>
                </myServicePane>

                <!-- 唯凯送货 -->
                <myServicePane code="AB0520">
                    <template slot="extraComp">
                        <takeGoodsAddMdg :inputModelData="inputModelData" ref="takeGoodsAddRefMdg"
                            id="ybTransstoreListMdg"></takeGoodsAddMdg>
                    </template>
                </myServicePane>

                <!-- 唯凯报关 -->

                <myServicePane code="AA0610">
                    <template slot="extraComp">
                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"></declareAtcustomsAdd>
                    </template>
                </myServicePane>

                <myServicePane code="AG0150">
                    <template slot="extraComp">
                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"></declareAtcustomsAdd>
                    </template>
                </myServicePane>

                <!-- 唯凯清关 -->
                <myServicePane code="AB0620">
                    <template slot="extraComp">
                        <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="2"></declareAtcustomsAdd>
                    </template>
                </myServicePane>

                <!-- 总单分单制作 -->
                <el-tabs type="border-card" v-if="serviceSelArr.includes('AA0110')||serviceSelArr.includes('AA0120')"
                    style="margin-bottom:20px">
                    <el-tab-pane label="总单制作" v-if="serviceSelArr.includes('AA0110')">
                        <makingBill style="border:1px solid #e8e8e8" ref="makingbillmawb" orderdom="总单"
                            :mawbinfo="inputModelData" :mawbguid="-1" :pagetype="2"></makingBill>
                    </el-tab-pane>
                    <el-tab-pane label="分单制作" v-if="serviceSelArr.includes('AA0120')">
                        <makingBill style="border:1px solid #e8e8e8" ref="makingbillhawb" orderdom="分单"
                            :mawbinfo="inputModelData" :mawbguid="-1" :pagetype="2"></makingBill>
                    </el-tab-pane>
                </el-tabs>

                <!--快递服务 -->
                <myServicePane code="AG0110"></myServicePane>

                <!--唯凯安检 -->
                <myServicePane code="AA0230"></myServicePane>

                <!--唯凯交单 -->
                <myServicePane code="AA0240"></myServicePane>

                <!--磁检服务 -->
                <myServicePane code="AG0115"></myServicePane>

                <!--改包装服务 -->
                <!-- <div class="detail" v-if="serviceSelArr.includes('AG0120')">
          <div class="detail-title">
            <p>{{getSerCodeInfo('AG0120')}}</p>
            <serviceItemSmall :text.sync="newService['AG0120'].oprequest"></serviceItemSmall>
          </div>
          <div class="detail-c">
            <newFormCmpt
              :view-data.sync="serviceViewData['AG0120ViewData']"
              :model-data.sync="inputModelData"
              :pagetype="2"
            >
              <template :slot="listView['AG0120']">
                <listViewSlot code="AG0120"></listViewSlot>
              </template>

                <template :slot="listView['AG0120pm']">
                <listViewSlot code="AG0120pm"></listViewSlot>
              </template>

            </newFormCmpt>
          </div>
        </div>-->

                <myServicePane code="AG0120">
                    <template slot="extraComp">
                        <listViewSlot code="AG0120"></listViewSlot>
                        <listViewSlot code="AG0120pm"></listViewSlot>
                    </template>
                </myServicePane>

                <!-- 材料提供服务 -->

                <myServicePane code="AA0810">
                    <template slot="extraComp">
                        <listViewSlot code="AA0810"></listViewSlot>
                    </template>
                </myServicePane>

                <!--特种铲车服务   -->
                <myServicePane code="AA0830"></myServicePane>

                <!--分货服务   -->
                <myServicePane code="AA0840"></myServicePane>

                <!--装卸服务   -->
                <myServicePane code="AA0850"></myServicePane>

                <!--化工鉴定 -->

                <myServicePane code="AG0125"></myServicePane>

                <!--挂衣服务 -->

                <myServicePane code="AG0130">
                    <template slot="extraComp">
                        <listViewSlot code="AG0130"></listViewSlot>
                        <listViewSlot code="AG0130pm"></listViewSlot>
                    </template>
                </myServicePane>

                <!--贴签服务 -->
                <myServicePane code="AG0135"></myServicePane>
            </div>

            <div class="footer" v-if="opersystem=='国内服务'">
                <el-button @click="pageForward(1)">上一步</el-button>
                <div class="right-btn">
                    <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(1)" type="primary">保存待处理</el-button>
                    <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(2)" type="primary">保存并分配</el-button>
                    <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(3)" type="primary">保存并完成</el-button>
                    <el-button :disabled="saveBtnDisabled" @click="saveMawbInfo" type="primary">{{areaStateCode}}操作
                    </el-button>
                </div>
            </div>

            <div style="display:flex;justify-content:space-between;margin-top:20px" v-if="opersystem!='国内服务'">
                <el-button @click="pageForward(1)">上一步</el-button>
                <el-button @click="nextPageFunc(3)">下一步</el-button>
            </div>
        </div>

        <div class="page" v-show="page==3">
            <!-- 总单信息摘要 -->
            <div class="showpanediv" style="background-color:#FFFDF1">
                <div class="showpaneinfo" style="width:100%;background-color:#FFF8EF">
                    <div>
                        <span>委托客户：</span>
                        <span>{{ inputModelData.wtkhname}}</span>
                    </div>
                    <div>
                        <span>项目：</span>
                        <span>{{ inputModelData.wtxmname}}</span>
                    </div>
                    <!-- <div><span>总运单号：</span><span>{{ inputModelData.hawb}}</span></div> -->
                    <div>
                        <span>预报件/重/体：</span>
                        <span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight).toFixed(2)||0.00}}/{{
                            Number(inputModelData.ybvolume).toFixed(3)||0.000}}</span>
                    </div>

                    <div></div>
                </div>

                <div class="showpaneinfo" style="width:100%">
                    <div>
                        <span>始发港：</span>
                        <span>{{ inputModelData.sfg}}</span>
                    </div>
                    <div>
                        <span>目的港：</span>
                        <span>{{ inputModelData.mdg}}</span>
                    </div>
                    <div>
                        <span>航班号：</span>
                        <span>{{ inputModelData.hbh}}</span>
                    </div>
                    <div>
                        <span>航班日期：</span>
                        <span>{{ inputModelData.hbrq | formatDate('yyyy-MM-dd')}}</span>
                    </div>
                </div>
            </div>

            <div v-if="opersystem!='国内服务'">
                <div class="detail">
                    <div class="detail-title">
                        <p>进仓编号操作</p>
                    </div>
                    <el-collapse-transition>
                        <div>
                            <div class="detail-c">
                                <!-- {{saveNumberList}} -->
                                <!-- {{inputModelData.ybpiece}} -->
                                <!-- <enterWarehouseNumber :saveNumberList="saveNumberList" :mawb="inputModelData.mawb" :statusArr="statusArr" :piece="opersystem=='国内服务'?inputModelData.piece:inputModelData.ybpiece" :weight="opersystem=='国内服务'?inputModelData.weight:inputModelData.ybweight" :volume="opersystem=='国内服务'?inputModelData.volume:inputModelData.ybvolume"></enterWarehouseNumber> -->
                                <enterWarehouseNumber :saveNumberList="saveNumberList"
                                    :mawb="localArea==conditionalAreaForBuild?'':inputModelData.mawb"
                                    :statusArr="statusArr" :piece="inputModelData.ybpiece"
                                    :weight="inputModelData.ybweight" :volume="inputModelData.ybvolume"
                                    :isMawbImport="isMawbImport" :serviceSelArr="serviceSelArr"
                                    :czlx="inputModelData.czlx"></enterWarehouseNumber>
                                <!-- <div style="text-align:right;margin-right:40px;"><el-button type="primary" @click="saveJcnoinfo">确定</el-button></div> -->
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>

                <div class="detail" v-if="orderdom=='总单'" v-enterfocus>
                    <div class="detail-title" style="justify-content: space-between;cursor:pointer"
                        @click="hawbKhjcnoShow=!hawbKhjcnoShow"
                        :style="{'border-bottom-width':!hawbKhjcnoShow?'0px':'1px'}">
                        <p>分单配置进仓编号操作</p>
                        <span style="color:#999;margin-right:6px;cursor:pointer">
                            {{hawbKhjcnoShow?'点击折叠':'点击展开'}}
                            <i :class="[!hawbKhjcnoShow?'el-icon-caret-bottom':'el-icon-caret-top']"
                                style="font-size:18px"></i>
                        </span>
                    </div>
                    <el-collapse-transition>
                        <div class="detail-c fdpzPanel" v-show="hawbKhjcnoShow">
                            <el-form ref="form" label-width="110px" :inline="true">
                                <!-- {{hawbForm}} -->
                                <el-row>
                                    <el-form-item label="分运单号：">
                                        <el-input v-model="hawbForm.hawb"></el-input>
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
                                            <el-option v-for="item in saveNumberList" :key="item.khjcno"
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

                                    <el-form-item label="目的港：">
                                        <el-input v-model="hawbForm.mdg" v-verify="'sfgmdg'"></el-input>
                                    </el-form-item>
                                </el-row>

                                <el-row>
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
                                </el-row>
                                <el-row>
                                    <el-form-item label="实际件数：">
                                        <span>{{hawbForm.realpiece}}</span>
                                    </el-form-item>

                                    <el-form-item label="实际重量：">
                                        <span>{{hawbForm.realweight}}</span>
                                    </el-form-item>
                                    <el-form-item label="实际体积：">
                                        <span>{{hawbForm.realvolume}}</span>
                                    </el-form-item>
                                </el-row>
                            </el-form>

                            <div style="margin-right:40px;">
                                <el-button type="primary" size="mini" @click="saveHawbForm">保存</el-button>
                            </div>
                            <div style="width:800px;margin-top:20px;">
                                <!-- {{hawbTableData}}
                {{statusArr}}-->
                                <commonTable :head="hawbTableHead" :table-data="hawbTableData">
                                    <template slot="operate" slot-scope="props">
                                        <i class="el-icon-setting" @click="setHawbForm(props.data.index)"></i>
                                        <i class="el-icon-delete" @click="delHawbForm(props.data.index)"></i>
                                    </template>
                                </commonTable>
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>

                <div class="detail">
                    <div class="detail-title" style="justify-content: space-between;cursor:pointer"
                        @click="orderdomSfhrShow=!orderdomSfhrShow"
                        :style="{'border-bottom-width':!orderdomSfhrShow?'0px':'1px'}">
                        <p>{{orderdom}}收发货人信息</p>
                        <span style="color:#999;margin-right:6px;cursor:pointer">
                            {{orderdomSfhrShow?'点击折叠':'点击展开'}}
                            <i :class="[!orderdomSfhrShow?'el-icon-caret-bottom':'el-icon-caret-top']"
                                style="font-size:18px"></i>
                        </span>
                    </div>

                    <el-collapse-transition>
                        <div v-show="orderdomSfhrShow">
                            <div class="detail-c">
                                <!-- {{mawbRSinfo}} -->
                                <!-- <mawbRevSed :hawbRSinfo="mawbRSinfo"></mawbRevSed> -->
                                <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSed" v-if="orderdom!='分单'">
                                </revSedMawb>
                                <revSedHawb :dzinfo="inputModelData" ref="makeBillRevSedHawb" v-if="orderdom=='分单'">
                                </revSedHawb>
                            </div>
                        </div>
                    </el-collapse-transition>
                </div>

                <div style="margin-top:20px;" v-if="orderdom=='总单'&&initCompt">
                    <hawbtabs :mawbdetail="inputModelData" ref="hawbtab"></hawbtabs>
                </div>
            </div>

            <div class="footer">
                <el-button @click="page=2">上一步</el-button>
                <el-button @click="initDataFunc">重置</el-button>
                <div class="right-btn" v-if="!isMawbImport">
                    <!-- {{inputModelData.czlx}} -->

                    <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(1)" type="primary">保存待处理</el-button>
                    <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(2)" type="primary" v-if="orderdom!=='分单'">
                        保存并分配</el-button>

                    <el-button :disabled="saveBtnDisabled" v-if="orderdom!=='分单'" @click="saveMawbInfo" type="primary">
                        {{areaStateCode}}操作</el-button>
                </div>
            </div>
        </div>

        <!-- 分配 -->
        <el-dialog :visible.sync="assignShow" :close-on-click-modal="false" v-if="assignShow" append-to-body
            width="1300px" top="0" @close="assignShowDelete(1)">
            <fenpei :fenpeiguid="mawbguid" @back="assignShowDelete(1)" :system="system" :new-add="1"></fenpei>
        </el-dialog>

        <!-- 费用 -->
        <el-dialog :visible.sync="costShow" :close-on-click-modal="false" v-if="costShow" append-to-body width="1300px"
            top="4%" @close="assignShowDelete(2)">
            <!-- {{serviceSelArr}} -->
            <costTable pagetype="2" wageinout="2" :servicecode="serviceSelArr.toString()" :serviceSelArr="serviceSelArr"
                :mawbinfo="inputModelData"></costTable>
            <costTable pagetype="2" wageinout="1" :serviceSelArr="serviceSelArr" :servicecode="serviceSelArr.toString()"
                :mawbinfo="inputModelData"></costTable>
        </el-dialog>

        <el-dialog title="配置总单" :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" append-to-body
            :close-on-click-modal="false" width="1200px">
            <div class="detail">
                <div style="position:relative;top:-16px;">
                    <strong>总运单号</strong>：
                    <span>
                        <el-input style="width:160px;" v-model="dialogMawb" placeholder="请选择总运单号" v-verify="'mawb'">
                        </el-input>
                        <el-button @click=" mawbConfigFunc(1)" size="mini">保存</el-button>
                    </span>
                </div>
                <commonTable :head="mawbConfigHead" :table-data="mawbConfigtableData" style="margin-top:8px;">
                    <template slot="mawb" slot-scope="props">
                        <span style="cursor:pointer" @click="dialogMawb=props.data.value">{{props.data.value}}</span>
                    </template>
                </commonTable>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="mawbConfigConfim" width="320px" append-to-body :close-on-click-modal="false" top="15%"
            center>
            <el-button type="primary" plain @click="mawbConfigFunc(2,1)">可用</el-button>
            <el-button type="primary" plain @click="mawbConfigFunc(2,4)">不可用</el-button>
            <el-button type="primary" plain @click="mawbConfigFunc(2,5)">作废</el-button>
        </el-dialog>

        <el-dialog :visible.sync="qfsjDialog" width="1300px" top="4%" v-if="qfsjDialog" :close-on-press-escape="false"
            append-to-body>
            <iframe :src="qfsjUrl" frameborder="0" allowtransparency="true"
                style="width: 100%; height:700px; border: 0px none;"></iframe>
        </el-dialog>

        <el-dialog :visible.sync="mawbDialog" width="1300px" top="4%" v-if="mawbDialog" :close-on-press-escape="false"
            append-to-body>
            <iframe
                :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman()}&area=${localArea}`"
                frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;"
                id="mawbOperate"></iframe>
        </el-dialog>

        <el-dialog :visible.sync="dialogPcd" class="dialogImgDoc" v-if="dialogPcd" :fullscreen="true" width="1200px"
            append-to-body :before-close="pcCloseFunc" top="4%">
            <iframe :src="pcdUrl" frameborder="0" allowtransparency="true"
                style="width: 100%; height: 100%; border: 0px none;"></iframe>
        </el-dialog>
    </div>
</template>

<script>
    import enterWarehouseNumber from "../templates/enterWarehouseNumber";
    // import mawbRevSed from "../templates/mawbRevSed";
    import revSedMawb from "../templates/revSedMawb";
    import revSedHawb from "../templates/revSedHawb";
    import serviceItemSmall from "../templates/serviceItemSmall";
    import fenpei from "./fenpei";

    import serviceList from "./serviceList"; //服务列表组件
    import hawbtabs from "./hawbTabsNew";
    import tempConfig from "../templates/tempConfig";
    import mawbImport from "../templates/mawbImport";
    import makingBill from "./makingBill"; //制单信息

    import storeCompSize from "./storeCompSize"; //始发港与目的港仓库里面的件重体信息
    import takeGoodsAdd from "./takeGoodsAdd"; //联运始发港
    import takeGoodsAddMdg from "./takeGoodsAddMdg"; //联运目的港
    import declareAtcustomsAdd from "./declareAtcustomsAdd"; //报关信息 与清关信息
    import enterWarehouseBogn from "../templates/enterWarehouseBogn";

    var myServicePane = {
        props: {
            code: String
        },
        components: {
            serviceItemSmall
        },
        data() {
            return {
                parent: this.$parent
            };
        },
        template: `
  <div class="detail" v-if="parent.serviceSelArr.includes(code)">
          <div class="detail-title">
            <p>{{parent.getSerCodeInfo(code)}}</p>
            <serviceItemSmall :text.sync="parent.newService[code].oprequest"></serviceItemSmall>
          </div>
          <div class="detail-c">
            <newFormCmpt
              :view-data.sync="parent.serviceViewData[code+'ViewData']"
              :model-data.sync="parent.inputModelData"
              :area="parent.area"
              pagetype="2"
            ></newFormCmpt>
            <slot name="extraComp"></slot>
          </div>
        </div>
  `
    };
    import {
        formatDate,
        computedWeight
    } from "../../api/localStorage.js";
    import {
        getServiceView,
        serviceSplit
    } from "../mixins/service";
    //getServiceView(1)
    export default {
        name: "mawbAddNew",
        mixins: [getServiceView(1), serviceSplit(1)],
        components: {
            enterWarehouseNumber,
            enterWarehouseBogn,
            // mawbRevSed,
            revSedMawb,
            revSedHawb,
            hawbtabs,
            tempConfig,
            fenpei,
            mawbImport,
            declareAtcustomsAdd,
            makingBill,
            takeGoodsAdd,
            takeGoodsAddMdg,
            storeCompSize,
            serviceList,
            serviceItemSmall,
            myServicePane
        },
        props: {
            visible: Boolean,
            systemSelPane: Boolean,
            orderdom: {
                type: String,
                default: "总单"
            },
            isMawbImport: Boolean, // 订单导入页面
            importMawbData: Object,
            importActiveName: String,
            importCommonService: Object,
            area: {
                type: String,
                default: ""
            },
            opersystem: {
                type: String,
                default: "出口"
            },
            opersystemdom: {
                type: String,
                default: "空运"
            }
        },
        data() {
            return {
                initCompt: false, //用于子组件的初始化，用v-if
                assignShow: false, //分配弹框
                costShow: false, //费用弹框
                mawbguid: "", //分配传值
                name: "mawbAddNew.vue",
                page: 1,
                saveBtnDisabled: false,
                detailShow: {
                    pane1: false,
                    pane2: false
                },
                dialogMawbConfig: false, // 总单配置弹窗
                mawbConfigConfim: false, // 取消总单配置
                qfsjDialog: false, //起飞时间
                qfsjUrl: "",
                dialogPcd: false, //派车单弹窗
                mawbDialog: false,
                setHawb: "", //记录修改分单时候的分单号，然后传入分单组件，以判断是修改的哪一个
                newService: {},
                inputModelData: {
                    khjcnolist: [],
                    piece: 0,
                    weight: 0,
                    volume: 0,
                    yjstorearea_mdg: "",
                    yjstorearea_org: "",
                    appraisaltype_chem: "普通鉴定",
                    storearea_chem: "",
                    storearea_inspect: "",
                    isstore_inspect: 1,
                    isstore_chem: 1,
                    truckgid: -1,
                    truckgid_mdg: -1
                },
                saveNumberList: [],
                mawbgys: "",
                aircomcode: "",
                customerRelList: [],
                orderdomAdd: "",
                hawbKhjcnoShow: false, //分单配置进仓编号面板
                orderdomSfhrShow: false, //收发货人面板

                detialGuest: {}, // 委托客户
            };
        },

        created() {
            this.$watch(
                function () {
                    return this.orderdom + this.opersystem;
                },
                function (val) {
                    if (val) {
                        this.initDataFunc();
                    }
                }, {
                immediate: true
            }
            );

            this.$watch(
                function () {
                    return this.inputModelData.fid;
                },
                function (val) {
                    if (val) {
                        this.inputModelData.ispay_pre = 2;
                        this.basicInformation.ispay_pre.disabled = false;

                        this.$axios({
                            method: "get",
                            url: this.$store.state.publicWebApi + "api/PubCredit",
                            params: {
                                fid: val
                            },
                            loading: true,
                            tip: false
                        }).then(results => {
                            //resultstatus 100  resultdic.creditlevel=='C 代表c类客户 代表c类客户
                            //  console.log(results);
                            if (results.data.resultstatus != 0) {
                                if (results.data.resultstatus == 1) {
                                    this.inputModelData.fid = "";
                                    this.inputModelData.wtkhname = "";
                                }

                                // 提示一次就行了
                                // this.$confirm(results.data.resultmessage, "提示", {
                                //     confirmButtonText: "确定",
                                //     showCancelButton: false,
                                //     showClose: false,
                                //     closeOnClickModal: false,
                                //     "close-on-press-escape": false,
                                //     type: "warning"
                                // }).then(() => {
                                //     if (results.data.resultstatus != 100) {
                                //         this.inputModelData.fid = "";
                                //         this.fareInputViewData.inwageallinprice.required = false;
                                //     } else {
                                //         this.fareInputViewData.inwageallinprice.required = true;

                                //         if (
                                //             results.data.resultdic &&
                                //             results.data.resultdic.creditlevel.toUpperCase() == "C"
                                //         ) {
                                //             this.ctype = true;
                                //             this.inputModelData.ispay_pre = 1;
                                //             this.basicInformation.ispay_pre.disabled = true;
                                //         }
                                //     }
                                //     if (results.data.resultmessage.indexOf("临时客户") >= 0) {
                                //         getxmdata("wtxmNoname").forEach(i => {
                                //             if (i.usr_name == localStorage.usrname) {
                                //                 this.inputModelData.gid = i.id;
                                //             }
                                //         });
                                //     }
                                // });

                                if (results.data.resultstatus == 1) {
                                        this.inputModelData.fid = "";
                                        this.fareInputViewData.inwageallinprice.required = false;
                                } else {
                                        this.fareInputViewData.inwageallinprice.required = true;

                                        if (
                                            results.data.resultdic &&
                                            results.data.resultdic.creditlevel.toUpperCase() == "C"
                                        ) {
                                            this.ctype = true;
                                            this.inputModelData.ispay_pre = 1;
                                            this.basicInformation.ispay_pre.disabled = true;
                                        }
                                }
                                if (results.data.resultmessage.indexOf("临时客户") >= 0) {
                                        getxmdata("wtxmNoname").forEach(i => {
                                            if (i.usr_name == localStorage.usrname) {
                                                this.inputModelData.gid = i.id;
                                            }
                                        });
                                }    



                            }
                        });
                    }
                },
                {
                    deep: true, // 监听
                }
            );
            this.watchYsService();

            this.$watch(
                function () {
                    return (
                        this.inputModelData.sfg +
                        this.inputModelData.hbrq +
                        this.inputModelData.hbh
                    );
                },
                function () {
                    if (this.opersystem == "国内服务") return;
                    if (!this.area) {
                        this.$message.error("请先选择区域！");
                        return;
                    }

                    if (
                        this.inputModelData.hbh &&
                        this.inputModelData.hbh.length >= 2 &&
                        this.inputModelData.mawb &&
                        this.aircomcode &&
                        this.aircomcode.indexOf(
                            this.inputModelData.hbh.substr(0, 2).toUpperCase()
                        ) < 0
                    ) {
                        if (this.area == this.conditionalAreaForBuild) {
                            this.inputModelData.hbh = "";
                        }
                        this.$message.error("航班号与运单号不匹配！");
                        return;
                    }
                    // this.$refs.formCompt.getQfsj();
                    //this.getZzg()
                }
            );

            this.$watch(
                function () {
                    return (
                        this.inputModelData.mawb +
                        this.inputModelData.gid +
                        this.inputModelData.czlx +
                        this.inputModelData.mdg +
                        this.inputModelData.sfg
                    );
                },
                function () {
                    if (
                        this.opersystem == "出口" &&
                        this.inputModelData.mawb &&
                        this.inputModelData.mawb.length == 12 &&
                        this.inputModelData.gid &&
                        this.inputModelData.czlx &&
                        this.inputModelData.mdg &&
                        this.inputModelData.sfg
                    ) {
                        //console.log(this.importMawbData)
                        this.getMawbGys();
                    }
                }
            );
            this.$watch(
                function () {
                    return (
                        this.inputModelData.czlx +
                        this.inputModelData.gid +
                        this.inputModelData.mdg
                    );
                },
                function () {
                    if (this.opersystem == "国内服务") return;

                    var json = {
                        czlx: this.inputModelData.czlx,
                        gid: this.inputModelData.gid,
                        mdg: this.inputModelData.mdg,
                        area: this.area,
                        system: "空出"
                    };
                    if (
                        this.inputModelData.czlx &&
                        this.inputModelData.gid &&
                        this.inputModelData.mdg
                    ) {
                        this.$axios({
                            method: "get",
                            url: this.$store.state.publicWebApi + "api/pubcustomfpbl",
                            params: json,
                            loading: false,
                            tip: false
                        }).then(results => {
                            if (results.data) {
                                this.inputModelData.self_real_bp_freight_in =
                                    results.data.xyfp1_in;
                                this.inputModelData.cus_real_bp_freight_in =
                                    results.data.xyfp2_in;
                                this.inputModelData.self_real_bp_trans_in = results.data.xyfz1_in;
                                this.inputModelData.cus_real_bp_trans_in = results.data.xyfz2_in;
                            } else {
                                this.inputModelData.self_real_bp_freight_in = 10;
                                this.inputModelData.cus_real_bp_freight_in = 0;
                                this.inputModelData.self_real_bp_trans_in = 10;
                                this.inputModelData.cus_real_bp_trans_in = 0;
                            }
                        });
                    }
                }
            );
        },
        methods: {
            initDataFunc() {
                //页面数据初始化
                $(".mawbAddNew")
                    .parents(".main-right-content")
                    .eq(0)
                    .scrollTop(0);

                //组件数据初始化
                this.initCompt = false;
                this.assignShow = false; //分配弹框
                this.costShow = false;
                this.mawbguid = ""; //分配传值
                this.name = "mawbAddNew.vue";
                this.page = 1;
                this.saveBtnDisabled = false;
                this.detailShow = {
                    pane1: false,
                    pane2: false
                };
                this.dialogMawbConfig = false; // 总单配置弹窗
                this.mawbConfigConfim = false; // 取消总单配置
                this.qfsjDialog = false; //起飞时间
                this.qfsjUrl = "";
                this.dialogPcd = false; //派车单弹窗
                this.mawbDialog = false;
                this.hawbForm = {
                    hawb: "",
                    khjcno: [],
                    mdg: "",
                    ybpiece: "",
                    ybweight: "",
                    ybvolume: "",
                    realpiece: "",
                    realweight: "",
                    realvolume: ""
                };
                this.setHawb = ""; //记录修改分单时候的分单号，然后传入分单组件，以判断是修改的哪一个
                //  this.serviceSelArr = []; //服务类别
                this.hawbTableData = [];
                this.inputModelData = {
                    guid: -1,
                    sfg: "",
                    comboine: 1,
                    realpiece: 0,
                    mawb: "",
                    czlx: "自货",
                    orderdom: '',
                    orderno: "",
                    hawb: "",
                    fid: "",
                    gid: "",
                    mdg: "",
                    zzg: "",
                    deliverydate: "",
                    piece: "",
                    weight: "",
                    volume: "",
                    ybpiece: "",
                    ybweight: "",
                    ybvolume: "",
                    smallpiece: "",
                    hbh: "",
                    hbrq: "",
                    qfsj: "",
                    yqqcts: "",
                    hbzl: "全部",
                    exForm1: "",
                    paymode: "PP",
                    englishpm: "CONSOL",
                    chinesepm: "",
                    hwxz: "普货",
                    hwlx: "普货",
                    ispay_pre: "",
                    batterymodel: "",
                    tradeterm: "CIF",
                    area: this.area,
                    ctype: false, //c类客户
                    "remark": "",
                    "bglx": '',
                    "bgpiece": '',
                    "bgweight": '',
                    khjcnolist: [{
                        khjcno: "",
                        piece: "",
                        weight: "",
                        volume: "",
                        storeType: "",
                        loadcardemand: "",
                        bringfile: 2,
                        storename_yb: "",
                        volumelist: [{
                            packagetypename: "",
                            piece: "",
                            longs: "",
                            widths: "",
                            heights: ""
                        }]
                    }],
                    declList: [],
                    declListMdg: [],
                    /* 始发港提货 */
                    address_thrtype_org: 1, //提货人地址类型
                    address_shrtype_org: 1, //收货人地址类型
                    address_thrstorearea_org: "", // 提货出仓库区域
                    address_shrstorearea_org: "", // 送货出仓库区域
                    store_thr: "", //提货地仓库
                    port_thr: "", //提货地港口
                    terminal_thr: "", //提货地货站
                    store_shr: "", //送货地仓库
                    port_shr: "", //送货地港口
                    terminal_shr: "", //送货地货站
                    address_thr_org: "",
                    lxr_thr_org: "",
                    phone_thr_org: "",
                    address_thrjson_org: "",
                    address_shr_org: "",
                    lxr_shr_org: "",
                    phone_shr_org: "",
                    address_shrjson_org: "",
                    company_thr_org: "", // 提货单位(始发港)
                    company_thr_mdg: "", //提货单位(目的港)
                    /* 目的港提货 */
                    address_thrtype_mdg: 1, //提货人地址类型
                    address_shrtype_mdg: 1, //收货人地址类型
                    address_thrstorearea_mdg: "", // 提货出仓库区域
                    address_shrstorearea_mdg: "", // 送货出仓库区域
                    store_thr_mdg: "", //提货地仓库
                    port_thr_mdg: "", //提货地港口
                    terminal_thr_mdg: "", //提货地货站
                    store_shr_mdg: "", //送货地仓库
                    port_shr_mdg: "", //送货地港口
                    terminal_shr_mdg: "", //送货地货站
                    lxr_thr_mdg: "",
                    phone_thr_mdg: "",
                    address_thrjson_mdg: "",
                    address_shr_mdg: "",
                    lxr_shr_mdg: "",
                    phone_shr_mdg: "",
                    address_shrjson_mdg: "",
                    dzlx: "总单",
                    ybstorevolumeList: [], //进仓尺寸信息(始发港)
                    ybstorevolumeListMdg: [], //进仓尺寸信息（目的港)
                    ybTransstoreList: [], //联运服务预报进仓信息(始发港)
                    ybTransstoreListMdg: [], //联运服务预报进仓信息(目的港)
                    company_shr_org: "", //送货单位(始发港)
                    company_shr_mdg: "", //送货单位(目的港)
                    //费用部分
                    currency: "人民币",
                    isinwageallin: "1",
                    inwageallinprice: "",
                    self_real_bp_freight_in: "10",
                    cus_real_bp_freight_in: "0",
                    isinwageallin_trans: "1",
                    inwageallinprice_trans: "",
                    self_real_bp_trans_in: "10",
                    cus_real_bp_trans_in: "0",
                    yjstorearea: this.localArea || this.conditionalAreaForBuild,
                    yjstorename: "",
                    yjstoredate: "",
                    // yjstorearea_mdg: this.localArea,
                    // yjstorearea_org: this.localArea,
                    appraisaltype_chem: "代取鉴定",
                    //  storearea_chem: this.localArea,
                    //   storearea_inspect: this.localArea,
                    isstore_inspect: 1,
                    isstore_chem: 1,
                    zddlcode: "",
                    zddlzh: "",
                    zdiatacode: "",
                    gylist: [{
                        clothtype: "",
                        clothstd: "",
                        servicecode: "AG0130"
                    }], //挂衣
                    gylistpm: [{
                        materialpm: "",
                        materialstd: "",
                        num: "",
                        wagetype: "",
                        costwage: "",
                        saleswage: "",
                        servicecode: "AG0130"
                    }],
                    gbzlist: [{
                        packagetype: "",
                        packagestyle: "",
                        servicecode: "AG0120"
                    }], //改包装
                    gbzlistpm: [{
                        materialpm: "",
                        materialstd: "",
                        num: "",
                        wagetype: "",
                        costwage: "",
                        saleswage: "",
                        servicecode: "AG0120"
                    }],
                    cltglist: [{
                        materialpm: "",
                        materialstd: "",
                        num: "",
                        wagetype: "",
                        costwage: "",
                        saleswage: "",
                        servicecode: "AA0810"
                    }], //材料提供
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
                    yfstdin: "1"
                };

                this.saveNumberList = [];
                this.customerRelList = [];
                this.mawbConfigtableData = [
                    //配置总单表格数据
                ];
                this.mawbgys = "";
                this.aircomcode = "";
                if (this.area) {
                    JSON.parse(localStorage.groupType).forEach(i => {
                        if (i.groupid == 53 && i.typename == this.area) {
                            if (this.opersystem == "进口") {
                                this.inputModelData.mdg = i.ready06;
                            } else {
                                this.inputModelData.sfg = i.ready06;
                            }
                        }
                    });
                }

                if (this.area == "市场部" || this.area == "海外部") {
                    this.inputModelData.sfg = "";
                }

                if (
                    this.opersystem == "进口" &&
                    (this.area == "市场部" || this.area == "海外部")
                ) {
                    this.inputModelData.mdg = "";
                }

                if (this.opersystem == "进口") {
                    this.basicInformation.hbh.title = "航班号：";
                    this.basicInformation.hbrq.title = "航班日期：";
                    this.basicInformation.yqqcts.title = "全程天数：";
                }

                if (this.opersystem == "出口") {
                    this.basicInformation.hbh.title = "要求航班号：";
                    this.basicInformation.hbrq.title = "要求航班日期：";
                    this.basicInformation.yqqcts.title = "要求全程天数：";
                }

                for (let i in this.newService) {
                    // this.newService[i].model =
                    //   (this.newService[i].servicecode == "OA0010" &&
                    //     this.opersystem == "出口") ||
                    //   (this.newService[i].servicecode == "OB0020" &&
                    //     this.opersystem == "进口");
                    this.newService[i].model = false;
                    // if (
                    //   this.newService[i].servicecode == "OA0010"
                    // ) {
                    //   this.newService[i].model = true;
                    // }
                    this.newService[i].oprequest = "";
                }

                // 如果是导入页面，则将页面数据替换成导入的数据
                if (this.isMawbImport && this.importMawbData) {
                    // 基本信息
                    Object.keys(this.inputModelData).forEach(key => {
                        if (key == "mawbAe") {
                            this.inputModelData["mawb"] = this.importMawbData["mawb"] || "";
                        }
                        if (this.importMawbData[key] !== undefined) {
                            this.inputModelData[key] = this.importMawbData[key];
                        }
                    });

                    // 进仓编号
                    let saveList = [].concat(this.importMawbData.ybstoreList);
                    this.importMawbData.hawbList.forEach(hawb => {
                        saveList = saveList.concat(hawb.ybstoreList);
                    });
                    this.saveNumberList = saveList;

                    // 服务
                    if (
                        this.importMawbData.serviceList &&
                        this.importMawbData.serviceList.length > 0
                    ) {
                        let servicecodeArr = this.importMawbData.serviceList.map(
                            i => i.servicecode
                        );
                        //  console.log(Object.keys(this.newService))
                        setTimeout(() => {
                            for (let i in this.newService) {
                                let item = this.newService[i];
                                let index = servicecodeArr.indexOf(item.servicecode);
                                if (index !== -1) {
                                    item.model =
                                        this.importMawbData.serviceList[index].isdel == 1 ?
                                            true :
                                            false;
                                    item.oprequest = this.importMawbData.serviceList[
                                        index
                                    ].oprequest;
                                }
                            }
                        }, 50);
                    }

                    // 联系人信息
                    this.customerRelList = this.importMawbData.customerRelList || [];
                    if (
                        this.customerRelList.length > 0 &&
                        this.$refs.formCompt !== undefined
                    ) {
                        this.$refs.formCompt.$refs.customerRel[0].setSelectedRel(
                            this.customerRelList
                        );
                    }
                }

                setTimeout(() => {
                    if (this.orderdom == "直单") {
                        this.inputModelData.englishpm = "";
                        //  this.newService.AA0120.disabled = true;
                    } else {
                        this.inputModelData.englishpm =
                            this.inputModelData.englishpm || "CONSOL";
                        //  this.newService.AA0120.disabled = false;
                    }

                    if (this.orderdom == "分单") {
                        // if (this.newService.OA0010) {
                        //   this.newService.OA0010.disabled = true;
                        // }

                        // if (this.newService.AA0110) {
                        //   this.newService.AA0110.disabled = true;
                        // }

                        this.basicInformation.remark.title = "唛头：";
                        this.basicInformation.comboine.disabled = true;
                    } else {
                        if (this.newService.AA0110) {
                            this.newService.AA0110.disabled = false;
                        }
                        this.basicInformation.remark.title = "备注：";
                    }

                    if (this.orderdom == "总单") {
                        this.basicInformation.chinesepm.hidden = true;
                        this.basicInformation.tradeterm.hidden = true;
                    } else {
                        this.basicInformation.chinesepm.hidden = false;
                        this.basicInformation.tradeterm.hidden = false;
                    }

                    // let mawbAddService = []
                    // if (this.$store.getters.userSetting.mawbAddService) {
                    //   mawbAddService = this.$store.getters.userSetting.mawbAddService.split(',')
                    // }
                    // if (mawbAddService.length !== 0) {
                    //   for (let i in this.newService) {
                    //     if (mawbAddService.includes(this.newService[i].servicecode) && !this.newService[i].disabled) {
                    //       this.newService[i].model = true
                    //     } else {
                    //       this.newService[i].model = false
                    //     }
                    //     this.newService[i].oprequest = ""
                    //   }
                    // }

                    // this.basicInformation.paymode.disabled = true;

                    if (this.isMawbImport) {
                        $(this.$el)
                            .parent()
                            .scrollTop(0);
                    } else {
                        $(".mawbAddNew")
                            .parents(".main-right-content")
                            .eq(0)
                            .scrollTop(0);
                    }

                    this.initCompt = true;

                    this.$emit("update:systemSelPane", true);

                    if (this.isMawbImport && this.importMawbData) {
                        let vm = this;
                        this.$nextTick(() => {
                            // 应收运费信息
                            /*       Object.keys(vm.fareInputModelData).forEach(key => {
                              if (vm.importMawbData[key] !== undefined)
                                vm.fareInputModelData[key] = vm.importMawbData[key];
                            }); */
                            if (vm.importMawbData["inwagecostprice"]) {
                                vm.inputModelData["inwageallinprice"] =
                                    vm.importMawbData["inwagecostprice"];
                            }

                            // 分单需要等到hawbtab组件初始化完毕之后才能添加
                            vm.hawbTableData = [];
                            if (this.orderdom === "总单") {
                                vm.$refs.hawbtab.clearHawb();
                            }

                            vm.importMawbData.hawbList.forEach(hawbItem => {
                                let obj = {};
                                Object.keys(hawbItem).forEach(key => {
                                    obj[key] = hawbItem[key];
                                });
                                vm.hawbTableData.push({
                                    ...obj,
                                    hawb: hawbItem.hawb,
                                    mdg: hawbItem.mdg,
                                    ybpiece: hawbItem.ybpiece,
                                    ybweight: hawbItem.ybweight,
                                    ybvolume: hawbItem.ybvolume,
                                    realpiece: hawbItem.ybpiece,
                                    realweight: hawbItem.ybweight,
                                    realvolume: hawbItem.ybvolume,
                                    sfg: vm.inputModelData.sfg,
                                    khjcno: hawbItem.ybstoreList.map(i => i.khjcno).join(","),
                                    ybstoreList: hawbItem.ybstoreList
                                });

                                vm.$refs.hawbtab.addHawbFromMawb(
                                    vm.hawbTableData[vm.hawbTableData.length - 1],
                                    ""
                                );
                            });
                        });
                    }

                    if (this.isMawbImport) {
                        this.nextPageFunc(2);
                    }
                }, 100);

                this.wtdataP(this.detialGuest) // 显示委托客户
                // this.basicInformation.hbrq.pickerOptions=this.pickerOptions1
            },

            pageForward(page) {
                this.page = page;
                if (page == 1) {
                    this.$emit("update:systemSelPane", true);
                }
            },
            pcCloseFunc() {
                //   this.$emit('success',this.orderdom);
                this.initDataFunc();
                this.dialogPcd = false;
            },
            getMawbGys() {
                if (this.importActiveName === "repeatOrder") {
                    return;
                }
                if (!this.inputModelData.mawb) {
                    this.mawbgys = "";
                    return;
                }
                if (!this.area) {
                    this.$message.error("请先选择区域！");
                    return;
                }
                //  alert(this.inputModelData.czlx)
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                    params: {
                        mawb: this.inputModelData.mawb,
                        area: this.area,
                        gid: this.inputModelData.gid,
                        sfg: this.inputModelData.sfg,
                        mdg: this.inputModelData.mdg,
                        czlx: this.inputModelData.czlx
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    //console.log(results.data)
                    if (results.data.resultstatus == 0) {
                        let res = results.data.resultdic.mawbInfo;
                        if (res) {
                            if (res.status == 1) {
                                this.mawbgys = res.gysname;
                                this.mawbss = res.mawbss;
                                this.mawbgid = Number(res.gysid);
                                this.aircomcode = res.aircomcode + "," + res.parea;
                                if (
                                    this.inputModelData.hbh.length >= 2 &&
                                    this.area == this.conditionalAreaForBuild &&
                                    this.inputModelData.mawb &&
                                    this.aircomcode &&
                                    this.aircomcode.indexOf(
                                        this.inputModelData.hbh.substr(0, 2).toUpperCase()
                                    ) < 0
                                ) {
                                    this.inputModelData.hbh = "";
                                }
                                this.inputModelData.self_real_bp_freight_out = res.xyfp1_in;
                                this.inputModelData.cus_real_bp_freight_out = res.xyfp2_in;
                                this.inputModelData.self_real_bp_trans_out = res.xyfp1_in;
                                this.inputModelData.cus_real_bp_trans_out = res.xyfp2_in;
                            } else {
                                this.mawbgys = "";
                                this.mawbss = "";
                                this.mawbgid = "";
                                this.aircomcode = "";
                                this.inputModelData.mawb = "";
                                this.inputModelData.self_real_bp_freight_out = 10;
                                this.inputModelData.cus_real_bp_freight_out = 0;
                                this.inputModelData.self_real_bp_trans_out = 10;
                                this.inputModelData.cus_real_bp_trans_out = 0;
                                this.$message.error("此运单号不可用！");
                            }
                        }
                        this.inputModelData.iszddl = results.data.resultdic.iszddl;
                        this.inputModelData.zddlcode = results.data.resultdic.zddlcode;
                        this.inputModelData.zddlzh = results.data.resultdic.zddlzh;
                        this.inputModelData.zdiatacode = results.data.resultdic.zdiatacode;
                    } else {
                        this.inputModelData.mawb = "";
                        this.$message.error(results.data.resultmessage + ",运单号不可用！");
                    }
                });
            },
            inwageallinpriceFunc(num) {
                this.inputModelData.inwageallinprice = Number(
                    Number(this.inputModelData.inwageallinprice) + num
                ).toFixed(2);
            },
            getAddman() {
                return localStorage.usrname;
            },
            mawbDialogFunc() {
                if (!this.area) {
                    this.$message.error("请先选择区域！");
                    return;
                } else {
                    this.mawbDialog = true;
                }
            },
            getMawbConfig() {
                // mawbConfigFunc(1)
                var hbh = this.inputModelData.hbh || "";
                var sfg = this.inputModelData.sfg;
                this.dialogMawbConfig = true;
                this.dialogMawb = this.inputModelData.mawb;
                var json = {
                    area: this.area,
                    hbh: hbh.substr(0, 2),
                    czlx: this.inputModelData.czlx,
                    sfg: sfg,
                    hwxz: this.inputModelData.hwxz,
                    ystj: ""
                };
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                    params: json,
                    loading: false,
                    tip: false
                }).then(results => {
                    //console.log("总单配置")
                    //console.log(results)
                    this.mawbConfigtableData = results.data;
                });
            },
            relieveMawbConfig() {
                if (!this.inputModelData.mawb) {
                    this.$message.error("请先配置总运单号");
                    return;
                }
                this.mawbConfigConfim = true;
            },
            mawbConfigFunc(type, status) {
                //配置总运单
                //type 1配置总运单 2解除总运单
                var mawb = "";
                var url = "";

                if (type == 1) {
                    url = "api/ExHpoAxplineSureMawb";
                    mawb = this.dialogMawb;
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
                    guid: this.inputModelData.guid,
                    area: this.inputModelData.area,
                    hwxz: this.inputModelData.hwxz
                };

                if (type == 2) {
                    json.status = status;
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
                            this.inputModelData.mawb = this.dialogMawb;
                            this.dialogMawbConfig = false;
                        }
                        if (type == 2) {
                            this.inputModelData.mawb = "";
                            this.mawbConfigConfim = false;
                        }
                    } else {
                        this.$message.error(results.data.resultmessage);
                    }
                });
            },

            hawbSelFunc(val) {
                //选中进仓编号
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

                this.hawbForm.ybpiece = piece;
                this.hawbForm.ybweight = weight.toFixed(2);
                this.hawbForm.ybvolume = volume.toFixed(3);
            },

            saveHawbForm() {
                //保存分单信息
                if (!this.hawbForm.hawb) {
                    this.$message.error("请填写分运单号");
                    return;
                }
                var r = /^[^\u4e00-\u9fa5]+$/;
                if (!r.test(this.hawbForm.hawb)) {
                    this.$message.error("分运单号不能包含中文！");
                    return;
                }
                if (this.hawbForm.khjcno.length == 0) {
                    this.$message.error("请选择进仓编号！");
                    return;
                }
                var n = 0;
                this.hawbTableData.forEach(element => {
                    if (element.hawb == this.hawbForm.hawb) {
                        n += 1;
                    }
                });

                if (n >= 1) {
                    this.$message.error("分运单号重复，请重新填写");
                    return;
                }

                if (
                    !this.hawbForm.ybpiece ||
                    !this.hawbForm.ybweight ||
                    !this.hawbForm.ybvolume
                ) {
                    this.$message.error("分单预报件重体不能为空！");
                    return;
                }
                var ybstoreList = [];
                this.hawbForm.khjcno.forEach(element => {
                    this.saveNumberList.forEach(item => {
                        if (element == item.khjcno) {
                            ybstoreList.push(item);
                        }
                    });
                });

                this.hawbTableData.push({
                    hawb: this.hawbForm.hawb,
                    mdg: this.hawbForm.mdg,
                    sfg: this.inputModelData.sfg,
                    khjcno: this.hawbForm.khjcno.toString(),
                    ybpiece: this.hawbForm.ybpiece,
                    ybweight: this.hawbForm.ybweight,
                    ybvolume: this.hawbForm.ybvolume,
                    realpiece: this.hawbForm.realpiece,
                    realweight: this.hawbForm.realweight,
                    realvolume: this.hawbForm.realvolume,
                    ybstoreList: ybstoreList
                });

                this.hawbForm = {
                    hawb: "",
                    khjcno: [],
                    mdg: this.inputModelData.mdg,
                    ybpiece: "",
                    ybweight: "",
                    ybvolume: "",
                    realpiece: "",
                    realweight: "",
                    realvolume: ""
                };

                this.$refs.hawbtab.addHawbFromMawb(
                    this.hawbTableData[this.hawbTableData.length - 1],
                    this.setHawb
                );
                this.setHawb = "";
            },
            setHawbForm(index) {
                if (!this.setHawb) {
                    this.setHawb = this.hawbTableData[index].hawb;
                    this.hawbForm = Object.assign({}, this.hawbTableData[index]);
                    this.hawbForm.khjcno = this.hawbTableData[index].khjcno ?
                        this.hawbTableData[index].khjcno.split(",") :
                        [];
                    this.hawbTableData.splice(index, 1);
                } else {
                    this.$message.error("请先保存！");
                }
            },
            delHawbForm(index) {
                this.$refs.hawbtab.delHawbFromMawb(this.hawbTableData[index].hawb);
                this.hawbTableData.splice(index, 1);
            },
            delHawbFromHawb(hawb) {
                this.hawbTableData.forEach((i, index) => {
                    if (i.hawb == hawb) {
                        this.hawbTableData.splice(index, 1);
                    }
                });
            },
            selOptionShow(item) {
                //判断进仓编号是否已经使用
                var isUse = false;

                this.hawbTableData.forEach(element => {
                    if (element.khjcno.split(",").includes(item.khjcno)) {
                        isUse = true;
                    }
                });
                return isUse;
            },
            test() {
                if (this.visible) this.$emit("update:visible", false);
            },
            // 监听委托客户、项目  根据传过来的type判断客户还是项目
            wtdataP(data) {
                if (data.wtkhname && data.wtxmname) {
                     this.detialGuest = data;
                    this.inputModelData.wtkhname = data.wtkhname;
                    this.inputModelData.wtxmname = data.wtxmname;
                }
            },

            checkFirstPage() {
                //  if (this.customerRelList.length === 0) {
                //     this.$message.error("请选择本票客户客服联系人！");
                //     return false;
                //   }

                var requi = "";
                let infoKey =
                    this.opersystem == "国内服务" ?
                        this.homeInformation :
                        this.basicInformation;
                Object.keys(infoKey)
                    .reverse()
                    .forEach(k => {
                        let item = infoKey[k];
                        if (item.required && !this.inputModelData[k] && !item.hidden) {
                            requi = item.title;
                        }
                    });
                if (requi) {
                    this.$message.error("请填写" + requi.replace("：", ""));
                    return false;
                }

                if (this.opersystem != "国内服务") {
                    if (!this.inputModelData.hwlx) {
                        this.$message.error("请选择货物类型!");
                        return false;
                    }

                    if (
                        this.inputModelData.mawb && this.inputModelData.mawb.length !== 12 &&
                        this.inputModelData.czlx == "代操作" && this.opersystem == "出口" && this.opersystemdom == "空运"
                    ) {
                        this.$message.error("请检查总运单格式，必须为12位！");
                        return false;
                    }




                    if (this.area == this.conditionalAreaForBuild) {
                        if (
                            this.inputModelData.mawb &&
                            (!this.inputModelData.hbh || this.inputModelData.length < 2)
                        ) {
                            this.$message.error("请填写要求航班号，至少两位!");
                            return false;
                        }
                    }



                    if (
                        this.opersystem == "出口" &&
                        this.area != this.conditionalAreaForBuild
                    ) {
                        if (
                            this.inputModelData.czlx == "自货" && this.opersystemdom == "空运" &&
                            !this.inputModelData.inwageallinprice
                        ) {
                            this.$message.error("请填写运费价格!");
                            return false;
                        }

                        if (
                            this.inputModelData.isinwageallin_trans == 2 &&
                            Number(this.inputModelData.inwageallinprice_trans) < 100
                        ) {
                            this.$message.error("应收中转费价格必须大于等于100");
                            return false;
                        }
                    }
                    if (
                        this.ctype &&
                        !this.inputModelData.inwageallinprice &&
                        this.inputModelData.czlx == "自货"
                    ) {
                        this.$message.error("请填写运费价格!");
                        return false;
                    }
                }

                return true;
            },
            nextPageFunc(page) {
                const vm = this;

                function $message(message) {
                    if (vm.isMawbImport && vm.importMawbData) {
                        message = `订单序号${vm.importMawbData.insertindex}： ` + message;
                    }
                    vm.$message.error(message);
                }
                if (!this.area) {
                    this.$message.error("请选择区域！");
                    return false;
                }
                // console.log(this.serviceSelArr)

                if (this.serviceSelArr.length == 0) {
                    this.$message.error("请先选择服务！");
                    return;
                }

                if (this.opersystemdom != "国内服务" && !this.orderdom) {
                    this.$message.error("请选择上榜类型！");
                    return;
                }

                // this.inputModelData.yjstorearea_mdg = this.localArea;
                // this.inputModelData.yjstorearea_org = this.localArea;
                // this.inputModelData.storearea_chem = this.localArea;
                // this.inputModelData.storearea_inspect = this.localArea;

                if (this.opersystem == "国内服务") {
                    this.gnFieldDisplay();
                } else {
                    this.inputModelData.czlx = this.serviceSelArr.includes("OA0010") ?
                        "自货" :
                        "代操作";

                    if (
                        this.opersystem == "出口" &&
                        !this.serviceSelArr.includes("OA0010")
                    ) {
                        this.basicInformation.zddlcode.hidden = false;
                        this.basicInformation.zddlzh.hidden = false;
                        this.basicInformation.zdiatacode.hidden = false;
                    } else {
                        this.basicInformation.zddlcode.hidden = true;
                        this.basicInformation.zddlzh.hidden = true;
                        this.basicInformation.zdiatacode.hidden = true;
                    }




                    if (
                        this.opersystem == "出口" &&
                        this.serviceSelArr.includes("AA0410")
                    ) {
                        this.basicInformation.yjstorename.required = true;
                    }

                    if (this.orderdom == "分单") {
                        this.basicInformation.mawb.hidden = true;
                        this.basicInformation.mawbAe.hidden = true;
                        this.basicInformation.hawb.hidden = false;
                        //    this.basicInformation.hawb.idStyle = { display: "inline-block" };
                        this.fareInputViewData.isinwageallin.options[1].disabled = true;
                    } else {
                        this.basicInformation.hawb.hidden = true;
                        // this.basicInformation.hawb.idStyle = { display: "none" };

                        this.fareInputViewData.isinwageallin.options[1].disabled = false;

                        if (this.opersystem == "出口" && this.opersystemdom == "空运") {
                            this.basicInformation.mawb.hidden = true;
                            this.basicInformation.mawbAe.hidden = false;
                        } else {
                            this.basicInformation.mawb.hidden = false;
                            this.basicInformation.mawbAe.hidden = true;
                        }
                    }
                    if (this.opersystem == "进口") {
                        this.basicInformation.qfsj.hidden = true;
                        this.basicInformation.hbzl.hidden = true;
                        this.basicInformation.paymode.hidden = true;
                        this.basicInformation.czlx.hidden = true;
                        this.basicInformation.mawb.idStyle = {
                            width: "560px"
                        };
                    } else {
                        this.basicInformation.qfsj.hidden = false;
                        this.basicInformation.hbzl.hidden = false;
                        this.basicInformation.paymode.hidden = false;
                        this.basicInformation.czlx.hidden = false;
                        this.basicInformation.mawb.idStyle = {
                            width: "100%"
                        };
                    }
                }

                if (this.isMawbImport) {
                    $(this.$el)
                        .parent()
                        .scrollTop(0);
                } else {
                    $(".mawbAddNew")
                        .parents(".main-right-content")
                        .eq(0)
                        .scrollTop(0);
                }

                if (page == 2) {
                    //国内
                    this.page = page;
                    this.$emit("update:systemSelPane", false);
                }
                if (page == 3) {
                    //进口与出口
                    if (this.checkFirstPage()) {
                        this.page = page;
                    }
                }
            },
            /**
             * @param {Boolean} checkRequired - 是否检查必填项，为false时不进行检查并且最后会返回数据，提供给mawbImport组件切换订单时获取数据用
             * @param {Boolean} isSave - 是否是保存，mawbImport切换订单的时候不需要设置订单默认值
             */
            getInfo(checkRequired = true, isSave = true) {
                if (checkRequired) {
                    if (!this.checkFirstPage()) return;
                    let message = "";
                    if (this.isMawbImport && this.importMawbData) {
                        message = `订单序号${this.importMawbData.insertindex}： ` + message;
                    }

                    if (this.inputModelData.realpiece != this.inputModelData.ybpiece) {
                        this.$message.error(message + "实际进仓件数与预计件数不匹配！");
                        return;
                    }

                    function isValidateNumber(val) {
                        return !Number.isNaN(Number(val));
                    }
                    for (let item of this.saveNumberList) {
                        if (
                            !isValidateNumber(item["piece"]) ||
                            !isValidateNumber(item["weight"]) ||
                            !isValidateNumber(item["volume"])
                        ) {
                            this.$message.error(message + "进仓编号件重体必须为合法数值");
                            return;
                        }
                        for (let store of item.ybstorevolumeList) {
                            if (
                                !isValidateNumber(store["piece"]) ||
                                !isValidateNumber(store["longs"]) ||
                                !isValidateNumber(store["widths"]) ||
                                !isValidateNumber(store["heights"])
                            ) {
                                this.$message.error(
                                    message + "进仓编号尺寸的件数和长宽高必须为合法数值"
                                );
                                return;
                            }
                        }
                    }
                }

                var mawbInfo = {};

                if (this.opersystem != "国内服务") {
                    //合并基本信息  收发货人 费用信息
                    // mawbInfo = Object.assign(
                    //   {},
                    //   this.inputModelData,
                    //   this.mawbRSinfo[0],
                    //   this.mawbRSinfo[1]
                    // );
                    mawbInfo = JSON.parse(JSON.stringify(this.inputModelData));
                    mawbInfo.ybstoreList = this.saveNumberList.filter(item => {
                        return !item.status;
                    });

                    if (this.inputModelData.isinwageallin == 4) {
                        mawbInfo.inwagecostprice = this.inputModelData.inwageallinprice;
                        mawbInfo.inwageallinprice = "";
                    }

                    mawbInfo.gysname = this.mawbgys;
                    mawbInfo.mawbss = this.mawbss;
                    mawbInfo.mawbgid = this.mawbgid;

                    mawbInfo.dzstatus = 100;
                    mawbInfo.pcstatus = 1;

                    if (this.orderdom == "总单") {
                        mawbInfo.hawbList =
                            (this.$refs.hawbtab && this.$refs.hawbtab.getAllhawbinfo()) || [];
                    } else if (this.orderdom == "直单") {
                        mawbInfo.hawbList = [];
                    }

                    getxmdata("wtkhUseful").forEach(i => {
                        if (mawbInfo.fid == i.id) {
                            mawbInfo.comhy = i.comhy;
                        }
                    });

                    if (checkRequired) {
                        if (this.orderdom == "总单" && (this.area == this.conditionalAreaForBuild || this.area == "市场部" || this.area == "海外部")) {
                            /*  if(!mawbInfo.companytitle_fhr_mawb||!mawbInfo.address_fhr_mawb||!mawbInfo.companycode_fhr_mawb||!mawbInfo.city_fhr_mawb||!mawbInfo.companytitle_shr_mawb||!mawbInfo.address_shr_mawb||!mawbInfo.companycode_shr_mawb||!mawbInfo.city_shr_mawb){
                this.$message.error("请填写总单收发货人");return
        } */
                            if (
                                this.$refs.makeBillRevSed &&
                                this.$refs.makeBillRevSed.ifHasLimit()
                            ) {
                                this.$message.error("请检查总单收发货人是否超出字符限制！");
                                return;
                            }

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
                                    if (this.isMawbImport && this.importMawbData) {
                                        message =
                                            `订单序号${this.importMawbData.insertindex}： ` + message;
                                    }
                                    this.$message.error(message + "请填写分单贸易方式");
                                    return;
                                }

                                if (this.$refs.hawbtab && this.$refs.hawbtab.checkHasLimit()) {
                                    this.$message.error(
                                        `请检查分单${this.$refs.hawbtab.checkHasLimit()}的收发货人是否超出字符限制！`
                                    );
                                    return;
                                }
                            }
                        } else if (this.orderdom == "分单") {
                            if (
                                this.$refs.makeBillRevSedHawb &&
                                this.$refs.makeBillRevSedHawb.ifHasLimit()
                            ) {
                                this.$message.error("请检查分单收发货人是否超出字符限制！");
                                return;
                            }

                            let hawbModelData = {
                                hawb: "",
                                sfg: "",
                                mdg: "",
                                ybpiece: 0,
                                ybweight: 0,
                                ybvolume: 0,
                                smallpiece: 0,
                                hwxz: "",
                                hwlx: "",
                                batterymodel: "",
                                chinesepm: "",
                                englishpm: "",
                                isinwageallin: "",
                                inwageallinprice: 0,
                                currency: "",
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
                                gid: 0,
                                area: "",
                                khjcno: "",
                                realpiece: 0,
                                realweight: 0,
                                realvolume: 0,
                                ybstoreList: [],
                                tradeterm: "",
                                rate: "",
                                remark: "",
                                code_fhr_hawb: "",
                                code_shr_hawb: ""
                            };
                            Object.keys(hawbModelData).forEach(i => {
                                hawbModelData[i] = mawbInfo[i];
                            });
                            mawbInfo.hawbList = [hawbModelData];
                            mawbInfo.ybstoreList = [];
                            delete mawbInfo.hawb;
                        }
                    }
                    mawbInfo.opersystemdom = this.opersystemdom;
                    mawbInfo.freightfee_remark = "";
                    mawbInfo.czlx =
                        this.opersystem == "出口" ? this.inputModelData.czlx : this.system;

                    if (mawbInfo.czlx == "代操作") {
                        delete mawbInfo.isinwageallin;
                    }

                    delete mawbInfo.jsonArr;
                    delete mawbInfo.khjcnolist;
                } else {
                    //国内服务

                    //判断服务模块主表的必填
                    let required = false;

                    this.serviceSelArr.reverse().forEach(code => {
                        let item = this.serviceViewData[code + "ViewData"];
                        if (item) {
                            Object.keys(item)
                                .reverse()
                                .forEach(e => {
                                    if (
                                        item[e].required &&
                                        !this.inputModelData[e] &&
                                        !item[e].hidden
                                    ) {
                                        required = item[e].title;
                                    }
                                });
                        }
                    });
                    // alert(required);return;
                    if (required) {
                        this.$message.error("请填写" + required.replace("：", ""));
                        return;
                    }

                    //判断始发港提货里面的必填
                    if (this.serviceSelArr.includes("AA0510")) {
                        if (!this.$refs.takeGoodsAddRef.check_data()) {
                            //  this.$message.error('');
                            return;
                        }
                    }

                    //判断目的港送货里面的必填
                    if (this.serviceSelArr.includes("AB0520")) {
                        if (!this.$refs.takeGoodsAddRefMdg.check_data()) {
                            return;
                        }
                    }

                    if (this.inputModelData.address_thrtype_org == 3) {
                        this.inputModelData.address_thr_org = JSON.parse(
                            localStorage.cargoData
                        ).filter(i => i.storename == this.inputModelData.store_thr)[0].remark;
                        this.inputModelData.address_thrjson_org = "";
                        this.inputModelData.company_thr_org = "";
                    }

                    if (this.inputModelData.address_shrtype_org == 3) {
                        this.inputModelData.address_shr_org = JSON.parse(
                            localStorage.cargoData
                        ).filter(i => i.storename == this.inputModelData.store_shr)[0].remark;
                        this.inputModelData.address_shrjson_org = "";
                        this.inputModelData.company_shr_org = "";
                    }

                    mawbInfo = Object.assign({}, this.inputModelData);
                    //  mawbInfo.khjcnolist=mawbInfo.khjcnolist&&mawbInfo.khjcnolist.filter(i=>i.khjcno)
                    //判断多条的进仓编号
                    if (mawbInfo.khjcnolist.length > 0) {
                        for (let i in mawbInfo.khjcnolist) {
                            let item = mawbInfo.khjcnolist[i];
                            if (!item.khjcno) {
                                this.$message.error("有进仓编号未填写");
                                return;
                            }
                            if (item.khjcno && !item.piece) {
                                this.$message.error(`请填写进仓编号${item.khjcno}的件数！`);
                                return;
                            }
                            if (item.khjcno && !item.weight) {
                                this.$message.error(`请填写进仓编号${item.khjcno}的重量！`);
                                return;
                            }
                            if (item.volumelist.length > 0) {
                                for (let e in item.volumelist) {
                                    let item2 = item.volumelist[e];
                                    if (
                                        item2.packagetypename &&
                                        (!item2.piece ||
                                            !item2.longs ||
                                            !item2.heights ||
                                            !item2.widths)
                                    ) {
                                        this.$message.error(
                                            `请填写进仓编号${item.khjcno}的尺寸的完整信息！`
                                        );
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    mawbInfo.mawbdocInfo =
                        (this.$refs.makingbillmawb && this.$refs.makingbillmawb.getInfo()) || {};
                    mawbInfo.hawbdocInfo =
                        (this.$refs.makingbillhawb && this.$refs.makingbillhawb.getInfo()) || {};
                    mawbInfo.opersystemdom = "";

                    // if(this.serviceSelArr.length==1&&this.serviceSelArr[0]=='AG0110'){
                    //   mawbInfo.fid=-1
                    //   mawbInfo.gid=-1
                    // }
                }

                mawbInfo.orderdom = this.orderdom;
                mawbInfo.ordertype = "";
                mawbInfo.area = this.area;
                mawbInfo.dom = localStorage.dom || "出口部";
                mawbInfo.system = this.system;

                mawbInfo.salesarea = this.area;
                mawbInfo.salesdom = "出口部";
                mawbInfo.assignarea = this.area;
                mawbInfo.assigndom = "出口部";
                mawbInfo.opersystem = this.opersystem;
                mawbInfo.customerRelList = this.customerRelList;

                mawbInfo.fid = mawbInfo.fid || -1;
                mawbInfo.gid = mawbInfo.gid || -1;
                mawbInfo = this.dealList(mawbInfo);

                if (isSave) {
                    mawbInfo.inwageallinprice = mawbInfo.inwageallinprice || 666666;
                    mawbInfo.inwageallinprice_trans =
                        mawbInfo.inwageallinprice_trans || 666666;
                    mawbInfo.inwageallinprice_record =
                        mawbInfo.inwageallinprice_record || 666666;
                }

                this.serviceList.forEach(i => {
                    // if (this.orderdom == "分单"&&i.servicecode == "AA0110") {
                    //    i.isdel=2
                    // }
                });
                mawbInfo.serviceList = this.serviceList
                if (mawbInfo.serviceList.length == 0) {
                    this.$message.error("未选择服务！");
                    return;
                }

                return mawbInfo;
            },
            saveMawbInfo() {
                let mawbInfo = this.getInfo();
                if (!mawbInfo) {
                    return;
                }
                if (this.system == "空出" && this.area == this.conditionalAreaForBuild) {
                    //  mawbInfo.nodecode = "AO5025";
                    mawbInfo.nodecode = "AO5010";
                } else {
                    mawbInfo.nodecode = "AO5020";
                }

                this.saveBtnDisabled = true;
                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + "api/ExHpoAxplineLocal",
                    data: mawbInfo,
                    loading: true,
                    tip: false
                })
                    .then(results => {
                        //  console.log(results);
                        if (results.data.resultstatus == 0) {
                            if (this.opersystem == "国内服务") {
                                this.$alert(
                                    "订单编号为" +
                                    results.data.resultno +
                                    ";<br>" +
                                    results.data.resultmessage +
                                    "。",
                                    "提示", {
                                    distinguishCancelAndClose: true,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: "确定"
                                }
                                ).then(() => {
                                    if (this.serviceSelArr.includes("AA0510")) {
                                        this.$refs.takeGoodsAddRef.saveAddress();
                                    }
                                    if (this.serviceSelArr.includes("AB0520")) {
                                        this.$refs.takeGoodsAddRefMdg.saveAddress();
                                    }
                                    this.initDataFunc();
                                    return;
                                });
                            } else {
                                this.$confirm(
                                    "订单编号为" +
                                    results.data.resultno +
                                    ";<br>" +
                                    results.data.resultmessage +
                                    "。",
                                    "提示", {
                                    distinguishCancelAndClose: true,
                                    dangerouslyUseHTMLString: true,
                                    closeOnClickModal: false,
                                    confirmButtonText: "确定",
                                    cancelButtonText: "打印流转单",
                                    showCancelButton: this.system == "空出",
                                    cancelButtonClass: "el-button el-button--primary"
                                }
                                )
                                    .then(() => {
                                        this.initDataFunc();
                                        return;
                                    })
                                    .catch(action => {
                                        if (action == "cancel") {
                                            this.peicheBill(results.data);
                                        }
                                    });
                            }
                        } else if (results.data.resultstatus == 99) {
                            this.$alert(results.data.resultmessage, "提示", {
                                confirmButtonText: "确定",
                                callback: action => {
                                    this.initDataFunc();
                                    return;
                                }
                            });
                        } else {
                            this.saveBtnDisabled = false;
                            this.$message.error(results.data.resultmessage);
                        }
                    })
                    .catch(error => {
                        //console.log(error)
                        this.saveBtnDisabled = false;
                    });
            },
            operationSave(boguid, bono) {
                //WFF操作
                // var url="http://192.168.0.167/BoManagementWebApi/api/ExAxplineAssignLocal"
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + "api/ExAxplineAssignLocal",
                    data: {
                        boguid: boguid
                    },
                    loading: true,
                    tip: false
                }).then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$alert("订单创建成功，订单编号为" + bono, "提示", {
                            confirmButtonText: "确定",
                            callback: action => {
                                this.initDataFunc();
                                return;
                            }
                        });
                    }
                });
            },

            saveWaitFp(type) {
                //1.保存待处理 2保存并分配 3.保存并完成
                var mawbInfo = this.getInfo();
                if (!mawbInfo) {
                    return;
                }

                if (type == 3) {
                    mawbInfo.nodecode = "AO5060";
                } else {
                    mawbInfo.nodecode = "AO5025";
                }

                this.saveBtnDisabled = true;

                this.$axios({
                    method: "post",
                    url: this.$store.state.webApi + "api/ExHpoAxpline",
                    data: mawbInfo,
                    loading: true,
                    tip: false
                })
                    .then(results => {
                        if (results.data.resultstatus == 0) {
                            if (this.opersystem == "国内服务") {
                                this.$alert(
                                    "订单编号为" +
                                    results.data.resultno +
                                    ";<br>" +
                                    results.data.resultmessage +
                                    "。",
                                    "提示", {
                                    distinguishCancelAndClose: true,
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: "确定"
                                }
                                ).then(() => {
                                    if (this.serviceSelArr.includes("AA0510")) {
                                        this.$refs.takeGoodsAddRef.saveAddress();
                                    }
                                    if (this.serviceSelArr.includes("AB0520")) {
                                        this.$refs.takeGoodsAddRefMdg.saveAddress();
                                    }

                                    if (type == 1) {
                                        this.initDataFunc();
                                    } else if (type == 2) {
                                        this.assignShow = true;
                                        this.mawbguid = results.data.resultguid;
                                    } else {
                                        if (results.data.resultguid > 0) {
                                            this.costShow = true;
                                            this.inputModelData.boguid = results.data.resultguid;
                                        } else {
                                            this.initDataFunc();
                                        }
                                    }
                                    return;
                                });
                            } else {
                                this.$confirm(
                                    "订单编号为" +
                                    results.data.resultno +
                                    ";<br>" +
                                    results.data.resultmessage +
                                    "。",
                                    "提示", {
                                    dangerouslyUseHTMLString: true,
                                    closeOnClickModal: false,
                                    distinguishCancelAndClose: true,
                                    confirmButtonText: "确定",
                                    cancelButtonText: "打印流转单",
                                    showCancelButton: this.system == "空出",
                                    cancelButtonClass: "el-button el-button--primary"
                                }
                                )
                                    .then(() => {
                                        // alert(2)
                                        if (type == 1) {
                                            this.initDataFunc();
                                        } else {
                                            this.assignShow = true;
                                            this.mawbguid = results.data.resultguid;
                                        }
                                        return;
                                    })
                                    .catch(action => {
                                        if (action == "cancel") {
                                            this.peicheBill(results.data);
                                        }
                                    });
                            }
                        } else if (results.data.resultstatus == 99) {
                            this.$alert(results.data.resultmessage, "提示", {
                                confirmButtonText: "确定",
                                callback: action => {
                                    this.initDataFunc();
                                    return;
                                }
                            });
                        } else {
                            this.saveBtnDisabled = false;
                            this.$message.error(results.data.resultmessage);
                        }
                    })
                    .catch(error => {
                        this.saveBtnDisabled = false;
                    });
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
            peicheBill(data) {
                //派车单
                data.boguid = data.resultguid;
                // data.guid=data.resultguid
                data.area = this.area;
                data.shipaceid = -1;
                var dom = "操作流转单";
                var row = JSON.parse(localStorage.jhAddress).filter(
                    i => i.dom == dom && i.area == this.area && i.system == "空出"
                )[0];
                if (row) {
                    var str = "";
                    var parmjson = row.parmjson.split(",");
                    parmjson.forEach(i => {
                        str += i + "=" + data[i] + "&";
                    });
                    str = str.substr(0, str.length - 1); //这是guid
                    this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=${row.templetename}&${str}`;
                    this.dialogPcd = true;
                } else {
                    layer.msg("无数据！");
                }
            },
            assignShowDelete(type) {
                //关闭弹框 1分配 2费用
                if (type == 1) {
                    this.assignShow = false;
                } else {
                    this.costShow = false;
                }
                this.initDataFunc();
            },
            getSerCodeInfo(code) {
                return (
                    this.newService[code].port.replace("服务", "") +
                    "-" +
                    this.newService[code].title
                );
            }
        },
        computed: {
            system() {
                return this.opersystem == "国内服务" ?
                    "国内服务" :
                    this.opersystemdom.charAt(0) + this.opersystem.charAt(0);
            },
            localArea() {
                return this.area || this.$store.state.areaState;
            },
            areaStateCode() {
                let area = JSON.parse(localStorage.cityCode);
                return area.find(i => i.label == this.area).value;
            },
            serviceSelArr() {
                // console.log(this.$store.getters.userSetting.serviceChecked)
                let arr = [];
                for (let i in this.newService) {
                    if (this.newService[i].model) {
                        arr.push(this.newService[i].servicecode);
                    }
                }
                // this.inputModelData.czlx = arr.includes("OA0010")
                //             ? "自货"
                //             : "代操作";
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
                            isdel: item.model ? 1 : 2
                        });
                    }
                    return serviceList;
                },
                set(val) {
                    //this.initFunc()
                    val.forEach(item => {
                        this.newService[item.servicecode].model =
                            item.isdel == 1 ? true : false;
                        this.newService[item.servicecode].oprequest = item.oprequest;
                    });
                }
            },
            //     iframeUrl(){
            // var area=(this.area=='市场部'||this.area=='海外部')?'香港':this.area
            //     if (location.hostname.indexOf('192.168') !== -1) {
            //         var url=""
            //         JSON.parse(localStorage.groupType).forEach(i=>{
            //             if(i.groupid==53&&i.typename==area){
            //                 url=i.ready04
            //             }
            //         })
            //       return url
            //     } else {
            //       //wffbasic/basic/frmMawbAdd.aspx
            //       let url = `${location.hostname}${this.$store.state.area_port[area] || ''}`
            //       return url
            //     }
            // }
            statusArr() {
                var arr = [];
                this.hawbTableData.forEach(element => {
                    if (element.khjcno) {
                        arr = arr.concat(element.khjcno.split(","));
                    }
                });
                return arr;
            },
            lxrss2RelData() {
                return this.customerRelList.filter(i => i.lxrss === 2);
            }
        },
        mounted() { },
        watch: {
            // 选了客户联系人之后把客户联系人显示出来
            customerRelList(val) {
                Object.keys(this.basicInformation).forEach(item => {
                    if (item === "relinfo") {
                        if (this.lxrss2RelData.length === 0) {
                            this.basicInformation.item.hidden = true;
                        } else {
                            this.basicInformation.item.hidden = false;
                        }
                    }
                });
            },
            "inputModelData.mdg": {
                handler(val) {
                    if (val) {
                        this.hawbForm.mdg = this.inputModelData.mdg;
                    }
                },
                immediate: true
            },
            "inputModelData.hbzl": {
                handler(val) {
                    if (this.inputModelData.czlx == "自货") {
                        ["isinwageallin_trans", "inwageallinprice_trans", "second"].forEach(
                            i => {
                                this.fareInputViewData[i].hidden = val == "直达";
                            }
                        );
                    }
                },
                immediate: true
            },
            "inputModelData.czlx"(val) {
                //console.log(val)
                [
                    "currency",
                    "inwageallinprice",
                    "isinwageallin",
                    "inwageallinprice_trans",
                    "isinwageallin_trans",
                    "first",
                    "second"
                ].forEach(i => {
                    this.fareInputViewData[i].hidden = val == "代操作";
                });

                if (val == "自货") {
                    this.basicInformation.zzg.disabled = true;
                } else {
                    this.basicInformation.zzg.disabled = false;
                }
            },
            saveNumberList: {
                handler() {
                    var piece = 0;
                    this.saveNumberList.forEach(element => {
                        piece += Number(element.piece);
                    });
                    this.inputModelData.realpiece = piece;
                    // console.log('新增或修改进仓编号')
                },
                immediate: true,
                deep: true
            },
            "inputModelData.hbrq"(val) {
                /*
                  setTimeout(() => {
                        if(val&&new Date(this.inputModelData.hbrq)<new Date(formatDate(new Date(),'yyyy-MM-dd'))){
                                this.$confirm('航班日期小于当前日期，是否继续上榜?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                      }).then(() => {
    
                                      }).catch(() => {
                                                  this.inputModelData.hbrq=""
    
                                      });
                              }
                  }, 200); */
            },
            // 新增页面的服务和收发货人信息需要和导入页面的公用数据同步

            localArea: {
                handler(val) {
                    this.inputModelData.area = val;
                    this.fareInputViewData.inwageallinprice.required =
                        this.localArea != this.conditionalAreaForBuild;
                },
                immediate: true
            },
            "inputModelData.weight": {
                handler(val) {
                    this.inputModelData.jfweight =
                        this.inputModelData.volume && val ?
                            computedWeight(this.inputModelData.volume, val) :
                            val;
                    this.inputModelData.accountweightin = val;
                },
                immediate: true
            },
            "inputModelData.volume": {
                handler(val) {
                    this.inputModelData.jfweight =
                        this.inputModelData.weight && val ?
                            computedWeight(val, this.inputModelData.weight) :
                            this.inputModelData.weight;
                },
                immediate: true
            },
            "inputModelData.bglx"(val) {
                this.basicInformation.bgweight.required = !!val;
            },
            orderdomAdd(val) {
                this.$emit("update:orderdom", val);
            }
        },
        beforeDestroy() { }
    };
/*
    
    initDataFunc 页面数据初始化
    pcCloseFunc
    getMawbGys
    inwageallinpriceFunc
    mawbDialogFunc
    getQfsj
    qfsjDialogFunc
    getMawbConfig
    relieveMawbConfig
    mawbConfigFunc
    checkboxAll
    hawbSelFunc
    saveHawbForm
    setHawbForm
    delHawbForm
    delHawbFromHawb
    selOptionShow
    wtdataP
    changeTabshow
    nextPageFunc //下一步
    getInfo //获取表单数据
    saveMawbInfo  //保存表单数据
    operationSave
    saveWaitFp
    saveJcnoinfo
    peicheBill
    
    */
</script>

<style lang="less" scoped>
    .mawbAddNew {
        /deep/ .detail {
            position: relative;
            margin-bottom: 20px;
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

        .basic-information {
            /deep/ .el-date-editor.el-input {
                width: 100%;
            }

            /deep/ .el-input__icon {
                line-height: 28px;
            }
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

    .dialogImgDoc {
        /deep/ .el-dialog__body {
            padding: 0px;
            height: calc(100% - 40px);
        }
    }

    .orderdomRadio {
        margin-bottom: 14px;

        /deep/ .el-form-item__label {
            width: 140px !important;
            margin-left: 2px;
        }

        /deep/ label {
            font-size: 16px;
            color: #606266;
            font-weight: 600;
            margin-left: 8px;
        }
    }
</style>