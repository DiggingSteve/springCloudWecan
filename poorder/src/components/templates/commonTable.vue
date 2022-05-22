<template>
  <div>
    <h4 v-if="title" :style="titleStyle">{{ title }}</h4>
    <div v-scroll="onScroll" class="tablebox" :style="divStyle">
      <slot name="content"></slot>
      <div
        v-if="showHead && position.scrollTop > 0 && isMultiSelect"
        class="fixedCheckbox MultiSelectCheckbox"
      >
        <el-checkbox v-model="multiSelect"></el-checkbox>
      </div>
      <table style="width:100%;text-align:center;box-sizing:border-box">
        <!-- 表头 -->
        <tr v-show="showHead" :style="transform">
          <th v-if="isMultiSelect" class="MultiSelectCheckbox">
            <!-- <input type="checkbox" id="checkbox" v-model="multiSelect"> -->
            <el-checkbox v-model="multiSelect"></el-checkbox>
            <slot name="bohuiAll"></slot>
            <slot name="chat"></slot>
          </th>
          <th v-if="isRadioSelect"></th>

          <th
            v-for="(item, k) in head"
            :style="[
              { width: item.field == 'dwageall' ? '120px' : item.width || '' },
              item.style
            ]"
            style="width:80px!important;font-weight:normal"
            :class="item.field"
            v-if="!item.hidden"
            :key="k"
          >
            <template v-if="item.field != 'checkbox'">
              <slot
                :name="item.field + 'Th'"
                :data="{ value: item.title, row: item }"
              >
                <span v-html="item.title" class="title"></span>

                <span class="sortWrap" v-if="item.sort">
                  <i>
                    <i
                      class="sort-ascend"
                      @click.stop="
                        tableSort(item.field, 1, $event, '.sort-descend')
                      "
                    ></i>
                    <i
                      class="sort-descend"
                      @click.stop="
                        tableSort(item.field, 2, $event, '.sort-ascend')
                      "
                    ></i>
                  </i>
                </span>
              </slot>
            </template>
            <template v-else style="position:relative">
              <el-checkbox
                @change="allChoice"
                v-model="checkorno"
                :disabled="item.disabled"
                style="width:30px;"
              >
              </el-checkbox>
            </template>
          </th>
        </tr>
        
        <tr v-if="tableData && tableData.length === 0 && emptyText">
          <td colspan="100">{{ emptyText }}</td>
        </tr>

        <tr v-if="putIndex >= 0 && firstTdShow">
          <td colspan="100">
            <!-- <el-input :disabled="true"></el-input> -->
            请在原有的条目上进行修改并保存。
          </td>
        </tr>
        <tr v-if="putIndex == -1 && firstTdShow">
          <slot name="firstTd"></slot>
        </tr>

        <tr v-if="tableNData.length == 0">
          <td colspan="100">
            暂无数据
          </td>
        </tr>

        <!--  表格数据 -->
        <template v-for="(row, index) in tableNData">
          <tr
            :key="index"
            v-if="!row.hidden"
            :draggable="draggable"
            v-mydrag
            :id="row.id"
            v-show="
              (putIndex != index && !row.thisListHide && !name) ||
                (row.isdel != '2' && name)
            "
            :class="[
              { bgColor: colorIndex == index && wagetype == row.wageinout },
              rowClassName ? rowClassName({ row, index }) : {}
            ]"
            :title="
              row.adddate && row.addman
                ? '创建人:' + row.addman + ',创建时间:' + row.adddate
                : ''
            "
            :style="{
              background: row.background ? row.background : '',
              fontWeight: row.fontWeight ? row.fontWeight : '',
              height: row.height ? row.height : ''
            }"
            :indexKey="index"
          >
            <td
              v-if="isMultiSelect"
              class="MultiSelectCheckbox"
              :style="row.style"
            >
              <!-- 选择框 -->
              <el-checkbox
                v-model="row['checked']"
                @change="
                  $emit('multiSelectChange', {
                    row,
                    index: paginationShow
                      ? (currentPage2 - 1) * pageSize2 + index
                      : index
                  })
                "
                :disabled="row['checkboxdisable']"
              ></el-checkbox>
              <!-- 删除费用明细 -->

              <slot name="delete" :data="{ row }"></slot>
              <slot name="bohui" :data="{ index: index, row: row }"></slot>
              <slot name="note" :data="{ row }"></slot>
            </td>
            <th v-if="isRadioSelect" style="padding:0 8px">
              <input
                v-model="row['checked']"
                :value="true"
                type="radio"
                name="radio"
                @click="radioFunc(index)"
                v-if="!row['isSeat']"
              />
            </th>

            <td
              v-for="item in head"
              :class="[item.field, row.isSeat ? 'isSeatTd' : '']"
              :key="item.id"
              v-if="!item.hidden"
              :style="[
                row.style,
                item.style,
                item.tdStyleFunc && item.tdStyleFunc(row[item.field]),
                {
                  display: item.field == 'operate' && row.rowHide ? 'none' : ''
                }
              ]"
              :rowspan="item.field == 'operate' ? row.rowspan : ''"
            >
              <!-- 航线综合查询签单表格 -->
              <!--   <slot name="iconplus" :data="{index:index}" v-if="row[item.field]=='实际'">
                
              </slot> -->
              <slot
                v-if="
                  !row.isSeat ||
                    (row.showField && row.showField.includes(item.field))
                "
                :name="item.field"
                :data="{
                  value: row[item.field],
                  index: paginationShow
                    ? (currentPage2 - 1) * pageSize2 + index
                    : index,
                  disabled: row.disabled,
                  firstParentIndex: row.firstParentIndex,
                  indexAll: row.indexAll,
                  row: row
                }"
              >
                <span v-if="item.field == 'hawb' && row[item.field]">{{
                  row[item.field].indexOf(",") != "-1"
                    ? row[item.field].split(",")[0] +
                      (row[item.field].split(",")[1] ? "," : "") +
                      (row[item.field].split(",")[1]
                        ? row[item.field].split(",")[1]
                        : "") +
                      (row[item.field].split(",")[2] ? "," : "") +
                      (row[item.field].split(",")[2]
                        ? row[item.field].split(",")[2]
                        : "")
                    : row[item.field]
                }}</span>
                <span
                  v-else-if="item.field == 'remark'"
                  :title="row[item.field]"
                >
                  {{ row[item.field] || emptyCellText }}
                </span>
                <span v-else-if="item.field == 'confirmBill'">
                  {{
                    row["isbill"] == "1"
                      ? "已对账"
                      : row["isbill"] == "10"
                      ? "已开票"
                      : row["confirmstatus"] == "未确认" ||
                        row["confirmstatus"] == "1"
                      ? "未确认"
                      : "已确认"
                  }}
                </span>
                <span
                  v-else
                  v-html="
                    item.formatType
                      ? formatFunc(row[item.field], item, row)
                      : row[item.field] || row[item.field] == 0
                      ? row[item.field]
                      : emptyCellText
                  "
                >
                </span>
              </slot>

              <!-- 如果是占位行，赋空 -->
              <slot v-else>
                <span>&nbsp;</span>
              </slot>
            </td>
          </tr>
          <tr v-if="putIndex == index">
            <slot name="firstTd"></slot>
          </tr>
          <tr
            v-if="
              (ziIndex == index ||
                showAllZiTable ||
                showZiIndex.includes(index)) &&
                !row.isSeat &&
                !row.ziTableHidden
            "
          >
            <td colspan="100" style="padding:0px;border:0px" class="zitable">
              <slot name="ziTable" :data="{ row: row }"></slot>
            </td>
          </tr>
        </template>
      </table>

      <el-pagination
        style="margin-top:10px;"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="currentPage2"
        :page-sizes="[10, 15, 20]"
        :page-size="pageSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        v-if="paginationShow"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDate } from "../../api/localStorage.js";
