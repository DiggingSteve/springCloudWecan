<template>
  <div>
    <div
      style="text-align: right;height: 0px;transform: translate(-2px,-52px);z-index: 600;position: relative"
    >
      <el-button type="primary" @click="addHawb()">新增分单 </el-button>
    </div>

    <commonTabs
      deletetype="2"
      :list="mawbdetail.opersystem == '进口' ? initInfo && initInfo.hawbList : mawbdetail.hawbList"
      @toggle="toggleIndex"
      showClose
      :showContent="showContent"
      :checkedIndex.sync="hawblistChecked"
      titlefield="hawb"
      :showTooltip="false"
    >
      <div
        v-for="(hawb, index) in (mawbdetail.opersystem == '进口'
          ? initInfo && initInfo.hawbList
          : mawbdetail.hawbList)"
        v-show="hawblistChecked == index"
        :key="index"
      >
        <hawbInfoNewAdd
          :hawbdata.sync="hawb"
          :mawbdetail="mawbdetail.opersystem == '进口' ?  initInfo : mawbdetail "
        ></hawbInfoNewAdd>
      </div>
    </commonTabs>
    
    <div
      v-show="
        initInfo &&
          initInfo.hawbList &&
          initInfo.hawbList.length > 0 &&
          mawbdetail.opersystem == '进口'
      "
    >
      <div
        v-for="(i, hawbIndex) in initInfo && initInfo.hawbList"
        :key="hawbIndex"
      >
        <div class="detail" v-show="hawbIndex == hawblistChecked">
          <div class="detail" v-show="initInfo.hawbList.length > 0">
            <div class="detail-title">
              服务项目
            </div>
            <div class="detail-c">
              <tempConfig
                name="mawbAddNew.vue"
                style="position:absolute;top:1px;right:0px;"
                :system="initInfo ? mawbdetail.system : ''"
                :type="80"
                :jsondata.sync="initInfo.hawbList[hawbIndex].serviceList"
                v-if="tempConfigShow"
              >
              </tempConfig>
              <serviceList
                :pagetype="initInfo && initInfo.guid > 0 ? 2 : 1"
                :serviceList="
                  initInfo && initInfo.guid > 0 && initInfo.hawbList.length > 0
                    ? initInfo.hawbList[hawbIndex].serviceList
                    : []
                "
                :newService="
                  initInfo.hawbList.length > 0
                    ? initInfo.hawbList[hawbIndex].newService
                    : {}
                "
                :opersystem="initInfo && initInfo.opersystem"
                :orderdom="initInfo && initInfo.orderdom"
                :system="initInfo && mawbdetail.system"
                :czlx="initInfo && initInfo.czlx"
                :ysfs="initInfo && initInfo.ysfs"
                :mawbdetail="mawbdetail"
              >
              </serviceList>
            </div>
          </div>
          <div
            class="detail"
            v-show="
              initInfo.hawbList && Object.values(initInfo.hawbList[hawbIndex].newService).filter(
                i => i.servicecode == 'AB0420' && !i.model
              ).length
            "
          >
            <div class="detail-title">
              实际货物信息
            </div>
            <div class="detail-c" style="overflow:auto">
              <commonTable
                :head="cargoTableHead"
                :tableData="
                 initInfo.hawbList&& initInfo.hawbList.length > 0
                    ? initInfo.hawbList[hawbIndex].cargoInfoList
                    : []
                "
                class="commonTable"
                style="width:1500px;"
              >
                <template
                  :slot="i.field"
                  v-if="i.field.toLowerCase().includes('piece')"
                  slot-scope="props"
                  v-for="(i, index) in cargoTableHead"
                >
                  <el-input
                    v-model="props.data.row[i.field]"
                    v-verify="'integer'"
                    clearable
                    placeholder="请输入"
                    :class="{ 'input-required': i.field == 'piece' }"
                    @change="
                      inputChange('khjcno', 'weight', 'piece', props.data.index)
                    "
                  ></el-input>
                </template>

                <template slot="operate" slot-scope="props">
                  <i
                    class="el-icon-delete"
                    title="删除进仓编号"
                    @click="delKhjcno(props.data.index)"
                    style="cursor:pointer;color:red"
                  ></i>
                </template>

                <template slot="khjcno" slot-scope="props">
                  <el-input
                    v-model="props.data.row.khjcno"
                    clearable
                    placeholder="请输入"
                    class="input-required"
                    @change="
                      inputChange('khjcno', 'weight', 'piece', props.data.index)
                    "
                  ></el-input>
                </template>

                <template slot="weight" slot-scope="props">
                  <el-input
                    v-model="props.data.row.weight"
                    v-verify="'fixedTwo'"
                    clearable
                    placeholder="请输入"
                    class="input-required"
                    @change="
                      inputChange('khjcno', 'weight', 'piece', props.data.index)
                    "
                  ></el-input>
                </template>

                <template slot="yjstoredate" slot-scope="props">
                  <el-date-picker
                    v-model="props.data.row.yjstoredate"
                    :value-format="'yyyy-MM-dd HH:mm:ss'"
                    type="datetime"
                    :placeholder="'选择日期'"
                    :picker-options="setPickerOptions"
                    style="width:160px;"
                    clearable
                  >
                  </el-date-picker>
                </template>

                <template slot="packagetypename" slot-scope="props">
                  <el-select
                    v-model="props.data.row.packagetypename"
                    :clearable="true"
                    filterable
                  >
                    <el-option
                      v-for="(i, index) in packageNameList"
                      :key="index"
                      :label="i"
                      :value="i"
                    >
                    </el-option>
                  </el-select>
                </template>
              </commonTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hawbInfoNewAdd from "@/components/orderDetails/hawbInfoNewAdd";
