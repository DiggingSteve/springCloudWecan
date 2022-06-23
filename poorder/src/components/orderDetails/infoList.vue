<template>
    <div>
        <!-- {{inputModelData.opersystem}} -->
        <!-- {{name}} -->
        <h3 v-if="inputModelData.creditisbackstatus==4||inputModelData.creditisbackstatus==5"
            style="color:red;margin-bottom:8px;">*信控待通过，{{inputModelData.creditcontent}}。</h3>
        <h3 v-if="inputModelData.isimperfect==2" style="color:red;margin-bottom:8px;">
            <span v-if="inputModelData.orderguid>0">*该订单未完善无法操作！请通知销售站完善订单！</span>
            <span v-else>*该订单未完善无法操作！请在【订单层->本站订单->订单未完善】中完善订单！</span>
        </h3>


        <div style="display: inline-block;margin-right:2px;padding:4px 10px;background-color:#FEEAE9;border-radius:14px;color:red;font-size:16px;margin-bottom: 12px;"
            v-if="showDcno">
            <span>订舱编号：</span>
            <span @click="openDetail(2)" :class="{'isopen':(inputModelData.guid!=-1&&pagetype!=21)}"
                style="display: inline-block;min-width: 180px">{{inputModelData.pono}}</span>
            <i class="el-icon-document-copy" style="cursor: pointer;" title="复制该单号到剪贴版"
                @click="copyToClipboard(inputModelData.pono)" v-if="inputModelData.pono"></i>
            <explainTooltip text="点击订舱编号进入详细页面" v-if="inputModelData.guid&&inputModelData.guid!=-1&&pagetype!=21">
            </explainTooltip>
        </div>

        <div style="display:flex;justify-content:space-between;padding-bottom:10px;align-items:center">
            <div>
                <slot name="titlearea">
                    <div
                        v-if="showOrderNumber"
                        style="display: inline-block;margin-right:2px;padding:4px 10px;background-color:#EDF4E4;border-radius:14px;color:#76A24E;font-size:16px;">
                        <span>订单编号：</span>
                        <span @click="openDetail(1)"
                            :class="{'isopen':(ifopendetail&&inputModelData.guid&&inputModelData.guid!=-1)}"
                            style="display: inline-block;min-width: 180px">{{inputModelData.shipperno||'--'}}</span>
                        <i class="el-icon-document-copy" style="cursor: pointer;" title="复制该单号到剪贴版"
                            @click="copyToClipboard(inputModelData.shipperno)" v-if="inputModelData.shipperno"></i>
                        <explainTooltip text="点击订单编号进入详细页面"
                            v-if="ifopendetail&&inputModelData.guid&&inputModelData.guid!=-1"></explainTooltip>
                    </div>
                    <span style="display: inline-block;padding:1px 12px;background-color:#f2f2f2;border-radius:14px"
                        v-show="showMawbSearch&&inputModelData.opersystem=='出口'">
                        <span style="font-size:12px;">总运单号</span>
                        <el-autocomplete v-model.trim="newMawb" class="autocomplete" size="mini" clearable
                            placeholder="输入总运单号查询可快速切换" :fetch-suggestions="querySearchAsync" @select="handleSelect"
                            hide-loading></el-autocomplete>
                        <i class="el-icon-search" @click="getNewMawbinfo"
                            style="cursor:pointer;transform:translateY(1px);padding:3px;"></i>
                    </span>
                    <!-- @@进口更改 -->
                    <span  style="display: inline-block;padding:1px 12px;background-color:#f2f2f2;border-radius:14px"
                        v-show="showMawbSearch&&inputModelData.opersystem=='进口'">
                        <span style="font-size:12px;">总运单号</span>
                        <el-autocomplete v-model.trim="newMawb" class="autocomplete" size="mini" clearable
                            placeholder="输入总运单号查询可快速切换" :fetch-suggestions="querySearchAsync" @select="handleSelectMawb" disabled
                            hide-loading></el-autocomplete>
                    </span>
                    <span  style="display: inline-block;padding:1px 12px;background-color:#f2f2f2;border-radius:14px;"
                        v-show="showMawbSearch&&inputModelData.opersystem=='进口'">
                        <span style="font-size:12px;">分运单号</span>
                        <el-select v-model="selectHawb" placeholder="选择分运单号查询可快速切换" @change="getNewMawbinfo('hawb')" class="hawbSelect">
                            <el-option :label="i.hawb" :value="i.boguid" v-for="i in hawbArray" :key="i.boguid"></el-option>
                        </el-select>
                    </span>
                </slot>
                <slot name="wageAlert"></slot>
            </div>
            <div class="flex-between" v-if="!nesting">
                <div>
                    <slot name="betgroup"></slot>
                </div>

                <div style="margin-left:20px;" v-if="inputModelData.guid&&inputModelData.guid!=-1&&showBtnGroup"
                    :class="{disabled:!inputModelData.guid}">
                    <slot name="betgroup2"></slot>
                    <!-- <el-button type="success"  v-if="inputModelData.cancelreason||inputModelData.delbillreason||inputModelData.overseasaccreason||inputModelData.routedelreason" @click="detailShow.reasonShow=!detailShow.reasonShow">原因</el-button> -->
                    <el-button type="success" btnnum="30"
                        v-if="inputModelData.orderguid != -1 || inputModelData.childguid != -1"
                        v-show='pagetype!=21&&btnJurisdic(30)' @click="assignXsPlation">分配信息</el-button>
                    <el-button type="success" btnnum="50" @click="getDetailInfo"
                        >订单通讯
                    </el-button>
                    <el-button type="success" btnnum="50" @click="detailShow.lxrShow=!detailShow.lxrShow"
                        v-show="btnJurisdic(50)">联系人信息
                    </el-button>
                    <el-button type="success" btnnum="60" @click="detailShow.jiedianShow=!detailShow.jiedianShow"
                        v-show="inputModelData.opersystem!='国内服务'&&btnJurisdic(60)">节点状态信息</el-button>
                    <el-button type="success" btnnum="70" v-show="btnJurisdic(70)"
                        @click="dialogImg=true;doctype=true;">文档&照片</el-button>
                    <!-- <el-button type="success" btnnum="80" v-show="btnJurisdic(80)"
                        @click="selectTableIndex='';openDoc()">本票文档</el-button> -->
                    <el-button type="default" btnnum="90" v-show="btnJurisdic(90)" @click="paneShow=!paneShow">
                        {{paneShow&&inputModelData.guid?'隐藏摘要':'显示摘要'}}</el-button>
                </div>
                <div style="margin-left:20px;" v-if="!showBtnGroup">
                    <el-button type="default" btnnum="90" @click="paneShow=!paneShow">
                        {{paneShow&&inputModelData.guid?'隐藏摘要':'显示摘要'}}</el-button>
                </div>


            </div>
        </div>
        <el-collapse-transition>
            <div v-show="detailShow.jiedianShow">
              
                <!-- <infoList
         style="margin-bottom:25px;"
          :inputModelData="inputModelData"
          :jiediandata.sync="jiediandata"
          :ifopendetail="ifopendetail"
          :name="name"
          :pagetype="pagetype"
          nesting
          v-if="!nesting"
        >
        </infoList>  -->
                <jiedian :mawbinfo="inputModelData" :jiediandata.sync="jiediandata" :orderdom="inputModelData.orderdom"
                    v-if="inputModelData.guid&&detailShow.jiedianShow"></jiedian>
            </div>
        </el-collapse-transition>

        <!-- 总单信息摘要 -->
        <el-collapse-transition>
            <div v-show="paneShow&&inputModelData.guid&&inputModelData.guid!=-1" style="background:white">
            
                <div class="showpanediv"
                    v-show="inputModelData.opersystem=='出口'&&name=='详细'&&inputModelData.iscomboine!=1">
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>委托客户：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{ inputModelData.wtkhname}}</span>
                        </div>
                        <div>
                            <span>项目：</span>
                            <span class="color-red" :title="inputModelData.wtxmnameWhole">{{
                                inputModelData.wtxmnameWhole&&inputModelData.wtxmnameWhole.split('-')[0]}}</span>
                        </div>
                        <div>
                            <span>配舱操作：</span>
                            <span>{{ czlx||'--'}}</span>
                        </div>
                        <div>
                            <span>托书运费价格：</span>
                            <span>{{currencyChars}}{{
                                (Number(inputModelData['inwageallinprice']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice']).toFixed(2))||0.00}}({{getWageinType(inputModelData.isinwageallin)}})</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>总运单号：</span>
                            <span>{{ inputModelData.mawb||'--'}}</span>
                        </div>

                        <div>
                            <span>始发港：</span>
                            <span>{{ inputModelData.sfg||'--'}}</span>
                        </div>
                        <div>
                            <span>目的港：</span>
                            <span>{{ inputModelData.mdg||'--'}}</span>
                        </div>

                        <div>
                            <span>托书中转费价格：</span>
                            <span>{{currencyChars}}{{
                                (Number(inputModelData['inwageallinprice_trans']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice_trans']).toFixed(2))||0.00}}({{inputModelData.isinwageallin_trans==1?'单价':"总价"}})</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>分运单票数：</span>
                            <span>{{ inputModelData.hawbnum||0}}</span>
                        </div>

                        <div>
                            <span>航班号：</span>
                            <span>{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbh||inputModelData.hbh)||'--'}}</span>
                        </div>
                        <div>
                            <span>航班日期：</span>
                            <span>{{ inputModelData.hbrq||inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbrq |
                                formatDate('yyyy-MM-dd') }}</span>
                        </div>

                        <div>
                            <span>应收运费：</span>
                            <span>{{currencyChars}}{{
                                inputModelData['freightpricein']&&(Number(inputModelData['freightpricein']).toFixed(2)==666666.00?'--':Number(inputModelData['freightpricein']).toFixed(2))||0.00}}({{getWageinType(inputModelData.isinwageallin)}})</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>预报件/重/体：</span>
                            <span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.ybvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>货物类型：</span>
                            <span>{{ inputModelData.hwlx||'--'}}</span>
                        </div>

                        <div>
                            <span>货物性质：</span>
                            <span>{{ inputModelData.hwxz||'--'}}</span>
                        </div>

                        <div>
                            <span>应收运费分泡：</span>
                            <span>WFF:{{Number(inputModelData.self_real_bp_freight_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_freight_in}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>实际件/重/体：</span>
                            <span>{{ inputModelData.realpiece}}/{{
                                Number(inputModelData.realweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.realvolume).toFixed(3)||0.000}}</span>
                        </div>
                        <div v-if="inputModelData.opersystem!='进口'">
                            <span>报关重量：</span>
                            <span>{{ Number(inputModelData.realweight).toFixed(2)||0.00 }}</span>
                        </div>

                        <div>
                            <span>交接地：</span>
                            <span>{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.terminalname)||'--'}}</span>
                        </div>

                        <div>
                            <span>应收中转费：</span>
                            <span>{{currencyChars}}{{
                                inputModelData['inwageallinprice_trans']&&(Number(inputModelData['inwageallinprice_trans']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice_trans']).toFixed(2))||0.00}}({{getWageinType(inputModelData.isinwageallin)}})</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="inputModelData.opersystem!='进口'&&!isoutside">
                        <div>
                            <span>签单件/重/体：</span>
                            <span>{{ inputModelData.signpiece||0}}/{{
                                Number(inputModelData.signweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.signvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>制单计费：</span>
                            <span>{{Number(inputModelData.jfweight).toFixed(2)||0.00}}</span>
                        </div>
                        <div>
                            <span>分配模式：</span>
                            <span>
                                {{ getServiceGuid('OA0010','profitmode')||'本站'}}
                                <template v-if="inputModelData.profitquota">({{inputModelData.profitquota}})</template>
                            </span>
                        </div>
                        <div>
                            <span style="min-width:108px;">应收中转费分泡：</span>
                            <span>WFF:{{Number(inputModelData.self_real_bp_trans_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_trans_in}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="inputModelData.opersystem!='进口'">
                        <div v-show="pagetype!=21">
                            <span>制单件/重/体：</span>
                            <span>{{ inputModelData.zdpiece||0}}/{{
                                Number(inputModelData.zdweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.zdvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>报关单票数：</span>
                            <span>{{inputModelData.bgNumbers||'0'}}</span>
                        </div>
                        <div>
                            <span>报关单号：</span>
                            <span>{{inputModelData.bgponos||'--'}}</span>
                        </div>
                        <div>
                            <span>报关方式：</span>
                            <span>{{inputModelData.bglx||'--'}}</span>
                        </div>
                        <div v-if="isoutside">
                            <span style="min-width:108px;">应收中转费分泡：</span>
                            <span>WFF:{{Number(inputModelData.self_real_bp_trans_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_trans_in}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>分运单号：</span>
                            <span>{{inputModelData.hawb||'--'}}</span>
                        </div>
                        <div>
                            <span>制单代理代码：</span>
                            <span>{{inputModelData.zddlcode||'--'}}</span>
                        </div>
                        <div>
                            <span>应收货站地面费：</span>
                            <span>{{inputModelData.inwageallinclude&&inputModelData.inwageallinclude=='4'?'WFF运费包含货站地面服务费(0.4/KG)':'WFF另收货站地面费(0.4/KG)'}}</span>
                        </div>
                        <div v-show="pagetype!=21">
                            <span>应付货站地面费：</span>
                            <span>{{inputModelData.outwageallinclude&&inputModelData.outwageallinclude=='4'?'WFF不付货站地面费(0.4/KG)':'WFF另付货站地面费(0.4/KG)'}}</span>
                        </div>
                    </div>

                    <slot name="exinfo"></slot>
                </div>
                <div class="showpanediv"
                    v-show="inputModelData.opersystem=='进口'&&name=='详细'&&inputModelData.iscomboine!=1">
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>委托客户：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{ inputModelData.wtkhname}}</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>总运单号：</span>
                            <span>{{ inputModelData.mawb||'--'}}</span>
                        </div>

                        <div>
                            <span>总单始发港：</span>
                            <span>{{ inputModelData.sfg||'--'}}</span>
                        </div>
                        <div>
                            <span>总单到达港：</span>
                            <span>{{ inputModelData.mdg||'--'}}</span>
                        </div>

                        <div>
                            <span>货物来源：</span>
                            <span>{{ jjdChange(inputModelData.jjd)||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>航班号：</span>
                            <span>{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbh||inputModelData.hbh)||'--'}}</span>
                        </div>

                        <div>
                            <span>到港日期：</span>
                            <span>{{ inputModelData.hbrq | formatDate('yyyy-MM-dd') }}</span>
                        </div>

                        <div>
                            <span>入境方式：</span>
                            <span>{{inputModelData.ysfs}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>总单预报件/重/体：</span>
                            <span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.ybvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>总单实际件/重/体：</span>
                            <span>{{ inputModelData.realpiece}}/{{
                                Number(inputModelData.realweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.realvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>总单计费重量：</span>
                            <span>{{ Number(inputModelData.jfweight).toFixed(2)||0.00}}</span>
                        </div>

                        <div>
                            <span>小件数：</span>
                            <span>{{ inputModelData.smallpiece}}</span>
                        </div>
                    </div>

                     <div class="showpaneinfo" style="width:100%" v-if="hawbTableDataAi.length&&inputModelData.orderdom=='总单'">
                        <div>
                            <span>分运单号：</span>
                            <span>{{hawbTableDataAi[0]['hawb']||'--'}}</span>
                        </div>
                        <div>
                            <span>分单始发港：</span>
                            <span>{{hawbTableDataAi[0]['sfg']||'--'}}</span>
                        </div>
                        <div>
                            <span>分单到达港：</span>
                            <span>{{hawbTableDataAi[0]['mdg']||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%"  v-if="hawbTableDataAi.length&&inputModelData.orderdom=='总单'">
                        
                        <div>
                            <span>分单预报件/重/体：</span>
                            <span>
                                {{hawbTableDataAi[0]['ybpiece']}}/{{Number(hawbTableDataAi[0]['ybweight']).toFixed(2)||0.00}}/{{Number(hawbTableDataAi[0]['ybvolume']).toFixed(3)||0.000}}
                            </span>
                            <!-- <span>{{ Number(inputModelData.realweight).toFixed(2)||0.00 }}</span> -->
                        </div>

                        <div>
                            <span>分单实际件重体：</span>
                            <span>{{hawbTableDataAi[0]['realpiece']}}/{{Number(hawbTableDataAi[0]['realweight']).toFixed(2)||0.00}}/{{Number(hawbTableDataAi[0]['realvolume']).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>分单计费重量：</span>
                            <span>{{Number(hawbTableDataAi[0]['jfweight']).toFixed(2)}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="hawbTableDataAi.length||inputModelData.orderdom=='直单'">
                        <div>
                            <span>货物类型：</span>
                            <span>{{hawbTableDataAi.length?hawbTableDataAi[0]['hwlx']:inputModelData['hwlx']}}</span>
                        </div>

                        <div>
                            <span>货物性质：</span>
                            <span>{{hawbTableDataAi.length?hawbTableDataAi[0]['hwxz']:inputModelData['hwxz']}}</span>
                        </div>
                        <div>
                            <span>贸易方式：</span>
                            <span>{{hawbTableDataAi.length?hawbTableDataAi[0]['tradeterm']:inputModelData['tradeterm']}}</span>
                        </div>
                        <div v-if="hawbTableDataAi.length">
                            <span>结算方式：</span>
                            <span>{{hawbTableDataAi[0]['jsfs']=='1'?'月结':'现结'}}</span>
                        </div>
                    </div>



                   

                    <slot name="exinfo"></slot>
                </div>
                <!-- <div class="playGrid" v-show="inputModelData.opersystem!='国内服务'&&name=='详细'">
           <template v-for="(item,index) in getInfoList()" >
              <span :key="index">{{item.title}}</span>
              <span :title="item.tooltip"  v-html="item.value" :key="item.title" :style="item.style"></span>
           </template>
           <slot name="exinfo"></slot>
         </div> -->

                <div class="playGrid"
                    v-show="inputModelData.opersystem!='国内服务'&&name=='详细'&&inputModelData.iscomboine==1">
                    <template v-for="(item,index) in getInfoList(1)">
                        <span :key="index">{{item.title}}</span>
                        <span :title="item.tooltip" v-html="item.value" :key="item.title" :style="item.style"></span>
                    </template>
                    <slot name="exinfo"></slot>
                </div>

                <div class="showpanediv" v-show="inputModelData.opersystem=='国内服务'&&name=='详细'">
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>委托客户：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{ inputModelData.wtkhname}}</span>
                        </div>
                        <div>
                            <span>项目：</span>
                            <span class="color-red" :title="inputModelData.wtxmnameWhole">{{
                                inputModelData.wtxmnameWhole&&inputModelData.wtxmnameWhole.split('-')[0]}}</span>
                        </div>
                        <div>
                            <span>总运单号：</span>
                            <span>{{ inputModelData.mawb||'--'}}</span>
                        </div>
                        <div>
                            <span>分运单号：</span>
                            <span>{{ inputModelData.hawb||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>件数：</span>
                            <span>{{ inputModelData.piece||0}}</span>
                        </div>
                        <div>
                            <span>重量：</span>
                            <span>{{ Number(inputModelData.weight).toFixed(2)||0.00}}</span>
                        </div>
                        <div>
                            <span>体积：</span>
                            <span>{{ Number(inputModelData.volume).toFixed(3)||0.000}}</span>
                        </div>
                        <div>
                            <span>进仓编号：</span>
                            <span :title="inputModelData.khjcno">{{ inputModelData.khjcno||'--'}}</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>始发港：</span>
                            <span>{{ inputModelData.sfg||'--'}}</span>
                        </div>
                        <div>
                            <span>目的港：</span>
                            <span>{{ inputModelData.mdg||'--'}}</span>
                        </div>
                        <div>
                            <span>计费重量：</span>
                            <span>{{ Number(inputModelData.jfweight).toFixed(2)||0.00}}</span>
                        </div>
                        <div>
                            <span>结算重量：</span>
                            <span>{{ Number(inputModelData.accountweightin).toFixed(3)||0.000}}</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>发送人：</span>
                            <span>{{ inputModelData.addman||'--'}}</span>
                        </div>
                        <div>
                            <span>发送时间：</span>
                            <span>{{ inputModelData.adddate | formatDate('yyyy-MM-dd hh:mm')}}</span>
                        </div>
                        <div>
                            <span>绑定工作号：</span>
                            <span>{{ inputModelData.boaepono||'--'}}</span>
                        </div>
                        <div></div>
                    </div>
                    <slot name="exinfo"></slot>
                </div>

                <div class="showpanediv" v-show="name=='签单'">
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>委托客户：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{ inputModelData.wtkhname}}</span>
                        </div>
                        <div>
                            <span>项目：</span>
                            <span :title="inputModelData.wtxmnameWhole">{{
                                inputModelData.wtxmnameWhole&&inputModelData.wtxmnameWhole.split('-')[0]}}</span>
                        </div>
                        <div>
                            <span>配舱操作：</span>
                            <span>{{ czlx||'--'}}</span>
                        </div>
                        <div>
                            <span>配舱状态：</span>
                            <span>{{ pcstatus||'--'}}</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>总运单号：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{
                                inputModelData.mawb||'--'}}</span>
                        </div>
                        <div>
                            <span>分运单票数：</span>
                            <span class="color-red">{{ inputModelData.hawbnum}}</span>
                        </div>
                        <div>
                            <span>分运单号：</span>
                            <span>{{ inputModelData.hawb||'--'}}</span>
                        </div>
                        <div>
                            <span>分配模式：</span>
                            <span>
                                {{ getServiceGuid('OA0010','profitmode')||'本站'}}
                                <template v-if="inputModelData.profitquota">({{inputModelData.profitquota}})</template>
                            </span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>始发港：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{
                                inputModelData.sfg||'--'}}</span>
                        </div>
                        <div>
                            <span>目的港：</span>
                            <span>{{ inputModelData.mdg||'--'}}</span>
                        </div>
                        <div>
                            <span>运程天数：</span>
                            <span>{{ inputModelData['ycts']||'--'}}</span>
                        </div>
                        <div>
                            <span>航班种类：</span>
                            <span>{{ inputModelData['hbzl']||'--'}}</span>
                            <!-- <span style="margin-top:8px;">中转港：</span>
              <span style="margin-top:5px;width:172px;">
                <pageSelect
                  :pagetype="6"
                  :modelval.sync="inputModelData['zzg']"
                  :disabled="inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!='2'"
                ></pageSelect>
              </span>-->
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>预报件/重/体：</span>
                            <span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.ybvolume).toFixed(3)||0.000}}</span>
                        </div>
                        <div>
                            <span>应收结算重量：</span>
                            <span>{{ Number(inputModelData.accountweightin).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>报关重量：</span>
                            <span>{{ Number(inputModelData.realweight).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>货物性质：</span>
                            <span>{{ inputModelData.hwxz||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>实际件/重/体：</span>
                            <span>{{ inputModelData.realpiece}}/{{
                                Number(inputModelData.realweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.realvolume).toFixed(3)||0.000}}</span>
                        </div>
                        <div>
                            <span>应付结算重量：</span>
                            <span>{{ Number(inputModelData.accountweightout).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>制单计费重量：</span>
                            <span>{{Number(inputModelData.jfweight).toFixed(2)||0.00}}</span>
                        </div>
                        <div>
                            <span>货物类型：</span>
                            <span>{{ inputModelData.hwlx||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="inputModelData.opersystem!='进口'">
                        <div>
                            <span>签单件/重/体：</span>
                            <span>{{ inputModelData.signpiece}}/{{
                                Number(inputModelData.signweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.signvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>托书运费价格：</span>
                            <span>{{currencyChars}}{{
                                (Number(inputModelData['inwageallinprice']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice']).toFixed(2))||0.00}}({{getWageinType2(inputModelData.isinwageallin)}})</span>
                        </div>
                        <div>
                            <span>应收运费分泡：</span>
                            <span>WFF:{{Number(inputModelData.self_real_bp_freight_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_freight_in}}</span>
                        </div>
                        <div>
                            <span>是否空号：</span>
                            <span>{{ inputModelData['isempty']||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="inputModelData.opersystem!='进口'">
                        <div>
                            <span>制单件/重/体：</span>
                            <span>{{ inputModelData.zdpiece||0}}/{{
                                Number(inputModelData.zdweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.zdvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div>
                            <span>托书中转费价格：</span>
                            <span>{{currencyChars}}{{
                                (Number(inputModelData['inwageallinprice_trans']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice_trans']).toFixed(2))||0.00}}({{inputModelData.isinwageallin_trans==1?'单价':"总价"}})</span>
                        </div>
                        <div>
                            <span style="min-width:108px;">应收中转费分泡：</span>
                            <span>WFF:{{Number(inputModelData.self_real_bp_trans_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_trans_in}}</span>
                        </div>
                        <div>
                            <span>是否超限：</span>
                            <span>{{ inputModelData['iscx']||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%" v-if="inputModelData.opersystem!='进口'">
                        <div>
                            <span>应收运费价格：</span>
                            <span>{{currencyChars}}{{
                                inputModelData['freightpricein']&&(Number(inputModelData['freightpricein']).toFixed(2)==666666.00?'--':Number(inputModelData['freightpricein']).toFixed(2))||0.00}}({{getWageinType2(inputModelData.isinwageallin)}})</span>
                        </div>
                        <div>
                            <span>货物状态：</span>
                            <span>{{ hwstatus||'--'}}</span>
                        </div>
                        <div>
                            <span>报关状态：</span>
                            <span>{{ bgstatus||'--'}}</span>
                        </div>
                        <div>
                            <span>单证状态：</span>
                            <span>{{ dzstatus||'--'}}</span>
                        </div>

                    </div>

                    <div class="showpaneinfo" style="width:100%;display:none" v-if="inputModelData.opersystem!='进口'">
                        <div>
                            <span>航班种类：</span>
                            <span>{{ inputModelData['hbzl']||'--'}}</span>
                        </div>
                        <div>
                            <span style="margin-top:8px;">航班号：</span>
                            <span style="margin-top:5px;">
                                <el-input v-model="inputModelData['yqhbh']" :disabled="inputModelData.pcstatus>=100"
                                    v-verify="'uppercase'"></el-input>
                                <!--{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbh||inputModelData.hbh)||'--'}}-->
                            </span>
                        </div>
                        <div>
                            <span style="margin-top:8px;">航班日期：</span>
                            <span style="margin-top:5px;">
                                <el-date-picker v-model="inputModelData['yqhbrq']" :value-format="'yyyy-MM-dd'"
                                    :placeholder="'选择日期'" :disabled="inputModelData.pcstatus>=100" clearable>
                                </el-date-picker>
                                <!--<el-input v-model="inputModelData.hbrq"></el-input>-->
                                <!--{{ inputModelData.hbrq||inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbrq | formatDate('yyyy-MM-dd') || '--' }}-->
                            </span>
                        </div>

                        <div>
                            <span>起飞时间：</span>
                            <span>{{ inputModelData['yjqfsj']||'--'}}</span>
                        </div>
                    </div>
                </div>

                <div class="showpanediv" v-show="name=='合并'">
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>委托客户：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{ inputModelData.wtkhname}}</span>
                        </div>
                        <div>
                            <span>项目：</span>
                            <span :title="inputModelData.wtxmnameWhole">{{
                                inputModelData.wtxmnameWhole&&inputModelData.wtxmnameWhole.split('-')[0]}}</span>
                        </div>
                        <div>
                            <span>配舱操作：</span>
                            <span>{{ czlx||'--'}}</span>
                        </div>
                        <div>
                            <span>配舱状态：</span>
                            <span>{{ pcstatus||'--'}}</span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>总运单号：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{
                                inputModelData.mawb||'--'}}</span>
                        </div>
                        <div>
                            <span>分运单票数：</span>
                            <span class="color-red" :title="inputModelData.hawb">{{
                                inputModelData.hawb&&inputModelData.hawb.split(',').length||0}}</span>
                        </div>
                        <div>
                            <span>分运单号：</span>
                            <span>{{ inputModelData.hawb||'--'}}</span>
                        </div>
                        <div>
                            <span>分配模式：</span>
                            <span>
                                {{ getServiceGuid('OA0010','profitmode')||'本站'}}
                                <template v-if="inputModelData.profitquota">({{inputModelData.profitquota}})</template>
                            </span>
                        </div>
                    </div>
                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>始发港：</span>
                            <span class="color-red" :title="inputModelData.wtkhname">{{
                                inputModelData.sfg||'--'}}</span>
                        </div>
                        <div>
                            <span>目的港：</span>
                            <span>{{ inputModelData.mdg||'--'}}</span>
                        </div>
                        <div>
                            <span>航班号：</span>
                            <span>{{(inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbh||inputModelData.hbh)||'--'}}</span>
                        </div>

                        <div>
                            <span>航班日期：</span>
                            <span>{{ inputModelData.hbrq||inputModelData.shipaceInfo&&inputModelData.shipaceInfo.hbrq |
                                formatDate('yyyy-MM-dd') }}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%;">
                        <div>
                            <span>预报件/重/体：</span>
                            <span>{{ inputModelData.ybpiece}}/{{ Number(inputModelData.ybweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.ybvolume).toFixed(3)||0.000}}</span>
                        </div>
                        <div>
                            <span>应收结算重量：</span>
                            <span>{{ Number(inputModelData.accountweightin).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>报关重量：</span>
                            <span>{{ Number(inputModelData.realweight).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>货物性质：</span>
                            <span>{{ inputModelData.hwxz||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div>
                            <span>实际件/重/体：</span>
                            <span>{{ inputModelData.realpiece}}/{{
                                Number(inputModelData.realweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.realvolume).toFixed(3)||0.000}}</span>
                        </div>
                        <div>
                            <span>应付结算重量：</span>
                            <span>{{ Number(inputModelData.accountweightout).toFixed(2)||0.00 }}</span>
                        </div>
                        <div>
                            <span>制单计费重量：</span>
                            <span>{{Number(inputModelData.jfweight).toFixed(2)||0.00}}</span>
                        </div>
                        <div>
                            <span>货物类型：</span>
                            <span>{{ inputModelData.hwlx||'--'}}</span>
                        </div>
                    </div>

                    <div class="showpaneinfo" style="width:100%">
                        <div v-if="inputModelData.opersystem!='进口'">
                            <span>制单件/重/体：</span>
                            <span>{{ inputModelData.zdpiece||0}}/{{
                                Number(inputModelData.zdweight).toFixed(2)||0.00}}/{{
                                Number(inputModelData.zdvolume).toFixed(3)||0.000}}</span>
                        </div>

                        <div v-if="inputModelData.iscomboine!=1">
                            <span>应收运费价格：</span>
                            <span style="color:#009900">{{
                                (Number(inputModelData['inwageallinprice']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice']).toFixed(2))||0.00}}({{getWageinType2(inputModelData.isinwageallin)}})</span>
                        </div>
                        <div v-if="inputModelData.iscomboine!=1">
                            <span style="display:inline-block;text-align:right;width:111px;">应收运费分泡：</span>
                            <span
                                style="color:#009900">WFF:{{Number(inputModelData.self_real_bp_freight_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_freight_in}}</span>
                        </div>

                    </div>
                    <div class="showpaneinfo" style="width:100%" 　v-if="inputModelData.iscomboine!=1">
                        <div>
                            <span style="display:inline-block;text-align:right;width:111px;">托书运费价格：</span>
                            <span style="color:#009900">{{
                                (Number(inputModelData['inwageallinprice']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice']).toFixed(2))||0.00}}({{getWageinType2(inputModelData.isinwageallin)}})</span>
                        </div>
                        <div>
                            <span style="display:inline-block;text-align:right;width:111px;">托书中转费价格：</span>
                            <span style="color:#009900">{{
                                inputModelData['inwageallinprice_trans']&&(Number(inputModelData['inwageallinprice_trans']).toFixed(2)==666666.00?'--':Number(inputModelData['inwageallinprice_trans']).toFixed(2))||0.00}}({{getWageinType2(inputModelData.isinwageallin)}})</span>
                        </div>
                        <div>
                            <span style="display:inline-block;text-align:right;width:111px;">应收中转费分泡：</span>
                            <span
                                style="color:#009900">WFF:{{Number(inputModelData.self_real_bp_trans_in)}}&nbsp;&nbsp;:&nbsp;&nbsp;客户:{{inputModelData.cus_real_bp_trans_in}}</span>
                        </div>
                        <div></div>
                    </div>
                </div>

                <slot name="profit"></slot>
            </div>
        </el-collapse-transition>

        <el-dialog :visible.sync="detailShow.lxrShow" v-if="detailShow.lxrShow" append-to-body width="1080px"
            title="联系人信息" center>
            <infoList style="margin-bottom:25px;" :inputModelData="inputModelData" :jiediandata.sync="jiediandata"
                :ifopendetail="ifopendetail" :name="name" :pagetype="pagetype" nesting :hawbTableDataAi="hawbTableDataAi">
            </infoList>

            <mawbContacts :inputModelData="inputModelData" :mawbguid="inputModelData.guid"
                v-if="inputModelData.guid&&detailShow.lxrShow"></mawbContacts>
        </el-dialog>

        <!-- 照片文档 -->
        <el-dialog :visible.sync="dialogImg" :close-on-click-modal="false" class="dialogPage" width="100%" top="0px"
            v-if="dialogImg&&inputModelData.guid" append-to-body>
            <infoList style="padding:12px;" v-if="!isoutside" :inputModelData="inputModelData"
                :jiediandata.sync="jiediandata" :ifopendetail="ifopendetail" :name="name" :pagetype="pagetype" nesting :hawbTableDataAi="hawbTableDataAi">
            </infoList>

            <div class="reconciliationMng" style="text-align:center">
                <el-button-group class="buttonTabs">
                    <el-button @click.native="doctype=true;dialogDoc=false" :class="[doctype?'active':'']">本票照片
                    </el-button>
                    <el-button @click.native="doctype=false;dialogDoc=true" :class="[!doctype?'active':'']">本票文档
                    </el-button>
                </el-button-group>
            </div>


            <div class="mergedoc">
                <!-- <iframe :src="imgUrl" frameborder="0" allowtransparency="true"
                    style="width: 100%; height: 100%; border: 0px none;min-height:785px"
                    v-show="inputModelData.guid&&doctype"></iframe> -->
                <imgUpload v-show="inputModelData.guid&&doctype" :src="imgUrl" :imgdocCheckedList.sync="imgList"
                    :deleteIds.sync="deleteIds" :InputModelsystem="inputModelData.system"></imgUpload>

                <docUpload :dialogShow.sync="dialogImg" :modelData="inputModelData" :deleteIds.sync="deleteIds"
                    v-show="inputModelData.guid&&!doctype" pagetype="2" :showBtnGroup="false"
                    :selectTableIndex="selectTableIndex" :imgdocCheckedList.sync="docList" :servicecode="servicecode">
                </docUpload>
                <imgdocTable :imgList.sync="imgList" :docList.sync="docList" :deleteIds.sync="deleteIds"
                    :system="isoutside?'wff':'bo'" :boguid="inputModelData.boguid"></imgdocTable>
            </div>


        </el-dialog>

        <!-- <el-dialog
      :visible.sync="dialogDoc"
      class="dialogImgDoc"
      :close-on-click-modal="false"
      v-if="dialogDoc"
      width="980px"
      append-to-body
      top="0"
    >
      <iframe
        :src="docUrl"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"
        v-if="inputModelData.guid"
      ></iframe>
    </el-dialog> -->

        <!-- <docUpload :dialogShow.sync="dialogDoc" :modelData="inputModelData" v-if="inputModelData.guid&&dialogDoc"
            pagetype="2" :selectTableIndex="selectTableIndex">
            <template slot="infolist">
                <infoList :inputModelData="inputModelData" :jiediandata.sync="jiediandata" :ifopendetail="ifopendetail"
                    :name="name" :pagetype="pagetype" nesting>
                </infoList>
            </template>
        </docUpload> -->

        <el-dialog :visible.sync="detailShow.reasonShow" width="900px" top="4%" v-if="detailShow.reasonShow" center
            append-to-body>
            <cancelReason :jobData="inputModelData" :pagetype="4" :visible.sync="detailShow.reasonShow"></cancelReason>
        </el-dialog>


        <!-- 分配信息操作站 -->
        <el-dialog :visible.sync="assignCzInfo" :close-on-click-modal="false" v-if="assignCzInfo" append-to-body
            width="900px">
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
                    <tr v-for="(item,index) in assignXsDataSfg.saleservice"
                        :style="{background:index%2==0?'white':'#f8f8f8'}" v-if="item.assignarea" :key="index">
                        <td style="width:260px;text-overflow:ellipsis;overflow:hidden;" :title="item.assignname">
                            {{item.assignname}}</td>
                        <td style="width:80px">{{item.assignarea}}</td>
                        <td>{{item.profitmode }}</td>
                        <td>{{item.profitmode=="利润分配模式"||item.inwageallinprice=='666666'?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}
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
                    <tr v-for="(item,index) in assignXsDataSfg.operservice"
                        :style="{background:index%2==0?'white':'#f8f8f8'}" v-if="item.assignarea" :key="index">
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

    </div>
</template>

<script>
    import mawbContacts from "./mawbContacts"; //总单联系人
    import jiedian from "./jiedian"; //节点
    import imgdocTable from '@/components/docSystem/imgdocTable'
    import {getOrderInfo} from "@/api/order.js"
    import {
        computedWeight,
        formatDate,
        getValByGrouid,
        getValByStatus,
        getWtkhname,
        getWtxmname
    } from "../../api/localStorage.js";
    import imgUpload from "@/components/docSystem/imgUpload"
    export default {
        props: {
            inputModelData: Object,
            pono: String,
            ifopendetail: {
                //是否可点击订单编号打开详细界面
                type: Boolean,
                default: true
            },
            showMawbSearch: {
                //是否显示总运单搜索框
                type: Boolean,
                default: false
            },
            showMawbSearch: {
                //是否显示总运单搜索框
                type: Boolean,
                default: false
            },
            costBiaozhu: {
                //费用标注
                type: Boolean,
                default: false
            },
            name: {
                type: String, //合并 签单 详细，默认综合查询明细
                default: ""
            },
            pagetype: [Number, String],//详细页面的pagetype
            showBtnGroup: {//是否显示按钮组
                //按钮组
                type: Boolean,
                default: true
            },
            showDcno: {
                type: Boolean,//是否显示订舱编号
                default: true
            },
            nesting: {
                type: Boolean,
                default: false
            },
            positionDocUpload: {//是否直接定位到文档上传页
                type: Boolean,
                default: false
            },
            showBtnArr: {//要显示的按钮组
                type: Array,
                default: () => [30, 50, 60, 70, 80, 90]
            },
            showDeatil: {//1订单查询，2货物查询，3未对账
                type: String,
                default: '1'
            },
            hawbTableDataAi:{//@@ 进口更改
                type:Array,
                default:()=>[]
            },
            showOrderNumber:{
                type: Boolean,
                default: true
            }
        },
        components: {
            mawbContacts,
            jiedian,
            imgUpload,
            imgdocTable
        },

        data() {
            return {
                paneShow: true,
                paneShowEd: false, //详细是否展开过，使报关信息只取一次
                detailShow: {
                    pane1: false,
                    pane2: false,
                    jiedianShow: false,
                    lxrShow: false,
                    reasonShow: false
                },
                dialogImg: false, //图片弹窗
                dialogDoc: false, //文档弹窗
                doctype: true,//true照片 false 文档
                jiediandata: [],
                newMawb: "",
                mawbRestaurants: [
                    // {value:'111-222222222'},
                    // {value:'111-223333333'},
                ],
                selectTableIndex: '',//用于判断是否需要定位到文档上传tab
                servicecode: "",//文档所属的servicecode,用于选中对应服务的文档所属
                assignXsDataSfg: [], //分配信息销售站数据
                assignCzInfo: false, //分配信息操作站弹框
                imgList: [],//存放图片的数据
                docList: [],//存放文档的数据
                deleteIds: [],
                selectHawb:'',//选择分运单号
                hawbArray:[],//分运单列表
            };
        },
        methods: {
            jjdChange(id){
                if(id&&id!='-1'){
                   return JSON.parse(localStorage.jjd).filter(i=>i.id==id)[0]['cname']
                }
               
            },
            copyToClipboard(text) {
                let textArea = document.createElement('textarea');
                textArea.style.position = 'fixed';
                textArea.style.zIndex = -1;
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.width = '1em';
                textArea.style.height = '1em';
                textArea.style.padding = '0';
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();

                try {
                    document.execCommand('copy');
                } catch (err) {
                    this.$message.error('抱歉,该浏览器不支持点击复制到剪贴板!');
                    return
                }

                document.body.removeChild(textArea);
                this.$message.success('已复制到剪贴板!');
            },
            // 获取订单详情数据
            getDetailInfo(){
                 getOrderInfo(this.inputModelData.boguid)
                    .then(res => {
                    if (res.data) {
                        this.$store.commit("setChat", { status: true, data: res.data });
                    }
            })
                    .catch(errors => {});
            },
            btnJurisdic(num) {
                return this.showBtnArr.includes(num)
            },
            getInfoList(type) {//根据配置的数据生成摘要面板信息

                let inputModelData = this.inputModelData;
                let wtxmname = inputModelData.wtxmnameWhole && inputModelData.wtxmnameWhole.split('-')[0];
                let tsyfjg = `${this.currencyChars}${(Number(inputModelData['inwageallinprice']).toFixed(2) == 666666.00 ? '--' : Number(inputModelData['inwageallinprice']).toFixed(2)) || 0.00}(${this.getWageinType(inputModelData.isinwageallin)})`;
                let tszzfjg = `${this.currencyChars}${(Number(inputModelData['inwageallinprice_trans']).toFixed(2) == 666666.00 ? '--' : Number(inputModelData['inwageallinprice_trans']).toFixed(2)) || 0.00}(${inputModelData.isinwageallin_trans == 1 ? '单价' : "总价"})`;
                let hbh = (inputModelData.shipaceInfo && inputModelData.shipaceInfo.hbh || inputModelData.hbh) || '--'
                let hbrq = formatDate(inputModelData.hbrq || (inputModelData.shipaceInfo && inputModelData.shipaceInfo.hbrq), 'yyyy-MM-dd')
                let qfsj = formatDate(inputModelData.qfsj, 'hh:mm')
                let ysyf = `${this.currencyChars}${inputModelData['freightpricein'] && (Number(inputModelData['freightpricein']).toFixed(2) == 666666.00 ? '--' : Number(inputModelData['freightpricein']).toFixed(2)) || 0.00}(${this.getWageinType(inputModelData.isinwageallin)})`
                let ybjzt = `${inputModelData.ybpiece}/${Number(inputModelData.ybweight).toFixed(2) || 0.00}/${Number(inputModelData.ybvolume).toFixed(3) || 0.000}`
                let sjjzt = `${inputModelData.realpiece}/${Number(inputModelData.realweight).toFixed(2) || 0.00}/${Number(inputModelData.realvolume).toFixed(3) || 0.000}`
                let ysyffp = `WFF:${Number(inputModelData.self_real_bp_freight_in)}&nbsp;&nbsp;:&nbsp;&nbsp;客户:${inputModelData.cus_real_bp_freight_in}`
                let yszzf = `${this.currencyChars}${inputModelData['inwageallinprice_trans'] && (Number(inputModelData['inwageallinprice_trans']).toFixed(2) == 666666.00 ? '--' : Number(inputModelData['inwageallinprice_trans']).toFixed(2)) || 0.00}(${this.getWageinType(inputModelData.isinwageallin)})`
                let qdjzt = `${inputModelData.signpiece || 0}/${Number(inputModelData.signweight).toFixed(2) || 0.00}/${Number(inputModelData.signvolume).toFixed(3) || 0.000}`
                let yszzffp = `WFF:${Number(inputModelData.self_real_bp_trans_in)}&nbsp;&nbsp;:&nbsp;&nbsp;客户:${inputModelData.cus_real_bp_trans_in}`
                let zdjzt = `${inputModelData.zdpiece || 0}/${Number(inputModelData.zdweight).toFixed(2) || 0.00}/${Number(inputModelData.zdvolume).toFixed(3) || 0.000}`
                let jjd = (inputModelData.shipaceInfo && inputModelData.shipaceInfo.terminalname) || '--'

                if (type == 1) {
                    return [{
                        title: '总运单号：',
                        value: inputModelData.mawb
                    },
                    {
                        title: '始发港：',
                        value: inputModelData.sfg
                    },
                    {
                        title: '目的港：',
                        value: inputModelData.mdg
                    },
                    {
                        title: ''
                    },
                    {
                        title: '预报件/重/体：',
                        value: ybjzt
                    },
                    {
                        title: '实际件/重/体：',
                        value: sjjzt
                    },
                    {
                        title: '签单件/重/体：',
                        value: qdjzt
                    },
                    {
                        title: '制单件/重/体：',
                        value: zdjzt
                    },
                    {
                        title: '货物类型：',
                        value: inputModelData.hwlx || '--'
                    },
                    {
                        title: '货物性质：',
                        value: inputModelData.hwxz || '--'
                    },
                    {
                        title: '分运单票数：',
                        value: inputModelData.hawbnum || 0
                    },
                    {
                        title: '分配模式：',
                        value: this.getServiceGuid('OA0010', 'profitmode') || '本站'
                    },
                    {
                        title: '航班号：',
                        value: hbh
                    },
                    {
                        title: '航班日期：',
                        value: hbrq
                    },
                    {
                        title: '起飞时间：',
                        value: qfsj
                    },
                    {
                        title: '交接地：',
                        value: jjd
                    },
                    ]
                }
                return [{
                    title: '委托客户：',
                    value: inputModelData.wtkhname,
                    tooltip: inputModelData.wtkhname,
                    style: {
                        color: 'red'
                    }
                },
                {
                    title: '项目：',
                    value: wtxmname,
                    tooltip: wtxmname,
                    style: {
                        color: 'red'
                    }
                },
                {
                    title: '配舱操作：',
                    value: inputModelData.czlx
                },
                {
                    title: '托书运费价格：',
                    value: tsyfjg
                },
                {
                    title: '总运单号：',
                    value: inputModelData.mawb
                },
                {
                    title: '始发港：',
                    value: inputModelData.sfg
                },
                {
                    title: '目的港：',
                    value: inputModelData.mdg
                },
                {
                    title: '托书中转费价格：',
                    value: tszzfjg
                },
                {
                    title: '分运单票数：',
                    value: inputModelData.hawbnum || 0
                },
                {
                    title: '航班号：',
                    value: hbh
                },
                {
                    title: '航班日期：',
                    value: hbrq
                },
                {
                    title: '应收运费：',
                    value: ysyf
                },
                {
                    title: '预报件/重/体：',
                    value: ybjzt
                },
                {
                    title: '货物类型：',
                    value: inputModelData.hwlx || '--'
                },
                {
                    title: '货物性质：',
                    value: inputModelData.hwxz || '--'
                },
                {
                    title: '应收运费分泡：',
                    value: ysyffp
                },
                {
                    title: '实际件/重/体：',
                    value: sjjzt
                },
                {
                    title: '报关重量：',
                    value: Number(inputModelData.realweight).toFixed(2) || 0.00
                },
                {
                    title: '交接地：',
                    value: jjd
                },
                {
                    title: '应收中转费：',
                    value: yszzf
                },
                {
                    title: '签单件/重/体：',
                    value: qdjzt
                },
                {
                    title: '制单计费：',
                    value: Number(inputModelData.jfweight).toFixed(2) || 0.00
                },
                {
                    title: '分配模式：',
                    value: this.getServiceGuid('OA0010', 'profitmode') || '本站'
                },
                {
                    title: '应收中转费分泡：',
                    value: yszzffp
                },
                {
                    title: '制单件/重/体：',
                    value: zdjzt
                },
                {
                    title: '报关单票数',
                    value: inputModelData.bgNumbers || '0'
                },
                {
                    title: '报关单号',
                    value: inputModelData.bgponos || '--'
                },
                {
                    title: '报关方式：',
                    value: inputModelData.bglx || '--'
                },
                {
                    title: '分运单号',
                    value: inputModelData.hawb
                },
                ]
            },
            querySearchAsync(queryString, cb) {
                let mawbRestaurants = this.mawbRestaurants;
                let results = queryString ?
                    mawbRestaurants.filter(this.createStateFilter(queryString)) :
                    mawbRestaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 10 * Math.random());
            },
            createStateFilter(queryString) {
                return state => {
                    return (
                        state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
                    );
                };
            },
            handleSelect(item) {
                // console.log(item);
                this.getNewMawbinfo();
            },
            handleSelectMawb(){
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxpline/GetStoreMawbInfo",
                    loading: false,
                    params: {
                        orderdom:'',
                        mawb:this.newMawb,
                        area:this.inputModelData.area,
                        hawb:'',
                    },
                    tip: false
                }).then(({data})=>{
                    this.hawbArray=data
                })
            },
            // 进口更改
            getNewMawbinfo(type) { //type总单、分单
            //console.log(type)
                let json={}
                if(typeof(type)!='string'||!type){
                  json = {
                    mawb: this.newMawb,
                    area: this.inputModelData.area,
                    system: this.inputModelData.system
                  };
                }else{
                  json = {
                    boguid: this.selectHawb,
                  };
                }

                if (!this.newMawb) {
                    return this.$message.error("请输入总运单号查询！");
                }
                if ((this.newMawb == this.inputModelData.mawb)&&!type) {
                    return this.$message.error("请输入不同于当前页面的总运单号查询！");
                }
                if(this.inputModelData.system != '空出') {
                    if(this.hawbArray.filter(i=>i.boguid==this.selectHawb)[0]['hawb']==this.hawbTableDataAi[0]['hawb']&&type){
                        return this.$message.error("请输入不同于当前页面的分运单号查询！");
                    }
                }

                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxpline",
                    params: json,
                    loading: true,
                    tip: false,
                    nofield: true
                }).then(results => {
                    console.log(results);
                    if (results.data) {
                        if (
                            this.mawbRestaurants.filter(i => i.value == this.newMawb).length ==
                            0
                        ) {
                            this.mawbRestaurants.unshift({
                                value: this.newMawb
                            });
                        }
                        if (
                            this.inputModelData.mawb &&
                            this.mawbRestaurants.filter(
                                i => i.value == this.inputModelData.mawb
                            ).length == 0
                        ) {
                            this.mawbRestaurants.unshift({
                                value: this.inputModelData.mawb
                            });
                        }

                        sessionStorage.setItem(
                            "mawbRestaurants",
                            JSON.stringify(this.mawbRestaurants)
                        );

                        this.$emit("success", results.data);
                    } else {
                        this.$message.error("无查询数据！");
                    }
                });
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
            getWageinType2(isinwageallin) {
                if (isinwageallin == "1") {
                    return "单价ALLIN";
                } else if (isinwageallin == "2") {
                    return "M级++";
                } else if (isinwageallin == "3") {
                    return "单价++";
                } else if (isinwageallin == "4") {
                    return "Cost+";
                }
            },

            getServiceGuid(code, field) {
                //获取服务节点参数
                //field 传guid orderpgid childpgid
                if (this.inputModelData.serviceList) {
                    let guid;
                    field = field || "guid";
                    for(var i in this.inputModelData.serviceList){
                        var item=this.inputModelData.serviceList[i]
                       if(item.servicecode=='OA0010'&&item[field]){
                          guid=item[field] 
                          break;
                       }else{
                         if(item[field]){
                            guid=item[field] 
                         }else{
                             continue
                         }  
                       }
                    }
                    // this.inputModelData.serviceList.forEach(i => {
                    //     if (i.servicecode == code) {
                    //         guid = i[field];
                    //     }
                    // });
                    return guid;
                }
            },
            openDetail(type = 1) {
                if ((this.ifopendetail || type == 2) && this.inputModelData.guid && this.inputModelData.guid != -1 && this.pagetype != 21) {
                    this.$store.state.mainSearch = true;
                    var object = {
                        title: type == 1 ? "订单详细信息" : "订舱详细信息",
                        mawbguid: this.inputModelData.guid,
                        boguid: this.inputModelData.boguid,
                        area: this.inputModelData.area,
                        orderdom: this.inputModelData.orderdom,
                        pagetype: 6,
                        ordertype: type || 1
                    };
                    this.$store.commit("setMainSearch", object);
                }
            },
            openDoc() {
                if (!this.inputModelData.area && (!this.$store.state.areaState || this.$store.state.areaState.includes(","))) {
                    return this.$message.error('请选择有且仅有一个站点！');
                }
                // this.dialogDoc = true;
                this.dialogImg = true;
                this.doctype = false
            },
            getHawbList() {
                //从分运单列表里获取报关单信息
                if (!this.inputModelData.guid) return;
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/axpline/GetAxplineDecl",
                    params: {
                        hpoid: this.inputModelData.guid
                    },
                    loading: true,
                    tip: false
                }).then(results => {
                    let bgdata = results.data.map(i => [...i.declList]).flat();
                    this.inputModelData.bgNumbers = bgdata.length || 0;
                    this.inputModelData.bgponos = bgdata.map(i => i.pono).toString() || "";
                });
            },
            // 分配至销售站查询
            assignXsPlation(type) {
                //type 1分配至销售站查询 2操作站
                this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxplineServiceSearch",
                    loading: false,
                    params: {
                        boguidlist: this.inputModelData.boguid
                    },
                    tip: false
                })
                    .then(results => {
                        //operservice 操作站  saleservice销售站
                        this.assignXsDataSfg = results.data
                        if (this.assignXsDataSfg.operservice && this.assignXsDataSfg.operservice.length > 0 || this.assignXsDataSfg.saleservice && this.assignXsDataSfg.saleservice.length > 0) {
                            this.assignCzInfo = true;
                        } else {
                            this.$message.error("无分配信息");
                        }
                    })
                    .catch(errors => { });
            },
        },
        computed: {
            isoutside() {
                return sessionStorage.system == 'outside'
            },
            czlx() {
                return getValByGrouid(132, this.inputModelData.czlx);
            },
            pcstatus() {
                return getValByStatus("配舱状态", this.inputModelData.pcstatus);
            },
            hwstatus() {
                return getValByStatus("货物状态", this.inputModelData.hwstatus);
            },
            bgstatus() {
                return getValByStatus("报关状态", this.inputModelData.bgstatus);
            },
            dzstatus() {
                return getValByStatus("单证状态", this.inputModelData.dzstatus);
            },
            currencyChars() {
                let c = {
                    人民币: "￥",
                    美元: "$",
                    港币: "HK$",
                    日元: "JPY￥",
                    欧元: "€",
                    英镑: "£"
                }; //币种
                return (
                    (this.inputModelData.currency && c[this.inputModelData.currency]) ||
                    "￥"
                );
            },
            // ysfs(){
            //     return getValByGrouid('64',this.inputModelData.ysfs)
            // }
        },
        mounted(){
            
        },
        created() {
            
            if (this.nesting) {
                this.paneShow = true
            }
            if (
                sessionStorage.mawbRestaurants &&
                JSON.parse(sessionStorage.mawbRestaurants).filter(
                    i => i.value == this.inputModelData.mawb
                ).length == 1
            ) {
                this.mawbRestaurants = JSON.parse(sessionStorage.mawbRestaurants);
            }

            if (this.inputModelData.opersystem != "国内服务" && this.name == "详细") {
                this.$watch(
                    () => {
                        return this.paneShow
                    }, () => {
                        if (this.paneShow && !this.paneShowEd) {
                            this.paneShowEd = true
                            this.getHawbList();
                        }
                    }, {
                    immediate: true
                })
            }

            this.$watch(
                function () {
                    return this.inputModelData;
                },
                function (data) {
                    this.newMawb = data.mawb;
                    let mawbtype = this.inputModelData.orderdom == "直单" ? 1 : 2;
                    let usrname = this.isoutside ? sessionStorage.out_logname : localStorage.usrname;
                    // this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${this.area || data.area}&boguid=${data.boguid}`;
                    this.docUrl = `${this.$store.state.imgWebApi}boimgCommon/#/docpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${this.area || data.area}&boguid=${data.boguid}`;


                    if (this.isoutside) {
                        if (this.showDeatil == '2') {
                            if (data.pono) {
                                this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jcno=${data.jcno}&uploadButton=1&system=${data.pono.indexOf('PVG') != '-1' ? 'wff' : 'bo'}`;
                            }
                        } else {
                            if (data.pono && data.pono.indexOf('PVG') != '-1') {
                                this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.operid}&mawbtype=${mawbtype}&cwid=${data.shipaceInfo && data.shipaceInfo.operid || '-1'}&area=${data.area}&uploadButton=1&system=wff`;
                            } else {
                                this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid || '-1'}&area=${data.area}&uploadButton=1&system=bo`;
                            }
                        }
                    } else {
                        this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${this.area || data.area}&boguid=${data.boguid}`;

                    }




                    this.inputModelData.sjComWeight =
                        this.inputModelData.sjComWeight ||
                        computedWeight(
                            this.inputModelData.realvolume,
                            this.inputModelData.realweight
                        );
                    var profitmode = this.getServiceGuid("OA0010", "profitmode");
                    if (profitmode && profitmode.indexOf("Co-Load") != "-1") {
                        let currencyData = JSON.parse(localStorage.getItem("currencyData"));
                        let currency = this.getServiceGuid("OA0010", "profitcurrency");
                        if (currency) {
                            for (let m in currencyData) {
                                if (currencyData[m].cname == currency) {
                                    currency = currencyData[m].fcode;
                                }
                            }
                        }
                        this.inputModelData.profitquota =
                            Number(this.getServiceGuid("OA0010", "profitprice")=='666666'?'0':this.getServiceGuid("OA0010", "profitprice")).toFixed(2) +
                            currency;
                    }

                    if (profitmode && profitmode.indexOf("利润") != "-1") {
                        //  this.inputModelData.profitquota = Number(data.self_profitvalue).toFixed(0) + '/' + Number(data.cus_profitvalue).toFixed(0)
                        if (data.pono.indexOf("-") >= 0) {
                            this.inputModelData.profitquota =
                                Number(data.self_profitvalue).toFixed(0) +
                                "(" +
                                data.pono.split("-")[0].substr(-3) +
                                ")/" +
                                Number(data.cus_profitvalue).toFixed(0) +
                                "(" +
                                data.pono.split("-")[1] +
                                ")";
                        } else if (data.pono.indexOf("(") >= 0) {
                            this.inputModelData.profitquota =
                                Number(data.self_profitvalue).toFixed(0) +
                                "(" +
                                data.pono.split("(")[0].substr(-3) +
                                ")/" +
                                Number(data.cus_profitvalue).toFixed(0) +
                                "(" +
                                data.pono.split("(")[1].substr(0, 3) +
                                ")";
                        } else {
                            this.inputModelData.profitquota =
                                Number(data.self_profitvalue).toFixed(0) +
                                "/" +
                                Number(data.cus_profitvalue).toFixed(0);
                        }
                    }
                    this.inputModelData.wtkhname =
                        this.inputModelData.wtkhname || getWtkhname(this.inputModelData.fid);
                    this.inputModelData.wtxmnameWhole = getWtxmname(this.inputModelData.gid, 0, false);

                }, {
                immediate: true,
                deep: true
            }
            );

            if (this.positionDocUpload) {
                this.selectTableIndex = -1;
                this.openDoc()
            }
            //@@进口更改
            if(this.inputModelData.opersystem=='进口'){
                this.handleSelectMawb()
            }
        },
        watch: {
            jiediandata: {
                handler(data) {
                    this.$emit("update:jiediandata", data);
                },
                immediate: true,
                deep: true
            },
            "$store.getters.userSetting": {
                handler() {
                    if (this.$store.getters.userSetting.showInfoList) {
                        this.paneShow = true;
                    } else {
                        this.paneShow = false;
                    }
                },
                immediate: true
            }
        }
    };
</script>

<style lang="less" scoped>
    // .dialogImgDoc {
    //   /deep/ .el-dialog__body {
    //     padding: 0px;
    //     height: calc(100% - 40px);
    //   }
    //   /deep/ .el-dialog {
    //     height: 100%;
    //   }
    // }

    .autocomplete {
        width: 130px;

        /deep/ input {
            background: #f2f2f2;
            border: none;
            //  font-size: 16px;
            font-weight: 600;
        }

        /deep/ .el-input--suffix .el-input__inner {
            padding-right: 0px;
        }
    }
    .hawbSelect{
       /deep/ input{
           background:transparent;
           border:none;
           width:130px;
       }
    }

    .isopen {
        cursor: pointer;
        text-decoration: underline;
    }

    .color-red {
        color: red !important;
    }

    .playGrid {
        padding: 10px 15px 15px;
        margin-bottom: 10px;
        border: 1px solid #e8e8e8;
        display: grid;
        grid-template-columns: repeat(4, 112px calc(25% - 112px));
        grid-row-gap: 7px;

        span:nth-child(odd) {
            text-align: right;
        }

        span:nth-child(even) {
            display: inline-block;
            width: auto;
            max-width: 250px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #009900;
        }
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

    .mergedoc {
        /deep/ .dialogPage {
            position: relative !important;
            top: 0px;
            left: 0px;
            right: 0px;

            .el-dialog__header {
                display: none;
            }
        }
    }
</style>