<template>
  
  <div v-show="inputModelData.boguid">
  <div style="background:#fff" v-if="visibleI">
<!--   {{fareOutputViewData.outwageallinclude}} -->
 <!--  {{mawbCharge}} -->
<!--   {{switchWatch}} -->
<!--   {{inputModelData.outwageallinclude}} -->
<!-- {{dmfwf}} -->
    <!-- 基本信息 -->
    <infoList  :ifopendetail="false" :inputModelData="inputModelData" :name="'签单'">
       <template slot="wageAlert">
         <span style="color:red" v-if="(wageBohuiYs||wageBohuiYf)">有{{wageBohuiYs?`${wageBohuiYs}条应收费用驳回`:''}}{{(wageBohuiYs&&wageBohuiYf)?',':''}}{{wageBohuiYf?`${wageBohuiYf}条应付费用驳回`:''}}未处理!</span>
     </template>
      <template slot="betgroup2">
        <el-button  @click="airLineOpen" v-if="switchHxKh">切换至客服费用</el-button>
      </template>
    </infoList>

    <!-- 汇总信息 -->
    <div class="totalTopInfo" v-if="inputModelData.czlx=='自货'||inputModelData.czlx=='唯凯配舱'">
      <span class="leftTitle">汇总信息</span>
      <span class="rightTitle">
        <span style="margin-right:120px;">
          航线应收：
          <span class="green">{{Number(allinCost).toFixed(2)}}</span>
        </span>
        <span style="margin-right:120px;">
          航线应付：
          <span class="red">{{Number(alloutCost).toFixed(2)}}</span>
        </span>
        <span>
          航线利润：
          <span class="orange">{{Number(allinCost-alloutCost).toFixed(2)}}</span>
        </span>
      </span>
    </div>

<!--     <div style="position:relative;margin-bottom:70px;">
      <div style="position:absolute;right:0px;top:10px;z-index:1000">

        <el-button type="primary" :disabled="monitor==2" @click="saveDocument('1','1')">保存</el-button>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div> -->


  </div>
  <!-- 基本信息END -->



  <!-- 运费应收应付自货 -->
  <div style="position:relative">
  <!-- <el-button style="position:absolute;right:8px;top:8px;z-index:99" @click="dialogFormVisible=true">服务编辑</el-button> -->
  <el-tabs type="border-card" style="margin-top:20px;transform:translate(0,0);position:relative" v-model="activeMod" class="servicePort" >

  

  <el-tab-pane label="航线签单" name='签单'>
  <span slot="label" style="color:#9cd7ff;width:96px;display:inline-block;text-align:center;">航线签单</span>
  <div class="detail-c" style="max-width:max-content;padding-bottom:8px;" :class="getSignDisabled">

                          
<div class="input-item width100" style="margin-left: 40px;margin-bottom:15px;" v-if="inputModelData.guid">
    <div class="input-title">总运单号：{{inputModelData.mawb}}</div>
    <div class="input-content">
       <!--  <el-input v-model="inputModelData.mawb" style="width:100px;" disabled></el-input> -->
       <!--  <el-button  @click="configMawb" >配置总运单</el-button>
        <el-button  @click="unConfigMawb" :disabled="inputModelData.mawb?false:true">解除总运单</el-button> -->
        <span style="margin-left:60px;margin-right:20px;" v-if="inputModelData.mawb&&inputModelData.system=='空出'">航空公司：{{inputModelData.airCompany}}</span>
        <span style="margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">运单供应商：{{inputModelData.gysname}}</span>
        <span style="margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">总运单所属：{{inputModelData.mawbss}}</span>
        <span style="margin-left: 20px;">是否安检前：{{inputModelData.serviceList.filter(i=>i.servicecode=='AA0230')[0]['isdel']=='1'?'是':'否'}}</span>
    </div>
</div>
                                 

    <div style="display:inline-block;width:850px">
      <el-form
      :inline="true"
      label-width="110px"
      class="zdPane"
      style="padding-left:8px;"
      >

      <el-row>

      <el-form-item label="航班号：">
      <el-input
      v-model="inputModelData['yqhbh']"
      :disabled="inputModelData.pcstatus>=100"
      v-verify="'uppercase'"
      style="width:80px"
      ></el-input>
    </el-form-item>

    <el-form-item label="航班日期：">
    <el-date-picker
    v-model="inputModelData['yqhbrq']"
    :value-format="'yyyy-MM-dd'"
    :placeholder="'选择日期'"
    :disabled="inputModelData.pcstatus>=100"
    clearable
    style="width:140px"
    ></el-date-picker>
  </el-form-item>

  <el-form-item label="起飞时间：">
  <span>{{ inputModelData['yjqfsj'] | formatDate('hh:mm') }}</span>
</el-form-item>

  <el-form-item label="中转港：" class="input-required width90">
  <pageSelect
  :pagetype="6"
  :modelval.sync="inputModelData['zzg']"
  :disabled="inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!='2'"
  :servicecode="zzgList"
  style="width:80px"
  ></pageSelect>
</el-form-item>

</el-row>

<!-- <el-row>
<el-form-item label="实际件数：">
<span>{{inputModelData.realpiece}}</span>
</el-form-item>
<el-form-item label="重量：">
<span>{{Number(inputModelData.realweight).toFixed(2)}}</span>
</el-form-item>
<el-form-item label="体积：">

<span style="margin-right:20px;display:inline-block;width:90px">{{Number(inputModelData.realvolume).toFixed(3)}}</span>

</el-form-item>
<el-form-item style="margin-left:26px;">
<span style="color:#51A74E;" v-if="JudgeBubblesFunc(1)>0">重货</span>
<span v-if="JudgeBubblesFunc(1)==0">平货</span>
<span style="color:#FF5850" v-if="JudgeBubblesFunc(1)<0">泡货</span>
</el-form-item>
</el-row>
 -->
<!-- <el-row>
<el-form-item label="签单件数：">
<span>{{inputModelData.signpiece}}</span>
</el-form-item>
<el-form-item label="签单重量：">
<span>{{Number(inputModelData.signweight).toFixed(2)}}</span>
</el-form-item>
<el-form-item label="签单体积：">

<span style="margin-right:20px;display:inline-block;width:90px">{{Number(inputModelData.signvolume).toFixed(3)}}</span>

</el-form-item>
</el-row>
 -->
<el-row>
<el-form-item label="吃泡：" :class="[JudgeBubblesFunc(1)<0?'input-required':'']">
<el-input v-model="inputModelData.cp" v-verify="'fixedTwo'">

<span slot="suffix" style="margin-right:2px;">%</span>
</el-input>
<!--                 <el-input v-model="inputModelData.cp" v-verify="'fixedTwo'" :disabled="JudgeBubblesFunc(1)>
                  0" style="width:160px;">
                  <span slot="suffix" style="margin-right:2px;">%</span>
                </el-input> -->

              </el-form-item>
<!--               <el-form-item label="报关重量：">
              <span>{{Number(inputModelData.bgweight).toFixed(2)}}</span>

            </el-form-item> -->
          </el-row>

          <el-row>
          <el-form-item label="制单件数：">
          <span>{{inputModelData.zddrstatus=='2'?inputModelData.zdpiece:inputModelData.bgpiece?inputModelData.bgpiece:inputModelData.realpiece}}</span>
        </el-form-item>
        <el-form-item label="重量：">

        <span>{{inputModelData.zddrstatus=='2'?Number(inputModelData.zdweight).toFixed(2):Number(inputModelData.bgweight?inputModelData.bgweight:inputModelData.realweight).toFixed(2)}}</span>
      
      </el-form-item>

      <el-form-item label="体积：" >
      <span>{{inputModelData.zddrstatus=='2'?Number(inputModelData.zdvolume).toFixed(3):inputModelData.cp?Number(inputModelData.zdvolume).toFixed(3):Number(inputModelData.realvolume).toFixed(3)}}</span>

    </el-form-item>
    <el-form-item label="计重：">
    <span>{{Number(inputModelData.jfweight).toFixed(2)}}</span>
             
          </el-form-item>



        </el-row>
        <el-row>

    </el-row>
  </el-form>

  <el-button type="primary" style="margin-left:110px;margin-top:12px;" :disabled="(inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!='2')||monitor==2" @click="modZdInfoS">修改制单信息</el-button>
  <el-button type="primary" :disabled="(inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!='2')||monitor==2" @click="zdInfoOperation(2)">导入制单信息</el-button>
  <el-button type="primary" :disabled="(inputModelData.dzstatus>=300&&inputModelData.commbillmodifystatus!='2')||monitor==2" @click="delZdInfo">删除制单信息</el-button>
  </div>
  <div style="display:inline-block;width:600px;;vertical-align:top;position:relative" class="left-item">
    <commonTable class="commonTable" :head="sizeTableHead" :table-data="sizeData" style="position:relative;" :showZiIndex="showZiIndex">
      <template slot="type" slot-scope="props" v-if="props.data.value=='实际'||props.data.value=='签单'">
      <i class="el-icon-plus" style="margin:0;font-size:14px;color:#000;color:#999;font-weight:bold" v-if="!showZiIndex.includes(props.data.index)" @click="showZiIndex.push(props.data.index)"></i>
      <i class="el-icon-minus" style="margin:0;font-size:14px;color:#0f5a8c;font-weight:bold"  @click="showZiIndex.splice(showZiIndex.indexOf(props.data.index),1)" v-if="showZiIndex.includes(props.data.index)"></i>
      {{props.data.value}}
      </template>

      <template slot="description" slot-scope="props">
        <el-tooltip effect="dark" :content="props.data.row.description" placement="top">
        <span>{{props.data.row.description.substring(0,10)}}</span>
        </el-tooltip>
      </template>

      <template slot="ziTable" slot-scope="props">
        <table style="table-layout: fixed;box-sizing: border-box;">
        <tr v-for="i in props.data.row.ziTable" style="background:#fff8ef">
          <td style="width:110px;text-align:left;padding-left:5px;">
            {{i.wtLength||i.wtLength==0?'--':i.wtLength}}
          </td>
          <td style="width:112px;text-indent:2em;">
            {{i.type}}
          </td>
          <td style="width:199px;text-align:left;padding-left:5px;">
            {{i.size}}
          </td>
          <td style="width:112px;text-align:left;padding-left:5px;">
            {{i.jfweight}}
          </td>
          <td style="width:70px;text-align:left;padding-left:5px;">
            --
          </td>
          <!--         <td>
            <el-tooltip effect="dark" :content="i.description" placement="top">
            <span>{{i.description.substring(0,10)}}</span>
              </el-tooltip>
          </td> -->
        </tr>
        </table>
      </template>
    </commonTable>
      <div style="position:absolute;right:-30px;height:193px;width:30px;border:1px solid #e8e8e8;border-left:0px;writing-mode: vertical-lr;text-align: center;line-height: 30px;cursor:pointer;background:#0f5a8c;top:0;color:#fff" >
        <sizeInfo :boguid="inputModelData.boguid" pagetype=2>
            尺寸信息
        </sizeInfo>
      </div>
  </div>
</div>
<p style="height:1px;width:96%;background:#e8e8e8;margin:20px auto 20px;"></p>
<div class="detail-c" style="max-width:1300px">
  <newFormCmpt
  :view-data.sync="zdBasicInfo"
  :model-data.sync="inputModelData"
  ></newFormCmpt>

</div>


</el-tab-pane>

<!-- 应付运价start -->
<el-tab-pane label="应付运价" name='应付'>
<span slot="label" class="badgeLabel badgeRed" v-show="monitor!=2&&inputModelData&&inputModelData.czlx!='代操作'">应付运价</span>

<div class="input-item width100" style="margin-bottom:18px;margin-top:18px;" v-if="inputModelData.guid">
    <div class="input-title">总运单号：{{inputModelData.mawb}}</div>
    <div class="input-content">
        <span style="margin-left:60px;margin-right:20px">
          制单代理代码：{{inputModelData.zddlcode}}
        </span>
        <span style="margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">总运单所属：{{inputModelData.mawbss}}</span>
        <span v-if="Number(this.inputModelData.childguid)<0">运单供应商：{{inputModelData.gysname}}</span>
        
    </div>
</div>

<div class="detail-c content-pay" :class="getDealWithFreightDisalbed" style="display:flex;justify-content:space-between;width:1280px;">


<!-- @@签单修改原先备注 -->
<!--   <newFormCmpt    :view-data.sync="fareOutputViewData"
  :model-data.sync="inputModelData">

  <template slot="accountweightout">
    <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightout:'0.00'}}</span>
    <div style="display:inline-block">
      <el-input
      v-model="inputModelData.accountweightout"
      style="width:80px;"
      @input="accountInput('accountweightout')"
      ></el-input>
    </div>
     <div style="width:240px;">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
  </template>
  <template slot="accountweightoutZz">
    <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightoutZz:'0.00'}}</span>
    <div style="display:inline-block">
      <el-input
      v-model="inputModelData.zzyfweight"
      style="width:80px;"
      @input="accountInput('zzyfweight')"
      ></el-input>
    </div>
     <div style="width:240px;">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
  </template>
</newFormCmpt> -->
<!-- @@新签单逻辑页面 -->
<div style="width:1080px;">
<div class="detail basic-information" >
          <div class="detail-title">
            <p>运费</p>
          </div>
          <div class="detail-c">
          <newAssignForm :inputModelData="inputModelData" type="运费" :view-data="fareOutputViewData" wageinout="2" ref="accountweightout" ></newAssignForm>
          </div>

</div>

<div class="detail basic-information" >
          <div class="detail-title">
            <p>中转费</p>
          </div>
          <div class="detail-c">
          <newAssignForm :inputModelData="inputModelData" type="中转费" :view-data="fareOutputViewData" wageinout="2" ref="accountweightoutzz" ></newAssignForm>
          </div>
</div>

</div>


<div v-if="smallCostDataYf" style="width:180px;">
  <div style="background:#f8f8f8;border:1px solid #e8e8e8;height:32px;color:#0f5a8c;font-weight:bolder;text-indent:12px;font-size:14px;line-height:32px;">杂费</div>
  <commonTable class="commonTable" :head="smallCostHead" :table-data="smallCostDataYf" style="position:relative;" :isMultiSelect="yingfustatus?false:true"></commonTable>

</div>

</div>

<div class="detail mawbPayment detailPaneRed costTable1" style="margin-top:12px;" :class="[!inputModelData.mawb?'disabled':'']">

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid red;background:#f8f8f8;padding-left:16px;">

    <div style="margin-right:16px;letter-spacing:0.1em">
      <span style="color:red;font-weight:bold;letter-spacing:0.1em">总应付:¥{{Number(alloutCost).toFixed(2)}}</span>
            <!--      <span v-for="(item,index) in currencyCost.payment" :style="{'color':'red','margin-left':index>
            0?'15px':'','font-weight':'bold'}">
            <span style="margin-right:8px;">{{item.currencyFh}}</span>
            <span :title="item.currency">{{item.money}}</span>
          </span>
        -->
          <!--      <span style="float:right;color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;margin-left:12px;margin-right:8px;">
          平均每公斤毛利:￥{{Number(mawbInformation['accountweightin'])=='0'?'0.00':Number(Number(zdtotalCharge-zdtotalPayment)/Number(mawbInformation['accountweightin'])).toFixed(2)}}
        </span>
        <span v-if="!isFromFob" style="float:right;color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;">折合人民币盈利:￥{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>
      -->
    </div>

      <!--     <div style="float:right;color:#0f5a8c;font-size:14px;font-weight:bold;margin-right:8px;cursor:pointer" @click="wageOutCarryIn">
      <span>应付带应收</span>
      <span>
        <img src="../../../boStatic/images/jiantou.png"></span>
    </div>
  -->
</div>
<el-row class="detail-title">
<el-col :span="3">
<p>应付费用总览</p>
</el-col>
<!-- type 批量确认无法点击费用确认 -->
<el-col :span="21" style="font-size:12px;font-weight:normal;text-align:right;" v-if="!type">
<span  style="float:right;margin-top:-1px;">
  <el-button type="primary" size="mini" @click="saveDocument('1','4')" :disabled="yingfustatus">应付确认</el-button>
  <el-button type="primary" size="mini" @click="saveDocument('1','5')" :disabled="!yingfustatus">取消应付确认</el-button>
</span>
</el-col>
</el-row>
<div class="detail-c">
  <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbPayment" style="position:relative" :tableIndex="1" :colorIndex="modCostIndex" :wagetype="wagetype" v-if="mawbPayment" :name="1">

    <template slot="firstTd" slot-scope="props">

      <td> <i class="icon-save" @click="addCost('2')" :class="[!curObjectKyYf.items||!curObjectKyYf.num||!curObjectKyYf.price||curObjectKyYf.leastwageall==0?'disabled':'']"></i>
       <i class="el-icon-close" @click="clearCost('2')"></i>
     </td>
     <td>
      <input type="checkbox" v-model="curObjectKyYf.isfree"></td>
      <td>
        {{curObjectKyYf.confirmstatus!='--'&&curObjectKyYf.confirmstatus?curObjectKyYf.confirmstatus:'--'}}
      </td>
        <!-- <td>
        <el-select v-model="curObjectKyYf.otherno" style="width:150px;">

          <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"></el-option>
        </el-select>
      </td>
    -->
    <td style="display:inline-flex;border:none;width:100%;">

      <page-select :modelval.sync="curObjectKyYf.gid" :pagetype="3" @change="getYfSettname" :disabled="curObjectKyYf.disabled" :area="inputModelData.area" v-if="inputModelData.area"></page-select>
    </td>
    <td>
      <page-select :modelval.sync="curObjectKyYf.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :disabled="curObjectKyYf.isallin=='1'" :servicecode="'航线应付'" @change="getYfServiceData"></page-select>
    </td>
    <td>
      <el-select v-model="curObjectKyYf.wagetype" style="width:130px;" :disabled="inputModelData.isoutwageallin_trans=='2'&&curObjectKyYf.items=='航司中转费'&&curObjectKyYf.ismodify=='2'">

      <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"  ></el-option>
    </el-select>
  </td>
  <td>
    <el-input v-model="curObjectKyYf.num" style="width:100px;" @blur="yanzhenzzF('2','1','num')" :disabled="inputModelData.isoutwageallin_trans=='2'&&curObjectKyYf.items=='航司中转费'&&curObjectKyYf.ismodify=='2'"></el-input>
  </td>
  <td>
    <el-input v-model="curObjectKyYf.price" style="width:100px;" @blur="yanzhenzzF('2','1','price')"></el-input>
  </td>
  <td>
    <el-select v-model="curObjectKyYf.currency" style="width:100px;">

    <el-option v-for="(item,index) in currencyList"
    :key="index"
    :label="item"
    :value="item"></el-option>
  </el-select>
</td>
<td>
  <el-input v-model="curObjectKyYf.leastwageall" style="width:100px;" :disabled="true"></el-input>
</td>

<td>
  <el-input v-model="curObjectKyYf.wageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYf.changerate" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYf.remark" style="width:100px;"></el-input>
</td>

</template>
<template slot="operate" slot-scope="props">
  <i class="el-icon-setting" v-if="props.data.row.status==-1||props.data.row.status==500" title='修改费用' @click="modCost('2',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'?'disabled':'']"></i>
  <i class="el-icon-delete" v-if="props.data.row.status==-1||props.data.row.status==500" title='删除费用' @click="delCost('2',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'||props.data.row.isallin=='1'?'disabled':'']"></i>
  <!-- <i class="el-icon-shenhebohui" v-if="ifShowCancelOper&&(initiator==30?true:props.data.row.status!=-1)&&props.data.row.isshare<=0&&props.data.row.wagedom!='结算'" :style="setBhiconColor(props.data.row.status)" :title="setBhiconColor(props.data.row.status,2)" @click="bohuiVisible=true;wageBohuiData=props.data.row;"></i> -->
</template>
</commonTable>
</div>
</div>

</el-tab-pane>

<el-tab-pane label="应收运价" name='应收'>
<span slot="label" class="badgeLabel badgeGreen" v-show="monitor!=2&&inputModelData&&inputModelData.czlx!='代操作'">应收运价</span>
<!-- 非合并 -->
<div  v-show="inputModelData.groupid<0">
  <!-- 利润分配并且操作站无法操作应收  orderguid>0为操作站-->
  <div class="detail-c" style="display:inline-block;width:1100px" :class="getAccountsReceivableFreightDisabled" >

<div class="input-item width100" style="margin-bottom:15px;margin-top:15px" v-if="inputModelData.guid">
    <div class="input-title">总运单号：{{inputModelData.mawb}}</div>
    <div class="input-content">
       
        <span style="margin-left:60px;margin-right:20px">
          制单代理代码：{{inputModelData.zddlcode}}
        </span>
        <span style="margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">总运单所属：{{inputModelData.mawbss}}</span>
        <span v-if="Number(this.inputModelData.childguid)<0">运单供应商：{{inputModelData.gysname}}</span>
    </div>
</div>
<!-- @@新签单 -->
<div class="detail basic-information" style="width:1200px;">
          <div class="detail-title">
            <p>运费</p>
          </div>
          <div class="detail-c">
          <newAssignForm :inputModelData="inputModelData" type="运费" :view-data="fareInputViewData" wageinout="1" ref="accountweightin"></newAssignForm>
          </div>
</div>

<div class="detail basic-information" style="width:1200px;">
          <div class="detail-title">
            <p>中转费</p>
          </div>
          <div class="detail-c">
          <newAssignForm :inputModelData="inputModelData" type="中转费" :view-data="fareInputViewData" wageinout="1" ref="accountweightinzz" ></newAssignForm>
          </div>
</div>
<!--     <newFormCmpt :view-data.sync="fareInputViewData" :model-data.sync="inputModelData">

      <template slot="isinwageallin">
        <el-radio
        v-model="inputModelData.isinwageallin"
        v-for="(radioitem,radioIndex) in fareInputViewData['isinwageallin'].options"
        :style="fareInputViewData['isinwageallin'].labelStyle"
        :label="radioitem.value"
        :key="radioIndex"
        :disabled="radioitem.disabled"
        v-show="!radioitem.hidden"
        >{{radioitem.label}}</el-radio>
      </template>

      <template slot="inwageallinprice">
        <div style="display:inline-block">
          <el-input
          v-model="inputModelData.inwageallinprice"
          style="width:80px;"
          ></el-input>
        </div>
      </template>

      <template slot="isinwageallin_trans">
       <el-radio
       v-model="inputModelData.isinwageallin_trans"
       v-for="(radioitem,radioIndex) in fareInputViewData['isinwageallin_trans'].options"
       :style="fareInputViewData['isinwageallin_trans'].labelStyle"
       :label="radioitem.value"
       :key="radioIndex"
       :disabled="radioitem.disabled"
       v-show="!radioitem.hidden"
       >{{radioitem.label}}</el-radio>
     </template>

     <template slot="inwageallinprice_trans">
       <div style="display:inline-block">
        <el-input
        v-model="inputModelData.inwageallinprice_trans"
        style="width:80px;"
        ></el-input>
      </div>
    </template>

    <template slot="accountweightin">
      <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightin:'0.00'}}</span>
      <div style="display:inline-block">
        <el-input
        v-model="inputModelData.accountweightin"
        style="width:80px;"
        @input="accountInput('accountweightin')"
        ></el-input>
      </div>
       <div style="width:240px">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
    </template>
    <template slot="accountweightinZz">
      <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightinZz:'0.00'}}</span>

      <div style="display:inline-block">
        <el-input
        v-model="inputModelData.zzysweight "
        style="width:80px;"
        @input="accountInput('zzysweight')"
        ></el-input>
      </div>
       <div style="width:240px">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
    </template>
  </newFormCmpt> -->
</div>

<div class="detail mawbCharge detailPaneYoung" style="margin-top:12px;" >

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid #00cc00;background:#f8f8f8;padding-left:16px;">

    <div style="float:left;margin-right:16px;letter-spacing:0.1em">
      <span style="color:#00cc00;font-weight:bold;letter-spacing:0.1em">总应收:¥{{Number(allinCost).toFixed(2)}}</span>
    </div>

  </div>

  <el-row class="detail-title">
  <el-col :span="3">
  <p>应收费用总览</p>
</el-col>
<!-- type 批量确认无法点击费用确认 -->
<el-col :span="21" style="font-size:12px;font-weight:normal;text-align:right;" v-if="!type">
<span  style="float:right;margin-top:-1px;">
  <el-button type="primary" size="mini" @click="saveDocument('1','2')" :disabled="yingshoustatus||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'&&inputModelData.orderguid>0">应收确认</el-button>
  <el-button type="primary" size="mini" @click="saveDocument('1','3')" :disabled="!yingshoustatus||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'&&inputModelData.orderguid>0">取消应收确认</el-button>
</span>
</el-col>
</el-row>
<div class="detail-c">
  <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="position:relative" :tableIndex="1" :colorIndex="modCostIndex" :wagetype="wagetype"  v-if="mawbCharge" :name="1">
    <template slot="firstTd" slot-scope="props">
      <td>

        <i class="icon-save" @click="addCost('1')" :class="[(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'||!curObjectKyYs.items||!curObjectKyYs.num||!curObjectKyYs.price?'disabled':'']"></i>
        <i class="el-icon-close" @click="clearCost('1')"></i>
      </td>
      <td>
        <input type="checkbox" v-model="curObjectKyYs.isfree"></td>
        <td>
          {{curObjectKyYs.confirmstatus!='--'&&curObjectKyYs.confirmstatus?curObjectKyYs.confirmstatus:'--'}}
        </td>
      <!-- <td>
      <el-select v-model="curObjectKyYf.otherno" style="width:150px;">

        <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"></el-option>
      </el-select>
    </td>
  -->
  <td style="display:inline-flex;border:none;width:100%;">
    <page-select :modelval.sync="curObjectKyYs.gid" :pagetype="2" @change="getYsSettname" :disabled="curObjectKyYs.disabled" :area="inputModelData.area" v-if="inputModelData.area" :ifRefreshData.sync="ifRefreshData" :wtxmname="inputModelData.wtxmname" :fid="inputModelData.fid">
    <template slot="other">
     <jsdxwh :fid="inputModelData.fid" :area="inputModelData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
   </template>

 </page-select>
</td>
<td>
  <page-select :modelval.sync="curObjectKyYs.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :disabled="curObjectKyYs.isallin=='1'" :servicecode="'航线应收'" @change="getYsServiceData"></page-select>
</td>
<td>
  <el-select v-model="curObjectKyYs.wagetype" style="width:130px;" :disabled="inputModelData.isinwageallin_trans=='2'&&curObjectKyYf.items=='航司中转费'&&curObjectKyYf.ismodify=='2'">
  <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.num" style="width:100px;" @blur="yanzhenzzF('2','1','num')" :disabled="inputModelData.isinwageallin_trans=='2'&&curObjectKyYs.items=='航司中转费'&&curObjectKyYs.ismodify=='2'"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.price" style="width:100px;" @blur="yanzhenzzF('2','1','price')"></el-input>
</td>
<td>
  <el-select v-model="curObjectKyYs.currency" style="width:100px;">
  <el-option v-for="(item,index) in currencyList"
  :key="index"
  :label="item"
  :value="item"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.leastwageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.wageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.changerate" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
</td>
</template>
<template slot="operate" slot-scope="props">
  <i class="el-icon-setting" v-if="props.data.row.status==-1||props.data.row.status==500" title='修改费用' @click="modCost('1',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'?'disabled':'']"></i>
  <i class="el-icon-delete"  v-if="props.data.row.status==-1||props.data.row.status==500" title='删除费用' @click="delCost('1',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'?'disabled':'']"></i>
  <!-- <i class="el-icon-shenhebohui" v-if="ifShowCancelOper&&(initiator==30?true:props.data.row.status!=-1)&&props.data.row.isshare<=0&&props.data.row.wagedom!='结算'" :style="setBhiconColor(props.data.row.status)" :title="setBhiconColor(props.data.row.status,2)" @click="bohuiVisible=true;wageBohuiData=props.data.row;"></i> -->
</template>
</commonTable>
</div>
</div>

</div>
<!-- 合并 -->
<hawbTabs  :showAddHawbBtn="false" @togglehawbN="togglehawbN"  v-show="inputModelData.guid&&inputModelData.groupid>0&&childrenList.length>1" :hawbListCost="childrenList" :boguid="boguid" :mawbguid="inputModelData.guid" :tabPanStyle="tabPanStyle">

  <div class="detail-c" style="display:inline-block;width:1100px" :class="[yingshoustatusForm||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'&&inputModelData.orderguid>0?'disabled':'']" v-if="childData.iscomboine!='1'">
  
  <div class="input-item width100" style="margin-left: 40px;margin-bottom:15px;" v-if="inputModelData.guid">
    <div class="input-title">总运单号：</div>
    <div class="input-content">
        <el-input v-model="inputModelData.mawb" style="width:100px;" disabled></el-input>
       <!--  <el-button  @click="configMawb" >配置总运单</el-button>
        <el-button  @click="unConfigMawb" :disabled="inputModelData.mawb?false:true">解除总运单</el-button> -->
        <span style="margin-left:60px;margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">运单供应商：{{inputModelData.gysname}}</span>
        <span style="margin-right:20px" v-if="Number(this.inputModelData.childguid)<0">总运单所属：{{inputModelData.mawbss}}</span>
        <span>是否安检前：{{inputModelData.serviceList.filter(i=>i.servicecode=='AA0230')[0]['isdel']=='1'?'是':'否'}}</span>
    </div>
</div>

    <newFormCmpt    :view-data.sync="fareInputViewData" :model-data.sync="childData">

      <template slot="isinwageallin">
        <el-radio
        v-model="childData.isinwageallin"
        v-for="(radioitem,radioIndex) in fareInputViewData['isinwageallin'].options"
        :style="fareInputViewData['isinwageallin'].labelStyle"
        :label="radioitem.value"
        :key="radioIndex"
        :disabled="radioitem.disabled"
        v-show="!radioitem.hidden"
        @click.native="switchHawb=true"
        >{{radioitem.label}}</el-radio>
      </template>

      <template slot="inwageallinprice">
        <div style="display:inline-block">
          <el-input
          v-model="childData.inwageallinprice"
          style="width:80px;"
          @input="switchHawb=true"
          ></el-input>
        </div>
      </template>

      <template slot="accountweightin">
        <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightin:'0.00'}}</span>
        <div style="display:inline-block">
          <el-input
          v-model="childData.accountweightin"
          style="width:80px;"
          @input="switchHawb=true"
          @blur="childData.jgysischange=2"
          ></el-input>
        </div>
         <div style="width:240px">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
      </template>

      <template slot="isinwageallin_trans">
       <el-radio
       v-model="childData.isinwageallin_trans"
       v-for="(radioitem,radioIndex) in fareInputViewData['isinwageallin_trans'].options"
       :style="fareInputViewData['isinwageallin_trans'].labelStyle"
       :label="radioitem.value"
       :key="radioIndex"
       :disabled="radioitem.disabled"
       v-show="!radioitem.hidden"
       @click.native="switchHawb=true"
       >{{radioitem.label}}</el-radio>
     </template>

     <template slot="inwageallinprice_trans">
       <div style="display:inline-block">
        <el-input
        v-model="childData.inwageallinprice_trans"
        style="width:80px;"
        @input="switchHawb=true"
        ></el-input>
      </div>
    </template>

    <template slot="accountweightinZz">
      <span>{{inputModelData.zddrstatus=='2'||inputModelData.childguid>0?accountweightinZz:'0.00'}}</span>
      <div style="display:inline-block">
        <el-input
        v-model="childData.zzysweight "
        style="width:80px;"
        @input="switchHawb=true"
        @blur="childData.zzysischange=2"
        ></el-input>
      </div>
       <div style="width:240px">(实际计费重量 - 制单计费重量) *我司分泡比例 + 制单计费重量</div>
    </template>
  </newFormCmpt>
</div>
<!-- <div style="width:250px;display:inline-block;vertical-align:text-top" v-if="smallCostDataYs">
<p style="color:green;vertical-align:text-top;margin-bottom:10px">应收杂费选项</p>
<commonTable class="commonTable" :head="smallCostHead" :table-data="smallCostDataYs" style="position:relative;" :isMultiSelect="yingshoustatus?false:true"></commonTable>

</div> -->
<div class="detail mawbCharge detailPaneYoung" style="margin-top:12px;" >  

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid #00cc00;background:#f8f8f8;padding-left:16px;">

    <div style="float:left;margin-right:16px;letter-spacing:0.1em">
      <span style="color:#00cc00;font-weight:bold;letter-spacing:0.1em">总应收:¥{{Number(allinCost).toFixed(2)}}</span>

    </div>

  </div>

  <el-row class="detail-title">
  <el-col :span="3">
  <p>应收费用总览</p>
</el-col>
<!-- type 批量确认无法点击费用确认 -->
<el-col :span="21" style="font-size:12px;font-weight:normal;text-align:right;" v-if="childData.iscomboine!='1'&&!type">
<span  style="float:right;margin-top:-1px;">
  <el-button type="primary" size="mini" @click="hawbWageConfirm('1')" :disabled="yingshoustatus||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'&&inputModelData.orderguid>0">应收确认</el-button>
  <el-button type="primary" size="mini" @click="hawbWageConfirm('2')" :disabled="!yingshoustatus||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'&&inputModelData.orderguid>0">取消应收确认</el-button>
</span>
</el-col>
</el-row>
<div class="detail-c">
  <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="position:relative" :tableIndex="1" :colorIndex="modCostIndex" :wagetype="wagetype"  v-if="mawbCharge" :name="1">

    <template slot="firstTd" slot-scope="props" v-if="childData.iscomboine!='1'">

      <td>

        <i class="icon-save" @click="addCost('1')" :class="[(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'||!curObjectKyYs.items||!curObjectKyYs.num||!curObjectKyYs.price?'disabled':'']"></i>
        <i class="el-icon-close" @click="clearCost('1')"></i>
      </td>
      <td>
        <input type="checkbox" v-model="curObjectKyYs.isfree"></td>
        <td>
          {{curObjectKyYs.confirmstatus!='--'&&curObjectKyYs.confirmstatus?curObjectKyYs.confirmstatus:'--'}}
        </td>
      <!-- <td>
      <el-select v-model="curObjectKyYf.otherno" style="width:150px;">

        <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"></el-option>
      </el-select>
    </td>
  -->
  <td style="display:inline-flex;border:none;width:100%;">

    <page-select :modelval.sync="childData.gid" :pagetype="2" @change="getYsSettname" :disabled="curObjectKyYs.disabled" :area="inputModelData.area" v-if="inputModelData.area&&childData.gid" :ifRefreshData.sync="ifRefreshData" :wtxmname="childData.wtxmname" :fid="childData.fid">

    <template slot="other">
     <jsdxwh :fid="childData.fid" :area="inputModelData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
   </template>

 </page-select>
