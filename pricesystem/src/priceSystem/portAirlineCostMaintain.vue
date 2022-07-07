<!--
 * @Description:  始发港航司 费用维护
 * @Version: 
 * @Autor: ZX
 * @Date: 2021-10-27 16:50:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-04 17:01:22
-->
<template>
  <div class="frm-system-wage">
    <div class="page-container-box">
      <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
      >
      </newFormCmpt>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      :ziTableData="ziTableData"
      :depotModule="depotModule"
      @transmitMsg="getZimessage"
      @initFreightData="search"
      @modify="modifyCost"
      @deleteCost="deleteCost"
      showZiConfig
      expansionSubcolumn="fold"
    >
      <template slot="maintain" slot-scope="props" v-if="depotModule"> 
        <i
          class="el-icon-document-add"
          style="color:#1a7dbf;font-weight:bold"
          @click="getOption(props.data, 'out')"
        >
        </i>
      </template>
    </tableCompt>

    <el-dialog
      :title="airlineDialogInfo.cname"
      :visible.sync="airlineDialogInfo.status"
      width="1240px"
      class="common-dialog"
      @close="closeDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="airCompanyDialogInfo">
        <!-- 地域信息 -->
        <div class="areaInfo">
          <div class="head">
            地域信息
          </div>
          <div class="body">
            <div class="body-head">
              <span class="body-title">始发港地域</span>
              <div
                class="body-add"
                @click="dialog.sfgDialog.visible = true"
              ></div>
            </div>
            <div class="body-content">
              <div
                :class="[item.sfg === sfgName ? activeClass : '', sfgClass]"
                v-for="(item, index) in sfgAreaList"
                :key="item.airareaguid + index"
                @click="getPort(item)"
              >
                <span class="body-item-title">{{ item.sfg }}</span>
                <!-- <div class="body-item-delete" @click="deleteSfg(item)"></div>-->
                <i class="el-icon-delete body-item-delete" @click="deleteSfg(item)"></i> 
              </div>
            </div>
          </div>
        </div>
        <!-- 分组信息 -->
        <div class="areaInfo" style="width:170px">
          <div class="head">
            分组信息
          </div>
          <div class="body" style="width:170px">
            <div class="body-head">
              <span class="body-title">目的港地域</span>
              <div
                class="body-add"
                @click="dialog.mdgDialog.visible = true"
              ></div>
            </div>
            
            <span v-if="sfgAguid && allPort === null" > {{allPort ===  null ? ' 暂无数据' : allPort !== null ? '数据加载中': '暂无数据'}}   </span>

            <div class="body-content" v-if="allPort">
              <div
                class="body-item"
                :class="[item.dname === mdgName ? activeClass : '', mdgClass]"
                v-for="(item, index) in destinationPortList"
                :key="index"
                @click="getMdgInfo(item)" 
              >
                <div class="body-item-money" @click="getCost(item)"></div>
                <span class="body-item-title" style="margin-left:26px">{{
                  item.dname
                }}</span>
                  <!-- <div class="body-item-delete"  @click="deleteMdg(item)"></div> -->

                  <i class="el-icon-delete body-item-delete" @click="deleteMdg(item)"></i> 
              </div>
            </div>
          </div>
        </div>
        <div class="choosePort">
          <div class="head">
            已选港口
          </div>
          <div class="body" >
            <el-table
              :row-key="getkey"
              ref="clearSelectCheck"
              :data="
                selectPort.slice(
                  (selectedCurrentPageNumber - 1) * selectedPageSize,
                  selectedCurrentPageNumber * selectedPageSize
                )
              "
              @selection-change="handleSelectionChange"
              height="388px"
              style="width: 100%"
           
            >
              <el-table-column
                type="selection"
                width="55"
                :reserve-selection="true"
              >
              </el-table-column>
              <el-table-column label="港口" width="55" prop="threecode">
              </el-table-column>
              <el-table-column label="国家" width="80" prop="countrycname">
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model="select"
                    style="margin-left:-13px;"
                    prefix-icon="el-icon-search"
                  />
                </template>
              </el-table-column>
            </el-table>
            <div class="operate">
              <el-button
                style="color:#3A3C42;width:112px;height:32px;font-weight:800;"
                @click="portOperate({ type: 'remove', addAll: 0 })"
                >移除</el-button
              >
              <el-button
                style="color:#0E5B8C;width:112px;height:32px;font-weight:800;"
                @click="portOperate({ type: 'remove', tag: 0, addAll: 1 })"
                >全部移除</el-button
              >
            </div>

            <el-pagination
              @size-change="handleSelectedSizeChange"
              @current-change="handleSelectedCurrentChange"
              :current-page="selectedCurrentPageNumber"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="1"
              :pager-count="5"
              small
              layout="sizes, prev, pager, next"
              :total="noSelectTotal"
            >
            </el-pagination>
          </div>
        </div>

        <!-- 分区类型 -->
        <div class="partition">
          <div class="partition-item">
            <span class="partition-item-title">分区类型</span>
            <el-select
              v-model="query.selectPartition"
              placeholder="请选择"
              style="width:184px"
            >
              <el-option
                v-for="(item, index) in partitionList"
                :key="index"
                :label="item.typename"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <!-- 分区名称 -->
          <div class="partition-item">
            <span class="partition-item-title">分区名称</span>
            <el-select
              v-model="query.selectPartitionName"
              placeholder="请选择"
              style="width:184px"
            >
              <el-option
                v-for="(item, index) in partitionNameList"
                :key="index"
                :label="item.typename"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>

          <!-- 选择港口 -->
          <div class="partition-item">
            <span class="partition-item-title">选中港口</span>
            <el-input
              v-model="query.selectPort"
              placeholder="若多选请用逗号分开"
              style="width:184px"
            ></el-input>
          </div>

          <!-- 选择国家 -->
          <div class="partition-item">
            <span class="partition-item-title">选择国家</span>
            <el-input
              v-model="query.selectConutry"
              placeholder="若多选请用逗号分开"
              style="width:184px"
            ></el-input>
          </div>

          <!-- 排除港口 -->
          <div class="partition-item">
            <span class="partition-item-title">排除港口</span>
            <el-input
              v-model="query.excludePort"
              placeholder="若多选请用逗号分开"
              style="width:184px"
            ></el-input>
          </div>

          <!-- 排除国家 -->

          <div class="partition-item">
            <span class="partition-item-title">排除国家</span>
            <el-input
              v-model="query.excludeCountry"
              placeholder="若多选请用逗号分开"
              style="width:184px"
            ></el-input>
          </div>
          <div class="partition-item-btn">
            <el-button
              style="background:#0E5B8C;color:white;width:88px;height:32px;"
              @click="searchPort"
              >查询</el-button
            >
            <el-button
              style="color:#0E5B8C;width:88px;height:32px;"
              @click="clearSearch"
              >清空条件</el-button
            >
          </div>
        </div>
        <!-- 可选港口 -->
        <div class="choosePort">
          <div class="head">
            可选港口
          </div>
          <div class="body">
            <el-table
                ref="clearNoSelectCheck"
              :data="
                optionalPortList.slice(
                  (noSelectedCurrentPageNumber - 1) * noSelectedPageSize,
                  noSelectedCurrentPageNumber * noSelectedPageSize
                )
              "
              @selection-change="handleAddSelectionChange"
              :row-key="getkeyId"
              height="388px"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                width="55"
                :reserve-selection="true"
              >
              </el-table-column>
              <el-table-column label="港口" width="55" prop="threecode">
              </el-table-column>
              <el-table-column label="国家" width="80" prop="countrycname">
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model="noselect"
                    style="margin-left:-13px;"
                    prefix-icon="el-icon-search"
                  />
                </template>
              </el-table-column>
            </el-table>
            <div class="operate">
              <el-button
                style="color:#3A3C42;width:112px;height:32px;font-weight:800;"
                @click="portOperate({ type: 'add', addAll: 0 })"
                >添加
              </el-button>
              <el-button
                style="color:#0E5B8C;width:112px;height:32px;font-weight:800;"
                @click="portOperate({ type: 'add', tag: 0,  addAll: 1 })"
                >全部添加</el-button
              >
            </div>
            <el-pagination
              @size-change="handleNoSelectedSizeChange"
              @current-change="handleNoSelectedCurrentChange"
              :current-page="noSelectedCurrentPageNumber"
              small
              :pager-count="5"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="noSelectedPageSize"
              layout="sizes, prev, pager, next"
              :total="selectedTotal"
              style="width:60px"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="始发港航司杂费维护"
      :visible.sync="mdgCostDialogStatus"
      width="65%"
      class="common-dialog"
      @close="closeMdgDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="head">
        <span>航司二子码: {{ airlineDialogInfo.twocode }}</span> &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp;
        <span>航司三字码: {{ airlineDialogInfo.threecode }}</span> &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span>航司中文名称: {{ airlineDialogInfo.cname }}</span
        >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <span>航司英文名称: {{ airlineDialogInfo.ename }}</span>
      </div>

      <br />
      <commonTable
        class="commonTable"
        :head="tableHeadTemplate"
        :table-data="mdgCosttableData"
        :firstTdShow="addEditDataStatus"
        :putIndex="modCostIndex"
      >
        <template slot="firstTd" slot-scope="props">
          <td style="text-align:left;padding-left:8px;">
            <i
              class="el-icon-success"
              style="color:green;font-weight:bold"
              title="费用新增"
              @click="addConfirmWage()"
            ></i>

            <!-- 取消操作 未勾选费用时 -->
            <i
              class="el-icon-error"
              style="color:red;font-weight:bold"
              title="取消修改"
              @click="clearCost"
            ></i>
          </td>

          <td>
            <!-- 费用名称 -->
            <!-- 组合下拉框 -->
            <page-select
              :pagetype="5"
              :modelval.sync="editFormModel.items"
              style="width: 100%; border: 0;background:#fffaf2;"
              @change="getSelectData"
            >
            </page-select>
          </td>
          <td>
            <!-- 制单成本 -->
            <el-select v-model="editFormModel.iszd" style="width:106px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in makeBillList"
                :key="index"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </td>

          <td>
            <!-- 制单计费方式 -->
            <el-select v-model="editFormModel.jsfs_zd" style="width:120px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in billList"
                :key="index"
                :value="item.typename"
                :label="item.typename"
              ></el-option>
            </el-select>
          </td>
          <td>
            <!-- 应收计费方式-->
            <el-select v-model="editFormModel.jsfs_out" style="width:120px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in billList"
                :key="index"
                :value="item.typename"
                :label="item.typename"
              ></el-option>
            </el-select>
          </td>
          <td>
            <!-- 应付计费方式-->
            <el-select v-model="editFormModel.jsfs_in" style="width:120px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in billList"
                :key="index"
                :value="item.typename"
                :label="item.typename"
              ></el-option>
            </el-select>
          </td>
          <td>
            <!-- 单价  输入框 -->
            <el-input
              v-model="editFormModel.price"
              style="width:72px;background:#fffaf2;"
            ></el-input>
          </td>
          <td>
            <!-- MIN 输入框 -->
            <el-input
              v-model="editFormModel.min_price"
              style="width:72px;background:#fffaf2;"
            ></el-input>
          </td>
          <td>
            <!-- 币种 -->
            <el-select v-model="editFormModel.currency" style="width:84px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in currencyData"
                :key="index"
                :value="item.cname"
                :label="item.cname"
              ></el-option>
            </el-select>
          </td>
          <td>
            <!-- 开始日期 -->
             <el-date-picker
              v-model="editFormModel.begindate"
              type="date"
              style="background:#fffaf2;width:150px;"
              placeholder="选择日期时间">
            </el-date-picker>
          </td>
          <td>
            <!-- 结束日期 -->
            <el-date-picker
              v-model="editFormModel.enddate"
              style="width:150px;"
              type="date"
              placeholder="选择日期时间">
            </el-date-picker>
          </td>
          <td>
            <!-- 状态 -->
            <el-select v-model="editFormModel.status" style="width:84px;background:#fffaf2;">
              <el-option
                v-for="(item, index) in costCtatus"
                :key="index"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
          </td>
          <td>
            <span>{{ createFormName }}</span>
          </td>
        </template>
        <template slot="operate" slot-scope="props">
          <i
            class="el-icon-setting"
            title="费用编辑'"
            @click="config(props.data)"
          ></i>
          <i
            class="el-icon-delete"
            @click="deleteCost(props.data.row)"
            title="费用删除'"
          ></i>
          <i
            class="el-icon-success"
            style="color:green;font-weight:bold"

            @click="addConfirmWage()"
            v-show="props.data.row.guid === costGuid"
          ></i>
          <i
            class="el-icon-error"
            style="color:red;font-weight:bold"

            @click="clearCost"
            v-show="props.data.row.guid === costGuid"
          ></i>
        </template>
      </commonTable>
    </el-dialog>

    <!-- 添加始发港地域 -->

    <el-dialog
      :title="dialog.sfgDialog.title"
      :visible.sync="dialog.sfgDialog.visible"
      width="394px"
      @close="clearAddSfg"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="form">
        <div class="form-item">
          <span class="form-item-label">{{
            dialog.sfgDialog.mdgField.title
          }}</span>
          <pageSelectMultiple
            :pagedata="dialog.sfgDialog.mdgField.pagedata"
            :multiple="dialog.sfgDialog.mdgField.multiple"
            :viewdata="dialog.sfgDialog.mdgField.viewData"
            :modelval.sync="dialog.sfgDialog.mdgField.airareaguid"
            ref="pageSelectMultiple"
            style="width:232px;height:32px"
          >
          </pageSelectMultiple>
        </div>
        <div class="form-item">
          <el-button class="form-item-add" @click="confirmAdd"
            >确认添加</el-button
          >
          <el-button class="form-item-returnFalse" @click="clearAddSfg"
            >返回</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 添加目的港地域 -->
    <el-dialog
      :title="dialog.mdgDialog.title"
      :visible.sync="dialog.mdgDialog.visible"
      width="394px"
      @close="clearAddMdg"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="form">
        <div class="form-item">
          <span class="form-item-label">{{
            dialog.mdgDialog.mdgField.title
          }}</span>
          <el-input
            v-model="dialog.mdgDialog.mdgField.dname"
            placeholder="请输入内容"
            style="width:232px;height:32px"
          ></el-input>
        </div>
        <div class="form-item">
          <el-button class="form-item-add" @click="confirmMdg"
            >确认添加</el-button
          >
          <el-button class="form-item-returnFalse" @click="clearAddMdg"
            >返回</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageSelectMultiple from "../components/smallTemplate/pageSelectMultiple";
