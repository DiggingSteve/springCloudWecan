<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
         @reset="reset"
      ></newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <el-button @click="credentialDeatil('','multiply')">{{ wageinout == '1' ? '开凭证' : '收凭证' }}</el-button>
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere"
    >
      <!-- <template slot="canDzFun" slot-scope="props"><i class="el-icon-delete" @click="cancelDz('single',props.data.index)" title="取消对账"></i></template>
       <template slot="dzInfo" slot-scope="props" style="display:block!important"><i class="el-icon-document" @click="addDeleteDz(props.data.index)" title="添加至对账单"></i></template>
       <template slot="changeState" slot-scope="props" style="display:block!important"><i class="el-icon-sort" @click="changeDzState(props.data.index)" :title="props.data.row.billstatus=='对账中'?'改为对账中':'改为已对账'"></i></template>
      -->
      <template slot="print" slot-scope="props" style="display:block!important">
        <i class="el-icon-printer" @click="printDz(props.data.index)" title="打印账单"></i>
      </template>

      <template slot="billno" slot-scope="props">
        <div>
          <span
            @click="credentialDeatil(props.data.index,'single')"
            :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']"
          >{{props.data.value}}</span>
        </div>
      </template>

      <!--    <template slot="isreceive" slot-scope="props">
   <span>{{props.data.row.isreceive=='1'?'已收到':'未收到'}}</span>
      </template>-->

      <!--   <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="billidArr"></template> -->
      <!--  <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="jobid"></template>
       <template slot="dzFun" slot-scope="props"><i class="el-icon-close" @click="backO('single',props.data.index)"></i></template>
      <template slot="emailFun" slot-scope="props"><i class="el-icon-check" @click="handleO('single',props.data.index)"></i></template>-->
    </tableCompt>

    <el-dialog
      title="可开凭证"
      width="100%"
      top="0"
      center
      :visible.sync="credenDetail"
      v-if="credenDetail"
      class="dialogPage"
      :modal="false"
    >
      <certificateMaking
        :billid="billid"
        :wageinout="wageinout"
        :billno="billno"
        @Unvisible="closeD"
        :system="system"
        :selectTableIndex="selectTableIndex"
        :area="area"
      ></certificateMaking>
    </el-dialog>

    <!-- 取消对账弹框 -->
    <el-dialog
      width="400px"
      top="4%"
      center
      :visible.sync="abanDz"
      v-if="abanDz"
      append-to-body
      @close="abanDz=false"
    >
      <div style="text-align:center">
        <p style="margin-bottom:18px;text-align:left;font-size:14px;">取消理由:</p>
        <el-input
          type="textarea"
          v-model="abanreason"
          class="input-required"
          v-if="abanDz"
          :autosize="{ minRows:6}"
        ></el-input>

        <p style="text-align:center;margin-top:18px;">
          <el-button @click="cancelDzF">确定</el-button>
          <el-button @click="abanDz=false">取消</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 添加删除账单 -->
    <el-dialog
      width="100%"
      top="0"
      center
      :visible.sync="addDelDz"
      :title="addDelTitle"
      v-if="addDelDz"
      class="dialogPage"
      :modal="false"
    >
      <addDelDzZj
        :addDel="addDelId"
        :billstatus="billstatus"
        :wageinout="wageinout"
        :accountcomname="accountcomname"
        :accountcomgid="accountcomgid"
        :system="system"
        :area="area"
      ></addDelDzZj>
    </el-dialog>

    <!-- 已对账弹框 -->
    <el-dialog
      width="600px"
      top="4%"
      center
      :visible.sync="reconOpen"
      v-if="reconOpen"
      append-to-body
    >
      <div style="width:430px;margin:0 auto" v-if="reconOpen">
        <p>
          <span style="min-width:120px;display:inline-block">客户对账人:</span>
          <el-input v-model="reconInfo.confirmman" style="width:300px;"></el-input>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">客户对账时间:</span>
          <el-date-picker
            v-model="reconInfo.confirmdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:300px;"
          ></el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">我司对账人:</span>
          <el-input v-model="reconInfo.czman" style="width:300px;"></el-input>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">我司对账时间:</span>
          <el-date-picker
            v-model="reconInfo.czdate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
            style="width:300px;"
          ></el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block;vertical-align:middle">对账备注:</span>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="reconInfo.confirmremark"
            style="width:300px;vertical-align:middle"
          ></el-input>
        </p>
        <p style="margin-top:20px;text-align:center">
          <el-button @click="reconOpen=false">取消</el-button>
          <el-button @click="reconFinish">确认</el-button>
        </p>
      </div>
    </el-dialog>

    <!-- 生成对账单 -->
    <el-dialog
      width="100%"
      top="0"
      center
      :visible.sync="dzdMakeS"
      v-if="dzdMakeS"
      class="dialogPage"
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <dzdMake
        :dzdMakeD="dzdMakeD"
        @Unvisible="dzdMakeS=false"
        :system="system"
        :pchno="pchno"
        :area="area"
      ></dzdMake>
    </el-dialog>
  </div>
