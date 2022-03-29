<template>
  <div class="hawbTabs">
    <div class="tabs-header">
 
      <div class="header-c" :style="{'top': `-${Math.floor(cur_index / 8) * 37}px`}">
       
        <p
          v-for="(item, index) in hawbListCost"
          :title="item.pono"
          :key="item.pono"
          :style="tabPanStyle[index]"
          :class="{'active': cur_hawb == item.pono}"
          v-if="index>0"
          @click.self="togglehawb(item.pono, index)">
          {{ item.pono }}
          <span class="icon-c" v-if="hideRemoveHawb">
            <span class="icon-close-mask"></span>
            <i @click="removehawb(index)" class="el-icon-close"></i>
          </span>
        </p>
      </div>
      <i class="tabs-right-mask"></i>
      <el-button class="add-hawb" @click.native="addhawb" v-if="showAddHawbBtn">添加分单</el-button>
      <el-button :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]" @click="show_tabs" icon="el-icon-arrow-down"></el-button>

    </div>
    <div ref="hide_tabs" @blur="tabs_blur" :class="['hide-tabs', {'show': show_all_hawb}]" :style="{'height': `${Math.ceil(hawbListCost.length / 8) * 50 + 14}px`}" tabindex="0" >
      <p
        v-for="(item, index) in hawbListCost"
        :title="item.pono"
        :style="tabPanStyle[index]"
        :key="index"
        :class="{'active': cur_hawb == item.pono}"
        @click.self="togglehawb(item.pono, index)">
        {{ item.pono }}
        <span class="icon-c" v-if="hideRemoveHawb">
          <span class="icon-close-mask"></span>
          <i @click="removehawb(index)" class="el-icon-close"></i>
        </span>
      </p>
    </div>
    <div class="tabs-content" v-show="Info">
      <slot></slot>

    </div>
  </div>
</template>

<script>

export default {
  props: {
    // 总单guid
    mawbguid: {
      required: true,
      type: [Number, String]
    },
    boguid:{
    type: [Number, String]
    },
   
    // 根据此字段判断是显示上榜还是显示详细
    // add || detail
    method: {
      type: String,
      default: 'detail'
    },
    // 是否显示添加分单按钮
    showAddHawbBtn: {
      type: Boolean,
      default: true
    },
    // 是否隐藏删除分单按钮
    hideRemoveHawb: {
      type: Boolean,
      default: () => false
    },
   
    hawbListCost:{
      type:Array
    },
    tabPanStyle:{
      type:Array,
      default:[]
    }
  },
  created () {
    
    this.hawbListCost.forEach((item,index)=>{
      if(item.boguid==this.boguid){

        this.cur_index=index+1
      }
    })

    //this.cur_index=0
   // alert('1')
    //console.log(this.hawbListCost)
    //console.log(this.cur_index)

  },
  data () {
    return {
      Info:true,
      //hawb_list: [],
      cur_index: null,
      cur_hawb: '',
      show_all_hawb: false,
      guidHawbGroup: []
    }
  },
  watch: {
       'cur_index' (newVal) {
       // alert(newVal)
        //console.log(this.hawbListCost[this.cur_index])
        this.cur_hawb = this.hawbListCost[newVal].pono
        
   
          this.$emit('togglehawbN', this.hawbListCost[newVal])
        
        
      
    }
   
  },
  methods: {
    show_tabs () {
      if (!this.hidden_times) {
        this.show_all_hawb = !this.show_all_hawb
        this.$refs.hide_tabs.focus()
      }
    },
    tabs_blur () {
      this.show_all_hawb = false
      this.hidden_times = true
      setTimeout(() => {
        this.hidden_times = false
      }, 200)
    },

    togglehawb (hawb, index) {
  
         this.cur_index = index
         this.cur_hawb = hawb
         if(this.hawbListCost[this.cur_index]){
           this.$emit('togglehawbN', this.hawbListCost[this.cur_index])
         }
      
    },
    // removehawb (index) {
    //   if (index== 0) {
    //     this.cur_index = 1
    //   } else if (this.cur_hawb == this.hawbList[index]) {
    //     this.cur_index = index - 1
    //   }
    //   this.hawbList.splice(index, 1)
    // }
  }
}
</script>

<style lang="less" scoped>
@tabs-p: {
  position: relative;
  float: left;
  width: 180px;
  line-height: 36px;
  text-align: left;
  text-indent: 12px;
  color: #999;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all .3s;
  &.active {
    // color: #0f5a8c;
    // background: #fff;
    background:#0F5A8C;
    color:#fff;
    border-bottom: 1px solid #fff;
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
};

.hawbTabs {
  position: relative;
  width: 100%;
  .tabs-header {
    position: relative;
    z-index: 500;
    width: 100%;
    height: 37px;
    overflow: hidden;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    border-bottom: 0px;
    .left-title {
      height: 36px;
      line-height: 36px;
      padding-left: 12px;
      font-size: 14px;
      color: #0f5a8c;
      font-weight: bolder;
      border-bottom: 1px solid #e8e8e8;
    }
    .header-c {
      position: absolute;
      padding: 0 140px 0 0;
      transition: top .5s;
      //left: 100px;
      p {
        @tabs-p();
        border-top: 0;
        border-right: 0;
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
      background:url('../../../boStatic/images/mask.png') no-repeat 0 0;
    }
  }
  .hide-tabs {
    position: absolute;
    overflow: hidden;
    z-index: 400;
    border: 1px solid #e8e8e8;
    top: 36px;
    left: 101px;
    right: 5px;
    background: #fff;
    padding: 12px 12px 0;
    transition: all .5s;
    box-shadow: 0 10px 20px -10px;
    p {
      @tabs-p();
      margin-right: 12px;
      margin-bottom: 12px;
    }
    p.active {
      border-color: #0f5a8c;
    }
  }
  .hide-tabs:not(.show) {
    height: 0px !important;
    top: 0px;
  }
  .tabs-content {
    border: 1px solid #e8e8e8;
    border-top: 0px;
    padding: 12px;
  }
}
</style>
