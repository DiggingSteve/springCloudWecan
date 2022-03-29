<template>
  <div class="BgCostDetail">
    <div class="detail mawbInformation" v-if="pagetype==1">
      <div class="detail-title">
        <p>
          <span style="float:left">报关基本信息</span>
          <span style="float:right;margin-right:10px;">
            <el-switch
              v-model="lineshu"
              inactive-color="#009900"
              active-color="#ff4949"
              :active-text="titleBj">
            </el-switch>
          </span>
        </p>
      </div>

      <div class="detail-c">
        <el-row>
          <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtkhname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtkhname'] }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              <span class="label">{{ translate_text['wtxmname'] }}</span>
              <span class="value color-red">{{ mawbInformation['wtxmname'].split('-')[0] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['pono'] }}</span>
              <span class="value color-red">{{ mawbInformation['pono'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mawb'] }}</span>
              <span class="value color-red">{{ mawbInformation['mawb'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hawb'] }}</span>
              <span class="value">{{ mawbInformation['hawb'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['ywlx'] }}</span>
              <span class="value">{{ mawbInformation['ywlx'] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['bggysname'] }}</span>
              <span class="value color-red">{{ mawbInformation['bggysname'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['bglx'] }}</span>
              <span class="value">{{ mawbInformation['bglx'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['hbrq'] }}</span>
              <span class="value">{{ mawbInformation['hbrq'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['lds'] }}</span>
              <span class="value">{{ mawbInformation['lds'] }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['sfg'] }}</span>
              <span class="value">{{ mawbInformation['sfg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['mdg'] }}</span>
              <span class="value">{{ mawbInformation['mdg'] }}</span>
            </p>
          </el-col>
          <el-col :span="6">
            <p>
              <span class="label">{{ translate_text['jz'] }}</span>
              <span class="value">{{ mawbInformation['jz'] }}</span>
            </p>
          </el-col>
        </el-row>

      </div>
    </div>

<div v-if="!lineshu">
    <div class="detail mawbCharge detailPaneYoung">
      <el-row class="detail-title">
      <el-col :span="3">
        <p>空运应收费用</p>
        </el-col>

        <el-col :span="3" style="color:#00CC00;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">

             <span >总应收：</span><span>{{zdtotalCharge}}</span>

        </el-col>
        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>
        <el-col :span="3" style="color:orange;font-size:12px;font-weight:normal;margin-right:20px;font-weight:bold">

             <span >总盈利：</span><span>{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>

        </el-col>

        <el-col :span="12" style="font-size:12px;font-weight:normal;text-align:right">
          <el-button type="primary" size="mini" :disabled="ysConfirm||((orderguid!=''&&orderguid>0)&&(profitmode!=''&&profitmode.indexOf('利润')!=-1))" @click="confirmButton(1,700)" style="height:28px;line-height:13px;">应收确认并审单</el-button>
          <el-button type="primary" size="mini" :disabled="ysUconfirm" @click="confirmButton(1,1)" style="height:28px;line-height:13px;">取消确认</el-button>
          <el-button type="primary" size="mini" @click="recon('1')" :disabled="ysDz" style="height:28px;line-height:13px;">对账</el-button>
        </el-col>
      </el-row>
      <div class="detail-c">
       <el-row style="line-height:30px;">
        </el-row>

        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbCharge" style="margin-top:20px;" :tableIndex="0" v-if="mawbCharge">

            <template slot="firstTd" slot-scope="props">

            <td>
              <i class="icon-save" @click="addCost(1,1)" :class="[disabledAdd('1')?'disabled':'']" title="保存"></i>
              <i class="el-icon-close" @click="delCurCost(1,1)" title="删除"></i>
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
             <el-input v-model="curObjectKyYs.remark" style="width:100px;"></el-input>
            </td>

          </template>
          <template slot="operate" slot-scope="props">
            <i class="el-icon-setting" @click="modCost(props.data.index,1,1)" :class="[disabledEdit('1',props.data.row)?'disabled':'']" title="修改"></i>
            <i class="el-icon-delete" @click="delCost(props.data.index,1,1)" :class="[showUconfirmF('1',props.data.row)?'disabled':'']" title="删除"></i>
          </template>
        </commonTable>
      </div>
    </div>


    <div class="detail mawbPayment detailPaneRed costTable1">
      <el-row class="detail-title">
         <el-col :span="3">
        <p>空运应付费用</p>
        </el-col>

        <el-col :span="3" style="color:red;font-size:12px;font-weight:normal;font-weight:bold;margin-left:-20px;">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>

        <el-col :span="18" style="font-size:12px;font-weight:normal;text-align:right;margin-left:20px;">
          <el-button type="primary" size="mini" :disabled="yfConfirm" @click="confirmButton(2,700)" style="height:28px;line-height:13px;">应付确认并审单</el-button>
          <el-button type="primary" size="mini"  :disabled="yfUconfirm" @click="confirmButton(2,1)" style="height:28px;line-height:13px;">取消确认</el-button>
        </el-col>
      </el-row>
      <div class="detail-c">


        <commonTable class="commonTable" :head="mawb_table_model" :table-data="mawbPayment" style="margin-top:20px;" :tableIndex="1" v-if="mawbPayment">
         <template slot="firstTd" slot-scope="props">

            <td>
              <i class="icon-save" @click="addCost(2,1)" :class="[disabledAdd('2')?'disabled':'']" title="保存"></i>
              <i class="el-icon-close" @click="delCurCost(2,1)" title="删除"></i>
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
             <el-input v-model="curObjectKyYf.remark" style="width:100px;"></el-input>
            </td>

          </template>
        	<template slot="operate" slot-scope="props">
            <i class="el-icon-setting" @click="modCost(props.data.index,2,1)" :class="[disabledEdit('2',props.data.row)?'disabled':'']" title="修改"></i>
            <i class="el-icon-delete" @click="delCost(props.data.index,2,1)" :class="[showUconfirmF('2',props.data.row)?'disabled':'']" title="删除"></i>
          </template>

        </commonTable>
      </div>
    </div>
</div>

<div v-if="lineshu" class="detailCost2">
<div class="lineYinFu">
   <el-row class="detail-title">
         <el-col :span="6">
        <p>空运应付费用</p>
        </el-col>

        <el-col :span="5" style="color:red;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">

             <span >总应付：</span><span>{{zdtotalPayment}}</span>

        </el-col>

        <el-col :span="13" style="font-size:12px;font-weight:normal;text-align:right;line-height:20px;">
          <el-button type="primary" size="mini" :disabled="yfConfirm" @click="confirmButton(2,700)" style="height:28px;line-height:13px;">应付确认并审单</el-button>
          <el-button type="primary" size="mini"  :disabled="yfUconfirm" @click="confirmButton(2,1)" style="height:28px;line-height:13px;">取消确认</el-button>
        </el-col>
      </el-row>
      <div class="tableContent">
       <div :style="{'width':'573px','overflow':'auto','height':tableHeight}" v-scroll="onScroll" class="tableWrap">
       <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%'}" >
         <tr style="height:26px;">
           <th width='80'>操作</th>
           <th width='50'>免</th>
            <th width='150'>结算对象</th>
           <th width='100'>服务项目</th>
            <th width='90'>数量</th>
           <th width='90'>单价</th>
           <th width='90'>金额</th>

           <th width='80'>状态</th>
         </tr>

         <tr v-for="(item,index) in mawbPayment" :key="index" :style="{background:item.isfree=='是'?'#e2fdde':''}">
           <td width='80'>
            <i class="el-icon-setting" @click="modCost(index,2,1,1)" :class="[disabledEdit('2',item)?'disabled':'']" style="font-size:16px;"></i>
            <i class="el-icon-delete" @click="delCost(index,2,1)" :class="[showUconfirmF('2',item)?'disabled':'']" style="font-size:16px;"></i>
           </td>
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
             {{item.leastwageall}}
           </td>

           <td width='80'>
             {{item.confirmstatus}}
           </td>

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

        <el-col :span="5" style="color:#00CC00;font-size:12px;font-weight:normal;margin-left:-20px;font-weight:bold">

             <span >总应收：</span><span>{{zdtotalCharge}}</span>

        </el-col>


        <el-col :span="13" style="font-size:12px;font-weight:normal;text-align:right;line-height:20px;">
          <el-button type="primary" size="mini"  :disabled="ysConfirm||((orderguid!=''&&orderguid>0)&&(profitmode!=''&&profitmode.indexOf('利润')!=-1))" @click="confirmButton(1,700)" style="height:28px;line-height:13px;">应收确认并审单</el-button>
          <el-button type="primary" size="mini"  :disabled="ysUconfirm" @click="confirmButton(1,1)" style="height:28px;line-height:13px;">取消确认</el-button>
          <el-button type="primary" size="mini"  @click="recon('1')" :disabled="ysDz" style="height:28px;line-height:13px;">对账</el-button>
        </el-col>
      </el-row>
      <div class="tableContent">
        <div :style="{'width':'573px','overflow':'auto','height':tableHeight}" v-scroll="onScroll" class="tableWrap">
       <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%'}" >
         <tr style="height:26px;">
           <th width='80'>操作</th>
           <th width='50'>免</th>
            <th width='150'>结算对象</th>
           <th width='100'>服务项目</th>
            <th width='90'>数量</th>
           <th width='90'>单价</th>
           <th width='90'>金额</th>

           <th width='80'>状态</th>
         </tr>

         <tr v-for="(item,index) in mawbChargeLine" :key="index" :style="{background:item.isfree=='是'?'#e2fdde':''}">
           <td width='80'>
            <span v-if="item.leastwageall">
            <i class="el-icon-setting" @click="modCost(index,1,1,1)" :class="[disabledEdit('1',item)?'disabled':'']" style="font-size:16px;"></i>
          <i class="el-icon-delete" @click="delCost(index,1,1)" :class="[showUconfirmF('1',item)?'disabled':'']" style="font-size:16px;"></i>
            </span>
           </td>
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
             {{item.leastwageall}}
           </td>

           <td width='80'>
             {{item.confirmstatus}}
           </td>

         </tr>
       </table>
       </div>
      </div>
</div>
<div class="lineAllin">
  <p style="color:orange;font-size:12px;font-weight:normal;margin-right:20px;font-weight:bold;height:30px;line-height:30px;">

             <span >总盈利：</span><span>{{Number(zdtotalCharge-zdtotalPayment).toFixed(2)}}</span>

  </p>
   <div class="tableContent">
         <div :style="{'width':'130px','overflow':'auto','height':tableHeight}">
         <table :style="{'border-collapse':'collapse','table-layout':'fixed','width':'100%'}">
          <tr style="height:26px;">
          <th>差额</th>
          </tr>
          <tr v-for="(item,index) in toolTip" :key="index">
          <td v-if="item!='抄录应付'" :style="{'color':Number(item)<0?'red':Number(item)>0?'#00CC00':''}">
          {{item}}
          </td>
          <td v-else>
          <el-button style="width:100%" type="primary" @click="addCost(1,1,mawbPayment[index])">{{item}}</el-button>
          </td>
          </tr>
         </table>
         </div>
    </div>
</div>

</div>

    <div class="footer">



      <div class="btn-c">
        <div class="left-btn" v-if="pagetype==1" style="display:none!important">
          <el-button  @click="back">返回</el-button>
        </div>
        <div class="right-btn" style="display:none">
          <el-button type="primary">保存</el-button>
        </div>
      </div>

    </div>


    <!-- 对账制作 -->
   <el-dialog width="1260px"
  top="4%"
  center
  :visible.sync="showRecon"
  v-if="showRecon" append-to-body>

  <reconMngDetail :jobid="mawbInformation.guid" :wageinout="wageinout" :system="system" v-if="showRecon" @unVisible='showRecon=false' :area="mawbInformation.area"></reconMngDetail>

  </el-dialog>


    <!-- 左右结构费用修改弹框应收 -->
   <el-dialog width="1300px"
  top="8%"
  center
  :visible.sync="yingshouMod"
  v-if="yingshouMod" append-to-body>

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
           <!--  <td :class="[disabledAdd('1')?'disabled':'']">
            <el-select v-model="curObjectKyYs.currency"  style="width:100px;" >

                  <el-option v-for="(item,index) in currencyList"
                  :key="index"
                  :label="item"
                  :value="item">
                  </el-option>
              </el-select>
            </td> -->
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
          </template>
            </commonTable>

  </el-dialog>

     <!-- 左右结构费用修改弹框应付 -->
   <el-dialog width="1300px"
  top="8%"
  center
  :visible.sync="yingfuMod"
  v-if="yingfuMod" append-to-body>

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
             <el-input v-model="curObjectKyYf.remark" style="width:100px;"></el-input>
            </td>

          </template>
            </commonTable>

  </el-dialog>


  </div>
</template>

<script>
import reconMngDetail from "../orderDetails/reconMngDetail";
import { getChangeRate, computedWeight } from "../../api/localStorage.js";
export default {
  components: {
    reconMngDetail
  },
  props: {
    guid: {
      type: String,
      required: true
    },
    id: {
      type: [String, Number]
    },

    pagetype: {
      type: [Number, String],
      default: 1
    },
    inputModelData: {
      type: Object
    }
    // visible:Boolean
  },
  data() {
    return {
      cur_hawb: "",
      curHawbGuid: "",
      zdtotalCharge: 0,
      zdtotalPayment: 0,
      // fdPayment:0,
      ysConfirm: true,
      ysUconfirm: true,
      yfUconfirm: true,
      yfConfirm: true,
      ysDz: true,
      yfDz: true,
      showRecon: false, //对账弹框
      wageinout: "", //对账传应收应付
      system: "报关",
      mawbInformation: {
        pono: "",
        mawb: "",
        hawb: "",
        wtkhname: "",
        wtxmname: "",
        ywlx: "",
        bglx: "",
        hbrq: "",
        lds: "",
        sfg: "",
        mdg: "",
        bggysname: "",
        area: ""
      },
      translate_text: {
        pono: "订舱编号：",
        mawb: "总运单号：",
        hawb: "分运单号：",
        wtkhname: "委托客户：",
        wtxmname: "项目：",
        ywlx: "业务类型：",
        bglx: "报关类型：",
        hbrq: "航班日期：",
        lds: "连单数：",
        sfg: "始发港：",
        mdg: "目的港：",
        bggysname: "报关供应商：",
        jz: "件/重："
      },
      mawb_table_model: [
        { field: "operate", title: "操作" },
        { field: "isfree", title: "免" },
        { field: "confirmstatus", title: "状态" },
        { field: "settname", title: "结算对象" },
        { field: "items", title: "服务项目" },
        { field: "wagetype", title: "计费方式" },
        { field: "num", title: "数量" },
        { field: "price", title: "单价" },
        { field: "currency", title: "币种" },
        { field: "leastwageall", title: "金额" },
        { field: "wageall", title: "RMB金额" },
        { field: "changerate", title: "汇率" },
        { field: "remark", title: "备注" }
      ],
      modCostIndex: "",

      mawbCharge: [],
      mawbChargeLine: [],
      toolTip: [],
      mawbPayment: [],

      charge_yssys: {}, // 应收系统费用
      payment_yssys: {}, // 应付系统费用

      curObjectKyYs: {
        //isfree:{type:Boolean,default:false},
        num: "",
        price: "",
        currency: "人民币",
        gid: ""
      },
      curObjectKyYf: {
        num: "",
        price: "",
        currency: "人民币",
        gid: ""
      },
      curObjectFdYf: {
        num: "",
        price: "",
        currency: "人民币",
        gid: ""
      },

      hawb_table_model: [
        // {field: 'operate', title: '操作'},
        { field: "isfree", title: "免" },
        { field: "settname", title: "结算对象" },
        { field: "items", title: "服务项目" },
        { field: "wagetype", title: "计费方式" },
        { field: "num", title: "数量" },
        { field: "price", title: "单价" },
        { field: "currency", title: "币种" },
        { field: "leastwageall", title: "金额" },
        { field: "wageall", title: "RMB金额" },
        { field: "changerate", title: "汇率" },
        { field: "remark", title: "备注" }
      ],
      hawb_data_list: {},
      // 订单号、分运单号
      ordernoList: [],
      hawbShow: "",
      //基础数据 结算方式
      jsfs: [],
      currencyList: [],
      orderpgid: "", //已分配后取得应收结算对象
      orderguid: -1, //销售站，操作站区分
      profitmode: "", //利润分配模式
      itemsReocrder: {}, //记录多少服务项目个数
      lineshu: false, //切换显示
      // tableHeight:'',//左右形式表格高度
      position: { scrollTop: "0px", scrollLeft: "0px" },
      yingshouMod: false, //应收左右形式修改弹框
      yingfuMod: false, //应付左右形式修改弹框
      titleBj: "启用核对模式",

      confirmstatus_text: {
        1: '--',
        700: '已确认',
        800: '已提交',
        900: '对账中',
        1100: '已对账'
      }

    };
  },
  created() {
    // 总单详细
    this.$axios({
      method: "get",
      url: this.$store.state.webApi + "api/ExDecl",
      params: { guid: this.guid },
      loading: true,
      tip: false
    }).then(async results => {

      if (results.data) {
        this.mawbInformation = results.data;
        this.mawbInformation.jz = `${results.data.piece}/${results.data.weight}`

        await this.mawbCost();

        if (results.data.orderguid > 0) {
          //已分配结算对象
          this.curObjectKyYs["gid"] = Number(results.data.pgid);
          this.orderpgid = results.data.pgid;
          this.profitmode = results.data.profitmode;
        } else {
          //未分配结算对象
          this.curObjectKyYs["settname"] = results.data.wtxmname;
          this.curObjectKyYs["gid"] = Number(results.data.gid);
        }
        this.orderguid = results.data.orderguid;
      }
    });

    let groupIdData = JSON.parse(localStorage.getItem("groupType"));
    groupIdData.forEach(item => {
      if (item.groupid == 33) {
        this.jsfs.push({ value: item.id, typename: item.typename });
      }
    });

    let currencyData = JSON.parse(localStorage.getItem("currencyData"));
    currencyData.forEach(item => {
      this.currencyList.push(item.cname);
    });

  },
  computed: {
    fdyfLeastWageAll() {

      if (this.curObjectFdYf.num && this.curObjectFdYf.price) {
        this.curObjectFdYf.leastwageall = (
          Number(this.curObjectFdYf.num) * Number(this.curObjectFdYf.price)
        ).toFixed(2);
        return (
          Number(this.curObjectFdYf.num) * Number(this.curObjectFdYf.price)
        ).toFixed(2);
      }
    },
    fdyfWageAll() {
      if (this.fdyfLeastWageAll && this.fdyfChangeRate) {
        this.curObjectFdYf.wageall = (
          Number(this.fdyfLeastWageAll) * Number(this.fdyfChangeRate)
        ).toFixed(2);
        ////console.log(this.curObjectFdYf.wageall)
        return (
          Number(this.fdyfLeastWageAll) * Number(this.fdyfChangeRate)
        ).toFixed(2);
      }
    },
    zdysLeastWageAll() {
      if (this.curObjectKyYs.num && this.curObjectKyYs.price) {
        this.curObjectKyYs.leastwageall = (
          Number(this.curObjectKyYs.num) * Number(this.curObjectKyYs.price)
        ).toFixed(2);

        return (
          Number(this.curObjectKyYs.num) * Number(this.curObjectKyYs.price)
        ).toFixed(2);
      }
    },
    zdysWageAll() {
      if (this.zdysLeastWageAll && this.zdysChangeRate) {
        this.curObjectKyYs.wageall = (
          Number(this.zdysLeastWageAll) * Number(this.zdysChangeRate)
        ).toFixed(2);

        return (
          Number(this.zdysLeastWageAll) * Number(this.zdysChangeRate)
        ).toFixed(2);
      }
    },
    zdyfWageAll() {
      if (this.zdyfLeastWageAll && this.zdyfChangeRate) {
        this.curObjectKyYf.wageall = (
          Number(this.zdyfLeastWageAll) * Number(this.zdyfChangeRate)
        ).toFixed(2);

        return (
          Number(this.zdyfLeastWageAll) * Number(this.zdyfChangeRate)
        ).toFixed(2);
      }
    },
    zdyfLeastWageAll() {
      if (this.curObjectKyYf.num && this.curObjectKyYf.price) {
        this.curObjectKyYf.leastwageall = (
          Number(this.curObjectKyYf.num) * Number(this.curObjectKyYf.price)
        ).toFixed(2);

        return (
          Number(this.curObjectKyYf.num) * Number(this.curObjectKyYf.price)
        ).toFixed(2);
      }
    },
    zdysChangeRate() {
      this.curObjectKyYs.changerate = getChangeRate(
        this.curObjectKyYs.currency
      );

      return getChangeRate(this.curObjectKyYs.currency);
    },
    zdyfChangeRate() {
      this.curObjectKyYf.changerate = getChangeRate(
        this.curObjectKyYf.currency
      );
      return getChangeRate(this.curObjectKyYf.currency);
    },
    fdyfChangeRate() {
      this.curObjectFdYf.changerate = getChangeRate(
        this.curObjectFdYf.currency
      );
      return getChangeRate(this.curObjectFdYf.currency);
    },
    zdtotalIn() {
      return (this.zdtotalCharge - this.zdtotalPayment).toFixed(2);
    },
    fdPayment() {
      var total = 0;
      this.hawb_data_list[this.cur_hawb].hawbPayment.forEach(item => {
        if (item.isfree == "否") {
          total += Number(item.wageall);
        }
      });
      return Number(total).toFixed(2);
    },
    tableHeight() {
      var height = "";
      if (this.mawbChargeLine.length > this.mawbPayment.length) {
        height = (this.mawbChargeLine.length + 1) * 32 + "px";
      } else if (this.mawbPayment.length > this.mawbChargeLine.length) {
        height = (this.mawbPayment.length + 1) * 32 + "px";
      } else {
        height = (this.mawbChargeLine.length + 1) * 32 + "px";
      }
      return height;
    }
  },
  watch: {
    "curObjectKyYs.num"(val) {
      //alert(val)
      if (this.curObjectKyYs.price) {
        this.curObjectKyYs.leastwageall = (
          Number(val) * Number(this.curObjectKyYs.price)
        ).toFixed(2);
        this.curObjectKyYs.wageall = (
          Number(this.curObjectKyYs.leastwageall) *
          Number(this.curObjectKyYs.changerate)
        ).toFixed(2);
      }
    },
    "curObjectKyYs.price"(val) {
      if (this.curObjectKyYs.num) {
        this.curObjectKyYs.leastwageall = (
          Number(this.curObjectKyYs.num) * Number(val)
        ).toFixed(2);
        this.curObjectKyYs.wageall = (
          Number(this.curObjectKyYs.leastwageall) *
          Number(this.curObjectKyYs.changerate)
        ).toFixed(2);
      }
    },
    "curObjectKyYf.num"(val) {
      if (this.curObjectKyYf.price) {
        this.curObjectKyYf.leastwageall = (
          Number(val) * Number(this.curObjectKyYf.price)
        ).toFixed(2);
        this.curObjectKyYf.wageall = (
          Number(this.curObjectKyYf.leastwageall) *
          Number(this.curObjectKyYf.changerate)
        ).toFixed(2);
      }
    },
    "curObjectKyYf.price"(val) {
      if (this.curObjectKyYf.num) {
        this.curObjectKyYf.leastwageall = (
          Number(this.curObjectKyYf.num) * Number(val)
        ).toFixed(2);
        this.curObjectKyYf.wageall = (
          Number(this.curObjectKyYf.leastwageall) *
          Number(this.curObjectKyYf.changerate)
        ).toFixed(2);
      }
    },
    "curObjectFdYf.price"(val) {
      if (this.curObjectFdYf.num) {
        this.curObjectFdYf.leastwageall = (
          Number(this.curObjectFdYf.num) * Number(val)
        ).toFixed(2);
        this.curObjectFdYf.wageall = (
          Number(this.curObjectFdYf.leastwageall) *
          Number(this.curObjectFdYf.changerate)
        ).toFixed(2);
      }
    },
    "curObjectFdYf.num"(val) {
      if (this.curObjectFdYf.price) {
        this.curObjectFdYf.leastwageall = (
          Number(val) * Number(this.curObjectFdYf.price)
        ).toFixed(2);
        this.curObjectFdYf.wageall = (
          Number(this.curObjectFdYf.leastwageall) *
          Number(this.curObjectFdYf.changerate)
        ).toFixed(2);
      }
    },

    "curObjectKyYs.wagetype"(val, oldval) {
      if (!oldval) {
        switch (val) {
          case "票":
            this.curObjectKyYs.num = this.curObjectKyYs.num ? this.curObjectKyYs.num : "1";
            break;
          case "计重":
            this.curObjectKyYs.num = this.curObjectKyYs.num ? this.curObjectKyYs.num : this.mawbInformation.weight;
            break;
          case "结算重量":
            this.curObjectKyYs.num = this.curObjectKyYs.num ? this.curObjectKyYs.num : this.mawbInformation.weight;
            break;
          case "毛重":
            this.curObjectKyYs.num = this.curObjectKyYs.num ? this.curObjectKyYs.num : this.mawbInformation.weight;
            break;
        }
      } else {
        switch (val) {
          case "票":
            this.curObjectKyYs.num = "1";
            break;
          case "计重":
            this.curObjectKyYs.num = this.mawbInformation.weight;
            break;
          case "结算重量":
            this.curObjectKyYs.num = this.mawbInformation.weight;
            break;
          case "毛重":
            this.curObjectKyYs.num = this.mawbInformation.weight;
            break;
        }
      }
    },
    "curObjectKyYf.wagetype"(val, oldval) {
      if (!oldval) {
        switch (val) {
          case "票":
            this.curObjectKyYf.num = this.curObjectKyYf.num ? this.curObjectKyYf.num : "1";
            break;
          case "计重":
            this.curObjectKyYf.num = this.curObjectKyYf.num ? this.curObjectKyYf.num : this.mawbInformation.weight;
            break;
          case "结算重量":
            this.curObjectKyYf.num = this.curObjectKyYf.num ? this.curObjectKyYf.num : this.mawbInformation.weight;
            break;
          case "毛重":
            this.curObjectKyYf.num = this.curObjectKyYf.num ? this.curObjectKyYf.num : this.mawbInformation.weight;
            break;
        }
      } else {
        switch (val) {
          case "票":
            this.curObjectKyYf.num = "1";
            break;
          case "计重":
            this.curObjectKyYf.num = this.mawbInformation.weight;
            break;
          case "结算重量":
            this.curObjectKyYf.num = this.mawbInformation.weight;
            break;
          case "毛重":
            this.curObjectKyYf.num = this.mawbInformation.weight;
            break;
        }
      }
    },
    "curObjectFdYf.wagetype"(val, oldval) {
      if (!oldval) {
        switch (val) {
          case "票":
            this.curObjectFdYf.num = this.curObjectFdYf.num ? this.curObjectFdYf.num : 1;
            break;
          case "计重":
            this.curObjectFdYf.num = this.curObjectFdYf.num ? this.curObjectFdYf.num : this.hawb_data_list[this.cur_hawb].hawbInformation.jfweight;
            break;
          case "结算重量":
            this.curObjectFdYf.num = this.curObjectFdYf.num ? this.curObjectFdYf.num : this.hawb_data_list[this.cur_hawb].hawbInformation
                  .accountweightin;
            break;
          case "毛重":
            this.curObjectFdYf.num = this.curObjectFdYf.num ? this.curObjectFdYf.num : this.hawb_data_list[this.cur_hawb].hawbInformation.ybweight;
            break;
        }
      } else {
        switch (val) {
          case "票":
            this.curObjectFdYf.num = 1;
            break;
          case "计重":
            this.curObjectFdYf.num = this.hawb_data_list[
              this.cur_hawb
            ].hawbInformation.jfweight;
            break;
          case "结算重量":
            this.curObjectFdYf.num = this.hawb_data_list[
              this.cur_hawb
            ].hawbInformation.accountweightin;
            break;
          case "毛重":
            this.curObjectFdYf.num = this.hawb_data_list[
              this.cur_hawb
            ].hawbInformation.ybweight;
            break;
        }
      }
    },
    lineshu(val) {
      if (val) {
        this.titleBj = "启用编辑模式";
      } else {
        this.titleBj = "启用核对模式";
      }
    }
  },

  methods: {
    //费用修改
    modCost(index, type, dom, show) {
      if (type == "1" && dom == "1") {
        if (this.disabledEdit(type, this.mawbCharge[index])) {
          return false;
        }

        this.curObjectKyYs.num = Number(this.curObjectKyYs.num);

        this.curObjectKyYs = JSON.parse(JSON.stringify(this.mawbCharge[index]));
        this.curObjectKyYs.gid = Number(this.curObjectKyYs.gid);
        this.curObjectKyYs.isfree = this.curObjectKyYs.isfree == "否" ? false : true;
        if (show == 1) {
          this.yingshouMod = true;
          this.curObjectKyYs = JSON.parse(JSON.stringify(this.mawbChargeLine[index]));
          this.curObjectKyYs.gid = Number(this.curObjectKyYs.gid);
          this.curObjectKyYs.isfree = this.curObjectKyYs.isfree == "否" ? false : true;
        }
      } else if (type == "2" && dom == "1") {
        if (this.disabledEdit(type, this.mawbPayment[index])) {
          return false;
        }

        this.curObjectKyYf = JSON.parse(JSON.stringify(this.mawbPayment[index]));

        this.curObjectKyYf.isfree = this.curObjectKyYf.isfree == "否" ? false : true;
        if (show == 1) {
          this.yingfuMod = true;
        }
      } else if (type == "2" && dom == "2") {
        this.curObjectFdYf = JSON.parse(JSON.stringify(this.hawb_data_list[this.cur_hawb].hawbPayment[index]));
        this.curObjectFdYf.isfree = this.curObjectFdYf.isfree == "否" ? false : true;
      }
      this.modCostIndex = index;
    },
    //费用删除
    delCost(index, type, dom) {
      if (type == "1" && dom == "1") {
        if (this.showUconfirmF(type, this.mawbCharge[index])) {
          return false;
        }
      } else if (type == "2" && dom == "1") {
        if (this.showUconfirmF(type, this.mawbPayment[index])) {
          return false;
        }
      }

      this.$confirm("是否删除此费用?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        var data = {};
        if (type == "1" && dom == "1") {
          data = JSON.parse(JSON.stringify(this.mawbCharge[index]));
        } else if (type == "2" && dom == "1") {
          data = JSON.parse(JSON.stringify(this.mawbPayment[index]));
        } else if (type == "2" && dom == "2") {
          //alert(2)
          data = JSON.parse(
            JSON.stringify(
              this.hawb_data_list[this.cur_hawb].hawbPayment[index]
            )
          );
        }

        this.$axios({
          method: "DELETE",
          url: this.$store.state.webApi + "api/ExDeclWage",
          data: {
            guid: data.guid,
            sid: this.mawbInformation.guid
          },
          loading: false,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success("删除成功");

            if (type == "2" && dom == "1") {
              this.mawbCost();
            } else if (type == "1" && dom == "1") {
              var totalCharge = 0;
              this.mawbChargeLine = [];
              this.toolTip = [];
              this.itemsReocrder = {};
              this.mawbCharge.splice(index, 1);
              this.yingShouFuStatic(this.mawbCharge);
              this.mawbCharge.forEach(i => {
                if (i.yssys != 2 && i.isfree == "否") {
                  totalCharge += Number(i.wageall);
                }
              });

              this.zdtotalCharge = totalCharge.toFixed(2);
              this.checkModel();
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    //费用添加
    addCost(type, dom, data) {
      if (this.disabledAdd(type)) {
        return false;
      }

      if (type == "1" && dom == "1") {

        if (data) {
          this.curObjectKyYs = JSON.parse(JSON.stringify(data));
          this.curObjectKyYs.wageinout = 1;
          this.curObjectKyYs.gid = this.mawbInformation["gid"];
          this.curObjectKyYs.id = "";
          this.curObjectKyYs.guid = "";
        }

        if (
          !this.curObjectKyYs.price ||
          !this.curObjectKyYs.num ||
          !this.curObjectKyYs.wagetype ||
          !this.curObjectKyYs.items
        ) {
          this.$message.error("请填写完整费用");
          return false;
        }

        var method = "";
        var templetadata = {};

        this.curObjectKyYs.sid = this.mawbInformation.guid;
        this.curObjectKyYs.wageinout = type;
        this.curObjectKyYs.confirmstatus = 1;
        this.curObjectKyYs.price = Number(this.curObjectKyYs.price).toFixed(2);
        this.curObjectKyYs.wageall = Number(this.curObjectKyYs.wageall).toFixed(2);
        this.curObjectKyYs.changerate = Number(this.curObjectKyYs.changerate).toFixed(4);

        method = this.curObjectKyYs.guid ? "PUT" : "POST";
        var templetadata = JSON.parse(JSON.stringify(this.curObjectKyYs));
        templetadata.isfree = templetadata.isfree == true ? 2 : 1;

        this.$axios({
          method: method,
          url: this.$store.state.webApi + 'api/ExDeclWage',
          data: templetadata,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            if (method == 'POST') {
              this.$message.success("新增成功");
            } else {
              this.$message.success("修改成功");
            }
            if (Number(this.orderguid) > 0) {
              this.curObjectKyYs = {
                currency: "人民币",
                gid: Number(this.orderpgid)
              };
            } else {
              this.curObjectKyYs = {
                currency: "人民币",
                settname: this.mawbInformation.wtxmname,
                gid: this.mawbInformation.gid
              };
            }

            this.toolTip = [];
            this.yingshouMod = false;
            this.yingfuMod = false;

            this.mawbCost();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      } else if (type == "2" && dom == "1") {
        if (
          !this.curObjectKyYf.price ||
          !this.curObjectKyYf.num ||
          !this.curObjectKyYf.wagetype ||
          !this.curObjectKyYf.items
        ) {
          this.$message.error("请填写完整费用");
          return false;
        }

        var method = "";

        this.curObjectKyYf.sid = this.mawbInformation.guid;
        this.curObjectKyYf.wageinout = type;
        this.curObjectKyYf.confirmstatus = 1;
        this.curObjectKyYf.price = Number(this.curObjectKyYf.price).toFixed(2);
        this.curObjectKyYf.wageall = Number(this.curObjectKyYf.wageall).toFixed(2);
        this.curObjectKyYf.changerate = Number(this.curObjectKyYf.changerate).toFixed(4);

        method = this.curObjectKyYf.id ? "PUT" : "POST";
        var templetadata = JSON.parse(JSON.stringify(this.curObjectKyYf));
        templetadata.isfree = templetadata.isfree == true ? 2 : 1;

        this.$axios({
          method: method,
          url: this.$store.state.webApi + 'api/ExDeclWage',
          data: templetadata,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            if (method == 'POST') {
              this.$message.success("新增成功");
            } else {
              this.$message.success("修改成功");
            }

            this.curObjectKyYf = {
              currency: "人民币",
              gid: templetadata.gid
            };

            this.mawbPayment = [];
            this.mawbChargeLine = [];

            this.mawbCost();

          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      }
    },

    // ***********应收应付结算对象************
    getYfSettname(data) {
      this.curObjectKyYf.settname = data.usr_name;
    },
    getYsSettname(data) {
      this.curObjectKyYs.settname = data.usr_name;
    },
    //
    //清空当前费用
    delCurCost(type, dom, show) {
      //console.log(this.otherguid)
      if (type == "1" && dom == "1") {
        if (Number(this.orderguid) > 0) {
          this.curObjectKyYs = {
            currency: "人民币",
            gid: Number(this.orderpgid)
          };
        } else {
          this.curObjectKyYs = {
            currency: "人民币",
            gid: this.mawbInformation.gid
          };
        }
        if (show == 1) {
          this.yingshouMod = false;
        }
      } else if (type == "2" && dom == "1") {
        this.curObjectKyYf = {
          currency: "人民币"
        };
        if (show == 1) {
          this.yingfuMod = false;
        }
      } else if (type == "2" && dom == "2") {
        this.curObjectFdYf = {
          currency: "人民币"
        };
      }
    },
    // 费用确认取消确认
    confirmButton (wageinout, status) {
      let confirmData = null
      let yssys = null
      if (wageinout == 1) {
        confirmData = [...this.mawbCharge]
        yssys = this.charge_yssys
      } else if (wageinout == 2) {
        confirmData = [...this.mawbPayment]
        yssys = this.payment_yssys
      }

      let data = {
        sid: this.guid,
        status: status,
        wageinout: wageinout,
        wagedom: '报关'
      }
      this.$axios({method: 'put',url:this.$store.state.webApi+'api/ExDeclConfirm',data: data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          if (status == 1) {
            confirmData.forEach(item => {
              item.confirmstatus_backup == 700 ? item.confirmstatus_backup = 1 : ''
              item.confirmstatus = this.confirmstatus_text[item.confirmstatus_backup]
            })
            yssys.confirmstatus == 700 ? yssys.confirmstatus = 1 : ''
          } else {
            confirmData.forEach(item => {
              item.confirmstatus_backup == 1 ? item.confirmstatus_backup = 700 : ''
              item.confirmstatus = this.confirmstatus_text[item.confirmstatus_backup]
            })
            yssys.confirmstatus == 1 ? yssys.confirmstatus = 700 : ''
          }
          this.setFeeButtonStatus()
        }
      })

    },
    //总单费用查询
    async mawbCost() {
      await this.$axios({method: 'get',url:this.$store.state.webApi+'api/ExDeclWage',params:{sid: this.guid},loading:false,tip:false})
      .then(result => {
        if (result.data.length !== 0) {
          this.mawbCharge = [];
          this.mawbPayment = [];
          this.mawbChargeLine = [];
          this.toolTip = [];
          this.itemsReocrder = {};
          var totalCharge = 0;
          var totalPayment = 0;

          result.data.forEach(i => {
            i.gid = Number(i.gid);
            if (i.yssys != 2) {
              i.isfree == 1 ? (i.isfree = "否") : (i.isfree = "是");
              i.num = i.wagetype == "票" ? i.num : Number(i.num).toFixed(2);
              i.price = Number(i.price).toFixed(2);
              i.wageall = Number(i.wageall).toFixed(2);
              i.leastwageall = Number(i.leastwageall).toFixed(2);
              i.changerate = Number(i.changerate).toFixed(4);
              if (i.wageinout == 1) {
                this.mawbCharge.push(i);
                if (i.isfree == "否") {
                  totalCharge += Number(i.wageall);
                }
              } else if (i.wageinout == 2) {
                this.mawbPayment.push(i);

                if (i.isfree == "否") {
                  totalPayment += Number(i.wageall);
                }
              }
              i.confirmstatus_backup = i.confirmstatus
              i.confirmstatus = this.confirmstatus_text[i.confirmstatus]
            } else {
              if (i.wageinout == 1) {
                this.charge_yssys = i
              } else if (i.wageinout == 2) {
                this.payment_yssys = i
              }
            }

          });

          this.zdtotalCharge = totalCharge.toFixed(2);
          this.zdtotalPayment = totalPayment.toFixed(2);

          this.setFeeButtonStatus()
          this.checkModel();
        }
      })
    },

    setFeeButtonStatus () {
      var ysconfirm = [];
      var yfconfirm = [];

      ysconfirm = this.mawbCharge.map(i => {
        return i.confirmstatus
      })
      ysconfirm.push(this.confirmstatus_text[this.charge_yssys.confirmstatus])
      yfconfirm = this.mawbPayment.map(i => {
        return i. confirmstatus
      })
      yfconfirm.push(this.confirmstatus_text[this.payment_yssys.confirmstatus])

      if (ysconfirm.length > 0) {
        if (
          ysconfirm.indexOf("已确认") != -1 ||
          ysconfirm.indexOf("已对账") != -1 ||
          ysconfirm.indexOf("对账中") != -1
        ) {
          if (this.orderguid > 0 && this.profitmode.indexOf("利润") != -1) {
            this.ysUconfirm = true;
          } else {
            this.ysUconfirm = false;
          }

          this.ysDz = false;
        } else if (ysconfirm.indexOf("已提交") != -1) {
          this.ysDz = false;
          this.ysUconfirm = true;
        } else {
          this.ysUconfirm = true;
        }

        if (ysconfirm.indexOf("--") != -1) {
          if (this.orderguid > 0 && this.profitmode.indexOf("利润") != -1) {
            this.ysConfirm = true;
          } else {
            this.ysConfirm = false;
          }
        } else {
          this.ysConfirm = true;
        }
      } else {
        this.ysConfirm = true;
        this.ysUconfirm = true;
        this.ysDz = true;
      }

      if (yfconfirm.length > 0) {
        if (
          yfconfirm.indexOf("已确认") != -1 ||
          yfconfirm.indexOf("已对账") != -1 ||
          yfconfirm.indexOf("对账中") != -1
        ) {
          this.yfUconfirm = false;
          this.yfDz = false;
        } else if (yfconfirm.indexOf("已提交") != -1) {
          this.yfDz = false;
          this.yfUconfirm = true;
        } else {
          this.yfUconfirm = true;
        }

        if (yfconfirm.indexOf("--") != -1) {
          this.yfConfirm = false;
        } else {
          this.yfConfirm = true;
        }
      } else {
        this.yfConfirm = false;
        this.yfUconfirm = false;
        this.yfDz = true;
      }
    },

    //应收付费用相加
    totalPCCharge(payment) {
      var total = 0;
      payment.forEach(item => {
        if (item.isfree == "否") {
          total += Number(item.wageall);
        }
      });
      return total;
    },

    //对账弹框
    recon(type) {
      this.showRecon = true;
      this.wageinout = type;
    },

    back() {
      this.$emit("unvisible", false);
    },
    // 验证
    yanzhenzzF(type, dom, field) {
      if (dom == "1" && type == "1" && field == "num") {
        if (this.curObjectKyYs.wagetype == "票") {
          var reg = /^[1-9]\d*$/;
          if (this.curObjectKyYs.num && !reg.test(this.curObjectKyYs.num)) {
            this.$message({
              message: "请输入整数",
              type: "error",
              duration: 1000
            });
            this.curObjectKyYs.num = "";
          }
        } else {
          var reg = /^[0-9]+.?[0-9]{0,2}?$/;
          if (this.curObjectKyYs.num && !reg.test(this.curObjectKyYs.num)) {
            this.$message({
              message: "请输入整数或者2位小数",
              type: "error",
              duration: 1000
            });
            this.curObjectKyYs.num = "";
          }
        }
      } else if (dom == "1" && type == "1" && field == "price") {
        var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/;
        if (this.curObjectKyYs.price && !reg.test(this.curObjectKyYs.price)) {
          this.$message({
            message: "请输入整数或者2位小数",
            type: "error",
            duration: 1000
          });
          //this.$message.error('请输入整数或者2位小数')
          this.curObjectKyYs.price = "";
        }
      } else if (dom == "1" && type == "2" && field == "price") {
        var reg = /^(\-?)[0-9]+.?[0-9]{0,2}?$/;
        if (this.curObjectKyYf.price && !reg.test(this.curObjectKyYf.price)) {
          this.$message({
            message: "请输入整数或者2位小数",
            type: "error",
            duration: 1000
          });
          //this.$message.error('请输入整数或者2位小数')
          this.curObjectKyYf.price = "";
        }
      } else if (dom == "1" && type == "2" && field == "num") {
        if (this.curObjectKyYf.wagetype == "票") {
          var reg = /^[1-9]\d*$/;
          if (this.curObjectKyYf.num && !reg.test(this.curObjectKyYf.num)) {
            this.$message({
              message: "请输入整数",
              type: "error",
              duration: 1000
            });
            this.curObjectKyYf.num = "";
          }
        } else {
          var reg = /^[0-9]+.?[0-9]{0,2}?$/;
          if (this.curObjectKyYf.num && !reg.test(this.curObjectKyYf.num)) {
            this.$message({
              message: "请输入整数或者2位小数",
              type: "error",
              duration: 1000
            });
            this.curObjectKyYf.num = "";
          }
        }
      } else if (dom == "2" && type == "2" && field == "num") {
        if (this.curObjectFdYf.wagetype == "票") {
          var reg = /^[1-9]\d*$/;
          if (this.curObjectFdYf.num && !reg.test(this.curObjectFdYf.num)) {
            this.$message({
              message: "请输入整数",
              type: "error",
              duration: 1000
            });
            this.curObjectFdYf.num = "";
          }
        } else {
          var reg = /^[0-9]+.?[0-9]{0,2}?$/;
          if (this.curObjectFdYf.num && !reg.test(this.curObjectFdYf.num)) {
            this.$message({
              message: "请输入整数或者2位小数",
              type: "error",
              duration: 1000
            });
            this.curObjectFdYf.num = "";
          }
        }
      } else if (dom == "2" && type == "2" && field == "price") {
        var reg = /^[0-9]+.?[0-9]{0,2}?$/;
        if (this.curObjectFdYf.price && !reg.test(this.curObjectFdYf.price)) {
          this.$message({
            message: "请输入整数或者2位小数",
            type: "error",
            duration: 1000
          });

          this.curObjectFdYf.price = "";
        }
      }
    },
    onScroll: function(e, position) {
      this.position = position;

      if ($(".tableWrap").length > 0) {
        $(".tableWrap").scrollLeft(position.scrollLeft);
      }
    },
    // true:disabled
    // 是否能够点击删除按钮
    showUconfirmF(type, data) {
      if (Number(this.orderguid) > 0) {
        //操作站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              //this.deleteYSA=true
              return true;
            } else {
              //this.deleteYSA=false
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return true;
            //this.deleteYSA=true
          } else {
            //无分配模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              return true;
              //this.deleteYSA=true
            } else {
              return false;
              //this.deleteYSA=false
            }
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.confirmstatus != "--") {
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            return false;
          }
        }
      } else {
        //销售站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              return true;
              // this.deleteYSA=true
            } else {
              return false;
              // this.deleteYSA=false
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              return true;
              //this.deleteYSA=true
            } else {
              return false;
              //this.deleteYSA=false
            }
          } else {
            //无分配模式
            if (data.belong == 2 || data.confirmstatus != "--") {
              return true;
              // this.deleteYSA=true
            } else {
              return false;
              // this.deleteYSA=false
            }
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            if (data.belong == 3 || data.confirmstatus != "--") {
              //已确认或者belong值为3
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.belong == 3 || data.confirmstatus != "--") {
              //已确认或者belong值为3
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            return false;
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
    disabledEdit(type, data) {
      if (Number(this.orderguid) > 0) {
        //操作站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return true;
          } else {
            //无分配模式

            return false;
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.confirmstatus != "--") {
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            return false;
          }
        }
      } else {
        //销售站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.confirmstatus != "--") {
              return true;
            } else {
              return false;
            }
            //return false
          } else {
            //无分配模式
            return false;
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            if (data.belong == 3 || data.confirmstatus != "--") {
              //已确认或者belong值为3
              return true;
            } else {
              return false;
            }
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            if (data.belong == 3 || data.confirmstatus != "--") {
              //已确认或者belong值为3
              return true;
            } else {
              return false;
            }
          } else {
            //无分配模式
            return false;
          }
        }
      }
    },
    //是否可以点击添加按钮
    disabledAdd(type) {
      if (Number(this.orderguid) > 0) {
        //操作站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return true;
          } else {
            //无分配模式
            return false;
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return false;
          } else {
            //无分配模式
            return false;
          }
        }
      } else {
        //销售站
        if (type == "1") {
          //应收
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return false;
          } else {
            //无分配模式
            return false;
          }
        }
        if (type == "2") {
          //应付
          if (this.profitmode.indexOf("Co-load") != -1) {
            //coload模式
            return false;
          } else if (this.profitmode.indexOf("利润") != -1) {
            //利润分配模式
            return false;
          } else {
            //无分配模式
            return false;
          }
        }
      }
    },

    //验证状态
    yingShouFuStatic(data) {
      var ysconfirm = [];
      var yfconfirm = [];
      data.forEach(i => {
        if (i.yssys != 2) {
          if (i.wageinout == 1) {
            ysconfirm.push(i.confirmstatus);
          } else if (i.wageinout == 2) {
            yfconfirm.push(i.confirmstatus);
          }
        }
      });

      if (ysconfirm.length > 0) {
        if (
          ysconfirm.indexOf("已确认") != -1 ||
          ysconfirm.indexOf("已对账") != -1 ||
          ysconfirm.indexOf("对账中") != -1
        ) {
          if (this.orderguid > 0 && this.profitmode.indexOf("利润") != -1) {
            this.ysUconfirm = true;
          } else {
            this.ysUconfirm = false;
          }

          this.ysDz = false;
        } else if (ysconfirm.indexOf("已提交") != -1) {
          this.ysDz = false;
          this.ysUconfirm = true;
        } else {
          this.ysUconfirm = true;
        }

        if (ysconfirm.indexOf("--") != -1) {
          if (this.orderguid > 0 && this.profitmode.indexOf("利润") != -1) {
            this.ysConfirm = true;
          } else {
            this.ysConfirm = false;
          }
        } else {
          this.ysConfirm = true;
        }
      } else {
        this.ysConfirm = true;
        this.ysUconfirm = true;
        this.ysDz = true;
      }

      if (yfconfirm.length > 0) {
        if (
          yfconfirm.indexOf("已确认") != -1 ||
          yfconfirm.indexOf("已对账") != -1 ||
          yfconfirm.indexOf("对账中") != -1
        ) {
          this.yfUconfirm = false;
          this.yfDz = false;
        } else if (yfconfirm.indexOf("已提交") != -1) {
          this.yfDz = false;
          this.yfUconfirm = true;
        } else {
          this.yfUconfirm = true;
        }

        if (yfconfirm.indexOf("--") != -1) {
          this.yfConfirm = false;
        } else {
          this.yfConfirm = true;
        }
      } else {
        this.yfConfirm = false;
        this.yfUconfirm = false;
        this.yfDz = true;
      }
    },
    //核对模式
    checkModel() {
      var itemsArrPayment = [];
      var itemsArrCharge = [];

      //**********************************若要匹配isshare和guid,这边需重新编写数组item.items+item.guid，和一个新itemsArrCharge数组
      this.mawbPayment.forEach(item => {
        itemsArrPayment.push(item.items);
      });

      this.mawbCharge.forEach(item => {
        itemsArrCharge.push(item.items);
      });
      console.log(this.mawbCharge);

      var totalIndex = [];

      itemsArrPayment.forEach((item, index) => {
        var arrIndex = itemsArrCharge.indexOf(item);

        this.itemsReocrder[item] =
          Number(this.itemsReocrder[item]) >= 0
            ? Number(this.itemsReocrder[item]) + 1
            : 0;

        if (arrIndex >= 0) {
          if (totalIndex.indexOf(arrIndex) == -1) {
            this.mawbCharge[arrIndex].isshowActive = 0;
            this.mawbChargeLine.push(this.mawbCharge[arrIndex]);
            totalIndex.push(arrIndex);
          } else {
            arrIndex = itemsArrCharge.indexOf(item, this.itemsReocrder[item]);
            if (totalIndex.indexOf(arrIndex) == -1) {
              this.mawbCharge[arrIndex].isshowActive = 0;
              this.mawbChargeLine.push(this.mawbCharge[arrIndex]);
              totalIndex.push(arrIndex);
            } else {
              this.mawbChargeLine.push({ isshowActive: 0, items: item });
            }
          }
        }

        if (arrIndex < 0) {
          //若加入isshare和guid,找不到匹配的通过服务项目查找,重复上面操作,使用逗号隔开在新itemsArrCharge数组中查找位置
          this.mawbChargeLine.push({ isshowActive: 0, items: item });
        }
      });
      console.log(this.itemsReocrder);

      this.mawbCharge.forEach((item, index) => {
        if (totalIndex.indexOf(index) == -1) {
          item.isshowActive = 1;
          this.mawbChargeLine.push(item);
        }
      });

      console.log(JSON.stringify(this.mawbChargeLine));

      var temToolTip = [];
      this.mawbChargeLine.forEach((item, index) => {
        if (item.isshowActive == 0) {
          temToolTip.push(item);
        } else {
          temToolTip.push(item.wageall);
        }
      });
      console.log(temToolTip);
      temToolTip.forEach((item, index) => {
        if (item.isshowActive == 0 && item.leastwageall) {
          this.toolTip.push(
            Number(
              (item.isfree == "否" ? Number(item.wageall) : 0) -
                Number(this.mawbPayment[index].wageall)
            ).toFixed(2)
          );
        } else if (!item.isshowActive && !item.items) {
          this.toolTip.push(item);
        } else {
          this.toolTip.push("抄录应付");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.BgCostDetail {
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
      /deep/.el-switch__label {
        color: #009900;
      }
      /deep/.el-switch__label.is-active {
        color: #ff4949;
      }
    }
    .detail-c {
      padding: 20px;
    }
  }
  .mawbInformation,
  .hawbInformation {
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
  .pagetype1 {
    margin-bottom: 15px;
  }
}
.sanjiao {
  width: 130px;
  height: 0;
  border-bottom: 30px solid;
  position: relative;
  top: 6px;
  height: 30px;
  line-height: 30px;
  border-right: 26px solid transparent;
  color: #fff;
}
.test(@color) {
  border: 1px solid #fff !important;
  .sanjiao {
    border-bottom-color: @color;
  }
  .detail-title p {
    &:extend(.sanjiao);
    border-bottom-color: @color;
  }
  .detail-c {
    border: 1px solid @color;
  }
}

.detailPaneRed {
  .test(red);
}
.detailPaneYoung {
  .test(#00cc00);
}
.showpanediv > div {
  span:nth-child(1) {
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
.detailCost2 {
  //height:500px;
  &:after {
    content: "";
    clear: both;
    display: block;
  }
  .lineYinFu {
    float: left;
    width: 575px;
    height: 100%;
    margin-right: 10px;

    .detail-title {
      height: 30px;
      line-height: 30px;
      p {
        text-align: center;
        width: 110px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 24px solid transparent;
        color: #fff;
        border-bottom-color: red;
        font-weight: bold;
        margin-top: -6px;
      }
    }
    .tableContent {
      padding: 20px 0;
      border: 1px solid red;
      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        i {
          .disabled {
            cursor: not-allowed !important;
          }
          cursor: pointer;
        }
      }
    }
  }
  .lineYinShou {
    float: left;
    width: 575px;
    height: 100%;
    margin-right: 10px;
    .detail-title {
      height: 30px;
      line-height: 30px;
      p {
        text-align: center;
        width: 110px;
        height: 0;
        border-bottom: 30px solid;
        position: relative;
        top: 6px;
        height: 30px;
        line-height: 30px;
        border-right: 24px solid transparent;
        color: #fff;
        border-bottom-color: #00cc00;
        font-weight: bold;
        margin-top: -6px;
      }
    }
    .tableContent {
      padding: 20px 0;
      border: 1px solid #00cc00;
      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        i {
          .disabled {
            cursor: not-allowed !important;
          }
          cursor: pointer;
        }
      }
    }
  }
  .lineAllin {
    float: left;
    width: 130px;
    height: 100%;
    .tableContent {
      padding: 20px 0;
      border: 1px solid orange;
      td,
      th {
        height: 26px;
        line-height: 26px;
        border: 1px solid #e8e8e8;
        text-align: center;
        padding: 0px 8px;
        white-space: nowrap;
        font-weight: normal;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
