<template>
  <div class="cost-confirmhx-page">
    <!-- {{content}} -->
   <div class="head">
     批量费用制作({{wageinout=='1'?'应收':'应付'}})
   </div>
   <div class="title">
     <span>航班号：<span class="blue">{{dataGrouping.hbh}}</span></span>
     <span>航班日期：<span class="blue">{{dataGrouping.hbrq}}</span></span>
     <span>预报：<span class="blue">{{dataGrouping.ybjzt}}</span></span>
     <span>实际：<span class="blue">{{dataGrouping.realjzt}}</span></span>
     <span>制单：<span class="blue">{{dataGrouping.zdjzt}}</span></span>
     <span>配载方式：<span class="blue">{{dataGrouping.loadingmodel}}</span></span>
     <span>分隔符：<span class="blue">{{dataGrouping.splitstring}}</span></span>
     <span>交接地：<span class="blue">{{dataGrouping.terminalname}}</span></span>
   </div>
   <div>
     <el-button @click="changeWageinout(1)" :disabled="rowData.list.every(i=>i.ysShow==false)">
      批量应收
     </el-button>

     <el-button @click="changeWageinout(2)" :disabled="rowData.list.every(i=>i.yfShow==false)">
      批量应付
     </el-button>
   </div>
   <el-tabs type="border-card" style="margin-top:20px;transform:translate(0,0);position:relative" v-model="showwageinout" class="titleLabel" v-show="wageinout">
      <el-tab-pane  name='1' :disabled="rowData.list.every(i=>i.ysShow==false)" v-if="wageinout=='1'">
         <span slot="label" :class="['badgeLabel',showwageinout=='1'?'badgeGreen':'badgeGreenNa']">批量应收</span>
         <span v-for="i in khList" :class="['khname',activeKhId.ys==i.id?'active':'']" @click="changeSetName(1,i.id)" :key="i.id">
           {{i.khname}}
         </span>
         <el-tabs type="border-card" class="mdgLabel" v-model="activeMdg.ys">
            <el-tab-pane :label="i" v-for="(i,index) in mdgList" :key="index" :name="i" >

                
                <slotTemplate wageinout='1' :mdgData="contentData[i+'&'+activeKhId['ys']]['ys']"  v-if="contentData&&contentData[i+'&'+activeKhId['ys']]" :contentList.sync="content"  :noWatch="noWatch">

                  <!-- <slotTemplate wageinout='1' v-for="(mdgItem,mdgIndex) in mdgList" :mdgData="contentData[mdgItem+'&'+activeKhId['ys']]['ys']"   :contentList.sync="content"  :key="mdgIndex" v-show="showTemplate.includes(i+'&'+activeKhId['ys'])"> -->

                  <template slot="button" slot-scope="props">
                      <el-popover
                        placement="bottom-start"
                        width="212"
                        trigger="click">
                        <div style="margin:8px auto">
                          <p style="font-size:12px;color:#222;margin-bottom:8px;font-weight:bold">
                          请选择要复制的对象
                          </p>

                          <el-select style="margin-bottom:12px;" v-model="ysfzmdg">
                            <el-option v-for="mdg in mdgList.filter(m=>m!=i)" :key="mdg" :label="mdg" :value="mdg"></el-option>
                          </el-select>
                          
                          <p style="text-align:right">
                          <el-button type="primary" size="mini" @click="copyMdg({field:i+'&'+activeKhId['ys'],originField:ysfzmdg+'&'+activeKhId['ys'],type:props.data.type,wageinout:props.data.wageinout})">确认复制</el-button>
                          </p>
                        </div>
                        
                        <el-button slot="reference" type="primary">复制参数</el-button>
                      </el-popover>
                  </template>
                  

                </slotTemplate>

            </el-tab-pane>
         </el-tabs>
          <commonTable :head="mawbZitableHeadYs" :tableData="content.filter(i=>i.gid==activeKhId['ys'])"  class="commontable" >
             <template slot="checkTh" slot-scope="props">
               <el-checkbox v-model="checkAllYs"></el-checkbox>
             </template>
             <template slot="check" slot-scope="props">
               <el-checkbox v-model="props.data.row.ysCheck"></el-checkbox>
             </template>
            <template slot="operate" slot-scope="props">
              <i class="el-icon-edit" @click="setSingleAir(props.data.row,1)"></i>
            </template>
            <template slot="inwageallinprice" slot-scope="props">
              <el-input v-model="props.data.row.inwageallinprice" @blur="handerPrice({rowData:props.data.row,value:props.data.row.inwageallinprice,field:'inwageallinprice',weightField:'accountweightin',leastField:'leastwageallinYf',changeField:'ysPcischange'})" @keydown.native="props.data.row.ysPcischange='2'"></el-input>
            </template>
            <template slot="yfysweight" slot-scope="props">
             <el-input v-model="props.data.row.yfysweight" @blur="handerWeight({rowData:props.data.row,value:props.data.row.yfysweight,field:'yfysweight',priceField:'inwageallinprice',leastField:'leastwageallinYf',changeField:'jgysischange'})"  :disabled="props.data.row.inputDisableYs" @keydown.native="props.data.row.jgysischange='2'"></el-input>
              
            </template>
             <template slot="inwageallinprice_trans" slot-scope="props">
             <el-input v-model="props.data.row.inwageallinprice_trans" @blur="handerPrice({rowData:props.data.row,value:props.data.row.inwageallinprice_trans,field:'inwageallinprice_trans',weightField:'zzysweight',leastField:'leastwageallinZz',changeField:'zzysPcischange'})" @keydown.native="props.data.row.zzysPcischange='2'"></el-input>
            </template>
            <template slot="zzysweight" slot-scope="props">
              <el-input v-model="props.data.row.zzysweight" @blur="handerWeight({rowData:props.data.row,value:props.data.row.zzysweight,field:'zzysweight',priceField:'inwageallinprice_trans',leastField:'leastwageallinZz',changeField:'zzysischange'})" :disabled="props.data.row.inputDisableYsZz" @keydown.native="props.data.row.zzysischange='2'"></el-input>
            </template>
            <template slot="inwageallinclude" slot-scope="props">
              <el-checkbox v-model="props.data.row.DmcheckedYs" :disabled="props.data.row.disabled"></el-checkbox>
            </template>
          </commonTable>
      </el-tab-pane>


      <el-tab-pane  name='2' :disabled="rowData.list.every(i=>i.yfShow==false)" v-if="wageinout=='2'">
         <span slot="label" :class="['badgeLabel',showwageinout=='2'?'badgeRed':'badgeRedNa']">批量应付</span>
          <span v-for="i in khList" :class="['khname',activeKhId.yf==i.id?'active':'']" @click="changeSetName(2,i.id)" :key="i.id">
           {{i.khname}}
         </span>
         <el-tabs type="border-card" class="mdgLabel" v-model="activeMdg.yf">
            <el-tab-pane :label="i" v-for="(i,index) in mdgList" :key="index" :name='i'>

                <slotTemplate wageinout='2' :mdgData="contentData[i+'&'+activeKhId['yf']]['yf']" v-if="contentData[i+'&'+activeKhId['yf']]" :contentList.sync="content" :noWatch="noWatch">
                  <!-- 应付运费按钮 -->
                   <template slot="button" slot-scope="props">
                      <el-popover
                        placement="bottom-start"
                        width="212"
                        trigger="click">
                        <div style="margin:8px auto">
                          <p style="font-size:12px;color:#222;margin-bottom:8px;font-weight:bold">
                          请选择要复制的对象
                          </p>

                          <el-select style="margin-bottom:12px;" v-model="yffzmdg">
                            <el-option v-for="mdg in mdgList.filter(m=>m!=i)" :key="mdg" :label="mdg" :value="mdg"></el-option>
                          </el-select>
                          
                          <p style="text-align:right">
                          <el-button type="primary" size="mini" @click="copyMdg({field:i+'&'+activeKhId['yf'],originField:yffzmdg+'&'+activeKhId['yf'],type:props.data.type,wageinout:props.data.wageinout})">确认复制</el-button>
                          </p>
                        </div>
                        
                        <el-button slot="reference" type="primary">复制参数</el-button>
                      </el-popover>
                  </template>
                  

                </slotTemplate>
                <!-- 杂费 -->
                <div v-if="content.filter(i=>i.mawbgid==activeKhId['yf'])[0]" style="width:480px;margin-top:20px;">
                  <h3 class="zftitle">
                    杂费
                  </h3>
                  <commonTable :head="wageItemHead" :tableData="content.filter(i=>i.mawbgid==activeKhId['yf'])[0]['zafeiList']" isMultiSelect></commonTable>
                </div>
                <!-- 表格 -->
                  <commonTable :head="mawbZitableHeadYf" :tableData="content.filter(i=>i.mawbgid==activeKhId['yf'])"  class="commontable" v-if="content">
                    <template slot="checkTh" slot-scope="props">
                      <el-checkbox v-model="checkAllYf"></el-checkbox>
                    </template>
                   <template slot="check" slot-scope="props">
                     <el-checkbox v-model="props.data.row.yfCheck"></el-checkbox>
                   </template>
                     <template slot="operate" slot-scope="props">
                            <i class="el-icon-edit" @click="setSingleAir(props.data.row,2)"></i>
                      </template>
                    <template slot="outwageallinprice" slot-scope="props">
                      <el-input v-model="props.data.row.outwageallinprice" @blur="handerPrice({rowData:props.data.row,value:props.data.row.outwageallinprice,field:'outwageallinprice',weightField:'accountweightout',leastField:'leastwagealloutYf',changeField:'yfPcischange'})" @keydown.native="props.data.row.yfPcischange='2'"></el-input>
                    </template>
                    <template slot="yfyfweight" slot-scope="props">
                     <el-input v-model="props.data.row.yfyfweight" @blur="handerWeight({rowData:props.data.row,value:props.data.row.yfyfweight,field:'yfyfweight',priceField:'outwageallinprice',leastField:'leastwagealloutYf',changeField:'jgyfischange'})" :disabled="props.data.row.inputDisableYf" @keydown.native="props.data.row.jgyfischange='2'"></el-input>
                    </template>
                     <template slot="outwageallinprice_trans" slot-scope="props">
                     <el-input v-model="props.data.row.outwageallinprice_trans" @blur="handerPrice({rowData:props.data.row,value:props.data.row.outwageallinprice_trans,field:'outwageallinprice_trans',weightField:'zzyfweight',leastField:'leastwagealloutZz',changeField:'zzyfPcischange'})" @keydown.native="props.data.row.zzyfPcischange='2'"></el-input>
                    </template>
                    <template slot="zzyfweight" slot-scope="props">
                      <el-input v-model="props.data.row.zzyfweight"  @blur="handerWeight({rowData:props.data.row,value:props.data.row.zzyfweight,field:'zzyfweight',priceField:'outwageallinprice_trans',leastField:'leastwagealloutZz',changeField:'zzyfischange'})" :disabled="props.data.row.inputDisableYfZz" @keydown.native="props.data.row.zzyfischange='2'"></el-input>
                    </template>
                     <template slot="outwageallinclude" slot-scope="props">
                        <el-checkbox v-model="props.data.row.DmcheckedYf" :disabled="props.data.row.disabled"></el-checkbox>
                    </template>
                  </commonTable>
            </el-tab-pane>
         </el-tabs>
      </el-tab-pane>

   </el-tabs>

   <div class="btn-c" style="margin-top:12px;" v-if="wageinout">
      <el-button @click="save(1)">制作完成</el-button>
      <el-button @click="back">返回</el-button>
  </div>

  <el-dialog title="航线综合查询" v-if="singleAir" center :visible.sync="singleAir" class="dialogPage"
            :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
            <airPlaneDeatil :boguid="boguid" :visible.sync="singleAir" type="single" @changeWage="getWageChange" :activeTab="activeMod"></airPlaneDeatil>
  </el-dialog>

  </div>
