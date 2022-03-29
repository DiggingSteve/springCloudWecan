<template>

 <div style="width:100%;height:100%;text-align:left;display:flex;flex-direction:column">
  <!-- {{name}} -->
  <!-- {{wtxmObj}} -->
  <!-- {{dataGrouping}} -->
  <!-- {{isGroup}}  -->
  <!-- {{currentPage}} -->
  <!-- <span style="display:none">{{dataGrouping}}</span> -->
 <!--  {{dataGrouping}} -->
<!--  {{dataGrouping}} -->
<!-- {{dataGrouping}} -->
  <slot name="showTotal">
    <div class="totalInfo" v-if="showTotal.all">
      <div style="width:140px">
        <span class="totalInfo-title">票数</span>
        <span class="totalInfo-content">{{totalInfo.lengthinfo}}票</span>
      </div>
      <div v-if="showTotal.ybjzt">
        <span class="totalInfo-title">预报件(PCS)/重(KG)/体(m³)</span>
        <span class="totalInfo-content">{{totalInfo.ybinfo.ybpiece||0}}/{{Number(totalInfo.ybinfo.ybweight||0).toFixed(2)}}/{{Number(totalInfo.ybinfo.ybvolume||0).toFixed(3)}}</span>
      </div>
      <div v-if="showTotal.sjjzt">
        <span class="totalInfo-title">实际件(PCS)/重(KG)/体(m³)</span>
        <span class="totalInfo-content">{{totalInfo.realinfo.realpiece||0}}/{{Number(totalInfo.realinfo.realweight||0).toFixed(2)}}/{{Number(totalInfo.realinfo.realvolume||0).toFixed(3)}}</span>
      </div>
      <div v-if="showTotal.zdjzt">
        <span class="totalInfo-title">制单件(PCS)/重(KG)/体(m³)</span>
        <span class="totalInfo-content">{{totalInfo.zdinfo.zdpiece||0}}/{{Number(totalInfo.zdinfo.zdweight||0).toFixed(2)}}/{{Number(totalInfo.zdinfo.zdvolume||0).toFixed(3)}}</span>
      </div>
      <div v-if="showTotal.wageprofit">
        <span class="totalInfo-title">总盈利(折合人民币)</span>
        <span class="totalInfo-content">￥{{Number(totalInfo.wageprofit||0).toFixed(2)}}</span>
      </div>
      <div v-if="showTotal.realwageall">
        <span class="totalInfo-title">RMB总金额</span>
        <span class="totalInfo-content">￥{{Number(totalInfo.realwageall||0).toFixed(2)}}</span>
      </div>
      <div v-if="showTotal.billwageall">
        <span class="totalInfo-title">对账总额</span>
        <span class="totalInfo-content">￥{{Number(totalInfo.billwageall||0).toFixed(2)}}</span>
      </div>
      <div v-if="showTotal.wageall">
        <span class="totalInfo-title">凭证金额</span>
        <span class="totalInfo-content">￥{{Number(totalInfo.wageall||0).toFixed(2)}}</span>
      </div>
      <div v-if="showTotal.finishwageall">
        <span class="totalInfo-title">已核销金额</span>
        <span class="totalInfo-content">￥{{Number(totalInfo.finishwageall||0).toFixed(2)}}</span>
      </div>
      <!-- <div v-if="showTotal.finishwageall_checkbill">
               <span class="totalInfo-title">已对账金额</span>
                              <span class="totalInfo-content">￥{{Number(totalInfo.finishwageall_checkbill).toFixed(2)}}</span>
            </div> -->
    </div>
  </slot>
  <div class="resDiv">
    <div style="display:inline-flex;justify-content:space-between;align-items:center;flex:1;padding-right:8px">
      <h2>
        查询结果<small v-if="checkedLength" style="margin-left:12px;color:red">已选择{{checkedLength}}条</small>
      </h2>
      <span style="display:none">{{headShow}}{{headFixedShow}}</span>
      <tableFieldConfig :name="name" v-if="showtablehead" :showZiConfig='showZiConfig'></tableFieldConfig>
    </div>

    <excelOut :tableData="tableDataRes" :title='name' :headData="dataTable" :chinese-where="chineseWhere"></excelOut>

  </div>

  <div id="topDivTable" v-scroll="onScroll" >


    <!--滚动表身-->
    <div id="divTable" v-drag="dragEnd">
      <table  v-infinite-scroll="load" :infinite-scroll-disabled="isPaging" :infinite-scroll-immediate="false">

        <tr class="trRow thfont" >
          <th v-for="(relation,index) in dataTable[0]" :class='[relation.field]' :width="{width:getWidth(relation.field)}"
            :style="{width:relation.width,'min-width':relation.width}" :key="relation.field+index">
            {{setzhHtml(relation.title,relation.field)}}
                <!-- {{$t("message."+relation.field).indexOf('message.')>=0?relation.title:$t("message."+relation.field)}} -->
            </th>
          <th v-for="(relation,index) in dataTable[1]" :class="[relation.field,relation.title.indexOf('(')!=-1?'ifzh':'']"
            :width="{width:getWidth(relation.field)}" :key="relation.field+index">
            <span v-html="setzhHtml(relation.title,relation.field)"></span>
            <span class="sortWrap" v-if="isSort&&!relation.ifsort">
              <i>
                <i class="sort-ascend"></i>
                <i class="sort-descend"></i>
              </i>
           </span>
           </th>
        </tr>

        <template v-for="(row,index) in dataContent">

<!-- 航线表格备注 -->

