<template>
  <div>
    <div class="fdinformation">
      <div class="detail hawbinfo" style="padding-bottom:10px">
        <p class="detailTitle">分单基本信息</p>
        <formCompt :input-view-data="hawbViewData" :input-model-data="hawbdata">
          <template slot="exForm">
            <hwxzComptNew style="margin-bottom:-14px" :inputModelData="hawbdata" :hidehwxz="true"></hwxzComptNew>
          </template>
        </formCompt>

        <div style="width:600px;margin-bottom:10px;margin-left:40px;">
          <div class="input-title" style="margin-bottom:10px;margin-left:-14px">分单进仓编号：</div>
          <commonTable :head="jcnoTableHead" :table-data="hawbdata.ybstoreList" :zi-index="ziIndex">
            <template slot="khjcno" slot-scope="props">
              <div><i class="el-icon-circle-plus-outline" @click="openZitable(props.data.index)"
                  style="float:left"></i>{{props.data.value}}</div>
            </template>
            <template slot="ziTable" v-if="hawbdata.ybstoreList[ziIndex]">
              <commonTable :head="ziTableHead" :table-data="hawbdata.ybstoreList[ziIndex].ybstorevolumeList">
                <template slot="size" slot-scope="props">
                  <div>{{props.data.row.longs}}*{{props.data.row.widths}}*{{props.data.row.heights}}</div>
                </template>
              </commonTable>
            </template>
          </commonTable>
        </div>
      </div>
      <div class="detail">
        <p class="detailTitle">分单收发货人</p>
        <el-collapse-transition>
          <div>
            <revSedHawb :dzinfo="hawbdata" ref='makeBillRevSed'>
            </revSedHawb>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>

</template>

<script>


  import revSedHawb from "../templates/revSedHawb"

  import { searCondition, reset, evaluationModel, revsendPerson } from '../../api/localStorage.js'


  export default {
    components: {
      revSedHawb
    },
    props: {
      hawbdata: Object
    },
    data() {
      return {
        detailShow: { pane1: false, pane2: false },
        showfdinformation: true,
        showserviceedit: false,
        dialogFormVisible: false,
        hwlxOptions: [],
        batterymodelOp: [],
        hawbViewData: [
          { "title": "分运单号：", id: "hawb", type: 1, "model": "", "defaultModel": "", class: 'width289' },
          { "title": "分单始发港：", id: "sfg", type: 1, "model": "", "defaultModel": "", class: 'width289' },
          { "title": "分单目的港：", id: "mdg", type: 1, "model": "", "defaultModel": "", class: 'width289' },
          { "title": "", class: 'width289' },
          { "title": "分单件数：", id: "ybpiece", type: 1, "model": "", "defaultModel": "", class: 'width289', verify: 'integer' },
          { "title": "分单重量：", id: "ybweight", type: 1, "model": "", "defaultModel": "", class: 'width289', verify: 'fixedTwo' },
          { "title": "分单体积：", id: "ybvolume", type: 1, "model": "", "defaultModel": "", class: 'width289', verify: 'fixedThree' },
          { "title": "小件数：", id: "smallpiece", type: 1, "model": "", "defaultModel": "", class: 'width289', verify: 'integer' },
          // {"title":"货物类型：",class:'allwidth',width:100,"id":"hwlx"},
          // {"title":"锂电池型号：",class:'allwidth',width:100,"id":"batterymodel"},
          { "id": "exForm", "class": "width100", left: 0 },
          { "title": "贸易方式：", id: "tradeterm", type: 16, "class": "width100", width: 100, "model": "", "defaultModel": "", minW: 80, options: [{ title: "Freight  Prepaid", detailS: [] }, { title: "Freight  Collect", detailS: [] }], required: true },
          { "title": "运费币种：", width: 100, model: "", defaultModel: "人民币", type: 3, options: [], class: "allwidth", id: "currency" },
          { "title": "运费单价：", id: "rate", type: 1, "model": "", "defaultModel": "", width: "100", class: "width289" },
          { "title": "英文品名：", model: "", defaultModel: "", type: 17, class: 'width579', "id": "englishpm", verify: 'uppercase' },
          { "title": "中文品名：", model: "", defaultModel: "", type: 17, class: 'width579', id: "chinesepm" },
          { "title": "唛头：", model: "", defaultModel: "", type: 17, class: 'width579', "id": "remark" },
        ]
        , jcnoTableHead: [
          { title: "进仓编号", field: "khjcno" },
          { title: "件数", field: "piece" },
          { title: "重量", field: "weight" },
          { title: "体积", field: "volume" },
          { title: "入库类型", field: "storeType" }
        ]
        , jcnoTableData: []
        , ziTableHead: [
          { title: "包装类型", field: "packagetypename" },
          { title: "件数", field: "piece" },
          { title: "尺寸", field: "size" },

        ]

        , ziIndex: -1

      }

    },
    created() {



    },

    watch: {

    },
    methods: {
      openZitable(index) {
        //  alert(index)
        if (index == this.ziIndex) {
          this.ziIndex = -1
        } else {
          this.ziIndex = index
        }
      },
      checkHasLimit() {//检查字数限制
        return this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit()
      }

    },
    computed: {



    }

  }
