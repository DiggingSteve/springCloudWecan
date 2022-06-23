<template>
  <div class="mawbImport">
    <el-button @click="importDialogVisible = true;setFid()" type="primary">批量新增</el-button>
     <!-- <el-button @click="saveImportTemp" type="primary">保存模板</el-button> -->
    <!-- <el-button @click="updateImportTemp" type="primary">更新模板</el-button>  -->
    <el-dialog
      class="dialogPage"
      custom-class="mawbImportDialog"
      v-if="importDialogVisible"
      :visible.sync="importDialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="1500px"
      top="0"
      center
      title="批量新增">

      <div>
        <div class="title first-title">
          请填写公共信息
        </div>
        <newFormCmpt
          :view-data.sync="inputViewData"
          :model-data.sync="inputModelData"
          :pagetype="2"
          :area='area'
          @changeRelData="customerRelList = $event">
        </newFormCmpt>

        <div class="detail" style="position:relative;margin-top:10px;">
          <div class="detail-c" style="padding-top: 10px;">

            <tempConfig :name='"mawbAddNew.vue"' :type="80" :jsondata.sync="serviceList" style="width:285px;position:absolute;top:0px;right:-11px"></tempConfig>

            <serviceList
            style="margin-top:30px;"
              :serviceList.sync="serviceList"
              opersystem="出口"
              :newService="newService">
            </serviceList>

          </div>
        </div>

        <slot name="footer">
          <div class="title">
            请选择模板文件
            <a class="wecanTempDownload" href="./boStatic/唯凯标准批量订单导入模板.xlsm" target='_self'>唯凯标准订单模板下载<i class="el-icon-download"></i></a>
          </div>
          <el-row>
            <el-col :span="7">
              <span class="label">模板：</span>
              <el-select v-model="inputModelData.curTempIndex" placeholder="请选择模板" class="input-required">
                <el-option v-for="temp of tempSelectOption" :key="temp.value" :value="temp.value" :label="temp.label"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <span class="label">选择文件：</span>
              <el-upload
                class="upload-excel"
                :show-file-list="false"
                :http-request="selectFile"
                action="">
                <el-button @click="checkUploadFileRequireInfo" size="small" type="primary">选择文件</el-button>
                <div class="el-upload__tip" slot="tip" v-if="selectedFile" style="display:inline;margin-left: 20px;">{{ selectedFile.name }}</div>
              </el-upload>
            </el-col>
            <el-col :span="8">
              <span class="label">选择Sheet：</span>
              <el-select v-model="selectedSheet" placeholder="请选择Sheet" class="input-required">
                <el-option v-for="sheet of SheetNames" :key="sheet" :value="sheet"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" :disabled="!selectedFile.name" @click="analyzeSheet">导入</el-button>
            </el-col>
          </el-row>
        </slot>
      </div>

    </el-dialog>

    <el-dialog
      class="mawbAddDialog"
      :modal-append-to-body="false"
      width="85%"
      top="30px"
      center
      :visible.sync="mawbAddVisible"
      :close-on-click-modal="false"
      title="批量新增">

      <div>
        <el-tabs v-model="tabsActiveName">
          <el-tab-pane :label="`订单已完善(${this.completeOrder.length})`" name="completeOrder"></el-tab-pane>
          <el-tab-pane :label="`订单未完善(${this.incompleteOrder.length})`" name="incompleteOrder"></el-tab-pane>
          <el-tab-pane :label="`重复订单(${this.repeatOrder.length})`" name="repeatOrder"></el-tab-pane>
        </el-tabs>

        <div class="selectAllOrder">
          <template v-if="tabsActiveName !== 'repeatOrder'">
            <el-checkbox v-model="selectAllValidMawb" label="全选"></el-checkbox>
            <span>(已选择{{ selectedOrderIndex.length }}条)</span>
          </template>
        </div>

        <el-container>
          <el-aside width="130px">
            <div class="orderNav">
              <div
                v-for="(item, index) in orderPageData"
                :key="index"
                :class="['navItem',{'active': activeOrderIndex == index + (currentPage-1)*20}]"
                @click="changeActiveOrderIndex(index + (currentPage-1)*20, $event)">
                <el-checkbox
                  v-if="tabsActiveName !== 'repeatOrder'"
                  :class="{hasRequiredInfo: orderData[index + (currentPage-1)*20].hasRequiredInfo === true}"
                  :value="selectedOrderIndex"
                  :label="index + (currentPage-1)*20"
                  @input="clickOrderCheckbox">
                  {{ item.insertindex }}
                </el-checkbox>
                <span v-else class="el-checkbox__label">
                  {{ item.insertindex }}
                </span>
                <el-tooltip
                  v-if="resultMessage[item.insertindex]"
                  effect="dark"
                  :content="resultMessage[item.insertindex]"
                  placement="top-start">
                  <span>新增失败</span>
                </el-tooltip>
              </div>
            </div>
          </el-aside>

          <el-main>
            <mawbAddNew
              v-if="orderPageData.length !== 0"
              ref="mawbAddNew"
              :isMawbImport="true"
              :area="area"
              :importActiveName="tabsActiveName"
              :orderdom="orderData[activeOrderIndex] && orderData[activeOrderIndex].orderdom || '总单'"
              :importMawbData.sync="orderData[activeOrderIndex]" />
          </el-main>
        </el-container>

        <div class="footer">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="20"
            layout="total, prev, pager, next, jumper"
            :total="orderData.length">
          </el-pagination>

          <div class="btn-c">
            <template v-if="tabsActiveName !== 'repeatOrder'">
              <el-button type="primary" @click="saveOrder(1)">本站操作</el-button>
              <el-button type="primary" @click="saveOrder(2)">保存待处理</el-button>
              <!-- <template v-if="tabsActiveName == 'incompleteOrder'">
                <el-button type="primary" @click="saveIncompleteOrder">暂存</el-button>
              </template> -->
            </template>
            <template v-else-if="tabsActiveName == 'repeatOrder'">
              <el-button type="primary" @click="updateRepeatOrder">覆盖原信息</el-button>
            </template>
          </div>
        </div>
      </div>

    </el-dialog>

    <el-dialog
      custom-class="mawbBatchResultDialog"
      v-if="mawbBatchResultVisible"
      :visible.sync="mawbBatchResultVisible"
      width="1000"
      center
      title="导入结果"
      :modal-append-to-body="false"
      :close-on-click-modal="false">

      <div class="table-c">
        <el-table :data="postResultTableData" border height="540">
          <el-table-column label="订单序号" prop="resultid1" width="80"></el-table-column>
          <el-table-column label="结果" prop="resultmessage1"></el-table-column>
          <el-table-column label="订单序号" prop="resultid2" width="80"></el-table-column>
          <el-table-column label="结果" prop="resultmessage2"></el-table-column>
        </el-table>
        <div class="btn-c">
          <el-button @click="printLzd" type="primary" :disabled="disableLzdBtn">打印流转单</el-button>
        </div>
      </div>

    </el-dialog>

    <el-dialog
      :visible.sync="lzdDialogVisible"
      class="dialogImgDoc batch-print-dialog"
      v-if="lzdDialogVisible"
      :fullscreen="true"
      width="1200px"
      :modal-append-to-body="false"
      top="4%">
      <iframe :src="lzdUrl" frameborder="0" allowtransparency="true" style="width: 70%; height: 120%; border: 0px none;"></iframe>
    </el-dialog>

  </div>
</template>

<script>
/**
 * mainColumn: 主列，当此列的某行有数据时才将此行作为一个订单
 * defaultField:  模板默认字段
 * json:  Excel解析规则
 *  field: 此列对应的数据字段，field和level以逗号分割时按index一一对应
 *  level: 标识此列是哪一层数据（1:订单层，2:分单层，3:货物层，4:尺寸层）
 *  merge: 如果此列存在合并的单元格，则将合并的那几行作为一个订单
 *  regexp: 正则表达式，验证此列的单元格内容是否符合格式
 *  matchRegexp: 当regexp验证不通过时，使用matchRegexp进行匹配，如果匹配成功则替换旧值
 *  require: 必填项，当此列无数据或数据不符合正则规则时，直接跳过此行订单数据
 *  split: 分隔符，当一个单元格内有多条数据时，使用分割符分开
 *  formatFn: 某些单元格内容格式没法统一解析，所以保存一个解析函数用于专门解析此单元格，
 *            参数：val（单元格值），rules（此单元格的解析配置），data（此行列表的订单数据，函数内部将对应的字段写入此对象）
 *            函数形式：function(val, rules, data){ // 函数体 }
 *            函数作用域内的this为当前组件实例
 *  mergeVerify: 德迅特定合并验证规则，向下查找'col'列，当匹配'merge'时将此行订单做合并处理，当匹配'nomerge'时做一条订单处理
 *  second: 某些列存在多种数据，通过正则验证，优先匹配的匹配项正则验证失败则使用second匹配项进行匹配
 *  valfind: 当此单元格没有值时，按照规则进行查找值
 *          direction: 查找方向，值为 'up'或者'down'，代表向上查找或者向下查找
 *          col: 查找的列，找到不为空的值之后赋值给当前单元格
 */
