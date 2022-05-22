<template>
  <div>
    <!-- <commonTabs :list="infoTableFirst" style="margin-top: 12px;" :showExpanionBtn="false" :checkedIndex.sync="goodsinfoTabsChecked" :showTooltip="false" titlefield="title"> -->
    <!-- 总单基本信息 -->
    <div>
      <div class="detail" style="margin-top: 0;">
        <div class="detail-title">
          总单信息 
          <!-- {{Object.values(newService).filter(i=>i.servicecode=='AB0420'&&!i.model)}} -->
          <!-- {{Object.values(newService)}} -->
        </div>
        <div class="detail-c" v-show="goodsinfoTabsChecked == 0">
          <newFormCmpt
            :system="initInfo.system"
            :view-data.sync="
              inputModelData.orderdom == '总单' ? inputViewData : allViewData
            "
            :model-data.sync="initInfo"
            :pagetype="2"
            :area="inputModelData.area"
            id="mawbMark"
             @changeRelData="initInfo.customerRelList = $event"
          >
            <hwxzComptNew
              slot="exForm1"
              showGuageString
              :inputModelData="initInfo"
              v-if="initInfo.orderdom == '直单'"
            ></hwxzComptNew>
          </newFormCmpt>
        </div>

        <!-- <div class="detail-c" v-show="goodsinfoTabsChecked==1">
          <newFormCmpt :system="inputModelData.system" :view-data.sync="hawbViewData"
                  :required.sync="hawbRequire" :model-data.sync="initInfo" :pagetype="2"
                  :area="inputModelData.area">
            <hwxzComptNew slot="exForm1" showGuageString :inputModelData="initInfo"></hwxzComptNew>
          </newFormCmpt> 
        </div> -->
      </div>
      <div v-if="inputModelData.orderdom == '直单' && inputModelData.area == '上海' && inputModelData.opersystem == '进口' ">
        <!-- 总单服务项目 -->
        <div class="detail">
          <div class="detail-title" @click="showService = !showService">
            服务项目
          </div>
          <div class="detail-c" v-show="showService">
            <tempConfig
              name="mawbAddNew.vue"
              style="position:absolute;top:1px;right:0px;"
              :system="initInfo.system"
              :type="80"
              :jsondata.sync="serviceList"
              v-if="tempConfigShow"
            >
            </tempConfig>
            <serviceList
              :pagetype="initInfo.guid > 0 ? 2 : 1"
              :serviceList="initInfo.guid > 0 ? initInfo.serviceList : []"
              :newService.sync="newService"
              :opersystem="initInfo.opersystem"
              :orderdom="initInfo.orderdom"
              :system="initInfo.system"
              :czlx="initInfo.czlx"
            >
            </serviceList>
          </div>
        </div>
        <!-- 总单货物信息 -->
        <div
          class="detail"
          v-show=" 
            Object.values(newService).filter(
              i => i.servicecode == 'AB0420' && !i.model
            ).length  && inputModelData.orderdom == '直单' 
          "
        >
          <div class="detail-title">
            实际货物信息 
          </div>

          <div class="detail-c" style="overflow:auto">
            <commonTable
              :head="cargoTableHead"
              :tableData="initInfo.ybstoreList"
              class="commonTable"
              style="width:1500px;"
            >
              <template
                :slot="i.field"
                v-if="i.field.toLowerCase().includes('piece')"
                slot-scope="props"
                v-for="(i, index) in cargoTableHead"
              >
                <el-input
                  v-model="props.data.row[i.field]"
                  v-verify="'integer'"
                  clearable
                  placeholder="请输入"
                  :class="{ 'input-required': i.field == 'piece' }"
                  @change="
                    inputChange('khjcno', 'weight', 'piece', props.data.index)
                  "
                ></el-input>
              </template>

              <template slot="operate" slot-scope="props">
                <i
                  class="el-icon-delete"
                  v-show="props.data.index != initInfo.ybstoreList.length - 1"
                  title="删除进仓编号"
                  @click="delKhjcno(props.data.index)"
                  style="cursor:pointer;color:red"
                ></i>
              </template>

              <template slot="khjcno" slot-scope="props">
                <el-input
                  v-model="props.data.row.khjcno"
                  clearable
                  placeholder="请输入"
                  class="input-required"
                  @change="
                    inputChange('khjcno', 'weight', 'piece', props.data.index)
                  "
                ></el-input>
              </template>

              <template slot="weight" slot-scope="props">
                <el-input
                  v-model="props.data.row.weight"
                  v-verify="'fixedTwo'"
                  clearable
                  placeholder="请输入"
                  class="input-required"
                  @change="
                    inputChange('khjcno', 'weight', 'piece', props.data.index)
                  "
                ></el-input>
              </template>

              <template slot="yjstoredate" slot-scope="props">
                <el-date-picker
                  v-model="props.data.row.yjstoredate"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  type="datetime"
                  :placeholder="'选择日期'"
                  :picker-options="setPickerOptions"
                  style="width:160px;"
                  clearable
                >
                </el-date-picker>
              </template>

              <template slot="packagetypename" slot-scope="props">
                <el-select
                  v-model="props.data.row.packagetypename"
                  :clearable="true"
                  filterable
                >
                  <el-option
                    v-for="(i, index) in packageNameList"
                    :key="index"
                    :label="i"
                    :value="i"
                  >
                  </el-option>
                </el-select>
              </template>
            </commonTable>
          </div>
        </div>
        <!-- 总单收发货人 因按钮取消 -->
        <!-- <div class="detail">

          <div class="detail-title">
                <span>总单收发货人</span>
          </div>

          <div class="detail-c" v-show="goodsinfoTabsChecked==0">
                <revSedMawb :dzinfo="initInfo" ref="makeBillRevSed"></revSedMawb>
                <revSed :dzinfo="initInfo" ref="tzrRev">
                    <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码"
                      v-model="initInfo.taxcode_tzr_mawb" v-verify="'creditCode'"></el-input>
                </revSed>  
          </div>
        </div> -->
      </div>
    </div>

    <!-- </commonTabs> -->
    <!-- 原 -->
    <!-- <div v-show="initInfo.orderdom=='总单'"> -->
    <div>
      <!-- <commonTabs :list="infoTableSecond" style="margin-top: 12px;" :showExpanionBtn="false" :checkedIndex.sync="goodsinfoTabsChecked" :showTooltip="false" titlefield="title" v-show="initInfo.orderdom=='总单'"> -->
      <!-- 分单基本信息 -->
      <div
        class="detail"
        style="margin-top: 0;"
        v-if="inputModelData.orderdom != '直单'"
      >
        <div class="detail-title">
          分单信息
        </div>
        <div class="detail-c">
          <!-- <newFormCmpt :system="initInfo.system" :view-data.sync="hawbViewData"
                   :model-data.sync="initInfo" :pagetype="2"
                  :area="initInfo.area" id="hawbMark">
            <hwxzComptNew slot="exForm1" showGuageString :inputModelData="initInfo"></hwxzComptNew>
          </newFormCmpt>  -->
          <div>
            <hawbAdd
              :mawbdetail="inputModelData"
              :initInfo="initInfo"
              ref="hawbtab"
              :showContent="true"
            ></hawbAdd>
          </div>
        </div>
      </div>

      <!-- 分单服务项目 -->
      <!-- <div class="detail">
            <div class="detail-title" @click="showService=!showService">
                服务项目
            </div>
            <div class="detail-c" v-show="showService">
              <tempConfig name="mawbAddNew.vue" style="position:absolute;top:1px;right:0px;"
                  :system="initInfo.system" :type="80" :jsondata.sync="serviceList" v-if="tempConfigShow">
              </tempConfig>
              <serviceList  :pagetype="initInfo.guid>0?2:1"
                  :serviceList="initInfo.guid>0?initInfo.serviceList:[]" :newService.sync="newService"
                  :opersystem="initInfo.opersystem" :orderdom="initInfo.orderdom"
                  :system="initInfo.system" :czlx="initInfo.czlx" :ysfs="initInfo.ysfs">
                </serviceList>
            </div>
        </div> -->
      <!-- 分单货物信息 -->
      <!-- <div class="detail" v-show="Object.values(newService).filter(i=>i.servicecode=='AB0420'&&!i.model).length">
          <div class="detail-title">
                实际货物信息  
          </div>
          <div class="detail-c" style="overflow:auto">
               <commonTable :head="cargoTableHead" :tableData="inputModelData.hawbList.length > 0  ? inputModelData.hawbList[cargoIndexStatus].cargoInfoList : []"  class="commonTable" style="width:1500px;">
                       <template :slot="i.field" v-if="i.field.toLowerCase().includes('piece')" slot-scope="props" v-for="(i,index) in cargoTableHead">
                           <el-input  v-model="props.data.row[i.field]" v-verify="'integer'" clearable placeholder="请输入" :class="{'input-required':i.field=='piece'}" @change="inputChange('khjcno','weight','piece',props.data.index)"></el-input>
                        </template>   

                       <template slot="operate" slot-scope="props">
                           <i class="el-icon-delete" 
                            title="删除进仓编号" @click="delKhjcno(props.data.index)" style="cursor:pointer;color:red"></i>
                       </template>

                       <template slot="khjcno" slot-scope="props">
                           <el-input  v-model="props.data.row.khjcno"  clearable placeholder="请输入" class="input-required" @change="inputChange('khjcno','weight','piece',props.data.index)"></el-input>
                        </template> 

                        <template slot="weight" slot-scope="props">
                           <el-input  v-model="props.data.row.weight" v-verify="'fixedTwo'" clearable placeholder="请输入" class="input-required" @change="inputChange('khjcno','weight','piece',props.data.index)"></el-input>
                        </template>    

                        <template slot="yjstoredate" slot-scope="props">
                           <el-date-picker 
                            v-model="props.data.row.yjstoredate"
                            :value-format="'yyyy-MM-dd HH:mm:ss'" 
                            type="datetime"
                            :placeholder="'选择日期'" 
                            :picker-options="setPickerOptions"  
                            style="width:160px;"
                            clearable>
                        </el-date-picker>
                        </template> 

                        <template slot="packagetypename" slot-scope="props">
                           <el-select v-model="props.data.row.packagetypename" :clearable="true" filterable>
                             <el-option v-for="(i,index) in packageNameList" :key="index" :label="i" :value="i">

                             </el-option>
                           </el-select>
                        </template>
               
               </commonTable>

          </div>  
        </div> -->
      <!-- 分单收发货人 因按钮取消 -->
      <!-- <div class="detail">

          <div class="detail-title">
                分单收发货人
          </div>

          <div class="detail-c">
             <revSedHawb :dzinfo="initInfo" ref='makeBillRevSedHawb'></revSedHawb>
              <revSed :dzinfo="initInfo" dom=2 ref="tzrRevHawb"></revSed>
          </div>

        </div> -->

      <!-- </commonTabs>   -->
    </div>

    <div style="float:right" v-if="pagetype == '1'">
      <el-button type="danger" @click="$parent.initDataFunc">重置</el-button>
      <el-button type="primary" @click="saveConfirm(false)">保存</el-button>
      <el-button type="primary" @click="saveConfirm(true)"
        >保存并新增</el-button
      >
    </div>

    <div style="float:right" v-else>
      <el-button
        type="danger"
        @click="putMawbInfo"
        v-if="!$store.state.mainSearch"
        >保存</el-button
      >
      <el-button
        type="primary"
        @click="$parent.$emit('update:visible', false)"
        v-if="!$store.state.mainSearch"
        >返回</el-button
      >
    </div>

    <el-dialog
      :visible.sync="saveVisible"
      title="确认操作"
      width="400px"
      top="15%"
      append-to-body
    >
      <div style="text-align: center;">
        <el-button style="margin-right: 30px;" type="primary" @click="saveInfo">
          {{ areaStateCode }}操作</el-button
        >
        <el-button type="primary" @click="assignShow = true"
          >分配至外站
        </el-button>
      </div>
    </el-dialog>

    <!-- 分配 -->
    <el-dialog
      :visible.sync="assignShow"
      :close-on-click-modal="false"
      v-if="assignShow"
      append-to-body
      width="1300px"
      top="50px"
      :before-close="assignClose"
    >
      <fenpei
        :fenpeiguid="mawbguid"
        :information="serviceList.filter(i => i.isdel == 1)"
        @back="backFenpei"
        ref="fenpei"
        :system="initInfo.system"
        :new-add="1"
        origin="客服"
      >
        <el-button type="primary" @click="saveWaitFp">确认分配</el-button>
      </fenpei>
    </el-dialog>
  </div>
