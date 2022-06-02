<template>
<div id="print1" style="pointer-events:all">


   <div class="content" id="printBill">
     <!-- {{saveNumberList}} -->
     <!-- {{formdata}} -->
     <div class="topimage" style="border-bottom:1px solid #e8e8e8;text-align:center;position:relative">
         <img :src="weituoUrl" style="margin:12px;">
         <span style="position:absolute;top:20px;left:765px;font-weight:600">({{mawbinfo.area}})</span>
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
        <recsedField :search="mawbRSinfo[0].jsonArr" :hawbInfo="mawbRSinfo" :type="0" :dom="1"  :model="mawbRSinfo[0].model" @rsdata="fhrdata" hideBtn
        :area="mawbinfo.area"
        :show="true"
        class="input-bill-class"
        ></recsedField>

               </div>

             </div>
           </div>

<div class="leftItem" style="height:100px;padding:8px;">
  <el-input type="textarea" :rows="4" v-model="formdata.shipper" v-verify="'uppercase'"></el-input>
</div>


 <div class="leftItem">
             <div class="row" style="margin-bottom:0px;">
               <div class="rowleft">
                          <div class="itemTitle">收货人姓名及地址</div>
                          <div>Consignee's Name and Address</div>
               </div>
              <div class="rowright  is-show-input" >

<recsedField :search="mawbRSinfo[1].jsonArr" :hawbInfo="mawbRSinfo" :type='1' :dom="1" :model="mawbRSinfo[1].model" @rsdata="shrdata" hideBtn
:area="mawbinfo.area"
:show="true"
 class="input-bill-class"
></recsedField>

               </div>

             </div>
           </div>


<div class="leftItem" style="height:100px;padding:8px;">
<el-input type="textarea" :rows="4" v-model="formdata.consignee" v-verify="'uppercase'"></el-input>
</div>


 <div class="leftItem">
             <div class="row" style="margin-bottom:0px;">
               <div class="rowleft">
                          <div class="itemTitle">另请通知</div>
                          <div>Also Notify</div>
               </div>
              <div class="rowright  is-show-input" style="position:relative">
                         <el-input placeholder="通知查询" v-verify="'uppercase'" class="tongzhi"></el-input>
                         <i class="el-input__icon el-icon-search" style="position:absolute;top:0px;left:18px;color:#C0C4CC;font-size:14px"></i>

               </div>

             </div>
           </div>