// 如果页面报错，首先检查维护的模板是否正确
let mawbImportTemplate = [
  {
    wtkhname: '德迅（中国）货运代理有限公司',
    fid: 1719,
    tempName: '德迅-EU',
    mainColumn: 'B',
    defaultField: [
      {
        field: 'czlx',
        level: '1',
        defaultValue: '代操作'
      },
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mdg',
        level: '1',
        regexp: '^[A-Z]{3}$',
        matchRegexp: '^([A-Z]{3})',
        second: {
          field: 'hbh,hbrq',
          level: '1',
          regexp: '[/]'
        }
      },
      'B': {
        field: 'mdg',
        level: '2',
        regexp: '^[A-Z]{3}$',
        matchRegexp: '^([A-Z]{3})',
        require: true
      },
      'C': {
        field: 'companytitle_shr_hawb',
        level: '2'
      },
      'D': {
        field: 'hawb,khjcno',
        level: '2,3'
      },
      'E': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        mergeVerify: {  // 合并验证，向下查找A列，满足合并条件时做合并处理，不满足时做一条订单处理
          col: 'A',
          merge: 'CONSOL',
          nomerge: 'SINGLE'
        }
      },
      'F': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'G': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'H': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'I': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        split: '+'
      },
      'R': {
        field: 'batterymodel',
        level: '2',
        matchContent: 'PI967,PI970'
      }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司',
    fid: 4833,
    tempName: 'FTN  APPLE BOOKING 整机',
    mainColumn: 'B',
    defaultField: [
      {
        field: 'czlx',
        level: '1',
        defaultValue: '代操作'
      },
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'B': {
        field: 'mdg,mdg',
        level: '1,2',
        regexp: '^[A-Z]{3}$',
        matchRegexp: '^([A-Z]{3})'
      },
      'C': {
        field: 'hawb,khjcno',
        level: '2,3'
      },
      'D': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true
      },
      'F': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
     'G': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'H': {
        field: 'smallpiece',
        level: '2'
      },
      'J': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'L': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'M': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        split: ' ',
        formatFn: `function(val, rules, data){
                    if (!data.ybstoreList[0]) data.ybstoreList[0] = { ybstorevolumeList: [] };
                    let arr = val.split(\/\\s+\/);
                    arr.reduce((p, v) => {
                      let obj = {};
                      v = v.split('*');
                      obj.longs = v[0] || '1';
                      obj.widths = v[1] || '1';
                      obj.heights = v[2] || '1';
                      obj.piece = v[3] || '1';
                      p.push(obj);
                      return p;
                    }, data.ybstoreList[0].ybstorevolumeList);
                  }`
      },
      'N': {
        field: 'remark',
        level: '2'
      },
      'P': {
        field: 'chinesepm',
        level: '2'
      },
      'Q': {
        field: 'batterymodel',
        level: '2'
      }
    }
  },
  {
    wtkhname: '西铁国际货运（上海）有限公司',
    fid: 2607,
    tempName: '西铁计划',
    mainColumn: 'E',
    defaultField: [
      {
        field: 'czlx',
        level: '1',
        defaultValue: '自货'
      },
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'C': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true
      },
      'D': {
        field: 'hawb,khjcno',
        level: '2,3'
      },
      'E': {
        field: 'mdg,mdg',
        level: '1,2',
        regexp: '^[A-Z]{3}$',
        matchRegexp: '^([A-Z]{3})'
      },
      'F': {
        field: 'hbh,hbrq',
        level: '1,1',
        formatFn: `function(val, rules, data){let hbInfo = this.resolveHbhHbrq(val);rules.field.split(',').forEach(key => {data[key] = hbInfo[key]})}`
      },
      'H': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'I': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'J': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
    }
  },
  {
    wtkhname: '上海邮航国际货运有限公司',
    fid: 1513,
    tempName: 'YAS  出舱单',
    mainColumn: 'H',
    defaultField: [
      {
        field: 'czlx',
        level: '1',
        defaultValue: '自货'
      },
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'H': {
        field: 'hawb,khjcno',
        level: '2,3'
      },
      'I': {
        field: 'hbrq',
        level: '1',
        valfind: {
          direction: 'down',
          col: 'I'
        },
        formatFn: `function(val, rules, data) {
                    let {y: years, m: month, d: day} = XLSX.SSF.parse_date_code(val);
                    data[rules.field] = years + '-' + month + '-' + day;
                  }`
      },
      'J': {
        field: 'hbh',
        level: '1',
        valfind: {
          direction: 'down',
          col: 'J'
        }
      },
      'K': {
        field: 'mawb',
        level: '1',
        merge: true,
        valfind: {
          direction: 'down',
          col: 'K'
        }
      },
      'M': {
        field: 'ybpiece',
        level: '2',
        regexp: '^[0-9.]+$',
        require: true
      },
      'N': {
        field: 'ybweight',
        level: '2'
      },
      'O': {
        field: 'ybvolume',
        level: '2'
      },
      'P': {
        field: 'piece',
        level: '3'
      },
      'Q': {
        field: 'weight',
        level: '3'
      },
      'S': {
        field: 'volume',
        level: '3'
      },
      'T': {
        field: 'mdg,mdg',
        level: '1,2',
        regexp: '^[A-Z]{3}$',
        matchRegexp: '([A-Z]{3})$',
        valfind: {
          direction: 'down',
          col: 'T'
        }
      }
    }
  },
  {
    wtkhname: 'ALL',
    fid: '',
    tempName: '唯凯标准订单模板',
    mainColumn: 'B',
    defaultField: [
      {
        field: 'czlx',
        level: '1',
        defaultValue: '自货'
      },
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mawb',
        level: '1',
        //require: true,
        regexp: '^\\d{3}-\\d{8}$',
        merge: true
      },
      'B': {
        field: 'mdg,mdg',
        level: '1,2',
        require: true,
        regexp: '^[A-Z]{3}$',
        matchRegexp: '([A-Z]{3})$',
      },
      'C': {
        field: 'hbh',
        level: '1',
        //require: true,
      },
      'D': {
        field: 'hbrq',
        level: '1',
        require: true,
        formatFn: `function(val, rules, data) {
                    data[rules.field] = val.replace(/\\//g, '-');
                  }`
      },
      'E': {
        field: 'hwxz',
        level: '1',
      },
      'F': {
        field: 'hwlx',
        level: '1',
        // 去掉结尾多余的逗号
        formatFn: `function(val, rules, data) {
                    data[rules.field] = val.replace(/,$/, '');
                  }`
      },
      'G': {
        field: 'batterymodel',
        level: '1',
      },
      'H': {
        field: 'englishpm',
        level: '1',
      },
      'I': {
        field: 'isinwageallin',
        level: '1',
        formatFn: `function(val, rules, data) {
                    if (val === 'ALLIN单价') {
                      data[rules.field] = '1';
                    } else if (val === '单价++') {
                      data[rules.field] = '3';
                    } else if (val === 'COST+') {
                      data[rules.field] = '4';
                    }
                  }`
      },
      'J': {
        field: 'inwageallinprice',
        level: '1',
      },
      'K': {
        field: 'currency',
        level: '1',
        formatFn: `function(val, rules, data) {
                    const currencyObj = { 'CNY': '人民币', 'USD': '美元', 'EUR': '欧元', 'HKD': '港币', 'GBP': '英镑', 'JPY': '日元' };
                    data[rules.field] = currencyObj[val];
                  }`
      },
      'L': {
        field: 'hawb,khjcno',
        level: '2,3',
        require: true,
      },
      'M': {
        field: 'ybpiece,piece',
        level: '2,3',
        require: true,
      },
      'N': {
        field: 'ybweight,weight',
        level: '2,3',
        require: true,
      },
      'O': {
        field: 'ybvolume,volume',
        level: '2,3',
        require: true,
      },
      'P': {
        field: 'longs,widths,heights,piece,packagetypename',
        level: '4,4,4,4,4',
        split: '\n',
        fieldSplit: '*'
      },
      // 'B': {
      //   field: 'mawb',
      //   level: '1',
      //   regexp: '^\\d{3}-\\d{8}$',
      //   merge: true
      // },
      // 'B': {
      //   field: 'mdg',
      //   level: '1'
      // },
      // 'D': {
      //   field: 'ybpiece',
      //   level: '1'
      // },
      // 'E': {
      //   field: 'ybweight',
      //   level: '1'
      // },
      // 'F': {
      //   field: 'ybvolume',
      //   level: '1'
      // },
      // 'G': {
      //   field: 'hbzl',
      //   level: '1'
      // },
      // 'H': {
      //   field: 'hbh',
      //   level: '1'
      // },
      // 'I': {
      //   field: 'hbrq',
      //   level: '1',
      //   formatFn: `function(val, rules, data) {
      //               data[rules.field] = val.replace(/\\//g, '-');
      //             }`
      // },
      // 'J': {
      //   field: 'hwxz',
      //   level: '1'
      // },
      // 'K': {
      //   field: 'hwlx',
      //   level: '1',
      //   // 去掉结尾多余的逗号
      //   formatFn: `function(val, rules, data) {
      //               data[rules.field] = val.replace(/,$/, '');
      //             }`
      // },
      // 'M': {
      //   field: 'batterymodel',
      //   level: '1'
      // },
      // 'N': {
      //   field: 'englishpm',
      //   level: '1'
      // },
      // 'L': {
      //   field: 'isinwageallin',
      //   level: '1',
      //   formatFn: `function(val, rules, data) {
      //               if (val === 'ALLIN单价') {
      //                 data[rules.field] = '1';
      //               } else if (val === '单价++') {
      //                 data[rules.field] = '3';
      //               } else if (val === 'COST+') {
      //                 data[rules.field] = '4';
      //               }
      //             }`
      // },
      // 'M': {
      //   field: 'inwageallinprice',
      //   level: '1'
      // },
      // 'N': {
      //   field: 'currency',
      //   level: '1',
      //   formatFn: `function(val, rules, data) {
      //               const currencyObj = { 'CNY': '人民币', 'USD': '美元', 'EUR': '欧元', 'HKD': '港币', 'GBP': '英镑', 'JPY': '日元' };
      //               data[rules.field] = currencyObj[val];
      //             }`
      // },
      // 'T': {
      //   field: 'hawb',
      //   level: '2'
      // },
      // 'U': {
      //   field: 'sfg',
      //   level: '2'
      // },
      // 'V': {
      //   field: 'mdg',
      //   level: '2'
      // },
      // 'W': {
      //   field: 'ybpiece',
      //   level: '2'
      // },
      // 'X': {
      //   field: 'ybweight',
      //   level: '2'
      // },
      // 'Y': {
      //   field: 'ybvolume',
      //   level: '2'
      // },
      // 'Z': {
      //   field: 'englishpm',
      //   level: '2'
      // },
      // 'AC': {
      //   field: 'khjcno',
      //   level: '3'
      // },
      // 'AD': {
      //   field: 'piece',
      //   level: '3'
      // },
      // 'AE': {
      //   field: 'weight',
      //   level: '3'
      // },
      // 'AF': {
      //   field: 'volume',
      //   level: '3'
      // },
      // 'AG': {
      //   field: 'longs,widths,heights,piece,packagetypename',
      //   level: '4,4,4,4,4',
      //   split: '\n',
      //   fieldSplit: '/'
      // }

      // 'O': {
      //   field: 'khjcno',
      //   level: '3'
      // },
      // 'P': {
      //   field: 'piece',
      //   level: '3'
      // },
      // 'Q': {
      //   field: 'weight',
      //   level: '3'
      // },
      // 'R': {
      //   field: 'volume',
      //   level: '3'
      // },
      // 'AG': {
      //   field: 'longs,widths,heights,piece,packagetypename',
      //   level: '4,4,4,4,4',
      //   split: '\n',
      //   fieldSplit: '/'
      // }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司郑州分公司',
    fid: 5559,
    tempName: 'FTN--Shipping confirmation ETD HHTY',
    mainColumn: 'I',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'C': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'F': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'G': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        formatFn: `function(val, rules, data){
          if (!data.ybstoreList[0]) data.ybstoreList[0] = { ybstorevolumeList: [] };
          val.split('+').forEach(function (item) {
            let result = item.match(/[\\d.]+/g);
            if (!result) return;
            let obj = {}
            obj['longs'] = Math.ceil(result[0]) || '';
            obj['widths'] = Math.ceil(result[1]) || '';
            obj['heights'] = Math.ceil(result[2]) || '';
            obj['piece'] = Math.ceil(result[3]) || '';
            data.ybstoreList[0].ybstorevolumeList.push(obj);
          });
        }`
      },
      'H': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
      'I': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'J': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'K': {
        field: 'hawb,khjcno',
        level: '2,3'
      }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司郑州分公司',
    fid: 5559,
    tempName: 'CGO_FTN_分車明細',
    mainColumn: 'I',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'J': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'P': {
        field: 'smallpiece',
        level: '2'
      },
      'Q': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'R': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'S': {
        field: 'orderno',
        level: '1'
      },
      'T': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        split: '*',
        formatFn: `function(val, rules, data){
          if (!data.ybstoreList[0]) data.ybstoreList[0] = { ybstorevolumeList: [] };
          val.split('\\n').forEach(i => {
            i = i.match(/[\\d.]+/g);
            if (!i) return;
            let obj = {};
            obj['longs'] = Math.ceil(i[0]) || '';
            obj['widths'] = Math.ceil(i[1]) || '';
            obj['heights'] = Math.ceil(i[2]) || '';
            obj['piece'] = Math.ceil(i[3]) || '';
            data.ybstoreList[0].ybstorevolumeList.push(obj);
          });
        }`
      },
      'U': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'V': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'W': {
        field: 'hbh',
        level: '1'
      },
      'X': {
        field: 'hbrq',
        level: '1',
        formatFn: `function(val, rules, data){
          data['hbrq'] = new Date(val).toLocaleDateString().replace(\/\\/\/g,'-');
        }`
      },
      'Z': {
        field: 'hawb,khjcno',
        level: '2,3'
      }
    }
  },
  {
    wtkhname: '上海万实达国际物流有限公司',
    fid: 2182,
    tempName: '万实达',
    mainColumn: 'A',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'B': {
        field: 'hawb',
        level: '2'
      },
      'C': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'D': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'E': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'F': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'G': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
      'H': {
        field: 'khjcno',
        level: '3'
      }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司郑州分公司',
    fid: 5559,
    tempName: 'FTN Shipping confirmation',
    mainColumn: 'V',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'H': {
        field: 'mdg,mdg',
        level: '1,2',
      },
      'O': {
        field: 'smallpiece',
        level: '2'
      },
      'P': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'R': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'T': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        split: ' '
      },
      'U': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'V': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'W': {
        field: 'hbh',
        level: '1'
      },
      'X': {
        field: 'hbrq',
        level: '1',
        formatFn: `function(val, rules, data){
          data[rules.field] = new Date(val).toLocaleDateString().replace(/\\//g, '-')
        }`
      },
      'Z': {
        field: 'hawb,khjcno',
        level: '2,3'
      },
      'AE': {
        field: 'sfg,sfg',
        level: '1,1'
      }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司郑州分公司',
    fid: 5559,
    tempName: 'ShippingInfo',
    mainColumn: 'W',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'H': {
        field: 'mdg,mdg',
        level: '1,2',
      },
      'N': {
        field: 'smallpiece',
        level: '2'
      },
      'O': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'P': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'U': {
        field: 'longs,widths,heights,piece',
        level: '4,4,4,4',
        split: ' '
      },
      'V': {
        field: 'ybvolume',
        level: '1'
      },
      'W': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'X': {
        field: 'hbh',
        level: '1'
      },
      'Y': {
        field: 'hbrq',
        level: '1',
        formatFn: `function(val, rules, data){
          let strArr = val.split('');
          strArr.splice(4, 0, '-');
          strArr.splice(-2, 0, '-');
          data[rules.field] = new Date(strArr.join('')).toLocaleDateString().replace(/\\//g, '-');
        }`
      },
      'AB': {
        field: 'hawb,khjcno',
        level: '2,3'
      }
    }
  },
  {
    wtkhname: '敦豪全球货运（中国）有限公司成都分公司',
    fid: 3093,
    tempName: '敦豪全球货运',
    mainColumn: 'A',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'B': {
        field: 'hawb',
        level: '2'
      },
      'C': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'D': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'E': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'F': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'G': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
      'H': {
        field: 'khjcno',
        level: '3'
      }
    }
  },
  {
    wtkhname: '全球国际货运代理(中国)有限公司成都分公司',
    fid: 3190,
    tempName: '全球国际货运代理',
    mainColumn: 'A',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'B': {
        field: 'hawb',
        level: '2'
      },
      'C': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'D': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'E': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'F': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'G': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
      'H': {
        field: 'khjcno',
        level: '3'
      }
    }
  },
  {
    wtkhname: '联邦快递国际货运代理服务（上海）有限公司成都分公司',
    fid: 3158,
    tempName: '联邦快递国际货运代理服务',
    mainColumn: 'A',
    defaultField: [
      {
        field: 'tradeterm',
        level: '2',
        defaultValue: 'CIF'
      }
    ],
    json: {
      'A': {
        field: 'mawb',
        level: '1',
        regexp: '^\\d{3}-\\d{8}$',
        merge: true,
        require: true
      },
      'B': {
        field: 'hawb',
        level: '2'
      },
      'C': {
        field: 'mdg,mdg',
        level: '1,2'
      },
      'D': {
        field: 'ybpiece,piece',
        level: '2,3'
      },
      'E': {
        field: 'ybweight,weight',
        level: '2,3'
      },
      'F': {
        field: 'ybvolume,volume',
        level: '2,3'
      },
      'G': {
        field: 'hbh,hbrq',
        level: '1,1',
        split: '/',
        formatFn: `function(val, rules, data){let arr = val.split(rules.split);data['hbh'] = arr[0];data['hbrq'] = new Date(new Date().getFullYear()+' '+arr[1]).toLocaleDateString().replace(\/\\/\/g,'-');}`
      },
      'H': {
        field: 'khjcno',
        level: '3'
      }
    }
  }
]

