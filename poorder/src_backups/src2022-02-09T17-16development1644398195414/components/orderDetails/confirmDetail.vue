<template>
  <div>
    <!-- 海关联系单发送项 -->
    <h3
      style="color:red"
      v-if="pagetype==2"
    >*背景色为黄色的输入框为海关联系单发送项
    </h3>
    <!-- 海关联系单发送项 -->

    <!-- 基本信息 -->
    <div
      style="display:flex;justify-content:space-between;align-items:center"
      v-if="pagetype!=3"
    >
      <!-- 基本信息 -->
      <h3
        style="margin-bottom:10px;"
        v-if="showBasicInfo"
      >
        订舱编号：
        <span style="color:red">{{mawbdetail.pono}}</span>
      </h3>
      <!-- 基本信息 -->

      <!-- 发送海关联系单按钮 -->
      <el-button
        type="primary"
        v-if="pagetype==2&&inputModelData.dzstatus<700&&inputModelData.bgstatus<180"
        style="height:28px;"
        v-hide="baoguanFinished"
        @click="sendCustomsContact"
      >
        发送海关联系单
      </el-button>
      <!-- 发送海关联系单按钮 -->

    </div>
    <!-- 基本信息 -->

    <!-- tab内容 -->
    <div class="hawbTabs">
      <!-- tabs头部 -->
      <div
        class="tabs-header tabs-header-confirmdetail"
        v-hide="(dom==1&&!isOrderConfirm&&!showBasicInfo)"
      >
        <div class="left-title"></div>

        <!-- 头部内容 -->
        <div
          class="header-c servicePort"
          :style="{'top': `-${Math.floor((cur_index-1) / maxTabLength) * 40}px`}"
        >
          <!-- Manifest制作放到了单证制作中，这里暂时隐藏 -->

          <!-- tabs -->
          <p
            v-for="(hawb, index) in hawb_list"
            :title="hawb"
            v-if="hawb!='Manifest制作'"
            :key="index"
            :class="[{'is-active': cur_hawb == hawb}]"
            v-show="judgeTabShow(index)"
          >

            <!-- tab -->
            <span
              style="width:100%;height:100%;display:block"
              :class="setTabClassName(index)"
              @click.self="togglehawb(hawb, index)"
            >
              {{ hawb }}
            </span>
            <!-- tab -->

            <!-- 删除按钮 -->
            <span
              class="icon-c"
              v-if="pagetype==3&&(index>=initialTabLength||(hawb=='总运单信息'&&inputModelData.zdmawbstatus==700))"
            >
              <span class="icon-close-mask"></span>
              <i
                @click="removehawb(hawb)"
                class="el-icon-close"
              >
              </i>
            </span>
            <!-- 删除按钮 -->
          </p>
          <!-- tabs -->

          <el-button
            type="default"
            style="margin-top:6px;border: none;"
            v-show="hawb_list.length>7"
            @click="show_tabs"
          >
            {{show_all_hawb?'隐藏面板':'查看更多'}}
          </el-button>
        </div>
        <!-- 头部内容 -->

        <!-- 提示 -->
        <i class="tabs-right-mask"></i>
        <!-- 提示 -->

        <!-- 状态说明 -->
        <span
          style="position:absolute;right:38px;top:5px;z-index:1000"
          v-if="pagetype!=2"
        >
          <el-popover
            placement="bottom-start"
            title="状态说明"
            width="120"
            trigger="hover"
          >
            <div class="badgePopover">
              <p>
                <i style="backgroundColor:#EA0000"></i>
                <strong>{{pagetype==1?'未确认':"未制作"}}</strong>
              </p>
              <p>
                <i style="backgroundColor:#0CAF00"></i>
                <strong>{{pagetype==1?'已确认':"已制作"}}</strong>
              </p>
            </div>
            <!-- <el-button type="info"  slot="reference" icon="el-icon-message" circle size="mini"></el-button> -->
            <i
              slot="reference"
              class="el-icon-info"
              style="color:#409EFF;font-size:16px;cursor:pointer;transform: translateY(5px);"
            ></i>
          </el-popover>
        </span>
        <!-- 状态说明 -->

        <!-- 展开菜单箭头 -->
        <el-button
          :class="['expansion-hawb', {'icon-rotate': show_all_hawb}]"
          @click="show_tabs"
          icon="el-icon-arrow-down"
        >
        </el-button>
        <!-- 展开菜单箭头 -->
      </div>
      <!-- tabs头部 -->

      <!-- 隐藏tabs => 点击下拉箭头显示全部tabs -->
      <div
        ref="hide_tabs"
        v-hide="(dom==1&&!isOrderConfirm&&!showBasicInfo)"
        @blur="tabs_blur"
        :class="['hide-tabs', {'show': show_all_hawb}]"
        :style="{'height': `${Math.ceil(hawb_list.length / maxTabLength) * 50 + 14}px`}"
        tabindex="0"
      >
        <p
          v-for="(hawb, index) in hawb_list"
          :title="hawb"
          v-if="hawb!='Manifest制作'"
          :key="index"
          :class="{'is-active': cur_hawb == hawb}"
          v-show="judgeTabShow(index)"
          @click.self="togglehawb(hawb, index)"
        >
          {{ hawb }}
          <!-- <span class="icon-c">
          <span class="icon-close-mask"></span>
          <i @click="removehawb(index)" class="el-icon-close"></i>
        </span>-->
        </p>
      </div>
      <!-- 隐藏tabs => 点击下拉箭头显示全部tabs -->

      <!-- tabs内容 -->
      <div
        class="tabs-content"
        :style="{border:(dom==1&&!isOrderConfirm&&!showBasicInfo)?'none':''}"
        :class="{paneDisabled:pagetype==2&&baoguanFinished}">

        <!-- 汇总信息 -->
        <div
          v-show="cur_index==0"
          :class="{paneDisabled:pagetype==1&&dom==2&&projectIsWecan}"
        >

          <!-- 总单基本信息 -->
          <div class="detail">

            <!-- 标题 -->
            <div
              class="detail-title"
              style="display:flex;justify-content:space-betweeen">
              <p>总单基本信息<span v-html="getTabsTooltip(1)"></span></p>
				<!-- 隐藏“总运单号确认”按钮(已由航线操作中的"签单确认"按钮替代) -->
              <!-- <el-button
                v-if="pagetype==1&&dom==1&&inputModelData.czlx!='自货'&&!ifDanhaoConfirmUse||!projectIsWecan"
                :disabled="!inputModelData.mawb"
                :type="ifDanhaoConfirmUse?'primary':'danger'"
                style="height:28px;"
                @click="confirmMawbDanhaoFunc"
              >
                {{ifDanhaoConfirmUse?'总运单号确认':'取消总单号确认'}}
              </el-button> -->
            </div>
            <!-- 标题 -->

            <!-- 内容 -->
            <div
              class="detail-c"
              style="width: 1200px;"
            >
              <newFormCmpt
                :view-data.sync="basicInformation"
                :model-data.sync="inputModelData"
                :pagetype="2"
                :class="{paneDisabled:!projectIsWecan&&!ifDanhaoConfirmUse}"
              >
                <template slot="zc">
                  <span style="color:red">超过3%</span>
                </template>
                <template slot="cp">
                  <el-input
                    v-model="inputModelData.cp"
                    v-verify="'fixedTwo'"
                    style="width:125px"
                    clearable
                  >
                    <span
                      slot="suffix"
                      style="margin-right:2px;"
                    >%</span>
                  </el-input>
                  <span
                    style="margin-left:10px;"
                    :style="{color:bubbles?'#51A74E':'#FF5850'}"
                  >{{bubbles?'重货':'泡货'}}</span>
                </template>
              </newFormCmpt>
            </div>
            <!-- 内容 -->

          </div>
          <!-- 总单基本信息 -->

          <!-- 分单基本信息  -->
          <div
            class="detail"
            v-show="inputModelData.orderdom!='直单'"
            :class="{paneDisabled:(pagetype==1&&dom==2)||(hawbDanhaoAllConfirm&&pagetype==2)}"
          >

            <!-- 标题 -->
            <div
              class="detail-title"
              style="display:flex;justify-content:space-between;align-items:center"
            >
              <p>
                分单基本信息
                <span style="margin-left:20px;color:#666">分单件/重/体总计：</span>
                <span style="color:#666">{{getNumberTotal(1)}}</span>
                <span style="margin-left:20px;color:#666">报关单件/重总计：</span>
                <span style="color:#666">{{getNumberTotal(2)}}</span>
              </p>
              <div>
                <el-button
                  type="primary"
                  v-if="pagetype!=3&&!addHawbDialog&&dom==1&&!hawbDanhaoAllConfirm"
                  style="height:28px;"
                  @click="confirmHawbDanhaoFunc(1)"
                >分运单号确认</el-button>
                <el-button
                  type="danger"
                  v-if="pagetype!=3&&!addHawbDialog&&dom==1&&hawbDanhaoAllConfirm"
                  style="height:28px;"
                  @click="confirmHawbDanhaoFunc(2)"
                >取消分运单号确认</el-button>
                <el-button
                  type="primary"
                  v-show="!(dom==2&&!showBasicInfo)||(pagetype==2&&inputModelData.hawbnoconfirmstatus<2)"
                  v-hide="(hawbDanhaoAllConfirm&&inputModelData.commbillmodifystatus!=2)||(pagetype==1&&dom==2)||pagetype==3||addHawbDialog"
                  style="height:28px;"
                  @click="addHawbDialog=true;resetForm();getRealList()"
                >新增分单</el-button>
              </div>
            </div>
            <!-- 标题 -->

            <!-- 内容 -->
            <div class="detail-c">
              <!-- {{addHawbDialog}} -->
              <!-- {{sizeForm}} -->
              <div
                class="hawbform"
                v-show="addHawbDialog"
              >
                <h4 style="margin-bottom:5px;">{{sizeForm.guid>0?'分单修改':'分单新增'}}</h4>
                <el-form
                  ref="form"
                  :model="sizeForm"
                  label-width="100px"
                  size="mini"
                  :inline="true"
                >
                  <el-form-item label="分单号">
                    <el-input
                      v-model="sizeForm.hawb"
                      @blur="setpono"
                      :maxlength="pagetype==2?12:''"
                      class="input-required"
                      clearable
                      style="width:166px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="进仓编号">
                    <span style="display:inline-block;width:164px">
                      <el-select
                        placeholder="请选择"
                        multiple
                        v-model="sizeForm.khjcnoArr"
                        size="mini"
                        @change="hawbSelFunc"
                        class="input-required"
                      >
                        <li>
                          <span style="float: left;margin-left:20px;">进仓编号</span>
                          <span style="float: right;margin-right:30px;">
                            <i class="imul">件</i>/
                            <i class="imul">重</i>/
                            <i class="imul">体</i>
                          </span>
                        </li>
                        <el-option
                          v-for="(numitem,indexKhjcno) in jcnoNumberList"
                          :key="indexKhjcno"
                          :label="numitem.khjcno"
                          :value="numitem.guid"
                          v-if="!selOptionShow(numitem)"
                          style="width:300px;"
                        >
                          <span style="float: left">{{ numitem.khjcno }}</span>
                          <span style="float: right;margin-right:10px;">
                            <i class="imul">{{ numitem.piece }}</i>/
                            <i class="imul">{{ numitem.weight }}</i>/
                            <i class="imul">{{ numitem.volume }}</i>
                          </span>
                        </el-option>
                      </el-select>
                    </span>
                  </el-form-item>
                  <el-form-item label="实际件/重/体">
                    <el-input
                      v-model="sizeForm.realPiece"
                      style="width:80px"
                      disabled
                    ></el-input>
                    <el-input
                      v-model="sizeForm.realWeight"
                      style="width:80px"
                      disabled
                    ></el-input>
                    <el-input
                      v-model="sizeForm.realVolume"
                      style="width:80px"
                      disabled
                    ></el-input>
                  </el-form-item>

                  <el-form-item label="分单件/重/体">
                    <el-input
                      v-model="sizeForm.ybpiece"
                      v-verify="'integer'"
                      style="width:80px"
                      class="input-required"
                      disabled
                      clearable
                    ></el-input>
                    <el-input
                      v-model="sizeForm.ybweight"
                      v-verify="'fixedTwo'"
                      style="width:80px"
                      class="input-required"
                      clearable
                    ></el-input>
                    <el-input
                      v-model="sizeForm.ybvolume"
                      v-verify="'fixedThree'"
                      style="width:80px"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="始发港">
                    <el-input
                      v-model="sizeForm.sfg"
                      class="input-required"
                      v-verify="'sfgmdg'"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="目的港">
                    <el-input
                      v-model="sizeForm.mdg"
                      class="input-required"
                      v-verify="'sfgmdg'"
                    ></el-input>
                  </el-form-item>

                  <my-select
                    title="订单号   "
                    style="display:inline-flex"
                    :options="ponoList"
                    v-model="pono"
                    class="input-required"
                    v-if="mawbdetail.iscomboine==1"
                    titlestyle="margin-right:10px;padding-right:0px;"
                  ></my-select>

                  <div style="height:1px;background-color:#F2F2F2;margin:0px 0px 15px;"></div>
                  <template
                    v-for="(item,index) in sizeForm.declList"
                    v-if="hasBgService"
                  >
                    <el-row :key="index">
                      <el-form-item label="报关单号">
                        <el-input
                          v-model="item.pono"
                          :class="{'input-required':pagetype==2}"
                          clearable
                          maxlength="12"
                          style="width:160px;"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="件/重">
                        <el-input
                          v-model.number="item.piece"
                          v-verify="'integer'"
                          style="width:80px"
                          :class="{'input-required':pagetype==2}"
                          clearable
                        ></el-input>
                        <el-input
                          v-model="item.weight"
                          v-verify="'fixedTwo'"
                          style="width:80px"
                          :class="{'input-required':pagetype==2}"
                          clearable
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="报关类型">
                        <my-select
                          :groupid="19"
                          itemstyle="width:100px;min-width:120px;"
                          v-model="item.bglx"
                          :class="{'input-required':pagetype==2}"
                        ></my-select>
                      </el-form-item>
                      <el-form-item label="连单数">
                        <el-input
                          v-model="item.lds"
                          v-verify="'integer'"
                          style="width:80px"
                          clearable
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="报关供应商">
                        <page-select
                          :modelval.sync="item.bggys"
                          :pagetype="3"
                          :class="{'input-required':pagetype==2}"
                        >
                        </page-select>
                      </el-form-item>
                      <el-form-item>
                        <!-- <i
                          @click="listform(index)"
                          style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;"
                          :style="{color:index!=0?'red':'#67C23A'}"
                          :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                          :title="index!=0?'删除此条':'新增一条'"
                          ></i>-->
                        <i
                          @click="listform(index,1)"
                          style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;color:#67C23A;margin-right:6px;"
                          class="el-icon-circle-plus"
                          title="新增一条"
                          :style="{visibility:index>0?'hidden':''}"
                        ></i>

                        <i
                          @click="listform(index,2)"
                          style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;color:red"
                          class="el-icon-remove"
                          title="删除此条"
                        ></i>
                      </el-form-item>
                    </el-row>
                  </template>
                  <div style="text-align:right">
                    <el-button
                      type="primary"
                      @click="operHawbList(-1)"
                    >保存</el-button>
                    <el-button
                      type="primary"
                      @click="addHawbDialog=false;resetForm()"
                    >取消</el-button>
                  </div>
                </el-form>
              </div>

              <div>
                <!-- {{hawbTableData}} -->
                <!-- :isMultiSelect="dom==1" -->
                <!-- {{hawbDanhaoAllConfirm}} -->
                <commonTable
                  :head="hawbTableHead"
                  :table-data="hawbTableData"
                  v-show="!addHawbDialog"
                >
                  <template
                    slot="operate"
                    slot-scope="props"
                  >
                    <span
                      v-if="pagetype!=3&&!(pagetype==1&&dom==2)"
                      v-show="!baoguanFinished&&(!hawbDanhaoAllConfirm||inputModelData.commbillmodifystatus==2)"
                    >
                      <button
                        style="background:#fff;cursor:pointer"
                        :style="{color:(props.data.row.dzstatus==2||props.data.row.commbillmodifystatus==2)&&pagetype==1?'#ccc':'#004078'}"
                        :disabled="(props.data.row.dzstatus==2||props.data.row.commbillmodifystatus==2)&&pagetype==1"
                        v-hide="props.data.row.hawbnoconfirmstatus==2&&inputModelData.commbillmodifystatus!=2"
                        @click="updateHawbList(props.data.row)"
                      >修改</button>
                      <button
                        style="background:#fff;cursor:pointer"
                        :style="{color:props.data.row.dzstatus==2&&pagetype==1?'#ccc':'#004078'}"
                        :disabled="props.data.row.dzstatus==2&&pagetype==1"
                        @click="operHawbList(props.data.index,3)"
                      >删除</button>
                    </span>
                    <span v-else>--</span>
                  </template>
                  <template
                    slot="hawb"
                    slot-scope="props"
                  >
                    <el-popover
                      placement="right"
                      width="700"
                      trigger="click"
                      style="cursor:pointer;pointer-events: all"
                      @hide="tableCheckedIndex=-1"
                      @show="tableCheckedIndex=props.data.index"
                    >
                      <el-table
                        :data="props.data.row.declList"
                        max-height="400"
                      >
                        <el-table-column
                          width="150"
                          property="pono"
                          align="center"
                          label="报关单号"
                        ></el-table-column>
                        <el-table-column
                          width="40"
                          property="piece"
                          align="center"
                          label="件数"
                        ></el-table-column>
                        <el-table-column
                          width="40"
                          property="weight"
                          align="center"
                          label="重量"
                        ></el-table-column>
                        <el-table-column
                          width="60"
                          property="lds"
                          align="center"
                          label="连单数"
                        ></el-table-column>
                        <el-table-column
                          width="80"
                          property="bglx"
                          align="center"
                          label="报关类型"
                        ></el-table-column>
                        <el-table-column
                          property="bggysName"
                          align="center"
                          label="报关供应商"
                        ></el-table-column>
                      </el-table>

                      <span slot="reference">
                        <span
                          style="color:#004078;font-weight:bold;font-size:15px"
                          @click="tableCheckedIndex=props.data.index"
                        >
                          <i
                            :class="[tableCheckedIndex==props.data.index?'el-icon-minus':'el-icon-plus']"
                            v-if="props.data.row.declList.length>0"
                          ></i>
                        </span>
                        <span style="cursor:pointer;color:#004078">{{props.data.value}}</span>
                      </span>
                    </el-popover>
                  </template>
                </commonTable>
              </div>
            </div>
            <!-- 内容 -->

          </div>
          <!-- 分单基本信息  -->

          <!-- 报关单信息 -->
          <div
            class="detail"
            v-show="inputModelData.orderdom=='直单'&&hasBgService"
          >
            <div class="detail-title">
              <p>报关单信息</p>
            </div>
            <div class="detail-c">
              <!-- {{straightDeclListForm}} -->
              <el-form
                label-width="90px"
                size="mini"
                :inline="true"
              >
                <el-row>
                  <el-form-item label="报关单号">
                    <el-input
                      v-model="straightDeclListForm.pono"
                      class="input-required"
                      maxlength="12"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="件/重">
                    <el-input
                      v-model.number="straightDeclListForm.piece"
                      style="width:80px"
                      class="input-required"
                      clearable
                    ></el-input>
                    <el-input
                      v-model="straightDeclListForm.weight"
                      style="width:80px"
                      class="input-required"
                      clearable
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="连单数">
                    <el-input
                      v-model.number="straightDeclListForm.lds"
                      style="width:80px"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="报关类型">
                    <my-select
                      :groupid="19"
                      itemstyle="width:100px;min-width:120px;"
                      v-model="straightDeclListForm.bglx"
                      class="input-required"
                    ></my-select>
                  </el-form-item>
                  <el-form-item label="报关供应商">
                    <page-select
                      :modelval.sync="straightDeclListForm.bggys"
                      @change="getGysname($event)"
                      :pagetype="3"
                      class="input-required"
                    ></page-select>
                  </el-form-item>
                  <el-form-item style="margin-left:40px">
                    <el-button
                      type="primary"
                      @click="saveStraightDeclLis"
                    >保存</el-button>
                    <el-button @click="resetStraightDeclLis">取消</el-button>
                  </el-form-item>
                </el-row>
              </el-form>
              <!-- {{straightDeclListTableData}} -->
              <commonTable
                :head="straightDeclListTableHead"
                :table-data="straightDeclListTableData"
              >
                <template
                  slot="operate"
                  slot-scope="props"
                >
                  <span
                    style="cursor:pointer;color:#004078"
                    @click="straightDeclListForm=Object.assign({},straightDeclListForm,props.data.row)"
                  >修改</span>
                  <span
                    style="cursor:pointer;color:#004078"
                    @click="delStraightDeclList(props.data.index)"
                  >删除</span>
                </template>
              </commonTable>
            </div>
          </div>
          <!-- 报关单信息 -->

        </div>
        <!-- 汇总信息 -->

        <!-- 总运单信息 -->
        <div v-show="cur_index==1">

          <!-- 总单基本信息 -->
          <div
            class="detail"
            v-if="pagetype!=3">
            <!-- 标题 -->
            <div class="detail-title">
              <p>总单基本信息<span v-html="getTabsTooltip(2)"></span></p>
              <el-button v-if="pagetype==1&&(dom==2||isOrderConfirm)&&inputModelData.mawbConfirmOverStatus !=1"
              :type="ifDanzhengConfirmUse?'primary':'danger'" :disabled="!ifConfirmUse" style="height:28px;"
              @click="confirmMawbFunc">{{ifDanzhengConfirmUse?'单证确认完成':'取消单证确认'}}</el-button>
              <el-button v-if="(dom==2||isOrderConfirm)&&inputModelData.mawbConfirmOverStatus==1&&pagetype==1" type="primary"
              style="height:28px;" @click="dzmodifystatusFunc">
              {{inputModelData.mawbConfirmOverStatus==1&&inputModelData.dzmodifystatus!=2?'单证待修改':'单证确认'}}</el-button>
            </div>
            <!-- 标题 -->

            <!-- 内容 -->
            <div
              class="detail-c"
              style="width: 1200px;"
              :class="{paneDisabled:(pagetype==1&&inputModelData.mawbConfirmOverStatus==1&&inputModelData.dzmodifystatus!=2)||(pagetype==1&&dom==2)||(pagetype==1&&dom==1&&inputModelData.czlx=='自货')}"
            >
              <newFormCmpt
                :view-data.sync="inputViewData"
                :model-data.sync="inputModelData"
                :pagetype="2"
                :required.sync="required"
              >
                <template slot="exForm1">
                  <hwxzCompt :inputModelData="inputModelData"></hwxzCompt>
                </template>
              </newFormCmpt>
            </div>
            <!-- 内容 -->
          </div>
          <!-- 总单基本信息 -->

          <!-- 总单收发货人信息 -->
          <div
            class="detail"
            v-if="pagetype!=3"
          >
            <div class="detail-title">
              <p>总单收发货人信息</p>
            </div>
            <div
              class="detail-c"
              :class="{paneDisabled:(pagetype==1&&inputModelData.mawbConfirmOverStatus==1&&inputModelData.dzmodifystatus!=2)||(pagetype==1&&(dom==1&&!isOrderConfirm)&&inputModelData.czlx=='自货')}">
              <revSedMawb
                :dzinfo="inputModelData"
                ref="makeBillRevSed"
                :detailType="pagetype==2?'海关':''"
                :needLimit="mawbNeedLimit"
                :isOrderConfirm="ifDanzhengConfirmUseDisabled">
              </revSedMawb>
            </div>
          </div>
          <!-- 总单收发货人信息 -->

          <!-- 总单制作信息 -->
          <div
            class="detail"
            v-if="pagetype!=2"
            style="margin-bottom:30px">
            <div class="detail-title" v-if="!isOrderConfirm">
              <p>总单制作信息</p>
              <span
                style="color:#999;margin-right:6px;cursor:pointer"
                @click="mawbBillShow=!mawbBillShow">
                {{mawbBillShow?'点击折叠':'点击展开'}}
                <i
                  :class="[!mawbBillShow?'el-icon-caret-bottom':'el-icon-caret-top']"
                  style="font-size:18px;margin-left:12px">
                </i>
              </span>
            </div>

            <div
              class="detail-c"
              v-if="inputModelData.guid"
              style="padding:0px"
              :class="{paneDisabled:pagetype==1&&inputModelData.mawbConfirmOverStatus==1&&inputModelData.dzmodifystatus!=2}"
            >
              <!-- <el-collapse-transition>
              <div v-show="mawbBillShow">-->
              <!-- {{afreshRateCharge}} -->
              <makingBill
                :mawbguid="inputModelData.guid"
                :boguid="inputModelData.boguid"
                :hideSaveBtn="pagetype==1"
                :mawbhawbLinkage="pagetype==1||pagetype==3"
                :orderdom="inputModelData.orderdom"
                :mawbinfo="inputModelData"
                bottomFixed
                :billShow.sync="mawbBillShow"
                ref="mawbMakingbill"
                :needLimit="mawbNeedLimit"
                :fromPage="fromPage"
                :afreshRateCharge="afreshRateCharge"
                :isOrderConfirm="isOrderConfirm"
                :active-name="activeName">
                <!-- <template v-slot:button>
                  <span v-if="isOrderConfirm">
                    <el-button
                    v-if="pagetype==1&&(dom==2||isOrderConfirm)&&inputModelData.mawbConfirmOverStatus !=1"
                    :type="ifDanzhengConfirmUse?'primary':'danger'"
                    :disabled="!ifConfirmUse"
                    style="height:28px;"
                    @click="confirmMawbFunc"
                  >{{ifDanzhengConfirmUse?'单证确认完成':'取消单证确认'}}</el-button>
                  <el-button
                    v-if="(dom==2||isOrderConfirm)&&inputModelData.mawbConfirmOverStatus==1&&pagetype==1"
                    type="primary"
                    style="height:28px;"
                    @click="dzmodifystatusFunc"
                  >
                    {{inputModelData.mawbConfirmOverStatus==1&&inputModelData.dzmodifystatus!=2?'单证待修改':'单证确认'}}</el-button>
                  </span>
                </template> -->
                  
              </makingBill>
              <!-- </div>
            </el-collapse-transition>-->
            </div>
          </div>
          <!-- 总单制作信息 -->

        </div>
         <!-- 总运单信息 -->

         <!-- manifastPirnt -->
        <div
          v-show="cur_index==2"
          v-if="tabsShow.includes(2)"
        >
          <manifastPirnt
            :mawb="inputModelData.mawb"
            v-if="inputModelData.guid"
          ></manifastPirnt>
        </div>
        <!-- manifastPirnt -->
        
        <!-- 分单信息 -->
        <div v-show="cur_index>(initialTabLength-1)">
          <!-- {{cur_index}} -->
          <!-- {{hawbTableData}} -->
          <div
            v-for="(item,index1) in hawbTableData"
            v-if="pagetype!=2">
            <hawbInfoConfirm
              :itemdata="item"
              :key="item.index1"
              :dom="dom"
              :pagetype="pagetype"
              v-if="tabsShow.includes(index1+initialTabLength)&&inputModelData.guid"
              v-show="cur_index==(index1+initialTabLength)"
              :mawbinfo="inputModelData"
              :allHawbInfo.sync="allHawbInfo[index1]"
              :needLimit="hawbNeedLimit"
              @success="getMawbDetail"
              @setMawbSmallpiece="setMawbSmallpiece"
              :fromPage="fromPage"
              :ifFromMawbaddput="!showBasicInfo"
              :isOrderConfirm="isOrderConfirm"
              :active-name="activeName">
            </hawbInfoConfirm>
          </div>

          <div
            v-for="(item,index1) in allDeclInfo"
            v-if="pagetype==2"
          >
            <customInfoConfirm
              :itemdata="item"
              :key="item.index1"
              :dom="dom"
              :pagetype="pagetype"
              v-if="tabsShow.includes(index1+initialTabLength)&&inputModelData.guid"
              v-show="cur_index==(index1+initialTabLength)"
              :mawbinfo="inputModelData"
              :allHawbInfo.sync="allHawbInfo[index1]"
              :needLimit="hawbNeedLimit"
              @success="getMawbDetail"
              :fromPage="fromPage"
              :ifFromMawbaddput="!showBasicInfo"
              :isOrderConfirm="isOrderConfirm"
            ></customInfoConfirm>
          </div>
        </div>
        <!-- 分单信息 -->

      </div>
      <!-- tabs内容 -->

    </div>
    <!-- tab内容 -->


    <el-dialog
      :visible.sync="dialogPcd"
      class="dialogImgDoc"
      v-if="dialogPcd"
      width="1200px"
      append-to-body
      top="4%"
    >
      <iframe
        :src="pcdUrl"
        frameborder="0"
        allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import makingBill from "../orderDetails/makingBill";
  import hawbInfoNew from "./hawbInfoNew";
  import revSedMawb from "../templates/revSedMawb";
  import hawbInfoConfirm from "./hawbInfoConfirm";
  import customInfoConfirm from "./customInfoConfirm";
  import manifastPirnt from "./manifastPirnt";

  import { formatDate, computedWeight } from "../../api/localStorage.js";

  export default {
    props: {
      mawbdetail: Object,
      showHawb: String,
      pagetype: {
        type: [String, Number],
        default: 1 //总分单确认界面，2海关联系单 3制单
      },
      customstatus: {
        //海关联系单的发送状态 ，1未发送
        type: [String, Number],
        default: "未发送"
      },
      dom: { //1单号2单证
        type: [String, Number],
        default: 2 
      },
      showBasicInfo: {
        //是否显示汇总信息里面的基本信息在综合查询里不显示
        type: Boolean,
        default: true
      },
      fromPage: String,
      afreshRateCharge: {
        //从单证制作已修改页面进去的总运单制作信息的Rate/Charge每次都去取
        type: Boolean,
        default: false
      },

      // 是否从单证确认进入
      isOrderConfirm: {
        type: Boolean,
        default: false,
      },
      activeName: { // 当前激活tab
        type: String,
        default: ''
      }
    },
    components: {
      hawbInfoNew,
      revSedMawb,
      makingBill,
      hawbInfoConfirm,
      manifastPirnt,
      customInfoConfirm
    },
    data() {
      return {
        required: "",
        basicInformation: {
          orderdom: {
            title: "订单类型：",
            options: [
            {
              label: "总分单(货代委托)",
              value: "总单"
            },
            {
              label: "总直单(货代委托)",
              value: "直单"
            },
            ],
            type: 3,
            itemStyle: {
              width: '560px'
            }
          },
          mawb: {
            title: "总运单号：",
            idStyle: { width: "100%" },
            itemStyle: { width: "280px" },
            type: 1,
            disabled: true
          },
          fid: {
            title: "委托客户：",
            type: 11,
            required: true,
            itemStyle: { width: "560px" },
            contentStyle: { display: "flex" },
            linkage: "gid",
            disabled: true
          },
          gid: {
            title: "项目：",
            type: 10,
            required: true,
            itemStyle: { width: "560px" },
            disabled: true
          },
          sfg: {
            title: "始发港：",
            type: 20,
            pagetype: 6,
            required: true,
            disabled: true,
            verify: "uppercase"
          },
          mdg: {
            title: "目的港：",
            type: 20,
            pagetype: 6,
            required: true,
            disabled: true,
            verify: "uppercase"
          },
          zzg: {
            title: "中转港：",
            type: 20,
            pagetype: 6,
            verify: "uppercase"
          },
          zzdate: {
            title: "装载日期：",
            type: 12,
            required: true
          },
          ybpiece: {
            title: "预报件数：",
            type: 1,
            required: true,
            verify: "integer"
          },
          ybweight: {
            title: "预报重量：",
            type: 1,
            lass: "width289",
            required: true,
            verify: "fixedTwo"
          },
          ybvolume: {
            title: "预报体积：",
            type: 1,
            //  idStyle: { width: "50%" },
            occupyRestSpace: true,
            required: true,
            verify: "fixedThree"
          },
          realpiece: {
            title: "实际件数：",
            type: 18,
            required: true,
            verify: "integer"
          },
          realweight: {
            title: "实际重量：",
            type: 18,
            lass: "width289",
            required: true,
            verify: "fixedTwo"
          },
          realvolume: {
            title: "实际体积：",
            type: 18,
            required: true,
            verify: "fixedThree"
          },
          cp: {
            title: "吃泡："
          },
          zdpiece: {
            title: "制单件数：",
            type: 18,
            verify: "integer"
          },
          zdweight: {
            title: "制单重量：",
            type: 18,
            verify: "fixedTwo"
          },
          zdvolume: {
            title: "制单体积：",
            type: 18,
            verify: "fixedThree"
          },

          jfweight: {
            title: "计费重量：",
            type: 18
          },
          yqhbh: {
            title: "要求航班号：",
            type: 1,
            verify: "uppercase"
          },
          yqhbrq: {
            title: "要求航班日期：",
            type: 6
          },
          zc: {
            title: "重差：",
            hidden: true
          },
          bgweight: {
            title: "报关重量：",
            type: 1,
            verify: "fixedTwo"
          }
        },
        inputViewData: {
          czlx: {
            title: "配舱操作：",
            type: 3,
            options: [
            { label: "唯凯配舱", value: "自货" },
            { label: "唯凯代操作", value: "代操作" }
            ],
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" },
            disabled: true
          },
          zzg: { title: "中转港：", type: 20, verify: "uppercase", pagetype: 6 },
          deliverydate: {
            title: "货好日期：",
            type: 12,
            format: "yyyy-MM-dd HH:mm"
          },
          smallpiece: {
            title: "小件数：",
            type: 1,
            verify: "integer",
            // idStyle: { width: "50%" }
            occupyRestSpace: true
          },
          zdpiece: {
            title: "制单件数：",
            type: 18,
            verify: "integer"
          },
          zdweight: {
            title: "制单重量：",
            type: 18,
            verify: "fixedTwo"
          },
          zdvolume: {
            title: "制单体积：",
            type: 18,
            verify: "fixedThree"
          },
          jfweight: {
            title: "计费重量：",
            type: 18
          },
          yjqfsj: { title: "预计起飞时间：" },
          yqqcts: {
            title: "要求全程天数：",
            type: 1,
            verify: "integer",
            //idStyle: { width: "70%" }
            occupyRestSpace: true
          },
          hbh: { title: "实际航班号：", verify: "uppercase", type: 18 },
          hbrq: { title: "实际航班日期：", format: "yyyy-MM-dd HH:mm", type: 18 },
          qfsj: { title: "实际起飞时间：", format: "HH:mm", type: 18 },
          qcts: { title: "实际全程天数：", verify: "integer", type: 18 },
          hbzl: {
            title: "航班种类：",
            type: 3,
            groupid: "6",
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" }
          },
          exForm1: {
            idStyle: { width: "100%", marginBottom: "-14px" },
            itemStyle: { width: "100%" },
            titleStyle: { display: "none" }
          },
          paymode: {
            title: "运费条款：",
            type: 3,
            groupid: "125",
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" }
          },
          // tradeterm: {
          //   title: "贸易方式：",
          //   type: 16,
          //   idStyle: { width: "100%" },
          //   itemStyle: { width: "100%" },
          //   options: [
          //     { title: "Freight  Prepaid", detailS: [] },
          //     { title: "Freight  Collect", detailS: [] }
          //   ]
          // },
          englishpm: {
            title: "英文品名：",
            type: 17,
            verify: "uppercase",
            itemStyle: { width: "560px" }
          },
          chinesepm: {
            title: "中文品名：",
            type: 17,
            itemStyle: { width: "560px" }
          }
        },
        inputModelData: {},
        hawbTableHead: [
        { title: "操作", field: "operate" },
        { title: "分单号", field: "hawb" },
        {
          title: "分单号确认状态",
          field: "hawbnoconfirmstatus",
          formatType: 2,
          format: i => (i == 1 ? "未确认" : "已确认")
        },
        {
          title: "分单确认状态",
          field: "hawbconfirmstatus",
          formatType: 2,
          format: i => (i == 1 ? "未确认" : "已确认")
        },
        { title: "件数", field: "ybpiece" },
        { title: "重量", field: "ybweight" },
        { title: "体积", field: "ybvolume" },
        { title: "始发港", field: "sfg" },
        { title: "目的港", field: "mdg" },
        { title: "进仓编号", field: "khjcno" },
        { title: "实际件数", field: "realPiece" },
        { title: "实际重量", field: "realWeight" },
        { title: "实际体积", field: "realVolume" }
        ],
        hawbTableData: [],
        hawb_list: ["汇总信息", "总运单信息", "Manifest制作"],
        initialTabLength: 3, //未加分单时的初始tab长度
        tabsShow: [],
        cur_index: 0,
        show_all_hawb: false,
        hawb_data_list: {},
        mawbBillShow: this.isOrderConfirm,
        guidHawbGroup: Array, //查询的分单数据
        hawbInfo: [], //存放分单数据
        tableCheckedIndex: -1,
        addHawbDialog: false,
        jcnoNumberList: [],
        sizeForm: {},
        allHawbInfo: [],
        allDeclInfo: [],
        straightDeclListForm: {}, //直单的报关单表单
        straightDeclListTableHead: [
        { title: "操作", field: "operate" },
        { title: "报关单号", field: "pono" },
        { title: "件数", field: "piece" },
        { title: "重量", field: "weight" },
        { title: "连单数", field: "lds" },
        { title: "报关类型", field: "bglx" },
        { title: "报关供应商", field: "bggysName" }
        ],
        straightDeclListTableData: [],
        pcdUrl: "",
        dialogPcd: false,
        maxTabLength: 7, //tab最多显示的标签数量
        ponoListOriginal: [],
        ponoList: [],
        pono: ""
      };
    },

    methods: {
      getTabsTooltip(type) {
        //1单号 2单证
        if (type == 1) {
          if (this.inputModelData.mawbnoconfirmman && this.inputModelData.mawbnoconfirmdate) {
            return `<span style="color:#333;margin-left:30px;font-weight: normal">完成人：${this.inputModelData.mawbnoconfirmman}</span><span  style="color:#333;margin-left:20px;font-weight: normal">完成时间：${formatDate(this.inputModelData.mawbnoconfirmdate, "yyyy-MM-dd hh:mm")}</span>`
          }
        } else {
          if (this.inputModelData.mawbconfirmman && this.inputModelData.mawbconfirmdate) {
            return `<span style="color:#333;margin-left:30px;font-weight: normal">完成人：${this.inputModelData.mawbconfirmman}</span><span  style="color:#333;margin-left:20px;font-weight: normal">完成时间：${formatDate(this.inputModelData.mawbconfirmdate, "yyyy-MM-dd hh:mm")}</span>`
          }
        }
      },
      setMawbSmallpiece() {
        let smallpiece = this.allHawbInfo.reduce((prev, i) => { return prev += Number(i.smallpiece || 0) }, 0)
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
      setTabClassName(index) {
        // 汇总信息 || manifastPirnt || 海关联系单
        if (index == 0 || index == 2 || this.pagetype == 2) {
          return "";
        }
        let ifDone = false; // 完成状态
        let hawbdata = this.hawbTableData[index - this.initialTabLength];
        if (index == 1) {  //总单
          if (this.pagetype == 3) { // 制单
            ifDone = this.inputModelData.zdmawbstatus == 700; // 制单状态 == 700 => 完成
          }
          if (this.pagetype == 1) { // 总分单确认界面
            ifDone =
            this.dom == 1 && !this.isOrderConfirm // dom == 1 => 单号 && 不是从单证确认进入
            ? !this.ifDanhaoConfirmUse // 单号确认
            : !this.ifDanzhengConfirmUse; // 单证确认
          }
        }

        // 单号大于初使化单 && 数据长度 > 0
        if (index >= this.initialTabLength && this.hawbTableData.length > 0) {
          //分单
          if (this.pagetype == 3) { // 制单
            ifDone = hawbdata.zdhawbstatus == 700; // 制单状态 == 700 => 完成
          }
          if (this.pagetype == 1 && hawbdata) { // 总分单确认界面 && 有数据
            ifDone =
            this.dom == 1 && !this.isOrderConfirm // // dom == 1 => 单号 && 不是从单证确认进入
            ? hawbdata.hawbnoconfirmstatus == 2 // 单号确认
            : hawbdata.hawbconfirmstatus == 2; // 单证确认
          }
        }
        return ifDone ? "badgeGreen" : "badgeRed";
      },

      /**
       * @desc 打印单证
       */
      printBill() {
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/GetDeclGuidByHpoid",
          params: { hpoid: this.inputModelData.guid },
          loading: true,
          tip: false
        }).then(results => {
          //  console.log(results);

          let str = results.data;

          if (this.inputModelData.orderdom == "总单") {
            if (!str) {
              return this.$message.error("无报关单");
            }
            this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=CustomsFDReport.frx&guid=${str}&area=${this.inputModelData.area}&shipaceid=-1`;
            this.dialogPcd = true;
          } else {
            this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=CustomsZDReport.frx&guid=${this.inputModelData.guid}&area=${this.inputModelData.area}&shipaceid=-1`;
            this.dialogPcd = true;
          }
        });
      },

      /**
       * @desc 报关供应商
       */
      getGysname(val) {
        this.straightDeclListForm.bggysName = val.usr_name;
      },

      /**
       * @desc 重置
       */
      resetForm() {
        this.sizeForm = {
          guid: -1,
          isdel: 1,
          hawb: "",
          sfg: this.inputModelData.sfg,
          mdg: this.inputModelData.mdg,
          ybpiece: "",
          ybweight: "",
          ybvolume: "",
          khjcnoArr: [],
          khjcno: "",
          realPiece: "",
          realWeight: "",
          realVolume: "",
          declList: [
          {
            pono: "",
            piece: "",
            weight: "",
            bglx: "普通报关",
            bggys: "",
            lds: 0,
            isdel: 1,
            guid: -1,
            hpoid: this.inputModelData.guid
          }
          ]
        };
        this.pono = "";
      },

      /**
       * @desc 
       * @param {number} index 序号
       * @param {number} type 1新增 2修改
       */
      async listform(index, type) {
        if (type == 1) {
          let upperlist = this.sizeForm.declList[
          this.sizeForm.declList.length - 1
          ];
          if (
            !upperlist.pono ||
            Number(upperlist.piece) == 0 ||
            !upperlist.weight ||
            !upperlist.bggys ||
            !upperlist.bglx
            ) {
            return this.$message.error("有必填字段为空，请先完善信息！");
        }

        let piece =
        this.sizeForm.ybpiece -
        this.sizeForm.declList.reduce(
          (prev, i) => (prev += Number(i.piece)),
          0
          );
        let weight =
        this.sizeForm.ybweight -
        this.sizeForm.declList.reduce(
          (prev, i) => (prev += Number(i.weight)),
          0
          );

        this.sizeForm.declList.push({
          pono: "",
          piece: piece > 0 ? piece : 0,
          weight: weight > 0 ? Number(weight).toFixed(2) : 0,
          bglx: upperlist.bglx || "普通报关",
          bggys: upperlist.bggys,
          lds: 0,
          isdel: 1,
          guid: -1,
          hpoid: this.inputModelData.guid
        });
        this.setpono();
        } else {
        if (this.sizeForm.declList[index].guid > 0) {
          let confirm = await this.$confirm("是否确认删除？", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          });

          if (!confirm) return;

          this.$axios({
            method: "put",
            url: this.$store.state.webApi + "api/ExAxplineDeclDelete",
            data: {
              czman: localStorage.usrname,
              guid: this.sizeForm.declList[index].guid
            },
            loading: true,
            noarea: true,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              if (this.sizeForm.declList.length > 1) {
                this.sizeForm.declList.splice(index, 1);
              } else {
                this.sizeForm.declList.splice(index, 1, {
                  pono: "",
                  piece: "",
                  weight: "",
                  bglx: "普通报关",
                  bggys: "",
                  lds: 0,
                  isdel: 1,
                  guid: -1,
                  hpoid: this.inputModelData.guid
                });
              }

                /*      if(this.pagetype==2){
                   this.addHawbDialog=false;
                  this.getHawbList()
                } */
              } else {
                this.$message.error(results.data.resultmessage);
              }
            });
        } else {
          if (this.sizeForm.declList.length > 1) {
            this.sizeForm.declList.splice(index, 1);
          }
        }
      }
      },

      confirmHawbDanhaoFunc(type) {
        //分运单号批量确认
        //type1 确认 2取消确认

        // if(this.allDeclInfo.length>0){
          let weight = this.allDeclInfo.reduce(
            (prev, i) => (prev += Number(i.weight)),
            0
            );
          console.log(this.inputModelData.zdweight)
          console.log(weight)
          if (
            type == 1 &&
            this.hasBgService &&
            this.inputModelData.zdweight != 0 &&
            weight != 0 &&
            Number(this.inputModelData.zdweight).toFixed(2) !=
            Number(weight).toFixed(2)
            ) {
            return this.$message.error("报关单重量之和必须等于总单制单重量！");
        }
        // }

        let url =
        type == 1
        ? "api/ExAxpline/ConfirmHawbNo"
        : "api/ExAxpline/RevertConfirmHawbNo";
        let guid = this.hawbTableData
        .filter(i => i.hawbnoconfirmstatus == type)
        .map(i => i.guid)
        .toString();
        if (!guid) {
          return this.$message.error(
            `所选数据中没有需要${type == 1 ? "确认" : "取消确认"}的数据！`
            );
        }
        let json = {
          guid: guid,
          czman: localStorage.usrname,
          hpoid: this.inputModelData.guid,
          boguid: this.inputModelData.boguid
        };

        this.confrimBillApi(json, url, 2);
      },

      confirmMawbDanhaoFunc() {
        //总运单号确认
        let ifCof = this.inputModelData.dzstatus < 350;
        let url = ifCof
        ? "api/ExHpoAxpline/ConfirmMawbNo"
        : "api/ExHpoAxpline/RevertConfirmMawbNo";
        let json = {
          guid: this.inputModelData.guid,
          czman: localStorage.usrname
        };
        if (ifCof) {
          if (this.inputModelData.zdweight <= 0) {
            return this.$message.error("请填写制单重量！");
          }
          if (this.inputModelData.zdvolume <= 0) {
            return this.$message.error("请填写制单体积！");
          }
          if (this.inputModelData.jfweight <= 0) {
            return this.$message.error("请填写计费重量！");
          }
          if (!this.inputModelData.zzg) {
            return this.$message.error("请填写中转港！");
          }
          json = Object.assign({}, this.inputModelData, json);
        }
        this.confrimBillApi(json, url);
      },
      confirmMawbFunc() {
        //总运单确认
        this.inputModelData.oldshipaceid = this.inputModelData.shipaceid;
        let url = "",
        json = {};
        if (this.ifDanzhengConfirmUse) {
          url = "api/ExHpoAxpline/ConfirmMawb";
          json = this.inputModelData;
        } else {
          url = "api/ExHpoAxpline/RevertConfirmMawb";
          json = { hpoid: this.inputModelData.guid };
        }
        if (this.ifDanzhengConfirmUse) {
          if (this.inputModelData.zdweight <= 0) {
            return this.$message.error("请填写制单重量！");
          }
          if (this.inputModelData.zdvolume <= 0) {
            return this.$message.error("请填写制单体积！");
          }
          if (this.inputModelData.jfweight <= 0) {
            return this.$message.error("请填写计费重量！");
          }
          let temp =
          this.$refs.mawbMakingbill && this.$refs.mawbMakingbill.getInfo(1);
          if (temp && temp != "undefined") {
            this.$refs.mawbMakingbill
            .saveBillInfo(this.pagetype == 1 ? 1 : 700)
            .then(res => {
              if (res) {
                this.confrimBillApi(json, url);
              }
            });
          } else {
            return;
          }
        } else {
          this.confrimBillApi(json, url);
        }
      },
      dzmodifystatusFunc() {
        //总单单证待修改
        let modelData = this.inputModelData;
        let url = "api/ExHpoAxpline/MawbDzWaitEdit";
        let data = {
          czman: localStorage.usrname,
          guid: this.inputModelData.guid
        };
        if (
          modelData.dzmodifystatus == 2 ||
          modelData.dzmodifystatusams == 2 ||
          modelData.dzmodifystatusdz == 2 ||
          modelData.dzmodifystatustyt == 2
          ) {
          url = "api/ExHpoAxpline/MawbDzWaitEditSave";
        data = Object.assign({}, modelData, data);
        data.dzmodifystatus = 3;
        data.dzmodifystatusman = localStorage.usrname;
        data.dzmodifystatusdate = formatDate(new Date(), "yyyy-MM-dd hh:mm");
        data.dzmodifystatusams = 3;
        data.dzmodifystatusdz = 3;
        data.dzmodifystatustyt = 3;
      }

      this.confrimBillApi(data, url);
      },
      
    confrimBillApi(json, url, type) {
      this.$axios({
        method: "post",
        url: this.$store.state.webApi + url,
        data: json,
        noarea: true,
        loading: true,
        tip: false
      }).then(results => {
          //  console.log(results);
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            if (type == 2) {
              //分单批量确认
              this.getHawbList();
              if (!this.showBasicInfo) {
                this.getMawbDetail();
                this.$emit("confirmHawbRefresh", 5);
              }
            } else {
              this.getMawbDetail();
              this.getHawbList();
              this.$emit("confirmHawbRefresh", 5);
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
    },
    selOptionShow(khjcnoData) {
        //判断进仓编号是否已经使用
        if (this.hawbTableData) {
          var isUse = false;
          this.hawbTableData.forEach((item, key) => {
            if (
              item.khjcnoGuid &&
              item.khjcnoGuid.split(",").includes(khjcnoData.guid) &&
              item.guid != this.sizeForm.guid
              ) {
              isUse = true;
          }
        });
          return isUse;
        }
      },
      async getMawbDetail() {
        await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: this.mawbdetail.boguid },
          loading: true,
          tip: false
        }).then(results => {
          // console.log(results)
          // console.log(results.data)

          this.inputModelData = results.data;
          if (this.mawbdetail.pagetype) {
            this.inputModelData.pagetype = this.mawbdetail.pagetype;
          }
          this.inputModelData.pageSign = this.pagetype == 2 ? "海关联系单" : ""; //页面标识

          if (this.inputModelData.shipaceInfo) {
            this.inputModelData.hbh = results.data.shipaceInfo.hbh;
            this.inputModelData.hbrq = results.data.shipaceInfo.hbrq;
            this.inputModelData.qfsj = results.data.shipaceInfo.qfsj;
            this.inputModelData.qcts = results.data.shipaceInfo.qcts;
          }

          this.inputModelData.smallpiece =
          this.inputModelData.smallpiece || this.inputModelData.zdpiece;

          if (
            (this.inputModelData.czlx &&
              this.inputModelData.czlx.indexOf("代操作") >= 0) || !this.projectIsWecan
            ) {
            this.inputModelData.zdvolume =
          this.inputModelData.zdvolume || this.inputModelData.realvolume;
          this.inputModelData.zdweight =
          this.inputModelData.zdweight || this.inputModelData.realweight;
          if (!this.inputModelData.zzg && this.mawbdetail.zzg) {
            this.inputModelData.zzg = this.mawbdetail.zzg;
          }
          if (this.mawbdetail.zzglist) {
            this.basicInformation.zzg.servicecode = this.mawbdetail.zzglist;
          }
        }
        this.inputModelData.deliverydate = formatDate(
          this.inputModelData.deliverydate,
          "yyyy-MM-dd hh:mm"
          );
        this.inputModelData.qfsj = formatDate(
          this.inputModelData.qfsj,
          "hh:mm"
          );
        this.inputModelData.yjqfsj = formatDate(
          this.inputModelData.yjqfsj,
          "yyyy-MM-dd hh:mm"
          );
        this.inputModelData.hbrq = formatDate(
          this.inputModelData.hbrq,
          "yyyy-MM-dd"
          );
        this.inputModelData.yqhbrq = formatDate(
          this.inputModelData.yqhbrq,
          "yyyy-MM-dd"
          );

        this.inputModelData.zdpiece = this.inputModelData.zdpiece || this.inputModelData.realpiece;

        if (this.pagetype == 2) {
          this.inputModelData.chinesepm =
          this.inputModelData.chinesepm || "CONSOL";
          this.inputModelData.taxcode_shr_mawb =
          this.inputModelData.taxcode_shr_mawb || "9999+";
          this.inputModelData.taxcode_fhr_mawb =
          this.inputModelData.taxcode_fhr_mawb || "9999+91310000607424985W";
          this.inputModelData.phone_fhr_mawb =
          this.inputModelData.phone_fhr_mawb || "021 50104800";
          this.inputModelData.phone_shr_mawb =
          this.inputModelData.phone_shr_mawb || "1 320 3303 200";
          this.inputModelData.city_fhr_mawb =
          this.inputModelData.city_fhr_mawb || this.inputModelData.sfg;
          this.inputModelData.city_shr_mawb =
          this.inputModelData.city_shr_mawb || this.inputModelData.mdg;
          this.basicInformation.bgweight.required = true;

          let zzdate = formatDate(
            new Date(new Date().getTime() + 5 * 3600000),
            "yyyy-MM-dd hh:mm"
            );
            //  this.inputModelData.zzdate=zzdate
            this.$set(this.inputModelData, "zzdate", zzdate);
          } else {
            if (!this.showBasicInfo) {
              this.$emit("success", this.inputModelData);
            }
          }



          this.setFieldsView()
        });
        return true;
      },
      setFieldsView() {
        if (this.pagetype == 1 && (this.dom == 2 || this.isOrderConfirm)) {
          if (
            (this.inputModelData.mawbConfirmOverStatus == 1 || !this.ifDanzhengConfirmUse) &&
            this.inputModelData.dzmodifystatus != 2
            ) {
            this.inputViewData.englishpm.idClass = "";
            this.inputViewData.handlinginfo.idClass = '';
            this.inputViewData.smallpiece.idClass = '';
          if (this.inputViewData.chinesepm) {
            this.inputViewData.chinesepm.idClass = "";
          }
        } else {
          this.inputViewData.englishpm.idClass = "pointerAll";
          this.inputViewData.handlinginfo.idClass = 'pointerAll'
          this.inputViewData.smallpiece.idClass = 'pointerAll';
          if (this.inputViewData.chinesepm) {
            this.inputViewData.chinesepm.idClass = "pointerAll";
          }
        }
      }
      if (this.pagetype == 1 && this.dom == 1) {
        if (!this.ifDanhaoConfirmUse && this.hawbDanhaoAllConfirm) {
          this.basicInformation.orderdom.disabled = true;
            // this.basicInformation.zzg.disabled = true;
            //this.basicInformation.cp.disabled = true;
          } else {
            this.basicInformation.orderdom.disabled = false;
            // this.basicInformation.zzg.disabled = false;
            // this.basicInformation.cp.disabled = false;
          }
          this.$parent.$parent.$parent.basicInformation.orderdom.idClass = !this.ifDanhaoConfirmUse && this.hawbDanhaoAllConfirm && this.inputModelData.orderdom == '总单' && this.inputModelData.czlx == '代操作' ? '' : "pointerAll"

        }
        if (this.inputModelData.iscomboine == 1) {
          this.basicInformation.orderdom.disabled = true;
        }
        if (this.projectIsWecan) {
          if (this.inputModelData.czlx == "自货") {
            this.basicInformation.cp.disabled = true;
          } else {
            this.basicInformation.cp.disabled = false;
          }
        }

        if (
          (this.pagetype == 1 && this.inputModelData.czlx == "代操作") ||
          (!this.projectIsWecan && this.ifDanhaoConfirmUse)
          ) {
          this.basicInformation.zdweight.type = 1;
        this.basicInformation.zdweight.required = true;
        this.basicInformation.zdvolume.type = 1;
        this.basicInformation.zdvolume.required = true;
        this.basicInformation.jfweight.type = 1;
        this.basicInformation.jfweight.required = true;
      }

      if (this.pagetype == 1) {
        if (this.projectIsWecan) {
          this.basicInformation.yqhbh.disabled = true;
          this.basicInformation.yqhbrq.disabled = true;
        }
        this.basicInformation.ybpiece.type = 18;
        this.basicInformation.ybweight.type = 18;
        this.basicInformation.ybvolume.type = 18;
        this.basicInformation.ybvolume.required = true;
        this.basicInformation.zzdate.idStyle = {
          visibility: "hidden"
        };
          //this.basicInformation.zzdate.hidden=true
          if (this.inputViewData.chinesepm) {
            this.inputViewData.chinesepm.required = false;
          }
        } else {
          this.basicInformation.ybvolume.required = false;
          this.inputViewData.chinesepm.required = true;
          this.basicInformation.zzdate.idStyle = { visibility: "" };
          // this.basicInformation.zzdate.hidden=false
          this.basicInformation.yqhbh.required = true;
          this.basicInformation.yqhbrq.required = true;
        }
      },

      getAllHawb() {
        //获取全部总单数据，分单数据，报关单数据
        /*     let json={guid:this.mawbdetail.boguid}
       this.$axios({
          method: "get",
          url: this.$store.state.webApi + 'api/ExHpoAxpline',
          params: json,
          loading: true,
          tip: false
        }).then(results => {
            console.log(results)
            this.allHawbInfo=results.data.resultdic.axplist
        })
        */
      },
      getRealList() {
        //配货时查询实际入库信息,进仓编号列表
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/Store/GetRealListByHpoid",
          params: { hpoid: this.mawbdetail.guid },
          noarea: true,
          loading: true,
          tip: false,
          nofield: true
        }).then(results => {
          //  console.log(results);
          this.jcnoNumberList = results.data;
        });
      },
      getHawbList() {
        this.resetForm();

        console.log(this.allDeclInfo)
        this.hawbTableData = [];
        this.allDeclInfo = [];
        this.hawb_list = ["汇总信息", "总运单信息", "Manifest制作"];
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/axpline/GetAxplineDecl",
          params: { hpoid: this.mawbdetail.guid },
          loading: true,
          tip: false
        }).then(results => {

          this.allDeclInfo = [];

          // if (results.data.length == 0) {
          //   this.togglehawb(this.hawb_list[0], 0);
          // }
          this.hawbTableData = JSON.parse(JSON.stringify(results.data));

          let ponoLength = 0;
          this.hawbTableData.forEach((i, k) => {
            if (this.pagetype != 2) {
              this.hawb_list.push(i.hawb);
              this.allDeclInfo.push(...i.declList);
            } else {
              i.declList.forEach((n, m) => {
                this.allDeclInfo.push(Object.assign({}, n, { hawb: i.hawb }));
                this.hawb_list.push(n.pono);
                if (!this.tabsShow.includes(ponoLength + this.initialTabLength)) {
                  //如果是海关联系单，就显示所有分单
                  this.tabsShow.push(ponoLength + this.initialTabLength);
                }
                ponoLength++;
              });
            }
          });

          if (this.showHawb) {
            this.togglehawb(this.showHawb, this.hawb_list.indexOf(this.showHawb));
          }
          //  this.getmaxTabLength()
          this.getPonoList();
        });
      },
      async operHawbList(index, type) {
        //type  3 删除,其他是新增与修改
        let data = { czman: localStorage.usrname, axpList: [] };
        if (type == 3) {
          data.axpList = [this.hawbTableData[index]];
          data.axpList[0].isdel = 2;
          this.$confirm("是否确认删除", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            // this.adoptApi(data);
            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/ExAxpline",
              data: {
                czman: localStorage.usrname,
                orderdom: this.mawbdetail.orderdom,
                sid: this.mawbdetail.guid,
                guid: this.hawbTableData[index].guid,
                boguid: this.mawbdetail.boguid
              },
              loading: true,
              noarea: true,
              tip: false
            }).then(results => {
              if (results.data.resultstatus == 0) {
                this.$message.success(results.data.resultmessage);
                this.getHawbList();
                if (!this.showBasicInfo) {
                  this.$emit("confirmHawbRefresh", this.dom);
                }
              } else {
                this.$message.error(results.data.resultmessage);
              }
            });
          });
        } else {
          if (this.mawbdetail.iscomboine == 1 && !this.pono) {
            return this.$message.error("请选择订单号！");
          }
          this.sizeForm.ybvolume = this.sizeForm.ybvolume || 0;
          if (
            !this.sizeForm.hawb ||
            !this.sizeForm.ybpiece ||
            !this.sizeForm.ybweight ||
            //   !this.sizeForm.ybvolume ||
            !this.sizeForm.sfg ||
            !this.sizeForm.mdg ||
            this.sizeForm.khjcnoArr.length == 0
            ) {
            return this.$message.error("有必填字段为空，请先完善信息！");
        }

        if (this.sizeForm.guid > 0) {
            //修改
            if (
              this.hawbTableData.filter(
                i => i.hawb == this.sizeForm.hawb && i.guid != this.sizeForm.guid
                ).length > 0
              ) {
              return this.$message.error("分运单号重复！");
          }
        } else {
            //新增
            if (
              this.hawbTableData.filter(i => i.hawb == this.sizeForm.hawb)
              .length > 0
              ) {
              return this.$message.error("分运单号重复！");
          }
          this.sizeForm.hwxz = this.inputModelData.hwxz;
          this.sizeForm.hwlx = this.inputModelData.hwlx;
        }
        if (
          this.hasBgService &&
          (this.pagetype == 2 ||
            this.sizeForm.declList.filter(i => i.pono).length > 0)
          ) {
          if (
            this.sizeForm.declList.length !=
            [...new Set(this.sizeForm.declList.map(i => i.pono))].length
            ) {
            return this.$message.error("报关单号不能重复！");
        }
        let piece = 0,
        weight = 0;
        for (let i in this.sizeForm.declList) {
          let item = this.sizeForm.declList[i];
          piece += Number(item.piece);
          weight += Number(item.weight);

          if (
            !item.pono ||
            Number(item.piece) == 0 ||
            !item.weight ||
            !item.bggys ||
            !item.bglx
            ) {
            return this.$message.error(
              "有报关单的必填字段为空，请先完善信息！"
              );
        }
      }
            // if (piece != this.sizeForm.ybpiece) {
            //   return this.$message.error("报关单件数之和必须等于分单件数！");
            // }
            let confirm = true;
            if (piece < this.sizeForm.ybpiece) {
              return this.$message.error("报关单件数之和不能小于分单件数！");
            }

            if (piece > this.sizeForm.ybpiece) {
              confirm = await this.$confirm(
                "报关单件数已大于分单件数，是否继续",
                "提示",
                {
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "warning"
                }
                ).catch(() => { });
            }

            if (!confirm) return;

            /*  if(Number(weight).toFixed(2)!=Number(this.sizeForm.ybweight).toFixed(2)){
                        return this.$message.error('报关单重量之和必须等于分单重量！');
                      } */
                    } else {
                    }

                    let sizeform = JSON.parse(JSON.stringify(this.sizeForm));
                    sizeform.declList = sizeform.declList.filter(
                      i => i.pono && i.piece && i.bggys
                      );
                    let khjcnoArr = [];
                    let khjcnoGuid = [];
                    sizeform.khjcnoArr.forEach(i => {
                      let arr = this.jcnoNumberList.filter(e => e.guid == i);
                      if (arr.length == 1) {
                        khjcnoArr.push(i);
                        khjcnoGuid.push(arr[0].guid);
                      } else {
                        khjcnoArr.push(...new Array(arr.lenght).fill(i));
                        khjcnoGuid.push(...arr.map(i => i.guid));
                      }
                    });
          // console.log(khjcnoArr)
          // console.log(khjcnoGuid)
          sizeform.khjcno = khjcnoArr.toString();
          sizeform.khjcnoGuid = khjcnoGuid.toString();
          // sizeform.khjcnoArr =[...new Set(sizeform.khjcnoArr)]
          /*   sizeform.khjcno = sizeform.khjcnoArr.toString();
          sizeform.khjcnoGuid = sizeform.khjcnoArr
            .map(i => this.jcnoNumberList.filter(e => e.khjcno == i)[0].guid)
            .toString(); */

            data.axpList = [sizeform];
            data.axpList[0].hpoid = this.mawbdetail.guid;
            data.boguid = this.mawbdetail.boguid;

            this.adoptApi(data);
          }
        },
        updateHawbList(row) {
          this.addHawbDialog = true;
          this.sizeForm = Object.assign({}, this.sizeForm, row);
          this.sizeForm.khjcnoArr = this.sizeForm.khjcnoGuid
          ? this.sizeForm.khjcnoGuid.split(",")
          : [];
          this.sizeForm.khjcnoArr = [...new Set(this.sizeForm.khjcnoArr)];
          this.sizeForm.khjcno = this.sizeForm.khjcnoArr.toString();

          if (this.sizeForm.declList.length == 0) {
            this.sizeForm.declList = [
            {
              pono: this.pagetype == 2 ? this.sizeForm.hawb : "",
              piece: this.pagetype == 2 ? this.sizeForm.ybpiece : "",
              weight: this.pagetype == 2 ? this.sizeForm.ybweight : "",
              bglx: "普通报关",
              bggys: "",
              lds: 0,
              isdel: 1,
              guid: -1,
              hpoid: this.inputModelData.guid
            }
            ];
          }
          this.hawbSelFunc(this.sizeForm.khjcnoArr);

          this.ponoListOriginal.forEach(i => {
            i.axplist.forEach(e => {
              if (e.hawb == row.hawb) {
                this.pono = i.pono;
              }
            });
          });
        },
        adoptApi(data) {
          this.$axios({
            method: "post",
            url: this.$store.state.webApi + "api/ExplineAndDecl",
            data: data,
            loading: true,
            noarea: true,
            tip: false
          }).then(results => {
          //  console.log(results);
          if (results.data.resultstatus == 0) {
            // if(this.sizeForm.guid>0){
              this.addHawbDialog = false;
            ///   }
            if (!this.showBasicInfo) {
              this.$emit("confirmHawbRefresh", this.dom);
            }
            if (this.mawbdetail.iscomboine == 1) {
              this.relationPono(
                results.data.resultguid > 0 ? results.data.resultguid : ""
                );
            } else {
              this.getHawbList();
            }

            this.$message.success(results.data.resultmessage);
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
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
      relationPono(hawbguid) {
        //关联分单与订单号

        let data = {
          hpoid: this.ponoListOriginal.filter(i => i.pono == this.pono)[0]
          .operguid,
          axpguid:
          hawbguid ||
          this.hawbTableData.filter(i => i.hawb == this.sizeForm.hawb)[0].guid
        };
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/updateAxplineHpo",
          data: data,
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          //  console.log(results)
          if (results.data.resultstatus == 0) {
            this.getHawbList();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
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
      clearHawb() {
        this.hawb_list = [];
        this.hawbInfo = [];
      },
      togglehawb(hawb, index) {
        this.cur_index = index;
        if (!this.tabsShow.includes(index)) {
          this.tabsShow.push(index);
        }
      },
      getSfhInfo() {
        if (this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit()) {
          // this.$message.error("请检查总单收发货人信息是否超出字符限制！");
          return false;
        }
        return this.inputModelData;
      },
      setpono() {
        //设置报关单
        let val = this.sizeForm.hawb;

        if (val.length >= 4) {
          let letterarr = [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
          ];
          this.sizeForm.declList.forEach((d, v) => {
            if (!d.pono) {
              // d.pono = val.substr(-7, 7) + letterarr[0];
              // d.hpoid = this.inputModelData.guid;
              d.pono = val;
            }
            // else {
            //   letterarr.splice(letterarr.indexOf(d.pono.substr(-1, 1)), 1);
            // }
          });
        }
      },
      sendCustomsContact() {
        if (this.addHawbDialog) {
          return this.$message.error("请先保存或取消分单基本信息！");
        }
        //海关联系单发送
        var mawbinfo = JSON.parse(JSON.stringify(this.inputModelData));
        delete mawbinfo.dzstatus;
        delete mawbinfo.status;
        delete mawbinfo.shipaceInfo;
        delete mawbinfo.serviceList;

        let hawbinfo =
        mawbinfo.orderdom != "直单"
        ? JSON.parse(JSON.stringify(this.allHawbInfo))
        : [];

        // console.log(JSON.stringify(hawbinfo))
        let nodecl = this.hawbTableData.filter(i => i.declList.length == 0);
        if (mawbinfo.orderdom == "总单" && nodecl.length > 0) {
          return this.$message.error("分单" + nodecl[0].hawb + "无报关单");
        }

        let data = {
          mawb: "总运单号",
          ybpiece: "件数",
          bgweight: "重量",
          zzdate: "装载日期",
          chinesepm: "中文品名",
          mdg: "目的港",
          sfg: "始发港",
          yqhbrq: "要求航班日期",
          yqhbh: "要求航班号",
          companytitle_fhr_mawb: "总单发货人的抬头",
          address_fhr_mawb: "总单发货人的地址",
          companycode_fhr_mawb: "总单发货人的国家二字码",
          //   lxr_fhr_mawb:'总单发货人的联系人',
          phone_fhr_mawb: "总单发货人的联系电话",
          taxcode_fhr_mawb: "总单发货人的信用代码",
          companytitle_shr_mawb: "总单收货人的抬头",
          address_shr_mawb: "总单收货人的地址",
          companycode_shr_mawb: "总单收货人的国家二字码",
          //  lxr_shr_mawb:'总单收货人的联系人',
          phone_shr_mawb: "总单收货人的联系电话",
          taxcode_shr_mawb: "总单收货人的信用代码"
        };
        let hawb = {
          ybpiece: "件数",
          ybweight: "重量",
          chinesepm: "中文品名",
          companytitle_fhr_hawb: "发货人的抬头",
          address_fhr_hawb: "发货人的地址",
          companycode_fhr_hawb: "发货人的国家二字码",
          //  lxr_fhr_hawb:'发货人的联系人',
          phone_fhr_hawb: "发货人的联系电话",
          taxcode_fhr_hawb: "发货人的信用代码",
          companytitle_shr_hawb: "收货人的抬头",
          address_shr_hawb: "收货人的地址",
          companycode_shr_hawb: "收货人的国家二字码",
          phone_shr_hawb: "收货人的联系电话",
          //  lxr_shr_hawb:'收货人的联系人',
          taxcode_shr_hawb: "收货人的信用代码"
        };
        //let taxcodeReg=/^(?=.*[\+])(?=.*[0-9])[0-9a-zA-Z\+]{8,50}/   //信用代码验证正则
        let taxcodeReg = /^[9]{4}[\+]{1}[0-9a-zA-Z]{8,50}/; //信用代码验证正则
        let arr = Object.keys(data);
        for (let i in arr) {
          let field = arr[i];
          let title = data[arr[i]];
          if (!mawbinfo[field]) {
            return this.$message.error("请填写总运单的" + title);
          } else {
            if (!/^[0-9]{3}-[0-9]{8}$/.test(mawbinfo.mawb)) {
              return this.$message.error("总运单号格式不正确！");
            }

            // if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,}$/).test(mawbinfo.yqhbh)){
            //   return this.$message.error('总单航班号格式不正确！');
            // }

            if (mawbinfo.chinesepm.length > 256) {
              return this.$message.error("总单中文品名的长度不能超出256字符！");
            }

            /*        if(mawbinfo.companytitle_fhr_mawb.length>35||mawbinfo.companytitle_shr_mawb.length>35){
                return this.$message.error('总单收发货人的抬头不能超过35位！');
              }
  
  
           if(mawbinfo.address_fhr_mawb.length>70||mawbinfo.address_shr_mawb.length>70||mawbinfo.companytitle_fhr_mawb.length>70||mawbinfo.companytitle_shr_mawb.length>70){
                return this.$message.error('总单收发货人的地址不能超过70位！');
              } */

              if (
                mawbinfo.companycode_fhr_mawb.length != 2 ||
                mawbinfo.companycode_shr_mawb.length != 2
                ) {
                return this.$message.error(
                  "总单收发货人的国家二字码必须是两位数！"
                  );
            }

            if (
              mawbinfo.lxr_fhr_mawb.length > 30 ||
              mawbinfo.lxr_shr_mawb.length > 30
              ) {
              return this.$message.error("总单收发货人的联系人不能超过30位！");
          }
            ///[A-Za-z@:：.]/g
            if (
              !/^[0-9 -]+$/.test(mawbinfo.phone_shr_mawb) ||
              !/^[0-9 -]+$/.test(mawbinfo.phone_fhr_mawb)
              ) {
              return this.$message.error("总单收发货人的联系电话格式不正确！");
          }
            //     if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,50}$/).test(mawbinfo.taxcode_shr_mawb)||!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,50}$/).test(mawbinfo.taxcode_fhr_mawb)){
            //   return this.$message.error('总单收发货人的信用代码格式不正确！');
            // }
            if (
              !taxcodeReg.test(mawbinfo.taxcode_shr_mawb) ||
              !taxcodeReg.test(mawbinfo.taxcode_fhr_mawb)
              ) {
              return this.$message.error(
                "总单收发货人的信用代码格式不正确,必须是'9999+'加数字字母组合！"
                );
          }
        }
      }

      if (this.$refs.makeBillRevSed && this.$refs.makeBillRevSed.ifHasLimit()) {
        this.$message.error("请检查总单收发货人信息是否超出字符限制！");
        return false;
      }

      let arr1 = Object.keys(hawb);

      for (let i in hawbinfo) {
        let obj = hawbinfo[i];

        for (let i in arr1) {
          let field = arr1[i];
          let title = hawb[arr1[i]];
          if (!obj[field]) {
            return this.$message.error(
              "请填写报关单" + obj.hawb + "的" + title
              );
          } else {
            if (obj.hawb.length > 12) {
              return this.$message.error(
                "报关单" + obj.hawb + "分单号不能超出12位！"
                );
            }
            if (obj.chinesepm.length > 256) {
              return this.$message.error(
                "报关单" + obj.hawb + "中文品名的长度不能超出256字符！"
                );
            }
            if (obj.ifHasLimit) {
              return this.$message.error(
                "报关单" + obj.hawb + "收发货人信息超出字符限制！"
                );
            }
              /*    if(obj.companytitle_fhr_hawb.length>35||obj.companytitle_shr_hawb.length>35){
                              return this.$message.error('分单'+obj.hawb+'收发货人的抬头不能超过35位！');
                            }
                           if(obj.address_fhr_hawb.length>70||obj.address_shr_hawb.length>70||obj.companytitle_fhr_hawb.length>70||obj.companytitle_shr_hawb.length>70){
                              return this.$message.error('分单'+obj.hawb+'收发货人的地址不能超过70位！');
                            } */

                            if (
                              obj.companycode_fhr_hawb.length != 2 ||
                              obj.companycode_shr_hawb.length != 2
                              ) {
                              return this.$message.error(
                                "报关单" + obj.hawb + "收发货人的国家二字码必须是两位数！"
                                );
                          }

                          if (obj.lxr_fhr_hawb.length > 30 || obj.lxr_shr_hawb.length > 30) {
                            return this.$message.error(
                              "报关单" + obj.hawb + "收发货人的联系人不能超过30位！"
                              );
                          }
                          if (
                            !/^[0-9 -]+$/.test(obj.phone_shr_hawb) ||
                            !/^[0-9 -]+$/.test(obj.phone_fhr_hawb)
                            ) {
                            return this.$message.error(
                              "报关单" + obj.hawb + "收发货人的联系电话格式不正确！"
                              );
                        }
                        if (
                          !taxcodeReg.test(obj.taxcode_shr_hawb) ||
                          !taxcodeReg.test(obj.taxcode_fhr_hawb)
                          ) {
                          return this.$message.error(
                            "报关单" +
                            obj.hawb +
                            "收发货人的信用代码格式不正确，" +
                            "必须是'9999+'加数字字母组合,至少10位！"
                            );
                      }
              /*   if (
                this.hawbTableData.filter(i => i.guid == obj.guid)[0].declList
                  .length == 0
              ) {
                return this.$message.error("分单" + obj.hawb + "无报关单！");
              } */
            }
          }
        }

        if (mawbinfo.orderdom != "直单") {
          let ybpiece = hawbinfo.reduce(
            (prev, i) => (prev += Number(i.ybpiece)),
            0
            );
          let ybweight = Number(
            hawbinfo.reduce((prev, i) => (prev += Number(i.ybweight)), 0)
            ).toFixed(2);

          if (mawbinfo.ybpiece != ybpiece) {
            return this.$message.error("报关单件数之和必须等于总单预报件数！");
          }

          // if (
          //   Number(mawbinfo.ybweight).toFixed(2) !=ybweight
          // ) {
          //   return this.$message.error("报关单重量之和必须等于总单预报重量！");
          // }
          if (Number(mawbinfo.bgweight).toFixed(2) != ybweight) {
            return this.$message.error("报关单重量之和必须等于总单报关重量！");
          }
        }

        let declList = [];
        if (mawbinfo.orderdom == "直单") {
          declList = this.straightDeclListTableData;
        } else {
          this.hawbTableData.forEach(i => {
            declList = declList.concat(i.declList);
          });
        }
        if (declList.length == 0) {
          return this.$message.error("请至少添加一条报关单信息！");
        }
        mawbinfo.declList = [];
        if (mawbinfo.orderdom == "直单" && declList.length >= 2) {
          mawbinfo.declList = this.straightDeclListTableData;
        } else {
          mawbinfo.declList = this.allHawbInfo;
        }

        if (
          mawbinfo.ybpiece !=
          declList.reduce((prev, i) => (prev += Number(i.piece)), 0)
          ) {
          return this.$message.error("报关单件数之和必须等于总单预报件数！");
      }
        // if (
        //   Number(mawbinfo.ybweight).toFixed(2) !=
        //   Number(
        //     declList.reduce((prev, i) => (prev += Number(i.weight)), 0)
        //   ).toFixed(2)
        // ) {
        //   return this.$message.error("报关单重量之和必须等于总单预报重量！");
        // }
        if (
          Number(mawbinfo.bgweight).toFixed(2) !=
          Number(
            declList.reduce((prev, i) => (prev += Number(i.weight)), 0)
            ).toFixed(2)
          ) {
          return this.$message.error("报关单重量之和必须等于总单报关重量！");
      }

      let json = {
        czman: localStorage.usrname,
        boguid: this.inputModelData.boguid,
        valtype: 1,
        zzdate: this.inputModelData.zzdate
      };
        //  json.hpoInfo={
        //           companytitle_shr_mawb:mawbinfo.companytitle_shr_mawb.substr(0,34),
        //           address_shr_mawb:mawbinfo.address_shr_mawb.substr(0,69),
        //           companycode_shr_mawb:mawbinfo.companycode_shr_mawb,
        //           phone_shr_mawb:mawbinfo.phone_shr_mawb,
        //           companytitle_fhr_mawb:mawbinfo.companytitle_fhr_mawb.substr(0,34),
        //           address_fhr_mawb:mawbinfo.address_fhr_mawb.substr(0,69),
        //           companycode_fhr_mawb:mawbinfo.companycode_fhr_mawb,
        //           phone_fhr_mawb:mawbinfo.phone_fhr_mawb,
        //           lxr_fhr_mawb:mawbinfo.lxr_fhr_mawb,
        //           lxr_shr_mawb:mawbinfo.lxr_shr_mawb,
        //           ybweight:mawbinfo.ybweight,
        //           ybpiece:mawbinfo.ybpiece,
        //           chinesepm:mawbinfo.chinesepm,
        //           paymode:mawbinfo.paymode,
        //           mdg:mawbinfo.mdg,
        //           sfg:mawbinfo.sfg,
        //           hbrq:mawbinfo.yqhbrq,
        //           hbh:mawbinfo.yqhbh,
        //           mawb:mawbinfo.mawb,
        //           orderdom:mawbinfo.orderdom,
        //           guid:mawbinfo.guid,
        //           taxcode_shr_mawb:mawbinfo.taxcode_shr_mawb,
        //           taxcode_fhr_mawb:mawbinfo.taxcode_fhr_mawb,
        //  }
        /*   mawbinfo.companytitle_shr_mawb=mawbinfo.companytitle_shr_mawb.substr(0,34);
    mawbinfo.address_shr_mawb=mawbinfo.address_shr_mawb.substr(0,69);
    mawbinfo.companytitle_fhr_mawb=mawbinfo.companytitle_fhr_mawb.substr(0,34);
    mawbinfo.address_fhr_mawb=mawbinfo.address_fhr_mawb.substr(0,69); */
    mawbinfo.hbh = mawbinfo.yqhbh;
    mawbinfo.hbrq = mawbinfo.yqhbrq;
    json.hpoInfo = mawbinfo;
        /*       json.axpList = hawbinfo.map((i, k) => {
          i.hawb = i.hawb.substr(0, 12);
          i.guid = i.guid || -1;
          i.hpoid = this.mawbdetail.guid;
          i.hbh = this.mawbdetail.hbh;
          i.hbrq = this.mawbdetail.hbrq;
          i.declList = this.hawbTableData[k].declList.map(e => {
            e.hpoid = this.mawbdetail.guid;
            e.sid = i.guid;
            return e;
          });
          return i;
        });
        */
        //  console.log(json);return
        //concactJztype 1预报 2实际

        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExportXMLNew",
          data: json,
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          //  console.log(results);
          if (results.data.resultstatus == 0) {
            this.$message(results.data.resultmessage);
            this.getMawbDetail();
            this.inputModelData.customstatus = 2;
            // this.axpListGuid=results.data.resultno;
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      getStraightDeclLis() {
        //直单时候的报关单信息，单独处理
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/GetDeclByHpoid",
          params: { hpoid: this.mawbdetail.guid },
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          //  console.log(results.data)
          this.straightDeclListTableData = results.data;
          this.resetStraightDeclLis();
        });
      },
      saveStraightDeclLis() {
        let methods = "";
        let json = {};
        let url = "";
        let decl = JSON.parse(JSON.stringify(this.straightDeclListForm));

        if (this.straightDeclListForm.guid > 0) {
          json = decl;
          json.modifyman = localStorage.usrname;
          json.modifydate = formatDate(new Date(), "yyyy-MM-dd hh:mm");
          json.czman = localStorage.usrname;
          methods = "put";
          url = "api/ExAxplineDecl";
          if (
            this.straightDeclListTableData.filter(
              i => i.pono == decl.pono && i.guid != decl.guid
              ).length > 0
            ) {
            return this.$message.error("报关单号重复！");
        }
      } else {
        json = { czman: localStorage.usrname, declInfo: decl };
        json.declInfo.hpoid = this.inputModelData.guid;
        methods = "post";
        url = "api/ExAxplineDeclInsert";
        if (
          this.straightDeclListTableData.filter(i => i.pono == decl.pono)
          .length > 0
          ) {
          return this.$message.error("报关单号重复！");
      }
    }

    if (
      !decl.pono ||
      !decl.piece ||
      !decl.weight ||
      !decl.bggys ||
      !decl.bglx
      ) {
      return this.$message.error("有必填字段为空，请先完善信息！");
  }

  this.$axios({
    method: methods,
    url: this.$store.state.webApi + url,
    data: json,
    noarea: true,
    loading: true,
    tip: false
  }).then(results => {
          //  console.log(results);
          if (results.data.resultstatus == 0) {
            this.$message(results.data.resultmessage);
            this.getStraightDeclLis();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
},
delStraightDeclList(index) {
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
        guid: this.straightDeclListTableData[index].guid
      },
      loading: true,
      noarea: true,
      tip: false
    }).then(results => {
      if (results.data.resultstatus == 0) {
        this.straightDeclListTableData.splice(index, 1);
        this.resetStraightDeclLis();
      } else {
        this.$message.error(results.data.resultmessage);
      }
    });
  });
},
resetStraightDeclLis() {
  let piece =
  this.inputModelData.ybpiece -
  this.straightDeclListTableData.reduce(
    (prev, i) => (prev += Number(i.piece)),
    0
    );
  let weight =
  this.inputModelData.ybweight -
  this.straightDeclListTableData.reduce(
    (prev, i) => (prev += Number(i.weight)),
    0
    );

  this.straightDeclListForm = {
    pono: this.mawbdetail.mawb && this.mawbdetail.mawb.replace("-", ""),
    piece: "",
    weight: "",
    bglx: "普通报关",
    bggys: "",
    lds: 0,
    isdel: 1,
    guid: -1
  };

  this.straightDeclListForm.piece = piece > 0 ? piece : 0;
  this.straightDeclListForm.weight =
  weight > 0 ? Number(weight).toFixed(2) : 0;
},
hawbSelFunc(val) {
  this.sizeForm.khjcno = val.toString();
  let realPiece = 0,
  realWeight = 0,
  realVolume = 0;
  val.forEach(i => {
    this.jcnoNumberList.forEach(e => {
      if (i == e.guid) {
        realPiece += e.piece;
        realWeight += e.weight;
        realVolume += e.volume;
      }
    });
  });
  this.sizeForm.realPiece = realPiece;
  this.sizeForm.realWeight = Number(realWeight).toFixed(2);
  this.sizeForm.ybpiece = realPiece;
  this.sizeForm.ybweight =
  this.sizeForm.guid > 0 && this.sizeForm.ybweight != 0
  ? this.sizeForm.ybweight
  : Number(realWeight).toFixed(2);
  this.sizeForm.realVolume = Number(realVolume).toFixed(3);
},
removehawb(index) {
  if (index == "总运单信息") {
    this.$confirm("是否确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExHpoAxplineMawbDoc",
        data: {
          czman: localStorage.usrname,
          guid: this.inputModelData.guid
        },
        loading: true,
        noarea: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
                  //  this.tableDataRes.splice(index,1);
                  this.$message.success(results.data.resultmessage);
                } else {
                  this.$message.error(results.data.resultmessage);
                }
              });
    })
    .catch(() => { });
  } else {
    this.$confirm("是否确认删除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      this.$axios({
        method: "delete",
        url: this.$store.state.webApi + "api/ExAxplineHawbDoc",
        data: {
          czman: localStorage.usrname,
          guid: this.hawbTableData.filter(i => i.hawb == index)[0].guid
        },
        loading: true,
        noarea: true,
        tip: false
      }).then(results => {
        if (results.data.resultstatus == 0) {
                  //  this.tableDataRes.splice(index,1);
                  this.$message.success(results.data.resultmessage);
                  this.getHawbList();
                  if (!this.showBasicInfo) {
                    this.$emit("confirmHawbRefresh", this.dom);
                  }
                } else {
                  this.$message.error(results.data.resultmessage);
                }
              });
    })
    .catch(() => { });
  }
},
getmaxTabLength() {
  let maxTabLength = Math.floor(
    ($(".tabs-header-confirmdetail:visible").width() - 60) / 160
    );
  if (maxTabLength < 7) {
    maxTabLength = 7;
  }
  if (maxTabLength > 9) {
    maxTabLength = 9;
  }

  this.maxTabLength = maxTabLength;
},
judgeTabShow(index) {
  return !(
    (index > this.initialTabLength - 1 &&
      this.inputModelData.orderdom == "直单") ||
    (index == 2 && this.pagetype == 2) ||
    (index > 0 && this.dom == 1 && !this.isOrderConfirm && !this.showBasicInfo)
    );
},
setRound(jfweight) {
        //校正重量的值
        var val = 0;
        var jfweight = Number(jfweight);
        var wc = jfweight - parseInt(jfweight);
        if (wc == 0 || wc == 0.5) {
          val = jfweight;
        } else {
          val = wc > 0.5 ? parseInt(jfweight) + 1 : parseInt(jfweight) + 0.5;
        }
        return val;
      },
      getNumberTotal(type) {
        //type1分单 2报关单
        let str = "0/0.00";
        let piece = 0,
        weight = 0,
        volume = 0,
        cpiece = 0,
        cweight = 0,
        cvolume = 0;
        this.hawbTableData.forEach(i => {
          //  console.log(i)
          piece += Number(i.realPiece);
          weight += Number(i.realWeight);
          volume += Number(i.realVolume);
          i.declList.forEach(e => {
            cpiece += Number(e.piece);
            cweight += Number(e.weight);
          });
        });

        if (type == 1) {
          str = `${Number(piece)}/${Number(weight).toFixed(2)}/${Number(
            volume
            ).toFixed(3)}`;
          } else {
            str = `${Number(cpiece)}/${Number(cweight).toFixed(2)}`;
          }
        //console.log(str)
        return str;
      }
    },

    computed: {
      bubbles() {
        return (
          this.setRound(this.inputModelData.realweight) -
          this.setRound(this.inputModelData.realvolume / 0.006) >
          0
          );
      },
      cur_hawb() {
        return this.hawb_list[this.cur_index];
      },
      billNeed() {
        let isexport = 0;
        if (this.inputModelData.mawb && localStorage.airinfo) {
          JSON.parse(localStorage.airinfo).forEach(i => {
            if (i.ThreeCode == this.inputModelData.mawb.substr(0, 3)) {
              isexport = i.isexport;
            }
          });
        }
        return this.inputModelData.mawbss == "我司运单" && isexport == 1;
      },
      mawbNeedLimit() {
        return (
          (this.billNeed && this.inputModelData.ismakemawb == 1) ||
          this.pagetype == 2
          );

        /*       return (this.billNeed&&this.hasMawbService)||((this.inputModelData.ismakeams == 1
          ? true
          : this.inputModelData.ismakemawb == 1)||(this.pagetype==1&&this.dom==2)) */
        },
        hawbNeedLimit() {
          return (
            (this.billNeed && this.inputModelData.ismakehawb == 1) ||
            this.pagetype == 2
            );

        /*  return (this.billNeed&&this.hasHawbService)||((this.inputModelData.ismakeams == 1
          ? true
          : this.inputModelData.ismakehawb == 1)||(this.pagetype==1&&this.dom==2)) */
        },
        hasMawbService() {
        //是否有总单服务
        return (
          this.inputModelData.serviceList &&
          this.inputModelData.serviceList.find(
            i => i.servicecode == "AA0110" && i.isdel == 1
            )
          );
      },
      
      hasHawbService() {
        //是否有分单服务
        return (
          this.inputModelData.serviceList &&
          this.inputModelData.serviceList.find(
            i => i.servicecode == "AA0120" && i.isdel == 1
            )
          );
      },

      hasBgService() {
        //是否有报关服务，若有需要加报关单
        let flag =
        this.inputModelData.serviceList &&
        this.inputModelData.serviceList.find(
          i => i.servicecode == "AA0610" && i.isdel == 1
          );
        if (!flag) {
          this.inputModelData.zdweight =
          this.inputModelData.zdweight || this.inputModelData.bgweight;
        }
        return flag;
      },

      ifConfirmUse() {
        //是否可点总单确认
        if (this.dom == 1 && !this.isOrderConfirm) {
          return (
            (this.inputModelData.czlx == "代操作"
              ? this.inputModelData.dzstatus == 100
              : this.inputModelData.dzstatus == 300) || 400
            );
        } else {
          return (
            this.inputModelData.dzstatus == 350 ||
            this.inputModelData.dzstatus == 400
            );
        }
      },

      ifDanzhengConfirmUse() {
        return this.inputModelData.dzstatus < 400;
      },

      ifDanzhengConfirmUseDisabled() {
        if (this.pagetype==1&&(this.dom==2||this.isOrderConfirm)&&this.inputModelData.mawbConfirmOverStatus !=1) {
          return !this.ifDanzhengConfirmUse
        }

        if ((this.dom==2||this.isOrderConfirm)&&this.inputModelData.mawbConfirmOverStatus==1&&this.pagetype==1) {
          return (this.inputModelData.mawbConfirmOverStatus==1&&this.inputModelData.dzmodifystatus!=2)
        }
      },

      ifDanhaoConfirmUse() {
        //总单号是否确认,返回true代表未确认
        return this.inputModelData.dzstatus < 350;
      },

      hawbDanhaoAllConfirm() {
        //分单号是否全部确认
        // console.log(this.hawbTableData)
        return (
          this.hawbTableData.filter(
            i => i.hawbnoconfirmstatus == 2 || i.hawbnoconfirmstatus == "已确认"
            ).length == this.hawbTableData.length && this.hawbTableData.length > 0
          );
      },

      baoguanFinished() {
        //报关服务是否完成
        return (
          this.inputModelData.serviceList &&
          this.inputModelData.serviceList.find(
            i => i.servicecode == "AA0610" && i.status == 500
            ) &&
          this.pagetype == 2
          );
      }
    },

    watch: {
      allHawbInfo: {
        handler(val) {
          val.forEach(i => {
            this.hawbTableData.forEach(e => {
              if (e.hawb == i.hawb) {
                if (i.hawbconfirmstatus) {
                  e.hawbconfirmstatus = i.hawbconfirmstatus;
                }
                if (i.hawbnoconfirmstatus) {
                  e.hawbnoconfirmstatus = i.hawbnoconfirmstatus;
                }
              }
            });
          });
        },
        immediate: true,
        deep: true
      },

      // ifDanzhengConfirmUse: {
      //   handler(val) {
      //     if (!val) {
      //       this.inputViewData.englishpm.idClass = "";
      //       if ( this.inputViewData.handlinginfo ) {
      //          this.inputViewData.handlinginfo.idClass = ''
      //       }
      //       if (this.inputViewData.chinesepm) {
      //         this.inputViewData.chinesepm.idClass = "";
      //       }
      //     } else {
      //       this.inputViewData.englishpm.idClass = "pointerAll";
      //       if ( this.inputViewData.handlinginfo ) {
      //         this.inputViewData.handlinginfo.idClass = 'pointerAll'
      //       }
      //       if (this.inputViewData.chinesepm) {
      //         this.inputViewData.chinesepm.idClass = "pointerAll";
      //       }
      //     }
      //   },
      //   deep: true,
      //   immediate: true,
      // }
    },
    mounted() {
      this.resetForm();
    },
    created() {
      //  window.onresize= ()=>{
      //      this.getmaxTabLength()
      // }
      if (!this.showBasicInfo) {
        this.$watch(
          () => {
            return this.mawbdetail;
          },
          newval => {
            Object.keys(this.inputModelData).forEach(k => {
              if (
                this.inputModelData[k] != newval[k] &&
                this.mawbdetail.hasOwnProperty(k)
                ) {
                this.inputModelData[k] = newval[k];
            }
          });

            if (
              this.inputModelData.dzstatus >= 700 &&
              this.inputModelData.commbillmodifystatus == "2" &&
              this.inputModelData.status < 500 &&
              this.inputModelData.czlx == "代操作"
              ) {
              //代修改
            this.basicInformation.mdg.disabled = false;
          } else {
            this.basicInformation.mdg.disabled = true;
          }
        },
        { deep: true }
        );
      }

      this.getMawbDetail().then(re => {
        //  console.log(re)
        //取完总单数据后再执行查询报关数据
        this.setFieldsView()

        if (this.pagetype == 2 || this.inputModelData.orderdom == "直单") {
          this.getStraightDeclLis();
        }

        if (
          !this.inputModelData.jfweight ||
          Number(this.inputModelData.jfweight).toFixed(2) ==
          Number(
            computedWeight(
              this.inputModelData.zdvolume,
              this.inputModelData.zdweight
              )
            ).toFixed(2)
          ) {
          this.$watch(
            function () {
              return this.inputModelData.cp;
            },
            function (newVal, oldVal) {
              if (Number(this.inputModelData.cp) == 666666 || this.inputModelData.cp == '' || this.inputModelData.cp === null) {
                this.inputModelData.cp = ''; return
              }
              if (Number(this.inputModelData.cp) > 100) {
                this.inputModelData.cp = '';
                this.$message.error("请输入0-100的数值");
                return;
              }

              var num =
              (this.inputModelData.realvolume -
                this.inputModelData.zdweight * 0.006) *
              (1 - this.inputModelData.cp / 100) +
              this.inputModelData.zdweight * 0.006;

              if (num && !this.bubbles) {
                this.inputModelData.zdvolume = Number(
                  parseInt(num * 1000) / 1000
                  ).toFixed(3);
              }
            },
            { immediate: true }
            );
        this.$watch(
          function(){
           return this.inputModelData.zdvolume
         },
         function(newVal,oldVal){
          this.inputModelData.jfweight=Number(
            computedWeight(
              this.inputModelData.zdvolume,
              this.inputModelData.zdweight
              )
            ).toFixed(2)
        }
        )
      }

      if (!this.inputModelData.jfweight && this.pagetype == 1) {
        this.$watch(
          function () {
            return this.inputModelData.zdweight + this.inputModelData.zdvolume;
          },
          function (newVal, oldVal) {
            this.inputModelData.jfweight = computedWeight(
              this.inputModelData.zdvolume,
              this.inputModelData.zdweight
              );
          },
          { immediate: true }
          );
      }

      this.$watch(
        function () {
          return this.inputModelData.zdweight;
        },
        function (newVal, oldVal) {
          let zdweight = this.inputModelData.zdweight,
          realweight = this.inputModelData.realweight;
          this.basicInformation.zc.hidden = true;
          if (Number(zdweight) != 0 && Number(realweight) != 0) {
            let spcWeight = (1 - realweight / zdweight) * 100;
              // this.$set(this.inputModelData, "zc", "超过3%");
              // console.log(spcWeight)
              if ((spcWeight > 3 || spcWeight < -3) && spcWeight != 1) {
                if (Math.abs(Number(spcWeight).toFixed(1)) >= 3) {
                  this.basicInformation.zc.hidden = false;
                }
              }
            }
          },
          { immediate: true }
          );

      this.$watch(
        () => {
          return (
            this.inputModelData.zdweight +
            this.inputModelData.zdvolume +
            this.inputModelData.jfweight +
            this.inputModelData.zzg
            );
        },
        () => {
          if (!this.showBasicInfo) {
            this.$emit("success", this.inputModelData);
          }
        }
        );
    });

      this.getHawbList();

      this.getRealList();
      // this.getAllHawb();
      if (this.pagetype == 3) {
        this.basicInformation.orderdom.disabled = true;
        this.mawbBillShow = true;
      }

      if (this.isOrderConfirm) {
        this.inputViewData = {
          mawb: {
            title: "总运单号：",
            itemStyle: { width: "280px" },
            type: 18,
          },
          smallpiece: {
            title: "小件数：",
            type: 1,
            verify: "integer",
            // idStyle: { width: "50%" }
            // occupyRestSpace: true
          },
          sfg: {
            title: "始发港：",
            type: 18,
            pagetype: 6,
            verify: "uppercase"
          },
          mdg: {
            title: "目的港：",
            type: 18,
            pagetype: 6,
            verify: "uppercase"
          },
          zdpiece: {
            title: "制单件数：",
            type: 18,
            verify: "integer",
          },
          zdweight: {
            title: "制单重量：",
            type: 18,
            verify: "fixedTwo",
          },
          zdvolume: {
            title: "制单体积：",
            type: 18,
            verify: "fixedThree"
          },
          jfweight: {
            title: "计费重量：",
            type: 18
          },
           paymode: {
            title: "运费条款：",
            type: 3,
            groupid: "125",
            idStyle: { width: "100%" },
            itemStyle: { width: "100%" }
          },
          englishpm: {
            title: "英文品名：",
            type: 17,
            verify: "uppercase",
            itemStyle: { width: "560px" }
          },
          handlinginfo: {
            title: "Handing Information：",
            type: 17,
            verify: "uppercase",
            occupyAline: true, 
            titleStyle: { 'word-break': 'break-word', 'line-height': 'initial'},
            itemStyle: { width: "560px" }
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
.paneDisabled {
  cursor: not-allowed;

  > div {
    pointer-events: none;
  }

  /deep/ div {
    pointer-events: none;
  }
}

h3 {
  margin: 10px 0px 6px;
  //   text-indent: 40px;
}

.mawbform {
  width: 800px;
  justify-content: flex-start;
  display: flex;
  margin-top: 10px;

  span {
    margin-right: 20px;
    flex: 1;
  }
}

@tabs-p: {
  position: relative;
  float: left;
  width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  text-align: left;
  text-indent: 12px;
  color: #999;
  border: 1px solid #e8e8e8;
  cursor: pointer;

  &.is-active {
    color: #0f5a8c;
    font-weight: 600;
    font-size: 16px;
    /*  background: #fff;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #fff; */
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
};

.hawbTabs {
  position: relative;
  width: 100%;

  .tabs-header {
    position: relative;
    z-index: 500;
    width: 100%;
    height: 42px;
    overflow: hidden;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;
    border-bottom: 0px;

    .left-title {
      height: 40px;
      padding-left: 6px;
      font-size: 14px;
      color: #0f5a8c;
      font-weight: bolder;
      border-bottom: 1px solid #e8e8e8;
    }

    .header-c {
      position: absolute;
      // padding: 0 60px 0 0;
      transition: top 0.5s;
      left: 0px;
      top: 0px;
      // width: 1280px;
      width: 1240px;

      p {
        @tabs-p();
        width: 160px;
        border-top: 0;
        border-bottom: 0;
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
    left: 2px;
    right: 5px;
    background: #fff;
    padding: 12px 12px 0;
    transition: all 0.5s;
    // width: 1280px;
    width: 1180px;

    p {
      @tabs-p();
      margin-right: 12px;
      margin-bottom: 12px;
    }

    p.is-active {
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

.detail {
  position: relative;
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;

  &:last-child {
    margin-bottom: 0;
  }

  > .detail-title {
    position: relative;
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
    font-size: 14px;
    font-weight: bolder;
    color: #0f5a8c;
    background: #f8f8f8;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 5px;
  }

  .detail-c {
    padding: 20px;
  }
}

.bottom-tip {
  position: fixed;
  text-align: right;
  margin-right: 15px;
  width: 1588px;
  bottom: 14px;
  background: #fff;
  padding: 10px 0px;
  right: 31px;
  padding-right: 28px;
  border-top: 1px solid #ccc;
  -webkit-box-shadow: 0px 0px 10px #666;
  box-shadow: 0px 0px 10px #666;
  z-index: 999;
}
</style>