<div class="leftItem" style="height:100px;padding:8px;">
<el-input type="textarea" :rows="4" v-verify="'uppercase'"  v-model="formdata.notify"></el-input>
</div>


       <div class="leftItem">
             <div class="row" style="margin-bottom:0px;">
               <div class="rowleft">
                          <div  style="color:#333">始发港 Airport of Departure</div>
                          <div style="text-align:center;padding-top:5px">
                              <el-input style="text-align:center" v-model="formdata.sfg"></el-input>
                            </div>
               </div>
              <div class="rowleft" style="border-left:1px solid #e8e8e8">
                          <div  style="color:#333">目的港 Airport of Destination</div>
                           <div style="text-align:center;padding-top:5px">
                              <el-input style="text-align:center" v-model="formdata.mdg"></el-input>

                            </div>
               </div>
             </div>
         </div>

             <div class="leftItem">
               <div class="row">
                  <div class="rowleft" >
                      <div style="color:#333">
                         要求运输路线 REQUESTED ROUTING
                      </div>
                      <div style="text-align:center;padding-top:5px">
                          <el-input v-model="formdata.hbh" style="margin-right:12px;"></el-input>
                      </div>

                    
                   </div>

                   <div class="rowleft"  style="border-left:1px solid #e8e8e8">
                     <div  style="color:#333">
                       要求航班日期 REQUESTED FLIGHT DATE
                     </div>

                     <div style="padding-top:5px">
                       <el-date-picker
                        v-model="formdata.hbrq"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                     </div>
                     
                   </div>
               </div>
           </div>



            <div class="leftItem" >
             <div class="row">
                <div class="winfo" >
                  <span>件数</span>
                  <span>NO.OF PIECESRCP</span>
                </div>
                <div class="winfo" >
                     <span>毛重(KG)</span>
                     <span>GROSS WEIGHT</span>
                </div>
                <div class="winfo" >
                    <span>体积（CBM）</span>
                     <span>VOL</span>
                </div>
                <div class="winfo" >
                    <span>运价类别</span>
                     <span>RATE CLASS</span>
                </div>
             </div>
           </div>

               <div class="leftItem" >
             <div class="row">
                 <div class="winfo"><el-input class="emphasize" v-model="formdata.piece"></el-input></div>
                <div class="winfo"><el-input class="emphasize" v-model="formdata.weight"></el-input></div>
                <div class="winfo"><el-input class="emphasize" v-model="formdata.volume"></el-input></div>
                <div class="winfo"><el-input class="emphasize" v-model="formdata.rateclass"  v-verify="'uppercase'"></el-input></div>
             </div>
           </div>

                 <div class="leftItem" >
             <div class="row">
                <div class="winfo">
                     <span>航空货运费用</span>
                   <span>AIR FREIGHT CHARGES</span>
                </div>
                <div class="winfo">
                   <span>始发地其他费用</span>
                   <span>OTHER CHARGES  AT ORIGIN</span>
                </div>
             </div>
           </div>

         <div class="leftItem" >
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

         <div class="leftItem" >
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
                    <el-radio :label="2">无</el-radio>
                 </el-radio-group>
                </div>

                <div class="hinfo">
                 <el-radio-group v-model="formdata.freightcc">
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="2">无</el-radio>
                 </el-radio-group>
                </div>

                <div class="hinfo">
                 <el-radio-group v-model="formdata.otherchargepp">
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="2">无</el-radio>
                  </el-radio-group>
                </div>

                
                <div class="hinfo">
                   <el-radio-group v-model="formdata.otherchargecc">
                    <el-radio :label="1">有</el-radio>
                    <el-radio :label="2">无</el-radio>
                  </el-radio-group>
                </div>

             </div>
           </div>

         <div class="leftItem otherinfo" style="padding:10px 15px;border-bottom:none" >
             <div>
               <span>To</span>
               <span>{{mawbinfo.gysname}}</span>
             </div>
                <div>
               <span>RMB</span>
               <span><el-input v-model="formdata.freightfee"></el-input></span>

             </div>
           </div>

     </div>

        <div class="right">

    <div class="rightItem" style="position:relative">
      <h2 style="text-align:center;margin-top:20px;">唯 凯 国 际 物 流 股 份 有 限 公 司（{{mawbinfo.area}}）</h2>
      <h2 style="text-align:center;margin-top:20px;font-size:18px;font-weight:600">Wecan International Logistics Co.,Ltd.</h2>
      <h2 style="text-align:center;margin-top:20px;">托运人证实表中所填全部属实并愿意遵守承运人的一切载运章程</h2>
      <p style="margin-top:10px">THE SHIPPER CERTIFIES THAT  THE PARTICULARS ON THE FACE HEREOF ARE CORRECT
AND AGREES TO THE CONDTIONS OF CARRIAGE OF THE CARRIER.</p>
<p style="margin-top:70px">SIGNATURE OF SHIPPER</p>
<p style="margin-top:70px">日期</p>
<p style="display:flex"><span style="margin-top:5px;">DATE：</span>
    <el-date-picker
      v-model="formdata.adddate"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期">
    </el-date-picker></p>
<p style="margin-bottom:10px;margin-top:60px;">托运单位盖章</p>
<p>PLS CONFIRM AND STAMP</p>
<p style="margin-bottom:50px">WITH PORWARDER MARK</p>
<img :src="`./boStatic/images/weituoshu/${mawbinfo.area}.png`" style="position:absolute;bottom:30px;width:140px;height:140px;right:150px">
     </div>



     <div class="rightItem" >
                           <div class="row" style="margin-bottom:7px;">
                            <div style="flex:0 0 150px;">
                              <div class="itemTitle">客户编号</div>
                              <div class="itemTitle" style="margin-top: 12px;">CUSTOMER NUMBER</div>
                            </div>
                            <div>
                              <el-input type="textarea" :rows="2" v-model="formdata.customernumber"></el-input>
                            </div>
                          </div>
          </div>


