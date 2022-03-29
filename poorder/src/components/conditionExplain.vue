<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync='pageshow'
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
      ></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="openDialogShow">上传情况说明</el-button>
        <el-button @click="openEditObjectDialog">更改结算对象</el-button>
      </div>
    </div>
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :chinese-where.sync="chineseWhere"
      :explainInfoArr="explainInfoArr"
      :dataGrouping="dataGrouping"
      @changeAll="getChange"
      @transSelIndex="openDialogs"
      groupField="boguid"
      isGroup
      :isSort="false"
      :isPaging="false"
    >
      <template slot="tabOperate" slot-scope="props">
        <el-checkbox
          v-model="props.data.row.checked"
          @change="getSelectOrder"
        ></el-checkbox>
      </template>
      <template slot="display" slot-scope="props">
        <i
          class="el-icon-map-location"
          title="节点信息"
          @click="
            jiedianShow = true;
            displayIndex = props.data.index;
          "
        ></i>
        <i
          class="el-icon-picture"
          title="本票照片"
          @click="showImgFunc(props.data.index)"
        ></i>
        <span
          :index="props.data.index"
          @click="openDialog(props.data.row, 1, true)"
          ><i
            class="el-icon-upload"
            title="本票文档上传，可直接拖动文档到此列上传"
          ></i
        ></span>
        <el-badge
          is-dot
          class="item"
          v-if="
            props.data.row.status !== '未受理' ||
              props.data.row.status === 'undefined'
          "
          :hidden="
            $store.state.readMessageList.indexOf(props.data.row.guid) > -1
              ? false
              : true
          "
          style="vertical-align:none"
        >
          <i
            class="el-icon-chat-dot-square"
            @click="openChatRoome(props.data.row)"
          ></i>
        </el-badge>
      </template>
    </tableCompt>

    <docUpload
      :dialogShow.sync="dialogShow"
      :orderList="orderList"
      :modelData="orderDetailInfo"
      :tagStatus="tagStatus"
      :imgdocCheckedList.sync="docList"
      :showBtnGroup="false"
      :pagetype="pageNum"
      :itemList="itemsList"
      :newObjectId="gid"
      :wdkhId="String(fid)"
      :selectTableIndex="selectTableIndex"
      v-if="dialogShow"
      @close="closeDocStatus"

    >
      <template slot="infolist">
        <infoList
          :inputModelData="selectOrderId[0]"
          :showBtnGroup="false"
          :showDcno="false"
          :showOrderNumber="false"
          :name="'签单'"
          v-if="selectOrderId.length == 1"
        ></infoList>
      </template>

      <template slot="imgdocTable">
        <imgdocTable
          :imgList.sync="imgList"
          :docList.sync="docList"
          :deleteIds.sync="deleteIds"
          system="bo"
          :boguid="inputModelData.boguid"
        ></imgdocTable>
      </template>
    </docUpload>

    <el-dialog
      title="更改结算对象"
      :visible.sync="changeObjectDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeStatus"
      width="79%"
      style="margin-top:-5vh;margin-left:13vw;"
      center
    >
      <div class="changeObjectContainer">
        <div class="topContainer">
          <span style="color:#EA0100;font-weight: 800;"
            >请选择需要更改的委托客户</span
          >
          <br />
          <pageSelect
            style="width:405px;margin:16px 0 ; "
            class="wdkfInput"
            placeholder="请选择委托客户"
            :pagedata="wdkhData"
            :modelval.sync="fid"
            @getValue="getWdkName"
          >
          </pageSelect>
          <el-button @click="confirm" class="confirm">确认</el-button>
          <hr />
          <div v-if="showDetail">
            <newFormCmpt
              class="searchCmpt-c"
              :view-data.sync="searchInputViewData"
              :model-data.sync="inputFormModelData"
              :search-data.sync="searchFormData"
              :pagetype="1"
              :exForm="true"
            >
            </newFormCmpt>
            <el-button
              @click="searchForm"
              style="background:#0f5a8c;color:white;border:1px solid #e8e8e8;"
              >查询</el-button
            >

            <div class="bodyContainer">
              <span
                style="display: inline-block;color:#EA0100;font-weight: 800;margin: 16px 0px;"
                >针对查询结果,请选择订单的服务项目并将其更改为新的结算对象</span
              >
              <br />
              <div class="searchServiceContainer">
                <div class="item">
                  <span>服务项目</span>
                  <pageSelectMultiple
                    :viewdata="projectViewData"
                    :pagedata="serviceProjectData"
                    :multiple="true"
                    :modelval.sync="itemsList"
                    style="width:232px;margin-left:10px;"
                    ref="pageSelectMultiple"
                  >
                  </pageSelectMultiple>
                </div>
                <div class="item">
                  <span>新结算对象名</span>
                  <page-select
                    :modelval.sync="gid"
                    :pagetype="2"
                    area="上海"
                    :wtxmname="wtxmname"
                    :ifRefreshData.sync="ifRefreshData"
                    :fid="fid"
                    style="width:60%;margin-left:10px;"
                  >
                  </page-select>
                  <jsdxwh
                    :fid="fid"
                    :area="inputModelData.area"
                    @success="ifRefreshData = !ifRefreshData"
                    style="margin-left:20px;"
                  ></jsdxwh>
                </div>
              </div>
            </div>
            <div class="bottomContainer">
              <commonTable
                class="commonTable"
                :head="inPcTable"
                :isMultiSelect="true"
                :paginationShow="true"
                :table-data="inPcData"
                style="position:relative;"
                :multiSelectChange="getSelectOrder"
              >
                <template slot="reason" slot-scope="props">
                  <i
                    class="el-icon-question"
                    @click="getCause(props.data.row)"
                    v-if="
                      props.data.row.examineremark ||
                        props.data.row.cancelreason ||
                        props.data.row.routedelreason ||
                        props.data.row.tgreason
                    "
                    title="订单驳回原因"
                  ></i>
                </template>
              </commonTable>
            </div>
            <div class="operateContainer">
              <el-button
                class="confrimUpload"
                @click="confirmUpload"
                style="background:#0f5a8c;color:white;border:1px solid #e8e8e8;"
                >确认上传</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="imgShow"
      class="dialogImgDoc"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-if="imgShow"
      width="980px"
      append-to-body
      top="0"
    >
      <iframe
        :src="imgUrl"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"
      ></iframe>
    </el-dialog>
    <el-dialog
      :visible.sync="jiedianShow"
      width="90%"
      title="节点状态信息"
      top="4%"
      center
      v-if="jiedianShow"
      :close-on-press-escape="false"
      append-to-body
    >
      <jiedian
        :mawbinfo="tableDataRes[displayIndex]"
        :orderdom="tableDataRes[displayIndex].orderdom"
      ></jiedian>
    </el-dialog>

    <el-dialog
      title="综合查询"
      v-if="compositeDialogShow"
      center
      :visible.sync="compositeDialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="compositeDialogShow"
        :pagetype="20"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
        :orderdom="orderdom"
      ></mawbaddput>
    </el-dialog>
    <!-- 原因 -->
    <el-dialog
      :visible.sync="cancelVisible"
      width="1000px"
      top="4%"
      v-if="cancelVisible"
      center
    >
      <cancelReason
        :jobData="jobData"
        showWagebtn
        @openWageDialog="openWageDialog"
        :pagetype="canceltype"
        :visible.sync="cancelVisible"
      ></cancelReason>
    </el-dialog>

    <el-dialog
      title="费用未确认"
      :visible.sync="costMakingVisible"
      width="100%"
      top="0"
      v-if="costMakingVisible"
      @close="uncostMaking"
      :close-on-press-escape="false"
      class="dialogPage"
      :modal="false"
      center
    >
      <costmaking
        :mawbguid="mawbguid"
        @unvisible="uncostMaking"
        :boguid="boguid"
        ref="costDialog"
        pagetype="2"
      >
      </costmaking>
    </el-dialog>
  </div>
