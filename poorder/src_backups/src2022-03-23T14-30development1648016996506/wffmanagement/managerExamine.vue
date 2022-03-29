<template>
  <div class="managerExamine">
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync="newFormCmptShow" :pagetype="1" @reset="reset"></newSearchComp>
      <div class="searchForm">
        <el-button @click="search" type="primary">查询</el-button>
        <!-- <el-button @click="reset" type="primary">重置</el-button> -->
        <!-- <el-button @click="examinePage" type="primary">该页全部审核</el-button> -->
        <el-button @click="examinePage" type="primary">批量审核</el-button>
      </div>
    </div>
    <!-- {{czlxOptionsBackup}} -->
    <tableCompt :name="name" :table-data-res="tableDataRes" @pageChange="tablePageChange" class="tableCompt"
      @openManagerDetail="openDetail">
      <template slot="showTotal">
        <div class="totalInfo">
          <div style="width:100px">
            <span class="totalInfo-title">票数</span>
            <span class="totalInfo-content">{{tableDataRes.length}}票</span>
          </div>
          <div style="width:100px">
            <span class="totalInfo-title">结算重量</span>
            <span class="totalInfo-content">{{ tableDataTotal.accountweightin_sett || 0 }}</span>
          </div>
          <template v-for="(item, index) in tableDataTotal.allCurrencyWagein">
            <div :style="{width: tableDataTotal.allCurrencyWagein.length == index+1 ? '150px' : '120px'}"
              :key="index + '含税应收'">
              <span class="totalInfo-title">{{ item.currencyCN }}含税应收</span>
              <span class="totalInfo-content" style="color: #00cc00;">{{ item.money }}</span>
            </div>
          </template>
          <template v-for="(item, index) in tableDataTotal.allCurrencyWageout">
            <div :style="{width: tableDataTotal.allCurrencyWageout.length == index+1 ? '150px' : '120px'}"
              :key="index + '含税应付'">
              <span class="totalInfo-title">{{ item.currencyCN }}含税应付</span>
              <span class="totalInfo-content" style="color: #ff3300;">{{ item.money }}</span>
            </div>
          </template>
          <div style="width:150px">
            <span class="totalInfo-title">盈利（折合人民币）</span>
            <span class="totalInfo-content">￥: {{ tableDataTotal.realprofitrmb || 0 }}</span>
          </div>
          <div style="width:150px">
            <span class="totalInfo-title">平均每公斤毛利</span>
            <span class="totalInfo-content">￥: {{ tableDataTotal.each_weight_average || 0 }}</span>
          </div>
        </div>
      </template>
      <template slot="operate" slot-scope="props">
        <p style="text-align: left;">
          <operateIcon :iconClass="'el-icon-success'"
            :disabled="props.data.row.dzstatus == '1200' || props.data.row.examineisback_sett == 2||props.data.row.isLockApproval||props.data.row.wagerejectstatusin=='200'||props.data.row.wagerejectstatusout=='200'||props.data.row.wagerejectstatusin=='100'||props.data.row.wagerejectstatusout=='100'"
            :title="'通过'" @click="examine(props.data.row, props.data.index)"></operateIcon>
          <!--           <operateIcon :iconClass="'el-icon-error'"
            :disabled="props.data.row.dzstatus == '1200' || props.data.row.examineisback_sett == 2" :title="'驳回'"
            @click="openDetail(props.data.row, props.data.index,3)"></operateIcon> -->
          <!-- 因为弹窗里面要显示infolist,所以走了openDetail去获取改订单的详细数据 -->
          <operateIcon v-if="props.data.row.wagedom == '调账'" :iconClass="'el-icon-document'" :title="'调账分配列表'"
            @click="assignList(props.data.row);openDetail(props.data.row, props.data.index,4)"></operateIcon>
            <span v-if="props.data.row.wagedom !== '调账'" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span v-if="props.data.row.wagedom === '调账'" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            
            <el-badge is-dot class="item" v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "       :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
                <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
            </el-badge>
        </p>
      </template>

      <template slot="jobno" slot-scope="props">
        <span :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
          @click="openDetail(props.data.row, props.data.index,1)">{{ props.data.row.jobno }}</span>
      </template>

      <template slot="dzstatus" slot-scope="props">{{ transDzstatus(props.data.value) }}</template>

      <template slot="examineisback_sett" slot-scope="props">{{ transExamineisback_sett(props.data.value) }}</template>


      <template slot="realwageinrmb" slot-scope="props">
        <span v-html="formatStyle(props.data.value)" style="color:#0AAF02;min-width: 100px;display:inline-block"></span>
        <!-- <span
          :class="(props.data.row.wagerejectstatusin==100||props.data.row.wagerejectstatusin==200||props.data.row.wagerejectstatusin==500)?'el-icon-shenhebohui':'el-icon-meiyuan'"
          :title="wagerejectstatusTitle(props.data.row.wagerejectstatusin,1)" style="font-size:16px;cursor:pointer"
          :style="wagerejectstatusTitle(props.data.row.wagerejectstatusin,1,2)"
          @click="openDetail(props.data.row, props.data.index,2)">
        </span> -->
      </template>

      <template slot="realwageoutrmb" slot-scope="props">
        <span v-html="formatStyle(props.data.value)" style="color:#EE3A3A;min-width: 100px;display:inline-block"></span>
        <!-- <span
          :class="(props.data.row.wagerejectstatusout==100||props.data.row.wagerejectstatusout==200||props.data.row.wagerejectstatusout==500)?'el-icon-shenhebohui':'el-icon-meiyuan'"
          :title="wagerejectstatusTitle(props.data.row.wagerejectstatusout,2)" style="font-size:16px;cursor:pointer"
          :style="wagerejectstatusTitle(props.data.row.wagerejectstatusout,2,2)"
          @click="openDetail(props.data.row, props.data.index,2)">
        </span> -->

      </template>

      <template slot="realwage_profitrmb" slot-scope="props">
        <span v-html="transProfit(props.data.row)" style="display:inline-block;min-width:100px"></span>
        <!--  <span style="cursor:pointer" class="el-icon-document" title="打开经理审核费用明细"
          @click="openDetail(props.data.row, props.data.index,2)"></span> -->

        <span
          :class="(([100,200,500].includes(props.data.row.wagerejectstatusin)||[100,200,500].includes(props.data.row.wagerejectstatusout))&&props.data.row.tzType!='单票')?'el-icon-shenhebohui':'el-icon-meiyuan'"
          :title="wagerejectstatusTitle({row:props.data.row,tzType:props.data.row.tzType})"
          style="font-size:16px;cursor:pointer"
          :style="wagerejectstatusTitle({row:props.data.row,type:2,tzType:props.data.row.tzType})"
          @click="openDetail(props.data.row, props.data.index,2)">
        </span>
        <!-- 
          <span class="el-icon-shenhebohui" style="font-size:16px;cursor:pointer;margin-left:10px;" @click="openDetail(props.data.row, props.data.index,2,props.data.row.tzType)" v-if="props.data.row.tzType=='单票'" :style="wagerejectstatusTitle({status:props.data.row.wagerejectstatusin,wageinout:1,type:2})" :title="wagerejectstatusTitle({status:props.data.row.wagerejectstatusin,wageinout:1})"
          >
            
          </span> -->
      </template>

      <template slot="each_weight" slot-scope="props">
        <span v-html="formatStyle(props.data.value)"></span>
      </template>

      <template slot="accountweightin_sett" slot-scope="props">{{ Number(props.data.value).toFixed(1) }}</template>

      <template slot="real_hbrq" slot-scope="props">{{ formatDate(props.data.value).substr(0, 10) }}</template>

      <template slot="profitmode" slot-scope="props">{{ props.data.value || '本站' }}</template>

      <template slot="submitdate_2_sett" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="submitdate_out_sett" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="examinedate_sett" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="qfsj" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="issett" slot-scope="props">{{ props.data.value == '1' ? '是' : '否' }}</template>

      <template slot="settdate" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="settsysdate" slot-scope="props">{{ formatDate(props.data.value) }}</template>

      <template slot="billstatus_in" slot-scope="props">{{ transBillstatus(props.data.value) }}</template>

      <template slot="billstatus_out" slot-scope="props">{{ transBillstatus(props.data.value) }}</template>

      <template slot="billstatus_out" slot-scope="props">{{ transBillstatus(props.data.value) }}</template>
    </tableCompt>



    <component :is="childrenComponent" v-if="OrderVisible"></component>

    <!-- <el-dialog title="经理审批" :visible.sync="OrderVisible" v-if="OrderVisible" :close-on-press-escape="false" :close-on-click-modal="false"
      class="dialogPage" width="100%" top="20px" :modal="false" center>
      <div v-if="listBillChangeJob.length">
        <infoList style="margin-bottom:25px" v-if="ponoDetail&&ponoDetail.guid" :inputModelData="ponoDetail"
          :pono="listbillCheckedRow.basicInfo&&listbillCheckedRow.basicInfo.jobno" name="详细">
          <template slot="exinfo">
            <div class="showpaneinfo" style="width:100%">
              <div>
                <span>销售员：</span>
                <span>{{ponoDetail.salesname||'--'}}</span>
              </div>
              <div>
                <span>单证状态：</span>
                <span>{{ponoDetail.dzstatusCn }}</span>
              </div>
              <div>
                <span>审单人：</span>
                <span>{{ponoDetail.submitman_2_sett}}</span>
              </div>
              <div>
                <span>审单日期：</span>
                <span>{{ponoDetail.submitdate_2_sett}}</span>
              </div>
            </div>
          </template>
        </infoList>
        <commonTabs :list="listBillChangeJob" :checkedIndex.sync="listBillChecked" titlefield="billno"
          :opendIndex.sync="listBillOpened">
          <template v-for="(item,index) in listBillChangeJob">
            <managerDetailTz v-if="listBillOpened.includes(index)" :showListInfo="false"
              :listBillChangeJob="listBillChangeJob" :listBillChecked="listBillChecked"
              :showBtnfoot="listBillOpened[0]==index" v-show="index==listBillChecked"
              :listbillCheckedRow.sync="listbillCheckedRow" :id="item.billsid" :jobnosid="item.jobnosid"
              :visible.sync="OrderVisible" :wagedom="item.billwagedom" :area="cur_area"
              @dzstatusChange="status => {cur_row.dzstatus = status}" @backOrder="removeOrderFromTable(cur_rowindex)"
              ref="listBohui" initiator="40">
            </managerDetailTz>
          </template>
        </commonTabs>
      </div>
      <managerDetail v-if="listBillChangeJob.length==0" :id="cur_id" :wagedom="cur_wagedom" :area="cur_area"
        :visible.sync="OrderVisible" @dzstatusChange="status => {cur_row.dzstatus = status}" initiator="40"
        @backOrder="removeOrderFromTable(cur_rowindex)" :wageRejectin="wageRejectin" :wageRejectout="wageRejectout">
      </managerDetail>
    </el-dialog> -->



    <el-dialog title="调账分配列表" :visible.sync="assignListVisible" :close-on-press-escape="false" width="1300px" top="10%"
      custom-class="assignList-dialog" center>
      <infoList :inputModelData="ponoDetail" style="margin-top:10px" :pono="cur_row.jobno" name="详细"></infoList>

      <div class="assignList">
        <div class="wage_content wagein">
          <div class="header">
            <div class="title">应收分摊工作号</div>
            <div class="header-right">
              <p>共 {{ assignWageList.wageinList.length }} 条记录</p>
            </div>
          </div>
          <div class="content">
            <commonTable class="commonTable" :head="assignlist_table_model" :table-data="assignWageList.wageinList">
              <template slot="hbrq" slot-scope="props">{{ props.data.value.includes('1900-01-01') ? '' :
                props.data.value.split('T')[0] }}</template>
              <template slot="wageall" slot-scope="props">{{ props.data.value.toFixed(2) }}</template>
            </commonTable>
          </div>
        </div>

        <div class="wage_content wageout">
          <div class="header">
            <div class="title">应付分摊工作号</div>
            <div class="header-right">
              <p>共 {{ assignWageList.wageoutList.length }} 条记录</p>
            </div>
          </div>
          <div class="content">
            <commonTable class="commonTable" :head="assignlist_table_model" :table-data="assignWageList.wageoutList">
              <template slot="hbrq" slot-scope="props">{{ props.data.value.includes('1900-01-01') ? '' :
                props.data.value.split('T')[0] }}</template>
              <template slot="wageall" slot-scope="props">{{ props.data.value.toFixed(2) }}</template>
            </commonTable>
          </div>
        </div>

        <div class="btn">
          <el-button @click="assignListVisible = false">返回</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="综合查询" v-if="dialogPono" center :visible.sync="dialogPono" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogPono" :pagetype="20" :boguid="ponoDetail.boguid" :area="ponoDetail.area"
        :mawbguid="ponoDetail.guid" :orderdom="ponoDetail.orderdom"></mawbaddput>
    </el-dialog>

    <el-dialog width="1300px" top="4%" center :visible.sync="backOrderVisible" v-if="backOrderVisible" append-to-body
      custom-class="reason">
      <div>
        <h3>驳回原因</h3>
        <!-- <p class="orderNo">
          <span>{{ cur_row.jobno }}</span>
        </p>
        <ul>
          <li>总运单号</li>
          <li>始发港</li>
          <li>目的港</li>
          <li>航班号</li>
          <li>航班日期</li>
        </ul>
        <ul style="margin-top:3px;">
          <li>{{ cur_row.mawb }}</li>
          <li>{{ cur_row.sfg }}</li>
          <li>{{ cur_row.mawbmdg }}</li>
          <li>{{ cur_row.real_hbh }}</li>
          <li>{{ cur_row.real_hbrq | dateFormat }}</li>
        </ul>-->
        <infoList :inputModelData="ponoDetail" style="margin-top:10px" :pono="cur_row.jobno" name="详细"></infoList>

        <el-input type="textarea" v-model="backOrderReason" class="input-required" :autosize="{minRows:4}"
          style="margin-top:12px;color:#c8c8c8" placeholder="驳回原因输入框"></el-input>

        <p style="margin-top:18px;text-align:right">
          <el-button type="primary" @click="backOrder">确定</el-button>
          <el-button @click="backOrderVisible = false">取消</el-button>
        </p>
      </div>
      <!--  <cancelReason :jobData="cur_row" :abandonReason.sync="backOrderReason" :pagetype="1">
                <template slot='footerBtngroup'>
                       <el-button type="primary" @click="backOrder">确定</el-button>
                    <el-button @click="backOrderVisible=false;cur_rowindex=-1;backOrderReason=''">取消</el-button>
                </template>
      </cancelReason>-->
    </el-dialog>
  </div>
