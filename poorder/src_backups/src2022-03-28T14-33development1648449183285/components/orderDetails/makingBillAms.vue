<template>
   <div class="content" id="printData" style="pointer-events:all" v-if="formdata.guid">
     <div class="topCon" >
        <div class="left">
          <!-- {{limitLength}} -->
          <!-- {{mawbinfo}} -->
          <!-- {{formdata}} -->
          <!-- {{formdata}}
          {{mawbRSinfo}}
          {{hawbRSinfo}} -->
          <!-- {{orderdom}} -->
<!-- {{isams}} -->
          <template v-if="orderdom!='分单'">
              <makeBillRevSed :billRSinfo="mawbRSinfo" :dom="1" :area="formdata.area" :isams="isams" :limitLength='limitLength' ref="makeBillRevSed">
                         <el-input  slot="textCode" type="textarea" rows="1" placeholder="信用代码"  v-model="formdata.taxcode_fhr_mawb" ></el-input>
                         <el-input  slot="textCode2"  type="textarea" rows="1" placeholder="信用代码"  v-model="formdata.taxcode_shr_mawb" ></el-input>
              </makeBillRevSed>
          </template>
          <template v-else>
               <makeBillRevSed :billRSinfo="hawbRSinfo" :dom="2"  :area="formdata.area" :isams="isams" :limitLength='limitLength' ref="makeBillRevSed">
                         <el-input  slot="textCode" type="textarea" rows="1" placeholder="信用代码"  v-model="formdata.taxcode_fhr_hawb" ></el-input>
                         <el-input  slot="textCode2"  type="textarea" rows="1" placeholder="信用代码"  v-model="formdata.taxcode_shr_hawb" ></el-input>
               </makeBillRevSed>
          </template>
        <revSed :dzinfo="formdata"  isams v-if="orderdom!='分单'"  :limitLength='limitLength'>
                         <el-input  slot="textCode"  type="textarea" rows="1" placeholder="信用代码"  v-model="formdata.taxcode_tzr_mawb"  ></el-input>
        </revSed>


             <div class="leftItem">
              <div class="itemTitle" style="margin:10px 15px">Issuing Carrier's Agent Name and City</div>
             <div class="row">
                    <el-input type="textarea" style="margin:0 15px;" v-model="formdata.agentcity" :rows="2"  v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input>
             </div>
           </div>

         <div class="leftItem">
             <div class="row" style="margin-bottom:0px;">
               <div class="rowleft">
                          <div class="itemTitle">Agents IATA Code(Accounting_rule)</div>
                          <div style="display:flex;justify-content:space-between">
                            <el-input  v-model="formdata.iatacode"  v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input>
                            </div>
               </div>
              <div class="rowright" style="border:none">
                          <div class="itemTitle">Account No.</div>
                          <div><el-input v-model="formdata.accountnumber"  v-verify="'uppercase'"></el-input></div>
               </div>
             </div>
         </div>

               <div class="leftItem" style="border:none">
              <div class="itemTitle" style="margin:10px;">Airport of Departure(Add. of First Carrier) and Requested Routing</div>
             <div class="row">
                    <el-input style="margin-left:15px;margin-right:8px;" v-model="sfgquanpin"  v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input>

             </div>
           </div>

     </div>

        <div class="right">
          <div class="rightItem" style="height:105px">
                           <div class="row" style="margin-bottom:0px;">
                            <div style="flex:0 0 150px;">
                              <div class="itemTitle">Not Negotiable</div>
                              <div  style="font-weight:900;font-size:18px;margin-top:8px;">AIR WAYBILL</div>
                              <div class="itemTitle">Issued by</div>
                            </div>
                            <div>
                              <!-- {{airinfo}} -->
                              <el-input type="textarea" :rows="4" v-model="airinfo" v-if="orderdom!='分单'"  v-verify="'uppercase'"></el-input>
                            </div>
                          </div>
          </div>

 <div class="rightItem" style="height:65px;" v-if="orderdom=='分单'">
                  <el-input type="textarea" v-model="formdata.loginfo"  v-verify="'uppercase'"></el-input>
          </div>


        <div class="rightItem" :style="{height:orderdom=='分单'?'35px':'100px'}">
                  Copies 1,2 and 3 of this Air Waybill are originals and have the same validity
          </div>


        <div class="rightItem" style="height:300px;">
                 It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONGS OF CONTARACT ON THE REVERSE HEREOF . ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC  CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER,AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE.THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITAION OF LIABILITY .Shipper may increase such inmitaion of liability by declaring a higher value for  carriage and paying a supplemental charge if required
          </div>

           <div class="rightItem" style="height:259px;">
          <!-- FREIGHT PREPAID -->
          <el-input type="textarea" v-model="formdata.accountinfo" :rows="10" >

          </el-input>
          </div>

          <div class="rightItem" style="height:80px;">
            <div class="itemTitle" style="margin-bottom:10px">Reference Number</div>
            <el-input v-model="formdata.referencenumber"  v-verify="'uppercase'"></el-input>
          </div>

 <div class="rightItem" style="height:80px;">
            <div class="itemTitle" style="margin-bottom:10px">Optional Shipping Information</div>
            <el-input v-model="formdata.shippinginfo"  v-verify="'uppercase'"></el-input>
          </div>

         <div  class="rightItem" style="height:220px;">

                 <span  style="height:48px">Nature and Quantity of Goods <br>(incl.Dimensions or Volume)</span>
          <p v-if='formdata.pm&&formdata.pm.length>100' style="color:red">已超出100字数限制</p>
          <div style="position:relative;top: 2px;margin:12px 0">
        <el-popover placement="top-start" trigger="focus" :disabled="!formdata.pm" offset='100'>
<div style="max-width:530px;position:relative;font-size:12px">
          <template v-for="(f,i) in formdata.pm">
           <span  :style="{color:i>limitLength?'red':''}" :key='i' v-if="!(f=='\n')" style="display:inline">{{f}}</span>
        <span v-else :key='i' style="display:inline"></br></span>
    </template>