</script>

<style lang='less'>
  .fdinformation {
    .detail {
      background: #f8f8f8;
      position: relative;
      margin-bottom: 18px;
      border: 1px solid #e8e8e8;
    }

    .detailTitle {
      font-size: 14px;
      color: #333;
    }

    .detail .detailTitle {
      background: #f8f8f8;
      color: #0f5a8c;
      padding: 5px 5px 5px 10px;
      font-size: 14px;
      font-weight: bolder;
      border-bottom: 1px solid #e8e8e8;

      ~div {
        margin-top: 10px;
      }
    }

    .hawbinfo {
      position: relative;

      .service-edit-btn {
        margin-left: 5px;
        float: right;
        height: 28px;
        padding: 0 15px;
        color: #0f5a8c;
      }

      .service-edit-c {
        position: absolute;
        overflow: hidden;
        top: 34px;
        left: -1px;
        box-sizing: content-box;
        width: 100%;
        z-index: 1;
        margin: 0 !important;
        background: #fff;
        border: 1px solid #e8e8e8;
        box-shadow: 0 10px 20px -10px;
        transition: height .5s;
        height: 0;

        &.show {
          height: 218px;
        }
      }
    }

    /deep/ .service {
      margin: 8px 200px 10px 60px;

      .serviceTitle {
        display: inline-block;
        width: 150px;
        margin-left: 20px;
        text-align: left;

        ~.checkbox {
          float: left;
          width: 14px;
          height: 14px;
        }
      }

      .oprequest,
      .oprequest p {
        position: relative;
        display: inline-block;
      }

      .oprequest .oprequest-text {
        position: absolute;
        top: 0;
        left: 100px;
        width: 200px;
        height: 70px;
      }

      .operating {
        width: 145px;
        height: 28px;
        margin-bottom: 10px;

        span {
          position: relative;
          font-size: 14px;
          font-weight: bolder;
          color: #0f5a8c;

          &::after {
            content: ' ';
            display: block;
            position: absolute;
            top: 7px;
            right: -15px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #c8c8c8;
          }
        }
      }
    }

    .content-c {
      margin: 16px 20px 15px;

      >div {
        margin-bottom: 20px;
      }

      span {
        display: inline-block;
        min-width: 90px;
        margin-right: 5px;
        text-align: right;
      }

      b {
        display: inline-block;
        width: 110px;
        margin-right: 20px;

        +label {
          min-width: 60px;
        }
      }

      .el-input {
        width: 65%;
      }

      .el-textarea {
        width: 500px;
        vertical-align: top;
      }
    }

    .mdgserviceTitle,
    .sfgserviceTitle {
      margin-left: 6px;
      width: 145px;
      height: 28px;
      font-size: 14px;
      color: #333;
      font-weight: bolder;
      margin-bottom: 10px;
    }

    /deep/ .mdgService .detail:last-child {
      margin-bottom: 0;
    }

    .sfgCarSv /deep/ .detail,
    .sfgincargo .detail {
      margin: 0;
      border: 0;
    }
  }

  .servicePanel {
    margin-bottom: 25px;

    strong {
      font-size: 16px;
      color: #0F5A8C;
    }

    small {
      margin-left: 10px;
      cursor: pointer;
    }
  }
</style>