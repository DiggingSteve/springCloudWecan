<template>

<div id="mapR">

  <baidu-map class="map" :center="center" :scroll-wheel-zoom="true" :zoom="zoom" :map-click="false" @ready="handle" ref="bmap" ak="uRsmOKwXNAoVczCn5bH0kTD3W79kcftS">


 <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" :icon="{url: require('../static/images/mapIcon.png'),size:{width: 10, height: 10}}">
 </bm-marker>

  <bm-circle :center="{lng: center.lng, lat: center.lat}" :radius='260' stroke-color="#B2D8FC" :stroke-opacity="1" :stroke-weight="3" ></bm-circle>

<Selfoverlay
      :position="{lng: center.lng,lat: center.lat}"
      :text="center.name+'仓库<br>地址:'+center.add">
</Selfoverlay>

<!-- 地区自动填充 -->
<bm-auto-complete v-model="keyword" :sugStyle="{'zIndex':'9999'}" @confirm="localSearch=true" v-if="areaInfo.name!='空出送货(JAJ仓库)仓库'&&areaInfo.name!='空出送货(Rider仓库)'">
 <el-input placeholder="请输入出发地查询路线" v-model="keyword" style="width:240px;position:absolute;top:10px;left:10px;" @input="initResult"></el-input>
</bm-auto-complete>

<!-- 地区搜索选择列表 -->
<bm-local-search :keyword="keyword"  class="localSearch" v-if="localSearch&&areaInfo.name!='空出送货(JAJ仓库)仓库'&&areaInfo.name!='空出送货(Rider仓库)'" @searchcomplete="results" :panel="false"></bm-local-search>

  <div id="results" v-if="regionArr.length>0">
   <p v-for="item in regionArr" @click="selectArea(item.point)">

   <i class="el-icon-location" style="float:left;margin-right:10px;font-size:18px;line-height:32px;"></i>
   <span style="float:left">
   <span class="colorBlue">{{item.title}}</span><br>
   {{item.address}}
   </span>
   </p>
  </div>

<!-- 行驶路线 -->
 <bm-driving
      :start="{lng:resultSelect.lng, lat: resultSelect.lat}"
      :end="{lng: center.lng, lat: center.lat}"
      :auto-viewport="true"
      id="drive"
      v-if="resultSelect.lng&&areaInfo.name!='空出送货(JAJ仓库)仓库'&&areaInfo.name!='空出送货(Rider仓库)'"
    ></bm-driving>

  </baidu-map>
  </div>
</template>
<script>

import {BaiduMap,BmMarker,BmCircle,BmDriving,BmAutoComplete,BmLocalSearch} from 'vue-baidu-map'
// import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
// import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
// import BmCircle from 'vue-baidu-map/components/overlays/Circle.vue'
import Selfoverlay from './Selfoverlay.vue'
// import BmDriving from 'vue-baidu-map/components/search/Driving.vue'
// import BmAutoComplete from 'vue-baidu-map/components/others/AutoComplete.vue'
// import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'


export default {
  name:'BDmap',
  props:{
    areaInfo:{
      type:Object
    }

  },
    components: {
     BaiduMap,BmMarker,BmCircle,Selfoverlay,BmDriving,BmAutoComplete,BmLocalSearch
  },

   data(){
     return {
      center:{lat:0,lng:0,add:'',name:''},
      zoom:16,
      resultSelect:{lat:'',lng:''},
      keyword:'',
      //searchArea:false,
      localSearch:false,
      complete:false,
      regionArr:[],
      map:null,
     }
   }
   ,methods:{
   //改变始发地 
   initResult(){

     this.resultSelect={lat:'',lng:''}
     this.regionArr=[]


   },
  //检索出所有始发地
  results(results){
  console.log(results)
   var mark=0
   if(results&&results.Hr.length>0&&this.keyword!=''){

$('.tangram-suggestion-main').each(function(){
      if($(this).is(":visible")){
        mark+=1
      }
    })

    if(mark==0){
      this.regionArr=JSON.parse(JSON.stringify(results.Hr))
    }else{
     this.regionArr=[]
   }

    
   console.log(mark)
 }else{

  this.regionArr=[]
  this.resultSelect={lat:'',lng:''}
}

},
  //选择始发地
  selectArea(data){
    this.resultSelect.lat=data.lat
    this.resultSelect.lng=data.lng
    this.regionArr=[]
  },
  handle({BMap, map}){

  this.center.lat=this.areaInfo.lat
  this.center.lng=this.areaInfo.lng
  this.center.name=this.areaInfo.name
  this.center.add=this.areaInfo.add
  this.zoom=this.zoom


  }


}
    ,
    watch: {
     areaInfo:{
      handler(val){
      this.center.lat=val.lat
      this.center.lng=val.lng
      this.center.name=val.name
      this.center.add=val.add
      this.zoom=this.zoom
    },
    //immediate:true,
    deep:true
  },

  'resultSelect.lng'(val){
    if(val!=''){
      setTimeout(()=>{
        if($('#drive .navtrans-table tr').eq(0).html()){
          $('#drive .navtrans-table tr').each(function(){
            $(this).removeAttr('onclick')
          })
        }
      },500)
        
      }
    }
    },
    mounted(){
    //this.map=new BMap.Map(this.$refs.bmap)
    }
     
}
</script>
<style scoped lang="less">

// /deep/#mapR{
//   img{
//      max-width:none!important;
//      max-height:none!important;
//   }
 
// }
.map{
width:100%;
height:500px;
position:relative;


}
/deep/.anchorBL{
  display:none;
}
.localSearch{
  position:absolute;
  top:40px;
  left:10px;
  /deep/a[title='到百度地图查看更多结果']{
    display:none;
  }
}
#results{
  position:absolute;
  top:40px;
  left:10px;
  background:#fff;
  max-height:400px;
  overflow-y:auto;
  p{
    height:50px;
    border-bottom:1px solid #f8f8f8;
    font-size:13px;
    padding:5px;
    letter-spacing:0.1em;
    cursor:pointer;
    .colorBlue{
     color:#116cf3;
    }
    i{
      color:#F54336;
    }
    &:hover{
      i{
      color:#116cf3;
    }
    }
  }

}
#drive{
  position:absolute;
  top:40px;
  left:10px;
  height:380px;
  overflow-y:auto;
  min-width:240px;
  //max-width:240px;
  //width:240px;
  /deep/a{
    display:none
  }
}


</style>


