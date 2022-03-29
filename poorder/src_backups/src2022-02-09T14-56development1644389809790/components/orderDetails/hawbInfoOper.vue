<template>
 <div>
    <div class="fdinformation fdinformationOper">
<!-- {{hawbdata}} -->
<!-- {{jcnoNumberList}} -->
<!-- {{coverMawbinfo}}
{{hawbdata}}
{{pagetype}} -->
<!-- {{mawbinfo}} -->
      <div class="detail hawbinfo" v-if="pagetype==1" >
                     <div class="detail-title">
                          <p>分单基本信息</p>
                        </div>
                        <div class="detail-c" style="max-width:1300px">
                               <div style="padding:12px">

                 <formCompt :input-view-data="hawbViewData" :input-model-data="hawbdata" style="max-width:1300px"> -->
                    <template slot="khjcno">
                                      <div>
                                    <span style="display:inline-block;width:110px;text-align:right">进仓编号：</span>
                                    <span style="display:inline-block;width:174px">
                                 <el-select  placeholder="请选择" multiple v-model="hawbdata.khjcnoArr" @change="hawbSelFunc" size="mini">
                                          <li>
                                            <span style="float: left;margin-left:20px;">进仓编号</span>
                                                      <span style="float: right;margin-right:30px;"><i class="imul">件</i>/<i class="imul">重</i>/<i class="imul">体</i></span>
                                          </li>
                                                    <el-option
                                                      v-for="numitem in jcnoNumberList"
                                                      :key="numitem.khjcno"
                                                      :label="numitem.khjcno"
                                                      :value="numitem.khjcno"
                                                      style="width:300px;"
                                                        v-if="selOptionShow(numitem)"
                                                      >
                                                      <span style="float: left">{{ numitem.khjcno }}</span>
                                                      <span style="float: right;margin-right:10px;"><i class="imul">{{ numitem.piece }}</i>/<i class="imul">{{ numitem.weight }}</i>/<i class="imul">{{ numitem.volume }}</i></span>
                                                    </el-option>
                                                  </el-select>
                                  </span>
                                </div>
                   </template>
                <!-- <template slot="hwlx">
                  <el-radio v-model="hawbdata.hwlx"  v-for="(radioitem,radioIndex) in hwlxOptions" :label="radioitem.value" :key="radioIndex" >{{radioitem.label}}</el-radio>
                  </template>
                <template slot="batterymodel">
                        <el-radio v-model="hawbdata.batterymodel"  v-for="(radioitem,radioIndex) in batterymodelOp" :label="radioitem.value" :key="radioIndex" >{{radioitem.label}}</el-radio>
                  </template> -->

                    <template slot="exForm" >
                          <hwxzCompt style="margin-bottom:-14px" :inputModelData="hawbdata" :hidehwxz="true"></hwxzCompt>
                    </template>

                 </formCompt>
                   <div style="width:600px;margin-top:20px;margin-top:1px;margin-left:40px;" v-if="mawbinfo.pagetype!=12">
                <div class="input-title" style="margin-bottom:10px;margin-left:-14px">分单进仓编号：</div>
                                <commonTable :head="jcnoTableHead" :table-data="hawbdata.ybstoreList"  :zi-index="ziIndex">
                                  <template slot="khjcno" slot-scope="props"><div><i class="el-icon-circle-plus-outline"  @click="openZitable(props.data.index)" style="float:left;"></i>{{props.data.value}}</div></template>
                                    <template slot="ziTable" v-if="hawbdata.ybstoreList[ziIndex]">
                                        <commonTable :head="ziTableHead" :table-data="hawbdata.ybstoreList[ziIndex].ybstorevolumeList">
                                          <template slot="size" slot-scope="props"><div>{{props.data.row.longs}}*{{props.data.row.widths}}*{{props.data.row.heights}}</div></template>
                                        </commonTable>
                                    </template>
                                </commonTable>
                          </div>
                  </div>
                  </div>
      </div>


            <div v-if="pagetype==2">
                       <makingBill :mawbguid="hawbdata.guid" orderdom="分单" :mawbinfo="coverMawbinfo" v-if="coverMawbinfo.gid"

                        :isPaper="isPaper"
                        :bottomFixed="bottomFixed"
                        :needLimit="needLimit"
                        :afreshRateCharge="afreshRateCharge"
                        @success="$emit('success')"
                        :is-order-confirm="isOrderConfirm"
                        :is-confirm="isConfirm"
                        :active-name="activeName"
                       ></makingBill>
            </div>


  <div class="detail basic-information" style="margin-top:30px"  v-if="pagetype==1">
                        <div class="detail-title">
                          <p>分单收发货人信息</p>
                        </div>
                        <div class="detail-c" style="max-width:1300px;padding:20px">
                         <!-- <makeBillRevSed :billRSinfo="hawbdata.hawbRSinfo" :dom="2" :area="mawbinfo.area" :pagetype="2" :isCustoms="mawbinfo.pagetype==12" :lengthAlert='mawbinfo.pagetype!=12'>
                             <el-input  slot="textCode" v-if="mawbinfo.pagetype==12" type="textarea" rows="4" placeholder="信用代码"  v-model="hawbdata.taxcode_fhr_hawb" class="input-required" v-verify="'creditCode'"></el-input>
                             <el-input  slot="textCode2" v-if="mawbinfo.pagetype==12" type="textarea" rows="4" placeholder="信用代码"  v-model="hawbdata.taxcode_shr_hawb" class="input-required" v-verify="'creditCode'"></el-input>
                         </makeBillRevSed> -->
                            <revSedHawb :dzinfo="hawbdata"  ref='makeBillRevSed'>
                     </revSedHawb>
                       </div>
       </div>

