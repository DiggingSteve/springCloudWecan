<template>
<div :class="['LyOrderDetail', {'iscancel': detailData.status == 600 || detailData.creditisbackstatus == 4}]">

  <div class="node-c" :style="{height: showNode ? '80px' : '0'}" v-if="detailMethod == 'detail'">
    <div class="node">

      <el-button
        v-if="!isAccept && detailData.status !== 600"
        class="right-text"
        @click="editNode = !editNode">
        {{ editNode ? '保存' : '编辑' }}
      </el-button>

      <div class="content">
        <div class="item" v-for="(node, index) in nodeList" :key="index">

          <template v-if="!editNode">
            <i :class="['el-icon-success',{'node-exist': node.nodedate.indexOf('1900') == -1 || node.nodedate == ''}]"></i>
            <div>

              <el-tooltip effect="light" :content="`操作人：${node.nodeman}`" placement="top-start">
                <span>{{ node.nodename }}</span>
              </el-tooltip>

              <p v-if="!editNode">{{ node.nodedate | nodeDataFormat }}</p>

            </div>
          </template>

          <template v-else-if="editNode && node.nodedate.indexOf('1900') == -1">
            <i class="el-icon-success node-exist"></i>
            <div>
              <el-tooltip effect="light" :content="`操作人：${node.nodeman}`" placement="top-start">
                <span>{{ node.nodename }}</span>
              </el-tooltip>

              <el-input class="node-man" v-model="node.nodeman" placeholder="请输入操作人"></el-input>

              <el-date-picker
                v-model="node.nodedate"
                type="datetime"
                :editable="false"
                value-format="yyyy-MM-dd hh:mm"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间">
              </el-date-picker>

            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div class="title" style="overflow: hidden;" v-if="detailMethod == 'detail'">
    <p>订舱编号：<span>{{ detailData.pono }}</span></p>
    <p v-if="detailData.creditcontent && detailData.creditisbackstatus !== 3"><span style="font-size: 12px;">{{ `信控${getCreditisbackstatus(detailData.creditisbackstatus)}，${detailData.creditcontent || ''}` }}</span></p>
    <p>操作人：<span>{{ detailData.modifyman }}</span></p>
    <p>操作时间：<span>{{ detailData.modifydate | dateFilter }}</span></p>
    <div style="float: right;">
      <template v-if="isAccept">
        <el-button type="primary" @click="Accept(200)">退回</el-button>
        <el-button type="primary" @click="Accept(100)">受理</el-button>
      </template>
      <el-button type="success" @click="profitVisible = true" v-if="isAssignOrder">利润信息</el-button>
      <el-button type="success" @click="showNode = !showNode">节点信息</el-button>
    </div>
  </div>

  <div class="content">
    <div class="detail" :style="disableStyle">
      <div class="detail-title">
        <p>基础信息</p>
      </div>
      <div class="detail-c basicInformation" :style="detailData.status >= 500 ? {'pointer-events': 'none'} : ''">
        <formCompt :input-view-data="inputViewData" :inputModelData="inputModelData" v-if="inputModelData.fid || detailMethod == 'add'"></formCompt>
        <div class="basic-form" v-enterfocus>

          <el-row>
            <el-col :span="6">
              <div class="jzt">
                <span>件/重/体：</span>
                <el-input v-model="detailData.piece" class="input-required" v-verify="'integer'"></el-input> /
                <el-input v-model="detailData.weight" class="input-required" v-verify="'float'"></el-input> /
                <el-input v-model="detailData.volume" class="input-required" v-verify="'float'"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="jfzl">
                <span>计费重量：</span>
                <el-input v-model="detailData.charged_weight" class="input-required"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="pickupdate">
                <span>要求提货时间：</span>
                <el-date-picker type="datetime" v-model="detailData.yqpickupdate" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" class="input-required" placeholder="选择日期" :editable="false"></el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="yqwctime">
                <span>要求完成时间：</span>
                <el-date-picker type="datetime" v-model="detailData.yqfinishdate" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" class="input-required" placeholder="选择日期" :editable="false"></el-date-picker>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <div class="zydh">
                <span>总运单号：</span>
                <el-input v-model="detailData.mawb"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="sfg">
                <span>始发港：</span>
                <div class="pageSelect">
                  <pageSelect :pagetype="6" :modelval.sync="detailData.sfg"></pageSelect>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="mdg">
                <span>目的港：</span>
                <div class="pageSelect">
                  <pageSelect :pagetype="6" :modelval.sync="detailData.mdg"></pageSelect>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="hbh">
                <span>航班号：</span>
                <el-input v-model="detailData.hbh"></el-input>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="remark" :span="12">
              <span>备注：</span>
              <el-input type="textarea" v-model="detailData.remark"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="sfd">
          <div class="header">
            <div class="title">货物提货地</div>
            <div class="radio">
              <el-radio v-model="sfdtabs" label="客户地址">客户地址</el-radio>
              <el-radio v-model="sfdtabs" label="机场货站">机场货站</el-radio>
              <el-radio v-model="sfdtabs" label="唯凯仓库">唯凯仓库</el-radio>
            </div>
          </div>
          <div class="content">
            <div class="khdz" v-show="sfdtabs == '客户地址'" v-enterfocus>

              <addressCompt
                ref="thraddress"
                :addressData.sync="thrAddressData"
                :gid="inputModelData.gid"
                addresstype="1">
              </addressCompt>

            </div>
            <div class="jchz" v-show="sfdtabs == '机场货站'">
              <!-- <div>
                <span>区域：</span>
                <el-select v-model="detailData.shr_jcArea" class="input-required">
                  <el-option
                    v-for="(option, index) in assignarea_option"
                    :key="index"
                    :value="option.value">
                  </el-option>
                </el-select>
              </div> -->

              <div>
                <span>港口：</span>
                <pageSelect :pagetype="6" :modelval.sync="detailData.shr_jcArea" class="input-required" style="width: 186px;display:inline-block;"></pageSelect>
              </div>

              <div>
                <span>请选择货站：</span>
                <el-select v-model="detailData.terminal_thr" class="input-required">
                  <el-option
                    v-for="(option, index) in cargo_station_option"
                    v-if="option.sfg == detailData.shr_jcArea"
                    :key="index"
                    :value="option.cname">
                  </el-option>
                </el-select>
              </div>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="detailData.lxr_thr" class="input-required" placeholder="姓名"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="detailData.phone_thr" class="input-required" placeholder="电话"></el-input>
                </el-col>
              </el-row>
            </div>

            <div class="wecanck" v-show="sfdtabs == '唯凯仓库'">
              <div>
                <span>区域：</span>
                <el-select v-model="detailData.shr_ckArea">
                  <el-option
                    v-for="(option, index) in assignarea_option"
                    :key="index"
                    :value="option.value">
                  </el-option>
                </el-select>
              </div>

              <el-row>
                <el-col :span="6">
                  <span>请选择入库地区：</span>
                  <el-select v-model="detailData.storearea_thr">
                    <el-option v-for="(area, index) in area_option" :value="area" :label="area" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <span>请选择入库仓库：</span>
                  <el-select v-model="detailData.store_thr">
                    <el-option v-for="(store, index) in store_list_option[detailData.storearea_thr]" :value="store" :label="store" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <span>预计出库时间：</span>
                  <el-date-picker v-model="detailData.yjdate" class="input-required"></el-date-picker>
                </el-col>
              </el-row>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="detailData.lxr_thr" class="input-required" placeholder="姓名"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="detailData.phone_thr" class="input-required" placeholder="电话"></el-input>
                </el-col>
              </el-row>

              <storeComp
                :guid="detailData.guid"
                :storeList.sync="storeList"
                :piece="detailData.piece"
                :weight="detailData.weight"
                :volume="detailData.volume"
                :type="1">
              </storeComp>
            </div>
          </div>
        </div>
        <div class="mdd">
          <div class="header">
            <div class="title">货物送货地</div>
            <div class="radio">
              <el-radio v-model="mddtabs" label="客户地址">客户地址</el-radio>
              <el-radio v-model="mddtabs" label="机场货站">机场货站</el-radio>
              <el-radio v-model="mddtabs" label="唯凯仓库">唯凯仓库</el-radio>
            </div>
          </div>
          <div class="content">
            <div class="khdz" v-show="mddtabs == '客户地址'" v-enterfocus>

              <addressCompt
                ref="shraddress"
                :addressData.sync="shrAddressData"
                :gid="inputModelData.gid"
                addresstype="2">
              </addressCompt>

            </div>
            <div class="jchz" v-show="mddtabs == '机场货站'">
              <!-- <div>
                <span>区域：</span>
                <el-select v-model="detailData.thr_jcArea" class="input-required">
                  <el-option
                    v-for="(option, index) in assignarea_option"
                    :key="index"
                    :value="option.value">
                  </el-option>
                </el-select>
              </div> -->

              <div>
                <span>港口：</span>
                <pageSelect :pagetype="6" :modelval.sync="detailData.thr_jcArea" class="input-required" style="width: 186px;display:inline-block;"></pageSelect>
              </div>

              <div>
                <span>请选择货站：</span>
                <el-select v-model="detailData.terminal_shr" class="input-required">
                  <el-option
                    v-for="(option, index) in cargo_station_option"
                    v-if="option.sfg == detailData.thr_jcArea"
                    :key="index"
                    :value="option.cname">
                  </el-option>
                </el-select>
              </div>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="detailData.lxr_shr" class="input-required" placeholder="姓名"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="detailData.phone_shr" class="input-required" placeholder="电话"></el-input>
                </el-col>
              </el-row>
            </div>

            <div class="wecanck" v-show="mddtabs == '唯凯仓库'">
              <div>
                <span>区域：</span>
                <el-select v-model="detailData.thr_ckArea">
                  <el-option
                    v-for="(option, index) in assignarea_option"
                    :key="index"
                    :value="option.value">
                  </el-option>
                </el-select>
              </div>

              <el-row>
                <el-col :span="6">
                  <span>请选择入库地区：</span>
                  <el-select v-model="detailData.storearea_shr">
                    <el-option v-for="(area, index) in area_option" :value="area" :label="area" :key="index"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <span>请选择入库仓库：</span>
                  <el-select v-model="detailData.store_shr">
                    <el-option v-for="(store, index) in store_list_option[detailData.storearea_shr]" :value="store" :label="store" :key="index"></el-option>
                  </el-select>
                </el-col>
              </el-row>

              <p class="contacts">联系人信息：</p>
              <el-row>
                <el-col :span="3" style="margin-right: 20px;">
                  <el-input v-model="detailData.lxr_shr" class="input-required" placeholder="姓名"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="detailData.phone_shr" class="input-required" placeholder="电话"></el-input>
                </el-col>
              </el-row>

              <storeComp
                :guid="detailData.guid"
                :storeList.sync="storeList"
                :piece="detailData.piece"
                :weight="detailData.weight"
                :volume="detailData.volume"
                :type="2"
                v-show="sfdtabs != '唯凯仓库'">
              </storeComp>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div :class="['detail', {'isdel': detailData.canceltype == '误上榜'}]" v-if="detailMethod == 'detail' && !hideWage && detailData.creditisbackstatus !== 4">
      <div class="detail-title">
        <p>费用信息</p>
      </div>

      <div class="detail-c feeInformation">
        <div class="charge">
          <div class="header">
            <div class="title">应收费用</div>
            <div class="header-right">
              <p>应收总额：{{ charge_total }} 元</p>
              <p>总盈利：{{ profit_total }} 元</p>
              <div class="right-btn" v-if="detailMethod == 'detail'">
                <el-button type="primary" :disabled="charge_confirm" @click="confirm(1, 700)">应收确认并审单</el-button>
                <el-button type="primary" :disabled="detailData.status < 500 || detailData.status >= 800" @click="confirm(1, 1)">取消确认</el-button>
                <el-button type="primary" :disabled="!charge_confirm" @click="costBill(1)">应收对账</el-button>
              </div>
            </div>
          </div>
          <div class="content">

            <commonTable class="commonTable" :head="charge_table_model" :table-data="ChargeData.filter(i => i.yssys !== 2)" style="margin-top:20px;" :tableIndex="1">
              <template slot="firstTd" slot-scope="props">
                <td>
                  <i class="icon-save" @click="saveCost(1)" title="保存"></i>
                  <i class="el-icon-close" @click="delCurCost(cur_charge)" title="删除"></i>
                </td>
                <td></td>
                <td>
                  <input type="checkbox" v-model="cur_charge.isfree">
                </td>
                <td style="display:inline-block;border:none;width:200px;">
                  <!-- <pageSelect :pagetype="2" :modelval.sync="cur_charge.gid" :disabled="isAssignOrder" :area="detailData.area"></pageSelect> -->
                  <pageSelect :pagetype="2" :modelval.sync="cur_charge.gid" :ifRefreshData.sync="ifRefreshData" :area="detailData.area" :fid="detailData.fid">
                    <template slot="other">
                      <jsdxwh :fid="detailData.fid" :area="detailData.area" @success="ifRefreshData=!ifRefreshData"></jsdxwh>
                    </template>
                  </pageSelect>
                </td>
                <td>
                  <page-select :modelval.sync="cur_charge.items" :pagetype="5" :disabled="isAssignOrder" :area="detailData.area"></page-select>
                </td>
                <td>
                  <el-select v-model="cur_charge.wagetype" style="width:110px;" :disabled="isAssignOrder" size="mini">
                    <el-option v-for="(item, index) in wagetype_option" :value="item.typename" :label="item.typename" :key="index"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="cur_charge.num" style="width:75px;" v-verify="'float'" :disabled="isAssignOrder"></el-input>
                </td>
                <td>
                  <el-input v-model="cur_charge.price" style="width:75px;" v-verify="'float'" :disabled="isAssignOrder"></el-input>
                </td>
                <td>
                  <el-select v-model="cur_charge.currency" style="width:90px;" :disabled="isAssignOrder" size="mini">
                    <el-option v-for="(item,index) in currency_option"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_charge.leastwageall" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_charge.wageall" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_charge.changerate" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input v-model="cur_charge.remark" style="width:120px;"></el-input>
                </td>

              </template>
              <template slot="operate" slot-scope="props" v-if="!(props.data.row.confirmstatus >= 700)">
                <i class="el-icon-setting" @click="editCost(props.data.index, 1, props.data.row)" title="编辑"></i>
                <i class="el-icon-delete" @click="delCost(props.data.index, 1, props.data.row)" title="删除"></i>
              </template>
              <template slot="isfree" slot-scope="props">
                {{ props.data.value | isfreeformat }}
              </template>
              <template slot="custom" slot-scope="props">
                {{ props.data.value | customFormat }}
              </template>
              <template slot="confirmstatus" slot-scope="props">
                {{ props.data.value | wageStatusFormat }}
              </template>

            </commonTable>
          </div>
        </div>

        <div class="payment">
          <div class="header">
            <div class="title">应付费用</div>
            <div class="header-right">
              <p>应付总额：{{ payment_total }} 元</p>
              <div class="right-btn" v-if="detailMethod == 'detail'">
                <el-button type="primary" :disabled="payment_confirm" @click="confirm(2, 700)">应付确认并审单</el-button>
                <el-button type="primary" :disabled="detailData.status < 500 || detailData.status >= 800" @click="confirm(2, 1)">取消确认</el-button>
              </div>
            </div>
          </div>
          <div class="content">

            <commonTable class="commonTable" :head="payment_table_model" :table-data="PaymentData.filter(i => i.yssys !== 2)" style="margin-top:20px;" :tableIndex="1">
              <template slot="firstTd" slot-scope="props">
                <td>
                  <i class="icon-save" @click="saveCost(2)" title="保存"></i>
                  <i class="el-icon-close" @click="delCurCost(cur_payment)" title="删除"></i>
                </td>
                <td></td>
                <td>
                  <input type="checkbox" v-model="cur_payment.isfree">
                </td>
                <td style="display:inline-block;border:none;width:200px;">
                  <pageSelect :pagetype="3" :modelval.sync="cur_payment.gid" :area="detailData.area"></pageSelect>
                </td>
                <td>
                  <page-select :modelval.sync="cur_payment.items" :pagetype="5" :area="detailData.area"></page-select>
                </td>
                <td>
                  <el-select v-model="cur_payment.wagetype" style="width:110px;">
                    <el-option v-for="(item, index) in wagetype_option" :value="item.typename" :label="item.typename" :key="index"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input v-model="cur_payment.num" style="width:75px;" v-verify="'float'"></el-input>
                </td>
                <td>
                  <el-input v-model="cur_payment.price" style="width:75px;" v-verify="'float'"></el-input>
                </td>
                <td>
                  <el-select v-model="cur_payment.currency" style="width:90px;">
                    <el-option v-for="(item,index) in currency_option"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_payment.leastwageall" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_payment.wageall" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input :disabled="true" v-model="cur_payment.changerate" style="width:75px;"></el-input>
                </td>
                <td>
                  <el-input v-model="cur_payment.remark" style="width:120px;"></el-input>
                </td>

              </template>
              <template slot="operate" slot-scope="props" v-if="!(props.data.row.confirmstatus >= 700)">
                <i class="el-icon-setting" @click="editCost(props.data.index, 2, props.data.row)" title="编辑"></i>
                <i class="el-icon-delete" @click="delCost(props.data.index, 2, props.data.row)" title="删除" v-if="paymentWageCanDelete(props.data.row)"></i>
              </template>
              <template slot="isfree" slot-scope="props">
                {{ props.data.value | isfreeformat }}
              </template>
              <template slot="custom" slot-scope="props">
                {{ props.data.value | customFormat }}
              </template>
              <template slot="confirmstatus" slot-scope="props">
                {{ props.data.value | wageStatusFormat }}
              </template>

            </commonTable>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    :class="['footer', {'isdel': detailData.canceltype == '误上榜'}]"
    v-if="detailMethod == 'detail'">

    <el-row>
      <el-col :span="3">
        <p>创建人：<span>{{ detailData.addman }}</span></p>
      </el-col>
      <el-col :span="6">
        <p>创建时间：<span>{{ detailData.adddate | dateFilter }}</span></p>
      </el-col>
    </el-row>

    <div class="btn-c" v-if="isAccept || detailData.creditisbackstatus == 4">
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
      </div>
      <!-- <div class="right-btn">
      </div> -->
    </div>

    <div class="btn-c" v-else-if="isAssign">
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
      </div>

      <div class="right-btn">
        <el-button type="primary" @click="distributionVisible = true">分配至外站</el-button>
        <el-button type="primary" @click="assignFn('bz')">本站操作</el-button>
      </div>
    </div>

    <div class="btn-c" v-else>
      <div class="left-btn">
        <el-button @click="back">返回</el-button>
        <el-button type="primary" @click="orderCancel = true" v-if="detailData.status < 500" style="background: red;">撤单</el-button>
        <el-button type="primary" @click="distributionVisible = true" v-if="detailData.status < 500">分配</el-button>
        <!-- v-if="detailData.status == 200" -->
      </div>
      <div class="right-btn">
        <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(detailData.status >= 800 ? 700 : 800)">
          {{ detailData.status >= 800 ? '取消结算' : '提交结算' }}
        </el-button>
        <!-- <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(detailData.status == 1100 ? 800 : 1100)">
          {{ detailData.status == 1100 ? '取消审核' : '提交并审核' }}
        </el-button> -->
        <!-- <el-button type="primary" v-if="charge_confirm && payment_confirm" @click="submit(800)">
          {{ '取消审核' }}
        </el-button> -->
        <el-button type="primary" @click="detailData.status >= 500 ? cancelFinish() : save(500)" v-if="detailData.status !== 600 && detailData.status < 800">
          {{ detailData.status >= 500 ? '取消完成' : '任务完成' }}
        </el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </div>
  </div>

  <div class="footer" v-else-if="detailMethod == 'add'">
    <div class="btn-c">
      <div class="left-btn">
        <el-button @click="reset_page">重置页面内容</el-button>
      </div>
      <div class="right-btn">
        <el-button type="primary" @click="self_operation(250)">保存待分配</el-button>
        <el-button type="primary" @click="distributionVisible = true">分配至外站</el-button>
        <el-button type="primary" @click="self_operation(100)">本站操作</el-button>
      </div>
    </div>
  </div>

  <el-dialog
    title="对账"
    append-to-body
    :visible.sync="confirmVisible"
    width="1350px"
    top="4%"
    center>

    <reconMngDetail :jobid="guid" :wageinout="confirm_wageinout" :area="detailData.area" :system="'联运'" v-if="confirmVisible" @unVisible='confirmVisible=false'></reconMngDetail>

  </el-dialog>

  <el-dialog
    title="分配至外站"
    append-to-body
    :visible.sync="distributionVisible"
    class="distribution"
    width="450px"
    top="4%"
    center>

      <div v-if="distributionVisible">
        <div style="margin-bottom: 20px;">
          <span style="float: left;width: 110px;text-align:right">请选择地区：</span>
          <div style="margin-left: 120px;">
            <el-select v-model="distributionData.assignarea">
              <el-option
                v-for="(item, index) in assignarea_option"
                v-if="item.value !== current_area"
                :value="item.value"
                :label="item.label"
                :key="index">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="currency" style="margin-bottom: 20px;">
          <span style="float: left;width: 110px;text-align:right">币种：</span>
          <div style="margin-left: 120px;">
            <el-select v-model="distributionData.profitcurrency">
              <el-option v-for="(item,index) in currency_option"
              :key="index"
              :label="item"
              :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="price" style="margin-bottom: 20px;">
          <span style="float: left;width: 110px;text-align:right">卡车费：</span>
          <div style="margin-left: 120px;">
            <el-input v-model="distributionData.profitprice" class="input-required" style="width:150px;margin-right:8px;"></el-input>
            <span>总价</span>
          </div>
        </div>
        <!-- <div class="fpbl" style="margin-bottom: 20px;">
          <span style="float: left;width: 110px;text-align:right">分泡比例：</span>
          <div style="margin-left: 120px;">
            <p>
              销售站<el-input v-model="distributionData.self_profitvalue" class="input-required" style="width: 60px;margin: 0 10px;"></el-input>
              操作站<el-input v-model="distributionData.cus_profitvalue" class="input-required" style="width: 60px;margin: 0 10px;"></el-input>
            </p>
          </div>
        </div> -->
        <div class="btn-c" style="margin-top: 40px;text-align:center;">
          <el-button @click="distributionVisible = false">取消返回</el-button>
          <el-button @click="assignFn('wz')">确认分配</el-button>
        </div>
      </div>
  </el-dialog>

  <el-dialog
    title="利润信息"
    append-to-body
    :visible.sync="profitVisible"
    width="350px"
    top="7%"
    center>

    <el-row style="margin-bottom: 20px;" v-if="!isAssignOrder">
      <el-col :span="7" style="text-align: right;">
        分配站：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ detailData.assignarea }}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        销售站：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ detailData.salesarea }}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        部门：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ detailData.salesdom }}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        分配模式：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ detailData.profitmode }}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        币种：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        {{ detailData.profitcurrency }}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="7" style="text-align: right;">
        卡车费：
      </el-col>
      <el-col :span="10" :offset="3" style="color: #090;">
        <span style="margin-right: 40px;">{{ detailData.profitprice }}</span>
        <span>总价</span>
      </el-col>
    </el-row>

  </el-dialog>

  <el-dialog
    :visible.sync="orderCancel"
    width="500px"
    top="4%"
    v-if="orderCancel"
    :close-on-press-escape="false"
    append-to-body
    :close-on-click-modal="false"
    center>

    <el-form>
      <el-form-item label="撤单类型：">
        <my-select :groupid="135" v-model='orderCancelForm.type'></my-select>
      </el-form-item>
      <el-form-item label='撤单理由：'>
        <el-input type="textarea" :rows="2" v-model="orderCancelForm.reason"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right;margin-top:12px;">
        <el-button @click="orderCancel = false">取消</el-button>
        <el-button type="primary" @click="cancelOrderFunc">确定</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>

