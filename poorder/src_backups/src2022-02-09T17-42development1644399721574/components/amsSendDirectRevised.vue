
<template>
  <div>
<amspage name="amsSendDirect.vue" ref="search" modifystatusams=2></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "amsSendDirectRevised",
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