</template>

<script>
import pageSelectMultiple from "./smallTemplate/pageSelectMultiple";
import { getChangeValue, formatDate } from "../api/localStorage.js";
import imgdocTable from "@/components/docSystem/imgdocTable";
import jiedian from "./orderDetails/jiedian";

export default {
  name: "conditionExplain",
  components: { pageSelectMultiple, jiedian, imgdocTable },
  props: {
    routername: String
  },
  data() {
    return {
      name: "conditionExplain.vue",
      inputViewData: {
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          defaultEnd: true
        }
      },
      tagStatus: "",
      inputFormModelData: {},
      searchData: {},
      searchFormData: {},
      pageNum: 1,
      wtxmname: "",
      orderDetailInfo: {},
      cancelIndex: -1,
      changeObjectDialog: {
        title: "更改结算对象",
        visible: false
      },
      projectViewData: [
        { title: "s_name", field: "s_name" }, //配置绑定label 和 value 字段名
        { title: "服务项目", field: "s_name" }, //显示两列的名字与字段名
        { title: "英文名称", field: "s_ename" }, //显示两列的名字与字段名
        { title: "服务项目代码", field: "s_code" }
      ],
      searchInputViewData: {
        shipperno: { title: "订单编号", type: 1, whereStr: "like" },
        mawb: { title: "总运单号", type: 1, whereStr: "like" },
        sfg: { title: "始发港", type: 4, whereStr: "like" },
        mdg: { title: "目的港", type: 4, whereStr: "like" },
        hbh: { title: "航班号", type: 1, whereStr: "like" },
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: true,
          defaultEnd: false
        },
        czlx: {
          title: "操作类型",
          type: 5,
          whereStr: "in",
          options: [],
          fieldtype: 4,
          groupid: 132
        },
        hwxz: {
          title: "货物性质",
          type: 5,
          whereStr: "in",
          groupid: 115,
          fieldtype: 4
        },
        adddate: {
          title: "创建日期",
          type: 15,
          defaultVal: false,
          defaultEnd: false
        },
        addman: { title: "创建人", type: 1, whereStr: "like" },
        customername: { title: "客服负责人", type: 1, whereStr: "like" }
      },
      viewdata: [
        {
          title: "id",
          field: "usr_name"
        },
        {
          title: "委托客户",
          field: "usr_name"
        }
      ],
      fid: "",
      inputModelData: {
        hxconfirmstatus: "700",
        status: "AO5060,AO5065,AO5070",
        signman:
          this.routername == "hxCostCassify"
            ? localStorage.getItem("usrname")
            : "",
        kfconfirmstatus: "700",
        applysignman:
          this.routername == "kfCostCassify"
            ? localStorage.getItem("usrname")
            : ""
      },
      inOrderList: [], //更改结算对象 内部 选中订单
      searchData: {},
      dialogShow: false,
      tableDataRes: [],
      selectTableIndex: -1,
      chineseWhere: [],
      wdkhData: [],
      tableDataRes: [],
      chineseWhere: [],
      // 表格分组信息
      dataGrouping: {},
      explainInfoArr: [
        {
          title: "委托客户",
          field: "usr_name"
        },
        {
          title: "公司负责人",
          field: "salesprofitername"
        },
        {
          title: "票数",
          field: "count"
        },
        {
          title: "实际",
          field: "reality"
        }
      ],
      // 订单详情入口标识  1， 图标  2， 订单编号
      orderDeatilTag: 0,
      // 服务项目数据存储
      serviceProjectData: [],
      itemsList: "",
      // 新结算对象名
      objName: "",
      inPcTable: [
        {
          title: "订舱编号",
          field: "pono"
        },
        {
          title: "原因",
          field: "reason"
        },
        {
          title: "始发港",
          field: "sfg"
        },
        {
          title: "目的港",
          field: "mdg"
        },
        {
          title: "操作类型",
          field: "czlx"
        },
        {
          title: "总运单号",
          field: "mawb"
        },
        {
          title: "航班号",
          field: "hbh"
        },
        {
          title: "航班日期",
          field: "hbrq"
        },
        {
          title: "预报件重体",
          field: "ybjzt"
        },
        {
          title: "实际件重体",
          field: "sjjzt"
        },
        {
          title: "制单件重体",
          field: "czlx"
        }
      ],
      inPcData: [],
      ifRefreshData: false, //刷新结算对象数据
      newSettleObjectId: "", //新结算对象id
      serviceProject: [],
      selectOrderId: [], //外层table checkbox
      jiedianShow: false,
      imgShow: false,
      imgUrl: "",
      positionDocUpload: false,
      displayIndex: -1, //点击照片节点的索引
      showDetail: false, //用来控制是否显示详细查询条件内容和显示table内容
      gid: "",
      jiediandata: [], //节点数据
      newMawbShow: false, //页头总单搜索后替换当前页面，注意新页面是嵌套在之前的详细页面内的，这是为了使页面用v-if初始化，否则手动初始页面内容存在风险
      uploadExplainDialogVisible: false,
      imgList: [], //存放图片的数据
      docList: [], //存放文档的数据
      deleteIds: [],
      orderList: [],
      mawbguid: "",
      compositeDialogShow: false,
      cancelVisible: false, //原因

      canceltype: 4,
      jobData: {},

      costMakingVisible: false
    };
  },

  watch: {
    tableDataRes: {
      handler(data) {
        this.selectOrderId = [];

        console.log("深度监听：", data);
        data.forEach(item => {
          if (item.checked) {
            this.selectOrderId.push(item);
          }
        });
        this.orderList = this.selectOrderId;
        Object.values(this.dataGrouping).forEach(i => {
          if (
            this.selectOrderId.filter(select => select.fid == i.fid).length ==
            i.len
          ) {
            i.checked = true;
          } else {
            i.checked = false;
          }
        });
        console.log(this.selectOrderId);
      },
      deep: true
    },
    deleteIds(val) {
      if (val.length) {
        this.docList = this.docList.filter(i => !val.includes(String(i.id)));
        this.updateList();
      }
    },
    itemsList: {
      handler(data) {
        console.log(data);
        let selectData = data.split(",");
        for (var i in this.inPcData) {
          this.inPcData[i].checked = false;
          if (
            this.inPcData[i]["itemsList"].filter(k => selectData.includes(k))
              .length
          ) {
            this.inPcData[i]["checked"] = true;
            continue;
          }
        }
        this.inOrderList = [];
        this.inPcData.forEach(item => {
          if (item.checked) {
            this.inOrderList.push(item);
          }
        });
        this.orderList = this.inOrderList;
        console.log(this.orderList);
      },
      deep: true
    },
    inPcData: {
      handler(data) {
        this.inOrderList = [];
        data.forEach(item => {
          if (item.checked) {
            this.inOrderList.push(item);
          }
        });
        this.orderList = this.inOrderList;
        console.log(this.orderList);
      },
      deep: true
    },
    routername: {
      immediate: true,
      handler(val) {
        if (this.routername == "hxCostCassify") {
          this.$store.commit("setSituationState", "hxCostCassify");
        } else if (this.routername == "kfCostCassify") {
          this.$store.commit("setSituationState", "kfCostCassify");
        }
      }
    }
  },
  methods: {
    getChange({ value, data }) {
      for (var i = data.listLength - data.len; i < data.listLength; i++) {
        this.tableDataRes[i]["checked"] = value ? true : false;
      }
    },
    updateList() {
      console.log(this.docList);
      this.$emit("update:imgdocCheckedList", this.docList);
    },
    closeStatus() {
      // this.fid = ""
      this.showDetail = false;
      // this.serviceProjectData = []
      // this.itemsList = ""
      // this.gid = ""
      // this.inPcData = []
    },
    closeDocStatus() {
      this.fid = "";
      this.serviceProjectData = [];
      this.itemsList = "";
      this.gid = "";
      this.inPcData = [];
      this.search()
    },
    search() {
      this.selectTableIndex = -1;
      console.log(this.searchData);
      if (
        this.$store.state.ifLimitSearch &&
        Object.keys(this.searchData).length == 0
      ) {
        return this.$message.error("请输入或选择查询条件！");
      }
      this.tableDataRes = [];

      if (this.routername == "hxCostCassify") {
        this.searchData.wagedom = "航线";
        this.searchData.confirmstatus_in = {
          in: this.inputModelData.hxconfirmstatus
        };

        this.$delete(this.searchData, "hxconfirmstatus");
      } else if (this.routername == "kfCostCassify") {
        this.searchData.wagedom = "客服";
        this.searchData.confirmstatus_in = {
          in: this.inputModelData.hxconfirmstatus
        };

        this.$delete(this.searchData, "kfconfirmstatus");
      }

      if (this.searchData.hbrq && !this.searchData.hbrq.begin) {
        let begin = new Date();
        begin.setMonth(begin.getMonth() - 2);
        this.searchData.hbrq.begin =
          formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
      }
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineGeneralMissDoc",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }

          setTimeout(() => {
            // this.tableDataRes=results.data;

            console.log(results.data);
            this.tableDataRes = results.data.map(i => {
              if (!i.mawb || i.hbh) {
                i.checkDisabled = true;
              }
              return i;
            });
            console.log(this.tableDataRes);
            let data = [];
            let listLength = 0;
            let textObj = {};
            let wdkhData = JSON.parse(window.wtkhData);
            console.log(this.tableDataRes);
            this.tableDataRes.forEach((i, index) => {
              if (i.list.length > 0) {
                listLength = listLength + i.list.length;
                wdkhData.forEach(k => {
                  if (k.id == i.fid) {
                    textObj[i.list[0].boguid] = {
                      realvolume: i.realvolume,
                      listLength: listLength,
                      list: getChangeValue(i.list, "空出"),
                      fid: k.id,
                      checked: false,
                      usr_name: k.usr_name,
                      reality: `${i.realpiece}/${i.realweight}/${i.realvolume}`,
                      count: i.count,
                      salesprofitername: k.salesprofitername,
                      len: i.list.length,
                      checkChoice: true
                    };
                  }
                });

                data = data.concat(i.list);
              }
            });
            this.dataGrouping = textObj;
            console.log(this.dataGrouping);
            this.tableDataRes = data;
          }, 0);
        })
        .catch(errors => {});
      console.log(this.tableDataRes);
    },
    searchForm() {
      this.searchFormData.fid = this.fid;
      this.itemsList = "";
      this.serviceProjectData = [];
      var jsonArr2 = {
        where: this.searchFormData,
        order: "adddate desc"
      };
      var json = { json: JSON.stringify(jsonArr2) };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExBoBaseWageChangeSettObj",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(results.data, "空出");
          this.inPcData = results.data;
          console.log(results.data);
          results.data.forEach(item => {
            item.itemsList.forEach(val => {
              this.serviceProject.push(val);
            });
          });

          console.log(this.serviceProject);
          console.log("=====================");
          console.log(...new Set(this.serviceProject));
          this.serviceProject = [...new Set(this.serviceProject)];
          console.log(this.serviceProject);

          const projectData = JSON.parse(localStorage.getItem("fwxm"));
          this.serviceProjectData = [];
          this.itemsList = "";
          this.serviceProject.forEach(item => {
            projectData.forEach(obj => {
              if (item == obj.s_name) {
                this.serviceProjectData.push({
                  s_name: obj.s_name,
                  s_ename: obj.s_ename,
                  s_code: obj.s_code
                });
              }
            });
          });
          this.serviceProjectData = [...new Set(this.serviceProjectData)];
          console.log(this.serviceProjectData);
        })
        .catch(errors => {});
    },
    reset() {
      this.searchData = {};
      // this.inputModelData = {};
    },
    openDialogShow() {
      this.tagStatus = "上传情况说明";
      if (this.selectOrderId.length > 0) {
        this.dialogShow = true;
        this.uploadExplainDialogVisible = true;
      } else {
        this.$message.error("请选择工作号！");
      }
    },
    openEditObjectDialog() {
      this.tagStatus = "更改结算对象";
      this.changeObjectDialog.visible = true;
      this.wdkhData = JSON.parse(window.wtkhData);
      console.log(this.wdkhData);
    },
    // 删除订单
    deleteOrder(row) {
      console.log(row);
    },
    formtSmallTableData(val) {
      var statusData = JSON.parse(localStorage.statusData);
      var returnstatus = "";
      for (let m in statusData) {
        if (val == statusData[m].nodeindex) {
          returnstatus = statusData[m].nodename;
        } else if (val == 0) {
          returnstatus = "--";
        } else if (val == -1) {
          returnstatus = "自送外场";
        }
      }
      return returnstatus;
    },
    // 确认
    confirm() {
      if (this.fid) {
        this.showDetail = true;
      }
      console.log(this.inputModelData);
    },
    getSelectOrder(val, row) {
      // console.log(val,row)
    },
    showImgFunc(index) {
      this.imgShow = true;
      let data = this.tableDataRes[index];

      let mawbtype = data.orderdom == "直单" ? 1 : 2;
      let usrname = localStorage.usrname;
      this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${data.area}&boguid=${data.boguid}`;
    },
    openDialogs(indexData, positionDocUpload = false) {
      this.orderDeatilTag = 2;

      if (indexData < 0) return;
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      this.positionDocUpload = positionDocUpload;

      // this.dialogShow = true;
      this.compositeDialogShow = true;
    },
    openChatRoome(row) {
      this.$store.commit("setChat", { status: true, data: row });
    },
    getNewMawbinfo(data) {
      //表头中搜索打开新的运单信息
      this.newMawbShow = true;
      this.newMawbinfo = data;
    },
    delTableIndex(data) {
      this.dialogShow = false;
      // if(data.nodel==2){
      //    this.tableDataRes.splice(this.selectTableIndex,1)
      // }
    },
    getWdkName(row) {
      this.wtxmname = row.usr_name;
    },
    confirmUpload() {
      if (this.fid && this.itemsList && this.gid) {
        this.dialogShow = true;
        this.changeObjectDialog.visible = false;
      }
      if (!this.fid) {
        this.$message.error("请选择 委托客 后再进行上传");
      }
      if (!this.itemsList) {
        this.$message.error("请选择 服务项目 上传");
      }
      if (!this.gid) {
        this.$message.error("请选择 结算对象名 后再进行上传");
      }
    },
    getSelectOrder(row, index) {
      console.log(row, index);
    },
    openDialog(row, tag) {
      console.log(row, tag);
      console.log(this.inputModelData);
      this.orderDeatilTag = tag;

      const { index } = row;
      this.tagStatus = "";
      this.selectTableIndex = index;
      this.mawbguid = this.tableDataRes[index].guid;
      this.boguid = this.tableDataRes[index].boguid;
      this.orderdom = this.tableDataRes[index].orderdom;
      this.area = this.tableDataRes[index].area;
      this.pageNum = 2;
      this.orderDetailInfo = row;
      this.compositeDialogShow = true;

      if (this.orderDeatilTag == 1) {
        setTimeout(() => {
          this.dialogShow = true;
        }, 2000);
      }
    },
    openWageDialog() {
      this.selectedTableIndex = this.jobData.index;
      this.mawbguid = this.jobData.guid;
      this.boguid = this.jobData.boguid;
      this.costMakingVisible = true;
    },
    getCause(row) {
      console.log(row);
      this.jobData = row;
      this.cancelVisible = true;
      this.cancelIndex = row.index;
      this.canceltype = 4;
    },

    uncostMaking() {
      this.costMakingVisible = false;
      // 重新计算应收应付金额
      this.jobData.wageall_in = this.$refs.costDialog.zdtotalCharge;
      this.jobData.wageall_out = this.$refs.costDialog.zdtotalPayment;
      this.jobData.wageprofit = Number(
        Number(this.$refs.costDialog.zdtotalCharge) -
          Number(this.$refs.costDialog.zdtotalPayment)
      ).toFixed(2);
    }
  },
  mounted() {
    const deleteField = [
      "pdfinishdate",
      "courienum_deli",
      "orderno",
      "trackstatus",
      "customstatus",
      "setshipaceman",
      "confirmstatus_in"
    ];

    deleteField.forEach(item => {
      this.$delete(this.inputViewData, item);
    });
  }
};
</script>

<style lang="less" scoped>
.changeObjectContainer {
  height: 96vh;
}
.topContainer {
  width: 100%;
  height: 200px;
  position: relative;
  .confirm {
    position: absolute;
    left: 447px;
    top: 35px;
    background: #0f5a8c;
    color: white;
    border: 1px solid #e8e8e8;
  }
}
.bodyContainer {
  margin-bottom: 32px;
  margin-top: 32px;
  .searchServiceContainer {
    width: 100%;
    height: 32px;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 380px;
      height: 32px;
      line-height: 32px;
      margin-right: 32px;
      display: flex;
      flex-wrap: wrap;
    }
  }
}

.operateContainer {
  width: 100%;
  height: 100px;
  position: relative;
  .confrimUpload {
    position: absolute;
    right: 0;
    top: 20px;
  }
}
</style>
