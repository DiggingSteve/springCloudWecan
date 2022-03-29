<template>
  <div>
        <div class="top">
          <div class="top-item" style="margin-right:20px;">
              <h3>查询条件</h3>
              <div class="page-container-box" style="margin:20px;position:relative">
                <newFormCmpt  :view-data.sync="inputViewData" :model-data.sync="inputModelData"  :search-data.sync="searchData"  :pagetype="2">
                </newFormCmpt>
                <div style='text-align:right;'>
                 <el-button type="primary" @click="search">查询</el-button>
                </div>
              </div>
              <!-- {{numberColumns}} -->
              <!-- {{searchData}} -->
              <!-- <el-form label-width="100px" :inline="true" style='padding-top:15px;'>
                 <el-form-item label="航班号：">
                 <el-input></el-input>
                 </el-form-item>
                 <el-form-item label="航班日期：">
                 <el-input></el-input>
                 </el-form-item>
                    <el-form-item label="委托客户：">
                 <el-input style='width:452px'></el-input>
                 </el-form-item>
                    <el-form-item label="始发港：">
                 <el-input></el-input>
                 </el-form-item>
                    <el-form-item label="目的港：">
                 <el-input></el-input>
                 </el-form-item>
              </el-form>
               <div  style='margin:20px;text-align:right;'>
                 <el-button type="primary">查询</el-button>
              </div>-->

          </div>
          <div class="top-item">
              <h3>费用分摊</h3>
                 <el-form label-width="100px" :inline="true" style='padding-top:15px;'>
                 <el-form-item label="费用名称：">
                 <!-- <el-input></el-input> -->
                 <page-select :modelval.sync="shareData.items" :pagetype="5" ></page-select>
                 </el-form-item>
    <el-form-item label="分摊方式：" style="width:50%">
                 <my-select  :options="wagetypeOptions" itemstyle="min-width:170px;width:100%;margin-bottom:0px;display:inline-block;max-width:170px" v-model="shareData.wagetype"></my-select>
                 </el-form-item>





 <el-form-item label="分摊类型："  style="width:267px">
                  <el-radio-group v-model="shareData.sharetype">
                  <el-radio :label="2">总价</el-radio>
                  <el-radio :label="1">单价</el-radio>
                </el-radio-group>

                 </el-form-item>

<el-form-item label="金额：">
                 <el-input v-model="shareData.wageall"></el-input>
                 </el-form-item>

  <el-form-item label="币种：" >
               <currencySelect itemstyle="min-width:170px;width:100%;margin-bottom:0px;display:inline-block;max-width:170px" v-model="shareData.currency"></currencySelect>
                 </el-form-item>


                     <el-form-item label="供应商：" style="width:100%">
                 <pageSelect :pagetype="3"  :modelval.sync="shareData.gid"  style='width:452px'></pageSelect>
                 </el-form-item>


                  <el-form-item style="float:right;margin-bottom:10px;margin-right:40px">
                 <el-button type="primary" @click="reset">重置</el-button>
                 <el-button type="primary" @click="shareFunc">分摊</el-button>
                 </el-form-item>
              </el-form>
         </div>
        </div>

               <div class="totalInfo" style="margin:10px 0px">
                    <div style="width:140px">
                      <span class="totalInfo-title">票数</span>
                      <span class="totalInfo-content">{{tableData.length||0}}票</span>
                    </div>
                       <div style="width:240px">
                      <span class="totalInfo-title">实际件/重/体</span>
                      <span class="totalInfo-content">{{getTotal('realpiece')}}/{{Number(getTotal('realweight')).toFixed(2)}}/{{Number(getTotal('realvolume')).toFixed(3)}}</span>
                    </div>

                   <div style="width:240px">
                      <span class="totalInfo-title">计费重量</span>
                      <span class="totalInfo-content">{{Number(getTotal('jfweight')).toFixed(2)}}</span>
                    </div>
                     <div style="width:240px">
                      <span class="totalInfo-title">结算重量</span>
                      <span class="totalInfo-content">{{Number(getTotal('accountweightout')).toFixed(2)}}</span>
                    </div>
               </div>

      <div class="result">
       <commonTable class="commonTable" :head="tableHead" :table-data="tableData" style="margin-top:8px;" :tableIndex="0"  isMultiSelect>

 <!-- <template slot="zdweightTh"><span class="bgweight zdweight">制单重量</span></template> -->
 <!-- <template slot="zdweight" slot-scope="props"><span>{{props.data.value}}</span></template> -->
  <template slot="accountweightoutTh"><span class="bgweight jsweight">结算重量</span></template>
 <template slot="accountweightout" slot-scope="props"><span>{{props.data.value}}</span></template>
  <template slot="jfweightTh"><span class="bgweight jfweight">计费重量</span></template>
 <template slot="jfweight" slot-scope="props"><span >{{props.data.value}}</span></template>

 <template slot="realjztTh" slot-scope="props"><span class="bgweight realweight">实际件/重/体</span></template>
 <template slot="realjzt" slot-scope="props"><span>{{props.data.row.realpiece}}/{{props.data.row.realweight}}/{{props.data.row.realvolume}}</span></template>
 <template slot="hbrq" slot-scope="props"><span >{{props.data.row.hbrq | formatDate('yyyy-MM-dd')}}</span></template>

            <template :slot="item.field+'Th'" slot-scope="props" v-for="item in numberColumns"><span :style="setColor(item.wagetype)">{{props.data.value}}<i class="el-icon-close cShare" @click="cancelShare(item.field)"></i></span></template>
            <template :slot="item.field" slot-scope="props" v-for="item in numberColumns"><span :style="setColor(item.wagetype)">{{props.data.value}}</span></template>

        </commonTable>
      </div>
  </div>
