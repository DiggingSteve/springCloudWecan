<template>
  <div>
    <!-- {{hawbPosition}}
    {{cur_index}}-->
    <!-- {{mawbdetail}} -->
    <!-- {{cacheTabs}} -->
    <!-- {{guidHawbGroup}} -->
    <!-- {{pagetype}}
{{cur_index}} -->
    <!-- {{hawbInfo}} -->
    <!-- {{this.mawbdetail.pagetype}} -->
    <!-- {{hawbInfoData}} -->
    <!-- {{hawbInfoData}}
{{cur_index}} -->
    <!-- {{hawbInfoData}}
{{cur_index}} -->
    <el-collapse-transition>
      <div v-if="showtabtitle">
        <el-form style="padding-bottom:12px;border:1px solid #e8e8e8;border-radius:4px;margin-bottom:15px">
          <div class="detail-title">分单新增</div>
          <!-- <div class="mawbform" style="padding-left:20px;width:640px;color:#333">
    <div>总单件数：{{mawbdetail.ybpiece}}</div>
    <div>总单重量：{{mawbdetail.ybweight}}</div>
    <div>总单体积：{{mawbdetail.ybvolume}}</div>
    <div>总单目的港：{{mawbdetail.mdg}}</div>
          </div>-->
          <!-- {{hawbInfo}} -->
          <!-- {{hawbform}} -->
          <!-- {{hawb_list}} -->
          <!-- {{cur_index}}  -->
          <!-- {{hawbArr}} -->
          <!-- {{JSON.stringify(hawbRSinfo)}} -->
          <!-- {{mawbdetail}} -->
          <!-- <template v-for="(item,index) in hawbform"> -->
          <div class="mawbform" v-enterfocus="confirmAddHawb" style="width:950px;">
            <div>
              <span style="text-indent:16px;">分单号：</span>
              <span>
                <el-input v-model.trim="newHawbAdd.hawb" @change="hawbFormat"></el-input>
              </span>


            </div>



            <div>
              <span>分单目的港：</span>
              <span>
                <el-input v-model.number.trim="newHawbAdd.mdg" v-verify="'sfgmdg'"></el-input>
              </span>
            </div>
            <div style="text-align:left;flex:0 0 100px"></div>
          </div>

          <!-- <div class="mawbform" style="width:950px;">
         <div> <span>预报件数：</span><span><el-input v-verify="'integer'" v-model.trim="item.ybpiece"></el-input></span></div>
         <div><span>预报重量：</span><span><el-input v-verify="'fixedTwo'" v-model.trim="item.ybweight"></el-input></span></div>
         <div><span>预报体积：</span> <span><el-input v-verify="'fixedThree'" v-model.trim="item.ybvolume"></el-input></span></div>
        <div></div>
            </div>-->

          <!--             <div class="mawbform" style="width:950px;" v-if="pagetype!=3">
              <div v-if="mawbdetail.pagetype!==12">
                <span>实际件数：</span>
                <span style="text-indent:3px">{{item.realpiece}}</span>
              </div>
              <div v-else>
                 <span>件数：</span>
                 <el-input v-model="item.realpiece" style="width:166px"></el-input>
              </div>

              <div v-if="mawbdetail.pagetype!==12">
                <span>实际重量：</span>
                <span style="text-indent:3px">{{item.realweight}}</span>
              </div>
              <div v-else>
                 <span>重量：</span>
                 <el-input v-model="item.realweight" style="width:166px"></el-input>
              </div>

              <div v-if="mawbdetail.pagetype!==12">
                <span>实际体积：</span>
                <span style="text-indent:3px">{{item.realvolume}}</span>
              </div>
              <div v-else>
                 <span>体积：</span>
                 <el-input v-model="item.realvolume" style="width:166px"></el-input>
              </div>

              <div style="flex:0 0 100px">
                <span style="text-align:left">
                  <i
                    @click="hawbformDel(index)"
                    style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;"
                    :style="{color:index!=0?'red':'#67C23A'}"
                    :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                  ></i>
                </span>
              </div>
            </div> -->
          <!-- </template> -->
          <div style="margin-top:15px;margin-left:15px">
            <el-button type="primary" @click="addhawb">确 定</el-button>
            <el-button @click="resethawb">取 消</el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="hawbTabs" v-if="hawbInfoData.length>0">
      <div class="tabs-header" v-if="showtabtitle">
        <div class="left-title">
          <!-- 分单信息： -->
        </div>
        <div class="header-c" :style="{'top': `-${Math.floor(cur_index / 8) * 37}px`}">
          <p v-for="(hawb, index) in hawbInfoData" :title="hawb.hawb" :key="hawb.hawb"
            :class="{'active': cur_hawb == hawb.hawb}" @click.self="togglehawb(hawb.hawb, index)" style="220px">
            {{ hawb.hawb }}
            <i @click="togglehawb(hawb, index)" style="color:#0F5A8C;font-size: 16px;font-weight:500"
              :class="iconClass(pactlsendstatus)" v-if="String(pactlsendstatus).length"></i>
            <!--  <small @click="togglehawb(hawb.hawb, index)" v-if="guidHawbGroup.filter(i=>i.hawb==hawb).length>0">({{guidHawbGroup.filter(i=>i.hawb==hawb)[0].sendstatus}})</small> -->
            <!-- <span class="icon-c">
              <span class="icon-close-mask"></span>
              <i @click="removehawb(index)" class="el-icon-close"></i>
            </span> -->
          </p>
        </div>
        <i class="tabs-right-mask"></i>
        <!-- <el-button class="add-hawb" @click.native="dialogFormVisible = true" v-if="pagetype==1">添加分单</el-button> -->
        <el-button :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]" @click="show_tabs"
          icon="el-icon-arrow-down"></el-button>
      </div>
      <div ref="hide_tabs" @blur="tabs_blur" :class="['hide-tabs', {'show': show_all_hawb}]"
        :style="{'height': `${Math.ceil(hawbInfoData.length / 7) * 50 + 14}px`}" tabindex="0" v-if="showtabtitle">
        <p v-for="(hawb, index) in hawbInfoData" :title="hawb.hawb" :key="hawb.hawb"
          :class="{'active': cur_hawb == hawb.hawb}" @click.self="togglehawb(hawb.hawb, index)">
          {{ hawb.hawb }}
          <i @click="togglehawb(hawb, index)" style="color:#0F5A8C;font-size: 16px;font-weight:500"
            :class="iconClass(pactlsendstatus)" v-if="String(pactlsendstatus).length"></i>
          <span class="icon-c">
            <span class="icon-close-mask"></span>
            <!-- <i @click="removehawb(index)" class="el-icon-close"></i> -->
          </span>
        </p>
      </div>
      <div class="tabs-content" style="position:relative">

        <div class="detail-c" style="max-width:1300px;line-height:36px;">

          <newFormCmpt :view-data.sync="basicInformation" :model-data.sync="hawbInfoData[cur_index]">

          </newFormCmpt>
        </div>
        <!--         <div>

            <template v-for="(item,index) in guidHawbGroup" v-if="guidHawbGroup.length>0">

              <makingBillAms
                :key="index"
                v-if="cacheTabs.includes(index)"
                v-show="cur_index==index"
                :mawbguid="item.guid"
                :sid="item.sid"
                style="border:1px solid #e8e8e8"
                orderdom="分单"
                :mawbinfo="item"
                @saveSuccess="saveSuccess"
                isams
              ></makingBillAms>
            </template>

        </div> -->
      </div>


    </div>
    <el-button type="primary" style="float:right;margin-top:16px;" @click="saveHawb">保存</el-button>
  </div>
