<template>
  <div>
    <div class="page-container-box">
      <!-- {{selectTableIndex}} -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1"
        @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <el-button @click="peicheBill">派遣单打印</el-button>
      </div>


    </div>


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
      :showTotal="showTotal" @wageConfirmStatus="openDialog2" @transSelIndex="openDialog">
      <template slot="display" slot-scope="props">
        <i class="el-icon-map-location" title="节点信息" @click="jiedianShow=true;displayIndex=props.data.index"></i>
        <i class='el-icon-picture' title="本票照片" @click="showImgFunc(props.data.index)"></i>
      </template>
      <!-- <template slot="pono" slot-scope="props"><span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]" @click="openDialog(props.data.index)">{{props.data.value}}</span></template> -->
      <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i></template> -->
      <!-- <template slot="printFile" slot-scope="props"><i>&nbsp;</i></template> -->
    </tableCompt>



    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <el-dialog title="客服综合查询" v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="dialogShow" :pagetype="isMonitor?20:14" :mawbguid="mawbguid" :boguid="boguid"
        :area="area" :orderdom="orderdom" @update="delTableIndex"></mawbaddput>
    </el-dialog>


    <!-- 总单费用制作非合并 -->
    <el-dialog title="费用未确认" :visible.sync="costMakingVisible" width="100%" top="0" v-if="costMakingVisible"
      @close="uncostMaking" :close-on-press-escape="false" class="dialogPage" :modal="false" center>

      <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid" ref="costDialog"></costmaking>
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

    <el-dialog :visible.sync="dialogPcd" class="dialogImgDoc" v-if="dialogPcd" width="1200px" append-to-body top="1%">
      <iframe :src="pcdUrl" frameborder="0" allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"></iframe>
    </el-dialog>


  </div>
