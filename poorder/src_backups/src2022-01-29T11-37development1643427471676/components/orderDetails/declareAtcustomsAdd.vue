<template>
  <div class="elform" style="margin:12px 36px;border:1px solid #eee;padding:12px">
 <!-- {{mawbinfo}} -->
<!--  {{mawbinfo.declList}}
{{mawbinfo.declListMdg}} -->
<!-- {{hawbform}} -->
<!-- {{orderpgid}}
{{childpgid}} -->
<!-- {{mawbinfo.declList}} -->
<!-- {{mawbinfo}} -->
    <el-form ref="form"  :inline="true" style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap">


<div style="width:100%">
<!--     <el-form-item label="分运单号："  style="min-width:200px;margin-right:14px;" >
                     <span>{{mawbinfo.hawb}}</span>

   </el-form-item> -->
       <el-form-item label="件数：" style="min-width:120px;margin-left:28px;" >
                     <span>{{mawbinfo.piece}}</span>
                     <!-- <span>{{mawbinfo.khjcnolist.reduce((prev, i) => (prev += Number(i.piece)), 0)}}</span> -->
   </el-form-item>
       <el-form-item label="重量：" style="min-width:150px">
                     <!-- <span>{{mawbinfo.khjcnolist.reduce((prev, i) => (prev += Number(i.weight)), 0)}}</span> -->
                     <span>{{mawbinfo.weight}}</span>
   </el-form-item>

</div>
<template v-for="(item,index) in hawbform" >
  <el-row style="width:100%;padding-left:28px" :key="index">
 <!--   <el-form-item label="报关单号：" style="min-width:200px;margin-right:20px;" :key="index">
                     <span>{{item.pono}}</span>
   </el-form-item> -->

               <el-form-item label="件数：" style="width:120px">
                    <el-input style="width:60px;" v-model.number="item.piece"></el-input>
                </el-form-item>
                <el-form-item label="重量：" style="width:120px">
                    <el-input style="width:60px;" v-model="item.weight" @input="weightVerify(index)"></el-input>
                </el-form-item>
                <el-form-item label="连单数：" style="width:130px">
                    <el-input style="width:60px;" v-model.number="item.lds" v-verify="'integer'"></el-input>
                </el-form-item>



   <!-- <el-form-item label="报关类型：">
                 <my-select :groupid="19" itemstyle="width:100px;min-width:120px;" v-model="item.bglx"></my-select>
    </el-form-item> -->

 <el-form-item label="报关供应商：" style="margin-left:4px">
                 <page-select :modelval.sync="item.bggys" :pagetype="3" @change="getGysname($event,index)"></page-select>
    </el-form-item>


<el-form-item>
    <div  style="flex:0 45px"><span><i @click="hawbformDel(index)" style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;" :style="{color:index!=0?'red':'#67C23A'}" :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"></i></span>  </div>
</el-form-item>

   <el-form-item style="margin-left:40px" v-if="index==(hawbform.length-1)">
     <el-button size="mini"  @click="saveListInfo" type="primary">保存</el-button>
     <el-button size="mini" v-if="putIndex!=-1" @click="resetForm" type="primary">取消</el-button>
</el-form-item>

</el-row>
</template>




 <!-- <div style="display:flex;justify-content:space-between;width:100%;padding-left:20px">
    <el-form-item>
     <el-button size="mini"  @click="saveListInfo">保存</el-button>
     <el-button size="mini" v-if="putIndex!=-1" @click="resetForm">取消修改</el-button>
