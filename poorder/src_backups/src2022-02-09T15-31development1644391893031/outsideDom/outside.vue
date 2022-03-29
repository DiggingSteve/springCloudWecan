<template>
  <div class="wrap">


    <!-- {{statusNums}} -->



    <div class="wrap-mask">
      <div class="top_user">
        <div class="leftImage" v-if="projectIsWecan">
          <img src="../outsideDom/static/images/logo.png" height="33" width="66" style="vertical-align:middle">
        </div>
        <div class="rightUser" style="line-height:50px;margin-top:20px;text-align:right">
          <p style="height:20px;line-height:20px;font-size:14px;">
            {{$t('outside.welcome')}}，{{emailName}}
            <!-- <a @click="loginout"  :href="indexUrl" target="_self">{{$t('outside.Signout')}}</a> -->
            <span @click="loginout" style="margin-left:12px" target="_self">{{$t('outside.Signout')}}</span>
          </p>
          <span v-if="projectIsWecan"
            @click="book=true;bookurl=`${$store.state.webApi}api/PubDocument?document=唯凯外网系统(2.0.1)使用手册.pdf`">{{$t("outside.czsc")}}</span>
          <span v-if="projectIsWecan" @click="contactUs('feedback')">{{$t("outside.feedback")}}</span>
          <span v-if="projectIsWecan" @click="contactUs('contact')">{{$t("outside.contact")}}</span>
          <span v-if="projectIsWecan" @click="contactUs('jcdt')">{{$t("outside.jcdt")}}</span>
          <span v-if="projectIsWecan" @click="contactUs('updated')">{{$t("outside.update")}}</span>
          <span v-if="flag=='2'" @click="contactUs('user')">{{$t("outside.user")}}</span>



          <!-- <span @click="lagChange">{{$i18n.locale=='English'?'Chinese':'English'}}</span> -->
          <span class="userMan" @click="contactUs('set')">
            <img src="../outsideDom/static/images/user.png" height="19" width="18" style="vertical-align:sub">
          </span>

        </div>
      </div>

      <div class="operation_User">
        <p class="welcome" v-if="projectIsWecan">Welcome {{projectIsWecan?'Wecan':'HengFeng'}} Online Service</p>



        <p style="color:#116cf3;font-size:16px;font-weight:bold">{{$t('tips.tips15')}}</p>
        <div class="operationLeft">
          <div class="stateTop">
            <p style="margin-bottom:18px;">{{$t('outside.orders')}}:</p>

            <div style="display: grid; grid-auto-flow: column;">
              <!-- 在订单类下面权限内,请求暂无此权限  code:300,classify:320 唯凯待受理 -->

              <div v-for="item in statusNums" class="marginR" @click="dialogOpen(item.routeid)">
                <span class="stateTopB" :style="{background:item.color}"></span>
                <span class="stateN" :style="{color:item.color}" style="font-weight:bold">{{item.count}}</span>
                <span>{{$t('outside.tickets')}}</span><br>
                <span style="color:#999;padding-left:16px;">{{item.title}}</span>
              </div>





              <!-- <div class="marginR" @click="dialogOpen(120,'/orderAccepting','1')">
                <span class="stateTopB" style="background:#556C94"></span>
                <span class="stateN" style="color:#556C94;font-weight:bold;">{{statusNums.wait}}</span>
                <span>{{$t('outside.tickets')}}</span><br>
                <span style="color:#999;padding-left:16px;">{{$t('outside.wait')}}</span>
              </div> -->



              <!-- 在订单类下面权限内,请求暂无此权限  code:300,classify:330 报价待确认 -->
              <!-- <div class="marginR" @click="dialogOpen(130,'/offertConfirm','70')">
                  <span class="stateTopB" style="background:#106CF3"></span>
                  <span class="stateN" style="color:#106CF3;font-weight:bold;">{{statusNums.quotedprice}}</span>
                  <span>{{$t('outside.tickets')}}</span><br>
                  <span style="color:#999;padding-left:16px;">{{$t('outside.quotedprice')}}</span>
                </div> -->


              <!-- 在订单类下面权限内,请求暂无此权限  code:300,classify:340 报价驳回 -->
              <!-- <div @click="dialogOpen(140,'/outBusinessCancel','30')" class="marginR">
                      <span class="stateTopB" style="background:#DB2323"></span>
                      <span class="stateN" style="color:#DB2323;font-weight:bold;">{{statusNums.reject}}</span>
                      <span>{{$t('outside.tickets')}}</span><br>
                      <span style="color:#999;padding-left:16px;">{{$t('outside.reject')}}</span>
                    </div> -->

              <!-- <div class="marginR" @click="dialogOpen(210,'/outOrderSearch','200')">                             
                      <span class="stateTopB" style="background:#49b718"></span>
                      <span class="stateN" style="color:#49b718;font-weight:bold;">{{statusNums.booked}}</span>
                      <span>{{$t('outside.tickets')}}</span><br>
                      <span style="color:#999;padding-left:16px;">{{$t('outside.booked')}}</span>                                
                    </div> -->

              <!-- <div class="marginR" @click="dialogOpen(210,'/outOrderSearch','500')">
                <span class="stateTopB" style="background:#E69B2E"></span>
                <span class="stateN" style="color:#E69B2E;font-weight:bold;">{{statusNums.operateing}}</span>
                <span>{{$t('outside.tickets')}}</span><br>
                <span style="color:#999;padding-left:16px;">{{$t('outside.operateing')}}</span>

              </div> -->

              <!-- <div class="marginR" @click="dialogOpen('100','/orderSearch','600')">
                <span class="stateTopB" style="background:#49b718"></span>
                <span class="stateN" style="color:#49b718;font-weight:bold;">{{statusNums.completion}}</span>
                <span>{{$t('outside.tickets')}}</span><br>
                <span style="color:#999;padding-left:16px;">{{$t('outside.completion')}}</span>
              
              </div> -->


              <!--                  <div @click="dialogOpen('/orderSearch','300')" class="marginR">
                   <span class="stateTopB" style="background:#49b718" ></span>
                   <span class="stateN" style="color:#49b718">{{statusNums.completion}}</span>
                   <span>{{$t('outside.tickets')}}</span><br>
                   <span style="color:#999;padding-left:16px;">{{$t('outside.completion')}}</span>
                   
                 </div> -->



              <!-- 
              <div @click="dialogOpen('110','/orderSearch','700')">
                <span class="stateTopB" style="background:#999"></span>
                <span class="stateN" style="color:#999;font-weight:bold;">{{statusNums.cancel}}</span>
                <span>{{$t('outside.tickets')}}</span><br>
                <span style="color:#999;padding-left:16px;">{{$t('outside.cancel')}}</span>
              </div> -->

            </div>
          </div>

          <div class="searchBottom">
            <!-- 订单查询 -->
            <div class="searchList" @click="dialogOpen(210,'/orderSearch')"
              :style="{'color':autList.map(i=>i.aorder).indexOf(210)!='-1'?'#222':'#c8c8c8'}">
              <span>
                <img src="../outsideDom/static/images/order.png" height="42" width="42"
                  v-if="autList.map(i=>i.aorder).indexOf(210)!='-1'">
                <img src="../outsideDom/static/images/orderN.png" height="42" width="42" v-else>
              </span>
              {{autList.map(i=>i.aorder).indexOf(210)!='-1'?$t('outside.ordersearch'):$t('outside.jqqd')}}
            </div>
            <!-- 货物查询 -->
            <div class="searchList" @click="dialogOpen(220,'/cargoSearch')"
              :style="{'color':autList.map(i=>i.aorder).indexOf(220)!='-1'?'#222':'#c8c8c8'}">
              <span>
                <img src="../outsideDom/static/images/cargo.png" height="42" width="42"
                  v-if="autList.map(i=>i.aorder).indexOf(220)!='-1'">
                <img src="../outsideDom/static/images/cargoN.png" height="42" width="42" v-else>
              </span>
              {{autList.map(i=>i.aorder).indexOf(220)!='-1'?$t('outside.cargosearch'):$t('outside.jqqd')}}
            </div>
            <!-- 统计分析 -->
            <div class="searchList" v-if="projectIsWecan" @click="dialogOpen(430,'/dataAnaly')"
              :style="{'color':autList.map(i=>i.aorder).indexOf(430)!='-1'?'#222':'#c8c8c8'}">
              <span>
                <img src="../outsideDom/static/images/totalAnaly.png" height="36" width="42"
                  v-if="autList.map(i=>i.aorder).indexOf(430)!='-1'">
                <img src="../outsideDom/static/images/totalAnalyN.png" height="42" width="42" v-else>
              </span>
              {{autList.map(i=>i.aorder).indexOf(430)!='-1'?$t('outside.analysis'):$t('outside.jqqd')}}
            </div>
            <!-- 运价查询 -->
            <div class="searchList" :style="{'color':autList.indexOf(700)!='-1'?'#222':'#c8c8c8'}">
              <span>
                <img src="../outsideDom/static/images/freightCost.png" height="42" width="42">
              </span>
              {{autList.map(i=>i.aorder).indexOf(700)!='-1'?$t('outside.freight'):$t('outside.jqqd')}}
            </div>
          </div>
        </div>

        <div class="operationRight" v-if="projectIsWecan">

          <!-- @外网订舱 在订单类下面权限内,请求暂无此权限  code:300,classify:310 -->
          <div class="outAdd" @click="dialogOpen(110,'/outMawbAdd')">
            <p class="theme">
              {{autList.map(i=>i.aorder).indexOf(110)!='-1'?$t('outside.booking'):$t('outside.jqqd')}}</p>
          </div>
          <!-- 外网对账-->
          <div class="outAccount" @click="dialogOpen(410,'/outerAccount')">
            <p class="theme"
              :style="{'border-color':autList.map(i=>i.aorder).indexOf(410)=='-1'?'transparent transparent #c8c8c8':'transparent transparent rgba(248,152,40,.9)'}">
              {{autList.map(i=>i.aorder).indexOf(410)!='-1'?$t('outside.account'):$t('outside.jqqd')}}</p>
          </div>
          <!-- 发票获取-->
          <div class="outInvoice" @click="dialogOpen(420,'/outInvoice')">
            <p class="theme"
              :style="{'border-color':autList.map(i=>i.aorder).indexOf(420)=='-1'?'transparent transparent #c8c8c8':'transparent transparent rgba(248,152,40,.9)'}">
              <span
                style="color:#fff">{{autList.map(i=>i.aorder).indexOf(420)!='-1'?$t('outside.invoiceGet'):$t('outside.jqqd')}}</span>
            </p>
          </div>
        </div>
      </div>
      <!--         <el-tooltip class="item" effect="light" placement="top" v-if="url" ref="showMession">
          <div slot="content" style="line-height:1.4em;font-size:14px;">{{$t('tips.tips0')}},<br />{{$t('tips.tips1')}}
          </div>
          <img src="../outsideDom/static/images/spread.png" height="60" width="60" class="showMession" @click="dialogRecover">
        </el-tooltip> -->

      <!--  <div role="tooltip" id="el-tooltip-5218" aria-hidden="false" class="el-tooltip__popper is-light" style="position: fixed; top: 559px; left: 1722px; transform-origin: center bottom; z-index: 2001;" x-placement="top"><div data-v-1a4d8e3c="" style="line-height: 1.4em; font-size: 14px;">您收起的内容在这里,<br data-v-1a4d8e3c="">可点击展开继续刚才的操作</div><div x-arrow="" class="popper__arrow" style="left: 122px;"></div></div> -->
    </div>




    <!-- 联系唯凯 -->
    <el-dialog :visible.sync="setDialog.contact" width="50%" top="10%" center v-if="setDialog.contact"
      :show-close='false' custom-class="setDialog" append-to-body>
      <h2>
        {{$t('outside.contactUs')}}
        <i class="el-icon-close" @click="closeSetDialog('contact')"></i>
      </h2>
      <el-select v-model="area" clearable placeholder="请选择地域" style="margin-bottom:20px;">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="item in contactArea" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <commonTable class="commonTable" :head="contactHead"
        :table-data="area&&area!='全部'?contactData.filter(i=>i.area==area):contactData">
        <template slot="email" slot-scope="props">
          <a :href="'mailto:'+props.data.row.email">{{props.data.row.email}}</a>
        </template>

      </commonTable>
    </el-dialog>

    <!-- 进仓地图 -->
    <el-dialog :visible.sync="setDialog.jcdt" width="1300px" top="7%" center
      v-if="setDialog.jcdt&&mapArea&&mapAreaValue!='-1'" :show-close='false' custom-class="setDialog" append-to-body>
      <h2>
        {{$t('outside.jcdt')}}

        <el-select v-model="mapAreaValue" placeholder="选择地域" style="width:100px;margin-left:60px;"
          @change="mapIndex='-1'">
          <el-option v-for="(item,index) in mapArea" :key="item.area" :label="item.area" :value="index">
          </el-option>
        </el-select>

        <span :class="mapIndex==index?'active':'ckname'" v-for="(item,index) in mapArea[mapAreaValue].ckname"
          @click="toMap(item,index)" v-if="mapArea[mapAreaValue].ckname.length>1">
          {{item.name}}
        </span>


        <i class="el-icon-close" @click="closeSetDialog('jcdt')"></i>
      </h2>

      <jcmap id="allmap" :areaInfo="areaInfo" :visible.sync="setDialog.jcdt"></jcmap>
    </el-dialog>


    <!-- 意见反馈 -->
    <el-dialog :visible.sync="setDialog.feedback" width="50%" top="10%" center v-if="setDialog.feedback"
      :show-close='false' custom-class="setDialog" append-to-body>
      <h2>
        {{$t('tips.tips11')}}
        <i class="el-icon-close" @click="closeSetDialog('feedback')"></i>
      </h2>

      <commonTable class="commonTable" :head="feedBackHead" :table-data="feedBackInfo">

        <!-- <template slot="operation2" slot-scope="props">
        <a :href="'mailto:'+props.data.row.email" style="color:#4795FA">点击发送电子邮件</a>
      </template> -->

      </commonTable>

      <a :href="'mailto:'+feedBackInfo[0].email"
        style="color:#4795FA;display:block;text-align:right;margin-top:8px;">{{$t('tips.tips12')}}</a>
    </el-dialog>

    <!-- 更新日志 -->
    <el-dialog :visible.sync="setDialog.updated" width="50%" top="10%" center v-if="setDialog.updated"
      :show-close='false' custom-class="setDialog" append-to-body>
      <h2>
        {{$t('outside.update')}}
        <!--  <span style="font-size:14px;margin-left:30px;color:#4795FA;cursor:pointer;">使用手册下载</span> -->
        <i class="el-icon-close" @click="closeSetDialog('updated')"></i>
      </h2>
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
          placement="top">
          <img :src="activity.src" v-if="activity.src">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <!-- 用户管理 -->
    <el-dialog :visible.sync="setDialog.user" width="1100px" top="10%" center v-show="setDialog.user"
      :show-close='false' custom-class="setDialog" append-to-body>
      <h2>
        {{$t('outside.user')}}
        <i class="el-icon-close" @click="closeSetDialog('user')"></i>
      </h2>
      <userManagement :autList="autList"></userManagement>

    </el-dialog>
    <!-- 我的设置 -->
    <el-dialog :visible.sync="setDialog.set" width="510px" top="10%" center v-show="setDialog.set" :show-close='false'
      custom-class="setDialog" append-to-body>
      <h2>
        {{$t('outside.set')}}
        <i class="el-icon-close" @click="closeSetDialog('set')"></i>
      </h2>
      <userSet></userSet>

    </el-dialog>


    <!-- 操作手册预览 -->
    <el-dialog center :visible.sync="book" :close-on-click-modal="false" :close-on-press-escape="false" width="1200px"
      top="0%" :modal="false" custom-class="setDialog" height="100%" @close="bookurl=''">
      <h2>
        {{$t('outside.czsc')}}
      </h2>

      <embed :src="bookurl" width="98%" v-if="bookurl" height="800px" name="pdf">

    </el-dialog>



  </div>