</template>

<script>

  import { getValByGrouid } from '../../api/localStorage'

  export default {
    props: {
      hawbInfoData: Array,
      mawbInfo: Object,
      hawbActiveIndex: [String, Number],
      pactlsendstatus: [String, Number],
      showtabtitle: {//是否显示分单标题，默认显示
        type: Boolean,
        default: true
      },
      sendtype:{//1 天运通 2 东航平台
        type:[String,Number],
        default:1
      }
      //mawbdetail: Object,
      //hawbTableData: Array,
      // nosave: Number,
      //pageFrom: String,
      //hawbPosition: {
      //type: String,
      // default: ""
      //}
    },

    data() {
      return {
        hawb_list: [],
        cur_index: 0,
        show_all_hawb: false,
        hawb_data_list: {},
        guidHawbGroup: Array, //查询的分单数据
        hawbInfo: [], //存放分单数据
        dialogFormVisible: false, //添加分单弹窗
        hawbform: [],
        backupsHawbInfo: [],
        getNumberList: [],

        cusGuid: "",
        cacheTabs: [0],
        basicInformation: {
          hawb: {
            title: "分运单号：",
            type: 1,
            disabled: true
          },
          zdpiece: {
            title: "件数：",
            type: 1,
            required: true
            //disabled:true
          },
          zdweight: {
            title: "重量：",
            type: 1,
            required: true,
            idStyle: { width: "42%" },
            itemStyle: { width: "42%" },
            //disabled:true
          },


          sfg: {
            title: "始发港：",
            type: 20,
            required: true,
            pagetype: 6
            //disabled:true
          },
          mdg: {
            title: "目的港：",
            type: 20,
            required: true,
            pagetype: 6
            //disabled:true
          },
          smallpiece: {
            title: "小件数：",
            type: 1,
            required: true,
            verify: "integer",
            idStyle: { width: "42%" },
            itemStyle: { width: "42%" },
            hidden: () => { return this.sendtype == 1 }
          },

          //    rendertype:{
          // 	title: "申报类型",
          //  type: 3,
          //  idStyle: { width: "100%" },
          //  itemStyle: { width: "100%" },
          //  groupid: "105",
          // },
          ismagnetic: {
            title: "是否磁检：",
            type: 3,
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" },
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 2 }
            ]
          },

          pm: {
            title: "英文品名：",
            type: 17,
            verify: "uppercase",
            itemStyle: { width: "560px" },
            required: true
          },
          chinesepm: {
            title: "中文品名(补充)：",
            type: 17,
            itemStyle: { width: "560px" },

          },
          pmdeclaration: {
            title: "品名详细描述：",
            type: 17,
            idStyle: { width: "100%" },
            itemStyle: { width: "1120px" },

          }




        },
        newHawbAdd: {
          hawb: '',
          mdg: ''
        }
      };
    },

    methods: {
      saveSuccess(id) {
        //this.guidHawbGroup[this.cur_index].guid=id
      },
      iconClass(status) {

        if (status == '1') {
          return 'el-icon-check'
        }
        if (status == '0') {

          return 'el-icon-close'
        }
        if (status == '5') {
          return 'el-icon-edit'
        }
      },
      getStatus(val) {
        // return getValByGrouid(146, val)
      },

      resethawb() {
        // this.hawbform = [

        //   this.initHawbform()
        // ];
      },
      hawbFormat(val) {
        var r = /^[^\u4e00-\u9fa5]+$/;
        if (val && !r.test(val)) {
          this.$message.error("分运单号不能包含中文！");
          return;
        }
      },
      saveHawb() {

        // if(!this.hawbInfoData[this.cur_index].pm){
        // 	this.$message.error('英文品名必填')
        // 	return false
        // }
        if (!Number(this.hawbInfoData[this.cur_index].zdpiece)) {
          this.$message.error('件数必填')
          return false
        }
        if (!Number(this.hawbInfoData[this.cur_index].zdweight)) {
          this.$message.error('重量必填')
          return false
        }
        if (!this.hawbInfoData[this.cur_index].sfg) {
          this.$message.error('始发港必填')
          return false
        }
        if (!this.hawbInfoData[this.cur_index].mdg) {
          this.$message.error('目的港必填')
          return false
        }

        if(this.sendtype==2){
          if (!this.hawbInfoData[this.cur_index].smallpiece && this.hawbInfoData[this.cur_index].smallpiece !== '0') {
            this.$message.error('小件数必填')
            return false
          }
        }
      

        var data = { hawb: this.hawbInfoData[this.cur_index].hawb, ismagnetic: this.hawbInfoData[this.cur_index].ismagnetic, pm: this.hawbInfoData[this.cur_index].pm, chinesepm: this.hawbInfoData[this.cur_index].chinesepm, pmdeclaration: this.hawbInfoData[this.cur_index].pmdeclaration, hpoid: this.hawbInfoData[this.cur_index].hpoid, sfg: this.hawbInfoData[this.cur_index].sfg, mdg: this.hawbInfoData[this.cur_index].mdg, zdpiece: this.hawbInfoData[this.cur_index].zdpiece, zdweight: this.hawbInfoData[this.cur_index].zdweight, sid: this.hawbInfoData[this.cur_index].sid, hawbtype: this.hawbInfoData[this.cur_index].hawbtype, smallpiece: this.hawbInfoData[this.cur_index].smallpiece }

        this.$axios({ method: "put", url: this.$store.state.webApi + "api/PactlZdHawb", data: data, loading: true, tip: false, noarea: '1' })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage)
            } else {
              this.$message.error(results.data.resultmessage)
            }
          })
          .catch(error => {

          })
      },
      initHawbform() {
        // var obj = {
        //   hawb: "",
        //   khjcno: [],
        //   ybpiece: "",
        //   ybweight: "",
        //   ybvolume: "",
        //   realvolume: "",
        //   realvolume: "",
        //   realvolume: "",
        //   mdg: "",
        //   sfg: ""
        // };
        // obj.mdg = this.mawbdetail.mdg;
        // obj.sfg = this.mawbdetail.sfg;
        // return obj;
      },
      fetch_hawb_data() {
        // var obj = {
        //   declaration: {
        //     title: "报关类型",
        //     model: "",
        //     defaultModel: "",
        //     options: [],
        //     groupid: 19,
        //     declareList: [
        //       {
        //         bgdh: "YSSHA18001001",
        //         piece: "",
        //         weight: "",
        //         lds: "0",
        //         bggys: "",
        //         jdzsData: [{ jdzsbh: "", ypmc: "", sjdw: "", scdw: "" }],
        //         modelId: ""
        //       }
        //     ],
        //     jsonArr: {
        //       type: "all",
        //       comxz: "1",
        //       system: "",
        //       area: "",
        //       timestamp: "0"
        //     },
        //     id: "bglx"
        //   },
        //   hawbRSinfo: [
        //     [
        //       {
        //         title: "发货人",
        //         companytitle_fhr_hawb: "",
        //         address_fhr_hawb: "",
        //         companycode_fhr_hawb: "",
        //         state_fhr_hawb: "",
        //         city_fhr_hawb: "",
        //         postcode_fhr_hawb: "",
        //         lxr_fhr_hawb: "",
        //         phone_fhr_hawb: "",
        //         fax_fhr_hawb: "",
        //         email_fhr_hawb: "",
        //         fdfhrId: "",
        //         jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
        //         model: ""
        //       },
        //       {
        //         title: "收货人",
        //         companytitle_shr_hawb: "",
        //         address_shr_hawb: "",
        //         companycode_shr_hawb: "",
        //         state_shr_hawb: "",
        //         city_shr_hawb: "",
        //         postcode_shr_hawb: "",
        //         lxr_shr_hawb: "",
        //         phone_shr_hawb: "",
        //         fax_shr_hawb: "",
        //         email_shr_hawb: "",
        //         fdshrId: "",
        //         jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
        //         model: ""
        //       }
        //     ]
        //   ]

        // };


        // return obj;
      },
      show_tabs() {
        if (!this.hidden_times) {
          this.show_all_hawb = !this.show_all_hawb;
          this.$refs.hide_tabs.focus();
        }
      },
      tabs_blur() {
        this.show_all_hawb = false;
        this.hidden_times = true;
        setTimeout(() => {
          this.hidden_times = false;
        }, 200);
      },
      addhawb() {
        this.addHawbList();
      },
      togglehawb(hawb, index) {
        // if(!this.cacheTabs.includes(index)){
        //   this.cacheTabs.push(index)
        // }
        // if (this.pagetype == 1) {
        //   this.upHawbDetail();
        // }

        this.cur_index = index;

        // if (!this.hawbInfo[index]) {
        //   //如果值不存在，再去取;
        //   this.getHawbDetail(this.guidHawbGroup[index].guid, index);
        // }
      },
      removehawb(index) {
        //删除当前分单号
        //this.delHawbDetail(index);
      },
      confirmAddHawb() {
        //新增表单分单
        //this.hawbform.push(this.initHawbform());
      },
      hawbSelFunc(val, index) {
        //选中进仓编号
        // var piece = 0;
        // var weight = 0;
        // var volume = 0;
        // val.forEach(item => {
        //   this.getNumberList.forEach(element => {
        //     if (item == element.khjcno) {
        //       piece += Number(element.piece);
        //       weight += Number(element.weight);
        //       volume += Number(element.volume);
        //     }
        //   });
        // });

        // this.hawbform[index].realpiece = piece;
        // this.hawbform[index].realweight = Number(weight).toFixed(2);
        // this.hawbform[index].realvolume = Number(volume).toFixed(3);
        // this.hawbform[index].ybpiece = piece;
        // this.hawbform[index].ybweight = Number(weight).toFixed(2);
        // this.hawbform[index].ybvolume = Number(volume).toFixed(3);
      },
      selOptionShow(khjcno, index) {

        // var isUse = false;
        // this.hawbform.forEach((item, key) => {
        //   if (item.khjcno.length > 0) {
        //     item.khjcno.forEach(el => {
        //       if (khjcno == el && key != index) {
        //         isUse = true;
        //       }
        //     });
        //   }
        // });
        // this.getNumberList.forEach(el => {
        //   if (el.khjcno == khjcno && el.status) {
        //     isUse = true;
        //   }
        // });

        // return isUse;
      },
      hawbformDel(index) {

        // if (index == 0) {
        //   this.confirmAddHawb();
        // } else {
        //   this.hawbform.splice(index, 1);
        // }
      },
      getHawbNum() {

        // if (this.mawbdetail.pagetype != 12) {
        //   this.guidHawbGroup = [];
        //   this.cacheTabs=[]
        //   this.hawbInfo = [];
        //   //获取分单号

        //     let json = {
        //       hpoidHawbGroup:
        //         this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid
        //     };

        //    let url=this.pagetype !=3 ? "api/ExAxpline":'api/ExHpoAxplineMawbDocAmsSend'
        //     this.$axios({
        //       method: "get",
        //       url: this.$store.state.webApi + url,
        //       params: json,
        //       loading: true,
        //       tip: false
        //     }).then(results => {

        //       this.getHawbList(results.data);
        //     });

        // } else {

        //   this.$axios({
        //     method: "get",
        //     url: this.$store.state.webApi + "api/ExhpoAxpline",
        //     params: {
        //       boguid: this.mawbdetail.boguid,
        //       ImportType: this.mawbdetail.customstatus != 1 ? 2 : 1
        //     },
        //     loading: true,
        //     tip: false
        //   }).then(results => {
        //     var hawbInfo = results.data.resultdic.axplist;
        //     let hawb_list = [];

        //     for (let i in hawbInfo) {
        //       let detail = hawbInfo[i];
        //       hawb_list.push(detail.hawb);

        //       let hawbrsdata = [

        //           {
        //         title: "发货人",
        //         companytitle_fhr_hawb: detail.companytitle_fhr_hawb||this.mawbdetail.companytitle_fhr_mawb,
        //         address_fhr_hawb: detail.address_fhr_hawb||this.mawbdetail.address_fhr_mawb,
        //         companycode_fhr_hawb: detail.companycode_fhr_hawb||this.mawbdetail.companycode_fhr_mawb,
        //         state_fhr_hawb: detail.state_fhr_hawb||this.mawbdetail.state_fhr_mawb,
        //         city_fhr_hawb: detail.city_fhr_hawb||this.mawbdetail.city_fhr_mawb,
        //         postcode_fhr_hawb: detail.postcode_fhr_hawb||this.mawbdetail.postcode_fhr_mawb,
        //         lxr_fhr_hawb:detail.lxr_fhr_hawb|| this.mawbdetail.lxr_fhr_mawb,
        //         phone_fhr_hawb:detail.phone_fhr_hawb|| this.mawbdetail.phone_fhr_mawb,
        //         fax_fhr_hawb: detail.fax_fhr_hawb||this.mawbdetail.fax_fhr_mawb,
        //         email_fhr_hawb: detail.email_fhr_hawb||this.mawbdetail.email_fhr_mawb,
        //         fdfhrId: "",
        //         jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
        //         model: ""
        //       },
        //       {
        //         title: "收货人",
        //         companytitle_shr_hawb: detail.companytitle_shr_hawb||this.mawbdetail.companytitle_shr_mawb,
        //         address_shr_hawb: detail.address_shr_hawb|| this.mawbdetail.address_shr_mawb,
        //         companycode_shr_hawb: detail.companycode_shr_hawb|| this.mawbdetail.companycode_shr_mawb,
        //         state_shr_hawb: detail.state_shr_hawb|| this.mawbdetail.state_shr_mawb,
        //         city_shr_hawb: detail.city_shr_hawb|| this.mawbdetail.city_shr_mawb,
        //         postcode_shr_hawb: detail.postcode_shr_hawb|| this.mawbdetail.postcode_shr_mawb,
        //         lxr_shr_hawb: detail.lxr_shr_hawb|| this.mawbdetail.lxr_shr_mawb,
        //         phone_shr_hawb: detail.phone_shr_hawb||this.mawbdetail.phone_shr_mawb,
        //         fax_shr_hawb: detail.fax_shr_hawb|| this.mawbdetail.fax_shr_mawb,
        //         email_shr_hawb: detail.email_shr_hawb|| this.mawbdetail.email_shr_mawb,
        //         fdshrId: "",
        //         jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
        //         model: ""
        //       }
        //       ];
        //       hawbrsdata[0].jsonArr = {
        //         type: "2",
        //         mdg: this.mawbdetail.sfg,
        //         gid: this.mawbdetail.gid,
        //         codetype: 1
        //       };
        //       hawbrsdata[1].jsonArr = {
        //         type: "2",
        //         mdg: this.mawbdetail.mdg,
        //         gid: this.mawbdetail.gid,
        //         codetype: 2
        //       };
        //       hawbrsdata.forEach(item => {
        //         Object.keys(item).forEach(key => {

        //           if (detail[key]) {
        //             item[key] = detail[key];
        //           }
        //         });
        //       });
        //       detail.khjcnoArr = [];
        //       detail.hawbRSinfo = hawbrsdata;
        //       detail.taxcode_fhr_hawb =detail.taxcode_fhr_hawb  || this.mawbdetail.taxcode_fhr_mawb;
        //       detail.taxcode_shr_hawb = detail.taxcode_shr_hawb || this.mawbdetail.taxcode_shr_mawb;
        //     }
        //     this.hawb_list = hawb_list;
        //     this.hawbInfo = hawbInfo;
        //     this.cusGuid = results.data.resultdic.cusGuid;
        //     this.cur_index = 0;
        //   });
        // }
      },
      getHawbList(data) {
        // this.guidHawbGroup = data;
        // this.hawb_list = this.guidHawbGroup.map(function(item) {
        //   return item.hawb;
        // });

        // this.hawbRSinfo = this.guidHawbGroup.map(function(item) {
        //   return [
        //     {
        //       title: "发货人",
        //       companytitle_fhr_hawb: "",
        //       address_fhr_hawb: "",
        //       companycode_fhr_hawb: "",
        //       state_fhr_hawb: "",
        //       city_fhr_hawb: "",
        //       postcode_fhr_hawb: "",
        //       lxr_fhr_hawb: "",
        //       phone_fhr_hawb: "",
        //       fax_fhr_hawb: "",
        //       email_fhr_hawb: "",
        //       fdfhrId: "",
        //       jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
        //       model: ""
        //     },
        //     {
        //       title: "收货人",
        //       companytitle_shr_hawb: "",
        //       address_shr_hawb: "",
        //       companycode_shr_hawb: "",
        //       state_shr_hawb: "",
        //       city_shr_hawb: "",
        //       postcode_shr_hawb: "",
        //       lxr_shr_hawb: "",
        //       phone_shr_hawb: "",
        //       fax_shr_hawb: "",
        //       email_shr_hawb: "",
        //       fdshrId: "",
        //       jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
        //       model: ""
        //     }
        //   ];
        // });

        // if (this.guidHawbGroup[0]) {

        //    this.cacheTabs=[0]
        //   this.getHawbDetail(this.guidHawbGroup[0].guid, 0);
        // }
        // this.cur_index = this.hawbPosition
        //   ? this.hawb_list.indexOf(this.hawbPosition)
        //   : 0;
        //   this.cacheTabs=[this.cur_index]
      },
      getHawbDetail(hawbguid, index) {
        // if (this.pagetype == 3) return;
        // //获取分单详细
        // this.$axios({
        //   method: "get",
        //   url: this.$store.state.webApi + "api/ExAxpline",
        //   params: { guid: hawbguid },
        //   loading: true,
        //   tip: false
        // }).then(results => {
        //   console.log("分单详细");
        //   console.log(JSON.stringify(results.data));

        //   var hawbrsdata = this.hawbRSinfo[index];
        //   var hawbDetail = results.data;
        //   hawbDetail.hwxz = this.mawbdetail.hwxz;

        //   hawbDetail.gid = this.mawbdetail.gid;

        //   hawbrsdata.forEach(item => {
        //     Object.keys(item).forEach(key => {
        //       //  //console.log(key)
        //       if (hawbDetail[key]) {
        //         item[key] = hawbDetail[key];
        //       }
        //     });
        //   });
        //   hawbrsdata[0].jsonArr = {
        //     type: "2",
        //     mdg: hawbDetail.sfg,
        //     gid: hawbDetail.gid,
        //     codetype: 1
        //   };
        //   hawbrsdata[1].jsonArr = {
        //     type: "2",
        //     mdg: hawbDetail.mdg,
        //     gid: hawbDetail.gid,
        //     codetype: 2
        //   };

        //   hawbDetail.hawbRSinfo = hawbrsdata;
        //   hawbDetail.newYbstoreList = [];
        //   hawbDetail.khjcnoArr = hawbDetail.ybstoreList.map(i => i.khjcno);

        //   this.$set(this.hawb_list, index, hawbDetail.hawb);
        //   this.cur_index = index;

        //   this.$set(this.hawbInfo, index, hawbDetail);
        //   this.backupsHawbInfo[index] = JSON.stringify(hawbDetail);
        // });
      },

      ifmodified(json1, json2) {
        // delete json1.newYbstoreList;
        // delete json1.khjcnoArr;
        // delete json1.hawbRSinfo[0].jsonArr;
        // delete json1.hawbRSinfo[1].jsonArr;
        // delete json1.khjcno;
        // delete json1.exForm;

        // delete json2.newYbstoreList;
        // delete json2.khjcnoArr;
        // delete json2.hawbRSinfo[0].jsonArr;
        // delete json2.hawbRSinfo[1].jsonArr;
        // delete json2.khjcno;
        // delete json1.exForm;

        // console.log(JSON.stringify(json1));
        // console.log(JSON.stringify(json2));
        // console.log(JSON.stringify(json1) == JSON.stringify(json2));
        // return JSON.stringify(json1) == JSON.stringify(json2);
      },
      upHawbDetail(type) {
        //修改分单信息  //type: 1(分单确认)  2(分单取消确认)
        // var index = this.cur_index;
        // if (!this.hawbInfo[index]) {
        //   return;
        // }
        // if (this.mawbdetail.pagetype != 12) {
        //   let newJson = JSON.parse(JSON.stringify(this.hawbInfo[index]));
        //   if (newJson) {
        //     newJson.realpiece = Number(newJson.realpiece || 0);
        //     newJson.realweight = Number(newJson.realweight || 0);
        //     newJson.realvolume = Number(newJson.realvolume || 0);
        //     newJson.ybpiece = Number(newJson.ybpiece || 0);
        //     newJson.ybweight = Number(newJson.ybweight || 0);
        //     newJson.ybvolume = Number(newJson.ybvolume || 0);
        //     newJson.zdpiece = Number(newJson.zdpiece || 0);
        //     newJson.zdweight = Number(newJson.zdweight || 0);
        //     newJson.zdvolume = Number(newJson.zdvolume || 0);
        //     newJson.smallpiece = Number(newJson.smallpiece || 0);
        //     newJson.jfweight = Number(newJson.jfweight || 0);
        //     if (!newJson.hwlx) {
        //       this.$message.error("请填写货物类型！");
        //       return;
        //     }
        //     if (
        //       (!this.ifmodified(
        //         newJson,
        //         JSON.parse(this.backupsHawbInfo[index])
        //       ) &&
        //         !type) ||
        //       type
        //     ) {
        //       let str = JSON.parse(JSON.stringify(this.hawbInfo[index]));
        //       delete str.realpiece;
        //       delete str.realweight;
        //       delete str.realvolume;
        //       delete str.ybstoreList;
        //       delete str.exForm;
        //       str.sid = this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid;
        //       if(this.pagetype != 3){
        //         str.boguid = this.mawbdetail.boguid;
        //       }

        //       str = Object.assign({}, str, str.hawbRSinfo[0], str.hawbRSinfo[1]);
        //       str.area = this.mawbdetail.area;
        //       str.ybstoreList = str.newYbstoreList;

        //       delete str.title;
        //       delete str.jsonArr;
        //       delete str.model;

        //       if (type == "1") {
        //         if (!str.ybpiece || !str.ybweight || !str.ybvolume) {
        //           this.$message.error("请补充预报件重体信息");
        //           return false;
        //         }
        //         if (
        //           !str.address_shr_hawb ||
        //           !str.city_shr_hawb ||
        //           !str.companycode_shr_hawb ||
        //           !str.companytitle_shr_hawb
        //         ) {
        //           this.$message.error("请补充分单收货人信息");
        //           return false;
        //         }
        //         if (
        //           !str.address_fhr_hawb ||
        //           !str.city_fhr_hawb ||
        //           !str.companycode_fhr_hawb ||
        //           !str.companytitle_fhr_hawb
        //         ) {
        //           this.$message.error("请补充分单发货人信息");
        //           return false;
        //         }
        //         this.pageFrom == "order"
        //           ? (str.dzstatus = "120")
        //           : (str.dzstatus = "150");
        //       } else if (type == "2") {
        //         this.pageFrom == "order"
        //           ? (str.dzstatus = "100")
        //           : (str.dzstatus = "1");
        //       }


        //       console.log(JSON.stringify(str));

        //       this.$axios({
        //         method: "put",
        //         url: this.$store.state.webApi + "api/ExAxpline",
        //         data: str,
        //         loading: true,
        //         tip: false
        //       }).then(results => {

        //         if (results.data.resultstatus == 0) {
        //           layer.msg("修改成功");
        //           //重置本地数据备份

        //           this.getHawbDetail(str.guid, index);
        //           this.$emit("success", true);
        //         } else {
        //           this.$message.error(results.data.resultmessage);
        //         }
        //       });
        //     }
        //   } else {

        //   }
        // } else {
        //   let str = this.hawbInfo[index];
        //   Object.keys(str.hawbRSinfo[0]).forEach(i => {
        //     this.$set(str, i, str.hawbRSinfo[0][i]);
        //   });
        //   Object.keys(str.hawbRSinfo[1]).forEach(i => {
        //     this.$set(str, i, str.hawbRSinfo[1][i]);
        //   });

        //   this.hawbInfo[index] = str;
        // }
      },
      delHawbDetail(index) {

        // if (this.mawbdetail.pagetype != 12) {
        //   this.$confirm("确定删除此单号?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        //   })
        //     .then(() => {
        //       var json = {
        //         guid: this.guidHawbGroup[index].guid,
        //         boguid: this.mawbdetail.boguid,
        //         orderdom: this.mawbdetail.orderdom,
        //         isdel: "2",
        //         sid:  this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid,
        //         area: this.mawbdetail.area
        //       };
        //       if(this.pagetype == 3 ){
        //         delete json.boguid
        //       }
        //       let url=this.pagetype !=3?"api/ExAxpline":'api/ExAxplineHawbDocAmsSend'
        //       this.$axios({
        //         method: "delete",
        //         url: this.$store.state.webApi + url,
        //         data: json,
        //         loading: true,
        //         tip: false
        //       }).then(results => {

        //         if (results.data.resultstatus == 0) {
        //           this.hawbInfo = []; //先初始化数据
        //           this.cur_index = 0;
        //           this.getHawbNum();
        //           if(this.pagetype==3){
        //             this.hawbInfo.splice(index,1)
        //           }

        //           this.$emit("success", true);
        //         } else {
        //           this.$message.error(results.data.resultmessage);
        //         }
        //       });
        //     })
        //     .catch(() => {});
        // } else {
        //   this.hawbInfo.splice(index, 1);
        //   this.hawb_list.splice(index, 1);
        //   this.cur_index = 0;
        // }
      },
      addHawbList() {

        if (!this.newHawbAdd.hawb) {
          this.$message.error("请填写分运单号！");
          return;
        }

        this.hawbInfoData.push({
          chinesepm: "",
          englishpm: "",
          enpmextend: '',
          ismagnetic: '',
          hpoid: this.mawbInfo.guid,
          sid: '',
          guid: '',
          hawb: this.newHawbAdd.hawb,
          mdg: this.newHawbAdd.mdg,
          sfg: 'PVG',
          pm: '',
          chinesepm: '',
          pmdeclaration: '工作原理：\n构成：\n用途：',
          piece: '',
          weight: '',
          hawbtype: '2'
        })





        //  for (var i in hawbform) {
        //    var item = hawbform[i];


        //    if (!item.hawb) {
        //      this.$message.error("请填写分运单号！");
        //      return;
        //    }

        //    if (item.khjcno.length == 0&&this.mawbdetail.pagetype != 12) {
        //      item.ybpiece = 0;
        //      item.ybweight = 0;
        //      item.ybvolume = 0;
        //    }
        //    var ybstoreList = [];
        //    item.guid = -1;
        //    item.khjcno.forEach(element1 => {
        //      this.getNumberList.forEach(element2 => {
        //        if (element1 == element2.khjcno) {
        //          ybstoreList.push({ guid: element2.guid, isdel: 1 });
        //        }
        //      });
        //    });

        //    item.ybstoreList = ybstoreList;
        //    item.khjcno = item.khjcno.toString();
        //  }

        //  var json = {
        //    sid: this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid,
        //    boguid: this.mawbdetail.boguid,
        //    hawbList: hawbform,
        //    system: this.mawbdetail.system,
        //    area: this.mawbdetail.area
        //  };
        //  let url=this.pagetype !=3?"api/ExAxpline":'api/ExAxplineHawbDocAmsSend'
        // console.log(JSON.stringify(json));
        //  if (this.mawbdetail.pagetype != 12) {
        //    this.$axios({
        //      method: "post",
        //      url: this.$store.state.webApi + url,
        //      data: json,
        //      loading: true,
        //      tip: false
        //    }).then(results => {

        //      if (results.data.resultstatus == 0) {
        //        this.dialogFormVisible = false;
        //        this.hawbform = [

        //          this.initHawbform()
        //        ];
        //        this.getHawbNum();

        //        this.$emit("success", true);
        //      } else {
        //        this.$message.error(results.data.resultmessage);
        //      }
        //    });
        //  } else {
        //    let index = this.hawb_list.length;
        //    for (var i in hawbform) {
        //      let detail = hawbform[i];
        //      let hawbrsdata = [
        //        {
        //          title: "发货人",
        //          companytitle_fhr_hawb: this.mawbdetail.companytitle_fhr_mawb,
        //          address_fhr_hawb: this.mawbdetail.address_fhr_mawb,
        //          companycode_fhr_hawb: this.mawbdetail.companycode_fhr_mawb,
        //          state_fhr_hawb: this.mawbdetail.state_fhr_mawb,
        //          city_fhr_hawb: this.mawbdetail.city_fhr_mawb,
        //          postcode_fhr_hawb: this.mawbdetail.postcode_fhr_mawb,
        //          lxr_fhr_hawb: this.mawbdetail.lxr_fhr_mawb,
        //          phone_fhr_hawb: this.mawbdetail.phone_fhr_mawb,
        //          fax_fhr_hawb: this.mawbdetail.fax_fhr_mawb,
        //          email_fhr_hawb: this.mawbdetail.email_fhr_mawb,
        //          fdfhrId: "",
        //          jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
        //          model: ""
        //        },
        //        {
        //          title: "收货人",
        //          companytitle_shr_hawb: this.mawbdetail.companytitle_shr_mawb,
        //          address_shr_hawb: this.mawbdetail.address_shr_mawb,
        //          companycode_shr_hawb: this.mawbdetail.companycode_shr_mawb,
        //          state_shr_hawb: this.mawbdetail.state_shr_mawb,
        //          city_shr_hawb: this.mawbdetail.city_shr_mawb,
        //          postcode_shr_hawb: this.mawbdetail.postcode_shr_mawb,
        //          lxr_shr_hawb: this.mawbdetail.lxr_shr_mawb,
        //          phone_shr_hawb: this.mawbdetail.phone_shr_mawb,
        //          fax_shr_hawb: this.mawbdetail.fax_shr_mawb,
        //          email_shr_hawb: this.mawbdetail.email_shr_mawb,
        //          fdshrId: "",
        //          jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
        //          model: ""
        //        }
        //      ];
        //      hawbrsdata[0].jsonArr = {
        //        type: "2",
        //        mdg: detail.sfg,
        //        gid: this.mawbdetail.gid,
        //        codetype: 1
        //      };
        //      hawbrsdata[1].jsonArr = {
        //        type: "2",
        //        mdg: detail.mdg,
        //        gid: this.mawbdetail.gid,
        //        codetype: 2
        //      };

        //      detail.khjcnoArr = [];
        //      detail.hawbRSinfo = hawbrsdata;
        //      detail.chinesepm = this.mawbdetail.chinesepm;
        //      detail.taxcode_fhr_hawb = this.mawbdetail.taxcode_fhr_mawb;
        //      detail.taxcode_shr_hawb = this.mawbdetail.taxcode_shr_mawb;
        //      detail.ybpiece=detail.realpiece,
        //      detail.ybweight=detail.realweight,
        //      detail.ybvolume=detail.realvolume,

        //      this.$set(this.hawb_list, index + Number(i), detail.hawb);
        //      this.$set(this.hawbInfo, index + Number(i), detail);
        //    }

        //    this.hawbform = [

        //      this.initHawbform()
        //    ];
        //  }
      },

    },
    mounted() { },
    computed: {
      // hawbArr() {
      //   var arr = [];
      //   this.hawbTableData.map(item => {
      //     if (!item.khjcno) {
      //       arr.push({ label: item.hawb, value: item.hawb });
      //     }
      //   });
      //   return arr;
      // },
      cur_hawb() {
        if (this.hawbInfoData.length > 0) {
          return this.hawbInfoData[this.cur_index] && this.hawbInfoData[this.cur_index].hawb;
        }

      }
    },
    watch: {
      hawbActiveIndex: {
        handler(val) {
          this.cur_index = this.hawbActiveIndex||0
        }, immediate: true
      }

    },
    created() {

      this.newHawbAdd.mdg = this.mawbInfo.mdg
      //console.log(this.hawbActiveIndex)
      // if(this.hawbActiveIndex){
      // this.cur_index=this.hawbActiveIndex
      // }

    }
  };
