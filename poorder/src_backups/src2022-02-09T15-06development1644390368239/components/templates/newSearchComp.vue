<template>
  <div class="new-search-comp">
    <!-- {{name}} -->
    <!-- {{templateConfig.temporaryField}} -->
    <!-- {{userSerColor}} -->
    <!-- {{$store.state.navDataById[$route.params.id]}} -->
    <el-collapse-transition>
      <div v-show="setPageshow" class="page-container-main searchCmpt" :pagename="name">
        <div v-for="item of fieldTypeArr" :key="item.fieldtype" :class="['fieldtype-c']"
          :style="setBgcolor(userSerColor[item.fieldtype])">
          <!-- {{setBgcolor(userSerColor[item.fieldtype])}} -->
          <p class="fieldtype-title">
            <span class="title">{{ item.label }}</span>
            <span class="add-btn"
              @click="templateConfig.visible = true;templateConfig.activeFieldtype = item.fieldtype;">
              <i class="el-icon-plus"></i>添加
            </span>
          </p>

          <template v-for="(field, index) in getSelectedFieldByFieldtype(item.fieldtype, templateField)">
            <div v-if="viewData[field] && !viewData[field].hidden" :key="field" :id="field"
              :class="['input-c',viewData[field].idClass]"
              :style="[{order:viewData[field].order>=0?viewData[field].order:index},viewData[field].idStyle]">
              <div :class="['input-item',{itemDisabled:viewData[field].disabled}]" :style="viewData[field].itemStyle">
                <div class="input-title" :style="[viewData[field].titleStyle]">{{ viewData[field].title }}</div>

                <div class="input-content" :style="[viewData[field].contentStyle]"
                  :class="{'input-required':viewData[field].required,contentDisabled:viewData[field].disabled}">
                  <template v-if="viewData[field].type==0">
                    <el-input style="display:none"></el-input>
                  </template>

                  <template v-if="viewData[field].type==1">
                    <div style="display:inline-flex">
                      <el-input style="flex:1;" v-model.trim="modelData[field]"
                        :placeholder="viewData[field].placeholder" clearable v-verify="viewData[field].verify">
                      </el-input>
                      <el-select v-model="viewData[field].whereStr" class="whereSelect" placeholder="包含">
                        <el-option label="包含" value="like"></el-option>
                        <el-option label="不包含" value="notlike"></el-option>
                        <el-option label="等于" value="equal"></el-option>
                      </el-select>
                    </div>
                  </template>

                  <template v-else-if="viewData[field].type==4">
                    <el-select v-model="modelData[field]" placeholder="请选择" :filterable="viewData[field].filterable"
                      clearable @change="formatField(viewData[field].initialField)" default-first-option>
                      <el-option label="全部" value="全部" v-if="viewData[field].allSelect"></el-option>
                      <el-option v-for="(selitem,index) in viewData[field].options" :key="index" :label="selitem.label"
                        :value="selitem.value"></el-option>
                    </el-select>
                  </template>

                  <template v-else-if="viewData[field].type==5">
                    <el-select v-model="multipleVal[field]" multiple placeholder="请选择" size="mini" clearable>
                      <li class="el-select-dropdown__item" @click="selmultiAll(field)">
                        <span>全部</span>
                      </li>
                      <el-option v-for="(selMulitem,index) in viewData[field].options" :key="index"
                        :label="selMulitem.label" :value="selMulitem.value"></el-option>
                    </el-select>
                  </template>

                  <!-- 查询用委托项目-->
                  <template v-else-if="viewData[field].type==13">
                    <pageSelect :pagetype="-1" :modelval.sync="modelData[field]" :pagedata="wtxmData"
                      :disabled="viewData[field].disabled"></pageSelect>
                  </template>

                  <!-- 委托客户 -->
                  <template v-else-if="viewData[field].type==14">
                    <div style="display:inline-flex">
                      <pageSelect :pagetype="1" :modelval.sync="modelData[field]"
                        @change="getWtkhMsg($event,2,viewData[field].linkage)" :disabled="viewData[field].disabled">
                      </pageSelect>
                      <el-select v-model="viewData[field].whereStr" class="whereSelect" placeholder="包含">
                        <el-option label="包含" value="equal"></el-option>
                        <el-option label="不包含" value="unequal"></el-option>
                      </el-select>
                    </div>
                  </template>

                  <template v-else-if="viewData[field].type==15">
                    <div style="display:flex">
                      <el-date-picker v-model="modelData[field].begin" :type="viewData[field].format?'datetime':'date'"
                        :value-format="viewData[field].format||'yyyy-MM-dd HH:mm:ss'"
                        :format="viewData[field].format||'yyyy-MM-dd'" placeholder="开始日期"
                        :editable="viewData[field].editable" class="rangeDate" v-if="modelData[field]" clearable
                        :picker-options="viewData[field].pickerOptions"></el-date-picker>
                      <span style="color:#666;padding-top:3px;">至</span>
                      <el-date-picker v-model="modelData[field].end" :type="viewData[field].format?'datetime':'date'"
                        :value-format="viewData[field].format||'yyyy-MM-dd'"
                        :format="viewData[field].format||'yyyy-MM-dd'" placeholder="结束日期"
                        :editable="viewData[field].editable" :default-time="viewData[field].format?'23:59:59':''"
                        class="rangeDate" v-if="modelData[field]" clearable
                        :picker-options="viewData[field].pickerOptions"></el-date-picker>
                    </div>
                  </template>

                  <template v-else-if="viewData[field].type==20">
                    <pageSelect :pagetype="viewData[field].pagetype" :modelval.sync="modelData[field]"
                      :disabled="viewData[field].disabled" :viewdata="viewData[field].viewdata"
                      :servicecode="viewData[field].servicecode"></pageSelect>
                  </template>

                  <template v-else-if="viewData[field].type==21">
                    <el-select v-model="modelData[field]" placeholder="请选择" clearable>
                      <el-option v-for="selitem in viewData[field].options" :key="selitem.value" :label="selitem.label"
                        :value="selitem.value"></el-option>
                    </el-select>
                  </template>

                  <template v-else-if="viewData[field].type==22">
                    <el-select v-model="modelData[field]" placeholder="请选择" clearable>
                      <el-option v-for="selitem in hwlxOptions" :key="selitem.value" :label="selitem.label"
                        :value="selitem.value"></el-option>
                    </el-select>
                  </template>

                  <template v-else-if="viewData[field].type==23">
                    <el-select v-model="multipleVal[field]" multiple placeholder="请选择" clearable>
                      <el-option-group v-for="group in viewData[field].options" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-option-group>
                    </el-select>
                  </template>

                  <template v-else-if="viewData[field].type==26">
                    <el-select v-model="modelData[field]" placeholder="请选择" clearable>
                      <el-option v-for="item in getFlowAreaArr(viewData[field].linkage)" :key="item" :label="item"
                        :value="item"></el-option>
                    </el-select>
                  </template>

                  <template v-else-if="viewData[field].type==27">
                    <area-select :model.sync="modelData[field]"></area-select>
                  </template>

                </div>
              </div>

              <div :class="['remove-btn', pageBasicField[0].includes(field) ? 'fixed' : 'active' ]"
                @click="removeTemplateField(field)">
                <i class="el-icon-close"></i>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-collapse-transition>
    <div class="page-show-c">
      <span class="spanSlide" :class="[setPageshow?'slideOff':'slideOn']" @click="setPageshow=!setPageshow"
        :title="[setPageshow?'隐藏条件':'更多条件']"></span>
      <el-button type="danger" @click="$emit('reset',true)" style="float: right;margin-top:15px;margin-right:12px;">重置
      </el-button>
    </div>

    <el-dialog :visible.sync="templateConfig.visible"
      :title="'查询模板编辑-'+fieldTypeArr[templateConfig.activeFieldtype-1].label" top="5%" width="1026px"
      :close-on-click-modal="false" @close="setSearchColor()">
      <div class="template-config-c">
        <div class="fieldtype-title-c">
          <div v-for="item of fieldTypeArr"
            :class="['fieldtype-title-item', {'active': templateConfig.activeFieldtype === item.fieldtype}]"
            :style="setBgcolor(userSerColor[item.fieldtype])" :key="item.fieldtype"
            @click="templateConfig.activeFieldtype = item.fieldtype">
            <!-- <el-color-picker size="mini" class="myColorPicker"></el-color-picker> -->
            {{ item.label }}
          </div>
        </div>
        <h6>
          <span>背景颜色设置：</span>
          <span v-for="item in fieldTypeArr" class="myColorPicker">
            <el-color-picker size="mini" v-model="userSerColor[item.fieldtype]" color-format="rgb" :show-alpha="false">
            </el-color-picker>
            {{ item.label }}
          </span>
          <el-button type="primary" @click="backDefault" size="mini" style="margin-left:auto">恢复默认颜色</el-button>
          <el-button type="primary" @click="saveTemporaryField(2)">保存颜色</el-button>
        </h6>

        <div class="select-area">
          <div class="area-title">
            <p class="title-left">
              <span class="title">已选区域</span>
              <span class="tip">(最多选择7项，可拖动选择与排序)</span>
            </p>
            <p class="title-right">
              <span class="default">默认项</span>
              <span class="draggable">可拖动项</span>
            </p>
          </div>

          <div class="field-item-c" ref="selectDropArea" @drop="onDrop($event, 'select-area')"
            @dragenter="dragEnter($event, 'select-area')" @dragleave="dragLeave($event, 'select-area')"
            @dragover="$event.preventDefault()">
            <p v-for="field of getSelectedFieldByFieldtype(templateConfig.activeFieldtype, templateConfig.temporaryField)"
              :key="field" :data-field="field" :class="[
                field,
                'field-item',
                {'fixed': pageBasicField[0].includes(field)},
                {'drag': templateConfig.dragField === field}
              ]">
              <span :draggable="pageBasicField[0].includes(field) ? false : true"
                @dragstart="dragStart(field, 'select-area')" @dragend="dragEnd" :title="allViewData[field].title">
                {{ allViewData[field].title }}
                <i class="el-icon-close" v-show="pageBasicField[1].includes(field)" @click="moveTags(2,field)"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="not-select-area">
          <div class="area-title">未选区域</div>
          <!-- {{getSelectedFieldByFieldtype(templateConfig.activeFieldtype, templateConfig.temporaryField)}} -->
          <div class="field-item-c" ref="notSelectDropArea" @drop="onDrop($event, 'not-select-area')"
            @dragenter="dragEnter($event, 'not-select-area')" @dragleave="dragLeave($event, 'not-select-area')"
            @dragover="$event.preventDefault()">
            <span v-for="field of getNotSelectFieldByFieldtype(templateConfig.activeFieldtype)" :key="field"
              :class="[field, 'field-item', {'drag': templateConfig.dragField === field}]" draggable="true"
              @dragstart="dragStart(field, 'not-select-area')" @dragend="dragEnd" :title="allViewData[field].title">
              {{ allViewData[field].title }}
              <i class="el-icon-plus" @click="moveTags(1,field)"
                v-show="getSelectedFieldByFieldtype(templateConfig.activeFieldtype, templateConfig.temporaryField).length<7"></i>
            </span>
          </div>
        </div>
        <div class="btn-c">
          <el-button type="primary" @click="templateConfig.temporaryField = getDefaultTemplate()">恢复默认字段</el-button>
          <el-button type="primary" @click="saveTemporaryField">保存字段</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { formatDate } from "../../api/tools.js";
  import { getLastDay } from "@/api/localStorage.js"
  var defaultUserColor = {//默认的分类背景颜色
    1: "rgba(211, 235, 255)",
    2: "rgba(255, 222, 222)",
    3: "rgba(254, 234, 207)",
    4: "rgba(225, 224, 255)",
    5: "rgba(199, 245, 189)"
  };
  export default {
    components: {

    },
    props: {
      name: {//路由组件名，据此获取当前的配置字段
        type: String,
        default: ""
      },
      realPageName: {//实际组件名
        type: String,
        default: ""
      },
      area: String,//地域
      system: String,//系统
      viewData: {//配置选项
        type: Object,
        default: () => {
          return {};
        }
      },
      modelData: {//绑定的数据
        type: Object,
        default: () => {
          return {};
        }
      },
      searchData: {//查询数据
        type: Object,
        default: () => {
          return {};
        }
      },
      chineseWhere: {
        //导出excel中需使用的中文条件
        type: Array,
        default() {
          return [];
        }
      },
      pageshow: {//展开与收起
        type: Boolean,
        default: true
      }
    },
    data() {
      let hwlx = [
        ...new Set(
          JSON.parse(localStorage.getItem("groupTypeCode"))[109].map(
            i => i.typename
          )
        )
      ].map(i => {
        return { label: i, value: i };
      });

      return {
        type: 100, // 查询条件类型值
        setPageshow: true,
        pageBasicField: [],
        templateField: [],
        multipleVal: {}, // 代理type5的多选数据
        wtxmData: [], // 查询表单中的委托项目
        hwlxOptions: [],
        templateConfig: {
          visible: false,
          activeFieldtype: 1,
          temporaryField: [], // 修改时使用的临时模板
          dragField: "", // 拖动中的字段
          dragFrom: ""
        },

        fieldTypeArr: [//字段分类
          { label: "号码查询", fieldtype: 1 },
          { label: "时间查询", fieldtype: 2 },
          { label: "状态查询", fieldtype: 3 },
          { label: "单位港口货物查询", fieldtype: 4 },
          { label: "岗位查询", fieldtype: 5 }
        ],
        allViewData: {//配置字段,可以放在单独的文件中维护
          //  fieldtype: 1号码查询  2时间 3状态 4单位港口货物 5岗位；为空默认号码查询   businesstype 1订单类 2 对账类 3 账单类;为空默认订单类，属于多个类别用逗号隔开;目前无用
          pono: {
            title: "订舱编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          shipperno: {
            title: "订单编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1
          },
          jobno: {
            title: this.name == 'tzOperation.vue'||this.name == 'tzMonitor.vue' ? "工作/调账号" : (this.name == 'managerExamine.vue'? "订单编号":"订舱编号"),
            titleStyle: { 'width': this.name == 'tzOperation.vue'||this.name == 'tzMonitor.vue' ? '100px' : '' },
            //title: '工作号',
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          mawb: {
            title: "总运单号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          hzdno: {
            title: "回执单号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          khjcbh: {
            title: "进仓编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          otherno: {
            title: "外部订单号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          hawb: {
            title: "分运单号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          khjcno: {
            title: "进仓编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          ybkhjcno: {
            title: "预报进仓编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          orderno: {
            title: "订单来源号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 1
          },
          courienum_deli: {
            title: "快递单号",
            type: 1,
            whereStr: "like",
            fieldtype: 1
          },
          pchno: {
            title: "对账批次号",
            whereStr: "like",
            type: 1,
            fieldtype: 1,
            businesstype: 2
          },
          pzno: {
            title: "凭证号",
            type: 1,
            whereStr: "like",
            fieldtype: 1,
            businesstype: 3
          },

          mainorder: {
            title: "主营订舱编号",
            type: 1,
            whereStr: "like",
            fieldtype: 1
          },
          jcpchno:{
            title: "运单外借批次号",
            type: 1,
            whereStr: "like",
            fieldtype: 1
          },

          // 时间查询 fieldtype: 2
          hbrq: {
            title: "航班日期",
            type: 15,
            defaultVal: true,
            fieldtype: 2,
            businesstype: 1
          },
          jcdate: {
            title: "入库时间",
            type: 15,
            defaultVal: true,
            fieldtype: 2,
            businesstype: 1
          },
          adddate: {
            title: this.name == 'tzOperation.vue'||this.name == 'tzMonitor.vue'  ? "调账日期" : "创建日期",
            type: 15,
            fieldtype: 2,
            defaultVal: false,
            businesstype: 1
          },
          orderfinishdate: {
            title: "订单完成日期",
            type: 15,
            fieldtype: 2,
            defaultVal: false,
            businesstype: 1
          },
          // confirmdate: {
          //   title: "费用确认日期",
          //   type: 15,
          //   fieldtype: 2,
          //   defaultVal: false,
          //   businesstype: 1
          // },
          yqhbrq: {
            title: "要求航班日期",
            type: 15,
            fieldtype: 2,
            // titleStyle: { minWidth: "100px" },
            businesstype: 1
          },
          deliverydate: {
            title: "货好日期",
            type: 15,
            fieldtype: 2,
            businesstype: 1
          },
          trundate: {
            title: "可交付时间",
            type: 15,
            fieldtype: 2,
            businesstype: 1
          },
          pdfinishdate: {
            title: "配单完成时间",
            type: 15,
            fieldtype: 2,
            businesstype: 1
          },
          //少提货日期
          ourconfirmdate: {
            title: "我司对账日期",
            type: 15,
            fieldtype: 2,
            // titleStyle: { minWidth: "110px" },
            businesstype: 2
          },
          confirmdate: {
            title: "客户确认日期",
            type: 15,
            fieldtype: 2,
            defaultVal: true,
            // titleStyle: { minWidth: "100px" },
            businesstype: 2
          },
          examinedate_sett: {
            title: "审核日期",
            type: 15,
            fieldtype: 2,
            defaultVal: false,
            // titleStyle: { minWidth: "100px" },
            businesstype: 2
          },
          real_hbrq: {
            title: "航班日期",
            type: 15,
            defaultVal: false,
            fieldtype: 2
          },
          approvaldate: {
            title: '审核日期', 
            fieldtype: 2,
            type: 15
          },
          //少供应商确认日期
          pzdate: {
            title: "已开凭证日期",
            type: 15,
            fieldtype: 2,
            defaultPreVal: true,
            // titleStyle: { minWidth: "100px" },
            businesstype: 3
          },
          modifydate: { title: "修改日期", type: 15, fieldtype: 2 },
          pactlsenddate: {
            title: "发送日期",
            type: 15,
            fieldtype: 2
            // titleStyle: { minWidth: "106px" }
          },
          setshipacedate: { title: "配舱日期", type: 15, fieldtype: 2 },
          mawbnoconfirmdate: {
            title: "总单号确认时间",
            type: 15,
            fieldtype: 2
            //titleStyle: { minWidth: "110px" }
          },

          findate:{
             title: "调账完成日期",
             type: 15,
             defaultVal: false,
             fieldtype: 2
          },

          overseasaccdate: {
            title: "海外DN审核时间",
            type: 15,
            fieldtype: 2,
            //begintype:this.name == 'costCheckFobSec.vue' ? 1 : "",
            //titleStyle: { minWidth: "110px" }
          },
          overseasaccsettdate: {
            title: "海外DN提交审核日期",
            type: 15,
            fieldtype: 2,
            //begintype:this.name == 'costConfirmFobSec.vue' ? 1 : "",
            //titleStyle: { minWidth: "110px" }
          },

           djdate: {
            title: "运单登记日期",
            type: 15,
            fieldtype: 2,
          },
          jydate: {
            title: "运单外借日期",
            type: 15,
            fieldtype: 2,
          },
          bookingdate: {
            title: "运单预定日期",
            type: 15,
            fieldtype: 2,
          },
          deprecatedate: {
            title: "运单作废日期",
            type: 15,
            fieldtype: 2,
          },
          configdate: {
            title: "运单配单日期",
            type: 15,
            fieldtype: 2,
          },


          // 状态查询 fieldtype: 3
          status: {
            title: "订单状态",
            type: 5,
            whereStr: "in",
            dom: "订单状态",
            fieldtype: 3,
            hideLabel: ["待合并", "已审单"]
          },
          docstatus: {
            title: "文档状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: '已上传', value: '1' },
              { label: '已预发送', value: '5' }
            ]
          },
          pcstatus: {
            title: "配舱状态",
            type: 5,
            dom: "配舱状态",
            whereStr: "in",
            fieldtype: 3
          },
          hwstatus: {
            title: "货物状态",
            type: 5,
            dom: "货物状态",
            whereStr: "in",
            fieldtype: 3
          },
          dzstatus: {
            title: "单证状态",
            type: 5,
            dom: "单证状态",
            system: "空出",
            whereStr: "in",
            fieldtype: 3
          },
          bgstatus: {
            title: "报关状态",
            type: 5,
            dom: "报关状态",
            whereStr: "in",
            fieldtype: 3
          },
          customstatus: {
            title: "海关联系单状态",
            type: 5,
            groupid: 148,
            whereStr: "in",
            fieldtype: 3
          },
          commbillmodifystatus: {
            title: "签单待修改状态",
            type: 5,
            groupid: 159,
            whereStr: "in",
            fieldtype: 3
          },
          //少预付款锁定状态
          sendstatus: {
            title: "AMS总单发送状态",
            //  titleStyle: { minWidth: "130px" },
            type: 5,
            groupid: 146,
            whereStr: "in",
            fieldtype: 3
          },

          // AMS(人工)页面独有
          isamsmake : {
            title: "是否AMS制作",
            //  titleStyle: { minWidth: "130px" },
              options: [
              { label: "全部", value: "" },
              { label: "是", value: "1" },
              { label: "否", value: "0" },
            ],
            type: 4,
            whereStr: "in",
            fieldtype: 3
          },

          pactlsendstatus: {
            title: "发送状态",
            //  titleStyle: { minWidth: "130px" },
            type: 5,
            whereStr: "in",
            options: [
              { label: "已忽略", value: "-1" },
              { label: "未发送", value: "0" },
              { label: "已发送", value: "1" },
              { label: "发送失败", value: "2" },
              { label: "已二次修改", value: "5" },
              { label: "虚拟发送", value: "10" }
            ],
            fieldtype: 3
          },
          confirmstatus: {
            title: "费用状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "费用未确认", value: "1" },
              { label: "费用已确认", value: "700" }
            ]
          },
          kfconfirmstatus: {
            title: "客服费用状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "客服费用未确认", value: "1" },
              { label: "客服费用已确认", value: "700" }
            ]
          },
          hxconfirmstatus: {
            title: "航线费用状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "航线费用未确认", value: "1" },
              { label: "航线费用已确认", value: "700" }
            ]
          },
          wagerejectstatusin: {
            title: "应收驳回状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            groupid: 202
          },
          wagerejectstatusout: {
            title: "应付驳回状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            groupid: 202
          },
          commitstatus: {
            title: "费用申请状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "申请中", value: "100" },
              { label: "已驳回", value: "200" },
              { label: "已通过", value: "500" }
            ]
          },
          trackstatus: {
            title: "装车指令",
            type: 4,
            options: [
              { label: "不可装车", value: "1" },
              { label: "可装车", value: "2" },
              { label: "已装车", value: "3" }
            ],
            //whereStr: "in",
            fieldtype: 3
          },
          billstatus: {
            title: "对账状态",
            type: 4,
            fieldtype: 3,
            options: [
              { label: "对账中", value: "900" },
              { label: "已对账", value: "1000" }
            ],
            businesstype: 2
          },
          billStatus:{
            title: this.name=='tzOperation.vue'?"订单号关账状态":"调账号完成状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options:[
            { label: "未关账", value: "0" },
            { label: "已关账", value: "3" },
            { label: "未完成", value: "1" },
            { label: "已完成", value: "2" },
            { label: "已审核", value: "4" },
            ]
          },
          boChangeStatus:{
            title: "订单号调账状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "已做调账", value: "1" },
              { label: "未做调账", value: "2" }
            ],
          },
          creditisbackstatus: {
            title: "信控状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "无异常", value: "6" },
              { label: "待通过", value: "4" },
              { label: "已通过", value: "3" },
              { label: "已驳回", value: "5" }
            ]
          },
          dzconfirmstatus: {
            title: "单证确认状态",
            type: 5,
            groupid: 195,
            whereStr: "in",
            fieldtype: 3
          },
          noconfirmstatus: {
            title: "单号确认状态",
            type: 5,
            groupid: 195,
            whereStr: "in",
            fieldtype: 3
          },
          safetystatus: {
            title: "安全声明打印状态",
            // titleStyle: { minWidth: "120px" },
            type: 4,
            options: [
              { label: "已打印", value: "1" },
              { label: "未打印", value: "2" }
            ],
            fieldtype: 3
          },
          cargostatus: {
            title: "Cargo Pouch打印状态",
            type: 4,
            titleStyle: { minWidth: "155px" },
            options: [
              { label: "已打印", value: "1" },
              { label: "未打印", value: "2" }
            ],
            fieldtype: 3
          },
          verificationstatus: {
            title: "异常状态",
            type: 5,
            options: [
              { label: "无异常", value: "1" },
              { label: "异常", value: "2" }
            ],
            whereStr: "in",
            fieldtype: 3
          },
          confirmstatus_in: {
            title: "应收费用状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            // titleStyle: { minWidth: "100px" },
            options: [
              { label: "费用未确认", value: "1" },
              { label: "费用已确认", value: "700" }
            ]
          },
          pdfinishstatus: {
            title: "配单完成状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            options: [
              { label: "未完成", value: "1" },
              { label: "已完成", value: "100" }
            ]
          },
          confirmstatus_out: {
            title: "应付费用状态",
            type: 5,
            whereStr: "in",
            fieldtype: 3,
            //  titleStyle: { minWidth: "100px" },
            options: [
              { label: "费用未确认", value: "1" },
              { label: "费用已确认", value: "700" }
            ]
          },
          ccz_confirmstatus_in: {
            title: "操作站费用状态",
            type: 4,
            whereStr: "in",
            fieldtype: 3,
            // titleStyle: { minWidth: "116px" },
            options: [
              { label: "应收未确认", value: "1" },
              { label: "应收已确认", value: "700" }
            ]
          },
          isclock: {
            title: "C类锁定状态",
            type: 5,
            groupid: 210,
            whereStr: "in",
            fieldtype: 3,
            bindLabel: "ready01",
            bindValue: "ready02"
          },
          hawbsendstatus: {
            title: "AMS分单发送状态",
            type: 5,
            groupid: 146,
            whereStr: "in",
            fieldtype: 3
          },
          bookingstatus:{
           title:"预定状态",
           type: 5,
           whereStr: "in",
           fieldtype: 3,
           options: [
              { label: "未预订", value: "1" },
              { label: "已预订", value: "2" }
            ]
          },
          isfinished: {
            title: "总单制作",
            type: 4,
            options: [
              { label: "已制单", value: 1 },
              { label: "未制单", value: 2 }
            ],
            fieldtype: 3
          },
          isfinished_hawb: {
            title: "分单制作",
            type: 4,
            options: [
              { label: "已制单", value: 1 },
              { label: "未制单", value: 2 }
            ],
            fieldtype: 3
          },
          releasestatus: {
            title: "运抵放行状态",
            options: [
              { value: "1", label: "已放行" },
              { value: "2", label: "未放行" },
              { value: "3", label: "已预警" }
            ],
            type: 5,
            whereStr: "in",
            // titleStyle: { minWidth: "115px" },
            fieldtype: 3
          },
          examineisback_sett: {
            title: '审单状态',
            options: [
              { value: "1", label: "无" },
              { value: "2", label: "审单驳回" },
              { value: "3", label: "审单重新确认" }
            ],
            type: 5,
            whereStr: "in",
            // titleStyle: { minWidth: "115px" },
            fieldtype: 3

          },

          // 单位港口货物查询 fieldtype: 4
          system: {
            title: "所属系统",
            type: 5,
            whereStr: "in",
            options: [],
            fieldtype: 3
            //  groupid: 57
          },
          node: {
            title: '节点', 
            type: 5, 
            whereStr: 'in', 
            fieldtype: 3,
            options: [
              {label: '上榜', value: '上榜'},
              {label: '签单', value: '签单'}
           ]
          },
          approvalstatus: {
            title: '审核状态', 
            type: 5, 
            whereStr: 'in', 
            fieldtype: 3,
            options: [
              {label: '待通过', value: '1'},
              {label: '已通过', value: '2'},
              {label: '已驳回', value: '3'}
              //{label: '已删除', value: '3'}
            ]
          },
          backstatus: {
            title: '信控驳回状态', 
            type: 5, 
            fieldtype: 3,
            whereStr: 'in', 
            options: [
              {label: '无异常', value: '1'},
              {label: '已驳回', value: '2'},
              {label: '再申请', value: '3'}
            ]
          },
          hbh: { title: "航班号", type: 1, whereStr: "like", fieldtype: 4 },
          yqhbh: { title: "要求航班号", type: 1, whereStr: "like", fieldtype: 4 },
          real_hbh: {
            title: "航班号",
            type: 1,
            whereStr: "like",
            verify: "uppercase",
            fieldtype: 4
          },
          canceling: {
            title: "是否撤单中",
            options: [
              { value: "0,4", label: "否" },
              { value: "1,2", label: "是" }
            ],
            type: 4,
            whereStr: "in",
            //titleStyle: { minWidth: "135px" },
            fieldtype: 4
          },
          thprint: {
            title: "派车单是否打印",
            options: [
              { value: "1", label: "已打印" },
              { value: "2", label: "未打印" }
            ],
            type: 4,
            whereStr: "in",
            // titleStyle: { minWidth: "135px" },
            fieldtype: 4
          },
          isboardgys: {
            title: "是否存在外场供应商",
            options: [
              { value: "1", label: "存在" },
              { value: "2", label: "不存在" }
            ],
            type: 4,
            //  titleStyle: { minWidth: "135px" },
            fieldtype: 4
          },
          isbggys: {
            title: "是否存在报关供应商",
            options: [{
              value: "1",
              label: "存在"
            },
            {
              value: "2",
              label: "不存在"
            }
            ],
            type: 4,
            // titleStyle: {
            //   minWidth: "135px"
            // },
            fieldtype: 4
          },
          bindboae: {
            title: "是否绑定主营",
            type: 4,
            options: [
              { label: "是", value: "1" },
              { label: "否", value: "2" }
            ],
            fieldtype: 4
          },
          fid: { title: "委托客户", type: 14, pagetype: "1", fieldtype: 4 },
          gid: { title: "项目", type: 13, pagetype: "2", fieldtype: 4 },
          czlx: {
            title: "操作类型",
            type: 5,
            options: [],
            fieldtype: 4,
            groupid: 132,
            whereStr: "in"
          },
          sfg: { title: "始发港", type: 1, whereStr: "like", fieldtype: 4 },
          mdg: { title: "目的港", type: 1, whereStr: "like", fieldtype: 4 },
          mawbmdg: { title: "目的港", type: 1, whereStr: "like", fieldtype: 4 },
          areaname: {
            title: "航线分区",
            type: 5,
            whereStr: "in",
            fieldtype: 4,
            options: [
              { label: "南美航线", value: "2" },
              { label: "欧洲航线", value: "3" },
              { label: "亚洲航线", value: "4" },
              { label: "北美航线", value: "7" },
              { label: "非洲航线", value: "8" },
              { label: "澳洲航线", value: "9" },
              { label: "印巴中东航线", value: "10" }
            ]
          },
          area: {
            title: "站点",
            type: 27,
            whereStr: "in",
            fieldtype: 4,
          },
          terminalname: {
            title: "交接地",
            type: 5,
            groupid: 20,
            fieldtype: 4,
            bindValue: "typename",
            whereStr: "in"
          },
          hwxz: {
            title: this.name == 'mawbManageNew.vue'||this.name == 'alertManage.vue'?"运单性质":"货物性质",
            type: 5,
            groupid: 115,
            fieldtype: 4,
            whereStr: "in"
          },
          //  signpiece: {
          //   title: "签单件数",
          //   type: 1,
          //   fieldtype: 4,
          //   whereStr: "equal",
          //   verify:'integer'
          // },
          // signweight: {
          //   title: "签单重量",
          //   type: 1,
          //   fieldtype: 4,
          //   whereStr: "equal",
          //   verify:'fixedTwo'
          // },
          // signvolume: {
          //   title: "签单体积",
          //   type: 1,
          //   fieldtype: 4,
          //   whereStr: "equal",
          //   verify:'fixedThree'
          // },
          hwlx: {
            title: "货物类型",
            type: 5,
            options: hwlx,
            fieldtype: 4,
            whereStr: "in"
          },
          batterymode: {
            title: "锂电池型号",
            type: 1,
            whereStr: "like",
            fieldtype: 4,
            businesstype: 1
          },
          loadingmodel: {
            title: "配载方式",
            type: 5,
            groupid: 37,
            fieldtype: 4,
            whereStr: "in"
          },
          mawbgid: {
            title: "运单供应商",
            whereStr: "like",
            fieldtype: 4,
            type: 20,
            pagetype: 3,
          },
          bookingkhid:{
            title: "预订客户",
            whereStr: "like",
            fieldtype: 4,
            type: 20,
            pagetype:22,
          },

          boardgysname: {
            title: "外场供应商",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          servicecodehwcz: {
            title: "货物操作",
            type: 5,
            groupid: 48,
            fieldtype: 4,
            whereStr: "in"
          },
          //s是否已绑定主营订单
          accountinfo: {
            title: "Accountinginfo",
            type: 1,
            // titleStyle: { minWidth: "120px" },
            whereStr: "like",
            fieldtype: 4
          },
          SPECIAL: {
            title: "SPECIAL",
            type: 4,
            groupid: 147,
            whereStr: "like",
            fieldtype: 4
          },
          address_thr_org: {
            title: "提货人地址",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          goodsremark: {
            title: "货物备注",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          address_shr_org: {
            title: "送货人地址",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          truckgid: {
            title: "卡车供应商",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          relshr_deli: {
            title: "收件人",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          //s服务内容
          bzlx_inspect: {
            title: "包装类型",
            type: 4,
            groupid: 31,
            fieldtype: 4
          },
          bzlx_chem: { title: "包装类型", type: 4, groupid: 31, fieldtype: 4 },
          bzlx_zx: {
            title: "包装类型",
            type: 4,
            groupid: 31,
            bindValue: "typename",
            fieldtype: 4
          },
          store_chem: { title: "仓库", type: 25, linkage: "", fieldtype: 4 },
          appraisal_chem: {
            title: "化工鉴定机构",
            type: 4,
            groupid: 106,
            bindLabel: "ready01",
            fieldtype: 4
          },
          appraisal_inspect: {
            title: "磁检鉴定机构",
            type: 4,
            groupid: 106,
            bindLabel: "ready01",
            fieldtype: 4
          },
          appraisalnum_chem: {
            title: "鉴定编号",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          makecom_chem: {
            title: "生产厂家",
            type: 1,
            whereStr: "like",
            fieldtype: 4
          },
          flowarea_cltg: {
            title: "流向区域",
            type: 4,
            options: [
              { label: "外场", value: "外场" },
              { label: "仓库", value: "仓库" }
            ],
            initialField: "flowpoint_cltg",
            fieldtype: 4
          },
          flowpoint_cltg: {
            title: "流向点",
            type: 26,
            linkage: "flowarea_cltg",
            fieldtype: 4
          },
          accountcomgid: {
            title: "结算对象",
            type: 20,
            pagetype: 12,
            fieldtype: 4,
            businesstype: 2
          },
          paymentcomgid: {
            title: "收付对象",
            type: 20,
            pagetype: 1,
            fieldtype: 4,
            businesstype: 2
          },
          pzdom: {
            title: "凭证类型",
            type: 5,
            whereStr: "in",
            fieldtype: 4,
            options: [
              { label: "账单 D/N", value: "账单" },
              { label: "发票 I/V", value: "发票" }
            ],
            businesstype: 3
          },
          isreceive: {
            title: "是否收到",
            type: 5,
            whereStr: "in",
            fieldtype: 4,
            options: [
              { label: "收到", value: "1" },
              { label: "未收到", value: "2" }
            ],
            businesstype: 3
          },
          canceltype: {
            title: "撤单类型",
            type: 5,
            whereStr: "in",
            groupid: 135,
            fieldtype: 4
          },
          accountinfo: {
            title: "Accountinginfo",
            type: 1,
            // titleStyle: { minWidth: "120px" },
            whereStr: "like",
            fieldtype: 4
          },
          isexportform: {
            title: "AMS发送平台",
            type: 5,
            groupid: 86,
            whereStr: "in",
            fieldtype: 4
          },
          realjjdname: {
            title: "交接地",
            type: 5,
            whereStr: "in",
            groupid: 20,
            fieldtype: 4
          },
          profitmode: {
            title: "分配模式",
            type: 5,
            whereStr: "in",
            fieldtype: 4,
            options: [
              { label: "利润分配模式", value: "利润分配模式" },
              { label: "Co-load模式", value: "Co-load模式" },
              { label: "本站", value: " " }
            ]
          },
          realwtkhname: {
            title: "实际委托客户",
            type: 1,
            whereStr: "like",
            fieldtype: 4
            // titleStyle: { minWidth: "100px" }
          },
          bggys: { title: "报关供应商", whereStr: "like", fieldtype: 4, type: 20, pagetype: "3" },
          filename: { title: "文档名", type: 1, whereStr: "like", fieldtype: 4 },
          jydw: { title: "经营单位", type: 1, whereStr: "like", fieldtype: 4 },
          mawbss: { title: "运单所属", type: 1, whereStr: "like", fieldtype: 4 },
          comboine: {
            title: "是否可拼",
            type: 4,
            fieldtype: 4,
            options: [
              { value: "1", label: "可拼" },
              { value: "2", label: "不可拼" }
            ]
          },
          iscomboine: {
            title: "是否已拼",
            type: 4,
            fieldtype: 4,
            options: [
              { value: "1", label: "已拼" },
              { value: "2", label: "未拼" }
            ]
          },
          orderdom: {
            title: "制单类型",
            type: 4,
            options: [
              { label: "总单", value: "总单" },
              { label: "直单", value: "直单" }
            ],
            fieldtype: 4
          },
          serviceitemsname: {
            title: "服务类别",
            whereStr: "in",
            type: 20,
            pagetype: 11,
            viewdata: [
              { title: "servicename", field: "servicename" },
              { title: "服务类别", field: "servicename" }
            ],
            fieldtype: 4
          },
          wageinout: {
            title: "收付类型",
            type: 4,
            fieldtype: 4,
            options: [
              { label: "应收", value: "1" },
              { label: "应付", value: "2" }
            ]
          },
          aid:{
            title:'运单航空公司',
            type: 20,
            fieldtype: 4,
            pagetype:61
          },
          // 岗位查询 fieldtype: 5
          examineman_sett: { title: "审核人", type: 1, fieldtype: 5 },
          addman: { title: "创建人", type: 1, fieldtype: 5 },
          approvalman:{title:"审核人",type:1,fieldtype: 5 },
          rollbackman: { title: "费用驳回人", type: 1, fieldtype: 5 },
          rollbackcust: { title: "客服被驳回人", type: 1, fieldtype: 5 },
          rollbackroute: { title: "航线被驳回人", type: 1, fieldtype: 5 },
          rollback_receiver:{title:'被驳回人', type: 1, fieldtype: 5 },
          orderconfirmman: { title: "上榜确认人", type: 1, fieldtype: 5 },
          applysignman: { title: "签单申请人", type: 1, fieldtype: 5 },
          pdfinishman: { title: "配单完成人", type: 1, fieldtype: 5 },
          signman: { title: "签单人", type: 1, fieldtype: 5 },
          czman: { title: "运单操作人", type: 1, fieldtype: 5 },
          mawbprofiter: { title: "运单领用人", type: 1, fieldtype: 5 },
          jyr: { title: "运单外借人", type: 1, fieldtype: 5 },
          djr: { title: "运单登记人", type: 1, fieldtype: 5 },
          bookinger: { title: "运单预订人", type: 1, fieldtype: 5 },
          configman: { title: "运单配单人", type: 1, fieldtype: 5 },
          //总单制作人
          setshipaceman: {
            title: "配舱人",
            type: 1,
            whereStr: "like",
            fieldtype: 5
          },
          orderfinishman: { title: "订单完成人", type: 1, fieldtype: 5 },
          mawbnoconfirmman: {
            title: "总单号确认人",
            type: 1,
            whereStr: "like",
            fieldtype: 5
            //  titleStyle: { minWidth: "114px" }
          },
          pactlsender: {
            title: "发送人",
            type: 1,
            fieldtype: 5,
            titleStyle: { minWidth: "110px" }
          },
          sendman: {
            title: "发送人(AMS)",
            type: 1,
            fieldtype: 5,
            titleStyle: { width: "110px" }
          },
          customername: { title: "客服负责人", type: 1, fieldtype: 5 },
          priceabout: { title: "销售人名称", type: 1, fieldtype: 5 },
          salesname: { title: "销售人", type: 1, fieldtype: 5 },
          ourconfirmman: {
            title: "我司对账人",
            type: 1,
            whereStr: "like",
            fieldtype: 5,
            businesstype: 2
          },
          confirmman: {
            title: "客户确认人",
            type: 1,
            whereStr: "like",
            fieldtype: 5,
            businesstype: 2
          },
          modifyman: { title: "修改人", type: 1, fieldtype: 5 },
          cancelman: { title: "撤单人", type: 1, fieldtype: 5 },
          relshr_deli: {
            title: "收件人",
            type: 1,
            whereStr: "like",
            fieldtype: 5
          },
          receiver: {
            title: "订单接收人",
            type: 1,
            whereStr: "like",
            fieldtype: 5
          }
        },
        userSerColor: defaultUserColor //背景颜色
      };
    },
    created() {
      if (
        this.name == "customerSearch.vue" ||
        this.name == "costConfirmationkf.vue"
      ) {
        this.setWageTitle("客服");
      }
      if (
        this.name == "airLineSearch.vue" ||
        this.name == "costConfirmationhx.vue"
      ) {
        this.setWageTitle("航线");
      }

      if (this.name == "costConfirmation.vue" || this.name == "costConfirmationMonitor.vue" || this.name == "gnCostConfirmMonitor.vue") {
        this.allViewData.wagerejectstatusin.groupid = 201
        this.allViewData.wagerejectstatusout.groupid = 201
        if (this.name != "costConfirmationMonitor.vue") {
          this.setWageTitle("结算");
        }
      }
      console.log(this.name)
      if(this.name=="tzMonitor.vue"){
        this.allViewData.wagerejectstatusin.groupid = 205
        this.allViewData.wagerejectstatusout.groupid = 205
      }

      this.pageBasicField = this.getPageBasicField();
      this.updateViewData();
      this.templateField = this.getTemplateField();
      this.setSearchColor();
    },
    computed: {
      userColorData() {//用户颜色模板设置
        return this.$store.state.tableTmpAll.find(
          i => i.type === 200 && i.name === localStorage.usrname
        );
      },
      userTmpData() {//用户列表模板设置
        return this.$store.state.tableTmpAll.find(
          i =>
            i.url === this.name &&
            i.type === this.type &&
            i.name === localStorage.usrname
        );
      }
    },
    watch: {
      modelData: {
        handler(val) {
          this.getSearchData();
        },
        immediate: true,
        deep: true
      },
      viewData: {
        handler(val) {
          this.getSearchData();
        },
        immediate: true,
        deep: true
      },
      pageshow: {
        handler(val) {
          if (this.$store.getters.userSetting.autoCollapse) {
            this.setPageshow = val;
          } else {
            // 当没有更新setPageshow的值时需要将pageshow的值同步，否则后续外部组件更新pageshow的值时可能不会触发此函数
            this.$emit("update:pageshow", this.setPageshow);
          }
        },
        immediate: true
      },
      setPageshow(val) {
        this.$emit("update:pageshow", val);
      },
      "templateConfig.visible"(val) {
        if (val) {
          this.templateConfig.temporaryField = [...this.templateField];
        }
      }
    },
    methods: {
      setWageTitle(dom) {//设置不同页面的费用选项标题
        this.allViewData.confirmstatus.title = dom + "费用状态";
        this.allViewData.confirmstatus_in.title = dom + "应收状态";
        this.allViewData.confirmstatus_out.title = dom + "应付状态";
        this.allViewData.confirmstatus.options.forEach(i => {
          i.label = dom + i.label;
        });
        this.allViewData.confirmstatus_in.options.forEach(i => {
          i.label = dom + i.label;
        });
        this.allViewData.confirmstatus_out.options.forEach(i => {
          i.label = dom + i.label;
        });
      },
      setSearchColor() {
        this.userSerColor =
          (this.userColorData &&
            this.userColorData.jsondata &&
            JSON.parse(this.userColorData.jsondata)) ||
          this.userSerColor;
      },
      backDefault() {
        this.userSerColor = { ...defaultUserColor };
      },
      setBgcolor(color) {
        if (color)
          //  return {'background-image': 'linear-gradient(45deg, #ff9a9e 40%, #fad0c4 70%, #fad0c4 30%)'};
          return {
            "background-image": `radial-gradient(circle at 15% 25%,${color.replace(
              ")",
              ",0.9)"
            )} 20%, ${color.replace(")", ",0.8)")} 40%, ${color.replace(
              ")",
              ",0.6)"
            )} 60%, ${color.replace(")", ",0.4)")} 80%)`
          };
        //  return  {'background-image':`repeating-linear-gradient(135deg, ${color.replace(')',',1)')} 20px, ${color.replace(')',',0.75)')} 30px, ${color.replace(')',',0.45)')} 30px)`}
        // return {background:`linear-gradient(to bottom right,${color},${color.replace(')',',0.75)')},${color.replace(')',',0.45)')})`}
        return {
          background: `linear-gradient(${color.replace(
            ")",
            ",0.75)"
          )},${color.replace(")", ",0.45)")})`
        };
      },
      moveTags(type, field) {
        //type 1新增 2删除
        if (type == 1) {
          this.templateConfig.temporaryField.push(field);
        } else {
          this.templateConfig.temporaryField = this.templateConfig.temporaryField.filter(
            i => i != field
          );
        }
      },
      updateViewData() {
        //  this.$emit("update:viewData", {});
        let obj = {};
        let selectFields = [
          ...this.pageBasicField[0],
          ...this.getTemplateField()
        ];
        // this.pageBasicField.flat().forEach(field => {
        selectFields.forEach(field => {
          if (this.viewData[field]) {
            obj[field] = { ...this.viewData[field] };
          } else if (this.allViewData[field]) {
            obj[field] = { ...this.allViewData[field] };
          }
        });
        // console.log(Object.keys(obj).length)
        this.$emit("update:viewData", obj);
        this.$nextTick(() => {
          //  console.log(111)
          this.setViewPage();
        });
      },
      // 获取当前页面可用的查询条件
      getPageBasicField() {
        let tempname = this.name;
        //  let sameTableHeadComp = this.$store.state.sameTableHeadComp

        //对帐类
        //应收对账凭证综合查询-对账查询  应收对账中 应收未开票-可开凭证 应付对账凭证综合查询-对账查询 应付对账中 应付未收票-可收凭证
        //['reconMngThd','reconMngSec','credentialMngFir','reconMngThd','reconMngSec','credentialMngFir']
        //账单类
        //应收对账凭证综合查询-已开凭证查询  应收未开票-已开凭证  应付对账凭证综合查询-已收凭证查询 应付未开票-已收凭证
        //['credentialMngSec','credentialMngSec','credentialMngSec','credentialMngSec']
        let dzType = [
          "reconMngThd.vue",
          "reconMngSec.vue",
          "credentialMngFir.vue"
          //  "reconMngFir.vue"
        ]; //对账类型
        let zdType = ["credentialMngSec.vue"]; //账单类型
        let outsideType = ['orderAccepting.vue', 'offertConfirm.vue', 'outBusinessCancel.vue', 'outOrderSearch.vue', 'outOrderImproved.vue','cargoSearch.vue', 'outerAccount.vue', 'outInvoice.vue', 'dataAnaly.vue', "invoiceGet.vue", "reconciliationMng.vue"]
        let fields = [[], []];

        if (dzType.includes(tempname)) {
          fields = [
            [
              "accountcomgid",
              "paymentcomgid",
              "billstatus",
              "pchno",
              "ourconfirmdate",
              "hbrq",
              "ourconfirmman",
              "wageinout"
            ],
            ["pono", "shipperno", "mawb", "confirmman", "hbrq", "addman", "adddate"]
          ];
        } else if (zdType.includes(tempname)) {
          fields = [
            ["accountcomgid", "paymentcomgid", "pzno", "pzdate", "wageinout"],
            ["pzdom", "pono", "shipperno", "mawb", "hbrq", "addman", "adddate"]
          ];
        } else if (outsideType.includes(tempname)) {
          fields = [['pono', 'status', 'mawb', 'hawb', 'hbh', 'hbrq', 'sfg', 'mdg'], ['customername', 'salesname']]
        } else {
          fields = [
            ["pono", "shipperno", "mawb", "fid", "gid", "hbrq", "adddate", "status"],
            [
              "hbh",
              "mdg",
              "czlx",
              "areaname",
              "area",
              "dzstatus",
              "hwstatus",
              "pcstatus",
              "bgstatus",
              "addman",
              "terminalname",
              "hwxz",
              "hawb",
              "khjcno",
              "sfg",
              "servicecodehwcz",
              "salesname",
              "otherno"
            ] //
          ]; //订单类默认的字段
        }
        //以上是公共默认字段，下面是具体的页面分类

        if (
          tempname == "orderSearch.vue" ||
          tempname == "orderSearchMonitor.vue" ||
          tempname == "orderUnfinish.vue" ||
          tempname == "customerSearch.vue"
        ) {
          fields[1].push(
            ...[
              "comboine",
              "iscomboine",
              "isboardgys",
              "setshipaceman",
              "orderconfirmman",
              "mawbgid",
              "loadingmodel",
              "orderno",
              "trackstatus",
              "customstatus",
              "commbillmodifystatus",
              "boardgysname",
              "customername",
              "isclock",
              "confirmstatus",
              "confirmstatus_in",
              "confirmstatus_out",
              "canceling",
              "signman",
              "applysignman",
              "courienum_deli"
            ]
          );
        }
        if (
          tempname == "orderSearch.vue" ||
          tempname == "orderSearchMonitor.vue" ||
          tempname == "customerSearch.vue"
        ) {
          fields[1] = fields[1].filter(i => i != "khjcno");
          fields[1].push(...["ybkhjcno"]);
        }

        if (tempname == "customerSearch.vue") {
          fields[1].push(...["releasestatus", 'pdfinishstatus', 'pdfinishdate', 'pdfinishman']);
        }
        // if (tempname == "customerSearch.vue" || tempname =='airLineSearch.vue') {
        //   fields[1].push(...["signpiece","signweight","signvolume"]);
        // }
        if (tempname == "masterSearch.vue") {
          fields[0] = fields[0].filter(i => i != "fid" && i != "gid");
          fields[1].push(
            ...[
              "fid",
              "gid",
              // "comboine",
              // "iscomboine",
              "isboardgys",
              "mawbgid",
              "loadingmodel",
              "orderno",
              "commbillmodifystatus",
              "trackstatus",
              "boardgysname",
              "isclock",
              "canceling",
              "setshipaceman",
              "orderconfirmman",
              "customername",
              "signman",
              "applysignman"
            ]
          );
        }

        if (tempname == "creditControl.vue") {
          fields[0].push(...["creditisbackstatus"]);
        }

        if (tempname == "customsContactSend.vue") {
          fields[0].push(...["customstatus"]);
        }
        if (
          [
            "customsContactSend.vue",
            "applicationDocuments.vue",
            "danhaoConfirm.vue",
            "danzhengConfirm.vue",
            "costConfirmation.vue",
            "costConfirmationkf.vue",
            "costConfirmationhx.vue",
            "asignSearch.vue",
            "asignSpaceSearch.vue",
            "airLineSearch.vue"
          ].includes(tempname)
        ) {
          if(tempname=='applicationDocuments.vue'){
            fields[0].push("dzstatus")
          }
          fields[1].push(
            ...[
              "signman",
              "applysignman",
              "customername",
              "setshipaceman",
              "orderconfirmman"
            ]
          );
        }

        if (
          tempname == "danhaoConfirm.vue" ||
          tempname == "danzhengConfirm.vue"
        ) {
          if(tempname=="danhaoConfirm.vue"){
            fields[0].push("noconfirmstatus")
          }
          fields[1].push(...["dzconfirmstatus", "noconfirmstatus"]);
        }

        if (
          tempname == "costConfirmationkf.vue" ||
          tempname == "costConfirmationhx.vue"
        ) {
          fields[0].push(
            ...["confirmstatus", "addman", "pcstatus", "orderconfirmman"]
          );
          fields[1].push(
            ...[
              "canceltype",
              "canceling",
              "profitmode",
              "confirmstatus_in",
              "confirmstatus_out",
              "profitmode"
            ]
          );
        }

        if (tempname == "costConfirmationhx.vue") {
          fields[0].push(...["signman", "rollbackroute"]);
        }

        if (tempname == "costConfirmationkf.vue") {
          fields[0].push(...["applysignman", "rollbackcust"]);
        }

        if(tempname=='costConfirmFob.vue'){
          fields[0].push(...["overseasaccsettdate"]);
        }

        if(tempname=='costCheckFob.vue'){
          fields[0].push(...["overseasaccdate","overseasaccsettdate"]);
        }

        if(tempname=='reconMngFirFob.vue'){
          fields[0].push(...["overseasaccdate"])
        }



        if (tempname == "costConfirmation.vue") {
          fields[0].push(...["confirmstatus", "addman"]);
          fields[1].push(
            ...[
              "commitstatus",
              "confirmstatus_in",
              "confirmstatus_out",
              "profitmode",
              "wagerejectstatusin",
              "wagerejectstatusout"
            ]
          );
        }
        if (
          [
            "costConfirmation.vue",
            "costConfirmationkf.vue",
            "costConfirmationhx.vue"
          ].includes(tempname)
        ) {
          fields[0].push(...["orderfinishdate"]);
          fields[1].push(...["rollbackman"]);
        }

        if (tempname == "asignSearch.vue" || tempname == "asignSpaceSearch.vue") {
          fields[0].push(...["dzstatus", "signman"]);
        }

        if (tempname == "asignSpaceSearch.vue") {
          fields[0].push(...["pcstatus"]);
        }

        if (
          tempname == "asignSearch.vue" ||
          tempname == "airLineSearch.vue" ||
          tempname == "asignSpaceSearch.vue"
        ) {
          fields[1].push(
            ...[
              "isboardgys",
              // "setshipaceman",
              //  "pactlsender",
              // "orderconfirmman",
              //  "customername",
              //   "customstatus",
              "mawbgid",
              "bindboae",
              "boardgysname",
              "loadingmodel",
              "trackstatus",
              "setshipacedate"
            ]
          );
        }
        if (tempname == "listConfirm.vue") {
          fields[1].push(...["customername", "orderno"]);
        }
        if (tempname == "listConfirm.vue" && (this.realPageName == 'listConfirmOut' || this.realPageName == 'listConfirmOverDate')) {
          fields[1].push(...["priceabout"]);
        }
        if (
          tempname == "orderTaking.vue" ||
          tempname == "orderTakingOverDate.vue"
        ) {
          fields[1].push(...["orderno"]);
        }

        if (tempname == "axplineDzHawbSearch.vue") {
          fields[0].push(...["isfinished", "isfinished_hawb", "accountinfo"]);
        }

        if (tempname == "cabinUnconfirmed.vue") {
          fields[0] = fields[0].filter(i => i != "mawb");
          fields[1].push(...["mawb"]);
        }

        if (
          tempname == "amsCargoPouch.vue" ||
          tempname == "companyDzLetterSearch.vue" ||
          tempname == "amsSendManual.vue" ||
          tempname == "amsSendDirect.vue" ||
          tempname == "amsSendDirectNormal.vue" ||
          tempname == "amsSendDirectRevised.vue"
        ) {
          fields[1].push(
            ...[
              "isexportform",
              "sendman",
              "sendstatus",
              "safetystatus",
              "cargostatus",
              "pactlsendstatus",
              "commbillmodifystatus",
              "accountinfo",
              "verificationstatus",
              "SPECIAL",
              "hawbsendstatus",
              "orderdom"
            ]
          );
        }
        if (tempname == "amsCargoPouch.vue") {
          fields[0].push(
            ...["cargostatus", "SPECIAL", "verificationstatus", "accountinfo"]
          );
        }
        if (tempname == "companyDzLetterSearch.vue") {
          fields[0].push(
            ...["safetystatus", "SPECIAL", "verificationstatus", "accountinfo"]
          );
        }

         if (tempname == "outOrderImproved.vue") {
          fields[0].push(
            ...["dzstatus"]
          );
        }

        if (tempname == "amsSendManual.vue" || tempname == "amsSendDirect.vue") {
          fields[0].push(...["sendstatus"]);
        }

        // AMS(人工) -> 是否AMS制作查询条件
        if (tempname == "amsSendManual.vue") {
          fields[0].push(...["isamsmake"]);
        }

        if (
          tempname == "pfreportSearch.vue" ||
          tempname == "txdreportSearch.vue"
        ) {
          fields[0].push(...["pactlsendstatus"]);
          fields[1].push(
            ...[
              "pactlsendstatus",
              "pactlsenddate",
              "commbillmodifystatus",
              "realjjdname",
              "pactlsender"
            ]
          );
        }

        if (
          tempname == "gnSearch.vue" ||
          tempname == "gnCostConfirm.vue" ||
          tempname == "gnUnfinish.vue"
        ) {
          fields[0].push(...["receiver", "relshr_deli"]);
          fields[1].push(
            ...[
              "confirmstatus",
              "bindboae",
              "khjcno",
              "flowarea_cltg",
              "flowpoint_cltg",
              "courienum_deli",
              "serviceitemsname",
              "appraisal_inspect",
              "appraisal_chem",
              "thprint"
            ]
          );
        }

        if (tempname == "gnCostConfirm.vue") {
          fields[0].push(...["addman", "confirmstatus"]);
        }

        if (
          tempname == "costConfirmationBack.vue" ||
          tempname == "costMakingApSearch.vue" ||
          tempname == "costMakingApSearchCzz.vue"
        ) {
          fields[0].push(...["confirmstatus", "commitstatus"]);
        }
        if (tempname == "costConfirmationCancel.vue") {
          fields[0].push(...["confirmstatus"]);
        }

        if (tempname == "ctype.vue") {
          fields[0].push(...["isclock"]);
        }
        if (tempname == "costConfirmationBack.vue" || tempname == "ctype.vue") {
          fields[1].push(...[
            "setshipaceman",
            "orderconfirmman",
            "customername",
            "signman",
            "applysignman"
          ]);
        }

        if (tempname == "reconMngFir.vue" || tempname == "reconMngFirIn.vue") {
          fields[1].push(...["fid"]);
          //  fields[1].push(...["status","dzstatus","pcstatus","bgstatus","hwstatus"]);
        }

        if (tempname == "reconMngThd.vue") {
          fields[0].push(...["confirmdate"]);
        }

        if (tempname == "reconMngFir.vue" || tempname == "reconMngFirIn.vue") {
          fields[0].push(...["accountcomgid", "wageinout"]);
        }

        if (tempname == "managerExamine.vue") {
          fields[0].push(
            ...["dzstatus", "system", "areaname", "real_hbrq", "czlx", "jobno", "confirmdate", "examineman_sett", "examinedate_sett"]
          );
          fields[1].push(
            ...["customername", "orderno", "profitmode", "real_hbh", "mawbmdg"]
          );
          fields[0] = fields[0].filter(//去掉默认的公共字段
            i => i != "hbh" && i != "hbrq" && i != "pono" && i != "mdg" && i != "shipperno"
          );
          fields[1] = fields[1].filter(
            i => i != "hbh" && i != "hbrq" && i != "pono" && i != "mdg" && i != "shipperno"
          );
        }

        if (tempname == "docManagement.vue") {
          fields = [
            ['mawb', 'hawb', 'khjcno', 'adddate', 'docstatus', 'filename', 'addman', 'bggys', 'fid', 'customername', 'jydw', 'isbggys'],
            []
          ]
        }

        if (tempname == "costConfirmationMonitor.vue" || tempname == "gnCostConfirmMonitor.vue") {
          fields[0].push(...["confirmstatus"]);
        }
        if (tempname.includes("Monitor") && tempname != 'orderSearchMonitor.vue') {
          fields[0].push(...["addman"]);
          fields[1] = []
        }

        if (tempname == "cargoSearch.vue") {
          fields[0].push(...["hwstatus"]);
          fields[1].push(...["jcdate", "hzdno", "khjcbh", "goodsremark"]);
        }
        if (tempname == "invoiceGet.vue") {
          fields[0].push(...["pzno", "pzdate"]);
          fields[1].push(...["pzdom", "isreceive",]);
        }


        if (tempname == "tzOperation.vue") {
          fields[0]=['jobno','shipperno','mawb','hbrq','wageinout', 'adddate','billStatus']
          fields[1]=['czlx','fid','gid','addman','findate','hawb','otherno','orderno','hbh','mdg','rollback_receiver','dzstatus','hwstatus','pcstatus','bgstatus']
        }

        if (tempname == "tzMonitor.vue") {
          fields[0]=['jobno','shipperno', 'hbrq','mawb','wageinout', 'adddate','billStatus','commitstatus']
          fields[1]=['czlx', 'fid','gid', 'addman','findate','hawb', 'otherno','orderno','hbh','mdg','rollback_receiver','dzstatus','hwstatus','pcstatus','bgstatus']
        }

        if(tempname=='mawbManageNew.vue'||tempname=='alertManage.vue'){
          fields[0]=['mawb','jcpchno','status','bookingstatus','djr','bookinger','bookingkhid']
          fields[1]=['djdate','jydate','bookingdate','aid','hwxz','gid','deprecatedate','configdate','configman']
          if(tempname=='mawbManageNew.vue'){
            fields[0].push('czman')
          }
          if(tempname=='alertManage.vue'){
            fields[0].push('mawbprofiter','jyr')
          }
        }

        if(tempname=='frmCustomJob.vue'){
           fields[0]=['mawb','jobno','approvalstatus','approvaldate','approvalman']
           fields[1]=['fid','gid','real_hbrq','system','czlx','addman']
        }

        let navInfo = this.$store.state.navDataById[this.$route.params.id] || '';//获取路由信息 ，如{ "text": 5321166, "autname": "本站待受理", "temp": "cabinUnconfirmed", "othername": "订单层", "ready01": 5321267 }
        if (navInfo && navInfo.othername == '订单层') {//订单层不显示订单编号
          fields[0] = fields[0].filter(i => i != "shipperno");
          fields[1] = fields[1].filter(i => i != "shipperno");

        }

        // fields[1]=Object.keys(this.allViewData); //显示全部字段

        fields[0] = [...new Set(fields[0])];
        fields[1] = [...new Set(fields[1])];
        let fixedLength = fields[0].length;
        let allfields = [...new Set([...fields[0], ...fields[1]])];
        // console.log([...new Set([...fields[0],...fields[1]])])
        // console.log([allfields.slice(0,fixedLength),allfields.slice(fixedLength,allfields.length)])
        return [
          allfields.slice(0, fixedLength),
          allfields.slice(fixedLength, allfields.length)
        ]; //去掉非固定列中与固定列重复的
        // return fields;
      },
      setViewPage() {//设置选项值
        let groupData = JSON.parse(localStorage.getItem("groupType"));
        let currencyData = JSON.parse(localStorage.getItem("currencyData"));
        let statusData = JSON.parse(localStorage.getItem("statusData"));
        let cargoData = JSON.parse(localStorage.getItem("cargoData"));

        for (var i in this.viewData) {
          var item = this.viewData[i];
          var model = this.modelData[i];

          if (item.type == 1) {
            this.setInputData(i);
          }
          if (item.type == 3) {
            this.setRadioDefault(i);
          }

          if (item.type === 5) {
            // console.log(i)
            this.setMulFunc(i);
          }

          if (item.type === 11) {
            this.setWtxmFunc(i);
          }

          if (item.type == 14) {
            this.setInputData(i);
          }

          if (item.type === 15) {
            this.setdate(i);
          }

          if (item.type === 21) {
            this.setHwlxOptions(i);
          }

          if (item.type == 23) {
            this.setMulFunc(i);
          }

          if (item.groupid || item.dom || item.type == 24) {
            this.$set(
              item,
              "options",
              item.options && item.options.length > 0 ? item.options : []
            );
            this.$set(
              item,
              "hideLabel",
              item.hideLabel && item.hideLabel.length > 0 ? item.hideLabel : []
            );
          }
          var areaArr = [];
          var index = 0;
          if (item.groupid) {
            for (let j in groupData) {
              if (item.groupid == groupData[j].groupid) {
                if (item.groupid == 101) {
                  //查询中的操作站，销售站
                  if (!areaArr.includes(groupData[j].ready04)) {
                    areaArr.push(groupData[j].ready04);
                    this.$set(item.options, areaArr.length - 1, {
                      label: groupData[j].ready04,
                      options: [
                        {
                          value: groupData[j].typename.split("丨")[0],
                          label: groupData[j].typename
                        }
                      ]
                    });
                  } else {
                    let len = areaArr.indexOf(groupData[j].ready04);
                    this.$set(
                      item.options[len].options,
                      item.options[len].options.length,
                      {
                        value: groupData[j].typename.split("丨")[0],
                        label: groupData[j].typename
                      }
                    );
                  }
                } else if (item.groupid == 105) {
                  this.$set(item.options, index, {
                    value: groupData[j][item.bindValue || "typename"],
                    label: groupData[j][item.bindLabel || "ready01"]
                  });
                } else {
                  // this.$set(item.options,index,{ 'value': groupData[j].ready01, 'label': groupData[j].typename })
                  this.$set(item.options, index, {
                    value: groupData[j][item.bindValue || "ready01"],
                    label: groupData[j][item.bindLabel || "typename"]
                  });
                }
                index += 1;
              }
            }
          }

          if (item.dom && item.options) {
            let n = 0;
            let system = item.system || "空出";

            if (item.options.length == 0) {
              for (let m in statusData) {
                if (
                  item.dom == statusData[m].dom &&
                  system == statusData[m].system &&
                  !item.hideLabel.includes(statusData[m].nodename)
                ) {
                  this.$set(item.options, n, {
                    value: String(statusData[m].nodecode),
                    label: statusData[m].nodename
                  });
                  n += 1;
                }
              }
            }
          }

          if (
            item.id == "currency" ||
            i == "currency" ||
            item.id == "currency_out" ||
            i == "currency_out"
          ) {
            for (let j in currencyData) {
              this.$set(item.options, j, {
                value: currencyData[j].cname,
                label: currencyData[j].cname
              });
            }
          }

          if (item.type == 16) {
            item.options[0].detailS = [];
            item.options[1].detailS = [];
            JSON.parse(localStorage.getItem("groupType")).forEach(i => {
              if (i.groupid == 133) {
                if (i.ready02 == "PP") {
                  item.options[0].detailS.push(i.ready01);
                } else {
                  item.options[1].detailS.push(i.ready01);
                }
              }
            });
          }

          if (item.type == 24) {
            let arr = [];
            for (let j in cargoData) {
              if (!arr.includes(cargoData[j].area)) {
                this.$set(item.options, arr.length, {
                  value: cargoData[j].area,
                  label: cargoData[j].area
                });
                arr.push(cargoData[j].area);
              }
            }
          }
        }
      },
      getSearchData() {//生成查询数据
        if (JSON.stringify(this.viewData) == "{}") {
          return;
        }
        var searchData = {};
        var chineseWhere = []; //中文查询条件
        Object.keys(this.modelData).forEach(k => {
          let obj = { title: "", value: "" }; //excel表格中的查询条件
          if (!this.viewData[k]||this.viewData[k].nosearch) {//nosearch，为true时 过滤掉此查询条件
            return;
          }
          obj.title = this.viewData[k].title;

          if (this.viewData[k]) {
            if (this.modelData[k]) {
              let whereStr = this.viewData[k].whereStr;
              let dom = this.viewData[k].dom;
              if (whereStr && !dom) {
                let mData =
                  typeof this.modelData[k] == "string"
                    ? this.modelData[k].trim()
                    : this.modelData[k];

                if (whereStr == "like") {
                  searchData[k] = { like: mData };
                  obj.value = mData;
                }

                if (whereStr == "in" && k != "ccz_confirmstatus_in") {
                  searchData[k] = { in: this.modelData[k] };

                  if (this.viewData[k].options) {
                    let str = "";
                    this.modelData[k].split(",").forEach(v => {
                      this.viewData[k].options.forEach(p => {
                        if (v == p.value) {
                          str += p.label + ",";
                        }
                      });
                    });
                    obj.value = str.substr(0, str.length - 1);
                  }
                } else if (whereStr == "in" && k == "ccz_confirmstatus_in") {
                  if (this.modelData[k].indexOf("700") != -1) {
                    searchData["ccz_confirmstatus_in"] = { begin: 700 };
                  }
                  if (this.modelData[k].indexOf("1") != -1) {
                    searchData["ccz_confirmstatus_in"] = { in: 1 };
                  }
                }

                if (whereStr == "equal") {
                  //等于，输入框默认like,如果希望精确查询用equal
                  searchData[k] = { equal: mData };
                  obj.value = mData;
                }
                if (whereStr == "notlike") {
                  searchData[k] = { notlike: mData };
                  obj.value = mData;
                }
                if (whereStr == "unequal") {
                  searchData[k] = { unequal: mData };
                  obj.value = mData;
                }
              } else if (whereStr && dom) {
                var getIndex = [];
                JSON.parse(localStorage.statusData).forEach(i => {
                  if (this.modelData[k].split(",").includes(i.nodecode)) {
                    getIndex.push(i.nodeindex);
                  }
                });

                if (whereStr == "in") {
                  searchData[k] = { in: getIndex.join(",") };
                } else {
                  searchData[k] = getIndex.join(",");
                }

                if (this.viewData[k].options) {
                  let str = "";
                  this.modelData[k].split(",").forEach(v => {
                    this.viewData[k].options.forEach(p => {
                      if (v == p.value) {
                        str += p.label + ",";
                      }
                    });
                  });
                  obj.value = str.substr(0, str.length - 1);
                }
              } else {
                //whereStr和dom都不存在
                if (this.viewData[k].type == 1) {
                  //输入框默认模糊查询

                  searchData[k] = {
                    like:
                      typeof this.modelData[k] == "string"
                        ? this.modelData[k].trim()
                        : this.modelData[k]
                  };
                  obj.value =
                    typeof this.modelData[k] == "string"
                      ? this.modelData[k].trim()
                      : this.modelData[k];
                } else if (this.viewData[k].type == 7) {
                  searchData[k] = {
                    begin: this.modelData[k][0],
                    end: this.modelData[k][1]
                  };
                } else if (this.viewData[k].type == 15) {
                  let begin = this.modelData[k].begin;
                  let end = "";

                  if (
                    this.modelData[k].end &&
                    this.modelData[k].end.indexOf("NaN") == -1
                  ) {
                    if (this.viewData[k].format) {
                      end = this.modelData[k].end + ":59";
                    } else {
                      end = this.modelData[k].end + " 23:59:59";
                    }
                  }

                  if (begin && !end) {
                    searchData[k] = { begin: begin };
                    obj.value = `开始日期：${begin}`;
                  }
                  if (!begin && end) {
                    searchData[k] = { end: end };
                    obj.value = `结束日期：${end}`;
                  }
                  if (begin && end) {
                    searchData[k] = { begin: begin, end: end };
                    obj.value = `开始日期：${begin},结束日期：${end}`;
                  }
                } else {
                  searchData[k] = this.modelData[k];
                  obj.value = this.modelData[k];
                }
              }
            }
          } else {
            searchData[k] =
              typeof this.modelData[k] == "string"
                ? this.modelData[k].trim()
                : this.modelData[k];
            obj.value = this.modelData[k];
          }

          //取字段值得中文名，特殊类型
          if (this.viewData[k].type == 4 && this.viewData[k].options) {
            this.viewData[k].options.forEach(p => {
              if (obj.value == p.value) {
                obj.value = p.label;
              }
            });
          }

          if (this.viewData[k].type == 14) {
            getxmdata("wtkh").forEach(i => {
              if (i.id == this.modelData[k]) {
                obj.value = i.usr_name;
              }
            });
          }

          if (this.viewData[k].type == 13) {
            getxmdata("wtxmNoname").forEach(i => {
              if (i.id == this.modelData[k]) {
                obj.value = i.usr_name;
              }
            });
          }

          if (this.viewData[k].type == 23 && this.viewData[k].options) {
            let str = "";
            this.modelData[k].split(",").forEach(v => {
              this.viewData[k].options.forEach(p => {
                p.options.forEach(z => {
                  if (v == z.value) {
                    str += z.value + ",";
                  }
                });
              });
            });
            obj.value = str;
          }

          if (obj.title && obj.value) {
            chineseWhere.push(obj);
          }
        });

        //判断必填
        for (let i in this.viewData) {
          if (
            this.viewData[i].required &&
            !this.modelData[i] &&
            !this.viewData[i].hidden
          ) {
            this.$emit(
              "update:required",
              this.viewData[i].title.replace("：", "")
            );
            break;
          } else {
            this.$emit("update:required", "");
          }
        }

        this.$emit("update:searchData", searchData);
        this.$emit("update:chineseWhere", chineseWhere);
      },
      setInputData(i) {
        if (this.viewData[i].whereStr) {
          this.$watch(
            function () {
              return this.viewData[i] && this.viewData[i].whereStr;
            },
            function (newval) {
              if (newval && this.modelData[i]) {
                let obj = `{"${this.viewData[i].whereStr}":"${this.modelData[i]}"}`;
                // console.log(obj);
                this.$set(this.searchData, i, JSON.parse(obj));
              }
            },
            { immediate: true }
          );
        }
      },
      setHwlxOptions(i) {
        this.$watch(
          function () {
            return this.modelData[i];
          },
          function (val) {
            var hwlxOptions = [];
            var groupData = JSON.parse(localStorage.getItem("groupType"));
            groupData.forEach(i => {
              if (i.groupid == 115 && i.typename == val) {
                var ready02 = i.id;
                groupData.forEach(m => {
                  if (m.ready02 == ready02 && m.groupid == 109) {
                    hwlxOptions.push({ label: m.typename, value: m.typename });
                  }
                });
              }
            });

            this.hwlxOptions = hwlxOptions;
          }
        );
      },
      setMulFunc(i) {
        this.$watch(
          function () {
            return this.modelData[i];
          },
          function (newval) {
            this.multipleVal[i] = newval ? newval.toString().split(",") : [];
          },
          { immediate: true }
        );

        this.$watch(
          function () {
            return this.multipleVal[i];
          },
          function (newval) {
            this.$set(this.modelData, i, newval.toString());
          }
        );
      },
      setdate(i) {
        this.$watch(
          function () {
            return (
              this.modelData[i] +
              this.viewData[i].defaultVal +
              this.viewData[i].defaultEnd +
              this.viewData[i].begintype +
              this.viewData[i].endtype
            );
          },
          function (newv, oldv) {
            // console.log(this.modelData[i])
            //  console.log(this.viewData[i])
            //viewData 设置defaultVal是默认开始日期当天  设置defaultEnd默认结束日期当天
            //begintype 开始日期默认值 1加一天 2前三个月 3前一个月 4往前推5天 5往前推1天 6前两个月
            //endtype 结束日期默认值 1,默认当天后一天 2默认当天日期前三个月 3前一个月的最后一天 4默认当天前3一天 5往前推1天
            // let  begin = formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00";
            // let  end = new Date();
            // end.setDate(new Date().getDate() + 1);
            // console.log(this.viewData[i])
            if (this.modelData[i]) return;
            let today = formatDate(new Date(), "yyyy-MM-dd") + " 00:00:00"; //当天日期格式
            let begin = "";
            let end = "";
            let defaultVal = this.viewData[i].defaultVal;
            let defaultEnd = this.viewData[i].defaultEnd;
            let begintype = this.viewData[i].begintype;
            let endtype = this.viewData[i].endtype;
            if (defaultVal && !begintype) {
              begin = today;
            }

            if (defaultVal && begintype) {
              begin = new Date();
              if (begintype == 1) {
                begin.setDate(new Date().getDate() + 1);
              }
              if (begintype == 2) {
                begin.setMonth(begin.getMonth() - 3);
              }
              if (begintype == 3) {
                begin.setMonth(begin.getMonth() - 1);
              }
              if (begintype == 4) {
                begin.setDate(new Date().getDate() - 5);
              }
              if (begintype == 5) {
                begin.setDate(new Date().getDate() - 1);
              }
              if(begintype==6){
                begin.setMonth(begin.getMonth() - 2);
              }
            }

            if (defaultEnd && !endtype) {
              end = new Date();
            }

            if (defaultEnd && endtype) {
              end = new Date();
              if (endtype == 1) {
                end.setDate(new Date().getDate() + 1);
              }
              if (endtype == 2) {
                end.setMonth(end.getMonth() - 3);
              }
              if (endtype == 3) {
                end.setDate(0)
              }

              if (endtype == 4) {
                end.setDate(new Date().getDate() - 3);
              }
              if (endtype == 5) {
                end.setDate(new Date().getDate() - 1);
              }
            }
            begin = begin
              ? formatDate(new Date(begin), "yyyy-MM-dd") + " 00:00:00"
              : "";
            end = end ? formatDate(new Date(end), "yyyy-MM-dd") : "";

            this.$set(this.modelData, i, { begin: begin, end: end });
          },
          { immediate: true }
        );
      },
      getFlowAreaArr(id) {
        //流向区域
        if (!this.modelData[id]) {
          return [];
        }
        let cargoData =
          this.modelData[id] == "仓库"
            ? JSON.parse(localStorage.cargoData)
            : JSON.parse(localStorage.jjd);
        let arr = [];
        cargoData.map(item => {
          if (item.area == (this.area || this.$store.state.areaState)) {
            if (this.modelData[id] == "仓库") {
              arr.push(item.storename);
            } else {
              arr.push(item.cname);
            }
          }
        });
        return arr;
      },
      selmultiAll(k) {
        //下拉全选
        if (this.multipleVal[k].length == this.viewData[k].options.length) {
          this.multipleVal[k] = [];
        } else {
          this.multipleVal[k] = this.viewData[k].options.map(i => i.value);
        }
      },
      formatField(field) {
        //当值改变时，将联动的字段赋值为空
        if (field) {
          this.$set(this.modelData, field, "");
        }
      },
      getWtkhMsg(val, type, linkage) {
        this.modelData[linkage] = "";
        //  console.log(val)
        //  console.log(type)
        //type 1新增 2查询表单
        var wtxmData = [];
        // var wtxm=JSON.parse(localStorage.getItem('wtxm'))
        var wtxm = getxmdata("wtxmNoname");

        if (val.id) {
          wtxmData = wtxm.filter(i => i.fid == val.id && i.customxz != 2);
        } else {
          //  wtxmData=wtxm
          wtxmData = [];
        }

        if (type == 1) {
          this.wtkhRowdata = val;
        } else {
          this.wtxmData = wtxmData;
        }

        this.$emit("wtdataP", {
          wtkhname: val.usr_name,
          wtkhcode: val.usr_code,
          wtxmname: "",
          wtxmcode: ""
        });
      },
      // 获取查询条件模板数据，模板只保存非固定列的字段，没有模板时默认每个类别最多7个查询条件
      getTemplateField() {
        let template = [];
        if (this.userTmpData) {
          template = JSON.parse(this.userTmpData.jsondata);
        } else {
          template = this.getDefaultTemplate();
        }
        return template;
      },
      getDefaultTemplate() {
        let template = [];
        let obj = {};
        this.pageBasicField[0].forEach(field => {

          if (!obj[this.allViewData[field].fieldtype])
            obj[this.allViewData[field].fieldtype] = [];
          obj[this.allViewData[field].fieldtype].push(field);
        });

        this.pageBasicField[1].forEach(field => {
          if (!this.allViewData[field]) {
            console.error(field);
            return;
          }
          if (!obj[this.allViewData[field].fieldtype])
            obj[this.allViewData[field].fieldtype] = [];
          // 每个类别固定列加非固定列最多显示7个
          if (obj[this.allViewData[field].fieldtype].length >= 7) return;
          obj[this.allViewData[field].fieldtype].push(field);
          // 非固定列字段加入到模板中
          template.push(field);
        });
        return template;
      },
      // 获取已选字段，根据用户模板或者临时模板获取
      getSelectedFieldByFieldtype(fieldtype, temp) {
        //  console.log(fieldtype)
        // console.log(temp)
        let result = [];
        // 从固定列和模板字段中查找字段
        [...this.pageBasicField[0], ...temp].forEach(field => {
          if (
            this.allViewData[field] &&
            this.allViewData[field].fieldtype === fieldtype
          ) {
            result.push(field);
          }
        });
        // console.log(result)
        return [...new Set(result)];
      },
      // 获取未选字段
      getNotSelectFieldByFieldtype(fieldtype) {
        let result = [];
        this.pageBasicField[1]
          .filter(i => !this.templateConfig.temporaryField.includes(i))
          .forEach(field => {
            if (
              this.allViewData[field] &&
              this.allViewData[field].fieldtype === fieldtype
            ) {
              result.push(field);
            }
          });
        //
        if (this.pageBasicField && Array.isArray(this.pageBasicField)) {
          let basicArr = this.pageBasicField.flat() || []
          let arr = [];
          Object.keys(this.allViewData).forEach(i => {
            if (this.allViewData[i].fieldtype == fieldtype && !basicArr.includes(i)) {
              if (this.name == 'managerExamine.vue' && !['pono', 'hbh', 'hbrq', 'mdg'].includes(i)) {
                arr.push(i)
              }
              if (this.name != 'managerExamine.vue' && !['jobno', 'real_hbh', 'real_hbrq', 'mawbmdg'].includes(i)) {
                arr.push(i)
              }
            }
          })
          if (this.name == 'tZsearch.vue') {
            arr.push(...['jobno'])
          }
          result.push(...arr); //显示全部字段
        }

        return [...new Set(result)];
      },
      removeTemplateField(field) {
        let index = this.templateField.indexOf(field);
        this.templateField.splice(index, 1);
        this.updateViewData();
        // delete this.searchData[field]
        delete this.modelData[field];
      },
      dragStart(field, from) {
        this.templateConfig.dragField = field;
        this.templateConfig.dragFrom = from;
      },
      dragEnd() {
        this.templateConfig.dragField = "";
        this.templateConfig.dragFrom = "";
        // 清除样式状态
        this.$nextTick(() => {
          this.$refs.selectDropArea.style.background = "";
          $(this.$refs.selectDropArea)
            .find(".field-item:not(.fixed)")
            .css({ paddingLeft: "10px" });
          // 对于没有固定列的情况，第一个元素不能添加paddingleft，否则位置会偏移
          $(this.$refs.selectDropArea)
            .find(".field-item:not(.fixed):first-child")
            .css({ paddingLeft: "0" });

          this.$refs.notSelectDropArea.style.background = "";
        });
      },
      dragEnter(ev, area) {
        if (area === "select-area") {
          if (
            this.$refs.selectDropArea === ev.target ||
            this.$refs.selectDropArea.contains(ev.target)
          ) {
            this.$refs.selectDropArea.style.background = "#e8e8e8";
          }

          let $target = $(ev.target);
          let $fieldItem = null;
          if ($target.hasClass("field-item-c")) {
            $target.find(":not(.fixed)").css({ paddingLeft: "10px" });
            $target.find(":not(.fixed):first-child").css({ paddingLeft: "0" });
            return;
          } else if ($target.hasClass("field-item")) {
            $fieldItem = $target;
          } else if ($target.is("span")) {
            $fieldItem = $target.parent();
          }

          if ($fieldItem.hasClass("fixed")) return;

          $fieldItem.siblings(":not(.fixed)").css({ paddingLeft: "10px" });
          $fieldItem
            .siblings(":not(.fixed):first-child")
            .css({ paddingLeft: "0" });
          $fieldItem.css({ paddingLeft: "160px" });
        } else if (area === "not-select-area") {
          if (
            this.$refs.notSelectDropArea === ev.target ||
            this.$refs.notSelectDropArea.contains(ev.target)
          ) {
            this.$refs.notSelectDropArea.style.background = "#e8e8e8";
          }
        }
      },
      dragLeave(ev, area) {
        if (area === "select-area") {
          if (!this.$refs.selectDropArea.contains(ev.fromElement)) {
            this.$refs.selectDropArea.style.background = "";
            $(this.$refs.selectDropArea)
              .find(".field-item:not(.fixed)")
              .css({ paddingLeft: "10px" });
            $(this.$refs.selectDropArea)
              .find(".field-item:not(.fixed):first-child")
              .css({ paddingLeft: "0" });
          }
        } else if (area === "not-select-area") {
          if (!this.$refs.notSelectDropArea.contains(ev.fromElement)) {
            this.$refs.notSelectDropArea.style.background = "";
          }
        }
      },
      onDrop(ev, area) {
        let {
          activeFieldtype,
          dragField,
          dragFrom,
          temporaryField: [...temporaryField]
        } = this.templateConfig;

        if (area === "select-area") {
          let dropField = null;
          let $target = $(ev.target);
          if ($target.is("span")) {
            dropField = $target.parent().attr("data-field");
          } else if ($target.hasClass("field-item")) {
            dropField = $target.attr("data-field");
          }

          if (dragFrom === "select-area") {
            if (dragField === dropField) return;
            temporaryField.splice(temporaryField.indexOf(dragField), 1);
            // 替换位置
            if (dropField) {
              temporaryField.splice(
                temporaryField.indexOf(dropField),
                0,
                dragField
              );
            } else {
              temporaryField.push(dragField);
            }
          } else if (dragFrom === "not-select-area") {
            if (dropField) {
              temporaryField.splice(
                temporaryField.indexOf(dropField),
                0,
                dragField
              );
            } else {
              temporaryField.push(dragField);
            }

            // 插入新增字段之后如果超过7个字段则删除最后多出来的字段
            let selectField = this.getSelectedFieldByFieldtype(
              activeFieldtype,
              temporaryField
            );
            if (selectField.length > 7) {
              let lastField = selectField[selectField.length - 1];
              temporaryField.splice(temporaryField.indexOf(lastField), 1);
            }
          }
        } else if (area === "not-select-area") {
          if (dragFrom === "select-area") {
            temporaryField.splice(temporaryField.indexOf(dragField), 1);
          }
        }

        this.templateConfig.temporaryField = temporaryField;
      },
      saveTemporaryField(temtype = 1) {
        //temtype 1 字段模板 2颜色分类模板
        this.templateField = [...new Set(this.templateConfig.temporaryField)];
        let data = [];
        let method = "";
        let jsondata = JSON.stringify(this.templateField);
        let type = this.type;
        let flag = this.userTmpData;

        if (temtype == 2) {
          jsondata = JSON.stringify(this.userSerColor);
          type = 200;
          flag = this.userColorData;
        }

        if (!flag) {
          method = "post";
          data.push({
            isactivate: 1,
            jsondata,
            logname: localStorage.getItem("usrname"),
            name: localStorage.getItem("usrname"),
            czman: localStorage.getItem("usrname"),
            type,
            url: this.name,
            project: "bomanagement",
            logExtraData: this.logExtraDataForBuild
          });
        } else {
          method = "put";
          data.push({
            czman: localStorage.getItem("usrname"),
            id: flag.id,
            isactivate: flag.isactivate,
            jsondata,
            logname: localStorage.getItem("usrname"),
            name: localStorage.getItem("usrname"),
            type,
            url: this.name,
            project: "bomanagement",
            logExtraData: this.logExtraDataForBuild
          });
        }
        // console.log( JSON.stringify(this.templateField))
        // return
        this.$axios({
          method: method,
          url: this.$store.state.publicWebApi + "api/UserTempletList",
          data,
          noarea: true,
          loading: true,
          tip: true
        }).then(async result => {
          if (result.data.resultstatus === 0) {
            await this.getTemp().then(res => {
              this.updateViewData();
            });
            this.templateConfig.visible = false;
          } else {
            this.$message.error(result.data.resultmessage);
          }
        });
      },
      async getTemp() {
        await this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/UserTemplet",
          params: {
            logname: localStorage.getItem("usrname"),
            project: "bomanagement"
          },
          loading: false,
          tip: false
        }).then(results => {
          this.$store.commit("setTableTmpAll", results.data);
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  .fieldtype-1 {
    background: linear-gradient(rgba(211, 235, 255, 0.6),
        rgba(177, 213, 244, 0.6));
  }

  .fieldtype-2 {
    background: linear-gradient(rgba(255, 222, 222, 0.6),
        rgba(244, 189, 189, 0.6));
  }

  .fieldtype-3 {
    background: linear-gradient(rgba(254, 234, 207, 0.6),
        rgba(255, 222, 180, 0.6));
  }

  .fieldtype-4 {
    background: linear-gradient(rgba(225, 224, 255, 0.6),
        rgba(201, 199, 254, 0.6));
  }

  .fieldtype-5 {
    background: linear-gradient(rgba(199, 245, 189, 0.6),
        rgba(174, 235, 162, 0.6));
  }

  .new-search-comp {
    .searchCmpt {
      display: flex;
      justify-content: space-between;
      transition: height 0.3s;
      flex-wrap: nowrap;
      overflow: auto;

      &::after {
        content: ".";
        display: block;
        height: 100%;
        width: 13px;
        visibility: hidden;
      }

      .fieldtype-c {
        width: 310px;
        padding: 8px 10px;
        // border: 1px solid #e8e8e8;
        border-radius: 3px;
        margin-right: 13px;
        flex-grow: 1;

        .fieldtype-title {
          .title {
            font-size: 16px;
          }

          .add-btn {
            float: right;
            color: #409eff;
            cursor: pointer;
          }
        }

        .input-c {
          position: relative;
          height: 30px;
          margin: 12px 0;

          .input-item {
            // width: 288px;
            min-width: 288px;
            border-radius: 3px;
            font-size: 14px;
            flex-grow: 1;
            margin-right: 2px;
            background: #fff;
            // .input-title {
            //   margin-left: 5px;
            // }
          }

          .remove-btn {
            position: absolute;
            z-index: 10;
            overflow: hidden;
            top: 3px;
            right: 1px;
            width: 2px;
            height: 24px;
            border-radius: 0 4px 4px 0;
            background: #eb0000;
            color: #fff;
            text-align: center;
            line-height: 24px;
            cursor: pointer;
            transition: all 0.2s;

            &.fixed {
              background: #999999;
            }
          }

          &:hover {
            .remove-btn.active {
              width: 25px;
              right: -23px;
            }
          }
        }
      }
    }

    .page-show-c {
      .spanSlide {
        width: 105px;
        height: 35px;
        float: right;
        margin-top: 12px;
        cursor: pointer;
      }

      .slideOff {
        background: url("../../../boStatic/images/slideOff.png") no-repeat;
      }

      .slideOn {
        background: url("../../../boStatic/images/slideOn.png") no-repeat;
      }
    }

    .template-config-c {
      display: flex;
      flex-direction: column;

      .fieldtype-title-c {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #e8e8e8;

        .fieldtype-title-item {
          width: 170px;
          height: 50px;
          border-radius: 3px;
          text-align: center;
          line-height: 50px;
          // background: #e8e8e8;
          cursor: pointer;

          &.active {
            // color: #fff;
            // background: #0e5a8c;
            color: red;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 5px 5px 5px #888888;
          }
        }
      }

      h6 {
        margin-bottom: 20px;
        border-bottom: 1px solid #e8e8e8;
        vertical-align: middle;
        display: flex;
        align-items: center;
        //  justify-content: space-between;
      }

      .select-area {
        .area-title {
          display: flex;
          justify-content: space-between;

          .title-left {
            .title {
              color: #000;
              font-weight: bold;
              font-size: 16px;
            }
          }

          .title-right {
            span {
              display: inline-block;
              margin-left: 15px;

              &::before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                margin-right: 10px;
              }

              &.default::before {
                background: #6c808b;
              }

              &.draggable::before {
                background: #11af00;
              }
            }
          }
        }

        .field-item-c {
          display: flex;
          flex-wrap: nowrap;
          overflow: hidden;
          transition: background 0.3s;
          min-height: 50px;

          .field-item {
            padding-top: 20px;
            padding-bottom: 20px;
            transition: padding-left 0.3s;

            span {
              display: inline-block;
              width: 130px;
              height: 35px;
              border-radius: 3px;
              line-height: 35px;
              text-align: center;
              color: #11af00;
              font-weight: 600;
              background: rgba(13, 176, 0, 0.2);
              cursor: pointer;
              overflow: hidden;
              position: relative;
            }

            +.field-item {
              padding-left: 12px;
            }

            &.fixed span {
              color: #606266;
              background: #d4d9dd;
            }

            &.drag span {
              opacity: 0.5;
            }

            i {
              position: absolute;
              right: 0px;

              &:hover {
                color: white;
                border-radius: 50%;
                background: #e6a23c;
              }
            }
          }
        }
      }

      .not-select-area {
        .area-title {
          color: #000;
          font-weight: bold;
          font-size: 16px;
        }

        .field-item-c {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          min-height: 75px;
          padding-top: 20px;
          transition: background 0.3s;

          .field-item {
            width: 130px;
            height: 35px;
            border-radius: 3px;
            line-height: 35px;
            text-align: center;
            color: #11af00;
            font-weight: 600;
            background: rgba(13, 176, 0, 0.2);
            cursor: pointer;
            margin-right: 12px;
            margin-bottom: 20px;
            overflow: hidden;
            position: relative;

            &:nth-child(7n) {
              margin-right: 0;
            }

            &.drag {
              opacity: 0.5;
            }

            i {
              position: absolute;
              right: 0px;

              &:hover {
                color: white;
                border-radius: 50%;
                background: #67c23a;
              }
            }
          }
        }
      }

      .btn-c {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .searchCmpt {
    /deep/ input {
      border: none;
      text-align: right;
      padding: 0 22px 0 0px;
      color: red;
    }

    /deep/ .el-range-input {
      min-width: 65px;
      border: none;
      padding: 0px;
    }

    /deep/ .el-date-editor--daterange {
      position: relative;
      right: 32px;
      border: none;
      padding: 0px;
    }

    /deep/ .el-range-separator {
      height: 20px;
      line-height: 20px;
    }

    /deep/ .el-select .el-tag {
      color: red;
    }

    .rangeDate {
      /deep/ .el-input__prefix {
        display: none;
      }

      /deep/ .el-input__inner {
        padding: 0 3px;
      }
    }

    .input-item {
      //  width: 288px;
      min-width: 288px;
      display: flex;
      flex-grow: 1;
      align-items: center;
      border: 1px solid #c0c9d0;
      border-radius: 4px;
      font-size: 14px;
      margin-right: 2px;
      justify-content: space-between;
    }

    .input-title {
      color: #555;
      text-align: left;
      padding-left: 6px;
      // min-width: 80px;
      padding-right: 0px;
      word-break: keep-all;
    }

    .input-content {
      flex-grow: 1;
      overflow: hidden;

      div.whereSelect {
        width: 60px;

        /deep/ input {
          min-width: 60px;
          color: #606266;
        }
      }
    }

    .input-content .el-select {
      width: 100%;
    }
  }

  .myColorPicker {
    margin-right: 20px;

    span {
      display: flex;
      align-items: center;
    }

    /deep/ .el-color-picker__trigger {
      width: 26px;
      height: 20px;
      transform: translateY(5px);
      border: none;
    }

    /deep/ .el-color-picker__empty {
      display: none;
    }

    /deep/ .el-color-picker__icon {
      display: none;
    }
  }

  .itemDisabled {
    cursor: not-allowed;
    background-color: #f0f0f0 !important;

    /deep/ input {
      background-color: #f0f0f0;
    }

    /deep/ label {
      pointer-events: none;
    }

    div {
      pointer-events: none;

      /deep/ .el-input__suffix {
        display: none;
      }
    }
  }

  .contentDisabled {
    cursor: not-allowed;

    /deep/ input {
      background-color: #f0f0f0;
      pointer-events: none;
    }

    /deep/ label {
      pointer-events: none;
    }

    div {
      pointer-events: none;

      /deep/ .el-input__suffix {
        display: none;
      }

      /deep/ input {
        pointer-events: none;
      }
    }
  }
</style>