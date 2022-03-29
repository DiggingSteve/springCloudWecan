
<template>
   <div>
    <div  class="page-container-box" >


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
                <!-- <el-button @click="reset">重置</el-button> -->
              </div>


</div>

<!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
  <tableCompt
    :name="name"
    :table-data-res="tableDataRes"
    :nestedTableType="2"
    :ziTableData="ziTableData"
    :chinese-where="chineseWhere"
    showZiConfig
    :showTotal="showTotal"
    :dataGrouping="dataGrouping"
    groupField="guid"
    isGroup
    :isSort="false"
    :isPaging="false"
    ref="tableComponet"
    @transAmsMsg="hawbOpen"
>
  <template slot="operate" slot-scope="props">

  <i v-if="props.data.row.hawblist&&props.data.row.hawblist.length>0" :class="[open=='1'&&ziTableIndex!=props.data.index?'el-icon-plus':'el-icon-minus']" style='color:#1a7dbf;font-weight:bold' @click="openZiTable(props.data.row.index,props.data.row.hawblist)">

  </i>
  <!-- <span v-if="props.data.row.pactlsendstatus!='1'&&props.data.row.pactlsendstatus!='-1'&&props.data.row.pactlsendstatus!='10'&&props.data.row.sendtype!=2">
          <i
            class="el-icon-s-promotion"
            style="color:green"
            title="发送"
            @click="sendPatrol(props.data.index,props.data.row)"
          ></i>
  </span> -->

   <span v-if="props.data.row.pactlsendstatus!='1'&&props.data.row.pactlsendstatus!='-1'&&props.data.row.pactlsendstatus!='10'">
          <i
            class="el-icon-s-promotion"
            style="color:#e6a23c"
            title="虚拟发送"
            @click="sendPatrolM(props.data.index,props.data.row,'2')"
          ></i>
  </span>
    <span v-if="props.data.row.pactlsendstatus!='1'&&props.data.row.pactlsendstatus!='10'">
          <i
            :class="props.data.row.pactlsendstatus!='-1'?'el-icon-circle-close':'el-icon-circle-check'"
            style="color:#409EFF"
            :title="props.data.row.pactlsendstatus!='-1'?'忽略':'取消忽略'"
            @click="sendPatrolM(props.data.index,props.data.row,'1')"
          ></i>
  </span>

  </template>
  <template slot="mawb" slot-scope="props">
     <span class="poczColor" @click="openDialog(props.data.row)">{{props.data.value}}</span>
  </template>
  </tableCompt>
<!--  <template slot="pono" slot-scope="props"><span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
 </tableCompt> -->



<!-- mawbguid  当前点击pono所对应的guid -->
<!-- v-if="dialogShow"  -->
   <el-dialog  :title="mawbTitle" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
             <pactlPut :visible.sync="dialogShow" :sid="sid" :orderdom="orderdom" :gid="gid" :openType="openType" :hawbActiveIndex="hawbActiveIndex" :pactlsendstatus="pactlsendstatus"></pactlPut>
             <!-- <airPlaneDeatil></airPlaneDeatil> -->
        </el-dialog>

        <div style="display:none">
          <makingBill :mawbguid="mawbDetail.guid" :boguid="mawbDetail.boguid"   ref="makingbill" v-if="mawbDetail.guid&&printIndex!=-1" :orderdom="mawbDetail.orderdom" :mawbinfo="mawbDetail"></makingBill>
        </div>


</div>
</template>
<script>
import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'