</template>
<script>

  import flightAssignment from './orderDetails/flightAssignment' //航班配舱
  import jiedian from './orderDetails/jiedian'
  import { systemCheck, openZimessage, searchCmptMixins } from '@/components/mixins/topPageMixin'

  import { searCondition, getChangeValue, computedWeight, formatDate } from '../api/localStorage.js'
  export default {
    name: 'gnSearch',
    mixins: [openZimessage, searchCmptMixins],
    components: {
      flightAssignment, jiedian
    },
    props: {
      isMonitor: {//是否是订单监控页面
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: "gnSearch.vue",
        dialogPeicang: false,
        addPcShow: false,
        jiedianShow: false,
        imgShow: false,
        dialogPcd: false,
        pcdUrl: '',
        inputViewData: {
          adddate: { title: '创建时间', type: 15, defaultVal: true, begintype: 4 },
          hbrq: { title: "航班日期", type: 15 },
        },
        inputModelData: {
          "status": "AO5010,AO5040,AO5020,AO5060,AO5090,AO5030,AO5050,AO5025",
          //relshr_deli: localStorage.usrname
        },
        costControlDialog: false,//批量分摊弹窗
        shareRecordDialog: false,
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1, //点击打开展开分单索引
        selectTableIndex: '-1',
        displayIndex: -1,//点击照片节点的索引
        imgUrl: '',
        costMakingVisible: false
      }
    },

    methods: {
      delTableIndex(data) {
        this.dialogShow = false
        // if(data.nodel==2){
        //    this.tableDataRes.splice(this.selectTableIndex,1)
        // }
      },

      showImgFunc(index) {
        this.imgShow = true;
        let data = this.tableDataRes[index]

        let mawbtype = data.orderdom == '直单' ? 1 : 2
        let usrname = localStorage.usrname
        this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${this.area}`;

      },
      peicheBill() {
        let pono = this.tableDataRes.filter(i => i.checked).map(i => i.pono).toString();
        let truckgids = this.tableDataRes.filter(i => i.checked).map(i => i.truckgid).filter(i => i != -1)
        //  console.log(truckgids)
        //  console.log([...new Set(truckgids)])

        if (!pono) {
          return this.$message.error('请先选择!')
        }
        if ([...new Set(truckgids)].length > 1) {
          return this.$message.error('卡车供应商不同，无法批量打印!')
        }
        this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=BOGNtempletNEW.frx&pono=${pono}&czman=${localStorage.usrname}&multipage=${pono.includes(',')}&shipaceid=-1`;
        this.dialogPcd = true;
      },

      printFileFunc(index) {
        this.printIndex = index
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxpline', params: { boguid: this.tableDataRes[index].boguid }, loading: false, tip: false }).then(results => {
          this.mawbDetail = results.data
          setTimeout(() => {
            this.$refs.makingbill && this.$refs.makingbill.printFunc()
            this.printIndex = -1 //让组件重新渲染以取到制单数据
          }, 500);
        })
      },
      wtdataP(data) {

      },
      transmitZiMsg(msg) {


        this.printIndex = msg.index

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxpline', params: { boguid: this.tableDataRes[this.putIndex].boguid }, loading: false, tip: false }).then(results => {
          var data = results.data
          this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAxpline', params: { guid: this.ziTableData[msg.index].guid }, loading: true, tip: false }).then(res => {


            var hawbdata = res.data

            //  //console.log(222222222)
            //  //console.log(JSON.stringify(hawbdata))

            data.mdg = hawbdata.mdg
            data.zdpiece = hawbdata.zdpiece
            data.zdweight = hawbdata.zdweight
            data.zdvolume = hawbdata.zdvolume
            data.smallpiece = hawbdata.smallpiece
            data.englishpm = hawbdata.englishpm
            data.jfweight = computedWeight(hawbdata.zdvolume, hawbdata.zdweight)
            data.hawb = hawbdata.hawb
            data.guid = hawbdata.guid
            data.orderdom = '分单'
            this.mawbDetail = data
            setTimeout(() => {
              this.$refs.makingbill && this.$refs.makingbill.printFunc()
              this.printIndex = -1
            }, 500);

          })
        })



      },
      search() {
        this.selectTableIndex = -1
        if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
          return this.$message.error('请输入或选择查询条件！');
        }
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        }
        var json = { 'json': JSON.stringify(jsonArr2), routerName: this.name.split('.')[0] }

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoServiceGeneral', params: json, loading: true, tip: false }).then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          results.data = getChangeValue(results.data, '空出')
          setTimeout(() => {
            // this.tableDataRes=results.data;
            this.tableDataRes = results.data.map(i => {
              //  if(!i.mawb||i.hbh){
              //    i.checkDisabled=true;
              //  }
              return i
            })
          }, 0)
        })
          .catch(errors => {

          })

      },

      // reset(){
      //    // reset(this.inputViewData)
      //    this.inputModelData={"status":"AO5040,AO5020,AO5060,AO5070,AO5080,AO5030,AO5050,AO5025"}

      // },
      openDialog(indexData) {

        this.selectTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.orderdom = this.tableDataRes[indexData].orderdom
        this.area = this.tableDataRes[indexData].area
        //console.log(this.mawbguid)
        this.dialogShow = true
      },
      openDialog2(indexData) {
        this.selectedTableIndex = indexData
        let td = this.tableDataRes[indexData]
        this.mawbguid = td.guid
        this.boguid = td.boguid
        this.costMakingVisible = true
      },
      uncostMaking() {
        this.costMakingVisible = false;
        // 重新计算应收应付金额
        this.tableDataRes[this.selectedTableIndex].wageall_in = this.$refs.costDialog.zdtotalCharge
        this.tableDataRes[this.selectedTableIndex].wageall_out = this.$refs.costDialog.zdtotalPayment
        this.tableDataRes[this.selectedTableIndex].wageprofit = Number(Number(this.$refs.costDialog.zdtotalCharge) - Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)


      },

    },
    watch: {

    },

    created() {
      if (this.isMonitor) {
        this.$set(this.inputModelData, "status", "AO5020,AO5040")
        this.inputViewData.hbrq = { title: "航班日期", type: 15, defaultVal: false, defaultEnd: true, endtype: 3 }
        this.inputViewData.adddate.defaultVal = false;
        this.$nextTick(() => {
          this.inputViewData.status.disabled = true
        })
      }
    },
    computed: {



    }

  }
</script>


<style scoped lang="less">
  // .el-dialog__wrapper{
  //   /deep/ .el-dialog__body{
  //   padding:5px 25px 30px;
  //   /deep/ .el-form-item__content>div{
  //  //   width:186px
  //   }
  // }
  // }
</style>