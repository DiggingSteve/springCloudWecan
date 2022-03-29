<template>
  <div>
<!-- {{radioCheck}} -->

<div v-if="mark">
  <div style="float: right;height:0px;transform: translate(16px,-42px);">
    <!-- <span v-html="getTabsTooltip('已配单')" style="margin-right: auto" v-if="inputModelData.pdfinishstatus!='1'"></span> -->
    <el-button btnnum="270" class="finishBtn" type="primary" style="margin-right:98px" v-if="mawbinfo.pdfinishstatus=='1'"
      @click="pdFinish('1')" title="配单操作" :disabled="pzFinishButton">配单完成</el-button>
    <el-button btnnum="280" class="finishBtn" type="danger" v-else @click="pdFinish('10')" style="margin-right:98px" title="配单操作">取消配单</el-button>
    <el-button  style="margin-left:0px;padding:8px" :icon="goodsinfoshow?'el-icon-caret-top':'el-icon-caret-bottom'" @click="goodsinfoshow=!goodsinfoshow">{{goodsinfoshow?'隐藏实际货物信息':'显示实际货物信息'}}</el-button>

  </div>
<el-collapse-transition>
  <commonTable :head="getGoodsTablehead().slice(1)" title="货物信息" v-show="goodsinfoshow"  :table-data="sjGoodsTableData.filter(i=>!i.isSeat)" 
    style="margin-bottom:20px;">
    <template slot="khjcno" slot-scope="props">
      <khjcnoSlot :tableCheckedIndex.sync="goodsTableCheckedIndex" :propsData.sync="props.data" pagetype=2></khjcnoSlot>
    </template>
  </commonTable>
  </el-collapse-transition>
</div>

    <div class="content">
      <div style="width:500px" class="left" id="leftUpload">
        <h4 v-if="!mark">
          预报货物信息
          <i
            class="el-icon-xinzeng"
            style="color:#00457D;font-weight:bold;font-size:20px!important;cursor:pointer;transform: translate(-4x, 6px);"
            title="新增预报货物信息"
            @click="resertPz"
          ></i>

        </h4>

        <h4 v-else>
          报关单信息
          <i
            class="el-icon-xinzeng"
            :style="{cursor:'pointer',color:pdfinishstatus?'#ccc':'#00457D',fontWeight:'bold',fontSize:'20px!important',transform:'translate(-4x, 6px)'}"
            :class="{'tdDisabled':pdfinishstatus}"
            :disabled="pdfinishstatus"
            title="新增报关单信息"
            @click="resertPz"
          ></i>

        </h4>
        <commonTable :head="ybTableHead" :table-data="ybTableData" :divStyle="tableHeightStyle" :isRadioSelect="true"  @current-change="docRadioF" :defaultSelectRowIndex="defaultSelectRowIndex" @dragover.native="dragOverF" @dragleave.native="dragLeaveF($event)">
          <template slot="khjcno" slot-scope="props">
            <khjcnoSlot :tableCheckedIndex.sync="leftTableCheckedIndex" :propsData.sync="props.data" pagetype=1></khjcnoSlot>
          </template>
          <template slot="statusPz" slot-scope="props">
            <span :style="{color:props.data.value?'#004C82':'red'}">{{props.data.value?'已配置':'未配置'}}</span>
          </template>
          <template slot="operate" slot-scope="props">
<!--             <span
              class="cblue el-icon-search"
              v-show="props.data.row.storeType&&props.data.row.storeType=='入库'"
              :class="{'tdDisabled':phfinished}"
              @click="searchPeihuodialog=true;inputModelData={};searchPhRowData=props.data.row;searchPHTableData=[]"
              title="搜索配货"
            ></span> -->
            <div v-if="!mark">
<!--               <span
              class="cblue el-icon-search"
              v-show="props.data.row.storeType&&props.data.row.storeType=='入库'"
              :class="{'tdDisabled':phfinished}"
              @click="searchPeihuodialog=true;inputModelData={};searchPhRowData=props.data.row;searchPHTableData=[]"
              title="搜索配货"
            ></span> -->
              <button
                class="cblue el-icon-setting"
                :class="{'tdDisabled':phfinished}"
                :style="{background:'#fff'}"
                :title="props.data.row.statusPz&&props.data.row.storeType=='入库'?'已配货不能修改！':'修改'"
                @click="dialogVisible=true;edit(props.data.row,props.data.index)"
              ></button>
              <button
                class="cblue el-icon-delete-solid"
                :class="{'tdDisabled':phfinished}"
                :style="{background:'#fff',color:props.data.row.statusPz&&props.data.row.storeType=='入库'?'#ccc':''}"
                :title="props.data.row.statusPz&&props.data.row.storeType=='入库'?'已配货不能删除！':'删除'"
                @click="del(ybTableData[props.data.index])"
                :disabled="props.data.row.statusPz&&props.data.row.storeType=='入库'"
              ></button>
              <button
                class="cblue el-icon-document-add"
                title="添加分单"
                :class="{'tdDisabled':phfinished}"
                :style="{background:'#fff',color:props.data.row.realList.length==0||mawbinfo.orderdom=='直单'?'#ccc':''}"
                :disabled="props.data.row.realList.length==0||mawbinfo.orderdom=='直单'"
                @click="addHawbDialog=true;selHawbData={};checkAddHawbRow=JSON.parse(JSON.stringify(props.data.row));pono='';hawbSel(props.data.row.hawb)"
              ></button>
            </div>

            <div v-else>

<!--               <button
                class="cblue el-icon-search"
                :style="{background:'#fff',color:pdfinishstatus?'#ccc':''}"
                :class="{'tdDisabled':pdfinishstatus}"
                @click="searchConfig=true;searchSource();delguid=props.data.row.guid;searchPDTableData=[]"
                title="查找"
              ></button> -->
              <!-- ||props.data.row.doclist.filter(i=>i.setstatus=='2').length -->
              <button
                class="cblue el-icon-setting"
                :class="{'tdDisabled':pdfinishstatus}"
                :style="{background:'center',color:pdfinishstatus?'#ccc':''}"
                @click="changeDeclare(props.data.index)"
                title="修改"
              ></button>
              <button
                class="cblue el-icon-delete-solid"
                :class="{'tdDisabled':pdfinishstatus}"
                :style="{background:'center',color:pdfinishstatus?'#ccc':''}"
                @click="delDeclare(props.data.index)"
                title="删除"
              ></button>
              <!-- note:配单操作 -->
              <!-- 显示发送邮件按钮 -->
              <a
                v-if="props.data.row.bggys!='3796'"
                class="cblue el-icon-s-promotion"
                :class="{'tdDisabled':!props.data.row.doclist.filter(i=>i.id>0).length||!props.data.row.doclist.filter(i=>i.setstatus=='2').length||mawbinfo.pdfinishstatus!=='1'
                }"
                :style="{background:'center',color:!props.data.row.doclist.filter(i=>i.id>0).length||!props.data.row.doclist.filter(i=>i.setstatus=='2').length||mawbinfo.pdfinishstatus!=='1'?'#ccc':''}"
                :disabled="!props.data.row.doclist.filter(i=>i.id>0).length
                ||!props.data.row.doclist.filter(i=>i.setstatus=='2').length
                ||mawbinfo.pdfinishstatus!=='1'
                "
                :href="`mailpro:[{datatype:'配单发送',pono:'${mawbinfo.pono}',czman:'${czman}',boguid:'${mawbinfo.boguid}',guid:'${props.data.row.guid}'}]`"
                id="xnfs"
                title="发送"
                @click="afterSend"
              >
             <!--  :href="`mailpro:[{datatype:'配单发送',guid:'${props.data.row.guid}',czman:'${czman}',boguid:'${mawbinfo.boguid}'}]`" -->
              <!--   :title="mailpro:[{datatype:'配单发送',guid:"+props.data.row.guid+",czman:"+localStorage.usrname+"}]" -->
              <!-- `mailpro:[{datatype:'配单发送',guid:${props.data.row.guid},czman:${localStorage.usrname}}]` -->
             <!--  <a href="https://www.baidu.com/"></a> -->
              </a>
              <button
                v-else
                class="cblue el-icon-s-promotion"
                :class="{'tdDisabled':!props.data.row.doclist.filter(i=>i.id>0).length||!props.data.row.doclist.filter(i=>i.setstatus=='2').length||mawbinfo.pdfinishstatus!=='1'
                }"
                :style="{background:'center',color:!props.data.row.doclist.filter(i=>i.id>0).length||!props.data.row.doclist.filter(i=>i.setstatus=='2').length||mawbinfo.pdfinishstatus!=='1'?'#ccc':''}"
                :disabled="!props.data.row.doclist.filter(i=>i.id>0).length
                ||!props.data.row.doclist.filter(i=>i.setstatus=='2').length
                ||mawbinfo.pdfinishstatus!=='1'
                "
                @click="sendDeclare(props.data.row)"
                title="发送"
              ></button>
            </div>

          </template>

        

        </commonTable>
        <p style="margin:20px 0" v-if="!mark">预报件重体合计：{{ybjztTotal}}</p>
      </div>

      <div style="flex:1;width:400px" class="right">

      

        <h4  v-if="!mark">

            <span style="width:48px;display:inline-block">
            <el-button type="primary" @click="peizhiFunc({},1,true,true)" v-show="sjTableData.filter(i=>!i.statusPz&&i.checked).length" class="rightButton">配置</el-button>
            <el-button type="danger"  @click="peizhiFunc({},2,true,true)" v-show="sjTableData.filter(i=>i.statusPz&&i.checked).length" class="rightButton">解配</el-button>
            </span>
      

        实际货物信息
         <i
            class="el-icon-search"
            :style="{cursor:'pointer',color:pdfinishstatus?'#ccc':'#00457D',fontWeight:'bold',fontSize:'20px!important',transform:'translate(-4x, 6px)'}"
            :class="{'tdDisabled':phfinished||radioCheck>=0&&ybTableData[radioCheck]&&ybTableData[radioCheck]['storeType']!='入库'||radioCheck<0}"
            :disabled="phfinished||radioCheck>=0&&ybTableData[radioCheck]&&ybTableData[radioCheck]['storeType']!='入库'||radioCheck<0"
            title="搜索配货"
            @click="searchPeihuodialog=true;inputModelData={};searchPhRowData=ybTableData[radioCheck];searchPHTableData=[]"
          ></i>

        
        </h4>
        


        <h4  v-else>
             
            <span style="width:48px;display:inline-block">

            <el-button type="primary" :disabled="sjTableData.filter(i=>i.checked).length!=0&&sjTableData.filter(i=>i.checked)[0]['setstatus']!='1'"  @click="peidanFunc(true,'','1')" v-if="sjTableData.filter(i=>i.checked&&i.setstatus=='1').length" size="mini" class="rightButton">配置</el-button>

            <el-button type="danger" :disabled="sjTableData.filter(i=>i.checked).length!=0&&sjTableData.filter(i=>i.checked)[0]['setstatus']=='1'" @click="peidanFunc(true,'','10')" v-if="sjTableData.filter(i=>i.checked&&i.setstatus!='1').length" size="mini" class="rightButton">解配</el-button>
            </span>

            <span>报关资料信息</span>
         <i
            class="el-icon-search"
            :style="{cursor:'pointer',color:pdfinishstatus?'#ccc':'#00457D',fontWeight:'bold',fontSize:'20px!important',transform:'translate(-4x, 6px)'}"
            :class="{'tdDisabled':pdfinishstatus}"
            :disabled="pdfinishstatus"
            title="搜索配置"
            @click="searchConfig=true;searchPDTableData=[]"
          ></i>
         
        </h4>
