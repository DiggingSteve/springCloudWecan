<template>
   <div>
	<div class="mawb-add">
       	<commonTable
			:head="mawbTableHead"
			:table-data="list"
			class="commonTable">
		</commonTable>
    </div>

    <div>
        <div class="detail basic-information">
  	      <div class="detail-title">
  	        <p>{{title}}</p>
  	      </div>
  	      <div class="detail-c" style="max-width:1000px">
  	        <newFormCmpt :view-data.sync="type=='1'?transform:booking" :model-data.sync="inputModelData"></newFormCmpt>
  	      </div>
        </div>
      </div>

      <div class="btn-c" style="text-align:right;margin-top:10px;">
		<el-button type="primary" v-if="type=='1'||type=='2'" @click="saveOperate(type)">保存</el-button>
		<el-button type="primary" v-if="type=='2'" @click="saveOperate(type,'print')">保存并打印</el-button>
	</div>
  </div>
</template>

<script>
	export default {
    props: {
	visible: {
		required: true,
		type: Boolean
	},
    type: [String,Number], // 1外借 2预定
    title:String,//表单标题
    list: Array,//表格数据
},
data () {
	return {
	  mawbTableHead:[
      { field:'mawb', title: '总运单号' },
      {field:'mawbprofiter',title:'运单领用人'},
      {field:'aircomname',title:'运单航空公司'},
      {field:'gysname',title:'运单供应商'}
	  ],
	  // 外借表单
	  transform:{
        mawbsswk:{title:'运单所属',type:3,idStyle:{'width':'100%'},itemStyle:{'width':'400px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},options:[{label:'唯凯外站',value:'唯凯外站'}],required:true},
        jyarea:{title:'站点',type: 37,multiple:false,idStyle:{'width':'50%'},itemStyle:{'width':'400px'},titleStyle:{'marginRight':'8px'},hidden:true,usedarea:'',required: true},
		jykhid:{title:'供应商',type: 20, pagetype: 3, required: true,idStyle:{'width':'50%'},itemStyle:{'width':'400px','marginBottom':'8px'},hidden:true },
        jyr:{title:'外借人',type:'1',required: true,idStyle:{'width':'50%'},itemStyle:{'width':'400px'},titleStyle:{'marginRight':'8px'} },
        jydate:{title:'外借日期',type: 6,required: true ,idStyle:{'width':'50%'},itemStyle:{'width':'400px'},titleStyle:{'marginRight':'8px'},disabled:true,defaultVal:true,readonly:true},
        jyremark:{title: '外借备注', type: 1, itemStyle: {width: '400px'},titleStyle:{'marginRight':'8px'},idStyle:{'width':'50%'} }
	  },
	  // 预定表单
	  booking:{
      bookinger:{title:'预定人：',type:'1',required: true,idStyle:{'width':'50%'},itemStyle:{'width':'400px'},titleStyle:{'marginRight':'8px'} },
      bookingkhid:{title:'预定客户：',type: 20,itemStyle: { width: "400px"},pagetype: 22,titleStyle:{'marginRight':'8px'},idStyle:{'width':'50%'} },
      bookingdate:{title:'预定日期：',itemStyle: { width: "400px"},type:12,required:true,titleStyle:{'marginRight':'8px'},idStyle:{'width':'50%'},defaultVal:true, },
      bookingremark:{title:'预定备注：',type:1,itemStyle: {width: "400px"},titleStyle:{'marginRight':'8px'},idStyle:{'width':'50%'}},
      wffareaid: {
      	    required:true,
            title: "航线分区：",
            type: 5,
            itemStyle: {width: "400px"},
            titleStyle:{'marginRight':'8px'},
            idStyle:{'width':'50%'},
            options: [
              { label: "南美航线", value: "2" },
              { label: "欧洲航线", value: "3" },
              { label: "亚洲航线", value: "4" },
              { label: "北美航线", value: "7" },
              { label: "非洲航线", value: "8" },
              { label: "澳洲航线", value: "9" },
              { label: "印巴中东航线", value: "10" }
            ]
          },
	  },
	  inputModelData:{}
	}
},
watch: {
	'inputModelData.jyarea':{
		handler(val){
			if(val)
			this.getGysId(val)
		},
		immediate:true,
		deep:true
	}
},
computed:{

},
created () {
	//切换总运单所属操作
	this.inputModelData.mawbsswk='唯凯外站'
	this.transform['jyarea']['hidden']=false
	this.transform['jyarea']['usedarea']=JSON.parse(localStorage.groupType).filter(i => i.groupid == 101).filter(i=>i.typename.split('丨')[0]!=this.list[0].area).map(i => i.typename).join()
	this.transform.jykhid.required=false
	this.transform.jyarea.required=true


	if(this.type=='1'){	
	  this.$set(this.inputModelData,'jyr',localStorage.usrname)	
	}else{
	  this.$set(this.inputModelData,'bookinger',localStorage.usrname)	
	}


	
},
methods: {
	//保存
   saveOperate(type,print){ //1外借 2预定 是否打印
   	if (!this.checkInputViewRequire()) return
   let data={
   	area:this.list[0]['area'],
   	mawbList:type=='1'?this.list.map(i=>i.id).join(','):this.list.map(i=>{return {id:i.id,mawb:i.mawb}}),
   	...this.inputModelData
   }

   if(!this.inputModelData.bookingkhid&&type=='2'){
      data.bookingkhid='-1'
   }
    //console.log(data)
   //return
   let api=type=='1'?"api/ExMawbManagerBorrowOut":"api/UpdateInfoByMawbBooking"
   this.$axios({method:'PUT',url:this.$store.state.BasicWebApi+api,data:data,loading:true,tip:false})
   .then(results=>{
        if (results.data.resultstatus === 0) {
          this.$message.success(results.data.resultmessage)
          if(print){
            this.excelOut()
          }
          this.$parent.$parent.search()
          this.$emit("update:visible",false)
        } else {
          this.$message.error(results.data.resultmessage)
        }
   })
   .catch(error=>{

   })
   },
   //导出Excel
		excelOut(){

			let formatDate = {}	
			let list=[]
			let col = (new Array(this.mawbTableHead.length+3).fill(65)).map((v, i) => String.fromCharCode(v+i))
			let tableHead = this.mawbTableHead.map(i=>i.title).concat(['预定人','预定日期','航线分区'])
			let tableDataKey = this.mawbTableHead.map(i=>i.field).concat(['bookinger','bookingdate','wffareaid'])
            
            this.list.forEach(i=>{
            	i.bookinger=this.inputModelData.bookinger
            	i.bookingdate=this.inputModelData.bookingdate
            	i.wffareaid=this.getAreaName(this.inputModelData.wffareaid).substring(0,this.getAreaName(this.inputModelData.wffareaid).length-1)
            	list.push(i)
            })
            console.log(list)
          // 表头
          for (let index in tableHead) {
          	formatDate[col[index] + '1'] = {
          		t: 's',
          		v: tableHead[index],
          		s: { font: { bold: true }, alignment: { horizontal: "center" } }
          	}
          }
          let rowIndex = 2
          for (let row of list) {
          	for (let i in col) {
          		let obj = {}
          		
          			obj = { v: row[tableDataKey[i]], t: typeof row[tableDataKey[i]] === 'number' ? 'n' : 's' }
          	
          		
          		formatDate[col[i] + rowIndex] = obj
          	}
          	rowIndex++
          }
          formatDate['!ref'] = 'A1:' + col[col.length - 1] + (rowIndex - 1)
          formatDate['!cols'] = new Array(col.length).fill({ wpx: 100 })
          this.excelOutF('运单列表', formatDate)
      },
      excelOutF(name,data){
      	let tmpWB = {
      		SheetNames: ['mySheet'],
      		Sheets: {
      			'mySheet': data
      		}
      	}

      	let excelData = new Blob(
      		[
      		s2ab(XLSX.write(tmpWB,{ bookType: 'xlsx', bookSST: false, type: 'binary' }))
      		],
      		{ type: "" }
      		)

      	let a = document.createElement('a')
      	let href = URL.createObjectURL(excelData)
      	a.download = name + '.xlsx'
      	a.href = href
      	a.click()
      	setTimeout(function () {
      		URL.revokeObjectURL(excelData)
      		a = null
      	}, 100)


      function s2ab(s) { //字符串转字符流
      	var buf = new ArrayBuffer(s.length);
      	var view = new Uint8Array(buf);
      	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      		return buf;
      }
  },
  getAreaName(id){
  	var name=""
  	id.split(',').forEach(i=>{
	  if(i=='2'){
	  	name+='南美航线,'
	  }else if(i=='3'){
	  	name+='欧洲航线,'
	  }else if(i=='4'){
	  	name+='亚洲航线,'
	  }else if(i=='7'){
	  	name+='北美航线,'
	  }else if(i=='8'){
	  	name+='非洲航线,'
	  }else if(i=='9'){
	  	name+='澳新航线,'
	  }else if(i=='10'){
	  	name+='印巴中东航线,'
	  }
  	})
  	return name
  },
   //必填项
	checkInputViewRequire () {
    let vieData=this.type=='1'?this.transform:this.booking		
	for (let key in vieData) {
		if (vieData[key].required && !this.inputModelData[key]) {
			let title = vieData[key].title
	
			let text = ''
			
				text = '请填写' + title
	
			this.$message.error(text)
			return false
		}
	}
	return true
},
	//获取供应商id
	getGysId(area){

    this.$axios({method:'get',url:this.$store.state.BasicWebApi+'api/AreaGys',params:{area:area},loading:false,tip:false})
    .then(results=>{
    	if(results.data){
    		this.inputModelData.jykhid=results.data.gysid
    	}
    })
	},

 }
}
</script>

<style lang="less" scoped>
	.detail {
	margin-bottom: 20px;
	margin-top:20px;
	border: 1px solid #e8e8e8;
	&:last-child {
	    margin-bottom: 0;
	}
	.detail-title {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	    height: 32px;
	    text-indent: 8px;
	    font-size: 14px;
	    font-weight: bolder;
	    color: #0f5a8c;
	    background: #f8f8f8;
	    border-bottom: 1px solid #e8e8e8;
	    .ftTotalCost{
	    	color:red;
	    	margin-left: 20px;
	    	font-size:13px;
	    }
	}
	.detail-c {
	    padding: 20px;
	    .contentCmpt .input-item{
	    	margin-bottom: 10px;
	    	.input-title{margin-right:10px;}
	    }
	}
}
</style>
