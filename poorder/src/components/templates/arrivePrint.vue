<template>
  <div class="arrivePrint">
     <p class="title">到货通知书打印</p>
     <div class="headOperate">
    
            <div>
                <span>打印模板&nbsp;</span>
                <span style="display:inline-block;">
                     <tempConfig name="arrivePrint.vue" system="空进" :type="140" :jsondata.sync="templateJson">

                     </tempConfig>
                    <!-- <el-select v-model="currentTem" placeholder="请选择内容">
                        <el-option label="空出" value="空出"></el-option>
                    </el-select> -->
                </span>
            </div>

            <div>
                <!-- <el-button type="primary">模板保存</el-button> -->
                <el-button type="primary" @click="printShow">打印</el-button>
                <el-button @click="initTemp">删除</el-button>
                <el-button @click='$emit("update:visible", false)'>返回</el-button>
            </div>
     
     </div>

     <div class="contentWrap">
         <div class="detail" >
            <div class="detail-title">
                <p>合同文件</p>
            </div>
            <div ref="printContent">
             <div class="detail-c" v-for="(item,index) in contentList" style="page-break-after:always;" :key="index">
                <img src="../../../boStatic/images/wecanHwTzs.gif"  class="headImg">
                <div class="tableTitle">
                    <div>
                        <span>代理:</span>
                        <span>{{item.wtkhname}}</span>
                    </div>

                    <div>
                        <span>结算方式:</span>
                        <span>{{item.jsfs=='2'?'月结':'现结'}}</span>
                    </div>

                    <div>
                        <span>是否精密仪器:</span>
                        <span>{{item.hasjmyq=='2'?'无':'有'}}&nbsp;{{item.hasbreak}}</span>
                    </div>
                </div>
                <table  cellpadding="0" cellspacing="0">
                   <tr>
                       <td>进境日期</td>
                       <td>{{item.hbrq}}</td>
                       <td>总运单</td>
                       <td>{{item.mawb}}</td>
                       <td>件数</td>
                       <td>{{item.ybpiece}}</td>
                       <td>库位</td>
                       <td>{{item.kwh}}</td>
                   </tr>
                   <tr>
                       <td>货物编号</td>
                       <td>{{item.pono}}</td>
                       <td>分运单号</td>
                       <td>{{item.hawb}}</td>
                       <td>重量(KG)</td>
                       <td>{{Number(item.ybweight).toFixed(2)}}</td>
                       <td>包装种类</td>
                       <td>{{item.bzlx}}</td>
                   </tr>
                   <tr>
                       <td>备注</td>
                       <td colspan="7">
                           {{item.sizeremark}}
                       </td>
                   </tr>
                </table>
                <div class="contentInput">
                    <div>
                        <p>
                            <span>计费重量(KG):</span>
                            <span>{{Number(item.jfweight).toFixed(2)}}</span>
                        </p>
                        <p>
                            以上货物完好无损,已被我单位提取,此据
                        </p>
                    </div>
                    <div>
                        <el-input placeholder="请输入" v-model="templateJson.name"></el-input>
                    </div>
                </div>
                <div class="thrInfo"> 
                    <p>提货单位电话:</p>
                    <p>提货人证件号:</p>
                    <p>提货人签名:</p>
                    <div class="right">
                        提货单位签章:
                    </div>
                    <div class="thrBottom">
                        <span>注&nbsp;&nbsp;</span>
                        <span>
                            <el-input placeholder="请输入" v-model="templateJson.remark"></el-input>
                        </span>
                        <span>年</span>
                        <span>月</span>
                        <span>日</span>
                    </div> 
                 </div>
                 <div class="freight">
                    <div>
                        <span>
                            运费到付
                        </span>
                        <span>
                            
                        </span>
                    </div>

                    <div>
                        <span>
                            运费预付
                        </span>
                        <span>
                            
                        </span>
                    </div>

                    <div>
                        <span>
                            银行背书
                        </span>
                        <span>
                            
                        </span>
                    </div>
                </div> 
                <div class="contentText">
                    <p>1.请收货人在到货通知书上加盖收货人正本公章前来我司提货换单；如委托他人办理提货换单</p>
                    <p>手续，请附上盖有收货人公章的委托书（或提供有效身份证件）</p>
                    <p>2.进境货物及包装如遇海关前置拦截的，需向海关办理相关手续。</p>
                    <p>3.进口货物应自进境之日起14天内向海关申报，逾期海关每天按货价的万分之五征收滞报金；</p>
                    <p>自货物进境之日起三个月未提取的货物，我司将根据《中华人民共和国海关法》第三十一条的规定</p>
                    <p>上交海关处理。在申报发送数据之前，请先确认海关舱单系统。</p>
                    <p>4.自货物进境之日起市内免费保管3天，逾期我司将收取仓储费。危险品、</p>
                    <p>贵重物品、冷冻冷藏等无免费保管期。自货物进境之日起11天加倍收费。</p>
                    <p>5.为了方便客户，本公司设有代客报关和送货上门等服务项目，如需办理报关等手续，</p>
                    <p>请提供清关所需的文件到本公司抽单处办理委托手续。</p>
                    <p>6.贵公司提货前，应办妥海关所有手续。本公司凭海关放行通知书和报关单且结清费用后予以放货。</p>
                    <p>如收货人为银行，附加盖银行公章或者提供正本银行担保书。提货时请携带现金或者微信、网</p>
                    <p>上银行转账<span>(本公司不接受支票和一个人名义转账)</span></p>
                    <p>本司开户银行:<span>中国光大银行上海彭浦支行 账号:3683 0188 0000 84218 税务登记号:913101097561456802</span></p>
                    <p>7.<span>本公司提货时间为上午09:00-11:30、下午13:00-17:00,如需在其他时间或者节假日提货的,请事先与我司工作人员预约确认，否则我司不承担任何相关责任!</span></p>
                </div>
                <div class="contentInput2">
                    <div class="inputType1">
                        <div>8.抽单、报关: </div>
                        <div><el-input placeholder="请输入内容" v-model="templateJson.choudan"></el-input></div>
                    </div>
                    <div class="inputType2">
                       <div>
                        <span class="title">业务查询电话(TEL):</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="templateJson.business"></el-input>
                        </span>
                       </div>
                       <div>
                        <span class="title">总机电话(TEL):</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="templateJson.allphone"></el-input>
                        </span>
                       </div>
                    </div>
                    <div class="inputType1" style="padding-left:15px;">
                        <div>结算、提货: </div>
                        <div><el-input placeholder="请输入内容" v-model="templateJson.settlement"></el-input></div>
                    </div>
                    <div class="inputType2">
                       <div>
                        <span class="title">仓库查询电话(TEL):</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="templateJson.warehouse"></el-input>
                        </span>
                       </div>
                    </div>
                    <div class="inputType2">
                       <div>
                        <span class="title">结算查询电话(TEL):</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="templateJson.settphone"></el-input>
                        </span>
                       </div>
                       <div>
                        <span class="title">单组电话(TEL):</span>
                        <span>
                            <el-input placeholder="请输入内容" v-model="templateJson.grouphone"></el-input>
                        </span>
                       </div>
                    </div>
                </div>
            </div>  
            </div>

         </div>     
     </div>

     <el-dialog :visible.sync="showNotice"  top="20%" width="400px" :close-on-click-modal="false" append-to-body>
          <p style="margin-bottom:12px;">通知时间:</p>
            <el-date-picker
                v-model="currentData"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
            <div style="text-align:right;margin-top:32px">
                <el-button type="primary" @click="print">确认并打印</el-button>
                <el-button @click="showNotice=false">取消</el-button>
            </div>
     </el-dialog>
     
  </div>