</template>

<script>
  import router from '../router/index.js'
  import { log } from './api/updateLog.js'
  import userManagement from './orderDetails/userManagement'
  import userSet from './orderDetails/userSet'
  import jcmap from './orderDetails/map'
  import * as animationData from './assets/animate.js';
  // import    from 'element-ui';
  //import 'signalr'

  export default {
    props: {
      autList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    components: {
      userManagement, userSet, jcmap
    },
    data() {
      return {
        //developmenting: false,
        dialogS: false,
        url: "",
        setDialog: { 'contact': false, 'feedback': false, 'updated': false, user: false, set: false, jcdt: false },
        area: '全部',//联系唯凯筛选 
        contactArea: [],//联系人地区
        contactData: [],//联系唯凯数据
        contactHead: [
          { 'field': 'area', title: '地域' },
          // {'field':'system',title:'业务类型'},
          { 'field': 'lxrtitle', title: '岗位' },
          { 'field': 'name', title: '联系人' },
          { 'field': 'email', title: 'EMAIL' },
          { 'field': 'phone', title: '直线' },
          { 'field': 'mobile', title: '手机' },
          // {'field':'fax',title:'传真'},
          // {'field':'weixin',title:'微信'},
        ],
        activities: [],
        feedBackInfo: [
          {
            "id": "000", "name": "姚军", "phone": "021-50104590", "telPhont": "13916321872", "email": "qc.sha@wecanintl.com", "Remarks": "投诉建议联系人", zw: '质检经理'
          }
        ],
        feedBackHead: [
          { field: 'name', title: '姓名' },
          { field: 'zw', title: '职位' },
          { field: 'phone', title: '电话' },
          { field: 'telPhont', title: '手机' },
          { field: 'email', title: '邮箱' }
        ],
        flag: '',//判断是否为管理员 2为管理员
        // statusNums: { wait: '', booked: '', operateing: '', completion: '' },//状态数量
        statusNums: [],//状态数量
        userSet: false,
        mapArea: [
          // {'area':'上海','ckname':[{'name':'空出送货',add:'上海浦东机场江镇物流大道403号(5号库)',lat:'31.186962',lng:'121.77067'},{'name':'空进提货',add:'上海航城路1279号(浦东机场第二监管仓库305甲库)',lat:'31.168751',lng:'121.772604'}]},
          // {'area':'杭州','ckname':[{'name':'空出送货',add:'杭州萧山国际机场航空货站-b国际区',lat:'30.232103',lng:'120.432657'}]},
          // {'area':'深圳','ckname':[{'name':'空出送货',add:'深圳市宝安区机场四路2039号',lat:'22.644777',lng:'113.831733'}]},
          // {'area':'广州','ckname':[{'name':'空出送货',add:'广州国际航空货运站-南门',lat:'23.425071',lng:'113.315893'}]},
          // {'area':'厦门','ckname':[{'name':'空出送货(货站B)',add:'厦门航空港货站翔云一路43号',lat:'24.534626',lng:'118.130877'},{'name':'空出送货(厦航站)',add:'厦门航空港货站翔云一路43号',lat:'24.534626',lng:'118.130877'}]},
          // {'area':'北京','ckname':[{'name':'空出送货(BGS货运站)仓库',add:'北京bgs货运站(货运北路中国国际货运航空内)',lat:'40.099078',lng:'116.597691'},{'name':'空出送货(国航货运站)',add:'北京bgs货运站(货运北路中国国际货运航空内)',lat:'40.071868',lng:'116.594501'}]},
          // {'area':'青岛','ckname':[{'name':'空出送货仓库',add:'青岛空港物流园(华盛)',lat:'36.285498',lng:'120.396356'}]},
          // {'area':'成都','ckname':[{'name':'空出送货(新货站)仓库',add:'成都双流县月星路66号',lat:'30.564439',lng:'103.986255'},{'name':'空出送货(老货站)',add:'成都双流县月星路66号',lat:'30.564439',lng:'103.986255'}]},
          // {'area':'重庆','ckname':[{'name':'空出送货仓库',add:'重庆市江北区海尔路318号',lat:'29.62693',lng:'106.600445'}]},
          // {'area':'郑州','ckname':[{'name':'空出送货仓库',add:'郑州机场国际西货站',lat:'34.537691',lng:'113.83513'}]},
          // {'area':'西安','ckname':[{'name':'空出送货(西部机场国际库)仓库',add:'咸阳国际机场货运中心西部机场集团国际库',lat:'34.432775',lng:'108.758776'},{'name':'空出送货(东航货运国际库)',add:'咸阳国际机场货运中心东航货运国际库',lat:'34.430556',lng:'108.757168'}]},
          // {'area':'武汉','ckname':[{'name':'空出送货(省局仓库)仓库',add:'武汉省局仓库',lat:'30.797206',lng:'114.239456'},{'name':'空出送货(南航仓库)',add:'武汉南航仓库',lat:'30.791343',lng:'114.233995'}]},
          //   {'area':'香港','ckname':[{'name':'空出送货仓库',add:'香港机场骏运路2号机场空运中心107',lat:'22.297499',lng:'113.936292'}]},
          //  {'area':'洛杉矶','ckname':[{'name':'空出送货(JAJ仓库)仓库',add:'JAJ TRANSPORTATION 719 Nogales St.City of Industry CA 91748',lat:'34.00235',lng:'-117.889398'},{'name':'空出送货(Rider仓库)',add:'Transportation & Warehousing 4377 N.Baldwin Ave.El Monte CA 91731',lat:'34.087374',lng:'-118.050859'}]},

        ],
        mapAreaValue: '-1',//进仓地图区域选择
        areaInfo: {},//仓库地图区域数据
        mapIndex: '-1',//选择的仓库
        //status:'',//传节点状态
        book: false,
        bookurl: '',//操作手册文档
        indexUrl: 'http://www.wecanintl.com',
        emailName: '',
        //autList: [],
        // animateOption:{//页面动画
        //   hide:{//收起
        //   animationData: animationData.stop,
        //   renderer: 'svg',
        //   loop: true,
        //   autoplay: false,
        //   },
        //   back:{//返回首页
        //   animationData: animationData.back,
        //   renderer: 'svg',
        //   loop: true,
        //   autoplay: false,
        //   }
        // },
        // anim: {hide:{},back:{}}
      }
    },
    methods: {
      // lottie动画 
      // handleAnimation(anim,type){
      // this.anim[type]=anim
      // },
      //中英文切换
      // lagChange() {
      //   this.$i18n.locale = this.$i18n.locale == "Chinese" ? "English" : "Chinese"
      //   if (this.$i18n.locale == "English") {
      //     document.getElementById('app').className = 'themeE'
      //     window.location.href = './index.html?language=English'
      //   } else {
      //     document.getElementById('app').className = ''
      //     window.location.href = './index.html?language=Chinese'
      //   }
      // },
      //弹框开启
      dialogOpen(au, url, status) {
        //this.$emit('linkto',1);return;
        if (this.autList.map(i => i.aorder).indexOf(au) != '-1') {
          if (this.$store.state.tableTmpAll) {
            //this.dialogS = true;
            //this.url = url;
            this.$emit('linkto', au)
            if (status) {
              this.$store.commit('setStatus', status)
            }
          }
        } else {
          this.$message('您无权限访问')
          return
        }

      },
      //隐藏Hide按钮
      // dialogH() {
      //   this.dialogS = false
      //   this.$store.commit('setStatus', '');
      // },
      //清空导航
      // closeNavAll() {
      //   window.location.reload()
      // },
      //弹框重新打开
      // dialogRecover() {
      //   if (this.url) {
      //     this.dialogS = true;
      //   } else {
      //     this.$outside.error(this.$t('outside.noMission'))
      //   }
      // },
      //官网跳转获取
      getInfo() {

        // if (this.projectIsWecan && !sessionStorage.out_ticket) {
        //   this.$router.push('/login'); return;
        // };

        if (!sessionStorage.out_email) {
          let params = {
            ticket: sessionStorage.ticket,
            gid: sessionStorage.gid
          }
          this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/PubTicket', params, loading: false, tip: false })
            .then(results => {

              if (results.data.resultstatus == 0) {
                sessionStorage.setItem("out_email", results.data.email)
                sessionStorage.setItem("out_isoutside", results.data.isoutside)
                sessionStorage.setItem("out_id", results.data.id)
                sessionStorage.setItem("out_flag", results.data.flag)
                sessionStorage.setItem("out_gid", results.data.gid)
                sessionStorage.setItem("out_logname", results.data.logname)
                sessionStorage.setItem("out_uname", results.data.uname)
                sessionStorage.setItem("out_usr_name", results.data.usr_name)
                sessionStorage.setItem("out_ticket", results.data.ticket)
                sessionStorage.setItem("out_mobile", results.data.mobile)
                sessionStorage.setItem("out_emailpushlist", results.data.emailpushlist)
                sessionStorage.setItem("out_smspushlist", results.data.smspushlist)
                sessionStorage.setItem("out_area", results.data.area)
                sessionStorage.setItem("out_gidarea", results.data.gidarea)

                sessionStorage.setItem('out_storelist', JSON.stringify(results.data.storelist || []))
                this.$store.commit('setEmailpushlist', results.data.emailpushlist)
                this.$store.commit('setSmspushlist', results.data.smspushlist)
                // this.emailName = sessionStorage.out_email
                this.emailName = sessionStorage.out_uname


                //状态数量
                this.statusNum()
                this.flag = sessionStorage.getItem('out_flag')

              } else {
                this.$message.error(results.data.resultmessage)
              }

            })
            .catch(error => {

            })


        } else {


          //状态数量
          this.statusNum()
          this.flag = sessionStorage.out_flag
          this.emailName = sessionStorage.out_email

        }

      },
      // 获取全部groupid
      getGroupid() {

        if (!sessionStorage.getItem('out_groupType')) {
          this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/PubTypeCode', params: { groupid: -1 }, loading: false, tip: false }).then(res => {
            console.log(res.data)

            sessionStorage.setItem("out_groupType", JSON.stringify(res.data))
            this.$store.commit('setGroupData', res.data)
          })
        } else {
          //this.$store.commit('setGroupData',JSON.parse(sessionStorage.groupType))
        }

        if (!sessionStorage.getItem('out_serviceDataGroup')) {
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/GetServiceBasicGroup",
            params: { area: "" },
            loading: false,
            tip: false
          }).then(res => {
            sessionStorage.setItem("out_serviceDataGroup", JSON.stringify(res.data));
          });
        }

      },
      //获取状态,港口,节点
      getStatusArr() {
        // if (!sessionStorage.getItem('out_statusData')) {

        //   this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/PubNodeBasic', params: {}, loading: false, tip: false }).then(res => {
        //     console.log(res.data)
        //     sessionStorage.setItem("out_statusData", JSON.stringify(res.data))
        //   })
        // }

        // if (!sessionStorage.getItem('out_hbinfo')) {

        //   this.$axios({ method: 'get', url: this.$store.state.publicWebApi + "api/PubAirPortArea", params: {}, loading: false, tip: false }).then(results => {
        //     console.log(results.data)
        //     sessionStorage.setItem('out_hbinfo', JSON.stringify(results.data))
        //   })
        // }

        // if (!sessionStorage.getItem("out_airinfo")) {
        //   this.$axios({
        //     method: "get",
        //     url: this.$store.state.publicWebApi + "api/PubAirCompany",
        //     params: { area: "" },
        //     loading: false,
        //     tip: false
        //   }).then(results => {
        //     sessionStorage.setItem("out_airinfo", JSON.stringify(results.data));
        //   });
        // }

        if (!sessionStorage.getItem('out_nodeArr')) {
          this.$axios({ method: 'get', url: this.$store.state.publicWebApi + "api/PubNodeBasicPush", params: {}, loading: false, tip: false }).then(results => {
            console.log(results.data)
            sessionStorage.setItem('out_nodeArr', JSON.stringify(results.data))
          })
        }
        // if (!sessionStorage.out_address) {
        //   this.$axios({
        //     method: "get",
        //     url: this.$store.state.publicWebApi + "api/PubCityName",
        //     params: "",
        //     loading: false,
        //     tip: false
        //   })
        //     .then(response => {
        //       sessionStorage.setItem('out_address', JSON.stringify(response.data))
        //     })
        // }

      },
      //获取服务
      getService() {
        if (!sessionStorage.getItem('out_serviceData')) {
          this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/ExServiceBasic', params: { area: '' }, loading: false, tip: false }).then(res => {
            sessionStorage.setItem("out_serviceData", JSON.stringify(res.data))
          })
        }

      },
      //获取状态数量
      statusNum() {
        this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/ExHpoBoAxplineCount', params: {}, loading: true, tip: false }).then(res => {
          this.statusNums = res.data
        })
      },

      //获取币种
      // getCurrency () {
      //       if (sessionStorage.getItem('currencyData')) return
      //       this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubRate',params:{area:''},loading:false,tip:false}).then(res=>{
      //         sessionStorage.setItem("currencyData",JSON.stringify(res.data))
      //       })
      //     },

      //意见反馈，更新日志，联系唯凯，用户管理，设置
      contactUs(mark) {
        if (mark == 'contact') {
          if (this.contactData.length == 0) {
            this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/ExCustomRel', params: { gid: sessionStorage.out_gid, lxrss: 1 }, loading: false, tip: false })
              .then(res => {
                this.contactData = res.data
                this.contactData.forEach(item => {
                  if (this.contactArea.indexOf(item.area) == -1) {
                    this.contactArea.push(item.area)
                  }
                })
                // console.log(res.data)
              })
              .catch(error => {

              })
          }
        } else if (mark == 'updated') {
          this.activities = log
        } else if (mark == 'user') {


        } else if (mark == 'jcdt') {
          //this.mapAreaValue='0'
          if (!this.mapArea.length) {
            this.$axios({ method: 'get', url: this.$store.state.webApi + 'api/PubStoreMap', params: {}, loading: false, tip: false })
              .then(res => {
                res.data.forEach(item => {
                  this.mapArea.push(item)
                })
                console.log(this.mapArea)
                let index = 0
                for (var i = 0; i < this.mapArea.length; i++) {
                  if (this.mapArea[i].area == localStorage.loginarea) {
                    index = i
                  }
                }
                this.mapAreaValue = index
                //mapAreaValue
                //this.toMap(this.mapArea[0].ckname[0],0)
                //console.log(this.mapArea[0].ckname)
                //console.log(res.data)
                //this.mapArea=res.data
              })
              .catch(error => {

              })
          } else {
            this.mapAreaValue = 0
          }
          //console.log(this.mapArea[])
          //this.toMap(this.mapArea[0].ckname[0],0)

          //this.mapAreaValue=0

        } else if (mark == 'set') {
          if (sessionStorage.out_isoutside == '2') {
            return false
          }
        }
        //setTime
        Object.keys(this.setDialog).forEach(item => {
          if (item != mark) {
            this.setDialog[item] = false
          } else {
            // if(item=='jcdt'){
            //     setTimeout(() => {
            //        this.setDialog[item] = true
            //     },3000)
            // }else{
            //   this.setDialog[item] = true
            // }
            this.setDialog[item] = true
          }
        })
      },
      //仓库地图传数据
      toMap(data, index) {
        this.mapIndex = index
        this.areaInfo = data
      },



      //关闭弹框
      closeSetDialog(mark) {
        Object.keys(this.setDialog).forEach(item => {
          this.setDialog[item] = false
        })
      },
      loginout() {

        sessionStorage.clear()
        //  localStorage.clear()
        // window.location.href = window.location.origin
        if (this.projectIsWecan) {
          window.location.href = "http://www.wecanintl.com"
        } else {
          this.$router.push({ path: '/login' })
        }

      },
      // 递归导航
      navArray(data, pid, index) {
        var result = [];
        var num = 1
        for (var i = 0; i < data.length; i++) {
          if (data[i].code == pid) {
            var obj = data[i]
            this.$set(obj, 'index', !index ? num : index + '-' + num)
            num++
            obj.children = this.navArray(data, data[i].classify, obj.index)
            result.push(obj)
          }
        }
        console.log(result)
        return result;
      },
    },
    watch: {

      mapAreaValue: {
        handler(val) {
          if (val != '-1' && this.mapArea && this.mapArea[val]) {
            //console.log(this.mapArea[val].ckname)
            this.toMap(this.mapArea[val].ckname[0], val)

          }
        }
        //immediate:true
      },





    },
    computed: {

    },
    created: function () {

      //从官网登录获取票据请求
      //if (this.developmenting) return;
      if (sessionStorage.ticket && sessionStorage.gid) {
        this.getInfo()
        this.getStatusArr()
      }

      // if (this.projectIsWecan && !sessionStorage.ticket) {
      //     this.$router.push('/login'); return;
      // };
      this.emailName = localStorage.userEmail
      //获取数量
      // this.statusNum()

      //获取所有groupid
      // this.getGroupid()

      //获取所有状态
      //获取状态数量

      //获取币种
      //this.getCurrency()

      //获取所有服务
      // this.getService()


      // if (window.location.href.indexOf('language') != '-1') {
      //   this.$i18n.locale = window.location.href.substring(window.location.href.indexOf('=') + 1, window.location.href.indexOf('#'))
      // }

      // if(!this.projectIsWecan){
      //       this.indexUrl=window.location.origin+'/#login'
      //  }









    }

  }

