<template>
  <div>
    <div class="page-container-box">
      <!-- {{peicangGuidArr}} -->
      <!-- {{selectTableIndex}} -->
      <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->
      <!-- {{mawbguid}}-->

      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>

      </div>


    </div>


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage"
      v-on:transAmsMsg='transAmsMsg' :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
      :showTotal="showTotal">

      <template slot="print" slot-scope="props">
        <span :class="{spanDisabled:props.data.row.verificationinfo!='无异常'}">
          <i class="el-icon-printer" title="打印" :style="{color:props.data.row.verificationinfo=='无异常'?'#8e71c7':''}"
            @click="printFunc(props.data.row,1)"></i>
        </span>
      </template>

    </tableCompt>




    <div style="display:none;width:1030px" id='printDiv'>
      <section ref="print">
        <div class="manifase">

          <h2>HOUSE AIRWAYBILL LIST</h2>
          <div class="item">
            <div>AGENT/FORWARDER:</div>
            <div>FRIGHT NO:{{mawbinfo.hbh}}</div>
            <div>DESTIANTION:{{mawbinfo.mdg_mawb}}</div>
            <div>DATE:{{mawbinfo.hbrq | airdate('-')}}</div>
          </div>

          <div class="item">
            <div>
              <span style="min-width:104px">MAWB NO:</span>
              <span>签单</span>
              <span>PCS</span>
            </div>
            <div>
              <span style="min-width:86px">G.W(KG)</span>
              <span>HAWB</span>
              <span>SLAC</span>
            </div>
            <div>
              NOTE:
            </div>
          </div>

          <div class="item">
            <div>
              <span style="min-width:104px">{{mawbinfo.mawb}}</span>
              <span>检查</span>
              <span>{{mawbinfo.zdpiece_mawb}}</span>
            </div>
            <div>
              <span style="min-width:86px">{{mawbinfo.jfweight_mawb}}</span>
              <span>{{mawbinfo.hawbnum}}</span>
              <span>{{mawbinfo.smallpiece_mawb}}</span>
            </div>

            <div></div>
          </div>

          <div class="item" style="height:64px;">
            <div>
              <span style="min-width:104px">HAWB NO:</span>
              <span>有/无</span>
              <span>PCS</span>
            </div>
            <div>
              <span style="min-width:86px">G.W(KG)</span>
              <span>ORG</span>
              <span>DES</span>
            </div>
            <div>
              <span style="min-width:170px">SHIPPER NAME AND<br>DETAILED ADDRESS</span>
              <span style="min-width:156px">CONSIGNEE NAME<br>AND DETAILED<br>ADDRESS</span>
              <span style="min-width:100px">NATURE<br>OF GOODS</span>
              <span>DECLARED<br>VALUR</span>
            </div>
          </div>

          <div v-for="item in mawbinfo.hawbGroupList" class="item hawbitem" style="height:auto;" :key="item.hawb">
            <div>
              <span style="min-width:104px;justify-content:center">{{item.hawb}}</span>
              <span></span>
              <span
                style="justify-content:center">{{item.zdpiece_hawb||''}}<br>{{item.smallpiece_hawb?('(SLAC:'+item.smallpiece_hawb+')'):""}}</span>
            </div>
            <div>
              <span style="min-width:86px;justify-content:center">{{item.jfweight_hawb||''}}</span>
              <span style="justify-content:center">{{item.sfg}}</span>
              <span style="justify-content:center">{{item.mdg}}</span>
            </div>
            <div>
              <span style="min-width:170px">{{item.companytitle_fhr_hawb}}<br>{{item.address_fhr_hawb}}</span>
              <span style="min-width:156px;">
                {{item.companytitle_shr_hawb}}<br>{{item.address_shr_hawb}}
              </span>
              <span style="min-width:100px;">{{item.pm}}</span>
              <span>{{item.declarecustom}}</span>
            </div>
          </div>


        </div>
      </section>
    </div>



  </div>
</template>
<script>





  import { getChangeValue } from '../api/localStorage.js'
  import { openZimessage } from '@/components/mixins/topPageMixin'





  export default {
    name: 'manifastSearch',
    components: {

    },
    mixins: [openZimessage],
    data() {
      return {
        name: "manifastSearch.vue",
        dialogPeicang: false,
        addPcShow: false,
        inputViewData: {
          pono: { 'title': '订舱编号', type: 1, "whereStr": "like" },
          mawb: { 'title': '总运单号', type: 1, "whereStr": "like" },
          hbh: { "title": "航班号", type: 1, "whereStr": "like", verify: 'uppercase' },
          sfg: { "title": "始发港", type: 1, verify: 'uppercase' },
          hbrq: { 'title': '航班日期', type: 15, titleStyle: { 'minWidth': '100px' }, defaultVal: true },
        },
        inputModelData: {

        },
        mawbinfo: {},
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

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExHpoAxplineManifast', params: json, loading: true, tip: false }).then(results => {
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
              if (!i.mawb || i.hbh) {
                i.checkDisabled = true;
              }
              return i
            })
          }, 0)
        })
          .catch(errors => {

          })

      },


      getHawbList(msg) {
        this.putIndex = msg.index
        //获取分单列表
        this.ziTableData = [];
        let guid = this.tableDataRes[msg.index].sid

        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAxplineHawbDocAmsSend', params: { hpoid: guid }, loading: false, tip: false }).then(results => {
          //  //console.log("分单列表")
          //   //console.log(JSON.stringify(this.ziTableData))
          if (results.data.length == 0) {
            this.$message('无查询结果！');
            return;
          } else {
            results.data = getChangeValue(results.data, '空出')
            setTimeout(() => {
              this.ziTableData = results.data;
            }, 20)
            //this.ziTableData=getChangeValue(results.data)
          }



        })
      },
      reset() {
        // reset(this.inputViewData)
        this.inputModelData = {}

      },

      transAmsMsg(data) {
        console.log(data.row)
        this.mawbinfo = data.row
        this.mawbguid = data.row.hpoid
        this.orderdom = '分单'
        this.area = data.row.area
        //console.log(this.mawbguid)
        this.dialogShow = true
      },
      printFunc(data, type) {
        // window.print()
        // 1carpouch 2 维护 3 打印
        this.mawbinfo = data
        if (type == 1) {


          setTimeout(() => {
            $('#printDiv').show()
            $(".hawbitem").each(function () {
              $(this).css({ height: Number($(this).height()), 'min-height': '120px' })
            })

            this.$print(this.$refs.print) // 使用
            $('#printDiv').hide()


          }, 10);
        }

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

  .manifase {
    width: 100%;
    border: 2px solid #000000;
    font-family: 'Times New Roman';

    h2 {
      text-align: center;
      height: 100px;
      line-height: 100px;
      border-bottom: 1px solid #000000;
    }

    div.item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #000000;
      height: 24px;

      div {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 900;
        border-right: 1px solid #000000;

        span {
          flex: 1;
          display: flex;
          align-items: center;
          border-right: 1px solid #000000;
          height: 100%;

        }

        span:last-child {
          border: none;
          flex-grow: 1;
        }

      }

      div:first-child {
        width: 218px;
      }

      div:nth-child(2) {
        width: 196px;
      }

      div:nth-child(3) {
        width: 404px;
      }

      div:last-child {
        flex-grow: 1;
        border-right: none;
      }

      ;

    }

    .hawbitem {
      span {
        align-items: flex-start !important;
        color: #000000;
        font-weight: normal;
        font-size: 12px;
        flex-wrap: wrap;
        word-break: break-word;
      }
    }

    div.item:last-child {
      border: none
    }
  }
</style>