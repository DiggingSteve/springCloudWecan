<template>
  <div class="reconciliationMngOut">
 <!--    <div style="display:inline;margin-bottom:12px;">
    <el-button @click.native="mngF" :class="[mng?'active':'']">未对账</el-button>
    <el-button @click.native="secF" :class="[sec?'active':'']">已对账</el-button>
    </div> -->
     <keep-alive>
     <reconMngfir v-if="mng" class="cre" ref="fir" :system="system" :wageinout="'2'"></reconMngfir>
     </keep-alive>
    <!--  <keep-alive>
     <reconMngsec v-if="sec" class="cre" ref="sec"></reconMngsec>
     </keep-alive> -->
   <!--  <el-tabs type="card">
      <el-tab-pane label="可对账">
      <reconMngfir></reconMngfir>


      </el-tab-pane>
      <el-tab-pane label="对账查询">

        <reconMngsec></reconMngsec>
      </el-tab-pane>
    </el-tabs> -->
  
  </div>
</template>

<script>
import { reset } from '../api/localStorage.js'
import reconMngfir from "./reconMngFir"

export default {
  name: "reconciliationMngOut",
  components: {
          reconMngfir,
        },
  props: {
    system: {
      type: String,
      default: "空出"
    }
  },
  data () {
    return {
      name: 'reconciliationMngOut.vue',
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
  }
}
</script>

<style lang="less" scoped>
.reconciliationMngOut {
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
