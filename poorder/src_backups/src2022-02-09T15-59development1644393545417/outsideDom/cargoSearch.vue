<template>
  <div>

    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1"
        @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <p style="float:left">
          <el-button @click="search" type="primary">{{$t('outside.inquiry')}}</el-button>
        </p>
        <!-- <p style="float:right">
           <el-button @click="reset" type="default" style="margin-right:2px;" v-if="pageshow">{{$t('outside.reset')}}</el-button> -->
        <!--  <el-button  @click="setPageshow=!setPageshow" >
          {{setPageshow?'收起':'展开'}}
          </el-button> -->
        <!-- </p> -->
      </div>
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <div class="tableWraper">
      <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
        @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" :chinese-where="chineseWhere"
        openDetailFields="khjcno" @transSelIndex="dialogOpen" showZiConfig :overIndex.sync="overIndex">

        <!-- <template slot="operation" slot-scope="props">

          <el-tooltip class="item" effect="light" :content="$t('tips.download')" placement="bottom-start">
            <span class="download" @click.stop="downLoad"></span>
          </el-tooltip>



        </template> -->



        <!-- <template slot="khjcno" slot-scope="props">

 <el-tooltip class="item" effect="light" :content="$t('tips.inhousedown')" placement="bottom-start" v-if="props.data.row.weight">
 <i class="download" @click.stop="urlF(props.data.row)" v-if="props.data.row.weight"></i>
 </el-tooltip>

 </template> -->

        <!--    <template slot="hawb" slot-scope="props">
     <el-tooltip class="item" effect="light" :content="props.data.value" placement="bottom-start">
 <span style="color:#116cf3" @click="dialogOpen(props.data.row)">{{props.data.value.split(',')[0]}}</span>
 </el-tooltip>
 </template> -->

        <!-- <template slot="detail" slot-scope="props">
  <el-tooltip class="item" effect="light" :content="$t('tips.detail')" placement="bottom-start">
    <i class="el-icon-arrow-right detail" @click="dialogOpen(props.data.row)" :style="{'color':overIndex==props.data.index?'#fff':'','background':overIndex==props.data.index?'#116cf3':''}"></i>
  </el-tooltip>
 </template> -->


      </tableCompt>






    </div>



    <el-dialog center :visible.sync="dialogShow" v-if="dialogShow" class="dialogPage" :close-on-click-modal="false"
      :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <cargoDeatil :visible.sync="dialogShow" :area="area" :storeguid="storeguid"></cargoDeatil>
    </el-dialog>

    <!-- 订单预览 -->
    <el-dialog center :visible.sync="expressShow" :close-on-click-modal="false" :close-on-press-escape="false"
      width="1200px" top="0%" :modal="false" custom-class="setDialog" height="100%" @close="url=''">
      <h2>
        <!-- {{pzNumber}}({{$t('tips.tips4')}}) -->
        {{printNum}}
      </h2>

      <embed :src="url" width="98%" v-if="url" height="800px">


    </el-dialog>

  </div>
</template>

