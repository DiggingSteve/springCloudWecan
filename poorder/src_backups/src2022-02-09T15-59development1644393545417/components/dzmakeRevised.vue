
<template>
   <div>
    <div  class="page-container-box" >
      <!-- {{peicangGuidArr}} -->
     <!-- {{selectTableIndex}} -->
     <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->
<!-- {{mawbguid}}-->
<!-- {{mawbinfo}} -->
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
 <tableCompt :name="name" :table-data-res="tableDataRes"   @transSelIndex="openDialog"  :nestedTableType="2" v-on:transmitMsg="getZimessage"  :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
 <!-- <template slot="pono" slot-scope="props"><span  class="poczColor" @click="openDialog(props.data.index)">{{props.data.value}}</span></template> -->
 <template slot="operate" slot-scope="props"><span  class="el-icon-edit" style="color:green;cursor:pointer" title="制作单证" @click="openDialog(props.data.index,2)"></span></template>

 </tableCompt>



<!-- mawbguid  当前点击pono所对应的guid -->
<!-- v-if="dialogShow"  -->
   <el-dialog  title="单证制作" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
          <!-- <makingBill :mawbguid="mawbinfo.sid" :boguid="mawbinfo.boguid"   ref="makingbill" style="border:1px solid #E8E8E8;" v-if="mawbinfo.sid&&selectTableIndex!=-1" :orderdom="mawbinfo.orderdom" :mawbinfo="mawbinfo"></makingBill> -->
    <h3  style="margin-bottom:10px;">总运单号：<span style="color:red">{{mawbinfo.mawb}}</span></h3>
   <!-- <hawbtabsoper
             v-if="mawbinfo.guid"
                  :pagetype="2"
                  :mawbdetail="mawbinfo"
                  :nosave="1"
                  :hawbPosition='mawbinfo.hawb'
                ></hawbtabsoper> -->
      <confirmDetail :mawbdetail="tableDataRes[selectTableIndex]" :visible.sync="dialogShow" pagetype=3 fromPage='billmake' afreshRateCharge></confirmDetail>


  </el-dialog>

    <el-dialog
      title="综合查询"
      v-if="dialogPono"
      center
      :visible.sync="dialogPono"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="dialogPono"
        :pagetype="20"
        :mawbguid="tableDataRes[selectTableIndex].guid"
        :boguid="tableDataRes[selectTableIndex].boguid"
        :area="tableDataRes[selectTableIndex].area"
        :orderdom="tableDataRes[selectTableIndex].orderdom"
        :default-active-name="defaultActiveName"
      ></mawbaddput>
    </el-dialog>



</div>
</template>
<script>


import hawbtabsoper from './orderDetails/hawbTabsOper'
import confirmDetail from './orderDetails/confirmDetail'
import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'


import { searCondition,getChangeValue,computedWeight,formatDate ,getValByGrouid} from '../api/localStorage.js'





    export default {
      name: 'dzmakeRevised',
      mixins:[systemCheck, openZimessage, searchCmptMixins],
       components: {
           hawbtabsoper,confirmDetail
        },
        data () {
            return {
                name:"axplineDzHawbSearch.vue",
                dialogShow:false,
                dialogPono:false,
                dialogPeicang:false,
                addPcShow: false,
                inputViewData:{
                    // pono:{'title':'订舱编号',type:1,"whereStr":"like"},
                    // mawb:{'title':'总运单号',type:1,"whereStr":"like"},
                    // fid:{'title':'委托客户',type:14,pagetype:'1'},
                    // gid:{'title':'项目',type:13,pagetype:'2'},
                    // hbh:{"title":"航班号",type:1,"whereStr":"like",verify:'uppercase'},
                    // sfg:{"title":"始发港",type:1,verify:'uppercase'},
                    // mdg:{"title":"目的港",type:1,verify:'uppercase'},
                    // hbrq:{'title':'航班日期',type:15,titleStyle:{'minWidth':'100px'}, defaultVal: true},
                    // czlx:{'title':'操作类型',type:4,groupid:132},
                    // isfinished:{'title':'总单制作',type:4,options:[{label:'已制单',value:1},{label:'未制单',value:2}]},
                    // isfinished_hawb:{'title':'分单制作',type:4,options:[{label:'已制单',value:1},{label:'未制单',value:2}]},
                     addman:{'title':'制作人',type:1},
                    // accountinfo:{"title":"Accountinginfo",type:1,titleStyle:{minWidth:'120px'},"whereStr":"like"},
               },
                inputModelData:{

                },
                mawbinfo:{},
                selectTableIndex:-1,
                putIndex:-1, //点击打开展开分单索引
                defaultActiveName: null, // 综合查询默认打开TAB

        }
      },

        methods: {
        search(event, loading=true){
           if(this.$store.state.ifLimitSearch&&Object.keys(this.searchData).length==0){
              return this.$message.error('请输入或选择查询条件！');
            }
              this.tableDataRes=[];
              this.ziTableData=[];
              this.searchData.modifystatus={'unequal':1}
                  var jsonArr2={
                    where:this.searchData,
                    order:"hbrq asc,adddate desc"
                  }
                  var json={'json':JSON.stringify(jsonArr2)}

                   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineHawbDoc',params:json,loading:loading,tip:false}).then(results=>{
                       //console.log(results)

                       if(results.data.length==0){
                         this.$emit('getTableData', [])
                         this.$message('无查询结果');return;
                       }else{
                         if (loading) {
                          this.pageshow=false
                         }
                       }
                     this.tableDataRes=getChangeValue(results.data,'空出');
                     this.$emit('getTableData', this.tableDataRes)
               /*        setTimeout(()=>{
                        // this.tableDataRes=results.data;
                        this.tableDataRes=results.data.map(i=>{
                           if(!i.mawb||i.hbh){
                             i.checkDisabled=true;
                           }
                             return i
                        })
                      },20) */
                   })
                   .catch(errors=>{

                   })

          },


         getHawbList(msg){
           this.putIndex=msg.index
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

          /**
           * @desc 打开综合查询弹框
           * @param { number } indexData 点击表格的行数
           * @param { number } type 2: 修改操作
           */
          openDialog (indexData, type) {
            this.selectTableIndex=indexData
            this.mawbinfo=this.tableDataRes[indexData]
            this.mawbguid=this.tableDataRes[indexData].sid
            this.orderdom='分单'
            this.area=this.tableDataRes[indexData].area
            //console.log(this.mawbguid)
            // if(this.mawbinfo.hawbnum==0){
            //   return this.$message.error('无分单！');
            // }
            //   if(type==2){
            //  this.dialogShow = true
            // }else{
            //  this.dialogPono = true
            // }
            
            // 从修改操作进来，弹框的tab默认值单证制作
             this.defaultActiveName = type == 2 ? 'tab1-dzmake' : null;
             // 打开综合查寻
             this.dialogPono = true;
          },

         transAmsMsg(data){

           console.log(data.row)
            this.mawbinfo=data.row
            this.mawbguid=data.row.hpoid
            this.orderdom='分单'
            this.area=data.row.area
            //console.log(this.mawbguid)
            this.dialogShow = true
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