<!-- {{sjTableData}} -->
        <commonTable :head="sjTableHead" :table-data="sjTableData" :divStyle="tableHeightStyle">
          <template slot="update" slot-scope="props">
            <!-- <button
              class="cblue el-icon-setting"
              :class="{'tdDisabled':phfinished}"
              :style="{background:props.data.row.background,color:(props.data.row.statusPz||props.data.row.storeType=='入库'||props.data.row.storeType=='实际入库')?'#ccc':''}"
              :title="(props.data.row.statusPz||props.data.row.storeType=='入库'||props.data.row.storeType=='实际入库')?'入库类型或者已配置不能修改！':'修改进仓编号信息'"
              @click="dialogVisible=true;edit(sjTableData[props.data.index],2)"
              :disabled="(props.data.row.statusPz||props.data.row.storeType=='入库'||props.data.row.storeType=='实际入库')"
            ></button> -->

          </template>
    

          <template slot="khjcno" slot-scope="props">
             <span  v-if="mark">
                <button
                class="cblue el-icon-delete-solid"
                style="background:#fff"
                title="删除"
                v-if="props.data.row.setstatus==1&&props.data.row.jobno"
                @click="deljcno(props.data.row.id,props.data.index)"
              ></button>
              {{props.data.value}}
             </span>
                <khjcnoSlot v-else :tableCheckedIndex.sync="rightTableCheckedIndex" :propsData.sync="props.data" pagetype=2>
                </khjcnoSlot>
          </template>

        <template slot="rel_filename" slot-scope="props">
          <span @click="previewFileaddress=props.data.row.fileaddress;previewVisible=true">{{props.data.value}}</span>
        </template>
          <template slot="operate" slot-scope="props">
<!--             <span
              class="cblue"
              :class="[props.data.row.guid?(props.data.row.statusPz?'icon-cancelPeihuo':'icon-peihuo'):'',phfinished?'tdDisabled':'']"
              @click="peizhiFunc(props.data.row,props.data.row.statusPz?2:1)"
              :title="props.data.row.statusPz?'解除配置':'配置'"
              v-if="!mark"
            ></span> -->
<!--             <span
              class="cblue"
              :class="[props.data.row.guid?(props.data.row.statusPz?'icon-cancelPeihuo':'icon-peihuo'):'',phfinished?'tdDisabled':'']"
              @click="peidanFunc(props.data.row,props.data.row.status?10:1)"
              :title="props.data.row.status?'解除配单':'配单'"
              v-if="mark"
            ></span> -->
