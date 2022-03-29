<template>
  <div>
    <div :class="{disabled:(!$store.state.rwxdArr.includes(servicecode)&&area==conditionalAreaForBuild)}">
      <myAlert :servicecode="servicecode"></myAlert>

      <!-- {{tableData}} -->
      <!-- {{mawbinfo}} -->
      <!-- {{area}} -->
      <!-- {{serviceViewData}} -->
      <!-- {{required}} -->
      <!-- {{inputModelData}} -->
      <!-- {{listView[servicecode]}} -->
      <!-- {{inputModelData.khjcnoArr}} -->
      <!-- {{mawbinfo}} -->
      <!-- {{saveNumberList}} -->
      <el-form
        ref="form"
        label-width="110px"
        :inline="true"
        style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap"
      >
        <el-row style="padding-left:36px;width:560px;">
          <el-form-item>
            <div class="input-title" style="display:inline-block">进仓编号：</div>
            <el-select
              placeholder="请选择"
              multiple
              size="mini"
              v-model="inputModelData.khjcnoArr"
              style="width:166px"
              @change="hawbSelFunc"
              class="input-required"
            >
              <li @click="selmultiAll()" style="font-weight: bold;"
                :style="{color:inputModelData.khjcnoArr.length == saveNumberList.length?'#409EFF':''}">
                <span style="cursor:pointer;user-select: none;;display:block;margin:5px 0px 5px 20px;">全选<i style="margin-left:5px"
                    class="el-icon-check"></i></span>
              </li>
              <li>
                <span style="float: left;margin-left:20px;">进仓编号</span>
                <span style="float: right;margin-right:30px;">
                  <i class="imul">件</i>/
                  <i class="imul">重</i>/
                  <i class="imul">体</i>
                </span>
              </li>
              <el-option
                v-for="numitem in saveNumberList"
                :key="numitem.guid"
                :label="numitem.khjcno"
                :value="numitem.khjcno"
                style="width:300px;height:28px"
              >
                <!-- v-if="!selOptionShow(numitem.khjcno)" -->

                <span style="float: left">{{ numitem.khjcno }}</span>
                <span style="float: right;margin-right:10px;">
                  <i class="imul">{{ numitem.piece }}</i>/
                  <i class="imul">{{ numitem.weight }}</i>/
                  <i class="imul">{{ numitem.volume }}</i>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="件/重/体：" style="margin-bottom:0px;margin-left:4px;">
            <span>{{ `${inputModelData.piece || '--'}/${inputModelData.weight || '--'}/${inputModelData.volume || '--'}` }}</span>
          </el-form-item>
        </el-row>

        <newFormCmpt
          v-show="$store.state.rwxdArr.includes(servicecode)&&area==conditionalAreaForBuild||!projectIsWecan"
          :view-data.sync="myinfo"
          :model-data.sync="inputModelData"
          :pagetype="2"
          :area="area"
        ></newFormCmpt>
      </el-form>

      <newFormCmpt
        style="max-width:1300px"
        :view-data.sync="serviceViewData[servicecode+'ViewData']"
        :model-data.sync="inputModelData"
        :pagetype="2"
        :required.sync="required"
        :area='area'
      >
        <template :slot="listView[servicecode]">
          <newFormCmpt
            :view-data.sync="listView[servicecode+'View']"
            :model-data.sync="item"
            pagetype="2"
            v-for="(item,index) in inputModelData[listView[servicecode]]"
            :key="index"
            :area='area'
          >
            <slot slot="btn">
              <i
                @click="listform(index,servicecode)"
                style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;margin-left:30px;"
                :style="{color:index!=0?'red':'#67C23A'}"
                :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                :title="index!=0?'删除此条':'新增一条'"
              ></i>
            </slot>
          </newFormCmpt>
        </template>
      </newFormCmpt>

      <div style="margin:12px 40px;text-align: right;">
        <el-button type="primary" @click="saveListInfo">保存并下达</el-button>
        <el-button @click="resetFunc">取消</el-button>
      </div>

      <commonTable
        class="commonTable"
        :head="tableHead"
        :table-data="tableData"
        style="margin-top:8px;"
      >
        <!-- <template slot="operate" slot-scope="props">
             <i class="el-icon-setting" @click="setListInfo(props.data.index)">修改</i>
           <i class="el-icon-delete" @click="delListInfo(props.data.index)">删除</i>
        </template>-->
        <template slot="status" slot-scope="props">{{getStatus(props.data.value)}}</template>
        <template slot="costwage" slot-scope="props">{{props.data.row.servicecontentlist.reduce((prev, i) => (prev += Number(i.costwage)), 0)}}</template>
        <template slot="saleswage" slot-scope="props">{{props.data.row.servicecontentlist.reduce((prev, i) => (prev += Number(i.saleswage)), 0)}}</template>
        <template
          slot="ifws"
          slot-scope="props"
        >{{!props.data.row.gid||props.data.row.gid==-1?'我司':"非我司"}}</template>
        <template slot="gid" slot-scope="props">{{getGysName(props.data.value)||'--'}}</template>

        <template slot="operate" slot-scope="props">
          <span
            @click="setListInfo(props.data.index)"
            style="cursor:pointer;color:blue"
            v-if="props.data.row.status!==500&&serviceAsignarea&&!orderFinish"
          >编辑</span>
          <span
            @click="delListInfo(props.data.index)"
            style="cursor:pointer;color:blue"
            v-if="props.data.row.status!==500&&serviceAsignarea&&!orderFinish"
          >{{props.data.row.old_hpoid>0?'解绑':'删除'}}</span>
          <span
            style="cursor:pointer;color:blue"
            v-if="props.data.row.old_sendhpoid<0&&props.data.row.old_hpoid<0&&serviceAsignarea&&!orderFinish"
            @click="serviceFinishFunc(props.data.row,props.data.index)"
            :class="{pointerAll:props.data.row.status==500}"
          >{{props.data.row.status==100?'任务完成':'取消完成'}}</span>
          <span v-if="!serviceAsignarea||orderFinish">--</span>
          <!-- <span  @click="taskDelivery(props.data.index)" style="cursor:pointer;color:blue" v-if="props.data.row.old_hpoid<0&&$store.state.rwxdArr.includes(servicecode)&&area==conditionalAreaForBuild&&props.data.row.old_sendhpoid >0">{{props.data.row.old_sendhpoid >0?'取消下达':'任务下达'}}</span> -->
          <!-- <span  @click="outStock(props.data.index)" style="cursor:pointer;color:blue" v-if="servicecode=='AA0810'">出库</span> -->
        </template>
        <template slot="contentList" slot-scope="props">
          <commonTable
            :head="listView[servicecode+'TableHead']"
            :showHead="false"
            :table-data="props.data.row[listView[servicecode]]"
            style="padding:0px;"
            divStyle="padding-bottom: 0px;"
          ></commonTable>
        </template>
      </commonTable>

      <el-dialog
        :visible.sync="dialogCk"
        class="dialogImgDoc"
        v-if="dialogCk"
        width="1200px"
        append-to-body
        top="2%"
      >
        <iframe
          :src="ckUrl"
          frameborder="0"
          allowtransparency="true"
          style="width: 100%; height: 100%; border: 0px none;"
        ></iframe>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { formatDate } from "../../api/localStorage";