import { searchCmptMixins } from "@/components/mixins/topPageMixin";
//row 的自定义字段，isSeat：true表明是占位行；ziTableHidden：true;没有子表格;showField:['operate'];当此行为占位行时仍显示的字段
//注意 thisListHide 为true是隐藏当前行

//表头中可以配置,hidden，隐藏当前列； style,列的样式 ；方法
// { title: "创建时间", field: "adddate",formatType:1,format:'yyyy-MM-dd hh:mm' },
// { title: "免", field: "isfree",formatType:2,format:(x=>x==2?'是':'否')},格式化显示数据
// { title: "状态", field: "status",formatType:2,format:x=>setBhiconColor(x,2),tdStyleFunc:(x=>x==500?{color:'green'}:{color:'red'})},动态设置单元格文字颜色
// { title: "RMB金额", field: "wageall",formatType:2,format:x=>Number(x).toFixed(4)},
// { title: "结算对象", field: "gid" ,formatType:4,format:row=>row.settname},//实际显示的是settname字段

export default {
  props: {
    head: Array,
    tableData: Array,
    title: String,
    titleStyle: String,
    tableIndex: Number,
    putIndex: {
      //如果不是-1，那么就在当前行修改
      type: [Number, String],
      default: -1
    },
    colorIndex: {
      //修改当前行的时候改变颜色
      type: [Number, String],
      default: -1
    },
    divStyle: [String, Object],
    ziIndex: {
      //打开子表格的索引
      type: Number,
      default: -1
    },
    showZiIndex: {
      //打开多个子表格索引
      type: Array,
      default: () => []
    },
    paginationShow: {
      //是否分页
      type: Boolean,
      default: false
    },
    firstTdShow: {
      //是否显示操作行,无需新增的时候隐藏编辑行
      type: Boolean,
      default: true
    },
    checkValue: Object,
    isMultiSelect: {
      //是否有多选
      type: Boolean,
      default: false
    },
    allchecked: {
      //是否全选
      type: Boolean,
      default: false
    },
    isRadioSelect: {
      //是否有单选
      type: Boolean,
      default: false
    },
    showHead: {
      //是否
      type: Boolean,
      default: true
    },
    wagetype: {
      type: [Number, String]
    },
    name: {
      type: [Number, String]
    },
    showAllZiTable: {
      //是否显示全部子表格
      type: Boolean,
      default: false
    },
    rowClassName: Function, // 行的 className 的回调方法  Function({row, index})
    defaultSelectRowIndex: [Number, String],
    emptyText: String, // 空数据时显示的文本内容
    emptyCellText: {
      //单元格为空时
      type: String,
      default: () => "--"
    },
    stripe: {
      //隔行换色
      type: Boolean,
      default: () => true
    },
    draggable: {
      //表格行tr 是否可以拖动
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      position: { scrollTop: "0px", scrollLeft: "0px" },
      currentPage2: 1,
      pageSize2: 10,
      tableNData: [],
      checkorno: false
      //totalItems2:0
    };
  },
  methods: {
    formatFunc(value, item, row) {
      //格式化显示数据,value 单元格数据；item 配置的th；row,行数据
      //formatType 转换格式类型 1格式化时间 formatType:1,format:'yyyy-MM-dd'
      //2 执行传入的转换函数   如{title:"是否我司仓库",field:"isstore_inspect ",formatType:2,format:(x=>x==1?'是':'否')},
      //取groupid里面的value或label
      //3 结算对象取中文名
      //4 当需要用到其它单元格字段时，如当前单元格显示的是其它字段或者需要多个值拼接时,参数传入行数据

      if (item.formatType == 1) {
        //  console.log(value,item.format)
        return formatDate(value, item.format) || this.emptyCellText;
      }
      if (item.formatType == 2) {
        return item.format(value) || this.emptyCellText;
      }

      if (item.formatType == 3) {
        //结算对象取中文名
        //  let arr= getxmdata('xmdata').filter(i=>i.id==value)||[]
        let arr = this.xmdata.filter(i => i.id == value) || [];
        if (arr.length) {
          return arr[0].usr_name.split("-")[1];
        }
      }

      if (item.formatType == 4) {
        return item.format(row) || this.emptyCellText;
      }

      if (item.formatType == 5) {
        //供应商项目取中文名
        let arr = this.gysxm.filter(i => i.id == value) || [];
        if (arr.length) {
          return arr[0].usr_name.split("-")[1];
        }
      }
      return value || this.emptyCellText;
    },
    onScroll: function(e, position) {
      this.position = position;
      /*  this.position.scrollTop=e.srcElement.scrollTop
                 this.position.scrollLeft=e.srcElement.scrollLeft */
      if ($(".jsxmField").eq(this.tableIndex).length > 0) {
        $(".jsxmField")
          .eq(this.tableIndex)
          .hide();
        $(".jsxmField")
          .eq(this.tableIndex)
          .css("left", "-" + e.srcElement.scrollLeft + "px");
      }

      if ($(".fwxmField").eq(this.tableIndex).length > 0) {
        $(".fwxmField")
          .eq(this.tableIndex)
          .hide();
        $(".fwxmField")
          .eq(this.tableIndex)
          .css("left", "-" + e.srcElement.scrollLeft + "px");
      }
    },

    handleSizeChange2(val) {
      this.pageSize2 = val;
      if (this.paginationShow) {
        if (this.tableData && this.tableData.length > 0) {
          this.tableNData = this.tableData.slice(
            (this.currentPage2 - 1) * val,
            val * this.currentPage2
          );
        } else {
          this.tableNData = [];
        }
      }
    },

    handleCurrentChange2(val) {
      this.currentPage2 = val;
      if (this.paginationShow) {
        if (this.tableData && this.tableData.length > 0) {
          this.tableNData = this.tableData.slice(
            (val - 1) * this.pageSize2,
            this.pageSize2 * val
          );
        } else {
          this.tableNData = [];
        }
      }
    },

    allChoice() {
      if (
        this.checkValue.checkvalue.length == this.checkValue.length &&
        this.checkValue.checkvalue.length != 0
      ) {
        this.$emit("checkboxall", {
          source: this.checkValue.source,
          checkvalue: []
        });
      } else {
        this.checkValue.checkvalue = [];
        this.tableData.forEach((item, index) => {
          this.checkValue.checkvalue.push(index);
        });
        this.$emit("checkboxall", {
          source: this.checkValue.source,
          checkvalue: this.checkValue.checkvalue
        });
      }
    },

    radioFunc(index) {
      this.tableData.forEach(i => {
        i.checked = false;
      });
      this.tableData[index].checked = true;
      this.$emit("current-change", index);
    },

    tableSort(field, type, event, el2) {
      //this.ziTableIndex = -1;
      // alert(field)
      if (this.tableData.filter(i => i.checked).length) {
        return;
      }

      this.tableData.sort(this.sortBy(field, type));
      var el = event.currentTarget;
      setTimeout(() => {
        $(el).addClass("sort-check");
        $(el2).removeClass("sort-check");
      }, 0);
    },
    sortBy: function(name, type) {
      return function(o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[name];
          b = p[name];
          if (a === b) {
            return 0;
          }
          if (typeof a === typeof b) {
            if (type === 1) {
              return a < b ? -1 : 1;
            } else {
              return a > b ? -1 : 1;
            }
          }
          if (type == 1) {
            return typeof a < typeof b ? -1 : 1;
          } else {
            return typeof a > typeof b ? -1 : 1;
          }
        } else {
          throw "error";
        }
      };
    }
  },
  mounted(){
    console.log(this.head)
    console.log(this.tableIndex)
    console.log(this.tableNData)

  },

  computed: {
    transform() {
      //固定头部
      return this.position.scrollTop > 0
        ? {
            transform: `translateY(${this.position.scrollTop}px)`,
            "box-shadow": "rgba(0, 0, 0, 0.9) -12px 0px 12px 0px"
          }
        : "";
    },
    multiSelect: {
      get() {
        let n = 0;
        if (!this.tableData) return false;
        this.tableData.forEach(el => {
          if (el.checked) {
            n++;
          }
        });

        return (
          n == this.tableData.filter(i => !i.checkboxdisable).length &&
          this.tableData.filter(i => !i.checkboxdisable).length > 0
        );
      },
      set(val) {
        console.log(val);
        this.tableData.forEach(i => {
          if (!i.thisListHide && !i.hidden && !i.checkboxdisable) {
            i.checked = val;
          }
        });
        this.$emit("multiSelectCheckAll", val);
      }
    },
    gysxm() {
      return getxmdata("gysxm");
    },
    xmdata() {
      return getxmdata("xmdata");
    }
  },
  watch: {
    tableData: {
      handler(val) {
        if (!val) {
          val = [];
        }
        if (this.isMultiSelect || this.isRadioSelect) {
          val.forEach((item, index) => {
            if (this.allchecked && !item.checkboxdisable) {
              this.$set(item, "checked", true);
              this.$emit("multiSelectCheckAll", true);
            } else if (
              (!item.checkboxdisable && index == this.defaultSelectRowIndex) ||
              item.defaultChecked
            ) {
              //defaultChecked 设置默认选中
              this.$set(item, "checked", true);
              this.$emit("multiSelectChange", { row: item, index });
            } else {
              if (!item["checked"]) {
                this.$set(item, "checked", false);
              } else {
                this.$set(item, "checked", item["checked"]);
              }
            }
          });
        }
        $(".sort-check").removeClass("sort-check");

        this.tableNData = val;
        if (this.paginationShow) {
          this.handleSizeChange2(this.pageSize2);
        }
      },
      immediate: true
    },
    checkValue: {
      handler(newValue) {
        if (newValue) {
          if (
            newValue.checkvalue.length == this.checkValue.length &&
            this.checkValue.length != 0
          ) {
            this.checkorno = true;
          } else {
            this.checkorno = false;
          }
        }
      },
      immediate: true
    }
  },
};
</script>

