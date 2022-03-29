<template>
  <div class="costDetail">
<!-- {{ordertype}}
{{commitstatus}} -->
<!-- {{applyCost}} -->

 <div>
     <infoList :inputModelData="allmaindata" v-if="allmaindata.guid" name="详细"></infoList>

          <div style="height:32px;line-height:32px;margin-bottom:10px;margin-top:10px;">
        <p>

         <span style="float:left">

         	<el-button @click="applyPass('500')" type="primary" :disabled="logActive!=mawbApplyCost.length-1" v-if="ordertype=='sale'">审批通过</el-button>
         	<el-button @click="applyBack" type="primary" :disabled="logActive!=mawbApplyCost.length-1" v-if="ordertype=='sale'">审批驳回</el-button>

          <el-button type="primary" v-if="ordertype=='czz'&&committype=='申请中'" @click="cancelApply">撤销申请</el-button>
        <!-- <el-button type="primary" style="margin-right:8px" @click="submit(800)" :disabled="Number(mawbInformation.wageconfirmstatus) < 700" v-if="(Number(mawbInformation.wageconfirmstatus) < 800||!mawbInformation.wageconfirmstatus)&&!isFromFob&&((Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0))">提交结算</el-button>

          <el-button type="primary"  @click="submit(700)" :disabled="mawbInformation.wageconfirmstatus > 800" v-if="(Number(mawbInformation.wageconfirmstatus) >= 800)&&!isFromFob&&((Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0))">取消结算</el-button>

           <el-button type="primary" style="margin-right:8px" @click="submit(1100)" v-if="(Number(mawbInformation.wageconfirmstatus) < 1100)&&!isFromFob&&((Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0))" :disabled="Number(mawbInformation.wageconfirmstatus) < 700">提交并审单</el-button>

          <el-button type="primary"  @click="submit(800)" v-if="(Number(mawbInformation.wageconfirmstatus)== 1100)&&!isFromFob&&((Number(orderguid)>0&&profitmode.indexOf('利润')==-1)||(Number(orderguid)<0))" :disabled="Number(mawbInformation.wageconfirmstatus)>=1200">取消审单</el-button> -->


        </span>

        <span style="float:right;margin-right:10px;">

<!--         <el-button type="primary" v-if="orderguid>0&&applyCost&&!applyModel" @click="applyStart" :disabled="commitstatus=='100'">
            申请模式
        </el-button>

        <el-button type="primary" v-if="orderguid>0&&applyCost&&applyModel" @click="cancelApply" :disabled="commitstatus=='100'">
            取消申请
        </el-button>


         <el-button type="primary" v-if="orderguid>0&&applyCost" @click="finishApply" :disabled="commitstatus=='100'">申请完成</el-button> -->
<setBhicon></setBhicon>
          <el-switch
  v-model="lineshu"
  inactive-color="#009900"
   active-color="#ff4949"
  :active-text="titleBj"
  v-if="!isFromFob"
  >
</el-switch>

        </span>


        </p>

      </div>

      <div style="height:58px;margin-top:20px;margin-bottom:20px;">
      <div style="float:left">
        <span :style="{'width':'136px','display':'inline-block','border':'1px solid #e8e8e8','border-radius':'8px','margin-right':'8px','background':logActive==index?'#0d4c77':'','height':'58px','color':logActive==index?'#fff!important':'','padding':'8px','cursor':'pointer'}" v-for="(item,index) in mawbApplyCost" @click="logActiveClick(index)">
        	<p style="margin-bottom:5px;">
                    <span class="left" :style="{'color':logActive==index?'#fff':'#999'}">申请人</span>
                    <span class="right" :style="{'color':logActive==index?'#fff':'#000'}" style="float:right">{{item.commitman}}</span>
                  </p>
                  <p class="time" :style="{'color':logActive==index?'#fff':'#000'}">
                    <span class="left">{{item.commitdate.split(' ')[0].replace(/(-)/g, '.')}}</span>
                    <span class="right" style="float:right">{{item.commitdate.split(' ')[1].substring(0,5)}}</span>
                  </p>

        </span>
      </div>
      <!-- <div style="float:right;color:#000">
         <div style="margin-bottom:4px">
         	<span style="width:12px;height:12px;background:#5CC85C;display:inline-block;vertical-align:baseline"></span>
         	修改过的内容
         </div>
         <div style="margin-bottom:4px">
         	<span style="width:12px;height:12px;background:#F7A6A6;display:inline-block;vertical-align:baseline"></span>
         	新增的内容
         </div>
         <div>
         	<span style="width:12px;height:12px;background:#BABABA;display:inline-block;vertical-align:baseline"></span>
         	删除的内容
         </div>
      </div> -->
      </div>

  </div>