</div>
        <el-input slot="reference" type="textarea" :rows="5" v-model="formdata.pm"  v-verify="'uppercase'" class="input-required"></el-input>
        </el-popover>
        </div>
        <span  style="height:34px">VOL:{{formdata.zdvolume}} CBM</span>
      </div>





        </div>
     </div>

     <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8">
          <div class="itemdiv"><span>To</span><el-input :value="formdata.zzg||formdata.mdg" disabled></el-input></div>
          <div class="itemdiv"><span>By First Carrier</span><el-input disabled :value="formdata.hbh&&formdata.hbh.substr(0,2)"></el-input></div>
          <div class="itemdiv" ><span>To</span><el-input v-model="formdata.to1"   v-verify="'uppercase'" ></el-input></div>
          <div class="itemdiv"><span>By</span><el-input v-model="formdata.by1"  v-verify="'uppercase'"></el-input></div>
          <div class="itemdiv"><span>To</span><el-input v-model="formdata.to2"  v-verify="'uppercase'"></el-input></div>
          <div class="itemdiv"><span>By</span><el-input v-model="formdata.by2"  v-verify="'uppercase'"></el-input></div>
          <div class="itemdiv"><span>Currency</span><el-input v-model="formdata.currency"  v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input></div>
          <div class="itemdiv"><span>CHGS<br>Code</span></div>
          <div class="itemdiv" style="flex:0 0 130px"><span>WT/VAL</span>
                     <el-radio v-model="formdata.wtpaymode" label="PP" >PP</el-radio>
                     <el-radio v-model="formdata.wtpaymode" label="CC" >CC</el-radio>
          </div>
    <div class="itemdiv" style="flex:0 0 130px"><span>Other</span>
                     <el-radio v-model="formdata.otherpaymode" label="PP" >PP</el-radio>
                     <el-radio v-model="formdata.otherpaymode" label="CC" >CC</el-radio>
          </div>

          <div class="itemdiv" style="flex:0 0 150px"><span>Declared<br> Value for Carriage</span><el-input v-model="formdata.declarecarriage" v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input></div>
          <div class="itemdiv" style="border:none;flex:0 0 150px"><span>Declared <br>Value for Customs</span><el-input v-model="formdata.declarecustom" v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input></div>
     </div>

     <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8">
          <div class="itemdiv"><div>Airport of Destination</div><el-input v-model="mdgquanpin" :disabled="mawbinfo.area==conditionalAreaForBuild" ></el-input></div>
          <div class="itemdiv"><div>Flight No</div><el-input v-model="formdata.hbh" disabled></el-input></div>
          <div class="itemdiv"><div>Flight Date</div><el-input :value="formdata.hbrq | airdate" disabled ></el-input></div>
          <div class="itemdiv"><div>Amount of Insurance</div><div><el-input v-model="formdata.insuranceamount" style="display:inline-block;margin-right:4%"  v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input></div></div>
          <div class="itemdiv" style="border:none;flex:0 0 460px">
            INSURANCE - If carrier offers insurance,and such Insurance is requested in accordance with the connditions thereof,indicate amount to be insured in figures in box marked"Amount of Insurance".
          </div>
     </div>

     <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8" v-if="orderdom!='分单'">
          <div class="itemdiv"><div>Flight No1</div><el-input v-model="formdata.flightno1" clearable></el-input></div>
          <div class="itemdiv"><div>Flight Date1</div>

          <div style="display:flex">
            <el-input :value="formdata.flightdate1 | airdate"  readonly></el-input>
              <el-date-picker
                v-model="formdata.flightdate1"
                class="flightdata"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          </div>


          </div>
          <div class="itemdiv"><div>Flight No2</div><el-input v-model="formdata.flightno2"  clearable></el-input></div>
          <div class="itemdiv"><div>Flight Date2</div>
                    <div style="display:flex">
            <el-input :value="formdata.flightdate2 | airdate"  readonly></el-input>
              <el-date-picker
                v-model="formdata.flightdate2"
                class="flightdata"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          </div>
        </div>
          <div  style="border:none;flex:0 0 460px"></div>
     </div>

   <div class="row" style="margin-bottom:0px;">
           <div class="itemdiv" style="border:none">
              <div>Handing Information</div>
              <el-input type="textarea" :rows="3" v-model="formdata.handlinginfo"  v-verify="'uppercase'"></el-input>


            </div>

     </div>
           <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8;padding:0px 8px;padding-bottom:4px;justify-content:flex-start;align-items:center">
               <!-- {{descriptioncode}} -->
                          <span v-if="orderdom!='分单'">Special Handing Code</span>
                        <span v-if="orderdom!='分单'" style="margin-left:10px;margin-right:20px;">
                            <el-checkbox-group  v-model="descriptioncode">
                              <el-checkbox :label="item.typename" v-for="item in descriptioncodeOptions" :key="item.typename"></el-checkbox>
                                <!-- <el-checkbox label="ECC"></el-checkbox>
                                <el-checkbox label="EAW"></el-checkbox>
                                <el-checkbox label="EAP"></el-checkbox>
                                <el-checkbox label="BUP"></el-checkbox>
                                <el-checkbox label="ELI"></el-checkbox>
                                <el-checkbox label="ELM"></el-checkbox>
                                <el-checkbox label="SPX"></el-checkbox>
                                <el-checkbox label="VUN"></el-checkbox> -->
                              </el-checkbox-group>
                        </span>

   <span v-if="orderdom=='分单'" style="margin-left:20px;margin-right:50px;">
                                <el-checkbox :label="asAed" v-model="isarranged" ></el-checkbox>
                        </span>


              </div>
             <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8;padding:8px;padding-bottom:4px;justify-content:flex-start;align-items:center">
              <span v-if="orderdom!='分单'" style="height:14px;margin:0 5px;">Goods</span>
               <span v-if="orderdom!='分单'" style="margin-right:40px;">
                               <el-input v-model="formdata.goods"></el-input>
                        </span>
               <span style="height:14px;margin:0 5px;">SLAC</span>
              <el-input  v-model="formdata.smallpiece" style="flex:0 0 120px" v-verify="'integer'" ></el-input>

</div>

<div style="display:flex;width:100%;border-bottom:1px solid #e8e8e8">
   <div style="width:55%;">
           <div class="row" style="margin-bottom:0px;border-bottom:1px solid #e8e8e8">
          <div class="itemdiv"><span>No.of Piece RCP</span><el-input  :class="{'input-required':orderdom=='分单'}" v-model="formdata.zdpiece" :disabled="mawbinfo.area==conditionalAreaForBuild"></el-input></div>
          <div class="itemdiv"><span>Gross Weight(K/G)</span><el-input @change="setTableData(2)"  v-model="formdata.zdweight" :class="{'input-required':orderdom=='分单'}" :disabled="mawbinfo.area==conditionalAreaForBuild"></el-input></div>
          <div class="itemdiv"><span>Vol</span><el-input  @change="setTableData(2)" v-model="formdata.zdvolume"  v-verify="'uppercase'" :disabled="mawbinfo.area==conditionalAreaForBuild"></el-input></div>
          <div class="itemdiv"><span>Rate Class</span><el-input v-model="formdata.ratelevel" v-verify="'uppercase'"  :class="{'input-required':orderdom!='分单'}"></el-input></div>
          <div class="itemdiv"><span>Commodity Item No.</span><el-input v-model="formdata.prodnumber" v-verify="'uppercase'" ></el-input></div>
          <div class="itemdiv"><span>Chargeable Weight(K/G)</span><el-input  v-model="formdata.jfweight"  :class="{'input-required':orderdom!='分单'}" :disabled="orderdom!='分单'&&mawbinfo.area==conditionalAreaForBuild"></el-input></div>
          <div class="itemdiv"><span>Rate/Charge</span><el-input v-model="formdata.rate"  :class="{'input-required':orderdom!='分单'}"></el-input></div>
          <div class="itemdiv" style="border:none;"><span>Total</span><el-input v-model="formdata.ratetotal" :disabled="mawbinfo.area==conditionalAreaForBuild"></el-input></div>
     </div>

     <div class="row" style="margin-bottom:0px;">
            <p v-if='formdata.remark&&formdata.remark.length>500' style="color:red">已超出500字数限制</p>

          <div class="itemdiv" style="border:none;">
            <div>REMARK</div>
       <!-- <el-popover placement="bottom" trigger="focus" :disabled="!formdata.remark">
        <div>{{formdata.remark.substr(0,500)}}<span style="color:red">{{formdata.remark.substr(500)}}</span></div> -->
                <el-input slot="reference" type="textarea" :rows="3" v-model="formdata.remark"  v-verify="'uppercase'"></el-input>
      <!-- </el-popover> -->
          </div>

     </div>
   </div>

      <div class="itemdiv" style="border:none;width:45%;border-left:1px solid #e8e8e8">

                   <!-- <span  style="height:48px">Nature and Quantity of Goods <br>(incl.Dimensions or Volume)</span>
          <p v-if='formdata.pm&&formdata.pm.length>100' style="color:red">已超出100字数限制</p>
          <div style="position:relative;top: 52px;">
        <el-popover placement="top-start" trigger="focus" :disabled="!formdata.pm" offset='100'>
<div style="max-width:530px;position:relative;font-size:12px">
          <template v-for="(f,i) in formdata.pm">
           <span  :style="{color:i>limitLength?'red':''}" :key='i' v-if="!(f=='\n')" style="display:inline">{{f}}</span>
        <span v-else :key='i' style="display:inline"></br></span>
    </template>
</div>
        <el-input slot="reference" type="textarea" :rows="5" v-model="formdata.pm"  v-verify="'uppercase'" class="input-required"></el-input>
        </el-popover>
        </div>
        <span  style="height:34px">VOL:{{formdata.zdvolume}} CBM</span> -->
           <commonTable :head="tableHead" :table-data="tableData" v-if="orderdom!='分单'" style="margin-bottom:10px;"></commonTable>
        <wageListTable :tableData="formdata.wagelist" :mawbinfo="formdata" v-if='formdata.guid' :wagelistOriginalData="wagelistOriginalData" isams :guid="formdata.guid"></wageListTable>

    </div>
</div>



