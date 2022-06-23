
<template>
  <div style="height:100%;display: flex;flex-direction: column">
    <div class="page-container-box">
      <!-- {{peicangGuidArr}} -->
      <!-- {{selectTableIndex}} -->
      <!-- {{inputModelData}}
      {{searchData}}-->
      <!--   {{chineseWhere}}-->
      <!-- {{mawbguid}}-->
      <!-- {{mawbinfo.orderdom}} -->
      <!-- {{name}} -->
      <!-- {{amsType}} -->
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
        <!-- <el-button  v-if='guidlist'>
                     <a  style="color:#fff"  :href="`${$store.state.webApi}api/ExHpoAxplineAmsSend?guidlist=${guidlist}&czman=${czman}`" target="_blank">生成报文</a>
                </el-button>
        <el-button v-else disabled>生成报文</el-button>-->
<!--         <el-button
          :disabled="!guidlist"
          @click="sendAmsFunc(2)"
          v-if="amsType==1"
        >AMS发送成功</el-button> -->

       <el-button
          :disabled="!sidlist"
        @click="sendIgnore({sid:sidlist},0)"
          v-if="amsType==1"
        >批量忽略</el-button>

         <!-- <el-button
          :disabled="!guidlist"
          @click="sendAmsFunc(2,null,1,10,true)"
          v-if="amsType==2"
        >生成报文(总单)</el-button>

       <el-button
          :disabled="!guidlist"
          @click="sendAmsFunc(2,null,2,10,true)"
          v-if="amsType==2"
        >生成报文(分单)</el-button> -->

        <el-button
          :disabled="!guidlist"
          @click="printFunc({},1)"
          v-if="amsType==4"
          class="cargoPouchPrint"
        >批量打印CargoPouch</el-button>
      </div>
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      v-on:transmitMsg="getZimessage"
      v-on:transAmsMsg="transAmsMsg"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      showZiConfig
      :showTotal="showTotal"
      :dataGrouping="dataGrouping"
      groupField="sid"
      isGroup :isSort="false" :isPaging="false"
      expansionSubcolumn='mawb'
    >
    <template slot="sendstatus" slot-scope="props">
      <span :style="{color:props.data.value=='已发送航司'?'green':''}">{{props.data.value}}</span>
    </template>
      <template slot="operate" slot-scope="props">

      <span><i class="el-icon-delete" @click='delBill(props.data.index)' title="删除运单" v-if="amsType==2"></i></span>


        <span :class="{spanDisabled:props.data.row.sendstatus!='已导出'}" v-if="amsType==2&&!(props.data.row.area=='上海'&&(props.data.row.isexportform=='CCSP'||props.data.row.isexportform=='TANG'))">
          <i
            class="el-icon-check"
            style="color:green"
            @click="sendAmsFunc(1,props.data.row,null,20)"
            title="发送航司"
          ></i>
        </span>

        <span :class="{spanDisabled:props.data.row.verification!='无异常'}"  v-if="!(props.data.row.area=='上海'&&(props.data.row.isexportform=='CCSP'||props.data.row.isexportform=='TANG'))">


           <i
            class="el-icon-news"
            style="color:green"
            v-show="amsType!=1"
            @click="sendAmsFunc(1,props.data.row,1,10,true)"
            title="生成报文(总单)"
          ></i>

    <i
            class="el-icon-news"
            style="color:#409EFF"
            v-show="amsType!=1&&props.data.row.sendstatusNumber>=10"
            @click="sendAmsFunc(1,props.data.row,2,10,true)"
            title="生成报文(分单)"
          ></i>


        </span>

            <span :class="{spanDisabled:props.data.row.verification!='无异常'}" v-if="amsType==2&&props.data.row.area=='上海'&&(props.data.row.isexportform=='CCSP'||props.data.row.isexportform=='TANG')&&props.data.row.mawb.substr(0,3)!='999'">
          <i
            class="el-icon-s-promotion"
            style="color:green"
            @click="sendAmsOth(props.data.row,1,1)"
            title="总单发送"
          ></i>
             <!-- <i
            class="el-icon-s-promotion"
            style="color:#409EFF"
            v-show="props.data.row.sendstatusNumber>=10"
            @click="sendAmsOth(props.data.row,1,2)"
            title="分单发送"
          ></i> -->
            <i
            class="el-icon-s-promotion"
            style="color:#409EFF"
            @click="sendAmsOth(props.data.row,1,2)"
            title="分单发送"
          ></i>
        </span>