</template>

<script>
import {StringNum,getWtxmname,getGysname} from "../../api/localStorage.js";
import airPlaneDeatil from "./airPlaneDeatil";
let costCom={
  template:`
   <commonTable class="commonTable" :head="mawb_table_model" :table-data="costData" style="position:relative;" v-if="costData" :colorIndex="modCostIndex" :tableIndex="1">
   
    <template slot="firstTd" slot-scope="props">

      <td>

        <i class="icon-save"  :class="[!curObject.items||!curObject.num||!curObject.price||curObject.leastwageall==0?'disabled':'']" @click="addCost"></i>
        <i class="el-icon-close" @click="clearCost"></i>
      </td>
      <td>
        <input type="checkbox" v-model="curObject.isfree"></td>
        <td>
          {{curObject.confirmstatus!='--'&&curObject.confirmstatus?curObject.confirmstatus:'--'}}
        </td>

<td style="display:inline-flex;border:none;width:100%;">

  <page-select :modelval.sync="curObject.gid" :pagetype="wageinout=='1'?'2':'3'"  :disabled="curObject.disabled" :area="inputModelData.area" v-if="inputModelData.area" :ifRefreshData.sync="ifRefreshData" :wtxmname="inputModelData.wtxmname" :fid="inputModelData.fid" @change="getSettname">

  <template slot="other">
   <jsdxwh :fid="inputModelData.fid" :area="inputModelData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
 </template>

</page-select>
</td>
<td>
  <page-select :modelval.sync="curObject.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :servicecode="'OA0010'" @click="getServiceData" servicecode="wageinout=='1'?'航线应收':'航线应付'"></page-select>
</td>
<td>
  <el-select v-model="curObject.wagetype" style="width:130px;">

  <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObject.num" style="width:100px;" v-verify="curObject.wagetype=='票'?'integer':'fixedTwo'"></el-input>
</td>
<td>
  <el-input v-model="curObject.price" style="width:100px;" v-verify="'fixedTwo'"></el-input>
</td>
<td>
  <el-select v-model="curObject.currency" style="width:100px;">
  <el-option v-for="(item,index) in currencyList"
  :key="index"
  :label="item.label"
  :value="item.label"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObject.leastwageall" style="width:100px;" :disabled="true"></el-input>
</td>

<td>
  <el-input v-model="curObject.wageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObject.changerate" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObject.remark" style="width:100px;"></el-input>
</td>

</template>
<template slot="operate" slot-scope="props">
  <i class="el-icon-setting" title='修改费用' @click="modCost(props.data.index,$event)" :class="{'disabled':props.data.row.isallin=='1'||props.data.row.items=='航司中转费'}"></i>
  <i class="el-icon-delete"  title='删除费用' :class="{'disabled':props.data.row.isallin=='1'||props.data.row.items=='航司中转费'}" @click="delCost(props.data.index,$event,props.data.row.guid)"></i>
</template>



   </commonTable>

  `,
  props:{
  wageinout:[String,Number],
  inputModelData:Object,
  costData:Array,
  },
  data(){
    return {
    mawb_table_model:[
      {field: 'operate', title: '操作'},
      {field: "isfree", title: "免",formatType:2,format:(x=>x==1?'否':'是')},
      {field: "confirmstatus", title: "状态",formatType:2,format:(x=>x==700?'已确认':'未确认')},
      {field: "settname", title: "结算对象"},
      {field: "items", title: "服务项目"},
      {field: "wagetype", title: "结算方式"},
      {field: "num", title: "数量"},
      {field: "price", title: "单价"},
      {field: "currency", title: "币种"},
      {field: "leastwageall", title: "金额"},
      {field: "wageall", title: "RMB金额"},
      {field: "changerate", title: "汇率"},
      {field: "remark", title: "备注"}
    ],
    curObject:{
      num:'',
      price:'',
      currency:'人民币',
      otherno:'--',
      gid:'',
      changerate:'1.0000'
    },
    modCostIndex:'-1',//费用修改INDEX
    ifRefreshData:false,//刷新结算对象数据
   
    }
  },
  methods:{
     //获取结算对象中文
     getSettname(data) {
        this.curObject.settname = data.usr_name
      },
      //获取服务代码
      getServiceData(data){
        this.$set(this.curObject,'servicecode',data.servicecode)
      },
      // 禁止点击
      evDisabled(el) {
      return [...el.target.classList].includes('disabled')
      },
      //修改费用
      modCost(index,el){
        if(this.evDisabled(el)) return
        this.modCostIndex=index
        this.curObject={...this.costData[index]}
        this.curObject.isfree=this.curObject.isfree=='1'?false:true
        this.curObject.confirmstatus=this.curObject.confirmstatus=='1'?'未确认':'已确认'
      },
      //删除费用(索引,点击元素,费用guid)
      delCost(index,el,guid){
        if(this.evDisabled(el)) return
           this.$confirm('是否删除此费用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
         .then(()=>{
           var data={
             guidList:guid,
             sid:this.inputModelData.guid,
             boguid:this.inputModelData.boguid,
             area:this.inputModelData.area
           }
           this.$axios({
             method: "DELETE",
             url: this.$store.state.webApi + 'api/ExHpoAxplineWage',
             data: data,
             loading: false,
             tip: false
           })
           .then(results=>{
             if (results.data.resultstatus == 0) {
                this.$message.success('删除成功')
                this.costData.splice(index,1)
              }else{
                this.$message.error(results.data.resultmessage)
              }
            })
         })
         .catch(()=>{
           this.$message({
            type: 'info',
            message: '已取消删除'
          })
         })
      },
      //清空当前更改费用
      clearCost(){
       this.curObject={currency:'人民币',changerate:1.000,gid:this.wageinout=='1'?this.inputModelData.gid:this.inputModelData.mawbgid,isfree:false,remark:'',leastwageall:'',wageall:'',changerate:1.0000,num:'',price:'',isdel:1}
      },
      //新增修改费用
      addCost(){
        if(!Number(this.curObject.price) || !Number(this.curObject.num) || !this.curObject.wagetype || !this.curObject.items){
          return this.$message.error('请填写完整费用')
        }
        if(!this.curObject.gid){
         return this.$message.error('请选择结算对象')
        }
        var method=""
        var templateData={...this.curObject}
        templateData.quote = 0
        templateData.wageinout = this.wageinout
        method = templateData.id ? 'PUT' : 'POST'
        templateData.confirmstatus = 1
        templateData.isfree =  templateData.isfree?'2':'1'
        templateData.wagedom = '航线'
        templateData.contact = ''
        templateData.modifyReason = ''
        templateData.status = -1
        templateData.sid =this.inputModelData.boguid
        templateData.boguid = this.inputModelData.boguid

         this.$axios({
         method: method,
         url: this.$store.state.webApi + 'api/ExHpoAxplineWage',
         data: templateData,
         loading: true,
         tip: false
        })
        .then(({data})=>{
          if(data.resultstatus==0){
             this.$message.success(data.resultmessage)
             this.clearCost()
             this.$emit('research',{boguid:this.inputModelData.boguid,mawb:this.inputModelData.mawb,type:'new'})
          }
        })
      },
  },
  watch:{
  "curObject.wagetype"(val) {
    if (
      (this.costData[this.modCostIndex] &&
        this.costData[this.modCostIndex].wagetype) == val
      ) {
      return;
  }
  switch (val) {
    case "箱":
    this.curObject.num = this.inputModelData.realpiece;
    break;
    case "票":
      //console.log('2')
      this.curObject.num = "1";
      break;
    case "计重":
      this.curObject.num = this.inputModelData.jfweight||0
      break;
    case "结算重量":
      this.curObject.num =this.wageinout=='2'?this.inputModelData.accountweightout:this.inputModelData.accountweightin;
      break;
    case "毛重":
      this.curObject.num = (this.inputModelData.zddrstatus=='2'?Number(this.inputModelData.zdweight).toFixed(2):Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2))||0
      break;
    case "分运单票数":
       // console.log('1')
       this.curObject.num = this.inputModelData.hawbnum||0
       break;
     case "总运单票数":
       // console.log('1')
       this.curObject.num = 1;
       break;
     case "总运单件数":
       // console.log('1')
       this.curObject.num = this.inputModelData.realpiece;
       break;
     }
  },
  'curObject.num'(val) {

    if (this.curObject.price) {
        this.curObject.leastwageall = (Number(val) * Number(this.curObject.price)).toFixed(2)
        this.curObject.wageall = (Number(this.curObject.leastwageall) * Number(this.curObject.changerate)).toFixed(2)
    }

},
'curObject.price'(val) {
    if (this.curObject.num) {
        this.curObject.leastwageall = (Number(this.curObject.num) * Number(val)).toFixed(2)
        this.curObject.wageall = (Number(this.curObject.leastwageall) * Number(this.curObject.changerate)).toFixed(2)
    }

},
'curObject.currency'(val) {
    this.curObject.changerate=Number(this.currencyList.filter(i=>i.label==val)[0]['changerate']).toFixed(4)
    if (this.curObject.num && this.curObject.price) {
        this.curObject.leastwageall = (Number(this.curObject.num) * Number(this.curObject.price)).toFixed(2)
        this.curObject.wageall = Number(Number(this.curObject.num) * Number(this.curObject.price) * Number(this.curObject.changerate)).toFixed(2)
    }
},
},
computed:{
  currencyList(){
    let currencyData = JSON.parse(localStorage.currencyData)
      return currencyData.map(i => {
        return {
          label: i.cname,
          value: i.cname,
          changerate:i.basicprice
        }
      })
  },
  jsfs(){
     let groupIdData=JSON.parse(localStorage.getItem('groupType'))
     return groupIdData.filter(i=>i.groupid==33).map(i=>{
      return {
        value:i.id,
        typename:i.typename
      }
     })
  }
},
mounted(){

  this.curObject['gid'] = this.wageinout=='1'?(this.inputModelData.groupid<0?this.inputModelData.gid:''):(this.inputModelData.mawbgid)
  this.curObject['sid'] = this.inputModelData.boguid
  this.curObject['settname'] = this.wageinout=='1'?(this.inputModelData.groupid<0?this.inputModelData.wtxmname:''):(getGysname(this.inputModelData.mawbgid,1))
}
}
let slotTemplate={
  template:` 
  <div>
     <div class="detail basic-information" style="width:1096px;">
                <div class="detail-title">

                  <p style="width:100%">
                  <span style="float:left;margin-top:5px;">运费</span>
                  <span style="float:right">
                    <slot name="button" :data="{type:'运费',wageinout:wageinout}"></slot>
                  </span>
                  </p>
                  
                </div>
                <div class="detail-c">
                  <div>
                     <span>费用种类：</span>
                    <el-radio v-model="mdgData.isall" label="1">单价ALLIN</el-radio>
                    <el-radio v-model="mdgData.isall" label="3">单价++</el-radio>
                     <el-radio v-model="mdgData.isall" label="2">M级++</el-radio>
                    <span>币种：</span>
                    <el-select v-model="mdgData.currency">
                      <el-option
                        v-for="item of currencyOptions"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="levelDiv" v-if="mdgData.isall!='2'">
                    <div class="fix">
                      <p>等级</p>
                      <p>单价</p>
                    </div>
                    <div v-for="i in mdgData.priceTable">
                      <p>{{i.level}}</p>
                      <p><input v-model="i.price" type='number' :disabled="!mdgData.isall"></p>
                    </div>
                  </div>

                  <div v-if="mdgData.isall=='2'" style="width:180px;height:32px;border:1px solid #E8E8E8">
                    <span style="display:inline-block;width:58px;text-align:center;height:32px;line-height:32px;border-right:1px solid #E8E8E8">
                    总价
                    </span>
                    <span style="display:inline-block">
                         <input v-model="mdgData.price" style="width:110px" type='number'>
                    </span>
                  </div>

                  <div class="jffs  input-required">
                    <span>
                      计费方式：
                      <el-radio v-model="mdgData.jffs" label="板外">正常</el-radio>
                      <el-radio v-model="mdgData.jffs" label="板内">包机包板</el-radio>
                    </span>

                    <span style="margin-left:16px;" v-if="mdgData.jffs=='板外'">
                         <span class="fuhao">(</span> 
                         <el-select v-model="mdgData.jsgs.first" placeholder="请选择">
                            <el-option
                              v-for="item in jsList.list"
                              :key="item.value"
                              :label="item.title"
                              :value="item.value">
                            </el-option>
                          </el-select>

                          <span class="fuhao">-</span>
                          <el-select v-model="mdgData.jsgs.second" placeholder="请选择">
                          <el-option
                            v-for="item in jsList.list"
                            :key="item.value"
                            :label="item.title"
                            :value="item.value">
                          </el-option>
                         </el-select>
                          <span class="fuhao">)</span>

                          <span class="fuhao">X</span>
                          <span class="jgsjfp">
                               基港实际分泡
                          </span>

                          <span class="fuhao">+</span>
                          <el-select v-model="mdgData.jsgs.third" placeholder="请选择">
                          <el-option
                            v-for="item in jsList.list"
                            :key="item.value"
                            :label="item.title"
                            :value="item.value">
                          </el-option>
                          </el-select>

                          <span class="fuhao">=</span>
                          <span>基港运费结算重量</span>
                    </span>

                    <span v-if="mdgData.jffs=='板内'&&wageinout=='1'" style="margin-left:100px;">
                    <el-radio v-model="mdgData.accountweightinSelect" label="zdweight">制单毛重</el-radio>
                     <el-radio v-model="mdgData.accountweightinSelect" label="zdjfweight">制单计费重量</el-radio>
                    </span>

                    <span v-if="mdgData.jffs=='板内'&&wageinout=='2'" style="margin-left:100px;">
                    <el-radio v-model="mdgData.accountweightoutSelect" label="zdweight">制单毛重</el-radio>
                     <el-radio v-model="mdgData.accountweightoutSelect" label="zdjfweight">制单计费重量</el-radio>
                    </span>
                  </div>


                </div>
      </div>

      <div class="detail basic-information" style="width:1096px;">
                <div class="detail-title">
                 <p style="width:100%">
                  <span style="float:left;margin-top:5px;">中转费</span>
                  <span style="float:right">
                    <slot name="button" :data="{type:'中转费',wageinout:wageinout}"></slot>
                  </span>
                  </p>
                </div>
                <div class="detail-c">
                <div>
                     <span>费用种类：</span>
                    <el-radio v-model="mdgData.isallzz" label="1">单价</el-radio>
                    <el-radio v-model="mdgData.isallzz" label="2">总价</el-radio>
                    <span>币种：</span>
                    <el-select v-model="mdgData.currencyzz">
                      <el-option
                        v-for="item of currencyOptions"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>

                 <div class="levelDiv" v-if="mdgData.isallzz!='2'">
                    <div class="fix">
                      <p>等级</p>
                      <p>单价</p>
                    </div>
                    <div v-for="i in mdgData.priceTablezz">
                      <p>{{i.level}}</p>

                      <p><input v-model="i.pricezz" type='number' :disabled="!mdgData.isallzz"></p>
                    </div>
                </div>

                <div v-if="mdgData.isallzz=='2'" style="width:180px;height:32px;border:1px solid #E8E8E8">
                    <span style="display:inline-block;width:58px;text-align:center;height:32px;line-height:32px;border-right:1px solid #E8E8E8">
                    总价
                    </span>
                    <span style="display:inline-block">
                         <input v-model="mdgData.pricezz" style="width:110px" type='number'>
                    </span>
                  </div>
                
                <div class="jffs input-required">

            
                         <span class="fuhao">(</span> 
                         <el-select v-model="mdgData.zzjsgs.first" placeholder="请选择">
                            <el-option
                              v-for="item in jsList.list"
                              :key="item.value"
                              :label="item.title"
                              :value="item.value">
                            </el-option>
                          </el-select>

                          <span class="fuhao">-</span>
                          <el-select v-model="mdgData.zzjsgs.second" placeholder="请选择">
                          <el-option
                            v-for="item in jsList.list"
                            :key="item.value"
                            :label="item.title"
                            :value="item.value">
                          </el-option>
                         </el-select>
                          <span class="fuhao">)</span>

                          <span class="fuhao">X</span>
                          <span class="jgsjfp">
                               基港实际分泡
                          </span>

                          <span class="fuhao">+</span>
                          <el-select v-model="mdgData.zzjsgs.third" placeholder="请选择">
                          <el-option
                            v-for="item in jsList.list"
                            :key="item.value"
                            :label="item.title"
                            :value="item.value">
                          </el-option>
                          </el-select>

                          <span class="fuhao">=</span>
                          <span>基港中转结算重量</span>

                  </div>

                </div>
      </div>
  </div>`,
   props:{
    wageinout:String,
    mdgData:{},
    contentList:Array,
    noWatch:Boolean
   },
   data (){
    return{
      jsList:{
        list:[{title:'实际计费重量',value:'sjjfweight',num:''},{title:'制单毛重',value:'zdweight',num:''},{title:'制单计费重量',value:'zdjfweight',num:''},{title:'实际重量',value:'realweight',num:''}],
        first:'',
        second:'',
        third:'',
      },
    }
   },
   methods:{
    //改变单价 price:单价 clafield:mdg+khid分类  wageinout:应收付 field:影响的单价字段 weightField:判断的重量字段 leastField:影响的总价字段 changeField:是否更改 min,max重量区间 showWeight:列表显示的结算重量
    //对应LIST满足重量条件改变单价
    priceChange({price,clafield,wageinout,field,weightField,leastField,changeField,changeField2,min,max,type='单价',showWeight}){
    let mdg=clafield.split('&')[0]
    let id=clafield.split('&')[1] 
    //console.log(111,mdg,id)
    //console.log(this.contentList)
    this.contentList.filter(i=>i.mdg==mdg&&(wageinout=='1'&&id==i.gid||wageinout=='2'&&id==i.mawbgid)).forEach(list=>{

 
      if(list[changeField]=='1'&&!list[changeField2]&&Number(list[weightField])>=min&&Number(list[weightField])<max&&type=='单价'){
          list[field]=price

          list[leastField]=StringNum(Number(price)*Number(list[showWeight]))
        }
        if(type=='总价'&&list[changeField]=='1'&&!list[changeField2]){
          list[field]=price
          list[leastField]=StringNum(price)
          list[showWeight]=1
        }
    })
    },
    //改变重量计算公式 clafield:mdg+khid分类 gs:'计算公式'OR'板内重量' wageinout:应收付 field:影响的重量字段 priceField:影响的单价字段 leastField:影响的总价字段 changeField:是否更改  showWeight:显示的重量字段 fp计算的分泡比例
    //改变重量并且重新计算总价
    changeWeight({clafield,gs,wageinout,field,priceField,leastField,changeField,changeField2,showWeight,fp}){
      let mdg=clafield.split('&')[0]
      let id=clafield.split('&')[1]
      this.contentList.filter(i=>i.mdg==mdg&&(wageinout=='1'&&id==i.gid||wageinout=='2'&&id==i.mawbgid)).forEach(i=>{
        console.log(i[changeField])
        console.log(i[changeField2])
        console.log(wageinout)
        if(i[changeField]=='1'&&!i[changeField2]){
          if(typeof(gs)=='object'){
            let first=Number(i[gs.first]).toFixed(0)
            let second=Number(i[gs.second]).toFixed(0)
            let third=Number(i[gs.third]).toFixed(0)

            if((Number(first)-Number(second))<0){
              i[field]=StringNum((parseFloat((0)*(i[fp]*0.1))+parseFloat(third)),0)
              i[showWeight]=StringNum((parseFloat((0)*(i[fp]*0.1))+parseFloat(third)),0)
            }else{
              i[field]=StringNum((parseFloat((first-second)*(i[fp]*0.1))+parseFloat(third)),0)
              i[showWeight]=StringNum((parseFloat((first-second)*(i[fp]*0.1))+parseFloat(third)),0)
            }


          }else{
            console.log(gs)
            console.log(i[gs])
            console.log(showWeight)
            console.log(field)
            i[field]=Number(i[gs]).toFixed(0)
            i[showWeight]=Number(i[gs]).toFixed(0)
            console.log(i[field])
            console.log(i[showWeight])
          }
          console.log(i)
          this.$set(i,leastField,StringNum(Number(i[priceField]=='--'?0:i[priceField])*Number(i[showWeight])))
        }
      })
    },
    //切换费用种类清空费用单价
    clearPrice(type){ //1运费 2中转费
       let mdg=this.mdgData.field.split('&')[0]
       let id=this.mdgData.field.split('&')[1]
       this.contentList.filter(i=>i.mdg==mdg&&(this.wageinout=='1'&&id==i.gid||this.wageinout=='2'&&id==i.mawbgid)).forEach(i=>{
        if(this.wageinout=='1'&&i.ysPcischange=='1'){
          if(type=='1'&&!i.singleysischange){
            i.inwageallinprice='--'
            i.leastwageallinYf=0
          }else if(type=='2'&&!i.singlezzysischange){
            i.inwageallinprice_trans='--'
            i.leastwageallinZz=0
          }
        }else if(this.wageinout=='2'&&i.yfPcischange=='1'&&!i.singleysischange){
          if(type=='1'&&!i.singleyfischange){
            i.outwageallinprice='--'
            i.leastwagealloutYf=0
          }else if(type=='2'&&!i.singlezzyfischange){
             i.outwageallinprice_trans='--'
             i.leastwagealloutZz=0
          }
          
        }
       })  
    }
   },
   computed:{
       currencyOptions () {
      let currencyData = JSON.parse(localStorage.currencyData)
      return currencyData.map(i => {
        return {
          label: i.cname,
          value: i.cname,
          changerate: i.basicprice
        }
      })
    },


   },
   watch:{
     'mdgData.jffs':{
        handler(val){
          console.log(val)
           if(this.mdgData.isall!='2'&&!this.noWatch){
              if(val=='板外'){
                this.changeWeight({clafield:this.mdgData.field,gs:this.mdgData.jsgs,wageinout:this.wageinout,field:this.wageinout=='1'?'accountweightin':'accountweightout',priceField:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'jgysischange':'jgyfischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight',fp:this.wageinout=='1'?'self_real_bp_freight_in':'cus_real_bp_freight_out'})
              }else{
                this.changeWeight({clafield:this.mdgData.field,gs:this.wageinout=='1'?this.mdgData.accountweightinSelect:this.mdgData.accountweightoutSelect,wageinout:this.wageinout,field:this.wageinout=='1'?'accountweightin':'accountweightout',priceField:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'jgysischange':'jgyfischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight',fp:this.wageinout=='1'?'self_real_bp_freight_in':'cus_real_bp_freight_out'})
              }
              
           }
        },
        immediate:true,
     },
     'mdgData.jsgs':{
        handler(val){
          if(this.mdgData.isall!='2'&&!this.noWatch){//费用种类非单价计算
              this.changeWeight({clafield:this.mdgData.field,gs:val,wageinout:this.wageinout,field:this.wageinout=='1'?'accountweightin':'accountweightout',priceField:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'jgysischange':'jgyfischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight',fp:this.wageinout=='1'?'self_real_bp_freight_in':'cus_real_bp_freight_out'})
          }

        },
        immediate:true,
        deep:true
     },
     'mdgData.zzjsgs':{
        handler(val){
          if(!this.noWatch){
          this.changeWeight({clafield:this.mdgData.field,gs:val,wageinout:this.wageinout,field:this.wageinout=='1'?'zzysweight':'zzyfweight',priceField:this.wageinout=='1'?'inwageallinprice_trans':'outwageallinprice_trans',leastField:this.wageinout=='1'?'leastwageallinZz':'leastwagealloutZz',changeField:this.wageinout=='1'?'zzysischange':'zzyfischange',changeField2:this.wageinout=='1'?'singlzzysischange':'singlezzyfischange',showWeight:this.wageinout=='1'?'zzysweight':'zzyfweight',fp:this.wageinout=='1'?'self_real_bp_trans_in':'cus_real_bp_trans_out'})
          }
        },
        immediate:true,
        deep:true
     },
     'mdgData.isall':{//切换费用种类时清空运费单价和总价、当切换为总价时禁用列表上的重量输入框、从总价切换为单价时重新计算重量
       handler(val,old){
         if(!this.noWatch){

        this.clearPrice(1)
          this.mdgData.priceTable.map(i=>{
            i.price=''
          return i
          })


         console.log(111)
         //console.log(this.contentList)
         this.contentList.forEach(i=>{
          if(this.wageinout=='1'&&i.gid==this.mdgData.field.split('&')[1]){
            i.inputDisableYs=val=='2'?true:false
          }else if(this.wageinout=='2'&&i.mawbgid==this.mdgData.field.split('&')[1]){
            i.inputDisableYf=val=='2'?true:false
          }
         })
         if(val!='2'){
          this.mdgData.price=''
            if(this.wageinout=='2'){//应付默认勾选杂费 isallin
            this.contentList.filter(i=>i.mawbgid==this.mdgData.field.split('&')[1])[0]['zafeiList'].forEach(item=>{
                if (item.isallin === 1) {
                 item.checkboxdisable = true
                 item.checked = true
               }
            })
          }
          //if(old=='2'){ //重新计算重量
            this.$nextTick(()=>{
              this.changeWeight({clafield:this.mdgData.field,gs:this.mdgData.jsgs,wageinout:this.wageinout,field:this.wageinout=='1'?'accountweightin':'accountweightout',priceField:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'jgysischange':'jgyfischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight',fp:this.wageinout=='1'?'self_real_bp_freight_in':'cus_real_bp_freight_out'})
            })
          //}
         }
         }


       },
     },
     'mdgData.isallzz':{
       handler(val,old){
         if(!this.noWatch){
             this.clearPrice(2)
        this.mdgData.priceTablezz.map(i=>{
            i.pricezz=''
            return i
          })
       
           this.contentList.forEach(i=>{
          if(this.wageinout=='1'&&i.gid==this.mdgData.field.split('&')[1]){
            i.inputDisableYsZz=val=='2'?true:false
          }else if(this.wageinout=='2'&&i.mawbgid==this.mdgData.field.split('&')[1]){
            i.inputDisableYfZz=val=='2'?true:false
          }
         })
   
        if(val!='2'){
          this.mdgData.pricezz=''
          if(old=='2'){ //重新计算重量
            this.$nextTick(()=>{
              this.changeWeight({clafield:this.mdgData.field,gs:this.mdgData.zzjsgs,wageinout:this.wageinout,field:this.wageinout=='1'?'zzysweight':'zzyfweight',priceField:this.wageinout=='1'?'inwageallinprice_trans':'outwageallinprice_trans',leastField:this.wageinout=='1'?'leastwageallinZz':'leastwagealloutZz',changeField:this.wageinout=='1'?'zzysischange':'zzyfischange',changeField2:this.wageinout=='1'?'singlzzysischange':'singlezzyfischange',showWeight:this.wageinout=='1'?'zzysweight':'zzyfweight',fp:this.wageinout=='1'?'self_real_bp_trans_in':'cus_real_bp_trans_out'})
            })
          }
        }

         }

       },
     },
     'mdgData.accountweightinSelect':{
      handler(val){
      if(this.mdgData.jffs=='板内'&&this.mdgData.isall!='2'){
        this.changeWeight({clafield:this.mdgData.field,gs:val,wageinout:1,field:'accountweightin',priceField:'inwageallinprice',leastField:'leastwageallinYf',changeField:'jgysischange',changeField2:'singleysischange',showWeight:'yfysweight',fp:'self_real_bp_freight_in'})
      }
      },
      immediate:true
     },
     'mdgData.accountweightoutSelect':{
      handler(val){
      if(this.mdgData.jffs=='板内'&&this.mdgData.isall!='2'){
        this.changeWeight({clafield:this.mdgData.field,gs:val,wageinout:2,field:'accountweightout',priceField:'outwageallinprice',leastField:'leastwagealloutYf',changeField:'jgyfischange',changeField2:'singleyfischange',showWeight:'yfyfweight',fp:'cus_real_bp_freight_out'})
      }
      },
      immediate:true
     },
     'mdgData.priceTable':{
      handler(val){
        if(!this.noWatch){
          val.forEach(i=>{
             this.priceChange({price:i.price,clafield:this.mdgData.field,wageinout:this.wageinout,field:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',weightField:this.wageinout=='1'?'accountweightin':'accountweightout',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'ysPcischange':'yfPcischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',min:i.min,max:i.max,showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight'})
          

        })
        }

      },
      deep:true
     },
     'mdgData.priceTablezz':{
      handler(val){
        if(!this.noWatch){
           val.forEach(i=>{
           this.priceChange({price:i.pricezz,clafield:this.mdgData.field,wageinout:this.wageinout,field:this.wageinout=='1'?'inwageallinprice_trans':'outwageallinprice_trans',weightField:this.wageinout=='1'?'zzysweight':'zzyfweight',leastField:this.wageinout=='1'?'leastwageallinZz':'leastwagealloutZz',changeField:this.wageinout=='1'?'zzysPcischange':'zzyfPcischange',changeField2:this.wageinout=='1'?'singleyszzischange':'singleyfzzischange',min:i.min,max:i.max,showWeight:this.wageinout=='1'?'zzysweight':'zzyfweight'}) 
        })
        }

      },
      deep:true
     },
     'mdgData.price':{
      handler(val){
        if(!this.noWatch){
        this.priceChange({price:this.mdgData.price,clafield:this.mdgData.field,wageinout:this.wageinout,field:this.wageinout=='1'?'inwageallinprice':'outwageallinprice',weightField:this.wageinout=='1'?'accountweightin':'accountweightout',leastField:this.wageinout=='1'?'leastwageallinYf':'leastwagealloutYf',changeField:this.wageinout=='1'?'ysPcischange':'yfPcischange',changeField2:this.wageinout=='1'?'singleysischange':'singleyfischange',min:0,max:100000,type:'总价',showWeight:this.wageinout=='1'?'yfysweight':'yfyfweight'})
        }

      }
     },
    'mdgData.pricezz':{
      handler(val){
          if(!this.noWatch){
          this.priceChange({price:this.mdgData.pricezz,clafield:this.mdgData.field,wageinout:this.wageinout,field:this.wageinout=='1'?'inwageallinprice_trans':'outwageallinprice_trans',weightField:this.wageinout=='1'?'zzysweight':'zzyfweight',leastField:this.wageinout=='1'?'leastwageallinZz':'leastwagealloutZz',changeField:this.wageinout=='1'?'zzysPcischange':'zzyfPcischange',changeField2:this.wageinout=='1'?'singleyszzischange':'singleyfzzischange',min:0,max:100000,type:'总价',showWeight:this.wageinout=='1'?'zzysweight':'zzyfweight'})
          }
          
   
      }
     },

   },
   created(){

   }

}

