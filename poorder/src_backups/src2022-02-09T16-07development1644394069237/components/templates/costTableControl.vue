<template>
  <div>
    <!-- 服务、结算对象组合 -->
    <costHead
      :serviceList="serviceList"
      :setnameList="setnameList"
      :wageinout="wageinout"
      :activeSettname.sync="activeSettname"
      ref="costHead"
    ></costHead>
    <!-- 各结算对象总费用   及后续按钮 -->
    <div class="setnameTotal">
      <div class="left">
        <span class="leftTitle" style="color:#00cc00" v-if="wageinout == 1"
          >确认总应收:</span
        >
        <span class="leftTitle" style="color:red" v-if="wageinout == 2"
          >确认总应付:</span
        >
        <span
          :style="{
            color: wageinout == 1 ? '#00CC00' : 'red',
            'margin-left': index > 0 ? '15px' : '',
            'font-weight': 'bold'
          }"
          v-for="(item, index) in currentGidCost"
          :key="item.money"
        >
          <span style="margin-right:8px;">{{ item.currencyFh }}</span>
          <span :title="item.currency">{{
            Number(item.money).toFixed(2)
          }}</span>
        </span>
      </div>
      <div class="right">
        <el-button
          type="primary"
          @click="addSuggestWageBatch(wageinout)"
          v-if="checkedWageSuggestindex.length > 0"
          >带入建议费用</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="showRecon = true"
          style="height:28px;line-height:13px;"
          v-if="
            !isFromFob &&
              (!costDom ||
                (costDom && allmaindata.area != conditionalAreaForBuild)) &&
              showDuizhang &&
              wageinout == 1
          "
          >对账
        </el-button>
      </div>
    </div>
    <!-- 费用表格 -->
    <commonTable
      class="commonTable"
      :head="mawb_table_model"
      style="position:relative;"
      :tableIndex="0"
      :table-data="costAll"
      :className="modCostIndex"
      :wagetype="1"
      :putIndex="modCostIndex"
    >
      <!-- (1)合并订单主订单不显示这一行，主订单应付能显示(2)外地综合查询能显示(3)上海要有costDom或者国内服务订单【costDom:客服】 -->

      <template
        slot="firstTd"
        slot-scope="props"
        v-if="
          (allmaindata.groupid > 0 &&
            (childPonoChecked > 0 ||
              (childPonoChecked == 0 && wageinout == 2))) ||
            (allmaindata.groupid < 0 && pagetype == 1) ||
            (pagetype != 1 &&
              (costDom ||
                (!costDom && allmaindata.area != conditionalAreaForBuild)))
        "
      >
        <td style="text-align:left;padding-left:8px;">
          <!-- 单条修改无法点击 -->
          <i v-if="!Cshow">
            <el-checkbox
              title="全选"
              :disabled="modCostIndex != '-1'"
              v-model="wageCostAll"
            ></el-checkbox>
          </i>
          <!-- C类客户无限制 -->
          <i v-if="Cshow">
            <el-checkbox title="全选" v-model="wageguidsCtype"></el-checkbox>
          </i>

          <!-- 费用新增只在C类中显示 -->
          <i
            class="add-wage-icon"
            v-if="Cshow"
            title="费用新增'"
            :icondisabled="disabledAdd(wageinout)"
            @click="addConfirmWage($event, wageinout, 1)"
          ></i>
          <!-- 新增确认  1.非C类 2.非修改 3.非上海结算费用 4.无多选勾选费用   -->
          <i
            class="add-wage-icon"
            v-if="
              !wageguid.length && modCostIndex == '-1' && !Cshow && !isshwage
            "
            title=" 新增确认"
            :class="{ disabled: disabledAdd(wageinout) }"
            @click="addConfirmWage($event, wageinout, 700)"
          ></i>

          <!-- 确认保存 1.非C类 2.费用修改时-->
          <i
            class="add-wage-icon"
            v-if="modCostIndex != '-1' && !Cshow"
            title="确认保存"
            @click="addConfirmWage($event, wageinout, 700)"
            :class="{ disabled: disabledAdd(wageinout) }"
          ></i>

          <!-- 费用确认 1.非C类 2.勾选费用数量大于2条 3.勾选的费用为未确认 -->
          <!-- 利润分配无法点击 -->

          <i
            class="add-wage-icon"
            v-if="
              wageguid.length > 1 && costData.length && costConfirm && !Cshow
            "
            title="费用确认"
            :class="{ disabled: disabledAdd(wageinout) }"
            @click="costConfirmPl($event, wageinout, 700)"
          ></i>

          <!-- 取消操作 未勾选费用时 -->
          <i
            class="cancelWageIcon"
            v-if="!wageguid.length"
            title="取消修改"
            @click="delCurCost"
          ></i>

          <!-- 取消确认 有勾选费用且勾选费用为已确认
                        :disabled 应收利润分配模式操作站
                      -->
          <i
            class="cancelWageIcon"
            v-if="
              wageguid.length && wageguid.length > 1 && !costConfirm && !Cshow
            "
            title="取消确认"
            @click="costConfirmPl($event, wageinout, 1)"
            :class="{
              disabled:
                allmaindata.orderguid > 0 &&
                profitmode.indexOf('利润') != -1 &&
                wageinout == 1
            }"
          ></i>

          <!-- 删除费用 勾选费用大于2条时显示-->
          <i
            class="el-icon-delete"
            title="删除费用"
            v-if="wageguid.length > 1"
            @click="delCost(-1, $event, wageinout)"
          ></i>

          <!-- 批量驳回  1.发起方 2.唯凯项目 3.是否存在驳回勾选费用-->
          <i
            class="el-icon-shenhebohui"
            title="批量驳回"
            v-if="projectIsWecan && BohuiChecked.length && isSponsor"
            @click="getBohuiWageDetail(BohuiChecked, 2)"
          ></i>
          <!-- 新增驳回 1.未勾选费用 2.唯凯项目 3.上海结算或者符合外站条件bohuiOperUsed-->
          <i
            class="el-icon-addbohui"
            title="新增并驳回"
            :icondisabled="disabledAdd(wageinout, 'back')"
            v-if="
              projectIsWecan &&
                (isshwage || bohuiOperUsed(wageinout)) &&
                !wageguid.length
            "
            @click="addConfirmWage($event, wageinout, 700, 1)"
          ></i>
        </td>
        <td v-if="!Cshow">
          <input type="checkbox" v-model="curentObject.isfree" />
        </td>
        <td>
          --
        </td>
        <td>
          --
        </td>
        <td style="display:inline-flex;border:none;width:100%;">
          <page-select
            :modelval.sync="curentObject.gid"
            :pagetype="wageinout == '1' ? 2 : 3"
            :area="allmaindata.area"
            v-if="allmaindata.area"
            :wtxmname="wageinout == '1' ? allmaindata.wtxmname : ''"
            :fid="wageinout == '1' ? allmaindata.fid : ''"
            :ifRefreshData.sync="ifRefreshData"
            @change="getSettname"
            :disabled="curentObject.disabled"
          >
            <template slot="other" v-if="wageinout=='1'">
              <jsdxwh
                :fid="allmaindata.fid"
                :area="allmaindata.area"
                @success="ifRefreshData = !ifRefreshData"
              ></jsdxwh>
            </template>
          </page-select>
        </td>
        <td>
          <page-select
            :modelval.sync="curentObject.items"
            :pagetype="5"
            :area="allmaindata.area"
            v-if="allmaindata.area"
            :disabled="curentObject.isallin == '1'"
            :servicecode="
              allmaindata.area == conditionalAreaForBuild
                ? conditionalAreaForBuild
                : ''
            "
            @change="getServiceData"
          ></page-select>
        </td>
        <td>
          <el-select v-model="curentObject.wagetype" style="width:130px;">
            <el-option
              v-for="(item, index) in jsfs"
              :key="index"
              :value="item.typename"
              :label="item.typename"
            ></el-option>
          </el-select>
        </td>
        <td>
          <el-input
            v-model="curentObject.num"
            style="width:100px;"
            @blur="yanzhenzzF('1', '1', 'num')"
          ></el-input>
        </td>
        <td>
          <el-input
            v-model="curentObject.price"
            style="width:100px;"
            @blur="yanzhenzzF('1', '1', 'price')"
          ></el-input>
        </td>
        <td>
          <el-select v-model="curentObject.currency" style="width:100px;">
            <el-option
              v-for="(item, index) in currencyList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
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
        <td v-if="allmaindata.pono.indexOf('BOGN') == -1">
          <el-select v-model="curentObject.otherno" style="width:150px;">
            <el-option
              v-for="(item, index) in hawbList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </td>
        <td>
          <el-input
            v-model="curentObject.remark"
            style="width:100px;"
          ></el-input>
        </td>
      </template>
      <!-- 显示条件:1.isshare<0,费用guid不为0  2.只有合并子订单显示或者合并订单应付  3.综合查询上海订单进入不显示  4.国内综合查询点入显示costDom:客服-->

      <template
        slot="operate"
        slot-scope="props"
        v-if="
          ((allmaindata.groupid > 0 &&
            (childPonoChecked > 0 ||
              (childPonoChecked == 0 && wageinout == 2))) ||
            allmaindata.groupid < 0) &&
            ((!costDom && allmaindata.area != conditionalAreaForBuild) ||
              pagetype == 1 ||
              costDom) &&
            !(props.data.row.isshare > 0 && props.data.row.guid == 0)
        "
      >
        <template v-if="!props.data.row.issuggest">
          <!-- 非C类 或者C类并且不为预付航司运费和预付杂费并且不是未对账和状态为1-->
          <div
            v-if="
              !Cshow ||
                (Cshow &&
                  props.data.row.items != '预付航司运费' &&
                  props.data.row.items != '预付杂费' &&
                  !(props.data.row.isbill == 1 && props.data.row.status == -1))
            "
          >
            <!-- 非唯凯项目或者status为-1时显示选择费用、确认保存、取消和删除 -->
            <span v-if="props.data.row.status == -1 || !projectIsWecan">
              <!-- 选择费用  1.订单wageconfirmstatus>700 2.修改时无法勾选 3.勾选时只能勾选未确认或者已确认逻辑 -->
              <i v-if="!Cshow">
                <el-checkbox
                  v-model="wageguid"
                  :label="props.data.row.guid"
                  :disabled="
                    (childData.wageconfirmstatus > 700 &&
                      allmaindata.groupid > 0) ||
                      (allmaindata.groupid < 0 &&
                        allmaindata.wageconfirmstatus > 700) ||
                      props.data.row.disabled ||
                      modCostIndex != '-1'
                  "
                  title="选择费用"
                ></el-checkbox>
              </i>

              <i v-if="Cshow && wageinout == '1'">
                <el-checkbox
                  v-model="wageguidsCtype"
                  :label="props.data.row.guid"
                  title="选择费用"
                ></el-checkbox>
              </i>

              <!-- 确认、保存  无法点击:新增按钮逻辑  显示逻辑:1.此费用未确认 2.没有勾选费用或者只勾选了此条未确认费用 3.非C类 4.勾选的费用未确认-->
              <i
                class="add-wage-icon"
                :class="[disabledAdd(wageinout) ? 'disabled' : '']"
                v-if="
                  props.data.row.confirmstatus == '1' &&
                    (!wageguid.length ||
                      (wageguid.length == 1 &&
                        wageguid.indexOf(props.data.row.guid) != '-1')) &&
                    !Cshow &&
                    costConfirm
                "
                title="确认保存"
                @click="
                  if (!wageguid.includes(props.data.row.guid)) {
                    wageguid.push(props.data.row.guid);
                  }
                  costConfirmPl($event, wageinout, 700);
                "
              >
              </i>
              <!-- 取消确认  显示逻辑:1.此费用已确认 2.没有勾选费用或者只勾选了此条已确认费用 3.非C类 4.勾选的费用已确认
                           :disabled  应收利润分配操作站
                         -->
              <i
                class="cancelWageIcon"
                v-if="
                  props.data.row.confirmstatus == '700' &&
                    (!wageguid.length ||
                      (wageguid.indexOf(props.data.row.guid) != '-1' &&
                        wageguid.length == 1 &&
                        !costConfirm)) &&
                    !Cshow
                "
                title="取消确认"
                @click="
                  if (
                    allmaindata.orderguid > 0 &&
                    profitmode.indexOf('利润') != -1 &&
                    wageinout == 1
                  )
                    return;
                  if (!wageguid.includes(props.data.row.guid)) {
                    wageguid.push(props.data.row.guid);
                  }
                  costConfirmPl($event, wageinout, 1);
                "
                :class="{
                  disabled:
                    allmaindata.orderguid > 0 &&
                    profitmode.indexOf('利润') != -1 &&
                    wageinout == 1
                }"
              ></i>
              <!-- 费用修改 显示逻辑:1.未勾选此费用 2.结算页面进入并且不是上海或者非上海结算费用
                              无法点击:disabledEdit逻辑
                            -->
              <i
                class="el-icon-setting"
                v-show="!isshwage"
                :class="[
                  disabledEdit(wageinout, props.data.row) ? 'disabled' : ''
                ]"
                title="修改费用"
                v-if="
                  (!wageguid.length ||
                    wageguid.indexOf(props.data.row.guid) == '-1') &&
                    !isshwage
                "
                @click="modCost($event, props.data.index, wageinout)"
              ></i>
              <!-- 费用删除 显示逻辑:1.未勾选此费用 2.非上海结算费用
                              无法点击:showUconfirmF逻辑
                            -->
              <i
                class="el-icon-delete"
                :class="[
                  showUconfirmF(wageinout, props.data.row) ? 'disabled' : ''
                ]"
                title="删除费用"
                v-if="
                  (!wageguid.length ||
                    wageguid.indexOf(props.data.row.guid) == '-1') &&
                    !isshwage
                "
                @click="delCost(props.data.index, $event, wageinout)"
              ></i>
            </span>
            <!-- 驳回按钮  无法点击:disabledEdit逻辑
                                显示逻辑:1.唯凯项目 2.发起者isshare<0或者非发起者status不为-1,status>0必显示 3.服务项目不为利润分成 
                              -->
            <i
              class="el-icon-shenhebohui"
              :class="{
                disabled:
                  disabledEdit(wageinout, props.data.row, 'back') &&
                  props.data.row.status == -1
              }"
              v-if="
                projectIsWecan &&
                  (isSponsor
                    ? props.data.row.isshare < 0 || props.data.row.status > 0
                    : props.data.row.status != -1) &&
                  !BohuiChecked.length &&
                  props.data.row.items != '利润分成'
              "
              :style="setBhiconColor(props.data.row.status)"
              :title="setBhiconColor(props.data.row.status, 2)"
              @click="
                if (evDisabled($event)) return;
                getBohuiWageDetail(props.data.row);
              "
            ></i>
          </div>

          <!-- C类带出的预付费用无法操作 -->
          <div
            v-if="
              Cshow &&
                (props.data.row.items == '预付航司运费' ||
                  props.data.row.items == '预付杂费') &&
                wageinout == '1'
            "
            style="text-align:left"
          >
            <i v-if="props.data.row.items == '预付航司运费'">
              <el-checkbox disabled v-model="wageguidsCtypeYf"></el-checkbox>
            </i>
            <i v-if="props.data.row.items == '预付杂费'">
              <el-checkbox disabled v-model="wageguidsCtypeZf"></el-checkbox>
            </i>
          </div>
        </template>
        <!-- 建议费用 -->

        <template v-else-if="props.data.row.issuggest">
          <i>
            <el-checkbox
              :disabled="$parent.kfWageinAllConfirm"
              v-model="checkedWageSuggestindex"
              :label="props.data.row.suggestindex"
            ></el-checkbox>
          </i>
          <i
            class="add-wage-icon"
            @click="
              addSuggestWage(wageinout, props.data.row.suggestindex, '700')
            "
            title="带入建议费用并确认"
          ></i>
          <i
            @click="addSuggestWage(wageinout, props.data.row.suggestindex)"
            :class="['el-icon-top', { disabled: $parent.kfWageinAllConfirm }]"
            title="带入建议费用"
          ></i>
        </template>
      </template>
      <template slot="confirmBill" slot-scope="props">
        <span v-if="props.data.row.issuggest">{{ props.data.row.std }}</span>
      </template>
      <template slot="otherno" slot-scope="props">
        <span v-if="props.data.row.issuggest">{{
          props.data.row.servicename
        }}</span>
        <span v-else>{{ props.data.value }}</span>
      </template>
    </commonTable>
    <!-- 联系人弹框 -->
    <el-dialog
      width="500px"
      top="4%"
      center
      :visible.sync="showContact"
      @close="
        showContact = false;
        modCostIndex = -1;
      "
      :close-on-click-modal="false"
      v-if="showContact"
      append-to-body
    >
      <h3
        style="font-size:16px;color:#004d84;margin-bottom:20px;margin-top:-10px;"
      >
        <span v-if="methods == 'PUT'">修改申请人</span>
        <span v-else-if="methods == 'POST'">新增申请人</span>
        <span v-else="methods == 'DELETE'">删除申请人</span>
      </h3>
      <!-- <accountMake :orderInformation="orderInformation" :wageinout="1" :system="system" :area="area" :isFromFob="isFromFob" :guid="boguid"></accountMake>
    -->
      <page-select
        :modelval.sync="contact"
        :pagetype="9"
        :area="allmaindata.area"
      ></page-select>
      <el-input
        type="textarea"
        v-model="modifyReason"
        class="input-required"
        :autosize="{ minRows: 4 }"
        style="margin-top:12px;color:#c8c8c8"
        :placeholder="
          methods == 'PUT'
            ? '修改理由'
            : methods == 'POST'
            ? '新增理由'
            : '删除理由'
        "
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
        style="float:right;margin-top:-20px;"
      >
        <el-button
          @click="
            showContact = false;
            modCostIndex = -1;
            delCurCost(wageinout, '1');
          "
          >取 消</el-button
        >
        <el-button @click="modCost2">确 定</el-button>
      </span>
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
        :jobid="$parent.childrenList[$parent.childPonoChecked].boguid"
        :wageinout="wageinout"
        system="空出"
        v-if="showRecon"
        @unVisible="showRecon = false"
        :area="allmaindata.area"
        :selectgid="activeSettname"
      ></reconMngDetail>
    </el-dialog>
    <!-- 驳回弹框 -->
    <el-dialog
      :visible.sync="bohuiVisible"
      width="1360px"
      :title="
        `驳回详情(${
          wageBohuiData[0] && wageBohuiData[0].wagecommitlist[0].wageinout == 1
            ? '应收'
            : '应付'
        })`
      "
      top="4%"
      v-if="bohuiVisible"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      center
      @close="closeBohuiDialog"
    >
      <div style="min-height:400px" v-if="allmaindata.guid">
        <infoList
          :inputModelData="allmaindata"
          v-if="allmaindata.guid"
          name="详细"
          :costBiaozhu="false"
          :ifopendetail="false"
          :showBtnGroup="false"
        >
        </infoList>
        <div>
          <el-tabs
            class="tabsTile"
            :value="String(childBohuiChecked)"
            @tab-click="handleClickBohui"
            style="margin-bottom:10px;"
          >
            <el-tab-pane
              :label="item.items"
              v-for="(item, index) in wageBohuiData"
              :key="index"
            >
              <span
                slot="label"
                :class="{ checked: childBohuiChecked == index }"
                :style="
                  spanstyle(
                    item.status == -1
                      ? 'black'
                      : item.status == 500
                      ? 'green'
                      : item.receiver == initiator
                      ? 'red'
                      : 'green',
                    childBohuiChecked == index
                  )
                "
                >{{ item.items }}</span
              >
            </el-tab-pane>
          </el-tabs>
        </div>
        <template v-for="(item, index) in wageBohuiData">
          <myCommonTable
            v-show="childBohuiChecked == index"
            :ifNeedFrashWage.sync="$parent.ifNeedFrashWage"
            ref="myCommonTable"
            :ifPiliangBohui="
              isSponsor &&
                wageBohuiData.length > 1 &&
                wageBohuiData.filter(i => i.status == -1).length ==
                  wageBohuiData.length
            "
            v-if="
              childBohuiCheckedList.includes(index) ||
                (isSponsor &&
                  wageBohuiData.length > 1 &&
                  wageBohuiData.filter(i => i.status == -1).length ==
                    wageBohuiData.length)
            "
            :mawbinfo="allmaindata"
            :wageBohuiData.sync="wageBohuiData[index]"
            :key="index"
            :initiator="initiator"
            :isFromFob="isFromFob"
          ></myCommonTable>
        </template>

        <div
          v-if="
            isSponsor &&
              wageBohuiData.length > 1 &&
              wageBohuiData.filter(i => i.status == -1).length ==
                wageBohuiData.length
          "
        >
          <h4 style="margin:15px 0">驳回理由</h4>
          <el-input
            type="textarea"
            v-model="rollbackreason"
            rows="4"
            placeholder="请输入你的驳回理由"
          ></el-input>
          <div style="text-align:right;margin:20px 0">
            <el-button type="primary" @click="piliangWagebohui"
              >批量确认驳回</el-button
            >
            <el-button @click="bohuiVisible = false">返回</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 费用表格头组件
