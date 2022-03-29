<template>
  <div>
      <commonTable class="commonTable" :head="mawb_table_model" style="position:relative;" :tableIndex="0"  :table-data="costData" :className="modCostIndex" :wagetype="1" :putIndex="modCostIndex">

     <template slot="firstTd" slot-scope="props">

     <!-- 	<td style="text-align:center">       
         <i class="el-icon-addbohui" title="新增并驳回" @click="addConfirmWage"></i>
         <i class="cancelWageIcon" @click="delCurCost(wageinout,1)" title="取消修改" style="vertical-align:middle"></i>
        </td> -->

        <td>
            <input type="checkbox" v-model="curentObject.isfree">
        </td>

        <td>
            --
        </td>
       
  

        <td style="display:inline-flex;border:none;width:100%;">
            <page-select :modelval.sync="curentObject.gid" :pagetype="wageinout=='1'?2:3" :area="inputModelData.area" v-if="inputModelData.area" :wtxmname="inputModelData.wtxmname" :fid="inputModelData.fid" :ifRefreshData.sync="ifRefreshData" @change="getSettname">
                 <template slot="other">
                       <jsdxwh :fid="inputModelData.fid" :area="inputModelData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
                 </template>
            </page-select>
        </td>

        <td>
            <page-select :modelval.sync="curentObject.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :disabled="curentObject.isallin=='1'" :servicecode="inputModelData.area==conditionalAreaForBuild?conditionalAreaForBuild:''" @change="getServiceData"></page-select>
        </td>

        <td>
            <el-select v-model="curentObject.wagetype" style="width:130px;">
                <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
            </el-select>
        </td>

        <td>
            <el-input v-model="curentObject.num" style="width:100px;" @blur="yanzhenzzF('1','1','num')"></el-input>
        </td>
        <td>
            <el-input v-model="curentObject.price" style="width:100px;" @blur="yanzhenzzF('1','1','price')"></el-input>
        </td>

        <td>
            <el-select v-model="curentObject.currency" style="width:100px;">
                <el-option v-for="(item,index) in currencyList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
        </td>

        <td>
            <el-input v-model="curentObject.leastwageall" style="width:100px;" :disabled="true"></el-input>
        </td>

        <td>
            <el-input v-model="curentObject.wageall" style="width:100px;" :disabled="true"></el-input>
        </td>
        <td>
            <el-input v-model="zdChangeRate" style="width:100px;" :disabled="true"></el-input>
        </td>
            <td>
                <el-select v-model="curentObject.otherno" style="width:150px;">
                    <el-option v-for="(item,index) in hawbList" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </td>

        <td>
            <el-input v-model="curentObject.remark" style="width:100px;"></el-input>
        </td>
     </template>

 
     </commonTable>

     <el-input type="textarea" v-model="modifyReason" style="margin-top:12px;margin-bottom:12px;" :autosize="{minRows:4}" placeholder="驳回原因" class="input-required"></el-input>
     <p style="text-align:right">
     <el-button type="primary" @click="addConfirmWage">新增并驳回</el-button>
     </p>
         <!-- 联系人弹框 -->
    <el-dialog width="500px" top="4%" center :visible.sync="showContact" @close="showContact = false;modCostIndex=-1;" :close-on-click-modal=false v-if="showContact" append-to-body>
        <h3 style="font-size:16px;color:#004d84;margin-bottom:20px;margin-top:-10px;">
            <span v-if="methods=='PUT'">修改申请人</span>
            <span v-else-if="methods=='POST'">新增申请人</span>
            <span v-else="methods=='DELETE'">删除申请人</span>
        </h3>
        <!-- <accountMake :orderInformation="orderInformation" :wageinout="1" :system="system" :area="area" :isFromFob="isFromFob" :guid="boguid"></accountMake>
