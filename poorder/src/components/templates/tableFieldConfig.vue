<template>
  <div>
    <div class="tableFieldConfig">
      <el-select v-model="selectedJsondata" placeholder="可自定义表格显示字段" style="width:220px;" title="列表模板">
        <el-option v-for="item in tmpArr" @click.native="defaultActive(item)" :key="item.value" :label="item.name"
          :value="item.jsondata">
          <span style="float: left">{{ item.name }}</span>

          <i class="el-icon-circle-close" style="float: right;color:#F56C6C;margin-left:3px;margin-top:8px;"
            @click.stop="deleteTmp(item.id, item.name)"></i>

        </el-option>
      </el-select>
      <!-- <el-select v-model="activeColorTempID" placeholder="可自定义状态颜色" style="width:220px;" title="颜色模板">
        <el-option v-for="item in statusColorTempAll" @click.native="defaultColorTempActive(item)" :key="item.name" :label="item.name"
          :value="item.id">
          <span style="float: left">{{ item.name }}</span>

          <i class="el-icon-circle-close" style="float: right;color:#F56C6C;margin-left:3px;margin-top:8px;"
            @click.stop="deleteColorTmp(item.id, item.name)"></i>

        </el-option>
      </el-select> -->
      <el-button type="primary" @click="dialogTableVisible = true">模板设置</el-button>
    </div>

    <!-- 传送框 -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      class="tableConfig"
      v-if="dialogTableVisible"
      top="2%"
      append-to-body
      width="1100px">

      <el-tabs>
        <el-tab-pane label="列表模板">

          <div class="field-container">
            <div class="show-field">
              <div>
                <h3 class="title">
                  显示字段
                  <span v-if="curTempName" class="temp-name">（当前模板：{{ curTempName }}）</span>
                </h3>
                <el-checkbox class="checkall" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" label="全选"></el-checkbox>
              </div>

              <div class="checkbox-row" @dragover="$event.preventDefault()" @drop="checkboxDrop($event)">

                <div class="checkboxgroup">

                  <!-- 固定字段 -->
                  <el-checkbox-group v-model="tablePageFixedBasic">
                    <el-checkbox
                      class="checkbox-item disabled"
                      v-for="(item, index) in tablePageFixedBasic"
                      :key="index"
                      :disabled="true"
                      :title="item.title"
                      :label="item">
                      <span class="number">{{ String(index+1).padStart(2, '0') }}</span>
                      {{ item.title }}
                    </el-checkbox>
                  </el-checkbox-group>

                  <!-- 选择字段 -->
                  <el-checkbox-group v-model="valueTrans">
                    <el-checkbox
                      class="checkbox-item"
                      draggable="true"
                      v-for="(id, index) in [...valueTrans.slice(0, 20-tablePageFixedBasic.length)]"
                      @dragstart.native="dragStart($event, id)"
                      :data-item="id"
                      :key="index"
                      :title="idToTitle[id]"
                      :label="id">
                      <span class="number">{{ String(tablePageFixedBasic.length+index+1).padStart(2, '0') }}</span>
                      {{ idToTitle[id] }}
                    </el-checkbox>
                  </el-checkbox-group>

                </div>
                <!-- 将第一列和后面的列分开，防止因为第一列加入了固定字段导致后续的字段位置出错 -->
                <div class="checkboxgroup" v-for="row_index in Math.ceil((tablePageFixedBasic.length + valueTrans.length)/20 || 1) - 1" :key="row_index">

                  <!-- 选择字段 -->
                  <el-checkbox-group v-model="valueTrans">
                    <el-checkbox
                      class="checkbox-item"
                      draggable="true"
                      v-for="(id, index) in [...valueTrans.slice(row_index*20-tablePageFixedBasic.length, (row_index+1)*20-tablePageFixedBasic.length)]"
                      @dragstart.native="dragStart($event, id)"
                      :data-item="id"
                      :key="index"
                      :title="idToTitle[id]"
                      :label="id">
                      <span class="number">{{ String(row_index*20+index+1).padStart(2, '0') }}</span>
                      {{ idToTitle[id] }}
                    </el-checkbox>
                  </el-checkbox-group>

                </div>

              </div>
              <div class="trans-icon"></div>
            </div>

            <div class="sort-field">
              <div class="sort-title-c">
                <h3 :class="['sort-title',{active: activeLib == '3'}]" @click="activeLib = '3';highlightFieldIndex = ''">订单层</h3>
                <h3 :class="['sort-title',{active: activeLib == '1'}]" @click="activeLib = '1';highlightFieldIndex = ''">出口业务层</h3>
                <h3 :class="['sort-title',{active: activeLib == '4'}]" @click="activeLib = '4';highlightFieldIndex = ''">进口业务层</h3>
                <h3 :class="['sort-title',{active: activeLib == '2'}]" @click="activeLib = '2';highlightFieldIndex = ''">国内业务层</h3>
                <div :class="['field-search-select-c', { 'hidden': !showFieldSearchSelect }]">
                  <el-select class="search-select" v-model="fieldSearchIndex" clearable filterable :filter-method="fieldSearchFunc" placeholder="请输入进行搜索">
                    <template slot="prefix">
                      <i @click.stop="showFieldSearchSelect = !showFieldSearchSelect" class="el-icon-search"></i>
                    </template>
                    <template v-if="fieldSearchOptions.length > 0">
                      <el-option
                        v-for="(item, index) of fieldSearchOptions"
                        :key="item.title + item.activeLib + item.fieldtype"
                        :label="item.title"
                        :value="index + ',' + item.title">
                        <div
                          class="option-content"
                          style="display: flex;justify-content: space-between;">
                          <span class="title" style="margin-right: 5px;">{{ item.title }}</span>
                          <span class="lib" style="font-size: 12px;color: #C0C4CC;">
                            {{ activeLibNameObj[item.activeLib] }}
                          </span>
                        </div>
                      </el-option>
                    </template>
                  </el-select>
                </div>
              </div>
              <div :class="['sort-subtitle-wrapper', {'showList': showFieldTypeList}]" tabindex="0" @blur="showFieldTypeList = false">
                <i
                  class="el-icon-caret-left"
                  @click="showFieldTypeList = !showFieldTypeList"
                  v-if="activeLib == '2'">
                </i>
                <ul class="sort-subtitle-c" :style="{top: FieldTypeListTop}" ref="fieldTypeUlRef">
                  <li
                    v-for="(field, index) in fieldTypeArr"
                    :class="['title',{active: index == curFieldTypeIndex},{setWidth: activeLib == '2'}]"
                    :style="{color: index == curFieldTypeIndex ? sortFieldBackgroundArr[curFieldTypeIndex%6][1]: ''}"
                    :key="index"
                    @click="curFieldTypeIndex = index;highlightFieldIndex = ''">
                    {{ field.title }}
                  </li>
                </ul>
              </div>
              <div class="checkbox-row" :style="sortFieldBackground" ref="fieldCheckboxRow">
                <el-checkbox-group v-model="valueTrans" class="checkboxgroup">
                  <el-checkbox
                    v-for="(item, key, index) in curTableField"
                    :key="key"
                    :label="dataTrans[key] && dataTrans[key].id"
                    :disabled="!dataTrans[key]"
                    :title="dataTrans[key] ? dataTrans[key].title : item.title"
                    :class="[key, { 'highlight': index === highlightFieldIndex }]">
                    {{ dataTrans[key] ? dataTrans[key].title : item.title }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div class="background-text">
                {{ fieldTypeArr[curFieldTypeIndex].title }}
              </div>
            </div>
          </div>

          <div class="btn-c">
            <el-button type="primary" @click="showSavetemp=!showSavetemp">保存模板</el-button>
            <el-button type="primary" @click="setTemporaryTemp" title="应用为临时模板">应用</el-button>
          </div>

          <div class="savetemp-c" v-show="showSavetemp">
            <el-input v-model="tableTemName" placeholder="请输入模板名称" class="input-required" ref="tableTemNameInput"></el-input>
            <!-- <el-button type="primary" @click="saveTableTmp">保存</el-button> -->
            <el-button type="primary" @click="saveTableTmp('2')" v-if="curTempID !== ''">修改当前模板</el-button>
            <el-button type="primary" @click="saveTableTmp('1')">保存为新模板</el-button>
          </div>

        </el-tab-pane>
        <el-tab-pane label="颜色模板">
          <statusColorConfig @change="dialogTableVisible = false"></statusColorConfig>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

  </div>
</template>

<script>
import statusColorConfig from './statusColorConfig'

export default {
  props: {
    name: String,
    showZiConfig: {
      type: Boolean,
      default: false
    }
  },
  components: {
    statusColorConfig
  },
  data () {
    return {
      checkAll: false,
      isIndeterminate: true,

      tmpArr: [], // 父模板选择数组
      tmpArrChild: [], // 子模板选择数组

      tablePageTmp: [], // 最终用于显示的表格数据
      tablePageBasic: [], // 基础表格数据，包含所有字段
      tablePageTmpC: [], // 子表格
      tablePageBasicC: [],

      selectedJsondata: '', // 父下拉框的value
      childValue: '', // 子下拉框的value

      dialogTableVisible: false, // 全屏弹窗
      tableTemVisible: false, // 表格新增修改弹窗
      showSavetemp: false, // 保存模板的输入框

      curTempID: '', // 当前模板id
      curTempName: '', // 当前模板名称
      tableTemName: '', // 模板新名称
      valueTrans: [], // 父模板穿梭框右侧值
      valueTrans2: [], // 子模板穿梭框右侧值

      tem: '1', // 新增还是修改模板
      muban: '', // 被替换模板名称
      mubanC: '', // 被替换子模板名称

      parentChild: 1, // 父子模板切换

      sameTableHeadCompIndex: -1,

      activeLib: '1', // 字段库  1:空出订单  2:国内订单
      fieldSearchIndex: '',
      fieldSearchOptions: [],
      highlightFieldIndex: '',
      showFieldSearchSelect: false,

      showFieldTypeList: false, // 显示国内订单下面的分类的下拉
      FieldTypeListTop: '0px', // 分类下拉的ul的top值，做动画切换用

      curFieldTypeIndex: 0,
      fieldTypeArr1: [ // 空出订单分类
        {title: '订单类', type: 3},
        {title: '单号类', type: 1},
        {title: '操作类', type: 4},
        {title: '状态类', type: 5},
        {title: '日期类', type: 6},
        {title: '费用类', type: 2}
      ],
      fieldTypeArr2: [ // 国内订单分类
        {title: '基本信息', type: 17},
        {title: '入仓', type: 1},
        {title: '提货', type: 2},
        {title: '报关', type: 3},
        {title: '总单制单', type: 4},
        {title: '分单制单', type: 5},
        {title: '制作Manifest', type: 6},
        {title: '制作总标签', type: 7},
        {title: '制作分标签', type: 8},
        {title: '安检', type: 9},
        {title: '交单', type: 10},
        {title: '快递', type: 11},
        {title: '磁检', type: 12},
        {title: '改包装', type: 13},
        {title: '化工鉴定', type: 14},
        {title: '挂衣', type: 15},
        {title: '贴签', type: 16},
        {title: '材料', type: 18},
        {title: '大件装卸', type: 19}
      ],
      fieldTypeArr4:[
        {title:'订单类', type: 3},
        {title: '单号类', type: 1},
        {title: '操作类', type: 4},
        {title: '状态类', type: 5},
        {title: '日期类', type: 6},
      ],//进口业务层

      sortFieldBackgroundArr: [
        ['#93b9ee', '#7b9ece'],
        ['#efa298', '#db877c'],
        ['#59b9c0', '#4ba0a7'],
        ['#f1b65b', '#dfa548'],
        ['#8aca91', '#80bb87'],
        ['#b78cdb', '#a575c9']
      ],

      allTableTmpField1: { // 空出订单字段
        // fieldtype:3 订单类
        sfg: { title: '始发港', fieldtype: 3 },
        mdg: { title: '目的港', fieldtype: 3 },
        mawbmdg: { title: '目的港', fieldtype: 3 },
        zzg: { title: '中转港', fieldtype: 3 },
        czlx: { title: '操作类型', fieldtype: 3 },
        mawblx:{title: '运单类型', fieldtype: 3 },
        hwxz: { title: '货物性质', fieldtype: 3 },
        hwlx: { title: '货物类型', fieldtype: 3 },
        batterymodel: { title: '锂电池型号', fieldtype: 3 },
        englishpm: { title: '英文品名', fieldtype: 3 },
        chinesepm: { title: '中文品名', fieldtype: 3 },
        hbzl: { title: '航班种类', fieldtype: 3 },
        orderdom: { title: '订单类型', fieldtype: 3 },
        loadingmodel: { title: '配载方式', fieldtype: 3 },
        hawbnum: { title: '分运单票数', fieldtype: 3 },
        islocal: { title: '是否设置本站操作', fieldtype: 3 },
        thprint: { title: '是否打印', fieldtype: 3 },
        accountweightin: { title: '结算重量(应收)', fieldtype: 3 },
        accountweightout: { title: '结算重量(应付)', fieldtype: 3 },
        gysname: { title: '运单供应商', fieldtype: 3 },
        boardgysname: { title: '外场供应商', fieldtype: 3 },
        isboardgys: { title: '是否存在外场供应商', fieldtype: 3 },
        mawbss: { title: '运单所属', fieldtype: 3 },
        hbh: { title: '航班号', fieldtype: 3 },
        real_hbh: { title: '航班号', fieldtype: 3 },
        yqhbh: { title: '要求航班号', fieldtype: 3 },
        yqqcts: { title: '要求全程天数', fieldtype: 3 },
        realqcts: { title: '实际全程天数', fieldtype: 3 },
        ybjzt: { title: '预报件重体', fieldtype: 3 },
        sjjzt: { title: '实际件重体', fieldtype: 3 },
        dzjzt: { title: '制单件重体', fieldtype: 3 },
        signjzt: { title: '签单件重体', fieldtype: 3 },
        ybpiece: { title: '预报件数', fieldtype: 3 },
        ybweight: { title: '预报重量', fieldtype: 3 },
        ybvolume: { title: '预报体积', fieldtype: 3 },
        realpiece: { title: '实际件数', fieldtype: 3 },
        realweight: { title: '实际重量', fieldtype: 3 },
        realvolume: { title: '实际体积', fieldtype: 3 },
        zdpiece: { title: '制单件数', fieldtype: 3 },
        zdweight: { title: '制单重量', fieldtype: 3 },
        zdvolume: { title: '制单体积', fieldtype: 3 },
        jfweight: { title: '计费重量', fieldtype: 3 },
        //pieceweight: { title: '报关件重', fieldtype: 3 },
        bglx: { title: '报关类型', fieldtype: 3 },
        bgweight: { title: '报关重量', fieldtype: 3 },
        //bggysname: { title: '报关供应商', fieldtype: 3 },
        mawbgysname: { title: '总单供应商', fieldtype: 3 },
        areaname: { title: '航线分区', fieldtype: 3 },
        //ywlx: { title: '业务类型', fieldtype: 3 },
        pzfs: { title: '装板方式', fieldtype: 3 },
        terminalname: { title: '交接地', fieldtype: 3 },
        // remark: { title: '备注', fieldtype: 3 },
        kcremark: { title: '空出备注', fieldtype: 3 },
        pzcontent: { title: '舱位内容', fieldtype: 3 },
        cargoopertype: { title: '货物操作', fieldtype: 3 },
        ybkhjcno: { title: '预报进仓编号', fieldtype: 3 },
        ybvolumeremark: { title: '预报尺寸备注', fieldtype: 3},
        
        // fieldtype:1 单号类
        mawb: { title: '总运单号', fieldtype: 1 },
        hawb: { title: '分运单号', fieldtype: 1 },
        orderno: { title: '订单来源号', fieldtype: 1 },

        // fieldtype:4 操作类
        modifyman: { title: '修改人', fieldtype: 4 },
        customername: { title: '客服负责人', fieldtype: 4 },
        signman: { title: '签单人', fieldtype: 4 },
        applysignman: { title: '签单申请人', fieldtype: 4 },
        orderconfirmman: { title: '上榜确认人', fieldtype: 4 },
        pdfinishman: { title: '配单完成人', fieldtype: 4 },
        mawbnoconfirmman: { title: '总单号确认人', fieldtype: 4 },
        AA0110demand: { title: '总单制单服务要求', fieldtype: 4 },
        AA0610demand: { title: '报关服务要求', fieldtype: 4 },
        AG0150demand: { title: '报关服务要求', fieldtype: 4 },
        AA0410demand: { title: '仓储服务要求', fieldtype: 4 },
        AG0145demand: { title: '仓储服务要求', fieldtype: 4 },
        AA0510demand: { title: '提送货服务要求', fieldtype: 4 },
        AB0620demand: { title: '唯凯清关要求', fieldtype: 4 },
        AB0420demand: { title: '送唯凯仓要求', fieldtype: 4 },
        AB0520demand: { title: '唯凯送货要求', fieldtype: 4 },
        AA0120demand: { title: '分单制单服务要求', fieldtype: 4 },
        AA0230demand: { title: '安检服务要求', fieldtype: 4 },
        AA0240demand: { title: '打板服务要求', fieldtype: 4 },
        OA0010demand: { title: '配舱服务要求', fieldtype: 4 },
        AG0110demand: { title: '快递服务要求', fieldtype: 4 },
        AG0115demand: { title: '磁检服务要求', fieldtype: 4 },
        AG0120demand: { title: '改包装服务要求', fieldtype: 4 },
        AG0125demand: { title: '化工鉴定服务要求', fieldtype: 4 },
        AG0130demand: { title: '挂衣服务要求', fieldtype: 4 },
        AG0135demand: { title: '标签服务要求', fieldtype: 4 },
        AA0810demand : { title: '材料提供服务要求', fieldtype: 4 },
        AA0140demand: { title: 'AMS发送服务要求', fieldtype: 4 },
        AA0150demand: { title: '天运通发送服务要求', fieldtype: 4 },

        // fieldtype:5 状态类
        dzstatus: { title: '单证状态', fieldtype: 5 },
        pcstatus: { title: '配舱状态', fieldtype: 5 },
        hwstatus: { title: '货物状态', fieldtype: 5 },
        bgstatus: { title: '报关状态', fieldtype: 5 },
        customstatus: { title: '海关联系单状态', fieldtype: 5 },
        commbillmodifystatus: { title: '签单待修改状态', fieldtype: 5 },
        trackstatus:{title: '装车指令', fieldtype: 5},
        pdfinishstatus: { title: '配单完成状态', fieldtype: 5 },


        // fieldtype:6 日期类
        modifydate: { title: '修改日期', fieldtype: 6 },
        orderfinishdate: { title: '订单完成日期', fieldtype: 6 },
        hbrq: { title: '航班日期', fieldtype: 6 },
        real_hbrq: { title: '航班日期', fieldtype: 6 },
        yqhbrq: { title: '要求航班日期', fieldtype: 6 },
        qfsj: { title: '起飞时间', fieldtype: 6 },
        deliverydate: { title: '货好日期', fieldtype: 6 },
        mawbnoconfirmdate: { title: '总单号确认日期', fieldtype: 6 },
        trundate: { title: '可交付时间', fieldtype: 6 },
        releasedate: { title: '运抵放行时间', fieldtype: 6 },
        pdfinishdate: { title: '配单完成时间', fieldtype: 6 },

        // fieldtype:2 费用类
        freightfee_in: { title: '运费(应收)', fieldtype: 2 },
        freightfee_out: { title: '运费(应付)', fieldtype: 2 },
        isinwageallin: { title: '运费类型(应收)', fieldtype: 2 },
        isoutwageallin: { title: '运费类型(应付)', fieldtype: 2 },
        fpbl_in: { title: '分泡比例(应收)', fieldtype: 2 },
        fpbl_out: { title: '分泡比例(应付)', fieldtype: 2 },
        wagein_pre: { title: '预付金额', fieldtype: 2 },
        wagein_pre_remark: { title: '预付款备注', fieldtype: 2 },
        wagein_pre_bank: { title: '预付款银行', fieldtype: 2 },
      },

      allTableTmpField2: { // 国内订单字段
        // 基本信息
        fieldtype17: {
          //fid: { title: '委托客户', fieldtype: 17 },
          //gid: { title: '项目', fieldtype: 17 },
          piece: { title: '件数', fieldtype: 17 },
          weight: { title: '重量', fieldtype: 17 },
          volume: { title: '体积', fieldtype: 17 },
          khjcno: { title: '进仓编号', fieldtype: 17 },
          mawb: { title: '总运单号', fieldtype: 17 },
          hawb: { title: '分运单号', fieldtype: 17 },
          sfg: { title: '始发港', fieldtype: 17 },
          mdg: { title: '目的港', fieldtype: 17 },
          jfweight: { title: '计费重量', fieldtype: 17 },
          accountweightin: { title: '结算重量', fieldtype: 17 },
          serviceitemsname: { title: '服务类别', fieldtype: 17 },
          servicecontent: { title: '服务内容', fieldtype: 17 },
          yqdate: { title: '要求完成时间', fieldtype: 17 },
          //thremark: { title: '提货', fieldtype: 17 },
          bindboae: { title: '是否绑定主营', fieldtype: 17 },
        },
        // 入唯凯仓
        fieldtype1: {
          piece: { title: '件数', fieldtype: 1 },
          weight: { title: '重量', fieldtype: 1 },
          volume: { title: '体积', fieldtype: 1 },
          khjcno: { title: '进仓编号', fieldtype: 1 },
          yjstorearea_org: { title: '入库仓库区域', fieldtype: 1 },
          yjstore_org: { title: '入库仓库', fieldtype: 1 },
          yjjcdate_org: { title: '入库日期', fieldtype: 1 },
          shdw: { title: '送货单位', fieldtype: 1 },
          hzdno: { title: '回执单号码', fieldtype: 1 },
          carno: { title: '车牌号码', fieldtype: 1 },
          breakpiece: { title: '破损件数', fieldtype: 1 },
          moistpiece: { title: '潮湿件数', fieldtype: 1 },
          deformpiece: { title: '变形件数', fieldtype: 1 },
          goodsmark: { title: '货物唛头', fieldtype: 1 },
          goodsremark: { title: '货物备注', fieldtype: 1 },
          gfweight: { title: '关封重量', fieldtype: 1 },
          fdocument: { title: '随机单证', fieldtype: 1 }
        },
        // 唯凯提货
        fieldtype2: {
          address_thrtype_org: { title: '提货人地址类型', fieldtype: 2 },
          address_thrstorearea_org: { title: '提货人仓库区域', fieldtype: 2 },
          store_thr: { title: '提货地仓库', fieldtype: 2 },
          company_thr_org: { title: '提货单位', fieldtype: 2 },
          address_thr_org: { title: '提货人地址', fieldtype: 2 },
          port_thr: { title: '提货地港口', fieldtype: 2 },
          terminal_thr: { title: '提货地货站', fieldtype: 2 },
          lxr_thr_org: { title: '提货人联系人', fieldtype: 2 },
          phone_thr_org: { title: '提货人联系电话', fieldtype: 2 },
          address_shrtyp_org: { title: '送货人地址类型', fieldtype: 2 },
          address_shrstorearea_org: { title: '送货人仓库区域', fieldtype: 2 },
          store_shr: { title: '送货地仓库', fieldtype: 2 },
          company_shr_org: { title: '送货单位', fieldtype: 2 },
          address_shr_org: { title: '送货人地址', fieldtype: 2 },
          port_shr: { title: '送货地港口', fieldtype: 2 },
          terminal_shr: { title: ' 送货地货', fieldtype: 2 },
          lxr_shr_org: { title: '送货人联系人', fieldtype: 2 },
          phone_shr_org: { title: '送货人联系电话', fieldtype: 2 },
          pickupdate_org: { title: '提货时间', fieldtype: 2 },
          yqfinishdate_org: { title: '要求完成时间', fieldtype: 2 },
          truckgid: { title: '卡车供应商', fieldtype: 2 },
          thremark: { title: '提货备注', fieldtype: 2 }
        },
        // 唯凯报关
        fieldtype3: {
          bggys: { title: '报关供应商', fieldtype: 3 },
          lds: { title: '连单数', fieldtype: 3 }
        },
        // 唯凯制作总单
        fieldtype4: {
          code_fhr_mawb: { title: '发货人代码', fieldtype: 4 },
          companytitle_fhr_mawb: { title: '发货人抬头', fieldtype: 4 },
          address_fhr_mawb: { title: '发货人地址', fieldtype: 4 },
          city_fhr_mawb: { title: '发货人城市', fieldtype: 4 },
          postcode_fhr_mawb: { title: '发货人邮编', fieldtype: 4 },
          companycode_fhr_mawb: { title: '发货人国家', fieldtype: 4 },
          state_fhr_mawb: { title: '发货人州', fieldtype: 4 },
          lxr_fhr_mawb: { title: '发货人联系人', fieldtype: 4 },
          phone_fhr_mawb: { title: '发货人联系人电话', fieldtype: 4 },
          email_fhr_mawb: { title: '发货人联系人邮件', fieldtype: 4 },
          fax_fhr_mawb: { title: '发货人联系人传真', fieldtype: 4 },
          code_shr_mawb: { title: '收货人代码', fieldtype: 4 },
          companytitle_shr_mawb: { title: '收货人抬头', fieldtype: 4 },
          address_shr_mawb: { title: '收货人地址', fieldtype: 4 },
          city_shr_mawb: { title: '收货人城市', fieldtype: 4 },
          postcode_shr_mawb: { title: '收货人邮编', fieldtype: 4 },
          companycode_shr_mawb: { title: '收货人国家', fieldtype: 4 },
          state_shr_mawb: { title: '收货人州', fieldtype: 4 },
          lxr_shr_mawb: { title: '收货人联系人', fieldtype: 4 },
          phone_shr_mawb: { title: '收货人联系人电话', fieldtype: 4 },
          email_shr_mawb: { title: '收货人联系人邮件', fieldtype: 4 },
          fax_shr_mawb: { title: '收货人联系人传真', fieldtype: 4 },
          agentcity: { title: 'Agent And City', fieldtype: 4 },
          iatacode: { title: 'IATA Code', fieldtype: 4 },
          accountnumber: { title: 'Account Number', fieldtype: 4 },
          referencenumber: { title: 'Reference Number', fieldtype: 4 },
          to1: { title: 'to1', fieldtype: 4 },
          by1: { title: 'by1', fieldtype: 4 },
          to2: { title: 'to2', fieldtype: 4 },
          by2: { title: 'by2', fieldtype: 4 },
          accountinfo: { title: 'accountinfo', fieldtype: 4 },
          shippercertify: { title: 'shippercertify', fieldtype: 4 },
          currency: { title: '币种', fieldtype: 4 },
          wtpaymode: { title: '付款方式(运费)', fieldtype: 4 },
          otherpaymode: { title: '付款方式(其他)', fieldtype: 4 },
          declarecarriage: { title: '声明价(海关)', fieldtype: 4 },
          declarecustom: { title: '声明价(运费)', fieldtype: 4 },
          insuranceamount: { title: '保险金额', fieldtype: 4 },
          handlinginfo: { title: 'Handling Info', fieldtype: 4 },
          zdpiece: { title: '制单件数', fieldtype: 4 },
          zdweight: { title: '制单重量', fieldtype: 4 },
          zdvolume: { title: '制单体积', fieldtype: 4 },
          ratelevel: { title: '费率级别', fieldtype: 4 },
          rate: { title: '费率', fieldtype: 4 },
          ratetotal: { title: '合计', fieldtype: 4 },
          prodnumber: { title: '商品编码', fieldtype: 4 },
          pm: { title: '品名', fieldtype: 4 },
          ppvaluation: { title: 'ppvaluation', fieldtype: 4 },
          ccvaluation: { title: 'ccvaluation', fieldtype: 4 },
          pptax: { title: 'pptax', fieldtype: 4 },
          cctax: { title: 'cctax', fieldtype: 4 },
          ppdueagent: { title: 'ppdueagent', fieldtype: 4 },
          ccdueagent: { title: 'ccdueagent', fieldtype: 4 },
          othertotal: { title: 'othertotal', fieldtype: 4 },
          smallpiece: { title: '小件数', fieldtype: 4 },
          verification: { title: 'verification', fieldtype: 4 },
          addman: { title: '制单人', fieldtype: 4 },
          adddate: { title: '制单日期', fieldtype: 4 }
        },
        // 唯凯制作分单
        fieldtype5: {
          code_fhr_hawb: { title: '发货人代码', fieldtype: 5 },
          companytitle_fhr_hawb: { title: '发货人抬头', fieldtype: 5 },
          address_fhr_hawb: { title: '发货人地址', fieldtype: 5 },
          city_fhr_hawb: { title: '发货人城市', fieldtype: 5 },
          postcode_fhr_hawb: { title: '发货人邮编', fieldtype: 5 },
          companycode_fhr_hawb: { title: '发货人国家', fieldtype: 5 },
          state_fhr_hawb: { title: '发货人州', fieldtype: 5 },
          lxr_fhr_hawb: { title: '发货人联系人', fieldtype: 5 },
          phone_fhr_hawb: { title: '发货人联系人电话', fieldtype: 5 },
          email_fhr_hawb: { title: '发货人联系人邮件', fieldtype: 5 },
          fax_fhr_hawb: { title: '发货人联系人传真', fieldtype: 5 },
          code_shr_hawb: { title: '收货人代码', fieldtype: 5 },
          companytitle_shr_hawb: { title: '收货人抬头', fieldtype: 5 },
          address_shr_hawb: { title: '收货人地址', fieldtype: 5 },
          city_shr_hawb: { title: '收货人城市', fieldtype: 5 },
          postcode_shr_hawb: { title: '收货人邮编', fieldtype: 5 },
          companycode_shr_hawb: { title: '收货人国家', fieldtype: 5 },
          state_shr_hawb: { title: '收货人州', fieldtype: 5 },
          lxr_shr_hawb: { title: '收货人联系人', fieldtype: 5 },
          phone_shr_hawb: { title: '收货人联系人电话', fieldtype: 5 },
          email_shr_hawb: { title: '收货人联系人邮件', fieldtype: 5 },
          fax_shr_hawb: { title: '收货人联系人传真', fieldtype: 5 },
          agentcity: { title: 'Agent And City', fieldtype: 5 },
          iatacode: { title: 'IATA Code', fieldtype: 5 },
          accountnumber: { title: 'Account Number', fieldtype: 5 },
          referencenumber: { title: 'Reference Number', fieldtype: 5 },
          to1: { title: 'to1', fieldtype: 5 },
          by1: { title: 'by1', fieldtype: 5 },
          to2: { title: 'to2', fieldtype: 5 },
          by2: { title: 'by2', fieldtype: 5 },
          accountinfo: { title: 'accountinfo', fieldtype: 5 },
          shippercertify: { title: 'shippercertify', fieldtype: 5 },
          currency: { title: '币种', fieldtype: 5 },
          wtpaymode: { title: '付款方式(运费)', fieldtype: 5 },
          otherpaymode: { title: '付款方式(其他)', fieldtype: 5 },
          declarecarriage: { title: '声明价(海关)', fieldtype: 5 },
          declarecustom: { title: '声明价(运费)', fieldtype: 5 },
          insuranceamount: { title: '保险金额', fieldtype: 5 },
          handlinginfo: { title: 'Handling Info', fieldtype: 5 },
          zdpiece: { title: '制单件数', fieldtype: 5 },
          zdweight: { title: '制单重量', fieldtype: 5 },
          zdvolume: { title: '制单体积', fieldtype: 5 },
          ratelevel: { title: '费率级别', fieldtype: 5 },
          rate: { title: '费率', fieldtype: 5 },
          ratetotal: { title: '合计', fieldtype: 5 },
          prodnumber: { title: '商品编码', fieldtype: 5 },
          pm: { title: '品名', fieldtype: 5 },
          ppvaluation: { title: 'ppvaluation', fieldtype: 5 },
          ccvaluation: { title: 'ccvaluation', fieldtype: 5 },
          pptax: { title: 'pptax', fieldtype: 5 },
          cctax: { title: 'cctax', fieldtype: 5 },
          ppdueagent: { title: 'ppdueagent', fieldtype: 5 },
          ccdueagent: { title: 'ccdueagent', fieldtype: 5 },
          othertotal: { title: 'othertotal', fieldtype: 5 },
          smallpiece: { title: '小件数', fieldtype: 5 },
          verification: { title: 'verification', fieldtype: 5 },
          addman: { title: '制单人', fieldtype: 5 },
          adddate: { title: '制单日期', fieldtype: 5 }
        },
        // 唯凯制作Manifest
        fieldtype6: {},
        // 唯凯制作总标签
        fieldtype7: {},
        // 唯凯制作分标签
        fieldtype8: {},
        // 唯凯安检
        fieldtype9: {},
        // 唯凯交单
        fieldtype10: {},
        // 快递服务
        fieldtype11: {
          servicecontent_deli: { title: '快递服务内容', fieldtype: 11 },
          yqdate_deli: { title: '快递服务要求时间', fieldtype: 11 },
          courienum_deli: { title: '快递单号', fieldtype: 11 },
          destinat_deli: { title: '目的地', fieldtype: 11 },
          relshr_deli: { title: '收件人', fieldtype: 11 },
          receiver: { title: '订单接收人', fieldtype: 11 }
        },
        // 磁检服务
        fieldtype12: {
          servicecontent_inspect: { title: '磁检服务内容', fieldtype: 12 },
          yqdate_inspect: { title: '磁检服务要求时间', fieldtype: 12 },
          bzlx_inspect: { title: '包装类型', fieldtype: 12 },
          //chinesepm_inspect: { title: '中文品名', fieldtype: 12 },
          //isstore_inspect: { title: '是否我司仓库', fieldtype: 12 },
          //storearea_inspect: { title: '仓库所属地区', fieldtype: 12 },
          store_inspect: { title: '仓库', fieldtype: 12 },
          appraisal_inspect: { title: '磁检鉴定机构', fieldtype: 12 }
        },
        // 改包装服务
        fieldtype13: {
          servicecontent_pack: { title: '包装服务内容', fieldtype: 13 },
          yqdate_pack: { title: '包装服务要求时间', fieldtype: 13 }
        },
        // 化工服务
        fieldtype14: {
          servicecontent_chem: { title: '化工服务内容', fieldtype: 14 },
          yqdate_chem: { title: '化工服务要求时间', fieldtype: 14 },
          appraisaltype_chem: { title: '鉴定类型', fieldtype: 14 },
          bzlx_chem: { title: '包装类型', fieldtype: 14 },
          //chinesepm_chem: { title: '中文品名', fieldtype: 14 },
          //englishpm_chem: { title: '英文品名', fieldtype: 14 },
          //isstore_chem: { title: '是否我司仓库', fieldtype: 14 },
          //storearea_chem: { title: '仓库所属地区', fieldtype: 14 },
          store_chem: { title: '仓库', fieldtype: 14 },
          appraisal_chem: { title: '化工鉴定机构', fieldtype: 14 },
          appraisalnum_chem: { title: '鉴定编号', fieldtype: 14 },
          makecom_chem: { title: '生产厂家', fieldtype: 14 },
          num_chem: { title: '鉴定份数', fieldtype: 14 },
        },
        // 挂衣服务
        fieldtype15: {
          servicecontent_safe: { title: '挂衣服务内容', fieldtype: 15 },
          yqdate_safe: { title: '挂衣服务要求时间', fieldtype: 15 }
        },
        // 贴签服务
        fieldtype16: {
          servicecontent_stick: { title: '贴签服务内容', fieldtype: 16 },
          yqdate_stick: { title: '贴签服务要求时间', fieldtype: 16 },
          goodsmark_stick: { title: '唛头', fieldtype: 16 }
        },
        // 材料服务
        fieldtype18: {
          //servicename_cltg : { title: '材料提供服务项目', fieldtype: 18 },
          yqdate_cltg : { title: '材料提供要求时间', fieldtype: 18 },
          servicecontent_cltg : { title: '材料提供内容', fieldtype: 18 },
          flowarea_cltg : { title: '流向区域', fieldtype: 18 },
          flowpoint_cltg : { title: '流向点', fieldtype: 18 }
        },
        // 大件装卸
        fieldtype19: {
          yqdate_zx : { title: '装卸服务要求时间', fieldtype: 19 },
          servicecontent_zx : { title: '装卸服务内容', fieldtype: 19 },
          status_zx : { title: '装卸服务状态', fieldtype: 19 },
          //storearea_zx : { title: '仓库区域', fieldtype: 19 },
          store_zx : { title: '仓库', fieldtype: 19 },
          bzlx_zx : { title: '包装类型', fieldtype: 19 }
        }
      },

      allTableTmpField3: { // 订单层
        // fieldtype:3 订单类
        reason: { title: '原因', fieldtype: 3 },
        wtkhname: { title: '委托客户', fieldtype: 3 },
        wtxmname: { title: '项目', fieldtype: 3 },
        salesareaname: { title: '订单销售站', fieldtype: 3 },
        assignarea: { title: '订单操作站', fieldtype: 3 },
        realwtkhname: { title: '实际委托客户', fieldtype: 3 },
        issett: { title: '是否设置结算日期', fieldtype: 3 },
        titlename: { title: '凭证抬头', fieldtype: 3 },
        invalidreason: { title: '作废原因', fieldtype: 3 },
        unfinish_ordercount: { title: '剩余订单数', fieldtype: 3 },
        aircomname:{title:'运单航空公司',fieldtype: 3 },
        gysname:{title:'运单供应商',fieldtype: 3 },

        // fieldtype:1 单号类
        pono: { title: '订舱编号', fieldtype: 1 },
        shipperno: { title: '订单编号', fieldtype: 1 },
        pzno: { title: '凭证号', fieldtype: 1 },
        pchno: { title: '对账批次号', fieldtype: 1 },
        otherno: { title: '外部订单号', fieldtype: 1 },
        wagein_pre_serialno: { title: '预付流水号', fieldtype: 1 },

        // fieldtype:4 操作类
        addman: { title: '创建人', fieldtype: 4 },
        djr: { title: '登记人', fieldtype: 4 },
        salesname: { title: '销售员', fieldtype: 4 },
        cancelman: { title: '撤单人', fieldtype: 4 },
        confirmman: { title: '客户确认人', fieldtype: 4 },
        delman: { title: '凭证作废人', fieldtype: 4 },
        examineman_sett: { title: '订单审核人', fieldtype: 4 },
        submitman_2_sett: { title: '应收审单人', fieldtype: 4 },
        submitman_out_sett: { title: '应付审单人', fieldtype: 4 },
        settman: { title: '设置结算人', fieldtype: 4 },
        ourconfirmman: { title: '我司对账人', fieldtype: 4 },
        name: { title: '对账客户联系人', fieldtype: 4 },
        confirmremark: {title: '对账备注', fieldtype: 4 },
        mobile: {title: '联系人电话', fieldtype: 4 },
        email: {title: '联系人邮箱', fieldtype: 4 },
        orderfinishman: {title: '订单完成人', fieldtype: 4 },
        wagein_pre_man: {title: '预付款解锁人', fieldtype: 4 },
        priceabout: { title: '销售人名称', fieldtype: 4 },
        cus_rel_name:{ title: '客户联系人', fieldtype: 4 },
        cus_rel_email:{ title: '联系人邮箱', fieldtype: 4 },
        cus_rel_mobile:{ title: '联系人手机', fieldtype: 4 },

        // fieldtype:5 状态类
        status: { title: '订单状态', fieldtype: 5 },
        creditisbackstatus: { title: '信控状态', fieldtype: 5 },
        confirmstatus_wagein: { title: '应收费用确认状态', fieldtype: 5 },
        confirmstatus_wageout: { title: '应付费用确认状态', fieldtype: 5 },
        examineisback_sett: { title: '驳回状态', fieldtype: 5 },
        // verificationstatus: { title: '异常状态', fieldtype: 5 },
        kfconfirmstatus_in:{title: "客服应收费用状态",fieldtype: 5},
        kfconfirmstatus_out:{title: "客服应付费用状态",fieldtype: 5},
        kfconfirmstatus: { title: "客服费用状态", fieldtype: 5 },
        hxconfirmstatus: { title: "航线费用状态", fieldtype: 5 },
        jsconfirmstatus: { title: "结算费用状态", fieldtype: 5 },
        hxconfirmstatus_in:{title: "航线应收费用状态",fieldtype: 5},
        hxconfirmstatus_out:{title: "航线应付费用状态",fieldtype: 5},
        workconfirmstatus:{title: "业务费用状态",fieldtype: 5},
        isclock:{title: "C类锁定状态",fieldtype: 5},

        // fieldtype:6 日期类
        adddate: { title: '创建日期', fieldtype: 6 },
        confirmdate: { title: '客户确认日期', fieldtype: 6 },
        djdate: { title: '登记日期', fieldtype: 6 },
        ddrq: { title: '要求达到日期', fieldtype: 6 },
        deldate: { title: '凭证作废日期', fieldtype: 6 },
        examinedate_sett: { title: '审核日期', fieldtype: 6 },
        submitdate_2_sett: { title: '应收审单日期', fieldtype: 6 },
        submitdate_out_sett: { title: '应付审单日期', fieldtype: 6 },
        settdate: { title: '设置结算日期', fieldtype: 6 },
        settsysdate: { title: '设置结算日期(系统)', fieldtype: 6 },
        ourconfirmdate: { title: '我司对账日期', fieldtype: 6 },
        wagein_pre_date: { title: '预付款解锁时间', fieldtype: 6 },
        wagein_pre_accountdate: { title: '预付到账日期', fieldtype: 6 },

        // fieldtype:2 费用类
        wageprofit: { title: '盈利', fieldtype: 2 },
        profitmode: { title: '分配模式', fieldtype: 2 },
        profitquota: { title: '分配额度', fieldtype: 2 },
        accountcomname: { title: '结算对象', fieldtype: 2 },
        wageall: { title: '凭证金额', fieldtype: 2 },
        finishwageall: { title: '已核销金额', fieldtype: 2 },
        paymentcomname: { title: '收付对象', fieldtype: 2 },
        billwageall: { title: '对账总额', fieldtype: 2 },
        realwageinrmb: { title: '含税应收（折合人民币）', fieldtype: 2 },
        realwageoutrmb: { title: '含税应付（折合人民币）', fieldtype: 2 },
        realwage_profitrmb: { title: '含税盈收（折合人民币）', fieldtype: 2 },
        each_weight: { title: '每公斤毛利', fieldtype: 2 },
        wageproChange: { title: '调账后盈收', fieldtype: 2 },
        currency: { title: '币种', fieldtype: 2 },
        //realwageallrmb: { title: '人民币金额', fieldtype: 2 },
        billwageallrmb: { title: '对账人民币金额', fieldtype: 2 },
        pzfinishwageallrmb: { title: '已开凭证人民币金额', fieldtype: 2 },
        wageallrmb: { title: '人民币总金额', fieldtype: 2 },
        finishwageallrmb: { title: '已核销人民币金额', fieldtype: 2 },
        wagein_pre_real: { title: '预付实际到账', fieldtype: 2 },
        wageall_in: { title: '应收费用', fieldtype: 2 },
        wageall_out: { title: '应付费用', fieldtype: 2 },
        unfinishwageall_checkbillrmb: { title: '剩余对账金额', fieldtype: 2 },
       // outwageallinprice: { title: '应付单价', fieldtype: 2 },
      },

      allTableTmpField4:{//进口业务
      //订单类 3
      currentPiece:{title:'当前/总入库/预报件数',fieldtype:3},//allpiece,goodspiece,hawbybpiece
      jcdate:{title:'入库日期',fieldtype:3},
      storagedays:{title:'库存天数(天)',fieldtype:3},
      wagestartdate:{title:'费用起算日',fieldtype:3},
      hwlx:{title:'货物类型',fieldtype:3},
      jid:{title:'货物来源',fieldtype:3},
      isabnormal:{title:'有无异常',fieldtype:3},
      isphoto:{title:'有无照片',fieldtype:3},
      fid:{title:'委托客户',fieldtype:3},
      gid:{title:'项目',fieldtype:3},
      storeid:{title:'入库仓库',fieldtype:3},
      reason:{title:'原因',fieldtype:3},
      sfg:{title:'始发港',fieldtype:3},
      hbh:{title:'航班号',fieldtype:3},
      mawbjzj:{title:'总单件重计',fieldtype:3},//ybpiece,ybweight,
      hawbjzj:{title:'分单件重计',fieldtype:3},//hawbpiece,hawbweight,hawbjfweight
      ysfs:{title:'入境方式',fieldtype:3},
      kwh:{title:'库位号',fieldtype:3},
      jsfs:{title:'结算方式',fieldtype:3},
      hwxz:{title:'货物性质',fieldtype:3},
      isbreakpiece:{title:'是否破损',fieldtype:3},
      otherpiece:{title:'有无报告',fieldtype:3},
      isabadon:{title:'是否弃货',fieldtype:3},
      isabadonresule:{title:'弃货处理结果',fieldtype:3},
      mdg:{title:'目的港',fieldtype:3},
      //单号类 1
      mawb:{title:'总运单号',fieldtype:1},
      hawb:{title:'分运单号',fieldtype:1},
      jcno:{title:'进仓序号',fieldtype:1},
      pono:{title:'订单编号',fieldtype:1},
      //操作类 4
      addman:{title:'创建人',fieldtype:4},
      modifyman:{title:'修改人',fieldtype:4},
      salesname:{title:'销售负责人',fieldtype:4},
      addman:{title:'创建人',fieldtype:4},
      customername:{title:'客服负责人',fieldtype:4},
      modifyman:{title:'修改人',fieldtype:4},
      //状态类 5
      status:{title:'订单状态',fieldtype:5},
      dzstatus:{title:'单证状态',fieldtype:5},
      hwstatus:{title:'货物状态',fieldtype:5},
      //日期类 6
      yqhbrq:{title:'到港日期',fieldtype:6},
      adddate:{title:'创建日期',fieldtype:6},
      modifydate:{title:'修改日期',fieldtype:6},
      hbrq:{title:'到港日期',fieldtype:6},
      ckdate:{title:'出库日期',fieldtype:6},
      }
    }
  },
  computed: {
    activeLibNameObj () {
      return {
        '1': '出口业务层',
        '2': '国内业务层',
        '3': '订单层',
        '4': '进口业务层'
      }
    },
    // 需要显示出来的固定字段
    tablePageFixedBasic () {
      return this.tablePageBasic[0].filter(i => i.title)
    },
    // 通过id获取titile
    // { id: "title" }
    idToTitle () {
      return this.tablePageBasic[1].reduce((p, v) => {
        p[v.id] = v.modelname || v.title
        return p
      }, {})
    },
    fieldTypeArr () {
      let num = ''
      if (this.activeLib === '1' || this.activeLib === '3') {
        num = '1'
      } else if (this.activeLib === '2') {
        num = '2'
      }else if(this.activeLib==='4'){
        num='4'
      }
      return this['fieldTypeArr' + num]
    },
    allTableTmpField () {
      if (this.activeLib == '1') {
        return this.allTableTmpField1
      } else if (this.activeLib === '2') {
        return this.allTableTmpField2['fieldtype' + this.curFieldType.type]
      } else if (this.activeLib === '3') {
        return this.allTableTmpField3
      } else if(this.activeLib==='4'){
        return this.allTableTmpField4
      }
    },
    curFieldType () {
      return this.fieldTypeArr[this.curFieldTypeIndex]
    },
    curTableField () {
      let result = {}
      let keys = Object.keys(this.allTableTmpField)
      for (let key of keys) {
        if (this.allTableTmpField[key].fieldtype == this.curFieldType.type) {
          result[key] = this.allTableTmpField[key]
        }
      }
      return result
    },
    sortFieldBackground () {
      let index = this.curFieldTypeIndex % 6
      return {
        background: `linear-gradient(${this.sortFieldBackgroundArr[index][0]}, ${this.sortFieldBackgroundArr[index][1]})`
      }
    },
    // 当前表格是否需要同步模板
    isSameTableHeadComp () {
      let same = false
      for (let index in this.$store.state.sameTableHeadComp) {
        if (this.$store.state.sameTableHeadComp[index].includes(this.name)) {
          same = true
          this.sameTableHeadCompIndex = index
          break;
        }
      }
      return same
    },
    firstTableHeadComp () {
      return this.$store.state.sameTableHeadComp[this.sameTableHeadCompIndex][0]
    },
    // 构造后的表格基础模板字段数据
    // { "field": { id: "id", title: "title" } }
    dataTrans () {
      let result = {}

      let allBasicField = [...this.tablePageBasic[1]]
      // 根据中文拼音排序
      allBasicField = allBasicField.sort((prev, next) =>
        prev.title.localeCompare(next.title, 'zh-Hans-CN', {
          sensitivity: 'accent'
        })
      )

      for (let item of allBasicField) {
        result[item.field] = {
          id: item.id,
          title: item.modelname || item.title
        }
      }

      return result
    },
    allSearchField () {
      let searchField = []
      Object.keys(this.allTableTmpField1).forEach(key => {
        let value = this.allTableTmpField1[key]
        searchField.push({
          key,
          activeLib: '1',
          title: value.title,
          fieldtype: value.fieldtype
        })
      })
      Object.keys(this.allTableTmpField3).forEach(key => {
        let value = this.allTableTmpField3[key]
        searchField.push({
          key,
          activeLib: '3',
          title: value.title,
          fieldtype: value.fieldtype
        })
      })
      Object.values(this.allTableTmpField2).forEach(fieldtypeValue => {
        Object.keys(fieldtypeValue).forEach(key => {
          let value = fieldtypeValue[key]
          searchField.push({
            key,
            activeLib: '2',
            title: value.title,
            fieldtype: value.fieldtype
          })
        })
      })
      return searchField
    },
    // 颜色模板
    // statusColorTempAll () {
    //   return this.$store.getters.statusColorTempAll
    // },
    // activeColorTempID: {
    //   get () {
    //     let id = ''
    //     for (let item of this.statusColorTempAll) {
    //       if (item.isactivate === 1) {
    //         id = item.id
    //         break
    //       }
    //     }

    //     return id
    //   },
    //   set () {

    //   }
    // }
  },
  watch: {
    activeLib () {
      this.curFieldTypeIndex = 0
      this.FieldTypeListTop = '0px'
    },
    showFieldTypeList (val) {
      if (val) {
        this.FieldTypeListTop = '0px'
      } else {
        let offsetTop = $(this.$refs.fieldTypeUlRef).find('.active')[0].offsetTop
        this.FieldTypeListTop = `-${offsetTop}px`
      }
    },
    selectedJsondata (jsondata) {
      if (!jsondata) return
      this.formatJsondata(jsondata)
    },
    tablePageBasic (val) {
      /**
       * 因为不同页面中的查询条件存在名称相同但字段不同的情况
       * 如：OrderSearch中订单编号的字段名为pono，managerExamine中订单编号的字段名为jobno （allTableTmpField中可见）
       * 所以需要根据当前页面的基础字段(this.tablePageBasic)将allTableTmpField中的其他重名字段过滤掉，避免重复显示
       * 如：OrderSearch中需要pono字段，则将同名的jobno字段过滤掉
       */
      if (this.tablePageBasic.length === 0) return

      let titleArr = Object.values(this.allTableTmpField).map(i => i.title)
      let keyArr = Object.keys(this.allTableTmpField)
      // 基础表格字段的所有field值
      let BasicField = [...this.tablePageBasic[0].map(i => i.field), ...this.tablePageBasic[1].map(i => i.field)]

      for (let key of BasicField) {
        if (!this.allTableTmpField[key]) continue
        let title = this.allTableTmpField[key].title
        let index = titleArr.indexOf(title)
        while (index != -1) {
          if (keyArr[index] != key && titleArr[index] == title) {
            this.$delete(this.allTableTmpField, keyArr[index])
            index = titleArr.indexOf(title, index + 1)
          } else {
            index = titleArr.indexOf(title, index + 1)
          }
        }
      }

      // 过滤掉其余title重复的字段
      titleArr = Object.values(this.allTableTmpField).map(i => i.title)
      keyArr = Object.keys(this.allTableTmpField)
      for (let index in titleArr) {
        let isrepeat = titleArr.indexOf(titleArr[index], Number(index) + 1)
        while (isrepeat != -1) {
          this.$delete(this.allTableTmpField, keyArr[isrepeat])
          isrepeat = titleArr.indexOf(titleArr[index], isrepeat + 1)
        }
      }
    },
    valueTrans (value) {
      // 设置全选checkbox状态
      let dataTransLength = Object.keys(this.dataTrans).length
      this.isIndeterminate = value.length > 0 && value.length < dataTransLength
      this.checkAll = value.length === dataTransLength
    },
    dialogTableVisible (value) {
      if (value) {
        let name = this.name.split('.')[0]
        this.showSavetemp = false
        // 当前模板数据
        this.valueTrans = [...this.$store.state.tablePageTmp[name][1]].map(i => i.id)

        // 当前模板名称
        if (!this.selectedJsondata) {
          this.curTempName = ''
        } else {
          for (let tmp of this.tmpArr) {
            if (tmp.jsondata == this.selectedJsondata) {
              this.curTempID = tmp.id
              this.curTempName = tmp.name
              break
            }
          }
        }

        this.tableTemName = this.curTempName
        this.activeLib = '3'
      } else {
        this.tableTemName = ''
      }
    },
    '$store.state.tableTmpAll': {
      handler (tableTmpAll) {
        let tmpArr = []
        let tmpArrChild = []
        let activeTmp = null
        let activeTmpC = null

        for (let tmpItem of tableTmpAll) {
          if (!tmpItem.jsondata || tmpItem.url != this.name) continue

          // type: 0 父表格基础数据
          if (tmpItem.type == 0) {
            // 基础表格数据
            this.tablePageBasic = JSON.parse(tmpItem.jsondata)

            let jsondata = JSON.parse(tmpItem.jsondata)
            let nac = []
            let nacfix = []

            for (let i of jsondata[0]) {
              if (!i.hidden) nac.push(i)
            }
            for (let i of jsondata[1]) {
              if (!i.hidden && i.isactive) nacfix.push(i)
            }
            // 过滤掉默认隐藏的字段后用于显示的表格数据
            this.tablePageTmp = [nac, nacfix]
          }

          // type: 20 父表格模板数据
          if (tmpItem.type == 20) {
            tmpArr.push(tmpItem)
            // 设置激活模板
            if (tmpItem.isactivate == 1) {
              activeTmp = tmpItem.jsondata
            }
          }

          // type: 40 子表格基础数据
          if (tmpItem.type == 40) {
            this.tablePageBasicC = JSON.parse(tmpItem.jsondata)

            let acfixChild = JSON.parse(tmpItem.jsondata)[1] // 非固定基础表格数据子
            let nacfixChild = [] //固定所有基础表格非隐藏数据子
            for (let i in acfixChild) {
              if (!acfixChild[i].hidden) {
                nacfixChild.push(acfixChild[i])
              }
            }
            this.tablePageTmpC = nacfixChild // 不固定非隐藏数据子
          }

          // type: 60 子表格模板数据
          if (tmpItem.type == 60) {
            tmpArrChild.push(tmpItem)
            // 设置激活模板
            if (tmpItem.isactivate == 1) {
              activeTmpC = tmpItem.jsondata
            }
          }
        }

        this.tmpArr = tmpArr
        this.temArrChild = tmpArrChild
        let name = this.name.split('.')[0]

        if (activeTmp) {
          this.selectedJsondata = activeTmp
        } else {
          // 没有激活的模板时使用默认模板
          this.$store.commit('setTableData', [name, this.tablePageTmp])
        }

        if (activeTmpC) {
          this.formatJsondata(activeTmpC)
        } else {
          this.$store.commit('setChildTableData', [name, this.tablePageTmpC])
        }
      },
      immediate: true
    },
    fieldSearchIndex (index) {
      if (index === '') {
        this.highlightFieldIndex = ''
        return
      }
      index = index.split(',')[0]
      let { activeLib, fieldtype, key } = this.fieldSearchOptions[index]
      this.activeLib = activeLib
      this.$nextTick(() => {
        if (activeLib === '1' || activeLib === '3') {
          this.curFieldTypeIndex = this.fieldTypeArr1.findIndex(i => i.type == fieldtype)
        } else if (activeLib === '2') {
          this.curFieldTypeIndex = this.fieldTypeArr2.findIndex(i => i.type == fieldtype)
        }

        // 滚动到搜索的字段位置并高亮显示
        Object.keys(this.curTableField).forEach((curTableFieldKey, index) => {
          if (curTableFieldKey === key) {
            this.highlightFieldIndex = index
          }
        })
        this.$nextTick(() => {
          this.$refs.fieldCheckboxRow.scrollTo(0, this.highlightFieldIndex * 25)

          let offsetTop = $(this.$refs.fieldTypeUlRef).find('.active')[0].offsetTop
          this.FieldTypeListTop = `-${offsetTop}px`
        })
      })
      this.fieldSearchIndex = ''
    },
    showFieldSearchSelect (val) {
      if (!val) {
        this.fieldSearchIndex = ''
        this.fieldSearchOptions = []
      }
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.isIndeterminate = false
      if (val) {
        this.valueTrans = Object.values(this.dataTrans).map(i => i.id)
      } else {
        this.valueTrans = []
      }
    },
    checkboxDrop (event, row_index) {
      function getDropIndex (el) {
        if (el.nodeName == 'DIV') return null
        if (el.nodeName == 'LABEL' && el.className.indexOf('el-checkbox') !== -1) {
          return el.attributes['data-item'].value
        } else {
          return getDropIndex(el.parentNode)
        }
      }

      var targetItem = getDropIndex(event.target)
      if (targetItem) {
        var field = event.dataTransfer.getData('index')

        let index1 = this.valueTrans.indexOf(field)
        let index2 = this.valueTrans.indexOf(targetItem)

        this.valueTrans.splice(index1, 1)
        this.valueTrans.splice(index2, 0, field)
      }
    },
    dragStart (event, index) {
      event.dataTransfer.setData('index', String(index))
    },
    // 格式化jsondata得到表格显示数据，并设置到store中
    formatJsondata (jsondata) {
      if (!jsondata || typeof jsondata !== 'string') return

      let idArr = JSON.parse(jsondata).map(i => i.id)
      let dataTable = [[], []]

      // 过滤模板数据中的隐藏字段
      // 固定字段
      for (let item of this.tablePageBasic[0]) {
        if (!item.hidden) dataTable[0].push(item)
      }
      // 非固定字段
      for (let item of this.tablePageBasic[1]) {
        if (idArr.includes(item.id) && !item.hidden) {
          dataTable[1][idArr.indexOf(item.id)] = item
        }
      }
      // 过滤掉空数据
      dataTable[1] = dataTable[1].filter(i => i)

      let name = this.name.split('.')[0]
      this.$store.commit('setTableData', [name, dataTable])
    },
    async getTableTmpAll () {
      // 获取全部模板数据
      let that = this

      if (localStorage.getItem('usrname')) {
        await this.$axios({
          method: 'get',
          url: that.$store.state.publicWebApi + 'api/UserTemplet',
          params: {
            logname: localStorage.getItem('usrname'),
            project: 'bomanagement'
          },
          loading: false,
          tip: false
        }).then(result => {
          let tableTem = result.data
          this.$store.commit('setTableTmpAll', tableTem)
        })
      }
    },
    // 设置临时模板
    setTemporaryTemp () {
      if (this.valueTrans.length == 0) {
        return this.$message('请选择模板字段')
      }

      let data = this.valueTrans.map(i => ({id: i}))

      this.selectedJsondata = ''
      this.formatJsondata(JSON.stringify(data))
      this.dialogTableVisible = false
      this.$emit('templateChange', true)
      this.$parent.$parent.search && this.$parent.$parent.search()
    },
    // 新增或修改模板
    // savetype: 1.保存为新模板 2.修改当前模板
    async saveTableTmp (savetype) {
      if (this.valueTrans.length == 0) {
        return this.$message.error('请选择模板字段')
      }
      if (this.tableTemName == '') {
        return this.$message.error('请输入模板名称')
      }

      let type = 20
      let method = 'post'
      let jsondata = JSON.stringify(this.valueTrans.map(i => ({id: i})))

      if (savetype === '1') {
        for (let item of this.tmpArr) {
          if (item.name == this.tableTemName) {
            this.$refs.tableTemNameInput.select()
            return this.$message.error('模板名称重复')
          }
        }
        for (let item of this.tmpArr) {
          if (item.jsondata == jsondata) {
            return this.$message.error('存在相同模板请重新选择或排序')
          }
        }

      } else {
        method = 'put'
        for (let item of this.tmpArr) {
          if (item.id !== this.curTempID && item.jsondata == jsondata) {
            return this.$message.error('存在相同模板请重新选择或排序')
          }
        }
      }

      let data = [], comp = []
      if (this.isSameTableHeadComp) {
        comp = this.$store.state.sameTableHeadComp[this.sameTableHeadCompIndex]
      } else {
        comp.push(this.name)
      }

      if (method == 'post') {
        comp.forEach(url => {
          data.push({
            czman: localStorage.getItem('usrname'),
            dom: '出口部',
            isactivate: url == this.name ? 1 : 2,
            jsondata,
            logname: localStorage.getItem('usrname'),
            name: this.tableTemName,
            type,
            url,
            project: 'bomanagement',
            logExtraData: this.logExtraDataForBuild
          })
        })

        this.$axios({method, url: this.$store.state.publicWebApi + 'api/UserTempletList', data, loading: false, tip: true, noarea: 1})
          .then(async result => {
            if (result.data.resultstatus == 0) {
              await this.getTableTmpAll()
              this.selectedJsondata = jsondata
              this.dialogTableVisible = false
              this.tableTemVisible = false
              this.tableTemName = ''
              this.$emit('templateChange', true)
              this.$parent.$parent.search && this.$parent.$parent.search()
            }
          })
      } else if (method == 'put') {
        this.$store.state.tableTmpAll.forEach(tmp => {
          if (comp.includes(tmp.url) && tmp.name == this.curTempName && tmp.type == type) {
            data.push({
              czman: localStorage.getItem('usrname'),
              dom: '出口部',
              id: tmp.id,
              isactivate: tmp.isactivate,
              jsondata,
              logname: localStorage.getItem('usrname'),
              name: this.tableTemName,
              type: tmp.type,
              url: tmp.url,
              project: 'bomanagement',
              logExtraData: this.logExtraDataForBuild
            })
          }
        })

        this.$axios({method, url: this.$store.state.publicWebApi + 'api/UserTempletList', data, loading: false, tip: true, noarea: 1})
          .then(async result => {
            if (result.data.resultstatus == 0) {
              await this.getTableTmpAll()
              this.selectedJsondata = jsondata
              this.dialogTableVisible = false
              this.tableTemVisible = false
              this.tableTemName = ''
              this.$emit('templateChange', true)
              this.$parent.$parent.search && this.$parent.$parent.search()
            }
          })
      }
    },
    // 删除模板
    deleteTmp (id, name) {
      var that = this
      this.$confirm('您将删除本模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action == 'confirm') {
            delTmp()
          } else if (action == 'cancel') {
            that.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        }
      })

      function delTmp () {
        let data = []
        let comp = []

        if (that.isSameTableHeadComp) {
          comp = that.$store.state.sameTableHeadComp[that.sameTableHeadCompIndex]
        } else {
          data.push({ id: id, logname: localStorage.getItem('usrname'), logExtraData: that.logExtraDataForBuild })
        }

        comp.forEach(url => {
          that.$store.state.tableTmpAll.forEach(tmp => {
            if (tmp.url == url && tmp.name == name && tmp.type == 20) {
              data.push({
                id: tmp.id,
                logname: localStorage.getItem('usrname'),
                logExtraData: that.logExtraDataForBuild
              })
            }
          })
        })

        that.$axios({
          method: 'delete',
          url: that.$store.state.publicWebApi + 'api/UserTempletList',
          data: data,
          loading: false,
          tip: true,
          noarea: 1
        })
        .then(result => {
          if (result.data.resultstatus != 0) {
          } else {
            that.selectedJsondata = '';
            that.getTableTmpAll()
          }
        })
      }
    },
    // deleteColorTmp (id, name) {
    //   var that = this
    //   this.$confirm('您将删除本模板, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     let data = [{ id: id, logname: localStorage.getItem('usrname'), logExtraData: this.logExtraDataForBuild }]

    //     that.$axios({
    //       method: 'delete',
    //       url: that.$store.state.publicWebApi + 'api/UserTempletList',
    //       data,
    //       loading: false,
    //       tip: true,
    //       noarea: 1
    //     })
    //     .then(result => {
    //       if (result.data.resultstatus === 0) {
    //         that.getTableTmpAll()
    //       }
    //     })
    //   }).catch(() => {
    //     that.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // },
    // 默认模板
    defaultActive (item) {
      this.$axios({
        method: 'put',
        url: this.$store.state.publicWebApi + 'api/UserTempletList',
        data: [{
          ...item,
          czman: localStorage.getItem('usrname'),
          dom: '出口部',
          isactivate: 1,
          logname: localStorage.getItem('usrname'),
          project: 'bomanagement',
          logExtraData: this.logExtraDataForBuild
        }],
        noarea: 1
      })
        .then(async result => {
          if (result.data.resultstatus == 0) {
            await this.getTableTmpAll()
            this.$emit('templateChange', true)
            this.$parent.$parent.search && this.$parent.$parent.search()
          }
        })
        .catch(error => {
          this.$message.error('请求失败')
      })
    },
    // defaultColorTempActive (item) {
    //   this.$axios({
    //     method: 'put',
    //     url: this.$store.state.publicWebApi + 'api/UserTempletList',
    //     data: [{
    //       ...item,
    //       czman: localStorage.getItem('usrname'),
    //       dom: '出口部',
    //       isactivate: 1,
    //       logname: localStorage.getItem('usrname'),
    //       project: 'bomanagement',
    //       logExtraData: this.logExtraDataForBuild
    //     }],
    //     noarea: 1
    //   })
    //     .then(async result => {
    //       if (result.data.resultstatus == 0) {
    //         await this.getTableTmpAll()
    //       }
    //     })
    //     .catch(error => {
    //       this.$message.error('请求失败')
    //   })
    // },
    fieldSearchFunc (searchText) {
      if (!searchText) return
      this.fieldSearchOptions = []
      this.allSearchField.forEach(item => {
        let title = this.dataTrans[item.key] ? this.dataTrans[item.key].title : item.title
        if (title.includes(searchText)) {
          this.fieldSearchOptions.push({
            ...item,
            title
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tableSetMuban {
  display: inline-block;
  min-width: 70px;
  height: 28px;
  line-height: 28px;
  color: #444;
  margin: 0px;
  text-align: center;
  background: #f8f8f8;
  border: 1px solid #ccc;
  cursor: pointer;
  margin-right: 5px;
  text-decoration: none;
}
.jihuo {
  float: right;
  color: #8492a6;
  width: 13px;
  height: 13px;
  border-radius: 13px;
  margin-top: 12px;
}
.tableTem .el-dialog--small {
  min-width: 0;
}

.tableConfig /deep/ .el-dialog__body {
  margin: 0 auto;
  width: auto !important;
}
.tableConfig /deep/ .el-button {
  padding: 8px 16px;
}

.tableConfig {
  /deep/ .el-dialog {
    max-width: 1400px;
    .el-dialog__title {
      display: inline-block;
      width: 90%;
      margin-bottom: 10px;
    }
  }
  /deep/ .el-dialog__body {
    .el-tabs {
      .el-tabs__item {
        font-size: 16px;
      }
      .temp-name {
        font-size: 14px;
      }
      .el-tab-pane {
        padding: 0;
      }
    }
    padding-top: 0px;
    margin: 0;
    .checkbox-top {
      overflow: hidden;
      p {
        float: left;
        margin-bottom: 12px;
      }
    }
    .field-container {
      display:flex;
      margin-bottom: 20px;
      .show-field {
        margin-right:80px;
        display:flex;
        flex-direction:column;
        height:100%;
        position: relative;
        .checkall {
          float: right;
        }
        .trans-icon {
          position: absolute;
          top: 300px;
          right: -55px;
          width: 32px;
          height: 32px;
          background: url('../../../boStatic/images/searchFieldDialogTransIcon.png') no-repeat 0 0;
        }
        .title {
          float: left;
          margin-bottom: 10px;
          .tip {
            margin-left: 8px;
            font-size: 12px;
            color: #ababab;
          }
        }
        .checkbox-row {
          border-radius: 4px;
          border:1px solid #e8e8e8;
          width: 654px; // 三列checkbox
          height: 583px;  // 20行字段
          flex:1;
          padding: 15px 0;
          white-space: nowrap;
          overflow: auto;
          padding-left: 2px;
          .checkboxgroup {
            width: 215px; // 每列215宽度
            display: inline-block;
            vertical-align: top;
            padding: 0 15px;
            border-right: 1px solid #e8e8e8;
            &:last-child {
              border-right: none;
            }
            .checkbox-item {
              position: relative;
              display: block;
              width: 100%;
              height: 24px;
              line-height: 24px;
              margin: 3px 0;
              padding-left: 25px;
              border-radius: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:hover {
                box-shadow: 0px 0px 10px #999;
              }
              &.disabled {
                box-shadow: none;
              }
              .number {
                position: absolute;
                left: 3px;
                top: 4px;
                font-family: Arial, Helvetica, sans-serif;
                color: #c5c5c5;
                font-style: italic;
              }
            }
          }
        }
      }
      .sort-field {
        display:flex;
        width: 310px;
        min-width: 310px;
        height: 100%;
        letter-spacing: normal;
        flex-direction:column;
        position: relative;
        // width: 256px;
        .sort-title-c {
          display: flex;
          border-bottom: 1px solid #e8e8e8;
          .sort-title {
            float: left;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            margin-right: 10px;
            cursor: pointer;
            &.active {
              color: #0f5a8c;
              font-weight: bold;
            }
          }
          .field-search-select-c {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            .search-select {
              transition: .3s width;
              width: 100%;
              .el-input__inner {
                transition: .3s padding;
                padding: 0 30px;
              }
              .el-icon-search {
                width: 28px;
                line-height: 28px;
                cursor: pointer;
              }
            }
            &.hidden {
              .search-select {
                width: 28px;
                .el-input__inner {
                  padding: 0;
                  &::placeholder {
                    opacity: 0;
                  }
                }
                .el-input__prefix {
                  left: 0;
                }
                .el-input__suffix {
                  display: none;
                }
              }
            }
          }
        }
        .sort-subtitle-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 29px;
          background: white;
          transition: .5s all;
          z-index: 12;
          &.showList {
            height: 220px;
            // box-shadow: 0 10px 16px -10px #000;
            .el-icon-caret-left{
              transform: rotate(-90deg);
              right: 0;
            }
          }
          .el-icon-caret-left {
            position: absolute;
            top: 2px;
            right: -6px;
            font-size: 20px;
            cursor: pointer;
            transition: .5s all;
            z-index: 13;
          }
          .sort-subtitle-c {
            // width: 1000px;
            overflow: hidden;
            position: relative;
            transition: .5s all;
            .title {
              float: left;
              font-size: 14px;
              font-weight: bold;
              margin-right: 8px;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              &.setWidth {
                width: 91px;
              }
              &:last-child {
                margin-right: 0px;
              }
            }
          }
        }
        .checkbox-row {
          flex: 1;
          border-radius: 4px;
          height: 600px;
          overflow: auto;
          max-height: 600px;
          &::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.31);
          }
          &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.18);
          }
          .checkboxgroup {
            width: 215px; // 每列215宽度
            float: left;
            padding: 0 10px;
            .el-checkbox {
              width: 100%;
              margin-left: 4px;
              height: 25px;
              line-height: 25px;
              padding-left: 6px;
              &.highlight {
                background: rgba(0,0,0,0.3);
              }
              .el-checkbox__inner {
                border-color: white;
                background: white;
                &::after {
                  border-color: #0f5a8c;
                }
              }
              .is-disabled .el-checkbox__inner::after {
                border-color: #b8d1e2;
              }
              .el-checkbox__label {
                color: white;
              }
              &.is-disabled {
                .el-checkbox__input {
                  opacity: 0;
                }
                .el-checkbox__label {
                  opacity: 0.5;
                }
              }
            }
          }
        }
        .background-text {
          position: absolute;
          right: 30px;
          bottom: 30px;
          font-weight: bold;
          width: 70px;
          font-size: 68px;
          line-height: 70px;
          color: #fff;
          opacity: 0.2;
          pointer-events: none;
          writing-mode: tb-rl;
        }
      }
    }
    .btn-c {
      clear: both;
      margin-bottom: 20px;
    }
    .savetemp-c {
      .el-input {
        width: 200px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
