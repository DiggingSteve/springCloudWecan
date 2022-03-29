<template>
  <div class="hawbTabs">
    <div class="tabs-header">
      <div class="left-title">
        分单信息：
      </div>
      <div class="header-c" :style="{'top': `-${Math.floor(cur_index / 7) * 37}px`}">
        <p
          v-for="(hawb, index) in hawb_list"
          :title="hawb"
          :key="hawb"
          :style="pageTitleStyle[index]"
          :class="{'active': cur_hawb == hawb}"
          @click.self="togglehawb(hawb, index)">
          {{ hawb }}
          <span class="icon-c">
            <span class="icon-close-mask"></span>
            <i @click="removehawb(index)" class="el-icon-close"></i>
          </span>
        </p>
      </div>
      <i class="tabs-right-mask"></i>
      <!-- <el-button class="add-hawb" @click.native="dialogFormVisible = true">添加分单</el-button> -->
      <el-button :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]" @click="show_tabs" icon="el-icon-arrow-down"></el-button>
    </div>
    <div ref="hide_tabs" @blur="tabs_blur" :class="['hide-tabs', {'show': show_all_hawb}]" :style="{'height': `${Math.ceil(hawb_list.length / 7) * 50 + 14}px`}" tabindex="0" >
      <p
        v-for="(hawb, index) in hawb_list"
        :title="hawb"
         :key="hawb"
        :class="{'active': cur_hawb == hawb}"
        @click.self="togglehawb(hawb, index)">
        {{ hawb }}
        <span class="icon-c">
          <span class="icon-close-mask"></span>
          <i @click="removehawb(index)" class="el-icon-close"></i>
        </span>
      </p>
    </div>
    <div class="tabs-content">
      <keep-alive>
          <template v-for="(item,index) in hawbInfo">
              <hawbInfoNew :hawbdata="item" :key="index" v-if="cur_index==index" :ref="item.hawb"></hawbInfoNew>
          </template>
      </keep-alive>



    </div>

<!-- <el-button style="margin-top:15px;" @click="saveHawbDetail">保存分单信息</el-button> -->

<!-- 输入分运单号的弹窗 -->


<el-dialog title="请输入分单号" :visible.sync="dialogFormVisible" append-to-body v-if="dialogFormVisible">
  <el-form>
  <p class="mawbform" style="width:600px"><span>总单件数：{{mawbdetail.ybpiece}}</span><span>总单重量：{{mawbdetail.ybweight}}</span><span>总单体积：{{mawbdetail.ybvolume}}</span><span>总单目的港：{{mawbdetail.mdg}}</span></p>
  <div  class="mawbform">
          <span>分单号：</span>
           <span>分单目的港：</span>
           <span>进仓编号：</span>
          <span>件数：</span>
          <span>重量：</span>
          <span>体积：</span>
          <span></span>
   </div>

  <template v-for="(item,index) in hawbform">
     <div  class="mawbform" v-enterfocus="confirmAddHawb">
          <span><el-input  v-model.trim="item.hawb"></el-input></span>
           <span><el-input  v-model.trim="item.mdg" v-verify="'sfgmdg'"></el-input></span>
            <span><el-input  v-model.trim="item.khjcno"></el-input></span>
          <!-- <span><el-input  v-model.number.trim="item.ybpiece"></el-input></span>
          <span><el-input  v-model.number.trim="item.ybweight"></el-input></span>
          <span><el-input  v-model.number.trim="item.ybvolume"></el-input></span> -->
          <span style="text-indent:10px">{{item.ybpiece}}</span>
          <span style="text-indent:10px">{{item.ybweight}}</span>
          <span style="text-indent:10px">{{item.ybvolume}}</span>

          <span><i @click="hawbformDel(index)" style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;" :style="{color:index!=0?'red':'#67C23A'}" :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"></i></span>
   </div>
  </template>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addhawb">确 定</el-button>
  </div>
