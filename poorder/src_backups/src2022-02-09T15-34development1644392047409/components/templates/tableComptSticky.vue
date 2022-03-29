<style scoped>
  /* 提供了一种简单的固定表头和固定列的方案，据此重构之前的tableCompt.vue */
* {
  margin: 0px;
  padding: 0px;
}

.tableWrap {
  max-height: 400px;
  max-width: 1200px;
  overflow: auto;
}

table {
  border-collapse: collapse;
  box-sizing: content-box;
}
table th,
td {
  border: 1px solid #ccc;
  white-space: nowrap;
  padding: 2px 4px;
  height: 32px;
  line-height: 32px;
  background: #fff;
}
table th {
  position: sticky;
  top: 0px;
}
table th.fixed {
  background: #fff;
  z-index: 999;
}

table .fixed {
  position: sticky;
  left: 0px;
}
</style>

<template>
  <div class="tableWrap">
    <div class="table">
      <table style="position: relative">
        <tr>
          <th
            v-for="(item1, index1) in head"
            :style="item1.left"
            :class="{ fixed: item1.fixed }"
            :key="index1"
          >
            {{ item1.title }}
          </th>
        </tr>
        <tr v-for="(item, index) in data">
          <td
            v-for="(headitem, headindex) in head"
            :class="{ fixed: headitem.fixed }"
            :style="[headitem.left]"
            :key="index + '-' + headindex"
            v-html="item[headitem.field]"
          ></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {

  },
  data() {
    return {
      head: [
        { title: "标题1", field: "field1", fixed: true },
        { title: "标题13333", field: "field1", fixed: true },
        { title: "标题1", field: "field1", fixed: true },
        { title: "标题1", field: "field2" },
        { title: "标题1", field: "field1" },
        { title: "777777777", field: "field1" },
        { title: "fffffffffff", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1", field: "field2" },
        { title: "标题1", field: "field1" },
        { title: "标题111111111111111111111" },
        { title: "标题1", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1333333333", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题12222222222", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1", field: "field1" },
        { title: "标题1777", field: "field1" },
        { title: "标题1999999999999", field: "field1" },
      ],
      data: [
        { field1: 1, field2: 2111111111111 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2, },
        { field1: 1, field2: 22222222444444444 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        {
          field1: 1,
          field2: "<p>111111111</p><p>111111111</p><p>111111111</p>",
        },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2222 },
        { field1: 1, field2: 2 },
        { field1: 1, field2: 2 },
      ],
    };
  },
  created() {
    this.$nextTick(() => {
      let that = this;
      $("th.fixed").each(function (i) {
        //.fixed父级要设置相对定位
        that.$set(that.head[i], "left", {
          left: $(this)[0].offsetLeft + "px",
        });
      });
    });
  },
  computed: {},
};
</script>

