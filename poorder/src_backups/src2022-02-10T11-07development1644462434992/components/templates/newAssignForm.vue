<template>
  <div>
  	<newFormCmpt  :view-data.sync="newView" :model-data.sync="inputModelData">

  	</newFormCmpt>
  	<div class="input-required require" v-if="wageinout=='1'&&inputModelData.ysjffs=='板外'||wageinout=='2'&&inputModelData.yfjffs=='板外'||type=='中转费'">
  		<span class="fuhao">(</span> <el-select v-model="jsList.first" placeholder="请选择">
		    <el-option
		      v-for="item in jsList.list"
		      :key="item.value"
		      :label="item.title+(item.title.length>=6?'       ':'               ')+item.num"
		      :value="item.value">
			   <span style="float: left">{{ item.title }}</span>
			   <span style="float: right">{{ item.num }}</span>
		    </el-option>
		  
  		 </el-select>

  		 <span class="fuhao">-</span>
         <el-select v-model="jsList.second" placeholder="请选择">
		    <el-option
		      v-for="item in jsList.list"
		      :key="item.value"
		      :label="item.title+(item.title.length>=6?'       ':'               ')+item.num"
		      :value="item.value">
		      <span style="float: left">{{ item.title }}</span>
		      <span style="float: right">{{ item.num }}</span>
		    </el-option>
  		 </el-select>
  		 <span class="fuhao">)</span>
  		 <span class="fuhao">X</span>
  		 <div class="group" v-for="i in inputList" v-if="wageinout==i.wageinout&&type==i.type">
  		 	基港实际分泡
  		 	<span style="margin-left:16px;">WFF <input v-model="inputModelData[i.fp1]" @change="fpChange(i.fp1,inputModelData[i.fp1],i.fp2)"></span>
  		 	<span style="margin-left:4px;">客户 <input v-model="inputModelData[i.fp2]" @change="fpChange(i.fp2,inputModelData[i.fp2],i.fp1)"></span>
  		 </div>
  		 <span class="fuhao">+</span>
  		  <el-select v-model="jsList.third" placeholder="请选择">
		    <el-option
		      v-for="item in jsList.list"
		      :key="item.value"
		      :label="item.title+(item.title.length>=6?'       ':'               ')+item.num"
		      :value="item.value">
		      <span style="float: left">{{ item.title }}</span>
		      <span style="float: right">{{ item.num }}</span>
		    </el-option>
  		 </el-select>
  		 <span class="fuhao">=</span>
  		 <div class="results" v-for="i in inputList" v-if="wageinout==i.wageinout&&type==i.type">
  		 	基港{{type}}结算重量：{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?$parent.$parent.$parent[i.accountWeight]:'0.00'}}
			   <!-- {{inputModelData['zzyfweight']}} -->
		        <el-input
		        v-model="inputModelData[i.input]"
		        style="width:76px;"
		        @input="$parent.$parent.$parent.accountInput(i.input)"
		        ></el-input>
  		 </div>
  	</div>
  </div>
</template>
<script>
export default {
  name: 'newAssignForm',
  props:{
  	inputModelData:Object,//表单数据
  	viewData:Object,//表单
  	type:String,//运费，中转费
	wageinout:String,//应收，应付
    activeTab:String,//激活点入
  },
  data () {
    return {
    	newView:{},
    	jsList:{
    		list:[{title:'实际计费重量',value:'sjjfweight',num:''},{title:'制单毛重',value:'zdweight',num:''},{title:'制单计费重量',value:'zdjfweight',num:''},{title:'实际重量',value:'realweight',num:''}],
    		first:'',
    		second:'',
    		third:'',
    	},
    	inputList:[{
    		type:'运费',wageinout:"1",accountWeight:'accountweightin',input:'accountweightin',fp1:'self_real_bp_freight_in',fp2:'cus_real_bp_freight_in'
    	},{
    		type:'运费',wageinout:"2",accountWeight:'accountweightout',input:'accountweightout',fp1:'self_real_bp_freight_out',fp2:'cus_real_bp_freight_out'
    	},{
    		type:'中转费',wageinout:"1",accountWeight:'accountweightinZz',input:'zzysweight',fp1:'self_real_bp_trans_in',fp2:'cus_real_bp_trans_in'
    	},{
    		type:'中转费',wageinout:"2",accountWeight:'accountweightoutZz',input:'zzyfweight',fp1:'self_real_bp_trans_out',fp2:'cus_real_bp_trans_out'
    	}]
    }
  },
  components:{ 

  },
  methods:{
    handleGs(){
    	console.log('222')
    var obj={}
    if(this.type=='运费'&&this.wageinout=='1'){
    	obj=eval('(' + this.inputModelData.ysjsgs + ')')
    }else if(this.type=='运费'&&this.wageinout=='2'){
    	obj=eval('(' + this.inputModelData.yfjsgs + ')')
    }else if(this.type=='中转费'&&this.wageinout=='1'){
    	obj=eval('(' + this.inputModelData.zzysjsgs + ')')
    }else if(this.type=='中转费'&&this.wageinout=='2'){
    	obj=eval('(' + this.inputModelData.zzyfjsgs + ')')
    }		
    console.log(obj)
	Object.keys(obj).forEach(i=>{
   		this.jsList[i]=obj[i]
   	})	

    },
    fpChange(id,self,otherid) {//自身field、自身value、关联iD
       var reg = /^([0-9]+([.]{1}[0-9]{0,1})?)$/;
       if (!reg.test(Number(self)) || Number(self) > 10) {
            return this.$message.error("请输入0-10的小数");
            //格式不正确清空
            this.inputModelData[id] = "";
        } else {
            this.inputModelData[id] = Number(self);
            this.inputModelData[otherid] = Number(10 - Number(self));
            if (String(this.inputModelData[otherid]).indexOf(".") != "-1") {
                this.inputModelData[otherid] = Number(this.inputModelData[otherid]).toFixed(
                    1
                );
            }
        }
    }

  },
  mounted:function(){ 
    this.$store.state.showloading=true
    setTimeout(()=>{
	    	Object.keys(this.viewData).forEach(i=>{
	      	if(this.viewData[i].class==this.type){
	      		this.$set(this.newView,i,this.viewData[i])
	      	}
	       })

       //console.log(this.newView)
       this.jsList.list.forEach(i=>{
    	var value=this.inputModelData[i.value]||this.$parent.$parent.$parent[i.value]
    	i.num=Number(value).toFixed(0)
       })
	   this.handleGs()
	
	},2000)

	setTimeout(()=>{
		 this.$store.state.showloading = false   
	},3000)
  },
  created:function(){
  },
  computed:{
   
  },
  watch:{

  }
}
</script>
<style lang="less" scoped>
.require{
    display:flex;
    justify-content: space-between;
	.el-select{
		width:160px;
	}
	.fuhao{
		display:inline-block;
		font-size:16px;
		margin-left: 2px;
		margin-right: 2px;
	}
	.group{
		width:220px;
		border: 1px solid #DCDFE6;
		background: #fff8ef;
		color: #606266;
		height:28px;
		border-radius:4px;
		line-height:26px;
		font-size:13px;
		text-indent: 1em;
		input{
			width:18px;
		    border:none!important;
		}
	}
	.results{
		height:28px;
		line-height: 26px;
	}
}
</style>