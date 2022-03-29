<template>
    <div>
        <!-- {{modelData.smallpiece}} -->
        <div v-if="!mawbput">
            <infoList :inputModelData="modelData" :ifopendetail="false" ref="infoButton" :effect="effect"
                v-show="effect!=3&&pagetype!=2">

                <template slot="back">
                    <span style="margin-left:100px;cursor:pointer" @click="back">
                        <i class="el-icon-arrow-left" style="font-weight:bolder;font-size:16px;color:#000;"></i>
                        <span style="color:#000;font-size:16px;">{{$t('common.back')}}</span>
                    </span>
                </template>
            </infoList>

            <div class="infoListPono" style="margin-bottom: 12px;" v-if="pagetype!=2">
                <span>订舱编号：</span><span>{{modelData.pono}}</span>
            </div>
            <div class="node" v-if="effect&&effect!='3'">
                <ul>
                    <li v-for="(i,index) in nodeList"
                        :class="{'success':i.type=='success','gray':nodeList[index-1]&&nodeList[index-1].type=='success'&&i.type=='unsuccess','white':i.type=='unsuccess'&&nodeList[index-1]&&nodeList[index-1].type=='unsuccess'}">
                        <div class="iconText">
                            <img src="/boStatic/images/outside/finish.png" style="margin-bottom:8px;"
                                v-if="i.type=='success'">
                            <img src="/boStatic/images/outside/run.png" style="margin-bottom:8px;"
                                v-if="nodeList[index-1]&&nodeList[index-1].type=='success'&&i.type=='unsuccess'">
                            <img src="/boStatic/images/outside/unstartt.png" style="margin-bottom:8px;"
                                v-if="i.type=='unsuccess'&&nodeList[index-1]&&nodeList[index-1].type=='unsuccess'">
                            {{i.nodename}}
                        </div>
                        <div
                            :class="['line',{'lineSuccess':i.type=='success'&&nodeList[index+1]&&nodeList[index+1].type=='success','linegray':nodeList[index+1]&&nodeList[index+1].type=='unsuccess'&&i.type=='success','linewhite':i.type=='unsuccess'&&nodeList[index+1]&&nodeList[index+1].type=='unsuccess'}]">
                        </div>
                    </li>
                </ul>
            </div>

            <div class="infoPane" :style="effectStyle()">
                <div><span style="font-size: 24px;color:#fff;margin-right: 24px;">{{modelData.wtkhname}}</span>
                    <span class="infoPaneSystem">{{modelData.opersystem}}</span><span
                        class="infoPaneSystem">{{modelData.opersystemdom}}</span>

                    <span style="float:right">
                        <button :class="['button',effect!='3'?'buttonHover1':'buttonHover2']" v-if="effect=='3'"
                            style="margin-right:16px;" @click="openDialog">前往修改</button>
                        <button :class="['button',effect!='3'?'buttonHover1':'buttonHover2']"
                            v-if="effect=='1'||effect=='3'" @click="showBack">撤单</button>
                        <button :class="['button',effect!='3'?'buttonHover1':'buttonHover2']" v-if="effect=='2'"
                            style="margin-right:16px;" @click="confirmPrice">同意报价</button>
                        <button :class="['button',effect!='3'?'buttonHover1':'buttonHover2']" v-if="effect=='2'"
                            @click="showBackDialog=true">驳回</button>

                    </span>
                </div>
                <p style="color:#fff;margin-top:8px;opacity:.6">委托客户</p>
                <div style="height: 46px;display: grid;grid-auto-flow: column;margin-top:32px;">
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span class="number">{{modelData.ybpiece}}</span><span class="ompany">PCS</span>
                            <span class="number">{{Number(modelData.ybweight||0).toFixed(2)}}</span><span
                                class="ompany">KG</span>
                            <span class="number">{{Number(modelData.ybvolume||0).toFixed(3)}}</span><span
                                class="ompany">CBM</span>
                        </div>
                        <div class="infoitem-explain">预报总件/重/体</div>
                    </div>
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span class="number">{{modelData.jfWeight||modelData.jfweight}}</span><span
                                class="ompany">KG</span></span>
                        </div>
                        <div class="infoitem-explain">预报计费重量</div>
                    </div>
                    <div class="infoitem">
                        <!-- <div class="infoitem-content">
                            <span class="number">{{modelData.smallpiece||0}}</span><span
                                class="ompany">PCS</span></span>
                        </div>
                        <div class="infoitem-explain">小件数</div> -->
                    </div>
                    <div style="width:1px;height:100%;background-color: #F2F5F866;">

                    </div>
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span
                                class="number">{{modelData.inwageallinprice?moneyFormat(Number(modelData.inwageallinprice)):'--'}}</span><span
                                class="ompany">CNY/KG</span>
                        </div>
                        <div class="infoitem-explain">运费单价</div>
                    </div>
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span class="ompany">唯凯</span><span
                                class="number">{{(cpShow&&modelData.inwageallinprice)?modelData.self_real_bp_freight_in:'--'}}</span>
                            <span class="ompany">客户</span><span
                                class="number">{{(cpShow&&modelData.inwageallinprice)?modelData.cus_real_bp_freight_in:'--'}}</span>
                        </div>
                        <div class="infoitem-explain">分泡比例</div>
                    </div>
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span
                                class="number">{{modelData.inwageallinprice&&modelData.inwageallinprice_trans||"--"}}</span><span
                                class="ompany">CNY/KG</span>
                        </div>
                        <div class="infoitem-explain">中转费单价</div>
                    </div>
                    <div class="infoitem">
                        <div class="infoitem-content">
                            <span class="number"
                                style="font-size: 32px;">{{modelData.inwageallinprice?(moneyFormat(Number(modelData.jfWeight||modelData.jfweight)*(Number(modelData.inwageallinprice)+Number(modelData.inwageallinprice_trans)),2)):'--'}}</span><span
                                class="ompany">CNY</span>
                        </div>
                        <div class="infoitem-explain">预计运费总价</div>
                    </div>


                </div>

                <!-- <p style="margin-top:32px;color:#FFFFFF99;font-size:14px;" v-if="effect">
                    <span style="margin-right:40px;">销售人&nbsp;<span
                            style="color:#fff">{{modelData.axprel.jobname}}</span></span>
                    <span style="margin-right:40px;">销售人联系方式&nbsp;<span
                            style="color:#fff">{{modelData.axprel.mobile}}</span></span>
                    <span>销售人邮箱&nbsp;<span style="color:#fff">{{modelData.axprel.email}}</span></span>
                </p> -->

            </div>

            <div class="back" v-if="effect=='3'">

                <div class="accountNameItemsContent" style="margin-top: 12px;">
                    <div class="delbillman-wrap">
                        <ul class="delbillmanList">
                            <li v-for="(i,index) in JSON.parse(modelData.outsiderejectreason||'[]')"
                                :class="{'active':itemsActive==index}" @click="itemsActive=index">
                                <p>{{i.title}}</p>
                                <p class="time">
                                    <span class="left">{{i.adddate.substring(0,10)}}</span>
                                    <span class="right">{{i.addman}}</span>
                                </p>
                            </li>
                            <!--                     <li @click="itemsActive=0"
                     :class="{'active': itemsActive == 0}"
                    >
                     <p>订单驳回<span style="float:right">上海</span></p> 
                      <p class="time">
                        <span class="left">2020.11.09</span>
                        <span class="right">张三</span>
                      </p>
                    </li>
                    <li @click="itemsActive=1"
                     :class="{'active': itemsActive == 1}"
                    >
                     <p>订单驳回2<span style="float:right">上海</span></p>    
                      <p class="time">
                        <span class="left">2020.11.10</span>
                        <span class="right">张三2</span>
                      </p>
                    </li> -->
                        </ul>
                    </div>
                </div>

                <div class="reason" v-if="modelData.outsiderejectreason">
                    <span style="color:#7A8189;font-size:13px">驳回原因：</span>
                    {{JSON.parse(modelData.outsiderejectreason)[itemsActive]['reason']}}
                </div>

            </div>

            <div class="panel">
                <div class="panelTitle">订舱信息</div>
                <div class="panelContent">
                    <div>
                        <span class="spanTitle">预报件数:</span>
                        <span class="spanContent">{{modelData.ybpiece||'--'}}PCS</span>
                    </div>
                    <div>
                        <span class="spanTitle">预报重量:</span>
                        <span class="spanContent">{{modelData.ybweight||'--'}}KG</span>
                    </div>
                    <div>
                        <span class="spanTitle">预报体积:</span>
                        <span class="spanContent">{{modelData.ybvolume||'--'}}CBM</span>
                    </div>
                    <div></div>
                    <div>
                        <span class="spanTitle">始发港:</span>
                        <span class="spanContent">{{modelData.sfg}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">到达港:</span>
                        <span class="spanContent">{{modelData.mdg}}</span>
                    </div>
                    <div></div>

                    <div></div>

                    <div>
                        <span class="spanTitle">货好日期:</span>
                        <span class="spanContent">{{modelData.deliverydate | formatDate('yyyy-MM-dd')}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">指定航班日期:</span>
                        <span class="spanContent">{{modelData.hbrq | formatDate('yyyy-MM-dd')}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">指定航班号:</span>
                        <span class="spanContent">{{modelData.hbh||'--'}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">指定到达日期:</span>
                        <span class="spanContent">{{modelData.ddrq | formatDate('yyyy-MM-dd')}}</span>
                    </div>

                    <div>
                        <span class="spanTitle">货物性质:</span>
                        <span class="spanContent">{{modelData.hwxz||'--'}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">货物类型:</span>
                        <span class="spanContent">{{modelData.hwlx||'--'}}</span>
                    </div>
                </div>
            </div>


            <div class="panel" v-show="modelData.isimperfect!=2">
                <div class="panelTitle">货物信息</div>
                <div class="panelContent">
                    <template v-for="item in modelData.ybstoreList" v-if="item.khjcno">
                        <div>
                            <span class="spanTitle">进仓编号:</span>
                            <span class="spanContent">{{item.khjcno||'--'}}</span>
                        </div>
                        <div>
                            <span class="spanTitle">件数:</span>
                            <span class="spanContent">{{item.piece||'--'}}PCS</span>
                        </div>
                        <div>
                            <span class="spanTitle">重量:</span>
                            <span class="spanContent">{{item.weight||'--'}}KG</span>
                        </div>
                        <div>
                            <span class="spanTitle">体积:</span>
                            <span class="spanContent">{{item.volume||'--'}}CBM</span>
                        </div>

                        <div>
                            <span class="spanTitle">是否超规:</span>
                            <span class="spanContent">{{item.isstorelimit==1?'是':'否'}}</span>
                        </div>

                        <div>
                            <span class="spanTitle">所属分运单:</span>
                            <span class="spanContent">{{item.hawb||'--'}}</span>
                        </div>

                        <div>
                            <span class="spanTitle">入库类型:</span>
                            <span class="spanContent">{{item.storeType||'--'}}</span>
                        </div>

                        <div>
                            <span class="spanTitle">入库仓库:</span>
                            <span class="spanContent">{{item.storename_yb||'--'}}</span>
                        </div>
                        <div style="grid-column: span 4;border-top:1px dotted #DADEE3"></div>
                    </template>
                    <div style="grid-column: span 4;">
                        <span class="spanTitle">尺寸备注:</span>
                        <span class="spanContent">{{modelData.ybvolumeremark||'--'}}</span>
                    </div>

                </div>
            </div>

            <div class="panel" v-show="modelData.isimperfect!=2">
                <div class="panelTitle">总单收发货人信息</div>
                <div class="panelContent">
                    <div style="display: grid;grid-template-columns: repeat(2,1fr);grid-column:span 4">
                        <div style="display: flex;">
                            <span class="spanTitle">发货人信息:</span>
                            <span class="spanContent" v-html="getSFinfo(1)" style="padding-top:2px"></span>
                            <!-- <el-input :value="getSFinfo(1)" type="textarea" placeholder=""></el-input> -->
                            <!-- <el-input type="textarea" rows="3" v-html="getSFinfo(1)"></el-input> -->
                        </div>
                        <div style="display: flex;">
                            <span class="spanTitle">收货人信息:</span>
                            <span class="spanContent" v-html="getSFinfo(2)" style="padding-top:2px"></span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- <div class="panel">
                <div class="panelTitle">货物明细</div>
                <div class="panelContent" >
                    <template v-for="(item,index) in hawbinfoList.filter(i=>i.hawb)" v-if="modelData.orderdom=='总单'">
                        <div style="display: grid;grid-template-columns: repeat(4,1fr);row-gap: 12px;" :key="index">
                            <div>
                                <span class="spanTitle">预报件数:</span>
                                <span class="spanContent">{{item.ybpiece}} PCS</span>
                            </div>
                            <div>
                                <span class="spanTitle">预报重量:</span>
                                <span class="spanContent">{{item.ybweight}} KG</span>
                            </div>
                            <div>
                                <span class="spanTitle">预报体积:</span>
                                <span class="spanContent">{{item.ybvolume}} CBM</span>
                            </div>
                            <div>
                                <span class="spanTitle">小件数:</span>
                                <span class="spanContent">{{item.smallpiece}} PCS</span>
                            </div>
                            <template v-if="!effect">
                                <template v-for="ybstoreList in item.ybstoreList">
                                    <template v-for="store in ybstoreList.ybstorevolumeList">
                                        <div>
                                            <span class="spanTitle">包装类型:</span>
                                            <span class="spanContent">{{store.packagetypename}} PCS</span>
                                        </div>
                                        <div>
                                            <span class="spanTitle">尺寸件数:</span>
                                            <span class="spanContent">{{store.piece}} PCS</span>
                                        </div>
                                        <div>
                                            <span class="spanTitle">长/宽/高:</span>
                                            <span class="spanContent">{{store.longs}}CM X {{store.widths}}CM X
                                                {{store.heights}}CM</span>
                                        </div>
                                    </template>
                                </template>
                            </template>


                            <template v-else>
                                <template v-for="ybstoreList in item.ybstoreList">
                                    <template v-for="store in ybstoreList.storevolumeList">
                                        <div>
                                            <span class="spanTitle">包装类型:</span>
                                            <span class="spanContent">{{store.packagetypename}} PCS</span>
                                        </div>
                                        <div>
                                            <span class="spanTitle">尺寸件数:</span>
                                            <span class="spanContent">{{store.piece}} PCS</span>
                                        </div>
                                        <div>
                                            <span class="spanTitle">长/宽/高:</span>
                                            <span class="spanContent">{{store.longs}}CM X {{store.widths}}CM X
                                                {{store.heights}}CM</span>
                                        </div>
                                    </template>
                                </template>
                            </template>

                            <div style="grid-column: 1">
                                <span class="spanTitle">货物性质:</span>
                                <span class="spanContent">{{item.hwxz}}</span>
                            </div>
                            <div>
                                <span class="spanTitle">货物类型:</span>
                                <span class="spanContent">{{item.hwlx}}</span>
                            </div>
                            <div style="display: flex;grid-column: 1/5;">
                                <span class="spanTitle">英文品名:</span>
                                <span class="spanContent">{{item.englishpm}}</span>
                            </div>
                            <div style="display: flex;grid-column: 1/span 2;">
                                <span class="spanTitle">起始地信息:</span>
                                <span class="spanContent" v-html="getSFinfo(3,index)" style="padding-top:2px"></span>
                            </div>
                            <div style="display: flex;grid-column: 3/span 2;">
                                <span class="spanTitle">目的地信息:</span>
                                <span class="spanContent" v-html="getSFinfo(4,index)" style="padding-top:2px"></span>
                            </div>
                        </div>
                        <div class="division" v-show="index!=hawbinfoList.length-1"></div>
                    </template>

                    <div style="display: grid;grid-template-columns: repeat(4,1fr);row-gap: 12px;"
                        v-if="modelData.orderdom=='直单'">
                        <div>
                            <span class="spanTitle">预报件数:</span>
                            <span class="spanContent">{{modelData.ybpiece}} PCS</span>
                        </div>
                        <div>
                            <span class="spanTitle">预报重量:</span>
                            <span class="spanContent">{{modelData.ybweight}} KG</span>
                        </div>
                        <div>
                            <span class="spanTitle">预报体积:</span>
                            <span class="spanContent">{{modelData.ybvolume}} CBM</span>
                        </div>
                        <div>
                            <span class="spanTitle">小件数:</span>
                            <span class="spanContent">{{modelData.smallpiece}} PCS</span>
                        </div>
                        <template v-for="ybstoreList in modelData.ybstoreList">
                            <template v-for="store in ybstoreList.ybstorevolumeList">
                                <div>
                                    <span class="spanTitle">包装类型:</span>
                                    <span class="spanContent">{{store.packagetypename}} PCS</span>
                                </div>
                                <div>
                                    <span class="spanTitle">尺寸件数:</span>
                                    <span class="spanContent">{{store.piece}} PCS</span>
                                </div>
                                <div>
                                    <span class="spanTitle">长/宽/高:</span>
                                    <span class="spanContent">{{store.longs}}CM X {{store.widths}}CM X
                                        {{store.heights}}CM</span>
                                </div>
                            </template>
                        </template>
                    </div>

                </div>
            </div> -->

            <!-- <div class="panel">
                <div class="panelTitle">航班要求信息</div>
                <div class="panelContent" >
                    <div style="display: grid;grid-template-columns: repeat(4,1fr);">
                        <div>
                            <span class="spanTitle">要求达到日期:</span>
                            <span class="spanContent">{{modelData.ddrq | formatDate('yyyy-MM-dd')}}</span>
                        </div>
                        <div>
                            <span class="spanTitle">要求航空公司:</span>
                            <span class="spanContent">{{hkname||modelData.hkname||'--'}}</span>
                        </div>
                        <div>
                            <span class="spanTitle">要求航班种类:</span>
                            <span class="spanContent">{{modelData.ishbzl==2?'全部':modelData.hbzl}}</span>
                        </div>
                        <div>
                            <span class="spanTitle">要求中转港:</span>
                            <span class="spanContent">{{modelData.zzg||'--'}}</span>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- <div class="panel">
                <div class="panelTitle">目的港代理</div>
                <div class="panelContent">

                    <div>
                        <span class="spanTitle">总运单号:</span>
                        <span class="spanContent">{{modelData.mawb||"--"}}</span>
                    </div>

                    <div>
                        <span class="spanTitle">要求航班日期:</span>
                        <span class="spanContent">{{modelData.hbrq.substring(0,10)||'--'}}</span>
                    </div>

                    <div>
                        <span class="spanTitle">起始地:</span>
                        <span class="spanContent">{{modelData.qsd||"--"}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">始发港:</span>
                        <span class="spanContent">{{modelData.sfg||"--"}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">到达港:</span>
                        <span class="spanContent">{{modelData.mdg||"--"}}</span>
                    </div>
                    <div>
                        <span class="spanTitle">目的地:</span>
                        <span class="spanContent">{{modelData.mdd||'--'}}</span>
                    </div>
                    <div style="display: grid;grid-template-columns: repeat(2,1fr);">
                        <div style="display: flex;">
                            <span class="spanTitle">发货人信息:</span>
                            <span class="spanContent" v-html="getSFinfo(1)" style="padding-top:2px"></span>
                        </div>
                        <div style="display: flex;">
                            <span class="spanTitle">收货人信息:</span>
                            <span class="spanContent" v-html="getSFinfo(2)" style="padding-top:2px"></span>
                        </div>
                    </div>
                </div>

            </div> -->

            <div class="panel" v-show="modelData.isimperfect!=2">
                <div class="panelTitle">配套服务信息</div>
                <div class="panelContent">
                    <div style='grid-column:span 4'>
                        <common-table :head="servicehead" :table-data="serviceTable" div-style="max-height: 1999px;">
                        </common-table>
                    </div>
                </div>
            </div>

            <div class="foot-div" style="text-align:center;" v-if="effect">
                <el-button class="foot-btn" @click="back">返回</el-button>
            </div>

            <!-- 驳回弹框 -->
            <el-dialog :visible.sync="showBackDialog" :close-on-click-modal="false" v-if="showBackDialog" width="818px"
                append-to-body top="180px" center title="报价驳回" :show-close="false" custom-class="showBackModel">

                <ul style="color:#7A8189">
                    <li>订舱编号</li>
                    <li>总运单号</li>
                    <li>始发港/目的港</li>
                    <li>航班号</li>
                    <li>要求航班日期</li>
                    <li>预报件重体</li>
                </ul>
                <ul style="margin-top:5px;padding-bottom:16px;border-bottom:1px solid #BFC5CE;color:#222933">
                    <li>{{modelData.pono}}</li>
                    <li>{{modelData.mawb}}</li>
                    <li>{{modelData.sfg}}/{{modelData.mdg}}</li>
                    <li>{{modelData.hbh}}</li>
                    <li>{{modelData.hbrq.substring(0,10)}}</li>
                    <li>{{modelData.ybpiece}}/{{modelData.ybweight}}/{{modelData.ybvolume}}</li>
                </ul>
                <div class="inputCost">
                    <p class="title">报价人</p>
                    <div class="costContainer">
                        <div>
                            <p class="origin">姓名</p>
                            <div>
                                {{modelData.axprel.filter(i=>i.lxrtitle=='受理人').length&&modelData.axprel.filter(i=>i.lxrtitle=='受理人')[0].jobname||'--'}}
                            </div>

                        </div>
                        <div>
                            <p class="origin">直线</p>
                            <div>
                                {{modelData.axprel.filter(i=>i.lxrtitle=='受理人').length&&modelData.axprel.filter(i=>i.lxrtitle=='受理人')[0].phone||'--'}}
                            </div>

                        </div>
                        <div style="width:330px">
                            <p class="origin">邮箱</p>
                            <div>
                                {{modelData.axprel.filter(i=>i.lxrtitle=='受理人').length&&modelData.axprel.filter(i=>i.lxrtitle=='受理人')[0].email||'--'}}
                            </div>

                        </div>
                    </div>

                </div>
                <div class="inputCost" v-if="modelData.czlx=='自货'"
                    :style="{'width':!cpShow?'40%':'','display':!cpShow?'inline-block':''}">
                    <p class="title">空运费</p>
                    <div class="costContainer">
                        <div>
                            <p class="origin">唯凯报价</p>
                            <div class="disable" style="width:56px;">{{modelData.inwageallinprice}}</div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div>
                            <p class="now">客户报价</p>
                            <div class="input-required">
                                <el-input placeholder="请输入" v-model="backModel.inwageallinprice"></el-input>
                            </div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div v-if="cpShow">
                            <p class="origin">唯凯要求分泡</p>
                            <div>
                                <div class="disable" style="width:40px;display:inline-block;margin-right:8px">
                                    {{modelData.self_real_bp_freight_in}}</div>
                                <div class="disable" style="width:40px;display:inline-block">
                                    {{modelData.cus_real_bp_freight_in}}</div>
                            </div>
                            <p class='bottom'>
                                <span>唯凯</span>
                                <span style="margin-left:24px;">客户</span>
                            </p>
                        </div>
                        <div v-if="cpShow">
                            <p class="origin">客户要求分泡</p>
                            <div class="input-required">
                                <div style="display:inline-block;margin-right:8px">
                                    <el-input placeholder="请输入" v-model="backModel.self_real_bp_freight_in"
                                        @change="fpChange($event,'self_real_bp_freight_in','cus_real_bp_freight_in')">
                                    </el-input>
                                </div>
                                <div style="display:inline-block">
                                    <el-input placeholder="请输入" v-model="backModel.cus_real_bp_freight_in"
                                        @change="fpChange($event,'cus_real_bp_freight_in','self_real_bp_freight_in')">
                                    </el-input>
                                </div>
                            </div>
                            <p class='bottom'>
                                <span>唯凯</span>
                                <span style="margin-left:70px;">客户</span>
                            </p>
                        </div>
                    </div>
                </div>


                <div class="inputCost" :style="{'width':!cpShow?'40%':'','display':!cpShow?'inline-block':''}">
                    <p class="title">中转费</p>
                    <div class="costContainer">
                        <div>
                            <p class="origin">唯凯报价</p>
                            <div class="disable" style="width:56px;">{{modelData.inwageallinprice_trans}}</div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div>
                            <p class="now">客户报价</p>
                            <div :class="modelData.czlx=='自货'&&modelData.hbzl=='中转'?'input-required':''">
                                <el-input placeholder="请输入" v-model="backModel.inwageallinprice_trans"></el-input>
                            </div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div v-if="cpShow">
                            <p class="origin">唯凯要求分泡</p>
                            <div>
                                <div class="disable" style="width:40px;display:inline-block;margin-right:8px">
                                    {{modelData.self_real_bp_trans_in}}</div>
                                <div class="disable" style="width:40px;display:inline-block">
                                    {{modelData.cus_real_bp_trans_in}}</div>
                            </div>
                            <p class='bottom'>
                                <span>唯凯</span>
                                <span style="margin-left:24px;">客户</span>
                            </p>
                        </div>
                        <div v-if="cpShow">
                            <p class="origin">客户要求分泡</p>
                            <div :class="modelData.czlx=='自货'&&modelData.hbzl=='中转'?'input-required':''">
                                <div style="display:inline-block;margin-right:8px">
                                    <el-input placeholder="请输入" v-model="backModel.self_real_bp_trans_in"
                                        @change="fpChange($event,'self_real_bp_trans_in','cus_real_bp_trans_in')">
                                    </el-input>
                                </div>
                                <div style="display:inline-block">
                                    <el-input placeholder="请输入" v-model="backModel.cus_real_bp_trans_in"
                                        @change="fpChange($event,'cus_real_bp_trans_in','self_real_bp_trans_in')">
                                    </el-input>
                                </div>
                            </div>
                            <p class='bottom'>
                                <span>唯凯</span>
                                <span style="margin-left:70px;">客户</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="inputBack">
                    <p class="title">驳回原因</p>
                    <el-input type="textarea" :rows="4" placeholder="请输入内容" class="input-required"
                        v-model="backModel.rejectreason"></el-input>
                </div>

                <div class="inputButton">
                    <button class="confirm" @click="backConfirm">确认驳回</button>
                    <button class="close" @click="showBackDialog=false">关闭</button>
                </div>



            </el-dialog>

        </div>

        <!-- <outMawbAdd :pagetype="2" :mawbdetail="modelData" v-if="mawbput" @success="putSuccess"
            :boguid="modelData.boguid">
        </outMawbAdd> -->

        <newOrderAdd :pagetype="2" :mawbdetail="modelData" v-if="mawbput" @success="putSuccess"
            :boguid="modelData.boguid">
        </newOrderAdd>

    </div>
</template>

<script>
    // import { formatDate } from "../../api/tools.js";
    import { JudgeBubblesFunc, formatDate, moneyFormat } from "@/api/localStorage.js"
    // import outMawbAdd from '@/outsideDom/outMawbAdd'


    export default {
        name: 'goodsInfo',
        props: {
            pagetype: {
                type: String | Number,
                default: 1
            },
            modelData: {
                type: Object,
                default: () => { }
            },
            hawbinfoList: {
                type: Array,
                default: () => []
            },
            serviceList: {
                type: Array,
                default: () => []
            },
            effect: {//区分详细页面和新增页面  1唯凯受理中  2报价待确认  3订单被驳回 4外网新增页面
                type: String,
            }
        },
        components: {
            // outMawbAdd
        },
        data() {
            return {
                name: "goodsInfo.vue",
                hkname: '',//要求航空公司
                servicehead: [
                    { title: '服务类别', field: 'port', translate: 'servicePort' },
                    { title: '服务名称', field: 'title', translate: 'serviceTitle' },
                    { title: '服务要求', field: 'oprequest', translate: 'serviceOprequest' },
                    { title: '其他信息', field: 'otherinfo', translate: 'serviceOtherinfo' }
                ],
                nodeList: [],//节点列表
                showBackDialog: false,//驳回弹框
                backModel: { title: '报价驳回', inwageallinprice: '', self_real_bp_freight_in: '', cus_real_bp_freight_in: '', inwageallinprice_trans: '', self_real_bp_trans_in: '', cus_real_bp_trans_in: '', rejectreason: '' },
                itemsActive: 0,
                mawbput: false,
                cpShow: false,//显示吃泡
            }
        },
        methods: {
            moneyFormat,
            openDialog() {
                this.mawbput = true
            },
            //收发货人
            getSFinfo(type, index) {//1总单发货人信息 2总单收货人信息  3分单发货人信息 4分单收货人信息
                let json = this.modelData;
                let str = '';

                if (type == 1) {
                    str = json.companytitle_fhr_mawb + "<br>" + json.address_fhr_mawb;
                }
                if (type == 2) {
                    str = json.companytitle_shr_mawb + "<br>" + json.address_shr_mawb;
                }
                if (this.hawbinfoList.length) {
                    if (type == 3) {
                        str = this.hawbinfoList[index].companytitle_fhr_hawb + "<br>" + this.hawbinfoList[index].address_fhr_hawb;
                    }

                    if (type == 4) {
                        str = this.hawbinfoList[index].companytitle_shr_hawb + "<br>" + this.hawbinfoList[index].address_shr_hawb;
                    }
                }

                return str.replace(/\n/g, '<br>')

            },
            //撤单
            showBack() {
                this.$prompt('请输入撤单理由', '撤单', {
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'textarea',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '请填写撤单理由'
                })
                    .then((value) => {

                        this.$axios({ method: "put", url: this.$store.state.webApi + "api/ExHpoAxplineOutsideCancel", data: { boguid: this.modelData.boguid, routedelreason: value.value }, loading: true, tip: false })
                            .then(results => {
                                if (results.data.resultstatus == 0) {
                                    this.$message.success(results.data.resultmessage)
                                } else {
                                    this.$message.error(results.data.resultmessage)
                                }
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消操作'
                        });
                    })
            },
            //分泡
            fpChange(data, field1, field2) {
                var reg = /^([0-9]+([.]{1}[0-9]{0,1})?)$/;
                if (data) {
                    if (!reg.test(Number(data)) || Number(data) > 10) {
                        this.$message.error("请输入1-10的小数");
                        this.backModel[field1] = ''
                        return false;
                    } else {
                        this.backModel[field1] = Number(data)
                        this.backModel[field2] = Number(10 - Number(data));

                        if (String(this.backModel[field1]).indexOf(".") != "-1") {
                            this.backModel[field1] = Number(this.backModel[field1]).toFixed(
                                1
                            );
                        }
                    }
                }
            },
            //infoPanel背景
            effectStyle() {
                if (this.effect == '3') {
                    return { background: "transparent linear-gradient(93deg, #E57D00 0%, #F4B949 100%) 0% 0% no-repeat padding-box" }
                } else {
                    return { background: "transparent linear-gradient(92deg, #275676 0%, #2D75A7 100%) 0% 0% no-repeat padding-box" }
                }
            },
            //驳回报价
            backConfirm() {

                if (this.modelData.czlx == '自货' && this.modelData.hbzl == '中转') {
                    if (!this.cpShow) {
                        this.backModel.self_real_bp_freight_in = this.modelData.self_real_bp_freight_in
                        this.backModel.cus_real_bp_freight_in = this.modelData.cus_real_bp_freight_in
                        this.backModel.self_real_bp_trans_in = this.modelData.self_real_bp_trans_in
                        this.backModel.cus_real_bp_trans_in = this.modelData.cus_real_bp_trans_in
                    }
                    if (Object.values(this.backModel).indexOf('') != '-1') {
                        return this.$message.error('请填写完整运价信息')
                    }
                } else {
                    if (this.modelData.czlx != '代操作') {
                        if (!this.cpShow) {
                            this.backModel.self_real_bp_freight_in = this.modelData.self_real_bp_freight_in
                            this.backModel.cus_real_bp_freight_in = this.modelData.cus_real_bp_freight_in
                        }
                        if (!this.backModel.inwageallinprice || !String(this.backModel.self_real_bp_freight_in) || !String(this.backModel.cus_real_bp_freight_in) || !this.backModel.rejectreason) {
                            return this.$message.error('请填写完整运价信息')
                        }
                    }
                }

                let data = { ...this.backModel }
                data.boguid = this.modelData.boguid
                //data.addman = sessionStorage.out_uname
                // data.adddate = formatDate(new Date(), "yyyy-mm-dd")
                // data.oldprice = this.modelData.inwageallinprice || 666666
                // data.oldzzprice = this.modelData.inwageallinprice_trans || 666666
                // data.oldwkcp = this.modelData.self_real_bp_freight_in
                // data.oldkhcp = this.modelData.cus_real_bp_freight_in
                // data.oldzzwkcp = this.modelData.self_real_bp_trans_in
                // data.oldzzkhcp = this.modelData.cus_real_bp_trans_in
                //this.modelData.outsiderejectreason = [].concat(data)

                //let outsiderejectreason = JSON.stringify(this.modelData.outsiderejectreason)
                this.$axios({
                    method: "put", url: this.$store.state.webApi + "api/ExHpoAxplineOutsideReject", data: data, loading: true, tip: false
                })
                    .then(results => {
                        if (results.data.resultstatus == 0) {
                            this.back()
                            this.$message.success(results.data.resultmessage)
                        } else {
                            this.$message.error(results.data.resultmessage)
                        }
                        this.backModel = { title: '报价驳回', inwageallinprice: '', self_real_bp_freight_in: '', cus_real_bp_freight_in: '', inwageallinprice_trans: '', self_real_bp_trans_in: '', cus_real_bp_trans_in: '', rejectreason: '' }
                    })
                    .catch(error => {
                    })
            },
            //确认报价
            confirmPrice() {

                this.$confirm('是否继续操作?', '提示', {
                    closeOnClickModal: false,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                })
                    .then(() => {
                        this.$axios({ method: "put", url: this.$store.state.webApi + "api/ExHpoAxplineOutsideSure", data: { boguid: this.modelData.boguid }, loading: true, tip: false })
                            .then(results => {
                                if (results.data.resultstatus == 0) {
                                    this.$message.success(results.data.resultmessage)
                                } else {
                                    this.$message.error(results.data.resultmessage)
                                }
                            })
                            .catch(error => {

                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消操作'
                        });
                    })

            },
            back() {
                this.$emit('update:visible', false)
            }, putSuccess(val) {
                if (val == 1) {
                    this.mawbput = false;
                } else {
                    this.$store.state.showloading = true
                    setTimeout(() => {
                        this.mawbput = false;
                        this.$emit('success', true)
                    }, 8000);
                }
            }
        },
        computed: {
            serviceTable() {
                let list = this.serviceList && this.serviceList.filter(i => i.isdel == 1) || [];
                list = JSON.parse(JSON.stringify(list))
                // console.log(list)
                let servicetype = {};
                let info = this.modelData.ysservice || {};
                let servicegroup = JSON.parse(localStorage.serviceDataGroup).map(i => i.serviceBasicList).flat()
                list.forEach(i => {
                    let item = servicegroup.filter(e => e.servicecode == i.servicecode)[0]
                    i.port = item.port;
                    i.title = item.servicename;
                    if (i.yqfinishdate) {
                        i.oprequest = `${i.oprequest}${i.oprequest ? '<br>' : ''}要求完成日期：${formatDate(i.yqfinishdate, 'yyyy-MM-dd')}`
                    }
                    if (i.servicecode == 'AA0410') {
                        i.otherinfo = `要求进仓仓库：${info.store_thr}<br>要求进仓日期：${formatDate(info.yqfinishdate_org, 'yyyy-MM-dd')}`
                    }
                    if (i.servicecode == 'AA0510') {
                        i.otherinfo = `提货地址：${info.address_thr_org}<br>联系人：${info.lxr_thr_org}<br>联系方式：${info.phone_thr_org}<br>要求提货完成日期：${formatDate(info.pickupdate_org, 'yyyy-MM-dd')}`
                    }

                    i.rowspanfield = "port";
                    i.tdHidden = false;

                    if (!servicetype[i.port]) {
                        servicetype[i.port] = [i]
                    } else {
                        let e = { ...i }
                        e.tdHidden = true
                        servicetype[i.port].push(e)
                        servicetype[i.port][0].rowspan = servicetype[i.port].length
                    }
                })
                return Object.values(servicetype).flat()
            }
        },
        watch: {
            modelData: {
                handler(data) {

                },
                deep: true,
                immediate: true
            }
        },
        mounted() {

            if (this.effect && this.effect != '3') {
                this.nodeList = []
                if (this.modelData.customprice == '1' && this.modelData.outsidedom == 'OUTSIDE') {
                    this.nodeList.push({ nodename: '订舱成功', type: '', status: [1] }, { nodename: '唯凯报价', type: '', status: [70] }, { nodename: '客户确认报价', type: '', status: [150] }, { nodename: '唯凯操作中', type: '', status: [150, 200, 400] }, { nodename: '唯凯操作完成', type: '', status: [600] })
                } else {
                    this.nodeList.push({ nodename: '订舱成功', type: '', status: [1] }, { nodename: '唯凯确认报价', type: '', status: [150, 200, 400] }, { nodename: '唯凯操作中', type: '', status: [150, 200, 400] }, { nodename: '唯凯操作完成', type: '', status: [600] })
                }
                this.nodeList.forEach((i, index) => {
                    if (Math.max(i.status) <= this.modelData.status || i.status.indexOf(this.modelData.status) != '-1') {
                        i.type = 'success'
                    } else {

                        i.type = 'unsuccess'
                    }
                })


            }


        },
        created() {

            //console.log(JudgeBubblesFunc(Number(this.modelData.ybweight),Number(this.modelData.ybvolume)))
            // this.$watch(
            //     () => {
            //         return this.modelData.hbh
            //     },
            //     (hbh) => {
            //         if (hbh) {
            //             this.$axios({
            //                 method: "get",
            //                 url: this.$store.state.publicWebApi + "api/PubAirCompany",
            //                 params: { area: "", twoCode: hbh },
            //                 loading: false,
            //                 tip: false
            //             }).then(results => {
            //                 this.hkname = results.data[0].cName
            //             });
            //         }
            //     }, { immediate: true }
            // )
            this.$watch(
                () => {
                    return this.modelData.ybweight + this.modelData.ybvolume
                },
                (value) => {
                    // console.log(value)
                    // console.log(JudgeBubblesFunc(this.modelData.ybweight, this.modelData.ybvolume))

                    if (JudgeBubblesFunc(this.modelData.ybweight, this.modelData.ybvolume) < 0) {
                        this.cpShow = true
                    } else {
                        this.cpShow = false
                    }

                }, {
                immediate: true,
                deep: true
            }
            )
        }

    }
</script>

<style lang="less" scoped>
    @import '../smallTemplate/small.less';

    .panel {
        .panelContent {
            border: none;
            border-top: 1px dotted #DADEE3;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            row-gap: 16px;
            font-size: 14px;
            ;
        }
    }




    .button {
        width: 100px;
        height: 48px;
        background: rgba(255, 255, 255, .1);
        //background: #FFFFFF3D 0% 0% no-repeat padding-box;
        opacity: 1;
        border-radius: 24px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;

        /* &:hover {
            background: #fff;
            color: #006AFF;
        } */
    }

    .buttonHover1 {
        &:hover {
            background: #fff;
            color: #006AFF;
        }
    }

    .buttonHover2 {
        &:hover {
            background: #fff;
            color: #FF8B00;
        }
    }

    //节点
    .node {
        width: 1120px;
        text-align: center;
        margin-bottom: 40px;

        ul li {
            list-style: none;
            display: inline-block;
            position: relative;
            margin-left: 118px;
            vertical-align: bottom;
            cursor: pointer;

            .iconText {
                width: 48px;
                text-align: center;
                height: 64px;
            }

            &:first-child {
                margin-left: 0
            }

            &:last-child {
                .line {
                    display: none;
                }
            }
        }

        .success {
            color: #14A207;
        }

        .gray {
            color: #6D7D95;
        }

        .white {
            color: #DADEE3;
        }

        .line {
            position: absolute;
            left: 60px;
            width: 86px;
            height: 2px;
            top: 24px;
        }

        .lineSuccess {
            background: #14A207;
        }

        .linegray {
            background: transparent linear-gradient(270deg, #6D7D95 0%, #14A207 100%) 0% 0% no-repeat padding-box;
        }

        .linewhite {
            background: #DADEE3;
        }
    }

    //驳回弹框
    /deep/.showBackModel {
        border-radius: 8px;

        .el-dialog__header {
            padding: 40px;
            padding-bottom: 24px;
            font-weight: bold;
            font-size: 18px;
        }

        .el-dialog__body {
            padding-top: 0
        }

        ul li {
            display: inline-block;
            width: 124px;
            text-align: left;
        }

        .inputCost {
            margin-top: 24px;

            .title {
                font-size: 12px;
                color: #222933;
                font-weight: bold;
            }

            .costContainer {
                display: grid;
                grid-template-columns: 100px 170px 130px 200px;
                grid-template-rows: auto;
                justify-items: start;
                margin-top: 8px;

                .origin {
                    color: #7A8189;
                    margin-bottom: 4px;
                }

                .now {
                    color: #222933;
                    margin-bottom: 4px;
                }

                .bottom {
                    color: #BFC5CE;
                    margin-top: 4px;
                }

                .disable {
                    text-align: center;
                    background: #DADEE3;
                    color: #7A8189;
                    border-radius: 4px;
                    height: 32px;
                    line-height: 32px;
                }

                /deep/.el-input {
                    width: 88px;
                    height: 32px;
                    border-radius: 4px;

                    .el-input__inner {
                        height: 32px;
                    }
                }
            }
        }

        .inputBack {
            margin-top: 24px;

            .title {
                font-size: 12px;
                color: #222933;
                font-weight: bold;
                margin-bottom: 4px;
            }
        }

        .inputButton {
            text-align: center;
            margin-top: 30px;

            .confirm {
                width: 88px;
                height: 32px;
                background: #006AFF 0% 0% no-repeat padding-box;
                box-shadow: 0px 2px 4px #006AFF66;
                border-radius: 16px;
                opacity: 1;
                color: #FFFFFF;
                text-align: center;
                line-height: 32px;
                cursor: pointer;
            }

            .close {
                width: 60px;
                height: 32px;
                margin-left: 16px;
                background: #FFFFFF 0% 0% no-repeat padding-box;
                border: 1px solid #DADEE3;
                border-radius: 16px;
                opacity: 1;
                color: #006AFF;
                text-align: center;
                line-height: 32px;
                cursor: pointer;
            }
        }
    }

    // 驳回理由
    .back {

        .delbillman-wrap {
            max-width: 1200px;
            overflow: hidden;
            display: inline-block;

            .delbillmanList {
                overflow: scroll;
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                padding-bottom: 10px;

                li {
                    position: relative;
                    border-radius: 4px;
                    font-size: 13px;
                    cursor: pointer;
                    width: 145px;
                    padding: 8px;
                    color: #4c4c4c;
                    margin-right: 16px;
                    display: inline-block;
                    background: rgba(242, 245, 248, 1);

                    p:first-child {
                        margin-bottom: 8px;
                        color: rgba(122, 129, 137, 1);
                    }

                    .time {
                        color: rgba(122, 129, 137, 1);
                        opacity: 0.6;
                    }

                    .left {
                        text-align: left;
                    }

                    .right {
                        float: right;
                        width: 50px;
                        overflow: hidden;
                        text-align: right;
                    }

                    .el-icon-caret-right {
                        position: absolute;
                        font-size: 18px;
                        right: -25px;
                        top: 15px;
                        color: #606266;
                    }

                    &.active {
                        background: rgba(0, 106, 255, 0.2) 0% 0% no-repeat padding-box;

                        p:first-child {
                            color: #006AFF;
                        }

                        .time {
                            color: rgba(0, 106, 255, 1);
                            opacity: 0.6
                        }
                    }

                    &:last-child {
                        .el-icon-caret-right {
                            display: none;
                        }
                    }
                }
            }
        }

        .reason {
            margin-top: 16px;
            height: 88px;
            overflow-y: auto;
            background: rgba(218, 222, 227, 1) 0% 0% no-repeat padding-box;
            border: 1px solid rgba(191, 197, 206, 1);
            border-radius: 4px;
            color: rgba(34, 41, 51, 1);
            padding: 6px 8px;
            font-size: 13px;
        }
    }
</style>