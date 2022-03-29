<template>
  <div class="elform" v-enterfocus>
    <!-- {{checkRequier}} -->
    <!-- {{mawbinfo.area}} -->
    <myAlert :servicecode="servicecode"></myAlert>

    <el-form ref="form" label-width="110px" :inline="true"
      style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap">
      <el-row style="padding-left:36px;width:560px;">
        <el-form-item>
          <div class="input-title" style="display:inline-block">进仓编号：</div>
          <el-select placeholder="请选择" multiple size="mini" v-model="inputModelData.khjcno" style="width:166px;"
            class="input-required" @change="hawbSelFunc">
            <li @click="selmultiAll()" style="font-weight: bold;" :style="{color:inputModelData.khjcno.length == saveNumberList.length?'#409EFF':''}">
              <span style="cursor:pointer;user-select: none;;display:block;margin:5px 0px 5px 20px;">全选<i style="margin-left:5px"  class="el-icon-check"></i></span>
            </li>
            <li>
              <span style="float: left;margin-left:20px;">进仓编号</span>
              <span style="float: right;margin-right:30px;">
                <i class="imul">件</i>/
                <i class="imul">重</i>/
                <i class="imul">体</i>
              </span>
            </li>
       
            <el-option v-for="numitem in saveNumberList" :key="numitem.guid" :label="numitem.khjcno"
              :value="numitem.khjcno" style="width:300px;height:28px">
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
      <newFormCmpt v-show="$store.state.rwxdArr.includes(servicecode)&&mawbinfo.area==conditionalAreaForBuild"
        :view-data.sync="myinfo" :model-data.sync="inputModelData" :pagetype="2" :area="mawbinfo.area"></newFormCmpt>

      <el-row style="width: 100%;margin-bottom: 14px;">
        <el-form-item label="要求提货时间：">
          <el-date-picker class="input-required" v-model="inputModelData.pickupdate_org" type="datetime"
            placeholder="选择日期" style="width:170px" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="要求完成时间：">
          <el-date-picker v-model="inputModelData.yqfinishdate_org" type="datetime" placeholder="选择日期"
            style="width:170px" class="input-required" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
          </el-date-picker>
        </el-form-item>



      </el-row>

      <el-row style="width: 100%;text-align: right;">
        <tempConfig :name="name" placeholder="可保存提送货信息为模板" :type="85" :jsondata.sync="jsondata">
        </tempConfig>
      </el-row>
    </el-form>
    <!-- {{jsondata}} -->
    <!-- {{inputModelData}} -->
    <div class="sfd">
      <div class="header">
        <div class="title">货物提货地</div>
        <div class="radio">
          <el-radio v-model="sfdtabs" label="客户地址">客户地址</el-radio>
          <el-radio v-model="sfdtabs" label="货站">货站</el-radio>
          <el-radio v-model="sfdtabs" label="唯凯仓库">唯凯仓库</el-radio>
        </div>
      </div>
      <div class="content">
        <div class="khdz" v-show="sfdtabs == '客户地址'" v-enterfocus>
          <addressCompt ref="thraddress" :addressData.sync="thrAddressData" :gid="mawbinfo.gid" addresstype="1">
          </addressCompt>
        </div>
        <div class="jchz" v-show="sfdtabs == '货站'">
          <div>
            <span>港口：</span>
            <pageSelect :pagetype="6" :modelval.sync="inputModelData.port_thr" class="input-required"
              style="width: 186px;display:inline-block;"></pageSelect>
          </div>

          <div>
            <span>请选择货站：</span>
            <el-select v-model="inputModelData.terminal_thr" class="input-required">
              <el-option v-for="(option, index) in cargo_station_option" v-if="option.sfg == inputModelData.port_thr"
                :key="index" :value="option.cname"></el-option>
            </el-select>
          </div>

          <p class="contacts">联系人信息：</p>
          <el-row>
            <el-col :span="3" style="margin-right: 20px;">
              <el-input v-model="inputModelData.lxr_thr_org" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="inputModelData.phone_thr_org" placeholder="电话"></el-input>
            </el-col>
          </el-row>
        </div>

        <div class="wecanck" v-show="sfdtabs == '唯凯仓库'">
          <el-row>
            <el-col :span="6">
              <span>出库地区：</span>
              <el-select v-model="inputModelData.address_thrstorearea_org">
                <el-option v-for="(area, index) in areaArr" :value="area" :label="area" :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>出库仓库：</span>
              <el-select v-model="inputModelData.store_thr">
                <el-option v-for="(store, index) in storeArr" :value="store" :label="store" :key="index"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <p class="contacts">联系人信息：</p>
          <el-row>
            <el-col :span="3" style="margin-right: 20px;">
              <el-input v-model="inputModelData.lxr_thr_org" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="inputModelData.phone_thr_org" placeholder="电话"></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="mdd">
      <div class="header">
        <div class="title">货物送货地</div>
        <div class="radio">
          <el-radio v-model="mddtabs" label="客户地址">客户地址</el-radio>
          <el-radio v-model="mddtabs" label="货站">货站</el-radio>
          <el-radio v-model="mddtabs" label="唯凯仓库">唯凯仓库</el-radio>

        </div>
      </div>
      <div class="content">
        <div class="khdz" v-show="mddtabs == '客户地址'" v-enterfocus>

          <addressCompt ref="shraddress" :addressData.sync="shrAddressData" :gid="mawbinfo.gid" addresstype="2">
          </addressCompt>
        </div>
        <div class="jchz" v-show="mddtabs == '货站'">
          <div>
            <span>港口：</span>
            <pageSelect :pagetype="6" :modelval.sync="inputModelData.port_shr" class="input-required"
              style="width: 186px;display:inline-block;"></pageSelect>
          </div>

          <div>
            <span>请选择货站：</span>
            <el-select v-model="inputModelData.terminal_shr" class="input-required">
              <el-option v-for="(option, index) in cargo_station_option" v-if="option.sfg == inputModelData.port_shr"
                :key="index" :value="option.cname"></el-option>
            </el-select>
          </div>

          <p class="contacts">联系人信息：</p>
          <el-row>
            <el-col :span="3" style="margin-right: 20px;">
              <el-input v-model="inputModelData.lxr_shr_org" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="inputModelData.phone_shr_org" placeholder="电话"></el-input>
            </el-col>
          </el-row>
        </div>

        <div class="wecanck" v-show="mddtabs == '唯凯仓库'">
          <el-row>
            <el-col :span="6">
              <span>入库地区：</span>
              <el-select v-model="inputModelData.address_shrstorearea_org">
                <el-option v-for="(area, index) in areaArr" :value="area" :label="area" :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>入库仓库：</span>
              <el-select v-model="inputModelData.store_shr">
                <el-option v-for="(store, index) in storeArr2" :value="store" :label="store" :key="index"></el-option>
              </el-select>
            </el-col>
          </el-row>

          <p class="contacts">联系人信息：</p>
          <el-row>
            <el-col :span="3" style="margin-right: 20px;">
              <el-input v-model="inputModelData.lxr_shr_org" placeholder="姓名"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="inputModelData.phone_shr_org" placeholder="电话"></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div style="text-align: right;">
    <el-button size="mini" type="primary" style="margin: 5px 0;" @click="saveListInfo">保存提货信息</el-button>
    </div>

    <commonTable class="commonTable" :head="tableHead" :table-data="tableData" style="margin-top:8px;">
      <template slot="transport_status" slot-scope="props">{{getStatus(props.data.value)}}</template>
      <template slot="ifws" slot-scope="props">{{!props.data.row.gid||props.data.row.gid==-1?'我司':"非我司"}}</template>
      <template slot="gid" slot-scope="props">{{getGysName(props.data.value)}}</template>
      <template slot="operate" slot-scope="props">
        <span @click="setListInfo(props.data.index)" style="cursor:pointer;color:blue"
          v-if="props.data.row.transport_status!==500&&serviceAsignarea&&!orderFinish">编辑</span>
        <span @click="delListInfo(props.data.index)" style="cursor:pointer;color:blue"
          v-if="props.data.row.transport_status!==500&&serviceAsignarea&&!orderFinish">{{props.data.row.transport_oldguid>0?'解绑':'删除'}}</span>
        <span style="cursor:pointer;color:blue"
          v-if="props.data.row.old_sendhpoid<0&&props.data.row.transport_oldguid<0&&serviceAsignarea&&!orderFinish"
          @click="serviceFinishFunc(props.data.row)"
          :class="{pointerAll:props.data.row.transport_status==500}">{{props.data.row.transport_status==100?'任务完成':'取消完成'}}</span>
        <span v-if="!serviceAsignarea||orderFinish">--</span>

      </template>
      <template slot="weight" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>
      <template slot="volume" slot-scope="props">{{Number(props.data.value).toFixed(3)}}</template>
    </commonTable>
  </div>
