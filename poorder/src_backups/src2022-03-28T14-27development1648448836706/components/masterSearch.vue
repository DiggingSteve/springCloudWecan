<template>
<div>
    <div class="page-container-box">

        <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData" :search-data.sync="searchData" :pageshow.sync='pageshow' :chinese-where.sync="chineseWhere" :pagetype="1" @reset="reset">
        </newSearchComp>
        <div class="searchForm">
            <el-button @click="search">查询</el-button>
            <el-button @click="allLock('1')">总调锁定</el-button>
            <el-button @click="allLock('2')">总调解锁</el-button>
            <el-button @click="gysModify('1')">外场供应商修改</el-button>
            <!-- <el-button @click="reset">重置</el-button> -->
        </div>
    </div>

    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->

    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" :yellowMargeFixed="false" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal" :dataGrouping="dataGrouping" isGroup :isPaging="false" showMargeColumn ref="tableComponet" v-on:rightF="rightF" :explainInfoArr="explainInfoArr" :isSort="false" @transSelIndex="openDialog">

        <template slot="display" slot-scope="props">
            <!-- <i class="el-icon-edit" title="节点信息"  @click="jiedianShow=true;displayIndex=props.data.index"></i>
    <i class='el-icon-picture' title="本票照片"   @click="showImgFunc(props.data.index)"></i> -->
            <i class="el-icon-edit" title="尺寸信息" @click="sizeRowData(props.data.row.boguid)" style="color: green; cursor: pointer;"></i>
        </template>

        <!-- <template slot="mawb" slot-scope="props">
  <i v-if="props.data.row.hawblist&&props.data.row.hawblist.length>0" :class="[open=='1'&&ziTableIndex!=props.data.index?'el-icon-plus':'el-icon-minus']" style='color:#1a7dbf;font-weight:bold' @click="openZiTable(props.data.row.index,props.data.row.hawblist)">
  </i>
  <span>{{props.data.value}}</span>
</template>

  <template slot="pono" slot-scope="props">
  <span class="poczColor" @click="openDialog(props.data.index)"><span style="color:red" v-if="props.data.row.commbillmodifystatus=='2'">(待)</span>{{props.data.value}}</span>
  </template>

  <template slot="dzstatus" slot-scope="props">
  <span :style="{'color':props.data.value=='签单申请'?'red':props.data.value=='签单确认'?'green':'#1a7dbf','cursor':'pointer'}" @click="sizeRowData(props.data.row.boguid)">{{props.data.value}}</span>
  </template>

  <template slot="dzstatus" slot-scope="props">
  <span :style="{'color':props.data.value=='签单申请'?'red':props.data.value=='签单确认'?'green':'#1a7dbf','cursor':'pointer'}" @click="sizeRowData(props.data.row.boguid)">{{props.data.value}}</span>
  </template>
-->
    </tableCompt>

    <!-- 主菜单右键 -->
    <el-card class="box-card" v-if="rightM&&opentype=='1'" :style="{'position':'fixed','left':position.left,'top':position.top,'width':'150px','zIndex':'999999999'}">
        <p :class="[rowData.pcstatus<'100'?'disabled':'']" @click="showCwPc"><i class="el-icon-picture-outline"></i>舱位照片</p>
        <!-- 	<p @click="inPc(3)" :class="[rowData.pcstatus>=100||!rowData.hbh||!rowData.hbrq||!rowData.mawb?'disabled':'']"><i class="el-icon-download"></i>配舱</p>
	<p @click="inPc(3,'out')" :class="[rowData.pcstatus!=100?'disabled':'']"><i class="el-icon-upload2"></i>返舱</p>
	<p @click="addShipPc('2')" :class="[rowData.pcstatus!='100'?'disabled':'']"><i class="el-icon-edit" ></i>舱位信息修改</p>
	<p @click="allLock('1')" :class="[rowData.pcstatus!='100'?'disabled':'']"><i class="el-icon-lock"></i>舱位锁定</p> -->
    </el-card>

    <!--  子菜单右键-->
    <el-card class="box-card" v-if="rightM&&opentype=='2'" :style="{'position':'fixed','left':position.left,'top':position.top,'width':'150px','zIndex':'999999999'}">
        <!-- <p :class="[getStatusNum('配舱状态',rowData.pcstatus)>='400'||getStatusNum('配舱状态',rowData.pcstatus)<'100'?'disabled':'']" @click="gysModify('2')"><i class="el-icon-edit"></i>外场供应商修改</p> -->
        <p @click="gysModify('2')"><i class="el-icon-edit"></i>外场供应商修改</p>
        
        <p @click="zdBack(rowData)" :class="[getStatusNum('配舱状态',rowData.pcstatus)!='200'?'disabled':'']"><i class="el-icon-upload2"></i>总调返舱</p>

        <p @click="jjBack(rowData)" :class="[getStatusNum('配舱状态',rowData.pcstatus)!='400'||getStatusNum('单证状态',rowData.dzstatus)=='800'?'disabled':'']"><i class="el-icon-upload2"></i>已交接返舱</p>

    </el-card>

    <el-dialog v-if="gysModifyShow" :visible.sync="gysModifyShow" width="500px">
        <h4 style="margin-bottom:20px;">
            外场供应商修改
        </h4>
        <el-select v-model="gySid" placeholder="请选择" style="width:100%">
            <el-option v-for="item in gysList" :key="item.gid" :label="item.gidname" :value="item.gid">
            </el-option>
        </el-select>

        <p style="margin-top:10px;">
            <el-button @click="saveGys">保存</el-button>
            <el-button @click="gysModifyShow=false">返回</el-button>
        </p>
    </el-dialog>

    <el-dialog :visible.sync="jiedianShow" width="90%" title="节点状态信息" top="4%" center v-if="jiedianShow" :close-on-press-escape="false" append-to-body>
        <jiedian :mawbinfo="tableDataRes[displayIndex]" :orderdom="tableDataRes[displayIndex].orderdom"></jiedian>
    </el-dialog>

    <el-dialog :visible.sync="imgShow" class="dialogImgDoc" :close-on-click-modal="false" v-if="imgShow" width="980px" append-to-body top="0">
        <iframe :src="imgUrl" frameborder="0" allowtransparency="true" style="width: 100%; height: 100%; border: 0px none;"></iframe>
    </el-dialog>

    <!-- 航线签单查询 -->
    <!--    <el-dialog title="航线综合查询" v-if="dialogShow3"  center :visible.sync="dialogShow3"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >

             <airPlaneDeatil :boguid="boguid"  :visible.sync="dialogShow3" ></airPlaneDeatil>

        </el-dialog> -->

    <!-- 综合查询 -->
               <el-dialog  title="综合查询" v-if="dialogShow"  center :visible.sync="dialogShow"  class="dialogPage" :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false" >
              <mawbaddput   :visible.sync="dialogShow"  :pagetype='15' :mawbguid="mawbguid" :boguid="boguid" :area="area" :orderdom="orderdom"></mawbaddput>
        </el-dialog>

    <!-- 舱位查询 -->
    <!--            <el-dialog title="舱位查询" :visible.sync="cwDialog" class="addPcDialog" :close-on-click-modal="false" v-if="cwDialog" width="1300px" >
           <cwSearch :visible.sync="cwDialog"></cwSearch>

        </el-dialog>
 -->

    <!-- 总运单管理 -->

    <!-- <el-dialog title="总运单管理" :visible.sync="mawbManageDialog" class="addPcDialog" :close-on-click-modal="false" v-if="mawbManageDialog" width="1300px" >
           <mawbmanage :visible.sync="mawbManageDialog"></mawbmanage>

        </el-dialog> -->

    <!-- 配舱 -->
    <!--  <el-dialog :visible.sync="inPcDialog" class="addPcDialog" :close-on-click-modal="false" v-if="inPcDialog" width="1100px">
           <h4 style="margin-bottom:20px;">
           	配舱操作
           	<span v-if="pcType=='1'||'3'">(批量模式:{{pcTitle.num}}票)</span>
           	<span>航班号:{{pcTitle.hbh}}</span>
           	<span>航班日期:{{pcTitle.hbrq}}</span>
           </h4>
            <commonTable class="commonTable" :head="inPcTable" :table-data="inPcData" style="position:relative;">
            	 <template slot="operation" slot-scope="props">

                     <el-radio v-model="inPcId" :label="props.data.row.guid"> </el-radio>

            	 </template>
            </commonTable>

            <p style="margin-top:20px;">
            <el-button @click="savePc('1')" :disabled="!inPcId">保存</el-button>
            <el-button @click="inPcDialog=false">返回</el-button>
           </p>
          </el-dialog> -->

    <!-- 新增舱位配舱 -->
    <!--            <el-dialog :visible.sync="newCW"  v-if="newCW" width="1100px" append-to-body>
           <h4 style="margin-bottom:20px;" v-if="operationType=='3'">
           	新增舱位并配舱 上榜工作号:{{rowData.pono}}
           </h4>
           <h4 style="margin-bottom:20px;" v-if="operationType=='2'">
           	舱位信息修改  航班号:{{rowData.hbh}} 航班日期:{{rowData.hbrq}}
           </h4>
           <addNewCw :visible.sync="newCW" :operationType="operationType" :shipaceData="shipaceData" @reSearch="upDateRow"></addNewCw>
          </el-dialog> -->

    <!-- 上榜信息修改 -->
    <!--           <el-dialog :visible.sync="modInfoDialog" v-if="modInfoDialog" width="600px" :title="'上榜信息修改'+infoData.pono" append-to-body>
            <newFormCmpt
                  :view-data.sync="infoViewModel"
                  :model-data.sync="infoData"

             ></newFormCmpt>
             <el-button @click="saveInfo">保存</el-button>
             <el-button @click="modInfoDialog=false">返回</el-button>
          </el-dialog> -->

    <!-- 虚拟拉货 -->
    <!--           <el-dialog :visible.sync="xnlhDialog"  width="600px" append-to-body @close="xnlhData={truckreason:'',reasontype:'虚拟拉货',truckman:'',truckmawb:'',truckremark:'',truckdate:'',modifyman:'','modifydate':''}">
           <h4 style="margin-bottom:20px;">
           	虚拟拉货 总运单号:{{rowData.mawb}}
           </h4>
             <newFormCmpt
                  :view-data.sync="xnlhViewModel"
                  :model-data.sync="xnlhData"
                  style="margin-left:-30px;"
             ></newFormCmpt>
             <p style="margin-bottom:12px;">
             <el-button @click="saveXnlh">保存</el-button>
             <el-button @click="xnlhData.truckreason='';xnlhData.truckremark=''">重置</el-button>
             <el-button @click="xnlhDialog=false">返回</el-button>
             </p>
             <commonTable class="commonTable" :head="xnlhTable" :table-data="xnlhTableData" v-if="xnlhTableData">
             	<template slot="operate" slot-scope="props">

