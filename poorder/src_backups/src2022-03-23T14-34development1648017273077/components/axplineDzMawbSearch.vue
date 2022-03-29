
<template>
   <div>
    <div  class="page-container-box" >
      <!-- {{peicangGuidArr}} -->
     <!-- {{selectTableIndex}} -->
     <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->
<!-- {{mawbguid}}-->

                <newSearchComp
                  :name="name"
                  :view-data.sync="inputViewData"
                  :model-data.sync="inputModelData"
                  :search-data.sync="searchData"
                  :pageshow.sync='pageshow'
                  :chinese-where.sync="chineseWhere"
                  :pagetype="1"
                   @reset="reset">
                </newSearchComp>
              <div class="searchForm">
                <el-button @click="search">查询</el-button>

              </div>


</div>


<!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage" v-on:transAmsMsg='transAmsMsg' :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
 <template slot="pono" slot-scope="props"><span  class="poczColor" @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
    <template slot="operate" slot-scope="props">
      <span :class="{spanDisabled:props.data.row.isfinishedtype=='未制单'}"><i class="el-icon-delete" @click='delBill(props.data.index)' title="删除运单" ></i></span>
   </template>
 </tableCompt>



<!-- mawbguid  当前点击pono所对应的guid -->
<!-- v-if="dialogShow"  -->
   <el-dialog  :title="orderdom+'制作'" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
    <h3  style="margin-bottom:10px;">总运单号：<span style="color:red">{{mawbinfo.mawb}}</span></h3>
          <!-- <makingBill :mawbguid="mawbinfo.sid" :boguid="mawbinfo.boguid"   ref="makingbill" style="border:1px solid #E8E8E8;" v-if="mawbinfo.sid&&selectTableIndex!=-1" :orderdom="mawbinfo.orderdom" :mawbinfo="mawbinfo"></makingBill> -->
      <confirmDetail :mawbdetail="tableDataRes[selectTableIndex]" :visible.sync="dialogShow" pagetype=3></confirmDetail>

  </el-dialog>




</div>
</template>
<script>


import makingBill from './orderDetails/makingBill'
import confirmDetail from './orderDetails/confirmDetail'
import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";
import { searCondition,getChangeValue,computedWeight,formatDate ,getValByGrouid} from '../api/localStorage.js'

    export default {
      name: 'axplineDzMawbSearch',
       components: {
           makingBill,confirmDetail
        },
       mixins: [ openZimessage, searchCmptMixins],
        data () {
            return {
                name:"axplineDzMawbSearch.vue",
                dialogPeicang:false,
                addPcShow: false,
                inputViewData:{
                    pono:{'title':'订舱编号',type:1,"whereStr":"like"},
                    mawb:{'title':'总运单号',type:1,"whereStr":"like"},
                    fid:{'title':'委托客户',type:14,pagetype:'1'},
                    gid:{'title':'项目',type:13,pagetype:'2'},
                    hbh:{"title":"航班号",type:1,"whereStr":"like",verify:'uppercase'},
                    sfg:{"title":"始发港",type:1,verify:'uppercase'},
                    mdg:{"title":"目的港",type:1,verify:'uppercase'},
                    hbrq:{'title':'航班日期',type:15,titleStyle:{'minWidth':'100px'}, defaultVal: true },
                    czlx:{'title':'操作类型',type:4,groupid:132},
                    isfinished:{'title':'总单制作',type:4,options:[{label:'已制单',value:1},{label:'未制单',value:2}]},
                    addman:{'title':'制作人',type:1},
                     commbillmodifystatus:{
                      title: "待修改状态",
                      type: 5,
                      groupid:159,
                      whereStr: "in",
                      fieldtype: 5,
                    },
               },
                inputModelData:{

                },
                mawbinfo:{},
        }
      },

        methods: {

        search(){

              this.tableDataRes=[];
              this.ziTableData=[];
                  var jsonArr2={
                    where:this.searchData,
                    order:"adddate desc"
                  }
                  var json={'json':JSON.stringify(jsonArr2)}
                   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxplineMawbDoc',params:json,loading:true,tip:false}).then(results=>{
                       //console.log(results)
                       if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         this.pageshow=false
                       }
                     this.tableDataRes=getChangeValue(results.data,'空出')


                   })
                   .catch(errors=>{

                   })

          },


         getHawbList(msg){
        //获取分单列表
         this.ziTableData=[];
         let guid=this.tableDataRes[msg.index].sid

         this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineHawbDoc',params:{hpoid:guid},loading:false,tip:false}).then(results=>{
                      //  //console.log("分单列表")
                      //   //console.log(JSON.stringify(this.ziTableData))
                       if(results.data.length==0){
                               this.$message('无查询结果！');
                               return;
                       }else{
                        results.data=getChangeValue(results.data,'空出')
                      setTimeout(()=>{
                        this.ziTableData=results.data;
                      },20)
                                    //this.ziTableData=getChangeValue(results.data)
                       }



             })
    },
          openDialog (indexData) {
            this.selectTableIndex=indexData
            this.mawbinfo=this.tableDataRes[indexData]
            this.mawbguid=this.tableDataRes[indexData].sid
            this.orderdom='总单'
            this.area=this.tableDataRes[indexData].area
            //console.log(this.mawbguid)
            this.dialogShow = true
          },

         transAmsMsg(data){

           console.log(data.row)
            this.mawbinfo=data.row
            this.mawbguid=data.row.hpoid
            this.orderdom='分单'
            this.area=data.row.area
            //console.log(this.mawbguid)
            this.dialogShow = true
         },
         delBill(index){
                    this.$confirm('是否确认删除?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {

                                               this.$axios({
                                            method: "delete",
                                            url: this.$store.state.webApi + "api/ExHpoAxplineMawbDoc",
                                            data: {czman:localStorage.usrname,guid:this.tableDataRes[index].guid},
                                            loading: true,
                                            noarea:true,
                                            tip: false
                                          }).then(results => {
                                                  if(results.data.resultstatus==0){
                                                        //  this.tableDataRes.splice(index,1);
                                                        this.$message.success(results.data.resultmessage);

                                                  }else{
                                                        this.$message.error(results.data.resultmessage);
                                                  }
                                          })

                    }).catch(() => {

                    });
         }

        },
        watch: {

        },

        created(){



        },
        computed:{


        }

    }
</script>


<style scoped lang="less">
.el-dialog__wrapper{
  /deep/ .el-dialog__body{
  padding:5px 25px 30px;
  /deep/ .el-form-item__content>div{
 //   width:186px
  }
}
}



</style>
