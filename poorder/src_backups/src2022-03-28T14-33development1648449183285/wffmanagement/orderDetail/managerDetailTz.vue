<template>
  <div class="orderDetail">
    <!-- {{listBillChangeJob}}
    {{listBillChecked}} -->
    <!-- {{listbillCheckedRow}} -->
    <div v-if="inputModelData.iscomboine==1" style="margin-bottom:15px;">

      <commonTabs :list="hawbListTab" :checkedIndex.sync="tabindex" :showContent="false" @toggle="handleClick">
      </commonTabs>

      <!-- <el-tabs @tab-click="handleClick" :value="String(tabindex)">
        <el-tab-pane :label="inputModelData.pono"></el-tab-pane>
        <el-tab-pane :label="item.pono" v-for="item in hawbList" :key="item.pono"></el-tab-pane>
      </el-tabs> -->
    </div>

    <div class="content">
      <infoList :inputModelData="inputModelDataInfoList" v-if="showListInfo" :pono="mawbInfo.jobno" name="详细">
        <template slot="exinfo">
          <div class="showpaneinfo" style="width:100%">
            <div>
              <span>销售员：</span>
              <span>{{basicInfo.salesname||'--'}}</span>
            </div>
            <div>
              <span>单证状态：</span>
              <span>{{basicInfo.dzstatusCn }}</span>
            </div>
            <div>
              <span>审单人：</span>
              <span>{{basicInfo.submitman_2_sett}}</span>
            </div>
            <div>
              <span>审单日期：</span>
              <span>{{basicInfo.submitdate_2_sett}}</span>
            </div>
          </div>
        </template>
      </infoList>

    </div>

    <div class="check-mode">
      <el-switch v-model="checkMode" inactive-color="#009900" active-color="#ff4949" :active-text="modeText">
      </el-switch>
    </div>

    <div class="wageInformation" v-if="!checkMode">
      <template v-for="(wageinList,index) in resultData.wageinListArr">
        <div class="wage_content wagein" v-if="wageinList.length&&index<=listBillChecked">
          <div class="header">
            <div class="title">本票应收信息{{index+1}}&nbsp;&nbsp;&nbsp;{{listBillChangeJob[index].billno}}</div>
            <div class="header-right">
              <p>不含税总计(折合人民币): {{StringNum(getWageTotal(1,1,index))}} 元</p>
              <p>含税总计(折合人民币): {{StringNum(getWageTotal(1,2,index))}} 元</p>
              <p>应收实际结算重量: {{getWageTotal(1,3,index)}} 公斤</p>
            </div>
          </div>
          <div class="content">
            <p class="wageintotal">
              <span style="margin-right: 5px;">总应收:</span>
              {{ allCurrencyWagein(index) }}
            </p>

            <commonTable class="commonTable" :head="table_model" :table-data="wageinList">
              <template slot="checkTh">
               <span v-if="listBillChangeJob[index]['billno']!=listBillChangeJob[listBillChecked]['billno']">
                 --
               </span>
               <span v-else>
                 <el-checkbox v-model="checkBh.allCheckYs" :disabled="basicInfo.dzstatus=='1200'||inputModelData.orderguid>0" ></el-checkbox>
                 <i class="el-icon-shenhebohui"  title="批量驳回" v-if="listBillChangeJob[index]['billno']==listBillChangeJob[listBillChecked]['billno']&&projectIsWecan&&mawbChargeBohuiChecked.length&&isSponsor" :icondisabled="basicInfo.dzstatus=='1200'&&!basicInfo.tzType" style="font-size:14px;margin-left:4px;" @click="getBohuiWageDetail(mawbChargeBohuiChecked,2)"></i>
               </span>

              </template>
              <template slot="check" slot-scope="props" v-if="listBillChangeJob[listBillChecked]['billno']==props.data.row.jobno">
                <el-checkbox v-model="checkBh.ys" :label="props.data.row.wageguid" v-if="props.data.row.status==-1||!projectIsWecan" :disabled="basicInfo.dzstatus=='1200'"></el-checkbox>
 <!--                {{props.data.row.isshare}}
                {{props.data.row.isbill}}
                {{props.data.row.system}}
                {{props.data.row.wagedom}}
                {{basicInfo.dzstatus}} -->
                <!-- {{basicInfo.tzType}} -->
                <i class="el-icon-shenhebohui" :style="setBhiconColor(props.data.row.status)" :title="setBhiconColor(props.data.row.status,2)" @click="getBohuiWageDetail(props.data.row)" :icondisabled="(props.data.row.system!='空出'&&props.data.row.system!='国内服务'||props.data.row.isshare>0||basicInfo.dzstatus=='1200'||props.data.row.isbill==1&&props.data.row.wagedom!='调账')||(basicInfo.tzType!='单票'&&props.data.row.wagedom=='调账')||inputModelData.orderguid>0"></i>
              </template>

              <template slot="num" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="price" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="pricewageallRmb" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="tax" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="realwageallRmb" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="leastwageall" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="wageall" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="isincl" slot-scope="props">
                <span>{{ props.data.value == 2 ? '是' : '' }}</span>
              </template>
              <template slot="isfree" slot-scope="props">
                <span>{{ props.data.value == 1 ? '否' : '是' }}</span>
              </template>
              <template slot="confirmman" slot-scope="props">
                <span>{{ props.data.value ? props.data.value : '--' }}</span>
              </template>
              <template slot="revisetax" slot-scope="props">
                <span>{{ typeof props.data.value == 'number' ? props.data.value.toFixed(2) : '--' }}</span>
              </template>
              <template slot="changerate" slot-scope="props">
                <span>{{ props.data.value.toFixed(4) }}</span>
              </template>
            </commonTable>
          </div>
        </div>
      </template>


      <template v-for="(wageoutList,index) in resultData.wageoutListArr">
        <div class="wage_content wageout" v-if="wageoutList.length&&index<=listBillChecked">
          <div class="header">
            <div :class="['title', {'active': !czdWageOutVisible}]" @click="czdWageOutVisible = false">本票应付信息{{index+1}}&nbsp;&nbsp;&nbsp;{{listBillChangeJob[index].billno}}</div>
            <div :class="['title', {'active': czdWageOutVisible}]" @click="czdWageOutVisible = true"
              v-if="resultData.powageoutList.length != 0">操作地应付信息</div>

            <div class="header-right" v-if="!czdWageOutVisible">
              <p>不含税总计(折合人民币): {{StringNum(getWageTotal(2,1,index))}} 元</p>
              <p>含税总计(折合人民币): {{StringNum(getWageTotal(2,2,index))}} 元</p>
              <p>应付实际结算重量: {{getWageTotal(2,3,index)}} 公斤</p>
            </div>
            <div class="header-right" v-else>
              <p>总计: {{ resultData.powageoutList.reduce((p, i) => p += i.wageall, 0).toFixed(2) }} 元</p>
            </div>
          </div>
          <div class="content">
            <p class="wageouttotal" v-if="!czdWageOutVisible">
              <span style="margin-right: 5px;">总应付:</span>
              {{ allCurrencyWageout(index)}}
            </p>
            <p class="wageouttotal" v-else>
              <span style="margin-right: 5px;">操作地总应付:</span>
              {{ allCurrencyPowageoutList(index) }}
            </p>
            <commonTable class="commonTable" :head="table_model"
              :table-data="czdWageOutVisible ? resultData.powageoutList : wageoutList">
       
            <template slot="checkTh">
             <span v-if="listBillChangeJob[index]['billno']!=listBillChangeJob[listBillChecked]['billno']">
               --
             </span>
             <span v-else>
              <el-checkbox  v-model="checkBh.allCheckYf" :disabled="basicInfo.dzstatus=='1200'"></el-checkbox>
               <i class="el-icon-shenhebohui"  title="批量驳回" v-if="listBillChangeJob[index]['billno']==listBillChangeJob[listBillChecked]['billno']&&projectIsWecan&&mawbPaymentBohuiChecked.length&&isSponsor" :icondisabled="basicInfo.dzstatus=='1200'&&!basicInfo.tzType" style="font-size:14px;margin-left:4px;" @click="getBohuiWageDetail(mawbPaymentBohuiChecked,2)"></i>
             </span>

            </template>
            <template slot="check" slot-scope="props" v-if="listBillChangeJob[listBillChecked]['billno']==props.data.row.jobno">
            <!-- v-if="!mawbPaymentBohuiChecked.length"  -->
              <el-checkbox v-model="checkBh.yf" :label="props.data.row.wageguid" v-if="props.data.row.status==-1||!projectIsWecan" :disabled="basicInfo.dzstatus=='1200'"></el-checkbox>
              <i class="el-icon-shenhebohui" :style="setBhiconColor(props.data.row.status)" :title="setBhiconColor(props.data.row.status,2)" @click="getBohuiWageDetail(props.data.row)" :icondisabled="(props.data.row.system!='空出'&&props.data.row.system!='国内服务'||props.data.row.isshare>0||basicInfo.dzstatus=='1200'||props.data.row.isbill==1&&props.data.row.wagedom!='调账')||(basicInfo.tzType!='单票'&&props.data.row.wagedom=='调账')"></i>
            </template>

              <template slot="num" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="price" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="pricewageallRmb" slot-scope="props">
                <span>{{ props.data.value ? Number(props.data.value).toFixed(2) : '--' }}</span>
              </template>
              <template slot="tax" slot-scope="props">
                <span>{{ typeof props.data.value != 'undefined' ? Number(props.data.value).toFixed(2) : '--' }}</span>
              </template>
              <template slot="realwageallRmb" slot-scope="props">
                <span>{{ props.data.value ? Number(props.data.value).toFixed(2) : '--' }}</span>
              </template>
              <template slot="leastwageall" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="wageall" slot-scope="props">
                <span>{{ Number(props.data.value).toFixed(2) }}</span>
              </template>
              <template slot="isincl" slot-scope="props">
                <span>{{ props.data.value == 2 ? '是' : '--' }}</span>
              </template>
              <template slot="isfree" slot-scope="props">
                <span>{{ props.data.value == 1 ? '否' : '是' }}</span>
              </template>
              <template slot="confirmman" slot-scope="props">
                <span>{{ props.data.value ? props.data.value : '--' }}</span>
              </template>
              <template slot="revisetax" slot-scope="props">
                <span>{{ typeof props.data.value == 'number' ? props.data.value.toFixed(2) : '--' }}</span>
              </template>
              <template slot="changerate" slot-scope="props">
                <span>{{ props.data.value.toFixed(4) }}</span>
              </template>
            </commonTable>
          </div>
        </div>
      </template>

    </div>

    <div class="wageCheckMode" v-if="checkMode">
      <div class="wage_content wageout">
        <div class="header">
          <div class="title active">本票应付信息</div>
        </div>
        <div class="content">
          <p class="wageouttotal">
            <span style="margin-right: 5px;">总应付(折合人民币):</span>
            {{ (resultData.wageoutList.reduce((p, v) => v.isfree == 2 ? p : p += v.wageall*100, 0)/100).toFixed(2) }}
          </p>

          <div :style="{'height':tableHeight}" v-scroll="onScroll" class="tableWrap">
            <table>
              <tr>
                <th width="50">免</th>
                <th width="200">结算对象</th>
                <th width="100">服务项目</th>
                <th width="90">数量</th>
                <th width="90">单价</th>
                <th width="90">币种</th>
                <th width="130">金额(折合人民币)</th>
              </tr>

              <tr v-for="(item,index) in wageoutSortLine" :key="index"
                :style="{background:item.isfree==2?'#e2fdde':''}">
                <td width="50" v-if="item.isfree">{{ item.isfree == 1 ? '否' : '是' }}</td>
                <td v-else></td>
                <td width="200" :title="item.wtkhname">{{item.wtkhname}}</td>
                <td width="100">{{ item.items }}</td>
                <td width="90">{{item.num}}</td>
                <td width="90">{{item.price}}</td>
                <td width="90">{{item.currency}}</td>
                <td width="130">{{item.realwageallRmb}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="wage_content wagein">
        <div class="header">
          <div class="title">本票应收信息</div>
        </div>
        <div class="content">
          <p class="wageintotal">
            <span style="margin-right: 5px;">总应收(折合人民币):</span>
            {{ (resultData.wageinList.reduce((p, v) => v.isfree == 2 ? p : p += v.wageall*100, 0)/100).toFixed(2) }}
          </p>
          <div :style="{'height':tableHeight}" v-scroll="onScroll" class="tableWrap">
            <table>
              <tr>
                <th width="50">免</th>
                <th width="200">结算对象</th>
                <th width="100">服务项目</th>
                <th width="90">数量</th>
                <th width="90">单价</th>
                <th width="90">币种</th>
                <th width="130">金额(折合人民币)</th>
              </tr>

              <tr v-for="(item,index) in wageinSortLine" :key="index" :style="{background:item.isfree==2?'#e2fdde':''}">
                <template>
                  <td width="50" v-if="item.isfree">{{ item.isfree == 1 ? '否' : '是' }}</td>
                  <td v-else></td>
                  <td width="200" :title="item.wtkhname">{{item.wtkhname}}</td>
                  <td width="100">{{ item.items }}</td>
                  <td width="90">{{item.num}}</td>
                  <td width="90">{{item.price}}</td>
                  <td width="90">{{item.currency}}</td>
                  <td width="130">{{item.realwageallRmb}}</td>
                </template>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="wage_content toolTip">
        <div class="header">
          <div class="title">总盈利</div>
        </div>
        <div class="content">
          <p class="profittotal">
            盈利(折合人民币):￥
            <span>{{ (wageinTotalRealwageall - wageoutTotalRealwageall).toFixed(2) }}</span>
          </p>
          <div :style="{'height':tableHeight}" v-scroll="onScroll" class="tableWrap">
            <table>
              <tr>
                <th>差额(折合人民币)</th>
              </tr>
              <tr v-for="(item,index) in toolTip" :key="index">
                <td :style="{'color':Number(item) < 0 ? 'red' : Number(item) > 0 ? '#00CC00' : ''}">{{ item }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="feeInformation">
      <div class="left">
        <!-- <p>
          <span>本次结算：</span>
          <span>
            不含税盈利(折合人民币)：
            <span
              :style="{color: basicInfo.noTaxProfitRmb >= 0 ? 'green' : 'red'}">{{ basicInfo.noTaxProfitRmb }}</span> 元
          </span>
          <span>
            含税盈利(折合人民币)：
            <span :style="{color: basicInfo.taxProfitRmb >= 0 ? 'green' : 'red'}">{{ basicInfo.taxProfitRmb }}</span> 元
          </span>
          <span>
            税差(折合人民币)：
            <span
              :style="{color: basicInfo.taxDisparityRmb >= 0 ? 'green' : 'red'}">{{ basicInfo.taxDisparityRmb }}</span>
            元
          </span>

          <span>
            实际结算重量：
            <span>{{ basicInfo.accountweightin_sett }}</span> 公斤
          </span>

          <span>
            每公斤：
            <span>{{ basicInfo.realSetOneKgPriceRmb }}</span> 元
          </span>
        </p> -->
        <p style="color:#000">
          <span>本票结算：</span>
          <span>
            应收：
            <span style="color:green">{{ basicInfo.wageinTaxMoneyRmb_old}}</span> 元
          </span>
          <span>
            应付：
            <span style="color:red">{{ basicInfo.wageoutTaxMoneyRmb_old }}</span> 元
          </span>
          <span>
            含税总盈利(折合人民币)：
            <span
              :style="{color: basicInfo.taxProfitRmb_old  >= 0 ? 'green' : 'red'}">{{ basicInfo.taxProfitRmb_old }}</span>
            元
          </span>
          <span>
            不含税总盈利(折合人民币)：
            <span
              :style="{color: basicInfo.noTaxProfitRmb_old >= 0 ? 'green' : 'red'}">{{ basicInfo.noTaxProfitRmb_old }}</span>
            元
          </span>
          <span>
            每公斤：
            <span style="color:#ff6600">{{ basicInfo.realSetOneKgPriceRmb_old }}</span> 元
          </span>
        </p>
        <!-- <slot name="listwage"></slot> -->
      </div>
    </div>

    <div class="footer">
      <div class="btn-c">
        <div class="left-btn">

          <el-button @click="back">返回</el-button>
        </div>
        <div class="right-btn" v-if="showBtnfoot&&origin=='undefined'">
          <el-button type="primary" :disabled="basicInfo.dzstatus == 1200" @click="checkOrder">审核完成</el-button>
          <el-button type="primary" :disabled="basicInfo.dzstatus == 1200" @click="backOrderVisible = true">驳回
          </el-button>
          <el-button type="primary" :disabled="basicInfo.dzstatus != 1200" @click="CancelCheckOrder">取消审核</el-button>
        </div>
      </div>
    </div>

    <el-dialog width="800px" top="4%" center :visible.sync="backOrderVisible" v-if="backOrderVisible" append-to-body
      custom-class="reason">
      <div>
        <h3>驳回原因</h3>
        <p class="orderNo">
          <span>{{ basicInfo.jobno }}</span>
        </p>
        <ul>
          <li>总运单号</li>
          <li>始发港</li>
          <li>目的港</li>
          <li>航班号</li>
          <li>航班日期</li>
        </ul>
        <ul style="margin-top:3px;">
          <li>{{ basicInfo.mawb }}</li>
          <li>{{ basicInfo.sfg }}</li>
          <li>{{ basicInfo.mawbmdg }}</li>
          <li>{{ basicInfo.real_hbh }}</li>
          <li>{{ basicInfo.real_hbrq.substring(0,10) }}</li>
        </ul>

        <el-input type="textarea" v-model="backOrderReason" class="input-required" :autosize="{minRows:4}"
          style="margin-top:12px;color:#c8c8c8" placeholder="驳回原因输入框"></el-input>

        <p style="margin-top:18px;text-align:right">
          <el-button type="primary" @click="backOrder">确定</el-button>
          <el-button @click="backOrderVisible = false">取消</el-button>
        </p>
      </div>
    </el-dialog>

      <el-dialog :visible.sync="bohuiVisible" width="1360px" :title="`驳回详情(${wageBohuiData[0]&&wageBohuiData[0].wagecommitlist[0].wageinout==1?'应收':'应付'})`" top="4%" v-if="bohuiVisible" :close-on-press-escape="false" append-to-body :close-on-click-modal="false" center @close="closeBohuiDialog">
        <div style="min-height:400px" v-if="basicInfo.id">
            <!-- <infoList :inputModelData="allmaindata" v-if="allmaindata.guid" name="详细" :costBiaozhu="false" :ifopendetail="false" :showBtnGroup="false">
            </infoList> -->
             <infoList :inputModelData="inputModelDataInfoList" v-if="showInfoList" :pono="mawbInfo.jobno" name="详细" :costBiaozhu="false" :ifopendetail="false":showBtnGroup="false"/>
            <div>

                <el-tabs class="tabsTile" :value="String(childBohuiChecked)" @tab-click="handleClickBohui" style="margin-bottom:10px;">
                    <el-tab-pane :label="item.items" v-for="(item,index) in wageBohuiData" :key="index">
                        <span slot="label" :class="{checked:childBohuiChecked==index}" :style="spanstyle(item.status==-1?'black':(item.status==500?'green':(item.receiver=='initiator'?'red':'green')),childBohuiChecked==index)">{{item.items}}</span>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <template v-for="(item,index) in wageBohuiData">
                <myCommonTable v-show="childBohuiChecked==index" :ifNeedFrashWage.sync="ifNeedFrashWage" ref="myCommonTable" :ifPiliangBohui="isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length" v-if="childBohuiCheckedList.includes(index)||(isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length)" :mawbinfo="mawbInfo" :wageBohuiData.sync="wageBohuiData[index]" :key="index" :initiator="initiator" :area="area"></myCommonTable>
            </template>

            <div v-if="isSponsor&&wageBohuiData.length>1&&wageBohuiData.filter(i=>i.status==-1||i.status==500).length==wageBohuiData.length">
                <h4 style="margin:15px 0">驳回理由</h4>
                <el-input type="textarea" v-model="rollbackreason" rows="4" placeholder="请输入你的驳回理由"></el-input>
                <div style="text-align:right;margin:20px 0">
                    <el-button type="primary" @click="piliangWagebohui">批量确认驳回</el-button>
                    <el-button @click="bohuiVisible=false">返回</el-button>
                </div>
            </div>

        </div>
    </el-dialog>

  </div>
</template>

<script>
  import { formatDate, computedWeight } from "../../api/localStorage.js";
  import {
    myCommonTable,
    setBhiconColorMixin
  } from "@/common/detailPagesMixin"

  export default {
    props: {
      id: [String, Number],
      jobnosid: [String, Number],
      wagedom: String,
      area: String,
      visible: Boolean,
      showListInfo: {//显示摘要
        type: Boolean,
        default: true
      },
      showBtnfoot: {//显示底部按钮组
        type: Boolean,
        default: true
      },
      listbillCheckedRow: Object,
      listBillChangeJob: Array,
      listBillChecked: {
        type: [Number, String],
        default: 0
      },
      initiator: [String, Number],
      origin:{//来源是航线客服时隐藏底部按钮
         type:String,
         default:()=>{
          return ''
         }
      },
    },
    components: {
        myCommonTable
    },
    mixins: [setBhiconColorMixin],

    data() {
      return {
        resultData: {
          wageinList: [],
          wageoutList: [],
          powageoutList: []
        },
        basicInfo: {
          wtkhname: "",
          storeinfo: "",
          real_hbrq: "",
          submitdate_2_sett: ""
        },
        mawbInfo: {},
        inputModelData: {},
        checkMode: false,
        backOrderVisible: false,
        backOrderReason: "",

        // 操作地应付显示
        czdWageOutVisible: false,

        itemsReocrder: {},
        wageinSortLine: [],
        wageoutSortLine: [],
        toolTip: [],

        table_model: [
          // { field: "jobno", title: "订舱编号" },
          {field:"check",title:"批量驳回"},
          { field: "isfree", title: "免" },
          { field: "confirmman", title: "确认人" },
          // { field: "wtkhname", title: "结算对象" },
          { field: "gid", title: "结算对象", formatType: 3 },
          { field: "items", title: "服务项目" },
          { field: "num", title: "数量" },
          { field: "price", title: "单价" },
          { field: "currency", title: "币种" },
          // {field: "leastwageall", title: "金额"},
          // {field: "wageall", title: "RMB金额"},
          { field: "wageall", title: "金额" },
          { field: "wageallrmb", title: "RMB金额" },
          { field: "changerate", title: "汇率" },
          { field: "isincl", title: "含税" },
          { field: "pricewageallRmb", title: "不含税金额(折合人民币)" },
          { field: "tax", title: "税金" },
          { field: "realwageallRmb", title: "含税总额(折合人民币)" },
          { field: "wagetype", title: "结算方式" },
          { field: "revisetax", title: "调整金额" },
          { field: "remark", title: "备注" }
          // {field: "pname", title: "品名"},
          // {field: "gname", title: "规格"}
        ],

        currencyFuHao: {
          人民币: "￥:",
          港币: "HK$:",
          美元: "$:",
          欧元: "€:",
          日元: "¥:",
          英镑: "￡:"
        },
        hawbList: [],
        hawbListTab: [],
        tabindex: 0,
        checkBh:{ys:[],yf:[],allCheckYf:false,allCheckYs:false},
        bohuiVisible: false, //费用驳回弹窗 // 费用中的 status：-1 未发起，100 待通过，200 已驳回，500，已通过
        wageBohuiData: [], //驳回的数据
        childBohuiChecked: 0,
        childBohuiCheckedList: [0],
        ifNeedFrashWage: false,
        rollbackreason: '',
        showInfoList: true,
      };
    },
    computed: {
      inputModelDataInfoList() {
        //摘要里面显示的数据
        let data = JSON.parse(JSON.stringify(this.inputModelData));
        if (this.inputModelData.iscomboine == 1) {
          if (this.tabindex > 0) {
            let children = JSON.parse(
              JSON.stringify(this.hawbList[this.tabindex - 1])
            );
            children.guid = data.guid;
            children.boguid = data.boguid;
            children.sid = data.sid;
            return children;
          } else {
            data.inwageallinprice = "";
          }
        }
        return data;
      },
      modeText() {
        return this.checkMode ? "关闭核对模式" : "启用核对模式";
      },
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
      // 折合人民币总应付
      wageoutTotalRealwageall() {
        return this.resultData.wageoutListArr.flat()
          .reduce((p, i) => (p += i.isfree == 1 ? i.realwageallRmb : 0), 0)
          .toFixed(2);
      },
      // 折合人民币总应收
      wageinTotalRealwageall() {
        return this.resultData.wageinListArr.flat()
          .reduce((p, i) => (p += i.isfree == 1 ? i.realwageallRmb : 0), 0)
          .toFixed(2);
      },
       mawbPaymentBohuiChecked() { //多选时可批量驳回的费用
            var list=this.czdWageOutVisible ? this.resultData.powageoutList : this.resultData.wageoutListArr[this.listBillChecked]
            return list.filter(i => this.checkBh.yf.includes(i.wageguid) && (i.status == -1 || i.status == 500) && i.isshare <= 0)
      },
      mawbChargeBohuiChecked() {
            var list=this.resultData.wageinListArr[this.listBillChecked]
            return list.filter(i => this.checkBh.ys.includes(i.wageguid) && (i.status == -1 || i.status == 500) && i.isshare <= 0)
      },
    },
    created() {
      this.fetchData();
    },
    watch: {
      backOrderVisible(newVal) {
        if (!newVal) this.backOrderReason = "";
      },
      'checkBh.allCheckYs'(newVal){
        var list=this.resultData.wageinListArr[this.listBillChecked]
        if(newVal){

          this.checkBh.ys= list.filter(i => i.isshare <= 0&&i.status == -1).map(i=>i.wageguid)
        }else{
          this.checkBh.ys=[]
        }
      },
      'checkBh.allCheckYf'(newVal){
        var list=this.czdWageOutVisible ? this.resultData.powageoutList : this.resultData.wageoutListArr[this.listBillChecked]
        if(newVal){
          this.checkBh.yf= list.filter(i => (i.status == -1 || i.status == 500) && i.isshare <= 0).map(i=>i.wageguid)
        }else{
          this.checkBh.yf=[]
        }
      },
      'checkBh.ys'(val){
        var list=this.resultData.wageinListArr[this.listBillChecked].filter(i => i.isshare <= 0).map(i=>i.wageguid)
        if(list.length==val.length){
          this.checkBh.allCheckYs=true
        }
      },
      'checkBh.yf'(val){
         var listAll=this.czdWageOutVisible ? this.resultData.powageoutList : this.resultData.wageoutListArr[this.listBillChecked]
         var list=listAll.filter(i => (i.status == -1 || i.status == 500) && i.isshare <= 0).map(i=>i.wageguid)
        if(list.length==val.length){
          this.checkBh.allCheckYf=true
        }
      },
    },
    methods: {
      //浮点数   
      StringNum(num){
       var returnNum=Number(num).toLocaleString();               
           returnNum = returnNum.replace(/[,]/g, '');
       return Number(returnNum).toFixed(2)
      },
      allCurrencyWagein(index) {
        return this.getAllCurrencyStr(this.resultData.wageinListArr[index]);
      },
      allCurrencyWageout(index) {
        return this.getAllCurrencyStr(this.resultData.wageoutListArr[index]);
      },
      allCurrencyPowageoutList(index) {
        return this.getAllCurrencyStr(this.resultData.powageoutListArr[index]);
      },
      getWageTotal(wageinout, dom, index) {
        //wageinout 1应收 2应付  dom 1不含税总计(折合人民币) 2含税总计 3应收实际结算重量
        let field = "";
        switch (dom) {
          case 1:
            field = "pricewageallRmb";
            break;
          case 2:
            field = "realwageallRmb";
            break;
        }
        if (this.tabindex == 0 && dom == 3) {
          return wageinout == 1
            ? this.basicInfo.accountweightin_sett
            : this.basicInfo.accountweightout_sett;
        }
        if (wageinout == 1 && dom == 3) {
          field = "accountweightin_sett";
        }
        if (wageinout == 2 && dom == 3) {
          field = "accountweightout_sett";
        }
        let wagelist =
          wageinout == 1
            ? this.resultData.wageinListArr[index]
            : this.resultData.wageoutListArr[index];
        wagelist = wagelist
          .filter(i => !i.thisListHide)
          .map(i => Number(i[field]));
        if (wagelist.length > 0) {
          return Number(wagelist.reduce((a, b) => a + b)).toFixed(2);
        } else {
          return 0;
        }
      },
      handleClick(tab) {
        let setTritem = (i => {
          if (i.isshare > 0 && i.guid == 0) {
            i.background = "#F0F0F0";
          }
          this.$set(i, "thisListHide", false);
          if (tab.index > 0) {
            if (i.oldid !== this.hawbList[tab.index - 1].boguid) {
              this.$set(i, "thisListHide", true);
            }
          }
        })

        this.tabindex = tab.index;
        //thisListHide 为true是隐藏
        this.resultData.wageinList.forEach(i => {
          setTritem(i);
        });
        this.resultData.wageoutList.forEach(i => {
          setTritem(i);
        });



      },

      getAllCurrencyStr(wageList) {
        let result = {};
        wageList = wageList.filter(i => !i.thisListHide);
        wageList.forEach(item => {
          if (item.isfree == 2) return;
          if (result[this.currencyFuHao[item.currency]]) {
            result[this.currencyFuHao[item.currency]] += item.wageall ;
          } else {
            result[this.currencyFuHao[item.currency]] = item.wageall ;
          }
        });

        return Object.entries(result)
          .reduce((p, [key, val]) => {
            val = Number(this.StringNum(val)).toFixed(2);
            p += `${key} ${val}，`;
            return p;
          }, "")
          .slice(0, -1);
      },
      fetchData() {
        let data = {
          sid: this.id,
          wagedom: this.wagedom,
          jobnosid: this.jobnosid
        };
        if(this.origin&&this.origin!='undefined'){
          console.log(this.origin)
          //alert('1')
          data['realWagedom']=this.origin
        }

        this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/Details",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          this.resultData = result.data;
          let wageinListArr = []
          let wageoutListArr = []

          this.listBillChangeJob.forEach((i, k) => {
            wageinListArr[k] = this.resultData.wageinList_old.filter(e => e.jobno == i.billno)
            wageoutListArr[k] = this.resultData.wageoutList_old.filter(e => e.jobno == i.billno)
          })
          wageinListArr[this.listBillChecked] = this.resultData.wageinList
          wageoutListArr[this.listBillChecked] = this.resultData.wageoutList
          
          this.resultData.wageinListArr = this.listBillChangeJob.length?wageinListArr:[this.resultData.wageinList]
          this.resultData.wageoutListArr = this.listBillChangeJob.length ? wageoutListArr:[this.resultData.wageoutList]


          this.basicInfo = this.resultData.basicInfo;
          this.mawbInfo = this.resultData.mawbInfo;
          if (this.showBtnfoot) {
            this.$emit("update:listbillCheckedRow", result.data)
          }

          this.mawbInfo.ybjzt =
            (this.mawbInfo["ybpiece"] ? this.mawbInfo["ybpiece"] : "0") +
            "/" +
            (this.mawbInfo["ybweight"]
              ? Number(this.mawbInfo["ybweight"]).toFixed(2)
              : "0") +
            "/" +
            (this.mawbInfo["ybvolume"]
              ? Number(this.mawbInfo["ybvolume"]).toFixed(3)
              : "0");
          this.mawbInfo.realjzt =
            (this.mawbInfo["realpiece"] ? this.mawbInfo["realpiece"] : "0") +
            "/" +
            (this.mawbInfo["realweight"]
              ? Number(this.mawbInfo["realweight"]).toFixed(2)
              : "0") +
            "/" +
            (this.mawbInfo["realvolume"]
              ? Number(this.mawbInfo["realvolume"]).toFixed(3)
              : "0");
          this.mawbInfo.zdjzt =
            (this.mawbInfo["zdpiece"] ? this.mawbInfo["zdpiece"] : "0") +
            "/" +
            (this.mawbInfo["zdweight"]
              ? Number(this.mawbInfo["zdweight"]).toFixed(2)
              : "0") +
            "/" +
            (this.mawbInfo["zdvolume"]
              ? Number(this.mawbInfo["zdvolume"]).toFixed(3)
              : "0");

          this.mawbInfo.realjfweight = computedWeight(
            this.mawbInfo.realvolume,
            this.mawbInfo.realweight
          );
          this.mawbInfo.zdjfweight = computedWeight(
            this.mawbInfo.zdvolume,
            this.mawbInfo.zdweight
          );

          if (this.mawbInfo.pcstatus == 1) {
            this.mawbInfo.pcstatus = "未配舱";
          } else if (this.mawbInfo.pcstatus == 100) {
            this.mawbInfo.pcstatus = "已配舱";
          } else if (this.mawbInfo.pcstatus == 200) {
            this.mawbInfo.pcstatus = "总调锁定";
          } else if (this.mawbInfo.pcstatus == 300) {
            this.mawbInfo.pcstatus = "外场拉货";
          } else if (this.mawbInfo.pcstatus == 400) {
            this.mawbInfo.pcstatus = "已交接";
          }

          if (this.mawbInfo.isinwageallin == "1") {
            this.mawbInfo.isinwageallin = "单价ALLIN";
          } else if (this.mawbInfo.isinwageallin == "2") {
            this.mawbInfo.isinwageallin = "总价ALLIN";
          } else if (this.mawbInfo.isinwageallin == "3") {
            this.mawbInfo.isinwageallin = "单价++";
          } else if (this.mawbInfo.isinwageallin == "4") {
            this.mawbInfo.isinwageallin = "Cost+";
          }

          // 格式化日期
          this.basicInfo.real_hbrq = this.basicInfo.real_hbrq.includes(
            "1900-01-01"
          )
            ? ""
            : this.basicInfo.real_hbrq.split("T")[0];
          this.basicInfo.submitdate_2_sett = this.basicInfo.submitdate_2_sett.includes(
            "1900-01-01"
          )
            ? ""
            : this.basicInfo.submitdate_2_sett.replace("T", " ").split(".")[0];

          // 费用排序
          this.sortWageList();
          // 核对模式
          this.checkModel();

          if (this.basicInfo.oldid != -1) {
            this.$axios({
              method: "get",
              url: this.$store.state.webApi + "api/ExHpoAxpline",
              params: { boguid: this.basicInfo.oldid },
              loading: true,
              tip: false
            }).then(result => {
              console.log(result)
              if (!result.data) {
                this.setInputData()
              } else {
                this.inputModelData = result.data;
                this.mawbInfo.orderguid=result.data.orderguid
                if (this.inputModelData.iscomboine == 1) {
                  this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExHpoAxpline",
                    params: { groupid: result.data.boguid },
                    loading: true,
                    tip: false
                  }).then(results => {
                    this.hawbList = results.data || [];
                    this.hawbListTab = [{ pono: this.inputModelData.pono }].concat(this.hawbList)
                  });
                }

              }
            });
          } else {
            this.setInputData()
          }

        });
      },
      setInputData() {
        this.inputModelData = this.mawbInfo;
        this.inputModelData.accountweightin = this.basicInfo.accountweightin_sett;
        this.inputModelData.accountweightout = this.basicInfo.accountweightout_sett;
        this.inputModelData.hbrq = this.basicInfo.real_hbrq;
        this.inputModelData.inwageallinprice_record = 0;
        this.inputModelData.inwageallinprice_trans = 0;
        this.inputModelData.self_real_bp_trans_in = 0;
        this.inputModelData.cus_real_bp_trans_in = 0;
        this.inputModelData.wtxmname = this.mawbInfo.khnamebase;
        this.inputModelData.pono = this.basicInfo.jobno;
        this.inputModelData.guid = -1;
      },
      back() {
        this.$emit("update:visible", false);
      },
      checkOrder() {
        let data = {
          sid: this.basicInfo.id,
          wagedom: this.basicInfo.wagedom,
          area: this.area
        };

        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/CheckOrder",
          data,
          loading: true,
          tip: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            this.basicInfo.dzstatus = 1200;
            this.basicInfo.dzstatusCn = "已审核";
            this.$emit("dzstatusChange", 1200);
            this.$emit("update:visible", false);
            this.$emit("backOrder", true);
          }
        });
      },
      backOrder() {
        if (!this.backOrderReason) {
          return this.$message.error("请填写驳回原因");
        }

        var reason = (this.basicInfo.examineremark &&
          JSON.parse(this.basicInfo.examineremark)) || [{}];
        var obj = {
          reasontype: "经理驳回",
          delbillreason: this.backOrderReason,
          delbillman: localStorage.getItem("usrname"),
          delbilldate: new Date().Format("yyyy-MM-dd hh:mm:ss"),
          area: this.area
        };
        if (reason[0].rollbackreason && reason[0].rollbackreason.length > 0) {
          reason[0].rollbackreason.push(obj);
        } else {
          reason = [obj];
        }

        let data = {
          sid: this.basicInfo.id,
          wagedom: this.basicInfo.wagedom,
          area: this.area,
          backRemark: JSON.stringify(reason)
        };

        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/BackOrder",
          data,
          loading: true,
          tip: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            this.backOrderVisible = false;
            this.$emit("update:visible", false);
            this.$emit("backOrder", true);
          }
        });
      },
      CancelCheckOrder() {
        let data = {
          sid: this.basicInfo.id,
          wagedom: this.basicInfo.wagedom,
          area: this.area
        };

        this.$axios({
          method: "put",
          url: this.$store.state.wcWebApi + "api/ExAxpline/CancelCheckOrder",
          data,
          loading: true,
          tip: true
        }).then(result => {
          if (result.data.resultstatus == 0) {
            this.basicInfo.dzstatus = 800;
            this.basicInfo.dzstatusCn = "未审核";
            this.$emit("dzstatusChange", 800);
          }
        });
      },
      sortWageList() {
        // 将应收应付费用按 wagedom "航线 > 空出 > 客服 > 延伸 > 其他" 的顺序排列
        let wagedomIndex = ["航线", "空出", "客服", "延伸"];
        function wagedomSort(a, b) {
          var aindex = wagedomIndex.indexOf(a.wagedom);
          var bindex = wagedomIndex.indexOf(b.wagedom);
          if (aindex == -1) return 1;
          if (bindex == -1) return -1;
          return aindex <= bindex ? -1 : 1;
        }
        this.resultData.wageinList.sort(wagedomSort);
        this.resultData.wageoutList.sort(wagedomSort);

        // 根据结算对象排序
        function wtkhnameSort(p, v) {
          if (!p[v.wtkhname]) p[v.wtkhname] = [v];
          else p[v.wtkhname].push(v);
          return p;
        }

        let inObj = this.resultData.wageinList.reduce(wtkhnameSort, {});
        let outObj = this.resultData.wageoutList.reduce(wtkhnameSort, {});
        console.log(inObj)
        console.log(outObj)
        let [wageinList, wageoutList] = [inObj, outObj].map(Obj =>
          [].concat(
            ...Object.values(Obj).map(wtkhArr => wtkhArr.sort(wagedomSort))
          )
        );

        this.resultData.wageinList = wageinList;
        this.resultData.wageoutList = wageoutList;
      },
      //核对模式
      checkModel() {
        let wageoutItemsArr = this.resultData.wageoutListArr.flat().map(i => i.items),
          wageinListCopy = this.resultData.wageinListArr.flat().slice(),
          wageoutListCopy = this.resultData.wageoutListArr.flat().slice();

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
            this.toolTip.push(outItem.isfree == 1 ? -outItem.realwageallRmb : "");
            return;
          }

          let inItem = wageinListCopy.splice(inIndex, 1, null)[0];
          let outItem = wageoutListCopy.splice(outIndex, 1, null)[0];

          this.wageinSortLine.push(inItem);
          this.wageoutSortLine.push(outItem);
          let money = 0;
          if (inItem.isfree == 1) {
            money += inItem.realwageallRmb;
          }
          if (outItem.isfree == 1) {
            money -= outItem.realwageallRmb;
          }

          this.toolTip.push(money.toFixed(2));
        });

        // 添加剩余未匹配的费用
        for (let item of wageinListCopy) {
          if (item) {
            this.wageinSortLine.push(item);
            this.wageoutSortLine.push({});
            this.toolTip.push(item.isfree == 1 ? item.realwageallRmb : "");
          }
        }
      },
      onScroll(e, position) {
        this.position = position;
        let tableWrap = $(this.$el).find(".tableWrap");
        if (tableWrap.length > 0) {
          tableWrap.scrollLeft(position.scrollLeft);
        }
      },
      hsCard() {
        let data = {
          sid: this.basicInfo.id,
          wagedom: this.basicInfo.wagedom,
          area: this.area
        };

        this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/HsCard",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          if (result.data.resultstatus == 0) {
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .orderDetail {
    //width: 1300px;
    margin: 0 auto;

    .detail {
      margin-bottom: 20px;
      border: 1px solid #e8e8e8;

      /deep/ .commonTable {
        div {
          padding-bottom: 0 !important;
        }

        span {
          padding: 0 5px;
        }
      }

      .detail-title {
        height: 36px;
        line-height: 36px;
        text-indent: 12px;
        font-size: 14px;
        font-weight: bolder;
        color: #0f5a8c;
        border-bottom: 1px solid #e8e8e8;

        p {
          display: inline;
        }

        span {
          float: right;
          margin-right: 10px;
        }
      }

      .detail-c {
        padding: 20px;
      }

      .basicInformation {
        .el-row {
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }

          p {
            color: green;

            &.red {
              color: red;
            }

            span {
              display: inline-block;
              width: 130px;
              text-align: right;
              margin-right: 5px;
              color: #606266;
            }
          }
        }
      }
    }

    .check-mode {
      margin: 10px 0;
      overflow: hidden;

      .el-switch {
        float: right;
      }

      /deep/.el-switch__label {
        color: #090;
      }

      /deep/.el-switch__label.is-active {
        color: #ff4949;
      }
    }

    .wageInformation,
    .wageCheckMode {
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

          .wageintotal,
          .wageouttotal,
          .profittotal {
            height: 42px;
            line-height: 42px;
            font-weight: bold;
          }

          padding: 0 20px 20px;
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

          .wageintotal {
            color: @wageincolor;
          }
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

          .wageouttotal {
            color: @wageoutcolor;
          }
        }
      }

      .toolTip {
        @tooltipcolor: orange;

        .title {
          background: @tooltipcolor;

          &:after {
            border-bottom: 35px solid @tooltipcolor;
          }

          &.active {
            background: @tooltipcolor;

            &:after {
              border-bottom: 35px solid @tooltipcolor;
            }
          }
        }
      }
    }

    .wageCheckMode {
      overflow: hidden;
      margin-bottom: 20px;

      .wage_content {
        width: 540px;
        float: left;
        margin-right: 10px;
        height: 100%;

        .wageintotal {
          color: #00cc00;
        }

        .wageouttotal {
          color: #ff3300;
        }

        .profittotal {
          background: orange;
          color: white;
          text-align: center;
        }

        .content {
          padding: 15px 0;

          .tableWrap {
            width: 538px;
            overflow: auto;
            margin-top: 12px;

            table {
              border-collapse: collapse;
              table-layout: fixed;
              width: 100%;

              tr {
                height: 32px;
              }

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
      }

      .toolTip {
        width: 200px;
        margin-right: 0px;

        .content {
          border: 1px solid orange;
        }

        .tableWrap {
          width: 198px !important;
        }
      }
    }

    .feeInformation {
      @height: 40px;

      //  height: @height;
      .left,
      .right {
        display: inline-block;
        // height: @height;
        // margin-right: 40px;
        vertical-align: top;
        width: 100%;

        p {
          color: #ff6600;
        }
      }

      .left p {
        font-size: 15px;
        font-weight: bold;
        line-height: 30px;
        display: grid;
        grid-template-columns: 80px 310px 300px 310px 340px auto;
        justify-content: space-between;
      }

      .right p {
        display: inline-block;
        min-width: 170px;
        font-size: 12px;

        //  line-height: @height / 2;
        span {
          color: #000;
        }
      }
    }

    .footer {

      // margin: 10px 0;
      .btn-c {
        margin: 10px 0;
        overflow: hidden;

        .left-btn {
          float: left;
        }

        .right-btn {
          float: right;
        }

        .node-btn {
          float: left;
          margin-left: 40px;
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