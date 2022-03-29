<template>
  <div class="pageSelect" style="width:100%;display:flex;align-items:center">
    <span style="display:none"></span>

    <!-- {{value?'无匹配数据！':'请输入数据，将自动筛选结果！'}} -->
    <el-select
      v-model="pageSelectValue"
      filterable
      :multiple="multiple"
      default-first-option
      clearable
      @clear="focusFunc"
      :placeholder="pagetype=='9'?'联系人':'请输入选择'"
      @change="changeFunc"
      :filter-method="filterFunc"
      @visible-change="visChange"
      style="flex:1;min-width:120px;"
      class="mulSelPane"
      :disabled="disabled"
      size="mini"
      :no-data-text="noDataText"
    >
      <div class="mulSelPane-title mulFlex">
        <span v-for="(item,indexp) in viewdata.slice(1)" :key="indexp">{{item.title}}</span>
      </div>
      <el-option
        v-for="(item,index) in dataArr"
        :key="item[viewdata[0].title]+index"
        :label="item[viewdata[0].field]"
        :value="item[viewdata[0].title]"
        class="mulFlex"
        :disabled="optionDisabled(item)"
      >
        <span v-for="(item2,indexv) in viewdata.slice(1)" :key="indexv">{{item[item2.field] }}</span>
      </el-option>
      <div style="position:absolute;bottom:0px;background:#fff;width:100%">
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="dataAll.length"
          ></el-pagination>
        </div>
      </div>
    </el-select>
    <slot name="other"></slot>
  </div>