<i class="el-icon-setting" title="修改" @click="modXnlh(props.data.index,props.data.row)"></i>

<i class="el-icon-delete" title="删除" @click="delXnlh(props.data.index)"></i>
             	</template>
             </commonTable>
          </el-dialog> -->

    <!-- 舱位左键弹框 -->
    <!--           <el-dialog :visible.sync="cwContentDialog" v-if="cwContentDialog" width="500px" append-to-body title="舱位内容">
          <p style="letter-spacing:0.1em;margin-bottom:12px;">
            航班号:{{rowData.hbh}}  航班日期:{{rowData.hbrq}}
          </p>
          <div id="copyText">
          <el-input type="textarea" v-model="rowData.pzcontent" disabled></el-input>
          </div>
          </el-dialog> -->

    <!-- 配置总运单弹框 -->
    <!--           <el-dialog :visible.sync="dialogMawbConfig" v-if="dialogMawbConfig" width="1100px" append-to-body title="配置总单">
                <div class="detail">
        <div style="position:relative;top:-16px;">
          <strong>总运单号</strong>：
          <span>
            <el-input
              style="width:160px;"
              v-model="dialogMawb"
              placeholder="请选择总运单号"
              v-verify="'mawb'"
              @blur="getMawbGys()"
            ></el-input>
            <el-button  @click="mawbConfigFunc(1)" size="mini">保存</el-button>
            <el-button size="mini" v-if="mawbTab!='1'" @click="mawbSaveBorrow=true" :disabled="!dialogMawb">保存并外借</el-button>
            <i
              title="总运单维护"
              class="el-icon-edit-outline"
              @click="mawbDialog=true"
              style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:10px;top:2px"
            ></i>
            <i
              title="刷新"
              class="el-icon-refresh"
              @click="getMawbConfig"
              style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:14px;top:2px"
            ></i>
          </span>
        </div>
       <el-tabs type="border-card"  v-model="mawbTab">
       <el-tab-pane :label="`正常运单(${mawbConfigtableData.length})`">
       <commonTable
          :head="mawbConfigHead"
          :table-data="mawbConfigtableData"
          style="margin-top:8px;"
        >
          <template slot="mawb" slot-scope="props">
            <span
              style="cursor:pointer"
              @click="choiseDialogMawb(props.data.row)"
            >{{props.data.value}}</span>
          </template>
        </commonTable>
       </el-tab-pane>
  <el-tab-pane :label="`外借运单(${mawbBorrowData.length})`">
   <commonTable
          :head="mawbBorrowHead"
          :table-data="mawbBorrowData"
          style="margin-top:8px;"
        >
          <template slot="mawb" slot-scope="props">
            <span
              style="cursor:pointer"
              @click="choiseDialogMawb(props.data.row)"
            >{{props.data.value}}</span>
          </template>
        </commonTable>
  </el-tab-pane>
  <el-tab-pane :label="`预定运单(${mawbPreData.length})`">
  <commonTable
          :head="mawbPreHead"
          :table-data="mawbPreData"
          style="margin-top:8px;"
        >
          <template slot="mawb" slot-scope="props">
            <span
              style="cursor:pointer"
              @click="choiseDialogMawb(props.data.row)"
            >{{props.data.value}}</span>
          </template>
        </commonTable>
  </el-tab-pane>

       </el-tabs>

      </div>
          </el-dialog> -->

    <!-- 解除总运单配置弹框 -->
    <!--     <el-dialog
      :visible.sync="mawbConfigConfim"
      width="320px"
      append-to-body
      :close-on-click-modal="false"
      top="15%"
      center
    >
      <el-button  type="primary" plain @click="mawbConfigFunc(2,1)">可用</el-button>
      <el-button  type="primary" plain @click="mawbConfigFunc(2,4)">不可用</el-button>
      <el-button  type="primary" plain @click="mawbConfigFunc(2,5)">作废</el-button>
    </el-dialog> -->

    <!-- 保存并外借 -->
    <!--     <el-dialog
    :visible.sync="mawbSaveBorrow"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      top="15%"
      center
    >
    <h4 style="margin-bottom:8px;">总运单保存外借</h4>
    <p style="margin-bottom:8px;">
    <span style="width:300px;display:inline-block">总运单号：{{dialogMawb}}</span>
    <span style="width:300px;display:inline-block">借出人：{{getAddman()}}</span>
    <span style="width:300px;display:inline-block">
    借出日期：
      <el-date-picker
                    v-model="mawbBorrowDate"
                    type="datetime"
                    placeholder="选择日期时间"
                    :format="'yyyy-MM-dd HH:mm'"
                    :value-format="'yyyy-MM-dd HH:mm'"
                    style="width:200px;"
                  ></el-date-picker>
    </span>

    </p>
    <p style="margin-bottom:8px;">
    <span style="width:400px;display:inline-block">借出客户：{{rowData.wtkhname}}</span>
      <span>借出备注：</span>

      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="mawbRemark" style="width:400px;vertical-align:middle">
      </el-input>

    </p>
    <el-button size="mini" @click="mawbSaveBrow">保存</el-button>
    <el-button @click="mawbSaveBorrow=false" size="mini">返回</el-button>
    </el-dialog> -->

    <!-- 总运单维护弹框 -->
    <!--     <el-dialog
      :visible.sync="mawbDialog"
      width="1300px"
      top="4%"
      v-if="mawbDialog"
      :close-on-press-escape="false"
      append-to-body
    >
      <iframe
        :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman()}&area=${rowData.area}`"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height:700px; border: 0px none;"
      ></iframe>
    </el-dialog> -->

    <!-- 单证信息左键弹框 -->
    <el-dialog :visible.sync="sizeDialog" width="1000px" top="4%" v-if="sizeDialog&&sizeData" :close-on-press-escape="false" custom-class="sizeDialogClass">
        <h3>订舱编号：{{sizeData.hpoInfo.pono}}</h3>
        <div style="width:900px">
            <!-- 运价信息 -->
            <h4><span class="sizeLeft">运价信息</span><span class="sizeRight" @click="copyContent('yjinfo')">复制内容</span></h4>
            <div class="info">
                <table id="yjinfo" v-if="sizeData.hpoInfo">
                    <tr>
                        <td>销售站运价类型：{{sizeData.xshpoInfo?sizeData.xshpoInfo.isinwageallin=='-1'?'':sizeData.xshpoInfo.isinwageallin:'--'}}</td>
                        <td>销售站运价单价：{{sizeData.xshpoInfo?sizeData.xshpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeData.xshpoInfo.inwagecostprice).toFixed(2):'--'}}</td>
                    </tr>
                    <tr>
                        <td>应收运价类型：{{sizeData.hpoInfo.isinwageallin=='-1'?'':sizeData.hpoInfo.isinwageallin}}</td>
                        <td>应收运价单价：{{sizeData.hpoInfo.inwagecostprice=='666666'?'0.00':Number(sizeData.hpoInfo.inwagecostprice).toFixed(2)}}</td>
                    </tr>
                    <tr>
                        <td>应付运价类型：{{sizeData.hpoInfo.isoutwageallin=='-1'?'':sizeData.hpoInfo.isoutwageallin}}</td>
                        <td>应付运价单价：{{sizeData.hpoInfo.outwageallinprice=='666666'?'0.00':Number(sizeData.hpoInfo.outwageallinprice).toFixed(2)}}</td>
                    </tr>
                </table>
            </div>

            <!-- 预报尺寸 -->
            <h4><span class="sizeLeft">预报尺寸</span><span class="sizeRight" @click="copyContent('ybcc')">复制内容</span></h4>

            <div class="info">
                <table id="ybcc">
                    <tr v-for="(i,index) in sizeData.ybList">
                        <td v-for="(i2,index2) in i">({{2*index+index2+1}}){{Number(i2.vol_longs_yb)}}*{{Number(i2.vol_widths_yb)}}*{{Number(i2.vol_heights_yb)}}*{{Number(i2.vol_piece_yb)}}={{StringNum(Number((i2.vol_longs_yb*i2.vol_widths_yb*i2.vol_heights_yb))/1000000*Number(i2.vol_piece_yb))}}{{i2.packagetypename_yb}}</td>
                    </tr>

                </table>

            </div>

            <h4><span class="sizeLeft">实际尺寸</span><span class="sizeRight" @click="copyContent('sjcc')">复制内容</span></h4>

            <div class="info">
                <table id="sjcc">
                    <tr v-for="(i,index) in sizeData.sjList">
                        <td v-for="(i2,index2) in i">({{2*index+index2+1}}){{Number(i2.vol_longs)}}*{{Number(i2.vol_widths)}}*{{Number(i2.vol_heights)}}*{{Number(i2.vol_piece)}}={{StringNum(Number((i2.vol_longs*i2.vol_widths*i2.vol_heights))/1000000*Number(i2.vol_piece))}}{{i2.packagetypename}}</td>
                    </tr>

                </table>

            </div>

            <h4><span class="sizeLeft">中英文品名</span><span class="sizeRight" @click="copyContent('zywpm')">复制内容</span></h4>

            <div class="info">
                <table id="zywpm">
                    <tr v-for="(i,index) in sizeData.axpList">
                        <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">({{index+1}}){{i.hawb}}:{{i.chinesepm}},{{i.englishpm}}</td>
                    </tr>

                </table>

            </div>

            <h4><span class="sizeLeft">备注信息</span><span class="sizeRight" @click="copyContent('bzxx')">复制内容</span></h4>

            <div class="info">
                <table id="bzxx" v-if="sizeData.hpoInfo">
                    <tr>
                        <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">{{sizeData.hpoInfo.remark}}</td>
                    </tr>
                </table>
            </div>

            <h4><span class="sizeLeft">航线尺寸备注</span><span class="sizeRight" @click="copyContent('hxccbz')">复制内容</span></h4>

            <div class="info">
                <table id="hxccbz" v-if="sizeData.hpoInfo">
                    <tr>
                        <td style="word-wrap:break-word;word-break:break-all;white-space:pre-wrap;">{{sizeData.hpoInfo.volumeremark}}</td>
                    </tr>
                </table>
            </div>

        </div>

    </el-dialog>

    <!-- 舱位照片 -->
    <el-dialog :visible.sync="dialogImg" class="dialogImgDoc" :close-on-click-modal="false" v-if="dialogImg" width="980px" append-to-body top="0">
        <iframe :src="imgUrlCw" frameborder="0" allowtransparency="true" style="width: 100%; height: 100%; border: 0px none;" v-if="rowData.shipaceguid"></iframe>
    </el-dialog>

</div>
</template>

<script>
import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate,
    getMomentDate
} from '../api/localStorage.js'
import jiedian from './orderDetails/jiedian'
import {
    systemCheck,openZimessage, searchCmptMixins
} from '@/components/mixins/topPageMixin'

// import airPlaneDeatil from './orderDetails/airPlaneDeatil'//备注
// import addNewCw from './templates/addNewCw'
// import cwSearch from './cwSearch'
// import mawbmanage from './mawbManage'
export default {
    name: 'masterSearch',
    mixins: [systemCheck, openZimessage, searchCmptMixins],
    components: {
        //airPlaneDeatil, cwSearch, addNewCw, mawbmanage
        jiedian
    },
    data() {
        return {
            name: "masterSearch.vue",
            dialogShow3: false,
            jiedianShow: false,
            dialogShow: false,
            searchDataBack: [], //搜索数据备份
            explainInfoArr: [{
                title: '航班号',
                field: 'hbh'
            }, {
                title: '航班日期',
                field: 'hbrq'
            }, {
                title: '预报',
                field: 'ybjzt'
            }, {
                title: '实际',
                field: 'realjzt'
            }, {
                title: '制单',
                field: 'zdjzt'
            }, {
                title: '配载方式',
                field: 'loadingmodel'
            }, {
                title: '分隔符',
                field: 'splitstring'
            }, {
                title: '交接地',
                field: 'terminalname'
            }, {
                title: '舱位性质',
                field: 'shipacexz'
            }, {
                title: '舱位内容',
                field: 'pzcontent'
            }],
            ziTableData: [],
            inputViewData: {
                hbrq: {
                    'title': '航班日期',
                    type: 15,
                    defaultVal: true,
                    format: "yyyy-MM-dd HH:mm"
                },
            },

            inputModelData: {
                //"status": "AO5040,AO5020,AO5060,AO5090,AO5030,AO5050"
            },
            selectTableIndex: '',
            dataGrouping: {},
            open: '1', //展开子表格加号减号
            ziTableIndex: '-1',
            rightM: false,
            position: {
                left: '',
                top: ''
            },
            opentype: '-1',
            rowData: {},
            cwDialog: false, //舱位查询弹框
            shipaceInfo: {
                hbh: {
                    'title': '航班号',
                    type: '1',
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    },
                    verify: 'uppercase'
                },
                hbrq: {
                    'title': '航班日期',
                    type: 15,
                    defaultVal: true,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                czlx: {
                    title: "操作类型",
                    type: 4,
                    options: [],
                    groupid: 132,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                loadingmodel: {
                    title: '配载方式',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                ysfs: {
                    title: '运输方式',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                hwxz: {
                    title: '货物性质',
                    type: 21,
                    groupid: 115,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                shipacexz: {
                    title: '舱位性质',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                splitstring: {
                    title: '分隔符',
                    type: 1,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                yslx: {
                    title: '运输类型',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                terminalname: {
                    title: '交接地',
                    type: '4',
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                weight: {
                    title: '配载重量',
                    type: 1,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                volume: {
                    title: '配载体积',
                    type: 1,
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                jjstatus: {
                    title: '交接状态',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                },
                sdstatus: {
                    title: '锁定状态',
                    type: 4,
                    options: [],
                    itemStyle: {
                        width: "289px",
                        minWidth: '289px'
                    }
                }
            },
            // 舱位查询
            // shipaceInfoData:{},
            // cwtable:[
            //  {'title':'操作',field:'operation'},
            //  {'title':'锁定状态',field:'sdstatus'},
            //  {'title':'配载状态',field:'pzstatus'},
            //  {'title':'交接状态',field:'jjstatus'},
            //  {'title':'航班号',field:'hbh'},
            //  {'title':'航班日期',field:'hbrq'},
            //  {'title':'起飞时间',field:'qfsj'},
            //  {'title':'交接地',field:'terminalname'},
            //  {'title':'操作类型',field:'czlx'},
            //  {'title':'配载方式',field:'loadingmodel'},
            //  {'title':'舱位内容',field:'pzcontent'},
            //  {'title':'分隔符',field:'splitstring'},
            //  {'title':'舱位性质',field:'shipacexz'},
            //  {'title':'运输方式',field:'ysfs'},
            //  {'title':'货物性质',field:'hwxz'},
            //  {'title':'运输类型',field:'yslx'},
            //  {'title':'舱位重量',field:'weight'},
            //  {'title':'舱位体积',field:'volume'},
            //  {'title':'备注',field:'remark'},
            //  {'title':'创建人',field:'addman'},
            //  {'title':'创建日期',field:'addate'},
            //  {'title':'修改人',field:'modifyman'},
            //  {'title':'修改日期',field:'modifydate'}
            // ],
            // cwdata:[],

            //配舱操作
            selectArea: '', //配舱的区域
            inPcDialog: false, //配舱弹框
            inPcTable: [{
                'title': '操作',
                field: 'operation'
            }, {
                title: '航班号',
                field: 'hbh'
            }, {
                title: '航班日期',
                field: 'hbrq'
            }, {
                title: '起飞时间',
                field: 'qfsj'
            }, {
                title: '交接地',
                field: 'terminalname'
            }, {
                title: '配载方式',
                field: 'loadingmodel'
            }, {
                title: '仓位内容',
                field: 'pzcontent'
            }, {
                title: '分隔符',
                field: 'splitstring'
            }, {
                title: '仓位性质',
                field: 'shipacexz'
            }, {
                title: '运输方式',
                field: 'ysfs'
            }, {
                title: '货物性质',
                field: 'hwxz'
            }, {
                title: '舱位重量',
                field: 'weight'
            }, {
                title: '舱位体积',
                field: 'volume'
            }, ], //配舱表格
            inPcData: [], //配舱数据
            inPcId: '', //配舱操作单选选择Id  push到mawbList每一个List中
            mawbList: [], //配舱接收保存数据
            pcType: "", //配舱类型(批量或者单独类型)
            pcTitle: {
                'hbrq': '',
                hbh: '',
                pono: '',
                num: ''
            }, //配舱类型对应显示Title

            // 新增舱位配舱、舱位信息修改
            newCW: false,
            shipaceData: {}, //传数据
            operationType: '',

            //上榜信息修改弹框
            modInfoDialog: false,
            infoData: {}, //上榜信息数据
            infoViewModel: {
                wtkhname: {
                    title: '委托客户：',
                    type: 18,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                wtxmname: {
                    title: '项目：',
                    type: 18,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                ybpiece: {
                    title: '预报件数：',
                    type: 1,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                ybweight: {
                    title: '预报重量：',
                    type: 1,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                ybvolume: {
                    title: '预报体积：',
                    type: 1,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                hbh: {
                    title: '航班号：',
                    type: 1,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    },
                    verify: 'uppercase'
                },
                splitstring: {
                    title: '分隔符：',
                    type: 1,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                },
                hbrq: {
                    title: '航班日期：',
                    type: 6,
                    format: "yyyy-MM-dd",
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                }
            },
            // 虚拟拉货操作
            xnlhDialog: false, //虚拟拉货弹框
            xnlhData: {
                truckreason: '',
                reasontype: '虚拟拉货',
                truckman: localStorage.usrname,
                truckmawb: '',
                truckremark: '',
                truckdate: '',
                modifyman: '',
                'modifydate': ''
            },
            xnlhViewModel: {
                truckreason: {
                    title: '拉货原因：',
                    type: 4,
                    groupid: 43
                },
                truckremark: {
                    title: '拉货内容：',
                    type: 17,
                    itemStyle: {
                        width: "500px",
                        minWidth: '500px'
                    }
                }
            },
            xnlhTable: [{
                field: 'operate',
                title: '操作'
            }, {
                field: 'truckreason',
                title: '拉货原因'
            }, {
                field: 'truckremark',
                title: '拉货内容'
            }, {
                field: 'truckman',
                title: '创建人'
            }, {
                field: 'truckdate',
                title: '创建日期'
            }, {
                field: 'modifyman',
                title: '修改人'
            }, {
                field: 'modifydate',
                title: '修改日期'
            }, ],
            xnlhTableData: [],
            xnlhModIndex: '-1', //修改拉货信息
            //总运单管理
            mawbManageDialog: false, //总运单管理弹框
            //舱位内容左键弹框
            cwContentDialog: false, //舱位内容左键
            //总运单配置
            dialogMawbConfig: false, //配置总运单弹框
            mawbConfigtableData: [], //配置总运单数据
            dialogMawb: '', //配置总运单号
            objGysss: {}, //总运单单条数据
            mawbDialog: false, //总运单维护弹框
            mawbConfigHead: [ //配置总单表头数据
                {
                    title: "总运单号",
                    field: "mawb"
                }, {
                    title: "供应商",
                    field: "gysname"
                }, {
                    title: "操作类型",
                    field: "czlx"
                }, {
                    title: "始发港",
                    field: "sfg"
                }, {
                    title: "总运单所属",
                    field: "mawbss"
                }, {
                    title: "总运单类型",
                    field: "mawblx"
                }, {
                    title: "总运单形式",
                    field: "mawbxs"
                }, {
                    title: "总运单性质",
                    field: "mawbxz"
                },
                // { title: "运输分类", field: "ysfl" },
                {
                    title: "运输条件",
                    field: "ystj"
                }, {
                    title: "备注",
                    field: "remark"
                }
            ],
            mawbConfigConfim: false, //解除总运单弹框
            mawbTab: '', //总运单切换Tab  1、正常运单  2、外借运单   3、预定运单
            mawbBorrowHead: [ //配置总运单借出表头
                {
                    field: 'mawb',
                    title: '总运单号'
                }, {
                    title: "供应商",
                    field: "gysname"
                }, {
                    title: '借出对象',
                    field: 'jykhname'
                }, {
                    title: '借出人',
                    field: 'jyr'
                }, {
                    title: '借出日期',
                    field: 'jydate'
                }, {
                    title: "总运单所属",
                    field: "mawbss"
                }, {
                    title: "总运单类型",
                    field: "mawblx"
                }, {
                    title: "总运单形式",
                    field: "mawbxs"
                }, {
                    title: "总运单性质",
                    field: "mawbxz"
                },
                // { title: "运输分类", field: "ysfl" },
                {
                    title: "运输条件",
                    field: "ysfl"
                }, {
                    title: "操作类型",
                    field: "czlx"
                }, {
                    title: '备注',
                    field: 'remark'
                },
            ],
            mawbBorrowData: [], //配置总运单借出表头数据
            mawbPreHead: [ //配置总运单预定表头
                {
                    field: 'mawb',
                    title: '总运单号'
                }, {
                    title: "供应商",
                    field: "gysname"
                }, {
                    title: '预定客户',
                    field: 'bookingkhname'
                }, {
                    title: '预定人',
                    field: 'bookinger'
                }, {
                    title: '预定日期',
                    field: 'bookingdate'
                }, {
                    title: "总运单所属",
                    field: "mawbss"
                }, {
                    title: "总运单类型",
                    field: "mawblx"
                }, {
                    title: "总运单形式",
                    field: "mawbxs"
                }, {
                    title: "总运单性质",
                    field: "mawbxz"
                },
                // { title: "运输分类", field: "ysfl" },
                {
                    title: "运输条件",
                    field: "ysfl"
                }, {
                    title: "操作类型",
                    field: "czlx"
                }, {
                    title: '备注',
                    field: 'remark'
                },
            ],
            mawbPreData: [], //配置总运单预定表头数据
            mawbSaveBorrow: false, //保存并外借弹框
            mawbRemark: '', //借出备注
            mawbBorrowDate: '', //借出日期
            sizeData: {}, //单证状态左键点击数据
            sizeDialog: false, //尺寸弹框显示隐藏
            gysModifyShow: false, //外场供应商修改弹框
            gySid: '', //修改供应商Id
            gysList: [], //查询可修改供应商
            gysguid: [], //修改供应商 选择的订单guid
            gysModifyType: "", //修改供应商批量还是单条
            dialogImg: false, //舱位照片弹框
            imgUrlCw: '',
            displayIndex: -1, //点击照片节点的索引
            imgUrl: '',
            imgShow: false
        }
    },

    methods: {
        showImgFunc(index) {
            this.imgShow = true;
            let data = this.tableDataRes[index]
            let mawbtype = data.orderdom == '直单' ? 1 : 2
            let usrname = localStorage.usrname
            this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceguid}&area=${this.area}`;
        },
        openZiTable(index, data) {
            //this.open=this.open=='1'?'2':'1'
            if (this.ziTableIndex == index) {
                this.$refs.tableComponet.ziTableIndex = -1
                this.ziTableIndex = -1
                //this.open='2'
            } else {
                this.$refs.tableComponet.ziTableIndex = index
                this.ziTableIndex = index
                //this.open='1'
            }
            this.ziTableData = data
        },
        //检测数组中元素是否都一致
        isAllEqual(array, field) {
            if (array.length > 0) {
                return !array.some(function (value, index) {
                    return value[field] !== array[0][field];
                });
            } else {
                return true;
            }
        },
        //右键事件
        rightF(data) {
            this.rightM = true
            this.position.left = data.left + 'px'
            this.position.top = data.top - 50 + 'px'
            this.opentype = data.type
            this.rowData = data.rowData
            //console.log(data)
        },
        // leftF(data) {
        //   this.cwContentDialog = true
        //   this.rowData = data
        //   setTimeout(() => {

        //       var range = document.createRange();
        //       var startNode = document.getElementById("copyText");
        //       range.selectNodeContents(startNode);
        //       var selection = window.getSelection();
        //       selection.removeAllRanges();
        //       selection.addRange(range)
        //     }, 500)
        // },
        //舱位照片
        showCwPc() {
            if (this.rowData.pcstatus < 100) {
                return false
            }
            this.dialogImg = true
            this.imgUrlCw = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?cwid=${this.rowData.shipaceguid}&username=${localStorage.usrname}&pagetype=2`
        },
        //航线签单详细
        airDetail() {
            if (!this.rowData.mawb || !this.rowData.hbh || !this.rowData.hbrq) {
                return false
            }
            this.dialogShow3 = true
            this.boguid = this.rowData.boguid
        },

        /*****************************尺寸信息************************************/
        sizeRowData(boguid) {
            this.sizeDialog = true
            let sizeArr = []
            let sizeArr2 = []
            this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineGetBillSize',
                    params: {
                        boguid: boguid
                    },
                    loading: true,
                    tip: false
                })
                .then(results => {
                    this.sizeData = results.data

                    if (this.sizeData.hpoInfo) {
                        if (this.sizeData.hpoInfo.isinwageallin == '1') {
                            this.sizeData.hpoInfo.isinwageallin = '单价ALLIN'
                            this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                        } else if (this.sizeData.hpoInfo.isinwageallin == '2') {
                            this.sizeData.hpoInfo.isinwageallin = 'M级++'
                            this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                        } else if (this.sizeData.hpoInfo.isinwageallin == '3') {
                            this.sizeData.hpoInfo.isinwageallin = '单价++'
                            this.sizeData.hpoInfo.inwagecostprice = this.sizeData.hpoInfo.inwageallinprice
                        } else if (this.sizeData.hpoInfo.isinwageallin == '4') {
                            this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                            //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                        }
                        if (this.sizeData.hpoInfo.isoutwageallin == '1') {
                            this.sizeData.hpoInfo.isoutwageallin = '单价ALLIN'
                        } else if (this.sizeData.hpoInfo.isoutwageallin == '2') {
                            this.sizeData.hpoInfo.isoutwageallin = 'M级++'
                        } else if (this.sizeData.hpoInfo.isoutwageallin == '3') {
                            this.sizeData.hpoInfo.isoutwageallin = '单价++'
                        }
                    }

                    if (this.sizeData.xshpoInfo) {
                        if (this.sizeData.xshpoInfo.isinwageallin == '1') {
                            this.sizeData.xshpoInfo.isinwageallin = '单价ALLIN'
                            this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                        } else if (this.sizeData.xshpoInfo.isinwageallin == '2') {
                            this.sizeData.xshpoInfo.isinwageallin = 'M级++'
                            this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                        } else if (this.sizeData.xshpoInfo.isinwageallin == '3') {
                            this.sizeData.xshpoInfo.isinwageallin = '单价++'
                            this.sizeData.xshpoInfo.inwagecostprice = this.sizeData.xshpoInfo.inwageallinprice
                        } else if (this.sizeData.xshpoInfo.isinwageallin == '4') {
                            this.sizeData.xshpoInfo.isinwageallin = 'Cost++'
                            //this.sizeData.hpoInfo.isinwageallin = 'Cost++'
                        }
                    }

                    let ybList = [];
                    let sjList = [];
                    let ybStoreList = [];
                    let sjStoreList = [];

                    this.sizeData.storeList.forEach(i => {
                        if (sjList.indexOf(i.vol_guid) == '-1' && i.vol_guid != 0) {
                            i.vol_heights = Number(i.vol_heights / 100).toFixed(2)
                            i.vol_longs = Number(i.vol_longs / 100).toFixed(2)
                            i.vol_widths = Number(i.vol_widths / 100).toFixed(2)
                            sjList.push(i.vol_guid)
                            sjStoreList.push(i)
                        }
                    })

                    this.sizeData.storeYbList.forEach(i => {
                        if (ybList.indexOf(i.vol_guid_yb) == '-1' && i.vol_guid_yb != 0) {
                            i.vol_heights_yb = Number(i.vol_heights_yb / 100).toFixed(2)
                            i.vol_longs_yb = Number(i.vol_longs_yb / 100).toFixed(2)
                            i.vol_widths_yb = Number(i.vol_widths_yb / 100).toFixed(2)
                            ybList.push(i.vol_guid_yb)
                            ybStoreList.push(i)
                        }
                    })
                    //this.sizeData.ybList=ybStoreList
                    //this.sizeData.sjList=sjStoreList

                    //console.log(ybStoreList)
                    //console.log(sjStoreList)
                    for (var i = 0; i < ybStoreList.length; i += 2) {
                        sizeArr.push(ybStoreList.slice(i, i + 2));
                    }

                    for (var i = 0; i < sjStoreList.length; i += 2) {
                        sizeArr2.push(sjStoreList.slice(i, i + 2));
                    }

                    this.sizeData.sjList = sizeArr2
                    this.sizeData.ybList = sizeArr

                    console.log(this.sizeData)

                })
                .catch(error => {

                })

        },

        copyContent(element) {
            var range = document.createRange();
            var startNode = document.getElementById(element);
            range.selectNode(startNode);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range)
        },
        /*****************************配舱方法************************************/

        //配舱、返舱(type 1集合配舱、返舱  2单票配舱、返舱  3黄条配舱、返舱  out是否为返舱)
        inPc(type, out) {
            this.mawbList = []
            let hbh = ""
            let hbrq = ""
            let czlx = []
            this.pcType = type

            if (type == '1') {
                let checkArr = []
                this.tableDataRes.forEach(i => {

                    if (i.checked) {
                        checkArr.push(i)
                        if (!out) {
                            if (czlx.indexOf(i.czlx) == '-1') {
                                czlx.push(i.czlx)
                            }
                            this.mawbList.push({
                                mawb: i.mawb,
                                guid: i.guid,
                                hwxz: i.hwxz,
                                mdg: i.mdg
                            })
                        } else {
                            this.mawbList.push({
                                mawb: i.mawb,
                                guid: i.guid,
                                hwxz: i.hwxz,
                                mdg: i.mdg,
                                shipaceid: i.shipaceguid
                            })
                        }

                    }
                })

                if (!checkArr.length) {
                    this.$message.info('请选择订单');
                    return
                }

                let pcstatus = checkArr.map(i => {
                    return i.pcstatus
                })
                let mawbList = checkArr.map(i => {
                    return i.mawb
                })

                if (!out) {

                    if (mawbList.indexOf('') != '-1') {
                        this.$message.info('无总运单号无法配舱')
                        this.mawbList = []
                        hbh = ""
                        hbrq = ""
                        return
                    }

                    if (!this.isAllEqual(checkArr, 'hbh')) {
                        this.$message.info('航班号不同,无法批量配舱')
                        this.mawbList = []
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (!this.isAllEqual(checkArr, 'hbrq')) {
                        this.$message.info('航班日期不同,无法批量配舱')
                        hbh = ""
                        hbrq = ""
                        this.mawbList = []
                        return
                    } else if (!this.isAllEqual(checkArr, 'area')) {
                        this.$message.info('站点不同,无法批量配舱')
                        this.mawbList = []
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (pcstatus.some(i => {
                            return i != '未配舱'
                        })) {
                        this.$message.info('非未配舱状态无法配舱')
                        this.mawbList = []
                        hbh = ""
                        hbrq = ""
                        return
                    } else {
                        hbrq = checkArr[0].hbrq
                        hbh = checkArr[0].hbh
                        this.selectArea = checkArr[0].area
                        this.pcTitle = {
                            num: checkArr.length,
                            hbrq: checkArr[0].hbrq,
                            hbh: checkArr[0].hbh
                        }
                    }
                } else {
                    if (!this.isAllEqual(checkArr, 'area')) {
                        this.$message.info('站点不同,无法批量返舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (pcstatus.some(i => {
                            return i != '已配舱' && i != '外场拉货'
                        })) {
                        this.$message.info('此状态,无法批量返舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    } else {
                        hbrq = checkArr[0].hbrq
                        hbh = checkArr[0].hbh
                        this.selectArea = checkArr[0].area

                    }

                }

            } else if (type == '2') {
                hbh = this.rowData.hbh
                hbrq = this.rowData.hbrq
                this.selectArea = this.rowData.area
                this.mawbList.push({
                    mawb: this.rowData.mawb,
                    guid: this.rowData.guid,
                    mdg: this.rowData.mdg,
                    shipaceid: this.rowData.shipaceguid,
                    hwxz: this.rowData.hwxz
                })
                if (!out) {
                    if (!hbh) {
                        //this.$message.info('无航班号,无法配舱')
                        this.mawbList = []
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (!hbrq) {
                        //this.$message.info('无航班日期,无法配舱')
                        hbh = ""
                        hbrq = ""
                        this.mawbList = []
                        return
                    } else if (!this.rowData.mawb) {
                        //this.$message.info('无总运单号无法配舱')
                        hbh = ""
                        hbrq = ""
                        this.mawbList = []
                        return
                    } else if (this.rowData.pcstatus != '未配舱') {
                        //this.$message.info('非未配舱状态无法配舱')
                        hbh = ""
                        hbrq = ""
                        this.mawbList = []
                        return
                    }
                } else {
                    if (this.rowData.pcstatus != '已配舱' && this.rowData.pcstatus != '外场拉货') {
                        //this.$message.info('此状态无法返舱')
                        hbh = ""
                        hbrq = ""
                        this.mawbList = []
                        return
                    }
                }

            } else if (type == '3') {
                //console.log(this.rowData)
                hbh = this.rowData.hbh
                hbrq = this.rowData.hbrq
                czlx = this.rowData.czlxList
                // console.log(czlx.length)
                this.selectArea = this.rowData.area
                this.mawbList = this.rowData.mawbList
                this.pcTitle = {
                    num: this.rowData.num,
                    hbrq: this.rowData.hbrq,
                    hbh: this.rowData.hbh
                }
                if (!out) {
                    let mawbList = this.mawbList.map(i => {
                        return i.mawb
                    })
                    //  console.log(mawbList)
                    if (mawbList.indexOf('') != '-1' || !mawbList.length) {
                        //this.$message.info('无总运单号无法配舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    }

                    if (!hbh) {
                        //this.$message.info('无航班号,无法配舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (!hbrq) {
                        //this.$message.info('无航班日期,无法配舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    } else if (this.rowData.pcstatus > 1) {
                        //this.$message.info('非未配舱状态,无法配舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    }
                } else {
                    if (this.rowData.pcstatus != '100') {
                        //this.$message.info('非已配舱状态,无法返舱')
                        this.mawbList = []
                        this.selectArea = ""
                        hbh = ""
                        hbrq = ""
                        return
                    } else {
                        this.mawbList.forEach(i => {
                            i.shipaceid = this.rowData.shipaceguid
                        })
                    }
                }
            }

            if (!out) {

                if (hbh && hbrq) {
                    this.inPcDialog = true

                    this.$axios({
                            method: 'get',
                            url: this.$store.state.webApi + 'api/ExHpoAxplineShipace',
                            params: {
                                hbh: hbh,
                                hbrq: hbrq,
                                area: this.selectArea,
                                czlx: czlx.length >= 2 || !czlx.length ? '全部' : czlx.join(',')
                            },
                            loading: true,
                            tip: false
                        })
                        .then(results => {
                            this.inPcData = results.data
                            this.inPcData.forEach(i => {
                                i.hbrq = i.hbrq.substring(0, 11)
                                i.qfsj = i.qfsj.substring(11, 16)
                            })
                        })
                        .catch(error => {})
                } else {
                    //this.$message.info('无航班号或航班日期无法配舱')
                    return
                }
            } else {
                this.$confirm('是否确认返舱操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {

                    this.$axios({
                            method: 'put',
                            url: this.$store.state.webApi + 'api/ExHpoAxplineShipaceBatch',
                            data: {
                                isdel: '2',
                                ShipaceList: this.mawbList
                            },
                            loading: true,
                            tip: false
                        })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                if (this.pcType != '3') {
                                    this.search()
                                } else {
                                    this.rowData.pcstatus = '1'
                                    for (var i = this.rowData.listLength - this.rowData.len; i < this.rowData.listLength; i++) {
                                        this.tableDataRes[i].pcstatus = '未配舱'
                                    }
                                }
                                this.$message.success(results.data.resultmessage)
                                //this.search()
                            } else {
                                this.$message.error(results.data.resultmessage)
                            }
                        })
                        .catch(error => {

                        })
                }).catch(() => {
                    this.$message.info('已取消操作')
                })

            }

        },

        //配舱保存 返舱(type 1配舱  2返舱)
        savePc(type) {

            this.mawbList.forEach(i => {
                i.shipaceid = this.inPcId
            })

            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineShipaceBatch',
                    data: {
                        isdel: type,
                        ShipaceList: this.mawbList
                    },
                    loading: true,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        if (this.pcType != '3') {
                            this.search()
                        } else {
                            this.rowData.pcstatus = '100'
                            for (var i = this.rowData.listLength - this.rowData.len; i < this.rowData.listLength; i++) {
                                this.tableDataRes[i].pcstatus = '已配舱'
                            }
                        }
                        this.inPcDialog = false

                        // var mateIndex=""
                        // this.searchDataBack.forEach((i,index)=>{
                        //  if(i.shipaceguid==this.inPcId){
                        //           mateIndex=index
                        //  }
                        // })
                        // if(mateIndex){//匹配到舱位Id

                        // }else{//未匹配到舱位Id

                        // }
                        //this.$message.success(results.data.resultmessage)
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })
        },
        //新增舱位并配舱
        addShipPc(type) { //type 2舱位信息修改  3新增舱位并配舱
            if (type == '2' && this.rowData.pcstatus != '100') {

                //this.$message.info('非已配舱无法修改舱位信息')

                return
            } else if (type == '3' && this.getStatusNum('配舱状态', this.rowData.pcstatus) != '1') {

                // this.$message.info('已状态无法配舱')

                return
            } else if (!this.rowData.hbh || !this.rowData.hbrq || !this.rowData.mawb) {
                //this.$message.info('无航班日期或者航班号、总运单号无法配舱')
                return
            } else {
                this.newCW = true
                this.shipaceData = this.rowData
                this.operationType = type
            }
        },
        upDateRow(data) {
            Object.keys(data).forEach(key => {
                this.rowData[key] = data[key]
                for (var i = this.rowData.listLength - this.rowData.len; i < this.rowData.listLength; i++) {
                    this.tableDataRes[i][key] = data[key]
                }
            })
            //console.log(data)
        },
        // 已交接返舱
        jjBack(data) {

            if (this.getStatusNum('配舱状态', data.pcstatus) != '400' || this.getStatusNum('单证状态', data.dzstatus) == '800') {
                return false
            }
            this.$confirm('是否确认返舱操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                })
                .then(() => {
                    this.$axios({
                            method: 'put',
                            url: this.$store.state.webApi + 'api/CancelshipaceAfterYjj',
                            data: {
                                hpoguid: this.rowData.guid,
                                shipaceid: this.rowData.shipaceguid,
                                boguid: this.rowData.boguid
                            },
                            tip: false
                        })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                this.$message.success(results.data.resultmessage)
                                this.search()
                            } else {
                                this.$message.error(results.data.resultmessage)
                            }
                        })
                })
                .catch(() => {
                    this.$message.info('已取消操作')
                })
        },
        //总调返舱
        zdBack(data) {
            var mawbList = []
            var hbh = data.hbh
            var hbrq = data.hbrq
            //this.selectArea = data.area
            mawbList.push({
                mawb: data.mawb,
                guid: data.guid,
                mdg: data.mdg,
                shipaceid: data.shipaceguid,
                hwxz: data.hwxz
            })
            if (this.rowData.pcstatus != '总调锁定') {
                hbh = ""
                hbrq = ""
                mawbList = []
                return
            }

            this.$confirm('是否确认返舱操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {

                this.$axios({
                        method: 'put',
                        url: this.$store.state.webApi + 'api/ExHpoAxplineShipaceBatch',
                        data: {
                            isdel: '2',
                            ShipaceList: mawbList
                        },
                        loading: true,
                        tip: false
                    })
                    .then(results => {
                        if (results.data.resultstatus == 0) {
                            this.search()
                            this.$message.success(results.data.resultmessage)
                            //this.search()
                        } else {
                            this.$message.error(results.data.resultmessage)
                        }
                    })
                    .catch(error => {

                    })
            }).catch(() => {
                this.$message.info('已取消操作')
            })

        },

        /*****************外场供应商修改****************/
        gysModify(type) { //2单票，1多票
            let list = []
            this.gysList = []
            this.gysModifyType = type
            if (type == '1') {
                console.log(this.dataGrouping)
                Object.keys(this.dataGrouping).forEach(i => {
                    if (this.dataGrouping[i].checked) {
                        list.push(this.dataGrouping[i])
                    }
                })
                // if (list.some(i => {
                //         return i.pcstatus >= '400' || i.pcstatus < '100'
                //     })) {
                //     this.$message.error('此状态无法进行修改')
                //     return
                // }
                this.gysModifyShow = true
            } else if (type == '2') {

                // if (this.getStatusNum('配舱状态', this.rowData.pcstatus) >= '400' || this.getStatusNum('配舱状态', this.rowData.pcstatus) < '100') {
                //     this.$message.error('此状态无法进行修改')
                //     return
                // }
                list.push(this.rowData)
                this.gysModifyShow = true
            }
            if (list.length > 0) {
                this.$axios({
                        method: 'get',
                        url: this.$store.state.webApi + 'api/ExHpoAxplineGetboardgys',
                        params: {
                            shipaceid: list.map(i => {
                                return i.shipaceguid
                            }).join(',')
                        },
                        tip: false
                    })
                    .then(results => {
                        this.gysList = results.data
                        if (results.data.length > 0) {

                            //console.log(this.gysList[0].gid)
                            this.gySid = results.data[0].gid
                        }
                        this.gysguid = list.map(i => {
                            return i.guid
                        })
                    })
                    .catch(error => {

                    })
            }
        },
        // 修改保存
        saveGys() {
            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineUpdateBoardgys',
                    data: {
                        boardgys: this.gySid,
                        operguid: this.gysguid.join(',')
                    },
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage)
                        if (this.gysModifyType == '1') {
                            Object.keys(this.dataGrouping).forEach(i => {
                                if (this.dataGrouping[i].checked) {
                                    for (var j = this.dataGrouping[i].listLength - this.dataGrouping[i].len; j < this.dataGrouping[i].listLength; j++) {
                                        this.tableDataRes[j].boardgysname = this.gysList.filter(k => {
                                            return k.gid == this.gySid
                                        })[0]['gidname']
                                    }
                                }
                            })
                        } else {

                            this.$set(this.rowData, 'boardgysname', this.gysList.filter(k => {
                                return k.gid == this.gySid
                            })[0]['gidname'])

                            console.log(this.rowData)
                            //console.log(this.gysList.filter(k=>{return k.gid==this.gySid})[0]['gidname'])
                        }
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })
        },

        /*****************总调锁定方法****************/
        allLock(type) { //type 1 总调锁定  2总调解锁
            var shipguid = []

            if (type == '1') {
                var pcList = []
                Object.keys(this.dataGrouping).forEach(i => {
                    if (this.dataGrouping[i].checked) {
                        pcList.push(this.dataGrouping[i].pcstatus)
                        shipguid.push(this.dataGrouping[i].shipaceguid)
                    }
                })
                if (pcList.some(i => {
                        return i != '100'
                    })) {
                    this.$message.error('非已配舱状态无法总调锁定')
                    return
                }
                //return
            }

            if (type == '2') {
                var pcList = []
                Object.keys(this.dataGrouping).forEach(i => {
                    if (this.dataGrouping[i].checked) {
                        pcList.push(this.dataGrouping[i].pcstatus)
                        shipguid.push(this.dataGrouping[i].shipaceguid)
                    }
                })
                if (pcList.some(i => {
                        return i != '200'
                    })) {
                    this.$message.error('非总调锁定状态无法解锁')
                    return
                }

            }
            var url = type == '1' ? 'api/ExHpoAxplineZdLock' : 'api/ExHpoAxplineZdUnLock'
            // var guidList = this.rowData.mawbList.map(i => {
            //   return i.guid
            // })
            var data = {
                shipaceid: shipguid.join(',')
                //operguid: guidList.join(',')
            }
            //console.log(data)
            //console.log(this.rowData)
            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + url,
                    data: data,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage)
                        if (type == '1') {
                            Object.keys(this.dataGrouping).forEach(i => {
                                if (this.dataGrouping[i].checked) {
                                    this.dataGrouping[i].pcstatus = '200'
                                    for (var j = this.dataGrouping[i].listLength - this.dataGrouping[i].len; j < this.dataGrouping[i].listLength; j++) {
                                        this.tableDataRes[j].pcstatus = '总调锁定'
                                    }
                                }
                            })
                        } else {
                            Object.keys(this.dataGrouping).forEach(i => {
                                if (this.dataGrouping[i].checked) {
                                    this.dataGrouping[i].pcstatus = '100'
                                    for (var j = this.dataGrouping[i].listLength - this.dataGrouping[i].len; j < this.dataGrouping[i].listLength; j++) {
                                        this.tableDataRes[j].pcstatus = '已配舱'
                                    }
                                }
                            })
                        }

                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })

        },
        /*****************上榜信息方法****************/
        //起飞时间获取
        getQfsj() {
            if (!this.$store.state.areaState ||
                this.$store.state.areaState.split(",").length != 1
            ) {
                this.$message.error("请先选择区域！");
                return;
            }

            var sfg = this.infoData.sfg;
            var hbh = this.infoData.hbh;
            var hbrq = this.infoData.hbrq;
            if (hbh && hbh.length < 2) {
                return;
            }
            var json = {
                area: this.$store.state.areaState,
                sfg: sfg,
                hbh: hbh,
                hbrq: hbrq,
                jid: ""
            };
            if (sfg && hbh && hbrq) {
                this.$axios({
                    method: "get",
                    url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
                    params: json,
                    loading: false,
                    tip: false
                }).then(results => {

                    var qfsj = results.data.resultdic && results.data.resultdic.flytime;
                    this.qfsjsid = results.data.resultdic && results.data.resultdic.sid;

                    if (qfsj && (qfsj.indexOf("1900") == -1 && qfsj.indexOf("0001") == -1)) {
                        this.$set(this.infoData, 'qfsj', qfsj)
                        this.$set(this.infoData, 'terminalname', results.data.resultdic.jjdname)

                    } else {
                        this.$set(this.infoData, 'qfsj', '')
                    }

                });
            } else {
                this.$set(this.infoData, 'qfsj', '')

            }
        },
        // 上榜信息修改弹框
        modInfo() {
            this.modInfoDialog = true
            this.infoData = this.rowData
            this.infoData.hbh = this.infoData.hbh.toUpperCase()
            this.infoViewModel.hbh.disabled = false
            this.infoViewModel.hbrq.disabled = false
            this.infoViewModel.ybpiece.disabled = false
            this.infoViewModel.ybweight.disabled = false
            this.infoViewModel.ybvolume.disabled = false
            if (this.getStatusNum('配舱状态', this.rowData.pcstatus) >= 100) {
                this.infoViewModel.hbh.disabled = true
                this.infoViewModel.hbrq.disabled = true
            }
            if (this.getStatusNum('单证状态', this.rowData.dzstatus) >= 300) {
                this.infoViewModel.ybpiece.disabled = true
                this.infoViewModel.ybweight.disabled = true
                this.infoViewModel.ybvolume.disabled = true
            }

        },
        // 上榜信息修改
        saveInfo() {
            var data = this.infoData
            data.operguid = this.rowData.guid
            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineShipaceUpdateBill',
                    data: data,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage)

                        this.modInfoDialog = false
                        this.rowData = data
                        //this.inputModelData={sfg:'PVG'}
                        //this.search()
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })

        },

        /*****************虚拟拉货方法****************/
        // 虚拟拉货查询
        xnlhShow() {
            // console.log(this.rowData.pcstatus)

            if (this.getStatusNum('配舱状态', this.rowData.pcstatus) != '200' && this.getStatusNum('配舱状态', this.rowData.pcstatus) != '400') {
                //this.$message.info('非总调锁定状态无法拉货')
                return false
            }
            this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineSelectTruck',
                    params: {
                        operguid: this.rowData.guid
                    },
                    loading: true,
                    tip: false
                })
                .then(results => {

                    if (results.data) {

                        this.xnlhTableData = JSON.parse(results.data)

                    }
                    this.xnlhDialog = true

                })
                .catch(error => {

                })
        },
        //虚拟拉货保存
        saveXnlh() {
            var url = this.xnlhModIndex == '-1' ? 'api/ExHpoAxplineTruckThing' : 'api/ExHpoAxplineUpdateTruck'
            if (!this.xnlhData.truckreason) {
                this.$message.error('请填写拉货原因')
                return false
            } else if (!this.xnlhData.truckremark) {
                this.$message.error('请填写拉货内容')
                return false
            }
            this.xnlhData.truckdate = getMomentDate().substring(0, 11)
            this.xnlhData.truckmawb = this.rowData.mawb

            var data = []

            if (this.xnlhModIndex == '-1') { //新增
                data.push(this.xnlhData)
            } else { //修改
                this.xnlhTableData.forEach((i, index) => {
                    if (index == this.xnlhModIndex) {
                        data[index] = this.xnlhData
                    } else {
                        data.push(i)
                    }
                })
            }
            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + url,
                    data: {
                        operguid: this.rowData.guid,
                        truckthingreason: JSON.stringify(data)
                    },
                    loading: true,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage)
                        if (this.xnlhModIndex == '-1') {
                            this.xnlhTableData.push(this.xnlhData)
                        } else {
                            this.xnlhTableData[this.xnlhModIndex] = this.xnlhData
                        }

                        this.rowData.pcstatus = '外场拉货'
                        this.xnlhModIndex = '-1'
                        this.xnlhData = {
                            truckreason: '',
                            reasontype: '虚拟拉货',
                            truckman: localStorage.usrname,
                            truckmawb: '',
                            truckremark: '',
                            truckdate: '',
                            modifyman: '',
                            'modifydate': ''
                        }
                        //this.inputModelData={sfg:'PVG'}
                        //this.search()
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })
        },

        //虚拟拉货修改
        modXnlh(index, data) {
            this.xnlhModIndex = index
            this.xnlhData = {
                ...data
            }
            this.xnlhData.modifyman = localStorage.usrname
            this.xnlhData.modifydate = getMomentDate().substring(0, 11)
        },
        //虚拟拉货删除
        delXnlh(index) {
            if (this.xnlhTableData.length == '1') {
                this.$message.info('拉货信息必须存在一条记录')
                return false
            }
            var data = []
            this.xnlhTableData.forEach((i, index2) => {
                if (index != index2) {
                    data.push(i)
                }
            })
            this.$axios({
                    method: 'put',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineUpdateTruck',
                    data: {
                        operguid: this.rowData.guid,
                        truckthingreason: JSON.stringify(data)
                    },
                    loading: true,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.$message.success(results.data.resultmessage)
                        this.xnlhTableData.splice(index, 1)
                        this.xnlhModIndex = '-1'
                        this.xnlhData = {
                            truckreason: '',
                            reasontype: '虚拟拉货',
                            truckman: localStorage.usrname,
                            truckmawb: '',
                            truckremark: '',
                            truckdate: '',
                            modifyman: '',
                            'modifydate': ''
                        }
                        //this.inputModelData={sfg:'PVG'}
                        //this.search()
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })
        },
        //拉货恢复
        lhRestore() {

            if (this.getStatusNum('配舱状态', this.rowData.pcstatus) != '300') {
                //this.$message.info('此状态无法进行拉货恢复操作')
                return false
            }
            this.$confirm('拉货恢复会删除对应虚拟拉货记录,确认拉货恢复吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                })
                .then(() => {
                    this.$axios({
                            method: 'put',
                            url: this.$store.state.webApi + 'api/ExHpoAxplineTruckRever',
                            data: {
                                operguid: this.rowData.guid,
                                shipaceguid: this.rowData.shipaceguid
                            },
                            loading: true,
                            tip: false
                        })
                        .then(results => {
                            if (results.data.resultstatus == 0) {
                                this.rowData.pcstatus = '总调锁定'
                                this.$message.success(results.data.resultmessage)
                            } else {
                                this.$message.error(results.data.resultmessage)
                            }
                        })
                        .catch(error => {

                        })
                })
                .catch(() => {
                    this.$message.info('已取消操作')
                })

            //console.log(this.rowData)

        },
        /*****************配置总运单方法****************/
        // 配置总运单
        installMawb() {
            if (this.getStatusNum('单证状态', this.rowData.dzstatus) >= 300 || this.rowData.mawb) {
                //this.$message.info('此状态无法配置总运单')
                return false
            }
            this.getMawbConfig()

        },
        // 解除总运单
        unstallMawb() {
            if (this.getStatusNum('单证状态', this.rowData.dzstatus) >= 300 || !this.rowData.mawb) {
                //this.$message.info('此状态无法解配总运单')
                return false
            }
            this.mawbConfigConfim = true
        },
        getMawbConfig() { //获取总单配置表格数据
            var hbh = this.rowData.hbh
            var sfg = this.rowData.sfg

            this.dialogMawbConfig = true;
            this.dialogMawb = this.rowData.mawb;
            this.objGysss = this.rowData
            var json = {
                area: this.rowData.area,
                hbh: hbh.substr(0, 2) || "",
                czlx: this.rowData.czlx || "",
                sfg: sfg,
                hwxz: this.rowData.hwxz || "",
                ystj: this.rowData.ystj || ""
            };
            this.$axios({
                method: "get",
                url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                params: json,
                loading: true,
                tip: false
            }).then(results => {
                // //console.log("总单配置")
                // //console.log(results)
                if (results.data) {
                    this.mawbConfigtableData = results.data.filter(i => {
                        return i.type == '1'
                    });
                    this.mawbBorrowData = results.data.filter(i => {
                        return i.type == '2'
                    });
                    this.mawbPreData = results.data.filter(i => {
                        return i.type == '3'
                    });
                    this.getMawbGys()
                }

            });
        },

        mawbConfigFunc(type, status) { //配置总运单 //type 1配置总运单 2解除总运单

            var mawb = "";
            var url = "";

            if (type == 1) {
                url = "api/ExHpoAxplineSureMawb";
                mawb = this.dialogMawb;
            } else {
                url = "api/ExHpoAxplineUnSureMawb";
                mawb = this.rowData.mawb;
            }
            if (!mawb) {
                this.$message.error("请填写总运单号");
                return;
            }
            var json = {
                mawb: mawb,
                gysname: this.objGysss && this.objGysss.gysname,
                mawbss: this.objGysss && this.objGysss.mawbss,
                mawbgid: this.objGysss && this.objGysss.gysid,
                guid: this.rowData.guid,
                area: this.rowData.area,
                hwxz: this.rowData.hwxz,
                xyfp1_in: this.objGysss && this.objGysss.xyfp1_in,
                xyfp2_in: this.objGysss && this.objGysss.xyfp2_in,
                iszddl: this.objGysss && this.objGysss.iszddl,
                zddlcode: this.objGysss && this.objGysss.zddlcode,
            };

            if (type == 1) {
                json.system = this.rowData.system;
                json.boguid = this.rowData.boguid;
                json.czlx = this.rowData.czlx;
                json.mdg = this.rowData.mdg;
            }
            if (type == 2) {
                json.status = status;
            }
            this.$axios({
                method: "put",
                url: this.$store.state.webApi + url,
                data: json,
                loading: false,
                tip: false
            }).then(results => {
                //console.log("配置总运单")
                //console.log(results.data)
                if (results.data.resultstatus == 0) {
                    layer.msg("操作成功");
                    if (type == 1) {
                        this.rowData.mawb = this.dialogMawb;
                        // this.getMawbGys();
                        this.dialogMawbConfig = false;
                    }
                    if (type == 2) {
                        this.rowData.mawb = "";
                        this.rowData.gysname = "";
                        this.rowData.mawbss = "";
                        this.rowData.mawbgid = "";
                        this.mawbConfigConfim = false;
                        this.rowData.self_real_bp_freight_out = 10;
                        this.rowData.cus_real_bp_freight_out = 0;
                        this.rowData.self_real_bp_trans_out = 10;
                        this.rowData.cus_real_bp_trans_out = 0;
                        //this.getMawbCost(3); //解除总运单后删除带出的运费杂费
                    }
                } else {
                    this.$message.error(results.data.resultmessage);
                }
            });
        },
        mawbSaveBrow() { //保存并外借
            var json = {
                boguid: this.rowData.boguid,
                guid: this.rowData.guid,
                area: this.rowData.area,
                gysname: this.objGysss && this.objGysss.gysname,
                mawbss: this.objGysss && this.objGysss.mawbss,
                mawbgid: this.objGysss && this.objGysss.gysid,
                hwxz: this.rowData.hwxz,
                mawb: this.dialogMawb,
                jykhid: this.rowData.gid,
                jyr: this.getAddman(),
                jydate: this.mawbBorrowDate,
                jyremark: this.mawbRemark,
                hwxz: this.rowData.hwxz,
                czlx: this.rowData.czlx,
                mdg: this.rowData.mdg,
                system: this.rowData.system,
                xyfp1_in: this.objGysss && this.objGysss.xyfp1_in,
                xyfp2_in: this.objGysss && this.objGysss.xyfp2_in,
            }
            //  console.log(json)
            this.$axios({
                    method: "put",
                    url: this.$store.state.webApi + "api/ExHpoAxplineSureMawbBorrowOut",
                    data: json,
                    loading: false,
                    tip: false
                })
                .then(results => {
                    if (results.data.resultstatus == 0) {
                        this.rowData.mawb = this.dialogMawb;
                        this.mawbSaveBorrow = false
                        this.dialogMawbConfig = false
                        this.$message.success(results.data.resultmessage)
                        //this.getMawbGys();
                    } else {
                        this.$message.error(results.data.resultmessage)
                    }
                })
                .catch(error => {

                })
        },
        getMawbGys() { //获取总单供应商的数据
            if (!this.dialogMawb) {
                return;
            }
            this.$axios({
                method: "get",
                url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
                params: {
                    mawb: this.dialogMawb,
                    area: this.rowData.area
                },
                loading: false,
                tip: false
            }).then(results => {

                if (results.data.resultstatus == 0) {
                    let res = results.data.resultdic.mawbInfo;
                    this.rowData.gysname = res.gysname;
                    this.rowData.mawbss = res.mawbss;
                    this.rowData.mawbgid = Number(res.gysid);
                    this.objGysss = res;
                    this.rowData.self_real_bp_freight_out = res.xyfp1_in;
                    this.rowData.cus_real_bp_freight_out = res.xyfp2_in;
                    this.rowData.self_real_bp_trans_out = res.xyfp1_in;
                    this.rowData.cus_real_bp_trans_out = res.xyfp2_in;
                    //this.$message.success(results.data.resultmessage)
                } else {
                    this.$message.error(results.data.resultmessage);
                }
            });
        },
        choiseDialogMawb(row) { //选择总单配置弹窗里面总运单，获取当行数据
            this.dialogMawb = row.mawb;
            this.objGysss = row;
            this.getMawbGys()
        },
        getAddman() {
            return localStorage.usrname;
        },

        // 查询 type 2签单申请查询
        search() {
            if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
                return this.$message.error('请输入或选择查询条件！');
            }
            this.tableDataRes = [];
            this.ziTableData = [];
            this.open = '1'
            this.ziTableIndex = -1
            this.$refs.tableComponet.ziTableIndex = -1
            let pageDataBackups = getxmdata('xmdata')
            //console.log(pageDataBackups.filter(i=>{return i.id=='8226'}))
            //console.log(pageDataBackups)
            var jsonArr2 = {
                where: this.searchData,
                order: "adddate desc"
            }
            var json = {
                'json': JSON.stringify(jsonArr2)
            }

            this.$axios({
                    method: 'get',
                    url: this.$store.state.webApi + 'api/ExHpoAxplineSearchZd',
                    params: json,
                    loading: true,
                    tip: false
                }).then(results => {
                    // console.log(results.data)
                    var resultsData = results.data
                    //resultsData=this.dataSort(resultsData,['hbrq','qfsj','hbh'])
                    // resultsData.sort(function(a,b){
                    //    var value1 = a.hbrq,
                    //        value2 = b.hbrq;
                    //     if(value1 === value2){
                    //         if(a.qfsj === b.qfsj){
                    //           return a.hbh - b.hbh;
                    //         }
                    //         return Date.parse(a.qfsj) - Date.parse(b.qfsj);
                    //     }

                    //     return Date.parse(value1) - Date.parse(value2);
                    // })
                    //   console.log(resultsData)
                    //resultsData
                    this.searchDataBack = resultsData
                    if (results.data.length == 0) {
                        this.$message('无查询结果');
                        return;
                    } else {
                        this.pageshow = false
                    }
                    //this.searchData={}
                    let data = []
                    let parentGroupData = {}
                    let listLength = 0
                    //   console.log(resultsData)
                    resultsData.forEach((i, index) => {
                        let ybpiece = 0
                        let ybweight = 0
                        let ybvolume = 0
                        let realpiece = 0
                        let realweight = 0
                        let realvolume = 0
                        let zdpiece = 0
                        let zdweight = 0
                        let zdvolume = 0
                        let mawbList = []
                        let czlxList = []
                        let guidList = []
                        //let mawb=[]
                        if (i.list.length > 0) {
                            listLength = listLength + i.list.length
                            // mawbList.push(i.mawb)
                            i.list.forEach(mawb => {
                                if (mawb.mawb) {
                                    mawbList.push({
                                        mawb: mawb.mawb,
                                        guid: mawb.guid,
                                        hwxz: mawb.hwxz,
                                        mdg: mawb.mdg,
                                    })

                                    //czlxList.push()

                                    //mawb.push(mawb.mawb)
                                }
                                mawb.shipaceguid = i.shipaceguid
                                if (czlxList.indexOf(mawb.czlx == '自货' || mawb.czlx == '唯凯配舱' ? '自货' : '代操作') == '-1') {
                                    czlxList.push(mawb.czlx == '自货' || mawb.czlx == '唯凯配舱' ? '自货' : '代操作')
                                }
                                guidList.push(mawb.guid)
                                ybpiece += Number(mawb.ybpiece)
                                ybweight += Number(mawb.ybweight)
                                ybvolume += Number(mawb.ybvolume)
                                realpiece += Number(mawb.realpiece)
                                realweight += Number(mawb.realweight)
                                realvolume += Number(mawb.realvolume)
                                zdpiece += Number(mawb.zdpiece)
                                zdweight += Number(mawb.zdweight)
                                zdvolume += Number(mawb.zdvolume)

                                pageDataBackups.forEach(data => {
                                    if (mawb.boardgys == data.id) {
                                        this.$set(mawb, 'boardgysname', data.usr_name)
                                    }
                                })
                            })

                            parentGroupData[i.list[0].boguid] = {
                                hbh: i.hbh ? i.hbh : '',
                                hbrq: i.hbrq ? i.hbrq.substring(0, 11) : '',
                                pcstatus: i.list[0].pcstatus,
                                area: i.list[0].area,
                                ybjzt: ybpiece + '/' + Number(ybweight).toFixed(2) + '/' + Number(ybvolume).toFixed(3),
                                realjzt: realpiece + '/' + Number(realweight).toFixed(2) + '/' + Number(realvolume).toFixed(3),
                                zdjzt: zdpiece + '/' + Number(zdweight).toFixed(2) + '/' + Number(zdvolume).toFixed(3),
                                shipaceguid: i.shipaceguid,
                                qfsj: i.qfsj && (i.qfsj.indexOf('1900') == '-1' && i.qfsj.indexOf("0001") == -1) ? i.qfsj.substring(11, 16) : '',
                                loadingmodel: i.loadingmodel ? i.loadingmodel : '', //配载方式
                                splitstring: i.splitstring ? i.splitstring : '', //分隔符
                                terminalname: i.terminalname ? i.terminalname : '', //交接地
                                shipacexz: i.shipacexz ? i.shipacexz : '', //舱位性质
                                pzcontent: i.pzcontent ? i.pzcontent : '', //舱位内容
                                listLength: listLength,
                                len: i.list.length,
                                mawb: mawbList.map(i => {
                                    return i.mawb
                                }).join(','),
                                mawbList: mawbList,
                                czlxList: czlxList,
                                guid: guidList.join(',')

                            }
                            i.list.forEach(i2 => {
                                if (i2.hawblist.length > 0) {
                                    i2.hawblist.forEach(i3 => {
                                        i3.guid = i2.guid
                                        i3.gid = i2.gid
                                        i3.orderdom = i2.orderdom
                                        i3.mawb = i2.mawb
                                        i3.pactlsendstatus = i2.pactlsendstatus
                                        i3.hawbjz = i3.hawbzdpiece + '/' + Number(i3.hawbzdweight).toFixed(2)
                                    })
                                }
                            })
                            data = data.concat(i.list)

                        }
                    })
                    // console.log(data)
                    data = getChangeValue(data, '空出')

                    setTimeout(() => {
                        this.tableDataRes = data
                        this.dataGrouping = parentGroupData
                    }, 0)
                })
                .catch(errors => {

                })

        },
        //综合查询
        openDialog(indexData) {
            this.selectTableIndex = indexData
            this.mawbguid = this.tableDataRes[indexData].guid
            this.boguid = this.tableDataRes[indexData].boguid
            this.orderdom = this.tableDataRes[indexData].orderdom
            this.area = this.tableDataRes[indexData].area
            //console.log(this.mawbguid)
            this.dialogShow = true
        },
        //数据排序
        dataSort(arr, condition) {

            var sort = function (itemA, itemB, condition, index) {
                if (!condition[index]) return 0
                const key = condition[index]
                const isAscending = true

                //  console.log(key)
                if (key == 'hbrq' || key == 'qfsj') {
                    var a = Date.parse(itemA[key])
                    var b = Date.parse(itemB[key])
                } else {
                    var a = itemA[key]
                    var b = itemB[key]
                }

                if (a === b) {
                    return sort(itemA, itemB, condition, index + 1)
                } else {
                    return isAscending ? a - b : b - a
                }
            }
            return arr.sort((a, b) => {
                return sort(a, b, condition, 0)
            })
        },

        closeRight() {
            this.rightM = false
        },
        getStatusNum(string, val) { //根据状态中文名获取数字
            let num = ""
            let statusArr = JSON.parse(localStorage.statusData).filter(i => {
                return i.dom == string
            })
            statusArr.forEach(i => {
                if (i.nodename == val) {
                    num = i.nodeindex
                }
            })
            return num
        },
        StringNum(num) {
            var returnNum = num.toLocaleString();
            returnNum = returnNum.replace(/[,]/g, '');
            return Number(returnNum).toFixed(2)
        },

    },
    watch: {
        rightM(val) {
            if (val) {
                document.body.addEventListener('click', this.closeRight)
            } else {
                document.body.removeEventListener('click', this.closeRight)
            }
        }
    },

    created() {
        this.xnlhData = {
            truckreason: '',
            reasontype: '虚拟拉货',
            truckman: localStorage.usrname,
            truckmawb: '',
            truckremark: '',
            truckdate: '',
            modifyman: '',
            'modifydate': ''
        }

        this.$watch(
            function () {
                return this.infoData.hbrq + this.infoData.hbh + this.infoData.sfg;
            },
            function (val) {
                if (val) {

                    this.getQfsj()

                }
            }, {
                immediate: true
            }
        );
    },
    computed: {

    }

}
</script>

<style lang="less" scoped>
/deep/.el-card__body {
    padding: 10px 0 10px;

    p {
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        text-indent: 0.5em;

        &:hover {
            background: #9cd7ff;
            color: #fff;
        }

        i {
            margin-right: 10px;
            font-size: 14px;
        }
    }

    .disabled {
        &:hover {
            background: #c0c4cc;
            color: #333;
        }
    }
}

.el-tab-pane {
    padding: 0;
}

.tablebox {
    .operation {
        label {
            /deep/.el-radio__label {
                display: none;
            }
        }
    }
}

/deep/.sizeDialogClass {
    h3 {
        color: #0F5A8C;
        font-weight: bolder;
        margin-top: -25px;
    }

    h4 {
        margin-top: 10px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-weight: normal;
        margin-bottom: 15px;

        .sizeLeft {
            float: left;
            display: inline-block;
        }

        .sizeRight {
            float: right;
            display: inline-block;
            background: #E8EEF5;
            border-radius: 20px;
            color: #517DA3;
            padding: 2px;
            padding-left: 10px;
            padding-right: 10px;
            cursor: pointer;
        }
    }

    .info {
        width: 900px;
        min-height: 50px;
        border: 1px solid #E7E7E7;
        border-radius: 3px;
        padding: 12px;
        margin-top: 10px;
        letter-spacing: 0.1em;

        table {
            table-layout: fixed;
            width: 900px;

            td {
                width: 400px;

            }
        }
    }

}
</style>