</template>

<script>
import { getWtxmname,getMomentDate } from "../../api/localStorage.js"
import tempConfig from '@/components/templates/tempConfig'
export default {
  props: {
    boguid:{
        type:String
    },
    visible:Boolean
  },
  components: {
    tempConfig,
  },
  data() {
    return {
        contentList:[],//数据
        templateJson:{name:'',remark:'',choudan:'',bussiness:'',allphone:'',settlement:'',warehouse:'',settphone:'',grouphone:''},
        showNotice:false,//通知时间弹框
        currentData:'',
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
          })  
          this.contentList=results.data
          //console.log(results.data)
        })
        .catch(error=>{

        })
    },
    initTemp(){
        this.templateJson={name:'',remark:'',choudan:'',bussiness:'',allphone:'',settlement:'',warehouse:'',settphone:'',grouphone:''}
    },
    printShow(){
        this.showNotice=true
        this.currentData=getMomentDate()
    },
    print(){
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExHpoAxpline/PrintNoticeDate",
          data: {boguid:this.boguid,noticedate:this.currentData},
          loading: true,
          tip: false  
        })
        .then(results=>{
            if(results.data.resultstatus==0){
               this.$print(this.$refs.printContent)
            }else{
                this.$message.error(results.data.resultmessage)
            }
        })
        
    }
  },

  
}
</script>

