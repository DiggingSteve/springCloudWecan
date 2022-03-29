<template>
  <div>
    <div class="page-container-box">
      <!-- {{inputViewData}}<br>

{{inputModelData}} -->

      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :pagetype="1"
        :chinese-where.sync="chineseWhere"
        @reset="reset"
      >
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="showReconDetail('multiply')">对账</el-button>
      </div>
    </div>

    <!--           <el-button  @click="send_email" type="primary">Email发送</el-button> -->

    <!--         <el-button @click="reconDetail=true">对账详细</el-button> -->

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :showTotal="showTotal"
      :chinese-where.sync="chineseWhere"
    >
      <!--  <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="jobidArr"></template> -->
      <!-- <template slot="dzFun" slot-scope="props"><i class="el-icon-circle-check-outline" @click="showReconDetail('single',props.data.index)" title="对账"></i></template> -->
      <!--  <template slot="emailFun" slot-scope="props"><i class="el-icon-message"></i></template> -->

      <template slot="pono" slot-scope="props"
        ><span
          :class="[
            props.data.row.status == 600 || props.data.row.status == '已撤单'
              ? 'redColor'
              : 'poczColor'
          ]"
          @click="showReconDetail('single', props.data.index)"
          >{{ props.data.value }}</span
        ></template
      >

      <template slot="accountcomname" slot-scope="props">
        <el-tooltip
          class="item"
          effect="dark"
          :content="props.data.value"
          placement="left"
        >
          <span
            style="color:#2C6D99;cursor:pointer;"
            @click="showReconDetail('single', props.data.index)"
            >{{ props.data.value }}</span
          >
        </el-tooltip>
      </template>
    </tableCompt>

    <el-dialog
      :title="wageinout == '1' ? '应收未对账' : '应付未对账'"
      width="100%"
      center
      top="0"
      :visible.sync="reconDetail"
      v-if="reconDetail"
      class="dialogPage"
      :modal="false"
       
    >
      <reconMngDetail
        :reconDetailStatus="reconDetail"
        :jobid="jobid"
        :system="system"
        :wageinout="wageinout"
        @unVisible="closeD"
        :area.sync="area"
        @openChatRoome="openChat"
        :accountcomgid="accountcomgid"
      ></reconMngDetail>
    </el-dialog>
  </div>
</template>

<script>
import {
  searCondition,
  getChangeValue,
  formatDate
} from "../api/localStorage.js";
import reconMngDetail from "./orderDetails/reconMngDetail";
import { searchCmptMixins } from "@/components/mixins/topPageMixin";

