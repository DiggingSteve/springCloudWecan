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
        :search-data.sync="searchData" :chinese-where.sync="chineseWhere" :pageshow.sync="pageshow" @reset="reset" system="空进">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="print(1,true)" :disabled="!this.tableDataRes.filter(i=>i.checked).length">到货通知书打印</el-button>
        <el-button @click="print(2,true)" :disabled="!this.tableDataRes.filter(i=>i.checked).length">流转单打印</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <!-- <el-button @click="openMergeDialog" v-if="$store.state.ifMergeHawb">订单合并</el-button> -->
      </div>
    </div>


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"
      :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal" @wageConfirmStatus="openDialog2">
      <template slot="display" slot-scope="props">
        <i class="el-icon-map-location" title="节点信息" @click="jiedianShow=true;displayIndex=props.data.index"></i>
        <i class="el-icon-picture" title="本票照片" @click="showImgFunc(props.data.index)"></i>
        <i class="el-icon-printer" @click="print(1,false,props.data.row)" title="到货通知书打印"></i>
        <i class="el-icon-printer" @click="print(2,false,props.data.row)" title="流转单打印"></i>
            <el-badge is-dot class="item" v-if=" props.data.row.status !== '未受理' || props.data.row.status === 'undefined' "      :hidden="$store.state.readMessageList.indexOf(props.data.row.guid) > -1 ? false : true" style="vertical-align:none"   >
              <i class="el-icon-chat-dot-square"  @click="openChatRoome(props.data.row)"></i>
            </el-badge>
      </template>
      <!-- <template slot="ysfs" slot-scope="props">
        {{getById(props.data.row,'64','ysfs')}}
      </template> -->
      <template slot="jsfs" slot-scope="props">
        {{props.data.value=='1'?'现结':'月结'}}
      </template>
      <template slot="isbreakpiece" slot-scope="props">
        {{getById(props.data.row,'260','isbreakpiece')}}
      </template>
      <template slot="otherpiece" slot-scope="props">
        {{getById(props.data.row,'260','otherpiece')}}
      </template>
      <template slot="isabadon" slot-scope="props">
        {{getById(props.data.row,'260','isabadon')}}
      </template>
    
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <transition enter-active-class="animate__animated animate__zoomInDown"
      leave-active-class="animate__animated animate__zoomOutRight">
      <el-dialog title="综合查询" center :visible.sync="dialogShow" v-if="dialogShow" class="dialogPage"
        :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
        <mawbaddput :visible.sync="dialogShow" :pagetype="'6'" :mawbguid="mawbguid" :boguid="boguid"
          :area="area" :orderdom="orderdom" @update="delTableIndex" @success="mergeSuc"></mawbaddput>
      </el-dialog>


    </transition>


    <el-dialog title="费用未确认" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>
      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog" pagetype="2">
      </costmaking>
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

     <el-dialog :visible.sync="printShow" :close-on-click-modal="false" v-if="printShow" width="1100px" class="arrivePrint">
        <arrivePrint :boguid="boguidCheck" :visible.sync="printShow"></arrivePrint>
     </el-dialog>

     <el-dialog :visible.sync="printShow2" :close-on-click-modal="false" v-if="printShow2" width="1100px" class="arrivePrint">
        <operatePrint :boguid="boguidCheck" :visible.sync="printShow2"></operatePrint>
     </el-dialog>
    
  </div>