import { formatDate } from "@/api/localStorage.js";
export default {
  name: "portAirlineCostMaintain",
  components: { pageSelectMultiple },
  data() {
    return {
      name: "portAirlineCostMaintain.vue",
      // dialog组件状态
      dialog: {
        //新增始发港
        sfgDialog: {
          visible: false,
          title: "新增始发港地域",
          mdgField: {
            title: "始发港地域名称",
            pagedata: [],
            multiple: false,
            pagetype: 21,
            airareaguid: "",
            viewData: [
              {
                title: "guid",
                field: "ThreeCode" //label  guid
              },
              {
                title: "港口",
                field: "ThreeCode"
              },
              {
                title: "国家",
                field: "CountryCname"
              }
            ]
          }
        },
        //新增目的港
        mdgDialog: {
          visible: false,
          title: "新增目的港地域",
          mdgField: {
            title: "目的港地域名称",
            dname: "" //添加的名称
          }
        }
      },
      activeClass: "activeBg",
      sfgClass: "body-item",
      mdgClass: "",
      sfgName: "",
      mdgName: "",
      // 点击状态  始发港
      searchData: {},
      // 表单空间内容
      inputViewData: {
        twocode: {
          title: "航司二字码",
          type: 20,
          pagedata: [],
          multiple: false,
          viewdata: [
            {
              title: "TwoCode",
              field: "TwoCode"
            },
            {
              title: "航司二字码",
              field: "TwoCode"
            },
            {
              title: "航司三字码",
              field: "ThreeCode"
            }
          ]
        },
        threecode: {
          title: "航司三字码",
          type: 20,
          pagedata: [],
          multiple: false,
          viewdata: [
            {
              title: "ThreeCode",
              field: "ThreeCode"
            },
            {
              title: "航司二字码",
              field: "TwoCode"
            },
            {
              title: "航司三字码",
              field: "ThreeCode"
            }
          ]
        },
        cname: {
          title: "航司名称",
          type: 20,
          pagedata: [],
          multiple: false,
          viewdata: [
           {
              title:'CName',field: 'CName',
            },
            {
              title:'中文名称',field: 'CName',
            },
            {
              title:'英文名称',field: 'EName',
            }
          ]
        },
      },
      // 弹窗数据
      airlineDialogInfo: {
        twocode: "",
        threecode: "",
        cname: "",
        ename: "",
        status: false
      },
      // 目的港费用弹窗
      mdgCostDialogStatus: false,
      // 表格数据
      tableDataRes: [],
      // 嵌套表格数据
      ziTableData: [],
      // 控件的数据
      inputModelData: {},
      //   导出Excel中文条件
      chineseWhere: [],
      // 是否显示隐藏表单
      pageshow: true,
      // 始发港地域
      sfgAreaList: [],
      // 目的港地域
      destinationPortList: [],
      // 选中的始发港
      selectSfg: "",
      multipleSelection: [],
      // 分区类型Array
      partitionList: [],
      // 分区名称Array
      partitionNameList: [],
      // WFF分区的 分区名称
      wffPartitionNameList: [],
      // 选中的分区
      selectPartition: null,
      // 选中的分区名称
      selectPartitionName: null,
      multiSelect: "",
      query: {
        selectPartition: "",
        selectPartitionName: "",
        selectPort: "",
        selectConutry: "",
        excludePort: "",
        excludeCountry: ""
      },
      airareaguid: null,
      // 点击航司对应的数据  得清空
      airData: [],
      // 港口的所有数据
      portData: [],
      aguid: null, //港口 guid
      sfgAguid: null,
      allPort: [], // 所有港口

      checkYetPort: [], //选中的已选港口
      checkMayPort: [], //选中的可选港口
      mdgGuid: null,
      // 编辑form model 数据
      editFormModel: {
        isautocommbill: -1, // 是否自动带到签单
        parmtype: -1,
        items: "",
        deptguid: null, //目的港id
        sid: "", //计费方式 传递 id
        s_ename: "", //费用名称
        iszd: "", //是否带入制单
        jsfs_out: "", //应收计费方式
        jsfs_zd:"", //制单计费方式
        jsfs_in:"", //应付计费方式
        price: "", // 单价
        min_price: "", //MIN
        currency: "人民币", // 币种
        begindate: "", // 开始时间
        enddate: "", // 结束时间
        status: 1, //状态
        remark: "" //备注
      },

      // *** 目的港费用
      // 目的港费用子表格模板
      tableHeadTemplate: [
        {
          field: "operate",
          title: "操作"
        },
        {
          field: "items",
          title: "费用名称"
        },
        {
          field: "iszd",
          title: "作为制单成本"
        },
        {
          field: "jsfs_zd",
          title: "制单计费方式"
        },
        {
          field: "jsfs_in",
          title: "应收计费方式"
        },
        {
          field: "jsfs_out",
          title: "应付计费方式"
        },
        {
          field: "price",
          title: "单价"
        },
        {
          field: "min_price",
          title: "MIN"
        },
        {
          field: "currency",
          title: "币种"
        },
        {
          field: "begindate",
          title: "开始日期"
        },
        {
          field: "enddate",
          title: "结束日期"
        },
        {
          field: "price_status",
          title: "状态"
        },
        {
          field: "addman",
          title: "创建人"
        },
        {
          field: "adddate",
          title: "创建时间"
        },
        {
          field: "modifyman",
          title: "修改人"
        },
        {
          field: "modifydate",
          title: "修改日期"
        }
      ],
      addEditDataStatus: false,
      mdgCosttableData: [],
      // 编辑的入口  货站外部点击进入 out   弹窗内部进入编辑
      modifyEntrance: "",
      //费用index
      modCostIndex: -1,
      costGuid: null,
      // 制单状态
      makeBillList: [
        {
          id: 0,
          label: "否"
        },
        {
          id: 1,
          label: "是"
        }
      ],
      // 计算方式
      billList: [],
      // 币种
      currencyData: [],
      // 状态
      costCtatus: [
        {
          id: 0,
          label: "无效"
        },
        {
          id: 1,
          label: "有效"
        }
      ],
      createFormName: localStorage.getItem("usrname"),
      // *** 目的港费用

      // 分页
      // 可选港口
      selectedCurrentPageNumber: 1, //可选港口当前页码
      selectedPageSize: 10, //可选港口当前条数
      selectedTotal: 0, //可选港口当前总条数
      optionalPortList: [], //可选港口数据存储
      noSelectedCurrentPageNumber: 1,
      noSelectedPageSize: 10,
      noSelectTotal: 0,
      selectPort: [], //已选港口数据展示
      select: "", //搜索已选
      noselect: "", //搜索未选,
      temporarySelect: [], //临时存放已选的港口, 筛选过滤用
      temporaryNoSelect: [], //临时存储可选的港口，筛选过滤用
      activeSfgInfo:null,
      editAirCostStatus: false,
      depotModule:false,
      activeMdgInfo:null,
    };
  },
  watch: {
    "query.selectPartition"(val) {
      const data = JSON.parse(localStorage.getItem("groupType"));
      this.query.selectPartitionName = '';
      if(val === ''){
        this.partitionNameList = []
      }
      if (val === 2558) {
        this.partitionNameList = data.filter(item => item.groupid == 3);
      } else if (val === 2557) {
        this.partitionNameList = this.wffPartitionNameList;
      } else if (val === 2559) {
        this.partitionNameList = [];
      }

      console.log(this.partitionNameList);
      // else if ()
      //获取分区类型，通过groupType 的 groupid  为 254
    },
    '$route'(val){
      switch (val.params.ready08) {
        case 'AESOUT' :
          this.depotModule = false
          break;
        case 'AEWOUT' :
          this.depotModule = true
      }
    },
    select(val) {
      console.log(val)
      if(val){
          // const data = this.selectPort.filter(item => item.countrycname === val || item.threecode === val);
    
          const data = []
    
          for (var i = 0; i < this.selectPort.length; i++) {
            if ( ( this.selectPort[i].countrycname &&  this.selectPort[i].countrycname.indexOf(val) >= 0 )|| (this.selectPort[i].threecode && this.selectPort[i].threecode.indexOf(val) >= 0)) {
              data.push(this.selectPort[i]);
            }
          }
          
          if (data.length > 0) {
              this.selectPort = []
              
              this.selectPort = data;
            } else if(data.length === 0) {
              this.selectPort = []
            }
      } else {
        this.selectPort = [];
        this.selectPort = this.temporarySelect;
      }
     

      this.noSelectTotal = this.selectPort.length;
    },
    noselect(val) {
      console.log(val)
      console.log(this.optionalPortList)
      if(val){
          const noSelectData = []
          for (var i = 0; i < this.optionalPortList.length; i++) {
            if ( (this.optionalPortList[i].countrycname &&  this.optionalPortList[i].countrycname.indexOf(val) >= 0) || (this.optionalPortList[i].threecode && this.optionalPortList[i].threecode.indexOf(val) >= 0)) {
              noSelectData.push(this.optionalPortList[i]);
            }
          }
        if (noSelectData.length > 0) {
          this.optionalPortList = []
          this.optionalPortList = noSelectData;
        }
      } else {
        this.optionalPortList = [];
        this.optionalPortList = this.temporaryNoSelect;
      }
     

      this.selectedTotal = this.optionalPortList.length;
    }
  },
  methods: {
    reset() {
      this.inputModelData = {};
    },
    search() {
      this.tableDataRes = [];
      let jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      let json = { json: JSON.stringify(jsonArr2) };
      console.log(this.searchData);
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExAirCompanyDeptPrice",
        params: json,
        loading: true,
        tip: false,
        noselect: true
      }).then(
        result => {
          let resultData = result.data;
          this.tableDataRes = resultData;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 拿到对应嵌套表格的数据
    getZimessage(row) {
      const { index } = row;
      this.ziTableData = [];
      console.log(this.tableDataRes);
      this.tableDataRes.forEach(item => {
        if (item.index === index) {
          item.pricelist.forEach(obj => {
            this.ziTableData.push(obj);
          });
        }
      });
    },
    // 获取航空公司对应的始发港地域数据
    getAirCompanySfgData() {
      this.sfgAreaList = [];
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExAirCompanyPortArea",
        params: { guid: this.aguid },
        loading: true,
        tip: false
      }).then(
        result => {
          if (result.data.length < 0) {
            return this.$message("没有数据");
          } else {
            console.log(result.data[0]);
            this.airData = result.data[0];
            result.data[0].airarealist.forEach(item => {
              this.sfgAreaList.push({
                airareaguid: item.airareaguid,
                aguid: item.aguid,
                sfg: item.sfg
              });
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    },

    // 添加
    getOption(data, str) {
      console.log(data);
      this.sfgAreaList = [];
      const { twocode, threecode, cname, ename, guid } = data.row;
      this.airlineDialogInfo.twocode = twocode;
      this.airlineDialogInfo.threecode = threecode;
      this.airlineDialogInfo.ename = ename;
      this.airlineDialogInfo.cname = cname;
      this.airlineDialogInfo.status = true;
      this.aguid = guid;

      if (str) {
        this.modifyEntrance = "out";
        if (this.modifyEntrance === "out") {
          this.addEditDataStatus = true;
        } else {
          this.addEditDataStatus = true;
        }
      }

      this.clearInfo();

      this.getAirCompanySfgData();
      // 获取所有港口数据
      this.dialog.sfgDialog.mdgField.pagedata = JSON.parse(
        localStorage.getItem("hbinfo")
      );
      console.log(this.dialog.sfgDialog.mdgField.pagedata);
    },
    // 打开子表格配置弹窗
    modifyCost(data) {
      console.log(data);
      this.config(data);
      
      const { twocode, threecode, cname, ename, deptguid } = data.row;
      this.getMdgCost(data.row.deptguid);
      this.airlineDialogInfo.twocode = twocode;
      this.airlineDialogInfo.threecode = threecode;
      this.airlineDialogInfo.ename = ename;
      this.airlineDialogInfo.cname = cname;
      this.mdgCostDialogStatus = true;
      this.mdgGuid = deptguid;
    },
    closeDialog() {
      this.airlineDialogInfo.status = false;
      this.destinationPortList = [];
      this.selectPort = [];
      this.optionalPortList = [];
      this.sfgAguid = null;
    },
    // 获取点击始发港对应的可选港口
    getPort(row) {
      // 清空必要数据
      this.destinationPortList = []; // 目的港数据
      this.selectPort = []; //已选港口表格数据
      this.optionalPortList = []; //可选港口表格数据
      this.noSelectTotal = 0
      this.selectedTotal = 0
      this.clearSearch();

      console.log(row);
      this.activeSfgInfo = row
      
      const { aguid, airareaguid, sfg } = row;
      this.sfgName = sfg;
      this.airareaguid = airareaguid;
      this.sfgAguid = aguid;
      console.log(this.destinationPortList);
      // 获取所有港口
      this.getmdgToPort();
      this.destinationPortList = [];
      if (this.destinationPortList.length === 0) {
        if (this.airData.airarealist.length !== 0) {
          this.airData.airarealist.forEach(item => {
            if (item.airareaguid === airareaguid) {
              item.postlist.forEach(obj => {
                this.destinationPortList.push(obj);
              });
            }
          });
        }
      }
    },
    // 始发港逻辑地域逻辑开始

    // 添加始发港目的地域
    confirmAdd() {
      this.$axios({
        method: "put",
        url: this.$store.state.BasicWebApi + "api/PutExAirCompanyArea",
        data: {
          aguid: this.aguid,
          airareaguid: this.dialog.sfgDialog.mdgField.airareaguid,
          isdel: 1
        },
        loading: true,
        tip: false
      }).then(res => {
        if (res.data.resultstatus === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.clearAddSfg();
          this.getAirCompanySfgData();
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    // 清空始发港目地域始发港
    clearAddSfg() {
      this.dialog.sfgDialog.visible = false;
      this.dialog.sfgDialog.mdgField.airareaguid = null;
    },
    // 删除始发港地域
    deleteSfg(row) {
      console.log(row);
      const { aguid, airareaguid } = row;

      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: "put",
            url: this.$store.state.BasicWebApi + "api/PutExAirCompanyArea",
            data: {
              aguid: aguid,
              airareaguid: airareaguid,
              isdel: 2
            },
            loading: true,
            tip: false
          }).then(res => {
            if (res.data.resultstatus === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              // 清空始发港对应的目的港
              this.destinationPortList = [];
              this.getAirCompanySfgData();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
    },

    // 始发港逻辑地域逻辑结束

    // 添加目的港弹窗逻辑处理开始

    //清空添加目的港地域
    clearAddMdg() {
      this.dialog.mdgDialog.visible = false;
      this.dialog.mdgDialog.mdgField.dname = "";
    },

    // 添加目的港地域
    confirmMdg() {
      if (this.sfgAguid !== null) {
        this.$axios({
          method: "put",
          url: this.$store.state.BasicWebApi + "api/PutExAirCompanyDept",
          data: {
            aguid: this.sfgAguid,
            dname: this.dialog.mdgDialog.mdgField.dname,
            airyq: "",
            isdel: 1
          },
          loading: true,
          tip: false
        }).then(res => {
          if (res.data.resultstatus === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getPort(this.activeSfgInfo);
            this.clearAddMdg();
            this.destinationPortList = [];
            this.getAirCompanySfgData();
           
          } else {
            this.$message.error("添加失败");
          }
        });
      } else {
        this.$message("请选择始发港");
      }
    },

    // 删除目的港
    deleteMdg(row) {
      console.log(row);
      const { aguid, deptguid } = row;

this.$confirm('是否确认删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.$axios({
                method: "put",
                url: this.$store.state.BasicWebApi + "api/PutExAirCompanyDept",
                data: {
                  aguid: this.sfgAguid,
                  deptguid: deptguid,
                  dname: this.dialog.mdgDialog.mdgField.dname,
                  airyq: "",
                  isdel: 2
                },
                loading: true,
                tip: false
              }).then(res => {
                if (res.data.resultstatus === 0) {
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  // 清空始发港对应的目的港
                  this.destinationPortList = [];
                  this.getAirCompanySfgData();
                } else {
                  this.$message.error("删除失败");
                }
              });
        })

     
    },

    // 获取始发港对应所有港口
    getmdgToPort() {
      this.allPort=[]
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExAirrelationPrice",
        params: { guid: this.sfgAguid },
        tip: false,
        noselect: true,
        loading: true,
        noarea: true
      }).then(res => {
        this.allPort = res.data;
      });
    },

    // 获取对应目的港的信息
    getMdgInfo(row) {
      console.log(row);
      const { deptguid, dname } = row;
      this.mdgGuid = deptguid;
      this.mdgName = dname;
       this.temporarySelect = [], 
      this.temporaryNoSelect = [], 
      // 每次点击先清空 已选 和 未选
      this.optionalPortList = [];
      this.selectPort = [];
      this.checkYetPort = [];
      this.checkMayPort = [];
      this.$refs.clearSelectCheck.clearSelection();
      this.$refs.clearNoSelectCheck.clearSelection();
      console.log(this.optionalPortList);
      this.clearSearch();
      if (this.allPort && this.allPort.length > 0) {
          this.allPort.forEach(item => {
            if (item.deptguid === deptguid && item.isair === 1) {
              
              this.selectPort.push(item);
              this.temporarySelect.push(item);
            } else if (item.isair === 2) {
              this.optionalPortList.push(item);
              this.temporaryNoSelect.push(item);
            }
          });
      }

      console.log("--------------------------------");
      console.log("所有港口");
      console.log(this.allPort);
      console.log("已选港口");
      console.log(this.selectPort); //已选
      console.log("未选港口");
      console.log(this.optionalPortList); //未选港口
      console.log("--------------------------------");
      this.selectedTotal = this.optionalPortList.length; //已选总条数
      this.noSelectTotal = this.selectPort.length; //未选总条数
    },
    // 添加目的港弹窗逻辑处理结束

    // 获取选中的 已选港口
    handleSelectionChange(val) {
      console.log("最终值", val);
      this.checkYetPort = val;
    },

    // 获取选中的可选港口
    handleAddSelectionChange(val) {
      
      this.checkMayPort = val;
        console.log("最终值", val);
    },

    // 移除 / 添加 港口
    portOperate(row) {
      // console.log(row.tag);
      // console.log(this.mdgGuid);
      // console.log(this.checkMayPort)
      // console.log(this.checkYetPort)
      // console.log(this.optionalPortList)
      // console.log(this.selectPort)
      // console.log(this.selectPort.map(item => item.guid))
      console.log(this.checkYetPort.length)
      console.log('=====================下添加')
      console.log(this.checkMayPort.length)
      
      if (row.type === "remove") {
        if (this.mdgGuid && (row.addAll  == 0 && this.checkYetPort.length > 0) || ( row.addAll == 1) ) {
          this.$store.state.showloading = true
          this.$axios({
            method: "put",
            url: this.$store.state.BasicWebApi + "api/PutExAirrelation",
            data: {
              isdel: 2,
              deptguid: this.mdgGuid,
              airlist:
                row.tag === 0 ? this.selectPort.map(item => item.guid) : this.checkYetPort.map(item => item.guid)
            },
            tip: false
          }).then(res => {
            console.log(res.data);
             
            if (res.data.resultstatus === 0) {
              this.$message({
                type: "success",
                message: "移除成功"
              });
              this.$store.state.showloading = false
              this.clearInfo();
            } 
          });
        } else {
          this.$message("请选择港口后再移除");
        }
      } else if (row.type === "add") {
        if (this.mdgGuid &&  (row.addAll  == 0 && this.checkMayPort.length > 0) || (row.tag === 0 && row.addAll  ==  1)) {
          this.$store.state.showloading = true
          this.$axios({
            method: "put",
            url: this.$store.state.BasicWebApi + "api/PutExAirrelation",
            data: {
              isdel: 1,
              deptguid: this.mdgGuid,
              airlist:
                row.tag === 0 ? this.optionalPortList.map(item => item.guid) : this.checkMayPort.map(item => item.guid)
            },
            tip: false
          }).then(res => {
            console.log(res.data);
  
            if (res.data.resultstatus === 0) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$store.state.showloading = false
              this.clearInfo();
            }
          });
        } else {
          this.$message("请选择要添加的港口");
        }
      }
    },

    clearInfo() {
      this.destinationPortList = [];
      this.sfgName = "";
      this.mdgName = "";
      this.selectPort = [];
      this.mdgGuid = [];
      this.temporaryNoSelect = [];
      this.temporarySelect = [];
      this.optionalPortList = [];
      this.checkMayPort = [];
      this.checkYetPort = [];
      this.selectedTotal = 0;
      this.noSelectTotal = 0;
      this.select = "";
      this.noSelect = "";
      this.query = {
        selectPartition: null,
        selectPartitionName: null,
        selectPort: null,
        selectConutry: null,
        excludePort: null,
        excludeCountry: null
      };
    },

    //目的港的费用弹窗 修改
    getCost(item) {
      console.log(item);
      this.mdgCostDialogStatus = true;
      this.mdgGuid = item.deptguid;
      this.getMdgCost(item.deptguid);
    },
    closeMdgDialog() {
      this.mdgCostDialogStatus = false;
      this.editAirCostStatus = false;
      this.modCostIndex = -1;
      this.clearCost()
    },

    // 获取目的港费用
    getMdgCost(deptguid) {
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExAirCompanyDeptPriceInfo",
        params: { deptguid: deptguid },
        loading: true,
        tip: false
      }).then(res => {
        console.log(res.data);
        if (res.data) {
          this.mdgCosttableData = res.data;
        }
      });
    },

    // 目的港费用的配置修改  -  添加 /更新  开始

    // 添加新的费用
    addConfirmWage() {
      this.editFormModel.deptguid = this.mdgGuid;
      this.editFormModel.begindate = formatDate(
        this.editFormModel.begindate,
        "yyyy-MM-dd hh:mm:ss"
      );
      this.editFormModel.enddate = formatDate(
        this.editFormModel.enddate,
        "yyyy-MM-dd hh:mm:ss"
      );
      console.log(this.editFormModel);


      
      if(this.editFormModel.items !== '' && this.editFormModel.isautocommbill !== '' && this.editFormModel.sid !== '' && this.editFormModel.price !== '' && this.editFormModel.min_price !== '' && this.editFormModel.currency !== '' 
       && this.editFormModel.begindate !=='' && this.editFormModel.status !== ''){


      
      if(this.editAirCostStatus === false){
        this.editFormModel.enddate === '' ? this.editFormModel.enddate = '1900-01-01' : this.editFormModel.enddate
        // 添加费用
        this.$axios({
          method: "post",
          url: this.$store.state.BasicWebApi + "api/PostExAirCompanyDeptPrice",
          data: this.editFormModel,
          loading: true,
          tip: false
        }).then(result => {
          let resultData = result.data;
          console.log(result);
          // this.mdgCostDialogStatus = true
          
          this.getMdgCost(this.mdgGuid)
          
          if (resultData.length == 0) {
            return this.$message("无查询结果");
          } else {
            this.pageshow = false;
          }
          // 清空表单
          this.clearCost();

        });
      } else {
        this.editFormModel.enddate === '' ? this.editFormModel.enddate = '1900-01-01' : this.editFormModel.enddate
        // 更新费用
        this.$axios({
          method: "put",
          url: this.$store.state.BasicWebApi + "api/PutExAirCompanyDeptPrice",
          data: this.editFormModel,
          loading: true,
          tip: false
        }).then(result => {
          let resultData = result.data;
          console.log(result);
          // this.mdgCostDialogStatus = true
          this.getMdgCost(this.mdgGuid)
          if (resultData.length == 0) {
            return this.$message("无查询结果");
          } else {
            this.pageshow = false;
          }
          
          // 清空表单
          this.clearCost();

        });
      }
      } else {
        alert('请填写必要字段')
      }







    },
    // 取消添加费用
    clearCost() {
      this.modCostIndex = -1;
      this.costGuid = null;
      this.editAirCostStatus = false
      this.editFormModel = {
        deptguid: null,
        s_ename: "",
        sid: "",
        iszd: "",
        jsfs_out: "",
        jsfs_zd: "",
        jsfs_in: "",
        price: "",
        min_price: "",
        currency: "",
        begindate: "",
        enddate: "",
        price_status: "",
        addman: "",
        adddate: "",
        modifyman: "",
        modifydate: "",
        isautocommbill: -1, // 是否自动带到签单
        parmtype: -1
      };
    },
    getSelectData(row) {
      console.log(row);
      const { id } = row;
      this.editFormModel.sid = id;
    },
    config(row) {
      console.log(row);
      const {
        guid,
        iszd,
        jsfs_out,
        jsfs_zd,
        jsfs_in,
        sid,
        currency,
        begindate,
        enddate,
        price_status,
        addman,
        modifyman,
        modifydate,
        min_price,
        status,
        items,
        price,
        adddate
      } = row.row;
      this.editFormModel = {
        iszd: iszd,
        items: items,
        guid: guid,
        jsfs_out: jsfs_out,
        jsfs_zd:jsfs_zd,
        jsfs_in: jsfs_in,
        price: price,
        currency: currency,
        begindate: begindate,
        min_price: min_price,
        enddate: enddate,
        price_status: price_status,
        addman: addman,
        adddate: adddate,
        modifyman: modifyman,
        modifydate: modifydate,
        status: status,
        sid: sid
      };

      this.costGuid = guid;
      this.editAirCostStatus = true
      this.modCostIndex = row.index;
      console.log(row.row);
      console.log(this.editFormModel);
    },
    // 删除费用
    deleteCost(row) {
      console.log(row);
      const { guid } = row;
      this.$axios({
        method: "delete",
        url: this.$store.state.BasicWebApi + "api/DeleteExAirCompanyDeptPrice",
        data: { guid: guid },
        loading: true,
        tip: false
      }).then(
        result => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getMdgCost(this.mdgGuid)
          // this.mdgCostDialogStatus = false
          // this.search();
        },
        err => {
          console.log(err);
        }
      );
    },
    closeDialog() {
      this.clearCost();
    },
    // 目的港费用的配置修改  -  添加 /更新  结束

    // 分页开始
    // 已选港口的每页显示条数
    handleSelectedSizeChange(val) {
      this.selectedPageSize = val;
    },
    // 已选港口当前页码
    handleSelectedCurrentChange(val) {
      this.selectedCurrentPageNumber = val;
    },

    // 可选港口的每页显示条数
    handleNoSelectedSizeChange(val) {
      this.noSelectedPageSize = val;
    },
    // 可选港口当前页码
    handleNoSelectedCurrentChange(val) {
      this.noSelectedCurrentPageNumber = val;
    },

    searchPort() {
      // query.selectPartition
      console.log(this.query.selectConutry);
      console.log(this.query.excludePort);
      console.log(this.query.excludeCountry);
      console.log(this.query.selectPartitionName);
      if(this.query.selectPartition === '' && this.query.selectConutry === '' && this.query.excludePort === '' && this.query.excludeCountry === '' && this.query.selectPartitionName === '') {
        this.optionalPortList = this.temporaryNoSelect;
      }
      this.optionalPortList = this.temporaryNoSelect;
      let resultData = this.optionalPortList.filter(item => {
        return (
          (!this.query.selectConutry ||
            this.query.selectConutry.split(",").includes(item.countrycname)) && //查国家
          (!this.query.excludeCountry ||
            !this.query.excludeCountry
              .split(",")
              .includes(item.countrycname)) && //排除的国家
          (!this.query.selectPort ||
            this.query.selectPort.toUpperCase().split(",").includes(item.threecode)) && //查港口
          (!this.query.excludePort ||
            !this.query.excludePort.toUpperCase().split(",").includes(item.threecode)) && //排除的港口
          (!this.query.selectPartitionName ||
            this.query.selectPartitionName === item.iataid) //查分区
        );
      });

      this.$nextTick(() => {
        this.optionalPortList = resultData;
        this.selectedTotal = this.optionalPortList.length;
      });

      console.log(this.optionalPortList);
    },
    clearSearch() {
      this.query = {
        selectPartition: "",
        selectPartitionName: "",
        selectPort: "",
        selectConutry: "",
        excludePort: "",
        excludeCountry: ""
      };
    },
    getkey(row) {
      return row.guid;
    },
    getkeyId(row) {
      return row.guid;
    }
  },
  mounted() {
    // 查询需要的数据源
    const aviationInfo = JSON.parse(localStorage.getItem("airinfo"));
    console.log(aviationInfo)
    // 查询数据项赋值
    aviationInfo.forEach(item => {
      if (item.CName && item.EName) {
        this.inputViewData.cname.pagedata.push({
          CName: item.CName,
          EName: item.EName
        });
      }


      if (item.ThreeCode) {
        this.inputViewData.threecode.pagedata.push({
          ThreeCode: item.ThreeCode,
          TwoCode: item.TwoCode
        });
      } 
      if (item.TwoCode) {
        this.inputViewData.twocode.pagedata.push({
          ThreeCode: item.ThreeCode,
          TwoCode: item.TwoCode
        });
      }
    });
    console.log(this.inputViewData.twocode)
    const data = JSON.parse(localStorage.getItem("groupType"));
    //获取分区类型，通过groupType 的 groupid  为 254
    this.partitionList = data.filter(
      item => item.groupid == 254 && item.id !== 2559
    );
    console.log(this.partitionList);

    // 获取WFF分区的 分区类型
    this.$axios({
      method: "get",
      url: this.$store.state.publicWebApi + "api/PubWffArea",
      params: { area: "" },
      tip: false,
      noselect: true,
      noarea: true
    }).then(res => {
      res.data.forEach(item => {
        this.wffPartitionNameList.push({
          id: item.id,
          typename: item.Areaname
        });
      });
    });

    const initCostData = JSON.parse(localStorage.getItem("groupType"));
    // 通过本地缓存取 计费方式
    this.billList = initCostData.filter(item => item.groupid === 33);
    this.currencyData = JSON.parse(localStorage.getItem("currencyData"));


    if(this.$router.history.current.params.ready08 ===  'AESOUT'){
      this.depotModule = false
    } else if(this.$router.history.current.params.ready08 ===  'AEWOUT') {
      this.depotModule = true
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__title {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
}
.activeBg {
  background-color: #fff8ef;
}
.airCompanyDialogInfo {
  width: 1200px;
  height: 500px;
  display: flex;
  flex-wrap: wrap;
  .areaInfo {
    width: 146px;
    height: 480px;
    display: flex;
    flex-direction: column;
    margin-right: 16px;
    .head {
      width: 57px;
      height: 18px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 18px;
    }
    .body {
      width: 146px;
      height: 480px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      margin-top: 8px;
      .body-head {
        width: 100%;
        height: 32px;
        line-height: 32px;
        background: #f8f8f8;
        border-radius: 4px 4px 0px 0px;
        border: 1px solid #e8e8e8;
        position: relative;
        .body-title {
          width: 60px;
          height: 18px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3a3c42;
          position: absolute;
          left: 12px;
        }
        .body-add {
          background-image: url("../../boStatic/images/add.png");
          background-repeat: no-repeat;
          background-position: center;

          height: 27px;
          width: 20px;
          // margin: 2px 110px;
          cursor: pointer;
          position: absolute;
          right: 16px;
          top: 3px;
        }
      }
      .table-content {
        width: 100%;
        height: 330px;
        overflow-y: scroll; //超出高度滚动
        scrollbar-width: none;
      }
      .table-content::-webkit-scrollbar {
        display: none; //谷歌隐藏滚动条
      }
      .body-content {
        width: 100%;
        height: 420px;
        overflow-y: scroll; //超出高度滚动
        scrollbar-width: none;

        .body-item {
          width: 100%;
          height: 32px;
          line-height: 32px;
          position: relative;
          border-radius: 4px 4px 0px 0px;
          border: 1px solid #e8e8e8;
          position: relative;
          td {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3a3c42;
            line-height: 18px;
          }
          // display:flex;
          // flex-wrap: wrap;
          .body-item-title {
            width: 84px;
            height: 24px;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3a3c42;
            position: absolute;
            left: 12px;
          }
          .body-item-money {
            background-image: url("../../boStatic/images/money.png");
            background-repeat: no-repeat;
            background-position: center;
            height: 27px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            left: 12px;
            top: 3px;
          }
          .body-item-delete {
            height: 27px;
            width: 20px;
            cursor: pointer;
            position: absolute;
            right: 16px;
            top: 10px;
          }
        }
      }
    }
    .operate {
      width: 100%;
      height: 32px;
      padding: 2px;
      display: flex;
    }
  }
  .body-content::-webkit-scrollbar {
    display: none; //谷歌隐藏滚动条
  }

  // 已选 / 可选港口
  .choosePort {
    width: 298px;
    height: 480px;
    display: flex;
    flex-direction: column;
    margin-right: 16px;
    .head {
      width: 57px;
      height: 18px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d3e42;
      line-height: 18px;
    }
    .body {
      width: 100%;
      height: 480px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      margin-top: 8px;
      /deep/ .el-table__header {
        position: relative;
        /deep/ .el-input__inner {
          position: absolute;
          left: 20px;
        }
      }
    }
    .operate {
      width: 100%;
      height: 32px;
      padding: 2px;
      display: flex;
      .portSearch {
        position: absolute;
        left: 10px;
      }
    }

    /deep/.el-table--scrollable-y ::-webkit-scrollbar {
      display: none;
    }
    // 分页
    /deep/ .el-pagination {
      padding: 2px 3px;
    }
    /deep/ .el-pagination .el-select .el-input {
      width: 77px;
      margin: 0 -2px;
    }
    /deep/ .el-pager li {
      min-width: 1px;
    }
    /deep/ .el-pagination .btn-next,
    .el-pagination .btn-prev {
      background: none;
    }
  }

  // 分区类型
  .partition {
    width: 200px;
    height: 480px;
    .partition-item {
      width: 100%;
      height: 75px;
      display: flex;
      flex-direction: column;
      .partition-item-title {
        width: 56px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3a3c42;
        line-height: 20px;
        margin-bottom: 4px;
      }
    }
    .partition-item-btn {
      width: 100%;
      height: 32px;
      display: flex;
    }
  }
  .selectPort {
    width: 236px;
    height: 480px;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }
}

.form {
  .form-item {
    width: 100%;
    height: 50px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .form-item-label {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3a3c42;
      line-height: 30px;
      margin-right: 16px;
    }
    .form-item-add {
      width: 88px;
      height: 32px;
      background: #0e5b8c;
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      position: absolute;
      left: 185px;
    }
    .form-item-returnFalse {
      width: 60px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #0e5b8c;
      position: absolute;
      left: 280px;
    }
  }
}
</style>
