<template>
  <div>
     <!-- {{editData}} -->
    <!-- {{tableData}} -->
<!-- {{mawbinfo}} -->
    <!-- <p>{{checkRequier}}</p> -->
       <commonTable class="commonTable" :head="tableHead" :table-data="tableData" >
           <template slot="firstTd">
               <td>
                    <i class="el-icon-circle-plus" v-show="ifstrict"  style="width:18px;height:18px;font-size:18px;cursor:pointer;color:#67C23A;vertical-align:-2px;" @click="disabled=false"></i>
                    <i class="icon-save" style="font-size:16px;height:16px;vertical-align:-3px;" @click="saveListInfo" ></i>
                    <i class="el-icon-close" v-show="!ifstrict" style="font-size:16px;height:16px;vertical-align:-3px;" @click="initFunc" ></i>
                </td>
                 <td>
                   <page-select :modelval.sync="editData.items" :pagetype="5" @change="itemsChange"></page-select>
               </td>
               <td><el-input v-model="editData.itemsename" :disabled="disabled"></el-input></td>
               <td><el-input v-model="editData.price" :disabled="disabled" style="min-width:80px"></el-input></td>
               <td><my-select :groupid="33" itemstyle="min-width:120px;width:100%;margin-bottom:0px;display:inline-block;max-width:120px" v-model="editData.itemstype" :disabled="disabled"></my-select></td>
               <td><el-input :value="setWageall(editData)" :disabled="true" style="min-width:80px"></el-input></td>
          </template>
           <!-- <template slot="price" slot-scope="props">{{setWageall(props.data.row,2)?props.data.value:props.data.row.min_price}}</template>
           <template slot="itemstype" slot-scope="props">{{setWageall(props.data.row,2)?props.data.value:'票'}}</template> -->
           <template slot="operate" slot-scope="props"><i class="el-icon-setting" @click="setListInfo(props.data.index)"></i><i class="el-icon-delete" @click="delListInfo(props.data.index)"></i></template>
           <template slot="wageall" slot-scope="props">{{setWageall(props.data.row)}}</template>
        </commonTable>
        <!-- {{costdata}} -->
  </div>