<div class="row" style="margin-bottom:10px;border-bottom:1px solid #e8e8e8;" v-if="orderdom!='分单'">
<!-- {{storevolumeList}} -->
<div style="flex-direction:column;padding-top:12px">
   <div style="display:flex;align-items: center;width:800px;margin-bottom:15px;padding-left:20px" v-for="(item,index) in storevolumeList" :key="index">
     <span>长：</span><el-input style="flex:0 0 80px;margin-right:20px;" v-model="item.longs"></el-input>
     <span>宽：</span><el-input style="flex:0 0 80px;margin-right:20px;" v-model="item.widths"></el-input>
     <span>高：</span><el-input style="flex:0 0 80px;margin-right:20px;" v-model="item.heights"></el-input>
     <span style="flex:0 0 50px;">件数：</span><el-input style="flex:0 0 80px;margin-right:20px;" v-model.number="item.piece"></el-input>
     <span style="flex:0 0 50px;">体积：</span><el-input style="flex:0 0 100px;margin-right:20px;" :value="(Number((item.longs*item.widths*item.heights*item.piece)||0)/1000000).toFixed(3)" disabled></el-input>
     <span v-if="index==0" @click="handleStoreList(1,index)" class="el-icon-circle-plus" style='width: 18px; height: 18px; font-size: 18px; cursor: pointer;  color: rgb(103, 194, 58);'></span>
     <span v-if="index>=1" @click="handleStoreList(2,index)" class="el-icon-remove" style='width: 18px; height: 18px; font-size: 18px; cursor: pointer;  red'></span>
    </div>
</div>
<div style="border-left:1px solid #e8e8e8;padding:12px 20px" >
  <span>单证类型：</span>
  <el-radio v-model="formdata.orderdom" label="总单">总单</el-radio>
  <el-radio v-model="formdata.orderdom" label="直单">直单</el-radio>
</div>
</div>


<div class="row" style="margin-bottom:10px;margin-top:10px;">
     <div>
             <span style="margin:10px;">实际制单人</span><el-input style="width:200px;" v-model="formdata.addman"  disabled class="input-required"></el-input>
         <span style="margin:10px;">实际制单日期</span>
           <el-date-picker
      v-model="formdata.adddate"
      type="datetime"
      class="input-required"
      placeholder=""
      disabled>
    </el-date-picker>
        <span style="margin:10px;">修改人</span>
        <el-input style="width:100px;" v-model="formdata.modifyman" v-verify="'uppercase'" disabled></el-input>
        <span style="margin:10px;" >修改日期</span>
        <el-date-picker v-model="formdata.modifydate" style="width:180px;" type="datetime" placeholder disabled></el-date-picker>
        </div>



</div>


<div class="row" style="margin-bottom:10px;margin-top:10px;">



       <div style="text-align:right;margin-right:15px;" v-show="(pagetype!=2||mawbguid!=-1)">
       <!-- <el-button @click="saveBillInfo">完成待确认</el-button> -->
       <el-button @click="saveBillInfo">保存AMS信息</el-button>
           <!-- <el-button @click="printFunc(1)" style="pointer-events:auto">正本运单打印</el-button>
       <el-button @click="printFunc(2)" style="pointer-events:auto">打印设置</el-button> -->

      </div>

</div>



   </div>
</template>

<script>
import {getPdf, getMomentDate,computedWeight,formatDate} from '../../api/localStorage.js'
import {getLodop} from '../../api/LodopFuncs.js'
import wageListTable from './wageListTable'
import makeBillRevSed from '../templates/makeBillRevSed'
import revSed from "../templates/revSed";