</script>

<style lang="less" scoped>
  .detail-title {
    border-bottom: 1px solid #e8e8e8;
    height: 32px;
    line-height: 32px;
    text-indent: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #0f5a8c;
  }

  .mawbform {
    width: 100%;
    justify-content: flex-start;
    display: flex;
    margin-top: 10px;

    div {
      margin-right: 2px;
      flex: 1;
    }

    span {
      display: inline-block;
      min-width: 80px;
    }

    span:first-child {
      text-align: right;
    }

    span:last-child {
      text-align: left;
    }

    /deep/ input {
      min-width: 150px;
    }
  }

  @tabs-p: {
    position: relative;
    float: left;
    width: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 36px;
    text-align: left;
    text-indent: 12px;
    color: #999;
    border: 1px solid #e8e8e8;
    cursor: pointer;

    &.active {
      color: #0f5a8c;
      background: #fff;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #fff;
    }

    .icon-c {
      position: absolute;
      display: block;
      top: 11px;
      right: 8px;
      width: 12px;
      height: 12px;
      z-index: 1;

      &:hover {
        i {
          visibility: visible;
        }

        span {
          visibility: hidden;
        }
      }

      i {
        position: absolute;
        top: 1px;
        left: 1px;
        text-indent: 0;
        width: 12px;
        height: 12px;
        visibility: hidden;

        &:before {
          position: absolute;
          top: 0;
          font-size: 12px;
        }
      }

      span {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        background: #e8e8e8;
        border-radius: 50%;
      }
    }
  }

  ;

  .hawbTabs {
    position: relative;
    width: 100%;

    .tabs-header {
      position: relative;
      z-index: 500;
      width: 100%;
      height: 37px;
      overflow: hidden;
      background: #f8f8f8;
      border: 1px solid #e8e8e8;
      border-bottom: 0px;

      .left-title {
        height: 36px;
        line-height: 36px;
        padding-left: 12px;
        font-size: 14px;
        color: #0f5a8c;
        font-weight: bolder;
        border-bottom: 1px solid #e8e8e8;
      }

      .header-c {
        position: absolute;
        padding: 0 140px 0 0;
        transition: top 0.5s;
        // left: 100px;
        left: 0px;

        p {
          @tabs-p();
          border-top: 0;
          // border-right: 0;
        }
      }

      .add-hawb,
      .expansion-hawb {
        position: absolute;
        top: 4px;
        padding: 0;
        height: 28px;
        color: #0f5a8c;
      }

      .add-hawb {
        right: 36px;
        width: 80px;
      }

      .expansion-hawb {
        right: 4px;
        width: 28px;

        /deep/ .el-icon-arrow-down {
          transition: all 0.5s;
        }
      }

      .icon-rotate {
        /deep/ .el-icon-arrow-down {
          transform: rotate(180deg);
        }
      }

      .tabs-right-mask {
        position: absolute;
        top: 0;
        right: 130px;
        width: 44px;
        height: 36px;
        background: url("../../../boStatic/images/mask.png") no-repeat 0 0;
      }
    }

    .hide-tabs {
      position: absolute;
      overflow: hidden;
      z-index: 400;
      border: 1px solid #e8e8e8;
      top: 36px;
      // left: 101px;
      left: 1px;
      right: 5px;
      background: #fff;
      padding: 12px 12px 0;
      transition: all 0.5s;

      p {
        @tabs-p();
        margin-right: 12px;
        margin-bottom: 12px;
      }

      p.active {
        border-color: #0f5a8c;
      }
    }

    .hide-tabs:not(.show) {
      height: 0px !important;
      top: 0px;
    }

    .tabs-content {
      border: 1px solid #e8e8e8;
      border-top: 0px;
      padding: 12px;
    }
  }
</style>