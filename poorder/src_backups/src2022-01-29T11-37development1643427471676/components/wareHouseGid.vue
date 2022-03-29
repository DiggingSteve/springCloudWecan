<template>
  <div>

    <div class="page-container-box">
      <!-- {{nodeViewData}} -->
      <newFormCmpt :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pagetype="1" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere"
        :formFieldConfig="false">
      </newFormCmpt>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="dialogShow=true;inputViewData.area.hidden=false;pageshow=true">维护</el-button>
      </div>
    </div>

    <tableCompt name="wareHouseGid.vue" :table-data-res="tableDataRes" :nestedTableType="2"
      v-on:transmitMsg="getZimessage" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
      >
    <!--   <template slot="operate" slot-scope="props">
        <i class="el-icon-setting" title="修改" @click="openDialog(props.data.index)"></i>
        <i class="el-icon-delete" title="删除" @click="nodeFunc(props.data.index)"></i>
      </template>
      <template slot="fun" slot-scope="props">
        {{getVal(1339,props.data.value)}}
      </template>
      <template slot="startdate" slot-scope="props">
        {{getVal(1361,props.data.value)}}
      </template>
      <template slot="ctrlname" slot-scope="props">
        {{getArea(props.data.row.area)}}-{{getSystem(props.data.row.system)}}-{{props.data.value}}
      </template>
      <template slot="area" slot-scope="props">
        {{getArea(props.data.value)}}
      </template>
      <template slot="system" slot-scope="props">
        {{getSystem(props.data.value)}}
      </template>
      <template slot="logname" slot-scope="props">
        {{getVal(1360,props.data.value)}}
      </template>
      <template slot="approverstatus" slot-scope="props">
        {{props.data.value==1?'有效':'无效'}}
      </template> -->
    </tableCompt>

     <el-dialog
      title="仓库维护"
      :visible.sync="dialogShow"
      width="100%"
      top="0"
      v-if="dialogShow"
      :close-on-press-escape="false"
      class="dialogPage"
      @close="wareHouseList=[];searchData={};inputModelData={};inputViewData.area.hidden=true"
      :modal="false"
      center>

     <div style="margin-bottom:30px;"  v-if="dialogShow">
     <newFormCmpt :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pagetype="1" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere"
        :formFieldConfig="false" :whereTmpShow="false">
      </newFormCmpt>

      <div class="searchForm" style="margin-top:18px;">
        <el-button @click="searchWeihu">查询</el-button>
        <el-button>重置</el-button>
      </div>
    </div>

      <div class="grid" v-if="wareHouseList">
        <div v-for="(i,wareIndex) in wareHouseList" class="noDefault" v-if="i.storename!='默认仓库'">
          <h4>
            {{i.storename}}
            <el-button v-if="i.isdefault=='1'" type="warning" style="height:28px;float:right;" @click="bindDefault('2',i,wareIndex)">取消设为默认仓库</el-button>
            <el-button v-if="i.isdefault!='1'" type="primary" style="height:28px;float:right;" @click="bindDefault('1',i,wareIndex)">设为默认仓库</el-button>
          </h4>
          <div class="wrap">
        
          <div class='head'>
               <el-checkbox  v-model="i.checked" @change="handleCheckAllChange($event,i.storename)">全选</el-checkbox>
               <el-input placeholder="筛选内容"  prefix-icon="el-icon-search"  v-model="i.filter" style="float:right;width:120px;margin-top:-2px;" @input="changeFilter($event,i.storename)"></el-input>
          </div>
          <div class="wtkhCheck">
            <ul>
             <el-checkbox-group v-model="checkedWtkh[i.storename]" @change="handleCheckedWtkhChange($event,i.storename)">
                        <li v-for="(item,index) in showList[i.storename]" :style="{background:checkedWtkh[i.storename].includes(item.gid)?'#FFFCF0':''}">
                          <el-checkbox :label="item.gid">{{item.wtkhname}}</el-checkbox>
                        </li>
            </el-checkbox-group>
            </ul>
          </div>
          <div class='bottom'>
            已选{{checkedWtkh[i.storename].length}}项

            <el-pagination
            small
            @current-change="handleCurrentChange($event,i.storename)"
            :current-page.sync="i.currentPage"
            :page-size="20"
            :pager-count="5"
            layout="prev, pager, next"
            :total="i.children.filter(item=>item.wtkhname.indexOf(i.filter)!='-1').length"
            style="display:inline-block;vertical-align:sub;height:28px;width:200px;"
            >
            </el-pagination>

            <el-popover placement="right" trigger="click" width="150" popper-class="removeTo">
            <ul>
            <li v-for="store in Object.keys(checkedWtkh)" v-if="store!='默认仓库'" @click="moveToWare(i,store)" :class="store==i.storename?'disabled':''">{{store}} <i class="el-icon-arrow-right"></i></li>
             <li  @click="moveToWare(i,'未分配仓库')">未分配仓库<i class="el-icon-arrow-right"></i></li>
            </ul>
            <el-button slot="reference" type="primary" style="height:28px;float:right;margin-top:2px;width:78px;padding:8px 4px">移动到 <i class="el-icon-arrow-right"></i></el-button>

            </el-popover>
          </div>
          </div>
      </div>
      </div>
      <!-- 竖线 -->
      <div style="width:1px;height:652px;display:inline-block;vertical-align:bottom;margin-left:26px;margin-right:26px;background:#e8e8e8" v-if="wareHouseList.length"></div>
      <!-- 默认 -->
      <div class="default" v-if="wareHouseList.length">
      <h4>
            未分配(默认仓库)
          </h4>
        <div class="wrap"  v-for="(i,wareIndex) in wareHouseList"  v-if="i.storename=='默认仓库'">
          
          <div class='head'>
               <el-checkbox  v-model="i.checked" @change="handleCheckAllChange($event,i.storename)">全选</el-checkbox>
               <el-input placeholder="筛选内容"  prefix-icon="el-icon-search"  v-model="i.filter" style="float:right;width:120px;margin-top:-2px;" @input="changeFilter($event,i.storename)"></el-input>
          </div>
          <div class="wtkhCheck" style="background:#F8F8F8">
            <ul>
             <el-checkbox-group v-model="checkedWtkh[i.storename]" @change="handleCheckedWtkhChange($event,i.storename)">
                        <li v-for="(item,index) in showList[i.storename]" :style="{background:checkedWtkh[i.storename].includes(item.gid)?'#FFFCF0':'#fff'}">
                          <el-checkbox :label="item.gid">{{item.wtkhname}}</el-checkbox>
                        </li>
            </el-checkbox-group>
            </ul>
          </div>
          <div class='bottom'>
            已选{{checkedWtkh[i.storename].length}}项

            <el-pagination
            small
            @current-change="handleCurrentChange($event,i.storename)"
            :current-page.sync="i.currentPage"
            :page-size="20"
            :pager-count="5"
        
            layout="prev, pager, next"
            :total="i.children.filter(item=>item.wtkhname.indexOf(i.filter)!='-1').length"
            style="display:inline-block;vertical-align:sub;height:28px;width:200px;"
            >
            </el-pagination>

            <el-popover placement="right" trigger="click" width="150" popper-class="removeTo">
            <ul>
            <li v-for="store in Object.keys(checkedWtkh)" v-if="store!='默认仓库'" @click="moveToWare(i,store)">{{store}} <i class="el-icon-arrow-right"></i></li>
            <li  @click="moveToWare(i,'未分配仓库')">未分配仓库<i class="el-icon-arrow-right"></i></li>
            </ul>
            <el-button slot="reference" type="primary" style="height:28px;float:right;margin-top:2px;width:78px;padding:8px 4px">移动到 <i class="el-icon-arrow-right"></i></el-button>

            </el-popover>
          </div>
          </div>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import { getChangeValue } from "../api/localStorage.js";
  import { openZimessage } from '@/components/mixins/topPageMixin'

  export default {
    name: "wareHouseGid",
    components: {},
    mixins: [openZimessage],
    props: {
      pagetype: {
        type: [Number, String],
        default: 1//1控制类 2预警类
      }
    },
    data() {
      return {
        name: "wareHouseGid.vue",
        inputViewData: {
          area: {
            title: "站点",
            type: 4,
            options: JSON.parse(localStorage.cityCode),
            hidden:true
          },
          fid: {
            title: "委托客户",
            type: 20,
            pagetype: "1",
          },
          //  area:{
          //   title:'所属地区',
          //   type:5,
          //   options:JSON.parse(localStorage.cityCode)
          // },  
        },

        inputModelData: {

        },
        searchData: {},
        dialogShow:false,
        wareHouseList:[],
        checkedWtkh:{'默认仓库':[]},
        showList:{'默认仓库':[]},

      };
    },

    methods: {
      getArea(area) {
        if (area) {
          let alllength = this.inputViewData.area.options.length
          let arr = area.split(',')
          if (area == -1 || arr.length == alllength) {
            return '全部'
          }
          if (arr.length == alllength - 1) {
            return ("非" + this.inputViewData.area.options.map(i => i.value).filter(i => !area.includes(i))[0])
          }
        }
        return area
      },
      getSystem(system) {
        if (system) {
          let alllength = this.nodeViewData.system.options.length
          let arr = system.split(',')
          if (system == -1 || arr.length == alllength) {
            return '全部'
          }
          if (arr.length == alllength - 1) {
            return ("非" + this.nodeViewData.system.options.map(i => i.value).filter(i => !system.includes(i))[0])
          }
        }
        return system
      },
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        var jsonArr2 = {
          where: { ...this.searchData },
          order: "begindate desc"
        };
      
        var json = { json: JSON.stringify(jsonArr2) };

        this.$axios({
          method: "get",
          url: this.$store.state.BasicWebApi + "api/ExCustomReceivingStore",
          params: json,
          loading: true,
          tip: false,
          nofield: true,
          nodom: true,
          noarea: true,
          nosystem: true
        })
          .then(results => {
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            setTimeout(() => {
              this.tableDataRes = getChangeValue(results.data, "空出");
            }, 0);

          })
          .catch(errors => { });
      },
      reset() {
        this.inputModelData = {};
      },
      getVal(groupid, val) {
        if (val === undefined || val === null) return '';
        var groupType = JSON.parse(localStorage.groupTypeCode)[groupid]
        var data = ''
        groupType.forEach(item => {
          if (item.typename == val) {
            data = item.ready01
          }
        })
        return data
      },
      searchWeihu(){

        if(!this.searchData.area){
          return this.$message.info('请选择站点')
        }
        this.wareHouseList=[]
        var defaultWareList={checked:false,storename:'默认仓库',children:[],currentPage:1,filter:''}
        this.checkedWtkh={'默认仓库':[]}
        this.showList={'默认仓库':[]}
        var gidList=[]
        var areaList=this.searchData.area
        var currentPage=1
      	this.$axios({
          method: "get",
          url: this.$store.state.BasicWebApi + "api/ExCustomReceivingStore",
          params: {},
          loading: true,
          tip: false,
          nofield: true,
          nodom: true,
          noarea: true,
          nosystem: true
        })
        .then(results=>{

        	if(!results.data.filter(i=>areaList==i.threecode).length){
            return this.$message.info('无查询结果')
          }
        	results.data.filter(i=>areaList==i.threecode).forEach(i=>{
        	   i.children=[]//仓库下所有委托项目
             this.$set(this.checkedWtkh,i.storename,[])//仓库下委托项目选择
             this.$set(this.showList,i.storename,[])//仓库下委托项目显示
             
             if(i.gid){
             	i.gid.split(',').forEach(i2=>{
                  if(this.wtxmData.filter(item=>item.id==i2).length){
                  	i.children.push({gid:i2,wtkhname:this.wtxmData.filter(item=>item.id==i2)[0]['usr_name'].split('-')[1]})
                  }
                  gidList.push(i2)
                  if(this.searchData.fid&&this.searchData.fid==i2){
                    let firstList=i.children[0]
                    let lastList=i.children[i.children.length-1]
                    i.children[0]=lastList
                    i.children[i.children.length-1]=firstList
                    this.checkedWtkh[i.storename].push(i2)
                  }
             	})
             }
             this.$set(i,'checked',false)//全选控制
             //this.$set(i,'pageSize',20)//每页显示条数
             this.$set(i,'currentPage',1)//当前激活页
             this.$set(i,'filter','')//仓库下委托项目显示
            // this.$set(i,'scrollList',14)
             this.wareHouseList.push(i)
        	})
          //console.log(gidList)
            this.wtxmData.filter(item=>gidList.indexOf(String(item.id))=='-1').forEach((item,itemIndex)=>{//默认仓库委托项目取剩下的所有委托客户
                  defaultWareList.children.push({gid:item.id,wtkhname:item['usr_name'].split('-')[1]})
                  if(this.searchData.fid&&this.searchData.fid==item.id){
                    let firstList=defaultWareList.children[0]
                    defaultWareList.children[0]={gid:item.id,wtkhname:item['usr_name'].split('-')[1]}
                    defaultWareList.children[defaultWareList.children.length-1]=firstList

                    this.checkedWtkh['默认仓库'].push(this.searchData.fid)
                  }
            })
            //console.log(defaultWareList)
             this.wareHouseList.push(defaultWareList)
              //console.log(currentPage)
              this.wareHouseList.forEach(i=>{
              this.handleCurrentChange(1,i.storename)
            })
        
        })
      },
      // 全选
      handleCheckAllChange(val,storename){//全选当页、取消当页
          Object.keys(this.checkedWtkh).forEach(i=>{
          if(i!=storename){
            this.checkedWtkh[i]=[]
          }else{
            var currentPage=this.wareHouseList.filter(i=>i.storename==storename)[0].currentPage
            var filter=this.wareHouseList.filter(i=>i.storename==storename)[0].filter
            var nowGidList=this.showList[storename].map(i=>i.gid)

            this.checkedWtkh[storename] = val ? this.wareHouseList.filter(i=>i.storename==storename)[0]['children'].filter(i=>i.wtkhname.indexOf(filter)!='-1').slice(0,20*currentPage).map(i=>i.gid) : this.checkedWtkh[storename].filter(i=>nowGidList.indexOf(i)=='-1');
          }
         })
        

         
      },
      //选择
      handleCheckedWtkhChange(value,storename) {
          Object.keys(this.checkedWtkh).forEach(i=>{
          if(i!=storename){
            this.checkedWtkh[i]=[]
            this.wareHouseList.forEach(item=>{if(item.storename==i){item.checked=false}})
          }else{
            let checkedCount=this.checkedWtkh[storename]

             this.wareHouseList.filter(item=>item.storename==i)[0]['checked']=this.showList[storename].map(i=>i.gid).filter(i=>checkedCount.indexOf(i)!='-1').length===this.showList[storename].map(i=>i.gid).length

          }
         }) 
        

      },
      // handleSizeChange(val,store){
      // this.wareHouseList.filter(i=>i.storename==store)[0]['pageSize']=val

      // this.showList[store] = this.wareHouseList.filter(i=>i.storename==store)[0]['children'].slice(0, val);
      // },

      handleCurrentChange(val,store){
        var filter=this.wareHouseList.filter(i=>i.storename==store)[0]['filter']
        //var pagesize=this.wareHouseList.filter(i=>i.storename==store)[0]['pagesize']
        this.wareHouseList.filter(i=>i.storename==store)[0]['currentPage']=val

        this.showList[store] = this.wareHouseList.filter(i=>i.storename==store)[0]['children'].filter(i=>i.wtkhname.indexOf(filter)!='-1').slice(
          (val - 1) * 20,
          val * 20
        );
        var gidList=this.checkedWtkh[store]

        if(this.showList[store].map(i=>i.gid).filter(i=>gidList.indexOf(i)!='-1').length==this.showList[store].map(i=>i.gid).length&&gidList.length){
          this.wareHouseList.forEach(item=>{if(item.storename==store){item.checked=true}})
        }else{
          this.wareHouseList.forEach(item=>{if(item.storename==store){item.checked=false}})
        }



      },
      changeFilter(val,storename){
        //console.log(this.wareHouseList.filter(i=>i.storename==storename)[0].filter)
        this.showList[storename]=this.wareHouseList.filter(i=>i.storename==storename)[0]['children'].filter(i=>i.wtkhname.indexOf(val)!=''-1)
        this.handleCurrentChange(1,storename)

      },
      // 设为默认
      bindDefault(type,i,index){
      this.$axios({
          method: "put",
          url: this.$store.state.BasicWebApi + "api/ExCustomReceivingStoreChangeDefault",
          data: {isdefault:type,id:i.id,storename:i.storename,area:i.area},
          loading: true,
          tip: false,
          nofield: true,
          nodom: true,
          noarea: true,
          nosystem: true
        })
        .then(results=>{
           if(results.data.resultstatus==0){
             this.wareHouseList[index].isdefault=type
             this.$message.success(results.data.resultmessage);
           }else{
             this.$message.success(results.data.resultmessage);
           }
        })
        .catch(error=>{

        })
      },
      //移至仓库
      moveToWare(i,storename){
        if(storename==i.storename){
          return
        }
        if(!this.checkedWtkh[i.storename].join(',')){
          return this.$message.info('请先勾选委托客户')
        }
        this.$axios({
          method: "put",
          url: this.$store.state.BasicWebApi + "api/ExCustomReceivingStore",
          data: {gid:this.checkedWtkh[i.storename].join(','),id:storename!='未分配仓库'?this.wareHouseList.filter(store=>store.storename==storename)[0]['id']:-1,storename:storename,area:this.wareHouseList[0].area},
          loading: true,
          tip: false,
          nofield: true,
          nodom: true,
          noarea: true,
          nosystem: true
        })
        .then(results=>{
           if(results.data.resultstatus==0){
             this.searchWeihu()
             this.$message.success(results.data.resultmessage);
           }else{
             this.$message.success(results.data.resultmessage);
           }
        })
        .catch(error=>{

        })
      },

      // load(){
      //    let storename='默认仓库';
      //    var lenght=this.wareHouseList.filter(item=>item.storename==storename)[0]['scrollList']+=8
      //     this.showList=this.wareHouseList.filter(item=>item.storename==storename)[0]['children'].slice(0,lenght) 
      // }

 
    },
    watch: {

    },
    created() {
      
    },
    computed: {
      wtxmData(){
        var gid=[]
        var resultData=[]
        getxmdata('wtxm').forEach(i=>{
          if(!gid.includes(i.id)){
            gid.push(i.id)
            resultData.push(i)
          }
        })
        console.log(resultData)
        return resultData
      }
    }
  };
