<template>
  <div class="elform">
    <!--     {{inputModelData}}
    <p></p>
{{searchData}}
    -->

    <newFormCmpt
      :view-data.sync="inputViewData"
      :model-data.sync="inputModelData"
      :search-data.sync="searchData"
      :pagetype="2"
    >
      <template slot="terminalname" slot-scope="props">
        <el-select v-model="inputModelData.terminalname" placeholder="请选择">
          <el-option v-for="(item,index) in jjd" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </template>
    </newFormCmpt>

    <el-button @click="getListInfo">查询</el-button>
    <el-button @click="peicangFunc">选择舱位</el-button>
    <!-- <el-button @click="addPcFunc">新增舱位并配舱</el-button> -->

    <div></div>
    <!-- {{tableData}} -->
    <commonTable
      class="commonTable"
      :head="tableHead"
      :table-data="tableData"
      style="margin-top:8px;"
      isRadioSelect
    >
      <!-- <template slot="operate" slot-scope="props"><i class="el-icon-setting" @click="setListInfo(props.data.index)"></i></template> -->
    </commonTable>
    <!-- {{costdata}} -->

    <el-dialog
      title="配舱操作"
      :visible.sync="dialogFlightAss"
      v-if="dialogFlightAss"
      append-to-body
      :close-on-click-modal="false"
      width="1200px"
    >
      <div class="detail peicang">
        <!-- {{shipaceForm}} -->
        <formCompt :input-view-data="shipaceInfo" :input-model-data="shipaceForm"></formCompt>
        <el-button style="margin-left:40px" @click="saveListInfo">保存</el-button>
        <el-button @click="dialogFlightAss=false">返回</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="配舱新增"
      :visible.sync="addPcShow"
      class="addPcDialog"
      :close-on-click-modal="false"
      append-to-body
      v-if="addPcShow"
      width="1100px"
    >
      <div class="input-item">
        <div class="input-title">可配航班：</div>
        <div class="input-content">{{ inputModelData.hbh }}</div>
      </div>

      <div class="detail">
        <div class="detail-c peicDetail" style="position:relative;">
          <formCompt :input-view-data="shipaceInfo" :input-model-data="shipaceInfoDataModel">
            <template slot="hbh">
              <el-input
                v-model="shipaceInfoDataModel.hbh"
                clearable
                @blur="getQfsj(2)"
                v-verify="'uppercase'"
              ></el-input>
            </template>
            <template slot="hbrq">
              <el-date-picker
                v-model="shipaceInfoDataModel.hbrq"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @blur="getQfsj(2)"
              ></el-date-picker>
            </template>
            <template slot="qfsj">
              <el-time-picker
                v-model="shipaceInfoDataModel.qfsj"
                :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }"
                value-format="yyyy-MM-dd HH:mm"
                format="HH:mm"
                style="width:120px"
              ></el-time-picker>
              <i
                title="航班维护"
                class="el-icon-edit-outline"
                @click="qfsjDialogFunc(2)"
                style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;top:4px;"
              ></i>
              <i
                title="刷新"
                class="el-icon-refresh"
                @click="getQfsj(2)"
                style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:6px;position:relative;top:4px;"
              ></i>
            </template>
            <template slot="terminalname">
              <el-select v-model="shipaceInfoDataModel.terminalname" style="width:120px">
                <el-option
                  v-for="(item,index) in jjdArr"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <jjdwh @success="getJJdfunc" :area="area"></jjdwh>
            </template>
          </formCompt>
          <el-button @click="addPcSave" style="margin-left: 20px;margin-top: 20px;">保存并配舱</el-button>
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
  </div>
</template>
<script>
import { searCondition } from "../../api/localStorage.js";
import { formatDate } from "../../filters/index.js";

