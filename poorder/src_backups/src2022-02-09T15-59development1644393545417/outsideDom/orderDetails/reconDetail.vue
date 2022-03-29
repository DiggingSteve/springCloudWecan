<template>
  <div>

<!--   	<span style="cursor:pointer;float:right;margin-top:50px;">
  		<i class="el-icon-arrow-left" style="font-weight:bolder;font-size:16px;color:#000;"></i>
  		<span style="color:#000;font-size:16px;" @click="closeDialog">{{$t('common.back')}}</span>
  	</span> -->
  	 <infoList :inputModelData="rowData" :ifopendetail="false"  :title="'pono'" ref="infoButton" :showDeatil="'3'">
  	    <template slot="confirmDz">

  	     <el-button type="primary" @click="confirmDz">
  	     {{$t('tips.confirm')}}
  	     </el-button>
  	    </template>

  	    <template slot="backDz">
  
  	     <el-button type="primary" @click="backDz">
  	     {{$t('tips.back')}}
	     </el-button>
  	    </template>

        <template slot="back">
          <span style="margin-left:100px;cursor:pointer">
            <i class="el-icon-arrow-left" style="font-weight:bolder;font-size:16px;color:#000;"></i>
            <span style="color:#000;font-size:16px;" @click="closeDialog">{{$t('common.back')}}</span>
          </span>
        </template>
      </infoList>
  	<embed :src="`${$store.state.webApi}api/ExAiraxpCheckBillPchUnFinishImage?sid=${rowData.settjobid}&fid=${getFid}&accountcomname=${getAccountcomname}`" width="100%" height="800px">
  <!-- 	<img v-for="item in imgurl" :src="`data:image/png;base64,${item}`"> -->

	<!-- 取消对账弹框 -->
	<el-dialog width="800px"
	top="4%"
	center
	:visible.sync="abanDz"
	v-if="abanDz" append-to-body

	custom-class="reason"
	>

		<div>



	<div class="orderSystem-c">
		<h3>{{$t('cancelDzDialog.cancelReason')}}</h3>
		<p class="orderNo">
			<span style="color:#004d84;float:left;font-weight:bold">{{rowData.wageList[0].pono}}</span>
			<span style="color:#333;float:right">{{rowData.accountcomname}}</span>
		</p>
		<ul>
			<li>{{$t('cancelDzDialog.mawb')}}</li>
			<li>{{$t('cancelDzDialog.sfg')}}</li>
			<li>{{$t('cancelDzDialog.mdg')}}</li>
			<li>{{$t('cancelDzDialog.realjzt')}}</li>
			<li>{{$t('cancelDzDialog.hbh')}}</li>
			<li>{{$t('cancelDzDialog.hbrq')}}</li>
		</ul>
		<ul style="margin-top:3px;">
			<li>{{rowData.mawb}}</li>
			<li>{{rowData.sfg}}</li>
			<li>{{rowData.mdg}}</li>
			<li>{{rowData.realjzt}}</li>
			<li>{{rowData.hbh}}</li>
			<li>{{rowData.hbrq.substring(0,10)}}</li>
		</ul>

		<el-input type="textarea" v-model="abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="工作号取消原因输入框"></el-input>

		<div class="costItems">
			<div  style="width:710px;overflow:hidden;display:inline-block" >
				<ul class="costItemsList" style="width:10000px;overflow:hidden;">
					<li v-for="(item,index) in rowData.wageList" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
						<el-badge is-dot class="item" v-if="item.abandonReason">{{item.items}}</el-badge>
						<span v-else>{{item.items}}</span>
					</li>
				</ul>
			</div>

			<div style="display:inline-block">
				<i class="el-icon-caret-left"  @click="changeDirection(1)"></i>
				<i class="el-icon-caret-right" @click="changeDirection(2)"></i>
			</div>

		</div>

		<div class="costItemsContent" style="margin-top:16px;">
			<ul>
				<li>{{$t('cancelDzDialog.realwageallrmb')}}</li>
				<li>{{$t('cancelDzDialog.price')}}</li>
				<li>{{$t('cancelDzDialog.num')}}</li>
				<li>{{$t('cancelDzDialog.currency')}}</li>
			</ul>
			<ul style="margin-top:3px;">
				<li>{{rowData.wageList[costItemsActive].realwageallrmb}}</li>
				<li>{{Number(rowData.wageList[costItemsActive].price).toFixed(2)}}</li>
				<li>{{rowData.wageList[costItemsActive].num}}</li>
				<li>{{rowData.wageList[costItemsActive].currency}}</li>
			</ul>

			<el-input type="textarea" v-model="rowData.wageList[costItemsActive].abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:8px;color:#c8c8c8" :placeholder="rowData.wageList[costItemsActive].items+'取消原因输入框'"></el-input>

		</div>


	</div>

	<p style="margin-top:18px;text-align:right">
		<el-button @click="cancelDzFw(wageIdS)" type="primary">{{$t('common.confirm')}}</el-button>
		<el-button @click="closeAbanDz">{{$t('common.cancel')}}</el-button>
	</p>
</div>
</el-dialog>
</div>

</template>

<script>




