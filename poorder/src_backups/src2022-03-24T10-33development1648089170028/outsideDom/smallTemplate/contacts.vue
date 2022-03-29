<template>
  <div style="position:relative;margin-bottom:25px;">
    <!-- {{nodecode}}
    {{mawbguid}} -->
              <!-- {{relList}} -->
             <!--  <commonTable :head="tableHead" title="我司联系人" :tableData="relList.filter(item=>(item.lxrtitle=='销售')&&(item.lxrss==1))"> -->
             <commonTable :head="tableHead" :tableData="relList"> 
                  <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
              </commonTable>
         <!--      <commonTable :head="tableHead" title="客户联系人" style="margin-top:18px;" :tableData="relList.filter(item=>(item.lxrtitle=='客服')&&(item.lxrss==2))">
                  <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
              </commonTable>
              <commonTable :head="tableHead" title="销售站联系人" style="margin-top:18px;" :tableData="relList.filter(item=>(item.lxrss==4))">
                  <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
              </commonTable>
              <commonTable :head="tableHead" title="操作站联系人" style="margin-top:18px;" :tableData="relList.filter(item=>(item.lxrss==3))">
                  <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
              </commonTable> -->
  </div>
</template>
<script>

export default {
  props:{
   mawbguid:[Number,String],
   nodecode: [Number, String],
   pagetype:{
     type:[Number,String],
     default:1
   },
   area:String
  },
    components: {
  },

   data(){
     return {
          relList:[],
          tableHead:[
          {title:"抬头",field:"lxrtitle",width:'150px'},
          {title:"姓名",field:"jobname",width:'150px'},
          {title:"联系电话",field:"phone",width:'180px'},
          {title:"邮箱",field:"email"},
          ]
          ,tableData:[

          ]

     }
   }
   ,methods:{

     getInfoFunc(){
       if(this.pagetype==1){
            this.$axios({ method: 'get', url: this.$store.state.webApi + "api/ExHpoAxplineRel", params: { sid: this.mawbguid }, loading: false, tip: false }).then(results => {
           this.relList = results.data
         })
       }else{
         let data= { gid: sessionStorage.out_gid, lxrss: 1, area: this.area };
         if(this.nodecode&&this.mawbguid){
           data.nodecode=this.nodecode
           data.boguid = this.mawbguid
         }
             this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExCustomRel', params: data, loading: false, tip: false })
           .then(res => {
             res.data.forEach(i=>{
               i.jobname=i.name
             })
             this.relList = res.data
           })
       }
           
     }

    }
    ,computed:{


    },
    created () {

      this.getInfoFunc()

    },
    watch: {


    }

}
</script>
<style scoped lang="less">

.divItem{
    border:1px solid #e8e8e8;
    margin-bottom: 15px;
     .nodedom:last-child{
       border-bottom: none
     }
     /deep/ .el-date-editor--datetime .el-input__inner{
          padding:0px;
          font-size: 12px;
          text-indent: 4px;
     }
     /deep/ .el-input__prefix,.el-input__suffix{
       display: none
     }
}
  .nodedom{
    display:flex;
    overflow: hidden;
    border-bottom: 1px solid #e8e8e8;
    .domtitle{
      display: flex;
      align-items: center;
      margin:0 20px;
      font-size: 16px;
      min-width:40px;
    }
         .item{
           i{
             margin-right:14px;
             display: inline-block;
             font-size: 20px;
           }
           display: flex;
           align-items:center;
           margin-right:12px;
           margin:10px 0px;
           min-width:170px;
         }
  }
</style>


