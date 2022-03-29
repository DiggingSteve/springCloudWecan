
<template>
  <div>
    <div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
        @reset="reset"
      ></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
      </div>
    </div>
    <!-- 获取配舱选中数据 -->
    <!-- <span style="display:none">{{peicangGuidArr}}</span> -->

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      showZiConfig
      :showTotal="showTotal"
    >

    <template slot="operate" slot-scope="props">

      <i class="el-icon-printer" @click="printDz(props.data.index)"></i>

      <i class="el-icon-unlock" @click="dzdSend(props.data.index,props.data.row)" :class="[props.data.row.isclock!='2'&&props.data.row.isclock!='对账单已发送'?'disabled':'']"></i>



    </template>
      <!-- <template slot="pono" slot-scope="props">
        <span
          :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]"
          @click="openDialog(props.data.index)"
        >{{props.data.value}}</span>
      </template> -->
      <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i></template> -->
      <!-- <template slot="printFile" slot-scope="props"><i>&nbsp;</i></template> -->
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <el-dialog
      title="综合查询"
      v-if="dialogShow"
      center
      :visible.sync="dialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="dialogShow"
        :pagetype="6"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
        :orderdom="orderdom"
        @update="delTableIndex"
        @success="mergeSuc"
      ></mawbaddput>
    </el-dialog>

<el-dialog
    title="确认解锁"
     v-if="jeShow"
      center
      :visible.sync="jeShow"
      :close-on-click-modal="false"
      width="500px"
      @close="jeShow=false;modifyJson.wagein_pre='';modifyJson.remark='';modifyJson.wagein_pre_real='';modifyJson.wagein_pre_serialno=''"
    >
<p>
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">预付金额：</span>
   <span style="width:250px;display:inline-block">
     <el-input v-model="modifyJson.wagein_pre"  v-verify="'float'" disabled></el-input>
 </span>
</p>

<!-- <p style="margin-top:12px;">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">预付银行：</span>
   <span style="width:250px;display:inline-block">
     <el-input v-model="modifyJson.wagein_pre_bank"></el-input>
 </span>
</p>
 -->
<p style="margin-top:12px;">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">实付金额：</span>
   <span style="width:250px;display:inline-block">
     <el-input v-model="modifyJson.wagein_pre_real"  v-verify="'float'"></el-input>
 </span>
</p>

<p style="margin-top:12px;" class="input-required">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">到账流水号：</span>
   <span style="width:250px;display:inline-block">
     <el-input v-model="modifyJson.wagein_pre_serialno"></el-input>
 </span>
</p>

<p style="margin-top:12px;">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">到账日期：</span>
   <span style="width:250px;display:inline-block">
   <el-date-picker
      v-model="modifyJson.wagein_pre_accountdate"
      type="date"
      style="width:250px;"
      placeholder="选择日期">
    </el-date-picker>
 </span>
</p>

<p style="margin-top:12px;">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">解锁人：</span>
   <span style="width:250px;display:inline-block">
     <el-input v-model="modifyJson.wagein_pre_man" disabled></el-input>
 </span>
</p>

<p style="margin-top:12px;">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right">解锁日期：</span>
   <span style="width:250px;display:inline-block">
      <el-date-picker
      disabled
      v-model="modifyJson.wagein_pre_date"
      type="date"
      style="width:250px;"
      placeholder="选择日期">
    </el-date-picker>
 </span>
</p>

<p style="margin-top:12px;margin-bottom:12px">
 <span style="display:inline-block;margin-right:20px;width:100px;text-align:right;vertical-align:top">备注：</span>
   <span style="width:250px;display:inline-block">
     <el-input  type="textarea" v-model="modifyJson.remark" placeholder="请输入内容"></el-input>
 </span>
</p>
 <p style="text-align:right">
 <el-button @click="jeModify">确定</el-button>
 <el-button @click="jeShow=false;modifyJson.wagein_pre='';modifyJson.remark='';modifyJson.wagein_pre_real='';modifyJson.wagein_pre_serialno=''">取消</el-button>
 </p>