</el-form-item>
 </div> -->



    </el-form>

    <div>

    </div>
    <!-- {{tableData}} -->
       <commonTable class="commonTable" :head="tableHead" :table-data="pagetype==1?mawbinfo.declList:mawbinfo.declListMdg"  :isMultiSelect='mawbinfo.guid!=-1' style="margin-top:8px;"  :zi-index="ziIndex">
         <template slot="operate" slot-scope="props">
             <i class="el-icon-setting" @click="setListInfo(props.data.index)"></i>
           </template>
      <!--       <template slot="jdinfo"  slot-scope="props">
            <span style="color:#0066FF;cursor:pointer;pointer-events: all" @click="showJdinfo(props.data.index)">查看</span>
          </template>
          <template slot="status"  slot-scope="props">
            {{ getStatusText(props.data.value) }}
          </template> -->
     <template slot="weight" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>

     <template slot="ziTable" >
                        <commonTable :head="ziTableHead" :table-data="ziTableData" style="width:500px;margin-left:151px;">
                        </commonTable>
                    </template>


        </commonTable>


          <el-dialog
    append-to-body
    :visible.sync="nodewageVisible"
    :close-on-click-modal="false"
    width="380px"
   top="10%"
    center>
    <el-form  label-position="left" :inline="true" label-width="85px" class="smallform" style="padding-left:12px;">
      <el-form-item label="费用："   v-model="nodewageForm.wageall">
            <el-input></el-input>
      </el-form-item>
        <el-form-item label="币种："  v-model="nodewageForm.currency">
            <el-input></el-input>
      </el-form-item>
           <el-form-item label="操作人："  v-model="nodewageForm.addman" >
            <el-input></el-input>
      </el-form-item>
           <el-form-item label="操作日期：">
              <el-date-picker
            v-model="nodewageForm.adddate"
            type="datetime"
            placeholder="选择日期时间"
           >
          </el-date-picker>

      </el-form-item>
      <el-form-item >
        <el-button type="info" plain style="margin-left:85px;width:180px;">确认</el-button>
      </el-form-item>
    </el-form>

      </el-dialog>

  </div>
</template>
<script>

