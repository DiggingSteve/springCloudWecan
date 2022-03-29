//  单证制作 -> 总单，分单 -> 详情
<template>
  <div>
    <div
      @mouseenter="inThisTemp=true"
      @mouseleave="inThisTemp=false"
    >
      <div style="position:relative">
<!--       {{formdata}} -->
        <!-- {{needLimit}} -->
        <!-- {{inThisTemp}} -->
        <!-- {{fromPage}} -->
        <!-- {{mawbinfo.ordertype}} -->
        <!-- {{mawbinfo}} -->
        <!-- {{ydtype}} -->
        <!-- {{borderClass}} -->
        <!-- {{zzgDcz}} -->
        <!-- {{orderdom}}
        {{formdata.orderdom}}
         -->
        <!-- {{afreshRateCharge}} -->
        <el-collapse-transition>
          <div
            class="content"
            id="printData"
            v-show="billShow"
            :class="[orderdom!='分单'?'ordermawb':'orderhawb']"
          >
            <el-button
              type="default"
              style="position:absolute;right:14px;top:7px"
              v-if="orderdom!='分单'"
              @click="getBillInfo"
            >刷新数据</el-button>
            <div
              style="padding: 6px;"
              :class="borderClass"
            >
              <span>请选择模板：</span>
              <el-select
                v-model="temVal"
                placeholder="请选择"
                @change="tempChange"
                clearable
              >
                <el-option
                  v-for="(item,index) in temOptions"
                  :key="index"
                  :label="item.templename"
                  :value="item.templename"
                ></el-option>
              </el-select>
            </div>
            <div class="topCon">
              <div class="left">
                <!-- TODO: 收发货人信息   -->
                <template v-if="orderdom!='分单'">
                  <!-- 总单 -->
                  <revSedMawb
                    :dzinfo="formdata"
                    ref="makeBillRevSed"
                    :area="mawbinfo.area"
                    :limitLength="limitLength"
                    pagetype="2"
                    :needLimit="needLimit"
                    :is-order-confirm="comIsOrderConfirm"
                  ></revSedMawb>
                </template>
                <template v-else>
                  <!-- 分单 -->
                  <revSedHawb
                    :dzinfo="formdata"
                    ref="makeBillRevSed"
                    :area="mawbinfo.area"
                    :limitLength="limitLength"
                    pagetype="2"
                    :needLimit="needLimit"
                    :is-order-confirm="comIsOrderConfirm"
                  ></revSedHawb>
                </template>

                <revSed
                  :dzinfo="formdata"
                  pagetype="2"
                  v-if="orderdom!='分单'"
                  :limitLength="limitLength"
                  ref="tzrRev"
                >
                  <el-input
                    slot="textCode"
                    type="textarea"
                    rows="1"
                    placeholder="信用代码"
                    v-model="formdata.taxcode_tzr_mawb"
                    v-verify="'creditCode'"
                  ></el-input>
                </revSed>

                <div class="leftItem">
                  <div
                    class="itemTitle"
                    style="margin:10px 15px"
                  >Issuing Carrier's Agent Name and City</div>
                  <div class="row">
                    <el-input
                      type="textarea"
                      style="margin:0 15px;"
                      v-model="formdata.agentcity"
                      :rows="2"
                      v-verify="'uppercase'"
                    ></el-input>
                  </div>
                </div>

                <div class="leftItem">
                  <div
                    class="row"
                    style="margin-bottom:0px;"
                  >
                    <div class="rowleft">
                      <div class="itemTitle">Agents IATA Code(Accounting_rule)</div>
                      <div style="display:flex;justify-content:space-between">
                        <el-input
                          v-model="formdata.iatacode"
                          v-verify="'uppercase'"
                        ></el-input>
                      </div>
                    </div>
                    <div
                      class="rowright"
                      style="border:none"
                    >
                      <div class="itemTitle">Account No.</div>
                      <div>
                        <el-input
                          v-model="formdata.accountnumber"
                          v-verify="'uppercase'"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="leftItem"
                  style="border:none"
                >
                  <div
                    class="itemTitle"
                    style="margin:10px;"
                  >Airport of Departure(Add. of First Carrier) and Requested Routing</div>
                  <div class="row">
                    <el-input
                      style="margin-left:15px;margin-right:8px;"
                      v-model="sfgquanpin"
                      v-verify="'uppercase'"
                    ></el-input>
                  </div>
                </div>
              </div>

              <div class="right">
                <div
                  class="rightItem"
                  style="height:105px"
                >
                  <div
                    class="row"
                    style="margin-bottom:0px;"
                  >
                    <div style="flex:0 0 150px;">
                      <div class="itemTitle">Not Negotiable</div>
                      <div style="font-weight:900;font-size:18px;margin-top:8px;">AIR WAYBILL</div>
                      <div class="itemTitle">Issued by</div>
                    </div>
                    <div>
                      <!-- {{airinfo}} -->
                      <el-input
                        type="textarea"
                        :rows="4"
                        v-model="airinfo"
                        v-if="orderdom!='分单'"
                        v-verify="'uppercase'"
                      ></el-input>
                    </div>
                  </div>
                </div>

                <div
                  class="rightItem"
                  style="height:65px;"
                  v-if="orderdom=='分单'"
                >
                  <el-input
                    type="textarea"
                    v-model="formdata.loginfo"
                    v-verify="'uppercase'"
                  ></el-input>
                </div>

                <div
                  class="rightItem"
                  :style="{height:orderdom=='分单'?'35px':'100px'}"
                >Copies 1,2 and 3 of this Air Waybill are originals and have the same validity</div>

                <div
                  class="rightItem"
                  style="height:300px;"
                >It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONGS OF CONTARACT ON THE REVERSE HEREOF . ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER,AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE.THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITAION OF LIABILITY .Shipper may increase such inmitaion of liability by declaring a higher value for carriage and paying a supplemental charge if required</div>

                <div
                  class="rightItem"
                  style="height:259px;"
                >
                  <!-- FREIGHT PREPAID -->
                  <el-input
                    type="textarea"
                    v-model="formdata.accountinfo"
                    :rows="10"
                    class="input-required"
                  ></el-input>
                </div>
                <div
                  class="rightItem"
                  style="height:80px;"
                >
                  <div
                    class="itemTitle"
                    style="margin-bottom:10px"
                  >Reference Number</div>
                  <el-input
                    v-model="formdata.referencenumber"
                    v-verify="'uppercase'"
                  ></el-input>
                </div>

                <div
                  class="rightItem"
                  style="height:80px;"
                >
                  <div
                    class="itemTitle"
                    style="margin-bottom:10px"
                  >Optional Shipping Information</div>
                  <el-input
                    v-model="formdata.shippinginfo"
                    v-verify="'uppercase'"
                  ></el-input>
                </div>

                <div class="rightItem ">
                  <span style="height:48px">
                    Nature and Quantity of Goods
                    <br />(incl.Dimensions or Volume)
                  </span>
                  <el-input
                    style="margin:14px 0px"
                    type="textarea"
                    :rows="5"
                    v-model="formdata.pm"
                    v-verify="'uppercase'"
                    class="input-required"
                    :disabled="comIsOrderConfirm"
                  ></el-input>
                  <span style="height:34px;">VOL:{{formdata.zdvolume}} CBM</span>
                </div>
              </div>
            </div>

            <div
              class="row"
              style="margin-bottom:0px;"
              :class="borderClass"
            >
              <div class="itemdiv">
                <span>To</span>
                <el-input
                  :value="formdata.zzg||formdata.mdg"
                  :disabled="comIsOrderConfirm"
                ></el-input>
              </div>
              <div class="itemdiv">
                <span>By First Carrier</span>
                <el-input
                  :value="formdata.hbh&&formdata.hbh.substr(0,2)"
                  :disabled="comIsOrderConfirm"
                ></el-input>
              </div>
              <div class="itemdiv">
                <span>To</span>
                <el-input v-model="formdata.to1" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv">
                <span>By</span>
                <el-input v-model="formdata.by1" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv">
                <span>To</span>
                <el-input v-model="formdata.to2" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv">
                <span>By</span>
                <el-input v-model="formdata.by2" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv">
                <span>Currency</span>
                <el-input v-model="formdata.currency" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv">
                <span>
                  CHGS
                  <br />Code
                </span>
              </div>
              <div class="itemdiv" style="flex:0 0 130px">
                <span>WT/VAL</span>
                <el-radio
                  v-model="formdata.wtpaymode"
                  label="PP"
                  :disabled="orderdom=='分单'&&comIsOrderConfirm"
                >PP</el-radio>
                <el-radio
                  v-model="formdata.wtpaymode"
                  label="CC"
                  :disabled="orderdom=='分单'&&comIsOrderConfirm"
                >CC</el-radio>
              </div>
              <div class="itemdiv" style="flex:0 0 130px">
                <span>Other</span>
                <el-radio
                  v-model="formdata.otherpaymode"
                  label="PP"
                >PP</el-radio>
                <el-radio
                  v-model="formdata.otherpaymode"
                  label="CC"
                >CC</el-radio>
              </div>

              <div class="itemdiv" style="flex:0 0 150px">
                <span>
                  Declared
                  <br />Value for Carriage
                </span>
                <el-input v-model="formdata.declarecarriage" v-verify="'uppercase'"></el-input>
              </div>
              <div class="itemdiv" style="border:none;flex:0 0 150px">
                <span>
                  Declared
                  <br />Value for Customs
                </span>
                <el-input v-model="formdata.declarecustom" v-verify="'uppercase'"></el-input>
              </div>
            </div>

            <div
              class="row"
              style="margin-bottom:0px;"
              :class="borderClass"
            >
              <div class="itemdiv">
                <div>Airport of Destination</div>
                <el-input v-model="mdgquanpin"></el-input>
              </div>
              <div class="itemdiv">
                <div>Flight No</div>
                <el-input v-model="formdata.hbh"></el-input>
              </div>
              <div class="itemdiv">
                <div>Flight Date</div>
                <el-input :value="formdata.hbrq | airdate"></el-input>
              </div>
              <div class="itemdiv">
                <div>Amount of Insurance</div>
                <div>
                  <el-input
                    v-model="formdata.insuranceamount"
                    style="display:inline-block;margin-right:4%"
                    v-verify="'uppercase'"
                  ></el-input>
                </div>
              </div>
              <div
                class="itemdiv"
                style="border:none;flex:0 0 460px"
              >INSURANCE - If carrier offers insurance,and such Insurance is requested in accordance with the connditions thereof,indicate amount to be insured in figures in box marked"Amount of Insurance".</div>
            </div>

            <div
              class="row"
              style="margin-bottom:0px;"
            >
              <div
                class="itemdiv"
                style="border:none;"
              >
                <div>Handing Information</div>
                
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="formdata.handlinginfo"
                  v-verify="'uppercase'"
                  class="input-required"
                  style="background: #f0f0f0;"
                  :disabled="comIsOrderConfirm"
                ></el-input>
              </div>
            </div>
            <div
              class="row"
              :class="borderClass"
              style="margin-bottom:0px;padding:0px 8px;padding-bottom:4px;justify-content:flex-start;align-items:center"
            >
              <span v-if="orderdom!='分单'">Special Handing Code</span>
              <span v-if="orderdom!='分单'" style="margin-left:10px;margin-right:20px;">
                <el-checkbox-group v-model="descriptioncode">
                  <el-checkbox
                    :label="item.typename"
                    v-for="item in descriptioncodeOptions"
                    :key="item.typename"
                  ></el-checkbox>
                </el-checkbox-group>
              </span>

              <span style="margin-left:20px;margin-right:50px;">
                <el-checkbox :label="asAed" v-model="isarranged"></el-checkbox>
              </span>
            </div>

            <div
              class="row"
              :class="borderClass"
              style="margin-bottom:0px;padding:8px;padding-bottom:4px;justify-content:flex-start;align-items:center"
            >
              <span v-if="orderdom!='分单'" style="height:14px;margin:0 5px;">Goods</span>
              <span v-if="orderdom!='分单'" style="margin-right:40px;">
                <el-input v-model="formdata.goods"></el-input>
              </span>
              <span style="height:14px;margin:0 5px;">SLAC</span>
              <el-input
                v-model="formdata.smallpiece"
                style="flex:0 0 120px"
                v-verify="'integer'"
                class="input-required"
              ></el-input>
              <el-checkbox
                v-model="smallpieceChecked"
                style="margin-left:6px;"
                title="选中后会在打印界面显示小件数，否则打印不显示"
              ></el-checkbox>
              <span
                style="height:14px;margin-top:-5px;"
                v-if="orderdom=='分单'"
              >是否打印分单尺寸</span>
              <el-checkbox
                v-model="showHawbSizeChecked"
                style="margin-left:6px;"
                v-if="orderdom=='分单'"
                title="选中后会在打印界面的备注中显示分单尺寸信息"
              ></el-checkbox>
            </div>

            <div
              style="display:flex;width:100%;"
              :class="borderClass"
            >
              <div style="width:55%;">
                <div
                  class="row"
                  :class="borderClass"
                  style="margin-bottom:0px;padding:6px;"
                  v-show="mawbinfo.pagetype!=21"
                >实际制单(用于正本运单打印)</div>
                <div
                  class="row"
                  style="margin-bottom:0px;"
                  :class="borderClass"
                  v-show="mawbinfo.pagetype!=21"
                >
                  <div class="itemdiv">
                    <span>No.of Piece RCP</span>
                    <el-input :disabled="pagetype!=2" v-model="formdata.zdpiece"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Gross Weight(K/G)</span>
                    <el-input :disabled="pagetype!=2" v-model="formdata.zdweight"></el-input>
                  </div>
                  <!-- TODO: 制单件/重/体中的体 -->
                  <div class="itemdiv">
                    <span>Vol</span>
                    <el-input
                      :disabled="(pagetype!=2&&orderdom!='分单')||comIsOrderConfirmI"
                      v-model="formdata.zdvolume"
                      v-verify="'float'"
                    ></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Rate Class</span>
                    <el-input
                      v-model="formdata.ratelevel"
                      v-verify="'english'"
                      class="input-required"
                    ></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Commodity Item No.</span>
                    <el-input v-model="formdata.prodnumber" v-verify="'uppercase'"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Chargeable Weight(K/G)</span>
                    <el-input
                      v-model="formdata.jfweight"
                      :disabled="(orderdom!='分单'&&mawbinfo.area==conditionalAreaForBuild)||comIsOrderConfirmI"
                    ></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Rate/Charge</span>
                    <el-input v-model="formdata.rate"></el-input>
                  </div>
                  <div class="itemdiv" style="border:none;">
                    <span>Total</span>
                    <el-input v-model="formdata.ratetotal" :disabled="pagetype!=2"></el-input>
                  </div>
                </div>
                <div
                  class="row"
                  :class="borderClass"
                  style="margin-bottom:0px;padding:6px"
                >{{mawbinfo.pagetype==21?"实际制单(用于正本运单打印)":'客户制单(用于客户运单打印)'}}</div>
                <div
                  class="row pointerAll"
                  style="margin-bottom:0px;background-color:#FFF2E3"
                  :class="borderClass"
                >
                  <div class="itemdiv">
                    <span>No.of Piece RCP</span>
                    <el-input v-model="mawbinfo.zdpiece"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Gross Weight(K/G)</span>
                    <el-input v-model="formdata.zdweight_cus"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Vol</span>
                    <el-input v-model="formdata.zdvolume_cus" v-verify="'float'"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Rate Class</span>
                    <el-input v-model="formdata.ratelevel_cus" v-verify="'english'"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Commodity Item No.</span>
                    <el-input v-model="formdata.prodnumber" v-verify="'uppercase'"></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Chargeable Weight(K/G)</span>
                    <el-input
                      v-model="formdata.jfweight_cus"
                      :disabled="orderdom!='分单'&&mawbinfo.area==conditionalAreaForBuild"
                    ></el-input>
                  </div>
                  <div class="itemdiv">
                    <span>Rate/Charge</span>
                    <el-input v-model="formdata.rate_cus"></el-input>
                  </div>
                  <div class="itemdiv" style="border:none;">
                    <span>Total</span>
                    <el-input v-model="formdata.ratetotal_cus" :disabled="pagetype!=2"></el-input>
                  </div>
                </div>

                <div class="row" style="margin-bottom:0px;">
                  <div class="itemdiv" style="border:none;">
                    <div>REMARK</div>
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="formdata.remark"
                      v-verify="'uppercase'"
                    ></el-input>
                  </div>
                </div>
              </div>

              <div
                class="itemdiv"
                style="border:none;width:45%;border-left:1px solid #e8e8e8"
                :class="borderClass"
              >
                <!-- <span style="height:48px">
          Nature and Quantity of Goods
          <br />(incl.Dimensions or Volume)
        </span>
        <el-input
          type="textarea"
          :rows="5"
          v-model="formdata.pm"
          v-verify="'uppercase'"
          class="input-required"
        ></el-input>
                <span style="height:34px">VOL:{{mawbinfo.zdvolume}} CBM</span>-->

                <commonTable
                  :head="tableHead"
                  :table-data="tableData"
                  v-if="orderdom!='分单'"
                  style="margin-bottom:14px;"
                ></commonTable>
                <wageListTable
                  :tableData="formdata.wagelist"
                  :wagelistOriginalData="wagelistOriginalData"
                  :mawbinfo="formdata"
                  :guid="mawbinfo.guid"
                ></wageListTable>
              </div>
            </div>

            <div class="row" style="margin-bottom:10px;margin-top:10px;">
              <div>
                <span style="margin:10px;">实际制单人</span>
                <el-input
                  style="width:100px;"
                  v-model="formdata.addman"
                  v-verify="'uppercase'"
                  disabled
                ></el-input>
                <span style="margin:10px;">实际制单日期</span>
                <el-date-picker
                  style="width:180px;"
                  v-model="formdata.adddate"
                  type="datetime"
                  placeholder
                  disabled
                ></el-date-picker>

                <span style="margin:10px;">修改人</span>
                <el-input
                  style="width:100px;"
                  v-model="formdata.modifyman"
                  v-verify="'uppercase'"
                  disabled
                ></el-input>
                <span style="margin:10px;">修改日期</span>
                <el-date-picker
                  v-model="formdata.modifydate"
                  style="width:180px;"
                  type="datetime"
                  placeholder
                  disabled
                ></el-date-picker>

                <span
                  style="margin:10px;"
                  v-if="orderdom!='分单'"
                >atplace</span>
                <el-input
                  style="width:180px;"
                  v-model="formdata.atplace"
                ></el-input>

                <span style="margin:8px;">签名</span>
                <el-input
                  style="width:100px;"
                  v-model="formdata.agent"
                ></el-input>
              </div>
            </div>
          </div>
        </el-collapse-transition>

        <div
          class="row"
          style="margin-bottom:10px;margin-top:10px;"
        >
          <div
            style="text-align:right;margin-right:15px;"
            v-show="(pagetype!=2||mawbguid!=-1)&&billShow"
            :class="{bottomBtnFixed:bottomFixed, 'bottom-tip': isOrderConfirm}"
          >
            <!-- <el-button @click="saveBillInfo">完成待确认</el-button> -->
            <template v-if="mawbinfo.area==conditionalAreaForBuild&&mawbinfo.pagetype&&!isPaper&&!isOrderConfirm">
              
              <el-button
                @click="billprintDialog=true"
                style="pointer-events:auto"
                type="danger"
                v-if="projectIsWecan"
              >预打印</el-button>
              <el-button
                @click="delDzmake"
                style="pointer-events:auto"
                type="danger"
                v-if="!projectIsWecan"
              >删除制单</el-button>
              <slot name="button"></slot>
              <!-- <el-button @click="printFuncYdy()" style="pointer-events:auto" type="danger">预打印</el-button> -->
            </template>
            <template v-else>
              <el-radio
                v-model="ydtype"
                label="1"
                v-if="!isOrderConfirm"
              >中性运单</el-radio>
              <el-radio
                v-model="ydtype"
                label="2"
                v-if="!isOrderConfirm"
              >油性运单</el-radio>
              <el-button
                @click="printFunc(1,2,true)"
                style="pointer-events:auto"
                type="primary"
                :disabled="buttonDisabled"
              >正本运单打印
              </el-button>
              <el-button
                @click="printFunc(1,2)"
                style="pointer-events:auto"
                type="primary"
                v-if="!isOrderConfirm"
              >
                A4纸运单打印
              </el-button>
              <el-button
                @click="showOrderDialog(1)"
                style="pointer-events:auto"
                type="primary"
                v-if="isOrderConfirm"
                :disabled="buttonDisabled"
              >
                A4纸运单打印(阳单)
              </el-button>
              <el-button
                @click="printFunc(2,2,false,1)"
                style="pointer-events:auto"
                type="primary"
                v-if="orderdom!='分单'&&!isOrderConfirm"
              >客户运单打印
              </el-button>
              <el-button
                @click="showOrderDialog(2)"
                style="pointer-events:auto"
                type="primary"
                v-if="isOrderConfirm"
                :disabled="buttonDisabled"
              >
                A4纸运单打印(阴单)
              </el-button>
              <!-- <el-button @click="printFuncYdy()" style="pointer-events:auto" type="danger">预打印</el-button> -->
              <el-button
                @click="billprintDialog=true"
                style="pointer-events:auto"
                type="danger"
                v-if="projectIsWecan&&!isOrderConfirm"
              >预打印</el-button>
              <el-button
                @click="printFunc(1,2)"
                style="pointer-events:auto"
                type="primary"
                :disabled="buttonDisabled"
              >打印设置</el-button>
              <el-button
                @click="saveBillInfo"
                style="pointer-events:auto"
                type="primary"
                v-show="!hideSaveBtn"
                v-hide="isHideButton"
              >保存制单信息</el-button>
              <el-button
                @click="delDzmake"
                style="pointer-events:auto"
                type="danger"
                v-if="!projectIsWecan||mawbinfo.area!=conditionalAreaForBuild"
              >删除制单</el-button>

              <slot name="button"></slot>
            </template>
          </div>
        </div>

        <el-dialog
          :visible.sync="lxrShow"
          v-if="lxrShow"
          append-to-body
          width="1000px"
          title="联系人信息"
          center
        >
          <!-- {{formdata}} -->
          <mawbContacts
            :inputModelData="mawbinfo"
            :mawbguid="mawbinfo.guid"
            :orderdom="formdata.orderdom"
            :zdsid="formdata.sid"
            v-if="mawbinfo.guid&&lxrShow"
            pagetype="2"
            @sendEmailSuccess="sendEmailSuccess"
          ></mawbContacts>
        </el-dialog>

         <el-dialog
          :visible.sync="billprintDialog"
          v-if="billprintDialog"
           top="25vh"
          append-to-body
          width="600px"
          title="请选择打印方式"
          center
        >
          <div style="height:100px;display: flex;align-items: center;justify-content: center;">
            <el-button
              @click="printFuncYdy(2)"
              type="default"
            >发送并打印</el-button>
            <el-button
              @click="printFuncYdy(1)"
              type="primary"
            >直接打印(A4)</el-button>
            <el-button
              @click="printFuncYdy(3)"
              type="primary"
            >直接打印(正本)</el-button>
          </div>

        </el-dialog>

        <!-- 中性运单，油性运单 单选框 弹窗 -->
        <el-dialog
          title="打印类型选择"
          :visible.sync="orderTypeDialogVisible"
          width="350px"
          append-to-body
          @open="ydtype='1'"
        >
          <div>
            <el-radio
              v-model="ydtype"
              label="1"
            >中性运单
            </el-radio>
            <el-radio
              v-model="ydtype"
              label="2"
            >油性运单
            </el-radio>
          </div>
          <div slot="footer">
            <el-button @click="orderTypeDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="printOrder"
            >打 印</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// 默认LOGINFO值
