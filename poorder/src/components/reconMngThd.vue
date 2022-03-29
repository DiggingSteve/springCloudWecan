<template>
  <div>
    <div class="page-container-box">

      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync='pageshow' :pagetype="1" :chinese-where.sync="chineseWhere" @reset="reset">
      </newSearchComp>

      <div class="searchForm">

        <el-button @click="search" type="primary">查询</el-button>
        <!-- <el-button   type="primary" @click="cancelDz('multiply')">取消对账</el-button> -->
        <!--           <el-button  @click="send_email" type="primary">Email发送</el-button> -->
      </div>


    </div>

    <!-- <div style="margin: 0 0 20px 50px;">
         <el-button   type="primary" @click="cancelDz('multiply')">取消对账</el-button>
          <el-button  @click="send_email" type="primary">Email发送</el-button>
        </div> -->

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="showTotal" :chinese-where.sync="chineseWhere">
      <!--  <template slot="checkbox" slot-scope="props"><input type="checkbox" :value="props.data.index" v-model="jobidArr"></template> -->
      <template slot="canDzFun" slot-scope="props"><i class="el-icon-delete"
          @click="cancelDz('single',props.data.index)" title="取消对账"></i></template>
      <!--       <template slot="dzInfo" slot-scope="props" style="display:block!important"><i class="el-icon-document" @click="addDeleteDz(props.data.index)" title="添加至对账单"></i></template> -->
      <template slot="changeState" slot-scope="props" style="display:block!important"><i class="el-icon-sort"
          @click="changeDzState(props.data.index)"
          :title="props.data.row.billstatus=='对账中'?'改为已对账':'改为对账中'"></i></template>
      <template slot="print" slot-scope="props" style="display:block!important">
        <i class="el-icon-printer" @click="printDz(props.data.index)" title="打印账单"></i>
        <i class="el-icon-download" @click="outExcel(props.data.index)" title="导出excel"></i>

      </template>
      <!-- <template slot="dzEmail" slot-scope="props"><i class="el-icon-message"></i></template> -->
      <template slot="pchno" slot-scope="props" style="display:block!important"><span
          @click="singleDzDataInfo(props.data.index,props.data)"
          style="color:#1a7dbf;cursor:pointer">{{props.data.value}}</span></template>

    </tableCompt>

    <div style="display:block">
      <excelOut :tableData="excelData" ref="excelout" :title='name' :headData="excelHead" pagetype='3'></excelOut>
    </div>

    <!-- 单条对账记录信息弹框 -->
    <el-dialog title="已对账" width="100%" top="0" center :visible.sync="singleDzInfo" v-if="singleDzInfo"
      @close="handleClose" class="dialogPage" :modal="false">

      <singleDz :singleDzData="singleDzData" :showbtn='1' @closeDialog="closeDialog" ref="singledz" :system="system" :checkStatus="checkStatus"
        :area="area" :addman="addman" :wageinout="wageinout"></singleDz>

    </el-dialog>


    <!-- 添加删除账单 -->

    <el-dialog width="100%" top="0" center :visible.sync="addDelDz" :title="addDelTitle" v-if="addDelDz"
      class="dialogPage" :modal="false">

      <addDelDzZj :addDel="addDelId" :billstatus="billstatus" :wageinout="wageinout" :accountcomname="accountcomname"
        :accountcomgid="accountcomgid" :system="system" :area="area"></addDelDzZj>

    </el-dialog>

    <!-- 已对账弹框 -->
    <el-dialog width="600px" top="4%" center :visible.sync="reconOpen" v-if="reconOpen" append-to-body>
      <div style="width:430px;margin:0 auto" v-if="reconOpen">
        <p>
          <span style="min-width:120px;display:inline-block">客户对账人:</span>
          <el-input v-model='reconInfo.confirmman' style="width:300px;"></el-input>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">客户对账时间:</span>
          <el-date-picker v-model="reconInfo.confirmdate" type="datetime" format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" style="width:300px;">
          </el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">我司对账人:</span>
          <el-input v-model='reconInfo.czman' style="width:300px;"></el-input>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block">我司对账时间:</span>
          <el-date-picker v-model="reconInfo.czdate" type="datetime" format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" style="width:300px;">
          </el-date-picker>
        </p>
        <p style="margin-top:20px;">
          <span style="min-width:120px;display:inline-block;vertical-align:middle">对账备注:</span>
          <el-input type="textarea" placeholder="请输入内容" v-model="reconInfo.confirmremark"
            style="width:300px;vertical-align:middle">
          </el-input>
        </p>
        <p style="margin-top:20px;text-align:center">
          <el-button @click="reconOpen=false">取消</el-button>
          <el-button @click="reconFinish">确认</el-button>
        </p>
      </div>
    </el-dialog>


    <!-- 生成对账单 -->
    <el-dialog width="100%" top="0" center :visible.sync="dzdMakeS" v-if="dzdMakeS" class="dialogPage" :modal="false"
      :close-on-click-modal="false" :close-on-press-escape="false">

      <dzdMake :dzdMakeD="dzdMakeD" @Unvisible="dzdMakeS=false" :system="system" :area="area" :pchno="pchno"></dzdMake>

    </el-dialog>

    <!-- 取消对账弹框 -->
    <el-dialog width="400px" top="4%" center :visible.sync="abanDz" v-if="abanDz" append-to-body @close="abanDz=false">

      <div style="text-align:center">
        <p style="margin-bottom:18px;text-align:left;font-size:14px;">取消理由:</p>
        <el-input type="textarea" v-model="abanreason" class="input-required" v-if="abanDz" :autosize="{ minRows:6}">
        </el-input>

        <p style="text-align:center;margin-top:18px;">
          <el-button @click="cancelDzF">确定</el-button>
          <el-button @click="abanDz=false">取消</el-button>
        </p>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {  searCondition, getMomentDate, getChangeValue } from '../api/localStorage.js'
  import singleDz from './orderDetails/singleDz'
  import addDelDzZj from './orderDetails/addDelDzZj'
  import dzdMake from './orderDetails/dzdMake'
  import excelOut from './templates/excelOut'
  import { searchCmptMixins } from '@/components/mixins/topPageMixin'

  export default {
    name: "reconMngThd",
    components: {
      singleDz, addDelDzZj, dzdMake, excelOut
    },
    mixins: [searchCmptMixins],
    props: {
      // system: {
      //   type: String,
      //   default: '空出'
      // },
      wageinout: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {
        name: 'reconMngThd.vue',
        showTotal: { all: true, ybjzt: false, sjjzt: false, zdjzt: false, wageprofit: false, realwageall: false, billwageall: true, wageall: false, finishwageall: false, finishwageall_checkbill: false },
        area: "",
        singleDzInfo: false,
        addDelDz: false,
        addDelTitle: "",//添加删除对账弹框标题
        tableDataRes: [],
        addDelId: "",//添加删除对账单id
        billstatus: "",//对账状态
        accountcomname: '',//添加删除弹框对账公司名
        accountcomgid: '',//添加删除弹框对账公司名ID
        dzdMakeS: false,//打印对话框显示隐藏
        dzdMakeD: {},//对账打印数据传
        reconOpen: false,
        reconInfo: { confirmman: "", confirmdate: "", czman: localStorage.getItem('usrname'), czdate: getMomentDate(), confirmremark: "" },
        selectIndex: '',//设置已对账时选中的Index
        //jobidArr:[],
        singleDzData: {},
        // inputViewData: [
        //     {"title":"结算对象",id:"settname",type:11,"model":"",width:"50",class:'width100',"whereC":"like","sear":'1',"defaultModel":"",jsonArr:{type:"all",area:"",timestamp:"0"}},
        //     {"title":"收付对象",id:"paymentname",type:10,"model":"",width:"50",class:'width100',"whereC":"like","sear":'1',"defaultModel":"",jsonArr:{type:"all",comxz:'1',system:'',area:"",timestamp:"0"}},
        //     {"title":"对账批次号：",id:"pchno",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"订舱编号：",id:"pono",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"总运单号：",id:"mawb",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"分运单号：",id:"hawb",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"客户对账人：",id:"confirmman",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"对账确认日期：",id:"confirmdate",type:7,class:'width100',width:"50","model":"","sear":"1","defaultModel":""},
        //     {"title":"我司对账人",id:"ourconfirmman",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        //     {"title":"创建日期",id:"ourconfirmdate",type:7,"model":"","whereC":"like","sear":'1',"defaultModel":"",class:'width100',width:"50",},
        //    {"title":"收付类型：",id:"wageinout",type:4,"model":"","whereC":"in","sear":'1',"defaultModel":"1",options:[{value:'1',label:'应收'},{value:'2',label:'应付'}]},
        //     {"title":"对账状态：",id:"billstatus",type:5,"model":[],"whereC":"in","sear":'1',options:[{label:'对账中',value:'900'},{label:'已对账',value:'1000'}],"defaultModel":[]},
        //     // {"title":"对账状态：",id:"wageinout",type:4,"model":"","whereC":"in","sear":'1',"defaultModel":"1",options:[{value:'1',label:'应收'},{value:'2',label:'应付'}]}
        // ],
        inputViewData: {
          pchno: { 'title': '对账批次号', "whereStr": "like", type: 1 },
          wageinout: { title: '收付类型', type: 4, options: [{ label: '应收', value: '1' }, { label: '应付', value: '2' }], hidden: true },
          accountcomgid: { 'title': '结算对象', type: 20, pagetype: 1 },
          confirmman: { 'title': this.wageinout == '1' ? '客户确认人' : '供应商确认人', type: 1, "whereStr": "like", titleStyle: { 'minWidth': '110px' } },
          confirmdate: { 'title': this.wageinout == '1' ? '客户确认日期' : '供应商确认日期', type: 15, defaultVal: true, titleStyle: { 'minWidth': '110px' } },
          billstatus: { "title": "对账状态", type: 5, options: [{ label: '对账中', value: '900' }, { label: '已对账', value: '1000' }], "whereStr": "in" },
          pono: { 'title': '订舱编号', type: 1, "whereStr": "like" },
          mawb: { 'title': '总运单号', type: 1, "whereStr": "like" },
          ourconfirmman: { title: '我司对账人', type: 1, whereStr: 'like' },
          ourconfirmdate: { title: '我司对账时间', type: 15, titleStyle: { 'minWidth': '110px' } },
          hbrq: { title: '航班日期', type: 15 },
        },
        inputModelData: {
          wageinout: this.wageinout, billstatus: '900,1000'
        },
        searchData: {},
        pageshow: true,
        tableSelectIndex: '',
        pchno: "",//对账批次号
        chineseWhere: [],
        abanDz: false,//取消对账弹框
        abanreason: '',//取消对账原因
        cancelDzData: {},//取消对账数据
        excelData: [],
        excelHead: [],
        addman: '',
        system: '',
        checkStatus:""

      }
    },
    methods: {
      outExcel(index) {
        this.excelHead = [[
          { "field": "pchno", "title": "对账批次号" },
          { "field": "pono", "title": "工作号" },
          { "field": "mawb", "title": "总运单号" },
          { "field": "accountcomname", "title": "结算对象" },
          { "field": "sfg", "title": "始发港" },
          { "field": "mdg", "title": "目的港" },
          { "field": "hbrq", "title": "航班日期" },
          { "field": "hbh", "title": "航班号" },
          { "field": "czlx", "title": "操作类型" },
          { "field": "acNum", "title": "应收结算重量" },
          { "field": "acPrice", "title": "应收空运费单价" }
        ], [

        ]]
        this.excelData = []
        var data = { area: this.area, system: this.tableDataRes[index].system || '', billid: this.tableDataRes[index].billid }
        this.$axios({ "method": "get", url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPchFinishDetail', params: data }).then(res => {
          //  console.log(333)
          //  console.log(res.data)
          var itemarr = []
          var newarr = []
          var hejiObj = { mywageall: 0 }
          res.data.forEach((m, mk) => {

            m.jobnolist.forEach((e, ek) => {
              newarr.push(e)
              var mywageall = 0
              var acNum = 0
              var acPrice = 0
              var remark = ''

              e.wagelist.forEach(i => {
                if (i.isyf == 2 && i.items == '航司运费') {
                  i.items = '航司运费1'
                }

                if (i.isyf == 1) {
                  i.items = '航司运费'
                  acPrice += Number(i.price)
                  acNum = i.num
                }

                if (!itemarr.includes(i.items)) {
                  itemarr.push(i.items)
                  this.excelHead[1].push({ "field": i.items, "title": i.items })
                  hejiObj[i.items] = 0
                }
                if (newarr[ek][i.items]) {
                  newarr[ek][i.items] = Number(newarr[ek][i.items]) + i.realwageall
                } else {
                  newarr[ek][i.items] = i.realwageall
                }
                if (i.wageremark) {
                  remark += i.wageremark + ','
                }

                newarr[ek][i.items] = Number(newarr[ek][i.items]).toFixed(2)
                hejiObj[i.items] += Number(i.realwageall)
                mywageall += Number(i.realwageall)

              })

              newarr[ek].acNum = acNum
              newarr[ek].acPrice = Number(acPrice).toFixed(2)
              newarr[ek].mywageall = Number(mywageall).toFixed(2)
              newarr[ek].remark = remark.substr(0, remark.length - 1)
              hejiObj['mywageall'] += Number(mywageall)


              delete newarr[ek].wagelist
              newarr[ek] = Object.assign({}, this.tableDataRes[index], newarr[ek])


            })
          });
          this.excelHead[1].push({ "field": 'mywageall', "title": '对账合计' })
          this.excelHead[1].push({ "field": 'wageremark', "title": '费用备注' })

          /*  console.log(555)
           console.log(hejiObj) */
          Object.keys(hejiObj).forEach(i => {
            hejiObj[i] = Number(hejiObj[i]).toFixed(2)
          })
          hejiObj.pono = '合计:'
          newarr.push(hejiObj)
          this.excelData = newarr
          setTimeout(() => {
            this.$refs.excelout.downloadFile()
          }, 500);
        })
      },
      search() {
        //var jsonArr=searCondition(this.inputViewData)
        this.tableDataRes = []
        var jsonArr2 = {
          where: this.searchData,
          "order": "adddate asc"
          //skip:"0"

        }
        var json = { 'json': JSON.stringify(jsonArr2) }
        json.area = this.$store.state.areaState
        // if(json.area.split(',').length>1){
        //   this.$message.error('只能勾选一个区域');
        //   return false
        // }
        //json.system=this.system
        json.system = ''
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPchFinishCollect', params: json, loading: true, tip: true, noarea: 1, nofield: 1 }).then(results => {

          // this.tableDataRes=results.data;

          // this.tableDataRes.forEach((item,index)=>{
          //   if(item.hbrq){
          //     item.hbrq=dateFormat(item.hbrq,"yyyy-mm-dd")
          //   }
          //   item.billstatus=item.billstatus=='900'?'对账中':'已对账'

          // })

          if (results.data.length == 0) {
            this.$message('无查询结果'); return;
          } else {
            this.pageshow = false
          }
          results.data = getChangeValue(results.data, '空出', 'reconMngThd')
          // 处理日期和件重体
          //    setTimeout(()=>{

          //    results.data.forEach((item,index)=>{

          //  if(item.hbrq){
          //    item.hbrq=dateFormat(item.hbrq,"yyyy-mm-dd")

          //  }

          //  item.ybjzt=item.ybpiece+"/"+pointChange(item.ybweight,2)+"/"+pointChange(item.ybvolume,3)
          //  item.areadom=this.$store.state.areaState+item.dom


          // })
          //    },10)
          setTimeout(() => {
            this.tableDataRes = results.data;
          }, 0)
        })
          .catch(errors => {

          })
      },
      wtdataP(data) {
        var inputData = this.inputViewData
        for (var i in inputData) {
          if (inputData[i].type == data.type) {
            if (data.type == 10) {
              this.wtxmid = data.id
            } else if (data.type == 11) {
              this.wtkhid = data.id
            }
            inputData[i].model = data.wtdata
          }
        }
      },
      // 取消对账
      cancelDz(type, val) {
        var status = 1;

        var billid = ""
        if (type == "single") {
          billid = this.tableDataRes[val].billid
          if (this.tableDataRes[val].pzfinishwageall != '--' && this.tableDataRes[val].pzfinishwageall != 0) {
            this.$message.error('已开凭证无法删除')
            return false
          }
        } else if (type == "multiply") {
          //  alert('1')
          var templatebillid = []
          var pzfinishwageall = []
          ////console.log(this.jobidArr)
          //alert(this.jobidArr)
          if (this.jobidArr.length == 0) {
            this.$message.error('请选择对账批次号');
            status = 0
          }
          this.jobidArr.forEach(item => {
            templatebillid.push(this.tableDataRes[item].billid)
            pzfinishwageall.push(this.tableDataRes[item].pzfinishwageall)
          })
          pzfinishwageall.forEach(item => {
            if (item != '--') {
              this.$message.error('已开凭证无法删除')
              status = 0
            }
          })
          billid = templatebillid.join(',')
        }

        this.cancelDzData = { area: this.tableDataRes[val].area, billid: billid, accountcomname: this.tableDataRes[val].accountcomname }
        //console.log(data)
        if (status != 0) {
          //this.abanDz = true
            this.$confirm('是否取消对账?','提示',{
                  confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
          .then(()=>{
            this.$axios({"method":"DELETE",url:this.$store.state.webApi+'api/ExAiraxpCheckBillPch',data:this.cancelDzData})
              .then(results=>{
                   if(results.data.resultstatus==0){
                    this.search()
                   }
              })
              .catch(error=>{

              })
          })
          .catch(()=>{
            this.$message({
                    type:'info',
                    message:'已取消删除'
                  })
          })
        }









      },
      // 取消对账方法
      cancelDzF() {
        //data.reason=''
        if (this.abanreason == "") {
          this.$message.error('请填写取消对账理由', 1000);
          return false
        } else {
          this.cancelDzData.delbillreason = this.abanreason
        }
        this.$axios({ "method": "DELETE", url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPch', data: this.cancelDzData })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.abanDz = false
              this.cancelDzData = {}
              this.search()
            }
          })
          .catch(error => {

          })

      },
      // 查看对账
      singleDzDataInfo(val,row) {
        // console.log(val,row.row.billstatus)
        this.checkStatus = row.row.billstatus
        // billstatus
        this.tableSelectIndex = val
        this.addman = this.tableDataRes[val].addman
        //this.area=this.tableDataRes[val].area
        this.singleDzInfo = true
        this.area = this.tableDataRes[val].area
        var billstatus = this.tableDataRes[val].billstatus == '已对账' ? '1000' : '900'
        this.singleDzData = { billid: this.tableDataRes[val].billid, confirmman: this.tableDataRes[val].confirmman, confirmdate: this.tableDataRes[val].confirmdate, billstatus: billstatus, ourconfirmman: this.tableDataRes[val].ourconfirmman, ourconfirmdate: this.tableDataRes[val].ourconfirmdate, pchno: this.tableDataRes[val].pchno, wageinout: this.tableDataRes[val].wageinout, accountcomname: this.tableDataRes[val].accountcomname, accountcomgid: this.tableDataRes[val].accountcomgid }


      },

      // 改变对账状态
      changeDzState(val) {
        var billstatus = ""
        this.selectIndex = val
        var data = {}
        if (this.tableDataRes[val].billstatus == '对账中') {
          billstatus = 1000
          this.reconOpen = true
          this.reconInfo.confirmman = this.tableDataRes[val].confirmman
          this.reconInfo.confirmdate = this.tableDataRes[val].confirmdate.replace(/-/g, '/')
        } else if (this.tableDataRes[val].billstatus == '已对账') {
          billstatus = 900
          data = { area: this.tableDataRes[val].area, system: this.tableDataRes[val].system, id: this.tableDataRes[val].billid, billstatus: billstatus, wageinout: this.tableDataRes[val].wageinout }
          this.$axios({ "method": "put", url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPch', data: data }).then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage)
              this.tableDataRes[val].billstatus = billstatus == '1000' ? '已对账' : '对账中'
            } else {
              this.$message.error(results.data.resultmessage)
            }
          }).catch(error => {

          })
        }
      },

      // 设置已对账
      reconFinish() {

        var data = { area: this.tableDataRes[this.selectIndex].area, system: this.tableDataRes[this.selectIndex].system, id: this.tableDataRes[this.selectIndex].billid, billstatus: 1000, wageinout: this.tableDataRes[this.selectIndex].wageinout, confirmman: this.reconInfo.confirmman, confirmdate: this.reconInfo.confirmdate, confirmremark: this.reconInfo.confirmremark }
        this.$axios({ "method": "put", url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPch', data: data }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage)
            this.tableDataRes[this.selectIndex].billstatus = '已对账'
            this.reconOpen = false
            this.reconInfo.confirmman = ""
            this.reconInfo.confirmdate = ""
            this.reconInfo.confirmremark = ""
            this.selectIndex = ""
          } else {
            this.$message.error(results.data.resultmessage)
          }
        }).catch(error => {

        })

      },

      // 添加删除对账
      addDeleteDz(val) {
        this.addDelDz = true
        this.addDelId = this.tableDataRes[val].billid
        this.billstatus = this.tableDataRes[val].billstatus == '对账中' ? '900' : '1000'
        this.addDelTitle = this.tableDataRes[val].pchno
        this.accountcomname = this.tableDataRes[val].accountcomname
        this.accountcomgid = this.tableDataRes[val].accountcomgid
        this.area = this.tableDataRes[val].area
        // //console.log(this.addDelTitle)
      },
      // 打印
      printDz(val) {
        this.pchno = this.tableDataRes[val].pchno
        console.log(this.pchno)
        var data = { area: this.tableDataRes[val].area, system: this.tableDataRes[val].system || '', billid: this.tableDataRes[val].billid }
        this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExAiraxpCheckBillPchFinishDetail', params: data })
          .then(results => {
            //console.log(results.data)
            var jobnolist = []
            results.data.forEach((item, index) => {
              item.jobnolist.forEach((item2, index2) => {
                item2.dwageall = item2.thisfinishwageall_checkbill
                item2.realjzt = item2.realpiece + '/' + Number(item2.realweight).toFixed(2) + '/' + Number(item2.realvolume).toFixed(2)
                item2.hbrq = item2.hbrq.substring(0, 10)
                jobnolist.push({ jobListData: item2, wagelist: [] })
                item2.wagelist.forEach(item3 => {
                  item3.realjzt = item2.realjzt
                  item3.hbh = item2.hbh
                  item3.dwageall = item3.thisfinishwageall_checkbill
                  item3.hbrq = item3.hbrq.substring(0, 10)
                  jobnolist[index2].wagelist.push(item3)
                })
              })
            })
            //console.log(jobnolist)
            var printData = { billid: this.tableDataRes[val].billid, area: this.tableDataRes[val].area, isdel: '1', accountcomname: results.data[0].accountcomname, wageinout: this.tableDataRes[val].wageinout, jobnolist: jobnolist, billstatus: 1000, system: this.tableDataRes[val].system, confirmman: this.tableDataRes[val].confirmman, confirmdate: this.tableDataRes[val].confirmdate, confirmremark: this.tableDataRes[val].confirmremark, noPrint: 1, ourconfirmman: this.tableDataRes[val].ourconfirmman, ourconfirmdate: this.tableDataRes[val].ourconfirmdate }
            //console.log(printData)
            this.dzdMakeS = true
            this.dzdMakeD = printData

            this.area = this.tableDataRes[val].area

            //           orderList.forEach((item,index)=>{
            //             jobnolist.push({jobListData:this.jobListData[item],wagelist:[]})
            //             ////console.log(this.jobListData[item].wagelist)
            //             //console.log(this.costValue)
            //             this.jobListData[item].wagelist.forEach(item2=>{

            //               this.costValue.forEach(item3=>{
            //                 if(this.costListData[item3]==item2){
            //                   //console.log(this.costListData[item3])
            //                   //console.log(item2)
            //                   //jobnolist
            //                   jobnolist[index].wagelist.push(item2)
            //                   //jobnolist[index].wagelist.push(item2)
            //                 }
            //               })
            //             })
            //           })
            // var data={billid:-1,area:this.$store.state.areaState,isdel:'1',accountcomname:this.sjcAllData[this.jsValue[0]].accountcomname,wageinout:this.wageinout,jobnolist:jobnolist,billstatus:1000,system:this.system,confirmman:this.reconInfo.confirmman,confirmdate:this.reconInfo.confirmdate,confirmremark:this.reconInfo.confirmremark}
            // //console.log(data)
            //       this.dzdMakeS=true
            //       this.dzdMakeD=data
          })
          .catch(error => {

          })
      },
      //关闭对话框
      dosearch() {
        ////console.log(this.)
        //alert('1')
        this.search()
        ////console.log(this.$refs.addDelDz.data.billstatusString)
      },
      //关闭单条对账记录
      handleClose() {
        if (this.$refs.singledz.billstatusString) {
          this.tableDataRes[this.tableSelectIndex]['billstatus'] = this.$refs.singledz.billstatusString == '900' ? '对账中' : '已对账'
        }

        ////console.log()
      },

      //返回接父级
      closeDialog() {
        this.singleDzInfo = false
        if (this.$refs.singledz.billstatusString) {
          this.tableDataRes[this.tableSelectIndex]['billstatus'] = this.$refs.singledz.billstatusString == '900' ? '对账中' : '已对账'
        }
        if (this.$refs.singledz.delete) {
          this.tableDataRes.splice(this.tableSelectIndex, 1)
        }
      },


      send_email() {
        ////console.log('send_email')
      }


    },
    created() {

    },
    watch: {},
    computed: {
      jobidArr() {
        var arr = []
        this.tableDataRes.forEach((i, index) => {
          if (i.checked) {
            arr.push(index)
          }
        })
        return arr
      }
    }
  }
</script>

<style lang="less" scoped>

</style>