<div v-if="!lineshu">

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid #00cc00;background:#f8f8f8;padding-left:16px;">

  <div style="float:left;margin-right:16px;letter-spacing:0.1em">
    <span style="color:#00cc00;font-weight:bold;">总应收:</span>
    <span v-for="(item,index) in currencyCost.charge" :style="{'color':'#00CC00','margin-left':index>0?'15px':'','font-weight':'bold'}">
    <span style="margin-right:8px;">{{item.currencyFh}}</span>
    <span :title="item.currency">{{item.money}}</span>
    </span>
  </div>
     <span style="float:right;color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;margin-left:12px;margin-right:8px;">平均每公斤毛利:￥{{Number(mawbInformation['accountweightin'])=='0'?'0.00':Number(Number(zdtotalCharge-zdtotalPayment)/Number(mawbInformation['accountweightin'])).toFixed(2)}}</span>
     <span v-if="!isFromFob" style="float:right;color:orange;font-weight:bold;letter-spacing:0.1em;font-size:14px;">折合人民币盈利:￥{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>

  </div>


    <div class="detail mawbCharge detailPaneYoung">
      <el-row class="detail-title">
      <el-col :span="3" >
        <p @click="handleSettname(1,'')">应收费用总览</p>

        </el-col>


        <el-col :span="yingshouStr.length>0?21:21" style="font-size:12px;font-weight:bold;letter-spacing:0.1em;text-indent:0">


              <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-left" style="margin-right:-8px;" @click="changeDirectionAcn(1,1)"></i>
             </div>
             <div style="width:94%;overflow:hidden;display:inline-block" class="wrapSetname">
               <div style="width:10000px" class="setnameAll">
                 <span style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap" v-for="(item,index) in yssettname" @click="handleSettname(1,item.gid,index)" :class="[activeSettnameYs==item.gid&&item.status=='700'?'activeset':activeSettnameYs==item.gid?'activesetUc':'']" :style="{'background':item.status=='700'?'#4c738d':'','border-radius':'32px','color':item.status=='700'?'#fff':'#999'}" :title="item.settname">
                 <!-- <i class="el-icon-circle-check" v-if="item.status=='700'" style="font-size:14px;"></i> -->
                 {{item.settname}}
                 </span>
               </div>
             </div>
             <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-right" @click="changeDirectionAcn(2,1)" ></i>
             </div>
        </el-col>

        <el-col :span="!isFromFob?(yingshouStr.length>0?6:6):6" style="font-size:12px;font-weight:normal;text-align:right;">

    <!--     <span  style="float:right;margin-top:-1px;">
        <el-button type="primary" size="mini" :disabled="!((!allysConfirm)&&allysUconfirm)" @click="confirmButton('1','700','all')" :style="{'background':!(!allysConfirm&&allysUconfirm)?'#ccc':'#00cc00','border-radius':'0','height':'32px','letter-spacing':'0.1em','font-weight':'bold','border-radius':'3px'}" >应收总确认</el-button>
        <el-button type="primary" size="mini" :disabled="!(!allysUconfirm)" @click="confirmButton('1','1','all')" :style="{'background':!(!allysUconfirm)?'#ccc':'#00cc00','border-radius':'0','height':'32px','letter-spacing':'0.1em','font-weight':'bold','border-radius':'3px'}">应收总取消</el-button>
     </span>
              -->

        </el-col>
      </el-row>
      <div class="detail-c">
       <el-row style="line-height:30px;">

        </el-row>


        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="position:relative;margin-top:26px;" :tableIndex="0" v-if="mawbCharge" :colorIndex="modCostIndex" :className="modCostIndex" :wagetype="wagetype">

            <template slot="content" >
            <div style="position:absolute;top:-28px">
             <span style="color:#00cc00;font-weight:bold;margin-right:30px">总应收:</span>
             <span v-for="(item,index) in currentGidCost.charge" :style="{'color':'#00CC00','margin-left':index>0?'15px':'','font-weight':'bold'}">
             <span style="margin-right:8px;">{{item.currencyFh}}</span>
             <span :title="item.currency">{{Number(item.money).toFixed(2)}}</span>
             </span>
           </div>
<!--            <div style="position:absolute;top:-36px;right:0">
           <el-button type="primary" size="mini" :disabled="yingShouDA()" @click="delAllYsCost" style="display:none">应收费用批量删除</el-button>
             <el-button type="primary" size="mini"  :disabled="ysConfirm||((orderguid!=''&&orderguid>0)&&(profitmode!=''&&profitmode.indexOf('利润')!=-1))" @click="confirmButton(1,700)" style="height:28px;line-height:13px;" v-if="activeSettnameYs!=''||activeSettnameYs!=0">应收确认并审单</el-button>
             <el-button type="primary" size="mini"  :disabled="ysUconfirm" @click="confirmButton(1,1)" style="height:28px;line-height:13px;" v-if="activeSettnameYs!=''||activeSettnameYs!=0">取消确认</el-button><el-button type="primary" size="mini"  @click="recon('1')" :disabled="ysDz" style="height:28px;line-height:13px;" v-if="!isFromFob">对账</el-button>
           </div> -->
            </template>

<!--             <template slot="firstTd" slot-scope="props">

            <td>
               <i><el-checkbox  title='全选' v-model="wageCostAllYs" :disabled="allYsDisabled" @change="wageCostAllYsF" v-if="activeSettnameYs==0||activeSettnameYs==''"></el-checkbox></i>
              <i class="icon-save" @click="addCost(1,1)" :class="[disabledAdd('1')?'disabled':'']"></i>
              <i class="el-icon-close" @click="delCurCost(1,1)"></i>
            </td>
            <td>
              <input type="checkbox" v-model="curObjectKyYs.isfree" >
            </td>

            <td>
              {{curObjectKyYs.confirmstatus!='--'&&curObjectKyYs.confirmstatus?curObjectKyYs.confirmstatus:'--'}}
            </td>

            <td>
                 <el-select v-model="curObjectKyYs.otherno" style="width:150px;" >

                  <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                  </el-option>

              </el-select>
            </td>

            <td style="display:inline-flex;border:none;width:100%">
              <page-select :modelval.sync="curObjectKyYs.gid" :pagetype="2" @change="getYsSettname" :disabled="curObjectKyYs.disabled" :area="mawbInformation.area"> </page-select>
            </td>

            <td>
              <page-select :modelval.sync="curObjectKyYs.items" :pagetype="5" ></page-select>


            </td>

            <td>
             <el-select v-model="curObjectKyYs.wagetype"  style="width:130px;" >

                  <el-option v-for="(item, index) in jsfs" :value="item.typename" :label="item.typename" :key="index"></el-option>
              </el-select>
            </td>

            <td>
            <el-input v-model="curObjectKyYs.num" style="width:100px;" @blur="yanzhenzzF('1','1','num')" ></el-input>
            </td>


            <td>
            <el-input v-model="curObjectKyYs.price" style="width:100px;" @blur="yanzhenzzF('1','1','price')" ></el-input>
            </td>


            <td>
            <el-select v-model="curObjectKyYs.currency"  style="width:100px;" >

                  <el-option v-for="(item,index) in currencyList"
                  :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
            </td>

            <td>
             <el-input v-model="curObjectKyYs.leastwageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="curObjectKyYs.wageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="zdysChangeRate" style="width:100px;" :disabled="true"></el-input>
            </td>
             <td>
             <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
            </td>

            </template> -->

<!-- <template slot="operate" slot-scope="props">
  <i><el-checkbox v-model="wageguids" :label="props.data.row.guid" @change="ysfConfirmCheck('1',props.data.row.guid,props.data.row.confirmstatus,props.data)" :disabled="mawbInformation.wageconfirmstatus>700||props.data.row.disabled" title='选择费用'></el-checkbox></i>
<i class="el-icon-setting" @click="modCost(props.data.index,1,1)" :class="[disabledEdit('1',props.data.row)?'disabled':'']" title="修改费用"></i>
<i class="el-icon-delete" @click="delCost(props.data.index,1,1)" :class="[showUconfirmF('1',props.data.row)?'disabled':'']" title="删除费用"></i>
</template> -->
        </commonTable>
      </div>
    </div>








    <div class="detail mawbPayment detailPaneRed costTable1" v-if="!isFromFob">

  <div style="padding-bottom:8px;border:1px solid #e4e7ed;height:32px;line-height:30px;margin-bottom:12px;border-left:2px solid red;background:#f8f8f8;padding-left:16px;">

  <div style="float:left;margin-right:16px;letter-spacing:0.1em">
    <span style="color:red;font-weight:bold;">总应付:</span>
             <span v-for="(item,index) in currencyCost.payment" :style="{'color':'red','margin-left':index>0?'15px':'','font-weight':'bold'}">
             <span style="margin-right:8px;">{{item.currencyFh}}</span>
             <span :title="item.currency">{{item.money}}</span>
             </span>

  </div>


  </div>

      <el-row class="detail-title">
         <el-col :span="3">
        <p @click="handleSettname(2,'')">应付费用总览</p>
        </el-col>
        <el-col :span="yingfuStr.length>0?21:21" style="font-size:12px;font-weight:bold;letter-spacing:0.1em;text-indent:0">
            <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">
               <i class="el-icon-caret-left" style="margin-right:-8px;" @click="changeDirectionAcn(1,2)"></i>

             </div>
          <div style="width:94%;overflow:hidden;display:inline-block" class="wrapSetname">
               <div style="width:10000px" class="setnameAllf">
                 <span style="width:160px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap" v-for="(item,index) in yfsettname" @click="handleSettname(2,item.gid,index)" :class="[activeSettnameYf==item.gid&&item.status=='700'?'activeset':activeSettnameYf==item.gid?'activesetUc':'']" :style="{'background':item.status=='700'?'#4c738d':'','border-radius':'32px','color':item.status=='700'?'#fff':'#999'}" :title="item.settname">
                 <!-- <i class="el-icon-circle-check" v-if="item.status=='700'" style="font-size:14px;"></i> -->
                 {{item.settname}}
                 </span>
               </div>
             </div>

             <div style="width:2%;display:inline-block;vertical-align:top;font-size:18px;color:#999" class="arrow">

               <i class="el-icon-caret-right" @click="changeDirectionAcn(2,2)"></i>
             </div>

        </el-col>



        <el-col :span="yingfuStr.length>0?6:6" style="font-size:12px;font-weight:normal;text-align:right;">
<!-- <span  style="float:right;margin-top:-1px;">
        <el-button type="primary" size="mini" :disabled="!(!allyfConfirm&&allyfUconfirm)"  @click="confirmButton('2','700','all')" :style="{'background':!(!allyfConfirm&&allyfUconfirm)?'#ccc':'red','height':'32px','letter-spacing':'0.1em','font-weight':'bold','border-raduis':'3px'}">应付总确认</el-button>
        <el-button type="primary" size="mini" :disabled="!(!allyfUconfirm)" @click="confirmButton('2','1','all')" :style="{'background':!(!allyfUconfirm)?'#ccc':'red','height':'32px','letter-spacing':'0.1em','font-weight':'bold','border-raduis':'3px'}">应付总取消</el-button>
     </span>  -->


        </el-col>
      </el-row>
      <div class="detail-c">




        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbPayment" style="margin-top:26px;position:relative" :tableIndex="1" v-if="mawbPayment" :colorIndex="modCostIndex" :wagetype="wagetype">

  <template slot="content">
            <div style="position:absolute;top:-28px;">
             <span style="color:red;font-weight:bold;margin-right:30px">总应付:</span>
             <span v-for="(item,index) in currentGidCost.payment" :style="{'color':'red','margin-left':index>0?'15px':'','font-weight':'bold'}">
             <span style="margin-right:8px;">{{item.currencyFh}}</span>
             <span :title="item.currency">{{Number(item.money).toFixed(2)}}</span>
             </span>
           </div>
<!--            <div style="position:absolute;top:-36px;right:0">

             <el-button type="primary" size="mini" :disabled="yfConfirm" @click="confirmButton(2,700)" style="height:28px;line-height:13px;" v-if="activeSettnameYf!=''||activeSettnameYf!=0">应付确认并审单</el-button>
            <el-button type="primary" size="mini"  :disabled="yfUconfirm" @click="confirmButton(2,1)" style="height:28px;line-height:13px;" v-if="activeSettnameYf!=''||activeSettnameYf!=0">取消确认</el-button>
            <el-button type="primary" size="mini"  @click="recon('2')" :disabled="yfDz" style="height:28px;line-height:13px;display:none!important">对账</el-button>
           </div> -->
            </template>
<!--          <template slot="firstTd" slot-scope="props">

            <td>
              <i><el-checkbox  title='全选' v-model="wageCostAllYf" :disabled="allYfDisabled" @change="wageCostAllYfF" v-if="activeSettnameYf==0||activeSettnameYf==''"></el-checkbox></i>
              <i class="icon-save" @click="addCost(2,1)" :class="[disabledAdd('2')?'disabled':'']" ></i>
              <i class="el-icon-close" @click="delCurCost(2,1)"></i>
            </td>
            <td>
              <input type="checkbox" v-model="curObjectKyYf.isfree">
            </td>
             <td>
              {{curObjectKyYf.confirmstatus!='--'&&curObjectKyYf.confirmstatus?curObjectKyYf.confirmstatus:'--'}}
            </td>

            <td>
                 <el-select v-model="curObjectKyYf.otherno" style="width:150px;">

                  <el-option v-for="(item,index) in hawbList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                  </el-option>
              </el-select>
            </td>
            <td style="display:inline-flex;border:none;width:100%;">

                <page-select :modelval.sync="curObjectKyYf.gid" :pagetype="3" @change="getYfSettname" :disabled="curObjectKyYf.disabled" :area="mawbInformation.area"></page-select>
            </td>
            <td>

                 <page-select :modelval.sync="curObjectKyYf.items" :pagetype="5"></page-select>
            </td>
            <td>
             <el-select v-model="curObjectKyYf.wagetype" style="width:130px;">

                 <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
              </el-select>
            </td>
            <td>
            <el-input v-model="curObjectKyYf.num" style="width:100px;" @blur="yanzhenzzF('2','1','num')"></el-input>
            </td>
            <td>
            <el-input v-model="curObjectKyYf.price" style="width:100px;" @blur="yanzhenzzF('2','1','price')"></el-input>
            </td>
            <td>
            <el-select v-model="curObjectKyYf.currency" style="width:100px;">

                   <el-option v-for="(item,index) in currencyList"
                   :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
            </td>
            <td>
             <el-input v-model="curObjectKyYf.leastwageall" style="width:100px;" :disabled="true"></el-input>
            </td>

              <td>
             <el-input v-model="curObjectKyYf.wageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="zdyfChangeRate" style="width:100px;" :disabled="true"></el-input>
            </td>
             <td>
             <el-input v-model="curObjectKyYf.remark" style="width:100px;"></el-input>
            </td>

            </template>
        	<template slot="operate" slot-scope="props">
            <i><el-checkbox v-model="wageguidf" :label="props.data.row.guid" @change="ysfConfirmCheck('2',props.data.row.guid,props.data.row.confirmstatus,props.data.row.sid)" :disabled="mawbInformation.wageconfirmstatus>700||props.data.row.disabled" title='选择费用'></el-checkbox></i>
          <i class="el-icon-setting" @click="modCost(props.data.index,2,1)" :class="[disabledEdit('2',props.data.row)?'disabled':'']" title='修改费用'></i>
          <i class="el-icon-delete" @click="delCost(props.data.index,2,1)" :class="[showUconfirmF('2',props.data.row)?'disabled':'']" title='删除费用'></i></template> -->

        </commonTable>
      </div>
    </div>
</div>

<div v-if="lineshu&&!isFromFob" class="detailCost2">
<div class="lineYinFu">
   <el-row class="detail-title">
         <el-col :span="6">
        <p>空运应付费用</p>
        </el-col>

        <el-col :span="5" style="color:red;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">



        </el-col>


      </el-row>
      <div class="tableContent">
       <div :style="{'width':'540px','overflow':'auto','height':tableHeight}" v-scroll="onScroll" class="tableWrap">
       <div style="color:red;font-size:12px;font-weight:normal;font-weight:bold;height:42px;line-height:42px;">
       <span>总应付(折合人民币)：{{zdtotalPayment}}</span>

     </div>
       <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%','margin-top':'12px'}" >
         <tr style="height:32px;">
           <!-- <th width='80'>操作</th> -->
           <th width='50'>免</th>

            <th width='150'>结算对象</th>
           <th width='100'>服务项目</th>
            <th width='90'>数量</th>
           <th width='90'>单价</th>
           <th width='90'>币种</th>
           <th width='150'>金额(折合人民币)</th>
           <!-- <th width='80'>状态</th> -->


         </tr>

         <tr v-for="(item,index) in mawbPayment" :style="{'backgroundColor':item.isfree=='是'?'#e2fdde':item.background?item.background:'','height':'32px','color':index==modCostIndex&&wagetype=='2'?'#fff':''}">
           <!-- <td width='80'>
            <i class="el-icon-setting" @click="modCost(index,2,1,1)" :class="[disabledEdit('2',item)?'disabled':'']" style="font-size:16px;" title='修改费用'></i>
            <i class="el-icon-delete" @click="delCost(index,2,1)" :class="[showUconfirmF('2',item)?'disabled':'']" style="font-size:16px;" title='删除费用'></i>
           </td> -->
              <td width='50'>
           {{item.isfree}}
           </td>

           <td width='150' :title="item.settname">
             {{item.settname}}
           </td>
           <td width='100'>
             {{item.items}}
           </td>
             <td width='90'>
             {{item.num}}
           </td>
           <td width='90'>
             {{item.price}}
           </td>
           <td width='90'>
             {{item.currency}}
           </td>
           <td width='150'>
             {{item.wageall}}
           </td>
           <!-- <td width='80'>
             {{item.confirmstatus}}
           </td> -->



         </tr>
       </table>
       </div>
      </div>
</div>
<div class="lineYinShou">

      <el-row class="detail-title">
      <el-col :span="6">
        <p>空运应收费用</p>
        </el-col>

      </el-row>
      <div class="tableContent">
        <div :style="{'width':'540px','overflow':'auto','height':tableHeight}" v-scroll="onScroll" class="tableWrap">
        <div style="color:#00CC00;font-size:12px;font-weight:normal;font-weight:bold;height:42px;line-height:42px;">

        <span>总应收(折合人民币)：{{zdtotalCharge}}</span>


     </div>
       <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%','margin-top':'12px'}" >
         <tr style="height:32px;">
          <!--  <th width='80'>操作</th> -->
           <th width='50'>免</th>

            <th width='150'>结算对象</th>
           <th width='100'>服务项目</th>
            <th width='90'>数量</th>
           <th width='90'>单价</th>
           <th width='90'>币种</th>
           <th width='150'>金额(折合人民币)</th>
           <!-- <th width='80'>状态</th> -->


         </tr>

         <tr v-for="(item,index) in mawbChargeLine" :style="{'backgroundColor':item.isfree=='是'?'#e2fdde':item.background?item.background:'','color':index==modCostIndex&&wagetype=='1'?'#fff':''}"  style="height:32px;">
         <!--   <td width='80'>
            <span v-if="item.leastwageall">
            <i class="el-icon-setting" @click="modCost(index,1,1,1)" :class="[disabledEdit('1',item)?'disabled':'']" style="font-size:16px;" title='修改费用'></i>
            <i class="el-icon-delete" @click="delCost(index,1,1,'model')" :class="[showUconfirmF('1',item)?'disabled':'']" style="font-size:16px;" title='删除费用'></i>
            </span>

              <el-button style="width:100%;padding-left:8px;padding-top:5px;padding-bottom:5px;color:#0f5a8c;background:#f8f8f8;border:1px solid #e1e1e1" type="primary" @click="addCost(1,1,mawbPayment[index])" v-else>抄录应付</el-button>

           </td> -->
             <td width='50'>
           {{item.isfree}}
           </td>

           <td width='150' :title="item.settname">
             {{item.settname}}
           </td>
           <td width='100'>
             <span v-if="item.leastwageall">{{item.items}}</span>
           </td>
             <td width='90'>
             {{item.num}}
           </td>
           <td width='90'>
             {{item.price}}
           </td>
           <td width='90'>
             {{item.currency}}
           </td>
           <td width='150'>
             {{item.wageall}}
           </td>
            <!-- <td width='80'>
             {{item.confirmstatus}}
           </td> -->



         </tr>
       </table>
       </div>
      </div>
</div>
<div class="lineAllin">

<el-row class="detail-title">
      <el-col :span="6">
        <p>总盈利</p>
        </el-col>


      </el-row>



   <div class="tableContent">
         <div :style="{'width':'188px','overflow':'auto','height':tableHeight,'position':'relative'}">

         <p style="font-weight:bold;font-size:12px;color:#fff;background:orange;height:42px;line-height:42px;width:100%;">
            盈利(折合人民币):￥{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}
         </p>

         <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%','margin-top':'12px'}">
          <tr style="height:32px;">
          <th>差额(折合人民币)</th>
          </tr>
          <tr v-for="(item,index) in toolTip" style="height:32px;">
          <td v-if="item!='抄录应付'" :style="{'color':Number(item)<0?'red':Number(item)>0?'#00CC00':''}">

          {{item}}
          </td>
          <td v-else>

          </td>
          </tr>
         </table>

         </div>
    </div>

</div>

</div>


     <div class="footer">

      <div class="btn-c">
        <div class="right-btn">

        </div>
      </div>

    </div>


    <!-- 对账制作 -->
<!--    <el-dialog width="1260px"
  top="4%"
  center
  :visible.sync="showRecon"
  v-if="showRecon" append-to-body>

  <reconMngDetail :jobid="boguid" :wageinout="wageinout" :system="system" v-if="showRecon" @unVisible='showRecon=false' :area="mawbInformation.area" :selectgid="activeSettnameYs"></reconMngDetail>

  </el-dialog> -->


    <!-- 左右结构费用修改弹框应收 -->
   <el-dialog width="1300px"
  top="8%"
  center
  :visible.sync="yingshouMod"
  @close="yingshouMod=false;modCostIndex='-1'"
  v-show="yingshouMod" append-to-body>

  <commonTable class="commonTable" :head="mawb_table_model" style="margin-top:20px;" :tableIndex="0" v-if="yingshouMod">

            <template slot="firstTd" slot-scope="props">

            <td>
              <i class="icon-save" @click="addCost(1,1)" :class="[disabledAdd('1')?'disabled':'']"></i>
              <i class="el-icon-close" @click="delCurCost(1,1,1)"></i>
            </td>
            <td>
              <input type="checkbox" v-model="curObjectKyYs.isfree" >
            </td>

            <td>
              --
            </td>

          

            <td style="display:inline-flex;border:none;width:100%">
              <page-select :modelval.sync="curObjectKyYs.gid" :pagetype="2" @change="getYsSettname" :area="mawbInformation.area"> </page-select>
            </td>

            <td>
              <page-select :modelval.sync="curObjectKyYs.items" :pagetype="5" ></page-select>

            </td>

            <td>
             <el-select v-model="curObjectKyYs.wagetype"  style="width:130px;" >

                  <el-option v-for="(item, index) in jsfs" :value="item.typename" :label="item.typename" :key="index"></el-option>
              </el-select>
            </td>

            <td>
            <el-input v-model="curObjectKyYs.num" style="width:100px;" @blur="yanzhenzzF('1','1','num')" ></el-input>
            </td>


            <td>
            <el-input v-model="curObjectKyYs.price" style="width:100px;" @blur="yanzhenzzF('1','1','price')" ></el-input>
            </td>


            <td>
            <el-select v-model="curObjectKyYs.currency"  style="width:100px;" >

                  <el-option v-for="(item,index) in currencyList"
                  :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
            </td>

            <td>
             <el-input v-model="curObjectKyYs.leastwageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="curObjectKyYs.wageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="zdysChangeRate" style="width:100px;" :disabled="true"></el-input>
            </td>
              <td>
                <el-select v-model="curObjectKyYs.otherno" style="width:150px;">
              
                  <el-option v-for="(item,index) in hawbList" :key="index" :label="item.name" :value="item.name">
                  </el-option>
              
                </el-select>
              </td>

             <td>
             <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
            </td>
          </template>
            </commonTable>

  </el-dialog>

     <!-- 左右结构费用修改弹框应付 -->
   <el-dialog width="1300px"
  top="8%"
  center
  :visible.sync="yingfuMod"
  @close="yingfuMod=false;modCostIndex='-1'"
  v-show="yingfuMod" append-to-body>

  <commonTable class="commonTable" :head="mawb_table_model" style="margin-top:20px;" :tableIndex="0" v-if="yingfuMod">

            <template slot="firstTd" slot-scope="props">

             <td>
              <i class="icon-save" @click="addCost(2,1)" :class="[disabledAdd('2')?'disabled':'']"></i>
              <i class="el-icon-close" @click="delCurCost(2,1,1)"></i>
            </td>
            <td>
              <input type="checkbox" v-model="curObjectKyYf.isfree">
            </td>
             <td>
              --
            </td>

       
            <td style="display:inline-flex;border:none;width:100%;">


                <page-select :modelval.sync="curObjectKyYf.gid" :pagetype="3" @change="getYfSettname" :area="mawbInformation.area"></page-select>
            </td>
            <td>

                 <page-select :modelval.sync="curObjectKyYf.items" :pagetype="5"></page-select>
            </td>
            <td>
             <el-select v-model="curObjectKyYf.wagetype" style="width:130px;">

                 <el-option v-for="(item,index) in jsfs" :key="index" :value="item.typename" :label="item.typename"></el-option>
              </el-select>
            </td>
            <td>
            <el-input v-model="curObjectKyYf.num" style="width:100px;" @blur="yanzhenzzF('2','1','num')"></el-input>
            </td>
            <td>
            <el-input v-model="curObjectKyYf.price" style="width:100px;" @blur="yanzhenzzF('2','1','price')"></el-input>
            </td>
            <td>
            <el-select v-model="curObjectKyYf.currency" style="width:100px;">

                   <el-option v-for="(item,index) in currencyList"
                   :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
            </td>
            <td>
             <el-input v-model="curObjectKyYf.leastwageall" style="width:100px;" :disabled="true"></el-input>
            </td>

              <td>
             <el-input v-model="curObjectKyYf.wageall" style="width:100px;" :disabled="true"></el-input>
            </td>
            <td>
             <el-input v-model="zdyfChangeRate" style="width:100px;" :disabled="true"></el-input>
            </td>
                <td>
                  <el-select v-model="curObjectKyYf.otherno" style="width:150px;">
                
                    <el-option v-for="(item,index) in hawbList" :key="index" :label="item.name" :value="item.name">
                    </el-option>
                  </el-select>
                </td>
                
             <td>
             <el-input v-model="curObjectKyYf.remark" style="width:100px;"></el-input>
            </td>

          </template>
            </commonTable>

  </el-dialog>


<!-- 联系人弹框 -->
    <el-dialog width="500px"
  top="4%"
  center
  :visible.sync="showContact"
 @close="showContact = false;modCostIndex=-1"
 :close-on-click-modal=false
  v-if="showContact" append-to-body>
  <h3 style="font-size:16px;color:#004d84;margin-bottom:20px;margin-top:-10px;"><span v-if="methods=='PUT'">修改申请人</span><span v-else-if="methods=='POST'">新增申请人</span><span v-else="methods=='DELETE'">删除申请人</span></h3>
<page-select :modelval.sync="contact" :pagetype="9"></page-select>

  <el-input type="textarea" v-model="modifyReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" :placeholder="methods=='PUT'?'修改理由':methods=='POST'?'新增理由':'删除理由'"></el-input>

  <span slot="footer" class="dialog-footer" style="float:right;margin-top:-20px;">
    <el-button @click="showContact = false;modCostIndex=-1">取 消</el-button>
    <el-button @click="modCost2">确 定</el-button>
  </span>
  </el-dialog>

  <!-- 审批驳回 -->

  <el-dialog width="800px"
  top="4%"
  center
  :visible.sync="applyShow"
  v-if="applyShow" append-to-body
    @close="applyShow=false"
  custom-class="reason"
  >

        <div>

<div class="orderSystem-c">
      <h3>驳回原因</h3>
      <p class="orderNo">
        <span style="color:#004d84;float:left;font-weight:bold">{{mawbInformation.pono}}</span>
      </p>
      <ul>
        <li>总运单号</li>
        <li>始发港</li>
        <li>目的港</li>
        <li>实际件重体</li>
        <li>航班号</li>
        <li>航班日期</li>
      </ul>
      <ul style="margin-top:3px;">
        <li>{{mawbInformation.mawb}}</li>
        <li>{{mawbInformation.sfg}}</li>
        <li>{{mawbInformation.mdg}}</li>
        <li>{{mawbInformation.realtjz.split('/')[0]}}/{{mawbInformation.realtjz.split('/')[1]}}/{{mawbInformation.realtjz.split('/')[2]}}</li>
        <li>{{mawbInformation.hbh}}</li>
        <li>{{mawbInformation.hbrq.substring(0,10)}}</li>
      </ul>

      <el-input type="textarea" v-model="delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="工作号取消原因输入框"></el-input>

      <div class="costItems">
      <div  style="width:710px;overflow:hidden;display:inline-block" >
        <ul class="costItemsList" style="width:10000px;overflow:hidden;">
           <li v-for="(item,index) in applyCostData" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
           <el-badge is-dot class="item" v-if="item.delbillreason">{{item.items}}</el-badge>
           <span v-else>{{item.items}}</span>
           </li>
        </ul>
      </div>

        <div style="display:inline-block">
          <i class="el-icon-caret-left"  @click="changeDirection(1)"></i>
          <i class="el-icon-caret-right" @click="changeDirection(2)"></i>
        </div>

      </div>

      <div class="costItemsContent" style="margin-top:16px;">
        <ul>
        <li>人民币金额</li>
        <li>单价</li>
        <li>数量</li>
        <li>货币</li>
  </ul>
  <ul style="margin-top:3px;">
        <li>{{applyCostData[costItemsActive].leastwageall}}</li>
        <li>{{applyCostData[costItemsActive].price}}</li>
        <li>{{applyCostData[costItemsActive].num}}</li>
        <li>{{applyCostData[costItemsActive].currency}}</li>
  </ul>

  <el-input type="textarea" v-model="applyCostData[costItemsActive].delbillreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:8px;color:#c8c8c8" :placeholder="applyCostData[costItemsActive].items+'驳回原因输入框'"></el-input>

      </div>


</div>

     <p style="margin-top:18px;text-align:right">
       <el-button @click="applyPass('200')" type="primary">确定</el-button>
       <el-button @click="applyShow=false">取消</el-button>
     </p>
   </div>
  </el-dialog>



  </div>
</template>

<script>
import accountMake from './accountMake'
import reconMngDetail from './reconMngDetail'
import {getChangeRate,computedWeight,getMomentDate} from '../../api/localStorage.js'
export default {
  components: {
    accountMake,reconMngDetail
  },
  props: {
    mawbguid: {
      type: [Number, String],
      required: true
    },
    boguid:{
      type: [Number, String],
      required: true
    },
    pagetype:{
      type:[Number, String],
      default:1
    },
    inputModelData:{
      type:Object
    },
    isFromFob:String,
    jobid:String,

    area:String,
    gid:'',
    ordertype:String,
    committype:{
       type: [Number, String]
    }


  },
  data () {
    return {
      logActive:'-1',
      //wageguids:[],//费用确认应收勾选guid
      //wageguidf:[],//费用确认应付guid
      //cur_hawb: '',
      //curHawbGuid:'',
      zdtotalCharge:0,
      zdtotalPayment:0,
     // fdPayment:0,
      //allysConfirm:true,//false为显示
      //allysUconfirm:true,//false为显示
      //allyfConfirm:true,//false为显示
      //allyfUconfirm:true,//false为显示
      //ysConfirm:true,
      //ysUconfirm:true,
      //yfUconfirm:true,
      //yfConfirm:true,
      //ysDz:true,
      //yfDz:true,
      //showRecon:false,//对账弹框
     // wageinout:"",//对账传应收应付
     // ponolist:[],//订舱编号选项
      system:"空出",
      mawbInformation: {
        gid:'',
        pono: '',
        mawb: '',
        wtkhname:'',
        wtxmname:'',
        czlx:'',
        hwxz:'',
        hwlx:'',
        sfg: '',
        mdg: '',
        hbh: '',
        hbrq: '',
        ybtjz: '',
        realweight: '',
        accountweightin:'',
        accountweightout:'',
        realtjz: '',
        realjfweight:'',
        zdtjz: '',
        zdjfweight:'',
        isinwageallin:'',
        inwageallinprice:'',
        self_real_bp_freight_in:'',
        cus_real_bp_freight_in:''
        // hxzl: '',
        // hwstatus: '',
        // dzstatus: '',


        //hbzl: '',




        //ybtjz: '',

      },
      allmaindata:{},//主单详细
      translate_text: {
        wtkhname: '委托客户：',wtxmname: '项目：',pono: '订舱编号：',mawb: '总运单号：',hawb:'分运单号：',allpiece: '总件数：',allweight: '总重量：',allvolume: '总体积：',zdpiece: '制单件数：',zdweight: '制单重量：',zdvolume: '制单体积：',
        jfweight: '实际计费重量：',czlx: '配舱操作：',hwxz: '货物性质：',hwlx:'货物类型：',realweight: '报关重量：',hbzl: '航班种类：',
        hbh: '航班号：',hbrq: '航班日期：',sfg: '始发港：',mdg: '目的港：',zzg: '中转港：',ybtjz: '总单预报体/重/件：',zdtjz:'总单制单件重体：',accountweightin:'应收结算重量：',accountweightout:'应付结算重量：',realtjz:'实际件/重/体：',zdjfweight:'制单计费重量：',realjfweight:'实际计费重量：',isinwageallin:'应收运价类型：',inwageallinprice:'应收运费价格：',fpbl:'应收运费分泡比例：'
      },
      mawb_table_model: [
        {field: "isfree", title: "免"},
        // {field: "confirmstatus", title: "状态"},
		    // {field: "pono", title: "订舱编号"},
        {field: "settname", title: "结算对象"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "结算方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        { field: "otherno", title: "分运单号" },
        {field: "remark", title: "备注"}
      ],
      modCostIndex:'-1',

      mawbCharge: [],
      mawbChargeLine:[],
      toolTip:[],
      mawbPayment: [],
      mawbApplyCost:[],

      curObjectKyYs:{
         //isfree:{type:Boolean,default:false},
         num:'',
         price:'',
         currency:'人民币',
         otherno:'--',
          gid:''
      },
      curObjectKyYf:{
        num:'',
        price:'',
        currency:'人民币',
        otherno:'--',
        gid:''
      },
      curObjectFdYf:{
        num:'',
        price:'',
        currency:'人民币',
        gid:''
      },

      hawb_table_model: [
        {field: "isfree", title: "免"},
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
      hawb_data_list: {},
      // 订单号、分运单号
      ordernoList:[],
      hawbList:[{name:'--',id:'-1'}],
      hawbShow:'',
      //订单类型
      orderdom:'',
      //基础数据 结算方式
      jsfs:[],
      currencyList:[],
      orderpgid:'',//已分配后取得应收结算对象
      //gysname:'',//应收操作站，本站结算对象
      gysId:'',//应付销售站结算对象
      orderguid:-1,//销售站，操作站，本站区分
      childguid:'',//销售站，操作站，本站区分
      profitmode:'',//利润分配模式
      itemsReocrder:{},//记录多少服务项目个数
      lineshu:false,//切换显示
     // tableHeight:'',//左右形式表格高度
     position: {scrollTop: '0px', scrollLeft: '0px'},
     yingshouMod:false,//应收左右形式修改弹框
     yingfuMod:false,//应付左右形式修改弹框
     titleBj:'启用核对模式',
     //titleBj2:'禁用应付带应收',
     showAccount:false,//应收账单打印
     orderInformation:{info:{},costInfo:[]},//应收账单导入数据
     currencyCost:{charge:[],payment:[],profit:[]},
     currentGidCost:{charge:[],payment:[]},
     currencyFuHao:{'人民币':'￥:','港币':'HK$:','美元':'$:','欧元':'€:','日元':'¥:','英镑':'￡:'},
     yingshouStr:[],
     yingfuStr:[],
     tranMethod:'Fob',
     reconDetail:false,
     showContact:false,//联系人弹框
     contact:'',//联系人
     wagetype:'',//点击修改联系人确认数据
     wagedom:'',//点击修改联系人确认数据
     delCostIndex:'-1',//删除费用index用于弹框联系人
     modifyReason:'',//修改理由
     yssettname:[],//应收结算对象
     activeSettnameYs:'',//激活结算对象
     yfsettname:[],//应付结算对象
     activeSettnameYf:'',//激活结算对象
     arrowAcnIndex:0,//结算对象箭头 应收
     arrowAcnIndexf:0,//结算对象箭头 应付
     allCostData:[],//所有费用4
     methods:'',//新增修改
     wageCostAllYs:false,//费用全选应收
     wageCostAllYf:false,//费用全选应付
     allYsDisabled:false,//应收全选无法选
     allYfDisabled:false,//应付全选无法选
     applyCostData:[],//审批费用
     delbillreason:'',//工作号驳回原因
     costItemsActive:'0',//服务项目激活Index
     applyShow:false,



     //ysGidIndex:0,//应收结算对象索引
     //yfGidIndex:0,//应付结算对象索引
     //ysarrowLeft:false,
     //ysarrowRight:false,
     //yfarrowLeft:false,
    // yfarrowRight:false,


      //typename:''

    }
  },
  created () {
    if (this.defaultCurrency) {
      this.curObjectKyYs.currency = this.defaultCurrency
      this.curObjectKyYf.currency = this.defaultCurrency
      this.curObjectFdYf.currency = this.defaultCurrency
    }

    // 总单详细
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid: this.boguid},loading:true,tip:false}).then(results=>{

      if(results.data){
        this.allmaindata=results.data
        this.orderdom=results.data.orderdom
         Object.keys(this.mawbInformation).forEach(key => {
        if (results.data[key]) {
          this.mawbInformation[key] = results.data[key]
        }else if(key=="ybtjz"){
          this.mawbInformation[key]=(results.data['ybpiece']?results.data['ybpiece']:'0')+'/'+(results.data['ybweight']?Number(results.data['ybweight']).toFixed(2):'0')+'/'+(results.data['ybvolume']?Number(results.data['ybvolume']).toFixed(3):'0')
        }else if(key=="realtjz"){
          this.mawbInformation[key]=(results.data['realpiece']?results.data['realpiece']:'0')+'/'+(results.data['realweight']?Number(results.data['realweight']).toFixed(2):'0')+'/'+(results.data['realvolume']?Number(results.data['realvolume']).toFixed(3):'0')
        }else if(key=="zdtjz"){
           this.mawbInformation[key]=(results.data['zdpiece']?results.data['zdpiece']:'0')+'/'+(results.data['zdweight']?Number(results.data['zdweight']).toFixed(2):'0')+'/'+(results.data['zdvolume']?Number(results.data['zdvolume']).toFixed(3):'0')
        }
      })
         ////console.log(results.data.shipaceInfo.hbrq.substring(0,16))
      this.mawbInformation['hbh']= results.data.shipaceInfo.hbh?results.data.shipaceInfo.hbh:results.data.yqhbh
      this.mawbInformation['hbrq']=results.data.shipaceInfo.hbrq&&results.data.shipaceInfo.hbrq.indexOf('1900')==-1?results.data.shipaceInfo.hbrq.substring(0,11):results.data.yqhbrq.substring(0,11)
      this.mawbInformation['accountweightin']=Number(results.data.accountweightin).toFixed(2)
      this.mawbInformation['hawb']=results.data.hawb
      this.mawbInformation['accountweightout']=Number(results.data.accountweightout).toFixed(2)
      this.mawbInformation['jfweight']=Number(results.data.jfweight).toFixed(2)
      this.mawbInformation['gid']=Number(results.data.gid)
      this.mawbInformation['fid']=Number(results.data.fid)
      this.mawbInformation['area']=results.data.area
      this.mawbInformation['realjfweight']=computedWeight(results.data.realvolume,results.data.realweight)
      this.mawbInformation['zdjfweight']=computedWeight(results.data.zdvolume,results.data.zdweight)
      this.mawbInformation['wageconfirmstatus']=results.data.wageconfirmstatus
      this.mawbInformation['wtkhename']=results.data.wtkhename
      this.mawbInformation['hawbzdpiece']=results.data.hawbzdpiece
      this.mawbInformation['hawbzdweight']=results.data.hawbzdweight
      this.mawbInformation['hawbzdvolume']=results.data.hawbzdvolume
      this.mawbInformation['hawbjfweight']=results.data.hawbjfweight
       this.mawbInformation['orderdom']=results.data.orderdom
       //this.commitstatus=results.data.commitstatus

      //this.mawbInformation['inwageallinprice']=666666

       this.mawbInformation['chargeWeight']=Number(results.data.realvolume)/0.006>Number(results.data.realweight)?Number(results.data.realvolume/0.006).toFixed(2):Number(results.data.realweight).toFixed(2)

       if(results.data.isinwageallin=='1'){
          this.mawbInformation.isinwageallin='单价ALLIN'
        }else if(results.data.isinwageallin=='2'){
          this.mawbInformation.isinwageallin='总价ALLIN'
        }else if(results.data.isinwageallin=='3'){
          this.mawbInformation.isinwageallin='单价++'
        }else if(results.data.isinwageallin=='4'){
          this.mawbInformation.isinwageallin='Cost+'
        }

      //this.curObjectKyYs['settname']=results.data.wtxmname
     //this.curObjectKyYs['gid']=Number(results.data.gid)

      if(this.inputModelData){
        this.curObjectKyYf['gid']=this.inputModelData.mawb&&this.inputModelData.mawbguid>0?this.inputModelData.mawbguid:''
        if(this.inputModelData.isinwageallin=='1'){
          this.inputModelData.isinwageallin='单价ALLIN'
        }else if(this.inputModelData.isinwageallin=='2'){
          this.inputModelData.isinwageallin='总价ALLIN'
        }else if(this.inputModelData.isinwageallin=='3'){
          this.inputModelData.isinwageallin='单价++'
        }else if(this.inputModelData.isinwageallin=='4'){
          this.inputModelData.isinwageallin='Cost+'
        }
      }


      if(results.data.orderguid>0){//已分配结算对象操作站

        results.data.serviceList.forEach(item=>{
          if(item.servicecode=='OA0010'){
            this.curObjectKyYs['gid']=Number(item.orderpgid)
            this.orderpgid=item.orderpgid
            this.profitmode=item.profitmode?item.profitmode:'本站'
          }
        })
         this.curObjectKyYf['gid']=results.data.mawbgid
         this.gysId=results.data.mawbgid

      }else{//未分配结算对象销售站或本站
         if(results.data.childguid==-1){//本站
 this.curObjectKyYf['gid']=results.data.mawbgid
        this.gysId=results.data.mawbgid
         }else if(results.data.childguid>0){//销售站
results.data.serviceList.forEach(item=>{
if(item.servicecode=='OA0010'){
  this.gysId=item.childpgid
          this.curObjectKyYf['gid']=item.childpgid
}


        })

         }

         this.curObjectKyYs['settname']=results.data.wtxmname
         this.curObjectKyYs['gid']=Number(results.data.gid)

   results.data.serviceList.forEach(item=>{
          if(item.servicecode=='OA0010'){
            this.profitmode=item.profitmode?item.profitmode:'本站'
          }
        })
      }
      this.orderguid=results.data.orderguid
      this.childguid=results.data.childguid

      //console.log(this.curObjectKyYs)

      //this.curObjectKyYs['settname']=results.data.wtxmname
      //this.curObjectKyYs['gid']=Number(results.data.gid)

     // this.ponolist.push(results.data.pono)
      }

    })

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


  //alert('1')
  this.mawbCost()



// if(this.orderguid>0){
//   this.salesCost()
// }

    this.getAllHawb()
    //this.fdPayment=Number(this.fdPayment).toFixed(2)
    //this.hawbCost()



  },
  computed: {
    mawbInformationKeys () {
      return Object.keys(this.mawbInformation)
    },
    fdyfLeastWageAll(){

      if(this.curObjectFdYf.num&&this.curObjectFdYf.price){
        this.curObjectFdYf.leastwageall=(Number(this.curObjectFdYf.num)*Number(this.curObjectFdYf.price)).toFixed(2)
        return (Number(this.curObjectFdYf.num)*Number(this.curObjectFdYf.price)).toFixed(2)
      }

    },
    fdyfWageAll(){
       if( this.fdyfLeastWageAll&& this.fdyfChangeRate){
        this.curObjectFdYf.wageall=(Number(this.fdyfLeastWageAll)*Number(this.fdyfChangeRate)).toFixed(2)

        return (Number(this.fdyfLeastWageAll)*Number(this.fdyfChangeRate)).toFixed(2)
      }
    },
    zdysLeastWageAll(){

      if(this.curObjectKyYs.num&&this.curObjectKyYs.price){
        this.curObjectKyYs.leastwageall=(Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)).toFixed(2)

         return (Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)).toFixed(2)
      }

    },
    zdysWageAll(){
 if( this.curObjectKyYs.leastwageall&&this.curObjectKyYs.changerate){
        this.curObjectKyYs.wageall=Number((Number(this.curObjectKyYs.leastwageall)*Number(this.curObjectKyYs.changerate))).toFixed(2)

        return Number((Number(this.curObjectKyYs.leastwageall)*Number(this.curObjectKyYs.changerate))).toFixed(2)
      }
    },
    zdyfWageAll(){
 if( this.curObjectKyYf.leastwageall&& this.curObjectKyYf.changerate){
        this.curObjectKyYf.wageall=Number(Number(this.curObjectKyYf.leastwageall)*Number(this.curObjectKyYf.changerate)).toFixed(2)

        return Number(Number(this.curObjectKyYf.leastwageall)*Number(this.curObjectKyYf.changerate)).toFixed(2)
      }
    } ,
    zdyfLeastWageAll(){

        if(this.curObjectKyYf.num&&this.curObjectKyYf.price){
          this.curObjectKyYf.leastwageall=(Number(this.curObjectKyYf.num)*Number(this.curObjectKyYf.price)).toFixed(2)

           return (Number(this.curObjectKyYf.num)*Number(this.curObjectKyYf.price)).toFixed(2)
        }
    },
    zdysChangeRate(){

        this.curObjectKyYs.changerate=getChangeRate(this.curObjectKyYs.currency)

         if(this.curObjectKyYs.num&&this.curObjectKyYs.price){
            this.curObjectKyYs.leastwageall=Number(Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)).toFixed(2)
            this.curObjectKyYs.wageall=Number(Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)*Number(getChangeRate(this.curObjectKyYs.currency))).toFixed(2)
         }
         this.$forceUpdate()
         return getChangeRate(this.curObjectKyYs.currency)
      },


    zdyfChangeRate(){
       this.curObjectKyYf.changerate=getChangeRate(this.curObjectKyYf.currency)
        if(this.curObjectKyYf.num&&this.curObjectKyYf.price){
            this.curObjectKyYf.leastwageall=Number(Number(this.curObjectKyYf.num)*Number(this.curObjectKyYf.price)).toFixed(2)
            this.curObjectKyYf.wageall=Number(Number(this.curObjectKyYf.num)*Number(this.curObjectKyYf.price)*Number(getChangeRate(this.curObjectKyYf.currency))).toFixed(2)
         }
         this.$forceUpdate()
       return getChangeRate(this.curObjectKyYf.currency)
    },
    fdyfChangeRate(){
       this.curObjectFdYf.changerate=getChangeRate(this.curObjectFdYf.currency)
       return getChangeRate(this.curObjectFdYf.currency)
    },
    zdtotalIn(){
      return (this.zdtotalCharge-this.zdtotalPayment).toFixed(2)
    },
    fdPayment(){
      var total=0
      this.hawb_data_list[this.cur_hawb].hawbPayment.forEach(item=>{
        if(item.isfree=='否'){
          total+=Number(item.wageall)
        }
      })
      return Number(total).toFixed(2)
    },
    tableHeight(){
      var height=''
      if(this.mawbChargeLine.length>this.mawbPayment.length){
        height=(this.mawbChargeLine.length+1)*50+(this.currencyCost.profit.length)*50+'px'
      }else if(this.mawbPayment.length>this.mawbChargeLine.length){
        height=(this.mawbPayment.length+1)*50+(this.currencyCost.profit.length)*50+'px'
      }else if(this.mawbChargeLine.length==0){
        height=100
      }else{
        height=(this.mawbChargeLine.length+1)*50+(this.currencyCost.profit.length)*50+'px'
      }
      return height
    },
    iswageoutcarryin(){
      return this.$store.getters.userSetting.wageoutCarryIn
    },
    defaultCurrency () {
      return this.$store.getters.userSetting.defaultCurrency
    }



  },
  watch:{
    'curObjectKyYs.num'(val){
      //alert(val)
       if(this.curObjectKyYs.price){
         this.curObjectKyYs.leastwageall=(Number(val)*Number(this.curObjectKyYs.price)).toFixed(2)
      this.curObjectKyYs.wageall=(Number(this.curObjectKyYs.leastwageall)*Number(this.curObjectKyYs.changerate)).toFixed(2)
       }


    },
    'curObjectKyYs.price'(val){
      if(this.curObjectKyYs.num){
       this.curObjectKyYs.leastwageall=(Number(this.curObjectKyYs.num)*Number(val)).toFixed(2)
      this.curObjectKyYs.wageall=(Number(this.curObjectKyYs.leastwageall)*Number(this.curObjectKyYs.changerate)).toFixed(2)
      }

    },
    'curObjectKyYs.currency'(val){
      console.log(val)
      console.log(this.curObjectKyYs.num)
      console.log(this.curObjectKyYs.price)
      if(this.curObjectKyYs.num&&this.curObjectKyYs.price){
       this.curObjectKyYs.leastwageall=(Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)).toFixed(2)
      this.curObjectKyYs.wageall=Number(Number(this.curObjectKyYs.num)*Number(this.curObjectKyYs.price)*Number(this.curObjectKyYs.changerate)).toFixed(2)
      }

    },

    'curObjectKyYf.num'(val){
       if(this.curObjectKyYf.price){
         this.curObjectKyYf.leastwageall=(Number(val)*Number(this.curObjectKyYf.price)).toFixed(2)
        this.curObjectKyYf.wageall=(Number(this.curObjectKyYf.leastwageall)*Number(this.curObjectKyYf.changerate)).toFixed(2)
       }

    },
     'curObjectKyYf.price'(val){
      if(this.curObjectKyYf.num){
       this.curObjectKyYf.leastwageall=(Number(this.curObjectKyYf.num)*Number(val)).toFixed(2)
       this.curObjectKyYf.wageall=(Number(this.curObjectKyYf.leastwageall)*Number(this.curObjectKyYf.changerate)).toFixed(2)
      }

    },
      'curObjectKyYf.currency'(val){
        console.log(val)
      if(this.curObjectKyYf.num&&this.curObjectKyYf.price){
       this.curObjectKyYf.leastwageall=(Number(this.curObjectKyYf.num)*Number(this.curObjectKyYf.price)).toFixed(2)
       this.curObjectKyYf.wageall=(Number(this.curObjectKyYf.leastwageall)*Number(this.curObjectKyYf.changerate)).toFixed(2)
      }

    },


      'curObjectFdYf.price'(val){
        if(this.curObjectFdYf.num){
           this.curObjectFdYf.leastwageall=(Number(this.curObjectFdYf.num)*Number(val)).toFixed(2)
      this.curObjectFdYf.wageall=(Number(this.curObjectFdYf.leastwageall)*Number(this.curObjectFdYf.changerate)).toFixed(2)
        }

    },
       'curObjectFdYf.num'(val){
        if(this.curObjectFdYf.price){
           this.curObjectFdYf.leastwageall=(Number(val)*Number(this.curObjectFdYf.price)).toFixed(2)
      this.curObjectFdYf.wageall=(Number(this.curObjectFdYf.leastwageall)*Number(this.curObjectFdYf.changerate)).toFixed(2)
        }

    },


  'curObjectKyYs.wagetype'(val,oldval){
    //console.log(val)
   //console.log(oldval)
   if(!oldval){
    switch(val){
      case'票':
      this.curObjectKyYs.num=this.curObjectKyYs.num?this.curObjectKyYs.num:'1'
      break;
      case'计重':
      this.curObjectKyYs.num=this.curObjectKyYs.num?this.curObjectKyYs.num:this.mawbInformation.realjfweight
      break;
      case'结算重量':
      this.curObjectKyYs.num=this.curObjectKyYs.num?this.curObjectKyYs.num:this.mawbInformation.accountweightin
      break;
      case'毛重':

      this.curObjectKyYs.num=this.curObjectKyYs.num?this.curObjectKyYs.num:this.mawbInformation.realtjz.split('/')[1]
      break;
       case'箱':

      this.curObjectKyYs.num=this.curObjectKyYs.num?this.curObjectKyYs.num:this.mawbInformation.realtjz.split('/')[0]
      break;

    }
  }else{
    switch(val){
      case'票':
      this.curObjectKyYs.num='1'
      break;
      case'计重':
      this.curObjectKyYs.num=this.mawbInformation.realjfweight
      break;
      case'结算重量':
      this.curObjectKyYs.num=this.mawbInformation.accountweightin
      break;
      case'毛重':

      this.curObjectKyYs.num=this.mawbInformation.realtjz.split('/')[1]
      break;
      case'箱':

      this.curObjectKyYs.num=this.mawbInformation.realtjz.split('/')[0]
      break;

    }
  }



  },
  'curObjectKyYf.wagetype'(val,oldval){
    //console.log(val)
    //console.log(oldval)
    if(!oldval){
        switch(val){
      case'票':
      this.curObjectKyYf.num=this.curObjectKyYf.num?this.curObjectKyYf.num:'1'
      break;
      case'计重':
      this.curObjectKyYf.num=this.curObjectKyYf.num?this.curObjectKyYf.num:this.mawbInformation.realjfweight
      break;
      case'结算重量':
      this.curObjectKyYf.num=this.curObjectKyYf.num?this.curObjectKyYf.num:this.mawbInformation.accountweightout
      break;
      case'毛重':

      this.curObjectKyYf.num=this.curObjectKyYf.num?this.curObjectKyYf.num:this.mawbInformation.realtjz.split('/')[1]
      break;
      case'箱':

      this.curObjectKyYf.num=this.curObjectKyYf.num?this.curObjectKyYf.num:this.mawbInformation.realtjz.split('/')[0]
      break;

    }
  }else{
     switch(val){
      case'票':
      this.curObjectKyYf.num='1'
      break;
      case'计重':
      this.curObjectKyYf.num=this.mawbInformation.realjfweight
      break;
      case'结算重量':
      this.curObjectKyYf.num=this.mawbInformation.accountweightout
      break;
      case'毛重':
      this.curObjectKyYf.num=this.mawbInformation.realtjz.split('/')[1]
      break;
      case'箱':
      this.curObjectKyYf.num=this.mawbInformation.realtjz.split('/')[0]
      break;

    }
  }


  },
    'curObjectFdYf.wagetype'(val,oldval){
      if(!oldval){
        switch(val){
      case'票':
      this.curObjectFdYf.num=this.curObjectFdYf.num?this.curObjectFdYf.num:1
      break;
      case'计重':
      this.curObjectFdYf.num=this.curObjectFdYf.num?this.curObjectFdYf.num:this.hawb_data_list[this.cur_hawb].hawbInformation.jfweight
      break;
      case'结算重量':
      this.curObjectFdYf.num=this.curObjectFdYf.num?this.curObjectFdYf.num:this.hawb_data_list[this.cur_hawb].hawbInformation.accountweightin
      break;
      case'毛重':

      this.curObjectFdYf.num=this.curObjectFdYf.num?this.curObjectFdYf.num:this.hawb_data_list[this.cur_hawb].hawbInformation.ybweight
      break;

    }
  }else{
     switch(val){
      case'票':
      this.curObjectFdYf.num=1
      break;
      case'计重':
      this.curObjectFdYf.num=this.hawb_data_list[this.cur_hawb].hawbInformation.jfweight
      break;
      case'结算重量':
      this.curObjectFdYf.num=this.hawb_data_list[this.cur_hawb].hawbInformation.accountweightin
      break;
      case'毛重':

      this.curObjectFdYf.num=this.hawb_data_list[this.cur_hawb].hawbInformation.ybweight
      break;

    }
  }


},
wageguids(val){
if(val.length==0){
var data=[]
  this.mawbCharge.forEach(item=>{
    this.$set(item,'disabled',false)
    if(this.activeSettnameYs&&item.gid==this.activeSettnameYs){
      data.push(item)
    }
  })

  if(this.activeSettnameYs!=0){
     this.yingShouFuStatic(data)
   }else{

     this.yingShouFuStatic(this.mawbCharge)
    // alert('1')
     this.yingShouFuStaticAll()
   }

}else{
  var numUc=0
  var numV=0
  this.mawbCharge.forEach(item=>{
    if(item.confirmstatus=='--'){
      numUc+=1
      if(val.includes(item.guid)){
      numV+=1
      }
    }
  })
  console.log(numUc)
  console.log(numV)
  if(numV==numUc){
    if(this.activeSettnameYs==''||this.activeSettnameYs==0){
      if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
        //this.allysConfirm=true
      }else{
        this.allysConfirm=false
      }

    }
  }else{
    // if(this.activeSettnameYs==''||this.activeSettnameYs==0){
    //   this.allysConfirm=true
    // }
    this.allysConfirm=true

  }
}
},
wageguidf(val){
if(val.length==0){
  var data=[]
  this.mawbPayment.forEach(item=>{
    this.$set(item,'disabled',false)
     if(this.activeSettnameYf&&item.gid==this.activeSettnameYf){
      data.push(item)
    }
  })
   if(this.activeSettnameYf!=0){
     this.yingShouFuStatic(data)
   }else{
     this.yingShouFuStatic(this.mawbPayment)
    // alert('2')
     this.yingShouFuStaticAll()
   }

}else{
  var numUc=0
  var numV=0
  this.mawbPayment.forEach(item=>{
    if(item.confirmstatus=='--'){
      numUc+=1
      if(val.includes(item.guid)){
      numV+=1
      }
    }
  })
  console.log(numUc)
  if(numV==numUc){
    if(this.activeSettnameYf==''||this.activeSettnameYf==0){
      this.allyfConfirm=false
    }
  }else{
     this.allyfConfirm=true
    // if(this.activeSettnameYf==''||this.activeSettnameYf==0){
    //   this.allysConfirm=true
    // }

  }
}
},
lineshu(val){
  if(val){
    this.titleBj='启用编辑模式'
    //this.mawbPayment.sort((a, b) => a.items >= b.items)
    //this.mawbPayment
  }else{
 this.titleBj='启用核对模式'
  }
  this.modCostIndex='-1'
},
orderguid(val){
  if(val>0){

    this.salesCost()
  }
},






