<template>
  <div>
    <!-- {{hawbPosition}} -->
    <!-- {{getNumberList}} -->
    <!-- {{hawbPosition}}
    {{cur_index}}-->
    <!-- {{mawbdetail}} -->
    <!-- {{cacheTabs}} -->
    <!-- {{guidHawbGroup}} -->
    <!-- {{pagetype}}
{{cur_index}} -->
    <!-- {{hawbInfo}} -->
    <!-- {{this.mawbdetail.pagetype}} -->
    <!-- {{hawbform}} -->
    <!-- {{showtabtitle}} -->
    <el-collapse-transition>
      <div v-if="showtabtitle">
        <el-form style="padding-bottom:12px;border:1px solid #e8e8e8;border-radius:4px;margin-bottom:15px"
          v-if="pagetype==1||(pagetype==3)">
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

          <!-- {{mawbdetail}} -->
          <template v-for="(item,index) in hawbform">
            <div class="mawbform" v-enterfocus="confirmAddHawb" style="width:1100px;">
              <div>
                <span style="text-indent:16px;">分单号：</span>
                <span>
                  <el-input v-model.trim="item.hawb" @change="hawbFormat" :maxlength="mawbdetail.pagetype==12?12:''"
                    clearable></el-input>
                </span>

                <!-- <el-select
                      v-model="item.hawb"
                      filterable
                      allow-create
                      default-first-option
                      @blur="hawbBlur($event,index)"
                        >
                      <el-option
                        v-for="item in hawbArr"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                        >
                      </el-option>
                </el-select>-->
              </div>

              <div v-if="pagetype!=3">
                <span>进仓编号：</span>
                <span>
                  <el-select placeholder="请选择" multiple v-model="item.khjcno" @change="hawbSelFunc($event,index)"
                    size="mini">
                    <li>
                      <span style="float: left;margin-left:20px;">进仓编号</span>
                      <span style="float: right;margin-right:30px;">
                        <i class="imul">件</i>/
                        <i class="imul">重</i>/
                        <i class="imul">体</i>
                      </span>
                    </li>
                    <el-option v-for="numitem in getNumberList" :key="numitem.khjcno" :label="numitem.khjcno"
                      :value="numitem.khjcno" style="width:300px;" v-if="!selOptionShow(numitem.khjcno,index)">
                      <span style="float: left">{{ numitem.khjcno }}</span>
                      <span style="float: right;margin-right:10px;">
                        <i class="imul">{{ numitem.piece }}</i>/
                        <i class="imul">{{ numitem.weight }}</i>/
                        <i class="imul">{{ numitem.volume }}</i>
                      </span>
                    </el-option>
                  </el-select>
                </span>
              </div>


              <div v-if="pagetype==3">
                <span>分单始发港：</span>
                <span>
                  <el-input v-model.trim="item.sfg" clearable></el-input>
                </span>
              </div>

              <div>
                <span>分单目的港：</span>
                <span>
                  <el-input v-model.trim="item.mdg" clearable v-verify="'sfgmdg'"></el-input>
                </span>
              </div>
              <div style="text-align:left;flex:0 0 100px"></div>
            </div>

            <div class="mawbform" style="width:1100px;" v-if="mawbdetail.iscomboine==1">
              <my-select title="订单号 : " :options="ponoList" v-model="item.pono"
                titlestyle="padding-right:5px;width:85px;" selstyle="width:188px;margin-left:4px"></my-select>

            </div>

            <div class="mawbform" style="width:1100px;" v-if="pagetype==3">
              <div>
                <span>制单件数：</span>
                <span>
                  <el-input v-verify="'integer'" v-model.trim="item.zdpiece" clearable></el-input>
                </span>
              </div>
              <div>
                <span>制单重量：</span>
                <span>
                  <el-input v-verify="'fixedTwo'" v-model.trim="item.zdweight" clearable></el-input>
                </span>
              </div>
              <div>
                <span>制单体积：</span>
                <span>
                  <el-input v-verify="'fixedThree'" v-model.trim="item.zdvolume" clearable></el-input>
                </span>
              </div>
              <div style="text-align:left;flex:0 0 100px">
                <span style="text-align:left;margin-left:10px;">
                  <i @click="hawbformDel(index)"
                    style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;"
                    :style="{color:index!=0?'red':'#67C23A'}" :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                    :title="index!=0?'删除此条':'新增一条'"></i>
                </span>
              </div>
            </div>

            <div class="mawbform" style="width:1100px;" v-if="pagetype!=3">
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
                <span style="text-align:left;margin-left:10px;">
                  <i @click="hawbformDel(index)"
                    style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;"
                    :style="{color:index!=0?'red':'#67C23A'}" :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                    :title="index!=0?'删除此条':'新增一条'"></i>
                </span>
              </div>
            </div>
          </template>
          <div style="margin-top:15px;margin-left:15px">
            <el-button type="primary" @click="addhawb">确 定</el-button>
            <el-button @click="resethawb">取 消</el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-transition>

    <div class="hawbTabs">
      <div class="tabs-header" v-show="showtabtitle">
        <div class="left-title">
          <!-- 分单信息： -->
        </div>
        <div class="header-c" :style="{'top': `-${Math.floor(cur_index / 8) * 37}px`}">
          <p v-for="(hawb, index) in hawb_list" :title="hawb" :key="hawb" :class="{'active': cur_hawb == hawb}"
            @click.self="togglehawb(hawb, index)" :style="[{width:pagetype==3?'170px':'150px'},pageTitleStyle[index]]">
            {{ hawb }}
            <i @click="togglehawb(hawb, index)" style="color:#0F5A8C;font-size: 16px;font-weight:500"
              :class="iconClass(guidHawbGroup.filter(i=>i.hawb==hawb)[0].sendstatus)"
              v-if="pagetype==3&&guidHawbGroup.filter(i=>i.hawb==hawb).length>0"></i>
            <span class="icon-c" v-if="pagetype!=2">
              <span class="icon-close-mask"></span>
              <i @click="delHawbDetail(index)" class="el-icon-close"></i>
            </span>
          </p>
        </div>
        <i class="tabs-right-mask"></i>
        <!-- <el-button class="add-hawb" @click.native="dialogFormVisible = true" v-if="pagetype==1">添加分单</el-button> -->
        <el-button class="add-hawb" @click="getHawbNum" v-if="pagetype==2" title="修改分单数据后请点击此按钮以同步更新分单制单信息">刷新数据
        </el-button>
        <el-button :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]" @click="show_tabs"
          icon="el-icon-arrow-down"></el-button>
      </div>
      <div ref="hide_tabs" @blur="tabs_blur" v-show="showtabtitle" :class="['hide-tabs', {'show': show_all_hawb}]"
        :style="{'height': `${Math.ceil(hawb_list.length / 7) * 50 + 14}px`}" tabindex="0">
        <p v-for="(hawb, index) in hawb_list" :title="hawb" :key="hawb" :class="{'active': cur_hawb == hawb}"
          @click.self="togglehawb(hawb, index)">
          {{ hawb }}
          <i @click="togglehawb(hawb, index)" style="color:#0F5A8C;font-size: 16px;font-weight:500"
            :class="iconClass(guidHawbGroup.filter(i=>i.hawb==hawb)[0].sendstatus)"
            v-if="pagetype==3&&guidHawbGroup.filter(i=>i.hawb==hawb).length>0"></i>
          <span class="icon-c" v-if="pagetype!=2">
            <span class="icon-close-mask"></span>
            <i @click="delHawbDetail(index)" class="el-icon-close"></i>
          </span>
        </p>
      </div>


      <div class="tabs-content" style="position:relative">
        <div v-if="pagetype==1||pagetype==2">

          <!-- {{hawbInfo}} -->
          <keep-alive>
            <template v-for="(item,index) in hawbInfo">
              <hawbInfoOper :hawbdata.sync="item" :key="index" :pagetype="pagetype" v-if="cur_index==index"
                :orderdom="mawbdetail.orderdom" :mawbinfo="mawbdetail" :saveNumberList="getNumberList" :ref="item.hawb" 
                :isPaper="isPaper"
                :bottomFixed="bottomFixed"
                :needLimit="needLimit"
                :afreshRateCharge="afreshRateCharge"
                @success="$emit('success')"
                :is-order-confirm="isOrderConfirm"
                :is-confirm="isConfirm"
                :active-name="activeName"
                >
              </hawbInfoOper>
            </template>
          </keep-alive>
          <el-button style="position:absolute;top:14px;right:16px" type="primary" @click="upHawbDetail"
            v-if="hawbInfo.length>0&&!nosave&&mawbdetail.pagetype!=12">保存分单信息</el-button>
          <el-button style="position:absolute;top:14px;right:250px" type="primary" v-if="pageFrom"
            @click="upHawbDetail('1')"
            :disabled="(pageFrom=='order'&&hawbTableData[cur_index].dzstatus>=120)||(pageFrom=='document'&&hawbTableData[cur_index].dzstatus>=150)">
            分单确认</el-button>
          <el-button style="position:absolute;top:14px;right:150px" type="primary" v-if="pageFrom"
            @click="upHawbDetail('2')"
            :disabled="(pageFrom=='order'&&hawbTableData[cur_index].dzstatus<120)||(pageFrom=='document'&&hawbTableData[cur_index].dzstatus<150)">
            取消确认</el-button>
        </div>
        <div v-if="pagetype==3">
          <!-- {{hawbInfo}} -->
          <!-- {{}} -->
          <!-- {{cur_index}} -->
          <!-- <keep-alive> -->
          <template v-for="(item,index) in guidHawbGroup" v-if="guidHawbGroup.length>0">
            <!-- <span v-if="cur_index==index">{{guidHawbGroup}}</span> -->
            <makingBillAms :key="index" v-if="cacheTabs.includes(index)" v-show="cur_index==index" :mawbguid="item.guid"
              :sid="item.sid" style="border:1px solid #e8e8e8" orderdom="分单" :mawbinfo="item" @saveSuccess="saveSuccess"
              isams></makingBillAms>
          </template>
          <!-- </keep-alive> -->
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import hawbInfoOper from "./hawbInfoOper";
  import makingBillAms from "./makingBillAms";
  import { getValByGrouid, setTabTitleStyle } from "@/api/localStorage"

  export default {
    props: {
      mawbdetail: Object,
      saveNumberList: Array,
      orderFinish: {
        type: Boolean,
        default: false
      },
      pagetype: [Number, String], //1 显示分单基本信息 2,显示制单 3 ams分单制单
      hawbTableData: Array,
      nosave: Number,//若传真值不显示保存按钮
      showtabtitle: {//是否显示tab,默认显示
        type: Boolean,
        default: true
      },
      pageFrom: String,
      hawbPosition: {
        //定位选择的分单
        type: String,
        default: ""
      },
      isPaper: {
      type: Boolean,
      default: false,
    },
      bottomFixed: {
        type: Boolean,
        default: false,
      },
      needLimit: {
        type: Boolean,
        default: false,
      },
      afreshRateCharge:{//是否需要刷新mingbill里面的内容
                type:Boolean,
                default:false
            },
             isOrderConfirm: {
        type: Boolean,
        default: false,
      },
      isConfirm: {
        type: Boolean,
        default: false,
      },
      activeName: { // 当前激活tab
        type: String,
        default: ''
        }
    },
    components: { hawbInfoOper, makingBillAms },
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
        // hawbRSinfo: [
        //   [
        //     //分单收发货人，注意每个分单都有单独的收发货人
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
        //   ]
        // ],
        cusGuid: "",
        cacheTabs: [0],
        ponoList: []//外站新增分单需要绑定订舱编号
      };
    },

    methods: {
      iconClass(status) {
        if (status == '10') {
          return 'el-icon-check'
        }
        if (status == '0') {
          return 'el-icon-close'
        }
        if (status == '5') {
          return 'el-icon-edit'
        }
      },
      saveSuccess(id) {
        this.guidHawbGroup[this.cur_index].guid = id
      },
      getStatus(val) {
        return getValByGrouid(146, val)
      },
      hawbBlur(ev, index) {
        var val = ev.target.value;
        if (val) {
          // this.changeSelect(ev.target.value)
          var r = /^[^\u4e00-\u9fa5]+$/;
          if (!r.test(val)) {
            this.$message.error("分运单号不能包含中文！");
            return;
          }

          this.hawbform[index].hawb = val;
        }
      },
      resethawb() {
        this.hawbform = [
          //第一个分单的件重体应该默认全部件重体
          this.initHawbform()
        ];
      },
      hawbFormat(val) {
        var r = /^[^\u4e00-\u9fa5]+$/;
        if (val && !r.test(val)) {
          this.$message.error("分运单号不能包含中文！");
          return;
        }
      },
      initHawbform() {
        var obj = {
          hawb: "",
          khjcno: [],
          ybpiece: "",
          ybweight: "",
          ybvolume: "",
          realpiece: "",
          realweight: "",
          realvolume: "",
          zdpiece: "",
          zdweight: "",
          zdvolume: "",
          mdg: "",
          sfg: "",
          pono: ''
        };
        obj.mdg = this.mawbdetail.mdg;
        obj.sfg = this.mawbdetail.sfg;
        return obj;
      },
      fetch_hawb_data() {
        var obj = {
          declaration: {
            title: "报关类型",
            model: "",
            defaultModel: "",
            options: [],
            groupid: 19,
            declareList: [
              {
                bgdh: "YSSHA18001001",
                piece: "",
                weight: "",
                lds: "0",
                bggys: "",
                jdzsData: [{ jdzsbh: "", ypmc: "", sjdw: "", scdw: "" }],
                modelId: ""
              }
            ],
            jsonArr: {
              type: "all",
              comxz: "1",
              system: "",
              area: "",
              timestamp: "0"
            },
            id: "bglx"
          },
        };
        return obj;
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
        index = (index || index == 0) ? index : (this.hawb_list.indexOf(this.hawbPosition) || 0)
        if (!this.cacheTabs.includes(index)) {
          this.cacheTabs.push(index)
        }
        if (this.pagetype == 1) {
          this.upHawbDetail().then(res => {
            if (res) {
              this.cur_index = index;
              if (!this.hawbInfo[index]) {
                //如果值不存在，再去取;
                this.getHawbDetail(this.guidHawbGroup[index] && this.guidHawbGroup[index].guid, index);
              }
            }

          });
        } else {
          this.cur_index = index;
          // alert(index)
          // this.show_all_hawb = false
          // this.$refs.hide_tabs.blur()
          if (!this.hawbInfo[index]) {
            //如果值不存在，再去取;
            this.getHawbDetail(this.guidHawbGroup[index] && this.guidHawbGroup[index].guid, index);
          }
        }

      },
      removehawb(index) {
        //删除当前分单号
        this.delHawbDetail(index);
      },
      confirmAddHawb() {
        //新增表单分单
        this.hawbform.push(this.initHawbform());
      },
      hawbSelFunc(val, index) {
        //选中进仓编号
        var piece = 0;
        var weight = 0;
        var volume = 0;
        val.forEach(item => {
          this.getNumberList.forEach(element => {
            if (item == element.khjcno) {
              piece += Number(element.piece);
              weight += Number(element.weight);
              volume += Number(element.volume);
            }
          });
        });

        this.hawbform[index].realpiece = piece;
        this.hawbform[index].realweight = Number(weight).toFixed(2);
        this.hawbform[index].realvolume = Number(volume).toFixed(3);
        this.hawbform[index].ybpiece = piece;
        this.hawbform[index].ybweight = Number(weight).toFixed(2);
        this.hawbform[index].ybvolume = Number(volume).toFixed(3);
      },
      selOptionShow(khjcno, index) {
        //判断进仓编号是否已经使用
        var isUse = false;
        this.hawbform.forEach((item, key) => {
          if (item.khjcno.length > 0) {
            item.khjcno.forEach(el => {
              if (khjcno == el && key != index) {
                isUse = true;
              }
            });
          }
        });
        this.getNumberList.forEach(el => {
          if (el.khjcno == khjcno && el.status) {
            isUse = true;
          }
        });

        return isUse;
      },
      hawbformDel(index) {
        //删除表单分单
        if (index == 0) {
          this.confirmAddHawb();
        } else {
          this.hawbform.splice(index, 1);
        }
      },
      getHawbNum() {
        //  alert(this.mawbdetail.pagetype)
        if (this.mawbdetail.pagetype != 12) {
          this.guidHawbGroup = [];
          this.cacheTabs = []
          this.hawbInfo = [];
          //获取分单号

          // if (this.pagetype != 3) {
          let json = {
            hpoidHawbGroup:
              this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid
          };
          /*  if(this.mawbdetail.customstatus!=1){
           json={hpoidCustomList:this.pagetype!=3?this.mawbdetail.guid:this.mawbdetail.sid}
         } */
          let url = this.pagetype != 3 ? "api/ExAxpline" : 'api/ExHpoAxplineMawbDocAmsSend'
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + url,
            params: json,
            loading: true,
            tip: false
          }).then(results => {
            // console.log("分单号")
            // console.log(JSON.stringify(results))
            this.getHawbList(results.data);
          });
          // } else {
          //   this.getHawbList(this.mawbdetail.hawbgrouplist);
          // }
        } else {
          //this.mawbdetail.customstatus!=1?2:1
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/ExhpoAxpline",
            params: {
              boguid: this.mawbdetail.boguid,
              ImportType: this.mawbdetail.customstatus != 1 ? 2 : 1
            },
            loading: true,
            tip: false
          }).then(results => {
            var hawbInfo = results.data.resultdic.axplist;
            let hawb_list = [];

            for (let i in hawbInfo) {
              let detail = hawbInfo[i];
              hawb_list.push(detail.hawb);

              //  let hawbrsdata = [
              /*          {
                         title: "发货人",
                         companytitle_fhr_hawb: "",
                         address_fhr_hawb: "",
                         companycode_fhr_hawb: "",
                         state_fhr_hawb: "",
                         city_fhr_hawb: "",
                         postcode_fhr_hawb: "",
                         lxr_fhr_hawb: "",
                         phone_fhr_hawb: "",
                         fax_fhr_hawb: "",
                         email_fhr_hawb: "",
                         fdfhrId: "",
                         jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
                         model: ""
                       },
                       {
                         title: "收货人",
                         companytitle_shr_hawb: "",
                         address_shr_hawb: "",
                         companycode_shr_hawb: "",
                         state_shr_hawb: "",
                         city_shr_hawb: "",
                         postcode_shr_hawb: "",
                         lxr_shr_hawb: "",
                         phone_shr_hawb: "",
                         fax_shr_hawb: "",
                         email_shr_hawb: "",
                         fdshrId: "",
                         jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
                         model: ""
                       } */
              //     {
              //   title: "发货人",
              //   companytitle_fhr_hawb: detail.companytitle_fhr_hawb||this.mawbdetail.companytitle_fhr_mawb,
              //   address_fhr_hawb: detail.address_fhr_hawb||this.mawbdetail.address_fhr_mawb,
              //   companycode_fhr_hawb: detail.companycode_fhr_hawb||this.mawbdetail.companycode_fhr_mawb,
              //   state_fhr_hawb: detail.state_fhr_hawb||this.mawbdetail.state_fhr_mawb,
              //   city_fhr_hawb: detail.city_fhr_hawb||this.mawbdetail.city_fhr_mawb,
              //   postcode_fhr_hawb: detail.postcode_fhr_hawb||this.mawbdetail.postcode_fhr_mawb,
              //   lxr_fhr_hawb:detail.lxr_fhr_hawb|| this.mawbdetail.lxr_fhr_mawb,
              //   phone_fhr_hawb:detail.phone_fhr_hawb|| this.mawbdetail.phone_fhr_mawb,
              //   fax_fhr_hawb: detail.fax_fhr_hawb||this.mawbdetail.fax_fhr_mawb,
              //   email_fhr_hawb: detail.email_fhr_hawb||this.mawbdetail.email_fhr_mawb,
              //   fdfhrId: "",
              //   jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
              //   model: ""
              // },
              // {
              //   title: "收货人",
              //   companytitle_shr_hawb: detail.companytitle_shr_hawb||this.mawbdetail.companytitle_shr_mawb,
              //   address_shr_hawb: detail.address_shr_hawb|| this.mawbdetail.address_shr_mawb,
              //   companycode_shr_hawb: detail.companycode_shr_hawb|| this.mawbdetail.companycode_shr_mawb,
              //   state_shr_hawb: detail.state_shr_hawb|| this.mawbdetail.state_shr_mawb,
              //   city_shr_hawb: detail.city_shr_hawb|| this.mawbdetail.city_shr_mawb,
              //   postcode_shr_hawb: detail.postcode_shr_hawb|| this.mawbdetail.postcode_shr_mawb,
              //   lxr_shr_hawb: detail.lxr_shr_hawb|| this.mawbdetail.lxr_shr_mawb,
              //   phone_shr_hawb: detail.phone_shr_hawb||this.mawbdetail.phone_shr_mawb,
              //   fax_shr_hawb: detail.fax_shr_hawb|| this.mawbdetail.fax_shr_mawb,
              //   email_shr_hawb: detail.email_shr_hawb|| this.mawbdetail.email_shr_mawb,
              //   fdshrId: "",
              //   jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
              //   model: ""
              // }
              // ];
              // hawbrsdata[0].jsonArr = {
              //   type: "2",
              //   mdg: this.mawbdetail.sfg,
              //   gid: this.mawbdetail.gid,
              //   codetype: 1
              // };
              // hawbrsdata[1].jsonArr = {
              //   type: "2",
              //   mdg: this.mawbdetail.mdg,
              //   gid: this.mawbdetail.gid,
              //   codetype: 2
              // };
              // hawbrsdata.forEach(item => {
              //   Object.keys(item).forEach(key => {
              //     //  //console.log(key)
              //     if (detail[key]) {
              //       item[key] = detail[key];
              //     }
              //   });
              // });
              detail.khjcnoArr = [];
              // detail.hawbRSinfo = hawbrsdata;
              detail.companytitle_fhr_hawb = detail.companytitle_fhr_hawb || this.mawbdetail.companytitle_fhr_mawb,
                detail.address_fhr_hawb = detail.address_fhr_hawb || this.mawbdetail.address_fhr_mawb,
                detail.companycode_fhr_hawb = detail.companycode_fhr_hawb || this.mawbdetail.companycode_fhr_mawb,
                detail.state_fhr_hawb = detail.state_fhr_hawb || this.mawbdetail.state_fhr_mawb,
                detail.city_fhr_hawb = detail.city_fhr_hawb || this.mawbdetail.city_fhr_mawb,
                detail.postcode_fhr_hawb = detail.postcode_fhr_hawb || this.mawbdetail.postcode_fhr_mawb,
                detail.lxr_fhr_hawb = detail.lxr_fhr_hawb || this.mawbdetail.lxr_fhr_mawb,
                detail.phone_fhr_hawb = detail.phone_fhr_hawb || this.mawbdetail.phone_fhr_mawb,
                detail.fax_fhr_hawb = detail.fax_fhr_hawb || this.mawbdetail.fax_fhr_mawb,
                detail.email_fhr_hawb = detail.email_fhr_hawb || this.mawbdetail.email_fhr_mawb,
                detail.companytitle_shr_hawb = detail.companytitle_shr_hawb || this.mawbdetail.companytitle_shr_mawb,
                detail.address_shr_hawb = detail.address_shr_hawb || this.mawbdetail.address_shr_mawb,
                detail.companycode_shr_hawb = detail.companycode_shr_hawb || this.mawbdetail.companycode_shr_mawb,
                detail.state_shr_hawb = detail.state_shr_hawb || this.mawbdetail.state_shr_mawb,
                detail.city_shr_hawb = detail.city_shr_hawb || this.mawbdetail.city_shr_mawb,
                detail.postcode_shr_hawb = detail.postcode_shr_hawb || this.mawbdetail.postcode_shr_mawb,
                detail.lxr_shr_hawb = detail.lxr_shr_hawb || this.mawbdetail.lxr_shr_mawb,
                detail.phone_shr_hawb = detail.phone_shr_hawb || this.mawbdetail.phone_shr_mawb,
                detail.fax_shr_hawb = detail.fax_shr_hawb || this.mawbdetail.fax_shr_mawb,
                detail.email_shr_hawb = detail.email_shr_hawb || this.mawbdetail.email_shr_mawb,
                detail.taxcode_fhr_hawb = detail.taxcode_fhr_hawb || this.mawbdetail.taxcode_fhr_mawb;
              detail.taxcode_shr_hawb = detail.taxcode_shr_hawb || this.mawbdetail.taxcode_shr_mawb;
            }
            this.hawb_list = hawb_list;
            this.hawbInfo = hawbInfo;
            this.cusGuid = results.data.resultdic.cusGuid;
            this.cur_index = 0;
          });
        }
      },
      getHawbList(data) {
        this.guidHawbGroup = data;
        this.hawb_list = this.guidHawbGroup.map(function (item) {
          return item.hawb;
        });

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

        if (this.guidHawbGroup[0]) {
          //如果存在分单。默认先取第一个的值
          this.cacheTabs = [0]
          this.getHawbDetail(this.guidHawbGroup[0].guid, 0);
        }
        this.cur_index = this.hawbPosition
          ? this.hawb_list.indexOf(this.hawbPosition)
          : 0;
        this.cacheTabs = [this.cur_index]
      },
      getPonoList() {
        //获取订单号列表
        if (this.mawbdetail.iscomboine == 1) {
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/getHpoAndAxpline",
            params: { boguid: this.mawbdetail.boguid },
            loading: true,
            tip: false,
            nofield: true
          }).then(results => {
            console.log("订单列表confirm" + this.dom);
            // console.log(results);
            this.ponoListOriginal = results.data;
            this.ponoList = results.data.map(i => {
              return { label: i.pono, value: i.pono };
            });
            //console.log(this.ponoList);
          });
        }
      },
      getHawbDetail(hawbguid, index) {
        if (this.pagetype == 3) return;
        //获取分单详细
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxpline",
          params: { guid: hawbguid },
          loading: true,
          tip: false
        }).then(results => {
          console.log("分单详细");
          console.log(JSON.stringify(results.data));

          // var hawbrsdata = this.hawbRSinfo[index];
          var hawbDetail = results.data;
          hawbDetail.hwxz = this.mawbdetail.hwxz;
          // hawbDetail.hwlx=this.mawbdetail.hwlx
          // hawbDetail.batterymodel=this.mawbdetail.batterymodel
          // hawbDetail.sfg=this.mawbdetail.sfg
          hawbDetail.gid = this.mawbdetail.gid;

          // hawbrsdata.forEach(item => {
          //   Object.keys(item).forEach(key => {
          //     //  //console.log(key)
          //     if (hawbDetail[key]) {
          //       item[key] = hawbDetail[key];
          //     }
          //   });
          // });
          // hawbrsdata[0].jsonArr = {
          //   type: "2",
          //   mdg: hawbDetail.sfg,
          //   gid: hawbDetail.gid,
          //   codetype: 1
          // };
          // hawbrsdata[1].jsonArr = {
          //   type: "2",
          //   mdg: hawbDetail.mdg,
          //   gid: hawbDetail.gid,
          //   codetype: 2
          // };

          // hawbDetail.hawbRSinfo = hawbrsdata;
          hawbDetail.newYbstoreList = [];
          hawbDetail.khjcnoArr = hawbDetail.ybstoreList.map(i => i.khjcno);

          this.$set(this.hawb_list, index, hawbDetail.hawb);
          this.cur_index = index;

          this.$set(this.hawbInfo, index, hawbDetail);
          this.backupsHawbInfo[index] = JSON.stringify(hawbDetail);
        });
      },

      ifmodified(json1, json2) {
        delete json1.newYbstoreList;
        delete json1.khjcnoArr;
        // delete json1.hawbRSinfo[0].jsonArr;
        // delete json1.hawbRSinfo[1].jsonArr;
        delete json1.khjcno;
        delete json1.exForm;

        delete json2.newYbstoreList;
        delete json2.khjcnoArr;
        // delete json2.hawbRSinfo[0].jsonArr;
        // delete json2.hawbRSinfo[1].jsonArr;
        delete json2.khjcno;
        delete json1.exForm;

        console.log(JSON.stringify(json1));
        console.log(JSON.stringify(json2));
        console.log(JSON.stringify(json1) == JSON.stringify(json2));
        return JSON.stringify(json1) == JSON.stringify(json2);
      },
      async upHawbDetail(type) {
        //修改分单信息  //type: 1(分单确认)  2(分单取消确认)
        var index = this.cur_index;
        if (!this.hawbInfo[index]) {
          return;
        }
        if (this.mawbdetail.pagetype != 12) {
          let newJson = JSON.parse(JSON.stringify(this.hawbInfo[index]));
          if (newJson) {
            newJson.realpiece = Number(newJson.realpiece || 0);
            newJson.realweight = Number(newJson.realweight || 0);
            newJson.realvolume = Number(newJson.realvolume || 0);
            newJson.ybpiece = Number(newJson.ybpiece || 0);
            newJson.ybweight = Number(newJson.ybweight || 0);
            newJson.ybvolume = Number(newJson.ybvolume || 0);
            newJson.zdpiece = Number(newJson.zdpiece || 0);
            newJson.zdweight = Number(newJson.zdweight || 0);
            newJson.zdvolume = Number(newJson.zdvolume || 0);
            newJson.smallpiece = Number(newJson.smallpiece || 0);
            newJson.jfweight = Number(newJson.jfweight || 0);
            if (!newJson.hwlx) {
              this.$message.error("请填写货物类型！");
              return;
            }

            if (this.$refs[newJson.hawb] && this.$refs[newJson.hawb][0].checkHasLimit()) {
              this.$message.error(`请检查分单${newJson.hawb}的收发货人是否超出字符限制！`);
              return;
            }
            let oldhawbinfo = JSON.parse(this.backupsHawbInfo[index])

            if (
              (!this.ifmodified(
                newJson,
                oldhawbinfo
              ) &&
                !type) ||
              type
            ) {
              let str = JSON.parse(JSON.stringify(this.hawbInfo[index]));
              delete str.realpiece;
              delete str.realweight;
              delete str.realvolume;
              delete str.ybstoreList;
              delete str.exForm;
              str.sid = this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid;
              if (this.pagetype != 3) {
                str.boguid = this.mawbdetail.boguid;
              }
              // console.log(11111111111)
              // console.log(str.hawbRSinfo)
              // str = Object.assign({}, str, str.hawbRSinfo[0], str.hawbRSinfo[1]);
              str = Object.assign({}, str);
              str.area = this.mawbdetail.area;
              str.ybstoreList = str.newYbstoreList;

              delete str.title;
              delete str.jsonArr;
              delete str.model;

              if (type == "1") {
                if (!str.ybpiece || !str.ybweight || !str.ybvolume) {
                  this.$message.error("请补充预报件重体信息");
                  return false;
                }
                if (
                  !str.address_shr_hawb ||
                  !str.city_shr_hawb ||
                  !str.companycode_shr_hawb ||
                  !str.companytitle_shr_hawb
                ) {
                  this.$message.error("请补充分单收货人信息");
                  return false;
                }
                if (
                  !str.address_fhr_hawb ||
                  !str.city_fhr_hawb ||
                  !str.companycode_fhr_hawb ||
                  !str.companytitle_fhr_hawb
                ) {
                  this.$message.error("请补充分单发货人信息");
                  return false;
                }
                this.pageFrom == "order"
                  ? (str.dzstatus = "120")
                  : (str.dzstatus = "150");
              } else if (type == "2") {
                this.pageFrom == "order"
                  ? (str.dzstatus = "100")
                  : (str.dzstatus = "1");
              }

              //console.log('新分单数据')
              console.log(JSON.stringify(str));

              await this.$axios({
                method: "put",
                url: this.$store.state.webApi + "api/ExAxpline",
                data: str,
                loading: true,
                tip: false
              }).then(results => {
                //console.log("分单信息修改")
                if (results.data.resultstatus == 0) {
                  layer.msg("修改成功");
                  //重置本地数据备份
                  // this.backupsHawbInfo[index]=JSON.stringify(newJson)
                  // this.getHawbNum()
                  this.getHawbDetail(str.guid, index);
                  if (oldhawbinfo.smallpiece != this.hawbInfo[index].smallpiece) {//如果修改过小件数
                    this.setMawbSmallpiece()
                  }
                  this.$emit("success", true);
                  return true
                } else {
                  this.$message.error(results.data.resultmessage);
                  return false
                }
              });
            }
          } else {
            // alert("无修改")
          }
        } else {
          let str = this.hawbInfo[index];
          // Object.keys(str.hawbRSinfo[0]).forEach(i => {
          //   this.$set(str, i, str.hawbRSinfo[0][i]);
          // });
          // Object.keys(str.hawbRSinfo[1]).forEach(i => {
          //   this.$set(str, i, str.hawbRSinfo[1][i]);
          // });

          this.hawbInfo[index] = str;
        }
        return true
      },

      setMawbSmallpiece() {
        let smallpiece = this.hawbInfo.reduce((prev, i) => { return prev += Number(i.smallpiece || 0) }, 0)
        let data = { guid: this.mawbdetail.guid, smallpiece }
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExHpoAxplineShipaceUpdateBill",
          data: data,
          tip: false
        })
          .then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.mawbdetail.smallpiece = smallpiece
            } else {
              this.$message.error(results.data.resultmessage);
            }
          })
      },
      delHawbDetail(index) {
        // if(this.mawbdetail.mawb){
        //   this.$message.error('总运单已配，无法删除！');return
        // }
        if (this.mawbdetail.pagetype != 12) {
          this.$confirm("确定删除此单号?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              var json = {
                guid: this.guidHawbGroup[index].guid,
                boguid: this.mawbdetail.boguid,
                orderdom: this.mawbdetail.orderdom,
                isdel: "2",
                sid: this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid,
                area: this.mawbdetail.area
              };
              if (this.pagetype == 3) {
                delete json.boguid
              }
              let url = this.pagetype != 3 ? "api/ExAxpline" : 'api/ExAxplineHawbDocAmsSend'
              this.$axios({
                method: "delete",
                url: this.$store.state.webApi + url,
                data: json,
                loading: true,
                tip: false
              }).then(results => {
                //console.log("删除分单详细")
                //console.log(JSON.stringify(results.data))
                if (results.data.resultstatus == 0) {
                  this.hawbInfo = []; //先初始化数据
                  this.cur_index = 0;
                  this.getHawbNum();
                  if (this.pagetype == 3) {
                    this.hawbInfo.splice(index, 1)
                  }
                  //this.hawb_list.splice(index,1)
                  //this.$parent.getHawbNum()
                  this.$emit("success", true);
                } else {
                  this.$message.error(results.data.resultmessage);
                }
              });
            })
            .catch(() => { });
        } else {
          this.hawbInfo.splice(index, 1);
          this.hawb_list.splice(index, 1);
          this.cur_index = 0;
        }
      },
      addHawbList() {
        //  let hawbform=[...this.hawbform]
        let hawbform = JSON.parse(JSON.stringify(this.hawbform));
        //console.log(hawbform)
        for (var i in hawbform) {
          var item = hawbform[i];
          //          if(!item.ybpiece||!item.ybweight||!item.ybvolume){
          //   this.$message.error('请填写预报件重体');return
          // }

          if (!item.hawb) {
            this.$message.error("请填写分运单号！");
            return;
          }
          if (item.khjcno.length == 0 && this.pagetype != 3) {
            this.$message.error("请选择进仓编号！");
            return;
          }
          if (!item.pono && this.mawbdetail.iscomboine == 1) {
            this.$message.error("请选择订单号！");
            return;
          }

          //  if(item.khjcno.length==0){
          //            this.$message.error('请填写进仓编号！');return
          //  }
          if (item.khjcno.length == 0 && this.mawbdetail.pagetype != 12) {
            item.ybpiece = 0;
            item.ybweight = 0;
            item.ybvolume = 0;
          }
          var ybstoreList = [];
          item.guid = -1;
          item.khjcno.forEach(element1 => {
            this.getNumberList.forEach(element2 => {
              if (element1 == element2.khjcno) {
                ybstoreList.push({ guid: element2.guid, isdel: 1 });
              }
            });
          });

          item.ybstoreList = ybstoreList;
          item.khjcno = item.khjcno.toString();
        }

        var json = {
          sid: this.pagetype != 3 ? this.mawbdetail.guid : this.mawbdetail.sid,
          boguid: this.mawbdetail.boguid,
          hawbList: hawbform,
          system: this.mawbdetail.system,
          area: this.mawbdetail.area
        };
        let url = this.pagetype != 3 ? "api/ExAxpline" : 'api/ExAxplineHawbDocAmsSend'
        console.log(JSON.stringify(json));
        if (this.mawbdetail.pagetype != 12) {
          this.$axios({
            method: "post",
            url: this.$store.state.webApi + url,
            data: json,
            loading: true,
            tip: false
          }).then(results => {
            //console.log("分单批量新增")
            //console.log(results)
            if (results.data.resultstatus == 0) {
              this.dialogFormVisible = false;
              this.hawbform = [
                //第一个分单的件重体应该默认全部件重体
                this.initHawbform()
              ];
              this.getHawbNum();
              // this.$parent.getHawbNum()
              this.$emit("success", true);
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        } else {
          let index = this.hawb_list.length;
          for (var i in hawbform) {
            let detail = hawbform[i];
            // let hawbrsdata = [
            //   {
            //     title: "发货人",
            //     companytitle_fhr_hawb: this.mawbdetail.companytitle_fhr_mawb,
            //     address_fhr_hawb: this.mawbdetail.address_fhr_mawb,
            //     companycode_fhr_hawb: this.mawbdetail.companycode_fhr_mawb,
            //     state_fhr_hawb: this.mawbdetail.state_fhr_mawb,
            //     city_fhr_hawb: this.mawbdetail.city_fhr_mawb,
            //     postcode_fhr_hawb: this.mawbdetail.postcode_fhr_mawb,
            //     lxr_fhr_hawb: this.mawbdetail.lxr_fhr_mawb,
            //     phone_fhr_hawb: this.mawbdetail.phone_fhr_mawb,
            //     fax_fhr_hawb: this.mawbdetail.fax_fhr_mawb,
            //     email_fhr_hawb: this.mawbdetail.email_fhr_mawb,
            //     fdfhrId: "",
            //     jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
            //     model: ""
            //   },
            //   {
            //     title: "收货人",
            //     companytitle_shr_hawb: this.mawbdetail.companytitle_shr_mawb,
            //     address_shr_hawb: this.mawbdetail.address_shr_mawb,
            //     companycode_shr_hawb: this.mawbdetail.companycode_shr_mawb,
            //     state_shr_hawb: this.mawbdetail.state_shr_mawb,
            //     city_shr_hawb: this.mawbdetail.city_shr_mawb,
            //     postcode_shr_hawb: this.mawbdetail.postcode_shr_mawb,
            //     lxr_shr_hawb: this.mawbdetail.lxr_shr_mawb,
            //     phone_shr_hawb: this.mawbdetail.phone_shr_mawb,
            //     fax_shr_hawb: this.mawbdetail.fax_shr_mawb,
            //     email_shr_hawb: this.mawbdetail.email_shr_mawb,
            //     fdshrId: "",
            //     jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
            //     model: ""
            //   }
            // ];
            // hawbrsdata[0].jsonArr = {
            //   type: "2",
            //   mdg: detail.sfg,
            //   gid: this.mawbdetail.gid,
            //   codetype: 1
            // };
            // hawbrsdata[1].jsonArr = {
            //   type: "2",
            //   mdg: detail.mdg,
            //   gid: this.mawbdetail.gid,
            //   codetype: 2
            // };
            // detail.hawbRSinfo = hawbrsdata;

            detail.khjcnoArr = [];
            detail.chinesepm = this.mawbdetail.chinesepm;
            detail.companytitle_fhr_hawb = this.mawbdetail.companytitle_fhr_mawb,
              detail.address_fhr_hawb = this.mawbdetail.address_fhr_mawb,
              detail.companycode_fhr_hawb = this.mawbdetail.companycode_fhr_mawb,
              detail.state_fhr_hawb = this.mawbdetail.state_fhr_mawb,
              detail.city_fhr_hawb = this.mawbdetail.city_fhr_mawb,
              detail.postcode_fhr_hawb = this.mawbdetail.postcode_fhr_mawb,
              detail.lxr_fhr_hawb = this.mawbdetail.lxr_fhr_mawb,
              detail.phone_fhr_hawb = this.mawbdetail.phone_fhr_mawb,
              detail.fax_fhr_hawb = this.mawbdetail.fax_fhr_mawb,
              detail.email_fhr_hawb = this.mawbdetail.email_fhr_mawb,
              detail.companytitle_shr_hawb = this.mawbdetail.companytitle_shr_mawb,
              detail.address_shr_hawb = this.mawbdetail.address_shr_mawb,
              detail.companycode_shr_hawb = this.mawbdetail.companycode_shr_mawb,
              detail.state_shr_hawb = this.mawbdetail.state_shr_mawb,
              detail.city_shr_hawb = this.mawbdetail.city_shr_mawb,
              detail.postcode_shr_hawb = this.mawbdetail.postcode_shr_mawb,
              detail.lxr_shr_hawb = this.mawbdetail.lxr_shr_mawb,
              detail.phone_shr_hawb = this.mawbdetail.phone_shr_mawb,
              detail.fax_shr_hawb = this.mawbdetail.fax_shr_mawb,
              detail.email_shr_hawb = this.mawbdetail.email_shr_mawb,
              detail.taxcode_fhr_hawb = this.mawbdetail.taxcode_fhr_mawb;
            detail.taxcode_shr_hawb = this.mawbdetail.taxcode_shr_mawb;
            detail.ybpiece = detail.realpiece,
              detail.ybweight = detail.realweight,
              detail.ybvolume = detail.realvolume,
              //console.log(detail)
              this.$set(this.hawb_list, index + Number(i), detail.hawb);
            this.$set(this.hawbInfo, index + Number(i), detail);
          }

          this.hawbform = [
            //第一个分单的件重体应该默认全部件重体
            this.initHawbform()
          ];
        }
      },
      getHawbStoreInfo(hawbguid) {
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxplineStore",
          params: { sid: hawbguid },
          loading: true,
          tip: false
        }).then(results => {
          //console.log("分单仓库信息")
          //console.log(JSON.stringify(results.data))
        });
      },

    },
    mounted() { },
    computed: {
      hawbArr() {
        var arr = [];
        this.hawbTableData.map(item => {
          if (!item.khjcno) {
            arr.push({ label: item.hawb, value: item.hawb });
          }
        });
        return arr;
      },
      cur_hawb() {
        return this.hawb_list[this.cur_index];
      },
      pageTitleStyle() {
        return setTabTitleStyle(this.hawb_list, this.cur_index)
      }

    },
    watch: {
      hawbPosition: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.togglehawb(val)
            })
          }
        },
        immediate: false
      },
      cur_index(newVal) {
        // fetch data
        if (this.hawb_data_list[this.cur_hawb]) return; // 数据已存在则不再去获取

        this.$set(this.hawb_data_list, this.cur_hawb, this.fetch_hawb_data());
      },
      mawbdetail: {
        handler(val) {
          this.hawbInfo.forEach(i => {
            let detail = i;
            this.$set(i, "hwxz", val.hwxz);
            //操作中的不跟随总单修改货物类型
            this.$set(i, "gid", val.gid);
            /*           if(this.mawbdetail.pagetype == 12){
            
                      this.$set(i,'hawbRSinfo',[
                            {
                          title: "发货人",
                          companytitle_fhr_hawb: detail.companytitle_fhr_hawb||this.mawbdetail.companytitle_fhr_mawb,
                          address_fhr_hawb: detail.address_fhr_hawb||this.mawbdetail.address_fhr_mawb,
                          companycode_fhr_hawb: detail.companycode_fhr_hawb||this.mawbdetail.companycode_fhr_mawb,
                          state_fhr_hawb: detail.state_fhr_hawb||this.mawbdetail.state_fhr_mawb,
                          city_fhr_hawb: detail.city_fhr_hawb||this.mawbdetail.city_fhr_mawb,
                          postcode_fhr_hawb: detail.postcode_fhr_hawb||this.mawbdetail.postcode_fhr_mawb,
                          lxr_fhr_hawb:detail.lxr_fhr_hawb|| this.mawbdetail.lxr_fhr_mawb,
                          phone_fhr_hawb:detail.phone_fhr_hawb|| this.mawbdetail.phone_fhr_mawb,
                          fax_fhr_hawb: detail.fax_fhr_hawb||this.mawbdetail.fax_fhr_mawb,
                          email_fhr_hawb: detail.email_fhr_hawb||this.mawbdetail.email_fhr_mawb,
                          fdfhrId: "",
                          jsonArr: { type: "2", mdg: "", gid: "", codetype: 1 },
                          model: ""
                        },
                        {
                          title: "收货人",
                          companytitle_shr_hawb: detail.companytitle_shr_hawb||this.mawbdetail.companytitle_shr_mawb,
                          address_shr_hawb: detail.address_shr_hawb|| this.mawbdetail.address_shr_mawb,
                          companycode_shr_hawb: detail.companycode_shr_hawb|| this.mawbdetail.companycode_shr_mawb,
                          state_shr_hawb: detail.state_shr_hawb|| this.mawbdetail.state_shr_mawb,
                          city_shr_hawb: detail.city_shr_hawb|| this.mawbdetail.city_shr_mawb,
                          postcode_shr_hawb: detail.postcode_shr_hawb|| this.mawbdetail.postcode_shr_mawb,
                          lxr_shr_hawb: detail.lxr_shr_hawb|| this.mawbdetail.lxr_shr_mawb,
                          phone_shr_hawb: detail.phone_shr_hawb||this.mawbdetail.phone_shr_mawb,
                          fax_shr_hawb: detail.fax_shr_hawb|| this.mawbdetail.fax_shr_mawb,
                          email_shr_hawb: detail.email_shr_hawb|| this.mawbdetail.email_shr_mawb,
                          fdshrId: "",
                          jsonArr: { type: "2", mdg: "", gid: "", codetype: 2 },
                          model: ""
                        }
            
            
                        ])
                      } */

            /* if(this.mawbdetail.taxcode_fhr_mawb){
                    this.$set(i,'taxcode_fhr_hawb',(detail.taxcode_fhr_hawb&&detail.taxcode_fhr_hawb!=this.mawbdetail.taxcode_fhr_mawb.substr(0,detail.taxcode_fhr_hawb.length))? detail.taxcode_fhr_hawb:this.mawbdetail.taxcode_fhr_mawb)
            }
            
            if(this.mawbdetail.taxcode_shr_mawb){
                    this.$set(i,'taxcode_shr_hawb',(detail.taxcode_shr_hawb&&detail.taxcode_shr_hawb!=this.mawbdetail.taxcode_shr_mawb.substr(0,detail.taxcode_shr_hawb.length))? detail.taxcode_shr_hawb: this.mawbdetail.taxcode_shr_mawb)
            } */

          });
        },
        deep: true,
        immediate: true
      },
      saveNumberList: {
        handler(val) {
          //  //console.log(val)
          this.getNumberList = val;
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      this.hawbform.push(this.initHawbform());
      this.getHawbNum();
      this.getPonoList()
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
      min-width: 86px;
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