</td>
<td>
  <page-select :modelval.sync="curObjectKyYs.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :disabled="curObjectKyYs.isallin=='1'" :servicecode="'航线应收'" @change="getYsServiceData"></page-select>
</td>
<td>
  <el-select v-model="curObjectKyYs.wagetype" style="width:130px;" :disabled="childData.isinwageallin_trans=='2'&&curObjectKyYf.items=='航司中转费'&&curObjectKyYf.ismodify=='2'">

  <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.num" style="width:100px;" @blur="yanzhenzzF('2','1','num')" :disabled="childData.isinwageallin_trans=='2'&&curObjectKyYs.items=='航司中转费'&&curObjectKyYs.ismodify=='2'"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.price" style="width:100px;" @blur="yanzhenzzF('2','1','price')"></el-input>
</td>
<td>
  <el-select v-model="curObjectKyYs.currency" style="width:100px;">

  <el-option v-for="(item,index) in currencyList"
  :key="index"
  :label="item"
  :value="item"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.leastwageall" style="width:100px;" :disabled="true"></el-input>
</td>

<td>
  <el-input v-model="curObjectKyYs.wageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.changerate" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
</td>

</template>
<template slot="operate" slot-scope="props" v-if="childData.iscomboine!='1'">
  <i class="el-icon-setting" title='修改费用' @click="modCost('1',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'?'disabled':'']"></i>
  <i class="el-icon-delete"  title='删除费用' @click="delCost('1',props.data.row,props.data.index)" :class="[props.data.row.confirmstatus=='已确认'||(inputModelData.profitmode&&inputModelData.profitmode.indexOf('利润'))!='-1'?'disabled':'']"></i>
</template>
</commonTable>
</div>
</div>
</hawbTabs>
</el-tab-pane>

<el-tab-pane label="费用总览" v-if="yingfustatus&&yingshoustatus" name="费用总览">
<span slot="label" class="badgeLabel">费用总览</span>
<allWageIn :mawbguid="inputModelData.guid"  v-if="inputModelData.guid" :boguid="inputModelData.boguid" :initiator="initiator"></allWageIn>
</el-tab-pane>

</el-tabs>
</div>

<!-- 底部按钮组 -->
<div style="position:relative;height:40px;margin-top:10px;" v-if="visibleI">
<div style="position:absolute;right:0px;z-index:1000" v-if="visibleI">
  <el-button type="primary" :disabled="(inputModelData.commbillmodifystatus!='2'&&inputModelData.dzstatus>=300)||(inputModelData.zddrstatus!='2'||!inputModelData.zzg||(inputModelData.czlx!='自货'&&inputModelData.czlx!='唯凯配舱'))||monitor==2||!inputModelData.zddlcode||inputModelData.zzyfweight=='NaN'||inputModelData.zzysweight=='NaN'||inputModelData.accountweightin=='NaN'||inputModelData.accountweightout=='NaN'" @click="saveDocument('2','0')">签单</el-button>
  <el-button type="primary" :disabled="monitor==2" @click="saveDocument('1','1')">保存</el-button>
  <el-button type="primary" :disabled="inputModelData.dzstatus<300||inputModelData.dzstatus>=400||inputModelData.status>=500||monitor==2" @click="CancelDocument">取消签单</el-button>
  <el-button type="primary" :disabled="inputModelData.dzstatus<400||inputModelData.commbillmodifystatus=='2'||inputModelData.status>=500||monitor==2" @click="qdModify">签单待修改</el-button>
  <!-- <el-button type="primary" @click="sizeRowData">尺寸信息</el-button> -->
  <!--  <el-button type="primary" :disabled="inputModelData.dzstatus<400||inputModelData.commbillmodifystatus=='2'">制单待修改</el-button> -->
  <!-- <el-button type="primary" :disabled="!(yingfustatus&&yingshoustatus)" @click="wageInShow=true">总盈收</el-button> -->
  <el-button @click="closeDialog">返回</el-button>
</div>
</div>

<!-- 运费应收应付自货End -->

<!-- 代操作费用 -->
<div v-if="inputModelData.czlx=='代操作'">
  <div class="detail mawbCharge detailPaneYoung" style="margin-top:12px;" v-if="visibleI">

    <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid #00cc00;background:#f8f8f8;padding-left:16px;">

      <div style="float:left;margin-right:16px;letter-spacing:0.1em">
        <span style="color:#00cc00;font-weight:bold;">总应收:</span>

      </div>

    </div>

    <el-row class="detail-title">
    <el-col :span="3">
    <p>代操作应收预览</p>
  </el-col>
  <el-col :span="21" style="font-size:12px;font-weight:normal;text-align:right;">
  <span  style="float:right;margin-top:-1px;">
    <el-button type="primary" size="mini" >应收确认</el-button>
    <el-button type="primary" size="mini">取消应收确认</el-button>
  </span>
</el-col>
</el-row>
<div class="detail-c">
  <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="position:relative" :tableIndex="1" :colorIndex="modCostIndex" :wagetype="wagetype" v-if="mawbCharge">

    <template slot="firstTd" slot-scope="props">

      <td>

        <i class="icon-save"  @click="addCost('1')" :class="[!curObjectKyYs.items||!curObjectKyYs.num||!curObjectKyYs.price||curObjectKyYs.leastwageall==0?'disabled':'']"></i>
        <i class="el-icon-close" @click="clearCost('1')"></i>
      </td>
      <td>
        <input type="checkbox" v-model="curObjectKyYs.isfree"></td>
        <td>
          {{curObjectKyYs.confirmstatus!='--'&&curObjectKyYs.confirmstatus?curObjectKyYs.confirmstatus:'--'}}
        </td>
<!--             <td>
<el-select v-model="curObjectKyYf.otherno" style="width:150px;">

  <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"></el-option>
</el-select>
</td>
-->
<td style="display:inline-flex;border:none;width:100%;">

  <page-select :modelval.sync="curObjectKyYs.gid" :pagetype="2" @change="getYsSettname" :disabled="curObjectKyYs.disabled" :area="inputModelData.area" v-if="inputModelData.area" :ifRefreshData.sync="ifRefreshData" :wtxmname="inputModelData.wtxmname" :fid="inputModelData.fid">

  <template slot="other">
   <jsdxwh :fid="inputModelData.fid" :area="inputModelData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
 </template>

</page-select>
</td>
<td>
  <page-select :modelval.sync="curObjectKyYs.items" :pagetype="5" :area="inputModelData.area" v-if="inputModelData.area" :servicecode="'OA0010'" @click="getYsServiceData"></page-select>
</td>
<td>
  <el-select v-model="curObjectKyYs.wagetype" style="width:130px;">

  <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.num" style="width:100px;" @blur="yanzhenzzF('1','1','num')"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.price" style="width:100px;" @blur="yanzhenzzF('1','1','price')"></el-input>
</td>
<td>
  <el-select v-model="curObjectKyYs.currency" style="width:100px;">

  <el-option v-for="(item,index) in currencyList"
  :key="index"
  :label="item"
  :value="item"></el-option>
</el-select>
</td>
<td>
  <el-input v-model="curObjectKyYs.leastwageall" style="width:100px;" :disabled="true"></el-input>
</td>

<td>
  <el-input v-model="curObjectKyYs.wageall" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.changerate" style="width:100px;" :disabled="true"></el-input>
</td>
<td>
  <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
</td>

</template>
<template slot="operate" slot-scope="props">
  <i class="el-icon-setting" title='修改费用' @click="modCost('1',props.data.row,props.data.index)"></i>
  <i class="el-icon-delete"  title='删除费用' @click="delCost('1',props.data.row,props.data.index)"></i>
</template>
</commonTable>
</div>
</div>
</div>
<!-- 代操作费用End -->

<!-- 修改制单信息弹框 -->
<el-dialog width="700px"
top="4%"
center
:visible.sync="modzdInfoShow"
v-if="modzdInfoShow" append-to-body
:close-on-click-modal="false"
custom-class="zdInfo"
>

<div>
<!-- 
{{zdzlischange}} -->
  <div class="orderSystem-c">
    <h3>制单信息修改</h3>
    <p class="orderNo">
      <span style="color:#004d84;font-weight:bold">总运单号:{{inputModelData.mawb}}</span>
    </p>

    <div>
      <ul>
        <li>
          <span>
            <span class="modTitle">制单件数：</span>
            <el-input v-model="modzdInfo.zdpiece" placeholder="请输入制单件数" disabled></el-input>
          </span>
          <span class="modreal">
           <span class="modTitle">实际件数：</span>{{inputModelData.realpiece}}
         </span>

       </li>
       <li>
        <span>
          <span class="modTitle">制单重量：</span>
          <el-input v-model="modzdInfo.zdweight" placeholder="请输入制单重量" :disabled="Number(inputModelData.bgweight)>0"></el-input>
        </span>
        <span class="modreal">
         <span class="modTitle">实际重量：</span>{{inputModelData.realweight}}
       </span>
       <span class="modreal">
         <span class="modTitle">报关重量：</span>{{inputModelData.bgweight}}
       </span>
     </li>
     <li>
      <span>
        <span class="modTitle">制单体积：</span>
        <el-input v-model="modzdInfo.zdvolume" placeholder="请输入制单体积" @input="changeZdvolume"></el-input>
      </span>
      <span class="modreal">
        <span class="modTitle">实际体积：</span>{{inputModelData.realvolume}}
      </span>
    </li>
    <li>
      <span>
        <span class="modTitle">制单计费重量：</span>
        <el-input v-model="modzdInfo.zdjfweight" placeholder="请输入制单计费重量" @input="zdzlischange=2;"></el-input>
      </span>
      <span class="modreal">
        <span class="modTitle">实际计费重量：</span>{{realjfweight}}
      </span>
    </li>
  </ul>
</div>


</div>

<p style="margin-top:18px;text-align:right">
 <el-button type="primary" @click="zdInfoOperation('1')">确定</el-button>
 <el-button @click="modzdInfoShow=false">取消</el-button>
</p>
</div>
</el-dialog>

