<template>
  <div
    class="pageSelect"
    v-bind:class="{
      noborder: type == 'inline',
      required: required != '',
    }"
    style="width: 100%; display: flex; align-items: center"
  >
    <span class="input_title" v-if="type == 'inline'" v-show="!titleVariable">{{
      title
    }}</span>
    <div v-if="titleVariable" style="width: 70px">
      <el-select v-model="titleSelf">
        <el-option
          v-for="item in titleOptions"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <el-select
      v-model.trim="value"
      filterable
      default-first-option
      clearable
      @clear="focusFunc"
      :pagetype="pagetype"
      @blur="changeFunction(triggerKey)"
      :placeholder="placeholder || (pagetype == '9' ? '联系人' : '请输入选择')"
      @change="changeFunc"
      :filter-method="filterFunc"
      @visible-change="visChange"
      style="flex: 1; min-width: 120px"
      class="mulSelPane"
      :disabled="disabled"
      size="mini"
      :no-data-text="noDataText"
    >
      <div class="mulSelPane-title mulFlex">
        <span
          v-for="(item, indexp) in viewdata"
          v-if="indexp > 0"
          :key="indexp + 'p'"
          >{{ item.title }}</span
        >
        <!-- <span>{{viewdata[1].title}}</span><span>{{viewdata[2].title}}</span> -->
      </div>
      <el-option
        v-for="(item, index) in dataArr"
        :key="item[viewdata[0].title] + item[viewdata[0].field] + index"
        :label="item[viewdata[0].field]"
        :value="item[viewdata[0].title]"
        :name="item[viewdata[0].title] + item[viewdata[0].field] + index"
        class="mulFlex"
      >
        <!--  :disabled="(system=='bo')&&(item.ready10=='唯凯'||item.iswecan=='唯凯')&&(pagetype==8)" -->
        <span
          v-for="(item2, indexv) in viewdata"
          v-if="indexv > 0"
          :key="indexv + 'v'"
          >{{ item[item2.field]
          }}<span v-if="item2.field == 'usr_name' && pagetype !== 1"
            >({{ item["comxz"] == "1" ? "客户" : "供应商" }})</span
          ></span
        >
        <!-- <span>{{ item[viewdata[1].field] }}</span>
                      <span style="color: #8492a6; font-size: 13px">{{ item[viewdata[2].field]  }}</span> -->
      </el-option>
      <div
        style="position: absolute; bottom: 0px; background: #fff; width: 100%"
      >
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="dataAll.length"
          >
          </el-pagination>
        </div>
      </div>
    </el-select>
    <slot name="other"> </slot>
  </div>