export default {
  name: 'costConfirmhxPage',
  props: {
    rowData: {
      type: Object,
      required: true
    },
    dataGrouping:{
      type:Object,
      required:true
    },
    visible: Boolean
  },
  components: {
   slotTemplate,airPlaneDeatil,costCom
  },
  data () {
    return {
      showwageinout:'1',//激活应收应付
      wageinout:'',
      activeKhId:{ys:'',yf:''},//激活的委托客户或供应商ID
      activeMdg:{ys:'',yf:''},//激活的目的港
      //content:[],//不同目的港数据列表
      zafeiList:{},//目的港杂费列表
      mawbZitableHeadYs: [//应收
        {field:'check',title:''},
        {field:'operate','title':'修改'},
        {field:'zddlcode','title':'制单代码'},
        {field:'inwageallinclude',title:'含地面费'},
        {field:'mawb',title:'总运单号'},
        {field: 'zdpiece', title: '制单件数' },
        {field: 'jfweight', title: '计费重量' },
        {field:'inwageallinprice',title:'运费单价'},
        {field:'yfysweight',title:'运费结算重量'},
        {field:'leastwageallinYf',title:'运费总价',formatType:2,format:(x=>Number(x).toFixed(2))},
        {field:'inwageallinprice_trans',title:'中转费单价'},
        {field:'zzysweight',title:'中转费结算重量'},
        {field:'leastwageallinZz',title:'中转费结算总价',formatType:2,format:(x=>Number(x).toFixed(2))},

      ],
      mawbZitableHeadYf:[//应付
        {field:'check',title:''},
        {field:'operate','title':'修改'},
        {field:'zddlcode','title':'制单代码'},
        {field:'outwageallinclude',title:'含地面费'},
        {field:'mawb',title:'总运单号'},
        {field: 'zdpiece', title: '制单件数' },
        {field: 'jfweight', title: '计费重量' },
        {field:'outwageallinprice',title:'运费单价'},
        {field:'yfyfweight',title:'运费结算重量'},
        {field:'leastwagealloutYf',title:'运费总价',formatType:2,format:(x=>Number(x).toFixed(2))},
        {field:'outwageallinprice_trans',title:'中转费单价'},
        {field:'zzyfweight',title:'中转费结算重量'},
        {field:'leastwagealloutZz',title:'中转费结算总价',formatType:2,format:(x=>Number(x).toFixed(2))},
      ],
     
      wageItemHead: [
        { field: 'items', title: '服务项目' },
        { field: 'min_price', title: 'MIN' },
        { field: 'price', title: '单价' },
        { field: 'itemstype_out', title: '计费方式' },
        { field: 'currency', title: '币种' },
      ],
      wageItemData: [],
      contentData: {
        
      },
      singleAir:false,//单票航线弹框
      activeMod:'',//激活的单票tab
      boguid:'',//单票boguid
      ysfzmdg:'',//应收复制目的港
      yffzmdg:'',//应收复制目的港
      status:'',//是否显示费用确认TAB
      activeMawb:'',//激活的mawb
      finishJob:[],//制作完成的mawb列表
      currentCost:{},//当前的费用
      noWatch:true,//为了防止切换结算对象时直接监听mdgData.isall 导致priceTable中的price清空
    }
  },
  computed: {
    //过滤显示列表
    rowList(){
      //let backData=JSON.parse(JSON.stringify(this.rowData))
     if(this.wageinout=='1'){
       return this.rowData.list.filter(i=>i.confirmstatus_in=='1'&&i.ysShow)
     }else if(this.wageinout=='2'){
        return this.rowData.list.filter(i=>i.confirmstatus_out=='1'&&i.yfShow)
     }
    },
    //切换目的港数据
    content(){
      if(this.wageinout=='1'){
        return this.rowList.filter(i=>i.mdg==this.activeMdg.ys)
      }else{
        return this.rowList.filter(i=>i.mdg==this.activeMdg.yf)
      }
    },
    khList(){//委托客户或者供应商列表
       var list=[]
       this.rowList.map(i=>{
         if(this.wageinout=='1'){
            return {
            id:i.gid,
            khname:i.wtkhname
            }
         }else if(this.wageinout=='2'){
            return {
            id:i.mawbgid,
            khname:i.gysname.split('-')[1]
            }
         }
       }).filter(i=>{
        if(!list.length||!list.map(item=>item.id).includes(i.id)){
          list.push(i)
        }
       })
       console.log(list)

       //设置默认值
       
       if(list.length){
         if(this.wageinout=='1'){
          this.activeKhId.ys=list[0]['id']
         }else if(this.wageinout=='2'){
          this.activeKhId.yf=list[0]['id']
         }
       }
       // else{
       //   this.wageinout=this.wageinout=='1'?'2':'1'
       //   this.showwageinout=this.showwageinout=='1'?'2':'1'
       // }
       return list
    },
    mdgList(){
    if(this.wageinout){
          return [...new Set(this.rowList.filter(i=>{
      if(this.wageinout=='1'){
        return i.gid==this.activeKhId.ys
      }else if(this.wageinout=='2'){
        return i.mawbgid==this.activeKhId.yf
      }
    }).map(i=>i.mdg))]
    }  

    },

    checkAllYs:{
      get(){
        let n=0
        let length=this.rowList.filter(i=>i.mdg==this.activeMdg.ys&&i.gid==this.activeKhId.ys).length
        this.rowList.filter(i=>i.mdg==this.activeMdg.ys&&i.gid==this.activeKhId.ys).forEach(i=>{
           if(i.ysCheck){
            n++
           }
        })
        return n == length;
      },
      set(val){
        this.rowList.filter(i=>i.mdg==this.activeMdg.ys&&i.gid==this.activeKhId.ys).forEach(i=>{
           i.ysCheck=val
        })
      }
    },
    checkAllYf:{
      get(){
        let n=0
        let length=this.rowList.filter(i=>i.mdg==this.activeMdg.yf&&i.mawbgid==this.activeKhId.yf).length
        this.rowList.filter(i=>i.mdg==this.activeMdg.yf&&i.mawbgid==this.activeKhId.yf).forEach(i=>{
           if(i.yfCheck){
            n++
           }
        })
        return n == length;
      },
      set(val){
        this.rowList.filter(i=>i.mdg==this.activeMdg.yf&&i.mawbgid==this.activeKhId.yf).forEach(i=>{
           i.yfCheck=val
        })
      }
    },
    showTemplate(){
      return Object.keys(this.contentData)
    },
    allinCost(){
      var num=0;
      this.currentCost[this.activeMawb]['costList'].forEach(i=>{
         if(i.isfree=='1'&&i.wageinout=='1'&&i.confirmstatus=='700'){
        num+=Number(i.wageall)
      }
      })
      return StringNum(num)
    },
    alloutCost(){
      var num=0;
      this.currentCost[this.activeMawb]['costList'].forEach(i=>{
         if(i.isfree=='1'&&i.wageinout=='2'&&i.confirmstatus=='700'){
        num+=Number(i.wageall)
      }
      })
      return StringNum(num)
    },

  },
  watch: {
    rowData: {
      immediate: true,
      handler (val) {
        if(val){
          //console.log('111')
         this.rowData.list.forEach(item=>{

            if(item.outwageallinclude){
            this.$set(item,'DmcheckedYf',item.outwageallinclude.indexOf('4')>=0?true:false) 
          }else{
            if(item.zddlcode.indexOf('WFF')>=0){
             this.$set(item,'DmcheckedYf',false) 
            }else{
             if(item.mawbss=='我司运单'&&item.zddlcode.indexOf('WFF')<0){
              this.$set(item,'DmcheckedYf',true) 
             }else{
              this.$set(item,'DmcheckedYf',true) 
             }
            }
          }

          if(item.inwageallinclude){
            this.$set(item,'DmcheckedYs',item.inwageallinclude.indexOf('4')>=0?true:false) 
          }
          //是否选中订单复选框
          this.$set(item,'ysCheck',false)
          this.$set(item,'yfCheck',false)

          //是否禁用输入框，当费用种类为总价时禁止输入
          this.$set(item,'inputDisableYsZz',false)
          this.$set(item,'inputDisableYfZz',false)
          this.$set(item,'inputDisableYs',false)
          this.$set(item,'inputDisableYf',false)
          
          //记录单票进入有没有改动(前端判断)
          this.$set(item,'singleysischange',false)
          this.$set(item,'singleyfischange',false)
          this.$set(item,'singlezzysischange',false)
          this.$set(item,'singlezzyfischange',false)

          //记录运费中转费总价(前端设置)
          // StringNum(Number(item.inwageallinprice=='--'?0:item.inwageallinprice)*Number(item.accountweightin))
          this.$set(item,'leastwageallinYf',StringNum(Number(item.inwageallinprice=='--'?0:item.inwageallinprice)*Number(item.yfysweight)))
          this.$set(item,'leastwageallinZz',StringNum(Number(item.inwageallinprice_trans=='--'?0:item.inwageallinprice_trans)*Number(item.zzysweight)))
          this.$set(item,'leastwagealloutYf',StringNum(Number(item.outwageallinprice=='--'?0:item.outwageallinprice)*Number(item.yfyfweight)))
          this.$set(item,'leastwagealloutZz',StringNum(Number(item.outwageallinprice_trans=='--'?0:item.outwageallinprice_trans)*Number(item.zzyfweight)))

          if(item.isshipace==2&&item.orderguid==-1&&item.childguid>0){//主营不在销售站，应付不显示JOB，应收显示JOB;费用应收可写，应付(isshare>0)只读
            
            this.$set(item,'listType','1')
            this.$set(item,'ysShow',true)
            this.$set(item,'yfShow',false)
          }else if(item.isshipace==1&&item.orderguid>0){
          //作为操作站，有主营,应付显示job 应收不显示job;费用应付可写，应收不可编辑
         
            this.$set(item,'listType','2')
            this.$set(item,'ysShow',false)
            this.$set(item,'yfShow',true)
          }else{
            this.$set(item,'listType','')
            this.$set(item,'ysShow',true)
            this.$set(item,'yfShow',true)
          }
         
          let params = {
          area: item.area,
          hbhtwocode: item.hbh.substring(0,2),
          sfg: item.sfg,
          mawbmdg: item.mdg,
          hbrq: this.rowData.hbrq
          }

      this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubAirCompanyAreaPrice', params, loading: false })
      .then(({ data }) => {
        let list= data.map(obj => {
          obj.checkboxdisable = false
          obj.checked = false
          return obj
        })
        this.$set(item,'zafeiList',list)

      })

         //ysPcischange    应收运费单价改变
         //jgysischange    应收重量改变
         //yfPcischange    应付运费单价改变
         //jgyfischange    应付重量改变
         //zzysPcischange  中转应收单价改变
         //zzysischange  中转应收重量改变
         //zzyfPcischange  中转应付单价改变
         //zzyfischange  中转应付重量改变
         


         
          
         })
       
        }
        
        setTimeout(()=>{
          if(val.list.every(i=>i.ysShow==false)){
            this.wageinout='2'
            this.showwageinout='2'
          }
        },1000)


      }
    },

    visible: {
      immediate: true,
      handler (val) {
        // 关闭弹窗时清空状态数据
        if (!val) {
          
        } else {
          // 弹窗显示时获取费用数据
          // let params = {
          //   area: this.mawbTableSelectData.children[0].area,
          //   hbhtwocode: this.mawbTableSelectData.children[0].hbh.substring(0,2),
          //   sfg: this.mawbTableSelectData.sfg,
          //   mawbmdg: this.mawbTableSelectData.mdg,
          //   hbrq: this.mawbTableSelectData.children[0].hbrq
          // }

          // this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubAirCompanyAreaPrice', params, loading: true })
          // .then(({ data }) => {
          //   this.wageItemData = data.map(item => {
          //     item.checkboxdisable = false
          //     item.checked = false
          //     return item
          //   })
          // })
        }
      }
    },
  
    mdgList:{
      handler(val){
      for(var i in val){
        var list= [
        {title:'-100KG',min:0,max:100},
        {title:'+100KG',min:100,max:300},
        {title:'+300KG',min:300,max:500},
        {title:'+500KG',min:500,max:1000},
        {title:'+1000KG',min:1000,max:1000000},
        ]
        var priceTable=[]
        var priceTablezz=[]
        for(var o in list){
            priceTable.push({
            level:list[o]['title'],
            price:'',
            min:list[o]['min'],
            max:list[o]['max'],
           })

            priceTablezz.push({
            level:list[o]['title'],
            pricezz:'',
            min:list[o]['min'],
            max:list[o]['max'],
           })
        }
        //当没有此[目的港+结算对象]对象时
        if(this.wageinout=='1'&&!this.contentData[val[i]+'&'+this.activeKhId.ys]||this.wageinout=='2'&&!this.contentData[val[i]+'&'+this.activeKhId.yf]){
          //根据目的港+结算对象区分数据
          console.log(12121)
          let field=val[i]+'&'+(this.wageinout=='1'?this.activeKhId.ys:this.activeKhId.yf)
         this.$set(
        this.contentData,field,{
          'ys':{
          isall:'',//应收运费类型
          currency:'人民币',//应收币种
          changerate:'',//应收汇率
          priceTable:priceTable,
          jffs:'板外',//应收计费方式
          jsgs:{first:'sjjfweight',second:'zdjfweight',third:'zdjfweight'},//应收运费计算公式
          isallzz:'',//中转运价类型
          currencyzz:'人民币',//中转币种
          priceTablezz:priceTablezz,
          zzjsgs:{first:'sjjfweight',second:'zdjfweight',third:'zdjfweight'},//应收中转计算公式
          accountweightinSelect:'zdjfweight',
          price:'',//运费总价显示
          pricezz:'',//中转费总价显示
          field:field
          },
          'yf':{
          isall:'',//应付运费类型
          currency:'人民币',//应付币种
          changerate:'',//应付汇率
          priceTable:priceTable,
          jffs:'板外',//应收计费方式
          jsgs:{first:'sjjfweight',second:'zdjfweight',third:'zdjfweight'},//应收运费计算公式
          isallzz:'',//中转运价类型
          currencyzz:'人民币',//中转币种
          priceTablezz:priceTablezz,
          zzjsgs:{first:'sjjfweight',second:'zdjfweight',third:'zdjfweight'},//应收中转计算公式 
          accountweightoutSelect:'zdjfweight',
          price:'',//运费总价显示
          pricezz:'',//中转费总价显示
          field:field
          },
        }
        )
        }
        console.log(this.contentData)

      
      }

      this.activeMdg.ys=val[0]
      this.activeMdg.yf=val[0]

      },  
      
      
      deep:true
 

    }
  },
  methods: {
    //返回
    back () {
      this.$emit('update:visible', false)
    },
    //切换Tab
    // toggleTab(data){
    //   if(data.index!='2'){
    //     this.wageinout=Number(data.index)+1
    //   }
    // },
    //手动修改单价
    //rowData:当前行数据  value:改变的数据  field:改变的字段  weightField:涉及的重量字段  leastField:涉及的总价字段  changeField:涉及的改变字段
    handerPrice({rowData,value,field,weightField,leastField,changeField}){
      rowData[field]=value
      rowData[leastField]=StringNum(Number(value)*Number(rowData[weightField]))
      //rowData[changeField]='2'
    },
    //手动修改重量
    //rowData:当前行数据  value:改变的数据  field:改变的字段  priceField:涉及的单价字段  leastField:涉及的总价字段  changeField:涉及的改变字段
    handerWeight({rowData,value,field,priceField,leastField,changeField}){
      console.log(value)
      rowData[field]=value
      rowData[leastField]=StringNum(Number(value)*Number(rowData[priceField]))
      //rowData[changeField]='2'
    },
    //单票修改
    setSingleAir(rowData,type){//type 应收1和应付2
      this.singleAir=true
      this.boguid=rowData.boguid
      this.activeMod=type=='1'?'应收':'应付'
    },
    //修改结算对象
    changeSetName(type,val){
     this.noWatch=true
     if(type=='1'){
       this.activeKhId.ys=val
     }else{
       this.activeKhId.yf=val
     }
     
     setTimeout(()=>{
       this.noWatch=false
     },1000)
    },
    //改变应收付
    changeWageinout(type){
      this.noWatch=true
      if(type=='1'){
        this.wageinout='1';
        this.showwageinout='1'
      }else{
        this.wageinout='2';
        this.showwageinout='2'
      }
      setTimeout(()=>{
       this.noWatch=false
     },1000)
    },
    //判断单票是否修改  两边航司运费总价是否相等(leastwageall,leastwageallinYf),若不同已单票保存的为准,中转费同理
    getWageChange(data){
      this.singleAir=false
      let rowData=this.rowList.filter(i=>i.boguid==this.boguid)[0]

    if(data.filter(i=>i.items=='航司运费')&&data.filter(i=>i.items=='航司运费').length>0){
       rowData.singleysischange=Number(data.filter(i=>i.wageinout=='1')[0]['leastwageall'])!=Number(rowData.leastwageallinYf)
       if(rowData.singleysischange){
         rowData.leastwageallinYf=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['leastwageall']),2)
         rowData.inwageallinprice=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['price']))
         rowData.yfysweight=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['num']))
       }
       rowData.singleyfischange=Number(data.filter(i=>i.wageinout=='2')[0]['leastwageall'])!=Number(rowData.leastwagealloutYf)
       if(rowData.singleyfischange){
         rowData.leastwagealloutYf=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['leastwageall']),2)
         rowData.outwageallinprice=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['price']))
        rowData.yfyfweight=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['num']))
       }
    }else if(data.filter(i=>i.items=='航司中转费')&&data.filter(i=>i.items=='航司中转费').length>0){
      rowData.singlezzysischange=Number(data.filter(i=>i.wageinout=='1')[0]['leastwageall'])!=Number(rowData.leastwageallinZz)
       if(rowData.singlezzysischange){
         rowData.leastwageallinZz=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['leastwageall']),2)
         rowData.inwageallinprice_trans=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['price']))
         rowData.zzysweight=StringNum(Number(data.filter(i=>i.wageinout=='1')[0]['num']))
       }
       rowData.singlezzyfischange=Number(data.filter(i=>i.wageinout=='2')[0]['leastwageall'])!=Number(rowData.leastwagealloutZz)
       if(rowData.singlezzyfischange){
         rowData.leastwagealloutZz=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['leastwageall']),2)
         rowData.outwageallinprice_trans=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['price']))
         rowData.zzyfweight=StringNum(Number(data.filter(i=>i.wageinout=='2')[0]['num']))
       }
    }
    },
    //复制目的港 field:改变的字段  originField:复制的字段  type:区分运费OR中转  wageinout:区分应收还是应付
    copyMdg({field,originField,type,wageinout}){
       let list=type=='运费'?['isall','currency','changerate','jffs','jsgs','accountweightinSelect','price']:['isallzz','currencyzz','zzjsgs','pricezz']
 
      if(wageinout=='1'){

        let data=JSON.parse(JSON.stringify(this.contentData[originField]['ys']))

        list.forEach(i=>{
            this.contentData[field]['ys'][i]=data[i]
        })

        //监听isall会将priceTable清空，所以加个延时赋值
        setTimeout(()=>{
          this.contentData[field]['ys']['priceTable']=data['priceTable']
        },500)
        


       
      }else{
        let data=JSON.parse(JSON.stringify(this.contentData[originField]['yf']))
        list.forEach(i=>{
        this.contentData[field]['yf'][i]=data[i]
        })
         //监听isall会将priceTable清空，所以加个延时赋值
        setTimeout(()=>{
          this.contentData[field]['yf']['priceTable']=data['priceTable']
        },500)
      }
    },
    //费用确认  应收付和状态
      confirmButton(type,status){
        var inputData=this.currentCost[this.activeMawb]['inputModelData']
        var costList=type=='1'?this.currentCost[this.activeMawb]['costList'].filter(i=>i.wageinout=='1'&&i.yssys=='1'):this.currentCost[this.activeMawb]['costList'].filter(i=>i.wageinout=='2'&&i.yssys=='1')
        // if(type=='1'&&inputData['gid']<0){
        //   return this.$message.error('无委托客户无法操作')
        // }
        var data = {
        boguid: inputData['boguid'],
        wageinout: type,
        status: status,
        area: inputData['area'],
        isFromFob:'',
        guidList: costList.map(i=>i.guid).join(','),
        isyssys: '2',
        old_sendhpoid: inputData.old_sendhpoid || '',
        wagedom: '航线',
        sid: inputData['boguid']
      }
      this.$axios({
        method: 'put',
        url: this.$store.state.webApi + 'api/ExHpoAxplineWageConfirm',
        data: data,
        loading: true
      })
      .then(results=>{
        if (results.data.resultstatus == 0) {
           this.$message.success(results.data.resultmessage||'更新成功')
           this.searchCost({boguid:inputData['boguid'],mawb:inputData['mawb'],type:'new'})
        }else{
           this.$message.error(results.data.resultmessage)
        }
      })
      },

    
    save (status) {
      //console.log(this.content)
      //console.log(this.rowData.list)
      if(!this.rowList.some(i=>i.ysCheck||i.yfCheck)){
        return this.$message.error('请选择订单')
      }
      let currencyData = JSON.parse(localStorage.currencyData)
      let data={shipaceid:this.rowData.shipaceid,status:status,servicecode:'OA0010',boguid:[]}
      let run=true
      for(var i in this.rowList){

        let {mdg,gid,mawbgid,yfCheck,ysCheck,boguid,DmcheckedYf,DmcheckedYs,ysPcischange,jgysischange,yfPcischange,jgyfischange,zzysPcischange,zzysischange,zzyfPcischange,zzyfischange,inwageallinprice,outwageallinprice,accountweightin,accountweightout,inwageallinprice_trans,outwageallinprice_trans,zzysweight,zzyfweight,zafeiList,yfyfweight,yfysweight}={...this.rowList[i]}
        console.log(DmcheckedYf)
        console.log(DmcheckedYs)

        //根据订单mdg+id获取应收应付内容
        let yfContent=this.contentData[mdg+'&'+mawbgid]&&this.contentData[mdg+'&'+mawbgid]['yf']
        let ysContent=this.contentData[mdg+'&'+gid]&&this.contentData[mdg+'&'+gid]['ys']

        if(yfCheck||ysCheck){
          data['boguid'][i]={}
        }

    
        if(yfCheck){//勾选应付
          if(!yfContent.isall){//勾选应付无费用类型
            this.$message.info('请选择费用种类');
            run=false;
            break;
        }
  


        let fieldYf={isoutwageallin:'isall',currencyYf:'currency',yfjsgs:'jsgs',yfjffs:'jffs',accountweightoutSelect:'accountweightoutSelect',isoutwageallin_trans:'isallzz',currencyYfzz:'currencyzz',zzyfjsgs:'zzjsgs'}
        //i rowData List索引  f为field
        Object.keys(fieldYf).forEach(f=>{
          if(f=='isoutwageallin_trans'){
            data['boguid'][i][f]=yfContent[fieldYf[f]]?yfContent[fieldYf[f]]:'-1'
          }else if(f=='yfjsgs'||f=='zzyfjsgs'){
            data['boguid'][i][f]=JSON.stringify(yfContent[fieldYf[f]])
          }else{
            data['boguid'][i][f]=yfContent[fieldYf[f]]
          }
        })

        data['boguid'][i]['changerateYf']=getRate(yfContent['currency'])//运费汇率
        data['boguid'][i]['changerateYfzz']=getRate(yfContent['currencyzz'])//中转费汇率
        data['boguid'][i]['boguid']=boguid//订单boguid
        data['boguid'][i]['outwageallinclude']=DmcheckedYf?'4':'-1'//是否勾选地面服务费
        data['boguid'][i]['yfPcischange']=yfPcischange//应付运费单价改变 1.未改 2.改动
        data['boguid'][i]['jgyfischange']=jgyfischange//应付重量改变 1.未改 2.改动
        data['boguid'][i]['zzyfPcischange']=zzyfPcischange//中转应付单价改变 1.未改 2.改动
        data['boguid'][i]['zzyfischange']=zzyfPcischange//中转应付重量改变 1.未改 2.改动
        data['boguid'][i]['outwageallinprice']=!outwageallinprice||outwageallinprice=='--'||outwageallinprice==666666?666666:outwageallinprice
        data['boguid'][i]['outwageallinprice_trans']=!outwageallinprice_trans||outwageallinprice_trans=='--'||outwageallinprice_trans==666666?666666:outwageallinprice_trans
        data['boguid'][i]['zzyfweight']=zzyfweight
        data['boguid'][i]['accountweightout']=accountweightout


        data['boguid'][i]['yfselectitems']=this.rowList.filter(list=>list.mdg==this.rowList[i]['mdg'])[0]['zafeiList'].filter(i=>i.checked)//应付勾选杂费

        //this.content.filter(list=>list.mawbgid==this.rowList[i]['mawbgid'])[0]['zafeiList'].filter(i=>i.checked)
        
        data['boguid'][i]['yfyfweight']=yfyfweight
        }

        if(ysCheck){//勾选应收
          if(!ysContent.isall){//勾选应付无费用类型
            this.$message.info('请选择费用种类');
            run=false;
            break;
        }

        let fieldYs={isinwageallin:'isall',currencyYs:'currency',ysjsgs:'jsgs',ysjffs:'jffs',accountweightinSelect:'accountweightinSelect',isinwageallin_trans:'isallzz',currencyYszz:'currencyzz',zzysjsgs:'zzjsgs'}
        //i rowData List索引  f为field
        Object.keys(fieldYs).forEach(f=>{
          if(f=='isinwageallin_trans'){
            console.log(ysContent[fieldYs[f]])
            data['boguid'][i][f]=ysContent[fieldYs[f]]?ysContent[fieldYs[f]]:'-1'
          }else if(f=='ysjsgs'||f=='zzysjsgs'){
             data['boguid'][i][f]=JSON.stringify(ysContent[fieldYs[f]])
          }else{
            data['boguid'][i][f]=ysContent[fieldYs[f]]
          }
        })
      
        data['boguid'][i]['changerateYs']=getRate(ysContent['currency'])
        data['boguid'][i]['changerateYszz']=getRate(ysContent['currencyzz'])
        data['boguid'][i]['boguid']=boguid
        data['boguid'][i]['inwageallinclude']=DmcheckedYs?'4':'-1'
        data['boguid'][i]['ysPcischange']=ysPcischange//应收运费单价改变 1.未改 2.改动
        data['boguid'][i]['jgysischange']=jgysischange//应收重量改变 1.未改 2.改动
        data['boguid'][i]['zzysPcischange']=zzysPcischange//中转应收单价改变 1.未改 2.改动
        data['boguid'][i]['zzysischange']=zzysPcischange//中转应收重量改变 1.未改 2.改动
        data['boguid'][i]['inwageallinprice']=!inwageallinprice||inwageallinprice=='--'||inwageallinprice==666666?666666:inwageallinprice
        data['boguid'][i]['inwageallinprice_trans']=!inwageallinprice_trans||inwageallinprice_trans=='--'||inwageallinprice_trans==666666?666666:inwageallinprice_trans
        data['boguid'][i]['zzysweight']=zzysweight
        data['boguid'][i]['accountweightin']=accountweightin
         data['boguid'][i]['ysselectitems']=zafeiList//应付勾选杂费
         data['boguid'][i]['yfysweight']=yfysweight
        }

      }

      function getRate(currency){
         let changerate=''
         for (let item of currencyData) {
          if (item.cname === currency) {
            changerate = item.basicprice
            break
          }
        }
        return changerate
      }
      data.boguid=data.boguid.filter(i=>i.boguid)

      console.log(JSON.stringify(data))
      if(!run) return
      this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/ExHpoaxplineCommMonitor', data, loading: true, tip: true })
      .then(( result ) => {
        if (result.data.resultstatus === 0) {
          this.$message.success(result.data.resultmessage)
          //this.status='费用确认'
          //this.wageinout='3'
          //勾选的job,根据勾选的boguid筛选
         // this.finishJob=this.rowList.filter(i=>data['boguid'].map(item=>item.boguid).includes(i.boguid))

         // this.finishJob.forEach(i=>{
         //  this.$set(this.currentCost,i.mawb,{inputModelData:{},costList:[]})
         // })

         // this.activeMawb=this.finishJob[0]['mawb']
         // this.searchDetail(this.finishJob[0]['boguid'],this.finishJob[0]['mawb'])
         // this.searchCost({boguid:this.finishJob[0]['boguid'],mawb:this.finishJob[0]['mawb']})

        }else{
          this.$message.error(result.data.resultmessage)
        }
      }) 
    },
    //制作完成费用
    searchCost(props){
      console.log(props)
       if(this.currentCost[props.mawb].costList.length>0&&!props.type) return
       this.$axios({
          method: 'get',
          url: this.$store.state.webApi + 'api/ExBoBaseAllWageByboguid',
          params: {
            boguid: props.boguid
          },
          loading: true,
          tip: false
        })
       .then(({data})=>{
        
        this.$set(this.currentCost[props.mawb],'costList',data.filter(i=>i.wagedom=='航线'))
        console.log(this.currentCost)
       })
    },
    //制作完成单票明细
    searchDetail(boguid,mawb){
      if(this.currentCost[mawb].inputModelData.boguid) return
        this.$axios({
          method: 'get',
          url: this.$store.state.webApi + 'api/ExHpoAxplineMateShipspaceInfo',
          params: {
            boguid: boguid
          },
          loading: true,
          tip: false
        })
      .then(({data})=>{

         //this.inputModelData.wtxmname=getWtxmname(this.inputModelData.gid,1)
         //data.resultdic.allinfo.wtxmname=getWtxmname(this.inputModelData.gid,1)
         this.$set(this.currentCost[mawb],'inputModelData',data.resultdic.allinfo)
         this.currentCost[mawb]['inputModelData']['wtxmname']=getWtxmname(data.resultdic.allinfo.gid,1)
         console.log(this.currentCost[mawb]['inputModelData'])
      })

    }



      
      
      // if (!this.mawbTableSelectIndex === '') {
      //   return this.$message.error('请选择订单')
      // }
      // if (!this.contentData.isallin) {
      //   return this.$message.error('请选择费用种类')
      // }
      // if (!this.contentData.currency) {
      //   return this.$message.error('请选择币种')
      // }

      // let data = {...this.contentData}
      // data.shipaceid = this.rowData.shipaceid
      // data.pricelist = this.wagePriceTableData.map(i => i.price || '666666')
      // data.selectitems = this.wageItemData.filter(i => i.checked)
      // data.status = status
      // data.boguid = this.mawbTableSelectData.children.reduce((list,value)=>{
      // list.push({
      //      boguid:value.boguid,
      //      outwageallinclude:value.Dmchecked?'4':'-1'
      //     })
      //     return list
      // },[])
      // data.servicecode = 'OA0010'
      // for (let item of this.currencyOptions) {
      //   if (item.value === data.currency) {
      //     data.changerate = item.changerate
      //     break
      //   }
      // }

      // this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/ExHpoaxplineCommMonitor', data, loading: true, tip: true })
      // .then(({ data }) => {
      //   if (data.resultstatus === 0) {
      //     this.back()
      //   }
      // })

  }
}
</script>