<!--尺寸 -->
      <el-dialog
      :visible.sync="sizeDialog"
      width="1000px"
      top="4%"
      center
      v-if="sizeDialog&&sizeInfo"
      append-to-body
      :close-on-press-escape="false"
      custom-class="sizeDialogClass"
    >
  <h3>订舱编号：{{sizeInfo.hpoInfo.pono}}</h3>
    <div style="width:900px">
      <!-- 运价信息 -->
      <h4><span class="sizeLeft">运价信息</span><span class="sizeRight" @click="copyContent('yjinfo')">复制内容</span></h4>
      <div class="info">
        <table id="yjinfo" v-if="sizeInfo.hpoInfo">
        <tr>
          <td>销售站运价类型：{{sizeInfo.xshpoInfo?sizeInfo.xshpoInfo.isinwageallin=='-1'?'':sizeInfo.xshpoInfo.isinwageallin:'--'}}</td>
          <td>销售站运价单价：{{sizeInfo.xshpoInfo?sizeInfo.xshpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeInfo.xshpoInfo.inwagecostprice).toFixed(2):'--'}}</td>
        </tr>
        <tr>
         <td>应收运价类型：{{sizeInfo.hpoInfo.isinwageallin=='-1'?'':sizeInfo.hpoInfo.isinwageallin}}</td>
         <td>应收运价单价：{{sizeInfo.hpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeInfo.hpoInfo.inwagecostprice).toFixed(2)}}</td>
        </tr>
        <tr>
         <td>应付运价类型：{{sizeInfo.hpoInfo.isoutwageallin=='-1'?'':sizeInfo.hpoInfo.isoutwageallin}}</td>
         <td>应付运价单价：{{sizeInfo.hpoInfo.outwageallinprice=='666666'?'0.00':Number(sizeInfo.hpoInfo.outwageallinprice).toFixed(2)}}</td>
        </tr>
        </table>
      </div>


      <!-- 预报尺寸 -->
      <h4><span class="sizeLeft">预报尺寸</span><span class="sizeRight" @click="copyContent('ybcc')">复制内容</span></h4>

    <div class="info" >
        <table id="ybcc">
          <tr v-for="(i,index) in sizeInfo.ybList">
          <td v-for="(i2,index2) in i">({{2*index+index2+1}}){{Number(i2.vol_longs_yb)}}*{{Number(i2.vol_widths_yb)}}*{{Number(i2.vol_heights_yb)}}*{{Number(i2.vol_piece_yb)}}={{StringNum(Number((i2.vol_longs_yb*i2.vol_widths_yb*i2.vol_heights_yb))/1000000*Number(i2.vol_piece_yb))}}{{i2.packagetypename_yb}}</td>
          </tr>

        </table>



      </div>

  <h4><span class="sizeLeft">客户确认尺寸</span><span class="sizeRight" @click="copyContent('qrcc')">复制内容</span></h4>
  
  <div class="info">
    <table id="qrcc">
      <tr v-for="(i,index) in sizeInfo.qrList">
        <td v-for="(i2,index2) in i">
          ({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}
        </td>
      </tr>
  
    </table>
  
  </div>

      <h4><span class="sizeLeft">入库尺寸</span><span class="sizeRight" @click="copyContent('sjcc')">复制内容</span></h4>

        <div class="info">
        <table  id="sjcc">
          <tr v-for="(i,index) in sizeInfo.sjList">
          <td v-for="(i2,index2) in i">({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}</td>
          </tr>

        </table>

      </div>
        <h4><span class="sizeLeft">中英文品名</span><span class="sizeRight" @click="copyContent('zywpm')">复制内容</span></h4>

   <div class="info" >
        <table id="zywpm">
          <tr v-for="(i,index) in sizeInfo.axpList">
          <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">({{index+1}}){{i.hawb}}:{{i.chinesepm}},{{i.englishpm}}</td>
          </tr>

        </table>

      </div>

        <h4><span class="sizeLeft">备注信息</span><span class="sizeRight" @click="copyContent('bzxx')">复制内容</span></h4>

     <div class="info">
        <table id="bzxx" v-if="sizeInfo.hpoInfo">
        <tr>
         <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">{{sizeInfo.hpoInfo.remark}}</td>
        </tr>
        </table>
      </div>

        <h4><span class="sizeLeft">航线尺寸备注</span><span class="sizeRight" @click="copyContent('hxccbz')">复制内容</span></h4>

     <div class="info">
        <table id="hxccbz" v-if="sizeInfo.hpoInfo">
        <tr>
         <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">{{sizeInfo.hpoInfo.volumeremark}}</td>
        </tr>
        </table>
      </div>

    </div>

    </el-dialog>


<el-dialog  :visible.sync="wageInShow"
v-if="wageInShow"
append-to-body
top="4%"
width="1350px"
center>

<allWageIn :mawbguid="inputModelData.guid" :boguid="inputModelData.boguid"></allWageIn>

</el-dialog>

   <el-dialog
      :visible.sync="bohuiVisible"
      width="1360px"
      title="驳回详情"
      top="4%"
      v-if="bohuiVisible"
      :close-on-press-escape="false"
      append-to-body
      :close-on-click-modal="false"
      center
    >
    <div style="min-height:400px" v-if="inputModelData.guid">
    <myCommonTable :mawbinfo="inputModelData" :initiator="initiator"></myCommonTable>
    </div>
</el-dialog>


<el-dialog title="总单服务编辑" :visible.sync="dialogFormVisible" :style="{visibility:inputModelData.guid?'':'hidden'}" append-to-body :close-on-click-modal="false" width="1440px">
            <div class="detail" :style="{visibility:inputModelData.guid?'':'hidden'}">
                <div class="detail-c">
                    <serviceList :newService.sync="newService" :opersystem="inputModelData.opersystem" pagetype="2" :serviceList="inputModelData.serviceList" ref="serviceTemp" :orderguid="inputModelData.orderguid" :orderdom="inputModelData.orderdom" :system="inputModelData.system"></serviceList>
                    <!-- <div style="text-align:right">
                        <el-button btnnum="480" :disabled="!showFwbjBtn" @click="saveServiceFunc">保存</el-button>
                    </div> -->
                </div>
            </div>
</el-dialog>


</div>

</template>

<script>
  import allWageIn from './allWageIn'
  import hawbTabs from '../templates/hawbCostTabs'
  import newAssignForm from '../templates/newAssignForm'
  import { getChangeRate, computedWeight,getWtxmname,getGysname, formatDate } from "../../api/localStorage.js"
  import serviceList from "./serviceList"; //服务列表组件
  import { Alert } from 'element-ui';
  import {myCommonTable,setBhiconColorMixin} from "@/common/detailPagesMixin"
  import {
    mawbConfigMixin
  } from '../mixins/mawbConfigMixin.js'
import sizeInfo from '@/components/orderDetails/sizeInfo'
  export default {
    mixins: [mawbConfigMixin()],
    components: {
     allWageIn,hawbTabs,myCommonTable,serviceList, sizeInfo,newAssignForm
   },
   mixins:[setBhiconColorMixin],
   name: 'airPlaneDeatil',
   props:{
      monitor: {
       type: [String,Number],
       default: 1
     },
    boguid:{
      type:[String,Number]
    },
    initiator:[String,Number],
    visible: Boolean,
    activeTab:{
      type:String,
      default:'签单'
    },
    switchHxKh:{
      tyle:Boolean,
      default:true
    },
    pagetype:{
      tyle:String
    },
    type:{//批量费用确认单票点入 single
      type:String,
      default:''
    },
    visibleI: {
      type: Boolean,
      default: true
    },
    mawbData: { // 配置总运单信息
      type: Object,
      default: () => {},
    },

    shipaceInfoData: {
      type: Object,
      default: () => {},
    }

  },

  data () {

    return {
      inputModelData:{},//总单数据
      inputModelDataBack:{},//总单数据备份
      jsfs:[],//基础数据 结算方式
      currencyList:[],//基础数据 货币
      ifRefreshData:false,//刷新结算对象数据
      activeMod:'签单',
      basicInfoView:{//基础信息
        wtkhname:{
          title:'委托项目:',
          type:18,
          idStyle: { width: "100%" },
          itemStyle: { width: "100%" },
        },
        mawb:{
          title:'总运单号:',
          type:18,
        },
        hawb:{
          title:'分运单号:',
          type:18,
        },
        czlx:{
          title:'操作类型:',
          type:18,
        },
        hxzl:{
          title:'航线指令:',
          type:18,
        },
        hwstatus:{
          title:'货物状态:',
          type:18,
        },
        dzstatus:{
          title:'单证状态:',
          type:18,
        },
        bgstatus:{
          title:'报关状态：',
          type:18,
        },
        ycts:{
          title:'运程天数：',
          type:18,
        },
        hwxz:{
          title:'货物性质：',
          type:18,
        },
        bglx:{
          title:'报关类型：',
          type:18,
        },
        bgweight:{
          title:'报关重量：',
          type:18,
        },
        hbzl:{
          title:'航班种类：',
          type:18,
        },
        hbh:{
          title:'航班号：',
          type:1,
        },
        hbrq:{
          title:'航班日期：',
          type: 12,
          format: "yyyy-MM-dd"
        },
        sfg:{
          title:'始发港：',
          type: 18,
        },
        mawbmdg:{
          title:'总运单目的港：',
          type: 18,
        },
        zdhb:{
          title:'指定航班：',
          type: 18,
        },
        yqdgrq:{
          title:'要求到港日期：',
          type: 18,
        },
        zzg:{
          title:'中转港：',
          type: 20,
          verify: "uppercase",
          pagetype: 6,
          idStyle: { width: "48%" },
        }

      },
      zdBasicInfo:{//制单备注信息
       iszddl:{
        title:'制单代码：',
        type: 3,
        disabled:true,
        options:[{label:'WFF',value:'1'},{label:'非WFF',value:'2'}],
        idStyle: { width: "420px" }
        },
        zddlcode:{
          title:'制单代理代码：',
          type: 1,
          disabled:false,
          verify: "uppercase",
          idStyle: { width: "48%" },
          required:true
        },
        // mawbss:{
        //   title:'总运单所属：',
        //   type:18,
        //   hidden:true
        // },
        // gysname:{
        //   title:'总运单供应商：',
        //   type:18,
        //   idStyle: { width: "30%" },
        //   itemStyle: { width: "560px" },
        //   hidden:true
        // },
        wtkhname:{
          title:'操作站：',
          type:18,
           idStyle: { width: "30%" },
          itemStyle: { width: "560px" },
          hidden:true
        },
        wclhyq: {
          title: "外场要求备注：",
          type: 17,
          itemStyle: { width: "420px" }
        },
        dzmawbyq: {
          title: "制单要求备注：",
          type: 17,
          itemStyle: { width: "420px" },
        },
        signyq: {
          title: "签单要求备注：",
          type: 17,
          itemStyle: { width: "420px" },
        },
      },
      sizeData:[],//仓库只存信息
      sizeTableHead:[
      {field: 'wtLength', title: '重差',style:{'width':'110px','text-align':'left'}},
      {field: 'type', title: '类型',style:{'width':'112px','text-align':'left'}},
      {field: 'size', title: '件/重/体',style:{'width':'199px','text-align':'left'}},
      {field: 'jfweight', title: '计费重量',style:{'width':'112px','text-align':'left'}},
      {field: 'zp', title: '重泡',style:{'width':'70px','text-align':'left'}},
      // {field: 'description', title: '摘要'},
      ],
      fareOutputViewData:{
        isoutwageallin: {
          title: "基港运价类型：",
          itemStyle: { width: "800px" },
          type: 3,
          options: [
          { label: "单价ALLIN", value: "1" },
          { label: "单价++", value: "3" },
          { label: "M级++", value: "2" },
          ],
          class:'运费',
        },
        outwageallinprice: {
          title: "基港运价：",
          itemStyle: { minWidth: "800px" ,width:'800px'},
          contentStyle:{maxWidth:"170px",width:'170px'},
          hidden:true,
          type:1,
          append: '/KG',
          class:'运费',
        },

        outwageallinclude: {//应收运费包含
        title: "",
        type: 3,
        titleStyle: { display: "none" },
        idStyle: { width: "410px"},
        options: [
          // { label: '含运费', value: '0' },
          // { label: '含燃油', value: '1' },
          // { label: '含战险', value: '2' },
          { label: 'WFF不付货站地面费(0.4/KG)', value: '4'},
          { label: 'WFF另付货站地面费(0.4/KG)', value: '-1'}
        ],
        // contentStyle: {
        //   'padding-top': '3px'
        // },
        itemStyle:{width:'800px'},
        //default: '',
        hidden:true,
        //hidden: false,
        //occupyRestSpace: true
        class:'运费',
      },

        firstXy: {
          title: "基港协议分泡：",
          idStyle: { width: "100%" },
          itemStyle:{width:'100%'},
          contentStyle:{Width:"120px"},
          type: 9,
          input:2,
          options: [
          {
            title: "WFF：",
            linkage: "cus_agree_bp_freight_out",
            id: "self_agree_bp_freight_out"
          },
          {
            title: "客户：",
            linkage: "self_agree_bp_freight_out",
            id: "cus_agree_bp_freight_out"
          }
          ],
          seque: "firstXy",
          class:'运费',
        },

        yfjffs:{
          title:'计费方式：',
          type:3,
          options:[{
            label:'正常',value:'板外',
          },{
            label:'包机包板',value:'板内'
          }],
          idStyle: { width: "100%" },
          itemStyle: { width: "100%" },
          class:'运费',
        },
        first: {
          title: "基港实际分泡：",
          itemStyle: { width: "380px" },
          style:{width:"130px"},
          disabled:false,
          type: 9,
          input:1,
          options: [
          {
            title: "WFF",
            linkage: "cus_real_bp_freight_out",
            id: "self_real_bp_freight_out"
          },
          {
            title: "客户",
            linkage: "self_real_bp_freight_out",
            id: "cus_real_bp_freight_out"
          }
          ],
          seque: "first",
          //class:'运费',
        },
        accountweightoutSelect:{
           title: "",
           type: 3,
           titleStyle: { display: "none" },
           options: [
              { label: '制单毛重', value: 'zdweight'},
              { label: '制单计费重量', value: 'zdjfweight'}
          ],
          itemStyle:{width:"100%"},
          idStyle:{width:"40%",marginTop:"5px"},
          default: 'zdjfweight',
          hidden: true,
          class:'运费',
        },
        accountweightout: {
          title: "基港结算重量：",
          titleStyle: { marginTop: "-36px" },
          //class:'运费',
        },
        isoutwageallin_trans: {
          title: "中转费：",
          itemStyle: { width: "360px" },
          type: 3,
          labelStyle:{marginRight:'60px'},
          options: [
          { label: "单价", value: "1" },
          { label: "总价", value: "2" }
          ],
          class:'中转费',
        },
        outwageallinprice_trans: {
         title: "",
         itemStyle: { minWidth: "500px" ,width:'500px',marginLeft:'-60px'},
         contentStyle:{maxWidth:"170px",width:'170px',opacity:'0'},
         titleStyle: { display: "none" },
         type:1,
         append: '/KG',
         class:'中转费',
       },
       secondXy: {
        title: "中转协议分泡：",
        itemStyle: { width: "380px" },
        contentStyle:{Width:"120px"},
        type: 9,
        input:2,
        options: [
        {
          title: "WFF：",
          linkage: "cus_agree_bp_trans_out",
          id: "self_agree_bp_trans_out"
        },
        {
          title: "客户：",
          linkage: "self_agree_bp_trans_out",
          id: "cus_agree_bp_trans_out"
        }
        ],
        seque: "secondXy",
        class:'中转费',
      },
      second: {
        title: "中转实际分泡：",
        itemStyle: { width: "380px" },
        style:{width:"130px"},
        disabled:false,
        type: 9,
        input:1,
        options: [
        {
          title: "WFF",
          linkage: "cus_real_bp_trans_out",
          id: "self_real_bp_trans_out"
        },
        {
          title: "客户",
          linkage: "self_real_bp_trans_out",
          id: "cus_real_bp_trans_out"
        }
        ],
        seque: "second",
        //class:'中转费',
      },
      accountweightoutZz: {
        title: "中转结算重量：",
        titleStyle: { marginTop: "-36px" },
        //class:'中转费',
     },
    //  bllx:{
    //   title:'包量类型：',
    //   type:3,
    //   labelStyle:{marginRight:'60px'},
    //   itemStyle: { width: "990px" },
    //   options:[
    //   {label:'开口',value:'开口'},
    //   {label:'闭口',value:'闭口'},
    //   ]
    // },
    // freightfee_remark: {
    //   title: "运费备注：",
    //   type: 17,
    //   itemStyle: { width: "950px" },
    // },

  },
  smallCostHead:[
      // {field:'checkbox',title:''},
      {field:'items',title:'服务项目'},
      {field:'price',title:'单价'},
      {field:'min_price',title:'Min'}
      ],
      smallCostData:[],//基础数据杂费
      smallCostDataYf:[],//应付杂费选项
      smallCostDataYs:[],//应收杂费选项
      modCostIndex:'-1',//修改费用index
      wagetype:'',
      mawb_table_model: [//费用表头
      {field: 'operate', title: '操作'},
      {field: "isfree", title: "免"},
      {field: "confirmstatus", title: "状态"},
        // {field: "pono", title: "订舱编号"},
        // {field: "otherno", title: "分运单号"},
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
      mawbPayment:[],//应付费用数据
      curObjectKyYf:{
        num:'',
        price:'',
        currency:'人民币',
        otherno:'--',
        gid:'',
        changerate:''
      },
      fareInputViewData:{
        yfstdin: {
          title: "基港运费标准：",
          type: 3,
          idStyle: { width: "100%" },
          itemStyle: { width: "100%" },
          groupid:167,
          expInfo:true,
          class:'运费',
        },

        isinwageallin: {
          title: "基港运价类型：",
          itemStyle: { width: "1000px" },
          type:'3',
          disabled:false,
          options: [
          { label: "单价ALLIN", value: "1" },
          { label: "单价++", value: "3" },
          { label: "M级++", value: "2" },
          { label: "Cost++", value: "4" },
          ],
          class:'运费',
        },


        inwageallinprice: {
          title: "基港运价：",
          type:'1',
          itemStyle: { minWidth: "800px" ,width:'800px'},
          contentStyle:{maxWidth:"170px",width:'170px'},
          hidden:true,
          disabled:false,
          append: '/KG',
          //hidden:true,
          class:'运费',
        },

        inwageallinclude: {//应收运费包含
        title: "",
        type: 3,
        titleStyle: { display: "none" },
        //idStyle: { width: "50%"},
        options: [
          // { label: '含运费', value: '0' },
          // { label: '含燃油', value: '1' },
          // { label: '含战险', value: '2' },
          { label: 'WFF运费包含货站地面服务费(0.4/KG)', value: '4'},
          { label: 'WFF另收货站地面费(0.4/KG)', value: '-1'}
        ],
        // contentStyle: {
        //   'padding-top': '3px'
        // },
        itemStyle:{width:"800px"},
        default: '-1',
        hidden: true,
        class:'运费',
        //occupyRestSpace: true
      },

        firstXy: {
          title: "基港协议分泡：",
          idStyle: { width: "100%" },
          itemStyle:{width:'100%'},
          contentStyle:{Width:"120px"},
          disabled:false,
          type: 9,
          input:2,
          options: [
          {
            title: "WFF：",
            linkage: "cus_agree_bp_freight_in",
            id: "self_agree_bp_freight_in"
          },
          {
            title: "客户：",
            linkage: "self_agree_bp_freight_in",
            id: "cus_agree_bp_freight_in"
          }
          ],
          seque: "firstXy",
          class:'运费',
        },
        first: {
          title: "基港实际分泡：",
          itemStyle: { width: "380px" },
          style:{width:"130px"},
          disabled:false,
          type: 9,
          input:1,
          options: [
          {
            title: "WFF",
            linkage: "cus_real_bp_freight_in",
            id: "self_real_bp_freight_in"
          },
          {
            title: "客户",
            linkage: "self_real_bp_freight_in",
            id: "cus_real_bp_freight_in"
          }
          ],
          seque: "first"
        },
        ysjffs:{
          title:'计费方式：',
          type:3,
          options:[{
            label:'正常',value:'板外',
          },{
            label:'包机包板',value:'板内'
          }],
          idStyle: { width: "100%" },
          itemStyle: { width: "100%" },
          class:'运费',
        },
        accountweightinSelect:{
           title: "",
           type: 3,
           titleStyle: { display: "none" },
           options: [
              { label: '制单毛重', value: 'zdweight'},
              { label: '制单计费重量', value: 'zdjfweight'}
          ],
          itemStyle:{width:"100%"},
          idStyle:{width:"40%",marginTop: "5px"},
          default: 'zdjfweight',
          hidden: true,
          class:'运费',
        },
        accountweightin: {
          title: "基港结算重量：",
          titleStyle: { marginTop: "-36px" },
          //contentStyle:{maxWidth:"80px",width:'80px'},
          //itemStyle: { width: "60px" },
        },
        isinwageallin_trans: {
          title: "中转费：",
          itemStyle: { width: "360px" },
          type: 3,
          labelStyle:{marginRight:'60px'},
          options: [
          { label: "单价", value: "1" },
          { label: "总价", value: "2" }
          ],
          class:'中转费',
        },
        inwageallinprice_trans: {
         title: "",
         itemStyle: { minWidth: "500px" ,width:'500px',marginLeft:'-60px'},
         contentStyle:{maxWidth:"170px",width:'170px',opacity:'0'},
         titleStyle: { display: "none" },
         append: '/KG',
          type:1,
           class:'中转费',
        },
        secondXy: {
          title: "中转协议分泡：",
          itemStyle: { width: "380px" },
          contentStyle:{Width:"120px"},
          type: 9,
          input:2,
          options: [
          {
            title: "WFF：",
            linkage: "cus_agree_bp_trans_in",
            id: "self_agree_bp_trans_in"
          },
          {
            title: "客户：",
            linkage: "self_agree_bp_trans_in",
            id: "cus_agree_bp_trans_in"
          }
          ],
          seque: "secondXy",
          class:'中转费',
        },
        second: {
          title: "中转实际分泡：",
          itemStyle: { width: "380px" },
          style:{width:"130px"},
          disabled:false,
          type: 9,
          input:1,
          options: [
          {
            title: "WFF",
            linkage: "cus_real_bp_trans_in",
            id: "self_real_bp_trans_in"
          },
          {
            title: "客户",
            linkage: "self_real_bp_trans_in",
            id: "cus_real_bp_trans_in"
          }
          ],
          seque: "second"
        },
        accountweightinZz: {
          title: "中转结算重量：",
          titleStyle: { marginTop: "-36px" },
       //contentStyle:{maxWidth:"80px",width:'80px'},
       //itemStyle: { width: "60px" },
     },
//         bllx:{
//           title:'包量类型：',
//           type:3,
//           labelStyle:{marginRight:'60px'},
//            itemStyle: { width: "990px" },
//           options:[
// {label:'开口',value:'开口'},
// {label:'闭口',value:'闭口'},
//           ]
//         },
// freightin_remark: {
//   title: "运费备注：",
//   type: 17,
//   itemStyle: { width: "950px" },
// },

},
curObjectKyYs:{
         //isfree:{type:Boolean,default:false},
         num:'',
         price:'',
         currency:'人民币',
         otherno:'--',
         gid:'',
         changerate:''
       },
      mawbCharge: [],//应收费用
      modzdInfoShow:false,//修改制单弹框
      modzdInfo:{
        zdpiece:'',
        zdweight:'',
        zdvolume:'',
        zdjfweight:'',
      },
      switchWatch:false,//是否监听基港运价
      switchZaFei:false,//监听杂费
      switchHawb:false,//监听分单
      modifyIndex:'-1',
      changeAccountWeight:{accountweightin:true,accountweightout:true,zzyfweight:true,zzysweight:true},//结算重量是否随制单变化而变化
      wageInShow:false,//总盈收弹框
      yingshoustatus:false,//应收确认状态
      yingfustatus:false,//应付确认状态
      yingshoustatusForm:false,//应收确认状态表单
      yingfustatusForm:false,//应付确认状态表单
      zzgList:'',//中转港List
      hbInfoChanged:'',//修改航班信息
      childrenList:[],//合并子订单信息
      childData:{},//合并子订单数据
      allCostData:[],//全部费用
      sizeInfo: {}, //单证状态左键点击数据
      sizeDialog: false, //尺寸弹框显示隐藏
      ifShowCancelOper:true,//是否显示费用驳回的信息
      bohuiVisible:false,//费用驳回弹窗 // 费用中的 status：-1 未发起，100 代通过，200 已驳回，500，已通过
      wageBohuiData:{},//当前行驳回的数据
      zdzlischange:1,//是否修改制单重量 1未改 2改动
      //allinCost:0,
      //alloutCost:0
      showZiIndex:[],//签单表格子表格
      hawbTabShow:false,
      dialogFormVisible:false,//服务编辑弹框
      newService:{},
      //dialogMawbConfig:false,
      dmfwf:{},//地面服务费本地基础
      dmfwfGid:'',//地面服务费GID
      dmfwfBk:{},//备份服务费
      domZZ:null,
    }

  },



  methods: {
    // ***********公共其他方法************
    //返回
    closeDialog() {
      if (this.visible) {
        this.$emit("update:visible", false);
          //this.$store.state.mainSearch = false;
        }
      },
    //浮点数   
    StringNum(num){
     var returnNum=num.toLocaleString();               
         returnNum = returnNum.replace(/[,]/g, '');
     return Number(returnNum).toFixed(2)
    },
      // 泡货判断
      JudgeBubblesFunc(type) {
        //type 1判断实际计重 2，制单计重
        if (type == 1) {
          return (
            this.setRound(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight) -
            this.setRound(this.inputModelData.realvolume / 0.006)
            );
        }else if(type==3){
          return (
            this.setRound(this.inputModelData.signweight) -
            this.setRound(this.inputModelData.signvolume / 0.006)
            );
        } else {
          return (
            this.setRound(this.inputModelData.zdweight) -
            this.setRound(this.inputModelData.zdvolume / 0.006)
            );
        }
      },
      setRound(jfweight) {
        //校正重量的值
        var val = 0;
        var jfweight = Number(jfweight).toFixed(0);
        return jfweight
        // var wc = jfweight - parseInt(jfweight);
        // if (wc == 0 || wc == 0.5) {
        //   val = jfweight;
        // } else {
        //   val = wc > 0.5 ? parseInt(jfweight) + 1 : parseInt(jfweight) + 0.5;
        // }
        // return val;
      },
      getServiceGuid(code, field) { //获取服务节点参数
        //field 传guid orderpgid childpgid
        if (this.inputModelData.serviceList) {
          let guid;
          field = field || 'guid'
          this.inputModelData.serviceList.forEach(i => {
            if (i.servicecode == code) {
              guid = i[field]
            }
          })
          return guid
        }

      },
      getWageinType(isinwageallin) {

        if (isinwageallin == '1') {
          return '单价ALLIN'
        } else if (isinwageallin == '2') {
          return '总价ALLIN'
        } else if (isinwageallin == '3') {
          return '单价++'
        } else if (isinwageallin == '4') {
          return 'Cost+'
        }
      },
      // 应收应付结算对象
      getYfSettname(data) {
        this.curObjectKyYf.settname = data.usr_name
      },
      getYsSettname(data) {
        this.curObjectKyYs.settname = data.usr_name
      },
      getYsServiceData(data){
        this.$set(this.curObjectKyYs,'servicecode',data.servicecode)
      },
      getYfServiceData(data){
        this.$set(this.curObjectKyYf,'servicecode',data.servicecode)
      },
      // 重差计算
      weigthLength(weightSj, weight,type) {
        var num = 0
        if (Number(weight) != 0) {
          var spcWeight = (1 - weightSj / weight) * 100
          if ((spcWeight > 3 || spcWeight < -3) && spcWeight != 1) {
            if(Math.abs(Number(spcWeight).toFixed(1))>=3&&type){
              num='超过3%'
            }else{
              num = Number(spcWeight).toFixed(1) + '%'
            }
          }
        }
        return num
      },
      // 手动输入基港重量无法更改
      accountInput(field){

        Object.keys(this.changeAccountWeight).forEach(i=>{
          if(i==field){
            this.changeAccountWeight[i]=false
          }
        })
        //alert('1')
      },
      // 修改制单信息弹框体积
      changeZdvolume() {
       this.modzdInfo.zdjfweight=computedWeight(this.modzdInfo.zdvolume,this.modzdInfo.zdweight)
        // this.modzdInfo.zdjfweight = Number(this.modzdInfo.zdvolume / 0.006).toFixed(2) > this.modzdInfo.zdweight ? Number(this.modzdInfo.zdvolume / 0.006).toFixed(2) : this.modzdInfo.zdweight
      },
      // 起飞时间
      getQfsj() {
        //alert('1')
        //console.log('123123')

      var sfg = this.inputModelData.sfg;
      var hbh = this.inputModelData.yqhbh;
      var hbrq = this.inputModelData.yqhbrq;
      if (hbh && hbh.length <2) {
        this.dmfwf={currencyin:"人民币",pricein:0.4,priceout:0.4,itemstypein:"结算重量",itemstypeout:"计重",min_price:10,isallin:1,changeratein:1.0000,items:'货站地面费',servicecode:'AA0240',gid:'',settname:'',currencyout:"人民币",changerateout:1.0000}
        this.reSetDmfwf()
        return;
      }
      var json = {
        area: this.inputModelData.area,
        sfg: sfg,
        hbh: hbh,
        hbrq: hbrq,
        jid: ""
      };
      if (sfg && hbh.length>=2 && hbrq) {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
          params: json,
          loading: false,
          tip: false
        }).then(results => {
          console.log("起飞时间");
          //console.log(results.data);
          var qfsj =results.data.resultdic &&results.data.resultdic.flytime;

          if (qfsj && qfsj.indexOf("1900") == -1) {
            this.$set(this.inputModelData,'yjqfsj',qfsj)
   
          } else {
            this.$set(this.inputModelData,'yjqfsj','')
          }
          
          var hz1=[4,5,6,7]//UPS、2期上航 、3期上航 、物流
          var hz2=[1,2,3,8,9,10]//1期货站、2期货站、3期货站、FM货栈、外站交接、虹桥货栈
          //console.log(hz2.includes(results.data.resultdic.jjdid))

          if(!results.data.resultdic||!results.data.resultdic.jjdname||hz1.includes(results.data.resultdic.jjdid)){
            //alert('1')
            this.dmfwf={currencyin:"人民币",pricein:0.4,priceout:0.4,itemstypein:"结算重量",itemstypeout:"计重",min_price:10,isallin:1,changeratein:1.0000,items:'货站地面费',servicecode:'AA0240',gid:'',settname:'',currencyout:"人民币",changerateout:1.0000}
          }else if(hz2.includes(results.data.resultdic.jjdid)){
            this.dmfwf={currencyin:"人民币",pricein:0.4,priceout:0.4,itemstypein:"结算重量",itemstypeout:"毛重",min_price:5,isallin:1,changeratein:1.0000,items:'货站地面费',servicecode:'AA0240',gid:'',settname:'',currencyout:"人民币",changerateout:1.0000}
          }else{
            this.dmfwf={currencyin:"人民币",pricein:0.4,priceout:0.4,itemstypein:"结算重量",itemstypeout:"计重",min_price:10,isallin:1,changeratein:1.0000,items:'货站地面费',servicecode:'AA0240',gid:'',settname:'',currencyout:"人民币",changerateout:1.0000}
          }
          if(results.data.resultdic.zzg&&!results.data.resultdic.zzg.split(',').includes(this.inputModelData.zzg)){
            this.zzgList=results.data.resultdic.zzg
            this.inputModelData.zzg=''
          }
          

          
          this.reSetDmfwf()  
  
          
          
          
          
            
        });
      } else {
        this.$set(this.inputModelData,'yjqfsj','')
      }
    },
      reSetDmfwf(){
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/GetJjdWage",
          params: {terminalname:this.inputModelData.terminalname,sfg:this.inputModelData.sfg,hbh:this.inputModelData.yqhbh,hbrq:this.inputModelData.yqhbrq},
          loading: false,
          tip: false
        })
        .then(results=>{
         //alert('2')
          if(results.data){
          this.dmfwfGid=results.data.gid
          this.dmfwf.itemstypeout=results.data.jsfs_out
          this.dmfwf.gid=this.inputModelData.zddlcode.toLowerCase().indexOf('wff')!='-1'?results.data.gid:this.inputModelData.mawbgid
          this.dmfwf.settname=this.inputModelData.zddlcode.toLowerCase().indexOf('wff')!='-1'?getGysname(results.data.gid,1):getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname.split('-')[1]

         }else{
          this.dmfwf.gid=this.inputModelData.zddlcode.toLowerCase().indexOf('wff')!='-1'?'-1':this.inputModelData.mawbgid
          this.dmfwf.settname=this.inputModelData.zddlcode.toLowerCase().indexOf('wff')!='-1'?'':getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname.split('-')[1]
         
         }


         this.dmfwfBk=JSON.parse(JSON.stringify(this.dmfwf))
        


        })
        .catch(error=>{

        })
      },

     /*****************************尺寸信息************************************/
    sizeRowData(guid) {
      this.sizeDialog = true
      let sizeArr = []
      let sizeArr2=[]
      let sizeArr3 = []
      this.$axios({
          method: 'get',
          url: this.$store.state.webApi + 'api/ExHpoAxplineGetBillSize',
          params: {
            boguid: this.inputModelData.boguid
          },
          loading: true,
          tip: false
        })
        .then(results => {
          this.sizeInfo = results.data

          if (this.sizeInfo.hpoInfo) {
            if (this.sizeInfo.hpoInfo.isinwageallin == '1') {
              this.sizeInfo.hpoInfo.isinwageallin = '单价ALLIN'
              this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
            } else if (this.sizeInfo.hpoInfo.isinwageallin == '2') {
              this.sizeInfo.hpoInfo.isinwageallin = 'M级++'
              this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
            } else if (this.sizeInfo.hpoInfo.isinwageallin == '3') {
              this.sizeInfo.hpoInfo.isinwageallin = '单价++'
              this.sizeInfo.hpoInfo.inwagecostprice = this.sizeInfo.hpoInfo.inwageallinprice
            } else if (this.sizeInfo.hpoInfo.isinwageallin == '4') {
              this.sizeInfo.hpoInfo.isinwageallin = 'Cost++'
              //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
            }
            if (this.sizeInfo.hpoInfo.isoutwageallin == '1') {
              this.sizeInfo.hpoInfo.isoutwageallin = '单价ALLIN'
            } else if (this.sizeInfo.hpoInfo.isoutwageallin == '2') {
              this.sizeInfo.hpoInfo.isoutwageallin = 'M级++'
            } else if (this.sizeInfo.hpoInfo.isoutwageallin == '3') {
              this.sizeInfo.hpoInfo.isoutwageallin = '单价++'
            }
          }

          if(this.sizeInfo.xshpoInfo){
            if (this.sizeInfo.xshpoInfo.isinwageallin == '1') {
              this.sizeInfo.xshpoInfo.isinwageallin = '单价ALLIN'
              this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '2') {
              this.sizeInfo.xshpoInfo.isinwageallin = 'M级++'
              this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '3') {
              this.sizeInfo.xshpoInfo.isinwageallin = '单价++'
              this.sizeInfo.xshpoInfo.inwagecostprice = this.sizeInfo.xshpoInfo.inwageallinprice
            } else if (this.sizeInfo.xshpoInfo.isinwageallin == '4') {
              this.sizeInfo.xshpoInfo.isinwageallin = 'Cost++'
              //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
            }
          }

          let ybList=[];
          let sjList=[];
          let qrList = [];
          let ybStoreList=[];
          let sjStoreList=[];
          let qrStoreList = [];

          this.sizeInfo.storeList.forEach(i=>{
            if(sjList.indexOf(i.vol_guid)=='-1'&&i.vol_guid!=0){
              // i.vol_heights=Number(i.vol_heights/100).toFixed(2)
              // i.vol_longs=Number(i.vol_longs/100).toFixed(2)
              // i.vol_widths=Number(i.vol_widths/100).toFixed(2)
              sjList.push(i.vol_guid)
              sjStoreList.push(i)
            }
          })

          this.sizeInfo.storeYbList.forEach(i=>{
            if(ybList.indexOf(i.vol_guid_yb)=='-1'&&i.vol_guid_yb!=0){
              // i.vol_heights_yb=Number(i.vol_heights_yb/100).toFixed(2)
              // i.vol_longs_yb=Number(i.vol_longs_yb/100).toFixed(2)
              // i.vol_widths_yb=Number(i.vol_widths_yb/100).toFixed(2)
              ybList.push(i.vol_guid_yb)
              ybStoreList.push(i)
            }
          })

                  this.sizeInfo.customstoreList.forEach(i => {
            if (qrList.indexOf(i.vol_guid) == '-1' && i.vol_guid != 0) {
              // i.vol_heights_yb=Number(i.vol_heights_yb/100).toFixed(2)
              // i.vol_longs_yb=Number(i.vol_longs_yb/100).toFixed(2)
              // i.vol_widths_yb=Number(i.vol_widths_yb/100).toFixed(2)
              qrList.push(i.vol_guid)
              qrStoreList.push(i)
            }
          })

          for (var i = 0; i < ybStoreList.length; i += 2) {
            sizeArr.push(ybStoreList.slice(i, i + 2));
          }

          for (var i = 0; i < sjStoreList.length; i += 2) {
            sizeArr2.push(sjStoreList.slice(i, i + 2));
          }

          for (var i = 0; i < qrStoreList.length; i += 2) {
            sizeArr3.push(qrStoreList.slice(i, i + 2));
          }

          this.sizeInfo.sjList = sizeArr2
          this.sizeInfo.ybList = sizeArr
          this.sizeInfo.qrList = sizeArr3


         console.log(this.sizeInfo)


        })
        .catch(error => {

        })

    },

    copyContent(element) {
      var range = document.createRange();
      var startNode = document.getElementById(element);
      range.selectNode(startNode);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range)
    },

    //**************总运单方法*************
    configMawb(){
      this.$parent.$parent.installMawb()
      //console.log(this.$parent.$parent)
    },
    unConfigMawb(){
      console.log(this.$parent.$parent.rowData)
      this.$parent.$parent.unstallMawb()
    },

  

      // ***********制单方法请求************
      //修改制单弹框
      modZdInfoS() {
        if(this.yingshoustatus||this.yingfustatus){
          return this.$message.info('应收或应付费用已确认无法操作')
        }
        
        this.modzdInfoShow = true
          //let jfweight=this.zdjfweight
          let back = {...this.inputModelData
          }
          //console.log(back)
          this.modzdInfo.zdpiece = back.zdpiece
          this.modzdInfo.zdweight = back.bgweight?back.bgweight:back.zdweight
          this.modzdInfo.zdvolume = back.zdvolume
          this.modzdInfo.zdjfweight = back.jfweight
          this.zdzlischange='2'
        },
      //删除制单提示框
      delZdInfo() {
        if(this.yingshoustatus||this.yingfustatus){
          return this.$message.info('应收或应付费用已确认无法操作')
        }
        this.$confirm('是否继续删除制单信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.zdInfoOperation('3')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        })
      },

      //制单信息操作(1导入 2导入 3删除)
      zdInfoOperation(type) {
        let url = type != '3' ? 'api/ExHpoAxplineExportBill' : 'api/ExHpoAxplineDeletExportBill'
        let json = {}
        if (type == '1' || type == '2') {
          json = {
            boguid: this.inputModelData.boguid,
            operguid: this.inputModelData.guid,
            zdzlischange:type == '1'?'2':'1',
            cp:(!this.inputModelData.cp&&this.inputModelData.cp!==0)?'666666':this.inputModelData.cp,
            zdpiece: type == '1' ? this.modzdInfo.zdpiece : this.inputModelData.zdpiece,
            zdvolume: type == '1' ? this.modzdInfo.zdvolume : this.inputModelData.zdvolume,
            zdweight: type == '1' ? this.modzdInfo.zdweight : this.inputModelData.bgweight||this.inputModelData.zdweight,
            jfweight: type == '1' ? this.modzdInfo.zdjfweight : this.inputModelData.jfweight,
            hbh: this.inputModelData.yqhbh,
            hbrq: this.inputModelData.yqhbrq
          }

          if(!String(this.inputModelData.cp).length&&!this.inputModelData.cp&&this.JudgeBubblesFunc(1)<0&&type=='2'){
            this.$message.info('请填写吃泡比例')
            return
          }

          if(this.yingshoustatus||this.yingfustatus){
          return this.$message.info('应收或应付费用已确认无法操作')
          }

          if(type=='2'&&this.inputModelData.jfweight!=computedWeight(this.inputModelData.zdvolume,this.inputModelData.zdweight)||type=='1'&&this.modzdInfo.zdjfweight!=computedWeight(this.modzdInfo.zdvolume,this.modzdInfo.zdweight)){
            this.$confirm('计费重量与计算结果不同,是否继续操作?', '提示',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(()=>{
             this.axiosZdFfunctio(json,url,type)
            })
            .catch(()=>{
             this.$message({
              type: 'info',
              message: '已取消删除'
              })
            })
          }else{
            this.axiosZdFfunctio(json,url,type)
          }
        } else {
          json = {
            boguid: this.inputModelData.boguid,
            operguid: this.inputModelData.guid,
          }
          this.axiosZdFfunctio(json,url,type)
        }

      },
      axiosZdFfunctio(json,url,type){
        
          this.$axios({
          method: 'put',
          url: this.$store.state.webApi + url,
          data: json,
          loading: true,
          tip: false,
          noarea: '1'
        })
        .then(results => {
          if (results.data.resultstatus == 0) {
            this.switchHawb=true
            if (type != '3') {
              this.inputModelData.zdpiece = json.zdpiece
              this.inputModelData.zdweight = json.zdweight
              this.inputModelData.zdvolume = json.zdvolume
              this.inputModelData.jfweight = json.jfweight
              console.log(json.jfweight)
              this.inputModelDataBack.jfweight=json.jfweight

                this.inputModelData.accountweightin = Number(this.inputModelData.accountweightin)>0&&!this.changeAccountWeight.accountweightin ? this.inputModelData.accountweightin : this.accountweightin
                this.inputModelData.accountweightout = Number(this.inputModelData.accountweightout)>0&&!this.changeAccountWeight.accountweightout ? this.inputModelData.accountweightout : this.accountweightout
                this.inputModelData.zzysweight = Number(this.inputModelData.zzysweight)>0&&!this.changeAccountWeight.zzysweight ? this.inputModelData.zzysweight : this.accountweightinZz
                this.inputModelData.zzyfweight = Number(this.inputModelData.zzyfweight)>0&&!this.changeAccountWeight.zzyfweight ? this.inputModelData.zzyfweight : this.accountweightoutZz

 

                  this.$set(this.sizeData, '4', {
                    //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.zdweight),
                    wtLength: '--',
                    type: '制单',
                    size: json.zdpiece + '/' + Number(json.zdweight).toFixed(2) + '/' + Number(json.zdvolume).toFixed(3),
                    jfweight: Number(json.jfweight).toFixed(2),
                    zp:'--',
                    description:'制单件重体',
                  })
                  this.inputModelData.zddrstatus = 2
                  this.$refs.accountweightin.jsList.list[2]['num']=json.jfweight
                  this.$refs.accountweightinzz.jsList.list[2]['num']=json.jfweight
                  this.$refs.accountweightout.jsList.list[2]['num']=json.jfweight
                  this.$refs.accountweightoutzz.jsList.list[2]['num']=json.jfweight
                // this.sizeData[2]={wtLength:this.weigthLength(this.inputModelData.realweight, this.inputModelData.zdweight),type: '制单',size:json.zdpiece+'/'+Number(json.zdweight).toFixed(2)+'/'+Number(json.zdvolume).toFixed(3),jfweight:this.zdjfweight}



              } else {
                this.$set(this.sizeData, '4', {
                  wtLength: '--',
                  type: '制单',
                  size: '0/0.00/0.000',
                  jfweight: '0.00',
                  zp:'--',
                  description:'制单件重体',
                })
                this.inputModelData.cp=''
                
                this.inputModelData.zdpiece = this.inputModelDataBack.bgpiece?this.inputModelDataBack.bgpiece:this.inputModelDataBack.realpiece
                this.inputModelData.zdweight=Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2)
                this.inputModelData.zdvolume = Number(this.inputModelDataBack.signvolume).toFixed(3)


                this.inputModelData.jfweight=computedWeight(this.inputModelData.signvolume,this.inputModelData.signweight)

                this.inputModelData.accountweightin=this.inputModelData.jgysischange==1?0:this.inputModelData.accountweightin
                this.inputModelData.accountweightout=this.inputModelData.jgyfischange==1?0:this.inputModelData.accountweightout
                this.inputModelData.zzyfweight=this.inputModelData.zzyfischange==1?0:this.inputModelData.zzyfweight
                this.inputModelData.zzysweight=this.inputModelData.zzysischange==1?0:this.inputModelData.zzysweight
                this.inputModelData.zddrstatus=3

                //this.inputModelData.jfweight = json.jfweight
                //this.inputModelDataBack.jfweight=json.jfweight

                  //this.sizeData[2]={wtLength:'--',type: '制单',size:'0/0.00/0.000',jfweight:0.00}
                }
                this.modzdInfoShow = false
                // if(this.inputModelData.groupid>0&&this.childData){
                //   this.togglehawbN(this.childData)
                // }
                this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)

                this.$message.success(results.data.resultmessage)
              } else {
                this.$message.error(results.data.resultmessage)
              }
            })
        .catch(error => {

        })
      },

      // ***********保存签单方法************
      //保存、签单(type 1保存,2签单  mark 1保存,2应收确认,3取消应收确认,4应付确认,5取消应付确认)
      async saveDocument(type, mark) {
        if(mark=='0'&&type=='2'){
          //alert(this.inputModelData.mawbgid)
          if(this.inputModelData.mawbgid=='-1' && this.inputModelData.system=='空出'){
            this.$message.error('无总运单供应商无法签单')
            return
          }
        }
        if(type=='2'||type=='1'){
          if(!this.inputModelData.zdweight&&type=='2'){
            this.$message.error('制单重量为0无法签单')
            return
          }
          
          if(this.inputModelData.sfg=='PVG'&&!this.inputModelData.zddlcode.toLowerCase().includes('sha')&&this.inputModelData.iszddl=='2'){
            this.$message.error('始发港为PVG的情况下制单代理代码必须含有SHA')
            return
          }
        }
        if(mark=='2'){
          if(this.inputModelData.inwageallinprice){
            if(!this.mawbCharge.filter(i=>{return i.items=='航司运费'&&i.isdel=='1'}).length){
             this.$message.error('无应收航司运费无法确认')
             return
           }
         }
         if(this.mawbCharge.filter(i=>{return i.isallin=='1'}).length){
          if(this.mawbCharge.filter(i=>{return i.isallin=='1'}).map(i=>{return i.leastwageall=='--'?'0':i.leastwageall}).reduce((a,b)=>{return Number(a)+Number(b)})==0){
            this.$message.error('费用数量为0无法确认')
          return
          }

          
        }
      }else if(mark=='4'){
        console.log(this.mawbPayment)
        if(this.inputModelData.outwageallinprice){
          if(!this.mawbPayment.filter(i=>{return i.items=='航司运费'&&i.isdel=='1'}).length){
           this.$message.error('无应付航司运费无法确认')
           return
         }
       }
       // console.log(this.mawbPayment.filter(i=>{return i.isallin=='1'}).map(i=>{return i.leastwageall=='--'?'0':i.leastwageall}).reduce((a,b)=>{return Number(a)+Number(b)}))

         if(this.mawbPayment.filter(i=>{return i.isallin=='1'}).length){
          if(this.mawbPayment.filter(i=>{return i.isallin=='1'}).map(i=>{return i.leastwageall=='--'?'0':i.leastwageall}).reduce((a,b)=>{return Number(a)+Number(b)})==0){
            this.$message.error('费用数量为0无法确认')
            return
          }
        }

        }

        
      
        this.switchWatch=false
        this.switchHawb=false

        this.inputModelData.profitmode=this.getServiceGuid('OA0010','profitmode')||'本站'
        this.inputModelData.jgysischange = this.changeAccountWeight.accountweightin? 1 : 2
        this.inputModelData.jgyfischange = this.changeAccountWeight.accountweightout ? 1 : 2
        this.inputModelData.zzysischange = this.changeAccountWeight.zzysweight? 1 : 2
        this.inputModelData.zzyfischange = this.changeAccountWeight.zzyfweight ? 1 : 2
        this.inputModelData.inwageallinprice = !Number(this.inputModelData.inwageallinprice) ? 666666 : this.inputModelData.inwageallinprice
        this.inputModelData.outwageallinprice = !Number(this.inputModelData.outwageallinprice) ? 666666 : this.inputModelData.outwageallinprice
        this.inputModelData.outwageallinprice_trans = !Number(this.inputModelData.outwageallinprice_trans) ? 666666 : this.inputModelData.outwageallinprice_trans
        this.inputModelData.inwageallinprice_trans = !Number(this.inputModelData.inwageallinprice_trans) ? 666666 : this.inputModelData.inwageallinprice_trans
        if(this.inputModelData.isinwageallin=='4'){
          this.inputModelData.inwagecostprice=this.inputModelData.inwageallinprice
        }else{
          this.inputModelData.inwagecostprice=666666
        }

        this.inputModelData.yfysweight=this.mawbCharge.filter(i=>i.items=='航司运费'&&i.isdel=='1').length>0&&this.mawbCharge.filter(i=>i.items=='航司运费'&&i.isdel=='1')[0]['num']

        this.inputModelData.yfyfweight=this.mawbPayment.filter(i=>i.items=='航司运费'&&i.isdel=='1').length>0&&this.mawbPayment.filter(i=>i.items=='航司运费'&&i.isdel=='1')[0]['num']

        var costList = this.inputModelData.groupid<0?[...this.mawbCharge.concat(this.mawbPayment)]:[...this.mawbPayment]
        costList.map(i => {
          i.isfree = i.isfree == '否'||i.isfree=='1' ? '1' : '2'
          i.confirmstatus=i.confirmstatus=='--'||!i.confirmstatus||i.confirmstatus=='1'?'1':'700'
        })
        this.inputModelData.wageList = costList
        

        if(this.inputModelData.groupid>0){//处理合并分单
          this.childrenList.forEach(i=>{
            if(i.boguid!=this.inputModelData.boguid){
            i.inwageallinprice = !Number(i.inwageallinprice) ? 666666 : i.inwageallinprice
            i.inwageallinprice_trans = !Number(i.inwageallinprice_trans) ? 666666 : i.inwageallinprice_trans
            i.inwagecostprice=666666
            //i.accountweightin=i.jgysischange=='1'?this.accountweightin:i.accountweightin
            //i.zzysweight=i.zzysischange=='1'?this.accountweightinZz:i.zzysweight
            i.wageList.map(i => {
              i.isfree = i.isfree == '否'||i.isfree=='1' ? '1' : '2'
              i.confirmstatus=i.confirmstatus=='--'||!i.confirmstatus||i.confirmstatus=='1'?'1':'700'
            })
            }

          })

          //this.$set(this.inputModelData,'childboList',this.childrenList)
          this.inputModelData.childboList=this.childrenList.filter(i=>{return i.boguid!=this.inputModelData.boguid})
        }
        //console.log(this.inputModelData)

        if (mark) {
          this.inputModelData.cztype = mark
        }
     

        
        if(type=='2'&&!this.inputModelData.zzg){//签单中转港必填
          this.$message.error('请填写中转港')
          return
        }else if(type=='2'&&this.inputModelData.yqhbh.length=='2'&&this.inputModelData.system=='空出'){
         this.$message.error('请填写完整航班号')
         return
       }
       
    
      var thishbInfo=this.inputModelData.yqhbh+this.inputModelData.yqhbrq+this.inputModelData.sfg+this.inputModelData.mdg+this.inputModelData.hwlx+this.inputModelData.hwxz
       if(thishbInfo===this.hbInfoChanged){
        this.$set(this.inputModelData,'hbInfoChanged',false)
      }else{
        this.$set(this.inputModelData,'hbInfoChanged',true)
      }
   
      ['yfjsgs','ysjsgs','zzyfjsgs','zzysjsgs'].forEach(i=>{
        let dom={}
        if(i=='yfjsgs'){
           dom=this.$refs.accountweightout.jsList
        }else if(i=='ysjsgs'){
           dom=this.$refs.accountweightin.jsList
        }else if(i=='zzyfjsgs'){
           dom=this.$refs.accountweightoutzz.jsList
        }else if(i=='zzysjsgs'){
           dom=this.$refs.accountweightinzz.jsList
        }
        this.inputModelData[i]=`{first:'${dom.first}',second:'${dom.second}',third:'${dom.third}'}`
      })
      console.log(this.inputModelData)
      //console.log(eval("("+this.inputModelData['yfjsgs']+")")['first'])
      if(!eval("("+this.inputModelData['ysjsgs']+")")['first']||!eval("("+this.inputModelData['yfjsgs']+")")['first']){
          return this.$message.error('请完善重量公式')
      }
      //return
       
        if(this.inputModelData.realpiece!=this.inputModelData.signpiece&&type=='2'){
          this.$confirm('实际件数和签单件数不同,是否继续操作?','提示',{
             confirmButtonText: '确定',
            cancelButtonText: '取消',
             type: 'warning'
          })
          .then(()=>{
         this.saveDocumentF(type,mark)
          })
          .catch(()=>{
            this.$message({
            type: 'info',
            message: '已取消操作'
          });          
          })
        }else{
          this.saveDocumentF(type,mark)
        }
    
     

    },
    async saveDocumentF(type,mark){
       var url = type == '1' ? 'api/ExHpoAxplineSaveMateShipspace' : 'api/ExHpoAxplineCommMateShipspace'
       await this.$axios({
            method: "put",
            url: this.$store.state.webApi + url,
            data: this.inputModelData,
            loading: true,
            tip: false,
            noarea: '1'
          })
      .then(results => {

        if (results.data.resultstatus == 0) {
          if ( !this.visibleI) {
            this.inputModelData.dzstatus = 350;
          }

          this.$message.success(results.data.resultmessage?results.data.resultmessage:'更新成功')
          if (type == '2'&&this.inputModelData.commbillmodifystatus=='1') {
            this.inputModelData.dzstatus = '300'
          }else{
            if(this.inputModelData.commbillmodifystatus=='2'){
              this.inputModelData.commbillmodifystatus='3'
            }
          }
           this.zdBasicInfo.iszddl.disabled = true
          this.zdBasicInfo.zddlcode.disabled = true
          
          let wagePriceArr = ['inwageallinprice', 'outwageallinprice', 'outwageallinprice_trans', 'inwageallinprice_trans']
          wagePriceArr.forEach(i => {
            this.inputModelData[i] = this.inputModelData[i] == 666666|| this.inputModelData[i] == '666666'? "" : String(this.inputModelData[i])
          })
          if(this.inputModelData.groupid>0){
           wagePriceArr.forEach(i => {
            this.childrenList.forEach(i2=>{
              i2[i]=i2[i] == 666666|| i2[i] == '666666'? "" : String(i2[i])
            })
          })
         }

         this.mawbCost(true)
         if(mark=='2'){
           this.$emit('rowDataUpdate',{confirmstatus_in:'700',wageall_in:this.allinCost,boguid:this.inputModelData.boguid})
         }else if(mark=='3'){
           this.$emit('rowDataUpdate',{confirmstatus_in:'1',wageall_in:this.allinCost,boguid:this.inputModelData.boguid})
         }else if(mark=='4'){
          this.$emit('rowDataUpdate',{confirmstatus_out:'700',wageall_out:this.alloutCost,boguid:this.inputModelData.boguid})
        }else if(mark=='5'){
          this.$emit('rowDataUpdate',{confirmstatus_out:'1',wageall_out:this.alloutCost,boguid:this.inputModelData.boguid})
        }
        
        this.childrenList.forEach(i=>{
        
            i.wageList.map(i => {
              i.isfree = i.isfree == '1'||i.isfree=='否' ? '否' : '是'
              i.confirmstatus=i.confirmstatus=='已确认'||i.confirmstatus=='700'?'已确认':'--'
            })
            

          })
         console.log(this.type)
        if(type=='1'&&this.type){

          let change=this.allCostData.filter(i=>i.wagedom=='航线'&&i.yssys=='1').reduce((a,b)=>{
            if(b.items=='航司运费'&&b.isallin=='1'&&b.isdel=='1'){
              a.push({wageinout:b.wageinout,leastwageall:b.leastwageall,items:b.items,price:b.wageinout=='1'?this.inputModelData.inwageallinprice:this.inputModelData.outwageallinprice,num:b.num})
            }
         
            if(b.items=='航司中转费'&&b.isdel=='1'){
              a.push({wageinout:b.wageinout,leastwageall:b.leastwageall,items:b.items,price:b.price,num:b.num})
            }
           return a
           
          },[])
          
          this.$emit('changeWage',change)
          this.closeDialog()
        }
        //console.log(this.allCostData.filter(i=>i.wagedom=='航线'&&i.yssys=='1'))

          // this.mawbCharge.concat(this.mawbPayment).map(i=>{
          //   i.isfree=i.isfree=='1'||i.isfree=='否'||!i.isfree?'否':'是'
          //   i.confirmstatus=i.confirmstatus=='700'||i.confirmstatus=='已确认'?'已确认':'--'
          // })

        //   if(this.inputModelData.groupid>0&&this.childData){
        //   this.togglehawbN(this.childData)
        // }

      } else {


        if(mark=='2'){
          this.mawbCharge.forEach(item=>{
            item.confirmstatus='--'
          })

        }else if(mark=='3'){
          this.mawbCharge.forEach(item=>{
            item.confirmstatus='已确认'
          })
        }else if(mark=='4'){
            //alert('2')
            this.mawbPayment.forEach(item=>{
              item.confirmstatus='--'
            })
          }else if(mark=='5'){

            this.mawbPayment.forEach(item=>{
              item.confirmstatus='已确认'
            })
          }

          
          this.mawbCharge.concat(this.mawbPayment).map(i=>{
            i.isfree=i.isfree=='1'||i.isfree=='否'||!i.isfree?'否':'是'
            if(mark=='0'||mark=='1'){
              i.confirmstatus=i.confirmstatus=='700'||i.confirmstatus=='已确认'?'已确认':'--'
            }

          })

          let wagePriceArr = ['inwageallinprice', 'outwageallinprice', 'outwageallinprice_trans', 'inwageallinprice_trans']
          wagePriceArr.forEach(i => {
            this.inputModelData[i] = this.inputModelData[i] == 666666|| this.inputModelData[i] == '666666'? "" : String(this.inputModelData[i])
          })

          if(this.inputModelData.groupid>0){
           wagePriceArr.forEach(i => {
            this.childrenList.forEach(i2=>{
              i2[i]=i2[i] == 666666|| i2[i] == '666666'? "" : String(i2[i])
            })
          })
         }
           
            this.$message.error(results.data.resultmessage)
          }
        })
      .catch(error => {

      })

           this.switchWatch=true
          this.switchHawb=true
      
    },
      async hawbWageConfirm(type){//子订单确认、取消确认操作(type 1确认 2取消确认)
        var data=this.childData
        //data.cztype=type

        this.childData.inwageallinprice = !Number(this.childData.inwageallinprice) ? 666666 : this.childData.inwageallinprice
        this.childData.outwageallinprice = !Number(this.childData.outwageallinprice) ? 666666 : this.childData.outwageallinprice
        this.childData.outwageallinprice_trans = !Number(this.childData.outwageallinprice_trans) ? 666666 : this.childData.outwageallinprice_trans
        this.childData.inwageallinprice_trans = !Number(this.childData.inwageallinprice_trans) ? 666666 : this.childData.inwageallinprice_trans
        this.childData.inwagecostprice=666666

        this.mawbCharge.map(i => {
          i.isfree = i.isfree == '否'||i.isfree=='1' ? '1' : '2'
          i.confirmstatus=i.confirmstatus=='--'||!i.confirmstatus||i.confirmstatus=='1'?'1':'700'
        })

        //this.childData.wageList = this.mawbCharge
        this.switchHawb=false
        await this.$axios({
          method: "put",
          url: this.$store.state.webApi + 'api/HBOWageComfirm',
          data: {childbo:data,cztype:type},
          loading: true,
          tip: false,
          noarea: '1'
        })
        .then(results=>{
         if(results.data.resultstatus==0){
          this.$message.success(results.data.resultmessage)

          if(type=='1'){
            this.yingshoustatus=true
            this.yingshoustatusForm=true
            this.mawbCharge.forEach(item=>{
            item.confirmstatus='已确认'
            item.isfree=item.isfree=='1'||item.isfree=='否'||!item.isfree?'否':'是'
          })
          }else if(type=='2'){
            this.yingshoustatus=false
            this.yingshoustatusForm=false
            this.mawbCharge.forEach(item=>{
            item.confirmstatus='--'
            item.isfree=item.isfree=='1'||item.isfree=='否'||!item.isfree?'否':'是'
          })
          }
          this.mawbCost()
          //this.togglehawbN(this.childData)    
        }else{

         if(type=='1'){
          this.mawbCharge.forEach(item=>{
            item.confirmstatus='--'
          })

        }else if(type=='2'){
          this.mawbCharge.forEach(item=>{
            item.confirmstatus='已确认'
          })
        }
        this.$message.error(results.data.resultmessage)
      }

      this.mawbCharge.forEach(i=>{
        i.isfree=i.isfree=='1'||i.isfree=='否'||!i.isfree?'否':'是'
      })

      let wagePriceArr = ['inwageallinprice', 'outwageallinprice', 'outwageallinprice_trans', 'inwageallinprice_trans']
      wagePriceArr.forEach(i => {
        this.childData[i] = this.childData[i] == 666666|| this.childData[i] == '666666'? "" : String(this.childData[i])
      })

      

    })
        .catch(error=>{

        })
        this.switchHawb=true
      },
      // 取消签单
      CancelDocument(){
       var json={boguid:this.inputModelData.boguid,operguid:this.inputModelData.guid}
       this.$axios({
        method: "put",
        url: this.$store.state.webApi + 'api/ExHpoAxplineCancelMateShipspace',
        data: json,
        loading: false,
        tip: false,
        noarea: '1'
      })
       .then(results=>{
         if (results.data.resultstatus == 0) {
          this.inputModelData.dzstatus='200'
        }else{
          this.$message.error(results.data.resultmessage)
        }
      })
       .catch(error=>{

       })
     },

      // ***********总单详细请求************
      //总单详细
      async mawbDetail() {
          //this.smallCostDataYf=[]
        //this.childrenList=[]
        await this.$axios({
          method: 'get',
          url: this.$store.state.webApi + 'api/ExHpoAxplineMateShipspaceInfo',
          params: {
            boguid: this.boguid
          },
          //loading: true,
          tip: false
        })
        .then(results => {
          //console.log(results.data)
          this.inputModelData=results.data.resultdic.allinfo
          // Object.keys(results.data.resultdic.allinfo).forEach(i=>{
          //   this.$set(this.inputModelData,i,results.data.resultdic.allinfo[i])
          // })
          console.log(this.inputModelData)
          this.$set(this.inputModelData, 'bgstatus', results.data.resultdic.bgstatus)
          this.$set(this.inputModelData, 'dzmawbyq', results.data.resultdic.dzmawbyq)
          this.$set(this.inputModelData, 'wclhyq', results.data.resultdic.wclhyq)
          this.$set(this.inputModelData, 'signyq', results.data.resultdic.signyq)
          this.$set(this.inputModelData, 'zddrstatus', results.data.resultdic.zddrstatus)
          this.$set(this.inputModelData, 'zzysweight', results.data.resultdic.zzysweight)
          this.$set(this.inputModelData, 'zzyfweight', results.data.resultdic.zzyfweight)
          
          this.$set(this.inputModelData, 'jgyfischange', results.data.resultdic.jgyfischange)
          this.$set(this.inputModelData, 'jgysischange', results.data.resultdic.jgysischange)
          this.$set(this.inputModelData, 'zzyfischange', String(results.data.resultdic.zzyfischange))
          this.$set(this.inputModelData, 'zzysischange', results.data.resultdic.zzysischange)
          this.$set(this.inputModelData, 'cp', (results.data.resultdic.cp=='666666'||(!results.data.resultdic.cp&&results.data.resultdic.cp!==0))?'':results.data.resultdic.cp)
          this.$set(this.inputModelData, 'canceling', results.data.resultdic.canceling)
          this.$set(this.inputModelData, 'signrealpiece', results.data.resultdic.signrealpiece)
          this.$set(this.inputModelData, 'signrealweight', results.data.resultdic.signrealweight)
          this.$set(this.inputModelData, 'signrealvolume', results.data.resultdic.signrealvolume)
          this.$set(this.inputModelData, 'signcommitpiece', results.data.resultdic.signcommitpiece)
          this.$set(this.inputModelData, 'signcommitweight', results.data.resultdic.signcommitweight)
          this.$set(this.inputModelData, 'signcommitvolume', results.data.resultdic.signcommitvolume)

         
          this.$set(this.inputModelData, 'boardgys', results.data.resultdic.boardgys)
          this.$set(this.inputModelData, 'yfjffs', results.data.resultdic.yfjffs)
          this.$set(this.inputModelData, 'ysjffs', results.data.resultdic.ysjffs)

          this.$set(this.inputModelData,'ysjsgs',results.data.resultdic.ysjsgs)
          this.$set(this.inputModelData,'yfjsgs',results.data.resultdic.yfjsgs)
          this.$set(this.inputModelData,'zzyfjsgs',results.data.resultdic.zzyfjsgs)
          this.$set(this.inputModelData,'zzysjsgs',results.data.resultdic.zzysjsgs)
          
           this.$set(this.inputModelData,'accountweightinSelect',results.data.resultdic.accountweightinSelect)
          this.$set(this.inputModelData,'accountweightoutSelect',results.data.resultdic.accountweightoutSelect)

          console.log(this.inputModelData.zzyfweight)
        
 //alert('11')
          //this.inputModelData.inwageallinclude=''
          //this.inputModelData.outwageallinclude=''


        
        /*  if(this.inputModelData.serviceList &&this.inputModelData.serviceList.find(i => i.servicecode == "AA0610"&&i.isdel==1)){
           this.inputModelData.bgweight=this.inputModelData.declweight
         } */
         if(results.data.resultdic.jgyfischange=='2'){
          this.changeAccountWeight.accountweightout=false
        }
        if(results.data.resultdic.jgysischange=='2'){
          this.changeAccountWeight.accountweightin=false
        }
        if(results.data.resultdic.zzyfischange=='2'){
          this.changeAccountWeight.zzyfweight=false
        }
        if(results.data.resultdic.zzysischange=='2'){
          this.changeAccountWeight.zzysweight=false
        }
         
            // this.$set(this.inputModelData, 'jgyfischange', String(results.data.resultdic.jgyfischange))
            // this.$set(this.inputModelData, 'jgysischange', results.data.resultdic.jgysischange)
            // this.$set(this.inputModelData, 'zzyfischange', results.data.resultdic.zzyfischange)
            // this.$set(this.inputModelData, 'zzysischange', results.data.resultdic.zzysischange)
            this.childrenList.push(this.inputModelData)
            this.inputModelData.iscx = this.inputModelData.iscx == 0 ? '未超限' : '超限'
             
            //  if(Number(this.inputModelData.childguid)>0){//销售站
           

            //   this.zdBasicInfo.gysname.hidden=true
            //   this.zdBasicInfo.mawbss.hidden=true
            // }else{

            //   this.zdBasicInfo.gysname.hidden=false
            //   this.zdBasicInfo.mawbss.hidden=false
            
            // }
            //console.log(getWtxmname(this.inputModelData.boardgys,1))
            this.inputModelData.wtxmname=getWtxmname(results.data.resultdic.allinfo.gid,1)
            
            //Number(this.inputModelData.groupid)<0?results.data.resultdic.allinfo.wtxmname.split('-')[1]:''
            //console.log('1212')

            // this.inputModelData.gysname=getGysname(results.data.resultdic.allinfo.mawbgid,1)||results.data.resultdic.allinfo.gysname.split('-')[1]
            this.inputModelData.gysname=results.data.resultdic.allinfo.gysname.split('-')[1]
            //console.log(this.inputModelData.gysname)
            //this.$set(this.inputModelData,'profitmode',this.getServiceGuid('OA0010','profitmode')||'本站')
            this.inputModelData.profitmode=this.getServiceGuid('OA0010','profitmode')||'本站'
            if(this.inputModelData.mawb&&this.inputModelData.system=='空出'){
              this.inputModelData.airCompany=JSON.parse(localStorage.airinfo).filter(i=>i.ThreeCode==this.inputModelData.mawb.split('-')[0])[0]['CName']
            }
           // console.log(this.inputModelData.profitmode)
           
            this.curObjectKyYf['gid'] = results.data.resultdic.allinfo.mawbgid
           this.curObjectKyYf['sid'] = results.data.resultdic.allinfo.boguid

           this.curObjectKyYs['gid'] = this.inputModelData.groupid<0?results.data.resultdic.allinfo.gid:''
           this.curObjectKyYs['sid'] = results.data.resultdic.allinfo.boguid

           
           this.curObjectKyYs['settname'] = this.inputModelData.groupid<0?this.inputModelData.wtxmname:''
           this.curObjectKyYf['settname']=getGysname(results.data.resultdic.allinfo.mawbgid,1)
           console.log(this.curObjectKyYf['settname'])
           //this.curObjectKyYf['settname'] = this.inputModelData.gysname
           
           if(this.inputModelData.zddrstatus!='2'){
             
            this.inputModelData.zdweight=Number(Number(this.inputModelData.bgweight)?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2)
            
            this.inputModelData.zdpiece=this.inputModelData.bgpiece?this.inputModelData.bgpiece:this.inputModelData.realpiece
  
            this.inputModelData.zdvolume=this.inputModelData.realvolume
            console.log(this.inputModelData.zdvolume,this.inputModelData.zdweight)
            this.inputModelData.jfweight=computedWeight(this.inputModelData.zdvolume,this.inputModelData.zdweight)
            console.log(this.inputModelData.jfweight)
          }

            this.inputModelData.yqhbrq = results.data.resultdic.allinfo.shipaceInfo.hbrq && results.data.resultdic.allinfo.shipaceInfo.hbrq.indexOf('1900') == -1 ? results.data.resultdic.allinfo.shipaceInfo.hbrq.substring(0, 11) : results.data.resultdic.allinfo.yqhbrq.substring(0, 11)

            this.inputModelData.yqhbh = results.data.resultdic.allinfo.shipaceInfo && results.data.resultdic.allinfo.shipaceInfo.hbh || results.data.resultdic.allinfo.yqhbh

            this.inputModelData.terminalname=results.data.resultdic.allinfo.shipaceInfo&&results.data.resultdic.allinfo.shipaceInfo.terminalname

            this.inputModelData.qcts = results.data.resultdic.allinfo.shipaceInfo.qcts || results.data.resultdic.allinfo.yqqcts;
            
            if(!this.inputModelData.zzg){
              //alert('1')
              this.getZzg(this.inputModelData.sfg,this.inputModelData.yqhbh,this.inputModelData.yqhbrq)
            }

            //coload 操作站并且orderguid>0 无法操作运价
            if(this.inputModelData.profitmode=='Co-Load模式'&&this.inputModelData.orderguid>0){
             this.fareInputViewData.isinwageallin.disabled=true
             this.fareInputViewData.inwageallinprice.disabled=true
             this.fareInputViewData.firstXy.disabled=true
             this.fareInputViewData.first.disabled=true
           }

           this.$set(this.inputModelData, 'iszddl', String(results.data.resultdic.iszddl))
           this.$set(this.inputModelData, 'zddlcode', results.data.resultdic.zddlcode)
           this.$set(this.inputModelData, 'inwageallinclude', results.data.resultdic.inwageallinclude||'4')
           this.$set(this.inputModelData, 'outwageallinclude',results.data.resultdic.outwageallinclude)
          //  ||(results.data.resultdic.zddlcode.toLowerCase().indexOf('wff')>=0?'-1':'4')


            //console.log(this.curObjectKyYs['settname'])


        // 666666转成空
        let wagePriceArr = ['inwageallinprice', 'outwageallinprice', 'outwageallinprice_trans', 'inwageallinprice_trans','inwagecostprice']
        wagePriceArr.forEach(i => {
          //console.log(this.inputModelData[i])
          this.inputModelData[i] = this.inputModelData[i] == 666666 ? "" : String(this.inputModelData[i])

        })
        if(this.inputModelData.isinwageallin=='4'){
          this.inputModelData.inwageallinprice=this.inputModelData.inwagecostprice
        }
        
        
        //总运单尺寸表格
        let size = ['yb','gf','qd','sj','zd']
        size.forEach(i => {
          if (i == 'yb') {
            this.sizeData.push({
              wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.ybweight),
              type: '预报',
              size: this.inputModelData.ybpiece + '/' + Number(this.inputModelData.ybweight).toFixed(2) + '/' + Number(this.inputModelData.ybvolume).toFixed(3),
              jfweight: this.ybjfweight,
              zp:'--',
              description:'客人托书件重体'
            })
          } else if (i == 'sj') {
            this.sizeData.push({
              //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.signweight),
              wtLength:'--',
              type: '实际',
              size: Number(this.inputModelData.signrealpiece+this.inputModelData.signcommitpiece) + '/' + Number(this.inputModelData.signrealweight+this.inputModelData.signcommitweight).toFixed(2) + '/' + Number(this.inputModelData.signrealvolume+this.inputModelData.signcommitvolume).toFixed(3),
              jfweight: this.sjjfweight,
              zp:'--',
              description:'实际货物的件重体',
              ziTable:[{
              //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.signrealweight),
              wtLength:'--',
              type: '入库',
              size: this.inputModelData.signrealpiece + '/' + Number(this.inputModelData.signrealweight).toFixed(2) + '/' + Number(this.inputModelData.signrealvolume).toFixed(3),
              jfweight: this.realjfweight, 
              zp:'--',
              description:'入库货物的实际件重体',
              },{
              //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.qrweight),
              wtLength:'--',
              type: '客户确认',
              size: this.inputModelData.signcommitpiece + '/' + Number(this.inputModelData.signcommitweight).toFixed(2) + '/' + Number(this.inputModelData.signcommitvolume).toFixed(3),
              jfweight: this.qrjfweight,   
              zp:'--',
              description:'不入库、晚入库货物的实际件重体',
              }]
            })
          }else if(i=='qd'){
            this.sizeData.push({
             wtLength:'--',
              type:'签单',
              size:this.inputModelData.signpiece + '/' + Number(this.inputModelData.signweight).toFixed(2) + '/' + Number(this.inputModelData.signvolume).toFixed(3),
              jfweight: this.qdjfweight,
              zp:this.JudgeBubblesFunc(3)>0?'重货':this.JudgeBubblesFunc(3)<0?'泡货':'平货',
              description:'实际货物的件重体',
              ziTable:[{
              wtLength:'--',
              type: '入库',
              size: this.inputModelData.signrealpiece + '/' + Number(this.inputModelData.signrealweight).toFixed(2) + '/' + Number(this.inputModelData.signrealvolume).toFixed(3),
              jfweight: this.realjfweight, 
              zp:'--',
              description:'入库货物的实际件重体',
              },{
              //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.qrweight),
              wtLength:'--',
              type: '客户确认',
              size: this.inputModelData.signcommitpiece + '/' + Number(this.inputModelData.signcommitweight).toFixed(2) + '/' + Number(this.inputModelData.signcommitvolume).toFixed(3),
              jfweight: this.qrjfweight,   
              zp:'--',
              description:'不入库、晚入库货物的实际件重体',
              }]
            })
          } else if (i == 'zd') {
            if (this.inputModelData.zddrstatus != '2'&&this.inputModelData.childguid<0) {
               
              this.sizeData.push({
                wtLength: '--',
                type: '制单',
                size: 0 / 0.00 / 0.000,
                jfweight: 0.00,
                zp:'--',
                description:'制单件重体',
              })
            } else {
              this.sizeData.push({
                //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.zdweight),
                wtLength:'--',
                type: '制单',
                size: this.inputModelData.zdpiece + '/' + Number(this.inputModelData.zdweight).toFixed(2) + '/' + Number(this.inputModelData.zdvolume).toFixed(3),
                jfweight: Number(this.inputModelData.jfweight).toFixed(2),
                zp:'--',
                description:'制单件重体',
              })
            }

          }else if(i=='gf'){
            this.sizeData.push({
                //wtLength: this.weigthLength(this.inputModelData.realweight, this.inputModelData.bgweight),
                wtLength:'--',
                type: '报关件重',
                size: this.inputModelData.bgpiece + '/' + Number(this.inputModelData.bgweight).toFixed(2) + '/' + '--',
                jfweight: '--',
                zp:'--',
                fontWeight:this.inputModelData.bgpiece>0||Number(this.inputModelData.bgweight)>0?'bold':'normal',
                description:'报关一体化件重',
              })
          }
        })
        //alert(this.accountweightin)
        if(this.JudgeBubblesFunc(1)>0){
        // this.fareInputViewData.first.disabled=true
        // this.fareInputViewData.second.disabled=true
        // this.fareInputViewData.first.disabled=true
        // this.fareInputViewData.second.disabled=true
      }

      if(this.inputModelData.dzstatus>=300 && this.inputModelData.commbillmodifystatus != 2){
        this.zdBasicInfo.iszddl.disabled=true
        this.zdBasicInfo.zddlcode.disabled=true
      }

        this.ysfFp('1') //应收协议分泡
        this.ysfFp('2') //应付协议分泡
        //console.log(this.inputModelData)
        if(this.inputModelData.czlx=='自货'||this.inputModelData.czlx=='唯凯配舱'){
          if(!this.inputModelData.mawb&&this.pagetype){
            //alert('1')

            this.mawbCost()
          }else{
            //alert('2')
            this.getAreaPrice() //总单杂费
          }
        }else{
          //alert('3')
          this.mawbCost()
        }

    //alert('4')
    
     //console.log(this.inputModelData)
     this.inputModelDataBack = {...this.inputModelData}
     this.hbInfoChanged=this.inputModelData.yqhbh+this.inputModelData.yqhbrq+this.inputModelData.sfg+this.inputModelData.mdg+this.inputModelData.hwlx+this.inputModelData.hwxz

     if(!this.inputModelData.mawb&&this.inputModelData.canceling!=3&&this.visibleI){
          this.$confirm('无总运单，无法操作应付运价','提示',{
            confirmButtonText:'确定',
            showCancelButton:false
          })
        }
        
        if(!this.inputModelData.mawb&&this.inputModelData.canceling==3){
          this.mawbCost()
        }

        

        if(this.inputModelData.zddlcode.toLowerCase().indexOf('wff')>=0&&!this.inputModelData.outwageallinclude){
          this.$nextTick(()=>{
          this.inputModelData.outwageallinclude='-1'
          this.handleDmCost('2',false)  
          })

         
        }else if(this.inputModelData.mawbss=='我司运单'&&this.inputModelData.zddlcode.toLowerCase().indexOf('wff')<0&&!this.inputModelData.outwageallinclude){
          this.$nextTick(()=>{
          this.inputModelData.outwageallinclude='4'
          this.handleDmCost('2',true)  
          })
        }else{
          if(!this.inputModelData.outwageallinclude){
          this.inputModelData.outwageallinclude='4'
          this.handleDmCost('2',true)  
          }
        }

         if(this.inputModelData.outwageallinclude){
          
          this.$nextTick(()=>{
           
             this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)   
      
            
          })
         
        }

        if(this.inputModelData.inwageallinclude){
          this.$nextTick(()=>{
            
               this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false) 
       
           
          })
           
        }
       
       if(this.inputModelData.childguid>0){
        this.$nextTick(()=>{
        this.inputModelData.accountweightin=this.accountweightin
        this.inputModelData.accountweightout=this.accountweightout
        this.inputModelData.zzysweight=this.accountweightinZz
        this.inputModelData.zzyfweight=this.accountweightoutZz
        })
       
       }

        console.log(this.inputModelData)
        })
          .catch(error => { })

          this.switchWatch=true

         
          // console.log(this.inputModelData)
        },
        async childrenDetail(){

          this.childrenList=[]
          this.childrenList.push(this.inputModelData)
          //console.log(JSON.parse(JSON.stringify(this.mawbCharge)))
          var costList=JSON.parse(JSON.stringify(this.mawbCharge))
          //console.log(costList)
          await this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{groupid: this.boguid},loading:true,tip:false})
          .then(results=>{
            


            results.data.forEach(i=>{
              i.yfstdin=String(i.yfstdin)
              i.isinwageallin=String(i.isinwageallin)
              i.isinwageallin_trans=String(i.isinwageallin_trans)

              i.wtxmname= getxmdata('xmdata').filter(i2=>{return i2.id==i.gid})[0].usr_name.split('-')[1]

              this.$set(i,'accountweightinChange',false)
              this.$set(i,'accountweightinChangeZz',false)
              let wagePriceArr = ['inwageallinprice','inwageallinprice_trans','inwagecostprice']
              wagePriceArr.forEach(i2 => {
                i[i2] = i[i2] == 666666 ? "" : String(i[i2])
              })
              i.wageList=[]
              i.wageList=costList.filter(i2=>{return i2.sid==i.boguid})

              this.childrenList.push(i)
            })
        

       

            
            //console.log(this.curObjectKyYs['gid'],111111)
            //console.log(this.childrenList)

            if(this.childData&&this.inputModelData.groupid>0){


               this.curObjectKyYs['settname'] = getWtxmname(this.childData.gid,1)
               this.curObjectKyYs['gid']=this.childData.gid

               this.togglehawbN(this.childData)
            }
            
             //console.log(this.childData)
            
          })


      
          this.switchHawb=true
          //this.togglehawbN(this.childrenList[1])
        },
        async togglehawbN(data){
        //console.log(data)
        //console.log(data.gid)
        //console.log(data.accountweightin)
        this.switchHawb=false
        this.childData=data
        this.modifyIndex='-1'
        this.fareInputViewData.isinwageallin.options[3].disabled=true

        if(data.boguid!=this.inputModelData.boguid){
  
       
          this.curObjectKyYs['settname'] = getWtxmname(data.gid,1)
          this.curObjectKyYs['gid']=data.gid
      
 
        }

      

     
        //console.log(this.childrenList)
         //this.mawbCharge=data.wageList
        if(data.boguid==this.inputModelData.boguid){
          this.mawbCharge=[]
          this.childrenList.forEach(i=>{
           if(i.wageList&&i.boguid!=this.inputModelData.boguid){

            console.log(i.wageList)
            this.mawbCharge=this.mawbCharge.concat(i.wageList.filter(i2=>{return i2.id}))
          }
        })
          //console.log(this.mawbCharge)
        }else{
          this.mawbCharge=data.wageList
        }

        this.yingshoustatus=this.allCostData.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='1'&&i.wagedom=='航线'&&i.yssys=='2'&&i.sid==data.boguid}).length>0?true:false
        if(this.mawbCharge){
           this.yingshoustatusForm=this.mawbCharge.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='1'&&i.wagedom=='航线'&&i.isallin=='1'&&i.sid==data.boguid}).length>0?true:false
        }
       



        if(this.childData.isinwageallin&&this.childData.inwageallinprice&&this.childData.iscomboine=='2'&&this.childData.boguid!=this.inputModelData.boguid){
          //alert('1')
          await this.handleHawbCost()
          this.mawbCharge.forEach(i=>{
            if(i.sid==this.childData.boguid&&i.isdel=='2'&&i.ismodify=='2'&&this.childData.isinwageallin>0){
              i.isdel='1'
            }
          })
        //this.switchHawb=true
      }

      if(this.childData.isinwageallin_trans&&this.childData.inwageallinprice_trans&&this.childData.iscomboine=='2'&&this.childData.boguid!=this.inputModelData.boguid){
        await this.handleZzCost()
      }
    if(!this.yingshoustatusForm&&this.childData.iscomboine=='2'&&this.childData.boguid!=this.inputModelData.boguid){
      this.mawbCharge.forEach(item => {
        if (item.items == '航司运费') {
          item.num=this.kynum('1',this.childData.isinwageallin,this.childData.isinwageallin=='2'?'票':'结算重量')
          item.price = this.kyprice('1')
          item.leastwageall = Number(Number(this.kyprice('1')) * Number(item.num)).toFixed(2)
          item.wageall = Number(Number(this.kyprice('1')) * Number(item.num) * Number(item.changerate)).toFixed(2)
        }
      })
    }

      var costItem=[]
      var smallCostItem=[]
      this.smallCostData.forEach(i=>{
       if(i.servicecode=='OA0010'&&i.isallin=='1'){
        smallCostItem.push(i)
      }
    })

    if(this.childData.iscomboine=='2'){
            this.mawbCharge.forEach(i=>{
        if(i.sid==this.childData.boguid){
          costItem.push(i.items)
        }
      })

      this.mawbCharge.forEach(i=>{
        i.isfree=='1'||i.isfree=='否'?'否':'是'
        i.confirmstatus=='700'||i.confirmstatus=='已确认'?'已确认':'--'
        if(this.childData.boguid!=this.inputModelData.boguid){
          if(i.ismodify=='2'&&i.wagetype=='结算重量'){
          if(smallCostItem.map(i2=>{return i2.items}).indexOf(i.items)=='-1'){
              i.num=i.items=='航司中转费'?Number(this.childData.zzysweight):Number(this.childData.accountweightin)
              i.leastwageall=(i.num*Number(i.price)).toFixed(2)
              i.wageall=(i.leastwageall*Number(getChangeRate(i.currency))).toFixed(2)
          }else{
              var index=smallCostItem.map(i2=>{return i2.items}).indexOf(i.items)

              i.num=Number(smallCostItem[index].min_price) <= Number(Number(this.childData.accountweightin) * Number(i.price)) ? Number(this.childData.accountweightin) : Number(Number(smallCostItem[index].min_price) / Number(i.price)).toFixed(2)

              i.leastwageall=Number(smallCostItem[index].min_price) <= Number(Number(this.childData.accountweightin) * Number(i.price)) ?(i.num*Number(i.price)).toFixed(2):Number(smallCostItem[index].min_price)

              i.wageall=Number(smallCostItem[index].min_price) <= Number(Number(this.childData.accountweightin) * Number(i.price)) ?(i.leastwageall*Number(getChangeRate(i.currency))).toFixed(2):(Number(smallCostItem[index].min_price)*Number(smallCostItem[index].changerate)).toFixed(2)
          }
        } 
        }

      })
    }
     


       //this.switchHawb=true
     },
     handleHawbCost(){

      var costItem=[]
      var smallCostItem=[]
      this.smallCostData.forEach(i=>{
       if(i.servicecode=='OA0010'&&i.isallin=='1'){
        smallCostItem.push(i)
      }
    })

      this.mawbCharge.forEach(i=>{
        if(i.sid==this.childData.boguid){
          costItem.push(i.items)
        }
      })


      if(!this.mawbCharge.filter(i=>{return i.items=='航司运费'}).length){
        if(this.childData.inwageallinprice&&this.childData.isinwageallin > 0){
          //alert('1')
          this.mawbCharge.push({
            status:-1,
            wageinout: '1',
            wagedom:'航线',
            ismodify: '2',
            isdel: '1',
            guid: '-1',
            isallin:this.isAllinF('1',this.childData.isinwageallin),
            currency: '人民币',
            items:'航司运费' ,
            settname: getWtxmname(this.childData.gid,1),
            gid: this.childData.gid,
            wagetype: this.childData.isinwageallin=='2'?'票':'结算重量',
            num:this.kynum('1',this.childData.isinwageallin,this.childData.isinwageallin=='2'?'票':'结算重量'),
            price: this.kyprice('1'),
            leastwageall: Number(this.kynum('1',this.childData.isinwageallin,this.childData.isinwageallin=='2'?'票':'结算重量')*this.kyprice('1')).toFixed(2),
            wageall: Number(this.kynum('1',this.childData.isinwageallin,this.childData.isinwageallin=='2'?'票':'结算重量')*this.kyprice('1')).toFixed(2),
            changerate: 1.0000,
            remark: '',
            isfree: '否',
            sid: this.childData.boguid,
            servicecode:'OA0010',
            parsid:this.inputModelData.boguid
          })
          smallCostItem.forEach((item,index)=>{
            if(costItem.indexOf(item.items)=='-1'){
             this.mawbCharge.push({
              wageinout: '1',
              wagedom:'航线',
              ismodify: '2',
              isdel: '1',
              guid: '-1',
              isallin:this.isAllinF('1',this.childData.isinwageallin),
              currency: item.currency,
              items: item.items,
              settname: this.childData.wtxmname,
              gid:  this.childData.gid,
              wagetype: item.itemstype_in,
              num: Number(item.min_price) <= Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price)) ? this.getTypeNum(item.itemstype_in, '1') : Number(Number(item.min_price) / Number(item.price)).toFixed(2),
              price: item.price,
              leastwageall: Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price))>= Number(item.min_price) ? Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price)).toFixed(2) : Number(item.min_price).toFixed(2),
              wageall: Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price))>= Number(item.min_price) ? Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price) * Number(getChangeRate(item.currency))).toFixed(2) : Number(Number(item.min_price) * Number(getChangeRate(item.currency))).toFixed(2),
              changerate: getChangeRate(item.currency),
              remark: '',
              isfree: '否',
              sid: this.childData.boguid,
              servicecode:item.servicecode,
              parsid:this.inputModelData.boguid,
              ismin:Number(item.min_price) <= Number(Number(this.getTypeNum(item.itemstype_in, '1')) * Number(item.price)) ?'2':'1'
            })
           }
         }) 
        }
        //this.$forceUpdate()
      }

      

      //this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0&&
      


        //this.mawbCharge = this.correctCost(cost, smallCost.filter(i=>{return i.isallin=='1'}), '1')

      },

      handleZzCost(){




       if(!this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length){
        if(this.childData.inwageallinprice_trans&&this.childData.isinwageallin_trans > 0){

         let price=this.childData.isinwageallin_trans
         let itemType=price=='1'?'结算重量':'票'

         this.mawbCharge.push({
          wageinout:'1',
          wagedom:'航线',
          ismodify:2,
          isdel:'1',
          guid:'-1',
          isallin:'2',
          currency:'人民币',
          changerate:1.0000,
          items:'航司中转费',
          settname:this.childData.wtxmname,
          gid: this.childData.gid,
          wagetype: itemType,
          num:itemType=='票'?1.00:Number(this.childData.zzysweight).toFixed(2),
          price:Number(this.childData.inwageallinprice_trans),
          leastwageall:Number(Number(itemType=='票'?1.00:Number(this.childData.zzysweight).toFixed(2))*Number(this.childData.inwageallinprice_trans)).toFixed(2),
          wageall:Number(Number(itemType=='票'?1.00:Number(this.childData.zzysweight).toFixed(2))*Number(this.childData.inwageallinprice_trans)).toFixed(2),
          changerate:'1.0000',
          remark:'',
          isfree:'否',
          sid: this.childData.boguid,
          servicecode:'OA0010',
          parsid:this.inputModelData.boguid
        })
       }
        //this.$forceUpdate()
      }
    },


      //获取默认中转港
      getZzg(sfg,hbh,hbrq){
    //    if (
    //     !this.$store.state.areaState ||
    //     this.$store.state.areaState.split(",").length != 1
    //     ) {
    //     this.$message.error("请先选择区域！");
    //   return;
    // }

    if (hbh && hbh.length < 2) {
      return;
    }
    var json = {
      area: this.inputModelData.area,
      sfg: sfg,
      hbh: hbh,
      hbrq: hbrq,
      jid: ""
    };
    if (sfg && hbh && hbrq) {
      this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
         console.log(results.data.resultdic.zzg)
        if(results.data.resultdic){
         
         if(results.data.resultdic.zzg&&results.data.resultdic.zzg.indexOf(',')=='-1'){
          this.$set(this.inputModelData,'zzg',results.data.resultdic.zzg)
          //alert('1')
        }else if(!results.data.resultdic.zzg){
          this.$set(this.inputModelData,'zzg',this.inputModelData.mdg)
        }else{
          this.zzgList=results.data.resultdic.zzg
            //this.$set(this.inputModelData,'zzg','')
          }
        }else{
          this.$set(this.inputModelData,'zzg','')
        }


      });
    } else {
      this.$set(this.inputModelData,'qfsj','')

    }
  },

      // ***********签单待修改方法相关请求************
      qdModify(){
        this.$axios({
          method: 'put',
          url: this.$store.state.webApi + 'api/ExHpoAxplineCommbillModify',
          data: {
            operguid: this.inputModelData.guid
          },
          loading: true,
          tip: false
        })
        .then(results=>{
         if(results.data.resultstatus==0){
          this.inputModelData.commbillmodifystatus='2'
             this.zdBasicInfo.iszddl.disabled = false
           this.zdBasicInfo.zddlcode.disabled = false
          this.$message.success(results.data.resultmessage)
        }else{
          this.$message.error(results.data.resultmessage)
        }
      })
        .catch(error=>{

        })
      },

      // ***********费用方法相关请求************
      //总单应收付费用
      async mawbCost(noloading=false) {//是否需要加loading
        //alert('3')
        //console.log(this.inputModelData.profitmode)
        this.inputModelData.profitmode=this.getServiceGuid('OA0010','profitmode')||'本站'
        this.yingshoustatus=false
        this.yingfustatus=false
        this.yingshoustatusForm=false
        this.yingfustatusForm=false
        this.mawbCharge=[]
        this.mawbPayment=[]

        await this.$axios({
          method: 'get',
          url: this.$store.state.webApi + 'api/ExBoBaseAllWageByboguid',
          params: {
            boguid: this.boguid
          },
          //loading: true,
          tip: false
        })
        .then(results => {
         // console.log(JSON.parse(JSON.stringify(results.data)))
          var costys = [];
          var costyf = []

            if(results.data){
              results.data.forEach(i => {
              i.isfree = i.isfree == '1'||!i.isfree||i.isfree=='否' ? '否' : '是'
              i.confirmstatus = i.confirmstatus == '1' ||i.confirmstatus=='--'? '--' : '已确认'
              i.changerate=Number(i.changerate).toFixed(4)
              if(i.isallin==1&&i.items!='航司运费'&&i.items!='货站地面费'){
               i.isdel=this.smallCostData.filter(item=>{return item.isallin=='1'}).map(item2=>{return item2.items}).includes(i.items)?'1':'2'
              }
              if (i.yssys != '2' && i.wageinout == '1'&&i.wagedom=="航线") {
                costys.push(i)
              } else if (i.yssys != '2' && i.wageinout == '2'&&i.wagedom=="航线") {
                costyf.push(i)
              }
              if(i.confirmstatus=='已确认'){
                this.$set(i,'background','#b9ffb6')
              }
            })
              this.allCostData=results.data              

              this.yingshoustatus=results.data.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='1'&&i.wagedom=='航线'&&i.yssys=='2'}).length>0?true:false

              this.yingfustatus=results.data.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='2'&&i.wagedom=='航线'&&i.yssys=='2'}).length>0?true:false

              this.yingshoustatusForm=results.data.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='1'&&i.wagedom=='航线'&&i.isallin=='1'}).length>0||this.yingshoustatus?true:false

              this.yingfustatusForm=results.data.filter(i=>{return i.confirmstatus=='已确认'&&i.wageinout=='2'&&i.wagedom=='航线'&&i.isallin=='1'}).length>0||this.yingfustatus?true:false

              // if(this.yingfustatus||this.yingshoustatus&&!noloading){
              //   setTimeout(()=>{
              //      this.$store.state.showloading = true
              //   },500)
                
              // }
              if(this.inputModelData.czlx=='自货'||this.inputModelData.czlx=='唯凯配舱'){

                if(!this.inputModelData.mawb&&this.pagetype){
                  this.mawbCharge=costys
                  this.mawbPayment=costyf
                }else{
                 if(this.inputModelData.profitmode.indexOf('利润')=='-1'){
                  if(Number(this.inputModelData.groupid)<0){
                    this.sortCost('1', costys)
                  }else{
                    this.mawbCharge=costys
                  }

                  //PVG 分配订单不用带运费
                  //本站或者操作站应付需要计算
                  if(this.inputModelData.childguid<0){
                     this.sortCost('2', costyf)
                  }else{
                    this.mawbPayment=costyf
                  }
                 
            // 重新计算运费单价(可能出现基础数据单价、数量改变的情况)
            if(!this.yingshoustatusForm&&Number(this.inputModelData.groupid)<0){
              this.mawbCharge.forEach(item => {
                if (item.items == '航司运费'&&item.ismodify == '2') {
                  item.num=this.kynum('1',this.inputModelData.isinwageallin,this.inputModelData.isinwageallin=='2'?'票':'结算重量')
                  item.price = this.kyprice('1')
                  item.leastwageall = Number(Number(this.kyprice('1')) * Number(item.num)).toFixed(2)
                  item.wageall = Number(Number(this.kyprice('1')) * Number(item.num) * Number(item.changerate)).toFixed(2)
                }
              })
            }
             //本站或者操作站并且没有总确认应付需要计算
            if(!this.yingfustatusForm&&this.inputModelData.childguid<0){
             this.mawbPayment.forEach(item => {
              if (item.items == '航司运费'&&item.ismodify == '2') {
                item.num=this.kynum('2',this.inputModelData.isoutwageallin,this.inputModelData.isoutwageallin=='2'?'票':'结算重量')||0
                item.price = this.kyprice('2')
                item.leastwageall = Number(Number(this.kyprice('2')) * Number(item.num)).toFixed(2)
                item.wageall = Number(Number(this.kyprice('2')) * Number(item.num) * Number(item.changerate)).toFixed(2)
              }
            }) 
           }
           console.log(this.mawbCharge)
           console.log(this.mawbPayment)
            }else{//利润分配模式只能操作应付，应收不能操作

             //本站或者操作站应付需要计算
             if(this.inputModelData.childguid<0){
              this.sortCost('2', costyf)
             }else{
              this.mawbPayment=costyf
             }

             if(this.inputModelData.orderguid<0){
              this.sortCost('1', costys)
             }else{
              this.mawbCharge=JSON.parse(JSON.stringify(costys))
             }
             
              //本站或者操作站并且没有总确认应付需要计算
             if(!this.yingfustatusForm&&this.inputModelData.childguid<0){
              this.mawbPayment.forEach(item => {
                if (item.items == '航司运费') {
                  item.price = this.kyprice('2')
                  item.leastwageall = Number(Number(this.kyprice('2')) * Number(item.num)).toFixed(2)
                  item.wageall = Number(Number(this.kyprice('2')) * Number(item.num) * Number(item.changerate)).toFixed(2)
                }
              })
            }

             //本站或者操作站并且没有总确认应收需要计算
             if(!this.yingshoustatusForm&&this.inputModelData.orderguid<0){
              this.mawbCharge.forEach(item => {
                if (item.items == '航司运费') {
                  item.price = this.kyprice('1')
                  item.leastwageall = Number(Number(this.kyprice('1')) * Number(item.num)).toFixed(2)
                  item.wageall = Number(Number(this.kyprice('1')) * Number(item.num) * Number(item.changerate)).toFixed(2)
                }
              })
            }

       
             
   

           }
         }  


       }else{
   
        this.mawbCharge=costys
        this.mawbPayment=costyf
      }
      // this.$set(this.childrenList[0],'wageList',this.mawbCharge)
      // console.log(this.childrenList)
    }
  if(this.inputModelData.groupid>0){//合并订单查询子订单
     //console.log(this.mawbCharge.filter(i2=>{return i2.sid=='21512362713362432'}))
       this.childrenDetail()
   }
     
   //console.log(this.inputModelData.inwageallinclude)
   //console.log(this.inputModelData.outwageallinclude)
   //console.log(this.mawbPayment)
   setTimeout(()=>{
      //@@@9.16货站地面费自动带出问题
      // if(this.inputModelData.childguid<0){
      //   this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false) 
      // }

      //上海站点，并且始发港是PVG，并且制单代码包含WFF
      if(this.inputModelData.area=='上海'&&this.inputModelData.sfg=='PVG'&&this.inputModelData.zddlcode.toLowerCase().indexOf('wff')>=0){
        // alert('12121212121212')
         this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false) 
         this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)  
         //console.log(this.dmfwf.gid,this.mawbCharge.length,this.mawbPayment.length)
         
      }
     

   },1500)

    
    

  })
