<template>
  <div class="addDelDz" style="width:1200px;margin:0 auto">
    <!--    	<el-button  style="margin-bottom:12px;" @click="addOrder=!addOrder" type="primary">添加订单</el-button> -->
    <!-- 添加订单 -->
    <div class="detail" v-if="addOrder">
      <div class="detail-c">
        <el-row>
          <el-col :span="24">
            <span>
              结算对象:
            </span>
            {{ addBasicInfo.accountcomname }}
          </el-col>

          <!--       <el-col :span="12" v-if="wageinout&&wageinout != '2'">
        <span>
        项目:
      </span>
      <el-select v-model="addBasicInfo.accountname" filterable style="width:280px;">
        <el-option v-for="item in accountnameList" :label="item.name" :key="item.id" :value="item.id"></el-option>
        </el-select>
      </el-col> -->
        </el-row>

        <el-row style="margin-top:4px;">
          <el-col :span="12">
            <span>
              总运单号:
            </span>
            <!-- <el-input v-model="addBasicInfo.mawb" style="width:180px;"></el-input> -->
            <!-- <el-select v-model="addBasicInfo.mawb" filterable>
        <el-option v-for="item in mawbList" :label="item" :key="item" :value="item"></el-option>
        </el-select> -->
            <el-input
              v-model="addBasicInfo.mawb"
              style="width:280px;"
            ></el-input>
          </el-col>

          <el-col :span="12">
            <span>
              订舱编号:
            </span>
            <el-input
              v-model="addBasicInfo.pono"
              style="width:280px;"
            ></el-input>
            <!--  <el-select v-model="addBasicInfo.ordernoValue" filterable @change="changeOrder(addBasicInfo.ordernoValue)">
        <el-option v-for="item in orderno" :label="item" :key="item" :value="item"></el-option>
        </el-select> -->
          </el-col>
        </el-row>
        <el-row style="margin-top:4px;">
          <el-col :span="12">
            <span>
              航班号:
            </span>
            <el-input
              v-model="addBasicInfo.hbh"
              style="width:280px;"
            ></el-input>
          </el-col>

          <el-col :span="12">
            <span>
              航班日期:
            </span>

            <div
              style="-webkit-box-flex:1;flex-grow:1;width:260px;display:inline-block"
              class="hbrqClass"
            >
              <div
                style="display:flex;border:1px solid #dcdfe6;border-radius:4px;width:280px;"
              >
                <el-date-picker
                  v-model="addBasicInfo.hbrq.begin"
                  type="date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd"
                  placeholder="开始日期"
                  class="rangeDate"
                  clearable
                  style="width:140px;"
                >
                </el-date-picker>
                <div
                  style="color:#666;padding-top:5px;width:auto;min-width:auto"
                >
                  至
                </div>
                <el-date-picker
                  v-model="addBasicInfo.hbrq.end"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                  class="rangeDate"
                  clearable
                  style="width:140px;;"
                >
                </el-date-picker>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top:4px;">
          <el-col :span="12">
            <span>
              服务项目:
            </span>
            <page-select
              :modelval.sync="addBasicInfo.items"
              :pagetype="5"
              style="width:280px;display:inline-block"
            ></page-select>
          </el-col>
        </el-row>
        <!-- {{allJobList}} -->
        <p style="text-align:right;padding-right:20px;">
          <el-button style="margin-bottom:15px;" @click="search" type="primary"
            >查询</el-button
          >
        </p>
        <commonTable
          :head="costListHead"
          :table-data="allJobList"
          :checkValue="{
            source: 'costValue',
            checkvalue: costValue,
            length: allJobList.length
          }"
          @checkboxall="allCheck"
        >
          <template slot="checkbox" slot-scope="props"
            ><input
              type="checkbox"
              :value="props.data.index"
              v-model="costValue"
              @change="costHandle(props.data.index)"
          /></template>
          <!--  <template slot="dwageall" slot-scope="props"><el-input type="text"  v-model="props.data.row.dwageall" @blur="getdwageall(props.data.row.dwageall,props.data.index)" :disabled="wageinout=='1'?true:false"></el-input></template> -->
        </commonTable>
      </div>
      <p style="text-align:right;padding-right:20px;margin-bottom:20px;">
        <el-button @click="addToDz" v-if="billstatus == '900'" type="primary"
          >添加至对账单</el-button
        >
      </p>
    </div>

    <!-- 删除对账 -->
    <div class="table-box">
      <el-row class="title">
        <el-col :span="2">操作</el-col>
        <el-col :span="6">订舱编号</el-col>
        <el-col :span="2">航班号</el-col>
        <el-col :span="2">航班日期</el-col>
        <el-col :span="2">始发港</el-col>
        <el-col :span="2">目的港</el-col>
        <el-col :span="4">总运单号</el-col>
        <el-col :span="2">对账总额</el-col>
        <el-col :span="2">凭证完成总额</el-col>
      </el-row>

      <div class="table-row" v-for="(item, index) in jobListData" :key="index">
        <el-row>
          <el-col :span="2">
            <i
              class="el-icon-delete"
              @click="deldz(index, '1')"
              style="margin-right:50px;padding-left:18px;"
            ></i>
            <i
              class="el-icon-circle-plus-outline"
              @click="showSubTab(index)"
              style="margin-left:8px;"
            ></i>
          </el-col>

          <el-col :span="6">
            {{ item.pono }}
          </el-col>

          <el-col :span="2">
            {{ item.hbh }}
          </el-col>
          <el-col :span="2">
            {{ item.hbrq.substring(0, 11) }}
          </el-col>
          <el-col :span="2">
            {{ item.sfg }}
          </el-col>
          <el-col :span="2">
            {{ item.mdg }}
          </el-col>

          <el-col :span="4">
            {{ item.mawb }}
          </el-col>

          <el-col :span="2">
            {{ item.thisfinishwageall_checkbill }}
          </el-col>

          <el-col :span="2">
            {{ item.thisfinishwageall_pz }}
          </el-col>
        </el-row>

        <div v-if="zTable == index" class="sub-table" style="margin-left:-1px;">
          <el-row class="title">
            <!--  <el-col :span="2" :offset="2" style="border-top:none"></el-col> -->
            <el-col :span="2"></el-col>
            <el-col :span="10" style="border-top:none">费用类型</el-col>
            <el-col :span="7" style="border-top:none">对账金额</el-col>
            <el-col :span="5" style="border-top:none">凭证完成总额</el-col>
          </el-row>

          <el-row v-for="(item2, index2) in item.wagelist" :key="index2">
            <!-- <el-col :span="2" :offset="2" style="border:none">
                   <i class="el-icon-delete" @click="deldz(item2.billwageid,'2',index2)"></i>
           </el-col> -->
            <!-- 删除 -->
            <el-col :span="2"
              ><i class="el-icon-delete" @click="deleteEditCost(item2)"></i
            ></el-col>
            <el-col :span="10">{{ item2.items }}</el-col>
            <el-col :span="7">{{ item2.thisfinishwageall_checkbill }}</el-col>
            <el-col :span="5">{{ item2.thisfinishwageall_pz }}</el-col>
          </el-row>
          <!--    <div class="el-row bottom" v-for="(item2,index2) in item.wagelist" style="background:#f8f8f8;">

     <el-col :span="2" :offset="3">

     </el-col>

      <div class="el-col el-col-9" style="height:24px;">{{item2.items}}</div>
      <div class="el-col el-col-7" style="height:24px;">{{item2.finishwageall_checkbil}}</div>
      <div class="el-col el-col-3" style="height:24px;">{{item2.leastwageall_checkbill}}</div>
    </div> -->
        </div>
      </div>
    </div>

    <!-- 取消对账弹框 -->
    <el-dialog
      width="800px"
      top="4%"
      custom-class="reason"
      :visible.sync="abanDz"
      v-if="abanDz"
      append-to-body
      @close="closeAbanDz"
      class="cancelDzReason"
    >
      <div>
        <!--  <p style="margin-bottom:18px;text-align:left;font-size:14px;">取消理由:</p>