</template>

<script>
import {
  searCondition,
  getChangeValue,
  getMomentDate
} from "../api/localStorage.js";
import certificateMaking from "./orderDetails/certificateMaking";
import addDelDzZj from "./orderDetails/addDelDzZj";
import dzdMake from "./orderDetails/dzdMake";
  import { searchCmptMixins } from '@/components/mixins/topPageMixin'

export default {
  name: "credentialMngFir",
  components: {
    certificateMaking,
    addDelDzZj,
    dzdMake
  },
  mixins: [ searchCmptMixins],
  props: {
    // system: {
    //   type: String,
    //   default: '空出'
    // },
    wageinout: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      name: "credentialMngFir.vue",
      showTotal: {
        all: true,
        ybjzt: false,
        sjjzt: false,
        zdjzt: false,
        wageprofit: false,
        realwageall: false,
        billwageall: true,
        wageall: false,
        finishwageall: false,
        finishwageall_checkbill: false
      },
      tableDataRes: [],
      billid: "", //对账ID
      billno: "", //对账批次号
      credenDetail: false,
      inputViewData: {
        billno: { title: "对账批次号", type: 1, whereStr: "like" },
        wageinout: {
          title: "收付类型",
          type: 4,
          options: [
            { label: "应收", value: "1" },
            { label: "应付", value: "2" }
          ],
          hidden: true
        },
        accountcomgid: { title: "结算对象", type: 20, pagetype: 1 },
        confirmman: {
          title: this.wageinout == "1" ? "客户确认人" : "供应商确认人",
          type: 1,
          whereStr: "like",
          titleStyle: { minWidth: "110px" }
        },
        confirmdate: {
          title: this.wageinout == "1" ? "客户确认日期" : "供应商确认日期",
          type: 15,
          titleStyle: { minWidth: "110px" }
        },
        confirmremark: { title: "对账备注", type: 1, whereStr: "like" },
        hbrq: { title: "航班日期", type: 15, defaultVal: false}

      },
      inputModelData: {
        wageinout: this.wageinout,
        billstatus: "1000"
      },
      searchData: {},
      pageshow: true,
      selectTableIndex: "",
      chineseWhere: [],

      abanDz: false,
      abanreason: "",
      cancelDzData: {}, //取消对账数据

      addDelTitle: "", //添加删除对账弹框标题
      addDelId: "", //添加删除对账单id
      billstatus: "", //对账状态
      accountcomname: "", //添加删除弹框对账公司名
      accountcomgid: "", //添加删除弹框对账公司名ID
      addDelDz: false, //添加删除对账弹框显示隐藏

      reconOpen: false, //已对账弹框
      reconInfo: {
        confirmman: "",
        confirmdate: "",
        czman: localStorage.getItem("usrname"),
        czdate: getMomentDate(),
        confirmremark: ""
      }, //已对账数据

      pchno: "", //打印显示对账批次号
      dzdMakeS: false, //打印对话框显示隐藏
      dzdMakeD: {}, //对账打印数据传
      area: "",
      system: ""
    };
  },
  methods: {
    search() {
      // var jsonArr=searCondition(this.inputViewData)
      this.tableDataRes = [];
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate asc"
        //skip:"0"
      };
      var json = { json: JSON.stringify(jsonArr2) };
      json.area = this.$store.state.areaState;
      //   if(json.area.split(',').length>1){
      //   this.$message.error('只能勾选一个区域');
      //   return false
      // }
      json.system = "";
      //json.system=this.system

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpPzUnFinishCollect",
        params: json,
        loading: true,
        tip: true,
        noarea: 1,
        nofield: 1
      })
        .then(results => {
          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(
            results.data,
            "空出",
            "credentialMngfir"
          );
          // 处理日期和件重体
          //    setTimeout(()=>{

          //    results.data.forEach((item,index)=>{

          //  if(item.hbrq){
          //    item.hbrq=dateFormat(item.hbrq,"yyyy-mm-dd")

          //  }

          //  item.ybjzt=item.ybpiece+"/"+pointChange(item.ybweight,2)+"/"+pointChange(item.ybvolume,3)
          //  item.areadom=this.$store.state.areaState+item.dom

          // })
          //    },10)
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 20);
        })
        .catch(errors => {});
    },
    // 凭证详细
    credentialDeatil(index, type) {
      //this.selectTableIndex=index

      if (type == "single") {
        this.billid = this.tableDataRes[index].billid;
        this.billno = this.tableDataRes[index].billno;
        this.area = this.tableDataRes[index].area;
        this.system = "";
        //this.system=this.tableDataRes[index].system
      } else if (type == "multiply") {
        if (this.billidArr.length > 0) {
          var templatejobid = [];
          var accountcomnameArray = [];
          var system = [];
          var area = [];
          this.billidArr.forEach(item => {
            templatejobid.push(this.tableDataRes[item].billid);
            accountcomnameArray.push(this.tableDataRes[item].accountcomname);
            if (!system.includes(this.tableDataRes[item].system)) {
              system.push(this.tableDataRes[item].system);
            }
            area.push(this.tableDataRes[item].area);
          });
          var repeataccountcomname = 0;
          accountcomnameArray.forEach((item, index) => {
            if (index != accountcomnameArray.length - 1) {
              if (accountcomnameArray[0] != accountcomnameArray[index + 1]) {
                repeataccountcomname += 1;
              }
            }
          });
          var repeatarea = 0;
          area.forEach((item, index) => {
            if (index != area.length - 1) {
              if (area[0] != area[index + 1]) {
                repeatarea += 1;
              }
            }
          });

          if (repeataccountcomname > 0) {
            this.$message.error("结算对象不同无法开票或开账单");
            return false;
          }
          if (repeatarea > 0) {
            this.$message.error("区域不同无法开票或开账单");
            return false;
          }

          this.billid = templatejobid.join(",");
          this.area = this.tableDataRes[this.billidArr[0]].area;
          this.system = "";
          //this.system=system.join(',')
        } else {
          this.$message.error("请选择对账单号");
          return false;
        }
      }
      this.credenDetail = true;
    },
    // reset() {
    //   this.inputModelData = { wageinout: this.wageinout };
    // },

    reconciliation() {},

    send_email() {},

    closeD(data) {
      /*
    待定做判断
    ****/
      // if(data.noclose==2){
      //   this.tableDataRes.splice(this.selectTableIndex,1)
      // }
      //alert(data.deleteIndex)
      if (data.deleteIndex == 1) {
        this.tableDataRes.splice(this.selectTableIndex, 1);
      }
      this.credenDetail = false;
      //this.search()
    },
    // 取消对账
    cancelDz(type, val) {
      var status = 1;

      var billid = "";
      if (type == "single") {
        billid = this.tableDataRes[val].billid;
        console.log(this.tableDataRes[val].pzfinishwageall);
        if (this.tableDataRes[val].pzfinishwageall != "--") {
          this.$message.error("已开凭证无法删除");
          return false;
        }
      } else if (type == "multiply") {
        var templatebillid = [];
        var pzfinishwageall = [];

        if (this.jobidArr.length == 0) {
          this.$message.error("请选择对账批次号");
          status = 0;
        }
        this.jobidArr.forEach(item => {
          templatebillid.push(this.tableDataRes[item].billid);
          pzfinishwageall.push(this.tableDataRes[item].pzfinishwageall);
        });
        pzfinishwageall.forEach(item => {
          if (item != "--") {
            this.$message.error("已开凭证无法删除");
            status = 0;
          }
        });
        billid = templatebillid.join(",");
      }
      this.cancelDzData = {
        area: this.tableDataRes[val].area,
        billid: billid,
        accountcomname: this.tableDataRes[val].accountcomname
      };

      if (status != 0) {
        this.abanDz = true;
      }
    },

    // 取消对账方法
    cancelDzF() {
      if (this.abanreason == "") {
        this.$message.error("请填写取消对账理由");
        return false;
      } else {
        this.cancelDzData.delbillreason = this.abanreason;
      }
      this.$axios({
        method: "DELETE",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
        data: this.cancelDzData
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.abanDz = false;
            this.cancelDzData = {};
            this.search();
          }
        })
        .catch(error => {});
    },

    // 添加删除对账
    addDeleteDz(val) {
      this.addDelDz = true;
      this.addDelId = this.tableDataRes[val].billid;
      this.billstatus =
        this.tableDataRes[val].billstatus == "对账中" ? "900" : "1000";
      this.addDelTitle = this.tableDataRes[val].billno;
      this.accountcomname = this.tableDataRes[val].accountcomname;
      this.accountcomgid = this.tableDataRes[val].accountcomgid;
      this.area = this.tableDataRes[val].area;
      // //console.log(this.addDelTitle)
    },

    // 改变对账状态
    changeDzState(val) {
      var billstatus = "";
      this.selectTableIndex = val;
      var data = {};
      console.log(this.tableDataRes[val].billstatus);
      if (this.tableDataRes[val].billstatus == "对账中") {
        billstatus = 1000;
        this.reconOpen = true;
        this.reconInfo.confirmman = this.tableDataRes[val].confirmman;
        this.reconInfo.confirmdate = this.tableDataRes[val].confirmdate.replace(
          /-/g,
          "/"
        );
      } else if (this.tableDataRes[val].billstatus == "已对账") {
        billstatus = 900;
        data = {
          area: this.tableDataRes[val].area,
          system: this.tableDataRes[val].system,
          id: this.tableDataRes[val].billid,
          billstatus: billstatus,
          wageinout: this.tableDataRes[val].wageinout
        };
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
          data: data
        })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.tableDataRes[val].billstatus =
                billstatus == "1000" ? "已对账" : "对账中";
            } else {
              this.$message.error(results.data.resultmessage);
            }
          })
          .catch(error => {});
      }
    },

    // 设置已对账
    reconFinish() {
      var data = {
        area: this.tableDataRes[this.selectTableIndex].area,
        system: this.tableDataRes[this.selectTableIndex].system,
        id: this.tableDataRes[this.selectTableIndex].billid,
        billstatus: 1000,
        wageinout: this.tableDataRes[this.selectTableIndex].wageinout,
        confirmman: this.reconInfo.confirmman,
        confirmdate: this.reconInfo.confirmdate,
        confirmremark: this.reconInfo.confirmremark
      };
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.tableDataRes[this.selectTableIndex].billstatus = "已对账";
            this.reconOpen = false;
            this.reconInfo.confirmman = "";
            this.reconInfo.confirmdate = "";
            this.reconInfo.confirmremark = "";
            this.selectTableIndex = "";
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(error => {});
    },

    // 打印
    printDz(val) {
      //alert('1')
      this.pchno = this.tableDataRes[val].billno;
      //console.log(this.pchno)
      var data = {
        area: this.tableDataRes[val].area,
        system: this.tableDataRes[val].system || "",
        billid: this.tableDataRes[val].billid
      };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchFinishDetail",
        params: data
      })
        .then(results => {
          //console.log(results.data)
          var jobnolist = [];
          results.data.forEach((item, index) => {
            item.jobnolist.forEach((item2, index2) => {
              item2.dwageall = item2.thisfinishwageall_checkbill;
              item2.realjzt =
                item2.realpiece +
                "/" +
                Number(item2.realweight).toFixed(2) +
                "/" +
                Number(item2.realvolume).toFixed(2);
              item2.hbrq = item2.hbrq.substring(0, 10);
              jobnolist.push({ jobListData: item2, wagelist: [] });
              item2.wagelist.forEach(item3 => {
                item3.dwageall = item3.thisfinishwageall_checkbill;
                item3.realjzt = item2.realjzt;
                item3.hbrq = item3.hbrq.substring(0, 10);
                item3.hbh = item2.hbh;
                jobnolist[index2].wagelist.push(item3);
              });
            });
          });
          //console.log(jobnolist)
          var printData = {
            billid: this.tableDataRes[val].billid,
            area: this.tableDataRes[val].area,
            isdel: "1",
            accountcomname: results.data[0].accountcomname,
            wageinout: this.tableDataRes[val].wageinout,
            jobnolist: jobnolist,
            billstatus: 1000,
            system: this.tableDataRes[val].system,
            confirmman: this.tableDataRes[val].confirmman,
            confirmdate: this.tableDataRes[val].confirmdate,
            confirmremark: this.tableDataRes[val].confirmremark,
            noPrint: 1,
            ourconfirmman: this.tableDataRes[val].ourconfirmman,
            ourconfirmdate: this.tableDataRes[val].ourconfirmdate
          };
          this.dzdMakeS = true;
          this.dzdMakeD = printData;
          console.log(this.dzdMakeD)
          this.area = this.tableDataRes[val].area;
        })
        .catch(error => {});
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    billidArr() {
      var arr = [];
      this.tableDataRes.forEach((i, index) => {
        if (i.checked) {
          arr.push(index);
        }
      });
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