</template>

<script>
import fenpei from "@/components/orderDetails/fenpei";
import serviceList from "@/components/orderDetails/serviceList";
import tempConfig from "@/components/templates/tempConfig";
import revSedMawb from "@/components/templates/revSedMawb";
import revSedHawb from "@/components/templates/revSedHawb";
import revSed from "@/components/templates/revSed";
import hawbAdd from "@/components/orderDetails/hawbAdd";
import { formatDate, computedWeight, isNumber } from "@/api/localStorage.js";

export default {
  name: "newOrderAddAi",

  props: {
    inputModelData: {
      type: Object
    },
    areaStateCode: {
      type: String,
      default: ""
    },
    pagetype: {
      default: "1",
      type: [Number, String]
    }
  },
  mixins: [],
  components: {
    tempConfig,
    serviceList,
    revSedMawb,
    revSedHawb,
    revSed,
    fenpei,
    hawbAdd
  },

  data() {
    return {
      name: "newOrderAddAi.vue",
      orderInfoAI: {},
      goodsinfoTabsChecked: 0,
      initInfo: this.initInfoData(),
      //basicRequire:'',//总单必填
      //hawbRequire:'',//分单必填
      //titleList:['总单信息','分单信息'],
      tempConfigShow: true, //用于初始化服务模板组件
      newService: {}, //服务项目
      infoTableFirst: [{ title: "总单信息" }],
      infoTableSecond: [{ title: "分单信息" }],
      setPickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      },
      saveVisible: false, //本站操作 分配
      assignShow: false, //分配弹框显示隐藏
      mawbguid: "", //分配guid
      inputViewData: {
          fid: {
          title: "委托客户",
          type: 11,
          required: true,
          itemStyle: {
            width: "460px"
          },
          contentStyle: {
            display: "flex"
          },
          linkage: "gid",
          pagetype: 1,
          hidden: false
        },
        gid: {
          title: "项目",
          type: 10,
          required: true,
          itemStyle: {
            width: "840px"
          },
          contentStyle: {
            display: "flex"
          },
          disabled: false,
          showCustomerRel: true,
          isnewadd: true,
          hidden: false,
        },
        mawb: {
          title: "总运单号",
          type: 1,
          required: true,
          verify: "mawb",
          occupyRestSpace: true
          // elEvent:{
          //   eventName:'blur',
          //   eventFunc:this.reSearch,
          // },
        },
        ybpiece: {
          title: "预报件数",
          type: 1,
          required: true,
          verify: "integer",
          alertTitle: "预报件数"
          //   elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isOver,
          //   params:['hasdjh','occupyRestSpace','djhpiece']
          // },
        },
        goodsybpiece: {
          type: 18,
          verify: "integer",
          itemStyle: { width: "74px" },
          titleStyle: { display: "none" },
          disabled: true,
          hidden: true
        },
        ybweight: {
          title: "预报重量",
          type: 1,
          required: true,
          verify: "fixedTwo",
          alertTitle: "预报重量"
        },
        goodsybweight: {
          type: 18,
          verify: "fixedTwo",
          itemStyle: { width: "74px" },
          titleStyle: { display: "none" },
          disabled: true,
          hidden: true
        },
        jfweight: {
          title: "计费重量",
          type: 1,
          required: true,
          verify: "fixedTwo",
          alertTitle: "计费重量",
          occupyRestSpace: true,
          elEvent: {
            eventName: "change",
            eventFunc: this.isOverJfweight,
            params: ["jfweight", "hawb_jfweight"]
          }
        },
        goodsjfweight: {
          type: 18,
          verify: "fixedTwo",
          itemStyle: { width: "74px" },
          titleStyle: { display: "none" },
          disabled: true,
          hidden: true,
          occupyRestSpace: true
        },
        // goodsybvolume: {
        //   type: 18,
        //   verify: "fixedThree",
        //   itemStyle: { width: '74px' },
        //   titleStyle: { display: 'none' },
        //   disabled: true,
        //   hidden:true
        //   // occupyRestSpace: true
        // },
        // smallpiece: {
        //   title: "小件数",
        //   type: 1,
        //   verify: "integer",
        //   occupyRestSpace: true
        // },
        sfg: {
          title: "始发港",
          type: 20,
          pagetype: 6,
          required: true
        },
        mdg: {
          title: "到达港",
          type: 20,
          pagetype: 6,
          required: true
        },
        hbh: {
          title: "航班号",
          type: 1,
          verify: "uppercase"
        },
        hbrq: {
          title: "到港日期",
          type: 6,
          format: "yyyy-MM-dd",
          //pickerOptionsType: 1,
          required: true
        },
        jjd: {
          title: "货物来源",
          type: 3,
          idStyle: {
            width: "100%"
          },
          itemStyle: {
            width: "100%"
          },
          options: []
        },
        ysfs: {
          title: "入境方式",
          type: 3,
          idStyle: {
            width: "100%"
          },
          itemStyle: {
            width: "100%"
          },
          groupid: 64,
          bindValue: "typename",
          bindLabel: "typename"
        },

        //总直单
        hwplace: {
          title: "收货人所在地",
          type: 3,
          occupyRestSpace: true,
          groupid: 212,
          default: "1",
          hidden: false
        },
        tradeterm: {
          title: "贸易方式",
          type: 16,
          idStyle: {
            width: "100%"
          },
          itemStyle: {
            width: "100%"
          },
          options: [
            {
              title: "Freight  Prepaid",
              detailS: []
            },
            {
              title: "Freight  Collect",
              detailS: []
            }
          ],
          hidden: false
        },
        jsfs: {
          title: "结算方式",
          type: 3,
          occupyRestSpace: true,
          //groupid:215,
          options: [
            { label: "月结", value: "2" },
            { label: "现结", value: "1" }
          ],
          //default:'2',
          hidden: false,
          disabled: false
        },
        yjStoredatetype: {
          title: "计费方式",
          type: 3,
          occupyRestSpace: true,
          itemStyle: { width: "100%" },
          options: [
            {
              label: "以实际最早进仓日期为计费方式",
              value: "1"
            },
            {
              label: "以最晚实际进仓日期为计费方式",
              value: "2"
            }
          ],
          default: "1",
          hidden: false
        },
        hasdjh: {
          title: "有无大件货",
          type: 3,
          idStyle: { width: "100%" },
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
        },
        hascdjh: {
          title: "有无超限货",
          idStyle: { width: "100%" },
          type: 3,
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
        },
        hasjmyq: {
          title: "有无精密仪器",
          idStyle: { width: "100%" },
          type: 3,
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
          // elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isHas,
          //   params:['hasjmyq','occupyRestSpace','isjmyq']
          // },
        },
        englishpm: {
          title: "英文品名",
          type: 17,
          verify: "uppercase",
          itemStyle: {
            width: "560px"
          },
          required: true,
          hidden: false
        },
        sizeremark: {
          title: "尺寸备注",
          type: 17,
          itemStyle: {
            width: "560px"
          },
          //required:true,
          hidden: false
        }
        //总直单结束
      },
      hawbViewData: {
        fid: {
          title: "委托客户",
          type: 11,
          required: true,
          itemStyle: {
            width: "460px"
          },
          contentStyle: {
            display: "flex"
          },
          linkage: "gid",
          pagetype: 1
        },
        gid: {
          title: "项目",
          type: 10,
          required: true,
          itemStyle: {
            width: "840px"
          },
          contentStyle: {
            display: "flex"
          },
          disabled: false,
          showCustomerRel: true,
          isnewadd: true
        },
        hawb: {
          title: "分运单号",
          required: true,
          type: 1,
          hidden: false,
          occupyRestSpace: true,
          verify: "uppercase"
        },
        ybpiece: {
          required: true,
          verify: "integer",
          alertTitle: "分单件数",
          title: "分单件数",
          type: 1,
          hidden: false,
          elEvent: {
            eventName: "change",
            eventFunc: this.isOver,
            params: ["ybpiece", "hawb_ybpiece"]
          }
        },
        ybweight: {
          title: "预报重量",
          type: 1,
          required: true,
          verify: "fixedTwo",
          alertTitle: "分单重量",
          hidden: false
        },
        jfweight: {
          title: "计费重量",
          type: 1,
          required: true,
          verify: "fixedTwo",
          hidden: false,
          occupyRestSpace: true,
          elEvent: {
            eventName: "change",
            eventFunc: this.isOverJfweight,
            params: ["jfweight", "hawb_jfweight"]
          }
        },
        sfg: {
          title: "始发港",
          type: 20,
          pagetype: 6,
          required: true,
          hidden: false
        },
        mdg: {
          title: "到达港",
          type: 20,
          pagetype: 6,
          required: true,
          hidden: false,
          occupyRestSpace: true
        },

        // hawb_smallpiece:{
        //     title: "小件数",
        //     type: 1,
        //     verify: "integer",
        //     occupyRestSpace: true,
        //     hidden:false,
        // },
        exForm1: {
          idStyle: {
            width: "100%",
            marginBottom: "-14px"
          },
          itemStyle: {
            width: "100%"
          },
          titleStyle: {
            display: "none"
          },
          hidden: false
        },
        hwplace: {
          title: "收货人所在地",
          type: 3,
          occupyRestSpace: true,
          groupid: 212,
          default: "1",
          hidden: false
        },
        tradeterm: {
          title: "贸易方式",
          type: 16,
          idStyle: {
            width: "100%"
          },
          itemStyle: {
            width: "100%"
          },
          options: [
            {
              title: "Freight  Prepaid",
              detailS: []
            },
            {
              title: "Freight  Collect",
              detailS: []
            }
          ],
          hidden: false
        },
        jsfs: {
          title: "结算方式",
          type: 3,
          occupyRestSpace: true,
          //groupid:215,
          options: [
            { label: "月结", value: "2" },
            { label: "现结", value: "1" }
          ],
          //default:'2',
          hidden: false,
          disabled: false
        },
        yjStoredatetype: {
          title: "计费方式",
          type: 3,
          occupyRestSpace: true,
          itemStyle: { width: "100%" },
          options: [
            {
              label: "以实际最早进仓日期为计费方式",
              value: "1"
            },
            {
              label: "以最晚实际进仓日期为计费方式",
              value: "2"
            }
          ],
          default: "1",
          hidden: false
        },

        hasdjh: {
          title: "有无大件货",
          type: 3,
          idStyle: { width: "100%" },
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
          // elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isHas,
          //   params:['hasdjh','occupyRestSpace','djhpiece']
          // },
        },
        // djhpiece:{
        //   title:'大件货',
        //   type:1,
        //   occupyRestSpace:true,
        //   verify: "integer",
        //   hidden:false,
        // },
        hascdjh: {
          title: "有无超限货",
          idStyle: { width: "100%" },
          type: 3,
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
          // elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isHas,
          //   params:['hascdjh','occupyRestSpace','cdjhpiece']
          // },
        },
        // cdjhpiece:{
        //   title:'超限货',
        //   type:1,
        //   occupyRestSpace:true,
        //   verify: "integer",
        //   hidden:false,
        // },
        hastzcx: {
          title: "有无特种超限货",
          idStyle: { width: "100%" },
          type: 3,
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
          // elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isHas,
          //   params:['hastzcx','occupyRestSpace','tzcxhpiece']
          // },
        },
        // tzcxhpiece:{
        //   title:'特种超限',
        //   type:1,
        //   occupyRestSpace:true,
        //   verify: "integer",
        //   hidden:false,
        // },
        hasjmyq: {
          title: "有无精密仪器",
          idStyle: { width: "100%" },
          type: 3,
          options: [
            {
              label: "无",
              value: "2"
            },
            {
              label: "有",
              value: "1"
            }
          ],
          default: "2",
          hidden: false
          // elEvent: {
          //   eventName: 'change',
          //   eventFunc: this.isHas,
          //   params:['hasjmyq','occupyRestSpace','isjmyq']
          // },
        },
        // isjmyq:{
        //   title:'精密仪器',
        //   type:1,
        //   occupyRestSpace:true,
        //   verify: "integer",
        //   hidden:false,
        // },
        englishpm: {
          title: "英文品名",
          type: 17,
          verify: "uppercase",
          itemStyle: {
            width: "560px"
          },
          required: true,
          hidden: false
        },
        sizeremark: {
          title: "尺寸备注",
          type: 17,
          itemStyle: {
            width: "560px"
          },
          //required:true,
          hidden: false
        }
      },
      // hawbViewData:{
      //   hawb:{
      //     title:'分运单号',
      //     required:true,
      //     type:1,
      //     hidden:false,
      //     occupyRestSpace: true,
      //     verify:"uppercase"
      //   },
      //   hawb_ybpiece:{
      //     required: true,
      //     verify: "integer",
      //     alertTitle: '分单件数',
      //     title:'分单件数',
      //     type:1,
      //     hidden:false,
      //     elEvent: {
      //       eventName: 'change',
      //       eventFunc: this.isOver,
      //       params:['ybpiece','hawb_ybpiece']
      //     },
      //   },
      //   hawb_ybweight: {
      //       title: "预报重量",
      //       type: 1,
      //       required: true,
      //       verify: "fixedTwo",
      //       alertTitle: '分单重量',
      //       hidden:false,
      //   },
      //   hawb_jfweight: {
      //       title: "计费重量",
      //       type: 1,
      //       required: true,
      //       verify: "fixedTwo",
      //       hidden:false,
      //       occupyRestSpace: true,
      //       elEvent: {
      //         eventName: 'change',
      //         eventFunc: this.isOverJfweight,
      //         params:['jfweight','hawb_jfweight']
      //     },
      //   },
      //    hawb_sfg:{
      //     title: "始发港",
      //     type: 20,
      //     pagetype: 6,
      //     required: true,
      //     hidden:false,
      //   },
      //   hawb_mdg:{
      //     title: "到达港",
      //     type: 20,
      //     pagetype: 6,
      //     required: true,
      //     hidden:false,
      //     occupyRestSpace: true,
      //   },

      //   // hawb_smallpiece:{
      //   //     title: "小件数",
      //   //     type: 1,
      //   //     verify: "integer",
      //   //     occupyRestSpace: true,
      //   //     hidden:false,
      //   // },
      //   exForm1: {
      //       idStyle: {
      //         width: "100%",
      //         marginBottom: "-14px"
      //       },
      //       itemStyle: {
      //         width: "100%"
      //       },
      //       titleStyle: {
      //         display: "none"
      //       },
      //       hidden:false,
      //     },
      //     hawb_hwplace:{
      //       title:'收货人所在地',
      //       type:3,
      //       occupyRestSpace: true,
      //       groupid:212,
      //       default:'1',
      //       hidden:false,
      //     },
      //     hawb_tradeterm: {
      //       title: "贸易方式",
      //       type: 16,
      //       idStyle: {
      //         width: "100%"
      //       },
      //       itemStyle: {
      //         width: "100%"
      //       },
      //       options: [{
      //         title: "Freight  Prepaid",
      //         detailS: [

      //         ]
      //       },
      //       {
      //         title: "Freight  Collect",
      //         detailS: [

      //         ]
      //       }
      //       ],
      //       hidden:false,
      //     },
      //     hawb_jsfs:{
      //       title:'结算方式',
      //       type:3,
      //       occupyRestSpace: true,
      //       //groupid:215,
      //       options:[
      //         {label:'月结',value:'2'},
      //         {label:'现结',value:'1'}
      //       ],
      //       //default:'2',
      //       hidden:false,
      //       disabled:false,
      //     },
      //     hawb_yjStoredatetype:{
      //       title:'计费方式',
      //       type:3,
      //       occupyRestSpace: true,
      //       itemStyle:{width:'100%'},
      //       options:[
      //       {
      //        label:'以实际最早进仓日期为计费方式',
      //        value:'1'
      //       },
      //       {
      //       label:'以最晚实际进仓日期为计费方式',
      //       value:'2'
      //       }],
      //       default:'1',
      //       hidden:false,
      //     },

      //     hawb_hasdjh:{
      //       title:'有无大件货',
      //       type:3,
      //       idStyle:{width:'100%'},
      //       options:[
      //       {
      //         label:'无',
      //         value:'2'
      //       },
      //       {
      //         label:'有',
      //         value:'1'
      //       }
      //       ],
      //       default:'2',
      //       hidden:false,
      //       // elEvent: {
      //       //   eventName: 'change',
      //       //   eventFunc: this.isHas,
      //       //   params:['hasdjh','occupyRestSpace','djhpiece']
      //       // },
      //     },
      //     // djhpiece:{
      //     //   title:'大件货',
      //     //   type:1,
      //     //   occupyRestSpace:true,
      //     //   verify: "integer",
      //     //   hidden:false,
      //     // },
      //     hawb_hascdjh:{
      //       title:'有无超限货',
      //       idStyle:{width:'100%'},
      //       type:3,
      //       options:[
      //       {
      //         label:'无',
      //         value:'2'
      //       },
      //       {
      //         label:'有',
      //         value:'1'
      //       }
      //      ],
      //       default:'2',
      //       hidden:false,
      //       // elEvent: {
      //       //   eventName: 'change',
      //       //   eventFunc: this.isHas,
      //       //   params:['hascdjh','occupyRestSpace','cdjhpiece']
      //       // },
      //     },
      //     // cdjhpiece:{
      //     //   title:'超限货',
      //     //   type:1,
      //     //   occupyRestSpace:true,
      //     //   verify: "integer",
      //     //   hidden:false,
      //     // },
      //     hawb_hastzcx:{
      //       title:'有无特种超限货',
      //       idStyle:{width:'100%'},
      //       type:3,
      //       options:[
      //       {
      //         label:'无',
      //         value:'2'
      //       },
      //       {
      //         label:'有',
      //         value:'1'
      //       }
      //       ],
      //       default:'2',
      //       hidden:false,
      //       // elEvent: {
      //       //   eventName: 'change',
      //       //   eventFunc: this.isHas,
      //       //   params:['hastzcx','occupyRestSpace','tzcxhpiece']
      //       // },
      //     },
      //     // tzcxhpiece:{
      //     //   title:'特种超限',
      //     //   type:1,
      //     //   occupyRestSpace:true,
      //     //   verify: "integer",
      //     //   hidden:false,
      //     // },
      //     hawb_hasjmyq:{
      //       title:'有无精密仪器',
      //       idStyle:{width:'100%'},
      //       type:3,
      //       options:[
      //       {
      //         label:'无',
      //         value:'2'
      //       },
      //       {
      //         label:'有',
      //         value:'1'
      //       }],
      //       default:'2',
      //       hidden:false,
      //       // elEvent: {
      //       //   eventName: 'change',
      //       //   eventFunc: this.isHas,
      //       //   params:['hasjmyq','occupyRestSpace','isjmyq']
      //       // },
      //     },
      //     // isjmyq:{
      //     //   title:'精密仪器',
      //     //   type:1,
      //     //   occupyRestSpace:true,
      //     //   verify: "integer",
      //     //   hidden:false,
      //     // },
      //     hawb_englishpm: {
      //       title: "英文品名",
      //       type: 17,
      //       verify: "uppercase",
      //       itemStyle: {
      //         width: "560px"
      //       },
      //       required:true,
      //       hidden:false,
      //     },
      //     hawb_sizeremark:{
      //       title: "尺寸备注",
      //       type: 17,
      //       itemStyle: {
      //         width: "560px"
      //       },
      //       //required:true,
      //       hidden:false,
      //     }

      //   },
      cargoTableHead: [
        { field: "operate", title: "删除" },
        { field: "khjcno", title: "进仓编号" },
        { field: "piece", title: "件数" },
        { field: "weight", title: "重量" },
        { field: "storeType", title: "入库类型" },
        { field: "yjstoredate", title: "入库日期" },
        { field: "packagetypename", title: "包装类型" },
        { field: "djhpiece", title: "大件货" },
        { field: "cdjhpiece", title: "超限货" },
        { field: "tzcxhpiece", title: "特种超限货" },
        { field: "jmyqpiece", title: "精密仪器" },
        { field: "breakPiece", title: "破损" },
        { field: "moistPiece", title: "潮湿" },
        { field: "deformPiece", title: "变形" },
        { field: "redpiece", title: "泛红" },
        { field: "bwbreakpiece", title: "板位破损" },
        { field: "otherpiece", title: "破损无报告" }
      ],
      //初始货物信息
      initCargoInfo: {
        khjcno: "",
        piece: "",
        weight: "",
        storeType: "不入库",
        yjstoredate: "",
        packagetypename: "",
        djhpiece: "",
        cdjhpiece: "",
        tzcxhpiece: "",
        jmyqpiece: "",
        breakPiece: "",
        moistPiece: "",
        deformPiece: "",
        redpiece: "",
        bwbreakpiece: "",
        otherpiece: ""
      },
      packageNameList: [], //包装类型基础数据
      saveStatus: false, //保存并新增标识
      samePiece: false, //总单件数和分单件数比较
      showService: true //服务显示
    };
  },

  methods: {
    initInfoData() {
      //初始数据ug
      if (this.pagetype == "1") {
        return {
          isimperfect: 1, //订舱类型isimperfect 1正式订舱 2预定舱
          ysservice: {
            company_thr_org: "",
            khjcno: "",
            piece: "",
            weight: "",
            volume: "",
            address_thr_org: "",
            address_thrjson_org: "",
            lxr_thr_org: "",
            phone_thr_org: "",
            pickupdate_org: "",
            yqfinishdate_org: "",
            store_thr: ""
          }, //提货信息
          orderdom: this.inputModelData.orderdom, //总单、直单
          opersystem: this.inputModelData.opersystem, //进出口
          opersystemdom: this.inputModelData.opersystemdom, //空运
          area: this.inputModelData.area,
          ordertype: this.inputModelData.ordertype, //单票、批量
          guid: -1,
          sfg: this.inputModelData.sfg, //始发港
          hawb_sfg: "", //分单始发港
          comboine: 1, //是否可拼 1可拼 2不可拼
          creditlevel: this.inputModelData.creditlevel, //客户等级
          realpiece: 0, //实际件数
          mawb: "", //总运单号
          czlx: this.inputModelData.czlx, //操作类型
          orderno: "", //订单来源号
          hawb: "", //分运单
          fid: this.inputModelData.fid, //委托客户
          gid: this.inputModelData.gid, //项目
          wtkhname: this.inputModelData.wtkhname, //委托客户中文名
          //  mdg: JSON.parse(localStorage.groupType).filter(i=>i.groupid==53&&i.typename == this.inputModelData.area)[0]['ready06'],//第一步选的站点对应进口中的目的港
          mdg: "",
          hawb_mdg: "", //分单到达港
          //qsd:"",//始发地
          //mdd: '',//目的地
          //zzg: "",//中转港
          //deliverydate: "",//货好日期
          //piece: "",//件数
          //weight: "",//重量
          //volume: "",//体积
          ybpiece: "", //预报件数
          ybweight: "", //预报重量
          ybvolume: 0, //预报体积
          jfweight: "", //计费重量
          hawb_ybpiece: "", //分单预报件数
          hawb_ybweight: "", //分单预报重量
          hawb_ybvolume: 0, //分单预报体积
          hawb_jfweight: "", //分单计费重量
          goodsybpiece: "", //货物信息件数总和
          goodsybweight: "", //货物信息重量总和
          goodsybvolume: "", //货物信息体积总和
          goodsjfweight: "", //货物历史计费重量之和
          smallpiece: "", //小件数
          hawb_smallpiece: "", //分单小件数
          hbh: "", //航班号
          arriverq: "", //到港日期
          hbrq: "", //航班日期
          qfsj: "", //起飞时间

          hawb_englishpm: "CONSOLIDATION CARGO AS PER ATTACHED MANIFEST", 
          hawb_sizeremark: "", //尺寸备注
          chinesepm: "", //中文品名
          hwxz: "普货",
          hwlx: "普货",
          ispay_pre: this.inputModelData.ispay_pre, //是否要预付款 1是 2否
          batterymodel: "", //锂电池型号
          hawb_tradeterm: "", //贸易方式
          ctype: false, //c类客户
          remark: "", //备注


          //总直单数据开始
          hwplace:"", //收人所在地
          tradeterm: "", //贸易方式
          jsfs: "", //结算方式
          yjStoredatetype:"", //计费方式
          hasdjh:"", //有无超限货
          hasjmyq:"", //有误精密仪器
          englishpm:"", //英文品名
          sizeremark:"", //尺寸备注

          //总直单数据结束

          system: this.inputModelData.system,

          zddlcode: "", //制单代理代码
          zddlzh: "",
          zdiatacode: "",

          //收发货人信息
          companytitle_fhr_mawb: "",
          address_fhr_mawb: "",
          companycode_fhr_mawb: "",
          state_fhr_mawb: "",
          city_fhr_mawb: "",
          postcode_fhr_mawb: "",
          lxr_fhr_mawb: "",
          phone_fhr_mawb: "",
          fax_fhr_mawb: "",
          email_fhr_mawb: "",
          taxcode_fhr_mawb: "",
          companytitle_shr_mawb: "",
          address_shr_mawb: "",
          companycode_shr_mawb: "",
          state_shr_mawb: "",
          city_shr_mawb: "",
          postcode_shr_mawb: "",
          lxr_shr_mawb: "",
          phone_shr_mawb: "",
          fax_shr_mawb: "",
          email_shr_mawb: "",
          taxcode_shr_mawb: "",
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
          taxcode_fhr_hawb: "",
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
          taxcode_shr_hawb: "",

          companytitle_tzr_mawb: "",
          address_tzr_mawb: "",
          companycode_tzr_mawb: "",
          state_tzr_mawb: "",
          city_tzr_mawb: "",
          postcode_tzr_mawb: "",
          lxr_tzr_mawb: "",
          phone_tzr_mawb: "",
          fax_tzr_mawb: "",
          email_tzr_mawb: "",
          taxcode_tzr_mawb: "",

          //yfstdin: "",运价标准
          ybstoreList: [
            {
              khjcno: "",
              piece: "",
              weight: "",
              storeType: "不入库",
              yjstoredate: "",
              packagetypename: "",
              djhpiece: "",
              cdjhpiece: "",
              tzcxhpiece: "",
              jmyqpiece: "",
              breakPiece: "",
              moistPiece: "",
              deformPiece: "",
              redpiece: "",
              bwbreakpiece: "",
              otherpiece: ""
              //isadd:false,
            }
          ], 
          customerRelList: this.inputModelData.customerRelList,
          hawbList: [{}], 
          jjd: "-1", //货物来源
          ysfs: "普通进口货", //入境方式
          hawb_jsfs: "2", //结算方式
          hawb_yjStoredatetype: "1", //计费方式 1.以实际最早进仓日期为计费方式  ，1.以最晚实际进仓日期为计费方式
          hawb_hwplace: "2", //收货人所在地1.本地 2.外地
          hawb_hasdjh: "2", //有无大件货1.有 2.否
          hawb_hascdjh: "2", //有无超限货1.有 2.否
          hawb_hastzcx: "2", //有无特种超限货1.有 2.否
          hawb_hasjmyq: "2" //有无精密仪器1.有 2.否
        };
      } else {
        //数字转INT字段
        let mawbInfo = { ...this.inputModelData };
        let hawbField = [
          "yjStoredatetype",
          "hwplace",
          "hasdjh",
          "hascdjh",
          "hastzcx",
          "hasjmyq",
          "ysfs",
          "jsfs"
        ];

        let hawbFieldList = [
          "hawb_sfg",
          "hawb_mdg",
          "hawb_ybpiece",
          "hawb_ybweight",
          "hawb_jfweight",
          "hawb_smallpiece",
          "hawb_englishpm",
          "hawb_sizeremark",
          "hawb_tradeterm",
          "hawb_jsfs",
          "hawb_yjStoredatetype",
          "hawb_hwplace",
          "hawb_hasdjh",
          "hawb_hascdjh",
          "hawb_hastzcx",
          "hawb_hasjmyq"
        ];

        hawbField.forEach(i => {
          mawbInfo[i] = String(mawbInfo[i]);
        });

        if (mawbInfo.orderdom == "直单") {
          //直单直接取总单上的信息
          [
            "hawb_sizeremark",
            "hawb_englishpm",
            "hawb_tradeterm",
            "hawb_jsfs",
            "hawb_yjStoredatetype",
            "hawb_hwplace",
            "hawb_hasdjh",
            "hawb_hascdjh",
            "hawb_hastzcx",
            "hawb_hasjmyq"
          ].forEach(i => {
            let mawbField = i.split("_")[1];
            this.$set(mawbInfo, i, mawbInfo[mawbField]);
          });
        } else if (mawbInfo.orderdom == "总单") {
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/ExAxpline",
            params: {
              hpoid: mawbInfo.guid
            },
            loading: false,
            tip: false
          }).then(results => {
            let data = results.data;
            if (data.length) {
              data.forEach(i => {
                i.khjcno =
                  (i.ybstoreList &&
                    i.ybstoreList.map(i => i.khjcno).toString()) ||
                  "";
                //i.timestamp = i.guid
              });

              Object.keys(data[0]).forEach(i => {
                if (hawbFieldList.includes(`hawb_${i}`)) {
                  if (hawbField.includes(i)) {
                    data[0][i] = String(data[0][i]);
                  }
                  this.$set(mawbInfo, `hawb_${i}`, data[0][i]);
                }
              });
              this.$set(mawbInfo, "hawb", data[0]["hawb"]);
              mawbInfo.hawbList = data;
              //console.log(this.inputModelData)
              //this.$set(this.inputModelData,'hawbList',data)
            }

            this.$set(mawbInfo, "hawb_jsfs", mawbInfo["jsfs"]);
            console.log(this.inputModelData.hawbList);
          });
        }
        //this.$set(this.inputModelData,'hawb_jsfs',this.inputModelData['jsfs'])
        return mawbInfo;
      }
    },
    isOver(mawbpiece, hawbpiece) {
      //件数超量  总单件数、分单件数
      //新增只需
      var allPiece =
        Number(this.initInfo[mawbpiece]) -
        Number(this.initInfo["goodsybpiece"]);
      if (Number(this.initInfo[hawbpiece]) > Number(allPiece)) {
        this.initInfo[hawbpiece] = "";
        return this.$message.error("分单件数超过限制");
      } else if (Number(this.initInfo[hawbpiece]) == Number(allPiece)) {
        this.samePiece = true; //总单件数和分单件数相同,表示最后一个分单
      }
      if (
        Number(this.initInfo[hawbpiece]) <
        this.initInfo.ybstoreList.reduce((a, b) => {
          return (a += Number(b.piece));
        }, 0)
      ) {
        this.initInfo[hawbpiece] = "";
        return this.$message.error("分单件数小于货物总件数");
      }
      this.isOverJfweight("jfweight", "hawb_jfweight");
    },
    isOverJfweight(jfweight, hawbJfweight) {
      //计费重量、分单计费重量
      if (this.initInfo[hawbJfweight]) {
        var allJfweight =
          Number(this.initInfo[jfweight]) -
          Number(this.initInfo["goodsjfweight"]);
        var allPiece =
          Number(this.initInfo["ybpiece"]) -
          Number(this.initInfo["goodsybpiece"]);
        if (
          Number(this.initInfo[hawbJfweight]) < Number(allJfweight) &&
          Number(this.initInfo["hawb_ybpiece"]) == Number(allPiece)
        ) {
          this.initInfo[hawbJfweight] = "";
          return this.$message.error("分单计费重量之和不得小于总单计费重量");
        }
      }
    },
    reSearch() {
      //输入总运单号重新查询
      if (this.initInfo.mawb) {
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline/ImpMawbNo",
          params: {
            mawb: this.initInfo.mawb,
            area: this.initInfo.area,
            orderdom: this.initInfo.orderdom
          },
          loading: true,
          tip: false
        }).then(({ data }) => {
          if (data.resultstatus == 0) {
            //显示此总运单号历史件重体
            if (data.resultdic.impMawbInfo) {
              Object.keys(this.inputViewData).forEach(i => {
                if (["ybpiece", "ybweight", "jfweight"].includes(i)) {
                  if (data.resultdic.impMawbInfo[i]) {
                    this.inputViewData[i]["itemStyle"] = {
                      width: "200px",
                      "margin-right": "6px"
                    };
                    this.inputViewData["jfweight"]["occupyRestSpace"] = false;
                  }
                }
                if (
                  ["goodsybpiece", "goodsybweight", "goodsjfweight"].includes(i)
                ) {
                  if (data.resultdic.impMawbInfo[i]) {
                    this.inputViewData[i]["hidden"] = false;
                  }
                }
              });
              Object.keys(data.resultdic.impMawbInfo).forEach(i => {
                if (
                  [
                    "jsfs",
                    "yjStoredatetype",
                    "hwplace",
                    "hasdjh",
                    "hascdjh",
                    "hastzcx",
                    "hasjmyq"
                  ].includes(i)
                ) {
                  this.initInfo["hawb_" + i] = data.resultdic.impMawbInfo[i];
                } else {
                  this.initInfo[i] = data.resultdic.impMawbInfo[i];
                }
              });
            } else {
              Object.keys(this.inputViewData).forEach(i => {
                if (["ybpiece", "ybweight", "jfweight"].includes(i)) {
                  this.inputViewData[i]["itemStyle"] = { width: "280px" };
                  this.inputViewData["jfweight"]["occupyRestSpace"] = true;
                }
                if (
                  ["goodsybpiece", "goodsybweight", "goodsjfweight"].includes(i)
                ) {
                  this.initInfo[i] = "";
                  this.inputViewData[i]["hidden"] = true;
                }
              });
            }
          } else {
            this.initInfo.mawb = "";
            return this.$message.error(data.resultmessage);
          }
        });
      }
    },
    //  getJsfs(){//结算方式
    //     if(this.inputModelData.creditlevel=='A类'){
    //       this.hawbViewData['hawb_jsfs']['disabled']=true
    //       return '2'
    //     }else if(this.inputModelData.creditlevel=='C类'){
    //       this.hawbViewData['hawb_jsfs']['disabled']=true
    //       return '1'
    //     }else{
    //       this.hawbViewData['hawb_jsfs']['disabled']=false
    //       return ''
    //     }
    //  },
     inputChange(field,field2,field3){//新增一条货物信息 进仓编号、重量、件数
     console.log(field,field2,field3)
       let data = this.initInfo.ybstoreList[this.initInfo.ybstoreList.length-1]//最后一条货物信息是否有数据

     if(data[field]&&data[field2]&&data[field3]){
         this.initInfo.ybstoreList.push({...this.initCargoInfo})
         }

     },
     delKhjcno(index){//删除一条货物信息
     this.initInfo.ybstoreList.splice(index,1)
     },
    assignClose() {
      //关闭分配弹窗
      this.$confirm(
        "该订单尚未完成分配,取消后将退回到订舱新增页面,确定取消吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "否",
          type: "warning"
        }
      ).then(() => {
        this.assignShow = false;
      });
    },
    confirmAdd() {
      //必填判断
      let status = true;

      if (this.inputModelData.orderdom == "直单") {
        //必填项
        for (var i in Object.keys(this.allViewData)) {
          var field = Object.keys(this.allViewData)[i]; //字段
          var item = this.allViewData[field]; //字段表单
          if (!item.hidden && item.required && !this.initInfo[field]) {
            //必填项，非隐藏表单
            status = false;
            if (field.includes("_") || field == "hawb") {
              location.href = "#hawbMark";
              return this.$message.error(`分运单${item.title}必填`);
            } else {
              location.href = "#mawbMark";
              return this.$message.error(`${item.title}必填`);
            }
          } else {
            status = true;
            continue;
          }
        }
      } else if (this.inputModelData.orderdom == "总单") {
        for (var i in Object.keys(this.allViewData)) {
          var field = Object.keys(this.allViewData)[i]; //字段
          var item = this.allViewData[field]; //字段表单
          if (!item.hidden && item.required && !this.initInfo[field]) {
            //必填项，非隐藏表单
            status = false;
            if (field.includes("_") || field == "hawb") {
              location.href = "#hawbMark";
              return this.$message.error(`分运单${item.title}必填`);
            } else {
              location.href = "#mawbMark";
              return this.$message.error(`${item.title}必填`);
            }
          } else {
            status = true;
            continue;
          }
        }

        for (var k in Object.keys(this.hawbViewData)) {
          var field = Object.keys(this.hawbViewData)[k]; //字段
          // console.log(this.hawbViewData[field])
          try {
            this.inputModelData.hawbList.forEach(item => {
              if (this.hawbViewData[field].required && !item[field]) {
                status = false;
                this.$message.error(`${this.hawbViewData[field].title}必填`);
                throw new Error(`${this.hawbViewData[field].title}必填`);
              } else {
                status = true;
              }
            });
          } catch (e) {
            return;
          }
        }

        //分单件数 计费重量
        //多个分单件数 必须等于总分单件数
        //分单计费重量必须大于总分单计费重量

        console.log(this.initInfo.ybpiece); //预报价格
        console.log(this.initInfo.jfweight); //预报重量
        try {
          var sumPrice = 0;
          var sumWeight = 0;
          this.inputModelData.hawbList.forEach(item => {
            console.log(item);
            sumPrice += Number(item.ybpiece);
            sumWeight += Number(item.jfweight);
          });
          console.log(sumPrice);
          console.log(Number(this.initInfo.ybpiece) == sumPrice);

          if (Number(this.initInfo.ybpiece) != sumPrice) {
            status = false;
            sumPrice = 0;
            this.$message.error(`请填写正确的分单信息预报件数`);
            throw new Error(`请填写正确的分单信息预报件数`);
          } else if (sumWeight != Number(this.initInfo.jfweight)) {
            status = false;
            alert(sumWeight);
            sumWeight = 0;
            this.$message.error(`请填写正确的分单计费重量`);
            throw new Error(`请填写正确的分单计费重量`);
          } else {
            status = true;
          }
        } catch (e) {
          return;
        }

        //分单与货物的关系
        //货物的件数/重量之和等于分单的件数/重量
        //货物信息  未勾选进港操作——进唯凯仓是货物信息必填
        //  if(Object.values(this.newService).filter(i=>i.servicecode=='AB0420'&&!i.model).length){

        var cargoNumber = 0; //货物件数
        var cargoWeight = 0; //货物重量

        this.inputModelData.hawbList.forEach(item => {
          item.cargoInfoList.forEach(obj => {
            cargoNumber += Number(obj.piece);
            cargoWeight += Number(obj.weight);
          });
        });
        console.log(cargoWeight);
        console.log(cargoNumber);
        // alert(`总货物件数： ${cargoNumber} ------- 总单的件数 ${this.initInfo.ybpiece} `)
        // alert(`总货物重量： ${cargoWeight} -------- 总单的重量${this.initInfo.jfweight}`)
        if (Number(this.initInfo.ybpiece) != cargoNumber) {
          status = false;
          cargoNumber = 0;
          this.$message.error(`请填写正确的货物信息件数`);
          //  throw new Error(`请填写正确的货物信息件数`);
        } else if (cargoWeight != Number(this.initInfo.jfweight)) {
          status = false;

          cargoWeight = 0;
          this.$message.error(`请填写正确的货物信息重量`);
          //  throw new Error(`请填写正确的货物重量`);
        } else {
          status = true;
        }
      }

      if (status) {
        
        let mawbInfo = { ...this.initInfo };
        console.log(mawbInfo)
        mawbInfo.serviceList=this.serviceList
        let publicField = [
          "hawb_sfg",
          "hawb_mdg",
          "hawb_ybpiece",
          "hawb_smallpiece",
          "hawb_ybweight",
          "hawb_jfweight"
        ];
        if (this.inputModelData.orderdom == "总单") {
          Object.keys(this.hawbViewData).forEach(i => {
            //分单、总单基本信息赋值  分单与总单相同字段标识'hawb_mdg'
            if (i.includes("_") || i == "hawb") {
              //  this.$set(mawbInfo.hawbList[0],i.includes('_')?i.split('_')[1]:'hawb',this.initInfo[i])
              if (!publicField.includes(i)) {
                this.$set(
                  mawbInfo,
                  i.includes("_") ? i.split("_")[1] : "hawb",
                  this.initInfo[i]
                );
              }
            }
          });

          //  Object.keys(mawbInfo).forEach(i=>{//分单收发货人赋值
          //    if(i.includes('hawb')&&i.split('_').length>=2){
          //      this.$set(mawbInfo.hawbList[0],i,mawbInfo[i])
          //    }
          //  })
        } else {
          Object.keys(mawbInfo).forEach(i => {
            if ( !publicField.includes(i)) {
              this.$set(mawbInfo, i, this.initInfo[i]);
              //delete mawbInfo.i
            }
          });
          console.log(mawbInfo)
        }
        if (this.inputModelData.orderdom == "总单") {
          // 提示分单时注意:
          //1. 先将分单服务项目为 进唯凯仓库 的 货物数据清空
          this.inputModelData.hawbList.forEach((item, index) => {
            if (item.newService["AB0420"].model == true) {
              this.inputModelData.hawbList[index].cargoInfoList.splice(0);
            }
          });
          //2. 先将serviceList 为空，然后  通过分单的 newService 来给 serviceList 赋值

          this.inputModelData.hawbList.forEach((obj, index) => {
            this.inputModelData.hawbList[index].serviceList = [];
            for (let i in this.inputModelData.hawbList[index].newService) {
              let item = this.inputModelData.hawbList[index].newService[i];
              this.inputModelData.hawbList[index].serviceList.push({
                servicecode: item.servicecode,
                oprequest: item.oprequest,
                isdel: item.model ? 1 : 2,
                assignname: item.title,
                port: item.port,
                assignstatus: item.assignstatus
              });
            }
          });
          //3. 挂载数据
          mawbInfo.hawbList = this.inputModelData.hawbList;
        }

        return mawbInfo;
      } else {
        return false;
      }
      //return status
      //console.log(status)
    },
    saveConfirm(type) {
      //确认订舱  type:保存并新增
      // console.log(this.$refs.hawbtab.hawblistChecked)
      if (this.confirmAdd()) {
        this.saveVisible = true;
        this.saveStatus = type;
      }
    },
    saveInfo() {
      //本站操作
      if (this.confirmAdd()) {
        let mawbInfo = this.confirmAdd();
        mawbInfo.nodecode = "AO5010";
        console.log(mawbInfo);
        console.log(this.inputModelData.hawbList);
        //return
        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxplineLocal",
          data: mawbInfo,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.initInfo = {};
            // this.$parent.initDataFunc();
            this.$confirm(
              "订单编号为" +
                results.data.resultno +
                ";<br>" +
                results.data.resultmessage +
                "。",
              "提示",
              {
                distinguishCancelAndClose: true,
                dangerouslyUseHTMLString: true,
                showCancelButton: true,
                closeOnClickModal: false,
                showClose: false,
                confirmButtonText: "确定"
                //cancelButtonText: "打印流转单",
                //showCancelButton: this.inputModelData.system == "空出" && this.inputModelData.czlx == '代操作',
                //cancelButtonClass: "el-button el-button--primary"
              }
            ).then(() => {
              if (this.saveStatus) {
                //  初始化部分分单信息
                this.initInfo.hawb_yjStoredatetype = "1";
                this.initInfo.hwxz = "普货";
                var list1 = [
                  "hawb_hwplace",
                  "hawb_hasdjh",
                  "hawb_hascdjh",
                  "hawb_hastzcx",
                  "hawb_hasjmyq"
                ].forEach(i => {
                  this.initInfo[i] = "2";
                });
                var list2 = [
                  "hawb_ybpiece",
                  "hawb_ybweight",
                  "hawb_jfweight",
                  "hawb"
                ].forEach(i => {
                  console.log(i);
                  this.initInfo[i] = "";
                });
                this.reSearch();
              } else {
                this.$parent.initDataFunc();
              }
              this.saveVisible = false;

              return;
            });
          } else if (results.data.resultstatus == 99) {
            this.$alert(results.data.resultmessage, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$parent.initDataFunc();
                return;
              }
            });
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      }

      //console.log()
    },
    saveWaitFp() {
      //type:1本站操作  2分配至外站
      if (this.confirmAdd()) {
        let mawbInfo = this.confirmAdd();
        console.log(mawbInfo);
        console.log(this.inputModelData.hawbList);

        //return;
        mawbInfo.nodecode = "AO5025";
        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxplineLocal",
          data: mawbInfo,
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.initInfo = {};
            this.$refs.fenpei.confirmFp(
              results.data.resultguid,
              results.data.resultno
            );
          } else if (results.data.resultstatus == 99) {
            this.$alert(results.data.resultmessage, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$parent.initDataFunc();
                return;
              }
            });
          } else {
            this.assignShow = false;
            this.$message.error(results.data.resultmessage);
          }
        });
      }
    },
    backFenpei() {
      //分配返回
      this.assignShow = false;
      console.log(this.$parent.$parent);
      this.$parent.initDataFunc();
    },
    putMawbInfo() {
      //单纯的修改详细信息的接口
      let mawbInfo = this.confirmAdd();
      if (!mawbInfo) {
        return;
      }
      delete mawbInfo.dzstatus;
      delete mawbInfo.status;

      if (typeof mawbInfo.orderdom != "string") {
        delete mawbInfo.orderdom;
      }

      return;
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExHpoAxpline",
        data: mawbInfo,
        loading: false,
        tip: true
      }).then(results => {
        console.log(results);
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.$parent.getMawbdetail();
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    setOpetionInputViewData(){
      const addOptionList = ['fid','gid','hwplace','tradeterm','jsfs','yjStoredatetype','hasdjh','hasjmyq','englishpm','sizeremark']
      addOptionList.forEach(options => {
        if(this.inputModelData.orderdom == '直单'  && this.inputModelData.opersystem == '进口' && this.inputModelData.area == '上海' ) {
          this.inputViewData[options].hidden = false
          this.inputViewData[options].required = true
        } else {
          this.inputViewData[options].hidden = true
          this.inputViewData[options].required = true
        }
      })
    }
  },

  watch: {
    "inputModelData.orderdom": {
      //切换订单类型
      handler(val) {
        console.log(val);
        this.goodsinfoTabsChecked = 0;
        this.setOpetionInputViewData()
        
        //直单只显示总单信息(hawbViewData部分表单和inputViewData合并)，总单则是分开
        Object.keys(this.hawbViewData).forEach(i => {
          if (
            ![
              "hawb_sizeremark",
              "hawb_englishpm",
              "hawb_hascdjh",
              "hawb_hasdjh",
              "hawb_hasjmyq",
              "hawb_hastzcx",
              "hawb_hwplace",
              "hawb_jsfs",
              "hawb_tradeterm",
              "hawb_yjStoredatetype"
            ].includes(i)
          ) {
            this.hawbViewData[i]["hidden"] = val == "直单";
          }
        });
        this.initInfo.orderdom = val;
      },
      immediate: true
    },
    "inputModelData.opersystem": {
      handler(val){
        this.setOpetionInputViewData()
      },
      immediate: true,
      deep:true

    },
    "inputModelData.area": {
      handler(val) {
        const cityList = JSON.parse(localStorage.getItem("cityCode"));
        cityList.forEach(item => {
          if (item.label == val) {
            this.initInfo.mdg = item.value;
          }
        });
        this.setOpetionInputViewData()
      },
      immediate: true,
      deep: true
    },


    "inputModelData.creditlevel": {
      handler(val) {
        if (this.pagetype == "1") {
          console.log(val);
          if (val.includes("A类")) {
            this.initInfo.hawb_jsfs = "2";
            //this.hawbViewData['hawb_jsfs']['disabled']=true
          } else if (val.includes("C类")) {
            this.initInfo.hawb_jsfs = "1";
            //this.hawbViewData['hawb_jsfs']['disabled']=true
          } else {
            this.initInfo.hawb_jsfs = "2";
            //this.hawbViewData['hawb_jsfs']['disabled']=false
          }
          this.initInfo.creditlevel = val;
        }
      },
      immediate: true,
      deep: true
    },
    "initInfo.mdg": {
      //货物来源根据到达港改变
      handler(val) {
        if (val) {
          this.inputViewData["jjd"]["options"] = JSON.parse(localStorage.jjd)
            .filter(i => i.sfg == val)
            .map(i => {
              return { label: i.cname, value: i.id };
            });
          this.$set(this.initInfo, "jjd", "-1");
          this.$set(this.initInfo, "hawb_mdg", val);
        }
      },
      immediate: true
    },
    "initInfo.sfg": {
      //始发港
      handler(val) {
        if (val) {
          this.$set(this.initInfo, "hawb_sfg", val);
        }
      },
      immediate: true
    },
    "initInfo.ysfs": {
      handler(val) {
        
        console.log(val)
        if (this.newService["AB0420"]) {
          if (val != "外仓货") {
            this.newService["AB0420"]["model"] = true;
          } else {
            this.newService["AB0420"]["model"] = false;
          }
        }
      },
      immediate: true
    }
    // 'newService.AB0420':{
    //   handler(val){
    //     console.log(val)
    //     if(!val.model){
    //       this.initInfo.ysfs='外仓货'
    //     }else{
    //       this.initInfo.ysfs='普通进口货'
    //     }
    //   },
    //   deep:true
    // }
  },

  mounted() {},

  created() {
    this.packageNameList = JSON.parse(localStorage.groupType)
      .filter(i => i.groupid == "31")
      .map(i => i.typename);
    this.$watch(
      () => {
        return this.inputModelData.fid;
      },
      val => {
        if (this.pagetype == "2") {
          let creditlevelArr = getxmdata("wtkhUseful").filter(i => i.id == val);
          if (creditlevelArr.length == 1) {
            this.inputModelData.creditlevel = creditlevelArr[0].creditlevel;
            //this.hawbViewData['hawb_jsfs']['disabled']=this.inputModelData.creditlevel=='A'||this.inputModelData.creditlevel=='C'
          }
        }
      },
      { deep: true, immediate: true }
    );

    this.$watch(
      () => {
        return [
          "opersystem",
          "opersystemdom",
          "area",
          "ordertype",
          "fid",
          "gid",
          "wtkhname",
          "ispay_pre",
          "system"
        ].map(i => this.inputModelData[i]);
      },
      val => {
        [
          "opersystem",
          "opersystemdom",
          "area",
          "ordertype",
          "fid",
          "gid",
          "wtkhname",
          "ispay_pre",
          "system",
          "customerRelList"
        ].forEach(i => {
          this.initInfo[i] = this.inputModelData[i];
          console.log(this.initInfo[i]);
        });

        //console.log(this.inputModelData)
        //console.log(val)
      },
      { deep: true }
    );
  },

  beforeUpdate() {},

  computed: {
    serviceList: {
      //服务数据

      get() {
        var serviceList = [];
        for (let i in this.newService) {
          let item = this.newService[i];
          serviceList.push({
            servicecode: item.servicecode,
            oprequest: item.oprequest,
            isdel: item.model ? 1 : 2,
            assignname: item.title,
            port: item.port,
            assignstatus: item.assignstatus
          });
        }
        return serviceList;
      },
      set(val) {
        //this.initFunc()
        
        val.forEach(item => {
          if (this.newService[item.servicecode]) {
            if (this.newService[item.servicecode].disabled == false) {
              this.newService[item.servicecode].model =
                item.servicecode == 'OA0010' ? this.initInfo.system != '国内服务' && this.initInfo.czlx == '自货' : item.isdel == 1;
                this.newService[item.servicecode].oprequest = item.oprequest;

              if (
                item.servicecode == "AB0420" &&
                !this.newService[item.servicecode].model
              ) {
                this.initInfo.ysfs = "外仓货";
              }
            }
          }
        });
      }
    },
    allViewData: {
      get() {
        //  return Object.assign({},this.inputViewData,this.hawbViewData)
        return this.inputViewData;
      },
      set(val) {}
    }
  },

  destroyed() {}
};
</script>

<style scoped lang="less"></style>