</template>
<script>
import {getChangeRate,computedWeight} from '../../api/localStorage.js'
export default {
  props:{
   mawbinfo:Object,
    wagedom:{  //来源
     type:String,
     default:""
    },
    guid:[String,Number],
    wagelistOriginalData:Array,
    isams:{
      type:Boolean,
      default:false,
    },
    tableData:{ //所有表格信息
      type:Array,
      default(){
        return []
      }
    }
,
    ifstrict:{ //新增时候是否是严格模式，如果是严格模式，需要点击加号才能新增
      type:Boolean,
      default:false
    }
  },
    components: {

  },

   data(){
     return {
       disabled:false,
       putIndex:-1,
        editData:{
          sid:this.guid,
          itemsename:"",
          items:"",
          price:"",
          num:'',
          itemstype:"",
          wageall:'',
          guid:-1,
          isdel:1
        },
       tableHead:[
          {title:"操作",field:"operate"},
          {title:"服务项目",field:"items"},
          {title:"服务代码",field:"itemsename"},
          {title:"单价",field:"price"},
          {title:"结算方式",field:"itemstype"},
          {title:"合计",field:"wageall"},
       ]

     }
   }
   ,methods:{
     initFunc(){
       this.editData= {
          sid:this.guid,
          itemsename:"",
          items:"",
          itemstype:"",
          price:"",
          num:'',
          wageall:'',
          guid:-1,
          isdel:1
        }
        this.putIndex=-1
     },
     itemsChange(val){
       console.log(val)
       console.log(this.wagelistOriginalData)
       let arr=this.wagelistOriginalData.filter(i=>i.items==val.s_name)
        if(arr.length){
                this.editData.itemsename=arr[0].itemsename
                this.editData.price=arr[0].price
                this.editData.itemstype=arr[0].itemstype
        }

     },
     saveListInfo(){

        // if(this.checkRequier!==""){
        //   alert("请填写 "+this.checkRequier);return;
        // }
                     let json=this.editData
                        if(!json.items||!json.price||!json.itemstype){
                          return
                        }
                          if(!this.setWageall(json,2)){
                          json.price=json.min_price
                          json.itemstype='票'
                          }

                    if(this.putIndex==-1){ //新增
                          this.tableData.push(json)
                    }else{  //修改
                          let newObj=Object.assign({},this.tableData[this.putIndex],json)
                            this.tableData.splice(this.putIndex,1,newObj)
                            this.putIndex=-1
                            //  this.disabled=true;
                    }

                        this.initFunc()


     },
     setListInfo(index){
        this.putIndex=index
        this.$nextTick(()=>{
              this.editData=JSON.parse(JSON.stringify(this.tableData[index]))
        })
      //  this.disabled=false;
     },
     delListInfo(index){
          this.tableData.splice(index,1)
     }
,
   setWageall(data,type){
    // console.log(min_price)
    //type 2返回是否总价大于最小价，如果false,这赋值最小价格
    let price=data.price
    let itemstype=data.itemstype
    let min_price=data.min_price
     var num=0
        switch(itemstype){
       case "总运单票数":
      num = 1;
      break;
        case "总运单件数":
      num = this.mawbinfo.zdpiece;
      break;
      case "分运单票数":
      num = this.mawbinfo.hawbnum||0;
      break;
      case'票':
      num='1'
      break;
      case'计重':
    //  num=computedWeight(this.mawbinfo.zdvolume,this.mawbinfo.zdweight)
    //alert(this.mawbinfo.jfweight)
      num=this.mawbinfo.jfweight||0
      break;
      case'结算重量':
      num=this.mawbinfo.accountweightout
      break;
      case'毛重':
     num=this.mawbinfo.zdweight;
     //console.log(num)
      break;
       case'箱':
     num=this.mawbinfo.realpiece;
     break;
        case'分运单票数':
     num=this.mawbinfo.hawbcount
      break;
    }

     let priceTotal=(Number(num)*Number(price)).toFixed(2)||0;
     min_price=Number(min_price)||0
    //  console.log(priceTotal)
    // console.log(priceTotal)
    // console.log(min_price)
    // console.log(type)
     //三字码 160- 618- 297- 999- 需要验证min_price

     if (this.mawbinfo.area == '上海') {
        // area=="上海"，再去判断这3字码，然后验证min_price
        let thereCode=this.mawbinfo.mawb&&this.mawbinfo.mawb.substr(0,3)||''
        if(['112','160','618','297','999', '180'].includes(thereCode)){
                  if(type==2){
                    return  priceTotal>=min_price
                  }else{
                    return  priceTotal>=min_price?priceTotal:min_price
                  }
            }else{
                if(type==2){
                    return  true
                  }else{
                    return  priceTotal
                  }
          }
     } else {
       // 非area=="上海"，你就直接去验证min_price
         if(type==2){
            return  priceTotal>=min_price
          }else{
            return  priceTotal>=min_price?priceTotal:min_price
          }
     }
    

       return  priceTotal;
   }


}
,computed:{

  checkRequier(){ //检查是否必填，除备注外全部必填
    var require="";
    Object.keys(this.editData).reverse().forEach(i=>{
       if(i!=='remark'&&(!this.editData[i]||(this.editData[i]=="NaN"))){
             this.tableHead.forEach(item=>{
               if(i==item.field){
                  require=item.title;
               }
             })

       }
    })
    return require
  }


},
mounted() {
        this.$watch(
        function () {
        return this.tableData
        },
        function (newVal, oldVal) {
          // console.log(this.tableData)
          // console.log(this.mawbinfo)
          if(this.mawbinfo&&this.mawbinfo.guid){
                  this.tableData.forEach(i=>{
                  if(!this.setWageall(i,2)){
                           i.price=i.min_price
                           i.itemstype='票'
                    }
                  })
          }

        },{immediate:true}
        )
},
created () {
   this.$watch(
        function () {
        return this.editData.num+this.editData.price
        },
        function (newVal, oldVal) {

             this.editData.wageall=(Number(this.editData.num)*Number(this.editData.price)).toFixed(2)||0
        }
        )
},
watch: {

  "editData.currency"(val){
          this.editData.changerate=getChangeRate(val)||0
  },
  "editData.itemstype"(val){
    if((this.tableData[this.putIndex]&&this.tableData[this.putIndex].itemstype)==val){
      return
    }
    switch(val){
      case'箱':
      this.editData.num=this.mawbinfo.realpiece
      break;
      case'票':
      this.editData.num='1'
      break;
      case'计重':
     // this.editData.num=computedWeight(this.mawbinfo.zdvolume,this.mawbinfo.zdweight)
      this.editData.num=this.mawbinfo.jfweight
      break;
      case'结算重量':
      this.editData.num=this.mawbinfo.accountweightout
      break;
      case'毛重':
      this.editData.num=this.mawbinfo.zdweight;
      break;
       case'分运单票数':
     this.editData.num=this.mawbinfo.hawbcount
      break;
    }
  }
}

}
</script>
<style>

</style>