<div class="rightItem" style="text-align:center;padding:12px 0px">
  <p style="margin-bottom:12px">货物品名及数量</p>
  <p>NATURE AND QUANTITY OF GOODS</p>
</div>

<div class="rightItem" style="padding:7px 15px;">
  <el-input type='textarea' :rows="9" v-model="pmQuantity" placeholder="请输入品名及数量(换行隔开)" @blur="getpmQuantity"></el-input>
    <!-- <el-input type="textarea" :rows='2' v-model='formdata.pm'></el-input>
  <el-input type="textarea" :rows='7' style="margin-top:6px" v-model="formdata.quantity"></el-input> -->
</div>

<div class="rightItem" >
  <p>
    <span>处理情况及备注</span>
     <span>HANDLING INFORMATION AND REMARKS</span>
  </p>
  <el-input type="textarea" :rows="2" style="margin:12px 0px" v-model="formdata.remark"></el-input>
  <p>经办人：</p>
  <p style="margin-top:8px"><el-input v-model="formdata.addman"></el-input></p>
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

   
<div class="row" style="margin:10px;">
       <div style="text-align:right">
       <!-- <el-button @click="saveReferenceBook(2)" style="pointer-events:auto">保存</el-button> -->
       <el-button @click="saveImg" style="pointer-events:auto">发送</el-button>
       <el-button @click="printFunc" style="pointer-events:auto">打印</el-button>
      </div>

</div>
   </div>
</template>

<script>
import recsedField from '../templates/recsedField'
import {getPdf, getMomentDate,computedWeight,formatDate} from '../../api/localStorage.js'
import {getLodop} from '../../api/LodopFuncs.js'
import html2canvas from 'html2canvas';