<el-input type="textarea" v-model="abanreason" class="input-required" v-if="abanDz" :autosize="{ minRows:6}"></el-input> -->

        <div class="orderSystem-c">
          <h3>取消原因</h3>
          <p class="orderNo">
            <span style="color:#004d84;float:left;font-weight:bold">{{
              jobListData[cancelCostIndex].pono
            }}</span>
            <span style="color:#333;float:right">{{
              jobListData[cancelCostIndex].accountname
            }}</span>
          </p>
          <ul>
            <li>总运单号</li>
            <li>始发港</li>
            <li>目的港</li>
            <li>实际件重体</li>
            <li>航班号</li>
            <li>航班日期</li>
          </ul>
          <ul style="margin-top:3px;">
            <li>{{ jobListData[cancelCostIndex].mawb }}</li>
            <li>{{ jobListData[cancelCostIndex].sfg }}</li>
            <li>{{ jobListData[cancelCostIndex].mdg }}</li>
            <li>{{ jobListData[cancelCostIndex].realjzt }}</li>
            <li>{{ jobListData[cancelCostIndex].hbh }}</li>
            <li>{{ jobListData[cancelCostIndex].hbrq.substring(0, 10) }}</li>
          </ul>

          <el-input
            type="textarea"
            v-model="abandonReason"
            class="input-required"
            :autosize="{ minRows: 4 }"
            style="margin-top:12px;color:#c8c8c8"
            placeholder="工作号取消原因输入框"
          ></el-input>

          <div class="costItems">
            <div style="width:720px;overflow:hidden;display:inline-block">
              <ul class="costItemsList" style="width:10000px;overflow:hidden;">
                <li
                  v-for="(item, index) in jobListData[cancelCostIndex].wagelist"
                  :key="index"
                  :style="{ color: costItemsActive == index ? '#004d84' : '' }"
                  @click="costItemsActive = index"
                >
                  <el-badge is-dot class="item" v-if="item.abandonReason">{{
                    item.items
                  }}</el-badge>
                  <span v-else>{{ item.items }}</span>
                </li>
              </ul>
            </div>

            <div style="display:inline-block">
              <i class="el-icon-caret-left" @click="changeDirection(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
            </div>
          </div>

          <div class="costItemsContent" style="margin-top:16px;">
            <ul>
              <li>对账金额</li>
              <li>单价</li>
              <li>数量</li>
              <li>货币</li>
            </ul>
            <ul style="margin-top:3px;">
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive]
                    .thisfinishwageall_checkbill
                }}
              </li>
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive].price
                }}
              </li>
              <li>
                {{ jobListData[cancelCostIndex].wagelist[costItemsActive].num }}
              </li>
              <li>
                {{
                  jobListData[cancelCostIndex].wagelist[costItemsActive]
                    .currency
                }}
              </li>
            </ul>

            <el-input
              type="textarea"
              v-model="
                jobListData[cancelCostIndex].wagelist[costItemsActive]
                  .abandonReason
              "
              class="input-required"
              :autosize="{ minRows: 4 }"
              style="margin-top:8px;color:#c8c8c8"
              :placeholder="
                jobListData[cancelCostIndex].wagelist[costItemsActive].items +
                  '取消原因输入框'
              "
            ></el-input>
          </div>
        </div>

        <p style="margin-top:18px;text-align:right">
          <el-button @click="cancelDzF(wageIdS)" type="primary">确定</el-button>
          <el-button @click="closeAbanDz">取消</el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMomentDate, dateFormat } from "../../api/localStorage.js";