</el-dialog>
<!-- end -->


  </div>
</template>

<script>
import hawbInfoNew from "./hawbInfoNew"
import { setTabTitleStyle } from "@/api/localStorage"

export default {
  props: {
     mawbdetail:Object
  },
  components:{hawbInfoNew},
  data () {
    return {
      hawb_list: [],
      cur_index: 0,
      show_all_hawb: false,
      hawb_data_list: {},
      guidHawbGroup:Array,//查询的分单数据
      hawbInfo:[],//存放分单数据
      dialogFormVisible:false, //添加分单弹窗
      hawbform: [ //第一个分单的件重体应该默认全部件重体
        {
          hawb:"",
          mdg:"",
          khjcno:"",
          ybpiece:"",
          ybweight:"",
          ybvolume:""
         }
      ]
    }
  },

  methods: {
    fetch_hawb_data (hawb = {}) {

     var obj= {
            "hawb":"",
            "sfg":"",
            "mdg":"",
            "ybpiece":0,
            "ybweight":0,
            "ybvolume":0,
            "smallpiece":0,
            "hwxz":"",
            "hwlx":"",
            "batterymodel":"",
            "chinesepm":"",
            "englishpm":"",
            "isinwageallin":-1,
            "inwageallinprice":0,
            "currency":"",
            "companytitle_fhr_hawb":"",
            "address_fhr_hawb":"",
            "companycode_fhr_hawb":"",
            "state_fhr_hawb":"",
            "city_fhr_hawb":"",
            "postcode_fhr_hawb":"",
            "lxr_fhr_hawb":"",
            "phone_fhr_hawb":"",
            "fax_fhr_hawb":"",
            "email_fhr_hawb":"",
            'taxcode_fhr_hawb':"",
            "companytitle_shr_hawb":"",
            "address_shr_hawb":"",
            "companycode_shr_hawb":"",
            "state_shr_hawb":"",
            "city_shr_hawb":"",
            "postcode_shr_hawb":"",
            "lxr_shr_hawb":"",
            "phone_shr_hawb":"",
            "fax_shr_hawb":"",
            "email_shr_hawb":"",
            'taxcode_shr_hawb':""
       }
      obj.hwxz= hawb.hwxz || this.mawbdetail.hwxz
      obj.hwlx= hawb.hwlx || this.mawbdetail.hwlx
      obj.batterymodel= hawb.batterymodel || this.mawbdetail.batterymodel
      obj.sfg= hawb.sfg || this.mawbdetail.sfg
      obj.mdg= hawb.mdg || this.mawbdetail.mdg
      obj.gid= hawb.gid || this.mawbdetail.gid
      obj.area= hawb.area || this.mawbdetail.area
      if(this.$store.state.areaState=='市场部'||this.$store.state.areaState=='海外部'){
        obj.tradeterm='FOB'
      }
       return   obj;
    },
    show_tabs () {
      if (!this.hidden_times) {
        this.show_all_hawb = !this.show_all_hawb
        this.$refs.hide_tabs.focus()
      }
    },
    tabs_blur () {
      this.show_all_hawb = false
      this.hidden_times = true
      setTimeout(() => {
        this.hidden_times = false
      }, 200)
    },
    addhawb () {//从点击"新增分单”添加分单

        for(var i in this.hawbform){

                  var hwabDetail=Object.assign({},this.fetch_hawb_data(this.hawbform[i]),this.hawbform[i])
                   this.hawb_list .push(this.hawbform[i].hawb)
                   this.$set(this.hawbInfo,this.hawb_list.length-1,hwabDetail)
        }

  this.dialogFormVisible=false;

  this.hawbform=[
        {
         hawb:"",
          mdg:"",
          khjcno:"",
          ybpiece:"",
          ybweight:"",
          ybvolume:""
         }
      ]

    },
    addHawbFromMawb(hawbinfo,setHawb){//从总单新增分单
          if(this.hawb_list.includes(setHawb)){//存在是修改，否则是新增
                  var index=this.hawb_list.indexOf(setHawb)
                  this.hawb_list[index]=hawbinfo.hawb
                 this.$set(this.hawbInfo,index,Object.assign({},this.hawbInfo[index],hawbinfo))
          }else{
                  var hwabDetail=Object.assign({},this.fetch_hawb_data(hawbinfo),hawbinfo)

                  this.hawb_list.push(hawbinfo.hawb)
                  this.$set(this.hawbInfo,this.hawb_list.length-1,hwabDetail)
          }
    },
    clearHawb() {
      this.hawb_list = []
      this.hawbInfo = []
    },
    togglehawb (hawb, index) {
      this.cur_index = index
    },
    removehawb (index) { //删除当前分单号

      this.$parent.delHawbFromHawb(this.hawb_list[index])
      this.hawb_list.splice(index, 1);
      this.hawbInfo.splice(index, 1);
      this.cur_index =0
    },
    delHawbFromMawb(hawb){
       var index=this.hawb_list.indexOf(hawb);
      this.hawb_list.splice(index, 1);
      this.hawbInfo.splice(index, 1);
    //  alert(index)
      this.cur_index =0
    },
    confirmAddHawb(){ //新增表单分单
      // //console.log(111111111)

        let cur_piece=this.mawbdetail.ybpiece
        let cur_weight=this.mawbdetail.ybweight
        let cur_volume=this.mawbdetail.ybvolume

   this.hawbform.forEach((item)=>{
     cur_piece=(cur_piece-item.ybpiece).toFixed()>=0?(cur_piece-item.ybpiece).toFixed():0
     cur_weight=(cur_weight-item.ybweight).toFixed()>=0?(cur_weight-item.ybweight).toFixed():0
     cur_volume=(cur_volume-item.ybvolume).toFixed(2)>=0?(cur_volume-item.ybvolume).toFixed(2):0
   })


       this.hawbform.push({
          hawb:"",
          mdg:"",
          khjcno:"",
          ybpiece:cur_piece,
          ybweight:cur_weight,
          ybvolume:cur_volume

         })
    },
    hawbformDel(index){ //删除表单分单
    //  alert(index)
    if(index==0){
      this.confirmAddHawb()
    }else{
          this.hawbform.splice(index,1)
    }

    }

        ,saveHawbDetail(index){
       let json=this.hawbInfo[index]
          // var newJson=Object.assign({},json,json.hawbRSinfo[0],json.hawbRSinfo[1]);//获取新修改的对象合并到原来对象中
          var newJson=JSON.parse(JSON.stringify(json))
          delete newJson.hawbRSinfo
          delete newJson.jsonArr
          return newJson;
    }
    ,getAllhawbinfo(){
      var hawbList=[]
       for(let i in this.hawb_list){
           hawbList.push(this.saveHawbDetail(i))
       }
       return hawbList
    },checkHasLimit(){
      for(let i in this.hawb_list){
        let hawb=this.$refs[this.hawb_list[i]]
        // console.log(hawb&&hawb[0]&&hawb[0].checkHasLimit())
       if(hawb&&hawb[0]&&hawb[0].checkHasLimit()){
          return this.hawb_list[i]
       }
      }
    }



  }

  ,computed: {
    'cur_hawb' () {
      return this.hawb_list[this.cur_index]
    }
     ,
      pageTitleStyle() {
        return setTabTitleStyle(this.hawb_list, this.cur_index)
      }

  },
  watch: {
    'cur_index' (newVal) {
      // fetch data
      if (this.hawb_data_list[this.cur_hawb]) return  // 数据已存在则不再去获取

      this.$set(this.hawb_data_list, this.cur_hawb, this.fetch_hawb_data())
    },
    "mawbdetail":{
      handler(val){
        this.hawbInfo.forEach(i=>{
          if (!i.hwxz) {
            this.$set(i,"hwxz",val.hwxz)
          }
          if (!i.hwlx) {
            this.$set(i,"hwlx",val.hwlx)
          }
          if (!i.batterymodel) {
            this.$set(i,"batterymodel",val.batterymodel)
          }
          // this.$set(i,"sfg",val.sfg)
          this.$set(i,"gid",val.gid)

        })
      },
      deep:true
    }
  },
    mounted () {
      setTimeout(() => {
          this.hawbform[0].ybpiece=this.mawbdetail.ybpiece
          this.hawbform[0].ybweight=this.mawbdetail.ybweight
          this.hawbform[0].ybvolume=this.mawbdetail.ybvolume
      }, 0);
  },
  created(){

  }
}
</script>