const LOGINFO = `Flexport International(Shanghai) Co.Ltd. 
Wework, 5/F, Yueshang Plaza, 
1 Wuning S Road,
Jing’an District, Shanghai,  China
Post Code: 200042`

import {
  getPdf,
  getMomentDate,
  computedWeight,
  formatDate
} from "../../api/localStorage.js";
import { getLodop } from "../../api/LodopFuncs.js";
import wageListTable from "./wageListTable";
import makeBillRevSed from "../templates/makeBillRevSed";
import revSed from "../templates/revSed";
import revSedMawb from "../templates/revSedMawb";
import revSedHawb from "../templates/revSedHawb";
import mawbContacts from "./mawbContacts";

export default {
  components: {
    wageListTable,
    makeBillRevSed,
    revSed,
    revSedMawb,
    revSedHawb,
    mawbContacts
  },
  props: {
    mawbguid: [Number, String],
    orderdom: {
      type: String,
      default: "总单"
    },
    mawbinfo: {
      type: Object,
      default() {
        return {};
      }
    },
    hawbBillData: {
      ////当分单的时候的分单数据
      type: Object,
      default() {
        return {};
      }
    },
    servicecode: {
      type: String,
      default: ""
    },
    pagetype: {
      type: [Number],
      default: 1 //1默认空出 2国内服务
    },
    isams: {
      type: Boolean,
      default: false
    },
    bottomFixed: {
      //底部按钮组是否固定底部
      type: Boolean,
      default: false
    },
    billShow: {
      type: Boolean,
      default: true
    },
    hideSaveBtn: {
      //总分单确认页面需要隐藏保存按钮
      type: Boolean,
      default: false
    },
    needLimit: {
      //是否需要判断必填，总分单确认里面需要动态判断是否必填
      type: Boolean,
      default: true
    },
    mawbhawbLinkage: {
      //外面的详细是否需要与制单里面的收发货人联动
      type: Boolean,
      default: false
    },
    fromPage: String, //从那个页面来，如果值是billmake,代表单证制作，需要传给后台true
    afreshRateCharge:{//从单证制作已修改页面进去的总运单制作信息的Rate/Charge每次都去取
      type: Boolean,
      default: false
    },
    isPaper: {
      type: Boolean,
      default: false,
    },
    isOrderConfirm: {
      type: Boolean,
      default: false,
    },
     isSynchronism: { // 是否同步handling Info
      type: Boolean,
      default: false,
    },
    activeName: { // 当前激活tab
      type: String,
      default: ''
    },
  },
  data() {
    return {
      inThisTemp: false,
      formdata: {},
      tableHead: [
        { title: "类型", field: "type" },
        { title: "件重体", field: "jztinfo" },
        { title: "计费重量", field: "jfweight" }
      ],
      tableData: [
        { type: "预报", jztinfo: "", jfweight: "" },
        { type: "实际", jztinfo: "", jfweight: "" },
        { type: "制单", jztinfo: "", jfweight: "" }
      ],
      airinfo: "",
      backairinfo: "", // done: 2021-7-6 madarong 备份airinfo
      ppothertotal: 0,
      mdgquanpin: "",
      sfgquanpin: "",
      wagelistBackups: [],
      wagelistOriginalData:[],//PubAirCompanyAreaPrice接口的原数据
      temVal: "", //模板值
      temOptions: [], //模板选项
      ydtype: "1", //运单类型
      smallpieceChecked: false,
      showHawbSizeChecked:false,
      lxrShow: false,
      zzgDcz:'',
      billprintDialog:false,
      smallpieceBackup:0,

      orderTypeDialogVisible: false, // 显示中性运单， 油性运单的单选框的弹窗
      orderType: null, // 标记是阳单， 1： 阳单， 2：阴单

    };
  },
  methods: {
        async delDzmake(type) {//恒丰删除总单制作与分单制作
        //type 1总单 2分单
         let confirm = await this.$confirm("是否确认删除？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          });

          if (!confirm) return;

            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + this.ajaxUrl,
              data: {
                czman: localStorage.usrname,
                guid: this.mawbguid
              },
              loading: true,
              noarea: true,
              tip: false
            }).then(results => {
              if (results.data.resultstatus == 0) {
                this.$message.success(results.data.resultmessage);
              } else {
                this.$message.error(results.data.resultmessage);
              }
            });
    },
    initForm() {

      if (this.orderdom != "分单") {
        this.formdata = {
          sid: "",
          guid: -1,
          code_fhr_mawb: "",
          companytitle_fhr_mawb: "",
          address_fhr_mawb: "",
          city_fhr_mawb: "",
          postcode_fhr_mawb: "",
          companycode_fhr_mawb: "",
          state_fhr_mawb: "",
          lxr_fhr_mawb: "",
          phone_fhr_mawb: "",
          email_fhr_mawb: "",
          fax_fhr_mawb: "",
          code_shr_mawb: "",
          companytitle_shr_mawb: "",
          address_shr_mawb: "",
          city_shr_mawb: "",
          postcode_shr_mawb: "",
          companycode_shr_mawb: "",
          state_shr_mawb: "",
          lxr_shr_mawb: "",
          phone_shr_mawb: "",
          email_shr_mawb: "",
          fax_shr_mawb: "",
          agentcity: this.agentcity,
          agent: "",
          atplace: "",
          iatacode: "",
          accountnumber: "",
          referencenumber: "",
          to1: "",
          by1: "",
          to2: "",
          by2: "",
          to3: "",
          by3: "",
          accountinfo: "FREIGHT PREPAID",
          shippercertify: "",
          currency: "CNY",
          wtpaymode: "",
          otherpaymode: "",
          declarecarriage: "NVD",
          declarecustom: "NCV",
          insuranceamount: "XXX",
          handlinginfo: "NO SOLID WOODEN PACKING MATERIAL",
          zdpiece: "",
          zdweight: "",
          zdvolume: "",
          ratelevel: "",
          rate: "",
          ratetotal: "",
          prodnumber: "",
          descriptioncode: "",
          pm: "",
          ppvaluation: "",
          ccvaluation: "",
          wagelist: [],
          fm1: "",
          fm2: "",
          mawbmdg: "",
          hbh: "",
          hbrq: "",
          jfweight: "",
          isarranged: 2, //1选中 2，未选中
          remark: "",
          wtfffs: "",
          otherfffs: "",
          zdweight_cus: "",
          zdvolume_cus: "",
          jfweight_cus: "",
          ratelevel_cus: "",
          rate_cus: "",
          ratetotal_cus: "",
          code_tzr_mawb: "",
          companytitle_tzr_mawb: "",
          address_tzr_mawb: "",
          city_tzr_mawb: "",
          postcode_tzr_mawb: "",
          companycode_tzr_mawb: "",
          state_tzr_mawb: "",
          lxr_tzr_mawb: "",
          phone_tzr_mawb: "",
          email_tzr_mawb: "",
          fax_tzr_mawb: "",
          taxcode_tzr_mawb: "",
          goods: "",
          shippinginfo: "",
          smallpiece: ""
        };
      } else {
        this.formdata = {
          sid: "",
          guid: -1,
          code_fhr_hawb: "",
          companytitle_fhr_hawb: "",
          address_fhr_hawb: "",
          city_fhr_hawb: "",
          postcode_fhr_hawb: "",
          companycode_fhr_hawb: "",
          state_fhr_hawb: "",
          lxr_fhr_hawb: "",
          phone_fhr_hawb: "",
          email_fhr_hawb: "",
          fax_fhr_hawb: "",
          code_shr_hawb: "",
          companytitle_shr_hawb: "",
          address_shr_hawb: "",
          city_shr_hawb: "",
          postcode_shr_hawb: "",
          companycode_shr_hawb: "",
          state_shr_hawb: "",
          lxr_shr_hawb: "",
          phone_shr_hawb: "",
          email_shr_hawb: "",
          fax_shr_hawb: "",
          agentcity: this.agentcity,
          agent: "",
          atplace: "",
          iatacode: "",
          accountnumber: "",
          referencenumber: "",
          to1: "",
          by1: "",
          to2: "",
          by2: "",
          to3: "",
          by3: "",
          accountinfo: "FREIGHT PREPAID",
          shippercertify: "",
          currency: "CNY",
          wtpaymode: "",
          prodnumber: "",
          descriptioncode: "",
          otherpaymode: "",
          declarecarriage: "NVD",
          declarecustom: "NCV",
          insuranceamount: "XXX",
          handlinginfo: "",
          zdpiece: "",
          zdweight: "",
          zdvolume: "",
          ratelevel: "",
          rate: "",
          ratetotal: "",
          pm: "",
          ppvaluation: "",
          ccvaluation: "",
          wagelist: [],
          fm1: "",
          fm2: "",
          mawbmdg: "",
          hbh: "",
          hbrq: "",
          jfweight: "",
          isarranged: 1, //1选中
          remark: "",
          wtfffs: "",
          otherfffs: "",
          zdweight_cus: "",
          zdvolume_cus: "",
          jfweight_cus: "",
          ratelevel_cus: "",
          rate_cus: "",
          ratetotal_cus: "",
          shippinginfo: "",
          smallpiece: ""
        };
      }

      this.formdata.addman = localStorage.getItem("usrname");
      this.formdata.adddate = getMomentDate();
      this.formdata.wtpaymode =this.formdata.wtpaymode|| this.mawbinfo.paymode;
      this.formdata.otherpaymode =this.formdata.otherpaymode|| this.mawbinfo.paymode;
      this.formdata.to1 = this.mawbinfo.zzg;
      this.formdata.pm = this.mawbinfo.englishpm;
    },
    getAirinfo() {
      if (!localStorage.getItem("airinfo")) {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubAirCompany",
          params: { area: this.mawbinfo.area },
          loading: false,
          tip: false
        }).then(results => {
          //console.log('航空信息')
          //console.log(results.data)
          localStorage.setItem("airinfo", JSON.stringify(results.data));
          results.data.forEach(i => {
            if (!this.mawbinfo.mawb) {
              return "";
            }
            if (i.ThreeCode == this.mawbinfo.mawb.substr(0, 3)) {
              // done: 2021-7-6 madarong 备份airinfo
              let airinfo = i.ZxydTitle
              this.airinfo = airinfo;
              this.backairinfo = airinfo
            }
          });
        });
      } else {
        var airinfo = JSON.parse(localStorage.getItem("airinfo"));
        airinfo.forEach(i => {
          if (!this.mawbinfo.mawb) {
            return "";
          }
          if (i.ThreeCode == this.mawbinfo.mawb.substr(0, 3)) {
            // done: 2021-7-6 madarong 备份airinfo
              let airinfo = i.ZxydTitle
              this.airinfo = airinfo;
              this.backairinfo = airinfo
          }
        });
      }
    },

    // 获取bill信息
    async getBillInfo() {


      await this.$axios({
        method: "get",
        url: this.$store.state.webApi + this.ajaxUrl,
        params: {
          sid:
            this.orderdom != "分单" ? this.mawbguid : this.mawbinfo.guid || -1,
          area: this.mawbinfo.area || this.$store.state.areaState,
          billmake: !!this.fromPage
        },
        loading: false,
        tip: false
      }).then(results => {
       // console.log("查询制单信息")
      //  console.log(results.data);
        if (!results.data) {
          this.initForm();
        } else {
          this.initForm();
          this.formdata = Object.assign({}, this.formdata, results.data);
          //  this.formdata = results.data;
        }
        //console.log(this.formdata);

        this.accountinfo = this.formdata.accountinfo;
        this.handlinginfo = this.formdata.handlinginfo;
        this.pm = this.formdata.pm;

         // done: 2021-7-6 madarong remark初使值，重置时用
          this.remark = this.formdata.remark;


// console.log(1111)
// console.log(this.formdata.wagelist)
        this.wagelistBackups = JSON.stringify(this.formdata.wagelist) || [];

        this.formdata.jfweight =
       this.formdata.jfweight || this.mawbinfo.jfweight||0;
        this.formdata.jfweight_cus =
          this.formdata.jfweight_cus || this.mawbinfo.jfweight||0;

         if(this.orderdom=='分单'){
           this.formdata.jfweight=Math.round(this.formdata.jfweight)
           this.formdata.jfweight_cus=Math.round(this.formdata.jfweight_cus)
         }
        //  console.log(this.orderdom)
        //  console.log(this.formdata.jfweight_cus)

        this.formdata.zdweight_cus =
          this.formdata.zdweight_cus || this.mawbinfo.zdweight;
        this.formdata.zdvolume_cus =
          this.formdata.zdvolume_cus || this.mawbinfo.zdvolume;
        this.formdata.hbh = this.formdata.hbh || this.mawbinfo.hbh;
        this.formdata.hbrq = this.formdata.hbrq || this.mawbinfo.hbrq;

        this.formdata.otherpaymode = this.formdata.otherpaymode || "PP";
        this.formdata.wtpaymode = this.formdata.wtpaymode || "PP";          
        if(!this.formdata.zdvolume||this.formdata.zdvolume=='0'){
          this.formdata.ratelevel=''
        } 
         if(!this.formdata.zdvolume_cus||this.formdata.zdvolume_cus=='0'){
          this.formdata.ratelevel_cus=''
        } 
        if (this.formdata.guid == -1) {
          if (this.formdata.zzg && this.formdata.zzg != this.formdata.mdg) {
            this.formdata.to1 = this.formdata.mdg;
            this.formdata.by1 =
              this.formdata.hbh && this.formdata.hbh.substr(0, 2);
          } else {
            this.formdata.to1 = "";
            this.formdata.by1 = "";
            this.formdata.to2 = "";
            this.formdata.by2 = "";
          }
        }

        this.formdata.agentcity = this.formdata.agentcity || this.agentcity;
        this.formdata.agent = this.formdata.agent || this.formdata.agentcity;
        this.formdata.atplace = this.formdata.atplace || this.sfgquanpin;
        if (this.formdata.atplace) {
          this.$watch(
             function() {
              return this.sfgquanpin;
            },
            function(value) {
              if (!this.formdata.atplace) {
                this.formdata.atplace = value;
              }
              
            }
          )
        }
        this.formdata.adddate = formatDate(
          this.formdata.adddate,
          "yyyy-MM-dd hh:mm:ss"
        );

        // this.formdata.smallpiece =
        //   this.formdata.smallpiece || this.formdata.zdpiece;

        this.$nextTick(()=>{
          this.$set(this.formdata,'smallpiece',this.formdata.smallpiece || this.formdata.zdpiece)
        })
          
  
        //console.log(this.formdata.smallpiece)

        this.smallpieceChecked = this.formdata.isprint == 1;
        this.formdata.area = this.formdata.area || this.mawbinfo.area;
        this.formdata.gid = this.formdata.gid || this.mawbinfo.gid;
        this.formdata.mdg = this.formdata.mdg || this.mawbinfo.mdg;
        this.formdata.sfg = this.formdata.sfg || this.mawbinfo.sfg;
        this.formdata.zdpiece = this.formdata.zdpiece || this.mawbinfo.zdpiece;
        this.formdata.zdweight =
          this.formdata.zdweight || this.mawbinfo.zdweight;
          this.smallpieceBackup= this.formdata.smallpiece //记录初始小件数，以判断是否修改过，如果修改需要将分单上的小件数累加赋值到详细上

        this.formdata.modifydate = formatDate(
          this.formdata.modifydate,
          "yyyy-MM-dd hh:mm"
        );


        
        let result = this.getLoginfo()
        if(result){
          this.formdata.loginfo = result;
        }


        // done: 2021-7-6 madarong loginfo初使值，重置时用
        if(this.formdata.loginfo) {
           this.loginfo = JSON.parse(JSON.stringify(this.formdata.loginfo))
        } else {
           this.loginfo = ''
        }
       
      

        // this.hbInfoChanged=`${this.formdata.sfg}${this.formdata.mdg}${this.formdata.yqhbh}${this.formdata.yqhbrq}${this.formdata.hwxz}${this.formdata.hwlx}`

        // if(this.mawbinfo.czlx=='代操作'){
        //   this.smallpieceChecked=true;
        // }


      });



      return true;
    },

    // done: 分单获取logInfo
    getLoginfo() {
      if (
          this.orderdom == "分单" &&
          this.formdata.gid &&
          this.formdata.gid == 6579
        ) {
          return LOGINFO;
        } else {
          return ''
        }
    },


    getInfo(status, needTest = true) {
      if (needTest) {
        if (
          this.$refs.makeBillRevSed &&
          this.$refs.makeBillRevSed.ifHasLimit()
        ) {
          this.$message.error("请检查收发货人信息是否超出字符限制！");
          return false;
        }
        if (this.$refs.tzrRev && this.$refs.tzrRev.ifHasLimit()) {
          this.$message.error("请检查通知人信息是否超出字符限制！");
          return false;
        }

        if (this.orderdom != "分单") {
          /*      if (
          parseInt(this.mawbinfo.zdpiece) != parseInt(this.mawbinfo.realpiece)
        ) {
          this.$message.error("制单件数与实际件数不匹配！");
          return;
        }
 */
          if (!this.formdata.accountinfo) {
            this.$message.error("请填写accountinfo");
            return;
          }
          if (!this.formdata.handlinginfo) {
            this.$message.error("请填写Handing Information");
            return;
          }

          if (status != 1) {
            if (!this.formdata.smallpiece) {
              this.$message.error("请填写小件数");
              return;
            }
          }

          if (!this.formdata.pm) {
            this.$message.error("请填写品名");
            return;
          }

          if (this.orderType === 2) { // 阴单打印校验
            if (!this.formdata.ratelevel_cus) {
              this.$message.error("请填写客户制单费率");
              return;
            }
          } else { // 阳单，其它打印校验
            if (!this.formdata.ratelevel) {
              this.$message.error("请填写实际制单费率");
              return;
            }
          }
          
        }
      }

      var json = JSON.parse(JSON.stringify(this.formdata));
      json.zdpiece = json.zdpiece || this.mawbinfo.zdpiece;
      json.zdweight = json.zdweight || this.mawbinfo.zdweight;
      json.zdvolume = json.zdvolume || this.mawbinfo.zdvolume;
      json.jfweight = json.jfweight || this.mawbinfo.jfweight;

      json.zdweight_cus = json.zdweight_cus || this.mawbinfo.zdweight;
      json.zdvolume_cus = json.zdvolume_cus || this.mawbinfo.zdvolume;
      json.jfweight_cus = json.jfweight_cus || this.mawbinfo.jfweight;
      json.isprint = this.smallpieceChecked ? 1 : 2;



      var wagelist = JSON.parse(JSON.stringify(json.wagelist));
      if (this.wagelistBackups && this.wagelistBackups.length > 0) {
        JSON.parse(this.wagelistBackups).forEach(el => {
          var n = false;
          json.wagelist.forEach((item, i) => {
            if (el.guid == item.guid) {
              n = true;
              if (JSON.stringify(el) == JSON.stringify(item)) {
                // wagelist.splice(i, 1);
                wagelist[i].isdel = 1;
              }
            }
          });
          if (!n) {
            wagelist.push({ guid: el.guid, isdel: 2, sid: -1 });
          }
        });
      }
      json.sid = this.mawbguid;
      json.wagelist = wagelist;
      //console.log(JSON.stringify(json));

      // json.smallpiece=json.smallpiece||this.mawbinfo.smallpiece
      // json.pm=json.pm||this.mawbinfo.englishpm
      json.area = json.area || this.mawbinfo.area;
      // console.log(json)
      if (this.needLimit) {
        if (this.orderdom != "分单") {
          if (
            !json.companytitle_fhr_mawb ||
            !json.address_fhr_mawb ||
            !json.companycode_fhr_mawb ||
            !json.city_fhr_mawb ||
            !json.postcode_fhr_mawb ||
            !json.companytitle_shr_mawb ||
            !json.address_shr_mawb ||
            !json.companycode_shr_mawb ||
            !json.city_shr_mawb ||
            !json.postcode_shr_mawb
          ) {
            this.$message.error(
              "收发货人的抬头、地址、国家二字码、城市、邮编为必填！"
            );
            return;
          }
        } else {
          if (
            !json.companytitle_fhr_hawb ||
            !json.address_fhr_hawb ||
            !json.companycode_fhr_hawb ||
            !json.city_fhr_hawb ||
            !json.companytitle_shr_hawb ||
            !json.address_shr_hawb ||
            !json.companycode_shr_hawb ||
            !json.city_shr_hawb
          ) {
            this.$message.error(
              "收发货人的抬头、地址、国家二字码、城市为必填！"
            );
            return;
          }
        }
      }
      if(json.smallpiece<json.zdpiece){
       this.$message.error('小件数不能小于制单件数！'); return
      }
      return json;
    },
    async saveBillInfo(status, needTest=true,type) {
      //在总分单确认页面保存时传1，代表未真正制单
      //needTest 是否需要验证
     
      var json = this.getInfo(status, needTest);
      let success = false;

      if (!json) {
        return;
      }
      if (status == 1) {
        json.zdstatus = 1;
      } else if (status == 3) {
        json.zdstatus = 500;
      }

      var method = json.guid == -1 ? "post" : "put";
      json.area = this.mawbinfo.area || this.$store.state.areaState;
      json.billmake = !!this.fromPage;
     
    //  if (this.mawbinfo.ordertype == 3) {
    //     return true;
    //   }

     let flag="";
     if(json.jfweight!=computedWeight(
            json.zdvolume,
            json.zdweight,
            json.orderdom=='分单'
          )&&type==1){
            flag='实际制单计费重量不等于体积重量，是否继续保存！'
          }
                 
       
     if(json.jfweight_cus!=computedWeight(
            json.zdvolume_cus,
            json.zdweight_cus,
            json.orderdom=='分单'
          )&&type==2){
            flag="客户制单计费重量不等于体积重量，是否继续保存！"
          }
          
      if(flag&&needTest){
        let confirm = await this.$confirm(flag, "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
          if (!confirm) return;
      }

      if ( status == 99) {
         this.$emit("success")
          this.getBillInfo();
      } else {
          await this.$axios({
        method: method,
        url: this.$store.state.webApi + this.ajaxUrl,
        data: json,
        loading: true,
        tip: false
      }).then(results => {
        //console.log("保存制单总运单")
        //console.log(results.data)
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.$emit("success")
          this.getBillInfo();
        } else {
          this.$message.error(
            "制单信息保存失败！" + results.data.resultmessage
          );
        }
        success = results.data.resultstatus == 0;
        // alert(3434)
      });
      }
    
      return success;
    },
    sendEmailSuccess(data) {
      this.lxrShow = false;
      // console.log(111111)
      // console.log(data)
      if (data) {
        this.printFunc(3, 2, false, 1, 2);
      }
    },
    async printFuncYdy(confirmDelete=0) {
       //confirmDelete 1直接打印（A4）  2发送并打印 3直接打印（正本）
      // await this.$confirm("", "请选择打印方式", {
      //   distinguishCancelAndClose: true,
      //   confirmButtonText: "直接打印",
      //   cancelButtonText: "发送并打印",
      //   center: true
      // })
      //   .then(() => {
      //     confirmDelete = 1; //直接打印
      //   })
      //   .catch(action => {
      //     confirmDelete = action === "cancel" ? 2 : 3; //2发送并打印 3关闭弹窗
      //   });

      //  console.log(confirmDelete);
      if (confirmDelete == 2) {
        this.saveBillInfo(1, false).then(res => {
          if (res) {
            this.lxrShow = true;
          }
        });
      }

      if (confirmDelete == 1) {
        this.printFunc(3, 2, false, 1);
      }
      if (confirmDelete == 3) {
        this.printFunc(3, 2, true, 1);
      }
      this.billprintDialog=false;
    },

    /**
     * @method
     */
    printFunc(type, printType, noBg, status, confirmDelete) {
      //type 1正本打印  2客户运单打印 3预打印；a4打印类型是1，但是要打印背景
      //printType 1.预览 2打印设置
      //noBg 是否不打印背景图，true不打印;正本不打印背景；A4打印背景
      //status,保存时传入的状态值，默认不传,客户和预打印传1
      //ydtype  运单类型 1中性运单取本地背景，2油性取模板地址
      //confirmDelete 默认为空，为2表示预打印的发送并打印

      const self = this;
      if (type != 3) {
        if (!this.getInfo()) {
          return;
        }
      }
      // 所有的打印都仅仅是打印
       this.saveBillInfo(status, type != 3,type).then(res => {
        //  console.log(res)
        if (!res)  return;
        this.getAreaPrice();
        setTimeout(() => {
        self.commonPrint(type, printType, noBg, status, confirmDelete)
        }, 1000)
       })
      //  var TaskID1,TaskID2
      //  lodop.On_Return_Remain=true;
      //  lodop.On_Return=function(TaskID,Value){
      //      if (TaskID== TaskID1) {
      //             alert("判断是否打印成功的结果是："+ Value)
      //      } else if (TaskID== TaskID2) {
      //             alert("判断打印任务是否还存在的结果是："+ Value)
      //      };
      //  };
      //  TaskID1=lodop.GET_VALUE("PRINT_STATUS_OK",0);
      // TaskID2=lodop.GET_VALUE("PRINT_STATUS_EXIST",0);

      // lodop.PREVIEW()
    },

    /**
     * @method
     * @desc 公共打印方法
     */
    commonPrint(type, printType, noBg, status, confirmDelete) {
      //type 1正本打印  2客户运单打印 3预打印；a4打印类型是1，但是要打印背景
      //printType 1.预览 2打印设置
      //noBg 是否不打印背景图，true不打印;正本不打印背景；A4打印背景
      //status,保存时传入的状态值，默认不传,客户和预打印传1
      //ydtype  运单类型 1中性运单取本地背景，2油性取模板地址
      //confirmDelete 默认为空，为2表示预打印的发送并打印
      var json = {};
        var FhrCompanyTitle = "";
        var ShrCompanyTitle = "";
        var TzrCompanyTitle = "";
        json = Object.assign({}, this.mawbinfo, this.formdata);

       if (type == 1) {
          if (json.ratelevel == "M") {
            json.rate = "";
          }
        } else {
          if (json.ratelevel_cus == "M") {
            json.rate_cus = "";
          }
        }
      if(json.smallpiece!=this.smallpieceBackup){
        this.$emit('setMawbSmallpiece',true)
      }

      let orderzd=this.orderdom != "分单";//是否是总单和直单
      let ifdcz=json.czlx.indexOf('代操作')>=0&&type==3;//代操作下并且是预打印

      let zdweight=(type == 1 ? json.zdweight : json.zdweight_cus)||'';
      let zdvolume=(type == 1 ? json.zdvolume : json.zdvolume_cus)||'';
      let ratelevel= (type == 1 ? json.ratelevel : json.ratelevel_cus)||'';
      let jfweight=(type == 1 ? json.jfweight : json.jfweight_cus)||'';
      let ratetotal=(type == 1 ? json.ratetotal: json.ratetotal_cus)||''

       if(ifdcz){
         json.zdpiece=json.zdpiece||json.realpiece;
         json.zdweight_cus=json.zdweight_cus||json.realweight;
         json.zdvolume_cus=json.zdvolume_cus||json.realvolume;
       }




        // getPdf('总单制单','printData')
        var lodop = getLodop();
       // let printPageName=this.ydtype == 1  ? (json.orderdom != "分单"? "ZXYD" : "hawbCustom"): (json.orderdom != "分单"? json.mawb.substr(0, 3): ("hawbCustom_" + json.gid));

        let printPageName='';

        if(this.ydtype == 1){
          printPageName=json.orderdom != "分单"? "ZXYD" : "hawbCustom"
        }
        else{
          printPageName = json.orderdom != "分单"? json.mawb.substr(0, 3): ("hawbCustom_" + json.gid)
        }

        if(type!=2){
           if(noBg){
             printPageName="zb"+printPageName //正本
           }else{
             printPageName="A4"+printPageName //A4
           }
        }else{
             printPageName="kh"+printPageName //客户运单打印
        }



      // console.log(printPageName);


       //注意：字段如果不显示赋值为空，位置必须保留，否则显示字段会混乱
        lodop.PRINT_INITA(
          "0",
          "0",
          "794",
          "1123",
          printPageName
        );




        if (type != 3) {
          if (orderzd) {
            if (!this.mawbinfo.mawb) {
              this.$message.error("总运单未配置，无法打印！");
              return;
            }
            /*  else if (this.mawbinfo.shipaceid == -1) {
          this.$message.error("未配舱无法打印！");
          return;
        } */
          }
          if (type == 1) {
            if (!json.zdpiece || !json.zdweight || !json.zdvolume) {
              this.$message.error("制单件重体未补全无法打印！");
              return;
            }
          }
        }

        layer.msg("正在生成打印单，请稍候.....");

        if (orderzd) {
          FhrCompanyTitle =
            json.companytitle_fhr_mawb + "\r\n" + json.address_fhr_mawb;
          // if (json.lxr_fhr_mawb != "") {
          //   FhrCompanyTitle += " " + json.lxr_fhr_mawb;
          // }
          // if (json.phone_fhr_mawb != "") {
          //   FhrCompanyTitle += " " + json.phone_fhr_mawb;
          // }
          // if (json.fax_fhr_mawb != "") {
          //   FhrCompanyTitle += " " + json.fax_fhr_mawb;
          // }
          // if (json.email_fhr_mawb != "") {
          //   FhrCompanyTitle += " " + json.email_fhr_mawb;
          // }

          ShrCompanyTitle =
            json.companytitle_shr_mawb + "\r\n" + json.address_shr_mawb;
          // if (json.lxr_shr_mawb != "") {
          //   ShrCompanyTitle += " " + json.lxr_shr_mawb;
          // }
          // if (json.phone_shr_mawb != "") {
          //   ShrCompanyTitle += " " + json.phone_shr_mawb;
          // }
          // if (json.fax_shr_mawb != "") {
          //   ShrCompanyTitle += " " + json.fax_shr_mawb;
          // }
          // if (json.email_shr_mawb != "") {
          //   ShrCompanyTitle += " " + json.email_shr_mawb;
          // }
                TzrCompanyTitle =
            json.companytitle_tzr_mawb + "\r\n" + json.address_tzr_mawb;
        } else {
          FhrCompanyTitle =
            json.companytitle_fhr_hawb + "\r\n" + json.address_fhr_hawb;
          // if (json.lxr_fhr_hawb != "") {
          //   FhrCompanyTitle += " " + json.lxr_fhr_hawb;
          // }
          // if (json.phone_fhr_hawb != "") {
          //   FhrCompanyTitle += " " + json.phone_fhr_hawb;
          // }
          // if (json.fax_fhr_hawb != "") {
          //   FhrCompanyTitle += " " + json.fax_fhr_hawb;
          // }
          // if (json.email_fhr_hawb != "") {
          //   FhrCompanyTitle += " " + json.email_fhr_hawb;
          // }

          ShrCompanyTitle =
            json.companytitle_shr_hawb + "\r\n" + json.address_shr_hawb;
          // if (json.lxr_shr_hawb != "") {
          //   ShrCompanyTitle += " " + json.lxr_shr_hawb;
          // }
          // if (json.phone_shr_hawb != "") {
          //   ShrCompanyTitle += " " + json.phone_shr_hawb;
          // }
          // if (json.fax_shr_hawb != "") {
          //   ShrCompanyTitle += " " + json.fax_shr_hawb;
          // }
          // if (json.email_shr_hawb != "") {
          //   ShrCompanyTitle += " " + json.email_shr_hawb;
          // }

       
        }

        //送发货人

        lodop.ADD_PRINT_TEXT(150, 40, 330, 70, FhrCompanyTitle||'');
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(240, 40, 330, 70, ShrCompanyTitle||'');
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


          lodop.ADD_PRINT_TEXT(330, 40, 330, 50, orderzd?json.agentcity:'');
          lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

         lodop.ADD_PRINT_TEXT(390, 40, 150, 20, orderzd?json.iatacode:'');
         lodop.SET_PRINT_STYLEA(0, "Bold", 1);
         lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);




        lodop.ADD_PRINT_TEXT(390, 210, 160, 20, json.accountnumber||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(330, 390, 350, 80, json.accountinfo||'');
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        //航班信息
        lodop.ADD_PRINT_TEXT(425, 40, 300, 20, this.sfgquanpin||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(425, 390, 120, 20, json.referencenumber||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 40, 40, 20, json.zzg || json.mdg||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          455,
          90,
          150,
          20,
          json.hbh && json.hbh.substr(0, 2)||''
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 250, 30, 20, json.to1||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 280, 30, 20, json.by1||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 310, 30, 20, json.to2||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 350, 30, 20, json.by2||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 384, 40, 20, json.currency||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 450, 40, 20, json.wtpaymode||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 490, 40, 20, json.otherpaymode||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 530, 100, 20, json.declarecarriage||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(455, 640, 100, 20, json.declarecustom||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(485, 40, 140, 20, this.mdgquanpin||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(485, 220, 60, 20, json.hbh||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(485, 300, 70, 20, json.hbrq ? this.airdate(json.hbrq) : '');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(485, 390, 70, 20, json.insuranceamount||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          520,
          40,
          680,
          45,
          json.handlinginfo +
            "  " +
            (json.mawb&&json.mawb.substr(0, 3) == "999"
              ? json.descriptioncode.replace(",", " ")
              : "")
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        //制单信息
        lodop.ADD_PRINT_TEXT(610, 40, 40, 20, json.zdpiece||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          610,
          80,
          60,
          20,
          zdweight
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(610, 140, 30, 20, "K");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


        lodop.ADD_PRINT_TEXT(
          610,
          160,
          30,
          20,
          ratelevel
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        // lodop.ADD_PRINT_TEXT(610, 180, 60, 20, json.prodnumber);
        lodop.ADD_PRINT_TEXT(610, 180, 60, 20, orderzd?'':json.prodnumber);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          610,
          250,
          100,
          20,
          jfweight
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

          lodop.ADD_PRINT_TEXT(
            610,
            340,
            60,
            20,
            (orderzd?(type == 1 ? json.rate : json.rate_cus):'')||''
          );
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


        lodop.ADD_PRINT_TEXT(
          610,
          420,
          105,
          30,
          (json.isarranged == 1
            ? this.asAed
            : ratetotal)||''
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


        lodop.ADD_PRINT_TEXT(660, 290, 240, 130, this.showHawbSizeChecked&&json.sizelist&&json.sizelist.length>0?(json.remark+'\r\n'+json.sizelist.replace(/,/g,'\r\n')):(json.remark||''));
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


        lodop.ADD_PRINT_TEXT(610, 550, 190, 160, json.pm||'');
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(800, 40, 40, 20, json.zdpiece||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          800,
          80,
          100,
          20,
          zdweight
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          800,
          420,
          110,
          20,
          (json.isarranged == 1
            ? this.asAed
            : ratetotal)||''
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          800,
          590,
          110,
          20,
          "VOL:" +zdvolume +" CBM"
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        //费用汇总
        var pptotal =
          Number( ratetotal) || "";
        var cctotal =
          Number( ratetotal) || "";

        var ppothertotal =
          Number(type == 1 ? this.ppothertotal : this.ppothertotal_cus) || "";
        var ccothertotal =
          Number(type == 1 ? this.ppothertotal : this.ppothertotal_cus) || "";

        var zfall = type == 1 ? this.zfall : this.zfall_cus;

        if (json.wtpaymode == "PP") {
          cctotal = "";
        } else {
          pptotal = "";
        }

        if (json.otherpaymode == "PP") {
          ccothertotal = "";
        } else {
          ppothertotal = "";
        }

        var ppall = Number(pptotal) + Number(ppothertotal);
        var ccall = Number(cctotal) + Number(ccothertotal);

        if (this.orderdom == "分单") {
          ppothertotal = ccothertotal = ppall = ccall = "";
        }

        lodop.ADD_PRINT_TEXT(
          840,
          40,
          100,
          20,
          pptotal
            ? json.isarranged == 1
              ? this.asAed
              : pptotal.toFixed(2)
            : ""
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(
          840,
          200,
          100,
          20,
          cctotal
            ? json.isarranged == 1
              ? this.asAed
              : cctotal.toFixed(2)
            : ""
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(870, 40, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(870, 200, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(900, 40, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(900, 200, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(935, 40, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(935, 200, 100, 20, "");

        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          965,
          40,
          100,
          20,
          ppothertotal
            ? json.isarranged == 1
              ? this.asAed
              : ppothertotal.toFixed(2)
            : ""
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(
          965,
          200,
          100,
          20,
          ccothertotal
            ? json.isarranged == 1
              ? this.asAed
              : ccothertotal.toFixed(2)
            : ""
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(1060, 40, 100, 20, ppall ? ppall.toFixed(2) : "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(1030, 200, 100, 20, ccall ? ccall.toFixed(2) : "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.ADD_PRINT_TEXT(840, 330, 390, 70, zfall||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        //制单人

          lodop.ADD_PRINT_TEXT(960, 360, 340, 40, orderzd?json.agent:"");
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


        lodop.ADD_PRINT_TEXT(1040, 330, 100, 20,json.adddate ? this.airdate(json.adddate):"");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(1040, 480, 100, 20, json.atplace||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(1040, 590, 100, 20, json.addman ? (makePy(json.addman)[0]) : '');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(90, 80, 30, 20, json.sfg||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


          lodop.ADD_PRINT_TEXT(
            90,
            120,
            150,
            20,
            (this.ydtype == 1 ? (json.area == "北京"? json.mawb && json.mawb.substr(4, 8): json.mawb):'')||''
          );
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

          lodop.ADD_PRINT_TEXT(
            90,
            600,
            150,
            20,
            (this.ydtype == 1 ? (orderzd ? json.mawb : json.hawb):"")||''
          );
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
          lodop.ADD_PRINT_TEXT(
            1100,
            500,
            190,
            20,
           (this.ydtype == 1 ?(orderzd ? json.mawb : json.hawb):'')||''
          );




          lodop.ADD_PRINT_TEXT(90, 20, 63, 20, this.orderdom == "分单"?json.hawb:(this.ydtype == 1?(json.area == "北京" ? json.mawb && json.mawb.substr(0, 3) : ""):''));
          lodop.SET_PRINT_STYLEA(0, "Bold", 1);
          lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        // lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        // lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        // lodop.ADD_PRINT_BARCODE(20,300,200,35,"Code93",json.mawb);
        //  lodop.ADD_PRINT_TEXT(20,300,200,35,'');
        // lodop.SET_PRINT_STYLEA(0,"ShowBarText",0);

        lodop.ADD_PRINT_TEXT(
          127,
          497,
          247,
          66,
          (this.ydtype == 1 ? (orderzd  ? this.airinfo : json.loginfo): "")||''
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);

        lodop.ADD_PRINT_TEXT(1067, 620, 100, 20, "");
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(
          637,
          40,
          100,
          20,
          this.smallpieceChecked && json.smallpiece && json.smallpiece != "0"
            ? ("SLAC:" + json.smallpiece)
            : ""
        );
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        lodop.ADD_PRINT_TEXT(425, 516, 120, 20, json.shippinginfo||'');
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

        //注意新增字段放在最后面，否则会影响之前的模板
        lodop.ADD_PRINT_TEXT(660, 40, 240, 130, TzrCompanyTitle || '');
        lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
        lodop.SET_PRINT_STYLEA(0, "Bold", 1);
        lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);



        if (!noBg) {
          if (this.ydtype == 1) {
            if (this.orderdom == "分单") {
              lodop.ADD_PRINT_SETUP_BKIMG(
                "<img border='0' width='794' height='1123' src='./boStatic/images/hawb_wc_New.jpg'>"
              );
            } else {
              lodop.ADD_PRINT_SETUP_BKIMG(
                "<img border='0' width='794' height='1123' src='./boStatic/images/mawb_wc.jpg'>"
              );
            }
          } else {
            let imageaddress = JSON.parse(localStorage.airinfo).filter(
              i => i.ThreeCode == this.mawbinfo.mawb.substr(0, 3)
            )[0].fileaddress;
            lodop.ADD_PRINT_SETUP_BKIMG(
              `<img border='0' width='794' height='1123' src=${imageaddress}>`
            );
          }
        }

        // lodop.SET_SHOW_MODE("BKIMG_WIDTH","283mm");
        // // lodop.SET_PRINT_PAGESIZE(3,1385,45,"");
        // lodop.SET_PRINT_PAGESIZE('intPageWidth',"800px")
        // lodop.SET_PRINT_PAGESIZE('intPageHeight',"1124px")
        
        lodop.SET_PRINT_PAGESIZE(1, "210mm", "297mm");
        lodop.SET_SHOW_MODE("BKIMG_PRINT", true);
        lodop.SET_PRINT_STYLEA(0,"HtmWaitMilSecs",1500);

        printType == 2 && confirmDelete != 2
          ? lodop.PRINT_SETUP()
          : lodop.PREVIEW();

        if (type != 3) {
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/CreateDoc",
            params: {
              sid: this.mawbinfo.guid,
              type: this.orderdom == "分单" ? 2 : 1
            },
            loading: false,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              //  layer.msg('操作成功！')
            }
          });
        }
    },

    getAreaPrice() {

      var mawb = this.mawbinfo.mawb;
      var sfg = this.mawbinfo.sfg;
      var mdg = this.mawbinfo.mdg;
      var hbrq = this.mawbinfo.hbrq||this.mawbinfo.yqhbrq;

      if (!mawb || !sfg || !mdg || !hbrq) {
        return;
      }
      let json = {
        area: this.mawbinfo.area,
        mawbthreecode: this.mawbinfo.mawb.substr(0, 3),
        sfg: sfg,
        mawbmdg: this.mawbinfo.mdg,
        hbrq: hbrq
      };
      this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubAirCompanyAreaPrice",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
        //  console.log('费用信息')
        //  console.log(JSON.stringify(results.data))
        if (this.formdata.wagelist.length == 0 && this.orderdom != "分单") {
          var arr = [];
          results.data.forEach(i => {
              i.guid = -1;
              i.sid = this.mawbinfo.guid;
              // if(this.mawbinfo.area==this.conditionalAreaForBuild&&this.mawbinfo.mawb&&this.mawbinfo.mawb.substr(0,3)=='933'&&i.items=='航司分单信息费'){
              //   if(i.mawbmdg=="NRT"){
              //       i.hidden=true
              //    }else{
              //       i.itemsename="CG"
              //   }
              // }            
              if(i.iszd == 1 && !i.hidden){
                 arr.push(i);
              }          
          });

          this.formdata.wagelist = arr;
        }

          this.wagelistOriginalData=results.data

      });
    },
    getRate(type) {
      //1取jfweight 2取jfweight_cus
      var mawb = this.formdata.mawb;
      var sfg = this.formdata.sfg;
      var mdg = this.formdata.mdg;
      var jfweight = Number(this.formdata.jfweight) || 0;
      var jfweight_cus = Number(this.formdata.jfweight_cus) || 0;

      if (this.formdata.orderdom == "分单" && this.formdata.guid > 0) {
        return;
      }

      if (
        mawb &&
        sfg &&
        mdg &&
        jfweight &&
       // (!this.formdata.ratelevel || !this.formdata.rate) &&
        (!type || type == 1||this.afreshRateCharge)
      ) {
        let json = {
          area: this.mawbinfo.area,
          mawb: mawb,
          sfg: sfg,
          mdg: mdg,
          jfweight: jfweight
        };
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubIataPrice",
          params: json,
          loading: false,
          tip: false
        }).then(results => {
          //  //console.log('费率信息')
          //   //console.log(results.data)
          this.$nextTick(() => {
            if (results.data) {
              this.formdata.ratelevel =this.afreshRateCharge?  results.data.ratelevel :(this.formdata.ratelevel ||results.data.ratelevel);
              this.formdata.rate =this.afreshRateCharge? results.data.rate :( this.formdata.rate || results.data.rate);
              this.formdata.ratetotal =
                (
                  this.formdata.rate *
                  (this.formdata.ratelevel == "M" ? 1 : jfweight)
                ).toFixed(2) || "";

              // if (this.formdata.orderdom == "分单" && this.formdata.guid > 0) {
              //   this.formdata.ratelevel = "";
              //   this.formdata.rate = "";
              //   this.formdata.ratetotal = "";
              // }
            }
          });
        });
      }
      if (
        mawb &&
        sfg &&
        mdg &&
        jfweight_cus &&
       // (!this.formdata.ratelevel_cus || !this.formdata.rate_cus) &&
        (!type || type == 2||this.afreshRateCharge)
      ) {
        let json = {
          area: this.mawbinfo.area,
          mawb: mawb,
          sfg: sfg,
          mdg: mdg,
          jfweight: jfweight_cus
        };
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubIataPrice",
          params: json,
          loading: false,
          tip: false
        }).then(results => {
          //  //console.log('费率信息')
          //   //console.log(results.data)
          this.$nextTick(() => {
            if (results.data) {
              this.formdata.ratelevel_cus = results.data.ratelevel;
              this.formdata.rate_cus = results.data.rate;
              this.formdata.ratetotal_cus =
                (
                  this.formdata.rate_cus *
                  (this.formdata.ratelevel_cus == "M" ? 1 : jfweight_cus)
                ).toFixed(2) || "";
            }
            // if (this.formdata.orderdom == "分单" && this.formdata.guid > 0) {
            //   this.formdata.ratelevel_cus = "";
            //   this.formdata.rate_cus = "";
            //   this.formdata.ratetotal_cus = "";
            // }
          });
        });
      }
    },
    getHbinfo() {
      if (!localStorage.getItem("hbinfo")) {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubAirPortArea",
          params: {},
          loading: false,
          tip: false
        }).then(results => {
          //console.log('目的港全拼')
          //console.log(results.data)
          results.data.forEach(i => {
            if (i.ThreeCode == this.mawbinfo.mdg) {
              this.mdgquanpin = i.Ready01;
              this.sfgquanpin = i.Ready01;
            }
          });
          localStorage.setItem("hbinfo", JSON.stringify(results.data));
        });
      } else {
        var hbinfo = JSON.parse(localStorage.getItem("hbinfo"));
        hbinfo.forEach(i => {
          if (i.ThreeCode == this.mawbinfo.sfg) {
            this.sfgquanpin = i.Ready01;
          }
          if (i.ThreeCode == this.mawbinfo.mdg) {
            this.mdgquanpin = i.Ready01;
          }
        });
      }
    },
    getZdtemplate(type) {
      this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubAirCompanyDzTemple",
        params: {
          threecode: this.mawbinfo.mawb.substr(0, 3),
          area: this.mawbinfo.area
        },
        loading: false,
        tip: false
      }).then(results => {
        //  console.log(11111111111)
        //  console.log(results)
        this.temOptions = results.data;
      });
    },
    tempChange(e) {
      let data = this.temOptions.filter(i => i.templename == e)[0];
      // console.log(data)
      if (data) {
        this.formdata.accountinfo = this.accountinfo
          ? this.accountinfo + "\n" + data.accountinfo.replace(/[\\]/g, "\n")
          : data.accountinfo.replace(/[\\]/g, "\n");
        this.formdata.handlinginfo = this.handlinginfo
          ? this.handlinginfo + "\n" + data.handlinginfo.replace(/[\\]/g, "\n")
          : data.handlinginfo.replace(/[\\]/g, "\n");
        this.formdata.pm = this.pm
          ? this.pm + "\n" + data.pm.replace(/[\\]/g, "\n")
          : data.pm.replace(/[\\]/g, "\n");

        // done: 2021-7-6 madarong 选择模板，给remark, airinfo,赋上对应的模板值
         this.formdata.remark = this.remark
          ? this.remark + "\n" + data.remark.replace(/[\\]/g, "\n")
          : data.remark.replace(/[\\]/g, "\n");

        
        if (this.orderdom!='分单') { // 总单 
          this.airinfo = this.backairinfo
            ? this.backairinfo + "\n" + data.zxydtitle.replace(/[\\]/g, "\n")
            : data.zxydtitle.replace(/[\\]/g, "\n");
        } else { // 分单
          this.formdata.loginfo = this.loginfo
            ? this.loginfo + "\n" + data.zxydtitle.replace(/[\\]/g, "\n")
            : data.zxydtitle.replace(/[\\]/g, "\n");
        }

        

      } else {
        this.formdata.accountinfo = this.accountinfo;
        this.formdata.handlinginfo = this.handlinginfo;
        this.formdata.pm = this.pm;

       // done: 2021-7-6 madarong 给remark, airinfo,赋上默认值
        this.formdata.remark = this.remark;

        // airinfo 赋上初使值
        if (this.orderdom!='分单') { // 总单
          this.airinfo = this.backairinfo;
        } else { // 分单
         this.formdata.loginfo = this.loginfo;
        }


      }
    },
    airdate(value) {
      if (value) {
        var arr = (new Date(value.replace(/-/g, "/")) + "").split(" ");
        return arr[2] + arr[1].toUpperCase() + arr[3].substr(2, 2);
      }
    },
    setWageall(price, itemstype, isKh) {
      //isKh 是否是客户制单，true的话取客户计重
      var num = 0;
      switch (itemstype) {
          case "总运单票数":
          num = 1;
          break;
            case "总运单件数":
          num = this.mawbinfo.zdpiece;
          break;
           case "分运单票数":
          num = this.mawbinfo.hawbnum||0;
          break;
        case "箱":
          num = this.mawbinfo.realpiece;
          break;
        case "票":
          num = "1";
          break;
        case "计重":
          //num = computedWeight(this.mawbinfo.zdvolume, this.mawbinfo.zdweight);
          num = isKh ? this.formdata.jfweight_cus : this.formdata.jfweight;
          break;
        case "结算重量":
          num = this.mawbinfo.accountweightout;
          break;
        case "毛重":
          num = this.mawbinfo.zdweight;
          break;
      }
      return (Number(num) * Number(price)).toFixed(2) || 0;
    },

    showOrderDialog(type) {
      this.orderTypeDialogVisible = true;
      this.orderType = type;
    },

    /**
     * @method
     * @desc 打印阴单，阳单
     * @auth mdr
     */
    printOrder() {
      this.orderTypeDialogVisible = false;
      switch(this.orderType) {
        case 1:
          this.printFunc(1,2, false, 3);
          break;
        case 2:
          this.printFunc(2,2,false,1);
          break;
      }
    }
  },
  created() {
    //this.initForm();
    // this.getBillInfo(); //制单信息


    let currencyData = JSON.parse(localStorage.getItem("currencyData"));
    this.getBillInfo().then(res => {
      // console.log(11111)
      // console.log(res)
      // console.log(this.formdata)

      //  this.getRate();//费率
      this.getZdtemplate();
      this.getAirinfo(); //航司信息
      this.getAreaPrice(); //费用信息
      this.getHbinfo();

      if (this.mawbhawbLinkage) {
        //使总单的基本信息中的数据与总单制单信息里面的数据保持同步，判断鼠标焦点是否在制单信息里面，以确定是谁是主动修改，谁是被动修改；
        let noSynchronizationArr = [
          "sfg",
          "mdg",
          "zzg",
          "deliverydate",
          "smallpiece", // 2021-7-1 madarong 同步小件数
          "englishpm",
          "chinesepm",
          "ybpiece",
          "ybweight",
          "ybvolume",
          "realpiece",
          "realweight",
          "realvolume",
          "zdpiece",
          "zdweight",
          "zdvolume",
          "jfweight",
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
          "taxcode_fhr_mawb",
          "code_shr_mawb",
          "companytitle_shr_mawb",
          "address_shr_mawb",
          "city_shr_mawb",
          "postcode_shr_mawb",
          "companycode_shr_mawb",
          "state_shr_mawb",
          "lxr_shr_mawb",
          "phone_shr_mawb",
          "email_shr_mawb",
          "fax_shr_mawb",
          "taxcode_shr_mawb",
          "code_fhr_hawb",
          "companytitle_fhr_hawb",
          "address_fhr_hawb",
          "city_fhr_hawb",
          "postcode_fhr_hawb",
          "companycode_fhr_hawb",
          "state_fhr_hawb",
          "lxr_fhr_hawb",
          "phone_fhr_hawb",
          "email_fhr_hawb",
          "fax_fhr_hawb",
          "code_shr_hawb",
          "companytitle_shr_hawb",
          "address_shr_hawb",
          "city_shr_hawb",
          "postcode_shr_hawb",
          "companycode_shr_hawb",
          "state_shr_hawb",
          "lxr_shr_hawb",
          "phone_shr_hawb",
          "email_shr_hawb",
          "fax_shr_hawb",
          'handlinginfo',
        ];
        if (this.orderdom == "分单") {
          noSynchronizationArr.push(
            ...["currency", "remark", "zdvolume", "pm", "wtpaymode"]
          );
        }

        if (this.orderdom != "分单") { //总单
          this.$watch(
            function() {
              return this.mawbinfo;
            },
            function(newval, oldval) {
              if (!this.inThisTemp) {
                Object.keys(this.formdata).forEach(i => {
                  if (noSynchronizationArr.includes(i)&&this.mawbinfo.hasOwnProperty(i)) {
                    this.formdata[i] = this.mawbinfo[i];
                  }

                  // note: 同步英文品名
                  if (i == "pm") {
                    this.formdata.pm = this.mawbinfo.englishpm;
                  }

                  if (i == "wtpaymode") {
                     this.formdata.wtpaymode = this.mawbinfo.paymode;
                  }
                });
                
              }
            },
            { deep: true, immediate: true }
          );

          this.$watch(
            function() {
              return this.formdata;
            },
            function(newval, oldval) {
              if (this.inThisTemp) {
                Object.keys(this.mawbinfo).forEach(i => {
                  if (noSynchronizationArr.includes(i)&&this.formdata.hasOwnProperty(i)) {
                    this.mawbinfo[i] = this.formdata[i];
                  }

                  // note: 同步英文品名
                   if (i == "englishpm") {
                      this.mawbinfo.englishpm = this.formdata.pm;
                    }

                    if (i == "paymode") {
                     this.mawbinfo.paymode = this.formdata.wtpaymode ;
                    }
                });
               

              }
            },
            { deep: true, immediate: true }
          );
        } else {
          this.$watch(
            function() {
              return this.hawbBillData;
            },
            function(newval, oldval) {
              if (!this.inThisTemp) {
                Object.keys(this.formdata).forEach(i => {
                  if (noSynchronizationArr.includes(i)) {
                    if(this.hawbBillData.hasOwnProperty(i)) {
                      if (i == "currency") {
                      currencyData.forEach(e => {
                        if (e.cname == this.hawbBillData[i]) {
                          this.formdata[i] = e.ename;
                        }
                      });
                      }  else if (i == "wtpaymode") {
                        let tra = ["FOB", "FCA", "EXW"].includes(
                          this.hawbBillData.tradeterm
                        )
                          ? "CC"
                          : "PP";
                        this.formdata.wtpaymode = tra;
                        this.formdata.otherpaymode = tra;
                      } else {
                        this.formdata[i] = this.hawbBillData[i];
                      }
                    }
                   
                    if (i == "pm") {
                      this.formdata.pm = this.hawbBillData.englishpm;
                    }
                

                  }


                  if (i == "wtpaymode") {
                        let tra = ["FOB", "FCA", "EXW"].includes(
                          this.hawbBillData.tradeterm
                        )
                          ? "CC"
                          : "PP";
                        this.formdata.wtpaymode = tra;
                        // this.formdata.otherpaymode = tra;
                  }
                  
                });
              }
            },
            { deep: true, immediate: true }
          );

          this.$watch(
            function() {
              return this.formdata;
            },
            function(newval, oldval) {
              if (this.inThisTemp) {
                console.log(Object.keys(this.hawbBillData))
                Object.keys(this.hawbBillData).forEach(i => {
                    if (noSynchronizationArr.includes(i)) {
                      if(this.formdata.hasOwnProperty(i)){
                        if (i == "currency") {
                        currencyData.forEach(e => {
                          if (e.ename == this.formdata[i]) {
                            this.hawbBillData[i] = e.cname;
                          }
                        });
                      } else {
                        this.hawbBillData[i] = this.formdata[i];
                      }
                    }

                    if (i == "englishpm") {
                      this.hawbBillData.englishpm = this.formdata.pm;
                    } 
                    
                  }
                  if (i == "tradeterm") {
                        let tra = this.formdata.wtpaymode == 'PP'?'CIF':'FOB'
                        this.hawbBillData.tradeterm = tra;
                  }
                });

                 
              }
            },
            { deep: true, immediate: true }
          );
        }
      }

      this.$watch(
        function() {
          return this.formdata.zdweight + this.formdata.zdvolume;
        },
        function() {
          this.formdata.jfweight = computedWeight(
            this.formdata.zdvolume,
            this.formdata.zdweight,
            this.orderdom=='分单'
          );


        }
      );

      this.$watch(
        function() {
          return this.formdata.zdweight_cus + this.formdata.zdvolume_cus;
        },
        function() {

       //  console.log(this.formdata.zdweight_cus)
          this.formdata.jfweight_cus = computedWeight(
            this.formdata.zdvolume_cus,
            this.formdata.zdweight_cus,
            this.orderdom=='分单'
          );

        //  console.log(this.formdata.jfweight_cus)


        }
      );
      this.$watch(
        function() {
          return this.formdata.wtpaymode;
        },
        function(val) {
          // WT/VAL 选择 PP && accountinfo 包含 FREIGHT COLLECT => 替换为 FREIGHT PREPAID
          if (val == "PP" && this.formdata.accountinfo.includes("FREIGHT COLLECT") ) {
            // this.formdata.accountinfo = "FREIGHT PREPAID";
            this.formdata.accountinfo = this.formdata.accountinfo.replace(/FREIGHT COLLECT/g, "FREIGHT PREPAID");
          }
           // WT/VAL 选择 CC && accountinfo 包含 FREIGHT PREPAID => 替换为 FREIGHT COLLECT
          if (val == "CC" && this.formdata.accountinfo.includes("FREIGHT PREPAID")) {
            // this.formdata.accountinfo = "FREIGHT COLLECT";
             this.formdata.accountinfo = this.formdata.accountinfo.replace(/FREIGHT PREPAID/g, "FREIGHT COLLECT");
          }
        },
        { immediate: true }
      );

      this.$watch(
        function() {
          return this.mawbinfo.mawb;
        },
        function(newval, oldval) {
          this.getBillInfo(); //制单信息
          this.getAirinfo();
        }
      );

      this.$watch(
        function() {
          if (this.pagetype == 1) {
            return (
              this.mawbinfo.ybpiece +
              this.mawbinfo.ybweight +
              this.mawbinfo.ybvolume +
              this.mawbinfo.realpiece +
              this.mawbinfo.realweight +
              this.mawbinfo.realvolume +
              this.mawbinfo.zdpiece +
              this.mawbinfo.zdweight +
              this.mawbinfo.zdvolume
            );
          } else {
            return (
              this.mawbinfo.piece + this.mawbinfo.weight + this.mawbinfo.volume
            );
          }
        },
        function(newval, oldval) {
          if (this.pagetype == 1) {
            this.tableData[0].jztinfo = `${this.mawbinfo.ybpiece}/${Number(
              this.mawbinfo.ybweight
            ).toFixed(2)}/${Number(this.mawbinfo.ybvolume).toFixed(3)}`;
            this.tableData[1].jztinfo = `${this.mawbinfo.realpiece}/${Number(
              this.mawbinfo.realweight
            ).toFixed(2)}/${Number(this.mawbinfo.realvolume).toFixed(3)}`;
            this.tableData[2].jztinfo = `${this.mawbinfo.zdpiece}/${Number(
              this.mawbinfo.zdweight
            ).toFixed(2)}/${Number(this.mawbinfo.zdvolume).toFixed(3)}`;

            this.tableData[0].jfweight = computedWeight(
              this.mawbinfo.ybvolume,
              this.mawbinfo.ybweight,
            this.orderdom=='分单'

            );
            this.tableData[1].jfweight = computedWeight(
              this.mawbinfo.realvolume,
              this.mawbinfo.realweight,
            this.orderdom=='分单'

            );
            this.tableData[2].jfweight = computedWeight(
              this.mawbinfo.zdvolume,
              this.mawbinfo.zdweight,
            this.orderdom=='分单'

            );
          } else {
            this.mawbinfo.realpiece = this.mawbinfo.zdpiece = this.mawbinfo.ybpiece = this.mawbinfo.piece;
            this.mawbinfo.realweight = this.mawbinfo.zdweight = this.mawbinfo.ybweight = this.mawbinfo.weight;
            this.mawbinfo.realvolume = this.mawbinfo.zdvolume = this.mawbinfo.ybvolume = this.mawbinfo.volume;

            let str = `${this.mawbinfo.piece}/${Number(
              this.mawbinfo.weight
            ).toFixed(2)}/${Number(this.mawbinfo.volume).toFixed(3)}`;
            let jfweight = computedWeight(
              this.mawbinfo.volume,
              this.mawbinfo.weight,
            this.orderdom=='分单'

            );

            this.tableData[2].jztinfo = this.tableData[1].jztinfo = this.tableData[0].jztinfo = str;
            this.tableData[2].jfweight = this.tableData[1].jfweight = this.tableData[0].jfweight = jfweight;
          }

          this.formdata.wtpaymode =this.formdata.wtpaymode|| this.mawbinfo.paymode;
          this.formdata.otherpaymode =this.formdata.otherpaymode|| this.mawbinfo.paymode;
          this.formdata.jfweight =
            this.formdata.jfweight || this.mawbinfo.jfweight;
          this.formdata.zdweight_cus =
            this.formdata.zdweight_cus || this.mawbinfo.zdweight;
          this.formdata.zdvolume_cus =
            this.formdata.zdvolume_cus || this.mawbinfo.zdvolume;
        },
        { immediate: true, deep: true }
      );

      this.$watch(
        function() {
          return (
            this.mawbinfo.mawb +
            this.mawbinfo.sfg +
            this.mawbinfo.mdg +
            this.mawbinfo.hbrq
          );
        },
        function(newval, oldval) {
          this.getAreaPrice(); //费用信息
         // this.getRate(); //费率
          this.getHbinfo();
        }
      );



      this.$watch(
        function() {
          return (
            this.formdata.mawb +
            this.formdata.sfg +
            this.formdata.mdg +
            this.formdata.hbrq+
            this.formdata.jfweight+
            this.formdata.jfweight_cus
          );
        },
        function(newval, oldval) {
          this.getRate(); //费率
        },{immediate:true}
      );
      // if(this.afreshRateCharge){
      //     this.getRate(); //费率
      // }


      this.$nextTick(() => {
        $(".bottomBtnFixed").width($(".dialogPage").width() - 30);
      });
    });
  },
  computed: {
    comIsOrderConfirm() {
      // return this.isOrderConfirm && this.mawbinfo.area == '上海'
      return false;
    },

     comIsOrderConfirmI() {
      return this.isOrderConfirm && this.mawbinfo.area == '上海'
    },

    ajaxUrl() {
      return this.orderdom != "分单"
        ? "api/ExHpoAxplineMawbDoc"
        : "api/ExAxplineHawbDoc";
    },
    agentcity(){
     return this.projectIsWecan?"WFF/SHA":"HFL/SHA"
    },
    borderClass(){
       return  this.orderdom!='分单'?'bordermawb':'borderhawb'
    },
    limitLength() {
      let isexportform = this.formdata.isexportform;
      let area = this.formdata.area;
      if (isexportform == "TANG" && area != "北京") {
        return 70;
      }
      if (isexportform == "TANG" && area == "北京") {
        return 100; //注意TANG在北京时，抬头是100，地址是150，所以里面的抬头判断如果是100，取150
      }
      if (isexportform == "CCSP") {
        if (
          (area == "成都" || area == "西安" || area == "北京") &&
          this.formdata.orderdom != "分单"
        ) {
          return 70;
        }
      }
      return 35;
    },

    descriptioncode: {
      get() {
        return this.formdata.descriptioncode
          ? this.formdata.descriptioncode.split(",")
          : [];
      },
      set(val) {
        this.formdata.descriptioncode = val.toString();
      }
    },
    isarranged: {
      get() {
        return this.formdata.isarranged == 1;
      },
      set(val) {
        this.formdata.isarranged = val ? 1 : 2;
      }
    },
    descriptioncodeOptions() {
      return JSON.parse(localStorage.groupTypeCode)[147];
    },
    asAed(){
      return this.orderdom=="分单"?"AS ARRANGED":"AS AGREED"
    },

    // 是否从单证制作进入
    isMakingBill() {
      return this.$route.name === 'axplineDzHawbSearch'
    },

    isHideButton() {
      let flag = false;
      if (this.activeName == 'tab1-dzmake') { //单证制作TAB
        if (this.mawbinfo.area == '上海') { // PVG 
          if (this.isMakingBill || (this.$router.name === 'customerSearch' || this.orderdom =='分单')) { //单证进入有保存制单信息，客服进入无保存制单信息按钮 || （客户综合查询&&分单
            flag = true;
          } else {
            flag = false;
          }
         
        } else { // 非PVG：都有保存制单信息按钮 
          flag = true;
        }
      } else if ( this.isOrderConfirm ) { // 单证确认TAB
         flag = false; // 不存在保存制单信息按钮
      }

      return !flag;
    },

    // 未保存制单信息 => 禁用打印
    buttonDisabled() {
      // 综合查询 => 单证制作模块 && 未制单 => 打印禁用
      if (this.orderdom == '总单') {
        return this.activeName === 'tab1-dzmake' && this.mawbinfo.zdmawbstatus === 1;
      } else {
        return this.activeName === 'tab1-dzmake' && this.formdata && this.formdata.zdhawbstatus != 700;
      }
      
    }
  },
  watch: {

    sfgquanpin(value) {
      if(!this.formdata.atplace) {
        this.formdata.atplace = value;
      }
    },

    "formdata.wagelist": {
      handler(val) {
        console.log(`wagelist: ${val}`)
        if (!val || val.length == 0) {
          return;
        }
        //  //console.log(11111111111)
        //  //console.log(JSON.stringify(val))
        var zfall = "";
        var zfall_cus = "";
        var ppothertotal = 0;
        var ppothertotal_cus = 0;
        val.forEach((item, index) => {
          if (item.itemsename) {
            var price = Number(
              this.setWageall(item.price, item.itemstype)
            ).toFixed(2);
            var price_cus = Number(
              this.setWageall(item.price, item.itemstype, true)
            ).toFixed(2);
            ppothertotal += Number(price);
            ppothertotal_cus += Number(price_cus);
            if ((index + 1) % 3 == 0) {
              zfall += "    " + item.itemsename + ":" + price + "\r\n";
              zfall_cus += "    " + item.itemsename + ":" + price_cus + "\r\n";
            } else {
              zfall += "    " + item.itemsename + ":" + price;
              zfall_cus += "    " + item.itemsename + ":" + price_cus;
            }
          }
        });
        this.zfall = zfall;
        this.zfall_cus = zfall_cus;
        this.ppothertotal = ppothertotal;
        this.ppothertotal_cus = ppothertotal_cus;
      },
      immediate: true,
      deep: true
    },
    "formdata.ratelevel"(val) {
      this.formdata.ratetotal = (
        this.formdata.rate *
        (this.formdata.ratelevel == "M" ? 1 : this.formdata.jfweight || 0)
      ).toFixed(2);
    },
    "formdata.ratelevel_cus"(val) {
      this.formdata.ratetotal_cus = (
        this.formdata.rate_cus *
        (this.formdata.ratelevel_cus == "M"
          ? 1
          : this.formdata.jfweight_cus || 0)
      ).toFixed(2);
    },
    "formdata.rate"(val) {
      this.formdata.ratetotal = (
        val * (this.formdata.ratelevel == "M" ? 1 : this.formdata.jfweight || 0)
      ).toFixed(2);
    },
    "formdata.rate_cus"(val) {
      this.formdata.ratetotal_cus = (
        val *
        (this.formdata.ratelevel_cus == "M"
          ? 1
          : this.formdata.jfweight_cus || 0)
      ).toFixed(2);
    },
    "formdata.jfweight"(val, oldval) {
      // console.log(22222)
      // console.log(val)
      // console.log(oldval)

      this.formdata.ratetotal = (
        this.formdata.rate * (this.formdata.ratelevel == "M" ? 1 : val || 0)
      ).toFixed(2);

      this.tableData[2].jfweight = val;

      if(val&&!this.formdata.jfweight_cus){
        this.formdata.jfweight_cus=val
      }
      //this.getRate(1); //费率

    },
    "formdata.jfweight_cus"(val) {
      this.formdata.ratetotal_cus = (
        this.formdata.rate_cus *
        (this.formdata.ratelevel_cus == "M" ? 1 : val || 0)
      ).toFixed(2);
      //this.getRate(2); //费率
    }
  },
};
</script>

<style lang="less" scoped>
@color: #e8e8e8;
@border: 1px solid @color;
.ordermawb {
  color: #426ede;
  border: 1px solid #557ce1;
  /deep/ div {
    color: #426ede !important;
  }
  /deep/ textarea {
    border-color: #b6c5eb;
  }
  /deep/ .el-input__inner {
    border-color: #b6c5eb;
  }
  /deep/ div {
    border-color: #557ce1;
  }
  /deep/ .el-textarea.is-disabled textarea {
    border-color: #b6c5eb;
    background: #f0f0f0;
    color: #999;
  }
}
.orderhawb {
  color: #ff4c21;
  border: 1px solid #ff4c21;
  /deep/ div {
    color: #ff4c21 !important;
  }
  /deep/ textarea {
    border-color: #ffbdb2;
  }
  /deep/ .el-input__inner {
    border-color: #ffbdb2;
  }
  /deep/ div {
    border-color: #ff583c;
  }
}
.bordermawb {
  border-color: #557ce1 !important;
  border-bottom: 1px solid #557ce1;
}
.borderhawb {
  border-color: #ff583c !important;
  border-bottom: 1px solid #ff583c;
}
.content {
  //  border:@border;
  /deep/ textarea {
    resize: none;
  }
  /deep/ .jfweight {
    width: 100px;
  }
}
.topCon {
  display: flex;
  justify-content: space-between;
}
.row {
  display: flex;
  justify-content: space-between;
  > div {
    flex: 1;
  }
  margin-bottom: 12px;
  .smallInput {
    flex: 0 0 150px;
  }
  .itemdiv:last-child {
    border-right: none;
  }
}
.itemdiv {
  padding: 10px 5px;
  border-right: @border;
  /deep/ input {
    padding: 0px;
    text-indent: 4px;
  }
  span {
    display: flex;
    flex-direction: column-reverse;
    height: 40px;
    width: 100%;
  }
}
.rightItem {
  padding: 10px 15px;
  border-bottom: @border;
}
.left {
  width: 660px;
  border-right: @border;
  border-bottom: @border;
  .leftItem {
    border-bottom: @border;
    .itemTitle {
      margin-bottom: 10px;
      color: #333;
    }
    span {
      color: #0f5a8c;
      margin-right: 12px;
      cursor: pointer;
    }
    .rowleft {
      padding: 10px 15px;
    }
    .rowright {
      padding: 10px 15px;
      border-left: @border;
      border-bottom: @border;
    }
  }
}
.right {
  flex: 1;
  border-bottom: 1px solid #e8e8e8;
}
.bottomBtnFixed {
  position: fixed;
  bottom: 14px;
  background: #fff;
  padding: 10px 0px;
  right: 31px;
  padding-right: 28px;
  border-top: 1px solid #ccc;
  box-shadow: 0px 0px 10px #666;
  z-index: 999;
}
.bottom-tip {
  position: fixed;
  text-align: right;
  margin-right: 15px;
  width: 1588px;
  bottom: 14px;
  background: #fff;
  padding: 10px 0px;
  right: 31px;
  padding-right: 28px;
  border-top: 1px solid #ccc;
  -webkit-box-shadow: 0px 0px 10px #666;
  box-shadow: 0px 0px 10px #666;
  z-index: 999;
}
</style>
