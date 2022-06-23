<template>
  <div>
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync="pageshow" :pagetype="1" :chinese-where.sync="chineseWhere"
        @reset="reset"></newSearchComp>
      <!-- {{prevUpload}} -->
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <template v-if="btnGroupShow">
          <el-button @click="dialogPcFunc">批量航班配舱</el-button>
          <el-button @click="cancelPeicang">批量解除配舱</el-button>
          <!-- <el-button @click="addPcFunc">新增配舱操作</el-button> -->
          <el-button @click="costControlDialog=true">批量成本分摊</el-button>
          <el-button @click="shareRecordDialog=true">批量成本分摊记录</el-button>
        </template>
      </div>
    </div>
    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" showZiConfig ref="tableCompt"
      :chinese-where.sync="chineseWhere" @wageConfirmStatus="openDialog2" @transSelIndex="openDialog">
      <!-- <template slot="pono" slot-scope="props">
        <span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]"
          @click="openDialog(props.data.index)"
        >{{props.data.value}}</span>
      </template> -->
      <template slot="printFile" slot-scope="props">
        <i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i>
      </template>
      <!-- <template slot="sfg" slot-scope="props">
        <span :index="props.data.index" @click="openDialog(props.data.index,true)"><i
            class="el-icon-document"></i>{{props.data.value}}</span>
      </template> -->

    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <el-dialog title="操作未完成" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :mawbguid="mawbguid" pagetype="8" :area="area" :boguid="boguid"
        :orderdom="orderdom" :positionDocUpload="positionDocUpload"></mawbaddput>
    </el-dialog>

    <el-dialog :visible.sync="dialogPeicang" :close-on-click-modal="false" v-if="dialogPeicang" width="1100px">
      <flightAssignment :peicangGuidArr="peicangGuidArr" :dialogshow.sync="dialogPeicang"></flightAssignment>
    </el-dialog>

    <el-dialog title="配舱新增" :visible.sync="addPcShow" class="addPcDialog" :close-on-click-modal="false" v-if="addPcShow"
      width="1100px">
      <div class="detail">
        <div class="detail-c peicDetail" style="position:relative;">
          <formCompt :input-view-data="shipaceInfo" :input-model-data="shipaceInfoData">
            <template slot="hbh">
              <el-input v-model="shipaceInfoData.hbh" clearable @blur="getQfsj(2)" v-verify="'uppercase'"></el-input>
            </template>
            <template slot="hbrq">
              <el-date-picker v-model="shipaceInfoData.hbrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                @blur="getQfsj(2)"></el-date-picker>
            </template>
            <template slot="qfsj">
              <el-time-picker v-model="shipaceInfoData.qfsj" :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }" value-format="yyyy-MM-dd HH:mm" format="HH:mm" style="width:120px"></el-time-picker>
              <i title="航班维护" class="el-icon-edit-outline" @click="qfsjDialogFunc(2)"
                style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;top:4px;"></i>
              <i title="刷新" class="el-icon-refresh" @click="getQfsj(2)"
                style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:6px;position:relative;top:4px;"></i>
            </template>
            <template slot="terminalname">
              <el-select v-model="shipaceInfoData.terminalname" style="width:120px">
                <el-option v-for="(item,index) in jjdArr" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <jjdwh @success="getJJdfunc" :area="area"></jjdwh>
            </template>
          </formCompt>
          <el-button @click="addPcSave" style="margin-left: 20px;margin-top: 20px;">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="qfsjDialog" width="1300px" top="4%" v-if="qfsjDialog" :close-on-press-escape="false"
      append-to-body>
      <iframe :src="qfsjUrl" frameborder="0" allowtransparency="true"
        style="width: 100%; height:700px; border: 0px none;"></iframe>
    </el-dialog>

    <el-dialog :visible.sync="costControlDialog" title="批量成本分摊" width="90%" top="4%" center v-if="costControlDialog"
      :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
          @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
      </span>
      <costControlTool></costControlTool>
    </el-dialog>

    <el-dialog :visible.sync="shareRecordDialog" width="90%" title="批量成本分摊记录" top="4%" center v-if="shareRecordDialog"
      :close-on-press-escape="false" append-to-body>
      <span slot="title">
        <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
        <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer"
          @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
      </span>
      <shareRecord></shareRecord>
    </el-dialog>

    <el-dialog title="费用未确认" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" pagetype="2">
      </costmaking>
    </el-dialog>

    <!-- {{mawbDetail}} -->
    <div style="display:none">
      <makingBill :mawbguid="mawbDetail.guid" :boguid="mawbDetail.boguid" ref="makingbill"
        v-if="mawbDetail.guid&&printIndex!=-1" :orderdom="mawbDetail.orderdom" :mawbinfo="mawbDetail"></makingBill>
    </div>

    <docUpload :dialogShow.sync="dialogDoc" :dialogPosition="dialogPosition" @close="openDialog(selectTableIndex)"
      :modelData="mawbDetail" :prevUpload.sync="prevUpload" v-if="dialogDoc" pagetype="2" selectTableIndex="-1">
    </docUpload>


  </div>
