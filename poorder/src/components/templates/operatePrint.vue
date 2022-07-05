<template>
  <div class="arrivePrint">
     
     <div class="headOperate">
            <div class="title">操作流转单打印</div>
            <div>
                <el-button type="primary" @click="print">打印</el-button>
                <el-button @click='$emit("update:visible", false)'>返回</el-button>
            </div>
     </div>

     <div class="contentWrap">
            <div ref="printContent">
             <div class="detail-c" v-for="(item,index) in contentList" style="page-break-after:always;" :key="index">
                <img src="../../../boStatic/images/wecanlogo_jinkou.gif"  class="headImg">
                <div class="tableTitle">

                    <div>
                        <span>查询号:</span>
                        <span>{{item.pono}}</span>
                    </div>

                    <div>
                        <span>代理:</span>
                        <span>{{item.wtkhname}}</span>
                    </div>

                    <div>
                        <span>到港日期:</span>
                        <span>{{item.hbrq}}</span>
                    </div>
                </div>
                <table  cellpadding="0" cellspacing="0" class="topTable">
                   <tr>
                       <td>总运单号</td>
                       <td>分运单号</td>
                       <td>件数</td>
                       <td>重量(KG)</td>
                       <td>收费重量(KG)</td>
                       <td>到付运费</td>
                       <td>放货银行</td>
                       <td>结算方式</td>
                   </tr>
                   <tr>
                       <td>{{item.mawb}}</td>
                       <td>{{item.hawb}}</td>
                       <td>{{item.ybpiece}}</td>
                       <td>{{Number(item.ybweight).toFixed(2)}}</td>
                       <td>{{Number(item.jfweight).toFixed(2)}}</td>
                       <td></td>
                       <td></td>
                       <td>{{item.jsfs=='2'?'月结':'现结'}}</td>
                   </tr>
                   <tr>
                       <!-- <td>联系电话</td>
                       <td colspan="2">{{item.khphone}}</td> -->
                       <td rowspan="2">尺寸备注</td>
                       <td colspan="2" rowspan="2">{{item.sizeremark}}</td>
                       <td>传真</td>
                       <td>{{item.faxshr}}</td>
                       <td>报关单位</td>
                       <td colspan="2">{{item.gysname}}</td>
                   </tr>
                   <tr>
                       <!-- <td></td>
                       <td></td> -->
                       <td>启运港</td>
                       <td>{{item.sfg}}</td>
                       <td>本地/外地</td>
                       <td colspan="2">{{item.hwplace=='1'?'本地':'外地'}}</td>
                   </tr>
                </table>

                <div class="costTable">
                    <p class="costTableTitle">收费情况</p> 
                    <table>
                        <tr>
                           <td colspan="8" style="background:grey;color:#fff">应收费用</td>
                        </tr>
                        <tr v-for="i in Math.ceil(costObject['应收费用'].length/4)"  :key="i">
                        
                           <template v-for="item in costObject['应收费用'].slice(4*(i-1),4*i)">
                                <td>{{item.items}}</td>
                                <td>{{item.value}}</td>
                           </template>
                        </tr>
                    </table>

                    <table style="margin-top:24px;">
                        <tr>
                           <td colspan="8" style="background:grey;color:#fff">应付费用</td>
                        </tr>
                        <tr v-for="i in Math.ceil(costObject['应付费用'].length/4)"  :key="i">
                        
                           <template v-for="item in costObject['应付费用'].slice(4*(i-1),4*i)">
                                <td>{{item.items}}</td>
                                <td>{{item.value}}</td>
                           </template>
                        </tr>
                    </table>
                </div>

               
               
            </div>  
            </div>

 
     </div>


     
  </div>
</template>

<script>
import { getWtxmname,getMomentDate,getGysname } from "../../api/localStorage.js"

