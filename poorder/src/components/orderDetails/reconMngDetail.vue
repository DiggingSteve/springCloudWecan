<template>
  <div class="costDetail" style="margin:0 auto">
    <!-- {{accountcomgid}} -->
    <!-- {{dzdMakeD}} -->
    <!-- {{area}} -->
    <!-- {{ inputModelData }} -->
    <div
      style="overflow: hidden;margin-bottom:10px;"
      v-if="(wageinout == '2' || wageinout == '1') && !tranMethod"
    >
      <el-button
        style="float:right;"
        type="primary"
        @click="uploadExcelDialog = true"
        >导入对账</el-button
      >
    </div>
    <div class="detail search" v-if="!tranMethod">
      <div class="detail-title">
        <p>查询条件</p>
      </div>
      <div class="detail-c">
        <newFormCmpt
          class="searchCmpt-c"
          :view-data.sync="inputViewData"
          :model-data.sync="inputModelData"
          :search-data.sync="searchData"
          :pagetype="1"
          :exForm="true"
        >
        </newFormCmpt>
        <div class="btn-c">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </div>

  <div v-if="markTip" style="margin-bottom:16px">
    <p>
      <span>开票方式：</span>
      <el-radio v-model="invoiceType" label="1">离线开票</el-radio>
      <el-radio v-model="invoiceType" label="2">直连纸质发票</el-radio>
      <el-radio v-model="invoiceType" label="3">直连电子发票</el-radio>
    </p>
  </div>
    <!--     {{costListData}} -->
    <div class="detail mawbCharge">
      <div class="detail-title">
        <p>结算对象</p>
      </div>
      <div class="detail-c">
        <!-- 结算对象c -->
        <commonTable
          class="commonTable"
          :head="settleListHead"
          :table-data="sjcAllData"
        >
          <template slot="checkboxo" slot-scope="props"
            ><input
              type="checkbox"
              :value="props.data.row.accountgid"
              v-model="jsValue"
              ref="test"
              :disabled="props.data.disabled"
          /></template>

          <template slot="num" slot-scope="props">{{
            sjcAllData[props.data.index].jobnolist.length
          }}</template>

          <template slot="dwageall" slot-scope="props">
            {{ getDwage(props.data.row, "1", "dwageall") }}
          </template>

          <template slot="leastwageall_checkbill" slot-scope="props">
            {{ getDwage(props.data.row, "1", "leastwageall_checkbill") }}
          </template>
        </commonTable>
      </div>
    </div>

    <div class="detail mawbCharge">
      <div class="detail-title">
        <p>
          订单号&nbsp;&nbsp;&nbsp;&nbsp;共{{
            jobListData ? jobListData.filter(i => !i.thisListHide).length : ""
          }}票
          <span style="margin-left:28px"
            >已选订单票数：{{ jobListData.filter(i => i.checked).length }}</span
          >
          <el-input
            placeholder="订单筛选"
            style="width:150px;float:right;margin-right:20px;"
            v-model="order"
            @input="filterOrder(order)"
          ></el-input>
        </p>
      </div>

      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="jobListHead"
          :table-data="jobListData"
          v-if="system == '空出'"
          isMultiSelect
          @multiSelectChange="changeJob"
          @multiSelectCheckAll="changeJobAll"
          :allchecked="allcheckedJob"
          :defaultSelectRowIndex="defaultSelectRowIndex"
        >
          <template slot="dwageall" slot-scope="props">
            {{ getDwage(props.data.row, "2", "dwageall") }}
          </template>

          <template slot="leastwageall_checkbill" slot-scope="props">
            {{ getDwage(props.data.row, "2", "leastwageall_checkbill") }}
          </template>
        </commonTable>

        <!--         <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="orderValue"
              @change="getCostList(props.data.index,props.data.firstParentIndex)"></template>
        </commonTable> -->

        <!-- 订单号c -->
        <commonTable
          class="commonTable"
          :head="jobListHeaddl"
          :table-data="jobListData"
          v-else
          isMultiSelect
          @multiSelectChange="changeJob"
          @multiSelectCheckAll="changeJobAll"
          :defaultSelectRowIndex="defaultSelectRowIndex"
        >
          <!--  <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="orderValue"
              @change="getCostList(props.data.index,props.data.firstParentIndex)"></template> -->
          <template slot="dwageall" slot-scope="props">
            {{ getDwage(props.data.row, "2", "dwageall") }}
          </template>
          <template slot="chat" >
            <span>通讯</span>
          </template>
          <template slot="note" slot-scope="props">
            <!-- props.data.row -->
        <el-badge is-dot class="item"  v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "   :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
            <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
        </el-badge>
          </template>
          <template slot="leastwageall_checkbill" slot-scope="props">
            {{ getDwage(props.data.row, "2", "leastwageall_checkbill") }}
          </template>
          
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
        <p style="width:100%">
          费用明细&nbsp;&nbsp;&nbsp;&nbsp;共{{ i ? i.length : "" }}条
          <span style="margin-left:28px"
            >订舱编号：{{ jobListData[index].pono }}</span
          >
          <span style="margin-left:18px"
            >总运单号：{{ jobListData[index].mawb }}</span
          >
          <span
            style="margin-left:18px"
            v-if="jobListData[index].czlx == '自货'"
          >
            运价类型：{{
              getWageAllin(jobListData[index].isinwageallin)
            }}&nbsp;&nbsp; 单价：{{
              jobListData[index].inwageallinprice != "666666"
                ? jobListData[index].inwageallinprice.toFixed(2)
                : "--"
            }}
          </span>
          <span style="margin-left:18px">
            目的港：{{ jobListData[index].mdg }}
          </span>
          <el-button
            style="float:right;margin-right:8px;margin-top:3px;"
            type="primary"
            @click="addBohui(i[0].jobid)"
            v-if="wageinout == '1' || (wageinout == '2' && !tranMethod)"
            :disabled="
              i.filter(item => item.system != '空出' || item.wagedom == '调账')
                .length > 0
            "
            >新增并驳回</el-button
          >
        </p>
      </div>
      <!-- 费用明细c -->
      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="costListHead"
          :table-data="i"
          :paginationShow="true"
          isMultiSelect
          @multiSelectChange="changeCost"
          @multiSelectCheckAll="changeCostAll($event, index)"
          allchecked
        >
          <template slot="bohuiAll" slot-scope="props">
            <i
              class="el-icon-shenhebohui"
              title="批量驳回"
              @click="mawbDetail(i, '2')"
              style="font-size:14px;margin-left:4px;"
              v-if="projectIsWecan && !mawbChargeBohuiChecked(i) && isSponsor"
            ></i>
          </template>
          <template slot="bohui" slot-scope="props">
            <i
              class="el-icon-shenhebohui"
              :style="setBhiconColor(props.data.row.status)"
              :title="setBhiconColor(props.data.row.status, 2)"
              @click="mawbDetail(props.data.row)"
              v-if="
                projectIsWecan &&
                  (isSponsor
                    ? props.data.row.isshare < 0 &&
                      props.data.row.finishwageall_checkbill === 0
                    : props.data.row.status != -1 ||
                      props.data.row.dwageall == props.data.row.realwageall ||
                      props.data.row.status != 500) &&
                  props.data.row.items != '利润分成' &&
                  props.data.row.finishwageall_checkbill === 0
              "
              :icondisabled="
                (props.data.row.system != '空出' &&
                  props.data.row.system != '国内服务') ||
                  (props.data.row.isshare > 0 &&
                    props.data.row.wagedom != '调账') ||
                  (jobListData[index].tzType != '单票' &&
                    props.data.row.wagedom == '调账')
              "
            ></i>
          </template>
          <template slot="dwageall" slot-scope="props">
            <el-input
              v-model="props.data.row.dwageall"
              @change="listenNum(props.data.row)"
              onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
              oninput="value=value.replace(/[^\d.]/g,'')"
              :precision="2"
              style="text-align:center"
              ref="nowCheckAmount"
            />
          </template>

          <!--   <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="costValue"
              @change="costHandle(props.data.indexAll,props.data.index)"></template> -->
          <!--           <template slot="dwageall" slot-scope="props">
            <el-input v-model="props.data.row.dwageall" @blur="getdwageall(props.data.row.dwageall,props.data.index,props.data.indexAll)"
              style='width:120px;' :disabled="wageinout==1?true:false" v-verify="'integer'"></el-input>
          </template> -->
        </commonTable>
      </div>
    </div>

    <el-row>
      <el-col :span="8">
        <p>
          <span class="label">操作人：{{ usrname }}</span>
          <span class="value color-green"></span>
        </p>
      </el-col>
      <el-col :span="8">
        <p>
          <span class="label">操作日期：{{ todaydate }}</span>
          <span class="value color-green"></span>
        </p>
      </el-col>
      <el-col :span="8" style="text-align:right">
        <el-button @click="printF(1)" type="primary" v-if="tranMethod != 'Fob'"
          >生成对账单</el-button
        >
        <el-button @click="printF(2)" type="primary" v-if="tranMethod == 'Fob'&&!markTip"
          >生成账单</el-button
        >
         <el-button @click="printF(3)" type="primary" v-if="tranMethod == 'Fob'&&markTip"
          >生成发票</el-button
        >

        <el-button @click="back">返回</el-button>
      </el-col>
    </el-row>

    <div
      class="detail mawbCharge"
      style="margin-top:20px;"
      v-if="tranMethod != 'Fob' && wageinout !== '2'"
    >
      <div class="detail-title">
        <p>对账单记录</p>
      </div>
      <div class="detail-c">
        <commonTable
          class="commonTable"
          :head="dzRecorderHead"
          :table-data="dzRecorderListData"
        >
          <template slot="pchno" slot-scope="props"
            ><span
              style="color:green"
              @click="singleDzDataInfo(props.data.index)"
              >{{ props.data.value }}</span
            ></template
          >
          <template slot="cancelDz" slot-scope="props">
            <el-button @click="cancelDz(props.data.index)">取消对账</el-button>
          </template>
        </commonTable>
      </div>
    </div>

    <!-- 单条对账记录信息弹框 -->
    <!-- <el-dialog width="1260px" top="4%" center :visible.sync="singleDzInfo" v-if="singleDzInfo" append-to-body>

      <singleDz :singleDzData="singleDzData" :system="system" :area="area"></singleDz>

    </el-dialog> -->

    <!-- 生成对账单非Fob -->
    <el-dialog
      width="1300px"
      top="4%"
      center
      :visible.sync="dzdMakeS"
      v-if="dzdMakeS"
      append-to-body
    >
      <dzdMake
        :dzdMakeD="dzdMakeD"
        v-if="dzdMakeS"
        @Unvisible="printClose"
        :system="system"
        :area="area"
      ></dzdMake>
    </el-dialog>

    <!-- 生成发票 -->
     <el-dialog
      width="1300px"
      top="4%"
      center
      :visible.sync="invoiceMake"
      v-if="invoiceMake"
      append-to-body
    >
    <invoicemake :information="dzdMakeD" wageinout="1" @UnVisibleInvoice="printClose" :system="system"  :area="area" :markTip="markTip" :invoiceType="invoiceType"></invoicemake>
    </el-dialog>

    <!-- 生成账单Fob -->
    <el-dialog
      width="1300px"
      top="4%"
      center
      :visible.sync="dzdMakeFob"
      v-if="dzdMakeFob"
      append-to-body
    >
      <accountMakeFob
        :dzdMakeD="dzdMakeD"
        v-if="dzdMakeFob"
        @Unvisible="printClose"
        :system="system"
        :area="area"
        :wageinout="wageinout"
      ></accountMakeFob>
    </el-dialog>

    <!-- 取消对账弹框 -->
    <el-dialog
      width="400px"
      top="4%"
      center
      :visible.sync="abanDz"
      v-if="abanDz"
      append-to-body
      @close="abanDz = false"
      class="cancelDzReason"
    >
      <div style="text-align:center">
        <p style="margin-bottom:18px;text-align:left;font-size:14px;">
          取消理由:
        </p>
        <el-input
          type="textarea"
          v-model="abanreason"
          class="input-required"
          v-if="abanDz"
          :autosize="{ minRows: 6 }"
        ></el-input>

        <p style="text-align:center;margin-top:18px;">
          <el-button @click="cancelDzF">确定</el-button>
          <el-button @click="abanDz = false">取消</el-button>
        </p>
      </div>
    </el-dialog>

    <el-dialog
      title="导入对账"
      width="700px"
      top="4%"
      center
      custom-class="uploadExcelDialog"
      :visible.sync="uploadExcelDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="uploadExcelDialog-c">
        <el-row>
          <el-col :span="12">
            <span class="label">结算对象：</span>
            <!-- {{uploadExcelData.accountgid}} -->
            <!-- :pagetype="uploadExcelData.wageinout == '2' ? 13 : 12" -->
            <page-select
              class="pageSelect"
              :modelval.sync="uploadExcelData.accountgid"
              pagetype="13"
              @change="pageSelectChange"
              :wageinout="uploadExcelData.wageinout"
            ></page-select>
          </el-col>
          <el-col :span="12">
            <span class="label">收付类型：</span>
            <el-select v-model="uploadExcelData.wageinout">
              <el-option
                :value="1"
                :label="'应收'"
                :disabled="wageinout == '2'"
              ></el-option>
              <el-option
                :value="2"
                :label="'应付'"
                :disabled="wageinout == '1'"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <span class="label">模板：</span>
            <el-select v-model="uploadExcelData.importType">
              <el-option
                :value="'总运单明细导入'"
                :label="'总运单明细导入'"
              ></el-option>
              <el-option
                :value="'总运单汇总导入'"
                :label="'总运单汇总导入'"
              ></el-option>
              <el-option
                :value="'总运单导入'"
                :label="'总运单导入'"
              ></el-option>
              <el-option
                :value="'订单号明细导入'"
                :label="'订单号明细导入'"
              ></el-option>
              <el-option
                :value="'订单号汇总导入'"
                :label="'订单号汇总导入'"
              ></el-option>
              <el-option
                :value="'订单号导入'"
                :label="'订单号导入'"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <span class="label">供应商确认人：</span>
            <el-input v-model="uploadExcelData.confirmman"></el-input>
          </el-col>
          <el-col :span="12">
            <span class="label">供应商确认日期：</span>
            <el-date-picker
              v-model="uploadExcelData.confirmdate"
              value-format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <span class="label">备注：</span>
            <el-input
              v-model="uploadExcelData.remark"
              type="textarea"
            ></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <span class="label">选择文件：</span>
            <el-upload
              class="upload-excel"
              :show-file-list="false"
              :http-request="selectExcel"
              action=""
            >
              <el-button size="small" type="primary">选择文件</el-button>
              <div
                class="el-upload__tip"
                slot="tip"
                v-if="uploadExcelData.excelFile"
              >
                {{ uploadExcelData.excelFile.name }}
              </div>
            </el-upload>
            <p class="import-type" @click="importTypeDoc = true">
              导入格式说明
            </p>
          </el-col>
        </el-row>

        <div class="btn-c">
          <el-button @click="uploadExcelDialog = false">返回</el-button>
          <el-button
            type="primary"
            :disabled="disabledUploadBtn"
            @click="uploadExcel"
            >导入</el-button
          >
        </div>

        <div class="import-type-doc" v-show="importTypeDoc">
          <div class="choose">
            <el-radio v-model="importTypeDocChoose" label="总运单"></el-radio>
            <el-radio v-model="importTypeDocChoose" label="订单号"></el-radio>
          </div>
          <div class="type-item">
            <div class="type-label">
              {{ importTypeDocChoose }}明细导入：
              <el-button type="primary" @click="importTypeTemplateDownload(1)"
                >模板下载</el-button
              >
            </div>
            <table class="type-demo">
              <tr>
                <td>{{ importTypeDocChoose }}</td>
                <td>服务项目1</td>
                <td>服务项目2</td>
                <td>...</td>
              </tr>
              <tr>
                <td>写入相关{{ importTypeDocChoose }}</td>
                <td>相关金额</td>
                <td>相关金额</td>
                <td></td>
              </tr>
              <tr>
                <td>...</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="type-item">
            <div class="type-label">
              {{ importTypeDocChoose }}汇总导入：
              <el-button type="primary" @click="importTypeTemplateDownload(2)"
                >模板下载</el-button
              >
            </div>
            <table class="type-demo">
              <tr>
                <td>{{ importTypeDocChoose }}</td>
                <td>总金额</td>
              </tr>
              <tr>
                <td>写入相关{{ importTypeDocChoose }}</td>
                <td>相关金额</td>
              </tr>
              <tr>
                <td>...</td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="type-item">
            <div class="type-label">
              {{ importTypeDocChoose }}导入：
              <el-button type="primary" @click="importTypeTemplateDownload(3)"
                >模板下载</el-button
              >
            </div>
            <table class="type-demo">
              <tr>
                <td>{{ importTypeDocChoose }}</td>
              </tr>
              <tr>
                <td>写入相关{{ importTypeDocChoose }}</td>
              </tr>
              <tr>
                <td>...</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <el-button @click="importTypeDoc = false">返回</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="对账驳回"
      width="950px"
      top="60px"
      center
      custom-class="excelResultDialog"
      v-if="
        excelResultDialog && excelResult.data && excelResult.data.length > 0
      "
      :visible.sync="excelResultDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="excelResultDialog-c">
        <!-- {{excelResult}} -->
        <div class="accountname">
          {{ excelResult.data[0].accountname }}
          <span style="margin-left: 20px;font-size:12px;color:#606266;"
            >成功：{{ uploadExcelSuccessCount }}条，失败{{
              uploadExcelFaildCount
            }}条</span
          >
          <el-button style="float:right;" @click="ExportExcelResultData"
            >导出Excel</el-button
          >
        </div>
        <div class="excelResultTable-c">
          <table class="excelResultTable">
            <tr>
              <td>
                <input type="checkbox" v-model="selectAllFaildData" />
              </td>
              <td>原因</td>
              <td>总运单</td>
              <td>订单号</td>
              <td>系统费用总计</td>
              <td>导入费用总计</td>
              <td>对账状态</td>
              <td>失败原因</td>
            </tr>
            <tr v-for="(item, index) in excelResultPageData" :key="index">
              <td>
                <input
                  type="checkbox"
                  v-if="item.isNeedReject"
                  v-model="excelResultSelectedData"
                  :value="item"
                />
              </td>
              <td>
                <i
                  class="el-icon-setting"
                  @click="
                    openWageBackReasonDialog(
                      (excelResultCurrentPage - 1) * 20 + index
                    )
                  "
                ></i>
              </td>
              <td>{{ item.mawb }}</td>
              <td>{{ item.jobno }}</td>
              <td>{{ item.wageall }}</td>
              <td>{{ item.importWageall }}</td>
              <td :style="{ color: item.isSuccess ? '#00cc00' : 'red' }">
                {{ item.isSuccess ? "成功" : "失败" }}
              </td>
              <td>
                <el-tooltip
                  effect="dark"
                  :content="item.delbillreason"
                  placement="top"
                >
                  <p>{{ item.delbillreason }}</p>
                </el-tooltip>
              </td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <el-pagination
            :current-page.sync="excelResultCurrentPage"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            :total="excelResult.data.length"
          >
          </el-pagination>
          <!-- <el-button type="primary" @click="CheckBillRejectWageOut"
            >驳回对账失败订单</el-button
          > -->
        </div>
      </div>
    </el-dialog>

    <el-dialog
      width="900px"
      top="4%"
      center
      custom-class="wageBackReasonDialog"
      :visible.sync="wageBackReasonDialog"
      v-if="excelResult.data && excelResult.data.length > 0"
      append-to-body
    >
      <div class="wageBackReasonDialog-c">
        <h3 class="title">原因</h3>
        <p class="orderNo">
          {{ excelResult.data[wageBackReasonIndex].mawb }}
        </p>

        <div class="reason-c">
          <!-- <P class="mawb">总运单号：{{ excelResult.data[wageBackReasonIndex].mawb }}</P> -->
          <P class="accountname">{{
            excelResult.data[wageBackReasonIndex].accountname
          }}</P>
          <el-input
            type="textarea"
            v-model="excelResult.data[wageBackReasonIndex].delbillreason"
            class="input-required"
            :autosize="{ minRows: 4 }"
            style="margin-top:12px;color:#c8c8c8"
            :disabled="true"
          ></el-input>

          <div
            class="accountNameItems"
            v-if="
              excelResult.data[wageBackReasonIndex].delbillreasonJson.length > 0
            "
          >
            <div style="width:800px;overflow:hidden;display:inline-block">
              <ul
                class="costItemsList"
                style="overflow:scroll;overflow-x:auto;overflow-y:hidden;white-space: nowrap"
              >
                <li
                  v-for="(item, index) in excelResult.data[wageBackReasonIndex]
                    .delbillreasonJson"
                  :key="index"
                  :style="{ color: costItemsActive == index ? '#004d84' : '' }"
                  @click="costItemsActive = index"
                >
                  <el-badge
                    is-dot
                    :class="['item', { primary: item.isNeedReject == false }]"
                    v-if="item.delbillreason"
                    >{{ item.items }}</el-badge
                  >
                  <span v-else>{{ item.items }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="costItemsContent"
            style="margin-top:16px;"
            v-if="
              excelResult.data[wageBackReasonIndex].delbillreasonJson.length > 0
            "
          >
            <ul>
              <li>人民币金额</li>
              <li>单价</li>
              <li>数量</li>
              <li>货币</li>
            </ul>
            <ul style="margin-top:3px;">
              <li>
                {{
                  Number(
                    excelResult.data[wageBackReasonIndex].delbillreasonJson[
                      costItemsActive
                    ].realwageall
                  ).toFixed(2)
                }}
              </li>
              <li>
                {{
                  Number(
                    excelResult.data[wageBackReasonIndex].delbillreasonJson[
                      costItemsActive
                    ].price
                  ).toFixed(2)
                }}
              </li>
              <li>
                {{
                  Number(
                    excelResult.data[wageBackReasonIndex].delbillreasonJson[
                      costItemsActive
                    ].num
                  ).toFixed(2)
                }}
              </li>
              <li>
                {{
                  excelResult.data[wageBackReasonIndex].delbillreasonJson[
                    costItemsActive
                  ].currency
                }}
              </li>
            </ul>
            <el-input
              type="textarea"
              v-model="
                excelResult.data[wageBackReasonIndex].delbillreasonJson[
                  costItemsActive
                ].delbillreason
              "
              class="input-required"
              :autosize="{ minRows: 4 }"
              style="margin-top:16px;color:#c8c8c8"
              :disabled="true"
            ></el-input>
          </div>
        </div>
      </div>
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
            name="reconMngDetail"
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
      <!--     {{bohuiAddDialog}} -->
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
        :wageinout="wageinout"
        @reSearch="getReconDeatil"
      ></costComtab>
    </el-dialog>

  </div>
</template>

<script>
import {
  getMomentDate,
  dateFormat,
  formatDate,
  StringNum
} from "../../api/localStorage.js";
import singleDz from "./singleDz";
import dzdMake from "./dzdMake";
import accountMakeFob from "./accountMakeFob";
import invoicemake from "./invoiceMake";
import costComtab from "../templates/costComtab";
import { myCommonTable, setBhiconColorMixin } from "@/common/detailPagesMixin";
import { log } from '../../outsideDom/api/updateLog.js';

export default {
  components: {
    singleDz,
    dzdMake,
    accountMakeFob,
    myCommonTable,
    costComtab,
    invoicemake
  },
  mixins: [setBhiconColorMixin],
  props: {
    jobid: "",
    system: "",
    wageinout: "",
    reconDetailStatus: false,
    area: {
      type: String,
      default: ""
    },
    tranMethod: "",
    gid: "",
    selectgid: "",
    accountcomgid: "",
    markTip:''
  },
  data() {
    return {
      chatRoom:{
        showStatus:false
      },
      jsValue: [], //结算对象多选
      dwageallValue: "",
      reconOpen: false, //对账确认弹框
      dzdMakeS: false, //生成对账单
      dzdMakeFob: false, //账单
      singleDzInfo: false, //单条已对账信息
      uploadExcelDialog: false, // 导入应付对账excel
      excelResultDialog: false, // 导入对账后返回的结果
      wageBackReasonDialog: false, // 费用驳回原因
      reconInfo: {
        confirmman: "",
        confirmdate: "",
        czman: localStorage.getItem("usrname"),
        czdate: getMomentDate(),
        confirmremark: ""
      },

      jobListData: [], //订单List
      costListData: [], //费用List
      usrname: localStorage.getItem("usrname"), //操作人
      settleListHead: [
        { field: "checkboxo", title: "请选择" },
        { field: "accountname", title: "结算对象" },
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "dwageall", title: "当前对账金额" },
        { field: "num", title: "订单数" },
        { field: "name", title: "联系人姓名" },
        { field: "mobile", title: "联系电话" },
        { field: "email", title: "联系邮箱" }
      ],

      jobListHead: [
        { field: "pono", title: "订舱编号", sort: true },
        { field: "mawb", title: "总运单号", sort: true },
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "hawb", title: "分运单号", sort: true },
        { field: "hbrq", title: "航班日期", sort: true },
        { field: "sfg", title: "始发港" },
        { field: "mdg", title: "目的港" },
        { field: "realjzt", title: "实际件重体" },
        { field: "hbh", title: "航班号" },
        // {field: "hbrq", title: "航班日期"},
        { field: "dwageall", title: "当前对账金额" },
        { field: "orderno", title: "订单来源号" }
      ],
      jobListHeaddl: [
        { field: "pono", title: "订舱编号", sort: true },
        { field: "mawb", title: "总运单号", sort: true },
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "hawb", title: "分运单号", sort: true },
        { field: "hbrq", title: "航班日期", sort: true },
        { field: "dwageall", title: "当前对账金额" },
        { field: "orderno", title: "订单来源号" }
      ],
      costListHead: [
        // {field: "pono", title: "订舱编号"},
        // {field: "mawb", title: "总运单号"},
        // {field: "addman", title: "创建人"},
        { field: "items", title: "服务项目" },
        { field: "confirmman", title: "确认人" },
        { field: "dwageall", title: "当前对账金额" },
        { field: "realwageall", title: "金额" },
        { field: "leastwageall_checkbill", title: "剩余金额" },
        { field: "price", title: "单价" },
        { field: "num", title: "数量" },
        { field: "currency", title: "币种" },
        { field: "realwageallrmb", title: "人民币总额" },
        { field: "wagehawb", title: "分运单号" },
        { field: "wageremark", title: "费用备注" },
      ],

      dzRecorderHead: [
        { field: "pchno", title: "对账单号" },
        { field: "billstatus", title: "对账状态" },
        { field: "accountcomname", title: "结算对象" },
        { field: "currency", title: "币种" },
        { field: "billwageall", title: "对账总额" },
        { field: "billwageallrmb", title: "对账人民币总额" },
        { field: "pzfinishwageall", title: "完成总额" },
        { field: "pzfinishwageallrmb", title: "完成人民币总额" },
        {
          field: "confirmman",
          title: this.wageinout == 1 ? "客户对账人" : "供应商对账人"
        },
        {
          field: "confirmdate",
          title: this.wageinout == 1 ? "客户对账时间" : "供应商对账时间"
        },
        { field: "ourconfirmman", title: "我司对账人" },
        { field: "ourconfirmdate", title: "我司对账时间" },
        { field: "cancelDz", title: "取消对账" }
      ],
      sjcAllData: [], //查询初始数据
      dzRecorderListData: [], //已对账记录List查询
      backupAllData: [], //查询初始数据备份
      dzdMakeD: {}, //生成对账单
      abanDz: false, //取消对账弹框
      abanreason: "", //取消对账原因
      cancelIndex: "", //取消对账Index
      order: "",

      importTypeDoc: false,
      importTypeDocChoose: "总运单",

      searchType: "",
      uploadExcelData: {
        accountgid: "",
        accountcomgid: "",
        wageinout: this.wageinout == "1" ? 1 : 2,
        importType: "总运单明细导入",
        confirmman: "",
        confirmdate: "",
        remark: "",
        excelFile: ""
      },
      excelResult: {},
      excelResultSelectedData: [],
      excelResultCurrentPage: 1,
      wageBackReasonIndex: 0,
      costItemsActive: 0,
      disabledUploadBtn: false,
      inputViewData: {
        pono: { title: "订舱编号", type: 1, whereStr: "like" },
        mawb: { title: "总运单号", type: 1, whereStr: "like" },
        hbh: { title: "航班号", type: 1, whereStr: "like" },
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: !this.jobid && this.accountcomgid ? false : true
        },
        settdate: { title: "结算日期", type: 15 },
        czlx: { title: "操作类型", type: 4, groupid: 132, fieldtype: 3 },
        fid: { title: "委托客户", type: 11, linkage: "gid" },
        gid: { title: "项目", type: 10 },
        accountcomgid: { title: "结算对象", type: 20, pagetype: 12 },
        items: { title: "服务项目", type: 20, pagetype: 5 },
        currency: { title: "币种", type: 4, options: [] },
        wecan_rel_name: { title: "结算负责人", type: 1 },
        oldmawb: { title: "原总运单号", type: 1, whereStr: "like" },
        wageremark: { title: "备注", type: 1, whereStr: "like" }
        //wageinout:{title:'收付类型',type:4,options:[{label:'应收',value:'1'},{label:'应付',value:'2'}], hidden: true},
      },
      inputModelData: {
        wageinout: this.wageinout
      },
      searchData: {},
      allcheckedJob: false, //默认订单号全选
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
      //bohuiAddIndex:'-1',//新增并驳回
      bohuiAddJob: "",
      defaultSelectRowIndex: "-1",
      mawbObject: {}, //订单层数据
      selectCost: [], //选中的费用
      invoiceMake:false,
      invoiceType:'1',//开发票类型
    };
  },

  mounted() {
    console.log("===========00000000==============")
    console.log(this.searchData)
    console.log(this.inputViewData)
    console.log(this.inputModelData)
    console.log("===========00000000==============")


    if (this.wageinout == "1" || this.wageinout == "2") {
      if (!this.jobid && this.accountcomgid) {
        if (this.accountcomgid ) {
           this.$set(this.$parent.$parent.inputModelData,'accountcomgid',this.accountcomgid)
            this.$set(this.$parent.$parent.searchData, 'accountcomgid', this.accountcomgid);
          // this.$parent.$parent.searchData.accountcomgid = this.accountcomgid;
          // this.$parent.$parent.inputModelData.accountcomgid = this.accountcomgid;
        }
        if (
          this.$parent.$parent.inputModelData.hbrq &&
          !this.$parent.$parent.inputModelData.hbrq.begin
        ) {
          let begin = new Date();
          begin.setMonth(begin.getMonth() - 2);
          
          // this.$parent.$parent.searchData.accountcomgid = this.accountcomgid
          this.$parent.$parent.inputModelData.hbrq.begin =
            formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
        }
        Object.keys(this.inputViewData).forEach(i => {
          if (
            Object.keys(this.$parent.$parent.inputModelData).indexOf(i) != "-1"
          ) {
            if (this.$parent.$parent.inputModelData[i]) {
              
              this.$set(this.searchData, i, this.$parent.$parent.searchData[i]);
              this.$set(
                this.inputModelData,
                i,
                this.$parent.$parent.inputModelData[i]
              );
            }
          }
        });
      }

      if (this.selectgid || this.jobid) {
        this.searchType = "jobid";
        console.log(this.jobid);
        this.getReconDeatil();
      } else {
        if (!this.jobid) {
          this.searchType = "where";
          if (this.accountcomgid) {
            this.getReconDeatil();
          } else {
            this.$set(this.searchData, "hbrq", {
              end: formatDate(new Date(), "yyyy-MM-dd")
            });
            this.$set(this.inputModelData, "hbrq", {
              end: formatDate(new Date(), "yyyy-MM-dd")
            });
          }
        }
      }
    }
    // else if(this.wageinout=='2'){
    //   this.searchType = 'where'
    // }
  },

  created() {
    if (!this.area) {
      this.$emit("update:area", this.$store.state.areaState);
    }
    this.inputViewData.currency.options = JSON.parse(
      localStorage.currencyData
    ).map(i => {
      return { label: i.cname, value: i.fcode };
    });

    //this.$set(this.searchData,'hbrq',this.$parent.$parent.inputModelData[i])
    //this.$set(this.inputModelData,i,this.$parent.$parent.inputModelData[i])
  },
  computed: {
    excelResultPageData() {
      return this.excelResult.data.slice(
        (this.excelResultCurrentPage - 1) * 20,
        this.excelResultCurrentPage * 20
      );
    },
    selectAllFaildData: {
      get() {
        return (
          this.excelResultSelectedData.length ===
          this.excelResult.data.filter(i => !i.isSuccess).length
        );
      },
      set(val) {
        if (val) {
          this.excelResultSelectedData = this.excelResult.data.filter(
            i => i.isNeedReject
          );
        } else {
          this.excelResultSelectedData = [];
        }
      }
    },
    uploadExcelSuccessCount() {
      return this.excelResult.data.filter(i => i.isSuccess).length;
    },
    uploadExcelFaildCount() {
      return this.excelResult.data.filter(i => !i.isSuccess).length;
    },

    // 当前时间
    todaydate() {
      return getMomentDate();
    }
    // mawbPaymentBohuiChecked() { //多选时可批量驳回的费用
    //         return this.mawbPayment.filter(i => this.wageguidf.includes(i.guid) && (i.status == -1 || i.status == 500) && i.isshare <= 0)
    // },

    // jobListData(){
    //  var list=[]
    //  if(this.jsValue.length){
    //     return this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0].jobnolist
    //  }else{
    //    return list
    //  }
    // },
    //backJob
  },

  methods: {
    openChatRoome(row){
      this.chatRoom.showStatus = !this.chatRoom.showStatus
      const obj = {
        roomStatus:this.chatRoom.showStatus,
        data:row
      }
      this.$store.commit("setChat", { status: true, data: row });
       //this.$emit('openChatRoome',obj)
    },
    listenNum(residueMoney) {
      var balanceMoney = StringNum(Number(
          residueMoney.realwageall -
          residueMoney.finishwageall_checkbill -
          residueMoney.dwageall
      ),2);
      // console.log(residueMoney.realwageall)
      // console.log(Number(residueMoney.finishwageall_checkbill).toFixed(2))
      // console.log(residueMoney.dwageall)
      // console.log(balanceMoney)
      if (balanceMoney >= 0) {
        residueMoney.leastwageall_checkbill = balanceMoney;
      } else {
        this.$message({
          message: "输入的金额超出对账范围,请重新输入金额",
          type: "error"
        });
      }
    },
    search() {
      this.searchType = "where";
      //this.jobListData=[]
      //this.costListData=[]
      this.jsValue = [];
      //this.orderValue=[]
      //this.costValue=[]
      this.getReconDeatil();
    },
    reset() {
      this.inputModelData = {};
    },
    selectExcel({ file }) {
      if (file) {
        let fileX = file.name.split(".").reverse()[0];
        let fileXyes = false;
        ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw"].forEach(function(value) {
          if (fileX === value) {
            fileXyes = true;
          }
        });
        if (fileXyes) {
          this.uploadExcelData.excelFile = file;
        } else {
          this.$message.error("格式错误！请重新选择");
        }
      }
    },
    getWageAllin(value) {
      var string = "";
      switch (value) {
        case 1:
          string = "单价ALLIN";
          break;
        case 2:
          string = "M级++";
          break;
        case 3:
          string = "单价++";
          break;
        case 4:
          string = "Cost++";
          break;
      }
      return string;
    },

    uploadExcel() {
      if (!this.uploadExcelData.accountgid) {
        return this.$message.error("请选择结算对象");
      }
      if (!this.uploadExcelData.importType) {
        return this.$message.error("请选择模板");
      }
      if (
        !this.uploadExcelData.confirmman ||
        !this.uploadExcelData.confirmdate
      ) {
        return this.$message.error("请输入供应商确认人和确认日期");
      }
      if (!this.uploadExcelData.excelFile) {
        return this.$message.error("请选择文件");
      }
      if (this.$store.state.areaState.indexOf(",") >= 0) {
        return this.$message.error("请选择一个区域");
      }

      let exec = () => {
        file2Xce(this.uploadExcelData.excelFile).then(excelData => {
          let postData = {
            addman: localStorage.getItem("usrname"),
            area: this.$store.state.areaState,
            accountgid: this.uploadExcelData.accountgid,
            accountcomgid: this.uploadExcelData.accountcomgid,
            wageinout: this.uploadExcelData.wageinout,
            confirmman: this.uploadExcelData.confirmman,
            confirmdate: this.uploadExcelData.confirmdate,
            remark: this.uploadExcelData.remark,
            importType: this.uploadExcelData.importType,
            data: []
          };

          // if (this.wageinout == "1") {
          //   postData.accountcomgid = postData.accountgid;
          //   delete postData.accountgid;
          // }

          if (
            this.uploadExcelData.importType === "总运单明细导入" ||
            this.uploadExcelData.importType === "订单号明细导入"
          ) {
            let key = this.uploadExcelData.importType.slice(0, 3);
            excelData.forEach(row => {
              if (!row[key] && !row[key + "号"]) return;
              let item = {
                type: key,
                mawb: "",
                jobno: "",
                wageList: []
              };
              if (key == "总运单") {
                item.mawb = row[key] || row[key + "号"];
              } else if (key == "订单号") {
                item.jobno = row[key];
              }
              Object.keys(row).forEach(wagekey => {
                if (
                  wagekey != key &&
                  wagekey != "" &&
                  Number(row[wagekey]) > 0
                ) {
                  item.wageList.push({
                    items: wagekey,
                    wageall: Number(row[wagekey])
                  });
                }
              });
              postData.data.push(item);
            });
          } else if (
            this.uploadExcelData.importType === "总运单汇总导入" ||
            this.uploadExcelData.importType === "订单号汇总导入"
          ) {
            let key = this.uploadExcelData.importType.slice(0, 3);
            excelData.forEach(row => {
              if (!row[key] && !row[key + "号"]) return;
              let item = {
                type: key,
                mawb: "",
                jobno: "",
                sum: Number(row["总金额"])
              };
              if (key == "总运单") {
                item.mawb = row[key] || row[key + "号"];
              } else if (key == "订单号") {
                item.jobno = row[key];
              }
              postData.data.push(item);
            });
          } else if (
            this.uploadExcelData.importType === "总运单导入" ||
            this.uploadExcelData.importType === "订单号导入"
          ) {
            let key = this.uploadExcelData.importType.slice(0, 3);
            excelData.forEach(row => {
              if (!row[key] && !row[key + "号"]) return;
              let item = {
                type: key,
                mawb: "",
                jobno: ""
              };
              if (key == "总运单") {
                item.mawb = row[key] || row[key + "号"];
              } else if (key == "订单号") {
                item.jobno = row[key];
              }
              postData.data.push(item);
            });
          }

          console.log(postData);
          // return
          // this.$axios({"method":"post",url:'http://192.168.98.203/BoManagementWebApi/'+'api/ExAiraxpCheckBillPchUnFinishImport',data:postData,loading: true,timeout: 6000000})
          this.$axios({
            method: "post",
            url:
              this.$store.state.webApi +
              "api/ExAiraxpCheckBillPchUnFinishImport",
            data: postData,
            loading: true,
            timeout: 6000000
          }).then(result => {
            this.disabledUploadBtn = false;
            let excelResult = JSON.parse(result.data);
            console.log(excelResult);
            // 排序，失败的在前面，成功的在后面
            excelResult.data = [].concat(
              ...excelResult.data.reduce(
                (p, v) => {
                  if (v.isNeedReject === true || v.isSuccess === false) {
                    p[0].push(v);
                  } else {
                    p[1].push(v);
                  }
                  return p;
                },
                [[], []]
              )
            );
            this.excelResult = excelResult;
            // this.excelResult.data = this.excelResult.data.filter(i => i.isSuccess === false)
            this.uploadExcelDialog = false;
            this.excelResultDialog = true;
          });
        });
      };

      function file2Xce(f) {
        return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          var wb; //读取完成的数据
          var rABS = false;
          //f.name.split(".").reverse()[0] == 'csv'

          reader.onload = function(e) {
            var data = e.target.result;
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(data)), {
                //手动转化
                type: "base64"
              });
            } else {
              wb = XLSX.read(data, {
                type: "binary"
              });
            }
            resolve(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
          };

          if (rABS) {
            reader.readAsArrayBuffer(f);
          } else {
            reader.readAsBinaryString(f);
          }
        });
      }

      function fixdata(data) {
        //文件流转BinaryString
        var o = "",
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      }

      // 点击导入按钮后禁用，防止按钮被重复点击
      this.disabledUploadBtn = true;
      this.$store.state.showloading = true;
      // 数据过多时解析excel也需要时间，所以直接将loading显示出来避免延迟
      setTimeout(exec, 0);
    },
    CheckBillRejectWageOut() {
      if (this.excelResultSelectedData.length == 0) {
        return this.$message.error("请选择对账失败订单");
      }
      let data = JSON.parse(JSON.stringify(this.excelResultSelectedData));
      let rejectData = [];
      data.forEach(mawbItem => {
        if (mawbItem.isNeedReject !== true) return;
        mawbItem.delbillreasonJson = mawbItem.delbillreasonJson.filter(
          wageItem => wageItem.isNeedReject === true
        );
        rejectData.push(mawbItem);
      });

      let postData = {
        accountcomname: this.excelResult.data[0].accountname,
        data: rejectData
      };
      console.log(postData);
      // return
      // this.$axios({"method":"post",url:'http://192.168.98.203/BoManagementWebApi/'+'api/ExAiraxpCheckBillRejectWageOut',data:postData,loading: true,noarea: true})
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillRejectWageOut",
        data: postData,
        loading: true,
        noarea: true
      }).then(result => {
        if (result.data.resultstatus == 0) {
          this.wageBackReasonDialog = false;
          this.excelResultDialog = false;
          this.excelResultSelectedData = [];
          this.getReconDeatil();
        }
      });
    },
    pageSelectChange(data) {
      console.log(JSON.stringify(data));
      this.uploadExcelData.accountcomgid = data.fid;
    },
    openWageBackReasonDialog(index) {
      console.log(index);
      this.costItemsActive = 0;
      this.wageBackReasonDialog = true;
      this.wageBackReasonIndex = index;
    },
    /**
     * 模板下载
     * params: type 模板格式
     * 1：明细导入  2：汇总导入  3：单号导入
     */
    importTypeTemplateDownload(type) {
      const { importTypeDocChoose } = this;
      const style = {
        font: { bold: true }
      };

      let formatDate = {};
      if (type == 1) {
        formatDate = {
          "!ref": "A1:C2",
          A1: { v: importTypeDocChoose, s: style },
          A2: { v: "写入相关" + importTypeDocChoose },
          B1: { v: "服务项目1", s: style },
          B2: { v: "相关金额" },
          C1: { v: "服务项目2", s: style },
          C2: { v: "相关金额" }
        };
      } else if (type == 2) {
        formatDate = {
          "!ref": "A1:B2",
          A1: { v: importTypeDocChoose, s: style },
          A2: { v: "写入相关" + importTypeDocChoose },
          B1: { v: "总金额", s: style },
          B2: { v: "相关金额" }
        };
      } else if (type == 3) {
        formatDate = {
          "!ref": "A1:A2",
          A1: { v: importTypeDocChoose, s: style },
          A2: { v: "写入相关" + importTypeDocChoose }
        };
      }

      let filename =
        importTypeDocChoose +
        (type == 1 ? "明细" : type == 2 ? "汇总" : "") +
        "导入";
      this.excelOut(filename, formatDate);
    },
    // 把导入对账之后接口返回的需要数据再导出成excel
    ExportExcelResultData() {
      let formatDate = {};
      // [A, ...F]       共6列
      let col = new Array(6).fill(65).map((v, i) => String.fromCharCode(v + i));
      let tableHead = [
        "总运单",
        "订单号",
        "系统费用总计",
        "导入费用总计",
        "对账状态",
        "失败原因"
      ];
      let tableDataKey = [
        "mawb",
        "jobno",
        "wageall",
        "importWageall",
        "isSuccess",
        "delbillreason"
      ];
      // 表头
      for (let index in tableHead) {
        formatDate[col[index] + "1"] = {
          t: "s",
          v: tableHead[index],
          s: { font: { bold: true }, alignment: { horizontal: "center" } }
        };
      }

      // https://docs.sheetjs.com/#cell-object
      let rowIndex = 2;
      for (let row of this.excelResult.data) {
        for (let i in col) {
          let obj = {};

          if (tableDataKey[i] == "isSuccess") {
            obj = { v: row[tableDataKey[i]] ? "成功" : "失败", t: "s" };

            if (row[tableDataKey[i]]) {
              obj.s = { font: { color: { rgb: "FF00CC00" } } };
            } else {
              obj.s = { font: { color: { rgb: "FFFF0000" } } };
            }
          } else {
            obj = {
              v: row[tableDataKey[i]],
              t: typeof row[tableDataKey[i]] === "number" ? "n" : "s"
            };
          }

          formatDate[col[i] + rowIndex] = obj;
        }
        rowIndex++;
      }
      formatDate["!ref"] = "A1:" + col[col.length - 1] + (rowIndex - 1);
      formatDate["!cols"] = new Array(col.length).fill({ wpx: 100 });
      // 订单号和失败原因加宽一些
      formatDate["!cols"][1] = { wpx: 170 };
      formatDate["!cols"][col.length - 1] = { wpx: 200 };

      this.excelOut("对账驳回", formatDate);
    },
    // 导出excel
    excelOut(filename, sheetData) {
      let tmpWB = {
        SheetNames: ["mySheet"],
        Sheets: {
          mySheet: sheetData
        }
      };

      let excelData = new Blob(
        [
          s2ab(
            XLSX.write(tmpWB, {
              bookType: "xlsx",
              bookSST: false,
              type: "binary"
            })
          )
        ],
        { type: "" }
      );

      let a = document.createElement("a");
      let href = URL.createObjectURL(excelData);
      a.download = filename + ".xlsx";
      a.href = href;
      a.click();
      setTimeout(function() {
        URL.revokeObjectURL(excelData);
        a = null;
      }, 100);

      function s2ab(s) {
        //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
    filterOrder(val) {
      val = val.toLowerCase();

      this.jobListData.forEach((item, index) => {
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
            if (stringN.indexOf(val) == -1) {
              num = num * 1;
            } else {
              num = 0;
            }
          }
        });

        if (num > 0) {
          this.$set(item, "thisListHide", true);
        } else if (num == 0) {
          this.$set(item, "thisListHide", false);
        }
      });
    },
    //已对账弹框
    reconOpenDialog() {
      if (!this.jsValue) {
        return this.$message.error("请选择结算对象");
      } else if (!this.jobListData.filter(i => i.checked).length) {
        return this.$message.error("请选择订单号");
      } else if (!this.costListData.flat().filter(i => i.checked).length) {
        return this.$message.error("请选择费用");
      } else {
        this.reconOpen = true;
      }
    },

    //已对账
    // reconFinish(){

    //         var jobnolist=[]
    //         var orderList=this.orderValue
    //         orderList.forEach((item,index)=>{
    //           if(Number(this.jobListData[item].dwageall)!=0){
    //             jobnolist.push({settjobid:this.jobListData[item].settjobid,wagelist:[]})
    //           this.jobListData[item].wagelist.forEach(item2=>{
    //             this.costValue.forEach(item3=>{
    //               if(this.costListData[item3]==item2){

    //                 jobnolist[index].wagelist.push(item2)

    //               }
    //             })
    //           })
    //           }

    //         })

    //      var data={billid:-1,area:this.area,isdel:'1',settgid:this.sjcAllData[this.jsValue[0]].accountcomgid,accountcomname:this.sjcAllData[this.jsValue[0]].accountcomname,wageinout:this.wageinout,jobnolist:jobnolist,billstatus:1000,system:this.system,confirmman:this.reconInfo.confirmman,confirmdate:this.reconInfo.confirmdate,confirmremark:this.reconInfo.confirmremark}

    //      this.$axios({"method":"POST",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPch',data:data}).then(results=>{
    //      if(results.data.resultstatus==0){
    //       this.jobListData=[]
    //       this.costListData=[]
    //       this.jsValue=[]
    //       this.orderValue=[]
    //       this.costValue=[]

    //       this.getReconDeatil()
    //        this.$message.success(results.data.resultmessage)
    //        this.reconOpen=false
    //        this.getReconDeatil()

    //      }else{
    //        this.$message.error(results.data.resultmessage)
    //      }
    //   }).catch(error=>{

    //   })
    // },

    // 取消对账
    cancelDz(index) {
      if (this.dzRecorderListData[index].pzfinishwageall2 != 0) {
        this.$message("已开凭证无法删除");
        return false;
      } else {
        //this.abanDz=true
        this.cancelDzF();
        this.cancelIndex = index;
      }
    },
    cancelDzF() {
      this.$confirm("是否取消对账?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            area: this.area,
            billid: this.dzRecorderListData[this.cancelIndex].billid,
            system: this.system,
            accountcomname: this.dzRecorderListData[this.cancelIndex]
              .accountcomname
          };

          this.$axios({
            method: "DELETE",
            url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
            data: data
          })
            .then(results => {
              if (results.data.resultstatus == 0) {
                this.abanDz = false;
                this.dzRecorderListData.splice(this.cancelIndex, 1);
                if (this.wageinout == "2") {
                  this.getReconDeatil();
                }
                this.jsValue = [];
                this.$message.success(results.data.resultmessage);
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

    changeJob(data) {

      //$(".sort-check").removeClass("sort-check");
      let rowSecond = this.backupAllData.filter(
        i => i.accountgid == this.jsValue[0]
      )[0]["jobnolist"][data.index];
      let rowFirst = this.backupAllData.filter(
        i => i.accountgid == this.jsValue[0]
      )[0];
      console.log("------------------");
      console.log(rowSecond);
      console.log("------------------");
      if (data.row.checked) {
        this.$set(this.costListData, data.index, data.row.wagelist);
        data.row.leastwageall_checkbill = Number(0).toFixed(2);
        data.row.dwageall = Number(rowSecond.leastwageall_checkbill).toFixed(2);
      } else {
        this.$set(this.costListData, data.index, []);

        data.row.leastwageall_checkbill = Number(
          rowSecond.leastwageall_checkbill
        ).toFixed(2);
        data.row.dwageall = Number(0).toFixed(2);
        //console.log(data.row)
        data.row.wagelist.forEach((i, index) => {
          if (i.checked) {
            i.checked = false;
            this.changeCost({ row: i, index: index });
          }
        });
        console.log(data.row.wagelist);
      }

      //结算对象层
      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=this.jobListData.reduce((a,b)=>{
      // return (a+Number(b.leastwageall_checkbill)).toFixed(2)
      // },0)
      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=this.jobListData.reduce((a,b)=>{
      // return (a+Number(b.dwageall)).toFixed(2)
      // },0)
      // if(this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.checked).length){

      //   var num=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.checked).map(i=>i.dwageall).reduce((a,b)=>{return (Number(a)+Number(b)).toFixed(2)})

      //    this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=(Number(rowFirst.leastwageall_checkbill)-Number(num)).toFixed(2)
      // }else{

      //   this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=Number(0).toFixed(2)

      //   this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=Number(rowFirst.leastwageall_checkbill).toFixed(2)
      // }
    },
    changeJobAll(data) {
      //$(".sort-check").removeClass("sort-check");
      // if(this.jobListData.length>50){
      //   if(data){
      //    this.$confirm('是否需要一键生成对账单?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.jobListData.forEach((i,index)=>{
      //        this.changeJob({row:i,index:index,isyjdz:true})
      //        i.wagelist.forEach((item,index2)=>{
      //         let rowThird=this.backupAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==item.pono)[0]['wagelist'][index2]
      //          item.leastwageall_checkbill=Number(0).toFixed(2)
      //          item.dwageall=Number(rowThird.leastwageall_checkbill).toFixed(2)
      //         })
      //     })
      //     this.printF(this.tranMethod!='Fob'?'1':'2',true)

      //   }).catch(() => {
      //     this.jobListData.forEach((i,index)=>{
      //       this.changeJob({row:i,index:index})
      //     })
      //   });
      // }else{
      //   this.jobListData.forEach((i,index)=>{
      //     this.changeJob({row:i,index:index})
      //   })
      // }
      // }else{
      //   this.jobListData.forEach((i,index)=>{
      //     this.changeJob({row:i,index:index})
      //   })
      // }
      this.jobListData.forEach((i, index) => {
        if (!i.thisListHide) {
          this.changeJob({ row: i, index: index });
        }
      });
      console.log("=========");
      console.log(this.jobListData);
      console.log("=========");
    },

    changeCost(data) {
      let rowFirst = this.backupAllData.filter(
        i => i.accountgid == this.jsValue[0]
      )[0];

      let rowSecond = this.backupAllData
        .filter(i => i.accountgid == this.jsValue[0])[0]
        ["jobnolist"].filter(i => i.pono == data.row.pono)[0];

      let rowThird = this.backupAllData
        .filter(i => i.accountgid == this.jsValue[0])[0]
        ["jobnolist"].filter(i => i.pono == data.row.pono)[0]["wagelist"][
        data.index
      ];
      if (data.row.checked) {
        console.log("选中的项---------");
        this.selectCost.push(data.row);
        this.selectCost = [...new Set(this.selectCost)];
        console.log(this.selectCost);
        console.log("选中的项---------");
        data.row.leastwageall_checkbill = Number(0).toFixed(2);
        data.row.dwageall = Number(rowThird.leastwageall_checkbill).toFixed(2);
      } else {
        console.log("取消勾选--------");

        for (var i = 0; i < this.selectCost.length; i++) {
          if (this.selectCost[i].wageid == data.row.wageid) {
            this.selectCost.splice(i, 1);
          }
        }
        console.log(this.selectCost);
        console.log("取消勾选---------");
        data.row.leastwageall_checkbill = Number(
          rowThird.leastwageall_checkbill
        ).toFixed(2);
        data.row.dwageall = Number(0).toFixed(2);
      }

      // var costCheckLength=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['wagelist'].filter(i=>i.checked).length

      // console.log(this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0])
      // console.log(this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['wagelist'])
      // job层
      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['dwageall']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['wagelist'].reduce((a,b)=>{
      //   return (Number(a.dwageall)+Number(b.dwageall)).toFixed(2)
      // })

      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['leastwageall_checkbill']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['wagelist'].reduce((a,b)=>{
      //   return (Number(a.leastwageall_checkbill)+Number(b.leastwageall_checkbill)).toFixed(2)
      // })

      //结算对象层
      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].reduce((a,b)=>{
      // return (Number(a.leastwageall_checkbill)+Number(b.leastwageall_checkbill)).toFixed(2)
      // })
      // this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].reduce((a,b)=>{
      // return (Number(a.dwageall)+Number(b.dwageall)).toFixed(2)
      // })

      // if(costCheckLength){
      //   // 订舱编号
      //   var num=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['dwageall']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['wagelist'].filter(i=>i.checked).map(i=>i.dwageall).reduce((a,b)=>{return (Number(a)+Number(b)).toFixed(2)})

      //    this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['leastwageall_checkbill']=(Number(rowSecond.leastwageall_checkbill)-Number(num)).toFixed(2)
      //    //console.log(num)

      // }else{
      //  // 订舱编号
      //  this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['dwageall']=Number(0).toFixed(2)

      //  this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.pono==data.row.pono)[0]['leastwageall_checkbill']=Number(rowSecond.leastwageall_checkbill).toFixed(2)

      // }
      // //结算对象
      // if(this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.checked).length){

      //   var num=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['jobnolist'].filter(i=>i.checked).map(i=>i.dwageall).reduce((a,b)=>{return (Number(a)+Number(b)).toFixed(2)})

      //    this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=(Number(rowFirst.leastwageall_checkbill)-Number(num)).toFixed(2)
      // }else{

      //   this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['dwageall']=Number(0).toFixed(2)

      //   this.sjcAllData.filter(i=>i.accountgid==this.jsValue[0])[0]['leastwageall_checkbill']=Number(rowFirst.leastwageall_checkbill).toFixed(2)
      // }
    },
    changeCostAll(data, index) {
      this.costListData[index].forEach((i, index) => {
        this.changeCost({ row: i, index: index });
      });
    },
    //获取当前对账和剩余对账
    getDwage(data, type, field) {
      //数据，type 1结算对象 2工作号  字段dwageall leastwage
      var num;
      if (type == "1") {
        var list = [];
        data.jobnolist.forEach(i => {
          list = list.concat(i.wagelist);
        });
        num = list.reduce((a, b) => {
          a = a + Number(b[field]);
          return a;
        }, 0);
      } else {
        num = data.wagelist.reduce((a, b) => {
          a = a + Number(b[field]);
          return a;
        }, 0);
      }
      return Number(num).toFixed(2);
    },

    getReconDeatil(e) {
      if (this.searchType == "jobid") {
        // 从表格点击某个订单进入的请求
        //alert('12121')
        let unfinishData = {
          system: this.system,
          wageinout: this.wageinout,
          isoverseas: this.tranMethod ? true : false,
          jobidArr: this.jobid,
          area: this.area
        };
        this.$axios({
          method: "post",
          url:
            this.$store.state.webApi + "api/ExAiraxpCheckBillPchUnFinishDetail",
          data: unfinishData,
          name: "reconMngFir"
        }).then(callbackFn.bind(this));
      } else if (this.searchType == "where") {
        // 应付对账通过查询条件请求
        //  accountcomgid: this.accountcomgid,
        let json = {
          where: { ...this.searchData }
        };
        console.log("---------------------------");
        console.log(json);
        console.log("---------------------------");
        if (this.wageinout == "1") {
          if (json.where.fid || this.accountcomgid) {
            //json.where.accountcomgid =json.where.fid||this.accountcomgid
          }
        } else {
          // json.where.accountcomgid =json.where.fid
        }
        delete json.where.wecan_rel_name;
        json.where.wageinout = { in: this.wageinout };
        let params = {
          json: JSON.stringify(json),
          area: this.$store.state.areaState,
          wecan_rel_name: this.inputModelData.wecan_rel_name
        };
        if (this.wageinout == "1") {
          //可选参数
          params.queryType = "wagein";
        } else if (this.wageinout == "2") {
          params.queryType = "wageout";
        }
        var api = this.tranMethod
          ? "api/ExAiraxpCheckBillPchUnFinishDetail"
          : "api/ViewHpoPoAxplineCheckBill";
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ViewHpoPoAxplineCheckBill",
          params,
          name: "reconMngFir",
          loading: true,
          nofield: 1
        }).then(results => {
          // results.data = eval("("+results.data+")").data;
          results.data = JSON.parse(results.data).data;
          console.log(results.data);
          callbackFn.call(this, results);
        });
      }

      function callbackFn(results) {
        if (results.data.length == 0) {
          this.$message("无对账费用");
        }
        this.jsValue = [];
        this.jobListData = [];
        this.costListData = [];
        this.backupAllData = [];
        this.sjcAllData = results.data;
        //console.log(this.sjcAllData)
        // 导入对账的结算对象默认第一个结算对象
        // this.uploadExcelData.accountgid = Number(this.sjcAllData[0].accountgid)

        this.sjcAllData.forEach((item, index) => {
          //海外D/N开具 多票
          if (
            String(this.gid)
              .split(",")
              .indexOf(String(item.accountgid)) < 0 &&
            this.tranMethod
          ) {
            this.$set(item, "thisListHide", true);
          }
          //  if (item.accountgid != this.gid && this.tranMethod) {
          //   this.$set(item, 'thisListHide', true)
          // }
          this.$set(item, "dwageall", "");
          item.leastwageall_checkbill = Number(
            item.leastwageall_checkbill
          ).toFixed(2);
          item.jobnolist.forEach((item2, index2) => {
            this.$set(item2, "firstParentIndex", index + "," + index2);
            item2.realjzt =
              item2.realpiece +
              "/" +
              Number(item2.realweight).toFixed(2) +
              "/" +
              Number(item2.realvolume).toFixed(2);
            item2.leastwageall_checkbill = Number(
              item2.leastwageall_checkbill
            ).toFixed(2);
            item2.hbrq =
              item2.hbrq.indexOf("1900") == -1
                ? item2.hbrq.substring(0, 10)
                : "";
            this.$set(item2, "dwageall", "");
            item2.wagelist.forEach((item3, index3) => {
              this.$set(item3, "dwageall", "");
              this.$set(item3, "noAddShow", false);
              // this.$set(item3, 'indexAll', index + ',' + index2 + ',' + index3)
              this.$set(item3, "guid", item3.wageid);
              this.$set(
                item3,
                "checkboxdisable",
                item3.status == "-1" ||
                  item3.status == "500" ||
                  item3.status == "0"
                  ? false
                  : true
              );
              item3.realjzt = item2.realjzt;
              item3.hbh = item2.hbh;
              item3.leastwageall_checkbill = Number(
                item3.leastwageall_checkbill
              ).toFixed(2);
              item3.hbrq =
                item3.hbrq.indexOf("1900") == -1
                  ? item3.hbrq.substring(0, 10)
                  : "";
              item3.num = Number(item3.num).toFixed(2);
              item3.realwageall = Number(item3.realwageall).toFixed(2);
              item3.otherwageallrmb = item3.otherwageallrmb
                ? Number(item3.otherwageallrmb).toFixed(2)
                : "";
              item3.realwageallrmb = item3.realwageallrmb
                ? Number(item3.realwageallrmb).toFixed(2)
                : "";
              item3.price = Number(item3.price).toFixed(2);
            });
          });

          if (
            item.accountgid == this.selectgid ||
            item.accountgid == this.accountcomgid
          ) {
            setTimeout(() => {
              if (item.accountgid == this.selectgid) {
                this.jsValue.push(this.selectgid);
                this.allcheckedJob = true;
              } else if (item.accountgid == this.accountcomgid) {
                this.jsValue.push(this.accountcomgid);
              }
            }, 1000);
          }
        });

        this.backupAllData = JSON.parse(JSON.stringify(this.sjcAllData));
      }

      // if (this.wageinout == '2') return
      // 应付对账时不查询已对账数据

      // let collectData = {area:this.area,system:this.system,wageinout:this.wageinout,jobidArr: this.jobid}
      // //已对账数据
      // this.$axios({"method":"get",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchFinishCollect',params:collectData})
      // .then(results => {
      //   results.data.forEach(item => {
      //     var item2={...item}
      //     if(item.currency!='多币种'){
      //       item.billwageall = Number(item.billwageall).toFixed(2)
      //     item.pzfinishwageall = Number(item.pzfinishwageall).toFixed(2)
      //     }else{
      //     item.billwageall = '--'
      //     item.pzfinishwageall = '--'
      //     }
      //     item.billwageallrmb = Number(item.billwageallrmb).toFixed(2)
      //     item.pzfinishwageallrmb = Number(item.pzfinishwageallrmb).toFixed(2)

      //     item.billstatus = this.statusChange(item.billstatus)
      //     //alert(item.confirmdate.indexOf('1900'))
      //     item.confirmdate = (item.confirmdate.indexOf('0001') == -1 && item.confirmdate.indexOf('1900') == -1) ? item.confirmdate.substring(0, 16) : ''
      //     item.ourconfirmdate = (item.ourconfirmdate.indexOf('0001') == -1 && item.ourconfirmdate.indexOf('1900') == -1) ? item.ourconfirmdate.substring(0, 16) : ''
      //     //item.billwageall=item2.billwageall
      //     item.pzfinishwageall2 = item2.pzfinishwageall
      //   })

      //   this.dzRecorderListData = results.data
      //   console.log(this.dzRecorderListData)

      // }).catch(error => {
      // })
    },

    singleDzDataInfo(val) {
      this.singleDzInfo = true;
      this.singleDzData = {
        billid: this.dzRecorderListData[val].billid,
        confirmman: this.dzRecorderListData[val].confirmman,
        confirmdate: this.dzRecorderListData[val].confirmdate,
        billstatus: this.dzRecorderListData[val].billstatus,
        ourconfirmdate: this.dzRecorderListData[val].ourconfirmdate,
        ourconfirmman: this.dzRecorderListData[val].ourconfirmman,
        pchno: this.dzRecorderListData[val].pchno
      };
    },

    statusChange(val) {
      //对账中文转换
      switch (val) {
        case "1000":
          return "已对账";
          break;
        case "900":
          return "对账中";
          break;
      }
    },
    //生成对账单
    printF(type) {//1.对账单  2.账单  3.发票 
      //this.dzdMakeD={}
      if( this.selectCost.some(i =>{
        console.log(Number(i.realwageall - i.finishwageall_checkbill - i.dwageall))
        if(Number(i.realwageall - i.finishwageall_checkbill - i.dwageall) < 0 ) {
     
          return  this.$message.error("输入的金额超出对账范围，请重新输入金额")
        } else {
                if (!this.jsValue) {
        return this.$message.error("请选择结算对象");
      } else if (!this.jobListData.filter(i => i.checked).length) {
        return this.$message.error("请选择订单号");
      } else if (!this.costListData.flat().filter(i => i.checked).length) {
        return this.$message.error("请选择费用");
      } else {
        var jobnolistTotal = [];
        var jobnolist = [];
        var dataJob = JSON.parse(JSON.stringify(this.jobListData));
        //console.log(this.jobListData.filter(i=>i.checked))
        dataJob
          .filter(i => i.checked)
          .forEach(i => {
            jobnolistTotal.push({
              jobListData: i,
              wagelist: i.wagelist.filter(cost => cost.checked),
              settjobid: i.settjobid,
              jobid:i.jobid,
              hpoguid:i.hpoguid
            });
          });

        jobnolistTotal.forEach(item => {
          if (item.wagelist.length > 0) {
            jobnolist.push(item);
          }
        });

        if (
          this.sjcAllData.filter(i => i.accountgid == this.jsValue[0])[0]
            .isgroupallinprice == "1"
        ) {
          jobnolist.forEach(item => {
            if (
              item.wagelist.filter(i => i.items == "航司运费").length &&
              item.wagelist.filter(
                i => i.isallin == "1" && i.items != "航司运费"
              ).length &&
              item.wagelist
                .filter(i => i.isallin == "1")
                .map(i => i.num)
                .every(
                  i =>
                    i ==
                    item.wagelist
                      .filter(i => i.isallin == "1")
                      .map(i => i.num)[0]
                )
            ) {
              item.wagelist.filter(
                i => i.items == "航司运费" && i.isallin == "1"
              )[0]["dwageall"] = item.wagelist
                .filter(i => i.isallin == "1")
                .map(i => i.dwageall)
                .reduce((a, b) => {
                  return (Number(a) + Number(b)).toFixed(2);
                });

              item.wagelist.filter(
                i => i.items == "航司运费" && i.isallin == "1"
              )[0]["realwageall"] = item.wagelist
                .filter(i => i.isallin == "1")
                .map(i => i.realwageall)
                .reduce((a, b) => {
                  return (Number(a) + Number(b)).toFixed(2);
                });

              item.wagelist.filter(
                i => i.items == "航司运费" && i.isallin == "1"
              )[0]["realwageallrmb"] = item.wagelist
                .filter(i => i.isallin == "1")
                .map(i => i.realwageallrmb)
                .reduce((a, b) => {
                  return (Number(a) + Number(b)).toFixed(2);
                });

              item.wagelist.filter(
                i => i.items == "航司运费" && i.isallin == "1"
              )[0]["price"] = item.wagelist
                .filter(i => i.isallin == "1")
                .map(i => i.price)
                .reduce((a, b) => {
                  return Number(a) + Number(b);
                })
                .toFixed(2);

              item.wagelist
                .filter(i => i.isallin == "1" && i.items != "航司运费")
                .forEach(item2 => {
                  this.$set(item2, "noAddShow", true);
                });
            }
          });
        }
        console.log(jobnolist);

        var data = {
          billid: -1,
          area: this.area,
          isdel: "1",
          settgid: this.sjcAllData.filter(
            i => i.accountgid == this.jsValue[0]
          )[0].accountcomgid,
          accountcomname: this.sjcAllData.filter(
            i => i.accountgid == this.jsValue[0]
          )[0].accountcomname,
          wageinout: this.wageinout,
          jobnolist: jobnolist,
          billstatus: 900,
          system: this.system,
          paymentgid: this.jsValue[0],
          accountcomename: this.sjcAllData.filter(
            i => i.accountgid == this.jsValue[0]
          )[0].accountcomename
        };

        this.dzdMakeD = JSON.parse(JSON.stringify(data));
        console.log(this.dzdMakeD);
        if (type == "1") {
          this.dzdMakeS = true;
        } else if (type == "2") {
          this.dzdMakeFob = true;
        }else if(type=='3'){
          this.invoiceMake=true
        }
      
      }
     
        }
      })) {}



    },
    addBohui(boguid) {
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
            this.bohuiAddJob = boguid;
            //this.bohuiAddIndex=index
            this.mawbObject[boguid] = results.data;
          })
          .catch(error => {});
      } else {
        this.mawbDeti = this.mawbObject[boguid];
        this.bohuiAddDialog = true;
        this.bohuiAddJob = boguid;
        //this.bohuiAddIndex=index
      }
    },
    // addBohuiList(data){
    // this.costListData[this.bohuiAddIndex].push(data)
    // },
    back() {
      //返回
      this.$emit("unVisible", false);
    },

    printClose(data) {
      this.dzdMakeS = false;
      this.dzdMakeFob = false;
      this.invoiceMake=false
      //console.log(data.noclose)
      if (data.noclose == 2) {
        this.back();
      }
    },
    async mawbDetail(row, type = 1) {
      console.log(row)
      if(this.selectCost &&  this.selectCost.length > 0) {

        if((type=='2'&&row.some(i=>i.finishwageall_checkbill != 0 ))||(type=='1'&&row.finishwageall_checkbill!=0)){
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
          .some(i => i.system != "空出" || i.wagedom == "调账")
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
      // console.log(editlist);return;
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
        // console.log('费用驳回')
        // console.log('res')
        if (res.data.resultstatus == 0) {
          this.$message.success(res.data.resultmessage);
          this.bohuiVisible = false;
          this.getReconDeatil();
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
    }
  },
  watch: {
    uploadExcelDialog(val) {
      // 关闭导入对账弹窗后清空数据
      if (!val) {
        this.uploadExcelData = {
          accountgid: "",
          accountcomgid: "",
          wageinout: this.wageinout == "1" ? 1 : 2,
          importType: "总运单明细导入",
          confirmman: "",
          confirmdate: "",
          remark: "",
          excelFile: ""
        };
        this.importTypeDoc = false;
        this.disabledUploadBtn = false;
      }
    },
    order(val) {
      if (val.length) {
        this.jobListHead[0].disabled = true;
      } else {
        this.jobListHead[0].disabled = false;
      }
    },

    jsValue(newvalue, oldvalue) {
      if (newvalue.length) {
        this.sjcAllData.forEach(i => {
          if (newvalue.indexOf(i.accountgid) == "-1") {
            i.disabled = true;
          }
        });
        this.jobListData = this.sjcAllData.filter(
          i => i.accountgid == newvalue[0]
        )[0].jobnolist;
        this.jobListData.forEach((i, index) => {
          var a = i.dwageall;
          i.dwageall = 0;
          i.leastwageall_checkbill = a && a > 0 ? a : i.leastwageall_checkbill;
          if (this.bohuiAddJob && this.bohuiAddJob == i.jobid) {
            this.defaultSelectRowIndex = index;
            this.changeJob({ index: index, row: i });
            console.log(i);
          }
        });
      } else {
        let rowFirst = this.backupAllData.filter(
          i => i.accountgid == oldvalue[0]
        )[0];
        this.sjcAllData.forEach(i => {
          i.disabled = false;
        });
        if (oldvalue.length) {
          this.sjcAllData.filter(i => i.accountgid == oldvalue[0])[0][
            "dwageall"
          ] = Number(0).toFixed(2);
          this.sjcAllData.filter(i => i.accountgid == oldvalue[0])[0][
            "leastwageall_checkbill"
          ] = Number(rowFirst.leastwageall_checkbill).toFixed(2);
        }

        this.sjcAllData;
        this.costListData = [];
        this.jobListData = [];
      }
    },

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
  .search .searchCmpt-c {
    /deep/ .input-item {
      width: 269px;
      min-width: 269px;
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
.uploadExcelDialog {
  .uploadExcelDialog-c {
    padding: 0 30px;
    position: relative;
    .el-row {
      margin-bottom: 8px;
      .el-col {
        min-height: 30px;
        display: flex;
        align-items: center;
        .label {
          display: inline-block;
          width: 100px;
        }
        .pageSelect {
          display: inline-block;
          width: 60% !important;
        }
        .el-select,
        .el-input,
        .el-textarea {
          width: 60%;
        }
        .upload-excel {
          margin-right: 145px;
          .el-upload__tip {
            color: #0f5a8c;
          }
        }
        .import-type {
          color: red;
          cursor: pointer;
        }
      }
    }
    .btn-c {
      overflow: hidden;
      .el-button {
        float: right;
        margin-left: 20px;
      }
    }
    .import-type-doc {
      position: absolute;
      top: -54px;
      left: 0;
      right: 0;
      margin: auto;
      width: 500px;
      padding: 30px;
      background: #fff;
      box-shadow: #999 0px 0px 20px;
      .choose {
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #e8e8e8;
      }
      .type-item {
        margin-bottom: 20px;
        &:last-of-type {
          margin-bottom: 0;
        }
        .type-label {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .type-demo {
          tr:first-child {
            td {
              text-align: center;
              font-weight: bold;
            }
          }
          td {
            border: 1px solid #e8e8e8;
            padding: 4px 20px;
          }
        }
      }
      .footer .el-button {
        position: absolute;
        right: 30px;
        bottom: 30px;
      }
    }
  }
}
.excelResultDialog {
  .accountname {
    font-size: 18px;
    margin: 0 35px 20px;
    font-weight: bold;
    color: #004d84;
  }
  .excelResultTable-c {
    height: 526px;
    .excelResultTable {
      width: 850px;
      margin: 0 35px 20px;
      td {
        border: 1px solid #e8e8e8;
        padding: 4px 10px;
        text-align: center;
        .el-icon-setting {
          cursor: pointer;
        }
        &:first-child {
          input {
            float: left;
            margin-left: 8px;
            margin-top: 1px;
          }
        }
        &:last-child {
          p {
            width: 200px;
            margin: 0 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .footer {
    overflow: hidden;
    // width: 800px;
    margin: 0 35px 20px;
    .el-pagination {
      margin: 10px 0;
    }
    .el-button {
      float: right;
    }
  }
}
.wageBackReasonDialog {
  .title {
    font-size: 18px;
    color: #004d84;
  }
  .orderNo {
    color: #004d84;
    font-weight: bold;
    margin-top: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .reason-c {
    padding: 0 20px 20px;
    .accountname {
      margin-top: 15px;
      font-size: 12px;
    }
    ul li {
      display: inline-block;
      width: 110px;
      text-align: left;
      color: #999;
    }
    .accountNameItems {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      overflow: hidden;
      .costItemsList {
        /deep/.primary sup {
          background-color: #409eff;
        }
      }
      p {
        height: 1px;
        border-bottom: 1px solid #e8e8e8;
        margin-top: -4px;
        width: 860px;
      }
      li {
        display: inline-block;
        cursor: pointer;
        padding-right: 16px;
        width: auto;
        font-size: 14px;
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
    }
    .input-required /deep/.el-textarea__inner {
      background-color: #fff8ef;
      color: #333;
    }
  }
}
.orderDataList {
  span {
    display: inline-block;
    background: #efefef;
    color: #b9b9b9;
    width: 160px;
    height: 28px;
    line-height: 28px;
    border-radius: 28px;
    margin-right: 8px;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }
  .active {
    background: #eb0000;
    color: #fbd3d3;
  }
}
</style>
