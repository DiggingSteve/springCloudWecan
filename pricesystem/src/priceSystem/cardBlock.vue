<template>
  <div>
    <div class="head-wrap">
      <div class="seed-wrap" v-if="hasSeed">
        以单价<input
          type="input"
          class="seed-input"
          v-model="seed"
          @focus="seed = ''"
        />
        为基础
        <span
          style="color: #0f5a8c; cursor: pointer"
          @click="handleSeed('increase')"
          >递增</span
        >/
        <span
          style="color: #0f5a8c; cursor: pointer"
          @click="handleSeed('decrease')"
          >递减</span
        >/
        <span
          style="color: #0f5a8c; cursor: pointer"
          @click="handleSeed('copy')"
          >复制</span
        >
      </div>
    </div>
    <div class="card-wrap">
      <div
        v-for="(item, index) in dataArr"
        v-if="
          item.title != 'MIN' && (item.isSameAsBase == false || item.isDefault)
        "
        v-show="item.isAdd || item.isSelect"
        class="card"
        v-bind:class="{ active: index == indexSelf ? true : false }"
      >
        <div
          class="row title"
          style="justify-content:center"
          v-bind:class="{ active: index == indexSelf ? true : false }"
        >
          <span>{{ item.code }}</span>
        </div>
        <div
          class="row content"
          v-show="hasContent"
          v-bind:class="{ ban: index == indexSelf ? true : false }"
        >
          <div class="item65" style="padding-left:26px">
            <input
              v-model="item.diff"
              type="input"
              style="line-height:30px"
              v-bind:class="{
                ban:
                  (isNeedBan && indexSelf < 0) || index == indexSelf
                    ? true
                    : false,
              }"
              @input="editContent(item)"
              @focus="handleFocus(index, $event)"
            />
          </div>
          <div class="item35" v-if="!item.isDefault">
            <span class="sortWrap" style="line-height:30px;font-size:16px">
              <i class="el-icon-caret-top" 
              @click="sorrowAdd('add',item)"
              ></i>
              <i class="el-icon-caret-bottom" 
              @click="sorrowAdd('minus',item)"
              ></i
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const displayType = { simple: "精简", complex: "复杂" };

export default {
  props: {
    dataArr: {
      type: Array,
      default: () => [],
    }, //数组数据 [{code:"散货",diff:0,isDefault:true}]
    title: {
      type: String,
      default: () => "散货托盘设置",
    },
    hasSeed: {
      type: Boolean,
      default: () => false,
    },
    hasContent: {
      type: Boolean,
      default: () => false,
    },

    hasTitle: {
      type: Boolean,
      default: () => true,
    },
    canChangeCard: {
      type: Boolean,
      default: () => true,
    },
    indexSelected: {
      type: Number,
      default: () => 0,
    },
    //是否需要禁止操作 通过该值和indexSelected定义一个计算属性决定是否有禁用操作的样式
    isNeedBan: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      indexSelf: this.indexSelected,
      seed: 0, //递增种子
      originalDataArr: [], // 用于还原状态的数组
      displayType: displayType,
    };
  },

  methods: {
    selectCard(index) {
      if (!this.canChangeCard) return;
      this.indexSelf = index;
      this.setDiffValue(index);
    },

    /**给默认选中的card */
    setDiffValue(index) {
      this.dataArr.forEach((item, i) => {
        if (i == index) {
          this.$set(item, "isSetValue", true);
          this.$set(item, "diff", "基点");
        }
      });
    },
    handleSeed(type) {
      let val = this.seed;

      if (typeof val == "string" && (val.trim() == "-" || val.trim() == "+"))
        return;
      if (isNaN(val * 1)) {
        this.$message({
          type: "error",
          message: "请输入数字",
          duration: 1000,
        });
        this.seed = 0;
      } else {
        if (type == "copy") {
        } else if (type == "increase") {
          val = val * 1;
        } else if (type == "decrease") {
          val = val * -1;
        }
        this.dataArr.forEach((item, index) => {
          if (type != "copy") {
            item.diff =
              this.dataArr[this.indexSelf].diff * 1 +
              (index - this.indexSelf) * val;
          } else {
            if (index != this.indexSelf) item.diff = val;
          }
          this.$set(item, "isSetValue", true);
        });
      }
    },
    sorrowAdd(type,item){
      let num=1;
      if(type=="minus"){
        num=num*-1;
      }
      let cur=item.diff*1;
      if(!Number.isFinite(cur)){
        cur=0;
      }
      item.diff=String(cur+num);
      this.editContent(item);
    },
    editContent(item) {
      var input = item.diff * 1;
      if (item.diff == "-") return;
      if (!Number.isFinite(input)) {
        throw new Error("请输入有效数字");
      }

      if (input > 0 && item.diff.indexOf("+") < 0) item.diff = "+" + item.diff;
      this.$set(item, "isSetValue", true);
    },
    handleFocus(index, e) {
      if (this.indexSelected == index) {
        e.srcElement.blur();
      }
    },
  },
  mounted: function () {},
  created: function () {
    this.originalDataArr = [...this.dataArr];
  },
  computed: {
    isBan: function () {
      return this.indexSelf < 0 && this.isNeedBan;
    },
  },
  watch: {
    indexSelf: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.$emit("update:indexSelected", newVal);
          this.dataArr.forEach((item, index) => {
            if (index == newVal) {
              item["isDefault"] = true;
            } else {
              item["isDefault"] = false;
            }
          });
        }
      },
    },
    indexSelected: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.indexSelf = newVal;
          this.selectCard(newVal);
        }
      },
    },
  },
};
</script>

<style scoped lang="less">
@import url("./css/flex-row.less");
@lightBlue: #cfdee8;
@blue: #0f5a8c;
div {
  text-align: center;
  white-space: nowrap;
}
.head-wrap {
  display: flex;
  direction: row;
  justify-content: space-between;
}

.card-wrap {
  display: flex;
  direction: row;
}
.card {
  border: 1px solid #dedede;
  border-right: 1px solid transparent; //对hover产生的border提前占位解决挤占内容的问题
  max-width: 100px;
  min-width: 60px;
}
.card:last-of-type {
  border-right: 1px solid #dedede;
}
.title {
  background: @lightBlue;
  color: @blue;
  padding: 6px 10px;
  text-align: center;
}
.content {
  color: @blue;
  height: 30px;
}
.card input {
  text-align: center;
  width: 100%;
  color: @blue;
}
.card.active {
}
.title.active {
  background: @blue;
  color: #fff;
}
.el-input__inner {
  border: 0 !important;
}

.seed-input {
  width: 28px;
  text-align: center;
  border-bottom: 1px solid #dedede;
}

.ban {
  cursor: not-allowed !important;
}

.sortWrap {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  & i {
    color: #bab8b8;
    &:hover{
      color: #409eff !important;
    }
  }

}
</style>