<style lang="less" scoped>
@border: 1px solid #e8e8e8;

h4 {
  border: 1px solid #e8e8e8;
  border-bottom: none;
  padding: 6px;
  background-color: #f8f8f8;
  color: #333;
}

.fixedCheckbox {
  height: 30px;
  position: absolute;
  margin-top: 1px;
  margin-left: 1px;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.MultiSelectCheckbox {
  padding: 0px 8px;
  width: 40px;
}

.tablebox {
  width: 100%;
  overflow: auto;
  pointer-events: auto;
  padding-bottom: 1px;
}

.stripe tr:nth-child(even) {
  background: #f8f8f8;
}

.stripe tr:nth-child(odd) {
  background: #fff;
}

tr {
  color: #333;
  // font-size: 12px;
}

td,
th {
  height: 32px;
  line-height: 28px;
  font-size: 12px;
  min-width: 30px;
  border: @border;
  text-align: center;
  padding: 0px;
  white-space: nowrap;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;

  span {
    padding: 0 6px;
  }

  span.title {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  > div {
    padding: 0 6px;
  }

  .el-checkbox {
    /deep/.el-checkbox__label {
      display: none !important;
    }
  }
}

th {
  background: #fff;
}

td {
  // border-bottom: none;
}

tr:last-child {
  td {
    border-bottom: @border;
  }
}

.bgColor {
  background-color: #f56c6c !important;
  color: #fff;

  td {
    border: 1px solid #f56c6c;
  }
}

.operate {
  // text-align:left;
  // padding-left:6px;
}

td i {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 6px;
  font-size: 16px;
  cursor: pointer;
}

.invoiceItems {
  width: 180px;
}

.settlement-table {
  table {
    td.price {
      width: 120px !important;
    }

    td.num {
      width: 120px !important;
    }
  }
}

.zitable th {
  border-top: 0px !important;
}

.zitable > div {
  padding: 0px;
}

.isSeatTd {
  //  border-right:none;
  //  border-left:none;
  border-top: 1px solid #fff;
  // border-bottom: 1px solid #fff;
}

// .isSeatTd:first-child{
// border-left: @border;
// }
// .isSeatTd:last-child{
// border-right: @border;
// }

table tr:last-child {
  td.isSeatTd {
    border-bottom: @border;
  }
}

.zitable {
  /deep/ th {
    color: #444;
    font-size: 12px;
  }

  /deep/ td {
    color: #444;
    font-size: 12px;
  }

  /deep/ th:last-child {
    border-right: @border;
  }

  /deep/ td:last-child {
    border-right: @border;
  }

  /deep/ th:first-child {
    border-left: @border;
  }

  /deep/ td:first-child {
    border-left: @border;
  }
}

.sortWrap {
  display: inline-block;
  height: 32px;
  margin-left: 5px;
  /*   vertical-align:baseline;
  height: 18px!important;
  overflow: hidden; */
}

.sortWrap > i {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.sort-ascend {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 6px solid #c0c4cc;
  cursor: pointer;
}

.sort-descend {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #c0c4cc;
  cursor: pointer;
  margin-top: 3px;
}

.sort-check {
  border-bottom-color: #409eff;
  border-top-color: #409eff;
}
</style>