<style lang="less" scoped>
// 公共
 .color(@color){
   color:@color;
   font-weight:bold;
  }
.cost-confirmhx-page {
  .head{
    font-weight: bold;
    text-align:center;
    font-size:16px;
    letter-spacing: 0.1em;
    color:#333;
  }
  .title{
    margin-top:12px;
    margin-bottom:8px;
    //letter-spacing: 0.1em;
    .blue{
       color:#0F5A8C;
       margin-right:6px;
       font-weight:bold;
    }
  }
  .titleLabel{
    .el-tabs__nav-wrap{
     margin-bottom:0px;
    }
    /deep/.el-tabs__header{
      border-bottom:none!important;
    }
    /deep/.el-tab-pane{
      padding:0;
    }
    /deep/.el-tabs__item{
      padding:0!important;
      border:none!important;
      &:nth-child(2){
        padding-left:2px!important;
      }
    }
    .badgeLabel{
    width:95px;
    height:34px;
    line-height: 34px;
    border-radius:4px;
    display:inline-block;
    text-align:center;
    background:#fff;
  }

  .badgeGreen{
    background:rgba(91, 176, 29);
    color:#fff;
  }
  .badgeGreenNa{
    background:rgba(91, 176, 29, .1);
    color:rgba(0, 204, 0, 1);
  }
  .badgeRed{
   background:rgb(235, 0, 0);
   color:#fff;
  }
  .badgeRedNa{
   background:rgba(235, 0, 0, .1);
   color:#EB0000;
  }
  .badgeGrey{
    background:#E8E8E8;
   color:#999999;
  }
  .khname{
   width:214px;
   height:28px;
   text-align:center;
   border-radius:16px;
   line-height:28px;
   background:#E8E8E8;
   color:#999999;
   overflow: hidden;
   text-overflow:ellipsis; 
   white-space: nowrap;
   display:inline-block;
   margin-right:8px;
   cursor:pointer;
   padding-left:10px;
   padding-right:10px;
  }
  .active{
    background:#0F5A8C;
    color:#fff;
  }
  .mdgLabel{
    margin-top:24px;
    /deep/.el-tabs__item{
      padding:0 25px!important;
    }
    /deep/.is-active{
      font-weight:bold!important;
    }
   /deep/.detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      display: flex;
      align-items: center;
      height: 32px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-c {
      padding: 20px;
      .levelDiv{
        border:1px solid #E8E8E8;
        border-bottom:none;
        border-right:none;
        width:540px;
        margin-top:12px;
        color:#333;
        .fix{
         width:58px;
         margin-left:0px;
        }
        div{
          display:inline-block;
          text-align: center;
          width:100px;
          margin-left:-5px;
          p{
            height:32px;
            line-height: 32px;
            width:100%;
            border-right:1px solid #E8E8E8;
            border-bottom:1px solid #E8E8E8;
            text-align:center;
            input{
              width:90%;
              height:27px;
              vertical-align:top;
              &:nth-child(n+2){
                margin-left:7px;
              }
            }
          }
        }
      }
      .jffs{
        margin-top:12px;
        .el-select{
          width:120px;
        }
        .jgsjfp{
          height:28px;
          width:120px;
          display:inline-block;
          border:1px solid #C0C4CC;
          line-height:27px;
          border-radius:4px;
          background:#fff8ef;
          text-indent: 8px;
          vertical-align: bottom;
          font-size:12px;
        }
      }
      input[type=number] {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        -moz-appearance: textfield;
    }

    }
   
  }
  }
  .zftitle{
        width:480px;
        text-indent: 16px;
        background:#f8f8f8;
        border:1px solid #e8e8e8;
        color:#0F5A8C;
        height:32px;
        line-height:32px;
        font-size:14px;
    }
    .commontable{
      margin-top:20px;
      /deep/.el-input{
        .el-input__inner{
          background:#fff8ef;
        }
      }
    }
  }
  
  /deep/ .mawbzitable {
    background: #e8e8e8;
    tr {
      background: #e8e8e8;
    }
  }
  .wage-c {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .wage-right {
      width: 40%;
    }
    .wage-left {
      flex: 1;
      margin-right: 20px;
      .wage-price {
        width: 80%;
        margin-top: 10px;
      }
      .tip {
        color: red;
      }
    }
  }
  .btn-c {
    display: flex;
    justify-content: flex-end;
  }

    .totalTopInfo{
    height:32px;
    border-bottom:1px solid #e8e8e8;
    padding-bottom:10px;
    margin-top:20px;
    margin-bottom:20px;
    .leftTitle{
     color:#0f5a8c;
     font-weight:bold;
     float:left;
    }
    .rightTitle{
     float:right;
     .green{.color(green)};
     .red{.color(red)};
     .orange{.color(orange)}
    }
  }
  .costTitle{
    padding-bottom:8px;
    border:1px solid #e4e7ed;
    height:32px;
    line-height:30px;
    margin-bottom:12px;
    border-left:2px solid #00cc00;
    background:#f8f8f8;
    padding-left:16px;
  }
}
</style>