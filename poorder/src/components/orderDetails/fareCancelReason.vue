<template>
  <div>
<!-- {{reasonData.delbillreason}} -->

<div v-if='reasonData.delbillreason.length>0'>
          <div class="accountNameItemsContent" style="margin-top: 12px;">
            <div style="display:flex">
            <div class="delbillman-wrap">
              <ul class="delbillmanList">
                <li
                  @click="delbillmanActive = index;costItemsActive=0"
                  :class="{'active': delbillmanActive == index}"
                  v-for="(item,index) in reasonData.delbillreason"
                  :key="index">
                  <p>
       <!--             <span v-if="item.accountname&&item.accountname!='费用申请驳回'">应收对账驳回</span>
                   <span v-if="item.accountname&&item.accountname=='费用申请驳回'">费用申请驳回</span>
                   <span v-if="!item.accountname">海外D/N驳回</span> -->
                   <span>{{item.reasontype}}</span>
                  </p>
                  <p class="time">
                    <!-- <span class="left">{{item.delbilldate.split(' ')[0].replace(/(-)/g, '.')}}</span> -->
                    <span class="left">{{item.delbilldate&&item.delbilldate.substr(0,10).replace(/(-)/g, '.')}}</span>
                    <!-- <span class="left">{{item.delbilldate |  formatDate('yyyy-MM-dd')}}</span> -->
                    <span class="right">{{item.delbillman}}</span>
                  </p>
                  <!--   -->
                  <i class="el-icon-caret-right"></i>
                </li>
              </ul>
            </div>

       <!--      <div class="arrow">
              <i class="el-icon-caret-left" @click="changeDirectionDelBillMan(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirectionDelBillMan(2)"></i>
            </div> -->

            </div>
          </div>

<template v-for="(item,index) in reasonData.delbillreason">
   <div v-if="index==delbillmanActive&&item.accountname" :key="index">
             <!-- <P style="margin-top:15px" v-if="item.accountname!='费用申请驳回'">{{reasonData.delbillreason[0].accountname}}</P> -->
             <P style="margin-top:15px" v-if="item.reasontype=='应收对账驳回'">{{reasonData.delbillreason[0].accountname}}</P>
            <el-input type="textarea" v-model="item.delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" :disabled="true"></el-input>


          <div class="accountNameItems" v-if="item.delbillreasonJson">
            <div  style="width:800px;overflow:hidden;display:inline-block" >
              <ul class="costItemsList" style="overflow:scroll;overflow-x:auto;overflow-y:hidden;white-space: nowrap">
                <li v-for="(item,index) in item.delbillreasonJson" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
                  <el-badge is-dot class="item" v-if="item.delbillreason">{{item.items}}</el-badge>
                  <span v-else>{{item.items}}</span>
                </li>
              </ul>
            </div>

        <!--     <div class="arrow">
              <i class="el-icon-caret-left" @click="changeDirection(1)"></i>
              <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
            </div> -->
          </div>

          <div class="costItemsContent" style="margin-top:16px;" v-if="item.delbillreasonJson">
            <ul>
              <li>人民币金额</li>
              <li>单价</li>
              <li>数量</li>
              <li>货币</li>
            </ul>
            <ul style="margin-top:3px;">
              <li>{{Number(item.delbillreasonJson[costItemsActive].realwageall).toFixed(2)}}</li>
              <li>{{Number(item.delbillreasonJson[costItemsActive].price).toFixed(2)}}</li>
              <li>{{Number(item.delbillreasonJson[costItemsActive].num).toFixed(2 )}}</li>
              <li>{{item.delbillreasonJson[costItemsActive].currency}}</li>
            </ul>
            <el-input type="textarea" v-model="item.delbillreasonJson[costItemsActive].delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:16px;color:#c8c8c8" :disabled="true"></el-input>
          </div>
</div>
   <div v-if="index==delbillmanActive&&!item.accountname" :key="index">
            <el-input type="textarea" v-model="item.delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:16px;color:#c8c8c8" :disabled="true"></el-input>
   </div>