// yfGidIndex(val,oldval){
//   console.log(val);
//   console.log(oldval)
// },
// ysGidIndex(val,oldval){
//   console.log(val);
//   console.log(oldval)
// }
// yfGidIndex:function(val,oldval){
//   var newval=(Number(val+1)/3)<1?0:(Number(val+1)/3)==1?1:Math.ceil(Number(val+1)/3)

//   if(!oldval){
//    if(newval>=1){

//     if(this.arrowAcnIndexf==0){
//       this.arrowAcnIndexf++;
//     }else{
//       this.arrowAcnIndexf--;
//     }

//      $('.setnameAllf').css('transform','translateX(-'+this.arrowAcnIndexf*360+'px)')
//    }
//   }else{
//     if((Number(val)>Number(oldval))&&newval>=1){

//       this.arrowAcnIndexf++;
//     }else if((Number(val)<Number(oldval))&&newval>=1){

//       this.arrowAcnIndexf--;
//     }
//   }
//      $('.setnameAllf').css('transform','translateX(-'+this.arrowAcnIndexf*360+'px)')

// },
// ysGidIndex:function(val,oldval){
//    if(!oldval){
//    if(Math.ceil(Number(val+1)/3)>=1){
//     this.arrowAcnIndex++;
//      $('.setnameAll').css('transform','translateX(-'+this.arrowAcnIndex*360+'px)')
//    }
//   }else{
//     if((Number(val)>Number(oldval))&&(Math.ceil(Number(val+1)/3)>=1)){
//       this.arrowAcnIndex++;
//     }else if((Number(val)<Number(oldval))&&(Math.ceil(Number(val+1)/3)>=1)){
//       this.arrowAcnIndex--;
//     }
//   }
//      $('.setnameAll').css('transform','translateX(-'+this.arrowAcnIndex*360+'px)')
// },
// arrowAcnIndex:{
//   handler:function(val){

