<template>
    <div>
        <!-- 受理页面；用于外网订单待受理，外站与本站的待受理、逾期待处理 -->
        <!-- {{modelData.outsidedom}}
    {{modelData.customprice}}
    {{opertype}} -->
        <!-- {{opertype}} -->
        <!-- {{monitor}} -->
        <!-- {{modelData}} -->
        <!-- {{pagetype}}
        111 -->
        <!-- {{tableDataRes}} -->
        <!-- {{headTable}} -->
        <!-- {{pagetitle}} -->
        <div class="page-container-box">
            <newSearchComp :name="name" :realPageName="monitor?realname:realPage?realPage:realPageName" :view-data.sync="inputViewData"
                :model-data.sync="inputModelData" :search-data.sync="searchData" :pageshow.sync='pageshow'
                :chinese-where.sync="chineseWhere" :pagetype="1" @reset="reset"></newSearchComp>
            <div class="searchForm">
                <el-button @click="search">查询</el-button>
                <!-- <el-button @click="reset">重置</el-button> -->
               <el-button type="primary" @click="orderDialogstatus = !orderDialogstatus">订单新增</el-button>
            </div>
        </div>
        <!-- {{ziTableData}} -->

        <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
        <!-- <tableCompt :name="name" :table-data-res="tableDataRes"   :chinese-where="chineseWhere"  :showTotal="showTotal" :expansionSubcolumn="'wtkhname'" :nestedTableType="2" v-on:transmitMsg="getZimessage" :ziTableData="ziTableData" showZiConfig ref="table"> -->
        <tableCompt :name="name" :table-data-res="tableDataRes" :chinese-where="chineseWhere" :showTotal="showTotal"
            :nestedTableType="2" :ziTableData="ziTableData" v-on:transmitMsg="getZimessage" showZiConfig ref="table"
            :headTable="headTable" @transSelIndex="openDialog">
            <template slot="operate" slot-scope="props">
                <span v-if="monitor !='2'"><i class="icon-save" style="color:#5cb6ff" @click="modList(props.data.row,props.data.index)"   :disabled=" monitor =='2'"></i>
                </span>

                <!-- <span :class="{spanDisabled:props.data.row.creditisbackstatus=='待通过'}"><i class="el-icon-success" style="color:#3c9;font-size:16px;" title="确认" @click="listConfirm(props.data.row,props.data.index)"></i>
            </span> -->



                <template v-if="monitor!='2'">
                    <span v-if="pagetype!=2" class="{spanDisabled:props.data.row.creditisbackstatus=='待通过'}">
                        <!-- <i v-if="props.data.row.outsidedom!=='OUTSIDE'" class="el-icon-success"
                            style="color:#3c9;font-size:16px;"
                            @click="listConfirm(props.data.row,props.data.index)"></i> -->
                        
                        <i v-if="props.data.row.outsidedom=='OUTSIDE'&&props.data.row.customprice==1"
                            class="el-icon-success" style="color:#3c9;font-size:16px;"
                            @click="sureOper(props.data.row,props.data.index,1)"></i>
                        <!-- 外网未完善 -->
                        <i v-else-if="props.data.row.outsidedom=='OUTSIDE'&&props.data.row.isimperfect==2"
                            class="el-icon-success" style="color:#3c9;font-size:16px;"
                            @click="listConfirm(props.data.row,props.data.index)"></i>

                         
                          <!-- 保存-->   
                         <i v-else
                            class="el-icon-success"
                            style="color:#3c9;font-size:16px;margin:0 6px"
                            @click="triggerSaveDialog(props.data)"
                            v-show="pagetype!=3"
                        ></i>
                        <!-- <el-popover v-else placement="right-start" trigger="hover" popper-class="mypopper">
                            <div class="pPopover">
                                <p @click="listConfirm(props.data.row,props.data.index)">本站操作<i
                                        class="el-icon-arrow-right"></i></p>
                                <p @click="sureOper(props.data.row,props.data.index,2)">外站操作<i
                                        class="el-icon-arrow-right"></i></p>
                            </div>
                            <i slot="reference" class="el-icon-success"
                                style="color:#3c9;font-size:16px;margin:0 6px"></i>
                        </el-popover> -->
                    </span>

                    <span v-if="pagetype==2||pagetype==3">
                        <i class="el-icon-success" @click="handleO('single',props.data.index)"
                            style="color:#3c9;font-size:16px;"
                            v-if="props.data.row.islocal!=1||props.data.row.isreject!=1"></i>
                    </span>
                </template>
                <!-- <span :class="{spanDisabled:props.data.row.creditisbackstatus=='待通过'}"> <i class="el-icon-error" style="color:#f00;font-size:16px;" title="撤单" @click="orderCancel=true;listBackIndex=props.data.index;orderCancelForm={rollbackreason:'',rollbacktype:'',boguid: '',sid: ''};czMark=props.data.row.pono.indexOf('-')!='-1'?'1':'2'"></i>
            </span> -->
                <template v-if="monitor!='2'">
                    <span v-if="pagetype!=2&&pagetype!=3"
                        :class="{spanDisabled:props.data.row.creditisbackstatus=='待通过'}">
                        <i class="el-icon-error" style="color:#f00;font-size:16px;"
                            @click="sureOper(props.data.row,props.data.index,3)"></i>
                    </span>
                    <!-- :class="{spanDisabled:props.data.row.area==conditionalAreaForBuild&&props.data.row.ordersystem!='国内服务'}" -->
                    <span v-if="pagetype==2 ||pagetype==3 ">
                        <i class="el-icon-error" @click="putIndex=props.data.index;cancelVisible=true"
                            style="color:#f00;font-size:16px;"></i>
                    </span>
                </template>

                <span>
                    <!-- <i class="el-icon-document" @click="airDetail(props.data.row)"></i>
                    <i class="el-icon-chicun" @click="sizeRowData(props.data.row.boguid)" title="尺寸信息"></i> -->
                    <sizeInfo :boguid="props.data.row.boguid" style="margin-left:8px;"></sizeInfo>
                </span>
                <!-- <span style="margin-left:10px">                
                    <el-badge is-dot class="item"  v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "     :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
                    <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
                    </el-badge>
                </span> -->
            </template>
            <!-- isshipace 1不禁用 2禁用 -->
            <!-- || monitor !='2' -->
            <template slot="hbh" slot-scope="props">
                <el-input v-model="props.data.row.yqhbh"
                    :disabled="props.data.row.creditisbackstatus=='待通过'||props.data.row.isshipace==2  || monitor =='2'"
                    @focus="modConfirmShow=true;modConfirmIndex=props.data.index" style="width:70px;"
                    v-verify="'uppercase'"></el-input>
                <!-- 	<i class="el-icon-check" style="color:#3c9;font-size:16px;margin-left:-2px;margin-right:0" title="确认修改" v-if="modConfirmIndex==props.data.index&&modConfirmShow&&props.data.row.yqhbh" @click="modList(props.data.row)"></i> -->
            </template>

            <template slot="hbrq" slot-scope="props">
                <el-date-picker v-model="props.data.row.yqhbrq" type="date" style="width:130px;" placeholder="选择日期时间"
                    format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                    :disabled="props.data.row.creditisbackstatus=='待通过'||props.data.row.isshipace==2 || monitor =='2'"
                    @focus="modConfirmShow2=true;modConfirmIndex2=props.data.index"
                    :picker-options="props.data.row.pickerOptions"></el-date-picker>
                <!-- <i class="el-icon-check" style="color:#3c9;font-size:16px;margin-left:-2px;margin-right:0" title="确认修改" v-if="modConfirmIndex2==props.data.index&&modConfirmShow2&&props.data.row.yqhbrq" @click="modList(props.data.row)"></i> -->
            </template>

            <template slot="mawb" slot-scope="props">

                <span :class="[props.data.row.isshipace==2?'disabled':'']">{{props.data.value}}

                    <i class="el-icon-folder-checked" style="margin-left:10px;" title="配置总运单" 
                        @click="installMawb(props.data.row)" v-if="!props.data.value"></i>

                    <i class="el-icon-folder-delete" title="解除总运单" @click="unstallMawb(props.data.row)"
                        v-if="props.data.value&&props.data.row.isshipace!=2"></i></span>

            </template>

            <template slot="wtkhname" slot-scope="props">

                <span v-if="props.data.row.iscomboine==1" style="float:left" @click="getZimessage(props.data.row)"  >
                    <i class="el-icon-plus" v-if="putIndex!=props.data.row.index"></i>
                    <i class="el-icon-minus" v-if="putIndex==props.data.row.index"></i>
                </span>
                <span>
                    <el-tooltip class="tooltipitem" effect="dark" :content="String(props.data.value)">
                        <span style="cursor:pointer">{{props.data.value}}</span>
                    </el-tooltip>
                </span>
            </template>

            <template slot="isinwageallin" slot-scope="props">
                <el-select v-model="props.data.row.isinwageallin" placeholder="请选择" style="width:100px"
                    class="input-required"
                    :disabled="(props.data.row.profitmode!='本站'||props.data.row.iscomboine==1||props.data.row.outsidedom=='OUTSIDE')||props.data.row.isshipace==2 || monitor =='2'">
                    <el-option key="单价ALLIN" label="单价ALLIN" value="1">
                    </el-option>
                    <el-option key="总价ALLIN" label="总价ALLIN" value="2">
                    </el-option>
                    <el-option key="单价++" label="单价++" value="3">
                    </el-option>
                    <el-option key="Cost+" label="Cost+" value="4">
                    </el-option>
                </el-select>
            </template>
            <template slot="freightfee_in" slot-scope="props">
                {{currencyChars[props.data.row.currencyin]}}
                <el-input v-model="props.data.row.inwageallinprice" style="width:70px;" class="input-required"
                    :disabled="(props.data.row.profitmode!='本站'||props.data.row.iscomboine==1||props.data.row.outsidedom=='OUTSIDE')||props.data.row.isshipace==2 || monitor =='2'">
                </el-input>
            </template>

            <template slot="currencyin" slot-scope="props">
                <el-select v-model="props.data.row.currencyin" placeholder="请选择" style="width:100px"
                    class="input-required"
                    :disabled="(props.data.row.profitmode!='本站'||props.data.row.iscomboine=='1'||props.data.row.outsidedom=='OUTSIDE')||props.data.row.isshipace==2 || monitor =='2'">
                    <el-option key="人民币" label="人民币" value="人民币">
                    </el-option>
                    <el-option key="美元" label="美元" value="美元">
                    </el-option>
                    <el-option key="港币" label="港币" value="港币">
                    </el-option>
                    <el-option key="日元" label="日元" value="日元">
                    </el-option>
                    <el-option key="欧元" label="欧元" value="欧元">
                    </el-option>
                    <el-option key="英镑" label="英镑" value="英镑">
                    </el-option>
                </el-select>

            </template>

            <!-- <template slot="pono" slot-scope="props">
                <span :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
                    @click="openDialog(props.data.index)">{{props.data.value}}</span>
            </template> -->

        </tableCompt>

        <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" dom=2 
            :inputModelData="tableDataRes[listBackIndex]" @success="newCancelOrderFunc" :czMark="czMark"></cancelOper>

        <!-- 配置总运单弹框 -->
        <el-dialog :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" top="4%" width="1100px" append-to-body
            title="配置总单" custom-class="mawbDialog">
            <mawbConfigNew :rowData="rowData" :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" ref="mawbConfig"></mawbConfigNew>