<!-- {{item}} -->
<!-- {{fareData}} -->
<!-- {{ifshowbtn(fareData.rejectstatus,item.reasontype)}} -->
<!--    <div   style="margin-top:15px;display:flex;justify-content:flex-end" :key="index" v-if="(ifshowbtn(fareData.rejectstatus,item.reasontype)==2)&&index==reasonData.delbillreason.length-1">
      <el-button type="primary" @click="ifagreeFunc(3,item.reasontype)">同意</el-button>
      <el-button type="primary" @click="ifagreeFunc(0,item.reasontype)">不同意</el-button>
   </div> -->

</template>

</div>

  </div>
</template>

<script>
import {formatDate} from '../../api/localStorage.js'

  export default {
    name: 'costConfirmationBack',
      props:{
     fareData:{
       type:Object,
       default:() => {}
     },
     visible:Boolean
  },
    components: {

    },
    data() {
      return {
                reasonData:{},//取消对账原因数据
                delbillmanActive:0,//取消对账人激活
                costItemsActive:0,//费用激活
                arrowIndex:0,//费用箭头
                arrowDelBillManIndex:0,//取消对账人箭头
                arrowAcnIndex:0,//结算对象箭头
                costControlDialog:false,//批量分摊弹窗
                shareRecordDialog:false,
                hawbCost:false,//分单费用弹窗
                confirmStatusout:'',
                confirmStatusin:'',
      }
    },
    watch: {
      fareData:{
        handler(val){
          if(val)
          this.showReasonF(JSON.parse(JSON.stringify(val)))
        },deep:true,immediate:true
      }
    },
    methods:{

          uncostMaking(){
            this.costMaking=false;
            ////console.log(this.$refs.costDialog)
            // 重新计算应收应付金额
            this.tableDataRes[this.selectedTableIndex].wageall_in=this.$refs.costDialog.zdtotalCharge
            this.tableDataRes[this.selectedTableIndex].wageall_out=this.$refs.costDialog.zdtotalPayment
            this.tableDataRes[this.selectedTableIndex].wageprofit=Number(Number(this.$refs.costDialog.zdtotalCharge)-Number(this.$refs.costDialog.zdtotalPayment)).toFixed(2)
            if(this.$refs.costDialog.ysConfirm==false){
              this.tableDataRes[this.selectedTableIndex].confirmstatus_in=1
            }else{
              this.tableDataRes[this.selectedTableIndex].confirmstatus_in=700
            }

            if(this.$refs.costDialog.yfConfirm==false){
              this.tableDataRes[this.selectedTableIndex].confirmstatus_out=1
            }else{
              this.tableDataRes[this.selectedTableIndex].confirmstatus_out=700
            }

            //this.search()
          },
          showReasonF(val){
            //console.log(val)
            this.showReason=true;
            this.reasonData=val
            this.reasonData.delbillreason=this.reasonData.delbillreason&&JSON.parse(this.reasonData.delbillreason)||[]
            if(this.reasonData.overseasaccreason){
             this.reasonData.delbillreason=this.reasonData.delbillreason.concat(JSON.parse(this.reasonData.overseasaccreason))
            }
             if(this.reasonData.wagecommitreason){
             this.reasonData.delbillreason=this.reasonData.delbillreason.concat(JSON.parse(this.reasonData.wagecommitreason))
            }
            this.reasonData.delbillreason.sort((a, b) => a.delbilldate >= b.delbilldate)


            this.delbillmanActive = this.reasonData.delbillreason.length-1
            this.costItemsActive = 0

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

        if(clientWidth<800){
           this.arrowIndex=0
         return false
        }else{
          this.arrowIndex++
        }

        if(this.arrowIndex>Math.ceil((clientWidth-800)/200)){
          layer.msg('已至尾部');
          this.arrowIndex=Math.ceil((clientWidth-800)/200)
          return false
        }
      }

       $('.costItemsList').css('transform','translateX(-'+this.arrowIndex*200+'px)')


    },
    changeDirectionAcn(type){
       var clientWidth=0
      if(type==1){
        this.arrowAcnIndex--;
        if(this.arrowAcnIndex<0){
          layer.msg('已至头部');
          this.arrowAcnIndex=0
          return false;
        }
      }else if(type==2){

        $('.accountNameItemsList').find('li').each(function(){

          clientWidth=clientWidth+$(this).innerWidth()
        })

        if(clientWidth<800){
           this.arrowAcnIndex=0
         return false
        }else{
          this.arrowAcnIndex++
        }

        if(this.arrowAcnIndex>Math.ceil((clientWidth-800)/360)){
          layer.msg('已至尾部');
          this.arrowAcnIndex=Math.ceil((clientWidth-800)/360)
          return false
        }
      }

       $('.accountNameItemsList').css('transform','translateX(-'+this.arrowAcnIndex*360+'px)')
      },
      changeDirectionDelBillMan(type){
        var clientWidth = 0
        if(type==1){
          this.arrowDelBillManIndex--;
          if(this.arrowDelBillManIndex<0){
            layer.msg('已至头部');
            this.arrowDelBillManIndex=0
            return false;
          }
        } else if(type==2){
          $('.delbillmanList').find('li').each(function(){
            clientWidth=clientWidth+165
          })
          if(clientWidth<800){
            this.arrowDelBillManIndex=0
            return false
          }else{
            this.arrowDelBillManIndex++
          }
          if(this.arrowDelBillManIndex>Math.ceil((clientWidth-800)/165)){
            layer.msg('已至尾部');
            this.arrowDelBillManIndex=Math.ceil((clientWidth-800)/165)
            return false
          }
        }

        $('.delbillmanList').css('transform','translateX(-'+this.arrowDelBillManIndex*165+'px)')
      },
      ifagreeFunc(type,reasontype){
        //type 4同意 0不同意
        var json={boguid:this.fareData.boguid,czman:localStorage.usrname,rejectstatus:type,reasontype:reasontype}
        if(type==0){
                  this.$prompt('请输入原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'textarea',
          inputPattern: /\S/,
          inputErrorMessage: '请输入原因！'
        }).then(({ value }) => {
          if(value){
            var obj=JSON.parse(JSON.stringify(this.reasonData.delbillreason))
            var rollbackreason=this.reasonData.delbillreason[this.delbillmanActive].rollbackreason
            if(rollbackreason&&rollbackreason.length>0){
              obj[this.delbillmanActive].rollbackreason.push({reasontype:'不同意',delbillreason:value,delbillman:localStorage.usrname,delbilldate:formatDate(new Date(),'yyyy-MM-dd hh:mm')})
            }else{
              obj[this.delbillmanActive].rollbackreason=[{reasontype:'不同意',delbillreason:value,delbillman:localStorage.usrname,delbilldate:formatDate(new Date(),'yyyy-MM-dd hh:mm')}]
            }

          json.rollbackreason=JSON.stringify(obj)
          console.log(obj)
          this.ajaxfunc(json);
          }


        })

        //  json.rollbackreason=JSON.stringify([{reasontype:'',delbillreason:'',delbillman:localStorage.usrname,delbilldate:formatDate(new Date(),'yyyy-MM-dd hh:mm'),canceltype:json.canceltype,status:json.status,iswage:json.iswage,ifshowRes:this.inputModelData.mawb&&this.hasMaincamp}])
        }else{
          this.ajaxfunc(json)
        }

      },
      ajaxfunc(json){
                  this.$axios({method:'put',url:this.$store.state.webApi+'api/UpdateExamineApprove',data:json,loading:true,tip:false,noarea:true}).then(results=>{
            if(results.data.resultstatus==0){
              this.$message('操作成功！')
              this.$emit('update:visible', false)

            }else{
              this.$message.error(results.data.resultmessage);
            }
           })
          // rejectstatus
  ///  驳回状态 0.不同意  1.正常  2.驳回 3同意
        /// 多个值
        /// 第一个 应收对账
        /// 第二个 应付对账
        /// 第三个 经理审核
        /// 例: 102  应收对账正常.应付对账不同意.经理审核驳回
      },
      ifshowbtn(status,reasontype){
          if(reasontype=='应收对账驳回'){
            return status[0]
          }
          if(reasontype=='应付对账驳回'){
            return status[1]
          }
          if(reasontype=='经理驳回'){
            return status[2]
          }
      }
    },
  }
</script>

