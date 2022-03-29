<template>

  <div id="account" style='width:1200px;margin:0 auto' ref="account">
<!--   {{isFromFob}} -->
    <!-- {{accountTemplate}} -->
    <!-- 可编辑信息 -->
    <!-- {{accountData}} -->
<!--     {{costData}} -->
    <div class="editInfo">
      <el-row>
        <el-col :span="6">
          <span>账单号:</span>

          <el-input v-model="accountData.accountcode" style="width:186px;"></el-input>

        </el-col>

        <el-col :span="5">
          <span>最后付款日:</span>
          <el-date-picker v-model="accountData.duedate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:140px;"></el-date-picker>

        </el-col>

        <el-col :span="5">
          <span>账单日期: </span>
          <el-date-picker v-model="accountData.accountdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
            style="width:140px;"></el-date-picker>
        </el-col>


        <el-col :span="8">
          <span>选择模板:</span>
          <el-select v-model="mubanInfo.templatename" style="width:140px">
            <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
              <span style="float:left">{{item.name}}</span>
              <span style="float:right" ><i :class="['el-icon-close',{'disabled':item.fid=='-1'}]" @click="delMuBan(item)"></i></span>
            </el-option>
          </el-select>
          <el-button @click="tableTemVisible=true">保存模板</el-button>
        </el-col>







      </el-row>

      <el-row style="margin-top:10px;">
        <el-col :span="6">
          <span>收付对象:</span>
          <page-select :modelval.sync="accountData.paymentgid" :pagetype="1" style="width:65%;display:inline-block"></page-select>

        </el-col>
        <el-col :span="5">
          <customerRel
            v-if="wageinout == '1'"
            style="display: inline;margin-left: 35px;"
            :fid="accountData.settgid || (information && information.accountcomgid) || ''"
            customerRelType="财务"
            :area="area"
            @changeRelData="customerRelList = $event">
          </customerRel>
        </el-col>

        <template v-if="wageinout == '2'">
          <el-col :span="5">
            <span>账单类型:</span>
            <el-select v-model="accountData.accountdom" style="width: 140px;">
              <el-option v-for="type in accountdomOptions" :key="type.id" :value="type.typename"></el-option>
            </el-select>
          </el-col>

          <el-col :span="5">
            <span>税率:</span>
            <el-select v-model="accountData.taxrate" style="width: 140px;">
              <el-option :value="'0.00'"></el-option>
              <el-option v-for="type in taxrateOptions" :key="type.id" :value="type.typename"></el-option>
            </el-select>
          </el-col>
        </template>


      </el-row>

      <el-row style="margin-top:10px;">
        <el-col :span="10">
          <span>备注:</span>
          <el-input type="textarea" v-model="accountData.remark" style="vertical-align:middle;width:78%;"></el-input>

        </el-col>


      </el-row>



    </div>



    <div class="btnGroup">


      <!--    <span><el-button   @click="saveAccount" type="primary">保存并生成PDF</el-button></span> -->
      <span>
        <el-button @click="print()" type="primary" v-if="isFromFob=='Fob1'||!isFromFob||isFromFob=='Fob2'">保存并打印</el-button>
        <el-button @click="credentialVisible=true" type="primary" v-if="wageinout == '2'">凭证信息</el-button>
      </span>

<!--       <span>
        <el-button @click="checkModel('1')" type="primary" v-if="isFromFob=='Fob2'">审核通过</el-button>
      </span>
      <span>
        <el-button @click="checkModel('2')" type="primary" v-if="isFromFob=='Fob2'">审核驳回</el-button>
      </span> -->
      <!--     <span><el-button plain @click="back">返回</el-button></span> -->
    </div>


    <!-- 抬头 -->
    <div ref="printData" id="printData" style="padding-left:2%">
      <table border="0" style="width:96%">

        <tr class="printDataTr">
          <td class="printDataTd" style="border:none">
            <img :src="mubanInfo.src" v-if="mubanInfo.src" class="logo" id="logo">
            <p v-else class="logo"></p>
            <!-- <img src="../../common/wecan.png" height="70" width="160" class="logo"> -->
          </td>
          <td class="printDataTd" style="border:none">
            <printshow :require-data.sync="mubanInfo.companyname" :type="2" id="companyname" class="bankInfoPdf_normal"></printshow>

            <span class="bankInfoPdf_print companyname" id="companyname" style="font-size:22px!important;">{{mubanInfo.companyname}}</span>

            <printshow :require-data.sync="mubanInfo.companyAddress" :type="2" id="companyaddress" class="bankInfoPdf_normal"></printshow>

            <span class="bankInfoPdf_print companyaddress" id="companyaddress" style="width:800px;word-wrap:break-word;font-size:13px!important;word-break:break-all;white-space:pre-wrap;">{{mubanInfo.companyAddress}}</span>
          </td>
        </tr>
      </table>
      <!--   <div  class="printData">

<div class="logoInfo">

    <img src="mubanInfo.src"  v-if="mubanInfo.src" class="logo">
    <p  v-else="mubanInfo.src" class="logo"></p>

</div>