/**
 * 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]
 * @param {Number} n - 需要转换的数字
 * @returns {String} 转换后的字符，对应Excel的列
 */
function getCharCol(n) {
  if (n == 0) return 'A'
  let temCol = '',
  s = '',
  m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}

/**
 * 将合并的单元格拆分
 * refer: https://www.jianshu.com/p/5c131c27841c
 * @param {Object} Sheets - 通过XLSX解析后的数据
 * @returns {Object} 将合并的单元格拆分后的数据
 */
function resolveMerged(Sheets) {
  let newSheets = JSON.parse(JSON.stringify(Sheets))
  if (!newSheets['!merges']) return newSheets
  console.log(newSheets)
 
  let merges = newSheets['!merges']
   console.log(merges)
  delete newSheets['!merges']

  for (let merge of merges) {
    let mergedKey = []

    for (let i=0; i <= (merge.e.c-merge.s.c); i++) {
      for (let j=0; j <= (merge.e.r-merge.s.r); j++) {
        mergedKey.push( getCharCol(merge.s.c+i) + (merge.s.r+j+1) )
      }
    }

    mergedKey.forEach(key => {
      newSheets[key] = newSheets[mergedKey[0]]
    })
  }
  return newSheets
}

/**
 * 生成Excel首行数据
 * 当Excel首行的单元格为空时XLSX解析Excel为JSON会丢失数据，手动填充首行数据可解决
 * refer: https://github.com/SheetJS/js-xlsx#common-spreadsheet-format
 * @param {Object} Sheets - 通过XLSX解析后的数据
 */
function generateFirstRow(Sheets) {
  // 开始和结束列
  let ref = Sheets['!ref'].match(/([A-Z])+/g)
  let colStart = Sheets['!ref'].split(':')[0].match(/([0-9])+/g)

  let colIndex = 0
  let colKey = getCharCol(colIndex)

  while(colKey != ref[1]) {
    Sheets[colKey + colStart] = {
      t: 's',
      v: colKey
    }

    colKey = getCharCol(++colIndex)
  }

  Sheets[colKey + '1'] = {
    t: 's',
    v: colKey
  }
}

/**
 * 加法运算，处理边际条件
 * 为空、undefined、null、NaN、false等值时做 0 处理
 * @returns {Number} 运算结果
 */
function addition(...param) {
  let result = param.reduce((prev, val) => {
    if (val) {
      val = parseFloat(val)
      if (val) {
        prev += val
      }
    }
    return prev
  }, 0)
  return result
}


import tempConfig from '@/components/templates/tempConfig'
// import mawbRevSed from "./mawbRevSed"
// import mawbAddNew from "../orderDetails/mawbAddNew"
import customerRel from '@/components/templates/customerRel'
import serviceList from '@/components/orderDetails/serviceList'

