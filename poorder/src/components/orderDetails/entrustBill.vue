<template>
  <div id="print1" style="pointer-events:all">
    <!-- 显示的托书 -->
    <div id="printBill" style="padding: 10px;  margin: 0 -10px;" class="custom-required">
      <div class="content">
        <div class="topimage" style="border-bottom:1px solid #e8e8e8;text-align:center;position:relative">
          <img :src="weituoUrl" style="margin:12px;">
          <span style="position:absolute;top:20px;left:765px;font-weight:600">({{ getArea(mawbinfo.area) }})</span>
        </div>
        <div class="topCon">
          <div class="left">


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div class="itemTitle">托运人姓名与地址</div>
                  <div>Shipper's Name and Address</div>
                </div>
                <div class="rowright is-show-input">
                  <!-- <el-input placeholder="托运人查询"></el-input>
                            -->
                  <!-- <recsedField :search="jsonArrShr"  :type="0" :dom="1"  :model="shrModel" @rsdata="rsdata" hideBtn></recsedField> -->
                  <recsedField :search="mawbRSinfo[0].jsonArr" :hawbInfo="mawbRSinfo" :type="0" :dom="1"
                    :model="mawbRSinfo[0].model" @rsdata="fhrdata" hideBtn :area="mawbinfo.area" :show="true"
                    class="input-bill-class"></recsedField>

                </div>

              </div>
            </div>

            <div class="leftItem required-item" style="height:100px;padding:8px;">
              <el-input type="textarea" :rows="3" v-model="formdata.shipper" v-verify="'uppercase'"></el-input>
            </div>


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div class="itemTitle">收货人姓名及地址</div>
                  <div>Consignee's Name and Address</div>
                </div>
                <div class="rowright  is-show-input">

                  <recsedField :search="mawbRSinfo[1].jsonArr" :hawbInfo="mawbRSinfo" :type='1' :dom="1"
                    :model="mawbRSinfo[1].model" @rsdata="shrdata" hideBtn :area="mawbinfo.area" :show="true"
                    class="input-bill-class"></recsedField>

                </div>

              </div>
            </div>


            <div class="leftItem required-item" style="height:100px;padding:8px;">
              <el-input type="textarea" :rows="3" v-model="formdata.consignee" v-verify="'uppercase'"></el-input>
            </div>


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div class="itemTitle">另请通知</div>
                  <div>Also Notify</div>
                </div>
                <div class="rowright  is-show-input" style="position:relative">
                  <el-input placeholder="通知查询" v-verify="'uppercase'" class="tongzhi" style="width: 270px;"></el-input>
                  <i class="el-input__icon el-icon-search"
                    style="position:absolute;top:0px;left:18px;color:#C0C4CC;font-size:14px;"></i>

                </div>

              </div>
            </div>


            <div class="leftItem" style="height:100px;padding:8px;">
              <el-input type="textarea" :rows="3" v-verify="'uppercase'" v-model="formdata.notify" class="no-required">
              </el-input>
            </div>


            <div class="leftItem required-item">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div style="color:#333">始发港 Airport of Departure</div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input style="text-align:center" v-model="formdata.sfg"></el-input>
                  </div>
                </div>
                <div class="rowleft" style="border-left:1px solid #e8e8e8">
                  <div style="color:#333">目的港 Airport of Destination</div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input style="text-align:center" v-model="formdata.mdg"></el-input>

                  </div>
                </div>
              </div>
            </div>

            <div class="leftItem required-item">
              <div class="row">
                <div class="rowleft">
                  <div style="color:#333;" >
                    要求运输路线 REQUESTED ROUTING
                  </div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input v-model="formdata.hbh" style="margin-right:12px;"></el-input>
                  </div>


                </div>

                <div class="rowleft" style="border-left:1px solid #e8e8e8">
                  <div style="color:#333">
                    要求航班日期 REQUESTED FLIGHT DATE
                  </div>

                  <div style="padding-top:5px">
                    <el-date-picker v-model="formdata.hbrq" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%;">
                    </el-date-picker>
                  </div>

                </div>
              </div>
            </div>



            <div class="leftItem">
              <div class="row">
                <div class="winfo" style="white-space: nowrap">
                  <span>{{ `${getPieceStatus}件数` }}</span>
                  <span>NO.OF PIECESRCP</span>
                </div>
                <div class="winfo" style="white-space: nowrap">
                  <span>{{ `${getPieceStatus}毛重(KG)` }}</span>
                  <span>GROSS WEIGHT</span>
                </div>
                <div class="winfo" style="white-space: nowrap">
                  <span>{{ `${getPieceStatus}体积（CBM）` }}</span>
                  <span>VOL</span>
                </div>
                <div class="winfo" style="white-space: nowrap">
                  <span>运价类别</span>
                  <span>RATE CLASS</span>
                </div>
              </div>
            </div>

            <div class="leftItem required-item">
              <div class="row">
                <div class="winfo">
                  <el-input class="emphasize" v-model="formdata.piece" v-verify="'integer'" ></el-input>
                </div>
                <div class="winfo">
                  <el-input class="emphasize" v-model="formdata.weight"
                  v-verify="'fixedTwo'"
                  ></el-input>
                </div>
                <div class="winfo">
                  <el-input class="emphasize" v-model="formdata.volume"
                  v-verify="'fixedThree'"
                  ></el-input>
                </div>
                <div class="winfo no-required">
                  <el-input class="emphasize" v-model="formdata.rateclass" v-verify="'uppercase'"></el-input>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="winfo">
                  <span>航空货运费用</span>
                  <span>AIR FREIGHT CHARGES</span>
                </div>
                <div class="winfo">
                  <span>始发地其他费用</span>
                  <span>OTHER CHARGES AT ORIGIN</span>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="hinfo">
                  <span>预付</span>
                  <span>PREPAID</span>
                </div>
                <div class="hinfo">
                  <span>到付</span>
                  <span>COLLECT</span>
                </div>
                <div class="hinfo">
                  <span>预付</span>
                  <span>PREPAID</span>
                </div>
                <div class="hinfo">
                  <span>到付</span>
                  <span>COLLECT</span>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <!-- <div class="hinfo"><el-input :value="mawbinfo.paymode=='PP'?formdata.ratetotal:''"></el-input></div>
                  <div class="hinfo"><el-input :value="mawbinfo.paymode=='CC'?formdata.ratetotal:''"></el-input></div>
                  <div class="hinfo"><el-input :value="mawbinfo.paymode=='PP'?formdata.othertotal:''"></el-input></div>
                  <div class="hinfo"><el-input :value="mawbinfo.paymode=='CC'?formdata.othertotal:''"></el-input></div> -->
                <!-- 老版本 -->
                <!-- <div class="hinfo"><el-input v-model="formdata.freightpp"></el-input></div>
                  <div class="hinfo"><el-input v-model="formdata.freightcc"></el-input></div>
                  <div class="hinfo"><el-input v-model="formdata.otherchargepp"></el-input></div>
                  <div class="hinfo"><el-input v-model="formdata.otherchargecc"></el-input></div> -->

                <div class="hinfo">
                  <el-radio-group v-model="formdata.freightpp">
                    <el-radio :label="1">有</el-radio>
                    <!-- <el-radio :label="2">无</el-radio> -->
                  </el-radio-group>
                </div>

                <div class="hinfo">
                  <el-radio-group v-model="formdata.freightcc">
                    <el-radio :label="1">有</el-radio>
                    <!-- <el-radio :label="2">无</el-radio> -->
                  </el-radio-group>
                </div>

                <div class="hinfo">
                  <el-radio-group v-model="formdata.otherchargepp">
                    <el-radio :label="1">有</el-radio>
                    <!-- <el-radio :label="2">无</el-radio> -->
                  </el-radio-group>
                </div>


                <div class="hinfo">
                  <el-radio-group v-model="formdata.otherchargecc">
                    <el-radio :label="1">有</el-radio>
                    <!-- <el-radio :label="2">无</el-radio> -->
                  </el-radio-group>
                </div>

              </div>
            </div>

            <div class="leftItem otherinfo required-item" style="padding:10px 15px;border-bottom:none">
              <div>
                <span>To</span>
                <span>{{ getGysname(mawbinfo.gysname) }}</span>
              </div>
              <div>
                <span>CNY</span>
                <span>
                  <el-input v-model="formdata.freightfee"></el-input>
                </span>

              </div>
            </div>

          </div>

          <div class="right">

            <div class="rightItem" style="position:relative">
              <!-- <h2 style="text-align:center;margin-top:20px;">唯 凯 国 际 物 流 股 份 有 限 公 司（{{mawbinfo.area}}）</h2>
        <h2 style="text-align:center;margin-top:20px;font-size:18px;font-weight:600">Wecan International Logistics Co.,Ltd.</h2> -->
              <h2 style="text-align:center;margin-top:8px;white-space:nowrap">托运人证实表中所填全部属实并愿意遵守承运人的一切载运章程</h2>
              <p style="margin-top:10px">THE SHIPPER CERTIFIES THAT THE PARTICULARS ON THE FACE HEREOF ARE CORRECT
                AND AGREES TO THE CONDTIONS OF CARRIAGE OF THE CARRIER.</p>
              <!-- <p style="margin-top:70px">SIGNATURE OF SHIPPER</p> -->

              <p style="margin-top:20px">
                <span>处理情况及备注</span>
                <span>HANDLING INFORMATION AND REMARKS</span>
              </p>
              <el-input type="textarea" :rows="2" style="margin:12px 0px" v-model="formdata.remark" class="no-required">
              </el-input>

              <!-- <p style="margin-top:70px">日期</p>
  <p style="display:flex"><span style="margin-top:5px;">DATE：</span>
      <el-date-picker
        v-model="formdata.adddate"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期">
      </el-date-picker></p> -->
              <p style="margin-bottom:10px;margin-top:60px;">托运单位盖章</p>
              <p>PLS CONFIRM AND STAMP</p>
              <p style="margin-bottom:56px">WITH PORWARDER MARK</p>
              <img :src="`./boStatic/images/weituoshu/${mawbinfo.area}.png`"
                style="position:absolute;bottom:25px;width:140px;height:140px;right:150px">
            </div>



            <div class="rightItem" style="padding-top: 8px; padding-bottom: 0px;">
              <div class="row" style="margin-bottom:7px;">
                <div style="flex:0 0 150px;">
                  <div class="itemTitle">客户编号</div>
                  <div class="itemTitle" style="margin-top: 12px;">CUSTOMER NUMBER</div>
                </div>
                <div>
                  <el-input type="textarea" :rows="3" v-model="formdata.customernumber" class="no-required"></el-input>
                </div>
              </div>
            </div>


            <div class="rightItem" style="text-align:center;padding:12px 0px">
              <p style="margin-bottom:13px">货物品名及数量</p>
              <p>NATURE AND QUANTITY OF GOODS</p>
            </div>

            <div class="rightItem required-item" style="padding:6.5px 15px;">
              <el-input type='textarea' :rows="10" v-model="pmQuantity" placeholder="请输入品名及数量(换行隔开)"
                @blur="getpmQuantity"></el-input>
              <!-- <el-input type="textarea" :rows='2' v-model='formdata.pm'></el-input>
    <el-input type="textarea" :rows='7' style="margin-top:6px" v-model="formdata.quantity"></el-input> -->
            </div>

            <div class="rightItem required-item" style="border-bottom: none;">

              <!-- <p>
      <span>处理情况及备注</span>
      <span>HANDLING INFORMATION AND REMARKS</span>
    </p>
    <el-input type="textarea" :rows="2" style="margin:12px 0px" v-model="formdata.remark" class="no-required"></el-input> -->

              <p>
                <span>日期</span>
                <span></span>DATE：</span>
              </p>
              <el-date-picker style="margin: 8px 0; width: 100%;" v-model="formdata.adddate" value-format="yyyy-MM-dd"
                type="date" placeholder="选择日期">
              </el-date-picker>


              <div style="display: flex; justify-content: space-between; margin:8px 0;">
                <div style="width:30%;">
                  <p>经办人：</p>
                  <p style="margin-top: 6px;">
                    <el-input v-model="formdata.addman"></el-input>
                  </p>
                </div>

                <div style="width:30%;">
                  <p>联系电话：</p>
                  <p style="margin-top: 6px;">
                    <!-- <el-input v-model="formdata.phone" @blur="checkValidMobile"></el-input> -->
                    <el-input v-model="formdata.phone"></el-input>
                  </p>
                </div>

                <div style="width:30%;">
                  <p>联系邮箱：</p>
                  <p style="margin-top: 6px;">
                    <el-input v-model="formdata.email" @blur="checkValidEmail"></el-input>
                  </p>
                </div>

              </div>






            </div>


          </div>
        </div>

        <!-- <div class="row" style="margin:10px;">
            <div style="text-align:right">
            <el-button @click="saveReferenceBook(2)" style="pointer-events:auto">保存</el-button>
            <el-button @click="saveImg" style="pointer-events:auto">发送</el-button>
            <el-button @click="printFunc" style="pointer-events:auto">打印</el-button>
            </div>

      </div> -->

        <a :href="emailAddress" style="display: none;" id="billEmial"></a>
      </div>
    </div>

    <!-- 打印的托书 -->
    <div id="printBillBackup" style="width: 1024px; padding: 10px; margin: 0 -10px; position: fixed; top: 10000px; ">
      <div class="content">
        <div class="topimage" style="border-bottom:1px solid #e8e8e8;text-align:center;position:relative">
          <img :src="weituoUrl" style="margin:12px;">
          <span style="position:absolute;top:20px;left:630px;font-weight:600">({{ getArea(mawbinfo.area) }})</span>
        </div>
        <div class="topCon">
          <div class="left">
            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div class="itemTitle">托运人姓名与地址</div>
                  <div>Shipper's Name and Address</div>
                </div>
              </div>
            </div>

            <div class="leftItem " style="height:175px;padding:8px;">
              <div class="textarea-class">{{formdata.shipper}}</div>
            </div>


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div class="itemTitle">收货人姓名及地址</div>
                  <div>Consignee's Name and Address</div>
                </div>
              </div>
            </div>


            <div class="leftItem" style="height:175px;padding:8px;">
             <div class="textarea-class">{{formdata.consignee}}</div>
            </div>


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;" >
                <div class="rowleft" style="padding:15px;">
                  <div class="itemTitle">另请通知</div>
                  <div>Also Notify</div>
                </div>
              </div>
            </div>


            <div class="leftItem" style="height:100px;padding:8px;">
            <div class="textarea-class">{{formdata.notify}}</div>
            </div>


            <div class="leftItem">
              <div class="row" style="margin-bottom:0px;">
                <div class="rowleft">
                  <div style="color:#333">始发港 Airport of Departure</div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input style="text-align:center" v-model="formdata.sfg"></el-input>
                  </div>
                </div>
                <div class="rowleft" style="border-left:1px solid #e8e8e8">
                  <div style="color:#333">目的港 Airport of Destination</div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input style="text-align:center" v-model="formdata.mdg"></el-input>

                  </div>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="rowleft">
                  <div style="color:#333;">
                    要求运输路线 
                    <div style="padding-top: 4px;">REQUESTED ROUTING</div>
                  </div>
                  <div style="text-align:center;padding-top:5px">
                    <el-input v-model="formdata.hbh" style="margin-right:12px;"></el-input>
                  </div>


                </div>
                 <div class="rowleft" style="border-left:1px solid #e8e8e8; white-space: nowrap;">
                  <div style="color:#333">
                    要求航班日期 
                    <div style="padding-top: 4px;">REQUESTED FLIGHT DATE</div>
                  </div>

                  <div style="margin-top:5px; height: initial; padding: 5px;" class="textarea-class">{{this.formdata.hbrq}}</div>

                </div>
                
              </div>

              
              
            </div>



            <div class="leftItem" style="font-size: 12px;">
              <div class="row">
                <div class="winfo" style="padding: 8px;white-space: nowrap">
                  <span>{{ `${getPieceStatus}件数` }}</span>
                  <span>NO.OF PIECESRCP</span>
                </div>
                <div class="winfo">
                  <span>{{ `${getPieceStatus}毛重(KG)` }}</span>
                  <span>GROSS WEIGHT</span>
                </div>
                <div class="winfo">
                  <span>{{ `${getPieceStatus}体积（CBM）` }}</span>
                  <span>VOL</span>
                </div>
                <div class="winfo">
                  <span>运价类别</span>
                  <span>RATE CLASS</span>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row" style="height: 150px">
                <div class="winfo">
                  {{formdata.piece}}
                  <!-- <el-input class="emphasize" v-model="formdata.piece"></el-input> -->
                </div>
                <div class="winfo">
                  {{Number(formdata.weight).toFixed(1)}}
                  <!-- <el-input class="emphasize" v-model="formdata.weight"></el-input> -->
                </div>
                <div class="winfo">
                  {{Number(formdata.volume).toFixed(3)}}
                  <!-- <el-input class="emphasize" v-model="formdata.volume"></el-input> -->
                </div>
                <div class="winfo no-required">
                  {{formdata.rateclass}}
                  <!-- <el-input class="emphasize" v-model="formdata.rateclass" v-verify="'uppercase'"></el-input> -->
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="winfo">
                  <span>航空货运费用</span>
                  <span>AIR FREIGHT CHARGES</span>
                </div>
                <div class="winfo">
                  <span>始发地其他费用</span>
                  <span>OTHER CHARGES AT ORIGIN</span>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="hinfo">
                  <span>预付</span>
                  <span>PREPAID</span>
                </div>
                <div class="hinfo">
                  <span>到付</span>
                  <span>COLLECT</span>
                </div>
                <div class="hinfo">
                  <span>预付</span>
                  <span>PREPAID</span>
                </div>
                <div class="hinfo">
                  <span>到付</span>
                  <span>COLLECT</span>
                </div>
              </div>
            </div>

            <div class="leftItem">
              <div class="row">
                <div class="hinfo" style="justify-content: center">
                  {{this.getCheckData(this.formdata.freightpp)}}
                  <!-- <el-radio-group v-model="formdata.freightpp">
                    <el-radio :label="1">有</el-radio> -->
                    <!-- <el-radio :label="2">无</el-radio> -->
                  <!-- </el-radio-group> -->
                </div>

                <div class="hinfo" style="justify-content: center">
                  {{this.getCheckData(this.formdata.freightcc)}}
                  <!-- <el-radio-group v-model="formdata.freightcc">
                    <el-radio :label="1">有</el-radio> -->
                    <!-- <el-radio :label="2">无</el-radio> -->
                  <!-- </el-radio-group> -->
                </div>

                <div class="hinfo" style="justify-content: center">
                   {{this.getCheckData(this.formdata.otherchargepp)}}
                  <!-- <el-radio-group v-model="formdata.otherchargepp">
                    <el-radio :label="1">有</el-radio> -->
                    <!-- <el-radio :label="2">无</el-radio> -->
                  <!-- </el-radio-group> -->
                </div>
                <div class="hinfo" style="justify-content: center">
                  {{this.getCheckData(this.formdata.otherchargecc)}}
                  <!-- <el-radio-group v-model="formdata.otherchargecc">
                    <el-radio :label="1">有</el-radio> -->
                    <!-- <el-radio :label="2">无</el-radio> -->
                  <!-- </el-radio-group> -->
                </div>

              </div>
            </div>

            <div class="leftItem otherinfo" style="padding:10px 15px;border-bottom:none">
              <div>
                <span>To</span>
                <span>{{ getGysname(mawbinfo.gysname) }}</span>
              </div>
              <div>
                <span>CNY</span>
                <span>
                  <el-input v-model="getFreightfee"></el-input>
                </span>

              </div>
            </div>

          </div>

          <div class="right">

            <div class="rightItem" style="position:relative">
              <!-- <h2 style="text-align:center;margin-top:20px;">唯 凯 国 际 物 流 股 份 有 限 公 司（{{mawbinfo.area}}）</h2>
        <h2 style="text-align:center;margin-top:20px;font-size:18px;font-weight:600">Wecan International Logistics Co.,Ltd.</h2> -->
              <h3 style="text-align:center;margin-top:8px;white-space:nowrap">托运人证实表中所填全部属实并愿意遵守承运人的一切载运章程</h3>
              <p style="margin-top:10px">THE SHIPPER CERTIFIES THAT THE PARTICULARS ON THE FACE HEREOF ARE CORRECT
                AND AGREES TO THE CONDTIONS OF CARRIAGE OF THE CARRIER.</p>
              <!-- <p style="margin-top:70px">SIGNATURE OF SHIPPER</p> -->

              <p style="margin-top:20px">
                <span>处理情况及备注</span>
                <span>HANDLING INFORMATION AND REMARKS</span>
              </p>
              
              <div class="textarea-class" style="height: 134px; margin-top: 6px;">{{formdata.remark}}</div>

              <!-- <p style="margin-top:70px">日期</p>
  <p style="display:flex"><span style="margin-top:5px;">DATE：</span>
      <el-date-picker
        v-model="formdata.adddate"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期">
      </el-date-picker></p> -->
              <p style="margin-bottom:10px;margin-top:110px;">托运单位盖章</p>
              <p>PLS CONFIRM AND STAMP</p>
              <p style="margin-bottom:100px">WITH PORWARDER MARK</p>
              <img :src="`./boStatic/images/weituoshu/${mawbinfo.area}.png`"
                style="position:absolute;bottom:60px;width:140px;height:140px;right:95px">
            </div>

            <div class="rightItem" style="padding-top: 8px; padding-bottom: 1px;">
              <div class="row" style="margin-bottom:7px;">
                <div style="flex:0 0 150px;">
                  <div class="itemTitle">客户编号</div>
                  <div class="itemTitle" style="margin-top: 12px;">CUSTOMER NUMBER</div>
                </div>
                <div>
                   <div class="textarea-class" style="height: 83px;">{{formdata.customernumber}}</div>
                </div>
              </div>
            </div>


            <div class="rightItem" style="text-align:center;padding:12.5px 0px">
              <p style="margin-bottom:12px">货物品名及数量</p>
              <p>NATURE AND QUANTITY OF GOODS</p>
            </div>

            <div class="rightItem" style="padding:7px 15px;">
             <div class="textarea-class" style="height: 408px;">{{pmQuantity}}</div>
             
            </div>

            <div class="rightItem" style="border-bottom: 0px;">
              <p>
                <span>日期</span>
                <span></span>DATE：</span>
              </p>
              <div class="textarea-class" style="margin-top:5px; padding: 5px;">{{this.formdata.adddate}}</div>
              <!-- <el-date-picker style="margin: 8px 0; width: 100%;" v-model="formdata.adddate" value-format="yyyy-MM-dd"
                type="date" placeholder="选择日期">
              </el-date-picker> -->


              <div style="display: flex; justify-content: space-between; margin:8px 0;">
                <div style="width:30%;">
                  <p>经办人：</p>
                  <p style="margin-top: 6px;">
                    <el-input v-model="formdata.addman"></el-input>
                  </p>
                </div>

                <div style="width:30%;">
                  <p>联系电话：</p>
                  <p style="margin-top: 6px;">
                    <el-input v-model="formdata.phone" @blur="checkValidMobile"></el-input>
                  </p>
                </div>

                <div style="width:30%;">
                  <p>联系邮箱：</p>
                  <p style="margin-top: 6px;">
                    <el-input v-model="formdata.email" @blur="checkValidEmail"></el-input>
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
      <!-- 打印的托书end -->

    <div class="row" style="margin:10px;">
      <div style="text-align:right">
        <!-- <el-button @click="saveReferenceBook(2)" style="pointer-events:auto">保存</el-button> -->
        <el-button @click="handleSend" style="pointer-events:auto">发送</el-button>
        <el-button @click="printFunc" style="pointer-events:auto">打印</el-button>
      </div>

    </div>

    <el-dialog title="填写内容" :visible.sync="dialogVisible" width="500px" append-to-body  :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="custom-required">
        <el-form label-position="right" label-width="80px" :model="emailInfo">
          <el-form-item label="收件人" class="required-item">
            <el-input v-model="emailInfo.mailto"></el-input>
          </el-form-item>
          <el-form-item label="主题" class="required-item">
            <el-input v-model="emailInfo.mailsubject" type="textarea" rows="3"></el-input>
          </el-form-item>
          <el-form-item label="抄送">
            <el-input v-model="emailInfo.mailtolist" class="no-required"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>

