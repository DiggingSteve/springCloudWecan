<template>
    <div class="hwxzform">
<!-- {{inputModelData}} -->
    <newFormCmpt :name="name" :view-data="hawbViewData" :model-data="inputModelData" exForm >
                      <template slot="hwlx">
                   <el-select v-model="inputModelData.hwlx"  placeholder="请选择" >
                          <el-option
                            v-for="item in hwlxOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </template>
                <template slot="batterymodel">
                         <el-select v-model="inputModelData.batterymodel"  placeholder="请选择" >
                          <el-option
                            v-for="item in batterymodelOp"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </template>
                 </newFormCmpt>
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

  },
  data () {
    return {

      hawbViewData: {
        hwxz:{"title":"货物性质",type:"4","groupid":"115"},
        hwlx:{"title":"货物类型"},
        // batterymodel:{"title":"锂电池型号："}
      },
      hwlxOptions:[],
      batterymodelOp:[]

    }
  },
  created(){


  },

  watch:{
    "inputModelData.hwxz":{
      handler(val){
      //  this.inputModelData.hwlx=''
               var hwlxOptions=[]
               var groupData=JSON.parse(localStorage.getItem('groupType'));
                groupData.forEach(i => {
              if((i.groupid)==115&&(i.typename==val)){
                var ready02=i.id
                groupData.forEach(m=>{
                   if((m.ready02==ready02)&&(m.groupid==109)){
                     hwlxOptions.push({label:m.typename,value:m.typename})
                   }
                })


              }
          });

           this.hwlxOptions=hwlxOptions
          //  if(hwlxOptions.length==1){
          //     this.inputModelData.hwlx=hwlxOptions[0].value
          //  }
      },immediate:true

    },
    "inputModelData.hwlx":{
      handler(val){
    /*  var batterymodelOp=[]
         var groupData=JSON.parse(localStorage.getItem('groupType'));
                   if(val=="锂电池"){
              groupData.forEach(i => {
              if((i.groupid)==109&&(i.typename==this.inputModelData.hwlx)){
                var ready02=i.id
                batterymodelOp=[]
                groupData.forEach(m=>{
                   if((m.ready02==ready02)&&(m.groupid==114)){
                      batterymodelOp.push({label:m.typename,value:m.typename})
                   }
                })
              }
          });
          }

               if(batterymodelOp.length>0){
              this.hawbViewData.batterymodel.hidden=false
          this.batterymodelOp=batterymodelOp
          }else{
            this.hawbViewData.batterymodel.hidden=true
            this.batterymodelOp=[]
          } */
      },immediate:true
    }


  },
  computed:{


  },
  methods:{

  },

}
</script>

<style lang='less' scoped>
.hwxzform{
  /deep/ label{
    min-width: 70px;
  }
}
</style>
