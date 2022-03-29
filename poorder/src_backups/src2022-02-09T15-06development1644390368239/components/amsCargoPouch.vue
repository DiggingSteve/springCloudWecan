
<template>
  <div>
<amspage name="amsCargoPouch.vue" ref="search"></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "amsCargoPouch",
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
