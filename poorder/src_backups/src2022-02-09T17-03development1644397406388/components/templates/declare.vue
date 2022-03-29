<template>
<div style="padding:0px 20px 16px 20px;" class="declare">

	<div  v-if="serviceActive">
  <span>报关类型：</span>
	<el-select v-model="curObject.bglx" placeholder="请选择" class="input-required" style="width:160px;margin-bottom:10px;" v-if="serviceActive">
                                        <el-option
                                          v-for="selitem in bglx"
                                          :key="selitem.value"
                                          :label="selitem.label"
                                          :value="selitem.value">
                                        </el-option>
                            </el-select><br>

	
		<span v-if="serviceActive" style="margin-left:5px;">报关单号：</span><span style="display:inline-block;max-width:180px;width:160px;" v-if="serviceActive">
    {{curObject.pono}}

    </span>
      <span v-if="serviceActive">件数：</span><span v-if="serviceActive"><el-input style="width:50px;" v-model="curObject.piece" ></el-input></span>
   
    <span style="margin-left:10px;" v-if="serviceActive">重量：</span><span v-if="serviceActive"><el-input style="width:50px;" v-model="curObject.weight" ></el-input></span>



    <span style="margin-left:10px;" v-if="serviceActive">连单数：</span><span v-if="serviceActive"><el-input style="width:50px;" v-model="curObject.lds"></el-input></span>


    <span style="margin-left:10px;" v-if="serviceActive">报关供应商：</span>
    <gysField :search="search" :model="curObject.bggysname" :bggysIndex="currentIndex" :width="340" @gysdata="gysdata" v-if="serviceActive"></gysField>

  

    <span style="margin-left:15px;" v-if="serviceActive"><el-button @click.native="addJdzs()">添加报关单号</el-button></span>
		
	
	</div>



	<div style="margin-left:4px;margin-top:8px;">
	
	
		<div :style="{'position':'relative','margin-left':index>0?'73px':'0','margin-bottom':'8px'}" v-for="(item,index) in curObject.jdzsData">

    <span v-show="index==0">鉴定证书：</span>
    <span >
    <el-input style="width:150px;" v-model="item.jdzsbh" @keyup.native.f2="showJdzs(index)" placeholder="按F2查询鉴定证书库"></el-input>
    </span>
    
    <span style="width:280px;text-overflow:ellipsis;overflow:hidden;vertical-align:middle;white-space: nowrap;display:inline-block" :title="item.ypmc">
      样品名称：
      {{item.ypmc}}
    </span>

    <span style="width:280px;text-overflow:ellipsis;overflow:hidden;vertical-align:middle;white-space: nowrap;display:inline-block" :title="item.sjdw">
      送检单位：
      {{item.sjdw}}
    </span>

    <span style="width:280px;text-overflow:ellipsis;overflow:hidden;vertical-align:middle;white-space: nowrap;display:inline-block" :title="item.scdw">
      生产单位：
      {{item.scdw}}
    </span>
   
    <span style="margin-left:10px;">

  <i :class="[index==0?'el-icon-circle-plus':'el-icon-remove']" @click="addDeclareList(index)" :style="{'color':index==0?'#f56c6c':'#5daf34','font-size':'18px'}"></i>
    </span>
    


		</div>

		
	</div>
	<div class="table-box" style="text-align:center;margin-top:15px;border:1px solid #ccc;border-right:0">
		<div class="title el-row">
			<div class="el-col el-col-3">操作</div>
			<div class="el-col el-col-4">报关单号</div>
			<div class="el-col el-col-9">报关供应商</div>
			<div class="el-col el-col-4">件/重</div>
			<div class="el-col el-col-4">连单数</div>
		</div>

		<div class="el-row bottom" v-for="(item2,index2) in declaration">

    <div class="el-col el-col-3">
     <i class="el-icon-setting" @click="nowObject(index2)"></i>
     <i class="el-icon-delete" @click="deleteJdzsData(item2.guid)"></i>
    </div>
    <div class="el-col el-col-4" style="height:24px;">
    <span>
 <!--    <i class="el-icon-circle-plus-outline" v-if="item2.jdzsData[0].jdzsbh" @click="cTableS=index2"></i> -->
    </span>
    {{item2.pono}}
    </div>
			<div class="el-col el-col-9" style="height:24px;">{{item2.bggysname}}</div>
			<div class="el-col el-col-4" style="height:24px;">{{item2.piece}}/{{item2.weight}}</div>
			<div class="el-col el-col-4" style="height:24px;">{{item2.lds}}</div>



