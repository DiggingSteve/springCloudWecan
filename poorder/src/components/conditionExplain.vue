<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
      ></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="sendConfirmation">发送支付确认函</el-button>
        <el-button @click="openDialogShow">上传支付确认函</el-button>
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
      :checkGroupStatus="checkGroupStatus"
      :selectOrderId="selectOrderId"
      isGroup
      :isSort="false"
      :isPaging="false"
    >
      <template slot="tabOperate" slot-scope="props">
        <el-checkbox
          v-model="props.data.row.checked"
          @change="getSelectOrder(props.data.row)"
          :disabled="selectOrderId.length > 0 && selectOrderId[0].wtkhname != props.data.row.wtkhname ? true : false"
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
                    :pageSelectStatus="pageSelectStatus"
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
              <el-button class="send_confirmation" @click="sendConfirmationIn"  style="background:#0f5a8c;color:white;border:1px solid #e8e8e8;">发送支付确认函</el-button>
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

    <el-dialog title="填写内容" :visible.sync="dialogVisible" width="500px" append-to-body  :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="custom-required">
        <el-form label-position="right" label-width="80px" :model="emailInfo">
          <el-form-item label="收件人" class="required-item">
            <el-input v-model="emailInfo.mailto"></el-input>
          </el-form-item>
          <el-form-item label="主题" class="required-item">
            <el-input v-model="emailInfo.mailsubject" type="textarea" rows="3"></el-input>
          </el-form-item>
          <el-form-item label="抄送">
            <el-input v-model="emailInfo.mailtolist" class="no-required"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="closeDialogVisible">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>


    <transition
      enter-active-class="animate__animated animate__zoomInDown"
      leave-active-class="animate__animated animate__zoomOutRight"
    >
      <el-dialog
        :visible.sync="applyDialogStatus"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeApplyDialogStatus"
        width="983px"
        style="margin-top:-5vh;margin-left:13vw;"
        center
      >
        <!-- <el-carousel
          height="1200px"
          indicator-position="outside"
          :autoplay="false"
        >
          <el-carousel-item v-for="(item, index) in outsourceData" :key="index"> -->
            <div class="outsourcePayfor" v-for="(item, index) in outsourceData" :key="index" style="heihgt:1200px">
              <h2 class="outsourceTitle">委外代付说明</h2>
              <div class="content">
                <div class="content-body">
                  <span
                    >致:
                    <i style="text-decoration:underline;">
                      {{ item.wecanfidName }}</i
                    ></span
                  >
                  <span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因我司委托贵司代理国际航空货物运输业务,已产生应付贵司各项杂费合计人民币
                    {{ item.sum }}元整(如下表)。</span
                  >
                  <span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于上述杂费，我司委托由
                    <i style="text-decoration:underline;">
                      {{ item.wagefidName }}</i
                    >(下称“代付方”)
                    在贵我双方约定的结算周期内直接支付至贵司。此部分费用所涉发票，由贵司直接开具给代付方。</span
                  >
                  <span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若代付方未能如期定额向贵司付清上述约定费用，我司愿承担付款及违约责任。贵司如因接受上述代付行为产生任何损失，全部由我司承担。</span
                  >
                  <span
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以上，特此说明。</span
                  >
                </div>
                <div class="content-right">
                  <span>
                    <i style="text-decoration:underline;">
                      {{ item.fidName }} </i
                    >(公章)</span
                  >
                </div>
                <div class="content-right">
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp; 年
                    &nbsp;&nbsp;&nbsp;&nbsp; 月
                    &nbsp;&nbsp;&nbsp;&nbsp; 日</span
                  >
                </div>
                <!-- 订单列表 -->
                <div class="orderTitle">
                  <span>清单列表</span>
                </div>
                <div class="order-container">
                  <div class="order-item">
                    提单号
                  </div>
                  <div class="order-item">
                    实际件重体
                  </div>
                  <div class="order-item">
                    费用名称
                  </div>
                  <div class="order-item">
                    金额
                  </div>
                </div>
                <div
                  class="order-container"
                  v-for="(obj, wageIndex) in item.wageList"
                  :key="wageIndex"
                >
                  <div class="order-item">
                    {{ obj.mawb != "" ? obj.mawb :  obj.pono }}
                  </div>
                  <div class="order-item">
                    {{ obj.realpiece }} / {{ obj.realweight }} /
                    {{ obj.realvolume }}
                  </div>
                  <div class="order-item">
                    {{ obj.items }}
                  </div>
                  <div class="order-item">
                    ￥ {{Number(obj.wageall).toFixed(2) }}
                  </div>
                </div>
                <div class="content-right">
                  <span>合计: ￥{{ item.sum }}</span>
                </div>
              </div>
            </div>
          <!-- </el-carousel-item>
        </el-carousel> -->
        <div class="btn">
        <el-button type="primary" @click="dialogVisible = !dialogVisible" >发送邮箱</el-button>
        <el-button type="primary" @click="closeApplyDialogStatus" >取消</el-button>
        </div>

      </el-dialog>
    </transition>
  </div>