.catch(error => {

})



  // if(this.inputModelData.groupid>0&&this.childData.boguid!=this.inputModelData.boguid){
  //       this.togglehawbN(this.childData)
  //   }
},
      //排序费用
      async sortCost(type, cost) {
        await this.handleSortCost(type,cost)
        this.switchZaFei=true
      },
      async handleSortCost(type,cost){//杂费勾选问题，初始不监听

      await this.costHandle(type,cost)//处理费用，有费用时

      if (this.inputModelData.profitmode.indexOf('利润') == '-1') {

       var otherCostItemIn = this.mawbCharge.map(i => {
        return i.items
      })
       if (this.smallCostDataYs.length) {
        this.smallCostDataYs.forEach(i => {
          if (otherCostItemIn.indexOf(i.items) != '-1') {
            this.$set(i, 'checked', true)
          } else {
            this.$set(i, 'checked', false)
          }
        })
      }

      var otherCostItemOut = this.mawbPayment.map(i => {
        return i.items
      })


      if (this.smallCostDataYf.length) {
        this.smallCostDataYf.forEach(i => {

          //if (otherCostItemOut.indexOf(i.items) != '-1'||i.items=='总单制单费') {
          if (otherCostItemOut.indexOf(i.items) != '-1') {
            this.$set(i, 'checked', true)
          } else {
            this.$set(i, 'checked', false)
          }
        })
      }


    } else {

      var otherCostItemOut = this.mawbPayment.map(i => {
        return i.items
      })


      if (this.smallCostDataYf.length) {
        this.smallCostDataYf.forEach(i => {
          //if (otherCostItemOut.indexOf(i.items) != '-1'||i.items=='总单制单费') {
            if (otherCostItemOut.indexOf(i.items) != '-1') {
            this.$set(i, 'checked', true)
          } else {
            this.$set(i, 'checked', false)
          }
        })
      }
    }
    if(!this.yingshoustatus){
      if(this.inputModelData.inwageallinprice_trans&&this.inputModelData.isinwageallin_trans>0){
        console.log(111)
        this.handleZzPrice('1',this.inputModelData.inwageallinprice_trans)
      }
    }  
    if(!this.yingfustatus){
      if(this.inputModelData.outwageallinprice_trans&&this.inputModelData.isoutwageallin_trans>0){
        console.log(222)
        this.handleZzPrice('2',this.inputModelData.outwageallinprice_trans)
      }
    }


  },
  
      costHandle(type,cost){    //费用处理，还没有费用时容易出错
       let sortArry = ['航司运费', '航司战争附加费', '航司燃油附加费']
       if (type == '1'&&!this.yingshoustatus) {

        var smallCost=[]
        this.smallCostData.forEach(i=>{
          if(i.servicecode=='OA0010'){
            smallCost.push(i)
          }
        })

        this.mawbCharge = this.correctCost(cost, smallCost.filter(i=>{return i.isallin=='1'}), '1')

        this.smallCostDataYs.forEach(i=>{
          this.$set(i,'checkboxdisable',false)
        })


        if(this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0&&this.inputModelData.isinwageallin!='4'){

          let costItem = cost.map(i2 => {
            return i2.items
          })

          var allPrice=this.inputModelData.isinwageallin
          if(costItem.indexOf('航司运费')=='-1'){
            costItem.push('航司运费')
            this.mawbCharge.push({
              status:-1,
              wageinout: '1',
              wagedom:'航线',
              ismodify: '2',
              isdel: '1',
              guid: '-1',
              isallin:this.isAllinF('1',this.inputModelData.isinwageallin),
              currency: '人民币',
              items:'航司运费' ,
              settname: getWtxmname(this.inputModelData.gid,1),
              gid: this.inputModelData.gid,
              wagetype: allPrice=='2'?'票':'结算重量',
              num:this.kynum('1',allPrice,allPrice=='2'?'票':'结算重量'),
              price: this.kyprice('1'),
              leastwageall: Number(this.kynum('1',allPrice,allPrice=='2'?'票':'结算重量')*this.kyprice('1')).toFixed(2),
              wageall: Number(this.kynum('1',allPrice,allPrice=='2'?'票':'结算重量')*this.kyprice('1')).toFixed(2),
              changerate: 1.0000,
              remark: '',
              isfree: '否',
              sid: this.inputModelData.boguid,
              servicecode:'OA0010'
            })
          }
        }
          //}


          this.mawbCharge=this.mawbCharge.map(x => ({
            value: x,
            index: sortArry.indexOf(x.items)
          })).sort((a, b) => a.index - b.index).map(x => x.value).sort((a, b) => a.isallin - b.isallin)



        } else if (type == '2'&&!this.yingfustatus) {
          //alert('1')
          this.smallCostDataYf.forEach(i=>{
            this.$set(i,'checkboxdisable',false)
          })
          if(cost.length){
            this.mawbPayment = this.correctCost(cost, this.smallCostData.filter(i=>{return i.isallin=='1'}), '2')
          }else{
            this.mawbPayment = this.correctCost(cost, this.smallCostData.filter(i=>{return i.isallin=='1'||i.items=='总单制单费'}), '2')
          }
          
          if(!this.smallCostData.filter(i=>{return i.isallin=='1'}).length){
            if(this.inputModelData.outwageallinprice && this.inputModelData.isoutwageallin > 0){
              //alert('222')
            let costItem = cost.map(i2 => {
              return i2.items
            })
            var allPrice=this.inputModelData.isoutwageallin
            if(costItem.indexOf('航司运费')=='-1'){

              costItem.push('航司运费')
              this.mawbPayment.push({
                status:-1,
                wageinout: '2',
                wagedom:'航线',
                ismodify: '2',
                isdel: '1',
                guid: '-1',
                isallin:this.isAllinF('2',this.inputModelData.isoutwageallin),
                currency: '人民币',
                items:'航司运费' ,
                settname: getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname.split('-')[1],
                gid: this.inputModelData.mawbgid,
                wagetype: allPrice=='3'&&this.inputModelData.isoutwageallin=='2'?'票':'结算重量',
                num:this.kynum('2',allPrice,allPrice=='3'&&this.inputModelData.isoutwageallin=='2'?'票':'结算重量'),
                price: this.kyprice('2'),
                leastwageall: Number(this.kynum('2',allPrice,allPrice=='3'&&this.inputModelData.isoutwageallin=='2'?'票':'结算重量')*this.kyprice('2')).toFixed(2),
                wageall: Number(this.kynum('2',allPrice,allPrice=='3'&&this.inputModelData.isoutwageallin=='2'?'票':'结算重量')*this.kyprice('2')).toFixed(2),
                changerate: 1.0000,
                remark: '',
                isfree: '否',
                sid: this.inputModelData.boguid,
                servicecode:'OA0010'
              })
            }
          //}
        }
}
        this.mawbPayment=this.mawbPayment.map(x => ({
          value: x,
          index: sortArry.indexOf(x.items)
        })).sort((a, b) => a.index - b.index).map(x => x.value).sort((a, b) => a.isallin - b.isallin)

      }else if(type=='1'&&this.yingshoustatus){
        this.mawbCharge=cost
        this.smallCostDataYs.forEach(i=>{
          this.$set(i,'checkboxdisable',true)
        })

      }else if(type=='2'&&this.yingfustatus){
        this.mawbPayment=cost
        this.smallCostDataYf.forEach(i=>{
          this.$set(i,'checkboxdisable',true)
        })
      }
    },
      //总单杂费
      async getAreaPrice() {
        var mawb = this.inputModelData.mawb;
        var sfg = this.inputModelData.sfg;
        var mdg = this.inputModelData.mdg;
        var hbrq = this.inputModelData.yqhbrq;
        
        if (!mawb || !sfg || !mdg || !hbrq) {

         return;

       }
       if (this.inputModelData.czlx == "代操作") {
        return;
      }
      let json = {
        area: this.inputModelData.area,
        mawbthreecode: mawb.substr(0, 3),
        sfg: sfg,
        mawbmdg: mdg,
        hbrq: hbrq
      };
      await this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubAirCompanyAreaPrice",
        params: json,
        loading: false,
        tip: false
      }).then(results => {
          //console.log(results.data)
           this.smallCostData = results.data.filter(i=>{return i.isallin==2||(i.isallin==1&&i.price)||(i.isallin==1&&!i.price&&i.min_price==50)})
          var costAll1=JSON.parse(JSON.stringify(this.smallCostData))
          var costAll2=JSON.parse(JSON.stringify(this.smallCostData))
          this.smallCostDataYf=costAll1.filter(i=>{return i.isallin==2})
          this.smallCostDataYs=costAll2.filter(i=>{return i.isallin==2&&i.servicecode=='OA0010'})

        });
      setTimeout(()=>{
          this.mawbCost()
      },1500)
      
    },
      // 应收付协议分泡
      ysfFp(type) {
        var json = {
          czlx: this.inputModelData.czlx,
          gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
          mdg: this.inputModelData.mdg,
          area: this.$store.state.areaState,
          system: "空出"
        };

        if (json.czlx != '代操作' &&
          this.inputModelData.czlx &&
          this.inputModelData.gid &&
          this.inputModelData.mdg
          ) {
          this.$axios({
            method: "get",
            url: this.$store.state.publicWebApi + "api/pubcustomfpbl",
            params: json,
            loading: false,
            tip: false
          }).then(results => {
              //console.log(results.data)
              if (type == '1') {
                if (results.data) {
                  this.inputModelData.self_agree_bp_freight_in =
                  results.data.xyfp1_in;
                  this.inputModelData.cus_agree_bp_freight_in =
                  results.data.xyfp2_in;
                  this.inputModelData.self_agree_bp_trans_in = results.data.xyfz1_in;
                  this.inputModelData.cus_agree_bp_trans_in = results.data.xyfz2_in;
                } else {
                  this.inputModelData.self_agree_bp_freight_in = 10;
                  this.inputModelData.cus_agree_bp_freight_in = 0;
                  this.inputModelData.self_agree_bp_trans_in = 10;
                  this.inputModelData.cus_agree_bp_trans_in = 0;
                }
              } else {
                if (results.data) {
                  this.inputModelData.self_agree_bp_freight_out =
                  results.data.xyfp1_in;
                  this.inputModelData.cus_agree_bp_freight_out =
                  results.data.xyfp2_in;
                  this.inputModelData.self_agree_bp_trans_out = results.data.xyfz1_in;
                  this.inputModelData.cus_agree_bp_trans_out = results.data.xyfz2_in;
                } else {
                  this.inputModelData.self_agree_bp_freight_out = 10;
                  this.inputModelData.cus_agree_bp_freight_out = 0;
                  this.inputModelData.self_agree_bp_trans_out = 10;
                  this.inputModelData.cus_agree_bp_trans_out = 0;
                }
              }
              this.$forceUpdate()
            })
          .catch(error => {

          })

        }
      },

      //获取费用Num(结算方式,应收付)
      getTypeNum(type, wagetype) {
        var num = ""
        if (wagetype == '1') {
          switch (type) {
            case "箱":
            num = this.inputModelData.realpiece;
            break;
            case "票":
            num = "1";
            break;
            case "计重":
            num = this.inputModelData.jfweight||0
            break;
            case "结算重量":
            num = this.inputModelData.groupid<0?this.inputModelData.accountweightin:this.childData.accountweightin;
            break;
            case "毛重":
            num = (this.inputModelData.zddrstatus=='2'?Number(this.inputModelData.zdweight).toFixed(2):Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2))||0
            break;
            case "分运单票数":
            num = this.inputModelData.hawbnum||0
            break;
            case "总运单票数":
            num = 1;
            break;
            case "总运单件数":
            num = this.inputModelData.realpiece;
            break;
          }
        } else if (wagetype == '2') {
          switch (type) {
            case "箱":
            num = this.inputModelData.realpiece;
            break;
            case "票":
            num = "1";
            break;
            case "计重":
            num = this.inputModelData.jfweight||0
            break;
            case "结算重量":
            num = this.inputModelData.accountweightout;
            break;
            case "毛重":
            num = (this.inputModelData.zddrstatus=='2'?Number(this.inputModelData.zdweight).toFixed(2):Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2))||0
            break;
            case "分运单票数":
            num = this.inputModelData.hawbnum||0
            break;
            case "总运单票数":
            num = 1;
            break;
            case "总运单件数":
            num = this.inputModelData.realpiece;
            break;
          }
        }
        return num
      },

      //空运单价(如果有制单了   取基港运价减去应收付匹配ALLIN所有的price和    如果没有制单去基港运价)
      kyprice(type) {
        //return;
        var information=this.inputModelData.groupid<0||(this.inputModelData.groupid>0&&type=='2')?this.inputModelData:this.childData

        let costData =type == '1' ? this.mawbCharge.filter(i=>i.isdel=='1'):this.mawbPayment.filter(i=>i.isdel=='1')

        
        var num = ''
        if (type == '1' && information.isinwageallin != '1'&&!this.yingshoustatus) {
          if(information.isinwageallin!='4'){

            num = Number(information.inwageallinprice)
            }else{//切换应收并且基港运价类型为COST++时判断
              //alert('1')
              if(this.inputModelData.isoutwageallin=='1'){
               var num0=Number(information.inwageallinprice)+Number(information.outwageallinprice=='666666'?'0':information.outwageallinprice)

               let priceAll = []
            if(this.smallCostData.length){//如果有杂费
             let otherCostItem = this.smallCostData.filter(i => {
              return (i.price&&i.isallin=='1')||(!i.price&&i.isallin=='1'&&i.min_price!='50')
            }).map(i => {
              return i.items
            })
            // if(this.inputModelData.inwageallinclude.includes('4')){
            //   otherCostItem.push('货站地面费')
            // }
            if(otherCostItem.length){
             let costItem=this.mawbCharge.map(i=>{return i.items})
            otherCostItem.forEach(item=>{//取基港运价减去ALLIN单价总和
              if(costItem.indexOf(item)!='-1'){//如果费用中有ALLIN费用则去此单价，如果没有则取基础费用单价
                priceAll.push(this.mawbCharge[costItem.indexOf(item)].price)
              }else{
                this.smallCostData.forEach(item2=>{
                  if(item2.items==item){
                    priceAll.push(item2.price)
                  }
                })
              }
            })
            console.log(priceAll)
            num = Number(num0) - Number(eval(priceAll.join('+')))
          }else{
           num = Number(information.inwageallinprice)+Number(information.outwageallinprice=='666666'?'0':information.outwageallinprice)
         }

       }else{

        num = Number(information.inwageallinprice)+Number(information.outwageallinprice=='666666'?'0':information.outwageallinprice)
      }

            }else{//如果应付基港运价类型不为单价ALLIN时进行相加
              num =Number(information.inwageallinprice)+Number(information.outwageallinprice=='666666'?'0':information.outwageallinprice)
            }
          }
        } else if (type == '2' && information.isoutwageallin != '1') {
          num = Number(information.outwageallinprice)
        } else if ((type == '1' && information.isinwageallin == '1') || (type == '2' && information.isoutwageallin == '1')) {
          let priceAll = []
          if(this.smallCostData.length){

            let otherCostItem = this.smallCostData.filter(i => {
              return (i.price&&i.isallin=='1')||(!i.price&&i.isallin=='1'&&i.min_price!='50')
            }).map(i => {
              return i.items
            })

            if(otherCostItem.length){
              let costItem=costData.map(i=>{return i.items})
            otherCostItem.forEach(item=>{//取基港运价减去ALLIN单价总和
              if(costItem.indexOf(item)!='-1'){//如果费用中有ALLIN费用则去此单价，如果没有则取基础费用单价
                priceAll.push(costData[costItem.indexOf(item)].price)
              }else{
                this.smallCostData.forEach(item2=>{
                  if(item2.items==item){
                    priceAll.push(item2.price)
                  }
                })

              }
            })
            num = Number(type=='1'?information.inwageallinprice:information.outwageallinprice) - Number(eval(priceAll.join('+')))
          }else{
            num = type=='1'?Number(information.inwageallinprice):Number(information.outwageallinprice)
          }

        }else{

          num = type=='1'?Number(information.inwageallinprice):Number(information.outwageallinprice)
        }

      }

      if(num||num==0){
          
          //if()
          //console.log(num)
          return num.toFixed(2)

        }else{

          this.mawbCharge.forEach(i=>{
           if(i.items=='航司运费'&&i.sid==this.childData.boguid){
            num=i.price
          }
        })
          return num
        }

      },

      //空运服务数量 应收付类型,基港运价类型,结算方式
      kynum(type,val,wagetype){
        var num=""

        if(type=='2'){//应付单价类型为M级++时 num取1，其他按照结算方式算
          if(val=='2'){
            num=1
          }else{
            num=this.getTypeNum(wagetype,type)
          }
        }else if(type=='1'){//应收单价类型为M级++ 或者 COST++并且应付基港运价类型为M级++时 num取1  其他按照结算方式计算
          if(val=='2'||(val=='4'&&this.inputModelData.isoutwageallin=='2')){
            num=1
          }else{
            num=this.getTypeNum(wagetype,type)
          }
        }

        return Number(num)


      },

      //判断是否为ALLIN的费用  应收付类型 基港运价类型    应收基港类型为M级++视为非ALLIN   应付基港运价为M级++ 或者 Cost++并且应收基港运价类型为M级++ 视为非ALLIN
      isAllinF(type,val,checked=true){
        var num=""
        if(type=='2'){
          if(val=='2'){
            num='2'
          }else{
            if(checked){
             num='1' 
            }else{
             num='2'
            }
            
          }
        }else if(type=='1'){
          if(val=='2'||(val=='4'&&this.inputModelData.isoutwageallin=='2')){
            num='2'
          }else{
            if(checked){
             num='1' 
            }else{
             num='2'
            }
          }
        }
        return num
      },

      //应收付费用List  匹配杂费ALLIN  (type 应收付类型  isdel类型)   切换基港运价类型时ALLIN费用 ismodify转为2
      mateCostList(type, isdel) {
        //alert('1')
        //console.log(type,isdel)
        let costData = type == '1' ? this.mawbCharge : this.mawbPayment
        console.log(costData)
        //let smallData=type == '1' ? this.smallCostDataYs : this.smallCostDataYf
        //console.log(costData)
        let otherCostItemAI = this.smallCostData.filter(i => {
          return i.isallin == '1'
        }).map(i => {
          return i.items
        })
        otherCostItemAI.push('航司运费')

        costData.forEach(item => {

          if (otherCostItemAI.indexOf(item.items) != '-1'||item.items=='货站地面费') {
              //console.log(item)
              item.ismodify = '2'
              this.$set(item,'isdel',isdel)
              //item.isdel = '2'
            }
            

          })

          // if(type=='1'){
          //   this.inputModelData.inwageallinclude=''
          // }else{
          //   this.inputModelData.outwageallinclude=''
          // }
          
          //console.log(costData)



       // console.log(this.mawbCharge)

     },

      //匹配中转费(应收付类型,中转费用类型)  中转费ismodify设置为2  val为1单价数量中转费结算方式结算重量  val为2总价中转费结算方式为票
      mateZzCostList(type,val){
        let costData=type=='1'?this.mawbCharge:this.mawbPayment
        costData.forEach(i=>{

          if(i.items=='航司中转费'){
            i.ismodify='2'
            i.wagetype=val=='1'?'结算重量':'票'
            i.price=type=='2'?this.inputModelData.outwageallinprice_trans:this.inputModelData.groupid<0?this.inputModelData.inwageallinprice_trans:this.childData.inwageallinprice_trans
            i.num=val=='1'?(type=='1'?(this.inputModelData.groupid<0?this.inputModelData.zzysweight:this.childData.zzysweight):this.inputModelData.zzyfweight):1
            i.leastwageall=Number(Number(i.num)*Number(i.price)).toFixed(2)
            i.wageall=Number(Number(i.num)*Number(i.price)*Number(i.changerate)).toFixed(2)
          }


        })
      },



      // 验证
      yanzhenzzF(type, dom, field) {
        if (dom == '1' && type == '1' && field == 'num') {
          if (this.curObjectKyYs.wagetype == '票') {
            var reg = /^[1-9]\d*$/
            if (this.curObjectKyYs.num && !reg.test(this.curObjectKyYs.num)) {
              this.$message({
                message: '请输入整数',
                type: 'error',
                duration: 1000
              })
              this.curObjectKyYs.num = ''
            }
          } else {
            var reg = /^[0-9]+.?[0-9]{0,2}?$/
            if (this.curObjectKyYs.num && !reg.test(this.curObjectKyYs.num)) {
              this.$message({
                message: '请输入整数或者2位小数',
                type: 'error',
                duration: 1000
              })
              this.curObjectKyYs.num = ''
            }
          }

        } else if (dom == '1' && type == '1' && field == 'price') {
          var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/
          if (this.curObjectKyYs.price && !reg.test(this.curObjectKyYs.price)) {
            this.$message({
              message: '请输入整数或者2位小数',
              type: 'error',
              duration: 1000
            })
              //this.$message.error('请输入整数或者2位小数')
              this.curObjectKyYs.price = ''
            }
          } else if (dom == '1' && type == '2' && field == 'price') {
            var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/
            if (this.curObjectKyYf.price && !reg.test(this.curObjectKyYf.price)) {
              this.$message({
                message: '请输入整数或者2位小数',
                type: 'error',
                duration: 1000
              })
              //this.$message.error('请输入整数或者2位小数')
              this.curObjectKyYf.price = ''
            }

          } else if (dom == '1' && type == '2' && field == 'num') {
            if (this.curObjectKyYf.wagetype == '票') {
              var reg = /^[1-9]\d*$/
              if (this.curObjectKyYf.num && !reg.test(this.curObjectKyYf.num)) {
                this.$message({
                  message: '请输入整数',
                  type: 'error',
                  duration: 1000
                })
                this.curObjectKyYf.num = ''
              }
            } else {
              var reg = /^[0-9]+.?[0-9]{0,2}?$/
              if (this.curObjectKyYf.num && !reg.test(this.curObjectKyYf.num)) {
                this.$message({
                  message: '请输入整数或者2位小数',
                  type: 'error',
                  duration: 1000
                })
                this.curObjectKyYf.num = ''
              }
            }

          }


        },
      //新增费用(手动新增费用ismodify赋1 如果新增的为allin费用则ismodify赋2   服务项目一家公司只会出现一次)
      addCost(type) {

       // this.switchWatch=false
        //console.log(this.curObjectKyYs)

        if(type=='1'){
          //console.log(this.inputModelData.profitmode)
          //console.log(this.inputModelData.profitmode.indexOf('利润')!='-1')
          if(this.inputModelData.profitmode.indexOf('利润')!='-1'){
            return false
          }
          if(!this.curObjectKyYs.items){
            return false
          }else if(!this.curObjectKyYs.num){
            return false
          }else if(!this.curObjectKyYs.price){
            return false
          }else if(this.curObjectKyYs.leastwageall==0){
            return false
          }
        }else if(type=='2'){

          if(!this.curObjectKyYf.items){
            return false
          }else if(!this.curObjectKyYf.num){
            return false
          }else if(!this.curObjectKyYf.price){
            return false
          }else if(this.curObjectKyYf.leastwageall==0){
            return false
          }
        }



          //alert(type)
        if(this.inputModelData.czlx!='代操作'){//自货
          if(this.modifyIndex=='-1'){//新增
           // let smallData= type=='1'?this.smallCostDataYs:this.smallCostDataYf
         // alert('1')
         let allinItems = this.smallCostData.filter(i => {
          return i.isallin == '1'
        }).map(item => {
          return item.items
        })
        allinItems.push('航司运费')
        //allinItems.push('航司运费')

        if (type == '1') {
          let itemsList = this.mawbCharge.filter(i=>{

            return i.isdel!='2'

            
          }).map(i=>{return i.items})

          if (itemsList.indexOf(this.curObjectKyYs.items) != '-1') {
            this.$message.error('存在相同服务项目')
            return
          } else {
            if(!this.yingshoustatus){
              this.mawbCharge.push({
                status:-1,
                wagedom:'航线',
                ismodify: allinItems.indexOf(this.curObjectKyYs.items) == '-1' ? '1' : '2',
                isallin: '2',
                isdel: '1',
                isfree: this.curObjectKyYs.isfree ? '是' : '否',
                num: this.curObjectKyYs.num,
                confirmstatus: '--',
                items: this.curObjectKyYs.items,
                price: this.curObjectKyYs.price,
                settname: !this.childData.pono?getWtxmname(this.curObjectKyYs.gid,1):getWtxmname(this.childData.gid,1),
                gid: this.curObjectKyYs.gid,
                wagetype: this.curObjectKyYs.wagetype,
                currency: this.curObjectKyYs.currency,
                leastwageall: this.curObjectKyYs.leastwageall,
                wageall: this.curObjectKyYs.wageall,
                changerate: this.curObjectKyYs.changerate,
                remark: this.curObjectKyYs.remark,
                sid: this.inputModelData.groupid<0?this.inputModelData.boguid:this.childData.boguid,
                servicecode:this.curObjectKyYs.servicecode,
                wageinout:'1',
                parsid:this.inputModelData.boguid
              })
            }else{
              this.curObjectKyYs.isfree=this.curObjectKyYs.isfree?'2':'1'
              this.curObjectKyYs.wageinout='1'
              this.curObjectKyYs.wagedom='航线'
              this.curObjectKyYs.sid=this.inputModelData.groupid<0?this.inputModelData.boguid:this.childData.boguid
              this.curObjectKyYs.parsid=this.inputModelData.boguid
              this.$axios({
                method: "put",
                //url:'http://192.168.98.161/BoManagementWebApi/api/AddWageAfterComfirm',
                url: this.$store.state.webApi + "api/AddWageAfterComfirm",
                data: {wage:this.curObjectKyYs,boguid:this.inputModelData.boguid},
                loading: true,
                tip: false
              })
              .then(reuslts=>{
                if(reuslts.data.resultstatus==0){
                  this.$message.success('更新成功')
                  this.mawbCost()
                }else{
                  this.$message.error(reuslts.data.resultmessage)
                }
              })
              .catch(error=>{

              })
              //console.log(this.curObjectKyYs)
            //console.log(this.curObjectKyYs)
          }

        }

      } else if (type == '2') {
        let itemsList = this.mawbPayment.filter(i=>{return i.isdel!='2'}).map(i=>{return i.items})
        if (itemsList.indexOf(this.curObjectKyYf.items) != '-1') {
          this.$message.error('存在相同服务项目')
          return
        } else {
          if(!this.yingfustatus){
            this.mawbPayment.push({
              status:-1,
              wagedom:'航线',
              ismodify: allinItems.indexOf(this.curObjectKyYf.items) == '-1' ? '1' : '2',
              isallin: '2',
              isdel: '1',
              isfree: this.curObjectKyYf.isfree ? '是' : '否',
              num: this.curObjectKyYf.num,
              confirmstatus: '--',
              items: this.curObjectKyYf.items,
              price: this.curObjectKyYf.price,
              settname: getGysname(this.curObjectKyYf.gid,1),
              gid: this.curObjectKyYf.gid,
              wagetype: this.curObjectKyYf.wagetype,
              currency: this.curObjectKyYf.currency,
              leastwageall: this.curObjectKyYf.leastwageall,
              wageall: this.curObjectKyYf.wageall,
              changerate: this.curObjectKyYf.changerate,
              remark: this.curObjectKyYf.remark,
              sid: this.inputModelData.boguid,
              servicecode:this.curObjectKyYf.servicecode,
              wageinout:'2',
              parsid:this.inputModelData.boguid
            })
          }else{
            this.curObjectKyYf.isfree=this.curObjectKyYf.isfree?'2':'1'
            this.curObjectKyYf.wageinout='2'
            this.curObjectKyYf.wagedom='航线'
            this.curObjectKyYf.sid=this.inputModelData.boguid
            this.curObjectKyYf.parsid=this.inputModelData.boguid
            this.$axios({
              method: "put",
                //url:'http://192.168.98.161/BoManagementWebApi/api/AddWageAfterComfirm',
                url: this.$store.state.webApi + "api/AddWageAfterComfirm",
                data: {wage:this.curObjectKyYf,boguid:this.inputModelData.boguid},
                loading: true,
                tip: false
              })
            .then(reuslts=>{
              if(reuslts.data.resultstatus==0){
                this.$message.success('更新成功')
                this.mawbCost()
              }else{
                this.$message.error(reuslts.data.resultmessage)
              }
            })
            .catch(error=>{

            })
          }

        }

      }
        }else{//修改费用
          let information=this.inputModelData.groupid<0||(type=='2'&&this.inputModelData.groupid>0)?this.inputModelData:this.childData

          let item=type=='1'?this.curObjectKyYs.items:this.curObjectKyYf.items

          let costData=type=='1'?this.mawbCharge:this.mawbPayment


          

          //console.log(this.curObjectKyYs)
          //console.log(costData)
          if(item!='航司中转费'){

            let otherCostItem=this.smallCostData.filter(i=>{return (i.price&&i.isallin=='1')||(!i.price&&i.isallin=='1'&&i.min_price!='50')}).map(i=>{return i.items})
            let price=""
            otherCostItem.push('航司运费')

            if(type=='1'&& this.isAllinF(type,this.inputModelData.isinwageallin,this.inputModelData.inwageallinclude.includes('4'))=='1'||type=='2'&&this.isAllinF(type,this.inputModelData.isoutwageallin,this.inputModelData.outwageallinclude.includes('4'))=='1'){
             otherCostItem.push('货站地面费')
            }
            let allprice=type=='1'?information.isinwageallin:information.isoutwageallin
            let priceAll=[]

            if(type=='1'){

              this.$set(this.mawbCharge,this.modifyIndex,this.curObjectKyYs)
              //this.mawbCharge[this.modifyIndex]={...this.curObjectKyYs}
              this.$set(this.mawbCharge[this.modifyIndex],'ismodify',1)
              //this.$set(this.mawbCharge[this.modifyIndex],'isdel',1)

              this.mawbCharge[this.modifyIndex].isfree=this.mawbCharge[this.modifyIndex].isfree?'是':"否"
              
            }else{
               this.$set(this.mawbPayment,this.modifyIndex,this.curObjectKyYf)
              //this.mawbPayment[this.modifyIndex]={...this.curObjectKyYf}

              this.$set(this.mawbPayment[this.modifyIndex],'ismodify',1)

              this.mawbPayment[this.modifyIndex].isfree=this.mawbPayment[this.modifyIndex].isfree?'是':"否"

            }

            if(allprice=='1'||(type=='1'&&this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice)){
              otherCostItem.forEach(i=>{
                costData.forEach(i2=>{
                  if(i==i2.items){
                    priceAll.push(i2.price)
                  }
                })
              })
                  console.log(priceAll)
            }else{
              //非单价ALLIN只有运费才影响
              price=type=='1'&&item=='航司运费'?this.curObjectKyYs.price:this.curObjectKyYf.price

            }

            if(allprice>0){

             if(type=='1'){
              if(allprice=='1'){

                information.inwageallinprice=Number(eval(priceAll.join('+'))).toFixed(2)||price
              }else if(this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice){
                information.inwageallinprice=((Number(eval(priceAll.join('+'))).toFixed(2)||price)-Number(this.inputModelData.outwageallinprice)).toFixed(2)
              }
              // 需求待定 修改运费时重新计算单价   修改allin费用时重新计算运费
              // if(item=='运费'){
              //  this.inputModelData.inwageallinprice=Number(eval(priceAll.join('+')))||price
              // }else{
              //   console.log(priceAll)

              //   if(otherCostItem.indexOf(item)!='-1'){

              //     this.mawbCharge.forEach(i=>{

              //     if(i.items=='运费'&&allprice=='1'){
              //       i.price=(Number(this.inputModelData.inwageallinprice)-(Number(eval(priceAll.join('+')))-Number(i.price))).toFixed(2)
              //     }
              //   })
              //   }

              // }
            }
            else{
              if(allprice=='1'){
                this.inputModelData.outwageallinprice=Number(eval(priceAll.join('+'))).toFixed(2)||price
              }
             //  if(item=='运费'){
             //   this.inputModelData.outwageallinprice=Number(eval(priceAll.join('+')))||price
             // }else{
             //  if(otherCostItem.indexOf(item)!='-1'){
             //      this.mawbPayment.forEach(i=>{
             //      if(i.items=='运费'&&allprice=='1'){
             //        i.price=(Number(this.inputModelData.outwageallinprice)-(Number(eval(priceAll.join('+')))-Number(i.price))).toFixed(2)
             //      }
             //    })
             //    }
             // }
           }
         }
           //this.$forceUpdate()
 
        // if(type=='2'){
        //   this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)  
        // }else if(type=='1'){
        //   this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)  
        // }
        

         }else{
       //console.log(this.curObjectKyYs)
       if(type=='2'?this.curObjectKyYf.ismodify=='2':this.curObjectKyYs.ismodify=='2'){

            //   costData.forEach(i=>{
            //     if(i.items=='航司中转费'){
            //        if(type=='1'?this.inputModelData.isinwageallin_trans=='1':this.inputModelData.isoutwageallin_trans=='1'){
            //          if(type=='1'&&this.inputModelData.profitmode.indexOf('利润')=='-1'){
            //            this.inputModelData.inwageallinprice_trans=this.curObjectKyYs.price
            //          }else if(type=='2'){
            //            this.inputModelData.outwageallinprice_trans=this.curObjectKyYf.price
            //          }
            //        }else if(type=='1'?this.inputModelData.isinwageallin_trans=='2':this.inputModelData.isoutwageallin_trans=='2'){
            //         if(type=='1'&&this.inputModelData.profitmode.indexOf('利润')=='-1'){
            //            this.inputModelData.inwageallinprice_trans=this.curObjectKyYs.leastwageall
            //          }else if(type=='2'){
            //            this.inputModelData.outwageallinprice_trans=this.curObjectKyYf.leastwageall
            //          }
            //        }
            // i.ismodify=1
            //     }
            //   })
            //   console.log(this.curObjectKyYs)

              //console.log(this.mawbCharge[this.modifyIndex])
              if(type=='1'){
                this.mawbCharge[this.modifyIndex]=this.curObjectKyYs
                this.mawbCharge[this.modifyIndex].isfree=this.mawbCharge[this.modifyIndex].isfree?'是':'否'
                this.mawbCharge[this.modifyIndex].ismodify=1

                if(information.isinwageallin_trans==1){
                  if(this.inputModelData.profitmode.indexOf('利润')=='-1'){
                    information.inwageallinprice_trans=this.curObjectKyYs.price
                    //this.switchWatch=false
                  }
                }else if(information.isinwageallin_trans==2){
                  if(this.inputModelData.profitmode.indexOf('利润')=='-1'){
                   information.inwageallinprice_trans=this.curObjectKyYs.leastwageall
                   //this.switchWatch=false
                 }
               }
             }else if(type=='2'){
              this.mawbPayment[this.modifyIndex]=this.curObjectKyYf
              this.mawbPayment[this.modifyIndex].isfree=this.mawbPayment[this.modifyIndex].isfree?'是':'否'
              this.mawbPayment[this.modifyIndex].ismodify=1
//alert('1')
if(information.isoutwageallin_trans==1){

  information.outwageallinprice_trans=this.curObjectKyYf.price
                    //this.switchWatch=false

                  }else if(information.isoutwageallin_trans==2){

                   information.outwageallinprice_trans=this.curObjectKyYf.leastwageall
                   //this.switchWatch=false

                 }

               }



             }

            //console.log(costData)
            //console.log(this.mawbPayment)
          }
          //this.switchWatch=true



        }
      }else{//代操作
       // alert('1')
        if(this.modifyIndex=='-1'){//新增
          this.mawbCharge.push({
            status:-1,
            wagedom:'航线',
            ismodify: '1',
            isallin: '2',
            isdel: '1',
            isfree: this.curObjectKyYs.isfree ? '是' : '否',
            num: this.curObjectKyYs.num,
            confirmstatus: '--',
            items: this.curObjectKyYs.items,
            price: this.curObjectKyYs.price,
            settname: this.curObjectKyYs.settname,
            gid: this.curObjectKyYs.gid,
            wagetype: this.curObjectKyYs.wagetype,
            currency: this.curObjectKyYs.currency,
            leastwageall: this.curObjectKyYs.leastwageall,
            wageall: this.curObjectKyYs.wageall,
            changerate: this.curObjectKyYs.changerate,
            remark: this.curObjectKyYs.remark,
            sid: this.inputModelData.boguid,
            servicecode:this.curObjectKyYs.servicecode,
          })
        }else{//修改
          this.mawbCharge[this.modifyIndex]=this.curObjectKyYs
          this.mawbCharge[this.modifyIndex].ismodify=1
          this.mawbCharge[this.modifyIndex].isfree=this.mawbCharge[this.modifyIndex].isfree?'是':"否"
        }


      }

      this.clearCost(type)
        //this.$forceUpdate()


      },
      //修改费用
      modCost(type,data,index){
        //alert(index)

        this.modCostIndex=index
        console.log(this.modCostIndex)

        if(data.confirmstatus=='已确认'||(type=='1'&&this.inputModelData.profitmode.indexOf('利润')!='-1')){
          return
        }else{
          this.modifyIndex=index
         //console.log(this.modifyIndex)
         if(type=='1'){
           this.curObjectKyYs={...data}
           this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=='否'?false:true
           if(this.inputModelData.isinwageallin_trans=='2'&&(this.inputModelData.czlx=='自货'||this.inputModelData.czlx=='唯凯配舱')){
            this.curObjectKyYs.num=Number(1).toFixed(2)
            this.curObjectKyYs.wagetype='票'
          }
        }else{
         this.curObjectKyYf={...data}

         this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=='否'?false:true
         if(this.inputModelData.isoutwageallin_trans=='2'){
          this.curObjectKyYf.num=Number(1).toFixed(2)
          this.curObjectKyYs.wagetype='票'
        }
      }
    }
    console.log(this.curObjectKyYs)

  },
      //清空费用
      clearCost(type){
        console.log('clear')
        //alert(type)
        this.modifyIndex='-1'
        // settname:this.inputModelData.gysname
        // settname:this.inputModelData.wtxmname,
        if(type=='1'){
         this.curObjectKyYs={currency:'人民币',changerate:1.000,gid:this.inputModelData.gid,isfree:false,remark:'',leastwageall:'',wageall:'',changerate:1.0000,num:'',price:'',isdel:1}
       }else{
         this.curObjectKyYf={currency:'人民币',changerate:1.000,gid:this.inputModelData.mawbgid,isfree:false,remark:'',leastwageall:'',wageall:'',changerate:1.0000,num:'',price:'',isdel:1}
       }
        //this.$forceUpdate()
      },
      //删除费用
      delCost(type, data, index) {
        //console.log(type, data, index)
        if(type=='2'&&data.items=='货站地面费'&&this.inputModelData.zddlcode.toLowerCase().indexOf('wff')>=0){
          return this.$message.info('此费用无法删除')
        }
        if(data.confirmstatus=='已确认'||(type=='1'&&this.inputModelData.profitmode.indexOf('利润')!='-1')){
          return
        }else{
         let costData = type == '1' ? this.mawbCharge : this.mawbPayment
         //let smallData=type == '1' ? this.smallCostDataYs : this.smallCostDataYf
         let otherCostItem=this.smallCostData.map(i=>{return i.items})
         if (data.isallin == '1') {
          this.$message.error('AIIN费用无法删除')
          return
        } else {
          if (data.guid > 0||otherCostItem.indexOf(costData[index].items)!='-1') {
            this.$set(costData[index], 'ismodify', '1')
            this.$set(costData[index], 'isdel', '2')
          } else {
            costData = costData.splice(index, 1)
          }
          if(type=='2'){
            if(this.smallCostDataYf.map(i=>i.items).indexOf(data.items)!='-1'){
               this.$set(this.smallCostDataYf[this.smallCostDataYf.map(i=>i.items).indexOf(data.items)],'checked',false)
            }
          }
        }
      }

    },
      //比较费用(应收付费用,杂费,应收付类型)
      correctCost(cost, otherCost, type) {

        let showCost = []

        let otherCostItem = otherCost.map(i => {
          return i.items
          }) //基础数据维护费用 服务项目


      
        let costItem = cost.map(i2 => {
          return i2.items
          })  //应收付费用 服务项目

          //应收付费用 服务项目
        cost.forEach(item => { //应收付费用先前修改过直接取出来不做修改
          if (item.ismodify == '1' || item.items == '航司运费' || otherCostItem.indexOf(item.items)=='-1') {
            showCost.push(item)
          }
        })

       
        if(otherCostItem.length){//有杂费
          otherCostItem.forEach((otherItem, index) => {

          if (costItem.indexOf(otherItem) == '-1') { //杂费基础数据维护发生改变 多了一个服务项目,如果有基港运价类型和价格则带出费用

           if(otherCost[index].isallin=='1'){

             if ((type == '1' && this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0&&this.inputModelData.isinwageallin!='4') || (type == '2' && this.inputModelData.outwageallinprice && this.inputModelData.isoutwageallin > 0)) {
              var itemType = type == '1' ? otherCost[index].itemstype_in : otherCost[index].itemstype_out
              var allPrice=type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin
              showCost.push({
                status:-1,
                wageinout: type,
                wagedom:'航线',
                ismodify: '2',
                isdel: '1',
                guid: '-1',
                isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin),
                currency: otherCost[index].currency,
                items: otherCost[index].items,
                settname: type == '1' ? getWtxmname(this.inputModelData.gid,1) : getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname.split('-')[1],
                gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
                wagetype: itemType,
                num: Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ? this.getTypeNum(itemType, type) :!otherCost[index].price&&otherCost[index].min_price=='50'?'1': Number(Number(otherCost[index].min_price) / Number(otherCost[index].price)).toFixed(2),
                price: !otherCost[index].price&&otherCost[index].min_price=='50'?'50':otherCost[index].price,
                leastwageall: Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) >= Number(otherCost[index].min_price)? Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)).toFixed(2) : !otherCost[index].price&&otherCost[index].min_price=='50'?'50':Number(otherCost[index].min_price).toFixed(2),
                wageall: Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) >= Number(otherCost[index].min_price) ? Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price) * Number(getChangeRate(otherCost[index].currency))).toFixed(2) : !otherCost[index].price&&otherCost[index].min_price=='50'?'50':Number(Number(otherCost[index].min_price) * Number(getChangeRate(otherCost[index].currency))).toFixed(2),
                changerate: getChangeRate(otherCost[index].currency),
                remark: '',
                isfree: '否',
                sid: this.inputModelData.boguid,
                servicecode:otherCost[index].servicecode,
                ismin:Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ?'2':'1'
              })

              // if(costItem.indexOf('航司运费')=='-1'){
              //   costItem.push('航司运费')
              //   showCost.push({
              //   wageinout: type,
              //   wagedom:'航线',
              //   ismodify: '2',
              //   isdel: '1',
              //   guid: '-1',
              //   isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.outwageallin),
              //   currency: '人民币',
              //   items:'航司运费' ,
              //   settname: type == '1' ? this.inputModelData.wtxmname : this.inputModelData.gysname,
              //   gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
              //   wagetype: allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量',
              //   num:this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量'),
              //   price: this.kyprice(type),
              //   leastwageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
              //   wageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
              //   changerate: 1.0000,
              //   remark: '',
              //   isfree: '否',
              //   sid: this.inputModelData.boguid,
              //   servicecode:'OA0010'
              // })
              // }