<!--     <div v-if="cTableS==index2" class="el-row table-box" style="text-align:center;margin-top:24px;border:1px solid #ccc;border-right:0;border-left:0;border-bottom:0">

      <div class="title el-row" style="background:#f8f8f8;">
        
        <div class="el-col el-col-3">鉴定证书编号</div>
        <div class="el-col el-col-13">样品名称</div>
        <div class="el-col el-col-4">送检单位</div>
        <div class="el-col el-col-4">生产单位</div>
      </div>

      <div class="el-row bottom" v-for="(item3,index3) in item2.jdzsData" style="background:#f8f8f8;">

  
    <div class="el-col el-col-3" style="height:24px;">{{item3.jdzsbh}}</div>
      <div class="el-col el-col-13" style="height:24px;">{{item3.ypmc}}</div>
      <div class="el-col el-col-4" style="height:24px;">{{item3.sjdw}}</div>
      <div class="el-col el-col-4" style="height:24px;">{{item3.scdw}}</div>
    </div>


    </div> -->

		</div>
    

	</div>



    <div class="table-box" style="text-align:center;margin-top:15px;border:1px solid #ccc;border-right:0" v-show="!serviceActive">

    
    <div class="title el-row">
      <div class="el-col el-col-3">操作</div>
      <div class="el-col el-col-4">鉴定证书编号</div>
      <div class="el-col el-col-9">样品名称</div>
      <div class="el-col el-col-4">送检单位</div>
      <div class="el-col el-col-4">生产单位</div>
    </div>
    <div v-if="declaration.length > 0">
        <div class="el-row bottom" v-for="(item2,index2) in declaration[0].jdzsData" >
      
        <div class="el-col el-col-3">
        
        <i class="el-icon-delete" @click="deleteJdzs(index2)"></i>
        </div>
        <div class="el-col el-col-4" style="height:24px;"><span>{{item2.jdzsbh}}</span></div>
          <div class="el-col el-col-9" style="height:24px;">{{item2.ypmc}}</div>
          <div class="el-col el-col-4" style="height:24px;">{{item2.sjdw}}</div>
          <div class="el-col el-col-4" style="height:24px;">{{item2.scdw}}</div>


        </div>
    </div>


    </div>
	


<!-- 弹出框 -->
	 <el-dialog
  title="鉴定证书库"
  :visible.sync="jdzsInfo"  class="jdzsClass" width="60%" append-to-body v-if="jdzsInfo">
  <div class="page-container-main">
  	<div v-for="item in jdzsSearch">
  		<div class="input-item">
  		 <div class="input-title">{{item.title}}</div>
  		  <div  class="input-content">
  		  	<template v-if="item.type==1">
  		  		<el-input v-model="item.model"></el-input>
  		  	</template>
  		  	<template v-else-if="item.type==4">
  		  		 <el-select v-model="item.model" placeholder="请选择">
                        <el-option
                            v-for="selitem in item.options"
                            :key="selitem.value"
                            :label="selitem.label"
                            :value="selitem.value">
                        </el-option>
                 </el-select>
  		  	</template>
  		  

  		  </div>
  		</div>
  	</div>
  </div>

  <el-button style="margin-left:15px;" @click.native="searchJdzs">查询</el-button>
  <el-button @click.native='jdzsInfo=false'>返回</el-button>
 
  <!-- 表格 -->