</el-dialog>

    <!-- 生成对账单 -->
  <el-dialog
  width="100%"
  top="0"
  center
  :visible.sync="dzdMakeS"
  v-if="dzdMakeS"
  class="dialogPage"
  :modal="false"
  :close-on-click-modal="false" :close-on-press-escape="false"
  >

  <dzdMake :dzdMakeD="dzdMakeD" @Unvisible="dzdMakeS=false" :mawbguid="mawbguid"  :boguid="boguid" :area="area"></dzdMake>

  </el-dialog>









  </div>
</template>
<script>
import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'
import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate,
  getMomentDate
} from "../api/localStorage.js";
import dzdMake from './orderDetails/dzdMake'
export default {
  name: "ctype",
  mixins:[ openZimessage, searchCmptMixins],
  components: {
    dzdMake
  },
  data() {
    return {
      name: "ctype.vue",
      dialogShow: false,
      dialogPeicang: false,
      addPcShow: false,
      inputViewData: {
        adddate:{ title:'创建时间',type:15 },
        hbrq: { title: "航班日期", type: 15 },
      },
      inputModelData: {
        // status: "AO5010,AO5040,AO5020,AO5060,AO5090,AO5030,AO5050,AO5025",
        isclock: '2'
      },
      mawbDetail: {},
      printIndex: -1,
      putIndex: -1, //点击打开展开分单索引
      selectTableIndex: "",
      qfsjDialog: false,
      qfsjUrl: "",
      jjdArr: [],
      mergeDialog: false,
      jeShow:false,
      jeIndex:'-1',
      modifyJson:{wagein_pre:'',remark:"",wagein_pre_bank:'',wagein_pre_real :'',wagein_pre_serialno:'',wagein_pre_accountdate:'',wagein_pre_man:'',wagein_pre_date:'',hpoid:'',boguid:''},
      dzdMakeS:false,//打印对话框显示隐藏
      dzdMakeD:{},//对账打印数据传
    };
  },

  methods: {
    delTableIndex(data) {
      this.dialogShow = false;
      // if(data.nodel==2){
      //    this.tableDataRes.splice(this.selectTableIndex,1)
      // }
    },
    dzdSend(index,data){
      this.jeIndex=index;

     this.modifyJson.wagein_pre=Number(data.wagein_pre).toFixed(2);
     this.modifyJson.wagein_pre_real=this.modifyJson.wagein_pre_real?Number(this.modifyJson.wagein_pre_real).toFixed(2):Number(data.wagein_pre).toFixed(2)
     this.modifyJson.wagein_pre_man=localStorage.usrname
     this.modifyJson.wagein_pre_accountdate=getMomentDate()
     this.modifyJson.wagein_pre_date=getMomentDate()
     this.modifyJson.wagein_pre_serialno=''
     if(data.isclock!='2'&&data.isclock!='对账单已发送'){
      this.jeShow=false
    }else{
      this.jeShow=true
    }
    },

    dialogPcFunc() {
      if (this.$store.state.areaState.split(",").length != 1) {
        this.$message.error("请选择区域！");
        return;
      }

      if (this.peicangGuidArr.length == 0) {
        this.$message.error("请先选择！");
        return;
      }

      let thereCode = [];
      this.tableDataRes.forEach(i => {
        if (i.checked && !thereCode.includes(i.mawb.substr(0, 3))) {
          thereCode.push(i.mawb.substr(0, 3));
        }
      });

      if (thereCode.length != 1) {
        this.$confirm("运单航司不同, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.dialogPeicang = true;
          })
          .catch(() => {});
      } else {
        this.dialogPeicang = true;
      }
      /*   if(this.peicangGuidArr.length>0){
               this.dialogPeicang=true
            }else{
              this.$message.error("请先选择！")
            } */
    },
    printFileFunc(index) {
      this.printIndex = index;
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: { boguid: this.tableDataRes[index].boguid },
        loading: false,
        tip: false
      }).then(results => {
        this.mawbDetail = results.data;
        setTimeout(() => {
          this.$refs.makingbill && this.$refs.makingbill.printFunc();
          this.printIndex = -1; //让组件重新渲染以取到制单数据
        }, 500);
      });
    },
    wtdataP(data) {},
    transmitZiMsg(msg) {
      this.printIndex = msg.index;

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        params: { boguid: this.tableDataRes[this.putIndex].boguid },
        loading: false,
        tip: false
      }).then(results => {
        var data = results.data;
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxpline",
          params: { guid: this.ziTableData[msg.index].guid },
          loading: true,
          tip: false
        }).then(res => {
          var hawbdata = res.data;

          //  //console.log(222222222)
          //  //console.log(JSON.stringify(hawbdata))

          data.mdg = hawbdata.mdg;
          data.zdpiece = hawbdata.zdpiece;
          data.zdweight = hawbdata.zdweight;
          data.zdvolume = hawbdata.zdvolume;
          data.smallpiece = hawbdata.smallpiece;
          data.englishpm = hawbdata.englishpm;
          data.jfweight = computedWeight(hawbdata.zdvolume, hawbdata.zdweight);
          data.hawb = hawbdata.hawb;
          data.guid = hawbdata.guid;
          data.orderdom = "分单";
          this.mawbDetail = data;
          setTimeout(() => {
            this.$refs.makingbill && this.$refs.makingbill.printFunc();
            this.printIndex = -1;
          }, 500);
        });
      });
    },
    search() {
            this.selectTableIndex=-1;

            if(this.$store.state.ifLimitSearch&&Object.keys(this.searchData).length==0){
              return this.$message.error('请输入或选择查询条件！');
            }
      this.tableDataRes = [];
      this.ziTableData = [];
      var jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      var json = { json: JSON.stringify(jsonArr2) };

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/GetCLockList",
        params: json,
        loading: true,
        tip: false
      })
        .then(results => {
          //console.log(results)

          if (results.data.length == 0) {
            this.$message("无查询结果");
            return;
          } else {
            this.pageshow = false;
          }
         // results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            // this.tableDataRes = results.data;
               let data=results.data.map(i=>{
                          /*  if(!i.mawb||i.hbh){
                             i.checkDisabled=true;
                           } */
                          /*
                              可以拼单
                                1.在签单确认前  才可以 status<300
                                2.可拼      才可以  1可 2否
                                3.未拼       才可以 iscomboine 1是 2否
                                4.无总运单号     才可以
                                5. 自货才可以
                             */

                           if(i.czlx!='自货'||i.mawb||i.system!='空出'||i.iscomboine==1||i.comboine!=1||i.status>=300||i.isinwageallin==4){
                             i.checkDisabled=true;
                           }
                             return i
                        })

                        this.tableDataRes=getChangeValue(data, "空出");
                        // this.tableDataRes.forEach(i=>{
                        //   if(i.isclock=='0'){
                        //      i.isclock='未锁定'
                        //   }else if(i.isclock=='1'){
                        //     i.isclock='已锁定'
                        //   }else if(i.isclock=='2'){
                        //     i.isclock='对账单已发送'
                        //   }else if(i.isclock=='3'){
                        //     i.isclock='已解锁'
                        //   }
                        // })
          }, 0);
        })
        .catch(errors => {});
    },
    jeModify(){

    var data=this.modifyJson
    data.hpoid=this.tableDataRes[this.jeIndex].guid
    data.boguid=this.tableDataRes[this.jeIndex].boguid
    // var data={wagein_pre:this.modifyJson.wagein_pre,hpoid:this.tableDataRes[this.jeIndex].guid,remark:this.modifyJson.remark,wagein_pre_real:this.modifyJson.wagein_pre_real,wagein_pre_serialno:this.modifyJson.wagein_pre_serialno,wagein_pre_accountdate:this.modifyJson.wagein_pre_accountdate,}
    // if(!data.wagein_pre){
    //   this.$message.error('请输入金额')
    //   return
    // }
    if(!data.wagein_pre_real){
      this.$message.error('请输入实付金额')
      return
    }
    if(!data.wagein_pre_serialno){
      this.$message.error('请输入流水账号')
      return
    }
    this.$axios({
      method: "post",
      url: this.$store.state.webApi + "api/CheckBill/UnlockCType",
      data: data,
      loading: true,
      tip: false
    })
    .then(results=>{
      if(results.data.resultstatus==0){
        this.jeShow=false
        this.search()
         this.$message.success(results.data.resultmessage)
      }else{
        this.$message.error(results.data.resultmessage)
      }
    })
    },
    // 打印
