<template>
    <div>
        <el-collapse-transition>
            <div v-show="setPageshow"
                :class="[!isOutAddClass?(pagetype==1?'searchCmpt':'contentCmpt'):'contentOut',{'page-container-main':!isOutAddClass}]"
                v-enterfocus :tempname="name">
                <template v-for="(k,index) in Object.keys(viewData)">
                    <div :key="k" :id="k"
                        :style="[{order:viewData[k].order>=0?viewData[k].order:index},viewData[k].idStyle,{display:(typeof viewData[k].hidden=='function'?viewData[k].hidden():viewData[k].hidden)?'none':''}]"
                        :class="[{elitem:isOutAddClass,width100:viewData[k].occupyAline},viewData[k].idClass]" v-if="k">
                        <div class="input-item" :style="viewData[k].itemStyle"
                            v-if="viewData[k]&&!(typeof viewData[k].hidden=='function'?viewData[k].hidden():viewData[k].hidden)"
                            :class="{itemDisabled:computedAttribute(k)&&pagetype==1,width100:viewData[k].occupyAline}">
                            <div class="input-title"
                                :style="[{'min-width':viewData[k].type==15?'78px':'','width':viewData[k].type==15?'78px':''},viewData[k].titleStyle]">
                                <!-- {{viewData[k].title}} -->
                                {{computedAttribute(k,'title')||""}}
                                <explainTooltip :text="viewData[k].explainText" v-if="viewData[k].explainText">
                                </explainTooltip>
                                <!-- {{$t(`message.${k}`).indexOf('message.')>=0?viewData[k].title:$t(`message.${k}`)}} -->
                            </div>
                            <div class="input-content" :style="[viewData[k].contentStyle]"
                                :class="{'input-required':computedAttribute(k,'required'),contentDisabled:computedAttribute(k)&&pagetype==2}">
                                <!-- <template v-if="viewData[k].type==0">
                                    <el-input style="display:none"></el-input>
                                </template> -->

                                <template v-if="viewData[k].type==1">
                                    <template v-if="pagetype==1">
                                        <div style="display:inline-flex;width:100%">
                                            <el-input style="flex:1" v-model.trim="modelData[k]"
                                                :placeholder="viewData[k].placeholder" clearable
                                                v-verify="viewData[k].verify" :disabled="viewData[k].disabled">
                                            </el-input>
                                            <el-select v-model="viewData[k].whereStr" class="whereSelect"
                                                placeholder="包含">
                                                <el-option label="包含" value="like"></el-option>
                                                <el-option label="不包含" value="notlike"></el-option>
                                                <el-option label="等于" value="equal"></el-option>
                                                <!--   <el-option label="不等于" value="unequal"></el-option>-->
                                            </el-select>
                                        </div>
                                    </template>
                                    <template v-if="pagetype==2">
                                        <div style="display: flex;align-items: center;">
                                            <el-input v-model.trim="modelData[k]"
                                                @[viewData[k].elEvent&&viewData[k].elEvent.eventName||null]="handleEventFunc(k,$event)"
                                                :placeholder="viewData[k].placeholder" clearable
                                                v-verify="viewData[k].verify">
                                                <template slot="prepend"
                                                    v-if="viewData[k].prepend">{{viewData[k].prepend}}</template>
                                                <template slot="append"
                                                    v-if="viewData[k].append">{{viewData[k].append}}</template>
                                            </el-input>
                                            <span style="white-space: nowrap;">{{viewData[k].text}}</span>
                                        </div>
                                    </template>
                                </template>

                                <template v-else-if="viewData[k].type==2">
                                    <el-checkbox-group v-model="checkboxMultiple[k]" v-if="checkboxMultiple[k]">
                                        <el-checkbox v-for="(checkitem,checkboxindex) in viewData[k].options"
                                            :label="checkitem.value" :disabled="checkitem.disabled"
                                            :key="checkitem.value">{{checkitem.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </template>

                                <template v-else-if="viewData[k].type==3">
                                    <el-radio v-model="modelData[k]" v-if="viewData[k].all" label="全部">全部</el-radio>
                                    <el-radio v-model="modelData[k]"
                                        v-for="(radioitem,radioIndex) in viewData[k].options"
                                        :style="viewData[k].labelStyle" :label="radioitem.value" :key="radioIndex"
                                        :disabled="radioitem.disabled||computedAttribute(k)"
                                        @[viewData[k].elEvent&&viewData[k].elEvent.eventName||null]="handleEventFunc(k,$event)"
                                        v-show="!analyticPrmTtpe(radioitem.hidden)">
                                        {{analyticPrmTtpe(radioitem.label)}}<span v-if="radioitem.tip"
                                            style="color:red">({{radioitem.tip}})</span></el-radio>
                                    <!-- <explainTooltip :text="viewData[k].expInfo" v-if="viewData[k].expInfo"></explainTooltip> -->
                                    <el-tooltip class="item" effect="light" placement="bottom"
                                        v-if="viewData[k].expInfo">
                                        <div slot="content" style="min-height:36px;width:518px;line-height:18px;"
                                            v-if="k=='yfstdin'">
                                            <strong style="display:block;margin-bottom:4px;">说明:</strong>
                                            单票运价： 指与客户每票谈的特殊报价(单票询价),通常针对客户手上的大货/重货所指定的运价。
                                            <p style="margin:5px 0px">唯凯标准运价： 唯凯指针对所有客户,按起运港和目的港来区分的唯凯标准运价。</p>客户协议运价：
                                            唯凯指针对某个客户,按起运港和目的港来区分的客户协议运价。
                                        </div>
                                        <div slot="content" style="min-height:36px;width:518px;line-height:18px;"
                                            v-if="k=='ispay_pre'">
                                            <strong style="display:block;margin-bottom:4px;">说明:</strong>
                                            如选择"是",该订单需客户支付预付款后,由结算开锁才能继续操作
                                        </div>
                                        <span class="el-icon-info" style="color:#409EFF;font-size:12px;"></span>
                                    </el-tooltip>
                                    <span style="color:red;font-weight:bold;margin-left:10px;"
                                        v-if="k=='ispay_pre'">航班起飞后支付运费不属于预付款</span>
                                </template>

                                <template v-else-if="viewData[k].type==4">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        :filterable="viewData[k].filterable" clearable
                                        @change="formatField(viewData[k].initialField)"
                                        @[viewData[k].elEvent&&viewData[k].elEvent.eventName||null]="handleEventFunc(k,$event)"
                                        default-first-option>
                                        <el-option label="全部" value="全部" v-if="viewData[k].allSelect"></el-option>
                                        <el-option v-for="(selitem,index) in viewData[k].options" :key="index"
                                            :label="selitem.label" :value="selitem.value"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==5">
                                    <el-select v-model="multipleVal[k]" multiple
                                        :placeholder="viewData[k].placeholder||'请选择'" size="mini" clearable>
                                        <li class="el-select-dropdown__item" @click="selmultiAll(k)">
                                            <span>全部</span>
                                        </li>
                                        <el-option v-for="(selMulitem,index) in viewData[k].options" :key="index"
                                            :label="selMulitem.label" :value="selMulitem.value"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==6">
                                    <el-date-picker v-model="modelData[k]" :type="viewData[k].datetype || 'date'"
                                        :value-format="viewData[k].format || 'yyyy-MM-dd'"
                                        :placeholder="viewData[k].placeholder||'选择日期'" :editable="viewData[k].editable"
                                        :picker-options="viewData[k].pickerOptions||setPickerOptions(viewData[k].pickerOptionsType)"
                                        @[viewData[k].elEvent&&viewData[k].elEvent.eventName||null]="handleEventFunc(k,$event)"
                                        clearable :readonly="viewData[k].readonly"></el-date-picker>
                                </template>

                                <template v-else-if="viewData[k].type==7">
                                    <el-date-picker v-model="modelData[k]" type="daterange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期" unlink-panels
                                        :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:ss"
                                        clearable></el-date-picker>
                                </template>

                                <!-- 分泡 -->
                                <template v-else-if="viewData[k].type==9">
                                    <div v-for="inputItem in viewData[k].options"
                                        :style="{'display':'inline-block','width':!viewData[k].input?'160px':viewData[k].input=='1'?'130px':'110px','white-space':'nowrap'}">
                                        <span
                                            style="display:inline-block;width:50px;text-align:right">{{inputItem.title}}</span>
                                        <el-input v-model="modelData[inputItem.id]" type="text"
                                            @change="fpChange(inputItem.id,$event,inputItem.linkage)"
                                            :class="{'input-required':inputItem.required}" style="width:80px;"
                                            v-if="!viewData[k].input||viewData[k].input==1" :id="inputItem.id">
                                        </el-input>
                                        <div :style="viewData[k].style" style="display:inline"
                                            v-if="viewData[k].input=='2'">{{modelData[inputItem.id]}}</div>
                                    </div>
                                </template>

                                <!-- 联动，委托客户11 委托项目10  -->

                                <template v-else-if="viewData[k].type==11">
                                    <pageSelect :pagetype="viewData[k].pagetype||1" :area="orderArea"
                                        :modelval.sync="modelData[k]" @change="getWtkhMsg($event,1,viewData[k].linkage)"
                                        :disabled="computedAttribute(k)" :sytype="viewData[k].sytype"></pageSelect>
                                    <i title="新增委托客户" @click="openNewCompApply"
                                        v-if="viewData[k].openNewCompApply||viewData[k].contentStyle"
                                        class="el-icon-edit-outline"
                                        style="font-size: 20px; color: #30c76c; cursor: pointer; position: relative; top: 4px; margin-left: 7px;"></i>
                                </template>

                                <template v-else-if="viewData[k].type==10">
                                    <!-- {{RelData}} -->
<!--                                     {{wtxmOptions}}
                                    {{computedAttribute(k)&&modelData[k]==-1}} -->
                                    <el-select
                                        :style="{'max-width':viewData[k].showCustomerRel&&viewData[k].isnewadd?'140px':'100%'}"
                                        v-model="computedAttribute(k)&&modelData[k]==-1?'':modelData[k]" filterable
                                        @change="wtdata" @blur="wtxmBlur" :disabled="computedAttribute(k)" ref="wtxm">
                                        <el-option v-for="selitem in wtxmOptions" :key="selitem.id"
                                            :label="selitem.usr_name" :value="selitem.id"></el-option>
                                    </el-select>
                                    <customerRel style="height:28px;margin-left:6px;pointer-events: auto;"
                                        ref="customerRel" v-if="viewData[k].showCustomerRel&&modelData.fid"
                                        :fid="modelData.fid || ''" :gid="modelData.gid || ''"
                                        :immediate="viewData[k].isnewadd" @changeRelData="handleChangeRelData"
                                        :area="orderArea || ''" :relList="modelData.customerRelList">
                                    </customerRel>
                                    <span
                                        v-if="viewData[k].showCustomerRel&&modelData.fid&&RelData.length&&viewData[k].isnewadd"
                                        style="display:inline-flex;min-width:280px;margin-left:6px;background-color: #FFF8EF;align-items: center;border: 1px solid #e8e8e8; padding: 3px;border-radius: 4px;">
                                        <span style="word-break: keep-all;">{{RelData[0]}},{{RelData[1]}}</span>
                                        <a v-if="RelData[2]" :href="'mailto:'+RelData[2]">,{{RelData[2]}}</a>
                                    </span>
                                </template>

                                <template v-else-if="viewData[k].type==12">
                                    <el-date-picker v-model="modelData[k]" type="datetime"
                                        :placeholder="viewData[k].placeholder||'选择日期时间'"
                                        :format="viewData[k].format || 'yyyy-MM-dd HH:mm' "
                                        :value-format="viewData[k].format || 'yyyy-MM-dd HH:mm'"
                                        :disabled="computedAttribute(k)"></el-date-picker>
                                </template>

                                <!-- 查询用委托项目-->
                                <template v-else-if="viewData[k].type==13">
                                    <pageSelect :pagetype="-1" :modelval.sync="modelData[k]" :pagedata="wtxmData"
                                        :area="orderArea" :disabled="computedAttribute(k)"></pageSelect>
                                </template>

                                <template v-else-if="viewData[k].type == 110">
                                    <pageSelect
                                        :pagetype="110"
                                        :modelval.sync="modelData[k]"
                                    ></pageSelect>
                                </template>

                                <template v-else-if="viewData[k].type == 130" >
                                    <pageSelect
                                        :pagetype="13"
                                        :wageinout="1"
                                        :modelval.sync="modelData[k]"
                                        :pagedata="wtxmData"
                                        :area="orderArea"
                                        :disabled="computedAttribute(k)"
                                    ></pageSelect>
                                </template>

                                <!-- 委托客户 -->
                                <template v-else-if="viewData[k].type==14">
                                    <!-- <pageSelect :pagetype="1" :modelval.sync="modelData[k]" @change="getWtkhMsg" :disabled="computedAttribute(k)"></pageSelect> -->
                                    <div style="display:inline-flex">
                                        <pageSelect :pagetype="1" :modelval.sync="modelData[k]"
                                            @change="getWtkhMsg($event,2,viewData[k].linkage)"
                                            :disabled="computedAttribute(k)" :area="orderArea"></pageSelect>
                                        <el-select v-model="viewData[k].whereStr" class="whereSelect" placeholder="包含">
                                            <!--    <el-option label="包含" value="like"></el-option>
                      <el-option label="不包含" value="notlike"></el-option>-->
                                            <el-option label="包含" value="equal"></el-option>
                                            <el-option label="不包含" value="unequal"></el-option>
                                        </el-select>
                                    </div>
                                </template>

                                <template v-else-if="viewData[k].type==15">
                                    <div style="display:flex">
                                        <el-date-picker v-model="modelData[k].begin"
                                            :type="viewData[k].format?'datetime':'date'"
                                            :value-format="viewData[k].format||'yyyy-MM-dd HH:mm:ss'"
                                            :format="viewData[k].format||'yyyy-MM-dd'" placeholder="开始日期"
                                            :editable="viewData[k].editable" class="rangeDate" v-if="modelData[k]"
                                            clearable :picker-options="viewData[k].pickerOptions"></el-date-picker>
                                        <span style="color:#666;padding-top:3px;">至</span>
                                        <el-date-picker v-model="modelData[k].end"
                                            :type="viewData[k].format?'datetime':'date'"
                                            :value-format="viewData[k].format||'yyyy-MM-dd'"
                                            :format="viewData[k].format||'yyyy-MM-dd'" placeholder="结束日期"
                                            :editable="viewData[k].editable"
                                            :default-time="viewData[k].format?'23:59:59':''" class="rangeDate"
                                            v-if="modelData[k]" clearable :picker-options="viewData[k].pickerOptions">
                                        </el-date-picker>
                                    </div>
                                </template>

                                <!-- 特殊 -->
                                <!-- 贸易方式 -->
                                <template v-else-if="viewData[k].type==16">
                                    <div v-for="(radioitem,radioIndex) in viewData[k].options" style="margin-top:5px">
                                        <span
                                            style="min-width:120px;margin-left:12px;display:inline-block;font-size:14px;">{{radioitem.title}}</span>
                                        <span style="display:inline-block;min-width:550px">
                                            <el-radio v-model="modelData[k]"
                                                v-for="(radioitem2,radioIndex2) in radioitem.detailS"
                                                :label="radioitem2" :key="radioIndex2"
                                                :style="{'min-width':viewData[k].minW+'px'}">{{radioitem2}}</el-radio>
                                        </span>
                                        <span style="color:red;font-size:14px"
                                            v-if="projectIsWecan&&radioIndex==0&&modelData[k]&&projectIsWecan&&(['CIF','C&F','DDP','DAP','DAT'].includes(modelData[k]))">{{`选择${modelData[k]}不会进入海外D/N账单流程!`}}</span>
                                        <span style="color:red;font-size:14px"
                                            v-if="projectIsWecan&&radioIndex==1&&modelData[k]&&projectIsWecan&&(['FOB','FCA','EXW'].includes(modelData[k]))">{{`选择${modelData[k]}会进入海外D/N账单流程!`}}</span>
                                    </div>
                                </template>

                                <template v-else-if="viewData[k].type==17">
                                    <el-input type="textarea" v-model="modelData[k]" :disabled="computedAttribute(k)"
                                        v-verify="viewData[k].verify" :rows="viewData[k].rows||2"></el-input>
                                </template>

                                <template v-else-if="viewData[k].type==18">
                                    <div :style="viewData[k].style" class="type18content"
                                        style="text-indent:8px;line-height: 28px;" :disabled="computedAttribute(k)">
                                        {{modelData[k]}}</div>
                                </template>

                                <template v-else-if="viewData[k].type==20">
                                    <pageSelect :pagetype="viewData[k].pagetype" :modelval.sync="modelData[k]"
                                        :disabled="computedAttribute(k)" :viewdata="viewData[k].viewdata"
                                        :servicecode="viewData[k].servicecode" :area="orderArea"
                                        :wageinout="viewData[k].wageinout"></pageSelect>
                                </template>

                                <template v-else-if="viewData[k].type==21">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="selitem in viewData[k].options" :key="selitem.value"
                                            :label="selitem.label" :value="selitem.value"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==22">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="selitem in hwlxOptions" :key="selitem.value"
                                            :label="selitem.label" :value="selitem.value"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==23">
                                    <el-select v-model="multipleVal[k]" multiple
                                        :placeholder="viewData[k].placeholder||'请选择'" clearable>
                                        <el-option-group v-for="group in viewData[k].options" :key="group.label"
                                            :label="group.label">
                                            <el-option v-for="item in group.options" :key="item.value"
                                                :label="item.label" :value="item.value"></el-option>
                                        </el-option-group>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==24">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="(selitem,index) in viewData[k].options" :key="index"
                                            :label="selitem.label" :value="selitem.value"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==25">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="item in getStoreArr(viewData[k].linkage)" :key="item"
                                            :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==26">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="item in getFlowAreaArr(viewData[k].linkage)" :key="item"
                                            :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==27">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="item in getMateriaArr(viewData[k].linkage)" :key="item"
                                            :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==28">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="item in getGyArr(viewData[k].linkage)" :key="item"
                                            :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==29">
                                    <el-time-picker v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable value-format="HH:mm" format="HH:mm"></el-time-picker>
                                </template>

                                <template v-else-if="viewData[k].type==30">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option-group v-for="group in viewData[k].options" :key="group.label"
                                            :label="group.label">
                                            <el-option v-for="item in group.options" :key="item.value"
                                                :label="item.label" :value="item.value"
                                                :disabled="orderArea==item.value"></el-option>
                                        </el-option-group>
                                    </el-select>
                                </template>

                                <template v-else-if="viewData[k].type==31">
                                    <el-select v-model="modelData[k]" :placeholder="viewData[k].placeholder||'请选择'"
                                        clearable>
                                        <el-option v-for="item in getGbzArr(viewData[k].linkage)" :key="item"
                                            :label="item" :value="item"></el-option>
                                    </el-select>
                                </template>

                                <!-- 吃泡比例 -->
                                <template v-else-if="viewData[k].type==32">
                                    <el-input v-model="modelData[k]" v-verify="'fixedTwo'" clearable>
                                        <span slot="suffix" style="margin-right:2px;">%</span>
                                    </el-input>
                                </template>

                                <!-- 输入带建议 -->
                                <template v-else-if="viewData[k].type==33">
                                    <el-autocomplete class="inline-input" v-model="modelData[k]"
                                        :fetch-suggestions="querySearch" :placeholder="viewData[k].placeholder||'请输入内容'"
                                        @select="handleSelect" hide-loading clearable @focus="autocompleteFocus(k)">
                                    </el-autocomplete>
                                </template>

                                <!-- 起飞时间 -->
                                <template v-else-if="viewData[k].type==34">
                                    <div style="height:28px;display:flex;align-items:center">
                                        <span style="width:125px">{{modelData[k] | formatDate('hh:mm') }}</span>
                                        <i class="el-icon-edit-outline" @click="qfsjDialogFunc" title="航班维护"
                                            style="font-size:20px;color:#30C76C;cursor:pointer"></i>
                                        <i title="刷新" class="el-icon-refresh" @click="getQfsj"
                                            style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:12px;"></i>
                                    </div>
                                </template>

                                <template v-else-if="viewData[k].type==35">
                                    <div v-if="modelData.isinwageallin==4" class="inwageal" style="display:flex;">
                                        <span style="border-top-left-radius:5px;border-bottom-left-radius:5px"
                                            class="numspan" @click="$emit('inwageallinpriceFunc',-2)">-2</span>
                                        <span class="numspan" @click="$emit('inwageallinpriceFunc',-1)">-1</span>
                                        <el-input style="width:90px;" v-model="modelData[viewData[k].realBindField]"
                                            v-verify="'fixedTwo'"></el-input>
                                        <span class="numspan" @click="$emit('inwageallinpriceFunc',1)">+1</span>
                                        <span
                                            style="border-right:1px solid #DCDFE6;border-top-right-radius:5px;border-bottom-right-radius:5px"
                                            @click="$emit('inwageallinpriceFunc',2)" class="numspan">+2</span>
                                    </div>
                                    <div v-if="modelData.isinwageallin!=4"
                                        :class="{'input-required':viewData[k].isnewadd}">
                                        <el-input :style="{width:viewData[k].isnewadd?'160px':'178px'}"
                                            v-model="modelData[k]" v-verify="'fixedTwo'">
                                            <template slot="append" v-if="viewData[k].isnewadd">/KG</template>
                                        </el-input>
                                    </div>
                                </template>

                                <template v-else-if="viewData[k].type==36">
                                    <div>
                                        <el-input v-model="modelData[k]" style="width:270px;"></el-input>
                                    </div>
                                    <div>(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
                                </template>

                                <template v-else-if="viewData[k].type==37">
                                    <area-select :model.sync="modelData[k]" :pagetype="viewData[k].pagetype"
                                        :required="viewData[k].required" :disabled="computedAttribute(k)"
                                        :placeholder="viewData[k].placeholder" :multiple="viewData[k].multiple"
                                        :usedarea="viewData[k].usedarea" :valuetype="viewData[k].valuetype"
                                        :alone="viewData[k].alone">
                                    </area-select>
                                </template>

                                <template v-else-if="viewData[k].type==38">
                                    <new-form-cmpt class="inputGroup" :required.sync="inputGroupRequired[k]"
                                        :model-data="modelData" :view-data="viewData[k].inputgroups" :pagetype="2">
                                    </new-form-cmpt>
                                </template>

                                <template v-else-if="viewData[k].type==39">
                                    <div
                                        style="display:grid;grid-template-columns:1fr 2fr;gap:8px;place-items: center;">
                                        <el-cascader v-model="modelData.address_fix" :props="{ expandTrigger: 'hover' }"
                                            :options="addressOptions" class="input-required" clearable>
                                        </el-cascader>
                                        <el-input v-model="modelData.address_detail"
                                            :placeholder="viewData[k].placeholder||'详细地址'" class="input-required">
                                        </el-input>
                                    </div>

                                </template>

                                <template v-else>
                                    <slot :name="k" :data="modelData[k]"></slot>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-else :style="{order:index}" class="seizeSeat" :key="k">
                        <span
                            style="width:290px;min-width:290px;margin-bottom:12px;display:flex;margin-right:30px;justify-content:space-between;"></span>
                    </div>
                    <!-- 如果设置了occupyRestSpace -->
                    <!-- <div :style="[{order:viewData[k].order>=0?viewData[k].order:index},viewData[k].idStyle,{display:viewData[k].hidden?'none':''}]" v-if="viewData[k].occupyRestSpace" style="width:100%"></div> -->
                    <div :style="[{order:viewData[k].order>=0?viewData[k].order:index},{display:viewData[k].hidden?'none':''}]"
                        v-if="analyticPrmTtpe(viewData[k].occupyRestSpace)" style="width:100%"></div>
                </template>

                <!-- :style="{order:Object.keys(viewData).length}" 在外面slot 上加样式，里面加无效 -->
                <slot name="exForm" ref="exform"></slot>
            </div>
        </el-collapse-transition>
        <div v-if="!exForm&&pagetype==1&&name" style="border-top:1px solid #e8e8e8;" v-show="whereTmpShow">
            <!-- <el-button @click="setPageshow=!setPageshow"  style="float:right;margin-top:12px;">↕</el-button> -->
            <span class="spanSlide" :class="[setPageshow?'slideOff':'slideOn']" @click="setPageshow=!setPageshow"
                :title="[setPageshow?'隐藏条件':'更多条件']"></span>
            <formFieldConfig :name="name" style="float:right;margin-top:14px;margin-right: 5px;"
                :formFieldArr.sync="formFieldArr" :allViewData="allViewData" :allViewData2="allViewData2"
                :allViewData3="allViewData3" :viewData="viewData" :basicField="getBasicField()"
                v-show="formFieldConfig"></formFieldConfig>
        </div>

        <el-dialog :visible.sync="qfsjDialog" width="1300px" top="4%" v-if="qfsjDialog" :close-on-press-escape="false"
            append-to-body>
            <iframe :src="qfsjUrl" frameborder="0" allowtransparency="true"
                style="width: 100%; height:700px; border: 0px none;"></iframe>
        </el-dialog>

    </div>
</template>

<script>
    //属性：   
    //要能控制一行的宽度与里面内容占父级的宽度 隐藏过多的条件
    //标题title ;
    //隐藏显示hidden,是否必填 required,是否禁用 disabled；  1,布尔值  2,传方法，类似于直接绑定了一个计算属性 this.goodsinfoView.sfg.hidden = () => { return this.inputModelData.ybvolume > 4 } 或者配置 hidden: () => { return this.inputModelData.shipaceInfo.qcts>3 },
    // 样式style 对象形式(itemStyle,titleStyle,contentStyle) 
    // 查询符号 whereStr(like模糊查询,in多选)   类型type   groupid
    //  class,verify placeholder 
    // 日期format:"yyyy-MM-dd HH:mm"  order 排序
    //bindLabel bindValue 作为gorupid生成选项绑定的label和value字段名
    //linkage:绑定与它关联的字段
    //hideLabel不显示的数组  hideLabel:['航线驳回'] options选项中不显示的
    //occupyRestSpace 占据当前行的剩余空间   occupyAline 是否完全占据当前行，如果是true，idstyle和itemstyle都是100%
    //alertTitle 用于显示title与提示必填title不同的时候的提示标题 

    //类型：type 
    // 1简单输入框 2.多选 3单选 default 默认选项  
    //4下拉  dom状态类下拉匹配名称   system匹配系统  可选‘空出’ ‘联运’ ‘报关’，不传默认为空出
    //5下拉多选 6单日期 7.双日期联动 8操作要求 9分泡 嵌套输入框  10委托项目  11委托客户（10,11联动的详细页使用,linkage 关联的字段id）
    //12完整时间(时分秒) 13委托项目  14委托客户（13,14查询表单中使用）
    // 15双日期 begin end独立选择日期  defaultVal是否有默认值（目前默认开始当天，结束第第二天）
    // 16贸易方式  17纯textarea 18直接显示数据 19插入新的表单组件
    //20 组合框 pagetype 类型值
    //21 货物性质 22货物类型
    //23 groupid 101 多选，下拉分组多选
    //24 入库区域
    //25入库地址
    //26流向区域，根据流向点取值
    //27材料规格,根据材料品名取值
    //28挂衣规格,根据挂衣类型取值 29 时分选择 起飞时间  30介入区域
    //31改包装类型,根据改包装方式取值
    //32吃泡比例  33输入带建议
    //34起飞时间 35 cost+ 36 航线操作中的accountweightout accountweightin 37地域站点选择
    //38 输入框组
    // goodsjzt: {
    //   title: '货物件重体',
    //   type: 38,
    //   disabled: true,
    //   idStyle: { width: '560px' },
    //   itemStyle: { width: '100%' },
    //   inputgroups: {
    //     goodsybpiece: {
    //       title: "件",
    //       type: 1,
    //       verify: "integer"
    //     },
    //     goodsybweight: {
    //       title: "重",
    //       type: 1,
    //       verify: "fixedTwo"
    //     },
    //     goodsybvolume: {
    //       title: "体",
    //       type: 1,
    //       verify: "fixedThree"
    //     },
    //   }
    // },
    import {
        formatDate
    } from "../../api/tools.js";
    import {
        getMomentDate
    } from "../../api/localStorage.js";
    import formFieldConfig from "./formFieldConfig.vue";
    import customerRel from "./customerRel";

    export default {
        props: {
            //生成表单
            viewData: {
                type: Object,
                default() {
                    return {};
                }
            },
            // 基础查询条件字段，第一个数组为固定显示的查询条件，第二个数组为可配置的查询条件，默认将viewData里的字段设为可配置项
            viewDataBasicField: {
                type: Array,
                default() {
                    return [
                        [],
                        Object.keys(this.viewData)
                    ];
                }
            },
            name: {//路由组件名
                type: String,
                default: ""
            },
            system: String, //系统，空出，空进等
            modelData: {
                //绑定数据
                type: Object,
                default() {
                    return {};
                }
            },
            searchData: {
                //组合查询数据
                type: Object,
                default() {
                    return {};
                }
            },
            chineseWhere: {
                //导出excel中需使用的中文条件
                type: Array,
                default() {
                    return [];
                }
            },
            pageshow: {
                //显示隐藏表单
                type: Boolean,
                default: true
            },
            exForm: {
                //是否是插入的表单
                type: Boolean,
                default: false
            },
            whereTmpShow: {
                //是否显示查询模板和更多条件
                type: Boolean,
                default: true
            },
            formFieldConfig: {
                //是否显示查询模板
                type: Boolean,
                default: true
            },
            pagetype: {
                //表单类型 1 查询页面 2.内容页面
                type: [Number, String],
                default: 2
            },
            sfgfpmsv: String,
            area: String,//地域
            required: {
                type: String, //必填,返回空说明没有未填的必填选项
                default: ""
            },
            isAddPage: {//是否是外网新增页面
                type: Boolean,
                default: false
            },
            isOrderAdd: { //是否订单新增
                type: Boolean,
                default: false,
            }
        },
        components: {
            formFieldConfig,
            customerRel
        },
        data() {
            let hwlx = [
                ...new Set(
                    JSON.parse(localStorage.getItem("groupTypeCode"))[109].map(
                        i => i.typename
                    )
                )
            ].map(i => {
                return {
                    label: i,
                    value: i
                };
            });
            return {
                checkboxMultiple: {},//代理type2的多选数据
                multipleVal: {}, //代理type5的多选数据
                setPageshow: true,
                autocompleteField: "", //当前输入焦点所在的输入建议组件的字段
                wtxmData: [], //查询表单中的
                hwlxOptions: [],
                wtxmOptions: [], //新增中的
                wtkhRowdata: {},
                wtxmRowdata: {},
                addressOptions:[],
                qfsjsid: '',
                qfsjDialog: false,
                qfsjUrl: '',
                inputGroupRequired: {},//type 38 组合框是否有必填选项未填
                allViewData: {
                    // 出口业务层
                    // fieldtype:3 订单类
                    // items: { title: "服务项目", type: 20, pagetype: 5, fieldtype: 3 },
                    packageType: {
                        title: "散货托盘",
                        type: 5,
                        groupid: 1480,
                        bindValue: "typename",
                        fieldtype: 4,
                        whereStr: "in",
                    },
                    weight: {
                        title: "重量等级参数",
                        type: 5,
                        groupid: 1481,
                        bindValue: "typename",
                        fieldtype: 4,
                        whereStr: "in",
                    },
                    volRatio: {
                        title: "货型等级参数",
                        type: 5,
                        groupid: 1482,
                        bindValue: "typename",
                        fieldtype: 4,
                        whereStr: "in",
                    },
                    cusLevel: {
                        title: "客户等级",
                        type: 5,
                        groupid: 1483,
                        bindValue: "typename",
                        fieldtype: 4,
                        whereStr: "in",
                    },
                    validityDate: {
                        title: "有效期",
                        type: 15,
                        defaultVal: true,
                        fieldtype: 2,
                        businesstype: 1,
                    },
                    czlx: {
                        title: "操作类型",
                        type: 5,
                        options: [],
                        fieldtype: 3,
                        groupid: 132,
                        whereStr: "in"
                    },

                    hbh: {
                        title: "航班号",
                        type: 1,
                        whereStr: "like",
                        //  verify: "uppercase",
                        fieldtype: 3
                    },
                    real_hbh: {
                        title: "航班号",
                        type: 1,
                        whereStr: "like",
                        // verify: "uppercase",
                        fieldtype: 3
                    },
                    yqhbh: {
                        title: "要求航班号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    yqqcts: {
                        title: "要求全程天数",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    ybjzt: {
                        title: "预报件重体",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    sjjzt: {
                        title: "实际件重体",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    dzjzt: {
                        title: "制单件重体",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },

                    sfg: {
                        title: "始发港",
                        type: 1,
                        fieldtype: 3
                    },
                    mdg: {
                        title: "目的港",
                        type: 1,
                        fieldtype: 3
                    },
                     jg: {
                        title: "目的港",
                        type: 1,
                        fieldtype: 3,
                    },
                    ddg: {
                        title: "到达港",
                        type: 1,
                        fieldtype: 3,
                    },
                    twocode: { title: "航空公司", type: 110, whereStr: "like", fieldtype: 3,options:[] },
                    mawbmdg: {
                        title: "目的港",
                        type: 1,
                        whereStr: "like",
                        // verify: "uppercase",
                        fieldtype: 3
                    },
                    hwxz: {
                        title: "货物性质",
                        type: 5,
                        groupid: 115,
                        fieldtype: 3,
                        whereStr: "in"
                    },
                    hwlx: {
                        title: "货物类型",
                        type: 5,
                        options: hwlx,
                        fieldtype: 3,
                        whereStr: "in"
                    },
                    comhy: {
                        title: "所属行业",
                        type: 5,
                        whereStr: "in",
                        groupid: 89,
                        fieldtype: 3
                    },
                    accountweightin: {
                        title: "结算重量（应收）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    accountweightout: {
                        title: "结算重量（应付）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    chinesepm: {
                        title: "中文品名",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    englishpm: {
                        title: "英文品名",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    batterymode: {
                        title: "锂电池型号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    hawbnum: {
                        title: "分运单票数",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    loadingmodel: {
                        title: "配载方式",
                        type: 5,
                        groupid: 37,
                        fieldtype: 3,
                        whereStr: "in"
                    },
                    terminalname: {
                        title: "交接地",
                        type: 5,
                        groupid: 20,
                        fieldtype: 3,
                        bindValue: "typename",
                        whereStr: "in"
                    },
                    realqcts: {
                        title: "实际全程天数",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    islocal: {
                        title: "是否设置本站操作",
                        options: [{
                            value: "1",
                            label: "是"
                        },
                        {
                            value: "2",
                            label: "否"
                        }
                        ],
                        type: 4,
                        titleStyle: {
                            minWidth: "135px"
                        },
                        fieldtype: 3
                    },
                    canceling: {
                        title: "是否撤单中",
                        options: [{
                            value: "0,4",
                            label: "否"
                        },
                        {
                            value: "1,2",
                            label: "是"
                        }
                        ],
                        type: 4,
                        whereStr: 'in',
                        titleStyle: {
                            minWidth: "135px"
                        },
                        fieldtype: 3
                    },
                    comboine: {
                        title: "是否可拼",
                        options: [{
                            value: "1",
                            label: "可拼"
                        },
                        {
                            value: "2",
                            label: "不可拼"
                        }
                        ],
                        type: 4,
                        fieldtype: 3
                    },
                    iscomboine: {
                        title: "是否已拼",
                        options: [{
                            value: "1",
                            label: "已拼"
                        },
                        {
                            value: "2",
                            label: "未拼"
                        }
                        ],
                        type: 4,
                        fieldtype: 3
                    },
                    gysname: {
                        title: "运单供应商",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    boardgysname: {
                        title: "外场供应商",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    isboardgys: {
                        title: "是否存在外场供应商",
                        options: [{
                            value: "1",
                            label: "存在"
                        },
                        {
                            value: "2",
                            label: "不存在"
                        }
                        ],
                        type: 4,
                        titleStyle: {
                            minWidth: "135px"
                        },
                        fieldtype: 3
                    },
                    mawbss: {
                        title: "运单所属",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    /*
                    address_thr: {
                      title: "提货地",
                      type: 1,
                      whereStr: "like",
                      fieldtype: 3
                    },
                    address_shr: {
                      title: "送货地",
                      type: 1,
                      whereStr: "like",
                      fieldtype: 3
                    },
                    assignarea: {
                      title: "操作地",
                      type: 23,
                      whereStr: "in",
                      groupid: 101,
                      fieldtype: 3
                    },
                    */
                    areaname: {
                        title: "航线分区",
                        type: 5,
                        whereStr: "in",
                        options: [{
                            label: "南美航线",
                            value: "2"
                        },
                        {
                            label: "欧洲航线",
                            value: "3"
                        },
                        {
                            label: "亚洲航线",
                            value: "4"
                        },
                        {
                            label: "北美航线",
                            value: "7"
                        },
                        {
                            label: "非洲航线",
                            value: "8"
                        },
                        {
                            label: "澳洲航线",
                            value: "9"
                        },
                        {
                            label: "印巴中东航线",
                            value: "10"
                        }
                        ],
                        fieldtype: 3
                    },
                    /*
                    bglx: {
                      title: "报关类型",
                      type: 5,
                      groupid: 19,
                      whereStr: "in",
                      fieldtype: 3
                    },
                    */
                    kcremark: {
                        title: "空出备注",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3
                    },
                    //thremark: { title: "提货备注", type: 1, whereStr: "like", fieldtype: 3 },

                    realjjdname: {
                        title: "交接地",
                        type: 5,
                        whereStr: "in",
                        options: [{
                            label: "1期货站",
                            value: "1期货站"
                        },
                        {
                            label: "2期货站",
                            value: "2期货站"
                        },
                        {
                            label: "3期货站",
                            value: "3期货站"
                        }
                        ],
                        fieldtype: 3
                    },
                    isexportform: {
                        title: "发送平台",
                        type: 5,
                        groupid: 86,
                        whereStr: "in"
                    },
                    servicecodehwcz: {
                        title: "货物操作",
                        type: 5,
                        groupid: 48,
                        fieldtype: 3,
                        whereStr: "in"
                    },
                    ybkhjcno: {
                        title: "预报进仓编号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "135px"
                        }
                    },
                    // fieldtype:1 单号类
                    mawb: {
                        title: "总运单号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    hawb: {
                        title: "分运单号",
                        type: 1,
                        fieldtype: 1
                    },
                    pzno: {
                        title: "凭证号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    pchno: {
                        title: "对账批次号",
                        whereStr: "like",
                        type: 1,
                        fieldtype: 1
                    },
                    billno: {
                        title: "对账批次号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    mainorder: {
                        title: "主营订舱编号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    orderdom: {
                        title: "制单类型",
                        type: 4,
                        options: [{
                            label: "总单",
                            value: "总单"
                        },
                        {
                            label: "直单",
                            value: "直单"
                        }
                        ],
                        fieldtype: 1
                    },
                    SPECIAL: {
                        title: "SPECIAL",
                        type: 4,
                        groupid: 147,
                        whereStr: "like",
                        fieldtype: 1
                    },

                    // fieldtype:4 操作类
                    modifyman: {
                        title: "修改人",
                        type: 1,
                        fieldtype: 4
                    },
                    pactlsender: {
                        title: "发送人",
                        type: 1,
                        fieldtype: 4,
                        titleStyle: {
                            width: "110px"
                        }
                    },
                    sendman: {
                        title: "发送人(AMS)",
                        type: 1,
                        fieldtype: 4,
                        titleStyle: {
                            width: "110px"
                        }
                    },
                    signman: {
                        title: "签单人",
                        type: 1,
                        fieldtype: 4
                    },
                    applysignman: {
                        title: "签单申请人",
                        type: 1,
                        fieldtype: 4
                    },
                    orderconfirmman: {
                        title: "上榜确认人",
                        type: 1,
                        fieldtype: 4
                    },
                    setshipaceman: {
                        title: "配舱人",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 4
                    },
                    accountinfo: {
                        title: "Accountinginfo",
                        type: 1,
                        titleStyle: {
                            minWidth: "120px"
                        },
                        whereStr: "like",
                        fieldtype: 4
                    },
                    mawbnoconfirmman: {
                        title: "总单号确认人",
                        type: 1,
                        titleStyle: {
                            minWidth: "110px"
                        },
                        whereStr: "like",
                        fieldtype: 4
                    },

                    // fieldtype:5 状态类
                    pcstatus: {
                        title: "配舱状态",
                        type: 5,
                        dom: "配舱状态",
                        whereStr: "in",
                        fieldtype: 5
                    },
                    hwstatus: {
                        title: "货物状态",
                        type: 5,
                        dom: "货物状态",
                        whereStr: "in",
                        fieldtype: 5
                    },
                    dzstatus: {
                        title: "单证状态",
                        type: 5,
                        dom: "单证状态",
                        system: "空出",
                        whereStr: "in",
                        fieldtype: 5
                    },
                    bgstatus: {
                        title: "报关状态",
                        type: 5,
                        dom: "报关状态",
                        whereStr: "in",
                        fieldtype: 5
                    },
                    sendstatus: {
                        title: "AMS总单发送状态",
                        type: 5,
                        groupid: 146,
                        whereStr: "in",
                        fieldtype: 5
                    },
                    hawbsendstatus: {
                        title: "AMS分单发送状态",
                        type: 5,
                        groupid: 146,
                        whereStr: "in",
                        fieldtype: 5
                    },
                    safetystatus: {
                        title: "安全声明打印状态",
                        type: 4,
                        options: [{
                            label: "已打印",
                            value: "1"
                        },
                        {
                            label: "未打印",
                            value: "2"
                        }
                        ],
                        fieldtype: 5
                    },
                    cargostatus: {
                        title: "Cargo Pouch打印状态",
                        type: 4,
                        titleStyle: {
                            minWidth: "155px"
                        },
                        options: [{
                            label: "已打印",
                            value: "1"
                        },
                        {
                            label: "未打印",
                            value: "2"
                        }
                        ],
                        fieldtype: 5
                    },
                    customstatus: {
                        title: "海关联系单状态",
                        type: 5,
                        groupid: 148,
                        whereStr: "in",
                        fieldtype: 5
                    },
                    verificationstatus: {
                        title: "异常状态",
                        type: 5,
                        options: [{
                            label: "无异常",
                            value: "1"
                        },
                        {
                            label: "异常",
                            value: "2"
                        }
                        ],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    commbillmodifystatus: {
                        title: "签单待修改状态",
                        type: 5,
                        groupid: 159,
                        whereStr: "in",
                        fieldtype: 5
                    },
                    trackstatus: {
                        title: "装车指令",
                        type: 4,
                        options: [{
                            label: "不可装车",
                            value: "1"
                        },
                        {
                            label: "可装车",
                            value: "2"
                        },
                        {
                            label: "已装车",
                            value: "3"
                        }
                        ],
                        //whereStr: "in",
                        fieldtype: 5
                    },
                    isfinished: {
                        title: "总单制作",
                        type: 4,
                        options: [{
                            label: "已制单",
                            value: 1
                        },
                        {
                            label: "未制单",
                            value: 2
                        }
                        ]
                    },
                    isfinished_hawb: {
                        title: "分单制作",
                        type: 4,
                        options: [{
                            label: "已制单",
                            value: 1
                        },
                        {
                            label: "未制单",
                            value: 2
                        }
                        ]
                    },
                    pactlsendstatus: {
                        title: "预审发送状态",
                        type: 5,
                        whereStr: "in",
                        options: [{
                            label: "已忽略",
                            value: "-1"
                        },
                        {
                            label: "未发送",
                            value: "0"
                        },
                        {
                            label: "已发送",
                            value: "1"
                        },
                        {
                            label: "发送失败",
                            value: "2"
                        },
                        {
                            label: "已二次修改",
                            value: "5"
                        },
                        {
                            label: "虚拟发送",
                            value: "10"
                        }
                        ],
                        fieldtype: 5
                    },
                    isclock: {
                        title: "C类锁定状态",
                        type: 5,
                        groupid: 210,
                        whereStr: "in",
                        bindLabel: 'ready01',
                        bindValue: 'ready02',
                        fieldtype: 5
                    },
                    mawbconfirmstatus: {
                        title: "总单确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },
                    hawbconfirmstatus: {
                        title: "分单确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },
                    dzconfirmstatus: {
                        title: "单证确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },
                    mawbnoconfirmstatus: {
                        title: "总单号确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },
                    hawbnoconfirmstatus: {
                        title: "分单号确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },
                    noconfirmstatus: {
                        title: "单号确认状态",
                        type: 5,
                        groupid: 195,
                        whereStr: "in"
                    },

                    // fieldtype:6 日期类
                    modifydate: {
                        title: "修改日期",
                        type: 15,
                        fieldtype: 6
                    },
                    hbrq: {
                        title: "航班日期",
                        type: 15,
                        fieldtype: 6,
                        defaultVal: true
                    },
                    real_hbrq: {
                        title: "航班日期",
                        type: 15,
                        fieldtype: 6
                    },
                    yqhbrq: {
                        title: "要求航班日期",
                        type: 15,
                        fieldtype: 6,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    deliverydate: {
                        title: "货好日期",
                        type: 15,
                        fieldtype: 6
                    },
                    //yqpickupdate: { title: "完成时间", type: 15, fieldtype: 6 },
                    //yqfinishdate: { title: "提货时间", type: 15, fieldtype: 6 },
                    pactlsenddate: {
                        title: "预审发送日期",
                        type: 15,
                        fieldtype: 6
                    },
                    setshipacedate: {
                        title: "配舱日期",
                        type: 15,
                        fieldtype: 6
                    },
                    mawbnoconfirmdate: {
                        title: "总单号确认时间",
                        titleStyle: {
                            minWidth: "110px"
                        },
                        type: 15,
                        fieldtype: 6
                    },
                    trundate: {
                        title: "可交付时间",
                        type: 15,
                        fieldtype: 6
                    },

                    // fieldtype:2 费用类
                    freightfee_in: {
                        title: "运费（应收）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2
                    },
                    freightfee_out: {
                        title: "运费（应付）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2
                    },
                    isinwageallin: {
                        title: "运费类型（应收）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    isoutwageallin: {
                        title: "运费类型（应付）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    fpbl_in: {
                        title: "分泡比例（应收）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    fpbl_out: {
                        title: "分泡比例（应付）",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    }
                },

                allViewData2: {
                    // 国内业务层
                    // 基本信息
                    fieldtype17: {
                        //fid: { title: "委托客户", type: 14, pagetype: "1", fieldtype: 17 },
                        //gid: { title: "项目", type: 13, pagetype: "2", fieldtype: 17 },
                        mawb: {
                            title: "总运单号",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 17
                        },
                        hawb: {
                            title: "分运单号",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 17
                        },
                        khjcno: {
                            title: "进仓编号",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 17
                        },
                        sfg: {
                            title: "始发港",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 17
                        },
                        mdg: {
                            title: "目的港",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 17
                        },
                        bindboae: {
                            title: "是否绑定主营",
                            type: 4,
                            options: [{
                                label: "是",
                                value: "1"
                            },
                            {
                                label: "否",
                                value: "2"
                            }
                            ],
                            fieldtype: 17
                        },
                        serviceitemsname: {
                            title: '服务类别',
                            whereStr: 'in',
                            type: 20,
                            pagetype: 11,
                            viewdata: [{
                                title: 'servicename',
                                field: 'servicename'
                            },
                            {
                                title: '服务类别',
                                field: 'servicename'
                            }
                            ],
                            fieldtype: 17
                        }
                    },
                    // 入仓
                    fieldtype1: {},
                    // 提货
                    fieldtype2: {
                        address_thr_org: {
                            title: "提货人地址",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        },
                        lxr_thr_org: {
                            title: "提货人联系人",
                            type: 1,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            whereStr: "like",
                            fieldtype: 2
                        },
                        phone_thr_org: {
                            title: "提货人电话",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        },
                        address_shr_org: {
                            title: "送货人地址",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        },
                        lxr_shr_org: {
                            title: "送货人联系人",
                            type: 1,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            whereStr: "like",
                            fieldtype: 2
                        },
                        phone_shr_org: {
                            title: "送货人电话",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        },
                        pickupdate_org: {
                            title: "提货时间",
                            type: 15,
                            fieldtype: 2
                        },
                        yqfinishdate_org: {
                            title: "要求完成时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 2
                        },
                        truckgid: {
                            title: "卡车供应商",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        },
                        remark: {
                            title: "提货备注",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 2
                        }
                    },
                    // 报关
                    fieldtype3: {
                        bggys: {
                            title: "报关供应商",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 3
                        }
                    },
                    // 制作总单
                    fieldtype4: {},
                    // 制作分单
                    fieldtype5: {},
                    // 制作Manifest
                    fieldtype6: {},
                    // 制作总标签
                    fieldtype7: {},
                    // 制作分标签
                    fieldtype8: {},
                    // 安检
                    fieldtype9: {},
                    // 交单
                    fieldtype10: {},
                    // 快递
                    fieldtype11: {
                        servicecontent_deli: {
                            title: "快递内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 11
                        },
                        yqdate_deli: {
                            title: "快递要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 11
                        },
                        courienum_deli: {
                            title: "快递单号",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 11
                        },
                        destinat_deli: {
                            title: "目的地",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 11
                        },
                        relshr_deli: {
                            title: "收件人",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 11
                        },
                        receiver: {
                            title: "订单接收人",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 11
                        }
                    },
                    // 磁检
                    fieldtype12: {
                        servicecontent_inspect: {
                            title: "磁检内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 12
                        },
                        yqdate_inspect: {
                            title: "磁检要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 12
                        },
                        // bzlx_inspect: { title: "包装类型", type: 1, whereStr: "like", fieldtype: 12 },
                        bzlx_inspect: {
                            title: "包装类型",
                            type: 4,
                            groupid: 31,
                            fieldtype: 12
                        },
                        //chinesepm_inspect: { title: "中文品名", type: 1, whereStr: "like", fieldtype: 12 },
                        appraisal_inspect: {
                            title: "磁检鉴定机构",
                            type: 4,
                            groupid: 106,
                            bindLabel: "ready01",
                            fieldtype: 14
                        }
                    },
                    // 改包装
                    fieldtype13: {
                        servicecontent_pack: {
                            title: "改包装内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 13
                        },
                        yqdate_pack: {
                            title: "改包装服务时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "104px"
                            },
                            fieldtype: 13
                        }
                    },
                    // 化工鉴定
                    fieldtype14: {
                        servicecontent_chem: {
                            title: "化工内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 14
                        },
                        yqdate_chem: {
                            title: "化工要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 14
                        },
                        // appraisaltype_chem: { title: "鉴定类型", type: 1, whereStr: "like", fieldtype: 14 },
                        appraisaltype_chem: {
                            title: "鉴定类型",
                            type: 4,
                            groupid: 143,
                            contentStyle: {
                                display: "flex"
                            },
                            bindValue: "typename",
                            fieldtype: 14
                        },
                        // bzlx_chem: { title: "包装类型", type: 1, whereStr: "like", fieldtype: 14 },
                        bzlx_chem: {
                            title: "包装类型",
                            type: 4,
                            groupid: 31,
                            fieldtype: 14
                        },
                        // store_chem: { title: "仓库", type: 1, whereStr: "like", fieldtype: 14 },
                        store_chem: {
                            title: "仓库",
                            type: 25,
                            linkage: "",
                            fieldtype: 14
                        },
                        // appraisal_chem: { title: "鉴定机构", type: 1, whereStr: "like", fieldtype: 14 },
                        appraisal_chem: {
                            title: "化工鉴定机构",
                            type: 4,
                            groupid: 106,
                            bindLabel: "ready01",
                            fieldtype: 14
                        },
                        appraisalnum_chem: {
                            title: "鉴定编号",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 14
                        },
                        makecom_chem: {
                            title: "生产厂家",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 14
                        }
                    },
                    // 挂衣
                    fieldtype15: {
                        servicecontent_safe: {
                            title: "挂衣内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 15
                        },
                        yqdate_safe: {
                            title: "挂衣要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 15
                        }
                    },
                    // 贴签
                    fieldtype16: {
                        servicecontent_stick: {
                            title: "贴签内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 16
                        },
                        yqdate_stick: {
                            title: "贴签要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 16
                        },
                        servicecontent_stick: {
                            title: "唛头",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 16
                        }
                    },
                    // 材料
                    fieldtype18: {
                        servicecontent_cltg: {
                            title: "材料内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 18
                        },
                        yqdate_cltg: {
                            title: "材料要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 18
                        },
                        flowarea_cltg: {
                            title: "流向区域",
                            type: 4,
                            options: [{
                                label: "外场",
                                value: "外场"
                            },
                            {
                                label: "仓库",
                                value: "仓库"
                            }
                            ],
                            initialField: "flowpoint_cltg",
                            fieldtype: 18
                        },
                        flowpoint_cltg: {
                            title: "流向点",
                            type: 26,
                            linkage: "flowarea_cltg",
                            fieldtype: 18
                        }
                    },
                    // 大件装卸
                    fieldtype19: {
                        servicecontent_zx: {
                            title: "装卸内容",
                            type: 1,
                            whereStr: "like",
                            fieldtype: 19
                        },
                        yqdate_zx: {
                            title: "装卸要求时间",
                            type: 15,
                            titleStyle: {
                                minWidth: "100px"
                            },
                            fieldtype: 19
                        },
                        store_zx: {
                            title: "仓库名称",
                            type: 25,
                            linkage: "",
                            fieldtype: 19
                        },
                        bzlx_zx: {
                            title: "包装类型",
                            type: 4,
                            groupid: 31,
                            bindValue: "typename",
                            fieldtype: 19
                        }
                    }
                },

                allViewData3: {
                    // 订单层
                    // fieldtype:3 订单类
                    fid: {
                        title: "委托客户",
                        type: 14,
                        pagetype: "1",
                        fieldtype: 3
                    },
                    realwtkhname: {
                        title: "实际委托客户",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 3,
                        titleStyle: {
                            minWidth: "100px"
                        }
                    },
                    gid: {
                        title: "项目",
                        type: 13,
                        pagetype: "2",
                        fieldtype: 3
                    },
                    wtxm:{
                        title: "委托客户",
                        type: 130,
                        pagetype: "2",
                        fieldtype: 3,
                    },
                    
                    // 驳回状态
                    approvalStatus: {
                        title: "状态",
                        type: 5,
                         whereStr: "in",
                         options: [
                             {
                                label: "待审批",
                                value: "100"      
                             },
                             {
                                label: '已通过',
                                value: '200',
                             },
                             {
                                 label: '已驳回',
                                 value: '500',
                             }
                         ],
                          fieldtype: 3,
                    },


                    salesarea: {
                        title: "订单销售站",
                        type: 23,
                        groupid: 101,
                        whereStr: "in",
                        fieldtype: 3
                    },
                    system: {
                        title: "所属系统",
                        type: 5,
                        whereStr: "in",
                        options: [],
                        fieldtype: 3,
                        groupid: 57
                    },
                    ordersystem: {
                        title: "主营所属系统",
                        type: 5,
                        whereStr: "in",
                        options: [],
                        fieldtype: 3,
                        groupid: 57,
                        bindValue: "typename"
                    },
                    canceltype: {
                        title: "撤单类型",
                        type: 5,
                        whereStr: "in",
                        groupid: 135,
                        fieldtype: 3
                    },
                    rejectarea: {
                        title: "驳回来源地",
                        type: 5,
                        groupid: 141,
                        whereStr: "in",
                        fieldtype: 3
                    },
                    confirmremark: {
                        title: "对账备注",
                        whereStr: "like",
                        type: 1,
                        fieldtype: 3
                    },
                    isreceive: {
                        title: "对账单是否收到",
                        type: 5,
                        options: [{
                            label: "收到",
                            value: "1"
                        },
                        {
                            label: "未收到",
                            value: "2"
                        }
                        ],
                        whereStr: "in",
                        fieldtype: 3
                    },
                    // fieldtype:1 单号类
                    pono: {
                        title: "订舱编号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    shipperno: {
                        title: "订单编号",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    },
                    jobno: {
                        title: "订舱编号(经理审核)",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 1
                    }, // 经理审批页面
                    orderno: {
                        title: "订单来源号",
                        type: 1,
                        fieldtype: 1
                    },

                    // fieldtype:4 操作类
                    addman: {
                        title: "创建人",
                        type: 1,
                        fieldtype: 4
                    },
                    salesname: {
                        title: "销售人",
                        type: 1,
                        fieldtype: 4
                    },
                    cancelman: {
                        title: "撤单人",
                        type: 1,
                        fieldtype: 4
                    },
                    confirmman: {
                        title: "客户确认人",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 4
                    },
                    ourconfirmman: {
                        title: "我司对账人",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 4
                    },
                    customername: {
                        title: "客服负责人",
                        type: 1,
                        fieldtype: 4
                    },
                    orderfinishman: {
                        title: "订单完成人",
                        type: 1,
                        fieldtype: 4
                    },

                    // fieldtype:5 状态类
                    confirmstatus_in: {
                        title: "应收费用状态",
                        type: 5,
                        whereStr: "in",
                        titleStyle: {
                            minWidth: "100px"
                        },
                        fieldtype: 5,
                        options: [{
                            label: "费用未确认",
                            value: "1"
                        },
                        {
                            label: "费用已确认",
                            value: "700"
                        }
                        ]
                    },
                    confirmstatus_out: {
                        title: "应付费用状态",
                        type: 5,
                        whereStr: "in",
                        titleStyle: {
                            minWidth: "100px"
                        },
                        fieldtype: 5,
                        options: [{
                            label: "费用未确认",
                            value: "1"
                        },
                        {
                            label: "费用已确认",
                            value: "700"
                        }
                        ]
                    },
                    ccz_confirmstatus_in: {
                        title: "操作站费用状态",
                        type: 4,
                        whereStr: "in",
                        titleStyle: {
                            minWidth: "116px"
                        },
                        fieldtype: 5,
                        options: [{
                            label: "应收未确认",
                            value: "1"
                        },
                        {
                            label: "应收已确认",
                            value: "700"
                        }
                        ]
                    },
                    confirmstatus: {
                        title: "费用状态",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 5,
                        options: [{
                            label: "费用未确认",
                            value: "1"
                        },
                        {
                            label: "费用已确认",
                            value: "700"
                        }
                        ]
                    },
                    status: {
                        title: "订单状态",
                        type: 5,
                        whereStr: "in",
                        dom: "订单状态",
                        fieldtype: 5,
                        hideLabel: ['待合并', '已审单']
                    },
                    creditisbackstatus: {
                        title: "信控状态",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 5,
                        options: [{
                            value: "6",
                            label: "无异常"
                        },
                        {
                            label: "待通过",
                            value: "4"
                        },
                        {
                            label: "已通过",
                            value: "3"
                        },
                        {
                            label: "已驳回",
                            value: "5"
                        }
                        ]
                    },
                    billstatus: {
                        title: "对账状态",
                        type: 4,
                        fieldtype: 5,
                        options: [{
                            label: "对账中",
                            value: "900"
                        },
                        {
                            label: "已对账",
                            value: "1000"
                        }
                        ]
                    },
                    pzdom: {
                        title: "凭证类型",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 5,
                        options: [{
                            label: "账单 D/N",
                            value: "账单"
                        },
                        {
                            label: "发票 I/V",
                            value: "发票"
                        }
                        ]
                    },
                    commitstatus: {
                        title: "费用申请状态",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 5,
                        options: [{
                            label: "申请中",
                            value: "100"
                        },
                        {
                            label: "已驳回",
                            value: "200"
                        },
                        {
                            label: "已通过",
                            value: "500"
                        }
                        ]
                    },
                    kfconfirmstatus_in: {
                        title: "客服应收费用状态",
                        type: 5,
                        options: [{
                            label: "已确认",
                            value: "700"
                        },
                        {
                            label: "未确认",
                            value: "1"
                        }
                        ],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    kfconfirmstatus_out: {
                        title: "客服应付费用状态",
                        type: 5,
                        groupid: 196,
                        options: [],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    hxconfirmstatus_in: {
                        title: "航线应收费用状态",
                        type: 5,
                        groupid: 196,
                        options: [],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    hxconfirmstatus_out: {
                        title: "航线应付费用状态",
                        type: 5,
                        groupid: 196,
                        options: [],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    workconfirmstatus: {
                        title: "业务费用状态",
                        type: 5,
                        groupid: 196,
                        options: [],
                        whereStr: "in",
                        fieldtype: 5
                    },
                    // fieldtype:6 日期类
                    adddate: {
                        title: "创建日期",
                        type: 15,
                        fieldtype: 6,
                        defaultVal: false
                    },
                    confirmdate: {
                        title: "客户确认日期",
                        type: 15,
                        defaultVal: true,
                        titleStyle: {
                            minWidth: "100px"
                        },
                        fieldtype: 6
                    },
                    pzdate: {
                        title: "已开凭证日期",
                        type: 15,
                        titleStyle: {
                            minWidth: "100px"
                        },
                        defaultPreVal: true,
                        fieldtype: 6
                    },
                    ourconfirmdate: {
                        title: "我司对账日期",
                        type: 15,
                        titleStyle: {
                            minWidth: "110px"
                        },
                        fieldtype: 6
                    },
                    // fieldtype:2 费用类
                    wagestatus: {
                        title: "有无费用",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 2,
                        options: [{
                            label: "有费用",
                            value: "1"
                        },
                        {
                            label: "无费用",
                            value: "0"
                        }
                        ]
                    },

                    profitmode: {
                        title: "分配模式",
                        type: 5,
                        whereStr: "in",
                        fieldtype: 2,
                        options: [{
                            label: "利润分配模式",
                            value: "利润分配模式"
                        },
                        {
                            label: "Co-load模式",
                            value: "Co-load模式"
                        },
                        {
                            label: "本站",
                            value: " "
                        }
                        ]
                    },
                    profitquota: {
                        title: "分配额度",
                        type: 1,
                        whereStr: "like",
                        fieldtype: 2
                    },
                    accountcomgid: {
                        title: "结算对象",
                        type: 20,
                        pagetype: 1,
                        fieldtype: 2
                    },
                    paymentcomgid: {
                        title: "收付对象",
                        type: 20,
                        pagetype: 1,
                        fieldtype: 2
                    },
                    wageinout: {
                        title: "收付类型",
                        type: 4,
                        fieldtype: 2,
                        options: [{
                            label: "应收",
                            value: "1"
                        },
                        {
                            label: "应付",
                            value: "2"
                        }
                        ]
                    }
                }
            };
        },

        created() {
            // if (Object.keys(this.viewData).length == 0) {
            this.formFieldArr = this.getBasicField();
            // } else {
            // this.setViewPage();
            // }

            /**
             * 因为不同页面中的查询条件存在名称相同但字段不同的情况
             * 如：OrderSearch中订舱编号的字段名为pono，managerExamine中订舱编号的字段名为jobno （allViewData中可见）
             * 所以需要根据当前页面的基础字段(this.viewDataBasicField)将allViewData中的其他重名字段过滤掉，避免重复显示
             * 如：OrderSearch中需要pono字段，则将同名的jobno字段过滤掉
             */

            let allViewDataTitle = Object.values(this.allViewData).map(i => i.title);
            let allViewDataKey = Object.keys(this.allViewData);
            let basicField = this.getBasicField();
            let viewDataBasicField = [...basicField[0], ...basicField[1]];

            for (let key of viewDataBasicField) {
                if (!this.allViewData[key]) {
                    break;
                }
                let title = this.allViewData[key].title;
                let index = allViewDataTitle.indexOf(title);
                while (index != -1) {
                    if (allViewDataKey[index] != key && allViewDataTitle[index] == title) {
                        this.$delete(this.allViewData, allViewDataKey[index]);
                        index = allViewDataTitle.indexOf(title, index + 1);
                    } else {
                        index = allViewDataTitle.indexOf(title, index + 1);
                    }
                }
            }

            // 过滤掉其余title重复的字段
            allViewDataTitle = Object.values(this.allViewData).map(i => i.title);
            allViewDataKey = Object.keys(this.allViewData);
            for (let index in allViewDataTitle) {
                let isrepeat = allViewDataTitle.indexOf(
                    allViewDataTitle[index],
                    Number(index) + 1
                );
                while (isrepeat != -1) {
                    this.$delete(this.allViewData, allViewDataKey[isrepeat]);
                    isrepeat = allViewDataTitle.indexOf(
                        allViewDataTitle[index],
                        isrepeat + 1
                    );
                }
            }
        },
         beforeMount: function () {
            var twocodeData=JSON.parse(localStorage.getItem("airinfo") );
            twocodeData.forEach(item=>{
                var obj={label:item.CName,value:item.TwoCode};
                if(typeof this.allViewData.twocode.options === Array){
                    this.allViewData.twocode.options.push(obj);
                }
            });
        },

        computed: {
            isOutAddClass() {//使用外网新增的样式
                return this.isAddPage
            },
            orderArea() {//订单的地域
                return this.area || this.modelData.area || this.$store.state.areaState
            },
            // addressOptions() {//多级地域的选项值
       
                // let data = JSON.parse(localStorage.out_address)
                // this.getOut_address().then(data => {
                //     console.log(data)
                // })
               
            // },
            RelData() {//联系人数据
                let val = this.modelData.customerRelList || []
                return val.length > 0 ? [val[0].name, val[0].mobile, val[0].email] : [];
            },
            requiredField() {//必填选项但是未填的title
                for (let i in this.viewData) {
                    if (
                        this.viewData[i].required &&
                        !this.viewData[i].hidden &&
                        !this.modelData[i]
                    ) {
                        return this.viewData[i].title.replace("：", "");
                    }
                }
            },
            formFieldArr: {
                get() {
                    return this.getBasicField();
                },
                set(val) {
                    var obj = {};
                    var allViewData = {
                        ...this.allViewData,
                        ...this.allViewData3
                    };
                    Object.keys(this.allViewData2).forEach(key => {
                        Object.assign(allViewData, this.allViewData2[key]);
                    });
                    // allViewData = JSON.parse(JSON.stringify(allViewData));

                    // let viewData = JSON.parse(JSON.stringify(this.viewData));
                    let viewData = this.viewData
                    // 优先使用通过Props传入的自定义viewData
                    val.forEach(item => {
                        item.forEach(key => {
                            if (viewData[key]) {
                                obj[key] = {
                                    ...viewData[key]
                                };
                                // 将allViewData中的数据替换成自定义的viewData的数据，保证以后更新数据时使用的也是viewData的数据
                                try {
                                    this.allViewData[key] = {
                                        ...viewData[key],
                                        fieldtype: this.allViewData[key].fieldtype
                                    };
                                } catch (error) {
                                    // console.error(`${this.name}页面${key}查询字段未配置到allViewData中，或缺失fieldtype字段`)
                                }
                            } else if (allViewData[key]) {
                                obj[key] = {
                                    ...allViewData[key]
                                };
                            }
                        });
                    });

                    this.$emit("update:viewData", obj);
                    this.$nextTick(() => {
                        this.setViewPage();
                    });
                }
            }
        },
        watch: {
            modelData: {
                handler(val) {
                    this.getSearchData();
                },
                immediate: true,
                deep: true
            },
            viewData: {
                handler(val, old) {
                    this.getSearchData();
                },
                immediate: true,
                deep: true
            },
            inputGroupRequired: {
                handler(val, old) {
                    this.getSearchData();
                },
                immediate: true,
                deep: true
            },
            pageshow: {
                handler(val) {
                    if (this.$store.getters.userSetting.autoCollapse) {
                        this.setPageshow = val;
                    } else {
                        // 当没有更新setPageshow的值时需要将pageshow的值同步，否则后续外部组件更新pageshow的值时可能不会触发此函数
                        this.$emit("update:pageshow", this.setPageshow);
                    }
                },
                immediate: true
            },
            setPageshow(val) {
                this.$emit("update:pageshow", val);
            }
        },
        methods: {
            getOut_address() {

                 this.$axios({
                    method: "get",
                    url: this.$store.state.publicWebApi + "api/PubCityName",
                    params: "",
                    loading: false,
                    tip: false
                }).then(response => {
                    // localStorage.setItem('out_address', JSON.stringify(response.data))
                    let data = response.data;
                    let obj = {};
                    data.forEach(i => {
                        let parentid = String(i.parentid)
                        let e = { label: i.name, value: i.name, id: i.id }
                        if (!obj[parentid]) {
                            obj[parentid] = [e]
                        } else {
                            obj[parentid].push(e)
                        }
                    })
                    let addressOptions = [];

                    function getChildren(item, id) {
                        id = id || '0'
                        obj[id].forEach((i, k) => {
                            item[k] = { ...i }
                            let children = obj[i.id]
                            if (children && children.length) {
                                item[k].children = [...children]
                                getChildren(item[k].children, i.id)
                            }
                        })
                    }
                    getChildren(addressOptions)
                    // console.log(obj)
                    // console.log(addressOptions)
                    // return addressOptions
                    this.addressOptions=addressOptions
                })

            },
            openNewCompApply() {
                let username = localStorage.getItem('usrname')
                let key = sessionStorage.getItem('key')
                window.open(`${location.protocol}//${location.host}/wffcustommanagement?username=${username}&key=${key}`)
            },
            analyticPrmTtpe(attr) {//解析viewdata里面配置参数的类型
                return typeof attr == 'function' ? attr() : attr
            },
            computedAttribute(k, attr = 'disabled') {
                let attribute = this.viewData[k] && this.viewData[k][attr] || false;
                return typeof (attribute) == 'function' ? attribute() : attribute
            },
            setPickerOptions(type) {
                //type 1 小于当日不能点
                if (type) {
                    if (type == 1) {
                        return {
                            disabledDate(time) {
                                return time.getTime() + 3600 * 1000 * 24 < Date.now();
                            }
                        }
                    }
                } else {
                    return {}
                }
            },
            autocompleteFocus(k) {
                // console.log(k)
                this.autocompleteField = k;
            },
            querySearch(queryString, cb) {
                if (!this.autocompleteField) {
                    return;
                }
                var restaurants = this.viewData[this.autocompleteField].options || [];
                var results = queryString ?
                    restaurants.filter(this.createFilter(queryString)) :
                    restaurants;
                // console.log(results)
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return restaurant => {
                    return (
                        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || PinyinMatch.match(restaurant.value, queryString)
                    );
                };
            },
            handleSelect(item) {
                //  console.log(item);
            },
            formatField(field) {
                //当值改变时，将联动的字段赋值为空
                if (field) {
                    this.$set(this.modelData, field, "");
                }
            },
            getStoreArr(id) {
                //入库仓库
                let cargoData = JSON.parse(localStorage.cargoData);
                let arr = [];
                cargoData.map(item => {
                    if (
                        item.area ==
                        (id ? this.modelData[id] : this.orderArea)
                    ) {
                        arr.push(item.storename);
                    }
                });
                return arr;
            },
            getFlowAreaArr(id) {
                //流向区域
                if (!this.modelData[id]) {
                    return [];
                }
                let cargoData =
                    this.modelData[id] == "仓库" ?
                        JSON.parse(localStorage.cargoData) :
                        JSON.parse(localStorage.jjd);
                let arr = [];
                cargoData.map(item => {
                    if (item.area == this.orderArea) {
                        if (this.modelData[id] == "仓库") {
                            arr.push(item.storename);
                        } else {
                            arr.push(item.cname);
                        }
                    }
                });
                return arr;
            },
            getMateriaArr(id) {
                // 材料规格
                let data = JSON.parse(localStorage.groupType).filter(
                    i => i.groupid == -10 && i.typename == this.modelData[id]
                );
                // console.log(data)
                if (data.length > 0) {
                    return JSON.parse(localStorage.groupType)
                        .filter(i => i.groupid == -20 && i.ready02 == data[0].id)
                        .map(n => n.typename);
                } else {
                    return [];
                }
            },
            getGyArr(id) {
                // 挂衣规格
                let data = JSON.parse(localStorage.groupType).filter(
                    i => i.groupid == 162 && i.ready01 == this.modelData[id]
                );
                // console.log(data)
                if (data.length > 0) {
                    return JSON.parse(localStorage.groupType)
                        .filter(i => i.groupid == 163 && i.ready02 == data[0].id)
                        .map(n => n.typename);
                } else {
                    return [];
                }
            },
            getGbzArr(id) {
                // 改包装类型
                let data = JSON.parse(localStorage.groupType).filter(
                    i => i.groupid == 181 && i.ready01 == this.modelData[id]
                );
                // console.log(data)
                if (data.length > 0) {
                    return JSON.parse(localStorage.groupType)
                        .filter(i => i.groupid == 166 && i.ready02 == data[0].id)
                        .map(n => n.typename);
                } else {
                    return [];
                }
            },
            selmultiAll(k) {
                //下拉全选
                if (this.multipleVal[k].length == this.viewData[k].options.length) {
                    this.multipleVal[k] = [];
                } else {
                    this.multipleVal[k] = this.viewData[k].options.map(i => i.value);
                }
            },
            getWtkhMsg(val, type, linkage) {//委托客户选项值改变时
                this.modelData[linkage] = "";
                //  console.log(val)
                //  console.log(type)
                //type 1新增 2查询表单
                var wtxmData = [];
                // var wtxm=JSON.parse(localStorage.getItem('wtxm'))
                var wtxm = getxmdata("wtxmNoname");

                if (val.id) {
                    wtxmData = wtxm.filter(i => i.fid == val.id && i.customxz != 2);
                } else {
                    //  wtxmData=wtxm
                    wtxmData = [];
                }

                if (type == 1) {
                    this.wtkhRowdata = val;
                } else {
                    this.wtxmData = wtxmData;
                }

                this.$emit("wtdataP", {
                    wtkhname: val.usr_name,
                    wtkhcode: val.usr_code,
                    wtxmname: "",
                    wtxmcode: ""
                });
            },
            setWtxmFunc(i) {//根据委托客户设置委托项目的选项值
                // alert(1)
                let name = this.viewData[i].linkage;
                let gid = this.modelData[name] || '';
                this.$set(this.modelData, name, gid); 

                this.$watch(
                    function () {
                        return this.modelData[i] + this.system
                    },
                    function (newval) {

                        if (this.modelData[i] != undefined && this.modelData[i] != -1 && gid !== undefined && this.modelData.hasOwnProperty('fid')) {   
                            // done: 不需要只有在新增页面，需要根据选择的系统，重新过滤委托项目，已有限制
                            // if (this.viewData[i].pagetype == 8 && this.system) {//只有在新增页面，需要根据选择的系统，重新过滤委托项目
                            //     this.$set(
                            //         this.modelData,
                            //         name,
                            //         gid || ""
                            //     );
                            // }
                            if (this.modelData[i]>0) {
                                this.setWtxmOptions(i, this.modelData[i], name);
                            } else {
                                this.wtxmOptions = [];
                                this.wtxmRowdata = [];
                                this.modelData[name] = "";
                            }
                        }
                    },
                    { immediate: true }


                );


            },
            setMulFunc(i) {//代理下拉多选和下拉分组多选的值
                // console.log(i)
                this.$watch(
                    function () {
                        return this.modelData[i];
                    },
                    function (newval) {
                        this.multipleVal[i] = newval ? newval.toString().split(",") : [];
                    }, {
                    immediate: true
                }
                );

                this.$watch(
                    function () {
                        return this.multipleVal[i];
                    },
                    function (newval) {
                        this.$set(this.modelData, i, newval.toString());
                    }
                );
            },
            setCheckboxMultiple(i) {//代理多选的值
                if (this.viewData[i].default) {
                    this.$set(this.modelData, i, this.viewData[i].default);
                    //console.log(this.viewData[i].default)
                }
                this.$watch(
                    function () {
                        return this.modelData[i];
                    },
                    function (newval) {
                        this.$set(this.checkboxMultiple, i, newval ? newval.toString().split(",") : [])
                    }, {
                    immediate: true
                }
                );

                this.$watch(
                    function () {
                        return this.checkboxMultiple[i];
                    },
                    function (newval) {
                        let val = this.checkboxMultiple[i].toString()
                        this.$set(this.modelData, i, val);
                    }
                );
            },
            setInputData(i) {
                if (this.viewData[i].whereStr) {
                    this.$watch(
                        function () {
                            return this.viewData[i] && this.viewData[i].whereStr;
                        },
                        function (newval) {
                            if (newval && this.modelData[i]) {
                                let obj = `{"${this.viewData[i].whereStr}":"${this.modelData[i]}"}`;
                                // console.log(obj);
                                this.$set(this.searchData, i, JSON.parse(obj));
                            }
                        }, {
                        immediate: true
                    }
                    );
                }
            },
            setRadioDefault(i) {//设置单选的默认值
                if (this.viewData[i]) {
                    this.$set(this.viewData[i], 'hidden', this.viewData[i].hidden || false);
                    this.$set(this.viewData[i], 'required', this.viewData[i].required || true);
                }

                this.$watch(
                    function () {
                        return this.viewData[i] && this.viewData[i].default + this.modelData[i]
                    },
                    function (newval) {
                        if (this.viewData[i]&&this.viewData[i].default && !this.modelData[i]) {
                            this.$set(this.modelData, i, this.viewData[i].default);
                        }
                    }, {
                    immediate: true
                }
                );
            },
            setSelectDefault(i) {//设置下拉框的默认选项
                this.$watch(
                    function () {
                        return this.viewData[i] && this.viewData[i].default + this.modelData[i]
                    },
                    function (newval) {
                        if (this.viewData[i].default && !this.modelData[i]) {
                            this.$set(this.modelData, i, this.viewData[i].default);
                        }
                    }, {
                    immediate: true
                }
                );
            },
            setAddressFunc(i) {//设置地址
                let linkage = this.viewData[i].linkage
                if (linkage) {
                    this.$watch(
                        function () {
                            return this.modelData[linkage];
                        },
                        function (newval) {
                            if (newval) {
                                newval = JSON.parse(newval)
                                this.$set(this.modelData, 'address_fix', [newval.country, newval.pro, newval.city, newval.areade]);
                                this.$set(this.modelData, 'address_detail', newval.addressjson);
                            }
                        },
                        { immediate: true }
                    );
                }

                this.$watch(
                    function () {
                        return this.modelData.address_fix + this.modelData.address_detail;
                    },
                    function (newval) {
                        //country 国家 pro 州/省/県 city城市/县  areade区/街道 detail详细
                        let address_fix = this.modelData.address_fix || []
                        let address_detail = this.modelData.address_detail || ''
                        this.$set(this.modelData, i, address_fix.join('') + address_detail);
                        if (linkage) {
                            let obj = {
                                country: address_fix[0],
                                pro: address_fix[1],
                                city: address_fix[2],
                                areade: address_fix[3],
                                addressjson: address_detail
                            }
                            this.$set(this.modelData, linkage, JSON.stringify(obj));
                        }
                    }
                );
            },
            setinputgroups(field) {//初始化输入框组
                this.$set(this.inputGroupRequired, field, "")
            },
            setdata(i) {//设置日期
                this.$watch(
                    function () {
                        return (
                            this.modelData[i] +
                            this.viewData[i].defaultVal +
                            this.viewData[i].defaultEnd +
                            this.viewData[i].begintype +
                            this.viewData[i].endtype +
                            this.viewData[i].type
                        );
                    },
                    function (newv, oldv) {
                        // console.log(this.modelData[i])
                        //console.log(this.viewData[i])
                        //viewData 设置defaultVal是默认开始日期当天  设置defaultEnd默认结束日期当天
                        //begintype 开始日期默认值 1加一天 2前三个月 3前一个月 4往前推5天 5往前推1天 6往前一年
                        //endtype 结束日期默认值 1,默认当天后一天 2默认当天日期前三个月 4默认当天前3一天
                        // let  begin = formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00";
                        // let  end = new Date();
                        // end.setDate(new Date().getDate() + 1);
                        // console.log(this.viewData[i])
                        if (this.modelData[i]) return;
                        let today = formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00"; //当天日期格式
                        let begin = "";
                        let end = "";
                        let defaultVal = this.viewData[i].defaultVal;
                        let defaultEnd = this.viewData[i].defaultEnd;
                        let begintype = this.viewData[i].begintype;
                        let endtype = this.viewData[i].endtype;
                        if (defaultVal && !begintype) {
                            begin = today;
                        }

                        if (defaultVal && begintype) {
                            begin = new Date();
                            if (begintype == 1) {
                                begin.setDate(new Date().getDate() + 1);
                            }
                            if (begintype == 2) {
                                begin.setMonth(begin.getMonth() - 3);
                            }
                            if (begintype == 3) {
                                begin.setMonth(begin.getMonth() - 1);
                            }
                            if (begintype == 4) {
                                begin.setDate(new Date().getDate() - 5);
                            }
                            if (begintype == 5) {
                                begin.setDate(new Date().getDate() - 1);
                            }
                            if(begintype==6){
                                begin.setFullYear(begin.getFullYear() - 1);
                            }

                        }

                        if (defaultEnd && !endtype) {
                            end = new Date();
                        }

                        if (defaultEnd && endtype) {
                            end = new Date();
                            if (endtype == 1) {
                                end.setDate(new Date().getDate() + 1);
                            }
                            if (endtype == 2) {
                                end.setMonth(end.getMonth() - 3);
                            }
                            if (endtype == 4) {
                                end.setDate(new Date().getDate() - 3);
                            }
                        }
                        begin = begin ?
                            formatDate(new Date(begin), "yyyy-MM-dd") + " 00:00:00" :
                            "";
                        end = end ? formatDate(new Date(end), "yyyy-MM-dd") : "";

                        console.log(begin)
                        if (this.viewData[i].type == 15) {
                            this.$set(this.modelData, i, {
                                begin: begin,
                                end: end
                            });
                        } else {
                            this.$set(this.modelData, i, begin);
                        }
                    }, {
                    immediate: true
                }
                );
            },
            setHwlxOptions(i) {//设置货物类型的选项值
                this.$watch(
                    function () {
                        return this.modelData[i];
                    },
                    function (val) {
                        var hwlxOptions = [];
                        var groupData = JSON.parse(localStorage.getItem("groupType"));
                        groupData.forEach(i => {
                            if (i.groupid == 115 && i.typename == val) {
                                var ready02 = i.id;
                                groupData.forEach(m => {
                                    if (m.ready02 == ready02 && m.groupid == 109) {
                                        hwlxOptions.push({
                                            label: m.typename,
                                            value: m.typename
                                        });
                                    }
                                });
                            }
                        });

                        this.hwlxOptions = hwlxOptions;
                    }
                );
            },
            getBasicField() {
                let result = null;
                let tempname = this.name;
                let sameTableHeadComp = this.$store.state.sameTableHeadComp;
                if (sameTableHeadComp[0].includes(tempname)) {
                    // 综合查询
                    result = [
                        ["pono", "shipperno", "mawb", "hawb", "fid", "gid", "status", "hbrq", "adddate", "comboine", "iscomboine", "addman"], // 固定查询字段
                        [
                            "ordersystem",
                            "orderno",
                            "salesarea",
                            "comhy",
                            "hbh",
                            "yqhbh",
                            "yqhbrq",
                            "deliverydate",
                            "yqqcts",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "profitmode",
                            "batterymode",
                            "hawbnum",
                            "islocal",
                            "gysname",
                            "mawbss",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "adddate",
                            "salesname",
                            "cancelman",
                            "customername",
                            "modifyman",
                            "modifydate",
                            "confirmstatus",
                            "confirmstatusall",
                            "confirmstatus_in",
                            "confirmstatus_out",
                            "kcremark",
                            "areaname",
                            "terminalname",
                            "loadingmodel",
                            "boardgysname",
                            "khjcno",
                            "address_thr_org",
                            "lxr_thr_org",
                            "phone_thr_org",
                            "address_shr_org",
                            "lxr_shr_org",
                            "phone_shr_org",
                            "pickupdate_org",
                            "yqfinishdate_org",
                            "truckgid",
                            "servicecontent_deli",
                            "yqdate_deli",
                            "courienum_deli",
                            "destinat_deli",
                            "relshr_deli",
                            "receiver",
                            "servicecontent_inspect",
                            "yqdate_inspect",
                            "bzlx_inspect",
                            "servicecontent_pack",
                            "yqdate_pack",
                            "servicecontent_chem",
                            "yqdate_chem",
                            "appraisaltype_chem",
                            "bzlx_chem",
                            "store_chem",
                            "store_chem",
                            "appraisal_chem",
                            "appraisal_inspect",
                            "appraisalnum_chem",
                            "makecom_chem",
                            "servicecontent_safe",
                            "yqdate_safe",
                            "servicecontent_stick",
                            "yqdate_stick",
                            "servicecontent_stick",
                            "customstatus",
                            "servicecodehwcz",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "areaname",
                            "isreject",
                            "commbillmodifystatus",
                            "yqdate_cltg",
                            "servicecontent_cltg",
                            "flowarea_cltg",
                            "flowpoint_cltg",
                            "servicecontent_zx",
                            "yqdate_zx",
                            "store_zx",
                            "bzlx_zx",
                            "bindboae",
                            "ybkhjcno",
                            "trackstatus",
                            "mawbnoconfirmman",
                            "mawbnoconfirmdate",
                            "trundate",
                            "isclock"
                        ]
                    ];
                } else if (sameTableHeadComp[1].includes(tempname)) {
                    // 费用未确认
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "fid",
                            "gid",
                            "hbrq",
                            "status",
                            "confirmstatus",
                            // "workconfirmstatus",
                            "addman",
                            "canceling",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                        ], // 固定查询字段
                        [
                            "adddate",
                            "signman",
                            "orderno",
                            "salesarea",
                            "comhy",
                            "hbh",
                            "yqhbh",
                            "yqhbrq",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "profitmode",
                            "canceltype",
                            "confirmstatus_in",
                            "confirmstatus_out",
                            "ccz_confirmstatus_in",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "cancelman",
                            "salesname",
                            "customername",
                            "khjcno",
                            "address_thr_org",
                            "lxr_thr_org",
                            "phone_thr_org",
                            "address_shr_org",
                            "lxr_shr_org",
                            "phone_shr_org",
                            "pickupdate_org",
                            "yqfinishdate_org",
                            "truckgid",
                            "remark",
                            "servicecontent_deli",
                            "yqdate_deli",
                            "courienum_deli",
                            "destinat_deli",
                            "relshr_deli",
                            "receiver",
                            "servicecontent_inspect",
                            "yqdate_inspect",
                            "bzlx_inspect",
                            "servicecontent_pack",
                            "yqdate_pack",
                            "servicecontent_chem",
                            "yqdate_chem",
                            "appraisaltype_chem",
                            "bzlx_chem",
                            "store_chem",
                            "store_chem",
                            "appraisal_chem",
                            "appraisal_inspect",
                            "appraisalnum_chem",
                            "makecom_chem",
                            "servicecontent_safe",
                            "yqdate_safe",
                            "servicecontent_stick",
                            "yqdate_stick",
                            "servicecontent_stick",
                            "commitstatus",
                            "servicecodehwcz",
                            "orderfinishman",
                            "workconfirmstatus",
                            "mawbnoconfirmman",
                            "mawbnoconfirmdate",
                            "applysignman",
                            "areaname"
                        ]
                    ];
                } else if (sameTableHeadComp[2].includes(tempname)) {
                    // 未提交结算
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "hawb",
                            "fid",
                            "gid",
                            "status",
                            "wagestatus",
                            "confirmstatus",
                            "canceltype",
                            "profitmode",
                            "hbrq"
                        ], // 固定查询字段
                        [
                            "orderno",
                            "salesarea",
                            "comhy",
                            "hbh",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "addman",
                            "adddate",
                            "salesname",
                            "customername",
                            "khjcno",
                            "address_thr_org",
                            "lxr_thr_org",
                            "phone_thr_org",
                            "address_shr_org",
                            "lxr_shr_org",
                            "phone_shr_org",
                            "pickupdate_org",
                            "yqfinishdate_org",
                            "truckgid",
                            "remark",
                            "servicecontent_deli",
                            "yqdate_deli",
                            "courienum_deli",
                            "destinat_deli",
                            "relshr_deli",
                            "receiver",
                            "servicecontent_inspect",
                            "yqdate_inspect",
                            "bzlx_inspect",
                            "servicecontent_pack",
                            "yqdate_pack",
                            "servicecontent_chem",
                            "yqdate_chem",
                            "appraisaltype_chem",
                            "bzlx_chem",
                            "store_chem",
                            "store_chem",
                            "appraisal_chem",
                            "appraisal_inspect",
                            "appraisalnum_chem",
                            "makecom_chem",
                            "servicecontent_safe",
                            "yqdate_safe",
                            "servicecontent_stick",
                            "yqdate_stick",
                            "servicecontent_stick"
                        ]
                    ];
                } else if (sameTableHeadComp[3].includes(tempname)) {
                    // 海外
                    result = [
                        ["pono", "shipperno", "mawb", "hawb", "fid", "gid", "hbrq", "status"], // 固定查询字段
                        [
                            "orderno",
                            "salesarea",
                            "comhy",
                            "hbh",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "profitmode",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "addman",
                            "adddate",
                            "salesname",
                            "customername",
                            "confirmstatusall",
                            "khjcno",
                            "address_thr_org",
                            "lxr_thr_org",
                            "phone_thr_org",
                            "address_shr_org",
                            "lxr_shr_org",
                            "phone_shr_org",
                            "pickupdate_org",
                            "yqfinishdate_org",
                            "truckgid",
                            "remark",
                            "servicecontent_deli",
                            "yqdate_deli",
                            "courienum_deli",
                            "destinat_deli",
                            "relshr_deli",
                            "receiver",
                            "servicecontent_inspect",
                            "yqdate_inspect",
                            "bzlx_inspect",
                            "servicecontent_pack",
                            "yqdate_pack",
                            "servicecontent_chem",
                            "yqdate_chem",
                            "appraisaltype_chem",
                            "bzlx_chem",
                            "store_chem",
                            "store_chem",
                            "appraisal_chem",
                            "appraisal_inspect",
                            "appraisalnum_chem",
                            "makecom_chem",
                            "servicecontent_safe",
                            "yqdate_safe",
                            "servicecontent_stick",
                            "yqdate_stick",
                            "servicecontent_stick"
                        ]
                    ];
                } else if (sameTableHeadComp[4].includes(tempname)) {
                    // AMS
                    result = [
                        [
                            "mawb",
                            "hbh",
                            "hbrq",
                            "fid",
                            "gid",
                            "czlx",
                            "cargostatus",
                            "safetystatus",
                            "sendstatus"
                        ], // 固定查询字段
                        [
                            "bgstatus",
                            "mdg",
                            "areaname",
                            "zdlx",
                            "orderdom",
                            "hawbsendstatus",
                            "SPECIAL",
                            "verificationstatus",
                            "commbillmodifystatus",
                            "isexportform",
                            "sendman",
                            "accountinfo"
                        ]
                    ];
                } else if (
                    tempname == "cabinUnconfirmed.vue" ||
                    tempname == "orderIncomplete.vue"
                ) {
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "hawb",
                            "fid",
                            "gid",
                            "creditisbackstatus",
                            "status"
                        ], // 固定查询字段
                        [
                            "orderno",
                            "salesarea",
                            "comhy",
                            "yqhbh",
                            "yqhbrq",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "islocal",
                            "salesname",
                            "customername",
                            "addman",
                            "dzstatus"
                        ]
                    ];
                } else if (tempname == "businessUquCancel.vue") {
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "hawb",
                            "fid",
                            "gid",
                            "status",
                            "creditisbackstatus"
                        ],
                        [
                            "orderno",
                            "salesarea",
                            "comhy",
                            "yqhbh",
                            "yqhbrq",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "islocal",
                            "rejectarea",
                            "salesname",
                            "customername",
                            "addman",
                            "dzstatus"
                        ]
                    ];
                } else if (tempname == "creditControl.vue") {
                    result = [

                        ["pono", "shipperno", "mawb", "hawb", "fid", "gid", "creditisbackstatus"],
                        [
                            "orderno",
                            "salesarea",
                            "comhy",
                            "yqhbrq",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "salesname",
                            "customername"
                        ]
                    ];
                } else if (tempname == "applicationDocuments.vue") {
                    result = [
                        ["pono", "shipperno", "mawb", "fid", "gid", "hbrq", "dzstatus"],
                        [
                            "hbh",
                            "sfg",
                            "mdg",
                            "addman",
                            "customername",
                            "areaname",
                            "pcstatus",
                            "hwstatus",
                            "bgstatus",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "servicecodehwcz"
                        ]
                    ];
                } else if (
                    tempname == "danhaoConfirm.vue" ||
                    tempname == "danzhengConfirm.vue"
                ) {
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "fid",
                            "gid",
                            "hbrq",
                            "noconfirmstatus",
                            "dzconfirmstatus"
                        ],
                        [
                            "hbh",
                            "sfg",
                            "mdg",
                            "addman",
                            "customername",
                            "areaname",
                            "dzstatus",
                            "pcstatus",
                            "hwstatus",
                            "bgstatus",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "servicecodehwcz"
                        ]
                    ];
                } else if (tempname == "warehousingVouchers.vue") {
                    result = [
                        ["pono", "shipperno", "mawb", "fid", "gid", "hbrq"],
                        ["hbh", "sfg", "mdg"]
                    ];
                } else if (
                    tempname == "airLineSearch.vue" ||
                    tempname == "masterSearch.vue"
                ) {
                    result = [
                        [
                            "pono",
                            "shipperno",
                            "mawb",
                            "fid",
                            "gid",
                            "setshipaceman",
                            "setshipacedate",
                            "loadingmodel",
                            "hbrq",
                            "status"
                        ],
                        [
                            "terminalname",
                            "comhy",
                            "hbh",
                            "sfg",
                            "mdg",
                            "czlx",
                            "boardgysname",
                            "hwxz",
                            "hwlx",
                            "ccz_confirmstatus_in",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "addman",
                            "adddate",
                            "salesname",
                            "customername",
                            "servicecodehwcz",
                            "confirmstatusall",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "hawb",
                            "sjjzt",
                            "dzjzt",
                            "areaname",
                            "gysname",
                            "loadingmodel",
                            "setshipaceman",
                            "trackstatus",
                            "isboardgys"
                        ]
                    ];
                } else if (tempname == "asignSearch.vue") {
                    result = [
                        ["hbrq", "setshipaceman", "pcstatus", "loadingmodel", "status", "signman",],
                        [
                            "terminalname",
                            "comhy",
                            "hbh",
                            "sfg",
                            "mdg",
                            "czlx",
                            "boardgysname",
                            "hwxz",
                            "hwlx",
                            "ccz_confirmstatus_in",
                            "dzstatus",
                            "bgstatus",
                            "hwstatus",
                            "addman",
                            "adddate",
                            "salesname",
                            "customername",
                            "servicecodehwcz",
                            "confirmstatusall",
                            "applysignman",
                            "orderconfirmman",
                            "hawb",
                            "sjjzt",
                            "dzjzt",
                            "areaname",
                            "gysname",
                            "trackstatus",
                            "pono",
                            "shipperno",
                            "mawb",
                            "fid",
                            "gid",
                            "setshipacedate",
                            "loadingmodel"
                        ]
                    ];
                } else if (tempname == "customsContactSend.vue") {
                    result = [
                        ["pono", "shipperno", "mawb", "hawb", "fid", "gid", "hbrq", "status", "customstatus"],
                        [
                            "salesarea",
                            "czlx",
                            "hbh",
                            "yqhbh",
                            "yqqcts",
                            "sfg",
                            "mdg",
                            "addman",
                            "customername",
                            "areaname",
                            "dzstatus",
                            "pcstatus",
                            "hwstatus",
                            "bgstatus",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "servicecodehwcz"
                        ]
                    ];
                } else if (tempname == 'gnSearch.vue' || tempname === 'gnCostConfirm.vue' || tempname == 'gnUnfinish.vue') {
                    result = [
                        ["pono", "shipperno", "mawb", "fid", "gid", "hbrq", "status", "adddate", "receiver", "relshr_deli", "confirmstatus", "confirmstatus_in", "addman"], // 固定查询字段
                        [
                            "ordersystem",
                            "orderno",
                            "salesarea",
                            "comhy",
                            "hbh",
                            "yqhbh",
                            "yqhbrq",
                            "deliverydate",
                            "yqqcts",
                            "sfg",
                            "mdg",
                            "czlx",
                            "hwxz",
                            "hwlx",
                            "profitmode",
                            "batterymode",
                            "hawbnum",
                            "islocal",
                            "gysname",
                            "mawbss",
                            "dzstatus",
                            "pcstatus",
                            "bgstatus",
                            "hwstatus",
                            "salesname",
                            "cancelman",
                            "customername",
                            "modifyman",
                            "modifydate",
                            "confirmstatusall",
                            "confirmstatus_out",
                            "kcremark",
                            "areaname",
                            "terminalname",
                            "loadingmodel",
                            "boardgysname",
                            "khjcno",
                            "address_thr_org",
                            "lxr_thr_org",
                            "phone_thr_org",
                            "address_shr_org",
                            "lxr_shr_org",
                            "phone_shr_org",
                            "pickupdate_org",
                            "yqfinishdate_org",
                            "truckgid",
                            "servicecontent_deli",
                            "yqdate_deli",
                            "courienum_deli",
                            "destinat_deli",
                            "relshr_deli",
                            "receiver",
                            "servicecontent_inspect",
                            "yqdate_inspect",
                            "bzlx_inspect",
                            "servicecontent_pack",
                            "yqdate_pack",
                            "servicecontent_chem",
                            "yqdate_chem",
                            "appraisaltype_chem",
                            "bzlx_chem",
                            "store_chem",
                            "store_chem",
                            "appraisal_chem",
                            "appraisal_inspect",
                            "appraisalnum_chem",
                            "makecom_chem",
                            "servicecontent_safe",
                            "yqdate_safe",
                            "servicecontent_stick",
                            "yqdate_stick",
                            "servicecontent_stick",
                            "customstatus",
                            "servicecodehwcz",
                            "signman",
                            "applysignman",
                            "orderconfirmman",
                            "areaname",
                            "isreject",
                            "commbillmodifystatus",
                            "yqdate_cltg",
                            "servicecontent_cltg",
                            "flowarea_cltg",
                            "flowpoint_cltg",
                            "servicecontent_zx",
                            "yqdate_zx",
                            "store_zx",
                            "bzlx_zx",
                            "bindboae",
                            "ybkhjcno",
                            "trackstatus",
                            "mawbnoconfirmman",
                            "mawbnoconfirmdate",
                            "serviceitemsname"
                        ]
                    ];
                } else if (tempname == 'ctype.vue') {
                    result = [
                        ["pono", "shipperno", "mawb", "hawb", "fid", "gid", "hbrq", "adddate", "isclock"], // 固定查询字段
                        [
                            "hbh",
                            "sfg",
                            "mdg",
                            "czlx"
                        ]
                    ]
                } 
                  else if (tempname == "managerPriceFreight.vue") {
                    result = [[
                    "areaname",
                    "sfg",
                    "jg",
                        "twocode",
                    // "packageType",
                    // "cusLevel",
                    // "weight",
                    // "volRatio",
                    "addman",
                    "validityDate",
                    "wtxm",
                    "approvalStatus",
                    ],[]];
                }
                else {
                    result = this.viewDataBasicField;
                }

                return result;
            },
            setViewPage() {
                let groupData = JSON.parse(localStorage.getItem("groupType"));
                let currencyData = JSON.parse(localStorage.getItem("currencyData"));
                let statusData = JSON.parse(localStorage.getItem("statusData"));
                let cargoData = JSON.parse(localStorage.getItem("cargoData"));

                for (let i in this.viewData) {
                    let item = this.viewData[i];
                    let model = this.modelData[i];

                    if (item.type == 1) {
                        this.setInputData(i);
                    }
                    if (item.type == 2) {
                        this.setCheckboxMultiple(i)
                    }
                    if (item.type == 3) {
                        this.setRadioDefault(i);
                    }
                    if (item.type == 4) {
                        this.setSelectDefault(i);
                    }

                    if (item.type === 5) {
                        this.setMulFunc(i);
                    }
                    if (item.type === 6) {
                        this.setdata(i);
                    }
                    if (item.type === 11) {
                        this.setWtxmFunc(i);
                    }

                    if (item.type == 14) {
                        this.setInputData(i);
                    }

                    if (item.type === 15) {
                        this.setdata(i);
                    }

                    if (item.type === 21) {
                        this.setHwlxOptions(i);
                    }

                    if (item.type == 23) {
                        this.setMulFunc(i);
                    }
                    if (item.type == 38) {
                        this.setinputgroups(i);
                    }

                    if (item.type == 39) {
                        this.getOut_address()
                        this.setAddressFunc(i);
                    }


                    if (item.groupid || item.dom || item.type == 24) {
                        this.$set(
                            item,
                            "options",
                            item.options && item.options.length > 0 ? item.options : []
                        );
                        this.$set(
                            item,
                            "hideLabel",
                            item.hideLabel && item.hideLabel.length > 0 ? item.hideLabel : []
                        );
                    }
                    var areaArr = [];
                    var index = 0;
                    if (item.groupid) {
                        for (let j in groupData) {
                            if (item.groupid == groupData[j].groupid) {
                                if (item.groupid == 101) {
                                    //查询中的操作站，销售站
                                    if (!areaArr.includes(groupData[j].ready04)) {
                                        areaArr.push(groupData[j].ready04);
                                        this.$set(item.options, areaArr.length - 1, {
                                            label: groupData[j].ready04,
                                            options: [{
                                                value: groupData[j].typename.split("丨")[0],
                                                label: groupData[j].typename
                                            }]
                                        });
                                    } else {
                                        let len = areaArr.indexOf(groupData[j].ready04);
                                        this.$set(
                                            item.options[len].options,
                                            item.options[len].options.length, {
                                            value: groupData[j].typename.split("丨")[0],
                                            label: groupData[j].typename
                                        }
                                        );
                                    }
                                } else if (item.groupid == 105) {
                                    this.$set(item.options, index, {
                                        value: groupData[j][item.bindValue || "ready01"],
                                        label: groupData[j][item.bindLabel || "typename"]
                                    });
                                } else {
                                    // this.$set(item.options,index,{ 'value': groupData[j].ready01, 'label': groupData[j].typename })
                                    this.$set(item.options, index, {
                                        value: groupData[j][item.bindValue || "ready01"],
                                        label: groupData[j][item.bindLabel || "typename"]
                                    });
                                }
                                index += 1;
                            }
                        }
                    }

                    if (item.dom && item.options) {
                        let n = 0;
                        let system = item.system || "空出";

                        if (item.options.length == 0) {
                            for (let m in statusData) {
                                if (
                                    item.dom == statusData[m].dom &&
                                    system == statusData[m].system &&
                                    !item.hideLabel.includes(statusData[m].nodename)
                                ) {
                                    this.$set(item.options, n, {
                                        value: String(statusData[m].nodecode),
                                        label: statusData[m].nodename
                                    });
                                    n += 1;
                                }
                            }
                        }
                    }

                    if (
                        item.id == "currency" ||
                        i == "currency" ||
                        item.id == "currency_out" ||
                        i == "currency_out"
                    ) {
                        for (let j in currencyData) {
                            this.$set(item.options, j, {
                                value: currencyData[j].cname,
                                label: currencyData[j].cname
                            });
                        }
                    }

                    if (item.type == 16) {
                        item.options[0].detailS = [];
                        item.options[1].detailS = [];
                        JSON.parse(localStorage.getItem("groupType")).forEach(i => {
                            if (i.groupid == 133) {
                                if (i.ready02 == "PP") {
                                    item.options[0].detailS.push(i.ready01);
                                } else {
                                    item.options[1].detailS.push(i.ready01);
                                }
                            }
                        });
                    }

                    if (item.type == 24) {
                        let arr = [];
                        for (let j in cargoData) {
                            if (!arr.includes(cargoData[j].area)) {
                                this.$set(item.options, arr.length, {
                                    value: cargoData[j].area,
                                    label: cargoData[j].area
                                });
                                arr.push(cargoData[j].area);
                            }
                        }
                    }
                }
            },
            wtdata(val) {
                getxmdata("wtxmNoname").forEach(i => {
                    if (i.id == val) {
                        this.$emit("wtdataP", {
                            wtkhname: this.wtkhRowdata.usr_name,
                            wtkhcode: this.wtkhRowdata.usr_code,
                            wtxmname: i.usr_name,
                            wtxmcode: i.usr_code
                        });
                    }
                });
            },

            wtxmBlur() {
                setTimeout(() => {
                    this.$refs.wtxm[0].blur();
                }, 100);
            },
            // TODO: 订单新增不按默认站点选择
            setWtxmOptions(name, id, linkage) {
                // console.log(name)
                // console.log(id)
                // console.log(linkage);

                // console.log(this.system);

                if (!id) return;

                let systemCode = "380";
                let wtxmOptions = [];
                let wtxm = getxmdata("wtxmNoname");
                let area = this.orderArea

                if (this.system) {
                    let obj = JSON.parse(localStorage.groupType).find(
                        i => i.groupid == 57 && i.typename == this.system
                    );
                    if (obj) {
                        systemCode = String(obj.id);
                    }
                }
                // console.log(systemCode)
                if (this.isOrderAdd) {
                    // 订单新增时，不需要过滤地区和系统
                    wtxm = wtxm.filter(i => {
                    return (
                            i.usr_status == 1 &&
                            i.comxz.split(",").includes("1") &&

                            // (i.system == -1 ||
                            //     i.system == "全部" ||
                            //     i.system.split(",").includes(systemCode)) &&
                            i.customxz != 2
                        );
                    });
                } else {
                    wtxm = wtxm.filter(i => {
                    return (
                            i.usr_status == 1 &&
                            i.comxz.split(",").includes("1") &&
                            (i.area == -1 ||
                                i.area == "全部" ||
                                i.area.split(",").includes(area)
                                ) &&
                            i.iscommit == 2 &&
                            (i.system == -1 ||
                                i.system == "全部" ||
                                i.system.split(",").includes(systemCode)) &&
                            i.customxz != 2
                        );
                    });
                }
               
                var wtkh = getxmdata("wtkhUseful");
                wtkh.forEach(i => {
                    if (i.id == id) {
                        this.wtkhRowdata = i;
                    }
                });
                wtxm.forEach(i => {
                    if (i.fid == id) {
                        wtxmOptions.push(i);
                    }
                });
                //  console.log(wtxmOptions)

                if (wtxmOptions.length == 0) {
                    this.modelData[linkage] = "";
                    this.wtxmRowdata = {};
                } else if (wtxmOptions.length == 1) {
                    this.modelData[linkage] = wtxmOptions[0].id;
                    this.wtxmRowdata = wtxmOptions[0];
                } else {
                    wtxmOptions.forEach(m => {
                        if (m.id == this.modelData[linkage]) {
                            this.wtxmRowdata = m;
                        }
                    });
                }

                if (Object.keys(this.wtkhRowdata).length > 0) {
                    this.$emit("wtdataP", {
                        wtkhname: this.wtkhRowdata.usr_name,
                        wtkhcode: this.wtkhRowdata.usr_code,
                        wtxmname: this.wtxmRowdata.usr_name,
                        wtxmcode: this.wtxmRowdata.usr_code
                    });
                }

                // console.log(wtxmOptions)
                this.wtxmOptions = wtxmOptions;
            },
            fpChange(id, val, linkage) {
                console.log(val)
                if (val) {
                    if (
                        val.length == "1" &&
                        this.sfgfpmsv &&
                        this.sfgfpmsv == "利润分配模式"
                    ) {
                        var reg = /^([1-9]+([.]{1}[0-9]{0,1})?)$/;
                    } else {
                        var reg = /^([0-9]+([.]{1}[0-9]{0,1})?)$/;
                    }

                    if (!reg.test(Number(val)) || Number(val) > 10) {
                        this.$message.error("请输入1-10的小数");
                        //格式不正确清空
                        this.modelData[id] = "";
                        return false;
                    } else {
                        this.modelData[id] = Number(val);
                        this.modelData[linkage] = Number(10 - Number(val));
                        if (String(this.modelData[linkage]).indexOf(".") != "-1") {
                            this.modelData[linkage] = Number(this.modelData[linkage]).toFixed(
                                1
                            );
                        }
                    }
                }
            },
            handleChangeRelData($event) {
                // console.log($event)
                let val = $event[0] ? $event : []
                this.$emit("changeRelData", val);
            },
            getSearchData() {//生成查询表单数据
                if (JSON.stringify(this.viewData) == "{}") {
                    return;
                }
                var searchData = {};
                var chineseWhere = []; //中文查询条件
                Object.keys(this.modelData).forEach(k => {
                    let obj = {
                        title: "",
                        value: ""
                    }; //excel表格中的查询条件
                    if (!this.viewData[k]) {
                        return;
                    }
                    obj.title = this.viewData[k].title;

                    if (this.viewData[k]) {
                        if (this.modelData[k]) {
                            let whereStr = this.viewData[k].whereStr;
                            let dom = this.viewData[k].dom;
                            if (whereStr && !dom) {
                                let mData =
                                    typeof this.modelData[k] == "string" ?
                                        this.modelData[k].trim() :
                                        this.modelData[k];

                                if (whereStr == "like") {
                                    searchData[k] = {
                                        like: mData
                                    };
                                    obj.value = mData;
                                }

                                if (whereStr == "in" && k != "ccz_confirmstatus_in") {
                                    searchData[k] = {
                                        in: this.modelData[k]
                                    };

                                    if (this.viewData[k].options) {
                                        let str = "";
                                        this.modelData[k].split(",").forEach(v => {
                                            this.viewData[k].options.forEach(p => {
                                                if (v == p.value) {
                                                    str += p.label + ",";
                                                }
                                            });
                                        });
                                        obj.value = str.substr(0, str.length - 1);
                                    }
                                }
                                //else if(whereStr=='in'&&k=="confirmstatusall"){//坑逼的状态值
                                /* if(this.modelData[k].indexOf('3')!=-1){
                                    searchData['confirmstatus']={in:700}
                                  }else if(this.modelData[k].indexOf('1')!=-1&&this.modelData[k].indexOf('2')!=-1){
                                    searchData['confirmstatus_in']={in:1}
                                    searchData['confirmstatus_out']={in:1}
                                  }else if(this.modelData[k].indexOf('1')!=-1&&this.modelData[k].indexOf('2')==-1){
                                    searchData['confirmstatus_out']={in:1}
                                  }else if(this.modelData[k].indexOf('1')==-1&&this.modelData[k].indexOf('2')!=-1){
                                      searchData['confirmstatus_in']={in:1}
                                  } */
                                // }
                                else if (whereStr == "in" && k == "ccz_confirmstatus_in") {
                                    if (this.modelData[k].indexOf("700") != -1) {
                                        searchData["ccz_confirmstatus_in"] = {
                                            begin: 700
                                        };
                                    }
                                    if (this.modelData[k].indexOf("1") != -1) {
                                        searchData["ccz_confirmstatus_in"] = {
                                            in: 1
                                        };
                                    }
                                }

                                if (whereStr == "equal") {
                                    //等于，输入框默认like,如果希望精确查询用equal
                                    searchData[k] = {
                                        equal: mData
                                    };
                                    obj.value = mData;
                                }
                                if (whereStr == "notlike") {
                                    searchData[k] = {
                                        notlike: mData
                                    };
                                    obj.value = mData;
                                }
                                if (whereStr == "unequal") {
                                    searchData[k] = {
                                        unequal: mData
                                    };
                                    obj.value = mData;
                                }
                            } else if (whereStr && dom) {
                                var getIndex = [];
                                JSON.parse(localStorage.statusData).forEach(i => {
                                    if (this.modelData[k].split(",").includes(i.nodecode)) {
                                        getIndex.push(i.nodeindex);
                                    }
                                });

                                if (whereStr == "in") {
                                    searchData[k] = {
                                        in: getIndex.join(",")
                                    };
                                } else {
                                    searchData[k] = getIndex.join(",");
                                }

                                if (this.viewData[k].options) {
                                    let str = "";
                                    this.modelData[k].split(",").forEach(v => {
                                        this.viewData[k].options.forEach(p => {
                                            if (v == p.value) {
                                                str += p.label + ",";
                                            }
                                        });
                                    });
                                    obj.value = str.substr(0, str.length - 1);
                                }
                            } else {
                                //whereStr和dom都不存在
                                if (this.viewData[k].type == 1) {
                                    //输入框默认模糊查询

                                    searchData[k] = {
                                        like: typeof this.modelData[k] == "string" ?
                                            this.modelData[k].trim() : this.modelData[k]
                                    };
                                    obj.value =
                                        typeof this.modelData[k] == "string" ?
                                            this.modelData[k].trim() :
                                            this.modelData[k];
                                } else if (this.viewData[k].type == 7) {
                                    searchData[k] = {
                                        begin: this.modelData[k][0],
                                        end: this.modelData[k][1]
                                    };
                                } else if (this.viewData[k].type == 15) {
                                    //console.log(this.modelData[k])
                                    let begin = this.modelData[k].begin;
                                    let end = "";

                                    if (this.modelData[k].end && this.modelData[k].end.indexOf('NaN') == -1) {
                                        if (this.viewData[k].format) {
                                            end = this.modelData[k].end + ":59";
                                        } else {
                                            end = this.modelData[k].end + " 23:59:59";
                                        }
                                    }

                                    if (begin && !end) {
                                        searchData[k] = {
                                            begin: begin
                                        };
                                        obj.value = `开始日期：${begin}`;
                                    }
                                    if (!begin && end) {
                                        searchData[k] = {
                                            end: end
                                        };
                                        obj.value = `结束日期：${end}`;
                                    }
                                    if (begin && end) {
                                        //   if (new Date(begin) <= new Date(end)) {
                                        searchData[k] = {
                                            begin: begin,
                                            end: end
                                        };
                                        obj.value = `开始日期：${begin},结束日期：${end}`;
                                        // } else {
                                        //   searchData[k] = { begin: begin };
                                        //   obj.value = `开始日期：${begin}`;
                                        // }
                                    }
                                } else {
                                    searchData[k] = this.modelData[k];
                                    obj.value = this.modelData[k];
                                }
                            }
                        }
                    } else {
                        searchData[k] =
                            typeof this.modelData[k] == "string" ?
                                this.modelData[k].trim() :
                                this.modelData[k];
                        obj.value = this.modelData[k];
                    }

                    //取字段值得中文名，特殊类型
                    if (this.viewData[k].type == 4 && this.viewData[k].options) {
                        this.viewData[k].options.forEach(p => {
                            if (obj.value == p.value) {
                                obj.value = p.label;
                            }
                        });
                    }

                    if (this.viewData[k].type == 14) {
                        getxmdata("wtkh").forEach(i => {
                            if (i.id == this.modelData[k]) {
                                obj.value = i.usr_name;
                            }
                        });
                    }

                    if (this.viewData[k].type == 13) {
                        getxmdata("wtxmNoname").forEach(i => {
                            if (i.id == this.modelData[k]) {
                                obj.value = i.usr_name;
                            }
                        });
                    }

                    if (this.viewData[k].type == 23 && this.viewData[k].options) {
                        let str = "";
                        this.modelData[k].split(",").forEach(v => {
                            this.viewData[k].options.forEach(p => {
                                p.options.forEach(z => {
                                    if (v == z.value) {
                                        str += z.value + ",";
                                    }
                                });
                            });
                        });
                        obj.value = str;
                    }

                    if (obj.title && obj.value) {
                        chineseWhere.push(obj);
                    }
                });

                //判断必填
                let inputGroupRequired = Object.values(this.inputGroupRequired).filter(i => !!i)
                if (inputGroupRequired.length) {
                    this.$emit(
                        "update:required",
                        inputGroupRequired[0].replace("：", "")
                    );

                } else {
                    for (let i in this.viewData) {
                        if (
                            this.viewData[i].required &&
                            !this.modelData[i] &&
                            !this.viewData[i].hidden
                        ) {
                            let alertTitle = this.viewData[i].alertTitle || this.viewData[i].title;
                            this.$emit(
                                "update:required",
                                alertTitle.replace("：", "")
                            );
                            break;
                        } else {
                            this.$emit("update:required", "");
                        }
                    }

                }

                this.$emit("update:searchData", searchData);
                this.$emit("update:chineseWhere", chineseWhere);
            },
            getQfsj(...a) {
                //  console.log(a)//不定参，一个数组，等同于 arguments[0]
                //  console.log(arguments)
                //  console.log(arguments[0])
                let area = this.orderArea
                if (
                    !area ||
                    area.split(",").length != 1
                ) {
                    this.$message.error("请先选择区域！");
                    return;
                }

                let sfg = this.modelData.sfg;
                let hbh = this.modelData.hbh;
                let hbrq = this.modelData.hbrq;
                if (hbh && hbh.length < 2) {
                    return;
                }
                let json = {
                    area: area,
                    sfg: sfg,
                    hbh: hbh,
                    hbrq: hbrq,
                    jid: ""
                };
                if (sfg && hbh && hbrq) {
                    this.$axios({
                        method: "get",
                        url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
                        params: json,
                        loading: false,
                        tip: false
                    }).then(results => {
                        // console.log("起飞时间");
                        // console.log(results.data);
                        let qfsj = results.data.resultdic && results.data.resultdic.flytime;
                        this.qfsjsid = results.data.resultdic && results.data.resultdic.sid;
                        if (qfsj && qfsj.indexOf("1900") == -1) {
                            this.modelData.qfsj = qfsj;
                        } else {
                            this.modelData.qfsj = "";
                            this.$message.error(results.data.resultmessage);
                        }
                    });
                } else {
                    this.modelData.qfsj = "";
                }
            },
            qfsjDialogFunc() {
                let mawb = this.modelData.mawb;
                let hbh = this.modelData.hbh;
                let hbrq = this.modelData.hbrq;
                let sfg = this.modelData.sfg;
                let addman = localStorage.usrname;
                if (!hbh || !hbrq || !sfg) {
                    this.$message.error("请填写航班号，航班日期，始发港！");
                    return;
                } else {
                    this.qfsjDialog = true;
                    this.qfsjUrl = `${this.$store.state.imgWebApi}WffBasic/basic/frmflightAdd.aspx?sid=${this.qfsjsid}&mawb=${mawb}&hbh=${hbh}&sfg=${sfg}&addman=${addman}&area=${this.orderArea}`;
                }
            },
            handleEventFunc(k,e) {//执行外面传入的方法
                /*                  hbrq: {
                            title: isaddpage ? "要求航班日期：" : "实际航班日期：",
                            format: "yyyy-MM-dd HH:mm",
                            required: true,
                            type: 6,
                            // elEvent: {
                            //   eventName: 'change',
                            //   funcName:'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
                            //   params: 1 //多个参数用数组
                            // },
                            elEvent: {
                              eventName: 'change',
                              eventFunc: this.getQfsj, //方法写在外面的组件中，传入在里面执行
                            },
                          }, */
                // console.log(k)
                // console.log(this.viewData[k].elEvent)
                // console.log(e);
                let elevent = this.viewData[k].elEvent;
                if (elevent) {
                    if (elevent.funcName) {
                        if (elevent.params) {
                            if (typeof elevent.params == "object") {
                                this[elevent.funcName](...elevent.params);
                                return;
                            } else {
                                this[elevent.funcName](elevent.params);
                                return;
                            }
                        } else {
                            this[elevent.funcName](e);//未传参数的时候默认是$event
                            return;
                        }
                    }
                    if (elevent.eventFunc) {
                        if (elevent.params) {
                            if (typeof elevent.params == "object") { //多个参数用数组，调用的方法中需要几个参数就写几个参数 funcName(x1,x2,...)
                                elevent.eventFunc(...elevent.params);
                                return;
                            } else {
                                elevent.eventFunc(elevent.params);
                                return;
                            }
                        } else {
                            elevent.eventFunc(e);
                            return;
                        }
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @import '../../outsideDom/smallTemplate/small.less'; //必须加;号

    .input-required input {
        /*border: none;
    box-shadow: 0px 0px 1px 1px #fda8a8;*/
        border: 1px solid #f7cbcb;
    }

    .input-required .el-date-editor--daterange {
        /*border: none;
    box-shadow: 0px 0px 1px 1px #fda8a8;*/
        border: 1px solid #fda8a8;
    }

    .input-required .el-input__inner:hover {
        border: 1px solid #fda8a8;
    }

    .input-required .el-input.is-active .el-input__inner,
    .input-required .el-input__inner:focus {
        border: 1px solid #fda8a8;
    }

    .input-required .el-range-input {
        box-shadow: none;
    }

    h2 {
        font-size: 16px;
        color: #444;
    }

    .rangeDate {
        /deep/ .el-input__prefix {
            display: none;
        }

        /deep/ .el-input__inner {
            padding: 0 12px;
        }
    }

    .itemDisabled {
        cursor: not-allowed;
        background-color: #f0f0f0;

        /deep/ input {
            background-color: #f0f0f0;
        }

        /deep/ label {
            pointer-events: none;
        }

        div {
            pointer-events: none;

            /deep/ .el-input__suffix {
                display: none;
            }
        }
    }

    .contentDisabled {
        cursor: not-allowed;

        /deep/ input {
            background-color: #f0f0f0;
            pointer-events: none;
        }

        /deep/ label {
            pointer-events: none;
        }

        div {
            pointer-events: none;

            /deep/ .el-input__suffix {
                display: none;
            }

            /deep/ input {
                pointer-events: none;
            }
        }
    }

    .searchCmpt {
        /deep/ input {
            border: none;
            text-align: right;
            padding: 0 22px 0 0px;
            color: red;
        }

        /deep/ .el-range-input {
            min-width: 65px;
            border: none;
            padding: 0px;
        }

        /deep/ .el-date-editor--daterange {
            position: relative;
            right: 32px;
            border: none;
            padding: 0px;
        }

        /deep/ .el-range-separator {
            height: 20px;
            line-height: 20px;
        }

        /deep/ .el-select .el-tag {
            color: red;
        }

        .input-item {
            width: 300px;
            min-width: 300px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            border: 1px solid #c0c9d0;
            border-radius: 4px;
            font-size: 14px;
            margin-right: 20px;
            justify-content: space-between;
        }

        .input-title {
            color: #555;
            text-align: left;
            padding-left: 6px;
            // min-width: 80px;
            padding-right: 0px;
            word-break: keep-all;
        }

        .input-content {
            flex-grow: 1;
            overflow: hidden;

            div.whereSelect {
                width: 60px;

                /deep/ input {
                    min-width: 60px;
                    color: #606266;
                }
            }
        }

        .input-content .el-select {
            width: 100%;
        }
    }

    .contentCmpt {
        max-width: 1380px;

        .formCompt-c .el-date-editor .el-range__icon,
        .formCompt-c .el-date-editor .el-icon-date {
            line-height: 8px;
        }

        .input-item {
            width: 280px;
            margin: 4px 0;
            display: flex;
            align-items: center;
        }

        .input-title {
            color: #333;
            width: 110px;
            text-align: right;
            flex-shrink: 0;
            padding-right: 5px;
            height: 28px;
            line-height: 28px;
        }

        .input-content {
            flex-grow: 1;
        }

        .input-content .el-select {
            width: 100%;
        }

        h2 {
            font-size: 16px;
            color: #444;
        }
    }

    .spanSlide {
        width: 105px;
        height: 35px;
        //width:30px;
        //height:30px;
        display: inline-block;
        float: right;
        margin-top: 12px;
        cursor: pointer;
    }

    .slideOff {
        background: url("/boStatic/images/slideOff.png") no-repeat;
    }

    .slideOn {
        background: url("/boStatic/images/slideOn.png") no-repeat;
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
            //  top:-1px;
        }

        /deep/ input {
            border-radius: 0px;
            border-right: none;
        }
    }

    .inputGroup {
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding: 0 4px;

        .page-container-main {
            display: grid;
            /* grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); */
            grid-auto-flow: column;
        }

        .input-title {
            min-width: 10px;
            width: auto;
            padding-right: 0px !important;
        }

        .input-item {
            width: 100%;
            min-width: 10px;
            margin: 0px !important;

            /deep/ input {
                border: none
            }
        }
    }

    .type18content[disabled] {
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        background-color: #f0f0f0;
        height: 28px;
        color: #999;
        display: flex;
        align-items: center;
        font-size: 12px;
    }

    .width100 {
        width: 100%;
    }
</style>