<!--               <span
              class="cblue"
              :class="[props.data.row.setstatus=='2'?'icon-cancelPeihuo':radioCheck=='-1'?'icon-peidanN':'icon-peidanO',pdfinishstatus||props.data.row.disabled?'tdDisabled':'']"
              @click="peidanFunc(false,props.data.row,props.data.row.setstatus=='1'?1:10)"
              :title="props.data.row.setstatus=='1'?'配单':'解除配单'"
              
            ></span> -->
             <el-checkbox v-model="props.data.row.checked" v-if="!mark" :disabled="phfinished||props.data.row.disabled" @change="changeSelect($event,props.data.row)"></el-checkbox>
             <el-checkbox v-model="props.data.row.checked" v-if="mark" :disabled="pdfinishstatus||props.data.row.disabled" @change="changeSelect($event,props.data.row)"></el-checkbox>
          </template>
        </commonTable>
        <p style="margin:20px 40px"  v-if="!mark">实际件重体合计：{{signjztTotal}}<span style="color:red" v-if="mawbinfo.bgpiece||mawbinfo.bgweight">(此票存在报关件重,则应以报关件重为准)</span></p>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible&&!mark"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1270px"
      @close="clearCurObj()"
    >
    <!-- {{editKhjcnoType}} -->
    <khjcnoOper :mawbinfo="mawbinfo" :statusArr="statusArr" ref="khjcnoYb" :isadd="editKhjcnoType==1" editType=1 :allTableData="allTableData" :guid="guid" :oldhpoid="oldhpoid" :boguid="boguid" @success="getPeihuoInfo()"></khjcnoOper>

    <khjcnoOper :mawbinfo="mawbinfo" style="margin-top:45px" ref="khjcnoSj"  :statusArr="statusArr" :isadd="editKhjcnoType==1" v-if="editKhjcnoType==3" :oldhpoid="oldhpoid" editType=2 :allTableData="allTableData" :guid="guid" :boguid="boguid" @success="getPeihuoInfo()"></khjcnoOper>


      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <!-- {{editKhjcnoIndex}} -->
        <el-button type="primary" @click="peizhiFunc(sjTableData[editKhjcnoIndex])" v-if="editKhjcnoType==3&&sjTableData[editKhjcnoIndex]&&!sjTableData[editKhjcnoIndex].statusPz">配货</el-button>
       <!--  <el-button type="primary" @click="peizhiFunc({},1,true)" v-if="editKhjcnoType==2">配货</el-button> -->
        <el-button type="default" @click="dialogVisible = false">返回</el-button>

      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible&&mark"
      append-to-body
      width="1550px"
    >
    <declareAtcustoms :mawbguid="guid" :ponoDisabledList="ponoDisabledList" servicecode="AA0610" :hawblist="hawblist" :serviceguid="serviceguid" :mawbinfo="mawbinfo" :mark="mark" ref="declare" :dialogVisible.sync="dialogVisible" @searchDeclare="getPeihuoInfo" :modifyIndex="modifyIndex"></declareAtcustoms>
  </el-dialog>

    <el-dialog
      title="搜索配货"
      :visible.sync="searchPeihuodialog"
      v-if="searchPeihuodialog"
      width="1016px"
      append-to-body
    >
      <newFormCmpt
        @wtdataP="wtdataP"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pagetype="1"
        :whereTmpShow="false"
      ></newFormCmpt>
      <div style="margin:12px 0px;">
        <el-button type="primary" @click="getRealList">查询</el-button>
        <el-button type="primary" @click="peizhiFunc({},1,true)">配货</el-button>
      </div>

      <commonTable
        :head="leftZiTableHead"
        :table-data="searchPHTableData"
        isMultiSelect
        divStyle="max-height:420px"
        
      >
      </commonTable>

      <span slot="footer" class="dialog-footer">
        <el-button @click="searchPeihuodialog = false;">返 回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加分运单"
      :visible.sync="addHawbDialog"
      v-if="addHawbDialog"
      width="1016px"
      append-to-body
      @close="getStoreInfo()"
    >
      <!-- {{checkAddHawbRow}} -->
      <span>分运单号：</span>

      <el-select
        v-model="checkAddHawbRow.hawb"
        filterable
        allow-create
        default-first-option
        clearable
        @change="hawbSel"
        @blur="hawbBlur"
        class="input-required"
        placeholder="请选择或输入并选择"
      >
        <el-option v-for="item in hawblist" :key="item.hawb" :label="item.hawb" :value="item.hawb"></el-option>
      </el-select>
      <my-select
        title="订单号："
        style="display:inline-flex"
        :options="ponoList"
        v-model="pono"
        class="input-required"
        v-if="mawbinfo.iscomboine==1"
        selstyle="width:210px"
      ></my-select>
      <!-- {{pono}}
      {{ponoList}}-->

      <div class="hawbpane">
        件数：
        <span>{{selHawbData.piece||0}}</span>
        重量：
        <span>{{Number(selHawbData.weight||0).toFixed(2)}}</span>
        <!-- 体积：
        <span>{{Number(selHawbData.volume||0).toFixed(3)}}</span> -->
        始发港：
        <span>{{selHawbData.sfg||mawbinfo.sfg}}</span>
        目的港：
        <span>{{selHawbData.mdg||mawbinfo.mdg}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addHawbFunc">确 认</el-button>
        <el-button @click="addHawbDialog = false;getStoreInfo()">返 回</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="搜索配置"
      :visible.sync="searchConfig"
      v-if="searchConfig"
      width="1016px"
      custom-class="searchConfig"
      append-to-body
      @opend="searchPDTableData=[]"
    >
    <p style="color:#A1A1A1;font-size:16px;margin-bottom:10px;">
      查询条件
    </p>
      <newFormCmpt
        @wtdataP="wtdataP"
        :view-data.sync="inputViewDataSearch"
        :model-data.sync="inputModelDataSearch"
        :search-data.sync="searchDataSearch"
        :pagetype="1"
        :whereTmpShow="false"
      ></newFormCmpt>
      <div style="margin:12px 0px;">
        <el-button type="primary" @click="declareSearch">查询</el-button>
        <el-button type="primary" @click="addToSjtable">配单</el-button>
        <el-button type="primary" @click="openDoc()">新增报关资料</el-button>
      </div>

      <commonTable
        :head="leftZiTableHeadSearch"
        :table-data="searchPDTableData"
        isMultiSelect
        divStyle="max-height:420px"
        :ziIndex="docindex"
      >

      <!-- <template slot="rel_filename" slot-scope="props">
       <span @click="previewFileaddress=props.data.row.fileaddress;previewVisible=true">{{props.data.value}}</span>
      </template> -->

      <template slot="batchno" slot-scope="props">
        <span  @click="docindex=(docindex==props.data.index?-1:props.data.index)"><i :class="docindex==props.data.index?'el-icon-minus':'el-icon-plus'"></i>{{props.data.value}}</span>
      </template>

      <template slot="ziTable" slot-scope="props">
                <commonTable :head="docziTableHead" :table-data="props.data.row.list" class="peihuoZiTable" v-if="props.data.row.list.length>0"
                  :style="{height:(props.data.row.list.length+1)*32+'px'}" >
                        <template slot="rel_filename" slot-scope="ziprops">
                          <span @click="previewFileaddress=ziprops.data.row.fileaddress;previewVisible=true">{{ziprops.data.value}}</span>
                        </template>
                </commonTable>
      </template>


      </commonTable>

      <span slot="footer" class="dialog-footer">
        <el-button @click="searchConfig = false;">返 回</el-button>
      </span>
    </el-dialog>


    

     <!-- 小框 -->

    <docUpload :dialogShow.sync="dialogDoc" :prevUpload.sync="prevUpload" v-if="dialogDoc"  defaultFunc  :jcnoList="khjcnoListArray.map(i=>i.khjcno)" :peidanF="mark=='peidan'&&radioCheck!='-1'"   :dialogPosition="dialogPosition"   selectTableIndex="-1" @peidanFc="peidanFunc(true,'','1',$event)" @success="declareSearch();if(radioCheck=='-1'){getPeihuoInfo()}" ref="documentS"></docUpload>

    <!-- 大框 -->
    <el-dialog v-if="dialogShow" center :visible.sync="dialogShow" append-to-body>
      <docUpload :dialogShow.sync="dialogShow"  v-if="dialogShow" @success="declareSearch();if(radioCheck=='-1'){getPeihuoInfo()}" defaultFunc ref="document" :jcnoList="khjcnoListArray.map(i=>i.khjcno)" :peidanF="mark=='peidan'&&radioCheck!='-1'"   selectTableIndex="-1" @peidanFc="peidanFunc(true,'','1',$event)"></docUpload>
    </el-dialog>

    <el-dialog v-if="previewVisible&&previewFileaddress" title="文档预览" center :visible.sync="previewVisible" width="80%"
      top="2%" append-to-body>
      <embed :src="previewFileaddress" style="width:100%"
        :style="{height:(previewFileaddress.includes('pdf')||previewFileaddress.includes('txt'))?'800px':'100%'}">
    </el-dialog>


  </div>


</template>

<script>
import khjcnoSlot from '@/components/templates/khjcnoSlot'
import khjcnoOper from '@/components/templates/khjcnoOper'
import declareAtcustoms from '@/components/orderDetails/declareAtcustoms'
export default {
  components:{khjcnoSlot,khjcnoOper,declareAtcustoms},
  props: {
    statusArr: {
      type: Array,
      default() {
        return [];
      }
    },
    mawbinfo: {
      type: Object,
      default() {
        return {};
      }
    },
    saveNumberList: {
      type: Array,
      default() {
        return [];
      }
    },
    allkhjcnoData: {
      type: Array,
      default() {
        return [];
      }
    },
    hawblist: {
      type: Array,
      default() {
        return [];
      }
    },
    phfinished: {
      //是否配货完成
      type: Boolean,
      default: false
    },
    guid: {
      type: [Number, String],
      required: true
    },
    boguid: {
      type: [Number, String],
      required: true
    },
   oldhpoid: {
      type: [Number, String],
    },
    piece: {
      type: [Number, String],
      default: () => ""
    },
    weight: {
      type: [Number, String],
      default: () => ""
    },
    volume: {
      type: [Number, String],
      default: () => ""
    },
    ifSellSite: {
      type: Boolean,
      default: false //是否销售站，销售站禁止禁止配置操作和搜索配货。
    },
    mark:{//配单、配货区别
      type:String,
    },
    pdfinishstatus:{//是否配单完成
      type: Boolean,
      default: false
    },
    khjcnoListArray:{//配单客户进仓编号
      type:Array,
      default(){
        return [];
      }
    },
    sjGoodsTableData:Array,
    serviceguid: [Number, String],
    


  },
  data() {
    return {
      previewVisible:false,
      previewFileaddress:'',
      packageType: [],
      showSubTable: -1,
      docindex:-1,
      curObj: {
        khjcno: "",
        piece: "",
        weight: "",
        volume: "",
        storeType: "",
        storename_yb: "",
        volYbList: [
          {
            packagetypename: "",
            piece: "",
            longs: "",
            widths: "",
            heights: ""
          }
        ]
      },
      ybTableHead: [
        { title: "操作", field: "operate"  },
        { title: "预报进仓编号", field: "khjcno",style:{'pointer-events':'all'} },
        { title: "预报件/重/体", field: "ybjzt",formatType: 4, format: row => `${row.piece}/${row.weight}/${row.volume}` },
        { title: "实际件/重/体", field: "sjjzt" , formatType: 4,format: row => `${row.pieceReal}/${row.weightReal}/${row.volumeReal}`},
        { title: "配置状态", field: "statusPz" },
        { title: "入库类型", field: "storeType",formatType:2,format:(x=>x=='请选择'?'':x) },
        { title: "预计入库仓库", field: "storename_yb" },
        { title: "预计入库日期", field: "yjstoredate"},
        { title: "分运单号", field: "hawb" },
      ],
      ybTableData: [],
      sjTableHead: [
        { title: "", field: "operate", style: { background: "#F0F0F0",minWidth:'48px'} },
        { title: "状态", field: "statusPz", formatType: 4, format: row => row.statusPz?'已配置':'未配置'},
        { title: "客户进仓编号", field: "khjcno",style:{'pointer-events':'all'}  },
        // { title: "进仓序号", field: "jcno" },
        { title: "入库件/重/体", field: "sjjzt" ,formatType: 4, format: row => `${row.piece||'--'}/${row.weight||'--'}/${row.volume||'--'}`},
        { title: "客户确认件/重/体", formatType: 4,format: row => `${row.customCommitPiece||'--'}/${row.customCommitWeight||'--'}/${row.customCommitVolume||'--'}`},
        {
          title: "入库日期",
          field: "jcdate",
          formatType: 1,
          format: "yyyy-MM-dd"
        },
        { title: "入库仓库", field: "storeName" },
        { title: "货物异常", field: "abnormal" ,formatType: 4, format: row => `破损:${row.breakPiece||0},变形:${row.feformPiece||0},潮湿:${row.moistPiece||0}`},
        { title: "唛头", field: "goodsMark" },
        { title: "货物备注", field: "goodsremark" },
        
      ],
      leftZiTableHead: [
        { title: "客户进仓编号", field: "khjcno" ,style:{'pointer-events':'all'} },
        // { title: "进仓序号", field: "jcno" },
        { title: "实际件/重/体", field: "sjjzt",formatType: 4, format: row => `${row.piece}/${row.weight}/${row.volume}` },
        // { title: "客户确认件/重/体", formatType: 4,format: row => `${row.customCommitPiece}/${row.customCommitWeight}/${row.customCommitVolume}`},
        {
          title: "入库日期",
          field: "jcdate",
          formatType: 1,
          format: "yyyy-MM-dd"
        },
        { title: "入库仓库", field: "storeName" },
        { title: "货物异常", field: "abnormal" ,formatType: 4, format: row => `破损:${row.breakPiece||0},变形:${row.feformPiece||0},潮湿:${row.moistPiece||0}`},
        { title: "唛头", field: "goodsMark" }
        // {title:'解除配置',field:'operate'}
      ],
      leftZiTableHeadSearch:[
        { title: "文档批次号", field: "batchno", style: { 'pointer-events': 'all', color: '#014C85', 'cursor': 'pointer' } },
        { title: "客户进仓编号", field: "khjcno" },
        // { title: "进仓序号", field: "jcno" },
        // { title: "文档名", field: "rel_filename",style:{'pointer-events':'all',color:'#014C85','cursor':'pointer'} },
        // { title: "文档类型", field: "source"},
        // { title: "客户确认件/重/体", formatType: 4,format: row => `${row.customCommitPiece}/${row.customCommitWeight}/${row.customCommitVolume}`},
        {title:"快递收件人",field:'sjr'},
        {title:"快递单号",field:'kdnumber'},
        {title:"客服负责人",field:'customername'},
        {title:'经营单位',field:'jydw'},
        { title: "报关供应商", field: "bggys", formatType:5},
        { title: "创建人", field: "addman" },
        { title: "创建日期", field: "adddate" }
      ],
      sjTableData: [],
      leftTableCheckedIndex: -1,
      rightTableCheckedIndex: -1,
      leftZiTableCheckedIndex: -1,
      storeTypeOptions: [],
      dialogVisible: false, //新增与修改进仓编号
      searchPeihuodialog: false, //搜索配货
      searchConfig:false,//搜索配置
      addHawbDialog: false, //添加分运单弹窗
      checkAddHawbRow: {}, //点击添加分运单时的行数据
      inputViewData: {
        khjcno: {
          title: "客户进仓编号",
          type: 1,
          titleStyle: { minWidth: "100px" }
        },
        jcdate: { title: "入库日期", type: 15},
        fid: { title: "委托客户", type: 14, pagetype: "1" }
      },
      inputViewDataSearch: {
        khjcno: {
          title: "客户进仓编号",
          type: 1,
          titleStyle: { minWidth: "100px" }
        },
        batchno: {
          title: "文档批次号",
          type: 1,
        },
        jydw:{title:'经营单位',type:1},
        bggys:{title:"报关供应商",type: 20, pagetype: "3" },
        customername:{title:'客服负责人',type:1},
        sjr:{title:'快递收件人',type: 20,pagetype: 9},
        kdnumber:{title:'快递单号',type:1},
        source:{title:'文件类型',type:5,whereStr: "in",options:[]},
        addman:{title:'创建人',type: 1},
        adddate: { title: "创建日期", type: 15,defaultVal: true},
      
      },
      inputModelData: {},
      searchData: {},
      inputModelDataSearch: {customername:localStorage.usrname},
      searchDataSearch: {},
      searchPHTableData: [],
      searchPDTableData: [],
      searchPhRowData: {}, //点击搜索配货时当前行的数据
      selHawbData: {},
      allTableData: [],
      realList: [],
      ponoListOriginal: [],
      ponoList: [],
      pono: "",
      editKhjcnoType:1, //1新增进仓编号 2编辑预报 入库  3编辑预报 非入库
      editKhjcnoIndex:-1,
      dialogShow:false,//文档弹框
      modifyIndex:-1,//修改报关信息
      delguid:'',//查询配单
      radioCheck:'-1',//单选Index
      defaultSelectRowIndex:'-1',//默认单选行
      goodsTableCheckedIndex:-1,//货物信息表格
      goodsinfoshow:true,//货物信息
      czman:localStorage.usrname,//邮件操作人
      docziTableHead: [
        { title: '文档名', field: 'rel_filename' , style: { 'pointer-events': 'all', color: '#014C85', 'cursor': 'pointer' } },
        { title: '文档类型', field: 'typename' }
      ],
      prevUpload:true,
      dialogDoc:false,//小框
      dialogPosition: {},//上传弹窗的定位
    };
  },
  created() {
    this.$watch(
      () => {
        return this.piece + this.weight + this.volume;
      },
      () => {
        this.curObj.piece = this.piece;
        this.curObj.weight = this.weight;
        this.curObj.volume = this.volume;
      },
      {
        immediate: true
      }
    );

    let groupData = JSON.parse(localStorage.getItem("groupType") || "[]");

    groupData.forEach(item => {
      if (item.groupid == 31) this.packageType.push(item.typename);
      if (item.groupid === 170) this.storeTypeOptions.push(item.ready01);
    });

    this.getStoreInfo();

    this.$watch(
      () => {
        return this.statusArr + this.allTableData;
      },
      () => {
        if(!this.mark){
        let newArr = this.allTableData.map(el => {
          el.status = this.statusArr.includes(el.khjcno);
          // note: 监听货物信息 => 预计入库时间 => yjstoredate === null || yjstoredate === 1900 => yjstoredate = ''
           if (
              el.yjstoredate === undefined ||
              el.yjstoredate === null ||
              el.yjstoredate.includes('1900')
            ) {
              el.yjstoredate = ''
            }
          return el;
        });
        this.$emit("update:saveNumberList", newArr);
        }
      },
      { deep: true, immediate: true }
    );
     this.getPonoList();
     this.changeTableHead()
     this.searchSource()
  },
  mounted(){

  },
  watch: {
    //   statusArr: {
    //   handler(newVal){
    //     this.$nextTick(()=>{
    //     })
    //   },
    //   immediate:true
    // }
  },
  methods: {
    dragOverF(){
        return false
    },
    dragLeaveF(e){
      console.log(e)
      e.path.forEach(i=>{
        if(i.nodeName=="TR"){
          this.radioCheck=$(i).attr('indexKey')
        }
      })
               
      if(!this.radioCheck||this.radioCheck=='-1'){
        return
      }else{
      this.dialogPosition = {
        x: e.clientX + 5,
        y: e.clientY - 5
      }
         
      this.dialogDoc = true
      this.prevUpload = true
      this.$refs.documentS.docupData.bggys= this.ybTableData[this.radioCheck]['bggys']
      this.$refs.documentS.bgNumber= this.ybTableData[this.radioCheck]['pono']
      this.$refs.documentS.docupData.fid= this.mawbinfo.fid
      this.$refs.documentS.docupData.gid= this.mawbinfo.gid

      }

      
    },
    // dropF(e){
    //   var oFile = e.dataTransfer.files[0];
    //   var reader = new FileReader();
    //   this.dialogDoc = false
      
    //   //读取成功
    //   reader.onload = function () {
    //     console.log(reader);
    //   };
    //   reader.readAsDataURL(oFile, 'base64');
    //   return false;
    // },
  //  openDialog(indexData) {
  //       if (indexData < 0) return;
  //       this.radioCheck = indexData;
  //       this.searchConfig = true;
  //     },
    afterSend(){
      //console.log('111')
     // setTimeout(() => {
     //   this.getPeihuoInfo()
     // }, 20000);
    },
    openDoc(){
      if (!this.area|| this.area.includes(",")) {
        return this.$message.error('请选择有且仅有一个站点！');
      }
      var bggys=this.ybTableData.filter(i=>i.checked).length&&this.mark=='peidan'?this.ybTableData.filter(i=>i.checked)[0]['bggys']:''
      this.dialogShow = true
      this.$nextTick(()=>{
        //console.log(this.$refs.document)
      this.$refs.document.docupData.gid=this.mawbinfo.gid
      this.$refs.document.docupData.fid=this.mawbinfo.fid
      this.$refs.document.docupData.bggys= bggys
      this.$axios({
      method: "get",
      params:{sid:this.mawbinfo.gid,system:'空出',timestamp:0,relarea:this.area,area:this.area},
      url: this.$store.state.publicWebApi + "api/PubCustomRel",
      loading: false,
      tip: false,
      nofield: true,
    }).then((results) => {
      this.$refs.document.docupData.customername=results.data.filter(i=>i.lxrtitle == "客服" &&i.lxrss == 1).length?results.data.filter(i=>i.lxrtitle == "客服" &&i.lxrss == 1)[0]['name']:''
    });
      })
      // setTimeout(()=>{
        
      // },1000)
      
      // this.$refs.document.data.docupData.gid=this.mawbinfo.gid
      // this.$refs.document.data.docupData.fid=this.mawbinfo.fid

      // console.log(this.mawbinfo.gid,this.$refs.document.data.docupData.gid,this.mawbinfo.fid,this.$refs.document.data.docupData.fid)
    },
    hawbBlur(ev) {
      this.checkAddHawbRow.hawb = ev.target.value;
      this.hawbSel(ev.target.value);
    },
    hawbSel(el) {
      // console.log(el)
      let piece = 0,
        weight = 0,
        volume = 0;

      this.selHawbData = { piece: 0, weight: 0, volume: 0 };

      if (this.hawblist.filter(i => i.hawb == el).length > 0) {
        this.selHawbData = this.hawblist.filter(i => i.hawb == el)[0];

        this.ybTableData.forEach(i => {
          if (i.hawb == el) {
            i.realList.forEach(e => {
              piece += e.piece;
              weight += Number(e.weight || 0);
              volume += Number(e.volume || 0);
            });
          }
        });
      } else {
        this.checkAddHawbRow.realList.forEach(e => {
          piece += e.piece;
          weight += Number(e.weight || 0);
          volume += Number(e.volume || 0);
        });
      }

      // console.log(this.checkAddHawbRow.realList)

      if (el) {
        this.selHawbData.piece = piece;
        this.selHawbData.weight = weight.toFixed(2);
       // this.selHawbData.volume = volume.toFixed(3);
        this.ponoListOriginal.forEach(i => {
          i.axplist.forEach(e => {
            if (e.hawb == el) {
              this.pono = i.pono;
            }
          });
        });
      } else {
        this.selHawbData.piece = 0;
        this.selHawbData.weight = 0;
      //  this.selHawbData.volume = 0;
      }
    },
    addHawbFunc() {
      if (!this.checkAddHawbRow.hawb) {
        return this.$message.error("请选择或输入分运单号！");
      }

      if (this.mawbinfo.iscomboine == 1 && !this.pono) {
        return this.$message.error("请选择订单号！");
      }

      let data = {
        sid: this.checkAddHawbRow.hpoid,
        boguid: this.boguid,
        storeYbGuid: this.checkAddHawbRow.guid,
        hawbList: [
          {
            hawb: this.checkAddHawbRow.hawb,
            khjcno: this.checkAddHawbRow.khjcno,
            ybpiece: this.selHawbData.piece,
            ybweight: this.selHawbData.weight,
           // ybvolume: this.selHawbData.volume,
            mdg: this.selHawbData.mdg || this.mawbinfo.mdg,
            sfg: this.selHawbData.sfg || this.mawbinfo.sfg,
            ybstoreList: this.checkAddHawbRow.realList.map(i => {
              return { guid: i.guid, isdel: "1" };
            })
          }
        ]
      };
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/store/BindHawb",
        data: data,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        //  console.log(results)
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.getStoreInfo();
          this.addHawbDialog = false;
          if (this.mawbinfo.iscomboine == 1) {
            this.relationPono(
              results.data.resultguid > 0 ? results.data.resultguid : ""
            );
          }else{
            //if(results.data.resultguid > 0){
            this.$emit("getHawbNum", 1); //新增分单，需要重新查询分单列表
          //  }
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    relationPono(hawbguid) {
      //关联分单与订单号

      let data = {
        hpoid: this.ponoListOriginal.filter(i => i.pono == this.pono)[0]
          .operguid,
        axpguid:
          hawbguid ||
          this.hawblist.filter(i => i.hawb == this.checkAddHawbRow.hawb)[0].guid
      };
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/updateAxplineHpo",
        data: data,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        //   console.log(results)
        if (results.data.resultstatus == 0) {
          this.getPonoList();

          this.getPeihuoInfo()

          //if(hawbguid){
          this.$emit("getHawbNum", 1); //新增分单，需要重新查询分单列表
          // }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    wtdataP(data) {
      // console.log(data)
      this.inputModelData.wtkhname = data.wtkhname;
    },
     getStoreArr() { //入库仓库
      let cargoData = JSON.parse(localStorage.cargoData);
      let arr = [];
      cargoData.map(item => {
        if (item.area ==this.mawbinfo.area||this.$store.state.areaState) {
          arr.push(item.storename);
        }
      });
      return arr;
    },
    peizhiFunc(row, type=1, isBatch = false,mark=false) {
      console.log(type, isBatch, mark)
      // console.log(this.searchPhRowData)
      // console.log(this.sjTableData.filter(i => i.checked)[0]['ybguid'])
      // console.log(this.sjTableData.filter(i => i.checked).map(i => i.ybguid))
      //配货 1配货 2取消配货 ,isBatch是否批量,默认否
      let data = {};
      if (isBatch) {
        data = {
          czman: localStorage.usrname,
          // ybStoreGuid: !mark?this.searchPhRowData.guid:this.sjTableData.filter(i => i.checked)[0]['ybguid'],
          ybStoreGuid: !mark ? this.ybTableData.filter(i => i.checked)[0].guid : this.sjTableData.filter(i => i.checked)[0]['ybguid'],
          hpoid: this.guid,
          realStoreGuidList:
            !mark?this.searchPHTableData.filter(i => i.checked).map(i => i.guid):this.sjTableData.filter(i => i.checked).map(i => {
              return i.storeType=="入库"|| i.storeType == "实际入库"?i.guid:i.ybguid
            })
       
        };
        //console.log(data)
        if (data.realStoreGuidList.length == 0) {
          if(this.sjTableData.filter(i => i.checked).length>0){
             data.realStoreGuidList= this.sjTableData.filter(i => i.checked).map(i => {
              return i.storeType == "入库" || i.storeType == "实际入库" ? i.guid : i.ybguid
            })
          }else{
            return this.$message.error("请先选择要配置的数据！");
          }       
        }
      } else {
        data = {
          czman: localStorage.usrname,
          ybStoreGuid: row.ybguid,
          hpoid: this.guid,
          realStoreGuidList: [row.guid]
        };
      }

      let api =
        type == 1 ? "api/Store/Distribute" : "api/Store/CancelDistribute";
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + api,
        data: data,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        // console.log(results);
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.dialogVisible=false;
          this.getStoreInfo();
          if (isBatch) {
            this.getRealList();
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    peidanFunc(select,row,type,ids){//true、false单选多选  row行数据  1、配单 10、解配;ids 从搜索配置添加后，如果左侧有选中的列，则直接配单
      let data={}
      if(this.radioCheck=='-1'&&type=='1'){
        return this.$message.error('请先勾选报关分单号')
      }


     if(!select){
      data={czman: localStorage.usrname,guid:this.boguid,declguid:type=='1'?this.ybTableData[this.radioCheck]['guid']:row.declguid,status:type,id:row.id}
     }else{
     data={czman: localStorage.usrname,guid:this.boguid,declguid:this.ybTableData[this.radioCheck]['guid'],status:type,id:ids||this.sjTableData.filter(i => i.checked).map(i => i.id).join(',') || ''}

     if(!data.id){
      return this.$message.error("请先选择要配置的数据！");
     }
     }
     
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + 'api/pd',
        data: data,
        noarea: true,
        loading: true,
        tip: false
      }).then(results=>{
          if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.getStoreInfo();
          // if(select){
          //   this.declareSearch()
          // }
          this.radioCheck='-1'
        } else {
          this.$message.error(results.data.resultmessage);
        }
      })
    },
    deljcno(id,index){//删除进仓编号
      //alert(index)
      this.$confirm('是否确认删除?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
      })
      .then(()=>{
        this.$axios({
        method: "post",
        url: this.$store.state.webApi + 'api/NoPdDoc',
        data: {id:id,pono:''},
        noarea: true,
        loading: true,
        tip: false
      }).then(results=>{
          if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.sjTableData.splice(index,1)
         
        } else {
          this.$message.error(results.data.resultmessage);
        }
      })
      })
      .catch(()=>{
        this.$message({
            type: 'info',
            message: '已取消删除'
          });   
      })

    },
    declareSearch(){//配单查询
      let search = this.searchDataSearch;
      search.dom='kcdoc'
      search.bgguid={less:0}//搜索未配置
      search.ready01='报关'
      search.jobno=''
      // if(!search.source){
      //   return this.$message.info('请选择文件类型')
      // }
      this.$axios({
        method: "get",
        url: this.$store.state.imageWebApi + "api/RankDoc",
        params: { json: JSON.stringify({ where: search })},
        loading: true,
        tip: false,
        nofield: true
      }).then(results => {
        this.searchPDTableData = results.data;
        // this.searchPDTableData.forEach(i=>{
        //   if(this.sjTableData.map(item=>item.khjcno).indexOf(i.khjcno)!='-1'){
        //     i.checkboxdisable=true
        //   }else{
        //     i.checkboxdisable=false
        //   }
        // })
      });
    },
    searchSource(){
        if(!this.inputViewDataSearch.source.options.length){
        this.$axios({
        method: "get",
        url: this.$store.state.imageWebApi + "api/RankDoc",
        params: {},
        loading: false,
        tip: false,
        nofield: true
      }).then(results => {
        let filterData=results.data.filter(i=>i.name=='报关')[0]['typelist']
        filterData.forEach(i=>{
          this.inputViewDataSearch.source.options.push({label:i.typename,value:i.typename})
        })
        //this.searchDataSearch.source='报关资料'
      });

      
      }

     //inputViewDataSearch
    },
    addToSjtable(){//添加至实际右侧表格
    // let ids=this.searchPDTableData.filter(i=>i.checked).map(i=>i.id).join(',')
   let ids = this.searchPDTableData.filter(i => i.checked).map(i => {
      return i.list.map(i=>i.id)
    }).flat().join()
    
    if(!ids){
      return this.$message.info('请选择数据')
    }
     this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/NoPdDoc",
        data: {id:ids,pono:this.mawbinfo.pono},
        loading: true,
        tip: false,
        noarea:true,
        nofield: true
      })
     .then(results=>{
      if(results.data.resultstatus==0){
         
        //  this.searchPDTableData.filter(i=>i.checked).forEach(i=>i['jobno']=this.mawbinfo.pono)
        //  this.sjTableData=this.sjTableData.concat(this.searchPDTableData.filter(i=>i.checked).map(i=>i.list).flat())        
        //  this.docRadioF(this.radioCheck)
            let ids= this.searchPDTableData.filter(i => i.checked).map(i => i.list).flat().map(i=>i.id).join(',')||''
            if(this.radioCheck!=-1){
              this.peidanFunc(true, '', 1, ids)
            }else{
              this.getPeihuoInfo()
            }
          // this.sjTableData.forEach(i=>{
          //  this.$set(i,'disabled',false)
          //  this.$set(i,'checked',false)
          // })
       
        //this.declareSearch()
        this.searchConfig=false
        this.$message.success(results.data.resultmessage)
      }else{
        this.$message.error(results.data.resultmessage)
      }
      //console.log(results.data)
     })
    },
    saveNumber() {
      if (!this.curObj.khjcno) {
        this.$message.error("请输入或选择进仓编号");
        return;
      }
      // if (!this.allTableData.every((item => item.guid||item.khjcno.toUpperCase() !== this.curObj.khjcno.toUpperCase() || item.guid == this.curObj.guid ))) {
      //   return this.$message.error('进仓编号重复')
      // }
      if (
        this.allTableData.filter(
          i =>
            i.guid &&
            i.khjcno.toUpperCase() == this.curObj.khjcno.toUpperCase() &&
            i.guid != this.curObj.guid
        ).length > 0
      ) {
        return this.$message.error("进仓编号重复");
      }
      if (!this.curObj.piece || !this.curObj.weight || !this.curObj.volume) {
        return this.$message.error("请填写完整信息");
      }
      if (this.mawbinfo.area == "上海" && !this.curObj.storeType) {
        return this.$message.error("请选择入库类型");
      }

        if ((this.curObj.storeType=='晚入库'||this.curObj.storeType=='入库')&&!this.curObj.storename_yb) {
        return this.$message.error("请选择入库仓库");
      }
      if (this.curObj.storeType!='晚入库'&&this.curObj.storeType!='入库'){
        this.curObj.storename_yb=''
      }


      if (this.curObj.volYbList.length !== 0) {
        for (let i in this.curObj.volYbList) {
          if (
            this.isRequired(this.curObj.volYbList[i]) &&
            this.hasEmptyValue(this.curObj.volYbList[i])
          ) {
            return this.$message.error("请填写完整信息");
          }
        }
      }

      if (this.curObj.guid) {
        this.editStoreInfo(this.curObj);
      } else {
        this.addStoreInfo(this.curObj);
      }
    },
    clearCurObj() {
      this.curObj = {
        khjcno: "",
        piece: this.piece,
        weight: this.weight,
        volume: this.volume,
        storeType: "",
        storename_yb:'',
        volYbList: [
          {
            packagetypename: "",
            piece: "",
            longs: "",
            widths: "",
            heights: ""
          }
        ]
      };
    },
    packageFn(index) {
      if (index == 0) {
        this.curObj.volYbList.push({
          packagetypename: "",
          piece: "",
          longs: "",
          widths: "",
          heights: ""
        });
      } else {
        this.curObj.volYbList.splice(index, 1);
      }
    },
    exSubTable(index) {
      if (this.showSubTable == index) {
        this.showSubTable = -1;
      } else {
        this.showSubTable = index;
      }
    },
    edit(row,index) {
    
      this.editKhjcnoType=row.storeType&&row.storeType=='入库'?2:3;
      this.editKhjcnoIndex=index;
      setTimeout(() => {
        console.log(row)
         this.$refs.khjcnoYb&&this.$refs.khjcnoYb.edit(row);
          if(row.storeType!='入库'&&!row.statusPz){
           this.$refs.khjcnoSj&&this.$refs.khjcnoSj.edit(row['autoMapRealList'][0]);     
          }
          if(row.storeType=='入库'){
          this.inputModelData={};this.searchPhRowData=row;this.searchPHTableData=[]
          }
      }, 0);

      return;

      // if (row.statusPz == true && row.storeType == "入库") {
      //   return this.$message.error("已配置分单不可修改");
      // }

      if (this.curObj.guid) {
        return this.$message.error("请先保存编辑中的进仓编号");
      }
      this.curObj =Object.assign(this.curObj,JSON.parse(JSON.stringify(row))) ;
      if(type==2){
        this.curObj.piece=this.curObj.customCommitPiece
        this.curObj.weight=this.curObj.customCommitWeight
        this.curObj.volume=this.curObj.customCommitVolume
        this.curObj.storename_yb=this.curObj.storeName
        this.curObj.volYbList=this.curObj.vollist
      }

      if (!this.curObj.volYbList || this.curObj.volYbList.length == 0) {
        this.curObj.volYbList = [
          { packagetypename: "", piece: "", longs: "", widths: "", heights: "" }
        ];
      }
    },
    del(row) {
      if (row.statusPz == true && row.storeType == "入库") {
        return this.$message.error("已配置分单不可删除");
      }

      //console.log(guid)
      this.$confirm("是否删除进仓编号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delStoreInfo(row);
        })
        .catch(() => {});
    },
    getPeihuoInfo() {
      //配货查询预报信息及其已配货的信息
      this.ybTableData=[]
      this.sjTableData=[]
      if(!this.mark){//配货

       let guid=this.mawbinfo.groupid>0&& this.mawbinfo.groupid!= this.mawbinfo.boguid?this.oldhpoid:this.guid
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/Store/GetYbList",
        params: { hpoid: guid,area:this.area },
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        //    console.log(results);
        let data = results.data;
        let leftData = [];
        let rightData = [];
        let realList = [];
        let realListAll = [];

        data.forEach((i,index) => {
          realListAll = realListAll.concat(i.realList);
          i.realList = i.realList.filter(n => n.isshow).map(i=>{i.statusPz=true;return i});
          i.statusPz = i.realList.length != 0; //配置状态，有子列表代表已配置
          if(i.guid==this.searchPhRowData.guid){//默认选中
            this.defaultSelectRowIndex=index
          }
          leftData.push(i);
          rightData=rightData.concat(i.realList).concat(i.autoMapRealList)        
          let ca =i.realList.length+i.autoMapRealList.length-1;
          let zhanweiArr = [];
          for (let n = 0; n < Math.abs(ca); n++) {
            zhanweiArr.push({ isSeat: true,storeType:i.storeType});
          }
          if(ca<0){
               rightData = rightData.concat(zhanweiArr)
          }else{
              leftData = leftData.concat(zhanweiArr);
          }

        });
        rightData.forEach(i=>{
          if(i.storeType=='入库'||i.storeType=='实际入库'){
             i.background="#DFFFD0"
             i.customCommitPiece= i.customCommitWeight=i.customCommitVolume=""
          }else{
            i.background='yellow'
            i.customCommitPiece=i.piece
            i.customCommitWeight=i.weight
            i.customCommitVolume=i.volume
            i.piece=i.weight=i.volume='';
          }
          //this.$set(i,'disabled',true)
          this.$set(i,'checked',false)
          
        })
        this.ybTableData = leftData;
        this.sjTableData = rightData;
        // console.log(leftData);
        // console.log(rightData);
        this.realList = realListAll;
        this.$emit("update:allkhjcnoData", results.data);
        this.allTableData = results.data;
        if(this.dialogVisible&&this.editKhjcnoType!=1){
          this.edit(this.ybTableData[this.editKhjcnoIndex],this.editKhjcnoIndex)
        }
      });
      }else{//配单
        this.modifyIndex=-1
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/pd",
          params: {
            hpoid: this.mawbinfo.guid,
            pono:this.mawbinfo.pono
          },
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
           //console.log(results.data)
          //this.tableData = results.data;
          //this.$emit('getJsxmData', results.data, this.servicecode == 'AA0610' || this.servicecode == 'AG0150' ? 4 : 10, this.servicecode)
          //this.resetForm('open')
          var rightData = [];
          var leftData=[];



          results.data.forEach((i,parentIndex)=>{
            leftData.push(i)
            // if(!i.doclist.length){
            //   i.doclist=[{isSeat: true}]
            // }
            i.emailsendstatus=i.emailsendstatus=='2'?'已发送':i.emailsendstatus=='3'?'已发送已修改':'未发送'
            i.emailsendtime= i.emailsendtime&&i.emailsendtime.indexOf('1900')!='-1'?'':i.emailsendtime
            if(getxmdata('gysxm').filter(name=>name.id==i.bggys).length){
              i.bggysname= getxmdata('gysxm').filter(name=>name.id==i.bggys)[0].usr_name
              //i.bggysname=getxmdata('gysxm').filter(name=>name.id==i.bggys)[0].usr_name.split('-')[1]
            }else{
              i.bggysname=''
            }
            
            if(i.doclist.length){
              this.$set(i,'height',32*i.doclist.length+'px')
              
             //let ids=i.doclist.map(j=>j.id).join(',')
              // if(i.doclist.length>1){
              //   i.doclist.forEach((doc,index)=>{

              //     //if(index!=i.doclist.length-1){
              //       //leftData.push({isSeat: true})
              //       //if(index==0){
              //       //this.$set(doc,'rowspan',i.doclist.length)//跨行，并且第二行隐藏操作单元格
              //       //this.$set(doc,'ids',ids)
              //       //}else{
              //       //this.$set(doc,'rowHide',true)  
              //       //}
              //       this.$set(doc,'declguid',i.guid)
              //     //}else{
              //      // this.$set(doc,'rowHide',true) 
              //       //this.$set(doc,'declguid',i.guid)
              //     //}

              //   })
    
              // }else{
              //   this.$set(i.doclist[0],'declguid',i.guid)
              // }
              i.doclist.forEach((doc,index)=>{
                 this.$set(doc,'declguid',i.guid)
                 this.$set(doc,'disabled',true)
                 this.$set(doc,'checked',false)
              })

              if(i.emailsendstatus=='已发送'||i.emailsendstatus=='2'){
                  this.$set(i,'background','#0caf0033')
                  i.doclist.forEach(i2=>this.$set(i2,'background','#0caf0033'))
              }else{
              
                this.$set(i,'background',parentIndex%2==0?'rgba(0,124,255,0.3)':'rgba(0,124,255,0.5)')
                i.doclist.forEach(i2=>this.$set(i2,'background',parentIndex%2==0?'rgba(0,124,255,0.3)':'rgba(0,124,255,0.5)'))
              }

            }





            rightData=rightData.concat(i.doclist)
          })

          //console.log(rightData)
          //console.log(leftData)
          this.ybTableData=leftData
          this.getDocumentList(rightData)

        });
      }

    },
    getDocumentList(data){

       this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/pd",
          params: {
            boguid: this.mawbinfo.boguid
          },
          noarea: true,
          loading: true,
          tip: false
        })
       .then(results=>{
        results.data.forEach(i=>{
          this.$set(i,'disabled',true)
        })
        // let rightTable=data.concat(results.data)
        // this.ybTableData.forEach(i=>{
        // if(rightTable.filter(i2=>i2.khjcno==i.pono&&i2.setstatus=='1').length){
        //   this.$set(i,'height',32*(i.doclist.length+rightTable.filter(i2=>i2.khjcno==i.pono&&i2.setstatus=='1').length)+'px')
        // }else{
        //   if(!i.doclist.length){
        //      i.doclist=[{isSeat: true}]
        //   }
        // }
        // })

        //rightTable.forEach()
        //results.data.forEach(i=>{if(i.jobno){this.$set(i,'jcnoD',true)}})
        this.sjTableData = data.concat(results.data);
       })
    },
    docRadioF(index){//单选传递事件
    this.radioCheck=index

    this.sjTableData.forEach(i=>{
    this.$set(i,'disabled',false)
    this.$set(i,'checked',false)
    })

  let doclist= this.ybTableData[index] && this.ybTableData[index].doclist||[]
    this.sjTableData.forEach(i=>{//选择已配置只能进行解配和再新配、选择未配置只能进行配置
      if(!doclist.map(item=>item.id).includes(i.id)&&i.setstatus==2||!doclist&&i.setstatus==2){
        this.$set(i,'disabled',true)
      }
    }) 
 

    },
    changeSelect(val,row){

    this.sjTableData.forEach(i=>{
    this.$set(i,'disabled',false)
    })
    if(this.mark){
      this.sjTableData.forEach(i=>{//选择已配置只能进行解配和再新配、
         if(this.ybTableData[this.radioCheck].doclist&&!this.ybTableData[this.radioCheck].doclist.map(item=>item.id).includes(i.id)&&i.setstatus==2||!this.ybTableData[this.radioCheck].doclist&&i.setstatus==2){
          this.$set(i,'disabled',true)
        }
      })
      
      //选择未配置只能进行配置、勾选未配置或者只能勾选已配置
      if(this.sjTableData.filter(i=>i.checked).length){
        this.sjTableData.filter(i=>i.setstatus!=row.setstatus).forEach(i=>this.$set(i,'disabled',true))
      }
    }else{
      if(this.sjTableData.filter(i=>i.checked).length){
         this.sjTableData.forEach(i=>{
        if(i.ybguid!=row.ybguid||i.statusPz!=row.statusPz){
          this.$set(i,'disabled',true)
        }
       })
      }

    }

  
    },
    resertPz(){
    this.dialogVisible=true
    this.ybTableData.forEach(i=>{i.checked=false})
    this.sjTableData.forEach(i=>{i.checked=false;i.disabled=true})
    this.editKhjcnoType=1
    },
    getPonoList() {
      //获取订单号列表
        console.log(this.mawbinfo.iscomboine)

      if (this.mawbinfo.iscomboine == 1) {
        //合并订单
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/getHpoAndAxpline",
          params: { boguid: this.mawbinfo.boguid },
          loading: true,
          tip: false,
          nofield: true
        }).then(results => {
          console.log("订单列表peihuo");
          //  console.log(results.data);
          this.ponoListOriginal = results.data;
          this.ponoList = results.data.map(i => {
            return { label: i.pono, value: i.pono };
          });
          //console.log(this.ponoList);
        });
      }
    },
    changeTableHead(){//改变配置头
     if(this.mark){
      this.ybTableHead=[
      { title: "操作", field: "operate",style:{}},
      { title: "分运单号", field: "hawb"},
      { title: "报关分单号", field: "pono" },
      // { title: "始发港", field: "sfg"},
      // { title: "目的港", field: "mdg"},
      { title: "件数", field: "piece"},
      { title: "重量", field: "weight"},
      { title: "连单数", field: "lds"},
      { title: "报关类型", field: "bglx"},
      { title: "报关供应商", field: "bggys",formatType:5},
      { title: "发送状态", field: "emailsendstatus"},
      { title: "发送人", field: "emailsendman"},    
      { title: "发送时间", field: "emailsendtime"},
      ]

      this.sjTableHead=[
      { title: "", field: "operate", style: { background: "#F0F0F0",minWidth:"48px"} },
      { title: "文档批次号", field: "batchno" },
      { title: "客户进仓编号", field: "khjcno"},
      { title: "文档名", field: "rel_filename", style: { 'pointer-events': 'all', color: '#014C85' ,'cursor':'pointer'} },
      { title: "文档类型", field: "source"},
      { title: "快递收件人", field: "sjr"},
      { title: "报关供应商", field: "docbggys",formatType:5},
      { title: "创建人", field: "addman"},
      { title: "创建日期", field: "adddate"},
      ]

     }
 
    },
    getGoodsTablehead(){
      return [
        { title: "", field: "operate", style: { background: "#F0F0F0", minWidth: '48px' } },
        { title: "客户进仓编号", field: "khjcno", style: { 'pointer-events': 'all' } },
        { title: "入库件/重/体", field: "sjjzt", formatType: 4, format: row => `${row.piece || '--'}/${row.weight || '--'}/${row.volume || '--'}` },
        { title: "客户确认件/重/体", formatType: 4, format: row => `${row.customCommitPiece || '--'}/${row.customCommitWeight || '--'}/${row.customCommitVolume || '--'}` },
        {
          title: "入库日期",
          field: "jcdate",
          formatType: 1,
          format: "yyyy-MM-dd"
        },
        { title: "入库仓库", field: "storeName" },
        { title: "货物异常", field: "abnormal", formatType: 4, format: row => `破损:${row.breakPiece || 0},变形:${row.feformPiece || 0},潮湿:${row.moistPiece || 0}` },
        { title: "唛头", field: "goodsMark" },
        { title: "货物备注", field: "goodsremark" },
      ]
    },
    changeDeclare(index){//修改弹框
    this.dialogVisible=true
    this.modifyIndex=index
    setTimeout(()=>{
    //   let obj= { ...this.ybTableData[index] };
    //  delete obj.emailsendtime
    //  delete obj.emailsendstatus
    //  delete obj.emailsendman
    //  this.$refs.declare.hawbform=[{...this.ybTableData[index]}]

    // this.$refs.declare.declform={...this.ybTableData[index]}
    // delete this.$refs.declare.declform.emailsendtime
    // delete this.$refs.declare.declform.emailsendstatus
    // delete this.$refs.declare.declform.emailsendman
    this.$refs.declare.setListInfo(index)
    },200)

    //console.log(this.$refs.declare)
    },
    delDeclare(index){//删除

      let json = { orderdom: this.mawbinfo.orderdom, declguid: this.ybTableData[index].guid, czman: localStorage.usrname }
        let ex = ''
        // if (this.getStatusText(this.ybTableData[index].status) == '可交付') {
        //   return this.$message.error('当前状态为可交付,不可删除!');
        // }
        this.$confirm("是否确认删除", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExAxplineDeclDelete",
            data: {
              czman: localStorage.usrname,
              guid: this.ybTableData[index].guid
            },
            loading: true,
            noarea: true,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
         
              this.getStoreInfo()
      
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        });
    },
    sendDeclare(data){//发送
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/ExAxplineXinDeclSend",
        data: {guid:data.guid},
        loading: true,
        tip: false,
        nofield: true
      }).then(results => {
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage); 
          this.getPeihuoInfo()
        } else {
          this.$message.error(results.data.resultmessage);
        }

      });
      // this.$prompt(`唯凯${localStorage.usrname}留言`,'发送备注',{
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputType:'textarea',
      //   closeOnClickModal:false,
      // })
      // .then(({value})=>{
      //    this.$axios({
      //   method: "post",
      //   url: this.$store.state.webApi + "api/PdMailSend",
      //   data: { id:data.doclist.map(i=>i.id).join(','),czman:localStorage.usrname,guid:data.guid,bggysname:data.bggysname,remark:value},
      //   loading: true,
      //   tip: false,
      //   nofield: true
      // }).then(results => {
      //   if (results.data.resultstatus == 0) {
      //         this.$message.success(results.data.resultmessage); 
      //         this.getPeihuoInfo()
      //         //this.getStoreInfo()
      //       } else {
      //         this.$message.error(results.data.resultmessage);
      //       }
      
      // });
      // })
      // .catch(()=>{
      //   this.$message({
      //       type: 'info',
      //       message: '取消输入'
      //     });       
      // })
      //console.log(data.doclist.map(i=>i.id).join(','))
     
    },
    getRealList() {
      //配货时查询实际入库信息
      let search = this.searchData;
      search.wtkhname = this.inputModelData.wtkhname;
      delete search.fid;
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/Store/GetRealList",
        params: { json: JSON.stringify({ where: search }) },
        loading: true,
        tip: false,
        nofield: true
      }).then(results => {
        // console.log(results);
        this.searchPHTableData = results.data;
      });
    },
    getStoreInfo() {
      if (this.guid) {
       this.getPeihuoInfo();
        return;
      }
    },
    addStoreInfo(storedata) {
      if (!this.guid) {
        this.$message.error("不存在guid");
        return;
      }

      let json = Object.assign(
        { sid: this.guid, store_childguid: -1 },
        storedata
      );
      json.volYbList = json.volYbList.filter(i => {
        let isEmpty = Object.keys(i).every(key => i[key] == "");
        if (!isEmpty) {
          i.guid = -1;
        }
        return !isEmpty;
      });
        json.oldhpoid=this.oldhpoid
      //console.log(JSON.stringify(json))
      let url = "api/store/addYbInfo"; //旧'api/ExAxplineStore'
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + url,
        data: json,
        noarea: true,
        loading: true,
        tip: true
      }).then(results => {
        //console.log("仓库信息新增")
        //console.log(JSON.stringify(results.data))
        if (results.data.resultstatus == 0) {
          this.getStoreInfo();
          this.clearCurObj();
          this.$emit("success", true);
        }
      });
    },
    editStoreInfo(storedata) {
      let json = Object.assign({ sid: this.guid }, storedata);
      // 过滤掉guid为0的尺寸信息
      json.volYbList = json.volYbList.filter(i => {
        let isEmpty = Object.keys(i).every(key => i[key] == "");
        if (isEmpty) return false;
        if (i.guid == "0") return false;
        i.guid ? "" : (i.guid = -1);
        return true;
      });

      json.sid = this.guid;
      //console.log(JSON.stringify(json));
       let api=this.editKhjcnoType==1?"api/store/EditYbInfo":'api/store/EditCustomCommitInfo'
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + api,
        data: json,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        //console.log("仓库信息修改")
        //console.log(JSON.stringify(results.data))

        if (results.data.resultstatus == 0) {
          this.getStoreInfo();
          this.curObj = {
            khjcno: "",
            piece: this.piece,
            weight: this.weight,
            volume: this.volume,
            storeType: "",
            storename_yb:'',
            volYbList: [
              {
                packagetypename: "",
                piece: "",
                longs: "",
                widths: "",
                heights: ""
              }
            ]
          };
          this.$emit("success", true);
          this.$message.success(results.data.resultmessage);
          if(storedata.guid){
            this.dialogVisible=false
          }
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    delStoreInfo(row) {
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/store/DeleteYbInfo",
        data: {
          guid: row.guid,
          isdel: "2",
          store_childguid: row.store_childguid,
          storeType: row.storeType,
          hpoid: this.mawbinfo.guid,
          khjcno: row.khjcno
        },
        noarea: true,
        loading: true,
        tip: true
      }).then(results => {
        //console.log("删除仓库信息")
        //console.log(JSON.stringify(results.data))

        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          this.getStoreInfo();
          this.$emit("success", true);
        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    },
    isRequired(item) {
      let required = false;

      let keys = ["packagetypename", "piece", "longs", "widths", "heights"];
      for (let i in keys) {
        item[keys[i]] ? (required = true) : "";
      }
      return required;
    },
    hasEmptyValue(item) {
      let empty = false;

      let key = ["packagetypename", "piece", "longs", "widths", "heights"];
      for (let i in key) {
        item[key[i]] == "" ? (empty = true) : "";
      }
      return empty;
    },
            //配单完成
    pdFinish(type) {
      this.$axios({
        method: 'post',
        url: this.$store.state.webApi + 'api/pd',
        data: {
          guid: this.mawbinfo.boguid,
          status: type,
          czman: localStorage.usrname
        },
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
          if (type == '1') {
            this.mawbinfo.pdfinishstatus = '100'
            if(results.data.resultdic){
              this.mawbinfo.pdfinishdate = results.data.resultdic.pdfinishdate
              this.mawbinfo.pdfinishman = results.data.resultdic.pdfinishman
            }

            this.ybTableData.forEach(i=>{
              i.emailsendstatus=='已发送'
              i.background="#0caf0033"
              i.doclist.forEach(i2=>i2.background="#0caf0033")
            })

            // note: 配单操作 
            // 取消配单完成发送邮件
            // document.getElementById('xnfs').click()
            //this.getPeihuoInfo()
          } else {
            this.mawbinfo.pdfinishstatus = '1'
          }
          this.$message.success(results.data.resultmessage)
        } else {
          this.$message.error(results.data.resultmessage)
        }
      })
    },

  },
  computed: {
    area(){
         return this.mawbinfo.area||this.$store.state.areaState
    },
    pzFinishButton(){
      if(this.ybTableData.length){
        return this.ybTableData.some(i=>!i.doclist.length)
      }else{
        return true
      }
      //return this.ybTableData.e
    },
    ponoDisabledList(){
      let arr=[]
      this.ybTableData.forEach(row=>{          
        //row.doclist.filter(i => i.setstatus == '2').length
        if (row.doclist&&this.pdfinishstatus){
            arr.push(row.pono)
        }
      })
      return arr
    },
     ybjztTotal(){
       let j=0,z=0,t=0;
       this.ybTableData.forEach(i=>{
         j+=Number(i.piece||0)
         z+=Number(i.weight||0)
         t+=Number(i.volume||0)
       })
      return `${j}/${z.toFixed(2)}/${t.toFixed(3)}`
     },
     signjztTotal(){
         let j = 0, z = 0, t = 0;
         this.sjTableData.forEach(i => {
           if (i.statusPz) {//只计reallist里面的
             j += Number(i.piece || 0) + Number(i.customCommitPiece || 0)
             z += Number(i.weight || 0) + Number(i.customCommitWeight || 0)
             t += Number(i.volume || 0) + Number(i.customCommitVolume || 0)
           }

         })
         return `${this.mawbinfo.bgpiece || j}/${this.mawbinfo.bgweight || z.toFixed(2)}/${t.toFixed(3)}`

     },
     tableHeightStyle(){
      let maxlen=Math.max(this.ybTableData.length,this.sjTableData.length)
      if(maxlen){
        return { height: (32*(maxlen+1)+20)+'px' }
      }
     }
  },
};
</script>

