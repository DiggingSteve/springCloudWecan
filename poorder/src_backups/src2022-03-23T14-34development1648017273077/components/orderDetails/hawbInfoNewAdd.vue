<template>
  <div>

    <!-- <commonTabs :list="tabsList" :showExpanionBtn="false" :checkedIndex.sync="tabChecked" :showTooltip="false"
      titlefield="title">
  </commonTabs> -->

      <div class="fdinformation">

        <div v-show="tabChecked==0" class="detail hawbinfo" style="padding-bottom:10px;margin-top: 0px;">
          <p class="detailTitle">分单基本信息</p>
          <new-form-cmpt :view-data="hawbViewData" :model-data="hawbdata">
            <template slot="khjcno">
              <khjcnoSelect :value.sync="hawbdata.khjcno" @select="khjcnoSelectFunc" :saveNumberList="useList">
              </khjcnoSelect>
            </template>

            <div slot="khjcnoTable" style="width:600px;">
              <commonTable :head="jcnoTableHead" v-if="hawbdata.ybstoreList" :table-data="hawbdata.ybstoreList"
                :zi-index="ziIndex">
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

            <template slot="exForm1">
              <hwxzComptNew :inputModelData="hawbdata" :hidehwxz="true"></hwxzComptNew>
            </template>
          </new-form-cmpt>
          <div>
            <p class="detailTitle">分单收发货人</p>
            <el-collapse-transition>
              <div>
                <revSedHawb :dzinfo="hawbdata" ref='makeBillRevSed'>
                </revSedHawb>
                <revSed :dzinfo="hawbdata" dom=2 ref="tzrRev">
                </revSed>
              </div>
            </el-collapse-transition>
          </div>
        </div>

        <div class="detail" v-show="tabChecked==1" style="padding-bottom:10px;margin-top: 0px;">
          <p class="detailTitle">分单收发货人</p>
          <el-collapse-transition>
            <div>
              <revSedHawb :dzinfo="hawbdata" ref='makeBillRevSed'>
              </revSedHawb>
              <revSed :dzinfo="hawbdata" dom=2 ref="tzrRev">
              </revSed>
            </div>
          </el-collapse-transition>
        </div>
      </div>
  </div>

</template>

