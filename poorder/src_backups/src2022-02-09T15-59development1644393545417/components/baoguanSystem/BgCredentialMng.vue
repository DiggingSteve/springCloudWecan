<template>
  <div class="BgCredentialMng">

        <el-button-group class="buttonTabs" style="display:inline;margin-bottom:12px;">
    <el-button @click.native="mngF" :class="[mng?'active':'']" >可开凭证</el-button>
    <el-button @click.native="secF" :class="[sec?'active':'']" >已开凭证</el-button>
        </el-button-group>
<keep-alive>
     <credentialMngfir  class="cre" v-if="mng" ref="fir" :system="'报关'"></credentialMngfir>
     
     <credentialMngsec  class="cre"  v-if="sec" ref="sec" :system="'报关'"></credentialMngsec>
   </keep-alive>
  </div>
</template>

<script>
import credentialMngfir from "../credentialMngFir"
import credentialMngsec from "../credentialMngSec"
export default {
  name: "BgCredentialMng",
  components: {
          credentialMngfir,
          credentialMngsec
        },
  data () {
    return {
      name: 'credentialMng.vue',
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
    reconciliation () {
      //console.log('reconciliation')
    },
    cancel_reconciliation () {
      //console.log('cancel_reconciliation')
    },
    send_email () {
      //console.log('send_email')
    },
    search(){
      if(this.mng){
        this.$refs.fir.search()
      }
      
      // if(this.mng){
      //   this.$refs.fir.search()
      // }else if(this.sec){
      //   this.$refs.sec.search()
      // }
    }
  },created(){

  }
}
</script>

<style lang="less" scoped>
.BgCredentialMng {
  /deep/ .el-tabs__header {
    margin: 0;
    border-bottom: 0px;
  }
  /deep/ .el-tabs__content .el-tab-pane {
    padding: 0;
  }
    .active{
 background:#0d4c77;
  //border:none;
  color:#fff
  }
  .cre{
    display: flex;
    flex-direction: column;
   height: calc(100% - 40px )
  }
}
</style>