export default {
  components: {},
  props: {
    addDel: {
      type: [String, Number]
    },
    system: {
      type: String
    },
    billstatus: "",
    wageinout: "",
    accountcomname: "",
    accountcomgid: "",
    area: "",
    addman: ""
  },
  data() {
    return {
      sjcAllData: [],
      jobListData: [],
      backUpCost: [],
      addOrder: true,
      zTable: -1,
      parentTableHead: [
        { field: "checkbox", title: "" },
        { field: "orderno", title: "订舱编号" },
        { field: "mawb", title: "总运单号" },
        { field: "thisfinishwageall_checkbill", title: "对账总额" },
        { field: "thisfinishwageall_pz", title: "凭证完成总额" }
      ],
      costListHead: [
        //对账新增费用表格
        // {field: 'checkbox', title: ''},
        // {field: "items", title: "服务项目"},
        // {field: "dwageall", title: "当前对账金额"},
        // {field: "realwageall", title: "人民币金额"},
        // {field: "leastwageall_checkbill", title: "剩余金额"},
        // {field: "price", title: "单价"},
        // {field: "num", title: "数量"},
        // {field: "currency", title: "币种"},
        // {field: "otherwageall", title: "外币总额"}
        { field: "checkbox", title: "" },
        // {field: 'operate', title: ''},
        // {field: "leastwageall_checkbill", title: "剩余对账金额(折合人民币)"},
        { field: "leastwageall_checkbill", title: "剩余对账金额" },
        { field: "pono", title: "订舱编号" },
        { field: "orderno", title: "订单来源号" },
        { field: "mawb", title: "总运单号" },
        { field: "hawb", title: "分运单号" },
        { field: "sfg", title: "始发港" },
        { field: "mdg", title: "目的港" },
        { field: "realjzt", title: "实际件重体" },
        { field: "hbh", title: "航班号" },
        { field: "hbrq", title: "航班日期" }
      ],
      costValue: [], //选择费用

      costListData: [], //费用数据
      //orderno:[],//订舱编号
      accountnameList: [], //项目
      //mawbList:[],//总运单号
      addBasicInfo: {
        accountcomname: "",
        accountcomgid: "", //委托客户id
        accountname: "",
        mawb: "",
        pono: "",
        hbh: "",
        hbrq: { begin: "", end: "" },
        items: "",
        settjobid: "" //订单号下的工作号id
      },
      allJobList: [],
      abanDz: false, //取消对账弹框
      abandonReason: "", //取消对账原因
      wageIdS: "", //取消对账费用id
      tableType: "", //取消对账table类型
      cancelCostIndex: "", //取消费用index
      costItemsActive: 0,
      arrowIndex: 0,
      searchData:[]
    };
  },
  created() {
    this.singleDz();
  },
  computed: {
    // mawbList(){
    //   var data=[]
    //   this.sjcAllData.forEach(item=>{
    //     if(item.accountname==this.addBasicInfo.accountname){
    //       //data.push()
    //       this.accountcomgid=item.accountcomgid
    //       item.jobnolist.forEach(item2=>{
    //         data.push(item2.mawb)
    //       })
    //     }
    //   })
    //   return data
    // },
  },

  methods: {
    deleteEditCost(row) {
      const { billwageid } = row;
      this.$confirm("是否继续操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          area: this.area,
          system: this.system,
          billwageidArr: billwageid,
          delbillreason: "",
          delbillreasonJson: [],
          accountcomname: this.accountcomname,
          reasontype: ""
        };
        this.$axios({
          method: "delete",
          url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
          data: data
        })
          .then(results => {
            if (results.data.resultstatus != 0) {
              this.$message.error(results.data.resultmessage);
            } else {
              this.$message.success(results.data.resultmessage);
              this.singleDz();
            }
          })
          .catch(error => {});
      });
      //  this.$confirm("是否继续操作?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }).then(()=> {
      //                 this.$axios({
      //         method: "delete",
      //         url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
      //         data: {
      //           area: this.area,
      //           system: this.system,
      //           billwageidArr: wageId,
      //           delbillreason: "",
      //           reasontype: "应收对账驳回",
      //           delbillreasonJson: [],
      //           boguid: this.jobListData[this.cancelCostIndex].boguid,
      //           accountcomname: this.jobListData[
      //             this.cancelCostIndex
      //           ].accountname.split("-")[1]
      //         }
      //       })
      //         .then(results => {
      //           console.log(results)
      //         })
      //         .catch(error => {});
      //   })
    },
    showSubTab(index) {
      if (this.zTable == index) {
        this.zTable = -1;
      } else {
        this.zTable = index;
      }
    },
    closeAbanDz() {
      this.abanDz = false;
      //jobListData[cancelCostIndex]
      this.abandonReason = "";
      this.jobListData.forEach(item => {
        //this.$set(item,'abandonReason','')
        item.wagelist.forEach(item2 => {
          this.$set(item2, "abandonReason", "");
        });
      });
      // this.jobListData[this.cancelCostIndex].wagelist.forEach(item=>{
      //   this.$set(item,'abandonReason','')
      // })
    },
    changeDirection(type) {
      var clientWidth = 0;
      if (type == 1) {
        this.arrowIndex--;
        if (this.arrowIndex < 0) {
          layer.msg("已至头部");
          this.arrowIndex = 0;
          return false;
        }
      } else if (type == 2) {
        $(".costItemsList")
          .find("li")
          .each(function() {
            //console.log(clientWidth)
            //console.log($(this).innerWidth())
            clientWidth = clientWidth + $(this).innerWidth();
          });
        //console.log(clientWidth)
        if (clientWidth < 720) {
          this.arrowIndex = 0;
          return false;
        } else {
          this.arrowIndex++;
        }
        //console.log(clientWidth-720)
        //console.log(Math.ceil((clientWidth-720)/200))
        if (this.arrowIndex > Math.ceil((clientWidth - 720) / 200)) {
          layer.msg("已至尾部");
          this.arrowIndex = Math.ceil((clientWidth - 720) / 200);
          return false;
        }
      }
      //console.log(this.arrowIndex)
      $(".costItemsList").css(
        "transform",
        "translateX(-" + this.arrowIndex * 200 + "px)"
      );
    },

    singleDz() {
      ////console.log(this.)
      ////console.log(this.accountcomname,)
      this.costValue = [];
      var data = { area: this.area, system: this.system, billid: this.addDel };
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchFinishDetail",
        params: data
      })
        .then(results => {
          //console.log(results.data[0])

          this.sjcAllData = results.data;
          var resultsData = [];

          this.sjcAllData.forEach((item, index) => {
            var concatData = item.jobnolist;
            concatData.forEach(item2 => {
              item2.accountcomname = item.accountcomname;
              this.$set(item2, "abandonReason", "");

              //item2.abandonReason=""
              item2.accountname = item.accountname;
              item2.leastwageall_checkbill = Number(
                item2.leastwageall_checkbill
              ).toFixed(2);
              item2.thisfinishwageall_checkbill = Number(
                item2.thisfinishwageall_checkbill
              ).toFixed(2);
              item2.wagelist.forEach(item3 => {
                this.$set(item3, "abandonReason", "");
                item3.leastwageall_checkbill = Number(
                  item3.leastwageall_checkbill
                ).toFixed(2);
                item3.thisfinishwageall_checkbill = Number(
                  item3.thisfinishwageall_checkbill
                ).toFixed(2);
                item3.num = Number(item3.num).toFixed(2);
                item3.price = Number(item3.price).toFixed(2);
              });
            });

            resultsData = resultsData.concat(concatData);
          });

          this.jobListData = resultsData;
          //console.log(this.jobListData)
          // 相同费用类型和对账金额传入数组
          //var itemsLeast=[]
          // this.jobListData.forEach(item=>{
          //   if(this.accountnameList.indexOf(item.accountname)==-1){
          //      this.accountnameList.push(item.accountname)
          //   }

          // })
          ////console.log(itemsLeast)
          //this.addBasicInfo.accountcomname=this.jobListData[0].accountcomname
          var wtxmJson = getxmdata("xmdata");
          this.accountnameList = [];
          wtxmJson.forEach(item => {
            if (item.fid == results.data[0].accountgid && item.usr_name != "") {
              this.accountnameList.push({ name: item.usr_name, id: item.id });
            }
          });
        })
        .catch(error => {
          ////console.log(error)
        });
    },
    //删除对账
    deldz(id, type, index) {
      if (this.addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }
      //console.log(this.jobListData)
      //console.log(this.allJobList)
      if (type == "1") {
        //父
        console.log(type);
        this.$confirm("是否继续操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //this.$message.success('111')
            var wageId = "";
            this.jobListData[id].wagelist.forEach(item => {
              wageId += item.billwageid + ",";
              this.cancelCostIndex = id;
            });
            wageId = wageId.substring(0, wageId.length - 1);

            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
              data: {
                area: this.area,
                system: this.system,
                billwageidArr: wageId,
                delbillreason: "",
                reasontype: "应收对账驳回",
                delbillreasonJson: [],
                boguid: this.jobListData[this.cancelCostIndex].boguid,
                accountcomname: this.jobListData[
                  this.cancelCostIndex
                ].accountname.split("-")[1]
              }
            })
              .then(results => {
                if (results.data.resultstatus != 0) {
                  this.$message.error(results.data.resultmessage);
                } else {
                  this.$message.success(results.data.resultmessage);
                  if (type == "1") {
                    this.jobListData.splice(this.cancelCostIndex, 1);
                    this.$emit("reSearch");
                  } else {
                  }
                  this.abanDz = false;
                  this.abandonReason = "";
                }
              })
              .catch(error => {});
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else if (type == "2") {
        //子
        wageId = id;
        this.cancelCostIndex = index;
      }
      //this.tableType=type
      //this.wageIdS=wageId
      //this.abanDz=true
      // this.$confirm('是否删除?','提示',{
      //         confirmButtonText: '确定',
      //           cancelButtonText: '取消',
      //           type: 'warning'
      //       })
      //       .then(()=>{
      // this.$axios({"method":'delete',url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchWage',data:{area:this.$store.state.areaState,system:this.system,billwageidArr:wageId}})
      // .then(results=>{
      //    if(results.data.resultstatus!=0){
      //     this.$message.error(results.data.resultmessage)
      //    }else{
      //       this.$message.success(results.data.resultmessage)
      //       //alert('1')
      //       this.singleDz()
      //       this.search()
      //       this.$emit('reSearch',1)
      //    }
      // })
      // .catch(error=>{

      // })
      //       })
      //     .catch(()=>{
      //       this.$message({
      //           type:'info',
      //           message:'已取消删除'
      //         })
      //     })
    },

    cancelDzF(wageIDS) {
      var abandonReasonLength = 0;
      var delbillreasonJson = [];
      this.jobListData[this.cancelCostIndex].wagelist.forEach(item => {
        abandonReasonLength += item.abandonReason.length;
        delbillreasonJson.push({
          billwageid: item.billwageid,
          delbillreason: item.abandonReason,
          wageguid: item.wageguid
        });
      });
      if (!this.abandonReason && abandonReasonLength == 0) {
        this.$message.error("请填写取消对账原因");
        return false;
      }
      // var data={area:this.$store.state.areaState,system:this.system,billwageidArr:wageIDS,delbillreason:this.abandonReason,delbillreasonJson:delbillreasonJson,boguid:this.jobListData[this.cancelCostIndex].boguid,accountcomname:this.jobListData[this.cancelCostIndex].accountname.split('-')[1]}
      // console.log(data)

      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPchWage",
        data: {
          area: this.area,
          system: this.system,
          billwageidArr: wageIDS,
          delbillreason: this.abandonReason,
          reasontype: "应收对账驳回",
          delbillreasonJson: delbillreasonJson,
          boguid: this.jobListData[this.cancelCostIndex].boguid,
          accountcomname: this.jobListData[
            this.cancelCostIndex
          ].accountname.split("-")[1]
        }
      })
        .then(results => {
          if (results.data.resultstatus != 0) {
            this.$message.error(results.data.resultmessage);
          } else {
            this.$message.success(results.data.resultmessage);
            if (this.tableType == "1") {
              this.jobListData.splice(this.cancelCostIndex, 1);
              this.$emit("reSearch");
            } else {
              this.jobListData[this.zTable].wagelist.splice(
                this.cancelCostIndex,
                1
              );
            }
            this.abanDz = false;
            this.abandonReason = "";
            // this.jobListData[this.cancelCostIndex].wagelist.forEach(item=>{
            //   this.$set(item,'abandonReason','')
            // })
          }
        })
        .catch(error => {});
    },
    //添加至对账
    //zx
    addToDz() {
      if (this.addman != localStorage.getItem("usrname")) {
        this.$message.error("非本人无法操作");
        return false;
      }
      var jobnolist = [];
      var jobnolistData = [];
      //console.log(this.allJobList)
      //return;
      this.costValue.forEach(item => {
        console.log(item)
        jobnolist.push({
            // settjobid: this.costListData[item].settjobid,
            // wagelist: [this.costListData[item]]
           settjobid: this.allJobList[item].settjobid,
          wagelist:this.allJobList[item]['wagelist']
        
        });
      });

        console.log(jobnolist)
      

      
      var settjobidArr = [];
      jobnolist.forEach(item => {
        console.log(settjobidArr.indexOf(item.settjobid))
        if (settjobidArr.indexOf(item.settjobid) == -1) {
          settjobidArr.push(item.settjobid);
        }
      });

      settjobidArr.forEach((item, index) => {
        jobnolistData.push({ settjobid: "", wagelist: [] });
        jobnolist.forEach(item2 => {
          if (item == item2.settjobid) {
            jobnolistData[index].settjobid = item2.settjobid;
            jobnolistData[index].wagelist=item2.wagelist;
            //jobnolistData[index].wagelist.push(item2.wagelist[0]);
            //wagelistData=wagelistData.concat(item2.wagelist)
            //jobnolistData.push({settjobid:item2.settjobid,wagelist:wagelistData})
          }
        });
      });
      console.log(jobnolistData)
      console.log("----------------")
      console.log("costListData:" + this.costListData)
      console.log("costValue:" + this.costValue)
      console.log("costListData: "+ this.costListData)
      console.log(jobnolist)
      console.log(settjobidArr)
      console.log(jobnolistData)
      console.log("----------------")
      //return;
      var data = {
        billid: this.addDel,
        area: this.area,
        isdel: "1",
        settgid: this.addBasicInfo.accountcomgid,
        accountcomname: this.addBasicInfo.accountcomname,
        jobnolist: jobnolistData,
        system: this.system,
        billstatus: this.billstatus,
        wageinout: this.wageinout
      };
      if (data.jobnolist.length == 0) {
        this.$message.error("请新增对账信息");
        return false;
      }

      this.$axios({
        method: "POST",
        url: this.$store.state.webApi + "api/ExAiraxpCheckBillPch",
        data: data
      })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);

            this.costValue = [];
            this.singleDz();
            this.search("1");
            //this.$emit('reSearch',1)
          } else {
            this.$message.error(results.data.resultmessage);
          }
        })
        .catch(errors => {});
    },
    // 改变当前对账值
    getdwageall(val, index) {
      //debugger

      ////console.log(this.backUpCost)
      if (val && Number(val) != 0 && this.costValue.indexOf(index) == -1) {
        this.costValue.push(index);
      }

      if (Number(val) > this.backUpCost[index].leastwageall_checkbill) {
        this.costListData[index].dwageall = Number(
          this.backUpCost[index].leastwageall_checkbill
        ).toFixed(2);

        this.$message.error("对账金额超出范围");
        return false;
      } else if (Number(val) == 0 && this.costValue.indexOf(index) != -1) {
        this.costListData[index].dwageall = Number(
          this.backUpCost[index].leastwageall_checkbill
        ).toFixed(2);

        this.$message.error("对账金额不能为0");
        return false;
      } else {
        if (Number(val) != 0) {
          this.costListData[index].dwageall = Number(val).toFixed(2);
          this.costListData[index].leastwageall_checkbill = (
            Number(this.backUpCost[index].leastwageall_checkbill).toFixed(2) -
            Number(val).toFixed(2)
          ).toFixed(2);
        }

        if (Number(val) < 0) {
          this.costListData[index].dwageall = Number(
            this.backUpCost[index].leastwageall_checkbill
          ).toFixed(2);
          this.costListData[index].leastwageall_checkbill = Number("").toFixed(
            2
          );
        }
      }
    },
    // 改变订单
    // changeOrder(val){
    //   //alert('1')
    //   this.addBasicInfo.ordernoValue=val
    //   //var data=[]
    //   this.costValue=[]
    //     this.sjcAllData.forEach(item=>{
    //     if(item.accountname==this.addBasicInfo.accountname){

    //       item.jobnolist.forEach(item2=>{
    //         if(item2.orderno==val){
    //           this.addBasicInfo.settjobid=item2.settjobid
    //          this.backUpCost=JSON.parse(JSON.stringify(item2.wagelist))
    //           item2.wagelist.forEach((item3,index)=>{

    //             item3.dwageall=item3.leastwageall_checkbill
    //             item3.leastwageall_checkbill=Number('').toFixed(2)

    //             this.costListData.push(item3)
    //           })
    //         }

    //       })
    //     }
    //   })
    // },
    // 改变费用选择
    costHandle(val) {
      //console.log(this.backUpCost[val])
      // if (this.costValue.indexOf(val) != -1) {
      //   ////console.log(this.costListData[val].dwageall)
      //   if (
      //     !this.costListData[val].dwageall ||
      //     Number(this.costListData[val].dwageall) == 0
      //   ) {
      //     this.costListData[val].dwageall = Number(
      //       this.backUpCost[val].leastwageall_checkbill
      //     ).toFixed(2);
      //     this.costListData[val].leastwageall_checkbill = Number(
      //       Number(this.backUpCost[val].leastwageall_checkbill) -
      //         Number(this.costListData[val].dwageall)
      //     ).toFixed(2);
      //     //this.$message.error('请填写对账金额')
      //     //this.costValue.splice(this.costValue.indexOf(val),1)
      //     //return false
      //   }
      // } else {
      //   this.costListData[val].dwageall = "";
      //   this.costListData[val].leastwageall_checkbill = this.backUpCost[
      //     val
      //   ].leastwageall_checkbill;
      // }
    },
    // 查询
    search(type) {
      this.allJobList = [];
      this.costListData = [];
      this.costValue = [];
      var jsondata = { where: {} };
      console.log(this.addBasicInfo);
      //@@@待定查询条件
      Object.keys(this.addBasicInfo).forEach(item => {
        console.log(item);
        if (
          item == "mawb" ||
          item == "pono" ||
          item == "hbh" ||
          item == "items"
        ) {
          if (this.addBasicInfo[item] != "") {
            jsondata.where[item] = { like: this.addBasicInfo[item] };
          }
        } else if (item == "hbrq") {
          if (this.addBasicInfo[item].begin && !this.addBasicInfo[item].end) {
            jsondata.where[item] = { begin: this.addBasicInfo[item].begin };
          } else if (
            this.addBasicInfo[item].end &&
            !this.addBasicInfo[item].begin
          ) {
            jsondata.where[item] = { end: this.addBasicInfo[item].end };
          } else if (
            this.addBasicInfo[item].end &&
            this.addBasicInfo[item].begin
          ) {
            jsondata.where[item] = {
              begin: this.addBasicInfo[item].begin,
              end: this.addBasicInfo[item].end
            };
          }
        }
      });
      //  if(this.addBasicInfo.mawb&&this.addBasicInfo.ordernoValue){
      // var jsondata={"where":{mawb:{"like":this.addBasicInfo.mawb},orderno:{"like":this.addBasicInfo.ordernoValue}}}
      //  }else if(this.addBasicInfo.mawb&&!this.addBasicInfo.ordernoValue){
      //    var jsondata={"where":{mawb:{"like":this.addBasicInfo.mawb}}}
      //  }else if(!this.addBasicInfo.mawb&&this.addBasicInfo.ordernoValue){
      //    var jsondata={"where":{orderno:{"like":this.addBasicInfo.ordernoValue}}}
      //  }else{
      //    var jsondata={"where":{}}
      //  }
      if (this.addBasicInfo.accountname != "") {
        jsondata.where.gid = this.addBasicInfo.accountname;
      }
      // Object.keys(this.addBasicInfo).forEach(key => {
      //   if(key!="accountcomname"&&this.addBasicInfo[key]!=""){

      //   }
      // })
      var data = {
        system: this.system,
        accountcomgid: this.addBasicInfo.accountcomgid,
        wageinout: this.wageinout,
        area: this.area,
        json: JSON.stringify(jsondata)
      };
      this.$axios({
        method: "get",
        url:
          this.$store.state.webApi + "api/ExAiraxpCheckBillPchUnFinishDetail",
        params: data,
        nofield: "1"
      })
        .then(results => {
          if (type != "1") {
            if (results.data.length == 0) {
              this.$message.success("无查询记录");
            }
          }

          this.searchData = results.data[0].jobnolist
          results.data.forEach(item => {
            this.allJobList = this.allJobList.concat(item.jobnolist);
          });
          console.log("=======================")
          console.log(this.allJobList)
          console.log("=======================")
          this.allJobList.forEach((item,index) => {
            this.costValue.push(index)
            item.hbrq = item.hbrq.substring(0, 11);
            item.wagelist.forEach((item2, index2) => {
              item2.settjobid = item.settjobid;
              item2.abandonReason = "";
              item2.realwageall = Number(item2.realwageall).toFixed(2);
              item2.leastwageall_checkbill = Number(
                item2.leastwageall_checkbill
              ).toFixed(2);
              item2.price = Number(item2.price).toFixed(2);
              item2.otherwageall = Number(item2.otherwageall).toFixed(2);
              this.costListData.push(item2);
            });
            item.realjzt =
              item.realpiece +
              "/" +
              Number(item.realweight).toFixed(2) +
              "/" +
              Number(item.realvolume).toFixed(2);
          });
console.log("=======================")
          console.log(this.costListData)
console.log("=======================")
          this.backUpCost = JSON.parse(JSON.stringify(this.costListData));

          this.costListData.forEach((item, index) => {

            //@@costValue值为job层选项
            //this.costValue.push(index)

            this.$set(
              this.costListData[index],
              "dwageall",
              Number(item.leastwageall_checkbill).toFixed(2)
            );
            //this.$set(this.costListData[index], "hbrq", item.hbrq.substring(0,11))
            //this.$set(this.costListData[index], "dwageall", Number(item.leastwageall_checkbill).toFixed(2))
            item.leastwageall_checkbill = Number("").toFixed(2);
            item.hbrq = item.hbrq.substring(0, 11);
          });
        })
        .catch(error => {});
    },
    allCheck(data) {
      //全选
      this.costValue = data.checkvalue;
      if (this.costValue.length > 0) {
        this.costValue.forEach(item => {
          this.costHandle(item);
        });
      } else {
        this.allJobList.forEach((item, index) => {
          item.hbrq = item.hbrq.substring(0, 11);
          this.costHandle(index);
        });
        // this.costListData.forEach((item, index) => {
        //   item.hbrq = item.hbrq.substring(0, 11);
        //   this.costHandle(index);
        // });
        //this.orderValue=[]
      }
    }
  },

  watch: {
    //this.addBasicInfo.accountcomname=this.accountcomname

    accountcomname: {
      handler() {
        this.addBasicInfo.accountcomname = this.accountcomname;
      },
      immediate: true
    },
    accountcomgid: {
      handler() {
        this.addBasicInfo.accountcomgid = this.accountcomgid;
      },
      immediate: true
    }
    //   'addBasicInfo.mawb'(newVal){
    //   var data=[]
    //   this.sjcAllData.forEach(item=>{
    //     if(item.accountname==this.addBasicInfo.accountname){
    //       //data.push()
    //       item.jobnolist.forEach(item2=>{
    //         if(item2.mawb==newVal){
    //           data.push(item2.orderno)
    //         }

    //       })
    //     }
    //   })

    //   if(data.length==1){

    //     this.addBasicInfo.ordernoValue=data[0]

    //     this.changeOrder(data[0])
    //   }
    //   this.orderno=data
    //   },

    //   'addBasicInfo.ordernoValue'(){
    //       this.costValue = this.costListData ? this.costListData.map((i, index) => index) : []
    // },
  }
};
</script>