-->
        <page-select :modelval.sync="contact" :pagetype="9" :area="inputModelData.area"></page-select>

        <el-input type="textarea" v-model="modifyReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" :placeholder="methods=='PUT'?'修改理由':methods=='POST'?'新增理由':'删除理由'"></el-input>

        <span slot="footer" class="dialog-footer" style="float:right;margin-top:-20px;">
            <el-button @click="showContact = false;modCostIndex=-1;delCurCost(wageinout,'1')">取 消</el-button>
            <el-button @click="modCost2">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import {
getChangeRate,
computedWeight
} from '../../api/localStorage.js'

 import {
    setBhiconColorMixin
  } from "@/common/detailPagesMixin"

export default { 
  name: 'costComtab',
  mixins: [setBhiconColorMixin],
  props:{
  	wageinout:{
    type:[String,Number],
    default: 1
  	},
  	inputModelData:Object,
    initiator:{
      type:[String,Number],
      default: 50
    }
  },
  data () {
    return {
    	costData:[],
    	  mawb_table_model: [
    	        // {
             //        field: 'operate',
             //        title: '操作'
             //    },
                {
                    field: "isfree",
                    title: "免"
                },
                // {
                //     field: "addman",
                //     title: "创建人"
                // },
                {
                    field: "confirmBill",
                    title: "状态"
                },
               
                {
                    field: "settname",
                    title: "结算对象"
                },
                {
                    field: "items",
                    title: "服务项目"
                },
                {
                    field: "wagetype",
                    title: "结算方式"
                },
                {
                    field: "num",
                    title: "数量"
                },
                {
                    field: "price",
                    title: "单价"
                },
                {
                    field: "currency",
                    title: "币种"
                },
                {
                    field: "leastwageall",
                    title: "金额"
                },
                {
                    field: "wageall",
                    title: "RMB金额"
                },
                {
                    field: "changerate",
                    title: "汇率"
                },
                 {
                  field: "otherno",
                  title: "分运单号",
                  hidden: false
              },
                {
                    field: "remark",
                    title: "备注"
                }
            ],
            curentObject:{
	            num: '',
                price: '',
                currency: '人民币',
                otherno: '--',
                gid: ''
            },
            modCostIndex: '-1',
            serviceSelectCode:'',//code
            ifRefreshData: false, //刷新结算对象数据
            hawbList:[],//分单List
            jsfs: [],//结算方式
            currencyList: [],//货币
            showContact:false,
            modCostIndex:-1,//费用index
            templetadata:{},//新增费用记录
            contact:'',//联系人
            modifyReason:'',//理由
    }
  },

  methods:{
        // 验证
        yanzhenzzF(type, dom, field) {
            if (dom == '1' && type == '1' && field == 'num') {
                if (this.curentObject.wagetype == '票') {
                    var reg = /^[1-9]\d*$/
                    if (this.curentObject.num && !reg.test(this.curentObject.num)) {
                        this.$message({
                            message: '请输入整数',
                            type: 'error',
                            duration: 1000
                        })
                        this.curentObject.num = ''
                    }
                } else {
                    var reg = /^[0-9]+.?[0-9]{0,2}?$/
                    if (this.curentObject.num && !reg.test(this.curentObject.num)) {
                        this.$message({
                            message: '请输入整数或者2位小数',
                            type: 'error',
                            duration: 1000
                        })
                        this.curentObject.num = ''
                    }
                }

            } else if (dom == '1' && type == '1' && field == 'price') {
                var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/
                if (this.curentObject.price && !reg.test(this.curentObject.price)) {
                    this.$message({
                        message: '请输入整数或者2位小数',
                        type: 'error',
                        duration: 1000
                    })
                    this.curentObject.price = ''
                }
            }

        },
        getServiceData(data) {
            this.serviceSelectCode = data.servicecode
        },
        getSettname(data) {
            this.curentObject.settname = data.usr_name
        },
        //获取选中分单guid
        getOtherGuid(hawb) {
            //alert(hawb)
            var otherguid = ""
            this.hawbList.forEach(item => {
                if (item.name == hawb) {
                    otherguid = item.id
                }
            })
            return otherguid || -1

        },
         getAllHawb() {
            //alert('1')
            this.$axios({
                method: 'get',
                url: this.$store.state.webApi + 'api/ExAxpline',
                params: {
                    hpoidHawbGroup: this.inputModelData.guid
                },
                loading: true,
                tip: false
            }).then(results => {
                var resultsData = results.data
                var hawbShow = ""
                for (var i in resultsData) {
                    this.hawbList.push({
                        name: resultsData[i].hawb,
                        id: resultsData[i].guid
                    })
                    hawbShow += resultsData[i].hawb + ','
                }
                this.hawbShow = hawbShow.substring(0, hawbShow.length - 1)
            })
        },
        modCost2(){
           if ($.trim(this.contact) == '' || $.trim(this.modifyReason) == '') {
                this.$message.error('填写修改申请人或者修改理由');
                return false
           }else{
              this.templetadata.contact=this.contact
              this.templetadata.modifyReason=this.modifyReason
              this.templetadata.status=-1 
              this.templetadata.wagedom = this.resetJieshuanWagedom(this.templetadata, this.inputModelData);
              this.modCost(this.templetadata)
           }
        },
         addConfirmWage() { //新增并确认
          
            if (this.wageinout=='1'&& Number(this.inputModelData.gid) < 0) {
                this.$message.error('无委托客户无法操作')
                return false
            }


            if (!Number(this.curentObject.price) || !Number(this.curentObject.num) || !this.curentObject.wagetype || !this.curentObject.items) {
               this.$message.error('请填写完整费用');
               return false
            }

            if(!this.modifyReason){
              return this.$message.error('请填写原因')
            }

                var templetadata = {...this.curentObject};
                templetadata.sid = this.inputModelData.boguid 
                templetadata.boguid = this.inputModelData.boguid 
                templetadata.quote = 0
                templetadata.wageinout = this.wageinout
                templetadata.price = Number(templetadata.price).toFixed(2)
                templetadata.wageall = Number(templetadata.wageall).toFixed(2)
                templetadata.changerate = Number(templetadata.changerate).toFixed(4)
                templetadata.otherguid = this.getOtherGuid(templetadata.otherno)
                templetadata.wagedom = '结算'
                templetadata.servicecode = this.serviceSelectCode
                this.methods = 'POST'
                templetadata.isfree = templetadata.isfree == true ? '2' : '1'
                templetadata.area = this.inputModelData['area']
  
                templetadata.confirmstatus = 1
                this.templetadata=templetadata
                templetadata.status=-1 
                templetadata.wagedom = this.resetJieshuanWagedom(templetadata, this.inputModelData);
                templetadata.initiator = this.initiator
                templetadata.rollbackreason=this.modifyReason
                //templetadata.initiator = this.initiator
                this.modCost(templetadata)
                // if ((this.inputModelData.area == this.conditionalAreaForBuild)  && this.inputModelData.pono.indexOf('BOAE') != '-1') {
                //     this.showContact = true
                // } else {
                //       templetadata.status=-1 
                //       templetadata.wagedom = this.resetJieshuanWagedom(templetadata, this.inputModelData);
                //       this.modCost(templetadata)
                // }
       },

       modCost(templetadata){
        this.$axios({
                method: this.methods,
                url: this.$store.state.webApi +'api/CheckBill/InsertAndReject',
                data: templetadata,
                loading: true,
                tip: false
            }).then(results => {
                if (results.data.resultstatus == 0) {
                    this.$message.success(results.data.resultmessage)
                    //this.showContact=false
                    this.$parent.$parent.bohuiAddDialog=false
                    this.$emit('reSearch');
                    this.curentObject = {
                        currency: this.defaultCurrency || '人民币',
                        gid: templetadata.gid,
                        otherno: '--',
                        num: '',
                        price: ''
                    }
                } else {
                    this.$message.error(results.data.resultmessage)
                }
            })
       },

       //清空当前费用
        delCurCost(type, dom, show) {

            this.contact = ""
            //console.log(this.otherguid)
            if (type == "1" && dom == "1") {
                this.modCostIndex = "-1"
                this.curentObject={
                   currency: this.defaultCurrency || '人民币',
                   gid: this.inputModelData.gid,
                   otherno: '--',
                   num: '',
                   price: '' 
                }
            }
        },
  },
  mounted:function(){
    this.getAllHawb()
  },
  created:function(){
	let groupIdData = JSON.parse(localStorage.getItem('groupType'))
	groupIdData.forEach(item => {
	    if (item.groupid == 33) {
	        this.jsfs.push({
	            value: item.id,
	            typename: item.typename
	        })
	    }
	})

	let currencyData = JSON.parse(localStorage.getItem('currencyData'))
	currencyData.forEach(item => {
	    this.currencyList.push(item.cname)
	})

	if (this.defaultCurrency) {
            this.curentObject.currency = this.defaultCurrency
     }
     this.curentObject.gid=this.inputModelData.gid
     
  },
  computed:{
  	    zdChangeRate() {
            this.curentObject.changerate = getChangeRate(this.curentObject.currency)
            if (this.curentObject.num && this.curentObject.price) {
                this.curentObject.leastwageall = Number(Number(this.curentObject.num) * Number(this.curentObject.price)).toFixed(2)
                this.curentObject.wageall = Number(Number(this.curentObject.num) * Number(this.curentObject.price) * Number(getChangeRate(this.curentObject.currency))).toFixed(2)
            }
            this.$forceUpdate()
            return getChangeRate(this.curentObject.currency)
        },
        defaultCurrency() {
            return this.$store.getters.userSetting.defaultCurrency
        },
  },
  watch:{
    "curentObject.wagetype"(val) {

  switch (val) {
    case "箱":
    this.curentObject.num = this.inputModelData.realpiece;
    break;
    case "票":
      //console.log('2')
      this.curentObject.num = "1";
      break;
      case "计重":
      this.curentObject.num = computedWeight(
        this.curentObject.realvolume,
        this.curentObject.realweight
        );
      break;
      case "结算重量":
      this.curentObject.num =this.inputModelData.accountweightout;
      break;
      case "毛重":
      this.curentObject.num = this.inputModelData.realweight;
      break;
      case "分运单票数":
       this.curentObject.num = this.inputModelData.hawbnum||0
       break;
       case "总运单票数":
       this.curentObject.num = 1;
       break;
       case "总运单件数":
       this.curentObject.num = this.inputModelData.realpiece;
       break;
     }
   },
   'curentObject.num'(val) {

    if (this.curentObject.price) {
        this.curentObject.leastwageall = (Number(val) * Number(this.curentObject.price)).toFixed(2)
        this.curentObject.wageall = (Number(this.curentObject.leastwageall) * Number(this.curentObject.changerate)).toFixed(2)
    }

},
'curentObject.price'(val) {
    if (this.curentObject.num) {
        this.curentObject.leastwageall = (Number(this.curentObject.num) * Number(val)).toFixed(2)
        this.curentObject.wageall = (Number(this.curentObject.leastwageall) * Number(this.curentObject.changerate)).toFixed(2)
    }

},
'curentObject.currency'(val) {

    if (this.curentObject.num && this.curentObject.price) {
        this.curentObject.leastwageall = (Number(this.curentObject.num) * Number(this.curentObject.price)).toFixed(2)
        this.curentObject.wageall = Number(Number(this.curentObject.num) * Number(this.curentObject.price) * Number(this.curentObject.changerate)).toFixed(2)
    }

},
  }
}
</script>
<style lang="less">
        .cancelWageIcon {
            vertical-align: bottom;
            background: url("../../../boStatic/images/chahao.png") no-repeat;
        }
</style>