</div>
</template>

<script>
import storeComp from './storeComp'
import addressCompt from '../templates/addressCompt'
import reconMngDetail from '../orderDetails/reconMngDetail'
import { getChangeRate,computedWeight } from '../../api/localStorage.js'

export default {
  props: {
    method: {
      type: String,
      default: () => 'detail'
    },
    id: {
      type: Number
    },
    guid: {
      type: [Number,String]
    },
    visible: {
      type: Boolean
    },
    hideWage: {
      type: Boolean,
      default: () => false
    },
    isAccept: {
      type: Boolean,
      default: () => false
    },
    isAssign: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    storeComp,  addressCompt, reconMngDetail
  },
  filters: {
    isfreeformat (value) {
      return value == 1 ? '否' : '是'
    },
    nodeDataFormat (value) {
      if (!value) return ''
      if (value.indexOf('1900') !== -1) {
        return '----:--:--'
      } else {
        let result = value.split(' ')
        return `${result[0]} ${result[1].slice(0,5)}`
      }
    },
    wageStatusFormat (value) {
      switch (value){
        case 700:
          return '已确认'
          break
        case 800:
          return '已提交'
          break
        case 1100:
          return '已对账'
          break
        default:
          return ''
      }
    },
    customFormat (value) {
      return value && value.split('-')[1]
    }
  },
  data () {
    return {
      orderCancel: false,
      ifRefreshData: false,
      orderCancelForm: { // 撤单
        type: '',
        reason: '',
        del: 0
      },

      confirm_wageinout: '1',
      confirmVisible: false,
      profitVisible: false,

      showNode: false,
      editNode: false,

      distributionVisible: false,
      salesCode: '',

      sfdtabs: '客户地址',
      mddtabs: '客户地址',
      inputViewData:[
        {"title":"委托客户：",id:"fid",type:11,"model":"",width:"50",class:'width100',"defaultModel":"", required: true, disabled: false},
        {"title":"项目：",id:"gid",type:10,"model":"",width:"50",class:'width100',"defaultModel":"", required: true, disabled: false}
      ],
      inputModelData: {
        fid: '',
        gid: ''
      },
      // 订单详细信息
      detailData: {},

      cargo_station_option: [],
      wagetype_option: [],
      currency_option: [],
      area_option: [],
      store_list_option: {},

      storeList: [],
      charge_table_model: [
        {field: "operate", title: "操作",width: ''},
        {field: "confirmstatus", title: "状态"},
        {field: "isfree", title: "免"},
        {field: "custom", title: "结算项目"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "结算方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        {field: "remark", title: "备注"}
      ],
      ChargeData: [],
      cur_charge: {
        isfree: false,
        confirmstatus: '',
        gid: '',
        items: '',
        wagetype: '',
        num: '',
        price: '',
        currency: '人民币',
        leastwageall: '',
        wageall: '',
        changerate: '',
        remark: ''
      },
      payment_table_model: [
        {field: "operate", title: "操作"},
        {field: "confirmstatus", title: "状态"},
        {field: "isfree", title: "免"},
        {field: "custom", title: "结算项目"},
        {field: "items", title: "服务项目"},
        {field: "wagetype", title: "结算方式"},
        {field: "num", title: "数量"},
        {field: "price", title: "单价"},
        {field: "currency", title: "币种"},
        {field: "leastwageall", title: "金额"},
        {field: "wageall", title: "RMB金额"},
        {field: "changerate", title: "汇率"},
        {field: "remark", title: "备注"}
      ],
      PaymentData: [],
      cur_payment: {
        isfree: false,
        confirmstatus: '',
        gid: '',
        items: '',
        wagetype: '',
        num: '',
        price: '',
        currency: '人民币',
        leastwageall: '',
        wageall: '',
        changerate: '',
        remark: ''
      },
      nodeList: [{
        id: 0,
        nodecode: "A00001",
        nodedate: "",
        nodeman: "",
        nodename: "实际提货时间"
      },{
        id: 0,
        nodecode: "A00002",
        nodedate: "",
        nodeman: "",
        nodename: "实际完成时间"
      }],

      assignarea_option: [],
      distributionData: {
        assignarea: '',
        assignCode: '',
        assigndom: localStorage.getItem('dom') || '出口部',// 分配部门
        assignSystem: '联运',
        system: '联运',// 分配系统
        salesarea: this.$store.state.areaState,// 销售地
        salesname: localStorage.getItem('usrname'),// 销售人
        profitcurrency: '人民币',
        profitprice: '',
        profitmode: 'Co-Load模式',// 分配模式
        self_profitvalue: '',
        cus_profitvalue: ''
      }
    }
  },
  computed: {
    detailMethod () {
      return !this.id ? 'add' : this.method
    },
    disableStyle () {
      return this.detailData.status >= 500 ? {
        'cursor': 'not-allowed',
      } : ''
    },
    current_area () {
      return this.$store.state.areaState
    },
    charge_total () {
      return this.ChargeData.reduce((i, data) => {
        if (data.isfree == 2) return i
        return (i+Number(data.wageall))
      },0).toFixed(2)
    },
    payment_total () {
      return this.PaymentData.reduce((i, data) => {
        if (data.isfree == 2) return i
        return (i+Number(data.wageall))
      },0).toFixed(2)
    },
    profit_total () {
      return (Number(this.charge_total) - Number(this.payment_total)).toFixed(2)
    },
    charge_confirm () {
      if (this.ChargeData.length == 0) {
        return false
      } else {
        return this.ChargeData.every(item => {
          return item.confirmstatus >= 700
        })
      }
    },
    payment_confirm () {
      if (this.PaymentData.length == 0) {
        return false
      } else {
        return this.PaymentData.every(item => {
          return item.confirmstatus >= 700
        })
      }
    },
    // 是否外站分配的订单
    isAssignOrder () {
      return !!this.detailData.orderno
    },
    thrAddressData: {
      get () {
        return {
          address: this.detailData.address_thr,
          linkman: this.detailData.lxr_thr,
          phone: this.detailData.phone_thr,
          addressjson: this.detailData.address_thrjson
        }
      },
      set (value) {
        this.detailData.address_thr = value.address
        this.detailData.lxr_thr = value.linkman
        this.detailData.phone_thr = value.phone
        this.detailData.address_thrjson = value.addressjson
      }
    },
    shrAddressData: {
      get () {
        return {
          address: this.detailData.address_shr,
          linkman: this.detailData.lxr_shr,
          phone: this.detailData.phone_shr,
          addressjson: this.detailData.address_shrjson
        }
      },
      set (value) {
        this.detailData.address_shr = value.address
        this.detailData.lxr_shr = value.linkman
        this.detailData.phone_shr = value.phone
        this.detailData.address_shrjson = value.addressjson
      }
    }
  },
  watch: {
    distributionVisible (newVal) {
      if (newVal) {
        this.assignarea_option = []
        let temp = []
        for(let j in this.PubTypecode){
          if (!temp.includes(this.PubTypecode[j].typename)) {
            if (this.PubTypecode[j].typename.includes(this.$store.state.areaState)) continue
            temp.push(this.PubTypecode[j].typename)
            this.assignarea_option.push({label: this.PubTypecode[j].typename, value: this.PubTypecode[j].typename.split('丨')[0]})
          }
        }
      }
    },
    'distributionData.assignarea' (newVal) {
      for (let i in this.PubTypecode) {
        if (this.PubTypecode[i].typename.indexOf(newVal) !== -1) {
          this.distributionData.assignCode = this.PubTypecode[i].typename.split('丨')[1]
        }
      }
    },
    'cur_charge.wagetype' (newVal) {
      if (newVal == '票') {
        this.cur_charge.num = 1
      } else if (newVal == '计重' || newVal == '结算重量' || newVal == '毛重') {
        this.cur_charge.num = this.detailData.weight
      }
    },
    'cur_charge.currency': {
      handler (newVal) {
        this.cur_charge.changerate = getChangeRate(newVal) || 0
      },
      immediate: true
    },
    'cur_payment.wagetype' (newVal) {
      if (newVal == '票') {
        this.cur_payment.num = 1
      } else if (newVal == '计重' || newVal == '结算重量' || newVal == '毛重') {
        this.cur_payment.num = this.detailData.weight
      }
    },
    'cur_payment.currency': {
      handler (newVal) {
        this.cur_payment.changerate = getChangeRate(newVal) || 0
      },
      immediate: true
    }
  },
  created () {
    if (this.detailMethod == 'detail') {
      this.inputViewData[0].disabled = true
      this.inputViewData[1].disabled = true
    }

    this.cargo_station_option = JSON.parse(localStorage.jjd)

    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })

    let groupIdData=JSON.parse(localStorage.getItem('groupType'))
    groupIdData.forEach(item=>{
      if(item.groupid==33){
        this.wagetype_option.push({value:item.id,typename:item.typename})
      }
    })

    this.$watch(
      function () {
        return this.cur_charge.num + this.cur_charge.price + this.cur_charge.currency
      },
      function (newVal, oldVal) {
        var leastwageall= Number(this.cur_charge.num) * Number(this.cur_charge.price)
        this.cur_charge.wageall = (leastwageall * Number(this.cur_charge.changerate)).toFixed(2) || 0
        this.cur_charge.leastwageall = leastwageall.toFixed(2) || 0
      }
    )

    this.$watch(
      function () {
        return this.cur_payment.num + this.cur_payment.price + this.cur_payment.currency
      },
      function (newVal, oldVal) {
        var leastwageall= Number(this.cur_payment.num) * Number(this.cur_payment.price)
        this.cur_payment.wageall = (leastwageall * Number(this.cur_payment.changerate)).toFixed(2) || 0
        this.cur_payment.leastwageall = leastwageall.toFixed(2) || 0
      }
    )

    this.$watch(
      function () {
        return this.detailData.weight + this.detailData.volume
      },
      function (newVal, oldVal) {
         this.detailData.charged_weight=computedWeight(this.detailData.volume,this.detailData.weight)

      }
    )

    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubWarehouse',params:"",loading:false,tip:false})
    .then(response=>{

      for(let j in response.data){
        if(this.area_option.indexOf(response.data[j].area)==-1){
          this.area_option.push(response.data[j].area)
        }
        if(!this.store_list_option.hasOwnProperty(response.data[j].area)){
          this.store_list_option[response.data[j].area] = [response.data[j].storename]
        } else if (this.store_list_option[response.data[j].area].indexOf(response.data[j].storename) == -1) {
          this.store_list_option[response.data[j].area].push(response.data[j].storename)
        }
      }

    })

    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubTypecode',params:{groupid:101},loading:false,tip:false})
    .then(response=>{
      this.PubTypecode = response.data
      this.assignarea_option = []
      let temp = []
      for(let j in this.PubTypecode){
        if (!temp.includes(this.PubTypecode[j].typename)) {
          // if (this.$store.state.areaState !== '' && this.PubTypecode[j].typename.includes(this.$store.state.areaState)) continue
          temp.push(this.PubTypecode[j].typename)
          this.assignarea_option.push({label: this.PubTypecode[j].typename, value: this.PubTypecode[j].typename.split('丨')[0]})
        }
      }
    })

    if (this.detailMethod == 'add') {
      let obj = {}
      if (!this.$store.state.areaState.includes(',')) {
        let area = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53).filter(i => i.typename == this.$store.state.areaState)[0].ready06
        obj.shr_jcArea = area
        obj.shr_ckArea = area
        obj.thr_jcArea = area
        obj.thr_ckArea = area
      }
      this.detailData = obj
      // this.detailData = {
      //   gid: '',fid: '',yqpickupdate: '',yjdate: '',piece: null,weight: null,volume: null,mawb: '',sfg: "",mdg: "",hbh: "",yqfinishdate: '',remark: '',address_thrtype: 1,address_thr: '',
      //   address_thrjson: '{"country":"","pro":"","city":"","areade":"","addressjson":""}',
      //   zipcode_thr: '',lxr_thr: "",phone_thr: "",fax_thr: "",email_thr: "",shr_jcArea: "",shr_ckArea: "",terminal_thr: "",storearea_thr: "",store_thr: "",address_shrtype: 1,address_shr: '',
      //   address_shrjson: '{"country":"","pro":"","city":"","areade":"","addressjson":""}',
      //   zipcode_shr: '',lxr_shr: "",phone_shr: "",fax_shr: "",email_shr: "",thr_jcArea: "",thr_ckArea: "",terminal_shr: "",storearea_shr: "",store_shr: ""
      // }
      return
    }

    this.$axios({method:'get',url:this.$store.state.webApi+'api/extransport',params:{id: this.id},loading:true,tip:false})
    .then(result=>{
      this.storeList = result.data.storeList

      if (result.data.nodeList.length > 0) {
        this.nodeList = result.data.nodeList.filter(i => i.nodename)
      }

      this.detailData = {...result.data.transPortInfo}

      this.inputModelData.fid = Number(this.detailData.fid) || 0
      this.inputModelData.gid = Number(this.detailData.gid)

      this.$nextTick(() => {
        this.$refs.thraddress.findAddress()
        this.$refs.shraddress.findAddress()
      })

      this.ChargeData = result.data.wageList.filter(item => {
        if (item.wageinout == 1) return true
      })

      if (this.isAssignOrder) {
        this.cur_charge.gid = Number(this.ChargeData.filter(i => i.yssys !== 2)[0].gid)
      } else {
        this.cur_charge.gid = Number(this.detailData.gid)
      }

      this.PaymentData = result.data.wageList.filter(item => {
        if (item.wageinout == 2) return true
      })

      let address_type = ['客户地址','机场货站','唯凯仓库']
      this.sfdtabs = address_type[this.detailData.address_thrtype - 1]
      this.mddtabs = address_type[this.detailData.address_shrtype - 1]
    })
    .catch(error => {
      this.$message.error('获取详细信息出错')
      this.$emit('update:visible', false)
    })

  },
  methods: {
    cancelOrderFunc () {
      if (this.detailData.status == 600) {
        return this.$message.error('订单已撤单')
      }
      if (this.detailData.status == 1) {
        return this.$message.error('未受理状态无法撤单')
      }
      //console.log(this.orderCancelForm)
      let data = {
        ...this.orderCancelForm,
        guid: this.detailData.guid,
      }
      data.type == '误上榜' ? data.del = 1 : ''

      //console.log(data)
      this.$axios({method: 'post',url:this.$store.state.webApi+'api/ExTransport/RevokeOrder',data: data,loading:false,tip: true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.orderCancel = false
          this.$emit('delSuccess', this.guid)
          this.back()
        }
      })
    },
    getSalesCode (area) {
      for(let j in this.PubTypecode){
        if (this.PubTypecode[j].typename.indexOf(area) !== -1) {
          return this.PubTypecode[j].typename.split('丨')[1]
        }
      }
    },
    del () {
      // if (this.detailData.status == 100) {
      //   return this.$message.error('已受理订单不可删除')
      // }
      // if (this.detailData.status == 500) {
      //   return this.$message.error('已完成订单不可删除')
      // }
      this.$confirm('是否删除订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFn.call(this)

      }).catch(() => {

      })

      function delFn () {
        let del_data = {
          id: this.id,
          delman: localStorage.getItem('usrname')
        }
        this.$axios({method: 'delete',url:this.$store.state.webApi+'api/ExTransport',data:del_data,loading:true,tip:true})
        .then(result=>{
          if (result.data.resultmessage == '删除成功') {
            this.$emit('delSuccess', this.guid)
            this.back()
          }
        })
      }
    },
    getWageList () {
      let param = {
        where: {
          sid: {in: this.guid}
        }
      }
      this.$axios({method: 'get',url:this.$store.state.webApi+'api/exTransportWage',params:{json: JSON.stringify(param)},loading:false,tip:false})
      .then(result=>{
        if (result.data.length !== 0) {
          this.ChargeData = []
          this.PaymentData = []
          result.data.forEach(item => {
            if (Number.isInteger(item.changerate)) item.changerate = Number(item.changerate).toFixed(2)
            if (Number.isInteger(item.leastwageall)) item.leastwageall = Number(item.leastwageall).toFixed(2)
            if (Number.isInteger(item.wageall)) item.wageall = Number(item.wageall).toFixed(2)
            if (item.wageinout == 1) {
              this.ChargeData.push(item)
            }
            if (item.wageinout == 2) {
              this.PaymentData.push(item)
            }
          })
        }
      })
    },
    checkWageData (cur_wage) {
      if (!cur_wage.gid || !cur_wage.items || !cur_wage.wagetype || !cur_wage.num || !cur_wage.price) {
        this.$message.error('请输入完整信息')
        return false
      } else {
        return true
      }
    },
    saveCost (wageinout) {
      // if (wageinout == 1 && this.charge_confirm) {
      //   return this.$message.error('已确认状态无法新增费用')
      // } else if (wageinout == 2 && this.payment_confirm) {
      //   return this.$message.error('已确认状态无法新增费用')
      // }
      if (this.isAssignOrder && wageinout == 1 && !this.cur_charge.guid) {
        return this.$message.error('外站订单无法新增应收费用')
      }
      if (this.detailData.status >= 800) {
        return this.$message.error('提交结算后无法新增费用')
      }

      if (this.detailMethod == 'add') {
        let cur_data = null,
            save_data = {}

        if (wageinout == 1) {
          save_data = {...this.cur_charge}
        } else if (wageinout == 2) {
          save_data = {...this.cur_payment}
        }
        save_data.isfree = save_data.isfree ? 2 : 1

        save_data.wageinout = wageinout
        save_data.confirmstatus = 1

        if (wageinout == 1) {
          this.ChargeData.push({...save_data})
          cur_data = this.cur_charge
        } else if (wageinout == 2) {
          this.PaymentData.push({...save_data})
          cur_data = this.cur_payment
        }

        Object.keys(cur_data).forEach(key => {
          if (key == 'guid') return this.$delete(cur_data, key)
          if (key == 'gid') return
          cur_data[key] = key == 'isfree' ? false : ''
        })
        return
      }

      let save_data = {wageList: []}

      if (wageinout == 1 && this.checkWageData(this.cur_charge)) {
        save_data.wageList.push({...this.cur_charge, wageinout: wageinout})

      } else if (wageinout == 2 && this.checkWageData(this.cur_payment)) {
        save_data.wageList.push({...this.cur_payment, wageinout: wageinout})

        if ( (!this.cur_payment.guid || this.cur_payment.guid == -1) && !this.charge_confirm ) {
          // 新增应付时带应收，结算项目为订单委托项目
          save_data.wageList.push({...this.cur_payment, wageinout: 1, gid: this.detailData.gid, isOther: 2, isfree: false})
          // 操作站结算项目为pgid
          if (this.detailData.orderno) {
            save_data.wageList[save_data.wageList.length - 1].gid = this.ChargeData[0].gid
          }
        }
      } else {
        return
      }
      save_data.wageList.forEach(item => {
        item.isfree = item.isfree ? 2 : 1
        if (!item.guid) {
          item.confirmstatus = 1
          item.sid = this.guid
        }
      })

      new Promise((resolve, reject) => {
        if (save_data.wageList[0].guid) {
          save_data = {...save_data, ...save_data.wageList[0]}
          delete save_data.wageList
          this.$axios({method: 'put',url:this.$store.state.webApi+'api/exTransportWage/update',data:save_data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })
        } else {
          save_data.transGuid = this.detailData.guid
          this.$axios({method: 'post',url:this.$store.state.webApi+'api/exTransportWage',data:save_data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })
        }
      })
      .then((result) => {

        let cur_data = null

        if (wageinout == 1) {
          cur_data = this.cur_charge
        } else if (wageinout == 2) {
          cur_data = this.cur_payment
        }

        Object.keys(cur_data).forEach(key => {
          if (key == 'guid') return this.$delete(cur_data, key)
          if (key == 'gid' || key == 'changerate') return
          if (key == 'currency') return cur_data[key] = '人民币'
          cur_data[key] = key == 'isfree' ? false : ''
        })

        this.getWageList()
      })

    },
    delCurCost (cur_data) {
      Object.keys(cur_data).forEach(key => {
        if (key == 'isfree') {
          cur_data[key] = false
        } else if (key == 'currency') {
          cur_data[key] = '人民币'
        } else if (key == 'changerate') {
          //
        } else {
          cur_data[key] = ''
        }
      })
    },
    editCost (index, wageinout, row) {
      if (row.isread == 2) {
        return this.$message.error('系统费用不能修改与删除')
      }
      if (this.detailData.status >= 800) {
        return this.$message.error('提交结算后无法编辑费用')
      }

      // if (wageinout == 1 && this.charge_confirm) {
      //   return this.$message.error('已确认状态无法修改费用')
      // } else if (wageinout == 2 && this.payment_confirm) {
      //   return this.$message.error('已确认状态无法修改费用')
      // }

      if (wageinout == 1) {
        this.cur_charge = {...this.ChargeData.filter(i => i.yssys !== 2)[index]}
        this.cur_charge.isfree = this.cur_charge.isfree == 2 ? true : false
      } else if (wageinout == 2) {
        this.cur_payment = {...this.PaymentData.filter(i => i.yssys !== 2)[index]}
        this.cur_payment.isfree = this.cur_payment.isfree == 2 ? true : false
      }
    },
    delCost (index, wageinout, row) {
      if (row.isread == 2) {
        return this.$message.error('系统费用不能修改与删除')
      }
      if (row.isOther == 2) {
        return this.$message.error('连带费用不能删除')
      }
      if (this.detailData.status >= 800) {
        return this.$message.error('提交结算后无法删除费用')
      }

      // if (wageinout == 1 && this.charge_confirm) {
      //   return this.$message.error('已确认状态无法删除费用')
      // } else if (wageinout == 2 && this.payment_confirm) {
      //   return this.$message.error('已确认状态无法删除费用')
      // }

      this.$confirm('是否删除费用信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFn.call(this)

      }).catch(() => {

      })

      function delFn () {
        if (this.detailMethod == 'add') {
          if (wageinout == 1) {
            this.ChargeData.splice(index, 1)
          } else if (wageinout == 2) {
            this.PaymentData.splice(index, 1)
          }
          return
        }

        new Promise((resolve, reject) => {
          let data = null
          if (wageinout == 1) {
            data = {guid: this.ChargeData.filter(i => i.yssys !== 2)[index].guid}
          } else if (wageinout == 2) {
            data = {guid: this.PaymentData.filter(i => i.yssys !== 2)[index].guid}
          }

          this.$axios({method: 'delete',url:this.$store.state.webApi+'api/exTransportWage',data: data,loading:true,tip:true})
          .then(result=>{
            resolve(result)
          })

        }).then((result) => {
          if (result.data.resultmessage == '删除成功') {
            this.getWageList()
          }
        })

      }
    },
    paymentWageCanDelete (row) {
      let guid = row.guid
      for (let i in this.ChargeData) {
        if (this.ChargeData[i].isshare == guid && this.ChargeData[i].confirmstatus >= 700) {
          return false
        }
      }
      return true
    },
    confirm (wageinout, confirm) {
      if (this.detailData.status < 500) {
        return this.$message.error('任务未完成无法费用确认')
      }
      if (wageinout == 1) {
        for (let i of this.ChargeData) {
          if (i.yssys !== 2 && i.wageall == 0) {
            return this.$message.error('金额为0无法费用确认')
          }
        }
      }
      if (wageinout == 2) {
        for (let i of this.PaymentData) {
          if (i.yssys !== 2 && i.wageall == 0) {
            return this.$message.error('金额为0无法费用确认')
          }
        }
      }

      let confirmData = null
      let confirm_status = null
      if (wageinout == 1) {
        confirmData = [...this.ChargeData]
      } else if (wageinout == 2) {
        confirmData = [...this.PaymentData]
      }

      this.$confirm(`是否${confirm == 1 ? '取消确认' : '进行确认'}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (confirm == 1) {
          confirmData = confirmData.map(item => {
            // 已确实状态的费用才能修改为未确认状态
            item = {...item, confirmstatus: item.confirmstatus == 700 ? 1 : item.confirmstatus}
            delete item.checked
            return item
          })
        } else {
          confirmData = confirmData.map(item => {
            // 未确认状态的费用才能修改为确认状态
            item = {...item, confirmstatus: item.confirmstatus == 1 ? 700 : item.confirmstatus}
            delete item.checked
            return item
          })
        }
        let data = {
          listWage: confirmData,
          area: this.$store.state.areaState,
          transId: this.detailData.id,
          wageinout: wageinout,
          yqpickupdate: this.detailData.yqpickupdate,
          status: confirm
        }
        this.$axios({method: 'put',url:this.$store.state.webApi+'api/exTransportWage/confirm',data: data,loading:true,tip:true})
        .then(result=>{
          if (result.data.resultstatus == 0) {
            if (wageinout == 1) {
              this.ChargeData = confirmData
            } else if (wageinout == 2) {
              this.PaymentData = confirmData
            }
          }
        })

      }).catch(() => {

      })

    },
    costBill (wageinout) {
      this.confirm_wageinout = String(wageinout)
      this.confirmVisible = true
    },
    back () {
      this.$emit('update:visible', false)
    },
    cancelFinish () {
      let save_data = {
        guid: this.detailData.guid
      }
      this.$axios({method: 'put',url:this.$store.state.webApi+'api/ExTransport/CancelTransport',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.detailData.status = 300
        }
      })
    },
    save (status) {
      if (this.detailData.status >= 500) {
        return this.$message.error('任务完成后无法修改信息')
      }

      let save_data = {json: {...this.detailData}}
      if (status) {
        save_data.json.status = status
      }
      if (status == 500) {
        save_data.json.modifyman = localStorage.getItem('usrname')
        save_data.json.modifydate = new Date().toLocaleString('chinese',{hour12:false})
      }
      save_data.json.fid = this.inputModelData.fid
      save_data.json.gid = this.inputModelData.gid

      let address_type = ['客户地址','机场货站','唯凯仓库']
      save_data.json.address_thrtype = address_type.indexOf(this.sfdtabs) + 1
      save_data.json.address_shrtype = address_type.indexOf(this.mddtabs) + 1

      save_data.json = JSON.stringify(save_data.json)

      save_data.fyWageList = this.ChargeData.concat(this.PaymentData)

      save_data.lyStoreList = this.storeList
      save_data.nodeList = this.nodeList

      this.$axios({method: 'put',url:this.$store.state.webApi+'api/ExTransport/UpdateTransport',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          if (status) {
            this.detailData.status = status
          }
        }
      })
    },
    check_data () {
      if (!this.inputModelData.fid || !this.inputModelData.gid || !this.detailData.yqpickupdate || !this.detailData.piece || !this.detailData.weight || !this.detailData.volume || !this.detailData.yqfinishdate) {
        this.$message.error('请填写完整信息')
        return false
      }
      if (this.sfdtabs == '客户地址') {
        if (!this.detailData.address_thr || !this.detailData.lxr_thr || !this.detailData.phone_thr) {
          this.$message.error('请填写完整信息')
          return false
        }
        if (!this.$refs.thraddress.checkInputRequired()) {
          return this.$message.error('请填写完整信息')
        }

      } else if (this.sfdtabs == '机场货站') {
        if (!this.detailData.terminal_thr) {
          this.$message.error('请填写完整信息')
          return false
        }
      } else if (this.sfdtabs == '唯凯仓库') {
        if (!this.detailData.yjdate || this.storeList.length == 0) {
          this.$message.error('请填写完整信息')
          return false
        }
      }

      if (this.mddtabs == '客户地址') {
        if (!this.detailData.address_shr || !this.detailData.lxr_shr || !this.detailData.phone_shr) {
          this.$message.error('请填写完整信息')
          return false
        }
        if (!this.$refs.shraddress.checkInputRequired()) {
          return this.$message.error('请填写完整信息')
        }
      } else if (this.mddtabs == '机场货站') {
        if (!this.detailData.terminal_shr) {
          this.$message.error('请填写完整信息')
          return false
        }
      } else if (this.mddtabs == '唯凯仓库') {
        if (this.storeList.length == 0) {
          this.$message.error('请填写完整信息')
          return false
        }
      }

      return true
    },
    self_operation (status) {
      if (!this.check_data()) return


      let save_data = {json: {...this.detailData}}

      if (status !== undefined) {
        save_data.json.status = status
        save_data.json.assigndom = localStorage.getItem('dom') || '出口部'
        if (status == 100) {
          save_data.json.assignarea = this.$store.state.areaState
          save_data.json.assignCode = this.getSalesCode(save_data.json.salesarea)
        } else {
          save_data.json.assignarea = ''
        }
      }
      save_data.json.salesarea = this.$store.state.areaState
      save_data.json.salesname = localStorage.getItem('usrname')
      save_data.json.salesCode = this.getSalesCode(save_data.json.salesarea)
      save_data.json.salesdom = localStorage.getItem('dom') || '出口部'

      save_data.json.fid = this.inputModelData.fid
      save_data.json.gid = this.inputModelData.gid

      save_data.json.piece = save_data.json.piece || 0
      save_data.json.weight = save_data.json.weight || 0
      save_data.json.volume = save_data.json.volume || 0

      let address_type = ['客户地址','机场货站','唯凯仓库']
      let address_thrtype = address_type.indexOf(this.sfdtabs) + 1
      let address_shrtype = address_type.indexOf(this.mddtabs) + 1
      save_data.json.address_thrtype = address_thrtype
      save_data.json.address_shrtype = address_shrtype

      save_data.json.system = '联运'
      save_data.json.transType = 1

      let area = this.$store.state.areaState
      if (!area || (area.split(',').length !== 1)) {
        this.$notify.error({
          title: '错误',
          message: '请选择指定区域！',
          duration: 3000
        })
        return
      }else{
        save_data.json.area = area
      }
      //console.log({...save_data.json})

      save_data.json = JSON.stringify(save_data.json)

      save_data.lyStoreList = this.storeList
      save_data.fyWageList = this.ChargeData.concat(this.PaymentData)
      save_data.nodeList = this.nodeList

      save_data.area = area
      save_data.system = '联运'
      save_data.dom = localStorage.getItem('dom') || '出口部'

      if (status == 250) {
        save_data.czType = 1
      } else if (status == 100) {
        save_data.czType = 2
      }

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExTransport',data: save_data,loading:true,tip:false})
      .then(result=>{
        function success () {
          if (status == 100) {
            this.openDetail(result)
          } else {
            this.back()
          }
          this.reset_page()
        }

        if (result.data.resultstatus == 0) {
          if (address_shrtype == 1) {
            this.$refs.shraddress.collectAddress()
          }
          if (address_thrtype == 1) {
            this.$refs.thraddress.collectAddress()
          }
          this.$alert('订单创建成功，订舱编号为'+result.data.resultno, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              success.call(this)
            }
          });
        } else if (result.data.resultstatus == 99) {
          this.$alert(result.data.resultmessage, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              success.call(this)
            }
          });
        } else {
          this.$message.error(result.data.resultmessage)
        }
      })
      .catch(errors=>{
      })
    },
    jsxmdata (jsxm, wageinout) {
      if (wageinout == 1) {
        this.cur_charge.gid = jsxm.id
      } else if (wageinout == 2) {
        this.cur_payment.gid = jsxm.id
      }
    },
    reset_page () {
      this.inputModelData.fid = ''
      this.inputModelData.gid = ''

      let obj = {}
      if (!this.$store.state.areaState.includes(',')) {
        let area = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53).filter(i => i.typename == this.$store.state.areaState)[0].ready06
        obj.shr_jcArea = area
        obj.shr_ckArea = area
        obj.thr_jcArea = area
        obj.thr_ckArea = area
      }
      this.detailData = obj
      // this.detailData = {
      //   gid: '',fid: '',yqpickupdate: '',yjdate: '',piece: null,weight: null,volume: null,mawb: '',yqfinishdate: '',remark: '',address_thrtype: 1,address_thr: '',
      //   address_thrjson: '{"country":"","pro":"","city":"","areade":"","addressjson":""}',
      //   zipcode_thr: '',lxr_thr: "",phone_thr: "",fax_thr: "",email_thr: "",shr_jcArea: "",shr_ckArea: "",terminal_thr: "",storearea_thr: "",store_thr: "",address_shrtype: 1,address_shr: '',
      //   address_shrjson: '{"country":"","pro":"","city":"","areade":"","addressjson":""}',
      //   zipcode_shr: '',lxr_shr: "",phone_shr: "",fax_shr: "",email_shr: "",thr_jcArea: "",thr_ckArea: "",terminal_shr: "",storearea_shr: "",store_shr: ""
      // }
      this.ChargeData = []
      this.PaymentData = []
      this.storeList = []

      Object.keys(this.cur_charge).forEach(key => {
        if (key == 'guid') return this.$delete(this.cur_charge, key)
        if (key == 'gid') return
        this.cur_charge[key] = key == 'isfree' ? false : ''
      })
      Object.keys(this.cur_payment).forEach(key => {
        if (key == 'guid') return this.$delete(this.cur_payment, key)
        if (key == 'gid') return
        this.cur_payment[key] = key == 'isfree' ? false : ''
      })

      this.$refs.thraddress.clear()
      this.$refs.shraddress.clear()
    },
    waizhan (status) {
      if (!this.check_data()) return

      let save_data = {json: {...this.detailData}}

      save_data.json.status = status

      Object.keys(this.distributionData).forEach(key => {
        if (key == 'profitcurrency' || key == 'profitprice' || key == 'profitmode') {
          save_data[key] = this.distributionData[key]
        }
        save_data.json[key] ? '' : save_data.json[key] = this.distributionData[key]
      })

      save_data.json.salesarea = this.$store.state.areaState
      save_data.json.salesCode = this.getSalesCode(save_data.json.salesarea)
      save_data.json.salesdom = localStorage.getItem('dom') || '出口部'

      save_data.json.fid = this.inputModelData.fid
      save_data.json.gid = this.inputModelData.gid

      save_data.json.piece = save_data.json.piece || 0
      save_data.json.weight = save_data.json.weight || 0
      save_data.json.volume = save_data.json.volume || 0

      let address_type = ['客户地址','机场货站','唯凯仓库']
      save_data.json.address_thrtype = address_type.indexOf(this.sfdtabs) + 1
      save_data.json.address_shrtype = address_type.indexOf(this.mddtabs) + 1

      save_data.json.system = '联运'
      save_data.json.transType = 1

      let area = this.$store.state.areaState
      if (!area || (area.split(',').length !== 1)) {
        this.$notify.error({
          title: '错误',
          message: '请选择指定区域！',
          duration: 3000
        })
        return
      }else{
        save_data.json.area = area
      }

      save_data.json = JSON.stringify(save_data.json)

      save_data.lyStoreList = this.storeList
      save_data.fyWageList = this.ChargeData.concat(this.PaymentData)
      save_data.nodeList = this.nodeList

      save_data.area = area
      save_data.system = '联运'
      save_data.dom = localStorage.getItem('dom') || '出口部'

      this.$axios({method:'post',url:this.$store.state.webApi+'api/exTransport/InsertExternal',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (this.detailData.address_shrtype == 1) {
          this.$refs.shraddress.collectAddress()
        }
        if (this.detailData.address_thrtype == 1) {
          this.$refs.thraddress.collectAddress()
        }
        this.distributionVisible = false
        this.back()

        this.reset_page()
      })
      .catch(errors=>{

      })
    },
    assignFn (assignTo) {
      //console.log(assignTo)
      //console.log({...this.distributionData})
      if (!this.detailData.guid) {
        this.waizhan(400)
        return
      }

      let save_data = {}
      for (let key in this.distributionData) {
        if (key == 'salesarea' || key == 'salesname') continue
        save_data[key] = this.distributionData[key]
      }

      if (this.distributionTo == 'wz') {
        if (!save_data.assignarea || !save_data.profitprice || !save_data.profitcurrency) {
          return this.$message.error('请填写完整信息')
        }
      } else if (this.distributionTo == 'bz') {
        save_data.assignarea = this.$store.state.areaState
        save_data.assignCode = this.getAreaCode(save_data.assignarea)
      }

      save_data.ids = String(this.detailData.id)

      //console.log(save_data)
      this.$axios({method:'post',url:this.$store.state.webApi+'api/exTransport/InsertExternalBatch',data:save_data,loading:true,tip:true})
      .then(results=>{
        //console.log(results)
        if (results.data.resultstatus == 0) {
          this.distributionVisible = false
          this.$emit('assignSuccess', this.guid)
          this.back()
        }
      })
      .catch(errors=>{

      })
    },
    submit (status) {
      if (this.detailData.status < 500) {
        return this.$message.error('任务未完成无法提交结算')
      }

      let save_data = {
        submittype: 4,
        guid: this.guid,
        area: this.$store.state.areaState,
        system: '联运',
        status: status
      }

      this.$axios({method:'post',url:this.$store.state.webApi+'api/ExAxplineSubmit',data: save_data,loading:true,tip:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.detailData.status = status
        }
        //console.log(result)
        // this.back()
      })
      .catch(errors=>{

      })
    },
    Accept (status) {
      let guids = this.detailData.guid

      let accept_data = {guids: guids, status: status}
      this.$axios({method:'put',url:this.$store.state.webApi+'api/ExTransport/TransportAcceptance',data: accept_data,loading:true,tip:true})
      .then(results=>{
        //console.log(results)
        if (results.data.resultstatus == 0) {
          this.$emit('acceptSuccess')
          this.back()
        }
      })
      .catch(errors=>{
        if (errors) {
          //console.log(errors)
        }
      })
    },
    openDetail (result) {
      this.$emit('update:visible', false)
      this.$emit('createSuccess', {guid: result.data.resultguid, id: result.data.resultid})
    },
    // mawbVerify (event, item) {
    //   let index = item.mawb.indexOf('-')
    //   if (index !== -1) {

    //     let numArr = item.mawb.split('-')

    //     if (!Number.isInteger(Number(numArr[0]))) {
    //       Message.error('格式错误，请输入正确的格式：000-00000000')
    //     } else if (!Number.isInteger(Number(numArr[1])) || numArr[1].length > 8) {
    //       setTimeout(() => {
    //         item.mawb = item.mawb.slice(0, -1)
    //       },0)
    //     } else {
    //       setTimeout(() => {
    //         item.mawb = numArr[0] + '-' + numArr[1]
    //       }, 0)
    //     }
    //   } else {

    //     if (!Number.isInteger(Number(item.mawb))) {
    //       setTimeout(() => {
    //         item.mawb = item.mawb.slice(0, -1)
    //       },0)
    //       return
    //     }
    //     if (item.mawb.length == 3) {
    //       item.mawb += '-'
    //     }
    //   }
    // },
    getCreditisbackstatus (value) {
      if(String(value).length){
        if(value==3){
          return '已通过'
        }else if(value==4){
          return '待通过'
        } else if (value == 5) {
          return '已驳回'
        }
      }
      return ''
    }
  }
}
</script>

<style lang="less" scoped>
.LyOrderDetail {
  @nodeheight: 80px;
  .node-c {
    height: @nodeheight;
    margin-bottom: 16px;
    transition: .4s height;
    overflow: hidden;
    .node {
      height: @nodeheight;
      border: 1px solid #ccc;
      position: relative;
      .right-text {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      .content {
        margin-top: 14px;
        overflow: hidden;
        .item {
          float: left;
          position: relative;
          margin: 0 20px;
          width: 200px;
          height: 55px;
          i {
            position: absolute;
            top: 14px;
            color: #bcbcbc;
            &::before {
              font-size: 20px;
            }
          }
          .node-exist {
            color: #3366ff;
          }
          div {
            margin-left: 30px;
            span {
              line-height: 24px;
              color: #868686;
            }
            .node-man {
              margin-left: 10px;
              width: 100px;
              /deep/ .el-input__inner {
                height: 24px;
                padding: 3px 3px;
              }
            }
          }
          .el-date-editor {
            margin-left: 0px;
            width: 150px;
            /deep/ .el-input__inner {
              padding: 0 10px;
            }
            /deep/ .el-input__prefix {
              display: none;
            }
          }
        }
        .bg {
          margin-left: 40px;
          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #3366ff;
            border-radius: 50%;
          }
          div {
            p {
              line-height: 48px;
            }
          }
        }
      }
    }
  }
  > .title {
    margin-bottom: 10px;
    p {
      display: inline-block;
      margin-right: 40px;
      font-size: 14px;
    }
    span {
      color: red;
    }
  }

  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    /deep/ .commonTable {
      div {
        padding-bottom: 0 !important;
      }
    }
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
      span {
        cursor: pointer;
        color: #8f8f8f;
      }
      .active {
        color: #0f5a8c;
      }
    }
    .detail-c {
      padding: 20px;
      .basic-form {
        .el-row {
          width: 1120px;
          margin-bottom: 12px;
          &:last-child {
            margin-bottom: 26px;
          }
          &:first-child {
            overflow: hidden;
            > div {
              float: left;
            }
          }
          .el-col {
            span {
              display: inline-block;
              text-align: right;
              width: 106px;
            }
            .el-input {
              width: 170px;
            }
            .pageSelect {
              display: inline-block;
              width: 170px;
            }
            .jzt .el-input {
              width: 48px;
              /deep/ .el-input__inner {
                padding: 0 5px;
              }
            }
          }
        }
        .remark {
          span {
            width: 105px;
            vertical-align: top;
          }
          .el-textarea {
            width: 450px;
          }
        }
      }
    }
    .sfd, .mdd, .charge, .payment {
      margin: 10px 0;
      .contacts {
        float: left;
        margin-right: 5px;
        &.block {
          float: none;
          + .el-row {
            margin-top: 10px;
          }
        }
      }
      .header {
        position: relative;
        .title, .title + div{
          display: inline-block;
          height: 35px;
          line-height: 35px;
          padding-left: 10px;
        }
        .title {
          position: relative;
          color: white;
          margin-right: 30px;
          &:after {
            position: absolute;
            top: 0;
            right: -40px;
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-right: 40px solid transparent;
          }
        }
        .header-right {
          p {
            display: inline-block;
            margin-right: 50px;
          }
          .right-btn {
            position: absolute;
            top: -5px;
            right: 0;
          }
        }
      }
      .content {
        padding: 20px;
        .khdz {
          .el-row {
            margin-bottom: 10px;
            .el-col {
              margin-right: 20px;
            }
          }
        }
        .jchz {
          > div {
            margin-bottom: 10px;
          }
          span, p {
            display: inline-block;
            width: 80px;
            height: 28px;
            line-height: 28px;
          }
        }
        .wecanck {
          > div {
            margin-bottom: 10px;
            span {
              display: inline-block;
              width: 100px;
              height: 28px;
              line-height: 28px;
            }
          }
          .contacts {
            width: 100px;
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
    .sfd {
      @sfdcolor: #09c;
      .title {
        background: @sfdcolor;
        &:after {
          border-bottom: 35px solid @sfdcolor;
        }
      }
      .content {
        border: 1px solid @sfdcolor;
      }
    }
    .mdd {
      @mddcolor: #f89828;
      .title {
        background: @mddcolor;
        &:after {
          border-bottom: 35px solid @mddcolor;
        }
      }
      .content {
        border: 1px solid @mddcolor;
      }
    }
    .charge {
      @chargecolor: #00cc00;
      margin-bottom: 30px;
      .title {
        background: @chargecolor;
        &:after {
          border-bottom: 35px solid @chargecolor;
        }
      }
      .header-right {
        p:first-child {
          color: @chargecolor;
          + p {
            color: #FF9900;
          }
        }
      }
      .content {
        border: 1px solid @chargecolor;
      }
    }
    .payment {
      @paymentcolor: #ff3300;
      .title {
        background: @paymentcolor;
        &:after {
          border-bottom: 35px solid @paymentcolor;
        }
      }
      .header-right {
        p:first-child {
          color: @paymentcolor;
        }
      }
      .content {
        border: 1px solid @paymentcolor;
      }
    }
  }
  .node-status {
    .el-row {
      margin-bottom: 10px;
      &:first-child {
        text-align: center;
      }
      .el-col {
        margin-right: 30px;
      }
      .el-date-editor {
        width: 100%;
      }
    }
  }

  .distribution {
    div {
      margin-bottom: 10px;
      > span:first-child {
        float: left;
        width: 110px;
        text-align: right;
        + div {
          margin-left: 120px;
        }
      }
    }
    .currency {
      > span + div {
        .el-radio {
          width: 125px;
        }
        .el-radio:nth-child(3) {
          margin-left: 0;
        }
      }
    }
    .price {
      .el-input {
        margin-right: 10px;
        width: 150px;
      }
    }
    .fpbl {
      .el-input {
        width: 60px;
        margin: 0 10px;
      }
    }
    .btn-c {
      margin-top: 40px;
      text-align: center;
    }
  }

  .footer {
    margin: 20px 0;
    .btn-c {
      margin: 20px 0;
      overflow: hidden;
      .left-btn {
        float: left;
      }
      .right-btn {
        float: right;
      }
    }
  }

  &.iscancel {
    .content {
      .detail:first-child {
        cursor: not-allowed;
        .basicInformation {
          pointer-events: none;
          /deep/ .el-input__suffix-inner {
            pointer-events: none;
          }
        }
      }
    }
    .isdel {
      cursor: not-allowed;
      .feeInformation {
        pointer-events: none !important;
        div {
          pointer-events: none !important;
        }
        /deep/ .el-input__suffix-inner {
          pointer-events: none;
        }
      }
      .right-btn {
        pointer-events: none;
      }
    }
  }
}
</style>
