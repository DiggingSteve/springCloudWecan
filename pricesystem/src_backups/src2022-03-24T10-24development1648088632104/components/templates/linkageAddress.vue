<template>
  <div class="sfgV">
 <div class="detail">


        <div class="content kcfw">
          <el-row class="thd">
            <el-col :span="12">
              <span class="input-title">提货地：</span>
              <div class="info">
                <span v-if="addresstype==2" >国家</span>
                <el-input v-model="address.address_thr.country" placeholder="国家" v-if="addresstype==1"  ></el-input>
                <el-select v-if="addresstype==2" v-model="address.address_thr.country" placeholder="请选择"   @change="getPro(address.address_thr.country)" :country="countryData" ref="ccc">
       <el-option
                                          v-for="item in countryData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>
               <!--  <el-input  v-model="country"></el-input> -->
              </div>
              <div class="info">
                <span v-if="addresstype==2" >省/州/県</span>
                <el-input v-model="address.address_thr.pro"  placeholder="省/州/県" v-if="addresstype==1"  ></el-input>

                 <el-select v-if="addresstype==2" v-model="address.address_thr.pro" placeholder="请选择"   @change="getCity(address.address_thr.pro)" :pro="proData" ref="ppp">
       <el-option
                                          v-for="item in proData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>
              </div>
              <div class="info">
                <span v-if="addresstype==2" >城市/县</span>
                <el-input v-model="address.address_thr.city"  placeholder="城市/县" v-if="addresstype==1"  ></el-input>

                  <el-select  v-if="addresstype==2" v-model="address.address_thr.city" placeholder="请选择"   @change="getAreade(address.address_thr.city)" :city="cityData" ref="cici">
       <el-option
                                          v-for="item in cityData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>
              </div>
              <div class="info">
                <span v-if="addresstype==2" >区/街道</span>
                <el-input v-model="address.address_thr.areade"  placeholder="区/街道" v-if="addresstype==1"  ></el-input>

                 <el-select v-if="addresstype==2" v-model="address.address_thr.areade" placeholder="请选择"  :area="areadeData">
       <el-option
                                          v-for="item in areadeData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.name">
                                        </el-option>
     </el-select>
              </div>


            </el-col>
                   <el-col class="xxdz" :span="12" >
              <div class="info" style="position: relative;left: -48px;">
                <span v-if="addresstype==2">详细地址</span>
                <el-input  v-model="address.address_thr.addressjson" placeholder="详细地址" style="width:300px"></el-input>
              </div>
            </el-col>
          </el-row>


        </div>

    </div>

	</div>


</template>

<script>
export default {
	props:{
    address:{
      type:Object,
      default(){
       return {address_str:"",address_thr:{"country":'','pro':'','city':'','areade':'','addressjson':''}}
      }

    }
    ,addresstype:{ //类型 1默认输入框 2是三级selece
      type:Number,
      default:1

    }
  },
  data () {
    return {

      cou:[],
      area:[],
      countryData:[],
      proData:[],
      cityData:[],
      areadeData:[]

    }
  },
  methods:{

   getPro(value){
   //console.log(value)
    var country=this.$refs.ccc.$attrs.country
    var id=""
    for(var i in country){
       if(country[i].name===value){
        id=country[i].id
       }
    }
//console.log(this.cou)
 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.proData.push(this.cou[j])
    }

   }
//console.log(this.proData)
 },
      getCity(value){
     var pro=this.$refs.ppp.$attrs.pro
    var id=""
    for(var i in pro){
       if(pro[i].name==value){
        id=pro[i].id
       }
    }

 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.cityData.push(this.cou[j])
    }

   }
   },
         getAreade(value){
      var city=this.$refs.cici.$attrs.city
    var id=""
    for(var i in city){
       if(city[i].name==value){
        id=city[i].id
       }
    }

 for(var j in this.cou){
    if(this.cou[j].parentid==id){
      this.areadeData.push(this.cou[j])
    }

   }
   },

  getSelectD(){
     for(var i in this.cou){
    if(this.cou[i].parentid==0){
      this.countryData.push(this.cou[i])
    }
  }
    if(this.address.address_thr.country){
      this.getPro(this.address.address_thr.country)
   }
   if(this.address.address_thr.pro){
      this.getCity(this.address.address_thr.pro)
   }
   if(this.address.address_thr.city){
     this.getAreade(this.address.address_thr.city)
   }
  }

  },
  computed:{

  },
  created(){

  if(!localStorage.getItem('address')){
    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCityName',params:"",loading:false,tip:false})
  .then(results=>{
   // //console.log(results.data)
    localStorage.setItem('address',JSON.stringify(results.data))
   this.cou=results.data
  this.$nextTick(function(){
    this.getSelectD()
 // //console.log(this.countryData)
 })
  })
  .catch(error=>{

  })
}else{
  this.cou=JSON.parse(localStorage.getItem('address'))
   this.$nextTick(function(){
this.getSelectD()

 })
}



    var data=JSON.parse(localStorage.cargoData)
  for(var j in data){
        if(this.area.indexOf(data[j].area)==-1){
      this.area.push(data[j].area)
    }


  }











  }
  ,watch:{
    "address.address_thr":{
        handler(){

         let str=""
        Object.keys(this.address.address_thr).forEach((i,v) => {
          if(!this.address.address_thr[i]) return;
          str+=this.address.address_thr[i]
        });
        this.address.address_str=str;
        },
        deep:true
    }

  }
}
</script>

<style lang="less" scoped>
.sfgV {
  width: 100%;
  .detail {
    .title {
      background:#ffcc66;
      color:#fff;
      padding:5px 5px 5px 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .content {
      margin: 10px 15px;
      span {
        width: 110px;
        + div {
          width: 200px;
        }
      }
    }
    .kcfw {
      .el-row {
        margin-bottom: 0px;
      }
      span {
        display: inline-block;
        width: 80px;
        vertical-align: top;
        text-align: right;
        + div {
          width: 70%;
        }
      }
      .phone {
        margin-bottom: 15px;
      }
      /deep/ .el-input__icon {
        line-height: 28px;
      }
      .thd {
        span {
          vertical-align: text-bottom;
        }
        .info {
          display: inline-block;
          width: 90px;
          margin-right: 23px;
          span {
            text-align: left;
            + div {
              width: 100%;
            }
          }
          .el-input {
            width: 100%;
          }
        }
        .rkdq {
          width: 130px;
        }
        .rkck {
          width: 200px;
        }
      }
      .xxdz .info {

        span {
          display: block;
          text-align: left;
          + .el-input {
            width: 494px;
          }
        }
      }
    }
  }
}
</style>
