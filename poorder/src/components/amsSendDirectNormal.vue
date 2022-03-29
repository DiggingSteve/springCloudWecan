
<template>
  <div>
<amspage name="amsSendDirect.vue" ref="search" modifystatusams=1></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "amsSendDirectNormal",
  components: {
    amspage
  },
  data() {
    return {

    };
  },
  methods: {
    search(){
      this.$refs.search.search()
    }
  },
};
</script>


<style scoped lang="less">

</style>
