<template>

  <div>

    <h3 style="margin-bottom:10px;">总运单号：<span style="color:red">{{mawbDetail.mawb}}</span></h3>
    <h3 style="color:red;margin-bottom:10px;">*背景色为黄色的输入框为必填项!<i class="el-icon-info" @click="dialogShow=true"
        style="color:#409EFF;cursor:pointer;margin-left:12px;" title="格式说明"></i></h3>


       <commonTabs :list="tabslist" v-if="mawbDetail.guid&&applicationPage==2" titlefield="title" :checkedIndex.sync="checkedIndex"
      :opendIndex.sync="opendIndex">

      <makingBillAms v-if="opendIndex.includes(checkedIndex)" v-show="checkedIndex==0" :mawbguid="mawbguid"
        style="border:1px solid #e8e8e8" :orderdom.sync="mawbDetail.orderdom" :mawbinfo='mawbDetail' isams
        @odmChangeFunc="odmChangeFunc" :class="{disabled:applicationPage==2}"></makingBillAms>

      <hawbtabsoper v-if="opendIndex.includes(checkedIndex)"
        :hawbPosition="tabslist[checkedIndex].ishawb?tabslist[checkedIndex].title:''" :pagetype="3"
        :mawbdetail="mawbDetail" :nosave="1" :showtabtitle="false" :class="{disabled:applicationPage==2}" v-show="tabslist[checkedIndex].ishawb">
      </hawbtabsoper>

    </commonTabs>


    <el-tabs type="border-card" v-model="activeName" v-if="applicationPage==1">
      <el-tab-pane label="总单AMS信息">
        <makingBillAms v-if="mawbDetail.guid" :mawbguid="mawbguid" style="border:1px solid #e8e8e8"
          :orderdom.sync="mawbDetail.orderdom" :mawbinfo='mawbDetail' isams @odmChangeFunc="odmChangeFunc">
        </makingBillAms>
      </el-tab-pane>
      <el-tab-pane label="分单AMS信息" v-if="orderdom!='直单'">
        <hawbtabsoper v-if="mawbDetail.guid" :pagetype="3" :mawbdetail="mawbDetail" :nosave="1"
          :hawbPosition='mawbinfo.hawb'>
        </hawbtabsoper>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="编辑格式说明" v-if="dialogShow" center :visible.sync="dialogShow" append-to-body top="20px">
      <div class="explate">
        <p style="text-indent:0px;font-weight:600;color:#333">*所有的文本内容不能填写 包括",.()/（:：）+|#-等特殊字符</p>
        <p style="text-indent:0px;font-weight:600;color:#333">*所有的文本内容必须大写</p>
        <p style="text-indent:0px;font-weight:600;color:#333">*所有的收发货人(总单和分单)抬头和地址发送时只取第一行数据</p>
        <h2>总单:</h2>
        <h3>CCSP:</h3>
        <p>112航司运单---发货人和收货人抬头及地址字符限制分别为70位</p>
        <p>其他航司运单---发货人和收货人抬头及地址字符限制分别为35位</p>
        <p>品名字符限制位100位</p>
        <h3>唐翼:</h3>
        <p>尺寸的长、宽、高、件数必填</p>
        <h3>EZYCARGO:</h3>
        <p>PVG站点---品名栏一行不能超过20字符</p>
        <h3>目的港是南美或北美:</h3>
        <p>收货人洲名必填</p>
        <p>收货人邮编必须5位数字</p>
        <h3>锂电池:</h3>
        <p>必须在品名后面填写锂电池声明</p>
        <h2>分单:</h2>
        <h3>CCSP:</h3>
        <p>航司运单---发货人和收货人抬头及地址字符限制分别为70位</p>
        <p>其他航司运单---发货人和收货人抬头及地址字符限制分别为35位</p>
        <p>品名字符限制位50位</p>
        <h3>唐翼:</h3>
        <p>分单总体积必填</p>
        <h3>目的港是南美或北美:</h3>
        <p>收货人洲名必填</p>
        <p>收货人邮编必须5位数字</p>


      </div>
    </el-dialog>




  </div>


</template>
<script>


  import makingBillAms from './makingBillAms'
  import hawbtabsoper from './hawbTabsOper'
  import { getValByGrouid } from '../../api/localStorage'


  export default {

    props: {
      pagetype: {
        type: [String, Number],
        default: 3  //3 发送ams
      },
      mawbguid: [String, Number],
      orderdom: String,
      mawbinfo: Object,
      applicationPage:{
        type:[Number,String],
        default:1 //应用于 1 单证制作里面的ams，2订单详细页面的服务tab，隐藏新增分单，只读
      }
      

      

    },
    components: {
      makingBillAms, hawbtabsoper
    },
    data() {
      return {
        mawbDetail: {},
        activeName: '',
        dialogShow: true,
        tabslist: [
          { title: '总单AMS信息' }
        ],
        checkedIndex: 0,
        opendIndex: [0]
      }

    },
    methods: {
      odmChangeFunc(orderdom) {
        this.mawbinfo.orderdom = orderdom
        this.mawbDetail.orderdom = orderdom
        this.$emit('success', { mawbguid: this.mawbguid, orderdom: orderdom })
      },
      getStatus(val) {
        return getValByGrouid(146, val)
      },
      getBillInfo() {

        let ajaxUrl = "api/ExHpoAxplineMawbDocAmsSend"
        let json = { sid: this.mawbguid, mawbtype: 1 }


        this.$axios({ method: 'get', url: this.$store.state.webApi + ajaxUrl, params: json, loading: false, tip: false }).then(results => {
          // console.log("查询制单信息")
          // console.log(results.data);
          //只需要总单的部分
          this.mawbDetail = results.data;

          this.$axios({ //需优化：里面还会取一次分单列表，可以将这个查询结果传入里面，减少一次请求
            method: "get",
            url: this.$store.state.webApi + 'api/ExHpoAxplineMawbDocAmsSend',
            params: {
              hpoidHawbGroup: this.mawbDetail.sid
            },
            loading: true,
            tip: false
          }).then(results => {
            results.data.forEach(i => {
              this.tabslist.push({
                title: i.hawb,
                ishawb: true
              })
            })

          });
        })


      },

    }
    , created() {
      this.activeName = this.orderdom == '总单' || this.orderdom == '直单' ? '0' : '1'
      this.getBillInfo()
      //  alert(this.$store.getters.userSetting.amsOpen)
      //  console.log(getValByGrouid(146, 0))
      this.dialogShow = this.$store.getters.userSetting.amsOpen;



    },
    computed: {

    },
    mounted() {




    },
    watch: {


    }

  }


</script>
<style lang='less' scoped>
  .explate {
    margin-bottom: 40px;

    h2 {
      margin: 22px 0px 16px;
    }

    h3 {
      margin: 10px 0px 6px;
      text-indent: 40px;
    }

    p {
      margin: 4px 0px;
      text-indent: 70px;
      font-size: 14px;
    }
  }
</style>