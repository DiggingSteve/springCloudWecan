<template>
  <div class="elform" :class="{disabled:area=='上海'}">
    <myAlert :servicecode="servicecode"></myAlert>
    <el-form
      ref="form"
      label-width="115px"
      :inline="true"
      style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap"
    >
      <el-row>
        <el-form-item label="进仓编号：">
          <el-select
            placeholder="请选择"
            multiple
            v-model="inputModelData.khjcno"
            size="mini"
            style="width:166px;"
            @change="hawbSelFunc"
            class="input-required"
          >
            <li @click="selmultiAll()" style="font-weight: bold;"
              :style="{color:inputModelData.khjcno.length == saveNumberList.length?'#409EFF':''}">
              <span style="cursor:pointer;user-select: none;;display:block;margin:5px 0px 5px 20px;">全选<i style="margin-left:5px"
                  class="el-icon-check"></i></span>
            </li>
            <li>
              <span style="float: left;margin-left:20px;">进仓编号</span>
              <span style="float: right;margin-right:30px;">
                <i class="imul">件</i>/
                <i class="imul">重</i>/
                <i class="imul">体</i>
              </span>
            </li>
            <el-option
              v-for="numitem in saveNumberList"
              :key="numitem.khjcno"
              :label="numitem.khjcno"
              :value="numitem.khjcno"
              style="width:300px;"
            >
              <!-- v-if="!selOptionShow(numitem.khjcno)" -->

              <span style="float: left">{{ numitem.khjcno }}</span>
              <span style="float: right;margin-right:10px;">
                <i class="imul">{{ numitem.piece }}</i>/
                <i class="imul">{{ numitem.weight }}</i>/
                <i class="imul">{{ numitem.volume }}</i>
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="件：" style="margin-bottom:0px;">
          <span>{{inputModelData.piece}}</span>
        </el-form-item>

        <el-form-item label="重：" style="margin-bottom:0px;">
          <span>{{inputModelData.weight}}</span>
        </el-form-item>
        <el-form-item label="体：" style="margin-bottom:0px;margin-right:30px">
          <span>{{inputModelData.volume}}</span>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="入库区域：">
          <el-select
            v-model="inputModelData.yjstorearea_org"
            placeholder="请选择"
            class="input-required"
          >
            <el-option v-for="item in areaArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库仓库：" style="margin-left:4px" class="input-required">
          <el-select v-model="inputModelData.yjstore_org" placeholder="请选择">
            <el-option v-for="item in storeArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计入库时间：" style="margin-left:20px">
          <el-date-picker
            v-model="inputModelData.yjjcdate_org"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" style="margin-left:30px;" @click="saveListInfo">保存入库信息</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div></div>
    <!-- {{tableData}} -->
    <commonTable
      class="commonTable"
      :head="tableHead"
      :table-data="tableData"
      style="margin-top:8px;"
    >
      <!-- <template slot="operate" slot-scope="props">
        <i class="el-icon-setting" @click="setListInfo(props.data.index)"></i>
        <i class="el-icon-delete" @click="delListInfo(props.data.index)"></i>
      </template>-->
      <template slot="operate" slot-scope="props">
        <span @click="setListInfo(props.data.index)" style="cursor:pointer;color:blue">编辑</span>
        <span
          @click="delListInfo(props.data.index)"
          style="cursor:pointer;color:blue"
        >{{props.data.row.store_oldguid>0?'解绑':'删除'}}</span>
      </template>

      <template slot="weight" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>
      <template slot="volume" slot-scope="props">{{Number(props.data.value).toFixed(3)}}</template>
    </commonTable>

    <el-dialog
      title="尺寸详细"
      :visible.sync="dialog"
      v-if="dialog"
      append-to-body
      :close-on-click-modal="false"
      width="830px"
    >
      <div class="detail">
        <div>
          <div class="showpaneinfo infodiv">
            <div>进仓编号</div>
            <div>包装类型</div>
            <div>长*宽*高(CM)=体积(m³)</div>
            <div>是否超限</div>
          </div>
          <div v-for="item in storeDetail" class="showpaneinfo infodiv">
            <div>{{item.khjcno}}</div>
            <div>{{item.packagetypename}}</div>
            <div>{{item.longs}}*{{item.widths}}*{{item.heights}}={{item.total}}m³</div>
            <div></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getChangeRate } from "../../api/localStorage.js";