//     var clientWidth=0

//    $('.setnameAll').find('span').each(function(){
//       clientWidth=clientWidth+$(this).outerWidth()+40
//   })

//   if(!val||val==0){
//     this.ysarrowLeft=true
//   if(clientWidth<768){
//     this.ysarrowRight=true
//   }else{
//     this.ysarrowRight=false
//   }

// }else{

//   if(val>=Math.ceil((clientWidth-768)/768)){
//     this.ysarrowRight=true
//   }

// }
// },
// immediate:true

// },
// arrowAcnIndexf:{
//   handler:function(val){

//     var clientWidth=0

//    $('.setnameAllf').find('span').each(function(){
//       clientWidth=clientWidth+$(this).outerWidth()+40
//   })

//   if(!val||val==0){
//     this.yfarrowLeft=true
//   if(clientWidth<768){
//     this.yfarrowRight=true
//   }else{
//     this.yfarrowRight=false
//   }

// }else{
//  //console.log(Math.ceil((clientWidth-768)/768))
//   if(val>=Math.ceil((clientWidth-768)/768)){
//     this.yfarrowRight=true
//   }
//    this.yfarrowLeft=false

// }
// },
// immediate:true
// }

},


  methods: {
    cancelApply(){//撤销申请
      this.$axios({method:'DELETE',url:this.$store.state.webApi+'api/ExBoBaseWageCommit',data:{boguid: this.boguid},loading:true,tip:false,noarea:'1'})
      .then(results=>{
         if(results.data.resultstatus==0){
          this.$message.success(results.data.resultmessage)
         }else{
          this.$message.error(results.data.resultmessage)
         }
      })
      .catch(error=>{

      })
    },
    // applyStart(){
    //   this.applyModel=!this.applyModel

    // },
    // cancelApply(){
    //   this.applyModel=false;
    //   this.otherWageinList=JSON.parse(JSON.stringify(this.mawbCharge))
    //   this.otherWageoutList=JSON.parse(JSON.stringify(this.mawbPayment))
    // },

    // finishApply(){
    //  var data1=this.otherWageinList.filter(i=>{return i.ismodify=='999'})
    //  var data2=this.otherWageoutList.filter(i=>{return i.ismodify=='999'})
    //  var data=data1.concat(data2)
    //  data.forEach(item=>{
    //   item.isfree=item.isfree=='否'||item.isfree==1?'1':'2'
    //   delete item.confirmstatus
    //  })
    //   this.$axios({method:'POST',url:this.$store.state.webApi+'api/PostBoBaseWageCommit',data:{boguid: this.boguid,wagelist:data},loading:true,tip:false,noarea:'1'})
    //   .then(results=>{
    //      if(results.data.resultstatus==0){
    //       this.$message.success(results.data.resultmessage)
    //       this.otherWageinList=JSON.parse(JSON.stringify(this.mawbCharge))
    //       this.otherWageoutList=JSON.parse(JSON.stringify(this.mawbPayment))
    //        this.commitstatus='100'
    //       this.applyModel=false
    //      }else{
    //       this.$message.error(results.data.resultmessage)
    //      }
    //   })
    //   .catch(error=>{

    //   })

    // },
//     togglehawb (hawb_obj) {
//       this.curHawbGuid=hawb_obj.guid
//       this.cur_hawb = hawb_obj.hawb
//       //console.log(this.hawb_data_list[this.cur_hawb])
//       if (!this.hawb_data_list[this.cur_hawb]) {

//    this.$set(this.hawb_data_list, this.cur_hawb, {hawbInformation: {}, hawbCharge: [], hawbPayment: []})
//         this.$axios({"method":"get",url:this.$store.state.webApi+'api/ExAxpline',params:{guid: this.curHawbGuid},loading:true,tip:false}).then(results=>{

// this.hawb_data_list[this.cur_hawb].hawbInformation=results.data
//         }).catch(error=>{

//         })

//       }

//     },

    setNameStatus(){
      this.yssettname.forEach((item,index)=>{
        var samegidstatus=[]
           this.mawbCharge.forEach((item2,index2)=>{
            if(item.gid&&item.gid==item2.gid){//各个结算对象状态
              samegidstatus.push(item2.confirmstatus)
            }else if(!item.gid){//全部
              samegidstatus.push(item2.confirmstatus)
            }
           })
           if(!samegidstatus.includes('--')){
            this.$set(item,'status','700')
           }else{
            this.$set(item,'status','1')
           }
      })


      this.yfsettname.forEach((item,index)=>{
        var samegidstatus=[]
           this.mawbPayment.forEach((item2,index2)=>{
            if(item.gid&&item.gid==item2.gid){
              samegidstatus.push(item2.confirmstatus)
            }else if(!item.gid){
              samegidstatus.push(item2.confirmstatus)
            }
           })
           if(!samegidstatus.includes('--')){
            this.$set(item,'status','700')
           }else{
            this.$set(item,'status','1')
           }
      })

    },

//     wageCostAllYsF(){
//   if(this.wageCostAllYs){
//     if(!this.allysUconfirm){
//       this.mawbCharge.forEach(item=>{
//         if(!this.wageguids.includes(item.guid)){
//           this.wageguids.push(item.guid)
//           this.ysfConfirmCheck('1',item.guid,item.confirmstatus)
//         }

//       })
//     }else{
//        var status=[]
//       this.mawbPayment.forEach(item=>{
//         status.push(item.confirmstatus)
//       })
//       if(status.indexOf('--')==-1){
//         this.mawbPayment.forEach(item=>{
//           if(!this.wageguidf.includes(item.guid)){
//             this.wageguidf.push(item.guid)
//             this.ysfConfirmCheck('2',item.guid,item.confirmstatus)
//           }
//       })
//       }else{
//         this.mawbCharge.forEach(item=>{
//          if(item.confirmstatus=='--'){
//           if(!this.wageguids.includes(item.guid)){
//             this.wageguids.push(item.guid)
//             this.ysfConfirmCheck('1',item.guid,item.confirmstatus)
//           }

//         }
//       })
//       }

//     }
//   }else{

//     this.wageguids=[]

//   }
// },

// wageCostAllYfF(val){
//   if(this.wageCostAllYf){
//     if(!this.allyfUconfirm){
//       this.mawbPayment.forEach(item=>{
//         if(!this.wageguidf.includes(item.guid)){
//           this.wageguidf.push(item.guid)
//           this.ysfConfirmCheck('2',item.guid,item.confirmstatus)
//         }

//       })
//     }else{
//       var status=[]
//       this.mawbPayment.forEach(item=>{
//         status.push(item.confirmstatus)
//       })
//       if(status.indexOf('--')==-1){
//         this.mawbPayment.forEach(item=>{
//           if(!this.wageguidf.includes(item.guid)){
//             this.wageguidf.push(item.guid)
//             this.ysfConfirmCheck('2',item.guid,item.confirmstatus)
//           }
//       })
//       }else{
//         this.mawbPayment.forEach(item=>{
//         if(item.confirmstatus=='--'){
//           if(!this.wageguidf.includes(item.guid)){
//             this.wageguidf.push(item.guid)
//             this.ysfConfirmCheck('2',item.guid,item.confirmstatus)
//           }

//         }
//       })
//       }

//     }
//   }else{
//     this.wageguidf=[]
//   }
// },

//     ysfConfirmCheck(type,val,status){


//       if(type=='1'){
//          var wagestatus=[]
//          var num=0
//          var num2=0
//         if(this.wageguids.includes(val)){
//         var template=this.mawbCharge.filter(i=>{//筛选出当前勾选的list,以便获取相同结算对象
//         return val==i.guid
//      })

//      this.mawbCharge.forEach(item=>{
//       wagestatus.push(item.confirmstatus)

//       if(item.confirmstatus=='--'){//记录有多少未确认，当wageguids长度和num相同时勾上
//           num+=1
//         }else if(item.confirmstatus!='--'){
//           num2+=1
//         }

//       if(status=='--'){

//         this.ysUconfirm=true
//         this.ysConfirm=false
//         if(template[0].gid==item.gid&&item.confirmstatus=='--'){//当勾选状态为未确认遍历未确认和相同结算对象的

//        if(!this.wageguids.includes(item.guid)){
//           this.wageguids.push(item.guid)
//        }

//       }else if(template[0].gid==item.gid&&item.confirmstatus!='--'){//将不同费用状态list无法勾上

//         this.$set(item,'disabled',true)
//       }else if(item.confirmstatus!='--'){
//         this.$set(item,'disabled',true)
//       }
//       this.allYsDisabled=false//应收全选能够勾选

//       }else{

//         this.ysConfirm=true
//         this.ysUconfirm=false
//         if(template[0].gid==item.gid&&item.confirmstatus!='--'){

//        if(!this.wageguids.includes(item.guid)){
//           this.wageguids.push(item.guid)
//        }
//       }else if(template[0].gid==item.gid&&item.confirmstatus=='--'){
//         this.$set(item,'disabled',true)
//       }else if(item.confirmstatus=='--'){
//         this.$set(item,'disabled',true)
//       }
//       if(wagestatus.indexOf('--')!=-1){
//          this.allYsDisabled=true//应收全选不能够勾选
//       }

//       }


//      })

//      if(wagestatus.indexOf('--')!=-1&&num==this.wageguids.length){//未确认数量与勾选数量相同时默认勾选
//       this.wageCostAllYs=true
//      }else if(num2==this.wageguids.length){
//       this.wageCostAllYs=true
//      }
//       }else{//勾掉某个费用时
//         if(this.wageguids.length==0){
//           this.allYsDisabled=false
//         }
//         this.wageCostAllYs=false
//       }

//     }else if(type=='2'){//应付
//       var num=0
//       var num2=0
//       var wagestatus=[]
//       if(this.wageguidf.includes(val)){

//        var template=this.mawbPayment.filter(i=>{
//         return val==i.guid
//        })
//        this.mawbPayment.forEach(item=>{
//         wagestatus.push(item.confirmstatus)
//          if(item.confirmstatus=='--'){
//          num+=1
//        }else if(item.confirmstatus!='--'){
//          num2+=1
//        }
//        if(status=='--'){

//         this.yfUconfirm=true
//         this.yfConfirm=false
//         if(template[0].gid==item.gid&&item.confirmstatus=='--'){

//        if(!this.wageguidf.includes(item.guid)){
//           this.wageguidf.push(item.guid)
//        }
//       }else if(template[0].gid==item.gid&&item.confirmstatus!='--'){

//         this.$set(item,'disabled',true)
//       }else if(item.confirmstatus!='--'){
//         this.$set(item,'disabled',true)
//       }
//       this.allYfDisabled=false
//       }else{
//         this.yfConfirm=true
//         this.yfUconfirm=false
//         if(template[0].gid==item.gid&&item.confirmstatus!='--'){
//        if(!this.wageguidf.includes(item.guid)){
//           this.wageguidf.push(item.guid)
//        }
//       }else if(template[0].gid==item.gid&&item.confirmstatus=='--'){
//         this.$set(item,'disabled',true)
//       }else if(item.confirmstatus=='--'){
//         this.$set(item,'disabled',true)
//       }
//       if(wagestatus.indexOf('--')!=-1){
//         this.allYfDisabled=true
//       }

//       }

//      })
//        console.log(num2)
//      if(wagestatus.indexOf('--')!=-1&&num==this.wageguidf.length){//未确认数量与勾选数量相同时默认勾选
//       this.wageCostAllYf=true
//      }else if(num2==this.wageguidf.length){
//       this.wageCostAllYf=true
//      }
//       }else{//勾掉某个费用时
//          if(this.wageguidf.length==0){
//           this.allYfDisabled=false
//         }
//         this.wageCostAllYf=false
//       }



//     }


//     },
//     submit(status){

//       var submittype=this.orderdom=='总单'||'直单'?2:1
//       var json={submittype:submittype,guid:this.boguid,area:this.mawbInformation.area,status:status}

//                     this.$axios({method:'post',url:this.$store.state.webApi+"api/ExAxplineSubmit",data:json,loading:true,tip:false}).then(results=>{

//                 if(results.data.resultstatus==0){
//                    this.$message.success(results.data.resultmessage)

//                    this.mawbInformation.wageconfirmstatus=status
//                    if(status=='800'||status=='1100'){
//                       this.ysConfirm=this.ysUconfirm=this.yfConfirm=this.yfUconfirm=true
//                    }else if(status=='700'){
//                     this.yfUconfirm=false
//                     if(this.profitmode.indexOf('Co-load')==-1){
//                       this.ysUconfirm=false
//                     }else{
//                       this.ysUconfirm=true
//                     }
//                    }

//                    this.$forceUpdate()

//                 }else{
//                   this.$message.error("失败！"+results.data.resultmessage)
//                 }

//           })


// },
    // jsxmdata(data){
    //   if(data.dom==1){
    //     if(data.type==1){
    //       this.curObjectKyYs.gid=data.id
    //       this.curObjectKyYs.settname=data.jsxmdata
    //     }else if(data.type==2){
    //       this.curObjectKyYf.gid=data.id
    //       this.curObjectKyYf.settname=data.jsxmdata
    //     }
    //   }else if(data.dom==2){
    //     this.curObjectFdYf.gid=data.id
    //      this.curObjectFdYf.settname=data.jsxmdata
    //   }
    // },

    // fwxmdata(data){
    //   if(data.dom==1){
    //     if(data.type==1){
    //       this.curObjectKyYs.itemsid=data.id
    //       this.curObjectKyYs.items=data.fwxmdata
    //     }else if(data.type==2){
    //       this.curObjectKyYf.itemsid=data.id
    //       this.curObjectKyYf.items=data.fwxmdata
    //     }
    //   }else if(data.dom==2){
    //     this.curObjectFdYf.itemsid=data.id
    //      this.curObjectFdYf.items=data.fwxmdata
    //   }
    // },
    //费用修改
    modCost(index,type,dom,show){
if(!this.applyModel){
  //alert(show)
  //   if(this.mawbInformation.area==this.conditionalAreaForBuild){
  //        this.wagetype=type
  //   this.wagedom=dom
  //   this.show=show

  //   if(type=="1"&&dom=="1"&&show=="1"){
  //     if(this.disabledEdit(type,this.mawbChargeLine[index])){
  //       return false
  //     }else{
  //        this.contact=""
  //        this.modCostIndex=index
  //     this.showContact=true
  //     }
  // }else if(type=="2"&&dom=="1"){
  //     if(this.disabledEdit(type,this.mawbPayment[index])){
  //         return false
  //       }else{
  //          this.contact=""
  //          this.modCostIndex=index
  //     this.showContact=true
  //       }
  //   }else if(type=="1"&&dom=="1"&&show!="1"){

  //     console.log(this.disabledEdit(type,this.mawbCharge[index]))
  //     if(this.disabledEdit(type,this.mawbCharge[index])){
  //         return false
  //       }else{
  //          this.contact=""
  //          this.modCostIndex=index
  //          this.showContact=true
  //       }
  //   }
  // }else{


      if(type=="1"&&dom=="1"&&show!='1'){
        if(this.disabledEdit(type,this.mawbCharge[index])){
          return false
        }
this.modCostIndex=index
this.wagetype=type

        this.curObjectKyYs.num=Number(this.curObjectKyYs.num)

       this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbCharge[index]))
       this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
       this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true




       //this.contact=""
//this.showContact=true

       }else if(type=="2"&&dom=="1"){

        if(this.disabledEdit(type,this.mawbPayment[index])){
          return false
        }
this.modCostIndex=index
this.wagetype=type
        this.curObjectKyYf=JSON.parse(JSON.stringify(this.mawbPayment[index]))

        this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=="否"?false:true
         if(show==1){

          this.yingfuMod=true
         }

         //this.contact=""
         //this.showContact=true
       }else if(type=="1"&&dom=="1"&&show=='1'){
         if(this.disabledEdit(type,this.mawbChargeLine[index])){
          return false
        }
        this.modCostIndex=index
        this.wagetype=type
this.yingshouMod=true
        this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbChargeLine[index]))
       this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
       this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true

       }



//        if(type=="1"&&dom=="1"){
//         if(this.disabledEdit(type,this.mawbCharge[index])){
//           return false
//         }
//        if(show==1){

//         this.yingshouMod=true
//         this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbChargeLine[index]))
//        this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
//        this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true
//        }else{
//  this.curObjectKyYs.num=Number(this.curObjectKyYs.num)

//        this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbCharge[index]))
//        this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
//        this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true

//        }
//        this.contact=""
// this.showContact=true

//        }else if(type=="2"&&dom=="1"){
//         if(this.disabledEdit(type,this.mawbPayment[index])){
//           return false
//         }



//         this.curObjectKyYf=JSON.parse(JSON.stringify(this.mawbPayment[index]))

//         this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=="否"?false:true
//          if(show==1){
//           this.yingfuMod=true
//          }
//          this.contact=""
//          this.showContact=true
//        }else if(type=="2"&&dom=="2"){

