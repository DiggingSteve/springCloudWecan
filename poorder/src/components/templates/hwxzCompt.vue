<template>
    <div class="hwxzform">
<!-- {{inputModelData.hwxz}}
{{inputModelData.hwlx}}
{{inputModelData.batterymodel}} -->
    <formCompt :input-view-data="hawbViewData" :input-model-data="inputModelData" >
                      <template slot="hwlx">
                  <!-- <el-radio v-model="inputModelData.hwlx"  v-for="(radioitem,radioIndex) in hwlxOptions" :label="radioitem.value" :key="radioIndex" >{{radioitem.label}}</el-radio> -->
                 <el-checkbox-group v-model="hwl">
                          <el-checkbox  v-for="(radioitem,index) in hwlxOptions" :label="radioitem" :key="index"></el-checkbox>
                        </el-checkbox-group>
                  </template>
                <template slot="batterymodel">
                        <!-- <el-radio v-model="inputModelData.batterymodel"  v-for="(radioitem,radioIndex) in batterymodelOp" :label="radioitem.value" :key="radioIndex" >{{radioitem.label}}</el-radio> -->
                          <el-checkbox-group v-model="bat">
                          <el-checkbox  v-for="(radioitem,index) in batterymodelOp" :label="radioitem"  :key="index"></el-checkbox>
                        </el-checkbox-group>
                  </template>
                 </formCompt>
    </div>

</template>

<script>



export default {
  components: {

  },
  props: {
        inputModelData:{
          type:Object,
          default(){
            return {}
          }
        }
        ,pagetype:{ //1 新增页面  2修改页面
          type:Number,
          default:1
        },
        hidehwxz:{ //是否隐藏货物性质，分单里面需要隐藏
           type:Boolean,
           default:false
        },
         disabledArr:{
           type:String,
           default:''
        }


  },
  data () {
    return {
      hawbViewData: [
        {"title":"货物性质：","id":"hwxz",type:"3","model":'',"defaultModel":"普货",left:0,options:[],"groupid":"115",class:'allwidth',width:100},
        {"title":"货物类型：",class:'allwidth',width:100,"id":"hwlx"},
        {"title":"锂电池型号：",class:'allwidth',width:100,"id":"batterymodel"},
      ],
      hwlxOptions:[],
      batterymodelOp:[]

    }
  },
  created(){


  },

  watch:{

    disabledArr:{
      handler(val){
          if(val){
            let arr=val&&val.split(',')||[]
            this.hawbViewData[0].disabled=arr.includes('hwxz')
            this.hawbViewData[1].disabled=arr.includes('hwlx')
            }
      },immediate:true
    },
    hidehwxz:{
      handler(val){
          if(val){
            this.hawbViewData[0].itemStyle={display:'none'}
            }
      },immediate:true
    },
    "inputModelData.hwxz":{
      handler(val){
               var hwlxOptions=[]
               var groupData=JSON.parse(localStorage.getItem('groupType'));
                groupData.forEach(i => {
              if((i.groupid)==115&&(i.typename==val)){
                var ready02=i.id
                groupData.forEach(m=>{
                   if((m.ready02==ready02)&&(m.groupid==109)){
                   //  hwlxOptions.push({label:m.typename,value:m.typename})
                     hwlxOptions.push(m.typename)
                   }
                })
             if(this.pagetype==1){
              //this.inputModelData.hwlx=hwlxOptions[0].value
               this.inputModelData.hwlx = this.inputModelData.hwlx || hwlxOptions[0]
             }else{
             // this.inputModelData.hwlx=this.inputModelData.hwlx||hwlxOptions[0].value
              this.inputModelData.hwlx=this.inputModelData.hwlx||hwlxOptions[0]
             }
              }
          });

           this.hwlxOptions=hwlxOptions
           this.hawbViewData[1].hidden = !val||this.inputModelData.system=='空进'
      },immediate:true

    },
     "inputModelData.system":{
        handler(val){
           this.hawbViewData[1].hidden = val=='空进'
        },
        immediate:true
      },
    "inputModelData.hwlx":{
      handler(val){

          var batterymodelOp=[]
         var groupData=JSON.parse(localStorage.getItem('groupType'));
                  // if(val=="锂电池"){
                   if(val&&val.indexOf("锂电池")>=0){
              groupData.forEach(i => {
              if((i.groupid)==109&&(i.typename=='锂电池')){
                var ready02=i.id
                batterymodelOp=[]
                groupData.forEach(m=>{
                   if((m.ready02==ready02)&&(m.groupid==114)){
                     // batterymodelOp.push({label:m.typename,value:m.typename})
                      batterymodelOp.push(m.typename)
                   }
                })
               // this.inputModelData.batterymodel=this.inputModelData.batterymodel||batterymodelOp[0]
              }
          });

          this.hawbViewData[2].hidden=false
            this.batterymodelOp=batterymodelOp

          }else{
            this.hawbViewData[2].hidden=true
            this.batterymodelOp=[]
          }
          // if(batterymodelOp.length>0){
          //     this.hawbViewData[2].hidden=false
          //     this.batterymodelOp=batterymodelOp
          // }else{
          //   this.hawbViewData[2].hidden=true
          //   this.batterymodelOp=[]
          // }
      },immediate:true
    }

  },
  computed:{
      bat:{
        get(){
             return (this.inputModelData.batterymodel&&this.inputModelData.batterymodel.split(','))||[]
        },set(val){
               this.inputModelData.batterymodel=val.length>0&&val.toString()
        }
      }
      ,hwl:{
         get(){
             return (this.inputModelData.hwlx&&this.inputModelData.hwlx.split(','))||[]
        },set(val){
               this.inputModelData.hwlx=val.length>0&&val.toString()
        }
      }

  },
  methods:{

  },

}
</script>

<style lang='less' scoped>
/* .hwxzform{
  /deep/ label{
    min-width: 70px;
  }
} */
</style>