<style lang="less" scoped>

.arrivePrint{
    .title{
        color:#3A3C42;
        font-size:16px;
        margin-bottom:24px;
        font-weight:600;
    }
    .headOperate{
        display:flex;
        justify-content:space-between;
        padding-left:18px;
        margin-bottom:18px;
    }
    .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
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
    }

    .detail-c {
        padding:31px 20px;
        .headImg{
            height:83px;
            display:block;
            margin:0 auto;
            margin-bottom:50px;
        }
        .tableTitle{
            margin-bottom:16px;
            div{
                margin-right:28px;
                display:inline-block;
                span{
                    color:#3A3C42;
                    letter-spacing: 0.1em;
                    &:nth-child(2){
                        font-weight:600;
                    }
                }
            }
        }
        table{
            border-collapse: collapse;
            text-align: center;
            width:100%;
            border:1px solid #e8e8e8;
            margin-bottom:16px;
            tr{
                &:last-child td{
                    height:40px;
                    line-height: 40px;
                }
                td{
                height:76px;
                line-height:76px;
                border-right: 1px solid #e8e8e8;
                border-bottom: 1px solid #e8e8e8;
                &:nth-child(odd){
                  text-align:center;
                }
                &:nth-child(even){
                    text-align:center;
                    font-weight:600;
                }
                &:last-child{
                    border-right: 0;
                }
            }
            }
        }
        .contentInput{
            display:flex;
            justify-content: space-between;
            margin-bottom:40px;
            div{
                &:nth-child(2){
                    width:60%;
                    /deep/.el-input{
                        input{
                            height:56px;
                            border:1px solid #E8E8E8;
                            font-size:28px!important;
                            font-weight:bold;
                            color:#000;
                        }
                    }
                }
                p{
                    &:first-child{
                        margin-bottom:16px;
                        span{
                            &:nth-child(2){
                                font-weight:600;
                            }
                        }
                    }
                    letter-spacing: 0.1em;
                }
            }
        }
        .thrInfo{
            margin-bottom:40px;
            p{
                margin-bottom:14px;
                &:last-child{
                    margin-bottom:26px;
                }
            }
            .right{
                float:right;
                width:40%;
                height:20px;
                line-height:20px;
                margin-bottom:16px;
            }
            .thrBottom{
                clear:both;
               span{
                   display:inline-block;
                   /deep/.el-input{
                       input{
                           height:40px;
                           width:100%;
                           border:1px solid #e8e8e8
                       }
                   }
                   &:nth-child(2){
                       margin-right:70px;
                       width:72%;
                   }
                   &:nth-child(3){
                       margin-right:56px;
                   }
                    &:nth-child(4){
                       margin-right:56px;
                   }
               }
            }
        }
        .freight{
            display:flex;
            justify-content: space-around;
            margin-bottom:52px;
            span{
                display:inline-block;
                vertical-align: middle;
                &:nth-child(1){
                   color:#3A3C42;
                   font-size:20px;
                   font-weight:600;
                   margin-right:32px;
                }
                &:nth-child(2){
                    height:46px;
                    width:146px;
                    background:#E8E8E8;
                    border-radius:4px;
                }
               
            }
        }
        .contentText{
            p{
              line-height:2.5em;
              
              font-size:20px;
              color:#3A3C42;
              span{
                  font-weight:800
              }
            }
        }
        .contentInput2{
            width:800px;
            font-size:20px;
            margin-top:20px;
            .inputType1{
                display:flex;
                justify-content: space-between;
                margin-bottom:16px;
                div{
                    &:first-child{
                        font-size:20px;
                        align-self: center;
                        margin-right:16px;
                    }
                    &:nth-child(2){
                        flex-grow:2
                    }
                }
            }
            .inputType2{
                display:flex;
                justify-content: space-between;
                span{
                    display:inline-block;
                }
                .title{
                    font-size:14px;
                    color:#3A3C42;
                    font-weight:400;
                    margin-right:12px;
                }
                /deep/.el-input{
                        width:max-content;
                        input{
                            width:230px;
                            font-weight:bold;
                            color:#000
                        }
                    }
            }
        }
    }
}
}
@media print{
    
   .detail-c{
       padding:0 18px;
   }
   .detail-c .headImg{
       height:72px;
       display:block;
       margin:0 auto;
       margin-bottom:14px;
   }
   .detail-c .tableTitle{
       margin-bottom:8px;
   }
   .detail-c .tableTitle div{
       margin-right:12px;
       display:inline-block;
   }
   .detail-c .tableTitle div span{
       color:#3A3C42;
       letter-spacing: 0.1em;
   }
   .detail-c .tableTitle div span:nth-child(2){
       font-weight:600
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
   }
   table tr td:nth-child(even){
       font-weight:600;
   }
   table tr td:last-child{
       border-right:0;
   }
   table tr:last-child td{
       height:26px;
       line-height:26px;
   }

   .contentInput{
    display:flex;
    justify-content: space-between;
    margin-bottom:14px;
    }
    .contentInput div{letter-spacing: 0.1em;} 
    .contentInput div:nth-child(2){
        width:50%;
    }
    .contentInput div:nth-child(2) /deep/.el-input input{
        height:46px;
        border:none;
        //border:1px solid #E8E8E8;
        font-size:22px!important;
        font-weight:bold;
        color:#000
    }
    .contentInput div p:first-child{
        margin-bottom:6px; 
    }
    .contentInput div p:first-child span:nth-child(2){
        font-weight:600;
    }
    .thrInfo{
        margin-bottom:14px;
    }
    .thrInfo p{
        margin-bottom:4px;
    }
    .thrInfo p:last-child{
        margin-bottom:10px;
    }
    .thrInfo .right{
        float:right;
        width:40%;
        height:12px;
        line-height:12px;
        margin-bottom:10px;
    }
    .thrInfo .thrBottom{
        clear:both;
    }
     .thrInfo .thrBottom span{
         display:inline-block
     }
     .thrInfo .thrBottom span /deep/.el-input input{
         height:32px;
         width:100%;
         border:none;
     }
     .thrInfo .thrBottom span:nth-child(2){
        margin-right:38px;
        width:68%;
      }
     .thrInfo .thrBottom span:nth-child(3){
            margin-right:38px;
       }
      .thrInfo .thrBottom span:nth-child(4){
            margin-right:38px;
      }
      .freight{
          display:flex;
          justify-content: space-around;
          margin-bottom:14px;
      }
      .freight span{
         display:inline-block;
         vertical-align: middle;
      }
      .freight span:nth-child(1){
         color:#3A3C42;
         font-size:16px;
         font-weight:600;
         margin-right:12px; 
      }
      .freight span:nth-child(2){
         height:30px;
         width:100px;
         border:1px solid #e8e8e8;
         background:#E8E8E8;
         border-radius:4px;
      }
      .contentText p{
         line-height:1.5em;
         font-size:14px;
         color:#3A3C42;
      }
      .contentText p span{
         font-weight:800 
      }
      .contentInput2{
          width:100%;
          margin-top:10px;
          font-size:18px;
      }
      .contentInput2 .inputType1{
            display:flex;
            justify-content: space-between;
            margin-bottom:8px;
      }
      .contentInput2 .inputType1 div:first-child{
          align-self: center;
          margin-right:8px;
      }
      .contentInput2 .inputType1 div:nth-child(2){
          flex-grow:2
      }
      .contentInput2 .inputType1 div:nth-child(2) /deep/.el-input input{
          border:none;
      }
      .contentInput2 .inputType2{
           display:flex;
           justify-content: space-between;
           margin-bottom:8px;
           margin-left:-10px;
      }
      .contentInput2 .inputType2 span{
          display:inline-block
      }
      .contentInput2 .inputType2 .title{
          font-size:14px;
          color:#3A3C42;
          font-weight:400;
          //margin-right:6px;
      }
       .contentInput2 .inputType2 /deep/.el-input{
           width:max-content;
       }
       .contentInput2 .inputType2 /deep/.el-input input{
           width:180px;
           font-weight:bold;
           border:none;
       }




}

</style>