export default {
  props: {
    boguid:{
        type:String
    },
    visible:Boolean
  },
  components: {
   
  },
  data() {
    return {
        contentList:[],//数据
        costObject:{
            '应收费用':[
            //{items:'抽单费',value:''},{items:'报关费',value:''},{items:'舱单费',value:''},{items:'连单费',value:''},{items:'地面服务费',value:''},{items:'拼单费',value:''}, {items:'航空信息费',value:''},{items:'进口代垫税金',value:''},{items:'进港检查费',value:''},{items:'电子支付平台费',value:''},{items:'数据传输费',value:''},{items:'海关查验服务费',value:''},{items:'精密仪器保管费',value:''},{items:'叉车费',value:''},{items:'机械费',value:''},{items:'外仓仓储费',value:''},{items:'大件货操作费',value:''},{items:'送货费',value:''},{items:'超限货操作费',value:''},{items:'快递费',value:''},{items:'特货操作费',value:''},{items:'空运费',value:''},{items:'特种超限货物操作费',value:''},{items:'库区查验短驳费',value:''},{items:'提货费',value:''},{items:'库区查验搬运费',value:''},{items:'仓储费',value:''},{items:'库区查验辅助费',value:''},{items:'舱单录入费',value:''},{items:'库区查验仓储费',value:''},{items:'操作费',value:''},{items:'库区查验上门费',value:''},{items:'进出仓费',value:''},{items:'进港货物特殊处理费',value:''},{items:'铁托盘使用费',value:''},{items:'查验货物掏箱费',value:''},{items:'海关辅助查验操作费',value:''}
            ],
            '应付费用':[
            //{items:'地面服务费',value:''},{items:'外仓仓储费',value:''},{items:'航空信息费',value:''},{items:'送货费',value:''},{items:'进港检查费',value:''},{items:'快递费',value:''},{items:'精密仪器保管费',value:''},{items:'舱单费',value:''},{items:'提货费',value:''},{items:'叉车费',value:''},{items:'短驳费',value:''},{items:'代理费',value:''},{items:'海关辅助查验操作费',value:''},{items:'库区查验短驳费',value:''},{items:'报关费',value:''},{items:'库区查验搬运费',value:''},{items:'连单费',value:''},{items:'库区查验辅助费',value:''},{items:'拼单费',value:''},{items:'库区查验仓储费',value:''},{items:'进口代垫税金',value:''},{items:'库区查验上门费',value:''},{items:'海关查验服务费',value:''},{items:'进港货物特殊处理费',value:''},{items:'电子支付平台费',value:''},{items:'查验货物掏箱费',value:''},{items:'仓储费',value:''}
            ],
        }

    }
  },
  created() {
  },
  mounted(){
    this.getDetail()
  },
  watch: {


  },
  computed: {

  },
  methods: {
    getDetail(){
         this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline/GetNoticeFormPrint",
          params: {boguid:this.boguid},
          loading: true,
          tip: false
        }).then(results=>{
          results.data.forEach(i=>{
              i.wtkhname=getWtxmname(i.gid,1)
              i.gysname=getGysname(i.bggys,1)
          })  
          this.contentList=results.data
          this.costObject['应收费用']=results.data[0].listServiceCodeIn.map(i=>{
              return {
                items:i.s_name,
                value:i.value
              }
          })
          this.costObject['应付费用']=results.data[0].listServiceCodeOut.map(i=>{
              return {
                items:i.s_name,
                value:i.value
              }
          })
          //console.log(results.data)
        })
        .catch(error=>{

        })
    },

    print(){
        this.$print(this.$refs.printContent)
        // this.$axios({
        //   method: "put",
        //   url: this.$store.state.webApi + "api/ExHpoAxpline/PrintNoticeDate",
        //   data: {boguid:this.boguid,noticedate:this.currentData},
        //   loading: true,
        //   tip: false  
        // })
        // .then(results=>{
        //     if(results.data.resultstatus==0){
        //        this.$print(this.$refs.printContent)
        //     }else{
        //         this.$message.error(results.data.resultmessage)
        //     }
        // })
        
    }
  },

  
}
</script>

<style lang="less" scoped>
.arrivePrint .headOperate{
    display:flex;
    justify-content:space-between;
    padding-left:18px;
    margin-bottom:24px; 
}
.arrivePrint .headOperate .title{
    color:#3A3C42;
    font-size:16px;
    font-weight:600;
}
.detail-c .headImg{
    height:72px;
    display:block;
    margin:0 auto;
    margin-bottom:14px;
}
.detail-c .tableTitle{
    margin-bottom:16px;
}
.detail-c .tableTitle div{
    margin-right:28px;
    display:inline-block;
    color:#3A3C42;
    letter-spacing: 0.1em;
}
.detail-c .tableTitle div span:nth-child(2){
     font-weight:600;
}
table{
    border-collapse: collapse;
    text-align: center;
    width:100%;
    border:1px solid #e8e8e8;
    margin-bottom:14px;
    font-size:14px;
}
table tr td{
    height:36px;
    line-height:36px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    text-align:center;
    min-width:100px;
}
table.topTable tr:nth-child(2) td{
    font-weight:600;
}
// table tr td:last-child{
//     border-right:0;
// }
table.topTable tr:last-child td{
    height:26px;
    line-height:26px;
}
.costTable{
    margin-top:24px;
}
.costTable .costTableTitle{
    margin-bottom:12px;
    font-size:20px;
}

@media print{
    table tr:first-child td{
        color:#3A3C42!important;
        font-weight:bold
    }
}




</style>
