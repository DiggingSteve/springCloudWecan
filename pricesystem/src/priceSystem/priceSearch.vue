<template>
  <div>
    <newFormCmpt
      :name="name"
      :view-data.sync="inputViewData"
      :model-data.sync="inputModelData"
      :search-data.sync="searchData"
      :chinese-where.sync="chineseWhere"
      :pageshow.sync="pageshow"
      :whereTmpShow="false"
      :isShowWtkh="isShowWtkh"
      pagetype="1"
    >
      <template :slot="'exForm'">
        <div style="order: 4">
          <div class="input-item">
            <div class="input-title">运输类型</div>
            <div class="input-content">
              <el-select v-model="selectedTransportType">
                <el-option
                  v-for="item in transportTypeArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- <div style="order: 8">
          <div class="input-item">
            <div class="input-title">包装类型</div>
            <div class="input-content">
              <el-select v-model="selectedPackageType">
                <el-option
                  v-for="item in packageTypeData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div> -->
        <div style="order: 5">
          <div class="input-item">
            <div class="input-title">运价性质</div>
            <div class="input-content">
              <el-select v-model="selectedCusStandard">
                <el-option
                  v-for="item in cusStandardArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- <div style="order: 6" v-show="isShowCusType">
          <div class="input-item">
            <div class="input-title">客户等级</div>
            <div class="input-content">
              <el-select v-model="selectedCusType">
                <el-option
                  v-for="item in cusData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div> -->

        <div style="order: 7">
          <div class="row exactWrap input-item selectWrap">
            <!-- 类型 -->
            <div class="tab type-class" style="border-right: solid 1px #c0c9d0">
              <el-select v-model="typeStatus">
                <el-option
                  v-for="item in typeEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <!-- 体积重量 -->
            <div
              class="tab"
              v-show="typeStatus == '1'"
              style="border-right: solid 1px #c0c9d0"
            >
              <span>重量</span
              ><input
                type="text"
                v-model="inputModelData.weight"
                @keyup="filterExactTable"
                placeholder="请输入"
              />
            </div>
            <div class="tab" v-show="typeStatus == '1'">
              <span>体积</span
              ><input
                type="text"
                v-model="inputModelData.vol"
                @keyup="filterExactTable"
                placeholder="请输入"
              />
            </div>

            <!-- 重量比例 -->
            <div
              class="tab"
              v-show="typeStatus == '2'"
              style="border-right: solid 1px #c0c9d0"
            >
              <span>重量</span>
              <el-select v-model="inputModelData.scope" clearable>
                <el-option
                  v-for="item in weightDiffData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.title"
                >
                </el-option>
              </el-select>
            </div>
            <div class="tab" v-show="typeStatus == '2'">
              <span>比例</span>
              <el-select v-model="inputModelData.scale" clearable>
                <el-option
                  v-for="item in volDiffData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
    </newFormCmpt>
    <div class="searchForm">
      <el-button @click="search()">查询</el-button>
      <!-- <el-button @click="isMoreCondition = !isMoreCondition"
        >更多查询</el-button
      > -->
    </div>
    <div class="row" v-show="isMoreCondition">
      <span style="color: red">填写全部货物数据可查看精确运价</span>
    </div>
    <div class="row" v-show="isMoreCondition">
      <div class="">
        <div class="row exactWrap">
          <div class="tab">
            <span>重量</span
            ><input
              type="text"
              v-model="inputModelData.weight"
              @keyup="filterExactTable"
              placeholder="请输入"
              style="border-right: solid 1px #c0c9d0"
            />
          </div>
          <div class="tab">
            <span>体积</span
            ><input
              type="text"
              v-model="inputModelData.vol"
              @keyup="filterExactTable"
              placeholder="请输入"
            />
          </div>
        </div>
      </div>
      <div class="item55" style="padding-left: 25px">
        <el-button style="float: left" @click="resetFilterData">清空</el-button>
      </div>
      <div class="item15" style="margin: auto 0">
        <div class="input-item" style="min-width: 0; width: 150px">
          <div class="input-title" style="line-height: 26px">币种</div>
          <div class="input-content">
            <el-select v-model="selectedCurrency">
              <el-option
                v-for="item in currencyArr"
                :key="item.cname"
                :label="item.cname"
                :value="item.cname"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <tableCompt :name="name" :table-data-res="tableDataRes">
      <template v-slot:area="pdata">
        <div class="row">
          <!-- <span @click="openWindow()">
            <i class="el-icon-s-order"></i>
          </span> -->
          <span>{{ tableDataRes[pdata.data.index].area }}</span>
        </div>
      </template>
      <template v-slot:addtime="pdata">
        <div class="row">
          <span>{{
            tableDataRes[pdata.data.index].addtime
              ? tableDataRes[pdata.data.index].addtime.substring(0, 10)
              : ""
          }}</span>
        </div>
      </template>
      <template v-slot:routing="pdata">
        <div style="padding: 5px">
          <div
            class="row"
            style="width: 150px; line-height: 20px; margin-bottom: 10px"
          >
            <div
              class="item15 icon-flight"
              style="width: 20px; height: 20px"
            ></div>
            <div class="item85" style="padding-left: 5px">
              <span>{{ tableDataRes[pdata.data.index].sfg }}-</span>
              <span v-if="tableDataRes[pdata.data.index].zzg != '直达'"
                >{{ tableDataRes[pdata.data.index].zzg }}-</span
              >
              <span>{{ tableDataRes[pdata.data.index].mdg }}</span>
            </div>
          </div>
          <div
            class="row"
            style="line-height: 20px"
            v-if="tableDataRes[pdata.data.index].hasTruckRouting"
          >
            <div
              class="item15 icon-truck"
              style="width: 20px; height: 20px"
              @click="loadTruckInfo(tableDataRes[pdata.data.index].truckFeeid)"
            ></div>
            <div class="item85" style="padding-left: 5px">
              <span>{{ tableDataRes[pdata.data.index].mdg }}-</span>
              <span>{{ tableDataRes[pdata.data.index].ddg }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:detailTitle="pdata">
        <!-- <span class="currencyDisplay">
          {{ selectedCurrency }}
        </span>
        <span class="blue"> {{ currentCurrency }}</span> -->
        <div
          style="display: flex; min-width: 500px; justify-content: space-around"
        >
          <span></span>
          <div
            class="input-item"
            style="
              width: 150px;
              min-width: 150px;
              margin: 0 0 0 10px;
              border: none;
            "
          >
            <div class="input-title">含卡车段费用</div>
            <div class="input-content">
              <el-select v-model="isContainsTruck">
                <el-option
                  v-for="item in booleanArr"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            class="input-item"
            style="
              width: 150px;
              min-width: 150px;
              margin: 0 0 0 10px;
              border: none;
            "
          >
            <div class="input-title">包装类型</div>
            <div class="input-content">
              <el-select v-model="selectedPackageType">
                <el-option
                  v-for="item in packageTypeData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            class="input-item"
            style="
              width: 150px;
              min-width: 150px;
              margin: 0 0 0 10px;
              border: none;
            "
          >
            <div class="input-title">客户等级</div>
            <div class="input-content">
              <el-select v-model="selectedCusType">
                <el-option
                  v-for="item in cusData"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:hs="pdata">
        <div style="width: 200px">
          <span
            class="el-icon-document-add"
            style="cursor: pointer; font-size: 18px; color: #0f5a8c"
            @click="
              priceObj.openHbhDialog(
                tableDataRes[pdata.data.index].twocode,
                tableDataRes[pdata.data.index].sfg,
                tableDataRes[pdata.data.index].mdg,
                tableDataRes[pdata.data.index].hbh,
                tableDataRes[pdata.data.index].flightList
              )
            "
          ></span>

          <span>{{
            setAircomName(tableDataRes[pdata.data.index].twocode)
          }}</span>
        </div>
      </template>
      <template v-slot:detail="pdata">
        <template>
          {{ void (currentIndex = pdata.data.index) }}
          {{ void (currentRow = tableDataRes[currentIndex]) }}
        </template>
        <table
          style="min-width: 500px; font-size: 10px; text-align: center"
          v-if="isExactSearch"
        >
          <tbody>
            <tr>
              <td style="border: 0">
                折算单价:
                {{ currentRow.isShow ? currentRow.exactPrice : "无匹配费用" }}
              </td>
            </tr>
          </tbody>
        </table>
        <table
          style="min-width: 500px; font-size: 10px; text-align: center"
          v-if="!isExactSearch"
        >
          <tbody>
            <tr>
              <td
                :style="getTdStyle(pdata.data.row.showWeightVolume)"
                @click="
                  pdata.data.row.showWeightVolume =
                    !pdata.data.row.showWeightVolume
                "
              >
                <i
                  :class="
                    pdata.data.row.showWeightVolume
                      ? 'el-icon-document-remove'
                      : 'el-icon-document-add'
                  "
                  :title="pdata.data.row.showWeightVolume ? '收起' : '详细'"
                  style="font-size: 18px; color: #0f5a8c"
                ></i>
                <!-- {{pdata.data.row.showWeightVolume?'收起':'展开'}} -->
              </td>
              <template v-if="pdata.data.row.showWeightVolume">
                <td
                  style="height: 15px"
                  v-for="(weight, j) in priceObj.weightArr"
                  v-if="
                    !inputModelData.scope ||
                    inputModelData.scope == weight.title ||
                    typeStatus == '1'
                  "
                >
                  {{ weight.title }}
                </td>
              </template>
            </tr>
            <template v-if="pdata.data.row.showWeightVolume">
              <tr
                v-for="(vol, i) in priceObj.volArr"
                v-if="
                  !inputModelData.scale ||
                  inputModelData.scale == vol.code ||
                  typeStatus == '1'
                "
              >
                <td>{{ vol.code }}</td>
                <template v-for="(weight, j) in priceObj.weightArr">
                  {{ void (cellValue = setCellValue(vol, weight, currentRow)) }}
                  <td
                    v-if="
                      !inputModelData.scope ||
                      inputModelData.scope == weight.title ||
                      typeStatus == '1'
                    "
                    style="width: 25px; height: 15px"
                    v-bind:class="{
                      red: isExactSearch && cellValue * 1 >= 0,
                    }"
                  >
                    {{
                      (cellValue >= 0 ||
                      cellValue.indexOf(",") >= 0 ||
                      cellValue.indexOf(".") >= 0
                        ? currentCurrencySymbol
                        : "") +
                      (selectedCurrency == "人民币" && cellValue >= 0
                        ? (cellValue * 1).toFixed(2)
                        : cellValue)
                    }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
    </tableCompt>
    <el-dialog
      :title="`卡车信息 目的港:${truckInfo.mdg} -> 到达港: ${truckInfo.ddg}`"
      :visible.sync="isShowTruckDetail"
      :width="'90%'"
      :center="true"
    >
      <div
        class="row"
        style="min-height: 200px; over-flow: auto"
        v-if="!!truckInfo.ddg"
      >
        <table class="truckTable" style="height: 100%; width: 1200px">
          <tr>
            <th>目的地</th>
            <th>M</th>
            <th>flat</th>
            <template v-for="item in truckInfo.codeArr">
              <th>{{ item.code }}</th>
            </template>
          </tr>
          <tr>
            <td>{{ truckInfo.ddg }}</td>
            <td>￥{{ truckInfo.min.toFixed(2) }}</td>
            <td>￥{{ truckInfo.flat.toFixed(2) }}</td>
            <template v-for="item in truckInfo.codeArr">
              <td>￥{{ item.diff.toFixed(2) }}</td>
            </template>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog
      title="航班信息"
      :visible.sync="priceObj.isShowHbhDetail"
      :close-on-click-modal="false"
      :before-close="closeHbhDetail"
      :width="'90%'"
    >
      <el-tabs v-model="priceObj.selectedHbhKey" type="card" @tab-click="">
        <template v-for="(item, key) in priceObj.hbhMap">
          <el-tab-pane :label="item.hbh" :name="key">
            <div class="hbhDetail" v-if="item.isSelfInput == 2">
              <div class="row title">
                <div class="item30">
                  <span>航班号:</span><span>{{ item.hbh }}</span>
                </div>
                <div class="item30">
                  <span>始发港:</span><span>{{ item.sfg }}</span>
                </div>
                <div class="item30">
                  <span>目的港:</span><span>{{ item.mdg }}</span>
                </div>
              </div>
              <div class="row">
                <table>
                  <tbody>
                    <tr>
                      <td>航班日期</td>
                      <td>起飞时间</td>
                      <td colspan="4">目的港信息</td>
                    </tr>
                    <template v-for="p in item.detailArr">
                      <tr>
                        <td rowspan="2">{{ getDayOfWeek(p.airweekdetail) }}</td>
                        <td rowspan="2">{{ p.flaytime.slice(11, 16) }}</td>
                        <td>经停港</td>
                        <td>经停时间</td>
                        <td>到达时间</td>
                        <td>时差</td>
                      </tr>
                      <tr>
                        <td>{{ p.jjg }}</td>
                        <td>
                          {{
                            p.jdate.slice(11, 16) == "00:00"
                              ? ""
                              : p.jdate.slice(11, 16)
                          }}
                        </td>

                        <td>{{ p.reachtime.slice(11, 16) }}</td>
                        <td>{{ p.timedifference }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="hbhDetail" v-if="item.isSelfInput == 1">
              <div class="row title">
                <div class="item30">
                  <span>航班号:</span><span>{{ item.hbh }}</span>
                </div>
                <div class="item30">
                  <span>始发港:</span><span>{{ item.sfg }}</span>
                </div>
                <div class="item30">
                  <span>目的港:</span><span>{{ item.mdg }}</span>
                </div>
              </div>
              <div class="row">
                <table>
                  {{
                    void (weekList = item.schedule.split(","))
                  }}
                  <tbody>
                    <tr>
                      <td>航班日期</td>
                      <td>起飞时间</td>
                      <td colspan="4">目的港信息</td>
                    </tr>
                    <template v-for="day in weekList">
                      <tr>
                        <td rowspan="2">{{ convertIntToWeek(day * 1) }}</td>
                        <td rowspan="2">--</td>
                        <td>经停港</td>
                        <td>经停时间</td>
                        <td>到达时间</td>
                        <td>时差</td>
                      </tr>
                      <tr>
                        <td>--</td>
                        <td>--</td>

                        <td>--</td>
                        <td>--</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <!-- <table class="detailTable">
                {{
                  void (weekList = item.schedule.split(","))
                }}
                <thead>
                  <tr>
                    <td>航班日期</td>
                    <td>起飞时间</td>
                    <td>经停港</td>
                    <td>经停时间</td>
                    <td>目的港</td>
                    <td>到达时间</td>
                    <td>时差</td>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="day in weekList">
                    <tr>
                      <td>{{ convertIntToWeek(day * 1) }}</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  </template>
                </tbody>
              </table> -->
            </div>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { priceRouting } from "./js/priceRouting";
import { diffCodeKey } from "../api/getBasicStorageData";
import { queueKey, SystemMessage } from "../store/systemMessage";
import { delay } from "lodash";
let airInfoArr = JSON.parse(localStorage.getItem("airinfo"));
const all = "全部";
let transportTypeData = [all, "直达", "中转"];
const normalCus = "公布运价";
const singleCus = "客户报价";
var filterTimeoutId = null;
var tableDataCopy = null;
export default {
  name: "priceSearch",
  components: {},

  data() {
    return {
      name: "priceSearch.vue",
      inputViewData: {},
      //volType 选中的货型类型,weight 输入的重量
      //vol 输入的体积  体积/0.006 和重量比较取较大值为当前货重 再筛选列表
      inputModelData: { weight: "", vol: "", volType: "" },
      currencyArr: [], // 汇率数组 从localStroage中取出
      selectedCurrency: "人民币", //选中的汇率
      transportTypeArr: transportTypeData, //运输方式数据
      selectedTransportType: all, //选中的运输方式
      selectedPackageType: "托盘", //选中的包装类型
      selectedCusType: "A类", //选中的客户类型
      isContainsTruck: true,
      booleanArr: [
        { code: true, name: "是" },
        { code: false, name: "否" },
      ],
      cusStandardArr: [all, normalCus, singleCus],
      selectedCusStandard: all, //选中的单一客户 分类客户
      isMoreCondition: false, //更多查询
      searchData: {},
      tableDataRes: [],
      chineseWhere: [],
      packageTypeData: JSON.parse(localStorage.getItem(diffCodeKey.package)),
      cusData: JSON.parse(localStorage.getItem(diffCodeKey.cus)),
      volDiffData: JSON.parse(localStorage.getItem("volDiff")),
      weightDiffData: JSON.parse(localStorage.getItem("weightDiff")),
      typeEnum: [
        {
          label: "具体",
          value: "1",
        },
        {
          label: "范围",
          value: "2",
        },
      ],
      typeStatus: "1",
      indexCusSelected: 0,
      indexPackageSelected: 0,
      isExactSearch: false, //是否精确查询
      pageshow: true,
      priceObj: new priceRouting(this),
      isShowTruckDetail: false,
      truckInfo: {},
      //showWeightVolume:false,//展开、收缩
    };
  },
  methods: {
    openWindow() {
      var isOpen = window.opener.queueObj.boState["isOpen"];
      var gotNav = "newOrderSearch";
      window.opener.queueObj.boState["gotoNav"] = gotNav;
      if (isOpen) {
        //app.vue载入完毕设置为 已打开状态 则可以进行直接路由跳转 否则需要先打开bo
        window.opener.queueObj.publish(queueKey.gotoNav, gotNav);
      } else {
        window.opener.queueObj.publish(queueKey.openBo, {});
      }
      window.opener.queueObj.publish(queueKey.feeToSubShipace, { a: 1 });
    },
    getTdStyle(type) {
      //td样式
      let style = { width: "25px", height: "15px", cursor: "pointer" };
      if (!type) {
        style.borderTop = "none";
        style.borderBottom = "none";
      }
      return style;
    },
    search() {
      var _this = this;
      let url = this.$store.state.feeWebApi + "airFreightFee/getRouting";
      let where = {};
      this.addSearchCondition("sfg", where, "sfg");
      this.addSearchCondition("twocode", where, "twocode");

      where["gid"] = {};
      if (this.selectedCusStandard == "全部") {
      } else if (this.selectedCusStandard != normalCus) {
        where["gid"]["begin"] = 0;
        this.addSearchCondition("gid", where, "wtxm");
      } else {
        where["gid"] = -1;
      }
      // this.addSearchCondition("mdg", where, "mdg");
      this.addSearchCondition("wffAreaid", where, "areaname");
      if (this.selectedTransportType != all) {
        if (this.selectedTransportType == "直达") {
          where["zzg"] = "直达";
        } else {
          where["zzg"] = {};
          where["zzg"]["not"] = "直达";
        }
      }
      this.addSearchCondition("gid", where, "wtkh");

      if (!!this.searchData.validityDate) {
        var d = this.searchData.validityDate;
        if (!!d.begin) {
          where["endDate"] = {};
          where["endDate"]["begin"] = d.begin;
        }
        if (!!d.end) {
          where["startDate"] = {};
          where["startDate"]["end"] = d.end;
        }
      }
      where["area"] = {};
      where["area"]["in"] = this.$store.state.areaState;
      var jsonArr = {
        where: {
          ...where,
        },
      };
      var postJson = { json: JSON.stringify(jsonArr) };
      if (!!this.searchData.mdg) {
        postJson["mdg"] = this.searchData.mdg.like;
      } else postJson["mdg"] = "";

      this.priceObj.request("post", url, postJson).then(({ data }) => {
        data.resultdata.forEach((i) => {
          this.$set(i, "showWeightVolume", false);
        });
        tableDataCopy = JSON.parse(JSON.stringify(data.resultdata));
        if (this.isExactSearch) {
          this.updateList();
        } else {
          this.tableDataRes = data.resultdata;
        }
        if (this.searchData.mdg) {
          this.tableDataRes.forEach((item) => {
            if (item.hasTruckRouting) {
              if (!!!item.ddg) return;
              if (!!!_this.searchData.mdg.like) return;
              if (
                item.ddg.toLowerCase() !=
                _this.searchData.mdg.like.toLowerCase()
              ) {
                item.hasTruckRouting = false;
              }
            }
          });
        }
        if (this.tableDataRes.length == 0) this.$message("无查询数据");
      });
    },
    updateList() {
      if (!this.isExactSearch) return;
      var vol = this.inputModelData.vol;
      var weight = this.inputModelData.weight;
      var volType = this.getVolType(vol, weight);
      var calWeight = this.calWeight(); //计重
      var grossWeight = weight * 1;
      // 精准查询的时候通过计重或者毛重筛选数据 根据计费方式上的毛重 计重
      this.tableDataRes = this.filterDataByWeight(
        tableDataCopy,
        calWeight,
        grossWeight,
        volType
      );
    },
    /**设置航司名字 */
    setAircomName(twocode) {
      var aircom = airInfoArr.find((item) => {
        return item.TwoCode == twocode;
      });
      return aircom.CName;
    },
    /**
     * key where条件传入后台的key
     * target 目标对象 这边是where
     * searchDataKey searchData 内部的key
     */
    addSearchCondition(key, target, searchDataKey) {
      if (!!this.searchData[searchDataKey]) {
        target[key] = this.searchData[searchDataKey];
      }
    },

    //计算空运货重
    calWeight() {
      var volWeight = (this.inputModelData.vol * 1) / 0.006;
      return volWeight > this.inputModelData.weight * 1
        ? volWeight
        : this.inputModelData.weight * 1;
    },
    /**
     * @param dataArr 后端范围列表
     * @param calWeight 计重
     * @param grossWeight 毛重
     * @param volType 查询框选中的货物比例
     */
    filterDataByWeight(dataArr, calWeight, grossWeight, volType) {
      var dataArrCopy = JSON.parse(JSON.stringify(dataArr));
      var weightArr = this.priceObj.weightArr;
      var volArr = this.priceObj.volArr;
      calWeight = calWeight.toFixed(0);
      dataArrCopy.forEach((item) => {
        let weight = null;
        if (item.jfType == "毛重") {
          weight = grossWeight;
        } else {
          weight = calWeight;
        }
        item.calWeight = weight;
        var exactWeight = this.getWeight(weight);
        this.reversePrice(item, exactWeight, volType, weight, calWeight);
      });
      return dataArrCopy;
    },

    //计算每行的单价是否吃到min 吃到Min就要倒算
    reversePrice(row, weightCode, volType, weight, calWeight) {
      var isContainsTruck = this.isContainsTruck;
      var packageDiff = row.packageCusDiffMap[this.selectedPackageType];
      var cusDiff = row.packageCusDiffMap[this.selectedCusType];
      var minFixedPrice = row.fixedFeeList.find((item) => {
        return (
          (!!item.cus ? item.cus == this.selectedCusType : true) &&
          (!!item.packageType
            ? item.packageType == this.selectedPackageType
            : true) &&
          item.vol == volType &&
          item.weight == "+0kg"
        );
      });
      var minFlight = row.weightArr.find((item) => {
        return item.code == "+0kg";
      });
      var flightMinPrice;
      if (!!minFixedPrice) flightMinPrice = minFixedPrice.diff * 1;
      else flightMinPrice = !!minFlight ? minFlight.standardPrice : 0;

      //查卡车min价格
      var truckMinPrice =
        row.truckFixedMin > 0
          ? row.truckFixedMin
          : row.truckMin + row.truckMinDiff;
      var matchFlight = row.weightArr.find((item) => {
        return item.code == weightCode;
      });
      var matchTruck = row.truckFeeWeightList.find((item) => {
        return item.code == weightCode;
      });
      var matchFlightPrice = !!matchFlight ? matchFlight.standardPrice * 1 : 0;
      var matchTruckPrice = !!matchTruck
        ? matchTruck.fixedDiff > 0
          ? matchTruck.fixedDiff
          : matchTruck.diff + matchTruck.wageinDiff
        : 0;
      if (matchFlightPrice == 0) {
        // 没有匹配的价格 没维护 这一行可以隐藏
        row.isShow = false;
        return;
      }
      matchFlightPrice =
        matchFlightPrice +
        (packageDiff > 0 ? packageDiff : 0) +
        (cusDiff > 0 ? cusDiff : 0);
      var flightTotal = matchFlightPrice * weight * 1;
      var truckTotal = matchTruckPrice * calWeight * 1;
      if (flightTotal >= flightMinPrice && truckTotal >= truckMinPrice) {
        row.exactPrice =
          matchFlightPrice + (isContainsTruck ? matchTruckPrice : 0);
        row.isShow = true;
        return;
      }
      //需要倒算
      flightTotal = flightTotal < flightMinPrice ? flightMinPrice : flightTotal;
      truckTotal = isContainsTruck
        ? truckTotal < truckMinPrice
          ? truckMinPrice
          : truckTotal
        : 0;

      row.exactPrice = (flightTotal / weight + truckTotal / calWeight).toFixed(
        2
      );
      row.isShow = true;
    },

    loadTruckInfo(truckFeeid) {
      this.isShowTruckDetail = true;
      let url = this.$store.state.feeWebApi + "truckFee/getList";
      let where = { guid: truckFeeid };

      var jsonArr = {
        where: {
          ...where,
        },
      };

      this.priceObj
        .request("get", url, { json: JSON.stringify(jsonArr) })
        .then(({ data }) => {
          this.truckInfo = data.resultdata[0];
        });
    },

    /**
     * @vol 当前对应的比例
     * @weight 当前对应重量
     * @currentRow 指查询接口返回数组对应的当前行数据
     */
    setCellValue(vol, weight, currentRow) {
      // 查找当前格子一口价
      var matchFixedPrice = currentRow.fixedFeeList.find((item) => {
        return (
          (!!item.cus ? item.cus == this.selectedCusType : true) &&
          (!!item.packageType
            ? item.packageType == this.selectedPackageType
            : true) &&
          item.vol == vol.code &&
          item.weight == weight.code
        );
      });
      //激活了一口价 但是没设置有效的数字 则显示--
      if (!!matchFixedPrice) {
        if (matchFixedPrice.diff > 0) {
          let v =
            matchFixedPrice.diff / this.currentCurrency +
            this.getTruckFee(weight, currentRow);

          return v.toLocaleString();
        } else return "--";
      }
      //weight package vol cus 基础参数中 每个对象 isSetValue为true的将被保存进数据库
      // 对应位置需要用一口价替换
      //  取weight standardprice weight.standardPrice+vol.diff+cus.diff+package.diff
      var volCode = vol.code;
      var weightCode = weight.code;
      // 未选择card 则返回数组为一个空数组 这种情况视为全选
      //维护时选中有钩稽关系的数据 matchVol 和 matchWeight
      var matchVol = currentRow.volArr.find((item) => {
        return item.code == volCode;
      });
      if(!matchVol.isSetValue)return "--";
      var matchWeight = currentRow.weightArr.find((item) => {
        return item.code == weightCode;
      });
      var minWeight = currentRow.weightArr.find((item) => {
        return item.code == "+0kg";
      });
      var packageCusMap = currentRow["packageCusDiffMap"]; //为了前端渲染效率 直接将钩稽关系转换成了一个map
      var packageDiff = packageCusMap[this.selectedPackageType] * 1;
      var cusDiff = packageCusMap[this.selectedCusType] * 1;
      if (currentRow.packageTypeArr.length > 0 && !Number.isFinite(packageDiff))
        return "--";
      if (currentRow.cusArr.length > 0 && !Number.isFinite(cusDiff))
        return "--";
      packageDiff = Number.isFinite(packageDiff) ? packageDiff : 0;
      cusDiff = Number.isFinite(cusDiff) ? cusDiff : 0;
      var volDiff = !!matchVol ? matchVol.diff * 1 : 0;
      var val = 0;
      var isSetStandardPrice = !!matchWeight;
      if (!isSetStandardPrice) return "--";
      if (weight.title == "MIN") {
        val =
          matchWeight.standardPrice == 0
            ? undefined
            : matchWeight.standardPrice / this.currentCurrency;
        if (!Number.isFinite(val)) return "--";
        if (!this.isExactSearch)
          val = val + this.getTruckFee(weight, currentRow);
        return val.toLocaleString();
      }
      val = (
        (matchWeight.standardPrice + volDiff + packageDiff + cusDiff) /
        this.currentCurrency
      ).toLocaleString();

      if (!this.isExactSearch)
        return (
          val * 1 +
          this.getTruckFee(weight, currentRow) * 1
        ).toLocaleString();
      return val;
    },

    // 计算卡车费
    getTruckFee(weight, currentRow) {
      if (!this.isContainsTruck || !currentRow.hasTruckRouting) return 0;
      var truckMinDiff = currentRow.truckMinDiff;
      var truckMin = currentRow.truckMin;
      var truckFixedMin = currentRow.truckFixedMin;

      var matchWeight = currentRow.truckFeeWeightList.find((f) => {
        return f.code == weight.code;
      });
      console.log(weight);
      if (weight.code != "+0kg") {
        return matchWeight
          ? matchWeight.fixedDiff > 0
            ? matchWeight.fixedDiff
            : matchWeight.diff + matchWeight.wageinDiff
          : 0;
      } else if (weight.code == "+0kg") {
        return truckFixedMin > 0 ? truckFixedMin : truckMinDiff + truckMin;
      }
    },

    getFlightTypeName(id) {
      var name;
      switch (id) {
        case 116:
          name = "货机";
          break;
        case 115:
          name = "客机";
          break;
      }
      return name;
    },
    getDayOfWeek(num) {
      var name;
      switch (num) {
        case 1:
          name = "周一";
          break;
        case 2:
          name = "周二";
          break;
        case 3:
          name = "周三";
          break;
        case 4:
          name = "周四";
          break;
        case 5:
          name = "周五";
          break;
        case 6:
          name = "周六";
          break;
        case 7:
          name = "周日";
          break;
      }
      return name;
    },

    closeHbhDetail() {
      this.priceObj.hbhMap = {};
      this.priceObj.isShowHbhDetail = false;
    },
    getCurrencySymbol(currency) {
      switch (currency) {
        case "人民币":
          return "￥";
        case "英镑":
          return "￡";
        case "日元":
          return "J￥";
        case "欧元":
          return "€";
        case "港币":
          return "HK$";
        case "越南盾":
          return "₫";
        case "美元":
          return "$";
      }
    },
    //将数字转换成中文周
    convertIntToWeek(num) {
      switch (num) {
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 7:
          return "周日";
      }
    },
    getVolType(vol, weight) {
      var calWeight = (weight * 1) / (vol * 1); //计算当前比例 小于1:80 按 1:80 算 例:计算得出 150 则 100<= 150 <167 落在 1:100档位
      if (calWeight < 80) return "1:80";
      var result;
      for (var i = 0; i < this.priceObj.volArr.length; i++) {
        var item = this.priceObj.volArr[i];
        var v = item.code.substring(2, item.code.length) * 1;
        if (calWeight >= v) {
          result = item.code;
        } else {
          break;
        }
      }
      return result;
    },

    getWeight(weight) {
      if (weight < 45) return "-45kg";
      var result;
      for (var i = 0; i < this.priceObj.weightArr.length; i++) {
        var item = this.priceObj.weightArr[i];
        var codeNum = item.code.replace("kg", "") * 1;
        if (item.code != "+0kg" && item.code != "-45kg") {
          if (weight >= codeNum) {
            result = item.code;
          } else if (weight < codeNum) {
            break;
          }
        }
      }
      return result;
    },
    /**精确筛选价格 */
    filterExactTable() {
      var vol = this.typeStatus == "1" ? this.inputModelData.vol : ""; //1为具体筛选
      var weight = this.typeStatus == "1" ? this.inputModelData.weight : "";
      var volType = this.getVolType(vol, weight);
      if (!!!vol || !!!weight || !!!volType) {
        this.tableDataRes = tableDataCopy;
        this.isExactSearch = false;
        return;
      }
      if (filterTimeoutId) clearTimeout(filterTimeoutId);
      filterTimeoutId = delay(() => {
        var calWeight = this.calWeight(); //计重
        this.isExactSearch = true;
        var grossWeight = weight * 1;
        // 精准查询的时候通过计重或者毛重筛选数据 根据计费方式上的毛重 计重
        this.tableDataRes = this.filterDataByWeight(
          tableDataCopy,
          calWeight,
          grossWeight,
          volType
        );
      }, 1500);
    },
    resetFilterData() {
      this.inputModelData.vol = "";
      this.inputModelData.weight = "";
      this.inputModelData.volType = "";
      this.tableDataRes = tableDataCopy;
      this.isExactSearch = false;
    },
  },
  beforeMount: function () {
    var arr = JSON.parse(localStorage.getItem("currencyData"));
    var map = {};

    arr.forEach((item) => {
      if (!!!map[item.fcode]) {
        map[item.fcode] = item;
      }
    });
    this.currencyArr = Object.values(map);
  },
  computed: {
    selectedPackageName: function () {
      return this.priceObj.packageTypeArr[this.indexPackageSelected].code;
    },

    selectedCusName: function () {
      return this.priceObj.cusArr[this.indexCusSelected].code;
    },
    currentCurrency: function () {
      return this.currencyArr.find((item) => {
        return item.cname == this.selectedCurrency;
      }).basicprice;
    },
    currentCurrencySymbol: function () {
      return this.getCurrencySymbol(this.selectedCurrency);
    },
    isShowWtkh: function () {
      return this.selectedCusStandard == singleCus;
    },

    isShowCusType: function () {
      return this.selectedCusStandard == normalCus;
    },
  },
  watch: {
    typeStatus(val) {
      this.filterExactTable();
    },
    selectedPackageType(val) {
      this.updateList();
      this.$forceUpdate();
    },
    selectedCusType(val) {
      this.updateList();
      this.$forceUpdate();
    },
    isContainsTruck(val) {
      this.updateList();
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./css/flex-row.less");
@blue: #0f5a8c;
@smallFont: 10px;
@greyBorder: #80808047;
@grey: #f8f8f8;
.blueText {
  color: @blue;
}
.currencyDisplay {
  font-weight: 100;
  font-size: 8px;
  margin-left: 50%;
  & + .blue {
    color: @blue;
    font-weight: 100;
    font-size: 8px;
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
}
.red {
  color: red;
}
.exactWrap {
  border: solid 1px #c0c9d0;
  border-radius: 4px;
  line-height: 27px;
  width: 270px;
  padding: 0 10px;

  & input {
    font-size: 14px !important;
    // width: 80px;
    width: 80px;
    text-align: right;
    padding-right: 10px;
    line-height: 22px;
    padding: 0 5px 0 0 !important;
  }
  /deep/ & .el-input__inner {
    border: 0 !important;
    width: 80px !important;
    text-align: right;
  }
  .type-class {
    /deep/ & .el-input__inner {
      width: 45px !important;
    }
  }
}

// .selectWrap {
//    & input {
//     width: 60px;
//   }
//   /deep/ & .el-input__inner {
//     width: 60px !important;
//   }
// }

.input-item {
  width: 300px;
  min-width: 300px;
  display: flex;
  margin-bottom: 12px;
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

.input-content .el-select {
  width: 100%;
}

.icon-flight {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 30px 20px;
  background-image: url("../../boStatic/images/icon_flight.png");
}
.icon-truck {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 30px 20px;
  background-image: url("../../boStatic/images/icon_truck.png");
  cursor: pointer;
}

.trRow td:last-child {
  border-right: 0;
}
.tab-wrap .tab {
  cursor: pointer;
  border: 1px solid #dedede;
  border-radius: 5px;
  margin: 5px 10px 5px 0;
  display: inline-block;
}
.tab .tab-item {
  border-radius: 3px;
  display: inline-block;
  min-width: 52px;
  padding: 0 10px;
  height: 27px;
  text-align: center;
  line-height: 27px;
  vertical-align: middle;
}
.tab .tab-item.active {
  color: #fff;
  background: @blue;
}
.truckTable {
  text-align: center;

  border: 1px solid @grey;
  font-size: 15px;
  & th {
    border: 1px solid #e2e6e9;
    background: #f8f8f8;
    padding: 5px 10px;
  }
  & td {
    border: 1px solid #e2e6e9;
    padding: 5px 10px;
  }
}
.hbhDetail {
  & .title {
    background: @blue;

    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin: 20px 0;
    width: 700px;
    padding: 10px 0;
  }
  & table {
    width: 700px;
    & td {
      font-size: 14px;
      text-align: center;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
      border: 1px solid #dedede;
    }
  }
}
/deep/.detail {
  padding: 0 !important;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #fff;
  background: @blue;
  color: #fff;
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
/deep/.trRow > td:nth-of-type(1) {
  display: none;
}
/deep/.trRow > td:nth-of-type(6) {
  //运价详情样式 如果改动列顺序需要同步改
  max-width: unset !important;
}
/deep/.hebingTrFixed {
  display: none !important;
}
/deep/.detailFixed {
  max-width: unset !important;
}
/deep/.trRow td {
  max-width: unset !important;
}
/deep/.trRow > td:nth-of-type(9) span{
  //备注样式 如果改动列顺序需要同步改
  max-width: 400px !important;
  min-width: 100px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  display: block;
}
</style>
<style>
.input-content .el-input__inner {
  border: none !important;
}
</style>