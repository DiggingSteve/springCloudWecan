<template>
  <div class="login"
    :style="login_success&&iswecan ? { background: 'url(./boStatic/images/login/login_bg_repeat.png) repeat' } : {}">

    <div class="left-c">
      <div class="wecan_logo"
        :style="`background: url(./boStatic/images/login/${iswecan?'wecan':'hengfeng'}_logo.png) no-repeat;`"></div>

      <div
        style="width:140px;height:160px;border:1px solid #e8e8e8;background:#fff;text-align:center;padding:14px;margin:30px auto 0"
        v-if="iswecan">
        <img src="../boStatic/images/appewm.png" height="112" width="112" style="margin-bottom:2px;">
        <span style="color:#222;font-size:12px;">唯凯ERP-APP下载</span>
      </div>
    </div>

    <div class="user-operation" v-if="login_success">
      <div class="operate-list">
        <template v-if="iswecan">
          <span @click="openLink('http://www.wecanintl.com')">唯凯官网</span>
          <span v-show="iswecan" @click="openLink('peixun')">培训系统</span>
          <!-- <span @click="openLink('http://erp.wecanintl.com/wffcustomoutsidenew')">外网查货</span> -->
          <span @click="openLink('http://oa.wecanintl.com:8089')">行政管理(OA)</span>
          <!-- <span  @click="openLink('http://oa.wecanintl.com:8089')">人事系统</span> -->
          <span @click="openLink('http://air.intl-paperless.com/wff')">Paperless平台</span>
          <span @click="openSelfCheck">考勤系统</span></span>
        </template>
        <!-- <span v-if="!iswecan" @click="openLink('http://erp.hfl-logistics.com')">恒丰官网</span> -->
        <span v-if="!iswecan" @click="openLink('http://www.hfl-logistics.com')">外网查货</span>

        <!--  <span>修改密码</span> -->
        <!-- <span @click="logout">切换用户</span> -->
        <span @click="logout">退出登录</span>
      </div>
    </div>

    <div class="right-c">
      <div class="login-c" v-if="!login_success" style="background: url(./boStatic/images/login/login_bg.png) round;">
        <div class="login-box">
          <h1 class="login-title">唯凯信息管理系统</h1>
          <div class="btn-c">

            <el-select v-model="system" placeholder="请选择" style="margin:15px 0" v-if="systemSelectShow">
              <el-option v-for="item in systemOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

            <el-input v-model="user" :placeholder="iswecan?'请输入用户名/公司邮箱号/手机号':'请输入用户名'"
              :class="{'input-required': !user_input_status}" style="margin-bottom:20px;"></el-input>

            <el-input v-model="passwd" placeholder="请输入密码" :class="{'input-required': !passwd_input_status}"
              type="password"></el-input>
            <span style="float:right;margin-top:8px;color:#0f5a8c;margin-bottom:8px;cursor:pointer"
              @click="forgetCodeShow=true">忘记密码?</span>
          </div>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </div>
      <!-- {{systemArray}} -->
      <div class="system-c" v-if="login_success">
        <div class="login-info">
          <p class="user">欢迎,{{realarea}}{{depart}}</p>
          <p class="user">{{ user }}</p>
          <p class="login-time">登录时间：{{ login_time }}</p>
          <p class="bookVersion">
            <el-badge is-dot class="item" v-if="this.newLength>0">
              <span @click="panelShow('1')" title="更新日志" class="version">

              </span>
            </el-badge>

            <span v-if="this.newLength==0" @click="panelShow('1')" title="更新日志" class="version">

            </span>




            <!-- <a href="boStatic/唯凯操作手册.docx">

       </a> -->
            <!--      <el-dropdown trigger="click" title="操作手册" @click.native="panelShow('2')">
      <span class="el-dropdown-link operationBook">

      </span>
    </el-dropdown> -->
            <!--   <span @click="panelShow('2')" title="操作手册" class="operationBook"></span> -->


            <!-- {{systemArray}}
 -->
          </p>
          <!-- <div style="position:relative;" >
 <el-badge is-dot class="item"><img src="../boStatic/images/app.png" style="margin-top:12px;cursor:pointer;" @mouseover="erweima=true" @mouseout="erweima=false"></el-badge>

 <p style="background:url(./boStatic/images/tootip.png) no-repeat;position:absolute;left:30px;height:20px;width:130px;top:6px;text-align:center;line-height:20px;" class="tooltip" v-if="appShow">
   YesWecan上线啦!
 </p>

 <div style="width:140px;height:160px;border:1px solid #e8e8e8;position:absolute;left:-14px;top:-36px;background:#fff;text-align:center;padding:14px;" v-if="erweima">
   <img src="../boStatic/images/appewm.png" height="112" width="112" style="margin-bottom:2px;">
   <span style="color:#222;">扫描二维码下载</span>
 </div>