export default {
  components: {
    wageListTable,makeBillRevSed,revSed
    },
  props:{
    mawbguid:[Number,String],
    sid:[Number,String],
    orderdom:{
      type:String,
      default:"总单"
    }
    ,pagetype:{
      type:[Number,String],
      default:1 //1默认空出 2国内服务
    } ,
    isams:{
      type:Boolean,
      default:true
    },
    mawbinfo:{
      type:Object,
      default:()=>{}
    }
  },
    data(){

      return {
       mawbRSinfo: [
        {"title":"发货人","companytitle_fhr_mawb":"","address_fhr_mawb":"","companycode_fhr_mawb":"","state_fhr_mawb":"","city_fhr_mawb":"","postcode_fhr_mawb":"","lxr_fhr_mawb":"","phone_fhr_mawb":"","fax_fhr_mawb":"","email_fhr_mawb":"","zdfhrId":"",jsonArr:{type:'1',mdg:this.mawbinfo.sfg,gid:this.mawbinfo.gid,codetype:1},model:""},
        {"title":"收货人","companytitle_shr_mawb":"","address_shr_mawb":"","companycode_shr_mawb":"","state_shr_mawb":"","city_shr_mawb":"","postcode_shr_mawb":"","lxr_shr_mawb":"","phone_shr_mawb":"","fax_shr_mawb":"","email_shr_mawb":"","zdshrId":"",jsonArr:{type:'1',mdg:this.mawbinfo.mdg,gid:this.mawbinfo.gid,codetype:2},model:""},
      ],
        hawbRSinfo:[
            {"title":"发货人","companytitle_fhr_hawb":"","address_fhr_hawb":"","companycode_fhr_hawb":"","state_fhr_hawb":"","city_fhr_hawb":"","postcode_fhr_hawb":"","lxr_fhr_hawb":"","phone_fhr_hawb":"","fax_fhr_hawb":"","email_fhr_hawb":"","fdfhrId":"",jsonArr:{type:'2',mdg:this.mawbinfo.sfg,gid:this.mawbinfo.gid,codetype:1},model:""},
            {"title":"收货人","companytitle_shr_hawb":"","address_shr_hawb":"","companycode_shr_hawb":"","state_shr_hawb":"","city_shr_hawb":"","postcode_shr_hawb":"","lxr_shr_hawb":"","phone_shr_hawb":"","fax_shr_hawb":"","email_shr_hawb":"","fdshrId":"",jsonArr:{type:'2',mdg:this.mawbinfo.mdg,gid:this.mawbinfo.gid,codetype:2},model:""},
          ],
        formdata:{},
        tableHead:[
          {title:"类型",field:"type"},
          {title:"件重体",field:"jztinfo"},
          {title:"计费重量",field:"jfweight"},
        ],
        tableData:[
            {type:"预报",jztinfo:'',jfweight:""},
            {type:"实际",jztinfo:'',jfweight:""},
            {type:"制单",jztinfo:'',jfweight:""}
        ],
        airinfo:"",
        ppothertotal:0,
        mdgquanpin:"",
        sfgquanpin:"",
        wagelistBackups:[],
        wagelistOriginalData:[],
        storevolumeList:[{longs:'',widths:'',heights:'',piece:''}],





      }
    }
    ,methods:{
      setTableData(type){
        if(type==2){
          this.formdata.jfweight=computedWeight(this.formdata.zdvolume,this.formdata.zdweight)
        }
          if(this.pagetype==1){
                    this.tableData[0].jztinfo=`${this.formdata.ybpiece}/${Number(this.formdata.ybweight).toFixed(2)}/${Number(this.formdata.ybvolume).toFixed(3)}`
                    this.tableData[1].jztinfo=`${this.formdata.realpiece}/${Number(this.formdata.realweight).toFixed(2)}/${Number(this.formdata.realvolume).toFixed(3)}`
                    this.tableData[2].jztinfo=`${this.formdata.zdpiece}/${Number(this.formdata.zdweight).toFixed(2)}/${Number(this.formdata.zdvolume).toFixed(3)}`

                    this.tableData[0].jfweight=computedWeight(this.formdata.ybvolume,this.formdata.ybweight)
                    this.tableData[1].jfweight=computedWeight(this.formdata.realvolume,this.formdata.realweight)
                    this.tableData[2].jfweight=computedWeight(this.formdata.zdvolume,this.formdata.zdweight)


                }else{

                    this.formdata.realpiece = this.formdata.zdpiece = this.formdata.ybpiece = this.formdata.piece;
                    this.formdata.realweight = this.formdata.zdweight = this.formdata.ybweight = this.formdata.weight;
                    this.formdata.realvolume = this.formdata.zdvolume = this.formdata.ybvolume = this.formdata.volume;

                    let str=`${this.formdata.piece}/${Number(this.formdata.weight).toFixed(2)}/${Number(this.formdata.volume).toFixed(3)}`
                    let jfweight=computedWeight(this.formdata.volume,this.formdata.weight)

                    this.tableData[2].jztinfo= this.tableData[1].jztinfo=this.tableData[0].jztinfo=str
                    this.tableData[2].jfweight= this.tableData[1].jfweight=this.tableData[0].jfweight=jfweight
                }

      },
      handleStoreList(type,index){//处理尺寸信息，1新增 2修改
            if(type==1){
              let obj=this.storevolumeList[this.storevolumeList.length-1]
              if(!obj.longs||!obj.widths||!obj.heights||!obj.piece){
                return this.$message.error('请填写完整信息！');
              }
                 let num=Number(this.formdata.zdpiece||0)-(this.storevolumeList.length>0?this.storevolumeList.map(i=>Number(i.piece)).reduce((a,b)=>{return a+b}):0)

                // console.log(this.formdata.zdpiece)
                // console.log(num)
              if(num<0){
                return this.$message.error('尺寸件数之和不能大于制单件数！');
              }
              if(num==0){
                return this.$message.error('尺寸件数之和已等于制单件数，不能继续添加！');
              }
              this.storevolumeList.push({longs:'',widths:'',heights:'',piece:num})
            }else{
                   this.storevolumeList.splice(index,1)
            }
      },
      initForm(){
        if(this.orderdom!='分单'){
             this.formdata=  {
            sid:""
            ,sfg:''
            ,mdg:''
            ,guid:-1
            ,code_fhr_mawb:""
            ,companytitle_fhr_mawb:""
            ,address_fhr_mawb:""
            ,city_fhr_mawb:""
            ,postcode_fhr_mawb:""
            ,companycode_fhr_mawb:""
            ,state_fhr_mawb:""
            ,lxr_fhr_mawb:""
            ,phone_fhr_mawb:""
            ,email_fhr_mawb:""
            ,fax_fhr_mawb:""
            ,code_shr_mawb:""
            ,companytitle_shr_mawb:""
            ,address_shr_mawb:""
            ,city_shr_mawb:""
            ,postcode_shr_mawb:""
            ,companycode_shr_mawb:""
            ,state_shr_mawb:""
            ,lxr_shr_mawb:""
            ,phone_shr_mawb:""
            ,email_shr_mawb:""
            ,fax_shr_mawb:""
            ,agentcity:this.agentcity,
            agent:"",
            iatacode:""
            ,accountnumber:""
            ,referencenumber:""
            ,to1:""
            ,by1:""
            ,to2:""
            ,by2:""
            ,to3:""
            ,by3:""
            ,accountinfo:"FREIGHT PREPAID"
            ,shippercertify:""
            ,currency:"CNY"
            ,wtpaymode:""
            ,otherpaymode:""
            ,declarecarriage:"NVD"
            ,declarecustom:"NCV"
            ,insuranceamount:"XXX"
            ,handlinginfo:"NO SOLID WOODEN PACKING MATERIAL"
            ,zdpiece:""
            ,zdweight:""
            ,zdvolume:""
            ,ratelevel:""
            ,rate:""
            ,ratetotal:""
            ,prodnumber:""
            ,descriptioncode:""
            ,pm:""
            ,ppvaluation:""
            ,ccvaluation:""
            ,wagelist:[],
            storevolumeList:[],
            fm1:'',
            fm2:'',
            mawbmdg:'',
            hbh:'',
            hbrq:'',
            jfweight:'',
            isarranged:2 //1选中 2，未选中
            ,remark:''
            ,wtfffs:''
            ,otherfffs:'',
            taxcode_fhr_mawb:'',
            taxcode_shr_mawb:'',
            flightno1:'',
            flightdate1:'',
            flightno2:'',
            flightdate2:'',
             code_tzr_mawb: "",
          companytitle_tzr_mawb: "",
          address_tzr_mawb: "",
          city_tzr_mawb: "",
          postcode_tzr_mawb: "",
          companycode_tzr_mawb: "",
          state_tzr_mawb: "",
          lxr_tzr_mawb: "",
          phone_tzr_mawb: "",
          email_tzr_mawb: "",
          fax_tzr_mawb: "",
          taxcode_tzr_mawb: "",
          goods:"",
          shippinginfo:'',
          smallpiece:'',
        }
        }else{
                this.formdata=  {
            sid:"",
            sfg:'',
            mdg:'',
            guid:-1
            ,code_fhr_hawb:""
            ,companytitle_fhr_hawb:""
            ,address_fhr_hawb:""
            ,city_fhr_hawb:""
            ,postcode_fhr_hawb:""
            ,companycode_fhr_hawb:""
            ,state_fhr_hawb:""
            ,lxr_fhr_hawb:""
            ,phone_fhr_hawb:""
            ,email_fhr_hawb:""
            ,fax_fhr_hawb:""
            ,code_shr_hawb:""
            ,companytitle_shr_hawb:""
            ,address_shr_hawb:""
            ,city_shr_hawb:""
            ,postcode_shr_hawb:""
            ,companycode_shr_hawb:""
            ,state_shr_hawb:""
            ,lxr_shr_hawb:""
            ,phone_shr_hawb:""
            ,email_shr_hawb:""
            ,fax_shr_hawb:""
            ,agentcity:this.agentcity
            ,agent:""
            ,iatacode:""
            ,accountnumber:""
            ,referencenumber:""
            ,to1:""
            ,by1:""
            ,to2:""
            ,by2:""
            ,to3:""
            ,by3:""
            ,accountinfo:"FREIGHT PREPAID"
            ,shippercertify:""
            ,currency:"CNY"
            ,wtpaymode:""
            ,prodnumber:""
            ,descriptioncode:""
            ,otherpaymode:""
            ,declarecarriage:"NVD"
            ,declarecustom:"NCV"
            ,insuranceamount:"XXX"
            ,handlinginfo:"NO SOLID WOODEN PACKING MATERIAL"
            ,zdpiece:""
            ,zdweight:""
            ,zdvolume:""
            ,ratelevel:""
            ,rate:""
            ,ratetotal:""
            ,pm:""
            ,ppvaluation:""
            ,ccvaluation:""
            ,wagelist:[],
            storevolumeList:[],
            fm1:'',
            fm2:'',
            mawbmdg:'',
            hbh:'',
            hbrq:'',
            jfweight:'',
            isarranged:2 //1选中
            ,remark:''
            ,wtfffs:''
            ,otherfffs:''
            ,taxcode_fhr_hawb:'',
            taxcode_shr_hawb:'',
           shippinginfo:'',
           smallpiece:'',
        }
        }

        this.formdata.addman=localStorage.getItem("usrname")
        this.formdata.adddate=getMomentDate()
         this.formdata.wtpaymode='PP'
         this.formdata.otherpaymode='PP'
       // this.formdata.to1=this.formdata.zzg

      },
      getAirinfo(){

        if(!localStorage.getItem('airinfo')){
                let area=this.mawbinfo.area||this.formdata.area
                if(!area) return;
              this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubAirCompany",params:{area:area},loading:false,tip:false}).then(results=>{
                 //console.log('航空信息')
                 //console.log(results.data)
                 localStorage.setItem('airinfo',JSON.stringify(results.data))
                 results.data.forEach(i=>{
                      if(!this.formdata.mawb){
                        return ""
                      }
                       if(i.ThreeCode==this.formdata.mawb.substr(0,3)){

                        this.airinfo= i.ZxydTitle
                      }
                  })

               })
        }else{

          var airinfo=JSON.parse(localStorage.getItem('airinfo'));
                airinfo.forEach(i=>{
                      if(!this.formdata.mawb){
                        return ""
                      }
                      if(i.ThreeCode==this.formdata.mawb.substr(0,3)){
                        this.airinfo=i.ZxydTitle;
                      }
                  })

        }

      },
      getBillInfo(guid){


          this.$axios({method:'get',url:this.$store.state.webApi+this.ajaxUrl,params:{sid:guid||this.mawbguid},loading:false,tip:false}).then(results=>{
                     // console.log(results.data)
                         if(results.data){
                                       this.setBillInfo(results.data)
                                          if(this.orderdom!='分单'&&(this.orderdom!=results.data.orderdom)){
                                                this.$emit('odmChangeFunc',results.data.orderdom)
                                          }
                         }else{
                           if(results.data) {
                            return this.$message.error(`查询制单信息错误！查询结果为${results.data}`)
                           }
                         }

                      })


      },
      setBillInfo(data){
                 if(!data){

                this.initForm()
              }else{
                   this.initForm()
                   this.formdata=Object.assign({},this.formdata,data)
                    this.getAirinfo() //航司信息
              }


              this.wagelistBackups=JSON.stringify(this.formdata.wagelist)||[]

                             this.mawbRSinfo.forEach(item=>{
                                   Object.keys(item).forEach(key=>{
                                   //  //console.log(key)
                                            if(this.formdata[key]){
                                       item[key]=this.formdata[key]
                                    }
                                 })
                             })

                                this.hawbRSinfo.forEach(item=>{
                                   Object.keys(item).forEach(key=>{
                                   //  //console.log(key)
                                            if(this.formdata[key]){
                                       item[key]=this.formdata[key]
                                    }
                                 })
                             })

                             this.getRate()
                             this.getAreaPrice()
                             this.getHbinfo()
                             this.formdata.addman=this.formdata.addman||localStorage.getItem("usrname")
                            this.formdata.adddate=this.formdata.adddate||getMomentDate()
                            if(this.orderdom=='分单'){
                              this.formdata.currency=this.formdata.currency||'CNY'
                            }
                      if(this.formdata.guid==-1){
                        if(this.formdata.zzg&&this.formdata.zzg!=this.formdata.mdg){
                          this.formdata.to1=this.formdata.mdg
                          this.formdata.by1=this.formdata.hbh&&this.formdata.hbh.substr(0,2)
                        }else{
                          this.formdata.to1=''
                          this.formdata.by1=''
                          this.formdata.to2=''
                          this.formdata.by2=''
                        }
                      }
                       this.formdata.declarecarriage=this.formdata.declarecarriage||"NVD"
                       this.formdata.declarecustom= this.formdata.declarecustom||"NCV"
                       this.formdata.insuranceamount=this.formdata.insuranceamount||'XXX'

                       this.formdata.otherpaymode=this.formdata.otherpaymode||'PP'
                       this.formdata.wtpaymode=this.formdata.wtpaymode||'PP'
                       this.formdata.accountinfo=this.formdata.accountinfo||'FREIGHT PREPAID'
                       this.formdata.flightdate1 = formatDate(this.formdata.flightdate1, 'yyyy-MM-dd')
                       this.formdata.flightdate2 = formatDate(this.formdata.flightdate2, 'yyyy-MM-dd')
                       this.formdata.agentcity = this.formdata.agentcity || this.agentcity
                       this.formdata.smallpiece=this.formdata.smallpiece||this.formdata.zdpiece

                        this.storevolumeList=this.formdata.storevolumeList.length>0?this.formdata.storevolumeList:this.storevolumeList
                    this.setTableData(1)

      },
      getInfo(){
       let requireData={}

        /* if(this.orderdom!='分单'){
                  if(parseInt(this.formdata.zdpiece)!=parseInt(this.formdata.realpiece)){
              this.$message.error("制单件数与实际件数不匹配！");return
          }
         }
 */
         var json=JSON.parse(JSON.stringify(this.formdata));
         var wagelist=JSON.parse(JSON.stringify(json.wagelist));

         if(this.wagelistBackups&&this.wagelistBackups.length>0){
         JSON.parse(this.wagelistBackups).forEach(el => {

           var n=false;

             json.wagelist.forEach((item,i)=>{
                  if(item.guid>0){
                if(el.guid==item.guid){
                  n=true
                    if(JSON.stringify(el)==JSON.stringify(item)){
                       wagelist[i].isdel=1
                    }
                  }

                }
             })

             if(!n){
               wagelist.push({guid:el.guid,isdel:2,sid:-1})
             }
         });

         }
//console.log(wagelist)
         json.sid=this.isams&&this.orderdom=='分单'&&this.sid?this.sid:this.mawbguid
          // alert(json.sid)
         json.wagelist=wagelist
         //console.log(JSON.stringify(json));
         if(this.orderdom!='分单'){
             json=Object.assign({},json,this.mawbRSinfo[0],this.mawbRSinfo[1])
         }else{
              json=Object.assign({},json,this.hawbRSinfo[0],this.hawbRSinfo[1])
         }



                  if(this.orderdom=='分单'){
                      requireData={
                            zdpiece:'制单件数',
                            zdweight:'制单重量',
                            companytitle_fhr_hawb:'发货人的抬头',
                            address_fhr_hawb:'发货人的地址',
                            companycode_fhr_hawb:'发货人的国家二字码',
                            city_fhr_hawb:"发货人城市",
                            postcode_fhr_hawb:"发货人邮编",
                            companytitle_shr_hawb:'收货人的抬头',
                            address_shr_hawb:'收货人的地址',
                            companycode_shr_hawb:'收货人的国家二字码',
                            city_shr_hawb:"收货人城市",
                            postcode_shr_hawb:"收货人邮编",
                         //   smallpiece:'SLAC',
                            pm:"品名",
                            addman:'实际制单人',
                            adddate:'实际制单日期'
                      }

          }else{

                  requireData={
                        companytitle_fhr_mawb:'总单发货人的抬头',
                        address_fhr_mawb:'总单发货人的地址',
                        companycode_fhr_mawb:'总单发货人的国家二字码',
                        city_fhr_mawb:"发货人城市",
                        postcode_fhr_mawb:"发货人邮编",
                        companytitle_shr_mawb:'总单收货人的抬头',
                        address_shr_mawb:'总单收货人的地址',
                        companycode_shr_mawb:'总单收货人的国家二字码',
                        city_shr_mawb:"收货人城市",
                        postcode_shr_mawb:"收货人邮编",
                        pm:"品名",
                      //  handlinginfo:"Handing Information",
                        agentcity:"Issuing Carrier's Agent Name and City",
                        iatacode:'Agents IATA Code',
                      //  sfgquanpin:'Airport of Departure(Add. of First Carrier) and Requested Routing',
                        currency:'currency',
                        declarecarriage:'Declared Value for Carriage',
                        declarecustom:'Declared Value for Customs',
                        insuranceamount:'Amount of Insurance',
                      //  smallpiece:'SLAC',
                        ratelevel:'Rate Class',
                        jfweight:'Chargeable Weight(K/G)',
                        rate:'Rate/Charge',
                        addman:'实际制单人',
                        adddate:'实际制单日期'
                  }
          }

        let arr=Object.keys(requireData)
        for(let i in arr){
          if(!json[arr[i]]){
           // console.log(arr[i])
            this.$message.error('请填写'+requireData[arr[i]]);return;
          }
        }

        if(this.orderdom!='分单'&&(json.companycode_fhr_mawb.length!==2||json.companycode_shr_mawb.length!==2)){
              this.$message.error('国家二字码必须为两位数！');return
        }
        if(this.orderdom=='分单'&&(json.companycode_fhr_hawb.length!==2||json.companycode_shr_hawb.length!==2)){
              this.$message.error('国家二字码必须为两位数！');return

        }
        if(this.$refs.makeBillRevSed&&this.$refs.makeBillRevSed.ifHasLimit()){
              this.$message.error('请检查收发货人信息是否超出字符限制！');return
        }
        let storevolumeList =this.storevolumeList.filter(i=>i.widths&&i.longs&&i.heights&&i.piece)
        if(storevolumeList.length>0&&storevolumeList.map(i=>Number(i.piece)).reduce((a,b)=>{return a+b})!=json.zdpiece){
           this.$message.error('尺寸件数之和必须等于制单件数！');
            return ;
        }

        if(json.smallpiece<json.zdpiece){
        this.$message.error('小件数不能小于制单件数！'); return
       }

        json.storevolumeList=storevolumeList
        return json
      },
       saveBillInfo(){
         var json=this.getInfo()
           if(!json){return}
              if(json.sendstatus>=10){
                  this.$confirm('订单已导出或已发送航司，再次保存信息会改为二次修改,请确认是否保存?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.apiData(json);
                    })
              }else{
                      this.apiData(json);
              }

          },
          apiData(json){
                    var method=json.guid==-1?"post":"put"
           this.$axios({method:method,url:this.$store.state.webApi+this.ajaxUrl,data:json,loading:true,tip:false,noarea:true}).then(results=>{
              //console.log("保存制单总运单")
              //console.log(results.data)
              if(results.data.resultstatus==0){
                layer.msg("操作成功");
                if(this.isams&&results.data.resultguid&&results.data.resultguid!="0"){
                    //this.mawbguid=results.data.resultguid
                    this.$emit('saveSuccess',results.data.resultguid)
                }
                this.getBillInfo(results.data.resultguid!='0'?results.data.resultguid:'')

              }else{
              this.$message.error('制单信息保存失败！'+results.data.resultmessage)
              }

            })
          }
          , printFunc(type) {

        /*     if(this.orderdom!='分单'){
                  if(parseInt(this.formdata.zdpiece)!=parseInt(this.formdata.realpiece)){
              this.$message.error("制单件数与实际件数不匹配！");return
          }
            } */

  // getPdf('总单制单','printData')
               var lodop=getLodop();
        //lodop.PRINT_INIT("ZXYD");
        lodop.PRINT_INITA('0','0','794','1123','ZXYD')

             var json={}
             var FhrCompanyTitle=""
             var ShrCompanyTitle=""
             var TzrCompanyTitle = "";
 
// this.formdata.hbh=this.formdata.hbh
// this.formdata.hbrq=this.formdata.hbrq
              json=Object.assign({},this.formdata,this.mawbRSinfo[0],this.mawbRSinfo[1]);
//console.log(JSON.stringify(json))

  if(this.orderdom!='分单'){
              if(!this.formdata.mawb){
                    this.$message.error('总运单未配置，无法打印！');return
             }else if(!this.formdata.zdpiece||!this.formdata.zdweight||!this.formdata.zdvolume){
                    this.$message.error('制单件重体未补全无法打印！');return
             }
          /*    else if(this.formdata.shipaceid==-1){
                    this.$message.error('未配舱无法打印！');return
             } */

  }else{
            if(!this.formdata.zdpiece||!this.formdata.zdweight||!this.formdata.zdvolume){
                    this.$message.error('制单件重体未补全无法打印！');return
             }
  }

                     layer.msg('正在生成打印单，请稍候.....')



             if(this.orderdom!='分单'){

             FhrCompanyTitle=json.companytitle_fhr_mawb+"\r\n"+json.address_fhr_mawb;
                if(json.lxr_fhr_mawb!=''){ FhrCompanyTitle+=" "+json.lxr_fhr_mawb }
                if(json.phone_fhr_mawb!=''){ FhrCompanyTitle+=" "+json.phone_fhr_mawb }
                if(json.fax_fhr_mawb!=''){ FhrCompanyTitle+=" "+json.fax_fhr_mawb }
                if(json.email_fhr_mawb!=''){ FhrCompanyTitle+=" "+json.email_fhr_mawb}

              ShrCompanyTitle=json.companytitle_shr_mawb+"\r\n"+json.address_shr_mawb;
                if(json.lxr_shr_mawb!=''){ ShrCompanyTitle+=" "+json.lxr_shr_mawb }
                if(json.phone_shr_mawb!=''){ ShrCompanyTitle+=" "+json.phone_shr_mawb }
                if(json.fax_shr_mawb!=''){ ShrCompanyTitle+=" "+json.fax_shr_mawb }
                if(json.email_shr_mawb!=''){ ShrCompanyTitle+=" "+json.email_shr_mawb}

                TzrCompanyTitle = json.companytitle_tzr_mawb + "\r\n" + json.address_tzr_mawb;
               if (json.lxr_tzr_mawb != '') { TzrCompanyTitle += " " + json.lxr_tzr_mawb }
               if (json.phone_tzr_mawb != '') { TzrCompanyTitle += " " + json.phone_tzr_mawb }
               if (json.fax_tzr_mawb != '') { TzrCompanyTitle += " " + json.fax_tzr_mawb }
               if (json.email_tzr_mawb != '') { TzrCompanyTitle += " " + json.email_tzr_mawb }
         }else{

              FhrCompanyTitle=json.companytitle_fhr_hawb+"\r\n"+json.address_fhr_hawb;
                if(json.lxr_fhr_hawb!=''){ FhrCompanyTitle+=" "+json.lxr_fhr_hawb }
                if(json.phone_fhr_hawb!=''){ FhrCompanyTitle+=" "+json.phone_fhr_hawb }
                if(json.fax_fhr_hawb!=''){ FhrCompanyTitle+=" "+json.fax_fhr_hawb }
                if(json.email_fhr_hawb!=''){ FhrCompanyTitle+=" "+json.email_fhr_hawb}

              ShrCompanyTitle=json.companytitle_shr_hawb+"\r\n"+json.address_shr_hawb;
                if(json.lxr_shr_hawb!=''){ ShrCompanyTitle+=" "+json.lxr_shr_hawb }
                if(json.phone_shr_hawb!=''){ ShrCompanyTitle+=" "+json.phone_shr_hawb }
                if(json.fax_shr_hawb!=''){ ShrCompanyTitle+=" "+json.fax_shr_hawb }
                if(json.email_shr_hawb!=''){ ShrCompanyTitle+=" "+json.email_shr_hawb}
         }

            //送发货人




            lodop.ADD_PRINT_TEXT(150,40,330,70,FhrCompanyTitle );
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(240,40,330,70,ShrCompanyTitle );
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(330,40,330,50,json.agentcity );
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(390,40,150,20,json.iatacode);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(390,210,160,20,json.accountnumber);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(330,390,350,80,json.accountinfo);
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);



             //航班信息
            lodop.ADD_PRINT_TEXT(425,40,300,20,this.sfgquanpin );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(425,390,300,20,json.referencenumber);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,40,40,20,json.zzg||json.mdg );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,90,150,20, json.hbh&&json.hbh.substr(0,2));
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,250,30,20,json.to1);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,280,30,20,json.by1);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,310,30,20,json.to2 );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,350,30,20,json.by2);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,384,40,20,json.currency);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,450,40,20,json.wtpaymode);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,490,40,20,json.otherpaymode);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,530,100,20,json.declarecarriage );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(455,640,100,20,json.declarecustom );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(485,40,140,20,this.mdgquanpin );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            lodop.ADD_PRINT_TEXT(485,220,60,20,json.hbh );
            lodop.SET_PRINT_STYLEA(0, "Bold", 1); lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);
           lodop.ADD_PRINT_TEXT(485,300,70,20,this.airdate(json.hbrq ));
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(485,390,70,20,json.insuranceamount );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(520,40,680,45,json.handlinginfo);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
           //制单信息
            lodop.ADD_PRINT_TEXT(610,40,40,20,this.mawbinfo.zdpiece );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,80,60,20,this.mawbinfo.zdweight );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,140,30,20,"K");
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            if (json.ratelevel=="M"){
                json.rate="";
            }
            lodop.ADD_PRINT_TEXT(610,160,30,20,json.ratelevel );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,180,60,20,json.prodnumber );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,250,100,20,json.jfweight );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,340,60,20,json.rate );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(610,420,105,30,json.isarranged==1?this.asAed:json.ratetotal );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

      


            lodop.ADD_PRINT_TEXT(660,290,240,130,json.remark);
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            lodop.ADD_PRINT_TEXT(610,550,190,160,json.pm);
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(800,40,40,20,this.mawbinfo.zdpiece);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(800,80,100,20,this.mawbinfo.zdweight );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(800,420,110,20,json.isarranged==1?this.asAed:json.ratetotal );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(800,590,110,20,"VOL:" + this.mawbinfo.zdvolume +" CBM");
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
             //费用汇总
             var pptotal=Number(this.formdata.ratetotal)||''
             var cctotal=Number(this.formdata.ratetotal)||''
             var ppothertotal=Number(this.ppothertotal)||''
             var ccothertotal=Number(this.ppothertotal)||''



             var zfall=this.zfall

          if(this.formdata.wtpaymode=='PP'){
             cctotal=''
          }else{
            pptotal=''
          }

          if(this.formdata.otherpaymode=='PP'){
             ccothertotal=''
          }else{
             ppothertotal=''
          }

             var ppall=Number(pptotal)+Number(ppothertotal)
             var ccall=Number(cctotal)+Number(ccothertotal)


          if(this.orderdom=='分单'){
             ppothertotal=ccothertotal=ppall=ccall=''
          }

            lodop.ADD_PRINT_TEXT(840,40,100,20,json.isarranged==1?this.asAed:(pptotal?pptotal.toFixed(2):''));
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(840,200,100,20,cctotal?cctotal.toFixed(2):'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            lodop.ADD_PRINT_TEXT(870,40,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(870,200,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(900,40,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(900,200,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(935,40,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(935,200,100,20,'');

            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(965,40,100,20,ppothertotal?ppothertotal.toFixed(2):'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(965,200,100,20,ccothertotal?ccothertotal.toFixed(2):'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(1060,40,100,20,ppall?ppall.toFixed(2):'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(1030,200,100,20,ccall?ccall.toFixed(2):'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(840,330,390,70,zfall);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            //制单人
            lodop.ADD_PRINT_TEXT(960,360,340,40,'' );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
           lodop.ADD_PRINT_TEXT(1040,330,100,20,this.airdate(json.adddate ) );
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(1040,480,100,20,this.sfgquanpin);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(1040,590,100,20,makePy(json.addman)[0]);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            if(this.orderdom=='分单'){
                lodop.ADD_PRINT_TEXT(90,20,63,20,json.hawb);
                        lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            }

            lodop.ADD_PRINT_TEXT(90,80,30,20,json.sfg);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            lodop.ADD_PRINT_TEXT(90,120,150,20,json.mawb);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

             lodop.ADD_PRINT_TEXT(90,600,150,20,this.orderdom!='分单'?json.mawb:json.hawb);


            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.ADD_PRINT_TEXT(1100,500,190,20,this.orderdom!='分单'?json.mawb:json.hawb);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            // lodop.ADD_PRINT_BARCODE(20,300,200,35,"Code93",json.mawb);
            //  lodop.ADD_PRINT_TEXT(20,300,200,35,'');
            // lodop.SET_PRINT_STYLEA(0,"ShowBarText",0);



            lodop.ADD_PRINT_TEXT(127,497,247,66,this.orderdom!='分单'?this.airinfo:this.formdata.loginfo);
            lodop.SET_PRINT_STYLEA(0,"Bold",1);
            lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);
            lodop.SET_PRINT_STYLEA(0,"LineSpacing",-7);

            lodop.ADD_PRINT_TEXT(1067,620,100,20,'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

            lodop.ADD_PRINT_TEXT(637,40,100,20,json.area!=this.conditionalAreaForBuild&&json.smallpiece&&json.smallpiece!='0'?json.smallpiece:'');
            lodop.SET_PRINT_STYLEA(0,"Bold",1);lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);


            lodop.ADD_PRINT_TEXT(660, 40, 240, 130, TzrCompanyTitle || '');
            lodop.SET_PRINT_STYLEA(0, "LineSpacing", -7);
            lodop.SET_PRINT_STYLEA(0, "Bold", 1);
            lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


if(this.orderdom=='分单'){
                  lodop.ADD_PRINT_SETUP_BKIMG("<img border='0' width='794' height='1123' src='./boStatic/images/hawb_wc.jpg'>");

}else{
                  lodop.ADD_PRINT_SETUP_BKIMG("<img border='0' width='794' height='1123' src='./boStatic/images/mawb_wc.jpg'>");

}
                // lodop.SET_SHOW_MODE("BKIMG_WIDTH","283mm");
                // // lodop.SET_PRINT_PAGESIZE(3,1385,45,"");
                // lodop.SET_PRINT_PAGESIZE('intPageWidth',"800px")
                // lodop.SET_PRINT_PAGESIZE('intPageHeight',"1124px")

                lodop.SET_PRINT_PAGESIZE(1,"210mm","297mm");
                lodop.SET_SHOW_MODE("BKIMG_PRINT",true);

              type==2?lodop.PRINT_SETUP():lodop.PREVIEW();
      //  var TaskID1,TaskID2
      //  lodop.On_Return_Remain=true;
      //  lodop.On_Return=function(TaskID,Value){
      //      if (TaskID== TaskID1) {
      //             alert("判断是否打印成功的结果是："+ Value)
      //      } else if (TaskID== TaskID2) {
      //             alert("判断打印任务是否还存在的结果是："+ Value)
      //      };
      //  };
      //  TaskID1=lodop.GET_VALUE("PRINT_STATUS_OK",0);
      //  TaskID2=lodop.GET_VALUE("PRINT_STATUS_EXIST",0);



           this.$axios({method:'get',url:this.$store.state.webApi+"api/CreateDoc",params:{sid:this.formdata.guid,type:this.orderdom=='分单'?2:1},loading:false,tip:false}).then(results=>{
               if(results.data.resultstatus==0){
               //  layer.msg('操作成功！')
               }
           })

            this.saveBillInfo()
                // lodop.PREVIEW()
               }
               ,getAreaPrice(){
                    var mawb=this.formdata.mawb
                    var sfg=this.formdata.sfg
                    var mdg=this.formdata.mdg
                    var hbrq=this.formdata.hbrq

                     if(!mawb||!sfg||!mdg||!hbrq||this.formdata.wagelist.length>0){
                        return
                      }
                      let json={area:this.formdata.area,mawbthreecode:this.formdata.mawb.substr(0,3),sfg:this.formdata.sfg,mawbmdg:this.formdata.mdg,hbrq:this.formdata.hbrq}
                      this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubAirCompanyAreaPrice",params:json,loading:false,tip:false}).then(results=>{
                       // console.log('费用信息')
                        //console.log(JSON.stringify(results.data))
                       if(this.formdata.wagelist.length==0&&this.orderdom!='分单'){                
                              let arr=[];
                              results.data.forEach(i=>{                             
                                    i.guid=-1;
                                    i.sid=this.formdata.guid
                                    //  if(this.mawbinfo.area==this.conditionalAreaForBuild&&this.mawbinfo.mawb&&this.mawbinfo.mawb.substr(0,3)=='933'&&i.items=='航司分单信息费'){
                                    //       if(i.mawbmdg=="NRT"){
                                    //           i.hidden=true
                                    //       }else{
                                    //           i.itemsename="CG"
                                    //       }
                                    //     }                                     
                                        if(i.iszd==1&&!i.hidden){
                                          arr.push(i);
                                        }                                
                              })
                              this.formdata.wagelist=arr                         
                            }
                         this.wagelistOriginalData=results.data
                      })
               },
               getRate(){

                 var mawb=this.formdata.mawb
                 var sfg=this.formdata.sfg
                 var mdg=this.formdata.mdg
                 var jfweight=Number(this.formdata.jfweight)||0
                 if(mawb&&sfg&&mdg&&jfweight&&(!this.formdata.ratelevel||!this.formdata.rate)){
                         let json={area:this.formdata.area,mawb:mawb,sfg:sfg,mdg:mdg,jfweight:jfweight}
                      this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubIataPrice",params:json,loading:false,tip:false}).then(results=>{
                      //  //console.log('费率信息')
                     //   //console.log(results.data)
                        this.$nextTick(()=>{
                          if(results.data){
                                this.formdata.ratelevel=this.formdata.ratelevel||results.data.ratelevel
                                this.formdata.rate=this.formdata.rate||results.data.rate
                                this.formdata.ratetotal=(this.formdata.rate*(this.formdata.ratelevel=='M'?1:jfweight)).toFixed(2)
                          }

                        })

                      })
                 }

               },
               getHbinfo(){
                //  alert(this.formdata.sfg)
                //  alert(this.formdata.mdg)
                 if(!localStorage.getItem('hbinfo')){
                    this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubAirPortArea",params:{},loading:false,tip:false}).then(results=>{
                        //console.log('目的港全拼')
                        //console.log(results.data)
                        results.data.forEach(i=>{
                            // if(i.ThreeCode==this.formdata.mdg){
                            //   this.mdgquanpin=i.Ready01
                            //   this.sfgquanpin=i.Ready01
                           // }
                              if(i.ThreeCode==this.formdata.sfg){
                                this.sfgquanpin=i.Ready01
                              }
                              if(i.ThreeCode==this.formdata.mdg){
                                this.mdgquanpin=i.Ready01
                              }
                        })
                        localStorage.setItem('hbinfo',JSON.stringify(results.data))
                      })
                 }else{
                   var hbinfo=JSON.parse(localStorage.getItem('hbinfo'))
                   hbinfo.forEach(i=>{
                      if(i.ThreeCode==this.formdata.sfg){
                         this.sfgquanpin=i.Ready01
                      }
                      if(i.ThreeCode==this.formdata.mdg){
                         this.mdgquanpin=i.Ready01
                      }

                   })
                 }


               }
           ,
   airdate(value){
            if(value){
                    var arr = (new Date(value.replace(/-/g,'/'))+'').split(' ')
                    return arr[2] + arr[1].toUpperCase() + arr[3].substr(2, 2)

            }

            }
             ,setWageall(price,itemstype){
                  var num=0
                   switch(itemstype){
                    case'箱':
                    num=this.formdata.realpiece||0
                    break;
                    case'票':
                    num='1'
                    break;
                    case'计重':
                   // num=computedWeight(this.formdata.zdvolume,this.formdata.zdweight)
                    num=this.formdata.jfweight
                    break;
                    case'结算重量':
                    num=this.formdata.accountweightout
                    break;
                    case'毛重':
                    num=this.formdata.zdweight
                    break;
                  }

                return  (Number(num)*Number(price)).toFixed(2)||0

                }

          }
       ,created(){
            this.initForm()
            this.getBillInfo() //制单信息
           // this.getHbinfo()
            this.getAirinfo()
         //   this.getAreaPrice() //费用信息


/*         this.$watch(
                 function () {
                  //  console.log(11111111111)
                  //  console.log(this.formdata.ybpiece,this.formdata.ybweight,this.formdata.ybvolume,
                  //        this.formdata.realpiece,this.formdata.realweight,this.formdata.realvolume,
                  //        this.formdata.zdpiece,this.formdata.zdweight,this.formdata.zdvolume)
                   if(this.pagetype==1){
                         return this.formdata.ybpiece+this.formdata.ybweight+this.formdata.ybvolume+
                         this.formdata.realpiece+this.formdata.realweight+this.formdata.realvolume+
                         this.formdata.zdpiece+this.formdata.zdweight+this.formdata.zdvolume
                   }else{
                      return   this.formdata.piece +  this.formdata.weight + this.formdata.volume
                   }

                },
              function (newval,oldval) {


                    this.setTableData()

                 },{deep:true}
               )
 */
        this.$watch(
      function() {
        return this.formdata.wtpaymode
      },
      function(val) {
         if(val=='PP'&&this.formdata.accountinfo =='FREIGHT COLLECT'){
           this.formdata.accountinfo='FREIGHT PREPAID'
         }
          if(val=='CC'&&this.formdata.accountinfo =='FREIGHT PREPAID'){
           this.formdata.accountinfo='FREIGHT COLLECT'
         }
      },{immediate:true}
    );
       },
       computed: {
          ajaxUrl(){
            return this.orderdom=="总单"||this.orderdom=="直单"?"api/ExHpoAxplineMawbDocAmsSend":"api/ExAxplineHawbDocAmsSend"
          },
            agentcity(){
              return this.projectIsWecan?"WFF/SHA":"HFL/SHA"
              },
            limitLength(){
              //CCSP，EASYCARGO，CCN，TANG，-1
// alert(this.formdata.isexportform)
         /*    let threecode=(this.formdata.mawb||this.formdata.hawb||'999').substr(0,3)
            if(threecode=='112'){
              return 70
            }
             if(threecode=='999'){
              return 35
            } */

            let isexportform=this.formdata.isexportform
            let area=this.formdata.area
            // console.log(isexportform)
            // console.log(area)
          if(isexportform=='TANG'&&area!='北京'){
            return 70
          }
          if(isexportform=='TANG'&&area=='北京'){
            return 100 //注意TANG在北京时，抬头是100，地址是150，所以里面的抬头判断如果是100，取150
          }
            if(isexportform=='CCSP'){
             if((area=='成都'||area=='西安'||area=='北京')&&this.formdata.orderdom!='分单'){
                   return 70
             }

          }
            return 35
          },
          descriptioncode:{
            get(){
                return this.formdata.descriptioncode?this.formdata.descriptioncode.split(','):[]
            },
            set(val){
              this.formdata.descriptioncode=val.toString()
            }
          },
          isarranged:{
              get(){
                    return this.formdata.isarranged==1
              },set(val){
                this.formdata.isarranged=val?1:2
              }
          },
          descriptioncodeOptions(){
             return JSON.parse(localStorage.groupTypeCode)[147]
          },
           asAed() {
           return this.orderdom == "分单" ? "AS ARRANGED" : "AS AGREED"
          }
       }
       ,watch: {

          "formdata.sfg"(val){
        if(val){

             this.mawbRSinfo[0].jsonArr={type:"1",mdg:this.formdata.sfg,gid:this.formdata.gid,codetype:1}
             this.hawbRSinfo[0].jsonArr={type:"2",mdg:this.formdata.sfg,gid:this.formdata.gid,codetype:1}
        }

      },"formdata.mdg"(val){
        if(val){
            this.mawbRSinfo[1].jsonArr={type:"1",mdg:this.formdata.mdg,gid:this.formdata.gid,codetype:2}
            this.hawbRSinfo[1].jsonArr={type:"2",mdg:this.formdata.mdg,gid:this.formdata.gid,codetype:2}
        }
      },
       "formdata.gid"(val){
         if(val){
            this.mawbRSinfo[0].jsonArr={type:"1",mdg:this.formdata.sfg,gid:this.formdata.gid,codetype:1}
            this.mawbRSinfo[1].jsonArr={type:"1",mdg:this.formdata.mdg,gid:this.formdata.gid,codetype:2}

            this.hawbRSinfo[0].jsonArr={type:"2",mdg:this.formdata.sfg,gid:this.formdata.gid,codetype:1}
            this.hawbRSinfo[1].jsonArr={type:"2",mdg:this.formdata.mdg,gid:this.formdata.gid,codetype:2}
         }

      }
      ,'formdata.wagelist':{
        handler(val){

        if(!val||val.length==0){
          return
        }

           var that=this
                         var zfall=""
                         var ppothertotal=0;
                           val.forEach(function(item,index){
                             if(item.itemsename){
                               var price=Number(that.setWageall(item.price,item.itemstype)).toFixed(2)
                             //  console.log(price)
                                   ppothertotal+=Number(price)
                                if((index+1)%3==0){
                                   zfall+="    "+item.itemsename+":" + price+"\r\n";
                                }else{
                                   zfall+="    "+ item.itemsename+":" + price;
                                }
                             }

                            });
                            this.zfall=zfall
                            this.ppothertotal=ppothertotal
        },immediate:true,deep:true
      },
    'formdata.ratelevel'(val){
           this.formdata.ratetotal=(this.formdata.rate*(this.formdata.ratelevel=='M'?1:this.formdata.jfweight||0)).toFixed(2)
    },
      'formdata.rate'(val){
           this.formdata.ratetotal=(val*(this.formdata.ratelevel=='M'?1:this.formdata.jfweight||0)).toFixed(2)
      },
       'formdata.jfweight'(val){
           this.formdata.ratetotal=(this.formdata.rate*(this.formdata.ratelevel=='M'?1:val||0)).toFixed(2)
           this.tableData[2].jfweight=val
      }




       }
}