</template>
<script>
  import flightAssignment from "./orderDetails/flightAssignment"; //航班配舱
  import makingBill from "./orderDetails/makingBill";
  import costControlTool from "./orderDetails/costControlTool"; //成本分摊工具
  import shareRecord from "./orderDetails/shareRecord"; //分摊记录
  import { systemCheck, openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";
  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate
  } from "../api/localStorage.js";
  export default {
    name: "orderUnfinish",
    mixins: [openZimessage, searchCmptMixins],
    components: {
      flightAssignment,
      makingBill,
      costControlTool,
      shareRecord
    },
    data() {
      return {
        name: "orderUnfinish.vue",
        dialogPeicang: false,
        addPcShow: false,
        inputViewData: {
          status: {
            title: "订单状态",
            type: 5,
            dom: "订单状态",
            whereStr: "in",
            hidden: true
          },
          hbrq: {
            title: "航班日期",
            type: 15,
            defaultVal: false,
            fieldtype: 2,
            businesstype: 1
          },
        },
        inputModelData: { status: "AO5030,AO5020,AO5040,AO5050" },
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1, //点击打开展开分单索引
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
          {
            title: "配舱操作：",
            id: "czlx",
            type: 3,
            model: "",
            defaultModel: "唯凯配舱",
            options: [],
            width: 100,
            class: "allwidth",
            groupid: "132"
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
        shipaceInfoData: {}, //配舱绑定数据
        qfsjDialog: false,
        qfsjUrl: "",
        jjdArr: [],
        costControlDialog: false, //批量分摊弹窗
        shareRecordDialog: false,
        selectTableIndex: -1,
        costMakingVisible: false,
        dialogDoc: false,
        prevUpload: true,
        dialogPosition: {}
      };
    },

    methods: {
      dialogPcFunc() {
        if (this.peicangGuidArr.length > 0) {
          this.dialogPeicang = true;
        } else {
          this.$message.error("请先选择！");
        }
      },
      printFileFunc(index) {
        this.printIndex = index;
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: this.tableDataRes[index].boguid },
          loading: false,
          tip: false
        }).then(results => {
          this.mawbDetail = results.data;
          setTimeout(() => {
            this.$refs.makingbill && this.$refs.makingbill.printFunc();
            this.printIndex = -1; //让组件重新渲染以取到制单数据
          }, 500);
        });
      },
      wtdataP(data) { },
      transmitZiMsg(msg) {
        this.printIndex = msg.index;

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: this.tableDataRes[this.putIndex].boguid },
          loading: false,
          tip: false
        }).then(results => {
          var data = results.data;
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/ExAxpline",
            params: { guid: this.ziTableData[msg.index].guid },
            loading: true,
            tip: false
          }).then(res => {
            var hawbdata = res.data;

            //  //console.log(222222222)
            //  //console.log(JSON.stringify(hawbdata))

            data.mdg = hawbdata.mdg;
            data.zdpiece = hawbdata.zdpiece;
            data.zdweight = hawbdata.zdweight;
            data.zdvolume = hawbdata.zdvolume;
            data.smallpiece = hawbdata.smallpiece;
            data.englishpm = hawbdata.englishpm;
            data.jfweight = computedWeight(hawbdata.zdvolume, hawbdata.zdweight);
            data.hawb = hawbdata.hawb;
            data.guid = hawbdata.guid;
            data.orderdom = "分单";
            this.mawbDetail = data;
            setTimeout(() => {
              this.$refs.makingbill && this.$refs.makingbill.printFunc();
              this.printIndex = -1;
            }, 500);
          });
        });
      },
      search() {
        this.selectTableIndex = -1;
        this.tableDataRes = [];
        this.ziTableData = [];
        this.searchData.canceling = 0;
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };
        var json = { json: JSON.stringify(jsonArr2) };
        //console.log(JSON.stringify(jsonArr2))
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoboAxplineGeneral",
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
            setTimeout(() => {
              this.tableDataRes = results.data.map(i => {
                if (!i.mawb || i.hbh) {
                  i.checkDisabled = true;
                }
                return i;
              });



            }, 0);
          })
          .catch(errors => { });
      },

      // reset() {
      //   // reset(this.inputViewData)
      //   this.inputModelData = { status: "AO5030,AO5020,AO5040,AO5050" };
      // },
      openDialog(indexData, positionDocUpload = false) {
        if (indexData < 0) return;
        this.selectTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.orderdom = this.tableDataRes[indexData].orderdom;
        this.area = this.tableDataRes[indexData].area;
        this.positionDocUpload = positionDocUpload
        //console.log(this.mawbguid)
        this.dialogShow = true;
      },
      openDialog2(indexData) {
        this.selectedTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.costMakingVisible = true;
      },
      uncostMaking() {
        this.costMakingVisible = false;
        this.tableDataRes[
          this.selectedTableIndex
        ].wageall_in = this.$refs.costDialog.zdtotalCharge;
        this.tableDataRes[
          this.selectedTableIndex
        ].wageall_out = this.$refs.costDialog.zdtotalPayment;
        this.tableDataRes[this.selectedTableIndex].wageprofit = Number(
          Number(this.$refs.costDialog.zdtotalCharge) -
          Number(this.$refs.costDialog.zdtotalPayment)
        ).toFixed(2);
      },
      cancelPeicang() {
        var jsonArr = [];
        this.tableDataRes.forEach(i => {
          if (i.checked) {
            jsonArr.push({ guid: i.guid, shipaceid: -1 });
          }
        });
        if (jsonArr.length == 0) {
          this.$message.error("请先选择！");
          return;
        }

        this.$confirm("确认操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios({
              method: "put",
              url: this.$store.state.webApi + "api/ExHpoAxplineShipaceBatch",
              data: jsonArr,
              loading: true,
              tip: false
            }).then(results => {
              //console.log("批量配舱信息")
              //console.log(results.data)
              if (results.data.resultstatus == 0) {
                layer.msg("操作成功！");
              } else {
                this.$message.error("操作失败！");
              }
            });
          })
          .catch(() => { });
      },

      addPcFunc() {
        if (this.$store.state.areaState.indexOf(",") !== -1) {
          return this.$message.error("请选择区域");
        }
        this.addPcShow = true;
        this.area = this.$store.state.areaState;
        this.shipaceInfoData = {};

        if (
          this.$store.state.areaState &&
          this.$store.state.areaState.split(",").length == 1
        ) {
          JSON.parse(localStorage.groupType).forEach(i => {
            if (i.groupid == 53 && i.typename == this.$store.state.areaState) {
              this.shipaceInfoData.sfg = i.ready06;
            }
          });
        }
      },
      getQfsj(type) {
        //type 1 取预计起飞时间 2 取实际起飞时间
        var sfg = this.shipaceInfoData.sfg;
        if (type == 1) {
        } else {
          var hbh = this.shipaceInfoData.hbh;
          var hbrq = this.shipaceInfoData.hbrq;
        }
        var json = { area: this.area, sfg: sfg, hbh: hbh, hbrq: hbrq };
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
                this.shipaceInfoData.qfsj = qfsj;
              }
            } else {
              //   layer.msg('未查询到相应的起飞时间!');
              this.$message.error(results.data.resultmessage);

              if (type == 1) {
              } else {
                this.shipaceInfoData.qfsj = "";
              }
            }
          });
        }
      },
      qfsjDialogFunc(type) {
        //起飞时间维护地址
        var sfg = this.shipaceInfoData.sfg;
        if (type == 1) {
        } else {
          var hbh = this.shipaceInfoData.hbh;
          var hbrq = this.shipaceInfoData.hbrq;
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
        //   this.jjdArr=JSON.parse(localStorage.jjd).filter(e=>e.sfg==this.shipaceInfoData.sfg).map(i=>{return {label:i.cname,value:i.cname}})
        var area = this.$store.stata.areaState;
        if (area == "市场部" || area == "海外部") {
          area = "香港";
        }
        this.jjdArr = JSON.parse(localStorage.jjd)
          .filter(e => e.sfg == this.shipaceInfoData.sfg)
          .map(i => {
            return { label: i.cname, value: i.cname, id: i.id };
          });
      },
      addPcSave() {
        var json = JSON.parse(JSON.stringify(this.shipaceInfoData));
        json.addman = localStorage.usrname;
        json.adddate = formatDate(new Date(), "yyyy-mm-dd");

        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxplineShipace",
          data: json,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            layer.msg("成功");
            this.shipaceInfoData = {};
            this.addPcShow = false;
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      }
    },
    watch: {
      "shipaceInfoData.loadingmodel": {
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
    },
    created() {
      this.inputViewData.hbrq.title=this.$store.state.navDataById[this.$router.currentRoute.params.id].othername&&this.$store.state.navDataById[this.$router.currentRoute.params.id].othername.includes('空进')?'到港日期':'航班日期'
    },
    mounted() {
      this.$nextTick(() => {
        let that = this;
        var oBox = document.getElementById('topDivTable');
        //进入子集的时候 会触发ondragover 频繁触发 不给ondrop机会
        oBox.ondragenter = function () {
          // oBox.innerHTML = '请释放鼠标';
        };
        oBox.ondragover = function () {
          return false;
        };
        oBox.ondragleave = function (ev) {
          console.log(ev)
          // oBox.innerHTML = '请将文件拖拽到此区域';
          let className = ev.path[0].className;
          let index = $(ev.path[0]).find('span').attr('index');

          if (className == 'sfg') {
            that.dialogPosition = {
              x: ev.clientX + 20,
              y: ev.clientY - 20
            }
            this.selectTableIndex = index;
            that.mawbDetail = that.tableDataRes[index]
            that.dialogDoc = true
          }
          that.prevUpload = true

        };
        oBox.ondrop = function (ev) {
          var oFile = ev.dataTransfer.files[0];
          var reader = new FileReader();
          that.dialogDoc = false
          //读取成功
          reader.onload = function () {
            console.log(reader);
          };
          reader.readAsDataURL(oFile, 'base64');
          return false;
        };
      })

    },
    computed: {
      btnGroupShow() {
        var area = this.$store.state.areaState;
        var ifshow = true;
        this.tableDataRes.forEach(i => {
          if (i.checked && i.islocal == 2) {
            ifshow = false;
          }
        });
        if (area == "上海") {
          return false;
        } else if (area == "市场部" || area == "海外部") {
          return ifshow;
        } else {
          return true;
        }
      },
      peicangGuidArr() {
        var arr = [];
        this.tableDataRes.forEach(i => {
          if (i.checked) {
            arr.push({ guid: i.guid, mawb: i.mawb });
          }
        });
        return arr;
      }
    }
  };
</script>


< scoped>
</>