<style lang="less" scoped>
.mawbform{
  width:800px;
   justify-content:flex-start;
   display:flex;
   margin-top:10px;
   span{
     margin-right: 20px;
    flex:1;
   }
}
@tabs-p: {
  position: relative;
  float: left;
  width: 150px;
    text-overflow:ellipsis;
  overflow: hidden;
  line-height: 36px;
  text-align: left;
  text-indent: 12px;
  color: #999;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  &.active {
    color: #0f5a8c;
    background: #fff;
    border-right:1px solid #e8e8e8;
    border-bottom: 1px solid #fff;
  }
  .icon-c {
    position: absolute;
    display: block;
    top: 11px;
    right: 8px;
    width: 12px;
    height: 12px;
    z-index: 1;
    &:hover {
      i {
        visibility: visible;
      }
      span {
        visibility: hidden;
      }
    }
    i {
      position: absolute;
      top: 1px;
      left: 1px;
      text-indent: 0;
      width: 12px;
      height: 12px;
      visibility: hidden;
      &:before {
        position: absolute;
        top: 0;
        font-size: 12px;
      }
    }
    span {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 12px;
      height: 12px;
      background: #e8e8e8;
      border-radius: 50%;
    }
  }
};

.hawbTabs {
  position: relative;
  width: 100%;
  .tabs-header {
    position: relative;
    z-index: 500;
    width: 100%;
    height: 37px;
    overflow: hidden;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    border-bottom: 0px;
    .left-title {
      height: 36px;
      line-height: 36px;
      padding-left: 12px;
      font-size: 14px;
      color: #0f5a8c;
      font-weight: bolder;
      border-bottom: 1px solid #e8e8e8;
    }
    .header-c {
      position: absolute;
      padding: 0 140px 0 0;
      transition: top .5s;
      left: 100px;
      p {
        @tabs-p();
        border-top: 0;
       // border-right: 0;
      }
    }
    .add-hawb,
    .expansion-hawb {
      position: absolute;
      top: 4px;
      padding: 0;
      height: 28px;
      color: #0f5a8c;
    }
    .add-hawb {
      right: 36px;
      width: 80px;
    }
    .expansion-hawb {
      right: 4px;
      width: 28px;
      /deep/ .el-icon-arrow-down {
        transition: all .5s;
      }
    }
    .icon-rotate {
      /deep/ .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
    .tabs-right-mask {
      position: absolute;
      top: 0;
      right: 130px;
      width: 44px;
      height: 36px;
      background:url('../../../boStatic/images/mask.png') no-repeat 0 0;
    }
  }
  .hide-tabs {
    position: absolute;
    overflow: hidden;
    z-index: 400;
    border: 1px solid #e8e8e8;
    top: 36px;
    left: 101px;
    right: 5px;
    background: #fff;
    padding: 12px 12px 0;
    transition: all .5s;
    p {
      @tabs-p();
      margin-right: 12px;
      margin-bottom: 12px;
    }
    p.active {
      border-color: #0f5a8c;
    }
  }
  .hide-tabs:not(.show) {
    height: 0px !important;
    top: 0px;
  }
  .tabs-content {
    border: 1px solid #e8e8e8;
    border-top: 0px;
    padding: 12px;
  }
}
</style>
