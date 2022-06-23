<template>
  <div>
    <div class="reason">
      <!-- {{orderData}} -->
      <div class="orderSystem-c">
        <h3>{{getName()}}原因</h3>
        <p class="orderNo">
          <span
            style="color:#004d84;float:left;font-weight:bold"
          >订舱编号：{{jobData.pono||'--'}}&nbsp;&nbsp;&nbsp;&nbsp;订单编号：{{jobData.shipperno||'--'}}&nbsp;&nbsp;&nbsp;&nbsp;委托客户：{{jobData.wtkhname||'--'}}</span>
          <span style="color:#333;float:right">{{jobData.accountcomname}}</span>
          <el-link type="primary" @click="$emit('openWageDialog',true)" style="float:right" v-show="showWagebtn&&costdata.length>0">费用信息</el-link>
        </p>
        <ul>
          <li>总运单号</li>
          <li>始发港</li>
          <li>目的港</li>
          <li>预报件重体</li>
          <li>实际件重体</li>
          <li>航班号</li>
          <li>航班日期</li>
        </ul>
        <ul style="margin-top:3px;">
          <li>{{jobData.mawb}}</li>
          <li>{{jobData.sfg}}</li>
          <li>{{jobData.mdg||jobData.mawbmdg}}</li>
          <li>{{jobData.ybjzt||(jobData.ybpiece+"/"+jobData.ybweight+"/"+jobData.ybvolume)}}</li>
          <li>{{jobData.sjjzt||jobData.pieceweightheight}}</li>
          <li>{{jobData.hbh||jobData.real_hbh}}</li>
          <li>{{(jobData.hbrq&&jobData.hbrq.substring(0,10))||(jobData.real_hbrq&&jobData.real_hbrq.substring(0,10))}}</li>
        </ul>
        <div style="margin-top:35px;" v-if="pagetype==6">
          <el-input type="textarea" v-model="jobData.customreason" rows="4" readonly></el-input>
        </div>
        <el-tabs style="margin-top:15px;" v-if="pagetype==4||pagetype==5">
          <el-tab-pane label="订单驳回原因" v-if="orderData.length>0&&pagetype==4">
            <div style="display:flex;align-items:center">
              <!-- {{orderData}} -->
              <div class="accountNameItemsContent" style="margin-top: 12px;">
                <div class="delbillman-wrap">
                  <ul class="delbillmanList">
                    <li
                      @click="itemsActive=index"
                      :class="{'active': itemsActive == index}"
                      v-for="(item,index) in orderData"
                      :key="index"
                    >
                      <p>{{item.canceling?(item.canceling==1?'客服':'航线'):''}}{{item.reasontype}}<span style="float:right">{{item.area||''}}</span></p>
                      <p class="time">
                        <span class="left">{{item.delbilldate.split(' ')[0].replace(/(-)/g, '.')}}</span>
                        <span class="right">{{item.delbillman}}</span>
                      </p>
                      <i class="el-icon-caret-right"></i>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- <div class="arrow">
                          <i class="el-icon-caret-left" @click="changeDirectionDelBillMan(1)"></i>
                          <i class="el-icon-caret-right" @click="changeDirectionDelBillMan(2)"></i>
              </div>-->
            </div>

            <template v-for="(item,index) in orderData">
              <!-- 撤单和其他类型显示内容不同 -->
              <!-- <el-input type="textarea" v-if="index==itemsActive&&item.reasontype!='撤单'" :value="item.delbillreason" class="input-required" disabled :autosize="{ minRows:4}" style="margin-top:12px;color:rgb(200, 200, 200)" :key="index"></el-input> -->
              <div
                class="listDiv"
                v-if="index==itemsActive&&item.reasontype!='撤单'&&item.reasontype!='航线驳回'&&item.reasontype!='外站驳回'&&item.reasontype!='退关'"
                :key="index"
              >
                <template v-for="r in getrollbackreason(item)">
                  <!-- {{r}} -->
                  <!-- <div class="info" :class="r.reasontype=='不同意'?'infoleft':'inforight'"> -->
                  <div class="info" :class="r.delbillman!==usrname?'infoleft':'inforight'">
                    <template v-if="r.delbillman!==usrname">
                      <div class="usrico"></div>
                      <div style="overflow:hidden;width:20px;margin-left:10px">
                        <div class="icoleft"></div>
                      </div>
                    </template>

                    <div class="infodetail">
                      <span>{{r.delbillreason}}</span>
                      <span>{{r.delbillman}}&nbsp;&nbsp;&nbsp;&nbsp;{{r.delbilldate | formatDate('MM/dd hh:mm')}}</span>
                    </div>

                    <template v-if="r.delbillman==usrname">
                      <div class="icoright"></div>
                      <div class="usrico"></div>
                    </template>
                  </div>
                </template>
              </div>

              <div v-if="index==itemsActive&&(item.reasontype=='航线驳回'||item.reasontype=='外站驳回')">
                <el-form
                  style="margin-top:20px;pointer-events:none;border:1px solid #e8e8e8;padding:15px;border-radius:4px"
                >
                  <!-- {{item}} -->
                  <el-form-item label="驳回类型：">
                    <my-input v-model="item.rollbacktype"></my-input>
                  </el-form-item>
                  <el-form-item label="驳回理由：">
                    <el-input
                      type="textarea"
                      :rows="2"
                      style="width:78%"
                      v-model="item.delbillreason"
                    ></el-input>
                  </el-form-item>

                  <!-- <el-form-item
                    label="有无费用："
                    v-show="item.reasontype=='航线驳回'"
                    style="pointer-events:all"
                  >
                    <el-radio v-model="item.iswage" label="1" style="margin-left:20px;">有</el-radio>
                    <el-radio v-model="item.iswage" label="2">无</el-radio>
                  </el-form-item> -->

                  <!-- <div style="pointer-events:all;text-align:right" v-show="item.reasontype=='航线驳回'">
                          <el-button  type="primary" @click='setWageFunc(item,2)'>保存</el-button>
                  </div>-->
                </el-form>
              </div>

              <div v-if="index==itemsActive&&item.reasontype=='撤单'">
                <!-- @@ 进口更改 -->
                <el-form
                  style="margin-top:20px;border:1px solid #e8e8e8;padding:15px;border-radius:4px"
                >
                  <el-form-item label="撤单类型：" style="pointer-events:none;">
                    <my-input v-model="item.canceltype"></my-input>
                  </el-form-item>
                  <el-form-item label="撤单理由：" style="pointer-events:none;">
                    <el-input
                      type="textarea"
                      :rows="2"
                      style="width:78%"
                      v-model="item.delbillreason"
                    ></el-input>
                  </el-form-item>

                   <el-form-item label="处理结果：" v-if="jobData.system=='空进'&&(item.canceltype=='客户弃货'||item.canceltype=='海关退货')">
                      <el-radio v-model="item.handleRs" label="1" style="margin-left:20px;">未处理</el-radio>
                      <el-radio v-model="item.handleRs" label="2">已处理</el-radio>
                  </el-form-item>

                  <el-form-item label="处理时间：" v-if="jobData.system=='空进'&&(item.canceltype=='客户弃货'||item.canceltype=='海关退货')">
                    <el-date-picker
                      v-model="item.handelDate"
                      type="date"
                      placeholder="选择日期"
                      :class="[item.handleRs=='2'?'input-required':'']"
                      :format="'yyyy-MM-dd'"
                      :value-format="'yyyy-MM-dd'"
                      >
                    </el-date-picker>
                </el-form-item>

                  <el-form-item label="总单处理结果：" v-if="item.ifshowRes" style="pointer-events:none;">
                    <el-radio v-model="item.status" label="1" style="margin-left:20px;">可用</el-radio>
                    <el-radio v-model="item.status" label="4">不可用</el-radio>
                    <el-radio v-model="item.status" label="5">作废</el-radio>
                  </el-form-item>

                  <el-form-item label="有无费用：" style="pointer-events:none;">
                    <el-radio v-model="item.iswage" label="1" style="margin-left:20px;">有</el-radio>
                    <el-radio v-model="item.iswage" label="2">无</el-radio>
                    <!-- <el-radio v-model="item.iswage" label="3">待定</el-radio> -->
                  </el-form-item>
                  <!-- <div style="pointer-events:all;text-align:right">
                          <el-button  type="primary" @click='setWageFunc(item,1)'>保存</el-button>
                  </div>-->
                </el-form>

                <div v-if="item.iswage==1&&costdata.length>0" style="margin-top:10px;">

                     <costTable
                    :wagedom="getWagedom(item.canceling)"
                    wageinout="1"
                    pagedom="2"
                    :costdata="filterTableData(item.canceling)"
                    :mawbinfo="jobData"
                    class="disabled"
                  ></costTable>

                  <costTable
                    :wagedom="getWagedom(item.canceling)"
                    wageinout="2"
                    pagedom="2"
                    :costdata="filterTableData(item.canceling)"
                    :mawbinfo="jobData"
                    class="disabled"
                  ></costTable>
                </div>
              </div>

              <div v-if="index==itemsActive&&item.reasontype=='退关'">
                <el-form
                  style="margin-top:20px;pointer-events:none;border:1px solid #e8e8e8;padding:15px;border-radius:4px"
                >
                  <el-form-item label="退关原因：">
                    <my-input v-model="item.canceltype"></my-input>
                  </el-form-item>
                  <el-form-item label="退关描述：">
                    <el-input
                      type="textarea"
                      :rows="2"
                      style="width:78%"
                      v-model="item.delbillreason"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>

              <!-- {{ifshowbtn(jobData.rejectstatus,item.reasontype)}} -->
              <div v-if="jobData.rejectstatus">
                <!-- &&index==(orderData.filter(i=>i.reasontype=='经理驳回').length-1) -->
                <div
                  style="margin-top:15px;display:flex;justify-content:flex-end"
                  v-if="(ifshowbtn(jobData.rejectstatus,item.reasontype)==2)&&item.reasontype=='经理驳回'"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="跳转到“费用信息”页面。修改费用重新确认（应付/应收）后，提交至“经理审核”。"
                    placement="bottom"
                  >
                    <el-button type="primary" @click="ifagreeFunc(3,item.reasontype)">同意</el-button>
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="填写不更改费用的理由，确认后重新提交至“经理审核”"
                    placement="bottom"
                  >
                    <el-button type="primary" @click="ifagreeFunc(0,item.reasontype)">不同意</el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <!-- <el-input type="textarea" v-if="pagetype==4&&orderData.length>0" :value="orderData[itemsActive].delbillreason" class="input-required" disabled :autosize="{ minRows:4}" style="margin-top:12px;color:rgb(200, 200, 200)" placeholder="请输入取消原因"></el-input> -->
          </el-tab-pane>
          <el-tab-pane
            label="费用驳回原因"
            v-if="(jobData.delbillreason||jobData.overseasaccreason||jobData.wagecommitreason)&&pagetype==5"
          >
            <fareCancelReason :fareData="jobData" :visible.sync="visible"></fareCancelReason>
          </el-tab-pane>
        </el-tabs>

        <el-input
          v-if="pagetype==1"
          type="textarea"
          v-model="reason"
          class="input-required"
          :autosize="{ minRows:4}"
          style="margin-top:12px;color:#c8c8c8"
          placeholder="请输入取消原因"
        ></el-input>
      </div>

      <p style="margin-top:18px;text-align:right">
        <slot name="footerBtngroup"></slot>
        <!--        <el-button @click="cancelDzFw(wageIdS)" type="primary">确定</el-button>
        <el-button @click="closeAbanDz">取消</el-button>-->
        <el-button type="primary" v-if="jobData.system=='空进'" @click="resaveCancel">保存</el-button>
      </p>
      
    </div>

    <el-dialog
      :visible.sync="costDialog"
      width="1480px"
      top="4%"
      v-if="costDialog"
      :close-on-press-escape="false"
      @close="closeDig"
      append-to-body
      center
    >
      <costMaking
        v-if="costDialog"
        :mawbguid="jobData.guid"
        style="min-height:400px;display:flex;flex-direction:column;justify-content:space-around"
        :boguid="jobData.boguid"
        :pagetype="1"
        :inputModelData="jobData"
      ></costMaking>
    </el-dialog>
  </div>