</script>

<style lang="less" scoped>
@color:#e8e8e8;
@border:1px solid @color;
.content{
  //  border:@border;
    /deep/ textarea{
      resize: none
    }
    /deep/ .jfweight{
  width:100px;
}
}
.topCon{
  display: flex;
  justify-content: space-between;
}
.row{
  display: flex;
  justify-content: space-between;
  >div{
  flex:1;
  }
  margin-bottom:12px;
  .smallInput{
    flex: 0 0 150px;
  }
  .itemdiv:last-child{
    border-right:none
  }
}
.itemdiv{
  padding:10px 5px;
  border-right:@border;
 /deep/ input{
    padding:0px;
    text-indent: 4px;
  }
  span{
    display:flex;
    flex-direction: column-reverse;
    height:60px;
    width:100%;
  }
}
.rightItem{
  padding:10px 15px;
  border-bottom: @border;
}
.left{
  width:660px;
  border-right:@border;
  border-bottom:@border;
  .leftItem{
      border-bottom: @border;
     .itemTitle{
      margin-bottom:10px;
      color:#333;
     }
     span{
        color:#0F5A8C;
        margin-right:12px;
        cursor: pointer;
     }
     .rowleft{
          padding:10px 15px;;
     }
     .rowright{
        padding:10px 15px;;
       border-left:@border;
       border-bottom: @border;
     }
  }
}
.right{
  flex: 1;
  border-bottom:1px solid  #e8e8e8;
}
.flightdata{
  width:78px;
  cursor: pointer;
 /deep/  input{display:none};
//  /deep/ .el-input__suffix{
//       display: none;
//  }
}

</style>