</template>

<script>
  import { getChangeValue, getCzlxOptionBySystem,formatDate } from "../api/localStorage.js";
  import managerDetail from "./orderDetail/managerDetail";
  import managerDetailTz from "./orderDetail/managerDetailTz";
  import { searchCmptMixins, renderHtml } from "@/components/mixins/topPageMixin";
  import {getOrderInfo} from "@/api/order.js"

  let operateIcon = {
    template: `
        <i :class="[iconClass, {'disabled': disabled}]" :title="title" @click="clickFn"></i>
      `,
    props: {
      iconClass: String,
      title: String,
      disabled: {
        type: Boolean,
        default: () => false
      }
    },
    methods: {
      clickFn() {
        if (!this.disabled) {
          this.$emit("click", true);
        }
      },
      
    }
  };



  var parentComponent = {
    name: "managerExamine",
    components: {
      managerDetail,
      managerDetailTz,
      operateIcon,
    },
    filters: {
      dateFormat(date) {
        if (date.includes("1900")) return "";
        return new Date(date).Format("yyyy-MM-dd");
      }
    },
    mixins: [searchCmptMixins],
    data() {
      return {
        name: "managerExamine.vue",
        cur_id: "",
        cur_wagedom: "",
        cur_area: "",
        cur_row: {},
        cur_rowindex: -1,
        OrderVisible: false,
        backOrderVisible: false,
        backOrderReason: "",
        assignListVisible: false,
        dialogPono: false,
        ponoDetail: {},
        tableDataRes: [],
        tableDataTotal: {
          allCurrencyWagein: [
            { currencyCN: "人民币", currencyFuHao: "￥:", money: 0 }
          ],
          allCurrencyWageout: [
            { currencyCN: "人民币", currencyFuHao: "￥:", money: 0 }
          ]
        },

        tablePageStartIndex: 0,
        tablePageEndIndex: 0,
        // viewDataBasicField: [
        //   ['jobno', 'mawb', 'hawb', 'fid', 'gid', 'dzstatus'],
        //   [
        //     "orderno", "profitmode", "real_hbh", "real_hbrq", "sfg", "mawbmdg", "czlx", "hwxz", "hwlx", "profitmode",
        //     "pcstatus", "bgstatus", "salesname", "customername", "areaname",'system'
        //   ]
        // ],
        inputViewData: {
          jobno: { title: "订舱编号", type: 1, whereStr: "like" },
          mawb: { title: "总运单号", type: 1, whereStr: "like" },
          hawb: { title: "分运单号", type: 1, whereStr: "like" },
          orderno: { title: "订单来源号", type: 1, whereStr: "like" },
          fid: { title: "委托客户", type: 14 },
          gid: { title: "项目", type: 13 },
          // salesarea: {title:'订单销售站', type:23, groupid:101, whereStr:'in'},
          // comhy: {title:'所属行业', type:5, whereStr:"in", groupid:89},
          real_hbh: {
            title: "航班号",
            type: 1,
            whereStr: "like",
            verify: "uppercase"
          },
          real_hbrq: { title: "航班日期", type: 15, defaultVal: false },
          hbrq: { title: "航班日期", type: 15, defaultVal: false },
          sfg: {
            title: "始发港",
            type: 1,
            whereStr: "like",
            verify: "uppercase"
          },
          mawbmdg: {
            title: "目的港",
            type: 1,
            whereStr: "like",
            verify: "uppercase"
          },
          czlx: { title: "操作类型", type: 5, groupid: 132, whereStr: "in" },
          hwxz: { title: "货物性质", type: 21, groupid: 115 },
          hwlx: { title: "货物类型", type: 22 },
          dzstatus: {
            title: "单证状态",
            type: 5,
            whereStr: "in",
            options: [
              { label: "未审核", value: "800" },
              { label: "已审核", value: "1200" }
            ]
          },
          pcstatus: {
            title: "配舱状态",
            type: 5,
            dom: "配舱状态",
            whereStr: "in"
          },
          bgstatus: {
            title: "报关状态",
            type: 5,
            dom: "报关状态",
            whereStr: "in"
          },
          // hwstatus:{'title':'货物状态',type:5,dom:'货物状态',"whereStr":"in"},
          salesname: { title: "销售员", type: 1, whereStr: "like" },
          customername: { title: "客服负责人", type: 1 },
          areaname: { title: "航线分区", type: 5, whereStr: "in", options: [] },
          system: {
            title: "所属系统",
            type: 5,
            whereStr: "in",
            options: [],
            hidden: true
          } // groupid: 57
        },
        czlxOptionsBackup: [],
        newFormCmptShow: true,
        inputModelData: {
          dzstatus: "800",
          czlx: ""
        },
        searchData: {},

        assignWageList: {
          wageinList: [],
          wageoutList: []
        },
        assignlist_table_model: [
          { field: "jobno", title: "工作号" },
          { field: "mawb", title: "总运单号" },
          { field: "hbh", title: "航班号" },
          { field: "hbrq", title: "航班日期" },
          { field: "mawbmdg", title: "总运单目的港" },
          { field: "areaname", title: "航线" },
          { field: "wageall", title: "分摊总额" }
        ],
        currencyFuHao: {
          人民币: "￥:",
          港币: "HK$:",
          美元: "$:",
          欧元: "€:",
          日元: "¥:",
          英镑: "￡:"
        },
        listBillChangeJob: [//关联的调账
        ],
        listBillChangeJobWage: {},//关联的调账的费用
        listBillChecked: 0,//选中的tab索引
        listbillCheckedRow: {},//选中的tab数据
        listBillOpened: [],//已经打开过的tab
        wageRejectin: false,
        wageRejectout: false,
        childrenComponent: {},
        initiator:'40'
      };
    },
    created() {
      // 获取所属系统权限
      let ssxt_auth = JSON.parse(sessionStorage.nav).filter(item => {
        // type等于5并且autcode包含所属系统字符串
        if (
          item.type == 5 &&
          item.autcode.includes("SSXT") &&
          item.autname !== "主体"
        ) {
          return true;
        }
        return false;
      });
      this.inputViewData.system.options = ssxt_auth.map(i => ({
        label: i.autname,
        value: i.autname
      }));

      this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubWffArea",
        params: { area: "" },
        loading: false,
        tip: false
      }).then(result => {
        if (result.data.length != 0) {
          this.inputViewData.areaname.options = result.data.map(i => {
            return { label: i.Areaname, value: i.Areaname };
          });
        }
      });

      // this.$axios({
      //   method: "get",
      //   url: this.$store.state.wcWebApi + "api/OperaType",
      //   params: {},
      //   loading: false,
      //   tip: false
      // }).then(result => {
      //   if (result.data.length != 0) {
      //     this.czlxOptionsBackup = result.data.map(i => {
      //       return { label: i.typename, value: i.typename };
      //     });
      //     this.inputViewData.czlx.options = this.czlxOptionsBackup;
      //   }
      // });

      this.czlxOptionsBackup = JSON.parse(localStorage.groupTypeCode)[132].map(i => {
        return { label: i.typename, value: i.ready01 };
      });
      this.inputViewData.czlx.options = this.czlxOptionsBackup;

      // this.$axios({method:'get',url:this.$store.state.wcWebApi+'api/ProductType',params: {},loading:false,tip:false})
      // .then(result => {
      //   if (result.data.length != 0) {
      //     this.inputViewData.khnamebase.options = result.data.map(i => {
      //       return {label: i, value: i}
      //     })
      //   }
      // })


      // console.log(2)
      // let resultdic=window.opener&&window.opener.resultdicWffmanagement&&window.opener.resultdicWffmanagement.resultdic
      // Object.keys(resultdic).forEach((i,k)=>{
      //   console.log(i)
      //   if(i=='real_hbrq'){
      //   this.inputViewData.real_hbrq={title: "航班日期", type: 15, defaultVal: false,defaultEnd:false}
      //       this.inputModelData.real_hbrq = {
      //             begin:
      //               new Date(resultdic.hbrq.begin).Format("yyyy-MM-dd") || "",
      //             end: new Date(resultdic.hbrq.end).Format("yyyy-MM-dd") || ""
      //           };
      //   }
      // })

      this.$nextTick(() => {
        this.inputViewData.confirmdate.title = "费用确认日期"
        this.inputViewData.confirmdate.defaultVal = false
      })

    },
    beforeMount() {

    },
    mounted() {
      this.childrenComponent = renderHtml.call(
        this,
        parentComponent,
        1,
        {
          title:'经理审批'
        }
      );
    },
    watch: {
      // 根据所属系统字段动态显示操作类型
      "$store.state.systemCheck"(newVal) {
        // console.log(newVal)
        //       空出、海出、陆出 、铁出 - 自货、代操作
        // 空进 - 空进
        // 海进 - 海进
        // 陆进 - 陆进
        // 铁进 - 铁进
        // 国内服务 - 国内服务

        if (!newVal) {
          return (this.inputViewData.czlx.options = this.czlxOptionsBackup);
        }

        this.inputViewData.czlx.options = [];
        let optionArr = getCzlxOptionBySystem(newVal.split(","));
        this.czlxOptionsBackup.forEach(option => {
          if (optionArr.includes(option.value)) {
            this.inputViewData.czlx.options.push(option);
          }
        });
      },
      backOrderVisible(val) {
        if (val) this.backOrderReason = "";
      }
    },
    computed: {
    },
    methods: {
      search() {
      console.log(this.searchData)
       if (this.searchData.real_hbrq&&this.searchData.real_hbrq.begin) {
          let begin = new Date(this.searchData.real_hbrq.begin);
          console.log(begin)
          begin.setMonth(begin.getMonth() - 3);
          console.log(begin)
          this.searchData.adddata={
            'begin':formatDate(begin, "yyyy-MM-dd") + " 00:00:00"
          }
          //this.$set(this.searchData.adddate,'begin',formatDate(begin, "yyyy-MM-dd") + " 00:00:00")

      }

        this.searchData.selece = "boguid,guid"

        var jsonArr2 = {
          where: this.searchData,
          order: "real_hbrq asc,jobno asc"
        };

        jsonArr2.where.examineisback_sett = { unequal: 2 };

        // 如果未选择所属系统选项 则只传有权限的值
        if (!jsonArr2.where.system) {
          jsonArr2.where.system = {
            in: this.inputViewData.system.options.map(i => i.value).join(",")
          };
        }

        var json = { json: JSON.stringify(jsonArr2) };

        this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/GetCheckOrderList",
          params: json,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.data.length == 0) {
            this.$message("无查询结果");
          }

          // this.tableDataRes = getChangeValue(results.data.data, '空出')
          this.tableDataRes = results.data.data.map(row => {
            row.wtkhname = row.wtkhname ? row.wtkhname.split("-")[1] : "";
            row.accountstatus = this.transAccountstatus(row.accountstatus);
            row.pcstatus = this.transPcstatus(row.pcstatus);
            row.bgstatus = this.transBgstatus(row.bgstatus);

            if (row.profitmode && row.profitmode.indexOf("Co-Load") != "-1") {
              if (row.service_currency) {
                let currencyData = JSON.parse(
                  localStorage.getItem("currencyData")
                );
                for (let m in currencyData) {
                  if (currencyData[m].cname == row.service_currency) {
                    row.service_currency = currencyData[m].fcode;
                  }
                }
                row.profitquota =
                  Number(row.service_profitprice).toFixed(2) +
                  row.service_currency;
              } else {
                row.profitquota = "--";
              }
            }

            if (row.profitmode && row.profitmode.indexOf("利润") != "-1") {
              if (row.pono && row.pono.indexOf("-") >= 0) {
                row.profitquota =
                  Number(row.self_profitvalue).toFixed(0) +
                  "(" +
                  row.pono.split("-")[0].substr(-3) +
                  ")/" +
                  Number(row.cus_profitvalue).toFixed(0) +
                  "(" +
                  row.pono.split("-")[1] +
                  ")";
              } else if (row.pono && row.pono.indexOf("(") >= 0) {
                row.profitquota =
                  Number(row.self_profitvalue).toFixed(0) +
                  "(" +
                  row.pono.split("(")[0].substr(-3) +
                  ")/" +
                  Number(row.cus_profitvalue).toFixed(0) +
                  "(" +
                  row.pono.split("(")[1].substr(0, 3) +
                  ")";
              } else {
                row.profitquota =
                  Number(row.self_profitvalue).toFixed(0) +
                  "/" +
                  Number(row.cus_profitvalue).toFixed(0);
              }
            }

            return row;
          });
          this.formatTableData(results.data.total);

          setTimeout(() => {
            this.newFormCmptShow = false;
          }, 100);
        });
      },
      openChatRoome(row){
        console.log(row.boguid)
        getOrderInfo(row.boguid)
        .then(res => {
        if (res.data) {
            this.$store.commit("setChat", { status: true, data: res.data });
        }
    })
        .catch(errors => {});
      },
    
      // 计算部分字段数据
      formatTableData(total = null) {
        let calculationTotal = false;
        if (!total) {
          // 如果total为空则重新计算total各字段的值
          total = {
            count: this.tableDataRes.length,
            accountweightin_sett: 0, // 结算重量
            cnywagein: 0, // 人民币应收
            cnywageout: 0, // 人民币应付
            eurwagein: 0, // 欧元应收
            eurwageout: 0, // 欧元应付
            hkdwagein: 0, // 港币应收
            hkdwageout: 0, // 港币应付
            usdwagein: 0, // 美元应收
            usdwageout: 0, // 美元应付
            realprofitrmb: 0 // 总盈利
          };
          calculationTotal = true;
        }

        // let zh_profit_total = 0, zh_weight_total = 0

        this.tableDataRes.forEach(row => {
          // 含税盈利   将小数转换成整数 保证计算准确度
          row.realwage_profitrmb =
            (Number(row.realwageinrmb * 100) - Number(row.realwageoutrmb * 100)) /
            100;
          row.realwage_profitrmb = Number(row.realwage_profitrmb.toFixed(2));
          // 每公斤毛利
          if (row.accountweightin_sett == 0) {
            row.each_weight = 0;
          } else {
            row.each_weight = (
              (row.realwage_profitrmb * 100) /
              (row.accountweightin_sett * 100)
            ).toFixed(2);
          }
          // if (row.czlx == '自货') {
          //   zh_profit_total += Number(row.realwage_profitrmb)
          //   zh_weight_total += Number(row.accountweightin_sett)
          // }

          // 件重体
          let arr = row.storeinfo.split("|");
          row.pieceweightheight = `${arr[0]}/${arr[1]}/${arr[2]}`;

          // 删除列表某一条数据时需要重新计算total
          if (calculationTotal) {
            total.accountweightin_sett += row.accountweightin_sett;
            total.cnywagein += row.cny_wagein;
            total.cnywageout += row.cny_wageout;
            total.eurwagein += row.eur_wagein;
            total.eurwageout += row.eur_wageout;
            total.hkdwagein += row.hkd_wagein;
            total.hkdwageout += row.hkd_wageout;
            total.usdwagein += row.usd_wagein;
            total.usdwageout += row.usd_wageout;
            total.realprofitrmb += row.realwage_profitrmb;
          }
        });

        this.tableDataTotal = total;
        // 平均每公斤毛利
        if (this.tableDataTotal.accountweightin_sett == 0) {
          this.tableDataTotal.each_weight_average = 0;
        } else {
          this.tableDataTotal.each_weight_average = (
            this.tableDataTotal.realprofitrmb /
            this.tableDataTotal.accountweightin_sett || 0
          ).toFixed(2);
        }

        this.tableDataTotal.accountweightin_sett = this.tableDataTotal.accountweightin_sett.toFixed(
          1
        );
        this.tableDataTotal.allCurrencyWagein = this.getAllCurrencyWageinout(
          "in"
        );
        this.tableDataTotal.allCurrencyWageout = this.getAllCurrencyWageinout(
          "out"
        );
        this.tableDataTotal.realprofitrmb = this.tableDataTotal.realprofitrmb.toFixed(
          2
        );
      },
      async getTzList(data) {//获取调账列表
        return await this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/GetChangeBill",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          this.listBillChangeJob = result.data.tzinfo
          this.listBillChangeJobWage = result.data.wageinfo
          // this.$nextTick(() => {
          this.listBillChecked = this.listBillChangeJob.findIndex(i => i.billno == this.cur_row.jobno)



          // })
          return result.data
        })
      },
      async getmawbdetail(boguid) {//获取调账列表
        if (boguid == -1) return false
        return await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: boguid },
          loading: true,
          tip: false
        }).then(result => {
          return result.data
        })
      },
      openDetail(row, index, type, tzType) {
        //type 1 打开订单明细 2 打开费用明细 3驳回弹窗 4调账分配列表
        //console.log(row)
        // console.log(index);
        // console.log(tzType)
        this.listBillChecked = 0
        this.listBillOpened = []
        this.listbillCheckedRow = {}
        this.listBillChangeJob = []
        if (!row) {
          return this.$message.error("无订单数据");
        }
        this.cur_id = row.id;
        this.cur_wagedom = row.wagedom;
        this.cur_area = row.area;
        this.cur_row = row;
        this.cur_rowindex = index;
        this.wageRejectin = row.wagerejectstatusin == '200' || row.wagerejectstatusin == '100' ? true : false
        this.wageRejectout = row.wagerejectstatusout == '200' || row.wagerejectstatusout == '100' ? true : false

        let data = {
          sid: row.id,
          wagedom: row.wagedom
        };


        //要显示infolist要获取订单详细数据,要获取订单详细数据需要获得oldid所以走api/ExAxpline/Details接口，
        this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/Details",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          this.getmawbdetail(result.data.basicInfo.oldid).then(res => {
            if (res) {
              this.ponoDetail = res;
              if (type == 1) {
                this.dialogPono = true;
              }
            } else {
              this.ponoDetail = {};
              if (type == 1) {
                this.$message.error("无该订单的详细信息！");
              }
            }

            if (type == 2) {
              if (row.wagedom == '调账' && row.jobno && !row.jobno.includes('TZTS') && !row.jobno.includes('TZCW') && !row.jobno.includes('TZ2') && !row.jobno.includes('TZYW') && !tzType) {
                console.log('22')
                this.getTzList(data).then(res => {
                  this.OrderVisible = true;
                });
              } else {
                //console.log('33')
                this.OrderVisible = true;
              }
            }
            if (type == 3) {
              this.backOrderVisible = true;
            }

          })

        });
      },
      wagerejectstatusTitle({ row, type = 1, tzType = '' }) {
        let status=row.wagerejectstatusin=='-1'?row.wagerejectstatusout:row.wagerejectstatusin
        let wageinout=row.wagerejectstatusin=='-1'?'2':'1'
        let c = { color: '#0EB000', cursor: 'pointer' }, b = { color: '#FF9300', cursor: 'pointer' }, a = { color: "#EB0000", cursor: 'pointer' };
        if (tzType) {
          return wageinout == 1 ? "修改应收费用" : "修改应付费用";
        } else {
          if (status == 500) {
            return type == 1 ? "驳回已同意" : c;
          } else if (status == 100) {
            return type == 1 ? "驳回未处理" : b;
          } else if (status == 200) {
            return type == 1 ? "驳回不同意" : a;
          } else {
            return "修改费用"
          }
        }

      },
      tablePageChange(startIndex, endIndex) {
        this.tablePageStartIndex = startIndex;
        this.tablePageEndIndex = endIndex;
      },
      removeOrderFromTable(index = null, count = 1) {
        if (index !== null) {
          this.tableDataRes.splice(index, count);
          this.formatTableData();
        }
      },
      examinePage() {
        //  let tabledata = this.tableDataRes.slice(this.tablePageStartIndex, this.tablePageEndIndex).filter(i => i.dzstatus !== 1200)
        let tabledata = this.tableDataRes.filter(
          i => i.dzstatus !== 1200 && i.checked
        );
        // console.log(tabledata);return;
        if (this.tableDataRes.filter(i => i.checked).length == 0) {
          return this.$message.error("请先选择数据");
        }

        if (tabledata.length == 0) {
          return this.$message.error("所选数据已全部审核");
        }

        let sid = [],
          wagedom = [];
        tabledata.forEach(i => {
          sid.push(i.id);
          wagedom.push(i.wagedom);
        });

        let data = {
          sid: sid.join(","),
          wagedom: "",
          area: ""
        };

        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/CheckAllOrder",
          data,
          loading: true,
          tip: true,
          noarea: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            // 审核后将该页数据删除
            //  this.removeOrderFromTable(this.tablePageStartIndex, this.tablePageEndIndex)
            // this.$message.success('操作成功！');
            this.tableDataRes = this.tableDataRes.filter(i => !i.checked);
            this.formatTableData();
          }
        });
      },
      examine(row, index) {
        let data = {
          sid: row.id,
          wagedom: row.wagedom,
          area: row.area
        };

        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/CheckOrder",
          data,
          loading: true,
          tip: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            this.removeOrderFromTable(index);
          }
        });
      },
      assignList(row) {
        this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/GetCostList",
          params: { sid: row.id },
          loading: true,
          tip: false
        }).then(result => {
          this.assignWageList = result.data;
          this.assignListVisible = true;
        });
      },
      openBackOrderDialog(row, index) {
        this.cur_row = row;
        this.cur_rowindex = index;
        this.backOrderVisible = true;
      },
      backOrder() {
        if (!this.backOrderReason) {
          return this.$message.error("请填写驳回原因");
        }
        var reason = (this.cur_row.examineremark &&
          JSON.parse(this.cur_row.examineremark)) || [{}];
        var obj = {
          reasontype: "经理驳回",
          delbillreason: this.backOrderReason,
          delbillman: localStorage.getItem("usrname"),
          delbilldate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
          area: this.cur_row.area
        };
        if (reason[0].rollbackreason && reason[0].rollbackreason.length > 0) {
          reason[0].rollbackreason.push(obj);
        } else {
          reason = [obj];
        }
        let data = {
          sid: this.cur_row.id,
          wagedom: this.cur_row.wagedom,
          area: this.cur_row.area,
          backRemark: JSON.stringify(reason)
        };

        // console.log(data);
        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/BackOrder",
          data,
          loading: true,
          tip: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            this.removeOrderFromTable(this.cur_rowindex);
            this.backOrderVisible = false;
          }
        });
      },
      transDzstatus(dzstatus) {
        let status = {
          1: "上榜未确认",
          100: "上榜已确认",
          200: "签单申请",
          300: "签单确认",
          400: "操作单已制",
          500: "签单待修改",
          600: "分运单已制",
          700: "总运单已制",
          800: "未审核",
          1200: "已审核"
        };
        let text = "";
        if (status[dzstatus]) {
          text = status[dzstatus];
        }
        return text || dzstatus;
      },
      transExamineisback_sett(examineisback_sett) {
        // 1 无  2审单驳回    3 审单重新确认
        let text = "";
        switch (examineisback_sett) {
          case 1:
            text = "无";
            break;
          case 2:
            text = "审单驳回";
            break;
          case 3:
            text = "审单重新确认";
            break;
        }
        return text;
      },
      formatStyle(val) {
        let text = "";
        val = Number(val);
        if (val < 0) {
          text = `<span style="color:red;font-weight:bold;">${val.toFixed(
            2
          )}</span>`;
        } else {
          text = `<span style="color:green;font-weight:bold;">${val.toFixed(2)}</span>`
          // text = val.toFixed(2);
        }
        return text;
      },
      transProfit(row) {
        return this.formatStyle(row.realwage_profitrmb);
      },
      formatDate(date) {
        if (date.includes("1900-01-01")) {
          return "";
        } else {
          return date.replace("T", " ").split(".")[0];
        }
      },
      getAllCurrencyWageinout(inout) {
        let currencyCN = {
          cny: "人民币",
          eur: "欧元",
          hkd: "港币",
          usd: "美元"
        },
          result = [];

        Object.entries(currencyCN).map(([currency, cn]) => {
          let key = `${currency}wage${inout}`;

          if (this.tableDataTotal[key]) {
            result.push({
              currencyCN: cn,
              currencyFuHao: this.currencyFuHao[cn],
              money: this.tableDataTotal[key].toFixed(2)
            });
          }
        });

        if (result.length == 0)
          result.push({ currencyCN: "人民币", currencyFuHao: "￥:", money: 0 });
        return result;
      },
      transBillstatus(value) {
        // 1.未对账  900.对账中  1000.已对账
        let text = "";
        switch (value) {
          case 1:
            text = "未对账";
            break;
          case 900:
            text = "对账中";
            break;
          case 1000:
            text = "已对账";
            break;
        }
        return text;
      },
      transAccountstatus(accountstatus) {
        let text = "";
        switch (accountstatus) {
          case 1:
            text = "未制作";
            break;
          case 2:
            text = "已制作";
            break;
        }
        return text;
      },
      transPcstatus(pcstatus) {
        let text = "";
        switch (pcstatus) {
          case 1:
            text = "未配舱";
            break;
          case 100:
            text = "已配舱";
            break;
          case 200:
            text = "总调锁定";
            break;
          case 300:
            text = "外场拉货";
            break;
          case 400:
            text = "已交接";
            break;
        }
        return text;
      },
      transBgstatus(bgstatus) {
        let text = "";
        switch (bgstatus) {
          case -1:
            text = "";
            break;
          case 1:
            text = "正收单";
            break;
          case 100:
            text = "可报关";
            break;
          case 200:
            text = "正报关";
            break;
          case 300:
            text = "一放通过";
            break;
          case 400:
            text = "查验中";
            break;
          case 500:
            text = "查验放行";
            break;
          case 600:
            text = "航单已核";
            break;
          case 700:
            text = "退单完成";
            break;
          case 800:
            text = "退单清返";
            break;
        }
        return text;
      }
    }
  };
  console.log(this)
  export default parentComponent
