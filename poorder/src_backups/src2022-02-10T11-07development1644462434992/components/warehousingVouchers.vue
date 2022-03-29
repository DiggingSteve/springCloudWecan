<template>
  <div>
    <div class="page-container-box">
      <!-- {{peicangGuidArr}} -->
      <!-- {{selectTableIndex}} -->
      <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->
      <!-- {{mawbguid}}-->
      <!-- {{ziTableData}} -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1" @reset="reset">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
      </div>


    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
      <template slot="pono" slot-scope="props"><span class="poczColor"
          @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
    </tableCompt>


    <el-dialog v-if="dialogShow" center :visible.sync="dialogShow" class="dialogPage" :close-on-click-modal="false"
      :close-on-press-escape="false" width="100%" top="0px" :modal="false" style="min-height:600px">
      <voucherDetail :boguid="tableDataRes[selectTableIndex].boguid" :visible.sync="dialogShow"></voucherDetail>
    </el-dialog>




  </div>
</template>
<script>


  import voucherDetail from './orderDetails/voucherDetail'
  import { searCondition, getChangeValue, computedWeight, formatDate, getValByGrouid } from '../api/localStorage.js'
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";





  export default {
    name: 'warehousingVouchers',
    components: {
      voucherDetail
    },
    mixins: [openZimessage, searchCmptMixins],

    data() {
      return {
        name: "warehousingVouchers.vue",
        inputViewData: {
          hbrq: { 'title': '航班日期', type: 15, titleStyle: { 'minWidth': '100px' }, defaultVal: true }
        },
        inputModelData: {

        },
        selectTableIndex: -1,
        putIndex: -1, //点击打开展开分单索引

      }
    },

    methods: {

      search() {

        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        }
        var json = { 'json': JSON.stringify(jsonArr2) }
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoboAxplineGeneralWarehouseVoucher', params: json, loading: true, tip: false }).then(results => {
          //console.log(results)
          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          this.tableDataRes = getChangeValue(results.data, '空出')


        })
          .catch(errors => {

          })

      },
      openDialog(indexData) {
        this.selectTableIndex = indexData
        this.dialogShow = true
      }

    },
    watch: {

    },

    created() {



    },
    computed: {


    }

  }
</script>


<style scoped lang="less">
  .el-dialog__wrapper {
    /deep/ .el-dialog__body {
      padding: 5px 25px 30px;

      /deep/ .el-form-item__content>div {
        //   width:186px
      }
    }
  }
</style>