<template>
  <div>
    <!-- {{inputModelData}} -->
    <!-- {{inputModelData.area}} -->
    <!-- {{area}} -->
    <!-- {{inputModelData.serviceList}} -->
    <!-- {{newService}} -->
    <!-- {{tableData}} -->
    <!-- {{addSearchData}}
    {{addModelData}}-->
    <!-- {{serviceList}}
    {{required}}-->
    <commonTable :head="tableHead" :tableData="tableData" isMultiSelect>
      <template slot="listIndex" slot-scope="props">{{Number(props.data.row.listIndex)+1}}</template>
      <template
        slot="wtkhname"
        slot-scope="props"
      >{{props.data.val?props.data.val:getWtkhname(props.data.row.fid)}}</template>
      <template slot="operate" slot-scope="props">
        <i
          class="el-icon-remove-outline"
          style="color:red"
          @click="removeList(1,props.data.row.listIndex)"
        ></i>
      </template>
    </commonTable>
    <div style="display:flex;justify-content:space-between;margin:14px 0;">
      <div class="leftInfo">
        <span>
          合计
          <strong>{{tableData.length}}</strong>票
        </span>
        <span>
          预报件/重/体
          <strong>{{ybjztTotal}}</strong>
        </span>
        <span>
          实际件/重/体
          <strong>{{sjjztTotal}}</strong>
        </span>
      </div>
      <div>
        <!-- <el-button
          type="danger"
          @click="revokeAll"
          v-if="mawbinfo.iscomboine==1&&!mawbinfo.mawb&&mawbinfo.childguid<=0"
        >撤销合并</el-button> -->
         <el-button
          type="danger"
          v-if="tableData.length!=tableData.filter(i=>i.checked).length"
          @click="removeList(2)"
        >撤销合并</el-button>
        <el-button type="primary" @click="addBillDialog=true;addTableData=[]">追加订单</el-button>
      </div>
    </div>

    <div :class="{paneDisabled:mawbinfo.iscomboine==1}">
      <div class="jdetail">
        <div class="jdetail-title" style="display:flex;justify-content:space-bwtween">
          <p>总单信息</p>
          <!-- <el-button @click="dialogFormVisible=true">服务编辑</el-button> -->
        </div>
        <div class="jdetail-c" style="width:1200px">
          <newFormCmpt
            :view-data.sync="inputViewData"
            :model-data.sync="inputModelData"
            :pagetype="2"
            :area="area"
            ref="formcmpt"
            :required.sync="required"
          >
            <template slot="exForm1">
              <hwxzCompt :inputModelData="inputModelData"></hwxzCompt>
            </template>
          </newFormCmpt>
        </div>
      </div>

      <div class="jdetail">
        <div class="jdetail-title">
          <p>总单收发货人信息</p>
        </div>
        <div class="jdetail-c">
          <revSedMawb
            :dzinfo="inputModelData"
            :gidlist="gidlist"
            ref="makeBillRevSed"
            :needSearch="true"
            fieldRequired
          ></revSedMawb>
        </div>
      </div>

      <div style="text-align:right">
        <el-button type="primary" @click="mergeFunc" :disabled="tableData.length <2">多条合并</el-button>
        <el-button type="primary" @click="changeOrderdom(tableData[0].guid)" :disabled="tableData.length >= 2 || (tableData.length>0&&tableData[0].orderdom!=='分单')">转为一主一分</el-button>
        <el-button type="primary" @click="mergeFunc(2)" :disabled="tableData.length < 2">分配至外站</el-button>
      </div>
    </div>

    <el-dialog
      :visible.sync="addBillDialog"
      width="1300px"
      title="追加订单"
      top="4%"
      v-if="addBillDialog"
      :close-on-press-escape="false"
      append-to-body
    >
      <newFormCmpt
        :view-data.sync="addViewData"
        :model-data.sync="addModelData"
        :search-data.sync="addSearchData"
        :pagetype="1"
        :whereTmpShow="false"
      ></newFormCmpt>

      <div style="margin:10px 0px">
        <el-button @click="getListInfo" type="primary">查询</el-button>
        <el-button @click="addBillDialog=false">返回</el-button>
      </div>

      <commonTable :head="addTableHead" :tableData="addTableData" isMultiSelect paginationShow>
        <template
          slot="wtkhname"
          slot-scope="props"
        >{{props.data.val?props.data.val:getWtkhname(props.data.row.fid)}}</template>
      </commonTable>

      <div style="margin:10px 0px;text-align:right">
        <el-button @click="addListInfo" type="primary">确认追加</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="总单服务编辑"
      :visible.sync="dialogFormVisible"
      top="1%"
      append-to-body
      :close-on-click-modal="false"
      width="1200px"
    >
      <div class="detail">
        <div class="detail-c">
          <serviceList
            v-if="inputModelData.serviceList.length>0"
            :newService.sync="newService"
            :opersystem="inputModelData.opersystem"
            pagetype="2"
            :serviceList="inputModelData.serviceList"
            ref="serviceTemp"
            :orderguid="inputModelData.orderguid"
          ></serviceList>
          <div style="text-align:right">
            <!-- <el-button btnnum="480" @click="saveServiceFunc" >保存</el-button> -->
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="qfsjDialog"
      width="1300px"
      top="4%"
      v-if="qfsjDialog"
      :close-on-press-escape="false"
      append-to-body
    >
      <iframe
        :src="qfsjUrl"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height:700px; border: 0px none;"
      ></iframe>
    </el-dialog>

    <!-- 分配 -->
    <el-dialog
      :visible.sync="assignShow"
      :close-on-click-modal="false"
      v-if="assignShow"
      append-to-body
      width="1300px"
      top="0"
      @close="assignShowDelete"
    >
      <fenpei :fenpeiguid="fenpeiguid" @back="assignShowDelete" system="空出" :new-add="1"></fenpei>
    </el-dialog>
  </div>
