<template>
<div>
<!-- {{amazonList}} -->
<!-- {{amazonInfo}} -->
<!-- {{first240Index}}
{{sfgMdgTime}} -->
<!-- {{first240Index}} -->
<!-- {{amazonInfo}}
	<p>1111</p>
	{{messagetypeAdd}}
	<p>11111</p>
	{{selectValue}}
	{{sfgMdgTime}} -->
	<div v-for="i in amazonList" :style="{'width':i=='240'?'830px':''}" >
		<div v-for="(i2,index2) in amazonInfo"  style="display:inline-block;margin-right:100px;width:300px;text-align:left;margin-bottom:20px;" v-if="i==i2.messagetype&&i2.isdel==1">
	
				
		
					<span style="display:inline-block;margin-right:12px;min-width:60px;text-align:left">{{i2.htmljson.name}}：</span>
					<span v-if="i2.htmljson.type=='utcdatetime'" style="display:inline-block">
						 <el-date-picker
						 v-model="i2.value"
                         type="datetime"
                         placeholder="选择日期时间"
                         default-time="12:00:00"
                         style="width:164px;"
                         >
                         </el-date-picker>
					</span>
					<span v-if="i2.htmljson.type=='input'" style="display:inline-block">
						<el-input v-model="i2.value" placeholder="请输入内容"></el-input>
					</span>
					<span v-if="i2.htmljson.type=='inputfloat'" style="display:inline-block">
						<el-input v-model="i2.value" placeholder="请输入内容"></el-input>
					</span>
					<span v-if="i2.htmljson.type=='select'" style="display:inline-block;width:160px;">
						<el-select v-model="i2.value" placeholder="请选择">
    					   <el-option
      					   v-for="item in JSON.parse(i2.htmljson.selectdom)"
                           :key="item.value"
                           :label="item.key"
                           :value="item.value"
                           :disabled="item.disabled"
                           style="width:160px;"
                           >
    						</el-option>
                          </el-select>
					</span>
					<span style="display:inline-block;font-size:16px;" @click="minusType(index2)">
					<i class="el-icon-remove blue" v-if="i=='240'&&index2>first240Index&&i2.htmljson.type=='utcdatetime'"></i>
					</span>
				

					
		

		</div>
		
        
      
		<div style="margin-bottom:20px;">
			<el-button type="primary"  notHide @click="save(i,'1')">保存</el-button>
			<el-button type="primary"  notHide @click="save(i,'2')">发送</el-button>
			<el-button type="primary"  notHide v-if="i=='240'" @click="addType">新增</el-button>
		</div>

	</div>

	
</div>	
</template>

