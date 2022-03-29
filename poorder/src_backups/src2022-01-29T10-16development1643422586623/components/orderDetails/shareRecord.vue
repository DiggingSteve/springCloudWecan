<template>
  <div>
        <div class="top">
          <div class="top-item" style="margin-right:20px;">
              <h3>查询条件</h3>
              <div  style="margin:20px;position:relative">
                <newFormCmpt  :view-data.sync="inputViewData" :model-data.sync="inputModelData"  :search-data.sync="searchData"  :pagetype="2">
                </newFormCmpt>
                <div style='text-align:right;'>
                 <el-button type="primary" @click="reset">重置</el-button>
                 <el-button type="primary" @click="search">查询</el-button>
                </div>
              </div>
          </div>

        </div>



      <div class="result">
       <commonTable class="commonTable" :head="tableHead" :table-data="tableData" style="margin-top:8px;" :tableIndex="0" :zi-index="ziIndex">
            <template slot="operate" slot-scope="props"><i class="el-icon-plus" style="font-size:18px;" @click="showZitable(props.data.index)"></i><i class="el-icon-delete" @click="cancelShare(props.data.row.guid)"></i></template>
            <template slot="rqd" slot-scope="props">{{props.data.row.hbrqbegin | formatDate('yyyy-MM-dd') }}----{{props.data.row.hbrqend | formatDate('yyyy-MM-dd') }}</template>
            <template slot="sharetype" slot-scope="props">{{props.data.row.sharetype==2?'总价':'单价'}}</template>
            <template slot="sharetitle" slot-scope="props">{{props.data.row.sharetitle==1?'包机包板分摊':'其他分摊'}}</template>

    <template slot="ziTable" >
                        <commonTable :head="ziTableHead" :table-data="ziTableData" style="padding:0px;margin-left:96px">
                        </commonTable>
       </template>


        </commonTable>
      </div>
  </div>
</template>
<script>

export default {
  props:{
    mawbinfo:Object,
    shipaceInfoData:Object,
    peicangGuidArr:{
      type:Array,
      default(){
        return []
      }
    },dialogshow:Boolean


  },
    components: {

  },

   data(){
     return {
        inputViewData:{
              sharetitle:{'title':'分摊抬头',type:4,options:[{value:1,label:'包机包板分摊'},{value:2,label:'其他分摊'}]},
              hbh:{'title':'航班号',type:1,verify:'uppercase'},
            //  hbrq:{'title':'航班日期',type:15},
              hbrqbegin:{'title':'航班开始日期',type:6,placeholder:'开始日期'},
              hbrqend:{'title':'航班结束日期',type:6,placeholder:'结束日期'},
              items:{'title':'费用名称',type:1},
              gid:{'title':'供应商',type:20,pagetype:3},
              addman:{'title':'创建人',type:1},
              adddate:{'title':'创建日期',type:15},
        },
        inputModelData:{},
        searchData:{},
        tableHead:[
          {title:"操作",field:"operate"},
          {title:"日期段",field:"rqd"},
          {title:"费用名称",field:"items"},
          {title:"总金额",field:"wageall"},
          {title:"币种",field:"currency"},
          {title:"分摊类型",field:"sharetype"},
          {title:"分摊方式",field:"wagetype"},
          {title:"分摊抬头",field:"sharetitle"},
          {title:"供应商",field:"gysname"},
          {title:"创建人",field:"addman"},
          {title:"创建日期",field:"adddate"},
       ]
       ,tableData:[

       ],
       ziIndex:-1,
      ziTableHead:[
          {title:"订舱编号",field:"pono"},
          {title:"运单号",field:"mawb"},
          {title:"航班号",field:"hbh"},
          {title:"分摊金额",field:"wageall"},
          {title:"航班日期",field:"hbrq"},
          {title:"委托客户",field:"wtkhname"},
          {title:"始发港",field:"sfg"},
          {title:"目的港",field:"mdg"},
          {title:"实际件/重/体",field:"realjzt"},
          {title:"制单重量",field:"zdweight"},
          {title:"结算重量",field:"accountweightout"},
          {title:"计费重量",field:"jfweight"}
       ]
       ,ziTableData:[

       ],


     }
   }
   ,methods:{

             search(){//获取数据

                  if(!this.$store.state.areaState||this.$store.state.areaState.split(',').length!=1){
                    this.$message.error('请选择区域！');return
                  }
                 this.tableData=[];
                  var jsonArr2={
                    where:this.searchData,
                   // order:"adddate desc"
                  }
                  var json={'json':JSON.stringify(jsonArr2)}
                   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExBoBaseShareWagePch',params:json,loading:true,tip:false}).then(results=>{
                      // console.log(results)
                       if(results.data.length==0){
                            this.$message('无查询结果');return;
                       }else{
                             this.tableData=results.data
                       }
                   })
                   .catch(errors=>{

                   })

          },
          reset(){
             this.inputModelData={
              }

          },
          cancelShare(guid){
           // alert(isshare)

          this.$confirm('确认取消分摊?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

                      this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExBoBaseShareWage',data:{guid:guid},loading:true,tip:false}).then(results=>{
                          console.log(33333333)
                          console.log(results)
                          if(results.data.resultstatus==0){
                            this.$message(results.data.resultmessage);
                            this.search()
                          }else{
                            this.$message.error(results.data.resultmessage);
                          }
                  })
        })

          }
          ,showZitable(index){
              if(this.ziIndex==index){
              this.ziIndex=-1
           }else{
                      this.ziIndex=index
                     this.$axios({method:'get',url:this.$store.state.webApi+'api/ExBoBaseShareWageByIsShare',params:{guid:this.tableData[index].guid},loading:false,tip:false}).then(results=>{
                         // console.log(4444)
                          //console.log(results)
                           this.ziTableData=results.data.map(i=>{
                              i.realjzt=i.realpiece+'/'+i.realweight+'/'+i.realvolume;
                              return i
                           })
                  })

           }
          }

   }
,computed:{

},
created () {

},
watch: {

}

}
</script>
<style lang="less" scoped>
.top{
  display: flex;
  justify-content: space-around;
  height: auto;
  .top-item:nth-child(1){
  flex: 1;
  border:1px solid #e8e8e8;
}
.top-item:nth-child(2){
  flex:1;
  border:1px solid #e8e8e8
}
h3{
  border-bottom:1px solid #e8e8e8;
  padding:5px;
  color:#0F5A8C;
}
}

.result{
  height:500px;
}
</style>


