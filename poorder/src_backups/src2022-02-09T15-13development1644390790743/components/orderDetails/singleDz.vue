<template>
  <div class="costDetail">
    <!-- {{sjcAllData}} -->
    <el-row>
      <el-col :span="8">
        <span>对账单号:</span>
        <span style="color:red">{{ singleDzData.pchno }}</span>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <span>{{ wageinout == "1" ? "客户对账人:" : "供应商对账人:" }}</span>
        <span style="color:red">{{ singleDzData.confirmman }}</span>
      </el-col>
      <el-col :span="10" style="text-align:right">
        <span>{{
          wageinout == "1" ? "客户对账时间:" : "供应商对账时间:"
        }}</span>
        <span style="color:red">{{
          singleDzData.confirmdate &&
          singleDzData.confirmdate.indexOf("190") == -1 &&
          singleDzData.confirmdate.indexOf("0001") == -1
            ? singleDzData.confirmdate.substring(0, 16)
            : ""
        }}</span>
      </el-col>
    </el-row>

    <el-row style="margin-top:8px;margin-bottom:8px;">
      <el-col :span="8">
        <span>对账状态:</span>
        <span style="color:green">{{
          singleDzData.billstatus == "1000" ? "已对账" : "对账中"
        }}</span>
      </el-col>
      <el-col :span="6" style="text-align:right">
        <span>我司对账人:</span>
        <span style="color:green">{{ singleDzData.ourconfirmman }}</span>
      </el-col>
      <el-col :span="10" style="text-align:right">
        <span>我司对账时间:</span>
        <span style="color:green">{{
          singleDzData.ourconfirmdate &&
          singleDzData.ourconfirmdate.indexOf("190") == -1 &&
          singleDzData.ourconfirmdate.indexOf("0001") == -1
            ? singleDzData.ourconfirmdate.substring(0, 16)
            : ""
        }}</span>
      </el-col>
    </el-row>

    <!--     {{sjcAllData}} -->
    <div class="detail mawbCharge">
      <div class="detail-title">
        <p>结算对象</p>
      </div>
      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="settleListHead"
          :table-data="sjcAllData"
          v-if="sjcAllData"
        >
          <template slot="operate" slot-scope="props"
            ><input
              type="checkbox"
              :value="props.data.index"
              v-model="jsValue"
              ref="test"
          /></template>
          <template slot="num" slot-scope="props">{{
            sjcAllData[props.data.index].jobnolist.length
          }}</template>
        </commonTable>
      </div>
    </div>

    <div class="detail mawbCharge">
      <div class="detail-title">
        <p>
          订单号 &nbsp;&nbsp;&nbsp;&nbsp;共{{
            jobListData ? jobListData.length : ""
          }}票

          <el-button
            style="float:right;margin-top:4px;margin-right:5px;"
            type="primary"
            @click="addDeleteDz"
            v-if="showbtn == 1"
            :disabled="singleDzData.billstatus == 1000 ? true : false"
            >编辑</el-button
          >
          <el-input
            placeholder="订单筛选"
            style="width:150px;float:right;margin-right:30px;"
            v-model="order"
          ></el-input>
        </p>
      </div>
      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="showbtn == 1 ? jobListHead : jobListHeadT"
          :table-data="jobListData"
          v-if="jobListData"
          isMultiSelect
          @multiSelectChange="changeJob"
          @multiSelectCheckAll="changeJobAll"
          :defaultSelectRowIndex="defaultSelectRowIndex"
        >
          <template slot="checkbox" slot-scope="props"
            ><input
              type="checkbox"
              :value="props.data.index"
              v-model="orderValue"
              :disabled="props.data.disabled"
          /></template>
          <template
            slot="cancelDz"
            slot-scope="props"
            v-if="checkStatus != '已对账'"
            ><i class="el-icon-delete" @click="deldz(props.data.index, '1')"></i
          ></template>
        </commonTable>
      </div>
    </div>

    <div
      class="detail mawbCharge"
      v-for="(i, index) in costListData"
      v-if="i && i.length"
      :key="index"
    >
      <div class="detail-title">
        <p>
          费用明细&nbsp;&nbsp;&nbsp;&nbsp;共{{ i ? i.length : "" }}条
          <el-button
            style="float:right;margin-right:8px;margin-top:3px;"
            type="primary"
            @click="addBohui(i[0].jobid, index)"
            v-if="wageinout == '1' || '2'"
            :disabled="
              i.filter(item => item.system != '空出' || item.wagedom == '调账')
                .length > 0
            "
            >新增并驳回</el-button
          >
        </p>
      </div>
      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="costListHead"
          :table-data="i"
          :paginationShow="true"
          isMultiSelect
          @multiSelectChange="changeCost"
          @multiSelectCheckAll="changeCostAll($event, index)"
        >
          <template slot="bohuiAll" v-if="wageinout == '1' || '2'">
            <i
              class="el-icon-shenhebohui"
              title="批量驳回"
              @click="mawbDetail(i, '2')"
              style="font-size:14px;margin-left:4px;"
              v-if="projectIsWecan && !mawbChargeBohuiChecked(i) && isSponsor"
            ></i>
          </template>
          <template
            slot="bohui"
            slot-scope="props"
            v-if="wageinout == '1' || '2'"
          >
            <!-- &&mawbChargeBohuiChecked(i) -->
            <i
              class="el-icon-shenhebohui"
              :style="setBhiconColor(props.data.row.status)"
              :title="setBhiconColor(props.data.row.status, 2)"
              @click="mawbDetail(props.data.row)"
              v-if="
                (projectIsWecan &&
                  (isSponsor
                    ? props.data.row.isshare < 0 &&
                      props.data.row.thisfinishwageall_checkbill !=
                        props.data.row.realwageall
                    : props.data.row.status != -1) &&
                  checkStatus != '已对账' &&
                  props.data.row.items != '利润分成') ||
                  props.data.row.thisfinishwageall_checkbill ===
                    props.data.row.realwageall
              "
              :icondisabled="
                props.data.row.system != '空出' ||
                  props.data.row.wagedom == '调账' ||
                  props.data.row.isshare > 0
              "
            ></i>
          </template>
          <template
            slot="delete"
            slot-scope="props"
            v-if="checkStatus != '已对账'"
          >
            <i class="el-icon-delete" @click="deleteCost(props.data.row)"></i>
          </template>
        </commonTable>
      </div>
    </div>

    <p style="text-align:right" v-if="showbtn == 1">
      <el-button
        @click="dzing"
        v-if="singleDzData.billstatus == 1000"
        type="primary"
        >设为对账中</el-button
      >
      <el-button
        @click="reconOpenTrue"
        v-if="singleDzData.billstatus == 900"
        type="primary"
        >设为已对账</el-button
      >
      <el-button
        @click="cancelDz"
        type="primary"
        :disabled="singleDzData.billstatus == 1000 ? true : false"
        >取消对账</el-button
      >
      <el-button @click="back">返回</el-button>
    </p>

    <!-- 已对账弹框 -->
    <el-dialog
      width="600px"
      top="4%"
      center
      :visible.sync="reconOpen"
      v-if="reconOpen"
      append-to-body
    >
      <div style="width:430px;margin:0 auto">
        <p>
          <span style="min-width:120px;display:inline-block">{{
            wageinout == "1" ? "客户对账人:" : "供应商对账人:"
          }}</span>
          <el-input
            v-model="reconInfo.confirmman"
            style="width:300px;"
          ></el-input>
        </p>
        <p style="margin-top:20px;" class="input-required">
          <span style="min-width:120px;display:inline-block">{{
            wageinout == "1" ? "客户对账时间:" : "供应商对账时间:"
          }}</span>
          <el-date-picker
            v-model="reconInfo.confirmdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:300px;"
          >
          </el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">我司对账人:</span>
          <el-input
            v-model="reconInfo.ourconfirmman"
            style="width:300px;"
          ></el-input>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block"
            >我司对账时间:</span
          >
          <el-date-picker
            v-model="reconInfo.ourconfirmdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:300px;"
          >
          </el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span
            style="min-width:120px;display:inline-block;vertical-align:middle"
            >对账备注:</span
          >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="reconInfo.confirmremark"
            style="width:300px;vertical-align:middle"
          >
          </el-input>
        </p>
        <p style="margin-top:20px;text-align:center">
          <el-button @click="reconOpen = false">取消</el-button>
          <el-button @click="dzing">确认</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 取消对账弹框 -->
    <el-dialog
      width="800px"
      top="4%"
      center
      :visible.sync="abanDz"
      v-if="abanDz"
      append-to-body
      @close="closeAbanDz"
      custom-class="reason"
    >
      <div>
        <div class="orderSystem-c">
          <h3>取消原因</h3>
          <p class="orderNo">
            <span style="color:#004d84;float:left;font-weight:bold">{{
              jobListData[cancelCostIndex].pono
            }}</span>
            <span style="color:#333;float:right">{{
              jobListData[cancelCostIndex].accountcomname
            }}</span>
          </p>
          <ul>
            <li>总运单号</li>
            <li>始发港</li>
            <li>目的港</li>
            <li>实际件重体</li>
            <li>航班号</li>
            <li>航班日期</li>
          </ul>
          <ul style="margin-top:3px;">
            <li>{{ jobListData[cancelCostIndex].mawb }}</li>
            <li>{{ jobListData[cancelCostIndex].sfg }}</li>
            <li>{{ jobListData[cancelCostIndex].mdg }}</li>
            <li>{{ jobListData[cancelCostIndex].realjzt }}</li>
            <li>{{ jobListData[cancelCostIndex].hbh }}</li>
            <li>{{ jobListData[cancelCostIndex].hbrq.substring(0, 10) }}</li>
          </ul>

          <el-input
            type="textarea"
            v-model="abandonReason"
            class="input-required"
            :autosize="{ minRows: 4 }"
            style="margin-top:12px;color:#c8c8c8"
            placeholder="工作号取消原因输入框"
          ></el-input>

          <div class="costItems">
            <div style="width:710px;overflow:hidden;display:inline-block">
              <ul class="costItemsList" style="width:10000px;overflow:hidden;">
                <li
                  v-for="(item, index) in jobListData[cancelCostIndex].wagelist"
                  :key="index"
                  :style="{ color: costItemsActive == index ? '#004d84' : '' }"
                  @click="costItemsActive = index"
                >
                  <el-badge is-dot class="item" v-if="item.abandonReason">{{
                    item.items
                  }}</el-badge>
                  <span v-else>{{ item.items }}</span>
                </li>
              </ul>
            </div>

            <div style="display:inline-block">
              <i class="el-icon-caret-left" @click="changeDirection(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
            </div>
          </div>

          <div class="costItemsContent" style="margin-top:16px;">
            <ul>
              <li>对账金额</li>
              <li>单价</li>
              <li>数量</li>
              <li>货币</li>
            </ul>
            <ul style="margin-top:3px;">
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive]
                    .thisfinishwageall_checkbill
                }}
              </li>
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive].price
                }}
              </li>
              <li>
                {{ jobListData[cancelCostIndex].wagelist[costItemsActive].num }}
              </li>
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive]
                    .currency
                }}
              </li>
            </ul>

            <el-input
              type="textarea"
              v-model="
                jobListData[cancelCostIndex].wagelist[costItemsActive]
                  .abandonReason
              "
              class="input-required"
              :autosize="{ minRows: 4 }"
              style="margin-top:8px;color:#c8c8c8"
              :placeholder="
                jobListData[cancelCostIndex].wagelist[costItemsActive].items +
                  '取消原因输入框'
              "
            ></el-input>
          </div>
        </div>

        <p style="margin-top:18px;text-align:right">
          <el-button @click="cancelDzFw(wageIdS)" type="primary"
            >确定</el-button
          >
          <el-button @click="closeAbanDz">取消</el-button>
        </p>
      </div>
    </el-dialog>

    <el-dialog
      width="1300px"
      top="8%"
      center
      :visible.sync="addDelDz"
      :title="addDelTitle"
      v-if="addDelDz"
      @close="
        singleDz();
        addDelDz = false;
      "
      :modal="true"
      append-to-body
    >
      <addDelDzZj
        :addDel="addDelId"
        :billstatus="billstatus"
        :wageinout="wageinout"
        :accountcomname="accountcomname"
        :accountcomgid="accountcomgid"
        :system="system"
        @reSearch="singleDz"
        :area="area"
        :addman="addman"
      ></addDelDzZj>
    </el-dialog>

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
      <div style="min-height:400px" v-if="allmaindata.boguid">
        <infoList
          :inputModelData="allmaindata"
          v-if="showInfoList"
          name="详细"
          :costBiaozhu="false"
          :ifopendetail="false"
          :showBtnGroup="false"
        >
        </infoList>
        <!--   <infoList :inputModelData="inputModelDataInfoList" v-if="showInfoList" :pono="mawbInfo.jobno" name="详细" :costBiaozhu="false" :ifopendetail="false":showBtnGroup="false"/> -->
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
                      : item.receiver == 'initiator'
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
            :ifNeedFrashWage.sync="ifNeedFrashWage"
            ref="myCommonTable"
            :ifPiliangBohui="
              isSponsor &&
                wageBohuiData.length > 1 &&
                wageBohuiData.filter(i => i.status == -1 || i.status == 500)
                  .length == wageBohuiData.length
            "
            v-if="
              childBohuiCheckedList.includes(index) ||
                (isSponsor &&
                  wageBohuiData.length > 1 &&
                  wageBohuiData.filter(i => i.status == -1 || i.status == 500)
                    .length == wageBohuiData.length)
            "
            :mawbinfo="allmaindata"
            :wageBohuiData.sync="wageBohuiData[index]"
            :key="index"
            :initiator="initiator"
            name="singleDz"
          ></myCommonTable>
        </template>

        <div
          v-if="
            isSponsor &&
              wageBohuiData.length > 1 &&
              wageBohuiData.filter(i => i.status == -1 || i.status == 500)
                .length == wageBohuiData.length
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

    <el-dialog
      :visible.sync="bohuiAddDialog"
      width="1360px"
      title="新增并驳回"
      append-to-body
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      center
      top="4%"
    >
      <infoList
        :inputModelData="mawbDetil"
        v-if="showInfoList && mawbDetil.boguid"
        :pono="mawbDetil.pono"
        name="详细"
        :costBiaozhu="false"
        :ifopendetail="false"
        :showBtnGroup="false"
      />

      <costComtab
        v-if="mawbDetil.boguid"
        :inputModelData="mawbDetil"
        @reSearch="singleDz"
      ></costComtab>
    </el-dialog>
  </div>
