<template>
  <div style="position:relative;margin-bottom:25px;">

  <!-- <div style="position:absolute;right:6px;top:4px;z-index:1000">
            <el-button @click="ifEdit=!ifEdit" v-if="!ifEdit">编辑</el-button>
            <el-button @click="saveInfoFunc" v-if="ifEdit">保存</el-button>
    </div> -->
<el-tabs type="border-card">

  <el-tab-pane label="节点状态信息" style="padding:0px">
               <div  class="divItem">
        <div v-for="nodedom in nodetypeArr" class="nodedom" :key="nodedom">


 <div class="domtitle" slot="reference">
              {{nodedom}}
                </div>


          <div class="item" v-for="(item,index) in nodeNameArr" :key="item.guid+index" v-if="item.nodedom==nodedom">
          <i class="el-icon-success" :style="{color:item.nodedate?'#5DAF34':'#ccc'}"></i>
          <div>
            <p>

                      <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="'操作人：'+item.nodeman">
                         <div slot="reference">
                         {{ item.nodename }}
                        </div>
                </el-popover>

          <input placeholder="操作人" v-if="ifEdit" clearable v-model="item.nodeman" style="width:60px;text-indent:5px;"></p>
            <p style="font-size:12px;height:28px;" v-if="!ifEdit">{{item.nodedate||'----:--:--'}}</p>
            <p style="font-size:12px;" v-if="ifEdit">
                <el-date-picker
                  v-model="item.nodedate"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:130px;"
               >
                </el-date-picker>
                </p>
          </div>
        </div>
      </div>

     </div>
  </el-tab-pane>


</el-tabs>


  </div>
</template>
<script>

export default {
  props:{
   mawbinfo:Object,
  jiediandata:{
      type:Array,
      default:()=>[]
    },
    orderdom:{
      type:String,
      default:"总单"
    }

  },
    components: {
  },

   data(){
     return {
          nodeNameArr:[],
          nodetypeArr:[],
          ifEdit:false

     }
   }
   ,methods:{

     getJiedianInfoFunc(){
             this.$axios({method:'get',url:this.$store.state.webApi+"api/ExAiraxpNode",params:{guid:this.mawbinfo.guid,boguid:this.mawbinfo.boguid,area:this.mawbinfo.area,system:this.mawbinfo.system},loading:false,tip:false}).then(results=>{
              console.log("节点信息")
              console.log(JSON.stringify(results.data))
              this.nodeNameArr=results.data
              this.$emit('update:jiediandata',results.data)
              this.nodeNameArr.forEach(i=>{
                    if(i.nodedate.indexOf('1900')>=0){
                           i.nodedate=''
                    }
                   if(!this.nodetypeArr.includes(i.nodedom)){
                          this.nodetypeArr.push(i.nodedom)
                   }
              })
              this.nodeNameArrBackups=JSON.stringify(this.nodeNameArr)
            })
     },
       saveInfoFunc(){
                var json=[]
                for(let index=0;index<this.nodeNameArr.length;index++){
                      var i=this.nodeNameArr[index]
                      var n=0;
                      var nodeman=i.nodeman
                      var nodedate=i.nodedate
                     if(!nodeman&&nodedate){
                          this.$message.error(`请填写"${i.nodename}"操作人`);return
                        }
                          if(!nodedate&&nodeman){
                          this.$message.error(`请填写"${i.nodename}"操作时间`);return;
                        }
                   if(i.nodeman&&i.nodedate){
                      JSON.parse(this.nodeNameArrBackups).forEach(e=>{
                           if((i.guid==e.guid)&&(JSON.stringify(i)!=(JSON.stringify(e)))){
                               n++
                           }
                      })
                   }
                   if(n){
                     json.push({nodeman:i.nodeman,nodedate:i.nodedate,nodecode:i.nodecode,guid:i.guid})
                   }
                }

                //console.log(JSON.stringify(json))

                if(json.length==0){
                   this.ifEdit=!this.ifEdit;
                   return;
                }
                var newjson={wagetyp:this.orderdom=='总单'?2:1,nodelist:json}
                newjson.boguid=this.mawbinfo.boguid
           this.$axios({method:'put',url:this.$store.state.webApi+"api/ExAiraxpNode",data:newjson,loading:true,tip:false}).then(results=>{
                if(results.data.resultstatus==0){
                 this.ifEdit=!this.ifEdit
                 this.getJiedianInfoFunc()
                }else{
                  this.$message.error("失败！"+results.data.resultmessage)
                }

          })

       }

    }
    ,computed:{


    },
    created () {

      this.getJiedianInfoFunc()

    },
    watch: {


    }

}
</script>
<style scoped lang="less">

.divItem{
    border:1px solid #e8e8e8;
    margin-bottom: 15px;
     .nodedom:last-child{
       border-bottom: none
     }
     /deep/ .el-date-editor--datetime .el-input__inner{
          padding:0px;
          font-size: 12px;
          text-indent: 4px;
     }
     /deep/ .el-input__prefix,.el-input__suffix{
       display: none
     }
}
  .nodedom{
    display:flex;
    overflow: scroll;
    overflow-x: auto;
    border-bottom: 1px solid #e8e8e8;
    //min-width: 1200px;
    .domtitle{
      display: flex;
      align-items: center;
      margin:0 20px;
      font-size: 16px;
      min-width:40px;
    }
         .item{
           i{
             margin-right:14px;
             display: inline-block;
             font-size: 20px;
           }
           display: flex;
           align-items:center;
           margin-right:12px;
           margin: 14px 0px 2px;
           min-width:170px;
         }
  }
</style>


