<template>
  <div class="ownSubmissionStl">
    <!-- {{searchData}} -->
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere"
        @reset="reset">
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search" type="primary">查询</el-button>
      </div>

    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData" showZiConfig :chinese-where.sync="chineseWhere">
      <template slot="pono" slot-scope="props"><span @click="openDialog(props.data.index)"
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']">{{props.data.value}}</span></template>

    </tableCompt>

    <el-dialog :visible.sync="dialogShow" class="dialogPage" :close-on-click-modal="false" v-if="dialogShow"
      width="100%" :modal="false" top="0" title="未提交结算(本站订单)" center>
      <costDetail :mawbguid="mawbguid" :orderdom="orderdom" @back="dialogShow=false" :boguid="boguid"></costDetail>
    </el-dialog>


  </div>
</template>

<script>

  import { searCondition, getChangeValue } from '../api/localStorage.js'
  import costDetail from './orderDetails/costDetail'
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  export default {
    name: "ownSubmissionStl",
    components: {
      costDetail
    },
    mixins: [openZimessage, searchCmptMixins],
    data() {
      return {
        name: 'ownSubmissionStl.vue',
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
          status: { 'title': '订单状态', type: 5, "whereStr": "in", options: [{ label: '已完成', value: 'AO5060' }, { label: '已撤单', value: 'AO5065' }], dom: '订单状态', hidden: true },
          //  status:{title:'订单状态',type:5,dom:"订单状态",whereStr:'in',hidden:true},
          cancelman: { 'title': '撤单人', type: 1, disabled: true },

        },
        inputModelData: {
          status: 'AO5060',
          confirmstatus: '700',
        },
      }
    },
    methods: {
      search() {
        //var jsonArr=searCondition(this.inputViewData)
        this.tableDataRes = []
        this.searchData.orderguid = "-1"

        var jsonArr2 = {
          where: this.searchData,
          "order": "hbrq desc,adddate desc"
          // skip:"0",
          // take:"10",
          // top:"10",
        }
        var json = { 'json': JSON.stringify(jsonArr2) }
        //let test = JSON.stringify({guid: 1})
        //
        //ExHpoboAxplineGeneral
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoboAxplineUnSubmit', params: json, loading: true, tip: true }).then(results => {
          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          results.data = getChangeValue(results.data, '空出')
          // 处理日期和件重体
          //    setTimeout(()=>{

          //    results.data.forEach((item,index)=>{

          //  if(item.hbrq){
          //    item.hbrq=dateFormat(item.hbrq,"yyyy-mm-dd")

          //  }

          //  item.ybjzt=item.ybpiece+"/"+pointChange(item.ybweight,2)+"/"+pointChange(item.ybvolume,3)
          //  item.areadom=this.$store.state.areaState+item.dom


          // })
          //    },10)
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 20)

        })
          .catch(errors => {

          })
      },
      openDialog(indexData) {
        this.mawbguid = this.tableDataRes[indexData].guid
        this.orderdom = this.tableDataRes[indexData].orderdom
        this.boguid = this.tableDataRes[indexData].boguid
        //console.log(this.mawbguid)
        this.dialogShow = true
      },
    }
  }
</script>

<style lang="less" scoped>

</style>