console.log(showCost)
            }

          }else{

           var itemType = type == '1' ? otherCost[index].itemstype_in : otherCost[index].itemstype_out

           showCost.push({
            status:-1,
            wageinout: type,
            wagedom:'航线',
            ismodify: '2',
            isdel: '1',
            guid: '-1',
            isallin:'2',
            currency: otherCost[index].currency,
            items: otherCost[index].items,
            settname: type == '1' ? getWtxmname(this.inputModelData.gid,1) : getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname&&this.inputModelData.gysname.split('-')[1],
            gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
            wagetype: itemType,
            num: Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ? this.getTypeNum(itemType, type) : Number(Number(otherCost[index].min_price) / Number(otherCost[index].price)).toFixed(2),
            price: otherCost[index].price,
            leastwageall: Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) >= Number(otherCost[index].min_price) ? Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)).toFixed(2) : Number(otherCost[index].min_price).toFixed(2),
            wageall: Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) >= Number(otherCost[index].min_price) ? Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price) * Number(getChangeRate(otherCost[index].currency))).toFixed(2) : Number(Number(otherCost[index].min_price) * Number(getChangeRate(otherCost[index].currency))).toFixed(2),
            changerate: getChangeRate(otherCost[index].currency),
            remark: '',
            isfree: '否',
            sid: this.inputModelData.boguid,
            servicecode:otherCost[index].servicecode,
            ismin:Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ?'2':'1'
          })