</template>
<script>
  import addressCompt from "../templates/addressCompt";
  import { getChangeRate } from "../../api/localStorage.js";
  import tempConfig from "../templates/tempConfig";


  export default {
    props: {
      boguid: {
        type: String,
        default: ""
      },
      saveNumberList: Array,
      mawbguid: [Number, String],
      serviceguid: String,
      mawbinfo: Object,
      servicecode: String,
      ordertype: {
        type: [Number, String],
        default: 1
      }, //1本站 2操作站 3销售站
      orderFinish: {
        type: Boolean,
        default: false
      },
    },
    components: {
      addressCompt, tempConfig
    },

    data() {
      return {
        name: "takeDeliveryGoods.vue",
        initCompt: true,
        disabled: false,
        putIndex: -1,
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
            require: true
          }
        },
        cargo_station_option: [],
        address_type: ["客户地址", "货站", "唯凯仓库"],
        tableHead: [
          { title: "操作", field: "operate" },
          { title: "状态", field: "transport_status" },
          { title: "工作号", field: "transport_oldpono" },
          { title: "操作地", field: "ifws" },
          { title: "建议应收提货费", field: "ysthwage" },
          { title: "供应商", field: "gid" },
          { title: "提货地", field: "address_thr_org" },
          { title: "提货地联系人姓名", field: "lxr_thr_org" },
          { title: "提货地联系人电话", field: "phone_thr_org" },
          { title: "送货地", field: "address_shr_org" },
          { title: "送货地联系人姓名", field: "lxr_shr_org" },
          { title: "送货地联系人电话", field: "phone_shr_org" },
          //  {title:"入库方式",field:"storetype"},
          { title: "提货时间", field: "pickupdate_org" },
          { title: "要求完成日期", field: "yqfinishdate_org" },
          { title: "件数", field: "piece" },
          { title: "重量", field: "weight" },
          { title: "体积", field: "volume" },
          { title: "进仓编号", field: "khjcnoList" },
          // {title:"费用",field:""},
          // {title:"币种",field:""},
          { title: "卡车供应商", field: "truckname" }
        ],
        tableData: [],
        inputViewData: [],
        inputModelData: {
          address_thrtype_org: "1",
          address_thrstorearea_org: "",
          store_thr: "",
          company_thr_org: "",
          address_thr_org: "",
          address_thrjson_org: "",
          port_thr: "",
          terminal_thr: "",
          lxr_thr_org: "",
          phone_thr_org: "",
          address_shrtype_org: "1",
          address_shrstorearea_org: "",
          store_shr: "",
          company_shr_org: "",
          address_shr_org: "",
          address_shrjson_org: "",
          port_shr: "",
          terminal_shr: "",
          lxr_shr_org: "",
          phone_shr_org: "",
          pickupdate_org: "",
          yqfinishdate_org: "",
          storeList: "",
          khjcno: [],
          truckgid: -1,
          truckname: "",
          transport_guid: -1,
          piece: "",
          weight: "",
          volume: "",
          ifws: this.$store.state.rwxdArr.includes(this.servicecode) ? 1 : 2
        },
        fields: {
          address_thrtype_org: "",
          address_thrstorearea_org: "",
          store_thr: "",
          company_thr_org: "",
          address_thr_org: "",
          address_thrjson_org: "",
          port_thr: "",
          terminal_thr: "",
          lxr_thr_org: "",
          phone_thr_org: "",

          address_shrtype_org: "",
          address_shrstorearea_org: "",
          store_shr: "",
          company_shr_org: "",
          address_shr_org: "",
          address_shrjson_org: "",
          port_shr: "",
          terminal_shr: "",
          lxr_shr_org: "",
          phone_shr_org: "",
        },
        cargoData: [],
        rowdata: {},
        jjdArr: []
      };
    },
    computed: {
        serviceAsignarea() {//服务分配站点，如果和订单地区一致，是本站,返回true；可编辑
        let arr = this.mawbinfo.serviceList.filter(i => i.servicecode == this.servicecode);
        return (arr.length ? (arr[0].assignarea == this.mawbinfo.area) : false)||this.mawbinfo.system!='空出'
      },
      jsondata: {
        get() {
          let json = {}
          Object.keys(this.fields).forEach(i => {
            json[i] = this.inputModelData[i]
          })
          return [json]
        },
        set(val) {
          console.log(val)
          Object.keys(this.fields).forEach(i => {
            this.inputModelData[i] = val[0][i]
          })
        }
      },
      checkRequier() {
        //检查是否必填，除备注外全部必填
        var require = "";

        // if(!this.address.addressjson.addressjson){
        //       return "提货地详细地址"
        //     }
        if (this.inputModelData.khjcno.length == 0) {
          return "进仓编号";
        }
        Object.keys(this.inputModelData)
          .reverse()
          .forEach(i => {
            if (!this.inputModelData[i]) {
              this.tableHead.forEach(item => {
                if (i == item.field && i != "truckname" && i != "transport_oldpono") {
                  require = item.title;
                }
              });
            }
          });
        return require;
      },

      areaArr() {
        let arr = [];
        this.cargoData.map(item => {
          if (!arr.includes(item.area)) {
            arr.push(item.area);
          }
        });
        return arr;
      },
      storeArr() {
        let arr = [];
        this.cargoData.map(item => {
          if (item.area == this.inputModelData.address_thrstorearea_org) {
            arr.push(item.storename);
          }
        });
        return arr;
      },
      storeArr2() {
        let arr = [];
        this.cargoData.map(item => {
          if (item.area == this.inputModelData.address_shrstorearea_org) {
            arr.push(item.storename);
          }
        });
        return arr;
      },
      sfdtabs: {
        get() {
          return this.address_type[this.inputModelData.address_thrtype_org - 1];
        },
        set(val) {
          this.inputModelData.address_thrtype_org =
            this.address_type.indexOf(val) + 1;
        }
      },
      mddtabs: {
        get() {
          return this.address_type[this.inputModelData.address_shrtype_org - 1];
        },
        set(val) {
          this.inputModelData.address_shrtype_org =
            this.address_type.indexOf(val) + 1;
        }
      },
      thrAddressData: {
        get() {
          return {
            addressname: this.inputModelData.company_thr_org,
            address: this.inputModelData.address_thr_org,
            linkman: this.inputModelData.lxr_thr_org,
            phone: this.inputModelData.phone_thr_org,
            addressjson: this.inputModelData.address_thrjson_org
          };
        },
        set(value) {
          this.inputModelData.company_thr_org = value.addressname;
          this.inputModelData.address_thr_org = value.address;
          this.inputModelData.lxr_thr_org = value.linkman;
          this.inputModelData.phone_thr_org = value.phone;
          this.inputModelData.address_thrjson_org = value.addressjson;
        }
      },
      shrAddressData: {
        get() {
          return {
            addressname: this.inputModelData.company_shr_org,
            address: this.inputModelData.address_shr_org,
            linkman: this.inputModelData.lxr_shr_org,
            phone: this.inputModelData.phone_shr_org,
            addressjson: this.inputModelData.address_shrjson_org
          };
        },
        set(value) {
          this.inputModelData.company_shr_org = value.addressname;
          this.inputModelData.address_shr_org = value.address;
          this.inputModelData.lxr_shr_org = value.linkman;
          this.inputModelData.phone_shr_org = value.phone;
          this.inputModelData.address_shrjson_org = value.addressjson;
        }
      }
    },
    watch: {
      "inputModelData.address_shrtype_org"(val) {
        if (this.putIndex != -1) {
          if (val != this.tableData[this.putIndex].address_shrtype_org) {
            this.inputModelData.address_shrstorearea_org = "";
            this.inputModelData.address_shr_org = "";
          } else {
            this.inputModelData.address_shrstorearea_org = this.tableData[
              this.putIndex
            ].address_shrstorearea_org;
            this.inputModelData.address_shr_org = this.tableData[
              this.putIndex
            ].address_shr_org;
          }
        } else {
          if (val == "2") {
            if (this.inputModelData.address_shrstorearea_org == "") {
              this.inputModelData.address_shrstorearea_org = this.$store.state.areaState.includes(
                ","
              )
                ? ""
                : this.$store.state.areaState;
            }
          } else {
            // this.inputModelData.address_shrstorearea_org = "";
          }
        }
      },
      "inputModelData.address_shrstorearea_org"(val) {
        this.getJjdFunc();
      },
      tableData(val) {
        /*     if (
              this.$store.state.rwxdArr.includes(this.servicecode) &&
              val.length > 0
            ) {
              if (
                val.filter(i => i.old_sendhpoid > 0 && i.isfinished == 1).length ==
                val.length
              ) {
                return this.$emit("update:hasData", true);
              } else {
                return this.$emit("update:hasData", false);
              }
            } */
        this.$emit("update:hasData", val.length > 0);
      }
    },
    created() {
      this.getListInfo();
      this.getAreaStore();
      this.cargo_station_option = JSON.parse(localStorage.jjd);
      this.$watch(
        function () {
          return this.inputModelData.ifws;
        },
        function (val) {
          if (val == 2) {
            this.myinfo.gid.hidden = false;
          } else {
            this.myinfo.gid.hidden = true;
          }
        },
        { immediate: true }
      );
    },
    methods: {
      initform() {
        this.inputModelData = {
          address_thrtype_org: "1",
          address_thrstorearea_org: "",
          store_thr: "",
          company_thr_org: "",
          address_thr_org: "",
          address_thrjson_org: "",
          port_thr: "",
          terminal_thr: "",
          lxr_thr_org: "",
          phone_thr_org: "",

          address_shrtype_org: "1",
          address_shrstorearea_org: "",
          store_shr: "",
          company_shr_org: "",
          address_shr_org: "",
          address_shrjson_org: "",
          port_shr: "",
          terminal_shr: "",
          lxr_shr_org: "",
          phone_shr_org: "",

          pickupdate_org: "",
          yqfinishdate_org: "",
          storeList: "",
          khjcno: [],
          piece: "",
          weight: "",
          volume: "",
          truckgid: -1,
          truckname: "",
          transport_guid: -1,
          ifws: this.$store.state.rwxdArr.includes(this.servicecode) ? 1 : 2
        };
        this.putIndex = -1;
      },
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
      getFormInfo() {
        var ybArr = [];
        let newKhjcnoArr = this.inputModelData.khjcno;
        let oldKhjcnoArr = this.tableData[this.putIndex]
          ? this.tableData[this.putIndex].khjcnoList.split(",")
          : [];
        newKhjcnoArr.forEach(i => {
          if (!oldKhjcnoArr.includes(i)) {
            ybArr.push({ isdel: 1, khjcno: i });
          }
        });
        oldKhjcnoArr.forEach(i => {
          if (!newKhjcnoArr.includes(i)) {
            ybArr.push({ isdel: 2, khjcno: i });
          } else {
            ybArr.push({ isdel: 1, khjcno: i });
          }
        });

        var ybstoreList = [];
        ybArr.forEach(el => {
          this.saveNumberList.forEach(item => {
            if (el.khjcno == item.khjcno) {
              ybstoreList.push({
                //isdel: el.isdel,
                isdelete: el.isdel,
                guid: item.guid,
                khjcno: el.khjcno,
                store_childguid: item.store_childguid,
                store_childdom: item.store_childdom
              });
            }
          });
        });

        return ybstoreList;
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
      initFunc() { },
      getListInfo() {
        this.putIndex = -1;
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxplineStoreTransport",
          params: {
            sid: this.mawbguid,
            serviceguid: this.serviceguid,
            servicecode: this.servicecode
          },
          loading: true,
          tip: false
        }).then(results => {
          //console.log("提货信息")
          //console.log(JSON.stringify(results.data))
          this.tableData = results.data.map(i => {
            i.address_shrtype_org = String(i.address_shrtype_org);
            i.address_thrtype_org = String(i.address_thrtype_org);
            return i;
          });
          this.$emit(
            "getJsxmData",
            this.tableData,
            this.servicecode == "AA0510" ? 3 : 9
          );
          //   alert(this.servicecode=='AA0510'?3:9)
        });
      },
      selOptionShow(item) {
        //判断进仓编号是否已经使用
        var isUse = false;
        this.tableData.forEach((element, i) => {
          if (
            element.khjcnoList.split(",").includes(item) &&
            this.putIndex != i
          ) {
            isUse = true;
          }
        });
        return isUse;
      },
      saveListInfo() {
        this.inputModelData.storeList = this.getFormInfo();

        if (this.mawbinfo.area == this.conditionalAreaForBuild && this.$store.state.rwxdArr.includes(this.servicecode)) {
          if (
            this.inputModelData.ifws == 2 &&
            (this.inputModelData.gid == -1 || !this.inputModelData.gid)
          ) {
            this.$message.error("请选择供应商！");
            return;
          }

        } else {
          this.inputModelData.ifws = 2
          this.inputModelData.gid = ''
        }


        if (this.inputModelData.ifws == 1) {
          this.inputModelData.gid = -1;
        }

        this.inputModelData.storeList = this.inputModelData.storeList.map(i => {
          i.gid = this.inputModelData.gid;
          return i;
        });
        this.inputModelData.truckgid = this.inputModelData.truckgid || -1;
        this.inputModelData.transport_guid =
          this.inputModelData.transport_guid || -1;
        this.inputModelData.sid = this.mawbguid;
        this.inputModelData.transport_childguid =
          this.inputModelData.transport_childguid || -1;
        this.inputModelData.transport_childdom =
          this.inputModelData.transport_childdom || "";
        this.inputModelData.serviceguid = this.serviceguid;
        this.inputModelData.servicecode = this.servicecode;
        this.inputModelData.boguid = this.boguid;
        this.inputModelData.oldhpoid = this.mawbinfo.grouphpoguid;

        if (this.sfdtabs == "唯凯仓库") {
          this.inputModelData.address_thr_org = this.cargoData.filter(i => i.storename == this.inputModelData.store_thr)[0].remark
          this.inputModelData.address_thrjson_org = ''
          this.inputModelData.company_thr_org = ""
        }

        if (this.mddtabs == "唯凯仓库") {
          this.inputModelData.address_shr_org = this.cargoData.filter(i => i.storename == this.inputModelData.store_shr)[0].remark
          this.inputModelData.address_shrjson_org = ''
          this.inputModelData.company_shr_org = ""
        }


        /*       if (this.checkRequier != "") {
           this.$message.error("请填写" + this.checkRequier);
           return;
         }
    */
        // if (!this.$refs.addressCmpt.checkInputRequired()) {
        //   return this.$message.error("请填写完整信息");
        // }
        if (!this.check_data()) return;

        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAxplineStoreTransport",
          data: this.inputModelData,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            // 新增时保存地址信息
            if (!this.inputModelData.guid) {
              this.saveAddress();
            }
            if (results.data.resultno) {
              this.$message.success(
                `操作成功，订单已自动下达，编号为${results.data.resultno}`
              );
            } else {
              this.$message.success(results.data.resultmessage);
            }
            this.initform();
            this.getListInfo();
            if (this.$store.state.rwxdArr.includes(this.servicecode)) {
              this.$emit("success", true);
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      saveAddress() {
        if (this.inputModelData.address_thrtype_org == 1) {
          this.$refs.thraddress.collectAddress();
        }
        if (this.inputModelData.address_shrtype_org == 1) {
          this.$refs.shraddress.collectAddress();
        }
      },
      check_data() {
        if (this.inputModelData.khjcno.length == 0) {
          this.$message.error("请选择进仓编号");
          return false;
        }
        if (!this.inputModelData.pickupdate_org) {
          this.$message.error("请填写要求提货时间");
          return false;
        }

        if (!this.inputModelData.yqfinishdate_org) {
          this.$message.error("请填写要求完成时间");
          return false;
        }


        // if (
        //   !this.inputModelData.lxr_thr_org ||
        //   !this.inputModelData.phone_thr_org ||
        //   !this.inputModelData.lxr_shr_org ||
        //   !this.inputModelData.phone_shr_org
        // ) {
        //   this.$message.error("请填写完整信息");
        //   return false;
        // }
        if (this.sfdtabs == "客户地址") {
          if (!this.inputModelData.address_thr_org) {
            this.$message.error("请填写完整信息");
            return false;
          }
          if (!this.$refs.thraddress.checkInputRequired()) {
            this.$message.error("请填写完整信息");
            return false;
          }
        } else if (this.sfdtabs == "货站") {
          if (!this.inputModelData.terminal_thr) {
            this.$message.error("请填写完整信息");
            return false;
          }
        }

        if (this.mddtabs == "客户地址") {
          if (!this.inputModelData.address_shr_org) {
            this.$message.error("请填写完整信息");
            return false;
          }
          if (!this.$refs.shraddress.checkInputRequired()) {
            this.$message.error("请填写完整信息");
            return false;
          }
        } else if (this.mddtabs == "货站") {
          if (!this.inputModelData.terminal_shr) {
            this.$message.error("请填写完整信息");
            return false;
          }
        }

        return true;
      },
      setListInfo(index) {
        this.putIndex = index;

        this.inputModelData = JSON.parse(JSON.stringify(this.tableData[index]));

        this.$set(
          this.inputModelData,
          "khjcno",
          this.inputModelData.khjcnoList.split(",")
        );

          this.$set(
          this.inputModelData,
          "address_thrtype_org",
          this.inputModelData.address_thrtype_org>0? this.inputModelData.address_thrtype_org:'1'
        );
        
         this.$set(
          this.inputModelData,
          "address_shrtype_org",
          this.inputModelData.address_shrtype_org > 0 ? this.inputModelData.address_shrtype_org : '1'
        );
        

        this.hawbSelFunc(this.inputModelData.khjcno);

        this.$nextTick(() => {
          //this.$refs.addressCmpt.findAddress();
          this.$set(
            this.inputModelData,
            "ifws",
            this.inputModelData.gid && this.inputModelData.gid != -1 ? 2 : 1
          );
        });

        //  this.disabled=false;
      },
      delListInfo(index) {
        var json = JSON.parse(JSON.stringify(this.tableData[index]));
        let str =
          json.transport_oldguid > 0
            ? "将取消绑定，并退回到工作号：" + json.transport_oldpono
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
          url: this.$store.state.webApi + "api/ExAxplineStoreTransport",
          data: {
            transport_guid: this.tableData[index].transport_guid,
            transport_oldguid: this.tableData[index].transport_oldguid,
            transport_oldpono: this.tableData[index].transport_oldpono,
            sid: this.mawbguid,
            serviceguid: this.serviceguid,
            servicecode: this.servicecode,
            boguid: this.boguid
          },
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            layer.msg("成功");
            this.initform();
            // this.getListInfo()
            this.tableData.splice(index, 1);
            if (this.$store.state.rwxdArr.includes(this.servicecode)) {
              this.$emit("success", true);
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      getAreaStore() {
        this.cargoData = JSON.parse(localStorage.cargoData);
      },
      getJjdFunc() {
        if (this.servicecode == "AA0510") {
          this.jjdArr = JSON.parse(localStorage.jjd)
            .filter(e => e.sfg == this.mawbinfo.sfg)
            .map(i => i.cname);
        } else {
          this.jjdArr = JSON.parse(localStorage.jjd)
            .filter(e => e.sfg == this.mawbinfo.mdg)
            .map(i => i.cname);
        }
      },
      taskDelivery(index) {
        //任务下达
        let url =
          this.tableData[index].old_sendhpoid > 0
            ? "api/BoAEToBoGn/CancelSend"
            : ["AA0410", "AB0420", "AA0510", "AB0520", "AG0145",].includes(this.servicecode)
              ? "api/BoAEToBoGn/YsStore"
              : "api/BoAEToBoGn/Other";
        let json = {
          boguid: this.boguid,
          serviceguid:
            this.tableData[index].old_sendhpoid > 0
              ? this.tableData[index].old_sendhpoid
              : this.tableData[index].transport_guid,
          servicecode: this.servicecode
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
      serviceFinishFunc(row) {
        let data = {
          servicecode: this.servicecode,
          guid: row.transport_guid,
          boguid: this.boguid,
          czman: localStorage.usrname,
          nodeman: row.transport_status == 100 ? localStorage.usrname : "",
          servicetype: (this.servicecode == "AA0510" || this.servicecode == "AB0520") ? 1 : 2
        };
        console.log(data);
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
        let saveNumberList=this.saveNumberList
          //  let saveNumberList = this.saveNumberList.filter(i => !this.selOptionShow(i.khjcno))
        if (this.inputModelData.khjcno.length == saveNumberList.length) {
          this.inputModelData.khjcno = [];
        } else {
          this.inputModelData.khjcno = saveNumberList.map(i => i.khjcno);
        }
      },
    }
  };
</script>
<style lang="less" scoped>
  .elform {

    /deep/ .el-date-editor--date,
    .el-form-item__content {
      width: 170px;
    }

    /deep/ .el-date-editor--date .el-input__inner {
      width: 170px;
    }

    /deep/ .el-select {
      width: 170px;
    }

    /deep/ .el-form-item__label {
      padding-right: 5px;
      color: #333;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }

    /deep/ .input-item {
      margin-bottom: 0px;
    }

    .sfd,
    .mdd,
    .charge,
    .payment {
      margin: 10px 0;

      .contacts {
        float: left;
        margin-right: 5px;

        &.block {
          float: none;

          +.el-row {
            margin-top: 10px;
          }
        }
      }

      .header {
        position: relative;

        .title,
        .title+div {
          display: inline-block;
          height: 35px;
          line-height: 35px;
          padding-left: 10px;
        }

        .title {
          position: relative;
          color: white;
          margin-right: 30px;

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
          p {
            display: inline-block;
            margin-right: 50px;
          }

          .right-btn {
            position: absolute;
            top: -5px;
            right: 0;
          }
        }
      }

      .content {
        padding: 20px;

        .khdz {
          .el-row {
            margin-bottom: 10px;

            .el-col {
              margin-right: 20px;
            }
          }
        }

        .jchz {
          >div {
            margin-bottom: 10px;
          }

          span,
          p {
            display: inline-block;
            width: 100px;
            height: 28px;
            line-height: 28px;
          }
        }

        .wecanck {
          >div {
            margin-bottom: 10px;

            span {
              display: inline-block;
              width: 100px;
              height: 28px;
              line-height: 28px;
            }
          }

          .contacts {
            width: 100px;
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }

    .sfd {
      @sfdcolor: #09c;

      .title {
        background: @sfdcolor;

        &:after {
          border-bottom: 35px solid @sfdcolor;
        }
      }

      .content {
        border: 1px solid @sfdcolor;
      }
    }

    .mdd {
      @mddcolor: #f89828;

      .title {
        background: @mddcolor;

        &:after {
          border-bottom: 35px solid @mddcolor;
        }
      }

      .content {
        border: 1px solid @mddcolor;
      }
    }
  }
</style>