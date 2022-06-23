<template>
  <div class="costDetail">
    <!-- 合并订单订单号 -->
    <div v-if="allmaindata.iscomboine == 1">
      <commonTabs
        :list="childrenListAll"
        style="margin-bottom:20px;"
        :titleStyle="titleStyle"
        :checkedIndex.sync="childPonoCheckedAll"
        :showContent="false"
        @toggle="handleClick"
        :lineshu="lineshu"
      >
      </commonTabs>
    </div>
    <!--  默认点入 -->
    <div v-if="pagetype == 1 && showInfoList">
      <infoList
        :inputModelData="infoListAllmaindata"
        v-if="allmaindata.guid"
        :name="allmaindata.iscomboine == 1 ? '合并' : '详细'"
        :costBiaozhu="!Cshow && costDom == '客服' && !lineshu"
        ref="infoDetail"
      >
        <template slot="wageAlert">
          <span style="color:red" v-if="(wageBohuiYs || wageBohuiYf) && costDom"
            >有{{ wageBohuiYs ? `${wageBohuiYs}条应收费用驳回` : ""
            }}{{ wageBohuiYs && wageBohuiYf ? "," : ""
            }}{{
              wageBohuiYf ? `${wageBohuiYf}条应付费用驳回` : ""
            }}未处理!</span
          >
        </template>
        <template slot="betgroup2">
          <el-button
            @click="openCancelDialog"
            type="danger"
            v-show="showReasonBtn"
          >
            原因</el-button
          >
          <el-button
            v-if="costDom == '客服' && switchHxKh && !Cshow && allmaindata.czlx!='代操作'"
            @click="airLineOpen"
            >切换至航线费用</el-button
          >
        </template>
      </infoList>
      <!--    是否为C类 -->
      <div v-if="!Cshow">
        <p>
          <span
            v-if="isFromFob == 'Fob2'"
            style="float:right;position:relative;z-index:22"
          >
            <el-button
              type="primary"
              size="mini"
              style="height:28px;line-height:13px;"
              :disabled="
                costData.filter(i => i.wageinout == '1' && i.yssys != '2')
                  .length == 0
              "
              @click="showAccountShow"
            >
              <span>应收账单打印</span>
            </el-button>
            <el-button
              v-if="monitor == '1'"
              @click="checkFun('10')"
              type="primary"
            >
              提交审核
            </el-button>
            <el-button
              v-if="monitor == '2'"
              @click="checkFun('1')"
              type="primary"
            >
              取消审核
            </el-button>
          </span>
        </p>
      </div>
    </div>
    <!--  综合查询进入 -->
    <div v-if="pagetype != 1 && showInfoList">
      <infoList
        :inputModelData="infoListAllmaindata"
        v-if="allmaindata.guid"
        :ifopendetail="false"
        :name="allmaindata.iscomboine == 1 ? '合并' : '详细'"
        :costBiaozhu="pagetype != 1 && !Cshow && costDom == '客服' && !lineshu"
        ref="infoDetail"
      >
        <template slot="betgroup2">
          <el-button
            @click="openCancelDialog"
            type="danger"
            v-show="showReasonBtn"
          >
            原因</el-button
          >
          <el-button
            v-if="costDom == '客服' && switchHxKh && !Cshow"
            @click="airLineOpen"
            >切换至航线费用</el-button
          >
        </template>
      </infoList>
    </div>
    <!-- 核对模式行 -->
    <div
      style="margin:10px;"
      v-if="
        !isFromFob && !(allmaindata.iscomboine == 1 && childPonoChecked == 0) && !markTip
      "
    >
      <span
        v-if="!isFromFob"
        style="color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;"
        >折合人民币盈利:￥{{ zdtotalProfit }}</span
      >
      <span
        style="color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;margin-left:12px;margin-right:8px;"
      >
        平均每公斤毛利:￥{{
          Number(allmaindata["accountweightin"]) == "0"
            ? "0.00"
            : zdtotalPerProfit
        }}
      </span>
      <span style="float:right;margin-right:10px;">
        <setBhicon></setBhicon>
        <el-switch
          v-model="lineshu"
          inactive-color="#009900"
          active-color="#ff4949"
          :active-text="titleBj"
          v-if="!isFromFob"
        ></el-switch>
      </span>
    </div>
    <!-- C类客户显示 -->
    <div v-if="Cshow" style="color:red;font-weight:bold;font-size:14px;">
      1.该订单需要付款买单,请先新增并勾选费用作为预付款<br />
      2.在系统内邮件发送预付通知单给客户<br />
      3.客户支付完预付款后,由结算进行解锁并继续操作
    </div>
    <!-- 非核对模式 -->
    <div v-show="!lineshu">
      <div
        class="detail mawbCharge detailPaneYoung"
        v-if="
          allmaindata.groupid < 0 ||
            (allmaindata.groupid > 0 && childPonoChecked > 0) ||
            childPonoChecked == -1
        "
      >
        <el-row class="detail-title">
          <el-col :span="10">
            <p @click="$refs.mawbCharge.activeSettname = ''">应收费用总览</p>
          </el-col>
          <el-col
            :span="14"
            style="font-size:12px;font-weight:normal;text-align:right;"
            v-if="!Cshow"
          >
            <span style="float:right;margin-top:-1px;">
              <!-- 应收总确认显示  同时满足
                    1.(1)有costDom(客服等进入)并且是上海订单(2)无costDom(费用未确认或者综合查询【且不能为上海PVG】进入)(3)国内服务订单
                    2.allysConfirm条件
                    3.非海外订单
                    4.非调账订单，调账点入
                     -->
              <el-button
                type="primary"
                size="mini"
                @click="confirmButton('1', '700', 'all')"
                v-if="
                  ((costDom && allmaindata.area == conditionalAreaForBuild) ||
                    allmaindata.area != conditionalAreaForBuild ||
                    pagetype == '1') &&
                    allysConfirm &&
                    Number(allmaindata.gid) > 0 &&
                    !isFromFob &&
                    allmaindata.pono &&
                    allmaindata.pono.indexOf('TZ') == '-1' &&
                    showDuizhang
                "
                :title="allqrTitleYs"
                style="background:#00cc00;"
                class="wageButton"
                >应收总确认</el-button
              >
              <!-- 应收总取消显示  同时满足
                    1.(1)有costDom(客服等进入)并且是上海订单(2)无costDom(费用未确认或者综合查询【且不能为上海PVG】进入)(3)国内服务订单
                    2.yssysCost条件
                    3.非海外订单
                    4.非调账订单，调账点入
                    5.利润分配操作站不显示
                     -->
              <el-button
                type="primary"
                size="mini"
                @click="confirmButton('1', '1', 'all')"
                v-if="
                  ((costDom && allmaindata.area == conditionalAreaForBuild) ||
                    allmaindata.area != conditionalAreaForBuild ||
                    pagetype == '1') &&
                    !yssysCost &&
                    Number(allmaindata.gid) > 0 &&
                    !isFromFob &&
                    allmaindata.pono &&
                    allmaindata.pono.indexOf('TZ') == '-1' &&
                    showDuizhang &&
                    !(
                      allmaindata.orderguid > 0 &&
                      profitmode.indexOf('利润') != -1
                    )
                "
                :title="allqrTitleYs"
                style="background:#00cc00"
                class="wageButton"
                >应收总取消</el-button
              >
            </span>
          </el-col>
          <!-- 海外订单按钮控制 -->
          <el-col
            :span="14"
            v-if="!Cshow && isFromFob == 'Fob1'"
            style="text-align:right;"
          >
            <el-button
              v-if="
                allmaindata.overseasacc == '-1' ||
                  allmaindata.overseasacc == '20'
              "
              @click="checkFun('1')"
              type="primary"
              :disabled="
                costData.some(
                  i =>
                    i.confirmstatus == 1 && i.wageinout == '1' && i.yssys != '2'
                )
              "
              >提交审核</el-button
            >
            <el-button
              v-if="allmaindata.overseasacc == '1'"
              @click="checkFun('-1')"
              type="primary"
              >取消提交审核</el-button
            >
          </el-col>
        </el-row>
        <div class="detail-c">
          <!-- 应收费用Table控制 -->

          <costTableControl
            wageinout="1"
            :orderpgid="orderpgid"
            :allmaindata="allmaindata"
            :gysId="gysId"
            :suggest="suggestCharge"
            v-if="allmaindata.pono"
            :costData="costData"
            :serviceList="serviceSelect"
            :setnameList="yssettname"
            :costDom="costDom"
            :showDuizhang="showDuizhang"
            :isFromFob="isFromFob"
            ref="mawbCharge"
            :childData="childData"
            :childPonoChecked="childPonoChecked"
            :Cshow="Cshow"
            :profitmode="profitmode"
            :initiator="initiator"
            :pagetype="pagetype"
            :markTip="markTip"
            @handleCost="handleCost"
          ></costTableControl>
        </div>
      </div>
      <div class="detail mawbPayment detailPaneRed" v-if="!isFromFob && !Cshow && !markTip">
        <el-row class="detail-title">
          <el-col :span="12">
            <p @click="$refs.mawbPayment.activeSettname = ''">应付费用总览</p>
          </el-col>
          <el-col
            :span="12"
            style="font-size:12px;font-weight:normal;text-align:right;"
          >
            <span style="float:right;margin-top:-1px;">
              <!-- 应付带应收显示 同时满足
                                 1.应收费用存在一条未确认

                                 2. (1)有costDom(客服费用进入)(2)无costDom(费用未确认或者综合查询【且不能为上海PVG】进入)(3)国内服务订单
                                 3.非调账订单号
                             -->
              <el-button
                type="primary"
                @click="wageOutCarryIn"
                v-if="
                  costData.some(i => {
                    return i.confirmstatus == '1' && i.wageinout == '1';
                  }) &&
                    ((!costDom &&
                      (allmaindata.area != conditionalAreaForBuild ||
                        pagetype == '1')) ||
                      costDom) &&
                    allmaindata.pono &&
                    allmaindata.pono.indexOf('TZ') == '-1'
                "
                style="margin-right:100px;"
                ><i class="upIcon"></i>应付带应收</el-button
              >
              <!-- 应付总确认显示 同时满足 
                                 1.(1)有costDom(客服等进入)并且是上海订单(2)无costDom(费用未确认或者综合查询【且不能为上海PVG】进入)(3)国内服务订单
                                 2.allyfConfirm条件
                                 3.非调账订单号
                                 4.cbo订单应付总确认bo才能应付总确认
                            -->

              <el-button
                type="primary"
                size="mini"
                @click="confirmButton('2', '700', 'all')"
                style="background:red;"
                v-if="
                  ((costDom && allmaindata.area == conditionalAreaForBuild) ||
                    allmaindata.area != conditionalAreaForBuild ||
                    pagetype == '1') &&
                    allyfConfirm &&
                    allmaindata.pono &&
                    allmaindata.pono.indexOf('TZ') == '-1' &&
                    (allmaindata.groupid < 0 ||
                      (allmaindata.groupid > 0 &&
                        cboSystemWageYf &&
                        childData.boguid != allmaindata.boguid) ||
                      childData.boguid == allmaindata.boguid)
                "
                :title="allqrTitleYf"
                class="wageButton"
                >应付总确认</el-button
              >
              <!-- 应付取消显示 同时满足 
                                 1.(1)有costDom(客服等进入)并且是上海订单(2)无costDom(费用未确认或者综合查询【且不能为上海PVG】进入)(3)国内服务订单
                                 2.yfsysCost条件
                                 3.非调账订单号
                            -->

              <el-button
                type="primary"
                size="mini"
                @click="confirmButton('2', '1', 'all')"
                style="background:red"
                v-if="
                  ((costDom && allmaindata.area == conditionalAreaForBuild) ||
                    allmaindata.area != conditionalAreaForBuild ||
                    pagetype == '1') &&
                    !yfsysCost &&
                    allmaindata.pono &&
                    allmaindata.pono.indexOf('TZ') == '-1'
                "
                :title="allqrTitleYf"
                class="wageButton"
                >应付总取消
              </el-button>
            </span>
          </el-col>
        </el-row>
        <div class="detail-c">
          <!-- 应付费用Table控制 -->

          <costTableControl
            wageinout="2"
            :orderpgid="orderpgid"
            :allmaindata="allmaindata"
            :gysId="gysId"
            :suggest="suggestPayment"
            v-if="allmaindata.pono"
            :costData="costData"
            :serviceList="serviceSelect"
            :setnameList="yfsettname"
            :costDom="costDom"
            :showDuizhang="showDuizhang"
            :isFromFob="isFromFob"
            ref="mawbPayment"
            :childData="childData"
            :childPonoChecked="childPonoChecked"
            :Cshow="Cshow"
            :profitmode="profitmode"
            :initiator="initiator"
            :pagetype="pagetype"
            :markTip="markTip"
            @handleCost="handleCost"
          ></costTableControl>
        </div>
      </div>
    </div>
    <!-- 核对模式 -->
    <div v-show="lineshu && !isFromFob && !markTip" class="detailCost2">
      <div class="lineYinFu">
        <el-row class="detail-title">
          <el-col :span="6">
            <p>空运应付费用</p>
          </el-col>
          <el-col
            :span="5"
            style="color:red;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold"
          ></el-col>
        </el-row>
        <div class="tableContent">
          <div
            :style="{ width: '540px', overflow: 'auto', height: tableHeight }"
            v-scroll="onScroll"
            class="tableWrap"
          >
            <div
              style="color:red;font-size:12px;font-weight:normal;font-weight:bold;height:42px;line-height:42px;"
            >
              <span
                >确认总应付(折合人民币)：{{ zdtotalPayment.toFixed(2) }}</span
              >
            </div>
            <table
              :style="{
                'border-collapse': 'collapse',
                'table-layout': 'fixed',
                width: '100%',
                'margin-top': '12px'
              }"
            >
              <tr style="height:32px;">
                <!-- 上海单子不显示操作列 -->
                <th width="80">操作</th>
                <th width="50">免</th>
                <td width="80">
                  创建人
                </td>
                <th width="150">结算对象</th>
                <th width="100">服务项目</th>
                <th width="90">数量</th>
                <th width="90">单价</th>
                <th width="90">币种</th>
                <th width="150">金额(折合人民币)</th>
                <th width="80">状态</th>
              </tr>
              <tr
                v-for="(item, index) in wageoutSortLine"
                :style="{
                  backgroundColor:
                    index == modCostIndex && wagetypeInOut == 2
                      ? '#fff9d6'
                      : item.isfree == '2'
                      ? '#e2fdde'
                      : '',
                  height: '32px'
                }"
              >
                <td
                  v-if="
                    (!costDom &&
                      allmaindata.area == conditionalAreaForBuild &&
                      pagetype == '2') ||
                      allmaindata.area == '上海'
                  "
                  width="80"
                >
                  --
                </td>
                <td width="80" v-else>
                  <span v-if="item.leastwageall">
                    <i
                      class="el-icon-setting"
                      style="font-size:16px;"
                      title="修改费用"
                      @click="modCost(index, item, '2')"
                      :icondisabled="
                        $refs.mawbCharge.disabledEdit('2', item) || !yfsysCost
                      "
                    ></i>
                    <i
                      class="el-icon-delete"
                      style="font-size:16px;"
                      title="删除费用"
                      @click="delCost($event, 2, index)"
                    ></i>
                  </span>
                </td>
                <td width="50">{{ item.isfree == "1" ? "否" : "是" }}</td>
                <td width="80">
                  {{ item.addman }}
                </td>
                <td width="150" :title="item.settname">{{ item.settname }}</td>
                <td width="100">{{ item.items }}</td>
                <td width="90">{{ item.num }}</td>
                <td width="90">{{ item.price }}</td>
                <td width="90">{{ item.currency }}</td>
                <td width="150">{{ item.wageall }}</td>
                <td width="80">
                  {{
                    item.isbill == "1"
                      ? "已对账"
                      : item.confirmstatus == "700"
                      ? "已确认"
                      : "未确认"
                  }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="lineYinShou">
        <el-row class="detail-title">
          <el-col :span="6">
            <p>空运应收费用</p>
          </el-col>
        </el-row>
        <div class="tableContent">
          <div
            :style="{ width: '540px', overflow: 'auto', height: tableHeight }"
            v-scroll="onScroll"
            class="tableWrap"
          >
            <div
              style="color:#00CC00;font-size:12px;font-weight:normal;font-weight:bold;height:42px;line-height:42px;"
            >
              <span
                >确认总应收(折合人民币)：{{ zdtotalCharge.toFixed(2) }}</span
              >
            </div>
            <table
              :style="{
                'border-collapse': 'collapse',
                'table-layout': 'fixed',
                width: '100%',
                'margin-top': '12px'
              }"
            >
              <tr style="height:32px;">
                <th width="80">操作</th>
                <th width="50">免</th>
                <td width="80">
                  创建人
                </td>
                <th width="150">结算对象</th>
                <th width="100">服务项目</th>
                <th width="90">数量</th>
                <th width="90">单价</th>
                <th width="90">币种</th>
                <th width="150">金额(折合人民币)</th>
                <th width="80">状态</th>
              </tr>
              <tr
                v-for="(item, index) in wageinSortLine"
                :style="{
                  backgroundColor:
                    index == modCostIndex && wagetypeInOut == '1'
                      ? '#fff9d6'
                      : item.isfree == '2'
                      ? '#e2fdde'
                      : ''
                }"
                style="height:32px;"
              >
                <td
                  v-if="
                    (!costDom &&
                      allmaindata.area == conditionalAreaForBuild &&
                      pagetype == '2') ||
                      allmaindata.area == '上海'
                  "
                  width="80"
                >
                  --
                </td>
                <td width="80" v-else>
                  <span v-if="item.leastwageall">
                    <i
                      class="el-icon-setting"
                      style="font-size:16px;"
                      title="修改费用"
                      @click="modCost(index, item, '1')"
                      :icondisabled="
                        $refs.mawbCharge.disabledEdit('2', item) || !yssysCost
                      "
                    ></i>
                    <i
                      class="el-icon-delete"
                      style="font-size:16px;"
                      title="删除费用"
                      @click="delCost($event, 1, index)"
                    ></i>
                  </span>
                </td>
                <td width="50">{{ item.isfree == "1" ? "否" : "是" }}</td>
                <td width="80">
                  {{ item.addman }}
                </td>
                <td width="150" :title="item.settname">{{ item.settname }}</td>
                <td width="100">
                  <span v-if="item.leastwageall">{{ item.items }}</span>
                </td>
                <td width="90">{{ item.num }}</td>
                <td width="90">{{ item.price }}</td>
                <td width="90">{{ item.currency }}</td>
                <td width="150">{{ item.wageall }}</td>
                <td width="80">
                  {{
                    item.isbill == "1"
                      ? "已对账"
                      : item.confirmstatus == "700"
                      ? "已确认"
                      : "未确认"
                  }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="lineAllin">
        <el-row class="detail-title">
          <el-col :span="6">
            <p>总盈利</p>
          </el-col>
        </el-row>
        <div class="tableContent">
          <div
            :style="{
              width: '188px',
              overflow: 'auto',
              height: tableHeight,
              position: 'relative'
            }"
          >
            <p
              style="font-weight:bold;font-size:12px;color:#fff;background:orange;height:42px;line-height:42px;width:100%;"
            >
              盈利(折合人民币):￥{{ zdtotalProfit }}
            </p>
            <table
              :style="{
                'border-collapse': 'collapse',
                'table-layout': 'fixed',
                width: '100%',
                'margin-top': '12px'
              }"
            >
              <tr style="height:32px;">
                <th>差额(折合人民币)</th>
              </tr>
              <tr v-for="(item, index) in toolTip" style="height:32px;">
                <td
                  :style="{
                    color:
                      Number(item) < 0
                        ? 'red'
                        : Number(item) > 0
                        ? '#00CC00'
                        : ''
                  }"
                >
                  {{ item }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 取消审核原因 -->
    <el-dialog
      width="600px"
      top="4%"
      center
      :visible.sync="reason"
      v-if="reason"
      append-to-body
      @close="reason = false"
      custom-class="reason"
    >
      <div>
        <div class="orderSystem-c">
          <h3>驳回原因</h3>
          <el-input
            type="textarea"
            v-model="overseasaccreason"
            class="input-required"
            :autosize="{ minRows: 4 }"
            style="margin-top:12px;color:#c8c8c8"
            placeholder="取消原因"
          ></el-input>
        </div>
        <p style="margin-top:18px;text-align:right">
          <el-button @click="checkFun('20')" type="primary">确定</el-button>
          <el-button @click="reason = false">取消</el-button>
        </p>
      </div>
    </el-dialog>
    <!-- 应收账单 -->
    <el-dialog
      width="1260px"
      top="4%"
      center
      :visible.sync="showAccount"
      v-if="showAccount"
      append-to-body
    >
      <accountMake
        :orderInformation="orderInformation"
        wageinout="1"
        :system="allmaindata.system"
        :area="area"
        :isFromFob="isFromFob"
        :guid="boguid"
      ></accountMake>
    </el-dialog>
    <!-- 对账制作 -->
    <el-dialog
      width="1260px"
      top="4%"
      center
      :visible.sync="showRecon"
      v-if="showRecon"
      append-to-body
    >
      <reconMngDetail
        :jobid="childrenList[childPonoChecked].boguid"
        :wageinout="wageinout"
        :system="allmaindata.system"
        v-if="showRecon"
        @unVisible="showRecon = false"
        :area="mawbInformation.area"
        :selectgid="$refs.mawbCharge.activeSettname"
      ></reconMngDetail>
    </el-dialog>

    <!-- 修改费用弹框 -->
    <el-dialog
      width="1300px"
      top="8%"
      center
      :visible.sync="showEdit"
      @close="
        showEdit = false;
        modCostIndex = '-1';
      "
      v-if="showEdit"
      append-to-body
      :close-on-click-modal="false"
    >
      <commonTable
        class="commonTable"
        :head="$refs.mawbCharge.mawb_table_model"
        style="margin-top:20px;"
        :tableIndex="0"
        v-if="showEdit"
        :table-data="[]"
      >
        <template slot="firstTd" slot-scope="props">
          <td>
            <i class="icon-save" @click="modifyCost"></i>

            <i class="el-icon-close" @click="showEdit = false"></i>
          </td>
          <td>
            <input type="checkbox" v-model="curObject.isfree" />
          </td>

          <td>--</td>

          <td style="display:inline-flex;border:none;width:100%">
            <page-select
              :modelval.sync="curObject.gid"
              :pagetype="wagetypeInOut == '1' ? 2 : 3"
              @change="curObject.settname = data.usr_name"
              :area="allmaindata.area"
              v-if="allmaindata.area"
            ></page-select>
          </td>

          <td>
            <page-select
              :modelval.sync="curObject.items"
              :pagetype="5"
              :area="allmaindata.area"
              v-if="allmaindata.area"
              :disabled="curObject.isallin == '1'"
              :servicecode="
                allmaindata.area == conditionalAreaForBuild
                  ? conditionalAreaForBuild
                  : ''
              "
              @change="servicecode = data.servicecode"
            >
            </page-select>
          </td>

          <td>
            <el-select v-model="curObject.wagetype" style="width:130px;">
              <el-option
                v-for="(item, index) in $refs.mawbCharge.jsfs"
                :value="item.typename"
                :label="item.typename"
                :key="index"
              ></el-option>
            </el-select>
          </td>

          <td>
            <el-input
              v-model="curObject.num"
              style="width:100px;"
              v-verify="curObject.wagetype == '票' ? 'integer' : 'fixedTwo'"
            >
            </el-input>
          </td>

          <td>
            <el-input
              v-model="curObject.price"
              style="width:100px;"
              v-verify="'fixedTwo'"
            ></el-input>
          </td>

          <td>
            <el-select v-model="curObject.currency" style="width:100px;">
              <el-option
                v-for="(item, index) in $refs.mawbCharge.currencyList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </td>

          <td>
            <el-input
              v-model="zdLeastWageall"
              style="width:100px;"
              :disabled="true"
            ></el-input>
          </td>
          <td>
            <el-input
              v-model="zdWageAll"
              style="width:100px;"
              :disabled="true"
            ></el-input>
          </td>
          <td>
            <el-input
              v-model="zdChangeRate"
              style="width:100px;"
              :disabled="true"
            ></el-input>
          </td>
          <td
            v-if="allmaindata.pono && allmaindata.pono.indexOf('BOGN') == '-1'"
          >
            <el-select
              v-model="curObject.otherno"
              style="width:150px;"
              :disabled="
                allmaindata.pono && allmaindata.pono.indexOf('TZ') != '-1'
              "
            >
              <el-option
                v-for="(item, index) in $refs.mawbCharge.hawbList"
                :key="index"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </td>
          <td>
            <el-input
              v-model="curObject.remark"
              style="width:100px;"
            ></el-input>
          </td>
        </template>
      </commonTable>
    </el-dialog>
  </div>
</template>
<script>
import accountMake from "./accountMake";
import reconMngDetail from "./reconMngDetail";
import costTableControl from "@/components/templates/costTableControl";
import {
  getChangeRate,
  computedWeight,
  configData,
  getMomentDate,
  getWtxmname,
  getWtkhname,
  formatDate
} from "../../api/localStorage.js";
import { myCommonTable, setBhiconColorMixin } from "@/common/detailPagesMixin";

export default {
  components: {
    accountMake,
    reconMngDetail,
    myCommonTable,
    costTableControl
  },
  mixins: [setBhiconColorMixin],
  props: {
    mawbguid: {
      type: [Number, String],
      required: true
    },
    boguid: {
      type: [Number, String],
      required: true
    },
    pagetype: {
      //1默认 2综合查询进去
      type: [Number, String],
      default: 1
    },
    inputModelData: {
      type: Object
    },
    isFromFob: String, //Fob1 D/N制作、Fob2 D/N审核
    jobid: String,
    // system:String,
    area: String,
    initiator: [String, Number], //驳回发起方(30/40),"receiver":驳回操作方（10/20）;10客服 操作方 20航线 操作方 30结算 发起方 40经理 发起方
    gid: "",
    costDom: {
      type: String,
      default: ""
    },
    showSuggestWage: {
      type: Boolean,
      default: false
    },
    switchHxKh: {
      type: Boolean,
      default: true
    },
    Cshow: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean
    },
    monitor: "",
    showDuizhang: {
      //tzOperation 点入
      type: Boolean,
      default: true
    },
    markTip:[Number,String],
  },
  data() {
    return {
      showReasonBtn: true, //原因按钮(综合查询进入)
      cancelVisible: false, //原因弹框
      profitmode: "", //分配模式
      modCostIndex: -1, //修改费用Index
      curObject: {}, //当前修改费用
      allmaindata: {}, //订单明细
      costData: [], //总费用明细
      suggestWageListAll: [], //所有建议费用
      zfstdin: "2", // 建议费用标准

      yssettname: [], //应收结算对象
      yfsettname: [], //应收结算对象
      // activeSettnameYs: '', //选中的应收结算对象
      // activeSettnameYf: '', //选中的应付结算对象

      childrenList: [], //合并所有订单
      childData: {}, //选中合并子订单数据
      childPonoCheckedAll: 1, //合并订单激活index

      titleBj: "启用核对模式", //核对模式标题
      lineshu: false, //切换核对显示
      wageinSortLine: [], //核对模式应收
      wageoutSortLine: [], //核对模式应付
      toolTip: [],
      position: {
        scrollTop: "0px",
        scrollLeft: "0px"
      },

      showAccount: false, //应收账单打印
      orderInformation: {
        //应收账单导入数据
        info: {},
        costInfo: []
      },
      showRecon: false, //对账弹框显示隐藏
      overseasaccreason: "", //审核取消、审核原因
      reason: false, //取消审核弹框
      canceltype: 4, //原因类型
      serviceSelect: [], //服务列表切换
      orderpgid: "", //已分配后取得应收结算对象
      gysId: "", //应付销售站结算对象
      showInfoList: true, //是否显示头

      showEdit: false, //左右弹框
      modCostIndex: "-1", //核对模式修改费用
      servicecode: "", //服务代码
      curObject: {}, //当前修改费用LIST
      wagetypeInOut: "" //应收付类型
    };
  },
  created() {
    if (this.defaultCurrency) {
      this.curObjectKyYs.currency = this.defaultCurrency;
      this.curObjectKyYf.currency = this.defaultCurrency;
    }
    if (this.boguid) {
      this.mawbDetail();
    }
  },
  computed: {
    // 选中的子订单index   childPonoCheckedAll值为所有tab切换订单
    childPonoChecked() {
      return this.childPonoCheckedAll - 1;
    },
    //所有子类列表
    childrenListAll() {
      return [
        {
          pono: "总览",
          boguid: ""
        },
        ...this.childrenList
      ];
    },
    infoListAllmaindata() {
      //摘要详细数据
      let result = this.allmaindata;
      if (result.iscomboine == 1 && this.childPonoChecked > 0) {
        let data = JSON.parse(
          JSON.stringify(this.childrenList[this.childPonoChecked])
        );
        data.guid = result.guid;
        data.boguid = result.boguid;
        data.sid = result.sid;
        return data;
      }
      return result;
    },
    titleStyle() {
      let arr = [];
      this.childrenListAll.forEach((i, k) => {
        let cost = this.costData.filter(
          e => e.sid == i.boguid && e.wagedom == this.costDom && e.yssys == 2
        );
        if (i.pono == "总览") {
          arr.push(this.spanstyle("black", this.childPonoCheckedAll == k));
        } else {
          arr.push(
            this.spanstyle(
              cost.length ==
                cost.filter(e => e.confirmstatus == "700").length &&
                cost.length != 0
                ? "green"
                : "red",
              this.childPonoCheckedAll == k
            )
          );
        }
      });
      console.log(arr);
      return arr;
    },
    //应收费用确认显示人和时间
    allqrTitleYs() {
      var cost = this.costData.filter(i => {
        return (
          i.yssys == "2" && i.wageinout == "1" && i.wagedom == this.costDom
        );
      })[0];
      if (cost)
        return "确认人:" + cost.confirmman + ",确认时间:" + cost.confirmdate;
    },
    //应付费用确认显示人和时间
    allqrTitleYf() {
      var cost = this.costData.filter(i => {
        return (
          i.yssys == "2" && i.wageinout == "2" && i.wagedom == this.costDom
        );
      })[0];

      if (cost)
        return "确认人:" + cost.confirmman + ",确认时间:" + cost.confirmdate;
    },
    wageBohuiYs() {
      //是否存在应收驳回未处理
      return this.costData.filter(
        i => (i.status == 100 || i.status == 110) && i.wageinout == 1
      ).length;
    },
    wageBohuiYf() {
      //是否存在应付驳回未处理
      return this.costData.filter(
        i => (i.status == 100 || i.status == 110) && i.wageinout == 2
      ).length;
    },
    //应收总费用
    zdtotalCharge() {
      return this.costData.reduce((a, b) => {
        if (b.wageinout == "1" && b.confirmstatus >= 700 && b.isfree == 1) {
          a += Number(b.wageall);
        }
        return a;
      }, 0);
    },
    //应付总费用
    zdtotalPayment() {
      return this.costData.reduce((a, b) => {
        if (b.wageinout == "2" && b.confirmstatus >= 700 && b.isfree == 1) {
          //console.log(b)
          a += Number(b.wageall);
        }
        return a;
      }, 0);
    },
    //折合人民币盈收
    zdtotalProfit() {
      return (
        Number(this.zdtotalCharge.toFixed(2)) -
        Number(this.zdtotalPayment.toFixed(2))
      ).toFixed(2);
    },
    //每公斤毛利
    zdtotalPerProfit() {
      return (
        this.zdtotalProfit / Number(this.allmaindata["accountweightin"])
      ).toFixed(2);
    },

    //核对模式表格高度
    tableHeight() {
      var height = "";
      if (this.wageinSortLine.length > this.wageoutSortLine.length) {
        height = (this.wageinSortLine.length + 1) * 40 + 30 + "px";
      } else if (this.wageoutSortLine.length > this.wageinSortLine.length) {
        height = (this.wageoutSortLine.length + 1) * 40 + 30 + "px";
      } else {
        height = (this.wageinSortLine.length + 1) * 40 + 30 + "px";
      }
      return height;
    },
    //是否自动应付带应收现废弃
    iswageoutcarryin() {
      return this.$store.getters.userSetting.wageoutCarryIn;
    },
    cboSystemWageYf() {
      //CBO应付费用总确认了,BO应付才可以总确认
      if (
        this.costData.filter(
          i =>
            i.sid == this.allmaindata.boguid &&
            (i.confirmstatus == "700" || i.confirmstatus == "已确认")
        ).length
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 客服应收费用是否已经总确认
    kfWageinAllConfirm() {
      // if(this.allmaindata.opersystem!='空进'){
        return this.costData
        .filter(
          item =>
            ((item.wagedom === "客服"&&this.allmaindata.opersystem!='进口')||this.allmaindata.opersystem=='进口') && item.wageinout === 1 && item.yssys == "2"
        )
        .every(i => i.confirmstatus == "700");
      // }else{
      //   return true
      // }

    },
    // 客服应付费用是否已经总确认
    kfWageoutAllConfirm() {
      return this.costData
        .filter(
          item =>
            ((item.wagedom === "客服"&&this.allmaindata.opersystem!='进口')||this.allmaindata.opersystem=='进口')&& item.wageinout === 2 && item.yssys == "2"
        )
        .every(i => i.confirmstatus == "700");
    },
    suggestCharge() {
      //console.log(this.suggestWageListAll)
      let list = [];
      // 费用总确认之后不请求建议费用
      if (this.kfWageinAllConfirm) return list;

      // 过滤掉已存在的服务项目
      let chargeItemsList = this.costData
        .filter(i => i.wageinout == "1" && i.yssys != "2")
        .map(i => {
          if (this.allmaindata.groupid < 0) {
            return i.items;
          } else {
            if (i.sid == this.childData.boguid) {
              return i.items;
            }
          }
        });

      console.log(chargeItemsList);
      list = this.suggestWageListAll.filter(item => {
        if (
          (item.wageinout === 1 &&
            !chargeItemsList.includes(item.items) &&
            this.allmaindata.groupid < 0) ||
          (item.wageinout === 1 &&
            !chargeItemsList.includes(item.items) &&
            this.allmaindata.groupid > 0 &&
            this.childData.boguid == item.sid)
        ) {
          return true;
        }
        return false;
      });
      // console.log(list)
      if (this.zfstdin === "1") {
        // 唯凯标准时只显示唯凯标准
        list = list.filter(item => {
          return item.std === "唯凯标准";
        });
      } else if (this.zfstdin === "2") {
        // 客户标准时显示客户标准+补足唯凯标准
        let khstdItemsArr = list.reduce((p, item) => {
          if (item.std === "客户标准") {
            p.push(item.items);
          }
          return p;
        }, []);
        //console.log(khstdItemsArr)
        list = list.filter(item => {
          // 优先显示客户标准，过滤掉重名的唯凯标准费用
          if (item.std === "唯凯标准" && khstdItemsArr.includes(item.items)) {
            return false;
          }
          return true;
        });
      }
      console.log(list);

      // let suggestList = []
      // list.forEach((item ,index)=> {
      //   // 默认勾选
      //   if (item.defaultcheck === 1) {
      //     suggestList.push(item.suggestindex)
      //   }
      // })
      // this.checkedWageinSuggestindex = suggestList
      return list;
    },
    suggestPayment() {
      let list = [];
      if (this.kfWageoutAllConfirm) return list;

      let paymentItemsList = this.costData
        .filter(i => i.wageinout == "2" && i.yssys != "2")
        .map(i => i.items);
      list = this.suggestWageListAll.filter(item => {
        if (
          (item.wageinout === 2 &&
            !paymentItemsList.includes(item.items) &&
            this.allmaindata.groupid < 0) ||
          (item.wageinout === 2 &&
            !paymentItemsList.includes(item.items) &&
            this.allmaindata.groupid > 0 &&
            this.childData.boguid == item.sid)
        ) {
          return true;
        }
        return false;
      });

      // let suggestList = []
      // list.forEach(item => {
      //   if (item.defaultcheck === 1) {
      //     suggestList.push(item.suggestindex)
      //   }
      // })
      // this.checkedWageoutSuggestindex = suggestList
      return list;
    },
    //应收总确认按钮显示逻辑 1.操作站利润分配不显示 2.(1)系统费用未确认并且(2)勾选未确认费用数量与费用未确认数量相同并且(3)未选中结算对象
    allysConfirm() {
      if (
        this.allmaindata.orderguid > 0 &&
        this.profitmode.indexOf("利润") != -1
      ) {
        return false;
      } else {
        var length = this.costData.filter(
          i =>
            i.wageinout == "1" &&
            i.yssys != "2" &&
            i.confirmstatus == "1" &&
            (this.allmaindata.groupid < 0 ||
              (this.allmaindata.groupid > 0 && i.sid == this.childData.boguid))
        ).length;

        return (
          this.yssysCost &&
          this.$refs.mawbCharge &&
          !this.$refs.mawbCharge.activeSettname &&
          this.$refs.mawbCharge.wageguid.length == length &&
          this.$refs.mawbCharge.costConfirm
        );
      }
    },
    //应付总确认按钮显示逻辑
    allyfConfirm() {
      var length = this.costData.filter(
        i =>
          i.wageinout == "2" &&
          i.yssys != "2" &&
          i.confirmstatus == "1" &&
          (this.allmaindata.groupid < 0 ||
            (this.allmaindata.groupid > 0 && i.sid == this.childData.boguid))
      ).length;
      //console.log(this.$refs.mawbPayment)
      return (
        this.yfsysCost &&
        this.$refs.mawbPayment &&
        !this.$refs.mawbPayment.activeSettname &&
        this.$refs.mawbPayment.wageguid.length == length &&
        this.$refs.mawbPayment.costConfirm
      );
    },
    //应收系统费用有无确认  1.利润分配不显示
    yssysCost() {
      return this.costData
        .filter(
          i =>
            i.wageinout == "1" &&
            i.yssys == "2" &&
            (this.allmaindata.groupid < 0 ||
              (this.allmaindata.groupid > 0 && i.sid == this.childData.boguid))
        )
        .some(i => i.confirmstatus == "1");
    },
    //应付系统费用有无确认
    yfsysCost() {
      return this.costData
        .filter(
          i =>
            i.wageinout == "2" &&
            i.yssys == "2" &&
            (this.allmaindata.groupid < 0 ||
              (this.allmaindata.groupid > 0 && i.sid == this.childData.boguid))
        )
        .some(i => i.confirmstatus == "1");
    },

    zdChangeRate() {
      return getChangeRate(this.curObject.currency);
    },
    zdLeastWageall() {
      if (this.curObject.num && this.curObject.price) {
        return (
          Number(this.curObject.num) * Number(this.curObject.price)
        ).toFixed(2);
      }
    },
    zdWageAll() {
      if (this.zdLeastWageall && this.zdChangeRate) {
        return (
          Number(this.zdLeastWageall) * Number(this.zdChangeRate)
        ).toFixed(2);
      }
    }
  },
  watch: {
    lineshu(val) {
      if (val) {
        this.titleBj = "启用编辑模式";
        this.$set(this.childrenListAll[1], "disabled", true);
      } else {
        this.titleBj = "启用核对模式";
        this.$set(this.childrenListAll[1], "disabled", false);
      }
      this.modCostIndex = "-1";
    },
    "curObject.wagetype"(val, oldval) {
      console.log(oldval);
      if (this.modCostIndex != "-1" && !oldval) {
        return;
      } else {
      }
      switch (val) {
        case "箱":
          this.curObject.num = this.allmaindata.realpiece;
          break;
        case "票":
          this.curObject.num = "1";
          break;
        case "计重":
          this.curObject.num = computedWeight(
            this.curObject.realvolume,
            this.curObject.realweight
          );
          break;
        case "结算重量":
          this.curObject.num = this.allmaindata.accountweightout;
          break;
        case "毛重":
          this.curObject.num = this.allmaindata.realweight;
          break;
        case "分运单票数":
          this.curObject.num = this.allmaindata.hawbnum || 0;
          break;
        case "总运单票数":
          this.curObject.num = 1;
          break;
        case "总运单件数":
          this.curObject.num = this.allmaindata.realpiece;
          break;
      }
    }
  },

  methods: {
    //订单详细
    async mawbDetail() {
      await this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: {
          boguid: this.boguid
        },
        loading: true,
        tip: false
      })
        .then(results => {
          if (results.data) {
            this.allmaindata = results.data;
            this.childrenList.push(this.allmaindata);

            //处理航班号、航班日期
            if (
              results.data.opersystem == "国内服务" ||
              results.data.opersystem == "进口"
            ) {
              this.allmaindata["hbh"] = results.data.hbh;
              this.allmaindata["hbrq"] = results.data.hbrq.substring(0, 11);
            } else {
              this.allmaindata["hbh"] = results.data.shipaceInfo.hbh
                ? results.data.shipaceInfo.hbh
                : results.data.yqhbh;
              this.allmaindata["hbrq"] =
                results.data.shipaceInfo.hbrq &&
                results.data.shipaceInfo.hbrq.indexOf("1900") == -1
                  ? results.data.shipaceInfo.hbrq.substring(0, 11)
                  : results.data.yqhbrq.substring(0, 11);
            }

            //勾选的服务列表
            results.data.serviceList.forEach(i2 => {
              JSON.parse(localStorage.serviceData).forEach(i => {
                if (i.servicecode == i2.servicecode && i2.isdel == 1) {
                  i2.typename = i.servicename;
                  this.$set(i2, "numYs", 0);
                  this.$set(i2, "numYf", 0);
                  this.serviceSelect.push(i2);
                }
              });
            });
            this.serviceSelect.push({
              servicecode: "AA9999",
              typename: "代收代付",
              numYs: 0,
              numYf: 0,
              bindeguid: -1
            });
            if (
              results.data.system == "空出" &&
              !this.serviceSelect.some(i => {
                return i.servicecode == "OA0010";
              })
            ) {
              this.serviceSelect.unshift({
                servicecode: "AA9998",
                typename: "代操作",
                numYs: 0,
                numYf: 0,
                bindeguid: -1
              });
            }

            if (results.data.orderguid > 0) {
              //已分配结算对象操作站
              //results.data.serviceList.forEach(item => {
                // if (item.servicecode == "OA0010") {
                //   this.orderpgid = String(item.orderpgid);
                //   this.profitmode = item.profitmode ? item.profitmode : "本站";
                // }
              //});
              //this.profitmode=this.$refs.infoDetail.getServiceGuid('OA0010','profitmode')||'本站'
              this.gysId = String(results.data.mawbgid);
            } else {
              //未分配结算对象销售站或本站
              if (results.data.childguid == -1) {
                //本站
                this.gysId = results.data.mawbgid;
              } else if (results.data.childguid > 0) {
                //销售站
                results.data.serviceList.forEach(item => {
                  if (item.servicecode == "OA0010") {
                    this.gysId = item.childpgid;
                  }
                });
              }
              this.orderpgid = results.data.gid;
            }

          if (results.data.serviceList) {
                for(var i in results.data.serviceList){
                    var item=results.data.serviceList[i]
                    if(item.servicecode=='OA0010'&&item.profitmode){
                      this.profitmode=item.profitmode
                      break;
                    }else{
                      if(item.profitmode){
                        this.profitmode=item.profitmode
                      }else{
                          continue
                      }  
                    }
                }
                
            }

            let row = this.allmaindata;
            this.showReasonBtn =
              row.examineremark ||
              row.cancelreason ||
              row.routedelreason ||
              row.delbillreason ||
              row.overseasaccreason ||
              row.wagecommitreason ||
              row.customreason ||
              row.tgreason;

            if ($(".el-dialog__wrapper:visible").length > 1) {
              this.showReasonBtn = false;
            }
            //临时客户不显示
            this.allmaindata.wtxmname =
              getWtxmname(results.data.gid, 1) != "临时客户"
                ? getWtxmname(results.data.gid, 1)
                : "";
            this.allmaindata.wtkhname =
              getWtkhname(results.data.fid, 1) != "临时客户"
                ? getWtkhname(results.data.fid, 1)
                : "";
            //console.log(this.allmaindata.wtxmname)
            //console.log(this.allmaindata.wtkhname)
            // sessionStorage.setItem("area", results.data.area);
            // if (results.data.orderguid == -1 && results.data.childguid == -1) {
            //   sessionStorage.setItem("ordertype", 1);
            // }
            // if (results.data.orderguid > 0 && results.data.childguid > 0) {
            //   sessionStorage.setItem("ordertype", 2);
            // }
            // if (results.data.orderguid > 0 && results.data.childguid == -1) {
            //   sessionStorage.setItem("ordertype", 4);
            // }
            // if (data.orderguid == -1 && results.data.childguid > 0) {
            //   sessionStorage.setItem("ordertype", 3);
            // }
          }
        })
        .catch(error => {});

      await this.mawbCost();

      if (
        this.showSuggestWage &&
        this.allmaindata.opersystem !== "国内服务" &&
        this.allmaindata.wageconfirmstatus != "700" &&
        ((this.costDom && this.allmaindata.system!='空进') || this.allmaindata.system=='空进')&&
        this.costDom != "结算"
      ) {
        this.getSuggestWageData();
      }
      if (this.allmaindata.groupid > 0) {
        //合并订单查询子订单
        this.childrenDetail();
        this.handleClick({
          index: 1
        });
        //this.togglehawbN(this.childrenListAll[1])
        //this.showInfoList = true
      }
    },
    //获取费用
    mawbCost() {
      var url = this.Cshow ? "api/CheckBill/GetWage" : "api/ExHpoAxplineWage";
      this.wageoutSortLine = [];
      this.wageinSortLine = [];
      this.toolTip = [];
      return this.$axios({
        method: "get",
        url: this.$store.state.webApi + url,
        params: {
          sid: this.mawbguid,
          boguid:
            this.allmaindata.groupid > -1
              ? this.allmaindata.groupid
              : this.boguid,
          groupid: this.allmaindata.iscomboine == 1 ? this.boguid : "-1"
        },
        loading: true,
        tip: false
      }).then(results => {
        results.data.sort((a, b) => {
          if (Number(a["isshare"]) == Number(b["isshare"])) {
            if (Number(a["gid"]) == Number(b["gid"])) {
              if (Number(a["orderindex"]) == Number(b["orderindex"])) {
                return a["items"].localeCompare(b["items"], "zh");
              } else {
                return Number(a["orderindex"]) > Number(b["orderindex"])
                  ? 1
                  : -1;
              }
            } else {
              return Number(a["gid"]) > Number(b["gid"]) ? 1 : -1;
            }
          } else {
            if (Number(a["isshare"]) != "1") {
              return Number(a["isshare"]) > Number(b["isshare"]) ? 1 : -1;
            }
          }
        });

        if (this.costDom) {
          if (this.allmaindata.opersystem == "国内服务") {
            this.costData = results.data;
          } else {
            this.costData = results.data.filter(i => {
              return i.wagedom == this.costDom;
            });
          }
        } else {
          if(this.markTip){
            this.costData = results.data.filter(i=>i.iscash=='1');
          }else{
            this.costData = results.data;
          }
        }
        console.log(this.costData)
        this.costData.forEach(i => {
          // 各状态费用背景颜色
          if (i.confirmstatus == "已确认" || i.confirmstatus == "700") {
            i.background = "#b9ffb6";
          }
          if (i.isshare > 0 && i.guid == 0) {
            i.background = "#F0F0F0";
          }
          if (
            i.confirmstatus == "未确认" ||
            (i.confirmstatus == "1" &&
              this.allmaindata.groupid > 0 &&
              i.wageinout == 2)
          ) {
            i.background = "#FFF0F5";
          }
          if (this.Cshow && i.items.includes("预付")) {
            i.background = "#f2f2f2";
          }
          this.$set(i, "thisListHide", false);
        });

        //应收、应付结算对象LIST和服务LIST 如果此结算对象状态都为确认则页面显示勾号图标
        this.setnameStatus(this.costData);

        if (!this.isFromFob && !this.markTip) {
          this.checkModel();
        }

        //在子订单点击费用确认 跳回原订单
        if (this.allmaindata.groupid > 0 && this.childPonoCheckedAll >= 0) {
          this.handleClick({
            index: this.childPonoCheckedAll
          });
        }

        // if (this.childPonoCheckedAll == '0' && this.allmaindata.groupid > 0) {
        //    this.handleClick({
        //        index: 0
        //    })
        //  }
      });
    },

    modCost(index, item, type) {
      //核对模式费用修改
      this.modCostIndex = index;
      this.curObject = { ...item };
      this.curObject.isfree = this.curObject.isfree === "1" ? false : true;
      this.showEdit = true;
      this.wagetypeInOut = type;
    },
    modifyCost() {
      //核对模式费用修改保存

      if (
        this.wagetypeInOut == "1" &&
        ((this.allmaindata.groupid < 0 && Number(this.allmaindata.gid) < 0) ||
          (this.allmaindata.groupid > 0 && this.childData.gid < 0))
      ) {
        return this.$message.error("无委托客户无法操作");
      }

      if (
        !Number(this.curObject.price) ||
        !Number(this.curObject.num) ||
        !this.curObject.wagetype ||
        !this.curObject.items
      ) {
        return this.$message.error("请填写完整费用");
      }

      var templateData = { ...this.curObject };
      templateData.sid = this.childData.boguid || this.allmaindata.boguid;
      templateData.boguid = this.allmaindata.boguid;
      templateData.quote = 0;
      templateData.wageinout = this.wagetypeInOut;
      templateData.otherguid = this.$refs.mawbCharge.getOtherGuid(
        templateData.otherno
      );
      templateData.wagedom = templateData.id
        ? templateData.wagedom
        : this.costDom
        ? this.costDom
        : "结算";
      templateData.servicecode = this.servicecode;
      templateData.area = this.allmaindata.area;
      templateData.contact = "";
      templateData.modifyReason = "";
      templateData.confirmstatus = 1;
      templateData.isfree =
        templateData.isfree === "1" || !templateData.isfree ? "1" : "2";
      templateData.status = -1;
      templateData.wagedom = this.resetJieshuanWagedom(
        templateData,
        this.allmaindata
      );
      templateData.changerate = this.zdChangeRate;
      templateData.leastwageall = this.zdLeastWageall;
      templateData.wageall = this.zdWageAll;
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        data: templateData,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.showEdit = false;
          this.modCostIndex = -1;
          this.wagetypeInOut = "";
          this.mawbCost();
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    delCost(el, wageinout, index) {
      //核对模式删除费用
      //if([...el.target.classList].includes('disabled')) return

      this.$confirm("是否删除此费用?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            guidList:
              wageinout == "1"
                ? this.wageinSortLine[index].guid
                : this.wageoutSortLine[index].guid,
            sid: this.allmaindata.guid,
            boguid: this.allmaindata.boguid,
            area: this.allmaindata.area
          };
          this.$axios({
            method: "DELETE",
            url: this.$store.state.webApi + "api/ExHpoAxplineWage",
            data: data,
            loading: false,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success("删除成功");
              // 删除费用中相同guid的费用
              //应收付、选择费用guid
              this.mawbCost();
              // this.costData=this.costData.filter(i=>i.guid!=this.wageinSortLine[index]['guid'])
              // if(wageinout=='1'){
              //   this.wageinSortLine.splice(index,1)
              // }else{
              //   this.wageoutSortLine.splice(index,1)
              // }
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //子表格传过来的费用删除和修改
    handleCost(data) {
      if (data.method == "DELETE") {
        this.costData = this.costData.filter(i => !data.list.includes(i.guid));
      } else if (data.method == "PUT") {
        Object.keys(data.templateData).forEach(i => {
          if (i != ("id" || "guid")) {
            this.costData.filter(i => i.id == data.templateData["id"])[0][i] =
              data.templateData[i];
          }
        });
      }

      this.setnameStatus(this.costData);
      if (data.wageinout == "1") {
        this.$refs.mawbCharge.wageguid = [];
      } else {
        this.$refs.mawbPayment.wageguid = [];
      }
      //
    },
    setnameStatus(data) {
      this.serviceSelect.forEach(i => {
        i.numYs = 0;
        i.numYf = 0;
      });
      //1.没有结算对象则push 2.有结算对象则判断是否有此gid
      data.forEach(i => {
        if (i.wageinout == "1" && i.yssys != "2" && !i.thisListHide) {
          let list = this.yssettname.filter(item => item.gid == i.gid);
          if (!list.length) {
            //没有应收结算对象则push进去
            this.yssettname.push({
              settname: $.trim(i.settname),
              gid: i.gid,
              status: this.confirmstatusF(1, i.gid)
            });
          } else {
            list[0]["status"] = this.confirmstatusF(1, i.gid);
          }
        } else if (i.wageinout == "2" && i.yssys != "2" && !i.thisListHide) {
          let list = this.yfsettname.filter(item => item.gid == i.gid);
          if (!list.length) {
            this.yfsettname.push({
              settname: $.trim(i.settname),
              gid: i.gid,
              status: this.confirmstatusF(2, i.gid)
            });
          } else {
            list[0]["status"] = this.confirmstatusF(2, i.gid);
          }
        }

        this.serviceSelect.forEach(i2 => {
          if (
            i2.servicecode == i.servicecode &&
            i.wageinout == "1" &&
            !i.thisListHide
          ) {
            i2.numYs += 1;
          } else if (
            i2.servicecode == i.servicecode &&
            i.wageinout == "2" &&
            !i.thisListHide
          ) {
            i2.numYf += 1;
          }
        });
      });
    },
    //获取建议费用
    getSuggestWageData() {
      // if (!this.zfstdin) {
      //   return this.$message.error('请选择建议费用标准')
      // }

      let params = {
        boguid: this.boguid
        // zfstdin: this.zfstdin
      };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/GetBoBaseWageAuto",
        params,
        loading: true,
        tip: false
      }).then(({ data }) => {
        if (this.costDom) {
          data = data.filter(item => {
            return item.wagedom === this.costDom;
          });
        }

        // 应付有且应收没有的费用，加入到应付带应收建议费用
        let mawbChargeItems = this.costData
          .filter(i => i.wageinout == "1" && i.yssys != "2")
          .map(i => {
            return i.items;
          });

        for (let wage of this.costData.filter(
          i => i.wageinout == "2" && i.yssys != "2"
        )) {
          //应收结算对象是临时客户，不显示建议费用
          if (
            !mawbChargeItems.includes(wage.items) &&
            this.allmaindata.wtkhname != "临时客户"
          ) {
            let temp = {
              ...wage
            };
            // delete temp.isbill
            // delete temp.confirmstatus
            // delete temp.addman
            // delete temp.adddate
            // delete temp.otherno
            temp.id = 0;
            temp.guid = "0";
            temp.sid = temp.sid || null;
            temp.isshare = "-1";
            temp.profitmode = "";
            temp.gid = this.allmaindata.gid;
            temp.settname = this.allmaindata.wtkhname;
            temp.settcode = null;
            temp.wageinout = 1;
            temp.std = "应付带应收";
            //temp.isfree = temp.isfree === '否' ? 1 : 2
            data.push(temp);
          }
        }
        console.log(data);

        this.suggestWageListAll = data.map((item, index) => {
          item.issuggest = true;
          item.suggestindex = index;
          item.background = "#87dfff";
          //item.isfree = item.isfree === 1 ? '否' : '是'
          item.gid = Number(item.gid);
          item.num = Number(item.num).toFixed(2);
          item.price = Number(item.price).toFixed(2);
          item.wageall = Number(item.wageall).toFixed(2);
          item.leastwageall = Number(item.leastwageall).toFixed(2);
          item.changerate = Number(item.changerate).toFixed(4);
          return item;
        });
        console.log(this.suggestWageListAll);
      });
    },

    //合并子订单LIST
    childrenDetail() {
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: {
          groupid: this.boguid
        },
        loading: true,
        tip: false
      })
        .then(results => {
          results.data.forEach(i => {
            this.childrenList.push(i);
          });
          this.childrenList.forEach(i => {
            i.wtxmname = getWtxmname(i.gid, 1);
          });
        })
        .catch(error => {});
    },
    handleClick(data) {
      //切换订单
      //console.log(data,232332)
      this.childPonoCheckedAll = data.index;

      //console.log(this.$refs.mawbCharge)
      this.yssettname = [];
      this.yfsettname = [];
      this.wageinSortLine = [];
      this.wageoutSortLine = [];
      this.toolTip = [];

      if (Number(this.childPonoChecked) >= 0) {
        this.costData.forEach(i => {
          if (i.sid != this.childrenList[this.childPonoChecked]["boguid"]) {
            i.thisListHide = true;
          } else {
            i.thisListHide = false;
          }
        });
      } else {
        this.costData.forEach(i => {
          if (i.wageinout == 2 && i.isshare == "1" && i.guid == "0") {
            i.thisListHide = true;
          } else {
            i.thisListHide = false;
          }
        });
      }

      if (this.$refs.mawbCharge) {
        this.$refs.mawbCharge.activeSettname = "";
      }
      if (this.$refs.mawbPayment) {
        this.$refs.mawbPayment.activeSettname = "";
      }

      this.setnameStatus(this.costData);
      this.childData =
        this.childPonoChecked >= 0
          ? this.childrenList[this.childPonoChecked]
          : {};

      if (this.childPonoChecked > 0 && !this.isFromFob && !this.markTip) {
        this.checkModel();
      }
    },
    //应付带应收按钮
    wageOutCarryIn() {
      this.$axios({
        method: "POST",
        url: this.$store.state.webApi + "api/ExBoBaseCopyWage",
        data: {
          boguid:
            this.allmaindata.groupid < 0 ? this.boguid : this.childData.boguid,
          wagedom: this.costDom || ""
        },
        loading: false,
        tip: false,
        noarea: "1"
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.mawbCost();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },

    //各结算对象确认状态
    confirmstatusF(wageinout, gid) {
      //合并订单取子订单boguid==费用sid
      var list = this.costData
        .filter(
          i =>
            i.wageinout == wageinout &&
            i.yssys != "2" &&
            i.gid == gid &&
            (this.allmaindata.groupid < 0 ||
              (this.allmaindata.groupid > 0 && i.sid == this.childData.boguid))
        )
        .every(i => i.confirmstatus >= 700);
      return list;
    },

    //核对模式
    checkModel() {
      let wageoutItemsArr = this.costData
          .filter(i => i.wageinout == "2" && i.yssys != "2" && !i.thisListHide)
          .map(i => i.items),
        wageinListCopy = this.costData
          .filter(i => i.wageinout == "1" && i.yssys != "2" && !i.thisListHide)
          .slice(),
        wageoutListCopy = this.costData
          .filter(i => i.wageinout == "2" && i.yssys != "2" && !i.thisListHide)
          .slice();

      wageoutItemsArr.forEach((items, outIndex) => {
        let inIndex;
        for (let i in wageinListCopy) {
          if (wageinListCopy[i] && wageinListCopy[i].items == items) {
            inIndex = i;
            // 如果存在多条相同服务项目的费用   优先匹配币种相同的那条
            if (
              wageinListCopy[i].currency == wageoutListCopy[outIndex].currency
            ) {
              break;
            }
          }
        }
        if (!inIndex) {
          let outItem = wageoutListCopy.splice(outIndex, 1, null)[0];

          this.wageinSortLine.push({});
          this.wageoutSortLine.push(outItem);
          this.toolTip.push(outItem.isfree == 1 ? -outItem.wageall : "");
          return;
        }

        let inItem = wageinListCopy.splice(inIndex, 1, null)[0];
        let outItem = wageoutListCopy.splice(outIndex, 1, null)[0];

        this.wageinSortLine.push(inItem);
        this.wageoutSortLine.push(outItem);
        let money = 0;
        if (inItem.isfree == 1) {
          money += inItem.wageall;
        }
        if (outItem.isfree == 1) {
          money -= outItem.wageall;
        }

        this.toolTip.push(money.toFixed(2));
      });

      // 添加剩余未匹配的费用
      for (let item of wageinListCopy) {
        if (item) {
          this.wageinSortLine.push(item);
          this.wageoutSortLine.push({});
          this.toolTip.push(item.isfree == 1 ? item.wageall : "");
        }
      }
    },
    //左右表格滚动
    onScroll: function(e, position) {
      this.position = position;

      if ($(".tableWrap").length > 0) {
        $(".tableWrap").scrollLeft(position.scrollLeft);
      }
    },

    //应收付确认方法 总确认
    confirmButton(type, status) {
      //应收付   状态
      if (
        (type == "1" &&
          Number(this.childrenList[this.childPonoChecked].gid) < 0 &&
          this.childPonoChecked > 0 &&
          this.allmaindata.groupid > 0) ||
        (this.allmaindata.groupid < 0 && Number(this.allmaindata.gid) < 0)
      ) {
        this.$message.error("无委托客户无法操作");
        return false;
      }
      var data = {
        boguid: this.boguid,
        wageinout: type,
        status: status,
        area: this.allmaindata["area"],
        isFromFob: this.isFromFob ? this.isFromFob : "",
        guidList:
          !this.costDom && status == "1"
            ? ""
            : type == "1"
            ? this.$refs.mawbCharge.wageguid.join(",")
            : this.$refs.mawbPayment.wageguid.join(","),
        isyssys: "2",
        old_sendhpoid: this.allmaindata.old_sendhpoid || "",
        wagedom: this.costDom ? this.costDom : "结算",
        sid: this.childData.boguid || this.allmaindata.boguid
      };
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxplineWageConfirm",
        data: data,
        loading: true
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage || "更新成功");
          if (status == "700") {
            // 确认操作 费用都确认
            if (this.profitmode.indexOf("利润") == -1) {
              this.costData.forEach(item => {
                if (item.wageinout == type) {
                  if (this.allmaindata.groupid < 0) {
                    item.confirmstatus = status;
                  } else {
                    if (item.sid == this.childData.boguid) {
                      item.confirmstatus = status;
                    }
                  }
                }
              });
            } else {
              this.mawbCost();
            }
          } else {
            //取消确认操作
            this.costData.forEach(item => {
              if (
                item.wageinout == type &&
                item.yssys == "2" &&
                (this.allmaindata.groupid < 0 ||
                  (this.allmaindata.groupid > 0 &&
                    item.sid == this.childData.boguid))
              ) {
                item.confirmstatus = status;
              }
            });
          }
          this.allmaindata.wageconfirmstatus =
            results.data.resultdic.wageconfirmstatus;
          this.checkModel();
          this.$emit("success", results.data.resultdic.wageconfirmstatus);
          //恢复初始值
          if (type == "1") {
            this.$refs.mawbCharge.wageguid = [];
            this.$refs.mawbCharge.activeSettname = "";
          } else {
            this.$refs.mawbPayment.wageguid = [];
            this.$refs.mawbPayment.activeSettname = "";
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    //应收账单打印
    showAccountShow() {
      this.showAccount = true;
      this.orderInformation.info = this.allmaindata;
      this.orderInformation.costInfo = [];
      this.costData.forEach(item => {
        if (
          item.isfree == "1" &&
          item.gid == this.allmaindata.gid &&
          item.wageinout == "1" &&
          item.yssys != "2"
        ) {
          this.orderInformation.costInfo.push(item);
        }
      });
    },
    airLineOpen() {
      var object = {
        boguid: this.allmaindata.boguid,
        activeTab: "应收",
        active: "航线",
        title: "航线综合查询",
        show: true
      };
      this.$store.commit("searchData", object);
    },
    //审核、取消审核方法
    checkFun(status) {
      var obb = [
        {
          accountname: "",
          reasontype: "海外D/N驳回",
          delbillreason: this.overseasaccreason,
          delbillman: localStorage.getItem("usrname"),
          delbilldate: getMomentDate(),
          delbillreasonJson: [],
          area: this.area
        }
      ];
      var data = {
        guid: this.boguid,
        area: this.area,
        overseasacc: status,
        overseasaccreason: status == "20" ? JSON.stringify(obb) : ""
      };

      console.log(data);
      this.$axios({
        method: "PUT",
        url: this.$store.state.webApi + "api/UpdateAxplineOverseasAcc",
        data: data,
        loading: true,
        tip: false,
        noarea: "1"
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.reason = false;
            this.$emit("unvisible");
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },
    openCancelDialog() {
      //打开原因弹窗
      this.cancelVisible = true;
      let row = this.allmaindata;
      if (
        row.examineremark ||
        row.cancelreason ||
        row.routedelreason ||
        row.tgreason
      ) {
        this.canceltype = 4;
      }
      if (row.customreason) {
        this.canceltype = 5;
      }
      if (row.delbillreason || row.overseasaccreason || row.wagecommitreason) {
        this.canceltype = 6;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.costDetail {
  .wage-backgroundcolor-tip {
    float: right;
    display: flex;

    .tip-item {
      display: flex;
      align-items: center;
      margin-left: 10px;

      i {
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 3px;
      }
    }
  }

  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;

    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c; //background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;

      /deep/.el-switch__label {
        color: #009900;
      }

      /deep/.el-switch__label.is-active {
        color: #ff4949;
      }
    }

    .detail-c {
      padding: 20px;

      .setnameTotal {
        margin-top: 8px;
        margin-bottom: 8px;

        .left {
          float: left;

          .leftTitle {
            color: #00cc00;
            font-weight: bold;
            margin-right: 30px;
          }
        }

        .right {
          float: right;
          margin-bottom: 8px;
          position: relative;
          z-index: 99;
        }
      }
    }

    .upIcon {
      vertical-align: middle;
      background: url("../../../boStatic/images/upIcon.png") no-repeat;
      display: inline-block;
      height: 12px;
      width: 12px;
      margin-right: 5px;
    }

    .wageButton {
      height: 32px;
      letter-spacing: 0.1em;
      font-weight: bold;
      border-radius: 3px;
    }
  }

  .mawbInformation,
  .hawbInformation {
    .el-row {
      margin-bottom: 8px;

      .label {
        display: inline-block;
        width: 130px;
        text-align: right;
        margin-right: 10px;
      }

      .value {
        color: #009900;
      }

      .color-red {
        color: red;
      }
    }
  }

  .footer {
    margin-top: 20px;

    .el-row {
      margin: 20px 0;
    }

    .btn-c {
      overflow: hidden;

      .left-btn {
        float: left;
      }

      .right-btn {
        float: right;
      }
    }
  }

  .pagetype1 {
    margin-bottom: 15px;
  }
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

.detailPaneRed {
  .test(red);
}

.detailPaneYoung {
  .test(#00cc00);
}

.showpanediv > div {
  span:nth-child(1) {
    display: inline-block;
    min-width: 100px;
    text-align: right;
  }

  span:last-child {
    display: inline-block; // width: 250px;
    width: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.detailCost2 {
  //height:500px;
  &:after {
    content: "";
    clear: both;
    display: block;
  }

  .lineYinFu {
    float: left;
    width: 545px;
    height: 100%;
    margin-right: 10px;

    .detail-title {
      height: 30px;
      line-height: 30px;

      p {
        text-align: center;
        width: 110px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 24px solid transparent;
        color: #fff;
        border-bottom-color: red;
        font-weight: bold;
        margin-top: -6px;
      }
    }

    .tableContent {
      padding: 15px 0;
      border: 1px solid red;

      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;

        i {
          cursor: pointer;
        }

        /deep/.disabled {
          cursor: not-allowed !important;
          pointer-events: none;
        }
      }
    }
  }

  .lineYinShou {
    float: left;
    width: 545px;
    height: 100%;
    margin-right: 10px;

    .detail-title {
      height: 30px;
      line-height: 30px;

      p {
        text-align: center;
        width: 110px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 24px solid transparent;
        color: #fff;
        border-bottom-color: #00cc00;
        font-weight: bold;
        margin-top: -6px;
      }
    }

    .tableContent {
      padding: 15px 0;
      border: 1px solid #00cc00;

      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;

        i {
          // .disabled{
          //  cursor:not-allowed!important;
          //  pointer-events: none!important;
          // }
          cursor: pointer;
        }

        /deep/.disabled {
          cursor: not-allowed !important;
          pointer-events: none;
        }
      }
    }
  }

  .lineAllin {
    float: left;
    width: 190px;
    height: 100%;

    .detail-title {
      height: 30px;
      line-height: 30px;

      p {
        text-align: center;
        width: 110px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 24px solid transparent;
        color: #fff;
        border-bottom-color: orange;
        font-weight: bold;
        margin-top: -6px;
      }
    }

    .tableContent {
      padding: 15px 0;
      border: 1px solid orange;

      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.arrow {
  i {
    &:hover {
      color: #0f5a8c;
    }
  }
}

.wrapSetname {
  div {
    span {
      display: inline-block; //margin-right:40px;
      color: #999;
      height: 24px;
      line-height: 24px;
      padding-left: 12px;
      margin-top: 6px;
      margin-right: 12px;
      padding-right: 12px;

      &:hover {
        color: #0f5a8c;
      }
    }
  }
}

/deep/.serviceSelect {
  .title {
    margin-right: 12px;
    display: inline-block;
    width: 5%;
    vertical-align: top;
    padding-top: 2px;
  }

  .arrow {
    width: 2%;
    display: inline-block;
    vertical-align: top;
    font-size: 18px;
    color: #e8e8e8;
  }

  .setnameAllset,
  .setnameAllsetf,
  .setnameAllser,
  .setnameAllserf {
    .serviceItem {
      background: #f8f8f8 !important;
      border-radius: 15px;
      border: 1px solid #e8e8e8;

      .costNum {
        color: #fff;
        background: #0f5a8c;
        display: inline-block;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border-radius: 16px;
        font-size: 12px;
        margin-left: 8px;
      }
    }
  }

  .serviceItemActive {
    background: #0f5a8c;
    color: #fff;
    margin-bottom: 8px;
    border-radius: 15px;

    .costNum {
      color: #0f5a8c;
      background: #fff;
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 16px;
      font-size: 12px;
      margin-left: 8px;
    }
  }

  .activeset {
    background: #0f5a8c !important;
    color: #fff !important;
    border-radius: 32px;
  }

  .activesetUc {
    color: #0f5a8c !important;
  }
}

.cancelWageIcon {
  vertical-align: middle;
  background: url("../../../boStatic/images/chahao.png") no-repeat;
  display: inline-block;
  width: 14px;
  height: 14px;
}

.add-wage-icon {
  vertical-align: middle;
  background: url("../../../boStatic/images/duigou.png") no-repeat;
  display: inline-block;
  width: 14px;
  height: 14px;
}
</style>