</script>


<style scoped lang="less">
.dialogPage{padding-bottom:20px;overflow-y: hidden;}
.grid{
	display: inline-block;
  //width: 360px;
  width:1100px;
  overflow-x:auto;
  white-space: nowrap;
  vertical-align: top;
  .noDefault{
    width:360px;
    display:inline-block;
    margin-right:26px;
    overflow-y: hidden;
  }

}

.default{
  width:360px;
  //padding-left:26px;
  //border-left:1px solid #e8e8e8;
  display:inline-block;
  vertical-align: top;
}


h4{
color:#0F5A8C;
height:32px;
line-height:32px;
width:360px;
}
.wrap{
width:360px;
border:1px solid #E8E8E8;
height:600px;
position:relative;
padding-top: 40px;
padding-bottom: 40px;
border-radius:4px;

.head{
   background:#F8F8F8;
     border-bottom:1px solid #e8e8e8;
     margin-bottom:8px;
     position: absolute;
     z-index:1;
     width:100%;
     height:36px;
     line-height: 36px;
     padding:0 8px;
     top:0;
}
.wtkhCheck{
  padding:8px;
  height:520px;
  overflow-y: auto;
  ul li{
    list-style: none;
        width:100%;
        height:36px;
        line-height:36px;
        border:1px solid #e8e8e8;
        border-radius:4px;
        margin-bottom:8px;
        padding:0 8px;
        cursor:pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        &:hover{
          background:#FFFCF0!important;
        }
  }
  /deep/.el-checkbox__input.is-checked+.el-checkbox__label{
    color:#333;
  }
}
.bottom{
background:#F8F8F8;
border-top:1px solid #e8e8e8;
margin-top:8px;
height:32px;
width:100%;
position: absolute;
bottom:0;
z-index:1;
line-height: 32px;
padding:0 8px;
/deep/.el-pagination{
  button{
    background:''!important;
  }
  .el-dialog, .el-pager li{
    background:''!important;
  }
  
}
}

}

</style>