console.log(showCost)
          // if(costItem.indexOf('航司运费')=='-1'){

          // if ((type == '1' && this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0) || (type == '2' && this.inputModelData.outwageallinprice && this.inputModelData.isoutwageallin > 0)) {
          //  var allPrice=type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin
          //       costItem.push('航司运费')
          //       showCost.push({
          //       wageinout: type,
          //       wagedom:'航线',
          //       ismodify: '2',
          //       isdel: '1',
          //       guid: '-1',
          //       isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.outwageallin),
          //       currency: '人民币',
          //       items:'航司运费' ,
          //       settname: type == '1' ? this.inputModelData.wtxmname : this.inputModelData.gysname,
          //       gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
          //       wagetype: allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量',
          //       num:this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量'),
          //       price: this.kyprice(type),
          //       leastwageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
          //       wageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
          //       changerate: 1.0000,
          //       remark: '',
          //       isfree: '否',
          //       sid: this.inputModelData.boguid,
          //       servicecode:'OA0010'
          //     })
          //     }

          //       }
        }

          } else { //基础数据发生更改,将应收付费用ismodify为2并且服务项目匹配到的数据做修改

            cost.forEach(costItem => {
              if (costItem.items == otherItem && costItem.ismodify == '2') {
                var itemType = type == '1' ? otherCost[index].itemstype_in : otherCost[index].itemstype_out
                costItem.currency = otherCost[index].currency
                costItem.wagedom='航线',
                costItem.wagetype = itemType
                costItem.num = Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ? this.getTypeNum(itemType, type) : !otherCost[index].price&&otherCost[index].min_price=='50'?'1':Number(Number(otherCost[index].min_price) / Number(otherCost[index].price)).toFixed(2)
                costItem.price = !otherCost[index].price&&otherCost[index].min_price=='50'?'50':otherCost[index].price
                costItem.leastwageall=costItem.num*costItem.price>otherCost[index].min_price?(costItem.num*costItem.price).toFixed(2):!otherCost[index].price&&otherCost[index].min_price=='50'?'50':Number(otherCost[index].min_price).toFixed(2)
                costItem.wageall=(costItem.leastwageall*Number(getChangeRate(otherCost[index].currency))).toFixed(2)
                costItem.changerate = getChangeRate(otherCost[index].currency)
                costItem.ismin=Number(otherCost[index].min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(otherCost[index].price)) ?'2':'1'
                showCost.push(costItem)

              }
            })
          }
          console.log(showCost)
        })
        }else{//无杂费
           //alert('1')
          // if(costItem.indexOf('航司运费')=='-1'){
          //   if((type == '1' && this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0) || (type == '2' && this.inputModelData.outwageallinprice && this.inputModelData.isoutwageallin > 0)){
          //     var allPrice=type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin
          //       costItem.push('航司运费')
          //       showCost.push({
          //       wageinout: type,
          //       wagedom:'航线',
          //       ismodify: '2',
          //       isdel: '1',
          //       guid: '-1',
          //       isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin),
          //       currency: '人民币',
          //       items:'航司运费' ,
          //       settname: type == '1' ? this.inputModelData.wtxmname : this.inputModelData.gysname,
          //       gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
          //       wagetype: allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量',
          //       num:this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量'),
          //       price: this.kyprice(type),
          //       leastwageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
          //       wageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
          //       changerate: 1.0000,
          //       remark: '',
          //       isfree: '否',
          //       sid: this.inputModelData.boguid,
          //       servicecode:'OA0010'
          //     })
          //   }
          // }
          console.log(showCost)
        }


        // if(!allInPrice.length){
        //  //alert('1')
        // if(costItem.indexOf('航司运费')=='-1'){

        //   if ((type == '1' && this.inputModelData.inwageallinprice && this.inputModelData.isinwageallin > 0) || (type == '2' && this.inputModelData.outwageallinprice && this.inputModelData.isoutwageallin > 0)) {
        //    var itemType = type == '1' ? otherCost[index].itemstype_in : otherCost[index].itemstype_out
        //       var allPrice=type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin
        //         costItem.push('航司运费')
        //         showCost.push({
        //         wageinout: type,
        //         wagedom:'航线',
        //         ismodify: '2',
        //         isdel: '1',
        //         guid: '-1',
        //         isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.outwageallin),
        //         currency: '人民币',
        //         items:'航司运费' ,
        //         settname: type == '1' ? this.inputModelData.wtxmname : this.inputModelData.gysname,
        //         gid: type == '1' ? this.inputModelData.gid : this.inputModelData.mawbgid,
        //         wagetype: allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量',
        //         num:this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量'),
        //         price: this.kyprice(type),
        //         leastwageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
        //         wageall: Number(this.kynum(type,allPrice,allPrice=='2'||type=='2'&&allPrice=='3'&&this.inputModelData.isinwageallin=='2'?'票':'结算重量')*this.kyprice(type)).toFixed(2),
        //         changerate: 1.0000,
        //         remark: '',
        //         isfree: '否',
        //         sid: this.inputModelData.boguid,
        //         servicecode:'OA0010'
        //       })
        //       }

        //         }

        // }


        console.log(showCost)
        return showCost
      },
      handleDmCost(type,include){//处理地面服务费  应收应付  是否包含
        //console.log(include)
        if(type=='1'&&this.yingshoustatus||type=='2'&&this.yingfustatus||this.inputModelData.area!='上海'||this.inputModelData.sfg!='PVG'){//费用确认直接跳过
          return
        }

        if(!this.dmfwf.gid){
          return
        }
        
        if((type=='1'&&!this.mawbCharge.length)||(type=='2'&&!this.mawbPayment.length)){
          return
        }
    
        //console.log(this.mawbPayment.length)
        


        var wageallin=type=='1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin//应收付运价类型
        var wagePrice=type=='1'?this.inputModelData.inwageallinprice:this.inputModelData.outwageallinprice//应收付基港运价
        //var changerate=type=='1'?this.dmfwf.
        //alert('22222')
        // if(type=='1'&&this.inputModelData.zddlcode.indexOf('WFF')<0&&(wageallin=='1'||this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice)&&include){
          if(((type=='1'||type=='2')&&wageallin=='1'||(this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice))&&include){
            //console.log()
        //应收运价类型单价ALLIN或者应收cost++并且应付为单价ALLIN，并且包含地面服务费，并且制单代理代码为非WFF时地面服务费不参与
          //alert('3')
          if(this.mawbCharge.filter(i=>i.items=='货站地面费'&&i.isdel=='1').length>0&&type=='1'){
            this.mawbCharge.filter(i=>i.items=='货站地面费'&&i.isdel=='1')[0]['isdel']=2
             this.handelDmCostYf('1',this.mawbCharge)
          }
          if(this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.isdel=='1').length>0&&type=='2'){
            this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.isdel=='1')[0]['isdel']=2
             this.handelDmCostYf('2',this.mawbPayment)
          }
          return
        }

        // if(type=='2'&&this.inputModelData.zddlcode.indexOf('WFF')<0&&wageallin=='1'&&include){//应付运价类型为单价ALLIN，并且制单代码为非WFF时地面服务费不参与
        //  if(this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.isdel=='1').length>0){
           
        //     this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.isdel=='1')[0]['isdel']=2
        //      this.handelDmCostYf('2',this.mawbPayment)
        //   }
        //   return
        // }
       
       //console.log(this.mawbPayment.filter(i=>i.items=='货站地面费'))

        if(type=='1'&&this.mawbCharge.filter(i=>i.items=='货站地面费'&&i.ismodify=='1').length>0){
           this.mawbCharge.forEach(i=>{
            if(i.items=='货站地面费'){
              Object.keys(i).forEach(key=>{
                if(key=='price'){
                  this.dmfwf.pricein=i[key]
                }else if(key=='itemstype'){
                  this.dmfwf.itemstypein=i[key]
                }else if(key=='currency'){
                  this.dmfwf.currencyin=i[key]
                }else if(key=='changerate'){
                  this.dmfwf.changeratein=i[key]
                }else{
                  if(key!='sid'&&key!='guid'){
                    this.$set(this.dmfwf,key,i[key])
                  }
                }
              })
            }
           })
           
           // this.dmfwf.itemstypein=this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['wagetype']
           // this.dmfwf.isfree=this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isfree']
           // this.dmfwf.currencyin=this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['currency']
           // this.dmfwf.changeratein=this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['changerate']

        }else if(type=='2'&&this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.ismodify=='1').length>0){
          this.mawbPayment.forEach(i=>{
            if(i.items=='货站地面费'){
              Object.keys(i).forEach(key=>{
                if(key=='price'){
                  this.dmfwf.priceout=i[key]
                }else if(key=='itemstype'){
                  this.dmfwf.itemstypeout=i[key]
                }else if(key=='currency'){
                  this.dmfwf.currencyout=i[key]
                }else if(key=='changerate'){
                  this.dmfwf.changerateout=i[key]
                }else{
                  if(key!='sid'&&key!='guid'){
                    this.$set(this.dmfwf,key,i[key])
                  }
                }
              })
            }
           })
          // this.dmfwf.priceout=this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['price']
          // this.dmfwf.itemstypeout=this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['wagetype']
          // this.dmfwf.isfree=this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isfree']
          // this.dmfwf.currencyout=this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['currency']
          // this.dmfwf.changerateout=this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['changerate']

        }else{
          this.dmfwf={...this.dmfwfBk} 
        }



        this.dmfwf.itemstype=type=='1'? this.dmfwf.itemstypein:this.dmfwf.itemstypeout
        this.dmfwf.price=type=='1'? this.dmfwf.pricein:this.dmfwf.priceout
        //this.dmfwf.changerate=type=='1'? this.dmfwf.changeratein:this.dmfwf.changerateout

        var showCost=[]
        // &&wagePrice
        if(wageallin>0){
          //alert(type)
          //console.log(wageallin)
         if(wageallin=='1'||this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice){//单价Allin或者应收cost++并且应付为单价ALLIN
          showCost.push({
                status:-1,
                wageinout: type,
                wagedom:'航线',
                ismodify: '2',
                isdel: 1,
                guid: '-1',
                isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin,include),
                currency: type=='1'?this.dmfwf.currencyin:this.dmfwf.currencyout,
                items: this.dmfwf.items,

                settname: type == '1' ? getWtxmname(this.inputModelData.gid,1) : this.dmfwf.settname,
                gid: type == '1' ? this.inputModelData.gid : this.dmfwf.gid,
                wagetype: this.dmfwf.itemstype,
                num: Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.getTypeNum(this.dmfwf.itemstype, type) :1,
                price: Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ?this.dmfwf.price:Number(this.dmfwf.min_price).toFixed(2),
                leastwageall: Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2),
                wageall: Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)*Number(type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)*Number(type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2),
                changerate: type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout,
                remark: '',
                isfree: '否',
                sid: this.inputModelData.boguid,
                servicecode:this.dmfwf.servicecode,
                ismin:Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ?'2':'1'
              })

          if(include){//包含时运费单价需要减去地面服务费单价
             if(type=='1'){
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']=(Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price'])-this.dmfwf.price).toFixed(2)
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['leastwageall']=(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['num'])).toFixed(2)
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['wageall']=(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['num'])*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['changerate'])).toFixed(2)
              
             }else{
              this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']=(Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price'])-this.dmfwf.price).toFixed(2)
              this.mawbPayment.filter(i=>i.items=='航司运费')[0]['leastwageall']=(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['num'])).toFixed(2)
              this.mawbPayment.filter(i=>i.items=='航司运费')[0]['wageall']=(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['num'])*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['changerate'])).toFixed(2)

             }
              // 若存在地面服务费则isdel=1(显示此费用)，并重新算此费用（有数量不相同情况），若不存在则加入一条地面费
              if(type=='1'){
                if(this.mawbCharge.filter(i=>i.items=='货站地面费').length>0){
                  console.log(showCost)
                  this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isdel']='1'
                  this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isinwageallin,include)

                }else{
                  this.mawbCharge=this.mawbCharge.concat(showCost)
                }
              }else if(type=='2'){
                if(this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.ismodify=='2').length>0){
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isdel']='1'
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isoutwageallin,include)
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['settname']=this.dmfwf.settname
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['gid']=this.dmfwf.gid
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['num']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.getTypeNum(this.dmfwf.itemstype, type) :1

                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['price']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.dmfwf.price:Number(this.dmfwf.min_price).toFixed(2)

                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall']=Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2)

                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['wageall']=(Number(this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall'])*Number(this.dmfwf.changerateout)).toFixed(2) 
                
                }else{
                  if(!this.mawbPayment.filter(i=>i.items=='货站地面费').length){
                    this.mawbPayment=this.mawbPayment.concat(showCost)
                  }
                  
                }
              }

          }else{//不包含    则空运费单价不与地面费计算，恢复初始单价，地面费另外单独计算
             if(type=='1'){

              if(this.mawbCharge.filter(i=>i.items=='货站地面费').length>0){
   
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']=this.kyprice('1')
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['leastwageall']=(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['num'])).toFixed(2)
              this.mawbCharge.filter(i=>i.items=='航司运费')[0]['wageall']=(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['num'])*Number(this.mawbCharge.filter(i=>i.items=='航司运费')[0]['changerate'])).toFixed(2)
              
              //console.log(showCost)
              this.mawbCharge.forEach(i=>{
                  if(i.items=='货站地面费'&&i.ismodify=='2'){
                    Object.keys(i).forEach(key=>{
                      if(showCost[0][key]&&key!='guid'&&key!='sid'){
                        i[key]=showCost[0][key]
                      }
                    })
                  }
                 })
              // this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isdel']='1'
              // this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isinwageallin,include)
              //console.log(showCost)
              }else{
                this.mawbCharge=this.mawbCharge.concat(showCost)
              }

             }else{
              //if(this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.ismodify=='2').length>0){
              if(this.mawbPayment.filter(i=>i.items=='货站地面费').length>0){
                this.mawbPayment.forEach(i=>{
                  if(i.items=='货站地面费'&&i.ismodify=='2'){
                    Object.keys(i).forEach(key=>{
                      if(showCost[0][key]&&key!='guid'&&key!='sid'){
                        i[key]=showCost[0][key]
                      }
                    })
                  }
                 })
              // this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']=this.kyprice('2')
              // this.mawbPayment.filter(i=>i.items=='航司运费')[0]['leastwageall']=(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['num'])).toFixed(2)
              // this.mawbPayment.filter(i=>i.items=='航司运费')[0]['wageall']=(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['price']*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['num'])*Number(this.mawbPayment.filter(i=>i.items=='航司运费')[0]['changerate'])).toFixed(2)
              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isdel']='1'
              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isoutwageallin,include)
              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['settname']=this.dmfwf.settname
              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['gid']=this.dmfwf.gid

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['num']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.getTypeNum(this.dmfwf.itemstype, type) :1

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['price']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.dmfwf.price:Number(this.dmfwf.min_price).toFixed(2)

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall']=Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2)

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['wageall']=(Number(this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall'])*Number(this.dmfwf.changerateout)).toFixed(2) 

              }else{
                if(!this.mawbPayment.filter(i=>i.items=='货站地面费').length){
                  this.mawbPayment=this.mawbPayment.concat(showCost)
                }
              
              }

             } 
          }

        }else{//单价++ M++ COST++     包含情况下不显示地面费
          //alert('2')
          if(include){//包含

              if(type=='1'){
              if(this.mawbCharge.filter(i=>i.items=='货站地面费').length>0){

                this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isdel']=2
                this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isinwageallin,include)
              }
             }else{
              if(this.mawbPayment.filter(i=>i.items=='货站地面费').length>0){

                this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isdel']=2
                this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isoutwageallin,include)
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['settname']=this.dmfwf.settname
                  this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['gid']=this.dmfwf.gid
               
              }
             } 
          }else{//不包含     则显示地面费，但不参与运费的计算
           
            showCost.push({
                status:-1,
                wageinout: type,
                wagedom:'航线',
                ismodify: '2',
                isdel: 1,
                guid: '-1',
                isallin:this.isAllinF(type,type == '1'?this.inputModelData.isinwageallin:this.inputModelData.isoutwageallin,include),
                currency: type=='1'?this.dmfwf.currencyin:this.dmfwf.currencyout,
                items: this.dmfwf.items,
                settname: type == '1' ? getWtxmname(this.inputModelData.gid,1) : this.dmfwf.settname,
                gid: type == '1' ? this.inputModelData.gid : this.dmfwf.gid,
                wagetype: this.dmfwf.itemstype,
                num: Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.getTypeNum(this.dmfwf.itemstype, type) :1,
                price: Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ?this.dmfwf.price:Number(this.dmfwf.min_price).toFixed(2),
                leastwageall: Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) >= Number(this.dmfwf.min_price)? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2),
                wageall: Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)*Number(type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)*Number(type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2),
                changerate: type=='1'?this.dmfwf.changeratein:this.dmfwf.changerateout,
                remark: '',
                isfree: '否',
                sid: this.inputModelData.boguid,
                servicecode:this.dmfwf.servicecode,
                ismin:Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ?'2':'1'
              })

              if(type=='1'){
                console.log(showCost)
                if(this.mawbCharge.filter(i=>i.items=='货站地面费').length>0){
                 this.mawbCharge.forEach(i=>{
                  if(i.items=='货站地面费'&&i.ismodify=='2'){
                    Object.keys(i).forEach(key=>{
                      if(showCost[0][key]&&key!='guid'&&key!='sid'){
                        i[key]=showCost[0][key]
                      }
                    })
                  }
                 })
                 //console.log(this.mawbCharge.filter(i=>i.items=='货站地面费'))
                  // this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isdel']=1
                  // this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isinwageallin,include)
                }else{
                  this.mawbCharge=this.mawbCharge.concat(showCost)
                }
              }else if(type=='2'){
                //if(this.mawbPayment.filter(i=>i.items=='货站地面费'&&i.ismodify=='2').length>0){
               if(this.mawbPayment.filter(i=>i.items=='货站地面费').length>0){
                this.mawbPayment.forEach(i=>{
                  if(i.items=='货站地面费'&&i.ismodify=='2'){
                    Object.keys(i).forEach(key=>{
                      if(showCost[0][key]&&key!='guid'&&key!='sid'){
                        i[key]=showCost[0][key]
                      }
                    })
                  }
                 })
              //     this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isdel']=1
              //     this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['isallin']=this.isAllinF(type,this.inputModelData.isoutwageallin,include)
              //    this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['settname']=this.dmfwf.settname
              //     this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['gid']=this.dmfwf.gid

              //    this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['num']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.getTypeNum(this.dmfwf.itemstype, type) :1

              //   this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['price']=Number(this.dmfwf.min_price) <= Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) ? this.dmfwf.price:Number(this.dmfwf.min_price).toFixed(2)

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall']=Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)) >= Number(this.dmfwf.min_price) ? Number(Number(this.getTypeNum(this.dmfwf.itemstype, type)) * Number(this.dmfwf.price)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2)

              // this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['wageall']=(Number(this.mawbPayment.filter(i=>i.items=='货站地面费')[0]['leastwageall'])*Number(this.dmfwf.changerateout)).toFixed(2) 

                }else{
                   if(!this.mawbPayment.filter(i=>i.items=='货站地面费').length){
                      this.mawbPayment=this.mawbPayment.concat(showCost)
                    }                
                }
              } 

          }
        }
        }


        

      


        //console.log(this.mawbCharge)


      },
      handelDmCostYf(type,cost){

      //console.log(cost.filter(i=>i.items=='航司运费'&&i.isdel=='1'&&i.wagedom=='航线'))
        if(cost.filter(i=>i.items=='航司运费'&&i.isdel=='1'&&i.wagedom=='航线').length>0){
          var data=cost.filter(i=>i.items=='航司运费'&&i.isdel=='1'&&i.wagedom=='航线')[0]
          data['price']=this.kyprice(type)

          data['leastwageall']=(Number(data['num'])*Number(data['price'])).toFixed(2)
          data['wageall']=(Number(data['num'])*Number(data['price'])*Number(data['changerate'])).toFixed(2)
        }

      },
      //更改应收付基港运价(应收付服务项目,应收付类型,运价单价)
      handlePrice(costItem, type, val) {

        var costData = type == '1' ? this.mawbCharge : this.mawbPayment
        var information=this.inputModelData.groupid<0||(type=='2'&&this.inputModelData.groupid>0)?this.inputModelData:this.childData

        var allprice = type == '1' ? information.isinwageallin : information.isoutwageallin
        
       console.log(information)
       if(costItem.indexOf('航司运费')=='-1'){//原先没有运费更改基港运价时添加运费

         costData.push({
          status:-1,
          wageinout: type,
          wagedom:'航线',
          ismodify: '2',
          isdel: '1',
          guid: '-1',
          isallin: this.isAllinF(type,allprice),
          currency:'人民币',
          items: '航司运费',
          settname: type == '1' ? getWtxmname(information.gid,1) : getGysname(information.mawbgid,1)||information.gysname,
          gid: type == '1' ? information.gid : information.mawbgid,
          wagetype: (allprice=='2')||(type=='1'&&allprice=='4'&&information.isoutwageallin=='2')?'票':'结算重量',
          num: this.kynum(type,allprice,(type=='2'&&allprice=='2')||(type=='1'&&allprice=='4'&&information.isoutwageallin=='2')?'票':'结算重量'),
          price:this.kyprice(type),
          leastwageall:Number(Number(type == '1' ? information.accountweightin : information.accountweightout)*Number(this.kyprice(type))).toFixed(2),
          wageall:Number(Number(type == '1' ? information.accountweightin : information.accountweightout)*Number(this.kyprice(type))).toFixed(2),
          changerate: '1.0000',
          remark: '',
          isfree: '否',
          sid: information.boguid,
          servicecode:'OA0010',
          parsid:this.inputModelData.boguid
        })
       }else if(costItem.indexOf('航司运费')!='-1'){

        costData[costItem.indexOf('航司运费')].isdel ='1'
        costData[costItem.indexOf('航司运费')].ismodify='2'
        costData[costItem.indexOf('航司运费')].wagetype=(allprice=='2')||(type=='1'&&allprice=='4'&&information.isoutwageallin=='2')?'票':'结算重量'
        costData[costItem.indexOf('航司运费')].isallin=this.isAllinF(type,allprice),
        costData[costItem.indexOf('航司运费')].num=this.kynum(type,allprice,costData[costItem.indexOf('航司运费')].wagetype)
        costData[costItem.indexOf('航司运费')].price=this.kyprice(type)
        costData[costItem.indexOf('航司运费')].leastwageall=Number(Number(costData[costItem.indexOf('航司运费')].num)*Number(costData[costItem.indexOf('航司运费')].price)).toFixed(2)
        costData[costItem.indexOf('航司运费')].wageall=Number(Number(costData[costItem.indexOf('航司运费')].leastwageall)*Number(costData[costItem.indexOf('航司运费')].changerate)).toFixed(2)
        costData[costItem.indexOf('航司运费')].servicecode ='OA0010'
      }

      this.smallCostData.forEach((other, index) => {

        var itemType = type == '1' ? other.itemstype_in : other.itemstype_out
        var itemIndex = costItem.indexOf(other.items)
        if (other.isallin == '1') {
            if (costItem.indexOf(other.items) == '-1') { //如果应付费用中没有杂费ALLIN费用 则在应付费用中新增杂费ALLIN费用
              costData.push({
                status:-1,
                wageinout: type,
                wagedom:'航线',
                ismodify: '2',
                isdel: '1',
                guid: '-1',
                isallin: this.isAllinF(type,allprice),
                currency: other.currency,
                items: other.items,
                settname: type == '1' ? information.wtxmname : getGysname(information.mawbgid,1)||information.gysname,
                gid: type == '1' ? information.gid : information.mawbgid,
                wagetype: type == '2' ? other.itemstype_out:other.itemstype_in,
                num: Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ? this.getTypeNum(itemType, type) : !other.price&&other.min_price=='50'?'1':Number(Number(other.min_price) / Number(other.price)).toFixed(2),
                price: !other.price&&other.min_price=='50'?'50':other.price,
                leastwageall: Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) >= Number(other.min_price)? Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)).toFixed(2) : !other.price&&other.min_price=='50'?'50':Number(other.min_price).toFixed(2),
                wageall: Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) >= Number(other.min_price) ? Number(Number(this.getTypeNum(itemType, type)) * Number(other.price) * Number(getChangeRate(other.currency))).toFixed(2) : !other.price&&other.min_price=='50'?'50':Number(Number(other.min_price) * Number(getChangeRate(other.currency))).toFixed(2),
                changerate: getChangeRate(other.currency),
                remark: '',
                isfree: '否',
                sid: this.inputModelData.groupid<0||(type=='2'&&this.inputModelData.groupid>0)?this.inputModelData.boguid:this.childData.boguid,
                servicecode:other.servicecode,
                parsid:this.inputModelData.boguid,
                ismin:Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ?'2':'1'
              })
            } else { //如果出现过并且ismodify值为2 重新计算 num price
              costData[itemIndex].isdel = '1'
              if (allprice == '3') { //单价++
                costData[itemIndex].isallin = this.isAllinF(type,allprice)
                if (costData[itemIndex].items == '航司运费') {
                  costData[itemIndex].price = this.kyprice(type)
                  costData[itemIndex].num = type == '1' ? information.accountweightin : information.accountweightout
                  costData[itemIndex].leastwageall = Number(Number(this.kyprice(type)) * Number(costData[itemIndex].num)).toFixed(2)
                  costData[itemIndex].wageall = Number(Number(this.kyprice(type)) * Number(costData[itemIndex].num) * Number(costData[itemIndex].changerate)).toFixed(2)
                  costData[itemIndex].servicecode="OA0010"
                } else {
                  if (costData[itemIndex].wagetype == '结算重量') {
                    costData[itemIndex].num = Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ? this.getTypeNum(itemType, type) : !other.price&&other.min_price=='50'?'1':Number(Number(other.min_price) / Number(other.price)).toFixed(2)
                    costData[itemIndex].leastwageall = Number(Number(costData[itemIndex].num) * Number(costData[itemIndex].price)).toFixed(2)
                    costData[itemIndex].wageall = Number(Number(costData[itemIndex].leastwageall) * Number(costData[itemIndex].changerate)).toFixed(2)
                    costData[itemIndex].servicecode=other.servicecode
                    costData[itemIndex].ismin=Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ?'2':'1'
                    //costData[itemIndex].servicecode="OA0010"
                  }
                }
              } else if (allprice == '2') { //M级++
                costData[itemIndex].isallin = this.isAllinF(type,allprice)
                if (costData[itemIndex].items == '航司运费') {
                  costData[itemIndex].price = this.kyprice(type)
                  costData[itemIndex].num = 1
                  costData[itemIndex].leastwageall = Number(Number(this.kyprice(type)) * Number(1)).toFixed(2)
                  costData[itemIndex].wageall = Number(Number(this.kyprice(type)) * Number(1) * Number(costData[itemIndex].changerate)).toFixed(2)
                  costData[itemIndex].servicecode="OA0010"
                } else {
                  if (costData[itemIndex].wagetype == '结算重量') {
                    costData[itemIndex].num = Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ? this.getTypeNum(itemType, type) : !other.price&&other.min_price=='50'?'1':Number(Number(other.min_price) / Number(other.price)).toFixed(2)
                    costData[itemIndex].leastwageall = Number(Number(costData[itemIndex].num) * Number(costData[itemIndex].price)).toFixed(2)
                    costData[itemIndex].wageall = Number(Number(costData[itemIndex].leastwageall) * Number(costData[itemIndex].changerate)).toFixed(2)
                    costData[itemIndex].servicecode=other.servicecode
                    costData[itemIndex].ismin=Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ?'2':'1'
                    //costData[itemIndex].servicecode="OA0010"
                  }
                }

              } else if (allprice == '1') { //单价ALLIN
                costData[itemIndex].isallin = this.isAllinF(type,allprice)
                if (costData[itemIndex].items == '航司运费') {
                  costData[itemIndex].price = this.kyprice(type)
                  costData[itemIndex].num = type == '1' ? information.accountweightin : information.accountweightout
                  costData[itemIndex].leastwageall = Number(Number(this.kyprice(type)) * Number(costData[itemIndex].num)).toFixed(2)
                  costData[itemIndex].wageall = Number(Number(this.kyprice(type)) * Number(costData[itemIndex].num) * Number(costData[itemIndex].changerate)).toFixed(2)
                  costData[itemIndex].servicecode="OA0010"
                } else {
                  if (costData[itemIndex].wagetype == '结算重量') {
                    costData[itemIndex].num = Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ? this.getTypeNum(itemType, type) : Number(Number(other.min_price) / Number(other.price)).toFixed(2)
                    costData[itemIndex].leastwageall = Number(Number(costData[itemIndex].num) * Number(costData[itemIndex].price)).toFixed(2)
                    costData[itemIndex].wageall = Number(Number(costData[itemIndex].leastwageall) * Number(costData[itemIndex].changerate)).toFixed(2)
                    costData[itemIndex].servicecode=other.servicecode
                    costData[itemIndex].ismin=Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ?'2':'1'
                    //costData[itemIndex].servicecode="OA0010"
                  }
                }
              } else if (allprice == '4') { //Cost++
                costData[itemIndex].isallin = this.isAllinF(type,allprice)
                if (costData[itemIndex].items == '航司运费') {
                  costData[itemIndex].price = this.kyprice(type)
                  costData[itemIndex].num = 1
                  costData[itemIndex].leastwageall = Number(Number(this.kyprice(type)) * Number(1)).toFixed(2)
                  costData[itemIndex].wageall = Number(Number(this.kyprice(type)) * Number(1) * Number(costData[itemIndex].changerate)).toFixed(2)
                  costData[itemIndex].servicecode="OA0010"
                } else {
                  if (costData[itemIndex].wagetype == '结算重量') {
                    costData[itemIndex].num = Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ? this.getTypeNum(itemType, type) : !other.price&&other.min_price=='50'?'1':Number(Number(other.min_price) / Number(other.price)).toFixed(2)
                    costData[itemIndex].leastwageall = Number(Number(costData[itemIndex].num) * Number(costData[itemIndex].price)).toFixed(2)
                    costData[itemIndex].wageall = Number(Number(costData[itemIndex].leastwageall) * Number(costData[itemIndex].changerate)).toFixed(2)
                    costData[itemIndex].servicecode=other.servicecode
                    costData[itemIndex].ismin=Number(other.min_price) <= Number(Number(this.getTypeNum(itemType, type)) * Number(other.price)) ?'2':'1'
                  }
                }

              }

            }
          }
        })

