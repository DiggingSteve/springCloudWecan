<template>

    <div class="fenpei">
<!-- {{currentMod}} -->
  <table style="table-layout:fixed;" class="fpTable">
    <tr>
      <th style="width:80px;">操作</th>
      <th style="width:300px;">服务</th>
      <th style="width:80px">分配区域</th>
      <th>分配模式</th>

      <th>费用</th>
      <th style='width:260px'>类型</th>
      <th>币种</th>
      <th style="width:120px">分利(WFF:操作站)</th>
    </tr>
    <tr>
      <td>
      <i class="icon-save" style="cursor:pointer" @click="newFenpei"></i>
      &nbsp;
      <i class="el-icon-close" style="font-size:18px;cursor:pointer" @click="clearCurrent"></i>
       </td>

       <td>
         <el-input v-model="currentMod.assignname" :disabled='true' style="width:92%"></el-input>
       </td>

       <td>
         <el-input v-model="currentMod.assignarea" :disabled='true' style="width:92%"></el-input>
       </td>

        <td>
           <el-select v-model="currentMod.profitmode" style="width:92%">
            <el-option 
            v-for="item in sfgfpms"
            :key="item"
            :label="item"
            :value="item"
            >
            </el-option>
            </el-select>
       </td>

        <td>
          <el-input v-model="currentMod.inwageallinprice" style="width:92%" :disabled="currentMod.profitmode=='利润分配模式'" v-verify="'fixedFTwo'"></el-input>
       </td>

       <td>
         
  <el-radio v-model="currentMod.isinwageallin" label="1" :disabled="currentMod.profitmode=='利润分配模式'||currentMod.servicecode.indexOf('OA0010')==-1">单价ALLIN</el-radio>
  <el-radio v-model="currentMod.isinwageallin" label="2" style="margin-left:10px" :disabled="currentMod.profitmode=='利润分配模式'||currentMod.servicecode.indexOf('OA0010')==-1">总价</el-radio>
  <el-radio v-model="currentMod.isinwageallin" label="3" style="margin-left:10px" :disabled="currentMod.profitmode=='利润分配模式'||currentMod.servicecode.indexOf('OA0010')==-1">单价++</el-radio>
  
       </td>

       <td>
          <el-select v-model="currentMod.currency"  style="width:92%;height:28px!important;" :disabled="currentMod.profitmode=='利润分配模式'">

                  <el-option v-for="(item,index) in currencyList"
                  :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
       </td>

       <td>

          <el-input v-model="currentMod.self_profitvalue" style="width:40%" @change="fpChange(currentMod.self_profitvalue,'1')"></el-input>
          :
          <el-input v-model="currentMod.cus_profitvalue" style="width:40%" @change="fpChange(currentMod.cus_profitvalue,'2')"></el-input>
       </td>
       
    </tr>
    <tr v-for="(item,index) in fenpeidata" :style="{background:index%2==0?'white':'#f8f8f8'}" v-if="item.assignarea" :key="index">
      <td><i class="el-icon-setting" title="分配修改" style="font-size:18px;cursor:pointer" @click="changeFenPeiIndex(index)"></i></td>
      <td style="width:300px;text-overflow:ellipsis;overflow:hidden;" :title="item.assignname">{{item.assignname}}</td>
      <td style="width:80px">{{item.assignarea}}</td>
      <td>{{item.profitmode }}</td>
      <td>{{item.profitmode=="利润分配模式"?'--':item.inwageallinprice&&Number(item.inwageallinprice).toFixed(2)}}</td>
        <td>
     <span v-if="item.profitmode">{{item.profitmode!='利润分配模式'&&item.isinwageallin?(item.isinwageallin=='1'?'单价ALLIN':item.isinwageallin=='2'?'总价':'单价++'):''}}</span>
     <span v-else></span>

     </td>
      <td>{{item.currency}}</td>
      <td style="width:120px">{{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.self_profitvalue}}:{{(!item.inwageallinprice&&item.profitmode!='利润分配模式')||((item.profitmode=='Co-Load模式'&&item.isinwageallin=='2')&&(item.servicecode.indexOf('OA0010')==-1))?'--':item.cus_profitvalue}}</td>
    </tr>
  </table>
    </div>

</template>
  
<script>

