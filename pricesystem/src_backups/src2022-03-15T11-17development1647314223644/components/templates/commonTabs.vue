<template>
  <div class="hawbTabs commontabs">
    <div class="tabs-header">
      <div class="header-c" :style="{'top':headTop}">
        <!-- <p class="tabTitle" v-if="tabTitle">{{tabTitle}}</p> -->
        <template v-for="(item, index) in tablist">
          <el-tooltip class="item" placement="bottom" :disabled="!showTooltip">
            <div slot="content" v-if="item.addman">创建人：{{item.addman}}<br />
              <p style="padding-top:8px;">创建日期：{{item.adddate}}</p>
            </div>
            <div slot="content" v-else>{{item.title}}</div>
            <p :style="pageTitleStyle[index]" :key="index"
              :class="[{'active': checkedIndex == index,'disabled':item.disabled},item.class]"
              @click.self="toggletab(index)">
              <span v-if="checkedIndex == index" class="dotted"></span> {{ item.title }}
              <i class="el-icon-close" style="margin-left:auto;padding:4px" title="删除"
                v-show="showClose||item.showClose" @click.self="close(index)"></i>
            </p>
          </el-tooltip>
        </template>
      </div>
      <!-- <i class="tabs-right-mask"></i> -->
      <el-button v-show="showExpanionBtn" :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]" @click="show_tabs"
        icon="el-icon-arrow-down"></el-button>
    </div>

    <div ref="hide_tabs" @blur="tabs_blur" :class="['hide-tabs', {'show': show_all_hawb}]" tabindex="0">
      <p v-for="(item, index) in tablist"
        :style="[pageTitleStyle[index],{backgroundColor: checkedIndex == index?color:''},{color: checkedIndex == index?'#fff':'#999'}]"
        :title="item.title" :key="index" :class="{'active': checkedIndex == index,'disabled':item.disabled}"
        @click.self="toggletab(index,$event)" :index="index">
        <span v-if="checkedIndex == index" class="dotted"></span> {{ item.title }}
        <i class="el-icon-close" style="margin-left:auto;padding:4px" v-show="showClose||item.showClose"
          @click.self="close(index)"></i>
      </p>
    </div>
    
    <div>
      <el-collapse-transition>
        <div v-show="showContent" class="tabs-content">
          <slot></slot>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
  import { formatDate, setTabTitleStyle } from "@/api/localStorage"
  export default {
    //引用
    //  <commonTabs :list="listBillChangeJob"  :checkedIndex.sync="listBillChecked" tabTitle='订单列表：' titlefield="jobno" @toggle="handleClick" :opendIndex.sync="listBillOpened">
    //         内容区域
    //   </commonTabs>

    props: {
      list: {
        type: Array,
        default: () => []
      },
      checkedIndex: {//选中的索引
        type: [Number, String],
        default: 0
      },
      opendIndex: {//已打开过的tab索引，用于第一次加载v-if，之后v-show
        type: Array,
        default: () => [0]
      },
      titlefield: {//用哪个字段显示标题
        type: String,
        default: 'pono'
      },
      showContent: {
        type: Boolean,
        default: true//是否显示内容区域
      },
      tabTitle: '',
      titleStyle: {//tab标题的样式，
        type: Array,
        default: () => []
      },
      showExpanionBtn: {//是否需要显示展开tab的按钮
        type: Boolean,
        default: true
      },
      showClose: {//是否显示关闭按钮
        type: Boolean,
        default: false
      },
      showTooltip: {//是否需要显示鼠标移入标题时的tooltip
        type: Boolean,
        default: true
      },
      color: {//标题的背景颜色
        type: String,
        default: 'rgb(15,90,140)'
      },
      deletetype: {
        type: [String, Number],
        default: 1//1 点击删除按钮emit事件，让父级处理；2直接删除该tab
      }
    },
    created() {
      this.initHeadTop();
    },
    data() {
      return {
        show_all_hawb: false,
        headTop: '0px',
        pHeight: 42//标题高度，包括上下边距
      }
    },
    watch: {

    },
    computed: {
      tablist() {
        if (this.list.length && this.checkedIndex > (this.list.length - 1)) {
          this.close(this.checkedIndex)
        }
        return this.list.map((i, k) => {
          i.title = i[this.titlefield];
          return { ...i }
        })
      },
      pageTitleStyle() {
        if (this.titleStyle && this.titleStyle.length) {
          return this.titleStyle
        }
        return setTabTitleStyle(this.list, this.checkedIndex, this.color)
      }
    },
    methods: {
      gettitle(item) {
        return `${item.addman}<br/>${formatDate(item.adddate, 'yyyy-mm-dd')}`
      },
      show_tabs() {
        if (!this.hidden_times) {
          this.show_all_hawb = !this.show_all_hawb
          this.$refs.hide_tabs.focus()
        }
      },
      tabs_blur() {
        this.show_all_hawb = false
        this.hidden_times = true
        setTimeout(() => {
          this.hidden_times = false
        }, 200)
      },
      initHeadTop() {//初始化多行tab的定位
        if (this.checkedIndex != 0) {
          this.toggletab(this.checkedIndex);//定位到选中的tab,如果tab比较多并且默认并不在第一排，需要定位的下面的行。
          this.$nextTick(() => {
            this.headTop = - parseInt($('.hide-tabs').find('p.active')[0].offsetTop / this.pHeight) * this.pHeight + 'px';
          })
        }
      },
      toggletab(index, e) {
        //  console.log(e)
        //  console.log(e.screenY,e.y,e.layerY,e.offsetY)
        let item = this.tablist[index];
        if (item.disabled) {
          return
        }
        if (e) {
          this.headTop = -Math.floor(e.layerY / this.pHeight) * this.pHeight + 'px'
        }
        this.$emit("update:checkedIndex", index)
        if (!this.opendIndex.includes(index)) {
          this.$emit("update:opendIndex", [...this.opendIndex, index])
        }
        this.$emit('toggle', { index: index })
      },
      close(index) {
        console.log(index)
        // alert(this.deletetype)
        if (this.deletetype == 1) {
          this.$emit('close', index)
        } else {
          this.$confirm("是否确认删除", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: '取消',
            type: "waring"
          }).then(() => {
            this.list.splice(index, 1)
            if (this.opendIndex.includes(index)) {
              this.$emit("update:opendIndex", this.opendIndex.filter(i => i != index))
            }
            this.$emit("update:checkedIndex", index > 0 ? (this.list.length - 1) : 0)
          })

        }


      }
    }
  }
