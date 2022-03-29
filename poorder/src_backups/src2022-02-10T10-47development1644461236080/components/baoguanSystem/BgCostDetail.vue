<template>
  <div class="BgCostDetail">
    <div class="detail mawbInformation">
      <div class="detail-title">
        <p>报关基本信息</p>
      </div>
      <div class="detail-c">
        <el-row>
          <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtkhname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtkhname'] }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtxmname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtxmname'] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['pono'] }}</span>
              <span class="value color-red">{{ mawbInformation['pono'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mawb'] }}</span>
              <span class="value color-red">{{ mawbInformation['mawb'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hawb'] }}</span>
              <span class="value">{{ mawbInformation['hawb'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['ywlx'] }}</span>
              <span class="value">{{ mawbInformation['ywlx'] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['bggysname'] }}</span>
              <span class="value color-red">{{ mawbInformation['bggysname'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['bglx'] }}</span>
              <span class="value">{{ mawbInformation['bglx'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hbrq'] }}</span>
              <span class="value">{{ mawbInformation['hbrq'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['lds'] }}</span>
              <span class="value">{{ mawbInformation['lds'] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['sfg'] }}</span>
              <span class="value">{{ mawbInformation['sfg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mdg'] }}</span>
              <span class="value">{{ mawbInformation['mdg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['jz'] }}</span>
              <span class="value">{{ mawbInformation['jz'] }}</span>
            </p>
          </el-col>
        </el-row>

      </div>
    </div>

    <div class="detail mawbCharge detailPaneYoung">
      <el-row class="detail-title">
      <el-col :span="3">
        <p>空运应收费用</p>
        </el-col>

        <el-col :span="3" style="color:#00CC00;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">

             <span >总应收：</span><span>{{zdtotalCharge}}</span>

        </el-col>
        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>
        <el-col :span="3" style="color:orange;font-size:12px;font-weight:normal;margin-right:20px;font-weight:bold">

             <span >总盈利：</span><span>{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>

        </el-col>

      </el-row>
      <div class="detail-c">
       <el-row style="line-height:30px;">
        </el-row>

        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="margin-top:20px;" :tableIndex="0" v-if="mawbCharge">
        </commonTable>
      </div>
    </div>

    <div class="detail mawbPayment detailPaneRed">
      <el-row class="detail-title">
         <el-col :span="3">
        <p>空运应付费用</p>
        </el-col>

        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold;margin-left:-20px;">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>

      </el-row>
      <div class="detail-c">

        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbPayment" style="margin-top:20px;" :tableIndex="1" v-if="mawbPayment">
        </commonTable>
      </div>
    </div>

    <div class="footer">
      <div class="btn-c">
        <div class="left-btn">

           <el-button  @click="back">返回</el-button>
        </div>
        <div class="right-btn">
          <el-button @click="submit(mawbInformation.status >= 800 ? 700 : 800)" :disabled="mawbInformation.status==1100" type="primary">{{ mawbInformation.status >= 800 ? '取消结算' : '提交结算' }}</el-button>
          <!-- <el-button @click="submit(mawbInformation.status == 1100 ? 800 : 1100)" type="primary">{{ mawbInformation.status == 1100 ? '取消审核' : '提交并审单' }}</el-button> -->
          <el-button @click="submit(800)" :disabled="mawbInformation.status == 1100" type="primary">{{ '取消审核' }}</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>


export default {
  components: {
  },
  props: {
    guid: {
      type: [Number, String],
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    },
    orderdom: {
      type: String
    }
  },
  data() {
    return {
      zdtotalCharge: 0,
      zdtotalPayment: 0,
      fdPayment: 0,
      wageinout: "", //对账传应收应付
      ponolist: [], //订舱编号选项
      system: "报关",
      mawbInformation: {},
      translate_text: {
        pono: "订舱编号：",
        mawb: "总运单号：",
        hawb: "分运单号：",
        wtkhname: "委托客户：",
        wtxmname: "项目：",
        ywlx: "业务类型：",
        bglx: "报关类型：",
        hbrq: "航班日期：",
        lds: "连单数：",
        sfg: "始发港：",
        mdg: "目的港：",
        bggysname: "报关供应商：",
        jz: "件/重："
      },
      mawb_table_model: [
        { field: "isfree", title: "免" },
        { field: "settname", title: "结算对象" },
        { field: "items", title: "服务项目" },
        { field: "wagetype", title: "计费方式" },
        { field: "num", title: "数量" },
        { field: "price", title: "单价" },
        { field: "currency", title: "币种" },
        { field: "leastwageall", title: "金额" },
        { field: "wageall", title: "RMB金额" },
        { field: "changerate", title: "汇率" },
        { field: "remark", title: "备注" }
      ],

      mawbCharge: [],
      mawbPayment: [],
      // 订单号、分运单号
      ordernoList: [],
      //orderdom:'',//订单来源
      //基础数据 结算方式
      jsfs: [],
      currencyList: []
      //typename:''
    };
  },
  created() {
    this.mawbDeatil();
  },
  computed: {

    zdtotalIn() {
      return (this.zdtotalCharge - this.zdtotalPayment).toFixed(2);
    }
  },
  methods: {
    // 总单详细
    mawbDeatil() {
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExDecl",
        params: { guid: this.guid },
        loading: true,
        tip: false
      }).then(results => {
        if (results.data) {
          this.mawbInformation = results.data;
          this.mawbInformation.jz = `${results.data.piece}/${results.data.weight}`
          this.ponolist.push(results.data.pono);

          this.mawbCost();
        }
      });

      let groupIdData = JSON.parse(localStorage.getItem("groupType"));
      groupIdData.forEach(item => {
        if (item.groupid == 33) {
          this.jsfs.push({ value: item.id, typename: item.typename });
        }
      });

      let currencyData = JSON.parse(localStorage.getItem("currencyData"));
      currencyData.forEach(item => {
        this.currencyList.push(item.cname);
      });

      this.fdPayment = Number(this.fdPayment).toFixed(2);
    },

    //总单费用查询
    async mawbCost(data) {
      let results = data

      this.mawbCharge = [];
      this.mawbPayment = [];
      var totalCharge = 0;
      var totalPayment = 0;

      if (!results) {
        // 总单费用
        await this.$axios({
          method: "get",
          url: this.$store.state.webApi+'api/ExDeclWage',
          params: {sid: this.guid},
          loading: true,
          tip: false
        }).then(result => {
          if (result.data.length !== 0) {
            results = result.data
          }
        })
      }

      this.typename = "";
      results.forEach(i => {
        if (i.yssys != 2) {
          i.isfree == 1 ? (i.isfree = "否") : (i.isfree = "是");
          // wageinout 1应收 2应付
          i.price = Number(i.price).toFixed(2);
          i.wageall = Number(i.wageall).toFixed(2);
          i.leastwageall = Number(i.leastwageall).toFixed(2);
          i.changerate = Number(i.changerate).toFixed(4);
          if (i.wageinout == 1) {
            this.mawbCharge.push(i);
            this.ysConfirm = i.confirmstatus == 1 ? false : true;
            this.ysUconfirm = i.confirmstatus == 1 ? true : false;
            if (i.isfree == "否") {
              totalCharge += Number(i.wageall);
            }

            //this.mawbChargeTem.push(i)
          } else if (i.wageinout == 2) {
            this.mawbPayment.push(i);
            this.yfConfirm = i.confirmstatus == 1 ? false : true;
            this.yfUconfirm = i.confirmstatus == 1 ? true : false;
            if (i.isfree == "否") {
              totalPayment += Number(i.wageall);
            }
          }
        }
      });

      this.zdtotalCharge = totalCharge.toFixed(2);
      this.zdtotalPayment = totalPayment.toFixed(2);
    },

    //返回
    back() {
      this.$emit("back", false);
    }, //提交结算
    submit(status) {
      let save_data = {
        submittype: 3,
        guid: this.guid,
        area: this.$store.state.areaState,
        system: this.system,
        status: status
      }

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplineSubmit',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.$message.success(result.data.resultmessage);
          this.mawbInformation.status = status
        } else {
          this.$message.error("失败！" + result.data.resultmessage);
        }
      })

    }
  }
};
</script>

<style lang="less" scoped>
.BgCostDetail {
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      //background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .detail-c {
      padding: 20px;
    }
  }
  .mawbInformation,
  .hawbInformation {
    .el-row {
      margin-bottom: 8px;
      .label {
        display: inline-block;
        width: 130px;
        text-align: right;
        margin-right: 10px;
      }
      .value {
        color: #009900;
      }
      .color-red {
        color: red;
      }
    }
  }

  .footer {
    margin-top: 20px;
    .el-row {
      margin: 20px 0;
    }
    .btn-c {
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
    }
  }
}
.sanjiao {
  width: 130px;
  height: 0;
  border-bottom: 30px solid;
  position: relative;
  top: 6px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
  color: #fff;
}
.test(@color) {
  border: 1px solid #fff !important;
  .sanjiao {
    border-bottom-color: @color;
  }
  .detail-title p {
    &:extend(.sanjiao);
    border-bottom-color: @color;
  }
  .detail-c {
    border: 1px solid @color;
  }
}

.detailPaneRed {
  .test(red);
}
.detailPaneYoung {
  .test(#00cc00);
}
</style>