</template>

<script>
import pageSelectMultiple from "./smallTemplate/pageSelectMultiple";
import { getChangeValue, formatDate } from "../api/localStorage.js";
import imgdocTable from "@/components/docSystem/imgdocTable";
import jiedian from "./orderDetails/jiedian";
import html2Canvas from 'html2canvas'
export default {
  name: "conditionExplain",
  components: { pageSelectMultiple, jiedian, imgdocTable },
  props: {
    routername: String
  },
  data() {
    return {
      name: "conditionExplain.vue",
      outsourceData: [],
       // 在[航线 / 客服 / 订单]费用确认模块中使用，配合业务用来禁用checkbox
      checkGroupStatus: true, 
      dialogVisible:false,
      emailInfo: {
        mailto:"",
        mailsubject:"",
        mailtolist:""
      }, // 邮箱发送信息
      orderData: [
        {
          orderID: "781-23231231",
          weight: "100/22/33",
          costName: "卡车费",
          count: "￥22222"
        },
        {
          orderID: "781-23231231",
          weight: "100/22/33",
          costName: "卡车费",
          count: "￥22222"
        },
        {
          orderID: "781-23231231",
          weight: "100/22/33",
          costName: "卡车费",
          count: "￥22222"
        }
      ],
      inputViewData: {
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: false,
          defaultEnd: true
        }
      },
      tagStatus: "" ,
      applyDialogStatus: false,
      pageSelectStatus: "情况补充说明",
      pageshow: true,
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
        confirmstatus: "700",
        issupplyfile:"20,30",
        status: "AO5060,AO5065,AO5070",
        //signman: localStorage.getItem("usrname"),
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
          field: "dzjzt"
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
      emailData:[],
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
        if (this.routername) {
          this.$store.commit("setSituationState", this.routername);
        }
        // if (this.routername == "hxCostCassify") {
        //   this.$store.commit("setSituationState", "hxCostCassify");
        // } else if (this.routername == "kfCostCassify") {
        //   this.$store.commit("setSituationState", "kfCostCassify");
        // }
      }
    },
    fid(val){
      // 服务项目 新结算对象名 表格数据 
      this.serviceProjectData = []
      this.gid = ""
      this.inPcData = []
    }
  },
  methods: {
    closeDialogVisible(){
      this.emailInfo.mailtolist = ""
      this.dialogVisible = false
    },
   async  generatePicture(){
      let promise=[...document.querySelectorAll('.outsourcePayfor')].map((i,index)=>{
        return new Promise((resolve,reject)=>{
          html2Canvas(i,{
            scrollY: 0,
            scrollX: 0,
            allowTaint: true,  //开启跨域
            useCORS: true,
          }).then((canvas)=>{
            this.emailData.push({
            imgbase64: canvas.toDataURL(),
            fid:this.outsourceData[index].fid,
            wagefid: this.outsourceData[index].wagefid,
            wecanfid: this.outsourceData[index].wecanfid,
            wageList: this.outsourceData[index].wageList,
            gid: this.tagStatus == "更改结算对象" ? this.gid : -1
          }) 
           resolve(this.emailData)
          })
         
        })
        
      })
      

    //@发送邮箱更新            
    this.emailInfo.mailsender = localStorage.usrname;
    this.emailInfo.maildate = new Date().Format("yyyy-MM-dd hh:mm:ss");
      await Promise.all(promise).then((value)=>{
                 this.$axios({
                method: "post",
                url: this.$store.state.webApi + "api/ExBoBaseWageChangeSettObjSendMail",
                data: {
                  czman: localStorage.usrname,
                  mailjson: JSON.stringify(this.emailInfo), //@发送邮箱更新
                  postdata: value[0],
                  logExtraData:  this.$store.state.logExtraDataForBuild
                },
                loading: true,
                tip: false
              })
              .then(results=>{
                const res = results.data
                if(res.resultstatus  == 0) {
                  this.$alert(
                  "批次号为" +
                  results.data.resultno,
                 {
                  distinguishCancelAndClose: true,
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定"
                }
                ).then(() => {
                   var el = document.createElement("a");
                    document.body.appendChild(el);
                    // @发送邮箱更新
                    el.href = encodeURI(`mailto:${this.emailInfo.mailto}?subject=${this.emailInfo.mailsubject}&body=${res.resultdic.mailcontent}&cc=${this.emailInfo.mailtolist}`); 
                    el.click();
                    document.body.removeChild(el);
                     //@发送邮箱更新
                    this.dialogVisible = false
                    //@发送邮箱更新
                 
                    this.applyDialogStatus = !this.applyDialogStatus;
                });
                 
                }
               
              })
      })

 
    },
    sendConfirmation() {
      if( this.selectOrderId.length == 0) {
        this.$message.error("请选择结算对象");
      } else {
        this.sendConfirm()
      } 
        
    },
    sendConfirmationIn(){
      if(this.itemsList == "") {
        this.$message.error("请选择服务项目");
      } else if(this.gid == "") {
        this.$message.error("请选择结算对象");
      } else {
        this.sendConfirm()
      }
    },
    //@发送邮箱更新
    handleConfirm(){
      if (!this.emailInfo.mailto) {
        this.$message.error('请填写收件人');
        return;
      }

      if (!this.emailInfo.mailsubject) {
        this.$messasge.error('请填写主题');
        return
      }
        this.generatePicture();
    },
    
    sendConfirm(){
      
       let arr = [];
        if(this.tagStatus == "更改结算对象") {
          this.orderList.forEach(item => {
          arr.push(item.boguid);
        });
        } else {
            this.selectOrderId.forEach(item => {
            arr.push(item.boguid);
          });
        }
        let data = {}
        if( this.tagStatus == "更改结算对象") {
          data = {
            boguidlist: arr.join(","),
            items: this.itemsList  ,
            gid: this.gid 
          }
        } else {
          data = {
            boguidlist: arr.join(","),
          }
        }
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + `api/ExBoBaseWageChangeSettObj`,
          params: data,
          loading: true,
          tip: false
        }).then(res => {
          console.log(res.data);
          
          if(res.data.length == 0) {
            this.$message.error("没有数据");
            this.applyDialogStatus = false
 
          } else {
            this.applyDialogStatus = true;
            const mailto = res.data[0].mailto
            const mailsubject = res.data[0].mailsubject
            this.emailInfo.mailto = mailto
            this.emailInfo.mailsubject = mailsubject
            res.data.forEach(item => {
            JSON.parse(window.wtkhData).forEach(obj => {
              if (item.fid == obj.id) {
                item.fidName = obj.usr_name;
              } else if (item.wagefid == obj.id) {
                item.wagefidName = obj.usr_name;
              } else if (item.wecanfid == obj.id) {
                item.wecanfidName = obj.usr_name;
              }
            });
            item.sum = item.wageList.reduce((accumulator,currentValue) =>accumulator + currentValue.wageall, 0 ).toFixed(2)
          });
          this.outsourceData = res.data;

          }
          arr = []
        });
    },
    closeApplyDialogStatus() {
      this.emailData = []
      this.outsourceData = []
      this.applyDialogStatus = false
      this.fid = ""
      this.itemsList = ""
      this.changeObjectDialog.visible = false
    },
    getChange({ value, data }) {
      console.log(value,data)
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
      this.tagStatus = ""
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
      this.search();
      
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
      var json = {
        json: JSON.stringify(jsonArr2),
        routerName: "conditionExplain"
      };
      console.log(this.searchData);
      this.$axios({
        method: "get",
        url:
          this.$store.state.webApi +
          (this.routername == "hxCostCassify" ||
          this.routername == "kfCostCassify"
            ? "api/ExHpoboAxplineGeneralDomMissDoc"
            : "api/ExHpoboAxplineGeneralMissDoc"),
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
      this.tagStatus = "上传支付确认函";
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
        // this.changeObjectDialog.visible = false;
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
    getSelectOrder(row) {
      console.log(row);
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
  .send_confirmation{
    position: absolute;
    right: 110px;
    top: 20px;
  }
  .confrimUpload {
    position: absolute;
    right: 0;
    top: 20px;
  }
}

.outsourcePayfor {
  width: 100%;
  font-family: "楷体", "楷体_GB2312";
  .outsourceTitle {

    padding: 54px 42%;
    justify-content: center;
  }
  .content {
    width: 100%;

    padding: 10px 178px;
    .content-body {
      span {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        font-size: 18px;
        margin: 20px 0px;
      }
    }
    .content-right {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      margin: 20px 0px;
      position: relative;
      span {
        position: absolute;
        right: 0;
      }
    }

    .orderTitle {
      width: 100%;
      height: 40px;
      padding: 5px 0px;
      color: blue;
      border-bottom: 3px double black;
    }
    .order-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .order-item {
        width: 25%;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
.btn {
  width: 100%;
  display:flex;
  flex-wrap: wrap;
  padding-left: 45%;
}



</style>

<style lang="less">
.custom-required {
    .required-item {
      input {
      background: #fff8ef !important;
      font-size: 16px !important;
    }

    textarea {
      background: #fff8ef !important;
      font-size: 16px !important;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
 

  .no-required {
    input {
      background: initial !important;
    }

    textarea {
      background: initial !important;
      word-wrap: break-word;
    }
  }
}


</style>

