<template>
  <div class="orderSystem">
    <div class="page-container-box">
      <h2>查询条件</h2>
      <formCompt :input-view-data="inputViewData" @wtdataP="wtdataP"></formCompt>

      <el-button  @click="search" type="primary" style="margin-left:50px;">查询</el-button>
      <el-button  @click="reset" type="primary" style="">重置</el-button>
    </div>

    <el-button type="primary" style="margin: 0 0 20px 50px;">转为分配</el-button>

    <tableCompt :name="name" :table-data-res="tableDataRes"></tableCompt>

  </div>
</template>

<script>
import { reset, filterGroupid } from '../api/localStorage.js'
export default {
  name: "orderSystem",
  data() {
    return {
      name: 'orderSystem.vue',
      inputViewData: [
        {"title":"公司名称：",id:"companyName",type:1,"model":"",width:"50",class:'width100',"whereC":"like","sear":'1',"defaultModel":""},
        {"title":"项目：",id:"wtkhname",type:10,"model":"",width:"50",class:'width100',"whereC":"like","sear":'1',"defaultModel":"",jsonArr:{type:"all",comxz:'1',system:'',area:"",timestamp:"0"}},
        {"title":"始发港：",id:"sfg",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},

        {"title":"目的港：",id:"mdg",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        {"title":"航班号：",id:"hbh",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        {"title":"航班日期：",id:"hbrq",type:7,class:'width100',width:"50","model":"","sear":"1","defaultModel":""},
        {"title":"创建人：",id:"cjr",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},

        {"title":"总运单：",id:"zyd",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        {"title":"分运单号：",id:"fydh",type:1,"model":"","whereC":"like","sear":'1',"defaultModel":""},
        {"title":"订舱编号：",id:"ddbh",type:1,"model":"","whereC":"like","sear":"1","defaultModel":""},
        {"title":"订单来源：",id:"ddly",type:4,"model":[],"whereC":"in","sear":'1',width:'50',options:[],"defaultModel":[],groupid:"131"},

        {"title":"报关类型：",id:"bglx",type:4,"model":[],"whereC":"in","sear":'1',options:[],"defaultModel":[],groupid:"19"},
        {"title":"货物性质：",id:"hwxz",type:4,"model":[],"whereC":"in","sear":'1',options:[],"defaultModel":[],groupid:"5"},
        {"title":"销售地：",id:"xsd",type:4,"model":[],"whereC":"in","sear":'1',options:[],"defaultModel":[],groupid:"130"},
        {"title":"操作地：",id:"czd",type:4,"model":[],"whereC":"in","sear":'1',options:[],"defaultModel":[],groupid:"130"},
      ],
      tableDataRes: []
    }
  },
  methods: {
    search () {

    },
    reset () {
      reset(this.inputViewData)
    },
    wtdataP (data) {
      var inputData = this.inputViewData
      for (var i in inputData) {
        if (inputData[i].type == data.type) {
          if (data.type == 10) {
            this.wtxmid = data.id
          } else if (data.type == 11) {
            this.wtkhid = data.id
          }
          inputData[i].model = data.wtdata
        }
      }
    }
  },
  created () {
    filterGroupid(this.inputViewData)
  },
  watch: {}
}
</script>

<style lang="less" scoped>

</style>