<style lang="less" scoped>
.enterWarehouseNumber {
  width: 100%;
  padding-bottom:18px;
  border: 1px solid #e8e8e8;
  .formRow{
    .el-row {
        margin-bottom: 15px;
        .el-button {
            margin-left: 20px;
        }
        }
  }
  .formRow{
      padding:10px;
  }
  .divTitle{
     font-size:18px;
     padding:8px;
     border-bottom:1px solid;
     margin-bottom:15px;
    //  color: #31708f;
    // background-color: #d9edf7;
    // border-color: #bce8f1;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
  }
  span {
    display: inline-block;
    width: 75px;
    text-align: right;
    + .el-input,
    .el-select {
      //width: 50%;
      width: calc(100% - 85px);
    }
    + .el-select {
      width: calc(100% - 85px);
    }
  }
  .size {
    display: inline-block;
    .el-input {
      width: 80px;
      margin: 0 9px 0 8px;
    }
    .el-input:last-child {
      margin-right: 0;
    }
  }
  .package-icon {
    display: inline-block;
    vertical-align: middle;
    margin-left: 20px;
    width: 18px;
    height: 18px;
    font-size: 18px;
    border-radius: 50%;
    cursor: pointer;
  }
  .el-icon-circle-plus {
    color: #f56c6c;
  }
  .el-icon-remove {
    color: #5daf34;
  }
  .table-box {
    @table-width: 100%;
    @table-border: 1px solid #e8e8e8;

    margin: 30px 16px 16px;
    width: @table-width;
    border: @table-border;
    .el-row {
      .el-col {
        height: 28px;
        line-height: 28px;
        overflow: hidden;
        text-align: center;
        border-right: @table-border;
        border-top: @table-border;
      }
      .el-icon-circle-plus-outline {
        position: absolute;
        top: 6px;
        left: 110px;
        pointer-events: all;
      }
      .el-icon-circle-plus-outline,
      .el-icon-setting,
      .el-icon-delete {
        cursor: pointer;
        font-size: 16px;
        margin-right: 5px;
      }
    }
    .expansion {
      .el-col {
        border-bottom: @table-border;
      }
    }
    .table-row:last-child > .el-row .el-col {
      border-bottom: @table-border;
    }
    .title {
      + .el-row .el-col {
        border-top: none;
      }
      + .table-row > .el-row .el-col {
        border-top: none;
      }
      .el-col {
        border-top: none;
        border-bottom: @table-border;
      }
    }
    .sub-table {
      width: @table-width * 0.7;
      .el-row {
        width: (@table-width * 0.7) - 1;
        .el-col:last-child {
          border-right: @table-border;
        }
      }
    }
  }
}

