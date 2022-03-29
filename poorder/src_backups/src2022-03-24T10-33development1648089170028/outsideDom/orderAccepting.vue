<template>
  <div>
    <div class="page-container-box">
      <!--         {{overIndex}} -->
      <!-- {{tableDataRes}} -->
      <!--         {{chineseWhere}} -->
      <!--         {{searchData}} -->
      <!--         {{searchData}}
        {{inputModelData}} -->
      <!--       {{inputViewData}} -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1" @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <p style="float:left">
          <el-button @click="search" type="primary">{{$t('outside.inquiry')}}</el-button>
        </p>
        <!-- <p style="float:right"> -->
          <!-- <el-button @click="reset" type="default" style="margin-right:2px;" v-if="pageshow">{{$t('message.reset')}}
          </el-button> -->
          <!-- <el-button @click="reset" type="default" style="margin-right:2px;" v-if="pageshow">{{$t('outside.reset')}}
          </el-button> -->
          <!--  <el-button  @click="setPageshow=!setPageshow" >
          {{setPageshow?'收起':'展开'}}
          </el-button> -->
        <!-- </p> -->
      </div>
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <div class="tableWraper" >
      <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
        @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
        :showTotal="showTotal" :overIndex.sync="overIndex">


        <template slot="mawb" slot-scope="props">
          <el-tooltip class="item" effect="light" :content="$t('tips.mawbdownload')" placement="bottom-start"
            v-if="props.data.row.ismawbdoc=='1'">
            <!-- <i class="download" @click.stop="urlF('1',props.data.row)" v-if="props.data.row.ismawbdoc=='1'"></i> -->
          </el-tooltip>
        </template>

        <template slot="hawb" slot-scope="props">
          <el-tooltip class="item" effect="light" :content="$t('tips.hawbdownload')" placement="bottom-start"
            v-if="props.data.row.ishawbdoc=='1'">
            <i class="download" @click.stop="urlF('2',props.data.row)" v-if="props.data.row.ishawbdoc=='1'"></i>
          </el-tooltip>
        </template>


        <template slot="detail" slot-scope="props">
          <el-tooltip class="item" effect="light" :content="$t('tips.detail')" placement="bottom-start">
            <i class="el-icon-arrow-right detail" @click="dialogOpen(props.data.row)"
              :style="{'color':overIndex==props.data.index?'#fff':'','background':overIndex==props.data.index?'#116cf3':''}"
              style="float:right;margin-right:30px;margin-top:6px;">
            </i>

          </el-tooltip>
        </template>


      </tableCompt>
    </div>
    <!-- 订单详细 -->
    <el-dialog center :visible.sync="dialogShow" class="dialogPage" :close-on-click-modal="false"
      :close-on-press-escape="false" width="100%" top="0px" :modal="false"  v-if="dialogShow">
      <goods-info :modelData="modelData" :hawbinfoList="hawbinfoList" :visible.sync="dialogShow" effect="1"
        :serviceList="serviceList" v-if="dialogShow&&modelData.boguid"></goods-info>
    </el-dialog>

    <!-- 订单预览 -->
    <el-dialog center :visible.sync="expressShow" :close-on-click-modal="false" :close-on-press-escape="false"
      width="1200px" top="0%" :modal="false" custom-class="setDialog" height="100%" @close="url=''">
      <h2>
        <!-- {{pzNumber}}({{$t('tips.tips4')}}) -->
        {{printNum}}({{$t('tips.tips10')}})
      </h2>

      <embed :src="url" width="98%" v-if="url" height="800px">


    </el-dialog>

  </div>
</template>