<p class="jdzsR">查询结果</p>
	<table style="width:100%" class="jdzsT">
		<tr>
			<th>客户</th>
			<th>鉴定证书编号</th>
			<th>样品名称</th>
			<th>送检单位</th>
			<th>生产单位</th>
			<th>包装类型</th>
		</tr>

		<tr v-for="(item,index) in jdzsSearchData" v-if="jdzsSearchData.length>0" @click="selectJdzsData(jdzsIndex,index)">
			<td>{{item.customer}}</td>
			<td>{{item.jdzsbh}}</td>
			<td style="text-overflow:ellipsis;overflow:hidden;">{{item.ypmc}}</td>
			<td>{{item.sjdw}}</td>
			<td>{{item.scdw}}</td>
			<td>{{item.bzlx}}</td>
		</tr>
	</table>
</el-dialog>

</div>

</template>
<script>
import { Notification } from 'element-ui';
import { filterGroupid,searCondition } from '../../api/localStorage.js'
import gysField from './gysField'
    export default {
    props: {
    guid: {
      type: Number,
      required: true
    },
    serviceActive:{ // 有无报关服务
      type:Number,
       required: true
    },
    hawbdata:{
      type:Object,
      required: true
    },
    orderdom:{
      type:String,
      default:'总单'
    }
  },
       
          components: {
              gysField
          },
        data () {
            return {
              currentIndex:0,//当前激活的declarlist索引
              cTableS:-1,//鉴定证书子表格
              jdzsInfo:false,//鉴定证书对话框显示隐藏
             // addBgdh:false,
              jdzsIndex:-1,//当前激活declarlist下F2查询鉴定证书索引
              jdzsSearch:[
               {'title':'鉴定证书编号','model':'','type':'1','id':'jdzsbh',"whereC":"like","sear":'1'},
               {'title':'样品名称','model':'','type':'1','id':'ypmc',"whereC":"like","sear":'1'},
               {'title':'包装类型','model':'',type:'4',options:[],groupid:31,'id':'bzlx',"sear":'1'},
               {'title':'送检单位','model':'',type:'1','id':'sjdw',"whereC":"like","sear":'1'},
               {'title':'生产单位','model':'',type:'1','id':'scdw',"whereC":"like","sear":'1'}
              ],
              //linshihawb:"",
              jdzsSearchData:[],
              declaration:[],
              bglx:[],
              curObject:{},
              search:{type:"all",comxz:'1',system:'',area:"",timestamp:"0"},
              modify:0
        

            }

        },
        methods: {
        	// 点击添加
          addJdzs(){
           
           if(this.curObject.guid){
            this.editDeclaration(this.curObject)
           }else{
            this.addDeclaration(this.curObject)
           }


           //  var templete=""
           //  var pusht;
          	// var declareList=this.declaration.declareList
       
           //  var start=declareList[0].bgdh

           //    if(declareList[this.currentIndex].bgdh.indexOf('-')==-1){
           //      templete=start+"-01"
           //    }else{
           //       templete=declareList[this.currentIndex].bgdh.substring(0,declareList[this.currentIndex].bgdh.indexOf('-'))+'-0'+Number(i) 
           //    }
           //      this.declaration.declareList[Number(i-1)].show=true
           //       this.declaration.declareList.forEach(item=>{
           //        if(item.bgdh==templete){
           //           pusht=1
           //        }
           //       })
           //       //若存在重复则不添加
           //       if(pusht!=1){
           //        this.declaration.declareList.push({"bgdh":templete,"piece":"","weight":"","lds":"","bggys":"",jdzsData:[{"jdzsbh":'',"ypmc":'',"sjdw":'',"scdw":''}],modelId:"","show":false})
           //       }

           //   this.currentIndex=i
           //   //console.log(this.declaration.declareList)
          	

          },

          addDeclaration(object){
          //object=delete object.bggysName;
          //console.log(object)
          object.sid=this.hawbdata.guid

         // object.orderdom=orderdom
          object.orderdom=this.orderdom
         // object.orderdom=this.hawbdata.orderdom
          this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplineDecl',data:object,loading:false,tip:false}).then(results=>{
          //this.declaration = results.data
          //console.log(results)
          if(results.data.resultstatus==0){
           this.getJdzsInfo()

            var templete=""
            var pusht;
            var declareList=this.declaration
            
            //var start=declareList[0].bgdh

              if(this.curObject.pono.indexOf('-')==-1){
                templete=this.curObject.pono+"-01"
              }else{
                 templete=this.curObject.pono.substring(0,this.curObject.pono.indexOf('-'))+'-0'+Number(i) 
              }

              this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],pono:templete,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"","bggys":""}
               this.modify=0

          }
          ////console.log(this.declaration)
        })
  
          },
          editDeclaration(object){
               object.sid=this.hawbdata.guid
          
          object.orderdom=this.orderdom
         // object.orderdom='总单'

            //object=delete object.bggysName;
            this.$axios({method:'put',url:this.$store.state.webApi+'api/ExAxplineDecl',data:object,loading:false,tip:false}).then(results=>{
          //this.declaration = results.data
          if(results.data.resultstatus==0){
           this.getJdzsInfo()
           this.modify=0

            var ttt=this.declaration[this.declaration.length].pono.substring(0,this.declaration[this.declaration.length].pono.indexOf('-'))+'-0'+Number(length+1) 
            this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],pono:ttt,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"",bggys:""}
            //this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],bgdh:templete,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"","bggys":""}
               }
            })
          },

        //修改先赋值
        nowObject(index){
          //this.curObject=this.declaration[index]
          this.modify=1
          this.curObject=this.declaration.splice(index, 1)[0]

          ////console.log(this.curObject)
          //this.declaration.splice(index,1)
        },
        

          // 点击删除报关单号信息
          deleteJdzsData(guid){
                //object.sid=this.hawbdata.guid
          
         // object.orderdom=orderdom
          //object.orderdom='总单'

           this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExAxplineDecl',data:{guid:guid,isdel:"2",orderdom:this.orderdom},loading:false,tip:false}).then(results=>{
          //this.declaration = results.data
          if(results.data.resultstatus==0){
           this.getJdzsInfo()
               }
            })
   
    

          },

          // 点击后边加号或者减号，index判断为加或者减
          addDeclareList(index){
          	var jdzsData=this.curObject.jdzsData

          	if(index==0){
              jdzsData.push({"jdzsbh":"","ypmc":"","sjdw":"","scdw":""}) 
          }else{
          	jdzsData.splice(index,1)
          
  
          }
          },
          // 删除鉴定证书
          deleteJdzs(index){

            // if(index==0&&this.declaration.declareList[0].jdzsData.length==1){
            //  var start={"jdzsbh":'',"ypmc":'',"sjdw":'',"scdw":''}
            //   this.$set( this.declaration.declareList[0].jdzsData,index,start)
              
            // }else{
            //    this.declaration.declareList[0].jdzsData.splice(index,1)
            // }
            // //console.log(this.declaration.declareList)
           
          },
          gysdata(data){
             this.curObject.bggys=data.id
             this.curObject.bggysName=data.gysdata
             //this.$emit('gysdataP',data);
          },


          //查询鉴定证书信息
          getJdzsInfo(){
      //             if(this.guid){
        this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineDecl',params:{sid:this.guid},loading:false,tip:false}).then(results=>{
          this.declaration = results.data

          //console.log(this.declaration)

          if(this.declaration.length>0){
            var ttt=this.declaration[this.declaration.length].pono.substring(0,this.declaration[this.declaration.length].pono.indexOf('-'))+'-0'+Number(length+1) 
            this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],pono:ttt,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"",bggys:""}
          }else{
             this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],pono:this.hawbdata.hawb,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"",bggys:""} 
          }

        })
  
          },
          // 查询鉴定证书
          searchJdzs(){
         
           // let jsonData={'json':JSON.stringify({where:searCondition(this.jdzsSearch)})}

           // this.jdzsSearchData.push({'customer':'KNN','jdzsbh':'2118013274','ypmc':'手机(内置锂电池/锂电池/锂离子电池)电池型号:616','sjdw':'师说电子(昆山)有限公司','scdw':'师说电子(昆山)有限公司','bzlx':'夹板托盒'},{'customer':'KNN2','jdzsbh':'2118013276','ypmc':'PP机(内置锂电池/锂电池/锂离子电池)电池型号:616','sjdw':'未完全二电子(昆山)有限公司','scdw':'师说电子(昆山)有限公司','bzlx':'夹板托盒2'})

          },

          showJdzs(index){
  
          	// this.jdzsInfo=true
          	// this.jdzsIndex=index
          },
          
          selectJdzsData(i,i2){
           //  this.declaration.declareList[this.currentIndex].jdzsData[i].jdzsbh=this.jdzsSearchData[i2].jdzsbh
           //  this.declaration.declareList[this.currentIndex].jdzsData[i].ypmc=this.jdzsSearchData[i2].ypmc
           //  this.declaration.declareList[this.currentIndex].jdzsData[i].sjdw=this.jdzsSearchData[i2].sjdw
           //  this.declaration.declareList[this.currentIndex].jdzsData[i].scdw=this.jdzsSearchData[i2].scdw
          	// this.jdzsInfo=false
          },
      }

        ,watch:{
         declaration:{
          handler:function(newVal){
            if(newVal.length==0){
              if(this.modify==0){
                this.curObject={jdzsData:[{jdzsbh:"",ypmc:"",sjdw:"",scdw:""}],pono:this.hawbdata.hawb,guid:"",piece:"",weight:"",lds:'0',bggysname:"",bglx:"",bggys:""} 
              }
             
            }
          },
          deep:true
         }
        }
        ,created(){

          //filterGroupid(this.jdzsSearch);
            let groupData = JSON.parse(localStorage.getItem('groupType'))
            for(var i in groupData){
              if(groupData[i].groupid==19){

                this.bglx.push({ 'value': groupData[i].typename, 'label': groupData[i].typename, ready02: groupData[i].ready02, id: groupData[i].id, key: groupData[i].typename + groupData[i].ready02  })
              }
            }
            ////console.log(this.hawbdata)

            
          this.getJdzsInfo()
          ////console.log(this.declaration.length)
          
          //this.linshihawb=this.declaration.declareList[0].bgdh
    
               // //console.log(this.currentObject)
    }
}

</script>
<style scoped lang="less">
.declare .title{border-top: none;border-bottom:1px solid #ccc;background:#efefef;}

.declare .bottom{border-bottom:1px solid #ccc;border-top:0;}
.declare .el-col{border-right:1px solid #ccc;}
.jdzsR{color:#000;padding:5px 5px 5px 10px;font-size: 14px;margin-top:20px;border:1px solid #ccc;border-bottom:0;}
.jdzsT tr{height:28px;line-height: 28px;}
.jdzsT tr th,.jdzsT tr td{border:1px solid #ccc;text-align:center;}


.el-pagination__editor{
  width:20px;
}
.el-pagination{
  height:40px;
  padding:5px 5px;
}

.pagination input{box-shadow:none;border:1px solid #20a0ff;}
.pagination .el-pagination .el-select .el-input{width:80px;}
.pagination .page-container-box .el-input__inner{width:80px!important;}
.declare .el-table td, .declare .el-table th{padding:6px 0;}
</style>
