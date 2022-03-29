<template>
    <div>
      <!-- {{inputViewData}} -->
         <div  class="page-container-box">
             <h2>查询条件</h2>
                <formCompt :input-view-data="inputViewData"></formCompt>

             <div class="searchForm">
                 <el-button type="primary" size="medium" @click="search">查询</el-button>
                 <el-button type="info" size="medium" @click="reset">重置</el-button>
             </div>


        </div>
        <tableCompt :name="name" :table-data-res="tableDataRes"></tableCompt>
    </div>
</template>
<script>
//type 1简单输入框 2.多选 3单选 4下拉 5下拉多选 6单日期 7.双日期 8操作要求 9分泡 嵌套输入框
import { searCondition,reset,filterGroupid } from '../api/localStorage.js'
  export default {
    data(){
      return {
        name:"costPayable.vue",
       inputViewData:[
                      {"title":"货物状态",id:"hwzt",type:5,"model":"","whereC":"in","sear":'1',"defaultModel":"[]",required:true,options:[{value:"1",label:"货未到"}]},
                      {"title":"单证状态",id:"wtkhname",type:5,"model":"","whereC":"in","sear":'1',"defaultModel":"[]"},
                      {"title":"报关状态",id:"pm",type:5,"model":"","whereC":"in","sear":'1',"defaultModel":"[]"},
                      {"title":"航线指令",id:"acceptancedate",type:5,"whereC":"in","model":"","sear":"1","defaultModel":"[]"},
                      {"title":"货物操作",id:"yqhbh",type:5,"model":"","sear":"1","defaultModel":"[]","whereC":"in"},
                      {"title":"委托客户",id:"wtkh",type:1,class:'width100',width:"50","model":"","whereC":"like","sear":'1',"defaultModel":"","model":""},
                      {"title":"项目",id:"yqhbrq",type:1,class:'width100',width:"50","model":"","whereC":"like","sear":"1","defaultModel":""},
                      {class:"seizeSeat"},
                      {"title":"始发港",id:"sfg",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"目的港",id:"mdg",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"航班号",id:"hbh",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"航班日期",id:"hbrq",type:7,"model":"","sear":'1',"defaultModel":""},
                      {class:"seizeSeat"},
                      {"title":"总运单号",id:"mawb",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"分运单号",id:"hawb",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"订舱编号",id:"ornr",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"有无运单",id:"ifMawb",type:3,"model":"1","sear":'1',"defaultModel":"",options:[{value:"1",label:"有"},{value:"2",label:"无"}]},
                      {class:"seizeSeat"},
                      {"title":"报关类型",id:"bglx",type:5,"model":"","whereC":"in","sear":'1',"defaultModel":"[]",options:[]},
                      {"title":"货物性质",id:"hwxz",type:5,"model":"","whereC":"in","sear":'1',"defaultModel":"[]",options:[]},
                      {"title":"创建人",id:"cjr",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"操作人",id:"czr",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
       ],
        inputModalData:
                     {
                         ddly:[],
                         bglx:[],
                         hwxz:[]
                     }
       ,tableDataRes:[]
      }
    },
    methods:{
     search(){
            var that=this
            //console.log(JSON.stringify(searCondition(this.inputViewData)))

              this.$axios.get('http://localhost:8080/api/dataContent').then((res)=>{
                //console.log(res.data);

               this.tableDataRes=res.data.data;
           }).catch(function(err){
                   //console.log(err);
             });

			      },
      reset(){
        reset(this.inputViewData)
      }

    }
    ,created(){
      filterGroupid(this.inputViewData)
    }
  }

</script>
<style scpoed>
.page-container-main{
    margin-right:0px;
}
</style>
