<template>
    <div>
        <!-- {{inputModalData}} -->
        <div  class="page-container-box">
             <h2>查询条件</h2>
                <formcompt :input-view-data="inputViewData"  :input-modal-data="inputModalData"></formcompt>
        </div>
<div id="searchForm">

      <el-button  @click="search" type="primary">查询</el-button>
      <el-button  @click="reset" type="primary">重置</el-button>

    </div>


         <tableCompt :name="name" :table-data-res="tableDataRes"></tableCompt>
    </div>
</template>
<script>
import tableCompt from "./templates/tableCompt"
import formcompt from "./templates/formCompt"
 import { searCondition } from '../api/localStorage.js'
// import {request,reLogin} from '../api/request.js'
    export default {
      name: 'outsubmissionStl',
        components: {
               tableCompt,formcompt
        },
        data () {
            return {
               name:"outsubmissionStl.vue",
                 inputViewData:[
                      // {"title":"公司名称",id:"gsmc",type:1,class:'width100',width:"50","model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"订舱编号",id:"orderno",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"委托客户",id:"wtkhname",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"货物品名",id:"pm",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
                      {"title":"订单受理日期",id:"acceptancedate",type:7,class:'width100',width:"50","model":"","sear":"1","defaultModel":""},
                      {"title":"要求航班",id:"yqhbh",type:1,"model":"","sear":"1","defaultModel":"","whereC":"like"},
                      {"title":"目的港",id:"mdg",type:1,"model":"","sear":'1',"defaultModel":"LAX"},
                      {"title":"要求航班日期",id:"yqhbrq",type:7,class:'width100',width:"50","model":"","sear":"1","defaultModel":""},
                      {"title":"订单来源",id:"dom",type:5,"model":[],"whereC":"in","sear":'1',options:[],"defaultModel":[],"groupid":102},

                      {"title":"状态",id:"status",type:5,"model":[],"whereC":"in","sear":'1',options:[{
                        value: '1',
                        label: '未受理'
                      }, {
                        value: '100',
                        label: '已受理'
                      }, {
                        value: '200',
                        label: '已退回'
                      }],"defaultModel":[]},

                 ],
                 inputModalData:
                     {
                         ddly:[],
                         bglx:[],
                         hwxz:[]
                     },
                 tableDataRes:[],


            }
        },
        methods:{
                search(){
                  var that=this
                  var jsonArr=searCondition(this.inputViewData,'空出')
                  jsonArr.beginstatus={"begin":'300'}
                  var jsonArr2={
                    where:jsonArr,
                    order: "confirmdate asc"
                  }
                  var json={'json':JSON.stringify(jsonArr2)}
                   that.$axios({method:'get',url:that.$store.state.webApi+'api/PoExAxpline',params:json,loading:true,tip:true}).then(results=>{
                       ////console.log(results)
                       that.tableDataRes=results.data;
                   })
                   .catch(errors=>{

                   })
                        ////console.log(JSON.stringify(searCondition(this.inputViewData)))

                            // request(that.$store.state.webApi+'api/PoExAxpline','get',searCondition(this.inputViewData),true,true).then(results=>{
                            //       //console.log(results)
                            // })
                            // .catch(error=>{

                            // })
                        // this.tableDataRes=global.getTableData().dataContent;

                        //  var that=this;
                        //  axios.get('/api/dataContent').then(function(res){
                        //    //console.log(res.data);

                        // //   let tableDataRes=res.data.data;
                        // // for(let i in tableDataRes){
                        // //   tableDataRes[i].ziTable=true
                        // // }
                        // // that.tableDataRes=tableDataRes;
                        // that.tableDataRes=res.data.data;
                        //           }).catch(function(err){
                        //                //console.log(err);
                        //           });

            },
                  reset(){
                      // this.inputModalData={ddly:[],bglx:[],hwxz:[]};
                      let data=this.inputViewData;
                      for(var i in data){
                        data[i].model=data[i].defaultModel
                      }
                  }
        }
        ,created(){
          //console.log('create 外部订单提交结算')
          let groupData=JSON.parse(localStorage.getItem('groupType'))

          let inputData=this.inputViewData
          for(let i in inputData){
            for(let j in groupData){
              if(inputData[i].groupid){
              if(inputData[i].groupid==groupData[j].groupid){
                inputData[i].options.push({'value':groupData[j].typename,'label':groupData[j].typename})
              }
              }
            }
          }

               ////console.log(this.$store.state.count)
        },
        beforeDestroy () {
          //console.log('Destroy 外部订单提交结算')
        }
        ,watch:{

        }
    }


</script>
<style>
.page-container-main{
    margin-right:0px;
}
#searchForm{
 margin:10px;
  display: inline-block;
}

</style>