<!--         <tr v-if="isGroup&&dataGrouping[row.guid]&&Object.keys(dataGrouping).indexOf(row.guid)!='-1'">
        <td :rowspan="dataGrouping[row.guid]['len']+2" :style="{'background':'#fff'}">

          {{dataGrouping[row.guid]['hbh']}}<br>{{dataGrouping[row.guid]['hbrq'].substring(0,10)}}<br>{{dataGrouping[row.guid]['qfsj']}}
        </td>
        </tr> -->

        <tr class="trRow group" v-if="isGroup&&dataGrouping[row.guid]"   :index="index">
              <td :rowspan="dataGrouping[row.guid]['len']+1+(ziTableIndex<dataGrouping[row.guid].listLength&&ziTableIndex>=(dataGrouping[row.guid].listLength-dataGrouping[row.guid].len)?1:0)" :style="{'background':'#fff'}" v-if="showMargeColumn">
          {{dataGrouping[row.guid]['hbh']}}<br>{{dataGrouping[row.guid]['hbrq'].substring(0,10)}}<br>{{dataGrouping[row.guid]['qfsj']}}
        </td>
            <td colspan="100">{{row.guid}}</td>
            </tr>

          <tr class="trRow" @contextmenu.prevent="rightFun($event,'2',row)" draggable="true" :index="index">
            <!--     :style="{'background':name=='costConfirmation.vue'&&row['hwstatus']=='自送外场'?'black!important':''}" -->

            <td v-for="item in dataTable[0]" :style="{width:item.width,'min-width':item.width}" :class='[item.field]' v-if="item.field!='merge'">

              <!-- <template v-if="item.field === 'nestedtable'"> -->
              <template v-if="item.field === expansionSubcolumn">
                <i v-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex==row.index&&(ziTableData&&ziTableData.length>0)"
                  class="el-icon-minus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>
                <i v-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex==row.index&&(ziTableData&&ziTableData.length==0)"
                  class="el-icon-plus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>
                <i v-else-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex!=row.index"
                  class="el-icon-plus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>

              </template>

              <template v-if="item.field === 'checkbox'">
                <slot name="checkbox" :data="{value:'checkbox',index:row.index,row:row}">checkbox</slot>
              </template>

              <template v-else-if="item.field=== 'index'">
                {{row.index+1}}
              </template>
              <template v-else-if="item.field=== 'operation'">

                <!-- 受理退回 -->
                 <template v-for="cell in item.formatter.split('\'')[1].split(',')" v-if="!isGroup">
                  <slot :name="cell" :data="{value:cell,index:row.index,row:row}"></slot>
                </template>


                 <slot name="operation" :data="{value:operation,index:row.index,row:row}" v-else>

                 </slot>

              </template>

              <!-- 费用确认盈利 -->
              <template v-else-if="item.field=== 'wageprofit'">
                <span :style="{'color':row[item.field]&&Number(row[item.field])<0?'#f56c6c':Number(row[item.field])==0?'#333':'#93de6e'}">￥{{Number(row[item.field]).toFixed(2)}}</span>
              </template>

              <!-- 费用确认应付 -->
              <template v-else-if="item.field=== 'confirmstatus_wageout'" style="text-align:left">

                <span :class="row['confirmstatus_out']=='1'?'confirmR':'confirmGr'">

                </span>
                <span>
                  <span :style="{'color':row['confirmstatus_out']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_out']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_out']).toFixed(2)}}
                </span>
              </template>

              <!-- 费用确认应收 -->
              <template v-else-if="item.field=== 'confirmstatus_wagein'" style="text-align:left">

                <span :class="row['confirmstatus_in']=='1'?'confirmR':'confirmGr'">

                </span>
                <span>
                  <span :style="{'color':row['confirmstatus_in']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_in']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_in']).toFixed(2)}}
                </span>
              </template>

              <!-- 取消对账原因 -->
              <template v-else-if="item.field=== 'delbillreason'">

                <i class="el-icon-question" v-if="row['delbillreason']"></i>
                <span v-else>--</span>
              </template>

              <!-- 信控状态 -->
              <template v-else-if="item.field=== 'creditisbackstatus'" style="text-align:left">

                <span :style="{'color':row['confirmstatus_in']=='待通过'?'#f56c6c':'#93de6e'}">
                  {{row['confirmstatus_in']}}
                </span>

              </template>



              <template v-else>
                <slot :name="item.field" :data="{value:row[item.field],index:row.index,row:row}">
                  {{row[item.field]}} </slot>

              </template>
            </td>

            <td v-for="item2 in dataTable[1]" >
              <!-- 状态样式设置 -->
              <template v-if="item2.field.indexOf('status')!=-1&&item2.field!='dzstatus'&&item2.field!='usr_status'&&item2.field!='usr_status_cw'&&item2.field!='creditisbackstatus'&&item2.field!='billstatus_in'&&item2.field!='billstatus_out'&&item2.field!='confirmstatus_wageout'&&item2.field!='confirmstatus_wagein'&&item2.field!='customstatus'">
                <span :style="{color:row[item2.field]&&row[item2.field].indexOf('未')==-1&&row[item2.field]!='--'?'#5bb01d':(row[item2.field]!='--'?'#f56c6c':'#333')}"
                  v-if="row[item2.field]!='客户自报'&&row[item2.field]!='自送外场'">{{row[item2.field]}}</span>
                <span v-else style="color:#333">{{row[item2.field]}}</span>
              </template>

              <template v-else-if="item2.field=='dzstatus'">
                <span :style="{color:row[item2.field]&&row[item2.field].indexOf('未')==-1&&row[item2.field]!='--'?'#5bb01d':(row[item2.field]!='--'?'#f56c6c':'#333')}">
                  <span v-if="row[item2.field]=='航线驳回'" @click="showHxbh(row,1)" style="cursor:pointer">
                    <span style="color:#f56c6c">{{row[item2.field]}}</span>
                    <!-- <i class="el-icon-question" style="color:#333" v-if="name!='businessUquCancel.vue'&&row.routedelreason!=''"></i> -->
                  </span>
                  <span v-else>{{row[item2.field]}}</span>
                </span>

              </template>

              <!-- 费用确认盈利 -->
              <template v-else-if="item2.field=== 'wageprofit'">
                <span :style="{'color':row[item2.field]&&Number(row[item2.field])<0?'#f56c6c':Number(row[item2.field])==0?'#333':'#93de6e'}">￥{{Number(row[item2.field]).toFixed(2)}}</span>
              </template>

                <template v-else-if="item2.field=== 'orderno'">
                <el-popover
                placement="right"
                width="300"
                trigger="click"
                @show="gridDataShow(row[item2.field])">
                <el-table :data="gridData"  max-height="300" >
                  <el-table-column width="150" property="bookingdom" label="报文类型" align="left"></el-table-column>
                  <el-table-column width="100" property="statusshow" label="发送状态" align="left"></el-table-column>
                </el-table>
                  <span  slot="reference" :style="{'color':row[item2.field]&&row[item2.field]!='--'?'#1a7dbf':'#333',cursor:row[item2.field]&&row[item2.field]!='--'?'pointer':''}">{{row[item2.field]}}</span>
              </el-popover>

              </template>

              <template v-else-if="item2.field=== 'confirmstatus_wageout'" style="text-align:left">

                <span :class="row['confirmstatus_out']=='1'?'confirmR':'confirmGr'">

                </span>
                <span>
                  <span :style="{'color':row['confirmstatus_out']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_out']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_out']).toFixed(2)}}
                </span>
              </template>

              <!-- 费用确认应收 -->
              <template v-else-if="item2.field=== 'confirmstatus_wagein'" style="text-align:left">

                <span :class="row['confirmstatus_in']=='1'?'confirmR':'confirmGr'">

                </span>
                <span>
                  <span :style="{'color':row['confirmstatus_in']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_in']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_in']).toFixed(2)}}
                </span>
              </template>

              <template v-else-if="item2.field=='creditisbackstatus'">
                <span style="color:#333">
                  <span v-if="row[item2.field]=='已驳回'" @click="showHxbh(row,2)" style="cursor:pointer">
                    <span style="color:#f56c6c">{{row[item2.field]}}</span>
                    <i class="el-icon-question" style="color:#333"></i>
                  </span>
                  <span v-else>{{row[item2.field]}}</span>
                </span>

              </template>
                        <!--
                          订单驳回原因：
                          经理驳回 examineremark 有不同意
                          航线驳回 routedelreason
                          外站驳回 routedelreason
                          撤单 cancelreason


                        费用驳回原因：
                            费用申请驳回  wagecommitreason 有不同意
                            应收对账驳回 delbillreason
                            海外D/N驳回  overseasaccreason
                            应付对账驳回

                        -->
              <template v-else-if="item2.field=='reason'">
                <span v-if="row.examineremark||row.cancelreason||row.routedelreason||row.delbillreason||row.overseasaccreason||row.wagecommitreason||row.customreason">
                  <i class="el-icon-question"  title="订单驳回原因" @click="cancelVisible=true" v-if="row.examineremark||row.cancelreason||row.routedelreason"></i>
                  <i class="el-icon-question"  title="海关联系单发送失败原因" @click="cancelVisible=true" v-if="row.customreason"></i>
                  <i class="el-icon-dollar"  title="费用驳回原因" @click="cancelVisible=true" v-if="row.delbillreason||row.overseasaccreason||row.wagecommitreason"></i>
               </span>
                <span v-else>--</span>
              </template>

              <!-- 错误内容 -->
              <template v-else-if="item2.field=== 'pactlsendcontent'" style="text-align:left">
              <span v-if="row['pactlsendstatus']=='2'" style="color:red" :title="row['pactlsendcontent']">{{row['pactlsendcontent'].substring(0,12)}}</span>
              <span v-else>--</span>
                <!-- <span :style="{'color':row['confirmstatus_in']=='待通过'?'#f56c6c':'#93de6e'}">
                  {{row['confirmstatus_in']}}
                </span> -->

              </template>
              <!-- 其他设置 -->
              <template v-else>
                   <template v-if="String(row[item2.field]).length>20">
                <slot :name="item2.field" :data="{value:row[item2.field],index:row.index,row:row}">
                  <el-tooltip class="item" effect="dark" :content="String(row[item2.field])" placement="top-start">
                        <span>{{row[item2.field]}}</span>
                 </el-tooltip>
                </slot>
              </template>
              <template v-else>
                  <slot :name="item2.field" :data="{value:row[item2.field],index:row.index,row:row}">
                        {{row[item2.field]}}
                   </slot>
              </template>



              </template>

            </td>

          </tr>


          <tr v-if="ziTableIndex==row.index&&ziTableData.length>0">
            <td colspan="30" :class="'ziTable'+row.index" :height="getHeight('ziTable'+row.index)" >

              <nested-tables v-if='showZiConfig' :style="getLeft" style="position:relative;background:#fffaf2" :head="head"
                :tableData5="ziTableData" :name="name">

                <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="nestedTableMsg(props.data.index)"></i></template>

                <template slot="pono" slot-scope="props">
                  <span @click="hpoType(props.data.index)" v-if="props.data.value" :style="{'color':name=='costConfirmation.vue'?'#1a7dbf':'','cursor':'pointer'}">{{props.data.value}}</span>
                  <span v-else>--</span>
                </template>

               <!--  <template slot="hawbjz" slot-scope="props">
                <span>{{props.data.row.hawbzdpiece}}/{{Number(props.data.row.hawbzdweight).toFixed(2))}}</span>
                </template> -->

                  <template slot="hawb" slot-scope="props">
                    <span @click="transAms(props.data.index,props.data.row)" :style="{'color':name=='amsSendManual.vue'||name=='amsSendDirect.vue'?'#1a7dbf':'','cursor':'pointer'}">{{props.data.value}}</span>
                    </template>

                <!--  <template slot="mawbFixed" slot-scope="props">
              <span>{{props.data.row.hawb}}</span>
            </template> -->

              </nested-tables>

              <div style="position:relative;width:800px;" v-if='!showZiConfig'>
                <table>
                  <template v-for="(zirow,index) in ziTableData">
                    <tr>
                      <td v-for="item in dataTable[1]" :class="[item.field+'Fixed']" style="text-align:center;height:32px;font-size:12px;">
                        <span v-if="zirow[item.field]&&item.field!='hawbjz'">{{zirow[item.field]}}</span>

                        <span v-else>--</span>
                      </td>
                    </tr>
                  </template>
                </table>
              </div>

            </td>

          </tr>
        </template>
      </table>
    </div>

    <!--滚动表身end-->

    <!--表头固定-->
    <div id="headFixed" :style="styleObj" v-if="headFixedShow" v-show="headFixedBlock">
      <table>
        <tr class="trRow thfont" >
          <th v-for="(relation,index) in dataTable[0]" :style="fixedWidth(relation.width)" :class="[relation.field+'Fixed']">
             {{setzhHtml(relation.title,relation.field)}}
          </th>
          <th v-for="(relation,index) in dataTable[1]" :class="[relation.field+'Fixed',relation.title.indexOf('(')!=-1?'ifzh':'']"><span
              v-html="setzhHtml(relation.title,relation.field)"></span><span class="sortWrap" v-if="isSort&&!relation.ifsort"><i><i class="sort-ascend"
                  @click="tableSort(relation.field,1,$event)"></i><i class="sort-descend" @click="tableSort(relation.field,2,$event)"></i></i></span></th>
        </tr>
      </table>
    </div>
    <!--表头固定end-->

    <!--左侧固定列-->
    <div id="leftSideFixed" :style="styleObj2">
      <table>

        <tr class="trRow thfont" :style="styleObj" style="position:absolute;z-index:1002;background:#fff">

          <!-- <th style="width:142px"></th> -->

          <th v-for="(relation,index) in dataTable[0]" :style="fixedWidth(relation.width)" :class="[relation.field+'Fixed']">
            <template v-if="relation.field=='checkbox'">
              <input type="checkbox" v-model="multiSelect">
            </template>
            <template v-else>
             {{setzhHtml(relation.title,relation.field)}}
            </template>
            <span class="sortWrap" v-if="isSort&&!relation.ifsort&&(relation.field=='pono'||relation.field=='jobno')">
              <i><i class="sort-ascend" @click="tableSort(relation.field,1,$event)"></i><i class="sort-descend" @click="tableSort(relation.field,2,$event)"></i></i>
            </span>
          </th>

        </tr>
        <tr class="trRow thfont" >

       <!--  <th style="width:142px"></th> -->

          <th v-for="(relation,index) in dataTable[0]" :class="[relation.field+'Fixed']">
           {{setzhHtml(relation.title,relation.field)}}
            </th>
        </tr>




        <template v-for="(row,index) in dataContent">