<script>
import {formatDate,getNowFormatDate} from "../../api/localStorage.js";
export default {
  components: {
   
  },
  props: {
  inputModelData:Object
  },
  data () {
    return {
      amazonInfo:[],//亚马逊总信息
      amazonList:[],//保存发送类messagetype
      messagetypeAdd:[],//添加节点数据
      //messagetype240Length:0,//240节点下拉框数量
      addNodeIndex:'',//节点数
      first240Index:0,//第一次出现240节点时间位置
  
    }
  },
  created () {
  
   this.getAmazonInfo()

  },
  computed: {
 selectValue(){
 	let list=[]
 	this.amazonInfo.forEach(i=>{
 		if(i.messagetype=='240'&&i.htmljson.type=='select'&&i.value&&i.isdel=='1'){
 			list.push(i.value)
 		}
 	})
 	return list
 },
 messagetype240Length(){
   let num=0
   this.messagetypeAdd.forEach(i=>{
   	if(i.htmljson.type=='select'){
   		num=JSON.parse(i.htmljson.selectdom).length
   	}
   })
   return num
 },
 sfgMdgTime(){
 	let object={}
 	this.messagetypeAdd.forEach(i=>{
       if(i.htmljson.selectdom){
       	JSON.parse(i.htmljson.selectdom).forEach(i2=>{
       		this.$set(object,i2.value,i2.airport)
       	})
       }
 	})
 	return object
 }
  },
  watch:{
   amazonInfo:{
   	handler(val){
      val.forEach((i,index)=>{

      	  if(i.messagetype=='240'&&i.htmljson.type=='select'&&i.value){
             console.log(i)
      	  	 i.groupid=JSON.parse(i.htmljson.selectdom).filter(i2=>{return i2.value==i.value})[0].groupid
      	  	 this.amazonInfo[index+1].groupid=i.groupid
      	  }
      })
   	},
   	deep:true
   },
   selectValue(val){
   this.amazonInfo.forEach((i,index)=>{
   	if(i.htmljson.type=='select'&&i.messagetype=='240'){
   		let selectdom=[]
   			JSON.parse(i.htmljson.selectdom).forEach((i2,index2)=>{
   				if(val.indexOf(i2.value)!='-1'){
   				   i2.disabled=true	
   				}else{
   				   i2.disabled=false	
   				}
   				selectdom.push(i2)
   				
   		})
   	i.htmljson.selectdom=JSON.stringify(selectdom)
   	}

   })
   },
   sfgMdgTime(val){
       //始发港-8,目的港+8
	this.amazonInfo.forEach((item,index)=>{
		if((item.messagetype=='220'||item.messagetype=='250')&&item.value&&item.htmljson.type=='utcdatetime'){
      //item.value=new Date(item.value.setTime(item.value.getTime()-1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
			//item.value=item.value.DateFormat('yyyy-MM-dd HH:mm:ss',-8,'format')
		}else if(item.messagetype=='240'&&item.value&&item.htmljson.selectdom){
      if(val[item.value]=='sfg'){
        if(this.amazonInfo[index+1].value){
          this.amazonInfo[index+1].value=this.amazonInfo[index+1].value.DateFormat('yyyy-MM-dd HH:mm:ss',8,'format')
        }
      	
        //this.amazonInfo[index+1].value=new Date(this.amazonInfo[index+1].value.setTime(this.amazonInfo[index+1].value.getTime()+1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
      }else if(val[item.value]=='mdg'){
      //this.amazonInfo[index+1].value=new Date(this.amazonInfo[index+1].value.setTime(this.amazonInfo[index+1].value.getTime()-1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
        if(this.amazonInfo[index+1].value){
          this.amazonInfo[index+1].value=this.amazonInfo[index+1].value.DateFormat('yyyy-MM-dd HH:mm:ss',-8,'format')
        }
      	
      }
		}

	})	
	
   }
  },

  methods: {
  getAmazonInfo(){
    this.amazonList=[]
    this.amazonInfo=[]
    this.messagetypeAdd=[]
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplinePoStatus',params:{boguid:this.inputModelData.boguid},loading:true,tip:false})
    .then(results=>{
    	results.data.forEach(i=>{
    		i.htmljson=JSON.parse(i.htmljson)
    		if(i.htmljson.isdefault&&!i.value){
    			i.value=this.inputModelData[i.htmljson.isdefault]
    		}
    		this.amazonInfo.push(i)
    		if(this.amazonList.indexOf(i.messagetype)=='-1'){
    			this.amazonList.push(i.messagetype)
    		}
    	})
        //console.log(this.amazonInfo.filter(i=>{return i.messagetype=='240'}).length)
        this.addNodeIndex=this.amazonInfo.filter(i=>{return i.messagetype=='240'}).length/2-1
        console.log(this.addNodeIndex)
        JSON.parse(JSON.stringify(this.amazonInfo)).forEach((i2,index)=>{
        	if(i2.messagetype=='240'){
        	    if(this.messagetypeAdd.length<2){
        	    i2.groupid='-1'	
        	    i2.id='-1'	
        	    i2.value=''
        	    this.messagetypeAdd.push(i2)	
        	    }
              //console.log(i2.value.substring(0,4)+'-'+i2.value.substring(4,6)+'-'+i2.value.substring(6,8)+' '+i2.value.substring(8,10)+':'+i2.value.substring(10,12)+':'+i2.value.substring(12,14))
            
                // i2.value=i2.value.substring(0,4)+'-'+i2.value.substring(4,6)+'-'+i2.value.substring(6,8)+' '+i2.value.substring(8,10)+':'+i2.value.substring(10,12)+':'+i2.value.substring(12,14)
                // console.log(i2.value.substring(0,4)+'-'+i2.value.substring(4,6)+'-'+i2.value.substring(6,8)+' '+i2.value.substring(8,10)+':'+i2.value.substring(10,12)+':'+i2.value.substring(12,14))
                //console.log(i2.value)
              
              
        	}
        })

        this.amazonInfo.forEach((i2,index)=>{
	        if(i2.htmljson.type=='select'&&!i2.value&&i2.messagetype=='240'){
	        	//this.messagetype240Length=JSON.parse(i2.htmljson.selectdom).length//240节点长度
	        	i2.value=JSON.parse(i2.htmljson.selectdom)[0].value//默认赋值第一个
	        }else if(i2.htmljson.type=='utcdatetime'&&i2.messagetype=='240'){

            if(!this.first240Index){
              this.first240Index=index
            }
	        	
            if(i2.value){
              i2.value=i2.value.substring(0,4)+'-'+i2.value.substring(4,6)+'-'+i2.value.substring(6,8)+' '+i2.value.substring(8,10)+':'+i2.value.substring(10,12)+':'+i2.value.substring(12,14)
            }else{
              i2.value=""
            }
            
	        }
        })
        console.log(this.amazonInfo)

         
    })
    .catch(error=>{

    })
  },
  addType(){
   //alert('1')
   this.addNodeIndex++;

   if(this.addNodeIndex>this.messagetype240Length-1){
   	//alert('1')
   	this.addNodeIndex=this.messagetype240Length-1
   	return 
   }
   //console.log(this.addNodeIndex)
   JSON.parse(JSON.stringify(this.messagetypeAdd)).forEach((i,index)=>{
   	//console.log(i)
   	if(i.htmljson.type=='select'){
   		let selectdom=[]
   		let valueList=[]
   			JSON.parse(i.htmljson.selectdom).forEach((i2,index2)=>{
   				if(this.selectValue.indexOf(i2.value)!='-1'){
   				   i2.disabled=true	
   				}else{
   				   i2.disabled=false
   				   valueList.push(i2.value)	
   				}
   				selectdom.push(i2)
   				
   		})
   	i.htmljson.selectdom=JSON.stringify(selectdom)
    i.htmljson.isbr='1'
    i.value=valueList[0]
   	}

   	this.amazonInfo.push(i)
   })


  },
  minusType(index){
//console.log(index)

this.addNodeIndex=this.addNodeIndex-1;
if(this.addNodeIndex<0){
	this.addNodeIndex=0
	return
}


this.amazonInfo.forEach((i,index2)=>{
if(index2==index||index2==index-1){

    this.$set(i,'isdel','2')
}
})
//this.amazonInfo=this.amazonInfo.filter((i,index2)=>{return index2!=index&&index2!=index-1})
//console.log(index)
//this.amazonInfo.filter(i=>{return i.messagetype=='240'&&})

},

save(i,status){
	var disable=[]
	if(i=='240'){
      this.amazonInfo.forEach(item=>{
      	if(item.messagetype=='240'&&!item.value&&item.isdel!='2'){
           disable.push(item)
      	}
      })
	}
	if(disable.length){
		this.$message.error('请填写完整信息')
		return
	}

	if(status=='2'){
      if(this.amazonInfo.filter(item=>{return item.messagetype==i&&!item.value&&item.isdel!='2'}).length){
      	this.$message.error('请填写完整相应信息')
      	return 
      }
	}
	

    //始发港-8,目的港+8
	this.amazonInfo.forEach((item,index)=>{
		if((item.messagetype=='220'||item.messagetype=='250')&&item.value&&item.htmljson.type=='utcdatetime'){
            //item.value=new Date(item.value.setTime(item.value.getTime()-1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
       //console.log(item.value)     
			//item.value=(item.value.Format('yyyy-MM-dd hh:mm:ss')).DateFormat('yyyy-MM-dd HH:mm:ss',-8).Format('yyyy-MM-dd hh:mm:ss')
			//console.log(item.value.Format('yyyy-MM-dd hh:mm:ss'))
		}else if(item.messagetype=='240'&&item.value&&item.htmljson.selectdom){
            if(this.sfgMdgTime[item.value]=='sfg'){
//console.log(this.amazonInfo[index+1].value.getTime())
            //this.amazonInfo[index+1].value=this.amazonInfo[index+1].value.Format('yyyy-MM-dd hh:mm:ss').DateFormat('yyyy-MM-dd HH:mm:ss',-8).Format('yyyy-MM-dd hh:mm:ss')
              //this.amazonInfo[index+1].value=new Date(this.amazonInfo[index+1].value.setTime(this.amazonInfo[index+1].value.getTime()-1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
             
       //console.log(new Date(this.amazonInfo[index+1].value))
              
            }else if(this.sfgMdgTime[item.value]=='mdg'){

              var d=new Date(this.amazonInfo[index+1].value)

              this.$set(this.amazonInfo[index+1],'value',this.addEight(d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())))
              
              //console.log(this.amazonInfo[index+1].value)
                //this.amazonInfo[index+1].value=;  
                //console.log(this.amazonInfo[index+1].value)
              // console.log(this.amazonInfo[index+1])
              //console.log(d)
              
              //console.log(d)
              //console.log(item)
              //console.log(this.amazonInfo[index+1])
              // this.amazonInfo[index+1].value=d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate()) + ' ' + this.p(d.getHours()+8) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds());  
              // console.log(this.amazonInfo[index+1])
              //console.log(item)
              //console.log(this.amazonInfo[index+1])
             // this.amazonInfo[index+1].value=new Date(this.amazonInfo[index+1].value.setTime(this.amazonInfo[index+1].value.getTime()+1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
            	//this.amazonInfo[index+1].value=new Date(this.amazonInfo[index+1].value.setTime(this.amazonInfo[index+1].value.getTime()+1000*8*60*60)).toJSON().substr(0, 19).replace('T', ' ')
           
            //this.amazonInfo[index+1].value=this.amazonInfo[index+1].value.Format('yyyy-MM-dd hh:mm:ss').DateFormat('yyyy-MM-dd HH:mm:ss',8).Format('yyyy-MM-dd hh:mm:ss')
            	//console.log(this.amazonInfo[index+1].value)
            }
		}

	})	
	

this.amazonInfo=this.amazonInfo.filter(i=>{return !(i.id=='-1'&&i.isdel=='2'&&i.messagetype=='240')})
 console.log(this.amazonInfo)
  var data={pono:this.inputModelData.orderno,boguid:this.inputModelData.boguid,sfg:this.inputModelData.sfg,mdg:this.inputModelData.mdg,status:status,messagetype:i,postatuslist:this.amazonInfo}
  console.log(data.postatuslist)
  this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplinePoStatus',data:data,loading:true,tip:false})
  .then(results=>{
     if(results.data.resultstatus == 0){
     	this.$message.success('更新成功')
      this.amazonInfo=[]
     	this.getAmazonInfo()
     }else{
     	this.$message.error('新增失败')
     }
  })
  .catch(error=>{

  })
  },
  //时间+8，-8
    addEight(fnTime){
    var x = fnTime; 
    var time = new Date(x);
    var timeNum = 16;
    time.setHours(time.getHours() + timeNum);
    return time;
    },
    p(s){
     return s<10?'0'+s:s
    }


}

}
</script>

<style lang="less" scoped>
	.blue{
		cursor:pointer;
		font-size:16px;
		&:hover{
			color:#0f5a8c;
		}
	}
</style>