let costHead = {
  template: `
  <div>
   <div class="serviceSelect" style="margin-top:8px;">
    <span class="title">服务名称:</span>
    <div class="arrow">
      <i class="el-icon-caret-left" style="margin-right:-8px;"
      @click="changeDirectionAcnO(1,wageinout,'service')"></i>
    </div>

    <div style="width:88%;overflow:hidden;display:inline-block;margin-top:-6px;">
      <div style="width:10000px" :class="[wageinout=='1'?'setnameAllser':'setnameAllserf']">
        <span v-for="(i,index) in serviceList"
        style="display:inline-block;padding:4px 8px;margin-right:8px;cursor:pointer;width:132px;text-align:center;"
        class="serviceItem"
        v-if="Number(i.bindeguid)<0">
        {{i.typename}}
        <span class="costNum" v-if="i.numYs>0&&wageinout==1">{{i.numYs}}</span>
        <span class="costNum" v-if="i.numYf>0&&wageinout==2">{{i.numYf}}</span>
      </span>
    </div>
  </div>
  <div class="arrow">
    <i class="el-icon-caret-right" @click="changeDirectionAcnO(2,wageinout,'service')"></i>
  </div>

</div>

<div class="serviceSelect" style="margin-top:6px;">
  <span class="title">结算对象:</span>
  <div class="arrow">
    <i class="el-icon-caret-left" style="margin-right:-8px;"
    @click="changeDirectionAcnO(1,wageinout,'setname')"></i>
  </div>
  <div style="width:88%;overflow:hidden;display:inline-block;"
  class="wrapSetname">
  <div style="width:10000px" :class="[wageinout=='1'?'setnameAllset':'setnameAllsetf']" v-if="setnameList.length">

    <span
    style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;cursor:pointer;border-radius:32px;color:#999;height:24px;display:inline-block;padding:0 12px;line-height:24px;"
    v-for="(item,index) in setnameList" @click='$emit("update:activeSettname",item.gid)'
    :class="[activeSettname==item.gid?'activeset':'']"
    :title="item.settname">
    <i class="el-icon-success" v-if="item.status"
    style="margin-right:8px;"></i>{{item.settname}}
  </span>

</div>
<div v-else class="setnameAll">
  <span
  style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#999">无{{wageinout=='1'?'应收':'应付'}}结算对象</span>
</div>
</div>
<div class="arrow">
  <i class="el-icon-caret-right" @click="changeDirectionAcnO(2,wageinout,'setname')"></i>
</div>
</div>

</div>
</div>
`,
  props: {
    serviceList: Array,
    setnameList: Array,
    wageinout: [Number, String],
    activeSettname: "" //激活的结算对象
  },
  data() {
    return {
      arrowAcnIndex: 0, //结算对象箭头 应收
      arrowAcnIndexf: 0, //结算对象箭头 应付
      arrowAcnIndexO: 0, //服务箭头 应收
      arrowAcnIndexOf: 0 //服务箭头 应付
    };
  },
  methods: {
    //左右箭头
    changeDirectionAcnO(type, wageinout, origin) {
      //type 左右箭头  wageinout应收付  origin来源
      let dom1, dom2, index1, index2;

      if (origin == "service") {
        dom1 = $(".setnameAllser");
        dom2 = $(".setnameAllserf");
        index1 = this.arrowAcnIndexO;
        index2 = this.arrowAcnIndexOf;
      } else if (origin == "setname") {
        dom1 = $(".setnameAllset");
        dom2 = $(".setnameAllsetf");
        index1 = this.arrowAcnIndex;
        index2 = this.arrowAcnIndexf;
      }

      if (wageinout == "1") {
        var clientWidth = 0;
        if (type == 1) {
          index1--;

          if (origin == "service") {
            this.arrowAcnIndexO--;
          } else {
            this.arrowAcnIndex--;
          }
          if (index1 < 0) {
            layer.msg("已至头部");
            index1 = 0;
            return false;
          }
        } else if (type == 2) {
          dom1.find("span").each(function() {
            clientWidth = clientWidth + $(this).outerWidth() + 12;
          });

          if (clientWidth < 820) {
            index1 = 0;
            return false;
          } else {
            index1++;
          }

          if (origin == "service") {
            this.arrowAcnIndexO++;
          } else {
            this.arrowAcnIndex++;
          }

          if (index1 > Math.ceil((clientWidth - 820) / 140)) {
            layer.msg("已至尾部");
            index1 = Math.ceil((clientWidth - 820) / 140);
            return false;
          }
        }
        dom1.css("transform", "translateX(-" + index1 * 152 + "px)");
      } else {
        var clientWidth = 0;
        if (type == 1) {
          index2--;

          if (origin == "service") {
            this.arrowAcnIndexOf--;
          } else {
            this.arrowAcnIndexf--;
          }

          if (index2 < 0) {
            layer.msg("已至头部");
            index2 = 0;
            return false;
          }
        } else if (type == 2) {
          dom2.find("span").each(function() {
            clientWidth = clientWidth + $(this).outerWidth() + 12;
          });
          if (clientWidth < 820) {
            index2 = 0;
            return false;
          } else {
            index2++;
          }
          if (origin == "service") {
            this.arrowAcnIndexOf++;
          } else {
            this.arrowAcnIndexf++;
          }
          if (index2 > Math.ceil((clientWidth - 820) / 140)) {
            layer.msg("已至尾部");
            index2 = Math.ceil((clientWidth - 820) / 140);
            return false;
          }
        }
        dom2.css("transform", "translateX(-" + index2 * 152 + "px)");
      }
    }
    //切换结算对象
    // handleSettname(wageinout, val) { //wageinout 应收付   val绑定结算对象值
    //   //this.activeSettname = val
    //   //this.$emit('changeSetname', { wageinout, value: val })
    // },
  }
};