</template>
<script>
import {getChangeRate} from '../../api/localStorage.js'

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
               hbrq:{'title':'航班日期',type:15},
              fid:{'title':'委托客户',type:14},
              sfg:{'title':'始发港',type:1,verify:'uppercase'},
              mdg:{'title':'目的港',type:1,verify:'uppercase'},
          },
          inputModelData:{sharetitle:1},
          searchData:{},
          shareData:{
            gid:'',
            items:'',
            currency:'',
            wagetype:'',
            wageall:'',
            sharetype:2  //1.单价2.总价
          },
        tableHead:[
          {title:"订舱编号",field:"pono"},
          {title:"运单号",field:"mawb"},
          {title:"航班号",field:"hbh"},
          {title:"航班日期",field:"hbrq"},
          {title:"委托客户",field:"wtkhname"},
          {title:"始发港",field:"sfg"},
          {title:"目的港",field:"mdg"},
          {title:"实际件/重/体",field:"realjzt"},
        //  {title:"制单重量",field:"zdweight"},
          {title:"结算重量",field:"accountweightout"},
          {title:"计费重量",field:"jfweight"}
       ]
       ,tableData:[

       ],
       numberColumns:[],


     }
   }
   ,methods:{
    search(){//获取数据
    if(!this.$store.state.areaState||this.$store.state.areaState.split(',').length!=1){
      this.$message.error('请选择区域！');return
    }
    if(this.searchData.sharetitle==1&&!this.searchData.hbh){
      this.$message.error('请填写航班号！');return
    }
              this.tableData=[];
              this.numberColumns=[]
              this.tableHead=[
                         {title:"订舱编号",field:"pono"},
                          {title:"运单号",field:"mawb"},
                          {title:"航班号",field:"hbh"},
                          {title:"航班日期",field:"hbrq"},
                          {title:"委托客户",field:"wtkhname"},
                          {title:"始发港",field:"sfg"},
                          {title:"目的港",field:"mdg"},
                          {title:"实际件/重/体",field:"realjzt"},
                       //   {title:"制单重量",field:"zdweight"},
                          {title:"结算重量",field:"accountweightout"},
                          {title:"计费重量",field:"jfweight"}
                  ]

                  var jsonArr2={
                    where:JSON.parse(JSON.stringify(this.searchData)),
                   // order:"adddate desc"
                  }
                     if(this.searchData.sharetitle==1&&this.searchData.hbh){
                      jsonArr2.where.hbh=this.searchData.hbh.like
                    }
                    delete jsonArr2.where.sharetitle
                  var json={'json':JSON.stringify(jsonArr2)}

                   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExBoBaseShareWage',params:json,loading:true,tip:false,nofield:'1'}).then(results=>{
                      // console.log(results)

                       if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         let data=results.data.filter(i=>i.mawb)
                        // console.log(JSON.stringify(data,null,4))
                     // let data=results.data
                            let arr=[];
                            let columns=[]
                            data.forEach(i=>{
                                i.wageList.forEach(e=>{
                                  if(e.isshare&&e.isshare!='0'){
                                    if(!arr.includes(e.isshare)){
                                    arr.push(e.isshare);
                                   columns.push({title:e.items,field:e.isshare,wagetype:e.wagetype})
                                   this.tableHead.push({title:e.items,field:e.isshare})
                                    }

                                  i[e.isshare]=e.leastwageall
                                  }
                                })
                            })

                      this.tableData=data
                         console.log(JSON.stringify(data,null,4))

                      this.numberColumns=columns

                       }
                   })
                   .catch(errors=>{

                   })

          },
          reset(){
             this.shareData={
                gid:'',
                items:'',
                currency:'',
                wagetype:'',
                wageall:'',
                sharetype:2  //1.单价2.总价
              }
          },
          getTotal(field){//计算和
            var num=0
            this.tableData.forEach(i=>{
                num+=Number(i[field])
            })
            return num||0
          },
          shareFunc(){//分摊
         if(!this.shareData.items){
            this.$message.error('请选择\'费用名称\'');return
          }

         if(!this.shareData.currency){
            this.$message.error('请选择\'币种\'');return
          }

         if(!this.shareData.wageall){
            this.$message.error('请填写\'金额\'');return
          }

          if(!this.shareData.gid){
            this.$message.error('请选择\'供应商\'');return
          }

           if(!this.shareData.wagetype){
            this.$message.error('请选择\'分摊方式\'');return
          }



              var boBaseList=[]
              this.tableData.forEach(i=>{
                if(i.checked){
                  boBaseList.push({boguid:i.boguid,jfweight:i.jfweight,realweight:i.realweight,accountweightout:i.accountweightout,hbrq:i.hbrq})
                }
              })
       if(boBaseList.length==0){
            this.$message.error('请选择分摊数据');return
       }
                 var json=Object.assign({},this.shareData);
                 json.sharetitle=this.searchData.sharetitle
                 json.boBaseList=boBaseList
                 json.wagedom='空出'
                 json.changerate=getChangeRate(json.currency)||1
                 if(this.searchData.hbh){
                   json.hbh=this.searchData.hbh.like
                 }
                  console.log(JSON.stringify(json,null,4));

                this.$confirm('确认分摊?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                        this.$axios({method:'post',url:this.$store.state.webApi+'api/ExBoBaseShareWage',data:json,loading:true,tip:false}).then(results=>{
                          console.log(1111111111)
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
          ,cancelShare(isshare){
           // alert(isshare)

          this.$confirm('确认取消分摊?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

                      this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExBoBaseShareWage',data:{guid:isshare},loading:true,tip:false}).then(results=>{
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
          ,setColor(wagetype){
            switch (wagetype) {
              case '制单重量':
                return {color:'#009933'}
                break;
              case '结算重量':
                return {color:'#FF0000'}
                break;
              case '计重':
                return {color:'#3333FF'}
                break;
              case '毛重':
                return {color:'#FF7400'}
                break;
              default:
                break;
            }
          }

   }
,computed:{
      wagetypeOptions(){
        var arr=[]
        JSON.parse(localStorage.groupType).forEach(i => {
            if(i.groupid==33&&i.ready02==1){
             arr.push({value:i.typename,label:i.ready03})
           }
       });
       return arr
      }
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
  max-width:700px;
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
.cShare{
  cursor: pointer;
  margin-left:4px;
}
.bgweight{
  display:inline-block;
  width:100%;
  height:100%;
  box-sizing: border-box
 // color:#fff;
}
.zdweight{
 //background:#009933;
 border-top:3px solid #009933
}
.jsweight{
  //background:#FF0000;
 border-top:3px solid #FF0000
}

.jfweight{
 // background:#3333FF;
 border-top:3px solid #3333FF
}
.realweight{
 border-top:3px solid #FF7400

}
</style>