export default {
  name: "reconMngFir",
  components: {
    reconMngDetail
  },
  mixins: [searchCmptMixins],
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
      chatInfo: {},
      //jobidArr:[],
      showTotal: {
        all: true,
        ybjzt: false,
        sjjzt: false,
        zdjzt: false,
        wageprofit: false,
        realwageall: true,
        billwageall: false,
        wageall: false,
        finishwageall: false,
        finishwageall_checkbill: true
      },
      jobid: "",
      //wageinout:"",
      area: "",
      name: this.wageinout == "2" ? "reconMngFir.vue" : "reconMngFirIn.vue",
      reconDetail: false,
      tableDataRes: [],
      inputViewData: {
        pono: { title: "订舱编号", type: 1, whereStr: "like" },
        mawb: { title: "总运单号", type: 1, whereStr: "like" },
        orderno: { title: "订单来源号", type: 1 },
        fid: { title: "委托客户", type: 14, pagetype: "1" },
        gid: { title: "项目", type: 13, pagetype: "2" },
        hbh: {
          title: "航班号",
          type: 1,
          pagetype: 6,
          whereStr: "like",
          verify: "uppercase"
        },
        hbrq: {
          title: "航班日期",
          type: 15,
          defaultVal: true,
          defaultEnd: true,
          begintype: 6
        },
        sfg: { title: "始发港", type: 1, verify: "uppercase" },
        mdg: { title: "目的港", type: 1, verify: "uppercase" },
        wageinout: {
          title: "收付类型",
          type: 4,
          options: [
            { label: "应收", value: "1" },
            { label: "应付", value: "2" }
          ],
          hidden: true
        },
        wagestatus: {
          title: "费用状态",
          type: 5,
          options: [
            { label: "应付费用未确认", value: "应付费用未确认" },
            { label: "应收费用未确认", value: "应收费用未确认" },
            { label: "费用已确认", value: "费用已确认" }
          ],
          whereStr: "in"
        },
        billstatus: {
          title: "对账状态",
          type: 4,
          options: [
            { label: "对账中", value: "900" },
            { label: "已对账", value: "1000" }
          ],
          hidden: true
        },
        comhy: { title: "所属行业", type: 5, whereStr: "in", groupid: 89 }
      },
      inputModelData: {
        wageinout: this.wageinout,
        billstatus: "1000"
      },
      searchData: {},
      pageshow: true,
      chineseWhere: [],
      system: "",
      accountcomgid: ""
    };  
  },
  methods: {
    openChat(obj) {
      this.$store.commit("setChat", { status: true, data: obj.data });
    },
    search() {
      //var jsonArr=searCondition(this.inputViewData)

      this.tableDataRes = [];
      //this.searchData.ispriorcheck='2'
      let search = JSON.parse(JSON.stringify(this.searchData));

      // if (search.hbrq && !search.hbrq.begin) {
      //   let begin = new Date();
      //   begin.setMonth(begin.getMonth() - 2);
      //   search.hbrq.begin = formatDate(begin, "yyyy-MM-dd") + " 00:00:00";
      // }

      var jsonArr2 = {
        where: search,
        order: "hbrq asc,adddate asc"
      };

      var json = { json: JSON.stringify(jsonArr2) };
      json.area = this.$store.state.areaState;

      if (this.wageinout == "1") {
        json.queryType = "wagein";
      } else if (this.wageinout == "2") {
        json.queryType = "wageout";
      }

      //console.log(json)
      // if(json.area.split(',').length>1){
      //   this.$message.error('只能勾选一个区域');
      //   return false
      // }
      //json.system = this.system
      json.system = "";
      this.$axios({
        method: "get",
        url:
          this.$store.state.webApi + "api/ExAiraxpCheckBillPchUnFinishCollect",
        params: json,
        loading: true,
        tip: true,
        noarea: 1,
        nofield: 1
      })
        .then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
          results.data = getChangeValue(results.data);
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

    closeD(data) {
      this.reconDetail = data;
      //this.search()
    },
    showReconDetail(type, i) {
      //console.log(i)
      if (this.wageinout == "2" || String(i)) {
        this.accountcomgid = "";
        if (type == "single") {
          this.jobid = this.tableDataRes[i].jobid;
          this.system = this.tableDataRes[i].system;
          this.area = this.tableDataRes[i].area;
          this.accountcomgid = this.tableDataRes[i].accountcomgid;
        } else if (type == "multiply") {
          if (this.jobidArr.length > 0) {
            var templatejobid = [];
            var wtkhnameArray = [];
            var system = [];
            var area = [];
            this.jobidArr.forEach(item => {
              templatejobid.push(this.tableDataRes[item].jobid);
              if (!system.includes(this.tableDataRes[item].system)) {
                system.push(this.tableDataRes[item].system);
              }
              wtkhnameArray.push(this.tableDataRes[item].wtkhname);
              area.push(this.tableDataRes[item].area);
            });

            var repeatWtkh = 0;
            wtkhnameArray.forEach((item, index) => {
              if (index != wtkhnameArray.length - 1) {
                if (wtkhnameArray[0] != wtkhnameArray[index + 1]) {
                  repeatWtkh += 1;
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

            // 应付对账不需要判断委托客户
            // if(repeatWtkh>0 && this.wageinout !== '2'){
            //   this.$message.error('委托客户不同无法对账')
            //   return false;
            // }

            if (repeatarea > 0) {
              this.$message.error("区域不同无法对账");
              return false;
            }

            // this.wageinout=this.tableDataRes[this.jobidArr[0]].wageinout
            this.area = this.tableDataRes[this.jobidArr[0]].area;
            this.jobid = templatejobid.join(",");
            this.system = system.join(",");
          } else {
            if (this.wageinout === "1") {
              //this.$message.error('请选择订单号')
              //return false
            } else if (this.wageinout === "2") {
              if (this.$store.state.areaState.split(",").length > 1) {
                return this.$message.error("请选择单个区域");
              }
              this.jobid = "";
              this.area = "";
            }
          }
        }
      }
      this.reconDetail = true;
    },

    send_email() {
      ////console.log('send_email')
    }
  },
  created() {},
  mounted() {
    // setTimeout(()=>{
    //   this.search()
    // },500)
  },
  watch: {
    inputModelData: {
      handler(val) {
        if (val["wageinout"] == "1") {
          //alert('1')
          this.inputViewData.fid.pagetype = 1;
        } else if (val["wageinout"] == "2") {
          //alert('2')
          this.inputViewData.fid.pagetype = 3;
        }
      },
      deep: true
    }
  },
  computed: {
    jobidArr() {
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

<style lang="less" scoped></style>