</div> -->
        </div>

        <div class="system-box" :class="{disabled:isapprovered}">

          <div class="sys-item" v-for="(system, systemIndex) in system_list" :key="systemIndex"
            :style="{background: `url(${system.bg}) no-repeat`}" @click="openDialog(system.dialog)"
            v-if="!system.hidden">
            <div class="mask" :style="{background:iswecan?'#124c82':'#c52026'}"></div>
            <div class="content-c">

              <h2 class="sys-title">{{ system.title }}</h2>

              <p class="line"></p>

              <span class="more" v-if="system.more">
                点击查看详细
              </span>

              <div class="sub-sys" v-else>
                <template v-for="(sub_sys, index) in system.sub" v-if="!sub_sys.hidden">
                  <div class="sub-sys-title" :key="index" v-if="sub_sys.sub_title">
                    <p>{{ sub_sys.sub_title }}</p>
                  </div>

                  <div :class="['sub-sys-item', {'empty': Object.keys(sub_sys).length == 0}]" :key="index" v-else>
                    <template v-if="Object.keys(sub_sys).length != 0">
                      <span :class="{'hashref': sub_sys.href || sub_sys.dialog}" :id="sub_sys.system_name"
                        @click.prevent="spanOpen(sub_sys)">
                        <p>{{ sub_sys.system_name }}</p>
                      </span>
                    </template>
                    <template v-else>
                      <a></a>
                    </template>
                  </div>
                </template>
              </div>

            </div>

            <i :style="{background: `url(${system.icon}) no-repeat center`}" class="icon"></i>
          </div>

        </div>
      </div>
    </div>

    <el-dialog :modal-append-to-body="false" :visible.sync="wffsettlementVisible" v-if="wffsettlementVisible"
      :show-close="false" custom-class="wffsettlement" top="175px" width="950px">

      <div class="orderSystem-c">
        <h3>请选择区域</h3>
        <div class="area-location" v-for="(areaArr, key, index) in groupTypeArea" :key="index">
          <p class="location-title">{{ key }}</p>
          <div class="btn" v-for="(area, index) in areaArr" :key="index">
            <span @click="openWffsettlement(area)">{{ area.typename }}</span>
          </div>
        </div>
      </div>

    </el-dialog>

    <el-dialog :modal-append-to-body="false" :visible.sync="orderSystemVisible" v-if="orderSystemVisible"
      :show-close="false" custom-class="orderSystemDialog" top="175px" width="1100px">

      <div class="orderSystem-c">
        <template v-for="(service, serviceTitle, index) in orderSystem_list">
          <div class="top" :key="index" v-if="serviceTitle == '运输业务'">
            <h3>{{ serviceTitle }}</h3>
            <div class="item-c">

              <div class="item" v-for="(item, index) in service" :key="index">
                <span class="icon" :style="{background: `url(${item.icon}) no-repeat center`}"></span>

                <div class="btn" v-for="(btn_item, index) in item.item" :key="index">
                  <a @click="windowOpen(btn_item)" target="_blank" :class="{'hashref': btn_item.href}"
                    @mouseover="btn_item.hover = true" @mouseout="btn_item.hover = false">
                    <span>{{ (!btn_item.href && btn_item.hover) ? '开发中' : btn_item.name }}</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          <div class="bottom" :key="index" v-else>
            <h3>{{ serviceTitle }} </h3>
            <div class="item-c">

              <div class="item" v-for="(item, index) in service" :key="index">
                <!-- <a :href="transUrl(item)" target="_blank" :class="{'hashref': item.href}" @mouseover="ahover(true, item)" @mouseout="ahover(false, item)"> -->
                <a @click="windowOpen(item)" target="_blank" :class="{'hashref': item.href}"
                  @mouseover="ahover(true, item)" @mouseout="ahover(false, item)">
                  <span class="icon" :style="{background: `url(${item.icon}) no-repeat center`}"></span>
                  <p>{{ item.name }}</p>
                </a>
              </div>

            </div>
          </div>
        </template>
      </div>

    </el-dialog>

    <el-dialog :modal-append-to-body="false" :visible.sync="operationSyatemVisible" v-if="operationSyatemVisible"
      :show-close="false" custom-class="operationSyatemDialog" top="175px" width="1200px">

      <div class="operationSyatem-c">
        <h3>上海操作</h3>
        <div class="item-c">

          <div class="item" v-for="(item, index) in operationSyatem_list" :key="index">
            <span class="icon" :style="{background: `url(${item.icon}) no-repeat center`}"></span>
            <p>{{ item.title }}</p>

            <div class="btn" v-for="(btn_item, index) in item.item" :key="index">
              <!-- <a :href="transUrl(btn_item)" target="_blank" :class="{'hashref': btn_item.href}" @mouseover="btn_item.hover = true" @mouseout="btn_item.hover = false"> -->
              <a @click="windowOpen(btn_item)" target="_blank" :class="{'hashref': btn_item.href}"
                @mouseover="btn_item.hover = true" @mouseout="btn_item.hover = false">
                <span>{{ (!btn_item.href && btn_item.hover) ? '开发中' : btn_item.name }}</span>
              </a>
            </div>

          </div>

        </div>
      </div>

    </el-dialog>



    <el-dialog :modal-append-to-body="false" @close="clearForget" :visible.sync="forgetCodeShow" v-if="forgetCodeShow"
      top="175px" width="400px" center class="forgetCodeShow" :close-on-click-modal="false">

      <el-input placeholder="请输入用户名/公司邮箱号/手机号" v-model="forgetCodeInfo.logname" style="width:300px;margin-left:25px;"
        class="forgetCodeUser">
        <template slot="prepend"><i slot="prefix" class="el-input__icon icon-user"
            style="margin-top:10px;text-align:center;"></i></template>
      </el-input>

      <el-input placeholder="请输入手机验证码" v-model="forgetCodeInfo.smscode"
        style="width:200px;margin-left:25px;margin-top:20px;" class="forgetCodeSm">
        <template slot="prepend"><i slot="prefix" class="el-input__icon icon-yzm"
            style="margin-top:10px;text-align:center;"></i></template>

      </el-input>
      <el-button :style="{'width':'98px','height':'40px','padding-left':countdown!=0?'10px':'14px'}" @click="getYanz"
        :disabled="countdown>0">
        <span v-if="countdown==0">获取验证码</span>
        <span v-else>重新获取({{countdown}})</span>

      </el-button>

      <el-input placeholder="请重新输入密码" v-model="forgetCodeInfo.pwd" style="width:300px;margin-left:25px;margin-top:20px;"
        class="forgetCodepwd" type="password">
        <template slot="prepend"><i slot="prefix" class="el-input__icon icon-mm"
            style="margin-top:10px;text-align:center;"></i></template>

      </el-input>

      <!--  {{forgetCodeInfo.pwd}} -->
      <p style="text-align:center;margin-top:20px;height:32px;">
        <el-button type="primary" @click="confirmCode">确定</el-button>
      </p>
    </el-dialog>


    <!-- 推送版本具体信息 -->
    <el-dialog width="1350px" top="4%" height="800px" center :visible.sync="messagePanelShow" v-if="messagePanelShow"
      :close-on-click-modal="false" class="messagePanel" :modal-append-to-body="false"
      @close="versionActiveIndex=-1;resultUpdate=resultUpdateBackup;resultUpdateOperation=resultUpdateOperationBackup;versionDateBegin='';versionDateEnd='';systemValue=[]">
      <div class="messagePanelContainer" v-if="messagePanelShow">
        <div class="leftList">
          <ul>
            <li :class="[mark==1?'active':'']" style="display: flex;justify-content: space-between;">
              <span style="margin-left:12px;" @click="mark='1'">更新日志</span>
              <!--   <span style="float:left;margin-left:12px;" v-if="mark==2">操作手册</span> -->
              <span style="display: grid;place-items: center;grid-auto-flow: column;">
                <span
                  style="display:inline-flex;align-items:center;justify-content:center; width:32px;height:20px;background:#f56c6c;color:#fff;text-align:center;border-radius:18px;font-size:13px;"
                  v-if="newLength>0">{{newLength}}</span>

                <i class="el-icon-arrow-right" style=""></i>
              </span>

            </li>
            <li :class="[mark==2?'active':'']">
              <span style="float:left;margin-left:12px;" @click="mark='2'">操作手册</span>
              <span style="float:right">
                <span
                  style="display:inline-block;width:18px;height:18px;text-align:center;line-height:18px;;font-size:13px;"></span>
                <i class="el-icon-arrow-right" style=""></i>
              </span>
            </li>
          </ul>
        </div>
        <div class="rightList">

          <div class="rightListHead">
            <i class="el-icon-arrow-left" v-if="versionActiveIndex!=-1"
              style="margin-left:10px;cursor:pointer;font-size:22px;margin-top:20px;"
              @click="versionActiveIndex=-1"></i>
            <!--   <i  class="el-input__icon el-icon-search" style="float:right;position:relative;z-index:999;margin-left:-27px;margin-right:60px;cursor:pointer" v-if="versionActiveIndex==-1"></i> -->
            <!-- 系统筛选 -->
            <el-select v-model="systemValue" multiple placeholder="请选择系统" clearable
              style="width:210px;float:right;border-radius:28px;margin-right:60px;" v-if="versionActiveIndex==-1"
              @visible-change="modelHeight" @change="searchFilter">
              <li class="el-select-dropdown__item modelHeight" @click="selmultiAll()">
                <span>全选</span>
              </li>
              <el-option-group v-for="group in systemArray" :key="group.value" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                  style="width:204px;">
                </el-option>
              </el-option-group>
            </el-select>

            <!-- 时间筛选 -->
            <!--    <div style="border:1px solid #dcdfe6;height:34px;line-height:30px;width:420px;float:right;margin-top:12px;border-radius:28px;border-left:none;" v-if="versionActiveIndex==-1">
       <el-date-picker
                          v-model="versionDateBegin"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"

                          placeholder="开始日期"

                          class="rangeDate"

                          clearable
                          style="border-left:1px solid #dcdfe6;border-radius:28px;padding-left:10px;width:180px;"
                          @input="searchFilter"
                          >
                        </el-date-picker>
               <span style="color:#666;padding-top:3px;">至</span>
               <el-date-picker
                          v-model="versionDateEnd"
                           type="datetime"
                           value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="结束日期"

                          class="rangeDate"
                          style="width:180px;"
                          @input="searchFilter"
                            clearable
                          >
                        </el-date-picker>
   </div>
 -->

          </div>

          <div class="rightListArray" v-if="versionActiveIndex==-1">
            <ul>

              <li v-for="(item,index) in resultUpdate" v-if="mark==1">
                <el-row>
                  <el-col :span="9" style="color:#0E5A8C;font-size:16px;font-weight:bold">

                    <span v-if="!item.isread"></span>
                    {{item.title}}

                  </el-col>

                  <el-col :span="7" style="color:#989898">
                    更新日期:{{item.timestamp}}
                  </el-col>

                  <el-col :span="4" style="color:#989898">
                    版本号:{{item.version}}
                  </el-col>

                  <el-col :span="4" style="text-align:right;color:#0E5A8C;cursor:pointer;">
                    <p @click="versionActiveIndexF(index)">查看详情</p>
                  </el-col>
                </el-row>
              </li>

              <!-- 操作手册 -->
              <li v-for="(item,index) in resultUpdateOperation" v-if="mark==2">
                <el-row>
                  <el-col :span="9" style="color:#0E5A8C;font-size:16px;font-weight:bold">

                    <!-- <span v-if="!item.isread"></span> -->
                    {{item.title}}

                  </el-col>

                  <el-col :span="7" style="color:#989898">
                    更新日期:{{item.timestamp}}
                  </el-col>

                  <el-col :span="4" style="color:#989898">
                    版本号:{{item.version}}
                  </el-col>

                  <el-col :span="4" style="text-align:right;color:#0E5A8C;">
                    <a :href="item.contenturl" style="color:#0E5A8C;cursor:pointer;">
                      <p>下载</p>
                    </a>
                  </el-col>
                </el-row>
              </li>

            </ul>
          </div>

          <div class="rightListContent" v-if="versionActiveIndex!=-1">
            <p>{{resultUpdate[versionActiveIndex].title}}</p>
            <p style="color:#989898;font-weight:normal;letter-spacing:0.1em;margin-top:8px;">
              <span style="font-size:14px;">更新时间:{{resultUpdate[versionActiveIndex].timestamp}}</span>
              <span style="margin-left:60px;font-size:14px;">版本号:{{resultUpdate[versionActiveIndex].version}}</span>
            </p>
            <iframe :src="iframeurl" frameborder="0" allowtransparency="true"
              style="width: 100%; height:600px; border: 0px none;" class="iframeScroll"></iframe>
          </div>

        </div>

      </div>
      <!--  <i class="el-icon-arrow-left" style="font-size:28px;position:absolute;left:20px;top:45%;z-index:99;cursor:pointer" title="查看上版本信息" @click="prenextUpdate('-1')"></i>
  <i class="el-icon-arrow-right" style="font-size:28px;position:absolute;right:20px;top:45%;z-index:99;cursor:pointer" title="查看下版本信息" @click="prenextUpdate('1')"></i>
  <iframe :src="iframeurl" frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;" v-if="iframeShow" class="iframeScroll"></iframe> -->
    </el-dialog>

    <a id="opentabs" target="_blank"></a>
  </div>
