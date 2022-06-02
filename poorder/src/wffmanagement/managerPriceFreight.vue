<template>
  <div>
    <div class="page-container-box">
      <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :chinese-where.sync="chineseWhere"
        :pageshow.sync="pageshow"
        :whereTmpShow="false"
        pagetype="1"
        @reset="reset"
      >
        <template :slot="'exForm'">
          <div style="order: 5">
            <div class="input-item">
              <div class="input-title">运价性质</div>
              <div class="input-content">
                <el-select v-model="wecanStandardPage">
                  <el-option
                    v-for="item in wecanStandardPageOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
      </newFormCmpt>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
      </div>
    </div>

    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :chinese-where="chineseWhere"
    >
      <!-- 驳回按钮 -->
      <template
        slot="apprivalStatus"
        slot-scope="props"
      >
        
        <span
          @click="clickEdit(props.data.row)"
          :style="{color: getStatus(props.data.row.approvalStatus,true)}"
        >
          <i class="el-icon-shenhebohui"></i>
          <span>{{getStatus(props.data.row.approvalStatus)}}</span>
        </span>
      </template>
       <!-- 驳回按钮 -->
    </tableCompt>

    <el-dialog
      :title="priceObj.dialogTitle"
      :visible.sync="priceObj.isSHowDialogPage"
      :width="dialogWidth"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <div
        class="page-one"
        v-show="priceObj.isShowPageOne"
      >
        <div
          class="row"
          style="box-shadow: 0px 1px 3px -2px"
        >
          <div class="item15">
            <span>站点:</span><span>{{ priceObj.area }}</span>
          </div>
          <div class="item15">
            <span>创建人:</span><span>{{ priceObj.addman }}</span>
          </div>

          <div class="item15">
            <span>创建时间:</span><span>{{ priceObj.currentDate }}</span>
          </div>
        </div>
        <div class="row block">
          <div style="width: 100%">
            <span class="blue title">路径描述</span>
          </div>
        </div>

        <div
          class="row"
          style="margin-bottom: 10px"
        >
          <div class="item30">
            <page-select
              pagetype="6"
              :modelval.sync="priceObj.sfg"
              type="inline"
              required="tip"
              title="始发港"
            ></page-select>
          </div>
          <div class="arrow item5"></div>
          <div class="item30">
            <page-select
              :titleVariable="true"
              pagetype="6"
              :modelval.sync="priceObj.zzg"
              :title.sync="priceObj.zzgTitle"
              :titleOptions="zzgTitleOptions"
              :disabled="isDisableZzg"
              type="inline"
            ></page-select>
          </div>
          <div class="arrow item5"></div>
          <div class="item30">
            <page-select
              pagetype="6"
              :modelval.sync="priceObj.mdg"
              title="基港"
              type="inline"
              required="tip"
            ></page-select>
          </div>
        </div>
        <div class="row block">
          <div style="width: 100%">
            <span class="blue title">航班描述</span>
          </div>
        </div>
        <div
          class="row"
          style="margin-bottom: 10px"
        >
          <div class="item30">
            <pageSelectMultiple
              :pagetype="11"
              :multiple="true"
              title="航空公司"
              type="inline"
              required="tip"
              :modelval.sync="priceObj.twoCode"
            ></pageSelectMultiple>
          </div>
          <div style="width: 40px"></div>
          <div
            class="item30 descriptionWrap"
            style="height: 31px; line-height: 31px"
          >
            <span
              class="input_title"
              style="padding-right: 10px"
            >航班信息</span>

            <template v-for="item in flightTypeArr">
              <el-radio
                v-model="priceObj.flightType"
                :label="item.label"
                :key="item.value"
              >{{ item.label }}</el-radio>
            </template>
          </div>
          <div style="width: 40px"></div>
        </div>
        <div
          class="row"
          style="min-width: 30%"
          :style="{ width: hbhWidth }"
          v-if="priceObj.isSpecifiedFlight"
        >
          <!-- <pageSelectMultiple
            :pagetype="120"
            :multiple="true"
            title="航班号"
            type="inline"
            :allowCreate="true"
            required="required"
            :filterObj="priceObj.hbhOptionCondition"
            :modelval.sync="priceObj.hbhStr"
          ></pageSelectMultiple> -->
          <transferBox
            :pagetype="120"
            title="航班号"
            type="inline"
            :allowCreate="true"
            required="true"
            :filterObj="priceObj.hbhOptionCondition"
            :modelval.sync="priceObj.hbhArr"
          ></transferBox>
        </div>
        <div
          class="row"
          style="margin-top: 10px"
        >
          <div
            class="item30 descriptionWrap"
            style="height: 31px; line-height: 31px; display: flex"
          >
            <span
              class="input_title"
              style="padding-right: 10px"
            >时间期限</span>
            <el-date-picker
              style="width: 205px"
              v-model="priceObj._timeSpan"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>

          <div class="item5"></div>
          <div
            class="item30 descriptionWrap"
            style="height: 31px; line-height: 31px"
          >
            <span
              class="input_title"
              style="padding-right: 10px"
            >计费方式</span>
            <el-radio
              v-model="priceObj.jfType"
              label="计重"
            >计重</el-radio>
            <el-radio
              v-model="priceObj.jfType"
              label="毛重"
            >毛重</el-radio>
          </div>
        </div>
        <div
          class="row"
          style="margin-top: 10px"
        >
          <span style="line-height: 28px; padding-right: 10px">清关后预计</span>

          <el-select
            v-model.sync="priceObj.limitDay"
            style="
              height: 28px;
              width: 68px;
              background: #fffcf0;
              border: 1px solid #dcdfe6;
              border-radius: 4px;
            "
          >
            <el-option
              v-for="item in limitDayArr"
              :key="item ^ 101"
              :label="item + '天'"
              :value="item"
            >
            </el-option>
          </el-select>
          <span style="line-height: 28px; padding-left: 10px">到达目的港(航班准点情况下)</span>
        </div>
        <!--运价性质 第三大块-->
        <div class="row block">
          <div style="width: 100%">
            <span class="blue title">运价性质</span>
          </div>
        </div>
        <div
          class="row"
          style="margin-top: 10px"
        >
          <div
            class="item30"
            style="height: 31px; line-height: 31px"
          >
            <template v-for="item in wecanStandardOpts">
              <el-radio
                v-model="wecanStandard"
                :label="item.label"
                :key="item.value"
              >{{ item.label }}</el-radio>
            </template>
          </div>
          <div style="width: 40px"></div>
          <div
            class="item30"
            v-show="!isWecanStandard"
          >
            <page-select
              :pagetype="13"
              :wageinout="1"
              title="委托客户"
              type="inline"
              required="tip"
              :modelval.sync="priceObj.gid"
            >
            </page-select>
          </div>
        </div>

        <!-- <div class="row">
          <card-block
            :dataArr.sync="priceObj.weightArr"
            :title="cardTitle.weight"
            class="card-block"
            :hasContent="true"
            :hasSeed="true"
            :isNeedBan="true"
            :indexSelected.sync="priceObj.weightIndex"
          ></card-block>
          <card-block
            :dataArr.sync="priceObj.packageTypeArr"
            :title="cardTitle.packageType"
            class="card-block"
            :hasContent="true"
            :hasSeed="true"
            :isNeedBan="true"
            :indexSelected.sync="priceObj.packageIndex"
          ></card-block>

          <card-block
            :dataArr.sync="priceObj.volArr"
            :title="cardTitle.vol"
            :isNeedBan="true"
            class="card-block"
            :hasContent="true"
            :hasSeed="true"
            :indexSelected.sync="priceObj.volIndex"
          ></card-block>

          <card-block
            v-show="isWecanStandard"
            :dataArr.sync="priceObj.cusArr"
            :title="cardTitle.cus"
            :isNeedBan="true"
            class="card-block"
            :hasContent="true"
            :hasSeed="true"
            :indexSelected.sync="priceObj.cusIndex"
          ></card-block>
        </div> -->

        <div class="row block">
          <div
            style="width: 100%"
            class="blue title"
          >
            <span>请填写各重量的运价</span>
          </div>
        </div>
        <div class="row">
          <div class="item100 table-wrap">
            <table
              class=""
              style="width: 800px"
             
            >
              <tbody>
                <tr>
                  <template v-for="item in priceObj.weightArr">
                    <td
                      class="greyBg"
                      style="padding: 5px 15px"
                    >
                      {{ item.title }}
                    </td>
                  </template>
                </tr>
                <tr>
                  <template v-for="(item, index) in priceObj.weightArr">
                    <td style="padding: 5px 15px">
                      <input
                        type="input"
                        class="price-input"
                        v-model.sync="item.standardPrice"
                      />
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="page-two"
        v-show="priceObj.isShowPageAddOrEdit"
      >
        <div class="row">
          <div class="twocode-wrap">
            <div>
              <table class="">
                <tbody>
                  <tr>
                    <td class="">始发港</td>
                    <td class=""></td>
                    <td class="">中转港</td>
                    <td class=""></td>
                    <td class="">目的港</td>
                    <td class="">航司二字码</td>
                    <td class="">航班号</td>
                    <td class="">服务描述</td>
                  </tr>
                  <tr>
                    <td class="big">{{ priceObj.sfg }}</td>
                    <td class="">
                      <div class="arrow"></div>
                    </td>
                    <td class="zzgFont">{{ priceObj.zzg }}</td>
                    <td class="">
                      <div class="arrow"></div>
                    </td>
                    <td class="big">{{ priceObj.mdg }}</td>
                    <td class="big">{{ priceObj.twoCode }}</td>
                    <td
                      class="blueText weight"
                      style="font-size: 16px"
                    >
                      {{ priceObj.hbhStr }}
                    </td>
                    <td
                      class="blueText weight"
                      style="font-size: 16px"
                    >
                      清关后预计{{ priceObj.limitDay }}天到达目的港
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- <div class="template" v-if="true">
              <el-select
                v-model="priceObj.selectedTemplate"
                placeholder="请选择套用模板"
              >
                <el-option
                  v-for="item in priceObj.twocodeTemplateArr"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div> -->
        </div>
        <div
          class="row"
          style="box-shadow: 0 1px 3px -2px; margin-bottom: 10px"
        >
          <div
            class="timespan-wrap"
            v-if="priceObj.isEditMode"
          >
            <template v-for="(item, index) in priceObj.currentAirComTimeArr">
              <div
                class="time-selector"
                v-bind:class="{
                  active:
                    item.basicInfo.guid == priceObj.currentFeeid ? true : false,
                }"
                @click="clickTimeSelector(item.basicInfo.guid)"
              >
                {{ item.basicInfo.startdate }} -
                {{ item.basicInfo.enddate.substring(0, 10) }}
              </div>
            </template>
          </div>
        </div>
        <!-- <div v-if="priceObj.isSpecifiedFlight" style="box-shadow: 0 1px 3px -2px; margin:20px 0">
        <div class="row" style="margin:10px 0">
          <div class="item100">
            <span class="pageTwoTitle">航班信息</span>
          </div>
        </div>
        <div class="row">
          <el-tabs v-model="hbhTabVal" type="card" @tab-click="" style="width:100%">
            <template v-for="(item, index) in priceObj.hbhArr">
              <el-tab-pane :label="item.hbh" :name="item.hbh">
                <div class="row">
                  <div class="item10">航班时刻周期</div>
                  <div class="item60">
                    {{void(scheduleArr=item.schedule.split(','))}}
                    <template v-for="(s) in scheduleArr">
                      <span class="blueText" style="margin:0 10px;">{{convertIntToWeek(s*1)}}</span>
                    </template>
                  </div>
                </div>
           
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
        </div> -->
        <div class="row">
          <div class="item100">
            <span class="pageTwoTitle">运价基础参数</span>
          </div>
        </div>
          <!--钩稽关系维护start-->
        <div class="row relation-wrap">
          <div class="item10 operate-title">客户参数</div>
          <div class="item75" style="display: flex">
            <template> </template>
            <template v-for="(item, index) in priceObj.cusArr">
              <div
                class="operate-tag nohover"
                style="cursor: not-allowed"
                v-show="item.isAdd"
              >
                <span>{{ item.title }}</span>
              </div>
            </template>
          </div>
          <div class="item5"></div>
          <div class="item10" v-show="false">
            <div
              class="operate-edit"
              @click="priceObj.openRelationDialog('cus')"
            >
              <span class="el-icon-setting"></span><span>编辑</span>
            </div>
          </div>
        </div>
        <div class="row relation-wrap">
          <div class="item10 operate-title">包装参数</div>
          <div class="item75" style="display: flex">
            <template v-for="(item, index) in priceObj.packageTypeArr">
              <div
                class="operate-tag nohover"
                style="cursor: not-allowed"
                v-show="item.isAdd"
              >
                <span>{{ item.title }}</span>
              </div>
            </template>
          </div>
          <div class="item5"></div>
          <div class="item10" v-show="false">
            <div
              class="operate-edit"
              @click="priceObj.openRelationDialog('package')"
            >
              <span class="el-icon-setting"></span><span>编辑</span>
            </div>
          </div>
        </div>
        <div class="row relation-wrap">
          <div class="item10 operate-title">货型参数</div>
          <div class="item75" style="display: flex">
            <template v-for="item in priceObj.volArr">
              <div class="operate-tag nohover" style="cursor: not-allowed" v-show="item.isAdd">
                <span>{{ item.title }}</span>
              </div>
            </template>
          </div>
          <div class="item5"></div>
          <div class="item10" v-show="false">
            <div
              class="operate-edit"
              @click="priceObj.openRelationDialog('vol')"
            >
              <span class="el-icon-setting"></span><span>编辑</span>
            </div>
          </div>
        </div>
        <!--钩稽关系end-->
        <div
          style="width: 100%"
          v-if="priceObj._currentPageMode == pageMode.pageConfirm"
        >
      
          <div
            class="row"
            style="margin: 10px 0; width: 100%"
          >
            <!-- <div style="width: 42%">
              <div class="tab-wrap">
                <span class="tab" v-if="priceObj.isSelectPackage">
                  <span
                    class="tab-item"
                    v-for="(item, index) in priceObj.packageTypeArr"
                    v-bind:class="{
                      active:
                        index == priceObj.packageDisplayIndex ? true : false,
                    }"
                    @click="priceObj.packageDisplayIndex = index"
                    >{{ item.code }}</span
                  >
                </span>
                <span class="tab" v-if="priceObj.isSelectCus">
                  <span
                    class="tab-item"
                    v-for="(item, index) in priceObj.cusArr"
                    v-bind:class="{
                      active: index == priceObj.cusDisplayIndex ? true : false,
                    }"
                    @click="priceObj.cusDisplayIndex = index"
                    >{{ item.code }}</span
                  >
                </span>
              </div>
            </div> -->
            <!-- <div
              class=""
              style="width: 90%; line-height: 39px; display: flex; justify-content: end;"
            >
              <el-button
                type="success"
                @click="priceObj.isShowImportData = true"
              >导入数据</el-button>
              <el-button
                type="success"
                @click="priceObj.loadIataPrice()"
              >TACT运价表查询</el-button>
            </div> -->

              <!--快捷组合切换-->
          <div class="row relation-wrap" style="box-shadow: unset">
            <template v-for="(item, i) in priceObj.cusPackageIndexArr">
              <div
                class="operate-tag"
                style="width: unset; padding: 0 5px"
                v-bind:class="{
                  active: priceObj.tabDisplayIndex == i,
                }"
                @click="priceObj.tabDisplayIndex = i"
              >
                <span>{{ item.cusTitle }}</span>
                <span>;</span>
                <span>{{ item.pTitle }}</span>
              </div>
            </template>
          </div>
          <div class="row disabled" >
            <div class="table-wrap price-preview">
              <table id="tbPricePreview">
                <tbody>
                  <tr>
                    <td style="height: 26px"></td>
                    <td
                      style="height: 30px; width: 85px; cursor: pointer"
                      v-for="(weight, j) in priceObj.weightArr"
                      class="operate-head"
                      @mouseenter="activeColumn(j)"
                      @mouseleave="activeColumn(j)"
                    >
                      <span>{{ weight.title }}</span>
                      <!-- <span
                        style="display: none"
                        class="circle-del"
                        @click="priceObj.delTitle(j, null)"
                      >
                        <i class="el-icon-close"></i>
                      </span> -->
                    </td>
                  </tr>
                 <template v-for="(vol, i) in priceObj.tableVolArr">
                     {{ void (realVol = getRealVol(vol.code)) }}
                      <tr v-if="realVol.isAdd">
                    <td
                      class="operate-head"
                      @mouseenter="activeRow(i)"
                      @mouseleave="activeRow(i)"
                    >
                      <span :class="{ blue: vol.isDefault == 1 }">{{
                        vol.code
                      }}</span>
                      <!-- <span
                        style="display: none"
                        class="circle-del"
                        @click="priceObj.delTitle(null, i)"
                      >
                        <i class="el-icon-close"></i>
                      </span> -->
                    </td>
                    <template v-for="(weight, j) in priceObj.weightArr">
                      {{
                        void (isShowFixed = priceObj.isDisplayPriceActive(
                          createFixedPriceKey(vol, weight)
                        ))
                      }}
                      {{ void (cellValue = setCellValue(vol, weight)) }}
                
                      <td
                        style="width: 68px; height: 26px; cursor: pointer"
                        v-bind:class="{
                          greyBg: cellValue == '--',
                        }"
                      >
                        <input
                          type="input"
                          @click="
                            priceObj.activeFixedPrice(
                              vol,
                              weight,
                              setCellValue(vol, weight)
                            )
                          "
                          class="price-input"
                          :class="{ blue: vol.isDefault == 1 }"
                          v-model="cellValue"
                          v-show="!isShowFixed"
                        />
                        <input
                          class="price-input"
                          v-if="isShowFixed"
                          type="input"
                          @blur="
                            priceObj.cusPackageIndexArr[
                              priceObj.tabDisplayIndex
                            ]['fixedMap'][
                              createFixedPriceKey(vol, weight)
                            ].diff = priceObj.cusPackageIndexArr[
                              priceObj.tabDisplayIndex
                            ]['fixedMap'][
                              createFixedPriceKey(vol, weight)
                            ].diff > 0 ? (priceObj.cusPackageIndexArr[
                              priceObj.tabDisplayIndex
                            ]['fixedMap'][
                              createFixedPriceKey(vol, weight)
                            ].diff*1).toFixed(2) : '';
                            priceObj.autoFillFixedPrice(j,i);
                          "
                          v-model.sync="
                            priceObj.cusPackageIndexArr[
                              priceObj.tabDisplayIndex
                            ]['fixedMap'][createFixedPriceKey(vol, weight)].diff
                          "
                        />
                      </td>
                    </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>

        <div
          class="row"
          style="margin-top: 20px"
        >
          <span
            class="blueText weight"
            style="font-size: 16px"
          >报价描述</span>
        </div>
        <div class="row">
          <div class="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="备注"
              v-model="priceObj.remark"
              :disabled="priceObj.disabled"
            >
            </el-input>
          </div>
        </div>
        <div
          class="row"
          v-if="priceObj.standardPrice > 0"
        ></div>

          <!-- 驳回历史 -->
        <div style="margin-top: 20px;">
            <p @click="historyPaneOne=!historyPaneOne"  style="text-align:center;margin-top:18px; cursor: pointer;" v-if="rejectRecord.length">
              <i :class="historyPaneOne?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              {{historyPaneOne?'收起':'展开'}}驳回历史记录
          </p>
          <el-collapse-transition>
              <div v-show="historyPaneOne">
              <div ex="驳回历史记录"  class="wagediv">
                <div v-for="(item,index) in rejectRecord" class="rightWageitem">
                  <p style="align-items: baseline">
                    <!-- <span class="el-icon-user-solid" :style="{color:item.initiator==initiator?'#5ABFFF':'#F9A527'}"></span> -->
                    <span style="margin:0 12px">{{item.addman}}</span>
                    <span style="color:#B0B0B0;">{{item.addtime}}</span>
                  </p>
                  <p style="text-align: left !important;">{{item.remark}}</p>
                </div>
              </div>
            </div> 
          </el-collapse-transition>
        </div>
        <!-- 驳回历史 -->

      </div>
      <div
        class="bottom-wrap"
        style=""
      >
        <!-- <el-button
          v-show="priceObj.isShowConfirmBtn"
          style="margin-left: 10px"
          type="primary"
          @click="priceObj.resetFixedPrice()"
          >重置一口价</el-button
        > -->
        <!-- <el-button
          type="primary"
          style="margin-left: 10px"
          v-show="priceObj.isShowNextBtn"
          @click="priceObj.clickNext()"
        >下一步</el-button>
        <el-button
          type="primary"
          v-show="priceObj.isShowConfirmBtn"
          @click="priceObj.clickSave()"
        >保存</el-button>
        <el-button
          type="primary"
          v-show="priceObj.isShowSaveAs"
          @click="priceObj.savePrice()"
        >另存为</el-button>
        <el-button
          type="danger"
          v-show="priceObj.isShowDelBtn"
          @click="deleteFee()"
        >删除</el-button> -->
        <el-button type="success" 
          :disabled="rejectStatus"
          @click="confirmReject(2)">
          同意
        </el-button>

        <el-button 
        :disabled="rejectStatus"
        type="danger"
         @click="rejectDialogVisible = true">
          驳回
        </el-button>

        <el-button
          v-show="priceObj.isShowCancelBtn"
          @click="closeDialog"
        >取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="导入数据"
      :visible.sync="priceObj.isShowImportData"
      :width="'50%'"
      :close-on-click-modal="false"
      :before-close="closeImportDialog"
    >
      <div style="height: 600px; width: 100%">
        <div class="row">请选择要复制的目标</div>
        <div class="row">
          <div class="tab-wrap">
            <span
              class="tab"
              v-if="priceObj.isSelectPackage"
            >
              <span
                class="tab-item"
                v-for="(item, index) in priceObj.packageTypeArr"
                v-bind:class="{
                  active: index == priceObj.packageImportIndex ? true : false,
                }"
                @click="priceObj.packageImportIndex = index"
              >{{ item.code }}</span>
            </span>
            <span
              class="tab"
              v-if="priceObj.isSelectCus"
            >
              <span
                class="tab-item"
                v-for="(item, index) in priceObj.cusArr"
                v-bind:class="{
                  active: index == priceObj.cusImportIndex ? true : false,
                }"
                @click="priceObj.cusImportIndex = index"
              >{{ item.code }}</span>
            </span>
          </div>
        </div>
        <div
          class="row"
          style="margin: 10px 0"
        >
          <div class="item75 tips">
            请选择需要导入的数据(点击<span>单元格表头</span>)或<span>单个单元格</span>进行选择)
          </div>
          <div class="item25 seed-wrap">
            在此基础<span
              @click="priceObj.isCopySeedPlus = true"
              v-bind:class="{ active: priceObj.isCopySeedPlus }"
            >增加</span>
            <span
              @click="priceObj.isCopySeedPlus = false"
              v-bind:class="{ active: !priceObj.isCopySeedPlus }"
            >减去</span>
            <input
              style=""
              type="input"
              v-model.sync="priceObj.copySeed"
            />元
          </div>
        </div>
        <div class="row">
          <div class="table-wrap">
            <table
              onselectstart="return false;"
              style="cursor: pointer"
              v-if="priceObj.isShowImportData"
            >
              <tbody>
                <tr>
                  <td
                    style="height: 30px"
                    v-bind:class="{
                      active: priceObj.priceCopyMap[priceObj.createAllKey()]
                        ? priceObj.priceCopyMap[priceObj.createAllKey()]
                            .isActive
                        : false,
                    }"
                    @click="priceObj.activeAll()"
                  >
                    全选
                  </td>
                  <template v-for="(weight, j) in priceObj.weightArr">
                    {{ void (headKey = createHeadKey(null, weight)) }}
                    <td
                      style="height: 30px; width: 68px"
                      @click="priceObj.activeWeightColumn(j)"
                      v-bind:class="{
                        active: priceObj.priceCopyMap[headKey]
                          ? priceObj.priceCopyMap[headKey].isActive
                          : false,
                      }"
                    >
                      {{ weight.title }}
                    </td>
                  </template>
                </tr>
                <template v-for="(vol, i) in priceObj.volArr">
                  {{ void (volHeadKey = createHeadKey(vol, null)) }}

                  <tr>
                    <td
                      style="padding: 0 10px"
                      @click="priceObj.activeVolRow(i)"
                      v-bind:class="{
                        active: priceObj.priceCopyMap[volHeadKey]
                          ? priceObj.priceCopyMap[volHeadKey].isActive
                          : false,
                      }"
                    >
                      {{ vol.code }}
                    </td>
                    <template v-for="(weight, j) in priceObj.weightArr">
                      {{ void (fixedKey = createImportPriceKey(vol, weight)) }}
                      {{
                        void (isShowFixed =
                          priceObj.isDisplayPriceActive(fixedKey))
                      }}
                      {{
                        void (cellValue = setCellValue(
                          vol,
                          weight,
                          priceObj.packageImportIndex,
                          priceObj.cusImportIndex
                        ))
                      }}
                      {{
                        //此处 render 的时候会重复调用 如果出现性能问题则应该写在js文件内部  目前问题不大
                        void (
                          priceObj.priceCopyMap[fixedKey] ||
                          priceObj.initPriceCopyMap(
                            i,
                            j,
                            isShowFixed,
                            cellValue
                          )
                        )
                      }}
                      <td
                        style="width: 68px; height: 30px; cursor: pointer"
                        class=""
                        v-bind:class="{
                          greyBg: cellValue == '--',
                          active: priceObj.priceCopyMap[fixedKey]
                            ? priceObj.priceCopyMap[fixedKey].isActive
                            : false,
                        }"
                        @click="priceObj.activeTd(i, j)"
                      >
                        <input
                          type="input"
                          class="price-input"
                          v-model="cellValue"
                          v-if="!isShowFixed"
                          v-nofocus
                        />

                        <input
                          class="price-input"
                          v-if="isShowFixed"
                          type="input"
                          v-nofocus
                          v-model.sync="priceObj.priceDisplayMap[fixedKey].diff"
                        />
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div
          class="row"
          style="justify-content: flex-end"
        >
          <div>
            <el-button
              type="primary"
              @click="priceObj.confirmImport()"
            >确认导入</el-button>
            <el-button @click="closeImportDialog()">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="TACT运价"
      :visible.sync="priceObj.isShowIataDialog"
      :width="'50%'"
      :close-on-click-modal="false"
    >
      <div
        v-if="priceObj.isShowIataDialog"
        style="width: 100%; height: 300px"
      >
        <el-tabs
          v-model="priceObj.tactTwocode"
          type="card"
          @tab-click=""
        >
          <template v-for="item in priceObj.singleTwoCodeArr">
            <el-tab-pane
              :label="item"
              :name="item"
            >
              <table class="iata-table">
                <thead>
                  <tr>
                    <td>M</td>
                    <td>N</td>
                    <td>45</td>
                    <td>100</td>
                    <td>300</td>
                    <td>500</td>
                    <td>1000</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="priceObj.iataMap[item]">
                    <td>
                      {{ priceObj.iataMap[item].M }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item].N }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item]["45"] }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item]["100"] }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item]["300"] }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item]["500"] }}
                    </td>
                    <td>
                      {{ priceObj.iataMap[item]["1000"] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- 客户参数 && 货形参数 && 尺寸参数 -->
    <el-dialog
      :title="relationEditTitle"
      :visible.sync="priceObj.isShowRelationEdit"
      :width="'40%'"
    >
      <div
        class="row relation-edit-wrap"
        style="border-bottom: 1px solid #dedede"
      >
        <template v-for="(item, index) in priceObj.currentRelationEditArr">
          <div
            class="title"
            v-show="item.isSelect || item.isAdd"
          >
            <span>{{ item.title }}</span>
          </div>
        </template>
        <div
          class="plus"
          v-show="relationEditTitle != relationTitle.vol && !priceObj.disabled"
        >
          <el-popover
            placement="right-end"
            width="400"
            trigger="click"
            v-model="isShowRelationPop"
          >
            <div
              class="row relation-edit-wrap"
              style="height: 100px"
            >
              <template v-for="(item, index) in priceObj.currentRelationEditArr">
                <div
                  class="title"
                  v-bind:class="{
                    active: item.isSelect,
                  }"
                  v-show="!item.isAdd"
                  @click="priceObj.selectRelationTitle(index)"
                >
                  <span>{{ item.title }}</span>
                </div>
              </template>
            </div>
            <div
              class="row"
              style="float: right"
            >
              <el-button
                type="primary"
                @click="isShowRelationPop = false"
              >关闭</el-button>
            </div>
            <span
              slot="reference"
              class="el-icon-plus"
            ></span>
          </el-popover>
        </div>
      </div>
      <div
        class="row"
        style="margin: 15px 0; line-height: 15px"
      >
        <div class="item20"><span>是否开启价格间联动</span></div>

        <el-radio
          v-model="priceObj.currentRelationMap.hasRelation"
          :label="true"
          :disabled="priceObj.disabled"
        >是</el-radio>
        <el-radio
          v-model="priceObj.currentRelationMap.hasRelation"
          :label="false"
          :disabled="priceObj.disabled"
        >否</el-radio>
      </div>
      <div
        v-show="priceObj.currentRelationMap.hasRelation"
        style=""
      >
        <div
          class="row"
          style="margin: 10px 0"
        >
          <span
            class="weight"
            style="font-size: 16px"
          >请选择基点</span>
        </div>
        <div class="row">
          <span>请输入与基点的价格差(例如:+1 +2 -2)</span>
        </div>
        <div class="row">
          <card-block
            :dataArr.sync="priceObj.currentRelationEditArr"
            class="card-block"
            :hasContent="true"
            :hasSeed="false"
            :isNeedBan="true"
            :indexSelected.sync="priceObj.currentRelationMap.baseIndex"
          >
          </card-block>
        </div>
      </div>
      <div
        class="row"
        style="justify-content: flex-end"
      >
        <div class="item10">
          <el-button
            type="primary"
            @click="priceObj.confirmRelation()"
            v-if="!priceObj.disabled"
          >确认</el-button>
        </div>
        <div class="item10">
          <el-button
            type=""
            @click="priceObj.cancelRelation()"
          >取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 客户参数 && 货形参数 && 尺寸参数=>结束 -->

    <el-dialog
      :visible.sync="priceObj.isShowClearDialog"
      :width="'40%'"
    >
      <div class="row">
        <span
          class="blueText weight"
          style="font-size: 20px"
        >{{
          priceObj.clearDataTitle
        }}</span>
      </div>
      <div class="row clear-current-select">
        <span style="line-height: 28px">当前选择</span>
        <template v-for="(item, index) in priceObj.cusArr">
          <span
            class="blueText span"
            v-if="priceObj.cusDisplayIndex == index"
          >{{ item.title }}</span>
        </template>
        <template v-for="(item, index) in priceObj.packageTypeArr">
          <span
            class="blueText span"
            v-if="priceObj.packageDisplayIndex == index"
          >{{ item.title }}</span>
        </template>
      </div>
      <div
        class="row"
        style="margin-top: 20px; font-size: 16px; line-height: 20px"
        v-show="priceObj.isShowUnSelectedWrap"
      >
        <span>是否同步删除</span>
        <template v-for="(item, index) in priceObj.cusArr">
          <span
            class="blueText span"
            v-if="item.isAdd && priceObj.cusDisplayIndex != index"
          >{{ item.title }}</span>
        </template>
        <template v-for="(item, index) in priceObj.packageTypeArr">
          <span
            class="blueText span"
            v-if="item.isAdd && priceObj.packageDisplayIndex != index"
          >{{ item.title }}</span>
        </template>
        <span>参数下的内容</span>
        <el-radio
          v-model="priceObj.isDelRelationSync"
          :label="true"
        >是</el-radio>
        <el-radio
          v-model="priceObj.isDelRelationSync"
          :label="false"
        >否</el-radio>
      </div>
      <div
        class="row"
        style="justify-content: flex-end"
      >
        <div class="item10">
          <el-button
            type="primary"
            @click="priceObj.clearData()"
          >确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 驳回原因 -->
    <el-dialog
      :visible.sync="rejectDialogVisible"
      append-to-body
      width="60%">
      <div slot="title">
        <div style="text-align: center;" class="el-dialog__title">驳回详情</div>
      </div>
      <div class="reject-wrapper">
        <span style="width: 80px;">驳回理由：</span>
        <el-input type="textarea" placeholder="请输入" 
          :rows="4"
          :autosize="false"
          v-model="rejectReason"
        ></el-input>
      </div>

      <!-- 驳回历史 -->
      <p @click="historyPane=!historyPane"  style="text-align:center;margin-top:18px; cursor: pointer;" v-if="rejectRecord.length">
        <i :class="historyPane?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
        {{historyPane?'收起':'展开'}}驳回历史记录
    </p>
     <el-collapse-transition>
        <div v-show="historyPane">
        <div ex="驳回历史记录"  class="wagediv">
          <div v-for="(item,index) in rejectRecord" class="rightWageitem">
            <p style="align-items: baseline">
              <!-- <span class="el-icon-user-solid" :style="{color:item.initiator==initiator?'#5ABFFF':'#F9A527'}"></span> -->
              <span style="margin:0 12px">{{item.addman}}</span>
              <span style="color:#B0B0B0;">{{item.addtime}}</span>
            </p>
            <p style="text-align: left !important;">{{item.remark}}</p>
          </div>
        </div>
      </div> 
    </el-collapse-transition>
     <!-- 驳回历史 -->

      <div slot="footer">
        <el-button type="primary" @click="confirmReject(1)">确认驳回</el-button>
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        
      </div>
    </el-dialog>
  </div>
</template>
<script>
import MultiSelect from "../components/smallTemplate/multiSelect.vue";
import pageSelectMultiple from "@/components/smallTemplate/pageSelectMultiple.vue";
import PageSelect from "../components/smallTemplate/pageSelect.vue";
import transferBox from "./components/transferBox.vue";
import {
  pageMode,
  pageType,
  specifiedFlight,
  allFlight,
  zzgTitle,
  relationEditTitle,
} from "./js/priceFreight";
import { priceFreightEditView } from "./js/priceFreightEditMode";
import cardBlock from "./components/cardBlock.vue";
import { cardTitle } from "./js/cardBlock";
import { Switch } from 'element-ui';

import {
    formatDate
  } from "../api/localStorage.js";

const normalCus = "公布运价";

const singleCus = "客户报价";

export default {
  name: "managerPriceFreight",

  data() {
    return {
      rejectDialogVisible: false, // 驳回详情弹出框
      rejectReason: '', // 驳回理由
      historyPaneOne: false, // 同意下面驳回理由
      historyPane: false, // 驳回历史
      currentRejectReocrd: {},
      usrname: localStorage.getItem("usrname"),
      window: window,
      name: "managerPriceFreight.vue",
      wecanStandard: normalCus, //新增编辑的normalCus
      wecanStandardPage: "全部", //查询页的normalCus
      wecanStandardPageOpts: [
        { label: "全部", value: "全部" },
        { label: normalCus, value: normalCus },
        { label: singleCus, value: singleCus },
      ],
      wecanStandardOpts: [
        { label: normalCus, value: normalCus },
        { label: singleCus, value: singleCus },
      ],

      flightTypeArr: [
        { label: allFlight, value: allFlight },
        { label: specifiedFlight, value: specifiedFlight },
      ],
      limitDayArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      hbhTabVal: "",
      zzgTitleOptions: [{ value: zzgTitle.direct }, { value: zzgTitle.trans }],
      inputViewData: {
        //wagestandard: { title: '标准', type: 4, options: [{ label: 'normalCus', value: 'normalCus' }, { label: '客户标准', value: '客户标准' }] },
      },
      inputModelData: { sfg: "", mdg: "", zzg: "",approvalStatus:"100",
        validityDate: {
          begin: '',
          end: '',
        }

      },
      dialogWidth: "1068px",
      searchData: {},
      tableDataRes: [],
      chineseWhere: [],
      pageshow: true,
      priceObj: new priceFreightEditView(this),
      pageMode: pageMode,

      isShowRelationPop: false,
      cardTitle: cardTitle,
      relationEditTitle: relationEditTitle.cus,
      relationTitle: relationEditTitle,
      // mergeRowFields: {
      //   sfg: { key: ["sfg", "mdg", "zzg"], rowspanArr: [] },
      //   mdg: { key: ["sfg", "mdg", "zzg"], rowspanArr: [] },
      //   zzg: { key: ["sfg", "mdg", "zzg"], rowspanArr: [] },
      //   operate: { key: ["sfg", "mdg", "zzg"], rowspanArr: [] },
      // }, //分组字段根据什么分组 数组为rowspan起始索引数组举例[0,6,8]表示 第0个td rowspan 到 第5个 0-5 总计六个 然后 8-2 从 索引6的td rowspan=2
    };
  },
  components: {
    MultiSelect,
    pageSelectMultiple,
    PageSelect,
    cardBlock,
    transferBox,
  },
  methods: {
      //取实际 vol
    getRealVol(code) {
      return this.priceObj.volArr.find((f) => {
        return f.code == code;
      });
    },

    /**
     * @desc 确认驳回
     * @param {type} number 1：驳回 2：确认
     */
    confirmReject(type) {
      let url = this.$store.state.feeWebApi + "airFreightFee/approve";
      let status = type == 2; // 是否确认

      if (!status) { // 驳回时校验，是否填写驳回原因
        if (!this.rejectReason) {
          this.$message.error('请填写驳回原因')
          return ;
        }
      }
      
      // 驳回记录
      let data = {
          feeid: this.priceObj.props.feeid,
          remark: status ? '同意' : this.rejectReason,
          approvalStatus: status ? '200' : '500',
      };

        this.$axios({ method: "post", url, data, loading: true, tip: false }).then(results=>{
        if(results.data.resultstatus == 0){
          if ( type == 1) { //驳回成功 => 把新驳回的原因添加到驳回记录里
            this.rejectDialogVisible = false;
           this.closeDialog();
            this.currentRejectReocrd = {
              addman: this.usrname,
              addtime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
              remark: this.rejectReason
            }
          } else {
             this.closeDialog()
          }
          this.$message.success(`${ status ? "同意" : "驳回"} 成功`);

          this.search() // 重新寻找一遍
        }else{
          this.$message.error(results.data.resultmessage||'系统异常，请联系后台管理人员')
        }
      })
    },


    /**
     *@param status {number} 状态
     */
    getStatus(status, type){
      switch(status) {
        case 100:
          return type? '#FF9200': '待审核';
          break;
        case 200:
          return type? '#519D1A' : '已通过';
          break;
        case 500:
          return type? '#EB0000' : '已驳回';
          break;
        default:
          return ''
      }
    },

    /**
     * 查询
     * 公布运费查询 按 sfg mdg zzg twocode分组
     *  如果是客户运费查询 列表需要加入客户作为分组条件
     */
    search() {
      let where = {};
      this.addSearchCondition("sfg", where, "sfg");
      this.addSearchCondition("mdg", where, "jg");
      this.addSearchCondition("zzg", where, "zzg");
      this.addSearchCondition("packageType", where, "packageType");
      this.addSearchCondition("cusLevel", where, "cusLevel");
      this.addSearchCondition("weight", where, "weight");
      this.addSearchCondition("volRatio", where, "volRatio");
      this.addSearchCondition("twocode", where, "twocode");
      this.addSearchCondition("addman", where, "addman");
      this.addSearchCondition("wffAreaid", where, "areaname");
      this.addSearchCondition("approvalStatus", where, "approvalStatus");
      where["gid"] = {};
      if (this.wecanStandardPage == "全部") {
      } else if (this.wecanStandardPage != normalCus) {
        where["gid"]["begin"] = 0;
        this.addSearchCondition("gid", where, "wtxm");
      } else {
        where["gid"] = -1;
      }
      if (!!this.searchData.validityDate) {
        var d = this.searchData.validityDate;
        if (!!d.begin) {
          where["enddate"] = {};
          where["enddate"]["begin"] = d.begin;
        }
        if (!!d.end) {
          where["startdate"] = {};
          where["startdate"]["end"] = d.end;
        }
      }
      if (!!this.priceObj.area) {
        where["area"] = this.priceObj.area;
      }
      var jsonArr = {
        where: {
          ...where,
        },
      };
      let url = this.$store.state.feeWebApi + "airFreightFee/getList";
      let queryData = { json: JSON.stringify(jsonArr) };
      if (this.pageType == pageType.customer) {
        queryData["pageType"] = pageType.customer;
      }
      this.priceObj.request("get", url, queryData).then(({ data }) => {
        if (data.resultdata && !data.resultdata.length) {
          this.$message("无查询结果");
        }
        this.tableDataRes = data.resultdata;
      });
    },
    deleteFee() {
      this.priceObj.delCurrentFeeid();
      this.search();
    },

    deleteFeeByJson(data) {
      this.$confirm("确认删除该组数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let url = this.$store.state.feeWebApi + "airFreightFee/deleteByJson";
        var json = {
          where: {
            guid: data.feeid,
          },
        };

        this.priceObj
          .request("post", url, { json: JSON.stringify(json) })
          .then(({ data }) => {
            this.$message.success("删除成功");
            this.search();
          });
      });
    },
    /**
     * key where条件传入后台的key
     * target 目标对象 这边是where
     * searchDataKey searchData 内部的key
     */
    addSearchCondition(key, target, searchDataKey) {
      if (!!this.searchData[searchDataKey]) {
        target[key] = this.searchData[searchDataKey];
      }
    },

    closeDialog() {
      this.priceObj = new priceFreightEditView(this);
    },
    clickCancel() {
      if (this.priceObj._currentPageMode == pageMode.pageOne) {
        this.closeDialog();
      }
      this.priceObj.clickCancel();
    },
    clickEdit(data) {
      
      if (this.historyPane) { // 判断驳回历史弹出框打开 => 关闭弹出框
        this.historyPane = false
      }
      if (this.historyPaneOne) {
        this.historyPaneOne = false;
      }
      this.currentRejectReocrd = {};
      this.rejectReason = ''; // 清空驳回原因
      // 编辑模式 priceObj会使用新的实现继承自原class
      this.priceObj = new priceFreightEditView(this);
      // this.priceObj.openEditDialog(data);
      this.priceObj.clickNext({data, disabledStatus: true});
      this.priceObj.dialogTitle = "审批公布运价";
    },
    clickNew() {
      if (!!!this.priceObj.area) {
        throw new Error("请选择地区");
      }
      this.priceObj = new priceFreightEditView(this);
      this.priceObj.currentPageMode = pageMode.pageOne;
    },
    clickTimeSelector(key) {
      this.priceObj.currentFeeid = key;
      this.priceObj.changeCurrentFeeMap();
    },
    reset() {},

    selectText(event) {
      event.currentTarget.select();
    },
    //将数字转换成中文周
    convertIntToWeek(num){
      switch(num){
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 7:
          return "周日";

      }
    },

   /**设置单元格价格 */
    // 第一页请填写各重量的运价，改为 “请填写官网公布的1:167散货的运价”，这说明默认基点为，1：167，散货，官网公布，其他标准的运价都为空，
    //且尚未建立勾稽关系，需以编辑->新增方式来添加(原先是减法)
    //则现在初始只加载第一行的价格
    setCellValue(vol, weight) {
      vol = this.priceObj.volArr.find((f) => {
        return f.code == vol.code;
      });
      let isVolSetValue = vol.isSetValue;
      let volDiff = vol.diff * 1;
      let weightPrice = weight.standardPrice * 1;
      let selectedIndex = this.priceObj.tabDisplayIndex;
      let selectedTab = this.priceObj.cusPackageIndexArr[selectedIndex];
      let cusDiff = selectedTab.cDiff * 1;
      let pDiff = selectedTab.pDiff * 1;

      if (!Number.isFinite(weightPrice) || weightPrice == 0) return "--";
      if (!isVolSetValue) return "--";
      if (weight.title == "MIN") return weightPrice;
      let val =
        (Number.isFinite(volDiff) ? volDiff : 0) +
        (Number.isFinite(weightPrice) ? weightPrice : 0) +
        (Number.isFinite(pDiff) ? pDiff : 0) +
        (Number.isFinite(cusDiff) ? cusDiff : 0);
      return val.toFixed(2);
    },
    getFixedDiff(v, w) {
      var selectTab =
        this.priceObj.cusPackageIndexArr[this.priceObj.tabDisplayIndex];
      var map = selectTab.fixedMap;
      var key = this.createFixedPriceKey(v, w);
      return map.fixedMap[key].diff;
    },
    createFixedPriceKey(v, w) {
      var a = this.priceObj.createFixedPriceKey(v, w);
      return a;
    },
    createImportPriceKey(v, w) {
      var a = this.priceObj.createFixedPriceKey(
        this.priceObj.currentImportPackageType,
        this.priceObj.currentImportCus,
        v,
        w
      );
      return a;
    },
    createHeadKey(v, w) {
      var key = this.priceObj.createHeadKey(
        this.priceObj.currentImportPackageType,
        this.priceObj.currentImportCus,
        v,
        w
      );
      return key;
    },
    closeImportDialog() {
      this.priceObj.cancelImport();
    },
    activeColumn(index) {
      var table = document.getElementById("tbPricePreview");
      var tds = table.querySelectorAll("tr td:nth-child(" + (index + 2) + ")");
      tds.forEach((item, index) => {
        if (item.classList.contains("active-column")) {
          item.classList.remove("active-column");
        } else {
          item.classList.add("active-column");
        }
      });
    },
    activeRow(index) {
      var table = document.getElementById("tbPricePreview");
      var tr = table.querySelector("tr:nth-child(" + (index * 1 + 2) + ")");
      var tds = tr.querySelectorAll("td");
      tds.forEach((item, index) => {
        if (item.classList.contains("active-row")) {
          item.classList.remove("active-row");
        } else {
          item.classList.add("active-row");
        }
      });
    },
  },
  beforeMount: function () {
    // this.name = this.realPageName + ".vue";
  },
  mounted: function () {
    let clientWidth = document.body.clientWidth;
    if (clientWidth < 1440) {
      this.dialogWidth = "1068px";
    }
  },
  created: function () {},

  computed: {
    rejectStatus() {
      return  this.priceObj.props && (this.priceObj.props.approvalStatus == '200' || this.priceObj.props.approvalStatus == '500' )
    },

    // 驳回记录
    rejectRecord() {
      let data = JSON.parse(JSON.stringify(this.priceObj.approvalArr));
      data = data.reverse()

      if (this.currentRejectReocrd.addman) {
        data.unshift(this.currentRejectReocrd)
      }

      return data;
    },
    
    /**页面类型 区分客户应收维护还是公布运费维护 */
    pageType: function () {
      return pageType.customer;
    },
    isWecanStandard: function () {
      var result = false;
      if (this.wecanStandard == normalCus) {
        result = true;
        this.priceObj.gid = -1;
      }
      return result;
    },
    isDisableZzg: function () {
      if (this.priceObj.zzgTitle == zzgTitle.direct) {
        this.priceObj.zzg = zzgTitle.direct;
      }
      return this.priceObj.zzgTitle == zzgTitle.direct;
    },
    hbhWidth: function () {
      var hbhCount =
        typeof this.priceObj.hbhStr === "string"
          ? this.priceObj.hbhStr.split(",").length
          : this.priceObj.hbhStr.length;
      if (hbhCount < 3) return "30%";
      if (hbhCount < 6) return "65%";
      else return "100%";
    },
  },
  watch: {
    "priceObj.selectedTemplate": {
      handler(newval, oldval) {
        this.priceObj.changeTemplate();
      },
    },
  },
};
</script>
<style lang="less" scoped>
@import url("./css/flex-row.less");
@import url("./css/price-freight.less");
@blue: #0f5a8c;
@smallFont: 10px;
@greyBorder: #80808047;
@grey: #f8f8f8;
.reject-wrapper {
  display: flex;
  border: 1px solid #c0c9d0;
  border-radius: 5px;
  padding: 10px;
  /deep/.el-textarea__inner {
    border: none !important;
    padding: 0 !important;
  }
}

