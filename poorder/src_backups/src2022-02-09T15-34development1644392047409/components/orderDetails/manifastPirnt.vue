
<template>
   <div>
   <el-button type="primary" @click="printFunc" style="margin-bottom:12px;" :disabled="mawbinfo.verificationinfo!='无异常'">打印</el-button>
   <span v-show="mawbinfo.verificationinfo!='无异常'" style="margin-left:20px;color:red">{{mawbinfo.verificationinfo}}</span>
    <div style="width:1030px" id='printDiv'>
      <section ref="print">
          <div class="manifase">
           <h2>HOUSE AIRWAYBILL LIST</h2>
          <div class="item">
            <div>AGENT/FORWARDER:</div>
            <div>FRIGHT NO:{{mawbinfo.hbh}}</div>
            <div>DESTIANTION:{{mawbinfo.mdg_mawb}}</div>
            <div>DATE:{{mawbinfo.hbrq | airdate('-')}}</div>
          </div>
          <div class="item">
            <div>
            <span  style="min-width:104px">MAWB NO:</span>
            <span>签单</span>
            <span>PCS</span>
           </div>
           <div>
            <span style="min-width:86px">G.W(KG)</span>
            <span>HAWB</span>
            <span>SLAC</span>
          </div>
          <div>
            NOTE:
          </div>
      </div>
            <div class="item">
              <div >
                  <span style="min-width:104px">{{mawbinfo.mawb}}</span>
                  <span>检查</span>
                  <span>{{mawbinfo.zdpiece_mawb}}</span>
              </div>
              <div>
                  <span style="min-width:86px">{{mawbinfo.jfweight_mawb}}</span>
                  <span>{{mawbinfo.hawbnum}}</span>
                  <span>{{mawbinfo.smallpiece_mawb}}</span>
              </div>
            <div></div>
          </div>

         <div class="item" style="height:64px;">
            <div>
            <span  style="min-width:104px">HAWB NO:</span>
            <span>有/无</span>
            <span>PCS</span>
           </div>
           <div>
            <span style="min-width:86px">G.W(KG)</span>
            <span>ORG</span>
            <span>DES</span>
          </div>
          <div>
           <span style="min-width:170px">SHIPPER NAME AND<br>DETAILED ADDRESS</span>
           <span style="min-width:156px">CONSIGNEE NAME<br>AND DETAILED<br>ADDRESS</span>
           <span style="min-width:100px">NATURE<br>OF GOODS</span>
           <span>DECLARED<br>VALUR</span>
          </div>
      </div>

         <div v-for="item in mawbinfo.hawbGroupList" class="item hawbitem" style="height:auto;" :key="item.hawb">
            <div>
            <span  style="min-width:104px;justify-content:center">{{item.hawb}}</span>
            <span></span>
            <span style="justify-content:center">{{item.zdpiece_hawb||''}}<br>{{item.smallpiece_hawb?('(SLAC:'+item.smallpiece_hawb+')'):""}}</span>
           </div>
           <div>
            <span style="min-width:86px;justify-content:center">{{item.jfweight_hawb||''}}</span>
            <span style="justify-content:center">{{item.sfg}}</span>
            <span style="justify-content:center">{{item.mdg}}</span>
          </div>
          <div>
           <span style="min-width:170px">{{item.companytitle_fhr_hawb}}<br>{{item.address_fhr_hawb}}</span>
           <span style="min-width:156px;">
               {{item.companytitle_shr_hawb}}<br>{{item.address_shr_hawb}}
               </span>
           <span style="min-width:100px;">{{item.pm}}</span>
           <span>{{item.declarecustom}}</span>
          </div>
      </div>
       </div>
      </section>
   </div>



</div>
</template>
<script>







    export default {
      name: 'manifastPrint',
      props:{
          mawb:String
      },
       components: {

        },
        data () {
            return {
                 mawbinfo:{}
        }
      },

        methods: {


         printFunc(){

          this.$axios({method:'get',url:this.$store.state.webApi+"api/CreateDoc",params:{sid:this.mawbinfo.guid,type:3},loading:false,tip:false}).then(results=>{
               if(results.data.resultstatus==0){
               //  layer.msg('操作成功！')
               }
           })


                setTimeout(() => {
                     // $('#printDiv').show()
                           $(".hawbitem").each(function () {
                         $(this).css({height:Number($(this).height()),'min-height':'120px'})
                        })

                             this.$print(this.$refs.print) // 使用
                          // $('#printDiv').hide()


                  }, 10);


         }

        },
        watch: {

        },

        created(){
      if(!this.mawb) return;
        this.$axios({
        method: "get",
        url: this.$store.state.webApi + 'api/ExHpoAxplineManifast',
        params: {mawb:this.mawb},
        loading: true,
        tip: false
      }).then(results => {
          console.log(results)
          if(results.data){
            if(results.data.length) {
              this.mawbinfo=results.data[0]
            } else {
              this.mawbinfo = {};
            }
          }else{
            this.$message.error('请求结果为空值');
          }
      })

        },
        computed:{


        }

    }
</script>


<style scoped lang="less">
.el-dialog__wrapper{
  /deep/ .el-dialog__body{
  padding:5px 25px 30px;
  /deep/ .el-form-item__content>div{
 //   width:186px
  }
}
}

.manifase{
  width:100%;
  border: 2px solid #000000;
  font-family: 'Times New Roman';
  h2{
     text-align:center;
     height:100px;
     line-height: 100px;
    border-bottom: 1px solid #000000;
  }
  div.item{
    display:flex;
    justify-content: space-between;
    border-bottom: 1px solid #000000;
     height: 24px;

    div{
    display:flex;
    align-items: center;
    font-size: 16px;
    font-weight: 900;
    border-right: 1px solid #000000;
    span{
      flex: 1;
      display: flex;
      align-items: center;
      border-right: 1px solid #000000;
      height: 100%;

    }

    span:last-child{
        border:none;
        flex-grow:1;
    }

    }

   div:first-child{
    width:218px;
  }
   div:nth-child(2){
    width:196px;
  }
   div:nth-child(3){
    width:404px;
  }
     div:last-child{
      flex-grow:1;
      border-right:none;
      };

  }
.hawbitem{
  span{
    align-items:flex-start!important;
    color:#000000;
    font-weight: normal;
    font-size: 12px;
    flex-wrap: wrap;
    word-break: break-word;
  }
}
  div.item:last-child{
    border:none
  }
}

</style>
