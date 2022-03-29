<template>
  <div class="mawbAddPut">
    <!-- 需要合并总单的部分 -->
    <commonTabs :list="tabslist" v-if="applicationPage==2" titlefield="title" :checkedIndex.sync="checkedIndex"
      :opendIndex.sync="opendIndex">



      <div v-show="checkedIndex==0" :class="{disabled:applicationPage==2}" v-if="opendIndex.includes(checkedIndex)">
          <mawbPact :inputModelData="inputModelData" :applicationPage="applicationPage">
            <newFormCmpt :view-data.sync="basicInformation" :model-data.sync="inputModelData">
            </newFormCmpt>
          </mawbPact>             
      </div>


      <hawbTabsOperPac :hawbInfoData="hawbInfoData" :class="{disabled:applicationPage==2}" :showtabtitle="false"
        :sendtype="sendtype" :mawbInfo="inputModelData" v-show="tabslist[checkedIndex].ishawb"
        :hawbActiveIndex="(checkedIndex-1)" v-if="opendIndex.includes(checkedIndex)&&inputModelData.orderdom=='总单'"
        :pactlsendstatus="pactlsendstatus">

      </hawbTabsOperPac>

    </commonTabs>


    <!--   {{orderdom}} -->
    <el-tabs type="border-card" v-model="activeName" v-if="applicationPage==1">
      <el-tab-pane label="总单信息" name="tab1-first">

        <mawbPact :inputModelData="inputModelData" :applicationPage="applicationPage">
                      <newFormCmpt :view-data.sync="basicInformation" :model-data.sync="inputModelData">                     
                      </newFormCmpt>
        </mawbPact>

      </el-tab-pane>
      <el-tab-pane label="分单信息" name="tab2-first" v-if="inputModelData.orderdom=='总单'">
        <hawbTabsOperPac :hawbInfoData="hawbInfoData" :mawbInfo="inputModelData" :sendtype="sendtype"
          :hawbActiveIndex="hawbActiveIndex" :pactlsendstatus="pactlsendstatus">

        </hawbTabsOperPac>
      </el-tab-pane>
      <!-- <el-button type="primary" style="float:right;margin-right:15px;margin-top:16px;" @click="savePactl"
        v-if="activeName=='tab1-first'">保存</el-button> -->
    </el-tabs>



  </div>
</template>

