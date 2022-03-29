<template>
  <div class="reconciliationMng">
 <el-button-group class="buttonTabs">
    <el-button @click.native="mngF" :class="[mng?'active':'']" >控制类</el-button>
    <el-button @click.native="secF" :class="[sec?'active':'']" >预警类</el-button>
    </el-button-group>
<keep-alive>
     <nodeControllerPage  class="cre" pagetype="1" v-if="mng" ref="fir"></nodeControllerPage>
     <nodeControllerPage  class="cre" pagetype="2"   v-if="sec" ref="sec"></nodeControllerPage>
   </keep-alive>
  </div>
</template>

<script>
import nodeControllerPage from "./nodeControllerPage"

export default {
  name: "nodeController",
  components: {
          nodeControllerPage,
        },
  data () {
    return {
      name: 'nodeController.vue',
      mng:true,
      sec:false,
    }
  },
  methods: {
    mngF(){
      this.mng=true
      this.sec=false
    },
    secF(){
      this.mng=false
      this.sec=true
    },
    search(){
      if(this.mng){
        this.$refs.fir.search()
      }else if(this.sec){
        this.$refs.sec.search()
      }
    }
  },created(){

  }
}
</script>

<style lang="less" scoped>

</style>






