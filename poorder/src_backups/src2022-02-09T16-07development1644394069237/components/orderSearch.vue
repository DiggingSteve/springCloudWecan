<template>
  <div>
    <div class="page-container-box">
      <!-- {{selectTableIndex}} -->
      <!-- {{inputModelData}} -->
      <!-- <hr> -->
      <!-- {{searchData}} -->
      <!-- {{inputViewData}} -->
      <!-- <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
      ></newFormCmpt> -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :chinese-where.sync="chineseWhere" :pageshow.sync="pageshow" @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <!-- <el-button @click="openMergeDialog" v-if="$store.state.ifMergeHawb">订单合并</el-button> -->
      </div>
    </div>
    <!-- 获取配舱选中数据 -->
    <span style="display:none">{{peicangGuidArr}}</span>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"
      :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal" @wageConfirmStatus="openDialog2">
      <template slot="operate" slot-scope="props">
        <el-badge is-dot class="item"  v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "      :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
            <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
        </el-badge>
       </template> 
      <!-- <template slot="pono" slot-scope="props">
        <span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]"
          @click="openDialog(props.data.index)"
        >{{props.data.value}}</span>
      </template> -->
      <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i></template> -->
      <!-- <template slot="printFile" slot-scope="props"><i>&nbsp;</i></template> -->
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <transition enter-active-class="animate__animated animate__zoomInDown"
      leave-active-class="animate__animated animate__zoomOutRight">
      <el-dialog title="综合查询" center :visible.sync="dialogShow" v-if="dialogShow" class="dialogPage"
        :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
        <mawbaddput :visible.sync="dialogShow" :pagetype="isMonitor?20:6" :mawbguid="mawbguid" :boguid="boguid"
          :area="area" :orderdom="orderdom" @update="delTableIndex" @success="mergeSuc"></mawbaddput>
      </el-dialog>


    </transition>

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

    <!-- {{mawbDetail}} -->
    <div style="display:none">
      <makingBill :mawbguid="mawbDetail.guid" :boguid="mawbDetail.boguid" ref="makingbill"
        v-if="mawbDetail.guid&&printIndex!=-1" :orderdom="mawbDetail.orderdom" :mawbinfo="mawbDetail"></makingBill>
    </div>

    <el-dialog :visible.sync="mergeDialog" title="合并订单信息" width="90%" top="1%" v-if="mergeDialog"
      :close-on-press-escape="false" append-to-body>
      <mergeBill :margeTableData="margeTableData" @success="mergeSuc"></mergeBill>
    </el-dialog>


    <el-dialog title="费用未确认" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" pagetype="2">
      </costmaking>

    </el-dialog>
  </div>
