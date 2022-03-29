<template>
  <div>
    <!-- {{searchData}} -->
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <!-- <el-button  @click="dialogPcFunc">批量航班配舱</el-button>
                <el-button  @click="cancelPeicang">批量解除配舱</el-button> -->
      </div>



    </div>
    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData" showZiConfig :chinese-where.sync="chineseWhere">
      <template slot="pono" slot-scope="props"><span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
          @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
      <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证"
          @click="printFileFunc(props.data.index)"></i></template>
    </tableCompt>



    <!-- mawbguid  当前点击pono所对应的guid -->
    <el-dialog :visible.sync="dialogShow" v-if="dialogShow" class="dialogPage" :close-on-click-modal="false"
      :close-on-press-escape="false" width="100%" top="0px" :modal="false" center title="未提交结算(已撤单)">
      <mawbaddput :visible.sync="dialogShow" :mawbguid="mawbguid" :boguid="boguid" :area="area" :orderdom="orderdom">
      </mawbaddput>
    </el-dialog>

    <el-dialog :visible.sync="dialogPeicang" :close-on-click-modal="false" v-if="dialogPeicang" width="1100px">
      <flightAssignment :peicangGuidArr="peicangGuidArr" :dialogshow.sync="dialogPeicang"></flightAssignment>
    </el-dialog>

    <!-- {{mawbDetail}} -->
    <div style="display:none">
      <makingBill :mawbguid="mawbDetail.guid" :boguid="mawbDetail.boguid" ref="makingbill"
        v-if="mawbDetail.guid&&printIndex!=-1" :orderdom="mawbDetail.orderdom" :mawbinfo="mawbDetail"></makingBill>
    </div>


  </div>
</template>
<script>


  import { openZimessage } from '@/components/mixins/topPageMixin'


  import { searCondition, getChangeValue, computedWeight } from '../api/localStorage.js'
  export default {
    name: 'orderCancel',
    components: {},
    mixins: [openZimessage],
    data() {
      return {
        name: "orderCancel.vue",
        dialogShow: false,
        dialogPeicang: false,
        inputViewData: {
          pono: { 'title': '订舱编号', type: 1, "whereStr": "like" },
          mawb: { 'title': '总运单号', type: 1, "whereStr": "like" },
          hawb: { 'title': '分运单号', type: 1 },
          orderno: { 'title': '订单来源号', type: 1 },
          fid: { 'title': '委托客户', type: 14, pagetype: '1' },
          gid: { 'title': '项目', type: 13, pagetype: '2' },
          salesarea: { 'title': '订单销售站', type: 23, groupid: 101, whereStr: 'in' },
          comhy: { 'title': '所属行业', type: 5, "whereStr": "in", groupid: 89 },
          hbh: { "title": "航班号", type: 1, pagetype: 6, "whereStr": "like", verify: 'uppercase' },
          hbrq: { 'title': '航班日期', type: 15 },
          sfg: { "title": "始发港", type: 1, verify: 'uppercase' },
          mdg: { "title": "目的港", type: 1, verify: 'uppercase' },
          confirmstatus: { title: '费用状态', type: 5, "whereStr": "in", hidden: true },
          pcstatus: { 'title': '配舱状态', type: 5, dom: '配舱状态', whereStr: 'in' },
          bgstatus: { 'title': '报关状态', type: 5, dom: '报关状态', whereStr: 'in' },
          hwstatus: { 'title': '货物状态', type: 5, dom: '货物状态', whereStr: 'in' },
          czlx: { 'title': '操作类型', type: 4, groupid: 132 },
          hwxz: { 'title': '货物性质', type: 21, groupid: 115 },
          hwlx: { 'title': '货物类型', type: 22 },
          canceltype: { title: '撤单类型', type: 5, whereStr: 'in', groupid: 135 },
          wagestatus: { title: '有无费用', type: 5, whereStr: 'in', options: [{ label: '有费用', value: '1' }, { label: '无费用', value: '0' }] },
          salesname: { 'title': '销售人', type: 1 },
          customername: { 'title': '客服负责人', type: 1 },
          addman: { 'title': '创建人', type: 1 },
          adddate: { 'title': '创建时间', type: 15 },
          // status:{'title':'订单状态',type:5,"whereStr":"in",options:[{label:'已完成',value:'AO5060'},{label:'已撤单',value:'AO5065'}],dom:'订单状态',hidden:true},
          status: { title: '订单状态', type: 5, dom: "订单状态", whereStr: 'in', hidden: true },
          cancelman: { 'title': '撤单人', type: 1 },

        },
        inputModelData: {
          status: 'AO5065',
          wagestatus: '1',
          confirmstatus: '700',
          canceltype: '报关原因,航司原因,客户原因,其他原因'
        },
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1 //点击打开展开分单索引


      }
    },

    methods: {
      dialogPcFunc() {
        if (this.peicangGuidArr.length > 0) {
          this.dialogPeicang = true
        } else {
          this.$message.error("请先选择！")
        }

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

        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        }
        var json = { 'json': JSON.stringify(jsonArr2) }
        //console.log(JSON.stringify(jsonArr2))
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoboAxplineGeneral', params: json, loading: true, tip: false }).then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          results.data = getChangeValue(results.data, '空出')
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 20)
        })
          .catch(errors => {

          })

      },

      reset() {
        // reset(this.inputViewData)
        this.inputModelData = { status: 'AO5065' }

      },
      openDialog(indexData) {

        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.orderdom = this.tableDataRes[indexData].orderdom
        this.area = this.tableDataRes[indexData].area
        //console.log(this.mawbguid)
        this.dialogShow = true
      },
      cancelPeicang() {

        var jsonArr = []
        this.tableDataRes.forEach(i => {
          if (i.checked) {
            jsonArr.push({ guid: i.guid, shipaceid: -1 })
          }
        })
        if (jsonArr.length == 0) {
          this.$message.error('请先选择！'); return
        }

        this.$confirm('确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$axios({ method: "put", url: this.$store.state.webApi + "api/ExHpoAxplineShipaceBatch", data: jsonArr, loading: true, tip: false }).then(results => {
            //console.log("批量配舱信息")
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              layer.msg("操作成功！")
            } else {
              this.$message.error("操作失败！")
            }

          })
        }).catch(() => {

        });



      }

    },

    created() {
      // setTimeout(() => {
      //    this.search()
      // }, 0);

    },
    computed: {
      peicangGuidArr() {
        var arr = []
        this.tableDataRes.forEach(i => {
          if (i.checked) {
            arr.push({ guid: i.guid })
          }
        })
        return arr
      }
    }

  }
</script>


<style scoped>

</style>