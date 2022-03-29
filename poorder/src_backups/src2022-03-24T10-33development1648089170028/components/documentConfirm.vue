
<template>
   <div>
    <div  class="page-container-box" >
      <!-- {{peicangGuidArr}} -->
     <!-- {{selectTableIndex}} -->
     <!--   {{inputModelData}}
        {{searchData}}
         {{chineseWhere}} -->

                <newSearchComp
                  :name="name"
                  :view-data.sync="inputViewData"
                  :model-data.sync="inputModelData"
                  :search-data.sync="searchData"
                  :pageshow.sync='pageshow'
                  :chinese-where.sync="chineseWhere"
                  :pagetype="1">
                </newSearchComp>
              <div class="searchForm">
                <el-button @click="search">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </div>


</div>
         <!-- 获取配舱选中数据 -->
     <span style="display:none">
      {{peicangGuidArr}}
    </span>

<!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
 <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" v-on:transmitMsg="getZimessage" @transmitZiMsg="transmitZiMsg" :ziTableData="ziTableData"  :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
 <template slot="pono" slot-scope="props"><span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor']" @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
    <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="printFileFunc(props.data.index)"></i></template> -->
    <template slot="printFile" slot-scope="props"><i>&nbsp;</i></template>
 </tableCompt>



<!-- mawbguid  当前点击pono所对应的guid -->
<!-- v-if="dialogShow"  -->
   <el-dialog  title="综合查询" v-if="dialogShow" center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
              <mawbaddput   :visible.sync="dialogShow"  :pagetype='6' :mawbguid="mawbguid" :boguid="boguid" :area="area" :orderdom="orderdom" @update="delTableIndex" :pageFrom="'document'"></mawbaddput>
        </el-dialog>

  <el-dialog :visible.sync="dialogPeicang"  :close-on-click-modal="false" v-if="dialogPeicang" width="1100px">

              <flightAssignment :peicangGuidArr="peicangGuidArr" :dialogshow.sync="dialogPeicang"></flightAssignment>
        </el-dialog>

        <el-dialog title="配舱新增" :visible.sync="addPcShow" class="addPcDialog" :close-on-click-modal="false" v-if="addPcShow" width="1100px">

          <div class="detail">
            <div class="detail-c peicDetail" style="position:relative;">
              <formCompt :input-view-data="shipaceInfo" :input-model-data="shipaceInfoData">
                <template slot="hbh"><el-input v-model="shipaceInfoData.hbh" clearable @blur="getQfsj(2)" v-verify="'uppercase'"></el-input></template>
                <template slot="hbrq">
                  <el-date-picker
                    v-model="shipaceInfoData.hbrq"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @blur="getQfsj(2)">
                  </el-date-picker>
                </template>
                <template slot="qfsj">
                  <el-time-picker
                    v-model="shipaceInfoData.qfsj"
                    :picker-options="{
                      selectableRange: '00:00:00 - 23:59:59'
                    }"
                    value-format="yyyy-MM-dd HH:mm"
                    format="HH:mm"
                    style="width:120px">
                  </el-time-picker>
                  <i title="航班维护" class="el-icon-edit-outline" @click="qfsjDialogFunc(2)" style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;top:4px;"></i><i title="刷新" class="el-icon-refresh" @click="getQfsj(2)" style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:6px;position:relative;top:4px;"></i>
                </template>
                <template slot="terminalname">
                  <el-select v-model="shipaceInfoData.terminalname" style='width:120px'>
                    <el-option
                      v-for="(item,index) in jjdArr"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <jjdwh @success="getJJdfunc" :area="area"></jjdwh>
                </template>
              </formCompt>
              <el-button  @click="addPcSave" style="margin-left: 20px;margin-top: 20px;">保存</el-button>
            </div>
          </div>
