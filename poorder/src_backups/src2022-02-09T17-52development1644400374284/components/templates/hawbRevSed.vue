<template>
  <div style="padding:20px 30px 20px;" class="clearafter">
    <!-- 发货人 -->
    <div style="float:left;width:48%;height:" class="hawb">
        <div>{{hawbRSinfo[0].title}}
        <!-- <el-input v-model="hawbRSinfo[0].model" style="width:200px;margin-left:20px;"></el-input> -->
        <recsedField :search="hawbRSinfo[0].jsonArr" :hawbInfo="hawbRSinfo" :type="0" :dom="2" :model="hawbRSinfo[0].model" @rsdata="rsdata"></recsedField>

        </div>
        <div style="width:100%;margin-top:15px">
            抬头<br>
            <el-input type="textarea" v-model="hawbRSinfo[0].companytitle_fhr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
        </div>
        <div style="width:100%;margin-top:15px">
            地址<br>
            <el-input type="textarea" v-model="hawbRSinfo[0].address_fhr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
            <div style="width:23%">
                国家二字码<br>
                <el-input v-model="hawbRSinfo[0].companycode_fhr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
            </div>
            <div style="width:23%">
                州名<br>
                <el-input v-model="hawbRSinfo[0].state_fhr_hawb" v-verify="'uppercase'"></el-input>
            </div>
            <div style="width:23%">
                城市<br>
                <el-input v-model="hawbRSinfo[0].city_fhr_hawb" v-verify="'uppercase'" class="input-required"></el-input>
            </div>
            <div style="width:23%">
                邮编<br>
                <el-input v-model="hawbRSinfo[0].postcode_fhr_hawb"></el-input>
            </div>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
             <div style="width:23%">
                联系人<br>
                <el-input v-model="hawbRSinfo[0].lxr_fhr_hawb"></el-input>
            </div>
            <div style="width:23%">
                电话<br>
                <el-input v-model="hawbRSinfo[0].phone_fhr_hawb"></el-input>
            </div>
            <div style="width:23%">
                传真<br>
                <el-input v-model="hawbRSinfo[0].fax_fhr_hawb"></el-input>
            </div>
            <div style="width:23%">
                Email<br>
                <el-input v-model="hawbRSinfo[0].email_fhr_hawb"></el-input>
            </div>
        </div>

    </div>
<!-- 收货人 -->
    <div style="float:left;width:48%;margin-left:3%" class="hawb">

<div>{{hawbRSinfo[1].title}}
<!-- <el-input v-model="hawbRSinfo[1].model" style="width:200px;margin-left:20px;"></el-input> -->
<recsedField :search="hawbRSinfo[1].jsonArr" :hawbInfo="hawbRSinfo" :type='1' :dom="2" :model="hawbRSinfo[1].model" @rsdata="rsdata"></recsedField>

</div>
        <div style="width:100%;margin-top:15px">
            抬头<br>
            <el-input type="textarea" v-model="hawbRSinfo[1].companytitle_shr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
        </div>
        <div style="width:100%;margin-top:15px">
            地址<br>
            <el-input type="textarea" v-model="hawbRSinfo[1].address_shr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
            <div style="width:23%">
                国家二字码<br>
                <el-input v-model="hawbRSinfo[1].companycode_shr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
            </div>
            <div style="width:23%">
                州名<br>
                <el-input v-model="hawbRSinfo[1].state_shr_hawb" v-verify="'uppercase'"></el-input>
            </div>
            <div style="width:23%">
                城市<br>
                <el-input v-model="hawbRSinfo[1].city_shr_hawb" v-verify="'uppercase'"  class="input-required"></el-input>
            </div>
            <div style="width:23%">
                邮编<br>
                <el-input v-model="hawbRSinfo[1].postcode_shr_hawb"></el-input>
            </div>
        </div>

        <div style="width:100%;margin-top:15px;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:atretch;align-content:stretch">
             <div style="width:23%">
                联系人<br>
                <el-input v-model="hawbRSinfo[1].lxr_shr_hawb"></el-input>
            </div>
            <div style="width:23%">
                电话<br>
                <el-input v-model="hawbRSinfo[1].phone_shr_hawb"></el-input>
            </div>
            <div style="width:23%">
                传真<br>
                <el-input v-model="hawbRSinfo[1].fax_shr_hawb"></el-input>
            </div>
            <div style="width:23%">
                Email<br>
                <el-input v-model="hawbRSinfo[1].email_shr_hawb"></el-input>
            </div>
        </div>




    </div>


  </div>


</template>



<script>

import recsedField from './recsedField'

    export default {
        props:['hawbRSinfo'],
        components: {
              recsedField
        },
        data () {
            return {
              hawbRevData:[],
              hawbSenData:[]
            }
        },
        methods: {
rsdata(data){
    this.$emit('rsdataP',data)

}

        }

        ,watch:{

        }
        ,created(){
           //  var hawbReceiver=this.hawbRSinfo[1];//收货人
           // var hawbSeceiver=this.hawbRSinfo[0];//发货人

           //  this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCustomZd',params:hawbReceiver.jsonArr,loading:false,tip:false})
           //  .then(results=>{
           //       //console.log(results.data)
           //    this.hawbSenData=results.data

           //  })
           //  .catch(error=>{

           //  })


           //  this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCustomZd',params:hawbSeceiver.jsonArr,loading:false,tip:false})
           //  .then(results=>{
           //      //console.log(results.data)
           //    this.hawbRevData=results.data

           //  })
           //  .catch(error=>{

           //  })
        }

    }


</script>
<style>
.clearafter:after{content:"";display:block;clear:both;}

.hawb .el-table td, .hawb .el-table th{padding:6px 0;}

</style>
