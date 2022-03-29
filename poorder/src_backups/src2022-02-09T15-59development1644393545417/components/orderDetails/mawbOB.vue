
<template>
   <div>
<!-- {{preOpModelData}} -->

     <h3 style="margin-top:-12px;">{{title}}</h3>
     <!-- 借用、寄出 -->
     <div v-if="pageType=='1'||pageType=='2'">
<!--      {{borrowModelData}} -->
       <div style="margin-bottom:8px;margin-top:12px;">
         <el-radio v-model="radioModel" label="1" :disabled="pageType=='2'?true:false">连续模式</el-radio>
         <el-radio v-model="radioModel" label="2" :disabled="pageType=='2'?true:false">简单模式</el-radio>
       </div>
       <newFormCmpt

                  :view-data.sync="inputViewData"
                  :model-data.sync="inputModelData"


                  :pagetype="2"
                  :whereTmpShow="false"
                  :class="[pageType=='2'?'disabled':'']"
                  ></newFormCmpt>
       <div class="searchForm">
         <el-button @click="mawbSearch('1')" :disabled="pageType=='2'">查询</el-button>
       </div>
  <div class="detail basic-information">
              <div class="detail-title">
                <p>借用</p>
              </div>
              <div class="detail-c" style="max-width:1200px" :class="[pageType=='2'?'disabled':'']">
                <newFormCmpt
                  :view-data.sync="borrowViewData"
                  :model-data.sync="borrowModelData"
                  :pagetype="2"
                  @wtdataP="getKhName"
                ></newFormCmpt>
              </div>
           <!--     <el-button @click="mawbSave('1')" style="margin-left:55px;margin-bottom:20px;">保存</el-button> -->
  </div>

    <div class="detail basic-information">
              <div class="detail-title">
                <p>寄出</p>
              </div>
              <div class="detail-c" style="max-width:1200px" :class="[pageType=='2'?'disabled':'']">
                <newFormCmpt
                   :view-data.sync="sendViewData"
                  :model-data.sync="sendModelData"
                  :pagetype="2"
                ></newFormCmpt>
              </div>
               <el-button style="margin-left:55px;margin-bottom:20px;" @click="mawbSave('2')" :disabled="pageType=='2'">保存寄出并打印</el-button>
             <el-button :disabled="pageType=='1'" @click="printData">寄出打印</el-button>

  </div>

       <commonTable :head="mawbHead" :table-data="mawbData" class="commonTable" isMultiSelect style="margin-top:20px;" allchecked></commonTable>

     </div>

     <!-- 归还 -->
     <div v-if="pageType=='4'">

       <div style="margin-bottom:8px;margin-top:12px;">
         <el-radio v-model="radioModel" label="1">连续模式</el-radio>
         <el-radio v-model="radioModel" label="2">简单模式</el-radio>
       </div>

       <!-- <div style="margin-bottom:8px">
         <el-radio v-model="searchType" label="1">内部</el-radio>
         <el-radio v-model="searchType" label="2">外部</el-radio>
       </div> -->

       <newFormCmpt

                  :view-data.sync="feedBackViewData"
                  :model-data.sync="feedBackModelData"

                  :pagetype="2"
                  ></newFormCmpt>
       <div class="searchForm">
         <el-button @click="mawbSearch('4')">查询</el-button>
       </div>
       <el-tabs type="border-card" style="margin-top:20px;">
         <el-tab-pane label="归还">
           <newFormCmpt

                  :view-data.sync="backOpViewData"
                  :model-data.sync="backOpModelData"
                  :pagetype="2"
                  ></newFormCmpt>
           <div class="searchForm">
             <el-button @click="mawbSave('4')">保存</el-button>
            <!--  <el-button @click="closeDialog">返回</el-button> -->
           </div>
         </el-tab-pane>
       </el-tabs>
       <commonTable :head="feebBackHead" :table-data="feebBackData" class="commonTable" isMultiSelect style="margin-top:20px;" allchecked></commonTable>
     </div>

     <!-- 预定 -->
     <div v-if="pageType=='3'">

       <div style="margin-bottom:8px;margin-top:12px;">
         <el-radio v-model="radioModel" label="1" :disabled="pageType=='2'?true:false">连续模式</el-radio>
         <el-radio v-model="radioModel" label="2" :disabled="pageType=='2'?true:false">简单模式</el-radio>
       </div>
       <newFormCmpt
                  :view-data.sync="newPreViewData"
                  :model-data.sync="newPreModelData"
                  :pagetype="2"
                  ></newFormCmpt>
       <div class="searchForm">
         <el-button @click="mawbSearch('3')">查询</el-button>
       </div>
       <el-tabs type="border-card" style="margin-top:20px;">
         <el-tab-pane label="预定">
           <newFormCmpt

                  :view-data.sync="preOpViewData"
                  :model-data.sync="preOpModelData"
                  :pagetype="2"
                  ></newFormCmpt>
           <div class="searchForm">
             <el-button @click="mawbSave('3')">保存</el-button>

           </div>
         </el-tab-pane>
       </el-tabs>

       <commonTable :head="preTableHead" :table-data="preTableData" class="commonTable" isMultiSelect style="margin-top:20px;" allchecked></commonTable>

     </div>

     <!-- 寄出打印弹框 -->
    <div style="height:0;overflow:hidden">
     <div id="printHead">
        <p style="text-align:center">
        <img :src="wecanlogo_mawbjcUrl"  style="height: 80px;width: 80%">
        </p>
        <p style="font-size:13px;margin-bottom:10px;padding-top:8px;padding-bottom:8px;border-top:1px solid #333;border-bottom:1px solid #333;font-weight:bold" class="printTitle">
        <span >
          <span style="display:inline-block;width:5">地址:</span>
          <span style="display:inline-block;width:54%;word-wrap:break-word;word-break:break-all;white-space:pre-wrap;vertical-align:middle">{{sendModelData.jyqsaddress}}</span>

        </span>
        <span style="display:inline-block;width:13%">
        联系人:{{sendModelData.jyqsr}}
        </span>
        <span style="display:inline-block;width:25%">
        寄出日期:{{sendModelData.jyjcdate}}

        </span>
        </p>
        <div>
        <p style="letter-spacing:0.1em;font-weight:bold;font-size:13px;" class="printTableTitle">
        批次号:{{jcpchno}}

        <span style="margin-left:10px;">
        借出人:{{borrowModelData.jyr}}

        </span></p>
        </div>
     </div>

     <div id="printData">

       <TABLE border=1 cellSpacing=0 cellPadding=1 width="100%" style="border-collapse:collapse;font-size:13px;" bordercolor="#333333">