</template>

<script>
import{queueKey,SystemMessage} from './store/systemMessage';
window.queueObj=new SystemMessage();
  export default {
    data() {
      let iswecan = this.$store.state.projectIsWecan
      return {
        iswecan: iswecan,
        loginarea: '',
        dom: '',
        user: '',
        passwd: '',
        login_time: '',
        key: '',
        login_success: false,
        area: '',
        openedWindows: [],
        openedWindowsUrl: [],
        orderSystemVisible: false,
        operationSyatemVisible: false,
        wffsettlementVisible: false,
        isapprovered: false,//经理审批是否被控
        system_list: [
          {
            // title: '订单系统', bg: './boStatic/images/login/system_bg1.png', more: true, dialog: 'orderSystemVisible'
            title: '订单系统', bg: './boStatic/images/login/system_bg1.png', icon: './boStatic/images/login/system_icon1.png', sub: [
              // {sub_title: '国际业务'},
              //{system_name: '空出(分公司)', href: '#/index'},
              { system_name: '唯凯订单', href: 'index.html#/index' },
              //{system_name: '唯凯订单', href: '/index.html?r='+new Date().getTime()+'/#/index'},
              //{system_name: '海运部', href: 'https://auth.walltechsystem.cn/LoginServlet?ps=eyJyZXR1cm5VcmwiOiJodHRwOlwvXC93d3cuY2FyZ293YXJlLmNvbVwvSW5kZXhTZXJ2bGV0Iiwic2VydmljZUNvZGUiOiJDYXJnbyIsImNoZWNrTG9naW5SdWxlIjoidHJ1ZSJ9'},
              {},
              // {system_name: '空出(市场部)', href: '${location.hostname}/pomanagement?username=${username}&key=${key}&system=PO', localhost: '192.168.0.96'},
              // {system_name: '空出(海外部)', href: '${location.hostname}/pomanagement?username=${username}&key=${key}&system=PO海外部', localhost: '192.168.0.96'},
              /*      {sub_title: '国内业务(分公司)'},
                    {system_name: '联运服务', href: '#/index?temp=OrderAccept'},
                    {system_name: '报关服务', href: '#/index?temp=BgOrderAccept'}, */
              // {system_name: '仓储服务'},
              // {system_name: '其他延伸', href: '${location.hostname}${port}/wffairexpfreight?username=${username}&key=${key}'}
            ]
          }, {
            // title: '操作系统', bg: './boStatic/images/login/system_bg2.png', icon: './boStatic/images/login/system_icon2.png', more: true, dialog: 'operationSyatemVisible'
            title: '操作系统(上海)', bg: './boStatic/images/login/system_bg2.png', icon: './boStatic/images/login/system_icon2.png', sub: [
              { sub_title: '国际业务', hidden: !iswecan },
              // {system_name: '空运出口', href: '${location.hostname}/wffairexpfreight?username=${username}&key=${key}',},
              // {system_name: '空运出口', href: '${location.hostname}/wffairexpfreightExChange?username=${username}&key=${key}', localhost: '192.168.0.165'},
              { system_name: '空运进口', href: '${location.hostname}/wffairimpfreight?username=${username}&key=${key}', hidden: !iswecan },
              //  {system_name: '空出(香港)', href: '${location.hostname}${port}/wffAirexpFreight?username=${username}&key=${key}', localhost: '192.168.0.101'},
              // {},
              //{system_name: '海运出口', href: 'https://auth.walltechsystem.cn/LoginServlet?ps=eyJyZXR1cm5VcmwiOiJodHRwOlwvXC93d3cuY2FyZ293YXJlLmNvbVwvSW5kZXhTZXJ2bGV0Iiwic2VydmljZUNvZGUiOiJDYXJnbyIsImNoZWNrTG9naW5SdWxlIjoidHJ1ZSJ9'},
              // {system_name: '海运进口', href: 'https://auth.walltechsystem.cn/LoginServlet?ps=eyJyZXR1cm5VcmwiOiJodHRwOlwvXC93d3cuY2FyZ293YXJlLmNvbVwvSW5kZXhTZXJ2bGV0Iiwic2VydmljZUNvZGUiOiJDYXJnbyIsImNoZWNrTG9naW5SdWxlIjoidHJ1ZSJ9'},
              { sub_title: '国内业务' },
              { system_name: '空出仓库', href: '${location.hostname}/wffairexpstore?username=${username}&key=${key}', },
              // { system_name: '空进仓库', href: '${location.hostname}/wffairimpstore?username=${username}&key=${key}', hidden: !iswecan },
              { system_name: '空进仓库', href: '${location.hostname}/BoStoreManagement/#/index', hidden: !iswecan },
              { system_name: '联运操作', href: '${location.hostname}/wfftransport?username=${username}&key=${key}', hidden: !iswecan },
              { system_name: '材料操作', href: '${location.hostname}/wffproductionmanagement?username=${username}&key=${key}', hidden: !iswecan },
              // {system_name: '部门延伸', href: 'http://erp.wecanintl.com/loginnew/admin/frmYsServicesQuickSearch.aspx?addman=${username}'}
              //{system_name: '部门延伸', href: '${location.hostname}/loginnew/admin/frmYsServicesQuickSearch.aspx?addman=${username}'}
            ]
          }, {
            title: '结算系统', bg: './boStatic/images/login/system_bg3.png', icon: './boStatic/images/login/system_icon3.png', sub: [
              // {sub_title: '集团'},
              //   {system_name: '汇总结算', dialog: 'wffsettlementVisible'},
              //  {sub_title: '分站'},
              // {system_name: '空出结算', href: '${location.hostname}${port}/wffsettlement?username=${username}&key=${key}'},
              // {system_name: '空进结算', href: '${location.hostname}${port}/wffsettlement?username=${username}&key=${key}'},
              // {system_name: '联运结算', href: '${location.hostname}${port}/wffsettlement?username=${username}&key=${key}'},
              // {system_name: '报关结算', href: '${location.hostname}${port}/wffsettlement?username=${username}&key=${key}'},
              // {system_name: '仓库结算'},
              { system_name: '业务结算', href: '${location.hostname}/wffsettlement?username=${username}&key=${key}' },
            ]
          }, {
            title: '基础信息', bg: './boStatic/images/login/system_bg4.png', icon: './boStatic/images/login/system_icon4.png', sub: [
              { sub_title: '集团' },
              { system_name: '客户供应商', href: '${location.hostname}/wffcustommanagement?username=${username}&key=${key}' },
              { system_name: '权限系统', href: '${location.hostname}/usermanagement?username=${username}&key=${key}' },
              { system_name: '价格管理', href: '${location.hostname}/priceSystem/#/index' },
              // 运价系统暂定路由
              // { system_name: '运价系统', href: '${pathname}/priceSystem.html#/index?redirect=norAirlineFee' },
              { sub_title: '分站' },
              { system_name: '基础数据', href: '${location.hostname}/wffbasic?username=${username}&key=${key}' }
              //{system_name: '基础数据', href: '${location.hostname}/basicData'}
              //{system_name: '基础数据', href: '${location.hostname}/basicData/iframe/mawbManager/'}
            ]
          }, {
            title: '审批管理', bg: './boStatic/images/login/system_bg5.png', icon: './boStatic/images/login/system_icon5.png', sub: [
              { sub_title: '集团' },
              { system_name: '公司审批', href: '${location.hostname}/wffmanagement?username=${username}&key=${key}&defaulturl=公司项目审批' },
              // {system_name: '公司审批', href: '${pathname}/wffmanagement.html#/index?redirect=companyproject'},
              //'${location.hostname}/wffmanagement?username=${username}&key=${key}&defaulturl=业务信用审批' 
              { system_name: '信控审批', href: '${pathname}/wffmanagement.html#/index?redirect=frmCustomJob'},
              { system_name: '法务审批', hidden: !iswecan, href: '${location.hostname}/wffmanagement?username=${username}&key=${key}&defaulturl=法务审批' },
              { system_name: '结算审批', href: '${location.hostname}/wffmanagement?username=${username}&key=${key}&defaulturl=结算审批' },
              //  {system_name: '权限系统', href: '${location.hostname}/usermanagement?username=${username}&key=${key}'},
              // {system_name: '订单调度'},
              { sub_title: '分站' },
              // {system_name: '经理审核', href: '${location.hostname}/wffmanagement?username=${username}&key=${key}&defaulturl=经理审核'}
              // {system_name: '经理审核', href: '/wffmanagement.html#/index'},
              { system_name: '经理审核', href: '${pathname}/wffmanagement.html#/index?redirect=managerExamine'}
            ]
          }, {
            title: '数据统计', bg: './boStatic/images/login/system_bg6.png', icon: './boStatic/images/login/system_icon6.png', sub: [
              // {sub_title: '集团'},
              // {system_name: '委托客户', href: '${location.hostname}/statisticalReport/#/WtkhStatistic'},
              // {system_name: '销售员', href: '${location.hostname}/statisticalReport/#/SalesStatistic'},
              // {system_name: '航线区域', href: '${location.hostname}/statisticalReport/#/AirlineStatistic'},
              // {system_name: '站点', href: '${location.hostname}/statisticalReport/#/StationStatistic'},
              // {sub_title: '分站'},
              { system_name: '统计报表', href: '${location.hostname}/statisticalReport/' }
              // {system_name: '销售员', href: '${location.hostname}/statisticalReport/#/ZDSalesStatistic'},
              // {system_name: '航线区域', href: '${location.hostname}/statisticalReport/#/ZDAirlineStatistic'},
              // {system_name: '站点', href: '${location.hostname}/statisticalReport/#/ZDStationStatistic'},
              // {system_name: '排行', href: '${location.hostname}/statisticalReport/#/TopStatistic'},
              // {system_name: '航司', href: '${location.hostname}/statisticalReport/#/ZDAirCompanyStatistic'}
            ]
          }
        ],

        groupTypeArea: {},

        // orderSystem_list: {
        //   '运输业务': [
        //     {icon: './boStatic/images/login/order_icon5_black.png', item: [
        //       {name: '出口', hover: false, href: '#/index'},
        //       {name: '进口', hover: false},
        //       {name: '国内', hover: false}
        //     ]},
        //     {icon: './boStatic/images/login/order_icon6_black.png', item: [
        //       {name: '出口', hover: false},
        //       {name: '进口', hover: false},
        //       {name: '国内', hover: false}
        //     ]},
        //     {icon: './boStatic/images/login/order_icon7_black.png', item: [
        //       {name: '出口', hover: false},
        //       {name: '进口', hover: false},
        //       {name: '国内', hover: false, href: '#/index?temp=OrderAccept'}
        //     ]},
        //     {icon: './boStatic/images/login/order_icon8_black.png', item: [
        //       {name: '出口', hover: false},
        //       {name: '进口', hover: false},
        //       {name: '国内', hover: false}
        //     ]}
        //   ],
        //   '增值服务': [
        //     {icon: './boStatic/images/login/order_icon9_black.png', name: '报关服务', href: '#/index?temp=BgOrderAccept'},
        //     {icon: './boStatic/images/login/order_icon10.png', name: '仓储服务'},
        //     {icon: './boStatic/images/login/order_icon11.png', name: '延伸服务'}
        //   ]
        // },

        // operationSyatem_list: [
        //   {icon: './boStatic/images/login/order_icon5_black.png',     title: '空出', item: [
        //     {name: '航线操作', hover: false},
        //     {name: '客服操作', hover: false},
        //     {name: '单证操作', hover: false},
        //     {name: '仓库操作', hover: false}
        //   ]},
        //   {icon: './boStatic/images/login/operation_icon2_black.png', title: '空进', item: [
        //     {name: '客服操作', hover: false},
        //     {name: '仓库操作', hover: false}
        //   ]},
        //   {icon: './boStatic/images/login/order_icon6_black.png',     title: '海运', item: [
        //     {name: 'wall-tech', hover: false}
        //   ]},
        //   {icon: './boStatic/images/login/order_icon7_black.png',     title: '卡车', item: [
        //     {name: '卡车操作', hover: false}
        //   ]},
        //   {icon: './boStatic/images/login/operation_icon5_black.png', title: '材料', item: [
        //     {name: '材料操作', hover: false}
        //   ]}
        // ],
        forgetCodeShow: false,
        forgetCodeInfo: { logname: '', pwd: '', smscode: '' },
        countdown: 0,
        messagePanelShow: false,//版本面板
        active: 0,
        versionDateBegin: '',//版本搜索日期
        versionDateEnd: '',
        versionActiveIndex: -1,//版本查看index
        resultUpdate: [],//版本数据
        resultUpdateOperation: [],//操作手册数据
        resultUpdateBackup: [],//备份数据
        resultUpdateOperationBackUp: [],//操作手册数据备份
        iframeurl: '',//iframe地址
        newLength: 0,//版本条数
        mark: '1',//标识版本还是消息
        systemArray: [],//系统数组
        systemValue: [],//所选系统

        //erweima:false,//二维码显示
        //appShow:true,//app上新文字提示
        ticket: '',//临时
        system: 'bo',//bo outside
        systemOptions: [
          { label: 'bo系统', value: 'bo' },
          { label: '外网系统', value: 'outside' },
        ]
      }
    },
    created() {
      window.name = 'login';
      window.closedialog = () => {//在子页面刷新的时候执行，关闭从首页打开的窗口
        this.closeWindows()

      }
      window.onbeforeunload = () => {//登录页刷新或关闭时，关闭从首页打开的窗口
        this.closeWindows()
        //     // 　　var e = window.event||e;  
        //     // 　　e.returnValue=("确定离开当前页面吗？");     
      }

      if (window.location.hostname == 'localhost' && getCookie('isrelogin') == 2 && JSON.parse(getCookie('openedWindowsUrl') && JSON.parse(getCookie('openedWindowsUrl')).filter(i => i.system_name == getCookie('systemTitle')).length)) {
        this.user = getCookie('usrname');
        this.passwd = getCookie('passwd');

        //想设置重新登录并载入之前的页面，结果发现不同浏览器甚至同一浏览器的不同版本都可能导致未知的问题，比如360会拦截弹窗，谷歌有些版本陷入死循环；
        //所以目前只在本地使用,如有必要可进一步完善，关键是解决浏览器兼容问题
        this.login().then(() => {
          let url = JSON.parse(getCookie('openedWindowsUrl')).filter(i => i.system_name == getCookie('systemTitle'))
          if (url.length > 0) {
            let system_name = url[0].system_name;
            this.spanOpen(url[0])
          }
        })
      }

      this.user = ''
      this.passwd = ''
      // localStorage.clear()
      // sessionStorage.clear()
      let self = this
      // 未登录时才进行监听keydown事件
      if (!sessionStorage.ticket && !localStorage.usrname||location.href.includes('login')) {
        document.onkeydown = function (e) {
          // if(!localStorage.getItem('usrname')){
          if (!e) e = window.event;
          if ((e.keyCode || e.which) == 13) {
            self.login()
          }
          // }
        }
      }



      this.user = localStorage.usrname;

      if (this.systemSelectShow) {
        if (this.system == 'bo') {
          this.user = 'admin'
          this.passwd = 'txjet2202'
          // this.user='钱晓锋'
          // this.passwd='test'
        } else {
          // this.user = 'zhe.cheng@kuehne-nagel.com'
          // this.passwd = 'SHDX'
          this.user = 'xiongbaoxiang-sha@hfl-logistics.com'
          this.passwd = 'test'
        }

      }

    window.queueObj.subscribe(queueKey.openBo,"login",function(d){
    document.getElementById("唯凯订单").click();//通过代码打开窗口会被浏览器拦截 点击事件则不会
    })

    },
    mounted() {

    },
    computed: {
      systemSelectShow() {
        return this.$store.state.isLocalhost || window.location.host.includes('192.168.0.113')
      },
      publicWebApi() {
        return this.system == 'bo' ? this.$store.state.publicWebApi : this.$store.state.publicWebApi.replace('PublicWebApi', 'outsidewebapi')
      },
      user_input_status() {
        return this.user !== ''
      },
      passwd_input_status() {
        return this.passwd !== ''
      },
      systemBoxBtm() {
        return document.body.offsetHeight
      }

    },
    watch: {
      versionActiveIndex(val) {
        if (val != -1) {
          $('.leftList').hide()
          $('.rightList').css('width', '1350px')
          this.iframeurl = `${this.publicWebApi}api/PubUpdateNoticeLog?contenturl=${this.resultUpdate[val].contenturl}`
        } else {
          $('.leftList').show()
          $('.rightList').css('width', '1150px')
        }

      },
      system(val) {
        if (this.systemSelectShow) {
          if (this.system == 'bo') {
            this.user = 'admin'
            this.passwd = 'txjet2202'
          } else {
            // this.user = 'zhe.cheng@kuehne-nagel.com'
            // this.passwd = 'SHDX'
            this.user = 'xiongbaoxiang-sha@hfl-logistics.com'
            this.passwd = 'test'
          }

        }
      }
      // erweima(val){
      //  if(val){
      //    this.appShow=false
      //  }else{
      //    this.appShow=true
      //  }
      // }

    },
    methods: {
      spanOpen(sub_sys) {
        sub_sys.dialog ? this.openDialog(sub_sys.dialog) : this.windowOpen(sub_sys)
      },
      timestamp(time) {
        // 时间戳转换
        var date = new Date(time * 1000);
        // console.log(date)
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
      },
      searchFilter() {
        this.resultUpdate = this.resultUpdateBackup
        this.resultUpdateOperation = this.resultUpdateOperationBackup
        var newArray = []
        var versionDateBegin = ""
        var versionDateEnd = ""
        var currentFilterData = []

        if (this.mark == 1) {
          currentFilterData = this.resultUpdate
        } else if (this.mark == 2) {
          currentFilterData = this.resultUpdateOperation
        }

        if (this.versionDateBegin) {
          versionDateBegin = new Date(this.versionDateBegin.replace(/-/g, '/'));
        }

        if (this.versionDateEnd) {
          versionDateEnd = new Date(this.versionDateEnd.replace(/-/g, '/'));
        }


        currentFilterData.forEach(item => {
          var isadd = true;
          if (versionDateBegin) {
            if (new Date(item.timestamp.replace(/-/g, '/')).getTime() < versionDateBegin.getTime()) {
              isadd = false;
            }
          }
          if (versionDateEnd) {
            if (new Date(item.timestamp.replace(/-/g, '/')).getTime() > versionDateEnd.getTime()) {
              isadd = false;
            }
          }
          if (this.systemValue.length > 0) {
            if (this.systemValue.indexOf(item.system) == -1) {
              isadd = false

            }
          }

          if (isadd) {
            newArray.push(item)
          }

        })

        if (this.mark == 1) {
          this.resultUpdate = newArray
        } else if (this.mark == 2) {
          this.resultUpdateOperation = newArray
        }

      },
      //查看版本内容
      versionActiveIndexF(index) {
        this.versionActiveIndex = index;
        // var currentData=[]
        // if(this.mark==1){
        // currentData=this.resultUpdate
        // }else if(this.mark==2){
        // currentData=this.resultUpdateOperation
        // }
        if (!this.resultUpdate[index].isread) {
          this.$axios({ method: 'post', url: this.publicWebApi + 'api/PubUpdateNoticeSendLog', data: { logname: this.user, system: 'bo', id: this.resultUpdate[index].id }, loading: false, tip: false, noarea: 1 })
            .then(results => {
              this.messagePanel()
            })
            .catch(error => {

            })
        }


      },
      openLink(link, paramsObj) {

        let paramsArr = [];
        if (paramsObj && Object.keys(paramsObj).length) {
          Object.keys(paramsObj).forEach(i => {
            paramsArr.push(`${i}=${paramsObj[i]}`)
          })
        }


        if (link == 'peixun') {
          // console.log(window.location.host)
          //console.log(location.hostname)
          let url = "";
          if (window.location.host.indexOf('localhost') != '-1' || window.location.host.indexOf('192.168.98.198') != '-1') {
            if (paramsArr.length) {
              url = `http://192.168.98.198:8081/?username=${this.user}&ticket=${this.ticket}&depart=${this.depart}&${paramsArr.join('&')}`
            } else {
              url = `http://192.168.98.198:8081/?username=${this.user}&ticket=${this.ticket}&depart=${this.depart}`
            }
            //url=`http://192.168.0.96/TrainingSystem?username=${this.user}&ticket=${this.ticket}&depart=${this.depart}?`
          } else {
            //url=`/TrainingSystem?username=${this.user}&ticket=${this.ticket}&depart=${this.depart}?`    
            if (paramsArr.length) {
              url = `/TrainingSystem` + `?${paramsArr.join('&')}`
            } else {
              url = `/TrainingSystem`
            }
          }
          window.open(url)
        } else {
          window.open(link)
        }

      },
      ahover(hover, item) {
        if (hover) {
          item.icon = item.icon.replace('_black.png', '_hover.png')

          // if (item.href) {
          //   item.icon = item.icon.replace('_black.png', '_hover.png')
          // } else {
          //   item.icon = item.icon.replace('.png', '_hover.png')
          // }
        } else {
          item.icon = item.icon.replace('_hover.png', '_black.png')

          // if (item.href) {
          //   item.icon = item.icon.replace('_hover.png', '_black.png')
          // } else {
          //   item.icon = item.icon.replace('_hover.png', '.png')
          // }
        }
      },
      openDialog(dialogname) {
        this[dialogname] = true
        // if (dialogname == 'orderSystem') {
        //   this.orderSystemVisible = true
        // } else if (dialogname == 'operationSystem') {
        //   this.operationSyatemVisible = true
        // }
      },
      
      async login() {
        let paramsObj = getHrefParams()

        if (!this.user_input_status || !this.passwd_input_status) {
          return this.$message.error('请输入用户名和密码方可登录')
        }
        localStorage.clear()
        sessionStorage.clear()
        this.getGroupid()
        this.getComContact()


        let login_data = {
          usrname: this.user,
          pwd: this.passwd,
        }
        var api = this.system == 'bo' ? 'api/UserLogin' : 'api/User'
        if (api == 'api/User') {
          login_data.usrtype = 2
        }
        await this.$axios({ method: 'get', url: this.publicWebApi + api, params: login_data, loading: true, tip: true })
          .then(result => {
            if (result.data.resultstatus == 0) {
              // result.data.needupdatepwd=true
              if (result.data.needupdatepwd) {
                this.$alert('为了您的账户安全，请更新密码!', '提示', {
                  confirmButtonText: '确定',
                  showClose: false,
                  type: 'warning',
                })
                  .then(() => {
                    this.forgetCodeShow = true
                    this.forgetCodeInfo.logname = this.user
                  })
                return
              }

              if (this.system != 'bo') {
                let url = window.location.origin + window.location.pathname + `#/index?system=outside&usrname=${result.data.logname}&gid=${result.data.gid}&ticket=${result.data.ticket}`
                console.log(url);
                window.open(url, "_blank");
                return;
              } else {
                this.key = result.data.upwd
                sessionStorage.setItem('key', this.key)
                this.login_time = new Date().toLocaleString('chinese', { hour12: false }).slice(0, -3).replace(/\//g, '.')

                // 内网
                sessionStorage.setItem('ticket', result.data.ticket)//对应外网out_ticket
                localStorage.setItem('ticket', result.data.ticket)//对应外网out_ticket
                this.ticket = result.data.ticket
                localStorage.setItem('loginarea', result.data.area)//对应外网out_area
                localStorage.setItem('realarea', result.data.realarea || '')
                localStorage.setItem('depart', result.data.depart || '')
                localStorage.setItem('usrname', result.data.logname)//对应外网out_logname
                localStorage.setItem('dom', result.data.dom || '出口部')
                localStorage.setItem('englishname', result.data.englishname || '')
                localStorage.setItem('userEmail', result.data.email || '')//对应外网out_email
                sessionStorage.setItem('loginDate', new Date().getTime())
                
              }
              this.login_success = true
              document.onkeydown = null
              this.user = localStorage.usrname
              this.realarea = localStorage.realarea
              this.depart = localStorage.depart
              setCookie('usrname', this.user)
              setCookie('passwd', this.passwd)
              // setCookie('isrelogin', 1);//默认状态
              if (result.data.isapprover) {
                this.workUnfinish(result.data.logname)
              }

              this.messagePanel()

              // if (result.data.logname === 'admin') {
              //   if (!this.system_list[0].sub[2]) {
              //     this.system_list[0].sub.push(
              //       {sub_title: '国内业务(分公司)'},
              //       {system_name: '联运服务', href: '#/index?temp=OrderAccept'},
              //       {system_name: '报关服务', href: '#/index?temp=BgOrderAccept'}
              //     )
              //   }
              // }

              if (paramsObj.flag) {
                this.openLink('peixun', paramsObj);
                return
              }




            } else {
              this.$message.error(result.data.resultmessage)
            }
          })
          .catch((err) => {

          })



      },
      //控经理审核
      workUnfinish(czman) {
        this.$axios({ method: 'get', url: this.publicWebApi + 'api/PubWorkUnFinish', params: { czman: czman, system: 'wffmanagement' }, loading: true, tip: false })
          .then(result => {
            // console.log(11111111)
            // console.log(result.data)
            if (result.data.resultstatus != 0) {
              this.$confirm(result.data.resultmessage, '紧急提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                closeOnHashChange: false,
                showClose: false,
                dangerouslyUseHTMLString: true,
                type: 'warning'
              }).then(() => {
                this.isapprovered = true;
                window.resultdicWffmanagement = result.data;
                let sub = this.system_list[4].sub//注意，这里要打开经理审核页面，索引是写死的，如何修改了system_list要检查是否需要修改索引
                this.windowOpen(sub[sub.length - 1])
              })
            }


          })
      },
      logout(switch_user) {
        // if (switch_user == true) {
        this.user = ''
        this.passwd = ''
        // }
        this.login_success = false

        localStorage.clear()
        sessionStorage.clear()
        clearAllCookie()
        window.location.reload(true)
        /*   let self = this
          document.onkeydown = function(e){
            if(!e) e = window.event;
            if((e.keyCode || e.which) == 13){
              self.login()
            }
          } */
      },
      openSelfCheck() {
        let url = "${location.hostname}/wffselfcheck?username=${username}&key=${key}"
        window.open(this.transUrl({ href: url }))
      },
      openWffsettlement(area) {
        let url = 'http://erp.wecanintl.com${port}/wffsettlement?username=${username}&key=${key}'
        url = url.replace('${port}', this.$store.state.area_port[area.typename.split('丨')[0]])
        url = url.replace('${username}', this.user || '')
        url = url.replace('${key}', this.key || '')
        window.open(url)
      },
      closeWindows() {//关闭从此页面打开的窗口
        if (this.openedWindows.length) {
          this.openedWindows.forEach((i) => {
            i.close();
          });
        }
        //localStorage.clear()
        //sessionStorage.clear()

      },
      windowOpen(url) {//保存从此页面打开的窗口引用，方便控制
        let href = this.transUrl(url);
        console.log(url, href)
        let pname = window.open(href, "_blank");//360会屏蔽直接从代码打开窗口，会返回空值。点击页面按钮则没有问题
        //  console.log(pname)
        if (pname) {
          this.openedWindowsUrl.push(url);
          setCookie('openedWindowsUrl', JSON.stringify(this.openedWindowsUrl))

          this.openedWindows.push(pname);
          setTimeout(() => {//重置打开页面的标题为当前页面配置的标题
            this.openedWindows.forEach((i, k) => {
              i.document.title = this.openedWindowsUrl[k].system_name
            });
          }, 2000);
        }
      },
      transUrl(item) {
        if (!item.href) return undefined

        let href = item.href
        if (location.hostname.includes('192.168')) {
          if (item.localhost) {
            href = href.replace('${location.hostname}', location.protocol + '//' + item.localhost)
          } else {
            href = href.replace('${location.hostname}', location.protocol + '//' + location.host)
          }
          href = href.replace('${port}', this.$store.state.area_port[localStorage.loginarea] || '')
        } else {
          href = href.replace('${location.hostname}', location.protocol + '//' + location.host)
          href = href.replace('${port}', this.$store.state.area_port[localStorage.loginarea] || '')
        }

        if (href.includes('${pathname}')) {
          let pathname = location.pathname == '/' ? '' : location.pathname
          let reg = /\/index.html$/   // 如果以反斜杠结尾，则去掉结尾的反斜杠
          pathname = reg.test(pathname) ? pathname.substring(0, pathname.length - 11) : pathname
          href = href.replace('${pathname}', pathname)
        }

        href = href.replace('${username}', this.user || '')
        href = href.replace('${key}', this.key || '')
        href = href.replace('#/', `?r=${new Date().getTime()}#/`)
        return href
      },
      // 获取全部groupid
      getGroupid() {
        this.$axios({ method: 'get', url: this.publicWebApi + 'api/PubTypeCode', params: { groupid: -1 }, loading: false, tip: false }).then(res => {
          localStorage.setItem("groupType", JSON.stringify(res.data))
          var systemArr = []
          this.systemArray = []
          this.groupTypeArea = {}

          res.data.filter(i => i.groupid == '101').forEach(item => {
            if (!this.groupTypeArea[item.ready04]) this.groupTypeArea[item.ready04] = []
            this.groupTypeArea[item.ready04].push(item)
          })


          res.data.filter(i => i.groupid == '136').forEach(item => {
            //  console.log(item)
            if (!systemArr.includes(item.ready04)) {
              systemArr.push(item.ready04);
              this.systemArray.push({ label: item.ready04, options: [{ 'value': (item.typename.split('丨'))[0], 'label': item.typename }] })
            } else {
              let len = systemArr.indexOf(item.ready04)

              this.systemArray[len].options[this.systemArray[len].options.length] = { 'value': (item.typename.split('丨'))[0], 'label': item.typename }
            }
          })
          var groupTypeCode = {}
          res.data.forEach(i => {
            let item = { ready01: i.ready01, typename: i.typename }
            if (!groupTypeCode[i.groupid]) {
              groupTypeCode[i.groupid] = [item]
            } else {
              groupTypeCode[i.groupid].push(item)
            }
          })
          //  console.log(groupTypeCode)
          localStorage.setItem("groupTypeCode", JSON.stringify(groupTypeCode))

        })


      },
      //人事联系人
      getComContact() {
        this.$axios({ method: "get", url: this.publicWebApi + 'api/PubHrManage', params: {} })
          .then(results => {
            localStorage.setItem('comContact', JSON.stringify(results.data))
          })
      },
      // 获取验证码
      getYanz() {
        this.$axios({ method: "get", url: this.publicWebApi + 'api/PubMessageSms', params: { logname: this.forgetCodeInfo.logname } }).then(results => {
          if (results.data.resultstatus == 0) {

            this.$message.success('发送成功')
            this.countdown = 30
            var time = setInterval(() => {
              this.countdown--
              if (this.countdown == 0) {
                clearInterval(time)
              }
            }, 1000)

          } else {
            this.$message.error('发送失败')
          }
        })


      },
      // 设置新密码
      confirmCode() {
        var self = this
        // if(this.forgetCodeInfo.pwd.length<8||this.forgetCodeInfo.pwd.length>16){
        //   return this.$message.info('请输入8-16位密码');
        // }
        // ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]$
        // ((?=.*[a-z]{1,})(?=.*[a-z]{1,})(?=.*\d)[^]){8,16}
        //console.log(/^(?=.*[a-z]{1,})(?=.*[A-Z]{1,})(?=.*\d)[^]{8,16}$/.test(this.forgetCodeInfo.pwd))
        if (!/^(?=[a-zA-Z0-9]{0,}\d{1,})(?=[a-zA-Z0-9]{0,}[a-z]{1,})(?=[a-zA-Z0-9]{0,}[A-Z]{1,}).{8,16}$/g.test(this.forgetCodeInfo.pwd)) {
          return this.$message.info('请输入8-16位包含数字和大小写英文的密码');
        }


        var data = { ...this.forgetCodeInfo, czman: this.forgetCodeInfo.logname }
        this.$axios({ method: "put", url: this.publicWebApi + 'api/UserPwd', data: data, noarea: true }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage)
            this.forgetCodeShow = false
            this.user = this.forgetCodeInfo.logname
            this.passwd = this.forgetCodeInfo.pwd

            setTimeout(() => {
              self.login()
            }, 500)
            setTimeout(() => {
              this.forgetCodeInfo = { logname: '', pwd: '', smscode: '' }
            }, 800)
          } else {
            this.$message.error(results.data.resultmessage)
          }
        })
      },
      clearForget() {
        this.forgetCodeInfo = { logname: '', pwd: '', smscode: '' }
      },

      // 打开版本更新
      messagePanel() {
        //this.messagePanelShow=true;
        this.resultUpdate = []
        this.resultUpdateOperation = []
        var that = this
        this.$axios({ method: 'get', url: this.publicWebApi + 'api/PubUpdateNoticeLog', params: { logname: this.user }, loading: false, tip: false, noarea: 1 })
          .then(results => {
            var num = 0
            results.data.forEach(item => {
              if (!item.isread && item.noticetype == 1) {
                num += 1
              }
              if (item.noticetype == 1) {
                that.resultUpdate.push(item)
              }
              if (item.noticetype == 10) {
                that.resultUpdateOperation.push(item)
              }
            })



            that.resultUpdate.sort(function (a, b) {

              return b['version'].localeCompare(a['version'], "zh");
            })

            that.resultUpdateOperation.sort(function (a, b) {

              return b['version'].localeCompare(a['version'], "zh");
            })


            that.$nextTick(() => {
              that.resultUpdate.forEach(item => {
                item.timestamp = that.timestamp(item.timestamp)

              })

              that.resultUpdateOperation.forEach(item => {
                item.timestamp = that.timestamp(item.timestamp)

              })
              that.resultUpdateBackup = JSON.parse(JSON.stringify(that.resultUpdate))
              that.resultUpdateOperationBackup = JSON.parse(JSON.stringify(that.resultUpdateOperation))

            })



            that.newLength = num






          })
          .catch(error => {

          })
      },

      selmultiAll() { //下拉全选
        var length = 0
        this.systemArray.forEach(item => {
          length += item.options.length
        })
        //console.log(length)
        if (this.systemValue.length == length) {
          this.systemValue = []
        } else {
          this.systemArray.forEach(item => {
            item.options.forEach(item2 => {
              if (!this.systemValue.includes(item2.value)) {
                this.systemValue.push(item2.value)
              }

            })
          })

        }
      },
      //设置高度
      modelHeight: function () {
        //console.log('1')
        $('.modelHeight').parent().parent('.el-scrollbar__wrap').css('max-height', '720px')
      },
      panelShow(mark) {
        this.messagePanelShow = true
        //this.mark=mark
      },



    },

  }