</template>
<script>
export default {
  props: {
    area: {
      type: String,
      default: "",
    },
    placeholder: String,
    title: String,
    servicecode: {
      //多个用逗号隔开
      type: String,
      default: "",
    },
    fid: {
      type: [String, Number],
      default: "",
    },
    wtxmname: {
      type: [String, Number],
      default: "",
    },
    ifRefreshData: {
      type: Boolean,
      default: false,
    },
    pagetype: {
      //可以直接选择的组件类型 1委托客户(公司) 2 委托项目 ，3供应商项目  4.结算项目  指定类型之后不用传pagedata
      type: [Number, String],
      default: -1,
    },
    pagedata: {
      //传入的分页数据
      type: Array,
      default: () => [],
    },
    wageinout: {
      type: [Number, String],
      default: "",
    },
    type: {
      // 默认样式
      //"default"左输入框标题右el-select
      //"inline" 标题内嵌在边框内部去掉了el-input__inner的边框改到pageselect外部
      type: [String],
      default: () => "default",
    },
    required: {
      //传任何字符串都为必须将更改背景色
      type: String,
      default: () => "",
    },

    //标题可变
    titleVariable: {
      type: Boolean,
      defalut: () => false,
    },
    titleOptions: {
      type: Array,
      default: () => {
        return [{ value: "直达" }, { value: "中转" }];
      },
    },
    //是否禁用选项
    disabled:{
      type:Boolean,
      default:()=> false
    },
    changeFunction: {
      type: Function,
      default: () => {
        return (function () {})();
      },
    },
    triggerKey: {
      type: [String, Number], //触发索引或者key 和changeFunction一起传入
      default: () => {
        return 0;
      },
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
            { title: "服务项目代码", field: "s_code" },
          ];
        } else if (this.pagetype == 6) {
          if (sessionStorage.system == "outside") {
            //外网取的字段是首字母小写
            return [
              { title: "threeCode", field: "threeCode" }, //配置绑定label 和 value 字段名
              { title: "三字代码", field: "threeCode" },
              { title: "英文全称", field: "ready01", noFilter: true }, //noFilter 是否作为过滤的字段，true为不过滤
            ];
          } else {
            return [
              { title: "ThreeCode", field: "ThreeCode" }, //配置绑定label 和 value 字段名
              { title: "三字代码", field: "ThreeCode" },
              { title: "英文全称", field: "Ready01", noFilter: true }, //noFilter 是否作为过滤的字段，true为不过滤
            ];
          }
        } else if (this.pagetype == 9) {
          return [
            { title: "jobname", field: "jobname" }, //配置绑定label 和 value 字段名
            { title: "联系人", field: "jobname" },
            { title: "部门", field: "department" },
            { title: "区域", field: "area" }, //noFilter 是否作为过滤的字段，true为不过滤
          ];
        } else if (this.pagetype == 110) {
          return [
            { title: "TwoCode", field: "TwoCode" }, //配置绑定label 和 value 字段名
            { title: "二字码", field: "TwoCode" },
          ];
        } else {
          return [
            { title: "id", field: "usr_name" }, //配置绑定label 和 value 字段名
            { title: "名称", field: "usr_name" }, //显示两列的名字与字段名
            { title: "代码", field: "usr_code" },
          ];
        }
      },
    },
    modelval: [Number, String], //传入的值
    rowdata: Object, //返回选中的行的值

    sytype: {
      type: Boolean,
      default: false,
    },
    cShow: {
      //c类
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      value: "",
      titleSelf:this.title,
      dataAll: [], //初始和过滤后的数据
      currentPage: 1,
      pageSize: 10,
      pageDataBackups: [], //备份的全部数据
      system: "",
      noDataText: "请输入数据，将自动匹配结果！",
    };
  },
  methods: {
    blurFunc(e) {
      //   console.log(e)
      // $(e.target).parent('div[id]').find('input').focus()
      //  $(e.target).css('color','red')
      //  $(e.target).parents('div[id]').eq(0).css('border','1px solid red')
      // $(e.target).parents('div[id]').eq(0).next('div[id]').find('input').focus()
    },
    changeFunc(val) {
      this.dataAll.forEach((element) => {
        if (element[this.viewdata[0].title] == val) {
          this.$emit("update:rowdata", element);
          this.$emit("update:modelval", val);
          this.$emit("change", element);
        }
      });
    },

    filterFunc(val) {
      this.currentPage = 1;

      if (!val) {
        //console.log(val)
        this.dataAll = this.pagedata.length > 0 ? this.pagedata : [];
        this.noDataText = "请输入数据，将自动匹配结果！";
      } else {
        let dataAll = this.setpagedata;
        //console.log(val)
        let viewdata = JSON.parse(JSON.stringify(this.viewdata));
        // alert(viewdata)
        let arr = [];
        // console.log(viewdata)
        // console.log(dataAll)
        dataAll.forEach((i, L) => {
          let ifval = false;
          viewdata.forEach((e, k) => {
            if (k > 0) {
              //  console.log(e.noFilter)
              if (!i[e.field]) {
                // console.log(i)
              }
              let text = i[e.field] || "";
              //||PinyinMatch.match(text, val)   可以通过中文字母匹配
              // if(PinyinMatch.match(text, val)&&PinyinMatch.match(text, val).length>0){
              //   console.log(L)
              //   console.log(i)
              // }
              if (
                (text.toUpperCase().indexOf(val.trim().toUpperCase()) >= 0 ||
                  !!PinyinMatch.match(text, val)) &&
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
        //console.log(arr)
        this.dataAll = arr;
        if (val && arr.length == 0) {
          this.noDataText = "无相关匹配数据！";
        }
      }
    },

    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
    },
    visChange() {
      $(".mulSelPane-title")
        .parent(".el-scrollbar__view")
        .css("margin", "18px 0px 30px 0px");
    },
    focusFunc() {
      //  this.value=""
      this.$emit("update:modelval", "");
      this.$emit("change", {});
    },
    optionDisabled(item) {
      //ready03 1是部门
      let area = this.area || this.$store.state.areaState;

      if (item && item.usr_name) {
        /*      console.log(this.pagetype)
               console.log(area)
               console.log(item) */
        var usr_name =
          item.usr_name.indexOf("-") >= 0
            ? item.usr_name.split("-")[1]
            : item.usr_name;
        if (!this.sytype) {
          if (area == "上海") {
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                usr_name != "上海唯凯国际空运出口操作部" &&
                usr_name != "唯凯国际物流股份有限公司海外部" &&
                usr_name != "唯凯国际物流股份有限公司市场部" &&
                usr_name != "上海唯凯国际进口部" &&
                usr_name != "唯凯国际物流股份有限公司大客户部" &&
                usr_name != "唯凯国际物流股份有限公司合肥办" &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == "唯凯国际物流股份有限公司" ||
              usr_name.includes("临时客户")
            );
          } else if (area == "市场部") {
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                usr_name != "上海唯凯国际空运出口部" &&
                usr_name != "上海唯凯国际进口部" &&
                usr_name != "唯凯国际物流股份有限公司海外部" &&
                usr_name != "唯凯国际物流股份有限公司大客户部" &&
                usr_name != "唯凯国际物流股份有限公司合肥办" &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == "唯凯国际物流股份有限公司" ||
              usr_name.includes("临时客户")
            );
          } else if (area == "海外部") {
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                usr_name != "上海唯凯国际空运出口部" &&
                usr_name != "上海唯凯国际进口部" &&
                usr_name != "唯凯国际物流股份有限公司市场部" &&
                usr_name != "上海唯凯国际海运部" &&
                usr_name != "唯凯国际物流股份有限公司大客户部" &&
                usr_name != "唯凯国际物流股份有限公司合肥办" &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == "唯凯国际物流股份有限公司" ||
              usr_name.includes("临时客户")
            );
          } else if (area == "合肥") {
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                usr_name != "上海唯凯国际空运出口部" &&
                usr_name != "上海唯凯国际进口部" &&
                usr_name != "唯凯国际物流股份有限公司海外部" &&
                usr_name != "唯凯国际物流股份有限公司市场部" &&
                usr_name != "唯凯国际物流股份有限公司大客户部" &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == "唯凯国际物流股份有限公司" ||
              usr_name.includes("临时客户")
            );
          } else if (area == "大客户部") {
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                usr_name != "上海唯凯国际空运出口部" &&
                usr_name != "上海唯凯国际进口部" &&
                usr_name != "唯凯国际物流股份有限公司海外部" &&
                usr_name != "唯凯国际物流股份有限公司市场部" &&
                usr_name != "唯凯国际物流股份有限公司合肥办" &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == "唯凯国际物流股份有限公司" ||
              usr_name.includes("临时客户")
            );
          } else {
            //  console.log( ((item.ready10=='唯凯'||item.iswecan=='唯凯')&&item.ready03==1)&&(this.pagetype==8||this.pagetype==2||this.pagetype==3)||usr_name==`唯凯国际物流股份有限公司${area}分公司`||usr_name.includes('临时客户'))
            return (
              ((item.ready10 == "唯凯" || item.iswecan == "唯凯") &&
                item.ready03 == 1 &&
                (this.pagetype == 8 ||
                  this.pagetype == 2 ||
                  this.pagetype == 3)) ||
              usr_name == `唯凯国际物流股份有限公司${area}分公司` ||
              usr_name.includes("临时客户")
            );
          }
        } else {
          return item.ready10 == "唯凯" || item.iswecan == "唯凯";
        }
      } else if (
        this.servicecode == "航线应收" ||
        this.servicecode == "航线应付"
      ) {
        return (
          item.s_name == "航司运费" ||
          item.s_name == "航司战争附加费" ||
          item.s_name == "航司燃油附加费"
        );
      }
    },
  },
  computed: {
    dataArr: {
      //当前页显示的数据
      get() {
        return this.dataAll.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      },
      set() {},
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
      if (val == 21) {
        infoname = "wtxmBasic";
      }
      if (val == 3) {
        //有效的供应商项目,用于新增
        infoname = "gysxmUseful";
      }

      if (val == 31) {
        //供应商项目全部   usr_status=  1有效 2无效
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
        infoname = "comContact";
      } else if (val == 10) {
        infoname = "xmdata";
      } else if (val == 11) {
        infoname = "serviceData";
      } else if (val == 12) {
        infoname = "wtkhData";
      } else if (val == 13) {
        infoname = "tzxm";
      }
      if (val == 110) {
        infoname = "airinfo";
      }

      let pageDataBackups =
        JSON.parse(localStorage.getItem(infoname)) ||
        JSON.parse(sessionStorage.getItem(infoname)) ||
        getxmdata(infoname) ||
        [];

      let area = this.area || this.$store.state.areaState;
      /* if(area=='市场部'||area=='海外部'){
         area='香港'
        } */
      /*  var filarea=function(i){
                  let areaArr=i.area.split(',')
                 return (i.area==-1||i.area=='全部')||((area=='市场部'||area=='海外部')?(areaArr.includes('市场部')||areaArr.includes('海外部')||areaArr.includes('香港')):areaArr.includes(area))
         } */
      if (val == 2) {
        pageDataBackups = pageDataBackups.filter((i) => {
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
        pageDataBackups = pageDataBackups.filter((i) => {
          i.usr_name = i.usr_name.split("-")[1];
          i.usr_code = i.usr_code.split("-")[0];
          return (
            (i.area == -1 ||
              i.area == "全部" ||
              i.area.split(",").includes(area)) &&
            i.isbasic == 1 &&
            i.usr_name &&
            !i.usr_name.includes("上海唯凯国际空运出口部")
          );
        });
      } else if (val == 5) {
        if (this.servicecode == "航线应收") {
          pageDataBackups = pageDataBackups.filter((i) => {
            return [
              "航司运费",
              "航司战争附加费",
              "航司燃油附加费",
              "航司中转费",
              "小货操作费",
              "更改费",
              "TACT地面服务费",
              "拆板费",
              "空仓费",
              "纸质运单费",
              "锂电池操作费",
              "货站地面费",
            ].includes(i.s_name);
          });
        } else if (this.servicecode == "航线应付") {
          pageDataBackups = pageDataBackups.filter((i) => {
            return (
              i.servicecode == "OA0010" ||
              [
                "航司总单信息费",
                "航司分单信息费",
                "总单制单费",
                "拆板费",
                "空仓费",
                "纸质运单费",
                "锂电池操作费",
                "货站地面费",
              ].includes(i.s_name)
            );
          });
        } else {
          pageDataBackups = pageDataBackups.filter((i) => {
            //付款买单(一般情况C类):不过滤预付航司运费|预付杂费
            if (!this.cShow) {
              return i.servicecode;
              //非付款买单(一般情况A类|B类):过滤预付航司运费|预付杂费
            } else {
              return (
                i.s_name != "预付航司运费" &&
                i.s_name != "预付杂费" &&
                i.servicecode
              );
            }
          });
          return pageDataBackups;
        }
      } else if (val == 6) {
        if (this.servicecode) {
          pageDataBackups = pageDataBackups.filter((i) => {
            return this.servicecode.split(",").includes(i.ThreeCode);
          });
        }
      } else if (val == 10) {
        pageDataBackups = pageDataBackups.filter((i) => {
          i.usr_name = i.usr_name.split("-")[1];
          i.usr_code = i.usr_code.split("-")[0];
          return (
            (i.area == -1 || i.area.split(",").includes(area)) &&
            i.usr_status == 1 &&
            i.customxz == 1 &&
            i.isbasic == 1 &&
            i.comxz == 1
          );
        });
      } else if (val == 11) {
        pageDataBackups = pageDataBackups.filter((service) => {
          return service.dom === "总单";
        });
      } else if (val == 13) {
        if (this.wageinout) {
          return pageDataBackups.filter((i) => {
            return i.comxz == this.wageinout;
          });
        }
      } else {
      }
      //全局过滤掉“上海唯凯国际空运出口部”
      return pageDataBackups;
    },
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
      immediate: true,
    },
    pagetype: {
      handler(val) {},
      immediate: true,
    },
    modelval: {
      handler(val) {
        if (val && val != -1) {
          this.dataAll = this.setpagedata.filter((i) => {
            return i[this.viewdata[0].title] == val;
          });

          if (this.dataAll.length == 0) {
            if (this.wtxmname && this.wtxmname.split("-")[1] != "临时客户") {
              this.value = this.Errorname;
              this.dataAll = [];
            } else {
              this.value = "";
              this.dataAll = [];
            }
          } else {
            if (this.Errorname && this.wtxmname.split("-")[1] == "临时客户") {
              this.value = "";
              this.dataAll = [];
            } else {
              this.value = val;
            }
          }
        } else {
          this.value = "";
          this.dataAll = this.pagedata;
        }
      },
      immediate: true,
    },
    value(val) {
      if (!val) {
        //  console.log(val)
        this.dataAll = this.pagedata.length > 0 ? this.pagedata : [];
      }
    },
    ifRefreshData() {
      this.dataAll = [];
    },
    wageinout: {
      handler(val) {
        if (val) {
          this.dataAll = this.setpagedata.filter((i) => {
            return i.comxz == val;
          });
          this.$emit("update:modelval", "");
        }
      },
      immediate: true,
    },
    titleSelf:{
      handler(val){
        this.$emit("update:title",val)
        console.log(this.disabled)
      }
    },
    disabled:{
      handler(val){
        console.log(val)
      }
    }
  },
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
.input_title {
  padding: 5px;
}
.required {
  background: #fffcf0;
}
</style>
<style>
.pageSelect {
  /* width:100% !important; */
}
/*隐藏 el-input__inner边框 改造原控件样式*/
.pageSelect.noborder .el-input__inner {
  border: 0 !important;
}
.pageSelect.noborder {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-input__inner {
  background-color: transparent !important;
}
</style>