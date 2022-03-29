<template>
  <div v-scroll="onScroll" style="width:100%;height:100%;overflow:hidden scroll;"
    :style="{'max-height':pagetype==2&&frompage!=3?'750px':''}" class="newOrderAdd" :frompage="frompage">
    <!-- {{ybstoreListBackup}} -->
    <!-- {{inputModelData.hawbList}}
    <p></p> -->
    <!-- {{inputModelData.serviceList}} -->
    <!-- {{inputModelData.ybstoreList}} -->
    <!-- {{getInitData()}} -->
    <!-- {{inputModelData}} -->
    <!-- {{inputModelData.opersystem}}
    {{inputModelData.opersystemdom}}
    {{inputModelData.system}} -->
    <!-- {{inputModelData.isneedfenpei}} -->
    <!-- {{inputModelData.cus_real_bp_freight_in}} -->

<!--     {{inputModelData.fid}} -->
<!--     {{inputModelData.gid}} -->
    <!-- {{basicinfoRequired}}
    {{inputModelData.orderdomOut}} -->
    <!-- {{pagestep}} -->

    <!-- <el-button @click="assignH()" type="primary" >分配</el-button> -->
    <!-- <el-button @click="saveWaitFp(2)" type="primary">确定分配</el-button> -->

    <!-- <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="quickadd" style="width:120px">测试数据</el-button>
      <el-button type="primary" @click="initDataFunc" style="width:120px">初始化</el-button>
      <el-button type="primary" @click="outPagestep-=1" style="width:120px">上一步</el-button>
      <el-button type="primary" @click="outPagestep+=1" style="width:120px">下一步</el-button>
    </div> -->
    <!-- 头部摘要及功能按钮 -->
    <div
      style="background:#fff;padding-right: 8px;position: sticky;top: 0px;z-index: 999;display: flex;justify-content: space-between;padding-bottom: 15px;"
      v-if="pagetype==2&&frompage!=3">
      <div>
        <h3 v-if="inputModelData.creditisbackstatus==4||inputModelData.creditisbackstatus==5"
          style="color:red;margin-bottom:8px;">*信控待通过，{{inputModelData.creditcontent}}。</h3>
        <div
          style="display: inline-block;margin-right:20px;padding:4px 10px;background-color:#FEEAE9;border-radius:14px;color:red;font-size:16px;">
          <span>订舱编号：</span>
          {{inputModelData.pono}}
        </div>
      </div>


      <!-- <div v-if="pagetype==2&&frompage!=3">
        <div style="text-align: right;">
          <el-button @click="putMawbInfo" type="primary"
            v-if="frompage!=2&&(!inputModelData.outsidedom&&inputModelData.orderguid=='-1')||inputModelData.outsidedom=='AMAZON'">
            保存</el-button>
          <el-button @click="$emit('update:visible',false)">返回</el-button>
        </div>
      </div> -->
    </div>

    <div class="mawbAddNew" :class="{disabled:inputModelData.status==600}">

      <div v-show="outPagestep==1">

        <!-- start第一页内容开始 -->
        <newFormCmpt @click.native="formclick($event)" :system="inputModelData.system"
          :required.sync="basicinfoRequired" :view-data.sync="basicinfoView" :model-data.sync="inputModelData"
          :pagetype="2" :area="inputModelData.area" @changeRelData="inputModelData.customerRelList = $event" id="baseContent" 
          :is-order-add="true">
          <!-- <template slot="exForm">
          <fenpei :fenpeiguid="mawbguid" v-if="tempConfigShow" :inputModelData="inputModelData"
            :information="information" @back="assignShowDelete(1)" ref="fenpei" :system="inputModelData.system"
            :new-add="1" pagetype=2>
          </fenpei>
        </template> -->
          <template slot="customRelOutside">
            <customerRel :fid="inputModelData.fid" v-if="inputModelData.gid" :gid="inputModelData.gid || ''"
              :area="inputModelData.area || ''" :isoutside="isoutside">
            </customerRel>
          </template>
        </newFormCmpt>



        <!-- 当选择国内服务时的服务列表 -->
        <div class="detail" v-if="inputModelData.opersystem=='国内服务'&&tempConfigShow">
          <div class="detail-title">
            服务项目
          </div>
          <div class="detail-c" style="padding:8px">
            <tempConfig name="mawbAddNew.vue" style="position:absolute;top:1px;right:0px;"
              :system="inputModelData.system" :type="80" :jsondata.sync="serviceList">
            </tempConfig>
            <serviceList pagetype="1" :newService.sync="newService" :opersystem="inputModelData.opersystem"
              :orderdom="inputModelData.orderdom" :system="inputModelData.system">
            </serviceList>
          </div>
        </div>


        <div style="text-align: right;" v-show="pagestep==1">
          <!-- 批量新增 -->
          <mawbImport
            v-if="inputModelData.orderdom == '总单' && !isMawbImport&&inputModelData.system=='空出'&&inputModelData.ordertype==2"
            class="mawb-import" :area="inputModelData.area" 
            :fid="inputModelData.fid" 
            :gid="inputModelData.gid"
            :customer="inputModelData.customerRelList"
            :orderdom="inputModelData.orderdom">
          </mawbImport>
          <el-button @click="checkFirstPage()" type="primary" v-else v-show="pagetype==1&&nextstepshow">下一步</el-button>
        </div>
        <!-- end第一页内容结束 -->


        <!-- start:第二页内容开始 -->
        <!-- 第二页的时候非国内服务的内容 -->
        <div v-show="pagestep==2&&inputModelData.opersystem!='国内服务'">
          <!-- 订舱信息 -->
          <div 
            class="reconciliationMng" 
            style="text-align: center;" 
            v-if="pagetype==1">
            <el-button-group class="buttonTabs">
              <el-button 
                @click.native="inputModelData.isimperfect=2" 
                v-if="inputModelData.czlx!='代操作'"
                :class="[inputModelData.isimperfect==2?'active':'']">
                预订舱
              </el-button>
              <el-button 
                @click.native="inputModelData.isimperfect=1" 
                v-if="inputModelData.czlx!='代操作'"
                :class="[inputModelData.isimperfect==1?'active':'']">
                正式订舱
              </el-button>
            </el-button-group>
          </div>

          <commonTabs :list="goodsinfoTabs" style="margin-top: 12px;" v-show='inputModelData.isimperfect'
            :showExpanionBtn="false" :checkedIndex.sync="goodsinfoTabsChecked" :showTooltip="false" titlefield="title">

            <div class="detail" id="goodsinfoView" style="margin-top: 0;">
              <div class="detail-title">
                <!-- 订舱信息 -->
                {{goodsinfoTabs[goodsinfoTabsChecked].title.split('（')[0]}}
              </div>
              <div class="detail-c">
                <div v-show="goodsinfoTabsChecked==0">
                  <newFormCmpt :system="inputModelData.system" :view-data.sync="goodsinfoView"
                    :required.sync="goodsinfoRequired" :model-data.sync="inputModelData" :pagetype="2"
                    :area="inputModelData.area" ref="formCompt">
                    <!-- <template slot="mawbAe">
                  <div v-if="pagetype==1">
                    <el-input v-model.lazy="inputModelData.mawb" style="width:144px;"
                      :disabled="importActiveName === 'repeatOrder'" clearable v-verify="supplementView.mawbAe.verify"
                      maxlength="12"></el-input>
                    <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialogFunc"
                      style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:2px;top:2px"></i>
                    <span style="margin-left:30px;" v-if="mawbgys">运单供应商：{{mawbgys.split('-')[1]}}</span>
                  </div>
                  <configMawb :inputModelData="inputModelData" v-if="pagetype==2"></configMawb>
                </template> -->
                    <hwxzComptNew slot="exForm1" showGuageString :gooodsOutgauge="gooodsOutgauge"
                      :inputModelData="inputModelData">
                    </hwxzComptNew>
                    <template slot="mawbAe">
                      <div v-if="pagetype==1">
                        <el-input v-model.lazy="inputModelData.mawb" style="width:168px;"
                          :disabled="importActiveName === 'repeatOrder'" clearable
                          v-verify="goodsinfoView.mawbAe.verify" maxlength="12"></el-input>
                        <!-- <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialogFunc"
                          style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:2px;top:2px"></i> -->
                        <span style="margin-left:30px;" v-if="mawbgys">运单供应商：{{mawbgys.split('-')[1]}}</span>
                      </div>
                      <configMawb :inputModelData="inputModelData" v-if="pagetype==2"></configMawb>
                    </template>
                  </newFormCmpt>

                </div>

                <div v-show="goodsinfoTabsChecked==1">
                  <newFormCmpt :system="inputModelData.system" :view-data.sync="supplementView"
                    :model-data.sync="inputModelData" :pagetype="2" :required.sync="supplementRequired"
                    :area="inputModelData.area" @wtdataP="wtdataP"
                    @changeRelData="inputModelData.customerRelList = $event">
                    <template slot="mawbAe">
                      <div v-if="pagetype==1">
                        <el-input v-model.lazy="inputModelData.mawb" style="width:168px;"
                          :disabled="importActiveName === 'repeatOrder'" clearable
                          v-verify="supplementView.mawbAe.verify" maxlength="12"></el-input>
                        <!-- <i title="总运单维护" class="el-icon-edit-outline" @click="mawbDialogFunc"
                          style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:2px;top:2px"></i> -->
                        <span style="margin-left:30px;" v-if="mawbgys">运单供应商：{{mawbgys.split('-')[1]}}</span>
                      </div>
                      <configMawb :inputModelData="inputModelData" v-if="pagetype==2"></configMawb>
                    </template>
                  </newFormCmpt>
                </div>


                <div v-show="goodsinfoTabsChecked==2">
                  <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSed" v-if="inputModelData.orderdom!='分单'">
                  </revSedMawb>
                  <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSedHawb" v-else>
                  </revSedMawb>
                  <revSed :dzinfo="inputModelData" ref="tzrRev">
                    <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码"
                      v-model="inputModelData.taxcode_tzr_mawb" v-verify="'creditCode'"></el-input>
                  </revSed>
                </div>
                
                <!-- TODO: 分单信息（选填） -->
                <div v-show="goodsinfoTabsChecked==3">
                   <div>
                      <hawbAdd :mawbdetail="inputModelData" ref="hawbtab" :showContent="detailShow.supplement"></hawbAdd>
                  </div>
                </div>


              </div>
            </div>

          </commonTabs>

          <!-- 运价信息 -->
          <div id="fareInputViewData" v-show="isBookingInformation">
            <div class="detail" v-show="inputModelData.czlx!='代操作'&&inputModelData.opersystem=='出口'">
              <div class="detail-title">
                <p>运价信息</p>
              </div>
              <div class="detail-c">
               <!-- 此处备注系统卡的关键 -->
               <!-- :required.sync="fareinfoRequired" -->
                <newFormCmpt :view-data.sync="fareInputViewDataYdc"  v-enterfocus
                  :model-data.sync="inputModelData" :area="inputModelData.area" :pagetype="2"
                  @inwageallinpriceFunc="inwageallinpriceFunc" v-show="inputModelData.isimperfect==2"></newFormCmpt>
               <!--  :required.sync="fareinfoRequired" -->
                <newFormCmpt :view-data.sync="fareInputViewData"  v-enterfocus
                  :model-data.sync="inputModelData" :area="inputModelData.area" :pagetype="2"
                  @inwageallinpriceFunc="inwageallinpriceFunc" v-show="inputModelData.isimperfect==1"></newFormCmpt>
              </div>
            </div>

            <div class="detail" v-show="inputModelData.czlx=='代操作'&&inputModelData.opersystem=='出口'">
              <div class="detail-title">
                <p>操作费信息</p>
              </div>
              <div class="detail-c">
                <newFormCmpt :view-data.sync="operfareViewData" :model-data.sync="inputModelData"
                  :area="inputModelData.area" :pagetype="2"></newFormCmpt>
              </div>
            </div>
          </div>

          <!-- 服务项目 -->
          <div class="detail" id="serviceDetail" style="z-index: 2;"
            v-show="inputModelData.isimperfect==1&&isBookingInformation">
            <div class="detail-title">
              服务项目
            </div>
            <div class="detail-c" style="padding:8px">
              <tempConfig name="mawbAddNew.vue" style="position:absolute;top:1px;right:0px;"
                :system="inputModelData.system" :type="80" :jsondata.sync="serviceList" v-if="tempConfigShow">
              </tempConfig>

              <div v-if="isoutside">
                <serviceListOutside pagetype="1" v-if="pagetype==1" :newService.sync="newService"
                  :opersystemdom="inputModelData.opersystemdom" :orderdom="inputModelData.orderdom" ref="service"
                  :system="inputModelData.system" @exInfoClick="exInfo">
                </serviceListOutside>

                <serviceListOutside :newService.sync="newService" v-if="pagetype==2&&inputModelData.boguid"
                  :opersystem="inputModelData.opersystem" pagetype="2" :serviceList="inputModelData.serviceList"
                  ref="serviceTemp" :orderguid="inputModelData.orderguid" :orderdom="inputModelData.orderdom"
                  :system="inputModelData.system" @exInfoClick="exInfo"></serviceListOutside>

              </div>


              <serviceList v-else :pagetype="inputModelData.guid>0?2:1"
                :serviceList="inputModelData.guid>0?inputModelData.serviceList:[]" :newService.sync="newService"
                :opersystem="inputModelData.opersystem" :orderdom="inputModelData.orderdom"
                :system="inputModelData.system" :czlx="inputModelData.czlx">
              </serviceList>



            </div>
          </div>

           <!-- 货物信息 -->
          <div class="detail" id="houseNumberAdd" v-show="inputModelData.isimperfect==1&&isBookingInformation">
            <div class="detail-title" style="display:flex;justify-content: space-between;">
              <span>货物信息</span>
              <!-- <span>
                    <span style="margin-right:30px;color:red" v-show="gooodsOutgauge"><i
                        class="el-icon-question"></i>含有超规货物</span>
                    <el-button type="primary" size="small" icon="el-icon-plus" v-visible="false">新增进仓编号</el-button>
                  </span> -->
            </div>
            <div class="detail-c" style="padding:0px;" v-if="pagetype==2?inputModelData.guid>0:true">
              <houseNumberAdd :serviceSelArr="serviceSelArr" @goodsHawbChange="goodsHawbChange"
                :inputModelData="inputModelData" ref="houseNumberAdd" :applicationPage="isoutside?2:1" 
                :isWaybill="inputModelData.orderdom=='直单'&& inputModelData.czlx == '代操作'">
              </houseNumberAdd>
            </div>
          </div>

          
          
          <div style="margin-bottom:20px;position: relative;padding-top:40px" id="supplementView"
            v-show="detailShow.supplementView&&inputModelData.isimperfect==1&&false">
            
            <div style="cursor:pointer;position: absolute;padding:8px;left:0px;top:0px;z-index: 999;">请填写分单信息 </div>

            <el-button @click="detailShow.supplement=!detailShow.supplement;"
              style="cursor:pointer;position: absolute;padding:8px;right:10px;top:0px;z-index: 999;"
              :icon="detailShow.supplement?'el-icon-caret-top':'el-icon-caret-bottom'">
              {{!detailShow.supplement?'展开面板':'收起面板'}}</el-button>

            <div>
             <!--  <hawbAdd :mawbdetail="inputModelData" ref="hawbtab" :showContent="detailShow.supplement"></hawbAdd> -->
            </div>
            <!-- <commonTabs :list="tabsList" :showExpanionBtn="false" :showContent="detailShow.supplement"
            :checkedIndex.sync="tabsChecked" titlefield="title" color="rgb(255,0,5)" @toggle="handleClick"
            :showTooltip="false">
            <div v-show="tabsChecked==0">
              <newFormCmpt :system="inputModelData.system" :view-data.sync="supplementView"
                :model-data.sync="inputModelData" :pagetype="2" :required.sync="supplementRequired"
                :area="inputModelData.area" @wtdataP="wtdataP" @changeRelData="inputModelData.customerRelList = $event">

                <template slot="sfhinfo">
                  <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSed" v-if="inputModelData.orderdom!='分单'">
                  </revSedMawb>
                  <revSedMawb :dzinfo="inputModelData" ref="makeBillRevSedHawb" v-else>
                  </revSedMawb>
                </template>

                <template slot="tzrinfo">
                  <revSed :dzinfo="inputModelData" ref="tzrRev">
                    <el-input slot="textCode" type="textarea" rows="1" placeholder="信用代码"
                      v-model="inputModelData.taxcode_tzr_mawb" v-verify="'creditCode'"></el-input>
                  </revSed>
                </template>

              </newFormCmpt>
            </div>
            <div v-show="tabsChecked==1">
              <hawbAdd :mawbdetail="inputModelData" ref="hawbtab"></hawbAdd>
            </div>
          </commonTabs> -->
          </div>

          <!-- 底部按钮->start -->
          <div class="footer" v-if="inputModelData.isimperfect&&isBookingInformation">
            <div class="right-btn" v-if="!isMawbImport&&pagetype==1">
              <!-- <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(1)" type="primary">保存待处理</el-button> -->
              <!-- <el-button :disabled="saveBtnDisabled" @click="saveWaitFunc" type="primary"
              v-if="inputModelData.orderdom!=='分单'">保存并分配
            </el-button> -->

              <!-- <el-button :disabled="saveBtnDisabled" @click="assignH" type="primary"
              v-if="inputModelData.orderdom!=='分单'">保存并分配
            </el-button>

            <el-button :disabled="saveBtnDisabled" v-if="inputModelData.orderdom!=='分单'"
              @click="saveMawbInfo" type="primary">
              {{areaStateCode}}操作</el-button>
            <el-button @click="pagestep=1" v-if="inputModelData.system!='国内服务'">返回</el-button> -->
              <el-button @click="pageChange(2)" v-if="isoutside" type="primary">
                下一步</el-button>
              <section v-else>
                  <!--  done: 确认订舱按钮旁加重置按钮，功能初使化到最初页面 -->
                  <el-button 
                    type="danger"
                    @click="resetInitData"
                    >
                    重置
                  </el-button>
                 <el-button @click="confirmSave"  type="primary">
                确认订舱</el-button>
              </section>  
             

            </div>
            <div class="right-btn" v-if="pagetype==2&&inputModelData.status!=600">
              <!-- <el-button @click="orderCancel=true" type="primary" style="background:#FA1A1A">
              撤单/驳回/退关</el-button> -->
              <!-- <el-button @click="putMawbInfo" type="primary" title="保存修改">保存</el-button> -->
            </div>
          </div>

          <div class="pointDiv" v-if="pagetype==1">
            <span v-for="(item,index) in pointArr" v-show="item.show" :class="{pointChecked:pointIndex==index}">
              <i></i>
              <a :href="item.href" @click="pointIndex=index">{{item.title}}</a></span>
          </div>

        </div>


        <!-- 第一页的时候非国内服务的内容 -->

        <!-- 国内服务的基本信息及各个服务内容 -->
        <div v-if="pagestep==2&&inputModelData.opersystem=='国内服务'">

          <!-- <div class="detail">
          <div class="detail-title">
            服务项目
          </div>
          <div class="detail-c" style="padding:8px">
            <tempConfig name="mawbAddNew.vue" style="position:absolute;top:1px;right:0px;"
              :system="inputModelData.system" :type="80" :jsondata.sync="serviceList" v-if="tempConfigShow">
            </tempConfig>
            <serviceList pagetype="1" :newService.sync="newService" :opersystem="inputModelData.opersystem"
              :orderdom="inputModelData.orderdom" :system="inputModelData.system">
            </serviceList>
          </div>
        </div> -->

          <div class="detail">
            <div class="detail-title">
              基本信息
            </div>
            <div class="detail-c">
              <newFormCmpt :system="inputModelData.system" :view-data.sync="homeInformation"
                :model-data.sync="inputModelData" :pagetype="2" @wtdataP="wtdataP" :area="inputModelData.area"
                @changeRelData="inputModelData.customerRelList = $event" style="max-width:1260px"
                :required.sync="gnServiceRequired">
                <template slot="khjcnolist">
                  <enterWarehouseBogn :khjcnolist="inputModelData.khjcnolist" :serviceSelArr="serviceSelArr"
                    :inputModelData="inputModelData">
                  </enterWarehouseBogn>
                </template>
              </newFormCmpt>
            </div>
          </div>



          <div style="margin-top:20px">
            <commonTabs :list="serviceTabsList" :showContent="false" :showTooltip="false" :titleStyle="serviceTabsStyle"
              :checkedIndex.sync="serviceTabsChecked" titlefield="title" color="rgb(255,0,5)">
            </commonTabs>

            <myServicePane code="AA0410">
              <template slot="extraComp">
                <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList" :piece="inputModelData.piece">
                </storeCompSize>
              </template>
            </myServicePane>

            <myServicePane code="AG0145">
              <template slot="extraComp">
                <storeCompSize :storeList.sync="inputModelData.ybstorevolumeList" :piece="inputModelData.piece">
                </storeCompSize>
              </template>
            </myServicePane>

            <!-- 目的港入唯凯仓 -->
            <myServicePane code="AB0420">
              <template slot="extraComp">
                <storeCompSize :storeList.sync="inputModelData.ybstorevolumeListMdg" :piece="inputModelData.piece">
                </storeCompSize>
              </template>
            </myServicePane>

            <!-- 唯凯提货 -->
            <myServicePane code="AA0510">
              <template slot="extraComp">
                <takeGoodsAdd :inputModelData.sync="inputModelData" ref="takeGoodsAddRef" id="ybTransstoreList">
                </takeGoodsAdd>
              </template>
            </myServicePane>

            <!-- 唯凯送货 -->
            <myServicePane code="AB0520">
              <template slot="extraComp">
                <takeGoodsAddMdg :inputModelData="inputModelData" ref="takeGoodsAddRefMdg" id="ybTransstoreListMdg">
                </takeGoodsAddMdg>
              </template>
            </myServicePane>

            <!-- 唯凯报关 -->

            <myServicePane code="AA0610">
              <template slot="extraComp">
                <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"></declareAtcustomsAdd>
              </template>
            </myServicePane>

            <myServicePane code="AG0150">
              <template slot="extraComp">
                <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="1"></declareAtcustomsAdd>
              </template>
            </myServicePane>

            <!-- 唯凯清关 -->
            <myServicePane code="AB0620">
              <template slot="extraComp">
                <declareAtcustomsAdd :mawbinfo="inputModelData" :pagetype="2"></declareAtcustomsAdd>
              </template>
            </myServicePane>

            <!-- 总单分单制作 -->
            <el-tabs type="border-card" v-if="serviceSelArr.includes('AA0110')||serviceSelArr.includes('AA0120')"
              style="margin-bottom:20px">
              <el-tab-pane label="总单制作" v-if="serviceSelArr.includes('AA0110')">
                <makingBill style="border:1px solid #e8e8e8" ref="makingbillmawb" orderdom="总单"
                  :mawbinfo="inputModelData" :mawbguid="-1" :pagetype="2"></makingBill>
              </el-tab-pane>
              <el-tab-pane label="分单制作" v-if="serviceSelArr.includes('AA0120')">
                <makingBill style="border:1px solid #e8e8e8" ref="makingbillhawb" orderdom="分单"
                  :mawbinfo="inputModelData" :mawbguid="-1" :pagetype="2"></makingBill>
              </el-tab-pane>
            </el-tabs>

            <!--快递服务 -->
            <myServicePane code="AG0110"></myServicePane>

            <!--唯凯安检 -->
            <myServicePane code="AA0230"></myServicePane>

            <!--唯凯交单 -->
            <myServicePane code="AA0240"></myServicePane>

            <!--磁检服务 -->
            <myServicePane code="AG0115"></myServicePane>



            <myServicePane code="AG0120">
              <template slot="extraComp">
                <listViewSlot code="AG0120"></listViewSlot>
                <listViewSlot code="AG0120pm"></listViewSlot>
              </template>
            </myServicePane>

            <!-- 材料提供服务 -->

            <myServicePane code="AA0810">
              <template slot="extraComp">
                <listViewSlot code="AA0810"></listViewSlot>
              </template>
            </myServicePane>

            <!--特种铲车服务   -->
            <myServicePane code="AA0830"></myServicePane>

            <!--分货服务   -->
            <myServicePane code="AA0840"></myServicePane>

            <!--装卸服务   -->
            <myServicePane code="AA0850"></myServicePane>

            <!--化工鉴定 -->

            <myServicePane code="AG0125"></myServicePane>

            <!--挂衣服务 -->

            <myServicePane code="AG0130">
              <template slot="extraComp">
                <listViewSlot code="AG0130"></listViewSlot>
                <listViewSlot code="AG0130pm"></listViewSlot>
              </template>
            </myServicePane>

            <!--贴签服务 -->
            <myServicePane code="AG0135"></myServicePane>
          </div>

          <div class="footer">
            <div class="right-btn">
              <!-- <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(1)" type="primary">保存待处理</el-button> -->
              <!-- <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(2)" type="primary">保存并分配</el-button> -->
              <!-- <el-button :disabled="saveBtnDisabled" @click="saveWaitFunc" type="primary">保存并分配</el-button> -->
              <el-button :disabled="saveBtnDisabled" @click="assignH" type="primary" v-if="gnShow||(!gnShow&&inputModelData.system!='国内服务')">保存并分配
              </el-button>
              <el-button :disabled="saveBtnDisabled" @click="saveWaitFp(3)" type="primary" v-if="gnShow||(!gnShow&&inputModelData.system!='国内服务')">保存并完成</el-button>
              <el-button :disabled="saveBtnDisabled" @click="saveMawbInfo" type="primary">
                {{areaStateCode}}操作</el-button>
              <el-button @click="pagestep=1" v-if="inputModelData.system!='国内服务'">返回</el-button>

            </div>
          </div>
        </div>

        <!-- end:第二页内容结束 -->

      </div>


      <!-- start:外网第二步 -->
      <div class="pages" v-show="outPagestep==2" v-if="pagetype==1||frompage==4">
        <goodsInfo :modelData="inputModelData" :hawbinfoList="inputModelData.hawbList" :serviceList="serviceList"
          pagetype=2>
        </goodsInfo>

        <div v-if="inputModelData.isimperfect==2" class="textrequirement">
          <i class="el-icon-jinggao"></i>
          <div>
            <p>1.请确认上述预订舱信息。</p>
            <p>2.待唯凯航线确认您的预订舱后，请完善订舱信息。</p>
            <p>3.订舱信息不完善，本次委托无效。</p>
          </div>
        </div>

        <div style="display: flex;justify-content: center;margin:24px 0 8px;" v-if="inputModelData.isimperfect==1">
          <el-checkbox style="margin-right: 6px;margin-top: 2px;" v-model="reader"></el-checkbox>
          <span @click="reader=!reader" style="cursor: pointer;user-select: none;">已阅读并同意</span>
          <span style="color:#006AFF;cursor: pointer;" @click="panelDisplay.clause=!panelDisplay.clause">《权利义务条款》</span>
        </div>


        <div style="text-align: right;">
          <el-button class="foot-btn" style="color:#006AFF;background-color:#fff" @click="pageChange(1)">
            上一步
          </el-button>
          <el-button type="primary" @click="saveMawbInfo" :disabled="!reader" v-if="frompage==4">保存
          </el-button>
          <el-button type="primary" :disabled="!reader" v-if="frompage!=4" @click="pageChange(3);">确认订舱
          </el-button>
        </div>
      </div>
      <!-- end:外网第二步 -->

      <!-- start:外网第二步 -->
      <div class="pages" v-show="outPagestep==3" v-if="pagetype==1">
        <div class="elSteps" style="margin-top:35px;margin-bottom: 40px;">
          <!-- 填运价后不显示中间的报价模块 -->
          <template v-for="(item,index) in elStepsArr">
            <div :class="{checked:index<=pagestep}">
              <i :class="item.class" :style="{color:item.color}"></i>
              <p>{{item.title}}</p>
            </div>
            <div v-if="index!=(elStepsArr.length-1)" :class="{checked:index<=pagestep}">
              <span></span>
              <p></p>
            </div>
          </template>
        </div>
        <el-divider></el-divider>
        <div style="display: grid;place-items: center;margin-top:130px">
          <i class="el-icon-circle-check" style="font-size: 160px;color:#14A207;"></i>
        </div>

        <div style="display: flex;justify-content:  center;font-size:24px;margin-top:40px;">
          <span>恭喜您</span><span style="color:#14A207">订舱成功！</span>
        </div>
        <div
          style="display: flex;justify-content:  center;font-size:18px;color:#7A8189;margin-top:8px;margin-bottom: 56px;">
          <span>恭喜您订舱成功 ! 唯凯将尽快对您的订单进行受理，请耐心等候</span>
        </div>

        <div style="text-align: center;">
          <el-button type="primary" @click="initDataFunc()">完成</el-button>
        </div>

      </div>
      <!-- end:外网第三步 -->




      <!-- 修改页面在底部显示返回按钮 -->
      <div v-if="pagetype==2&&frompage!=3"
        style="position: absolute;bottom: 0px;right: 120px;width: 100%;padding: 10px;background-color: #fff;z-index: 999;">

        <div style="text-align: right;" v-show="!isoutside">
          <!-- &&(!inputModelData.outsidedom&&inputModelData.orderguid=='-1') -->
          <!-- <el-button @click="putMawbInfo" type="primary" v-if="frompage!=2||inputModelData.outsidedom=='AMAZON'">
            保存</el-button> -->
            <el-button @click="putMawbInfo" type="primary" v-if="!(inputModelData.status==1&&inputModelData.outsidedom=='OUTSIDE')">
            保存</el-button>
          <el-button @click="$emit('update:visible',false)">返回</el-button>
        </div>

        <div style="text-align: right;" v-show="isoutside">
          <el-button type="primary" @click="saveMawbInfoOut">保存</el-button>
          <el-button @click="$emit('success',1);" v-if="pagetype==2">返回</el-button>
        </div>


      </div>


      <!-- 分配 -->
      <el-dialog :visible.sync="assignShow" :close-on-click-modal="false" v-if="assignShow" append-to-body
        width="1300px" top="50px" :before-close="assignClose">
        <fenpei :fenpeiguid="mawbguid" :information="serviceList.filter(i=>i.isdel==1)" @back="assignShowDelete(1)"
          ref="fenpei" :system="inputModelData.system" :new-add="1" origin="客服">
          <el-button type="primary" @click="saveWaitFp(2)">确认分配</el-button>
        </fenpei>
      </el-dialog>
      
      <!-- 费用 -->
      <el-dialog :visible.sync="costShow" :close-on-click-modal="false" v-if="costShow" append-to-body width="1300px"
        top="4%" @close="assignShowDelete(2)">
        <!-- {{serviceSelArr}} -->
        <costTable pagetype="2" wageinout="2" :servicecode="serviceSelArr.toString()" :serviceSelArr="serviceSelArr"
          :mawbinfo="inputModelData"></costTable>
        <costTable pagetype="2" wageinout="1" :serviceSelArr="serviceSelArr" :servicecode="serviceSelArr.toString()"
          :mawbinfo="inputModelData"></costTable>
      </el-dialog>



      <!-- 总运单号维护 -->
      <el-dialog :visible.sync="mawbDialog" width="1300px" top="4%" v-if="mawbDialog" :close-on-press-escape="false"
        append-to-body>
        <iframe
          :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman}&area=${localArea}`"
          frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;"
          id="mawbOperate"></iframe>
      </el-dialog>

      <!-- 派车单 -->
      <el-dialog :visible.sync="dialogPcd" class="dialogImgDoc batch-print-dialog" v-if="dialogPcd" :fullscreen="true" width="1200px"
        append-to-body :before-close="pcCloseFunc" top="4%">
        <iframe :src="pcdUrl" frameborder="0" allowtransparency="true"
          style="width: 100%; height: 100%; border: 0px none;"></iframe>
      </el-dialog>

      <!-- 撤单操作 -->
      <cancelOper :orderCancel.sync="orderCancel" v-if="orderCancel" dom="1" :inputModelData="inputModelData"
        @success="newCancelOrder">
      </cancelOper>

      <el-dialog :visible.sync="saveVisible" title="确认操作" width="400px" top="15%" append-to-body>
        <div style="text-align: center;">
          <el-button 
            :disabled="saveBtnDisabled" 
            @click="saveWaitFp(1)" 
            type="primary"
            v-if="inputModelData.orderdom==='分单'">
            保存待处理
          </el-button>
          <el-button style="margin-right: 30px;" :disabled="saveBtnDisabled" v-if="inputModelData.orderdom!=='分单'"
            @click="saveMawbInfo" type="primary">
            {{areaStateCode}}操作</el-button>
          <el-button :disabled="saveBtnDisabled||(areaStateCode=='PVG'&&inputModelData.czlx=='自货')" @click="saveWaitFunc" type="primary"
            v-if="inputModelData.orderdom!=='分单'">分配至外站
          </el-button>
        </div>
      </el-dialog>

      <div class="clause" v-if="panelDisplay.clause">
        <div class="clause-shadow" @click="panelDisplay.clause=false">
        </div>
        <div class="clause-content">
          <i class="el-icon-close" @click="panelDisplay.clause=false"></i>

          <h2>权利义务条款</h2>
          <p>欢迎您/贵公司使用唯凯国际物流股份有限公司（以下简称“唯凯”）开发的“国际货运代理业务委托”模块（以下简称“本模块”）。您/贵公司可以通过本模块进行国际货物航空或海洋运输业务委托。</p>
          <p>您/贵公司通过本模块提交的业务信息经唯凯确认后,双方将基于民事代理法律关系产生相应债权债务。鉴于此，请您/贵公司在通过本模块提交相关业务委托前务必仔细阅读本条款：</p>

          <h3>1.账号确认</h3>
          <p>
            1.1.您/贵公司在使用账号（详见本模块右上角账号信息，以下简称为“本账号”）提交业务信息前，请务核对账号所绑定的公司信息是否正确，并确保本账号处于您/贵公司的控制之下，账号操作人员已取得您/贵公司的授权，且该授权处于有效状态。
          </p>
          <p>1.2.您/贵公司通过本账号在本模块内进行的任何操作，包括并不限于业务信息的录入、修改、删除、提交等，都将视为贵公司的有效商业行为，您/贵公司应承担因前述操作产生的全部法律后果。</p>
          <p>1.3.如您/贵公司账号出现被盗、持有人变动、忘记密码等情形，应及时书面通知唯凯，唯凯将采取协助措施，防止您/贵公司相关损失扩大。</p>
          <p>1.4.如您并非本账号的合法持有人，或本账号绑定的公司信息与您/贵公司实际信息不一致，请立刻停止操作并退出本模块。否则，您/贵公司可能因此产生民事或刑事责任。</p>

          <h3>2.业务信息确认、修改、删除</h3>
          <p>2.1.您/贵公司在提交相关业务信息时应仔细检查，确保录入的信息真实准确。</p>
          <p>2.2.您/贵公司提交的信息一经唯凯确认，即对您/贵公司产生法律效力，因此衍生的责任义务亦将由您/贵公司承担。</p>
          <p>2.3.您/贵公司提交的业务信息在唯凯确认前，您/贵公司可以在本模块内对相关信息进行修改或删除操作。</p>
          <p>2.4.唯凯在确认中如发现异常，唯凯会通知您/贵公司进行调整。您/贵公司如无异议，应及时在本模块内进行调整操作，将调整后的业务信息重新提交。</p>
          <p>2.5.如需对唯凯已确认信息进行调整或删除，您/贵公司应征得唯凯同意，并在唯凯指定的时间内在本模块内操作完毕。</p>
          <p>2.6.本模块内的业务信息在您/贵公司提交后，如24个工作小时内（节假日顺延）唯凯未予确认或在唯凯确认前您/贵公司进行删除操作，该信息视为无效，对双方均不发生法律效力。</p>

          <h3>3.费用结算</h3>
          <p>3.1.您/贵公司通过本模块提交的业务委托所产生的费用，您/贵公司应支付给唯凯。</p>
          <p>3.2.双方如签有代理协议，结算期限按协议约定处理。如双方未签订代理协议，您/贵公司最迟应于每票货物起运后三十天内将该票货物所涉全部费用支付给唯凯。</p>
          <p>3.3.唯凯将向您/贵公司提供等额的增值税普通发票。</p>

          <h3>4.信息保密</h3>
          <p>4.1.唯凯将为您/贵公司提交的业务信息保密，唯凯不会将相关信息透露给业务无关方。</p>
          <p>4.2.您/贵公司应为唯凯提供的服务价格进行保密，不得向任何第三方透露。</p>
          <p>4.3.任一方违反上述约定的保密义务，应赔偿另一方因此产生的损失。</p>
          <p>4.4.除不可抗力外，唯凯将为您/贵公司在本模块中的业务信息至少保留1年。</p>

          <h3>5.免责约定</h3>
          <p>5.1.<strong>唯凯在本模块中提供选择的运输线路、航班、船次、运输时间、各项服务单价等信息，仅供您/贵公司参考选择，不构成要约。</strong>您/贵公司提交的业务信息未经唯凯确认，此类信息不生效
          </p>
          <p>5.2.双方认可国际货运代理业务中存在诸多不确定风险，唯凯在本模块中确认的信息，<strong>非因唯凯过错导致无法达成的，唯凯不承担责任。</strong>如存在责任方，唯凯将协助您/贵公司向责任方索赔。
          </p>
          <p>5.3.唯凯将根据需要不定期对本模块进行更新维护工作，<strong>如因不可抗力导致本模块无法正常运行导致您/贵公司业务受到影响，唯凯不承担相关责任。</strong>但唯凯应协助您/贵公司进行线下业务对接处理。
          </p>
          <p>5.4.为了确保业务操作效率，唯凯可视情形将贵司委托的业务转委托有资质的第三方操作，唯凯应为该第三方选任过失向您/贵公司承担法定责任。</p>

          <h3>6.特别约定</h3>
          <P>6.1.本账号在本模块下以其他企业或个体名义提交的业务信息，不影响您/贵公司在此类业务中的委托人身份，您/贵公司须向唯凯承担业务委托人的全部责任和义务。您/贵公司应在录入相关信息前获得被录入企业或个体的有效授权。
          </P>
          <P>6.2.在您/贵公司与唯凯已签有书面协议的情形下，本账号在本模块内提交的业务委托，应优先适用本条款。本条款没有约定的内容，依照双方签订的书面协议。</P>
          <P>
            6.3.如您/贵公司因使用本模块向唯凯委托业务产生的任何纠纷，双方应友好协商处理，如协商不成，双方同意由上海市浦东新区人民法院管辖处理。如您/贵公司为中国境外自然人或企业，双方同意提交中国国际经济贸易仲裁委员会上海分会，按照仲裁申请时中国国际经济贸易仲裁委员会现行有效的仲裁规则进行仲裁。仲裁裁决是终局的，对双方均有约束力。败诉方应承担胜诉方因此支出的律师费。
          </P>
          <P>6.4.如您/贵公司对本条款有任何异议，请点击本页面中的“取消”按钮，停止业务操作。您/贵公司仍可以选择通过线下传统方式进行业务委托。</P>
          <P>6.5.如您/贵公司认可并同意本条款，请点击本页面中的“同意”按钮，继续业务数据提交操作。</P>
          <P>6.6.如您/贵公司对本条款有任何疑问，可在点击确认前致电021-50104582进行讨论、咨询。</P>
          <P>6.7.唯凯保留对本条款的最终解释权。</P>
        </div>
      </div>

      <div class="clause" v-if="panelDisplay.thdinfo">
        <div class="clause-shadow" @click="panelDisplay.thdinfo=false">
        </div>
        <div class="clause-content" style='width:600px' v-if="selServicecode">
          <i class="el-icon-close" @click="panelDisplay.thdinfo=false"></i>
          <h2 style="text-align: left;">
            {{selServicecode=='AA0510'?'请填写提货地信息':`请填写${newService[selServicecode].title}信息`}}</h2>
          <div style="display: grid;">
            <template v-if="selServicecode=='AA0510'">
              <new-form-cmpt :view-data.sync="thViewData" :modelData.sync="inputModelData.ysservice" isAddPage>
              </new-form-cmpt>
            </template>
            <template v-if="selServicecode=='AA0410'">
              <!-- <div class="elitem">
                <div class="input-title">预计进仓仓库</div>
                <div class="input-content">
                  <el-input v-model="inputModelData.ysservice.store_thr" disabled style="width:252px;margin-right:12px">
                  </el-input>
                  <el-button type="default" @click="panelDisplay.expressShow=true" :disabled="!ckmapUrl">
                    仓库地图</el-button>
                </div>
              </div> -->
              <!-- <div class="elitem">
                        <div class="input-title">要求进仓日期</div>
                        <div class="input-content">
                            <el-date-picker style="width:252px" v-model="inputModelData.ysservice.yqfinishdate_org"
                                class="input-required" type="date" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </div> -->
            </template>
            <div class="elitem">
              <div class="input-title">{{selServicecode=='AA0410'?'进程日期':'要求完成日期'}}</div>
              <div class="input-content">
                <el-date-picker style="width:252px"
                  :class="{'input-required':selServicecode=='AA0410'||selServicecode=='AA0510'}"
                  v-model="newService[selServicecode].yqfinishdate" type="date" value-format="yyyy-MM-dd"
                  @change="datePickerChange">
                </el-date-picker>
              </div>
            </div>
            <div class="elitem">
              <div class="input-title">操作要求</div>
              <div class="input-content">
                <el-input type="textarea" v-model="newService[selServicecode].oprequest" :rows="2" placeholder="请输入内容">
                </el-input>
              </div>
            </div>
            <div style="text-align: right;margin-top:12px;">
              <el-button type="primary" @click="thdDialog(1)">确认</el-button>
              <el-button @click="thdDialog(2)">
                取消</el-button>
            </div>
          </div>

        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import serviceList from "@/components/orderDetails/serviceList"
  import houseNumberAdd from '@/components/templates/houseNumberAdd'
  import revSedMawb from '@/components/templates/revSedMawb'
  import revSedHawb from '@/components/templates/revSedHawb'
  import hawbTabsNew from '@/components/orderDetails/hawbTabsNew'
  import hawbAdd from '@/components/orderDetails/hawbAdd'
  import fenpei from '@/components/orderDetails/fenpei'
  import tempConfig from '@/components/templates/tempConfig'
  import mawbImport from '@/components/templates/mawbImport'
  import makingBill from '@/components/orderDetails/makingBill'
  import storeCompSize from '@/components/orderDetails/storeCompSize'
  import takeGoodsAdd from '@/components/orderDetails/takeGoodsAdd'
  import takeGoodsAddMdg from '@/components/orderDetails/takeGoodsAddMdg'
  import declareAtcustomsAdd from '@/components/orderDetails/declareAtcustomsAdd'
  import enterWarehouseBogn from '@/components/templates/enterWarehouseBogn'
  import serviceItemSmall from '@/components/templates/serviceItemSmall'
  import configMawb from '@/components/orderDetails/configMawb'
  import revSed from '@/components/templates/revSed'
  import { orderAddMixin } from '@/components/mixins/newOrderAdd'
  import serviceListOutside from "@/outsideDom/orderDetails/serviceListOutside"
  import customerRel from '@/components/templates/customerRel'


  import {
    formatDate,
    computedWeight,
    isNumber
  } from "@/api/localStorage.js";
  import {
    getServiceView,
    serviceSplit
  } from "@/components/mixins/service";

  /*延伸服务内容*/
  var myServicePane = {
    props: {
      code: String
    },
    components: {
      serviceItemSmall
    },
    data() {
      return {
        parent: this.$parent
      };
    },
    template: `
  <div class="detail" style="margin:0px" v-if="parent.serviceSelArr.includes(code)" v-show="parent.serviceTabsList[parent.serviceTabsChecked].code==code">
          <div class="detail-title">
            <p>{{parent.getSerCodeInfo(code)}}</p>
            <serviceItemSmall :text.sync="parent.newService[code].oprequest"></serviceItemSmall>
          </div>
          <div class="detail-c">
            <newFormCmpt
              :view-data.sync="parent.serviceViewData[code+'ViewData']"
              :model-data.sync="parent.inputModelData"
              :area="parent.area"
              pagetype="2"
            ></newFormCmpt>
            <slot name="extraComp"></slot>
          </div>
        </div>
  `
  };

  const scrollToPosition = (target) => {
    location.href = target;
  }


  export default {
    name: "newOrderAdd",
    
    props: {
      isMawbImport: Boolean, // 是否是批量导入的页面
      importMawbData: Object,//导入数据
      importActiveName: String,
      guid: [String, Number],
      boguid: [String, Number],
      pagetype: {
        type: [String, Number],
        default: 1 //1新增 2修改
      },
      visible: Boolean,
      frompage: {//从哪个页面进入的
        type: [String, Number],
        default: 1 //1默认页面 2 订单信控预览、外网待受理、外站待受理 3.操作层订单摘要进去的 4.订单未完善进去
      }
    },

    mixins: [getServiceView(1), serviceSplit(1), orderAddMixin()],

    components: {
      serviceList, houseNumberAdd, revSedMawb, revSedHawb, serviceItemSmall, hawbTabsNew, hawbAdd, fenpei, tempConfig, myServicePane, mawbImport, makingBill, storeCompSize, takeGoodsAdd, takeGoodsAddMdg, declareAtcustomsAdd, enterWarehouseBogn, configMawb, revSed, serviceListOutside, customerRel
    },

    data() {
      return this.getInitData()
    },

    methods: {
      formclick(e) {
        let id = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
        if ((id == "opersystemdom" || id == 'opersystem') && e.target.value) {
          let system = id == "opersystemdom" ? (e.target.value.charAt(0) + this.inputModelData.opersystem.charAt(0)) : (this.inputModelData.opersystemdom.charAt(0) + e.target.value.charAt(0));
          if (this.disabledSystemOption.includes(system)) {
            e.preventDefault();  //阻止选中
            // this.$message.error('目前项目下，无法设置系统为' + system + "，请重新选择！");
            this.$message.error(`该项目没有${system}系统权限！`)
          }
        }
        
        // note: 本票客户客服联系人未选择，提示选择
        if (id === 'ordertype') {
          if (!this.inputModelData.customerRelList.length) {
            e.preventDefault();  //阻止选中
            this.$message.error('请先选择本票客户客服联系人');
          }
        }
      },
      //预报件重体方法
      setYbstoreFunc(){
              if (!this.inputModelData.guid || this.inputModelData.guid == -1) {//新增时候

                    if (this.inputModelData.ybstoreList.length == 1) {
                        this.inputModelData.ybstoreList[0].piece = this.inputModelData.ybpiece
                        this.inputModelData.ybstoreList[0].weight = this.inputModelData.ybweight
                        this.inputModelData.ybstoreList[0].volume = this.inputModelData.ybvolume
                    }
              
            }
      },
      scrollTop(ref) {
        // console.log(ref)
        // console.log(typeof ref)
        if (!ref) {
          $(".newOrderAdd").scrollTop(0);
        } else {
          let num = ref.$el.getBoundingClientRect().top;
          $(".newOrderAdd").scrollTop(($(".newOrderAdd").scrollTop() + num - 80) || 0);
        }

      },
      confirmSave() {
        if (this.getInfo()) {
          this.saveVisible = true
        }
      },
      getInitData() {
        return {
          name: "newOrderAdd.vue",
          outPagestep: 1,
          gnShow:true,//国内服务信用被控显示
          pagestep: 1,
          basicinfoView: {//第一步
            fid: {
              title: "委托客户",
              type: 11,
              required: true,
              // itemStyle: {
              //   width: "560px"
              // },
              contentStyle: {
                display: "flex"
              },
              linkage: "gid",
              pagetype: this.frompage==4?1:8,
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
            },
            creditlevel: {
              title: '客户等级',
              type: 18,
              // occupyRestSpace: true,
              hidden: true,
              // idStyle: { width: '100%' },
              // itemStyle: { width: '100%' },
              itemStyle: {
                width: "auto",
                minWidth: '280px'
              },
              occupyRestSpace: () => { return this.inputModelData.opersystem  != '出口' },
            },
            ispay_pre: {
              title: "是否要预付款",
              type: "3",
              options: [{
                label: '是',
                value: 1
              }, {
                label: '否',
                value: 2
              },],
              // default: 2,
              titleStyle: {
                'font-size': '12px',
                'font-weight': 'bold',
                'color': 'red'
              },
              // idStyle: {
              //   width: "100%"
              // },
              itemStyle: {
                width: "560px"
              },
              expInfo: true,
              occupyRestSpace: true,
              hidden: () => {return this.inputModelData.opersystem  != '出口'}
            },
            wtkhname: {
              title: "委托客户",
              type: 18,
              disabled: true,
              occupyRestSpace: true,
              itemStyle: { width: '320px' },
              hidden: true,
            },
            area: {
              title: '委托唯凯站点',
              type: 37,
              required: true,
              multiple: false,
              // idStyle: { width: '100%' },
              placeholder: '请选择唯凯站点',
              itemStyle: { width: 'auto' },
              //pagetype: 2,
              hidden: false,
            },
            customRelOutside: {
              title: "",
              titleStyle: { width: '20px' },
              hidden: true
            },
            // system: {
            //   title: '运输种类',
            //   type: 3,
            //   options: [
            //     { label: '空出', value: "空出" },
            //     { label: '空进', value: "空进" },
            //     { label: '海出', value: "海出" },
            //     { label: '海进', value: "海进" },
            //     { label: '陆出', value: "陆出" },
            //     { label: '陆进', value: "陆进" },
            //     { label: '铁出', value: "铁出" },
            //     { label: '铁进', value: "铁进" },
            //     { label: '国内服务', value: "国内服务" },
            //   ],
            //   idStyle: { width: '100%' },
            //   itemStyle: { width: '100%' },
            //   // default: '空出',
            //   hidden: false,
            //   required: true
            // },
            opersystem: {
              title: '运输种类',
              type: 3,
              options: [
                { label: '出口', value: "出口" },
                { label: '进口', value: "进口" },
                { label: '国内服务', value: "国内服务" },
              ],
              idStyle: { width: '100%' },
              itemStyle: { width: '100%' },
              hidden: false,
              required: true
            },
            opersystemdom: {
              title: '运输方式',
              type: 3,
              options: [
                { label: '空运', value: "空运" },
                { label: '海运', value: "海运" },
                { label: '陆运', value: "陆运" },
                { label: '铁运', value: "铁运" }
              ],
              idStyle: { width: '100%' },
              itemStyle: { width: '100%' },
              hidden: false,
              required: true
            },
            // done: 配舱操作改成订舱操作
            czlx: {
              title: "订舱操作",
              type: 3,
              options: [{
                label: "唯凯配舱",
                value: "自货"
              },
              {
                label: "唯凯代操作",
                value: "代操作"
              }
              ],
              itemStyle: {
                width: "560px"
              },
              // default: '自货',
              hidden: false,
              required: true
            },
            orderdom: {
              title: '订单类型',
              type: 3,
              options: [
                { label: () => { return this.inputModelData.czlx == '自货' ? '总单(货代委托)' : '总分单(货代委托)' }, value: "总单" },
                { label: '总直单(货代委托)', value: "直单", hidden: () => { return this.inputModelData.czlx == '自货' } },
                { label: '分单(直客委托)', value: "分单", hidden: () => { return this.inputModelData.czlx == '代操作' } }
              ],
              idStyle: { width: '100%' },
              itemStyle: { width: '100%' },
              // default: '总单',
              hidden: false,
              required: true
            },
            orderdomOut: {
              title: "",
              alertTitle: '订单类型',
              type: 3,
              options: [
                { label: '总分单(货代委托)', value: "总单" },
                { label: '总直单(货代委托)', value: "直单" }
              ],
              idStyle: { width: '100%' },
              itemStyle: { width: '100%' },
              hidden: true,
              required: true
            },
            ordertype: {
              title: '订单形式',
              type: 3,
              options: [
                { label: '单票', value: 1 },
                { label: '批量', value: 2 },
              ],
              idStyle: { width: '100%' },
              // default: 1,
              disabled: false,
              hidden: false,
              required: true
            }
          },
          goodsinfoView: {//订舱信息

            mawbAe: {
              title: "客户指定总运单号",
              itemStyle: { width: 'auto' },
              titleStyle: { width: '112px', 'padding-right': '0' },
              verify: "mawb",
              hidden: true,
              occupyRestSpace: true,              
            },

             zddlcode: {
              title: "制单代理代码",
              type: 1,
              hidden: true
            },
            zddlzh: {
              title: "制单代理账号",
              type: 1,
              hidden: true
            },
            zdiatacode: {
              title: "制单IATA代码",
              type: 1,
              hidden: true,
              occupyRestSpace: true
            },

            hawb: {
              title: "分运单号：",
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "280px"
              },
              type: 1,
              required: true,
              hidden: true,
            },

            // ybjzt: {
            //   title: '预报件重体',
            //   type: 38,
            //   idStyle: { width: '560px' },
            //   itemStyle: { width: '100%' },
            //   contentStyle: { 'background-color': '#FFF8EF' },
            //   inputgroups: {
            //     ybpiece: {
            //       title: "件",
            //       type: 1,
            //       required: true,
            //       verify: "integer",
            //       alertTitle:'预报件数'
            //     },
            //     ybweight: {
            //       title: "重",
            //       type: 1,
            //       required: true,
            //       verify: "fixedTwo",
            //       alertTitle: '预报重量'

            //     },
            //     ybvolume: {
            //       title: "体",
            //       type: 1,
            //       required: true,
            //       verify: "fixedThree",
            //       alertTitle: '预报体积'
            //     },
            //   }
            // },
            // goodsjzt: {
            //   title: '货物件重体',
            //   type: 38,
            //   disabled: true,
            //   idStyle: { width: '560px' },
            //   itemStyle: { width: '100%' },
            //   inputgroups: {
            //     goodsybpiece: {
            //       title: "件",
            //       type: 1,
            //       verify: "integer"
            //     },
            //     goodsybweight: {
            //       title: "重",
            //       type: 1,
            //       verify: "fixedTwo"
            //     },
            //     goodsybvolume: {
            //       title: "体",
            //       type: 1,
            //       verify: "fixedThree"
            //     },
            //   }
            // },
            // mawbAe: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "100%"
            //   },
            //   itemStyle: {
            //     width: "100%"
            //   },
            //   verify: "mawb",
            //   hidden: () => { return !(this.inputModelData.system == '空出' && this.inputModelData.czlx == '代操作') },
            //   occupyRestSpace: true
            // },
            //  mawbAe: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "100%"
            //   },
            //   itemStyle: {
            //     width: "100%"
            //   },
            //   verify: "mawb",
            //   hidden: () => { return !(this.inputModelData.system == '空出' && this.inputModelData.czlx == '自货' && this.inputModelData.orderdom != '分单') }
            // },
            // mawb: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "560px"
            //   },
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   type: 1,
            //   hidden: () => { return !(this.inputModelData.system != '空出' && this.inputModelData.czlx == '自货' && this.inputModelData.orderdom != '分单') }
            // },
            // mawbAe: {
            //   title: "客户指定总运单号",
            //   occupyAline: true,
            //   titleStyle: { width: '112px', 'padding-right': '0' },
            //   verify: "mawb",
            //   hidden: () => { return !(this.inputModelData.system == '空出' && this.inputModelData.orderdom != '分单') }
            // },
            // mawb: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "560px"
            //   },
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   type: 1,
            //   hidden: () => { return !(this.inputModelData.system != '空出' && this.inputModelData.orderdom != '分单') }
            // },
            // orderno: {
            //   title: "订单来源号",
            //   type: 1,
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   occupyRestSpace: true
            // },
            // zddlcode: {
            //   title: "制单代理代码",
            //   type: 1,
            //   hidden: true
            // },
            // zddlzh: {
            //   title: "制单代理账号",
            //   type: 1,
            //   hidden: true
            // },
            // zdiatacode: {
            //   title: "制单IATA代码",
            //   type: 1,
            //   hidden: true,
            //   occupyRestSpace: true
            // },
            ybpiece: {
              title: "预报件数",
              type: 1,
              required: true,
              verify: "integer",
              alertTitle: '预报件数',
              itemStyle: { width: '200px', 'margin-right': '6px' },
               elEvent: {
                eventName: 'blur',
                eventFunc: this.setYbstoreFunc, //方法写在外面的组件中，传入在里面执行
               },
            },
            goodsybpiece: {
              type: 18,
              verify: "integer",
              itemStyle: { width: '74px' },
              titleStyle: { display: 'none' },
              disabled: true
            },
            ybweight: {
              title: "预报重量",
              type: 1,
              required: true,
              verify: "fixedTwo",
              alertTitle: '预报重量',
              itemStyle: { width: '200px', 'margin-right': '6px' },
              elEvent: {
                eventName: 'blur',
                eventFunc: this.setYbstoreFunc, //方法写在外面的组件中，传入在里面执行
               },
            },
            goodsybweight: {
              type: 18,
              verify: "fixedTwo",
              itemStyle: { width: '74px' },
              titleStyle: { display: 'none' },
              disabled: true
            },
            ybvolume: {
              title: "预报体积",
              type: 1,
              required: true,
              verify: "fixedThree",
              alertTitle: '预报体积',
              itemStyle: { width: '200px', 'margin-right': '6px' },
              elEvent: {
                eventName: 'blur',
                eventFunc: this.setYbstoreFunc, //方法写在外面的组件中，传入在里面执行
               },
            },
            goodsybvolume: {
              type: 18,
              verify: "fixedThree",
              itemStyle: { width: '74px' },
              titleStyle: { display: 'none' },
              disabled: true,
              // occupyRestSpace: true
            },
            smallpiece: {
              title: "小件数",
              type: 1,
              verify: "integer",
              idStyle: { visibility: "hidden" },
              occupyRestSpace: true
            },
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
              required: true,
            },
            qsd: {
              title: "始发地",
              type: 20,
              pagetype: 6,
              hidden: true
            },
            mdd: {
              title: "目的地",
              type: 20,
              pagetype: 6,
              hidden: true,
              occupyRestSpace: true
            },
            // hbh: {
            //   title: "指定航班号",
            //   type: 1,
            //   verify: "uppercase",
            //   // elEvent: {
            //   //   eventName: 'blur',
            //   //   funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
            //   // }
            // },
            // deliverydate: {
            //   title: "货好日期",
            //   type: 12,
            //   format: "yyyy-MM-dd HH:mm"
            // },
            hbrq: {
              title: "指定航班日期",
              type: 6,
              format: "yyyy-MM-dd",
              pickerOptionsType: 1,
              required: true,
              // elEvent: {
              //   eventName: 'change',
              //   funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
              // },
              // hidden: () => { return this.inputModelData.ybvolume > 4 },
            },
              hbh: {
              title: "指定航班号",
              type: 1,
              verify: "uppercase",
              // elEvent: {
              //   eventName: 'blur',
              //   funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
              // }
            },
            // qfsj: {
            //   title: "预计起飞时间",
            //   type: 34
            // },
            // ddrq: {
            //   title: "指定到达日期",
            //   type: 6,
            //   format: "yyyy-MM-dd",
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
              }
            }
          },
          operfareViewData: { //操作费信息
            inoperationprice: {
              title: "操作费单价",
              type: 1,
              append: '/KG',
            },
          },
          fareInputViewDataYdc: {//预订舱时候的运费单价
            inwageallinprice: {
              title: '空运费单价',
              type: 1,
              verify: "fixedThree",
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "auto"
              },
              text: '(含燃油、战险，不含其它杂费)',
              append: 'CNY',
              required: true,
              explainText: '如您已在线下就此次委托咨询过唯凯运费单价,可在此处填写'
            },
            priceFp: {
              title: "分泡比例",
              itemStyle: {
                width: "560px"
              },
              type: 9,
              options: [{
                title: "唯凯",
                linkage: "cus_real_bp_freight_in",
                id: "self_real_bp_freight_in",
                defalut: "",
                required: true
              },
              {
                title: "客户",
                linkage: "self_real_bp_freight_in",
                id: "cus_real_bp_freight_in",
                defalut: "",
                required: true
              }
              ],
              seque: "first",
              hidden: false,
              explainText: '如您已在线下就此次委托咨询过唯凯分泡比例,可在此处填写'
            },
            priceabout: {
              title: '本票唯凯销售',
              type: 1,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "360px"
              },
              explainText: '如您已在线下就此次委托咨询过唯凯销售,可在此处填写其姓名',
              // hidden: () => { return !this.inputModelData.inwageallinprice }
            },
          },
          fareInputViewData: {
            currency: {
              title: "基港运价币种",
              type: 3,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              options: [], //需要
              default: '人民币'
            },
            yfstdin: {
              title: "基港运价标准",
              type: 3,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              groupid: 167,
              expInfo: true,
              default: '1'

            },
            isinwageallin: {
              title: "基港运价类型",
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "500px"
              },
              type: 3,
              options: [
                { label: "单价ALLIN", value: "1" },
                { label: "单价++", value: "3" },
                { label: "M级++", value: "2" },
                { label: "Cost++", value: "4" },
              ],
              required: true
              // default:'1'
            },

            // inwageallinprice: {
            //   title: "",
            //   idStyle: { transform: 'translate(-120px,40px)' },
            //   contentStyle: {
            //     minWidth: "240px",
            //     marginLeft: "20px"
            //   },
            //   required: true,
            //   titleStyle: {
            //     display: "none"
            //   },
            //   type: 35,
            //   realBindField: 'inwageallinprice',
            //   isnewadd: true,
            //   append: '/KG'
            // },

            inwageallinprice: {
              title: "基港运价",
              // idStyle: { transform: 'translate(-120px,40px)' },
              contentStyle: {
                minWidth: "240px",
                marginLeft: "0px"
              },
              required: true,
              titleStyle: {
                display: "block"
              },
              type: 35,
              realBindField: 'inwageallinprice',
              isnewadd: true,
              append: '/KG',
              hidden: false
            },

            inwageallinclude: {//应收运费包含
              title: "",
              // type: 2,
              // options: [
              //   { label: '含货站地面费', value: '1' }
              // ],
              idStyle: { width: '396px' },
              titleStyle: { width: '60px' },
              type: 3,
              options: [
                { label: '含货站地面费', value: '4' },
                { label: '不含货站地面费', value: '-1' },
              ],
              itemStyle: { width: '100%', 'display': 'flex', 'align-items': 'center' },
              hidden: false,
              // occupyRestSpace: true,
              default: '4'

            },
            first: {
              title: "基港实际分泡",
              itemStyle: {
                width: "440px"
              },
              type: 9,
              options: [{
                title: "唯凯",
                linkage: "cus_real_bp_freight_in",
                id: "self_real_bp_freight_in",
                required: true,
                defalut: "",
              },
              {
                title: "客户",
                linkage: "self_real_bp_freight_in",
                id: "cus_real_bp_freight_in",
                required: true,
                defalut: "",
              }
              ],
              seque: "first",
              occupyRestSpace: true
            },
            priceabout: {
              title: '本票唯凯销售',
              type: 1,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "460px"
              },
              explainText: '如您已在线下就此次委托咨询过唯凯销售,可在此处填写其姓名',
              // hidden: () => { return !this.inputModelData.inwageallinprice }
            },
            isinwageallin_trans: {
              title: "中转费",
              itemStyle: {
                width: "400px",
              },
              type: 3,
              options: [{
                label: "单价",
                value: "1"
              },
              {
                label: "总价",
                value: "2"
              }
              ],
              // default:'1'
            },
            inwageallinprice_trans: {
              title: "",
              type: "1",
              contentStyle: {
                maxWidth: "160px",
                marginLeft: "20px"
              },
              titleStyle: {
                display: "none"
              },
              idStyle: { transform: 'translate(-120px,0px)' },
              append: '/KG'
            },
            second: {
              title: "中转实际分泡",
              itemStyle: {
                width: "440px"
              },
              type: 9,
              options: [{
                title: "唯凯",
                linkage: "cus_real_bp_trans_in",
                id: "self_real_bp_trans_in"
              },
              {
                title: "客户",
                linkage: "self_real_bp_trans_in",
                id: "cus_real_bp_trans_in"
              }
              ],
              seque: "second",
              occupyRestSpace: true
            }
          },
          supplementView: {//补充信息
            // mawbAe: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "100%"
            //   },
            //   itemStyle: {
            //     width: "100%"
            //   },
            //   verify: "mawb",
            //   hidden: () => { return !(this.inputModelData.system == '空出' && this.inputModelData.czlx == '自货' && this.inputModelData.orderdom != '分单') }
            // },
            // mawb: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "560px"
            //   },
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   type: 1,
            //   hidden: () => { return !(this.inputModelData.system != '空出' && this.inputModelData.czlx == '自货' && this.inputModelData.orderdom != '分单') }
            // },
            mawbAe: {
              title: "客户指定总运单号",
              // occupyAline: true,
              itemStyle: { width: 'auto' },
              titleStyle: { width: '112px', 'padding-right': '0' },
              verify: "mawb",
              hidden: () => { return !(this.inputModelData.system == '空出' && this.inputModelData.orderdom != '分单') }
            },
            // mawb: {
            //   title: "总运单号",
            //   idStyle: {
            //     width: "560px"
            //   },
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   type: 1,
            //   hidden: () => { return !(this.inputModelData.system != '空出' && this.inputModelData.orderdom != '分单') }
            // },
            orderno: {
              title: "订单来源号",
              type: 1,
              itemStyle: {
                width: "280px"
              },
              disabled:()=>{return this.inputModelData.outsidedom},
              occupyRestSpace: true
            },
            zddlcode: {
              title: "制单代理代码",
              type: 1,
              hidden: true
            },
            zddlzh: {
              title: "制单代理账号",
              type: 1,
              hidden: true
            },
            zdiatacode: {
              title: "制单IATA代码",
              type: 1,
              hidden: true,
              occupyRestSpace: true
            },
            hawb: {
              title: "分运单号：",
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "280px"
              },
              type: 1,
              required: true,
              hidden: true
            },
            // orderno: {
            //   title: "订单来源号",
            //   type: 1,
            //   itemStyle: {
            //     width: "280px"
            //   },
            //   occupyRestSpace: true
            // },
            comboine: {
              title: "可否拼单",
              type: 3,
              options: [{
                label: "可拼",
                value: 1
              },
              {
                label: "不可拼",
                value: 2
              }
              ],
              hidden: true
            },
            yqqcts: {
              title: "要求全程天数",
              type: 1,
              verify: "integer",
            },
            // hbh: {
            //   title: "指定航班号",
            //   type: 1,
            //   verify: "uppercase",
            //   // elEvent: {
            //   //   eventName: 'blur',
            //   //   funcName: 'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
            //   // }
            // },
            deliverydate: {
              title: "货好日期",
              type: 12,
              format: "yyyy-MM-dd HH:mm"
            },
            ddrq: {
              title: "指定到达日期",
              type: 6,
              format: "yyyy-MM-dd",
            },
            smallpiece: {
              title: "小件数",
              type: 1,
              verify: "integer",
              // occupyRestSpace: true
            },
            zzg: {
              title: "中转港",
              type: 20,
              verify: "uppercase",
              pagetype: 6
            },
            hbzl: {
              title: "要求航班种类",
              type: 3,
              groupid: "6",
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              }
            },
            bglx: {
              title: "报关类型",
              type: 4,
              groupid: "19",
              hidden: false,
              filterable: true
            },
            bgpiece: {
              title: "报关件数",
              type: 1,
              verify: "integer",
              hidden: false,
              required: false
            },
            bgweight: {
              title: "报关重量",
              type: 1,
              verify: "fixedTwo",
              hidden: false,
              required: false
            },
            paymode: {
              title: "运费条款",
              type: 3,
              groupid: "125",
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              }
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
              options: [{
                title: "Freight  Prepaid",
                detailS: [

                ]
              },
              {
                title: "Freight  Collect",
                detailS: [

                ]
              }
              ]
            },
            englishpm: {
              title: "英文品名",
              type: 17,
              verify: "uppercase",
              itemStyle: {
                width: "560px"
              }
            },
            chinesepm: {
              title: "中文品名：",
              type: 17,
              itemStyle: {
                width: "560px"
              },
              hidden: true
            },
            remark: {
              title: "备注",
              type: 17,
              itemStyle: {
                width: "560px"
              }
            },
            // sfhinfo: {
            //   title: '总单发货人',
            //   idStyle: { width: '100%' },
            //   itemStyle: { width: '100%' },
            //   titleStyle: {
            //     'align-self': 'flex-start',
            //     'margin-top': '15px'
            //   }
            // },
            // tzrinfo: {
            //   title: '通知人信息',
            //   idStyle: { width: '100%' },
            //   itemStyle: { width: '100%' },
            //   titleStyle: {
            //     'align-self': 'flex-start',
            //     'margin-top': '15px'
            //   }
            // }
          },
          thViewData: {
            company_thr_org: {
              title: '提货单位',
              type: 1,
              required: true,
              itemStyle: { width: 'calc(50% - 4px)' }
            },
            khjcno: {
              title: '客户进仓编号',
              required: true,
              idStyle: { width: 'calc(50% - 4px)', 'margin-right': '8px' },
              placeholder: '多个用逗号隔开',
              // type: 1,
              type: 5,
              options: []

            },
            piece: {
              title: '件数 PCS',
              type: 1,
              required: true,
              idStyle: { width: '84px' },
              idClass: "input-group-a",
              translate: 'pieceP',
              verify: 'integer',
              disabled: true
            },
            weight: {
              title: '重量 KG',
              type: 1,
              required: true,
              idStyle: { width: '84px' },
              idClass: "input-group-m",
              translate: 'weightP',
              verify: 'fixedTwo',
              disabled: true
            },
            volume: {
              title: '体积 CBM',
              type: 1,
              idStyle: { width: '84px' },
              idClass: "input-group-f",
              translate: 'volumeP',
              verify: 'fixedThree',
              disabled: true
            },
            address_thr_org: {
              title: '提货地址',
              type: 39,
              linkage: 'address_thrjson_org'//放json字段
            },
            lxr_thr_org: {
              title: '联系人姓名',
              type: 1,
              required: true,
              idStyle: { width: 'calc(50% - 4px)', 'margin-right': '8px' }
            },
            phone_thr_org: {
              title: '联系人电话',
              type: 1,
              required: true,
              idStyle: { width: 'calc(50% - 4px)' }
            },
            pickupdate_org: {
              title: '要求提货完成日期',
              type: 6,
              required: true,
              hidden: true,
              itemStyle: { width: 'calc(50% - 4px)' }
            },
          },
          inputModelData: {//初始字段
            isimperfect: 1,//订舱类型isimperfect 1正式订舱 2预定舱
            ysservice: { company_thr_org: '', khjcno: '', piece: '', weight: '', volume: '', address_thr_org: '', address_thrjson_org: '', lxr_thr_org: '', phone_thr_org: '', pickupdate_org: '', yqfinishdate_org: '', store_thr: '' },//提货信息
            orderdom: '',
            orderdomOut: '',
            
            opersystem: '',
            opersystemdom: '',
            area: '',
            ordertype: '',
            guid: -1,
            sfg: "",
            comboine: 1,
            creditlevel: '',
            realpiece: 0,
            mawb: "",
            czlx: "",
            orderno: "",
            hawb: "",
            fid: "",
            gid: "",
            wtkhname: "",
            mdg: "",
            qsd: '',
            mdd: '',
            zzg: "",
            deliverydate: "",
            piece: "",
            weight: "",
            volume: "",
            ybpiece: "",
            ybweight: "",
            ybvolume: "",
            goodsybpiece: "",
            goodsybweight: "",
            goodsybvolume: "",
            smallpiece: "",
            hbh: "",
            hbrq: "",
            qfsj: "",
            yqqcts: "",
            hbzl: "全部",
            exForm1: "",
            paymode: "PP",
            englishpm: "CONSOLIDATION CARGO AS PER ATTACHED MANIFEST",
            chinesepm: "",
            hwxz: "",
            // hwlx: "普货",
            hwxz: "",
            hwlx: "",
            ispay_pre: "",
            batterymodel: "",
            tradeterm: "CIF",
            ctype: false, //c类客户
            "remark": "",
            "bglx": '',
            "bgpiece": '',
            "bgweight": '',
            system: '',
            khjcnolist: [{
              khjcno: "",
              piece: "",
              weight: "",
              volume: "",
              storeType: "",
              loadcardemand: "",
              bringfile: 2,
              storename_yb: "",
              volumelist: [{
                packagetypename: "",
                piece: "",
                longs: "",
                widths: "",
                heights: ""
              }]
            }],
            declList: [],
            declListMdg: [],
            /* 始发港提货 */
            address_thrtype_org: 1, //提货人地址类型
            address_shrtype_org: 1, //收货人地址类型
            address_thrstorearea_org: "", // 提货出仓库区域
            address_shrstorearea_org: "", // 送货出仓库区域
            store_thr: "", //提货地仓库
            port_thr: "", //提货地港口
            terminal_thr: "", //提货地货站
            store_shr: "", //送货地仓库
            port_shr: "", //送货地港口
            terminal_shr: "", //送货地货站
            address_thr_org: "",
            lxr_thr_org: "",
            phone_thr_org: "",
            address_thrjson_org: "",
            address_shr_org: "",
            lxr_shr_org: "",
            phone_shr_org: "",
            address_shrjson_org: "",
            company_thr_org: "", // 提货单位(始发港)
            company_thr_mdg: "", //提货单位(目的港)
            /* 目的港提货 */
            address_thrtype_mdg: 1, //提货人地址类型
            address_shrtype_mdg: 1, //收货人地址类型
            address_thrstorearea_mdg: "", // 提货出仓库区域
            address_shrstorearea_mdg: "", // 送货出仓库区域
            store_thr_mdg: "", //提货地仓库
            port_thr_mdg: "", //提货地港口
            terminal_thr_mdg: "", //提货地货站
            store_shr_mdg: "", //送货地仓库
            port_shr_mdg: "", //送货地港口
            terminal_shr_mdg: "", //送货地货站
            lxr_thr_mdg: "",
            phone_thr_mdg: "",
            address_thrjson_mdg: "",
            address_shr_mdg: "",
            lxr_shr_mdg: "",
            phone_shr_mdg: "",
            address_shrjson_mdg: "",
            dzlx: "总单",
            ybstorevolumeList: [], //进仓尺寸信息(始发港)
            ybstorevolumeListMdg: [], //进仓尺寸信息（目的港)
            ybTransstoreList: [], //联运服务预报进仓信息(始发港)
            ybTransstoreListMdg: [], //联运服务预报进仓信息(目的港)
            company_shr_org: "", //送货单位(始发港)
            company_shr_mdg: "", //送货单位(目的港)
            //费用部分
            currency: "",
            inwageallinclude: '',
            isinwageallin: "",
            inwageallinprice: "",
            self_real_bp_freight_in: "10",
            cus_real_bp_freight_in: "0",
            isinwageallin_trans: "",
            inwageallinprice_trans: "",
            self_real_bp_trans_in: "10",
            cus_real_bp_trans_in: "0",
            yjstorearea: this.localArea || this.conditionalAreaForBuild,
            yjstorename: "",
            yjstoredate: "",
            // yjstorearea_mdg: this.localArea,
            // yjstorearea_org: this.localArea,
            appraisaltype_chem: "代取鉴定",
            //  storearea_chem: this.localArea,
            //   storearea_inspect: this.localArea,
            isstore_inspect: 1,
            isstore_chem: 1,
            zddlcode: "",
            zddlzh: "",
            zdiatacode: "",
            gylist: [{
              clothtype: "",
              clothstd: "",
              servicecode: "AG0130"
            }], //挂衣
            gylistpm: [{
              materialpm: "",
              materialstd: "",
              num: "",
              wagetype: "",
              costwage: "",
              saleswage: "",
              servicecode: "AG0130"
            }],
            gbzlist: [{
              packagetype: "",
              packagestyle: "",
              servicecode: "AG0120"
            }], //改包装
            gbzlistpm: [{
              materialpm: "",
              materialstd: "",
              num: "",
              wagetype: "",
              costwage: "",
              saleswage: "",
              servicecode: "AG0120"
            }],
            cltglist: [{
              materialpm: "",
              materialstd: "",
              num: "",
              wagetype: "",
              costwage: "",
              saleswage: "",
              servicecode: "AA0810"
            }], //材料提供
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

            yfstdin: "",
            ybstoreList: [],
            customerRelList: [],
            hawbList: [],
            inoperationprice: '',//操作费单价
            ybvolumeremark: ''
          },
          newService: {},
          detailShow: {
            supplement: true,//选填信息展开
            ybstoreList: false,
            fareInputViewData: false,
            serviceDetail: false,
            supplementView: false,
          },
          tabsList: [{ title: '补充信息' }, { title: '分单信息' }],
          tabsChecked: 0,
          serviceTabsList: [],
          serviceTabsChecked: 0,
          ctype: false,//是否是c
          mawbgys: '',
          mawbss: '',
          mawbgid: '',
          aircomcode: '',
          assignShow: false,//分配
          costShow: false,//费用
          dialogPcd: false,//派车单
          mawbDialog: false,//总运单号维护
          saveBtnDisabled: false,
          orderCancel: false,
          goodsinfoRequired: '',//订舱信息必填
          fareinfoRequired: "",//运价信息必填
          supplementRequired: '',//补充信息必填
          basicinfoRequired: '',
          gnServiceRequired: '',
          gnSeviceContent: ['AA0410', 'AG0145', 'AB0420', 'AA0510', 'AB0520', 'AA0610', 'AG0150', 'AA0850', 'AB0620', 'AA0110', 'AA0120', 'AG0110', 'AA0230', 'AA0240', 'AG0115', 'AG0120', 'AA0810', "AA0830", 'AA0840', 'AG0125', 'AG0130', 'AG0135'],//国内服务有详细内容信息的
          pointArr: [
            { title: '订舱信息', href: "#goodsinfoView", show: true },
            { title: '运价信息', href: "#fareInputViewData", show: false },
            { title: '服务项目', href: "#serviceDetail", show: false },
            // { title: '分单信息', href: "#supplementView", show: false },
          ],
          pointIndex: 0,
          mawbguid: '',
          pricefieldArr: [
            "inwageallinprice",
            "outwageallinprice",
            "outwageallinprice_trans",
            "inwageallinprice_trans",
            "inwagecostprice",
            "inwageallinprice_record"
          ], //单证确认详细不覆盖本页面的字段
          hawbListBackup: [],
          ybstoreListBackup: [],
          nextstepshow: false,
          tempConfigShow: true,//用于初始化服务模板组件
          // done: 订舱必填，其它选填
          goodsinfoTabs: [
            { title: '订舱信息（必填）' },
            { title: '补充信息（选填）' },
            { title: '总单收发货人信息（选填）' },
            // { title: '分单信息（选填）' },
          ],
          goodsinfoTabsChecked: 0,
          saveVisible: false,
          disabledSystemOption: [],//选择委托项目后，不能选的一些系统
        }
      },
      initDataFunc() {//初始化所有数据
        let data = this.getInitData()
        
         Object.keys(data).forEach(i => {
          if (!['basicinfoView', "goodsinfoView", 'fareInputViewData', "supplementView", "homeInformation"].includes(i)) {//ui组件未初始化，因为要保留里面的选项值
            this[i] = data[i]
          }
        })
     
        this.$nextTick(()=>{
          this.otherInitData();
        })
        
        this.tempConfigShow = false;//用v-if使某些组件初始化
        this.$nextTick(() => {
          this.tempConfigShow = true;
        })
      },
      pcCloseFunc() {
        //   this.$emit('success',this.orderdom);
        this.initDataFunc();
        this.dialogPcd = false;
      },
      otherInitData() {//其他数据的初始化
        // TODO: 运输种类 运输方式
        if (this.$store.getters.userSetting.mawbAddArea) {
          this.inputModelData.area = this.$store.getters.userSetting.mawbAddArea
        } else if (this.$store.state.areaState && this.$store.state.areaState.split(',').length === 1) {
          this.inputModelData.area = this.$store.state.areaState
        }

        if (this.$store.getters.userSetting.mawbAddSystem) {
          this.inputModelData.opersystem = this.$store.getters.userSetting.mawbAddSystem.opersystem || ''
          this.inputModelData.opersystemdom = this.$store.getters.userSetting.mawbAddSystem.opersystemdom == "国内服务" ? '' : this.$store.getters.userSetting.mawbAddSystem.opersystemdom

          this.inputModelData.system = this.inputModelData.opersystem == "国内服务" ?
            "国内服务" : (this.inputModelData.opersystemdom.charAt(0) + this.inputModelData.opersystem.charAt(0));
        } else {
          let systemCheck = this.$store.state.systemCheck;
          if (systemCheck.length == 2) {
            this.inputModelData.opersystem = systemCheck[1] + "口";
            this.inputModelData.opersystemdom = systemCheck[0] + "运";
          }
          if (systemCheck.length == 4) {
            this.inputModelData.opersystem = "国内服务";
          }
        }

        if (this.pagetype == 1 && this.isoutside) {
          this.inputModelData.fid = -1;
          this.inputModelData.gid = sessionStorage.out_gid;
          this.inputModelData.ispay_pre = 2
          this.inputModelData.ordertype = 1
          this.inputModelData.wtkhname = sessionStorage.out_usr_name;
          this.basicinfoView.area.usedarea = sessionStorage.out_gidarea;
          this.basicinfoView.opersystem.disabled = true;
          this.basicinfoView.opersystem.default = "出口";
          this.basicinfoView.opersystemdom.default = "空运";
          this.basicinfoView.opersystemdom.disabled = true;
          this.basicinfoView.orderdom.default = '总单'
          this.basicinfoView.orderdom.disabled = true
        }


        setTimeout(() => {
          this.$refs.houseNumberAdd && this.$refs.houseNumberAdd.initfunc()
        }, 100);


      },
      onScroll(e, position) {//滚动定位到面板
        if (this.isoutside) return;
        for (let k in this.pointArr) {
          if ($(this.pointArr[k].href).offset().top > 40) {
            this.pointIndex = k;
            break;
          }
        }
      },
      newCancelOrder() { //新撤单
        this.orderCancel = false;
        this.getMawbdetail();
      },
      assignClose() {//弹窗的分配
        this.$confirm('该订单尚未完成分配,取消后将退回到订舱新增页面,确定取消吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.assignShow = false;
        })
      },
      quickadd() {
        let textobj = { "orderdom": "总单", "system": "空出", "opersystem": "出口", "opersystemdom": "空运", "area": "上海", "ordertype": "", "guid": -1, "sfg": "PVG", "comboine": 1, "realpiece": 0, "mawb": "", "czlx": "自货", "orderno": "", "hawb": "", "fid": 4553, "gid": 5629, "mdg": "AAM", "qsd": "PVG", "mdd": "AAM", "zzg": "", "deliverydate": "", "piece": "", "weight": "", "volume": "", "ybpiece": "2", "ybweight": "2", "ybvolume": "2", "goodsybpiece": 3, "goodsybweight": 3, "goodsybvolume": "3.000", "smallpiece": "", "hbh": "", "hbrq": "2021-09-09", "qfsj": "", "yqqcts": "", "hbzl": "全部", "exForm1": "", "paymode": "PP", "englishpm": "CONSOL", "chinesepm": "", "hwxz": "普货", "hwlx": "普货", "ispay_pre": 2, "batterymodel": "", "tradeterm": "CIF", "ctype": false, "remark": "", "bglx": "", "bgpiece": "", "bgweight": "", "declList": [], "declListMdg": [], "address_thrtype_org": 1, "address_shrtype_org": 1, "address_thrstorearea_org": "", "address_shrstorearea_org": "", "store_thr": "", "port_thr": "", "terminal_thr": "", "store_shr": "", "port_shr": "", "terminal_shr": "", "address_thr_org": "", "lxr_thr_org": "", "phone_thr_org": "", "address_thrjson_org": "", "address_shr_org": "", "lxr_shr_org": "", "phone_shr_org": "", "address_shrjson_org": "", "company_thr_org": "", "company_thr_mdg": "", "address_thrtype_mdg": 1, "address_shrtype_mdg": 1, "address_thrstorearea_mdg": "", "address_shrstorearea_mdg": "", "store_thr_mdg": "", "port_thr_mdg": "", "terminal_thr_mdg": "", "store_shr_mdg": "", "port_shr_mdg": "", "terminal_shr_mdg": "", "lxr_thr_mdg": "", "phone_thr_mdg": "", "address_thrjson_mdg": "", "address_shr_mdg": "", "lxr_shr_mdg": "", "phone_shr_mdg": "", "address_shrjson_mdg": "", "dzlx": "总单", "ybstorevolumeList": [], "ybstorevolumeListMdg": [], "ybTransstoreList": [], "ybTransstoreListMdg": [], "company_shr_org": "", "company_shr_mdg": "", "currency": "人民币", "inwageallinclude": "1", "isinwageallin": "1", "inwageallinprice": "23", "self_real_bp_freight_in": 10, "cus_real_bp_freight_in": 0, "isinwageallin_trans": "1", "inwageallinprice_trans": "22", "self_real_bp_trans_in": 10, "cus_real_bp_trans_in": 0, "yjstorename": "", "yjstoredate": "", "appraisaltype_chem": "代取鉴定", "isstore_inspect": 1, "isstore_chem": 1, "zddlcode": "", "zddlzh": "", "zdiatacode": "", "gylist": [], "gylistpm": [], "gbzlist": [], "gbzlistpm": [], "cltglist": [], "companytitle_fhr_mawb": "", "address_fhr_mawb": "", "companycode_fhr_mawb": "", "state_fhr_mawb": "", "city_fhr_mawb": "", "postcode_fhr_mawb": "", "lxr_fhr_mawb": "", "phone_fhr_mawb": "", "fax_fhr_mawb": "", "email_fhr_mawb": "", "taxcode_fhr_mawb": "", "companytitle_shr_mawb": "", "address_shr_mawb": "", "companycode_shr_mawb": "", "state_shr_mawb": "", "city_shr_mawb": "", "postcode_shr_mawb": "", "lxr_shr_mawb": "", "phone_shr_mawb": "", "fax_shr_mawb": "", "email_shr_mawb": "", "taxcode_shr_mawb": "", "companytitle_fhr_hawb": "", "address_fhr_hawb": "", "companycode_fhr_hawb": "", "state_fhr_hawb": "", "city_fhr_hawb": "", "postcode_fhr_hawb": "", "lxr_fhr_hawb": "", "phone_fhr_hawb": "", "fax_fhr_hawb": "", "email_fhr_hawb": "", "taxcode_fhr_hawb": "", "companytitle_shr_hawb": "", "address_shr_hawb": "", "companycode_shr_hawb": "", "state_shr_hawb": "", "city_shr_hawb": "", "postcode_shr_hawb": "", "lxr_shr_hawb": "", "phone_shr_hawb": "", "fax_shr_hawb": "", "email_shr_hawb": "", "taxcode_shr_hawb": "", "yfstdin": "1", "ybstoreList": [{ "khjcno": "1", "piece": "1", "weight": "1", "volume": "1", "smallpiece": "", "isstorelimit": "2", "storeType": "不入库", "storename_yb": "", "isadd": false, "status": false }, { "khjcno": "2", "piece": "2", "weight": "2", "volume": "2", "smallpiece": "", "isstorelimit": "2", "storeType": "不入库", "storename_yb": "", "isadd": false, "status": false }], "customerRelList": [{ "id": 7098, "lxrtitle": "操作", "lxrss": 2, "name": "丁燕", "department": "操作", "post": "操作", "mobile": ".", "phone": "63777277*2308", "qq": "", "email": ".", "jobno": "", "area": "上海", "system": "380", "comxz": "1" }], "hawbList": [], "inoperationprice": "", "ybvolumeremark": "sfdsf", "ddrq": "", "gysname": "", "mawbss": "", "mawbgid": "", "dzstatus": 100, "pcstatus": 1, "comhy": "1", "freightfee_remark": "", "dom": "出口部", "salesarea": "上海", "salesdom": "出口部", "assignarea": "上海", "assigndom": "出口部", "inwageallinprice_record": 666666, "serviceList": [{ "servicecode": "OA0010", "oprequest": "", "isdel": 1, "assignname": "空出订舱", "port": "出港操作" }, { "servicecode": "AA0110", "oprequest": "", "isdel": 2, "assignname": "总单制作", "port": "出港操作" }, { "servicecode": "AA0120", "oprequest": "", "isdel": 2, "assignname": "分单制作", "port": "出港操作" }, { "servicecode": "AA0140", "oprequest": "", "isdel": 2, "assignname": "AMS发送", "port": "出港操作" }, { "servicecode": "AA0150", "oprequest": "", "isdel": 2, "assignname": "天运通发送", "port": "出港操作" }, { "servicecode": "AA0230", "oprequest": "", "isdel": 1, "assignname": "唯凯安检", "port": "出港操作" }, { "servicecode": "AA0240", "oprequest": "", "isdel": 1, "assignname": "唯凯交接", "port": "出港操作" }, { "servicecode": "AA0610", "oprequest": "", "isdel": 1, "assignname": "空出报关", "port": "出港配套服务" }, { "servicecode": "AA0510", "oprequest": "", "isdel": 1, "assignname": "提送货", "port": "出港配套服务" }, { "servicecode": "AA0410", "oprequest": "", "isdel": 2, "assignname": "空出进仓", "port": "出港配套服务" }, { "servicecode": "AG0135", "oprequest": "", "isdel": 2, "assignname": "标签制作", "port": "出港配套服务" }, { "servicecode": "AG0120", "oprequest": "", "isdel": 2, "assignname": "改包装", "port": "出港配套服务" }, { "servicecode": "AA0850", "oprequest": "", "isdel": 2, "assignname": "大件装卸", "port": "出港配套服务" }, { "servicecode": "AG0130", "oprequest": "", "isdel": 2, "assignname": "挂衣", "port": "出港配套服务" }, { "servicecode": "AA0810", "oprequest": "", "isdel": 2, "assignname": "材料供应", "port": "出港配套服务" }, { "servicecode": "AG0115", "oprequest": "", "isdel": 2, "assignname": "磁检", "port": "出港配套服务" }, { "servicecode": "AG0125", "oprequest": "", "isdel": 2, "assignname": "化检", "port": "出港配套服务" }, { "servicecode": "AG0110", "oprequest": "", "isdel": 2, "assignname": "快递代付", "port": "出港配套服务" }, { "servicecode": "OB0020", "oprequest": "", "isdel": 2, "assignname": "到货通知", "port": "进港服务" }, { "servicecode": "AB0620", "oprequest": "", "isdel": 2, "assignname": "空进报关", "port": "进港服务" }, { "servicecode": "AB0520", "oprequest": "", "isdel": 2, "assignname": "提送货", "port": "进港服务" }, { "servicecode": "AB0420", "oprequest": "", "isdel": 2, "assignname": "空进进仓", "port": "进港服务" }] }
        this.inputModelData = Object.assign({}, this.getInitData().inputModelData, textobj)
        setTimeout(() => {
          this.inputModelData.customerRelList = [{ "id": 70534, "lxrtitle": "客服", "lxrss": 2, "name": "ww", "department": "客服", "post": "客服", "mobile": "", "phone": "17596264851", "qq": "", "email": "1724445@163.com", "jobno": null, "area": "上海", "system": "-1", "comxz": "1", "addman": "admin", "adddate": "2021-04-08 11:47:14" }]
          this.serviceList = this.inputModelData.serviceList;
        }, 100);
      },
      getMawbGys() {//获取总单供应商数据
        if (this.pagetype == 2 || this.isoutside) return;
        if (this.importActiveName === "repeatOrder") {
          return;
        }
        if (!this.inputModelData.mawb) {
          this.mawbgys = "";
          return;
        }
        if (!this.inputModelData.area) {
          this.$message.error("请先选择区域！");
          return;
        }
        //  alert(this.inputModelData.czlx)
        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxplineMawb",
          params: {
            mawb: this.inputModelData.mawb,
            area: this.inputModelData.area,
            gid: this.inputModelData.gid,
            sfg: this.inputModelData.sfg,
            mdg: this.inputModelData.mdg,
            czlx: this.inputModelData.czlx
          },
          loading: false,
          tip: false
        }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            let res = results.data.resultdic.mawbInfo;
            if (res) {
              if (res.status == 1) {
                this.mawbgys = res.gysname;
                this.mawbss = res.mawbss;
                this.mawbgid = Number(res.gysid);
                this.aircomcode = res.aircomcode + "," + res.parea;
                if (
                  this.inputModelData.hbh.length >= 2 &&
                  this.inputModelData.area == this.conditionalAreaForBuild &&
                  this.inputModelData.mawb &&
                  this.aircomcode &&
                  this.aircomcode.indexOf(
                    this.inputModelData.hbh.substr(0, 2).toUpperCase()
                  ) < 0
                ) {
                  this.inputModelData.hbh = "";
                }
                this.inputModelData.self_real_bp_freight_out = res.xyfp1_in;
                this.inputModelData.cus_real_bp_freight_out = res.xyfp2_in;
                this.inputModelData.self_real_bp_trans_out = res.xyfp1_in;
                this.inputModelData.cus_real_bp_trans_out = res.xyfp2_in;
              } else {
                this.mawbgys = "";
                this.mawbss = "";
                this.mawbgid = "";
                this.aircomcode = "";
                this.inputModelData.mawb = "";
                this.inputModelData.self_real_bp_freight_out = 10;
                this.inputModelData.cus_real_bp_freight_out = 0;
                this.inputModelData.self_real_bp_trans_out = 10;
                this.inputModelData.cus_real_bp_trans_out = 0;
                this.$message.error("此运单号不可用！");
              }
            }
            this.inputModelData.iszddl = results.data.resultdic.iszddl;
            this.inputModelData.zddlcode = results.data.resultdic.zddlcode;
            this.inputModelData.zddlzh = results.data.resultdic.zddlzh;
            this.inputModelData.zdiatacode = results.data.resultdic.zdiatacode;
          } else {
            this.inputModelData.mawb = "";
            this.$message.error(results.data.resultmessage + ",运单号不可用！");
          }
        });
      },
      inwageallinpriceFunc(num) {
        this.inputModelData.inwageallinprice = Number(
          Number(this.inputModelData.inwageallinprice) + num
        ).toFixed(2);
      },
      // 监听委托客户、项目  根据传过来的type判断客户还是项目
      wtdataP(data) {
        this.inputModelData.wtkhname = data.wtkhname;
        this.inputModelData.wtxmname = data.wtxmname;
      },
      handleClick(e) {
        this.detailShow.supplement = true
      },
      mawbDialogFunc() {
        if (!this.inputModelData.area) {
          this.$message.error("请先选择区域！");
          return;
        } else {
          this.mawbDialog = true;
        }
      },
      fieldsInit() {//初始化一些字段的显示隐藏，不要在这里修改inputModelData的值

        if (this.inputModelData.opersystem == "进口") {
          // this.supplementView.hbh.title = "航班号";
          this.goodsinfoView.hbrq.title = "航班日期";
          this.supplementView.yqqcts.title = "全程天数";
        }

        if (this.inputModelData.opersystem == "出口") {
          // this.supplementView.hbh.title = "指定航班号";
          this.goodsinfoView.hbrq.title = "指定航班日期";
          this.supplementView.yqqcts.title = "要求全程天数";
        }


        if (this.inputModelData.orderdom == "分单") {
          this.supplementView.remark.title = "唛头";
          this.supplementView.comboine.disabled = true;
        } else {
          if (this.newService.AA0110) {
            this.newService.AA0110.disabled = false;
          }
          this.supplementView.remark.title = "备注";
        }

        if (this.inputModelData.orderdom == "总单") {
          this.supplementView.chinesepm.hidden = true;
          this.supplementView.tradeterm.hidden = true;
        } else {
          this.supplementView.chinesepm.hidden = false;
          this.supplementView.tradeterm.hidden = false;
        }

        // if (this.inputModelData.orderdom == "分单") {
          // this.fareInputViewData.isinwageallin.options[1].disabled = true;
        // } else {
          // this.fareInputViewData.isinwageallin.options[1].disabled = false;     
        // }
        if (this.inputModelData.opersystem == "进口") {
          // this.supplementView.qfsj.hidden = true;
          this.supplementView.hbzl.hidden = true;
          this.supplementView.paymode.hidden = true;
        } else {
          // this.supplementView.qfsj.hidden = false;
          this.supplementView.hbzl.hidden = false;
          this.supplementView.paymode.hidden = false;
        }


      },
      assignH() {
        this.assignShow=true
        //this.saveWaitFp(2);
        // let refFenpei = this.$refs.fenpei;
        
        // if (refFenpei) {
        //   // console.log(refFenpei.verifyAssignment())
        //   if (!refFenpei.verifyAssignment()) {
        //     return
        //   }
        //   if (this.inputModelData.isneedfenpei) {
        //     refFenpei.assignH();//生成服务分配信息，默认是所有服务
        //     setTimeout(() => {
        //       this.saveWaitFp(2);
        //     }, 0);
        //   }
        // }

      },
      checkFirstPage() {//点击下一步验证数据及控制显示内容
        if (this.pagestep == 1) {
          //console.log(this.basicinfoRequired)
          if (this.basicinfoRequired) {
            this.$message.error("请选择" + this.basicinfoRequired);
            return false;
          }
          if (this.inputModelData.system == '空出' && this.inputModelData.customerRelList.length == 0) {
            this.$message.error("请选择本票客户联系人");
            return false;
          }

          if (this.inputModelData.opersystem == '国内服务' && this.serviceSelArr.length == 0) {
            this.$message.error("请选择服务");
            return false;
          }

          // if (this.inputModelData.isneedfenpei) {
          //   if (!this.$refs.fenpei.verifyAssignment()) {
          //     return false;
          //   }
          // }

          this.fieldsInit();


          this.pagestep = 2;
        } else {

          if (this.inputModelData.opersystem != "国内服务") {

            if (this.goodsinfoRequired) {
              this.$message.error("请填写" + this.goodsinfoRequired);
              location.href="#goodsinfoView"
              return false;
            }

            // // note: 订舱操作 == 唯凯配舱 && 订单类型 == 分单（直客委托) 需要填写分运单号
            // if (this.inputModelData.czlx === '自货' && this.inputModelData.orderdom === '分单') {
            //   // 校验 -> 补充信息 -> 分运单号
            //   if (this.supplementRequired) {
            //     this.$message.error("请填写" + this.supplementRequired);
            //     return false;
            //   }
            // } 

            if (this.supplementRequired) {
                this.$message.error("请填写" + this.supplementRequired);
                return false;
              }


            if (!this.inputModelData.hwlx) {
              this.$message.error("请选择货物类型!");
              location.href="#goodsinfoView"
              return false;
            }

            if (
              this.inputModelData.mawb && this.inputModelData.mawb.length !== 12 &&
              this.inputModelData.czlx == "代操作" && this.inputModelData.opersystem == "出口" && this.inputModelData.opersystemdom == "空运"
            ) {
              this.$message.error("请检查总运单格式，必须为12位！");
              return false;
            }




            if (this.inputModelData.area == this.conditionalAreaForBuild) {
              if (
                this.inputModelData.mawb &&
                (!this.inputModelData.hbh || this.inputModelData.length < 2)
              ) {
                this.$message.error("请填写指定航班号，至少两位!");
                return false;
              }
            }



            if (
              this.inputModelData.opersystem == "出口" &&
              this.inputModelData.area != this.conditionalAreaForBuild
            ) {
              if (
                this.inputModelData.czlx == "自货" && this.inputModelData.opersystemdom == "空运" &&
                !this.inputModelData.inwageallinprice
              ) {
                this.$message.error("请填写运费价格!");
                return false;
              }

              if (
                this.inputModelData.isinwageallin_trans == 2 &&
                Number(this.inputModelData.inwageallinprice_trans) < 100
              ) {
                this.$message.error("应收中转费价格必须大于等于100");
                return false;
              }
            }
            if (
              this.ctype &&
              !this.inputModelData.inwageallinprice &&
              this.inputModelData.czlx == "自货"&&
              this.inputModelData.opersystem == "出口"
            ) {
              this.$message.error("请填写运费价格!");
              return false;
            }
          }
        }

        return true;
      },
      getInfo(checkRequired = true, isSave = true) {//验证并获取最终的表单数据

         /* 
          ((订舱操作 == 唯凯配舱 && 订单类型 == 总直单) ||
          (订舱操作 == 唯凯代操作 && 订单类型 === '分单' ))
          => throw new Error('请选择订单类型！')

          */
          if ((this.inputModelData.czlx === '自货' && this.inputModelData.orderdom === '直单')||
            (this.inputModelData.czlx === '代操作' && this.inputModelData.orderdom === '分单')
          ) {
            this.$message.error('请选择订单类型！');
            scrollToPosition('#baseContent')
            return false;
          }


        if (checkRequired) {
          console.log(this.pagestep)
          if (!this.checkFirstPage()) return;

          if (this.serviceSelArr.length == 0) {
            this.$message.error("请选择服务！");
            return;
          }

          let message = "";
          if (this.isMawbImport && this.importMawbData) {
            message = `订单序号${this.importMawbData.insertindex}： ` + message;
          }

          // if (this.inputModelData.realpiece != this.inputModelData.ybpiece) {
          //   this.$message.error(message + "实际进仓件数与预计件数不匹配！");
          //   return;
          // }

        }
        var mawbInfo = {};


        
        if (this.inputModelData.opersystem != "国内服务") {
          mawbInfo = JSON.parse(JSON.stringify(this.inputModelData));
          let ybstoreList = this.inputModelData.ybstoreList.filter(i => !i.isadd);

          if (this.inputModelData.isimperfect == 1) {//正式订舱需要填写货物信息，

            if (ybstoreList.length == 0) {
              this.$message.error("请至少输入一条进仓编号信息"); return;

            } else {

              //let emptyybstoreList = ybstoreList.filter(i => !i.khjcno || !i.piece || !i.weight || !i.volume || (this.inputModelData.czlx == '自货' ? i.ybstorevolumeList.filter(e => !e.packagetypename || !e.piece || !e.longs || !e.widths || !e.heights).length > 0 : false))
              // done: 尺寸备注
              if (this.inputModelData.czlx == '自货' && !this.inputModelData.ybvolumeremark) {
                this.$message.error("请填写尺寸备注！");
                return;
              }
              // if (ybstoreList.filter(i => i.storeremark_yb).length == 0&&this.inputModelData.czlx=='自货') {
              //   this.scrollTop(this.$refs.houseNumberAdd)
              //   this.$message.error("请至少填写一条预报尺寸备注信息！");
              //   return;
              // }

              let emptyybstoreList = ybstoreList.filter(i => !i.khjcno || !i.piece || !i.weight || !i.volume || !i.storeType || ((i.storeType == '入库' || i.storeType == '晚入库') && !i.storename_yb))
              if (emptyybstoreList.length > 0) {
                this.$message.error("请完善进仓编号信息！");
                return;
              }


            }
          }

        //console.log(serviceshow)
        // if (this.detailShow.fareInputViewData&&mawbInfo.czlx == '自货'&&mawbInfo.opersystem=='出口') {

          if (mawbInfo.czlx == '自货'&&mawbInfo.opersystem=='出口') {
            let serviceshow = !this.inputModelData.inwageallinprice || (this.inputModelData.self_real_bp_freight_in + this.inputModelData.cus_real_bp_freight_in) != 10
            console.log(serviceshow)
            if (serviceshow) {
              this.$message.error("请完善运价信息！");
              location.href="#fareInputViewData"
              return;
            }

          }


          // function isValidateNumber(val) {
          //   return !Number.isNaN(Number(val));
          // }

          // console.log(this.hawbListBackup)
          if (mawbInfo.orderdom == "总单" && this.pagetype == 2) {//修改页面，新增修改删除分单操作不是单独走接口而是走最后的大保存，所以需要在数据中说明是什么操作，让后台能够做对应的操作
            this.hawbListBackup.forEach(i => {
              let isold = mawbInfo.hawbList.filter(e => e.guid == i.guid)
              if (isold.length == 0) {
                let e = { ...i };
                e.isdel = 2;
                mawbInfo.hawbList.push(e)
              } else {
                let item = isold[0]
                if (item.isdel != 2) {
                  i.ybstoreList && i.ybstoreList.forEach(n => {
                    let isstoreold = item.ybstoreList.filter(e => e.guid == n.guid);
                    if (isstoreold.length == 0) {
                      let e = { ...n };
                      e.isdel = 2;
                      item.ybstoreList.push(e)
                    } else {
                      let itemstore = isstoreold[0]
                      // if (itemstore.isdel != 2) {
                      //   n.ybstorevolumeList && n.ybstorevolumeList.forEach(m => {
                      //     let isvolumeold = itemstore.ybstorevolumeList.filter(e => e.guid == m.guid);
                      //     if (isvolumeold.length == 0) {
                      //       let e = { ...m };
                      //       e.isdel = 2;
                      //       itemstore.ybstorevolumeList.push(e)
                      //     }
                      //   })
                      // }
                    }
                  })
                }
              }
            })
            this.ybstoreListBackup.forEach(i => {
              let isstoreold = ybstoreList.filter(e => e.guid == i.guid);
              if (isstoreold.length == 0) {
                let e = { ...i };
                e.isdel = 2;
                ybstoreList.push(e)
              } else {
                // let itemstore = isstoreold[0]
                // if (itemstore.isdel != 2) {
                //   i.ybstorevolumeList && i.ybstorevolumeList.forEach(m => {
                //     let isvolumeold = itemstore.ybstorevolumeList.filter(e => e.guid == m.guid);
                //     if (isvolumeold.length == 0) {
                //       let e = { ...m };
                //       e.isdel = 2;
                //       itemstore.ybstorevolumeList.push(e)
                //     }
                //   })
                // }
              }
            })
          }

          for (let item of ybstoreList) {//该版本不需要预报尺寸信息
            delete item.ybstorevolumeList;
          }

          if (this.pagetype == 2) {
            mawbInfo.hawbList.forEach(i => {
              i.ybstoreList.forEach((e, k) => {
                let arr = this.inputModelData.ybstoreList.filter(n => n.guid == e.guid)
                if (arr.length > 0) {
                  // console.log(arr[0])
                  i.ybstoreList[k] = arr[0]
                }
              })
            })
          }

          mawbInfo.ybstoreList = ybstoreList.filter(i => {//配置在分单上的不传给总单
            return mawbInfo.hawbList.filter(e => e.hawb == i.hawb).length == 0
          });

          if (this.inputModelData.isinwageallin == 4) {
            mawbInfo.inwagecostprice = this.inputModelData.inwageallinprice;
            mawbInfo.inwageallinprice = "";
          }

          mawbInfo.gysname = this.mawbgys;
          mawbInfo.mawbss = this.mawbss;
          mawbInfo.mawbgid = this.mawbgid;

          mawbInfo.dzstatus = 100;
          mawbInfo.pcstatus = 1;

          if (this.inputModelData.orderdom == "直单") {
            mawbInfo.hawbList = [];
          }

          getxmdata("wtkhUseful").forEach(i => {
            if (mawbInfo.fid == i.id) {
              mawbInfo.comhy = i.comhy;
            }
          });

          if (checkRequired) {//验证收发货人及分单信息
            if (this.inputModelData.orderdom == "总单" && (this.inputModelData.area == this.conditionalAreaForBuild || this.inputModelData.area == "市场部" || this.inputModelData.area == "海外部")) {
              /*  if(!mawbInfo.companytitle_fhr_mawb||!mawbInfo.address_fhr_mawb||!mawbInfo.companycode_fhr_mawb||!mawbInfo.city_fhr_mawb||!mawbInfo.companytitle_shr_mawb||!mawbInfo.address_shr_mawb||!mawbInfo.companycode_shr_mawb||!mawbInfo.city_shr_mawb){
  this.$message.error("请填写总单收发货人");return
  } */
              if (
                this.$refs.makeBillRevSed &&
                this.$refs.makeBillRevSed.ifHasLimit()
              ) {
                this.$message.error("请检查总单收发货人是否超出字符限制！");
                return;
              }

              // FIX 没填分运单号，可以过校验
              if (mawbInfo.hawbList) {
                
                for (let i in mawbInfo.hawbList) {
                  let e = mawbInfo.hawbList[i];
                  // if (
                  //   !e.companytitle_fhr_hawb ||
                  //   !e.address_fhr_hawb ||
                  //   !e.companycode_fhr_hawb ||
                  //   !e.city_fhr_hawb ||
                  //   !e.companytitle_shr_hawb ||
                  //   !e.address_shr_hawb ||
                  //   !e.companycode_shr_hawb ||
                  //   !e.city_shr_hawb
                  // ) {
                  //    this.$message.error("请填写分单收发货人");return
                  // }
                  if (!e.hawb) {
                    this.$message.error(`请填写分运单${e.hawb}信息`);
                    this.scrollTop(this.$refs.hawbtab)
                    location.href="#goodsinfoView";
                    this.goodsinfoTabsChecked = 3;
                    return;
                  }
                  if (!e.khjcno) {
                    this.$message.error(`请选择分运单${e.hawb}的进仓编号`);
                    this.scrollTop(this.$refs.hawbtab)
                    location.href="#goodsinfoView";
                    this.goodsinfoTabsChecked = 3;
                    return;
                  }
                  if (!e.tradeterm) {
                    let message = "";
                    if (this.isMawbImport && this.importMawbData) {
                      message =
                        `订单序号${this.importMawbData.insertindex}： ` + message;
                    }
                    this.detailShow.supplement = true;
                    this.tabsChecked = 1;
                    this.scrollTop(this.$refs.hawbtab)
                    location.href="#goodsinfoView";
                    this.goodsinfoTabsChecked = 3;
                    this.$message.error(message + `请选择分单${e.hawb}贸易方式`);
                    return;
                  }

                }


                // if (this.$refs.hawbtab && this.$refs.hawbtab.checkHasLimit()) {
                //   this.$message.error(
                //     `请检查分单${this.$refs.hawbtab.checkHasLimit()}的收发货人是否超出字符限制！`
                //   );
                //   return;
                // }
              }
            } else if (this.inputModelData.orderdom == "分单") {//当选择分单上榜时，需要将表单数据复制一份放入到hawbList
              if (
                this.$refs.makeBillRevSedHawb &&
                this.$refs.makeBillRevSedHawb.ifHasLimit()
              ) {
                this.$message.error("请检查分单收发货人是否超出字符限制！");
                return;
              }

              let hawbModelData = {
                hawb: "",
                sfg: "",
                mdg: "",
                ybpiece: 0,
                ybweight: 0,
                ybvolume: 0,
                smallpiece: 0,
                hwxz: "",
                hwlx: "",
                batterymodel: "",
                chinesepm: "",
                englishpm: "",
                isinwageallin: "",
                inwageallinprice: 0,
                currency: "",
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
                gid: 0,
                khjcno: "",
                realpiece: 0,
                realweight: 0,
                realvolume: 0,
                ybstoreList: [],
                tradeterm: "",
                rate: "",
                remark: "",
                code_fhr_hawb: "",
                code_shr_hawb: ""
              };
              Object.keys(hawbModelData).forEach(i => {
                hawbModelData[i] = mawbInfo[i];
              });
              mawbInfo.hawbList = [hawbModelData];
              mawbInfo.ybstoreList = [];
              delete mawbInfo.hawb;
            }
          }
          mawbInfo.freightfee_remark = "";
          mawbInfo.czlx =
            this.inputModelData.opersystem == "出口" ? this.inputModelData.czlx : this.inputModelData.system;

          if (mawbInfo.czlx == "代操作") {
            delete mawbInfo.isinwageallin;
          }

          delete mawbInfo.jsonArr;
          delete mawbInfo.khjcnolist;
        } else {
          //国内服务
          if (this.gnServiceRequired) {
            this.$message.error("请填写" + this.gnServiceRequired);
            return;
          }
          //判断服务模块主表的必填
          let required = false;

          this.serviceSelArr.reverse().forEach(code => {
            let item = this.serviceViewData[code + "ViewData"];
            if (item) {
              Object.keys(item)
                .reverse()
                .forEach(e => {
                  if (
                    item[e].required &&
                    !this.inputModelData[e] &&
                    !item[e].hidden
                  ) {
                    required = item[e].title;
                  }
                });
            }
          });
          if (required) {
            this.$message.error("请填写" + required.replace("：", ""));
            return;
          }

          //判断始发港提货里面的必填
          if (this.serviceSelArr.includes("AA0510")) {
            if (!this.$refs.takeGoodsAddRef.check_data()) {
              //  this.$message.error('');
              return;
            }
          }

          //判断目的港送货里面的必填
          if (this.serviceSelArr.includes("AB0520")) {
            if (!this.$refs.takeGoodsAddRefMdg.check_data()) {
              return;
            }
          }

          if (this.inputModelData.address_thrtype_org == 3) {
            this.inputModelData.address_thr_org = JSON.parse(
              localStorage.cargoData
            ).filter(i => i.storename == this.inputModelData.store_thr)[0].remark;
            this.inputModelData.address_thrjson_org = "";
            this.inputModelData.company_thr_org = "";
          }

          if (this.inputModelData.address_shrtype_org == 3) {
            this.inputModelData.address_shr_org = JSON.parse(
              localStorage.cargoData
            ).filter(i => i.storename == this.inputModelData.store_shr)[0].remark;
            this.inputModelData.address_shrjson_org = "";
            this.inputModelData.company_shr_org = "";
          }

          mawbInfo = Object.assign({}, this.inputModelData);
          //  mawbInfo.khjcnolist=mawbInfo.khjcnolist&&mawbInfo.khjcnolist.filter(i=>i.khjcno)
          //判断多条的进仓编号
          if (mawbInfo.khjcnolist.length > 0) {
            for (let i in mawbInfo.khjcnolist) {
              let item = mawbInfo.khjcnolist[i];
              if (!item.khjcno) {
                this.$message.error("有进仓编号未填写");
                return;
              }
              if (item.khjcno && !item.piece) {
                this.$message.error(`请填写进仓编号${item.khjcno}的件数！`);
                return;
              }
              if (item.khjcno && !item.weight) {
                this.$message.error(`请填写进仓编号${item.khjcno}的重量！`);
                return;
              }
              if (item.volumelist.length > 0) {
                for (let e in item.volumelist) {
                  let item2 = item.volumelist[e];
                  if (
                    item2.packagetypename &&
                    (!item2.piece ||
                      !item2.longs ||
                      !item2.heights ||
                      !item2.widths)
                  ) {
                    this.$message.error(
                      `请填写进仓编号${item.khjcno}的尺寸的完整信息！`
                    );
                    return;
                  }
                }
              }
            }
          }

          mawbInfo.mawbdocInfo =
            (this.$refs.makingbillmawb && this.$refs.makingbillmawb.getInfo()) || {};
          mawbInfo.hawbdocInfo =
            (this.$refs.makingbillhawb && this.$refs.makingbillhawb.getInfo()) || {};
          mawbInfo.opersystemdom = "";

          // if(this.serviceSelArr.length==1&&this.serviceSelArr[0]=='AG0110'){
          //   mawbInfo.fid=-1
          //   mawbInfo.gid=-1
          // }
        }

        mawbInfo.ordertype = "";
        mawbInfo.dom = localStorage.dom || "出口部";

        mawbInfo.salesarea = mawbInfo.area;
        mawbInfo.salesdom = "出口部";
        mawbInfo.assignarea = mawbInfo.area;
        mawbInfo.assigndom = "出口部";

        mawbInfo.fid = mawbInfo.fid || -1;
        mawbInfo.gid = mawbInfo.gid || -1;
        mawbInfo = this.dealList(mawbInfo);

        if (isSave) {
          mawbInfo.inwageallinprice = mawbInfo.inwageallinprice || 666666;
          mawbInfo.inwageallinprice_trans =
            mawbInfo.inwageallinprice_trans || 666666;
          mawbInfo.inwageallinprice_record =
            mawbInfo.inwageallinprice_record || 666666;
        }

        // this.serviceList.forEach(i => {
        // if (this.orderdom == "分单"&&i.servicecode == "AA0110") {
        //    i.isdel=2
        // }
        // });
        if (this.pagetype == 1) {
          mawbInfo.serviceList = this.serviceList

          //外网新增字段
          if (this.isoutside) {
            mawbInfo.fid = sessionStorage.out_gid;
            mawbInfo.gid = -1;
            mawbInfo.ordertype = "";
            mawbInfo.dom = localStorage.dom || "出口部";
            mawbInfo.salesarea = mawbInfo.area;
            mawbInfo.salesdom = "出口部";
            mawbInfo.assignarea = mawbInfo.area;
            mawbInfo.assigndom = "出口部";

            mawbInfo.freightfee_remark = "";
            mawbInfo.czlx = mawbInfo.opersystem == "出口" ? mawbInfo.czlx : mawbInfo.system;

            mawbInfo.orderdom = mawbInfo.orderdomOut || mawbInfo.orderdom;

            mawbInfo.customerRelList = [
              {
                area: mawbInfo.area,
                comxz: "1",
                department: "客服",
                email: sessionStorage.out_email,
                jobno: null,
                lxrss: 2,
                lxrtitle: "客服",
                mobile: sessionStorage.out_mobile,
                name: sessionStorage.out_uname,
                phone: "",
                post: "客服",
                qq: "",
                system: "-1",
              }
            ]
          }
        } else {
          //修改页面保存时只需修改serviceList的部分值 
          //需要测试一下这两种是否有区别，如果没有合并
          if (this.isoutside) {
            mawbInfo.serviceList.forEach(i => {
              i.oprequest = this.newService[i.servicecode].oprequest
              i.isdel = this.newService[i.servicecode].model ? 1 : 2
              i.yqfinishdate = this.newService[i.servicecode].yqfinishdate
            })
          } else {
            mawbInfo.serviceList = this.inputModelData.serviceList.map(i => {
              return Object.assign({}, i, this.serviceList.find(e => e.servicecode == i.servicecode))
            })
          }

        }

        mawbInfo.ybstoreList.forEach(i => {//给后台传值的时候需要删除时间戳，否则后台接口报错
          delete i.timestamp
        })

        mawbInfo.ysservice.guid = mawbInfo.ysservice.guid || -1;

        mawbInfo.hawbList.forEach(i => {
          delete i.timestamp;
          if (i.ybstoreList) {
            i.ybstoreList.forEach(e => {
              delete e.timestamp;
              delete e.ybstorevolumeList
            })
          }
        })


        if (!this.serviceSelArr.includes('AA0510')) {
          mawbInfo.ysservice.company_thr_org = '';
          mawbInfo.ysservice.khjcno = '';
          mawbInfo.ysservice.piece = '';
          mawbInfo.ysservice.weight = '';
          mawbInfo.ysservice.volume = '';
          mawbInfo.ysservice.address_thr_org = '';
          mawbInfo.ysservice.address_thrjson_org = '';
          mawbInfo.ysservice.lxr_thr_org = '';
          mawbInfo.ysservice.phone_thr_org = '';
          mawbInfo.ysservice.pickupdate_org = '';
        }

        if (!this.serviceSelArr.includes('AA0410')) {
          mawbInfo.ysservice.yqfinishdate_org = '';
          mawbInfo.ysservice.store_thr = '';
        }

        mawbInfo.yqhbh = mawbInfo.hbh
        mawbInfo.yqhbrq = mawbInfo.hbrq
        mawbInfo.yjqfsj = mawbInfo.qfsj

        mawbInfo.isinwageallin =
          mawbInfo.isinwageallin || 1;

        mawbInfo.isinwageallin_trans =
          mawbInfo.isinwageallin_trans || 666666;
        mawbInfo.inwageallinprice =
          mawbInfo.inwageallinprice || 666666;
        mawbInfo.inwageallinprice_trans =
          mawbInfo.inwageallinprice_trans || 666666;
        mawbInfo.inwageallinprice_record =
          mawbInfo.inwageallinprice_record || 666666;

        mawbInfo.self_real_bp_trans_in = mawbInfo.self_real_bp_trans_in || 10
        mawbInfo.cus_real_bp_trans_in = mawbInfo.cus_real_bp_trans_in || 0


        if (this.isoutside) {
          mawbInfo.customprice = mawbInfo.inwageallinprice ? 2 : 1;
        } else {
          if (this.frompage != 4 && this.pagetype != 1) {//只有订单新增和订单未完善页面需要传isimperfect
            delete mawbInfo.isimperfect
          }
        }

        return mawbInfo;
      },
      saveMawbInfo() {//保存总单信息

        let mawbInfo = this.getInfo();

        if (!mawbInfo) {
          return;
        }
        if (mawbInfo.system == "空出" && mawbInfo.area == this.conditionalAreaForBuild) {
          //  mawbInfo.nodecode = "AO5025";
          mawbInfo.nodecode = "AO5010";
        } else {
          mawbInfo.nodecode = "AO5020";
        }

        this.saveBtnDisabled = true;
        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxplineLocal",
          data: mawbInfo,
          loading: true,
          tip: false
        })
          .then(results => {
            //  console.log(results);
            if (results.data.resultstatus == 0) {
              if (mawbInfo.opersystem == "国内服务") {
                this.$alert(
                  "订单编号为" +
                  results.data.resultno +
                  ";<br>" +
                  results.data.resultmessage +
                  "。",
                  "提示", {
                  distinguishCancelAndClose: true,
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定"
                }
                ).then(() => {
                  if (this.serviceSelArr.includes("AA0510")) {
                    this.$refs.takeGoodsAddRef.saveAddress();
                  }
                  if (this.serviceSelArr.includes("AB0520")) {
                    this.$refs.takeGoodsAddRefMdg.saveAddress();
                  }
                  this.initDataFunc();
                  return;
                });
              } else {
                this.$confirm(
                  "订单编号为" +
                  results.data.resultno +
                  ";<br>" +
                  results.data.resultmessage +
                  "。",
                  "提示", {
                  distinguishCancelAndClose: true,
                  dangerouslyUseHTMLString: true,
                  closeOnClickModal: false,
                  showClose:false,
                  confirmButtonText: "确定",
                  cancelButtonText: "打印流转单",
                  showCancelButton: this.inputModelData.system == "空出" && this.inputModelData.czlx == '代操作',
                  cancelButtonClass: "el-button el-button--primary"
                }
                )
                  .then(() => {
                    this.initDataFunc();
                    return;
                  })
                  .catch(action => {
                    if (action == "cancel") {
                      this.peicheBill(results.data);
                    }
                  });
              }
            } else if (results.data.resultstatus == 99) {
              this.$alert(results.data.resultmessage, "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.initDataFunc();
                  return;
                }
              });
            } else {
              this.saveBtnDisabled = false;
              this.$message.error(results.data.resultmessage);
            }
          })
          .catch(error => {
            //console.log(error)
            this.saveBtnDisabled = false;
          });
      },
      operationSave(boguid, bono) {
        //WFF操作
        // var url="http://192.168.0.167/BoManagementWebApi/api/ExAxplineAssignLocal"
        this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExAxplineAssignLocal",
          data: {
            boguid: boguid
          },
          loading: true,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$alert("订单创建成功，订单编号为" + bono, "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.initDataFunc();
                return;
              }
            });
          }
        });
      },
      saveWaitFunc() {
        if (this.getInfo()) { this.assignShow = true }
      },
      saveWaitFp(type) {
        //1.保存待处理 2保存并分配 3.保存并完成
        var mawbInfo = this.getInfo();
        console.log(mawbInfo)
        console.log(JSON.stringify(mawbInfo))
        if (!mawbInfo) {
          return;
        }

        if (type == 3) {
          mawbInfo.nodecode = "AO5060";
        } else {
          mawbInfo.nodecode = "AO5025";
        }

        // if (type == 2) {
        //   if (!this.$refs.fenpei || !this.$refs.fenpei.yanzhen()) return;
        // } else {
        //   this.saveBtnDisabled = true;
        // }
        this.$axios({
          method: "post",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          data: mawbInfo,
          loading: true,
          tip: false
        })
          .then(results => {
            if (results.data.resultstatus == 0) {
              if (type == 2) {
                this.saveBtnDisabled = false;
                this.$refs.fenpei.confirmFp(results.data.resultguid, results.data.resultno)
              } else {
                if (this.inputModelData.opersystem == "国内服务") {
                  this.$alert(
                    "订单编号为" +
                    results.data.resultno +
                    ";<br>" +
                    results.data.resultmessage +
                    "。",
                    "提示", {
                    distinguishCancelAndClose: true,
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定"
                  }
                  ).then(() => {
                    if (this.serviceSelArr.includes("AA0510")) {
                      this.$refs.takeGoodsAddRef.saveAddress();
                    }
                    if (this.serviceSelArr.includes("AB0520")) {
                      this.$refs.takeGoodsAddRefMdg.saveAddress();
                    }

                    if (type == 1) {
                      this.initDataFunc();
                    } else if (type == 2) {
                      //this.assignShow = true;
                      this.mawbguid = results.data.resultguid;
                      this.$refs.fenpei && this.$refs.fenpei.confirmFp(results.data.resultguid)
                    } else {
                      if (results.data.resultguid > 0) {
                        this.costShow = true;
                        this.inputModelData.boguid = results.data.resultguid;
                      } else {
                        this.initDataFunc();
                      }
                    }
                    return;
                  });
                } else {
                  this.$confirm(
                    "订单编号为" +
                    results.data.resultno +
                    ";<br>" +
                    results.data.resultmessage +
                    "。",
                    "提示", {
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal: false,
                    distinguishCancelAndClose: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "打印流转单",
                    showCancelButton: this.inputModelData.system == "空出",
                    cancelButtonClass: "el-button el-button--primary"
                  }
                  )
                    .then(() => {
                      // alert(2)
                      if (type == 1) {
                        this.initDataFunc();
                      } else {
                        // this.assignShow = true;
                        this.mawbguid = results.data.resultguid;
                        this.$refs.fenpei && this.$refs.fenpei.confirmFp(results.data.resultguid)
                      }
                      return;
                    })
                    .catch(action => {
                      if (action == "cancel") {
                        this.peicheBill(results.data);
                      }
                    });
                }


              }
            } else if (results.data.resultstatus == 99) {
              this.$alert(results.data.resultmessage, "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.initDataFunc();
                  return;
                }
              });
            } else {
              this.saveBtnDisabled = false;
              this.$message.error(results.data.resultmessage);
            }
          })
          .catch(error => {
            this.saveBtnDisabled = false;
          });
      },
      peicheBill(data) {
        //派车单
        data.boguid = data.resultguid;
        // data.guid=data.resultguid
        data.area = this.inputModelData.area;
        data.shipaceid = -1;
        var dom = "操作流转单";
        var row = JSON.parse(localStorage.jhAddress).filter(
          i => i.dom == dom && i.area == this.inputModelData.area && i.system == "空出"
        )[0];
        if (row) {
          var str = "";
          var parmjson = row.parmjson.split(",");
          parmjson.forEach(i => {
            str += i + "=" + data[i] + "&";
          });
          str = str.substr(0, str.length - 1); //这是guid
          this.pcdUrl = `${this.$store.state.imgWebApi}ReportManagement?templetename=${row.templetename}&${str}`;
          this.dialogPcd = true;
        } else {
          layer.msg("无数据！");
        }
      },
      assignShowDelete(type) {
        //关闭弹框 1分配 2费用
        if (type == 1) {
          this.assignShow = false;
        } else {
          this.costShow = false;
        }
        this.initDataFunc();
      },
      getSerCodeInfo(code) {
        return (
          this.newService[code].port.replace("服务", "") +
          "-" +
          this.newService[code].title
        );
      },
      goodsHawbChange(val, field) {//根据货物信息改变对应的分运单号，自动带出与删除分运单号，自动配置分运单号中进仓编号
        // if (this.pagetype == 2) return;//修改页面，ybstorelist里面的sid是分单的guid
        let ybstoreListHawbArr = [...new Set(this.inputModelData.ybstoreList.filter(i => i.hawb).map(i => i.hawb))]
        let hawbListHawbArr = [...new Set(this.inputModelData.hawbList.filter(i => i.hawb).map(i => i.hawb))]
        let addhawblist = ybstoreListHawbArr.filter(i => !hawbListHawbArr.includes(i))
        let delhawblist = hawbListHawbArr.filter(i => !ybstoreListHawbArr.includes(i))


         if (delhawblist.length > 0) {//分单中有但是仓库没有该分运单，说明要删除
          delhawblist.forEach(i => {
            this.inputModelData.hawbList.splice(this.inputModelData.hawbList.findIndex(e => e.hawb == i), 1)
          })
          this.$refs.hawbtab.hawblistChecked--
        }

        if (addhawblist.length > 0) {//分单列表不存在所属分运单,要新增分运单
          addhawblist.forEach(i => {
            this.$refs.hawbtab && this.$refs.hawbtab.addHawb({ hawb: i })
          })
        }

        // if(addhawblist.length > 0&&delhawblist.length > 0){//修改
        //   this.inputModelData.hawbList[val.index]['hawb']=val.val
        // }else{
        //   if (addhawblist.length > 0) {//分单列表不存在所属分运单,要新增分运单
        //   addhawblist.forEach(i => {
        //     this.$refs.hawbtab && this.$refs.hawbtab.addHawb({ hawb: i })
        //   })
        // }
        // if (delhawblist.length > 0) {//分单中有但是仓库没有该分运单，说明要删除
        //   delhawblist.forEach(i => {
        //     this.inputModelData.hawbList.splice(this.inputModelData.hawbList.findIndex(e => e.hawb == i), 1)
        //   })
        //   this.$refs.hawbtab.hawblistChecked--
        // }
        // }


        this.inputModelData.hawbList.forEach(i => {
          this.$set(i, 'khjcno', this.inputModelData.ybstoreList.filter(e => e.hawb == i.hawb).map(i => i.khjcno).toString())
        })

      },
      async getMawbdetail() {
        //获取总单详细信息
        await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: {
            boguid: this.boguid,
            isallinfo: true
          },
          loading: true,
          tip: false
        }).then(results => {
          if (!results.data) {
            return this.$message.error("查询错误，无详细信息！");
          }
          console.log("总单详细");
          console.log(JSON.stringify(results.data));
          let data = results.data;
          data.frompage = this.frompage;
          data.serviceList = data.serviceList.filter(i => {
            if (data.opersystem == "国内服务") {
              return i.servicecode != "OA0010" && i.servicecode != "YS0010";
            } else {
              return i.servicecode != "YS0010";
            }
          });
          data.deliverydate = formatDate(data.deliverydate, "yyyy-MM-dd hh:mm");
          data.ddrq = formatDate(data.ddrq, "yyyy-MM-dd");
          data.hbrq = formatDate(data.hbrq, "yyyy-MM-dd");
          data.ysservice = data.ysservice || { company_thr_org: '', khjcno: '', piece: '', weight: '', volume: '', address_thr_org: '', address_thrjson_org: '', lxr_thr_org: '', phone_thr_org: '', pickupdate_org: '', yqfinishdate_org: '', store_thr: '' }//提货信息

          if (this.pagetype == 2 && data.yjqfsj) {
            data.qfsj = formatDate(data.yjqfsj, 'yyyy-MM-dd hh:mm')
          }

          this.pricefieldArr.forEach(i => {
            data[i] = !data[i] || data[i] == 666666 ? "" : String(data[i]);
          });

          if (data.ybstoreList) {
            data.ybstoreList.forEach(i => {//用timestamp标记数据，可以在进仓编号一样的时候找到具体的那条数据
              if (i.sid > 0) {
                i.timestamp = i.sid
              } else {
                i.timestamp = new Date().getTime()
              }
            })
            this.ybstoreListBackup = JSON.parse(JSON.stringify(data.ybstoreList))
          }

        
          Object.keys(data).forEach(i => {
            this.inputModelData[i] = data[i]
          })


          setTimeout(() => {
            this.serviceList = this.inputModelData.serviceList
            this.$refs.houseNumberAdd && this.$refs.houseNumberAdd.initfunc()
          }, 100);
      
          if (this.isoutside) {
            if (this.inputModelData.orderdom == '总单') {
              this.inputModelData.orderdomOut = '总单'
            }
            if (this.inputModelData.orderdom == '直单') {
              this.inputModelData.orderdom = '总单'
              this.inputModelData.orderdomOut = '直单'
            }
            if (this.inputModelData.orderdom == '分单') {
              this.inputModelData.orderdomOut = ''
            }
            this.inputModelData.hawbList = this.inputModelData.axpList;
            this.inputModelData.hawbList.forEach(i => {
              this.$set(i, 'khjcno', i.ybstoreList && i.ybstoreList.map(i => i.khjcno).toString() || '')
              this.$set(i, 'timestamp', i.guid)
            })
            this.hawbListBackup = JSON.parse(JSON.stringify(this.inputModelData.hawbList));
          } else {
            this.getHawbNum()
          }

          //console.log(this.inputModelData.gid)
        });

//console.log(this.inputModelData)
        return this.inputModelData
      },
      async putMawbInfo(type) {//单纯的修改详细信息的接口
        let mawbInfo = this.getInfo();
        if (!mawbInfo) {
          return;
        }
        delete mawbInfo.dzstatus;
        delete mawbInfo.status;
        await this.$axios({
          method: "put",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          data: mawbInfo,
          loading: false,
          tip: true
        }).then(results => {
          console.log(results);
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.getMawbdetail();
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      async getHawbNum() {
        //获取分单号
        if (this.inputModelData.opersystem == '国内服务') return;
        // await this.$axios({
        //   method: "get",
        //   url: this.$store.state.webApi + "api/ExAxpline",
        //   params: {
        //     hpoidHawbGroup: this.inputModelData.guid
        //   },
        //   loading: false,
        //   tip: false
        // }).then(results => {
        //   this.hawbListBackup = JSON.parse(JSON.stringify(results.data));
        //   this.inputModelData.hawbList = results.data;
        // });

        await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExAxpline",
          params: {
            hpoid: this.inputModelData.guid
          },
          loading: false,
          tip: false
        }).then(results => {
          let data = results.data
          data.forEach(i => {
            i.khjcno = i.ybstoreList && i.ybstoreList.map(i => i.khjcno).toString() || '';
            i.timestamp = i.guid
          })

          this.hawbListBackup = JSON.parse(JSON.stringify(data));
          this.inputModelData.hawbList = data
        });

        return this.hawbListBackup;
      },

      /**
       * 重置初使化数据
       */
      async resetInitData() {
        let result = await this.$confirm('确认重置吗', '提示')
        result&&this.initDataFunc()
      }  

    },

    watch: {

      "inputModelData.weight": {
        handler(val) {
          this.inputModelData.jfweight =
            this.inputModelData.volume && val ?
              computedWeight(this.inputModelData.volume, val) :
              val;
          this.inputModelData.accountweightin = val;
        },
        immediate: true
      },
      "inputModelData.volume": {
        handler(val) {
          this.inputModelData.jfweight =
            this.inputModelData.weight && val ?
              computedWeight(val, this.inputModelData.weight) :
              this.inputModelData.weight;
        },
        immediate: true
      },
      "inputModelData.bglx"(val) {
        this.supplementView.bgweight.required = !!val;
      },
      "inputModelData.hbzl": {
        handler(val) {
          if (this.inputModelData.czlx == "自货") {
            ["isinwageallin_trans", "inwageallinprice_trans", "second"].forEach(
              i => {
                this.fareInputViewData[i].hidden = val == "直达";
              }
            );
          } else {
            this.inputModelData.isimperfect = 1//代操作
          }
        },
        immediate: true
      },
      // @@@@此处czlx先前已监听过 此处备注
      // "inputModelData.czlx"(val) {
      //   //console.log(val)
      //   [
      //     "currency",
      //     "inwageallinprice",
      //     "isinwageallin",
      //     "inwageallinprice_trans",
      //     "isinwageallin_trans",
      //     "first",
      //     "second",
      //   ].forEach(i => {
      //     this.fareInputViewData[i].hidden = val == "代操作";
      //   });

      //   this.supplementView.zzg.disabled = val == "自货";


      // },
      
      // done: 唯凯配舱，唯凯代操作
      "newService": {
        handler(val) {
          // 唯凯配舱，唯凯代操作
          let OA0010 = val['OA0010'];
          if (OA0010 && this.pagestep == 2) {
            if (OA0010.model) {
              this.inputModelData.czlx = "自货";
            } else {
              this.inputModelData.czlx = "代操作";
            }
          }
        },
        deep: true,
      },
       //@@@@此处重复监听备注
      // 'inputModelData.gid'(val, oldValue) {
      //   //  if (!val && oldValue) {
      //   //    if(this.inputModelData.fid) {
      //   //       this.inputModelData.gid = oldValue;
      //   //       return;
      //   //    } else {
      //   //       this.inputModelData.gid = '';
      //   //       return;
      //   //    }
      //   // }
      //   let data = getxmdata("wtxmNoname").filter(item => item.id == val);
      //   if (data.length === 1) {
      //     if (!data[0].area.split(',').includes(this.inputModelData.area)) {
      //       this.inputModelData.area = ''
      //     }
      //   }
       
      // }
    },

    mounted() {


    },

    created() {
      let keysArr=Object.keys(this.basicinfoView).concat(Object.keys(this.fareInputViewData)).concat(['isimperfect','customerRelList','cus_real_bp_trans_in','self_real_bp_freight_in']);
      this.$nextTick(() => {

        this.otherInitData();
        //@@@@@inputModelData中存在重复监听情况,一一排除测试,将需要监听字段整合一起
        if (this.pagetype == 1) {//新增页面需要一层层显示具体的内容
          this.$watch(() => {
            return keysArr.map(i=>this.inputModelData[i])
            //return this.inputModelData
          }, () => {
            let val = this.inputModelData;
            this.$nextTick(() => {

              // if (val.system) {
              let arr = ['opersystemdom', 'fid', 'gid', 'creditlevel', 'ispay_pre', 'czlx', 'orderdom', 'ordertype'];
              if (val.system.length == 4) {//国内服务
                arr.forEach(i => {
                  this.basicinfoView[i].hidden = true
                })
              } else {
                arr.forEach(i => {
                  this.basicinfoView[i].hidden = false
                });

                this.basicinfoView.area.hidden = this.basicinfoView.gid.hidden || !val.gid
                this.basicinfoView.opersystem.hidden = this.basicinfoView.area.hidden || !val.area


                this.basicinfoView.opersystemdom.hidden = this.basicinfoView.opersystem.hidden || !val.opersystem
                this.basicinfoView.czlx.hidden = this.basicinfoView.area.hidden || !val.area
                this.basicinfoView.orderdom.hidden = this.basicinfoView.czlx.hidden || !val.czlx
                this.basicinfoView.ordertype.hidden = this.basicinfoView.orderdom.hidden || !val.orderdom
                // this.basicinfoView.ispay_pre.hidden = !val.fid
                this.basicinfoView.ispay_pre.hidden = this.inputModelData.opersystem  != '出口' || !val.fid
              }
              // }

              this.detailShow.ybstoreList = Boolean(!this.goodsinfoRequired && this.inputModelData.hwxz && this.inputModelData.hwlx)
              this.detailShow.fareInputViewData = Boolean(this.detailShow.ybstoreList && this.inputModelData.ybstoreList.filter(i => !i.isadd).length > 0) || (this.inputModelData.isimperfect == 2 && this.detailShow.ybstoreList)
              this.fareInputViewData.yfstdin.hidden = this.fareInputViewData.currency.hidden || !val.currency
              this.fareInputViewData.isinwageallin.hidden = this.fareInputViewData.yfstdin.hidden || !val.yfstdin
              this.fareInputViewData.inwageallinprice.hidden = this.fareInputViewData.isinwageallin.hidden || !val.isinwageallin
              this.fareInputViewData.first.hidden = this.fareInputViewData.isinwageallin.hidden || !val.isinwageallin

              let inwage = this.fareInputViewData.inwageallinprice.hidden || !val.inwageallinprice
              let flag = inwage || (this.inputModelData.self_real_bp_freight_in + this.inputModelData.cus_real_bp_freight_in) != 10

              // note: 运价信息 显示
              this.fareInputViewData.inwageallinclude.hidden = inwage
              this.fareInputViewData.first.hidden = inwage
              this.fareInputViewData.priceabout.hidden = flag
              this.fareInputViewData.isinwageallin_trans.hidden = flag
              this.fareInputViewData.inwageallinprice_trans.hidden = flag
              this.fareInputViewData.second.hidden = flag

              this.detailShow.serviceDetail = (val.opersystem == '出口' && val.czlx == '自货') ? (this.detailShow.fareInputViewData && this.inputModelData.inwageallinprice && !flag) : this.detailShow.fareInputViewData
              // TODO: 原来显示分单
              // this.detailShow.supplementView = this.detailShow.serviceDetail && this.serviceSelArr.length > 0 && this.inputModelData.orderdomOut != '直单'
              this.pointArr[0].show = !!val.isimperfect
              this.pointArr[1].show = !!val.isimperfect
              this.pointArr[2].show = !!val.isimperfect
              // this.pointArr[3].show = this.detailShow.supplementView && this.inputModelData.isimperfect == 1
              // this.nextstepshow = val.system == "国内服务" ? val.system : (val.gid && val.customerRelList.length > 0 && val.ordertype)
              this.nextstepshow = val.system == "国内服务" ? val.system : false
              this.supplementView.mawbAe.idStyle = this.pagetype == 1 ? { width: '560px' } : { width: '100%' }


              let zddshow = this.inputModelData.opersystem == "出口" && this.inputModelData.czlx == '代操作'
              this.supplementView.zddlcode.hidden = !zddshow
              this.supplementView.zddlzh.hidden = !zddshow
              this.supplementView.zdiatacode.hidden = !zddshow
              this.supplementView.mawbAe.hidden = !(this.inputModelData.system == '空出' && this.inputModelData.orderdom != '分单');

              if (this.inputModelData.czlx == '代操作' && this.inputModelData.ordertype == '1') {
                this.goodsinfoView.mawbAe.hidden = false;
                this.goodsinfoView.zddlcode.hidden = false;
                this.goodsinfoView.zddlzh.hidden = false;
                this.goodsinfoView.zdiatacode.hidden = false;

                this.supplementView.mawbAe.hidden = true;
                this.supplementView.zddlcode.hidden = true;
                this.supplementView.zddlzh.hidden = true;
                this.supplementView.zdiatacode.hidden = true;
              } else {
                this.goodsinfoView.mawbAe.hidden = true;
                this.goodsinfoView.zddlcode.hidden = true;
                this.goodsinfoView.zddlzh.hidden = true;
                this.goodsinfoView.zdiatacode.hidden = true;
              }


              if (this.isoutside) {
                ['fid', 'gid', 'ispay_pre', 'ordertype', "creditlevel"].forEach(i => {
                  this.basicinfoView[i].hidden = true
                })

                this.basicinfoView.area.idStyle = { width: '320px' }
                this.basicinfoView.customRelOutside.hidden = this.basicinfoView.area.hidden || !val.area
                this.basicinfoView.orderdom.hidden = this.basicinfoView.czlx.hidden || !val.czlx
                this.basicinfoView.orderdomOut.hidden = this.basicinfoView.orderdom.hidden || !val.orderdom || val.czlx == '代操作'
              }
              console.log(this.basicinfoRequired)
               console.log(this.inputModelData.ordertype)
              this.$nextTick(() => {
                if (this.basicinfoRequired || this.inputModelData.ordertype == 2) {
                  //this.inputModelData.isimperfect = "";
                  this.pagestep = 1;
                  if (this.isoutside) {
                    this.outPagestep = 1;
                  }
                } else {
                  this.fieldsInit();
                  this.pagestep = 2;
                }
              })
            })

          }, { deep: true, immediate: true })
        } else {

          this.getMawbdetail().then(res => {
            console.log(res)
            this.fieldsInit();
            this.pagestep = 2;
            if (this.frompage == 4) {
              this.inputModelData.isimperfect = 1;//订单未完善进去，把类型修改为正式订舱
            }

            if (this.isoutside) {
              ['fid', 'gid', 'ispay_pre', 'ordertype', "creditlevel"].forEach(i => {
                this.basicinfoView[i].hidden = true
              })
              this.basicinfoView.area.idStyle = { width: '320px' }
              this.basicinfoView.customRelOutside.hidden = false
              if (this.inputModelData.orderdom != '分单' || this.inputModelData.czlx == '自货') {
                this.basicinfoView.orderdomOut.hidden = false
              }



            }

            ["fid", 'gid', 'area', 'opersystem', 'opersystemdom', 'orderdom', 'orderdomOut', 'czlx'].forEach(i => {
              this.basicinfoView[i].disabled = true;
            })

            this.basicinfoView.ordertype.hidden = true;
            this.detailShow.ybstoreList = true
            this.detailShow.fareInputViewData = true
            this.detailShow.serviceDetail = true
            this.detailShow.supplementView = true
            this.pointArr[1].show = true
            this.pointArr[2].show = true
            // this.pointArr[3].show = true

            this.supplementView.mawbAe.idStyle = this.pagetype == 1 ? { width: '560px' } : { width: '100%' }

            if (this.inputModelData.system == '国内服务') {
              ['fid', 'gid', 'creditlevel', 'ispay_pre', 'czlx', 'orderdom', 'orderdomOut', 'ordertype'].forEach(i => {
                this.basicinfoView[i].hidden = true
              })
            }

          })

        }




        if (this.pagetype == 1) { // 新增

          this.$watch(() => {
            return this.inputModelData.opersystem + this.inputModelData.opersystemdom
          }, () => {
            this.inputModelData.system = this.inputModelData.opersystem == "国内服务" ? "国内服务" : this.inputModelData.opersystemdom.charAt(0) + this.inputModelData.opersystem.charAt(0);
          }, { immediate: true })

          this.$watch(
            function () {
              return this.inputModelData.fid;
            },
            function (val) {
              if (this.isoutside) return;
              if (val) {
                if (this.pagetype == 1) {
                  this.inputModelData.customerRelList = [];
                }
                this.inputModelData.ispay_pre = 2;
                this.basicinfoView.ispay_pre.disabled = false;
                // this.basicinfoView.creditlevel.hidden = true
                this.inputModelData.creditlevel = '';
                let creditlevelArr = getxmdata('wtkhUseful').filter(i => i.id == val);
                let creditlevel = "";
                if (creditlevelArr.length == 1) {
                  creditlevel = creditlevelArr[0].creditlevel
                }
                this.$axios({
                  method: "get",
                  url: this.$store.state.publicWebApi + "api/PubCredit",
                  params: {
                    fid: val
                  },
                  loading: true,
                  tip: false
                }).then(results => {
                  //resultstatus 100  resultdic.creditlevel=='C 代表c类客户 代表c类客户
                  //  console.log(results);
                  // this.basicinfoView.creditlevel.hidden = false
                  if (results.data.resultstatus == 0) {
                    this.inputModelData.creditlevel = creditlevel + "类"
                    this.basicinfoView.ispay_pre.disabled = creditlevel == 'A'
                    this.gnShow=true
                  } else {
                    this.gnShow=false
                    // if (results.data.resultstatus != 100) {
                    //   this.inputModelData.fid = "";
                    //   this.inputModelData.wtkhname = "";
                    // }
                    // this.$confirm(results.data.resultmessage, "提示", {
                    //   confirmButtonText: "确定",
                    //   showCancelButton: false,
                    //   showClose: false,
                    //   closeOnClickModal: false,
                    //   "close-on-press-escape": false,
                    //   type: "warning"
                    // }).then(() => {
                    this.inputModelData.creditlevel = `${creditlevel}类,${results.data.resultmessage}`
                    // results.data.resultstatus != 100
                    if (results.data.resultstatus == 1) {
                      this.inputModelData.fid = "";
                      this.inputModelData.wtkhname = "";
                      this.fareInputViewData.inwageallinprice.required = false;
                    } else {
                      this.fareInputViewData.inwageallinprice.required = true;

                      if (
                        results.data.resultdic &&
                        results.data.resultdic.creditlevel.toUpperCase() == "C"
                      ) {
                        this.ctype = true;
                        this.inputModelData.ispay_pre = 1;
                        this.basicinfoView.ispay_pre.disabled = true;
                      }
                    }
                    if (results.data.resultmessage.indexOf("临时客户") >= 0) {
                      getxmdata("wtxmNoname").forEach(i => {
                        if (i.usr_name == localStorage.usrname) {
                          this.inputModelData.gid = i.id;
                        }
                      });
                    }
                    // });
                  }
                });



              } else {
                // this.inputModelData.customerRelList = []
              }
            }
          );
          //@@@@@@此处重复监听 gid测试
          this.$watch(
            () => {
              return this.inputModelData.gid
            }, (val) => {
              if (val) {
                let wtxmNoname=getxmdata("wtxmNoname")
                let codes = wtxmNoname.filter(i => i.id == val && i.customxz != 2).map(i => i.system).toString();
                this.disabledSystemOption = JSON.parse(localStorage.groupType).filter(i => i.groupid == 57 && !codes.includes(i.id)&&codes!="-1").map(i => i.typename)//不能选择的运输种类和运输方式

                if (this.inputModelData.opersystem == "国内服务") {
                  if (this.disabledSystemOption.includes(this.inputModelData.opersystem)) {
                    this.inputModelData.opersystemdom = '';
                    this.inputModelData.opersystem = '';
                  }
                } else {
                  if (this.disabledSystemOption.includes(`${this.inputModelData.opersystemdom[0]}${this.inputModelData.opersystem[0]}`)) {
                    this.inputModelData.opersystemdom = '';
                    this.inputModelData.opersystem = '';
                  }
                }
            
               let data = wtxmNoname.filter(item => item.id == val);
              if (data.length === 1) {
                if (!data[0].area.split(',').includes(this.inputModelData.area)) {
                  this.inputModelData.area = ''
                }
              }
            }

            }
          )

          this.$watch(
            () => {
              return this.inputModelData.orderdom
            },
            (val) => {
              if (this.inputModelData.orderdom == "直单") {
                this.inputModelData.englishpm = "";
              } else {
                this.inputModelData.englishpm =
                  this.inputModelData.englishpm || "CONSOLIDATION CARGO AS PER ATTACHED MANIFEST";
              }

              this.inputModelData.ordertype = ''
              if (val != '总单') {
                this.tabsList = [{ title: '补充信息' }]
                this.tabsChecked = 0;
                this.goodsinfoView.hawb.hidden
                this.inputModelData.ordertype = 1
              } else {
                this.tabsList = [{ title: '补充信息' }, { title: '分单信息' }]
              }
              // note: 分运单号
              this.goodsinfoView.hawb.hidden = val != '分单'
              this.basicinfoView.ordertype.disabled = val != '总单'

             
            }
          )

          this.$watch(
            function () {
              return (
                this.inputModelData.czlx +
                this.inputModelData.gid +
                this.inputModelData.mdg
              );
            },
            function () {
              if (this.inputModelData.opersystem == "国内服务") return;
              var json = {
                czlx: this.inputModelData.czlx,
                gid: this.inputModelData.gid,
                mdg: this.inputModelData.mdg,
                area: this.inputModelData.area,
                system: "空出"
              };
              if (
                this.inputModelData.czlx &&
                this.inputModelData.gid &&
                this.inputModelData.mdg
              ) {
                this.$axios({
                  method: "get",
                  url: this.$store.state.publicWebApi + "api/pubcustomfpbl",
                  params: json,
                  loading: false,
                  tip: false
                }).then(results => {
                  if (results.data) {
                    this.inputModelData.self_real_bp_freight_in =
                      results.data.xyfp1_in;
                    this.inputModelData.cus_real_bp_freight_in =
                      results.data.xyfp2_in;
                    this.inputModelData.self_real_bp_trans_in = results.data.xyfz1_in;
                    this.inputModelData.cus_real_bp_trans_in = results.data.xyfz2_in;
                  } else {
                    this.inputModelData.self_real_bp_freight_in = 10;
                    this.inputModelData.cus_real_bp_freight_in = 0;
                    this.inputModelData.self_real_bp_trans_in = 10;
                    this.inputModelData.cus_real_bp_trans_in = 0;
                  }
                });
              }
            }
          );

        }

        this.watchYsService();//监听延伸服务数据，动态设置内容


        this.$watch(
          function () {
            return (
              this.inputModelData.sfg +
              this.inputModelData.hbrq +
              this.inputModelData.hbh
            );
          },
          function () {
            if (this.inputModelData.opersystem == "国内服务") return;
            if (
              this.inputModelData.hbh &&
              this.inputModelData.hbh.length >= 2 &&
              this.inputModelData.mawb &&
              this.aircomcode &&
              this.aircomcode.indexOf(
                this.inputModelData.hbh.substr(0, 2).toUpperCase()
              ) < 0
            ) {
              if (this.inputModelData.area == this.conditionalAreaForBuild) {
                this.inputModelData.hbh = "";
              }
              this.$message.error("航班号与运单号不匹配！");
              return;
            }
          }
        );

        this.$watch(
          function () {
            return (
              this.inputModelData.mawb +
              this.inputModelData.gid +
              this.inputModelData.czlx +
              this.inputModelData.mdg +
              this.inputModelData.sfg + this.inputModelData.orderdom
            );
          },
          function () {
            if (
              this.inputModelData.opersystem == "出口" &&
              this.inputModelData.mawb &&
              this.inputModelData.mawb.length == 12 &&
              this.inputModelData.gid &&
              this.inputModelData.czlx &&
              this.inputModelData.mdg &&
              this.inputModelData.sfg
            ) {
              this.getMawbGys();
            }
            this.$nextTick(() => {
              if (this.newService.OA0010) {
                this.newService.OA0010.model = this.inputModelData.czlx == '自货'
                // done: 唯凯配舱，唯凯代操作不禁用
                // this.newService.OA0010.disabled = this.inputModelData.opersystem != '国内服务'
              }

            })

          }
        );



        this.$watch(() => {
          return this.inputModelData.ybstoreList
        }, (val) => {
          this.inputModelData.goodsybpiece = val.reduce((a, b) => { return a += Number(b.piece) }, 0);
          // this.inputModelData.goodssmallpiece = val.reduce((a, b) => { return a += Number(b.smallpiece) }, 0);
          this.inputModelData.goodsybweight = val.reduce((a, b) => { return a += Number(b.weight) }, 0);
          this.inputModelData.goodsybvolume = (val.reduce((a, b) => { return a += Number(b.volume) }, 0)).toFixed(3);
          if (Number(this.inputModelData.goodsybpiece) || Number(this.inputModelData.goodsybweight) || Number(this.inputModelData.goodsybvolume)) {
            this.goodsinfoView.goodsybweight.hidden = false
            this.goodsinfoView.goodsybpiece.hidden = false
            this.goodsinfoView.goodsybvolume.hidden = false
            // this.goodsinfoView.ybvolume.occupyRestSpace = false
            this.goodsinfoView.ybpiece.itemStyle = { width: '200px', 'margin-right': '6px' }
            this.goodsinfoView.ybweight.itemStyle = { width: '200px', 'margin-right': '6px' }
            this.goodsinfoView.ybvolume.itemStyle = { width: '200px', 'margin-right': '6px' }

          } else {
            this.goodsinfoView.goodsybweight.hidden = true
            this.goodsinfoView.goodsybpiece.hidden = true
            this.goodsinfoView.goodsybvolume.hidden = true
            // this.goodsinfoView.ybvolume.occupyRestSpace = true
            this.goodsinfoView.ybpiece.itemStyle = {}
            this.goodsinfoView.ybweight.itemStyle = {}
            this.goodsinfoView.ybvolume.itemStyle = {}
          }
          this.thViewData.khjcno.options = this.inputModelData && this.inputModelData.ybstoreList.filter(i => i.khjcno).map(i => { return { label: i.khjcno, value: i.khjcno } })

          // TODO: 入库
          if(this.newService&&this.newService.AA0410){
            this.newService.AA0410.model=val.filter(i=>i.storeType=='入库'||i.storeType=='晚入库').length>0
            this.newService.AA0410.disabled=val.filter(i=>i.storeType=='入库'||i.storeType=='晚入库').length>0
          }
        }, { deep: true })


        this.$watch(() => {
          return this.serviceSelArr
        }, (val) => {
          if (this.inputModelData.opersystem == "国内服务") {
            this.gnFieldDisplay();
          } else {
            if (!this.basicinfoView.ordertype.hidden) {
              // TODO: 原来显示分单
              // this.detailShow.supplementView = true
              this.pointArr[1].show = this.detailShow.fareInputViewData
              this.pointArr[2].show = this.detailShow.fareInputViewData
              // this.pointArr[3].show = this.detailShow.fareInputViewData
            }
          }
        }, { deep: true })

        this.$watch(() => {
          return this.inputModelData.ysservice && this.inputModelData.ysservice.khjcno
        }, (val) => {
          if (this.inputModelData.ysservice) {
            let piece = 0, weight = 0, volume = 0;
            if (val && val.split(',').length > 0) {
              this.inputModelData.ybstoreList && this.inputModelData.ybstoreList.forEach(i => {
                if (val.split(',').includes(i.khjcno)) {
                  piece += Number(i.piece);
                  weight += Number(i.weight);
                  volume += Number(i.volume);
                }
              })
            }
            this.inputModelData.ysservice.piece = piece
            this.inputModelData.ysservice.weight = Number(weight).toFixed(2)
            this.inputModelData.ysservice.volume = Number(volume).toFixed(3)
          }

        })

        this.$watch(() => {
          return this.inputModelData.area
        }, (val) => {
          //console.log(121212)
          if (this.isoutside) {
            this.areaChange(val)
          }
          if (this.inputModelData.area) {
            //console.log(this.pagetype)
            if (this.pagetype == 1) {
              JSON.parse(localStorage.groupType).forEach(i => {
                if (i.groupid == 53 && i.typename == this.inputModelData.area) {
                  if (this.inputModelData.opersystem == "进口") {
                    this.inputModelData.mdg = i.ready06;
                  } else {
                    // this.inputModelData.qsd = i.ready06;
                    this.inputModelData.sfg = i.ready06;
                  }
                }
              });

              if (this.inputModelData.area == "市场部" || this.inputModelData.area == "海外部") {
                this.inputModelData.sfg = "";
              }

              if (
                this.inputModelData.opersystem == "进口" &&
                (this.inputModelData.area == "市场部" || this.inputModelData.area == "海外部")
              ) {
                this.inputModelData.mdg = "";
              }

              if (this.inputModelData.opersystem == '国内服务') {
                this.inputModelData.opersystemdom = ''
              }
            }
          }

        },{immediate: true})

        // this.$watch(
        //   function () {
        //     return (
        //       this.inputModelData.ybvolume + this.inputModelData.ybweight
        //     );
        //   },
        //   function (newVal, oldVal) {
        //     let volume = this.inputModelData.ybvolume;
        //     let weight = this.inputModelData.ybweight;
        //     this.inputModelData.jfWeight = computedWeight(volume, weight);
        //     // let bubble = JudgeBubblesFunc(weight, volume) < 0;//只有泡货，显示分泡
        //   }, { immediate: true }
        // );

        this.$watch(
          () => { 
            return  this.isHawbShow
          },
          (val) => {
              this.detailShow.supplementView = val;
              if (val) {
               this.goodsinfoTabs = [
                  { title: '订舱信息（必填）' },
                  { title: '补充信息（选填）' },
                  { title: '总单收发货人信息（选填）' },
                  { title: '分单信息（选填）' },
                ]
              } else {
                  this.goodsinfoTabs = [
                  { title: '订舱信息（必填）' },
                  { title: '补充信息（选填）' },
                  { title: '总单收发货人信息（选填）' },
                ]
              }

               if( this.inputModelData.orderdom === '分单') {
                this.goodsinfoTabs = [
                  { title: '订舱信息（必填）' },
                  { title: '补充信息（选填）' },
                  { title: '分单信息（选填）' },
                ]
              } 
            
          }, { immediate: true }
        )
        
         // note: 分运单号 订舱操作 == 唯凯配舱 && 订单类型 == 分单（直客委托) 需要填写分运单号
        this.$watch(
          () => this.inputModelData.czlx + this.inputModelData.orderdom,
          (val) => {  
              if (val === '自货分单') {
               this.goodsinfoView.hawb.required = true;
              } else {
              this.goodsinfoView.hawb.required = false;
              }
          },
          {
            immediate: true,
          }
        )


        // note:  外网->订舱类型->唯凯代操作->订单类型->可以点击
        this.$watch(
          () => this.inputModelData.czlx,
          (val) => {
            if (this.isoutside) {
              if (val == '代操作') {
                this.basicinfoView.orderdom.disabled = false;
              } else {
                this.basicinfoView.orderdom.disabled = true;
              }
            }else{//@@@此处测试 czlx
                [
                  "currency",
                  "inwageallinprice",
                  "isinwageallin",
                  "inwageallinprice_trans",
                  "isinwageallin_trans",
                  "first",
                  "second",
                ].forEach(i => {
                  this.fareInputViewData[i].hidden = val == "代操作";
                });

                this.supplementView.zzg.disabled = val == "自货";
            }
            
          }
        )
        
      })
    },

    beforeUpdate() {
      // 根据gid查出所选项目 && comxz == 1是客户，2是供应商 && 最小结算单位
      let data = getxmdata("wtxmNoname").filter(item => item.id == this.inputModelData.gid && item.comxz == 1 && item.customxz != 2);
      if (data.length === 1) {
          // 如果选了地址且选的地址不包括在项目的地区里->提示，无没选择，并清空
          if (this.inputModelData.area&&!data[0].area.split(',').includes(this.inputModelData.area)&&data[0].area!='-1') {
              this.$message.error(`该项目没有${this.inputModelData.area}站点权限！`)
              this.inputModelData.area = "";
          }
      }
            
    },

    computed: {
      isoutside() {//是否是外网系统使用
        return sessionStorage.system == 'outside'
      },
      serviceTabsStyle() {
        return this.serviceTabsList.map((i, k) => {
          if (k == this.serviceTabsChecked) {
            return {
              'min-width': '70px',
              'background-color': 'rgba(255,0,0,1)',
            }
          } else {
            return {
              'min-width': '70px',
              'background-color': 'rgba(255,0,0,0.4)',
              color: '#fff'
            }
          }
        })
      },
      getAddman() {
        return localStorage.usrname;
      },
      localArea() {
        let area = this.inputModelData.area || this.$store.state.areaState;
        this.fareInputViewData.inwageallinprice.required =
          area != this.conditionalAreaForBuild;
        return area
      },
      areaStateCode() {
        let area = JSON.parse(localStorage.cityCode);
        return (area.find(i => i.label == this.localArea) || {}).value;
      },
      serviceSelArr() {//选中的服务
        let arr = [];
        this.serviceTabsList = []
        for (let i in this.newService) {
          if (this.newService[i].model) {
            let code = this.newService[i].servicecode
            arr.push(code);
            if (this.gnSeviceContent.includes(code)) {
              this.serviceTabsList.push({ title: this.newService[i].title, code })
            }
          }
        }
        return arr;
      },
      serviceList: {//服务数据
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
              if(this.newService[item.servicecode].disabled==false){
                this.newService[item.servicecode].model =
                item.servicecode == 'OA0010' ? this.inputModelData.system != '国内服务' && this.inputModelData.czlx == '自货' : item.isdel == 1;
                 this.newService[item.servicecode].oprequest = item.oprequest;
              }
            }
          });
        }
      },
      information() {//如果直接将在页面上写 serviceList.filter(i => i.isdel == 1)，将导致滚动页面也会触发feipei组件中的watch，导致重复执行初始化方法
        return this.serviceList.filter(i => i.isdel == 1)
      },
      // statusArr() {
      //   var arr = [];
      //   if (this.inputModelData.hawbList) {
      //     this.inputModelData.hawbList.forEach(element => {
      //       if (element.khjcno) {
      //         arr = arr.concat(element.khjcno.split(","));
      //       }
      //     });
      //   }

      //   return arr;
      // },
      // lxrss2RelData() {
      //   return this.inputModelData.customerRelList.filter(i => i.lxrss === 2);
      // },
      gooodsOutgauge() {
        //进仓编号中的货物是否超规，当进仓编号中，单件重量过2吨 或 宽超过160 或 高超过185 则显示超规
        // return this.inputModelData.ybstoreList.filter(i => {
        //   return i.weight >= 2000 || (i.ybstorevolumeList.filter(e => e.widths >= 160 || e.heights >= 185)).length
        // }).length > 0
        return this.inputModelData.ybstoreList && this.inputModelData.ybstoreList.filter(i => i.khjcno && i.isstorelimit == 1).length > 0
      },

      // done:是否为订仓信息 goodsinfoTabsChecked == 0 为订仓信息
      isBookingInformation() {
        return this.goodsinfoTabsChecked == 0;
      },

      isHawbShow() {
        // done: 订舱操作->唯凯配舱->总单
        // done: 订舱操作->唯凯代操作->总分单 显示
        return (this.serviceSelArr.length > 0 && this.inputModelData.orderdomOut != '直单' && this.inputModelData.orderdom != '分单') || (!this.serviceSelArr.length && this.inputModelData.orderdom == '总单')
      }
      
    },

    destroyed() { }
  };
</script>

<style scoped lang="less">
  @import '../outsideDom/smallTemplate/small.less'; //必须加;号


  .mawbAddNew {
    max-width: 1440px;

    /deep/ .detail {
      position: relative;
      margin: 20px 0px;
      border: 1px solid #e8e8e8;

      &:last-child {
        margin-bottom: 0;
      }

      >.detail-title {
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
        justify-content: flex-start;
      }

      .detail-c {
        padding: 20px;

        .mawb-import {
          //  position: absolute;
          // top: 4px;
          //  right: 5px;
          margin-left: 5px;
        }
      }
    }

    .basic-information {
      /deep/ .el-date-editor.el-input {
        width: 100%;
      }

      /deep/ .el-input__icon {
        line-height: 28px;
      }
    }

    /deep/ .contentCmpt .input-item {
      margin: 6px 0px;
    }

    /deep/ .contentCmpt .input-title {
      padding-right: 10px
    }
  }

  .footer {
    overflow: hidden;
    margin-top: 25px;
    margin-bottom: 40px;

    .left-btn {
      float: left;
    }

    .right-btn {
      float: right;
    }
  }

  .totalgoods {
    margin-left: 30px;
    color: #787878;

    >span {
      margin: 0 8px;

      >em {
        color: red;
        font-style: normal;
        margin: 0 3px;
      }
    }
  }

  .pointDiv {
    position: sticky;
    bottom: 60px;
    display: grid;
    float: right;
    width: 110px;
    transform: translateX(116px);

    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    span {
      display: inline-block;
      padding: 4px 16px;
      margin-bottom: 6px;
      border-radius: 26px;
      background-color: #F8F8F8;

      a {
        color: #D6D6D6;
      }

      i {
        background-color: #D6D6D6;
      }
    }

    span.pointChecked {
      background-color: #0F5A8C;

      a {
        color: #fff;
      }

      i {
        background-color: #fff;
      }
    }
  }

  /* 外网需要的样式 */
  .clause {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;

    .clause-shadow {
      width: 100%;
      height: 100%;
      background: #000000;
      opacity: 0.4;
      position: absolute;
    }

    .clause-content {
      position: absolute;
      width: 1100px;
      max-height: 850px;
      overflow: hidden scroll;
      background: #FFFFFF;
      border-radius: 8px;
      opacity: 1;
      padding: 40px;

      h2 {
        font-size: 18px;
        color: #222933;
        text-align: center;
        margin-bottom: 24px;
      }

      h3 {
        margin-top: 20px;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #7A8189;
        line-height: 26px;
        letter-spacing: 1px;
        text-indent: 30px;

        strong {
          font-weight: bold;
          color: #000;
        }

      }

      i {
        font-size: 22px;
        position: absolute;
        right: 15px;
        cursor: pointer;
        top: 20px
      }
    }
  }


  .elSteps {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      display: grid;
      place-items: center;
      row-gap: 8px;

      p {
        height: 20px;
      }
    }

    i {
      font-size: 48px;
    }

    span {
      display: inline-block;
      width: 86px;
      height: 2px;
      background-color: #DADEE3;
      margin: 16px;
    }

    .checked {

      i,
      p {
        color: #14A207;
      }

      span {
        background: transparent linear-gradient(270deg, #6D7D95 0%, #14A207 100%) 0% 0% no-repeat padding-box;
      }
    }

  }

  .textrequirement {
    width: 440px;
    background-color: #FDEDD9;
    border: 1px solid #FDEDD9;
    border-radius: 8px;
    margin-left: calc(50% - 220px);
    margin-top: 20px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    padding: 10px 0;

    i {
      font-size: 68px;
      color: #F7892A;
      margin-left: 12px;
    }

    >div {
      p {
        margin: 10px;
        color: #F7892A;
      }
    }


  }
</style>