export default {
  props: {
    saveNumberList: Array,
    mawbguid: [Number, String],
    serviceguid: String,
    servicecode: String,
    area: String
  },
  components: {},

  data() {
    return {
      disabled: false,
      putIndex: -1,
      tableHead: [
        { title: "操作", field: "operate" },
        { title: "入库地区", field: "yjstorearea_org" },
        { title: "入库仓库", field: "yjstore_org" },
        {
          title: "预计入库时间",
          field: "yjjcdate_org",
          formatType: 1,
          format: "yyyy-MM-dd hh:mm"
        },
        { title: "件数", field: "piece" },
        { title: "重量", field: "weight" },
        { title: "体积", field: "volume" },
        { title: "进仓编号", field: "khjcnoList" }
        // {title:"仓储费用",field:"wageall"},
        // {title:"币种",field:"currency"},
      ],
      tableData: [],
      inputViewData: [
        //   {"title":"入库地区：",id:"yjstorearea_org",type:4,"model":"PVG","defaultModel":""},
        //   {"title":"入库仓库：",id:"yjstore_org",type:4,"model":"","defaultModel":""},
        //   {"title":"预计入库时间：",id:"yjjcdate_org",type:6,"model":"","defaultModel":""},
        //  {},
        //  {id:"storeWage",model:""},
        //  {id:"currency",model:""},
        //  {id:"btnSave"},
      ],
      inputModelData: {
        khjcno: [],
        yjstorearea_org: "",
        yjstore_org: "",
        yjjcdate_org: ""
      },
      // rkyq:[{"title":"入库要求",id:"rkyq",type:8,model:"","defaultModel":"",ifconShow:false}],
      cargoData: [],
      dialog: false
    };
  },
  methods: {
    hawbSelFunc(val) {
      //选中进仓编号
      var piece = 0;
      var weight = 0;
      var volume = 0;
      val.forEach(item => {
        this.saveNumberList.forEach(element => {
          if (item == element.khjcno) {
            piece += Number(element.piece);
            weight += Number(element.weight);
            volume += Number(element.volume);
          }
        });
      });

      this.inputModelData.piece = piece;
      this.inputModelData.weight = Number(weight).toFixed(2);
      this.inputModelData.volume = Number(volume).toFixed(3);
    },
    getFormInfo() {
      var ybArr = [];
      let newKhjcnoArr = this.inputModelData.khjcno;
      let oldKhjcnoArr = this.tableData[this.putIndex]
        ? this.tableData[this.putIndex].khjcnoList.split(",")
        : [];
      newKhjcnoArr.forEach(i => {
        if (!oldKhjcnoArr.includes(i)) {
          ybArr.push({ isdel: 1, khjcno: i });
        }
      });
      oldKhjcnoArr.forEach(i => {
        if (!newKhjcnoArr.includes(i)) {
          ybArr.push({ isdel: 2, khjcno: i });
        } else {
          ybArr.push({ isdel: 1, khjcno: i });
        }
      });

      var ybstoreList = [];
      ybArr.forEach(el => {
        this.saveNumberList.forEach(item => {
          if (el.khjcno == item.khjcno) {
            ybstoreList.push({
              isdel: el.isdel,
              guid: item.guid,
              khjcno: el.khjcno
            });
          }
        });
      });

      return ybstoreList;
    },
    initFunc() {},
    getListInfo() {
      this.putIndex = -1;
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAxplineStoreInStore",
        params: {
          sid: this.mawbguid,
          serviceguid: this.serviceguid,
          servicecode: this.servicecode
        },
        loading: true,
        tip: false
      }).then(results => {
        //console.log("仓库信息")
        //console.log(results.data)
        this.tableData = results.data;
        this.$emit(
          "getJsxmData",
          results.data,
          this.servicecode == "AA0410" ||this.servicecode == "AG0145" ? 2 : 8,this.servicecode
        );
      });
    },
    selOptionShow(item) {
      //判断进仓编号是否已经使用
      var isUse = false;
      this.tableData.forEach((element, i) => {
        if (
          element.khjcnoList.split(",").includes(item) &&
          this.putIndex != i
        ) {
          isUse = true;
        }
      });
      return isUse;
    },
    saveListInfo() {
      this.inputModelData.khjcnoList = this.getFormInfo();
      this.inputModelData.serviceguid = this.serviceguid;
      this.inputModelData.servicecode = this.servicecode;
      this.inputModelData.yjjcdate_org =
        this.inputModelData.yjjcdate_org || "1900-01-01";
      //console.log(JSON.stringify(this.inputModelData));
      if (this.checkRequier != "") {
        this.$message.error("请填写" + this.checkRequier);
        return;
      }

      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExAxplineStoreInStore",
        data: this.inputModelData,
        loading: true,
        tip: false
      }).then(results => {
        //console.log(results.data)
        if (results.data.resultstatus == 0) {
          // json.guid=results.data.resultguid
          //   this.tableData.push(json)
          //   this.initFunc()
          // this.disabled=true;
          layer.msg("成功");
          this.putIndex = -1;
          this.inputModelData = {
            khjcno: [],
            yjstorearea_org: "",
            yjstore_org: "",
            yjjcdate_org: ""
          };
          this.getListInfo();
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    setListInfo(index) {
      this.putIndex = index;

      this.$nextTick(() => {
        this.inputModelData = JSON.parse(JSON.stringify(this.tableData[index]));
        this.inputModelData.khjcno = this.inputModelData.khjcnoList.split(",");
        this.hawbSelFunc(this.inputModelData.khjcno);
      });

      //  this.disabled=false;
    },
    delListInfo(index) {
      var json = JSON.parse(JSON.stringify(this.tableData[index]));
      let str =
        json.store_oldguid > 0
          ? "将取消绑定，并退回到工作号：" + json.store_oldpono
          : "确认删除？";

      this.$confirm(str, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delFunc(json, index);
      });
    },
    delFunc(json, index) {
      json.yjstorearea_org = "";
      json.yjstore_org = "";
      json.yjjcdate_org = "1900-01-01";

      let arr = [];
      json.khjcnoList.split(",").forEach(el => {
        this.saveNumberList.forEach(item => {
          if (el == item.khjcno) {
            arr.push({ isdel: 2, guid: item.guid });
          }
          return arr;
        });
        json.khjcnoList = arr;
        json.serviceguid = this.serviceguid;
        json.guid = this.mawbguid;
        json.servicecode = this.servicecode;
        //console.log(JSON.stringify(json));
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAxplineStoreInStore",
          data: json,
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            layer.msg("成功");
            this.inputModelData = {
              khjcno: [],
              yjstorearea_org: "",
              yjstore_org: "",
              yjjcdate_org: ""
            };
            this.putIndex = -1;
            // this.getListInfo()
            this.tableData.splice(index, 1);
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      });
    },
    getAreaStore() {
      this.cargoData = JSON.parse(localStorage.cargoData);
    }, selmultiAll() {
      //下拉全选
      let saveNumberList = this.saveNumberList
      //  let saveNumberList = this.saveNumberList.filter(i => !this.selOptionShow(i.khjcno))
      if (this.inputModelData.khjcno.length == saveNumberList.length) {
        this.inputModelData.khjcno = [];
      } else {
        this.inputModelData.khjcno = saveNumberList.map(i => i.khjcno);
      }
    },
  },
  computed: {
    checkRequier() {
      //检查是否必填，除备注外全部必填
      var require = "";

      if (this.inputModelData.khjcno.length == 0) {
        return "进仓编号";
      }
      Object.keys(this.inputModelData)
        .reverse()
        .forEach(i => {
          if (!this.inputModelData[i]) {
            this.tableHead.forEach(item => {
              if (i == item.field && item.field != "yjjcdate_org") {
                require = item.title;
              }
            });
          }
        });
      return require;
    },

    areaArr() {
      let arr = [];
      this.cargoData.map(item => {
        if (!arr.includes(item.area)) {
          arr.push(item.area);
        }
      });
      return arr;
    },
    storeArr() {
      let arr = [];
      this.cargoData.map(item => {
        if (item.area == this.inputModelData.yjstorearea_org) {
          arr.push(item.storename);
        }
      });
      return arr;
    },
    storeDetail() {
      // alert(this.inputModelData.khjcno)
      var detailArr = [];
      var khjcno = this.inputModelData.khjcno;
      khjcno.forEach(i => {
        this.saveNumberList.forEach(el => {
          if (i == el.khjcno) {
            el.storevolumeList.forEach(et => {
              let total = (et.longs * et.widths * et.heights).toFixed(3);
              detailArr.push({
                khjcno: el.khjcno,
                packagetypename: et.packagetypename,
                longs: et.longs,
                widths: et.widths,
                heights: et.heights,
                total: total
              });
            });
          }
        });
      });
      ////console.log(detailArr)
      return detailArr;
    }
  },
  created() {
    this.getListInfo();

    this.getAreaStore();

    ////console.log(this.mdd)
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.elform {
  /deep/ .el-select {
    width: 165px;
  }
  /deep/ .el-form-item__label {
    padding-right: 5px;
    color: #333;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  .infodiv > div {
    text-align: center;
  }
}
</style>


