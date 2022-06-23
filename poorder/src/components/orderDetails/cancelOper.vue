<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="1000px"
      :title="title"
      top="4%"
      v-if="visible"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      center
    >
      <!-- {{inputModelData}} -->
      <!-- {{isCostConfirm}} -->
      <!-- {{orderCancelForm}} -->

      <el-form>
        <!-- @@ 进口更改 -->
        <el-form-item label="操作类型：">
          <el-radio v-model="opertype" label="1" :disabled="czMark==1">撤单</el-radio>
          <el-radio v-model="opertype" label="2" :disabled="dom!=2||czMark==2||inputModelData.opersystem=='进口'">航线驳回</el-radio>
          <el-radio v-model="opertype" label="3" :disabled="dom!=3||inputModelData.opersystem!='出口'">退关</el-radio>
        </el-form-item>
      </el-form>

            <h4 v-if="opertype==2" style="color:red;margin:8px 0px">订单退回到客服,让客服选择是继续操作还是撤单(仍旧保留订单继续操作的可能性)</h4>

      <div v-if="opertype==1">

            <h4 style="color:red;margin:8px 0px">订单已撤单,该订单彻底不做了。</h4>
            <!-- @@ 进口更改 -->
          <div  style="margin:15px 0;">
          <el-steps :active="stepsActive" >
            <el-step :title="(!ishx?'航线确认运费(已完成)':'客服确认杂费(已完成)')" :description="(!ishx?'航线确认有无运费':'客服确认有无杂费')" v-if="isCostConfirm&&inputModelData.opersystem=='出口'"></el-step>

            <el-step :title="wagedom+'撤单(进行中)'" :description="wagedom+'发起撤单，说明撤单原因并确认有无'+(ishx?'运费':'杂费')"></el-step>
            <!-- <el-step title="航线撤单" description="航线发起撤单，说明撤单原因并确认有无杂费"></el-step> -->
            <!-- <el-step :title="(!ishx?'航线确认运费':'客服确认杂费')" :description="(!ishx?'航线再确认有无运费':'客服再确认有无杂费')"></el-step> -->
            <el-step :title="(!ishx?'航线确认运费':'客服确认杂费')" :description="(!ishx?'航线再确认有无运费':'客服再确认有无杂费')" v-if="!isCostConfirm"></el-step>
            <!-- <el-step title="客服确认运费" description="客服再确认有无运费"></el-step> -->
            <el-step title="撤单成功" description="运费及杂费都确认完毕，撤单成功"></el-step>
            <el-step title="结算审单" description="结算对该订单进行审单"></el-step>
          </el-steps>
          </div>



        <el-form>
          <el-form-item label="撤单原因：">
            <my-select :groupid="220" class="input-required" :disabled="hasCanceled" v-model="orderCancelForm.canceltype"></my-select>
          </el-form-item>


          <el-form-item label="撤单描述：">
            <el-input
              type="textarea"
              style="width:78%"
              :rows="2"
              :class="{'input-required':orderCancelForm.canceltype=='其他原因'}"
              :disabled="hasCanceled"
              v-model="orderCancelForm.cancelreason"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="总单处理结果："
            v-show="inputModelData.mawb&&!inputModelData.opersystem!='国内服务'&&(inputModelData.czlx=='自货'||inputModelData.czlx=='唯凯配舱'?hasMaincamp:true)&&inputModelData.system=='空出'"
          >
            <el-radio v-model="orderCancelForm.status" label="1">可用</el-radio>
            <!-- <el-radio v-model="orderCancelForm.status" label="4">不可用</el-radio> -->
            <el-radio v-model="orderCancelForm.status" label="5">作废</el-radio>
          </el-form-item>
          <el-form-item label="处理结果：" v-if="inputModelData.system=='空进'&&(orderCancelForm.canceltype=='客户弃货'||orderCancelForm.canceltype=='海关退货')">
            <el-radio v-model="orderCancelForm.handleRs" label="1" style="margin-left:20px;">未处理</el-radio>
            <el-radio v-model="orderCancelForm.handleRs" label="2">已处理</el-radio>
          </el-form-item>
          <el-form-item label="处理时间：" v-if="inputModelData.system=='空进'&&(orderCancelForm.canceltype=='客户弃货'||orderCancelForm.canceltype=='海关退货')">
             <el-date-picker
              v-model="orderCancelForm.handelDate"
              type="date"
              placeholder="选择日期"
              :class="[orderCancelForm.handleRs=='2'?'input-required':'']"
              :format="'yyyy-MM-dd'"
              :value-format="'yyyy-MM-dd'"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="作废备注：" v-if="orderCancelForm.status=='5'">
            <el-input type="textarea" v-model="orderCancelForm.remark"  style="width:78%"></el-input>
          </el-form-item>
          <el-form-item label="有无费用：">
            <el-radio v-model="orderCancelForm.iswage" label="1" style="margin-left:20px;">有</el-radio>
            <el-radio v-model="orderCancelForm.iswage" label="2" :disabled="haswage">无</el-radio>
            <!-- <el-radio v-model="orderCancelForm.iswage" label="3">待定</el-radio> -->
          </el-form-item>
          <!-- <el-form-item style="text-align:right;margin-top:12px;">
            <el-button  @click="$emit('update:orderCancel',false)" type="primary" plain>取消</el-button>
            <el-button  type="primary" plain @click="confirmFunc">确定</el-button>
          </el-form-item>-->
        </el-form>
