<template>
  <div class="dzmake" style="width:1300px;margin:0 auto">
    <!--  {{dzdMakeDs}} -->
    <!-- {{ctypePrint}} -->
    <!--   {{activeTable}} -->
    <!--
{{pubBankInFo}} -->
    <h3 v-html="cshowInfo" style="color:red;margin-bottom:15px;"></h3>
    <div style="margin-bottom:20px;" v-if="Cshow">
      <el-button type="primary" @click="activeTable = '1'">费用操作</el-button>
      <el-button
        type="primary"
        @click="
          activeTable = '2';
          ctypeCost();
        "
        :disabled="ctypePrint"
        >预付通知单打印</el-button
      >
    </div>

    <div v-if="activeTable == '2'">
      <el-row>
        <el-col :span="8">
          <span style="min-width:100px;display:inline-block">{{
            dzdMakeD.wageinout == "1" ? "客户对账人:" : "供应商对账人:"
          }}</span>
          <!-- {{this.$store.state.areaState}} -->
          <!--  {{area}} -->
          <el-input
            v-model="reconInfo.confirmman"
            style="width:105px;"
          ></el-input>
          <customerRel
            v-if="
              (dzdMakeD.settgid && dzdMakeD.wageinout == '1') ||
                (dzdMakeDs.settgid && dzdMakeD.wageinout == '1')
            "
            style="display: inline;margin-left:21px;"
            :fid="dzdMakeD.settgid || dzdMakeDs.settgid"
            :man="reconInfo.confirmman"
            customerRelType="结算"
            @changeRelData="handlerChangeRelData"
          >
          </customerRel>
        </el-col>

        <el-col :span="5">
          <span style="min-width:100px;display:inline-block">{{
            dzdMakeD.wageinout == "1" ? "客户对账时间:" : "供应商对账时间:"
          }}</span>
          <el-date-picker
            v-model="reconInfo.confirmdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:150px;"
            class="input-required"
          >
          </el-date-picker>
        </el-col>

        <el-col :span="5">
          <span style="min-width:100px;display:inline-block">我司对账人:</span>
          <el-input
            v-model="reconInfo.ourconfirmman"
            style="width:150px;"
          ></el-input>
        </el-col>

        <el-col :span="6">
          <span style="min-width:100px;display:inline-block"
            >我司对账时间:</span
          >
          <el-date-picker
            v-model="reconInfo.ourconfirmdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:160px;"
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <el-row style="margin-top:8px;">
        <el-col :span="12">
          <span style="min-width:100px;display:inline-block">对账备注:</span>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="reconInfo.confirmremark"
            style="width:300px;vertical-align:middle"
          >
          </el-input>
        </el-col>
      </el-row>

      <!--   {{pchno}} -->
      <div style="margin-top:20px;">
        <p style="margin-bottom:10px;">请选择对账单格式</p>
        <el-row>
          <el-col :span="14">
            <el-radio v-model="dzms" label="1">订单汇总</el-radio>
            <!--   <el-radio v-model="dzms" label="2">订单+分单汇总</el-radio> -->
            <el-radio v-model="dzms" label="3">订单+费用明细</el-radio>
            <!--   <el-radio v-model="dzms" label="4">订单+分单+费用明细</el-radio> -->
          </el-col>

          <el-col :span="9" style="text-align:right">
            <div v-if="dzdMakeD.noPrint == '2'">
              <el-button @click="print('1')" type="primary"
                >发送对账单</el-button
              >
              <el-button @click="back()">取消并返回</el-button>
            </div>
            <div v-else>
              <el-button @click="print('', '900')" type="primary"
                >对账中</el-button
              >
              <el-button @click="print('', '1000')" type="primary"
                >已对账</el-button
              >
              <el-button @click="print('', 'onlyPrint')" type="primary"
                >打印</el-button
              >
              <el-button @click="back()">取消并返回</el-button>
            </div>

            <!-- 	<el-button  @click="pdfShow()" type="primary">生成PDF</el-button> -->
          </el-col>
        </el-row>
        <!--  {{orderFirst}} -->
        <p style="margin-top:16px;">预览:</p>

        <div v-if="dzms == 1" id="print1" ref="print1">
          <!--     {{orderFirst}} -->
          <div id="first">
            <div
              v-for="(item, index) in orderFirst"
              :id="'first' + index"
              class="firstPrint"
            >
              <table id="confirmListtable" class="tablePH print1" width="96%">
                <thead v-if="index == 0">
                  <tr class="TopNoLine BottomNoLine">
                    <th colspan="10" v-if="dzdMakeD.noPrint != 2">
                      <img
                        :src="
                          `boStatic/images/${
                            projectIsWecan ? 'wecan' : 'hengfeng'
                          }logo_Shqrd.gif`
                        "
                        style="height: 80px;
                      width: 80%"
                        v-if="
                          area == conditionalAreaForBuild ||
                            area == '大客户' ||
                            area == '市场部' ||
                            area == '海外部' ||
                            !projectIsWecan
                        "
                      />
                      <img
                        v-else
                        :src="wecanlogoObj[area]"
                        style="height: 80px; width: 80%"
                      />
                    </th>
                    <th colspan="10" v-else>
                      <img
                        :src="
                          `boStatic/images/preWage/${
                            projectIsWecan ? 'wecan' : 'hengfeng'
                          }logo_sh.gif`
                        "
                        style="height: 80px;
                      width: 80%"
                        v-if="
                          area == conditionalAreaForBuild ||
                            area == '大客户' ||
                            area == '市场部' ||
                            area == '海外部' ||
                            !projectIsWecan
                        "
                      />
                      <img
                        v-else
                        :src="wecanlogoPrewageObj[area]"
                        style="height: 80px; width: 80%"
                      />
                    </th>
                  </tr>
                  <tr
                    class="TopNoLine BottomNoLine"
                    style="border-bottom: solid 1px;"
                  >
                    <th colspan="10" style="text-align: left!important">
                      TO:
                      <span
                        id="lblWtkhname2"
                        style="font-weight: bold;font-size: 16px;"
                        >{{ dzdMakeD.accountcomname }}</span
                      >
                    </th>
                  </tr>
                  <tr
                    class="TopNoLine  BottomNoLine"
                    style="border-bottom: solid 1px;"
                  >
                    <th colspan="10" style="text-align: left!important">
                      ATTN:
                      <span
                        id="lblAttn2"
                        style="font-weight: bold;font-size: 16px;"
                      ></span>
                    </th>
                  </tr>
                  <tr class="grey">
                    <th style="width:100%;color:#fff;" colspan="9">
                      {{ dzdMakeD.wageinout == "1" ? "应收部分" : "应付部分" }}
                    </th>
                  </tr>

                  <tr class="TopNoLine BottomNoLine">
                    <td style="border:none;width:200px;" class="ordernoH">
                      订舱编号
                    </td>
                    <td style="border:none" class="mawbH">总运单号</td>
                    <td>目的港</td>
                    <td style="border:none" class="hbhH">航班号</td>
                    <td class="tdthird" style="border:none">航班日期</td>
                    <td style="border:none" class="realjztH">实际件重体</td>
                    <td style="border:none" class="currencyH">币种</td>
                    <td style="border:none" class="accountH">费用总额</td>
                    <td
                      style="border:none;width:150px; white-space: pre-wrap;word-break: break-all;"
                      class="remarkH"
                    >
                      备注
                    </td>
                  </tr>
                </thead>

                <tr class="TopNoLine BottomNoLine">
                  <td
                    style="border:none;width:200px;font-size:13px;"
                    class="ordernoH"
                  >
                    {{ item.orderno }}
                  </td>
                  <td style="border:none">{{ item.mawb }}</td>
                  <td style="border:none">{{ item.mdg }}</td>
                  <td style="border:none">{{ item.hbh }}</td>
                  <td class="tdthird" style="border:none">{{ item.hbrq }}</td>
                  <td style="border:none">{{ item.realjzt }}</td>
                  <td style="border:none">{{ item.currency }}</td>
                  <td style="border:none">{{ item.dwageall }}</td>
                  <td
                    style="border:none;width:150px; white-space: pre-wrap;word-break: break-all;"
                    class="remarkH"
                  >
                    {{ item.wageremark }}
                  </td>
                </tr>
              </table>
            </div>

            <div
              v-for="item in orderWageTotal"
              class="totalMoney"
              style="width:100%"
            >
              <p class="totalMoneyP">
                <span>TOTAL:</span
                ><span class="firstWageall">{{ item.currency }}:</span
                ><span>{{ item.total }}</span>
              </p>
            </div>
          </div>

          <table class="printBottomFirst">
            <div v-if="dzdMakeD.noPrint != '2' && projectIsWecan">
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot4">
                    自2014-9月起，我司将全部开具增值税普通发票！<br />
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot1">
                    请务必于收到后三个工作日内签章回传确认并告知开票抬头!
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot2">
                    若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    如费用有疑问请联系：<br />TEL:<span
                      id="lblTelInfo"
                      class="tel"
                    ></span
                    ><br />FAX:<span id="lblFaxInfo" class="fax"></span>
                  </div>
                </th>
              </tr>
            </div>

            <div v-if="dzdMakeD.noPrint == '2'">
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    请立即支付上述预付款项至以下账户
                  </div>
                </th>
              </tr>

              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    账号名称：{{ accountname }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    开户账号：{{ bank_account }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    开户银行：{{ bank }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    操作完成按实际发生额对账开票，若与预付款总金额有差别，多退少补！
                  </div>
                </th>
              </tr>

              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    我司对账人：{{ reconInfo.ourconfirmman }}
                  </div>
                </th>
              </tr>
            </div>

            <tr class="TopNoLine BottomNoLine bottomTotal">
              <th format="#" tdata="pageNO">当前第1 页</th>
              <th format="#" tdata="pageCount">共1页</th>
            </tr>
          </table>
        </div>

        <!-- 第3种 -->
        <div v-if="dzms == 3" id="print3" ref="print3" style="width:96%">
          <div
            v-for="(item, index) in orderThird"
            :id="'third' + index"
            class="thirdPrint"
            :key="index"
          >
            <table
              :id="'thirdTable' + index"
              class="tablePH print3"
              width="98%"
              :style="{ display: index > 0 ? 'none' : 'inline-table' }"
            >
              <thead>
                <tr class="TopNoLine BottomNoLine">
                  <th colspan="10" v-if="dzdMakeD.noPrint != 2">
                    <img
                      :src="
                        `boStatic/images/${
                          projectIsWecan ? 'wecan' : 'hengfeng'
                        }logo_Shqrd.gif`
                      "
                      style="height: 80px;
                      width: 80%"
                      v-if="
                        area == conditionalAreaForBuild ||
                          area == '大客户' ||
                          area == '市场部' ||
                          area == '海外部' ||
                          !projectIsWecan
                      "
                    />
                    <img
                      v-else
                      :src="wecanlogoObj[area]"
                      style="height: 80px; width: 80%"
                    />
                  </th>

                  <th colspan="10" v-else>
                    <img
                      :src="
                        `boStatic/images/preWage/${
                          projectIsWecan ? 'wecan' : 'hengfeng'
                        }logo_sh.gif`
                      "
                      style="height: 80px;
                      width: 80%"
                      v-if="
                        area == conditionalAreaForBuild ||
                          area == '大客户' ||
                          area == '市场部' ||
                          area == '海外部' ||
                          !projectIsWecan
                      "
                    />
                    <img
                      v-else
                      :src="wecanlogoPrewageObj[area]"
                      style="height: 80px; width: 80%"
                    />
                  </th>
                </tr>
                <tr
                  class="TopNoLine BottomNoLine"
                  style="border-bottom: solid 1px;"
                >
                  <th colspan="10" style="text-align: left!important">
                    TO:
                    <span
                      id="lblWtkhname2"
                      style="font-weight: bold;font-size: 16px;"
                      >{{ dzdMakeD.accountcomname }}</span
                    >
                  </th>
                </tr>
                <tr
                  class="TopNoLine  BottomNoLine"
                  style="border-bottom: solid 1px;"
                >
                  <th colspan="10" style="text-align: left!important">
                    ATTN:
                    <span
                      id="lblAttn2"
                      style="font-weight: bold;font-size: 16px;"
                    ></span>
                  </th>
                </tr>
              </thead>
            </table>

            <p class="thirdTitle">
              <span class="one">订舱编号</span>
              <span class="oneV">{{ item.orderno }}</span>
              <span class="two">总运单号</span>
              <span class="twoV">{{ item.mawb }}</span>
              <span class="three">分运单号</span>
              <!--   {{item.hawb}}
     {{item.hawb.substring(0,item.hawb.indexOf(','))}} -->
              <span class="threeV">{{
                item.hawb.indexOf(",") == -1
                  ? item.hawb
                  : item.hawb.split(",").length > 2
                  ? item.hawb.split(",")[0] +
                    "," +
                    item.hawb.split(",")[1] +
                    "(" +
                    item.hawb.split(",").length +
                    ")票"
                  : item.hawb
              }}</span>
            </p>
            <p class="thirdTitle">
              <span class="one">始发港</span>
              <span class="oneV">{{ item.sfg }}</span>
              <span class="two">目的港</span>
              <span class="twoV">{{ item.mdg }}</span>
              <span class="three">实际件重体</span>
              <span class="threeV">{{ item.realjzt }}</span>
            </p>

            <p class="thirdTitle">
              <span class="one">航班号</span>
              <span class="oneV">{{ item.hbh }}</span>
              <span class="two">航班日期</span>
              <span class="twoV">{{ item.hbrq }}</span>
              <span class="three">计费重量</span>
              <span class="threeV">{{ Number(item.hawbjfweight).toFixed(2) }}</span>
            </p>

            <p class="grey3">
              {{ dzdMakeD.wageinout == "1" ? "应收部分" : "应付部分" }}
            </p>

            <table style="width:100%" class="tableContent3">
              <tr class="TopNoLine BottomNoLine">
                <td style="border:none">服务项目</td>
                <td style="border:none">单价</td>
                <td style="border:none">数量</td>
                <td style="border:none">币种</td>
                <!-- <td style="border:none">税</td> -->
                <td style="border:none">对账金额</td>
                <td style="border:none">含税金额</td>
                <td
                  style="border:none;width:150px; white-space: pre-wrap;word-break: break-all;"
                >
                  备注
                </td>
              </tr>
              <!-- 表格数据 -->
              <tr
                class="TopNoLine BottomNoLine"
                v-for="(item2,index2) in item.itemWage"
                :key="index2"
              >
                <td style="border:none">{{ item2.items }}</td>
                <td style="border:none">{{ item2.price }}</td>
                <td style="border:none">{{ item2.num }}</td>
                <td style="border:none">{{ item2.currency }}</td>

                <td style="border:none">{{ item2.dwageall }}</td>
                <td style="border:none">{{ item2.realwageall }}</td>
                <td
                  style="border:none;width:150px; white-space: pre-wrap;word-break: break-all;"
                >
                  {{ item2.wageremark }}
                </td>
                <!-- <td style="border:none">{{item.currency}}</td> -->
              </tr>
            </table>

            <!-- total -->
            <div class="totalMoney3">
              <p
                v-for="item3 in orderThirdTotal[index].wageList"
                class="totalMoneyP"
              >
                <span class="left minWidth" style="float:left">TOTAL:</span>
                <span style="float:right;margin-right:200px;">
                  <span class="thirdWageall minWidth"
                    >{{ item3.currency }}(不含税):</span
                  >
                  <span class="minWidth">{{ item3.total }}</span>
                  <span class="thirdRealwageall minWidth"
                    >{{ item3.currency }}(含税):</span
                  >
                  <span>{{ item3.total1 }}</span>
                </span>
              </p>
            </div>

            <!-- {{orderSecond}} -->
          </div>
          <table class="printBottomthird">
            <div v-if="dzdMakeD.noPrint != '2' && projectIsWecan">
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot4">
                    自2014-9月起，我司将全部开具增值税普通发票！<br />
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot1">
                    请务必于收到后三个工作日内签章回传确认并告知开票抬头!
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_left divFoot2">
                    若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    如费用有疑问请联系：<br />TEL:<span
                      id="lblTelInfo"
                      class="tel"
                    ></span
                    ><br />FAX:<span id="lblFaxInfo" class="fax"></span>
                  </div>
                </th>
              </tr>
            </div>

            <div v-if="dzdMakeD.noPrint == '2'">
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    请立即支付上述预付款项至以下账户
                  </div>
                </th>
              </tr>

              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    账号名称：{{ accountname }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    开户账号：{{ bank_account }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    开户银行：{{ bank }}
                  </div>
                </th>
              </tr>
              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    操作完成按实际发生额对账开票，若与预付款总金额有差别，多退少补！
                  </div>
                </th>
              </tr>

              <tr class="TopNoLine BottomNoLine">
                <th colspan="10">
                  <div class="divModule_right divFoot3">
                    我司对账人：{{ reconInfo.ourconfirmman }}
                  </div>
                </th>
              </tr>
            </div>

            <tr class="TopNoLine BottomNoLine">
              <th format="#" tdata="pageNO">当前#页</th>
              <th format="#" tdata="pageCount">共#页</th>
            </tr>
          </table>
        </div>
      </div>

      <!--       <el-dialog width="280px" top="4%" center :visible.sync="pdfDow" v-if="pdfDow" append-to-body>
        <p style="text-align:center">
          <el-input placeholder="请输入自定义文件名" v-model="pdfDname" style="width:200px;vertical-align:middle">
          </el-input>

          <el-button @click="pdf" style="margin-top:10px;">下载</el-button>
        </p>
          <div style="width:430px;margin:0 auto">
  <p>
  <span style="min-width:120px;display:inline-block">客户对账人:</span>
  <el-input v-model='reconInfo.confirmman' style="width:300px;"></el-input>
  </p>
   <p style="margin-top:20px;">
  <span style="min-width:120px;display:inline-block">客户对账时间:</span>
   <el-date-picker
                          v-model='reconInfo.confirmdate'
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
 <el-input v-model='reconInfo.ourconfirmman' style="width:300px;"></el-input>
  </p>
    <p style="margin-top:20px;">
  <span style="min-width:120px;display:inline-block">我司对账时间:</span>
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
  <span style="min-width:120px;display:inline-block;vertical-align:middle">对账备注:</span>
  <el-input
  type="textarea"
  placeholder="请输入内容"
  v-model="reconInfo.confirmremark" style="width:300px;vertical-align:middle">
</el-input>
  </p>
  <p style="margin-top:20px;text-align:center">
  <el-button @click="reconOpen=false">取消</el-button> <el-button @click="dzing">确认</el-button>
  </p>
  </div>
      </el-dialog> -->
    </div>

    <div v-show="activeTable == '1' && mawbguid && boguid">
      <!-- 总单费用制作非合并 -->

      <costmaking
        :mawbguid="mawbguid"
        :boguid="boguid"
        costDom="客服"
        :Cshow="Cshow"
        ref="costDialog"
      ></costmaking>
    </div>
  </div>
</template>

<script>
import { getMomentDate, dateFormat, getPdf } from "../../api/localStorage.js";
import { getLodop } from "../../api/LodopFuncs.js";
import html2Canvas from "html2canvas";
//import JsPDF from 'jspdf'
import customerRel from "../templates/customerRel";
export default {
  components: {
    customerRel
  },
  props: {
    dzdMakeD: {
      type: Object
    },
    system: {
      type: String
    },
    area: "",
    pchno: {
      type: String
    },
    Cshow: {
      type: Boolean,
      default: false
    },
    mawbguid: {
      type: String,
      default: ""
    },
    boguid: {
      type: String,
      default: ""
    },
    cshowInfo: ""
    // ctypePrint:{
    //  type:Boolean,
    //  default:true
    // }
  },
  data() {
    let activeTable = this.Cshow ? "1" : "2";
    return {
      reconInfo: {
        confirmman: "",
        confirmdate: "",
        ourconfirmman: localStorage.getItem("usrname"),
        ourconfirmdate: getMomentDate(),
        confirmremark: ""
      },
      dzms: "3",
      activeTable, //C类切换操作
      orderFirst: [],
      orderWageTotal: [], //订单汇总total
      //orderSecond: [],
      //orderSecondTotal: [],//订单+分单汇总total
      orderThird: [],
      orderThirdTotal: [], //订单+费用明细total
      //orderForth: [],
      //newWageList: [],
      dzdMakeDBackup: [], //备份对账单
      //pdfDow: false,//pdf文件名
      //pdfDname: "",//pdf对账单文件名
      customerRelList: [],
      bank: "", //银行信息
      bank_account: "",
      accountname: "", //账号名称
      dzdMakeDs: {},
      ctypePrint: false,
      wecanlogoObj: {
        北京: "./boStatic/images/wecanlogo_Bjqrd.gif",
        成都: "./boStatic/images/wecanlogo_Cdqrd.gif",
        重庆: "./boStatic/images/wecanlogo_Cqqrd.gif",
        广州: "./boStatic/images/wecanlogo_Gzqrd.gif",
        杭州: "./boStatic/images/wecanlogo_Hzqrd.gif",
        昆明: "./boStatic/images/wecanlogo_Kmqrd.gif",
        青岛: "./boStatic/images/wecanlogo_QDqrd.gif",
        深圳: "./boStatic/images/wecanlogo_Szqrd.gif",
        武汉: "./boStatic/images/wecanlogo_Whqrd.gif",
        西安: "./boStatic/images/wecanlogo_Xaqrd.gif",
        香港: "./boStatic/images/wecanlogo_XGqrd.gif",
        厦门: "./boStatic/images/wecanlogo_Xmqrd.gif",
        郑州: "./boStatic/images/wecanlogo_Zzqrd.gif",
        南京: "./boStatic/images/wecanlogo_NJqrd.gif",
        合肥: "./boStatic/images/wecanlogo_hefei.gif",
        越南: "./boStatic/images/wecanlogo_yuenan.gif",
        无锡: "./boStatic/images/wecanlogo_WuXIqrd.gif",
        南通: "./boStatic/images/wecanlogo_NanTongqrd.gif"
      },
      wecanlogoPrewageObj: {
        北京: "./boStatic/images/preWage/wecanlogo_bj.gif",
        成都: "./boStatic/images/preWage/wecanlogo_cd.gif",
        重庆: "./boStatic/images/preWage/wecanlogo_cq.gif",
        广州: "./boStatic/images/preWage/wecanlogo_gz.gif",
        杭州: "./boStatic/images/preWage/wecanlogo_hz.gif",
        昆明: "./boStatic/images/preWage/wecanlogo_km.gif",
        青岛: "./boStatic/images/preWage/wecanlogo_qd.gif",
        深圳: "./boStatic/images/preWage/wecanlogo_sz.gif",
        武汉: "./boStatic/images/preWage/wecanlogo_wh.gif",
        西安: "./boStatic/images/preWage/wecanlogo_xa.gif",
        香港: "./boStatic/images/preWage/wecanlogo_xg.gif",
        厦门: "./boStatic/images/preWage/wecanlogo_xm.gif",
        郑州: "./boStatic/images/preWage/wecanlogo_zz.gif",
        南京: "./boStatic/images/preWage/wecanlogo_nj.gif",
        合肥: "./boStatic/images/preWage/wecanlogo_hf.gif",
        越南: "./boStatic/images/preWage/wecanlogo_yuenan.gif",
        无锡: "./boStatic/images/preWage/wecanlogo_WuXIqrd.gif",
        南通: "./boStatic/images/preWage/wecanlogo_NanTongqrd.gif"
      }
    };
  },
  mounted() {
    // 过滤后的数据
    console.log(this.orderThird);
    console.log("-----------");
    // 完整数据this.dzdMakeDBackup.jobnolist.wagelist
    console.log(this.dzdMakeDBackup.jobnolist);
  },
  created() {
    console.log(this.dzdMakeD);
    //alert(this.activeTable)
    //alert(this.mawbguid)
    //alert(Number(17.575).toFixed(2))
    //console.log(JSON.stringify(this.dzdMakeD))
    //console.log(this.dzdMakeD)
    if (this.dzdMakeD.jobnolist) {
      //非配货完成点入
      //alert('1')
      this.dzdMethods(this.dzdMakeD);
    }

    if (this.dzdMakeD.noPrint == "2") {
      this.$axios({
        method: "GEt",
        url: this.$store.state.publicWebApi + "api/PubBank",
        params: "",
        loading: false
      }).then(result => {
        //sessionStorage.setItem('pubBankInFo', JSON.stringify(result.data))

        let bankdata =
          result.data.filter(i => {
            return (
              i.system == this.dzdMakeD.system &&
              i.area == this.dzdMakeD.area &&
              i.currency == "人民币"
            );
          }) || [];

        this.bank = bankdata.length > 0 ? bankdata[0].bank : "";
        this.bank_account = bankdata.length > 0 ? bankdata[0].bank_account : "";
        this.accountname = bankdata.length > 0 ? bankdata[0].account_name : "";
      });
    }
  },
  computed: {},

  methods: {
    //修改PDF名字
    pdfShow() {
      if (this.reconInfo.confirmdate == "") {
        this.$message.error(
          "请填写" +
            (this.dzdMakeD.wageinout == "1" ? "客户对账时间" : "供应商对账时间")
        );
        return false;
      } else {
        if (this.dzdMakeD.noPrint != 1) {
          //需请求
          var data = this.dzdMakeD;
          Object.keys(this.reconInfo).forEach(key => {
            data[key] = this.reconInfo[key];
          });
          data.system = this.system;
          //var that=this
          this.$axios({
            method: "POST",
            url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
            data: data,
            loading: true
          })
            .then(results => {
              //debugger;
              if (results.data.resultstatus == 0) {
                this.$message.success(results.data.resultmessage);

                if (results.data.resultno) {
                  setTimeout(() => {
                    this.pdfF(results.data.resultno);
                  }, 500);
                }

                setTimeout(() => {
                  this.$emit("Unvisible", { noclose: "2" });
                }, 1000);
              } else {
                this.$message.error(results.data.resultmessage);
              }
            })
            .catch(error => {});
        } else {
          this.pdfF(this.pchno);
          setTimeout(() => {
            this.$emit("Unvisible", { noclose: "2" });
          }, 1000);
        }

        //this.pdfDow=false
        //this.pdfDow=true
      }
    },
    // 打印
    print(type, status) {
      //type  打印并发送  status 900对账中 1000已对账 onlyPrint只打印
      //this.printF()
      console.log(this.dzdMakeD.noPrint);
      if (this.dzdMakeD.noPrint != 1) {
        //需请求
        var url = "";
        var data = this.dzdMakeD.jobnolist
          ? JSON.parse(JSON.stringify(this.dzdMakeD))
          : JSON.parse(JSON.stringify(this.dzdMakeDs));
        //var data = this.dzdMakeD.jobnolist ? {...this.dzdMakeD} : {...this.dzdMakeDs}
        console.log(this.reconInfo);

        Object.keys(this.reconInfo).forEach(key => {
          data[key] = this.reconInfo[key];
        });

        if (status != "onlyPrint") {
          data.billstatus = status;
        } else {
          this.printF("对账单打印");
          return;
        }

        if (data.confirmdate == "") {
          this.$message.error(
            "请填写" +
              (this.dzdMakeD.wageinout == "1"
                ? "客户对账时间"
                : "供应商对账时间")
          );
          return false;
        }
        data.system = this.system;

        if (this.dzdMakeD.wageinout == "1") {
          if (this.customerRelList.length === 0) {
            return this.$message.error("请选择本票客户结算联系人");
          }
          data.customerRelList = this.customerRelList;
        }
        if (this.dzdMakeD.noPrint == 2) {
          url = "api/CheckBill/PrintBillPre";
          if (type == "1") {
            data.isNeedEmail = true;
            data.cusemail = this.customerRelList[0].email;
          }
        } else {
          url = "api/ExAiraxpCheckBillPch";
        }
        // 8.6日此处添加isallin=="1"条件，之前出现两条运费时运费找的不准确
        if (this.dzdMakeD.noPrint != "2" && status != "onlyPrint") {
          data["jobnolist"].forEach(i => {
            if (
              i.wagelist.filter(i2 => i2.items == "航司运费").length &&
              i.wagelist.filter(
                i2 => i2.isallin == "1" && i2.items != "航司运费"
              ).length &&
              i.wagelist
                .filter(i2 => i2.isallin == "1")
                .map(i2 => i2.num)
                .every(
                  i2 =>
                    i2 ==
                    i.wagelist
                      .filter(i2 => i2.isallin == "1")
                      .map(i2 => i2.num)[0]
                )
            ) {
              i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                "dwageall"
              ] = Number(
                i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0]["dwageall"] -
                  i.wagelist
                    .filter(i2 => i2.noAddShow)
                    .reduce((a, b) => {
                      return a + Number(b.dwageall);
                    }, 0)
              ).toFixed(2);
              i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                "realwageall"
              ] = Number(
                i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                  "realwageall"
                ] -
                  i.wagelist
                    .filter(i2 => i2.noAddShow)
                    .reduce((a, b) => {
                      return a + Number(b.realwageall);
                    }, 0)
              ).toFixed(2);
              i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                "realwageallrmb"
              ] = Number(
                i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                  "realwageallrmb"
                ] -
                  i.wagelist
                    .filter(i2 => i2.noAddShow)
                    .reduce((a, b) => {
                      return a + Number(b.realwageallrmb);
                    }, 0)
              ).toFixed(2);
              i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0][
                "price"
              ] = Number(
                i.wagelist.filter(i2 => i2.items == "航司运费"&& i2.isallin == "1")[0]["price"] -
                  i.wagelist
                    .filter(i2 => i2.noAddShow)
                    .reduce((a, b) => {
                      return a + Number(b.price);
                    }, 0)
              ).toFixed(2);
            }
          });
        }

        console.log(data);
        //console.log(JSON.stringify(data))
        // this.$parent.$parent.getReconDeatil()
        // this.back()

        this.$axios({
          method: "POST",
          url: this.$store.state.webApi + url,
          data: data,
          loading: true
        })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);

              if (results.data.resultno && this.dzdMakeD.noPrint != 2) {
              } else if (this.dzdMakeD.noPrint == 2) {
                setTimeout(() => {
                  this.printF(results.data.resultno);
                }, 500);
              }
              if (this.dzdMakeD.noPrint != 2) {
                this.$parent.$parent.getReconDeatil();
                this.back();
              } else {
                setTimeout(() => {
                  this.$emit("Unvisible", { noclose: "2" });
                }, 800);
              }
            } else {
              this.$message.error(results.data.resultmessage);
            }
          })
          .catch(error => {});
      } else {
        //不用请求

        this.printF(this.pchno);
        setTimeout(() => {
          this.$emit("Unvisible", { noclose: "2" });
        }, 1000);
      }
    },
    // pdf
    pdf() {
      this.pdfF();
      setTimeout(() => {
        this.$emit("Unvisible", { noclose: "2" });
      }, 1000);
      //this.pdfDow = false

      //     if(this.dzdMakeD.noPrint!=1){//需请求
      //      var data=this.dzdMakeD
      //      Object.keys(this.reconInfo).forEach(key => {
      //        data[key]=this.reconInfo[key]
      //      })
      //      data.system=this.system

      // this.$axios({"method":"POST",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPch',data:data,loading:true})
      //     .then(results=>{
      //      //debugger;
      //         if(results.data.resultstatus==0){
      //           this.$message.success(results.data.resultmessage)
      //           this.pdfDname=results.data.resultno
      //            this.pdfF()
      //            setTimeout(()=>{
      //     this.$emit('Unvisible',{noclose:'2'})
      //   },1000)
      //         }else{
      //            this.$message.error(results.data.resultmessage)
      //         }
      //     })
      //     .catch(error=>{

      //     })

      //     }else{//不需请求
      //          this.pdfF()
      //     }
    },
    back() {
      this.$emit("Unvisible", { noclose: 1 });
      this.dzdMakeD = {};
      //this.dzdMakeDs={}
    },
    handlerChangeRelData($event) {
      //alert('1')
      //console.log($event)
      if ($event.length) {
        this.customerRelList = $event;
        //console.log(this.customerRelList)
        this.reconInfo.confirmman =
          (this.customerRelList &&
            this.customerRelList.filter(i => i.lxrss == 2)[0].name) ||
          "";
      }
    },
    printF(name) {
      if (this.dzms == 1) {
        //var a={tel:1111,fax:22222}
        LODOP = getLodop();
        LODOP.PRINT_INIT(name);

        var style =
          "table{width:100%;margin-bottom:25px;font-size:13px;} table tr td{height:20px!important;} table tr td.ordernoH{width:145px!important;white-space: pre-wrap;word-break: break-all;} .grey{height:26px;line-height:26px;text-align:center;background:#848383;color:white}  .firstWageall{margin-left:505px;} .hawbH{width:90px!important;white-space: pre-wrap;word-break: break-all;} .remarkH{width:80px!important;white-space: pre-wrap;word-break: break-all;} .printBottomFirst{display:none!important} .totalMoneyP{line-height:26px;height:26px;font-size:14px;}";
        var cssstyle = "<style>" + style + "</style>";
        if (this.dzdMakeD.noPrint != 2) {
          if (this.projectIsWecan) {
            LODOP.ADD_PRINT_TEXT(
              "890",
              "50",
              "400",
              "20",
              "自2014-9月起，我司将全部开具增值税普通发票!"
            );
            LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "905",
              "50",
              "490",
              "20",
              "请务必于收到后三个工作日内签章回传确认并告知开票抬头!"
            );
            LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "920",
              "50",
              "500",
              "20",
              "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。"
            );
            LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "935",
              "50",
              "500",
              "20",
              "如费用有疑问请联系：Tel:"
            );
            LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          }

          LODOP.ADD_PRINT_TEXT("935", "500", "500", "20", "Fax:");
        }

        if (this.dzdMakeD.noPrint == 2) {
          LODOP.ADD_PRINT_TEXT(
            "900",
            "50",
            "400",
            "22",
            "请立即支付上述预付款项至以下账户"
          );
          LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "930",
            "50",
            "490",
            "22",
            "账号名称:" + this.accountname
          );
          LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "960",
            "50",
            "500",
            "22",
            "开户账号:" + this.bank_account
          );
          LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "990",
            "50",
            "500",
            "22",
            "开户银行:" + this.bank
          );
          LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1020",
            "50",
            "500",
            "22",
            "操作完成按实际发生额对账开票，若与预付款总金额有差别，多退少补！"
          );
          LODOP.SET_PRINT_STYLEA(5, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(5, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(5, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1050",
            "50",
            "500",
            "22",
            "我司对账人:" + this.reconInfo.ourconfirmman
          );
          LODOP.SET_PRINT_STYLEA(6, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(6, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(6, "FontSize", 11);
        }

        LODOP.SET_PRINT_STYLEA(7, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(7, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(7, "FontSize", 11);
        if(this.dzdMakeD.noPrint == 2){
          LODOP.ADD_PRINT_TEXT("1080", "50", "500", "22", "第1页/共1页")
        }else{
          LODOP.ADD_PRINT_TEXT("1000", "350", "500", "22", "第1页/共1页")
        }
        

        LODOP.SET_PRINT_STYLEA(8, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(8, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(8, "FontSize", 11);

        LODOP.ADD_PRINT_HTM(
          "2%",
          "2%",
          "98%",
          "297mm",
          cssstyle + document.getElementById("print1").innerHTML
        );

        setTimeout(() => {
          LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 1200, 800, "");
          LODOP.PREVIEW();
        }, 500);

        //    setTimeout(()=>{
        //     LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_获得打印状态2");
        //   LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印的页面部分内容");
        // },200)
      } else if (this.dzms == 2) {
        LODOP = getLodop();
        LODOP.PRINT_INIT(name);
        var style =
          ".secondTitle span{width:23%;} .grey2{height:26px;line-height:26px;text-align:center;background:#848383;color:white} .secondWageall{} .secondRealwageall{margin-left:110px;} .print2{display:block!important} .printBottomSecond{display:none} .totalMoneyP{line-height:26px;;height:26px;}";
        var cssstyle = "<style>" + style + "</style>";

        if (this.dzdMakeD.noPrint != 2) {
          if (this.projectIsWecan) {
            LODOP.ADD_PRINT_TEXT(
              "900",
              "50",
              "400",
              "22",
              "自2014-9月起，我司将全部开具增值税普通发票!"
            );
            LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "930",
              "50",
              "490",
              "22",
              "请务必于收到后三个工作日内签章回传确认并告知开票抬头!"
            );
            LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "960",
              "50",
              "500",
              "22",
              "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。"
            );
            LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "990",
              "50",
              "500",
              "22",
              "如费用有疑问请联系：Tel:"
            );
            LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          }
          LODOP.ADD_PRINT_TEXT("990", "500", "500", "22", "Fax:");
        }

        if (this.dzdMakeD.noPrint == 2) {
          LODOP.ADD_PRINT_TEXT(
            "900",
            "50",
            "400",
            "22",
            "请立即支付上述预付款项至以下账户"
          );
          LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "930",
            "50",
            "490",
            "22",
            "账号名称:" + this.accountname
          );
          LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "960",
            "50",
            "500",
            "22",
            "开户账号:" + this.bank_account
          );
          LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "990",
            "50",
            "500",
            "22",
            "开户银行:" + this.bank
          );
          LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1020",
            "50",
            "500",
            "22",
            "操作完成按实际发生额对账开票，若与预付款总金额有差别，多退少补！"
          );
          LODOP.SET_PRINT_STYLEA(5, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(5, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(5, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1050",
            "50",
            "500",
            "22",
            "我司对账人:" + this.reconInfo.ourconfirmman
          );
          LODOP.SET_PRINT_STYLEA(6, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(6, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(6, "FontSize", 11);
        }
        LODOP.SET_PRINT_STYLEA(7, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(7, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(7, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("1080", "50", "500", "22", "第#页/共&页");

        LODOP.SET_PRINT_STYLEA(8, "ItemType", 3);
        LODOP.SET_PRINT_STYLEA(8, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(8, "FontSize", 11);

        this.orderSecond.forEach((item, index) => {
          LODOP.ADD_PRINT_HTM(
            "2%",
            "2%",
            "98%",
            "98%",
            cssstyle + document.getElementById("second" + index).innerHTML
          );
          if (index != this.orderSecond.length - 1) {
            LODOP.NewPage();
          }
        });

        setTimeout(() => {
          LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 1200, 800, "");
          LODOP.PREVIEW();
        }, 500);
      } else if (this.dzms == 3) {
        LODOP = getLodop();
        LODOP.PRINT_INIT(name);
        //.dzmake #print3 .thirdPrint .thirdTitle span
        var style =
          ".thirdTitle span.one{width:10%!important;display:inline-block;font-size:14px;} .thirdTitle span.oneV{width:23%!important;display:inline-block;font-size:14px;white-space:nowrap; } .thirdTitle span.two{width:10%!important;display:inline-block;font-size:14px;} .thirdTitle span.twoV{width:15%!important;display:inline-block;font-size:14px;} .thirdTitle span.three{width:10%!important;display:inline-block;font-size:14px;} .thirdTitle span.threeV{width:26%!important;display:inline-block;} .grey3{height:26px;line-height:26px;text-align:center;background:#848383;color:white} .thirdWageall{} .thirdRealwageall{margin-left:55px;} .print3{display:block!important} .printBottomthird{display:none} .totalMoneyP{line-height:26px;;height:26px;} .tableContent3{font-size:14px!important;}";
        var cssstyle = "<style>" + style + "</style>";

        if (this.dzdMakeD.noPrint != 2) {
          if (this.projectIsWecan) {
            LODOP.ADD_PRINT_TEXT(
              "900",
              "50",
              "400",
              "22",
              "自2014-9月起，我司将全部开具增值税普通发票!"
            );
            LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "930",
              "50",
              "490",
              "22",
              "请务必于收到后三个工作日内签章回传确认并告知开票抬头!"
            );
            LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "960",
              "50",
              "500",
              "22",
              "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。"
            );
            LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
            LODOP.ADD_PRINT_TEXT(
              "990",
              "50",
              "500",
              "22",
              "如费用有疑问请联系：Tel:"
            );
            LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
            LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
            LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          }
          LODOP.ADD_PRINT_TEXT("990", "500", "500", "22", "Fax:");
        }

        if (this.dzdMakeD.noPrint == 2) {
          LODOP.ADD_PRINT_TEXT(
            "900",
            "50",
            "400",
            "22",
            "请立即支付上述预付款项至以下账户"
          );
          LODOP.SET_PRINT_STYLEA(1, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(1, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(1, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "930",
            "50",
            "490",
            "22",
            "账号名称:" + this.accountname
          );
          LODOP.SET_PRINT_STYLEA(2, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(2, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(2, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "960",
            "50",
            "500",
            "22",
            "开户账号:" + this.bank_account
          );
          LODOP.SET_PRINT_STYLEA(3, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(3, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(3, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "990",
            "50",
            "500",
            "22",
            "开户银行:" + this.bank
          );
          LODOP.SET_PRINT_STYLEA(4, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(4, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(4, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1020",
            "50",
            "500",
            "22",
            "操作完成按实际发生额对账开票，若与预付款总金额有差别，多退少补！"
          );
          LODOP.SET_PRINT_STYLEA(5, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(5, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(5, "FontSize", 11);
          LODOP.ADD_PRINT_TEXT(
            "1050",
            "50",
            "500",
            "22",
            "我司对账人:" + this.reconInfo.ourconfirmman
          );
          LODOP.SET_PRINT_STYLEA(6, "ItemType", 1);
          LODOP.SET_PRINT_STYLEA(6, "HOrient", 1);
          LODOP.SET_PRINT_STYLEA(6, "FontSize", 11);
        }
        LODOP.SET_PRINT_STYLEA(7, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(7, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(7, "FontSize", 11);
        LODOP.ADD_PRINT_TEXT("1080", "50", "500", "22", "第#页/共&页");

        LODOP.SET_PRINT_STYLEA(8, "ItemType", 3);
        LODOP.SET_PRINT_STYLEA(8, "HOrient", 1);
        LODOP.SET_PRINT_STYLEA(8, "FontSize", 11);

        this.orderThird.forEach((item, index) => {
          LODOP.ADD_PRINT_HTM(
            "2%",
            "2%",
            "98%",
            "98%",
            cssstyle + document.getElementById("third" + index).innerHTML
          );
          if (index != this.orderThird.length - 1) {
            LODOP.NewPage();
          }
        });
        setTimeout(() => {
          LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 1200, 800, "");
          LODOP.PREVIEW();
        }, 500);
      }
      // setTimeout(()=>{
      //     this.$emit('Unvisible',{noclose:'2'})
      //   },800)
    },
    pdfF(pdfName) {
      //console.log(pdfName)

      if (this.dzms == 1) {
        // console.log(pdfName)

        //alert(this.pdfDname)
        var orginHeight = document.getElementById("first").clientHeight;
        document.getElementById("first").style.height = "1600px";
        //canvas.style.
        document.getElementById("first").style.fontSize = "20px";
        document.getElementById("lblWtkhname2").style.fontSize = "20px";

        html2Canvas(document.getElementById("first"), {
          allowTaint: true,
          taintTest: false
        }).then(canvas => {
          //console.log(canvas)
          // console.log(pdfName)
          //canvas.font="18px Georgia";
          var ctx = canvas.getContext("2d");

          ctx.font = "20px Georgia";
          if (this.projectIsWecan) {
            ctx.fillText(
              "自2014-9月起，我司将全部开具增值税普通发票！",
              10,
              canvas.height - 250
            );
            ctx.fillText(
              "请务必于收到后三个工作日内签章回传确认并告知开票抬头!",
              10,
              canvas.height - 200
            );
            ctx.fillText(
              "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。",
              10,
              canvas.height - 150
            );
            ctx.fillText("如费用有疑问请联系：", 10, canvas.height - 100);
            ctx.fillText("TEL:", 300, canvas.height - 100);
            ctx.fillText("FAX:", 600, canvas.height - 100);
          }

          ctx.fillText("当前1页", 10, canvas.height - 50);
          ctx.fillText("共1页", 100, canvas.height - 50);

          var pageData = canvas.toDataURL("./image/jpeg", 1.0);

          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          let fontSize = 200;
          let pageHeight = (contentWidth / 592.28) * 841.89;
          let leftHeight = contentHeight;
          let position = 0;
          let imgWidth = 595.28;
          let imgHeight = (592.28 / contentWidth) * contentHeight;

          let PDF = new JsPDF("", "pt", "a4");

          //PDF.setFontSize(100);
          PDF.addImage(pageData, "JPEG", 10, 28, imgWidth, imgHeight);
          //debugger;
          // console.log(pdfName)
          PDF.save(pdfName + ".pdf");
          //document.getElementById('first').style.height=orginHeight+'px'
        });
      } else if (this.dzms == 2) {
        //var pdfDname=this.pdfDname
        var objLength = this.orderSecond.length;
        var imgDataJson = [];
        var orginHeight = {};
        this.orderSecond.forEach((item, index) => {
          // 保留原来打印区域高度
          orginHeight["second" + index] = document.getElementById(
            "second" + index
          ).clientHeight;
          // 设置canvas高度
          document.getElementById("second" + index).style.height = "1600px";
          document.getElementById("second" + index).style.fontSize = "20px";
          document.getElementById("lblWtkhname2").style.fontSize = "20px";
          // 设置pdf页眉显示隐藏
          document.getElementById("secondTable" + index).style.display =
            "inline-table";
          //document.getElementById('second'+index).style.fontSize="20px"

          html2Canvas(document.getElementById("second" + index), {
            allowTaint: true,
            taintTest: false
          }).then(function(canvas) {
            //console.log(canvas)

            var ctx = canvas.getContext("2d");

            ctx.font = "20px Georgia";
            if (this.projectIsWecan) {
              ctx.fillText(
                "自2014-9月起，我司将全部开具增值税普通发票！",
                10,
                canvas.height - 250
              );
              ctx.fillText(
                "请务必于收到后三个工作日内签章回传确认并告知开票抬头!",
                10,
                canvas.height - 200
              );
              ctx.fillText(
                "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。",
                10,
                canvas.height - 150
              );
              ctx.fillText("如费用有疑问请联系：", 10, canvas.height - 100);
              ctx.fillText("TEL:", 300, canvas.height - 100);
              ctx.fillText("FAX:", 600, canvas.height - 100);
            }
            ctx.fillText("当前" + (index + 1) + "页", 10, canvas.height - 50);
            ctx.fillText("共" + objLength + "页", 100, canvas.height - 50);

            var pageData = canvas.toDataURL("./image/jpeg", 1.0);
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;
            let pageHeight = (contentWidth / 592.28) * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            let imgWidth = 595.28;
            let imgHeight = (592.28 / contentWidth) * contentHeight;
            imgDataJson[index] = {
              pageData: pageData,
              imgWidth: imgWidth,
              imgHeight: imgHeight
            };
            //document.getElementById('second'+index).style.height=orginHeight['second'+index]+'px'

            if (index > 0) {
              //document.getElementById('secondTable'+index).style.display="none"
            }
          });
        });

        var myInterval = setInterval(function() {
          if (imgDataJson.length == objLength) {
            //debugger;
            clearInterval(myInterval);
            var PDF = new JsPDF("", "pt", "a4");
            imgDataJson.forEach((item, index) => {
              //debugger
              //console.log(imgDataJson[0].pageData)
              if (index > 0) {
                PDF.addPage();
              }
              PDF.addImage(
                item.pageData,
                "JPEG",
                10,
                28,
                item.imgWidth,
                item.imgHeight
              );
            });

            PDF.save(pdfName + ".pdf");
          }
        }, 400);
      } else if (this.dzms == 3) {
        //var pdfDname=this.pdfDname
        var objLength = this.orderThird.length;
        var imgDataJson = [];
        var orginHeight = {};
        this.orderThird.forEach((item, index) => {
          // 保留原来打印区域高度
          orginHeight["third" + index] = document.getElementById(
            "third" + index
          ).clientHeight;
          // 设置canvas高度
          document.getElementById("third" + index).style.height = "1600px";
          document.getElementById("third" + index).style.fontSize = "16px";
          document.getElementById("lblWtkhname2").style.fontSize = "16px";
          document.getElementById("lblWtkhname2").style.fontFamily = "SimSun";
          // 设置pdf页眉显示隐藏
          document.getElementById("thirdTable" + index).style.display =
            "inline-table";
          html2Canvas(document.getElementById("third" + index), {
            allowTaint: true,
            taintTest: false
          }).then(function(canvas) {
            //console.log(canvas)

            var ctx = canvas.getContext("2d");

            ctx.font = "16px SimSun";
            if (this.projectIsWecan) {
              ctx.fillText(
                "自2014-9月起，我司将全部开具增值税普通发票！",
                10,
                canvas.height - 250
              );
              ctx.fillText(
                "请务必于收到后三个工作日内签章回传确认并告知开票抬头!",
                10,
                canvas.height - 200
              );
              ctx.fillText(
                "若贵司三日内未回传,我司则视为贵司默认此账单金额并开据发票。",
                10,
                canvas.height - 150
              );
              ctx.fillText("如费用有疑问请联系：", 10, canvas.height - 100);
              ctx.fillText("TEL:", 300, canvas.height - 100);
              ctx.fillText("FAX:", 600, canvas.height - 100);
            }
            ctx.fillText("当前" + (index + 1) + "页", 10, canvas.height - 50);
            ctx.fillText("共" + objLength + "页", 100, canvas.height - 50);

            var pageData = canvas.toDataURL("./image/jpeg", 1.0);
            let contentWidth = canvas.width;
            let contentHeight = canvas.height;
            let pageHeight = (contentWidth / 592.28) * 841.89;
            let leftHeight = contentHeight;
            let position = 0;
            let imgWidth = 595.28;
            let imgHeight = (592.28 / contentWidth) * contentHeight;
            imgDataJson[index] = {
              pageData: pageData,
              imgWidth: imgWidth,
              imgHeight: imgHeight
            };
            //document.getElementById('third'+index).style.height=orginHeight['third'+index]+'px'

            if (index > 0) {
              //document.getElementById('thirdTable'+index).style.display="none"
            }
          });
        });
        var myInterval = setInterval(function() {
          if (imgDataJson.length == objLength) {
            //debugger;
            clearInterval(myInterval);
            var PDF = new JsPDF("", "pt", "a4");
            imgDataJson.forEach((item, index) => {
              //debugger
              ////console.log(imgDataJson[0].pageData)
              if (index > 0) {
                PDF.addPage();
              }
              PDF.addImage(
                item.pageData,
                "JPEG",
                10,
                28,
                item.imgWidth,
                item.imgHeight
              );
            });

            PDF.save(pdfName + ".pdf");
          }
        }, 400);
      }
      // setTimeout(()=>{
      //    this.$emit('Unvisible',{noclose:'2'})
      //  },800)
    },
    dzdMethods(data) {
      console.log(data);
      this.dzdMakeDBackup = JSON.parse(JSON.stringify(data));

      this.reconInfo.confirmman = this.dzdMakeDBackup.confirmman
        ? this.dzdMakeDBackup.confirmman
        : "";
      this.reconInfo.confirmdate =
        this.dzdMakeDBackup.confirmdate &&
        this.dzdMakeDBackup.confirmdate.indexOf("1900") == -1
          ? this.dzdMakeDBackup.confirmdate
          : getMomentDate();
      this.reconInfo.ourconfirmman = this.dzdMakeDBackup.ourconfirmman
        ? this.dzdMakeDBackup.ourconfirmman
        : localStorage.getItem("usrname");
      this.reconInfo.ourconfirmdate =
        this.dzdMakeDBackup.ourconfirmdate &&
        this.dzdMakeDBackup.ourconfirmdate.indexOf("1900") == -1
          ? this.dzdMakeDBackup.ourconfirmdate
          : getMomentDate();
      this.reconInfo.confirmremark = this.dzdMakeDBackup.confirmremark
        ? this.dzdMakeDBackup.confirmremark
        : "";
      console.log(this.dzdMakeDBackup);

      // this.dzdMakeDBackup.jobnolist.forEach(item => {

      //   this.newWageList = this.newWageList.concat(item.wagelist.filter(i => !i.noAddShow))

      // })

      this.dzdMakeDBackup.jobnolist.forEach(item => {
        var currency = [];
        item.wagelist
          .filter(i => !i.noAddShow)
          .forEach(cost => {
            if (!currency.includes(cost.currency)) {
              currency.push(cost.currency);
              var wagelistAllFirst = item.wagelist
                .filter(i => !i.noAddShow)
                .reduce((a, b) => {
                  if (b.currency == cost.currency) {
                    a = Number(a) + Number(b.dwageall);
                  }
                  return a;
                }, 0);
              var wageremark = item.wagelist
                .filter(i => !i.noAddShow)
                .reduce((a, b) => {
                  if (b.currency == cost.currency) {
                    a += b.wageremark + "/";
                  }
                  return a;
                }, "");
              this.orderFirst.push({
                orderno: cost.orderno ? cost.orderno : cost.pono,
                mawb: cost.mawb,
                hbrq:
                  cost.hbrq && cost.hbrq.indexOf("1900") == -1 ? cost.hbrq : "",
                dwageall: wagelistAllFirst,
                currency: cost.currency,
                wageremark: wageremark.substring(0, wageremark.length - 1),
                realjzt: cost.realjzt,
                hbh: cost.hbh,
                hawb: cost.hawb,
                mdg: cost.mdg
              });
            }
          });
      });
      new Set(this.orderFirst.map(i => i.currency)).forEach(c => {
        //new Set能使用forEach循环
        var total = 0;
        this.orderFirst.forEach(item2 => {
          if (item2.currency == c) {
            total = Number(Number(total) + Number(item2.dwageall)).toFixed(2);
          }
        });
        this.orderWageTotal.push({ currency: c, total: total });
      });
      // if(this.orderFirst.length=='1'){
      //   this.orderWageTotal.push({ currency: this.orderFirst[0]['currency'], total: this.orderFirst[0]['wagelistAllFirst'] })
      // }else{
      //   this.orderWageTotal=this.orderFirst.reduce((a,b)=>{
      //     if(a.currency==b.currency)
      //   },[])
      // }
      // this.orderWageTotal=this.orderFirst.reduce((a,b)=>{
      //     if(a.)
      // },[])

      // 订单汇总(遍历订舱编号+货币组合)
      //var ordernoCurrency = []
      // this.newWageList.forEach(item => {
      //   if (ordernoCurrency.indexOf((item.orderno ? item.orderno : item.pono) + ' ' + item.currency + ' ' + item.realjzt + ' ' + item.hbh + ' ' + $.trim(item.hawb) + ' ' + $.trim(item.mawb) + ' ' + $.trim(item.hbrq) + ' ' + $.trim(item.mdg)) == -1) {
      //     ordernoCurrency.push((item.orderno ? item.orderno : item.pono) + ' ' + item.currency + ' ' + item.realjzt + ' ' + item.hbh + ' ' + $.trim(item.hawb) + ' ' + $.trim(item.mawb) + ' ' + $.trim(item.hbrq) + ' ' + $.trim(item.mdg))
      //   }
      // })
      // console.log(ordernoCurrency)
      // ordernoCurrency.forEach((item, index) => {
      //   console.log(item.split(' '))
      //   var wagelistAllFirst = 0
      //   var wageremark = ""
      //   var orderno = item.split(' ')[0]
      //   var currency = item.split(' ')[1]
      //   var realjzt = item.split(' ')[2]
      //   var hbh = item.split(' ')[3]
      //   var hawb = item.split(' ')[4]
      //   var mawb = item.split(' ')[5]
      //   var hbrq = item.split(' ')[6]
      //   var mdg = item.split(' ')[7]
      //   //console.log(mdg)
      //   this.newWageList.forEach(item2 => {
      //     if ((item2.orderno ? item2.orderno : item2.pono) == orderno && item2.currency == currency) {
      //       wagelistAllFirst = Number(Number(wagelistAllFirst) + Number(item2.dwageall)).toFixed(2)
      //       wageremark += item2.wageremark + '/'
      //     }
      //   })
      //   this.orderFirst.push({ orderno: orderno, mawb: mawb, hbrq: hbrq && hbrq.indexOf('1900') == -1 ? hbrq : '', dwageall: wagelistAllFirst, currency: currency, wageremark: wageremark.substring(0, wageremark.length - 1), realjzt: realjzt, hbh: hbh, hawb: hawb, mdg: mdg })
      // })
      // console.log(this.orderFirst)
      // var currencyList = []
      // this.orderFirst.forEach(item => {
      //   if (currencyList.indexOf(item.currency) == -1) {
      //     currencyList.push(item.currency)
      //   }
      // })
      // currencyList.forEach(item => {
      //   var total = 0;
      //   this.orderFirst.forEach(item2 => {
      //     if (item2.currency == item) {
      //       total = Number(Number(total) + Number(item2.dwageall)).toFixed(2)
      //     }
      //   })
      //   this.orderWageTotal.push({ currency: item, total: total })
      // })
      ////console.log(this.orderFirst)
      ////console.log(this.orderWageTotal)

      // 订单+分单汇总(遍历分运单号+货币组合)(暂时取消)
      // var orderList2 = []
      // this.newWageList.forEach(item => {
      //   if (orderList2.indexOf(item.orderno) == -1) {
      //     orderList2.push(item.orderno)
      //     this.orderSecond.push({ orderno: item.orderno, mawb: item.mawb, hbrq: item.hbrq, mdg: item.mdg, hawbWagelist: [] })
      //   }
      // })

      // var hawbCurrency = []
      // var hawbCurrencyObject = []
      // this.newWageList.forEach(item => {
      //   if (hawbCurrency.indexOf(item.orderno + ' ' + item.hawb + ' ' + item.currency) == -1) {
      //     hawbCurrency.push(item.orderno + ' ' + item.hawb + ' ' + item.currency)
      //     hawbCurrencyObject.push({ orhacu: item.orderno + ' ' + item.hawb + ' ' + item.currency, tax: item.tax })
      //   }
      // })
      // hawbCurrencyObject.forEach(item => {

      //   var orderno = item.orhacu.split(' ')[0]
      //   var hawb = item.orhacu.split(' ')[1]
      //   var currency = item.orhacu.split(' ')[2]
      //   var tax = item.tax

      //   this.orderSecond.forEach(item3 => {
      //     var dwageall = 0
      //     var realwageall = 0
      //     var wageremark = ""
      //     this.newWageList.forEach(item2 => {
      //       if (item2.orderno == orderno && item2.hawb == hawb && item2.currency == currency) {
      //         dwageall = Number(Number(dwageall) + Number(item2.dwageall)).toFixed(2)
      //         realwageall = Number(Number(realwageall) + Number(item2.realwageall)).toFixed(2)
      //         wageremark += item2.wageremark + "/"
      //       }
      //     })
      //     if (item3.orderno == orderno) {//订舱编号对应相同费用
      //       item3.hawbWagelist.push({ hawb: hawb, currency: currency, tax: tax, dwageall: dwageall, realwageall: realwageall, wageremark: wageremark.substring(0, wageremark.length - 1) })
      //       //item3.hawbWagelist.push({hawb:hawb,currency:currency,dwageall:dwageall,realwageall:realwageall,tax:tax})
      //     }
      //   })
      // })

      // // 订单+分单汇总total费用
      // this.orderSecond.forEach((item, index) => {
      //   this.orderSecondTotal.push({ orderno: item.orderno, wageList: [], currency: [] })
      // })
      // this.orderSecondTotal.forEach((item, index) => {
      //   this.orderSecond.forEach(item2 => {
      //     if (item.orderno == item2.orderno) {
      //       item2.hawbWagelist.forEach(item3 => {
      //         if (item.currency.indexOf(item3.currency + ' ' + item.orderno) == -1) {
      //           item.currency.push(item3.currency + ' ' + item.orderno)
      //         }
      //       })
      //     }
      //   })
      // })
      // this.orderSecondTotal.forEach(item => {

      //   item.currency.forEach(item2 => {
      //     var currency = item2.split(' ')[0]
      //     var orderno = item2.split(' ')[1]

      //     var total = 0;
      //     var total1 = 0
      //     //console.log(currency)
      //     //console.log(orderno)
      //     ////console.log(items)

      //     this.newWageList.forEach(item3 => {
      //       if (item3.currency == currency && item3.orderno == orderno) {
      //         total = Number(Number(total) + Number(item3.dwageall)).toFixed(2)
      //         total1 = Number(Number(total1) + Number(item3.realwageall)).toFixed(2)
      //       }

      //     })

      //     item.wageList.push({ currency: currency, total: total, total1: total1 })
      //   })

      // })

      //console.log(this.orderSecond)
      //console.log(this.orderSecondTotal)

      // 订单+费用明细
      this.dzdMakeDBackup.jobnolist.forEach((item, index) => {
        var job = item.jobListData;
        this.orderThird.push({
          orderno: job.orderno ? job.orderno : job.pono,
          mawb: job.mawb,
          hbrq: job.hbrq,
          mdg: job.mdg,
          realjzt: job.realjzt,
          hbh: job.hbh,
          hawb: job.hawb,
          sfg: job.sfg,
          hawbjfweight:job.hawbjfweight,
          itemWage: []
        });

        this.orderThirdTotal.push({
          orderno: job.orderno ? job.orderno : job.pono,
          wageList: [],
          currency: []
        });
        var total = 0;
        var total1 = 0;
        var wagelist = [];
        var currency = [];
        item.wagelist
          .filter(i => !i.noAddShow)
          .forEach(cost => {
            var repeat = 0;
            if (!this.orderThird[index]["itemWage"].length) {
              if (cost.dwageall !== cost.realwageall) {
                this.orderThird[index]["itemWage"].push({
                  items: cost.items,
                  num: "1",
                  currency: cost.currency,
                  dwageall: cost.dwageall,
                  realwageall: cost.dwageall,
                  price: cost.dwageall,
                  wageremark: cost.wageremark,
                  orderno: cost.orderno ? cost.orderno : cost.pono
                });
              } else {
                this.orderThird[index]["itemWage"].push({
                  items: cost.items,
                  num: cost.num,
                  currency: cost.currency,
                  dwageall: cost.dwageall,
                  realwageall: cost.realwageall,
                  price: cost.price,
                  wageremark: cost.wageremark,
                  orderno: cost.orderno ? cost.orderno : cost.pono
                });
              }
            } else {
              this.orderThird[index]["itemWage"].forEach(itemCost => {
                if (
                  itemCost.order == (cost.orderno ? cost.orderno : cost.pono) &&
                  itemCost.items == cost.items &&
                  itemCost.currency == cost.currency &&
                  itemCost.price == cost.price
                ) {
                  repeat = 1;
                  itemCost.realwageall = (
                    Number(itemCost.realwageall) + Number(cost.realwageall)
                  ).toFixed(2);
                  itemCost.dwageall = (
                    Number(itemCost.dwageall) + Number(cost.dwageall)
                  ).toFixed(2);
                  itemCost.wageremark += cost.wageremark + "/";
                }
              });
              if (repeat == 0) {
                if (cost.dwageall !== cost.realwageall) {
                  this.orderThird[index]["itemWage"].push({
                    items: cost.items,
                    num: "1",
                    currency: cost.currency,
                    dwageall: cost.dwageall,
                    realwageall: cost.dwageall,
                    price: cost.dwageall,
                    wageremark: cost.wageremark,
                    orderno: cost.orderno ? cost.orderno : cost.pono
                  });
                } else {
                  this.orderThird[index]["itemWage"].push({
                    items: cost.items,
                    num: cost.num,
                    currency: cost.currency,
                    dwageall: cost.dwageall,
                    realwageall: cost.realwageall,
                    price: cost.price,
                    wageremark: cost.wageremark,
                    orderno: cost.orderno ? cost.orderno : cost.pono
                  });
                }
              }
            }
            if (!currency.includes(cost.currency)) {
              currency.push(cost.currency);

              total = Number(cost.dwageall).toFixed(2);
              total1 = Number(cost.realwageall).toFixed(2);
              wagelist.push({
                currency: cost.currency,
                total: total,
                total1: total1
              });
            } else {
              var list = wagelist.filter(i => i.currency == cost.currency)[0];
              list["total"] = (
                Number(list["total"]) + Number(cost.dwageall)
              ).toFixed(2);
              list["total1"] = (
                Number(list["total1"]) + Number(cost.realwageall)
              ).toFixed(2);
            }
          });
        this.orderThirdTotal[index]["wageList"] = wagelist;
      });

      // var ordernoList3 = []

      // this.newWageList.forEach(item => {
      //   if (ordernoList3.indexOf(item.orderno ? item.orderno : item.pono) == -1) {
      //     ordernoList3.push(item.orderno ? item.orderno : item.pono)
      //     this.orderThird.push({ orderno: item.orderno ? item.orderno : item.pono, mawb: item.mawb, hbrq: item.hbrq, mdg: item.mdg, realjzt: item.realjzt, hbh: item.hbh, hawb: item.hawb, sfg: item.sfg, itemData: [], itemWage: [] })
      //   }
      // })
      // console.log(this.newWageList)
      // ////console.log(this.orderThird)
      // this.orderThird.forEach(item => {
      //   this.newWageList.forEach(item2 => {
      //     //console.log(item2)
      //     if (item.orderno == (item2.orderno ? item2.orderno : item2.pono)) {
      //       if (item.itemData.indexOf((item2.orderno ? item2.orderno : item2.pono) + ' ' + item2.items + ' ' + item2.currency + ' ' + item2.price) == -1) {
      //         item.itemData.push((item2.orderno ? item2.orderno : item2.pono) + ' ' + item2.items + ' ' + item2.currency + ' ' + item2.price)
      //       }
      //     }
      //   })
      // })
      // console.log(this.orderThird)
      // this.orderThird.forEach(item => {

      //   item.itemData.forEach(item2 => {
      //     //console.log(item2)
      //     var orderno = item2.split(' ')[0]
      //     var items = item2.split(' ')[1]
      //     var currency = item2.split(' ')[2]
      //     var price = item2.split(' ')[3]
      //     //var tax=item2.split(' ')[4]
      //     // var
      //     var numO = item2.split(' ')[4]
      //     var num = 0
      //     var dwageall = 0
      //     var realwageall = 0
      //     var wageremark = ""
      //     //var price=""
      //     this.newWageList.forEach(item3 => {
      //       if ((item3.orderno ? item3.orderno : item3.pono) == orderno && item3.items == items && item3.currency == currency && item3.price == price) {
      //         //price=item3.price
      //         num = Number(num) + Number(item3.num)
      //         dwageall = Number(Number(dwageall) + Number(item3.dwageall)).toFixed(2)
      //         realwageall = Number(Number(realwageall) + Number(item3.realwageall)).toFixed(2)
      //         wageremark += item3.wageremark + "/"
      //       }
      //     })

      //     item.itemWage.push({ items: items, num: num, currency: currency, dwageall: dwageall, realwageall: realwageall, price: price, wageremark: wageremark.substring(0, wageremark.length - 1) })

      //   })

      // })

      // //订单+费用明细 total
      // this.orderThird.forEach((item, index) => {
      //   this.orderThirdTotal.push({ orderno: item.orderno, wageList: [], currency: [] })
      // })
      // this.orderThirdTotal.forEach((item, index) => {
      //   this.orderThird.forEach(item2 => {
      //     if (item.orderno == item2.orderno) {
      //       item2.itemWage.forEach(item3 => {

      //         if (item.currency.indexOf(item3.currency + ' ' + item.orderno) == -1) {
      //           item.currency.push(item3.currency + ' ' + item.orderno)
      //         }

      //         // if(item.currency.indexOf(item3.currency+' '+item.orderno+' '+item.3items+' '+item.tax)==-1){
      //         //   item.currency.push(item3.currency+' '+item.orderno+' '+item3.items+' '+item.tax)
      //         // }

      //       })
      //     }
      //   })
      // })
      // this.orderThirdTotal.forEach(item => {

      //   item.currency.forEach(item2 => {
      //     var currency = item2.split(' ')[0]
      //     var orderno = item2.split(' ')[1]

      //     var total = 0;
      //     var total1 = 0
      //     //console.log(currency)
      //     //console.log(orderno)
      //     ////console.log(items)

      //     this.newWageList.forEach(item3 => {
      //       if (item3.currency == currency && (item3.orderno ? item3.orderno : item3.pono) == orderno) {
      //         total = Number(Number(total) + Number(item3.dwageall)).toFixed(2)
      //         total1 = Number(Number(total1) + Number(item3.realwageall)).toFixed(2)
      //       }

      //     })

      //     item.wageList.push({ currency: currency, total: total, total1: total })
      //   })

      // })
      //console.log(this.orderThirdTotal)
      //console.log(this.orderThird)

      //   var currency=[]
      //   var total=0
      //   item.hawbWagelist.forEach(item2=>{

      //     if(currency.indexOf(item2.currency)==-1){
      //       currency.push(item2.currency)
      //     }

      //   })
      //   currency.forEach(item3=>{
      //      item.hawbWagelist.forEach(item4=>{
      //       if(item4.currency==item3){
      //         total=Number(Number(total)+Number(item4.dwageall)).toFixed(2)
      //       }
      //      })
      //      this.orderThirdTotal.push({currency:item3,total:total})
      //   })

      // })

      // 订单+分单+费用明细
      // var ordernoList4=[]

      // this.newWageList.forEach(item=>{
      //   if(ordernoList4.indexOf(item.orderno)==-1){
      //     ordernoList4.push(item.orderno)
      //     this.orderForth.push({orderno:item.orderno,mawb:item.mawb,hbrq:item.hbrq,mdg:item.mdg,hawbData:[]})
      //   }

      // })

      // this.orderForth.forEach(item=>{
      //   var pushData4=[]
      //   this.newWageList.forEach(item2=>{
      //     if(item.orderno==item2.orderno){
      //       pushData4.push(item2)
      //       item.hawbData=pushData4
      //     }
      //   })

      // })

      // this.newWageList.forEach(item=>{
      //   this.orderForth.forEach(item2=>{
      //    if(item2.orderno==item.orderno){
      //      pushData4.push(item)
      //      item2.hawbData=pushData4
      //    }
      // })
      // })
      ////console.log(this.orderForth)
    },
    async ctypeCost() {
      //勾选费用List
      //alert('11')
      this.dzdMakeDs = {};
      this.dzdMakeDBackup = {};
      this.orderFirst = [];
      this.orderWageTotal = [];
      this.orderSecond = [];
      this.orderSecondTotal = [];
      this.orderThird = [];
      this.orderThirdTotal = [];
      this.orderForth = [];
      //this.newWageList = []

      await this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/CheckBill/GetCheckBill",
        data: {
          boguid: this.boguid,
          wageids: this.$refs.costDialog.$refs.mawbCharge.wageguidsCtype.length
            ? this.$refs.costDialog.$refs.mawbCharge.wageguidsCtype.join(",")
            : "-1",
          hpoid: this.mawbguid
        },
        noarea: true
      })
        .then(results => {
          var jobnolist = [];
          results.data.forEach((item, index) => {
            item.jobnolist.forEach((item2, index2) => {
              item2.realjzt =
                item2.realpiece +
                "/" +
                Number(item2.realweight).toFixed(2) +
                "/" +
                Number(item2.realvolume).toFixed(2);
              item2.hbrq = item2.hbrq.substring(0, 10);
              jobnolist.push({ jobListData: item2, wagelist: [] });
              item2.wagelist.forEach(item3 => {
                item3.realjzt = item2.realjzt;
                item3.hbh = item2.hbh;
                item3.dwageall = item3.finishwageall_checkbill;
                item3.hbrq = item2.hbrq.substring(0, 10);
                jobnolist[index2].wagelist.push(item3);
              });
            });
          });
          var printData = {
            area: this.area,
            system: "空出",
            accountcomname: results.data[0].accountcomname,
            settgid: results.data[0].accountcomgid,
            settjobid: results.data[0].jobnolist[0].settjobid,
            wageinout: "1",
            jobnolist: jobnolist,
            noPrint: 2,
            hpoid: this.mawbguid,
            confirmman: results.data[0].confirmman || "",
            confirmdate: results.data[0].confirmdate || "",
            confirmremark: results.data[0].confirmremark || "",
            ourconfirmman: results.data[0].ourconfirmman || "",
            ourconfirmdate: results.data[0].ourconfirmdate || "",
            useremail: localStorage.userEmail,
            isNeedEmail: false,
            cusemail: ""
          };
          //console.log(printData)
          this.dzdMakeDs = printData;
        })
        .catch(error => {});
      //console.log(this.dzdMakeDs)
      if (this.dzdMakeDs) {
        this.dzdMethods(this.dzdMakeDs);
      }
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.dzmake {
  font-size: 12px;

  #print1 {
    .firstPrint {
      margin-bottom: 10px;
    }

    table.print1 {
      tr {
        width: 100%;
      }

      td {
        min-width: 130px;
        width: 130px;
        border: none;
      }

      .grey {
        background: grey;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .TopNoLine {
        height: 38px;
        line-height: 38px;
        font-weight: bold;
      }
    }

    .totalMoney {
      p {
        letter-spacing: 0.1em;
        margin-bottom: 6px;
        height: 38px;
        line-height: 38px;
        font-weight: bold;
      }

      .firstWageall {
        margin-left: 700px;
      }

      span {
        display: inline-block;
        min-width: 100px;
      }
    }

    .printBottomFirst {
      font-size: 14px;
      text-align: left;
      margin-top: 18px;
      line-height: 1.8em;
    }
  }

  #print2 {
    .secondPrint {
      margin-bottom: 100px;

      .secondTitle {
        height: 30px;
        font-weight: bold;
        line-height: 30px;

        span {
          display: inline-block;
          width: 24%;
        }
      }

      .grey2 {
        background: grey;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: white;
        margin-top: 10px;
      }

      .totalMoney2 {
        font-weight: bold;
        margin-top: 20px;

        p {
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          height: 38px;
          line-height: 38px;
        }

        .left {
          font-weight: bold;
          font-size: 14px;
        }

        .secondWageall {
          font-weight: bold;
          font-size: 14px;
          margin-left: 470px;
        }

        .secondRealwageall {
          font-weight: bold;
          font-size: 14px;
        }

        .minWidth {
          display: inline-block;
          min-width: 100px;
          font-weight: bold;
        }
      }

      .tableContent {
        margin-top: 10px;
      }
    }

    .printBottomSecond {
      font-size: 14px;
      text-align: left;
      margin-top: 18px;
      line-height: 1.8em;
    }

    .TopNoLine {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
    }
  }

  #print3 {
    .thirdPrint {
      margin-bottom: 100px;

      .thirdTitle {
        height: 30px;
        line-height: 30px;
        font-weight: bold;

        span {
          display: inline-block;
          width: 18%;
        }
        .two{
          width:13%;
        }
        .twoV{
          width:13%;
        }
      }

      .tableContent3 {
        td {
          min-width: 120px;
        }
      }

      .grey3 {
        background: grey;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: white;
        margin-top: 10px;
      }

      .totalMoney3 {
        margin-top: 20px;
        font-weight: bold;

        p {
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          height: 38px;
          line-height: 38px;
        }

        .left {
          font-weight: bold;
          font-size: 14px;
        }

        .thirdWageall {
          font-weight: bold;
          font-size: 14px;
        }

        .thirdRealwageall {
          font-weight: bold;
          font-size: 14px;
          margin-left: 33px;
        }

        .minWidth {
          display: inline-block;
          min-width: 80px;
          font-weight: bold;
        }
      }

      .tableContent {
        margin-top: 10px;
      }
    }

    .printBottomthird {
      font-size: 14px;
      text-align: left;
      margin-top: 18px;
      line-height: 1.8em;
    }

    .TopNoLine {
      height: 30px;
      // line-height: 30px;
      font-weight: bold;
    }
  }
}
</style>