let sortArry = ['航司运费', '航司战争附加费', '航司燃油附加费']
costData = costData.map(x => ({
  value: x,
  index: sortArry.indexOf(x.items)
})).sort((a, b) => a.index - b.index).map(x => x.value).sort((a, b) => a.isallin - b.isallin)

},
      //修改中转费单价
      handleZzPrice(type,val){
        //alert('1')
        let costData=type=='1'?this.mawbCharge:this.mawbPayment
        let information=this.inputModelData.groupid<0||(this.inputModelData.groupid>0&&type=='2')?this.inputModelData:this.childData
        let price=type=='1'?information.isinwageallin_trans:information.isoutwageallin_trans
        let itemType=price=='1'?'结算重量':'票'

        let costItem=costData.map(i=>{
         return i.items
       })
        // console.log(costData)
         //console.log(this.mawbPayment)
         //alert(type)
         if(costItem.indexOf('航司中转费')=='-1'){
          //console.log(type)
          //alert('1')
          costData.push({
            status:-1,
            wageinout:type,
            wagedom:'航线',
            ismodify:2,
            isdel:'1',
            guid:'-1',
            isallin:'2',
            currency:'人民币',
            changerate:1.0000,
            items:'航司中转费',
            settname:type=='1'?information.wtxmname:getGysname(information.mawbgid,1)||information.gysname,
            gid: type == '1' ? information.gid : information.mawbgid,
            wagetype: itemType,
            num:itemType=='票'?1.00:type=='1'?Number(information.zzysweight).toFixed(2):Number(information.zzyfweight).toFixed(2),
            price:Number(val).toFixed(2),
            leastwageall:Number(Number(itemType=='票'?1.00:type=='1'?Number(information.zzysweight).toFixed(2):Number(information.zzyfweight).toFixed(2))*Number(val)).toFixed(2),
            wageall:Number(Number(itemType=='票'?1.00:type=='1'?Number(information.zzysweight).toFixed(2):Number(information.zzyfweight).toFixed(2))*Number(val)).toFixed(2),
            changerate:'1.0000',
            remark:'',
            isfree:'否',
            sid: this.inputModelData.groupid<0||(type=='2'&&this.inputModelData.groupid>0)?this.inputModelData.boguid:this.childData.boguid,
            servicecode:'OA0010',
            parsid:this.inputModelData.boguid
          })


        }else{
          var index=costItem.indexOf('航司中转费')

          costData[index].ismodify='2'
          costData[index].isdel='1'
          costData[index].price=Number(val).toFixed(2)
          costData[index].num=itemType=='票'?1.00:type=='1'?Number(information.zzysweight).toFixed(2):Number(information.zzyfweight).toFixed(2)
          costData[index].wageall=Number(costData[index].price*costData[index].num).toFixed(2)
          costData[index].leastwageall=Number(costData[index].wageall*Number(costData[index].changerate)).toFixed(2)
          costData[index].servicecode='OA0010'


        }
         //console.log(costData)
         let sortArry = ['航司运费', '航司战争附加费', '航司燃油附加费']
         costData = costData.map(x => ({
          value: x,
          index: sortArry.indexOf(x.items)
        })).sort((a, b) => a.index - b.index).map(x => x.value).sort((a, b) => a.isallin - b.isallin)
          //console.log(this.mawbPayment)
          //console.log(this.mawbPayment)
         // this.$forceUpdate()
       },
      //修改应收付基港结算重量(应收付费用类型,基港结算重量)
      handleCost(type,val){//杂费匹配到应收付费用的服务项目并且结算方式为结算重量 ismodify为2时改变数量,若应收付服务项目为运费看应收付基港运价类型

        let costData=type=='1'?this.mawbCharge:this.mawbPayment
        let information=this.inputModelData.groupid<0||(this.inputModelData.groupid>0&&type=='2')?this.inputModelData:this.childData
        let allprice=type=='1'?information.isinwageallin:information.isoutwageallin

        let otherCostItem=this.smallCostData.filter(i=>{return i.isallin=='1'}).map(i=>{return i.items})
        let allCostItem=this.smallCostData.map(i=>{return i.items})

        costData.forEach(i=>{

         if(otherCostItem.indexOf(i.items)!='-1'&&i.ismodify=='2'&&i.wagetype=='结算重量'){

               //console.log(this.smallCostData[otherCostItem.indexOf(i.items)].min_price)

               i.num=Number(this.smallCostData[allCostItem.indexOf(i.items)].min_price) <= Number(Number(this.getTypeNum('结算重量', type)) * Number(i.price)) ? this.getTypeNum('结算重量', type) : Number(Number(this.smallCostData[allCostItem.indexOf(i.items)].min_price) / Number(i.price)).toFixed(2)

               i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)

               i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
 
               i.ismin=Number(this.smallCostData[allCostItem.indexOf(i.items)].min_price) <= Number(Number(this.getTypeNum('结算重量', type)) * Number(i.price)) ?'2':'1'
             }
             if(i.items=='航司运费'&&i.ismodify=='2'&&i.wagetype=='结算重量'){
              if(type=='2'){
                if(allprice!='2'){
                  i.num=Number(val).toFixed(2)
                  i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)
                  i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
                }
              }else{
               // console.log(this.inputModelData.isinwageallin)
               if(!(allprice=='4'&&information.isinwageallin=='2')){
                 // console.log(allprice=='4'&&this.inputModelData.isoutwageallin=='2')
                 i.num=Number(val).toFixed(2)
                 i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)
                 i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
               }
             }

           }


         })

        let sortArry = ['航司运费', '航司战争附加费', '航司燃油附加费']
        costData = costData.map(x => ({
          value: x,
          index: sortArry.indexOf(x.items)
        })).sort((a, b) => a.index - b.index).map(x => x.value).sort((a, b) => a.isallin - b.isallin)
          //console.log(costData)
        },
        airLineOpen(){
          var object={
            costDom:'客服',
            showSuggestWage:true,
            title:'费用信息',
            area:this.inputModelData.area,
            mawbguid:this.inputModelData.guid,
            pagetype:'2',
            boguid:this.inputModelData.boguid,
            show:true,
            active:'客服',
          }
          this.$store.commit("searchData", object);
        },
      },

      mounted:function(){

      },

      created:function(){
        let groupIdData=JSON.parse(localStorage.getItem('groupType'))
        groupIdData.forEach(item=>{
          if(item.groupid==33){
       // //console.log(item)
       this.jsfs.push({value:item.id,typename:item.typename})
     }
   })

        let currencyData=JSON.parse(localStorage.getItem('currencyData'))
        currencyData.forEach(item=>{
          this.currencyList.push(item.cname)
        })

        this.$watch(()=>{
          return this.inputModelData.zdvolume+this.inputModelData.zdweight
        },()=>{
          if(this.inputModelData.zddrstatus!='2'){
            
            this.inputModelData.jfweight=computedWeight(this.inputModelData.zdvolume,this.inputModelData.zdweight)

            console.log(this.inputModelData.zdvolume,this.inputModelData.zdweight)
            console.log(this.inputModelData.jfweight)
          }
        })

    //应收付费用金额
    this.$watch(
      function() {
        return this.curObjectKyYs.num + this.curObjectKyYs.price + this.curObjectKyYs.currency;
      },
      function(newVal, oldVal) {
        var leastwageall =
        Number(this.curObjectKyYs.num) * Number(this.curObjectKyYs.price);

        this.curObjectKyYs.wageall =
        (leastwageall * Number(this.curObjectKyYs.changerate)).toFixed(2) || 0;

        this.curObjectKyYs.leastwageall = leastwageall.toFixed(2) || 0;
        this.curObjectKyYs.wageall =this.curObjectKyYs.wageall.split('.')[1]=='99'?Number(this.curObjectKyYs.wageall)+0.01:this.curObjectKyYs.wageall
        this.curObjectKyYs.leastwageall = this.curObjectKyYs.leastwageall.split('.')[1]=='99'?Number(this.curObjectKyYs.leastwageall)+0.01:this.curObjectKyYs.leastwageall
      }
      );

    this.$watch(
      function() {
        return this.curObjectKyYf.num + this.curObjectKyYf.price + this.curObjectKyYf.currency;
      },
      function(newVal, oldVal) {
        var leastwageall =
        Number(this.curObjectKyYf.num) * Number(this.curObjectKyYf.price);

        this.curObjectKyYf.wageall =
        (leastwageall * Number(this.curObjectKyYf.changerate)).toFixed(2) || 0;

        this.curObjectKyYf.leastwageall = leastwageall.toFixed(2) || 0;
        
         this.curObjectKyYf.wageall =this.curObjectKyYf.wageall.split('.')[1]=='99'?Number(this.curObjectKyYf.wageall)+0.01:this.curObjectKyYf.wageall
        this.curObjectKyYf.leastwageall = this.curObjectKyYf.leastwageall.split('.')[1]=='99'?Number(this.curObjectKyYf.leastwageall)+0.01:this.curObjectKyYf.leastwageall
      }
      );
    if(this.activeTab){
      this.activeMod=this.activeTab
    }

    this.$watch(
      function() {
        return this.inputModelData.yqhbrq + this.inputModelData.yqhbh;
      },
      function(val) {
        if (val) {
          //console.log(this.inputModelData.qfsj)
          //if(!this.inputModelData.qfsj||this.inputModelData.qfsj.indexOf('00:00')!='-1'){
            //2021-8-10 不需要提示
            
              this.getQfsj()
 

          //}

        }
      },
      { immediate: true }
      );

    this.$watch(
    function(){
      return this.inputModelData.inwageallinprice
    },
    function(val){
    if(val&&val!='666666'){
      this.fareInputViewData.inwageallinclude.hidden=false
      this.fareInputViewData.inwageallinprice.itemStyle.width='315px'
      this.fareInputViewData.inwageallinprice.itemStyle.minWidth='315px'
    }else{
      
        this.fareInputViewData.inwageallinclude.hidden=true
        this.fareInputViewData.inwageallinprice.itemStyle.width='800px'
        this.fareInputViewData.inwageallinprice.itemStyle.minWidth='800px'
  
    }
    }
    )

     this.$watch(
    function(){
      return this.inputModelData.outwageallinprice
    },
    function(val){
      if((val&&val!='666666')||this.inputModelData.childguid>0){
      this.fareOutputViewData.outwageallinclude.hidden=false
      this.fareOutputViewData.outwageallinprice.itemStyle.width='315px'
      this.fareOutputViewData.outwageallinprice.itemStyle.minWidth='315px'
      }else{
      this.fareOutputViewData.outwageallinclude.hidden=true  
      this.fareOutputViewData.outwageallinprice.itemStyle.width='800px'
      this.fareOutputViewData.outwageallinprice.itemStyle.minWidth='800px'
    }
  }
    )

    this.$watch(
    function(){
    return this.inputModelData.inwageallinclude
    },
    function(val){
    if(this.switchWatch&&val){
      this.mawbCharge.forEach(i=>{
        if(i.items=='货站地面费'){
          i.ismodify=2
        }
      })
      //this.dmfwf.pricein=0.4
      if(val==4){
       
          this.handleDmCost('1',true)
      
        
      }else{
        
          this.handleDmCost('1',false)
     
    } 



    }
   }
   )


    this.$watch(
    function(){
    return this.inputModelData.outwageallinclude
    },
    function(val){
      //alert('3')
      //console.log(val)
      
    if(this.switchWatch&&val){
      this.mawbPayment.forEach(i=>{
        if(i.items=='货站地面费'){
          i.ismodify=2
        }
      })
      //this.dmfwf.priceout=0.4
      //console.log('22')
      if(val==4){
          //alert('1')
          this.handleDmCost('2',true)
          
        
      }else{
    
          this.handleDmCost('2',false)
       
      }
    }  
    }

    )  

    this.$watch(
    function(){
    return this.inputModelData.zddlcode
    },
    function(val){
      //console.log('33')
     if(this.switchWatch&&val){
     //alert(val)
      var disabled=this.inputModelData.serviceList.filter(i=>i.servicecode=='AA0230')[0]['isdel']==2&&this.inputModelData.serviceList.filter(i=>i.servicecode=='AA0240')[0]['isdel']==2&&this.inputModelData.zddlcode.toLowerCase().indexOf('wff')<0

         if(val.toLowerCase().indexOf('wff')!='-1'){
          //this.fareOutputViewData.outwageallinclude.disabled=true
          this.inputModelData.outwageallinclude='-1'

          this.dmfwf.gid=this.dmfwfGid?this.dmfwfGid:'-1'
          this.dmfwf.settname=this.dmfwfGid?getGysname(this.dmfwfGid,1):''
         
             this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)
  
          
          

          if(this.inputModelData.isinwageallin=='1'||this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice){
           
             this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)
       
          }
          
          this.inputModelData.iszddl='1'
          
          
          
        }else{
          if(this.inputModelData.mawbss=='我司运单'){
            //this.fareOutputViewData.outwageallinclude.disabled=true
            this.inputModelData.outwageallinclude='4'
          }else{
            //this.fareOutputViewData.outwageallinclude.disabled=false
            this.inputModelData.outwageallinclude='4'
          }
          
          this.dmfwf.gid=this.inputModelData.mawbgid
          this.dmfwf.settname=getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname.split('-')[1]
        
            this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false) 
     
          
          


         if(this.inputModelData.isinwageallin=='1'||this.inputModelData.isinwageallin=='4'&&this.inputModelData.isoutwageallin=='1'&&this.inputModelData.outwageallinprice){
          
              this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)
        
          }
          
          this.inputModelData.iszddl='2'
          
         
        }

    }
    }  
    )  

    this.mawbDetail()//总单详细

   


  },

  computed:{
    // note: 签单信息禁用
    getSignDisabled() {
      let status = false;

       if (!this.visibleI) {
         // 销售站无主营
          if (this.inputModelData.orderguid == -1 
          && this.inputModelData.childguid > 0 
          && this.inputModelData.isshipace == 2) {
            status = true;
          }

          // 操作站无主营
          if (this.inputModelData.orderguid > 0
              && this.inputModelData.isshipace == 2
          ) {
            status = true;
          }

       }

       return {'disabled': status}
    },

    // note: 应付运价禁用
    getDealWithFreightDisalbed() {
      let status = false;

      if ( !this.visibleI ) {
        // 销售站无主营
        if (this.inputModelData.orderguid == -1 
        && this.inputModelData.childguid > 0 
        && this.inputModelData.isshipace == 2) {
          status = true;
        }

        // 操作站无主营
        if (this.inputModelData.orderguid > 0
            && this.inputModelData.isshipace == 2
        ) {
          status = true;
        }
      } else {
        if (this.yingfustatusForm || !this.inputModelData.mawb || this.inputModelData.isshipace == 2) {
          status = true;
        }
      }

      return {'disabled': status}
    },

    // note: 应收运价禁用
      getAccountsReceivableFreightDisabled() {
        let status = false;

        if (!this.visibleI) {
            // 操作站有主营
          if (this.inputModelData.orderguid > 0 
          && this.inputModelData.isshipace == 1) {
            status = true;
          }

          // 操作站无主营
          if (this.inputModelData.orderguid > 0
              && this.inputModelData.isshipace == 2
          ) {
            status = true;
          }

        } else {
           if (this.yingshoustatusForm
           || (this.inputModelData.profitmode && this.inputModelData.profitmode.indexOf('利润')) != '-1'
           && this.inputModelData.orderguid>0) {
             status = true;
           }
        }
        return {'disabled': status}
      },

     wageBohuiYs(){
      if(this.mawbCharge){

       return this.mawbCharge.filter(i=>i.status==100).length
      }
     },
     wageBohuiYf(){
      if(this.mawbPayment){
       return this.mawbPayment.filter(i=>i.status==100).length
      }
     },
     tabPanStyle(){
     var style=[]
     this.childrenList.forEach(i=>{
      if(this.allCostData.filter(i2=>i2.wagedom=='航线'&&i2.yssys=='2'&&i2.sid==i.boguid&&i2.wageinout=='1').every(i3=>{
        return i3.confirmstatus=='700'||i3.confirmstatus=='已确认'
      })){
       style.push({'background':i.boguid==this.childData.boguid?'rgb(14,176,0)':'rgba(14,176,0,.1)'}) 
      }else{
       style.push({'background':i.boguid==this.childData.boguid?'rgb(235,0,0)':'rgba(235,0,0,.1)'})
      }
     })
     //console.log(style)
     return style
     },
    //预报计费重量
    ybjfweight(){

      return computedWeight(this.inputModelData.ybvolume,this.inputModelData.ybweight)


    },
    qdjfweight(){
      return computedWeight(this.inputModelData.signvolume,this.inputModelData.signweight)
    },
    sjjfweight(){
      return computedWeight(Number(this.inputModelData.signrealvolume+this.inputModelData.signcommitvolume),Number(this.inputModelData.signrealweight+this.inputModelData.signcommitweight))
    },
    //实际计费重量
    realjfweight(){
      return computedWeight(this.inputModelData.signrealvolume,this.inputModelData.signrealweight)

    },
    qrjfweight(){
     return computedWeight(this.inputModelData.signcommitvolume,this.inputModelData.signcommitweight)
    },
    //制单计费重量
    zdjfweight:{
      get(){

        return Number(this.inputModelDataBack.jfweight).toFixed(2)||Number(0).toFixed(2)

      },
      set(val){

      }
    },
     //应收基港运价
     accountweightin(){
      var num=""
    console.log(this.$refs.accountweightin)
      if(this.sjjfweight&&this.zdjfweight&&this.inputModelData.ysjffs=='板外'){
      //  if(Number(this.sjjfweight)<=Number(this.zdjfweight)){

      //   num=this.zdjfweight
      // }else{
      
       if(this.inputModelData.groupid<0){

          if(this.$refs.accountweightin&&this.$refs.accountweightin.jsList){
          let list=this.$refs.accountweightin.jsList
          let first=this[list.first]||this.inputModelData[list.first]
          let second=this[list.second]||this.inputModelData[list.second]
          let third=this[list.third]||this.inputModelData[list.third]
  
          if(this.JudgeBubblesFunc(1)>0){
            num=this.inputModelData.jfweight
          }else{
            if((Number(first)-Number(second))<0){
               num=parseFloat(0*(this.inputModelData.self_real_bp_freight_in*0.1))+parseFloat(third)
            }else{
                num=parseFloat((first-second)*(this.inputModelData.self_real_bp_freight_in*0.1))+parseFloat(third)
            }
          
          } 
          }
         
       }else{
        if(this.JudgeBubblesFunc(1)>0){
           num=this.inputModelData.jfweight
        }else{

          num=parseFloat((this.sjjfweight-this.zdjfweight)*(this.childData.self_real_bp_freight_in*0.1))+parseFloat(this.zdjfweight)
        }
        
       } 
       
     //}
   }else{
     num=this.inputModelData[this.inputModelData.accountweightinSelect]||this[this.inputModelData.accountweightinSelect]
   }

    // if(this.inputModelData.childguid>0){
    //   console.log(num)
    //     this.inputModelData.accountweightin=num
    //   }

      // if(this.inputModelData.groupid>0){
      //   this.childrenList.forEach(i=>{
      //   i.accountweightin=Number(i.accountweightin)>0&&i.jgysischange=='2'?Number(i.accountweightin):Number(num).toFixed(0)
      // })
      // }
      //console.log(num)
          return Number(num).toFixed(0)


        },

    //应收中转运价
    accountweightinZz(){
     var num=""
    //  if(Number(this.sjjfweight)<=Number(this.zdjfweight)){
    //    num=this.zdjfweight
    //  }else{
       console.log(this.$refs.accountweightinzz)
       if(this.inputModelData.groupid<0){
        //子组件中匹配对应值
        if(this.$refs.accountweightinzz&&this.$refs.accountweightinzz.jsList){
          let list=this.$refs.accountweightinzz.jsList
           let first=this[list.first]||this.inputModelData[list.first]
          let second=this[list.second]||this.inputModelData[list.second]
          let third=this[list.third]||this.inputModelData[list.third]

          if(this.JudgeBubblesFunc(1)>0){
            num=this.inputModelData.jfweight
          }else{

            if((Number(first)-Number(second))<0){
               num=parseFloat(0*(this.inputModelData.self_real_bp_trans_in*0.1))+parseFloat(third)
            }else{
               num=parseFloat((first-second)*(this.inputModelData.self_real_bp_trans_in*0.1))+parseFloat(third)
            }
           
          }

        }
        
        
      }else{
        if(this.JudgeBubblesFunc(1)>0){
          num=this.inputModelData.jfweight
        }else{
          num=parseFloat((this.sjjfweight-this.zdjfweight)*(this.childData.self_real_bp_trans_in*0.1))+parseFloat(this.zdjfweight)
        }
        
      }
      
     //}
     // if(this.inputModelData.childguid>0){
     //    this.inputModelData.zzysweight=num
     //  }
 
      // if(this.inputModelData.groupid>0){
      //   this.childrenList.forEach(i=>{
      //   i.zzysweight=Number(i.zzysweight)>0&&i.zzysischange=='2'?Number(i.zzysweight):Number(num).toFixed(0)
      // })
      // }
    return Number(num).toFixed(0)
      //var num=parseFloat(this.inputModelData.)
    },

     //应付基港运价
     accountweightout(){
      var num=''
      console.log(this.$refs.accountweightout)
      if(this.inputModelData.yfjffs=='板外'){
        // if(Number(this.sjjfweight)<=Number(this.zdjfweight)){
        //   num=this.zdjfweight
        // }else{
          if(this.$refs.accountweightout&&this.$refs.accountweightout.jsList){
          let list=this.$refs.accountweightout.jsList
          let first=this[list.first]||this.inputModelData[list.first]
          let second=this[list.second]||this.inputModelData[list.second]
          let third=this[list.third]||this.inputModelData[list.third]
          if(this.JudgeBubblesFunc(1)>0){
            num=this.inputModelData.jfweight
          }else{
            if((Number(first)-Number(second))<0){
              num=parseFloat(0*(this.inputModelData.cus_real_bp_freight_out*0.1))+parseFloat(third)
            }else{
               num=parseFloat((first-second)*(this.inputModelData.cus_real_bp_freight_out*0.1))+parseFloat(third)
            }
          }

         }
        //}

      //}
      }else{
        console.log(9999)
        num=this.inputModelData[this.inputModelData.accountweightoutSelect]||this[this.inputModelData.accountweightoutSelect]
      }

      console.log(num)
      return Number(num).toFixed(0)


    },

     //应付中转运价
     accountweightoutZz(){

      var num=""
      //let dom=""
      this.$nextTick(()=>{
        this.domZZ=this.$refs.accountweightoutzz
        
      })
      //console.log(this.domZZ)
      // if(this.inputModelData.self_real_bp_trans_out==10){
      //   num=this.zdjfweight
      // }else{
        // if(Number(this.sjjfweight)<=Number(this.zdjfweight)){
        //   num=this.zdjfweight
        // }else{
        if(this.domZZ&&this.domZZ.jsList){
         
          let list=this.domZZ.jsList

          let first=this[list.first]||this.inputModelData[list.first]
          let second=this[list.second]||this.inputModelData[list.second]
          let third=this[list.third]||this.inputModelData[list.third]

            if(this.JudgeBubblesFunc(1)>0){
             num=this.inputModelData.jfweight
            }else{

            if((Number(first)-Number(second))<0){
              num=parseFloat(0*(this.inputModelData.cus_real_bp_trans_out*0.1))+parseFloat(third)
            }else{
              num=parseFloat((first-second)*(this.inputModelData.cus_real_bp_trans_out*0.1))+parseFloat(third)
            }
            }
          }
      
  
          console.log(num)
     
      return Number(num).toFixed(0)
 
    },

    //航线应收
    allinCost(){
      var num=0;
      if(this.mawbCharge){
        this.mawbCharge.forEach(i=>{

          if((i.isfree=='否'||i.isfree=='1')&&(i.confirmstatus=='已确认'||i.confirmstatus=='700')){


        //i.wageall=Number(i.wageall).toFixed(2)
        //console.log(i)
        //console.log(i.wageall)
        num+=Number(i.wageall)
        console.log(num)
        //console.log(i.wageall)

      }

    })
      }


     return this.StringNum(num)
    },
    //航线应付
    alloutCost(){
     var num=0;
     if(this.mawbPayment){
      this.mawbPayment.forEach(i=>{
        if((i.isfree=='否'||i.isfree=='1')&&(i.confirmstatus=='已确认'||i.confirmstatus=='700')){
          num+=Number(i.wageall)
        }

      })
    }

    return this.StringNum(num)
  },



    // //应收确认状态
    // yingshoustatus(){
    //   let status=this.mawbCharge.filter(i=>{return i.confirmstatus=='已确认'})

    //   if(status.length>0){
    //     return true
    //   }else{
    //     return false
    //   }
    // },

    // //应付确认状态
    // yingfustatus(){
    //   let status=this.mawbPayment.filter(i=>{return i.confirmstatus=='已确认'})
    //   if(status.length>0){
    //     return true
    //   }else{
    //     return false
    //   }
    // },


  },

  watch:{
    'dmfwf.gid'(val){
        //alert('1')
        if(val){
          console.log(val)
           this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)
          this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)
        }
        
    },
    mawbData: {
      handler(val) {
        if (!this.visibleI) {
          let {mawb, gysname, mawbss, iszddl, zddlcode,mawbgid} = val
          //alert(mawbgid)
          this.inputModelData.mawb = mawb;
          this.inputModelData.gysname = gysname.indexOf('-') != -1 ? gysname.split('-')[1] : gysname;
          this.inputModelData.mawbss = mawbss;
          this.inputModelData.iszddl = String(iszddl);
          this.inputModelData.zddlcode = zddlcode;
          this.inputModelData.mawbgid = mawbgid; // 解决配置总运单 => 无mawbgid
        }
       
      },
      deep: true,
    
    },

    shipaceInfoData: {
      handler(val) {
        if (!this.visibleI) {
          let {hbh, hbrq, qfsj} = val;
          this.inputModelData.yqhbh = hbh;
          this.inputModelData.yqhbrq = hbrq;
          this.inputModelData.yjqfsj = qfsj;
        }
        
      },
      deep: true,
    },

    "inputModelData": {
      handler(val) {
        if (!this.visibleI) {
          let { gysname, mawbss, iszddl, zddlcode, yqhbh, yqhbrq, yjqfsj} = val
          // this.mawbData.gysname = gysname;
          // this.mawbData.mawbss = mawbss;
          this.mawbData.iszddl = Number(iszddl);
          this.mawbData.zddlcode = zddlcode;
          this.shipaceInfoData.hbh = yqhbh;
          this.shipaceInfoData.hbrq = formatDate( yqhbrq, "yyyy-MM-dd hh:mm");
          this.shipaceInfoData.qfsj = yjqfsj;
          this.$emit('getAirInputModelData',val);
        }
        
      },
      deep: true,
      
    },
    "monitor"(val) {
        this.$emit('getAirmonitor',val)
    },
   "inputModelData.yfjffs"(val){
     if(val=='板内'){
      this.fareOutputViewData.accountweightoutSelect.hidden=false
      this.fareOutputViewData.yfjffs.idStyle={'width':'30%'}
      this.$set(this.inputModelData,'accountweightoutSelect',!this.inputModelData.accountweightoutSelect?'zdjfweight':this.inputModelData.accountweightoutSelect)
     }else{
      this.fareOutputViewData.accountweightoutSelect.hidden=true
      this.fareOutputViewData.yfjffs.idStyle={'width':'100%'}
     }
   },
      "inputModelData.ysjffs"(val){
     if(val=='板内'){
      this.fareInputViewData.accountweightinSelect.hidden=false
      this.fareInputViewData.ysjffs.idStyle={'width':'30%'}
      this.$set(this.inputModelData,'accountweightinSelect',!this.inputModelData.accountweightinSelect?'zdjfweight':this.inputModelData.accountweightinSelect)
     }else{
      this.fareInputViewData.accountweightinSelect.hidden=true
      this.fareInputViewData.ysjffs.idStyle={'width':'100%'}
     }
   },
   "inputModelData.accountweightoutSelect"(val){
     if(this.inputModelData.yfjffs=='板内'){
       this.inputModelData.accountweightout=this.inputModelData[val]||this[val]
     }
   },
   "inputModelData.accountweightinSelect"(val){
     if(this.inputModelData.ysjffs=='板内'){
       this.inputModelData.accountweightin=this.inputModelData[val]||this[val]
     }
   },

   "curObjectKyYf.currency": {
    handler(val) {
      this.curObjectKyYf.changerate = getChangeRate(val) || 0;
    },
    immediate: true
  },

  "curObjectKyYs.currency": {
    handler(val) {
      this.curObjectKyYs.changerate = getChangeRate(val) || 0;
    },
    immediate: true
  },

  "curObjectKyYf.wagetype"(val) {
    if (
      (this.mawbPayment[this.modCostIndex] &&
        this.mawbPayment[this.modCostIndex].wagetype) == val
      ) {
      return;
  }
  switch (val) {
    case "箱":
    this.curObjectKyYf.num = this.inputModelData.realpiece;
    break;
    case "票":
          //console.log('2')
          this.curObjectKyYf.num = "1";
          break;
          case "计重":
          this.curObjectKyYf.num = this.inputModelData.jfweight||0
          break;
          case "结算重量":
          this.curObjectKyYf.num =this.inputModelData.accountweightout;
          break;
          case "毛重":
          this.curObjectKyYf.num = (this.inputModelData.zddrstatus=='2'?Number(this.inputModelData.zdweight).toFixed(2):Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2))||0
          break;
          case "分运单票数":
       // console.log('1')
       this.curObjectKyYf.num = this.inputModelData.hawbnum||0
       break;
       case "总运单票数":
       // console.log('1')
       this.curObjectKyYf.num = 1;
       break;
       case "总运单件数":
       // console.log('1')
       this.curObjectKyYf.num = this.inputModelData.realpiece;
       break;
     }
   },
   "curObjectKyYs.wagetype"(val) {
    if (
      (this.mawbCharge[this.modCostIndex] &&
        this.mawbCharge[this.modCostIndex].wagetype) == val
      ) {
      return;
  }
  switch (val) {
    case "箱":
    this.curObjectKyYs.num = this.inputModelData.realpiece;
    break;
    case "票":
    this.curObjectKyYs.num = "1";
    break;
    case "计重":
    this.curObjectKyYs.num=this.inputModelData.jfweight||0
    // this.curObjectKyYs.num = computedWeight(
    //   this.inputModelData.realvolume,
    //   this.inputModelData.realweight
    //   );
    break;
    case "结算重量":
    this.curObjectKyYs.num =this.inputModelData.groupid<0?this.inputModelData.accountweightin:this.childData.accountweightin;
    break;
    case "毛重":
    this.curObjectKyYs.num = (this.inputModelData.zddrstatus=='2'?Number(this.inputModelData.zdweight).toFixed(2):Number(this.inputModelData.bgweight?this.inputModelData.bgweight:this.inputModelData.realweight).toFixed(2))||0
    break;
    case "分运单票数":
    this.curObjectKyYs.num = this.inputModelData.hawbnum||0
    break;
    case "总运单票数":
       // console.log('1')
       this.curObjectKyYs.num = 1;
       break;
       case "总运单件数":
       // console.log('1')
       this.curObjectKyYs.num = this.inputModelData.realpiece;
       break;
     }
   },
    // 吃泡
    'inputModelData.cp'(val){
      if(val&&val!=666666){
        //alert('1')
       if(this.switchWatch){
        if(Number(val)>100){
        this.inputModelData.cp=0
        this.$message.error('请输入0-100的数值')
        return
      }
      // 签单体积
      // var num=(this.inputModelData.signvolume-(this.inputModelData.zdweight*0.006))*(1-Number(val)/100)+(this.inputModelData.zdweight*0.006)
      // this.inputModelData.zdvolume=Number(parseInt(num*1000)/1000).toFixed(3)

      // this.inputModelData.jfweight=computedWeight(this.inputModelData.zdvolume,this.inputModelData.zdweight)

      // 实际体积
      var num=(this.inputModelData.realvolume-(this.inputModelData.zdweight*0.006))*(1-Number(val)/100)+(this.inputModelData.zdweight*0.006)
      this.inputModelData.zdvolume=Number(parseInt(num*1000)/1000).toFixed(3)

      this.inputModelData.jfweight=computedWeight(this.inputModelData.zdvolume,this.inputModelData.zdweight)
      this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)
      }
      }

    },
    accountweightin(val){
      console.log(!this.changeAccountWeight.accountweightin)
console.log(val)
console.log((Number(this.inputModelData.accountweightin)>0&&!this.changeAccountWeight.accountweightin)||this.yingshoustatus)
console.log(this.inputModelData.accountweightin)
      this.inputModelData.accountweightin=(Number(this.inputModelData.accountweightin)>0&&!this.changeAccountWeight.accountweightin)||this.yingshoustatus?Number(this.inputModelData.accountweightin):this.inputModelData.zddrstatus=='2'?Number(val).toFixed(0):'0'

     if(this.inputModelData.groupid>0){
        this.childrenList.forEach(i=>{
        i.accountweightin=Number(i.accountweightin)>0&&i.jgysischange=='2'?Number(i.accountweightin):Number(val).toFixed(0)
      })
      }


    },
    accountweightout(val){
     // console.log(this.mawbPayment)
      this.inputModelData.accountweightout=(Number(this.inputModelData.accountweightout)>0&&!this.changeAccountWeight.accountweightout)||this.yingfustatus?Number(this.inputModelData.accountweightout):this.inputModelData.zddrstatus=='2'?Number(val).toFixed(0):'0'

//console.log(this.inputModelData.accountweightout)
},
accountweightinZz(val){
  this.inputModelData.zzysweight=(Number(this.inputModelData.zzysweight)>0&&!this.changeAccountWeight.zzysweight)||this.yingshoutatus?Number(this.inputModelData.zzysweight):this.inputModelData.zddrstatus=='2'?Number(val).toFixed(0):'0'

       if(this.inputModelData.groupid>0){
        this.childrenList.forEach(i=>{
        i.zzysweight=Number(i.zzysweight)>0&&i.zzysischange=='2'?Number(i.zzysweight):Number(val).toFixed(0)
      })
      }
},
accountweightoutZz(val){
  console.log(val)
  console.log(Number(this.inputModelData.zzyfweight)>0&&!this.changeAccountWeight.zzyfweight)
  console.log(this.yingfustatus)
  this.inputModelData.zzyfweight=(Number(this.inputModelData.zzyfweight)>0&&!this.changeAccountWeight.zzyfweight)||this.yingfustatus?Number(this.inputModelData.zzyfweight):this.inputModelData.zddrstatus=='2'?Number(val).toFixed(0):'0'
},
    //制单代码
    // 'inputModelData.iszddl'(val){
    //   if(this.switchWatch){
    //     if(val=='1'){
    //       this.inputModelData.zddlcode='WFF/SHA'
    //     }else{
    //       this.inputModelData.zddlcode=""  
    //     }
    //   }
    // },
    //基港应收运价类型(改变运价类型将ALLIN匹配到费用ismodify改为2,并隐藏此费用isdel 2)
    'inputModelData.isinwageallin'(val){
      this.clearCost(1)
      if(val>0&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)){
        this.fareInputViewData.inwageallinprice.hidden=false
        if(this.switchWatch){
         this.inputModelData.inwageallinprice=''
         //this.dmfwf.pricein=0.4
       }
       this.mateCostList('1','2')
     }
   },
   //分单基港应收运价类型(改变运价类型将ALLIN匹配到费用ismodify改为2,并隐藏此费用isdel 2)
   'childData.isinwageallin'(val){
    this.clearCost(1)

    if(val>0){
      this.fareInputViewData.inwageallinprice.hidden=false
      if(this.switchHawb){
        this.childData.inwageallinprice=''
      }
      this.mateCostList('1','2')

    }
  },
    //基港应付运价类型
    'inputModelData.isoutwageallin'(val){
      this.clearCost(2)
      if(val>0){
       this.fareOutputViewData.outwageallinprice.hidden=false
       if(this.switchWatch){
        this.inputModelData.outwageallinprice=''
        //this.dmfwf.priceout=0.4
      }

      this.mateCostList('2','2')
    }
  },
    'inputModelData.outwageallinprice'(val,oldVal){//修改应付基港运价
      this.clearCost(2)

      //console.log(val)
      //console.log(Number(val).toFixed(2))
      //console.log(Number(oldVal).toFixed(2))
      if(this.switchWatch&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&val!='666666'){
       let costItem=this.mawbPayment.map(i=>{
        return i.items
      })
       if(val){
        this.handlePrice(costItem,'2',val)
        //console.log('331')
        //console.log(val)
    
        if(this.inputModelData.isinwageallin=='4'){
              //alert('2')
              var mawbItem=this.mawbCharge.map(i=>{

               return i.items


             })

              if(mawbItem.indexOf('航司运费')!='-1'){//如果有运费重新计算price
                var index=mawbItem.indexOf('航司运费')
                if(this.mawbCharge[index].ismodify=='2'){
                 this.mawbCharge[index].price=this.kyprice('1')
                 this.mawbCharge[index].leastwageall=Number(Number(this.mawbCharge[index].num)*Number(this.mawbCharge[index].price)).toFixed(2)
                 this.mawbCharge[index].wageall=Number(Number(this.mawbCharge[index].leastwageall)*Number(this.mawbCharge[index].changerate)).toFixed(2)
               }
              }else{//没有运费直接添加
                this.mawbCharge.unshift({
                  status:-1,
                  wageinout: '1',
                  wagedom:'航线',
                  ismodify: '2',
                  isdel: '1',
                  guid: '-1',
                  isallin: this.isAllinF('1','4'),
                  currency:'人民币',
                  items: '航司运费',
                  settname: getWtxmname(this.inputModelData.gid,1),
                  gid:this.inputModelData.gid,
                  wagetype: this.inputModelData.isoutwageallin=='2'?'票':'结算重量',
                  num: this.kynum('1','4',this.inputModelData.isoutwageallin=='2'?'票':'结算重量'),
                  price:this.kyprice('1'),
                  leastwageall:Number(Number(this.inputModelData.accountweightin)*Number(this.kyprice('1'))).toFixed(2),
                  wageall:Number(Number(this.inputModelData.accountweightin)*Number(this.kyprice('1'))).toFixed(2),
                  changerate: '1.0000',
                  remark: '',
                  isfree: '否',
                  sid: this.inputModelData.boguid,
                  servicecode:'OA0010',
                  parsid:this.inputModelData.boguid
                })
              }
              this.handlePrice(this.mawbCharge.map(i=>{

                return i.items
                
              }),'1',val)
              this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)  
            //   this.mawbCharge.forEach(item=>{
            //   if(item.items=='运费'&&item.ismodify=='2'){
            //     item.price=this.kyprice('1')
            //     item.leastwageall=Number(Number(item.num)*Number(item.price)).toFixed(2)
            //     item.wageall=Number(Number(item.leastwageall)*Number(item.changerate)).toFixed(2)
            //   }
            // })

          }
          this.$nextTick(()=>{
            this.handleDmCost('2',this.inputModelData.outwageallinclude.includes('4')?true:false)  
          })
          

        }else{
          this.mateCostList('2','2')
          if(this.inputModelData.isinwageallin=='4'){
            this.mateCostList('1','2')
          }
        }
      }



    },
    'childData.inwageallinprice'(val,oldVal){

      this.clearCost(1)

      if(this.switchHawb&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&val!='666666'){
        let costItem=this.mawbCharge.map(i=>{

          return i.items

        })
        if(val){
          if(this.childData.isinwageallin=='4'&&!this.childData.outwageallinprice){
            return
          }else{
            this.handlePrice(costItem,'1',val)
            this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)  
          }

        }else{
          this.mateCostList('1','2')
        }
      }
    },
    'inputModelData.inwageallinprice'(val,oldVal){
      //console.log(val)
      //console.log(Number(oldVal))
      this.clearCost(1)
       //console.log(this.modifyIndex)
       //console.log(this.switchWatch)
       //console.log(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))
       //console.log(oldVal)
       if(this.switchWatch&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)&&val!='666666'){
        //alert('1')
        let costItem=this.mawbCharge.map(i=>{

          return i.items

        })
        if(val){
          if(this.inputModelData.isinwageallin=='4'&&!this.inputModelData.outwageallinprice){
            return
          }else{
            this.handlePrice(costItem,'1',val)
            this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)  
          }

        }else{
          this.mateCostList('1','2')
        }
      }

    },
    'inputModelData.accountweightin':{//修改应收结算重量
      handler:function(val){
       
        this.clearCost(1)
        if(this.switchWatch&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)){
         this.handleCost('1',val)
         if(this.mawbCharge.filter(i=>i.items=='货站地面费'&&i.wagetype=='结算重量'&&i.ismodify=='2').length){
          this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['num']=Number(Number(val) * Number(this.dmfwf.pricein)) >= Number(this.dmfwf.min_price)?Number(val).toFixed(2):1

          this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['price']=Number(Number(val) * Number(this.dmfwf.pricein)) >= Number(this.dmfwf.min_price)?Number(this.dmfwf.pricein).toFixed(2):Number(this.dmfwf.min_price).toFixed(2)

         this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['leastwageall']=Number(Number(val) * Number(this.dmfwf.pricein)) >= Number(this.dmfwf.min_price) ? Number(Number(val) * Number(this.dmfwf.pricein)).toFixed(2) :Number(this.dmfwf.min_price).toFixed(2)

         this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['wageall']=(Number(this.mawbCharge.filter(i=>i.items=='货站地面费')[0]['leastwageall'])*Number(this.dmfwf.changeratein)).toFixed(2)
         
         }


       }



     },
     immediate:true,
     deep:true

   },
  'childData.accountweightin':{//修改应收结算重量
    handler:function(val){
      this.clearCost(1)
      if(this.switchHawb){
        //alert('1')
       this.handleCost('1',val)
       this.handleDmCost('1',this.inputModelData.inwageallinclude.includes('4')?true:false)
     }
   },
   immediate:true,
   deep:true

 },
    'inputModelData.accountweightout':{//修改应付结算重量
      handler:function(val){
        this.clearCost(2)
        if(this.switchWatch){
          this.handleCost('2',val)
        }




      },
      immediate:true,
      deep:true
    },
    'inputModelData.isoutwageallin_trans'(val){
      this.clearCost(2)
      //console.log(this.switchWatch)
      if(this.switchWatch){
        //alert('1')
        this.mateZzCostList('2',val)
      }
      if(val>0){
       this.fareOutputViewData.outwageallinprice_trans.contentStyle.opacity='1'
     }

   },
   'inputModelData.isinwageallin_trans'(val){
    if(val&&val!='-1'){
          this.clearCost(1)
    if(this.switchWatch&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)){

     this.mateZzCostList('1',val)
   }
   if(val>0){
    this.fareInputViewData.inwageallinprice_trans.contentStyle.opacity='1'
  }
    }

},
'childData.isinwageallin_trans'(val){
  if(val&&val!='-1'){
      this.clearCost(1)
  if(this.switchHawb){

   this.mateZzCostList('1',val)
 }
 if(val>0){
  this.fareInputViewData.inwageallinprice_trans.contentStyle.opacity='1'
}
  }



},