<div class="companyInfo">
<printshow :require-data.sync="mubanInfo.companyname" :type="2" id="companyname"></printshow>

 <printshow :require-data.sync="mubanInfo.companyAddress" :type="2" id="companyaddress"></printshow>

  </div> -->




      <!-- messer 显示信息-->
      <!-- {{accountData}} -->
      <div class="messerData">
        <div class="messerLeft">
          <p class="customer">MESSER</p>
          <!--  <el-input type="textarea" resize="none" v-model="accountData.messer" style="" id="messer">

        </el-input> -->
          <!-- <printshow :require-data.sync="accountData.messer" :type="2" id="messer" class="bankInfoPdf_normal"></printshow>
          <span class="bankInfoPdf_print">{{accountData.messer}}</span> -->
          <printshow :require-data.sync="mubanInfo.messer" :type="2" id="messer" class="bankInfoPdf_normal"></printshow>
          <span class="bankInfoPdf_print">{{mubanInfo.messer}}</span>

          </p>
        </div>
        <div class="messerRight">
          <div id='dtNote'><span v-if="wageinout==1">DEBIT NOTE</span><span v-if="wageinout==2">CREDIT NOTE</span></div>
          <p class="messerRp">
            <img src='../../../boStatic/images/orange.png' style='vertical-align: baseline;width:8px;height:8px;margin-right:37px;'>
            <span>Invoice No：
              <span>
                {{accountData.accountcode}}
                <!--    <el-input v-model="accountData.accountcode" style="width:180px;"></el-input> -->
              </span>
            </span>
          </p>
          <p class="messerRp">
            <img src='../../../boStatic/images/orange.png' style='vertical-align: baseline;width:8px;height:8px;margin-right: 28px;'>
            <span>Invoice Date：
              {{accountData.eaccountdate}}
              <!--  <span>
            <el-date-picker v-model="accountData.accountdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;"></el-date-picker>
            </span> -->
            </span>
          </p>

          <p class="messerRp">
            <img src='../../../boStatic/images/orange.png' style='vertical-align: baseline;width:8px;height:8px;margin-right:30px;'>
            <span>Shipment ID：
              <span>
                {{accountData.pono}}
                <!-- <el-date-picker v-model="accountData.duedate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;"></el-date-picker> -->
              </span>
            </span>
          </p>


          <!-- <p>
            <img src='../../icon/orange.png' style='vertical-align: baseline;width:8px;height:8px;margin-right: 37px;'><span>工作号：<span><el-input v-model="accountData.pono" style="width:180px;"></el-input></span></span>
          </p> -->
          <p class="messerRp">
            <img src='../../../boStatic/images/orange.png' style='vertical-align: baseline;width:8px;height:8px;margin-right:47px;'
              class="messerRightImgF">
            <span>Due Date：
              <span>
                {{accountData.eduedate}}
                <!-- <el-date-picker v-model="accountData.duedate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;"></el-date-picker> -->
              </span>
            </span>
          </p>



        </div>
      </div>

      <!-- 基本信息 -->
      <div class="caogoInfo" id="caogoInfo">
        <table cellpadding="0" cellspacing="0" style='width:100%;' class="orderTable">
          <tr class="orderno">
            <td style="width:100%;">PO Number</td>
          </tr>
          <tr style="width:100%;">
            <td style="border:1px solid #e1e1e1" class="orderTable2">
              <printshow :require-data.sync="accountData.axpjobno" :type="1" id="axpjobno" class="bankInfoPdf_normal">

              </printshow>
              <span class="bankInfoPdf_print">{{accountData.axpjobno}}</span>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style='width:100%;margin-top: 15px' class="orderTable">
          <tr class="orderno">
            <td style="width:33%;border-right:none">
              <span v-if="information&&information.jobnolist.map(i=>i.system).join(',').includes('海')||(accountData.system&&accountData.system.includes('海'))">MBL</span>
              <span v-else>MAWB</span>
            </td>
            <td style="width:33%;border-right:none;border-left:none">
              <span v-if="information&&information.jobnolist.map(i=>i.system).join(',').includes('海')||(accountData.system&&accountData.system.includes('海'))">HBL</span>
              <span v-else>HAWB</span>
            </td>
            <td style="width:33%;border-left:none;">
              <span v-if="information&&information.jobnolist.map(i=>i.system).join(',').includes('海')||(accountData.system&&accountData.system.includes('海'))">Ocean Vessel</span>
              <span v-else>Flight No. </span>
            </td>
          </tr>
          <tr style="width:100%;">
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-left:1px solid #e1e1e1;position:relative" id="mawb"
              class="orderTable2">

              <printshow :require-data.sync="accountData.mawb" :type="1" id="mawb" class="bankInfoPdf_normal">


              </printshow>
              <span class="bankInfoPdf_print">{{accountData.mawb}}</span>
            </td>
            <td style="width:33%;border-bottom:1px solid #e1e1e1" id="hawb" class="orderTable2">
              <printshow :require-data.sync="accountData.hawb" :type="1" id="hawb" class="bankInfoPdf_normal">


              </printshow>
              <span class="bankInfoPdf_print">{{accountData.hawb}}</span>

            </td>
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-right:1px solid #e1e1e1" id="hbh" class="orderTable2">

              <printshow :require-data.sync="accountData.hbh" :type="1" id="hbh" class="bankInfoPdf_normal">


              </printshow>
              <span class="bankInfoPdf_print">{{accountData.hbh}}</span>

            </td>
          </tr>

        </table>

        <table cellpadding="0" cellspacing="0" style='width:100%;margin-top: 15px' class="orderTable">
          <tr class="orderno">
            <td style="width:33%;border-right:none">
              <span v-if="information&&information.jobnolist.map(i=>i.system).join(',').includes('海')||(accountData.system&&accountData.system.includes('海'))">Shipped on board</span>
              <span v-else>Flight Date</span>
              
            </td>
            <td style="width:33%;border-right:none;border-left:none">PCS</td>
            <td style="width:33%;border-left:none;">Volume</td>
          </tr>
          <tr style="width:100%;height:30px;">
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-left:1px solid #e1e1e1" id="hbrq" class="orderTable2">


              <printshow :require-data.sync="accountData.hbrq" :type="1" id="hbrq" class="bankInfoPdf_normal">


              </printshow>
              <span class="bankInfoPdf_print">{{accountData.hbrq}}</span>
            </td>
            <td style="width:33%;border-bottom:1px solid #e1e1e1" id="zdpiece" class="orderTable2">
              <printshow :require-data.sync="accountData.zdpiece" :type="1" id="zdpiece" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.zdpiece}}</span>
            </td>
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-right:1px solid #e1e1e1" id="realvolume" class="orderTable2">
              <printshow :require-data.sync="accountData.realvolume" :type="1" id="realvolume" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.realvolume}}</span>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style='width:100%;margin-top: 15px' class="orderTable">
          <tr class="orderno">
            <td style="width:33%;border-right:none">Gross Weight</td>
            <td style="width:33%;border-right:none;border-left:none">Chargeable Weight</td>
            <td style="width:33%;border-left:none;">Billing Weight</td>
          </tr>
          <tr style="width:100%;">
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-left:1px solid #e1e1e1" id="zdweight" class="orderTable2">
              <printshow :require-data.sync="accountData.zdweight" :type="1" id="zdweight" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.zdweight}}</span>
            </td>

            <td style="width:33%;border-bottom:1px solid #e1e1e1" id="chargeWeight" class="orderTable2">
              <printshow :require-data.sync="accountData.chargeWeight" :type="1" id="chargeWeight" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.chargeWeight}}</span>
            </td>

            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-right:1px solid #e1e1e1" id="accountweightin"
              class="orderTable2">

              <printshow :require-data.sync="accountData.accountweightin" :type="1" id="accountweightin" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.accountweightin}}</span>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style='width:100%;margin-top: 15px' class="orderTable">
          <tr class="orderno">
            <td style="width:33%;border-right:none">Issued by</td>
            <td style="width:33%;border-right:none;border-left:none">Departure</td>
            <td style="width:33%;border-left:none;">Destination</td>
          </tr>
          <tr style="width:100%;">
            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-left:1px solid #e1e1e1" id="accountman" class="orderTable2">
              <printshow :require-data.sync="accountData.accountman" :type="1" id="accountman" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.accountman}}</span>
            </td>

            <td style="width:33%;border-bottom:1px solid #e1e1e1" id="sfg" class="orderTable2">
              <printshow :require-data.sync="accountData.sfg" :type="1" id="sfg" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.sfg}}</span>
            </td>

            <td style="width:33%;border-bottom:1px solid #e1e1e1;border-right:1px solid #e1e1e1" id="mawbmdg" class="orderTable2">

              <printshow :require-data.sync="accountData.mawbmdg" :type="1" id="mawbmdg" class="bankInfoPdf_normal"></printshow>

              <span class="bankInfoPdf_print">{{accountData.mawbmdg}}</span>
            </td>

          </tr>
        </table>
      </div>

      <!-- 费用 -->
      <div class="costInfo">


        <!--   <div class="detail">
    <div class="detail-title">
      <p>Cost Info</p>
    </div>
    <div class="detail-c">

      <commonTable  :head="costHead" :table-data="costData">


      </commonTable>
      <p style="text-align:right;padding-right:20px;margin-top:20px;letter-spacing:0.1em;" class="heiji" v-for="item in totalAccount">

           <span class="totalFirst">Total Charges:</span><span class="totalSecond">{{Number(item.total).toFixed(2)}}</span><span class="totalThird">{{item.currency}}</span>

      </p>
    </div>
  </div> -->

        <table cellpadding="0" cellspacing="0" style="width:100%;">
          <tr style="border-bottom:1px solid #000">
            <td>DESCRIPTION</td>
            <td></td>
            <td>Price</td>
            <td>Qty</td>
            <td>Currency</td>
            <td style="width:90px;text-align: right!important;">Amount</td>
          </tr>

          <tr v-for="item in costData">
            <td>{{item.items}}</td>
            <td><span v-if="Number(item.dwageall)<0">{{item.accountcode}}</span><span v-else></span></td>
            <td>{{item.price}}</td>
            <td>{{item.num}}</td>
            <td>{{item.currency}}</td>
            <td style="width:90px;text-align:right">{{item.dwageall}}</td>
            <!--   <td>

        <textarea style="width:390px;border:none;resize:none;display:none" class="itemname"></textarea>
        <div contenteditable="true" style="width:390px;border:none;resize:none;" id="itemname"></div>
        <div contenteditable="true" style="width:390px;border:none;resize:none;display:none" id="itemname2"></div>
        </td>
        <td style='position:relative'>

        <textarea style="width:80px;border:none;resize:none;display:none" class="price"></textarea>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;"  id="price"></div>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;display:none" id="price2"></div>
        </td>

        <td style='position:relative'>

        <textarea style="width:80px;border:none;resize:none;display:none" class="num"></textarea>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;"  id="num"></div>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;display:none" id="num2"></div>
        </td>

        <td style='position:relative'>

        <textarea style="width:80px;border:none;resize:none;display:none" class="ename"></textarea>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;"  id="ename"></div>
        <div contenteditable="true" style="width:80px;border:none;resize:none;position:absolute;top:10px;display:none" id="ename2"></div>
        </td>

        <td style='position:relative;'>

          <textarea style="width:90px;text-align: right;border:none;resize:none;display:none" class="finishwageall"></textarea>
          <div contenteditable="true" style="width:90px;text-align: right;border:none;resize:none;position:absolute;top:10px;" id="finishwageall"></div>
          <div contenteditable="true" style="width:90px;text-align: right;border:none;resize:none;position:absolute;top:10px;display:none" id="finishwageall2"></div>
        </td>  -->
          </tr>
        </table>

      </div>

      <div :style="{'width': '400px','height':totalAccount.length*24+'px','padding-top':(totalAccount.length*24-totalAccount.length*18)/2+'px','background':'#000','float':'right','margin-right':'70px','margin-bottom':'18px'}"
        class="totalShow">
        <p style="text-align:right;padding-right:10px;letter-spacing:0.1em;color:#fff;font-size:13px;font-weight:bold;height:18px;"
          class="heiji" v-for="item in totalAccount">

          <span class="totalFirst" style='text-align:right'>Total Charges:</span><span class="totalSecond">{{Number(item.total).toFixed(2)}}</span><span
            class="totalThird">{{item.currency}}</span><br>

        </p>

      </div>
      <!-- <div style="width:390px;height:auto;display:inline-block;border:none" id="description" contenteditable="true"></div>
    <div style="width:210px;height:auto;display:inline-block;border:none" id="currency" contenteditable="true"></div>
    <div style="width:130px;height:auto;display:inline-block;text-align: right;border:none" id="amount" contenteditable="true"></div> -->






      <!-- 银行信息 -->
      <div class="bankInfo" style="clear:both">


        <p style="color:#999999;font-size: 12px;font-weight: bold;padding:0;margin:0" id="bankInfo">Bank Info</p>

        <!-- <printshow :require-data.sync="mubanInfo.bankinfo" :type="2" id="bankinfo"></printshow> -->
         <printshow :require-data.sync="mubanInfo.bankinfo" :type="2" id="bankinfo" class="bankInfo_normal"></printshow>
         <p id="bankPrint">
           
          
         </p>
<!--         <div class="bankInfo_normal" id="bankInfo_normal">
          <printshow :require-data.sync="mubanInfo.bankinfo" :type="2" id="bankinfo"></printshow>
        </div> -->

        
