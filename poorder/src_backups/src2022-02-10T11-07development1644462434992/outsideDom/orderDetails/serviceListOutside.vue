<template>
  <div style="display: flex;">
    <!-- {{newService}} -->
    <div v-for="(item,indexT) in serviceDataGroup" :key="indexT">
      <h3 style="text-indent: 5px;">{{item.port}}</h3>
      <div class="portItemDiv">
        <div v-for="type in getServiceType(item.serviceBasicList)">
          <span style="margin:8px;font-size:15px;color:#000;font-weight:600">{{type}}</span>
          <template v-for="code in item.serviceBasicList.filter(i=>i.servicetype==type)">
            <div class="service" :code="code.servicecode" v-if="newService[code.servicecode]" :key="code.servicecode">
              <serviceItemNew :servicedata="newService[code.servicecode]">
                <template slot="exBtn">
                  <!-- <span
                    v-if="(code.servicecode=='AA0510'&&newService['AA0510'].model)||(code.servicecode=='AA0410'&&newService['AA0410'].model)"
                    @click="exInfo($event,code.servicecode)" title="点击补充相关信息" style="margin-right:10px;cursor: pointer;"
                    class="el-icon-date">
                  </span> -->
                  <span v-if="newService[code.servicecode].model" @click="exInfo($event,code.servicecode)"
                    title="点击补充相关信息" style="margin-right:10px;cursor: pointer;" class="el-icon-edit">
                  </span>
                  <!-- <el-date-picker class="ckdatePicker" @change="exInfo($event,code.servicecode)" title="请选择预计进仓日期" v-if="(code.servicecode=='AA0410'&&newService['AA0410'].model)"
                    v-model="jcdate" type="date" popper-class="mypopper" value-format="yyyy-MM-dd">
                  </el-date-picker> -->
                </template>
              </serviceItemNew>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import serviceItemNew from "./serviceItemOutside";
  import { formatDate } from '@/api/localStorage'

  export default {
    props: {
      system: {
        type: String,
        default: "空出"
      },
      opersystem: {
        type: String,
        default: "国内服务"
      },
      newService: {
        type: Object,
        default: () => { }
      },
      orderguid: {
        type: [Number, String],
        default: -1
      },
      orderdom: {
        type: String,
        default: '总单'
      },
      serviceList: {
        type: Array,
        default: () => []
      },
      pagetype: {
        type: [Number, String],//1新增页面 2修改页面
        default: 1
      },
    },
    components: {
      serviceItemNew
    },
    data() {
      return {
        jcdate: ''
      }
    },
    computed: {
      serviceDataGroup() {
        return JSON.parse(localStorage.serviceDataGroup).filter(e => e.system == this.system)
      },
    },
    methods: {
      exInfo(e, code) {
        // console.log(e)
        // console.log(code)
        this.$emit("exInfoClick", { val: e, code: code })
      },
      showFunc(item) {
        if (item.indexOf("订舱") >= 0) {
          return this.opersystem == "出口";
        }
        if (item == "到货通知") {
          return this.opersystem == "进口";
        }

        return true;
      },
      initFunc(serviceList = []) {
        //  console.log(this.system)
        if (!this.system) return;
        this.$emit('update:newService', {})
        this.$nextTick(() => {
          let serviceData = []
          this.serviceDataGroup.forEach(i => {
            serviceData.push(...i.serviceBasicList)
          })
          serviceList =
            serviceList.length > 0
              ? serviceList
              : this.serviceList.length > 0
                ? this.serviceList
                : [];
          //  console.log(serviceData)
          serviceData.forEach(item => {
            if (item.dom == "总单") {
              if (serviceList.length == 0) {
                //新增页面
                this.$set(this.newService, item.servicecode, {
                  port: item.port,
                  title: item.servicename,
                  // servicetype: item.servicetype,
                  model:
                    (item.servicecode == "OB0020" && this.system == "空进") || item.servicecode == "OA0010",
                  //  model:false,
                  oprequest: "",
                  disabled: (this.orderdom == '直单' && item.servicecode == 'AA0120') || item.servicecode == "OA0010",
                  servicecode: item.servicecode,
                  yqfinishdate: "",
                  remark: item.remark//中文提示
                });
              } else {
                //修改页面
                let guid = -1;
                let sid = -1;
                let model = false;
                var oprequest = "";
                let disabled = false;
                let profitmode = "";
                let pgid = "";
                let orderpgid = "";
                let childpgid = "";
                let yqfinishdate = "";

                // if (this.orderguid != -1) {
                //   disabled = true;
                // }

                if (this.orderdom == "直单" && item.servicecode == "AA0120") {
                  disabled = true;
                }

                // if (item.servicecode == "OA0010") {
                //   disabled = true;
                // }
                serviceList.forEach(se => {
                  if (se.servicecode == item.servicecode) {
                    model = se.isdel == 1 ? true : false;
                    oprequest = se.oprequest;
                    guid = se.guid;
                    sid = se.sid;
                    profitmode = se.profitmode;
                    pgid = se.pgid;
                    orderpgid = se.orderpgid;
                    childpgid = se.childpgid;
                    yqfinishdate = formatDate(se.yqfinishdate, 'yyyy-MM-dd');
                    // yqfinishdate = se.yqfinishdate
                  }
                });
                this.$set(this.newService, item.servicecode, {
                  port: item.port,
                  guid: guid,
                  sid: sid,
                  //  servicetype: item.servicetype,
                  title: item.servicename,
                  id: item.id,
                  model: model,
                  oprequest: oprequest,
                  disabled: disabled,
                  servicecode: item.servicecode,
                  remark: item.remark,
                  profitmode: profitmode,
                  pgid: pgid,
                  orderpgid: orderpgid,
                  childpgid: childpgid,
                  yqfinishdate: yqfinishdate
                });
              }
            }
          });
        })

      },
      getServiceType(item) {
        return [...new Set(item.map(i => i.servicetype))]
      },
    },
    created() {
      if (this.pagetype == 1 || this.serviceList.length > 0) {
        this.initFunc();
      }
    },
    watch: {
      orderguid: {
        handler(val) {
          if (this.pagetype == 2 && val != -1) {
            this.initFunc();
          }
        }, immediate: true
      },
      orderdom: {
        handler(val) {
          this.initFunc();
        }
      },
      system: {
        handler(val) {
          if (val) {
            this.initFunc();
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  /deep/.servicediv {
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
  }

  /deep/ .service {
    // width: 100%;
  }

  /deep/.servicediv-title {
    // height:100;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 15px;
    padding-right: 15px;
    width: 30px;
    word-wrap: break-word;
    line-height: 16px;
  }

  .portItemDiv {
    display: flex;
    /* padding-left: 114px;
    transform: translateY(-27px);
    border-bottom: 1px solid #e1e1e1; */
    padding-bottom: 14px;
    margin-top: 12px;
    padding-left: 0px;
    transform: translateY(0px);
  }

  .ckdatePicker {
    width: 30px;
    margin-right: 12px;
    height: 16px;
    cursor: pointer;

    /deep/ .el-input__inner {
      width: 30px;
      border: none
    }

    /deep/ .el-input__prefix {
      color: #333
    }

    /deep/ .el-input__suffix {
      display: none;
    }
  }
</style>