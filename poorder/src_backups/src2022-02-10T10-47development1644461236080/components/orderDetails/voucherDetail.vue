<template>
<div>
  <!-- {{boguid}} -->
      <div style="display:flex;margin-top:20px;">
        <div class="left" style="width:38%">
          <h2 style="color:#065086;">入库凭证</h2>
  <newFormCmpt
  style="margin:15px 0px"
              class="mynewForm"
                    :view-data.sync="inputViewData"
                    :model-data.sync="inputModelData"
                    ref="pingzform"
                    :pagetype="2"
                  >
     </newFormCmpt>
     <el-button type="primary" @click="sendFunc">发送</el-button>
     <el-button @click="close">取消</el-button>
        </div>
        <div class="right" style="width:62%;">

          <el-tabs type="border-card" v-if="inputModelData.storeList&&inputModelData.storeList.length>0"  @tab-click="changeTab" class="pdfCard">

            <template v-for="(item,index) in inputModelData.storeList">
               <el-tab-pane :label="item.khjcno" :key="item.khjcno">
               </el-tab-pane>
                            <div style="position: absolute;"  :style="{visibility:index==tabIndex?'visible':'hidden'}" >
                                <embed :src="`${$store.state.webApi}api/VoucherResponse?boguid=${boguid}&storeguid=${item.guid}`" width="850px"  height="1200px">
                            </div>
           </template>
</el-tabs>

        </div>

      </div>
</div>
</template>

<script>
export default {
  props:{
     boguid:[String,Number],
     visible:Boolean
  },
  data () {
    return {
           inputViewData:{
                area: {
                title: "预计入库仓库区域",
                type: 24,
                required:true,
              },
              yjstorename: {
                title: "预计入库仓库名称",
                type: 25,
                linkage: "area",
                required:true,
              },
            // yjstoredate: {
            //   title: "预计入库日期：",
            //   type: 6,
            //   format: "yyyy-MM-dd",
            //   required:true,
            // },
             vouchmail:{
              title:'收件人邮箱号',
              type:1,
              required:true
            },
            vouchtitle:{
              title:'邮件标题',
              type:1,
              required:true
            },
            vouchcontent:{
              title:'邮件内容',
              type:17,
              required:true,
              rows:12
            },
           },
           inputModelData:{
               //  vouchcontent:"尊敬的客户您好,\n    唯凯客服已受理了您的订单,附件是一张入库凭证,请及时转发给您的托车行,届时卡车司机凭借此证入库,唯凯的收货人员会扫描该凭证上的二维码确认收货,谢谢。\n\n订单信息如下:\n\n唯凯订舱编号:BOAE1901310002PVG\n客户进仓编号:\n预报件数:84 PCS,预报重量:1003.00 KG,预报体积:6.180 V³,目的港:LAX"
           },
           tabIndex:0
    }
  },
  methods: {
      search(){

              this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxplineWarehouseVoucher',params:{boguid:this.boguid},loading:true,tip:false}).then(results=>{
                      // console.log(results)
                      this.inputModelData=results.data
                   })
      },
      setEmbedurl(){
        this.embedurl=`${this.$store.state.webApi}api/VoucherResponse?boguid=${this.boguid}`
      },
      sendFunc(){

          let r=this.$refs.pingzform.requiredField
          if(r){
            return this.$message.error('请填写'+r);
          }
          this.$axios({method:'post',url:this.$store.state.webApi+'api/ExHpoAxplineWarehouseVoucher',data:this.inputModelData,loading:true,tip:false}).then(results=>{
                       console.log(results)
                       if(results.data.resultstatus==0){
                          this.$message.success(results.data.resultmessage||'成功')
                       }else{
                          this.$message.error(results.data.resultmessage)
                       }
                   })
      },
      close(){
         if (this.visible) this.$emit("update:visible", false);
      },
      changeTab(tab, event){
       // console.log(typeof tab.index)
        this.tabIndex=tab.index
      }
  },
  computed:{

  },
  created(){
    this.search()
   // this.setEmbedurl()
  }


}
</script>

<style lang="less" scoped>
.mynewForm{
  padding-right: 20px;
  /deep/ .page-container-main{
    flex-direction: column;
     .input-item{
      flex-direction: column;
      align-items: left;
      width:100%;
       div{
        text-align:left;
        width:100%;
      }
    }
  }
}
.pdfCard{
  /deep/ .el-tabs__content{
    height:740px;
    overflow: scroll;
  }
}
</style>