import { getChangeRate, computedWeight } from "../../api/localStorage.js";

import { myCommonTable, setBhiconColorMixin } from "@/common/detailPagesMixin";

import reconMngDetail from "@/components/orderDetails/reconMngDetail";
export default {
  components: {
    costHead,
    reconMngDetail,
    myCommonTable
  },
  name: "costTableControl.vue",
  mixins: [setBhiconColorMixin],
  props: {
    wageinout: {
      type: [String, Number],
      default: 1
    }, //应收付
    costData: {
      type: Array,
      default: () => {
        return [];
      }
    }, //费用列表
    suggest: {
      type: Array,
      default: () => {
        return [];
      }
    }, //建议费用列表
    allmaindata: Object,
    orderpgid: [String, Number], //应收结算对象
    gysId: [String, Number], //应付结算对象
    serviceList: {
      //服务list
      type: Array,
      default: () => {
        return [];
      }
    },
    setnameList: {
      //结算对象list
      type: Array,
      default: () => {
        return [];
      }
    },
    isFromFob: String, //Fob1 D/N制作、Fob2 D/N审核
    showDuizhang: {
      //tzOperation 点入
      type: Boolean,
      default: true
    },
    costDom: {
      //传入的costDom
      type: String,
      default: ""
    },
    childData: Object, //合并订单子数据
    childPonoChecked: {
      //选中子订单
      type: [String, Number],
      default: 0
    },
    Cshow: {
      //是否是C类
      type: Boolean,
      default: false
    },
    profitmode: String, //分配模式
    initiator: [String, Number], //驳回发起者
    pagetype: [String, Number]
  },
  data() {
    return {
      mawb_table_model: [
        {
          field: "operate",
          title: "操作"
        },
        {
          field: "isfree",
          title: "免",
          formatType: 2,
          format: item => (item == 1 ? "否" : "是"),
          hidden: this.Cshow
        },
        { field: "confirmman", title: "确认人" },
        {
          field: "confirmBill",
          title: "状态"
        },
        {
          field: "settname",
          title: "结算对象"
        },
        {
          field: "items",
          title: "服务项目"
        },
        {
          field: "wagetype",
          title: "结算方式"
        },
        {
          field: "num",
          title: "数量"
        },
        {
          field: "price",
          title: "单价",
          formatType: 2,
          format: item => Number(item).toFixed(2)
        },
        {
          field: "currency",
          title: "币种"
        },
        {
          field: "leastwageall",
          title: "金额",
          formatType: 2,
          format: item => Number(item).toFixed(2)
        },
        {
          field: "wageall",
          title: "RMB金额",
          formatType: 2,
          format: item => Number(item).toFixed(2)
        },
        {
          field: "changerate",
          title: "汇率",
          formatType: 2,
          format: item => Number(item).toFixed(4)
        },
        {
          field: "otherno",
          title: "分运单号",
          hidden: false
        },
        {
          field: "remark",
          title: "备注"
        }
      ],
      curentObject: {
        num: "",
        price: "",
        currency: "人民币",
        otherno: "--",
        gid: ""
      },
      activeSettname: "", //选中的结算对象

      currencyFuHao: {
        人民币: "￥:",
        港币: "HK$:",
        美元: "$:",
        欧元: "€:",
        日元: "¥:",
        英镑: "￡:"
      },
      serviceSelectCode: "", //code
      ifRefreshData: false, //刷新结算对象数据
      hawbList: [], //分单List
      jsfs: [], //结算方式
      currencyList: [], //货币
      showContact: false,
      modCostIndex: -1, //费用index
      showRecon: false, //对账弹框
      wageguid: [], //勾选费用guid
      checkedWageSuggestindex: [], //勾选建议费用
      wageguidsCtypeYf: true, //C类预付运费
      wageguidsCtypeZf: true, //C类预付杂费
      wageguidsCtype: [], //C类勾选
      contact: "", //联系人
      modifyReason: "", //理由
      childBohuiChecked: 0,
      wageBohuiData: [], //驳回的数据
      childBohuiCheckedList: [0],
      bohuiVisible: false,
      rollbackreason: "" //驳回理由
    };
  },

  methods: {
    // 禁止点击
    evDisabled(el) {
      return [...el.target.classList].includes("disabled");
    },
    // 验证
    yanzhenzzF(type, dom, field) {
      if (field == "num") {
        if (this.curentObject.wagetype == "票") {
          var reg = /^[1-9]\d*$/;
          if (this.curentObject.num && !reg.test(this.curentObject.num)) {
            this.$message({
              message: "请输入整数",
              type: "error",
              duration: 1000
            });
            this.curentObject.num = "";
          }
        } else {
          var reg = /^[0-9]+.?[0-9]{0,2}?$/;
          if (this.curentObject.num && !reg.test(this.curentObject.num)) {
            this.$message({
              message: "请输入整数或者2位小数",
              type: "error",
              duration: 1000
            });
            this.curentObject.num = "";
          }
        }
      } else if (field == "price") {
        var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/;
        if (this.curentObject.price && !reg.test(this.curentObject.price)) {
          this.$message({
            message: "请输入整数或者2位小数",
            type: "error",
            duration: 1000
          });
          this.curentObject.price = "";
        }
      }
    },
    getServiceData(data) {
      this.serviceSelectCode = data.servicecode;
    },
    getSettname(data) {
      this.curentObject.settname = data.usr_name;
    },
    //获取选中分单guid
    getOtherGuid(hawb) {
      //alert(hawb)
      var otherguid = "";
      this.hawbList.forEach(item => {
        if (item.name == hawb) {
          otherguid = item.id;
        }
      });
      return otherguid || -1;
    },
    getAllHawb() {
      console.log(this.allmaindata);
      //alert('1')
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAxpline",
        params: {
          hpoidHawbGroup: this.allmaindata.guid
        },
        loading: true,
        tip: false
      }).then(results => {
        var resultsData = results.data;
        var hawbShow = "";
        for (var i in resultsData) {
          this.hawbList.push({
            name: resultsData[i].hawb,
            id: resultsData[i].guid
          });
          hawbShow += resultsData[i].hawb + ",";
        }
        this.hawbShow = hawbShow.substring(0, hawbShow.length - 1);
      });
    },
    //新增并确认
    addConfirmWage(el, wageinout, status, isbohuiOper) {
      //isbohuiOper 本站新增驳回
      console.log(wageinout);
      var activeSettname = this.activeSettname; //若存在激活的结算对象，需要暂留此结算对象，费用确认后需要重新激活
      this.activeSettname = "";
      //console.log(activeSettname)
      var method;
      if (this.evDisabled(el) && !isbohuiOper) return;

      if (
        wageinout == "1" &&
        ((this.allmaindata.groupid < 0 && Number(this.allmaindata.gid) < 0) ||
          (this.allmaindata.groupid > 0 && this.childData.gid < 0))
      ) {
        return this.$message.error("无委托客户无法操作");
      }

      if (
        !Number(this.curentObject.price) ||
        !Number(this.curentObject.num) ||
        !this.curentObject.wagetype ||
        !this.curentObject.items
      ) {
        return this.$message.error("请填写完整费用");
      }

      if (!this.curentObject.gid) {
        return this.$message.error("请选择结算对象");
      }

      var templateData = { ...this.curentObject };

      //console.log(this.curentObject)
      //console.log(templateData.isfree)
      //return;
      templateData.sid = this.childData.boguid || this.allmaindata.boguid;

      templateData.boguid = this.allmaindata.boguid;

      templateData.quote = 0;
      templateData.wageinout = wageinout;
      templateData.otherguid = this.getOtherGuid(templateData.otherno);

      templateData.wagedom = templateData.id
        ? templateData.wagedom
        : this.costDom
        ? this.costDom
        : "结算";
      templateData.servicecode = this.serviceSelectCode;

      method = templateData.id ? "PUT" : "POST";
      templateData.area = this.allmaindata.area;

      templateData.contact = this.contact;
      templateData.modifyReason = this.modifyReason;
      templateData.confirmstatus = status;

      templateData.isfree =
        templateData.isfree === "1" || !templateData.isfree ? "1" : "2";

      var api = isbohuiOper
        ? this.isFromFob == "Fob2"
          ? "api/ExCostCheckFobInsertReject"
          : "api/ExBoBaseWageInsertReject"
        : "api/ExHpoAxplineWage";

      templateData.status = -1;
      templateData.wagedom = this.resetJieshuanWagedom(
        templateData,
        this.allmaindata
      );

      templateData.changerate = this.zdChangeRate;
      templateData.leastwageall = this.zdLeastWageall;
      templateData.wageall = this.zdWageAll;
      console.log(templateData);
      //return;
      this.$axios({
        method: method,
        url: this.$store.state.webApi + api,
        data: templateData,
        loading: true,
        tip: false
      }).then(async results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          //新增修改费用，结算对象需保留
          this.delCurCost({ gid: templateData.gid });
          this.wageguid = [];
          if (method == "PUT") {
            // 修改费用则修改此条费用 应收付、新数据、方法
            this.$emit("handleCost", { wageinout, templateData, method });
          } else {
            //新增费用重新查询
            await this.$parent.mawbCost(activeSettname);
            if (activeSettname) {
              this.activeSettname = activeSettname;
            }
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    //删除费用 无index为批量  wageinout应收付
    delCost(index, el, wageinout) {
      if (index >= 0) {
        if (this.evDisabled(el)) return;
      }
      //console.log(this.costData.filter(i=>i.wageinout==this.wageinout&& i.yssys != '2')[index])
      //console.log(index)
      this.$confirm("是否删除此费用?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            guidList:
              index < 0
                ? this.wageguid.join(",")
                : this.costData.filter(
                    i => i.wageinout == wageinout && i.yssys != "2"
                  )[index]["guid"],
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
              if (index >= 0) {
                this.$emit("handleCost", {
                  wageinout,
                  list: [].concat(
                    this.costData.filter(
                      i => i.wageinout == wageinout && i.yssys != "2"
                    )[index]["guid"]
                  ),
                  method: "DELETE"
                });
              } else {
                this.$emit("handleCost", {
                  wageinout,
                  list: this.wageguid,
                  method: "DELETE"
                });
              }
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
    //修改费用
    modCost(el, index, wageinout) {
      if (this.evDisabled(el)) return;
      this.modCostIndex = index;
      console.log(
        this.costData.filter(i => i.wageinout == wageinout && i.yssys != "2")[
          index
        ]
      );
      this.curentObject = {
        ...this.costData.filter(
          i => i.wageinout == wageinout && i.yssys != "2"
        )[index]
      };
      this.curentObject.isfree = this.curentObject.isfree == 1 ? false : true;
    },
    //批量确认、取消确认
    costConfirmPl(el, wageinout, status) {
      //console.log('111')
      if (this.evDisabled(el)) return;
      if (!this.wageguid.length) {
        return this.$message.error("请勾选应收结算对象");
      }
      if (
        this.costData.filter(
          i => this.wageguid.includes(i.guid) && i.isbill == "1"
        ).length
      ) {
        this.wageguid = [];
        return this.$message.error("已对账费用无法取消确认");
      }

      if (
        this.costData.filter(
          i => this.wageguid.includes(i.guid) && Number(i.wageall) == 0
        ).length
      ) {
        return this.$message.error("费用为0无法确认");
      }

      if (
        wageinout == "1" &&
        ((this.allmaindata.groupid < 0 && Number(this.allmaindata.gid) < 0) ||
          (this.allmaindata.groupid > 0 && this.childData.gid < 0))
      ) {
        return this.$message.error("无委托客户无法操作");
      }

      var data = {
        boguid: this.allmaindata.boguid,
        wageinout: wageinout,
        status: status,
        area: this.allmaindata.area,
        isFromFob: this.isFromFob ? this.isFromFob : "",
        guidList: this.wageguid.join(","),
        isyssys: "1",
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
          this.$message.success("操作成功");
          this.costData.forEach(i => {
            //改变显示状态
            if (this.wageguid.includes(i.guid)) {
              i.confirmstatus = status;
            }
            // 如果是取消确认，则取消此订单系统费用
            if (
              status == "1" &&
              i.yssys == 2 &&
              i.wageinout == this.wageinout &&
              (this.allmaindata.groupid < 0 ||
                (this.allmaindata.groupid > 0 &&
                  i.sid == this.childData.boguid))
            ) {
              i.confirmstatus = "1";
            }
          });
          this.$parent.setnameStatus(this.costData);
          this.wageguid = [];
        }
      });
    },
    //清空当前费用
    delCurCost({ gid }) {
      //console.log(gid)
      this.contact = "";
      this.modifyReason = "";
      this.modCostIndex = "-1";
      this.curentObject = {
        currency: this.defaultCurrency || "人民币",
        gid: gid
          ? gid
          : this.wageinout == "1"
          ? Number(this.orderpgid)
          : Number(this.gysId),
        otherno: "--",
        num: "",
        price: ""
      };
    },
    async piliangWagebohui() {
      //批量确认驳回
      let editlist = [];
      this.$refs.myCommonTable.forEach(i => {
        editlist.push(JSON.parse(JSON.stringify(i.editData)));
      });

      if (!this.rollbackreason) return this.$message.error("请填写驳回理由！");

      editlist.forEach(i => {
        i.czman = localStorage.usrname;
        i.initiator = this.initiator;
        i.status = -1;
        i.rollbackreason = this.rollbackreason;
        i.isfree = i.isfree == "是" || i.isfree == 2 ? 2 : 1;
        i.wagedom = this.resetJieshuanWagedom(i, this.allmaindata);
        delete i.confirmstatus;
      });

      //console.log(editlist);return;
      let confirm = await this.$confirm("请确认操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (!confirm) return;
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/ExBoBaseWageReject",
        loading: true,
        data: editlist
      }).then(res => {
        // console.log('费用驳回')
        // console.log('res')
        if (res.data.resultstatus == 0) {
          this.$message.success(res.data.resultmessage);
          this.bohuiVisible = false;
          this.$parent.mawbCost();
        } else {
          this.$message.error(res.data.resultmessage);
        }
      });
    },
    isAllWageConfirm() {
      //系统费用是否全部确认
      return this.costData
        .filter(i => i.yssys == 2 && i.wageinout == this.wageinout)
        .every(i => i.confirmstatus == 700);
    },
    bohuiOperUsed(type) {
      //外站是否可以发起驳回
      //type 1应收 2应付
      return (
        this.isAllWageConfirm(type) &&
        this.profitmode.includes(type == 1 ? "Co" : "利润") &&
        this.isSponsor &&
        this.allmaindata.area != this.conditionalAreaForBuild
      );
    },
    //带入建议费用
    async addSuggestWage(wageinout, suggestindex, status) {
      let wagelist = [];
      if (wageinout == "1") {
        if (this.$parent.kfWageinAllConfirm) return;
        wagelist.push(
          this.suggest.find(item => item.suggestindex === suggestindex)
        );
      } else if (wageinout == "2") {
        if (this.$parent.kfWageoutAllConfirm) return;
        wagelist.push(
          this.suggest.find(item => item.suggestindex === suggestindex)
        );
      }

      wagelist = JSON.parse(JSON.stringify(wagelist));
      wagelist.forEach(item => {
        delete item.issuggest;
        delete item.suggestindex;
        delete item.background;
        delete item.guid;
        item.isfree = item.isfree == 1 || item.isfree == false ? 1 : 2;
        item.area = this.allmaindata.area;
        if (status === "700") {
          item.confirmstatus = status;
        } else {
          item.confirmstatus = "1";
        }
      });

      let data = {
        boguid: this.allmaindata.boguid,
        wagelist
      };

      await this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        data,
        loading: true,
        tip: false,
        noarea: true
      }).then(async ({ data }) => {
        if (data.resultstatus === 0) {
          this.$message.success("带入建议费用成功");
          this.checkedWageSuggestindex = [];

          // 重新获取费用
          await this.$parent.mawbCost();
        } else {
          this.$message.error(
            data.resultmessage !== "新增失败"
              ? data.resultmessage
              : "带入建议费用失败"
          );
        }
      });
    },
    // 批量新增建议费用
    async addSuggestWageBatch(wageinout) {
      let wagelist = [];

      if (this.$parent.kfWageinAllConfirm && this.wageinout == "1") return;
      if (this.$parent.kfWageoutAllConfirm && this.wageinout == "2") return;
      if (this.checkedWageSuggestindex.length === 0) {
        return this.$msesage.error("请勾选建议费用");
      } else {
        wagelist.push(
          ...this.suggest.filter(item =>
            this.checkedWageSuggestindex.includes(item.suggestindex)
          )
        );
      }

      wagelist = JSON.parse(JSON.stringify(wagelist));
      wagelist.forEach(item => {
        delete item.issuggest;
        delete item.suggestindex;
        delete item.background;
        delete item.guid;
        //item.isfree = item.isfree === '否' ? 1 : 2
        item.area = this.allmaindata.area;
        item.confirmstatus = "1";
      });

      let data = {
        boguid: this.allmaindata.boguid,
        wagelist
      };
      //console.log(data)
      await this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        data,
        loading: true,
        tip: false,
        noarea: true
      }).then(async ({ data }) => {
        if (data.resultstatus === 0) {
          this.$message.success("带入建议费用成功");
          this.checkedWageSuggestindex = [];

          // 重新获取费用
          await this.$parent.mawbCost();
        } else {
          this.$message.error(
            data.resultmessage !== "新增失败"
              ? data.resultmessage
              : "带入建议费用失败"
          );
        }
      });
    },
    // 禁止点击新增确认判断  isback是否驳回
    disabledAdd(type, isback = false) {
      if (!this.Cshow) {
        if (Number(this.allmaindata.orderguid) > 0) {
          //操作站
          if (type == "1") {
            //应收
            if (this.profitmode.indexOf("Co") != -1) {
              //coload模式
              return false;
            } else if (this.profitmode.indexOf("利润") != -1) {
              //利润分配模式
              return true;
            } else {
              //无分配模式
              if (this.isConfirm) {
                //费用总确认了
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            }
          }
          if (type == "2") {
            //应付
            if (this.profitmode.indexOf("Co") != -1) {
              //coload模式
              if (this.isConfirm) {
                //费用总确认了
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else if (this.profitmode.indexOf("利润") != -1) {
              //利润分配模式
              if (this.isConfirm) {
                //费用总确认了
                return false;
              } else {
                return false;
              }
            } else {
              //无分配模式
              if (this.isConfirm) {
                //费用总确认了
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            }
          }
        }

        if (
          this.allmaindata.childguid > 0 ||
          this.allmaindata.childguid == -1
        ) {
          //销售站或者本站
          if (type == "1") {
            //应收
            if (this.profitmode.indexOf("Co") != -1) {
              //coload模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else if (this.profitmode.indexOf("利润") != -1) {
              //利润分配模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else {
              //无分配模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            }
          }
          if (type == "2") {
            //应付
            if (this.profitmode.indexOf("Co") != -1) {
              //coload模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else if (this.profitmode.indexOf("利润") != -1) {
              //利润分配模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            } else {
              //无分配模式
              if (this.isConfirm) {
                if (isback) {
                  //费用确认了仍可以点驳回
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }
    },
    // 是否可以点击修改按钮  isback是否是驳回
    disabledEdit(type, data, isback = false) {
      //已对账无法修改
      if (data.isbill == "1") {
        return true;
      }
      //带的费用无法修改
      if (type == "2" && Number(data.isshare) > 0) {
        return true;
      }

      if (Number(this.allmaindata.orderguid) > 0) {
        //操作站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              return false;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return true;
          } else {
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              return false;
            } else {
              return false;
            }
          } else {
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        }
      }

      if (this.allmaindata.childguid > 0 || this.allmaindata.childguid == -1) {
        //销售站或者本站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else {
            //无分配模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        }

        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else {
            //无分配模式
            if (this.isConfirm) {
              if (isback) {
                //费用确认可以发起驳回
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        }
      }
    },
    // 是否能够点击删除按钮
    showUconfirmF(type, data) {
      //已对账费用无法删除
      if (data.isbill == "1") {
        return true;
      }
      // 带出来的费用无法删除
      if (type == "2" && Number(data.isshare) > 0) {
        return true;
      }

      if (Number(this.allmaindata.orderguid) > 0) {
        //操作站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return true;
          } else {
            //未分配
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          }
        }

        if (type == "2") {
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else {
            //未分配
            return false;
          }
        }
      }

      if (this.allmaindata.childguid > 0 || this.allmaindata.childguid == -1) {
        //销售站或者本站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          }
        }

        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co") != -1) {
            //coload模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (this.isConfirm) {
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            return false;
          }
        }
      }
    }
  },
  mounted: function() {
    this.getAllHawb();
  },
  created: function() {
    let groupIdData = JSON.parse(localStorage.getItem("groupType"));
    groupIdData.forEach(item => {
      if (item.groupid == 33) {
        this.jsfs.push({
          value: item.id,
          typename: item.typename
        });
      }
    });

    let currencyData = JSON.parse(localStorage.getItem("currencyData"));
    currencyData.forEach(item => {
      this.currencyList.push(item.cname);
    });

    if (this.defaultCurrency) {
      this.curentObject.currency = this.defaultCurrency;
    }

    if (this.allmaindata.pono.indexOf("BOGN") != "-1") {
      //bogn订单分运单号隐藏
      this.mawb_table_model.filter(i => i.field == "otherno")[0].hidden = true;
    }
    if (this.wageinout == "1") {
      this.curentObject["gid"] = Number(this.orderpgid);
    } else if (this.wageinout == "2") {
      this.curentObject["gid"] = Number(this.gysId);
    }

    console.log(this.allmaindata);
  },
  computed: {
    zdChangeRate() {
      return getChangeRate(this.curentObject.currency);
    },
    zdLeastWageall() {
      if (this.curentObject.num && this.curentObject.price) {
        return (
          Number(this.curentObject.num) * Number(this.curentObject.price)
        ).toFixed(2);
      }
    },
    zdWageAll() {
      if (this.zdLeastWageall && this.zdChangeRate) {
        return (
          Number(this.zdLeastWageall) * Number(this.zdChangeRate)
        ).toFixed(2);
      }
    },
    defaultCurrency() {
      return this.$store.getters.userSetting.defaultCurrency;
    },
    costAll() {
      //所有费用
      if (this.wageinout == "1") {
        //console.log(this.suggest)
        return [].concat(
          this.costData.filter(i => i.wageinout == "1" && i.yssys != "2"),
          this.suggest
        );
      } else {
        return [].concat(
          this.costData.filter(i => i.wageinout == "2" && i.yssys != "2"),
          this.suggest
        );
      }
    },
    isConfirm() {
      //是否总确认

      return this.costData
        .filter(
          item =>
            item.wageinout == this.wageinout &&
            item.yssys == "2" &&
            ((!item.thisListHide && this.allmaindata.groupid > 0) ||
              this.allmaindata.groupid < 0)
        )
        .every(i => i.confirmstatus == "700");
    },
    isshwage() {
      //是否是上海结算费用
      return (
        this.isSponsor &&
        ((this.allmaindata.area == this.conditionalAreaForBuild &&
          !this.isFromFob) ||
          (this.isFromFob == "Fob2" && (this.allmaindata.area == "市场部" ||
          this.allmaindata.area == "海外部")))
      );
    },
    costConfirm() {
      //显示费用确认还是取消确认 如果勾选都确认可以显示取消确认、都未确认则可以显示费用确认
      return this.costData
        .filter(i => this.wageguid.includes(i.guid))
        .every(i => i.confirmstatus == 1 && i.yssys != "2");
    },
    BohuiChecked() {
      //驳回勾选的费用
      return this.costData.filter(
        i =>
          this.wageguid.includes(i.guid) &&
          (i.status == -1 || i.status == 500) &&
          i.isshare <= 0 &&
          i.wageinout == this.wageinout &&
          i.yssys != "2"
      );
    },
    currentGidCost() {
      //结算对象各币种统计
      var list = [];

      this.costData
        .filter(
          item =>
            !item.thisListHide &&
            item.wageinout == this.wageinout &&
            item.isfree == 1
        )
        .forEach(cost => {
          if (!list.map(i => i.currency).includes(cost.currency)) {
            if (cost.confirmstatus == "700") {
              list.push({
                currency: cost.currency,
                money: Number(cost.leastwageall).toFixed(2),
                currencyFh: this.currencyFuHao[cost.currency]
              });
            } else {
              list.push({
                currency: cost.currency,
                money: "0.00",
                currencyFh: this.currencyFuHao[cost.currency]
              });
            }
          } else {
            if (cost.confirmstatus == "700") {
              var data = list.filter(i => i.currency == cost.currency)[0];
              data["money"] = (
                Number(data["money"]) + Number(cost.leastwageall)
              ).toFixed(2);
            }
          }
        });
      return list;
    },
    //应收付费用全选  //所选应收付数量是否与实际应收付相等
    wageCostAll: {
      get() {
        if (!this.costData || !this.wageguid.length) return false;
        var control = true;

        //所有匹配未确认的数量
        var listUnconfirm = this.costData.filter(
          i =>
            i.confirmstatus == 1 &&
            !i.thisListHide &&
            i.yssys != 2 &&
            i.wageinout == this.wageinout &&
            i.status &&
            i.status == -1
        );

        //所有匹配已确认的数量
        var listConfirm = this.costData.filter(
          i =>
            i.confirmstatus == 700 &&
            !i.thisListHide &&
            i.yssys != 2 &&
            i.wageinout == this.wageinout &&
            i.status &&
            i.status == -1
        );

        //遍历筛选所有费用watch
        var list = this.costData.filter(
          item =>
            !item.thisListHide &&
            item.yssys != 2 &&
            item.wageinout == this.wageinout &&
            item.status &&
            item.status == -1
        );
        for (var i in list) {
          //console.log(i)
          if (
            this.wageguid.indexOf(list[i].guid) >= 0 &&
            list[i].confirmstatus == 1 &&
            ((this.activeSettname && this.activeSettname == list[i].gid) ||
              !this.activeSettname)
          ) {
            control = true;
          } else if (
            this.wageguid.indexOf(list[i].guid) >= 0 &&
            list[i].confirmstatus == 700 &&
            ((this.activeSettname && this.activeSettname == list[i].gid) ||
              !this.activeSettname)
          ) {
            control = false;
          }
          break;
        }
        console.log(control);
        return (
          (listUnconfirm.length == this.wageguid.length && control) ||
          (listConfirm.length == this.wageguid.length && !control)
        );
      },
      set(val) {
        let list = this.costData.filter(
          i =>
            !i.thisListHide &&
            i.yssys != 2 &&
            i.wageinout == this.wageinout &&
            i.status &&
            i.status == -1
        );

        if (!val) {
          this.wageguid = [];
        } else {
          console.log(val);
          if (
            list.every(i => i.confirmstatus == 700) ||
            list.every(i => i.confirmstatus == 1)
          ) {
            console.log("1");
            this.wageguid = list.map(i => i.guid);
          } else {
            console.log("2");
            this.wageguid = list
              .filter(i => i.confirmstatus == 1)
              .map(i => i.guid);
          }
        }
      }
    },
    //C类全选
    wageCostAllYsCtype: {
      get() {
        if (!this.costData && !this.wageguidsCtype.length) return false;
        return (
          this.costData.filter(
            i =>
              !i.thisListHide &&
              i.wageinout == "1" &&
              i.yssys != "2" &&
              !i.items.includes("预付")
          ).length == this.wageguidsCtype.length
        );
      },
      set(val) {
        if (!val) {
          this.wageguidsCtype = [];
        } else {
          this.wageguidsCtype = this.costData
            .filter(
              i =>
                !i.thisListHide &&
                i.wageinout == "1" &&
                i.yssys != "2" &&
                !i.items.includes("预付")
            )
            .map(i => i.guid);
        }
      }
    }
  },
  watch: {
    "curentObject.wagetype"(val, oldval) {
      console.log(oldval);
      if (this.modCostIndex != "-1" && !oldval) {
        return;
      } else {
      }
      switch (val) {
        case "箱":
          this.curentObject.num = this.allmaindata.realpiece;
          break;
        case "票":
          this.curentObject.num = "1";
          break;
        case "计重":
          this.curentObject.num = computedWeight(
            this.allmaindata.realvolume,
            this.allmaindata.realweight
          );
          break;
        case "结算重量":
          this.curentObject.num = this.allmaindata.accountweightout;
          break;
        case "毛重":
          this.curentObject.num = this.allmaindata.realweight;
          break;
        case "分运单票数":
          this.curentObject.num = this.allmaindata.hawbnum || 0;
          break;
        case "总运单票数":
          this.curentObject.num = 1;
          break;
        case "总运单件数":
          this.curentObject.num = this.allmaindata.realpiece;
          break;
      }
    },
    activeSettname(val) {
      console.log(val);
      //this.costData.forEach(i => i.thisListHide = false)
      if (val) {
        this.curentObject.gid = val;
        this.curentObject.disabled = true;
      } else {
        if (this.wageinout == "1") {
          this.curentObject.gid = Number(this.orderpgid);
          this.$refs.costHead.arrowAcnIndex = 0;
          this.$refs.costHead.arrowAcnIndexO = 0;
        } else {
          this.curentObject.gid = Number(this.gysId);
          this.$refs.costHead.arrowAcnIndexf = 0;
          this.$refs.costHead.arrowAcnIndexOf = 0;
        }

        this.curentObject.disabled = false;
      }
      // 费用全部还原 除了总览格式
      this.costData
        .filter(i => i.wageinout == this.wageinout)
        .forEach(i => {
          if (this.childData.boguid) {
            //非总览，总览显示逻辑不变(isshare费用并且guid为0的隐藏)
            i.thisListHide =
              ((val && i.gid == val) || !val) && i.sid == this.childData.boguid
                ? false
                : true;
          } else {
            if (i.wageinout == 2 && i.isshare == "1" && i.guid == "0") {
              i.thisListHide = true;
            } else {
              console.log("111");
              i.thisListHide = (val && i.gid == val) || !val ? false : true;
              console.log(i.thisListHide);
            }
          }
        });

      this.wageguid = [];
    },
    wageguid(val) {
      this.costData
        .filter(
          i =>
            i.wageinout == this.wageinout && i.yssys != "2" && !i.thisListHide
        )
        .forEach(i => {
          this.$set(i, "disabled", false);
          if (val.includes(i.guid)) {
            this.$set(i, "background", "#fff9d6");
          } else {
            if (i.confirmstatus == "700") {
              this.$set(i, "background", "#b9ffb6");
            } else if (i.isshare > 0 && i.guid == 0) {
              this.$set(i, "background", "#F0F0F0");
            } else if (
              i.confirmstatus == "1" &&
              this.allmaindata.groupid > 0 &&
              this.wageinout == 2
            ) {
              this.$set(i, "background", "#FFF0F5");
            } else {
              this.$set(i, "background", "");
            }
          }

          if (this.costConfirm && this.wageguid.length) {
            if (i.confirmstatus == 700) {
              this.$set(i, "disabled", true);
            }
          } else {
            if (i.confirmstatus == 1 && this.wageguid.length) {
              this.$set(i, "disabled", true);
            }
          }
        });
    },
    wageguidsCtype(val) {
      if (
        this.costData.filter(
          i =>
            val.includes(i.guid) && i.items == "航司运费" && i.wageinout == "1"
        ).length
      ) {
        this.wageguidsCtypeYf = false;
      } else {
        this.wageguidsCtypeYf = true;
      }

      if (
        this.costData.filter(
          i =>
            val.includes(i.guid) && i.items != "航司运费" && i.wageinout == "1"
        ).length
      ) {
        this.wageguidsCtypeZf = false;
      } else {
        this.wageguidsCtypeZf = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.cancelWageIcon {
  vertical-align: middle;
  background: url("../../../boStatic/images/chahao.png") no-repeat;
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

.setnameTotal {
  margin-top: 8px;
  margin-bottom: 8px;

  .left {
    float: left;

    .leftTitle {
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

.add-wage-icon {
  background: url("../../../boStatic/images/duigou.png") no-repeat;
  vertical-align: middle;
}
.operate .disabled {
  i,
  input {
    cursor: not-allowed;
  }
}
</style>