<span :class="{spanDisabled:props.data.row.verification!='无异常'}" v-if="amsType==2&&props.data.row.area=='上海'&&(czman=='张杰'||czman=='吴旭'||czman=='admin')">
             <i
            class="el-icon-refresh"
            style="color:green"
            @click="exceptionHandling(props.data.row)"
            title="状态异常处理"
          ></i>
</span>
            <span :class="{spanDisabled:props.data.row.verification!='无异常'}" v-if="amsType==2&&props.data.row.area=='上海'&&props.data.row.isexportform=='CCSP'&&props.data.row.mawb.substr(0,3)=='999'">

          <i
            class="el-icon-s-cooperation"
            style="color:green"
            @click="sendAmsOth(props.data.row,0,1)"
            title="暂存(总单)"
          ></i>
                  <!-- <i
            class="el-icon-s-promotion"
            style="color:#409EFF"
            v-show="props.data.row.sendstatusNumber>=10"
            @click="sendAmsOth(props.data.row,0,2)"
            title="分单发送"
          ></i> -->
                 <i
            class="el-icon-s-promotion"
            style="color:#409EFF"
            @click="sendAmsOth(props.data.row,0,2)"
            title="分单发送"
          ></i>
        </span>



             <i
            class="el-icon-check"
            style="color:green"
            @click="sendAmsFunc(1,props.data.row,null,20)"
            title="AMS发送成功"
            v-if="amsType==1"
          ></i>
          <i
          v-if="props.data.row.sendstatusNumber==0&&(amsType==1||amsType==2)"
            class="el-icon-circle-close"
            style="color:#409EFF"
            @click="sendIgnore(props.data.row,0)"
            title="忽略"
          ></i>

         <i
              v-if="props.data.row.sendstatusNumber==-1&&(amsType==1||amsType==2)"
            class="el-icon-circle-check"
            style="color:#409EFF"
            @click="sendIgnore(props.data.row,1)"
            title="取消忽略"
          ></i>


      </template>
      <template slot="mawb" slot-scope="props">
        <span class="poczColor" @click="openDialog(props.data.index)">{{props.data.value}}</span>
      </template>
      <template slot="print" slot-scope="props">
        <i
          class="el-icon-printer"
          title="打印CargoPouch"
          style="color:green"
          @click="printFunc(props.data.row,1,props.data.index)"
        ></i>
        <i
          class="el-icon-printer"
          title="声明维护"
          style="color:red"
          @click="printFunc(props.data.row,2,props.data.index)"
        ></i>
        <i
          class="el-icon-printer"
          title="声明打印"
          style="color:red"
          @click="printFunc(props.data.row,3,props.data.index)"
        ></i>
      </template>
    </tableCompt>

    <!-- mawbguid  当前点击pono所对应的guid -->
    <!-- v-if="dialogShow"  -->
    <el-dialog
      title="AMS信息编辑"
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
      <sendBill
        :mawbguid="mawbguid"
        :orderdom="orderdom"
        :mawbinfo="mawbinfo"
        @success="successFunc"
      ></sendBill>
    </el-dialog>