</template>
<script>
import fareCancelReason from "./fareCancelReason";
import { formatDate } from "../../api/localStorage.js";
import costMaking from "./costMaking";

export default {
  props: {
    jobData: {
      type: Object,
      default: () => {}
    },
    abandonReason: "",
    pagetype: {
      type: [Number, String],
      default: 1 //1填写驳回原因  2订单被驳回（弃用） 3费用未确认（弃用） 4显示订单驳回原因tab 5.显示费用驳回原因tab
    },
    visible: Boolean,
    showWagebtn:{
      type:Boolean,
      default:false
    }
  },
  components: {
    fareCancelReason,
    costMaking
  },

  data() {
    return {
      itemsActive: 0,
      orderData: [],
      fareData: [],
      costDialog: false,
      costdata: []
    };
  },
  created() {
   // if(this.jobData.cancelreason&&this.jobData.cancelreason.includes('canceling')){
      this.getMawbCost();
   // }
  },
  computed: {
    usrname() {
      return localStorage.usrname;
    },
    reason: {
      get() {
        return this.abandonReason;
      },
      set(val) {
        this.$emit("update:abandonReason", val);
      }
    }
  },
  methods: {
    //@@ 进口更改
    resaveCancel(){
      console.log(this.orderData)
      this.orderData[0].delbilldate= formatDate(new Date(), "yyyy-MM-dd hh:mm")
      let json={
        area:this.jobData.area,
        boguid:this.jobData.boguid,
        cancelreason:JSON.stringify(this.orderData),
        canceling:this.orderData[0].canceling,
        canceltype:this.orderData[0].canceltype,
        handelDate: this.orderData[0].handelDate,
        handleRs: this.orderData[0].handleRs,
        iswage: this.orderData[0].iswage,
        remark: "",
        sid: this.jobData.guid,
        status: this.orderData[0].status,
        wage:this.costdata
      }
      //console.log(json)
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/CancelOrder",
        data: json,
        area: this.jobData.area,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success('更新成功');
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    getrollbackreason(item) {
      var obj =
        (item.rollbackreason &&
          JSON.parse(JSON.stringify(item.rollbackreason))) ||
        [];
      obj.unshift({
        reasontype: item.reasontype,
        delbillreason: item.delbillreason,
        delbillman: item.delbillman,
        delbilldate: item.delbilldate,
        iswage: item.iswage
      });
      return obj;
    },
    filterTableData(canceling){
     return  canceling?this.costdata.filter(i=>i.wagedom==this.getWagedom(canceling)||i.wagedom=='结算'):this.costdata
    },
    ifshowbtn(status, reasontype) {
      if (reasontype == "应收对账驳回") {
        return status[0];
      }
      if (reasontype == "应付对账驳回") {
        return status[1];
      }
      if (reasontype == "经理驳回") {
        return status[2];
      }
    },
    ifagreeFunc(type, reasontype) {
      //type 3同意 0不同意
      var json = {
        boguid: this.jobData.boguid,
        czman: localStorage.usrname,
        rejectstatus: type,
        reasontype: reasontype
      };
      if (type == 0) {
        this.$prompt("请输入原因", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea",
          inputPattern: /\S/,
          inputErrorMessage: "请输入原因！"
        }).then(({ value }) => {
          if (value) {
            var obj = JSON.parse(
              JSON.stringify(this.orderData[this.itemsActive])
            );
            var rollbackreason = this.orderData[this.itemsActive]
              .rollbackreason;
            if (rollbackreason && rollbackreason.length > 0) {
              obj.rollbackreason.push({
                reasontype: "不同意",
                delbillreason: value,
                delbillman: localStorage.usrname,
                delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm")
              });
            } else {
              obj.rollbackreason = [
                {
                  reasontype: "不同意",
                  delbillreason: value,
                  delbillman: localStorage.usrname,
                  delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm")
                }
              ];
            }

            json.rollbackreason = JSON.stringify([obj]);
            console.log(obj);
            this.ajaxfunc(json, type);
          }
        });

        //  json.rollbackreason=JSON.stringify([{reasontype:'',delbillreason:'',delbillman:localStorage.usrname,delbilldate:formatDate(new Date(),'yyyy-MM-dd hh:mm'),canceltype:json.canceltype,status:json.status,iswage:json.iswage,ifshowRes:this.inputModelData.mawb&&this.hasMaincamp}])
      } else {
        this.ajaxfunc(json, type);
      }
    },
    ajaxfunc(json, type) {
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/UpdateExamineApprove",
        data: json,
        loading: true,
        tip: false,
        noarea: true
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message("操作成功！");
          if (type == 3) {
            this.costDialog = true;
          } else {
            this.closeDig();
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
      // rejectstatus
      ///  驳回状态 0.不同意  1.正常  2.驳回 3同意
      /// 多个值
      /// 第一个 应收对账
      /// 第二个 应付对账
      /// 第三个 经理审核
      /// 例: 102  应收对账正常.应付对账不同意.经理审核驳回
    },
    closeDig() {
      if (this.visible) {
        this.$emit("update:visible", false);
      }
    },
    getName() {
      if (this.pagetype == 2) {
        return "驳回";
      }
      if (this.pagetype == 3) {
        return "撤单";
      }
      if (this.pagetype == 6) {
        return "发送失败";
      }
    },
    getWagedom(type) {
      switch (type) {
        case 1:
          return "客服";
          break;
        case 2:
          return "航线";
          break;
        default:
          "";
          break;
      }
    },
    changeDirectionDelBillMan(type) {
      var clientWidth = 0;
      if (type == 1) {
        this.arrowDelBillManIndex--;
        if (this.arrowDelBillManIndex < 0) {
          layer.msg("已至头部");
          this.arrowDelBillManIndex = 0;
          return false;
        }
      } else if (type == 2) {
        $(".delbillmanList")
          .find("li")
          .each(function() {
            clientWidth = clientWidth + 165;
          });
        if (clientWidth < 800) {
          this.arrowDelBillManIndex = 0;
          return false;
        } else {
          this.arrowDelBillManIndex++;
        }
        if (this.arrowDelBillManIndex > Math.ceil((clientWidth - 800) / 165)) {
          layer.msg("已至尾部");
          this.arrowDelBillManIndex = Math.ceil((clientWidth - 800) / 165);
          return false;
        }
      }

      $(".delbillmanList").css(
        "transform",
        "translateX(-" + this.arrowDelBillManIndex * 165 + "px)"
      );
    },
    setWageFunc(item, reasontype) {
      //设置有无费用
      //  console.log(item)
      //reasontype 1撤单 2驳回（外站和航线）
      let json = {};
      if (reasontype == 1) {
        json = {
          boguid: this.jobData.boguid,
          cancelreason: JSON.stringify([item])
        };
      } else {
        json = {
          boguid: this.jobData.boguid,
          routedelreason: JSON.stringify([item])
        };
      }
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/UpdateCancelReason",
        data: json,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          // console.log(results.data)
          this.$message(results.data.resultmessage);
          if (reasontype == 1) {
            this.jobData.cancelreason = JSON.stringify([item]);
          } else {
            this.jobData.routedelreason = JSON.stringify([item]);
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    getMawbCost() {
      //获取总单费用信息
      let json = {
        sid: this.jobData.guid,
        boguid: this.jobData.boguid
      };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
        this.costdata = results.data.filter(i => i.yssys != 2);
      });
    }
  },
  watch: {
    jobData: {
      handler(val) {
        if (val && this.pagetype == 4) {
          var obj = [];
          let rou=val["routedelreason"]
            try {
                if (rou) {
                  obj = JSON.parse(rou.replace("\r", ""));
                }
                if (val["cancelreason"]) {
                  obj = obj.concat(JSON.parse(val["cancelreason"]));
                }

                if (val["examineremark"]) {
                  obj = obj.concat(JSON.parse(val["examineremark"]));
                }
                if (val["tgreason"]) {
                  obj = obj.concat(JSON.parse(val["tgreason"]));
                }
            } catch (error) {
               this.$message.error('驳回、撤单、退关等原因的json数据格式错误,无法解析！');return;
            }
          obj.sort(
            (a, b) => new Date(a.delbilldate) >= new Date(b.delbilldate)
          );
          this.orderData = obj;
          //  this.fareData=val['delbillreason']&&JSON.parse(val['delbillreason'])
          this.itemsActive = this.orderData.length - 1;
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.listDiv {
  // display:flex;
  min-height: 150px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #fff8ef;
  margin-top: 12px;
  padding: 15px 5px;
  .info {
    display: flex;
    width: 100%;
    min-height: 30px;
    margin-bottom: 12px;
    overflow: hidden;
    .infodetail {
      display: flex;
      flex-direction: column;
      padding: 3px 6px;
      color: #fff;
      border-radius: 4px;
      width: 45%;
      :nth-child(1) {
        margin-bottom: 6px;
        font-size: 14px;
      }
    }
  }
  .usrico {
    width: 32px;
    background: url(../../../boStatic/images/usrhead.png) no-repeat;
    // background-size: 100% 100%;
    height: 50px;
    background-position: top center;
    display: flex;
    align-items: flex-end;
  }

  .icoleft {
    background: url(../../../boStatic/images/duihuaicon.png) no-repeat;
    width: 20px;
    color: #004d84;
    margin-left: 10px;
    filter: drop-shadow(20px 0 #e6a23c);
    position: relative;
    right: 30px;
    height: 100%;
  }
  .infoleft .infodetail {
    //  background: #12B7F5;
    //  background: #E6A23C;
    background: #e6a23c;
  }
  .icoright {
    background: url(../../../boStatic/images/duihuaicon.png) no-repeat;
    width: 20px;
    color: #004d84;
    transform: rotateY(180deg);
    margin-right: 10px;

    /*   filter: drop-shadow(20px 0 #E6A23C);
        position: relative;
        right: -21px; */
  }
  .inforight {
    justify-content: flex-end;
    .infodetail {
      background: #12b7f5;
      text-align: right;
    }
  }
}
.reason {
  h3 {
    font-size: 18px;
    color: #004d84;
  }
  .el-dialog__body {
    padding: 8px 40px;
  }
  .orderNo {
    margin-top: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    margin-bottom: 12px;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }
  ul li {
    display: inline-block;
    width: 130px;
    text-align: left;
    color: #999;
  }
  .costItems {
    margin-top: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    overflow: hidden;
    li {
      display: inline-block;
      cursor: pointer;
      padding-right: 16px;
      width: auto;
      &:hover {
        color: #004d84;
      }
      /deep/.el-badge__content.is-fixed.is-dot {
        right: 2px;
      }
      /deep/.el-badge__content.is-fixed {
        top: 3px;
        transform: translateY(-46%) translateX(100%);
      }
      /deep/.el-badge {
        vertical-align: inherit;
      }
    }

    .el-icon-caret-left {
      font-size: 16px;
      cursor: pointer;
      &:hover {
        color: #004d84;
      }
    }
    .el-icon-caret-right {
      font-size: 16px;
      cursor: pointer;
      margin-left: -8px;
      &:hover {
        color: #004d84;
      }
    }
  }
}

.arrow {
  display: inline-block;
  vertical-align: top;
  .el-icon-caret-left {
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #004d84;
    }
  }
  .el-icon-caret-right {
    font-size: 16px;
    cursor: pointer;
    margin-left: -8px;
    &:hover {
      color: #004d84;
    }
  }
}

.delbillman-wrap {
  width: 800px;
  overflow: hidden;
  display: inline-block;
  .delbillmanList {
    //   width: 10000px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-bottom: 10px;
    li {
      position: relative;
      border: 1px solid #e8e8e8;
      border-radius: 3px;
      font-size: 13px;
      cursor: pointer;
      width: 145px;
      padding: 5px 8px;
      color: #4c4c4c;
      margin-right: 29px;
      p:first-child {
        margin-bottom: 3px;
        .left {
          color: #999;
        }
      }
      .left {
        text-align: left;
      }
      .right {
        float: right;
        width: 50px;
        overflow: hidden;
        text-align: right;
      }
      .el-icon-caret-right {
        position: absolute;
        font-size: 18px;
        right: -25px;
        top: 15px;
        color: #606266;
      }

      &.active {
        background: #004e82;
        border-color: #004e82;
        color: #fff;
        p:first-child {
          .left {
            color: #fff;
          }
        }
      }
      &:last-child {
        .el-icon-caret-right {
          display: none;
        }
      }
    }
  }
  + .arrow {
    margin-top: 16px;
  }
}
.input-required /deep/.el-textarea__inner {
  background-color: #fff8ef;
  color: #333;
}
</style>