<thead>
  <TR>
    <TD width="10%">
      <DIV align=center><b>序号</b></DIV></TD>
    <TD width="20%">
      <DIV align=center><b>总运单号</b></DIV></TD>
    <TD width="35%">
      <DIV align=center><b>{{khname?'借用对象':'借用站点'}}</b></DIV></TD>
    <TD width="35%">
      <DIV align=center><b>借用备注</b></DIV></TD>
    </TR>
</thead>

 <TBODY>
  <TR v-for="(i,index) in checkedData" :key="index">
    <TD>{{index+1}}</TD>
    <TD >{{i.mawb}}</TD>
    <TD >{{khname||borrowModelData.jyarea}}</TD>
    <TD >{{borrowModelData.jyremark}}</TD>
  </TR>
  </TBODY>


       </TABLE>

     </div>

     </div>
   </div>

</template>
<script>

import {getLodop} from '../../api/LodopFuncs.js'
import {dateFormat,getMomentDate} from '../../api/localStorage.js'

    export default {
      name: 'mawbOB',
       components: {

       },
       props: {
         visible: Boolean,
         pageType:String,//1、外借  2、寄出  3、新增预定  4、归还
         rowData:Object,//寄出单条数据
         jcpch:String,//寄出批次号
         bRowData:Object,//寄出行数据
       },
       data () {
            return {
                name:"mawbOB.vue",

                // 借用、寄出
                inputViewData:{//借用查询条件
                    mawb:{'title':'总运单号：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},required:true},
                    num:{'title':'份数：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},hidden:true,required:true},
                    czlx:{ type:4,groupid:132,title:'操作类型：',allSelect:true},
                    gid:{'title':'供应商：',type: 20, pagetype: 3,itemStyle: { width: "289px" ,minWidth:'289px'}}
                },
                inputModelData:{

                },
                searchData:{},
                //chineseWhere:[],

                borrowViewData:{//借用
                   jyr:{title:'借出人：',type:1,itemStyle: { width: "500px" ,minWidth:'500px'},required:true},
                   jydate:{title:'借出日期：',type:12,itemStyle: { width: "500px" ,minWidth:'500px'},required:true},
                   jytype:{title:'',type:3,itemStyle: { width: "165px" ,minWidth:'165px',marginLeft:'35px',marginTop:'4px'},type:3,options:[{label:'内部',value:1},{label:'外部',value:2}], titleStyle: { display: "none" }},
                   jykhid:{title:'借出对象：',type: 20,itemStyle: { width: "300px" ,minWidth:'300px'},pagetype: 1,required:true,hidden:true,sytype:true},
                   jyarea:{title:'借出站点',type:30, groupid: 101,hidden:true,required:true,itemStyle: { width: "300px" ,minWidth:'300px'}},
                   jypostype:{title:'',itemStyle: { width: "165px" ,minWidth:'165px',marginLeft:'35px',marginTop:'4px'},type:3,options:[{label:'分区',value:1},{label:'目的港',value:2}], titleStyle: { display: "none" }},
                   jywffid:{title:'借出分区：',itemStyle: { width: "300px" ,minWidth:'300px'},type:4,options: [{ label: '南美航线', value: 2 },{ label: '欧洲航线', value: 3 },{ label: '亚洲航线', value: 4 },{ label: '北美航线', value: 7 },{ label: '非洲航线', value: 8 },{ label: '澳洲航线', value: 9 },{ label: '印巴中东航线', value: 10 }],hidden:true,required:true},
                   jymdg:{title:'借出目的港：',itemStyle: { width: "300px" ,minWidth:'300px'},type: 20,pagetype: 6,hidden:true,required:true},
                   jyremark:{title:'借出备注：',type:1,itemStyle: { width: "500px" ,minWidth:'500px'}}
                },
                borrowModelData:{
                  jypostype:1,jyr:localStorage.usrname,jytype:1,jydate:getMomentDate()
                },

                sendViewData:{//寄出
                	jyqsr:{title:'对方签收人：',type:1,itemStyle: { width: "578px" ,minWidth:'578px'},required:true},
                	jyjcdate:{title:'寄出日期：',type:12,itemStyle: { width: "578px" ,minWidth:'578px'},required:true},
                  jyqsaddress:{title:'对方签收地址：',type:17,itemStyle: { width: "578px" ,minWidth:'578px'},required:true}
                },
                sendModelData:{jyjcdate:getMomentDate()},
                radioModel:'2',
                mawbHead:[//借用表格数据
                {field:'mawb',title:'总运单号'},
                {field:'czlx',title:'操作类型'},
                {field:'sfg',title:'始发港'},
                // {field:'mawbgys',title:'供应商'},
                {field:'mawbxs',title:'总运单形式'},
                {field:'ysfl',title:'运输分类'},
                {field:'mawblx',title:'总运单类型'},
                {field:'mawbss',title:'总运单所属'},
                {field:'ystj',title:'运输条件'},
                {field:'ydfq',title:'预定分区'},
                {field:'ydmdg',title:'预定目的港'}
                ],
                mawbData:[],

                // 归还
                feedBackViewData:{//归还查询条件
                   mawb:{'title':'总运单号：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},required:true},
                    num:{'title':'份数：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},hidden:true,required:true},
                    // area:{ type: 23,whereStr: "in",groupid: 101,title:'所属区域：',required:true},
                    czlx:{'title':'操作类型：',type:4,groupid:132,itemStyle: { width: "289px" ,minWidth:'289px'},allSelect:true},
                    backarea:{ type: 30,whereStr: "in",groupid: 101,title:'借入区域：',hidden:true},
                    gid:{'title':'供应商：',type: 20, pagetype: 3,itemStyle: { width: "289px" ,minWidth:'289px'},hidden:true},
                    jyr:{title:'借出人：',type:1,itemStyle: { width: "289px" ,minWidth:'289px'},hidden:true},
                    jykhid:{title:'借入对象：',type: 13,itemStyle: { width: "289px" ,minWidth:'289px'},pagetype: 1,hidden:true},
                    jydate:{title:'借用日期：',type:12,itemStyle: {  width: "289px" ,minWidth:'289px'},hidden:true,}
                },
                searchType:'2',//归还类型(内外部)
                feedBackModelData:{},
                //feedBackModelData:{jyr:localStorage.usrname,jydate:getMomentDate()},
                feedBackSearchData:{},
                backOpViewData:{//归还操作
                    ghr:{'title':'受理人：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},required:true},
                    ghdate:{'title':'归还日期：',type:'12',itemStyle: { width: "289px" ,minWidth:'289px'},required:true},
                    remark:{'title':'备注：',type:'1',itemStyle: { width: "500px" ,minWidth:'500px'},required:true},
                },
                backOpModelData:{},
                feebBackHead:[
                {field:'mawb',title:'总运单号'},
                {field:'gysname',title:'供应商'},
                {field:'czlx',title:'操作类型'},
                {field:'status',title:'当前状态'},
                {field:'jyr',title:'借出人'},
                {field:'jykhname',title:'借入对象'},
                {field:'jyjcdate',title:'借用日期'}
                ],
                feebBackData:[],

                // 预定
                newPreViewData:{
                    mawb:{'title':'总运单号：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},required:true},
                    num:{'title':'份数：',type:'1',itemStyle: { width: "289px" ,minWidth:'289px'},hidden:true,required:true},
                    czlx:{ type: 4,groupid: 132,title:'操作类型：',allSelect:true},
                    gid:{'title':'供应商：',type: 20, pagetype: 3,itemStyle: { width: "289px" ,minWidth:'289px'}},
                },
                newPreModelData:{
                },
                newPreSearchData:{

                },
                preOpViewData:{
                bookinger:{title:'预订人：',type:1,itemStyle: { width: "500px" ,minWidth:'500px'},required:true},
                bookingkhid:{title:'预定客户：',type: 20,itemStyle: { width: "500px" ,minWidth:'500px'},pagetype: 10,required:true},

                bookingpostype:{title:'',itemStyle: { width: "165px" ,minWidth:'165px',marginLeft:'35px',marginTop:'4px'},type:3,options:[{label:'分区',value:'1'},{label:'目的港',value:'2'}], titleStyle: { display: "none" }},
                bookingwffid:{title:'预定分区：',itemStyle: { width: "300px" ,minWidth:'300px'},type:4,options: [{ label: '南美航线', value: '2' },{ label: '欧洲航线', value: '3' },{ label: '亚洲航线', value: '4' },{ label: '北美航线', value: '7' },{ label: '非洲航线', value: '8' },{ label: '澳洲航线', value: '9' },{ label: '印巴中东航线', value: '10' }],hidden:true,required:true},
                bookingmdg:{title:'预定目的港：',itemStyle: { width: "300px" ,minWidth:'300px'},type: 20,pagetype: 6,hidden:true,required:true},
                bookingdate:{title:'预定日期',itemStyle: { width: "500px" ,minWidth:'500px'},type:12,required:true},
                bookingremark:{title:'预定备注：',type:1,itemStyle: { width: "500px" ,minWidth:'500px'}}
                },
                preOpModelData:{
                  bookingpostype:'1',bookinger:localStorage.usrname
                },
                preTableHead:[
                {field:'mawb',title:'总运单号'},
                {field:'czlx',title:'操作类型'},
                {field:'sfg',title:'始发港'},
                {field:'gysname',title:'供应商'},
                {field:'mawbxs',title:'总运单形式'},
                {field:'ysfs',title:'运输分类'},
                {field:'mawblx',title:'总运单类型'},
                {field:'mawbss',title:'总运单所属'},
                {field:'ystj',title:'运输条件'},
                {field:'jyfq',title:'借用分区'},
                {field:'jymdg',title:'借用目的港'}
                ],
                preTableData:[],
                // 寄出打印数据
                checkedData:[],
                jcpchno:'',//寄出批次号
                printShow:'',//寄出打印弹框
                khname:'',//借出对象
                //其他
                nowatch:false,//禁止监听
                wecanlogo_mawbjcUrl: "../../../boStatic/images/wecanlogo_mawbjc.png"


        }
      },

        methods: {
    // 总运单预定(3)、借出(1)、归还(4)
    mawbSearch(type) {
        this.preTableData=[]
        this.mawbData=[]
        this.feebBackData=[]
        var url = ""
        var json = {}
        if (type == '3' || type == '1') { //预定
          url = type == '3' ? "api/GetCanBookingList" : "api/GetCanBorrowOutList"
          json = type == '3' ? this.newPreModelData : this.inputModelData

          if (!json.gid) {
            json.gid = '-1'
          }

          if (!json.czlx) {
            json.czlx = '全部'
          }
        } else if (type == '4') { //归还
          url = "api/GetCanBorrowBackList"
          json = {...this.feedBackModelData
          }
          if (!json.backarea) {
            json.backarea = ""
          }
          if (!json.gid) {
            json.gid = "-1"
          }
          if (!json.jykhid) {
            json.jykhid = "-1"
          }
          if (!json.jyr) {
            json.jyr = ""
          }
          if (!json.jydate) {
            json.jydate = "1900-01-01"
          }
          if (!json.czlx) {
            json.czlx = '全部'
          }

        }

        if (!json.mawb) {
          this.$message.error('请填写总运单号')
          return
        }

        if (!json.num && this.radioModel == '2') {
          json.num = '-1'
        } else if (this.radioModel == '1' && !json.num) {
          this.$message.error('请填写份数')
          return
        }

        delete json.undefined

        json.area = this.$store.state.areaState

        this.$axios({
            method: 'get',
            url: this.$store.state.BasicWebApi + url,
            params: json,
            loading: true,
            tip: false
          })
          .then(results => {
            if (!results.data.length) {
              this.$message.info('无查询结果')
            } else {
              if (type == '3') {
                this.preTableData = results.data
              } else if (type == '1') {
                this.mawbData = results.data
              } else if (type == '4') {
                results.data.forEach(i=>{

                  i.jyjcdate=dateFormat(i.jyjcdate,'yyyy-mm-dd hh:mm')
                  if(i.status=='1'){
                     i.status='可用'
                  }else if(i.status=='2'){
                    i.status='已领用'
                  }else if(i.status=='3'){
                    i.status='已制单'
                  }else if(i.status=='4'){
                    i.status='不可用'
                  }else if(i.status=='5'){
                    i.status='作废'
                  }
                })
                this.feebBackData = results.data
              }

            }


          })
          .catch(error => {

          })

      },
      // 总运单预定(3)、借出(1)、归还(4)、寄出(2)保存
      async mawbSave(type) {
        var url = ""
        var json = {}
        var mawbList = []
        if (type == '3') { //预定
          url = "api/UpdateInfoByMawbBooking"
          json = this.preOpModelData
          if (!json.bookinger) {
            this.$message.error('请填写预订人')
            return
          }
          if (!json.bookingkhid) {
            this.$message.error('请选择预定客户')
            return
          }
          if (!json.bookingwffid && !json.bookingmdg) {
            this.$message.error('请选择分区或目的港')
            return
          }
          if (!json.bookingdate) {
            this.$message.error('请选择预定日期')
            return
          }

        } else if (type == '1') { //舍弃xxxxxxx
          url = "api/ExMawbManagerBorrowOut"
          json = this.borrowModelData

          if (!json.jyr) {
            this.$message.error('请填写借出人')
            return
          }
          if (!json.jykhid && !json.jyarea) {
            this.$message.error('请选择对象或站点')
            return
          }
          if (!json.jywffid && !json.jymdg) {
            this.$message.error('请选择分区或目的港')
            return
          }

          if (!json.jydate) {
            this.$message.error('请选择借出日期')
            return
          }
          json.jyqsr = this.sendModelData.jyqsr || "1900-01-01"
          json.jyqsaddress = this.sendModelData.jyqsaddress || ''
          json.jyjcdate = this.sendModelData.jyjcdate || ''
        } else if (type == '2') {
          url = "api/ExMawbManagerBorrowOut"
          json = Object.assign(this.borrowModelData, this.sendModelData)

          if (!json.jyr) {
            this.$message.error('请填写借出人')
            return
          }
          if (!json.jykhid && !json.jyarea) {
            this.$message.error('请选择对象或站点')
            return
          }
          if (!json.jywffid && !json.jymdg&&json.jytype=='2') {
            this.$message.error('请选择分区或目的港')
            return
          }
          if (!json.jydate) {
            this.$message.error('请选择借出日期')
            return
          }
          if (!json.jyqsr) {
            this.$message.error('请填写寄出人')
            return
          }
          if (!json.jyqsaddress) {
            this.$message.error('请填写寄出地址')
            return
          }
          if (!json.jyjcdate) {
            this.$message.error('请填写寄出日期')
            return
          }
        } else if (type == '4') {
          url = "api/ExMawbManagerBorrowBack"
          json = this.backOpModelData
          if (!json.ghr) {
            this.$message.error('请填写归还人')
            return
          }
          if (!json.ghdate) {
            this.$message.error('请填写归还日期')
            return
          }
          if (!json.remark) {
            this.$message.error('请填写归还备注')
            return
          }

        }
        delete json.undefined

        if (type == '3') {
          this.preTableData.forEach(i => {
            if (i.checked) {
              mawbList.push({
                id: i.id
              })
            }
          })
        } else if (type == '1' || type == '2') {
          this.mawbData.forEach(i => {
            if (i.checked) {
              mawbList.push({
                id: i.id
              })
            }
          })
        } else if (type == '4') {
          this.feebBackData.forEach(i => {
            if (i.checked) {
              mawbList.push({
                id: i.id,
                mawb: i.mawb
              })
            }
          })
        }


        if (!mawbList.length) {
          this.$message.error('请选择总运单号')
          return
        }

        json.mawbList = JSON.stringify(mawbList)
          //console.log(json)
        await this.$axios({
            method: 'put',
            url: this.$store.state.BasicWebApi + url,
            data: json,
            loading: true,
            tip: false
          })
          .then(results => {
            if (results.data.resultstatus == 0) {
              if (type == '3') { //预定
                this.preTableData.forEach(i => {
                  if (i.checked) {
                    this.$set(i, 'thisListHide', true)
                  }
                })

              } else if (type == '1' || type == '2') { //借出
                this.jcpchno = results.data.resultno
                this.checkedData = []
                this.mawbData.forEach(i => {
                  if (i.checked && !i.thisListHide) {
                    this.checkedData.push(
                      i
                    )
                    this.$set(i, 'thisListHide', true)
                  }
                })

              } else if (type == '4') { //归还
                this.feebBackData.forEach(i => {
                  if (i.checked) {
                    this.$set(i, 'thisListHide', true)
                  }
                })
              }

              this.$message.success(results.data.resultmessage)
            } else {
              this.$message.error(results.data.resultmessage)
            }

          })
          .catch(error => {

          })
        if (this.jcpchno) {
          this.printData()
        }
      },
      // 寄出打印
      printData() {
        var LODOP = getLodop();
        var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"

        LODOP.ADD_PRINT_TABLE(Number($('#printHead').height()) + 56, "2%", "96%", 220, strStyle + document.getElementById("printData").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
        LODOP.ADD_PRINT_HTM(26, "5%", "90%", "97mm", document.getElementById("printHead").innerHTML);
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
        LODOP.ADD_PRINT_HTM("260mm", 400, 300, 100, "<span>签收人</span><span style='margin-left:100px'>签收日期</span>");
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 4);

        LODOP.ADD_PRINT_HTM("270mm", 600, 300, 100, "<span tdata='pageNO'>当前第##页</span><span tdata='pageCount' style='margin-left:20px'>共##页</span></font>");
        LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
        LODOP.SET_PRINT_STYLEA(0, "Horient", 1);

        LODOP.PREVIEW();
        this.jcpchno = ""
      },
      //寄出明细查询
      bOutDetail(val) {

         this.$axios({
            method: 'get',
            url: this.$store.state.BasicWebApi + 'api/ExMawbManagerBorrowJc',
            params: {
              jcpchno: val
            },
            loading: true,
            tip: false
          })
          .then(results => {


           if(results.data.mawbList.length>1){
              this.radioModel='1'

            }else{
              this.radioModel='2'
            }

            results.data.jydate=dateFormat(results.data.jydate,'YMD H:M')
            results.data.jyjcdate=dateFormat(results.data.jyjcdate,'YMD H:M')
            console.log(results.data.jydate)
            this.$set(this.inputModelData,'mawb',results.data.mawbList[0].mawb)
            this.$set(this.inputModelData,'czlx',results.data.mawbList[0].czlx)
            this.$set(this.inputModelData,'gys',String(results.data.mawbList[0].gid))
            this.$set(this.inputModelData,'num',this.bRowData.jynum)

            this.mawbData=results.data.mawbList
            this.checkedData=results.data.mawbList
            this.borrowModelData={...results.data}
            this.sendModelData={...results.data}


            // Object.keys(this.borrowViewData).forEach(i=>{
            //   Object.keys(results.data).forEach(i2=>{
            //     if(i2==i){
            //       this.$set(this.borrowModelData,i,results.data[i])
            //     }
            //   })
            // })
            // Object.keys(this.sendViewData).forEach(i=>{
            //   Object.keys(results.data).forEach(i2=>{
            //     if(i2==i){
            //       this.$set(this.sendModelData,i,results.data[i])
            //     }
            //   })
            // })

          })
          .catch(error => {

          })
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

            results.data = getChangeValue(results.data, '空出')

            setTimeout(() => {
                this.tableDataRes = results.data;
              }, 20)
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

      getKhName(data) {
        this.khname = data.wtkhname
          //console.log(data)
      }

		    },
        watch: {
          radioModel(val){
          	if(val=='1'){
          		this.inputViewData.num.hidden=false
              this.feedBackViewData.num.hidden=false
              this.newPreViewData.num.hidden=false
          	}else{
          		this.inputViewData.num.hidden=true
              this.feedBackViewData.num.hidden=true
              this.newPreViewData.num.hidden=true
          	}
            this.newPreModelData={}
            this.feedBackModelData={}
            if(!this.nowatch){
              this.inputModelData={}
            }
          },
          searchType:{
           handler(val){
            if(val=='1'){
              this.feedBackViewData.backarea.hidden=false
              this.feedBackViewData.gid.hidden=true
              this.feedBackViewData.jyr.hidden=true
              this.feedBackViewData.jykhid.hidden=true
              this.feedBackViewData.jydate.hidden=true
            }else{
              this.feedBackViewData.backarea.hidden=true
              this.feedBackViewData.gid.hidden=false
              this.feedBackViewData.jyr.hidden=false
              this.feedBackViewData.jykhid.hidden=false
              this.feedBackViewData.jydate.hidden=false
            }
            //this.feedBackViewData.
           },
           immediate:true
          },
          'borrowModelData.jypostype':{
            handler(val){
              if(val=='1'){

              this.borrowViewData.jywffid.hidden=false
              this.borrowViewData.jymdg.hidden=true
            }else{
              this.borrowViewData.jymdg.hidden=false
              this.borrowViewData.jywffid.hidden=true
            }
          },
          immediate:true

          },
          'preOpModelData.bookingpostype':{
            handler(val){
             if(val=='1'){
              this.preOpViewData.bookingwffid.hidden=false
              this.preOpViewData.bookingmdg.hidden=true
            }else{
              this.preOpViewData.bookingmdg.hidden=false
              this.preOpViewData.bookingwffid.hidden=true
            }
            },
            immediate:true
          },
          'borrowModelData.jytype':{
            handler(val){
             if(val=='1'){
              this.borrowViewData.jykhid.hidden=true
              this.borrowViewData.jyarea.hidden=false
              this.borrowViewData.jywffid.required=false
              this.borrowViewData.jymdg.required=false
             }else{
              this.borrowViewData.jykhid.hidden=false
              this.borrowViewData.jyarea.hidden=true
              this.borrowViewData.jywffid.required=true
              this.borrowViewData.jymdg.required=true
             }
            },
            immediate:true
          },
          jcpch:{
            handler(val){
            if(val){
              this.nowatch=true
              this.bOutDetail(val)
            }
            },
            immediate:true


          }
        },

        created(){

        },
        computed:{
         title(){
          if(this.pageType=='1'){
            return '外借'
          }else if(this.pageType=='2'){
            return '寄出'
          }else if(this.pageType=='3'){
            return '预定'
          }else if(this.pageType=='4'){
            return '归还'
          }
         }


        }

    }
</script>


<style scoped lang="less">
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      display: flex;
      align-items: center;
      height: 32px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-c {
      padding: 20px;
    }
  }
  .basic-information {
    /deep/ .el-date-editor.el-input {
      width: 100%;
    }
    /deep/ .el-input__icon {
      line-height: 28px;
    }
  }

</style>