export default {

  props: {
    rowData: {
      type: Object,
    },
    openIndex:[Number,String],
    visible: Boolean
  },
  data() {
    return {
      wageinout:'',
      costItemsActive:0,//激活费用服务
      abandonReason:'',//工作号取消原因
      abanDz:false,//取消对账弹框显示
      wageIdS:'',//取消对账ids
      imgurl:[],
  }
},
  created() {

//this.getReconPic()



  },
  methods: {
  	//关闭弹框
  	closeDialog(){
  		this.$emit('update:visible', false)
  	},
  	//获取图片
  	// getReconPic(){
  		
  	// 	if(this.rowData){
  	// 		    	this.$axios({"method":"get",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchUnFinishImage',params:{sid:this.rowData.settjobid,fid:sessionStorage.gid,accountcomname:sessionStorage.usr_name},loading:true})
   //  	.then(results=>{
      
   //         this.imgurl=results.data

   //  	})
   //  	.catch(error=>{

   //  	})
  	// 	}

  	// },
   //确认对账
   confirmDz(){
   	var data={czman:sessionStorage.out_logname,settjobid:this.rowData.settjobid,fid:sessionStorage.out_gid}
   	this.$axios({"method":"post",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchBySid',data:data,loading:true})
   	.then(results=>{
   		if(results.data.resultstatus==0){
   			this.$message.success(results.data.resultmessage+',  唯凯对账号为:'+results.data.resultno)
   			this.$emit('update:visible', false)
   			this.$emit('spliceTab',this.openIndex)
    }else{
    	this.$message.error(results.data.resultmessage)
    }
})
   	.catch(error=>{

   	})
   },
   //取消对账弹框
   backDz(){
     this.wageIdS=""
     this.costItemsActive=0
     this.abanDz=true
     this.rowData.wageList.forEach(item=>{
     	this.$set(item,'abandonReason','')
     	this.wageIdS+=item.wageguid+','
     })
     this.area=this.rowData.area
     this.wageinout=this.rowData.wageinout

 },
   //取消操作
   closeAbanDz(){
   	this.abanDz=false;
   	this.abandonReason="";
   	this.rowData.forEach(item=>{
   		item.wageList.forEach(item2=>{
   			this.$set(item2,'abandonReason','')

   		})
   	})
   },
    //取消对账方法
    cancelDzFw(){

    	var abandonReasonLength=0
    	var delbillreasonJson=[]
    	this.rowData.wageList.forEach(item=>{
    		abandonReasonLength+=item.abandonReason.length
    		delbillreasonJson.push({delbillreason:item.abandonReason,wageguid:item.wageguid})
    	})
    	if(!this.abandonReason&&abandonReasonLength==0){
    		this.$message.error('请填写取消对账原因');
    		return false;
    	}

    	let data = {
    		area:this.area,
    		system:'外网',
    		wageguidArr:this.wageIdS.substring(0,this.wageIdS.length-1),
    		delbillreason:this.abandonReason,
    		delbillreasonJson:delbillreasonJson,
    		isoutside :true,
    		accountcomname:sessionStorage.out_usr_name,
    		reasontype: this.wageinout == '1' ? '应收对账驳回' : '应付对账驳回'
    	}

    	this.$axios({"method":'delete',url:this.$store.state.webApi+'api/ExAiraxpCheckBillPchWage',data: data})
    	.then(results=>{
    		if(results.data.resultstatus!=0){
    			this.$message.error(results.data.resultmessage)
    		}else{
    			this.$message.success(results.data.resultmessage)
    			this.abanDz=false
    			this.abandonReason=""
    			this.$emit('update:visible', false)
    			this.$emit('spliceTab',this.openIndex)
    		}
    		this.wageIdS=""
    	})
    	.catch(error=>{

    	})

    },


    changeDirection(type){
    	var clientWidth=0
    	if(type==1){
    		this.arrowIndex--;
    		if(this.arrowIndex<0){
    			layer.msg('已至头部');
    			this.arrowIndex=0
    			return false;
    		}
    	}else if(type==2){

    		$('.costItemsList').find('li').each(function(){

    			clientWidth=clientWidth+$(this).innerWidth()
    		})

    		if(clientWidth<710){
    			this.arrowIndex=0
    			return false
    		}else{
    			this.arrowIndex++
    		}

    		if(this.arrowIndex>Math.ceil((clientWidth-710)/200)){
    			layer.msg('已至尾部');
    			this.arrowIndex=Math.ceil((clientWidth-710)/200)
    			return false
    		}
    	}

    	$('.costItemsList').css('transform','translateX(-'+this.arrowIndex*200+'px)')


    },


  }
  , computed: {

    getFid(){
      return sessionStorage.out_gid
    },

    getAccountcomname(){
      return sessionStorage.out_usr_name
    }


  },
  mounted() {


  },
  watch: {

  },
 


}

</script>

<style lang="less" scoped>
 .reason{
  h3{font-size: 18px;color: #004d84;}
  .el-dialog__body{padding:8px 40px;}
  .orderNo{
    margin-top:12px;padding-bottom:10px;border-bottom:1px solid #e8e8e8;font-size:13px;margin-bottom:12px;
    &:after{
      content:'';display:block;clear:both
    }
  }
  ul li{
    display:inline-block;width:100px;text-align:left;color:#999
  }
  .costItems{
    margin-top:16px;
    padding-bottom:10px;
    border-bottom:1px solid #e8e8e8;
    overflow:hidden;
    li{
      display:inline-block;
      cursor:pointer;
      padding-right:16px;
      width:auto;
      &:hover{color:#004d84}
        /deep/.el-badge__content.is-fixed.is-dot{
        right:2px;
      }
      /deep/.el-badge__content.is-fixed{
        top:3px;
        transform:translateY(-46%) translateX(100%);
      }
      /deep/.el-badge{
        vertical-align:inherit;
      }
    }

    .el-icon-caret-left{
      font-size:16px;
      cursor:pointer;
      &:hover{color:#004d84}
    }
     .el-icon-caret-right{
      font-size:16px;
      cursor:pointer;
      margin-left:-8px;
      &:hover{color:#004d84}
    }

  }

}
img{width:100%;}
</style>