<script>

  import hawbTabsOperPac from "./hawbTabsOperPac";

  var mawbPact = {
    props:{
      inputModelData:Object,
      applicationPage:[Number,String]
    },
    computed: {
      parent(){
        return  this.applicationPage==1?this.$parent.$parent.$parent: this.$parent.$parent
      } 
    },
    created(){
        
    },
    template: `
         <div class="detail basic-information">
          <div class="detail-title" style="height:40px;line-height:40px;padding-left:8px;font-weight:bold;color:#0f5a8c">
            <p>基本信息</p>
          </div>
          <div class="detail-c" style="max-width:1300px;line-height:36px;">
            <div style="display:flex;flex-direction:row;justify-content:space-around;margin-bottom:10px;width:1130px;">
              <div style="width:48%">

                <div style="width:100%" class="marginb">
                  <el-input type="textarea" placeholder="抬头" v-model="inputModelData.companytitle_fhr_mawb"
                    v-verify="'uppercase'" disabled></el-input>
                </div>

                <div style="width:100%" class="marginb">
                  <el-input type="textarea" placeholder="地址" v-model="inputModelData.address_fhr_mawb" disabled>
                  </el-input>
                </div>

                <div
                  style="width: 100%; margin-top: 15px; display: flex; flex-flow: row nowrap; place-content: stretch space-between;"
                  class="marginb">
                  <div style="width:23%">
                    <el-input type="text" placeholder="国家二字码" v-model="inputModelData.companycode_fhr_mawb" disabled>
                    </el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="州名" v-model="inputModelData.state_fhr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="城市" v-model="inputModelData.city_fhr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="邮编" v-model="inputModelData.postcode_fhr_mawb" disabled>
                    </el-input>
                  </div>
                </div>

                <div
                  style="width: 100%; margin-top: 15px; display: flex; flex-flow: row nowrap; place-content: stretch space-between;"
                  class="marginb">
                  <div style="width:23%">
                    <el-input type="text" placeholder="联系人" v-model="inputModelData.lxr_fhr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="电话" v-model="inputModelData.phone_fhr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="传真" v-model="inputModelData.fax_fhr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="Email" v-model="inputModelData.email_fhr_mawb" disabled>
                    </el-input>
                  </div>
                </div>

                <div style="width:100%">
                  <el-input type="text" placeholder="信用代码" v-model="inputModelData.taxcode_fhr_mawb" disabled>
                  </el-input>
                </div>
              </div>
              <!-- 收货人 -->
              <div style="width:48%">

                <div style="width:100%" class="marginb">
                  <el-input type="textarea" placeholder="抬头" v-model="inputModelData.companytitle_shr_mawb"
                    v-verify="'uppercase'" disabled></el-input>
                </div>

                <div style="width:100%" class="marginb">
                  <el-input type="textarea" placeholder="地址" v-model="inputModelData.address_shr_mawb" disabled>
                  </el-input>
                </div>

                <div
                  style="width: 100%; margin-top: 15px; display: flex; flex-flow: row nowrap; place-content: stretch space-between;"
                  class="marginb">
                  <div style="width:23%">
                    <el-input type="text" placeholder="国家二字码" v-model="inputModelData.companycode_shr_mawb" disabled>
                    </el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="州名" v-model="inputModelData.state_shr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="城市" v-model="inputModelData.city_shr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="邮编" v-model="inputModelData.postcode_shr_mawb" disabled>
                    </el-input>
                  </div>
                </div>

                <div
                  style="width: 100%; margin-top: 15px; display: flex; flex-flow: row nowrap; place-content: stretch space-between;"
                  class="marginb">
                  <div style="width:23%">
                    <el-input type="text" placeholder="联系人" v-model="inputModelData.lxr_shr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="电话" v-model="inputModelData.phone_shr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="传真" v-model="inputModelData.fax_shr_mawb" disabled></el-input>
                  </div>
                  <div style="width:23%">
                    <el-input type="text" placeholder="Email" v-model="inputModelData.email_shr_mawb" disabled>
                    </el-input>
                  </div>
                </div>

                <div style="width:100%">
                  <el-input type="text" placeholder="信用代码" v-model="inputModelData.taxcode_shr_mawb" disabled>
                  </el-input>
                </div>
              </div>
            </div>
            <slot></slot>
          </div>
           <div style="padding:15px;text-align: right;">
          <el-button type="primary" @click="parent.savePactl">保存
          </el-button>
        </div>
        </div>
    `

  }
  export default {
    components: { hawbTabsOperPac, mawbPact },
    props: {
      sid: [Number, String],
      orderdom: String,
      gid: [Number, String],
      openType: [Number, String],
      sendtype: {
        type: [Number, String],
        default: 1  //1天运通 2东航
      },
      hawbActiveIndex: [Number, String],
      pactlsendstatus: [Number, String],
      applicationPage: {
        type: [Number, String],
        default: 1 //应用于 1 单证制作里面的，2订单详细页面的服务tab，隐藏新增分单，只读
      }
    },
    data() {
      return {
        tabslist: [
          { title: '总单AMS信息' }
        ],
        checkedIndex: 0,
        opendIndex: [0],
        activeName: 'tab1-first',
        inputModelData: {},
        hawbInfoData: [],
        basicInformation: {
          //  companytitle_fhr_mawb:{
          //  title: "发货人抬头",
          //  type: 17,
          //  itemStyle: { width: "560px" },
          //  disabled:true
          // },
          // address_fhr_mawb:{
          //  title: "发货人地址",
          //  type: 17,
          //  itemStyle: { width: "560px" },
          //   disabled:true
          // },
          handlinginfo: {
            title: "handlinginfo",
            type: 17,
            idStyle: { width: "100%" },
            itemStyle: { width: "1120px" },
          },
          mawb: {
            title: "总运单号：",
            type: 1,
            disabled: true
          },
          zdpiece: {
            title: "件数：",
            type: 1,
            disabled: true
          },
          zdweight: {
            title: "重量：",
            type: 1,
            disabled: true
          },
          jfweight: {
            title: "计费重量：",
            type: 1,
            disabled: true
          },
          zdvolume: {
            title: "体积",
            type: 1,
            disabled: true
          },
          sfg: {
            title: "始发港",
            type: 1,
            disabled: true
          },
          mdg: {
            title: "目的港",
            type: 1,
            disabled: true
          },
          hbh: {
            title: "航班号",
            type: 1,
            disabled: true
          },
          hbrq: {
            title: "航班日期",
            type: 1,
            disabled: true
          },
          smallpiece: {
            title: "小件数",
            type: 1,
            disabled: true
          },
          descriptioncode: {
            title: "Special Handing Code",
            type: 2,
            titleStyle: {
              'min-width': '150px',
              'margin-top': '-6px'
            },
            options: JSON.parse(localStorage.groupTypeCode)[147].map(i => { return { value: i.typename, label: i.typename } }),
            occupyAline: true,
            hidden: () => { return this.sendtype == 1 }
          },
          orderdom: {
            title: "单证类型：",
            type: 3,
            itemStyle: { width: "560px" },
            options: [
              { label: '总单', value: '总单' },
              { label: '直单', value: '直单' }
            ],
            disabled: false
          },
          rendertype: {
            title: "申报类型",
            type: 3,
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" },
            groupid: "105",
          },
          ismagnetic: {
            title: "是否磁检",
            type: 3,
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" },
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 2 }
            ]
          },

          pm: {
            title: "英文品名：",
            type: 17,
            verify: "uppercase",
            itemStyle: { width: "560px" },
            required: true
          },
          chinesepm: {
            title: "中文品名(补充)：",
            type: 17,
            itemStyle: { width: "560px" },

          },
          pmdeclaration: {
            title: "品名详细描述：",
            type: 17,
            idStyle: { width: "100%" },
            itemStyle: { width: "1120px" },

          },
          zdman: {
            title: "实际制单人 ：",
            type: 1,
            disabled: true
          },
          zddate: {
            title: "实际制单日期 ：",
            type: 1,
            disabled: true
          },
          modifyman: {
            title: "修改人 ：",
            type: 1,
            disabled: true
          },
          modifydate: {
            title: "修改日期 ：",
            type: 1,
            disabled: true
          },




        },

      }
    },
    methods: {
      getMawbInfo() {
        this.$axios({ method: "get", url: this.$store.state.webApi + "api/PactlZdMawb", params: { hpoid: this.sid }, loading: true, tip: false })
          .then(results => {
            this.inputModelData = results.data
            this.inputModelData.hbrq = this.inputModelData.hbrq.substring(0, 10)
            //this.inputModelData.orderdom=this.orderdom
            if (!this.inputModelData.pmdeclaration) {
              this.inputModelData.pmdeclaration = '工作原理：\n构成：\n用途：'
            }
            if (this.gid == '1719') {
              //alert('1')
              //this.basicInformation['orderdom'].disabled = true
            }
            //console.log(results.data)
          })
          .catch(error => {

          })
      },
      getHawbInfo() {
        this.$axios({ method: "get", url: this.$store.state.webApi + "api/PactlZdHawb", params: { hpoid: this.sid }, loading: true, tip: false })
          .then(results => {
            this.hawbInfoData = results.data
            this.tabslist.push(
              ...results.data.map(i => {
                return {
                  title: i.hawb,
                  ishawb: true
                }
              })
            )
            //this.inputModelData.orderdom=this.orderdom
            this.hawbInfoData.forEach(item => {
              if (!item.pmdeclaration) {
                item.pmdeclaration = '工作原理：\n构成：\n用途：'
              }

            })
            //console.log(results.data)
          })
          .catch(error => {

          })
      },
      savePactl() {
        // if(!this.inputModelData.pm){
        // 	this.$message.error('英文品名必填')
        // 	return false
        // }
        var data = { rendertype: this.inputModelData.rendertype, ismagnetic: this.inputModelData.ismagnetic, pm: this.inputModelData.pm, chinesepm: this.inputModelData.chinesepm, pmdeclaration: this.inputModelData.pmdeclaration, orderdom: this.inputModelData.orderdom, sid: this.sid, handlinginfo: this.inputModelData.handlinginfo, zdpiece: this.inputModelData.zdpiece, zdweight: this.inputModelData.zdweight, zdvolume: this.inputModelData.zdvolume, descriptioncode: this.inputModelData.descriptioncode }

        this.$axios({ method: "put", url: this.$store.state.webApi + "api/PactlZdMawb", data: data, loading: true, tip: false, noarea: '1' })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage)

            } else {
              this.$message.error(results.data.resultmessage)
            }
          })
          .catch(error => {

          })
      }
    },
    created() {
      this.getMawbInfo()
      this.getHawbInfo()
      if (this.openType == '1') {
        this.activeName = "tab1-first"
      } else if (this.openType == '2') {
        this.activeName = "tab2-first"
      }

    }
  }