'inputModelData.outwageallinprice_trans'(val,oldVal){
      //console.log(val)
      //console.log(this.switchWatch)
      if(val&&val!='666666'){
       this.clearCost(2)

       if(this.switchWatch&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&(this.mawbPayment.filter(i=>{return i.items=='航司中转费'}).length>0&&(this.mawbPayment.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus=='--'||!this.mawbPayment.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus)||!this.mawbPayment.filter(i=>{return i.items=='航司中转费'}).length)){
        this.handleZzPrice('2',val)
      }


    }else if(!val){
      if(this.switchWatch&&this.mawbPayment.filter(i=>{return i.items=='航司中转费'}).length){
        this.mawbPayment=this.mawbPayment.filter(i=>{return i.items!='航司中转费'})
      }
    }



  },

  'inputModelData.inwageallinprice_trans'(val,oldVal){
   if(val&&val!='666666'&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)){
     this.clearCost(1)
     if(this.switchWatch&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&(this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length>0&&(this.mawbCharge.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus=='--'||!this.mawbCharge.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus)||!this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length)){

      this.handleZzPrice('1',val)
    }
  }else if(!val){
      if(this.switchWatch&&this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length){
        this.mawbCharge=this.mawbCharge.filter(i=>{return i.items!='航司中转费'})
      }
    }



},
'childData.inwageallinprice_trans'(val,oldVal){
 if(val&&val!='666666'){
   this.clearCost(1)
   if(this.switchHawb&&(Number(val).toFixed(2)!=Number(oldVal).toFixed(2))&&(this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length>0&&(this.mawbCharge.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus=='--'||!this.mawbCharge.filter(i=>{return i.items=='航司中转费'})[0].confirmstatus)||!this.mawbCharge.filter(i=>{return i.items=='航司中转费'}).length)){
    this.handleZzPrice('1',val)
  }
}
},

'inputModelData.zzysweight'(val){
  this.clearCost(1)
  if(this.switchWatch&&this.mawbCharge&&(this.inputModelData.iscomboine!='1'||this.inputModelData.iscomboine=='1'&&this.childData.boguid!=this.inputModelData.boguid)){
    this.mawbCharge.forEach(i=>{        
     if(i.items=='航司中转费'&&this.inputModelData.isinwageallin_trans=='1'&&(i.confirmstatus=='--'||!i.comfirmstatus)){
              i.num=Number(val).toFixed(2)
              i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)
              i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
            }

          })
  }
},
'childData.zzysweight'(val){
          //console.log(val)
          this.clearCost(1)
          if(this.switchHawb&&this.mawbCharge){
//alert('1')
            this.mawbCharge.forEach(i=>{

             if(i.items=='航司中转费'&&this.childData.isinwageallin_trans=='1'&&(i.confirmstatus=='--'||!i.comfirmstatus)){
               i.num=Number(val).toFixed(2)
               i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)
               i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
             }

           })
          }
        },
        'inputModelData.zzyfweight'(val){

          this.clearCost(2)
          if(this.switchWatch&&this.mawbPayment){
            this.mawbPayment.forEach(i=>{

             if(i.items=='航司中转费'&&this.inputModelData.isoutwageallin_trans=='1'&&(i.confirmstatus=='--'||!i.comfirmstatus)){
               i.num=Number(val).toFixed(2)
               i.leastwageall=Number(i.num*Number(i.price)).toFixed(2)
               i.wageall=Number(i.leastwageall*Number(i.changerate)).toFixed(2)
             } 

           })
          }
        },

        smallCostDataYs:{
          handler(val){
           if(this.switchZaFei){
             var itemList=this.mawbCharge.map(i=>{

               return i.items

             })
             val.forEach(i=>{
              if(i.checked){
                if(itemList.indexOf(i.items)=='-1'){
                  this.mawbCharge.push({
                    wageinout: '1',
                    wagedom:'航线',
                    ismodify: '2',
                    isdel: '1',
                    guid: '-1',
                    isallin:'2',
                    currency: i.currency,
                    items: i.items,
                    settname: this.inputModelData.wtxmname,
                    gid: this.inputModelData.gid,
                    wagetype: i.itemstype_in,
                    num: Number(i.min_price) <= Number(Number(this.getTypeNum(i.itemstype_in, '1')) * Number(i.price)) ? this.getTypeNum(i.itemstype_in, '1') : Number(Number(i.min_price) / Number(i.price)).toFixed(2),
                    price: i.price,
                    leastwageall: Number(Number(this.getTypeNum(i.itemstype_in, '1')) * Number(i.price)) >= Number(i.min_price) ? Number(Number(this.getTypeNum(i.itemstype_in, '1')) * Number(i.price)).toFixed(2) : Number(i.min_price).toFixed(2),
                    wageall: Number(Number(this.getTypeNum(i.itemstype_in, '1')) * Number(i.price)) >= Number(i.min_price) ? Number(Number(this.getTypeNum(i.itemstype_in, '1')) * Number(i.price) * Number(getChangeRate(i.currency))).toFixed(2) : Number(Number(i.min_price) * Number(getChangeRate(i.currency))).toFixed(2),
                    changerate: getChangeRate(i.currency),
                    remark: '',
                    isfree: '否',
                    sid: this.inputModelData.groupid<0?this.inputModelData.boguid:this.childData.boguid,
                    servicecode:i.servicecode,
                    parsid:this.inputModelData.boguid
                  })
                }else{
                  if(this.inputModelData.groupid<0){
                    this.mawbCharge[itemList.indexOf(i.items)].isdel=1
                  }else{
                    this.mawbCharge[itemList.indexOf(i.items)].isdel=1
                  }

                }
              }else{
            // if(itemList.indexOf(i.items)!='-1'){
            //   this.mawbCharge.splice(itemList.indexOf(i.items),1)
            // }
            //this.mawbCharge=this.mawbCharge.filter(i2=>{return i2.items!=i.items})
            if(itemList.indexOf(i.items)!='-1'&&i.id){
              //alert('1')
              if(this.inputModelData.groupid<0){
                this.mawbCharge[itemList.indexOf(i.items)].isdel=2
              }else{
                this.mawbCharge[itemList.indexOf(i.items)].isdel=2
              }
              //this.mawbCharge[itemList.indexOf(i.items)].isdel=2
            }else if(itemList.indexOf(i.items)!='-1'&&!i.id){
              //alert('2')
              //this.mawbPayment[itemList.indexOf(i.items)].isdel=1
              this.mawbCharge=this.mawbCharge.filter(i2=>{

                return i2.items!=i.items

                
              })
            }
          }
        })
           }

         },
         immediate:true,
         deep:true
       },
       smallCostDataYf:{
        handler(val){
      //console.log(val)
      if(this.switchZaFei){
       var itemList=this.mawbPayment.map(i=>{return i.items})
       val.forEach(i=>{
        if(i.checked){
          if(itemList.indexOf(i.items)=='-1'){
            this.mawbPayment.push({
              wageinout: '2',
              wagedom:'航线',
              ismodify: '2',
              isdel: '1',
              guid: '-1',
              isallin:'2',
              currency: i.currency,
              items: i.items,
              settname: getGysname(this.inputModelData.mawbgid,1)||this.inputModelData.gysname,
              gid: this.inputModelData.mawbgid,
              wagetype: i.itemstype_out,
              num: Number(i.min_price) <= Number(Number(this.getTypeNum(i.itemstype_out, '2')) * Number(i.price)) ? this.getTypeNum(i.itemstype_out, '2') : Number(Number(i.min_price) / Number(i.price)).toFixed(2),
              price: i.price,
              leastwageall: Number(Number(this.getTypeNum(i.itemstype_out, '2')) * Number(i.price)) >= Number(i.min_price) ? Number(Number(this.getTypeNum(i.itemstype_out, '2')) * Number(i.price)).toFixed(2) : Number(i.min_price).toFixed(2),
              wageall: Number(Number(this.getTypeNum(i.itemstype_out, '2')) * Number(i.price)) >= Number(i.min_price) ? Number(Number(this.getTypeNum(i.itemstype_out, '2')) * Number(i.price) * Number(getChangeRate(i.currency))).toFixed(2) : Number(Number(i.min_price) * Number(getChangeRate(i.currency))).toFixed(2),
              changerate: getChangeRate(i.currency),
              remark: '',
              isfree: '否',
              status:-1,
              sid: this.inputModelData.boguid,
              servicecode:i.servicecode
            })
          }else{
              //console.log('true')

              this.mawbPayment[itemList.indexOf(i.items)].isdel=1
               //console.log(this.mawbPayment[itemList.indexOf(i.items)].isdel)
             }
           }else{
           // console.log(itemList.indexOf(i.items))
           if(itemList.indexOf(i.items)!='-1'&&i.id){
            this.mawbPayment[itemList.indexOf(i.items)].isdel=2
              //console.log('false')
            }else if(itemList.indexOf(i.items)!='-1'&&!i.id){
              this.mawbPayment=this.mawbPayment.filter(i2=>{return i2.items!=i.items})
            }
          }
        })
     }

   },
   immediate:true,
   deep:true
 },

    // 'inputModelData.outwageallinprice_trans'(val){

    // },
  }

}

</script>

<style lang="less" scoped>
  // 公共
   .color(@color){
     color:@color;
     font-weight:bold;
    }
  // 自定义
  .totalTopInfo{
    height:32px;
    border-bottom:1px solid #e8e8e8;
    padding-bottom:10px;
    margin-top:20px;
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


      .detail {
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
    }

    /deep/.el-form-item__content{
      width:60px;
    }
  }
  .el-tabs--border-card>.el-tabs__header{
    background:#f8f8f8;
  }
  

   .zdInfo{
  h3{font-size: 18px;color: #004d84;}
  .el-dialog__body{padding:8px 40px;}
  .orderNo{
    margin-top:12px;padding-bottom:10px;font-size:13px;margin-bottom:12px;
    &:after{
      content:'';display:block;clear:both
    }
  }
  li{
    margin-bottom:8px;
    .modreal{
      margin-left:8px;
    }
    .modTitle{
      display:inline-block;
      width:120px;
      text-align:right;
    }
    .el-input{
    width:150px;
    input{
    background:#fff8ef;
    width:150px;
    }
   }
  }
}
.sizeDialogClass {
  h3 {
    color: #0f5a8c;
    font-weight: bolder;
    margin-top: -25px;
  }
  h4 {
    margin-top: 10px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 15px;
    .sizeLeft {
      float: left;
      display: inline-block;
    }
    .sizeRight {
      float: right;
      display: inline-block;
      background: #e8eef5;
      border-radius: 20px;
      color: #517da3;
      padding: 2px;
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
    }
  }
  .info {
    width: 900px;
    min-height: 50px;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    padding: 12px;
    margin-top: 10px;
    letter-spacing: 0.1em;
    table {
      table-layout: fixed;
      width: 900px;

      td {
        width: 400px;
      }
    }
  }
}
.el-form-item__label{
  width:100px!important;
  padding-right:8px;
}
/deep/.zdPane{
.width90 .el-form-item__label{
  width:90px!important;
}
}
</style>
