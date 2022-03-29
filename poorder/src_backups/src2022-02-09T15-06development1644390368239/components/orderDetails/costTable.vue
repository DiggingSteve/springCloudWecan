<template>
  <div style="margin-bottom:20px;">
    <!-- {{mawbinfo.serviceList&&mawbinfo.serviceList.filter(i=>i.isdel==1).length}} -->
    <!-- {{wageConfirmOrCancel}} -->
    <!-- {{wagedom}} -->
    <!-- {{tableDataBogn}} -->
    <!-- {{tableData}} -->
    <!-- {{sid}} -->
    <div class="detail" :class="[wageinout==1?'detailPaneYoung':'detailPaneRed']">
      <div
        class="detail-title"
        style="display:flex;align-items:center;justify-content:space-between"
      >
        <div style="width:600px;display:flex;align-items:center;">
          <p>{{wagedom}}{{wagedom?'服务':''}}{{wageinout==1?"应收":"应付"}}</p>
          <div style="margin-left:16px" :style="{color:wageinout==1?'#00CC66':'red'}">
            <strong>{{wageinout==1?"应收":"应付"}}：{{costAll}}&nbsp;元</strong>
            <strong
              v-if="wageinout==1"
              style="margin-left:60px;color:#FFA557"
              v-show="wagedom&&wagedom!='航线'"
            >盈利：{{profit}}元</strong>
          </div>
        </div>
        <div>
          <!-- {{ifShowConfirmBtn}} -->
          <!-- <el-button :type="wageConfirmOrCancel?'primary':'danger'" v-if="wageinout==2&&ifShowConfirmBtn&&(mawbinfo.old_sendhpoid>0||tableData.length>0)&&mawbinfo.gid!=-1" @click="confirmWage">{{wageConfirmOrCancel?"应付确认":"取消确认"}}</el-button> -->
          <el-button
            :type="wageConfirmOrCancel?'primary':'danger'"
            v-if="ifShowConfirmBtn&&mawbinfo.opersystem=='国内服务'&&selServiceLength&&(mawbinfo.gid!=-1||(mawbinfo.gid==-1&&wageinout==2))"
            @click="confirmWage"
          >{{wageConfirmOrCancel?((wageinout==1?"应收":"应付")+"确认"):"取消确认"}}</el-button>
        </div>
      </div>
      <div class="detail-c" :class="{divDisabled:!wageConfirmOrCancel}">
        <commonTable
          class="commonTable"
          :head="tableHead"
          :table-data="tableData"
          style="margin-top:8px;"
          :tableIndex="0"
          :colorIndex="putIndex"
          :wagetype="wageinout"
        >
          <template slot="firstTd">
            <td>
              <i
                class="el-icon-circle-plus"
                v-show="ifstrict"
                style="width:18px;height:18px;font-size:18px;cursor:pointer;color:#67C23A;vertical-align:-2px;"
                @click="disabled=false"
              ></i>
              <i
                class="icon-save"
                style="font-size:16px;height:16px;vertical-align:-3px;"
                @click="saveListInfo"
              ></i>
              <i
                class="el-icon-close"
                v-show="!ifstrict"
                style="font-size:16px;height:16px;vertical-align:-3px;"
                @click="initFunc"
              ></i>
            </td>
            <td>
              <input
                type="checkbox"
                v-model="isfreeCheck"
                :disabled="disabled"
                style="vertical-align:-3px;"
              />
            </td>
            <!-- <td v-if="pagetype==2">
             <my-select
                :options="wagedomOptions"
                itemstyle="min-width:130px;width:100%;margin-bottom:0px;display:inline-block;max-width:130px"
                v-model="editData.wagedom"
                :disabled="disabled"
              ></my-select>
            </td>-->
            <td>
              <pageSelect
                :pagetype="wageinout==1?2:3"
                :modelval.sync="editData.gid"
                :ifRefreshData.sync="ifRefreshData"
                @change="jsxmdata"
                :area="mawbinfo.area"
                :fid="mawbinfo.fid"
                :wtxmname="mawbinfo.wtxmname"
              >
                <template slot="other" v-if="wageinout==1">
                  <jsdxwh
                    :fid="mawbinfo.fid"
                    :area="mawbinfo.area"
                    @success="ifRefreshData=!ifRefreshData"
                  ></jsdxwh>
                </template>
              </pageSelect>
            </td>
            <td>
              <page-select
                :modelval.sync="editData.items"
                :servicecode="servicecode"
                :pagetype="5"
                :disabled="editData.belong==3"
              ></page-select>
            </td>
            <td>
              <my-select
                :groupid="33"
                itemstyle="min-width:110px;width:100%;margin-bottom:0px;max-width:130px"
                v-model="editData.wagetype"
                :disabled="disabled"
              ></my-select>
            </td>
            <td>
              <el-input v-model.number="editData.num" style="min-width:80px" v-verify="'fixedTwo'"></el-input>
            </td>
            <td>
              <el-input
                v-model="editData.price"
                :disabled="editData.belong==3"
                style="min-width:80px"
                v-verify="'fixedFTwo'"
              ></el-input>
            </td>
            <td>
              <currencySelect
                itemstyle="min-width:80px;width:100%;margin-bottom:0px;max-width:130px"
                v-model="editData.currency"
                :disabled="editData.belong==3"
              ></currencySelect>
            </td>
            <td>
              <el-input v-model="editData.leastwageall" :disabled="true" style="min-width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="editData.wageall" :disabled="true" style="min-width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="editData.changerate" :disabled="true" style="min-width:80px"></el-input>
            </td>
            <td>
              <el-input v-model="editData.remark" :disabled="disabled" style="min-width:80px"></el-input>
            </td>
          </template>
          <template slot="isfree" slot-scope="props">{{props.data.value==1?'否':'是'}}</template>
          <template slot="operate" slot-scope="props">
            <i
              class="el-icon-setting"
              @click="setListInfo(props.data.index)"
              :class="{'tdDisabled':props.data.row.isallin==1&&pagedom==1}"
            ></i>
            <i
              class="el-icon-delete"
              @click="delListInfo(props.data.index)"
              :class="{'tdDisabled':(props.data.row.belong==2||props.data.row.isallin==1)&&pagedom==1}"
            ></i>
          </template>
          <template slot="leastwageall" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>
          <template slot="wageall" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>
          <template slot="changerate" slot-scope="props">{{Number(props.data.value).toFixed(4)}}</template>
          <template slot="gid" slot-scope="props">{{props.data.row.settname}}</template>
        </commonTable>
      </div>
    </div>
    <!-- <div style="text-align:right;margin-top:20px">
          <el-button @click="saveIncidentalWage" type="primary">保存费用信息</el-button>
    </div>-->
  </div>
