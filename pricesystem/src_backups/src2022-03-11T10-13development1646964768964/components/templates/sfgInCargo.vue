<template>

  	<div class="detail sfgInCargo" style="padding:20px 30px 20px;">


          <el-row>
            <el-col :span="7">
              <span >入库地区：</span>

              <span class="input-required">
              	<el-select v-model="sfg.yjstorearea_org"  @change="changeArea(sfg.yjstorearea_org)">
                <el-option
                  v-for="item in area"
                  :key="item"
                  :label="item"
                  :value="item"

                  >
                </el-option>
              </el-select>
               </span>
               </el-col>


<el-col :span="7">
             <span>入库仓库：</span>

              <span class="input-required">
                <el-select v-model="sfg.yjstore_org"  @change="changeArea(sfg.yjstore_org)">
                <el-option
                  v-for="item in storename"
                  :key="item"
                  :label="item"
                  :value="item"

                  >
                </el-option>
              </el-select>

              </span>
 </el-col>

        <el-col :span="7">
              <span>预计入库时间：</span>

              <span class="input-required">
              <el-date-picker
                          v-model="sfg.yjjcdate_org"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>

              </span>


             <!--  <span v-if="item.type==6" class="input-required">
              	 <el-date-picker
                          v-model="item.model"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>

              </span> -->

            </el-col>

          </el-row>



  	</div>

  <!--   <div class="detail">

      <el-collapse-transition>
        <div class="content" v-show="showrkxx">
          <el-row>
            <el-col :span="7">
              <span>入库地区：</span>
              <el-select v-model="rkxx.rkdq">
                <el-option
                  v-for="item in rkdq_options"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span>入库仓库：</span>
              <el-select v-model="rkxx.rkck">
                <el-option
                  v-for="item in rkck_options"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span>预计入库日期：</span>
              <el-date-picker
                v-model="rkxx.yjrkrq"
                type="date">
              </el-date-picker>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div> -->

</template>

<script>
export default {
	props:['sfg'],
  data () {
    return {
      cargoData:[],
      area:[],
      storename:[]

    }
  },
  methods:{
   changeArea(value){
   	var cargoData=this.cargoData
    var storenameN=[]
   	////console.log(JSON.stringify(cargoData))
   	//var sfg=this.sfg
   	//let storename=[]
   	////console.log(value);
   ////console.log(id)
    //console.log(value)

   	for(var i in cargoData){
   		if(cargoData[i].area==value){
            //console.log(cargoData[i])
           storenameN.push(cargoData[i].storename)


   		}
   	}
    this.storename=storenameN
   	////console.log(storename)

   }
  },
  computed:{

  },
  created(){

  this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubWarehouse',params:"",loading:false,tip:false})

  .then(response=>{
     ////console.log(response.data)
     this.cargoData=response.data

  for(var j in response.data){

        if(this.area.indexOf(response.data[j].area)==-1){
      this.area.push(response.data[j].area)
    }


  }
  //if(area[i].indexOf)


 for(var j in response.data){

        if(this.storename.indexOf(response.data[j].storename)==-1){
      this.storename.push(response.data[j].storename)
    }

  }
})
  .catch(error=>{

  })
  }
}
</script>

<style lang="less" scoped>
.sfgInCargo {
  /deep/ .el-input__icon {
    line-height: 28px;
  }
}
</style>
