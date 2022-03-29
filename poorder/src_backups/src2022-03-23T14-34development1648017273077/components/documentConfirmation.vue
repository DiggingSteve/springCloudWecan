
<template>
   <div  class="reconciliationMng">

      <el-button-group class="buttonTabs">
    <!-- <el-button @click.native="setPagetype(1)" :class="pagetype==1?'active':''" >单号未确认</el-button>
    <el-button @click.native="setPagetype(2)" :class="pagetype==2?'active':''" >单证未确认</el-button> -->
    <el-button @click.native="setPagetype(1)" :class="pagetype==1?'active':''" >未确认</el-button>
    <el-button @click.native="setPagetype(2)" :class="pagetype==2?'active':''" >已确认</el-button>
        </el-button-group>
<keep-alive>
    <danhaoConfirm v-if="pagetype==1" class="zipage" ref="page1" monitor="1"></danhaoConfirm>
    <danhaoConfirmSec v-if="pagetype==2" class="zipage" ref="page2" monitor="2"></danhaoConfirmSec>
    <!-- <danzhengConfirm v-if="pagetype==2"  class="zipage" ref="page1"></danzhengConfirm> -->
  </keep-alive>


</div>
</template>
<script>


import danhaoConfirm from './danhaoConfirm'
import danzhengConfirm from './danzhengConfirm'

var danhaoConfirmSec={
name:"danhaoConfirmSec",
mixins:[danhaoConfirm]
}

    export default {
      name: 'documentConfirmation',
       components: {
         danhaoConfirm,danhaoConfirmSec
            //danhaoConfirm,danzhengConfirm
        },
        data () {
            return {
                pagetype:1
        }
      },

        methods: {
             search(){
                if(this.pagetype==1){
                  this.$refs.page1.search()
                }else{
                  this.$refs.page2.search()
                }
             },setPagetype(type){
               this.pagetype=type;
               localStorage.setItem('documentConfirmation',type==1?"danhaoConfirm":"danzhengConfirm")
             }

        },
        watch: {

        },

        created(){
            localStorage.setItem('documentConfirmation',"danhaoConfirm")
        },
        computed:{


        }

    }
</script>


<style scoped lang="less">




</style>
