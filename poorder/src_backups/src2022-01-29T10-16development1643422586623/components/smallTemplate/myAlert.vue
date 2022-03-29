<template>

           <div v-show="!['AB0420','AB0520','AB0620'].includes(servicecode)">
                    <el-alert
                    :title='title'
                    :type="$store.state.rwxdArr.includes(servicecode)?'warning':'info'"
                    :closable="false"
                    show-icon
                    style="margin-bottom:10px;"
                    >
                    </el-alert>

         </div>


</template>
<script>




    export default {


          props:{
                servicecode:{
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
              title(){
               let par={
                 AA0510:'联运部',
                 AG0115:'空出鉴定组',
                 AG0120:'材料部',
                 AG0125:'空出鉴定组',
                 AG0130:'仓储部',
                 AA0810:'材料部',
                 AA0830:'仓储部',
                 AA0840:'仓储部',
                 AA0850:'仓储部',
                 AG0110:'行政部',
              }
              if(this.$store.state.rwxdArr.includes(this.servicecode)){
                 return "该服务可下达到操作部门,如需下达,请将信息填写完整后并点击下达按钮给"+par[this.servicecode]+"。"
              }else{
                return "该服务无需下达到操作部门,待操作部门任务完成后会自动完成。"
              }
              }
        },
        mounted(){

        },
        watch:{


        }

    }


</script>
<style lang="less" scoped>
@import 'small.css';

.input-content .selfInput{
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 28px;
    line-height: 28px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
.input-content .selfInput:hover{
   border:1px solid #C6C9D1;
}
.input-content .selfInput:focus{
   border:1px solid #409EFF;
}
.input-content .el-select{
  width:100%;
}
.input-content:hover .selfSpan{
 display:block;
}
.input-content .selfSpan{
  display: inline-flex;
  justify-content:center;
  position:absolute;
  right:7px;
  top:8px;
  display:none;
  cursor: pointer;
  width:12px;
  height: 12px;
  line-height: 12px;
  color:#B1B5BD;
}


</style>