</div>
</template>

<script>
import recsedField from '../templates/recsedField'
import { getPdf, getMomentDate, computedWeight, formatDate } from '../../api/localStorage.js'
import { getLodop } from '../../api/LodopFuncs.js'
import html2canvas from 'html2canvas';

function printContent(img) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'position:absolute;width: 100%; height: 1200px;left:-100px;top:-100px;');

    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;
    doc.body.appendChild(img);
    // doc.close();
    // iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);

    }, 100)
  
}

export default {
  components: {
    recsedField
  },
  props: {
    orderdom: {
      type: String,
      default: "总单"
    },
    mawbinfo: {
      type: Object,
      default() {
        return {}
      }
    }
    , saveNumberList: Array
  },
  data() {

    return {
      bookImg: '', //保存的托书图片
      pmQuantity: '',
      mawbRSinfo: [
        { "title": "发货人", "companytitle_fhr_mawb": "", "address_fhr_mawb": "", "companycode_fhr_mawb": "", "state_fhr_mawb": "", "city_fhr_mawb": "", "postcode_fhr_mawb": "", "lxr_fhr_mawb": "", "phone_fhr_mawb": "", "fax_fhr_mawb": "", "email_fhr_mawb": "", "zdfhrId": "", jsonArr: { type: '1', mdg: this.mawbinfo.sfg, gid: this.mawbinfo.gid, codetype: 1 }, model: "" },
        { "title": "收货人", "companytitle_shr_mawb": "", "address_shr_mawb": "", "companycode_shr_mawb": "", "state_shr_mawb": "", "city_shr_mawb": "", "postcode_shr_mawb": "", "lxr_shr_mawb": "", "phone_shr_mawb": "", "fax_shr_mawb": "", "email_shr_mawb": "", "zdshrId": "", jsonArr: { type: '1', mdg: this.mawbinfo.mdg, gid: this.mawbinfo.gid, codetype: 2 }, model: "" },
      ],
      formdata: {
        shipper: "",
        consignee: "",
        notify: "",
        sfg: this.mawbinfo.sfg,
        mdg: this.mawbinfo.mdg,
        hbh: this.mawbinfo.hbh,
        hbrq: this.mawbinfo.hbrq,
        piece: this.mawbinfo.ybpiece,
        weight: this.mawbinfo.ybweight,
        volume: this.mawbinfo.ybvolume,
        rateclass: "",
        freightpp: '',
        freightcc: '',
        otherchargepp: '',
        otherchargecc: '',
        customernumber: this.mawbinfo.pono,
        pm: this.mawbinfo.pm,
        quantity: "",
        handleinformation: "",
        freightfee: '',
        rate: '',
        ratetotal: '',
        othertotal: '',
        adddate: formatDate(new Date(), 'yyyy-MM-dd'),
        addman: localStorage.usrname,
        remark: '',
        phone: localStorage.userPhone,
        email: localStorage.userEmail,
      },
      weituoUrl: "./boStatic/images/weituoshu/weituo.png",
      emailAddress: '', // 发送地址及参数
      isInvalidMobile: false,
      isInvalidEmail: false,

      dialogVisible: false, // 邮箱弹窗显示

      emailInfo: {}, // 邮箱发送信息

      pieceStatus: false, // 件重体 false => 预报 true => 实际

      quantityStatus: false, // 尺寸 false => 预报 true => 实际




    }
  }
  ,
  methods: {
    /**
     * @desc 处理发送
     */
    handleSend() {
      if (this.checkData()) {
        return
      } else {
        this.dialogVisible = true
      }
    },

    /**
     * @desc 校验数据
     */
    checkData() {
      if (! this.formdata.shipper) {
        this.$message.error('请填写托运人姓名与地址')
        return true;
      }

      if (! this.formdata.consignee) {
        this.$message.error('请填写收货人姓名及地址')
        return true;
      }

       if (! this.formdata.sfg) {
        this.$message.error('请填写始发港')
        return true;
      }

       if (! this.formdata.mdg) {
        this.$message.error('请填写目的港')
        return true;
      }

       if (! this.formdata.hbh) {
        this.$message.error('请填写运输路线')
        return true;
      }

      if (! this.formdata.hbrq) {
        this.$message.error('请填写航班日期')
        return true;
      }

      if (! this.formdata.freightpp && ! this.formdata.freightcc) {
         this.$message.error('请选择航空货运费用')
        return true;
      }

       if (! this.formdata.otherchargepp && ! this.formdata.otherchargecc) {
         this.$message.error('始发地其他费用')
        return true;
      }

      if (! this.formdata.piece) {
        this.$message.error('请填写件数')
        return true;
      }

      if (! this.formdata.weight) {
        this.$message.error('请填写毛重')
        return true;
      }

      if (! this.formdata.volume) {
        this.$message.error('请填写体积')
        return true;
      }

      

       if (! this.formdata.freightfee) {
        this.$message.error('请填写CNY')
        return true;
      }

       if (! this.pmQuantity) {
        this.$message.error('请填写货物品名及数量')
        return true;
      }

      if (! this.formdata.adddate) {
        this.$message.error('请填写日期')
        return true;
      }

      if (! this.formdata.addman) {
        this.$message.error('请填写经办人')
        return true;
      }

      if (! this.formdata.phone) {
        this.$message.error('请填写电话')
        return true;
      }

      if (! this.formdata.email) {
        this.$message.error('请填写邮箱')
        return true;
      } else {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reg.test(this.formdata.email)) {
          this.invalidMessage('邮箱')
          return true;
        }
      }
      return false
    },


    handleConfirm() {
      if (!this.emailInfo.mailto) {
        this.$message.error('请填写收件人');
        return;
      }

      if (!this.emailInfo.mailsubject) {
        this.$messasge.error('请填写主题');
        return
      }
      this.$store.state.showloading = true;
      this.$nextTick(() => {
        this.saveImg();
      })
    },

    // 校验手机号
    checkValidMobile() {
      // let reg = /^0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}$/;
      this.isInvalidMobile = !reg.test(this.formdata.mobile)
      if (this.isInvalidMobile) {
        this.invalidMessage('电话')
      }
    },

    // 校验邮箱
    checkValidEmail() {
      let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.isInvalidEmail = !reg.test(this.formdata.email)
      if (this.isInvalidEmail) {
        this.invalidMessage('邮箱')
      }
    },

    invalidMessage(field) {
      this.$message.error(`输入的${field}无效，请输入有效${field}`)
    },

    getGysname(data) {
      if (data) {
        if (data.indexOf('-') != -1) {
          let [basic, name] = data.split('-');
          return name;
        } else {
          return ''
        }
      } else {
        return '';
      }
    },

    // 获取委托站点三字代码
    getArea(data) {
      let areadata = JSON.parse(localStorage.groupType).filter(i => i.groupid == '101')

      for (let i = 0; i < areadata.length; i++) {
        let item = areadata[i]
        let [area, threeCode] = item.typename.split("丨");
        if (area == data) {
          return threeCode
        }
      }

    },

    getpmQuantity(val) {
      if (val.target) {
        let data = val.target.value.split('\n');
        if (data[0]) {
          this.formdata.pm = data[0];
        }

        if (data[1]) {
          this.formdata.quantity = data[1];
        }
      }
    },

    setFreightCha() {
      /*                 if(this.mawbinfo.paymode=='PP'){
                       this.formdata.freightpp=this.formdata.ratetotal
                       this.formdata.freightcc=''
                       this.formdata.otherchargepp=this.formdata.othertotal
                       this.formdata.otherchargecc=''
           }else{
                       this.formdata.freightpp=''
                       this.formdata.freightcc=this.formdata.ratetotal
                       this.formdata.otherchargepp=''
                       this.formdata.otherchargecc=this.formdata.othertotal
           } */

    },

    /**
     * @method
     * @desc 保存图片
     */
    saveImg() {
      const self = this;
      function convertCanvasToImage(canvas) {
        var image = new Image();
        let src = canvas.toDataURL("image/png")
        image.src = src;
        // document.body.appendChild(image);
        // return  image;
        return src
      }
      // document.querySelectorAll('.is-show-input').forEach(item => item.style.display = 'none')

      html2canvas(document.querySelector("#printBillBackup")).then(function (canvas) {
        // document.querySelectorAll('.is-show-input').forEach(item => item.style.display = 'block')
        //  document.body.appendChild(canvas);
        self.bookImg = convertCanvasToImage(canvas);
        self.saveReferenceBook(2)
      });
    },

    saveReferenceBook(type) {
      // let loading = type ? true : false;
      let loading= true;
      let { fid, gid, aircompany, area } = this.mawbinfo;
      var json = { json: JSON.parse(JSON.stringify(this.formdata)), area: this.mawbinfo.area }
      var method = type == 1 ? 'post' : 'put'
      json.hpoguid = this.mawbinfo.guid
      json.json.adddate = this.formdata.adddate || '1900-01-01';
      json.json.area = area;
      json.json.fid = fid;
      json.json.gid = gid;
      json.json.aircompany = aircompany;
      if (json.json.hbrq.indexOf('NaN') != -1) {
        json.json.hbrq = ''
      }
      const self = this;
      if (type == 2) {
        this.emailInfo.mailsender = localStorage.usrname;
        this.emailInfo.maildate = new Date().Format("yyyy-MM-dd hh:mm:ss");
        json.json.sid = this.mawbinfo.guid
        json.json.imgbase64 = this.bookImg;
        json.json.mailjson = JSON.stringify(this.emailInfo);
      }
      this.$axios({ method: method, url: this.$store.state.webApi + "api/ExHpoAxplineBooking", data: json, loading, tip: false }).then(results => {
        console.log(results.data)
        console.log(JSON.stringify(results.data))
        if (results.data.resultstatus == 0) {
          if (type == 1) {
            this.formdata = results.data.resultdic.booking;
            this.formdata.adddate = formatDate(this.formdata.adddate, 'yyyy-MM-dd')
            this.formdata.hbrq = formatDate(this.formdata.hbrq, 'yyyy-MM-dd')
            // if (self.mawbinfo.ybvolumeremark) {
            //   this.formdata.quantity = self.mawbinfo.ybvolumeremark;
            // }
            //  this.formdata.quantity = self.mawbinfo.ybvolumeremark;


            // if ( self.mawbinfo.hbrq ) {
            //  this.formdata.hbrq = self.mawbinfo.hbrq;
            // }
            // this.formdata.hbrq = self.mawbinfo.hbrq;

            // if (self.mawbinfo.englishpm) {
            //    this.formdata.pm = self.mawbinfo.englishpm;
            // }
            this.formdata.pm = self.mawbinfo.englishpm;

            // 客户编号显示为空
            // if ( self.mawbinfo.ybstoreList &&  self.mawbinfo.ybstoreList.length) {
            //   self.mawbinfo.ybstoreList.pop()
            //   this.formdata.customernumber =  self.mawbinfo.ybstoreList.map(item => item.khjcno).join()
            // }


            // 客户编号 => 订仓编号
            if ( this.mawbinfo.pono ) {
              this.formdata.customernumber = this.mawbinfo.pono;
            }

            // if (!this.formdata.shipper) {


            if (this.formdata.sfg) {
              this.formdata.shipper = `WFF-${this.formdata.sfg}`
            } else {
              this.formdata.shipper = `WFF`
            }
            // }

            // if ( !this.formdata.consignee) {
            if (this.formdata.mdg) {
              this.formdata.consignee = `WFF-${this.formdata.mdg}`
            } else {
              this.formdata.consignee = `WFF`;
            }
            // }

            // 航空货运费用 => 预付 && 到付都没有 => 默认预付
            if (self.formdata.freightpp != '1' && self.formdata.freightcc != '1') {
              this.formdata.freightpp = 1;
            }

            // 始发地其他费用 => 预付 && 到付都没有 => 默认预付
            if (self.formdata.otherchargepp != '1' && self.formdata.otherchargecc != '1') {
              this.formdata.otherchargepp = 1;
            }

            // 如果CNY为零 => 等于''
            if (self.formdata.freightfee == '0') {
              self.formdata.freightfee = ''
            }

            // 如果实际件数不是零 realpiece!=0 取实际件，重，体
            if (self.formdata.realpiece != 0) {
              self.pieceStatus = true;
              self.formdata.piece = self.formdata.realpiece;
              self.formdata.volume = self.formdata.realvolume;
              self.formdata.weight = self.formdata.realweight;
            } else {
              self.pieceStatus = false;
            }

            // 如果实际尺寸不为空，则取实际尺寸
            if (!!self.formdata.realquantity) {
              self.quantityStatus = true;
              self.formdata.quantity = self.formdata.realquantity;
            } else {
              self.quantityStatus = false;
              this.formdata.quantity = self.mawbinfo.ybvolumeremark;
            }

            this.$set(this.formdata, 'phone', localStorage.userPhone)
            this.$set(this.formdata, 'email', localStorage.userEmail)
            // this.formdata.phone = localStorage.userPhone;

            // this.formdata.email = localStorage.userEmail;

            // 获取邮件信息

            this.emailInfo = JSON.parse(results.data.resultdic.booking.mailjson)


          } else {
            // 发送邮件 => 弹出email
            // 处理邮件地址及参数
            this.$message(results.data.resultmessage)
            if (type == 2) {
              let { mailcontent = '' } = results.data.resultdic || {}
              let { mailto, mailsubject, mailtolist } = this.emailInfo
              this.emailAddress = `mailto:${mailto}?subject=${mailsubject}&body=${mailcontent}&cc=${mailtolist}`;
              this.$nextTick(() => {
                $('#billEmial')[0].click();
              })
            }
          }
        } else {

        }
      })
    },
    setShipper(data) {
      this.formdata.shipper = `${data.companytitle_fhr_mawb}\r\n${data.address_fhr_mawb}\r\n`
      this.formdata.shipper += data.companycode_fhr_mawb ? data.companycode_fhr_mawb + ',' : ''
      this.formdata.shipper += data.state_fhr_mawb ? data.state_fhr_mawb + ',' : ''
      this.formdata.shipper += data.city_fhr_mawb ? data.city_fhr_mawb + ',' : ''
      this.formdata.shipper += data.postcode_fhr_mawb ? data.postcode_fhr_mawb + ',' : ''
      this.formdata.shipper += data.lxr_fhr_mawb ? data.lxr_fhr_mawb + ',' : ''
      this.formdata.shipper += data.phone_fhr_mawb ? 'Tel:' + data.phone_fhr_mawb + ',' : ''
      this.formdata.shipper += data.fax_fhr_mawb ? 'Fax:' + data.fax_fhr_mawb + ',' : ''
      this.formdata.shipper += data.email_fhr_mawb ? 'Email:' + data.email_fhr_mawb : ''
    },
    setConsignee(data) {
      this.formdata.consignee = `${data.companytitle_shr_mawb}\r\n${data.address_shr_mawb}\r\n`
      this.formdata.consignee += data.companycode_shr_mawb ? data.companycode_shr_mawb + ',' : ''
      this.formdata.consignee += data.state_shr_mawb ? data.state_shr_mawb + ',' : ''
      this.formdata.consignee += data.city_shr_mawb ? data.city_shr_mawb + ',' : ''
      this.formdata.consignee += data.postcode_shr_mawb ? data.postcode_shr_mawb + ',' : ''
      this.formdata.consignee += data.lxr_shr_mawb ? data.lxr_shr_mawb + ',' : ''
      this.formdata.consignee += data.phone_shr_mawb ? 'Tel:' + data.phone_shr_mawb + ',' : ''
      this.formdata.consignee += data.fax_shr_mawb ? 'Fax:' + data.fax_shr_mawb + ',' : ''
      this.formdata.consignee += data.email_shr_mawb ? 'Email:' + data.email_shr_mawb : ''
    },
    fhrdata(data) {
      this.setShipper(data)
    },
    shrdata(data) {
      this.setConsignee(data)
    }

    , setWageall(price, itemstype) {
      var num = 0
      switch (itemstype) {
        case '票':
          num = '1'
          break;
        case '计重':
          num = computedWeight(this.mawbinfo.realvolume, this.mawbinfo.realweight)
          break;
        case '结算重量':
          num = this.mawbinfo.accountweightin
          break;
        case '毛重':
          num = this.mawbinfo.realweight
          break;
        case '箱':
          num = this.mawbinfo.realpiece
          break;
      }

      return (Number(num) * Number(price)).toFixed(2) || 0

    }
    , getRate() {

      var mawb = this.mawbinfo.mawb
      var sfg = this.mawbinfo.sfg
      var mdg = this.mawbinfo.mdg
      //var jfweight=this.mawbinfo.jfweight
      var jfweight = this.mawbinfo.sjComWeight
      if (mawb && sfg && mdg && jfweight) {
        let json = { area: this.mawbinfo.area, mawb: mawb, sfg: sfg, mdg: mdg, jfweight: jfweight }
        this.$axios({ method: 'get', url: this.$store.state.publicWebApi + "api/PubIataPrice", params: json, loading: false, tip: false }).then(results => {
          //console.log('费率信息')
          //console.log(results.data)

          this.$nextTick(() => {
            if (results.data) {
              this.formdata.rateclass = results.data.ratelevel
              this.formdata.rate = results.data.rate
              this.formdata.ratetotal = (results.data.rate * this.mawbinfo.jfweight).toFixed(2)
            }
            //    this.setFreightCha()


          })

        })
      }

    },

    getCheckData(type) {
      if (type == '1') {
        return '√';
      } else if (type == '2') {
        return '×';
      } else {
        return ''
      }
    },

    getAreaPrice() {
      var mawb = this.mawbinfo.mawb
      var sfg = this.mawbinfo.sfg
      var mdg = this.mawbinfo.mdg
      var hbrq = this.mawbinfo.hbrq

      if (!mawb || !sfg || !mdg || !hbrq) {
        return
      }
      var that = this;
      let json = { area: this.mawbinfo.area, mawbthreecode: this.mawbinfo.mawb.substr(0, 3), sfg: this.mawbinfo.sfg, mawbmdg: this.mawbinfo.mdg, hbrq: this.mawbinfo.hbrq }
      this.$axios({ method: 'get', url: this.$store.state.publicWebApi + "api/PubAirCompanyAreaPrice", params: json, loading: false, tip: false }).then(results => {
        console.log('费用信息')
        console.log(results.data)
        var othertotal = 0;
        results.data.forEach(function (item, index) {
          if (item.itemsename && item.iszd == 1) {
            var price = Number(that.setWageall(item.price, item.itemstype)).toFixed(2)
            othertotal += Number(price)
          }
        });
        this.formdata.othertotal = Number(othertotal).toFixed(2)
        //   this.setFreightCha()

      })
    },
    printFunc() {
      if (this.checkData()) {
        return;
      }
      this.$store.state.showloading = true;
      this.saveReferenceBook()

       const self = this;
      function convertCanvasToImage(canvas) {
        var image = new Image();
        let src = canvas.toDataURL("image/png")
        image.width='1040';
        image.src = src;
        return image
      }

      html2canvas(document.querySelector("#printBillBackup")).then(function (canvas) {
   
        let img = convertCanvasToImage(canvas);

        printContent(img)
      });

      return;


      var lodop = getLodop();
      lodop.PRINT_INITA('0', '0', '794', '1123', "ZXYD")

      var json = this.formdata
      lodop.ADD_PRINT_TEXT(178, 30, 330, 95, json.shipper);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(340, 30, 330, 95, json.consignee);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(478, 30, 330, 70, json.notify);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      // lodop.ADD_PRINT_TEXT(505,416,280,26,'json.adddate' );
      // lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

      lodop.ADD_PRINT_TEXT(505, 416, 120, 26, json.adddate || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(608, 525, 196, 26, json.customernumber);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(719, 374, 347, 60, json.pm);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(970, 374, 347, 25, json.remark);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(1020, 374, 347, 25, json.addman);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(780, 374, 347, 138, json.quantity || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(576, 90, 50, 22, json.sfg);
      // lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(579, 258, 50, 22, json.mdg);
      // lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(621, 30, 330, 35, json.hbh + '/' + formatDate(json.hbrq, 'yyyy-MM-dd'));
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(714, 30, 72, 102, json.piece);
      //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(714, 118, 72, 102, json.weight);
      //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(714, 200, 72, 102, json.volume);
      // lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(714, 287, 72, 102, json.rateclass);
      //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);


      lodop.ADD_PRINT_TEXT(905, 30, 77, 20, this.getCheckData(json.freightpp) || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(905, 118, 77, 20, this.getCheckData(json.freightcc) || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(905, 200, 77, 20, this.getCheckData(json.otherchargepp) || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(905, 287, 77, 20, this.getCheckData(json.otherchargecc) || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(970, 94, 240, 24, json.pono);
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(940, 94, 240, 24, this.getGysname(this.mawbinfo.gysname) || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(998, 94, 240, 24, json.freightfee || '');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_TEXT(188, 639, 64, 18, '(' + this.mawbinfo.area + ')');
      lodop.SET_PRINT_STYLEA(0, "ReadOnly", 0);

      lodop.ADD_PRINT_HTM(450, 570, 150, 150, `<img border='0' width='150' height='150' src='./boStatic/images/weituoshu/${this.mawbinfo.area}.png'>`)

      lodop.ADD_PRINT_SETUP_BKIMG("<img border='0' width='794' height='1123' src='./boStatic/images/weituoshu/weituo.jpg'>")
      lodop.SET_PRINT_PAGESIZE(1, "210mm", "297mm");
      lodop.SET_SHOW_MODE("BKIMG_PRINT", true);

      lodop.PRINT_SETUP()


      //  window.print()
    }
  },
  created() {
    this.setShipper(this.mawbinfo)
    this.setConsignee(this.mawbinfo)
    // this.formdata=Object.assign({},this.formdata,this.mawbinfo)
    this.formdata.hbrq = formatDate(this.formdata.hbrq, 'yyyy-MM-dd')
    this.$watch(
      function () {
        return this.mawbinfo.mawb + this.mawbinfo.sfg + this.mawbinfo.mdg + this.mawbinfo.hbrq + this.mawbinfo.jfweight
      },
      function (newval, oldval) {
        this.getAreaPrice() //费用信息
        this.getRate()  //费率
      }, { immediate: true }
    )

    // 监听品名，数量
    this.$watch(
      function () {
        return this.formdata.pm + this.formdata.quantity
      },
      function (newVal, oldVal) {
        let data = ''
        if (this.formdata.pm) {
          data = this.formdata.pm;
        }

        if (this.formdata.quantity) {
          data = data + '\n' + this.formdata.quantity
        }
        this.pmQuantity = data;
      }
    )

    //  this.$watch(
    //    function () {
    //      return this.pmQuantity;
    //    },
    //    function (newVal, oldVal) {
    //      if (newVal &&  newVal != oldVal) {
    //        let data = newVal.split('/n');
    //        if (data[0]) {
    //           this.formdata.pm = data[0];
    //        }

    //        if (data[1]){
    //           this.formdata.quantity = data[1];
    //        }
    //      }
    //    }
    //  )
    setTimeout(() => {
      this.saveReferenceBook(1)
    }, 600);
    //  this.$watch(
    //    function () {
    //         return this.formdata.ratetotal+this.formdata.othertotal
    //    },function (newval) {
    //        this.getTotal=(Number(this.formdata.ratetotal)+Number(this.formdata.othertotal)).toFixed(2)
    //    }
    //  )
  }
  , computed: {
    // 获取件重体是否预报
    getPieceStatus() {
      return this.pieceStatus ? '实际' : '预报';
    },

    // 获取件重体是否预报
    getQuantityStatus() {
      return this.quantityStatus ? '实际' : '预报';
    },

    // 获取CNY=>如果是数字保留两位
    getFreightfee() {
      if ( this.formdata.freightfee ) {
        if ( !isNaN(this.formdata.freightfee) && typeof Number(this.formdata.freightfee)==='number') {
          return Number(this.formdata.freightfee).toFixed(2)
        } else {
          return this.formdata.freightfee
        }
      }

      return ''
    }

  }
  , watch: {
    "mawbinfo.sfg"(val) {
      if (val) {
        this.mawbRSinfo[0].jsonArr = { type: "1", mdg: this.mawbinfo.sfg, gid: this.mawbinfo.gid, codetype: 1 }
      }

    }, "mawbinfo.mdg"(val) {
      if (val) {
        this.mawbRSinfo[1].jsonArr = { type: "1", mdg: this.mawbinfo.mdg, gid: this.mawbinfo.gid, codetype: 2 }
      }
    },
    "mawbinfo.gid"(val) {
      if (val) {
        this.mawbRSinfo[0].jsonArr = { type: "1", mdg: this.mawbinfo.sfg, gid: this.mawbinfo.gid, codetype: 1 }
        this.mawbRSinfo[1].jsonArr = { type: "1", mdg: this.mawbinfo.mdg, gid: this.mawbinfo.gid, codetype: 2 }
      }

    },
    'mawbinfo.paymode'(val) {
      //  this.setFreightCha()
    },

    // 预付 到付 反正就是 1 2 1 2 你前端得处理成勾选  而且 一组里只有一个1
    'formdata.freightpp': {
      handler(val) {
        if (val == '1') {
          this.$set(this.formdata, 'freightcc', '')
        }

        if (val == '2') {
          this.$set(this.formdata, 'freightcc', '')
        }
      }

    },

    'formdata.freightcc': {
      handler(val) {
        if (val == '1') {
          this.$set(this.formdata, 'freightpp', '')
        }

        if (val == '2') {
          this.$set(this.formdata, 'freightpp', '')
        }
      }

    },

    'formdata.otherchargepp': {
      handler(val) {
        if (val == '1') {
          this.$set(this.formdata, 'otherchargecc', '')
        }

        if (val == '2') {
          this.$set(this.formdata, 'otherchargecc', '')
        }
      }
    },

    'formdata.otherchargecc': {
      handler(val) {
        if (val == '1') {
          this.$set(this.formdata, 'otherchargepp', '')
        }

        if (val == '2') {
          this.$set(this.formdata, 'otherchargepp', '')
        }
      }

    },



    saveNumberList: {
      handler(val) {
        var longsall = 0
        var widthsall = 0
        var heightsall = 0
        if (val) {
          this.saveNumberList.forEach(item => {
            item.storevolumeList.forEach(k => {
              longsall += k.longs
              widthsall += k.widths
              heightsall += k.heights
            })
          })
        }

        this.formdata.quantity = longsall + '*' + widthsall + '*' + heightsall + '*' + this.mawbinfo.realpiece
      }, immediate: true, deep: true
    }


  }
}






</script>

<style lang="less" scoped>
@color: #e8e8e8;
@border: 1px solid @color;

.content {
  border: @border;

  /deep/ textarea {
    resize: none
  }

  /deep/ .jfweight {
    width: 100px;
  }

  color:#333;
}

.topimage {
  height: auto;
}

.topCon {
  display: flex;
  justify-content: space-between;
}

.row {
  display: flex;
  justify-content: space-between;

  >div {
    flex: 1;
  }

  .winfo:last-child {
    border-right: 0px;
  }

  .hinfo:last-child {
    border-right: 0px;
  }

  .smallInput {
    flex: 0 0 150px;
  }

  .itemdiv:last-child {
    border-right: none
  }
}

.emphasize {
  font-weight: 600;
  font-size: 16px;
  color: #333
}

.winfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-right: @border;

  >span {
    margin-top: 8px;
  }
}

.hinfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-right: @border
}

.itemdiv {
  padding: 10px 5px;
  border-right: @border;

  /deep/ input {
    padding: 0px;
    text-indent: 4px;
  }

  span {
    display: flex;
    flex-direction: column-reverse;
    height: 60px;
    width: 100%;
  }
}

.rightItem {
  padding: 10px 15px;
  border-bottom: @border;
}

.otherinfo {
  span {
    display: inline-block;
    font-size: 14px;
    margin: 10px 20px;
    min-width: 60px;
  }
}

.tongzhi {
  /deep/ input {
    text-indent: 20px;
  }
}

.left {
  width: 660px;
  border-right: @border;
  border-bottom: @border;

  .leftItem {
    border-bottom: @border;

    .itemTitle {
      margin-bottom: 10px;
      color: #333;
      font-weight: 600
    }

    .rowleft {
      padding: 10px 15px;
      ;
    }

    .rowright {
      padding: 10px 15px;
      display: flex;
      align-items: center
    }
  }
}

.right {
  flex: 1;
}

.input-bill-class {
  /deep/.el-input__inner {
    // border: none;
  }
}

@media print {
  #print1 {
    background-color: white;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 15px;
    font-size: 14px;
    line-height: 18px;
  }

  #print1 .content {
    width: 210mm;
    height: 297mm;
  }
}
</style>

<style lang="less">
.custom-required {
    .required-item {
      input {
      background: #fff8ef !important;
      font-size: 16px !important;
    }

    textarea {
      background: #fff8ef !important;
      font-size: 16px !important;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
 

  .no-required {
    input {
      font-size: 16px !important;
      background: initial !important;
    }

    textarea {
      font-size: 16px !important;
      background: initial !important;
      word-wrap: break-word;
    }
  }
}

.textarea-class {
  padding: 10px;
  border: 1px solid #C0C4CC;
  border-radius: 4px;
  white-space: pre-line;
  height: 100%;
  overflow: hidden;
}

#print1 {
  font-family: Helvetica, Helvetica;
}
</style>