<style lang="less" scoped>
.table-box {
  //@table-width: 1000px;
  @table-border: 1px solid #ccc;

  margin: 30px 16px 16px;
  //width: @table-width;
  border: @table-border;
  border-top: none;
  border-right: none;
  .el-row {
    width: 100%;
    .el-col {
      height: 28px;
      line-height: 28px;
      text-align: center;
      border-right: @table-border;
      border-top: @table-border;
    }
    .el-icon-circle-plus-outline {
      position: absolute;
      top: 6px;
      left: 40px;
    }
    .el-icon-circle-plus-outline,
    .el-icon-setting,
    .el-icon-delete {
      cursor: pointer;
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .expansion {
    .el-col {
      border-bottom: @table-border;
    }
  }
  .table-row:last-child > .el-row .el-col {
    //border-bottom: @table-border;
  }
  .title {
    + .el-row .el-col {
      border-top: none;
    }
    + .table-row > .el-row .el-col {
      border-top: none;
    }
    .el-col {
      //border-top: none;
      border-bottom: @table-border;
      background: #efefef;
    }
  }
  .sub-table {
    border-top: 1px solid #ccc;
    .el-row {
      .title {
        .el-col {
          border-top: none;
        }
      }
      .el-col:last-child {
        border-right: @table-border;
      }
      .el-col:first-child {
        border-left: @table-border;
      }
    }
  }
}

.detail {
  margin-bottom: 20px;
  margin-top: 20px;
  border: 1px solid #e8e8e8;
  /deep/ .commonTable {
    div {
      padding-bottom: 0 !important;
    }
  }

  .detail-c {
    padding: 20px;
    .settlement-table {
      width: 70%;
    }
    span {
      display: inline-block;
      min-width: 100px;
      margin-bottom: 10px;
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
    width: 100px;
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
  .elTab {
    /deep/.el-tabs__active-bar {
      background: none;
    }
    .el-tab-pane {
      padding: 0;
    }
    /deep/.el-tabs__nav-wrap {
      &:after {
        background: #e8e8e8;
        height: 1px;
      }
      /deep/.is-scrollable {
        padding: 0;
      }
    }
    /deep/.el-badge__content.is-fixed.is-dot {
      right: 2px;
    }
    /deep/.el-badge__content.is-fixed {
      top: 3px;
      transform: translateY(100%) translateX(100%);
    }
    /deep/.el-badge__content.is-dot {
      height: 7px;
      width: 7px;
    }
    /deep/.el-tabs__nav-prev {
      display: none !important;
    }
    /deep/.el-tabs__nav-next {
      display: none !important;
    }
    /deep/.el-tabs__item {
      padding: 0 15px 0 0;
    }
  }
}
.hbrqClass {
  /deep/.el-input__inner {
    border: none;
  }
}
</style>