<!-- 航线表格备注 -->
<!--
        <tr v-if="isGroup&&dataGrouping[row.guid]&&Object.keys(dataGrouping).indexOf(row.guid)!='-1'">
        <td :rowspan="dataGrouping[row.guid]['len']+2" :style="{'background':'#fff'}">
          {{dataGrouping[row.guid]['hbh']}}<br>{{dataGrouping[row.guid]['hbrq'].substring(0,10)}}<br>{{dataGrouping[row.guid]['qfsj']}}
        </td>
        </tr> -->

          <tr class="trRow group" v-if="isGroup&&dataGrouping[row.guid]" >
           <td :rowspan="dataGrouping[row.guid]['len']+1+(ziTableIndex<dataGrouping[row.guid].listLength&&ziTableIndex>=(dataGrouping[row.guid].listLength-dataGrouping[row.guid].len)?1:0)" :style="{'background':'#fff'}" v-if="showMargeColumn">

          {{dataGrouping[row.guid]['hbh']}}<br>{{dataGrouping[row.guid]['hbrq'].substring(0,10)}}<br>{{dataGrouping[row.guid]['qfsj']}}
        </td>
            <td colspan="100" style="box-sizing: content-box;" @contextmenu.prevent="rightFun($event,'1')">
              <div style="position:absolute;margin-top:-12px;">
                <template v-for="info in explainInfoArr">
                         <span style="margin-right:16px">{{info.title}}：<span style="color:green">{{dataGrouping[row.guid][info.field]}}</span></span>
                </template>
              </div>

            </td>
          </tr>


          <tr class="trRow" @contextmenu.prevent="rightFun($event,'2',row)">
            <!--       :style="{'background':name=='costConfirmation.vue'&&row['hwstatus']=='自送外场'?'black!important':''}" -->
            <!-- <slot name="input"></slot> -->
            <!-- <td v-for="item in dataTable[0]" :class="[item.field+'Fixed']"> -->

            <td v-for="item in dataTable[0]" :style="{width:item.width,'min-width':item.width}" :class="[item.field+'Fixed']" v-if="item.field!='merge'">

              <!-- <template v-if="item.field === 'nestedtable'"> -->
              <template v-if="item.field === expansionSubcolumn">
                <i v-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex==row.index&&(ziTableData&&ziTableData.length>0)"
                  class="el-icon-minus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>
                <i v-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex==row.index&&(ziTableData&&ziTableData.length==0)"
                  class="el-icon-plus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>
                <i v-else-if="nestedTableType==2&&row['orderdom']=='总单'&&row['hawbnum']>0&&ziTableIndex!=row.index"
                  class="el-icon-plus" @click="openNestedTables(row.index)" style='color:#1a7dbf;font-weight:bold'></i>
              </template>


              <!-- <template v-if="item.field === 'mawb'">
               <slot name="mawb" :data="{value:row[item.field],index:row.index,row:row}"></slot>
              </template> -->

              <template v-if="item.field === 'checkbox'">
                <slot name="checkbox" :data="{value:'checkbox',index:row.index,row:row}"><input
                    type="checkbox" name="checkbox" v-model="row.checked" :disabled="row.checkDisabled"></slot>
              </template>

              <template v-else-if="item.field=== 'index'">
                {{row.index+i}}
              </template>
              <template v-else-if="item.field=== 'operation'">
                <!-- 受理退回 -->
                <template v-for="cell in item.formatter.split('\'')[1].split(',')" v-if="!isGroup">
                  <slot :name="cell" :data="{value:cell,index:row.index,row:row}"></slot>
                </template>



                  <slot name="operation" :data="{value:operation,index:row.index,row:row}"  v-else>


                  </slot>


              </template>

              <template v-else-if="item.field==='isreceive'">
              <slot name="isreceive" :data="{value:row[item.field],index:((currentPage-1)*pageSize+index),row:row}"></slot>
              </template>

              <template v-else-if="item.field==='pactlsendstatuscn'">
              <span :style="{'color':row[item.field]=='未发送'||row[item.field]=='发送失败'||row[item.field]=='已二次修改'?'red':'green'}">{{row[item.field]}}</span>
              </template>

              <!-- 费用确认盈利 -->
              <template v-else-if="item.field=== 'wageprofit'">
                <span :style="{'color':row[item.field]&&Number(row[item.field])<0?'#f56c6c':Number(row[item.field])==0?'#333':'#93de6e'}">￥{{Number(row[item.field]).toFixed(2)}}</span>
              </template>

              <template v-else-if="item.field=== 'confirmstatus_wageout'" style="text-align:left">

                <span :class="row['confirmstatus_out']=='1'?'confirmR':'confirmGr'"></span>
                <span>
                  <span :style="{'color':row['confirmstatus_out']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_out']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_out']).toFixed(2)}}
                </span>
              </template>

              <!-- 费用确认应收 -->
              <template v-else-if="item.field=== 'confirmstatus_wagein'" style="text-align:left">

                <span :class="row['confirmstatus_in']=='1'?'confirmR':'confirmGr'">

                </span>
                <span>
                  <span :style="{'color':row['confirmstatus_in']=='1'?'#f56c6c':'#93de6e'}">{{row['confirmstatus_in']=='1'?'未确认':'已确认'}}</span>
                  <span style="color:#c8c8c8;margin-left:5px}">|</span>
                </span>
                <span>
                  ￥{{Number(row['wageall_in']).toFixed(2)}}
                </span>
              </template>

              <!-- 取消对账原因 -->
              <template v-else-if="item.field=== 'delbillreason'">
                <slot name="delbillreason" :data="{value:row['delbillreason'],index:row.index,row:row}"></slot>
              </template>

              <template v-else-if="item.field=='reason'">
                <!-- <span :disabled=""> <i class="el-icon-question" title="原因" @click="cancelVisible=true;cancelIndex=row.index" ></i></span> -->
                <span v-if="row.examineremark||row.cancelreason||row.routedelreason||row.delbillreason||row.overseasaccreason||row.wagecommitreason||row.customreason">
                  <i class="el-icon-question"  v-if="row.examineremark||row.cancelreason||row.routedelreason" title="订单驳回原因" @click="cancelVisible=true;cancelIndex=row.index;canceltype=4"></i>
                  <i class="el-icon-question"  v-if="row.customreason" title="海关联系单发送失败原因" @click="cancelVisible=true;cancelIndex=row.index;canceltype=6"></i>
                  <i class="el-icon-dollar"  v-if="row.delbillreason||row.overseasaccreason||row.wagecommitreason" title="费用驳回原因" @click="cancelVisible=true;cancelIndex=row.index;canceltype=5"></i>
               </span>
                 <span v-else>--</span>
              </template>

              <template v-else>
                <slot :name="item.field" :data="{value:row[item.field],index:row.index,row:row}">
                  {{row[item.field]}} </slot>
              </template>
            </td>
          </tr>

          <tr v-if="ziTableIndex==row.index&&ziTableData.length>0">
            <td colspan="30" :class="'ziTable'+row.index+'Height'" style="position:relative;">
              <nested-tables v-if="nestedTableType!=1&&showZiConfig" :tableData5="ziTableData" :head="ziHeadFixed"
                style="float:right;position:absolute;top:0px;right:0px;background:#fff" :name="name">
                <!-- <template slot="printFile" slot-scope="props"><i class="el-icon-printer" title="打印单证" @click="nestedTableMsg(props.data.index)"></i></template> -->
                <template slot="pono" slot-scope="props">
                  <span @click="hpoType(props.data.index)" v-if="props.data.value" :style="{'color':name=='costConfirmation.vue'?'#1a7dbf':'','cursor':'pointer'}">{{props.data.value}}</span>
                  <span v-else>--</span>
                </template>

                 <template slot="hawb" slot-scope="props" v-if="name=='amsSendManual.vue'||name=='amsSendDirect.vue'||name=='pfreportSearch.vue'">
            <span @click="transAms(props.data.index,props.data.row)"  :style="{'color':name=='amsSendManual.vue'||name=='amsSendDirect.vue'?'#1a7dbf':name=='pfreportSearch.vue'&&(!props.data.row.chinesepm||!props.data.row.englishpm)?'red':name=='pfreportSearch.vue'?'#1a7dbf':'','cursor':'pointer'}" :title="name=='pfreportSearch.vue'&&!props.data.row.chinesepm?'中文品名未补全':name=='pfreportSearch.vue'&&!props.data.row.englishpm?'英文品名未补全':name=='pfreportSearch.vue'&&!props.data.row.chinesepm&&!props.data.row.englishpm?'中英文品名未补全':''">{{props.data.value}}</span>
            </template>



            <template slot="mawbFixed" slot-scope="props" v-if="name=='pfreportSearch.vue'">
               <span @click="transAms(props.data.index,props.data.row)" style="color:#1a7dbf;cursor:pointer;">{{props.data.value}}</span>
            </template>

 <!--             <template slot="hawb" slot-scope="props" v-if="name=='pfreportSearch.vue'">
            <span @click="transAms(props.data.index,props.data.row)"  :style="{'color':!props.data.row.chinesepm||!props.data.row.englishpm?'red':'','cursor':'pointer'}" :title="!props.data.row.chinesepm?'中文品名未补全':!props.data.row.englishpm?'英文品名未补全':'中英文品名未补全'">{{props.data.value}}</span>
            </template> -->



              </nested-tables>

              <div v-if="nestedTableType!=1&&!showZiConfig" style="float:right;position:absolute;top:0px;right:0px;">
                <table>
                  <template v-for="(zirow,index) in ziTableData">
                    <tr :key="zirow.id">
                      <td v-for="item in dataTable[0]" :style="{'min-width':item.width}" :class="[item.field+'Fixed']"
                        style="text-align:center;height:32px;font-size:12px;">
                        <span v-if="zirow[item.field]&&item.field!='hawbjz'">{{zirow[item.field]}}</span>

                        <span v-else>--</span>

                      </td>
                    </tr>
                  </template>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </table>
    </div>
    <!--左侧固定列end-->

  </div>

  <!-- 分页组件 -->
  <div class="block" style="border:1px solid #e8e8e8;padding-top:5px;padding-bottom:5px;border-top:0;background:#f8f8f8" v-if="isPaging">

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[20, 50, 100, 200,300,500,1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="tableDataRes.length">
    </el-pagination>
  </div>

  <el-dialog width="800px" top="4%" center :visible.sync="backOrderVisible" v-if="backOrderVisible" append-to-body
    custom-class="hxbhreason">

    <div>
      <h3>驳回原因</h3>
      <p class="orderNo">
        <span>{{ hxbhData.pono }}</span>
      </p>
      <ul>
        <li>总运单号</li>
        <li>始发港</li>
        <li>目的港</li>
        <li>航班号</li>
        <li>航班日期</li>
      </ul>
      <ul style="margin-top:3px;">
        <li>{{ hxbhData.mawb }}</li>
        <li>{{ hxbhData.sfg }}</li>
        <li>{{ hxbhData.mdg }}</li>
        <li>{{ hxbhData.hbh }}</li>
        <li>{{ hxbhData.hbrq.substring(0,10) }}</li>
      </ul>

      <el-input type="textarea" v-model="hxbhData.creditreason" class="input-required" :autosize="{ minRows:4}" style="margin-top:12px;color:#333!important"
        placeholder="工作号取消原因输入框" :disabled='true' v-if="statusVal=='2'"></el-input>

      <div v-if="statusVal=='1'">
        <div class="accountNameItemsContent" style="margin-top: 12px;">
          <div class="delbillman-wrap">
            <ul class="delbillmanList">
              <li @click="itemsActive=index" :class="{'active': itemsActive == index}" v-for="(item,index) in JSON.parse(hxbhData.routedelreason)"
                :key="index">
                <p>
                  <span class="left">驳回操作人</span>
                  <span class="right">{{item.delbillman}}</span>
                </p>
                <p class="time">
                  <span class="left">{{item.delbilldate.split(' ')[0].replace(/(-)/g, '.')}}</span>
                  <span class="right">{{item.delbilldate.split(' ')[1].substr(0,5)}}</span>
                </p>
                <!-- <i class="el-icon-caret-right"></i> -->
              </li>
            </ul>
          </div>
        </div>
        <el-input type="textarea" :value="JSON.parse(hxbhData.routedelreason)[itemsActive].delbillreason" class="input-required"
          disabled :autosize="{ minRows:4}" style="margin-top:12px;color:rgb(200, 200, 200)" placeholder="请输入取消原因"></el-input>

      </div>

      <p style="margin-top:18px;text-align:right">
        <!-- <el-button type="primary" @click="backOrder">确定</el-button> -->
        <el-button @click="backOrderVisible = false">取消</el-button>
      </p>
    </div>

  </el-dialog>

<!-- 原因 -->
  <el-dialog :visible.sync="cancelVisible" width="900px" top="4%" v-if="cancelVisible" center>
    <cancelReason :jobData="tableDataRes[cancelIndex]" :pagetype="canceltype" :visible.sync="cancelVisible">
    </cancelReason>
  </el-dialog>

</div>
</template>

<script>
import tableFieldConfig from './tableFieldConfig'
import nestedTables from './nestedTables'
import excelOut from './excelOut'




    export default {
      //  props:['tableDataRes',"name"],
       props:{
         tableDataRes:Array, //主表格数据
         name:String, //父组件名称
         nestedTableType:{ //是否有固定列 1默认没有，2有
           type:Number,
           default:1
         },
        showtablehead:{ //是否显示表格头部标题模板 默认显示
           type:Boolean,
           default:true
         },
         ziTableData:Array, //嵌套表格数据
         showZiConfig:{
           type:Boolean,
           default:false
         },
         showTotal:{ //是否显示汇总信息
           type:Object,
           default(){
            var defaultValue={all:true,ybjzt:true,sjjzt:true,zdjzt:true,wageprofit:false,realwageall:false,billwageall:false,wageall:false,finishwageall:false,finishwageall_checkbill:false}
            return defaultValue
         }
        },
        chineseWhere:{
              type:Array,
              default(){
                return []
              }
            },
            isGroup:{//是否分组
              type:Boolean,
              default:false
            },
            dataGrouping:{//分组信息
              type:Object,
              default(){
                return {}
              }
            },
            isSort:{//是否排序
              type:Boolean,
              default:true
            },
            isPaging:{//是否分页
              type:Boolean,
              default:true
            },
            explainInfoArr:{
              type:Array,
              default(){
                return [
                   {title:'航班号',field:'hbh'},
                   {title:'航班日期',field:'hbrq'},
                   {title:'起飞时间',field:'qfsj'},
                ]
              }
            },
            expansionSubcolumn:{
              type:String,
              default:'pono'//展开子列的加号图标放在哪一列上
            },
            showMargeColumn:{//是否显示合并列
              type:Boolean,
              default:false
            },
       },
       components: {
         tableFieldConfig,nestedTables,excelOut
       },
        data () {
            return {
                headFixedShow:true,
                headFixedBlock:true,
                position: {scrollTop: 0, scrollLeft: 0},
                //dataTable:[], //表格模板
                dataContent:[], //表格分页显示的数据
               // tableDataRes:[],  //表格查询结果
                elements : {},
                pageSize:20,//默认每页显示数据
                currentPage:1, //目前页码
                ziTableIndex:-1,
                totalInfo:{
                  lengthinfo:0,
                  ybinfo:{ybpiece:0,ybweight:0,ybvolume:0},
                  realinfo:{realpiece:0,realweight:0,realvolume:0},
                  zdinfo:{zdpiece:0,zdweight:0,zdvolume:0},
                  wageprofit:0,
                  realwageall:0,
                  billwageall:0,
                  wageall:0,
                  finishwageall:0,
                  accountweightin_sett: 0,
                  realwagein: 0,
                  realwageout: 0,
                  realwage_profit: 0
                },
                backOrderVisible:false,
                hxbhData:{},
                statusVal:'',
                itemsActive:0,
                cancelVisible:false,
                canceltype:4,
                cancelIndex:-1,
                checkedLength:"",//已选择的条数
                gridData:[],//订单来源号里面的数据
               // dataGrouping:{}
                  // getLeft:{
                  //           left:'',
                  //           width:''
                  //     } //左侧子表格的定位和宽度

         }
        },
       directives : {
             drag: (el, binding) => {
                let self = this;
                let ev = el; //获取当前元素
                el.ondragstart = ev => {
                  console.log(ev.target)
                  ev.dataTransfer.setData(
                    "Text",
                    JSON.stringify({ innerText: ev.target.innerText })
                  );
                };
                el.ondragover = ev => {
                  ev.preventDefault();
                };
                el.ondrop = ev => {
                  ev.preventDefault();
                  let data = JSON.parse(ev.dataTransfer.getData("Text"));

                  binding.value(ev, data.innerText);
                };
              }

       /*           run (el, binding) {
          if (typeof binding.value == 'function')
            binding.value(el);
         } */
      },
      methods: {
        dragEnd(ev, innerText) {//拖拽事件
              // console.log(ev)
               console.log($(ev.target).parent().attr('class'))
               console.log($(ev.target).parent().attr('index'))

             //  console.log(innerText)
        },
       //右键事件
       rightFun(e,type,rowData){
        //alert('1')
         //console.log(e)
         this.$emit('rightF',{left:e.clientX,top:e.clientY,type:type,rowData:rowData})
       },

        load(){
          //console.log(e)
           let arr=this.dataGroupArr
           if(arr.length>0){
              if((this.currentPage+1)*this.pageSize>=arr.length){
                  this.dataContent=this.tableDataRes.slice(0,arr[arr.length-1].listLength);
                  //layer.msg('已加载全部！');
              }else{
                  this.currentPage+=1
                  this.dataContent=this.tableDataRes.slice(0,this.tableLoadCount())
              }
           }

        },
        tableLoadCount(){
        let arr=this.dataGroupArr
          if(arr.length>0){
                if(this.currentPage*this.pageSize>=arr.length){
                     return arr[arr.length-1].listLength

              }else{
                     return  arr[this.currentPage*this.pageSize-1].listLength
              }

          }else{
             return 0
          }
        },
        gridDataShow(orderno){
          //alert(orderno)
          this.$axios({
                      method: "get",
                      url: this.$store.state.webApi + "api/PoExAxplinePoStatus",
                      loading: false,
                      params: { orderno: orderno },
                      tip: false
                    })
                      .then(results => {
                              this.gridData=results.data
                      })
        },
     tableSort(field,type,event){
       this.ziTableIndex=-1
          // alert(field)
          this.tableDataRes.sort(this.sortBy(field,type));
           var el=event.currentTarget
            setTimeout(() => {
                 $(el).addClass("sort-check")
            }, 0);



     },
     setzhHtml(title,field){



          let index=title.indexOf('(')

        if(index!=-1){
                return title.substr(0,index)+'<br>'+title.substr(index,title.length)
             }else{
               return title
             }

         /*    let msg=this.$t(`message.${field}`)
            let index=msg.indexOf('(')

                   if(index>=0){
                     return msg.substr(0,index)+'<br>'+msg.substr(index,msg.length)
                   }else{
                      if(msg.indexOf('message.')>=0){
                        return title
                      }else{
                        return msg
                      }
                   } */

     },
     showHxbh(data,status){//状态1为航线驳回，状态2为信控驳回

     if(status=='1'&&this.name=='businessUquCancel.vue'){
       return false
     }

       this.backOrderVisible=true
       this.hxbhData=data

       this.statusVal=status
     },
     sortBy:function(name,type){
         return function(o, p){

            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
              a = o[name];
              b = p[name];
              if (a === b) {
                return 0;
              }
              if (typeof a === typeof b) {
                if(type===1){
                    return a < b ? -1 : 1;
                }else{
                   return a > b ? -1 : 1;
                }

              }
              if(type==1){
                  return typeof a < typeof b ? -1 : 1;
              }else{
                return typeof a > typeof b ? -1 : 1;
              }

            }
            else {
              throw ("error");
            }
          }
    },
      onScroll:function(e, position){

          this.position = position;
/*              this.position.scrollTop=e.srcElement.scrollTop
             this.position.scrollLeft=e.srcElement.scrollLeft */
           },
        handleSizeChange(val) {
          //console.log(`每页 ${val} 条`);
          this.pageSize=val
          this.currentPage=1
          this.dataContent=this.tableDataRes.slice(0,val)
           // this.setwtkhname(this.tableDataRes.slice(0,val))

          this.$emit('pageChange', 0, val)
        },
        handleCurrentChange(val) {
          //console.log(`当前页: ${val}`);
          this.currentPage=val;
          this.dataContent=this.tableDataRes.slice((val-1)*this.pageSize,val*this.pageSize)
          //  this.setwtkhname(this.tableDataRes.slice((val-1)*this.pageSize,val*this.pageSize))

        }
        ,setwtkhname(data){
     //翻页的时候再处理委托客户名称
       var wtkh = getxmdata('wtkh');
       var wtxm = getxmdata('wtxm');
          for(let m in data){
          let item=data[m];

        //  console.log(item.wtkhname)
         if(!item.wtkhname||item.wtkhname=='--'){
              for (let n in wtkh){
                let i = wtkh[n]
                if (i.id == item.fid) {
                  item.wtkhname = i.usr_name
                }

              }
            }


    if(!item.realwtkhname||item.realwtkhname=='--'||!item.wtxmname||item.wtxmname=='--'){
              for (let n in wtxm){
                let i = wtxm[n]
               if (i.id == item.realgid) {
                  item.realwtkhname = i.usr_name.split('-')[1]
                }
             if (i.id == item.gid) {
                  item.wtxmname = i.usr_name.split('-')[0]
                }

              }
            }

          }

          this.dataContent=data
        }
        ,getWidth(name){
    //console.log(name)
          var that=this;

          setTimeout(function(){
            var box = document.getElementsByClassName(name);
            var BoxFixed=document.getElementsByClassName(name+'Fixed');

            if(box[0]&&BoxFixed[0]){
                   let  w=box[0].clientWidth
                   let BoxFixedWidth=BoxFixed[0].clientWidth
        //           let  h=box[0].clientHeight
        //           let className=box[0].className
        //           let textContent=box[0].textContent
                    if(w==BoxFixedWidth){ //宽度相同时不做修改
                      return;
                    }
                    for(var i in BoxFixed){
                      if(typeof BoxFixed[i] =='object'){
                        BoxFixed[i].style['min-width']=w+1+"px"
                        BoxFixed[i].style['width']=w+1+"px"
                      }
                    }
            }
                  },0)



        }
        ,getHeight(name){
               ////console.log(name)
          var that=this;

          setTimeout(function(){
            var box = document.getElementsByClassName(name);
             var BoxHeight=document.getElementsByClassName(name+'Height');

            if(box[0]){
                   //let  w=box[0].clientWidth
                  //let  h=box[0].clientHeight
                   let h=box[0].children[0].clientHeight //获取td里面的子元素高度
                    for(var i in BoxHeight){
                      if(typeof BoxHeight[i] =='object'){
                        ////console.log(box[i])
                        BoxHeight[i].style['height']=h+1+"px"

                      }
                    }
            }

                  },0)



        }
      ,openNestedTables(index){
      if(index==this.ziTableIndex){
         this.ziTableIndex=-1
      }else{
        this.ziTableIndex=index
         this.$emit('transmitMsg',{index:index})
      }
      },
      nestedTableMsg(index){
         this.$emit('transmitZiMsg',{index:index})
      },
      hpoType(index){
        this.$emit('transmitMsg',{index:index,hpoType:1})
      },
      transAms(index,row){
        this.$emit('transAmsMsg',{index:index,row:row})
      }
      ,fixedWidth(width){
        if(width){
          return {
          //  width:width,
            "min-width":width
          }
          }
      }
      },

      computed:{
        dataGroupArr(){
              return Object.values(this.dataGrouping)
        },
        wtkhObj(){
               var wtkh = getxmdata('wtkh');
               var newObj={}
               wtkh.forEach(e=>{
                 newObj[e.id]=e.usr_name
               })
               return newObj
        } ,
         wtxmObj(){
               var wtxm = getxmdata('wtxm')
               var newObj={}
               wtxm.forEach(e=>{
                 newObj[e.id]=e.usr_name
               })
               return newObj
        } ,
              multiSelect:{
           get(){
             //分页和滚动加载时的多选
             var n=0
             var m=0

              if(this.isPaging){
                        this.tableDataRes.forEach((el,index)=> {
                              if((index>=(this.currentPage-1)*this.pageSize)&&(index<(this.currentPage*this.pageSize))){
                                        if(el.checked){
                                          n++
                                        }
                                        if(!el.checkDisabled){
                                          m++
                                        }
                                      }
                        })
                        this.checkedLength=n
                        return (n==this.pageSize||n==this.tableDataRes.length||n==m)&&(this.tableDataRes.length>0)&&n>0

                  }else{
                     this.dataContent.forEach((el,index)=> {
                                        if(el.checked){
                                          n++
                                        }
                                        if(!el.checkDisabled){
                                          m++
                                        }
                        })
                        return (n==this.dataContent.length||n==m)&&(this.dataContent.length>0)&&n>0

                 }
           },set(val){

                    if(this.isPaging){
                          this.tableDataRes.forEach((i,index)=>{
                                    if(index<(this.currentPage*this.pageSize)&&(index>=(this.currentPage-1)*this.pageSize)){
                                              if(!i.checkDisabled){
                                                i.checked=val
                                              }
                                        }
                                        }
                                    )
                    }else{
                               this.dataContent.forEach((i,index)=>{
                                        if(!i.checkDisabled){
                                                i.checked=val
                                              }
                                        }

                                    )
                    }

           }
         },
         styleObj: function () {
                return {
                    top:this.position.scrollTop+'px'
                    }
          },

        styleObj2: function () {
          return {
               left:this.position.scrollLeft+'px',
              }
           }
        ,

            getLeft(){

                      let left=document.getElementById('leftSideFixed').clientWidth
                      let ziRigthTableWidth=document.getElementById('headFixed').clientWidth

                      if(this.nestedTableType==1){
                        left=0
                        ziRigthTableWidth-0
                      }
                      return {
                            left:left+'px',
                            width:'800px'
                            //width:ziRigthTableWidth-left+'px'
                          }


            }
          ,
        dataTable(){


          let name=this.name.split('.')[0]

            var data=this.$store.state.tablePageTmp[name]
             // //console.log(name)
           // //console.log(data)
            if(data){
              return data
            }else{
                return []
            }



           },
           head(){

            let name=this.name.split('.')[0]
            var data=this.$store.state.childrenTablePageTmp[name]
            if(data){
              return data
            }else{
                return []
            }

           // return this.dataTable[1]
           },
           ziHeadFixed(){
                    var nestedTableFixed=this.$store.state.tableTmpAll
                      for(let i in nestedTableFixed){
                          if(nestedTableFixed[i].url==this.name&&nestedTableFixed[i].type==40){
                            return JSON.parse(nestedTableFixed[i].jsondata)[0]
                          }
                        }
                 //   return this.dataTable[0]
           },
           headShow(){

           var tableHeadShow=this.$store.state.tableHeadShow
             this.headFixedShow=false;
             this.headFixedBlock=false;
                setTimeout(() => {
                 this.headFixedShow=true;
              }, 100);
                setTimeout(() => {
                 this.headFixedBlock=true;
              }, 200);
             return  tableHeadShow
           }


       },
      mounted () {
        if(!this.isPaging){
          this.pageSize=10
        }

          //   setTimeout(() => {
          //    var setHeight = function () {
          //    var heightTable = $('.main').height() - $('.page-container-box').height() - 220
          //    heightTable = heightTable > 200 ? heightTable : 200
          //   // //console.log(heightTable)
          //    $("#topDivTable").height(heightTable)

          //  }


          //  setHeight()
          //  window.onresize = function () {
          //    setHeight()
          //  }
          // }, 0);
      }
    ,watch:{
        currentPage: {
          handler (val) {
            // @pageChange( startIndex, endIndex )
            this.$emit('pageChange', (val-1)*this.pageSize, val*this.pageSize)
          },
          immediate: true
        },
        tableDataRes(val){
   //console.time("tabletime");

           if(val){
              this.totalInfo={
                lengthinfo:0,
                ybinfo:{ybpiece:0,ybweight:0,ybvolume:0},
                realinfo:{realpiece:0,realweight:0,realvolume:0},
                zdinfo:{zdpiece:0,zdweight:0,zdvolume:0},
                wageprofit:0,
                realwageall:0,
                billwageall:0,
                wageall:0,
                finishwageall:0,
                finishwageall_checkbill:0,
                accountweightin_sett: 0,
                realwagein: 0,
                realwageout: 0,
                realwage_profit: 0
              }

             this.currentPage=1
           //  this.dataGrouping={}
            this.tableDataRes.forEach((i,index)=>{
              this.$set(i,'checked',false)
              this.$set(i,'index',index)

               if(!i.wtkhname||i.wtkhname=='--'){
                  i.wtkhname = this.wtkhObj[i.fid]||'--'
                }

              if(!i.realwtkhname||i.realwtkhname=='--'||!i.wtxmname||i.wtxmname=='--'){
                i.realwtkhname = this.wtxmObj[i.realgid]?(this.wtxmObj[i.realgid].split('-')[1]):'--'
                 i.wtxmname = this.wtxmObj[i.gid]?this.wtxmObj[i.gid].split('-')[0]:'--'
                }
          /*     if(this.isGroup&&i.hbh){
              if(!this.dataGrouping[i.hbh]){
                          this.dataGrouping[i.hbh]={id:i.hbh,count:1,boguid:i.boguid}
                        }else{
                          this.dataGrouping[i.hbh].count=this.dataGrouping[i.hbh].count+1
                        }
              } */

              if(this.showTotal.all){

                if(this.showTotal.ybjzt){
                this.totalInfo.ybinfo.ybpiece+=Number(i.ybpiece)
                this.totalInfo.ybinfo.ybweight+=Number(i.ybweight)
                this.totalInfo.ybinfo.ybvolume+=Number(i.ybvolume)
                }

              if(this.showTotal.sjjzt){
                this.totalInfo.realinfo.realpiece+=Number(i.realpiece)
                this.totalInfo.realinfo.realweight+=Number(i.realweight)
                this.totalInfo.realinfo.realvolume+=Number(i.realvolume)
                }

                if(this.showTotal.zdjzt){
                this.totalInfo.zdinfo.zdpiece+=Number(i.zdpiece)
                this.totalInfo.zdinfo.zdweight+=Number(i.zdweight)
                this.totalInfo.zdinfo.zdvolume+=Number(i.zdvolume)
                }

                if(this.showTotal.wageprofit){
                this.totalInfo.wageprofit+=Number(i.wageprofit)
                }

                if(this.showTotal.realwageall){
                //  if(i.realwageall.indexOf('￥')!=-1){
                    this.totalInfo.realwageall+=Number(i.realwageall)
                 // }

                }

                if(this.showTotal.billwageall){
                 // if(i.billwageall.indexOf('￥')!=-1){
                  this.totalInfo.billwageall+=Number(i.billwageall)
               // }
                }

                if(this.showTotal.wageall){
                 // if(i.wageall.indexOf('￥')!=-1){
                    this.totalInfo.wageall+=Number(i.wageall)
                 // }

                }

                if(this.showTotal.finishwageall){

                //  if(i.finishwageall.indexOf('￥')!=-1){
                    this.totalInfo.finishwageall+=Number(i.finishwageall)
                 // }

                }

                if(this.showTotal.finishwageall_checkbill){

                 // if(i.finishwageall_checkbill.indexOf('￥')!=-1){
                    this.totalInfo.finishwageall_checkbill+=Number(i.finishwageall_checkbill)
                 // }

                }
              }

            })

               if(this.isPaging){
                 this.dataContent=this.tableDataRes.slice(0,this.pageSize);
               }else{
                 this.dataContent=this.tableDataRes.slice(0,this.tableLoadCount());
               }

            // this.setwtkhname(this.tableDataRes.slice(0,this.pageSize))

              this.totalInfo.lengthinfo=val.length
              $(".sort-check").removeClass("sort-check");

          }

   //console.timeEnd("tabletime");

         }

      },
      activated(){
            $('#topDivTable').scrollTop(this.position.scrollTop)
            $('#topDivTable').scrollLeft(this.position.scrollLeft)
      },
      beforeUpdate(){

      },
      updated(){

      }


    }

