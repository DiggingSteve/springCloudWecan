<template>
	<div class="mawb-add" :class="{disabled:inputModelData.status&&inputModelData.status!='1'}">
		<newFormCmpt
		class="form-cmpt"
		:view-data.sync="inputViewData"
		:model-data.sync="inputModelData"
		:pagetype="2">
	</newFormCmpt>
	<div class="btn-c" style="text-align:right">
		<el-button type="primary" @click="getMawbList" :disabled="mawbList.length > 0" v-if="type==='1'">生成清单</el-button>
	</div>
	<!-- 		isMultiSelect -->
	<p v-if="mawbList.length>0" style="color:red;margin-bottom:5px;letter-spacing:0.1em">已生成{{mawbList.length}}份</p>
	<commonTable
	v-if="type === '1'&&mawbList.length>0"
	:head="mawbTableHead"
	:table-data="mawbList"
	class="commonTable">
</commonTable>
<div class="btn-c" style="text-align:right" v-if="type === '1'&&mawbList.length>0||type==='2'">
	<el-button type="primary" @click="saveMawbList(type)">保存</el-button>
	<el-button type="primary" @click="saveMawbList(type,'print')" v-if="type === '1'">保存并导出</el-button>
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
			beforeClose: Function,
    type: String, // 1.新增 2.编辑
    mawbid: [String, Number],
    pagefrom:{//总运单维护 无法修改区域
    	type:String,
    	default:""
    },
    mng:String
},
data () {
	return {
		inputViewData: {
			area: { title: '所属区域', type: 37,required: true ,multiple:false,itemStyle:{'width':'300px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},disabled:this.type==='2'||this.pagefrom=='维护'},
			djr:{title:'登记人',type:'1',required: true,itemStyle:{'width':'300px'},disabled:true,titleStyle:{'marginRight':'8px'} },
			djdate:{title:'登记日期',type: 6,required: true ,itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},disabled:true,defaultVal:true},
			mawb:{title:'起始总运单号',type:1,required: true,itemStyle:{'width':'300px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},verify: "mawb"},
			airName:{title:'航空公司',idStyle:{'width':'600px'},type:1,itemStyle:{'width':'300px'},disabled:true,titleStyle:{'marginRight':'8px'},required:true},
			num:{title:'连续份数',type:1,required: true,idStyle:{'width':'100%'},itemStyle:{'width':'300px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},'verify':'integer',hidden:this.type=='2'},
			mawbsswk:{title:'运单所属',type:3,idStyle:{'width':'100%'},groupid: 1380,itemStyle:{'width':'400px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true},
			otherArea:{title:'站点',type: 37,multiple:false,itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},hidden:true,usedarea:''},
			gysname:{title:'供应商',type: 1,required: false,itemStyle:{'width':'300px','marginBottom':'8px'},hidden:true,disabled:true },
			gid:{title:'供应商',type: 20, pagetype: 3, required: true,itemStyle:{'width':'300px','marginBottom':'8px'},hidden:true },
			ysfl:{title:'总运单分类',type:3,idStyle:{'width':'40%'},groupid:24,itemStyle:{'width':'500px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true},
			airtype:{title:'机种',type:3,idStyle:{'width':'40%'},itemStyle:{'width':'500px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true,groupid:29,all:true},
			czlx:{title:'操作类型',type:3,idStyle:{'width':'100%'},itemStyle:{'width':'500px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true,options: [{label: "唯凯配舱",value: "自货"},{label: "唯凯代操作",value: "代操作"}]},
			mawbxz:{title:'总运单性质',type:3,idStyle:{'width':'100%'},groupid:27,itemStyle:{'width':'500px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true},
			mawblx:{title:'总运单类型',type:3,idStyle:{'width':'100%'},groupid:25,itemStyle:{'width':'500px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true},
			wffareaid: {
      	    required:true,
            title: "航线分区",
            type: 5,
            itemStyle: {width: "300px",'marginBottom':'8px'},
            titleStyle:{'marginRight':'8px'},
            idStyle:{'width':'100%'},
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
			zddlcode: { title: '制单代理代码', type: 17, itemStyle: {width: '560px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'},required:true },
			zdiatacode: { title: '制单IATA代码', type: 17, itemStyle: {width: '560px','marginBottom':'8px'},titleStyle:{'marginRight':'8px'} },
			zddlzh: { title: '制单代理账号', type: 17, itemStyle: {width: '560px'},titleStyle:{'marginRight':'8px'} },
            remark:{title:'备注',type:17,itemStyle: {width: '560px'},titleStyle:{'marginRight':'8px'}}
		},
		inputModelData: {
			
		},
		mawbList: [],
		gysName: '',
		mawbTableHead: [
		{ field: 'mawb', title: '总运单号' },
		// { field: 'sfg', title: '运单负责人' },
		{ field: 'status', title: '运单状态',formatType:2,format:item=>{return this.getStatus(item)}},
		{ field: 'airName', title: '运单航空公司' },
		{ field: 'gysname', title: '运单供应商',formatType:5},
		{ field: 'mawbxz', title: '运单性质' },
		{ field: 'djr', title: '总创建人' },
		{ field: 'djdate', title: '创建日期',formatType:2,format:item=>item.substring(0,10) }
		],

	}
},
watch: {
	'inputModelData.otherArea':{
		handler(val,old){
			console.log(val,old)
			//修改第一次不监听，但需要显示供应商
			// (old&&this.type=='2'||this.type=='1')
			if(val&&val.length>0){
				this.getGysId(val,'unlocal')
				console.log('1111')
			}else{
                console.log('2222')
				if(this.type=='2'&&!old&&val)
				this.$nextTick(()=>{
					this.inputViewData.gysname.hidden=false
				})
			}
		},
		immediate:true,
		deep:true
	},
	'inputModelData.gid':{
		handler(val,old){
			  //修改时第一次不监听，新增监听
			if(val&&this.inputModelData.mawbsswk=='非唯凯'&&(old&&this.type=='2'||this.type=='1')){
				//console.log('非唯凯')
				this.getzd(val)
				//alert('非唯凯')
				this.inputModelData.realgid=val//非唯凯和外站realgid对应供应商gid
			}
		},
		immediate:true,
		deep:true
	}
},
computed:{

},
created () {
	
	this.$set(this.inputModelData,'area',this.$store.state.areaState.indexOf(',')>=0?'':this.$store.state.areaState)
	this.$set(this.inputModelData,'num',1)
	this.inputModelData.djr=localStorage.usrname

    //每一个inputModelData数据变相应式
    Object.keys(this.inputViewData).forEach(i=>{
    	if(i!='djr'&&i!='djdate'&&i!='area'&&i!='num'&&(this.type=='2'&&i!='otherArea'||this.type=='1'))
    		this.$set(this.inputModelData,i,'')
    })

    //修改页面查询明细
    if (this.type === '2') {
		this.getMawbinfoByID()
	}

	//唯凯本站还是非唯凯
    if(this.mng){
    	if(this.mng=='唯凯本站'){
	      this.$set(this.inputModelData,'mawbsswk','唯凯本站')	
	    }else if(this.mng=='非唯凯'){
          this.$set(this.inputModelData,'mawbsswk','非唯凯')	
	    }else if(this.mng='唯凯外站'){
	      this.$set(this.inputModelData,'mawbsswk','唯凯外站')	
	    }
    }
	

    // 通过总运单号获取航司名字、realgid和航司id
    //本站realgid 取航空公司对应gysid
    this.$watch(()=>{
    	return this.inputModelData.mawb
    },(val,old)=>{

    	if(JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0]).length>0&&val){
    		this.inputModelData.airName=JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0])[0]['CName']
    		this.inputModelData.aid=JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0])[0]['id']
    		JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0])[0]['gysList'].forEach(i=>{
    			if(i.cusArea=='-1'){
    				//alert('-1')
    				this.inputModelData.realgid= i.cusGid
    			}else if(i.cusArea.includes(this.inputModelData.area)){
    				//alert('1')
                    this.inputModelData.realgid= i.cusGid
    			}else{
    				this.inputModelData.airName=''	
    		        this.inputModelData.aid=''
    		        this.inputModelData.realgid=''
    			}

    		})
    		console.log(this.inputModelData.realgid)
    	}else{
    		this.inputModelData.airName=''	
    		this.inputModelData.aid=''
    		this.inputModelData.realgid=''
    	}
    	//唯凯本站根据匹配到的航空公司ID 获取制单代码
    	  //修改时第一次不监听，新增监听
    	if(this.inputModelData.mawbsswk=='唯凯本站'&&(old&&this.type=='2'||this.type=='1')){
    		this.getzd(this.inputModelData.realgid)
    	}	
    })

	// 切换总运单所属显示不同表单
	this.$watch(()=>{
		return this.inputModelData.mawbsswk
	},(val,old)=>{
		if(val){
			//初始化
			this.inputViewData.gid.hidden=true
			this.inputViewData.otherArea.hidden=true
			this.inputViewData.gysname.hidden=true
            if(old){
            this.inputModelData.gid=''
			this.inputModelData.otherArea=''
			this.inputModelData.zddlcode=''
			this.inputModelData.zddlzh=''
			this.inputModelData.zdiatacode=''
            }
            this.$set(this.inputModelData,'wffareaid','')	

			if(val=='非唯凯'){
				this.inputViewData.mawbsswk.idStyle={'width':'40%'}
				this.inputViewData.gid.hidden=false
				this.$set(this.inputViewData.wffareaid,'disabled',false)	
			}else if(val=='唯凯外站'||val=='唯凯本站'){
				if(val=='唯凯本站'){
					this.inputViewData.mawbsswk.idStyle={'width':'40%'}
					this.getGysId(this.inputModelData.area,'islocal')
					//@@@未找到修改切回本站realgid更改的BUG @@@此处重新获取
					if(this.inputModelData.mawb){
						JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0])[0]['gysList'].forEach(i=>{
		    			if(i.cusArea=='-1'){
		    				this.inputModelData.realgid= i.cusGid
		    			}else if(i.cusArea.includes(this.inputModelData.area)){
		                    this.inputModelData.realgid= i.cusGid
		    			}else{
		    				this.inputModelData.airName=''	
		    		        this.inputModelData.aid=''
		    		        this.inputModelData.realgid=''
		    			}
                      })
					}
					console.log(this.inputModelData.realgid)


					//console.log(this.inputModelData.realgid)
                    //唯凯本站根据匹配到的航空公司ID 获取制单代码
                    //修改时第一次不监听，新增监听
                    if(this.inputModelData.aid&&(old&&this.type=='2'||this.type=='1')){
                    	console.log(this.inputModelData.realgid)
                    	this.getzd(this.inputModelData.realgid)
                    }
                    this.$set(this.inputViewData.wffareaid,'disabled',true)	
                    this.$set(this.inputModelData,'wffareaid','全部')	
                }else{
                	this.inputViewData.mawbsswk.idStyle={'width':'35%'}
                	this.inputViewData.otherArea.hidden=false
                    let unSelect=['市场部','海外部','大客户部','项目管理部']
                	this.inputViewData.otherArea.usedarea=JSON.parse(localStorage.groupType).filter(i => i.groupid == 101).filter(i=>i.typename.split('丨')[0]!=this.inputModelData.area&&!unSelect.includes(i.typename.split('丨')[0])).map(i => i.typename).join()
                	 this.$set(this.inputViewData.wffareaid,'disabled',false)	
                }
            }
        } 
    },{immediate:true})
},
methods: {
    //关闭弹框
    closeDialog () {
    	if (this.beforeClose) {
    		this.beforeClose(_ => {
    			this.$emit('update:visible', false)
    		})
    	}
    },
     getStatus(value){
 //console.log(value)
  if(value=='1'){
    return '可用'
  }else if(value=='2'){
   return '已领用'
  }else if(value=='5'){
   return '作废'
  }else if(value=='8'){
   return '转移'
  }
 },

	//获取供应商
	getGysId(area,type){ //area区域  type本站、外站
		this.$nextTick(()=>{
			this.inputViewData.gysname.hidden=false
		})

		this.$axios({method:'get',url:this.$store.state.BasicWebApi+'api/AreaGys',params:{area:this.inputModelData.area,area2:this.inputModelData.area==area?'':area},loading:false,tip:false})
		.then(results=>{
			if(results.data){
				this.inputModelData.gid=results.data.gysid
				console.log(this.inputModelData.realgid)
				this.$nextTick(()=>{
					this.$set(this.inputModelData,'gysname',results.data.name.split('-')[1])
				})
                
				if(type=='unlocal'){//外站根据获取到的供应商获取相对的制单代码  外站realgid对应取出来的gysid
					
					//alert('unlocal')
					this.inputModelData.zddlcode=results.data.zddlcode
					this.inputModelData.zddlzh=results.data.zddlzh
					this.inputModelData.zdiatacode=results.data.zdiatacode
                    this.inputModelData.realgid=results.data.gysid
                }


            }
        })
	},
//本站、非唯凯 获取制单代码  
getzd(id){
	console.log(id)
	let arr=getxmdata('gysxm').filter(i=>i.id==id)
	console.log(arr)
	if(arr.length>0){
		this.inputModelData.zddlcode=arr[0].zddlcode
		this.inputModelData.zddlzh=arr[0].zddlzh
		this.inputModelData.zdiatacode=arr[0].zdiatacode
}
},

	//生成清单
	getMawbList(){
		if (!this.checkInputViewRequire()) return
	    if(!this.inputModelData.realgid) return this.$message.info('请补充维护航空信息')	
			let params = {
				area: this.inputModelData.area,
				mawb: this.inputModelData.mawb,
				num: this.inputModelData.num
			}
			this.$axios({method:'get',url:this.$store.state.BasicWebApi+'api/MawbManagement',params,loading:true,tip:false})
			.then(({ data })=>{
				if (data.resultstatus === 0) {
					this.$message.success(data.resultmessage)

					// 生成总运单列表表格
					var gysname=''
					var gysnameArr=getxmdata('gysxm').filter(i=>i.id==this.inputModelData.gid)
					if(gysnameArr.length>0){
						gysname=gysnameArr[0].usr_name.split('-')[1]
					}
					data.resultdic.mawblist.forEach(i=>{
						this.mawbList.push({mawb:i,status:1,airName:this.inputModelData.airName,aid:this.inputModelData.aid,realgid:this.inputModelData.realgid,gid:this.inputModelData.gid,mawbxz:this.inputModelData.mawbxz,djr:this.inputModelData.djr,djdate:this.inputModelData.djdate,gysname:gysname})

					})
          // 生成总运单号之后禁用输入框
          this.toggleInputViewDisable(true)
      } else {
      	this.$message.error(data.resultmessage)
      }
  })
		},
   // 获取详细
   getMawbinfoByID () {
   	let params = { id: this.mawbid }
   	this.$axios({method:'get',url:this.$store.state.BasicWebApi+'api/MawbManagement',params,loading:true,tip:false})
   	.then((results)=>{
   		this.inputModelData = results.data
   		this.$set(this.inputModelData,'otherArea','')
			if(this.inputModelData.mawbsswk=='唯凯外站'){//截取外站地址
				if(!this.inputModelData.gysname.includes('分公司')){
                    this.$set(this.inputModelData,'otherArea','上海')
				}else{
					this.$set(this.inputModelData,'otherArea',this.inputModelData.gysname.substring(
					this.inputModelData.gysname.indexOf('司')+1,
					this.inputModelData.gysname.indexOf('分公司')
					))	
				}

			}

		})
   },

		//保存
		saveMawbList (type,print) { //1新增 2修改  是否导出
			if (!this.checkInputViewRequire()) return

			let mawblist=this.mawbList.map(i => i.mawb).join(',')
			let data = {
				mawblist,
				...this.inputModelData
			}
            if(this.inputModelData.wffareaid=='全部'){
            	data.wffareaid='-1'
            }
            if(this.inputModelData.mawbsswk!='唯凯本站'){
            	data.realgid=data.gid
            }
			delete data.otherArea
			delete data.airName
			delete data.gysname

			this.$axios({method:type=='1'?'post':'put',url:this.$store.state.BasicWebApi+'api/MawbManagement',data:data,loading:true,tip:false})
			.then(results=>{
				if(results.data.resultstatus==0){
					this.$message.success(results.data.resultmessage)
					if(print){
						this.excelOut()
					}
					this.$emit("update:visible",false)

				}else{
					this.$message.error(results.data.resultmessage)
				}
			})
		},
		//导出Excel
		excelOut(){

			let formatDate = {}	
			let col = (new Array(this.mawbTableHead.length).fill(65)).map((v, i) => String.fromCharCode(v+i))
			let tableHead = this.mawbTableHead.map(i=>i.title)
			let tableDataKey = this.mawbTableHead.map(i=>i.field)
          // 表头
          for (let index in tableHead) {
          	formatDate[col[index] + '1'] = {
          		t: 's',
          		v: tableHead[index],
          		s: { font: { bold: true }, alignment: { horizontal: "center" } }
          	}
          }
          let rowIndex = 2
          for (let row of this.mawbList) {
          	for (let i in col) {
          		let obj = {}
          		if(tableDataKey[i]=='status'){
          			obj = { v: '可用'}
          		}else{
          			obj = { v: row[tableDataKey[i]], t: typeof row[tableDataKey[i]] === 'number' ? 'n' : 's' }
          		}
          		
          		formatDate[col[i] + rowIndex] = obj
          	}
          	rowIndex++
          }
          formatDate['!ref'] = 'A1:' + col[col.length - 1] + (rowIndex - 1)
          formatDate['!cols'] = new Array(col.length).fill({ wpx: 100 })
          this.excelOutF('总运单列表', formatDate)
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


		// 必填项
		checkInputViewRequire () {
			for (let key in this.inputViewData) {
				if (this.inputViewData[key].required && !this.inputModelData[key]&&!this.inputViewData[key].hidden) {
					
                      let title = this.inputViewData[key].title
					  let text = ''
					  text = '请填写' + title
					  this.$message.error(text)
					  return false
				
				}
			}
			return true
		},
		//生成列表禁止项
		toggleInputViewDisable (disabled) {
			let exclude = ['zddlcode', 'zdiatacode', 'zddlzh']
			for (let key in this.inputViewData) {
				if (exclude.includes(key)) continue
					this.$set(this.inputViewData[key], 'disabled', disabled)
			}
		},
    //status转换
    changeStatus(val){

    }


}
}
</script>

<style lang="less" scoped>
	.mawb-add {
		.btn-c {
			margin: 13px 0 20px;
		}
		.form-cmpt {
			position: relative;
			.service-table {
				position: absolute;
				right: 60px;
				bottom: 9px;
				width: 270px;
				height: 193px;
				overflow: scroll;
				overflow-x: hidden;
			}
		}
		.commonTable {
			height: 225px;
			overflow: scroll;
			overflow-x: hidden;
		}
	}
</style>