</template>

<script>
import { getMomentDate, dateFormat } from "../../api/localStorage.js";
import addDelDzZj from "./addDelDzZj";
import costComtab from "../templates/costComtab";
import { myCommonTable, setBhiconColorMixin } from "@/common/detailPagesMixin";

export default {
  components: {
    addDelDzZj,
    costComtab,
    myCommonTable
  },
  mixins: [setBhiconColorMixin],
  props: {
    singleDzData: {
      type: Object
    },
    showbtn: {
      type: Number,
      default: 0
    },
    tableSelectIndex: "",
    system: {
      type: String
    },
    area: "",
    addman: "",
    checkStatus: "",
    wageinout: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      jsValue: [], //结算对象多选
      temporaryList: [], //临时存放选中的 订单
      costValue: [], //选择费用
      //jobListData:[],//订单List
      costListData: [], //费用List
      reconInfo: {
        confirmman: "",
        confirmdate: "",
        ourconfirmman: localStorage.getItem("usrname"),
        ourconfirmdate: getMomentDate(),
        confirmremark: ""
      },
      reconOpen: false,
      //dzz:false,
      //ydz:true,
      settleListHead: [
        { field: "operate", title: "" },
        { field: "accountname", title: "结算对象" },
        // {field: "leastwageall_checkbill", title: "剩余对账金额(折合人民币)"},
        { field: "thisfinishwageall_checkbill", title: "当前对账金额" },
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "num", title: "订单数" },
        { field: "name", title: "联系人姓名" },
        { field: "mobile", title: "联系电话" },
        { field: "email", title: "联系邮箱" }
      ],

      jobListHead: [
        // {field: 'checkbox', title: '',disabled:'true'},
        { field: "cancelDz", title: "取消对账" },
        // {field: "leastwageall_checkbill", title: "剩余对账金额(折合人民币)"},
        // {field: 'operate', title: ''},
        { field: "thisfinishwageall_checkbill", title: "当前对账金额" },
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "pono", title: "订舱编号" },
        { field: "orderno", title: "订单来源号" },
        { field: "mawb", title: "总运单号" },
        { field: "hawb", title: "分运单号" },
        { field: "sfg", title: "始发港" },
        { field: "mdg", title: "目的港" },
        { field: "realjzt", title: "实际件重体" },
        { field: "hbh", title: "航班号" },
        { field: "hbrq", title: "航班日期" }
      ],
      jobListHeadT: [
        { field: "pono", title: "订舱编号" },
        { field: "orderno", title: "订单来源号" },
        { field: "mawb", title: "总运单号" },
        { field: "hawb", title: "分运单号" },
        { field: "sfg", title: "始发港" },
        { field: "mdg", title: "目的港" },
        { field: "realjzt", title: "实际件重体" },
        { field: "hbh", title: "航班号" },
        { field: "hbrq", title: "航班日期" },
        { field: "leastwageall_checkbill", title: "剩余对账金额(折合人民币)" }
      ],
      costListHead: [
        { field: "pono", title: "订舱编号" },
        { field: "mawb", title: "总运单号" },
        { field: "items", title: "服务项目" },
        { field: "realwageall", title: "金额" },
        { field: "finishwageall_checkbill", title: "已对账金额" },
        { field: "thisfinishwageall_checkbill", title: "本票对账金额" },
        { field: "leastwageall_checkbill", title: "剩余金额" },
        { field: "price", title: "单价" },
        { field: "num", title: "数量" },
        { field: "currency", title: "币种" },
        { field: "realwageallrmb", title: "人民币总额" }
      ],

      //  singleDzData:{},//单条对账信息记录
      sjcAllData: [],
      billstatusString: "", //传给子组件
      delete: false,
      abanDz: false, //取消对账弹框
      abandonReason: "", //取消对账原因
      addDelDz: false, //添加至对账单弹框
      wageIdS: "", //取消对账费用id
      //tableType:'',//取消对账table类型
      cancelCostIndex: "", //取消费用index
      costItemsActive: 0,
      arrowIndex: 0,
      order: "", //订舱编号值
      orderBackUp: [],

      allmaindata: {},
      initiator: 50,
      rollbackreason: "",
      bohuiVisible: false, //费用驳回弹窗 // 费用中的 status：-1 未发起，100 待通过，200 已驳回，500，已通过
      wageBohuiData: [], //驳回的数据
      childBohuiChecked: 0,
      childBohuiCheckedList: [0],
      ifNeedFrashWage: false,
      showInfoList: true,
      bohuiAddDialog: false, //新增驳回弹框
      mawbDetil: {}, //订单数据
      bohuiAddIndex: "-1", //新增并驳回
      mawbObject: {}, //订单层数据
      // templeteIndex:[]
      // 临时存放 jobId 数据
      temporaryData: [],
      defaultSelectRowIndex: "-1",
      selectCost: []
    };
  },
  created() {
    this.singleDz();
  },
  computed: {
    // 订单LIst
    jobListData: {
      get: function() {
        var old = [];
        if (this.jsValue && this.jsValue.length > 0) {
          var resultsData = [];
          var jsList = this.jsValue;
          jsList.forEach(item => {
            var concatData = this.sjcAllData[item].jobnolist;
            resultsData = resultsData.concat(concatData);
          });

          if (this.order) {
            var update = this.order.toLowerCase();
            resultsData.forEach((item, index) => {
              var num = 1;
              Object.keys(item).forEach(item2 => {
                if (
                  item2 != "accountgid" &&
                  item2 != "jobid" &&
                  item2 != "settjobid" &&
                  item[item2] != "" &&
                  item2 != "firstParentIndex"
                ) {
                  var stringN = String(item[item2]).toLowerCase();
                  if (stringN.indexOf(update) == -1) {
                    num = num * 1;
                  } else {
                    num = 0;
                  }
                }
              });
              if (num > 0) {
                item.thisListHide = true;
              } else if (num == 0) {
                item.thisListHide = false;
              }
            });
          } else {
            console.log("123");
            resultsData.forEach((item, index) => {
              item.thisListHide = false;
            });
          }
          return resultsData;
        } else {
          this.orderValue = [];
        }
      },
      set: function() {}
    }

    // 费用List
    // costListData: {
    //   get: function() {
    //     console.log("------------------")
    //     console.log(this.jobListData)
    //     console.log("------------------")

    //     var resultsData = [];
    //     if (this.jobListData && this.jobListData.length > 0) {
    //       this.jobListData.filter(i=>!i.thisListHide).forEach(item => {
    //         resultsData.push(item.wagelist);
    //       });

    //       return resultsData;
    //     } else {
    //       this.costValue = [];
    //     }
    //   },
    //   set: function() {}
    // }

    //    costValue(){

    // if(this.cost.length==0){
    // 	 this.costListData.forEach((item,index)=>{
    //     		if(!this.cost.includes(index)){
    //     			this.cost.push(index)
    //     		}
    //     	})
    // }else{
    // 	 if(this.cost.indexOf(val)!=-1){
    //    		this.cost.splice(cost.indexOf(val),1)
    //    	}
    // }
    // return this.cost

    //    }
    //   costValue:{
    //   	get(){
    //   		var cost=[]
    //   	////console.log(this.costListData)
    //   	if(this.costListData&&this.costListData.length>0){
    //    this.costListData.forEach((item,index)=>{
    // ////console.log(item)
    // //alert(index)
    // if(!cost.includes(index))
    //   			cost.push(index)
    //   		})

    //   return cost
    //   	}
    //   },
    //   set(newvalue){

    //   }

    //   }
  },

  methods: {
    changeCost(data) {
      if (data.row.checked) {
        this.selectCost.push(data.row);
        this.selectCost = [...new Set(this.selectCost)];
        data.row.leastwageall_checkbill = Number(0).toFixed(2);
      } else {
        for (var i = 0; i < this.selectCost.length; i++) {
          if (this.selectCost[i].wageid == data.row.wageid) {
            this.selectCost.splice(i, 1);
          }
        }

        data.row.dwageall = Number(0).toFixed(2);
      }
    },
    changeCostAll(data, index) {
      this.costListData[index].forEach((i, index) => {
        this.changeCost({ row: i, index: index });
      });
    },
    changeJob(data) {
      if (data.row.checked) {
        this.$set(this.costListData, data.index, data.row.wagelist);
      } else {
        this.$set(this.costListData, data.index, []);
      }
    },
    changeJobAll(data) {
      this.jobListData.forEach((i, index) => {
        if (!i.thisListHide) {
          this.changeJob({ row: i, index: index });
        }
      });
    },

    deleteCost(e) {
      console.log();
      this.$confirm("是否继续操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          area: this.area,
          system: this.system,
          billwageidArr: e.billwageid,
          delbillreason: "",
          delbillreasonJson: [],

          accountcomname: this.singleDzData.accountcomname,
          reasontype: ""
        };
        this.$axios({
          method: "delete",
          url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
          data: data
        })
          .then(results => {
            if (results.data.resultstatus != 0) {
              this.$message.error(results.data.resultmessage);
            } else {
              this.$message.success(results.data.resultmessage);
              this.singleDz();
            }
          })
          .catch(error => {});
      });
    },

    singleDz() {
      this.jsValue = [];

      var data = {
        area: this.area,
        system: this.system,
        billid: this.singleDzData.billid
      };
      if (this.wageinout == "1") {
        data.queryType = "wagein";
      }
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchFinishDetail",
        params: data
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无对账信息");
          }

          this.sjcAllData = results.data;
          this.sjcAllData.forEach((item, index) => {
            item.leastwageall_checkbill = Number(
              item.leastwageall_checkbill
            ).toFixed(2);
            this.jsValue.push(index);
            this.sjcAllData[index].jobnolist.forEach((item2, index2) => {
              item2.accountcomname = item.accountcomname;

              item2.firstParentIndex = index + "," + index2;
              item2.leastwageall_checkbill = Number(
                item2.leastwageall_checkbill
              ).toFixed(2);
              item2.realjzt =
                item2.realpiece +
                "/" +
                Number(item2.realweight).toFixed(2) +
                "/" +
                Number(item2.realvolume).toFixed(2);
              item2.hbrq = item2.hbrq.substring(0, 11);
              item2.disabled = true;
              this.sjcAllData[index].jobnolist[index2].wagelist.forEach(
                (item3, index3) => {
                  this.$set(item3, "abandonReason", "");
                  item3.leastwageall_checkbill = Number(
                    item3.leastwageall_checkbill
                  ).toFixed(2);
                  item3.thisfinishwageall_checkbill = Number(
                    item3.thisfinishwageall_checkbill
                  ).toFixed(2);
                  item3.price = Number(item3.price).toFixed(2);
                  item3.finishwageall_checkbill = Number(
                    item3.finishwageall_checkbill
                  ).toFixed(2);
                  item3.realwageall = Number(item3.realwageall).toFixed(2);
                  item3.num = Number(item3.num).toFixed(2);

                  item3.otherwageall = item3.otherwageall
                    ? Number(item3.otherwageall).toFixed(2)
                    : "";
                  item3.realwageallrmb = item3.realwageallrmb
                    ? Number(item3.realwageallrmb).toFixed(2)
                    : "";

                  item3.indexAll = index + "," + index2 + "," + index3;
                  item3.disabled = true;
                }
              );
            });
          });
        })
        .catch(erroe => {});
    },

    //删除对账
    deldz(id, type, index) {
      if (this.addman != localStorage.getItem("usrname")) {
        return this.$message.error("非本人无法操作");
      }
      if (this.singleDzData.billstatus == 1000) {
        return this.$message("已对账无法取消对账");
      } else {
        this.$confirm("是否继续操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //this.$message.success('1212')
            var wageId = "";
            this.jobListData[id].wagelist.forEach(item => {
              wageId += item.billwageid + ",";
              this.cancelCostIndex = id;
            });
            wageId = wageId.substring(0, wageId.length - 1);

            let data = {
              area: this.area,
              system: this.system,
              billwageidArr: wageId,
              delbillreason: "",
              delbillreasonJson: [],
              boguid: this.jobListData[this.cancelCostIndex].boguid,
              accountcomname: this.singleDzData.accountcomname,
              reasontype:
                this.wageinout == "1" ? "应收对账驳回" : "应付对账驳回"
            };
            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
              data: data
            })
              .then(results => {
                if (results.data.resultstatus != 0) {
                  this.$message.error(results.data.resultmessage);
                } else {
                  this.$message.success(results.data.resultmessage);
                  this.singleDz();
                }
              })
              .catch(error => {});
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        //   var wageId=""
        // if(type=='1'){//父
        // this.jobListData[id].wagelist.forEach(item=>{
        //   wageId+=item.billwageid+','
        //   this.cancelCostIndex=id
        // })
        // wageId=wageId.substring(0,wageId.length-1)
        // }
        // this.wageIdS=wageId
        // this.abanDz=true
      }
    },
    reconOpenTrue() {
      if (this.addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      } else {
        this.reconOpen = true;
      }
    },
    cancelDzFw(wageIDS) {
      var abandonReasonLength = 0;
      var delbillreasonJson = [];
      this.jobListData[this.cancelCostIndex].wagelist.forEach(item => {
        abandonReasonLength += item.abandonReason.length;
        delbillreasonJson.push({
          billwageid: item.billwageid,
          delbillreason: item.abandonReason,
          wageguid: item.wageguid
        });
      });
      if (!this.abandonReason && abandonReasonLength == 0) {
        this.$message.error("请填写取消对账原因");
        return false;
      }

      let data = {
        area: this.area,
        system: this.system,
        billwageidArr: wageIDS,
        delbillreason: this.abandonReason,
        delbillreasonJson: delbillreasonJson,
        boguid: this.jobListData[this.cancelCostIndex].boguid,
        accountcomname: this.singleDzData.accountcomname,
        reasontype: this.wageinout == "1" ? "应收对账驳回" : "应付对账驳回"
      };
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus != 0) {
            this.$message.error(results.data.resultmessage);
          } else {
            this.$message.success(results.data.resultmessage);
            this.singleDz();
            this.abanDz = false;
            this.abandonReason = "";
          }
        })
        .catch(error => {});
    },

    closeAbanDz() {
      this.abanDz = false;

      this.abandonReason = "";
      this.jobListData.forEach(item => {
        item.wagelist.forEach(item2 => {
          this.$set(item2, "abandonReason", "");
        });
      });
    },

    changeDirection(type) {
      var clientWidth = 0;
      if (type == 1) {
        this.arrowIndex--;
        if (this.arrowIndex < 0) {
          layer.msg("已至头部");
          this.arrowIndex = 0;
          return false;
        }
      } else if (type == 2) {
        $(".costItemsList")
          .find("li")
          .each(function() {
            clientWidth = clientWidth + $(this).innerWidth();
          });

        if (clientWidth < 710) {
          this.arrowIndex = 0;
          return false;
        } else {
          this.arrowIndex++;
        }

        if (this.arrowIndex > Math.ceil((clientWidth - 710) / 200)) {
          layer.msg("已至尾部");
          this.arrowIndex = Math.ceil((clientWidth - 710) / 200);
          return false;
        }
      }

      $(".costItemsList").css(
        "transform",
        "translateX(-" + this.arrowIndex * 200 + "px)"
      );
    },

    //设置对账中
    dzing() {
      if (this.addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }
      var billstatus = "";
      var data = {};
      if (this.singleDzData.billstatus == 900) {
        billstatus = 1000;
        //this.billstatusString = 1000;
        this.reconOpen = true;
      } else if (this.singleDzData.billstatus == 1000) {
        billstatus = 900;
        //this.billstatusString = 900;
      }

      if (billstatus == 1000) {
        data = {
          area: this.area,
          id: this.singleDzData.billid,
          billstatus: billstatus,
          wageinout: this.singleDzData.wageinout,
          confirmman: this.reconInfo.confirmman,
          confirmdate: this.reconInfo.confirmdate,
          confirmremark: this.reconInfo.confirmremark
        };

        if (!data.confirmdate) {
          this.$message.error("客户对账时间不能为空");
          return false;
        }
      } else if (billstatus == 900) {
        data = {
          area: this.area,
          id: this.singleDzData.billid,
          billstatus: billstatus,
          wageinout: this.singleDzData.wageinout
        };
      }

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            if (billstatus == 1000) {
              this.singleDzData.billstatus = 1000;
              this.reconInfo.confirmman = "";
              this.reconInfo.confirmdate = "";
              this.reconInfo.confirmremark = "";
              this.billstatusString=900;
              this.reconOpen = false;
            } else if (billstatus == 900) {
              this.singleDzData.billstatus = 900;
              this.billstatusString=1000;
            }
            this.$message.success(results.data.resultmessage);
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },
    // 删除对账
    cancelDz() {
      if (this.addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }
      var status = 0;

      var finishwageall_pz = 0;
      this.sjcAllData.forEach(item => {
        finishwageall_pz += Number(item.thisfinishwageall_pz);
      });

      if (finishwageall_pz > 0) {
        this.$message("已开凭证无法删除");
        status = 0;
      } else {
        this.cancelDzF();
      }
    },
    // 取消对账方法
    cancelDzF() {
      this.$confirm("是否取消对账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var billWageId = this.costListData
            .flat()
            .map(i => i.billwageid)
            .join(",");

          var data = {
            area: this.area,
            system: this.system,
            billid: this.singleDzData.billid,
            accountcomname: this.singleDzData.accountcomname,
            billwageidArr: billWageId
          };

          this.$axios({
            method: "delete",
            url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
            data: data
          })
            .then(results => {
              if (results.data.resultstatus == 0) {
                this.$message.success(results.data.resultmessage);
                this.abanDz = false;
                this.delete = true;
                this.back();
              } else {
                this.$message.error(results.data.resultmessage);
              }
            })
            .catch(error => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //返回
    back() {
      this.$emit("closeDialog", {
        show: false,
        tableSelectIndex: this.tableSelectIndex,
        billstatusString: this.billstatusString
      });
    },

    addDeleteDz() {
      this.addDelDz = true;
      this.addDelId = this.singleDzData.billid;
      this.billstatus = this.singleDzData.billstatus;

      this.addDelTitle = this.singleDzData.pchno;
      this.accountcomname = this.singleDzData.accountcomname;
      this.accountcomgid = this.singleDzData.accountcomgid;
    },

    async mawbDetail(row, type = 1) {
      console.log("===============000=========================")
      console.log(this.selectCost);
      console.log("===============000=========================")

      if(row.thisfinishwageall_checkbill != row.realwageall){
        this.$message({
          message:"有部分费用已对账不允许驳回！",
          type:"error"
        })
        return false
      }
      console.log("===============000=========================")
      console.log(this.selectCost);
      console.log("===============000=========================")
      if (this.selectCost && this.selectCost.length > 0) {
        if(this.selectCost.some(item => item.thisfinishwageall_checkbill !== item.realwageall )){
          return  this.$message({
          message:"有部分费用已对账不允许驳回！",
          type:"error"
        })
        }
      }
      //多选2、单选1
      let boguid = type == "2" ? row[0].jobid : row.jobid;
      if (
        type == 2 &&
        row
          .filter(i => i.checked)
          .some(i => i.system != "空出" || i.wagedom == "调账" || i.isshare > 0)
      )
        return this.$message.error("非空出订单费用无法驳回");
      await this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: { boguid: boguid },
        loading: true,
        tip: false
      }).then(result => {
        this.allmaindata = result.data;
      });
      if (type == "2") {
        //console.log(row)
        this.getBohuiWageDetail(
          row.filter(i => i.checked),
          2
        );
      } else {
        this.getBohuiWageDetail(row);
      }
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

      let confirm = await this.$confirm("请确认操作", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      });
      if (!confirm) return;
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/WageReject/Reject",
        loading: true,
        data: editlist
      }).then(res => {
        if (res.data.resultstatus == 0) {
          this.$message.success(res.data.resultmessage);
          this.bohuiVisible = false;
          this.singleDz();
        } else {
          this.$message.error(res.data.resultmessage);
        }
      });
    },
    mawbChargeBohuiChecked(wagelist) {
      //return false
      if (
        wagelist.filter(
          i =>
            i.checked && (i.status == -1 || i.status == 500) && i.isshare <= 0
        ).length
      ) {
        return false;
      } else {
        return true;
      }
    },
    addBohui(boguid, index) {
      if (!this.mawbObject[boguid]) {
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: {
            boguid: boguid
          },
          loading: true,
          tip: false
        })
          .then(results => {
            this.mawbDetil = results.data;
            this.bohuiAddDialog = true;
            this.bohuiAddIndex = index;
            this.mawbObject[boguid] = results.data;
          })
          .catch(error => {});
      } else {
        this.mawbDeti = this.mawbObject[boguid];
        this.bohuiAddDialog = true;
        this.bohuiAddIndex = index;
      }
    },
    addBohuiList(data) {
      this.costListData[this.bohuiAddIndex].push(data);
    }
  },
  watch: {
    singleDzData: {
      handler(val) {
        this.reconInfo.confirmman = val.confirmman ? val.confirmman : "";
        this.reconInfo.confirmdate =
          val.confirmdate && val.confirmdate.indexOf("1900") == -1
            ? val.confirmdate.replace(/-/g, "/")
            : "";
      },
      immediate: true
    },
    order: {
      handler(val) {
        console.log(val);
      }
    },
    jsValue: {
      handler(val) {
        var resultsData = [];
        if (val.length > 0) {
          val.forEach(item => {
            var concatData = this.sjcAllData[item].jobnolist;
            resultsData = resultsData.concat(concatData);
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.costDetail {
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
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
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .detail-c {
      padding: 20px;
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
      .color-green {
        color: green;
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
}

.reason {
  h3 {
    font-size: 18px;
    color: #004d84;
  }
  .el-dialog__body {
    padding: 8px 40px;
  }
  .orderNo {
    margin-top: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    margin-bottom: 12px;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  ul li {
    display: inline-block;
    width: 100px;
    text-align: left;
    color: #999;
  }
  .costItems {
    margin-top: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    overflow: hidden;
    li {
      display: inline-block;
      cursor: pointer;
      padding-right: 16px;
      width: auto;
      &:hover {
        color: #004d84;
      }
      /deep/.el-badge__content.is-fixed.is-dot {
        right: 2px;
      }
      /deep/.el-badge__content.is-fixed {
        top: 3px;
        transform: translateY(-46%) translateX(100%);
      }
      /deep/.el-badge {
        vertical-align: inherit;
      }
    }

    .el-icon-caret-left {
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: #004d84;
      }
    }
    .el-icon-caret-right {
      font-size: 16px;
      cursor: pointer;
      margin-left: -8px;
      &:hover {
        color: #004d84;
      }
    }
  }
}
</style>