//         this.curObjectFdYf=JSON.parse(JSON.stringify(this.hawb_data_list[this.cur_hawb].hawbPayment[index]))
//            this.curObjectFdYf.isfree=this.curObjectFdYf.isfree=="否"?false:true
//        }

}else{
      if(type=="1"&&dom=="1"){

this.modCostIndex=index
this.wagetype=type

        this.curObjectKyYs.num=Number(this.curObjectKyYs.num)

       this.curObjectKyYs=JSON.parse(JSON.stringify(this.otherWageinList[index]))
       this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
       this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true


       }else if(type=="2"&&dom=="1"){


this.modCostIndex=index
this.wagetype=type
        this.curObjectKyYf=JSON.parse(JSON.stringify(this.otherWageoutnList[index]))

        this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=="否"?false:true
         if(show==1){


         }


       }
}


    },
    //修改人填完之后赋修改数据
    modCost2(){
     if($.trim(this.contact)==''||$.trim(this.modifyReason)==''){
        this.$message.error('填写修改申请人或者修改理由');
        return false
      }else{
        if(this.methods!="DELETE"){
                var method=""
        var templetadata={}
        if(this.wagetype=='1'){
        this.curObjectKyYs.sid=this.mawbguid
        this.curObjectKyYs.boguid=this.boguid
        this.curObjectKyYs.quote=0
        this.curObjectKyYs.wageinout=this.wagetype
        this.curObjectKyYs.confirmstatus=1
        this.curObjectKyYs.price=Number(this.curObjectKyYs.price).toFixed(2)
        this.curObjectKyYs.wageall=Number(this.curObjectKyYs.wageall).toFixed(2)
        this.curObjectKyYs.changerate=Number(this.curObjectKyYs.changerate).toFixed(4)
        this.curObjectKyYs.otherguid=this.getOtherGuid(this.curObjectKyYs.otherno)
        this.curObjectKyYs.wagedom='空运'
        method=this.curObjectKyYs.id?"PUT":"POST"
        var templetadata=JSON.parse(JSON.stringify(this.curObjectKyYs))
        templetadata.isfree=templetadata.isfree==true?'2':'1'
        templetadata.area=this.mawbInformation['area']
        templetadata.contact=this.contact
        templetadata.modifyReason=this.modifyReason

        }else if(this.wagetype=='2'){
        this.curObjectKyYf.sid=this.mawbguid
        this.curObjectKyYf.boguid=this.boguid
        this.curObjectKyYf.quote=0
        this.curObjectKyYf.wageinout=this.wagetype

        this.curObjectKyYf.confirmstatus=1
        this.curObjectKyYf.price=Number(this.curObjectKyYf.price).toFixed(2)
        this.curObjectKyYf.wageall=Number(this.curObjectKyYf.wageall).toFixed(2)
        this.curObjectKyYf.changerate=Number(this.curObjectKyYf.changerate).toFixed(4)
        this.curObjectKyYf.otherguid=this.getOtherGuid(this.curObjectKyYf.otherno)
        this.curObjectKyYf.wagedom='空运'
        method=this.curObjectKyYf.id?"PUT":"POST"
        var templetadata=JSON.parse(JSON.stringify(this.curObjectKyYf))
        templetadata.isfree=templetadata.isfree==true?'2':'1'
        templetadata.area=this.mawbInformation['area']
        templetadata.contact=this.contact
        templetadata.modifyReason=this.modifyReason
        if(method=="POST"){
          templetadata.iswagein=this.iswageoutcarryin?'1':'2'
        }
        }

          this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
          if(results.data.resultstatus==0){

            this.$message.success('修改成功')

           if(this.wagetype=='2'){
               this.curObjectKyYf={
                currency: this.defaultCurrency || '人民币',
                gid:this.gysId
              }

            }else if(this.wagetype=='1'){
               if(Number(this.orderguid)>0){
                this.curObjectKyYs={
                currency: this.defaultCurrency || '人民币',
                gid:Number(this.orderpgid),
                otherno:'--'
                }

             }else{
              this.curObjectKyYs={
              currency: this.defaultCurrency || '人民币',
              settname:this.mawbInformation.wtxmname,
              gid:this.mawbInformation.gid,
              otherno:'--'
            }

          }
            }


             templetadata.isfree=templetadata.isfree=='1'?'否':'是'
             templetadata.confirmstatus='--'
             this.mawbCharge=[]
             this.mawbPayment=[]
             this.mawbChargeLine=[]
             this.mawbCost()

             this.yingshouMod=false
             this.yingfuMod=false

             this.contact=""
             this.modifyReason='';
             this.showContact=false
             this.modCostIndex="-1"

          }else{
            this.$message.error(results.data.resultmessage)
          }
        })


        }else{


          var data={}
         if(!this.lineshu){
          if(this.wagetype=="1"&&this.wagedom=='1'){
         data=JSON.parse(JSON.stringify(this.mawbCharge[this.delCostIndex]))
      }else if(this.wagetype=="2"&&this.wagedom=='1'){
        data=JSON.parse(JSON.stringify(this.mawbPayment[this.delCostIndex]))
      }
      }else{
         if(this.wagetype=="1"&&this.lineshu){
        data=JSON.parse(JSON.stringify(this.mawbChargeLine[this.delCostIndex]))
      }else if(this.wagetype=="2"&&this.lineshu){
        data=JSON.parse(JSON.stringify(this.mawbPayment[this.delCostIndex]))
      }
      }



      this.$axios({method:"DELETE",url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:{guid:data.guid,sid:this.mawbguid,boguid:this.boguid,area:this.mawbInformation['area']},loading:false,tip:false}).then(results=>{
          if(results.data.resultstatus==0){
            this.$message.success('删除成功')

            if(this.wagetype=='2'&&this.wagedom=='1'){
              if(data.otherno!='--'){

              }
             this.mawbCost()

            }else if(this.wagetype=='1'&&this.wagedom=='1'){
              this.mawbCost()


            }
             this.contact=""
             this.modifyReason='';
             this.showContact=false

          }else{
            this.$message.error(results.data.resultmessage)
          }
        })



      }



      // this.showContact=false
      //  if(this.wagetype=="1"&&this.wagedom=="1"){
      //  if(this.show&&this.show==1){
      //  this.yingshouMod=true
      //  this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbChargeLine[this.modCostIndex]))
      //  this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
      //  this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true
      //  }else{
      //  this.curObjectKyYs.num=Number(this.curObjectKyYs.num)
      //  this.curObjectKyYs=JSON.parse(JSON.stringify(this.mawbCharge[this.modCostIndex]))
      //  this.curObjectKyYs.gid=Number(this.curObjectKyYs.gid)
      //  this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=="否"?false:true
      //  }
      //  }else if(this.wagetype=="2"&&this.wagedom=="1"){
      //   this.curObjectKyYf=JSON.parse(JSON.stringify(this.mawbPayment[this.modCostIndex]))
      //   this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=="否"?false:true

      //    if(this.show&&this.show==1){
      //     this.yingfuMod=true
      //    }
      //  }


      }
    },
//     addYinShouCost(){


//   this.$axios({method:'POST',url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:this.wageguidf,loading:true,tip:false})
// .then(results=>{
//      if(results.data.resultstatus==0){
//       this.$message.success(results.data.resultmessage)
//       this.mawbCost()

//      }else{
//       this.$message.error(results.data.resultmessage)
//      }
// })
// .catch(error=>{

// })

