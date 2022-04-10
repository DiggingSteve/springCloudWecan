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
      pagetype="1"
      @reset="reset"
    >
    </newFormCmpt>

    <!-- <div class="search-wrap row">
      
      <div class="item15">
        <page-select
          pagetype="6"
          :modelval.sync="searchData.zzg"
          type="inline"
          title="到达港"
        ></page-select>
      </div>
      <div class="item15">
        <page-select
          pagetype="6"
          :modelval.sync="searchData.mdg"
          type="inline"
          title="基港"
        ></page-select>
      </div>
      <div class="item15">
        <page-select
          pagetype="110"
          :modelval.sync="searchData.twocode"
          type="inline"
          title="航司"
        ></page-select>
      </div>
    </div> -->
    <div class="button-wrap row">
      <div class="operateBtn">
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div class="operateBtn">
        <el-button type="primary" @click="clickInsert">新增</el-button>
      </div>
      <!-- <div class="item5 operateBtn">
        <el-button type="primary" @click="">导入</el-button>
      </div> -->
    </div>
    <div class="row" style="display: none">
      <template v-for="(item, index) in twocodeArr">
        <div
          @click="selectTwocode(index)"
          :class="{
            active: index == selectedTwocodeIndex ? true : false,
          }"
          class="twocodeTd"
        >
          {{ item }}
        </div>
      </template>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :chinese-where="chineseWhere"
    >
      <template slot="operate" slot-scope="props">
        <span @click="clickEdit(props.data.row)"
          ><i class="el-icon-edit"></i
        ></span>
        <span v-if="wageinout == 2" @click="syncToWagein(props.data.row)"
          ><i class="el-icon-document-copy"></i
        ></span>
      </template>
      <template v-slot:min="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:-45kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+45kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+100kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+300kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+500kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+1000kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+2000kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+3000kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:+5000kg="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
      <template v-slot:flat="rowObj">
        ￥{{ rowObj.data.value.toFixed(2) }}
      </template>
    </tableCompt>
    <el-dialog
      :title="priceObj.dialogTitle"
      :visible.sync="priceObj.isShowDialog"
      width="84%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <div class="fee-wrap">
        <div class="row" style="justify-content: flex-end">
          <el-button
            v-if="!priceObj.isEditMode"
            type="primary"
            @click="downloadTemplate()"
            >下载模板</el-button
          >
          <el-button
            v-if="!priceObj.isEditMode"
            type="primary"
            @click="priceObj.isShowImportDialog = true"
            >导入</el-button
          >
        </div>

        <div class="row" style="justify-content: flex-end">
          以单价<input
            type="input"
            class="seed-input"
            v-model="priceObj.seed"
          />
          为基础
          <span
            style="color: #0f5a8c; cursor: pointer"
            @click="priceObj.handleSeed('increase')"
            >递增</span
          >/
          <span
            style="color: #0f5a8c; cursor: pointer"
            @click="priceObj.handleSeed('decrease')"
            >递减</span
          >/
          <span
            style="color: #0f5a8c; cursor: pointer"
            @click="priceObj.handleSeed('copy')"
            >复制</span
          >
        </div>
        <div
          class="middle"
          style="min-height: 100px; margin-bottom: 10px; overflow-x: scroll"
        >
          <table class="editTb">
            <thead>
              <tr>
                <td v-if="!priceObj.isEditMode">操作</td>
                <td>基港</td>
                <td>航司二字码</td>
                <td>到达港</td>
                <td>MIN</td>
                <template v-for="item in priceObj.tableHeadArr"
                  ><!--表头列从缓存weightDiff取出-->
                  <td>{{ item }}</td>
                </template>
                <td>Flat</td>
              </tr>
            </thead>
            <tbody>
              <template>
                {{void(pageArr=sliceFeeArr())}}
              </template>
              <template v-for="(item, index) in pageArr">
                {{ void (row = pageArr[index]) }}
                <tr>
                  <td v-if="!priceObj.isEditMode">
                    <span @click="priceObj.delRow(index)"
                      ><i style="color: red" class="el-icon-delete"></i
                    ></span>
                    <span
                      v-if="priceObj.isShowAddBtn(index)"
                      @click="priceObj.addRow(index)"
                      ><i class="el-icon-plus"></i
                    ></span>
                  </td>
                  <td>
                    <page-select
                      :pagetype="6"
                      placeholder="基港"
                      :modelval.sync="pageArr[index].mdg"
                      :changeFunction="checkIsExistWageoutFee"
                      :triggerKey="index"
                    ></page-select>
                  </td>
                  <td style="width: 300px">
                    <pageSelectMultiple
                      pagetype="11"
                      placeholder="航空公司"
                      :modelval.sync="pageArr[index].twocodeStr"
                      :changeFunction="checkIsExistWageoutFee"
                      :triggerKey="index"
                    ></pageSelectMultiple>
                  </td>
                  <td>
                    <page-select
                      :pagetype="6"
                      placeholder="到达港"
                      :modelval.sync="pageArr[index].ddg"
                      style="width: 100%; border: 0"
                      :changeFunction="checkIsExistWageoutFee"
                      :triggerKey="index"
                    >
                    </page-select>
                  </td>
                  <td>
                    <span v-if="!row.isNeedSync">￥</span>
                    <el-input
                      v-if="!row.isNeedSync"
                      type="text"
                      v-model="pageArr[index].min"
                      @input="editContent(pageArr[index].min)"
                      @focus="selectText($event)"
                      @blur="fixed($event, pageArr[index].min)"
                    ></el-input>
                    <div class="row fixedWrap" v-if="row.isNeedSync">
                      <div class="item37">
                        <input
                          class="heavy fixedContent"
                          type="input"
                          @change="
                            row.fixedMin = row.min;
                            row.minDiff = 0;
                          "
                          v-model="row.min"
                        />
                      </div>
                      <div class="item60 diff-wrap">
                        <span
                          ><i
                            class="icon-btn el-icon-minus"
                            @click="pageArr[index].minDiff--"
                          ></i
                        ></span>
                        <span
                          class="green adjust-wrap"
                          v-bind:class="{
                            red: row.minDiff < 0 ? true : false,
                          }"
                          style="font-weight: 800"
                          >{{ displayMinusPlusSymbol(row.minDiff) }}</span
                        >
                        <span
                          ><i
                            class="icon-btn el-icon-plus"
                            @click="pageArr[index].minDiff++"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </td>
                  <template v-for="(code, j) in pageArr[index].codeArr">
                    {{ void (code = row.codeArr[j]) }}
                    <td>
                      <span v-if="!row.isNeedSync">￥</span>
                      <el-input
                        v-if="!row.isNeedSync"
                        type="text"
                        v-model="pageArr[index].codeArr[j].diff"
                        @input="
                          editContent(pageArr[index].codeArr[j].diff)
                        "
                        @focus="selectText($event)"
                        @blur="
                          fixed($event, pageArr[index].codeArr[j].diff)
                        "
                      ></el-input>
                      <div class="row fixedWrap" v-if="row.isNeedSync">
                        <div class="item37">
                          <input
                            class="heavy fixedContent"
                            type="input"
                            @change="
                              code.fixedDiff = code.diff;
                              code.wageinDiff = 0;
                            "
                            v-model="code.diff"
                          />
                        </div>

                        <div class="item60 diff-wrap">
                          <span
                            ><i
                              class="icon-btn el-icon-minus"
                              @click="code.wageinDiff--"
                            ></i
                          ></span>
                          <span
                            class="green adjust-wrap heavy fixedContent"
                            v-bind:class="{
                              red: code.wageinDiff < 0 ? true : false,
                            }"
                            >{{ displayMinusPlusSymbol(code.wageinDiff) }}</span
                          >
                          <span
                            ><i
                              class="icon-btn el-icon-plus"
                              @click="code.wageinDiff++"
                            ></i
                          ></span>
                        </div>
                      </div>
                    </td>
                  </template>
                  <td>
                    <span v-if="!row.isNeedSync">￥</span>
                    <el-input
                      v-if="!row.isNeedSync"
                      type="text"
                      v-model="pageArr[index].flat"
                      @input="editContent(pageArr[index].flat)"
                      @focus="selectText($event)"
                      @blur="fixed($event, pageArr[index].flat)"
                    ></el-input>
                    <div class="row fixedWrap" v-if="row.isNeedSync">
                      <div class="item37">
                        <input
                          class="heavy"
                          type="input"
                          @change="
                            row.fixedFlat = row.flat;
                            row.flatDiff = 0;
                          "
                          v-model="row.flat"
                        />
                      </div>
                      <div class="item60 diff-wrap">
                        <span
                          ><i
                            class="icon-btn el-icon-minus"
                            @click="pageArr[index].flatDiff--"
                          ></i
                        ></span>
                        <span
                          class="green adjust-wrap"
                          v-bind:class="{
                            red: row.flatDiff < 0 ? true : false,
                          }"
                          style="font-weight: 800"
                          >{{ displayMinusPlusSymbol(row.flatDiff) }}</span
                        >
                        <span
                          ><i
                            class="icon-btn el-icon-plus"
                            @click="pageArr[index].flatDiff++"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="item100">
            <el-pagination
            :current-page.sync="currentPage" 
            layout="prev, pager, next" :total="priceObj.feeArr.length">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="row" style="">
        <div class="item15">
          <span>创建人:</span><span>{{ priceObj.addman }}</span>
        </div>

        <div class="item15">
          <span>创建时间:</span><span>{{ priceObj.currentDate }}</span>
        </div>
      </div>
      <div class="botom row" style="justify-content: flex-end">
        <el-button
          v-if="priceObj.isSaveMode"
          type="primary"
          @click="priceObj.save()"
          >确认</el-button
        >
        <el-button
          v-if="priceObj.isEditMode"
          type="primary"
          @click="priceObj.edit()"
          >确认</el-button
        >
        <el-button
          v-if="priceObj.isEditMode"
          type="primary"
          @click="priceObj.del()"
          >删除</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="'同步到应收卡车中转费'"
      :visible.sync="priceObj.isShowSyncDialog"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="row" v-if="priceObj.feeArr.length > 0">
        <div
          class="item100"
          style="font-size: 16px; font-weight: 800; margin-bottom: 10px"
        >
          <span>基港:</span><span>{{ priceObj.feeArr[0].mdg }}</span>
          <span>航司:</span><span>{{ priceObj.feeArr[0].twocodeStr }}</span>
          <span>币种:</span><span>CNY</span>
        </div>
      </div>
      <div class="row">
        <div class="item100" style="overflow: auto">
          <table class="editTb">
            <thead>
              <tr>
                <td>到达港</td>
                <td>MIN</td>
                <template v-for="item in priceObj.tableHeadArr"
                  ><!--表头列从缓存weightDiff取出-->
                  <td>{{ item }}</td>
                </template>
                <td>Flat</td>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in priceObj.feeArr">
                {{ void (row = priceObj.feeArr[index]) }}
                <tr>
                  <td>{{ row.ddg }}</td>
                  <td>
                    <div class="row fixedWrap">
                      <div class="item37">
                        <input
                          class="heavy"
                          type="input"
                          @change="
                            priceObj.feeArr[index].fixedMin =
                              priceObj.feeArr[index].min;
                            priceObj.feeArr[index].minDiff = 0;
                          "
                          v-model.sync="priceObj.feeArr[index].min"
                        />
                      </div>
                      <div class="item60 diff-wrap">
                        <span
                          ><i
                            class="icon-btn el-icon-minus"
                            @click="priceObj.feeArr[index].minDiff--"
                          ></i
                        ></span>
                        <span
                          class="green adjust-wrap"
                          v-bind:class="{
                            red: row.minDiff < 0 ? true : false,
                          }"
                          style="font-weight: 800"
                          >{{ displayMinusPlusSymbol(row.minDiff) }}</span
                        >
                        <span
                          ><i
                            class="icon-btn el-icon-plus"
                            @click="priceObj.feeArr[index].minDiff++"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </td>
                  <template v-for="(code, j) in row.codeArr">
                    {{ void (code = row.codeArr[j]) }}
                    <td>
                      <div class="row fixedWrap">
                        <div class="item37">
                          <input
                            class="heavy"
                            type="input"
                            @change="
                              code.fixedDiff = code.diff;
                              code.wageinDiff = 0;
                            "
                            v-model.sync="code.diff"
                          />
                        </div>

                        <div class="item60 diff-wrap">
                          <span
                            ><i
                              class="icon-btn el-icon-minus"
                              @click="code.wageinDiff--"
                            ></i
                          ></span>
                          <span
                            class="green adjust-wrap heavy"
                            v-bind:class="{
                              red: code.wageinDiff < 0 ? true : false,
                            }"
                            >{{ displayMinusPlusSymbol(code.wageinDiff) }}</span
                          >
                          <span
                            ><i
                              class="icon-btn el-icon-plus"
                              @click="code.wageinDiff++"
                            ></i
                          ></span>
                        </div>
                      </div>
                    </td>
                  </template>
                  <td>
                    <div class="row fixedWrap">
                      <div class="item37">
                        <input
                          class="heavy"
                          type="input"
                          @change="
                            priceObj.feeArr[index].fixedFlat =
                              priceObj.feeArr[index].flat;
                            priceObj.feeArr[index].flatDiff = 0;
                          "
                          v-model.sync="priceObj.feeArr[index].flat"
                        />
                      </div>
                      <div class="item60 diff-wrap">
                        <span
                          ><i
                            class="icon-btn el-icon-minus"
                            @click="priceObj.feeArr[index].flatDiff--"
                          ></i
                        ></span>
                        <span
                          class="green adjust-wrap"
                          v-bind:class="{
                            red: row.flatDiff < 0 ? true : false,
                          }"
                          style="font-weight: 800"
                          >{{ displayMinusPlusSymbol(row.flatDiff) }}</span
                        >
                        <span
                          ><i
                            class="icon-btn el-icon-plus"
                            @click="priceObj.feeArr[index].flatDiff++"
                          ></i
                        ></span>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row" style="justify-content: flex-end; margin-top: 50px">
        <div class="item15">
          <el-button type="primary" @click="priceObj.syncToWageIn()"
            >确认同步</el-button
          >
          <el-button @click="priceObj.isShowSyncDialog = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="'导入卡应付车中转费'"
      :visible.sync="priceObj.isShowImportDialog"
      width="50%"
      :close-on-click-modal="false"
    >
      <div class="importWrap">
        <div class="row">请选择表格内币种,所填价格均会转换为人民币价格</div>
        <div class="row">
          <el-select
            style="border: solid 1px #e6dfdf"
            :placeholder="'请选择币种'"
            v-model="selectedCurrency"
          >
            <el-option
              v-for="item in currencyArr"
              :key="item.cname"
              :label="item.cname"
              :value="item.cname"
            >
            </el-option>
          </el-select>
        </div>
        <div class="row">
          <file-read :fileData.sync="fileData"> </file-read>
        </div>
      </div>
      <div class="row"></div>
      <div class="row">
        <div class="item80"></div>
        <div class="item20">
          <el-button
            type="primary"
            @click="priceObj.setExcelToFeeArr(fileData)"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
     :title="'重复列表'"
      :visible.sync="priceObj.isShowDuplicate"
      width="50%"
      :close-on-click-modal="false"
    >
    <div class="row">以下数据存在重复的 航司 基港 到达港 数据,请检查数据后重新导入</div>
      
          <div class="row" style="height:650px;over-flow:auto;">
            <table class="duplicateTable">
              <tbody>
                <tr>
                  <td>
                    基港
                  </td>
                  <td>
                    到达港
                  </td>
                  <td>
                    航司二字码
                  </td>
                </tr>
                <template  v-for="(item) in priceObj.duplicateArr">
                  <tr>
                    <td>{{item.mdg}}</td>
                    <td>{{item.ddg}}</td>
                    <td>{{item.twocodeStr}}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
      
    </el-dialog>
  </div>