export default {
  components: {
    tempConfig,
    // mawbRevSed,
    // mawbAddNew,
    // 因为循环引用的问题，在mawbImport导入mawbAddNew时，mawbAddNew的export还未初始化完毕，返回的将是undefined，所以需要异步引用组件
    mawbAddNew: resolve => require(['@/components/orderDetails/mawbAddNew'], resolve),
    customerRel,
    serviceList
  },
  props: {
    // mawbImportVisible: {
    //   required: true,
    //   type: Boolean
    // }
    area:{
      required:true,
      type:String
    },
    fid:{
      type:[Number,String],
      default:''
    },
    gid: {
      type: [Number, String],
      default: ''
    },
    customer: {
      type: Array,
    },
    orderdom:String,
  },
  data () {
    return {
      mawbAddVisible: false,
      // mawbAddTopTabsVisible: false,

      // 更换成查询列表样式时需要改成计算属性
      importDialogVisible: false,
      mawbBatchResultVisible: false,

      tabsActiveName: 'completeOrder',

      lzdDialogVisible: false,
      lzdUrl: '',

      // inputViewData: [
      //   {title:"委托客户：",id:"fid",type:11,model:"",defaultModel:"",width: '49',itemStyle:{width: '100%'},required:true},
      //   {title:"项目：",id:"gid",type:10,model:"",defaultModel:"",width: '48',itemStyle:{width: '100%'},required:true,showCustomerRel:true},
      //   // {title:"模板：",id:"curTempIndex",type:4,model:"",defaultModel:"",width: '49',itemStyle:{width: '100%'},required:true,options: []},
      //   {title:"配舱操作：",id:"czlx",type:3,model:"",defaultModel:"唯凯配舱",options:[],width: '49',itemStyle:{width: '100%'},groupid:'132',disabled: true},
      //   {title:"航班月份：",id:"hbyf",type: 6,datetype:'month',model:"",defaultModel:"",width: '48',itemStyle:{width: '100%'},format:"yyyy-MM",placeholder: '可选择此次导入统一的要求航班月份,非必填'},
      // ],
      inputViewData: {

        fid: {
          title: "委托客户：",
          type: 11,
          required: true,
          itemStyle: { width: "660px" },
          contentStyle: { display: "flex" },
          linkage: "gid",
          disabled: this.isMawbImport,
          
        },
        gid: {
          title: "项目：",
          type: 10,
          required: true,
          itemStyle: { width: "660px" },
          contentStyle: { display: "flex" },
          disabled: this.isMawbImport,
          showCustomerRel: true,
        },
        czlx: {
          title: "配舱操作：",
          type: 3,
          options:[{label:'唯凯配舱',value:'自货'},{label:'唯凯代操作',value:'代操作'}],
          itemStyle: { width: "330px" },
          disabled: true
        },
        sfg: {
            title: "始发港：",
            type: 20,
            itemStyle: { width: "330px" },
            pagetype: 6,
        },
        hbyf: {
          title: '航班月份：',
          type: 6,
          itemStyle:{width: '660px'},
          width: '48',
          datetype:'month',
          placeholder: '可选择此次导入统一的要求航班月份,非必填',
        }
      },
      inputModelData:{
        curTempIndex: '',
        czlx: '自货',
        fid:'',
        gid:'',
        orderdom:'',
        sfg: '',
      },
      customerRelList: [],

      importTempAll: [],  // 选中的委托客户下的所有模板
      tempSelectOption: [],
      selectedFile: {},
      SheetNames: [],
      selectedSheet: '',

      // 已完善订单
      completeOrder: [],
      // 未完善订单
      incompleteOrder: [],
      // 重复订单
      repeatOrder: [],

      activeOrderIndex: 0,

      // 已选择的已完善订单
      selectedCompleteOrder: [],
      // 已选择的未完善订单
      selectedIncompleteOrder: [],
      // 已选择的重复订单
      selectedRepeatOrder: [],

      currentPage: 1,

      newService: {},

      // 已完善、未完善、重复订单的result数据
      completeOrderResult: [],
      incompleteOrderResult: [],
      repeatOrderResult: [],

      batterymodelOptions: []
    }
  },
  created() {
    const groupData = JSON.parse(localStorage.getItem('groupType'))
    let ready02 = ''
    groupData.forEach(i => {
      if (i.groupid == 109 && i.typename == '锂电池') {
        ready02 = i.id
      }
    })
    groupData.forEach(i => {
      if( (i.ready02 == ready02) && (i.groupid==114) ) {
        this.batterymodelOptions.push(i.typename)
      }
    })
    if(!this.projectIsWecan){//恒丰的德迅
      mawbImportTemplate=[
          {
            wtkhname: '德迅（中国）货运代理有限公司',
            fid: 1,
            tempName: '德迅-EU',
            mainColumn: 'B',
            defaultField: [
              {
                field: 'czlx',
                level: '1',
                defaultValue: '代操作'
              },
              {
                field: 'tradeterm',
                level: '2',
                defaultValue: 'CIF'
              }
            ],
            json: {
              'A': {
                field: 'mdg',
                level: '1',
                regexp: '^[A-Z]{3}$',
                matchRegexp: '^([A-Z]{3})',
                second: {
                  field: 'hbh,hbrq',
                  level: '1',
                  regexp: '[/]'
                }
              },
              'B': {
                field: 'mdg',
                level: '2',
                regexp: '^[A-Z]{3}$',
                matchRegexp: '^([A-Z]{3})',
                require: true
              },
              'C': {
                field: 'companytitle_shr_hawb',
                level: '2'
              },
              'D': {
                field: 'hawb,khjcno',
                level: '2,3'
              },
              'E': {
                field: 'mawb',
                level: '1',
                regexp: '^\\d{3}-\\d{8}$',
                merge: true,
                mergeVerify: {  // 合并验证，向下查找A列，满足合并条件时做合并处理，不满足时做一条订单处理
                  col: 'A',
                  merge: 'CONSOL',
                  nomerge: 'SINGLE'
                }
              },
              'F': {
                field: 'ybpiece,piece',
                level: '2,3'
              },
              'G': {
                field: 'ybweight,weight',
                level: '2,3'
              },
              'H': {
                field: 'ybvolume,volume',
                level: '2,3'
              },
              'I': {
                field: 'longs,widths,heights,piece',
                level: '4,4,4,4',
                split: '+'
              },
              'R': {
                field: 'batterymodel',
                level: '2',
                matchContent: 'PI967,PI970'
              }
            }
          }
      ]
    }


  },
  computed: {
    mawbImportTemplateAll() {
      return this.$store.getters.mawbImportTemplateAll.map(temp => {
        let jsondata = JSON.parse(temp.jsondata)
        jsondata.id = temp.id
        return jsondata
      })

      // 调试时使用代码里的模板，上线后使用store里保存的模板
      // return mawbImportTemplate
    },
    // importDialogVisible: {
    //   get() {
    //     return this.mawbImportVisible
    //   },
    //   set(val) {
    //     this.$emit('update:mawbImportVisible', val)
    //   }
    // },
    curTemp() {
      return this.importTempAll[this.inputModelData.curTempIndex]
    },
    // 当前显示订单
    orderData: {
      get() {
        return this[this.tabsActiveName]
      },
      set(val) {
        this[this.tabsActiveName] = val
      }
    },
    orderPageData() {
      return this.orderData.slice(20*(this.currentPage-1), 20*this.currentPage)
    },
    selectedOrderIndex: {
      get() {
        let key = 'selected'
        key += this.tabsActiveName.substr(0,1).toUpperCase() + this.tabsActiveName.substr(1)
        // selectedCompleteOrder  selectedIncompleteOrder  selectedRepeatOrder
        return this[key]
      },
      set(val) {
        let key = 'selected'
        key += this.tabsActiveName.substr(0,1).toUpperCase() + this.tabsActiveName.substr(1)
        this[key] = val
      }
    },
    postResult: {
      get() {
        let key = 'Result'
        key = this.tabsActiveName + key
        return this[key]
      },
      set(val) {
        let key = 'Result'
        key = this.tabsActiveName + key
        this[key] = val
      }
    },

    serviceList: {
      get() {
        var serviceList = [];
        for (let i in this.newService) {
          let item = this.newService[i];
          serviceList.push({
            servicecode: item.servicecode,
            oprequest: item.oprequest,
            isdel: item.model ? 1 : 2
          });
        }
        return serviceList;
      },
      set(val) {
        val.forEach(item => {
          this.newService[item.servicecode].model =
            item.isdel == 1 ? true : false;
          this.newService[item.servicecode].oprequest = item.oprequest;
        });
      }
    },
    postResultTableData() {
      const { postResult } = this
      let tableData = []
      for (let index in postResult) {
        let resultmessage = ''
        if (postResult[index].resultstatus == 0) {
          resultmessage = `订单创建成功，订舱编号为 ${postResult[index].resultno}`
        } else {
          resultmessage = postResult[index].resultmessage || '订单创建失败'
        }

        if (index % 2 == 0) {
          tableData.push({
            resultid1: postResult[index].resultid,
            resultmessage1: resultmessage,
            resultstatus1: postResult[index].resultstatus
          })
        } else if (index % 2 == 1) {
          tableData[tableData.length-1].resultid2 = postResult[index].resultid
          tableData[tableData.length-1].resultmessage2 = resultmessage
          tableData[tableData.length-1].resultstatus2 = postResult[index].resultstatus
        }
      }
      return tableData
    },
    selectAllValidMawb: {
      get() {
        if (this.selectedOrderIndex.length === 0) return false

        return this.selectedOrderIndex.length === this.orderData.length

        // let validIndexArr = []
        // this.orderData.forEach((order, index) => {
        //   if (!order.hasRequiredInfo) validIndexArr.push(index)
        // })
        // return (
        //   this.selectedOrderIndex.length === validIndexArr.length &&
        //   this.selectedOrderIndex.every(index => validIndexArr.includes(index))
        // )
      },
      set(val) {
        if (val) {
          // this.orderData.forEach((order, index) => {
          //   if (!order.hasRequiredInfo && !this.selectedOrderIndex.includes(index)) {
          //     this.selectedOrderIndex.push(index)
          //   }
          // })
          this.orderData.forEach((order, index) => {
            if (!this.selectedOrderIndex.includes(index)) {
              this.selectedOrderIndex.push(index)
            }
          })

        } else {
          this.selectedOrderIndex = []
        }
      }
    },
    resultMessage() {
      return this.postResult.reduce((p, v) => {
        if (v.resultstatus != 0) {
          p[v.resultid] = v.resultmessage
        }
        return p
      }, {})
    },
    disableLzdBtn() {
      for (let result of this.postResult) {
        // 有订单新增成功时不禁用
        if (result.resultstatus == 0) return false
      }
      return true
    }
  },
  watch: {
    importDialogVisible(newVal) {
      if (newVal &&  !this.area  ) {
        this.importDialogVisible = false
        return this.$message.error("请选择区域！")
      }

      // 重置页面
      if (newVal === true) {
        // this.mawbAddTopTabsVisible = false
        this.selectedFile = {}
        this.SheetNames = []
        this.selectedSheet = ''
        this.activeOrderIndex = 0
        this.selectedOrderIndex = []
        this.currentPage = 1
        this.tabsActiveName = 'completeOrder'
        this.completeOrder = []
        this.incompleteOrder = []
        this.repeatOrder = []
        this.postResult = []
        this.newService = {}

        Object.keys(this.inputModelData).forEach(key => {
          if (key === 'czlx') {
            this.inputModelData[key] = '自货'
          } else {
            this.inputModelData[key] = ''
          }
        })
      }
    },
    tabsActiveName() {
      if (this.activeOrderIndex == 0) {
        this.$nextTick(() => {
          this.$refs.mawbAddNew && this.$refs.mawbAddNew.initDataFunc()
        })
      } else {
        this.activeOrderIndex = 0
      }
    },
    'inputModelData.fid'(newVal) {
      if (!newVal) {
        this.importTempAll = []
        this.tempSelectOption = []
        this.inputModelData.curTempIndex = ''
      } else {
        this.importTempAll = this.mawbImportTemplateAll.filter(temp => {
          if (temp.wtkhname === 'ALL') return true
          return temp.fid == newVal
        })
        this.tempSelectOption = this.importTempAll.map((item, index) => ({value: String(index), label: item.tempName}))

      }

      if(newVal){
        this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubCredit', params:{fid:newVal},loading:false,tip:false}).then(results=>{
          if(results.data.resultstatus!=0){
            this.$confirm(results.data.resultmessage, '提示', {
              confirmButtonText: '确定',
              showCancelButton:false,
              showClose:false,
              closeOnClickModal:false,
              type: 'warning'
            }).then(() => {
              if(results.data.resultstatus == 1){
                this.inputModelData.fid=""
              }
              if(results.data.resultmessage.indexOf('临时客户')>=0){
                getxmdata('wtxmNoname').forEach(i=>{
                  if(i.usr_name==localStorage.usrname){
                    this.inputModelData.gid=i.id
                  }
                })
              }
            })
          }
        })
      }
    },
    mawbAddVisible(newVal) {
      if (!newVal) {
        // 清空数据
        this.completeOrder = []
        this.incompleteOrder = []
        this.repeatOrder = []

        this.selectedCompleteOrder = []
        this.selectedIncompleteOrder = []
        this.selectedRepeatOrder = []

        this.completeOrderResult = []
        this.incompleteOrderResult = []
        this.repeatOrderResult = []
        return
      }

      setTimeout(() => {
        this.$refs.mawbAddNew && this.$refs.mawbAddNew.initDataFunc()
      }, 0)
    },
    // 切换订单时初始化新增页面的数据
    activeOrderIndex(nweVal, oldVal) {
      this.$nextTick(() => {
        this.$refs.mawbAddNew && this.$refs.mawbAddNew.initDataFunc()
      })
    },
    'newService.OA0010.model'(val) {
      this.inputModelData.czlx = val ? '自货' : '代操作'
    }
  },
  methods: {
    setFid(){
      this.$nextTick(()=>{
        
          this.$set(this.inputModelData, 'fid', this.fid)
          this.$set(this.inputModelData, 'gid', this.gid)
          if (!this.area.includes('海外部') && !this.area.includes('市场部'))  {
              let areaGroupType = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53)
                  areaGroupType.forEach(i => {
                if (i.typename == this.area) {
                  this.$set(this.inputModelData, 'sfg', i.ready06)
                }
              })
          }
          
          
          this.customerRelList = this.customer; // 获取本票客户联系人
          // this.$set(this.inputModelData, 'orderdom', this.orderdom)
      })
  
    }, 
    checkUploadFileRequireInfo(ev) {
      let message = null
      if (!this.inputModelData.fid || !this.inputModelData.gid) message = '请选择委托客户和项目'
      if (!this.curTemp) message = '请选择模板'
      // if (this.customerRelList.length === 0) message = '请选择本票客户客服联系人'

      if (message !== null) {
        ev.stopPropagation()
        this.$message.error(message)
      }
    },
    /**
     * 解析以 '航班号/航班日期' 为格式的单元格
     * 例：CA100/02 => { hbrq: 'yyyy-mm-02', hbh: 'CA100' }
     */
    resolveHbhHbrq(str) {
      let result = {},
          years = new Date().getFullYear(),
          month = new Date().getMonth() + 1

      let strArr = str.split('/')
      result.hbh = strArr[0]

      if (strArr[1]) {
        // hbrq只匹配数字，因为有些模板日期后面可能会带一些字母，  比如： "CA100/02 ABC"
        strArr[1] = strArr[1].match(/^\d+/)[0]
        result.hbrq = `${years}-${String(month).padStart(2, '0')}-${strArr[1].padStart(2, '0')}`
      } else {
        let days = new Date().getDate()
        result.hbrq = `${years}-${String(month).padStart(2, '0')}-${String(days).padStart(2, '0')}`
      }
      return result
    },
    // 导入Excel
    selectFile({ file }) {
      if (!file) return

      let fileX = file.name.split(".").reverse()[0]
      let fileXyes = false
      ;["xlsx", "xlc", "xlm", "xlsm", "xls", "xlt", "xlw"].forEach(function (value) {
        if (fileX === value) {
          fileXyes = true
        }
      })
      if (fileXyes) {
        this.selectedFile = file
      } else {
        this.$message.error('格式错误！请重新选择')
      }

      setTimeout(() => {
        this.analyzeFile()
      }, 100)
    },
    // 解析Excel数据
    analyzeFile() {
      file2Xce(this.selectedFile)
      .then(({ SheetNames, Sheets }) => {
        this.SheetNames = SheetNames
        this.selectedSheet = SheetNames[0]
        this.Sheets = Sheets
      })

      function file2Xce(f) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          var wb //读取完成的数据　
          var rABS = false

          reader.onload = function (e) {
            var data = e.target.result
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(data)), { //手动转化
                type: 'base64'
              })
            } else {
              wb = XLSX.read(data, {
                type: 'binary'
              })
            }

            resolve(wb)
          }

          if (rABS) {
            reader.readAsArrayBuffer(f)
          } else {
            reader.readAsBinaryString(f)
          }
        })
      }

      function fixdata(data) { //文件流转BinaryString
        var o = "",
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      }
    },
    // 解析选择的Sheet数据
    analyzeSheet() {
      let hasService = false
      for (let service of Object.values(this.newService)) {
        if (service.model === true) {
          hasService = true
          break
        }
      }
      if (!hasService) {
        return this.$message.error('请至少选择一个服务')
      }

      let newSheets = resolveMerged(this.Sheets[this.selectedSheet])
      generateFirstRow(newSheets)

      let json = XLSX.utils.sheet_to_json(newSheets)

      this.resolveOrder(json, newSheets)

      this.Sheets = null
    },
    /**
     * 将Excel数据解析成订单数据
     * @param {Object} xlsxJsonData - 经过XLSX解析成json后的数据
     * @param {Object} raw - XLSX解析出来的原始数据
     */
    resolveOrder(xlsxJsonData, raw) {
      console.log(xlsxJsonData)
      console.log(raw)
      const vm = this
      const { curTemp } = vm
      const { mainColumn } = curTemp

      let resolveDataAll = []
      // excel列的key  [A ~ Z]
      let colKeys = Object.keys(curTemp.json)
      console.log(curTemp)
      console.log(colKeys)
      // console.log(this)
      // console.log(curTemp)
      // console.log(mainColumn)
      outter:
      for (let jsonIndex in xlsxJsonData) {
        // 主列没数据时直接跳过此行
        
        if (!xlsxJsonData[jsonIndex][mainColumn]) continue
        
        // 解析的数据保存到rowData
        let rowData = {hawbList: [], ybstoreList: []}
        // 是否将此行数据和上一行数据作为同一个订单
        let isMerged = false

        try {
          for (let col of colKeys) {
            let rules = curTemp.json[col]
            let field = rules.field.split(',')
            let level = rules.level.split(',')
            let val = xlsxJsonData[jsonIndex][col] ? String(xlsxJsonData[jsonIndex][col]).trim() : ''

            // 德迅模板
            if ((this.projectIsWecan&&curTemp.fid == 1719)||(!this.projectIsWecan&&curTemp.fid == 1)) {
              // 尺寸层解析规则
              if (rules.level.includes('4')) {
                if (!rowData.ybstoreList[0]) rowData.ybstoreList[0] = { ybstorevolumeList: [] }
                if (!val) continue

                // 中文
                if (/货物尺寸.+包装种类/.test(val)) {
                  val = val.split('\n')

                  val.forEach(item => {
                    let volume = {}
                    let matchResult = item.match(/货物尺寸:(\S+)=.+包装种类:(\S+)/)

                    let arr = matchResult[1].split('*')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index]
                    })
                    volume['packagetypename'] = matchResult[2]
  
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes(';')) {
                  val = val.split(';')
                  val.forEach(item => {
                    let volume = {}
                    let arr = item.split('*')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })

                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes(' ')) {
                  val = val.split(/\s+/)
                  val.forEach(item => {
                    if (!item) return
                    let volume = {}
                    item = item.match(/([\d.*\/]+)=?/)[1]
                    let arr = item.split('*')
                    if (arr[2].includes('/')) {
                      [arr[2], arr[3]] = arr[2].split('/')
                    }
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })

                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes('x')) {
                  val = val.split(rules.split)
                  val.forEach(item => {
                    let volume = {}
                    let arr = item.split('x')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes('X')) {
                  val = val.split(rules.split)
                  val.forEach(item => {
                    let volume = {}
                    let arr = item.split('X')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes(',')) {
                  val = val.split(',')
                  val.forEach(item => {
                    if (!item) return
                    let volume = {}
                    item = item.match(/([\d.*\/]+)=?/)[1]
                    let arr = item.split('*')
                    if (arr[2].includes('/')) {
                      [arr[2], arr[3]] = arr[2].split('/')
                    }

                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else if (val.includes('/')) {
                  val = val.split('/')
                  val.forEach(item => {
                    let volume = {}
                    let arr = item.split('*')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                } else {
                  val = val.split(rules.split)
                  val.forEach(item => {
                    let volume = {}
                    item = item.match(/([\d.*\/]+)=?/)[1]
                    let arr = item.split('*')
                    field.forEach((fielditem, index) => {
                      volume[fielditem] = arr[index] || '1'
                    })
                    rowData.ybstoreList[0].ybstorevolumeList.push(volume)
                  })
                }

                continue
              }

              // 航班号航班日期解析规则
              if (rules.second) {
                const second = rules.second
                function getHbhAndHbrq(index) {
                  let info = {},
                      reg = new RegExp(second.regexp)

                  while (index-- > 0) {
                    if (reg.test(xlsxJsonData[index][col]) === true) {
                      info = vm.resolveHbhHbrq(xlsxJsonData[index][col])
                      let hbrqArr = info.hbrq.split('-')
                      // 日期小于3号时跳到下一月
                      if (Number(hbrqArr[2]) <= 3) {
                        hbrqArr[1]++
                        if (hbrqArr[1] == 13) {
                          hbrqArr[0]++
                          hbrqArr[1] = 1
                        }
                      }
                      info.hbrq = hbrqArr.join('-')
                      break
                    }
                  }
                  return info
                }

                let hbInfo = getHbhAndHbrq(jsonIndex)
                second.field.split(',').forEach(field => {
                  rowData[field] = hbInfo[field] || ''
                })
              }

            }

            // 德迅模板的总单合并验证
            // 有mergeVerify时规则特殊，单独做处理
            if (rules.merge === true && rules.mergeVerify) {
              /**
               * 向下验证是否需要合并
               * @param {Number} index
               * @returns {String} 如果需要合并，则返回对应的单元格的值，否则返回空字符串
               */
              function verifyFn(index) {
                while (index++ < xlsxJsonData.length-1) {

                  let verifyKey = rules.mergeVerify.col
                  let verifyValue = xlsxJsonData[index][verifyKey]

                  if (verifyValue) {
                    if (verifyValue.includes(rules.mergeVerify.merge)) {
                      return xlsxJsonData[index][col]
                    } else if (verifyValue.includes(rules.mergeVerify.nomerge)) {
                      return xlsxJsonData[index][col]
                    }
                  }
                }
                return ''
              }

              let findValue = verifyFn(jsonIndex).trim()
              if (findValue) {
                rowData[rules.field] = findValue || val
                let lastData = resolveDataAll[resolveDataAll.length-1] || {}
                if (lastData[rules.field] == findValue) isMerged = true
              } else {
                rowData[rules.field] = val
              }
              continue
            }

            // 邮申模板里，V列为2的是分单，需要把分单合并在一起
            if (curTemp.fid === 1513) {
              if (xlsxJsonData[jsonIndex]['V'] == '2' && xlsxJsonData[jsonIndex - 1]['V'] == '2') {
                isMerged = true
              }
            }

            // 通用解析规则
            // 无数据时的处理
            if (!val) {
              // 当无值时如果需要查找值则先进行查找
              if (rules.valfind) {
                let index = Number(jsonIndex)

                if (rules.valfind.direction == 'down') {
                  while (index < xlsxJsonData.length) {
                    let key = rules.valfind.col
                    let findval = xlsxJsonData[index][key]
                    if (findval) {
                      val = findval
                      break
                    }
                    if (curTemp.fid === 1513 && xlsxJsonData[index]['V'] == '1') {
                      // 邮申模板，遇到总运单之后就不再继续查找，直接跳出
                      break
                    }
                    index++
                  }
                } else if (rules.valfind.direction == 'up') {
                  while (index >= 0) {
                    let key = rules.valfind.col
                    let findval = xlsxJsonData[index][key]
                    if (findval) {
                      val = findval
                      break
                    }
                    index--
                  }
                }

              }
              // 如果查找后也无值并且为必填项时，直接跳过此行订单数据，否则只跳过此单元格数据
              if (!val) {
                if (rules.require) {
                  continue outter
                } else {
                  continue
                }
              }
            }

            if (rules.regexp && new RegExp(rules.regexp).test(val) === false) {
              if (rules.matchRegexp) {
                let matchResult = val.match(new RegExp(rules.matchRegexp))
                if (matchResult && matchResult[1]) {
                  val = matchResult[1]
                } else {
                  if (rules.require) {
                    continue outter
                  } else {
                    continue
                  }
                }
              } else {
                if (rules.require) {
                  continue outter
                } else {
                  continue
                }
              }
            }

            // 锂电池型号匹配
            if (rules.field.includes('batterymodel')) {
              let matchTypeArr = val.match(/[0-9]+/g)
              if (!matchTypeArr) continue
              let hwlx = '普货'
              let batterymodel = []

              matchTypeArr.forEach(item => {
                vm.batterymodelOptions.forEach(model => {
                  if (model.includes(item) && !batterymodel.includes(model)) {
                    batterymodel.push(model)
                  }
                })
              })
              if (batterymodel.length !== 0) {
                hwlx = '普货,锂电池'
              }

              if (rules.level == '1') {
                if (rowData.hwlx) {
                  rowData.hwlx = hwlx + ',' + rowData.hwlx
                } else {
                  rowData.hwlx = hwlx
                }
                // 去重
                rowData.hwlx = [...new Set(rowData.hwlx.split(','))].join(',')
                rowData.batterymodel = batterymodel.join(',')
              } else if (rules.level == '2') {
                if (!rowData.hawbList[0]) rowData.hawbList[0] = {}
                rowData.hawbList[0].hwlx = hwlx
                rowData.hawbList[0].batterymodel = batterymodel.join(',')
              }

              continue
            }

            // 某些列的数据格式特殊，无法统一，直接使用模板中的指定函数进行解析赋值
            if (rules.formatFn) {
              console.log(rules.formatFn)
              // 提取函数体
              let fnReg = /^[\s]*function[\s]*\([\s]*val[\s]*,[\s]*rules[\s]*,[\s]*data[\s]*\)[\s]*{([\S\s]+)}[\s]*$/
              //console.log(fnReg)
              let fn = new Function('val', 'rules', 'data', rules.formatFn.match(fnReg)[1])
              //console.log(fn)
              console.log(11111)
              // 执行
              fn.call(vm, val, rules, rowData)
              console.log(22222)
              //console.log(val)
              //console.log(rules)
              //console.log(rowData)
              continue
            }

            // 将field和val一一对应赋值
            if (rules.split) {
              val = val.trim().split(rules.split)
            } else {
              val = new Array(field.length).fill(val.trim())
            }

            // 尺寸层数据格式特殊，单独做处理
            if (level[0] == '4') {
              if (!rowData.ybstoreList[0]) rowData.ybstoreList[0] = { ybstorevolumeList: [] }

              val.forEach(item => {
                let volume = {}
                let arr = item.split(rules.fieldSplit || '*')
                field.forEach((fielditem, index) => {
                  if (fielditem === 'packagetypename') {
                    volume[fielditem] = arr[index] || ''
                  } else {
                    volume[fielditem] = arr[index] || '1'
                  }
                })
                rowData.ybstoreList[0].ybstorevolumeList.push(volume)
              })
            } else {
              for (let fieldIndex in field) {
                if (level[fieldIndex] == '1') {
                  rowData[field[fieldIndex]] = val[fieldIndex]
                }
                if (level[fieldIndex] == '2') {
                  if (!rowData.hawbList[0]) rowData.hawbList[0] = {}
                  rowData.hawbList[0][field[fieldIndex]] = val[fieldIndex]
                }
                if (level[fieldIndex] == '3') {
                  if (!rowData.ybstoreList[0]) rowData.ybstoreList[0] = { ybstorevolumeList: [] }
                  rowData.ybstoreList[0][field[fieldIndex]] = val[fieldIndex]
                }
              }
            }
            //console.log(curTemp.wtkhname,123)
            // 根据规则，如果此行的field数据和上一行的相同时，将这两行数据作为同一订单
            if (rules.merge && resolveDataAll.length !== 0) {
              let lastData = resolveDataAll[resolveDataAll.length-1] || {}
              if (lastData[field[0]] == val[0]) isMerged = true
            }
          }
        } catch (error) {
          //alert('1')
          console.log(333)
          // 解析数据出错时跳过此行数据
          console.error(error)
          continue
        }


        console.log(rowData)

        // 处理缺失的数据
        // 当进仓编号没有体积时，使用尺寸数据计算体积
        if (rowData.ybstoreList[0] && !rowData.ybstoreList[0].volume && rowData.ybstoreList[0].ybstorevolumeList.length !== 0) {
          rowData.ybstoreList[0].volume = rowData.ybstoreList[0].ybstorevolumeList.reduce((prev, val) => {
            prev += val.longs * val.widths * val.heights * val.piece / 1000000
            return prev
          }, 0).toFixed(3)
        }
        if (rowData.hawbList[0] && !rowData.hawbList[0].ybvolume && rowData.ybstoreList[0].volume) {
          rowData.hawbList[0].ybvolume = rowData.ybstoreList[0].volume
        }

        if (rowData.orderdom && rowData.orderdom === '直单') {
          // 直单时把分单清空
          if (rowData.hawbList.length !== 0) {
            rowData.ybstoreList = rowData.ybstoreList.concat(rowData.hawbList[0].ybstoreList || [])
            rowData.hawbList = []
          }
        } else {
          // 有分单时将货物层的数据放到分单层
          if (rowData.hawbList.length !== 0 && rowData.ybstoreList.length !== 0) {
            rowData.hawbList[0].ybstoreList = rowData.ybstoreList.filter(store => store.khjcno)
            rowData.ybstoreList = []
          }
        }
        // 过滤掉分单号和进仓编号为空的数据
        rowData.hawbList = rowData.hawbList.filter(hawb => hawb.hawb)
        rowData.ybstoreList = rowData.ybstoreList.filter(store => store.khjcno)

        // 总单的货物类型和锂电池型号为分单货物类型和锂电池型号的汇总
        let hawbHwlxArr = [],
            hawbBatterymodelArr = []
        rowData.hawbList.forEach(hawb => {
          if (hawb.hwlx) {
            let hwlxArr = hawb.hwlx.split(',')
            for (let hwlx of hwlxArr) {
              if (hwlx && !hawbHwlxArr.includes(hwlx)) {
                hawbHwlxArr.push(hwlx)
              }
            }
          }
          if (hawb.batterymodel) {
            let batterymodelArr = hawb.batterymodel.split(',')
            for (let batterymodel of batterymodelArr) {
              if (batterymodel && !hawbBatterymodelArr.includes(batterymodel)) {
                hawbBatterymodelArr.push(batterymodel)
              }
            }
          }
        })

        if (rowData.hwlx) {
          hawbHwlxArr = hawbHwlxArr.concat(rowData.hwlx.split(','))
        }
        // 去重
        rowData.hwlx = [...new Set(hawbHwlxArr)].join(',')
        rowData.batterymodel = rowData.batterymodel || hawbBatterymodelArr.join(',')

        // 当导入时选择了航班月份时，优先使用选择的年月
        if (vm.inputModelData.hbyf) {
          if (rowData.hbrq) {
            let [years, month, day] = rowData.hbrq.split('-')
            ;[years, month] = vm.inputModelData.hbyf.split('-')

            rowData.hbrq = years + '-' + month + '-' + day
          } else {
            rowData.hbrq = vm.inputModelData.hbyf + '-' + new Date().getDate()
          }
        }

         // 当导入时选择了始发港，优先使用

          rowData.sfg = vm.inputModelData.sfg


        // 同上一条数据合并
        if (
          isMerged && resolveDataAll.length !== 0 &&
          (rowData.orderdom ? resolveDataAll[resolveDataAll.length - 1].orderdom === rowData.orderdom : true)
        ) {

          let lastData = resolveDataAll.pop() || {},
              hawbList = lastData.hawbList || [],
              lastHawb = hawbList[hawbList.length - 1],
              ybstoreList = lastData.ybstoreList || []

          // 如果分单号和上一条相等，则进行合并操作
          if (lastHawb && lastHawb.hawb === rowData.hawbList[0].hawb) {
            Object.keys(rowData.hawbList[0]).forEach(key => {
              if (key === 'ybstoreList') {
                // 进仓编号相同时也进行合并
                let lastStoreList = lastHawb.ybstoreList[lastHawb.ybstoreList.length - 1]
                if (lastStoreList && lastStoreList.khjcno === rowData.hawbList[0].ybstoreList[0].khjcno) {

                  lastStoreList.piece = addition(rowData.hawbList[0].ybstoreList[0].piece, lastStoreList.piece) || ''
                  lastStoreList.weight = addition(rowData.hawbList[0].ybstoreList[0].weight, lastStoreList.weight).toFixed(2) || ''
                  lastStoreList.volume = addition(rowData.hawbList[0].ybstoreList[0].volume, lastStoreList.volume).toFixed(3) || ''
                  lastStoreList.ybstorevolumeList = rowData.hawbList[0].ybstoreList[0].ybstorevolumeList.concat(lastStoreList.ybstorevolumeList)

                } else {
                  lastHawb.ybstoreList = rowData.hawbList[0].ybstoreList.concat(lastHawb.ybstoreList)
                }
              } else if (key === 'ybpiece' || key === 'ybweight' || key === 'ybvolume' || key === 'smallpiece') {
                lastHawb[key] = addition(rowData.hawbList[0][key], lastHawb[key]) || ''
                if (key === 'ybweight') {
                  lastHawb[key] = lastHawb[key].toFixed(2)
                }
                if (key === 'ybvolume') {
                  lastHawb[key] = lastHawb[key].toFixed(3)
                }
              } else {
                lastHawb[key] = rowData.hawbList[0][key]
              }
            })
          } else {
            hawbList = hawbList.concat(rowData.hawbList).filter(hawb => hawb.hawb)
          }
          ybstoreList = ybstoreList.concat(rowData.ybstoreList).filter(store => store.khjcno)

          // 货物类型和锂电池型号要合并  不能覆盖
          let rowDataHwlx = rowData.hwlx.split(','),
              lastDataHwlx = lastData.hwlx.split(','),
              rowDataBty = rowData.batterymodel.split(','),
              lastDataBty = lastData.batterymodel.split(',')
          for (let hwlx of lastDataHwlx) {
            if (!rowDataHwlx.includes(hwlx)) rowDataHwlx.push(hwlx)
          }
          for (let bty of lastDataBty) {
            if (!rowDataBty.includes(bty)) rowDataBty.push(bty)
          }
          // 预报件重体如果解析了总单层没有的话，就删掉上一条的预报件重体，在下面的代码里重新从分单层求和
          if (!rowData.ybpiece) {
            delete lastData.ybpiece
          }
          if (!rowData.ybweight) {
            delete lastData.ybweight
          }
          if (!rowData.ybvolume) {
            delete lastData.ybvolume
          }
          if (!rowData.smallpiece) {
            delete lastData.smallpiece
          }
          rowData = {...lastData, ...rowData}
          // filter过滤掉空字符串
          rowData.hwlx = rowDataHwlx.filter(i => !!i).join(',')
          rowData.batterymodel = rowDataBty.filter(i => !!i).join(',')
          rowData.hawbList = hawbList
          rowData.ybstoreList = ybstoreList
        }

        // 处理模板默认字段
        if (curTemp.defaultField) {
          for (let rules of curTemp.defaultField) {
            if (rules.field === 'czlx') continue
            if (rules.level == '1' && !rowData[rules.field]) {
              rowData[rules.field] = rules.defaultValue
            }

            if (rules.level == '2' && rowData.hawbList.length !== 0) {
              for (let hawb of rowData.hawbList) {
                if (!hawb[rules.field]) {
                  hawb[rules.field] = rules.defaultValue
                }
              }
            }
          }
        }

        // 订单层的预报件重体为分单层的预报件重体之和

        let [ybpiece, ybweight, ybvolume, smallpiece] = rowData.hawbList.reduce((p, v) => {
          p[0] += parseFloat(v.ybpiece) || 0
          p[1] += parseFloat(v.ybweight) || 0
          p[2] += parseFloat(v.ybvolume) || 0
          p[3] += parseFloat(v.smallpiece) || 0
          return p
        }, [0,0,0,0])
          
        rowData.ybpiece = rowData.ybpiece || ybpiece || ''
        rowData.ybweight = rowData.ybweight || ybweight || ''
        rowData.ybvolume = rowData.ybvolume || ybvolume || ''
        rowData.ybweight = rowData.ybweight && parseFloat(rowData.ybweight).toFixed(2)
        rowData.ybvolume = rowData.ybvolume && parseFloat(rowData.ybvolume).toFixed(3)
        rowData.smallpiece = rowData.smallpiece || smallpiece || ''
        
         vm.setOrderDefaultField(rowData)

        resolveDataAll.push(rowData)

          // vm.setOrderDefaultField(rowData).then(({ data }) => {
          //   if (data.resultstatus === 0 && data.resultdic) {
          //     rowData.zddlcode = data.resultdic.zddlcode
          //     rowData.zddlzh = data.resultdic.zddlzh
          //     rowData.zdiatacode = data.resultdic.zdiatacode
          //   }

          //    if (this.checkHasRequiredInfo(rowData)) {
          //       rowData.hasRequiredInfo = true
          //     } else {
          //       delete rowData.hasRequiredInfo
          //     }
          //     console.log(rowData)
          //   resolveDataAll.push(rowData)
          //   console.log(resolveDataAll)
          // })


       

          
         
         
     
          
      }
      /* 解析完成 */
      setTimeout(()=>{
              if (curTemp.fid === 5559) {
        // 郑州FTN特殊处理
        // 分单层的重量取四舍五入后的值，总单层的重量取分单层原始重量的和再四舍五入。
        // 最后，如果分单层处理后的重量之和与总单层处理后的重量有误差，则将误差补齐到第一个分单上的重量上去
        // 进仓编号重量四舍五入
        // 尺寸进一

        resolveDataAll.forEach(mawb => {
          let previousHawbWeight = 0 // 原始分单重量之和
          let afterHawbWeight = 0  // 四舍五入后的分单重量之和

          mawb.hawbList.forEach(hawb => {
            previousHawbWeight = addition(hawb.ybweight, previousHawbWeight)
            // 分单重量四舍五入
            hawb.ybweight = String(Math.round(hawb.ybweight))
            afterHawbWeight = addition(hawb.ybweight, afterHawbWeight)

            // 进仓编号重量四舍五入
            hawb.ybstoreList.forEach(ybstore => {
              ybstore.weight = String(Math.round(ybstore.weight))
              // 尺寸进一
              ybstore.ybstorevolumeList.forEach(volumeitem => {
                Object.keys(volumeitem).forEach(key => {
                  volumeitem[key] = Math.ceil(volumeitem[key])
                })
              })
            })
          })

          mawb.ybweight = String(Math.round(previousHawbWeight))
          // 将误差补到第一个分单
          let deviation = mawb.ybweight - afterHawbWeight
          if (!Number.isNaN(deviation)) {
            mawb.hawbList[0].ybweight = addition(mawb.hawbList[0].ybweight, deviation)
            mawb.hawbList[0].ybweight = String(Math.round(mawb.hawbList[0].ybweight))
          }
        })
      }
      
      if (resolveDataAll.length == 0) {
        return vm.$message.error('无导入数据')
      }
      console.log(resolveDataAll)
      // 获取重复订单
      //console.log(curTemp.wtkhname)
      this.getRepeatOrder(resolveDataAll,curTemp)
      .then(exists => {
        console.log('exists: ', exists)
        let repeatMawb = exists.map(i => i.wb)

        let completeIndex = 1, incompleteIndex = 1, repeatIndex = 1
        resolveDataAll.forEach(order => {
          
          let existsIndex = repeatMawb.indexOf(order.mawb)
          if (existsIndex !== -1) {
            order.insertindex = repeatIndex++
            order.guid = exists[existsIndex].guid
            this.repeatOrder.push(order)
            return
          }
          //alert(order.hasRequiredInfo)
          if (order.hasRequiredInfo) {
            order.insertindex = incompleteIndex++
            this.incompleteOrder.push(order)
            //alert('incomplete')
          } else {
            order.insertindex = completeIndex++
            this.completeOrder.push(order)
            //alert('complete')
          }
        })

        this.importDialogVisible = false
        this.mawbAddVisible = true
      })
      },1000)

    },
    getRepeatOrder(orderData,curTemp) {
      return new Promise((resolve, reject) => {
        let data = {
          gid: this.inputModelData.gid,
          area: this.area,
          importlist: [],
          iswecan:curTemp.wtkhname=='ALL'?'1':'2'
        }
       //console.log(curTemp.wtkhname=='ALL')
        orderData.forEach(order => {
          data.importlist.push({
            mawb: order.mawb,
            hawb: order.hawbList.map(hawb => hawb.hawb).join(',')
          })
        })
        this.$axios({method: 'post',url: this.$store.state.webApi+`api/ExHpoAxplineImportCheckRepeat`, data: data,loading: true,tip: false})
        .then(({data: {resultdic: { exists }}}) => {
          resolve(exists)
        })
        .catch(() => {
          resolve([])
        })

      })
    },
    setOrderDefaultField(order) {
      let mawbDefaultFieldObj = {
        "czlx": "自货",
        "orderno": "",
        "mawb": "",
        "hawb": "",
        "zzg": "",
        "deliverydate": "",
        "smallpiece": "",
        "hbh": "",
        "qfsj": "",
        "yqqcts": "",
        "hbzl": "全部",
        "paymode": "PP",
        "englishpm": "CONSOLIDATION CARGO AS PER ATTACHED MANIFEST", // 修改总单英文品名默认值
        "chinesepm": "",
        "hwxz": "普货",
        "hwlx": "普货",
        "batterymodel": "",
        "tradeterm": "CIF",
        "companytitle_fhr_mawb": "",
        "address_fhr_mawb": "",
        "companycode_fhr_mawb": "",
        "state_fhr_mawb": "",
        "city_fhr_mawb": "",
        "postcode_fhr_mawb": "",
        "lxr_fhr_mawb": "",
        "phone_fhr_mawb": "",
        "fax_fhr_mawb": "",
        "email_fhr_mawb": "",
        "zdfhrId": "",
        "model": "",
        "companytitle_shr_mawb": "",
        "address_shr_mawb": "",
        "companycode_shr_mawb": "",
        "state_shr_mawb": "",
        "city_shr_mawb": "",
        "postcode_shr_mawb": "",
        "lxr_shr_mawb": "",
        "phone_shr_mawb": "",
        "fax_shr_mawb": "",
        "email_shr_mawb": "",
        "zdshrId": "",
        "currency": "人民币",
        "isinwageallin": "1",
        "self_real_bp_freight_in": "10",
        "cus_real_bp_freight_in": "0",
        "isinwageallin_trans": "1",
        "self_real_bp_trans_in": "10",
        "cus_real_bp_trans_in": "0",
        "gysname": "",
        "orderdom": "总单",
        "ordertype": "",
        "area": this.area,
        "dom": localStorage.dom || "出口部",
        "system": "空出",
        "salesarea": this.area,
        "salesdom": "出口部",
        "assignarea": this.area,
        "assigndom": "出口部",
        "dzstatus": 100,
        "pcstatus": 1,
        "comhy": "",
        "freightfee_remark": "",
        "nodecode": "",
        "zddlcode": "",
        "zddlzh": "",
        "zdiatacode": "",
        "czman": localStorage.getItem('usrname'),
        "logExtraData": this.logExtraDataForBuild,
        "remark":"",
        "bglx":'',
        "bgpiece":'',
        "bgweight":'',
      }
      let hawbDefaultFieldObj = {
        "smallpiece": "",
        "hwxz": "普货",
        "hwlx": "普货",
        "batterymodel": "",
        "chinesepm": "",
        "englishpm": "",
        "isinwageallin": -1,
        "inwageallinprice": 0,
        "currency": "人民币",
        "tradeterm": "",
        "rate": "",
        "remark": "",
        "companytitle_fhr_hawb": "",
        "address_fhr_hawb": "",
        "companycode_fhr_hawb": "",
        "state_fhr_hawb": "",
        "city_fhr_hawb": "",
        "postcode_fhr_hawb": "",
        "lxr_fhr_hawb": "",
        "phone_fhr_hawb": "",
        "fax_fhr_hawb": "",
        "email_fhr_hawb": "",
        "fdfhrId": "",
        "model": "",
        "companytitle_shr_hawb": "",
        "address_shr_hawb": "",
        "companycode_shr_hawb": "",
        "state_shr_hawb": "",
        "city_shr_hawb": "",
        "postcode_shr_hawb": "",
        "lxr_shr_hawb": "",
        "phone_shr_hawb": "",
        "fax_shr_hawb": "",
        "email_shr_hawb": "",
        "fdshrId": ""
      }

      if (this.area == this.conditionalAreaForBuild) {
        mawbDefaultFieldObj.nodecode = 'AO5025'
      } else {
        mawbDefaultFieldObj.nodecode = 'AO5020'
      }

      getxmdata('wtkhUseful').forEach(i => {
        if (this.inputModelData.fid == i.id) {
          mawbDefaultFieldObj.comhy = i.comhy
        }
      })

      let areaGroupType = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53)

      // 仓储服务
      let AA0410Check = false
      for (let item of this.serviceList) {
        if (item.servicecode === 'AA0410') {
          AA0410Check = item.isdel === 1 ? true : false
          break
        }
      }

      async function setField(order) {
        order.fid = this.inputModelData.fid
        order.gid = this.inputModelData.gid
        order.czlx = this.inputModelData.czlx
        order.orderdom = this.inputModelData.orderdom
        order.customerRelList = [...this.customerRelList]
        // 航班号只匹配字母和数字，并且转换成大写
        if (order.hbh) {
          order.hbh =order.hbh.match(/([A-Za-z0-9])+/g) && order.hbh.match(/([A-Za-z0-9])+/g).join('').toUpperCase()
        }

        order.serviceList = JSON.parse(JSON.stringify(this.serviceList))
        if (order.orderdom && order.orderdom === '直单') {
          order.serviceList.forEach(item => {
            if (item.servicecode === 'AA0120' || item.servicecode === 'AA0320') item.isdel = 2
          })
        }

        // this.importCommonAddress.forEach(item => {
        //   Object.keys(item).forEach(key => {
        //     if (key == 'jsonArr') return
        //     order[key] = item[key]
        //   })
        // })

        // 市场部和海外部模式不带入始发港
        if (!this.area.includes('海外部') && !this.area.includes('市场部') && !this.inputModelData.sfg) {
          areaGroupType.forEach(i => {
            if (i.typename == this.area) {
              order.sfg = i.ready06
            }
          })
        }

        Object.keys(mawbDefaultFieldObj).forEach(key => {
          if (!order[key]) order[key] = mawbDefaultFieldObj[key]
        })
        // 没有分运单数据，看是否有勾选仓储服务来决定入库类型
       if(order.hawbList.length==0&&order.ybstoreList.length>0){
          order.ybstoreList=order.ybstoreList.map(i=>{return {...i,storeType:AA0410Check?'入库':'不入库'}})
        }
        order.hawbList.forEach(hawb => {
          hawb.sfg = order.sfg
          hawb.gid = order.gid
          hawb.realpiece = hawb.ybpiece
          hawb.realweight = hawb.ybweight
          hawb.realvolume = hawb.ybvolume
          hawb.khjcno = hawb.ybstoreList.map(i => i.khjcno).join(',')
          hawb.ybstoreList.forEach(item => {
            // 如果选择了仓储服务则默认入库
            if (AA0410Check) {
              item.storeType = '入库'
              item.storename_yb = ''
            } else {
              item.storeType = '不入库'
              item.storename_yb = ''
            }
          })

          Object.keys(hawbDefaultFieldObj).forEach(key => {
            if (!hawb[key]) hawb[key] = hawbDefaultFieldObj[key]
          })
        })

        if (order.mawb && order.gid && order.sfg && order.mdg && order.czlx) {
          await this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
            params: {
              mawb: order.mawb,
              area: this.area,
              gid:order.gid,
              sfg:order.sfg,
              mdg:order.mdg,
              czlx:order.czlx,
            },
            loading: false,
            tip: false
          }).then(({ data }) => {
            if (data.resultstatus === 0 && data.resultdic) {
              order.zddlcode = data.resultdic.zddlcode
              order.zddlzh = data.resultdic.zddlzh
              order.zdiatacode = data.resultdic.zdiatacode
            }
          })
        }
        
        //console.log(this.checkHasRequiredInfo(order),111111)
        console.log(order)
        if (this.checkHasRequiredInfo(order)) {
          order.hasRequiredInfo = true
        } else {
          delete order.hasRequiredInfo
        }

        return order
      }

      this.setOrderDefaultField = setField
      return this.setOrderDefaultField(order)
    },
    /**
     * 检查订单是否有没有填写的必填项
     */
    checkHasRequiredInfo(order) {
      let requi = false
      let requireFiled = ['fid', 'gid', 'sfg', 'mdg', 'ybpiece', 'ybweight', 'ybvolume', 'hbrq','inwageallinprice']
      requireFiled.forEach(item => {
       
        if (!order[item]) {
          requi = true
        }
      })
      if (requi) {
        return true
      }

      if (!order.customerRelList || order.customerRelList.length === 0) {
        return true
      }

      if (this.area == this.conditionalAreaForBuild) {
        if (order.mawb && (!order.hbh || order.hbh.length < 2)) {
          return true
        }
      }
      if (order.czlx == '自货' && !order.inwageallinprice) {
        return true
      }

      let ybstoreList = [].concat(order.ybstoreList)
      let tradeterm = false
      order.hawbList.forEach(hawb => {
        ybstoreList = ybstoreList.concat(hawb.ybstoreList)
        if (!hawb.tradeterm) {
          tradeterm = true
        }
      })

      if (tradeterm) {
        if (
          (order.orderdom == '总单' && this.area == this.conditionalAreaForBuild) ||
          this.area=='市场部' ||
          this.area=='海外部'
        ) {
          return true
        }
      }

      function isValidateNumber(val) {
        return !Number.isNaN(Number(val))
      }
      for (let item of ybstoreList) {
        if (!isValidateNumber(item['piece']) || !isValidateNumber(item['weight']) || !isValidateNumber(item['volume'])) {
          return true
        }
        for (let store of item.ybstorevolumeList) {
          if (!isValidateNumber(store['piece']) || !isValidateNumber(store['longs']) || !isValidateNumber(store['widths']) || !isValidateNumber(store['heights'])) {
            return true
          }
        }
      }

      return false
    },
    clickOrderCheckbox(newVal) {
      // 如果有还未填写的必填项则禁止选择
      this.$nextTick(() => {
        // 取消选择
        let checkedIndex

        if (newVal.length < this.selectedOrderIndex.length) {
          return this.selectedOrderIndex = newVal
        } else {
          checkedIndex = newVal[newVal.length - 1]

          if (this.activeOrderIndex == checkedIndex) {
            let mawbInfo
            if (this.tabsActiveName === 'incompleteOrder') {
              mawbInfo = this.$refs.mawbAddNew.getInfo(false, false)
            } else {
              mawbInfo = this.$refs.mawbAddNew.getInfo(true, false)
            }
            if (mawbInfo) {
              this.orderData[checkedIndex] = {...this.orderData[checkedIndex], ...mawbInfo}
              this.$delete(this.orderData[checkedIndex], 'hasRequiredInfo')
              this.selectedOrderIndex.push(checkedIndex)
            }
          } else {
            if (this.tabsActiveName === 'incompleteOrder') {
              this.selectedOrderIndex.push(checkedIndex)
            } else if (!this.orderData[checkedIndex].hasRequiredInfo) {
              this.selectedOrderIndex.push(checkedIndex)
            } else {
              this.$message.error(`订单序号${this.orderData[checkedIndex].insertindex}： 请输入完整信息`)
            }
          }

        }

      })

    },
    changeActiveOrderIndex(index, ev) {
      if (ev.target !== ev.currentTarget && !ev.target.className.includes('el-tooltip')) return

      let mawbInfo = this.$refs.mawbAddNew.getInfo(true, false)

      if (mawbInfo) {
        this.orderData[this.activeOrderIndex] = {...this.orderData[this.activeOrderIndex], ...mawbInfo}
        this.$delete(this.orderData[this.activeOrderIndex], 'hasRequiredInfo')

        if (!this.selectedOrderIndex.includes(this.activeOrderIndex)) {
          this.selectedOrderIndex.push(this.activeOrderIndex)
        }
      } else {
        let addinfo=this.$refs.mawbAddNew.getInfo(false, false)
        this.orderData[this.activeOrderIndex] = {...this.orderData[this.activeOrderIndex], ...addinfo}
        this.orderData[this.activeOrderIndex].hasRequiredInfo = true
        this.orderData[this.activeOrderIndex].inwageallinprice=this.orderData[this.activeOrderIndex].inwageallinprice!=666666?this.orderData[this.activeOrderIndex].inwageallinprice:''
        if (this.tabsActiveName === 'completeOrder') {
          let selected = this.selectedOrderIndex.indexOf(this.activeOrderIndex)
          if (selected !== -1) {
            this.selectedOrderIndex.splice(selected, 1)
          }
        }
      }

      this.activeOrderIndex = index
    },
    /**
     * @param {Number} type -保存类型 1、本站操作  2、保存待处理
     */
    saveOrder(type) {
      // 点击保存时获取一遍当前订单的数据，否则当前订单修改的数据没有保存到orderData里面，数据会有问题
      if (this.selectedOrderIndex.includes(this.activeOrderIndex)) {
        let mawbInfo = this.$refs.mawbAddNew.getInfo()
        if (mawbInfo) {
          this.orderData[this.activeOrderIndex] = {...this.orderData[this.activeOrderIndex], ...mawbInfo}
          this.$delete(this.orderData[this.activeOrderIndex], 'hasRequiredInfo')
        } else {
          return
        }
      }

      let currentDate = new Date()
      // 只保留年月日，直接获取时间戳
      currentDate = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`).getTime()

      // 航班日期小于当天的订单为无效订单，直接过滤出来不走接口，并且提示失败
      let invalidHbrqOrder = []
      let orderData = JSON.parse(JSON.stringify(this.orderData))

      let customerRelList = orderData[0].customerRelList
      // if (customerRelList.length === 0) {
      //   return this.$message.error('请选择本票客户客服联系人')
      // }

      let requiredIndex = null
      let orderList = orderData.filter((order, index) => {
        if (this.selectedOrderIndex.includes(index)) {
          if (order.hasRequiredInfo === true) {
            requiredIndex = order.insertindex
          }

          if (new Date(order.hbrq).getTime() < currentDate) {
            invalidHbrqOrder.push(order)
            return false
          }

          order.czman = localStorage.getItem('usrname')
          order.logExtraData = this.logExtraDataForBuild
          order.customerRelList = customerRelList
          if (type == 2) {
            order.nodecode = "AO5025"
          }else{
             if (this.area == this.conditionalAreaForBuild) {
               order.nodecode = 'AO5010'
             }
          }

          order.inwageallinprice = order.inwageallinprice
            ? order.inwageallinprice
            : 666666;
          order.inwageallinprice_record = order.inwageallinprice_record
            ? order.inwageallinprice_record
            : 666666;
          return true
        } else {
          return false
        }
      })

      if (requiredIndex !== null) {
        return this.$message.error(`订单序号${requiredIndex}：请填写完整信息`)
      }

      if (orderList.length == 0) {
        if (invalidHbrqOrder.length !== 0) {
          this.postResult = []

          // 将航班日期小于当天的订单添加到postResult里
          let failedResult = {"resultstatus":1,"resultmessage":"航班日期不能小于当天","resultid":null,"resultguid":"0","resultno":null,"resultdic":null}
          invalidHbrqOrder.forEach(order => {
            this.postResult.push({...failedResult, resultid: order.insertindex})
          })

          this.mawbBatchResultVisible = true
          return
        } else {
          return this.$message.error('请选择订单')
        }
      }
      // console.log(orderList)
      // return

      let apiurl = type == 1 ? 'ExHpoAxplineLocalBatch' : 'ExHpoAxplineBatch'

      this.$axios({method: 'post',url: this.$store.state.webApi+`api/${apiurl}`, data: orderList,loading: true,tip: false})
      .then(({ data }) => {
        this.postResult = data
        // 将航班日期小于当天的订单添加到postResult里
        if (invalidHbrqOrder.length > 0) {
          let failedResult = {"resultstatus":1,"resultmessage":"航班日期不能小于当天","resultid":null,"resultguid":"0","resultno":null,"resultdic":null}
          invalidHbrqOrder.forEach(order => {
            this.postResult.push({...failedResult, resultid: order.insertindex})
          })
          // 添加了数据之后postResult的订单顺序可能会乱，需要排序一下
          this.postResult.sort((a,b) => (a.resultid - b.resultid))
        }

        this.mawbBatchResultVisible = true
        // 把新增成功的订单从orderData里面移除
        let successedIndexArr = this.postResult.reduce((p, v) => {
          if (v.resultstatus == 0) p.push(v.resultid)
          return p
        }, [])
        this.orderData = this.orderData.reduce((p, v) => {
          if (!successedIndexArr.includes(v.insertindex)) {
            p.push(v)
          }
          return p
        }, [])

        if (this.activeOrderIndex == 0) {
          this.$nextTick(() => {
            this.$refs.mawbAddNew && this.$refs.mawbAddNew.initDataFunc()
          })
        } else {
          this.activeOrderIndex = 0
        }
        this.selectedOrderIndex = []
        this.currentPage = 1
      })
    },
    saveIncompleteOrder() {
      // 点击保存时获取一遍当前订单的数据，否则当前订单修改的数据没有保存到orderData里面，数据会有问题
      if (this.selectedOrderIndex.includes(this.activeOrderIndex)) {
        let mawbInfo = this.$refs.mawbAddNew.getInfo(false)
        this.orderData[this.activeOrderIndex] = {...this.orderData[this.activeOrderIndex], ...mawbInfo}
      }

      let orderData = JSON.parse(JSON.stringify(this.orderData))
      let customerRelList = orderData[0].customerRelList

      let orderList = orderData.filter((order, index) => {
        if (this.selectedOrderIndex.includes(index)) {
          order.czman = localStorage.getItem('usrname')
          order.logExtraData = this.logExtraDataForBuild
          order.customerRelList = customerRelList
          // 预报件重体为空时赋值为0
          order.ybpiece = order.ybpiece || 0
          order.ybweight = order.ybweight || 0
          order.ybvolume = order.ybvolume || 0
          order.hawbList.forEach(hawb => {
            hawb.ybpiece = hawb.ybpiece || 0
            hawb.ybweight = hawb.ybweight || 0
            hawb.ybvolume = hawb.ybvolume || 0
          })

          order.inwageallinprice = order.inwageallinprice
            ? order.inwageallinprice
            : 666666;
          order.inwageallinprice_record = order.inwageallinprice_record
            ? order.inwageallinprice_record
            : 666666;
          return true
        } else {
          return false
        }
      })

      if (orderList.length == 0) return this.$message.error('请选择订单')
      console.log(orderList)
      // return
      this.$axios({method: 'post',url: this.$store.state.webApi+'api/ExHpoAxplineImperfectBatch', data: orderList,loading: true,tip: false})
      .then(({ data }) => {
        this.postResult = data

        this.mawbBatchResultVisible = true
        // 把新增成功的订单从orderData里面移除
        let successedIndexArr = this.postResult.reduce((p, v) => {
          if (v.resultstatus == 0) p.push(v.resultid)
          return p
        }, [])
        this.orderData = this.orderData.reduce((p, v) => {
          if (!successedIndexArr.includes(v.insertindex)) {
            p.push(v)
          }
          return p
        }, [])

        if (this.activeOrderIndex == 0) {
          this.$nextTick(() => {
            this.$refs.mawbAddNew && this.$refs.mawbAddNew.initDataFunc()
          })
        } else {
          this.activeOrderIndex = 0
        }
        this.selectedOrderIndex = []
        this.currentPage = 1
      })

    },
    updateRepeatOrder() {
      let mawbInfo = this.$refs.mawbAddNew.getInfo()
      if (mawbInfo) {
        this.orderData[this.activeOrderIndex] = {...this.orderData[this.activeOrderIndex], ...mawbInfo}
        this.$delete(this.orderData[this.activeOrderIndex], 'hasRequiredInfo')
      } else {
        return
      }
      console.log(JSON.parse(JSON.stringify(this.orderData[this.activeOrderIndex])))

      this.$axios({method: 'post',url: this.$store.state.webApi+'api/ExHpoAxplineImport', data: this.orderData[this.activeOrderIndex],loading: true,tip: true})
      .then(({ data }) => {
        console.log(data)
        // if (data.resultstatus == 0) {
        //   this.orderData.splice(this.activeOrderIndex, 1)
        // }
      })
    },
    printLzd() {
      const dom = '操作流转单'
      let data = {}
      data.boguid = this.postResult.reduce((p, v) => {
        if (v.resultstatus == 0) {
          p.push(v.resultguid)
        }
        return p
      }, []).join(',')

      data.area = this.area
      data.shipaceid = -1

      let row = JSON.parse(localStorage.jhAddress).filter(i => i.dom == dom && i.area == this.area && i.system == '空出')[0]

      if(row){
        let str = ''
        let parmjson = row.parmjson.split(',')

        parmjson.forEach(i => {
          str += i + '=' + data[i] + '&'
        })
        str = str.substr(0,str.length-1)

        this.lzdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=${row.templetename}&${str}`

        this.lzdDialogVisible = true
      }else{
        layer.msg('无数据！')
      }

    },
    // collapseTopTabs(ev) {
    //   if (ev.target.className.includes('el-tabs__nav-scroll') || ev.target.className.includes('el-icon-arrow-down')) {
    //     this.mawbAddTopTabsVisible = !this.mawbAddTopTabsVisible
    //   } else if (ev.target.className.includes('el-tabs__item')) {
    //     this.mawbAddTopTabsVisible = true
    //   }
    // },

    // 两个开发用的按钮，新增和修改模板，方便把模板保存到接口上去
    // 需要修改或更新时只需要把 "mawbImportTemplate" 的下标修改为对应的模板然后点击按钮就可以
    // 保存模板函数
    saveImportTemp () {
      // 选择需要新增的模板
      console.log(mawbImportTemplate.length)
      let saveJsondata = JSON.stringify(mawbImportTemplate[12])

      // type: 120 总单导入模板
      let data = [{
        logExtraData: this.logExtraDataForBuild,
        isactivate: 1,
        // 选择需要新增的模板
        jsondata: saveJsondata,
        logname: 'public',
        project: "bomanagement",
        czman: localStorage.getItem('usrname'),
        name: 'mawbImportTemplate',
        type: 120,
        dom: '出口部',
        url: "all",
      }]

      console.log(data)
      console.log(data[0].jsondata)
      return

      this.$axios({method:'post',url:this.$store.state.publicWebApi+'api/UserTempletList', data,noarea:true,loading:false,tip:true})
      .then(result => {
        console.log(result)
        if (result.data.resultstatus != 0) {
          this.$message.error(result.data.resultmessage)
        }
      })
    },
    // 更新模板函数
    updateImportTemp () {
      // 选择需要更新的模板
       console.log(mawbImportTemplate)
      let updateJsondata = mawbImportTemplate[4]

      let id = this.mawbImportTemplateAll.find(i => {
        if (i.fid == updateJsondata.fid && i.tempName == updateJsondata.tempName) {
          return true
        }
        return false
      }).id

      // type: 120 总单导入模板
      let data = [{
        logExtraData: this.logExtraDataForBuild,
        isactivate: 1,
        jsondata: JSON.stringify(updateJsondata),
        logname: 'public',
        project: "bomanagement",
        czman: localStorage.getItem('usrname'),
        name: 'mawbImportTemplate',
        type: 120,
        dom: '出口部',
        url: "all",
        id
      }]

      console.log(data)
      console.log(data[0].jsondata)
      return

      this.$axios({method:'put',url:this.$store.state.publicWebApi+'api/UserTempletList', data,noarea:true,loading:false,tip:true})
      .then(result => {
        console.log(result)
        if (result.data.resultstatus != 0) {
          this.$message.error(result.data.resultmessage)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mawbImport {
  display: inline-block; 
   .mawbImportDialog {
    .el-row {
      margin-top: 10px;
    }
    .el-col {
      display: flex;
      .label {
        width: 100px;
        height: 28px;
        line-height: 28px;
        padding-right: 6px;
        text-align: right;
        flex-shrink: 0;
      }
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      border-bottom: 1px solid #ccc;
      padding-top: 40px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      &.first-title {
        padding-top: 10px;
      }
      .wecanTempDownload {
        font-size: 18px;
        text-decoration: underline;
        color: #0f5a8c;
        margin-left: 20px;
        cursor: pointer;
        i {
          text-decoration: underline;
          font-size: 18px;
        }
      }
    }
    .detail {
     // width: 1100px;
      margin: 0 auto;
      .servicediv{
        display:flex;
        align-items: center;
        border:1px solid #eee;
        width:100%;
        margin-top:10px;
        margin-bottom:10px;
        display:flex;
      }
      .service{
        width:50%;
      }
      .servicediv-title{
        display:flex;
        flex-direction:column;
        justify-content: space-around;
        margin-left:15px;
        padding-right:15px;
        width:30px;
        word-wrap: break-word;
        line-height: 16px;
      }
      .codeAA0210 .serviceItem{
        /deep/ div{
          display: none!important;
          color:red
        }
      }
      .codeAA0220{
        position: absolute;
        left:220px;
        margin-top:-43px;
      }
      .codeAA0220 .serviceItem{
        /deep/ div{
          display: none!important;
          color:red
        }
      }
    }
  }
  .mawbAddDialog {
    /deep/ .el-dialog__header {
      padding-top: 5px;
    }
    /deep/ .el-dialog__title {
      line-height: 36px;
    }
    /deep/ .el-dialog__body {
      position: relative;
      padding-top: 0px;
      padding-bottom: 10px;
      .el-icon-search {
        margin-top: 0 !important;
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 5px;
    }
    // /deep/ .el-tabs {
    //   position: absolute;
    //   top: 5px;
    //   left: 15px;
    //   right: 15px;
    //   z-index: 10;
    //   .el-tabs__nav-scroll {
    //     cursor: pointer;
    //   }
    //   .el-tabs__content {
    //     overflow: visible;
    //     .el-icon-arrow-down {
    //       position: absolute;
    //       top: -29px;
    //       right: 15px;
    //       font-size: 19px;
    //       transition: all .5s;
    //       cursor: pointer;
    //     }
    //   }
    //   &.collapse {
    //     .el-tabs__content {
    //       padding: 5px;
    //       transition: padding .5s;
    //       .el-icon-arrow-down {
    //         transform: rotate(90deg);
    //       }
    //     }
    //   }
    // }
    .selectAllOrder {
      margin: 8px 0;
      padding-left: 2px;
      .el-checkbox {
        margin-right: 5px;
      }
    }
    .el-container {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-aside {
        .orderNav {
          border: 1px solid #e8e8e8;
          border-right: none;
          border-radius: 3px;
          .navItem {
            height: 37px;
            line-height: 37px;
            padding-left: 15px;
            border-bottom: 1px solid #e8e8e8;
            border-right: 1px solid #e8e8e8;
            background: #f8f8f8;
            cursor: pointer;
            &:last-child {
              border-bottom: 0;
            }
            &.active {
              border-right: 1px solid #0f5a8c;
              background: #0f5a8c;
              .el-checkbox {
                color: white;
                /deep/ .el-checkbox__input.is-checked {
                  +.el-checkbox__label {
                    color: white;
                  }
                  .el-checkbox__inner {
                    background: white;
                    &::after {
                      border-color: #0f5a8c;
                    }
                  }
                }
              }
              .el-checkbox__label {
                color: white;
              }
              .el-tooltip {
                color: white;
              }
            }
            .el-checkbox {
              width: 10px;
            }
            .hasRequiredInfo {
              /deep/ .el-checkbox__inner {
                border: 1px solid #b50303;
              }
              /deep/ .el-checkbox__label {
                color: #b50303;
              }
            }
            .el-tooltip {
              padding-left: 8px;
              color: #b50303;
            }
          }
        }
      }
      .el-main {
        height: 742px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        margin-left: 20px;
        box-shadow: 0 0 10px #ccc;
      }
    }
    .footer {
      overflow: hidden;
      margin: 5px 0;
      .el-pagination {
        float: left;
      }
      .btn-c {
        float: right;
        margin-top: 6px;
      }
    }
  }
}
.mawbBatchResultDialog {
  @dialogWidth: 900px;
  .table-c {
    margin-bottom: 10px;
    text-align: center;
    /deep/ .el-table{
      width: @dialogWidth;
      margin: 0 auto;
      .cell {
        white-space: normal;
      }
      &.el-table--border {
        border: 1px solid #ebeef5;
        border-right: none;
        border-bottom: none;
      }
      th {
        text-align: center;
      }
    }
    .btn-c {
      text-align: right;
      width: @dialogWidth;
      margin: 20px auto 0;
    }
  }
}
.dialogImgDoc{
  /deep/ .el-dialog__body{
    padding:0px;
    height: calc(100% - 40px);
  }
}
</style>


<style scoped>
  .mawbAddDialogTier{
    z-index: 1900;
  }
</style>