//     },
    //费用删除
    delCost(index,type,dom,model){
this.wagetype=type
this.delCostIndex=index
this.wagedom=dom
if(!this.applyModel){
   if(!model){//编辑模式
if(type=="1"&&dom=="1"){
      if(this.showUconfirmF(type,this.mawbCharge[index])){
        return false
      }
     }else if(type=="2"&&dom=="1"){
      if(this.showUconfirmF(type,this.mawbPayment[index])){
        return false
      }
     }
    }else{//核对模式
       if(this.showUconfirmF(type,this.mawbChargeLine[index])){
        return false
      }
    }


      this.$confirm('是否删除此费用?','提示',{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      })
      .then(()=>{
        if((this.mawbInformation.area!=this.conditionalAreaForBuild)||(this.mawbInformation.area==this.conditionalAreaForBuild&&this.orderguid<0)){
                  var data={}
         if(!model){
          if(type=="1"&&dom=="1"){
         data=JSON.parse(JSON.stringify(this.mawbCharge[index]))
      }else if(type=="2"&&dom=="1"){
        data=JSON.parse(JSON.stringify(this.mawbPayment[index]))
      }else if(type=="2"&&dom=="2"){
        data=JSON.parse(JSON.stringify(this.hawb_data_list[this.cur_hawb].hawbPayment[index]))
      }
      }else{
         if(type=="1"&&dom=="1"){
        data=JSON.parse(JSON.stringify(this.mawbChargeLine[index]))
      }
      }

      this.$axios({method:"DELETE",url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:{guid:data.guid,sid:this.mawbguid,boguid:this.boguid,area:this.mawbInformation['area']},loading:false,tip:false}).then(results=>{
          if(results.data.resultstatus==0){
            this.$message.success('删除成功')

            if(type=='2'&&dom=='1'){
              if(data.otherno!='--'){

              }
             this.mawbCost()

            }else if(type=='1'&&dom=='1'){
              this.mawbCost()

            //   if(!model){
            //      this.mawbCharge.splice(index,1)
            //    }else{
            //      this.mawbChargeLine.splice(index,1)
            //    }
            //   var totalCharge=0
            //   this.mawbChargeLine=[]
            //   this.toolTip=[]
            //   this.itemsReocrder={}

            //   this.yingShouFuStatic(this.mawbCharge)
            //   this.mawbCharge.forEach(i=>{
            //     if(i.yssys!=2&&i.isfree=='否'){

            // totalCharge+=Number(i.wageall)

            //     }

            //   })


            //   this.zdtotalCharge=totalCharge.toFixed(2)
            //   this.checkModel()


            }


            //this.mawbCost()
          }else{
            this.$message.error(results.data.resultmessage)
          }
        })
        }else{
          this.methods="DELETE"
          this.showContact=true
        }

      })
      .catch(()=>{
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })
    }else{
      if(type=='1'&&dom=='1'){
        if(this.otherWageinList[index].ismodify=='999'){
          this.otherWageinList.splice(index,1)
        }else{
          var data=this.otherWageinList[index]
          data.method="DELETE"
          data.ismodify='999'
          data.thisListHide=true
          //alert(this.otherWageinList.length)
          this.otherWageinList[index]=data
          //this.otherWageinList.splice(index,1)
        }
      }else if(type=='2'&&dom=='1'){
        if(this.otherWageoutList[index].ismodify=='999'&&this.otherWageoutList[index].guid=='-1'){
          this.otherWageoutList.splice(index,1)
        }else{
          var data=this.otherWageoutList[index]
          data.method="DELETE"
          data.ismodify='999'
          data.thisListHide=true
          //this.otherWageoutList.push(data)
          this.otherWageoutList[index]=data
          //this.otherWageoutList.splice(index,1)
        }
      }
    }


    },
    //删除应收所有费用
    delAllYsCost(){

    this.$axios({method:"DELETE",url:'http://192.168.0.167/BoManagementWebApi/api/ExBoBaseWage',data:{boguid:this.boguid,area:this.mawbInformation['area']},loading:false,tip:false})
    .then(results=>{
         if(results.data.resultstatus==0){
           var newMawbCharge=[]

          this.mawbCharge.forEach((item,index)=>{
            if(item.isshare<0||item.confirmstatus=='已确认'){



                newMawbCharge.push(item)


            }
          })
          console.log(newMawbCharge)
          this.mawbCharge=newMawbCharge
         }else{
          this.$message.error(results.data.resultmessage)
         }


    })
    .catch(error=>{

    })
    },
    //费用添加
    addCost(type,dom,data){
       this.wagetype=type

       if(!this.applyModel){
          if(this.disabledAdd(type)){
        return false
       }

      if(type=="1"&&dom=="1"){

        if(data){

          this.curObjectKyYs=JSON.parse(JSON.stringify(data))
          this.curObjectKyYs.wageinout=1
          this.curObjectKyYs.gid=this.mawbInformation['gid']
          this.curObjectKyYs.id=""
          this.curObjectKyYs.guid=""
          this.curObjectKyYs.isshare=-1
        }


        if(!this.curObjectKyYs.price||!this.curObjectKyYs.num||!this.curObjectKyYs.wagetype||!this.curObjectKyYs.items){
          this.$message.error('请填写完整费用');
          return false
        }

        var method="";
        var templetadata={};

        this.curObjectKyYs.sid=this.mawbguid
        this.curObjectKyYs.boguid=this.boguid
        this.curObjectKyYs.quote=0
        this.curObjectKyYs.wageinout=type

        this.curObjectKyYs.confirmstatus=1
        this.curObjectKyYs.price=Number(this.curObjectKyYs.price).toFixed(2)
        this.curObjectKyYs.wageall=Number(this.curObjectKyYs.wageall).toFixed(2)
        this.curObjectKyYs.changerate=Number(this.curObjectKyYs.changerate).toFixed(4)
        this.curObjectKyYs.otherguid=this.getOtherGuid(this.curObjectKyYs.otherno)
        this.curObjectKyYs.wagedom='空运'
        method=this.curObjectKyYs.id?"PUT":"POST"
        this.methods=method

        var templetadata=JSON.parse(JSON.stringify(this.curObjectKyYs))
        templetadata.isfree=templetadata.isfree==true?'2':'1'
        templetadata.area=this.mawbInformation['area']
        templetadata.contact=this.contact
        templetadata.modifyReason=this.modifyReason


        if(this.mawbInformation.area==this.conditionalAreaForBuild&&this.orderguid>0){
         this.showContact=true
           // if(!templetadata.contact||!templetadata.modifyReason){
           //  return false
           // }
        }else{
             this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
          if(results.data.resultstatus==0){
            this.$message.success('新增成功')

            if(Number(this.orderguid)>0){
            this.curObjectKyYs={
              currency: this.defaultCurrency || '人民币',
              gid:Number(this.orderpgid),
              otherno:'--'
            }

          }else{
            this.curObjectKyYs={
              currency: this.defaultCurrency || '人民币',
              settname:this.mawbInformation.wtxmname,
              gid:this.mawbInformation.gid,
              otherno:'--'
            }

          }

            templetadata.isfree=templetadata.isfree=='1'?'否':'是'
            templetadata.confirmstatus='--'

            this.toolTip=[]
            this.yingshouMod=false
            this.yingfuMod=false

            if(method=='PUT'){

              this.mawbCost()
              // if(data){
              //   this.mawbCost()
              // }

              // var totalCharge=0
              // this.mawbChargeLine=[]
              // this.itemsReocrder={}
              // this.mawbCharge[this.modCostIndex]=templetadata

              //   this.mawbCharge.forEach(i=>{
              //   if(i.yssys!=2&&i.isfree=='否'){
              //      totalCharge+=Number(i.wageall)
              //   }
              // })
              // this.zdtotalCharge=totalCharge.toFixed(2)
              // this.checkModel()

            }else{
               this.mawbCharge=[]
               this.mawbCost()
            }
             this.contact=""
             this.modCostIndex="-1"

          }else{
            this.$message.error(results.data.resultmessage)
          }
        })
        }


      }else if(type=="2"&&dom=="1"){
        if(!this.curObjectKyYf.price||!this.curObjectKyYf.num||!this.curObjectKyYf.wagetype||!this.curObjectKyYf.items){
          this.$message.error('请填写完整费用');
          return false
        }
        var method="";
          var template={}
        this.curObjectKyYf.sid=this.mawbguid
        this.curObjectKyYf.boguid=this.boguid
        this.curObjectKyYf.quote=0
        this.curObjectKyYf.wageinout=type
        this.curObjectKyYf.price=Number(this.curObjectKyYf.price).toFixed(2)
        this.curObjectKyYf.wageall=Number(this.curObjectKyYf.wageall).toFixed(2)
        this.curObjectKyYf.changerate=Number(this.curObjectKyYf.changerate).toFixed(4)
        this.curObjectKyYf.otherguid=this.getOtherGuid(this.curObjectKyYf.otherno)
        this.curObjectKyYf.wagedom='空运'
        method=this.curObjectKyYf.id?"PUT":"POST"
        this.methods=method
        this.curObjectKyYf.confirmstatus=1

        var templetadata=JSON.parse(JSON.stringify(this.curObjectKyYf))
        templetadata.isfree=templetadata.isfree==true?'2':'1'
         templetadata.area=this.mawbInformation['area']
         templetadata.contact=this.contact
         templetadata.modifyReason=this.modifyReason

        if(method=="POST"){
          templetadata.iswagein=this.iswageoutcarryin?'1':'2'
        }

        if(method=="POST"&&this.mawbInformation.area!=this.conditionalAreaForBuild){
        template=JSON.parse(JSON.stringify(this.curObjectKyYf))
        template.isfree=this.curObjectKyYf.isfree=="1"?'否':'是'
        template.settname=this.mawbInformation.wtxmname
        template.belong=2
        template.confirmstatus='--'

        this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
          if(results.data.resultstatus==0){

            this.$message.success('新增成功')

             this.curObjectKyYf={
            currency: this.defaultCurrency || '人民币',
            gid:this.gysId
        }


             // templetadata.isfree=templetadata.isfree=='1'?'否':'是'
             // templetadata.confirmstatus='--'
             this.mawbPayment=[]
              this.mawbChargeLine=[]
             this.mawbCost()


             // if(templetadata.otherguid&&templetadata.otherguid!='-1'){
             //  this.hawb_data_list[templetadata.otherno].hawbPayment.push(templetadata)
             // }
             this.modCostIndex="-1"

          }else{
            this.$message.error(results.data.resultmessage)
          }
        })

        }else if(this.mawbInformation.area==this.conditionalAreaForBuild){
          if(this.orderguid>0){
            this.showContact=true
          }else{
            if(method=="PUT"){
                  this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
                  if(results.data.resultstatus==0){

                  this.$message.success('修改成功')

                  this.curObjectKyYf={
                  currency: this.defaultCurrency || '人民币',
                  gid:this.gysId
                  }


                  templetadata.isfree=templetadata.isfree=='1'?'否':'是'
                  templetadata.confirmstatus='--'
                  this.mawbPayment=[]
                  this.mawbChargeLine=[]
                  this.mawbCost()


                 if(templetadata.otherguid&&templetadata.otherguid!='-1'){
                  this.hawb_data_list[templetadata.otherno].hawbPayment.push(templetadata)
                 }
                 this.modCostIndex="-1"

                 }else{
                this.$message.error(results.data.resultmessage)
                }
              })
            }else if(method=="POST"){
                template=JSON.parse(JSON.stringify(this.curObjectKyYf))
                template.isfree=this.curObjectKyYf.isfree=="1"?'否':'是'
                template.settname=this.mawbInformation.wtxmname
                template.belong=2
                template.confirmstatus='--'

                this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
                  if(results.data.resultstatus==0){

                  this.$message.success('新增成功')

                  this.curObjectKyYf={
                    currency: this.defaultCurrency || '人民币',
                    gid:this.gysId
                  }


                  this.mawbPayment=[]
                  this.mawbChargeLine=[]
                  this.mawbCost()
                  this.modCostIndex="-1"

                  }else{
                  this.$message.error(results.data.resultmessage)
                }
              })
            }
          }


        }else if(method=="PUT"&&this.mawbInformation.area!=this.conditionalAreaForBuild){

               this.$axios({method:method,url:this.$store.state.webApi+'api/ExHpoAxplineWage',data:templetadata,loading:true,tip:false}).then(results=>{
          if(results.data.resultstatus==0){

            this.$message.success('修改成功')
             this.curObjectKyYf={
            currency: this.defaultCurrency || '人民币',
            gid:this.gysId
        }

             templetadata.isfree=templetadata.isfree=='1'?'否':'是'
             templetadata.confirmstatus='--'
             this.mawbPayment=[]
              this.mawbChargeLine=[]
             this.mawbCost()


             if(templetadata.otherguid&&templetadata.otherguid!='-1'){
              this.hawb_data_list[templetadata.otherno].hawbPayment.push(templetadata)
             }
             this.modCostIndex="-1"

          }else{
            this.$message.error(results.data.resultmessage)
          }
        })
        }





      }else if(type=="2"&&dom=="2"){//**************分单费用新增已取消*****************//

        //alert('2')
        var method="";
        this.curObjectFdYf.sid=this.curHawbGuid
        this.curObjectFdYf.quote=0
        this.curObjectFdYf.wageinout=type
        //templetadata.isfree=templetadata.isfree==true?'2':'1'
         this.curObjectFdYf.price=Number(this.curObjectFdYf.price).toFixed(2)
        this.curObjectFdYf.wageall=Number(this.curObjectFdYf.wageall).toFixed(2)
        this.curObjectFdYf.changerate=Number(this.curObjectFdYf.changerate).toFixed(4)


        method=this.curObjectFdYf.id?"PUT":"POST"



         var templetadata=JSON.parse(JSON.stringify(this.curObjectFdYf))
         templetadata.isfree=templetadata.isfree==true?'2':'1'

        //console.log(method)
        this.$axios({method:method,url:this.$store.state.webApi+'api/ExAxplineWage',data:templetadata,loading:false,tip:false}).then(results=>{
          if(results.data.resultstatus==0){
            this.$message.success('新增成功')
            this.curObjectFdYf={
              currency: this.defaultCurrency || '人民币',
            }

           // this.hawbCost()
            this.mawbCost()
          }else{
            this.$message.error(results.data.resultmessage)
          }
        })

       // //console.log(this.curObjectFdYf)
      }
       }else{
        if(type=='1'&&dom=='1'){
//console.log(this.curObjectKyYs)
            this.curObjectKyYs.price=Number(this.curObjectKyYs.price).toFixed(2)
            this.curObjectKyYs.num=Number(this.curObjectKyYs.num).toFixed(2)
        this.curObjectKyYs.wageall=Number(this.curObjectKyYs.wageall).toFixed(2)
        this.curObjectKyYs.changerate=Number(this.curObjectKyYs.changerate).toFixed(4)
        this.curObjectKyYs.changerate=Number(this.curObjectKyYs.changerate).toFixed(4)
        this.curObjectKyYs.isfree=this.curObjectKyYs.isfree?'2':'1'
        //this.curObjectFdYs.isfree='1'?'否':'是'
         //this.curObjectFdYs.isfree='1'?'否':'是'
          //var method=""
          if(this.curObjectKyYs.id){
            //method=

            //alert(this.modCostIndex)
            this.curObjectKyYs.isfree=this.curObjectKyYs.isfree=='1'?'否':'是'
            this.$set(this.otherWageinList,this.modCostIndex,this.curObjectKyYs)

            this.otherWageinList[this.modCostIndex].method='PUT'
            this.otherWageinList[this.modCostIndex].ismodify='999'

             //console.log(this.otherWageinList[this.modCostIndex])
             // data.method='PUT'
             // data.ismodify='999'
             // this.otherWageinList[this.modCostIndex]=data
          }else{
            // method=
             var data=this.curObjectKyYs
             data.wageinout='1'
             data.method='POST'
             //data.ismodify='999'
             data.isfree=data.isfree?'是':'否'
             if(data.ismodify=='999'){
              this.$set(this.otherWageinList,this.modCostIndex,data)

             }else{
              data.ismodify='999'
              data.guid='-1'
              this.otherWageinList.push(data)
             }

          }

            this.curObjectKyYs={
              currency: this.defaultCurrency || '人民币',
              gid:Number(this.orderpgid),
              otherno:'--'
            }


        }else if(type=='2'&&dom=='1'){

           this.curObjectKyYf.price=Number(this.curObjectKyYf.price).toFixed(2)
           this.curObjectKyYf.num=Number(this.curObjectKyYf.num).toFixed(2)
        this.curObjectKyYf.wageall=Number(this.curObjectKyYf.wageall).toFixed(2)
        this.curObjectKyYf.changerate=Number(this.curObjectKyYf.changerate).toFixed(4)
        this.curObjectKyYf.changerate=Number(this.curObjectKyYf.changerate).toFixed(4)
        this.curObjectKyYf.isfree=this.curObjectKyYf.isfree?'2':'1'

          if(this.curObjectKyYf.id){
            this.curObjectKyYf.isfree=this.curObjectKyYf.isfree=='1'?'否':'是'
             //method=
             this.$set(this.otherWageoutList,this.modCostIndex,this.curObjectKyYf)
             //this.otherWageoutList[this.modCostIndex]=this.curObjectKyYf
             this.otherWageoutList[this.modCostIndex].method='PUT'
             this.otherWageoutList[this.modCostIndex].ismodify='999'
             //data.method='PUT'
             // data.ismodify='999'
             // this.otherWageoutList[this.modCostIndex]=data
          }else{
            // method=
             var data=this.curObjectKyYf
             data.wageinout='2'
             data.method='POST'
             //data.ismodify='999'
             data.isfree=data.isfree?'是':'否'
             if(data.ismodify=='999'){
              this.$set(this.otherWageoutList,this.modCostIndex,data)

             }else{
              data.ismodify='999'
              data.guid='-1'
              this.otherWageoutList.push(data)
             }
          }

          this.curObjectKyYf={
              currency: this.defaultCurrency || '人民币',
              gid:Number(this.gysId),
              otherno:'--'
            }

        }



       this.modCostIndex=-1
       }

    },
    //获取选中分单guid
    getOtherGuid(hawb){
      //alert(hawb)
      var otherguid=""
     this.hawbList.forEach(item=>{
      if(item.name==hawb){
        otherguid=item.id
      }
     })
     return otherguid

    },

    // ***********应收应付结算对象************
    getYfSettname(data){
      this.curObjectKyYf.settname=data.usr_name
    },
    getYsSettname(data){
      this.curObjectKyYs.settname=data.usr_name
    },
    //
    //清空当前费用
    delCurCost(type,dom,show){
      this.modCostIndex="-1"
      this.contact=""
      //console.log(this.otherguid)
      if(type=="1"&&dom=="1"){
        if(Number(this.orderguid)>0){
          this.curObjectKyYs={
             otherno:'--',
             currency: this.defaultCurrency || '人民币',
             gid:Number(this.orderpgid),
          }

        }else{
           this.curObjectKyYs={
            otherno:'--',
             currency: this.defaultCurrency || '人民币',
             gid:this.mawbInformation.gid
          }

        }
        if(show==1){
          this.yingshouMod=false
        }
      }else if(type=="2"&&dom=="1"){
      //   if(Number(this.orderguid)<0){
      //      if(this.childguid>0){
      //        this.curObjectKyYf={
      //       currency:'人民币',
      //       gid:Number(this.gysId)
      //   }
      // }else if(this.childguid==-1){
      //    this.curObjectKyYf={
      //       currency:'人民币',
      //       gid:this.gysname
      //   }
      // }


      //   }else{
      //     this.curObjectKyYf={
      //       currency:'人民币',
      //       settname:this.gysname
      //   }
      //   }
        this.curObjectKyYf={
            currency: this.defaultCurrency || '人民币',
            gid:this.gysId
        }


        if(show==1){
          this.yingfuMod=false
        }
      }else if(type=="2"&&dom=="2"){
        this.curObjectFdYf={
          currency: this.defaultCurrency || '人民币'
        }

      }
    },
    // 费用确认取消确认
    confirmButton(type,status,all){//type 1应收 2应付 all应收总确认总取消
      if(!all){
         if(type=='1'&&this.mawbCharge.length>0&&this.wageguids.length==0){
        this.$message.error('请勾选应收结算对象')
        return false
        }else if(type=='2'&&this.mawbPayment.length>0&&this.wageguidf.length==0){
        this.$message.error('请勾选应付结算对象')
        return false
        }
        var data={boguid:this.boguid,wageinout:type,status:status,area:this.mawbInformation['area'],isFromFob:this.isFromFob?this.isFromFob:'',guidList:type=='1'?this.wageguids.join(','):this.wageguidf.join(','),isyssys:'1'}
      }else{
        // if(type=='1'&&status=='700'&&this.mawbCharge.length>0){
        //   this.$message.error('请勾选所有应收结算对象')
        //   return false
        // }else if(type=='2'&&status=='700'&&this.mawbPayment.length>0){
        //   this.$message.error('请勾选所有应付结算对象')
        //   return false
        // }


         var data={boguid:this.boguid,wageinout:type,status:status,area:this.mawbInformation['area'],isFromFob:this.isFromFob?this.isFromFob:'',guidList:type=='1'?this.wageguids.join(','):this.wageguidf.join(','),isyssys:'2'}

      }



      // var data={boguid:this.boguid,wageinout:(type=='3'?'2':type),status:status,area:this.mawbInformation['area'],isshare:(type=='3'||type=='1'?'-1':1),isFromFob:this.isFromFob?this.isFromFob:''}
if(!all){
  if(status=='700'){
        if(type=='1'){
        var num=0
        this.mawbCharge.forEach(item=>{
          if(Number(item.wageall)==0&&item.isfree!='是'&&Number(item.isallin)==2&&this.wageguids.includes(item.guid)){
            num=1
          }
        })
        if(num==1){
          this.$message.error('应收费用为0无法确认')
          return false
        }


      }else if(type=='2'){
       var num=0
        this.mawbPayment.forEach(item=>{
          if(Number(item.wageall)==0&&item.isfree!='是'&&Number(item.isallin)==2&&this.wageguids.includes(item.guid)){
            num=1

          }
        })
        if(num==1){
          this.$message.error('应付费用为0无法确认')
          return false
        }
      }
        }
}


      var that=this
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExHpoAxplineWageConfirm',data:data,loading:true}).then(results=>{
         if(results.data.resultstatus==0){
           this.$message.success('操作成功')
            var showData=[]
            this.wageCostAllYs=false
            this.wageCostAllYf=false
            this.mawbChargeLine=[]
            this.toolTip=[]
            this.itemsReocrder={}
            if(!all){
              if(type=='1'){
              if(status=='700'){
                this.mawbCharge.forEach(i=>{

              if(i.yssys!=2&&i.confirmstatus=='--'&&this.wageguids.includes(i.guid)){
                i.confirmstatus='已确认'
              }
              if(i.thisListHide==false){
                showData.push(i)
              }
            })
                 if(this.isFromFob){
              this.back()
             }
              }else if(status=='1'){
                this.mawbCharge.forEach(i=>{

              if(i.yssys!=2&&i.confirmstatus=='已确认'&&this.wageguids.includes(i.guid)){
                i.confirmstatus='--'
              }
               if(i.thisListHide==false){
                showData.push(i)
              }
            })
              }

            }

            if(type=='2'){
               if(status=='700'){
                this.mawbPayment.forEach(i=>{
              if(i.yssys!=2&&i.confirmstatus=='--'&&this.wageguidf.includes(i.guid)){
                i.confirmstatus='已确认'
              }
               if(i.thisListHide==false){
                showData.push(i)
              }
            })
              }else if(status=='1'){
                this.mawbPayment.forEach(i=>{
              if(i.yssys!=2&&i.confirmstatus=='已确认'&&this.wageguidf.includes(i.guid)){
                i.confirmstatus='--'
              }
               if(i.thisListHide==false){
                showData.push(i)
              }
            })
              }

            }
          }else{
            if(status=='700'){
              this.allCostData.forEach(item=>{
                if(item.wageinout==type){
                  item.confirmstatus='已确认'
                }

              })
              if(type=='1'){
                this.mawbCharge.forEach(item=>{
                 item.confirmstatus='已确认'
                })
              }else if(type=='2'){
                this.mawbPayment.forEach(item=>{
                 item.confirmstatus='已确认'
                })
              }

            }else if(status=='1'){


              if(type=='1'){

                //alert('666')
                this.allCostData.forEach(item=>{

                  if((item.yssys==2&&item.wageinout=='1')||this.wageguids.includes(item.guid)){
                    item.confirmstatus='--'
                    }
                  })

                this.mawbCharge.forEach(item2=>{
                  if(this.wageguids.includes(item2.guid)){
                    item2.confirmstatus='--'
                    }
                  })
                //alert('777')
              }else if(type=='2'){
                this.allCostData.forEach(item=>{
                  if((item.yssys==2&&item.wageinout=='2')||this.wageguidf.includes(item.guid)){
                    item.confirmstatus='--'
                    }
                  })
                this.mawbPayment.forEach(item=>{
                  if(this.wageguidf.includes(item.guid)){
                    item.confirmstatus='--'
                    }
                  })
              }
              // this.allCostData.forEach(item=>{
              //   if(type=='1'){
              //     if(item.yssys==2||this.wageguids.includes(i.guid)){
              //       item.confirmstatus='--'
              //     }
              //     this.mawbCharge.forEach(item2=>{
              //       if(this.wageguids.includes(item2.guid)){
              //         item2.confirmstatus='--'
              //       }
              //     })
              //     }else if(type=='2'){
              //     if(item.yssys==2||this.wageguidf.includes(i.guid)){
              //       item.confirmstatus='--'
              //     }
              //     this.mawbPayment.forEach(item2=>{
              //       if(this.wageguidf.includes(item2.guid)){
              //         item2.confirmstatus='--'
              //       }
              //     })
              //   }

              // })

            }
          }
         // alert('888')
//alert('1')
            this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxpline',params:{boguid: this.boguid},loading:true,tip:false}).then(results=>{
              //console.log(results.data.wageconfirmstatus)
              this.mawbInformation.wageconfirmstatus=results.data.wageconfirmstatus
              this.$forceUpdate()
            })
            // data.forEach(item=>{
            //   if(item.confirmstatus=='--'){
            //     this.mawbInformation.wageconfirmstatus=1
            //   }else{
            //     this.mawbInformation.wageconfirmstatus=700
            //   }
            // })



            this.checkModel()
            this.setNameStatus()

            setTimeout(()=>{//判断当前的结算对象是否能够点击确认或者取消确认
              //alert('1')
              if(!all){

               this.yingShouFuStatic(showData)
              }else{
                this.yingShouFuStatic(this.mawbCharge.concat(this.mawbPayment))
              }
             },1000)

             setTimeout(()=>{//判断应收总确认是否显示
               //alert('2')
              this.yingShouFuStaticAll()
            },1200)


                setTimeout(()=>{
                  //alert('3')
              this.allDataCostStatus()
            },1400)

                setTimeout(()=>{
              this.handleSettname('1',this.activeSettnameYs)
              this.handleSettname('2',this.activeSettnameYf)
            },1600)


                //alert('1')
                // this.wageguids=[]
                // this.wageguidf=[]
               // console.log(this.wageguids)
                //this.$forceUpdate()




            //  setTimeout(()=>{
            //   this.allDataCostStatus()
            // },1400)



           // console.log(data)


            // setTimeout(() => {

            //    if(type=='2'&&status=='700'){

            //      that.yfConfirm=true
            //      that.yfUconfirm=false
            // }

            // if(type=='2'&&status=='1'){

            //      that.yfConfirm=false
            //      that.yfUconfirm=true
            // }

            //  if(type=='1'&&status=='700'){

            //      that.ysConfirm=true
            //      that.ysUconfirm=false
            //      that.ysDz=false
            // }

            // if(type=='1'&&status=='1'){

            //      that.ysConfirm=false
            //      that.ysUconfirm=true
            //      that.ysDz=true
            // }

            // }, 1000);




            this.$emit('success',true)

         }else{
          this.$message.error(results.data.resultmessage)
          //this.curObjectFdYf={}
          //this.mawbCost()
         }
      }).catch(error=>{

      })
    },

    //总单费用查询
    mawbCost(){

      this.modCostIndex="-1"
      this.contact=""
      this.mawbCharge=[]
      this.mawbPayment=[]
      this.mawbChargeLine=[]
      this.yfsettname=[]
      this.yssettname=[]
      this.toolTip=[]
      this.itemsReocrder={}
      var totalCharge=0
      var totalPayment=0
      var ysconfirm=[]
      var yfconfirm=[]
     this.yingshouStr=[]
     this.yingfuStr=[]
          // 总单费用
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExBoBaseWageCommit',params:{boguid:this.boguid},loading:true,tip:false}).then(results=>{
    	console.log(results.data)

        this.mawbApplyCost=results.data

this.mawbApplyCost.forEach(item=>{
     item.commitwageList.sort((a, b) => {
       if(Number(a["gid"]) == Number(b["gid"])){
         if(Number(a['orderindex'])==Number(b['orderindex'])){
              return a['items'].localeCompare(b['items'],"zh");
          }else{
            return Number(a['orderindex'])>Number(b['orderindex'])?1:-1;
          }
    }else{
         return Number(a["gid"])>Number(b["gid"])?1:-1;
    }

    })
})


this.mawbApplyCost[this.mawbApplyCost.length-1].commitwageList.forEach(item=>{

	if(item.method){
        		this.$set(item,'delbillreason','')
                this.applyCostData.push(item)
        	  }
})

        // this.mawbApplyCost.forEach(item=>{

        // 	item.commitwageList.forEach(item2=>{

        // 	})

        // })

    	this.logActiveClick(this.mawbApplyCost.length-1)
//       this.allCostData=results.data

//       results.data.sort((a, b) => {
//        if(Number(a["gid"]) == Number(b["gid"])){
//          if(Number(a['orderindex'])==Number(b['orderindex'])){
//               return a['items'].localeCompare(b['items'],"zh");
//           }else{
//             return Number(a['orderindex'])>Number(b['orderindex'])?1:-1;
//           }
//     }else{
//          return Number(a["gid"])>Number(b["gid"])?1:-1;
//     }

//     })

//       if(this.isFromFob){
//         results.data=results.data.filter(i=>{
// return (i.wageinout=='1')&&(Number(i.gid)==Number(this.gid))
//         })
//       }
//       this.typename=''
//       results.data.forEach(i => {
//         i.gid=Number(i.gid)
//         if(i.yssys!=2){
//           i.isfree == 1 ? i.isfree = '否' : i.isfree = '是'
//         i.num=i.wagetype=='票'?i.num:Number(i.num).toFixed(2)
//         i.price=Number(i.price).toFixed(2)
//         i.wageall=Number(i.wageall).toFixed(2)
//         i.leastwageall=Number(i.leastwageall).toFixed(2)
//         i.changerate=Number(i.changerate).toFixed(4)
//         if (i.wageinout == 1) {

//               this.mawbCharge.push(i)
//               if(i.isfree=='否'){
//             totalCharge+=Number(i.wageall)

// }





//         } else if (i.wageinout == 2) {

//           this.mawbPayment.push(i)

//           if(i.isfree=='否'){
//             totalPayment+=Number(i.wageall)
//           }


//         }
//         }

//         if(i.wageinout==1){
//              if(i.yssys==2&&i.confirmstatus==1&&i.operid>0){
//               this.yingshouStr.push(i.wagedom)
//             }


//           if(i.confirmstatus==1){
//           i.confirmstatus='--'
//         }else if(i.confirmstatus==700){
//           i.confirmstatus='已确认'
//         }else if(i.confirmstatus==800){
//           i.confirmstatus='已提交'
//         }else if(i.confirmstatus==900){

//           i.confirmstatus='对账中'
//         }else if(i.confirmstatus==1100){

//           i.confirmstatus='已审单'
//         }
//           ysconfirm.push(i.confirmstatus)

//         }else if(i.wageinout==2){
//                if(i.yssys==2&&i.confirmstatus==1&&i.operid>0){
//         this.yingfuStr.push(i.wagedom)
//        }

//            if(i.confirmstatus==1){
//           i.confirmstatus='--'
//         }else if(i.confirmstatus==700){
//           i.confirmstatus='已确认'
//         }else if(i.confirmstatus==800){
//           i.confirmstatus='已提交'
//         }else if(i.confirmstatus==900){

//           i.confirmstatus='对账中'
//         }else if(i.confirmstatus==1100){

//           i.confirmstatus='已审单'
//         }

//           yfconfirm.push(i.confirmstatus)

//         }


//       })

//       this.zdtotalCharge=totalCharge.toFixed(2)
//       this.zdtotalPayment=totalPayment.toFixed(2)


// var ysgid=[]

//       this.mawbCharge.forEach(item=>{
// if(!ysgid.includes(item.gid)){
//   this.yssettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
//    ysgid.push(item.gid)
// }
//       })



//       var yfgid=[]

//         this.mawbPayment.forEach(item=>{
// if(!yfgid.includes(item.gid)){
//   this.yfsettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
//   yfgid.push(item.gid)
// }

//         })


// if(this.activeSettnameYs!=0||this.activeSettnameYs!=''){
// this.handleSettname(1,this.activeSettnameYs)
// }else{

//   this.handleSettname(1,'')//默认显示全部结算对象
// }

// if(this.activeSettnameYf!=0||this.activeSettnameYf!=''){
// this.handleSettname(2,this.activeSettnameYf)
// }else{

//   this.handleSettname(2,'')//默认显示全部结算对象
// }

// this.setNameStatus()//各个结算对象确认状态



//       if(ysconfirm.length>0){


//         if(ysconfirm.indexOf('已确认')!=-1||ysconfirm.indexOf('对账中')!=-1){
//           if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
//             this.ysConfirm=true
//             this.ysUconfirm=true
//           }else{
//             this.ysUconfirm=false
//           }

//           this.ysDz=false

//         }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){

//             this.ysDz=false
//             this.ysUconfirm=true
//         }else{
//           this.ysUconfirm=true
//         }


//         if(ysconfirm.indexOf('--')!=-1){

//           if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
//              this.ysConfirm=true
//             this.ysConfirm=true
//           }else{
//             this.ysConfirm=false
//           }

//         }else{
//           this.ysConfirm=true
//         }


//       }else{
//         this.ysConfirm=false
//         this.ysUconfirm=false
//         this.ysDz=true
//       }


//       if(yfconfirm.length>0){

//        if(yfconfirm.indexOf('已确认')!=-1||yfconfirm.indexOf('对账中')!=-1){
//           this.yfUconfirm=false
//           this.yfDz=false

//         }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){

//             this.yfDz=false
//             this.yfUconfirm=true
//         }else{
//           this.yfUconfirm=true
//         }

//         if(yfconfirm.indexOf('--')!=-1){
//           this.yfConfirm=false

//         }else{
//           this.yfConfirm=true
//         }
//       }else{

//         this.yfConfirm=false
//         this.yfUconfirm=false
//         this.yfDz=true
//       }
//       this.allDataCostStatus()


// this.yingShouFuStaticAll()



//       if(!this.isFromFob){
//          this.checkModel()
//       }else{
//          this.currencyCost={charge:[],payment:[],profit:[]}
//           var currencyAlone=[]
//              this.mawbCharge.forEach(item=>{
//           if(!currencyAlone.includes(item.currency)){
//             currencyAlone.push(item.currency)
//         var numC=0

//           this.mawbCharge.forEach((item3,index3)=>{
//             if(item3.currency==item.currency&&item3.isfree=='否'){
//               numC+=Number(item3.leastwageall)
//             }

//         })

// this.currencyCost.charge.push({currency:item.currency,money:numC.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})

//       }
//      })
//       }

//       this.otherWageinList=JSON.parse(JSON.stringify(this.mawbCharge))
//       this.otherWageoutList=JSON.parse(JSON.stringify(this.mawbPayment))

    })

  },
  logActiveClick(index){
  	 this.mawbCharge=[]
  	 this.mawbPayment=[]
  	 this.yssettname=[]
  	 this.yfsettname=[]
  	 this.mawbChargeLine=[]
  	 this.toolTip=[]
  	this.logActive=index
  	this.currencyCost={charge:[],payment:[],profit:[]}
    this.mawbCharge=this.mawbApplyCost[index].commitwageList.filter(item=>{return item.wageinout=='1'})
    this.mawbPayment=this.mawbApplyCost[index].commitwageList.filter(item=>{return item.wageinout=='2'})
    var currencyAlone=[]
    var totalCharge=0
    var totalPayment=0
console.log(this.mawbPayment)
var yfgid=[]
this.mawbPayment.forEach(item=>{

if((item.isfree=='1'||item.isfree=='否')||item.method!='DELETE'){
	totalPayment+=Number(item.leastwageall)
}
item.settname=this.gidChange(item.gid,'2')
item.isfree=item.isfree=='1'||item.isfree=='否'?'否':'是'
item.price=Number(item.price).toFixed(2)
item.wageall=Number(item.wageall).toFixed(2)
item.leastwageall=Number(item.leastwageall).toFixed(2)
item.changerate=Number(item.changerate).toFixed(4)
if(item.method=='DELETE'){
	this.$set(item,'background','#BABABA')
}else if(item.method=='POST'){
	this.$set(item,'background','#F7A6A6')
}else if(item.method=='PUT'){
	this.$set(item,'background','#5CC85C')
}else{
	this.$set(item,'background','#fff')
}
if(!yfgid.includes(item.gid)){
  this.yfsettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
  yfgid.push(item.gid)
}
})


var ysgid=[]
this.mawbCharge.forEach(item=>{

if((item.isfree=='1'||item.isfree=='否')||item.method!='DELETE'){
	totalCharge+=Number(item.leastwageall)
}
item.settname=this.gidChange(item.gid,'1')
item.isfree=item.isfree=='1'||item.isfree=='否'?'否':'是'
item.price=Number(item.price).toFixed(2)
item.wageall=Number(item.wageall).toFixed(2)
item.leastwageall=Number(item.leastwageall).toFixed(2)
item.changerate=Number(item.changerate).toFixed(4)

if(item.method=='DELETE'){
	this.$set(item,'background','#BABABA')
}else if(item.method=='POST'){
	this.$set(item,'background','#F7A6A6')
}else if(item.method=='PUT'){
	this.$set(item,'background','#5CC85C')
}else{
	this.$set(item,'background','#fff')
}

if(!ysgid.includes(item.gid)){
  this.yssettname.push({'settname':$.trim(item.settname),'gid':item.gid,'status':''})
  ysgid.push(item.gid)
}
})

// 总应收总应付人民币
this.zdtotalCharge=totalCharge.toFixed(2)
this.zdtotalPayment=totalPayment.toFixed(2)


     // 每个结算对象应收付分币种
     this.mawbApplyCost[index].commitwageList.forEach(item=>{
      if(!currencyAlone.includes(item.currency)){
        currencyAlone.push(item.currency)
        var numC=0
        var numP=0

          this.mawbCharge.forEach((item3,index3)=>{
            if((item3.currency==item.currency&&item3.isfree=='否'&&item3.method!='DELETE')||(item3.thisListHide&&item3.ismodify=='999')){
              numC+=Number(item3.leastwageall)
            }

        })
            this.mawbPayment.forEach((item2,index2)=>{
            if((item2.currency==item.currency&&item2.isfree=='否'&&item2.method!='DELETE')||(item2.thisListHide&&item2.ismodify=='999')){
              numP+=Number(item2.leastwageall)
            }

        })

this.currencyCost.charge.push({currency:item.currency,money:numC.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})
this.currencyCost.payment.push({currency:item.currency,money:numP.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})

      }
     })
this.handleSettname(1,'')
this.handleSettname(2,'')
this.checkModel()

  },
        changeDirection(type){
       var clientWidth=0
      if(type==1){
        this.arrowIndex--;
        if(this.arrowIndex<0){
          layer.msg('已至头部');
          this.arrowIndex=0
          return false;
        }
      }else if(type==2){

        $('.costItemsList').find('li').each(function(){
          //console.log(clientWidth)
          //console.log($(this).innerWidth())
          clientWidth=clientWidth+$(this).innerWidth()
        })
        //console.log(clientWidth)
        if(clientWidth<710){
           this.arrowIndex=0
         return false
        }else{
          this.arrowIndex++
        }
        //console.log(clientWidth-720)
        //console.log(Math.ceil((clientWidth-720)/200))
        if(this.arrowIndex>Math.ceil((clientWidth-710)/200)){
          layer.msg('已至尾部');
          this.arrowIndex=Math.ceil((clientWidth-710)/200)
          return false
        }
      }
      //console.log(this.arrowIndex)
       $('.costItemsList').css('transform','translateX(-'+this.arrowIndex*200+'px)')


    },
  gidChange(gid,type){
  	let settname=''
  	let pageDataBackups=[]
   if(type=='1'){
   	 pageDataBackups= getxmdata('wtxm')
   }else{
   	 pageDataBackups= getxmdata('gysxm')
   }
   console.log(pageDataBackups)
   pageDataBackups.forEach(item=>{
     if(item.id==gid){

     	settname=item.usr_name
     }
   })
   //console.log(settname)
return settname


  },
  applyPass(type){
  	if(type=='500'){
  		var data={boguid:this.boguid,status:type,commitreason:''}
  	}else if(type=='200'){
  		//var reson
  		this.applyCostData.forEach(item=>{
  			if(item.isfree=='否'||item.isfree=='1'){
  				item.isfree='1'
  			}else{
  				item.isfree='2'
  			}
  		})

      if(!this.delbillreason){
        this.$message.error('请填写驳回原因');
        return false
      }

  		var obb=[{"accountname":"费用申请驳回",'reasontype':'费用申请驳回',"delbillreason":this.delbillreason,"delbillman":localStorage.getItem('usrname'),"delbilldate":getMomentDate(),"delbillreasonJson":this.applyCostData,area:this.area}]
  		var data={boguid:this.boguid,status:type,commitreason:JSON.stringify(obb)}
  	}
  	 this.$axios({method:'PUT',url:this.$store.state.webApi+'api/ExBoBaseWageCommit',data:data,loading:true,tip:false,noarea:'1'})
  	 .then(results=>{
         if(results.data.resultstatus==0){
           this.$message.success(results.data.resultmessage)
           this.$emit('unvisible','1')//审批完成打开费用未确认页面
         }else{
            this.$message.error(results.data.resultmessage)
         }
  	 })
  	 .catch(error=>{

  	 })

  },
  applyBack(){
    this.applyShow=true
    this.applyCostData.forEach(item=>{
    	this.$set(item,'delbillreason','')
    })
  },

  salesCost(){//销售站费用信息
     this.$axios({method:'get',url:this.$store.state.webApi+'api/ExHpoAxplineWage',params:{sid: this.mawbguid,boguid:this.orderguid},loading:true,tip:false})
     .then(results=>{
      console.log(results.data)
      //alert('1')
          var num=0
          results.data.forEach(item=>{
            if(item.yssys=='2'){
              num+=item.confirmstatus
            }
          })
          console.log(num)
          if(num>2){
            //alert('1')
            this.applyCost=true
          }
     })
     .catch(error=>{

     })
  },
  //切换结算对象
  handleSettname(type,val,gidIndex){ //type 1应收 2应付  val结算对象gid
    //alert('3')
    this.wageguids=this.wageguidf=[]

    this.wageCostAllYs=this.wageCostAllYf=this.allYsDisabled=this.allYfDisabled=false


    //this.activeSettnameYs=val
    //alert(this.activeSettnameYs)
    var changeData=[]
    var activeysf=""

   if(type=='1'){
         this.currentGidCost.charge=[]
         changeData=this.mawbCharge
         this.activeSettnameYs=val
         this.ysGidIndex=gidIndex
         activeysf=val
         if(val!=''){//切换结算对象不为空时，默认当前结算对象无法修改
          this.curObjectKyYs.gid=val
          this.curObjectKyYs.disabled=true
         }else if(val==0||val==''){//切换结算对象为空时，默认初始结算对象
         if(Number(this.orderguid)>0){
            this.curObjectKyYs.gid=Number(this.orderpgid)

          }else{
            this.curObjectKyYs.gid=this.mawbInformation.gid

          }
          this.curObjectKyYs.disabled=false//所有多选框都能选择

          //this.yingShouFuStatic(this.mawbCharge)//控制总应收付确认按钮
        }

    }else if(type=='2'){
       this.currentGidCost.payment=[]
        changeData=this.mawbPayment
        this.activeSettnameYf=val
        this.yfGidIndex=gidIndex
        activeysf=val
        if(val!=''){//切换结算对象不为空时，默认当前结算对象无法修改
        this.curObjectKyYf.gid=val
        this.curObjectKyYf.disabled=true
        }else if(val==0||val==''){//切换结算对象为空时，默认初始结算对象
        this.curObjectKyYf.gid=this.gysId
        this.curObjectKyYf.disabled=false
        //this.yingShouFuStatic(this.mawbPayment)//控制总应收付确认按钮
        }
       }

    if(activeysf==''||activeysf==0){//如果当前结算对象为空则表示显示全部
      changeData.forEach(item=>{
        this.$set(item,'thisListHide',false)
      })
    }else{
      changeData.forEach(item=>{//当前匹配的结算对象显示，不匹配隐藏
        if(String(item.gid)!=activeysf){
           this.$set(item,'thisListHide',true)
        }else{
          this.$set(item,'thisListHide',false)
        }

      })
    }


 var currencyAlone=[]

    var newData=[];
    changeData.forEach(item=>{//当前匹配结算对象确认状态

      if(item.thisListHide==false){
        newData.push(item)
        if(!currencyAlone.includes(item.currency)){
          currencyAlone.push(item.currency)
        }

        // if(!currencyAlone.includes(item.currency)){
        //     currencyAlone.push(item.currency)
        //     if(item.isfree=='否'){
        //       num+=Number(item.leastwageall)
        //       if(type=='1'){
        //          this.currentGidCost.charge.push({currency:item.currency,money:num,currencyFh:this.currencyFuHao[item.currency]})
        //        }else if(type=='2'){
        //         this.currentGidCost.payment.push({currency:item.currency,money:num,currencyFh:this.currencyFuHao[item.currency]})
        //        }

        //     }
        // }

      }
    })

       currencyAlone.forEach(item=>{//每个结算对象总收付
        var num=0
          changeData.forEach(item2=>{

          if(item2.isfree=='否'&&item==item2.currency&&item2.thisListHide==false&&item2.method!="DELETE"){
             num+=Number(item2.leastwageall)
          }

          })
          if(type=='1'){
           this.currentGidCost.charge.push({currency:item,money:Number(num).toFixed(2),currencyFh:this.currencyFuHao[item]})
          }else if(type=='2'){
          this.currentGidCost.payment.push({currency:item,money:Number(num).toFixed(2),currencyFh:this.currencyFuHao[item]})
          }
        })
    //this.yingShouFuStatic(newData)
   // alert('4')
    //this.yingShouFuStaticAll()

  },

      changeDirectionAcn(type,wageinout){
        if(wageinout=='1'){
            var clientWidth=0
      if(type==1){
        // if(this.ysarrowLeft){
        //   return false
        // }
        this.arrowAcnIndex--;
        if(this.arrowAcnIndex<0){
          layer.msg('已至头部');
          this.arrowAcnIndex=0
          return false;
        }
      }else if(type==2){
        // if(this.ysarrowRight){
        //   return false
        // }
        $('.setnameAll').find('span').each(function(){
          clientWidth=clientWidth+$(this).outerWidth()
        })
        if(clientWidth<820){
           this.arrowAcnIndex=0
         return false
        }else{
          this.arrowAcnIndex++
        }
        if(this.arrowAcnIndex>Math.ceil((clientWidth-820)/160)){
          layer.msg('已至尾部');
          this.arrowAcnIndex=Math.ceil((clientWidth-820)/160)
          return false
        }
      }

       $('.setnameAll').css('transform','translateX(-'+this.arrowAcnIndex*160+'px)')
     }else{
            var clientWidth=0
      if(type==1){
        // if(this.yfarrowLeft){
        //   return false
        // }
        this.arrowAcnIndexf--;
        if(this.arrowAcnIndexf<0){
          layer.msg('已至头部');
          this.arrowAcnIndexf=0
          return false;
        }
      }else if(type==2){
        // if(this.yfarrowRight){
        //   return false
        // }
        $('.setnameAllf').find('span').each(function(){
          clientWidth=clientWidth+$(this).outerWidth()
        })
        if(clientWidth<820){
           this.arrowAcnIndexf=0
         return false
        }else{
          this.arrowAcnIndexf++
        }
        if(this.arrowAcnIndexf>Math.ceil((clientWidth-820)/160)){
          layer.msg('已至尾部');
          this.arrowAcnIndexf=Math.ceil((clientWidth-820)/160)
          return false
        }
      }

       $('.setnameAllf').css('transform','translateX(-'+this.arrowAcnIndexf*160+'px)')
     }

      },
  //去重数组对象

     // unique(arr) {
     //  console.log(arr)
     //        var res = [arr[0]];
     //        for (var i = 0; i < arr.length; i++) {
     //            var repeat = false;
     //            for (let j = 0; j < res.length; j++) {
     //                if (this.isObjectValueEqual(arr[i], res[j])) {
     //                    repeat = true;
     //                    break;
     //                }
     //            }
     //            if (!repeat) {
     //                res.push(arr[i]);
     //            }
     //        }
     //        return res;
     //    },

     //    isObjectValueEqual(a, b) {
     //        var aProps = Object.getOwnPropertyNames(a);
     //        var bProps = Object.getOwnPropertyNames(b);
     //        if (aProps.length != bProps.length) {
     //            return false;
     //        }
     //        for (var i = 0; i < aProps.length; i++) {
     //            var propName = aProps[i];
     //            if (a[propName] !== b[propName]) {
     //                return false;
     //            }
     //        }
     //        return true;
     //    },
        // =======================
    //分单费用
   hawbCost(){
/*     if(this.cur_hawb){
      this.hawb_data_list[this.cur_hawb].hawbCharge=[]
    this.hawb_data_list[this.cur_hawb].hawbPayment=[]
    this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxplineWage',params:{sid: this.curHawbGuid},loading:false,tip:false}).then(results=>{

          results.data.forEach(i => {
            if(i.yssys!=2){
              i.num=i.wagetype=='票'?i.num:Number(i.num).toFixed(2)
              i.price=Number(i.price).toFixed(2)
        i.wageall=Number(i.wageall).toFixed(2)
        i.leastwageall=Number(i.leastwageall).toFixed(2)
        i.changerate=Number(i.changerate).toFixed(4)
            i.isfree == 1 ? i.isfree = '否' : i.isfree = '是'
            if (i.wageinout == 1) {
              this.hawb_data_list[this.cur_hawb].hawbCharge.push(i)
            } else if (i.wageinout == 2) {
              this.hawb_data_list[this.cur_hawb].hawbPayment.push(i)
              if(i.isfree=='否'){
              }
            }

            }


        })
        })

    } */


  },

  //应收付费用相加
  totalPCCharge(payment){
     var total=0
     payment.forEach(item=>{
       if(item.isfree=='否'){
                total+=Number(item.wageall)
         }
     })
     return total
  },


  //查询总单下所有分单
  getAllHawb(){
      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAxpline',params:{hpoidHawbGroup:this.mawbguid},loading:true,tip:false}).then(results=>{
        //console.log("分单号")
        var resultsData=results.data
        var hawbShow=""
        for(var i in resultsData){
           this.hawbList.push({name:resultsData[i].hawb,id:resultsData[i].guid})
           hawbShow+=resultsData[i].hawb+','
        }
        this.hawbShow=hawbShow.substring(0,hawbShow.length-1)
        //console.log(this.hawbList)
        // this.guidHawbGroup=results.data

        // this.hawb_list = this.guidHawbGroup.map(function(item){
        //   this.hawbList.push(item.hawb)
        // })



      })
  },
  //对账弹框
  recon(type){
   this.showRecon=true
   this.wageinout=type
  },

  back(){
this.$emit('unvisible', false)
  },
  // 验证
  yanzhenzzF(type,dom,field){
    if(dom=='1'&&type=='1'&&field=='num'){
      if(this.curObjectKyYs.wagetype=='票'){
        var reg=/^[1-9]\d*$/
     if(this.curObjectKyYs.num&&!reg.test(this.curObjectKyYs.num)){
      this.$message({
        message: '请输入整数',
        type:'error',
        duration:1000
      })
       this.curObjectKyYs.num=''
     }
   }else{
    var reg=/^[0-9]+.?[0-9]{0,2}?$/
     if(this.curObjectKyYs.num&&!reg.test(this.curObjectKyYs.num)){
      this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })
       this.curObjectKyYs.num=''
     }
   }

    }else if(dom=='1'&&type=='1'&&field=='price'){
        var reg=/^(\-?)[0-9]+.?[0-9]{0,2}?$/
        if(this.curObjectKyYs.price&&!reg.test(this.curObjectKyYs.price)){
           this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })
            //this.$message.error('请输入整数或者2位小数')
       this.curObjectKyYs.price=''
     }
    }else if(dom=='1'&&type=='2'&&field=='price'){
        var reg=/^(\-?)[0-9]+.?[0-9]{0,2}?$/
        if(this.curObjectKyYf.price&&!reg.test(this.curObjectKyYf.price)){
           this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })
            //this.$message.error('请输入整数或者2位小数')
            this.curObjectKyYf.price=''
    }

  }else if(dom=='1'&&type=='2'&&field=='num'){
      if(this.curObjectKyYf.wagetype=='票'){
var reg=/^[1-9]\d*$/
     if(this.curObjectKyYf.num&&!reg.test(this.curObjectKyYf.num)){
      this.$message({
        message: '请输入整数',
        type:'error',
        duration:1000
      })
       this.curObjectKyYf.num=''
     }
      }else{
         var reg=/^[0-9]+.?[0-9]{0,2}?$/
     if(this.curObjectKyYf.num&&!reg.test(this.curObjectKyYf.num)){
      this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })
       this.curObjectKyYf.num=''
     }
      }

  }else if(dom=='2'&&type=='2'&&field=='num'){
     if(this.curObjectFdYf.wagetype=='票'){
var reg=/^[1-9]\d*$/
     if(this.curObjectFdYf.num&&!reg.test(this.curObjectFdYf.num)){
      this.$message({
        message: '请输入整数',
        type:'error',
        duration:1000
      })
       this.curObjectFdYf.num=''
     }
     }else{
      var reg=/^[0-9]+.?[0-9]{0,2}?$/
     if(this.curObjectFdYf.num&&!reg.test(this.curObjectFdYf.num)){
      this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })
       this.curObjectFdYf.num=''
     }
     }

   }else if(dom=='2'&&type=='2'&&field=='price'){
      var reg=/^[0-9]+.?[0-9]{0,2}?$/
        if(this.curObjectFdYf.price&&!reg.test(this.curObjectFdYf.price)){
        this.$message({
        message: '请输入整数或者2位小数',
        type:'error',
        duration:1000
      })

       this.curObjectFdYf.price=''
    }
   }


},
onScroll:function(e, position){
 this.position = position;

  if($('.tableWrap').length>0){

                 $('.tableWrap').scrollLeft(position.scrollLeft)

              }
},
// true:disabled
// 是否能够点击删除按钮
showUconfirmF(type,data){
  if(Number(this.orderguid)>0){//操作站
     if(type=='1'){//应收
       if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
          if(data.belong==2||data.confirmstatus!='--'){
          if(!this.applyModel){
            return true
          }else{
            return false
          }

        }else{

          return false
        }
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
        if(!this.applyModel){

         return true
        }else{
          return false
        }

       }else{                                          //无分配模式
        if(data.belong==2||data.confirmstatus!='--'){
          if(!this.applyModel){
            return true
          }else{
            return false
          }

        }else{
          return false

        }
       }
     }
     if(type=='2'){//应付
         if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
           if(data.belong==2||data.confirmstatus!='--'){
            if(!this.applyModel){
              return true
            }else{
              return false
            }

        }else{
          return false
        }
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
          if(data.confirmstatus!='--'){
            if(!this.applyModel){
               return true
             }else{
              return false
             }

          }else{
            return false
          }

       }else{                                       //无分配模式
          return false
       }
     }
  }else{//销售站
     if(type=='1'){//应收
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
              if(data.belong==2||data.confirmstatus!='--'){
          return true
          // this.deleteYSA=true
        }else{
          return false
          // this.deleteYSA=false
        }
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
            if(data.belong==2||data.confirmstatus!='--'){
               return true
               //this.deleteYSA=true
            }else{
              return false
               //this.deleteYSA=false
            }
        }else{                                            //无分配模式
          if(data.belong==2||data.confirmstatus!='--'){
          return true
         // this.deleteYSA=true
        }else{
          return false
         // this.deleteYSA=false
        }
        }
     }
     if(type=='2'){//应付
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
             if(data.belong==3||data.confirmstatus!='--'){//已确认或者belong值为3
              return true
            }else{
              return false
            }
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
            if(data.belong==3||data.confirmstatus!='--'){//已确认或者belong值为3
              return true
            }else{
              return false
            }
        }else{                                          //无分配模式
          return false
        }
     }
  }


  // if(data.belong==2){
  //    return true
  // }else if(data.confirmstatus!='--'){
  //   return true
  // }else{
  //   return false
  // }
},