</template>
<script>
import MultiSelect from "../components/smallTemplate/multiSelect.vue";
import pageSelectMultiple from "@/components/smallTemplate/pageSelectMultiple.vue";
import PageSelect from "../components/smallTemplate/pageSelect.vue";
import cardBlock from "./cardBlock.vue";
import excelOut from "../components/templates/excelOut";

import fileRead from "./fileRead.vue";
import { pagemode, TruckFee } from "./js/truckFee";
const wageinoutEnum = { in: 1, out: 2 };
export default {
  name: "truckFee",

  data() {
    return {
      name: "truckFee.vue",
      tableDataRes: [],
      inputViewData: {},
      inputModelData: { mdg: "", zzg: "" },
      dialogWidth: "980px",
      pageshow: true,
      searchData: {},
      tableDataRes: [],
      chineseWhere: [],
      currentPageMode: "",
      priceObj: new TruckFee(this),
      /**二字码对应feeList */
      twocodeMap: {},
      /**二字码数组["kv","sz"] */
      twocodeArr: [],
      currentPage:1,
      selectedTwocodeIndex: -1,
      fileData: {},
      currencyArr: [],
      selectedCurrency: "人民币",
      seed: 0,
    
    };
  },
  computed: {},
  mounted: function () {
    /**初始化列头 */
  },
  components: {
    MultiSelect,
    pageSelectMultiple,
    PageSelect,
    cardBlock,
    fileRead,
  },
  methods: {
    /**
     *
     * 卡车费计算逻辑为 fixedDiff>0取fixedDiff值 没有fixed值 取diff+wageinDiff
     */
    search() {
      this.twocodeMap = {};
      this.twocodeArr = [];
      this.selectedTwocodeIndex = -1;
      let where = {};

      this.addSearchCondition("mdg", where, "jg");
      this.addSearchCondition("twocodeStr", where, "twocode");
      this.addSearchCondition("addman", where, "addman");
      this.addSearchCondition("ddg", where, "ddg");
      this.addSearchCondition("addtime", where, "adddate");

      where["wageinout"] = this.wageinout;
      var jsonArr = {
        where: {
          ...where,
        },
      };
      let url = this.$store.state.feeWebApi + "TruckFee/getList";

      this.priceObj
        .request("get", url, { json: JSON.stringify(jsonArr) })
        .then(({ data }) => {
          var d = data.resultdata;
          this.mapTwocodeToFeelist(d);
          d.forEach((item) => {
            item.codeArr.forEach((code) => {
              item[code.code] = code.diff;
            });
          });
          this.tableDataRes = d;
        });
    },
    /**单击新增 */
    clickInsert() {
      if (!!!this.priceObj.area) {
        throw new Error("请选择地区");
      }
      this.priceObj = new TruckFee(this);
      this.priceObj.isLoaded = true;
      this.priceObj.currentPageMode = pagemode.add;
    },
    closeDialog() {
      this.priceObj.currentPageMode = pagemode.search;
    },
    clickEdit(data) {
      if (!!!this.priceObj.area) {
        throw new Error("请选择地区");
      }
      this.priceObj = new TruckFee(this);
      this.priceObj.currentPageMode = pagemode.edit;
      this.priceObj.loadEditInfo(data);
      this.priceObj.dialogTitle = "修改卡车中转费";
    },
    mapTwocodeToFeelist(data) {
      data.forEach((d) => {
        var twocodeStr = d.twocodeStr;
        var arr = twocodeStr.split(",");
        arr.forEach((item) => {
          if (!!!this.twocodeMap[item]) {
            this.twocodeMap[item] = [];
          }
          this.twocodeMap[item].push(d);
        });
      });
      this.twocodeArr = Object.keys(this.twocodeMap);
    },

    reset() {},
    editContent(item) {
      if (item != "-" && isNaN(item * 1)) {
        item = 1;
        throw new Error("请输入数字");
      }
    },
    fixed(event, item, length) {
      var e = event.currentTarget;
      if (!!!length) length = 2;
      e.value = (item * 1).toFixed(length);
    },
    selectTwocode(index) {
      this.selectedTwocodeIndex = index;
      var twocode = this.twocodeArr[index];
      var data = this.twocodeMap[twocode];
      this.tableDataRes = data;
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

    sliceFeeArr(){
      if(this.priceObj.feeArr.length==0)return [];
      var length=this.priceObj.feeArr.length;
      var pageSize=10;//分页控件默认10
      var start=pageSize*(this.currentPage-1);
      var end=pageSize*this.currentPage;
      return this.priceObj.feeArr.slice(start,end);
    },

    /**显示正负号 */
    displayMinusPlusSymbol(val) {
      var symbol = "";
      if (val < 0) return val;
      else return "+" + val;
    },
    /**检查是否存在匹配的应付费用 需要在应收的时候询问带入
     * @param index 当前行
     */
    checkIsExistWageoutFee(i) {
      console.log(this.priceObj.feeArr[i].ddg);
      this.$nextTick(function () {
        console.log(this.priceObj.feeArr[i].ddg);
      });
      setTimeout(() => {
        if (this.wageinout == wageinoutEnum.in) {
          var item = this.priceObj.feeArr[i];
          if (item.isLoadWageout) return;
          var mdg = item.mdg;
          var twocodeStr = item.twocodeStr;
          var ddg = item.ddg;
          if (!!mdg && !!ddg && !!twocodeStr) {
            this.priceObj.loadWageout(mdg, ddg, twocodeStr, i);
          }
        }
      }, 1000); //因为blur发生在前面需要给一个延时 让mdg ddg twocodestr 先赋上值
    },
    syncToWagein(data) {
      if (!!!this.priceObj.area) {
        throw new Error("请选择地区");
      }
      this.priceObj = new TruckFee(this);
      this.priceObj.isShowSyncDialog = true;
      this.priceObj.loadEditInfo(data);
      this.priceObj.loadWageinFromWageout(data.feeid);
    },
    selectText(event) {
      event.currentTarget.select();
    },

    downloadTemplate() {
      window.open("~/../boStatic/应付卡车中转费模板.xlsx");
    },
  },

  created: function () {},
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
    wageinout: function () {
      var route = this.$route;
      var params = route.params;
      var wageinout = wageinoutEnum[params.ready08.toLowerCase()];
      return wageinout;
    },
    currentCurrency: function () {
      return this.currencyArr.find((item) => {
        return item.cname == this.selectedCurrency;
      }).basicprice;
    },
  },
  watch: {
    $route: function (to, from) {
      var params = from.params;
      var wageinout = wageinoutEnum[params.ready08.toLowerCase()];
      if (this.wageinout != wageinout) {
        this.search();
      }
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
.icon-btn {
  background: @grey;
  font-size: 10px;
}

.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 10px 0;
}

.head {
  width: 50%;
  & .item {
    margin: 10px 5px;
  }
}
.search-wrap > div {
  margin: 10px;
}

.editTb thead td {
  width: 80px;
  height: 32px;
  border: 1px solid #e8e8e8;
  background: #f8f8f8;
}
.editTb tbody td {
  border: 1px solid #e8e8e8;
}
.editTb td {
  text-align: center;
  white-space: nowrap;
  word-break: break-all;
  & .row {
    line-height: 14px;
    vertical-align: middle;
  }
  & .adjust-wrap {
    display: inline-block;
    width: 30px;
  }
}
/deep/.el-input__inner {
  border: 0;
  font-size: 14px !important;
  height: 100%;
}
i {
  &:hover {
    cursor: pointer;
  }
}
.operateBtn {
  padding: 5px 10px;
}
.twocodeTd {
  font-size: 16px;
  background: @grey;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    color: #fff;
    background: @blue;
  }
}
.active {
  background: @blue;
  color: #fff;
}
.heavy {
  font-weight: 600;
  font-size: 14px !important;
  width: 100%;
}
.fixedContent {
  //width:60px
}
.fixedWrap {
  padding: 10px;
  width: 110px;
}
.importWrap {
  & .row {
    margin: 10px 0;
  }
}
.duplicateTable{
  width: 100%;
  & td{
    border: 1px solid #dedede;
    font-size: 14px;
    text-align: center;
  }
}
</style>
<style>
.selectBorder {
  border: 1px solid #dcdfe6;
}
.seed-input {
  width: 20px;
  border-bottom: 1px solid #dcdfe6;
  text-align: center;
}

.red {
  color: #f44336 !important;
}
.green {
  color: #19bd19;
}

</style>