export default {
  props: {
    mawbinfo: Object,
    shipaceInfoData: Object,
    peicangGuidArr: {
      type: Array,
      default() {
        return [];
      }
    },
    dialogshow: Boolean
  },
  components: {},
  data() {
    return {
      disabled: false,
      dialogFlightAss: false,
      addPcShow: false,
      putIndex: -1,
      tableData: [],
      inputViewData: {
        hbrq: { title: "航班日期", type: 15 },
        hbh: { title: "航班号", type: 1, disabled: true, whereStr: "in" },
        terminalname: { title: "交接地" },
        loadingmodel: { title: "配载方式", type: 5, groupid: "37" },
        // shipspace: { title: "板位", type: 1 ,hidden:!this.$store.state.projectIsWecan},
        // shipvendor: { title: "组板供应商", type: 1 ,hidden:!this.$store.state.projectIsWecan}
      },
      inputModelData: {},
      jjd: [],
      searchData: {},
      shipaceInfo: [
        //配舱
        // {"title":"实际航班号：",id:"hbh",type:1,"model":"","defaultModel":"",class: 'width289'},//这样无法绑定blur 事件
        {
          title: "实际航班号：",
          id: "hbh",
          class: "width289",
          verify: "uppercase"
        },
        { title: "实际航班日期：", id: "hbrq", class: "width289" },
        { title: "实际起飞时间：", id: "qfsj", class: "width289" },
        // {"title":"实际全程天数：",id:"qcts",type:'1',"model":"","defaultModel":"",class: 'width289',verify:'integer'},
        {
          title: "始发港：",
          id: "sfg",
          type: "1",
          model: "",
          class: "width289",
          verify: "sfgmdg"
        },
        {
          title: "配载方式：",
          id: "loadingmodel",
          type: 3,
          groupid: "37",
          class: "width100",
          width: 100,
          model: "",
          defaultModel: "交散",
          options: []
        },
        // {"title":"始发港货站：",id:"terminalname",type:4,"model":"","defaultModel":"",class: 'width289',options:[]},
        { title: "始发港货站：", id: "terminalname", class: "width289" },
        {
          title: "组板供应商：",
          id: "shipvendor",
          type: 1,
          model: "",
          defaultModel: "",
          class: "width289"
        },
        {
          title: "板位描述：",
          id: "shipspace",
          type: 1,
          model: "",
          defaultModel: "",
          class: "width289"
        }
      ], //配舱
      shipaceInfoDataModel: {},
      qfsjDialog: false,
      qfsjUrl: "",
      jjdArr: []
    };
  },
  methods: {
    peicangFunc() {
      var n = -1;
      this.tableData.forEach((i, index) => {
        if (i.checked) {
          n = index;
        }
      });
      if (n == -1) {
        this.$message.error("请先选择！");
      } else {
        //console.log(this.tableData[n])
        // this.shipaceinfo=this.tableData[n]
        if (this.peicangGuidArr.length == 0) {
          //总单新增修改里面的配舱

          this.$emit("update:shipaceInfoData", this.tableData[n]);
          this.$emit("update:dialogshow", false);
          layer.msg("操作成功！");
        } else {
          //查询中的批量配舱
          var json = {};
          json.isdel = 1;
          json.ShipaceList = this.peicangGuidArr.map(i => {
            i.shipaceid = this.tableData[n].guid;
            return i;
          });

          json.area = this.area;
          // if(json.area.split(',').length!=1){
          //   this.$message.error('请选择区域！');return;
          // }
          console.log("批量配舱");
          console.log(JSON.stringify(json, null, 4));
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExHpoAxplineShipaceBatch",
            data: json,
            loading: true,
            tip: false
          }).then(results => {
            //console.log("批量配舱信息")
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              layer.msg("操作成功！");
              this.$emit("update:dialogshow", false);
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        }
      }
    },

    resetFunc() {
      (this.inputModelData = {}), (this.putIndex = -1);
    },

    getListInfo(type) {
      var json = {};

      this.searchData.area = this.area;
      this.searchData.hbhtwocode = this.searchData.hbh;

      let search = JSON.parse(JSON.stringify(this.searchData));
      delete search.hbh;
      var jsonArr = { where: search };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineShipace",
        params: { json: JSON.stringify(jsonArr) },
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        //console.log("航班信息")
        //console.log(results.data)
        this.tableData = results.data;
      });
    },

    saveListInfo() {
      //  if(this.checkRequier!=''){
      //    this.$message.error("请填写"+this.checkRequier);return;
      //  }
      var json = JSON.parse(JSON.stringify(this.shipaceForm));
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxplineShipace",
        data: json,
        loading: true,
        tip: false
      }).then(results => {
        //console.log(results.data)
        if (results.data.resultstatus == 0) {
          // json.guid=results.data.resultguid
          //   this.tableData.push(json)
          //   this.initFunc()
          // this.disabled=true;
          layer.msg("成功");
          this.putIndex = -1;
          this.shipaceForm = {};
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    setListInfo(index) {
      this.putIndex = index;
      this.dialogFlightAss = true;
      this.$nextTick(() => {
        this.shipaceForm = JSON.parse(JSON.stringify(this.tableData[index]));
      });

      //  this.disabled=false;
    },
    delListInfo(index) {
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExYsService",
        data: { id: this.tableData[index].id },
        loading: true,
        tip: false
      }).then(results => {
        //console.log(results)
        if (results.data.resultstatus == 0) {
          this.tableData.splice(index, 1);
          this.putIndex = -1;
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },

    addPcFunc() {
      if (this.area.indexOf(",") !== -1) {
        return this.$message.error("请选择区域");
      }
      this.addPcShow = true;

      this.shipaceInfoDataModel = {};

      if (this.area && this.area.split(",").length == 1) {
        JSON.parse(localStorage.groupType).forEach(i => {
          if (i.groupid == 53 && i.typename == this.area) {
            this.shipaceInfoDataModel.sfg = i.ready06;
          }
        });
      }

      this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubTjjd",
        params: { area: "" },
        loading: true,
        tip: false
      }).then(res => {
        localStorage.setItem("jjd", JSON.stringify(res.data));
        this.getJJdfunc();
      });
    },
    getQfsj(type) {
      //type 1 取预计起飞时间 2 取实际起飞时间
      var sfg = this.shipaceInfoDataModel.sfg;
      if (type == 1) {
      } else {
        var hbh = this.shipaceInfoDataModel.hbh;
        var hbrq = this.shipaceInfoDataModel.hbrq;
      }
      var json = { area: this.area, sfg: sfg, hbh: hbh, hbrq: hbrq, jid: "" };
      if (sfg && hbh.length && hbrq) {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
          params: json,
          loading: true,
          tip: false
        }).then(results => {
          //console.log("起飞时间")
          //console.log(results.data)
          var qfsj = results.data.resultdic && results.data.resultdic.flytime;
          this.qfsjsid = results.data.resultdic && results.data.resultdic.sid;

          if (qfsj && qfsj.indexOf("1900") == -1) {
            if (type == 1) {
            } else {
              this.shipaceInfoDataModel.qfsj = qfsj;
            }
          } else {
            this.$message.error(results.data.resultmessage);

            if (type == 1) {
            } else {
              this.shipaceInfoDataModel.qfsj = "";
            }
          }
        });
      }
    },
    qfsjDialogFunc(type) {
      //起飞时间维护地址
      var sfg = this.shipaceInfoDataModel.sfg;
      if (type == 1) {
      } else {
        var hbh = this.shipaceInfoDataModel.hbh;
        var hbrq = this.shipaceInfoDataModel.hbrq;
      }
      var addman = localStorage.usrname;
      if (!hbh || !hbrq || !sfg) {
        if (type == 1) {
        } else {
          this.$message.error("请填写航班号，航班日期，始发港！");
          return;
        }
      } else {
        this.qfsjDialog = true;
        this.qfsjUrl = `${this.$store.state.imgWebApi}WffBasic/basic/frmflightAdd.aspx?sid=${this.qfsjsid}&mawb=${mawb}&hbh=${hbh}&sfg=${sfg}&addman=${addman}`;
      }
    },
    getJJdfunc() {
      //设置交接地数据
      // this.jjdArr=JSON.parse(localStorage.jjd).filter(e=>e.sfg==this.shipaceInfoDataModel.sfg).map(i=>{return {label:i.cname,value:i.cname}})
      var area = this.area;
      if (area == "市场部" || area == "海外部") {
        area = "香港";
      }
      this.jjdArr = JSON.parse(localStorage.jjd)
        .filter(e => e.sfg == this.shipaceInfoDataModel.sfg)
        .map(i => {
          return { label: i.cname, value: i.cname, id: i.id };
        });
    },
    addPcSave() {
      var json = JSON.parse(JSON.stringify(this.shipaceInfoDataModel));
      json.addman = localStorage.usrname;
      json.adddate = new Date().Format("yyyy-MM-dd hh:mm:ss");

      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/ExHpoAxplineShipace",
        data: json,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          //查询中的批量配舱
          var json = {};
          json.isdel = 1;
          json.ShipaceList = this.peicangGuidArr.map(i => {
            i.shipaceid = results.data.resultguid;
            return i;
          });

          json.area = this.area;

          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExHpoAxplineShipaceBatch",
            data: json,
            loading: true,
            tip: false
          }).then(results => {
            //console.log("批量配舱信息")
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              layer.msg("操作成功！");
              this.shipaceInfoDataModel = {};
              this.addPcShow = false;
              this.$emit("update:dialogshow", false);
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    }
  },
  computed: {
    tableHead() {
      return [
        // {title:"操作",field:"operate"},
        { title: "航班号", field: "hbh" },
        {
          title: "航班日期",
          field: "hbrq",
          formatType: 1,
          format: "yyyy-MM-dd"
        },
        { title: "起飞时间", field: "qfsj", formatType: 1, format: "hh:mm" },
        { title: "交接地", field: "terminalname" },
        //  {title:"配舱操作",field:""},
        { title: "配载方式", field: "loadingmodel" },
        { title: "分隔符", field: "splitstring" },
        // { title: "组版供应商", field: "shipvendor" ,hidden:!this.projectIsWecan},
        { title: "舱位内容", field: "pzcontent" },
        { title: "创建人", field: "addman" },
        {
          title: "创建时间",
          field: "adddate",
          formatType: 1,
          format: "yyyy-MM-dd"
        }
      ];
    },
    area() {
      return (
        (this.mawbinfo && this.mawbinfo.area) || this.$store.state.areaState
      );
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
    var twoCodeArr = [];
    var mawbarr = [];
    if (this.mawbinfo) {
      mawbarr = [{ mawb: this.mawbinfo.mawb }];
    } else {
      mawbarr = this.peicangGuidArr;
    }

    this.$axios({
      method: "get",
      url: this.$store.state.publicWebApi + "api/PubAirCompany",
      params: { area: this.area },
      loading: false,
      tip: false
    }).then(results => {
      //console.log('航空信息')
      //console.log(results.data)
      localStorage.setItem("airinfo", JSON.stringify(results.data));
      mawbarr.forEach(e => {
        results.data.forEach(i => {
          if (i.ThreeCode == e.mawb.substr(0, 3)) {
            if (!twoCodeArr.includes(i.TwoCode)) {
           //   console.log(i);
              twoCodeArr.push(i.TwoCode);
            }
            if (!twoCodeArr.includes(i.PArea)) {
              twoCodeArr.push(i.PArea);
            }
          }
        });
      });
      // console.log(222222);
      // console.log(twoCodeArr.toString());

      if (this.mawbinfo) {
        this.jjd = JSON.parse(localStorage.jjd)
          .filter(e => e.sfg == this.mawbinfo.sfg)
          .map(i => i.cname);
        if (this.mawbinfo.yqhbrq) {
          this.inputModelData = {
            hbrq: {
              begin:
                formatDate(this.mawbinfo.yqhbrq, "yyyy-MM-dd") + " 00:00:00",
              end: formatDate(this.mawbinfo.yqhbrq, "yyyy-MM-dd")
            },
            hbh: twoCodeArr.toString() || ""
          };
        } else {
          this.inputModelData = {
            hbrq: {
              begin: formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00",
              end: new Date()
            },
            hbh: twoCodeArr.toString() || ""
          };
        }
      } else {
        this.inputModelData = {
          hbrq: { begin: formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00" },
          hbh: twoCodeArr.toString() || ""
        };
        this.jjd = JSON.parse(localStorage.jjd)
          .filter(e => e.area == this.area)
          .map(i => i.cname);
      }
    });

    setTimeout(() => {
      this.getListInfo(1);
    }, 500);
  },
  watch: {
    "shipaceForm.loadingmodel"(val) {
      if (val == "装板") {
        $(".peicang")
          .find("#shipvendor")
          .hide();
        $(".peicang")
          .find("#shipspace")
          .show();
      } else {
        $(".peicang")
          .find("#shipvendor")
          .show();
        $(".peicang")
          .find("#shipspace")
          .hide();
      }
    },
    "shipaceInfoDataModel.loadingmodel": {
      handler(val) {
        this.$nextTick(() => {
          if (val == "装板") {
            $(".addPcDialog")
              .find("#shipvendor")
              .hide();
            $(".addPcDialog")
              .find("#shipspace")
              .show();
          } else if (val == "自交接") {
            $(".addPcDialog")
              .find("#shipvendor")
              .hide();
            $(".addPcDialog")
              .find("#shipspace")
              .hide();
          } else {
            $(".addPcDialog")
              .find("#shipvendor")
              .show();
            $(".addPcDialog")
              .find("#shipspace")
              .hide();
          }
        });
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.elform {
  /deep/ .el-form-item__label {
    padding-right: 5px;
    color: #333;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}
</style>


