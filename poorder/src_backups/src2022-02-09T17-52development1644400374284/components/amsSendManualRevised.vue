
<template>
  <div>
<amspage name="amsSendManual.vue" ref="search" modifystatusams=2></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "amsSendManualRevised",
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