printDz(val){

this.$axios({method:'post',url:this.$store.state.webApi+'api/CheckBill/GetCheckBill',data:{boguid:this.tableDataRes[val].boguid,wageids:0,hpoid:this.tableDataRes[val].guid}})
.then(results=>{
  //console.log(results.data)
var jobnolist=[]
       results.data.forEach((item,index)=>{

        item.jobnolist.forEach((item2,index2)=>{

            item2.realjzt=item2.realpiece+'/'+Number(item2.realweight).toFixed(2)+'/'+Number(item2.realvolume).toFixed(2)
           item2.hbrq=item2.hbrq.substring(0,10)
           jobnolist.push({jobListData:item2,wagelist:[]})
           item2.wagelist.forEach(item3=>{
             item3.realjzt=item2.realjzt
              item3.hbh=item2.hbh
            item3.dwageall=item3.finishwageall_checkbill
            item3.hbrq=item2.hbrq.substring(0,10)
            jobnolist[index2].wagelist.push(item3)
           })
        })
       })
       console.log(jobnolist)
        var printData={
          area:this.tableDataRes[val].area,
          system:this.tableDataRes[val].system||'空出',
          accountcomname:results.data[0].accountcomname,
          settgid:results.data[0].accountcomgid,
          settjobid: results.data[0].jobnolist[0].settjobid,
          wageinout:'1',
          jobnolist:jobnolist,
          noPrint:2,
          hpoid:this.tableDataRes[val].guid,
          confirmman:results.data[0].confirmman,
          confirmdate:results.data[0].confirmdate,
          confirmremark:results.data[0].confirmremark,
          ourconfirmman:results.data[0].ourconfirmman,
          ourconfirmdate:results.data[0].ourconfirmdate,
          useremail:localStorage.userEmail,
          isNeedEmail:false,
          cusemail:''
        }
        console.log(printData)
        this.dzdMakeS=true
        this.dzdMakeD=printData
        this.area=this.tableDataRes[val].area
        //this.system:this.tableDataRes[val].system,
})
.catch(error=>{

})
},
    // reset() {
    //   // reset(this.inputViewData)
    //   this.inputModelData = {
    //     status: "AO5040,AO5020,AO5060,AO5070,AO5080,AO5030,AO5050,AO5025"
    //   };
    // },
    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbguid = this.tableDataRes[indexData].guid;
      this.boguid = this.tableDataRes[indexData].boguid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      //console.log(this.mawbguid)
      this.dialogShow = true;
    },
    openMergeDialog(){
      if(!this.$store.state.areaState||this.$store.state.areaState.split(',').length>1){
        return this.$message.error('请选择地域！');
      }
      let arr=this.tableDataRes.filter(i=>i.checked);
      if(arr.length<2){
        return this.$message.error('请选择至少两条数据！');
      }
      let obj={
        companytitle_shr_mawb:{cname:'总单收货人'},
        companytitle_fhr_mawb:{cname:'总单发货人'},
        companytitle_shr_hawb:{cname:'分单收货人'},
        companytitle_fhr_hawb:{cname:'分单发货人'},
        hwlx:{cname:'货物类型'},
        hwxz:{cname:'货物性质'},
        sfg:{cname:'始发港'},
        hbzl:{cname:'航班种类'},
        status:{cname:'订单状态'},
        dzstatus:{cname:'单证状态'},
        orderdom:{cname:'订单类型'},
      }
      let arr2=Object.keys(obj);
       for(let e in arr2){
        for(let i in arr){
            let k=arr2[e]
              if(i==0){
                obj[k].val=arr[0][k]
              }else{
                if(arr[i][k]!=obj[k].val){
                  return  this.$message.error(obj[k].cname+'必须相同才能合并');
                }
              }
          }

        }
      this.mergeDialog=true;
    },
    mergeSuc(){
      this.mergeDialog=false;
      this.search()
    }
  },

  created() {},
  computed: {
    margeTableData() {
      return this.tableDataRes.filter(i => i.checked);
    }
  }
};
</script>


<style scoped lang="less">


</style>