<!--                 <div style="position:relative;top:-16px;">
                    <strong>总运单号</strong>：
                    <span>
                        <el-input style="width:160px;" v-model="dialogMawb" placeholder="请选择总运单号" @blur="getMawbGys()">
                        </el-input>
                        <new-form-cmpt :view-data.sync="zdBasicInfoSave" :model-data.sync="objGysss"
                            style="display: inline-flex;" :pagetype="2"></new-form-cmpt>
                        <span @click="mawbConfigFunc(1)">
                            <el-button @click.stop="mawbConfigFunc(1)" size="mini">保存</el-button>
                        </span>
                        <span @click="mawbSaveBorrow=true">
                            <el-button size="mini" v-if="mawbTab!='1'" @click="mawbSaveBorrow=true"
                                :disabled="!dialogMawb">保存并外借</el-button>
                        </span>
                        <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialog=true"
                            style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:10px;top:2px"></i>
                        <i title="刷新" class="el-icon-refresh" @click="getMawbConfig"
                            style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:14px;top:2px"></i>
                    </span>
                </div>
                <el-tabs type="border-card" v-model="mawbTab">
                    <el-tab-pane :label="`正常运单(${mawbConfigtableData.length})`">
                        <commonTable :head="mawbConfigHead" :table-data="mawbConfigtableData"
                            divStyle="max-height:600px" style="margin-top:8px;">
                            <template slot="mawb" slot-scope="props">
                                <span style="cursor:pointer"
                                    @click="choiseDialogMawb(props.data.row)">{{props.data.value}}</span>
                            </template>
                        </commonTable>
                    </el-tab-pane>
                    <el-tab-pane :label="`外借运单(${mawbBorrowData.length})`">
                        <commonTable :head="mawbBorrowHead" :table-data="mawbBorrowData" style="margin-top:8px;">
                            <template slot="mawb" slot-scope="props">
                                <span style="cursor:pointer"
                                    @click="choiseDialogMawb(props.data.row)">{{props.data.value}}</span>
                            </template>
                        </commonTable>
                    </el-tab-pane>
                    <el-tab-pane :label="`预定运单(${mawbPreData.length})`">
                        <commonTable :head="mawbPreHead" :table-data="mawbPreData" style="margin-top:8px;">
                            <template slot="mawb" slot-scope="props">
                                <span style="cursor:pointer"
                                    @click="choiseDialogMawb(props.data.row)">{{props.data.value}}</span>
                            </template>
                        </commonTable>
                    </el-tab-pane>

                </el-tabs> -->

     
        </el-dialog>

        <!-- 保存并外借 -->
        <el-dialog :visible.sync="mawbSaveBorrow" width="1000px" append-to-body :close-on-click-modal="false" top="15%"
            center>
            <h4 style="margin-bottom:8px;">总运单保存外借</h4>
            <p style="margin-bottom:8px;">
                <span style="width:300px;display:inline-block">总运单号：{{dialogMawb}}</span>
                <span style="width:300px;display:inline-block">借出人：{{getAddman()}}</span>
                <span style="width:300px;display:inline-block">
                    借出日期：
                    <el-date-picker v-model="mawbBorrowDate" type="datetime" placeholder="选择日期时间"
                        :format="'yyyy-MM-dd HH:mm'" :value-format="'yyyy-MM-dd HH:mm'" style="width:200px;">
                    </el-date-picker>
                </span>

            </p>
            <p style="margin-bottom:8px;">
                <span style="width:400px;display:inline-block">借出客户：{{rowData.wtkhname}}</span>
                <span>借出备注：</span>

                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="mawbRemark"
                    style="width:400px;vertical-align:middle">
                </el-input>

            </p>
            <el-button size="mini" @click="mawbSaveBrow">保存</el-button>
            <el-button @click="mawbSaveBorrow=false" size="mini">返回</el-button>
        </el-dialog>

        <!--左键弹框 -->
        <el-dialog :visible.sync="sizeDialog" width="1000px" top="4%" v-if="sizeDialog&&sizeData"
            :close-on-press-escape="false" custom-class="sizeDialogClass">
            <h3>订舱编号：{{sizeData.hpoInfo.pono}}</h3>
            <div style="width:900px">
                <!-- 运价信息 -->
                <h4><span class="sizeLeft">运价信息</span><span class="sizeRight" @click="copyContent('yjinfo')">复制内容</span>
                </h4>
                <div class="info">
                    <table id="yjinfo" v-if="sizeData.hpoInfo">
                        <tr>
                            <td>销售站运价类型：{{sizeData.xshpoInfo?sizeData.xshpoInfo.isinwageallin=='-1'?'':sizeData.xshpoInfo.isinwageallin:'--'}}
                            </td>
                            <td>销售站运价单价：{{sizeData.xshpoInfo?sizeData.xshpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeData.xshpoInfo.inwagecostprice).toFixed(2):'--'}}
                            </td>
                        </tr>
                        <tr>
                            <td>应收运价类型：{{sizeData.hpoInfo.isinwageallin=='-1'?'':sizeData.hpoInfo.isinwageallin}}</td>
                            <td>应收运价单价：{{sizeData.hpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeData.hpoInfo.inwagecostprice).toFixed(2)}}
                            </td>
                        </tr>
                        <tr>
                            <td>应付运价类型：{{sizeData.hpoInfo.isoutwageallin=='-1'?'':sizeData.hpoInfo.isoutwageallin}}</td>
                            <td>应付运价单价：{{sizeData.hpoInfo.outwageallinprice=='666666'?'0.00':Number(sizeData.hpoInfo.outwageallinprice).toFixed(2)}}
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- 预报尺寸 -->
                <h4><span class="sizeLeft">预报尺寸</span><span class="sizeRight" @click="copyContent('ybcc')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="ybcc">
                        <tr v-for="(i,index) in sizeData.ybList">
                            <td v-for="(i2,index2) in i">
                                ({{2*index+index2+1}}){{Number(i2.vol_longs_yb)}}*{{Number(i2.vol_widths_yb)}}*{{Number(i2.vol_heights_yb)}}*{{Number(i2.vol_piece_yb)}}={{StringNum(Number((i2.vol_longs_yb*i2.vol_widths_yb*i2.vol_heights_yb))/1000000*Number(i2.vol_piece_yb))}}{{i2.packagetypename_yb}}
                            </td>
                        </tr>

                    </table>

                </div>

                <h4><span class="sizeLeft">实际尺寸</span><span class="sizeRight" @click="copyContent('sjcc')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="sjcc">
                        <tr v-for="(i,index) in sizeData.sjList">
                            <td v-for="(i2,index2) in i">
                                ({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}
                            </td>
                        </tr>

                    </table>

                </div>

                <h4><span class="sizeLeft">中英文品名</span><span class="sizeRight" @click="copyContent('zywpm')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="zywpm">
                        <tr v-for="(i,index) in sizeData.axpList">
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                ({{index+1}}){{i.hawb}}:{{i.chinesepm}},{{i.englishpm}}</td>
                        </tr>

                    </table>

                </div>

                <h4><span class="sizeLeft">备注信息</span><span class="sizeRight" @click="copyContent('bzxx')">复制内容</span>
                </h4>

                <div class="info">
                    <table id="bzxx" v-if="sizeData.hpoInfo">
                        <tr>
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                {{sizeData.hpoInfo.remark}}</td>
                        </tr>
                    </table>
                </div>

                <h4><span class="sizeLeft">航线尺寸备注</span><span class="sizeRight"
                        @click="copyContent('hxccbz')">复制内容</span></h4>

                <div class="info">
                    <table id="hxccbz" v-if="sizeData.hpoInfo">
                        <tr>
                            <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">
                                {{sizeData.hpoInfo.volumeremark}}</td>
                        </tr>
                    </table>
                </div>

            </div>

        </el-dialog>

        <!-- 解除总运单配置弹框 -->
        <el-dialog :visible.sync="mawbConfigConfim" width="380px" append-to-body :close-on-click-modal="false" top="15%"
            center>
            
                <el-button type="primary" plain @click="showZuofei=false;mawbConfigFunc(2,1)">可用</el-button>
                <!-- <el-button type="primary" plain @click="mawbConfigFunc(2,4)">不可用</el-button> -->
                <el-button type="primary" plain @click="showZuofei=true;">作废</el-button>
            <div v-if="showZuofei" style="margin-left:-48px;margin-top:10px;height:80px;">
                <newFormCmpt :view-data.sync="zuofeiInputView" :model-data.sync="zuofeiInputModel"></newFormCmpt>
                <el-button type="primary" style="float:right;margin-top:5px;" @click="mawbConfigFunc(2,5)">确认</el-button>
            </div>
        </el-dialog>


        <!-- 航线签单查询 -->
        <el-dialog title="航线综合查询" v-if="dialogShow3" center :visible.sync="dialogShow3" class="dialogPage"
            :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">

            <airPlaneDeatil :boguid="boguid" :visible.sync="dialogShow3"></airPlaneDeatil>

        </el-dialog>

        <transition enter-active-class="animate__animated animate__backInDown"
            leave-active-class="animate__animated animate__backOutDown">
            <el-dialog :title="pagetitle" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
                :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
                <!-- 备注打开弹框类型 -->
                <!-- <mawbaddput :visible.sync="dialogShow" :pagetype="pagetype==1?15:2" :mawbguid="mawbguid"
                    :boguid="boguid" @update="delIndex" :area="area" :orderdom="orderdom" v-if="pagetype==7">
                </mawbaddput>
                <new-order-add :boguid="boguid" pagetype=2 :visible.sync="dialogShow" v-else  frompage=2></new-order-add> -->
                <!--从订单编号进入 订单新增 -->
                <new-order-add :boguid="boguid" pagetype=2 :visible.sync="dialogShow" frompage=2></new-order-add>

            </el-dialog>
        </transition>
        <!-- 驳回弹框 -->
        <el-dialog :visible.sync="showBackDialog" :close-on-click-modal="false" v-if="showBackDialog" width="918px"
            append-to-body top="50px" center :title="opertype==1?'订单确认':'订单驳回'" :show-close="false"
            custom-class="showBackModel">

            <ul
                style="color:#7A8189;padding-bottom:16px;border-bottom:1px solid #BFC5CE;display: grid;grid-template-columns: 190px repeat(6,1fr);row-gap: 8px;">
                <li>订舱编号</li>
                <li>总运单号</li>
                <li>始发港/目的港</li>
                <li>航班种类</li>
                <li>航班号</li>
                <li>要求航班日期</li>
                <li>预报件重体</li>
                <!-- </ul>
                    <ul style="margin-top:5px;padding-bottom:16px;border-bottom:1px solid #BFC5CE;color:#222933"> -->
                <li>{{modelData.pono}}</li>
                <li>{{modelData.mawb}}</li>
                <li>{{modelData.sfg}}/{{modelData.mdg}}</li>
                <li>{{modelData.hbzl}}</li>
                <li>{{modelData.hbh}}</li>
                <li>{{modelData.hbrq}}</li>
                <li>{{modelData.ybpiece}}/{{modelData.ybweight}}/{{modelData.ybvolume}}</li>
            </ul>

            <template v-if="opertype==1">
                <p style="font-size: 16px;font-weight: 600;color:#222933;margin-top: 18px;">请填写航班信息</p>
                <div class="hbinfo">
                    <span>航班号</span>
                    <el-input v-model="modelData.yqhbh" v-verify="'uppercase'" clearable>
                    </el-input>
                    <span>航班日期</span>
                    <el-date-picker v-model="modelData.yqhbrq" class="input-required" type="date"
                        value-format="yyyy-MM-dd" clearable></el-date-picker>
                    <span>总运单号</span>
                    <!-- <el-input v-model="modelData.mawb" clearable></el-input>      -->
                    <div class="el-input">
                        <span :class="[modelData.mawb?'disabled':'']">{{modelData.mawb}}
                            <i class="el-icon-folder-checked" style="margin-left:10px;cursor: pointer;" title="配置总运单"
                                @click="installMawb(modelData)" v-if="!modelData.mawb"></i>
                        </span>
                        <i class="el-icon-folder-delete" style="margin-left:10px;cursor: pointer;" title="解除总运单"
                            @click="unstallMawb(modelData)" v-if="modelData.mawb"></i>
                    </div>

                </div>
            </template>

            <template v-if="opertype!=4&&(modelData.czlx=='自货'||modelData.czlx=='唯凯配舱')">
                <p style="font-size: 16px;font-weight: 600;color:#222933;margin-top: 18px;">请填写运价信息</p>

                <div class="inputCost" style="margin-top: 12px;">
                    <p class="title">空运费</p>
                    <div class="costContainer">
                        <div>
                            <p class="origin">客户报价</p>
                            <div class="disable" style="width:56px;">{{modelData.inwageallinprice}}</div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div>
                            <p class="now">唯凯报价</p>
                            <div class="input-required">
                                <el-input placeholder="请输入" v-model="backModel.inwageallinprice"></el-input>
                            </div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div v-show="ifph()">
                            <p class="origin">客户要求分泡</p>
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
                        <div v-show="ifph()">
                            <p class="origin">唯凯要求分泡</p>
                            <div class="input-required" style="display: flex;">
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


                <div class="inputCost">
                    <p class="title">中转费</p>
                    <div class="costContainer">
                        <div>
                            <p class="origin">客户报价</p>
                            <div class="disable" style="width:56px;">{{modelData.inwageallinprice_trans}}</div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div>
                            <p class="now">唯凯报价</p>
                            <div>
                                <el-input placeholder="请输入" :class="{'input-required':modelData.hbzl=='中转'}"
                                    v-model="backModel.inwageallinprice_trans"></el-input>
                            </div>
                            <p class='bottom'>CNY/KG</p>
                        </div>
                        <div v-show="ifph()">
                            <p class="origin">客户要求分泡</p>
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
                        <div v-show="ifph()" >
                            <p class="origin">唯凯要求分泡</p>
                            <div style="display: flex;">
                                <div style="display:inline-block;margin-right:8px">
                                    <el-input placeholder="请输入" :class="{'input-required':modelData.hbzl=='中转'}"
                                        v-model="backModel.self_real_bp_trans_in"
                                        @change="fpChange($event,'self_real_bp_trans_in','cus_real_bp_trans_in')">
                                    </el-input>
                                </div>
                                <div style="display:inline-block">
                                    <el-input placeholder="请输入" :class="{'input-required':modelData.hbzl=='中转'}"
                                        v-model="backModel.cus_real_bp_trans_in"
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
            </template>

            <template v-if="opertype!=1">
                <div class="inputBack">
                    <p class="title">驳回原因</p>
                    <el-select v-model="backModel.title" placeholder="请选择" class="input-required" clearable>
                        <el-option v-for="item in titleOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>

                <div class="inputBack">
                    <p class="title">驳回描述</p>
                    <el-input type="textarea" style="flex:1" :rows="4" placeholder="请输入内容" class="input-required"
                        v-model="backModel.rejectreason ">
                    </el-input>
                </div>
            </template>

            <div class="inputButton">
                <el-button type="primary" @click="backConfirmNew">确认</el-button>
                <el-button type="default" @click="showBackDialog=false">关闭</el-button>
            </div>



        </el-dialog>

        <transition enter-active-class="animate__animated animate__zoomInDown"
        leave-active-class="animate__animated animate__zoomOutRight">
        <el-dialog title="订单新增" center :visible.sync="orderDialogstatus"  class="dialogPage"
            :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" @close="closeOrderDialog">
        <newOrderAdd  v-if="orderDialogstatus"></newOrderAdd>
        </el-dialog>
        </transition>


        <!-- 分配 -->
        <el-dialog :visible.sync="assignShow" class="dialogPage" :close-on-click-modal="false" v-if="assignShow"
            width="96%" top="0px" :modal="false">
            <fenpei :fenpeiguid="fenpeiguid" @back="delFenPIndex" :visible.sync="assignShow" :area="area"
                :system="system" :origin="pagetype=='7'?'航线':'客服'" @success="saveVisible=false">
            </fenpei>
        </el-dialog>


        <el-dialog :visible.sync="cancelVisible" width="800px" top="4%" v-if="cancelVisible" center>
            <!-- {{abandonReason}} -->
            <cancelReason :jobData="tableDataRes[putIndex]" :abandonReason.sync="abandonReason" :pagetype="1"
                :visible.sync="cancelVisible">
                <template slot="footerBtngroup">
                    <el-button type="primary" @click="backO('single',putIndex)">确定</el-button>
                    <el-button @click="cancelVisible=false;putIndex=-1;abandonReason=''">取消</el-button>
                </template>
            </cancelReason>
        </el-dialog>


            <!-- TODO: 同意操作 -->

        <el-dialog
            title="确认操作"
            :visible.sync="saveVisible"
            width="350px"
           >
           <section style="display: flex; justify-content: center;">
                <el-button 
                    type="primary" 
                    @click="listConfirm(saveData.row, saveData.index, triggerSaveDialog)"
                    style="margin-right: 20px;"
                >
                    本站操作
                </el-button>
<!--                 <el-button 
                    type="primary" 
                    @click="sureOper(saveData.row, saveData.index, 2, triggerSaveDialog)"
                >
                    分配至外站
                </el-button> -->

                <el-button 
                    type="primary" 
                    :disabled="saveData.row&&saveData.row.customprice!='undefined'&&saveData.row.customprice!='2'&&saveData.row.outsidedom=='OUTSIDE'"
                    @click="sureOper(saveData.row, saveData.index, 2)"
                >
                    分配至外站
                </el-button>
           </section>
            
        </el-dialog>
        
    </div>
</template>

<script>
    import {
        systemCheck
    } from '@/components/mixins/topPageMixin'
    import airPlaneDeatil from './orderDetails/airPlaneDeatil' //备注
    import fenpei from "./orderDetails/fenpei";
    import sizeInfo from '@/components/orderDetails/sizeInfo'
    import mawbConfigNew from "./templates/mawbConfigNew";
    import newOrderAdd from "@/components/newOrderAdd.vue"
    import {
        searCondition,
        getChangeValue,
        computedWeight,
        formatDate,
        JudgeBubblesFunc
    } from '../api/localStorage.js'
    import {
    mawbConfigMixin
    } from '@/components/mixins/mawbConfigMixin.js'
    export default {
        name: 'listConfirm',
        mixins: [mawbConfigMixin()],
        components: {
            airPlaneDeatil, fenpei, sizeInfo,mawbConfigNew
        },
        props:{
        realname:String,//上榜确认页面从这进来，其他在data中
        monitor:[String,Number],//上榜确认页面进来的
        realPage:String,//待受理cabinUnconfirmed和逾期待受理orderTakingOverDate
        },
        data() {
            return {
                name: "listConfirm.vue",
                pageshow: true,
                orderDialogstatus: false,
                showTotal: {
                    all: true,
                    ybjzt: true,
                    sjjzt: true,
                    zdjzt: true,
                    wageprofit: true,
                    realwageall: false,
                    billwageall: false,
                    wageall: false,
                    finishwageall: false,
                    finishwageall_checkbill: false
                },
                tableDataRes: [],
                ziTableData: [],
                searchData: {},
                chineseWhere: [],
                ziTableIndex: '-1',
                putIndex: -1, //点击打开展开分单索引
                inputViewData: {
                    hbrq: {
                        title: "航班日期",
                        type: 15,
                        defaultVal: false
                    },
                },
                inputModelData: {
                    //"dzstatus":"AO0010"
                    //"status": "AO5040,AO5020,AO5060,AO5090,AO5030,AO5050"
                },
                modConfirmShow: false, //航班号
                modConfirmIndex: -1, //航班号
                modConfirmShow2: false, //航班日期
                modConfirmIndex2: -1, //航班日期
                orderCancel: false, //驳回弹框
                listBackIndex: -1, //驳回索引
                cancelVisible: false,
                orderCancelForm: {
                    //撤单表单
                    rollbackreason: '',
                    rollbacktype: "",
                    boguid: "",
                    sid: ""
                    //nodelist: [{ nodedate: "", nodeman: "", nodecode: "AO5065", sid: "" }]
                },
                //总运单配置
                dialogMawbConfig: false, //配置总运单弹框
                rowData: {}, //当前行数据
                mawbConfigtableData: [], //配置总运单数据
                mawbInputView:{
                mawb:{title:'总运单号',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},verify: "mawb"},
                bookinger:{title:'运单预订人',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'} },
                djr:{title:'运单登记人',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'} },
                },
                mawbInputData:{},
                mawbConfigHeadNew:[
                {field:'mawb',title:'总运单号'},
                {field:'bookingstatus',title:'预订状态',formatType:2,format:x=>x=='1'?'未预定':'已预订'},
                {field:'ydwtkh',title:'预订委托客户'},
                {field:'aircomname',title:'运单航空公司'},
                {field:'gysname',title:'运单供应商'},
                {field:'mawbxz',title:'运单性质'},
                {field:'djr',title:'登记人'},
                {field:'djdate',title:'登记日期'}
                ],
                dialogMawb: '', //配置总运单号
                objGysss: {}, //总运单单条数据
                mawbDialog: false, //总运单维护弹框
                mawbConfigHead: [ //配置总单表头数据
                    {
                        title: "总运单号",
                        field: "mawb"
                    }, {
                        title: "供应商",
                        field: "gysname"
                    }, {
                        title: "操作类型",
                        field: "czlx"
                    }, {
                        title: "始发港",
                        field: "sfg"
                    }, {
                        title: "总运单所属",
                        field: "mawbss"
                    }, {
                        title: "总运单类型",
                        field: "mawblx"
                    }, {
                        title: "总运单形式",
                        field: "mawbxs"
                    }, {
                        title: "总运单性质",
                        field: "mawbxz"
                    },
                    // { title: "运输分类", field: "ysfl" },
                    {
                        title: "运输条件",
                        field: "ystj"
                    }, {
                        title: "备注",
                        field: "remark"
                    }
                ],
                mawbConfigConfim: false, //解除总运单弹框
                mawbTab: '', //总运单切换Tab  1、正常运单  2、外借运单   3、预定运单
                mawbBorrowHead: [ //配置总运单借出表头
                    {
                        field: 'mawb',
                        title: '总运单号'
                    }, {
                        title: "供应商",
                        field: "gysname"
                    }, {
                        title: '借出对象',
                        field: 'jykhname'
                    }, {
                        title: '借出人',
                        field: 'jyr'
                    }, {
                        title: '借出日期',
                        field: 'jydate'
                    }, {
                        title: "总运单所属",
                        field: "mawbss"
                    }, {
                        title: "总运单类型",
                        field: "mawblx"
                    }, {
                        title: "总运单形式",
                        field: "mawbxs"
                    }, {
                        title: "总运单性质",
                        field: "mawbxz"
                    },
                    // { title: "运输分类", field: "ysfl" },
                    {
                        title: "运输条件",
                        field: "ysfl"
                    }, {
                        title: "操作类型",
                        field: "czlx"
                    }, {
                        title: '备注',
                        field: 'remark'
                    },
                ],
                mawbBorrowData: [], //配置总运单借出表头数据
                mawbPreHead: [ //配置总运单预定表头
                    {
                        field: 'mawb',
                        title: '总运单号'
                    }, {
                        title: "供应商",
                        field: "gysname"
                    }, {
                        title: '预定客户',
                        field: 'bookingkhname'
                    }, {
                        title: '预定人',
                        field: 'bookinger'
                    }, {
                        title: '预定日期',
                        field: 'bookingdate'
                    }, {
                        title: "总运单所属",
                        field: "mawbss"
                    }, {
                        title: "总运单类型",
                        field: "mawblx"
                    }, {
                        title: "总运单形式",
                        field: "mawbxs"
                    }, {
                        title: "总运单性质",
                        field: "mawbxz"
                    },
                    // { title: "运输分类", field: "ysfl" },
                    {
                        title: "运输条件",
                        field: "ysfl"
                    }, {
                        title: "操作类型",
                        field: "czlx"
                    }, {
                        title: '备注',
                        field: 'remark'
                    },
                ],
                mawbPreData: [], //配置总运单预定表头数据
                mawbSaveBorrow: false, //保存并外借弹框
                mawbRemark: '', //借出备注
                mawbBorrowDate: '', //借出日期
                currencyChars: {
                    '人民币': "￥",
                    '美元': "$",
                    '港币': "HK$",
                    '日元': "JPY￥",
                    '欧元': "€",
                    '英镑': "£"
                }, //币种
                sizeData: {}, //单证状态左键点击数据
                sizeDialog: false, //尺寸弹框显示隐藏
                mawbConfigConfim: false, //解除总运单弹框
                czMark: '-1',
                dialogShow3: false,
                boguid: '',
                selectTableIndex: '-1',
                mawbguid: null,
                orderdom: '',
                area: '',
                system: '',
                dialogShow: false,
                popovervisible: false,
                showBackDialog: false,
                modelData: {},
                backModel: {},
                //hbInfoChanged:[],
                titleOptions: [
                    { label: '卖价不符', value: '卖价不符' },
                    { label: '舱位问题', value: '舱位问题' },
                    { label: '其他问题', value: '其他问题' },
                ],
                opertype: '',
                assignShow: false,
                fenpeiguid: '',
                saveVisible: false, // 保存框
                saveData:{}, // 保存框选中的数据
                abandonReason:'',//撤单理由

            }
        },

        methods: {
            closeOrderDialog(){
                this.orderDialogstatus = false
            },
            setBackModel() {
                this.backModel = { hbh: '', hbrq: '', mawb: '', title: '', rejectreason: '', inwageallinprice: '', self_real_bp_freight_in: '', cus_real_bp_freight_in: '', inwageallinprice_trans: '', self_real_bp_trans_in: '', cus_real_bp_trans_in: '' }
            },
            openChatRoome(row){
                //this.$emit('openChatRoome',obj)
                //从表格列表项进入 使用下面代码
                this.$store.commit("setChat", { status: true, data: row });
            },
            alertf(type) {
                console.log(type)
            },
            setPicker(date) {
                console.log(date)
                return {
                    disabledDate(time) {
                        return time.getTime() + 3600 * 1000 * 24 < new Date(date).getTime();
                    }
                }
            },
            search() {

                this.tableDataRes = [];
                this.ziTableData = [];
                // this.searchData.status = {
                //     "end": "500"
                // }
                // this.searchData.dzstatus = {
                //     "in": "1"
                // }
                // this.searchData.canceling = 0
                // this.searchData.islocal = 1

                this.putIndex = '-1';
                let url = { 1: 'api/ExHpoboAxplineOutsideGeneral', 2: "api/ExHpoboAxplineExternalGeneral", 3: "api/ExHpoboAxplineExternalGeneral", 4: 'api/ExHpoboAxplineLocalGeneral', 5: 'api/ExHpoboAxplineLocalGeneral', 6: 'api/ExHpoboAxplineOutsideGeneral', 7: 'api/ExHpoboAxplineAllGeneral' }[this.pagetype];
                //console.log(this.searchData.hbrq)
                if (this.pagetype == 1) {
                    // this.searchData.area = {
                    //     "in": this.conditionalAreaForBuild
                    // }

                    if (!this.searchData.hbrq) {
                        this.searchData.hbrq = {
                            begin: "2020-01-01 00:00"
                        }
                    } else {
                        if (new Date(this.searchData.hbrq.begin).getTime() < new Date('2020-01-01 00:00').getTime()) {
                            if (!this.searchData.hbrq.end) {
                                this.searchData.hbrq = {
                                    begin: "2020-01-01 00:00"
                                }
                            } else {
                                this.searchData.hbrq = {
                                    begin: "2020-01-01 00:00",
                                    end: this.searchData.hbrq.end
                                }
                            }

                        }
                    }
                }
                if (this.pagetype == 7) {
                    this.searchData.area = "上海"
                }
                
                var jsonArr2 = {
                    where: this.searchData,
                    order: "adddate desc"
                }
                var json = {
                    'json': JSON.stringify(jsonArr2)
                }

                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + url,
                    params: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    //console.log(results)

                    if (results.data.length == 0) {
                        this.$message('无查询结果');
                        return;
                    } else {
                        this.pageshow = false
                    }
                    results.data = getChangeValue(results.data, '空出')
                    console.log(results.data)
                    setTimeout(() => {
                        this.tableDataRes = results.data.map(i => {
                            if (i.creditisbackstatus == '6') {
                                i.creditisbackstatus = '无异常'
                            } else if (i.creditisbackstatus == '4') {
                                i.creditisbackstatus = '待通过'
                            } else if (i.creditisbackstatus == '3') {
                                i.creditisbackstatus = '已通过'
                            } else if (i.creditisbackstatus == '5') {
                                i.creditisbackstatus = '已驳回'
                            }
                            if (Number(i.orderguid) >= 0) {
                                if (i.profitmode != '本站') {
                                    if (i.profitmode == '利润分配模式') {
                                        i.isinwageallin = "利润分配"
                                        i.inwageallinprice = `${i.self_real_bp_freight_in}(w)/${i.cus_real_bp_freight_in}(k)`
                                    } else if (i.profitmode == 'Co-Load模式') {
                                        i.isinwageallin = "Co-Load"
                                    }
                                }
                            }

                            i.pickerOptions = {
                                disabledDate(time) {
                                    return time.getTime() + 3600 * 1000 * 24 < new Date(i.adddate).getTime();
                                }
                            }

                            return i
                        })
                    }, 0)
                    //console.log(this.tableDataRes)
                    // results.data.forEach(i=>{
                    //   this.hbInfoChanged.push(i.yqhbh+i.yqhbrq+i.sfg+i.mdg+i.hwlx+i.hwxz)
                    // })
                })
                    .catch(errors => {

                    })

            },
            reset() {
                this.inputModelData = {}
                if (this.pagetype == 3 || this.pagetype == 5 || this.pagetype == 6) {
                    this.$set(this.inputViewData, 'hbrq', {
                        title: "航班日期",
                        type: 15,
                        defaultEnd: true,
                        endtype: 5,
                        disabled: this.pagetype == 3
                    })
                }
                if (this.pagetype == 1 || this.pagetype == 2 || this.pagetype == 4) {
                    this.$set(this.inputViewData, 'hbrq', {
                        title: "航班日期",
                        type: 15,
                        defaultVal: true,
                        disabled: this.pagetype == 2
                    })
                }

                // if(this.pagetype==1||this.pagetype==6){
                //     this.inputViewData.hbrq.disabled=true
                // }
                // if (this.pagetype == 3 || this.pagetype == 5) {
                //     this.$set(this.inputModelData, 'status', "AO5010,AO5025")
                // } else {
                if(!this.monitor||this.monitor=='1'){
                   this.$set(this.inputModelData, 'status', "AO5010")
                }else if(this.monitor=='2'){
                  this.$set(this.inputModelData, 'status', "AO5020")
                }    
                // }

            },
            // 上榜确认
            async listConfirm(data, index, callback) {
                console.log(data,index, callback)
                if (data.iscomboine != '1') {
                    if (!data.isinwageallin || data.isinwageallin == '--' || !data.currencyin || data.creditisbackstatus == '待通过'||data.creditisbackstatus == '已驳回') {
                        if (data.profitmode == '本站') {
                            this.$message.error('运费类型,运费,币种不能为空并且信控状态不为待通过')
                            return
                        }
                    }

                    if (data.czlx.indexOf('代操作') < 0 && this.opertype == 1) {
                        if (!this.modelData.yqhbrq) {
                            return this.$message.error('请选择要求航班日期！')
                        }

                        if (!this.backModel.inwageallinprice) {
                            return this.$message.error('请填写唯凯报价！')
                        }
                        if ((this.backModel.self_real_bp_freight_in + this.backModel.cus_real_bp_freight_in) != 10 && this.ifph(data.ybweight, data.ybvolume)) {
                            return this.$message.error('请检查唯凯要求分泡！')
                        }
                        if (data.hbzl == '中转') {
                            if (!this.backModel.inwageallinprice_trans) {
                                return this.$message.error('请填写唯凯报价！')
                            }
                            if ((this.backModel.self_real_bp_trans_in + this.backModel.cus_real_bp_trans_in) != 10 && this.ifph(data.ybweight, data.ybvolume)) {
                                return this.$message.error('请检查唯凯要求分泡！')
                            }
                        }
                    }

                } else {

                    if (this.putIndex == -1) {
                        return this.$message.error('请点击委托客户加号显示子订单信息确认');
                    }

                    if (this.ziTableData.length) {

                        var success = this.ziTableData.some(i => {
                            if (i.profitmode == '本站') {
                                return !i.isinwageallin || !i.isinwageallin || !String(i.inwageallinprice) || !i.currencyin || i.creditisbackstatus == '待通过'
                            }
                        })

                        if (success) {
                            this.$message.error('子订单运费类型,运费,币种不能为空')
                            this.putIndex = data.index
                            this.$refs.table.ziTableIndex = data.index
                            return
                        }
                    } else {
                        this.$message.info('请点击委托客户加号显示子订单信息确认')
                        return
                    }

                }

                this.$confirm('是否继续上榜确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        var list = []
                        if (data.iscomboine != '1') {
                            list.push({
                                boguid: data.boguid,
                                operguid: data.guid,
                                isinwageallin: this.getIsinwageallin(data.isinwageallin),
                                currencyin: data.currencyin,
                                orderguid: data.orderguid,
                                outsidedom: data.outsidedom,
                                customprice: data.customprice,
                                ...this.getBackModel(),
                                inwageallinprice: this.showBackDialog ? this.getBackModel().inwageallinprice : data.inwageallinprice,//弹窗打开取弹窗中的报价否则取外面查询列表的
                                czlx: data.czlx.includes('代操作') ? '代操作' : '自货'
                            })
                        } else {

                            this.ziTableData.forEach(i => {
                                list.push({
                                    boguid: i.boguid,
                                    operguid: i.guid,
                                    isinwageallin: this.getIsinwageallin(i.isinwageallin),
                                    inwageallinprice: i.inwageallinprice,
                                    currencyin: i.currency,
                                    orderguid: i.orderguid
                                })
                            })
                            //合并订单要传子订单LIST+父订单

                            list.push({
                                boguid: this.tableDataRes[this.putIndex].boguid,
                                operguid: this.tableDataRes[this.putIndex].guid,
                                isinwageallin: -1,
                                inwageallinprice: 666666,
                                currencyin: this.tableDataRes[this.putIndex].currencyin,
                                orderguid: this.tableDataRes[this.putIndex].orderguid,
                                czlx: data.czlx.includes('代操作') ? '代操作' : '自货'
                            })

                        }
                        if(data.area == '上海' && data.system == '空出') {
                                this.$axios({
                                    "method": "put",
                                    url: this.$store.state.webApi + 'api/ExHpoAxplineSureBill',
                                    data: {
                                        list: list,
                                        hbh: $.trim(data.yqhbh),
                                        hbrq: data.yqhbrq,
                                        mawb: data.mawb,
                                        area: data.area,
                                        operguid: data.guid,
                                        sfg: data.sfg,
                                        profitmode: data.profitmode
                                    },
                                    loading: true,
                                    noarea: '1'
                                })
                                    .then(results => {
                                        if(this.pagetype=='4'||this.pagetype=='5'){
                                        this.saveVisible = !this.saveVisible;
                                        }else{
                                        callback&&callback()
                                        }
                                        if (results.data.resultstatus == 0) {
                                            
                                            this.$message.success(results.data.resultmessage)
                                            this.tableDataRes.splice(index, 1);
                                            this.$refs.table.ziTableIndex = '-1';
                                            this.showBackDialog = false;
                                        } else {
                                            this.$message.error(results.data.resultmessage)
                                        }
                                    })
                                    .catch(error => {

                                    })
                        } else {
                            let guid = String(this.tableDataRes[index].boguid);
                            if (
                                this.tableDataRes[index].islocal == 1 &&
                                this.tableDataRes[index].isreject == 1
                            ) {
                                this.$message.error("不能受理！");
                                return;
                            }
                            this.$axios({
                                method: "put",
                                url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                                data: { boguid: guid, status: "100" },
                                loading: true
                            }).then(results => {
                                if (results.data.resultstatus == 0) {
                                    this.$message.success("更新成功");
                                    this.tableDataRes.splice(index, 1);
                                    //this.search()
                                    this.showBackDialog = false;
                                    this.saveVisible = !this.saveVisible;
                                } else {
                                    this.$message.error(results.data.resultmessage);
                                }
                            });
                        }

                    })
                // .catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消操作'
                //     });
                // })

            },
            //上榜修改
            modList(data, index) {
                var json = []
                if (data.iscomboine != '1') {
                    json.push({
                        boguid: data.boguid,
                        operguid: data.guid,
                        isinwageallin: this.getIsinwageallin(data.isinwageallin),
                        inwageallinprice: data.inwageallinprice,
                        currencyin: data.currencyin,
                        orderguid: data.orderguid
                    })

                    this.$axios({
                        "method": "put",
                        url: this.$store.state.webApi + 'api/ExHpoAxplineUpdateBill',
                        data: {
                            list: json,
                            hbh: $.trim(data.yqhbh),
                            hbrq: data.yqhbrq,
                            mawb: data.mawb,
                            area: data.area,
                            operguid: data.guid,
                            sfg: data.sfg,
                            profitmode: data.profitmode
                        },
                        loading: true,
                        noarea: '1'
                    })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                this.$message.success(results.data.resultmessage)
                                this.modConfirmIndex = -1
                                this.modConfirmShow = false
                                this.modConfirmIndex2 = -1
                                this.modConfirmShow2 = false
                                this.tableDataRes['yqhbh'] = data.yqhbh
                                this.tableDataRes['yqhbrq'] = data.yqhbrq
                                this.tableDataRes['mawb'] = data.mawb
                            } else {
                                this.$message.error(results.data.resultmessage)
                            }
                        })
                        .catch(error => {

                        })

                } else {

                    json.push({
                        boguid: data.boguid,
                        operguid: data.guid,
                        isinwageallin: '-1',
                        inwageallinprice: data.inwageallinprice,
                        currencyin: data.currencyin,
                        orderguid: data.orderguid
                    })

                    this.$axios({
                        method: 'get',
                        url: this.$store.state.webApi + 'api/ExHpoAxpline',
                        params: {
                            groupid: this.tableDataRes[data.index].boguid
                        },
                        loading: true,
                        tip: false
                    })
                        .then(results => {
                            results.data = getChangeValue(results.data, "空出");
                            setTimeout(() => {
                                this.ziTableData = this.ziTableData.length ? this.ziTableData : results.data;

                                console.log(this.ziTableData)
                                this.ziTableData.forEach(i => {
                                    json.push({
                                        boguid: i.boguid,
                                        operguid: i.guid,
                                        isinwageallin: this.getIsinwageallin(i.isinwageallin),
                                        inwageallinprice: i.inwageallinprice,
                                        currencyin: i.currencyin,
                                        orderguid: i.orderguid
                                    })

                                })

                                this.$axios({
                                    "method": "put",
                                    url: this.$store.state.webApi + 'api/ExHpoAxplineUpdateBill',
                                    data: {
                                        list: json,
                                        hbh: $.trim(data.yqhbh),
                                        hbrq: data.yqhbrq,
                                        mawb: data.mawb,
                                        area: data.area,
                                        operguid: data.guid,
                                        sfg: data.sfg,
                                        profitmode: data.profitmode
                                    },
                                    loading: true,
                                    noarea: '1'
                                })
                                    .then(results => {
                                        if (results.data.resultstatus == 0) {
                                            this.$message.success(results.data.resultmessage)
                                            this.modConfirmIndex = -1
                                            this.modConfirmShow = false
                                            this.modConfirmIndex2 = -1
                                            this.modConfirmShow2 = false
                                            this.tableDataRes['yqhbh'] = data.yqhbh
                                            this.tableDataRes['yqhbrq'] = data.yqhbrq
                                            this.tableDataRes['mawb'] = data.mawb
                                        } else {
                                            this.$message.error(results.data.resultmessage)
                                        }
                                    })
                                    .catch(error => {

                                    })
                            }, 0);
                        })
                }

            },

            newCancelOrderFunc() {
                this.modConfirmIndex = -1
                this.modConfirmShow = false
                this.modConfirmIndex2 = -1
                this.modConfirmShow2 = false
                this.tableDataRes.splice(this.listBackIndex, 1)
            },
            // 配置总运单
            installMawb(data) {
                if(this.monitor =='2') return
                if (data.mawb) {
                    return false
                }
                // if (this.getStatusNum('单证状态', this.rowData.dzstatus) >= 300 || this.rowData.mawb) {
                //   return false
                // }
                this.rowData = data
                this.mawbConfigtableData = []
                this.mawbBorrowData = []
                this.mawbPreData = []
                this.getMawbConfig()

            },
            unstallMawb(data) {
                if(this.monitor =='2') return
                if (!data.mawb) {
                    //this.$message.info('此状态无法解配总运单')
                    return false
                }
                this.rowData = data
                this.mawbConfigConfim = true
            },
            getMawbConfig(data) { //获取总单配置表格数据
                  this.dialogMawbConfig = true;
                   this.rowData.wtkh=getxmdata("wtkh").filter(i=>i.id == this.rowData.fid)[0]['usr_name']
                // var hbh = this.rowData.hbh || this.rowData.yqhbh
                // var sfg = this.rowData.sfg

                // this.dialogMawbConfig = true;
                // this.dialogMawb = this.rowData.mawb;
                // this.objGysss = this.rowData
                // var json = {
                //     area: this.rowData.area,
                //     hbh: hbh.substr(0, 2) || "",
                //     czlx: this.rowData.czlx == '唯凯配舱' || this.rowData.czlx == '自货' ? '自货' : '代操作',
                //     sfg: sfg,
                //     hwxz: this.rowData.hwxz || "",
                //     ystj: this.rowData.ystj || ""
                // };
                // this.$axios({
                //     method: "get",
                //     url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                //     params: json,
                //     loading: true,
                //     tip: false
                // }).then(results => {
                //     // //console.log("总单配置")
                //     // //console.log(results)
                //     if (results.data) {
                //         this.mawbConfigtableData = results.data.filter(i => {
                //             return i.type == '1'
                //         });
                //         this.mawbBorrowData = results.data.filter(i => {
                //             return i.type == '2'
                //         });
                //         this.mawbPreData = results.data.filter(i => {
                //             return i.type == '3'
                //         });
                //         this.getMawbGys()
                //     }

                // });
            },
            mawbSaveBrow() { //保存并外借
                var json = {
                    boguid: this.rowData.boguid,
                    guid: this.rowData.guid,
                    area: this.rowData.area,
                    gysname: this.objGysss && this.objGysss.gysname,
                    mawbss: this.objGysss && this.objGysss.mawbss,
                    mawbgid: this.objGysss && this.objGysss.gysid,
                    hwxz: this.rowData.hwxz,
                    mawb: this.dialogMawb,
                    jykhid: this.rowData.gid,
                    jyr: this.getAddman(),
                    jydate: this.mawbBorrowDate,
                    jyremark: this.mawbRemark,
                    hwxz: this.rowData.hwxz,
                    czlx: this.rowData.czlx == '唯凯配舱' || this.rowData.czlx == '自货' ? '自货' : '代操作',
                    mdg: this.rowData.mdg,
                    system: this.rowData.system,
                    xyfp1_in: this.objGysss && this.objGysss.xyfp1_in,
                    xyfp2_in: this.objGysss && this.objGysss.xyfp2_in,
                    iszddl: this.objGysss && this.objGysss.iszddl,
                    zddlcode: this.objGysss && this.objGysss.zddlcode,
                }
                //  console.log(json)
                this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + "api/ExHpoAxplineSureMawbBorrowOut",
                    data: json,
                    loading: false,
                    tip: false
                })
                    .then(results => {
                        if (results.data.resultstatus == 0) {
                            this.rowData.mawb = this.dialogMawb;
                            this.mawbSaveBorrow = false
                            this.dialogMawbConfig = false
                            this.$message.success(results.data.resultmessage)
                            //this.getMawbGys();
                        } else {
                            this.$message.error(results.data.resultmessage)
                        }
                    })
                    .catch(error => {

                    })
            },
            getAddman() {
                return localStorage.usrname;
            },
            getZimessage(data) {
                console.log(data)
                if (this.putIndex == data.index) {
                    this.putIndex = '-1'
                    this.ziTableData = []

                } else {
                    this.putIndex = data.index;
                    this.ziTableData = [];
                    this.$axios({
                        method: 'get',
                        url: this.$store.state.webApi + 'api/ExHpoAxpline',
                        params: {
                            groupid: this.tableDataRes[data.index].boguid
                        },
                        loading: true,
                        tip: false
                    })
                        .then(results => {
                            results.data = getChangeValue(results.data, "空出");
                            //console.log(results.data)
                            setTimeout(() => {
                                results.data.forEach(item => {
                                    item.wtkhname = getxmdata('xmdata').filter(i => {
                                        return i.id == item.gid
                                    })[0]['usr_name'].split('-')[1]
                                })
                                this.ziTableData = results.data;
                                console.log(this.ziTableData)
                            }, 0);
                            if (Number(data.orderguid) > 0) {
                                if (data.profitmode != '本站') {
                                    if (data.profitmode == '利润分配模式') {
                                        this.ziTableData.forEach(i => {
                                            i.isinwageallin == '利润分配'
                                            i.inwageallinprice = `${i.self_real_bp_freight_in}(w)/${i.cus_real_bp_freight_in}(k)`
                                        })
                                    } else if (data.profitmode == 'Co-Load模式') {
                                        this.ziTableData.forEach(i => {
                                            i.i.isinwageallin == 'Co-Load'
                                        })
                                    }
                                }
                            }

                        })
                        .catch(error => {

                        })
                }
                this.$refs.table.ziTableIndex = this.putIndex

            },

            /*****************************尺寸信息************************************/
            sizeRowData(boguid) {
                this.sizeDialog = true
                let sizeArr = []
                let sizeArr2 = []
                this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineGetBillSize',
                    params: {
                        boguid: boguid
                    },
                    loading: true,
                    tip: false
                })
                    .then(results => {
                        this.sizeData = results.data

                        if (this.sizeData.hpoInfo) {
                            if (this.sizeData.hpoInfo.isinwageallin == '1') {
                                this.sizeData.hpoInfo.isinwageallin = '单价ALLIN'
                                this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                            } else if (this.sizeData.hpoInfo.isinwageallin == '2') {
                                this.sizeData.hpoInfo.isinwageallin = 'M级++'
                                this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                            } else if (this.sizeData.hpoInfo.isinwageallin == '3') {
                                this.sizeData.hpoInfo.isinwageallin = '单价++'
                                this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                            } else if (this.sizeData.hpoInfo.isinwageallin == '4') {
                                this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                                //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                            }
                            if (this.sizeData.hpoInfo.isoutwageallin == '1') {
                                this.sizeData.hpoInfo.isoutwageallin = '单价ALLIN'
                            } else if (this.sizeData.hpoInfo.isoutwageallin == '2') {
                                this.sizeData.hpoInfo.isoutwageallin = 'M级++'
                            } else if (this.sizeData.hpoInfo.isoutwageallin == '3') {
                                this.sizeData.hpoInfo.isoutwageallin = '单价++'
                            }
                        }

                        if (this.sizeData.xshpoInfo) {
                            if (this.sizeData.xshpoInfo.isinwageallin == '1') {
                                this.sizeData.xshpoInfo.isinwageallin = '单价ALLIN'
                                this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                            } else if (this.sizeData.xshpoInfo.isinwageallin == '2') {
                                this.sizeData.xshpoInfo.isinwageallin = 'M级++'
                                this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                            } else if (this.sizeData.xshpoInfo.isinwageallin == '3') {
                                this.sizeData.xshpoInfo.isinwageallin = '单价++'
                                this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                            } else if (this.sizeData.xshpoInfo.isinwageallin == '4') {
                                this.sizeData.xshpoInfo.isinwageallin = 'Cost++'
                                //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                            }
                        }

                        let ybList = [];
                        let sjList = [];
                        let ybStoreList = [];
                        let sjStoreList = [];

                        this.sizeData.storeList.forEach(i => {
                            if (sjList.indexOf(i.vol_guid) == '-1' && i.vol_guid != 0) {
                                // i.vol_heights=Number(i.vol_heights/100).toFixed(2)
                                // i.vol_longs=Number(i.vol_longs/100).toFixed(2)
                                // i.vol_widths=Number(i.vol_widths/100).toFixed(2)
                                sjList.push(i.vol_guid)
                                sjStoreList.push(i)
                            }
                        })

                        this.sizeData.storeYbList.forEach(i => {
                            if (ybList.indexOf(i.vol_guid_yb) == '-1' && i.vol_guid_yb != 0) {
                                // i.vol_heights_yb=Number(i.vol_heights_yb/100).toFixed(2)
                                // i.vol_longs_yb=Number(i.vol_longs_yb/100).toFixed(2)
                                // i.vol_widths_yb=Number(i.vol_widths_yb/100).toFixed(2)
                                ybList.push(i.vol_guid_yb)
                                ybStoreList.push(i)
                            }
                        })
                        //this.sizeData.ybList=ybStoreList
                        //this.sizeData.sjList=sjStoreList

                        //console.log(ybStoreList)
                        //console.log(sjStoreList)
                        for (var i = 0; i < ybStoreList.length; i += 2) {
                            sizeArr.push(ybStoreList.slice(i, i + 2));
                        }

                        for (var i = 0; i < sjStoreList.length; i += 2) {
                            sizeArr2.push(sjStoreList.slice(i, i + 2));
                        }

                        this.sizeData.sjList = sizeArr2
                        this.sizeData.ybList = sizeArr

                        console.log(this.sizeData)

                    })
                    .catch(error => {

                    })

            },

            StringNum(num) {
                var returnNum = num.toLocaleString();
                returnNum = returnNum.replace(/[,]/g, '');
                return Number(returnNum).toFixed(2)
            },
            copyContent(element) {
                var range = document.createRange();
                var startNode = document.getElementById(element);
                range.selectNode(startNode);
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range)
            },

            //航线签单详细
            airDetail(data) {
                // if(!data.mawb|| !data.hbh || !data.hbrq){
                //   this.$message.error('请配置总运单号,航班号,航班日期')
                //   return false
                // }
                // if(data.czlx=='代操作'||data.czlx=='唯凯代操作'){
                //   this.$message.error('操作类型无法操作')
                //   return false
                // }

                this.dialogShow3 = true
                this.boguid = data.boguid
            },

            openDialog(indexData) {
                if(this.monitor =='2') return
                this.selectTableIndex = indexData
                this.mawbguid = this.tableDataRes[indexData].guid
                this.boguid = this.tableDataRes[indexData].boguid
                this.orderdom = this.tableDataRes[indexData].orderdom
                this.area = this.tableDataRes[indexData].area
                this.dialogShow = true
            },
            sureOper(row, index, type, callback) {
                //type 1本站操作 2分配外站 3点击驳回
                this.selectTableIndex = index
                this.modelData = this.tableDataRes[index];
                console.log(row)
                console.log(this.modelData)
                this.setBackModel()
                if (type == 1) {
                    if (this.modelData.outsidedom == 'OUTSIDE') {
                        if (this.modelData.customprice == 2) {
                            //外网有报价，点本站操作，直接走接口
                            //this.operationSave(row)
                            this.listConfirm(row, index)
                        } else {
                            //外网无报价
                            this.opertype = 1;
                            this.showBackDialog = true;
                            this.backModel.hbh = this.modelData.hbh
                            this.backModel.hbrq = this.modelData.hbrq
                            this.backModel.mawb = this.modelData.mawb
                        }

                    }
                }
                if (type == 2) {
                    //@@@不判断outside

                    // if (this.modelData.outsidedom == 'OUTSIDE') {
                    //     if (this.modelData.customprice == 2) {
                    //         //外网有报价，点分配外站
                    //         this.opertype = 2;
                    //         this.fenpeiDialog(row);
                    //     } else {
                    //         //外网无报价
                    //         this.opertype = 1;
                    //         this.showBackDialog = true
                    //     }
                    // } else {
                    //     //内网，直接走接口
                    //     this.listConfirm(row, index)
                    // }

                        if (this.modelData.customprice == 2||this.modelData.outsidedom=='') {
                            //外网有报价，点分配外站
                            this.opertype = 2;
                            this.fenpeiDialog(row);
                        } else {
                            //外网无报价

                            this.opertype = 1;
                            this.showBackDialog = true
                        }
                   
                }
                if (type == 3) {
                    if (this.modelData.outsidedom == 'OUTSIDE') {
                        if (this.modelData.customprice == 2) {
                            //外网并且有报价
                            this.opertype = 3
                        } else {
                            //外网并且无报价
                            this.opertype = 4
                        }
                        this.showBackDialog = true

                    } else {
                        this.opertype = 5
                        if(row.area == '上海' && row.system == '空出') {
                            this.orderCancel = true;
                        } else {
                           let guid = String(this.tableDataRes[index].boguid);
                            var routedelreason = {
                                reasontype: "外站驳回",
                                delbillreason: this.abandonReason,
                                delbillman: localStorage.usrname,
                                delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
                                area: this.area,
                                hbh: this.tableDataRes[index].yqhbh,
                                hbrq: this.tableDataRes[index].yqhbrq,
                            }
                            this.$axios({
                                method: "put",
                                url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                                data: {
                                    boguid: guid,
                                    status: "200",
                                    routedelreason: JSON.stringify(routedelreason)
                                },
                                loading: true
                            }).then(results => {
                                ////console.log(results.data)
                                if (results.data.resultstatus == 0) {
                                    this.$message.success("更新成功");
                                    this.tableDataRes.splice(index, 1);
                                    this.cancelVisible = false;
                                    this.putIndex = -1;
                                    this.abandonReason = "";
                                    //this.search()
                                } else {
                                    this.$message.error(results.data.resultmessage);
                                }
                                    });
                        }
                        
                        this.listBackIndex = index;
                        this.orderCancelForm = { rollbackreason: '', rollbacktype: '', boguid: '', sid: '' };
                        this.czMark = row.pono.indexOf('-') != '-1' ? '1' : '2'
                    }
                }
                callback&&callback()

            },                          //驳回报价
            backConfirmNew() {
                // console.log(this.backModel)
                // if (Object.values(this.backModel).indexOf('') != '-1') {
                //     return this.$message.error('请填写完整运价信息')
                // }
                if (this.opertype == 1) {
                    this.listConfirm(this.modelData, this.selectTableIndex);
                    return;
                }
                if (this.modelData.czlx.indexOf('代操作') < 0 && this.opertype != 4) {
                    if (!this.backModel.inwageallinprice) {
                        return this.$message.error('请填写唯凯报价！')
                    }
                    if ((this.backModel.self_real_bp_freight_in + this.backModel.cus_real_bp_freight_in) != 10 && this.ifph()) {
                        return this.$message.error('请检查唯凯要求分泡！')
                    }
                    if (this.modelData.hbzl == '中转') {
                        if (!this.backModel.inwageallinprice_trans) {
                            return this.$message.error('请填写唯凯报价！')
                        }
                        if ((this.backModel.self_real_bp_trans_in + this.backModel.cus_real_bp_trans_in) != 10 && this.ifph()) {
                            return this.$message.error('请检查唯凯要求分泡！')
                        }
                    }
                }
                if (this.opertype == 4) {
                    if (!this.backModel.title) {
                        return this.$message.error('请选择驳回原因！')
                    }
                    if (!this.backModel.rejectreason) {
                        return this.$message.error('请填写驳回描述！')
                    }
                }

                let data = this.modelData;



                let list = []
                list.push({
                    boguid: data.boguid,
                    operguid: data.guid,
                    isinwageallin: this.getIsinwageallin(data.isinwageallin),
                    currencyin: data.currencyin,
                    orderguid: data.orderguid,
                    // inwageallinprice: this.backModel.inwageallinprice,
                    // inwageallinprice_trans: this.backModel.inwageallinprice_trans,
                    // self_real_bp_freight_in: this.backModel.self_real_bp_freight_in,
                    // cus_real_bp_freight_in: this.backModel.cus_real_bp_freight_in,
                    // self_real_bp_trans_in: this.backModel.self_real_bp_trans_in,
                    // cus_real_bp_trans_in: this.backModel.cus_real_bp_trans_in,
                    // title: this.backModel.title,
                    // rejectreason: this.backModel.rejectreason
                    ...this.getBackModel()
                })

                let json = {
                    list: list,
                    hbh: $.trim(data.yqhbh),
                    hbrq: data.yqhbrq,
                    mawb: data.mawb,
                    area: data.area,
                    operguid: data.guid,
                    sfg: data.sfg,
                    profitmode: data.profitmode
                };
                // console.log(json);return
                this.$axios({
                    method: "put", url: this.$store.state.webApi + "api/ExHpoAxplineUnSureBill", data: json, loading: true, tip: false
                })
                    .then(results => {
                        if (results.data.resultstatus == 0) {
                            this.$message.success(results.data.resultmessage);
                            this.showBackDialog = false
                            // this.backModel = { hbh: '', hbrq: '', mawb: '', title: '', inwageallinprice: '', self_real_bp_freight_in: '', cus_real_bp_freight_in: '', inwageallinprice_trans: '', self_real_bp_trans_in: '', cus_real_bp_trans_in: '', rejectreason: '' }
                            this.setBackModel()
                        } else {
                            this.$message.error(results.data.resultmessage)
                        }

                    })
                    .catch(error => {
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
            delFenPIndex(data) {
                this.assignShow = false;
                if (data.nodel == "2") {
                    var nowTableData = [];
                    var fenpeiguidArray = this.fenpeiguid.split(",");
                    this.tableDataRes.forEach((item, index) => {
                        if (item.boguid.indexOf(fenpeiguidArray) == -1) {
                            nowTableData.push(item);
                        }
                        this.tableDataRes = nowTableData;
                    });
                }
            },
            fenpeiDialog(row) {
                if (row.orderdom == '分单') return;
                //分配弹框
                let boguid = row.boguid;
                let area = row.area;
                let system = row.system;
                this.area = area;
                if (boguid) {
                    this.fenpeiguid = boguid;
                } else {
                    if (this.guidAll.length == 0) {
                        this.$message.error("请选择分配订单号");
                        return false;
                    } else {
                        var guid = [];
                        this.guidAll.forEach(item => {
                            guid.push(this.tableDataRes[item].boguid);
                        });
                        this.fenpeiguid = guid.join(",");
                    }
                }
                this.system = system;
                this.assignShow = true;
                ////console.log(this.fenpeiguid)
            },
            operationSave(row) {
                if (row.orderdom == '分单') return;
                let boguid = row.boguid
                //WFF操作
                let boguidArr = [];
                if (boguid) {
                    boguidArr = [boguid];
                } else {
                    this.tableDataRes.forEach(i => {
                        if (i.checked) {
                            boguidArr.push(i.boguid);
                        }
                    });
                    console.log(boguidArr);
                    if (boguidArr.length == 0) {
                        this.$message.error("请先选择需操作的订单号！");
                        return;
                    }
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
                            data: { boguid: boguidArr.toString() },
                            loading: true,
                            tip: false
                        }).then(results => {
                            console.log(results);
                            if (results.data.resultstatus == 0) {
                                this.$message(results.data.resultmessage);
                            } else {
                                this.$message.error(results.data.resultmessage);
                            }
                        });
                    })
                    .catch(() => { });
            },
            getIsinwageallin(isinwageallin) {
                if (isinwageallin == '1' || isinwageallin == '单价ALLIN') {
                    return '1'
                } else if (isinwageallin == '2' || isinwageallin == '总价ALLIN') {
                    return '2'
                } else if (isinwageallin == '3' || isinwageallin == '单价++') {
                    return '3'
                } else if (isinwageallin == '4' || isinwageallin == 'Cost+') {
                    return '4'
                }
                return '-1'
            },
            delIndex(data) {
                if (data.nodel == "2") {
                    this.tableDataRes.splice(this.selectTableIndex, 1);
                }
                this.dialogShow = false;
            }, backO(type, index) {
                //退回
                if (type == "single") {
                    //单条退回
                    let guid = String(this.tableDataRes[index].boguid);
                    var routedelreason = {
                        reasontype: "外站驳回",
                        delbillreason: this.abandonReason,
                        delbillman: localStorage.usrname,
                        delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
                        area: this.area,
                        hbh: this.tableDataRes[index].yqhbh,
                        hbrq: this.tableDataRes[index].yqhbrq,
                    };
                    this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                        data: {
                            boguid: guid,
                            status: "200",
                            routedelreason: JSON.stringify(routedelreason)
                        },
                        loading: true
                    }).then(results => {
                        ////console.log(results.data)
                        if (results.data.resultstatus == 0) {
                            this.$message.success("更新成功");
                            this.tableDataRes.splice(index, 1);
                            this.cancelVisible = false;
                            this.putIndex = -1;
                            this.abandonReason = "";
                            //this.search()
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                    //alert(index)
                } else if (type == "all") {
                    //多条退回
                    if (this.guidAll.length == 0) {
                        this.$message.error("请选择订单");
                    } else {
                        var items = [];
                        ////console.log(this.guidAll.join(','))
                        this.guidAll.forEach(item => {
                            items.push(this.tableDataRes[item].boguid);
                        });
                        var guids = items.join(",");
                        //console.log(guids)
                        this.$axios({
                            method: "put",
                            url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                            data: { boguid: guids, status: "200" },
                            loading: true
                        }).then(results => {
                            //console.log(results.data)
                            if (results.data.resultstatus == 0) {
                                var nowTableData = [];
                                this.$message.success("更新成功");
                                this.cancelVisible = false;
                                this.putIndex = -1;
                                this.abandonReason = "";

                                this.tableDataRes.forEach(item => {
                                    if (items.indexOf(item.boguid) == -1) {
                                        nowTableData.push(item);
                                    }
                                });
                                //console.log(nowTableData)
                                this.tableDataRes = nowTableData;
                                //this.tableDataRes=[]

                                //this.search()
                            } else {
                                this.$message.error(results.data.resultmessage);
                            }
                            this.guidAll = [];
                        });
                    }
                }
            },

            handleO(type, index) {
                //受理
                if (type == "single") {
                    //单条受理
                    //let guid=this.tableDataRes[index].guid
                    //alert(index)
                    let guid = String(this.tableDataRes[index].boguid);
                    if (
                        this.tableDataRes[index].islocal == 1 &&
                        this.tableDataRes[index].isreject == 1
                    ) {
                        this.$message.error("不能受理！");
                        return;
                    }
                    this.$axios({
                        method: "put",
                        url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                        data: { boguid: guid, status: "100" },
                        loading: true
                    }).then(results => {
                        if (results.data.resultstatus == 0) {
                            this.$message.success("更新成功");
                            this.tableDataRes.splice(index, 1);
                            //this.search()
                        } else {
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                } else if (type == "all") {
                    //多条受理

                    if (this.guidAll.length == 0) {
                        this.$message.error("请选择订单");
                    } else {
                        var items = [];
                        var ifPiShouli = true;
                        // console.log(this.guidAll)
                        this.guidAll.forEach(item => {
                            items.push(this.tableDataRes[item].boguid);
                        });
                        this.tableDataRes.forEach(item => {
                            if (item.islocal == 1 && item.isreject == 1) {
                                ifPiShouli = false;
                            }
                        });

                        if (!ifPiShouli) {
                            this.$message.error("不能批量受理！");
                            return;
                        }

                        var guids = items.join(",");
                        ////console.log(guids)
                        this.$axios({
                            method: "put",
                            url: this.$store.state.webApi + "api/ExAxplineAcceptance",
                            data: { boguid: guids, status: "100" },
                            loading: true
                        }).then(results => {
                            if (results.data.resultstatus == 0) {
                                var nowTableData = [];
                                this.$message.success("更新成功");
                                this.tableDataRes.forEach(item => {
                                    if (items.indexOf(item.boguid) == -1) {
                                        nowTableData.push(item);
                                    }
                                });
                                this.tableDataRes = nowTableData;
                                //this.search()
                            } else {
                                this.$message.error(results.data.resultmessage);
                            }
                            this.guidAll = [];
                        });
                    }
                }
            },
            getBackModel() {
                let backModel = { ...this.backModel }
                backModel.inwageallinprice = backModel.inwageallinprice || 666666
                backModel.inwageallinprice_trans = backModel.inwageallinprice_trans || 666666
                backModel.self_real_bp_freight_in = backModel.self_real_bp_freight_in || 10
                backModel.cus_real_bp_freight_in = backModel.cus_real_bp_freight_in || 0
                backModel.self_real_bp_trans_in = backModel.self_real_bp_trans_in || 10
                backModel.cus_real_bp_trans_in = backModel.cus_real_bp_trans_in || 0
                return backModel
            },
            ifph(w, v) {//是否是泡货
                //外网待受理, 外网逾期待受理 如果该货物不是泡货, 则无需显示分泡比例字段
                if (this.pagetype == 1 || this.pagetype == 6) {
                    return JudgeBubblesFunc(w || this.modelData.ybweight, v || this.modelData.ybvolume) < 0
                } else {
                    return true
                }

            },

             /**
             * @desc 显示关闭保存弹框
             * @param { Object } item 选中的数据
             */
            // TODO: 显示关闭保存弹框
            triggerSaveDialog( item ) {

                if((this.pagetype==4||this.pagetype==5)&&!item.row.yqhbrq){
                   return this.$message.error('请完善航班日期')
                }

                this.saveVisible = !this.saveVisible;
                if(item) {
                    this.saveData = item
                }
                
                
            },
        },

        watch: {

        },
        mounted(){
          this.$watch(()=>{
              return this.monitor
          },(val)=>{
            if(val&&val=='1'){
              this.inputModelData={status:'AO5010'}
              this.inputViewData.status.disabled=true
            }else if(val&&val=='2'){
              this.inputViewData.hbrq.defaultVal=true
              this.inputModelData={status:'AO5020'}
            }
          },{immediate:true})
        },
        created() {
            this.setBackModel()
            this.reset()
        },
        computed: {
            pagetitle() {
                return this.$store.state.navDataById[this.$route.params.id].autname || "详细信息"
            },
            guidAll() {
                var arr = [];
                this.tableDataRes.forEach((i, index) => {
                    if (i.checked) {
                        arr.push(index);
                    }
                });
                return arr;
            },
            pagetype() {
                //此页面注入了以下几个路由
                //1外网待受理 listConfirmOut  2外站待受理orderTaking  3 外站逾期待处理 orderTakingOverDate  4本站待受理cabinUnconfirmed  5本站逾期待处理orderTakingOverDate  6.外网逾期待受理 listConfirmOverDate 7上榜确认 listConfirm
                if(!this.monitor){
                    let type=''
                    if(this.realPageName){
                       type = ["listConfirmOut", "orderTaking", "orderTakingOverDate"].indexOf(this.realPageName) + 1;
                    }
                    if (this.realPageName == "orderTakingOverDate" || this.realPage=="orderTakingOverDate") {
                        type = JSON.parse(sessionStorage.nav).find(i => i.id == this.$route.params.id).autcode == "SH_POMANAGEMENT_PAGE_ORDERTAKINGOVERDATELOCAL" || this.realPage? 5 : 3
                    }
                    if (this.realPageName == 'listConfirmOverDate') {
                        return 6
                    }
                    if (this.realPageName == 'listConfirm') {
                        return 7
                    }
                    if(this.realPage=='cabinUnconfirmed'){
                        return 4
                    }
                    return type
                }else{
                    return 7
                }

            },
            headTable() {
                let data = this.$store.state.tablePageTmp[this.name.split(".")[0]]
                if (data && data[0]) {
                    let head = JSON.parse(JSON.stringify(data))
                    if (this.pagetype == 4 || this.pagetype == 5 || this.pagetype == 7) {
                        if(this.monitor=='2'){
                           head[0][0].title = "尺寸|通信"; 
                        }else{
                           head[0][0].title = "保存|同意|撤单|尺寸|通讯";
                        }
                        return head
                    } 

                    if (this.realPageName == 'listConfirmOut' || this.realPageName == 'listConfirmOverDate') {
                        head[1] = head[1].filter(i => i.title != '分配模式' && i.title != '分配额度')
                        head[1].push(
                            {
                                title: '要求到达日期',
                                id: "150",
                                isactive: "1",
                                field: "ddrq"
                            },
                            {
                                title: '销售人名称',
                                id: "160",
                                isactive: "1",
                                field: "priceabout"
                            }
                        )
                        return head
                    } else {
                        return head
                    }
                }
            }
        }

    }
</script>

<style lang="less" scoped>
    /deep/.sizeDialogClass {
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

    .pPopover {
        p {
            cursor: pointer;
        }

        P:first-child {
            margin-bottom: 8px;
        }

        i {
            margin-left: 8px;
            color: #D5D5D5
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
            /* width: 124px; */
            text-align: left;
        }

        .inputCost {
            margin-top: 24px;
            display: flex;

            .title {
                color: #222933;
                font-weight: bold;
                width: 80px;

            }

            .costContainer {
                display: grid;
                grid-template-columns: 100px 170px 130px 200px;
                grid-template-rows: auto;
                justify-items: start;

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
            display: flex;

            .title {
                color: #222933;
                font-weight: bold;
                width: 66px;
            }
        }

        .inputButton {
            text-align: right;
            margin-top: 30px;

            .confirm {
                width: 88px;
                height: 32px;
                background: #006AFF 0% 0% no-repeat padding-box;
                box-shadow: 0px 2px 4px #006AFF66;
                /* border-radius: 16px; */
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
                /* border-radius: 16px; */
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

    .hbinfo {
        display: flex;
        margin: 12px 0 24px;
        align-items: center;

        >span {
            width: 60px;
        }

        >div {
            width: 180px;
            margin-right: 24px;
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
</style>