// 是否可以点击修改按钮
disabledEdit(type,data){
if(Number(this.orderguid)>0){//操作站
     if(type=='1'){//应收
       if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
          return false
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
         if(!this.applyModel){//非申请模式
          return true
        }else{
          return false
        }

       }else{                                       //无分配模式
          if(data.confirmstatus!='--'){
            if(!this.applyModel){
              return true
            }else{
              return false
            }

          }else{
            return false
          }


       }
     }
     if(type=='2'){//应付
         if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
           return false
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
          if(data.confirmstatus!='--'){
            if(!this.applyModel){
               return true
             }else{
              return false
             }

          }else{
            return false
          }
       }else{                                      //无分配模式
          if(data.confirmstatus!='--'){
            if(!this.applyModel){
              return true
            }else{
              return false
            }

          }else{
            return false
          }
       }
     }
  }else{//销售站
     if(type=='1'){//应收
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
             return false
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
            if(data.confirmstatus!='--'){
            return true
          }else{
            return false
          }
           //return false
        }else{                                   //无分配模式
           if(data.confirmstatus!='--'){
            return true
          }else{
            return false
          }
        }
     }
     if(type=='2'){//应付
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
            if(data.belong==3||data.confirmstatus!='--'){//已确认或者belong值为3
              return true
            }else{
              return false
            }
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
           if(data.belong==3||data.confirmstatus!='--'){//已确认或者belong值为3
              return true
            }else{
              return false
            }
        }else{                                         //无分配模式
          if(data.confirmstatus!='--'){
            return true
          }else{
            return false
          }
        }
     }
  }

},
//是否可以点击添加按钮
disabledAdd(type){
if(Number(this.orderguid)>0){//操作站
     if(type=='1'){//应收
       if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
         if(!this.allysUconfirm){//费用总确认了
          if(this.applyModel){
            return false
          }else{
            return true
          }
         }else{
          return false
         }
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式

       if(this.applyModel){
        return false
       }else{
        return true
       }
       }else{                                      //无分配模式
        if(!this.allysUconfirm){//费用总确认了
          if(this.applyModel){
            return false
          }else{
            return true
          }
         }else{
          return false
         }

       }
     }
     if(type=='2'){//应付
         if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
            if(!this.allysUconfirm){//费用总确认了
          if(this.applyModel){
            return false
          }else{
            return true
          }
        }else{
          return false
        }
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
           if(!this.allysUconfirm){//费用总确认了
          if(this.applyModel){
            return false
          }else{
            return true
          }
        }else{
          return false
        }
       }else{                                       //无分配模式
         if(!this.allysUconfirm){//费用总确认了
          if(this.applyModel){
            return false
          }else{
            return true
          }
        }else{
          return false
        }
       }

     }

  }else{//销售站
     if(type=='1'){//应收
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
             if(this.allysUconfirm){
              return false
            }else{
              return true
            }

          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
           if(this.allysUconfirm){
              return false
            }else{
              return true
            }
        }else{                                     //无分配模式
          if(this.allysUconfirm){
              return false
            }else{
              return true
            }
        }
     }
     if(type=='2'){//应付
        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
            if(this.allysUconfirm){
              return false
            }else{
              return true
            }
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
            if(this.allysUconfirm){
              return false
            }else{
              return true
            }
        }else{                                        //无分配模式
            if(this.allysUconfirm){
              return false
            }else{
              return true
            }
        }

     }
  }



},

