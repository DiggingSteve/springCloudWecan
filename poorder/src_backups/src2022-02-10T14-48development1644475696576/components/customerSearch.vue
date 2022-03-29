<template>
  <div>
    <div class="page-container-box">
      <!-- {{selectTableIndex}} -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere" :pagetype="1"
        @reset="reset"></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
      :showTotal="showTotal" @wageConfirmStatus="openDialog2" @transSelIndex="openDialog">
      <template slot="display" slot-scope="props">
        <i class="el-icon-map-location" title="节点信息" @click="jiedianShow=true;displayIndex=props.data.index"></i>
        <i class="el-icon-picture" title="本票照片" @click="showImgFunc(props.data.index)"></i>
        <!-- <i class="el-icon-document" title="本票文档" @click="showImgFunc(props.data.index)"></i> -->
        <span :index="props.data.index" @click="openDialog(props.data.index,true)"><i class="el-icon-upload"
            title="本票文档上传，可直接拖动文档到此列上传"></i></span>
          <!-- <span :index="props.data.index" @click="openChatRoome(props.data.row,true)"> -->
            <!-- <i class="el-icon-chat-dot-square"
            title="订单通讯"></i> -->
       
            <el-badge is-dot class="item" v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "      :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
              <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
            </el-badge>
            <!-- </span> -->
      </template>
      <template slot="pono" slot-scope="props">
        <span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]"
          @click="openDialog(props.data.index)">{{props.data.value}}</span>
      </template>
      <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i></template> -->
      <!-- <template slot="printFile" slot-scope="props"><i>&nbsp;</i></template> -->
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <el-dialog title="客服综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" pagetype="14" :mawbguid="mawbguid" :boguid="boguid" :area="area"
        :orderdom="orderdom" @update="delTableIndex" :positionDocUpload="positionDocUpload"></mawbaddput>
    </el-dialog>

    <el-dialog :visible.sync="jiedianShow" width="90%" title="节点状态信息" top="4%" center v-if="jiedianShow"
      :close-on-press-escape="false" append-to-body>
      <jiedian :mawbinfo="tableDataRes[displayIndex]" :orderdom="tableDataRes[displayIndex].orderdom"></jiedian>
    </el-dialog>

    <el-dialog :visible.sync="imgShow" class="dialogImgDoc" :close-on-click-modal="false" v-if="imgShow" width="980px"
      append-to-body top="0">
      <iframe :src="imgUrl" frameborder="0" allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"></iframe>
    </el-dialog>

    <el-dialog title="费用未确认" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" pagetype="2"
        costDom="客服" :showSuggestWage="true"></costmaking>
    </el-dialog>

        <docUpload :dialogShow.sync="dialogDoc" :dialogPosition="dialogPosition" :modelData="mawbDetail"
          :prevUpload.sync="prevUpload" @close="openDialog(selectTableIndex)" v-if="dialogDoc" pagetype="2" selectTableIndex="-1">
        </docUpload>


  </div>
</template>
<script>
  import flightAssignment from "./orderDetails/flightAssignment"; //航班配舱
  import jiedian from "./orderDetails/jiedian";
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate
  } from "../api/localStorage.js";
  export default {
    name: "customerSearch",
    mixins: [openZimessage, searchCmptMixins],
    components: {
      flightAssignment,
      jiedian
    },
    data() {
      return {
        name: "customerSearch.vue",
        chatRoom:{
            showStatus:false
        },
        dialogShow: false,
        dialogPeicang: false,
        addPcShow: false,
        jiedianShow: false,
        imgShow: false,
        inputViewData: {},
        inputModelData: {
          //  "status": "AO5040,AO5020,AO5060,AO5090,AO5030,AO5050,AO5025"
        },
        costControlDialog: false, //批量分摊弹窗
        shareRecordDialog: false,
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1, //点击打开展开分单索引
        selectTableIndex: "-1",
        displayIndex: -1, //点击照片节点的索引
        imgUrl: "",
        selectTableIndex: -1,
        costMakingVisible: false,
        dialogDoc: false,
        prevUpload: true,
        dialogPosition: {},//上传弹窗的定位
        positionDocUpload:false//直接定位到文档上传
      };
    },

    methods: {
      delTableIndex(data) {
        this.dialogShow = false;
        // if(data.nodel==2){
        //    this.tableDataRes.splice(this.selectTableIndex,1)
        // }
      },

      showImgFunc(index) {
        this.imgShow = true;
        let data = this.tableDataRes[index];

        let mawbtype = data.orderdom == "直单" ? 1 : 2;
        let usrname = localStorage.usrname;
        this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${data.area}&boguid=${data.boguid}`;
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
        if (
          this.$store.state.ifLimitSearch &&
          Object.keys(this.searchData).length == 0
        ) {
          return this.$message.error("请输入或选择查询条件！");
        }
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };
        var json = { json: JSON.stringify(jsonArr2) };

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoboAxplineCustomerGeneral",
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
              // this.tableDataRes=results.data;
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
      //   //   this.inputModelData={"status":"AO5040,AO5020,AO5060,AO5070,AO5080,AO5030,AO5050,AO5025"}
      // },
      openDialog(indexData, positionDocUpload = false) {
        //alert('1')
        if (indexData < 0) return;
        this.selectTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.orderdom = this.tableDataRes[indexData].orderdom;
        this.area = this.tableDataRes[indexData].area;
        this.positionDocUpload = positionDocUpload
        this.dialogShow = true;
      },
      openDialog2(indexData) {
        this.selectedTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.costMakingVisible = true;
      },
      openChatRoome(row){
        console.log(row)
    
          this.$store.commit("setChat", { status: true, data: row });
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
      }
    },
    watch: {},

    created() { },
    computed: {},
    mounted(){
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
          // console.log(ev)
          // oBox.innerHTML = '请将文件拖拽到此区域';
          let className = ev.path[0].className;
          let index = $(ev.path[0]).find('span').attr('index');
          // console.log(className)
          // console.log(index)
          if (className == 'display') {

            that.dialogPosition = {
              x: ev.clientX + 20,
              y: ev.clientY - 20
            }
            that.selectTableIndex =index;
            that.mawbDetail = that.tableDataRes[index]
            that.dialogDoc = true
          }
          that.prevUpload = true
          // console.log(that.prevUpload)


        };
        oBox.ondrop = function (ev) {
          var oFile = ev.dataTransfer.files[0];
          var reader = new FileReader();
          that.dialogDoc = false


          //读取成功
          reader.onload = function () {
            console.log(reader);
          };
          // reader.onloadstart = function () {
          //   alert('读取开始');
          // };
          // reader.onloadend = function () {
          //   alert('读取结束');
          // };
          // reader.onabort = function () {
          //   alert('中断');
          // };
          // reader.onerror = function () {
          //   alert('读取失败');
          // };
          // reader.onprogress = function (ev) {
          //   var scale = ev.loaded / ev.total;
          //   if (scale >= 0.5) {
          //     reader.abort();
          //   }
          // };
          // console.log(reader)

          reader.readAsDataURL(oFile, 'base64');
          // console.log(reader)

          return false;
        };
      })
    }
 

  };
</script>


<style scoped lang="less">

</style>