<div>
    <div style="display:none" id="printDiv">
      <section ref="print">
        <div
          v-for="(item,index) in guidlist?this.tableDataRes.filter(i=>i.checked):[mawbinfo]"
          :key="index"
          class="cargoPouchPrint"
        >
          <div class="cargoPouch" v-show="item.mawb&&item.mawb.substr(0,3)!=933">
            <img :src="cargopouchUrl">
            <template v-if="item.guid">
              <div style="top:5px;">Cargo Pouch</div>

              <img
                v-if="item.mawb&&(['112','999','784'].includes(item.mawb.substr(0,3)))"
                :src="`./boStatic/images/cargo/${item.mawb.substr(0,3)}.png`"
                style="top:46px;width:280px;margin-left:-150px"
              >
              <div style="top:146px;">
                <svg :id="`imgcode${index}`" style="width:240px;height:100px"></svg>
              </div>
              <div style="top:280px;">{{item.mawb}}</div>
              <div style="top:330px;">
                <span
                  style="width:380px;display:flex;justify-content: space-around;margin-left: -44px;"
                >
                  <span>{{item.mdg}}</span>
                  <span>{{item.zdpiece}}</span>
                  <span>{{item.zdweight}}</span>
                </span>
              </div>
              <div style="top:378px;">{{item.hbh+(item.hbh?'/':'')+item.hbrq}}</div>
              <div
                style="top:426px;"
              >{{item.companytitle_shr_mawb&&item.companytitle_shr_mawb.split('\n')[0]}}</div>
              <div style="top:522px;">{{item.handlinginfo&&item.handlinginfo.split('\n')[0]}}</div>
              <div style="top:570px;">{{sortVal(item.descriptioncode)}}</div>
              <div style="top:620px;">
                <p
                  style="width:380px;padding:0 5px;word-wrap: break-word;word-break: break-all;overflow: hidden;text-align:center"
                >{{item.remark}}</p>
              </div>
            </template>
          </div>
                <div class="cargoPouch" v-show="item.mawb&&item.mawb.substr(0,3)==933">
              <img :src="cargopouchjapanUrl" />
              <template v-if="item.guid">
          
                <div style="top:146px;display:none">
                  <svg :id="`imgcode${index}`" style="width:240px;height:100px"></svg>
                </div>
                 <div style="top:255px;">{{item.hbh+(item.hbh?'/':'')+item.hbrq}}</div>
                <div style="top:315px;">{{item.mawb}}</div>
                <div style="top:367px;">{{item.zdpiece}}</div>
                <div style="top:422px;">{{item.zdweight}}</div>
                <div style="top:477px;">{{item.mdg}}</div>
                <div style="top:540px;">{{sortVal(item.descriptioncode)}}</div>

               <div style="top:590px;">
                  <p
                    style="width:220px;padding:0 5px;word-wrap: break-word;word-break: break-all;overflow: hidden;text-align:left;margin-left:115px"
                  >{{item.accountinfo&&item.accountinfo.split('\n').length>1?item.accountinfo.split('\n')[1]:""}}</p>
                </div>
                <div style="top:635px;">
                  <p
                    style="width:350px;padding:0 5px;word-wrap: break-word;word-break: break-all;overflow: hidden;text-align:center"
                  >{{sortVal(item.descriptioncode).includes("ELI")||sortVal(item.descriptioncode).includes("ELM")?item.remark:""}}</p>
                </div>
              </template>
            </div>
          <div style="page-break-after: always;"></div>
        </div>
          <span style="position: absolute;right:0px;bottom:0px">张杰</span>
      </section>
    </div>
 </div>
  </div>
</template>
<script>
import sendBill from '@/components/orderDetails/sendBill'
import {systemCheck, openZimessage, searchCmptMixins} from '@/components/mixins/topPageMixin'

import {
  getChangeValue,
  formatDate,
  getValByGrouid
} from "../api/localStorage.js";
import { getLodop } from "../api/LodopFuncs.js";