</script>

<style lang="less" scoped>
  .managerExamine {
    .tableCompt {
      .el-icon-success {
        color: #3c9;
      }

      .el-icon-error {
        color: #f00;
      }

      .el-icon-success,
      .el-icon-error,
      .el-icon-document {
        font-size: 16px;
        margin: 0 7px;

        &.disabled {
          color: #ccc;
        }
      }
    }

    .assignList-dialog {
      .assignList {
        .wage_content {
          margin-bottom: 18px;

          .header {
            position: relative;

            .title {
              display: inline-block;
              height: 35px;
              line-height: 35px;
              padding-left: 10px;
              position: relative;
              color: white;
              margin-right: 40px;
              font-weight: bold;
              cursor: pointer;

              &:after {
                position: absolute;
                top: 0;
                right: -40px;
                content: "";
                display: block;
                width: 0;
                height: 0;
                border-right: 40px solid transparent;
              }
            }

            .header-right {
              display: inline-block;

              p {
                display: inline-block;
                margin-right: 50px;
                font-weight: bold;
              }
            }
          }

          .content {
            padding: 20px;
          }
        }

        .wagein {
          @wageincolor: #00cc00;

          .title {
            background: @wageincolor;

            &:after {
              border-bottom: 35px solid @wageincolor;
            }
          }

          .header-right {
            p {
              color: @wageincolor;
            }
          }

          .content {
            border: 1px solid @wageincolor;
          }
        }

        .wageout {
          @wageoutcolor: #ff3300;

          .title {
            background: #e88c75;

            &:after {
              border-bottom: 35px solid #e88c75;
            }

            &.active {
              background: @wageoutcolor;

              &:after {
                border-bottom: 35px solid @wageoutcolor;
              }
            }
          }

          .header-right {
            p {
              color: @wageoutcolor;
            }
          }

          .content {
            border: 1px solid @wageoutcolor;
          }
        }
      }
    }
  }

  .reason {
    .el-dialog__body {
      padding: 8px 40px;
    }

    h3 {
      font-size: 18px;
      color: #004d84;
    }

    .orderNo {
      margin-top: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      font-size: 13px;
      margin-bottom: 12px;

      span {
        float: left;
        color: #004d84;
        font-weight: bold;
      }

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
  }
</style>