</div>


    </div>

</template>

<script>

import makingBill from "./makingBill"

import { searCondition,reset,evaluationModel,revsendPerson,computedWeight} from '../../api/localStorage.js'
// import makeBillRevSed from '../templates/makeBillRevSed'
import revSedHawb from '../templates/revSedHawb'


export default {
  components: {
    makingBill,
    // makeBillRevSed
    revSedHawb
  },
  props: {
    hawbdata:Object,
    mawbinfo:Object,
    pagetype:Number,
    saveNumberList:Array,
    isPaper: {
      type: Boolean,
      default: false,
    },
    bottomFixed: {
      type: Boolean,
      default: false,
    },
    needLimit: {
      type: Boolean,
      default: false,
    },
    afreshRateCharge:{//是否需要刷新mingbill里面的内容
      type:Boolean,
      default:false
    },
    isOrderConfirm: {
      type: Boolean,
      default: false,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    activeName: { // 当前激活tab
        type: String,
        default: ''
    }

  },
  data () {
    return {
      showfdinformation: true,
      showserviceedit: false,
      dialogFormVisible:false,
       hwlxOptions:[],
      batterymodelOp:[],
      hawbViewData: [

        {"title":"分运单号：",id:"hawb",type:1,"model":"","defaultModel":"",class:'width289'},
        {"title":"分单始发港：",id:"sfg",type:1,"model":"","defaultModel":"",class:'width289'},
        {"title":"分单目的港：",id:"mdg",type:1,"model":"","defaultModel":"",class:'width289',required:true},
        {"title":"",class:'width289',id:'khjcno'},
        {"title":"预报件数：",id:"ybpiece",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"预报重量：",id:"ybweight",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"预报体积：",id:"ybvolume",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"小件数：",id:"smallpiece",type:1,"model":"","defaultModel":"",class: 'width289'},

        {"title":"实际件数：",id:"realpiece",type:18,"model":"","defaultModel":"0",class: 'width289'},
        {"title":"实际重量：",id:"realweight",type:18,"model":"","defaultModel":"0",class: 'width289'},
        {"title":"实际体积：",id:"realvolume",type:18,"model":"","defaultModel":"0",class: 'width579'},
        {"title":"制单件数：",id:"zdpiece",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"制单重量：",id:"zdweight",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"制单体积：",id:"zdvolume",type:1,"model":"","defaultModel":"",class: 'width289'},
        {"title":"计费重量：",id:"jfweight",type:1,"model":"","defaultModel":"",class: 'width289'},
        // {"title":"货物类型：",class:'allwidth',width:100,"id":"hwlx"},
        // {"title":"锂电池型号：",class:'allwidth',width:100,"id":"batterymodel"},
         {"id":"exForm","class": "width100",left:0},
         {"title":"贸易方式：",id:"tradeterm",type:16,"class": "width100",width: 100,"model":"","defaultModel":"",minW: 80,options: [{title:"Freight  Prepaid",detailS:[]},{title:"Freight  Collect",detailS:[]}]},
        {"title":"运费币种：",width:100,model:"",defaultModel:"人民币",type:3,options:[],class:"allwidth",id:"currency"},
        {"title":"运费单价：",id:"rate",type:1,"model":"","defaultModel":"",width:"100",class:"width289"},
        {"title":"英文品名：",model:"",defaultModel:"",type:17,class:'width579',"id":"englishpm",verify:'uppercase'},
         {"title":"中文品名：",model:"",defaultModel:"",type:17,class:'width579',id:"chinesepm"},
         {"title":"唛头：",model:"",defaultModel:"",type:17,class:'width579',"id":"remark",verify:'uppercase'},
      //  {"title":"货主名称：",id:"hzmc",type:1,"model":"","defaultModel":"",class: 'width289'},

      ],
      jcnoTableHead:[
        {title:"进仓编号",field:"khjcno"},
        {title:"件数",field:"piece"},
        {title:"重量",field:"weight"},
        {title:"体积",field:"volume"}
    ]
    ,jcnoTableData:[]
    ,ziTableHead:[
        {title:"包装类型",field:"packagetypename"},
        {title:"件数",field:"piece"},
        {title:"尺寸",field:"size"},
    ]

    ,ziIndex:-1,
    coverMawbinfo:{},
   // khjcnoArr:[],
    jcnoNumberList:[]


    }
  },
  created(){

if(this.mawbinfo.area=='市场部'||this.mawbinfo.area=='海外部'){
   this.hawbdata.tradeterm=this.hawbdata.tradeterm||'FOB'
}else{
   this.hawbdata.tradeterm=this.hawbdata.tradeterm||'CIF'
}
/* this.hawbdata.zdpiece=this.hawbdata.zdpiece||this.hawbdata.realpiece
this.hawbdata.zdweight=this.hawbdata.zdweight||this.hawbdata.realweight
this.hawbdata.zdvolume=this.hawbdata.zdvolume||this.hawbdata.realvolume */

 if(!this.hawbdata.jfweight||Number(this.hawbdata.jfweight).toFixed(2)==Number(computedWeight(this.hawbdata.zdvolume,this.hawbdata.zdweight)).toFixed(2)){
     this.$watch(
      function () {
          return  this.hawbdata.zdvolume+this.hawbdata.zdweight
        },
        function (newVal, oldVal) {
          this.hawbdata.jfweight=computedWeight(this.hawbdata.zdvolume,this.hawbdata.zdweight)
        },{immediate:true}
)
 }



  //this.khjcnoArr=this.hawbdata.ybstoreList.map(i=>i.khjcno)
   //evaluationModel(this.hawbdata,this.hawbViewData)
  //console.log(JSON.stringify(this.hawbdata.fdservice))
  setTimeout(() => {
         if(this.mawbinfo.opersystem=='进口'){
      $('.fdinformationOper').find('#zdpiece,#zdweight,#zdvolume').hide()
      $('.fdinformationOper').find('#jfweight').css({width:'100%'})
  }else{
     $('.fdinformationOper').find('#zdpiece,#zdweight,#zdvolume').show()
      $('.fdinformationOper').find('#jfweight').css({width:'289px'})

   }
   if(this.mawbinfo.pagetype==12){
      $('.fdinformationOper').find('#zdpiece,#zdweight,#zdvolume,#jfweight,#tradeterm,#currency,#rate,#realpiece,#realweight,#realvolume').hide()
      $('.fdinformationOper').find('#hawb,#ybpiece,#chinesepm,#ybweight').find('.input-content').addClass('input-required')
      $('.fdinformationOper').find('#hawb').find('.el-input__inner').attr({maxlength:12})
      this.hawbdata.taxcode_fhr_hawb=this.hawbdata.taxcode_fhr_hawb||'9999+'
      this.hawbdata.taxcode_shr_hawb=this.hawbdata.taxcode_shr_hawb||'9999+'
      this.hawbViewData[4].title='件数：'
      this.hawbViewData[5].title='重量：'
      this.hawbViewData[6].title='体积：'


   }else{
      this.hawbViewData[4].title='预报件数：'
      this.hawbViewData[5].title='预报重量：'
      this.hawbViewData[6].title='预报体积：'
      $('.fdinformationOper').find('#zdpiece,#zdweight,#zdvolume,#jfweight,#tradeterm,#currency,#rate,#realpiece,#realweight,#realvolume').show()
      $('.fdinformationOper').find('#hawb,#ybpiece,#chinesepm,#ybweight').find('.input-content').removeClass('input-required')
      $('.fdinformationOper').find('#hawb').find('.el-input__inner').attr({maxlength:''})

   }
  }, 400);
  },

  watch:{
     coverMawbinfo:{
            handler(val){
              this.hawbdata.englishpm=val.englishpm
              this.hawbdata.smallpiece=val.smallpiece
            },deep:true
     },
      "hawbdata":{
       handler(val){
      setTimeout(() => {
           this.getnewdata()
      }, 0);


       }
       ,deep:true,immediate:true
     },
     saveNumberList:{
       handler(val){
            this.jcnoNumberList=val
       },immediate:true,deep:true
     }
  },
  computed:{


  },
  methods:{
       selOptionShow(khjcnoData){ //判断进仓编号是否已经使用
       if(this.hawbdata){
            var isUse=false;
         this.hawbdata.ybstoreList.forEach((item,key)=>{
                  if(khjcnoData.khjcno==item.khjcno){
                    isUse=true
                  }
          })
         return isUse||!khjcnoData.status
       }
    },
         hawbSelFunc(val){ //选中进仓编号

         var ybstoreList=this.hawbdata.ybstoreList;
         var newYbstoreList=JSON.parse(JSON.stringify(ybstoreList))
         var arr=[]
val.forEach(item=>{
  let has=0
    ybstoreList.forEach(el=>{
       if(item==el.khjcno){
            has+=1
       }
    })
    if(!has){
          arr.push({khjcno:item,isdel:1})
          let addJcno=this.jcnoNumberList.filter(i=>i.khjcno==item)[0];
          addJcno.isdel=1
          newYbstoreList.push(addJcno)
    }
})

ybstoreList.forEach(item=>{
  let has=0
    val.forEach(el=>{
       if(item.khjcno==el){
            has+=1
       }
    })
    if(!has){
          arr.push({khjcno:item.khjcno,isdel:2})
        //  newYbstoreList=newYbstoreList.filter(i=>i.khjcno!=item.khjcno)
         newYbstoreList.forEach(i=>{
            if(i.khjcno==item.khjcno){
              i.isdel=2
            }
         })
    }else{
      newYbstoreList=newYbstoreList.filter(i=>i.khjcno!=item.khjcno)
    }
})
console.log(arr)
console.log(newYbstoreList)
//this.$set(this.hawbdata,'newYbstoreList',newYbstoreList)
this.hawbdata.newYbstoreList=newYbstoreList

          var piece=0
          var weight=0
          var volume=0
        val.forEach(item=>{
           this.jcnoNumberList.forEach(element => {
              if(item==element.khjcno){
                piece+=Number(element.piece)
                weight+=Number(element.weight)
                volume+=Number(element.volume)
              }
           });
        })

        this.hawbdata.realpiece=piece
        this.hawbdata.realweight=Number(weight).toFixed(2)
        this.hawbdata.realvolume=Number(volume).toFixed(3)

    },
    getnewdata(){ //用分单信息覆盖一部分总单信息，这样制单里面不用传分单数据
              var data=JSON.parse(JSON.stringify(this.mawbinfo))
              // console.log(data)
              // alert(3)
                  data.mdg=this.hawbdata.mdg
                  data.zdpiece=this.hawbdata.zdpiece
                  data.zdweight=this.hawbdata.zdweight
                  data.zdvolume=this.hawbdata.zdvolume
                  data.smallpiece=this.hawbdata.smallpiece
                  data.englishpm=this.hawbdata.englishpm
                  data.hawb=this.hawbdata.hawb
                  data.guid=this.hawbdata.guid
                  data.jfweight=this.hawbdata.jfweight
              this.coverMawbinfo=data
             },
     openZitable(index){
            //  alert(index)
            if(index==this.ziIndex){
               this.ziIndex=-1
            }else{
                 this.ziIndex=index
            }

      },checkHasLimit(){//检查字数限制
         return this.$refs.makeBillRevSed&&this.$refs.makeBillRevSed.ifHasLimit()
      }

  }

}
</script>

<style lang='less' scoped>
.fdinformation {
  .detail {
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
  }
  .detailTitle {
    font-size: 14px;
    color: #333;
  }
    .detail-title {
      display: flex;
      align-items: center;
      height: 32px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
    }
  .hawbinfo {
    position: relative;
    .service-edit-btn {
      margin-left:5px;
      float:right;
      height: 28px;
      padding: 0 15px;
      color: #0f5a8c;
    }
    .service-edit-c {
      position: absolute;
      overflow: hidden;
      top: 34px;
      left: -1px;
      box-sizing: content-box;
      width: 100%;
      z-index: 1;
      margin: 0 !important;
      background: #fff;
      border: 1px solid #e8e8e8;
      box-shadow: 0 10px 20px -10px;
      transition: height .5s;
      height: 0;
      &.show {
        height: 218px;
      }
    }
  }
  /deep/ .service {
    margin: 8px 200px 10px 60px;
    .serviceTitle {
      display: inline-block;
      width: 150px;
      margin-left: 20px;
      text-align: left;
      ~ .checkbox {
        float: left;
        width: 14px;
        height: 14px;
      }
    }
    .oprequest, .oprequest p {
      position: relative;
      display: inline-block;
    }
    .oprequest .oprequest-text {
      position: absolute;
      top: 0;
      left: 100px;
      width: 200px;
      height: 70px;
    }
    .operating {
      width: 145px;
      height: 28px;
      margin-bottom: 10px;
      span {
        position: relative;
        font-size: 14px;
        font-weight: bolder;
        color: #0f5a8c;
        &::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 7px;
          right: -15px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c8c8c8;
        }
      }
    }
  }
  .content-c {
    margin: 16px 20px 15px;
    > div {
      margin-bottom: 20px;
    }
    span {
      display: inline-block;
      min-width: 90px;
      margin-right: 5px;
      text-align: right;
    }
    b {
      display: inline-block;
      width: 110px;
      margin-right: 20px;
      + label {
        min-width: 60px;
      }
    }
    .el-input {
      width: 65%;
    }
    .el-textarea {
      width: 500px;
      vertical-align: top;
    }
  }
  .mdgserviceTitle, .sfgserviceTitle {
    margin-left: 6px;
    width: 145px;
    height: 28px;
    font-size: 14px;
    color: #333;
    font-weight: bolder;
    margin-bottom: 10px;
  }
  /deep/ .mdgService .detail:last-child {
    margin-bottom: 0;
  }
  .sfgCarSv /deep/ .detail,
  .sfgincargo .detail {
    margin: 0;
    border: 0;
  }
}
.servicePanel{
  margin-bottom: 25px;
  strong{
    font-size:16px;
    color:#0F5A8C;
  }
  small{
    margin-left:10px;
    cursor:pointer;
  }
}
</style>
