<template>
  <div class="LySettleSearch">
    <el-button-group class="buttonTabs" style="display:inline;margin-bottom:12px;">
      <el-button @click.native="mngF" :class="[mng?'active':'']" >已对账查询</el-button>
      <el-button @click.native="secF" :class="[sec?'active':'']" >已开凭证查询</el-button>
    </el-button-group>
    <keep-alive>
      <reconMngThd  class="cre" v-if="mng" ref="fir" :system="'联运'"></reconMngThd>
      <credentialMngsec  class="cre"  v-if="sec" ref="sec" :system="'联运'"></credentialMngsec>
   </keep-alive>
  </div>
</template>

<script>
import reconMngThd from "../reconMngThd";
import credentialMngsec from "../credentialMngSec";
export default {
  name: "LySettleSearch",
  components: {
    reconMngThd,
    credentialMngsec
  },
  data() {
    return {
      name: "settleSearch.vue",
      mng: true,
      sec: false
    };
  },
  methods: {
    mngF() {
      this.mng = true;
      this.sec = false;
    },
    secF() {
      this.mng = false;
      this.sec = true;
    },
    reconciliation() {
      //console.log('reconciliation')
    },
    cancel_reconciliation() {
      //console.log('cancel_reconciliation')
    },
    send_email() {
      //console.log('send_email')
    },
    search() {
      // if(this.mng){
      //   this.$refs.fir.search()
      // }

      if (this.mng) {
        this.$refs.fir.search();
      } else if (this.sec) {
        this.$refs.sec.search();
      }
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.LySettleSearch {
  /deep/ .el-tabs__header {
    margin: 0;
    border-bottom: 0px;
  }
  /deep/ .el-tabs__content .el-tab-pane {
    padding: 0;
  }
  .active {
    background: #0d4c77;
    //border:none;
    color: #fff;
  }
  .cre {
    display: flex;
    flex-direction: column;
    height: calc(100% - 40px);
  }
}
</style>