</script>


<style lang="less" scoped>
  .wrap {
    position: fixed;
    // background:url('./outsideDom/static/images/background.png');background-size:100% 100%;
    background: url('./static/images/background.png');
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-size: 100%;
    -webkit-background-size: 100%;
    -o-background-size: 100%;
    background-position: center 0;

    .wrap-mask {
      position: relative;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, .1);

      .top_user {
        width: 100%;
        height: 100px;
        line-height: 100px;

        .leftImage {
          width: 100px;
          float: left;
          text-align: center;
          background: #fff;
        }

        .rightUser {
          height: 100%;
          float: right;
          color: #fff;

          span {
            margin-right: 18px;
            cursor: pointer;
            font-size: 14px;

            &:hover {
              color: rgb(248, 152, 40);
            }
          }

          p {
            a {
              margin-left: 20px;
              color: #fff;

              &:hover {
                color: rgb(248, 152, 40);
              }

            }

          }

          .userMan {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: rgba(75, 101, 120, .3);
            border-radius: 36px;
            vertical-align: middle;
            line-height: 36px;
            text-align: center;
          }
        }
      }

      .operation_User {
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -280px -550px;

        height: 360px;

        .welcome {
          font-weight: bold;
          color: #fff;
          font-size: 50px;
          margin-bottom: 42px;
        }

        .operationLeft {
          padding: 20px;
          background: #fff;
          display: inline-block;
          margin-right: 58px;
          vertical-align: middle;
          width: 700px;
          height: 360px;
          padding-top: 40px;

          .stateTop {
            div {
              display: inline-block
            }

            ;

            .marginR {
              /* margin-right:7px; */
            }

            border-bottom:1px solid #f2f2f2;
            margin-bottom:40px;
            padding-bottom:28px;
            cursor:pointer;
            font-size:14px;

            .stateTopB {
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 8px;
              margin-right: 8px;
            }

            .stateN {
              //margin-left:10px;
            }

          }

          .searchBottom {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            align-content: stretch;
            flex-wrap: nowrap;
            justify-content: space-between;

            .searchList {
              text-align: center;
              cursor: pointer;
              font-size: 16px;
              color: #222;

              span {
                display: block;
                width: 100px;
                height: 100px;
                line-height: 126px;
                border-radius: 90px;
                border: 1px solid #f2f2f2;
                text-align: center;
                margin-bottom: 26px;
                letter-spacing: 0.1em;
              }

            }
          }

        }

        .operationRight {
          display: inline-block;
          width: 354px;
          font-weight: bold;
          vertical-align: middle;

          >div {
            cursor: pointer;
          }

          .outAdd {
            height: 113px;
            background: url('./static/images/orderAdd.png') no-repeat center;
            margin-bottom: 12px;
            position: relative;
          }

          .outAccount {
            height: 113px;
            background: url('./static/images/outerAccount.png') no-repeat center;
            margin-bottom: 12px;
            position: relative;
          }

          .outInvoice {
            height: 113px;
            background: url('./static/images/invoiceGet.png') no-repeat center;
            position: relative;
          }

          .theme {
            position: absolute;
            right: 0;
            bottom: 0;
            color: #fff;
            height: 0;
            width: 150px;
            line-height: 30px;
            letter-spacing: 0.1em;
            border-width: 0px 0px 30px 30px;
            border-style: none solid solid;
            border-color: transparent transparent rgba(248, 152, 40, .9);
            text-align: center;
            cursor: pointer;
          }
        }

      }

      .showMession {
        position: absolute;
        bottom: 40px;
        right: 40px;
        cursor: pointer;
      }
    }

    .dialogWrap-enter,
    .dialogWrap-leave-to {
      transform: translateY(100%);
    }

    .dialogWrap-enter-active,
    .dialogWrap-leave-active {
      pointer-events: none;
    }

  }

  // @keyframes fadelogIn {
  //     0% {
  //         -webkit-transform: translate3d(0, 100%, 0);
  //         -webkit-transform: translate3d(0, 100%, 0);
  //         transform: translate3d(0, 100%, 0);
  //         transform: translate3d(0, 100%, 0);
  //     }
  //     100% {
  //         -webkit-transform: none;
  //         transform: none;
  //     }
  // }

  // @-webkit-keyframes fadelogIn {
  //     0% {
  //         -webkit-transform: translate3d(0, 100%, 0);
  //     }
  //     100% {
  //         -webkit-transform: none;
  //     }
  // }

  /deep/.setDialog {
    .el-dialog__header {
      padding: 0
    }

    border-radius:5px;
    padding:10px;

    .el-dialog__body {
      h2 {
        color: #000;
        margin-bottom: 20px;

        i {
          float: right;
          color: #606266;
          font-size: 22px;
          cursor: pointer;

        }

        .ckname {
          display: inline-block;
          background: #FAFAFA;
          color: #A1A1A1;
          min-width: 100px;
          padding-left: 8px;
          padding-right: 8px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          margin-left: 12px;
          font-size: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: normal;

          &:hover {
            background: #E3EFFC;
            color: #2B91FA
          }
        }

        .active {
          display: inline-block;
          background: #E3EFFC;
          color: #2B91FA;
          min-width: 100px;
          padding-left: 8px;
          padding-right: 8px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          margin-left: 12px;
          font-size: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: normal;

        }

        // img{
        //    max-width: none!important;
        //    max-height:none!important;
        // }


      }
    }
  }
</style>