</template>
<script>
  import jiedian from "./orderDetails/jiedian";
  import arrivePrint from './templates/arrivePrint';
  import operatePrint from './templates/operatePrint';
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
    name: "orderSearchAi",
    mixins: [mergeFunc, openZimessage, searchCmptMixins],
    components: {
    jiedian,arrivePrint,operatePrint
    },
    props: {

    },
    data() {
      return {
        name: "orderSearchAi.vue",
        dialogPeicang: false,
        addPcShow: false,
        inputViewData: {
          hbrq: {
            title: "到港日期", type: 15,
          },
        },
        inputModelData: {
        },

        mawbDetail: {},

        putIndex: -1, //点击打开展开分单索引
        selectTableIndex: "",

        costMakingVisible: false,
        jiedianShow:false,
        imgShow:false,
        imgUrl:'',
        displayIndex:'-1',
        groupIdList:[{field:'ysfs',groupid:'64'},{field:'isbreakpiece',groupid:'260'},{field:'otherpiece',groupid:'260'},{field:'isabadon',groupid:'260'}],
        printShow:false,//到货打印显示隐藏
        printShow2:false,//流转单打印显示
        boguidCheck:'',//选中boguid
      };
    },
    created() {

    },
 
    methods: {
      delTableIndex(data) {
        this.dialogShow = false;
      },
      openChatRoome(row){
          //this.$emit('openChatRoome',obj)
          //从表格列表项进入 使用下面代码
          this.$store.commit("setChat", { status: true, data: row });
      },
      showImgFunc(index) {
        this.imgShow = true;
        let data = this.tableDataRes[index];

        let mawbtype = data.orderdom == "直单" ? 1 : 2;
        let usrname = localStorage.usrname;
        this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=-1&area=${data.area}&boguid=${data.boguid}&orderSystem=空进`;
      },
      getById(val,id,field){
        if(val[field]){
          return this.allGroupType.filter(i=>i.groupid==id&&i.ready01==String(val[field]))[0]['typename']
        }
      },
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
        let begin = new Date();
        if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
          return this.$message.error('请输入或选择查询条件！');
        }
        // 如果输入了订舱编号或总运单号或分运单号则无视航班日期限制
        // if (!this.searchData.pono && !this.searchData.mawb && !this.searchData.shipperno && !this.searchData.hawb) {
        //   if (!this.searchData.hbrq || !this.searchData.hbrq.begin) {
        //     return this.$message.error('请选择航班日期开始日期')
        //   }
        //   // 只能查询跨度为三个月的数据，大于三个月时进行提示
        //   if (this.searchData.hbrq.begin && this.searchData.hbrq.end) {
        //     let maxEnd = new Date(this.searchData.hbrq.begin.split(' ')[0])
        //     maxEnd.setMonth(maxEnd.getMonth() + 3)

        //     if (new Date(this.searchData.hbrq.end.split(' ')[0]).getTime() > maxEnd.getTime()) {
        //       return this.$message.error('该页面仅提供3个月内的数据查询')
        //     }
        //   }
        // }
        //console.log(this.searchData.hbrq)
       

        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };

        if(!this.searchData.hbrq){
           begin.setMonth(begin.getMonth() - 6);
           jsonArr2.where.hbrq={begin:formatDate(new Date(begin), "yyyy-MM-dd") + " 00:00:00"}
       }

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

                // if (i.czlx != '唯凯配舱' || i.mawb || i.system != '空出' || i.iscomboine == 1 || i.comboine != 1 || i.status >= 300 || i.isinwageallin == 4 || i.canceling != 0 || this.isMonitor) {
                //   i.checkDisabled = true;
                // }
                return i
              })

              this.tableDataRes = getChangeValue(data, "空进");
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
      // 流转单打印 text 1.到货通知书2.流转单打印   type是否批量
      print(text,type,data){
        if(type){
          this.boguidCheck=this.tableDataRes.filter(i=>i.checked).map(i=>i.boguid).join(',')
        }else{
          this.boguidCheck=data.boguid
        }
        if(text==1){
           this.printShow=true
        }else{
          this.printShow2=true
        }
       
      }

    },
    computed: {
     allGroupType(){
       return JSON.parse(localStorage.groupType)
     }
    }
  };
</script>


<style scoped lang="less">
.arrivePrint{
  /deep/.el-dialog{
    border-radius:8px;
    .el-dialog__body{
      padding:30px 28px;
    }
  }
}
</style>