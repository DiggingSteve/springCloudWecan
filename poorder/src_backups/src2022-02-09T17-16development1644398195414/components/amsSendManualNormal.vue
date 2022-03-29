
<template>
  <div>
<amspage name="amsSendManual.vue" ref="search" modifystatusams=1></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "amsSendManualNormal",
  components: {
    amspage
  },
  data() {
    return {

    };
  },methods: {
    search(){
      this.$refs.search.search()
    }
  },
};
</script>


<style scoped lang="less">

</style>
