<template>
  <div class="tabList">
    <ul>
      <li
        v-for="tab in tabList"
        :key="tab.value"
        :class="{'active': value === tab.value}"
        @click="changeTabs($event, tab)">

        <span>
          {{ $t(tab.label) }}
          <i class="underline"></i>
        </span>

      </li>
    </ul>

    <slot></slot>
  </div>
</template>

<script>
/**
 * 用法：
 *    <switchTabs v-model="activeTab" :tabList="tabList"></switchTabs>
 *    
 *    activeTab: '1',
 *    tabList: [
 *      { label: 'tab1', value: '1' },
 *      { label: 'tab2', value: '2' }
 *    ]
 */

export default {
  props: {
    value: {
      required: true
    },
    tabList: {
      type: Array
    }
  },
  methods: {
    changeTabs($event, tab) {
      this.$emit('input', tab.value)
      // this.$emit('change', tab)
    }
  }
}
</script>

<style lang="less" scoped>
.tabList {
  height: 29px;
  margin-bottom:30px;
  ul {
    float:left;
    li {
      display: inline-block;
      color: #999;
      margin-right: 18px;
      font-weight: bolder;
      cursor: pointer;
      span {
        position: relative;
        font-size: 16px;
        display: inline-block;
      }
      &:hover, &.active {
        color: #006bfa;
        span .underline {
          position: absolute;
          width: 33px;
          bottom: -8px;
          right: 0;
          border-bottom: 5px solid rgba(71, 149, 250, 0.6);
        }
      }
    }
  }
}
</style>