</template>
<script>
import {
  getChangeRate,
  computedWeight,
  configData
} from "../../api/localStorage.js";
export default {
  props: {
    pagetype: {
      type: [Number, String],
      default: 1 //修改页面的服务费用 2新增里面的费用
    },
    wageinout: {
      //费用类型 1应收 2应付
      type: [Number, String],
      default: 1
    },
    pagedom: {
      //费用类型 1 正常 2 撤单
      type: [Number, String],
      default: 1
    },
    wagedom: {
      //来源 “空运” “报关”等
      type: String,
      default: ""
    },
    servicetype: {
      //服务类别。  “始发港服务”，“目的港服务”,不传默认总单上的空运服务
      type: String,
      default: ""
    },
    servicecode: {
      type: String,
      default: ""
    },
    costdata: {
      //所有表格信息
      type: Array,
      default() {
        return [];
      }
    },
    mawbinfo: {
      //总单详细
      type: Object,
      required: true
    },
    serviceguid: [Number, String],
    orderpgid: [Number, String],
    childpgid: [Number, String],
    ifstrict: {
      //新增时候是否是严格模式，如果是严格模式，需要点击加号才能新增
      type: Boolean,
      default: false
    },
    thJsxmData: Array,
    incidentalWage: {
      type: Array,
      default() {
        return [];
      }
    }, //总单杂费
    serviceSelArr: {
      //新增所选服务
      type: Array,
      default: () => []
    },
    ifShowConfirmBtn: {
      //bogn绑定或者bogn下达是需要显示应付确认按钮
      type: Boolean,
      default: true
    },
    sid: {
      //分单boguid,已合并的订单在撤单时新增费用绑定在原来子订单上
      type: String,
      default: ''
    }
  },
  components: {},

  data() {
    //gid 应收带orderguid 应付带总单供应商
    return {
      disabled: false,
      putIndex: -1,
      editData: {
        isfree: 1,
        wagedom: "",
        settname: "", //结算对象英文名
        // gid:this.wageinout==1?this.mawbinfo.gid:null,
        gid:
          this.wageinout == 1
            ? this.orderpgid > 0
              ? this.orderpgid
              : this.mawbinfo.gid
            : this.mawbinfo.mawb &&
              this.mawbinfo.mawbgid > 0 &&
              this.wagedom == "航线"
            ? this.mawbinfo.mawbgid
            : "",
        items: "",
        wagetype: "",
        num: "",
        price: "",
        currency: "人民币",
        leastwageall: 0,
        wageall: 0,
        changerate: "1.0000",
        remark: ""
      },
      tableHead: [
        { title: "操作", field: "operate" },
        { title: "免", field: "isfree" },
        // { title: "所属服务", field: "wagedom",hidden:this.pagetype==1 },
        { title: "结算对象", field: "gid" },
        { title: "服务项目", field: "items" },
        { title: "计费方式", field: "wagetype" },
        { title: "数量", field: "num" },
        { title: "单价", field: "price" },
        { title: "币种", field: "currency" },
        { title: "金额", field: "leastwageall" },
        { title: "RMB金额", field: "wageall" },
        { title: "汇率", field: "changerate" },
        { title: "备注", field: "remark" }
      ],
      tableData: [],
      haswagePost: [], //杂费新增的数据
      haswagePut: [], //杂费修改的数据
      ifRefreshData: false,
      tableDataBogn: [] //用于bogn下达是判断系统费用是否确认
    };
  },
  methods: {
    initFunc() {
      this.editData = {
        isfree: 1,
        wagedom: "",
        settname: "",
        gid: null,
        items: "",
        wagetype: "",
        num: "",
        price: "",
        currency: "人民币",
        leastwageall: 0,
        wageall: 0,
        changerate: "1.0000",
        remark: ""
      };
      this.setEditGid();
      this.putIndex = -1;
    },
    setEditGid() {
      if (this.wageinout == 1) {
        this.editData.gid =
          this.orderpgid > 0 ? this.orderpgid : Number(this.mawbinfo.gid);
      } else {
        if (this.mawbinfo.childguid > 0) {
          this.editData.gid = this.childpgid;
        } else {
          this.editData.gid =
            this.mawbinfo.mawb &&
            this.mawbinfo.mawbgid > 0 &&
            this.wagedom == "航线"
              ? this.mawbinfo.mawbgid
              : "";
        }
        if (this.servicecode == "AA0510") {
          this.editData.gid = this.mawbinfo.truckgid;
        }
      }
    },
    saveListInfo() {
      // if(this.disabled){
      //   return;
      // }
      if (this.checkRequier !== "") {
        this.$message.error("请填写 " + this.checkRequier);
        return;
      }
      if (this.putIndex == -1) {
        //新增
        var json = this.editData;
        
        json.boguid = this.mawbinfo.boguid;
        json.wageinout = this.wageinout;
        json.wagedom = this.wagedom || json.wagedom;
        if (json.wagedom != "航线") {
          json.wagedom = "客服";
        }
        json.servicetype = this.servicetype;
        json.servicecode = this.servicecode;
        json.area = this.mawbinfo.area;
        if(this.sid){
           json.sid = this.sid;
        }
        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxplineWage",
          data: json,
          loading: false,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            // json.guid=results.data.resultguid
            //  this.tableData.push(json)
            this.initFunc();
            this.editData.gid = json.gid;
            if (this.pagetype == 1) {
              this.$emit("success", true);
            } else {
              this.getMawbCost();
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      } else {
        //修改
        var newObj = Object.assign(
          {},
          this.tableData[this.putIndex],
          this.editData
        );
        newObj.boguid = this.mawbinfo.boguid;
        newObj.area = this.mawbinfo.area;
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExHpoAxplineWage",
          data: newObj,
          loading: false,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            // this.tableData.splice(this.putIndex,1,newObj)
            this.initFunc();
            this.editData.gid = newObj.gid;
            if (this.pagetype == 1) {
              this.$emit("success", true);
            } else {
              this.getMawbCost();
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      }
    },
    saveIncidentalWage() {
      var method = "post";
      var data = [];
      if (this.haswagePut.length == 0 && this.haswagePost.length == 0) {
        return;
      }
      if (this.haswagePut.length > 0) {
        method = "put";
        data = this.haswagePut;
      } else {
        data = this.haswagePost;
      }

      if (data.length > 0) {
        this.$axios({
          method: method,
          url: this.$store.state.webApi + "api/ExHpoAxplineWage",
          data: {
            wagelist: data,
            boguid: this.mawbinfo.boguid,
            // sid: this.mawbinfo.guid,
            area: this.mawbinfo.area
          },
          loading: true,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            if (this.pagetype == 1) {
              this.$emit("success", true);
            } else {
              this.getMawbCost();
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      }
    },
    setListInfo(index) {
      this.putIndex = index;
      this.$nextTick(() => {
        this.editData = { ...this.tableData[index] };
      });

      //  this.disabled=false;
    },
    delListInfo(index) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var json = {
            guid: this.tableData[index].guid,
            // sid: this.mawbinfo.guid,
            boguid: this.mawbinfo.boguid,
            area: this.mawbinfo.area
          };
          this.$axios({
            method: "delete",
            url: this.$store.state.webApi + "api/ExHpoAxplineWage",
            data: json,
            loading: true,
            tip: false
          }).then(results => {
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              // this.tableData.splice(index,1)
              this.initFunc();
              if (this.pagetype == 1) {
                this.$emit("success", true);
              } else {
                this.getMawbCost();
              }
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        })
        .catch(() => {});
    },
    jsxmdata(data) {
      //console.log(111,data)
      //  this.editData.gid=data.id
      //  this.editData.settname=data.jsxmdata
      this.editData.settname = data.usr_name;
    },
    getMawbCost() {
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineWage",
        params: { boguid: this.mawbinfo.boguid },
        loading: false,
        tip: false
      }).then(results => {
        //  console.log("总单费用");
        //  console.log(JSON.stringify(results.data));
        this.tableData = results.data.filter(item => {
          return (
            item.wageinout == this.wageinout &&
            item.yssys != 2 &&
            item.servicecode == this.servicecode
          );
        });
        this.tableDataBogn = results.data.filter(item => {
          // if(this.mawbinfo.old_sendhpoid>0){
          //       return item.wageinout==this.wageinout
          //   }else{
          //      return item.wageinout==this.wageinout&&item.servicecode==this.servicecode
          //  }
          return item.wageinout == this.wageinout;
        });
      });
    },
    confirmWage() {
      //应付确认与取消
      let obj = {
        boguid: this.mawbinfo.boguid,
        wageinout: this.wageinout,
        status: this.wageConfirmOrCancel ? 700 : 1,
        czman: localStorage.usrname,
        isyssys: 2,
        wagedom: "结算",
        //   servicecode:this.servicecode,
        // guidList:this.tableData.map(i=>i.guid).toString()||this.tableDataBogn.map(i=>i.guid).toString()
        guidList: this.tableDataBogn.map(i => i.guid).toString()
      };

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxplineWageConfirm",
        data: obj,
        loading: true,
        tip: false
      }).then(result => {
        if (result.data.resultstatus == 0) {
          this.getMawbCost();
          this.$message.success(result.data.resultmessage);
        } else {
          this.$message.error(result.data.resultmessage);
        }
      });
    }
  },
  computed: {
    selServiceLength() {
      //只有一个服务的时候显示确认按钮
      return (
        this.mawbinfo.serviceList &&
        this.mawbinfo.serviceList.filter(i => i.isdel == 1).length == 1
      );
    },
    wageConfirmOrCancel() {
      //判断费用是确认还是取消
      //confirmstatus 1未确认 700已确认；返回true显示确认按钮
      let arr = this.tableDataBogn.filter(i => i.wagedom == "" && i.yssys == 2); //判断系统费用的确认即可
      return arr.filter(i => i.confirmstatus == 1).length == arr.length;
    },
    wagedomOptions() {
      let arr = [];
      let data = configData(1);
      for (let i in data) {
        if (this.serviceSelArr.includes(i)) {
          arr.push({ label: data[i].wagedom, value: data[i].wagedom });
        }
      }
      return arr;
    },
    costAll() {
      var wageall = 0;
      this.tableData.forEach(item => {
        if (item.isfree == 1) {
          wageall += Number(item.wageall);
        }
      });
      return wageall.toFixed(2) || "--";
    },
    isfreeCheck: {
      get() {
        return this.editData.isfree == 2 ? true : false;
      },
      set(val) {
        this.editData.isfree = val ? 2 : 1;
      }
    },
    checkRequier() {
      //检查是否必填，除备注外全部必填
      var require = "";
      Object.keys(this.editData)
        .reverse()
        .forEach(i => {
          if (
            i !== "remark" &&
            (!this.editData[i] || this.editData[i] == "NaN")
          ) {
            this.tableHead.forEach(item => {
              if (i == item.field && !item.hidden) {
                require = item.title;
              }
            });
          }
        });
      return require;
    },
    profit() {
      var yingshou = 0;
      var yingfu = 0;
      var arr = this.costdata.concat(this.incidentalWage);
      //console.log(JSON.stringify(arr))
      arr.forEach(i => {
        if (i.servicecode == this.servicecode && i.isfree == 1) {
          if (i.wageinout == 1) {
            yingshou += Number(i.wageall);
          } else {
            yingfu += Number(i.wageall);
          }
        }
      });
      return Number(yingshou - yingfu).toFixed(2);
    }
  },
  created() {
    // this.getMawbCost()
    this.$watch(
      function() {
        return this.editData.num + this.editData.price + this.editData.currency;
      },
      function(newVal, oldVal) {
        var leastwageall =
          Number(this.editData.num) * Number(this.editData.price);
        this.editData.wageall =
          (leastwageall * Number(this.editData.changerate)).toFixed(2) || 0;
        this.editData.leastwageall = leastwageall.toFixed(2) || 0;
      }
    );

    this.$watch(
      function() {
        return this.costdata + this.incidentalWage;
      },
      function(val) {
        this.tableData = [];
        this.tableData = this.costdata.filter(item => {
          //  return (item.wagedom==this.wagedom)&&(item.wageinout==this.wageinout)&&(item.servicetype==this.servicetype)
          if (this.wagedom == "航线" || this.wagedom == "客服") {
            if (this.pagedom == 2 && this.mawbinfo.area !== this.conditionalAreaForBuild) {
              //外站撤单页面，不过滤wagedom
              return (
                item.wagedom &&
                item.yssys != 2 &&
                item.wageinout == this.wageinout
              );
            }
            return (
              item.wagedom == this.wagedom &&
              item.yssys != 2 &&
              item.wageinout == this.wageinout
            );
          } else {
            return (
              item.servicecode == this.servicecode &&
              item.wageinout == this.wageinout &&
              item.yssys != 2
            );
          }
        });

        if (this.wagedom == "航线" || this.wagedom == "客服") {
          // this.tableData=this.tableData.concat(this.incidentalWage)
          let haswageIndex = -1;
          var arr = [];
          var arr2 = [];
          this.incidentalWage.forEach(i => {
            this.tableData.forEach((e, index) => {
              if (
                e.items == i.items &&
                e.isallin == 1 &&
                e.wagedom == i.wagedom &&
                e.wageinout == i.wageinout
              ) {
                haswageIndex = index;
              }
            });
            if (haswageIndex == -1) {
              arr.push(i);
            } else {
              if (
                this.tableData[haswageIndex].price != i.price ||
                this.tableData[haswageIndex].currency != i.currency ||
                this.tableData[haswageIndex].num != i.num
              ) {
                this.tableData[haswageIndex].price = i.price;
                this.tableData[haswageIndex].wageall = i.wageall;
                this.tableData[haswageIndex].leastwageall = i.leastwageall;
                this.tableData[haswageIndex].currency = i.currency;
                this.tableData[haswageIndex].changerate = i.changerate;
                this.tableData[haswageIndex].num = i.num;
                arr2.push(this.tableData[haswageIndex]);
              }
            }
          });
          this.haswagePost = arr;
          this.haswagePut = arr2;
          this.tableData = this.tableData.concat(arr);
        } else {
          this.tableDataBogn = this.costdata.filter(item => {
            // if(this.mawbinfo.old_sendhpoid>0){
            //       return item.wageinout==this.wageinout
            //   }else{
            //      return item.wageinout==this.wageinout&&item.servicecode==this.servicecode
            //  }
            return item.wageinout == this.wageinout;
          });
        }
      },
      { immediate: true, deep: true }
    );
  },
  watch: {
    "editData.currency": {
      handler(val) {
        this.editData.changerate = getChangeRate(val) || 0;
      },
      immediate: true
    },
    "editData.wagetype"(val) {
      if (
        (this.tableData[this.putIndex] &&
          this.tableData[this.putIndex].wagetype) == val
      ) {
        return;
      }
      switch (val) {
        case "总运单票数":
          this.editData.num = 1;
          break;
        case "总运单件数":
          this.editData.num = this.mawbinfo.zdpiece;
          break;
        case "分运单票数":
          this.editData.num = this.mawbinfo.hawbnum;
          break;
        case "箱":
          this.editData.num = this.mawbinfo.realpiece;
          break;
        case "票":
          this.editData.num = "1";
          break;
        case "计重":
          this.editData.num = computedWeight(
            this.mawbinfo.zdvolume,
            this.mawbinfo.zdweight
          );
          break;
        case "结算重量":
          this.editData.num =
            this.wageinout == 1
              ? this.mawbinfo.accountweightin
              : this.mawbinfo.accountweightout;
          break;
        case "毛重":
          this.editData.num = this.mawbinfo.realweight;
          break;
      }
    },
    thJsxmData: {
      handler(val) {
        if (val && this.wagedom == "提货" && this.wageinout == 2) {
          //带出提货结算对象
          var arr = [];
          val.forEach(i => {
            if (!arr.includes(i.bggys)) {
              arr.push(i.bggys);
            }
          });
          if (arr.length == 1) {
            this.editData.gid = arr[0];
          } else {
            this.editData.gid = "";
          }
        }
      },
      immediate: true,
      deep: true
    },
    "mawbinfo.mawbgid": {
      handler(val) {
        this.setEditGid();
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.divDisabled {
  cursor: not-allowed;
  > div {
    pointer-events: none;
    /deep/ td i {
      pointer-events: none;
    }
  }
}
</style>