<script>

  import { searCondition, getChangeValue, computedWeight, formatDate } from '@/outsideDom/api/sessionStorage.js'
  import cargoDeatil from './orderDetails/cargoDeatil'
  export default {
    name: 'cargoSearch',
    components: {
      cargoDeatil
    },
    data() {
      return {
        name: "cargoSearch.vue",
        inputViewData: {
          pono: { 'title': '订舱编号', type: 1 },
          mawb: { 'title': '总运单号', type: 1, verify: 'mawb' },
          hbh: { 'title': '航班号', type: 1 },
          hbrq: { 'title': '航班日期', type: 15 },
          qsd: { 'title': '起始地', type: 1 },
          sfg: { 'title': '始发港', type: 1 },
          mdg: { 'title': '目的港', type: 1 },
          mdd: { 'title': '目的地', type: 1 },
          hwstatus: { 'title': '货物状态', type: 5, groupid: 145, "whereStr": "in" },
          jcdate: { 'title': '入库时间', type: 15, defaultVal: true },
          hzdno: { 'title': '回执单号', type: 1 },
          khjcbh: { 'title': '进仓编号', type: 1 },
          goodsremark: { 'title': '货物备注', type: 1 }


        },
        inputModelData: {},
        searchData: {},
        chineseWhere: [],
        pageshow: true,
        tableDataRes: [],
        ziTableData: [],
        putIndex: -1, //点击打开展开分单索引
        dialogShow: false,
        storeguid: '',
        area: '',
        resultsBack: [],
        overIndex: '-1',
        url: '',//入库单预览地址
        expressShow: false,//预览弹框
        printNum: ''//进仓编号
        //setPageshow:true,
      }


    },
    created() {






    },
    computed: {


    },
    watch: {
      // '$i18n.locale'(val){
      //  if(this.resultsBack.length>0){
      //   this.tableDataRes=getChangeValue(this.resultsBack,'空出',val)
      //  }
      // }




    },
    methods: {
      getZimessage(msg) {
        this.getHawbList(msg)
      },
      downLoad() {
        console.log('下载')
      },
      // 打印？
      transmitZiMsg(msg) {

        if (!msg.row) {
          this.printIndex = msg.index

          this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxpline', params: { boguid: this.tableDataRes[this.putIndex].boguid }, loading: false, tip: false }).then(results => {
            var data = results.data
            this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAxpline', params: { guid: this.ziTableData[msg.index].guid }, loading: true, tip: false }).then(res => {
              var hawbdata = res.data
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
        } else {
          //console.log(msg.row.boguid)
          this.dialogShow = true
          this.storeguid = msg.row.id
          this.area = msg.row.area
          //this.storeguid='1449614'
          //this.area='上海'
        }

      },

      urlF(data) {//type 1总单 2分单 3打包
        this.expressShow = true

        this.url = `${this.$store.state.webApi}api/ExHpoStoreDoc?storeguid=${data.id}&area=${data.area}`

        this.printNum = data.khjcno
      },

      getHawbList(msg) {
        this.putIndex = msg.index

        this.ziTableData = [];
        let guid = this.tableDataRes[msg.index].guid

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAxpline', params: { hpoidHawbList: guid }, loading: false, tip: false }).then(results => {

          if (results.data.length == 0) {
            this.$message('无查询结果！');
            return;
          } else {
            results.data = getChangeValue(results.data, '空出')
            setTimeout(() => {
              this.ziTableData = results.data;
            }, 20)

          }



        })
      },
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "jcdate desc"
        }
        //jsonArr2.where.gid=sessionStorage.gid
        var json = { 'json': JSON.stringify(jsonArr2) }
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoStore', params: json, loading: true, tip: false, nofield: true })
          .then(results => {
            //results.data[0].weight=0
            if (results.data.length > 0) {
              this.pageshow = false
            } else {
              this.$message(this.$t('common.noresults'));
            }
            results.data.forEach(item => {
              this.$set(item, 'statusHwBk', item.hwstatus)
            })
            //this.$set(results.data,'statusHwBk',results.data.hwstatus)
            this.resultsBack = JSON.parse(JSON.stringify(results.data))
            //this.$set(this.resultsBack,'statusHwBk',this.resultsBack.hwstatus)   
            //this.$set

            results.data = getChangeValue(results.data, '空出', this.$i18n.locale)

            setTimeout(() => {
              this.tableDataRes = results.data;

            }, 20)
          })
          .catch(error => {

          })
      },
      dialogOpen(index) {
        let row = this.tableDataRes[index]
        this.dialogShow = true
        //this.boguid=row.boguid
        this.storeguid = row.id
        //this.storeguid='1449614'
        //this.area='上海'
        this.area = row.area
      },
      reset() {
        this.inputModelData = {}
      }











    }
  }
</script>

<style lang="less" scoped>
  @import './outSearch.css';
</style>