//取消应收所有费用是否能点击
yingShouDA(){
var disableNo=1
 this.mawbCharge.forEach(item=>{
   if(Number(this.orderguid)>0){//操作站

       if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
          if(item.belong==2||item.confirmstatus!='--'){


        }else{
          disableNo=0
        }
       }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
         //disableNo=1

       }else{                                          //无分配模式
        if(item.belong==2||item.confirmstatus!='--'){


        }else{
          disableNo=0
        }
       }


  }else{//销售站

        if(this.profitmode.indexOf('Co-load')!=-1){//coload模式
              if(item.belong==2||item.confirmstatus!='--'){


        }else{
          disableNo=0
        }
          }else if(this.profitmode.indexOf('利润')!=-1){//利润分配模式
            if(item.belong==2||item.confirmstatus!='--'){
               //disableNo=1

            }else{
              disableNo=0
            }
        }else{
        //debugger;                                     //无分配模式
          if(item.belong==2||item.confirmstatus!='--'){
          //disableNo=1

        }else{
           disableNo=0
        }
        }


  }
 })
 console.log(disableNo)
 if(disableNo==0){
  return false
 }else{
  return true
 }
},

//验证状态
yingShouFuStatic(data){
 // alert('1')
  var ysconfirm=[]
  var yfconfirm=[]
   data.forEach(i => {

          if(i.wageinout == 1){
            ysconfirm.push(i.confirmstatus)
          }else if (i.wageinout == 2) {

          yfconfirm.push(i.confirmstatus)

        }

      })
//console.log(ysconfirm.length)
setTimeout(()=>{
      if(ysconfirm.length>0){

        if(ysconfirm.indexOf('已确认')!=-1||ysconfirm.indexOf('对账中')!=-1){

          if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){

            this.ysConfirm=true
            this.ysUconfirm=true
          }else{
            this.ysUconfirm=false
          }

          this.ysDz=false

        }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){

            this.ysDz=false
            this.ysUconfirm=true
        }else{
          this.ysUconfirm=true
        }


        if(ysconfirm.indexOf('--')!=-1){
            //alert('1')
          if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
            this.ysConfirm=true
            this.ysConfirm=true
          }else{
        //alert('2')
            this.ysConfirm=false
          }

        }else{

          this.ysConfirm=true

        }


      }


      if(yfconfirm.length>0){

       if(yfconfirm.indexOf('已确认')!=-1||yfconfirm.indexOf('对账中')!=-1){
          this.yfUconfirm=false
          this.yfDz=false

        }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){

            this.yfDz=false
            this.yfUconfirm=true
        }else{
          this.yfUconfirm=true
        }

        if(yfconfirm.indexOf('--')!=-1){
          this.yfConfirm=false

        }else{
          this.yfConfirm=true
        }
      }
    },500)


      //this.$forceUpdate()



},

yingShouFuStaticAll(){

  var data=this.mawbCharge.concat(this.mawbPayment)

  var ysconfirm=[]
  var yfconfirm=[]
   data.forEach(i => {

          if(i.wageinout == 1){
            ysconfirm.push(i.confirmstatus)
          }else if (i.wageinout == 2) {

          yfconfirm.push(i.confirmstatus)

        }

      })
//console.log(ysconfirm)
//debugger;
setTimeout(()=>{
   if(ysconfirm.length>0){
        if(ysconfirm.indexOf('--')!=-1){
           if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){

           this.allysConfirm=true
          }else{
            this.allysConfirm=true
          }
        }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){
          this.allysConfirm=true

        }else{
          if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){

            this.allysConfirm=true

          }else{
            this.allysConfirm=false
          }



        }

        // if(ysconfirm.indexOf('已确认')!=-1||ysconfirm.indexOf('对账中')!=-1){
        //   if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
        //    //this.allysConfirm=true
        //    this.allysConfirm=true
        //   }else{
        //     this.allysConfirm=false
        //   }
        // }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){
        //    this.allysConfirm=true
        // }else{
        //  this.allysConfirm=true
        // }
        // if(ysconfirm.indexOf('--')!=-1){
        //   if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
        //      this.allysConfirm=true
        //   }else{
        //     this.allysConfirm=false
        //   }
        // }else{
        //    this.allysConfirm=true
        // }
      }else if(ysconfirm.length==0){

        if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){

          this.allysConfirm=true

          }else{
            this.allysConfirm=false
          }



      }


        if(yfconfirm.length>0){
         if(yfconfirm.indexOf('--')!=-1){
            this.allyfConfirm=true
          }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){
          this.allyfConfirm=true
          }else{
            this.allyfConfirm=false
          //    if(this.allyfUconfirm){
          //   this.allyfConfirm=false
          // }else{
          //   this.allyfConfirm=true
          // }
          }

      }else if(yfconfirm.length==0){
         this.allyfConfirm=false
      }
       // if(yfconfirm.indexOf('已确认')!=-1||yfconfirm.indexOf('对账中')!=-1){
       //    this.allyfConfirm=false
       //  }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){
       //    this.allyfConfirm=true
       //  }else{
       //    this.allyfConfirm=true
       //  }
       //  if(yfconfirm.indexOf('--')!=-1){
       //  this.allyfConfirm=false
       //  }else{
       //    this.allyfConfirm=true
       //  }

//this.$forceUpdate()
},500)


},
allDataCostStatus(){
  var ysconfirm=[]
  var yfconfirm=[]
   this.allCostData.forEach(i => {

          if(i.wageinout == 1){
            ysconfirm.push(String(i.confirmstatus))
          }else if (i.wageinout == 2) {

          yfconfirm.push(String(i.confirmstatus))

        }

      })
   console.log(this.allCostData)

setTimeout(()=>{
      if(ysconfirm.length>0){
        if(ysconfirm.indexOf('--')!=-1||ysconfirm.indexOf('1')!=-1){
           if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
            this.allysUconfirm=true
          }else{
            this.allysUconfirm=true
        }

          }else if(ysconfirm.indexOf('已提交')!=-1||ysconfirm.indexOf('已审单')!=-1){
            this.allysUconfirm=true
          }else{
            if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){
            this.allysUconfirm=true
          }else{
            this.allysUconfirm=false
          }
      }
}else if(ysconfirm.length==0){
if(this.orderguid>0&&this.profitmode.indexOf('利润')!=-1){

          this.allysUconfirm=true

          }else{
            this.allysConfirm=false
          }
}

      if(yfconfirm.length>0){
  if(yfconfirm.indexOf('--')!=-1||yfconfirm.indexOf('1')!=-1){
this.allyfUconfirm=true
  }else if(yfconfirm.indexOf('已提交')!=-1||yfconfirm.indexOf('已审单')!=-1){
this.allyfUconfirm=true
  }else{
    this.allyfUconfirm=false
  }
  }

    },500)
},

//核对模式
checkModel(){
        var itemsArrPayment=[]
      var itemsArrCharge=[]
      console.log(this.mawbPayment.length)
      console.log(this.mawbCharge.length)
      var costAll=this.mawbCharge.concat(this.mawbPayment)
      //var currencyAlone=[]


   //**********************************若要匹配isshare和guid,这边需重新编写数组item.items+item.guid，和一个新itemsArrCharge数组
      this.mawbPayment.forEach(item=>{
        itemsArrPayment.push(item.items)
      })
//console.log(itemsArrPayment)

      this.mawbCharge.forEach(item=>{
        itemsArrCharge.push(item.items)
      })
//console.log(itemsArrCharge)
      //console.log(this.mawbCharge)

//      costAll.forEach(item=>{
//       if(!currencyAlone.includes(item.currency)){
//         currencyAlone.push(item.currency)
//         var numC=0
//         var numP=0

//           this.mawbCharge.forEach((item3,index3)=>{
//             if(item3.currency==item.currency&&item3.isfree=='否'){
//               numC+=Number(item3.leastwageall)
//             }

//         })

//             this.mawbPayment.forEach((item2,index2)=>{
//             if(item2.currency==item.currency&&item2.isfree=='否'){
//               numP+=Number(item2.leastwageall)
//             }

//         })



// this.currencyCost.charge.push({currency:item.currency,money:numC.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})
// this.currencyCost.payment.push({currency:item.currency,money:numP.toFixed(2),currencyFh:this.currencyFuHao[item.currency]})
// this.currencyCost.profit.push({currency:item.currency,money:(numC-numP).toFixed(2),currencyFh:this.currencyFuHao[item.currency]})


//       }
//      })
// console.log(this.currencyCost)
     // currencyAlone.forEach(item=>{

     // })










//console.log(itemsArrCharge)
      var totalIndex=[]

itemsArrPayment.forEach((item,index)=>{

var arrIndex=itemsArrCharge.indexOf(item)
var itemIndex=this.findall(itemsArrCharge,item)

this.itemsReocrder[item]=Number(this.itemsReocrder[item])>=0?(Number(this.itemsReocrder[item])+1):0


//console.log(this.itemsReocrder)

if(arrIndex>=0){
  if(totalIndex.indexOf(arrIndex)==-1){
 this.mawbCharge[arrIndex].isshowActive=0
 this.mawbChargeLine.push(this.mawbCharge[arrIndex])
 this.$forceUpdate()
 totalIndex.push(arrIndex)

}else{
  arrIndex=itemsArrCharge.indexOf(item,itemIndex[this.itemsReocrder[item]])

if(arrIndex>0){
   if(totalIndex.indexOf(arrIndex)==-1){
  this.mawbCharge[arrIndex].isshowActive=0
 this.mawbChargeLine.push(this.mawbCharge[arrIndex])
  this.$forceUpdate()
 totalIndex.push(arrIndex)
}else{
this.mawbChargeLine.push({isshowActive:0,items:item})
}
}else{
this.mawbChargeLine.push({isshowActive:0,items:item})
}

}
}


// if(arrIndex.length>0){
//   arrIndex.forEach(item2=>{
//   var itemIndex=itemsArrCharge.indexOf(item,item2)
//   if(totalIndex.indexOf(itemIndex)==-1){
//  this.mawbCharge[itemIndex].isshowActive=0
//  this.mawbChargeLine.push(this.mawbCharge[itemIndex])
//  this.$forceUpdate()
//  totalIndex.push(itemIndex)
// }
//   })
// }
if(arrIndex<0){//若加入isshare和guid,找不到匹配的通过服务项目查找,重复上面操作,使用逗号隔开在新itemsArrCharge数组中查找位置
  this.mawbChargeLine.push({isshowActive:0,items:item})
}


})
console.log(this.mawbChargeLine)
//console.log(this.itemsReocrder)

     this.mawbCharge.forEach((item,index)=>{
      if(totalIndex.indexOf(index)==-1){
        item.isshowActive=1
        this.mawbChargeLine.push(item)
      }
     })

      //console.log(JSON.stringify(this.mawbChargeLine))

      var temToolTip=[]
    this.mawbChargeLine.forEach((item,index)=>{
       if(item.isshowActive==0){
         temToolTip.push(item)
       }else{
         temToolTip.push({wageall:item.leastwageall,currency:item.currency})
       }
    })
    console.log(temToolTip)
    temToolTip.forEach((item,index)=>{
    //    if(item.isshowActive==0&&item.leastwageall){
    //    //  if(this.mawbPayment[index].currency==item.currency){
    //    //    this.toolTip.push({wageall:Number((item.isfree=='否'?Number(item.leastwageall):0)-Number(this.mawbPayment[index].leastwageall)).toFixed(2),currency:this.currencyFuHao[item.currency]})
    //    //  }else{
    //    //    this.toolTip.push({wageall:Number((item.isfree=='否'?Number(item.wageall):0)-Number(this.mawbPayment[index].wageall)).toFixed(2),currency:this.currencyFuHao['人民币']})
    //    //  }


    //    // else{
    //    //  this.toolTip.push({wageall:Number(0-Number(this.mawbPayment[index].wageall)).toFixed(2),currency:this.currencyFuHao['人民币']})
    //    // }

    // })
      if(item.isshowActive==0&&item.leastwageall){
       this.toolTip.push(Number((item.isfree=='否'?Number(item.wageall):0)-(this.mawbPayment[index].isfree=='否'?Number(this.mawbPayment[index].wageall):0)).toFixed(2))
       }else if(!item.isshowActive&&!item.items){
        this.toolTip.push(item.wageall)
       }else{
        this.toolTip.push(Number(0-(this.mawbPayment[index].isfree=='否'?Number(this.mawbPayment[index].wageall):0)).toFixed(2))
       }
     })
    //console.log(this.toolTip)
},
findall(a,x){
  console.log(a)
var results=[];
var len=a.length;
var pos=0;
while(pos<len){
pos=a.indexOf(x,pos);
if(pos===-1){//未找到就退出循环完成搜索
break;
}
results.push(pos);//找到就存储索引
pos+=1;//并从下个位置开始搜索
}
return results;
} ,
showAccountShow(){
  if(this.jobid){
    this.reconDetail=true
    this.guid=this.mawbInformation.guid
  }else{
      this.showAccount=true;
this.orderInformation.info=this.mawbInformation
this.orderInformation.costInfo=[]
  this.mawbCharge.forEach(item=>{
    if(item.isfree=='否'&&item.gid==this.mawbInformation.gid){
      this.orderInformation.costInfo.push(item)
    }
  })
  }

  //console.log(this.orderInformation)
},
closeD(data){
  this.reconDetail=data
},
// mainDetail(){
//   var object={}
//   this.$store.state.mainSearch=true

//  object={'title':'订单详细信息','mawbguid':this.mawbguid,'boguid':this.boguid,'area':this.mawbInformation.area,'orderdom':this.mawbInformation.orderdom}

//   this.$store.commit("setMainSearch",object);
// }




  }
}
</script>

<style lang="less" scoped>
.costDetail {
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      //background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
      /deep/.el-switch__label{
        color:#009900
      }
    /deep/.el-switch__label.is-active{
      color:#ff4949
    }
    }
    .detail-c {
      padding: 20px;
    }
  }
  .mawbInformation, .hawbInformation {
    .el-row {
      margin-bottom: 8px;
      .label {
        display: inline-block;
        width: 130px;
        text-align: right;
        margin-right: 10px;
      }
      .value {
        color: #009900;
      }
      .color-red {
        color: red;
      }
    }
  }

  .footer {
    margin-top: 20px;
    .el-row {
      margin: 20px 0;
    }
    .btn-c {
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
    }
  }
  .pagetype1{
    margin-bottom:15px;

  }
}
.sanjiao{
  width:130px;
  height: 0;
  border-bottom: 30px solid;
  position: relative;
  top: 6px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
   color:#fff;
}
.test(@color){
  border:1px solid #fff!important;
  .sanjiao{
      border-bottom-color: @color;
  }
  .detail-title p{
    &:extend(.sanjiao);
     border-bottom-color: @color;
  }
  .detail-c{
    border: 1px solid @color
  }
}

.detailPaneRed{
   .test(red)
}
.detailPaneYoung{
   .test(#00CC00)
}
.showpanediv>div{
   span:nth-child(1){
     display: inline-block;
     min-width: 100px;
     text-align: right;
   }
     span:last-child {
      display: inline-block;
     // width: 250px;
      width: auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }


}
.detailCost2{
//height:500px;
&:after{
  content:'';
  clear:both;
  display:block;
}
  .lineYinFu{
    float:left;
    width:545px;
    height:100%;
    margin-right:10px;

    .detail-title{
    height:30px;
    line-height:30px;
      p{
         text-align:center;
    width: 110px;
    height: 0;
    border-bottom: 30px solid;
    position: relative;
    top: 6px;
    height: 30px;
    line-height: 30px;
    border-right: 24px solid transparent;
    color: #fff;
    border-bottom-color:red;
    font-weight:bold;
    margin-top:-6px;
      }
    }
    .tableContent{
      padding:15px 0;
      border:1px solid red;
      td, th{
    height:26px;
    line-height: 26px;
    border: 1px solid #e8e8e8;
    text-align: center;
    padding: 0px 8px;
    white-space: nowrap;
    font-weight: normal;
    text-overflow:ellipsis;
    overflow:hidden;
    i{
      .disabled{
       cursor:not-allowed!important;
      }
      cursor:pointer;

    }




      }
    }


  }
  .lineYinShou{
    float:left;
    width:545px;
    height:100%;
    margin-right:10px;
    .detail-title{
    height:30px;
    line-height:30px;
      p{
        text-align:center;
    width: 110px;
    height: 0;
    border-bottom: 30px solid;
    position: relative;
    top: 6px;
    height: 30px;
    line-height: 30px;
    border-right: 24px solid transparent;
    color: #fff;
    border-bottom-color:#00CC00;
    font-weight:bold;
    margin-top:-6px;
      }
    }
     .tableContent{
      padding:15px 0;
      border:1px solid #00CC00;
       td, th{
    height:26px;
    line-height: 26px;
    border: 1px solid #e8e8e8;
    text-align: center;
    padding: 0px 8px;
    white-space: nowrap;
    font-weight: normal;
    text-overflow:ellipsis;
    overflow:hidden;
    i{
      .disabled{
       cursor:not-allowed!important;
      }
      cursor:pointer;

    }




      }
    }
  }
  .lineAllin{
   float:left;
   width:190px;
   height:100%;
     .detail-title{
    height:30px;
    line-height:30px;
      p{
        text-align:center;
    width: 110px;
    height: 0;
    border-bottom: 30px solid;
    position: relative;
    top: 6px;
    height: 30px;
    line-height: 30px;
    border-right: 24px solid transparent;
    color: #fff;
    border-bottom-color:orange;
    font-weight:bold;
    margin-top:-6px;
      }
    }
    .tableContent{
      padding:15px 0;
      border:1px solid orange;
            td, th{
    height:26px;
    line-height: 26px;
    border: 1px solid #e8e8e8;
    text-align: center;
    padding: 0px 8px;
    white-space: nowrap;
    font-weight: normal;
    text-overflow:ellipsis;
    overflow:hidden;


      }
    }
  }

}
  .arrow{
    i{
      &:hover{color:#0f5a8c}
    }
  }
  .wrapSetname{
    div{
      span{
        display:inline-block;
        //margin-right:40px;
        color:#999;
        height:24px;
        line-height:24px;
        padding-left:12px;
        margin-top:6px;
        padding-right:12px;
      &:hover{color:#0f5a8c}
    }
    }

  }
  .activeset{
    background:#0f5a8c!important;
    color:#fff!important;
    border-radius:32px;

  }
    .activesetUc{
     color:#0f5a8c!important;
  }
   .reason{
  h3{font-size: 18px;color: #004d84;}
  .el-dialog__body{padding:8px 40px;}
  .orderNo{
    margin-top:12px;padding-bottom:10px;border-bottom:1px solid #e8e8e8;font-size:13px;margin-bottom:12px;
    &:after{
      content:'';display:block;clear:both
    }
  }
  ul li{
    display:inline-block;width:100px;text-align:left;color:#999
  }
  .costItems{
    margin-top:16px;
    padding-bottom:10px;
    border-bottom:1px solid #e8e8e8;
    overflow:hidden;
    li{
      display:inline-block;
      cursor:pointer;
      padding-right:16px;
      width:auto;
      &:hover{color:#004d84}
        /deep/.el-badge__content.is-fixed.is-dot{
        right:2px;
      }
      /deep/.el-badge__content.is-fixed{
        top:3px;
        transform:translateY(-46%) translateX(100%);
      }
      /deep/.el-badge{
        vertical-align:inherit;
      }
    }

    .el-icon-caret-left{
      font-size:16px;
      cursor:pointer;
      &:hover{color:#004d84}
    }
     .el-icon-caret-right{
      font-size:16px;
      cursor:pointer;
      margin-left:-8px;
      &:hover{color:#004d84}
    }

  }

}


</style>