import {serviceSplit} from '../mixins/service'
export default {
  props: {
    saveNumberList: {
      type: Array,
      default() {
        return [];
      }
    },
    servicecode: String,
    mawbguid: String,
    mawbinfo:Object,
    boguid: {
      type: String,
      default: ""
    },
    area: String,
    hasData: [Boolean, String],
    pono: String,
    ordertype: {
      type: [Number, String],
      default: 1
    }, //订单 1本站 2操作站 3销售站
    orderFinish: {
      type: Boolean,
      default: false
    }
  },
  mixins:[serviceSplit(3)],
  components: {},
  data() {
    return {
      disabled: false,
      putIndex: -1,
      required: "",
      tableData: [],
      myinfo: {
        ifws: {
          title: "操作地：",
          type: 3,
          options: [{ label: "我司", value: 1 }, { label: "非我司", value: 2 }]
        },
        gid: {
          title: "供应商：",
          type: 20,
          pagetype: 3,
          itemStyle: { width: "280px" },
          required: true
        }
      },
      inputModelData: {
        appraisaltype_chem: "代取鉴定",
        // storearea_chem:this.area,
        // storearea_inspect:this.area,
        isstore_inspect: 1,
        isstore_chem: 1,
        servicecontentlist: [{ clothtype: "", clothstd: "" }],
        khjcnoArr: [],
        ifws:
          this.$store.state.rwxdArr.includes(this.servicecode) ||
          this.servicecode == "AA0230" ||
          this.servicecode == "AA0240"
            ? 1
            : 2
      },
      ckUrl: "",
      dialogCk: false
    };
  },
  methods: {
    getStatus(val) {
      let str = "未完成";
      switch (val) {
        case 100:
          str = "未完成";
          break;
        case 300:
          str = "已分配";
          break;
        case 400:
          str = "已确认";
          break;
        case 500:
          str = "已完成";
          break;
        default:
          break;
      }
      return str;
    },
    getGysName(id) {
      if (!id || id == -1) {
        return "--";
      } else {
        let data =
          JSON.parse(localStorage.getItem("gysxm")) ||
          JSON.parse(sessionStorage.getItem("gysxm")) ||
          getxmdata("gysxm") ||
          [];
        // console.log(data)
        let usr_name = "";
        data.forEach(i => {
          if (i.id == id) {
            usr_name = i.usr_name.split("-")[1];
          }
        });
        return usr_name;
      }
    },
    hawbSelFunc(val) {
      //选中进仓编号
      var piece = 0;
      var weight = 0;
      var volume = 0;
      val.forEach(item => {
        this.saveNumberList.forEach(element => {
          if (item == element.khjcno) {
            piece += Number(element.piece);
            weight += Number(element.weight);
            volume += Number(element.volume);
          }
        });
      });

      this.inputModelData.piece = piece;
      this.inputModelData.weight = Number(weight).toFixed(2);
      this.inputModelData.volume = Number(volume).toFixed(3);
    },
    selOptionShow(item) {
      //判断进仓编号是否已经使用
      let isUse = false;
      this.tableData.forEach((element, i) => {
        if (
          element.khjcno &&
          element.khjcno.split(",").includes(item) &&
          this.putIndex != i
        ) {
          isUse = true;
        }
      });
      return isUse;
    },
    resetFunc() {
      (this.inputModelData = {
        appraisaltype_chem: "代取鉴定",
        storearea_chem: this.area,
        storearea_inspect: this.area,
        isstore_inspect: 1,
        isstore_chem: 1,
        servicecontentlist: [
          {
            clothtype: "",
            clothstd: "",
            packagetype: "",
            packagestyle: "",
            materialpm: "",
            materialstd: "",
            num: "",
            wagetype: "",
             costwage: '',
             saleswage: ''
          }
        ],
        khjcnoArr: [],
        ifws:
          this.$store.state.rwxdArr.includes(this.servicecode) ||
          this.servicecode == "AA0230" ||
          this.servicecode == "AA0240"
            ? 1
            : 2
      }),
        (this.putIndex = -1);
    },
    getListInfo() {
      this.putIndex=-1;
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExYsService",
        params: { sid: this.mawbguid, servicecode: this.servicecode },
        loading: true,
        tip: false
      }).then(results => {
        //   console.log("增值信息")
        //   console.log(results.data)
        this.tableData = results.data.filter(i => {
          return i.servicecode == this.servicecode;
        });
      });
    },

    saveListInfo() {
      if (this.inputModelData.khjcnoArr.length == 0) {
        this.$message.error("请选择客户进仓编号！");
        return;
      }

      if (this.required) {
        this.$message.error("请填写" + this.required);
        return;
      }
      if (
        this.$store.state.rwxdArr.includes(this.servicecode) &&
        this.area == this.conditionalAreaForBuild
      ) {
        if (
          this.inputModelData.ifws == 2 &&
          (this.inputModelData.gid == -1 || !this.inputModelData.gid)
        ) {
          this.$message.error("请选择供应商！");
          return;
        }
      } else {
        //外站
        this.inputModelData.ifws = 2;
        this.inputModelData.gid = 1;
      }

      if (this.inputModelData.ifws == 1) {
        this.inputModelData.gid = -1;
      }
      let json = JSON.parse(JSON.stringify(this.inputModelData));
       if(this.mawbinfo.groupid>0&&this.mawbinfo.groupid!=this.mawbinfo.boguid){
          json.sid = this.mawbinfo.grouphpoguid;
          json.oldhpoid = this.mawbguid;
       }else{
          json.sid = this.mawbguid;
          json.oldhpoid = this.mawbinfo.grouphpoguid;
       }

      json.servicecode = this.servicecode;
      json.khjcno = json.khjcnoArr.join(",");
      json.boguid = this.boguid;
      let method = "";
      if (this.putIndex == -1) {
        method = "post";
      } else {
        method = "put";
      }
      let listViewData = json[this.listView[this.servicecode]];
      if (this.servicecode == "AG0120") {
        //  listViewData=listViewData.filter(i=>i.packagetype&&i.packagestyle)
        if (
          listViewData.filter(
            (i => i.packagetype && !i.packagestyle) ||
              (!i.packagetype && i.packagestyle)
          ).length > 0
        ) {
          this.$message.error("请选择改包装方式和改包装类型");
          return;
        }
        listViewData = listViewData.filter(
          i => i.packagetype && i.packagestyle
        );
      }

      if (this.servicecode == "AG0130") {
        if (
          listViewData.filter(
            (i => i.clothtype && !i.clothstd) || (!i.clothtype && i.clothstd)
          ).length > 0
        ) {
          this.$message.error("请选择挂衣规格");
          return;
        }
        listViewData = listViewData.filter(i => i.clothtype && i.clothstd);
      }
      if (this.servicecode == "AA0810") {
        if (
          listViewData.filter(
            i =>
              (i.materialpm && (!i.materialstd || !i.num || !i.wagetype)) ||
              (i.materialstd && (!i.materialpm || !i.num || !i.wagetype)) ||
              (i.num && (!i.materialstd || !i.materialpm || !i.wagetype)) ||
              (i.wagetype && (!i.materialstd || !i.num || !i.materialpm))
          ).length > 0
        ) {
          this.$message.error("请填写材料品名，材料规格，数量，结算方式");
          return;
        }
        listViewData = listViewData.filter(
          i => i.materialpm && i.materialstd && i.num && i.wagetype
        );
      }

      json[[this.listView[this.servicecode]]] = listViewData;

      this.$axios({
        method: method,
        url: this.$store.state.webApi + "api/ExYsService",
        data: json,
        loading: true,
        tip: false
      }).then(results => {
        console.log(results.data);
        if (results.data.resultstatus == 0) {
          if (results.data.resultno) {
            this.$message.success(
              `操作成功，订单已自动下达，编号为${results.data.resultno}`
            );
          } else {
            this.$message.success(results.data.resultmessage);
          }
          this.resetFunc();
          this.getListInfo();
          if (this.$store.state.rwxdArr.includes(this.servicecode)) {
            this.$emit("success", true);
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    setListInfo(index) {
      this.putIndex = index;

      this.$nextTick(() => {
        this.inputModelData = JSON.parse(JSON.stringify(this.tableData[index]));
        this.$set(
          this.inputModelData,
          "khjcnoArr",
          this.inputModelData.khjcno
            ? this.inputModelData.khjcno.split(",")
            : []
        );
        this.hawbSelFunc(this.inputModelData.khjcnoArr);
        if (
          this.servicecode == "AG0130" ||
          this.servicecode == "AG0120" ||
          this.servicecode == "AA0810"
        ) {
          this.inputModelData[this.listView[this.servicecode]] =
            this.inputModelData[[this.listView[this.servicecode]]].length > 0
              ? this.inputModelData[[this.listView[this.servicecode]]]
              : [
                  {
                    clothtype: "",
                    clothstd: "",
                    packagetype: "",
                    packagestyle: "",
                    materialpm: "",
                    materialstd: "",
                    num: "",
                    wagetype: "",
                     costwage: '',
                      saleswage: ''
                  }
                ];
        }
        this.$set(
          this.inputModelData,
          "ifws",
          this.inputModelData.gid && this.inputModelData.gid != -1 ? 2 : 1
        );
      });

      //  this.disabled=false;
    },
    delListInfo(index) {
      let json = JSON.parse(JSON.stringify(this.tableData[index]));
      let str =
        json.old_hpoid > 0
          ? "将取消绑定，并退回到工作号：" + json.old_pono
          : "确认删除？";

      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delFunc(index);
      });
    },
    delFunc(index) {
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExYsService",
        data: {
          guid: this.tableData[index].guid,
          sid: this.tableData[index].sid,
          old_hpoid: this.tableData[index].old_hpoid,
          old_pono: this.tableData[index].old_pono,
          servicecode: this.servicecode,
          boguid: this.boguid
        },
        loading: true,
        tip: false,
        noarea: true
      }).then(results => {
        //console.log(results)
        if (results.data.resultstatus == 0) {
          this.tableData.splice(index, 1);
          this.putIndex = -1;
          if (this.$store.state.rwxdArr.includes(this.servicecode)) {
            this.$emit("success", true);
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    taskDelivery(index) {
      //任务下达,提货的下达与其他服务下达接口不同
      let url =
        this.tableData[index].old_sendhpoid > 0
          ? "api/BoAEToBoGn/CancelSend"
          : ["AA0510"].includes(this.servicecode)
          ? "api/BoAEToBoGn/YsStore"
          : "api/BoAEToBoGn/Other";
      let json = {
        boguid: this.boguid,
        serviceguid:
          this.tableData[index].old_sendhpoid > 0
            ? this.tableData[index].old_sendhpoid
            : this.tableData[index].guid,
        servicecode: this.servicecode,
        khjcno: this.tableData[index].khjcno
      };

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + url,
        data: json,
        loading: true,
        tip: false,
        nofield: true
      }).then(results => {
        console.log(results);
        if (results.data.resultstatus == 0) {
          this.getListInfo();
          this.$emit("success", true);
          this.$message.success(results.data.resultmessage);
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    outStock(index, index2) {
      //出库
      let data = this.tableData[index2];
      let pg = data.servicecontentlist[index];
      // console.log(data,pg);
      let pm = JSON.parse(localStorage.groupType).filter(
        i => i.groupid == -10 && i.typename == pg.materialpm
      )[0];
      let gg = JSON.parse(localStorage.groupType).filter(
        i => i.groupid == -20 && i.typename == pg.materialstd
      )[0];
      // http://192.168.0.115/WffProductionManagement/anonymous/frmBognOutStore.aspx?boguid=boguid&pono=bogn号&pcode=品名代码&pname=品名&pnameid=品名id&gnameid=规格id&addman=添加人&area=流向区域中文&dir=流向中文&num=数量
      let url = `${this.$store.state.imgWebApi}WffProductionManagement/anonymous/frmBognOutStore.aspx?boguid=${this.boguid}&pono=${this.pono}&pcode=${pm.ready01}&pname=${pg.materialpm}&pnameid=${pm.id}&gnameid=${gg.id}&addman=${localStorage.usrname}&area=${data.flowarea_cltg}&dir=${data.flowpoint_cltg}&num=${pg.num}`;
      this.dialogCk = true;
      this.ckUrl = url;
      //  console.log(url)
    },
    checkComplete(index) {
      let servicecode = this.servicecode;
      let data = this.tableData[index].servicecontentlist;
      if (
        servicecode == "AG0120" &&
        data.filter(i => !i.packagestyle).length > 0
      ) {
        this.$message.error("请填写改包装服务的完整信息!");
        return;
      }
      // if (
      //   servicecode == "AA0810" &&
      //   data.filter(i => !i.materialpm || !i.materialstd).length > 0
      // ) {
      //   this.$message.error("请填写材料提供服务的完整信息!");
      //   return;
      // }

      if (
        servicecode == "AG0130" &&
        data.filter(i => !i.clothtype || !i.clothstd).length > 0
      ) {
        this.$message.error("请填写挂衣服务的完整信息!");
        return;
      }
      return true;
    },
    serviceFinishFunc(row, index) {
      let data = {
        servicecode: this.servicecode,
        guid: row.guid,
        boguid: this.boguid,
        czman: localStorage.usrname,
        nodeman: row.status == 100 ? localStorage.usrname : "",
        servicetype:
          this.servicecode == "AA0510" || this.servicecode == "AB0520" ? 1 : 2
      };

      console.log(data);

      if (row.status == 100 && !this.checkComplete(index)) return;

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/BoAEToBoGn/Finish",
        data: data,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.getListInfo();
          this.$emit("success", true);
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
      selmultiAll() {
      //下拉全选
      let saveNumberList = this.saveNumberList
      //  let saveNumberList = this.saveNumberList.filter(i => !this.selOptionShow(i.khjcno))
      if (this.inputModelData.khjcnoArr.length == saveNumberList.length) {
        this.inputModelData.khjcnoArr = [];
      } else {
        this.inputModelData.khjcnoArr = saveNumberList.map(i => i.khjcno);
      }
    },
  },
  computed: {
    serviceAsignarea(){//服务分配站点，如果和订单地区一致，是本站,返回true；可编辑
      let  arr=this.mawbinfo.serviceList.filter(i=>i.servicecode==this.servicecode);
      return arr.length?(arr[0].assignarea==this.mawbinfo.area):false
    },
    tableHead() {
      if (this.servicecode == "AG0110") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "快递单号", field: "courienum_deli" },
          { title: "目的地", field: "destinat_deli" },
          { title: "收件人", field: "relshr_deli" },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }

      if (this.servicecode == "AG0115") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "包装类型", field: "bzlx_inspect" },
          {
            title: "是否我司仓库",
            field: "isstore_inspect",
            formatType: 2,
            format: x => (x == 1 ? "是" : "否")
          },
          { title: "仓库区域", field: "storearea_inspect" },
          { title: "仓库名称", field: "store_inspect" },
          { title: "鉴定机构", field: "appraisal_inspect" },
          //  {title:"中文品名",field:"chinesepm_inspect"},
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }
      if (this.servicecode == "AG0120" || this.servicecode == "AG0130") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "成本价", field: "costwage" },
          { title: "销售价", field: "saleswage" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          {
            title:
              this.servicecode == "AG0130"
                ? "挂衣类型/挂衣规格/材料品名/材料规格/数量/结算方式/成本价/销售价"
                : "改包装方式/改包装类型/材料品名/材料规格/数量/结算方式/成本价/销售价",
            field: "contentList"
          }
        ];
      }

      if (this.servicecode == "AA0810") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "成本价", field: "costwage" },
          { title: "销售价", field: "saleswage" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "流向点", field: "flowpoint_cltg" },
          { title: "流向区域", field: "flowarea_cltg" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          {
            title: "材料品名/材料规格/数量/结算方式/成本价/销售价",
            field: "contentList",
            style: { minWidth: "400px" }
          }
        ];
      }

      if (this.servicecode == "AA0830") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "吊车类型", field: "cranetype_tzcc" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }
      if (
        this.servicecode == "AA0230" ||
        this.servicecode == "AA0240" ||
        this.servicecode == "AA0840" ||
        this.servicecode == "AA0850"
      ) {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          {
            title: "操作地",
            field: "ifws",
            hidden: !this.$store.state.rwxdArr.includes(this.servicecode)
          },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }

      if (this.servicecode == "AG0125") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          { title: "操作地", field: "ifws" },
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "包装类型", field: "bzlx_chem" },
          {
            title: "是否我司仓库",
            field: "isstore_chem",
            formatType: 2,
            format: x => (x == 1 ? "是" : "否")
          },
          { title: "仓库区域", field: "storearea_chem" },
          { title: "仓库名称", field: "store_chem" },
          { title: "鉴定类型", field: "appraisaltype_chem" },
          { title: "鉴定机构", field: "appraisal_chem" },
          { title: "鉴定编号", field: "appraisalnum_chem" },
          { title: "生产厂家", field: "makecom_chem" },
          //   {title:"中文品名",field:"chinesepm_chem"},
          //   {title:"英文品名",field:"englishpm_chem"},
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }

      if (this.servicecode == "AG0135") {
        return [
          { title: "操作", field: "operate" },
          { title: "状态", field: "status" },
          { title: "工作号", field: "old_pono" },
          //  {title:"操作地",field:"ifws"},
          { title: "供应商", field: "gid" },
          { title: "客户进仓编号", field: "khjcno" },
          { title: "服务内容", field: "servicecontent" },
          {
            title: "服务时间",
            field: "yqdate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          },
          { title: "唛头", field: "goodsmark_stick" },
          { title: "创建人", field: "addman" },
          {
            title: "创建时间",
            field: "adddate",
            formatType: 1,
            format: "yyyy-MM-dd hh:mm"
          }
        ];
      }
    }
  },
  created() {
    this.getListInfo();

    if (!this.$store.state.rwxdArr.includes(this.servicecode)) {
      this.myinfo.ifws.disabled = true;
    }
    this.$watch(
      function() {
        return this.inputModelData.ifws;
      },
      function(val) {
        if (val == 2) {
          this.myinfo.gid.hidden = false;
        } else {
          this.myinfo.gid.hidden = true;
        }
      },
      { immediate: true }
    );

    if (this.servicecode == "AG0125"||this.servicecode=='AG0115') {
      this.watchYsService()
    }
  },
  watch: {
    tableData(val) {
      if (
        this.$store.state.rwxdArr.includes(this.servicecode) &&
        val.length > 0
      ) {
        //两种情况在boae中不能点完成，全部下达与部分下达并且部分下达的未完成
        // if(val.filter(i=>i.old_sendhpoid>0).length==val.length){
        //    return  this.$emit('update:hasData',false);
        // }else{
        //   if(val.filter(i=>i.old_sendhpoid>0&&i.isfinished==0).length>0){
        //      return  this.$emit('update:hasData',false);
        //   }
        // }
        // if(val.filter(i=>i.old_hpoid>0||i.old_sendhpoid>0).length>0){
        //   return  this.$emit('update:hasData',false);
        // }
        /*   if(val.filter(i=>(i.old_sendhpoid>0||i.old_hpoid>0)&&i.isfinished==1).length==val.length){
            return  this.$emit('update:hasData',true);
           }else{
              return  this.$emit('update:hasData',false);
           } */
      }

      if (this.servicecode == "AA0810") {
        if (val.filter(i => i.servicecontentlist.length == 0).length > 0) {
          return this.$emit(
            "update:hasData",
            "材料提供服务的材料品名，材料规格，数量，结算方式为必填！"
          );
        }
      } else if (this.servicecode == "AG0130") {
        // if (val.filter(i => i.servicecontentlist.length == 0).length > 0) {
        //   return this.$emit(
        //     "update:hasData",
        //     "挂衣服务的挂衣类型与挂衣规格为必填！"
        //   );
        // }
      } else if (this.servicecode == "AG0120") {
        // if (val.filter(i => i.servicecontentlist.length == 0).length > 0) {
        //   return this.$emit("update:hasData", "改包装服务的改包装方式为必填！");
        // }
      } else if (this.servicecode == "AA0830") {
        if (val.filter(i => !i.cranetype_tzcc).length > 0) {
          return this.$emit("update:hasData", "特种吊车服务的调车类型为必填！");
        }
      }

      this.$emit("update:hasData", val.length > 0);
    }
  }
};
</script>
<style lang="less" scoped>
.elform {
  /deep/ .el-select {
    width: 165px;
  }
  /deep/ .el-form-item__label {
    padding-right: 5px;
    color: #333;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}
</style>


