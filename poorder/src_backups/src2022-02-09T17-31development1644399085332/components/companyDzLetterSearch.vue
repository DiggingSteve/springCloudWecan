
<template>
  <div>
<amspage name="companyDzLetterSearch.vue" ref="search"></amspage>
  </div>
</template>
<script>
import amspage from "./amsPage";


export default {
  name: "companyDzLetterSearch",
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