<!-- {{shipaceInfoData}}
{{iframeUrl}} -->
        </el-dialog>

        <el-dialog
          :visible.sync="qfsjDialog"
          width="1300px"
          top="4%"
          v-if="qfsjDialog"
          :close-on-press-escape="false"
          append-to-body>
          <iframe :src="qfsjUrl"  frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;" ></iframe>
        </el-dialog>

     <el-dialog
          :visible.sync="costControlDialog"
          title="批量成本分摊"
          width="90%"
          top="4%"
          center
          v-if="costControlDialog"
          :close-on-press-escape="false"
          append-to-body>
            <span slot="title">
              <span style="font-size: 18px;color: #303133;">批量成本分摊</span>
              <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="shareRecordDialog=true" v-if="shareRecordDialog==false">批量成本分摊记录</span>
          </span>
              <costControlTool></costControlTool>
        </el-dialog>

     <el-dialog
          :visible.sync="shareRecordDialog"
          width="90%"
          title="批量成本分摊记录"
          top="4%"
          center
          v-if="shareRecordDialog"
          :close-on-press-escape="false"
          append-to-body>
             <span slot="title">
  <span style="font-size: 18px;color: #303133;">批量成本分摊记录</span>
              <span style="font-size:14px;float:right;color:#333;margin-right:40px;cursor:pointer" @click="costControlDialog=true" v-if="costControlDialog==false">批量成本分摊</span>
          </span>
              <shareRecord></shareRecord>
        </el-dialog>


     <!-- {{mawbDetail}} -->
        <div style="display:none">
          <makingBill :mawbguid="mawbDetail.guid" :boguid="mawbDetail.boguid"   ref="makingbill" v-if="mawbDetail.guid&&printIndex!=-1" :orderdom="mawbDetail.orderdom" :mawbinfo="mawbDetail"></makingBill>
        </div>


</div>
</template>
<script>

import flightAssignment from './orderDetails/flightAssignment' //航班配舱
    import { openZimessage } from "@/components/mixins/topPageMixin";