</template>
<script>
import revSedMawb from "../templates/revSedMawb";
import serviceList from "../orderDetails/serviceList"; //服务列表组件
import fenpei from "./fenpei";
import { getChangeValue } from "../../api/localStorage.js";
import * as fields from "@/common/fields"; //从src 目录下引入
let inputViewData={
        ...fields.sfg,
        ...fields.mdg,
        ...fields.zzg,
        ...fields.deliverydate,
        ...fields.ybpiece,
        ...fields.ybweight,
        ...fields.ybvolume,
        ...fields.smallpiece,
        ...fields.hbh,
        ...fields.hbrq,
        ...fields.qfsj,
        ...fields.yqqcts,
        ...fields.bglx,
        ...fields.bgpiece,
        ...fields.bgweight,
        ...fields.hbzl,        
        ...fields.exForm1,
        ...fields.paymode,
        ...fields.englishpm,
        ...fields.remark,
       // ...fields.ispay_pre
      }
export default {
  props: {
    margeTableData: {
      type: Array,
      default: () => []
    },
    mawbinfo: {
      //如果传入代表是已经合并的订单
      type: Object,
      default: function() {
        return { iscomboine: 2 }; //1是已合并的订单 2否
      }
    }
  },
  components: {
    revSedMawb,
    serviceList,
    fenpei
  },

  data() {
    return {
      qfsjDialog: false,
      qfsjUrl: "",
      dialogFormVisible: false,
      fenpeiguid: "", //分配传值得guid
      assignShow: false, //分配弹窗
      putIndex: -1,
      tableHead: [
        { title: "序号", field: "listIndex" },
        { title: "订舱编号", field: "pono", style: { color: "#165A8A" } },
        { title: "委托客户", field: "wtkhname" },
        { title: "始发港", field: "sfg" },
        { title: "目的港", field: "mdg" },
        { title: "航班号", field: "hbh" },
        { title: "航班日期", field: "hbrq" },
        { title: "航班种类", field: "hbzl" },
        { title: "货物性质", field: "hwxz" },
        { title: "货物类型", field: "hwlx" },
        { title: "订单类型", field: "orderdom" },
        { title: "订单状态", field: "status" },
        { title: "单证状态", field: "dzstatus" },
        { title: "预报件/重/体", field: "ybjzt" },
        { title: "实际件/重/体", field: "sjjzt" },
        { title: "应收运价", field: "freightfee_in" },
        //{ title: "操作", field: "operate" }
      ],
      addTableHead: [
        { title: "订舱编号", field: "pono" },
        { title: "分运单号", field: "hawb", formatType: 2, format: (x => x == 1 || '--') },
        { title: "委托客户", field: "wtkhname" },
        { title: "始发港", field: "sfg" },
        { title: "目的港", field: "mdg" },
        { title: "航班号", field: "hbh" },
        { title: "航班日期", field: "hbrq" },
        { title: "航班种类", field: "hbzl" },
        { title: "货物性质", field: "hwxz" },
        { title: "货物类型", field: "hwlx" },
        { title: "订单类型", field: "orderdom" },
        { title: "订单状态", field: "status" },
        { title: "单证状态", field: "dzstatus" },
        { title: "预报件/重/体", field: "ybjzt" }
      ],
      tableData: [],
      addTableData: [],
      required: "",
      inputViewData: inputViewData,
      homeInformation: {
        fid: {
          title: "委托客户：",
          type: 11,
          required: true,
          contentStyle: {
            display: "flex"
          },
          itemStyle: { width: "560px" },
          linkage: "gid",
          disabled: false
        },
        gid: {
          title: "项目：",
          type: 10,
          itemStyle: { width: "560px" },
          required: true,
          contentStyle: { display: "flex" },
          disabled: false,
          showCustomerRel: true
        },
        khjcno: {
          title: "进仓编号：",
          type: 1,
          required: true,
          titleStyle: { fontWeight: "700" },
          placeholder: "与其他业务可自动关联"
        },
        piece: { title: "件数：", type: 1, required: true, verify: "integer" },
        weight: { title: "重量：", type: 1, required: true, verify: "float" },
        volume: { title: "体积：", type: 1, verify: "float" },
        mawb: { title: "总运单号：", type: 1, required: false },
        hawb: { title: "分运单号：", type: 1, required: false },
        sfg: { title: "始发港：", type: 20, verify: "sfgmdg", pagetype: 6 },
        mdg: { title: "目的港：", type: 20, verify: "sfgmdg", pagetype: 6 },
        dzlx: {
          title: "单证类型：",
          type: 3,
          options: [
            { label: "总单", value: "总单" },
            { label: "直单", value: "直单" }
          ]
        },
        jfweight: { title: "计费重量：", type: 1 },
        accountweightin: { title: "结算重量：", type: 1 }
      },
      addViewData: {
        fid: { title: "委托客户", type: 14 },
        pono: { title: "订舱编号", type: 1 },
        hawb: { title: "分运单号", type: 1 },
        hbrq: { title: "航班日期", type: 15 },
        // sfg: { title: "始发港", type: 1, disabled: true },
        mdg: { title: "目的港", type: 1 },
        // hbh: { title: "航班号", type: 1 }
        addman:{title:"创建人",type:1}
      },
      addModelData: {},
      addSearchData: {},
      inputModelData: {
        guid: -1,
        opersystem: "出口",
        realpiece: 0,
        mawb: "",
        czlx: "自货",
        orderno: "",
        hawb: "",
        fid: "",
        gid: "",
        sfg: "",
        mdg: "",
        zzg: "",
        deliverydate: "",
        realpiece: "",
        realweight: "",
        realvolume: "",
        ybpiece: "",
        ybweight: "",
        ybvolume: "",
        smallpiece: "",
        hbh: "",
        hbrq: "",
        qfsj: "",
        yqqcts: "",
        hbzl: "全部",
        exForm1: "",
        paymode: "PP",
        englishpm: "CONSOL",
        //  chinesepm: "",
        hwxz: "普货",
        hwlx: "普货",
        // batterymodel: "",
        // tradeterm: "CIF",
        area: this.$store.state.areaState,
        companytitle_fhr_mawb: "",
        address_fhr_mawb: "",
        companycode_fhr_mawb: "",
        state_fhr_mawb: "",
        city_fhr_mawb: "",
        postcode_fhr_mawb: "",
        lxr_fhr_mawb: "",
        phone_fhr_mawb: "",
        fax_fhr_mawb: "",
        email_fhr_mawb: "",
        taxcode_fhr_mawb: "",
        companytitle_shr_mawb: "",
        address_shr_mawb: "",
        companycode_shr_mawb: "",
        state_shr_mawb: "",
        city_shr_mawb: "",
        postcode_shr_mawb: "",
        lxr_shr_mawb: "",
        phone_shr_mawb: "",
        fax_shr_mawb: "",
        email_shr_mawb: "",
        taxcode_shr_mawb: "",
        serviceList: []
      },
      addBillDialog: false,
      searchData: {},
      newService: {},
      ybjztTotal: "",
      sjjztTotal: ""
    };
  },
  methods: {
    assignShowDelete(type) {
      this.assignShow = false;
      this.$emit("success", true);
    },
    revokeAll(type, index) {
      //type 1单票移除 2多票移除
      this.$confirm("请确认操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let arr = [];
        if (type == 1) {
          arr = [this.tableData[index]];
        } else {
          arr = this.tableData.filter(i=>i.checked);
        }

        let getValue = name => {
          if (type == 1) {
            return (
              this.tableData.reduce((prev, i) => (prev += Number(i[name])), 0) -
              Number(arr[0][name] || 0)
            );
          } else {
            return 0;
          }
        };
        //  console.log(getValue('ybpiece'));return;
        let json = {
          czman: localStorage.usrname,
          hpoguid: this.mawbinfo.guid,
          hpoboguid: this.mawbinfo.boguid,
          guids: arr.map(i => i.guid).toString(),
          boguids: arr.map(i => i.boguid).toString(),
          ybpiece: getValue("ybpiece"),
          ybweight: Number(getValue("ybweight")).toFixed(2),
          ybvolume: Number(getValue("ybvolume")).toFixed(3),
          realpiece: getValue("realpiece"),
          realweight: Number(getValue("realweight")).toFixed(2),
          realvolume: Number(getValue("realvolume")).toFixed(3)
        };
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/cancelBobase",
          data: json,
          loading: true,
          tip: false,
          nofield: 1
        }).then(results => {
          console.log(results);
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            //  this.getComboineInfo();
            if (type == 1) {
              this.$emit("success", true);
            } else {
              this.$emit("success", false);
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      });
    },
    removeList(type,index) {
      //操作中的撤销
      if(type==1){

        if (this.mawbinfo.iscomboine == 1) {
          this.revokeAll(1, index);
        } else {
          this.tableData.splice(index, 1);
        }

      }else{
       //撤销合并
          let indexArr=this.tableData.filter(i=>i.checked).map(i=>i.index);
          if(indexArr.length==0){
                  return this.$message.error('请先选择要撤销的数据');
          }
           if(this.mawbinfo.iscomboine==1&&!this.mawbinfo.mawb&&this.mawbinfo.childguid<=0){
                  this.revokeAll(2);
           }else{
             this.tableData=this.tableData.filter(i=>!i.checked);
           }
      }

    },
    resetFunc() {
      (this.inputModelData = {}), (this.putIndex = -1);
    },
    getListInfo(type) {
      //追加时的查询
      var json = {};
      let search = JSON.parse(JSON.stringify(this.addSearchData));
      search.czlx = "自货";
      search.mawb = "";
      search.system = "空出";
      search.status = this.tableData[0].statusNumber;
      search.area = this.tableData[0].area;
      search.dzstatus = this.tableData[0].dzstatusNumber;
    //  search.gid = this.tableData[0].gid;
      search.isinwageallin = { unequal: 4 };
      search.comboine = 1;
      search.iscomboine = 2;
      search.canceling = 0;
      search.orderguid=-1;

      let ponoArr = this.tableData.map(i => i.pono);

      var jsonArr = { where: search };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoboAxplineGeneral",
        params: { json: JSON.stringify(jsonArr) },
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        if (results.data.length == 0) {
          this.addTableData = [];
          return this.$message.error("无查询数据");
        }
        let data = getChangeValue(results.data, "空出");
        data.forEach(i => {
          if (ponoArr.includes(i.pono)) {
            i.checkboxdisable = true;
          }
        });
        this.addTableData = data;
      });
    },
    searchServiceList(boguids) {
      //获取服务列表
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/GetServiceCombine",
        params: { boguids: boguids },
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        //  console.log(results.data);
        this.inputModelData.serviceList = results.data;
        this.$refs.serviceTemp && this.$refs.serviceTemp.initFunc(results.data);
      });
    },
    addListInfo() {
      //确认追加
      if (this.addTableData.filter(i => i.checked).length == 0) {
        this.$message.error("请先选择");
      } else {
        let arr = this.addTableData.filter(i => i.checked);
        if (this.mawbinfo.iscomboine == 2) {
          this.tableData = this.tableData.concat(arr);
          this.addBillDialog = false;
        } else {
          let json = {
            hpoboguid: this.mawbinfo.boguid,
            hpoguid: this.mawbinfo.guid,
            czman: localStorage.usrname,
            guids: arr.map(i => i.guid).toString(),
            boguids: arr.map(i => i.boguid).toString(),
            gids: [...new Set(arr.map(i => i.gid))].toString(),
            fids: [...new Set(arr.map(i => i.fid))].toString(),
            ybpiece: arr.reduce((prev, i) => (prev += Number(i.ybpiece)), 0),
            ybweight: arr.reduce((prev, i) => (prev += Number(i.ybweight)), 0),
            ybvolume: arr.reduce((prev, i) => (prev += Number(i.ybvolume)), 0),
            realpiece: arr.reduce(
              (prev, i) => (prev += Number(i.realpiece)),
              0
            ),
            realweight: arr.reduce(
              (prev, i) => (prev += Number(i.realweight)),
              0
            ),
            realvolume: arr.reduce(
              (prev, i) => (prev += Number(i.realvolume)),
              0
            )
          };
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/addBobase",
            data: json,
            loading: true,
            tip: false,
            nofield: 1
          }).then(results => {
            console.log(results);
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.addBillDialog = false;
              this.$emit("success", true);
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        }
      }
    },
    mergeFunc(type) {
      //确认合并 type 2分配至外站
      // if (this.tableData.length < 2) {
      //   this.$message.error("至少需要两条数据方可合并！");
      //   return;
      // }

      let arr = this.tableData;

    if (arr.filter(i => i.orderdom == '总单' || i.orderdom == '直单' ).length >= 2) {
        return this.$message.error('包含有两个及两个以上的总单或直单，不能合并！');
      }
      
      let obj = {
        companytitle_shr_mawb: { cname: "总单收货人" },
        companytitle_fhr_mawb: { cname: "总单发货人" },
        companytitle_shr_hawb: { cname: "分单收货人" },
        companytitle_fhr_hawb: { cname: "分单发货人" },
        hwlx: { cname: "货物类型" },
        hwxz: { cname: "货物性质" },
        sfg: { cname: "始发港" },
        hbzl: { cname: "航班种类" },
        status: { cname: "订单状态" },
        dzstatus: { cname: "单证状态" },
        // orderdom: { cname: "订单类型" }
      };
      let arr2 = Object.keys(obj);
      for (let e in arr2) {
        for (let i in arr) {
          let k = arr2[e];
          if (i == 0) {
            obj[k].val = arr[0][k];
          } else {
            if (arr[i][k] != obj[k].val) {
              return this.$message.error(obj[k].cname + "必须相同才能合并");
            }
          }
        }
      }

      if (this.required) {
        return this.$message.error("请填写" + this.required);
      }

      if (this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit()) {
        this.$message.error(this.$refs.makeBillRevSed.ifHasLimit());
        return;
      }

      let json = this.inputModelData;
      json.czman = localStorage.usrname;
      json.guids = this.tableData.map(i => i.guid).toString();
      json.boguids = this.tableData.map(i => i.boguid).toString();
      json.gids = [...new Set(this.tableData.map(i => i.gid))].toString();
      json.fids = [...new Set(this.tableData.map(i => i.fid))].toString();

      if (json.area == this.conditionalAreaForBuild) {
        json.nodecode = "AO5025";
        json.islocal = 1;
      } else {
        json.nodecode = "AO5020";
        json.islocal = 2;
      }
      //  json.serviceList = this.serviceList;
      // console.log(json);return;
      if(type==2){
        json.islocal = 2;
      }

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/comboineBobase",
        data: json,
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        console.log(results);
        if (results.data.resultstatus == 0) {
          // this.$message.error(results.data.resultmessage);
          this.$alert(results.data.resultmessage, "提示", {
            distinguishCancelAndClose: true,
            dangerouslyUseHTMLString: true,
            confirmButtonText: "确定"
          }).then(() => {
            if (type == 2) {
              this.assignShow = true;
              this.fenpeiguid = results.data.resultguid;
            } else {
              this.$emit("success", true);
            }
          });
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    getComboineInfo() {
      //获取合并前的初始订单
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: { groupid: this.mawbinfo.boguid },
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        // console.log(results)
        this.tableData = getChangeValue(results.data, "空出");
      });
    },
    getWtkhname(fid) {
      let wtkh = this.wtkhArr;
      let wtkhname = "";
      for (let n in wtkh) {
        let i = wtkh[n];
        if (i.id == fid) {
          wtkhname = i.usr_name;
        }
      }
      return wtkhname;
    }
  },
  computed: {
    gidlist(){
       return [...new Set(this.tableData.map(i=>i.gid))].toString()
    },
    wtkhArr() {
      return getxmdata("wtkh");
    },
    area() {
      return this.mawbinfo.area || this.$store.state.areaState;
    },
    serviceList() {
      var serviceList = [];
      for (let i in this.newService) {
        let item = this.newService[i];
        serviceList.push({
          servicecode: item.servicecode,
          oprequest: item.oprequest,
          isdel: item.model ? 1 : 2
        });
      }
      return serviceList;
    },
    checkRequier() {
      //检查是否必填，除备注外全部必填
      var require = "";

      Object.keys(this.inputModelData)
        .reverse()
        .forEach(i => {
          if (!this.inputModelData[i]) {
            this.tableHead.forEach(item => {
              if (i == item.field) {
                require = item.title;
              }
            });
          }
        });
      return require;
    }
  },
  created() {
    /*    this.dialogFormVisible = true;
    this.$nextTick(() => {
      this.dialogFormVisible = false;
    }); */
    if (this.mawbinfo.iscomboine == 1) {
      this.inputModelData = this.mawbinfo;
      this.getComboineInfo();
    } else {
      this.tableData = JSON.parse(JSON.stringify(this.margeTableData));
    }
   // this.getQfsj();
   this.$nextTick(()=>{
     this.$refs.formcmpt&&this.$refs.formcmpt.getQfsj()
   })
  },
  watch: {
    mawbinfo() {
      this.inputModelData = this.mawbinfo;
      this.getComboineInfo();
    },
    tableData: {
      handler(val) {
        if (val.length == 0) return;
        let ybpiece = 0,
          ybweight = 0,
          ybvolume = 0,
          realpiece = 0,
          realweight = 0,
          realvolume = 0;
        let boguids = [];
        let mdgOptions = [];
        let hbrq = val[0].hbrq;
        val.forEach((i, k) => {
          ybpiece += Number(i.ybpiece);
          ybweight += Number(i.ybweight);
          ybvolume += Number(i.ybvolume);
          realpiece += Number(i.realpiece);
          realweight += Number(i.realweight);
          realvolume += Number(i.realvolume);
          i.listIndex = Number(k);
          i.freightfee_in = i.freightfee_in == "NaN" ? "--" : i.freightfee_in;
          boguids.push(i.boguid);
          if (mdgOptions.filter(e => e.value == i.mdg).length == 0) {
            mdgOptions.push({ label: i.mdg, value: i.mdg });
          }
          if (new Date(i.hbrq) < new Date(hbrq)) {
            hbrq = i.hbrq;
          }
        });
        this.inputViewData.hbrq.pickerOptions = {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < new Date(hbrq).getTime();
          }
        };
        this.sjjztTotal = `${realpiece}/${Number(realweight).toFixed(
          2
        )}/${Number(realvolume).toFixed(3)}`;
        this.ybjztTotal = `${ybpiece}/${Number(ybweight).toFixed(2)}/${Number(
          ybvolume
        ).toFixed(3)}`;
        this.inputModelData.ybpiece = ybpiece;
        this.inputModelData.ybweight = Number(ybweight).toFixed(2);
        this.inputModelData.ybvolume = Number(ybvolume).toFixed(3);

        this.inputModelData.realpiece = realpiece;
        this.inputModelData.realweight = Number(realweight).toFixed(2);
        this.inputModelData.realvolume = Number(realvolume).toFixed(3);
        /*    if (boguids.length > 0&&this.mawbinfo.iscomboine!=1) {
          this.searchServiceList(boguids.toString());
        } */
        this.inputModelData.sfg = val[0].sfg;
        this.inputModelData.hbzl = val[0].hbzl;
        this.inputModelData.hwxz = val[0].hwxz;
        this.inputModelData.hwlx = val[0].hwlx;
       // this.inputModelData.gid = val[0].gid;
        this.addModelData.sfg = val[0].sfg;
        // this.inputViewData.mdg.options = mdgOptions;
        // if (mdgOptions.length == 1) {
        //   this.inputModelData.mdg = mdgOptions[0].value;
        // }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.leftInfo {
  span {
    margin-right: 20px;
  }
}
strong {
  color: #165a8a;
  margin: 0 4px;
}
.paneDisabled {
  cursor: not-allowed;
  > div {
    pointer-events: none;
  }
}
</style>