</script>

<style lang="less" scoped>
  .dotted {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #fff;
    margin-right: 5px;
    border-radius: 50%;
  }

  @tabs-p: {
    // position: relative;
    float: left;
    min-width: 180px;
    height: 36px;
    display: flex;
    align-items: center;
    text-align: left;
    color: #999;
    padding: 0 12px;
    cursor: pointer;
    transition: all .3s;
    margin: 3px 2px;

    &.active {
      background: #0F5A8C;
      color: #fff;
    }

    &.disabled {
      cursor: not-allowed !important;
      background: #959b9e !important;
      color: #fff !important;
    }

    .icon-c {
      position: absolute;
      display: block;
      top: 11px;
      right: 8px;
      width: 12px;
      height: 12px;
      z-index: 1;

      &:hover {
        i {
          visibility: visible;
        }

        span {
          visibility: hidden;
        }
      }

      i {
        position: absolute;
        top: 1px;
        left: 1px;
        text-indent: 0;
        width: 12px;
        height: 12px;
        visibility: hidden;

        &:before {
          position: absolute;
          top: 0;
          font-size: 12px;
        }
      }

      span {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        background: #e8e8e8;
        border-radius: 50%;
      }
    }
  }

  ;

  .hawbTabs {
    position: relative;
    width: 100%;
    margin-bottom: 20px;

    .tabs-header {
      position: relative;
      z-index: 500;
      width: 100%;
      /* height: 36px; */
      height: 44px;
      overflow: hidden;
      background: #f8f8f8;
      border: 1px solid #e8e8e8;

      .left-title {
        height: 36px;
        line-height: 36px;
        padding-left: 12px;
        font-size: 14px;
        color: #0f5a8c;
        font-weight: bolder;
      }

      .header-c {
        position: absolute;
        padding-right: 40px;
        transition: top .5s;
        /* width: 100%; */
        /* display: grid;
        grid-template-columns: repeat(auto-fill, minmax(168px, 230px)); */

        p {
          @tabs-p();
          border-top: 0;
          border-right: 0;
          border-radius: 3px;
        }
      }

      .add-hawb,
      .expansion-hawb {
        position: absolute;
        top: 4px;
        padding: 0;
        height: 28px;
        color: #0f5a8c;
      }

      .add-hawb {
        right: 36px;
        width: 80px;
      }

      .expansion-hawb {
        right: 4px;
        width: 28px;

        /deep/ .el-icon-arrow-down {
          transition: all .5s;
        }
      }

      .icon-rotate {
        /deep/ .el-icon-arrow-down {
          transform: rotate(180deg);
        }
      }

      .tabs-right-mask {
        position: absolute;
        top: 0;
        right: 130px;
        width: 44px;
        height: 36px;
        background: url('../../../boStatic/images/mask.png') no-repeat 0 0;
      }
    }

    .hide-tabs {
      /* display: flex; */
      position: absolute;
      overflow: hidden;
      z-index: 555;
      border-top: 1px solid #e8e8e8;
      top: 44px;
      left: 0px;
      right: 5px;
      background: #fff;
      /* padding-bottom: 12px; */
      transition: all .5s;
      box-shadow: 0 10px 20px -10px;
      padding-right: 40px;

      /* display: grid;
      grid-template-columns: repeat(auto-fill, minmax(168px, 230px)); */
      p {
        @tabs-p();
      }

      p.active {
        border-color: #0f5a8c;
      }
    }

    .hide-tabs:not(.show) {
      height: 0px !important;
      top: 0px;
    }
    .hide-tabs.show {
     z-index: 666;
    }
    .tabs-content {
      border: 1px solid #e8e8e8;
      border-top: 0px;
      padding: 12px;
    }
  }

  .hawbTabs .tabs-header,
  .hide-tabs {
    p.tabTitle {
      color: #0f5a8c;
      font-weight: bolder;
      width: 100px;
      min-width: 100px;
    }
  }
</style>