import { searCondition,getChangeValue,computedWeight,formatDate } from '../api/localStorage.js'
    export default {
      name: 'documentConfirm',
       components: {
             flightAssignment
        },
       mixins: [openZimessage],
        data () {
            return {
                name:"documentConfirm.vue",
                dialogShow:false,
                dialogPeicang:false,
                addPcShow: false,
                inputViewData:{
                  pono:{'title':'订舱编号',type:1},
                  mawb:{'title':'总运单',type:1,verify:'mawb'},
                  hawb:{'title':'分运单号',type:1},
                  orderno:{title:'订单来源号',type:1},
                  fid:{'title':'委托客户',type:14},
                  gid:{'title':'项目',type:13},
                  salesarea:{'title':'订单销售站',type:23,groupid:101,"whereStr":"in"},
                // area:{'title':'订单操作站',type:23,groupid:101},
                  comhy:{'title':'所属行业',type:5,"whereStr":"in",groupid:89},
                  hbh:{"title":"航班号",type:1,"whereStr":"like",verify:'uppercase'},
                  hbrq:{'title':'航班日期',type:15,defaultVal:true},
                  sfg:{"title":"始发港",type:1,verify:'uppercase'},
                  mdg:{"title":"目的港",type:1,verify:'uppercase'},
                   czlx:{'title':'操作类型',type:4,groupid:132},
                   hwxz:{'title':'货物性质',type:21,groupid:115},
                   hwlx:{'title':'货物类型',type:22},
                   ccz_confirmstatus_in:{'title':'操作站费用状态',type:4,options:[{label:'应收未确认',value:'1'},{label:'应收已确认',value:'700'}],"whereStr":"in",titleStyle:{'minWidth':'116px'}},
                  //  hwxz:{'title':'货物性质',type:5,groupid:115,"whereStr":"in"},
                  //  hwlx:{'title':'货物类型',type:5,groupid:109,"whereStr":"in"},
                  status:{title:'订单状态',type:5,dom:"订单状态",whereStr:'in',options:[{label:'已受理',value:'AO5020'},{label:'已退回',value:'AO5030'},{label:'已确认',value:'AO5040'},{label:'已分配',value:'AO5050'},{label:'已完成',value:'AO5060'},{label:'已审核',value:'AO5090'},{label:'待处理',value:'AO2050'},{label:'已撤单',value:'AO5065'}],disabled:true},
                 //  status:{title:'订单状态',type:5,dom:"订单状态",whereStr:'in'},
                   dzstatus:{'title':'单证状态',type:5,dom:'单证状态',whereStr:'in',disabled:true},
                   pcstatus:{'title':'配舱状态',type:5,dom:'配舱状态',whereStr:'in'},
                   bgstatus:{'title':'报关状态',type:5,dom:'报关状态',whereStr:'in'},
                   hwstatus:{'title':'货物状态',type:5,dom:'货物状态',whereStr:'in'},
                   addman:{'title':'创建人',type:1},
                   adddate:{'title':'创建时间',type:15},
                   salesname:{'title':'销售人',type:1},
                   customername:{'title':'客服负责人',type:1},
                   confirmstatusall:{'title':'费用状态',type:5,options:[{label:'应付费用未确认',value:'1'},{label:'应收费用未确认',value:'2'}],"whereStr":"in"},

              },
                inputModelData:{
                     "status": "AO5040",
                     "dzstatus":"AO0022,AO0025"
                },
                costControlDialog:false,//批量分摊弹窗
                shareRecordDialog:false,
                mawbDetail:{},
                printIndex:-1,
                putIndex:-1, //点击打开展开分单索引
                selectTableIndex:'',
                shipaceInfo:[//配舱
                  // {"title":"实际航班号：",id:"hbh",type:1,"model":"","defaultModel":"",class: 'width289'},//这样无法绑定blur 事件
                  {"title":"实际航班号：",id:"hbh",class: 'width289',verify:'uppercase'},
                  {"title":"实际航班日期：",id:"hbrq",class: 'width289'},
                  {"title":"实际起飞时间：",id:"qfsj",class: 'width289'},
                  // {"title":"实际全程天数：",id:"qcts",type:'1',"model":"","defaultModel":"",class: 'width289',verify:'integer'},
                  {"title":"始发港：",id:"sfg",type:'1',model: '',class: 'width289', verify: 'sfgmdg'},
                  {"title":"配载方式：",id:"loadingmodel",type:3,groupid: '37',"class": "width100",width: 100,"model":"","defaultModel":"交散",options: []},
                  {"title":"配舱操作：",id:"czlx",type:3,"model":"","defaultModel":"自货",options:[],width:100,class:'allwidth',groupid:'132'},
                  // {"title":"始发港货站：",id:"terminalname",type:4,"model":"","defaultModel":"",class: 'width289',options:[]},
                  {"title":"始发港货站：",id:"terminalname",class: 'width289'},
                  {"title":"组板供应商：",id:"shipvendor",type:1,"model":"","defaultModel":"",class: 'width289'},
                  {"title":"板位描述：",id:"shipspace",type:1,"model":"","defaultModel":"",class: 'width289'}
                ], //配舱
                shipaceInfoData:{},//配舱绑定数据

                qfsjDialog: false,
                qfsjUrl: '',

                jjdArr: []
        }
      },

        methods: {
          delTableIndex(data){
            this.dialogShow=false
            // if(data.nodel==2){
            //    this.tableDataRes.splice(this.selectTableIndex,1)
            // }
          },
          dialogPcFunc(){
            if(this.$store.state.areaState.split(',').length!=1){
              this.$message.error('请选择区域！');return;
            }

            if(this.peicangGuidArr.length==0){
              this.$message.error("请先选择！");return
            }

           let thereCode=[]
            this.tableDataRes.forEach(i=>{
              if(i.checked&&!thereCode.includes(i.mawb.substr(0,3))){
                thereCode.push(i.mawb.substr(0,3))
              }
            })

            if(thereCode.length!=1){

                    this.$confirm('运单航司不同, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                           this.dialogPeicang=true
                    }).catch(() => {

                    });

            }else{
               this.dialogPeicang=true
            }
          /*   if(this.peicangGuidArr.length>0){
               this.dialogPeicang=true
            }else{
              this.$message.error("请先选择！")
            } */

          },
          printFileFunc(index){
          this.printIndex=index
          this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid:this.tableDataRes[index].boguid},loading:false,tip:false}).then(results=>{
             this.mawbDetail=results.data
                   setTimeout(() => {
                        this.$refs.makingbill&&this.$refs.makingbill.printFunc()
                        this.printIndex=-1 //让组件重新渲染以取到制单数据
                    }, 500);
})
          },
         wtdataP(data){

          },
         transmitZiMsg(msg){


           this.printIndex=msg.index

                     this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid:this.tableDataRes[this.putIndex].boguid},loading:false,tip:false}).then(results=>{
       var data=results.data
         this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxpline',params:{guid:this.ziTableData[msg.index].guid},loading:true,tip:false}).then(res=>{


               var hawbdata=res.data

              //  //console.log(222222222)
              //  //console.log(JSON.stringify(hawbdata))

                  data.mdg=hawbdata.mdg
                  data.zdpiece=hawbdata.zdpiece
                  data.zdweight=hawbdata.zdweight
                  data.zdvolume=hawbdata.zdvolume
                  data.smallpiece=hawbdata.smallpiece
                  data.englishpm=hawbdata.englishpm
                  data.jfweight=computedWeight(hawbdata.zdvolume,hawbdata.zdweight)
                  data.hawb=hawbdata.hawb
                  data.guid=hawbdata.guid
                  data.orderdom='分单'
                this.mawbDetail=data
                   setTimeout(() => {
                        this.$refs.makingbill&&this.$refs.makingbill.printFunc()
                        this.printIndex=-1
                    }, 500);

            })
})



         },
          search(){


              this.tableDataRes=[];
              this.ziTableData=[];
                  var jsonArr2={
                    where:this.searchData,
                    order:"adddate desc"
                  }
                  var json={'json':JSON.stringify(jsonArr2)}

                   this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoboAxplineGeneral',params:json,loading:true,tip:false}).then(results=>{
                       //console.log(results)

                       if(results.data.length==0){
                         this.$message('无查询结果');return;
                       }else{
                         this.pageshow=false
                       }
                     results.data=getChangeValue(results.data,'空出')
                      setTimeout(()=>{
                        // this.tableDataRes=results.data;
                        this.tableDataRes=results.data.map(i=>{
                           if(!i.mawb||i.hbh){
                             i.checkDisabled=true;
                           }
                             return i
                        })
                      },0)
                   })
                   .catch(errors=>{

                   })

          },
          reset(){
             // reset(this.inputViewData)
             this.inputModelData={"status":"AO5040","dzstatus":"AO0022,AO0025"}

          },
          openDialog (indexData) {

            this.selectTableIndex=indexData
            this.mawbguid=this.tableDataRes[indexData].guid
            this.boguid=this.tableDataRes[indexData].boguid
            this.orderdom=this.tableDataRes[indexData].orderdom
            this.area=this.tableDataRes[indexData].area
            //console.log(this.mawbguid)
            this.dialogShow = true
          },
          cancelPeicang(){

      var jsonArr=[]
               this.tableDataRes.forEach(i=>{
                  if(i.checked){
                    jsonArr.push({guid:i.guid,shipaceid:-1})
                  }
               })
               if(jsonArr.length==0){
                 this.$message.error('请先选择！');return
               }

            this.$confirm('确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

var json={}
json.ShipaceList=jsonArr
json.isdel=2
              this.$axios({method:"put",url:this.$store.state.webApi+"api/ExHpoAxplineShipaceBatch",data:json,loading:true,tip:false}).then(results=>{
                       //console.log(results.data)
                                if(results.data.resultstatus==0){
                                     layer.msg("操作成功！")
                                }else{
                                  this.$message.error("操作失败！")
                                }

                            })
        }).catch(() => {

        });



          },

          addPcFunc () {
            if (this.$store.state.areaState.indexOf(',') !== -1) {
              return this.$message.error('请选择区域')
            }


            this.addPcShow = true
            this.area = this.$store.state.areaState
            this.shipaceInfoData = {}

            if(this.$store.state.areaState&&this.$store.state.areaState.split(',').length==1){
              JSON.parse(localStorage.groupType).forEach(i=>{
                if(i.groupid==53&&i.typename==this.$store.state.areaState){
                  this.shipaceInfoData.sfg=i.ready06
                }
              })
            }
          },
          getQfsj(type){
            //type 1 取预计起飞时间 2 取实际起飞时间
            var sfg=this.shipaceInfoData.sfg;
            if(type==1){

            }else{
              var hbh=this.shipaceInfoData.hbh;
              var hbrq=this.shipaceInfoData.hbrq;
            }
            var json={area:this.area,sfg:sfg,hbh:hbh,hbrq:hbrq,jid:''}
            if(sfg&&hbh.length&&hbrq){
              this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubTakeOffTime', params:json,loading:true,tip:false}).then(results=>{
                //console.log("起飞时间")
                //console.log(results.data)
                          var qfsj=results.data.resultdic&&results.data.resultdic.flytime
          this.qfsjsid=results.data.resultdic&&results.data.resultdic.sid
                if(qfsj&&qfsj.indexOf("1900")==-1){
                  if(type==1){

                  }else{
                    this.shipaceInfoData.qfsj=qfsj
                  }
                } else {
                 // layer.msg('未查询到相应的起飞时间!');
                  this.$message.error(results.data.resultmessage)

                  if(type==1){

                  }else{
                    this.shipaceInfoData.qfsj=''
                  }
                }
              })

            }
          },
          qfsjDialogFunc(type){ //起飞时间维护地址
            var sfg=this.shipaceInfoData.sfg
            if(type==1){

            } else {
              var hbh=this.shipaceInfoData.hbh
              var hbrq=this.shipaceInfoData.hbrq
            }
            var addman=localStorage.usrname
            if (!hbh||!hbrq||!sfg) {
              if (type==1) {

              } else {
                this.$message.error('请填写航班号，航班日期，始发港！');return;
              }
            } else {
              this.qfsjDialog=true
              this.qfsjUrl=`http://${this.iframeUrl}/WffBasic/basic/frmflightAdd.aspx?sid=${this.qfsjsid}&mawb=${mawb}&hbh=${hbh}&hbrq=${hbrq}&sfg=${sfg}&addman=${addman}`
            }
          },
          getJJdfunc(){//设置交接地数据
          //  this.jjdArr=JSON.parse(localStorage.jjd).filter(e=>e.sfg==this.shipaceInfoData.sfg).map(i=>{return {label:i.cname,value:i.cname}})
                var area=this.$store.stata.areaState
                if(area=='市场部'||area=='海外部'){
                  area='香港'
                }
           this.jjdArr=JSON.parse(localStorage.jjd).filter(e=>e.sfg==this.shipaceInfoData.sfg&&e.area==area).map(i=>{return {label:i.cname,value:i.cname,id:i.id}})

       },
          addPcSave () {
            var json=JSON.parse(JSON.stringify(this.shipaceInfoData))
            json.addman = localStorage.usrname
            json.adddate = formatDate(new Date(),"yyyy-mm-dd")

            this.$axios({method:"post",url:this.$store.state.webApi+'api/ExHpoAxplineShipace',data:json,loading:true,tip:false}).then(results=>{
              if(results.data.resultstatus==0){
                layer.msg("成功");
                this.shipaceInfoData={};
                this.addPcShow = false;
              }else{
                this.$message.error(results.data.resultmessage)
              }
            })
          }

        },
        watch: {
          "shipaceInfoData.loadingmodel":{
            handler(val){
              this.$nextTick(()=>{
                if(val=="装板"){
                  $(".addPcDialog").find("#shipvendor").hide()
                  $(".addPcDialog").find("#shipspace").show()
                }else if(val=="自交接"){
                  $(".addPcDialog").find("#shipvendor").hide()
                  $(".addPcDialog").find("#shipspace").hide()
                }else{
                  $(".addPcDialog").find("#shipvendor").show()
                  $(".addPcDialog").find("#shipspace").hide()
                }
              })
            },
            immediate:true
          }
        },

        created(){

        },
        computed:{

          peicangGuidArr () {
            var arr=[]
            var flag=true
            this.tableDataRes.forEach(i=>{
            //  let twoCode=i.hbh?i.hbh.substr(0,2):''

              if(i.checked&&i.mawb){
                //  if(arr.length==0){
                //    arr.push({guid:i.guid,sfg:i.sfg,mdg:i.mdg,loadingmodel:i.loadingmodel,twoCode:twoCode})
                // }else{
                //   if(i.sfg!=arr[arr.length-1].sfg||i.mdg!=arr[arr.length-1].mdg||i.loadingmodel!=arr[arr.length-1].loadingmodel||twoCode!=arr[arr.length-1].twoCode){
                //       flag=false
                //   }else{
                //     arr.push({guid:i.guid,sfg:i.sfg,mdg:i.mdg,loadingmodel:i.loadingmodel,twoCode:twoCode})
                //   }
                // }
                arr.push({guid:i.guid,mawb:i.mawb})
              }
            })
            //console.log(arr)
            // if(flag){
            //   return arr
            // }else{
            //    this.$message.error('批量配舱的始发港、目的港、配载方式、航司二字码必须相同');
            //     this.tableDataRes.forEach(i=>{
            //       i.checked=false
            //     })
            //   return []
            // }

            return arr
          },
          iframeUrl () { // 根据地域设置不同的链接地址，判断内网还是外网进入
            if (location.hostname.indexOf('192.168') !== -1) {
              var url=""
              JSON.parse(localStorage.groupType).forEach(i=>{
                if(i.groupid==53&&i.typename==this.area){
                  url=i.ready04
                }
              })
              return url
            } else {
              //wffbasic/basic/frmMawbAdd.aspx
              let url = `${location.hostname}${this.$store.state.area_port[this.area] || ''}`
              return url
            }
          }
        }

    }
</script>


<style scoped lang="less">
.el-dialog__wrapper{
  /deep/ .el-dialog__body{
  padding:5px 25px 30px;
  /deep/ .el-form-item__content>div{
 //   width:186px
  }
}
}

</style>