</template>
<script>
  import flightAssignment from "./orderDetails/flightAssignment"; //航班配舱
  import { systemCheck, mergeFunc, openZimessage, searchCmptMixins } from '@/components/mixins/topPageMixin'
  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate
  } from "../api/localStorage.js";
  // let wecanlogin = require('wecanlogin')
  // console.log(wecanlogin)
  export default {
    name: "orderSearch",
    mixins: [mergeFunc, openZimessage, searchCmptMixins],
    components: {
      flightAssignment,
    },
    props: {
      isMonitor: {//是否是订单监控页面
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: "orderSearch.vue",
        dialogPeicang: false,
        addPcShow: false,
        inputViewData: {
          hbrq: {
            title: "航班日期", type: 15, defaultVal: true,
            // pickerOptions: {
            //   disabledDate (time) {
            //     // 禁用小于三个月前的日期
            //     let prevDate = new Date()
            //     prevDate.setMonth(prevDate.getMonth() - 3)
            //     prevDate.setHours(0,0,0,0)

            //     if (time.getTime() < prevDate.getTime()) {
            //       return true
            //     }
            //     return false
            //   }
            // }
          },
        },
        inputModelData: {
          // status: "AO5010,AO5040,AO5020,AO5060,AO5090,AO5030,AO5050,AO5025"
        },
        costControlDialog: false, //批量分摊弹窗
        shareRecordDialog: false,
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1, //点击打开展开分单索引
        selectTableIndex: "",
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
        costMakingVisible: false
      };
    },
    created() {
      //  console.log(111111)
      //  console.log(this.$store.state.navDataById[this.$route.params.id])
      // console.log(this.$store.state.cities.map(i=>i.options).flat().map(i=>i.value))
      // console.log(JSON.parse(localStorage.groupType).filter(i=>i.groupid==53).map(i=>i.typename))
      // console.log(this.$store.state.areaState)
      if (this.isMonitor) {
        this.$set(this.inputModelData, "status", "AO5020,AO5040")
        this.inputViewData.hbrq = { title: "航班日期", type: 15, defaultVal: false, defaultEnd: true, endtype: 3 }
        if (this.isMonitor) {
          this.$nextTick(() => {
            this.inputViewData.status.disabled = true
          })
        }
      }
    },
    // mounted() {
    // console.log(this.inputModelData)
    // console.log(this.$data)
    // },
    methods: {
      delTableIndex(data) {
        this.dialogShow = false;
        // if(data.nodel==2){
        //    this.tableDataRes.splice(this.selectTableIndex,1)
        // }
      },
      openChatRoome(row){
          //this.$emit('openChatRoome',obj)
          //从表格列表项进入 使用下面代码
          this.$store.commit("setChat", { status: true, data: row });
      },
      dialogPcFunc() {
        if (this.$store.state.areaState.split(",").length != 1) {
          this.$message.error("请选择区域！");
          return;
        }

        if (this.peicangGuidArr.length == 0) {
          this.$message.error("请先选择！");
          return;
        }

        let thereCode = [];
        this.tableDataRes.forEach(i => {
          if (i.checked && !thereCode.includes(i.mawb.substr(0, 3))) {
            thereCode.push(i.mawb.substr(0, 3));
          }
        });

        if (thereCode.length != 1) {
          this.$confirm("运单航司不同, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.dialogPeicang = true;
            })
            .catch(() => { });
        } else {
          this.dialogPeicang = true;
        }
        /*   if(this.peicangGuidArr.length>0){
                 this.dialogPeicang=true
              }else{
                this.$message.error("请先选择！")
              } */
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
      // getZimessage(msg) {
      //     console.log(msg)
      //     if(!msg.hpoType){
      //       this.getHawbList(msg);
      //     }else{
      //       let data=this.ziTableData[msg.index]
      //       this.mawbguid = data.hpoid ;
      //       this.boguid = data.oldboguid;
      //       this.orderdom = data.orderdom;
      //       this.area = data.area;
      //       this.dialogShow = true;
      //     }

      // },
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

        if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
          return this.$message.error('请输入或选择查询条件！');
        }
        // 如果输入了订舱编号或总运单号或分运单号则无视航班日期限制
        if (!this.searchData.pono && !this.searchData.mawb && !this.searchData.shipperno && !this.searchData.hawb && !this.isMonitor) {
          if (!this.searchData.hbrq || !this.searchData.hbrq.begin) {
            return this.$message.error('请选择航班日期开始日期')
          }
          // 只能查询跨度为三个月的数据，大于三个月时进行提示
          if (this.searchData.hbrq.begin && this.searchData.hbrq.end) {
            let maxEnd = new Date(this.searchData.hbrq.begin.split(' ')[0])
            maxEnd.setMonth(maxEnd.getMonth() + 3)

            if (new Date(this.searchData.hbrq.end.split(' ')[0]).getTime() > maxEnd.getTime()) {
              return this.$message.error('该页面仅提供3个月内的数据查询')
            }
          }
        }
        if (this.isMonitor) {
          this.searchData.canceling = 0;
        }

        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };
        var json = { json: JSON.stringify(jsonArr2), routerName: this.name.split('.')[0] };

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoboAxplineGeneral",
          params: json,
          loading: true,
          tip: false
        })
          .then(results => {
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            // results.data = getChangeValue(results.data, "空出");
            setTimeout(() => {
              // this.tableDataRes = results.data;
              let data = results.data.map(i => {
                /*  if(!i.mawb||i.hbh){
                   i.checkDisabled=true;
                 } */
                /*
                    可以拼单
                      1.在签单确认前  才可以 status<300
                      2.可拼      才可以  1可 2否 comboine 1
                      3.未拼       才可以  1是 2否 iscomboine 2
                      4.无总运单号     才可以
                      5. 自货才可以
                      6 canceling 等于0
                      7.system 等于 空出
                      8.isinwageallin 不等于4
                   */

                if (i.czlx != '唯凯配舱' || i.mawb || i.system != '空出' || i.iscomboine == 1 || i.comboine != 1 || i.status >= 300 || i.isinwageallin == 4 || i.canceling != 0 || this.isMonitor) {
                  i.checkDisabled = true;
                }
                return i
              })

              this.tableDataRes = getChangeValue(data, "空出");
            }, 0);
          })
          .catch(errors => { });
      },
      openDialog(indexData) {
        this.selectTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.orderdom = this.tableDataRes[indexData].orderdom;
        this.area = this.tableDataRes[indexData].area;
        //console.log(this.mawbguid)
        this.dialogShow = true;
      },
      openDialog2(indexData) {
        this.selectedTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.costMakingVisible = true
      },
      uncostMaking() {
        this.costMakingVisible = false
        // 重新计算应收应付金额
        this.tableDataRes[this.selectedTableIndex].wageall_in = this.$refs.costDialog.zdtotalCharge
        this.tableDataRes[this.selectedTableIndex].wageall_out = this.$refs.costDialog.zdtotalPayment
        this.tableDataRes[this.selectedTableIndex].wageprofit = Number(Number(this.$refs.costDialog.zdtotalCharge) - Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
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
            var json = {};
            json.ShipaceList = jsonArr;
            json.isdel = 2;
            this.$axios({
              method: "put",
              url: this.$store.state.webApi + "api/ExHpoAxplineShipaceBatch",
              data: json,
              loading: true,
              tip: false
            }).then(results => {
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
                this.shipaceInfoData.qfsj = qfsj;
              }
            } else {
              // layer.msg('未查询到相应的起飞时间!');
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
        //  this.jjdArr=JSON.parse(localStorage.jjd).filter(e=>e.sfg==this.shipaceInfoData.sfg).map(i=>{return {label:i.cname,value:i.cname}})
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
      },
    },
    computed: {
      peicangGuidArr() {
        var arr = [];
        var flag = true;
        this.tableDataRes.forEach(i => {
          //  let twoCode=i.hbh?i.hbh.substr(0,2):''

          if (i.checked && i.mawb) {
            //  if(arr.length==0){
            //    arr.push({guid:i.guid,sfg:i.sfg,mdg:i.mdg,loadingmodel:i.loadingmodel,twoCode:twoCode})
            // }else{
            //   if(i.sfg!=arr[arr.length-1].sfg||i.mdg!=arr[arr.length-1].mdg||i.loadingmodel!=arr[arr.length-1].loadingmodel||twoCode!=arr[arr.length-1].twoCode){
            //       flag=false
            //   }else{
            //     arr.push({guid:i.guid,sfg:i.sfg,mdg:i.mdg,loadingmodel:i.loadingmodel,twoCode:twoCode})
            //   }
            // }
            arr.push({ guid: i.guid, mawb: i.mawb });
          }
        });
        //console.log(arr)
        // if(flag){
        //   return arr
        // }else{
        //    this.$message.error('批量配舱的始发港、目的港、配载方式、航司二字码必须相同');
        //     this.tableDataRes.forEach(i=>{
        //       i.checked=false
        //     })
        //   return []
        // }

        return arr;
      }
    }
  };
</script>


<style scoped lang="less">

</style>