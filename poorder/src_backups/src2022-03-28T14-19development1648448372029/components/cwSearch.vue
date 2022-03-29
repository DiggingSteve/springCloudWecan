
<template>
   <div>
    <div  class="page-container-box" >
      <!-- {{peicangGuidArr}} -->
     <!-- {{selectTableIndex}} -->
     <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->

<!-- {{rowData}} -->
                <newFormCmpt
                  :name="name"
                  :view-data.sync="inputViewData"
                  :model-data.sync="inputModelData"
                  :search-data.sync="searchData"
                  :pageshow.sync='pageshow'
                  :chinese-where.sync="chineseWhere"
                  :pagetype="1"
                  :whereTmpShow="false"
                  >
                </newFormCmpt>
              <div class="searchForm">
                <el-button @click="search">查询</el-button>
                <el-button @click="newCW=true;operationType='1'">新增</el-button>
                <el-button @click="closeDialog">返回</el-button>



              </div>

<!-- {{ziTableIndex}}
{{dataGrouping}} -->
</div>


<!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig ref="tableComponet" :showTotal="showTotal">

<template slot="operation" slot-scope="props">

  <i v-if="props.data.row.hawblist&&props.data.row.hawblist.length>0" :class="[open=='1'&&ziTableIndex!=props.data.index?'el-icon-plus':'el-icon-minus']" style='color:#1a7dbf;font-weight:bold' @click="openZiTable(props.data.row.index,props.data.row.hawblist)">
  </i>
  <i class="el-icon-s-tools" title="操作" @click="modShipace(props.data.row)" :class="[props.data.row.lockstatus=='2'?'disabled':'']"></i>
	</template>
<template slot="weightinfo" slot-scope="props">
   {{Number(props.data.row.weight).toFixed(2)}}/{{(Number(props.data.row.weight)-Number(props.data.row.realweight)).toFixed(2)}}
</template>
<template slot="volumeinfo" slot-scope="props">
    {{Number(props.data.row.volume).toFixed(3)}}/{{(Number(props.data.row.volume)-Number(props.data.row.realvolume)).toFixed(3)}}
</template>
 </tableCompt>



        <!-- 新增舱位 -->
           <el-dialog :visible.sync="newCW"  v-if="newCW" width="1100px" append-to-body>
           <h4 style="margin-bottom:20px;" >
           	<span v-if="operationType=='1'">新增舱位</span>
           	<span v-else>修改舱位</span>
           </h4>
           <addNewCw :visible.sync="newCW" :operationType="operationType" :shipaceData="shipaceData" @reSearch="upDateRow"></addNewCw>
          </el-dialog>















</div>
</template>
<script>