</script>

<style lang="less" scoped>
  .mawbAddPut {
    .detail {
      margin-bottom: 20px;
      border: 1px solid #e8e8e8;

      &:last-child {
        margin-bottom: 0;
      }

      .detail-title {
        display: flex;
        align-items: center;
        height: 32px;
        text-indent: 12px;
        font-size: 14px;
        font-weight: bolder;
        color: #0f5a8c;
        background: #f8f8f8;
        border-bottom: 1px solid #e8e8e8;
      }

      .detail-c {
        padding: 20px;
      }
    }

    .basic-information {
      /deep/ .el-date-editor.el-input {
        width: 100%;
      }

      /deep/ .el-input__icon {
        line-height: 28px;
      }
    }

    .mdgserviceTitle,
    .sfgserviceTitle {
      margin-top: 20px;
      margin-left: 6px;
      width: 145px;
      height: 28px;
      font-size: 14px;
      color: #333;
      font-weight: bolder;
    }

    .footer {
      overflow: hidden;
      margin-top: 25px;

      .left-btn {
        float: left;
      }

      .right-btn {
        float: right;
      }
    }

    /deep/.el-textarea {
      textarea {
        height: 68px;
      }

    }
  }

  .imul {
    font-style: normal;
    display: inline-block;
    width: auto;
  }

  .forstLevel {
    display: flex;
    align-items: center;
    height: 50px;

    i {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #0f5a8c;
      margin-right: 5px;
    }

    span {
      margin-right: 25px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      color: #999999;
    }

    span.checked {
      color: #256998;
    }
  }

  /* .content {
  /deep/ .el-tabs__header {
    max-width:1400px;
    width:calc(100% - 120px);
  }
} */

  .content .el-tab-pane {
    padding: 0px;
  }

  .fdpzPanel {
    /deep/ .el-form-item {
      min-width: 300px;
      font-size: 12px;
    }

    /deep/ .el-input__inner {
      width: 167px;
    }
  }

  .infoPane(@minw, @lin) {
    /deep/ .el-form-item {
      min-width: @minw;
    }

    /deep/ .el-form-item__label {
      line-height: @lin;
      color: #333;
      font-size: 12px;
    }
  }

  .maPane {
    .infoPane(400px, 28px);
  }

  .zdPane {
    .infoPane(260px, 40px);
  }

  .detailPaneMidinfo {
    display: flex;
    width: 800px;
    position: relative;
    height: 100%;
    justify-content: space-between;
    color: #333;
    font-weight: normal;
    margin-left: 20px;
    padding-left: 10px;
    align-items: center;
    border-left: 1px solid #e8e8e8;

    >div {
      display: flex;
      align-items: center;
    }

    /deep/ .input-item {
      margin-bottom: 0px !important;
    }

    /deep/ .el-textarea__inner {
      position: absolute;
      width: 250px;
      height: 110px;
      z-index: 1000;
    }
  }


  .detail-title p {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }



  .el-form-item {
    margin-bottom: 0px;
  }







  .paneDisabled {
    cursor: not-allowed;

    >div {
      pointer-events: none;
    }

    /deep/ button {
      // pointer-events: all;
    }

    /deep/ input {
      pointer-events: none;
    }

    /deep/ .add-hawb {
      pointer-events: none;
    }

    /deep/ .icon-c {
      pointer-events: none;
    }

    /deep/ .tabs-header {
      pointer-events: all;
    }

    /deep/ .hide-tabs {
      pointer-events: all;
    }

    /deep/ #khjcno {
      pointer-events: all;
      cursor: pointer;
    }

    /deep/ #hwlx {
      pointer-events: all;
      cursor: pointer;
    }

    /deep/ #tradeterm {
      pointer-events: all;
      cursor: pointer;
    }

    /deep/ .el-tabs__nav {
      pointer-events: all;
    }
  }


  .pointerAll {
    pointer-events: all;
  }

  .marginb {
    margin-bottom: 8px;
  }
</style>