</template>
<script>
export default {
  props: {
    area: {
      type: String,
      default: ""
    },
    fid: {
      type: [String, Number],
      default: ""
    },
    wtxmname: {
      type: [String, Number],
      default: ""
    },
    ifRefreshData: {
      type: Boolean,
      default: false
    },
    pagetype: {
      //可以直接选择的组件类型 1委托客户(公司) 2 委托项目 ，3供应商项目  4.结算项目  指定类型之后不用传pagedata
      type: Number,
      default: -1
    },
    pagedata: {
      //传入的分页数据
      type: Array,
      default: () => []
    },
    viewdata: {
      type: Array,
      default() {
        var arr = [];
        if (this.pagetype == 5) {
          return [
            { title: "s_name", field: "s_name" }, //配置绑定label 和 value 字段名
            { title: "服务项目", field: "s_name" }, //显示两列的名字与字段名
            { title: "英文名称", field: "s_ename" }, //显示两列的名字与字段名
            { title: "服务项目代码", field: "s_code" }
          ];
        } else if (this.pagetype == 6) {
          return [
            { title: "ThreeCode", field: "ThreeCode" }, //配置绑定label 和 value 字段名
            { title: "三字代码", field: "ThreeCode" },
            { title: "英文全称", field: "Ready01", noFilter: true } //noFilter 是否作为过滤的字段，true为不过滤
          ];
        } else if (this.pagetype == 9) {
          return [
            { title: "jobname", field: "jobname" }, //配置绑定label 和 value 字段名
            { title: "联系人", field: "jobname" },
            { title: "部门", field: "department" },
            { title: "区域", field: "area" } //noFilter 是否作为过滤的字段，true为不过滤
          ];
        } else {
          return [
            { title: "id", field: "usr_name" }, //配置绑定label 和 value 字段名
            { title: "名称", field: "usr_name" }, //显示两列的名字与字段名
            { title: "代码", field: "usr_code" }
          ];
        }
      }
    },
    modelval: [Number, String, Array], //传入的值
    rowdata: Object, //返回选中的行的值
    disabled: {
      // 是否禁用
      type: Boolean,
      default: () => false
    },
    multiple: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      pageSelectValue: "",
      dataAll: [], //初始和过滤后的数据
      currentPage: 1,
      pageSize: 10,
      pageDataBackups: [], //备份的全部数据
      system: "",
      noDataText: "请输入数据，将自动匹配结果！"
    };
  },
  methods: {
    changeFunc(val) {
      if (this.multiple) {
        this.$emit("update:modelval", val.join(","));
      } else {
        this.$emit("update:modelval", val);
      }

      this.dataAll.forEach(element => {
        if (element[this.viewdata[0].title] == val) {
          this.$emit("update:rowdata", element);
          this.$emit("change", element);
        }
      });
    },
    filterFunc(val) {
      this.currentPage = 1;
      if (!val) {
        this.dataAll = this.pagedata.length > 0 ? this.pagedata : [];
        this.noDataText = "请输入数据，将自动匹配结果！";
      } else {
        let dataAll = this.setpagedata();

        var viewdata = this.viewdata;

        var arr = [];
        dataAll.forEach(i => {
          var ifval = false;
          viewdata.forEach((e, k) => {
            if (k > 0) {
              if (
                i[e.field].toUpperCase().indexOf(val.toUpperCase()) >= 0 &&
                !e.noFilter
              ) {
                ifval = true;
              }
            }
          });

          if (ifval) {
            arr.push(i);
          }
        });
        this.dataAll = arr;
        if (val && arr.length == 0) {
          this.noDataText = "无相关匹配数据！";
        }
      }
    },
    visChange() {
      $(".mulSelPane-title")
        .parent(".el-scrollbar__view")
        .css("margin", "18px 0px 30px 0px");
    },
    focusFunc() {
      this.$emit("update:modelval", "");
      this.$emit("change", {});
    },
    optionDisabled(item) {
      //ready03 1是部门
      let area = this.area || this.$store.state.areaState;
      if (item && item.usr_name) {
        var usr_name =
          item.usr_name.indexOf("-") >= 0
            ? item.usr_name.split("-")[1]
            : item.usr_name;
        if (area == this.conditionalAreaForBuild) {
          return (
            (item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
            item.ready03 == 1 &&
            usr_name != "上海唯凯国际空运出口操作部" &&
            usr_name != "上海唯凯国际海外部" &&
            usr_name != "上海唯凯国际市场部" &&
            usr_name != "上海唯凯国际进口部" &&
            usr_name != "上海唯凯国际海运部" &&
            (this.pagetype == 8 || this.pagetype == 2 || this.pagetype == 3)
          );
        } else if (area == "市场部") {
          return (
            (item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
            item.ready03 == 1 &&
            usr_name != "上海唯凯国际空运出口部" &&
            usr_name != "上海唯凯国际进口部" &&
            usr_name != "上海唯凯国际海外部" &&
            (this.pagetype == 8 || this.pagetype == 2 || this.pagetype == 3)
          );
        } else if (area == "海外部") {
          return (
            (item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
            item.ready03 == 1 &&
            usr_name != "上海唯凯国际空运出口部" &&
            usr_name != "上海唯凯国际进口部" &&
            usr_name != "上海唯凯国际市场部" &&
            (this.pagetype == 8 || this.pagetype == 2 || this.pagetype == 3)
          );
        } else {
          return (
            ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
              item.ready03 == 1 &&
              (this.pagetype == 8 ||
                this.pagetype == 2 ||
                this.pagetype == 3)) ||
            usr_name == `唯凯国际物流股份有限公司${area}分公司`
          );
        }
      }
    },
    setpagedata() {
      var val = this.pagetype;
      if (val == -1) {
        return this.pagedata;
      }

      let infoname = "";
      if (val == 1) {
        infoname = "wtkh";
      }
      if (val == 2) {
        //应收
        infoname = "wtxm";
      }
      if (val == 3) {
        //应付
        infoname = "gysxm";
      }
      if (val == 4) {
        infoname = "jsxm";
      }
      if (val == 5) {
        infoname = "fwxm";
      }
      if (val == 6) {
        //始发港和目的港
        infoname = "hbinfo";
      }
      if (val == 7) {
        //
        infoname = "wtxmNoname";
      }
      if (val == 8) {
        //新增时候的委托客户
        infoname = "wtkhUseful";
      }
      if (val == 9) {
        //
        infoname = "comContact";
      }

      let pageDataBackups =
        JSON.parse(localStorage.getItem(infoname)) ||
        JSON.parse(sessionStorage.getItem(infoname)) ||
        getxmdata(infoname) ||
        [];

      let area = this.area || this.$store.state.areaState;

      if (val == 2) {
        pageDataBackups = pageDataBackups.filter(i => {
          i.usr_name = i.usr_name.split("-")[1];
          i.usr_code = i.usr_code.split("-")[0];
          if (i.usr_name !== "临时客户") {
            if (this.wtxmname && this.wtxmname.split("-")[0] != "电商") {
              return i.fid == this.fid && i.isbasic == 1;
            } else {
              return i.isbasic == 1 || i.id == this.modelval;
            }
          }
        });
      } else if (val == 3 || val == 4) {
        pageDataBackups = pageDataBackups.filter(i => {
          i.usr_name = i.usr_name.split("-")[1];
          i.usr_code = i.usr_code.split("-")[0];
          return (
            (i.area == -1 ||
              i.area == "全部" ||
              i.area.split(",").includes(area)) &&
            i.isbasic == 1
          );
        });
      }

      return pageDataBackups;
    }
  },
  computed: {
    dataArr: {
      //当前页显示的数据
      get() {
        return this.dataAll.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      }
    },
    usr_name() {
      let arr = [];
      for (let item of this.dataAll) {
        if (this.pageSelectValue.includes(item.id)) {
          arr.push(item.usr_name);
        }
      }
      return arr.join(",");
    }
  },
  created() {
    this.system = sessionStorage.system;
  },
  watch: {
    pagedata: {
      handler(val) {
        if (val) {
          if (this.pagetype == -1) {
            this.dataAll = val;
            if (val.length == 0) {
              this.$emit("update:modelval", "");
            }
          }
        }
      },
      immediate: true
    },
    modelval: {
      handler(val) {
        if (val && val != -1) {
          if (this.wtxmname && this.wtxmname.split("-")[1] == "临时客户") {
            this.pageSelectValue = "";
            this.dataAll = [];
          } else {
            if (this.multiple) {
              let valArr = String(val).split(",");
              // 如果option绑定的value是数字则需要把值转换回数字，否则select会变成未选中状态
              if (
                this.dataArr.length &&
                typeof this.dataArr[0][this.viewdata[0].title] === "number"
              ) {
                this.pageSelectValue = valArr.map(i => Number(i));
              } else {
                this.pageSelectValue = valArr;
              }
            } else {
              this.pageSelectValue = val;
            }
          }
        } else {
          this.pageSelectValue = "";
          this.dataAll = this.pagedata;
        }
      },
      immediate: true
    },
    pageSelectValue(val) {
      if (!val) {
        this.dataAll = this.pagedata.length > 0 ? this.pagedata : [];
      }
    },
    ifRefreshData() {
      this.dataAll = [];
    }
  }
};
</script>
<style lang="less" scoped>
.mulFlex {
  width: auto;
  min-width: 510px;
  display: flex;
  justify-content: space-between;
  span {
    flex: 1;
    text-align: center;
    min-width: 130px;
  }
  span:last-child {
    text-align: right;
  }
  span:first-child {
    text-align: left;
  }
  &::after {
    display: none;
  }
}
.mulSelPane-title {
  font-size: 14px;
  color: #333;
  position: absolute;
  top: 0px;
  background: #fff;
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  padding: 0px 20px;
}
</style>