<!--         <p class="bankInfo_print" id="bankInfo_print">
            
        </p>

        <p class="bankInfoPdf_print" id="bankInfoPdf_print">

        </p> -->

        <!-- <el-input type="textarea" resize="none" v-model="mubanInfo.bankinfo" style="" id="bankinfo"  autosize></el-input> -->
        <!--  <p style='padding:0;margin:0;margin-top: 5px;font-size:15px;' contenteditable="true" class="Bank" id="Bank">
        BENEFICIARY:WecanInternationalLogisticsCo.,Ltd<br>
        BENEFICIARY'SUSDACCOUNTNO.:    USD 36561488000003801   RMB 36560188000023955<br>
BENEBANK'SNAME:ChinaEverbrightBankShanghaiBranch<br>
TheSWIFTnumber:evercnbjsh1
      </p> -->

      </div>
      <!--   {{accountno}} -->
    </div>



    <!-- 保存模板弹框 -->

    <el-dialog title="提示" :visible.sync="tableTemVisible" style="" class="tableTem" center append-to-body>
      <div>
        <el-radio v-model="tem" label="1">保存新模板</el-radio>
        <el-radio v-model="tem" label="2">替换原模板</el-radio>
      </div>
      <div style="margin-top:20px;" v-if="tem==1">
        <p>请输入模板名称:</p>
        <el-input v-model="tableTemName" placeholder="请输入模板名称" style="width:180px;"></el-input>
        <el-button type="primary" @click="tabTemSet(tableTemName,1)">保存</el-button>
      </div>

      <div style="margin-top:20px;" v-if="tem==2">
        <p>被替换模板名称:</p>
        <el-select v-model="muban" placeholder="请选择" style="width:180px;">
          <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>



        <el-button type="primary" @click="tabTemSet(muban,2)">保存</el-button>
      </div>
    </el-dialog>

    <!-- 驳回原因 -->
    <el-dialog width="600px" top="4%" center :visible.sync="reason" v-if="reason" append-to-body @close="closeReason"
      custom-class="reason">

      <div>


        <div class="orderSystem-c">
          <h3>取消原因</h3>

          <el-input type="textarea" v-model="overseasaccreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8"
            placeholder="取消原因"></el-input>

        </div>

        <p style="margin-top:18px;text-align:right">
          <el-button @click="checkFun('20')" type="primary">确定</el-button>
          <el-button @click="closeReason">取消</el-button>
        </p>
      </div>
    </el-dialog>


    <!-- 凭证信息 -->
    <el-dialog title="凭证信息" width="1200px" top="4%" center :visible.sync="credentialVisible" v-if="credentialVisible" append-to-body custom-class="credentialDialog">
      <div>
        <p class="title">
          凭证明细
          <span>含税参考总金额：{{ costCNYWageTotal }}</span>
        </p>
        <commonTable class="commonTable" :head="credential_table_model" :table-data="pzList" :tableIndex="0">
          <template slot="firstTd" slot-scope="props">
            <td slot="operate">
              <i class="icon-save" @click="pushCredentialData" style="vertical-align:text-top;" title="保存"></i>
              <i class="el-icon-close" style="vertical-align:text-top;" title="删除"></i>
            </td>
            <td slot="pzno">
              <el-input v-model="pzTempData.pzno"></el-input>
            </td>
            <td slot="pzdate">
              <el-date-picker v-model="pzTempData.pzdate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 190px;"></el-date-picker>
            </td>
            <td slot="notaxwageall">
              <el-input v-model="pzTempData.notaxwageall" style="width: 100px;"></el-input>
            </td>
            <td slot="tax">
              <el-input v-model="pzTempData.tax" style="width: 100px;"></el-input>
            </td>
            <td slot="pzwageall">
              <el-input v-model="pzTempData.pzwageall" :disabled="true" style="width: 100px;"></el-input>
            </td>
            <td slot="pztype">
              <el-select v-model="pzTempData.pztype" style="width: 160px;">
                <el-option v-for="type in accountdomOptions" :key="type.id" :value="type.typename"></el-option>
              </el-select>
            </td>
            <td slot="pztaxrate">
              <el-select v-model="pzTempData.pztaxrate" style="width: 140px;">
                <el-option :value="'0.00'"></el-option>
                <el-option v-for="type in taxrateOptions" :key="type.id" :value="type.typename"></el-option>
              </el-select>
            </td>
            <td slot="pzremark">
              <el-input v-model="pzTempData.pzremark"></el-input>
            </td>
          </template>
          <template slot="operate" slot-scope="props">
            <i class="el-icon-setting" @click="credentialDataOperate('setting', props.data.index)" title="修改"></i>
            <i class="el-icon-delete" @click="credentialDataOperate('delete', props.data.index)" title="删除"></i>
          </template>
        </commonTable>
        <div class="footer">
          <div class="wageinfo">
            <div>
              <p>不含税总额：<span>{{ notaxwageallTotal }}</span></p>
              <p>税金总额：<span>{{ taxTotal }}</span></p>
            </div>
            <div>
              <p>
                账单含税总额与凭证含税总额差价：<span>{{ (parseFloat(costCNYWageTotal) - parseFloat(pzwageallTotal)).toFixed(2) }}</span>
              </p>
            </div>
          </div>
          <div class="btn-c">
            <el-button v-if="pzid" @click="print(true)" type="primary">保存</el-button>
            <el-button v-else @click="credentialVisible=false" type="primary">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>



    <!-- 驳回原因 -->
    <!-- <el-dialog width="800px"
  top="4%"
  center
  :visible.sync="reason"
  v-if="reason" append-to-body
    @close="closeReason"
  custom-class="reason"
  >

        <div>
{{orderInformation.costInfo}}

<div class="orderSystem-c">
      <h3>取消原因</h3>
      <p class="orderNo">
        <span style="color:#004d84;float:left;font-weight:bold">{{orderInformation.info.pono}}</span>
        <span style="color:#333;float:right">{{orderInformation.info.wtkhname}}</span>
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
        <li>{{orderInformation.info.mawb}}</li>
        <li>{{orderInformation.info.sfg}}</li>
        <li>{{orderInformation.info.mdg}}</li>
        <li>{{orderInformation.info.realtjz}}</li>
        <li>{{orderInformation.info.hbh}}</li>
        <li>{{orderInformation.info.hbrq.substring(0,10)}}</li>
      </ul>

      <el-input type="textarea" v-model="abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="工作号驳回原因输入框"></el-input>

      <div class="costItems">
      <div  style="width:710px;overflow:hidden;display:inline-block" >
        <ul class="costItemsList" style="width:10000px;overflow:hidden;">
           <li v-for="(item,index) in orderInformation.costInfo" :key="index" :style="{'color':costItemsActive==index?'#004d84':''}" @click="costItemsActive=index">
           <el-badge is-dot class="item" v-if="item.abandonReason">{{item.items}}</el-badge>
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
        <li>金额</li>
        <li>单价</li>
        <li>数量</li>
        <li>货币</li>
  </ul>
  <ul style="margin-top:3px;">
        <li>{{orderInformation.costInfo[costItemsActive].leastwageall}}</li>
        <li>{{orderInformation.costInfo[costItemsActive].price}}</li>
        <li>{{orderInformation.costInfo[costItemsActive].num}}</li>
        <li>{{orderInformation.costInfo[costItemsActive].currency}}</li>
  </ul>

  <el-input type="textarea" v-model="orderInformation.costInfo[costItemsActive].abandonReason" class="input-required" :autosize="{ minRows:4}" style="margin-top:8px;color:#c8c8c8" :placeholder="orderInformation.costInfo[costItemsActive].items+'取消原因输入框'"></el-input>

      </div>


</div>

     <p style="margin-top:18px;text-align:right">
       <el-button @click="checkFun('20')" type="primary">确定</el-button>
       <el-button @click="closeReason">取消</el-button>
     </p>
   </div>
  </el-dialog> -->




  </div>
</template>

<script>
import {getMomentDate,getPdf,getEnglishCurrency,getEnglishService,ceDataChange} from '../../api/localStorage.js'
import {getLodop} from '../../api/LodopFuncs.js'
import html2Canvas from 'html2canvas'
//import JsPDF from 'jspdf'
import customerRel from '../templates/customerRel'

let printshow = {
  template: `
    <div>
    <span v-if="type==1" >
     <el-input v-model="requireData2" v-if="id == 'sfg' || id == 'mawbmdg'" v-verify="'sfgmdg'" @change="changeParentValue(requireData2)"></el-input>
     <el-input  v-model="requireData2" class="printNo" :id="id" v-else @change="changeParentValue(requireData2)"></el-input>
    </span>
   <el-input type="textarea" v-model="requireData2" class="printNo" v-if="type==2" resize="none" :id="id" @change="changeParentValue(requireData2)" autosize></el-input>
    <el-date-picker v-model="requireData2" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;" v-if="type==3" @change="changeParentValue(requireData2)"></el-date-picker>
   <span :class="['printShowT',id]" style="display:none">{{requireData2}}</span>
   </div>
  `,
  data () {
return{
  requireData2:''
  //requireData2:''
}
  },
  props:["requireData","type","id","selectTableIndex"],
  watch:{
    requireData:{
      handler(){
         this.requireData2=this.requireData
       },
     immediate:true
    }


  },
  methods:{
   changeParentValue(val){
    ////console.log(val)
     this.$emit('update:requireData', val)
   }
  }

}