</script>

<style lang="less" scoped>
  .login {
    //position: fixed;
    width: 100%;
    height: 100%;

    // min-width: 1738px;
    // min-height: 670px;
    a {
      color: #ccc;

      &.hashref {
        color: #606266;
      }
    }

    .left-c {
      position: relative;
      float: left;
      width: 226px;
      height: 100%;

      .wecan_logo {
        margin: 60px auto 0;
        width: 93px;
        height: inherit;
        max-height: 100px;
      }
    }

    .user-operation {
      position: absolute;
      left: 80px;
      bottom: 8%;
      width: 150px;

      .operate-list {
        margin-bottom: 40px;

        span {
          display: inline-block;
          font-size: 22px;
          font-weight: bold;
          color: #cccccc;
          margin-bottom: 20px;
          cursor: pointer;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .right-c {
      margin-left: 226px;
      height: 100%;

      .login-c {
        position: relative;
        height: 100%;

        .login-box {
          @width: 400px;
          @height: 278px;
          position: absolute;
          background: white;
          top: 50%;
          left: 50%;
          width: @width;
          /* height: @height; */
          margin: -(@height / 2) -(@width / 2);
          padding: 28px;

          .login-title {
            font-size: 20px;
            color: #0f5a8c;
          }

          .btn-c {
            .el-input {
              /deep/ .el-input__inner {
                height: 42px;
              }

              &:first-child {
                margin-bottom: 20px;
              }
            }

            .input-required /deep/ input {
              border: 1px solid #F7CBCB;
            }

            .input-required /deep/ .el-input__inner:hover {
              border: 1px solid #fda8a8;
            }

            .input-required /deep/ .el-input.is-active .el-input__inner,
            .input-required /deep/ .el-input__inner:focus {
              border: 1px solid #fda8a8;
            }
          }

          .login-title,
          .btn-c {
            margin-bottom: 25px;
          }

          .el-button {
            width: 100%;
            height: 42px;
            background: #0f5a8c;
            border: none;
          }
        }

      }

      .system-c {
        position: relative;
        height: 100%;
        min-width: 1525px;

        .bookVersion {
          margin-top: 10px;

          /deep/.el-badge {
            vertical-align: inherit
          }

          /deep/.el-badge__content.is-fixed {
            top: 10px;
            right: 18px;
          }

          /deep/.el-badge__content.is-dot {
            width: 7px;
            height: 7px;
          }

          .version {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            border: 1px solid #e8e8e8;

            cursor: pointer;

            margin-right: 6px;
            background: url('./../boStatic/images/message.png') no-repeat center;

            &:hover {
              background: url('./../boStatic/images/message_b.png') no-repeat center;
            }


          }

          .operationBook {

            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            border: 1px solid #e8e8e8;
            cursor: pointer;
            background: url('./../boStatic/images/book.png') no-repeat center;

            &:hover {
              background: url('./../boStatic/images/book_b.png') no-repeat center;
            }




          }


        }

        .login-info {
          position: absolute;
          top: 46px;
          right: 60px;
          text-align: right;

          .user {
            height: 28px;
            line-height: 24px;
            text-align: right;
            color: #333;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 2px;
          }

          .login-time {
            font-size: 14px;
            color: #999;
          }

          /deep/.el-badge__content.is-fixed {
            top: 12px;
          }

          .tooltip {
            animation: blink 4s 3s infinite;
            -webkit-animation: blink 4s 3s infinite;
            opacity: 0
          }
        }

        .system-box {
          position: absolute;
          bottom: 12%;
          right: 0;
          height: 520px;

          .sys-item {
            position: relative;
            top: 0;
            display: inline-block;
            width: 240px;
            height: 100%;
            margin-left: 12px;
            background: #ccc;
            color: white;
            vertical-align: top;
            padding: 40px 30px 0 25px;
            box-shadow: 0 0 0px 0px #000;
            transition: all .3s;

            &:hover {
              top: -40px;
              box-shadow: 0 0 33px -4px #000;

              .mask {
                opacity: .5;
              }
            }

            .mask {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #c52026;
              opacity: 0;
              transition: opacity .3s;
            }

            .content-c {
              position: absolute;
              z-index: 2;

              .sys-title {
                font-size: 24px;
                color: white;
                width: 166px;
                height: 40px;
                margin-bottom: 19px;
              }

              .line {
                width: 24px;
                height: 4px;
                background: white;
                margin-left: 1px;
                margin-bottom: 28px;
              }

              .more {
                position: relative;
                display: inline-block;
                height: 20px;
                font-size: 14px;
                margin-left: -4px;
                cursor: pointer;
              }

              .sub-sys {
                overflow: hidden;

                .sub-sys-item {
                  float: left;
                  font-size: 14px;
                  text-align: center;
                  line-height: 30px;
                  width: 90px;
                  height: 30px;
                  margin-right: 11px;
                  margin-bottom: 10px;
                  background: rgba(255, 255, 255, 0.2);
                  cursor: pointer;

                  &.empty {
                    background: transparent;
                    pointer-events: none;
                    cursor: default;
                  }

                  a {
                    color: #606266;
                  }

                  .hashref {
                    color: #ccc;
                  }
                }

                .sub-sys-title {
                  clear: both;
                  height: 30px;
                  line-height: 30px;
                  font-size: 14px;
                }
              }
            }

            .icon {
              width: 110px;
              height: 120px;
              position: absolute;
              bottom: 15px;
            }
          }
        }
      }
    }

    /deep/ .wffsettlement {
      .el-dialog__header {
        height: 0;
        padding: 0;
      }

      .el-dialog__body {
        padding: 40px;
        overflow: hidden;

        h3 {
          font-size: 18px;
          color: #004d84;
          margin-bottom: 20px;
        }

        .area-location {
          float: left;
          text-align: center;
          width: 100px;
          margin-right: 45px;

          &:last-child {
            margin-right: 0;
          }

          .location-title {
            font-size: 14px;
            color: #ccc;
            text-align: left;
            margin-bottom: 20px;
          }

          .btn {
            text-align: center;

            span {
              display: inline-block;
              width: 100px;
              height: 32px;
              line-height: 30px;
              border: 1px solid #e8e8e8;
              border-radius: 16px;
              margin-bottom: 12px;
              cursor: pointer;

              &:hover {
                border-color: #004d84;
                color: #004d84;
              }
            }
          }
        }
      }
    }

    /deep/ .orderSystemDialog {
      .el-dialog__header {
        height: 0;
        padding: 0;
      }

      .el-dialog__body {
        padding: 0;

        .orderSystem-c {
          height: 600px;
          padding: 40px;

          .top,
          .bottom {
            h3 {
              font-size: 18px;
              color: #004d84;
              margin-bottom: 24px;
            }

            .icon {
              display: inline-block;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 1px solid #e8e8e8;
            }
          }

          .top {
            height: 330px;
            border-bottom: 1px solid #e8e8e8;
            margin-bottom: 24px;

            .item-c {
              padding: 0 100px;
              overflow: hidden;

              .item {
                float: left;
                margin-right: 150px;

                &:last-child {
                  margin-right: 0;
                }

                .icon {
                  margin-bottom: 28px;
                }

                .btn {
                  text-align: center;

                  span {
                    display: inline-block;
                    width: 80px;
                    height: 32px;
                    line-height: 32px;
                    border: 1px solid #e8e8e8;
                    border-radius: 16px;
                    margin-bottom: 12px;
                    cursor: default;
                  }

                  .hashref {
                    span {
                      cursor: pointer;
                    }
                  }

                  .hashref:hover {
                    color: #004d84;

                    span {
                      border-color: #004d84;
                    }
                  }
                }
              }
            }
          }

          .bottom {
            .item-c {
              overflow: hidden;
              padding: 0 100px;

              .item {
                float: left;
                text-align: center;
                font-size: 14px;
                margin-right: 150px;

                &:last-child {
                  margin-right: 0;
                }

                .hashref {
                  &:hover {
                    color: #004d84;

                    span {
                      border-color: #004d84;
                    }
                  }

                  .icon {
                    cursor: pointer;
                  }

                  p {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
    }

    /deep/ .operationSyatemDialog {
      .el-dialog__header {
        height: 0;
        padding: 0;
      }

      .el-dialog__body {
        padding: 0;

        .operationSyatem-c {
          height: 600px;
          padding: 40px;
          font-size: 14px;

          h3 {
            margin-bottom: 40px;
            font-size: 18px;
            color: #004d84;
          }

          .item-c {
            overflow: hidden;

            .item {
              float: left;
              text-align: center;
              font-size: 14px;
              width: 224px;

              &:last-child {
                margin-right: 0;
              }

              .icon {
                display: inline-block;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 1px solid #e8e8e8;
              }

              p {
                margin-bottom: 40px;
              }

              .btn {
                text-align: center;

                span {
                  display: inline-block;
                  width: 88px;
                  height: 32px;
                  line-height: 30px;
                  border: 1px solid #e8e8e8;
                  border-radius: 16px;
                  margin-bottom: 12px;
                  cursor: default;
                }
              }
            }
          }
        }
      }
    }

    .forgetCodeShow {
      /deep/ .el-input__inner {
        height: 40px;
      }

      .forgetCodeUser,
      .forgetCodeSm,
      .forgetCodepwd {
        /deep/ .el-input-group__prepend {
          background: none;
          padding: 0 12px;
        }
      }

    }

  }

  @media screen and (max-width:1600px) {
    .login {
      .right-c {
        margin-left: 0px;

        .system-c {
          min-width: auto;

          .system-box {
            bottom: 24px;
            right: 20px;

            .sys-item {
              width: 210px;
              padding: 40px 0 0 20px;

              .sub-sys-item {
                width: 84px !important;
              }
            }
          }
        }

        /deep/.el-badge__content {
          /deep/.is-fixed {
            top: 12px;
          }
        }
      }

      .user-operation {
        z-index: 10;
        left: auto;
        bottom: auto;
        top: 44px;
        right: 300px;
        width: auto;

        .operate-list {
          span {
            display: inline;
            margin: 0 10px;
          }
        }
      }
    }
  }

  @media screen and (max-width:1100px) {
    .system-box {
      bottom: 624px !important;
    }
  }

  @media screen and (max-height:777px) {
    .login .left-c .wecan_logo {
      margin-top: 20px !important;
    }

    .login .user-operation {
      top: 24px !important;
    }

    .login .right-c .system-c .login-info {
      top: 26px !important;
    }

    .login-time {
      float: left !important;
      margin-top: 8px !important;
    }

    .bookVersion {
      float: left !important;
      margin-top: 2px !important;
      margin-left: 8px !important;
    }

    .system-box {
      bottom: 0 !important
    }
  }


  @keyframes blink {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 100;
    }

    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes blink {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 100;
    }

    100% {
      opacity: 0;
    }
  }

  .messagePanel {

    /deep/.el-dialog__header {
      padding: 0;

      .el-dialog__close {
        font-size: 22px;
      }
    }

    /deep/.el-dialog__body {
      padding: 0
    }

    .messagePanelContainer {
      &:after {
        content: '';
        display: block;
        clear: both;
      }


      .leftList {
        width: 200px;
        float: left;
        height: 800px;
        padding: 12px;
        border-right: 1px solid #e2dfdf;

        ul li {
          list-style: none;
          height: 60px;
          line-height: 60px;
          border-bottom: 1px solid #e2dfdf;
          text-align: center;
          font-size: 16px;
          color: #989899;
          padding-left: 20px;
          //padding-right:20px;
          cursor: pointer;
          letter-spacing: 0.1em;

          background: url('./../boStatic/images/version.png') no-repeat left center;

          &:hover {
            color: #0E5A8C;
            background: url('./../boStatic/images/version_b.png') no-repeat left center;
          }

        }

        ul li.active {
          color: #0E5A8C;
          background: url('./../boStatic/images/version_b.png') no-repeat left center;
        }
      }

      .rightList {
        width: 1150px;
        float: left;
        height: 800px;

        .rightListHead {
          height: 58px;
          line-height: 58px;
          border-bottom: 1px solid #e2dfdf;

          .el-icon-arrow-left {
            &:hover {
              color: #4ea6ff
            }
          }

          .rangeDate {
            /deep/ .el-input__prefix {
              display: none
            }

            /deep/ .el-input__inner {
              padding: 0 12px;
              border: none;
              height: 28px;
            }

          }

          /deep/input {
            height: 32px !important;
          }
        }

        .rightListArray {
          height: 742px;
          overflow: auto;

          ul li {
            border-bottom: 1px solid #e2dfdf;
            height: 86px;
            line-height: 86px;
            padding-left: 10px;
            padding-right: 20px;
            font-size: 14px;

            span {
              &:nth-child(1) {
                width: 6px;
                height: 6px;
                background: #f56c6c;
                border-radius: 6px;
                display: inline-block;
                vertical-align: middle
              }
            }
          }
        }

        .rightListContent {

          margin-top: 30px;
          padding: 10px;

          p {
            font-size: 18px;
            font-weight: bold;
            color: #0E5A8C
          }
        }
      }

    }
  }
</style>