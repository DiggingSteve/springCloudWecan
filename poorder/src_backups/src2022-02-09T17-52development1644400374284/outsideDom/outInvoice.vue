<template>
  <div>
<!--     <switchTabs v-model="activeTab" :tabList="tabList"></switchTabs>

<keep-alive>
  <invoiceGet v-if="activeTab=='1'" class="rec"></invoiceGet>

 <invoiceGetPaper v-if="activeTab=='2'" class="rec"></invoiceGetPaper>
</keep-alive> -->
 <invoiceGet v-if="activeTab=='1'" class="rec"></invoiceGet>
  </div>
</template>

<script>
import invoiceGet from "./invoiceGet"
import invoiceGetPaper from "./invoiceGetPaper"

export default {
  name: "outInvoice",
  components: {
    invoiceGet, invoiceGetPaper
  },
  data() {
    return {
      name: 'outInvoice.vue',
      activeTab: '1',
      tabList: [
        { label: 'message.invoice', value: '1' },
        // { label: 'message.invoicePaper', value: '2' }
      ]
    }
  },
  created() {

  },
  computed: {

  },
  watch: {

  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.rec {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}
</style>