.blue {
  color: @blue;
}

.greyBg {
  background: @grey;
}
.page-one {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  & .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.bottom-wrap {
  display: flex;
  justify-content: end;
  // flex-direction: row-reverse;
  margin-top: 20px;
}
.clearafter:after {
  content: "";
  display: block;
  clear: both;
}

.twocode-wrap {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  text-align: start;
}
.twocode-wrap .template {
  line-height: 64px;
  vertical-align: middle;
}
.twocode-wrap .small {
  font-size: @smallFont;
  color: grey;
}
.twocode-wrap .big {
  font-size: 25px;
  color: @blue;
  font-weight: bold;
}
// .twocode-wrap .item {
//   flex: 0 0 8%;
// }

// .twocode-wrap .item-last {
//   flex: 0 0 60%;
// }

.twocode-wrap table td {
  padding: 5px 10px;
}

.sfgFont {
  font-size: 22px;
  color: @blue;
}
.zzgFont {
  font-size: 18px;
  color: #000;
}
.twocodeTdAdd {
  padding: 0px 8px;
  line-height: 27px;
  cursor: pointer;
}
.twocodeTdAdd:hover {
  background: @blue;
  color: #fff;
}

.twocodeTd:hover {
  background: @blue;

  color: #fff;
  cursor: pointer;
}
.twocdeMember {
  line-height: 27px;
  display: inline-block;
}

.active {
  background: @blue;
  color: #fff;
}
.twocode-selector {
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  padding: 0 8px;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
}
.price-wrap .middle {
  width: 100%;

  text-align: center;

  display: flex;

  align-content: flex-start;

  flex-flow: row nowrap;
}
.price-wrap .foot {
  width: 100%;

  text-align: left;

  display: flex;

  align-content: flex-start;

  flex-flow: row wrap;
  border-top: 1px solid #dedede;
  margin-top: 20px;
  padding-top: 10px;
}

.tag {
  background: #fffcf0;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid @greyBorder;
  font-size: 10px;
  height: 30px;
  line-height: 26px;
  margin-right: 10px;
  & input {
    font-size: 16px !important;
    text-align: center;
    background: transparent;
    border-bottom: 1px solid #dedede;
    width: 75px;
  }
}

.card-block {
  width: 100%;
  margin: 14px 0;
}
.tab-wrap {
  text-align: start;
}
.tab-wrap .tab {
  cursor: pointer;
  border: 1px solid #dedede;
  border-radius: 5px;
  margin: 5px 10px 5px 0;
  display: inline-block;
}
.tab .tab-item {
  border-radius: 3px;
  display: inline-block;
  width: 52px;
  height: 27px;
  text-align: center;
  line-height: 27px;
  vertical-align: middle;
}
.tab .tab-item.active {
  color: #fff;
  background: @blue;
}
.table-wrap {
  display: flex;
  justify-content: flex-start;
}

.table-wrap table td {
  border: 1px solid @greyBorder;
  border-collapse: collapse;
  text-align: center;
  box-sizing: border-box;
}

.arrow {
  background-image: url("../../boStatic/images/arrow.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 5px;
  height: 27px;
  width: 20px;
  margin: 0 10px;
}
.el-icon-plus {
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
}
.el-icon-minus {
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
}
.el-icon-plus:hover {
  color: @blue;
}
.el-icon-minus:hover {
  color: @blue;
}

.timespan-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.timespan-wrap .time-selector {
  background: @grey;
  color: #a5a3a3;
  font-size: 15px;
  margin: 10px 4px;
  padding: 6px 10px;
  border-radius: 4px;
  white-space: nowrap;
  cursor: pointer;
}
.time-selector.active {
  color: #fff;
  background: @blue;
}
.remark {
  margin-top: 20px;
  width: 61%;
}
.jf-wrap {
  width: 279px;
  height: 30px;
  background: #fffcf0;
  border: 1px solid #80808047;
  line-height: 30px;
  vertical-align: middle;
}
.price-input {
  text-align: center;
  width: 60px;
  font-size: 14px !important;
  background: transparent;
  cursor: pointer;
}
.block {
  margin: 25px 0 5px 0;
}
.iata-table td {
  border: 1px solid @greyBorder;
  border-collapse: collapse;
  text-align: center;
  box-sizing: border-box;
  padding: 10px 20px;
  width: 100px;
}
.descriptionWrap {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fffcf0;
  padding-left: 5px;
}
/deep/.el-tab-pane {
  padding: 0 !important;
}
/* 屏幕小于1440px */
@media screen and (max-width: 1440px) {
  .dialog {
    width: 90%;
  }
}

/* 屏幕大于1440px */
@media screen and (min-width: 1441px) {
  .dialog {
    width: 70%;
  }
}
/deep/ .contentCmpt {
  max-width: 100% !important;
}
// /deep/.el-input__inner {
//   border: 0;
// }
/deep/.el-range-editor .el-range-input {
  background: transparent !important;
}
/deep/.bigLable .el-input__inner {
  font-size: 14px !important;
}

.input-item {
  width: 300px;
  min-width: 300px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  border: 1px solid #c0c9d0;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 20px;
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
.tips span {
  color: @blue;
}
.seed-wrap {
  & input {
    padding: 0 10px;
    border: 1px solid #dddddd;
    text-align: center;
    width: 50px;
    border-radius: 3px;
  }
  & span {
    color: #dedede;
    padding: 0 5px;
    cursor: pointer;
  }
  & .active {
    color: @blue;
    background: none;
  }
}

/deep/.el-select__tags {
  overflow: unset !important;
}
</style>
<style >
.el-dialog__title {
  font-weight: 900;
}
</style>