export default {
  mixins:[systemCheck, openZimessage, searchCmptMixins],
  components: {
    sendBill
  },
  props: {
    name: String,
    modifystatusams:String//1正常 2已修改
  },
  data() {
    return {
      dialogShow: false,
      dialogPeicang: false,
      addPcShow: false,
      inputViewData: {
        hbrq: { title: "航班日期", type: 15, defaultVal: true }
      },
      inputModelData: {
        safetystatus: "",
        cargostatus: "",
        sendstatus: "",
        isamsmake: "1",
      },
      pageshow: true,
      mawbinfo: {},
      selectTableIndex: -1,
      dataGrouping:{},
      cargopouchUrl: "./boStatic/images/cargopouch.png",//如果链接直接写在html中，编译时图片会被打包到单独页面；用变量保存地址则不会
      cargopouchjapanUrl:"./boStatic/images/cargopouchjapan.png"
    };
  },

  methods: {
    sortVal(val) {
      // if (val) {
      //   let arr = val.split(",");

      //   if (arr.includes("ELI")) {
      //     arr.unshift("ELI");
      //   }
      //   if (arr.includes("ELM")) {
      //     arr.unshift("ELM");
      //   }
      //   return [...new Set(arr)].toString();
      // } else {
      //   return "";
      // }
      return val||""
    },

    search() {
      this.searchData.mawbtype = 1;
      if (
        this.name == "amsSendManual.vue" ||
        this.name == "amsSendDirect.vue"
      ) {
        this.searchData.isexport =
          this.name.indexOf("amsSendManual") >= 0 ? 0 : 1;
           this.searchData.modifystatusams=this.modifystatusams==1?1:{'unequal': 1}
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
        url: this.$store.state.webApi + (this.name=='amsCargoPouch.vue'||this.name=='companyDzLetterSearch.vue'?"api/ExHpoAxplineMawbDocCargoPouch":"api/ExHpoAxplineMawbDocAmsSend"),
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
                       let data=[]
                       let parentGroupData={}
                       let listLength=0
                       results.data.forEach((i,index)=>{
                         if(i.list.length>0){
                           listLength=listLength+i.list.length
                           parentGroupData[i.list[0].sid]={hbh:i.hbh,hbrq:i.hbrq.substring(0,11),qfsj:i.qfsj.substring(11,16),listLength:listLength,len:i.list.length}
                          data=data.concat(i.list)
                         }
                       })

                     data=getChangeValue(data,'空出')
                     //console.log(data)
                      setTimeout(()=>{
                        this.tableDataRes=data
                        this.dataGrouping=parentGroupData
                      },0)

    /*       results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            //if (this.amsType == 4) {
              this.tableDataRes = results.data;
            //  } else {
            //   this.tableDataRes = results.data.map(i => {
            //     if (i.verification != "无异常" || (i.area=='上海'&&(i.isexportform=='CCSP'||i.isexportform=='TANG'))) {
            //       i.checkDisabled = true;
            //     }

            //     return i;
            //   });
            // }
          }, 0); */
        })
        .catch(errors => {});
    },

    getHawbList(msg) {
      //获取分单列表
      this.ziTableData = [];
      let guid = this.tableDataRes[msg.index].sid;

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAxplineHawbDocAmsSend",
        params: { hpoid: guid },
        loading: false,
        tip: false
      }).then(results => {
        //  //console.log("分单列表")
        //   //console.log(JSON.stringify(this.ziTableData))
        if (results.data.length == 0) {
          this.$message("无查询结果！");
          return;
        } else {
          results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            //console.log(results.data)
            this.ziTableData = results.data;
          }, 20);
          //this.ziTableData=getChangeValue(results.data)
        }
      });
    },
    openDialog(indexData) {
      this.selectTableIndex = indexData;
      this.mawbinfo = this.tableDataRes[indexData];
      this.mawbguid = this.tableDataRes[indexData].sid;
      this.orderdom = this.tableDataRes[indexData].orderdom;
      this.area = this.tableDataRes[indexData].area;
      //console.log(this.mawbguid)
      this.dialogShow = true;
    },

    transAmsMsg(data) {
      //  console.log(data.row);
      this.mawbinfo = data.row;
      this.mawbguid = data.row.hpoid;
      this.orderdom = "分单";
      this.area = data.row.area;
      //console.log(this.mawbguid)
      this.dialogShow = true;
    },
    sendAmsFunc(type, data,dom,sendstatus,generateMessage=false) {
      //  console.log(data)
      //  console.log(type)
      //type 1 单条，data单条数据 2 批量，data为空
      //dom 1总单 2分单
      //sendstatus发送状态,generateMessage是否生成报文
      if(this.amsType=='1'){
        this.$prompt('请输入分运单票数','',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: '输入正确分运单票数',
        closeOnClickModal:false,
        customClass:'sendAms',
      })
      .then((value)=>{
      var json = {};
      let guidlist = "";
      let sidlist='';
      if (type == 1) {
        guidlist = data.guid;
        sidlist=data.sid
      } else {
        guidlist = this.tableDataRes
          .filter(i => i.checked)
          .map(i => i.guid)
          .toString();
            sidlist = this.tableDataRes
          .filter(i => i.checked)
          .map(i => i.sid)
          .toString();

        if (!guidlist) {
          return this.$message.error("请先选择！");
        }
      }
      json = {
        guidlist: guidlist,
        czman: localStorage.usrname,
        sendstatus: sendstatus||10,
        hawbcount:value.value,
        sendmethod:this.amsType=='1'?'2':'1'
      };

      json.sidlist=sidlist;

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineAmsCheck",
        params: json,
        noarea: true,
        loading: false,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          // console.log(results.data)
          //    data.sendstatus=getValByGrouid(146, results.data.resultdic.sendstatus)
          //  this.$message(results.data.resultmessage);
          if(generateMessage){
                window.open(
                  `${
                    this.$store.state.webApi
                  }api/ExHpoAxplineAmsSend?guidlist=${guidlist}&czman=${
                    localStorage.usrname
                  }&sendtype=${dom||1}`,
                  "_blank"
                );
            }else{
               this.$message.success(results.data.resultmessage);
            }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
      })
      .catch(()=>{
        this.$message({
            type: 'info',
            message: '取消操作'
          });       
      })
    }else{
         var json = {};
      let guidlist = "";
      let sidlist='';
      if (type == 1) {
        guidlist = data.guid;
        sidlist=data.sid
      } else {
        guidlist = this.tableDataRes
          .filter(i => i.checked)
          .map(i => i.guid)
          .toString();
            sidlist = this.tableDataRes
          .filter(i => i.checked)
          .map(i => i.sid)
          .toString();

        if (!guidlist) {
          return this.$message.error("请先选择！");
        }
      }
      json = {
        guidlist: guidlist,
        czman: localStorage.usrname,
        sendstatus: sendstatus||10,
        hawbcount:0,
        sendmethod:this.amsType=='1'?'2':'1'
      };

      json.sidlist=sidlist;

      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineAmsCheck",
        params: json,
        noarea: true,
        loading: false,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          // console.log(results.data)
          //    data.sendstatus=getValByGrouid(146, results.data.resultdic.sendstatus)
          //  this.$message(results.data.resultmessage);
          if(generateMessage){
                window.open(
                  `${
                    this.$store.state.webApi
                  }api/ExHpoAxplineAmsSend?guidlist=${guidlist}&czman=${
                    localStorage.usrname
                  }&sendtype=${dom||1}`,
                  "_blank"
                );
            }else{
               this.$message.success(results.data.resultmessage);
            }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    }

      
    
    },
    sendAmsOth(data,type,dom){
      let json={guid:data.guid,czman:localStorage.usrname,signatory:makePy(data.addman)[0],flage:type,sendtype:dom||1}

      if(data.isexportform=="TANG"){
        this.$prompt('请输入分运单票数','',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: '输入正确分运单票数',
        closeOnClickModal:false,
        customClass:'sendAms',
      })
      .then((value)=>{
        json.hawbcount=value.value
        this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineAmsSendCcsp",
        params: json,
        noarea: true,
        loading: false,
        tip: false
      }).then(results => {
          if(results.data.resultstatus==0){
              this.$message.success(results.data.resultmessage);
          }else{
              this.$message.error(results.data.resultmessage);
          }
      })
      })
      .catch(()=>{
        this.$message({
            type: 'info',
            message: '取消操作'
          });       
      })
      }else{
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxplineAmsSendCcsp",
          params: json,
          noarea: true,
          loading: false,
          tip: false
        }).then(results => {
            if(results.data.resultstatus==0){
                this.$message.success(results.data.resultmessage);
            }else{
                this.$message.error(results.data.resultmessage);
            }
        })
      }
      
    },
    sendIgnore(data,type){//状态异常处理
                      let json={guidlist:data.sid,czman:localStorage.usrname,isamsmake:type}
              this.$axios({
                method: "put",
                url: this.$store.state.webApi + "api/ExHpoAxplineAmsIgnoreSend",
                data: json,
                noarea: true,
                loading: false,
                tip: false
              }).then(results => {
                        if(results.data.resultstatus==0){
                          data.sendstatusNumber=results.data.resultdic.sendstatus
                          data.sendstatus=results.data.resultdic.sendstatusname
                            this.$message.success(results.data.resultmessage);
                        }else{
                            this.$message.error(results.data.resultmessage);
                        }
              })
    },
    exceptionHandling(data){
         this.$prompt('请填写发送人', '修改状态信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S{1}/,
          inputErrorMessage: '不能为空'
        }).then(({ value }) => {
                     let json={guidlist:data.guid,czman:localStorage.usrname,sendman:value,sendmethod:this.amsType=='1'?'2':'1'}
                    this.$axios({
                      method: "put",
                      url: this.$store.state.webApi + "api/ExHpoAxplineAmsRefreshSend",
                      data: json,
                      noarea: true,
                      loading: false,
                      tip: false
                    }).then(results => {
                              if(results.data.resultstatus==0){
                                  this.$message.success(results.data.resultmessage);
                              }else{
                                  this.$message.error(results.data.resultmessage);
                              }
                    })

        })

    },
    printFunc(data, type, index) {
      // window.print()
      // 1carpouch 2 维护 3 打印
      this.mawbinfo = data;
      if (type == 1) {
        if (index || index == 0) {
          this.tableDataRes.forEach(e => {
            if (e.checked) {
              e.checked = false;
            }
          });
        }
        // if (data.cargostatusname == "未打印") {
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExHpoAxplineAmsPrint",
          data: {
            printtype: 2,
            guid: data.sid ? data.sid : this.guidlist,
            czman: localStorage.usrname
          },
          loading: false,
          tip: false,
          noarea: 1
        }).then(results => {
          // console.log(results);
          if (results.data.resultstatus == 0) {
            setTimeout(() => {
              $("#printDiv").show();
              if (index || index == 0) {
                JsBarcode("#imgcode0", data.mawb);
                this.tableDataRes[index].cargostatusname = "已打印";
              } else {
                let n = 0;
                this.tableDataRes.forEach((e, i) => {
                  if (e.checked) {
                    JsBarcode("#imgcode" + n, e.mawb);
                    e.cargostatusname = "已打印";
                    n += 1;
                  }
                });
              }

              //  console.log(this.$refs.print)
              this.$print(this.$refs.print); // 使用
              $("#printDiv").hide();
            }, 0);
          }
        });
        // } else {
        //   setTimeout(() => {
        //     $("#printDiv").show();
        //     JsBarcode("#imgcode", data.mawb);
        //     //  console.log(this.$refs.print)
        //     this.$print(this.$refs.print); // 使用
        //     $("#printDiv").hide();
        //   }, 100);
        // }
      } else {
        let json = {
          ThreeCode: data.mawb.substr(0, 3),
          sfg: data.sfg,
          mdg: data.mdg
        };
        this.$axios({
          method: "get",
          url: this.$store.state.BasicWebApi + "api/ExAirCompanyDzLetter",
          params: json,
          loading: false,
          tip: false
        }).then(results => {
          console.log(results.data);
          let data = [];
          //  this.pagePrint(results.data)
          var imgName = "";
          let num = -1;
          for (var i = 0; i < results.data.length; i++) {
            //  let id=results.data[i].imgid
            //  console.log(num)
            // console.log(data[num])

            if (imgName != results.data[i].imgid) {
              imgName = results.data[i].imgid;
              num += 1;
            }

            if (data[num]) {
              data[num].push(results.data[i]);
            } else {
              data[num] = [results.data[i]];
            }
          }

          if (data.length == 0) {
            this.$message.error("没有可用模板！");
            return;
          } else {
            this.statement = data;
          }

          if (type == 2) {
            this.pagePrint(0);
          } else {
            this.$message("开始作业...");

            for (var i in this.statement) {
              var imglist = this.statement[i];
              var img = this.statement[i][0];

              var lodop = getLodop();
              lodop.PRINT_INITA("0", "0", "794", "1123", "Letter_" + img.imgid);
              lodop.SET_PRINT_PAGESIZE(1, "210mm", "297mm", "");
              lodop.ADD_PRINT_SETUP_BKIMG(
                "<img border='0'  width='794' height='1123' src='" +
                  img.fileaddress +
                  "'>"
              );
              lodop.SET_SHOW_MODE("BKIMG_PRINT", 1);

              for (var i in imglist) {
                let obj = imglist[i];
                switch (obj.colid) {
                  case "-1":
                    lodop.ADD_PRINT_TEXT(684, 285, 330, 27, obj.colval);
                    lodop.SET_PRINT_STYLEA(0, "Bold", 1);
                    break;
                  case "-99":
                    break;
                  default:
                    if (obj.colIdvue == "hbrq") {
                      // console.log(this.mawbinfo[obj.colIdvue])
                      lodop.ADD_PRINT_TEXT(
                        684,
                        285,
                        330,
                        27,
                        formatDate(this.mawbinfo[obj.colIdvue], "yyyy/MM-dd")
                      );
                      lodop.SET_PRINT_STYLEA(0, "Bold", 1);
                      break;
                      // lodop.ADD_PRINT_TEXT(824, 185, 330, 27, this.mawbinfo[obj.colIdvue]); lodop.SET_PRINT_STYLEA(0, "Bold", 1); break;
                    } else {
                      lodop.ADD_PRINT_TEXT(
                        244,
                        325,
                        330,
                        27,
                        this.mawbinfo[obj.colIdvue]
                      );
                      lodop.SET_PRINT_STYLEA(0, "Bold", 1);
                      break;
                    }
                }
              }

              LODOP.ADD_PRINT_TEXT("98%", "90%", 200, 20, localStorage.usrname);
              lodop.PRINT();
            }

            this.$message("作业完成,共" + this.statement.length + "张");
            this.$axios({
              method: "put",
              url: this.$store.state.webApi + "api/ExHpoAxplineAmsPrint",
              data: {
                printtype: 1,
                guid: this.mawbinfo.sid,
                czman: localStorage.usrname
              },
              loading: false,
              tip: false,
              noarea: 1
            }).then(results => {
              if (results.data.resultstatus == 0) {
                this.tableDataRes[index].safetystatusname = "已打印";
              }
            });
          }
        });
      }
    },
    pagePrint(printCount) {
      //console.log(this.mawbinfo)
      var lodop = getLodop();
      var imglist = this.statement[printCount];
      var img = this.statement[printCount][0];
      lodop.PRINT_INITA("0", "0", "794", "1123", "Letter_" + img.imgid);
      lodop.SET_PRINT_PAGESIZE(1, "210mm", "297mm", "");
      lodop.ADD_PRINT_SETUP_BKIMG(
        "<img border='0'  width='794' height='1123' src='" +
          img.fileaddress +
          "'>"
      );
      lodop.SET_SHOW_MODE("BKIMG_PRINT", 1);

      for (var i in imglist) {
        let obj = imglist[i];
        switch (obj.colid) {
          case "-1":
            lodop.ADD_PRINT_TEXT(684, 285, 330, 27, obj.colval);
            lodop.SET_PRINT_STYLEA(0, "Bold", 1);
            break;
          case "-99":
            break;
          default:
            if (obj.colIdvue == "hbrq") {
              // console.log(this.mawbinfo[obj.colIdvue])
              lodop.ADD_PRINT_TEXT(
                684,
                285,
                330,
                27,
                formatDate(this.mawbinfo[obj.colIdvue], "yyyy/MM-dd")
              );
              lodop.SET_PRINT_STYLEA(0, "Bold", 1);
              break;
              // lodop.ADD_PRINT_TEXT(824, 185, 330, 27, this.mawbinfo[obj.colIdvue]); lodop.SET_PRINT_STYLEA(0, "Bold", 1); break;
            } else {
              lodop.ADD_PRINT_TEXT(
                244,
                325,
                330,
                27,
                this.mawbinfo[obj.colIdvue]
              );
              lodop.SET_PRINT_STYLEA(0, "Bold", 1);
              break;
            }
        }
      }

      LODOP.ADD_PRINT_TEXT("98%", "90%", 200, 20, localStorage.usrname);
      lodop.PRINT_SETUP();
      printCount++;
      let timter = setInterval(() => {
        // console.log(printCount)
        if (printCount == this.statement.length) {
          clearInterval(timter);
          this.$message.success("作业完成,共" + printCount + "张");
        }
        if (!lodop.blOneByone) {
          this.pagePrint(printCount);
          clearInterval(timter);
        }
      }, 200);
    },
    successFunc(data) {
      this.mawbinfo.orderdom = data.orderdom;
      this.orderdom = data.orderdom;
    },
            delBill(index){
                    this.$confirm('是否确认删除?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {

                                               this.$axios({
                                            method: "delete",
                                            url: this.$store.state.webApi + "api/ExHpoAxplineMawbDocAmsSend",
                                            data: {czman:localStorage.usrname,guid:this.tableDataRes[index].guid},
                                            loading: true,
                                            noarea:true,
                                            tip: false
                                          }).then(results => {
                                                  if(results.data.resultstatus==0){
                                                         // this.tableDataRes.splice(index,1);
                                                        this.$message.success(results.data.resultmessage);

                                                  }else{
                                                        this.$message.error(results.data.resultmessage);
                                                  }
                                          })

                    }).catch(() => {

                    });
         }
  },
  watch: {},

  created() {},
  mounted() {
    if (this.name == "amsSendManual.vue" || this.name == "amsSendDirect.vue") {
      this.inputModelData.sendstatus = "0";
    }

    if(this.inputViewData.isexportform){
      this.inputViewData.isexportform= !this.name == "amsSendDirect.vue"
    }

    if (this.name == "companyDzLetterSearch.vue") {
      this.inputModelData.safetystatus = "2";
    }

    if (this.name == "amsCargoPouch.vue") {
      this.inputModelData.cargostatus = "2";
    }
  },
  computed: {
    amsType() {
      return ["amsSendManual.vue","amsSendDirect.vue","companyDzLetterSearch.vue","amsCargoPouch.vue"].indexOf(this.name)+1
    },
    czman() {
      return localStorage.usrname;
    },
    guidlist() {
      return this.tableDataRes
        .filter(i => i.checked)
        .map(i => i.guid)
        .toString();
    },
    sidlist() {
      return this.tableDataRes
        .filter(i => i.checked)
        .map(i => i.sid)
        .toString();
    }
  }
};
</script>


<style scoped lang="less">
.el-dialog__wrapper {
  /deep/ .el-dialog__body {
    padding: 5px 25px 30px;
    /deep/ .el-form-item__content > div {
      //   width:186px
    }
  }
}

</style>
<style>
.sendAms{width:320px;}
</style>