import pactlPut from './orderDetails/pactlPut' //天运通详细
import { searCondition,getChangeValue,computedWeight,formatDate } from '../api/localStorage.js'
    export default {
      name: 'txdreportSearch',
      mixins:[systemCheck, openZimessage, searchCmptMixins],
       components: {pactlPut},
        data () {
            return {
                name:"txdreportSearch.vue",
                dialogPeicang:false,
                addPcShow: false,
                inputViewData:{

              },
                inputModelData:{
                     "pactlsendstatus": "0,2,5"
                },
                mawbDetail:{},
                printIndex:-1,
                putIndex:-1, //点击打开展开分单索引
                selectTableIndex:'',
                dataGrouping:{},
                sid:'',//总单guid
                gid:'',//委托客户gid
                orderdom:'',//总单直单
                open:'1',//展开子表格加号减号
                ziTableIndex:'-1',
                openType:'-1',//打开类型
                hawbActiveIndex:'',//激活分单
                mawbTitle:'',//标题总运单号
                pactlsendstatus:'',//状态

        }
      },

        methods: {
          delTableIndex(data){
            this.dialogShow=false

          },
          openZiTable(index,data){
           //this.open=this.open=='1'?'2':'1'
           if(this.ziTableIndex==index){
            this.$refs.tableComponet.ziTableIndex=-1
            this.ziTableIndex=-1
            //this.open='2'
           }else{
            this.$refs.tableComponet.ziTableIndex=index
            this.ziTableIndex=index
            //this.open='1'
           }
           this.ziTableData=data
          },

          hawbOpen(data){
            //console.log(data.row.pactlsendstatus)
            this.sid=data.row.guid
            this.gid=data.row.gid
            this.orderdom=data.row.orderdom
            this.mawbTitle=data.row.mawb
            this.dialogShow = true
            this.openType='2'
            this.hawbActiveIndex=data.index
            this.pactlsendstatus=data.row.pactlsendstatus
          },

          openDialog (data) {
            //console.log(data.pactlsendstatus)
            this.sid=data.guid
            this.gid=data.gid
            this.orderdom=data.orderdom
            this.dialogShow = true
            this.openType='1'
            this.mawbTitle=data.mawb
            this.pactlsendstatus=data.pactlsendstatus
          },

          search(){


              this.tableDataRes=[];
              this.ziTableData=[];
              this.open='1'
              this.ziTableIndex=-1
                  var jsonArr2={
                    where:this.searchData,
                    order:"adddate desc"
                  }
                  jsonArr2.where.sendtype=2
                  var json={'json':JSON.stringify(jsonArr2)}

                   this.$axios({method:'get',url:this.$store.state.webApi+'api/PactlReport',params:json,loading:true,tip:false}).then(results=>{
                       //console.log(results)
                       var resultsData=results.data

        if(resultsData.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         this.pageshow=false
                       }
                       let data=[]
                       let parentGroupData={}
                       let listLength=0
                       resultsData.forEach((i,index)=>{
                         if(i.list.length>0){
                           listLength=listLength+i.list.length
                           parentGroupData[i.list[0].guid]={hbh:i.hbh,hbrq:i.hbrq.substring(0,11),qfsj:i.qfsj.substring(11,16),pcstatus:i.pcstatus,pcstatuscn:i.pcstatuscn,listLength:listLength,len:i.list.length}
                          i.list.forEach(i2=>{
                            if(i2.hawblist.length>0){
                              i2.hawblist.forEach(i3=>{
                                i3.guid=i2.guid
                                i3.gid=i2.gid
                                i3.orderdom=i2.orderdom
                                i3.mawb=i2.mawb
                                i3.pactlsendstatus=i2.pactlsendstatus
                                i3.hawbjz=i3.hawbzdpiece+'/'+Number(i3.hawbzdweight).toFixed(2)
                              })
                            }
                          })
                          data=data.concat(i.list)
                        //  console.log(data)
                         }
                       })

                     data=getChangeValue(data,'空出')

                      setTimeout(()=>{
                        this.tableDataRes=data
                        this.dataGrouping=parentGroupData
                      },0)
                   })
                   .catch(errors=>{

                   })

          },

          // reset(){
          //    this.inputModelData={"pactlsendstatus":"0,2,5"}

          // },

          //发送
          async sendPatrol(index,data){

            if(data.zdpiece!=data.hawbzdpiece&&data.orderdom=='总单'){
              this.$message.error('总分单件数不同无法发送')
              return false
            }
             if(data.zdweight!=data.hawbzdweight&&data.orderdom=='总单'){
              this.$message.error('总分单重量不同无法发送')
              return false
            }

            if(data.orderdom=='总单'){
              var onlyUpdateHawb
               await this.$confirm('是否只更新分单?', '提示', {
                cancelButtonClass: "btn-custom-cancel",
                 cancelButtonText: '否',
               confirmButtonText: '是',

               showClose:false,
               modal:false,
               closeOnClickModal:false,
               distinguishCancelAndClose:true,
               type:'info'
               })
               .then(()=>{
                onlyUpdateHawb=true
                  })
               .catch((event)=>{
                console.log(event)
                 onlyUpdateHawb=false
               })

                 var json={guid:data.guid,onlyUpdateHawb:onlyUpdateHawb,mawb:data.mawb,czman:localStorage.usrname}
                  this.$axios({method:'post',url:this.$store.state.webApi+'api/PactlReport',data:json,loading:true,tip:false,noarea:'1'})
                  .then(results=>{
                    if(results.data.resultstatus==0){
                      this.tableDataRes[index].pactlsendstatuscn='已发送'
                      this.tableDataRes[index].pactlsendstatus='1'
                      layer.msg("操作成功！")
                    }else{
                      this.$message.error(results.data.resultmessage)
                    }
                   })
                  .catch(error=>{
                   })
                }else{
                 var json={guid:data.guid,onlyUpdateHawb:false,mawb:data.mawb,czman:localStorage.usrname}
                  this.$axios({method:'post',url:this.$store.state.webApi+'api/PactlReport',data:json,loading:true,tip:false,noarea:'1'})
                  .then(results=>{
                    if(results.data.resultstatus==0){
                      this.tableDataRes[index].pactlsendstatuscn='已发送'
                      this.tableDataRes[index].pactlsendstatus='1'
                      layer.msg("操作成功！")
                    }else{
                      this.$message.error(results.data.resultmessage)
                    }
                   })
                  .catch(error=>{
                   })
                }
          },

          //模拟发送
          sendPatrolM(index,data,type){

            var json={}
           if(type=='1'){
             if(data.pactlsendstatus=='-1'){
              json={sendstatus:0,czman:localStorage.usrname,guid:data.guid}
            }else if(data.pactlsendstatus=='0'){
              json={sendstatus:-1,czman:localStorage.usrname,guid:data.guid}
            }else{
              json={sendstatus:-1,czman:localStorage.usrname,guid:data.guid}

            }
           }else{
            json={sendstatus:10,czman:localStorage.usrname,guid:data.guid}
           }
            this.$axios({method:'put',url:this.$store.state.webApi+'api/PactlReport',data:json,loading:true,tip:false,noarea:'1'})
                  .then(results=>{
                    if(results.data.resultstatus==0){
                      if(type=='1'){
                        if(data.pactlsendstatus=='-1'){
                          this.tableDataRes[index].pactlsendstatuscn='未发送'
                          this.tableDataRes[index].pactlsendstatus='0'
                        }else if(data.pactlsendstatus=='0'){
                          this.tableDataRes[index].pactlsendstatuscn='已忽略'
                          this.tableDataRes[index].pactlsendstatus='-1'
                        }
                      }else{
                        this.tableDataRes[index].pactlsendstatuscn='虚拟发送'
                        this.tableDataRes[index].pactlsendstatus='10'
                      }
                      layer.msg("操作成功！")
                    }else{
                      this.$message.error(results.data.resultmessage)
                    }
                   })
                  .catch(error=>{
                   })
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

// .el-dialog__wrapper{
//   /deep/ .el-dialog__body{
//   padding:5px 25px 30px;
//   /deep/ .el-form-item__content>div{
//  //   width:186px
//   }
// }
// }

</style>
  <style>
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
  </style>