import { searCondition,getChangeValue,computedWeight,formatDate } from '../api/localStorage.js'
import addNewCw from './templates/addNewCw'//备注
    export default {
      name: 'cwSearch',
       components: {
       	addNewCw
          //airPlaneDeatil
        },
        props: {
         visible: Boolean,
        },
        data () {
            return {
                name:"cwSearch.vue",
                showTotal:{all:false,ybjzt:true,sjjzt:true,zdjzt:true,wageprofit:true,realwageall:false,billwageall:false,wageall:false,finishwageall:false,finishwageall_checkbill:false},
                dialogShow:false,
                mawbguid:null,
                boguid:null,
                orderdom:'',
                area:'',
                newCW:false,
                tableDataRes:[],
                ziTableData:[],
                inputViewData:{
                  hbh:{'title':'航班号',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'}},
                	hbrq:{'title':'航班日期',type:15,defaultVal:true,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	czlx: { title: "操作类型", type: 4,options: [],groupid:132,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	loadingmodel:{title:'配载方式',type:4,options:[],itemStyle: { width: "289px" ,minWidth:'289px'},groupid:37},
                	ysfs:{title:'运输方式',type:4,options:[],itemStyle:{ width: "289px" ,minWidth:'289px'},groupid:7},
                	hwxz:{title:'货物性质',type: 21, groupid: 115,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	shipacexz:{title:'舱位性质',type:4,options:[],itemStyle: { width: "289px" ,minWidth:'289px'},groupid:38},
                	splitstring:{title:'分隔符',type:1,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	yslx:{title:'运输类型',type:4,options:[],itemStyle: { width: "289px" ,minWidth:'289px'},groupid:21,},
                	terminalname:{title:'交接地',type:'4',options:[],itemStyle: { width: "289px" ,minWidth:'289px'},groupid:20},
                	//weight:{title:'配载重量',type:1,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	//volume:{title:'配载体积',type:1,itemStyle: { width: "289px" ,minWidth:'289px'}},
                	jjstatus:{title:'交接状态',type:4,options:[{label:'未交接',value:'1'},{label:'已交接',value:'2'}],itemStyle: { width: "289px" ,minWidth:'289px'}},
                	//sdstatus:{title:'锁定状态',type:4,options:[],itemStyle: { width: "289px" ,minWidth:'289px'}}
              },

                inputModelData:{
                     //"status": "AO5040,AO5020,AO5060,AO5090,AO5030,AO5050"
                },
                searchData:{},
                chineseWhere:[],
                pageshow:true,
                open:'1',//展开子表格加号减号
                ziTableIndex:'-1',
                operationType:'',
                shipaceData:{},//修改仓位传值




        }
      },

        methods: {
		openZiTable(index, data) {

				if (this.ziTableIndex == index) {
					this.$refs.tableComponet.ziTableIndex = -1
					this.ziTableIndex = -1
						//this.open='2'
				} else {
					this.$refs.tableComponet.ziTableIndex = index
					this.ziTableIndex = index
						//this.open='1'
				}
				this.ziTableData = data
			},



			search() {


				this.tableDataRes = [];
				this.ziTableData = [];
				this.open = '1'
				this.ziTableIndex = -1
				var jsonArr2 = {
					where: this.searchData,
					order: "adddate desc"
				}
				var json = {
					'json': JSON.stringify(jsonArr2)
				}

				this.$axios({
						method: 'get',
						url: this.$store.state.webApi + 'api/ExHpoAxplineShipace',
						params: json,
						loading: true,
						tip: false
					}).then(results => {
                      console.log(results.data)
                      if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }

                     results.data=getChangeValue(results.data,'空出')
                     results.data.forEach(i=>{
                     	i.jjstatus=i.jjstatus==1?'未交接':'已交接'
                     	i.sdstatus=i.lockstatus==1?'未锁定':'已锁定'
                     	i.pzstatus=i.pzstatus==1?'未配载':'已配载'
                      i.qfsj=i.qfsj.substring(11,16)
                     })
                      setTimeout(()=>{
                        this.tableDataRes=results.data;
                      },20)
						//console.log(this.tableDataRes)
					})
					.catch(errors => {

					})

			},
		//关闭弹窗
		    closeDialog() {
		    	if (this.visible) {
        this.$emit("update:visible", false);

      }
},
//修改舱位
modShipace(data){

	if(data.lockstatus=='2'){
		this.$message.info('舱位已锁定,无法修改');
		return
	}else{
    this.newCW=true
	this.operationType='2'
	this.shipaceData=data
	}

	//console.log(this.shipaceData)
	//console.log(data)
},
upDateRow(data){
	if(!data){
		this.search()
	}else{
		Object.keys(data).forEach(i=>{
			this.shipaceData[i]=data[i]
		})
		//console.log(data)
	}
	//console.log(data)
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
// .el-dialog__wrapper{
//   /deep/ .el-dialog__body{
//   padding:5px 25px 30px;
//   /deep/ .el-form-item__content>div{
//  //   width:186px
//   }
// }
// }
/deep/.el-card__body{
	padding:10px 0 10px;

	p{
		height:30px;
		line-height:30px;
		cursor:pointer;
		text-indent:0.5em;
		&:hover{
			background:#9cd7ff;
			color:#fff;
		}
		i{
			margin-right:10px;
			font-size:14px;
		}
	}
}



</style>