.content {
  display: flex;
  /* max-height: 600px; */
  //overflow: scroll;
  h4 {
    height: 30px;
    line-height: 30px;
    color: #000;
  }
  .left {
    flex: 1;
    // width:500px;
  }
  .right {
    flex: 1;
    //  margin-left:10px;
    /deep/ td:first-child {
      border-left: none;
    }
    /deep/ th:first-child {
      border-left: none;
    }
    .rightButton{
      width:48px;
      padding:8px 0px;
      height:28px;
      margin-bottom:4px;
      margin-left:0;
      //display:inline-block!important;
    }

  }
  .cblue {
    color: #004c82;
    cursor: pointer;
    vertical-align: middle;
    padding: 0 2px;
   font-size: 16px;
    span {
      font-size: 14px;
    }
  }
  .peihuoZiTable {
    padding: 0px;
    /deep/ th {
      background-color: #dfffd0;
    }
    /deep/ td {
      background-color: #dfffd0;
    }
  }
}
.hawbpane {
  margin-top: 20px;
  span {
    color: #004c82;
    display: inline-block;
    width: 80px;
  }
}
/deep/.searchConfig{
  /deep/.el-dialog__title{
    color:#014C85;
    font-weight:bold;
  }
  /deep/.el-dialog__body{
    padding-top:10px;
  }
}
</style>