export default {
  components: {
   printshow,customerRel
  },
  props: {
   information:{
    type:Object
   },
   orderInformation:{
    type:Object
   },
    wageinout:"",
    pzid:"",
    system:{
      type:String
    },
    accountno:"",
    area:"",
    isFromFob:String,
    guid:String
  },
  data () {
    return {
      mubanInfo:{companyname:'',companyAddress:"",companylogo:'',bankinfo:"",templatename:'',src:'',messer:''},
      accountData:{messer:'',accountcode:'',accountdate:getMomentDate(),pono:'',duedate:getMomentDate(1),axpjobno:'',mawb:'',hawb:'',hbh:'',hbrq:'',zdpiece:'',realvolume:'',zdweight:'',chargeWeight:'',accountweightin:'',weight:'',accountman:localStorage.getItem('englishname'),sfg:'',mawbmdg:'',remark:'',paymentgid:'',eaccountdate:ceDataChange(getMomentDate()),eduedate:ceDataChange(getMomentDate(1)),accountdom:'普通发票',taxrate:'6.00'},
      costHead:[
       {field: "items", title:"DESCRIPTION"},
        {field: "price", title: "Price"},
        {field: "num", title: "Qty"},
        {field: "currency", title: "Currency"},
        {field: "dwageall", title: "Amount"}

      ],
      costData:[],
      totalAccount:[],
      htmlTitle:'对账单',
      templateList:[],//模板list数据
      tableTemVisible:false,//模板新增修改弹框
      tem:'1',//判断模板是新增还是修改
      muban:'',//模板修改
      tableTemName:'',//模板新增名字
      imgBase64:'',//64位图片
      accountTemplate:"",
      informationBackup:[],//备份数据
      overseasaccreason:'',
      reason:false,
      abandonReason:'',//工作号驳回原因
      costItemsActive:0,//费用驳回激活index
      accountdomOptions: [],
      taxrateOptions: [],

      pzList: [],
      pzTempData: {
        pzno: '',
        pzdate: '',
        notaxwageall: '',
        tax: '0',
        pzwageall: '',
        pztype: '普通发票',
        pztaxrate: '6.00',
        pzremark: ''
      },
      credential_table_model: [
        {field: 'operate', title: '操作'},
        {field: 'pzno', title: '凭证号'},
        {field: 'pzdate', title: '凭证日期'},
        {field: 'notaxwageall', title: '不含税金额'},
        {field: 'tax', title: '税'},
        {field: 'pzwageall', title: '凭证金额'},
        {field: 'pztype', title: '凭证类型'},
        {field: 'pztaxrate', title: '税率'},
        {field: 'pzremark', title: '凭证备注'}
      ],

      credentialVisible: false,
      customerRelList: [],
      printType:1
  }
  },
  created () {
    if (this.wageinout == '2') {
      this.$watch(
        function() {
          return this.pzTempData.notaxwageall + this.pzTempData.tax
        },
        function() {
          let pzwageall = 0
          if (this.pzTempData.notaxwageall && !Number.isNaN(parseFloat(this.pzTempData.notaxwageall))) {
            pzwageall += parseFloat(this.pzTempData.notaxwageall)
          }
          if (this.pzTempData.tax && !Number.isNaN(parseFloat(this.pzTempData.tax))) {
            pzwageall += parseFloat(this.pzTempData.tax)
          }
          this.pzTempData.pzwageall = pzwageall.toFixed(2)
        }
      )
    }

    let groupType = JSON.parse(localStorage.groupType)
    this.accountdomOptions = groupType.filter(i => i.groupid == 49)
    this.taxrateOptions = groupType.filter(i => i.groupid == 50)

//alert(this.isFromFob)
    console.log(JSON.stringify(this.information))
    var currency=[]
    if(this.information){
       this.informationBackup=JSON.parse(JSON.stringify(this.information))
       console.log(JSON.stringify(this.informationBackup))
        this.accountData.messer=this.informationBackup.accountcomename
        //this.accountData.paymentname=this.informationBackup.accountcomname
        this.accountData.paymentgid=Number(this.informationBackup.accountcomgid)
        //this.accountData.accountdate=
        //this.accountData.paymentname=this.information.accountcomname

    if(this.informationBackup.jobnolistdata.length==1){
        this.accountData.mawb=this.informationBackup.jobnolistdata[0].job.mawb
        this.accountData.hawb=this.informationBackup.jobnolistdata[0].job.hawb
        this.accountData.hbh=this.informationBackup.jobnolistdata[0].job.hbh
        this.accountData.hbrq=this.informationBackup.jobnolistdata[0].job.hbrq.substring(0,10)
        this.accountData.sfg=this.informationBackup.jobnolistdata[0].job.sfg
        // console.log(Number(this.informationBackup.jobnolistdata[0].job.realvolume)/0.006)
        // console.log(Number(this.informationBackup.jobnolistdata[0].job.realvolume)/0.006>Number(this.informationBackup.jobnolistdata[0].job.realweight))
        //this.accountData.chargeWeight=Number(this.informationBackup.jobnolistdata[0].job.hawbjfweight)/0.006>Number(this.informationBackup.jobnolistdata[0].job.realweight)?(Number(this.informationBackup.jobnolistdata[0].job.realvolume)/0.006).toFixed(2):(Number(this.informationBackup.jobnolistdata[0].job.realweight)).toFixed(2)
this.accountData.chargeWeight=this.informationBackup.jobnolistdata[0].job.hawbjfweight?Number(this.informationBackup.jobnolistdata[0].job.hawbjfweight).toFixed(2):''
        this.accountData.realvolume=this.informationBackup.jobnolistdata[0].job.hawbzdvolume?Number(this.informationBackup.jobnolistdata[0].job.hawbzdvolume).toFixed(3):''

//Number(results.data.readlvolume)/0.006>Number(results.data.realweight)?Number(results.data.readlvolume/0.006).toFixed(2):Number(results.data.realweight).toFixed(2)



        this.accountData.zdpiece=this.informationBackup.jobnolistdata[0].job.hawbzdpiece?this.informationBackup.jobnolistdata[0].job.hawbzdpiece:''
        this.accountData.zdweight=this.informationBackup.jobnolistdata[0].job.hawbzdweight?Number(this.informationBackup.jobnolistdata[0].job.hawbzdweight).toFixed(2):''
        //this.accountData.jfweight=this.informationBackup.jobnolistdata[0].job.jfweight?Number(this.informationBackup.jobnolistdata[0].job.jfweight).toFixed(2):''
        this.accountData.axpjobno=this.information.jobnolistdata[0].job.orderno?this.information.jobnolistdata[0].job.orderno:this.information.jobnolistdata[0].job.pono
        this.accountData.pono=this.information.jobnolistdata[0].job.pono.match(/\d+/ig)[0]
        // this.accountData.accountweightin=this.informationBackup.jobnolistdata[0].job.accountweightin?Number(this.informationBackup.jobnolistdata[0].job.accountweightin).toFixed(2):''
        this.accountData.mawbmdg=this.informationBackup.jobnolistdata[0].job.mdg
        this.accountData.orderno=this.informationBackup.jobnolistdata[0].job.orderno
        this.accountData.weight=this.informationBackup.weight?Number(this.informationBackup.jobnolistdata[0].job.weight).toFixed(2):''
        //this.accountData.Issued=this.information.jobnolistdata[0].job.Issued
    }
    this.informationBackup.jobnolistdata.forEach(item=>{
      item.wagelist.forEach(item2=>{
        //debugger;
        if(item2.items=='AIR FREIGHT'||item2.items=='运费运费'){
          this.accountData.accountweightin=item2.num
        }
        item2.dwageall=Number(item2.dwageall).toFixed(2)
        item2.realwageall=Number(item2.realwageall).toFixed(2)
        item2.items=getEnglishService(item2.items)
        item2.currency=getEnglishCurrency(item2.currency)
        if(Number(item2.dwageall)!=0){
          this.costData.push(item2)
        }
        if(currency.indexOf(item2.currency)==-1){
          currency.push(item2.currency)
        }
      })
    })
    //console.log(currency)
    //console.log(this.costData)
    currency.forEach(item=>{
      var total=0
      this.costData.forEach(item2=>{
        if(item==item2.currency){
          total+=Number(item2.dwageall)
        }
      })
      this.totalAccount.push({currency:item,total:total})
    })
    }else if(this.pzid){
      //alert('1')
        var data={area:this.area,system:this.system,pzid:this.pzid,pzdom:'账单'}
      this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpPzFinishDetail',params:data})
      .then(results=>{
        console.log(results.data)

        results.data.taxrate = results.data.taxrate.toFixed(2)
        results.data.hbrq=results.data.hbrq&&results.data.hbrq.indexOf('1900')==-1?results.data.hbrq.substring(0,10):''
        results.data.zdweight=results.data.zdweight?Number(results.data.zdweight).toFixed(2):''
        results.data.mawbmdg=results.data.mdg
        results.data.chargeWeight=results.data.jfweight?Number(results.data.jfweight).toFixed(2):''
        results.data.realvolume=results.data.volume?Number(results.data.volume).toFixed(3):''
        results.data.zdpiece=results.data.piece

        results.data.accountweightin=results.data.accountweight?Number(results.data.accountweight).toFixed(2):''
        results.data.weight=results.data.weight?Number(results.data.weight).toFixed(2):''
        results.data.paymentgid=Number(results.data.paymentgid)
        results.data.pono=results.data.jobnolist[0].orderno.match(/\d+/ig)[0]

        this.accountData=Object.assign(this.accountData,results.data)

        this.accountData.messer=results.data.settename
        this.accountData.accountdate=results.data.accountdate
        this.accountData.duedate=results.data.duedate

        this.pzList = this.accountData.pzList

        results.data.jobnolist.forEach(item=>{
          item.wagelist.forEach(item2=>{
            if(item2.items=='AIR FREIGHT'){
              this.accountData.accountweightin=item2.num
            }
            item2.items= getEnglishService(item2.items)
            item2.currency=getEnglishCurrency(item2.currency)
            item2.dwageall=Number(item2.pzwageall).toFixed(2)
            // item2.dwageall=Number(Number(item2.num)*Number(item2.price)).toFixed(2)
            this.costData.push(item2)
            if(currency.indexOf(item2.currency)==-1){
              currency.push(item2.currency)
            }
          })
        })
        currency.forEach(item=>{
          var total=0
          this.costData.forEach(item2=>{
            if(item==item2.currency){
              total+=Number(item2.dwageall)
            }
          })
          this.totalAccount.push({currency:item,total:total})
        })
      })
      .catch(error=>{

      })
      console.log(this.accountData)
    }else if(this.orderInformation){
        this.informationBackup=JSON.parse(JSON.stringify(this.orderInformation))

        this.accountData.messer=this.informationBackup.info.wtkhename

        this.accountData.paymentgid=Number(this.informationBackup.info.fid)
        this.accountData.accountcomgid=this.informationBackup.info.gid

        this.accountData.mawb=this.informationBackup.info.mawb
        this.accountData.hawb=this.informationBackup.info.hawb
        this.accountData.hbh=this.informationBackup.info.hbh
        this.accountData.hbrq=this.informationBackup.info.hbrq
        this.accountData.sfg=this.informationBackup.info.sfg
        this.accountData.zdvolume=this.informationBackup.info.zdvolume.toFixed(3)
        this.accountData.zdpiece=this.informationBackup.info.hawbzdpiece?this.informationBackup.info.hawbzdpiece:''
        this.accountData.zdweight=this.informationBackup.info.hawbzdweight?Number(this.informationBackup.info.hawbzdweight).toFixed(2):''
        this.accountData.jfweight=this.informationBackup.info.zdjfweight?Number(this.informationBackup.info.zdjfweight).toFixed(2):''
        this.accountData.realvolume=this.informationBackup.info.hawbzdvolume?Number(this.informationBackup.info.hawbzdvolume).toFixed(3):''
        this.accountData.chargeWeight=this.informationBackup.info.hawbjfweight?Number(this.informationBackup.info.hawbjfweight).toFixed(2):''
        this.accountData.axpjobno=this.informationBackup.info.orderno?this.informationBackup.info.orderno:this.informationBackup.info.pono
        this.accountData.pono=this.informationBackup.info.pono.match(/\d+/ig)[0]
        // this.accountData.accountweightin=this.informationBackup.info.accountweightin?Number(this.informationBackup.info.accountweightin).toFixed(2):''
        this.accountData.mawbmdg=this.informationBackup.info.mdg
        this.accountData.orderno=this.informationBackup.info.orderno
        this.accountData.weight=this.informationBackup.info.realjfweight?Number(this.informationBackup.info.realjfweight).toFixed(2):''
        //this.accountData.Issued=this.information.jobnolistdata[0].job.Issued


    this.informationBackup.costInfo.forEach(item=>{

        item.dwageall=Number(Number(item.wageall)/Number(item.changerate)).toFixed(2)
        item.items=getEnglishService(item.items)
        item.currency=getEnglishCurrency(item.currency)
        if(item.items=='AIR FREIGHT'){
          this.accountData.accountweightin=item.num
        }
        this.costData.push(item)
        if(currency.indexOf(item.currency)==-1){
          currency.push(item.currency)
        }

    })
console.log(JSON.stringify(this.informationBackup))
    currency.forEach(item=>{
      var total=0
      this.costData.forEach(item2=>{
        if(item==item2.currency){
          total+=Number(item2.dwageall)
        }
      })
      this.totalAccount.push({currency:item,total:total})
    })
    }
    //this.getAccountTemplate()


  },
  computed: {
    // 本票账单人民币总金额
    costCNYWageTotal() {
      let wagetotal = 0
      this.costData.forEach(item => {
        if (this.pzid) {
          wagetotal += parseFloat(item.pzwageall)
        } else {
          wagetotal += parseFloat(item.dwageall)
        }
      })
      return wagetotal.toFixed(2)
    },
    // 凭证总金额
    pzwageallTotal() {
      return this.pzList.reduce((p ,v) => {
        p += parseFloat(v.pzwageall)
        return p
      }, 0).toFixed(2)
    },
    notaxwageallTotal() {
      return this.pzList.reduce((p ,v) => {
        p += parseFloat(v.notaxwageall)
        return p
      }, 0).toFixed(2)
    },
    taxTotal() {
      return this.pzList.reduce((p ,v) => {
        p += parseFloat(v.tax)
        return p
      }, 0).toFixed(2)
    },
    // 本票账单总金额与凭证总金额是否相等
    isPzwageallTotalEqualCostwagetotal() {
      return parseFloat(this.pzwageallTotal) == parseFloat(this.costCNYWageTotal)
    }

  },
  watch:{
    credentialVisible(val) {
      if (!val && this.pzList.length > 0 && !this.isPzwageallTotalEqualCostwagetotal) {
        this.$message.error(`本票账单总金额为:${this.costCNYWageTotal}，与凭证总金额${this.pzwageallTotal}不相符`)
        this.credentialVisible = true
      }
    },

  'mubanInfo.templatename'(val){
    ////console.log(val)
    //var template=$.trim(localStorage.accountTemplate);
    var templatedata=this.accountTemplate
    //console.log(templatedata)
    if(val!="-1"){
      templatedata.forEach(item=>{
        if(val==item.id){
          //console.log(item)
          this.$nextTick(()=>{
            this.mubanInfo.companyname=item.companylogo.replace(/#n#/ig,"\n")
            this.mubanInfo.companyAddress=item.companyinfo.replace(/#n#/ig,"\n")
            this.mubanInfo.bankinfo=item.bankinfo.replace(/#n#/ig,"\n")
            this.mubanInfo.messer=item.messer?item.messer.replace(/#n#/ig,"\n"):this.accountData.messer
            //$('#bankInfo_print').html(item.bankinfo.replace(/#n#/ig,"<br>"))
            //$('#bankInfoPdf_print').html(item.bankinfo.replace(/#n#/ig,"<br>"))
        if(item.image!=""){
          if(item.image.indexOf('wecan.png')!=-1){//图片显示出来路径
           this.mubanInfo.src='./boStatic/images/wecan.png'
          }

        }else{
          this.mubanInfo.src=""
        }
          })
this.$forceUpdate()
        }

      })
    }else{
       this.mubanInfo.companyname=""
       this.mubanInfo.companyAddress=""
       this.mubanInfo.bankinfo=""
       this.mubanInfo.companylogo=""
       this.mubanInfo.messer=""
    }

  },

  'accountData.accountdate'(val){
this.accountData.eaccountdate=ceDataChange(val)
  },


  'accountData.duedate'(val){
this.accountData.eduedate=ceDataChange(val)
  },
  'accountData.paymentgid'(val){
    this.getAccountTemplate()
  }






  },
  methods: {
    pushCredentialData() {
      if (!this.pzTempData.pzno) return this.$message.error('请输入凭证号')
      if (!this.pzTempData.pzdate) return this.$message.error('请选择凭证日期')
      if (!this.pzTempData.notaxwageall) return this.$message.error('不含税金额不能为空或0')
      if (this.pzList.find((item) => item.pzno == this.pzTempData.pzno)) return this.$message.error('凭证号不能重复')

      let data = {
        ...this.pzTempData,
        notaxwageall: parseFloat(this.pzTempData.notaxwageall).toFixed(2),
        tax: parseFloat(this.pzTempData.tax).toFixed(2),
        pzwageall: parseFloat(this.pzTempData.pzwageall).toFixed(2),
        pztaxrate: parseFloat(this.pzTempData.pztaxrate).toFixed(4),
      }
      let hasNaN = Object.values(data).find(i => {
        return i === 'NaN'
      })
      if (hasNaN) {
        return this.$message.error('请输入合法数值')
      }

      this.pzList.push(data)
      this.pzTempData = {
        pzno: '',
        pzdate: '',
        notaxwageall: '',
        tax: '0',
        pzwageall: '',
        pztype: '普通发票',
        pztaxrate: '6.00',
        pzremark: ''
      }
    },
    credentialDataOperate(operate, index) {
      if (operate === 'setting') {
        this.pzTempData = { ...this.pzList.splice(index, 1)[0] }
      } else if (operate === 'delete') {
        this.pzList.splice(index, 1)
      }
    },
    //返回
    back(){
      this.$emit('UnVisibleAccount',{noclose:'1'})
    },
    closeReason(){
    this.reason=false
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
// 保存账单
saveAccount(){
if(!this.orderInformation){
var method=""
if(this.pzid){
 method="put"
 var data={czman:localStorage.getItem('usrname'),settgid:this.accountData.accountcomgid,area:this.area,wageinout:this.wageinout,pzdom:'账单',system:this.system,paymentgid:this.accountData.paymentgid}
 data.jobnolist=this.accountData.jobnolist
 data.jfweight=this.accountData.chargeWeight
 data.accountweight=this.accountData.accountweightin
 data.volume=this.accountData.realvolume
 data.piece=this.accountData.zdpiece
  data.mdg=this.accountData.mawbmdg

   Object.keys(this.accountData).forEach(key=>{
  if(key!="piece"&&key!="jfweight"&&key!="accountweight"&&key!="volume"&&key!="mdg"){
      data[key]=this.accountData[key]
    }
})
}else{
  method="post"
  var data={czman:localStorage.getItem('usrname'),settgid:this.information.accountcomgid,area:this.area,wageinout:this.wageinout,pzdom:'账单',system:this.system,paymentgid:this.information.paymentgid}
  data.jobnolist=this.information.jobnolist
  data.jfweight=this.accountData.chargeWeight
  data.accountweight=this.accountData.accountweightin
  data.volume=this.accountData.realvolume
 data.piece=this.accountData.zdpiece
 data.mdg=this.accountData.mawbmdg
 Object.keys(this.accountData).forEach(key=>{
  if(key!="piece"&&key!="chargeWeight"&&key!="accountweightin"&&key!="realvolume"&&key!="zdpiece"&&key!="mawbmdg"){
      data[key]=this.accountData[key]
    }
})
}



console.log(JSON.stringify(data))
console.log(this.accountData)

this.$axios({method:method,url:this.$store.state.webApi+'api/ExAiraxpPz',data:data,loading:true,tip:false})
.then(results=>{
if(results.data.resultstatus==0){
  this.$message.success(results.data.resultmessage)
  if(method=="post"){
    this.accountData.accountcode=results.data.resultno
  }else{
     this.accountData.accountcode=this.accountno
  }
   setTimeout(()=>{
    this.getPdf(this.accountData.accountcode,'printData')
  },500)

  setTimeout(()=>{
    this.$emit('UnVisibleAccount',{noclose:'2'})
  },800)
}else{
  this.$message.error(results.data.resultmessage)
}
})
.catch(error=>{

})
}else{
  //alert('1')
 //alert(this.isFromFob)
  if(!this.isFromFob){
   // alert('1')
     this.getPdf('','printData')
  }else{
    var data={guid:this.guid,'overseasacc':'1'}
    this.$axios({method:'post',url:this.$store.state.webApi+'api/UpdateAxplineOverseasAcc',data:data,loading:true,tip:false})
    .then(results=>{
if(results.data.resultstatus==0){
    this.$message.success(results.data.resultmessage)
      this.getPdf('','printData')
        setTimeout(()=>{
    this.$emit('UnVisibleAccount',{noclose:'2'})
  },800)
  }
    })
    .catch(error=>{

    })
  }

}


},
getPdf(title,dom){
var that=this

             document.querySelector('#'+dom).style.fontSize="18px"
            document.querySelector('#caogoInfo').style.fontSize="18px"
             document.querySelector('#bankInfo').style.fontSize="18px"
             document.querySelector('#'+dom).style.fontWeight="bold"
             $('.messerRp').css('font-size','16px')
             document.getElementsByClassName("customer")[0].style.fontSize='16px'

             $('.orderno td').css('font-size','18px')
             $('.costInfo table tr:eq(0) td').css('font-size','18px')
             $('.totalShow').css('height',this.totalAccount.length*30+'px')
              $('.heiji span').css('font-size','16px')


              $('.bankInfo_print').show().css('font-size','18px')
              $('.bankInfo_normal').hide()

              $('#bankInfo_print').hide()
              $('#bankInfo_normal').hide()

              $('#bankInfoPdf_print').show()

             var bankInfo_print=document.getElementsByClassName("bankInfoPdf_print")
             var bankInfo_normal=document.getElementsByClassName("bankInfoPdf_normal")

for(var i=0;i<bankInfo_print.length;i++){
  bankInfo_print[i].style.display='block'
   bankInfo_print[i].style.fontSize='18px'
   bankInfo_print[i].style.fontWeight='normal'
}

for(var i=0;i<bankInfo_normal.length;i++){
  bankInfo_normal[i].style.display='none'

}



  html2Canvas(document.querySelector('#'+dom), {
      allowTaint: true
    }).then(function (canvas) {

        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight

        let pageData = canvas.toDataURL('image/jpeg', 1.0)

        let PDF = new JsPDF('', 'pt', 'a4')
        //PDF.setFontSize(1000)
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title+'.pdf')

           document.querySelector('#'+dom).style.fontSize="12px"
           document.querySelector('#'+dom).style.fontWeight="normal"
            document.querySelector('#bankInfo').style.fontSize="12px"
            document.getElementsByClassName("customer")[0].style.fontSize='12px'
            $('.messerRp').css('font-size','13px')

              $('.orderno td').css('font-size','14px')
              $('.costInfo table tr:eq(0) td').css('font-size','14px')
              $('.heiji span').css('font-size','13px')
              $('.totalShow').css('height',that.totalAccount.length*24+'px')
              $('.bankInfo_print').hide()
              $('.bankInfo_normal').show()

            $('#bankInfo_normal').show()
            $('#bankInfoPdf_print').hide()


              that.accountTemplate.forEach(item=>{
                if(that.mubanInfo.templatename==item.id){

                   $('#bankInfo_print').html(item.bankinfo.replace(/#n#/ig,"<br>"))
                   $('#bankInfoPdf_print').html(item.bankinfo.replace(/#n#/ig,"<br>"))
                   $('#bankInfo_normal').html(item.bankinfo.replace(/#n#/ig,"<br>"))
                }
              })



for(var i=0;i<bankInfo_print.length;i++){
  bankInfo_print[i].style.display='none'
}

for(var i=0;i<bankInfo_normal.length;i++){
  bankInfo_normal[i].style.display='block'

}

    }
    )


 },
// 打印
// noprint: 凭证信息弹窗里面的保存按钮只需要保存不要打印
print(noprint){

  if (!this.orderInformation) {//应收未开票进入

    let method = ""
    let data = {}
    if (this.pzid) {
      method = "put"
      data = { czman: localStorage.getItem('usrname'), settgid: this.accountData.accountcomgid, area: this.area, wageinout: this.wageinout, pzdom: '账单', system: this.system, paymentgid: this.accountData.paymentgid}
      data.jobnolist = JSON.parse(JSON.stringify(this.accountData.jobnolist))
      data.jobnolist.forEach(i=>{
        var wagelist=[]
        i.wagelist.forEach(i2=>{
          if(i2.billwageid!=-1){
            wagelist.push(i2)
          }
        })
        i.wagelist=wagelist
      })
      data.jfweight = this.accountData.chargeWeight
      data.accountweight = this.accountData.accountweightin
      data.volume = this.accountData.realvolume
      data.piece = this.accountData.zdpiece
      data.mdg = this.accountData.mawbmdg
      data.companyname=this.mubanInfo.companyname
      data.companyaddress=this.mubanInfo.companyAddress
      data.bankInfo=this.mubanInfo.bankinfo
     
      Object.keys(this.accountData).forEach(key => {
        if (key != "piece" && key != "jfweight" && key != "accountweight" && key != "volume" && key != "mdg") {
          data[key] = this.accountData[key]
        }
      })
       data.messer=this.mubanInfo.messer
      if(!this.accountData.accountcode){
        this.$message.error('请填写账单号');
        return false
      }
    } else {
      method = "post"
      //console.log(this.information)
      this.information.jobnolist.forEach((item, index) => {
        var wagelistNew = []
        item.wagelist.filter((item3, index3) => {
           //item3.items=getEnglishService(item3.items)
            //item3.currency=getEnglishCurrency(item3.currency)
          if (!item3.thisListHide&&item3.billwageid!=-1) {
            item3.items=getEnglishService(item3.items)
            item3.currency=getEnglishCurrency(item3.currency)
            wagelistNew.push(item3)
          }
          item.wagelist = wagelistNew
        })
      })
      data = { czman: localStorage.getItem('usrname'), settgid: this.information.accountcomgid, area: this.area, wageinout: this.wageinout, pzdom: '账单', system: this.system, paymentgid: this.information.paymentgid,companyname:this.mubanInfo.companyname,companyaddress:this.mubanInfo.companyaddress,bankInfo:this.mubanInfo.bankInfo }
      data.jobnolist = this.information.jobnolist
      data.jfweight = this.accountData.chargeWeight
      data.accountweight = this.accountData.accountweightin
      data.volume = this.accountData.realvolume
      data.piece = this.accountData.zdpiece
      data.mdg = this.accountData.mawbmdg
      data.companyname=this.mubanInfo.companyname
      data.companyaddress=this.mubanInfo.companyAddress
      data.bankInfo=this.mubanInfo.bankinfo
      

      Object.keys(this.accountData).forEach(key => {
        if (key != "piece" && key != "chargeWeight" && key != "accountweightin" && key != "realvolume" && key != "zdpiece" && key != "mawbmdg") {
          data[key] = this.accountData[key]
        }

      })
      data.messer=this.mubanInfo.messer

    }

    if (this.wageinout == '2') {
      if (this.pzList.length > 0 && !this.isPzwageallTotalEqualCostwagetotal) {
        return this.$message.error(`本票账单总金额为:${this.costCNYWageTotal}，与凭证总金额${this.pzwageallTotal}不相符`)
      }
      data.pzList = JSON.parse(JSON.stringify(this.pzList))
      // 新增时accountid为-1
      if (method == 'post') {
        data.pzList.forEach(item => {
          item.accountid = -1
          item.addman = localStorage.usrname
          item.logExtraData = this.logExtraDataForBuild
        })
      } else if (method == 'put') {
        data.pzList.forEach(item => {
          if (!item.accountid) {
            item.accountid = -1
            item.addman = localStorage.usrname
            item.logExtraData = this.logExtraDataForBuild
          }
        })
      }
    } else {
      // 应收不需要这两个字段
      delete data.accountdom
      delete data.taxrate
    }

    // Object.keys(this.accountData).forEach(key=>{
    //  if(key!="piece"&&key!="chargeWeight"&&key!="accountweightin"&&key!="realvolume"&&key!="zdpiece"&&key!="mawbmdg"){
    //       data[key]=this.accountData[key]
    //     }
    // })

    if (this.wageinout == '1') {
      if (this.customerRelList.length === 0) {
        return this.$message.error('请选择本票客户财务联系人')
      }
      data.customerRelList = this.customerRelList
    }

    //console.log(data)
    //this.CreatePrintPage('1212')

    // 备注测试
    //console.log(data)
    this.$axios({ method: method, url: this.$store.state.webApi + 'api/ExAiraxpPz', data: data, loading: true, tip: false })
      .then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage)
          if (method == "post") {
            this.accountData.accountcode = results.data.resultno
          }

          if (noprint) {
            this.credentialVisible = false
          } else {
            setTimeout(() => {
              this.CreatePrintPage(this.accountData.accountcode)
            }, 300)

            setTimeout(() => {
              this.$emit('UnVisibleAccount', { noclose: '2' })
            }, 800)
          }

        } else {
          this.$message.error(results.data.resultmessage)
        }
      })
      .catch(error => {

      })
  } else {

    this.CreatePrintPage(this.accountData.axpjobno)

    // if(!this.isFromFob){//费用未确认进入

    //    this.CreatePrintPage(this.accountData.axpjobno)
    // }else{

    //   if(this.isFromFob=='Fob1'){//海外D/N未制作详细进入
    //     var data={guid:this.guid,area:this.area,overseasacc:'1','overseasaccreason':''}
    //     this.$axios({method:'PUT',url:this.$store.state.webApi+'api/UpdateAxplineOverseasAcc',data:data,loading:true,tip:false})
    //     .then(results=>{
    //     if(results.data.resultstatus==0){
    //     this.$message.success(results.data.resultmessage)
    //     this.CreatePrintPage(this.accountData.axpjobno)
    //       setTimeout(()=>{
    //       this.$emit('UnVisibleAccount',{noclose:'2'})
    //     },800)
    //    }
    //    })
    //   .catch(error=>{

    //   })
    //   }
    // }

  }

},
checkModel(type){//type 1审核通过 2审核驳回
  this.overseasaccreason=""
 if(type=='1'){
this.checkFun('10')
 }else if(type=='2'){
 this.reason=true
 }
},
checkFun(status){

    var data={guid:this.guid,area:this.area,overseasacc:status,overseasaccreason:this.overseasaccreason}

//     var data={guid:this.guid,area:this.area,overseasacc:status,delbillreason:this.abandonReason,delbillreasonJson:[]}
//     this.orderInformation.costInfo.forEach(item=>{
//       data.delbillreasonJson.push({sid:item.sid,delbillreason:item.abandonReason})
//     })
// console.log(data)

      this.$axios({method:'PUT',url:this.$store.state.webApi+'api/UpdateAxplineOverseasAcc',data:data,loading:true,tip:false})
      .then(results=>{
      if(results.data.resultstatus==0){
        this.$message.success(results.data.resultmessage)
        this.reason=false
        this.$emit('closeFob')
     }else{
        this.$message.error(results.data.resultmessage)
     }
     })
    .catch(error=>{

    })
},

CreatePrintPage(name) {
  //console.log(this.mubanInfo.bankinfo)
  //console.log()
  ////console.log(this.$refs.account.innerHTML)
  LODOP=getLodop();
  LODOP.PRINT_INIT(name);
  //  var officeSystemWidth=navigator.userAgent.indexOf('Windows NT 10')!=-1?'735px!important':'100%'
  // var officeSystemRight=navigator.userAgent.indexOf('Windows NT 10')!=-1?'0.6%!important':'0!important'
  // var officeSystemWidth2=navigator.userAgent.indexOf('Windows NT 10')!=-1?'746px!important':'100%'
 console.log(navigator.userAgent)

 // if(navigator.userAgent.indexOf('Windows NT 10')!=-1){
 //  alert('1')
 // }
  //console.log(navigator.userAgent)

  var officeSystemWidth=navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width>1366?'690px!important':navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width<=1366?'710px!important':'710px!important'
  var officeSystemRight=navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width>1366?'0.6%!important':navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width<=1366?'0.5%!important':'0.5%!important'
  var officeSystemWidth2=navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width>1366?'700px!important':navigator.userAgent.indexOf('Windows NT 10')!=-1&&window.screen.width<=1366?'720px!important':'720px!important'

// 特殊情况
  if(navigator.userAgent=="Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"){
  var officeSystemWidth='708px!important'
  //var officeSystemRight='0.6%!important'
  var officeSystemWidth2='718px!important'
  }

 $('#bankPrint').html(this.mubanInfo.bankinfo.replace(/\n/ig,"<br>"))
  //console.log($('#bankPrint').html())


  var cssPage=".printNo{display:none} .companyname{font-size:14px!important;font-weight:bold!important;text-align:right!important;padding-right:10px;margin-bottom:8px;} .printShowT{display:block!important;} .companyaddress{font-size:12px!important;text-align:right!important;padding-right:10px;word-wrap:break-word;word-break:break-all;white-space:pre-wrap;} .printDataTr{border-right:2px solid #e1e1e1;} .printDataTd{width:580px;font-size:13px;} .logo{width:120px;height:70px;} .messer{margin-top:-10px;} .messerData{margin-bottom:40px;border:1px solid #e1e1e1;height:130px;} .messerLeft{float:left;font-size:13px;padding:10px;word-wrap:break-word;word-break:break-all;white-space:pre-wrap; width:46%;} .messerRight{float:right;font-size:13px;padding:10px; width:38%;} .messerRight .messerRp{font-size:13px;margin-bottom:-10px;} .messerRight .messerRp img:nth-child(3){margin-right:50px;} .orderno{background:#f8f8f8;color:#999999;font-weight:bold;border:1px solid #e1e1e1;height:20px;font-size:13px;line-height:20px;padding-left:5px;} .caogoInfo{margin-top:20px} .caogoInfo table tr td{padding-left:16px;} .orderTable{margin-top:20px;border-right:2px solid #e1e1e1;border-left:1px solid #e1e1e1;border-top:1px solid #e1e1e1;margin-left:-3px;} .orderTable2{height:20px;line-height:20px;border-right:none!important;border-left:none!important;font-size:13px;padding-left:5px;border-top:1px solid #e1e1e1} .detail{margin-bottom: 20px;margin-top:20px;border: 1px solid #e8e8e8;} .detail-title{height:20px;line-height:20px;text-indent: 12px;font-size: 13px;font-weight: bolder;color: #999999;background: #f8f8f8;border-bottom: 1px solid #e8e8e8;} .detail-c {padding: 20px;} .detail-c table{width:98%;border-spacing:0px;white-space:nowrap;border-collapse:collapse} .detail-c table tr{color:#333;font-size:13px;} .detail-c table tr th{height:26px;line-height:26px;text-align:center;padding:0px 8px;} .detail-c table tr td{height:26px;line-height:26px;text-align:center;padding:0px 8px} .el-input__inner{display:none} .heiji{font-size:12px;height:12px!important;margin:0;}  .heiji .totalFirst{width:110px!important;display:inline-block;} .heiji .totalSecond{width:110px!important;display:inline-block;margin-left:20px;} .heiji .totalThird{width:50px!important;display:inline-block} .bankInfo{font-size:13px!important;margin-top:15px;} .bankInfo_normal{display:none} .detail-c p{letter-spacing:0.02em!important} .bankInfo_print{display:block} .costInfo{margin-top: 15px;width:"+officeSystemWidth2+";height:auto;border:1px solid #000;padding:10px;} .costInfo table{width:"+officeSystemWidth+"} .costInfo tr:nth-child(1) td{color:#999999;font-weight: bold;padding-bottom:8px;border-bottom:1px solid #e1e1e1;} .costInfo tr:nth-child(2) td{padding-top:8px;} .costInfo tr td:nth-child(1){width:390px;} .costInfo tr td:nth-child(2){width:80px;} .costInfo tr td:nth-child(3){width:80px;} .costInfo tr td:nth-child(4){width:80px;} .costInfo tr td:nth-child(5){width:90px;text-align: right!important} .costInfo tr{height:23px;line-height:23px;font-size:13px;} .costInfo div{font-size: 12px;font-weight: bold;color:#000;} .totalShow{margin-right:"+officeSystemRight+";'height':"+this.totalAccount.length*15+"px!important;'padding-top':"+(this.totalAccount.length*15-this.totalAccount.length*12)/2+"px!important;margin-bottom:6px!important} .bankInfoPdf_print{display:none}"


  var cssStyle = '<style>'+cssPage+'</style>';
  //console.log(this.mubanInfo.bankinfo.indexOf(' '))
  //LODOP.ADD_PRINT_TEXT('1100','50','400','22', "自2014-9月起，我司将全部开具增值税普通发票!");
   LODOP.ADD_PRINT_HTM('2%','2%','98%','297mm',cssStyle+this.$refs.printData.innerHTML);
   //console.log(this.$refs.printData.innerHTML)
   //console.log(this.$refs.printData.innerHTML)
   console.log(officeSystemWidth)
console.log(officeSystemRight)
console.log(officeSystemWidth2)
    LODOP.SET_PREVIEW_WINDOW(1,0,0,1200,800,"");
   LODOP.PREVIEW()
},
//收付对象
// wtdata(data){
//   this.accountData.paymentname=data.wtdata
//   this.accountData.paymentgid=data.id
// },
// 保存修改模板
tabTemSet(method,type){//type 1新增 2修改
  ////console.log(method)
  if(method==""){
    this.$message.error('模板名称不能为空');
    return false
  }
  var data={companylogo:$.trim(this.mubanInfo.companyname),companyinfo:$.trim(this.mubanInfo.companyAddress),bankinfo:$.trim(this.mubanInfo.bankinfo),messer:$.trim(this.mubanInfo.messer),fid:this.accountData.paymentgid,area:this.$store.state.areaState}
if(type=='1'){
  data.templename=method
}else{
  if(type=='2'&&this.templateList.filter(i=>i.id==this.mubanInfo.templatename)[0]['fid']=='-1'){
    data.templename=this.templateList.filter(i=>i.id==method)[0]['name']
  }else{
    data.id=method
  }
  
}
  
//   if(method=='post'){
// data={templename:this.tableTemName,companylogo:$.trim(this.mubanInfo.companyname),companyInfo:$.trim(this.mubanInfo.companyAddress),bankinfo:$.trim(this.mubanInfo.bankinfo)}
//   }else if(method=="put"){
// data={templename:this.muban,companylogo:$.trim(this.mubanInfo.companyname),companyInfo:$.trim(this.mubanInfo.companyAddress),bankinfo:$.trim(this.mubanInfo.bankinfo)}
//   }
  ////console.log(data)
  this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAiraxpAccountTemplate',data:data,loading:false,tip:false})
  .then(results=>{
     if(results.data.resultstatus!="0"){
      this.$message.error(results.data.resultmessage)
     }else{
      this.$message.success(results.data.resultmessage)
      this.getAccountTemplate()
     }
  })
  .catch(error=>{

  })
},
// 删除模板
delMuBan(name){
  if(name.fid=='-1'){
    return
  }
 this.$axios({method:'delete',url:this.$store.state.webApi+'api/ExAiraxpAccountTemplate',data:{id:name.id},loading:false,tip:false})
  .then(results=>{
     if(results.data.resultstatus!="0"){
      this.$message.error(results.data.resultmessage)
     }else{
      this.$message.success(results.data.resultmessage)
      //this.templateList=[]
      this.getAccountTemplate()
     }
  })
  .catch(error=>{

  })
},
// 获取模板
getAccountTemplate(){
this.templateList=[]

        this.$axios({method:'get',url:this.$store.state.webApi+'api/ExAiraxpAccountTemplate',params:{area:this.area,fid:this.accountData.paymentgid}})
      .then(results=>{
        //var a=`[${results.data}]`
        //debugger
        ////console.log(JSON.parse(a)[0])
        ////console.log(results.data[0])

              this.accountTemplate=results.data
//this.accountData.paymentgid
              this.accountTemplate.forEach(item=>{
                this.templateList.push({name:item.templename,id:item.id,fid:item.fid,area:item.area})
              })

            this.mubanInfo.templatename=this.templateList[0]['id']
            this.mubanInfo.companyname=this.accountTemplate[0].companylogo.replace(/#n#/ig,"\n")
            this.mubanInfo.messer=this.templateList[0]['fid']!='-1'?this.accountTemplate[0].messer.replace(/#n#/ig,"\n"):this.accountData.messer
            this.mubanInfo.bankinfo=this.accountTemplate[0].bankinfo.replace(/#n#/ig,"\n")
            if(this.accountTemplate[0].image.indexOf('wecan.png')!=-1){//图片显示路径

           this.mubanInfo.src='./boStatic/images/wecan.png'
          }

             //$('#bankInfo_print').html(this.accountTemplate[0].bankinfo.replace(/#n#/ig,"<br>"))
              //$('#bankInfoPdf_print').html(this.accountTemplate[0].bankinfo.replace(/#n#/ig,"<br>"))


          //this.$forceUpdate()

      })
      .catch(error=>{

      })
},
//64位图片
// createImage(filepath) {
//             var img = new Image();
//             img.src = filepath || '../../icon/wecan.png';
//             img.crossOrigin = "Anonymous";


//                 function getBase64Image(img, width, height) {
//               var canvas = document.createElement("canvas");
//               canvas.width = width ? width : img.width;
//               canvas.height = height ? height : img.height;

//               var ctx = canvas.getContext("2d");
//               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//               var dataURL = canvas.toDataURL();
//               return dataURL;
//             }

//              img.onload = function (result) {
//               try {
//                 this.imgBase64 = getBase64Image(img);
//               }
//               finally { }
//             }



//           }


  },


}
</script>

<style lang="less" scoped>
#account{
  width:1200px;
  margin:0 auto;

    /deep/#companyname {font-size: 22px;font-weight: bold;text-align: right;letter-spacing: 0.1em;margin-top: 12px;border:none;text-align:right}
    #logo{width:160px;height:70px;}

    /deep/#companyaddress {font-size: 13px;float: right;line-height: 1.5em;width:600px;margin-left: 30px;border:none;text-align:right}
    /deep/#bankinfo{border:none;}
   .editInfo{
    span{min-width:100px;display:inline-block;text-align:right}
   }

  .btnGroup{
    width:1100px;

    //text-align:right;
    margin:10px auto;
    padding-bottom:10px;
    border-bottom:2px dotted #e1e1e1;
    span{
      margin-left:10px;
    }
  }
  #printData{
  table{
  border:none
  td{min-width:580px;display:inline-block}
  tr.printDataTr{border-right:2px solid #e1e1e1;}
  /deep/.el-textarea{padding-right:10px;}
}

  }
   .messerData{
    .customer{color:#999999;font-size: 12px;font-weight: bold;padding:0;margin:0}
    width:96%;height:210px;border:1px solid #e1e1e1;margin-top: 40px;
      .messerLeft{
        float:left;
        width:50%;
        word-wrap:break-word;
word-break:break-all;
white-space:pre-wrap;
        text-align: left;
        padding:10px;
          .messerLeftP{
             font-size: 16px;
           }
           /deep/#messer{border:none}
           div{font-size: 16px;}

      }
      .messerRight{
        float: right;
        width: 34%;
        padding-right: 10px;
        margin-top: 0px;
          p{font-size: 13px;font-weight: bold;margin-bottom: 3px;padding:0;}
            #dtNote{width: 100%;font-size: 20px;font-weight: bold;margin-top: 30px;margin-bottom:20px;}
      }
  }

     .caogoInfo{
      width:96%;margin-top: 40px;
      table{
        height:60px;

        tr{
          height:24px;
          td{height:24px;font-size: 14px;padding-left: 10px;line-height: 24px;}
          &:nth-child(1) { background:#f8f8f8;color:#999999;font-weight: bold; border:1px solid #e1e1e1;}
         &:nth-child(2) { color:#000;}
        }

      }
      /deep/.el-input__inner{border:none}
    }

  .detail {
    margin-bottom: 20px;
    margin-top:20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #999999;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      cursor: pointer;
    }
    .detail-c {
      padding: 20px;
      .settlement-table {
        width: 70%;
      }
    }
  }


      .costInfo{margin-top: 40px;width:94%;height:auto;border:1px solid #000;padding:15px}
      .costInfo table tr{height:28px;line-height:28px;}
          .costInfo tr:nth-child(1) td{font-size: 14px;color:#999999;font-weight: bold;padding-bottom:10px;border-bottom:1px solid #e1e1e1;}
          .costInfo tr:nth-child(2) td{padding-top:10px;}


          .costInfo tr td:nth-child(6){width:90px;text-align: right!important}
          .costInfo div{font-size: 14px;font-weight: bold;color:#000;line-height: 1.4em;}

           .heiji{

        span{font-size:12px;text-align:right
        &:nth-child(1){width:110px;display:inline-block;}
        &:nth-child(2){min-width:110px;display:inline-block;margin-left:20px;}
        &:nth-child(3){min-width:50px;display:inline-block}
        }
      }

     .bankInfo{width:94%;min-height:120px;border-top:1px solid #000;bottom:20px;line-height: 1.5em;padding-top:1%;margin-top:15px;}
     .bankInfo_print{display:none}
     .bankInfoPdf_print{display:none}


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
.credentialDialog {
  .title {
    font-size: 18px;
    margin-bottom: 20px;
    span {
      font-size: 12px;
      color: red;
    }
  }
  .footer {
    position: relative;
    overflow: hidden;
    margin: 30px 0 10px;
    font-size: 14px;
    color: #009900;
    p span {
      color: red;
    }
    .wageinfo {
      float: left;
      div:first-child {
        margin-bottom: 10px;
        p {
          display: inline-block;
          margin-right: 38px;
        }
      }
    }
    .btn-c {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