<!-- {{childPonoChecked}} -->
        <div style="margin-top:15px;" v-show="orderCancelForm.iswage==1">

           <div v-if="inputModelData.iscomboine==1">
            <el-tabs v-model="childPonoChecked" >
              <el-tab-pane :label="inputModelData.pono"></el-tab-pane>
              <el-tab-pane :label="item.pono" v-for="item in hawbList" :key="item.pono"></el-tab-pane>
            </el-tabs>
          </div>

           <el-tabs type="border-card"  v-model="activeName">
            <el-tab-pane label="客服费用" name="客服">
                        <costTable
                        wagedom="客服"
                        wageinout="1"
                        pagedom=2
                        :costdata="tablecostdata"
                        :mawbinfo="inputModelData"
                       :sid="childPonoBoguid"
                        @success="getMawbCost"
                          :ifShowConfirmBtn="false"
                        :class="{disabled:wagedom!=='客服'||(inputModelData.iscomboine==1&&childPonoChecked==0)}"
                      ></costTable>
                      <costTable
                        wagedom="客服"
                        wageinout="2"
                        :sid="childPonoBoguid"
                        pagedom=2
                        :costdata="tablecostdata"
                        :mawbinfo="inputModelData"
                        @success="getMawbCost"
                          :ifShowConfirmBtn="false"
                        :class="{disabled:wagedom!=='客服'}"
                      ></costTable>
            </el-tab-pane>
            <el-tab-pane label="航线费用" name="航线" >

                         <costTable
                          wagedom="航线"
                          wageinout="1"
                          pagedom=2
                         :sid="childPonoBoguid"
                          :costdata="tablecostdata"
                          :mawbinfo="inputModelData"
                          @success="getMawbCost"
                          :ifShowConfirmBtn="false"
                           :class="{disabled:wagedom!=='航线'||(inputModelData.iscomboine==1&&childPonoChecked==0)}"
                        ></costTable>

                        <costTable
                          wagedom="航线"
                          wageinout="2"
                          pagedom=2
                          :sid="childPonoBoguid"
                          :costdata="tablecostdata"
                          :mawbinfo="inputModelData"
                          @success="getMawbCost"
                          :ifShowConfirmBtn="false"
                           :class="{disabled:wagedom!=='航线'}"
                        ></costTable>
            </el-tab-pane>
          </el-tabs>
        </div>

      </div>

      <el-form v-if="opertype==2">
        <el-form-item label="驳回原因：">
          <my-select :groupid="230" class="input-required" v-model="orderCancelForm.rollbacktype"></my-select>
        </el-form-item>
        <el-form-item label="驳回描述：">
          <el-input
            type="textarea"
            style="width:78%"
            :rows="2"
            v-model="orderCancelForm.rollbackreason"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-form v-if="opertype==3">
        <slot name="back"></slot>
      </el-form>

      <div style="text-align:right;margin-top:12px;">
        <el-button type="primary" @click="confirmFunc" v-show="opertype!=3">确定</el-button>
        <el-button @click="$emit('update:orderCancel',false)" type="primary" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from "../../api/localStorage.js";