import serviceList from "@/components/orderDetails/serviceList";
import tempConfig from "@/components/templates/tempConfig";

export default {
  props: {
    mawbdetail: Object,
    showContent: Boolean,
    initInfo: Object
  },

  provide() {
    return {
      reactiveTabIndex: () => this.hawblistChecked
    };
  },
  components: { hawbInfoNewAdd, serviceList, tempConfig },

  data() {
    return {
      hawblistChecked: 0,
      hawbListBackup: [],
      projectLength: 0,
      tempConfigShow: true, //用于初始化服务模板组件
      newService: {}, //服务项目
      cargoTableHead: [
        { field: "operate", title: "删除" },
        { field: "khjcno", title: "进仓编号" },
        { field: "piece", title: "件数" },
        { field: "weight", title: "重量" },
        { field: "storeType", title: "入库类型" },
        { field: "yjstoredate", title: "入库日期" },
        { field: "packagetypename", title: "包装类型" },
        { field: "djhpiece", title: "大件货" },
        { field: "cdjhpiece", title: "超限货" },
        { field: "tzcxhpiece", title: "特种超限货" },
        { field: "jmyqpiece", title: "精密仪器" },
        { field: "breakPiece", title: "破损" },
        { field: "moistPiece", title: "潮湿" },
        { field: "deformPiece", title: "变形" },
        { field: "redpiece", title: "泛红" },
        { field: "bwbreakpiece", title: "板位破损" },
        { field: "otherpiece", title: "破损无报告" }
      ], // 实际货物信息
      setPickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      },
      packageNameList: [], //包装类型基础数据
      handleTabIndex: 0,
      //初始货物信息
      initCargoInfo: {
        khjcno: "",
        piece: "",
        weight: "",
        storeType: "不入库",
        yjstoredate: "",
        packagetypename: "",
        djhpiece: "",
        cdjhpiece: "",
        tzcxhpiece: "",
        jmyqpiece: "",
        breakPiece: "",
        moistPiece: "",
        deformPiece: "",
        redpiece: "",
        bwbreakpiece: "",
        otherpiece: ""
      }
    };
  },

  watch: {
    "initInfo.ysfs": {
      handler(val) {
        if (
          this.initInfo &&
          this.initInfo.hawbList &&
          this.initInfo.hawbList.length > 0
        ) {
          if (
            this.initInfo.hawbList[this.hawblistChecked].newService["AB0420"]
          ) {
            if (val != "外仓货") {
              this.initInfo.hawbList[this.hawblistChecked].newService["AB0420"][
                "model"
              ] = true;
            } else {
              this.initInfo.hawbList[this.hawblistChecked].newService["AB0420"][
                "model"
              ] = false;
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    addHawb(data = {}) {
      if (this.mawbdetail.opersystem == "进口") {
        this.initInfo.hawbList.push(
          Object.assign({}, this.fetch_hawb_data(), data)
        );
        this.hawblistChecked = this.initInfo.hawbList.length - 1;
        if (this.initInfo.hawbList.length > 0) {
          if (this.initInfo.hawbList[this.hawblistChecked].newService) {
            if (
              this.initInfo.hawbList[this.hawblistChecked].newService["AB0420"]
            ) {
              if (this.mawbdetail.ysfs != "外仓货") {
                this.initInfo.hawbList[this.hawblistChecked].newService[
                  "AB0420"
                ]["model"] = true;
              } else {
                this.initInfo.hawbList[this.hawblistChecked].newService[
                  "AB0420"
                ]["model"] = false;
              }
            }
          }
        }
      } else {
        this.mawbdetail.hawbList.push(
          Object.assign({}, this.fetch_hawb_data(), data)
        );
        this.hawblistChecked = this.mawbdetail.hawbList.length - 1;
      }
    },
    fetch_hawb_data(hawb = {}) {
      var obj = {
        guid: -1,
        isdel: 1,
        sfg: "",
        mdg: "",
        ybpiece: "",
        ybweight: "",
        jfweight: "",
        ybvolume: "",
        smallpiece: "",
        hwxz: "",
        hwlx: "",
        batterymodel: "",
        chinesepm: "",
        englishpm: "",
        isinwageallin: -1,
        inwageallinprice: 0,
        currency: "",
        companytitle_fhr_hawb: "",
        address_fhr_hawb: "",
        companycode_fhr_hawb: "",
        state_fhr_hawb: "",
        city_fhr_hawb: "",
        postcode_fhr_hawb: "",
        lxr_fhr_hawb: "",
        phone_fhr_hawb: "",
        fax_fhr_hawb: "",
        email_fhr_hawb: "",
        taxcode_fhr_hawb: "",
        companytitle_shr_hawb: "",
        address_shr_hawb: "",
        companycode_shr_hawb: "",
        state_shr_hawb: "",
        city_shr_hawb: "",
        postcode_shr_hawb: "",
        lxr_shr_hawb: "",
        phone_shr_hawb: "",
        fax_shr_hawb: "",
        email_shr_hawb: "",
        taxcode_shr_hawb: "",
        cargoInfoList: [
          {
            khjcno: "",
            piece: "",
            weight: "",
            storeType: "不入库",
            yjstoredate: "",
            packagetypename: "",
            djhpiece: "",
            cdjhpiece: "",
            tzcxhpiece: "",
            jmyqpiece: "",
            breakPiece: "",
            moistPiece: "",
            deformPiece: "",
            redpiece: "",
            bwbreakpiece: "",
            otherpiece: "",
            isadd: false
          }
        ],
        //进口新增加的
        fid: "",
        hawb: "",
        hwplace: "",
        tradeterm: "",
        jsfs: "",
        yjStoredatetype: "",
        hasdjh: "",
        hascdjh: "",
        hastzcx: "",
        "hasjmyq:": "",
        customerRelList: [], //客户联系人
        serviceList: [], //
        newService: {},
        sizeremark: ""
      };

 
        if (this.initInfo) {
          let sumYbpiece = 0; //分单件数
          let sumYbweight = 0; // 预报重量
          let sumJfweight = 0;
          this.initInfo.hawbList.forEach(item => {
            sumYbpiece += Number(item.ybpiece);
            sumYbweight += Number(item.ybweight);
            sumJfweight += Number(item.jfweight);
          });
          let newYbpiece = Number(this.initInfo.ybpiece) - sumYbpiece;
          let newYbweight = parseFloat(
            Number(this.initInfo.ybweight) - sumYbweight
          ).toFixed(2);
          let newJfweight = parseFloat(
            Number(this.initInfo.jfweight) - sumJfweight
          ).toFixed(2);

          obj.ybpiece = isNaN(newYbpiece) ? "" : String(newYbpiece);
          obj.ybweight = isNaN(newYbweight) ? "" : String(newYbweight);
          obj.jfweight = isNaN(newJfweight) ? "" : String(newJfweight);
        }
      if (
        this.mawbdetail.opersystem == "进口" &&
        this.initInfo.hawbList.length > 0
      ) {
        obj.fid = this.initInfo.hawbList[0].fid;
        obj.gid = this.initInfo.hawbList[0].gid;
        obj.sfg = this.initInfo.hawbList[0].sfg;
        obj.mdg = this.initInfo.hawbList[0].mdg;
        obj.customerRelList = this.initInfo.hawbList[0].customerRelList;
        obj.hwplace = this.initInfo.hawbList[0].hwplace;
        obj.tradeterm = this.initInfo.hawbList[0].tradeterm;
        obj.jsfs = this.initInfo.hawbList[0].jsfs;
        obj.hasdjh = this.initInfo.hawbList[0].hasdjh;
        obj.hascdjh = this.initInfo.hawbList[0].hascdjh;
        obj.hastzcx = this.initInfo.hawbList[0].hastzcx;
        obj.hasjmyq = this.initInfo.hawbList[0].hasjmyq;
        obj.englishpm = this.initInfo.hawbList[0].englishpm;
        obj.sizeremark = this.initInfo.hawbList[0].sizeremark;
      } else {
        obj.hwxz = hawb.hwxz || this.mawbdetail.hwxz;
        obj.hwlx = hawb.hwlx || this.mawbdetail.hwlx;
        obj.batterymodel = hawb.batterymodel || this.mawbdetail.batterymodel;
        obj.sfg =
          this.mawbdetail.opersystem == "进口"
            ? this.initInfo
              ? this.initInfo.sfg
              : ""
            : hawb.sfg || this.mawbdetail.sfg;
        obj.mdg =
          this.mawbdetail.opersystem == "进口"
            ? this.initInfo
              ? this.initInfo.mdg
              : ""
            : hawb.mdg || this.mawbdetail.mdg;
        obj.gid = hawb.gid || this.mawbdetail.gid;
        obj.area = hawb.area || this.mawbdetail.area;
      }

      // if (this.$store.state.areaState == '市场部' || this.$store.state.areaState == '海外部') {
      //     obj.tradeterm = 'FOB'
      // }

      return obj;
    },
    inputChange(field, field2, field3) {
      //新增一条货物信息 进仓编号、重量、件数
      // debugger
      console.log(field, field2, field3);
      //  let data=this.initInfo.ybstoreList[this.initInfo.ybstoreList.length-1]
      let data = this.initInfo.hawbList[this.hawblistChecked].cargoInfoList[
        this.initInfo.hawbList[this.hawblistChecked].cargoInfoList.length - 1
      ]; //最后一条货物信息是否有数据

      if (data[field] && data[field2] && data[field3]) {
        this.initInfo.hawbList[this.hawblistChecked].cargoInfoList.push({
          ...this.initCargoInfo
        });
      }
    },
    delKhjcno(index) {
      //删除一条货物信息
      this.initInfo.hawbList[this.hawblistChecked].cargoInfoList.splice(
        index,
        1
      );
    },
    async getHawbNum() {
      //获取分单号
      await this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAxpline",
        params: {
          hpoidHawbGroup: this.mawbdetail.guid
        },
        loading: false,
        tip: false
      }).then(results => {
        //  console.log("分单号");
        //   console.log(JSON.stringify(results.data));
        this.hawbListBackup = JSON.parse(JSON.stringify(results.data));
        this.mawbdetail.hawbList = results.data;
      });

      return this.hawbListBackup;
    },
    toggleIndex(data) {
      this.handleTabIndex = data.index;
      console.log(data.index);
    }
  },
  mounted() {},
  created() {
    this.packageNameList = JSON.parse(localStorage.groupType)
      .filter(i => i.groupid == "31")
      .map(i => i.typename);
    this.$watch(
      () => {
        return (
          this.mawbdetail.hwxz +
          this.mawbdetail.hwlx +
          this.mawbdetail.batterymodel +
          this.mawbdetail.sfg +
          this.mawbdetail.mdg +
          this.mawbdetail.gid +
          this.mawbdetail.area
        );
      },
      () => {
        if (
          this.initInfo &&
          this.initInfo.hawbList &&
          this.initInfo.hawbList.length > 0
        ) {
          this.initInfo.hawbList.forEach(hawb => {
            hawb.hwxz = hawb.hwxz || this.mawbdetail.hwxz;
            hawb.hwlx = hawb.hwlx || this.mawbdetail.hwlx;
            hawb.batterymodel =
              hawb.batterymodel || this.mawbdetail.batterymodel;
            hawb.sfg = hawb.sfg || this.mawbdetail.sfg;
            hawb.mdg = hawb.mdg || this.mawbdetail.mdg;
            hawb.gid = hawb.gid || this.mawbdetail.gid;
            hawb.area = hawb.area || this.mawbdetail.area;
          });
        }
      }
    );
  }
};
</script>

<style lang="less" scoped></style>