<script>


  import revSedHawb from '@/components/templates/revSedHawb'
  import khjcnoSelect from '@/components/templates/khjcnoSelect'
  import revSed from '@/components/templates/revSed'

  import { searCondition, reset, evaluationModel, revsendPerson } from '../../api/localStorage.js'


  export default {
    components: {
      revSedHawb, khjcnoSelect, revSed
    },
    props: {
      hawbdata: Object,
      mawbdetail: Object
    },
    data() {
      return {
        tabsList: [
          { title: '分单基本信息' },
          // { title: '分单收发货人信息' },
        ],
        tabChecked: 0,
        hawbViewData: {
          hawb: {
            title: "分运单号",
            type: 1,
            elEvent: {
              eventName: 'change',
              eventFunc: this.hawbChange,
            },
            required: true
          },
          khjcno: {
            title: "进仓编号"
          },
          sfg: {
            title: "分单始发港",
            type: 20,
            pagetype: 6,
          },
          mdg: {
            title: '分单目的港',
            type: 20,
            pagetype: 6,
          },
          ybpiece: { "title": "分单件数", type: 1, disabled: true },
          ybweight: { "title": "分单重量", type: 1, disabled: true },
          ybvolume: { "title": "分单体积", type: 1, disabled: true },
          smallpiece: {
            "title": "小件数", type: 1,
            elEvent: {
              eventName: 'blur',
              eventFunc: this.setMawbSmallpiece
            }
          },
          khjcnoTable: {
            title: '分单进仓编号'
          },
          exForm1: {
            idStyle: {
              width: "100%",
              marginBottom: "-14px"
            },
            itemStyle: {
              width: "100%"
            },
            titleStyle: {
              display: "none"
            }
          },
          tradeterm: {
            title: "贸易方式",
            type: 16,
            idStyle: {
              width: "100%",
              margin: "8px 0px"
            },
            itemStyle: {
              width: "100%"
            },
            options: [{
              title: "Freight  Prepaid",
              detailS: [

              ]
            },
            {
              title: "Freight  Collect",
              detailS: [

              ]
            }
            ]
          },
          currency: {
            title: "运费币种",
            type: 3,
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            },
            options: [], //需要
            default: '人民币'
          },
          rate: {
            title: "运费单价",
            type: 1,
            idStyle: {
              width: "100%"
            }
          },
          englishpm: {
            title: "英文品名",
            type: 17,
            verify: "uppercase",
            itemStyle: {
              width: "560px"
            }
          },
          // chinesepm: {
          //   title: "中文品名：",
          //   type: 17,
          //   itemStyle: {
          //     width: "560px"
          //   }
          // },
          remark: {
            title: "备注",
            type: 17,
            itemStyle: {
              width: "560px"
            }
          },
        },
        jcnoTableHead: [
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
      if (this.mawbdetail.isoutsideadd) {//外网新增页面
        this.hawbViewData.rate.hidden = true;
        this.hawbViewData.chinesepm.hidden = true;
      }

      this.$watch(() => {
        return this.hawbdata.khjcno
      }, (val, old) => {
        let newval = val && val.split(',') || [];
        let oldval = old && old.split(',') || [];
        let add = newval.filter(i => !oldval.includes(i));
        let del = oldval.filter(i => !newval.includes(i));
        del.forEach(i => {
          this.mawbdetail.ybstoreList.forEach(e => {
            if (e.khjcno == i) {
              e.hawb = ""
            }
          })
        })
        add.forEach(i => {
          this.mawbdetail.ybstoreList.forEach(e => {
            if (e.khjcno == i) {
              this.hawbChange()
            }
          })
        })
        this.$set(this.hawbdata, 'ybstoreList', this.mawbdetail.ybstoreList.filter(i => newval.includes(i.khjcno)))
      }, { deep: true, immediate: true })

      // this.$watch(() => {
      //   return this.hawbdata.smallpiece
      // }, (val, old) => {

      //   this.mawbdetail.smallpiece=this.mawbdetail.hawbList.reduce((prev, i) => (prev += Number(i.smallpiece)), 0)

      // }, { deep: true, immediate: true })

    },

    watch: {

    },
    methods: {
      openZitable(index) {
        if (index == this.ziIndex) {
          this.ziIndex = -1
        } else {
          this.ziIndex = index
        }
      },
      setMawbSmallpiece() {
        this.mawbdetail.smallpiece = this.mawbdetail.hawbList.reduce((prev, i) => (prev += Number(i.smallpiece)), 0)
      },
      checkHasLimit() {//检查字数限制
        return this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit()
      },
      khjcnoSelectFunc(val) {
        this.hawbdata.ybpiece = val.piece
        this.hawbdata.ybweight = val.weight
        this.hawbdata.ybvolume = val.volume
        this.hawbdata.smallpiece = this.hawbdata.smallpiece || val.piece //默认为分单件数
        this.setMawbSmallpiece()
      },
      hawbChange() {
        // console.log(this.hawbdata.hawb)
        //在分单中配置了进仓编号，需要在货物信息中改变对应进仓编号的分运单号
        this.mawbdetail.ybstoreList.forEach(i => {
          if ((i.timestamp && i.timestamp == this.hawbdata.timestamp) || (this.hawbdata.khjcno && this.hawbdata.khjcno.split(',').includes(i.khjcno))) {
            i.hawb = this.hawbdata.hawb;
            // i.status=true
          }
        })
      }

    },
    computed: {
      useList() {
        // console.log(this.hawbdata.khjcno && this.hawbdata.khjcno.split(","))
        return this.mawbdetail.ybstoreList.filter(i => i.khjcno && i.piece && i.weight && i.volume && (!i.status || this.hawbdata.khjcno && this.hawbdata.khjcno.split(",").includes(i.khjcno)))
      }


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