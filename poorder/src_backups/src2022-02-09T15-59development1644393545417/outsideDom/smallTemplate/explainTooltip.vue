<template>

           <div style="display:inline">
           <el-tooltip class="item" effect="light"  placement="bottom">
                     <div slot='content' style="min-height:36px;max-width:280px;line-height:18px;"><strong style="display:block;margin-bottom:4px;">说明:</strong><span v-html="text"></span></div>
                    <span class="el-icon-info" style="color:#409EFF;font-size:12px;"></span>
          </el-tooltip>

         </div>


</template>
<script>



    export default {

          props:{
                text:{
                  type:String,
                  default:""
                }
          },
           components: {

        },
        data () {
            return {

            }

        },
        methods: {


        }
        ,created(){


        },
        computed:{

        },
        mounted(){




        },
        watch:{


        }

    }


</script>
<style  lang='less' scoped>


</style>