</script>



<style lang="less" scoped>



#topDivTable{
 position:relative;
 //height:380px;
 border:1px solid #e8e8e8;
 box-sizing: border-box;
 border-radius:1px;
 margin:0px 0px;
 overflow:scroll;
 overflow-y:auto;
 overflow-x:auto;
 //height: calc(100% - 175px);
 flex:1;


}

#headFixed{
   position:absolute;
   z-index:999;
   overflow:hidden;
   left: -1px;//防止出现滚动条
}
#headFixed table{
  width:calc(100% - 100px);
}
#divTable table{
  width:100%;
}
#divTable{
  // width: -moz-calc(100% - 10px);
  // width: -webkit-calc(100% - 10px);
  // width: calc(100% - 10px);
  width:100%;
   position:absolute;
}

#leftSideFixed{
    position:absolute;
    z-index:999;
    //background-color:#fff;
}
tr td:first-child{
  border-left:none
}
tr th:first-child{
  border-left:none
}
#divTable table tr:nth-child(even){background:#f8f8f8;}
#leftSideFixed table tr:nth-child(odd){background:#f8f8f8;}

.trRow{
 color:#333;
 //font-size:12px;
background-color:#fff;
}
.trRow td,th{
  height:32px;
  line-height:32px;
  min-width:30px;
  text-align:center;
  padding:0px 8px;
  border:1px solid #e8e8e8;
  white-space:nowrap;
  max-width:280px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.thfont{
  font-weight:600;
}
.thfont th{
  // background-color:#f5f7fa;
   border-top:0px solid #e8e8e8;
}
.trRow .inputDuv{
  width:50px;
  min-width:50px;
}
.confirmG{width:6px;height:6px;border-radius:6px;display:inline-block;background:#c8c8c8;margin-right:5px}
.confirmR{width:6px;height:6px;border-radius:6px;display:inline-block;background:#f56c6c;margin-right:5px}
.confirmGr{width:6px;height:6px;border-radius:6px;display:inline-block;background:#93de6e;margin-right:5px}



td i{
  display:inline-block;
  width:16px;
  height:16px;
  margin:0 6px;
  font-size:14px;
  cursor:pointer;
}


 .fixDiv{
   display: flex;
   flex-wrap: nowrap;
   height: 32px;
   line-height: 32px;
   align-items: center;
   margin-top: 0px;
   position: absolute;
 }
 .fixHeadDiv{
   height: 32px;
   line-height: 32px;
   min-width: 100px;
   text-align: center;
   padding: 0px 8px;
  //  border-bottom: 1px solid #e8e8e8;
  //  border-right: 1px solid #e8e8e8;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
   background: #EEF1F6;
  }

  .tableSetMuban{
    display: inline-block;
    min-width: 70px;
    height: 28px;
    line-height: 28px;
    color: #444;
    margin: 0px;
    text-align: center;
    background: #F8F8F8;
    border: 1px solid #e8e8e8;
    cursor: pointer;
    margin-right: 5px;
    text-decoration: none;
  }
.resDiv{
  height:36px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border:1px solid #e8e8e8;
  padding-left:15px;
  padding-right:5px;
  border-bottom:0px solid #ccc;
  background:#f8f8f8;
  font-size:10px;
  letter-spacing:0.1em;
  h2{
    font-weight: normal;
    color:#444;
  }
}
.sortWrap{
  display: inline-block;
  height: 32px;
  margin-left:5px;
/*   vertical-align:baseline;
  height: 18px!important;
  overflow: hidden; */
}
.sortWrap>i{
  display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    // position: relative;
    // top: -13px;
    -webkit-transform:translateY(-12px);
    -moz-transform:translateY(-6px);
}
.sort-ascend{
  width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-bottom: 6px solid #C0C4CC;
cursor: pointer;
}
.sort-descend{
  width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-top: 6px solid #C0C4CC;
cursor: pointer;
margin-top:3px;
}
.sort-check{
  border-bottom-color:#409EFF;
  border-top-color:#409EFF;
}

.hxbhreason{
  .el-dialog__body{
    padding: 8px 40px;
   .el-textarea{
    /deep/.el-textarea__inner{color:#333!important}
    }
  }
  h3{
    font-size: 18px;
    color: #004d84;
  }
  .orderNo{
    margin-top: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    margin-bottom: 12px;
    span {
      float: left;
      color: #004d84;
      font-weight: bold;
    }
    &:after{
      content: '';
      display: block;
      clear: both;
    }
  }
  ul li{
    display: inline-block;
    width: 100px;
    text-align: left;
    color: #999;
  }
.delbillman-wrap {
    width: 800px;
    overflow: hidden;
    display: inline-block;
    .delbillmanList {
      width: 10000px;
      li {
        position: relative;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        font-size: 13px;
        cursor: pointer;
        width: 136px;
        padding: 5px 8px;
        color: #4c4c4c;
        margin-right: 29px;
        p:first-child {
          margin-bottom: 3px;
          .left {
            color: #999;
          }
        }
        .left {
          text-align: left;
        }
        .right {
          float: right;
          width: 50px;
          overflow: hidden;
          text-align: right;
        }
        .el-icon-caret-right {
          position: absolute;
          font-size: 18px;
          right: -25px;
          top: 15px;
          color: #606266;
        }

        &.active {
          background: #004e82;
          border-color: #004e82;
          color: #fff;
          p:first-child {
            .left {
              color: #fff;
            }
          }
        }
        &:last-child {
          .el-icon-caret-right {
            display: none;
          }
        }
      }
    }
    + .arrow {
      margin-top: 16px;

    }
  }

}

.ifzh{
  line-height:14px;
  span{
    display: inline-block;
  }
  .sortWrap{
    vertical-align:baseline;
    height:18px!important;
    overflow: hidden;
  }
}
.el-icon-dollar{
   background:url('../../../boStatic/images/dollarIcon.png') no-repeat;
   position: relative;
   top:4px;
}
.group{
  // opacity: 0;
  // visibility: hidden;
  td{
    height: 24px;
    line-height: 24px;
    background-color:#f7e27e;
    text-align:left;
    font-size:13px;
  }

}



</style>