export default {
  components: {
       recsedField
    },
  props:{
    orderdom:{
      type:String,
      default:"总单"
    },
    mawbinfo:{
      type:Object,
      default(){
        return {}
      }
    }
    ,saveNumberList:Array
  },
    data(){

      return {
            bookImg: '', //保存的托书图片
            pmQuantity:  '',
            mawbRSinfo: [
              {"title":"发货人","companytitle_fhr_mawb":"","address_fhr_mawb":"","companycode_fhr_mawb":"","state_fhr_mawb":"","city_fhr_mawb":"","postcode_fhr_mawb":"","lxr_fhr_mawb":"","phone_fhr_mawb":"","fax_fhr_mawb":"","email_fhr_mawb":"","zdfhrId":"",jsonArr:{type:'1',mdg:this.mawbinfo.sfg,gid:this.mawbinfo.gid,codetype:1},model:""},
              {"title":"收货人","companytitle_shr_mawb":"","address_shr_mawb":"","companycode_shr_mawb":"","state_shr_mawb":"","city_shr_mawb":"","postcode_shr_mawb":"","lxr_shr_mawb":"","phone_shr_mawb":"","fax_shr_mawb":"","email_shr_mawb":"","zdshrId":"",jsonArr:{type:'1',mdg:this.mawbinfo.mdg,gid:this.mawbinfo.gid,codetype:2},model:""},
             ],
             formdata:{
               shipper:"",
               consignee:"",
               notify:"",
               sfg:this.mawbinfo.sfg,
               mdg:this.mawbinfo.mdg,
               hbh:this.mawbinfo.hbh,
               hbrq: this.mawbinfo.hbrq,
               piece:this.mawbinfo.realpiece,
               weight:this.mawbinfo.realweight,
              volume:this.mawbinfo.realvolume,
              rateclass:"",
              freightpp:'',
              freightcc:'',
              otherchargepp:'',
              otherchargecc:'',
              customernumber:'',
              pm:this.mawbinfo.pm,
              quantity:"",
              handleinformation:"",
              freightfee:'',
              rate:'',
              ratetotal:'',
              othertotal:'',
              adddate:formatDate(new Date(),'yyyy-MM-dd'),
              addman:localStorage.usrname,
              remark:''
             },
             weituoUrl:"./boStatic/images/weituoshu/weituo.png",
             emailAddress: '', // 发送地址及参数

      }
    }
    ,
    methods:{
      // 获取委托站点三字代码
      getArea(data) {
         let areadata = JSON.parse(localStorage.groupType).filter(i => i.groupid == '101')

         for(let i = 0; i < areadata.length; i++) {
           let item = areadata[i]
            let [area, threeCode ] = item.typename.split("丨");
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

            if (data[1]){
              this.formdata.quantity = data[1];
            }
          }
      },

      setFreightCha(){
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
      saveImg() {
        const self = this;
         function convertCanvasToImage(canvas) {
            var image = new Image();
            let src =  canvas.toDataURL("image/png")
            image.src = src;
            // document.body.appendChild(image);
            // return  image;
            return src
         }
         this.$store.state.showloading = true;
         document.querySelectorAll('.is-show-input').forEach(item => item.style.display = 'none')

        html2canvas(document.querySelector("#printBill")).then(function(canvas) {
           document.querySelectorAll('.is-show-input').forEach(item => item.style.display = 'block')
          //  document.body.appendChild(canvas);
           self.bookImg = convertCanvasToImage(canvas);
           self.saveReferenceBook(2)
        });
      },

        saveReferenceBook(type){
          let loading = type ? true: false;
          let { fid, gid, aircompany, area} = this.mawbinfo;
          var json={json:JSON.parse(JSON.stringify(this.formdata)),area:this.mawbinfo.area}
          var method=type==1?'post':'put'
          json.hpoguid=this.mawbinfo.guid
          json.json.adddate=this.formdata.adddate||'1900-01-01';
          json.json.area = area;
          json.json.fid = fid;
          json.json.gid = gid;
          json.json.aircompany = aircompany;
          if (json.json.hbrq.indexOf('NaN') != -1) {
            json.json.hbrq = ''
          }
          const self = this;
          if(type==2){
            json.json.sid=this.mawbinfo.guid
             json.json.imgbase64 = this.bookImg;
          }
            this.$axios({method:method,url:this.$store.state.webApi+"api/ExHpoAxplineBooking",data:json,loading,tip:false}).then(results=>{
              console.log(results.data)
              console.log(JSON.stringify(results.data))
              if(results.data.resultstatus==0){
                    if(type==1){
                     this.formdata=results.data.resultdic.booking
                     this.formdata.adddate=formatDate(this.formdata.adddate,'yyyy-MM-dd')
                    this.formdata.hbrq=formatDate(this.  formdata.hbrq,'yyyy-MM-dd')
                    // if (self.mawbinfo.ybvolumeremark) {
                    //   this.formdata.quantity = self.mawbinfo.ybvolumeremark;
                    // }
                     this.formdata.quantity = self.mawbinfo.ybvolumeremark;


                    // if ( self.mawbinfo.hbrq ) {
                    //  this.formdata.hbrq = self.mawbinfo.hbrq;
                    // }
                     this.formdata.hbrq = self.mawbinfo.hbrq;

                    // if (self.mawbinfo.englishpm) {
                    //    this.formdata.pm = self.mawbinfo.englishpm;
                    // }
                    this.formdata.pm = self.mawbinfo.englishpm;
                    
                    if ( self.mawbinfo.ybstoreList &&  self.mawbinfo.ybstoreList.length) {
                      self.mawbinfo.ybstoreList.pop()
                      this.formdata.customernumber =  self.mawbinfo.ybstoreList.map(item => item.khjcno).join()
                    }
                   
                    if (!this.formdata.shipper) {
                       if (this.formdata.sfg) {
                      this.formdata.shipper = `WFF${this.getArea(this.mawbinfo.area)}`
                      } else {
                        this.formdata.shipper = `WFF`
                      }
                    }
                   
                    if ( !this.formdata.consignee) {
                       if (this.formdata.mdg) {
                       this.formdata.consignee = `WFF${this.formdata.mdg}`
                      } else {
                        this.formdata.consignee = `WFF`;
                      }
                    }

                   


                    }else{
                      // 发送邮件 => 弹出email
                      // 处理邮件地址及参数
                       this.$message(results.data.resultmessage)
                      if (type == 2) {
                          let {mailto = '', mailsubject = '', mailcontent = ''} = results.data.resultdic || {}
                        this.emailAddress = `mailto:${mailto}?subject=${mailsubject}&body=${mailcontent}`;
                        this.$nextTick(() => {
                          $('#billEmial')[0].click();
                        })
                      }
                    }
              }else{

              }
            })
        },
        setShipper(data){
             this.formdata.shipper=`${data.companytitle_fhr_mawb}\r\n${data.address_fhr_mawb}\r\n`
             this.formdata.shipper+=data.companycode_fhr_mawb?data.companycode_fhr_mawb+',':''
             this.formdata.shipper+=data.state_fhr_mawb?data.state_fhr_mawb+',':''
             this.formdata.shipper+=data.city_fhr_mawb?data.city_fhr_mawb+',':''
             this.formdata.shipper+=data.postcode_fhr_mawb?data.postcode_fhr_mawb+',':''
             this.formdata.shipper+=data.lxr_fhr_mawb?data.lxr_fhr_mawb+',':''
             this.formdata.shipper+=data.phone_fhr_mawb?'Tel:'+data.phone_fhr_mawb+',':''
             this.formdata.shipper+=data.fax_fhr_mawb?'Fax:'+data.fax_fhr_mawb+',':''
             this.formdata.shipper+=data.email_fhr_mawb?'Email:'+data.email_fhr_mawb:''
        },
        setConsignee(data){
             this.formdata.consignee=`${data.companytitle_shr_mawb}\r\n${data.address_shr_mawb}\r\n`
             this.formdata.consignee+=data.companycode_shr_mawb?data.companycode_shr_mawb+',':''
             this.formdata.consignee+=data.state_shr_mawb?data.state_shr_mawb+',':''
             this.formdata.consignee+=data.city_shr_mawb?data.city_shr_mawb+',':''
             this.formdata.consignee+=data.postcode_shr_mawb?data.postcode_shr_mawb+',':''
             this.formdata.consignee+=data.lxr_shr_mawb?data.lxr_shr_mawb+',':''
             this.formdata.consignee+=data.phone_shr_mawb?'Tel:'+data.phone_shr_mawb+',':''
             this.formdata.consignee+=data.fax_shr_mawb?'Fax:'+data.fax_shr_mawb+',':''
             this.formdata.consignee+=data.email_shr_mawb?'Email:'+data.email_shr_mawb:''
             console.log(11111111)
             console.log(this.formdata.consignee)
        },
         fhrdata(data){
             this.setShipper(data)
       },
         shrdata(data){
             this.setConsignee(data)
         }

             ,setWageall(price,itemstype){
                  var num=0
                      switch(itemstype){
                    case'票':
                    num='1'
                    break;
                    case'计重':
                    num=computedWeight(this.mawbinfo.realvolume,this.mawbinfo.realweight)
                    break;
                    case'结算重量':
                    num=this.mawbinfo.accountweightin
                    break;
                    case'毛重':
                    num=this.mawbinfo.realweight
                    break;
                     case'箱':
                     num=this.mawbinfo.realpiece
                    break;
                  }

                return  (Number(num)*Number(price)).toFixed(2)||0

                }
         ,    getRate(){

                 var mawb=this.mawbinfo.mawb
                 var sfg=this.mawbinfo.sfg
                 var mdg=this.mawbinfo.mdg
                 //var jfweight=this.mawbinfo.jfweight
                 var jfweight=this.mawbinfo.sjComWeight
                 if(mawb&&sfg&&mdg&&jfweight){
                         let json={area:this.mawbinfo.area,mawb:mawb,sfg:sfg,mdg:mdg,jfweight:jfweight}
                      this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubIataPrice",params:json,loading:false,tip:false}).then(results=>{
                        //console.log('费率信息')
                        //console.log(results.data)

                        this.$nextTick(()=>{
                          if(results.data){
                                this.formdata.rateclass=results.data.ratelevel
                                this.formdata.rate=results.data.rate
                                this.formdata.ratetotal=(results.data.rate*this.mawbinfo.jfweight).toFixed(2)
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

              getAreaPrice(){
                    var mawb=this.mawbinfo.mawb
                    var sfg=this.mawbinfo.sfg
                    var mdg=this.mawbinfo.mdg
                    var hbrq=this.mawbinfo.hbrq

                     if(!mawb||!sfg||!mdg||!hbrq){
                        return
                      }
                      var that=this;
                      let json={area:this.mawbinfo.area,mawbthreecode:this.mawbinfo.mawb.substr(0,3),sfg:this.mawbinfo.sfg,mawbmdg:this.mawbinfo.mdg,hbrq:this.mawbinfo.hbrq}
                      this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubAirCompanyAreaPrice",params:json,loading:false,tip:false}).then(results=>{
                        console.log('费用信息')
                        console.log(results.data)
                         var othertotal=0;
                           results.data.forEach(function(item,index){
                             if(item.itemsename&&item.iszd==1){
                               var price=Number(that.setWageall(item.price,item.itemstype)).toFixed(2)
                                   othertotal+=Number(price)
                             }
                            });
                            this.formdata.othertotal=Number(othertotal).toFixed(2)
                    //   this.setFreightCha()

                      })
               },
               printFunc(){

              this.saveReferenceBook()


              var lodop=getLodop();
              lodop.PRINT_INITA('0','0','794','1123',"ZXYD")

             var json=this.formdata
              lodop.ADD_PRINT_TEXT(178,30,330,95,json.shipper );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(340,30,330,95,json.consignee  );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(478,30,330,70,json.notify );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              // lodop.ADD_PRINT_TEXT(505,416,280,26,'json.adddate' );
              // lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(505,416,120,26,json.adddate||'');
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(608,525,196,26, json.customernumber );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(719,374,347,60,json.pm );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(970,374,347,25,json.remark);
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(1020,374,347,25,json.addman );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(780,374,347,138,json.quantity||'' );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(576,90,50,22,json.sfg );
              // lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(579,258,50,22,json.mdg );
              // lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(621,30,330,35,json.hbh+'/'+formatDate(json.hbrq,'yyyy-MM-dd') );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(714,30,72,102,json.piece);
                //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(714,118,72,102,json.weight );
                //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(714,200,72,102,json.volume);
              // lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(714,287,72,102,json.rateclass);
            //  lodop.SET_PRINT_STYLEA(0,"Bold",1)
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);


              lodop.ADD_PRINT_TEXT(905,30,77,20, this.getCheckData(json.freightpp)||'' );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(905,118,77,20,this.getCheckData(json.freightcc)||'' );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(905,200,77,20,this.getCheckData(json.otherchargepp)||'');
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(905,287,77,20,this.getCheckData(json.otherchargecc)||'' );
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(970,94,240,24,json.pono);
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

               lodop.ADD_PRINT_TEXT(940,94,240,24, this.mawbinfo.gysname||'');
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(998,94,240,24,json.freightfee||'');
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_TEXT(188,639,64,18,'('+this.mawbinfo.area+')');
              lodop.SET_PRINT_STYLEA(0,"ReadOnly",0);

              lodop.ADD_PRINT_HTM(450,570,150,150,`<img border='0' width='150' height='150' src='./boStatic/images/weituoshu/${this.mawbinfo.area}.png'>`)

              lodop.ADD_PRINT_SETUP_BKIMG("<img border='0' width='794' height='1123' src='./boStatic/images/weituoshu/weituo.jpg'>")
              lodop.SET_PRINT_PAGESIZE(1,"210mm","297mm");
              lodop.SET_SHOW_MODE("BKIMG_PRINT",true);

              lodop.PRINT_SETUP()


                  //  window.print()
               }
       },
       created(){
          this.setShipper(this.mawbinfo)
          this.setConsignee(this.mawbinfo)
        // this.formdata=Object.assign({},this.formdata,this.mawbinfo)
        this.formdata.hbrq=formatDate(this.formdata.hbrq,'yyyy-MM-dd')
        this.$watch(
           function () {
              return this.mawbinfo.mawb+this.mawbinfo.sfg+this.mawbinfo.mdg+this.mawbinfo.hbrq+this.mawbinfo.jfweight
           },
            function (newval,oldval) {
                  this.getAreaPrice() //费用信息
                  this.getRate()  //费率
           },{immediate:true}
         )

         // 监听品名，数量
         this.$watch(
           function () {
             return this.formdata.pm + this.formdata.quantity
           },
           function (newVal, oldVal) {
             let data = ''
             if  ( this.formdata.pm) {
               data =  this.formdata.pm;
             }

             if  ( this.formdata.quantity) {
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
       ,computed: {


       }
       ,watch: {
          "mawbinfo.sfg"(val){
        if(val){
             this.mawbRSinfo[0].jsonArr={type:"1",mdg:this.mawbinfo.sfg,gid:this.mawbinfo.gid,codetype:1}
        }

      },"mawbinfo.mdg"(val){
        if(val){
            this.mawbRSinfo[1].jsonArr={type:"1",mdg:this.mawbinfo.mdg,gid:this.mawbinfo.gid,codetype:2}
        }
      },
       "mawbinfo.gid"(val){
         if(val){
            this.mawbRSinfo[0].jsonArr={type:"1",mdg:this.mawbinfo.sfg,gid:this.mawbinfo.gid,codetype:1}
            this.mawbRSinfo[1].jsonArr={type:"1",mdg:this.mawbinfo.mdg,gid:this.mawbinfo.gid,codetype:2}
         }

      },
      'mawbinfo.paymode'(val){
         //  this.setFreightCha()
      },

      // 预付 到付 反正就是 1 2 1 2 你前端得处理成勾选  而且 一组里只有一个1
      'formdata.freightpp': {
        handler(val) {
          if (val == '1') {
            this.$set( this.formdata, 'freightcc', '')
          }

          if (val == '2') {
            this.$set( this.formdata,  'freightcc', '')
          }
        }
       
      },

       'formdata.freightcc': {
        handler(val) {
          if (val == '1') {
            this.$set( this.formdata, 'freightpp', '')
          }

          if (val == '2') {
            this.$set( this.formdata,  'freightpp', '')
          }
        }
       
      },

       'formdata.otherchargepp': {
        handler(val) {
          if (val == '1') {
            this.$set( this.formdata, 'otherchargecc', '')
          }

          if (val == '2') {
            this.$set( this.formdata,  'otherchargecc', '')
          }
        }
      },

       'formdata.otherchargecc': {
        handler(val) {
          if (val == '1') {
            this.$set( this.formdata, 'otherchargepp', '')
          }

          if (val == '2') {
            this.$set( this.formdata,  'otherchargepp', '')
          }
        }
       
      },

      
      
      saveNumberList:{
        handler(val){
            var longsall=0
            var widthsall=0
            var heightsall=0
            if (val) {
                this.saveNumberList.forEach(item=>{
               item.storevolumeList.forEach(k=>{
                   longsall+=k.longs
                   widthsall+=k.widths
                   heightsall+=k.heights
               })
             })
            }
          
            this.formdata.quantity=longsall+'*'+widthsall+'*'+heightsall+'*'+this.mawbinfo.realpiece
        },immediate:true,deep:true
      }


}
}






</script>

<style lang="less" scoped>
@color:#e8e8e8;
@border:1px solid @color;
.content{
    border:@border;
    /deep/ textarea{
      resize: none
    }
    /deep/ .jfweight{
  width:100px;
}
color:#333;
}
.topimage{
  height:auto;
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
  .winfo:last-child{
    border-right:0px;
  }
   .hinfo:last-child{
    border-right:0px;
  }
  .smallInput{
    flex: 0 0 150px;
  }
  .itemdiv:last-child{
    border-right:none
  }
}
.emphasize{
 font-weight:600;
 font-size:16px;
 color:#333
}
.winfo{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border-right:@border;
    >span{
      margin-top:8px;
    }
}
.hinfo{
      display: flex;
   justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-right:@border
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
.otherinfo{
  span{
    display:inline-block;
    font-size: 14px;
    margin:10px 20px;
    min-width: 60px;
  }
}
.tongzhi{
  /deep/ input{
    text-indent:20px;
  }
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
      font-weight: 600
     }
     .rowleft{
          padding:10px 15px;;
     }
     .rowright{
        padding:10px 15px;
        display: flex;
        align-items: center
     }
  }
}
.right{
  flex: 1;
}

.input-bill-class {
  /deep/.el-input__inner{
    border: none;
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
    #print1 .content{
       width: 210mm;
       height: 297mm;
    }
}

</style>
