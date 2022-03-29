<template>
  <div class="address">
<!-- {{shipaceData}} -->
<!-- {{inputModelData}} -->
     <newFormCmpt
                  :view-data.sync="inputViewModel"
                  :model-data.sync="inputModelData"
  
    ></newFormCmpt>
    <el-button @click="saveShipace">保存</el-button>
    <el-button @click="closeDialog">返回</el-button>
  </div>
</template>

<script>
export default {
  props: {
  shipaceData:{
	type:Object
  },
  shipaceDataList:{
  type:Array,
  default: function () {
        return []
    }
  },
  visible:{
  	type:Boolean
  },
  operationType:{//1 新增  2修改(航班号 航班日期未锁死 舱位信息修改)  3新增舱位并配舱(航班号 航班日期锁死)
    type:String
  }
},
  data() {
    return {
    inputViewModel:{
       hbh:{
       	type:1,
       	title:'航班号:',
        verify:'uppercase'
       },
       hbrq:{
       	 title:'航班日期：',
          type: 6,
          //format: "yyyy-MM-dd",
          required:true
       },
       qfsj:{
       	 title:'起飞时间：',
          type: 29,
          format: "HH:mm",
          required:true
       },
       loadingmodel:{
         title:'配载方式',
         type:4,
         groupid:37,
         required:true
       },
       terminalname:{
        title:'交接地',
        type:4,
        options:[],
        //groupid:20,
        required:true
       
       },
       
       splitstring:{
       	title:'分隔符',
       	type:1,
       },
       shipacexz:{
       	title:'舱位性质',
       	type:4,
       	groupid:38,
        required:true
       },
       weight:{
        title:'可配载重量',
        type:1,
        verify:'float'
       },
       volume:{
        title:'可配载体积',
        type:1,
        verify:'float'
       },
      
       ysfs:{
       	title:'运输条件',
       	type:4,
       	groupid:7,
        required:true,
        allSelect:true
       	
       },
       hwxz:{
       	title:'货物性质',
       	type:4,
       	groupid:115,
        required:true,
        allSelect:true
       },
       yslx:{
       	title:'运输类型',
       	type:4,
       	groupid:21,
       	required:true
       },
       czlx:{
         title:'操作类型',
         type:4,
         groupid:132,
         required:true,
         allSelect:true
       },
       
       sfg:{
       	title:'始发港',
       	type: 20,
        pagetype: 6,
        required:true
       },
       pzcontent:{
       	title:'舱位内容',
       	type:17,
        itemStyle: { width: "578px" ,minWidth:'578px'}
       }
    },
    inputModelData:{sfg:'PVG',yslx:'国际货',shipacexz:'正常货',czlx:'全部',hwxz:'全部',ysfs:'全部'},
    qfsjsid:'',
    }
  },
  created() {
    this.$watch(
      function() {
        return this.inputModelData.hbrq + this.inputModelData.hbh+this.inputModelData.sfg;
      },
      function(val) {
        if (val) {
          //console.log(this.inputModelData.qfsj)
        	//if(!this.inputModelData.qfsj||this.inputModelData.qfsj.indexOf('00:00')!='-1'){
        		this.getQfsj()
        	//}
        	
        }
      },
      { immediate: true }
    );
      this.$watch(
      function() {
        return this.inputModelData.sfg;
      },
      function(val) {
        if (val) {
          this.inputViewModel.terminalname.options=[]
          this.inputModelData.terminalname=''
          JSON.parse(localStorage.jjd).filter(i=>{return i.sfg==val}).forEach(i2=>{
            this.inputViewModel.terminalname.options.push({value:i2.cname,label:i2.cname})
          })
          //console.log(JSON.parse(localStorage.jjd).filter(i=>{return i.sfg==val}))
          
        }
      },
      { immediate: true }
    );
    if(this.operationType=='1'){
    	this.inputModelData={'sfg':'PVG',yslx:'国际货',shipacexz:'正常货',czlx:'全部',hwxz:'全部',ysfs:'全部'}
    }
   
  },
  watch: {
   shipaceData:{
   	
   	handler(val){
    //console.log(val)
    var data={...val}
    Object.keys(data).forEach(i=>{
     	Object.keys(this.inputViewModel).forEach(i2=>{

     		if(i==i2){

          if(i=='czlx'&&data[i]){
            if(data[i]=='唯凯配舱'||data[i]=='自货'){
              data[i]='自货'
            }else{
              data[i]='代操作'
            }
          }
     			this.$set(this.inputModelData,i,data[i])
          if(!this.shipaceDataList.length){
             if((i=='czlx'&&!data[i])||(i=='hwxz'&&!data[i])||(i=='ysfs'&&!data[i])){
           this.$set(this.inputModelData,i,'全部')
          }
        }else{
          if((i=='czlx')||(i=='hwxz')||(i=='ysfs')){
         this.$set(this.inputModelData,i,'全部')
        
     		}else if((i=='yslx')){
          this.$set(this.inputModelData,i,'国际货')
        }else if((i=='shipacexz')){
          this.$set(this.inputModelData,i,'正常货')
        }
        }
      }
     	})
       //this.inputViewModel.forEach()
     })
    if(data.czlxList){
      if(data.czlxList.length>1){
      this.$set(this.inputModelData,'czlx','全部')
    }else{
      this.$set(this.inputModelData,'czlx',data.czlxList[0]=='唯凯配舱'||data.czlxList[0]=='自货'?'自货':'代操作')
    }
    }

    
   	},
   	deep:true,
   	immediate:true
     
   },
   operationType:{
   	handler(val){
   		console.log(val)
   		   	if(val=='3'){
   		this.inputViewModel.hbh.disabled=true
   		this.inputViewModel.hbrq.disabled=true
   	}else{
   		this.inputViewModel.hbh.disabled=false
   		this.inputViewModel.hbrq.disabled=false
   	}
   },
   immediate:true

   }
  },
  computed: {

  },
  methods: {
closeDialog(){
	 	if (this.visible) {
        this.$emit("update:visible", false);
      }
  },

  getQfsj() {
      // if (
      //   !this.$store.state.areaState ||
      //   this.$store.state.areaState.split(",").length != 1
      // ) {
      //   //console.log(this.shipaceData)
      //   this.$message.error("请先选择区域！");
      //   return;
      // }

      if(!this.shipaceData.area){
        return this.$message.error("请先选择区域！")
      }


      var sfg = this.inputModelData.sfg;
      var hbh = this.inputModelData.hbh;
      var hbrq = this.inputModelData.hbrq;
      if (hbh && hbh.length < 2) {
        return;
      }
      var json = {
        //area: this.$store.state.areaState,
        area: this.shipaceData.area,
        sfg: sfg,
        hbh: hbh,
        hbrq: hbrq,
        jid: ""
      };
      if (sfg && hbh && hbrq) {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
          params: json,
          loading: false,
          tip: false
        }).then(results => {
          //console.log("起飞时间");
          //console.log(results.data);
          var qfsj = results.data.resultdic && results.data.resultdic.flytime;
          this.qfsjsid = results.data.resultdic && results.data.resultdic.sid;
         
          if (qfsj && qfsj.indexOf("1900") == -1) {
          	this.$set(this.inputModelData,'qfsj',qfsj)
            this.$set(this.inputModelData,'terminalname',results.data.resultdic.jjdname)
           //this.$set(this.inputModelData,'loadingmodel',results.data.resultdic.pzfs)
            //this.inputModelData.qfsj = qfsj;
          } else {
          	this.$set(this.inputModelData,'qfsj','')
            //this.inputModelData.qfsj = "";
          }

        });
      } else {
      	this.$set(this.inputModelData,'qfsj','')
        //this.inputModelData.qfsj = "";
      }
    },

    saveShipace(){

      //var requiredList=[]
      var noSearch=false
      Object.keys(this.inputViewModel).forEach(i2=>{
        if(this.inputViewModel[i2].required){
          if(!this.inputModelData[i2]){
            this.$message.error(this.inputViewModel[i2].title+'为必填项');
            noSearch=true
            //return 
          }
        }
      })
      if(!noSearch){
          var methods=this.operationType=='1'?'post':'put'
      var url=this.operationType=='3'?'api/ExHpoAxplineInsertAndSetShipace':'api/ExHpoAxplineShipace'
      var json={}
        if(this.operationType=='1'||this.operationType=='2'){
          json=this.inputModelData
          if(this.operationType=='2'){
            //console.log(this.shipaceData.guid)
            json.guid=this.shipaceData.shipaceguid||this.shipaceData.guid
          }
        }else{
          json.shipace=this.inputModelData
          if(!this.shipaceDataList.length){
             json.ShipaceList=[{mawb:this.shipaceData.mawb,guid:this.shipaceData.guid,shipaceid:-1,mdg:this.shipaceData.mdg,hwxz:this.inputModelData.hwxz,gid:this.shipaceData.gid,czlx:this.shipaceData.czlx=='唯凯配舱'||this.shipaceData.czlx=='自货'?'自货':'代操作'}]
           }else{
            json.ShipaceList=[]
             this.shipaceDataList.forEach(i=>{
              json.ShipaceList.push({mawb:i.mawb,guid:i.guid,shipaceid:-1,mdg:i.mdg,hwxz:i.hwxz,gid:i.gid,czlx:i.czlx=='唯凯配舱'||i.czlx=='自货'?'自货':'代操作'})
             })
           }
            if(json.ShipaceList.some(i=>{return !i.mawb})){
          this.$message.error('总运单号空缺')
          return 
        }
         
        }
      this.$axios({
            method: methods,
            url: this.$store.state.webApi + url,
            data: json,
            tip: false
          })
      .then(results=>{
             if(results.data.resultstatus==0){
                          this.$message.success(results.data.resultmessage)
                          if(this.operationType=='1'){
                            this.$emit('reSearch')
                          }else if(this.operationType=='2'){
                            //this.$emit('reSearch',json)
                            this.$emit('reSearch')
                          }else if(this.operationType=='3'){
                            this.$emit('reSearch')
                          }
                          this.$emit("update:visible", false);
                          //this.inputModelData={sfg:'PVG'}
                          //this.search()
                        }else{
                          this.$message.error(results.data.resultmessage)
                        }
      })
      .catch(error=>{

      })
    }
    
    }

}
}
</script>

<style lang="less" scoped>

</style>