<script>

  import { searCondition, getChangeValue, computedWeight, formatDate } from '@/outsideDom/api/sessionStorage.js'
  export default {
    name: 'orderAccepting',
    data() {
      return {
        name: "orderAccepting.vue",
        showTotal: { all: true, ybjzt: true, sjjzt: true, zdjzt: true, wageprofit: true, realwageall: false, billwageall: false, wageall: false, finishwageall: false, finishwageall_checkbill: false, thisfinishwageall_checkbillrmb: false },
        inputViewData: {
          pono: { 'title': '订舱编号', type: 1 },
          //status:{'title':'订单状态',type:5,groupid:144,"whereStr":"in"},
          mawb: { 'title': '总运单号', type: 1, verify: 'mawb' },
          hawb: { 'title': '分运单号', type: 1 },
          hbh: { 'title': '航班号', type: 1 },
          hbrq: { 'title': '航班日期', type: 15, defaultVal: true },
          // khjcbh:{'title':'进仓编号',type:1},
          qsd: { 'title': '起始地', type: 1 },
          sfg: { 'title': '始发港', type: 1 },
          mdg: { 'title': '目的港', type: 1 },
          mdd: { 'title': '目的地', type: 1 },
          // area: {title: "地区",type: 23,groupid: 101, whereStr: "in",fieldtype: 3},
        },
        inputModelData: {},
        searchData: {},
        chineseWhere: [],
        pageshow: true,
        tableDataRes: [],
        ziTableData: [],
        putIndex: -1, //点击打开展开分单索引
        dialogShow: false,
        ishawbdoc: '',//分单下载
        ismawbdoc: '',//总单下载
        operguid: '',//预览图片地址参数
        orderdom: '',
        resultsBack: [],//用于状态值中英文切换
        overIndex: '-1',//鼠标放在行上样式
        cancelType: '',//撤单原因
        url: '',//预览PDF地址
        expressShow: false,
        printNum: '',
        modelData: {},//总单数据
        hawbinfoList: [],//分单列表
        serviceList: [],//服务列表
        //setPageshow:true,
      }


    },
    created() {





    },
    computed: {


    },
    watch: {
      '$store.state.status': {
        handler(val) {
          //alert('1')
          //console.log(val==this.inputModelData.status)
          if (val) {
            //this.$set(this.inputModelData,'status',val)
            this.dialogShow = false
            this.search2(val)
          }
        },
        immediate: true

      },
      //     '$i18n.locale'(val){

      //   if(this.resultsBack.length>0){
      //     console.log(this.resultsBack)
      // this.tableDataRes=getChangeValue(this.resultsBack,'空出',val)
      //   }

      //  }

    },
    methods: {
      getZimessage(msg) {
        this.getHawbList(msg)
      },
      // 预览

      urlF(type, data) {//type 1总单 2分单 3打包
        this.expressShow = true
        if (type == '1') {
          this.url = `${this.$store.state.webApi}api/ExHpoAxplineMawbDoc?mawb=${data.mawb}&operguid=${data.operguid}`
          //this.printNum=data.mawb
        } else if (type == '2') {
          this.url = `${this.$store.state.webApi}api/ExHpoAxplineHawbDoc?mawb=${data.mawb}&operguid=${data.operguid}`
          //this.printNum=data.mawb
        } else if (type == '3') {
          this.url = `${this.$store.state.webApi}api/ExHpoAxplineDoc?mawb=${data.mawb}&operguid=${data.operguid}`
        }
        this.printNum = data.mawb
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
          this.dialogOpen(msg.row)

          // this.dialogShow=true
          // this.boguid=msg.row.boguid
          // this.ishawbdoc=msg.row.ishawbdoc
          // this.ismawbdoc=msg.row.ismawbdoc
          // this.orderdom=msg.row.orderdom
          // this.cancelType=msg.row.cancelreason
          // this.operguid=msg.row.operguid

        }

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

        //console.log(this.searchData.hbrq.begin)
        //console.log(this.inputModelData.hbrq.begin.getMonth())
        this.tableDataRes = [];
        this.ziTableData = [];
        this.searchData.status = { in: '1' }
        var jsonArr2 = {
          where: this.searchData,
          order: "hbrq desc"
        }

        // if(val){
        //  jsonArr2={
        //   where:{"status":{"in":val}},
        //   order:"hbrq desc"
        // }
        // }else{

        // jsonArr2={
        //   where:this.searchData,
        //   order:"hbrq desc"
        // }
        // }
        var json = { 'json': JSON.stringify(jsonArr2) }
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoboAxplineGeneral', params: json, loading: true, tip: false })
          .then(results => {

            if (results.data.length > 0) {
              this.pageshow = false
            } else {
              this.$message(this.$t('common.noresults'));
            }

            results.data.forEach(item => {
              this.$set(item, 'statusBk', item.status)
            })

            this.resultsBack = JSON.parse(JSON.stringify(results.data))
            // var handlerField=['status','ybjzt','realjzt','zdjzt','hwxz','hwlx','accountweightin','ports','hbrq','yqhbrq','qfsj','deliverydate','fpbl_in']
            let now = new Date()
            // results.data=getChangeValue(results.data,'空出',this.$i18n.locale)
            // console.log(new Date().getTime() - now.getTime())
            setTimeout(() => {
              this.tableDataRes = getChangeValue(results.data, '空出', this.$i18n.locale);

            }, 20)
          })
          .catch(error => {

          })
      },
      //状态默认修改
      search2(val) {
        //alert('1')
        if (val != this.inputModelData.status || val == '1') {
          var jsonArr2 = {
            where: { "status": { "in": val } },
            order: "hbrq desc"
          }
          var json = { 'json': JSON.stringify(jsonArr2) }

          this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoboAxplineGeneral', params: json, loading: true, tip: false })
            .then(results => {

              if (results.data.length > 0) {
                this.pageshow = false
              }
              this.$set(this.inputModelData, 'status', val)

              results.data.forEach(item => {
                this.$set(item, 'statusBk', item.status)
              })

              this.resultsBack = JSON.parse(JSON.stringify(results.data))
              this.$store.commit('setStatus', '')
              results.data = getChangeValue(results.data, '空出', this.$i18n.locale)
              setTimeout(() => {
                this.tableDataRes = results.data;

              }, 20)
            })
            .catch(error => {

            })
        }



      },

      dialogOpen(row) {

        //this.boguid=row.boguid
        this.ishawbdoc = row.ishawbdoc
        this.ismawbdoc = row.ismawbdoc
        //this.orderdom=row.orderdom
        //this.cancelType=row.cancelreason
        //this.operguid=row.operguid
        //this.boguid="18981895065518080"
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxpline', params: { boguid: row.boguid }, loading: true, tip: false })
          .then(results => {
            this.modelData = results.data
            this.modelData.wtkhname = sessionStorage.out_usr_name
            this.modelData.opersystem = this.modelData.system.split('')[0] + '运'
            this.modelData.opersystemdom = this.modelData.system.split('')[1] + '口'
            this.modelData.inwageallinprice = this.modelData.inwageallinprice == '666666' ? '' : this.modelData.inwageallinprice
            this.modelData.inwageallinprice_trans = this.modelData.inwageallinprice_trans == '666666' ? '' : this.modelData.inwageallinprice_trans
            this.hawbinfoList = this.modelData.axpList
            this.serviceList = this.modelData.serviceList
            this.dialogShow = true
          })
          .catch(error => {

          })

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