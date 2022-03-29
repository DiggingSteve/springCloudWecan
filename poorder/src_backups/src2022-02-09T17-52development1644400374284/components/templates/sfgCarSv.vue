<template>
<div class="sfgV">
<div class="detail">

<div class="content kcfw">
<!-- <el-row>
<el-col :span='12'>
<span>服务标题：</span>
<el-input v-model="sfgCarSv.title_thr"></el-input>
</el-col>
<el-col :span='6' :offset='2'>
<span>联系人：</span>
<el-input v-model="sfgCarSv.lxr_thr"></el-input>
</el-col>
</el-row> -->






<el-row class="thd">
<el-col :span="12">
<span>提货地：</span>
<div class="info">
<span>国家</span>
<el-select v-model="sfgCarSv.address_thr.country" placeholder="请选择" @change="getPro(sfgCarSv.address_thr.country)" :country="countryData" ref="ccc">
<el-option
v-for="item in countryData"
:key="item.name"
:label="item.name"
:value="item.name">
</el-option>
</el-select>
<!-- <el-input v-model="country"></el-input> -->
</div>
<div class="info">
<span>省/州/県</span>
<el-select v-model="sfgCarSv.address_thr.pro" placeholder="请选择" @change="getCity(sfgCarSv.address_thr.pro)" :pro="proData" ref="ppp">
<el-option
v-for="item in proData"
:key="item.name"
:label="item.name"
:value="item.name">
</el-option>
</el-select>
<!-- <el-input v-model="pro"></el-input> -->
</div>
<div class="info">
<span>城市/县</span>
<el-select v-model="sfgCarSv.address_thr.city" placeholder="请选择" @change="getAreade(sfgCarSv.address_thr.city)" :city="cityData" ref="cici">
<el-option
v-for="item in cityData"
:key="item.name"
:label="item.name"
:value="item.name">
</el-option>
</el-select>
<!-- <el-input v-model="city"></el-input> -->
</div>
<div class="info">
<span>区/街道</span>
<el-select v-model="sfgCarSv.address_thr.areade" placeholder="请选择" :area="areadeData">
<el-option
v-for="item in areadeData"
:key="item.name"
:label="item.name"
:value="item.name">
</el-option>
</el-select>
<!-- <el-input v-model="areade"></el-input> -->
</div>


</el-col>
<el-col class="xxdz" :span="12" >
<div class="info">
<span>详细地址</span>
<el-input v-model="sfgCarSv.address_thr.addressjson"></el-input>
</div>
</el-col>
<!-- <el-col :span="7" :offset="1" style="margin-left:6.8%">
<span style="width:100px;">要求完成时间：</span>
<el-date-picker

type="date"
value-format="yyyy-MM-dd"
v-model="sfgCarSv.finishdate_thr"
style="width:60%"
>
</el-date-picker>
</el-col> -->
</el-row>









<el-row >

<el-col :span="7" v-if="mdd" >

<span style="margin-top:25px;">目的地：</span>
<span style="margin-right:40px;text-align:center">
入库地区<br>

<el-select v-model="sfgCarSv.yjstorearea_sfg" @change="changeArea(sfgCarSv.yjstorearea_sfg)" style="width:90px;">
<el-option
v-for="item in area"
:key="item"
:label="item"
:value="item"

>
</el-option>
</el-select>

</span>

<span style="text-align:center">
入库仓库<br>

<el-select v-model="sfgCarSv.yjstore_sfg" @change="changeArea(sfgCarSv.yjstore_sfg)" style="width:90px;">
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

<el-col :span="7" style="margin-left:30px;margin-top:20px;">
<span style="width:100px;">要求完成时间：</span>
<el-date-picker

type="date"
value-format="yyyy-MM-dd"
v-model="sfgCarSv.finishdate_thr"
style="width:60%"
>
</el-date-picker>
</el-col>

</el-row>

<el-row style="margin-top:30px;">
<el-col :span="6">
<span>联系人：</span>
<el-input type="input" v-model="sfgCarSv.content_thr"></el-input>
</el-col>
<el-col class="phone" :span="6" :offset="2">
<span>联系电话：</span>
<el-input v-model="sfgCarSv.phone_thr"></el-input>
</el-col>
<el-col :span="6" :offset="2">
<span>提货时间：</span>
<el-date-picker

type="date"
value-format="yyyy-MM-dd"
v-model="sfgCarSv.date_thr">
</el-date-picker>
</el-col>



</el-row>
</div>

</div>
<!-- <el-col :span="6" :offset="2" v-if="mdd">
<span>目的地：</span>
<span>
入库地区<br>
<span >
<el-select v-model="sfgCarSv.yjstorearea_sfg" @change="changeArea(sfgCarSv.yjstorearea_sfg)">
<el-option
v-for="item in area"
:key="item"
:label="item"
:value="item"

>
</el-option>
</el-select>
</span>
</span>

<span>
入库仓库<br>
<span >
<el-select v-model="sfgCarSv.yjstore_sfg" @change="changeArea(sfgCarSv.yjstore_sfg)">
<el-option
v-for="item in storename"
:key="item"
:label="item"
:value="item"

>
</el-option>
</el-select>

</span>
</span>

</el-col> -->
  </div>

</template>

<script>
export default {
  props:['sfgCarSv','mdd'],
data () {
return {

cou:[],
area:[],
countryData:[],
storename:[],
proData:[],
cityData:[],
areadeData:[]
}
},
methods:{
changeArea(value){
var cargoData=this.cargoData
var storenameN=[]

for(var i in cargoData){
if(cargoData[i].area==value){

storenameN.push(cargoData[i].storename)

}
}
this.storename=storenameN

},
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
if(this.sfgCarSv.address_thr.country){
this.getPro(this.sfgCarSv.address_thr.country)
}
if(this.sfgCarSv.address_thr.pro){
this.getCity(this.sfgCarSv.address_thr.pro)
}
if(this.sfgCarSv.address_thr.city){
this.getAreade(this.sfgCarSv.address_thr.city)
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




////console.log(this.mdd)

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