export default {
  props: {
    inputModelData: Object,
    //  pagetype:{
    //    type:[Number,String],
    //    default:1 //撤单 2驳回 3退关
    //  },
    dom: {
      type: [Number, String],
      default: 1 //1客服撤单,从客服综合查询和一般详细中进去 2航线上榜确认驳回，表格上的驳回操作 ,航线退回客服，签单配舱表单按钮组中的退回客服 3客服综合查询明细 有报关服务 退关按钮 4独立BOGN撤单，非下达的bogn 5航线综合查询明细进去的撤单 6 客服撤单查询列表中的撤单，操作是航线 7 航线撤单查询列表中的撤单，操作是客服
    },
    orderCancel: Boolean,
    czMark:{//1是否一货两站,只能点航线驳回 2.本站，只能点撤单
      type:[Number, String],
      default:3
    }
  },
  components: {},

  data() {
    return {
      opertype: "1",
      costdata: [],
      haswage: false,
      hasMaincamp: false,
      orderCancelForm: {
        canceltype: "",
        cancelreason: "",
        status: "1",
        iswage: "",
        boguid: "",
        sid: "",
        area:this.inputModelData.area||'',
        // nodelist: [{ nodedate: "", nodeman: "", nodecode: "AO5065", sid: "" }],
        wage: [],
        rollbackreason: "",
        rollbacktype: "",
        canceling:'',
        remark:'',
        handleRs:'',//进口处理结果
        handelDate:'',//进口处理时间
      },
      hasCanceled:false,
      activeName:'',
      isCostConfirm:false,//是否航线或客服费用已确认
      stepsActive:0,
      hawbList:[],
      childPonoChecked:0
    };
  },

  created() {
    // if (this.dom == 2) {
    //   this.opertype = String(this.dom);
    // } else {
    //   this.opertype = "1";
    // }
    if(this.czMark==1){
      this.opertype = "2";
    }
    this.getMawbCost();
    if(this.inputModelData.czlx=='自货'||this.inputModelData.czlx=='唯凯配舱'){
       this.getMaincamp();
    }

     let cancelreason=this.inputModelData.cancelreason&&JSON.parse(this.inputModelData.cancelreason)||''
    // console.log(cancelreason)
     if(cancelreason.length==1){
       this.hasCanceled=true
       this.orderCancelForm.canceltype=cancelreason[0].canceltype
       this.orderCancelForm.cancelreason=cancelreason[0].delbillreason
     }
     this.activeName=this.wagedom
     this.getHawblist()
  },
  computed: {
    visible: {
      get() {
        return this.orderCancel;
      },
      set(val) {
        this.$emit("update:orderCancel", false);
      }
    },
    title() {
      switch (this.opertype) {
        case "2":
          return "航线驳回";
          break;
        case "3":
          return "退关";
          break;
        default:
          return "撤单";
          break;
      }
    },
    ishx() {
      return this.dom == 2 || this.dom == 5 || this.dom == 6;
    },
    wagedom() {
      return this.ishx ? "航线" : "客服";
    },
    childPonoBoguid(){
      let index=this.childPonoChecked
      if(index>0){
        return this.hawbList[index-1].boguid
      }
      return ''
    },
    tablecostdata(){
        let index=this.childPonoChecked
      if(index>0){
        return this.costdata.filter(i=>i.sid==this.childPonoBoguid)
      }

      return this.costdata
    }
  },
  methods: {
    getHawblist(){
      if(this.inputModelData.iscomboine==1){
         this.$axios({
              method: "get",
              url: this.$store.state.webApi + "api/ExHpoAxpline",
              params: { groupid: this.inputModelData.boguid },
              loading: true,
              tip: false
            }).then(results => {
              // console.log("分单数据");
              // console.log(results.data);
              this.hawbList = results.data || [];
          })  
      }
        
    },
    handleClick(tab){

    },
    confirmFunc() {
      if (this.opertype == 1) {
        this.cancelOrderFunc(); //撤单
      }
      if (this.opertype == 2) {
        this.bhOrderFunc(); //驳回
      }
    },
    cancelOrderFunc() {
      /*    this.orderCancelForm.nodelist[0].nodeman=localStorage.usrname
        this.orderCancelForm.nodelist[0].nodedate=formatDate(new Date(),'yyyy-MM-dd')
        this.orderCancelForm.nodelist[0].sid=this.inputModelData.serviceguid||this.getServiceGuid(
          "OA0010",
          "guid"
        );
 */
      let json = JSON.parse(JSON.stringify(this.orderCancelForm));
      
      if (!json.canceltype) {
        return this.$message.error("请选择撤单原因！");
      }
      if (json.canceltype=='其他原因'&&!json.cancelreason) {
        return this.$message.error("请输入撤单描述！");
      }
      if (!json.iswage) {
        this.$message.error("请选择有无费用！");
        return;
      }
      if (json.iswage == 1 && this.costdata.length == 0) {
        return this.$message.error("请输入至少一条费用！");
      }
      //@@ 进口更改
      if(json.handleRs=='2'&&!json.handelDate){
        return this.$message.error("请选择处理时间");
      }
      json.wage = json.iswage == 1 ? this.costdata : [];
      let canceling=this.ishx ? 2 : 1;
      json.canceling = canceling
      //  json.canceling=this.inputModelData.pagetype==15?2:1
      json.boguid = this.inputModelData.boguid;
      json.sid = this.inputModelData.guid;
      json.area = this.inputModelData.area;

      let obj= {
        reasontype: "撤单",
        delbillreason: json.cancelreason,
        delbillman: localStorage.usrname,
        delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
        canceltype: json.canceltype,
        status: json.status,
        iswage: json.iswage,
        ifshowRes: this.inputModelData.mawb && this.hasMaincamp,
        canceling: canceling,
        area: this.inputModelData.area || '',
        handleRs:json.handleRs,
        handelDate:json.handelDate
      }
      // if(!(this.inputModelData.mawb && !this.inputModelData.opersystem != '国内服务' && (this.inputModelData.czlx == '自货' || this.inputModelData.czlx == '唯凯配舱' ? this.hasMaincamp : true) && this.inputModelData.system == '空出')){
      //     obj.status=-1
      // }

      let cancelreason=[
        obj
      ]
      if(this.hasCanceled){
          let json=JSON.parse(this.inputModelData.cancelreason)[0]
         // json.canceling=2
          cancelreason.unshift(json)
      }
      json.cancelreason = JSON.stringify(cancelreason);



      delete json.rollbackreason;
      delete json.rollbacktype;


/*
      if (!this.hasMaincamp) {
        json.status = -1;
      } */

        if(!(this.inputModelData.mawb && !this.inputModelData.opersystem != '国内服务' && (this.inputModelData.czlx == '自货' || this.inputModelData.czlx == '唯凯配舱' ? this.hasMaincamp : true) && this.inputModelData.system == '空出')){
           json.status = -1;
       }
      
      // 订单未完善页面，加isimpertect字段
      if (this.inputModelData.pagetype == 11) {
        json.isimperfect = 1;
      }
 //console.log(json);return

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/CancelOrder",
        data: json,
        area: this.inputModelData.area,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.$emit("update:orderCancel", false);
          this.$emit("success", true);
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    bhOrderFunc() {
      var json = {};
      json.rollbackreason = this.orderCancelForm.rollbackreason;
      json.rollbacktype = this.orderCancelForm.rollbacktype;
      json.boguid = this.inputModelData.boguid;
      json.sid = this.inputModelData.guid;
      json.pono = this.inputModelData.pono;
      ////console.log(JSON.stringify(this.orderCancelForm))

      if (!json.rollbacktype) {
        this.$message.error("请选择驳回原因！");
        return;
      }
      if (json.rollbacktype == "其他原因" && !json.rollbackreason) {
        this.$message.error("请填写驳回描述！");
        return;
      }

      json.routedelreason = JSON.stringify([
        {
          reasontype: "航线驳回",
          delbillreason: json.rollbackreason,
          delbillman: localStorage.usrname,
          delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
          rollbackreason: json.rollbackreason,
          rollbacktype: json.rollbacktype,
          ifshowRes: true,
          area:this.inputModelData.area||''
        }
      ]);
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxpline/RejectOrder",
        data: json,
        loading: true,
        noarea: "1"
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.$emit("update:orderCancel", false);
            this.$emit("success", true);
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },

    getMawbCost() {
      //获取总单费用信息
      this.orderCancelForm.wage = [];

      let json = {
        sid: this.inputModelData.guid,
        boguid: this.inputModelData.boguid
      };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
        /*         console.log("总单费用");
        console.log(JSON.stringify(results.data)); */

        //this.$set(this.orderCancelForm,'wage',results.data.filter(i=>i.wagedom==this.wagedom&&i.yssys!=2))

        // this.orderCancelForm.wage = results.data.filter(i=>i.wagedom==this.wagedom&&i.yssys!=2);
        this.costdata = results.data.filter(
          i => i.yssys != 2
        );
        let costConfirm=results.data.filter(i => i.yssys == 2&&i.wagedom==(this.ishx?'客服':'航线'));
        this.isCostConfirm=costConfirm.filter(i=>i.confirmstatus==700).length==costConfirm.length || costConfirm.length==0;//判断系统费用有无确认

      if(this.isCostConfirm){
        this.stepsActive=this.inputModelData.system!='空进'?2:1
      }

        if (this.costdata.filter(i=>i.wagedom==this.wagedom).length>0) {
          this.haswage = true;
          this.orderCancelForm.iswage = "1";
        } else {
          this.haswage = false;
          this.orderCancelForm.iswage = "";
        }

        if(this.inputModelData.area!=this.conditionalAreaForBuild&&this.costdata.filter(i=>i.wagedom).length>0){
          this.haswage = true;
          this.orderCancelForm.iswage = "1";
        }
      });
    },
    async getMaincamp() {
      let json = { boguid: this.inputModelData.boguid };
      let flag = true;
      await this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExBoBase/GetBoBaseServiceInfo",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
        flag = results.data;
        this.hasMaincamp = results.data;
      });
      return flag;
    }
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.el-tab-pane{
  padding:0px
}
</style>


