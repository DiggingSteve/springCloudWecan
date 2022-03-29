<template>
  <div class="sfgV">
 <div class="detail">


        <div class="content kcfw">
          <!-- <el-row>
            <el-col :span='12'>
              <span>服务标题：</span>
              <el-input v-model="mdgCarSv.title_mdg_shr"></el-input>
            </el-col>
            <el-col :span='6' :offset='2'>
              <span>联系人：</span>
              <el-input  v-model="mdgCarSv.lxr_mdg_shr"></el-input>
            </el-col>
          </el-row> -->


          <el-row class="thd">
            <el-col :span="12">
              <span>提货地：</span>
              <div class="info">
                <span>国家</span>
                <el-select v-model="mdgCarSv.address_mdg_shr.country" placeholder="请选择"  value-key="name" >
       <el-option
                                          v-for="item in countryData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item">
                                        </el-option>
     </el-select>
               <!--  <el-input  v-model="country"></el-input> -->
              </div>
              <div class="info">
                <span>省/州/県</span>
                 <el-select v-model="mdgCarSv.address_mdg_shr.pro" placeholder="请选择"  value-key="name" >
       <el-option
                                          v-for="item in proData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item">
                                        </el-option>
     </el-select>
                <!-- <el-input  v-model="pro"></el-input> -->
              </div>
              <div class="info">
                <span>城市/县</span>
                  <el-select v-model="mdgCarSv.address_mdg_shr.city" placeholder="请选择"  value-key="name" >
       <el-option
                                          v-for="item in cityData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item">
                                        </el-option>
     </el-select>
                <!-- <el-input  v-model="city"></el-input> -->
              </div>
              <div class="info">
                <span>区/街道</span>
                 <el-select v-model="mdgCarSv.address_mdg_shr.areade" placeholder="请选择"  value-key="name" >
       <el-option
                                          v-for="item in areadeData"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item">
                                        </el-option>
     </el-select>
                <!-- <el-input  v-model="areade"></el-input> -->
              </div>
            </el-col>
            <el-col :span="10" >
                   <el-col class="xxdz" :span="12">
              <div class="info">
                <span>详细地址</span>
                <el-input  v-model="mdgCarSv.address_mdg_shr.addressjson"></el-input>
              </div>
            </el-col>
            </el-col>
          </el-row>



          <el-row style="margin-top:30px;">
            <el-col :span="6">
              <span>联系人：</span>
              <el-input type="input"  v-model="mdgCarSv.content_mdg_shr"></el-input>
            </el-col>
            <el-col class="phone" :span="6" :offset="2">
              <span>联系电话：</span>
              <el-input  v-model="mdgCarSv.phone_mdg_shr"></el-input>
            </el-col>
            <el-col :span="7" :offset="1" style="margin-left:7%">
              <span style="width:100px">要求完成日期：</span>
              <el-date-picker

                type="date"
                 value-format="yyyy-MM-dd"
                v-model="mdgCarSv.finishdate_mdg_shr"
                style="width:60%">
              </el-date-picker >
            </el-col>
          </el-row>



        </div>

    </div>
	</div>


</template>

<script>
export default {
	props:['mdgCarSv'],
  data () {
    return {
      // country:{"name":"","id":"","parentid":""},
      // pro:{"name":"","id":"","parentid":""},
      // city:{"name":"","id":"","parentid":""},
      // areade:{"name":"","id":"","parentid":""},
      cou:[]
    }
  },
  methods:{
  // countryC(value){
  // 	this.sfgCarSv.thd.country=value
  // },
  //  proC(value){
  // 	this.sfgCarSv.thd.country=value
  // },
  // cityC(value){
  // 	this.sfgCarSv.thd.city=value
  // },
  // areadeC(value){
  // 	this.sfgCarSv.thd.areade=value
  // }
  },
  computed:{
countryData(){
  var c=[]
  for(var i in this.cou){
    if(this.cou[i].parentid==0){
      c.push(this.cou[i])
    }
  }
  return c
},
proData(){
var ci=[]

  for(var j in this.cou){
    if(this.cou[j].parentid==this.mdgCarSv.address_mdg_shr.country['id']){
      ci.push(this.cou[j])
    }
  }
  return ci
},
cityData(){
var ci=[]

  for(var j in this.cou){
    if(this.cou[j].parentid==this.mdgCarSv.address_mdg_shr.pro['id']){
      ci.push(this.cou[j])
    }
  }
  return ci
},

areadeData(){
var ci=[]

  for(var j in this.cou){
    if(this.cou[j].parentid==this.mdgCarSv.address_mdg_shr.city['id']){
      ci.push(this.cou[j])
    }
  }
  return ci
}

  },
  created(){

  if(!localStorage.getItem('address')){
    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCityName',params:"",loading:false,tip:false})
  .then(results=>{
   // //console.log(results.data)
    localStorage.setItem('address',JSON.stringify(results.data))
   this.cou=results.data
   // for(var i in this.cou){
   //   if(this.cou[i].name==this.sfgCarSv.thd.country){
   //     this.country=this.cou[i]
   //   }else if(this.cou[i].name==this.sfgCarSv.thd.pro){
   //     this.pro=this.cou[i]
   //   }else if(this.cou[i].name==this.sfgCarSv.thd.city){
   //     this.city=this.cou[i]
   //   }else if(this.cou[i].name==this.sfgCarSv.thd.areade){
   //     this.areade=this.cou[i]
   //   }
   // }
  })
  .catch(error=>{

  })
}else{
  this.cou=JSON.parse(localStorage.getItem('address'))
}




  // if(this.sfgCarSv.thd.country){
  // 	this.country.name=this.sfgCarSv.thd.country
  // }
  // if(this.sfgCarSv.thd.pro){
  // 	 this.pro.name=this.sfgCarSv.thd.pro
  // }
  // if(this.sfgCarSv.thd.city){
  // 	this.city.name=this.sfgCarSv.thd.city
  // }
  // if(this.sfgCarSv.thd.areade){
  // 	this.areade.name=this.sfgCarSv.thd.areade
  // }
  // this.country.name=this.sfgCarSv.thd.country
  // this.pro.name=this.sfgCarSv.thd.pro
  // this.city.name=this.sfgCarSv.thd.city
  // this.areade.name=this.sfgCarSv.thd.areade


  }
}
</script>

<style lang="less" scoped>
.sfgV {
  width: 100%;
  .detail {

    margin-bottom:20px;
    .title {
      background:#ffcc66;
      color:#fff;
      padding:5px 5px 5px 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .content {
      margin: 15px;
      span {
        width: 110px;
        + div {
          width: 200px;
        }
      }
    }
    .kcfw {
      .el-row {
        margin-bottom: 16px;
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