export default{

  props:{
   
    fenpeidata:{
      type:[Object,Array]
    },
    fenpeiIndex:''
 

  },
  components: {
        
        },
  data(){
       return {
       sfgfpms:['Co-Load模式'],//始发港分配模式数据
       modIndex:-1,
       currentMod:{
          assignname:'',
          servicecode:'',
          assignarea:'',
          profitmode:'',
          inwageallinprice:'',
          isinwageallin:'',
          currency:'人民币',
          self_profitvalue:10,
          cus_profitvalue:0,
       },
       currencyList:[]
   }
},
   methods:{
newFenpei(){

  if(this.currentMod.servicecode.indexOf('OA0010')!=-1){
    if(this.currentMod.profitmode=='利润分配模式'&&(!this.currentMod.self_profitvalue||!this.currentMod.cus_profitvalue)){
    this.$message.error('操作站分泡比例不能为0');
    return false
  }else if(!this.currentMod.currency&&this.currentMod.profitmode=='Co-Load模式'){
    this.$message.error('币种不能为空');
    return false
  }else if((!Number(this.currentMod.inwageallinprice))&&this.currentMod.profitmode=='Co-Load模式'){
    this.$message.error('运费价格不能为空');
    return false
  }else if(this.currentMod.isinwageallin=='2'&&Number(this.currentMod.inwageallinprice)<100){
    this.$message.error('运费价格不能小于100');
    return false
  }else if(this.currentMod.profitmode=='Co-Load模式'&&!(this.currentMod.self_profitvalue)){
    this.$message.error('分泡比例不能为0');
    return false
  }else if(!this.currentMod.profitmode){
    this.$message.error('请选择分配模式')
    return false
  }
}else{
if(item.isinwageallin=='2'&&Number(item.inwageallinprice)<100){
  this.$message.error('相关费用不能小于100')
     return false
}
//   if(this.currentMod.assignname.indexOf('提货服务')!='-1'&&this.currentMod.assignname.indexOf('报关服务')=='-1'){
 
//     if(this.currentMod.isinwageallin=='2'&&Number(this.currentMod.inwageallinprice)<100){
//     this.$message.error('相关费用不能小于100')
//     return false
//   }
// }else if(this.currentMod.assignname.indexOf('报关服务')!='-1'&&this.currentMod.assignname.indexOf('提货服务')=='-1'){

//     if(this.currentMod.isinwageallin=='2'&&Number(this.currentMod.inwageallinprice)<100){
//       this.$message.error('相关费用不能小于100')
//     return false
//   }
// }else if(this.currentMod.assignname.indexOf('提货服务')!='-1'&&this.currentMod.assignname.indexOf('报关服务')!='-1'){

//   if((this.currentMod.isinwageallin=='2'&&Number(this.currentMod.inwageallinprice)<100)||(this.currentMod.isinwageallin=='2'&&Number(this.currentMod.inwageallinprice)<100)){
//       this.$message.error('相关费用不能小于100')
//     return false
//   }
// }else if(!this.currentMod.profitmode){
//     this.$message.error('请选择分配模式')
//     return false
//   }
}

this.$emit('success',{modIndex:this.modIndex,currentMod:this.currentMod})
this.$emit('success',{modIndex:'-1'})
this.currentMod={
          assignname:'',
          assignarea:'',
          servicecode:'',
          profitmode:'',
          inwageallinprice:'',
          isinwageallin:'',
          currency:'人民币',
          self_profitvalue:10,
          cus_profitvalue:0,
       }

this.modIndex=-1
},
fpChange(val,type){
  if(val){
     var reg=/^([1-9]+([.]{1}[0-9]{0,1})?)$/
     if(!reg.test(Number(val))||Number(val)>10){
      this.$message.error('请输入1-10的小数')
      if(type=='1'){
        this.currentMod.self_profitvalue=''
      }else if(type=='2'){
        this.currentMod.cus_profitvalue=''
      }
      return false
     }else{
      if(type=='1'){
        this.currentMod.cus_profitvalue=Number(10-Number(val))
      }else if(type=='2'){
        this.currentMod.self_profitvalue=Number(10-Number(val))
      }

     }
  }
},
clearCurrent(){
  this.currentMod={
          assignname:'',
          assignarea:'',
          servicecode:'',
          profitmode:'',
          inwageallinprice:'',
          isinwageallin:'',
          currency:'人民币',
          self_profitvalue:10,
          cus_profitvalue:0,
       }
       this.$emit('success',{modIndex:'-1'})
  //this.modIndex=-1     
},

changeFenPeiIndex(val){
  this.modIndex=val
this.$emit('success',{modIndex:val})
    if(val!=-1){
          this.currentMod={...this.fenpeidata[val]}
          this.currentMod.isinwageallin=this.currentMod.isinwageallin.toString()
      if(this.currentMod.servicecode.indexOf('OA0010')==-1){
        this.currentMod.isinwageallin='2'
      }
      if(this.currentMod.profitmode=='利润分配模式'){
        this.currentMod.isinwageallin='-1'
        this.currentMod.currency=''
      }
      }
},




}

   ,computed:{
  
   }
   ,created(){

 let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currencyList.push(item.cname)
    })

    // this.modIndex=-1

    // this.currentMod={
    //       assignname:'',
    //       assignarea:'',
    //       profitmode:'',
    //       inwageallinprice:'',
    //       isinwageallin:'',
    //       currency:'人民币',
    //       self_profitvalue:10,
    //       cus_profitvalue:0,
    //    }

   


   
    }
    ,watch:{
     'currentMod.servicecode'(val){
        if(val.indexOf("OA0010")!=-1){
          if(this.sfgfpms.indexOf('利润分配模式')==-1){
          this.sfgfpms.push('利润分配模式')
        }
    
      }else{
        if(val.indexOf('利润分配模式')!=-1){
        this.sfgfpms.splice(this.sfgfpms.indexOf('利润分配模式'),1)
        }
      }
     },
     'currentMod.profitmode'(val){
       if(val=='利润分配模式'){
        this.currentMod.currency=''
        this.currentMod.inwageallinprice=''
        this.currentMod.isinwageallin=''
       }
     },
     fenpeiIndex:{
      handler(val){
       if(val=='-1'){
        this.currentMod={
          assignname:'',
          assignarea:'',
          servicecode:'',
          profitmode:'',
          inwageallinprice:'',
          isinwageallin:'',
          currency:'人民币',
          self_profitvalue:10,
          cus_profitvalue:0,
       }
       }
    
      },
      immediate:true
      
    
     },

  

    }
   



}

</script>


<style lang="less" scoped>
.fpTable{width:100%;text-align:center;margin-top:28px;}
.fpTable tr{height:36px;line-height: 36px;}
.fpTable tr th,.fpTable tr td{border:1px solid #e8e8e8;}
.el-input .el-input__inner[disabled]{height:28px!important}

</style>