import {getChangeRate} from '../../api/localStorage.js'
export default {
  props:{
    mawbinfo:{
      type:Object,
      default:()=>{}
    },
    pagetype:{
      type:[Number,String],
      default:1 //1始发港 2目的港
    }
  },
   components: {},

   data(){
     return {
      wtxmAll:[],//
      piform:{bglx:"",bggysname:"",bggys:""},
      bgNodeStatus: [],
      currentPage:1,
      pageSize:10,
      disabled:false,
      putIndex:-1,
      ziIndex:-1,
      hawbform: [ //第一个分单的件重体应该默认全部件重体
        {
          piece:"",
          weight:"",
          lds:0,
          bglx:"",
          bggys:'',
          guid:-1
         }
      ],
       tableHead:[
          {title:"操作",field:"operate"},
      /*     {title:"节点信息",field:"jdinfo"},
           {title:"当前状态",field:"status"}, */
          {title:"总运单号",field:"mawb"},
          {title:"分运单号",field:"hawb"},
         // {title:"报关单号",field:"pono"},
          {title:"报关类型",field:"bglx"},
          {title:"报关供应商",field:"bggysname"},
          {title:"件数",field:"piece"},
          {title:"重量",field:"weight"},
          {title:"连单数",field:"lds"},
       ]

       ,ziTableHead:[
           {title:"状态",field:"nodename"},
           {title:"操作人",field:"nodeman"},
           {title:"操作时间",field:"nodedate"}
       ]
       ,ziTableData:[

       ],
      nodewageVisible:false, //节点费用
      nodewageForm:{},
     }
   }
   ,methods:{
     getGysname(val,index){
     /*     console.log(val)
         console.log(index) */
         this.hawbform[index].bggysname=val.usr_name
     },
    getStatusText (status) {
      let text = ''
      for (let i in this.bgNodeStatus) {
        if (this.bgNodeStatus[i].nodeindex == status) {
          text = this.bgNodeStatus[i].nodename
          break
        }
      }
      return text
    },
      initHawbform(){
          var obj={
                hawb:this.hawbform[this.hawbform.length - 1].hawb,
                piece:"",
                weight:"",
                lds:0,
                bglx: this.hawbform[this.hawbform.length - 1].bglx,
                bggys: this.hawbform[this.hawbform.length - 1].bggys,
                bggysname: this.hawbform[this.hawbform.length - 1].bggysname,
                guid:-1,
                isdel:1
           }
           return obj
    },
    hawbformDel(index){ //删除表单分单

      var piece=this.mawbinfo.piece;
      var weight=this.mawbinfo.weight;


    if(index==0){
      this.hawbform.push(this.initHawbform())
        this.hawbform.forEach(i=>{
           piece=piece-i.piece
           weight=weight-i.weight
      })

    }else{

          for(var i=this.hawbform.length-1;i--;i>=0){
             if(i>=1){
                    piece=piece-this.hawbform[i].piece
                    weight=weight-this.hawbform[i].weight
            }
          }



          this.hawbform.splice(index,1)

    }
////console.log(JSON.stringify(this.hawbform))

      this.hawbform[this.hawbform.length-1].piece=piece>=0?piece:0;
      this.hawbform[this.hawbform.length-1].weight=weight>=0?Number(weight).toFixed(2):0;

    },
    weightVerify (index) {
      let totalWeight = this.hawbform.reduce((prev, i) => prev += Number(i.weight), 0)

      if (totalWeight > this.hawbform[0].hawbweight) {
        let cur_weight = Math.floor( (totalWeight - this.hawbform[index].weight) * 100 ) / 100
        let num = Math.floor( (this.hawbform[0].hawbweight - cur_weight) * 100 ) / 100

        setTimeout(() => {
          this.hawbform[index].weight = num
        },)
      }
    },


     saveListInfo(){

       if(this.pagetype==1&&!this.mawbinfo.bglx){
         this.$message.error("请先选择报关类型！");return;
       }
         if(this.pagetype==2&&!this.mawbinfo.bglx_mdg){
         this.$message.error("请先选择报关类型！");return;
       }
       if(!this.mawbinfo.mawb && this.mawbinfo.dzlx == '直单'){
         this.$message.error("请先填写总运单号！");return;
       }
       if(!this.mawbinfo.hawb&&this.mawbinfo.dzlx=='总单'){
         this.$message.error("请先填写分运单号！");return;
       }

       let tableData=this.pagetype==1?this.mawbinfo.declList:this.mawbinfo.declListMdg

       let tonum=tableData.length>0?tableData.map((i,k)=>{ return (k!=this.putIndex)?Number(i.piece):0}).reduce((a,b)=>{return a+b}):0
       let tonum2=this.hawbform.map((i,k)=>{ return (k!=this.putIndex)?Number(i.piece):0}).reduce((a,b)=>{return a+b})

       if(tonum2>(this.mawbinfo.piece-tonum)){
           this.$message.error('件数超过总件数！');return;
       }
       var piececa=this.mawbinfo.piece;

        for(let i in this.hawbform){
          let item=this.hawbform[i]
        /*   if(!item.bggys){
              this.$message.error('请选择报关供应商！');
              return;
          } */
              piececa= piececa-item.piece
              item.mawb=this.mawbinfo.mawb
              item.bggysname=item.bggysname||'---'
              item.hawb=this.mawbinfo.dzlx=='总单'?this.mawbinfo.hawb:'---'
              item.bglx=this.pagetype==1?this.mawbinfo.bglx:this.mawbinfo.bglx_mdg
        }


       if(piececa!=0){
         this.$message.error("报关的件数与件数不相等");return;
       }


       if(this.pagetype==1){
         this.mawbinfo.declList=[...this.hawbform]
       }else{
         this.mawbinfo.declListMdg=[...this.hawbform]
       }
       this.putIndex=-1
        this.hawbform= [
         { piece:"",
          weight:"",
          lds:0,
          bglx:"",
          bggys:'',
          guid:-1
         }
      ]
      this.$emit('success',true)
     },
     setListInfo(index){
         this.putIndex=index
          this.$nextTick(()=>{
                  let n=-1;
                  let tableData=this.pagetype==1?this.mawbinfo.declList:this.mawbinfo.declListMdg
                    tableData.forEach((i,k)=>{
                        if(i.hawb==tableData[index].hawb){
                          n+=1
                            this.$set(this.hawbform,n,JSON.parse(JSON.stringify(tableData[k])))
                        }
                  })
          })

     },
     resetForm(){
       this.putIndex=-1
       this.hawbform=[this.initHawbform()]
     }


}
,computed:{



},
created () {
  /*   this.getListInfo()
    this.bgNodeStatus = JSON.parse(localStorage.statusData).filter(item => {
      return item.dom == '报关状态' && item.system == '空出'
    }) */
},
watch: {

}

}
</script>
<style lang="less" scoped>
.mulSelPane-title{
  font-size:14px;
  color:#333;
  position:absolute;
  top:0px;
  background:#fff;
  width:100%;
  height:30px;
  line-height:30px;
  display:flex;
  justify-content:space-between;
  z-index:10;
  padding:0px 20px
}

 .elform{

   /deep/ .el-form-item__label{
     padding-right:5px;
     color:#333;
   }
   /deep/ .el-form-item{
            margin-bottom:0px;
   }
 }
 .smallform{
       /deep/ .el-input__inner{
            width:180px;
   }

   /deep/ .el-form-item{
            margin-bottom:0px;
   }
 }
</style>


