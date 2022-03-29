<template>
  <div class="frmCustomJob">
    <div class="page-container-box">
      <newSearchComp :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="newFormCmptShow"
        :pagetype="1">
      </newSearchComp>

      <div class="searchForm">
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </div>
    </div>

    <tableCompt :name="name" :table-data-res="tableDataRes" :showTotal="{all: false}" class="tableCompt">

      <template slot="operate" slot-scope="props">
        <p style="text-align: left;">
          <i @click="openDetail(props.data.row, props.data.index,2)" class="el-icon-setting" title="详细" style="font-size:16px;"></i>
          <template v-if="props.data.row.isdel == 1  && props.data.row.approvalstatus == 1">
            <i @click="showOrderBack(props.data.row, props.data.index)" style="color: red;margin-left:10px;font-size:16px;" class="el-icon-error" title="驳回"></i>
            <i @click="orderPass(props.data.row.id, props.data.row.jobdom, props.data.index)" style="color:#3c9;margin-left:10px;font-size:16px;" class="el-icon-success" title="通过"></i>
          </template>
        </p>
      </template>
      <template slot="creditisbackstatusCn" slot-scope="props">
        <span v-html="transCibsCn(props.data.row.creditisbackstatusCn)"></span>
      </template>
      <template slot="area" slot-scope="props">
        {{ props.data.row.jobarea }}
      </template>
      <template slot="locktitle" slot-scope="props">

        <el-tooltip class="item" effect="dark" :content="props.data.row.locktitle" placement="top-start">
           <span>{{ props.data.row.locktitle }}</span>
        </el-tooltip>
      </template>
      <template slot="usr_name" slot-scope="props">
        {{ props.data.row.usr_name ? props.data.row.usr_name.split('-')[0] : '' }}
      </template>
      <template slot="hbrq" slot-scope="props">
        {{ props.data.row.hbrq && !props.data.row.hbrq.includes('1900') ? props.data.row.hbrq.substr(0, 10) : '' }}
      </template>
      <template slot="lockdate" slot-scope="props">
        {{ props.data.row.lockdate && !props.data.row.lockdate.includes('1900') ? new Date(props.data.row.lockdate).Format('yyyy-MM-dd hh:mm:ss') : '' }}
      </template>
      <template slot="adddate" slot-scope="props">
        {{ props.data.row.adddate && !props.data.row.adddate.includes('1900') ? new Date(props.data.row.adddate).Format('yyyy-MM-dd hh:mm:ss') : '' }}
      </template>
      <template slot="IsinwageallinCn" slot-scope="props">
        {{ props.data.row.isinwageallinCn }}
      </template>
      <template slot="inwageallinprice" slot-scope="props">
        {{ props.data.row.inwageallinprice=='666666'?'--': props.data.row.inwageallinprice}}
      </template>

      <template slot="jobno" slot-scope="props">
        <span class="poczColor" @click="openDetail(props.data.row,props.data.index,1)">{{ props.data.row.jobno }}</span>
      </template>

    </tableCompt>

    <el-dialog
       title="信控审批"
      :visible.sync="OrderVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="dialogPage"
      :modal="false"
      width="90%"
      top="20px"
      v-if="OrderVisible"
      center>
      <infoList :inputModelData="inputModelDataInfoList" v-if="showListInfo"  name="详细"></infoList>
      
      <div class="detail basic-information" style="max-width:1300" v-if="inputModelDataInfoList&&inputModelDataInfoList.area">
          <div class="detail-title">
            <p>信控信息</p>
          </div>
          <div class="detail-c" >
             <el-row>
              <el-col :span="24">
                <span class="label">公司名称：</span>
                <span class="content"> {{ cur_baseinfo.fusr_name }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">销售员：</span>
                <span class="content"> {{ cur_baseinfo.salesname }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">合同状态：</span>
                <span :class="['content',{'red': cur_baseinfo.iscontract != '1'}]"> {{ cur_baseinfo.iscontract == '1' ? '有有效合同' : '无有效合同' }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">信用等级：</span>
                <span class="content"> {{ cur_baseinfo.typename }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">信用额度(元)：</span>
                <span class="content"> {{ Number(cur_baseinfo.creditlimit).toFixed(2) }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生额度(元)：</span> 
                <!-- && cur_baseinfo.cmonth > 0 --> 
             <span :class="['content',{'red': cur_baseinfo.realwageall != 0 }]"> {{ Number(cur_baseinfo.realwageall).toFixed(2) }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label red">超出额度：</span>
                <span class="content red"> {{ Number(cur_baseinfo.cmoney).toFixed(2) }} </span>
              </el-col>
              <!-- <el-col :span="1">
                <span @click="creditlistVisible = !creditlistVisible" style="color:#7894F1;cursor:pointer;">
                  <span v-if="!creditlistVisible">更多...</span>
                  <span v-else>收起</span>
                </span>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">信用天数(天)：</span>
                <span class="content"> {{ cur_baseinfo.creditdays }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生天数(天)：</span>
                <span :class="['content',{'red': cur_baseinfo.creditdays != 0 && cur_baseinfo.cdate > 0}]"> {{ cur_baseinfo.date }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditdays != 0 && cur_baseinfo.cdate > 0">
                <span class="label red">超出天数：</span>
                <span class="content red"> {{ cur_baseinfo.cdate }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">预设总重量：</span>
                <span class="content"> {{ cur_baseinfo.creditweightall }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生总重量：</span>
                <span :class="['content',{'red': cur_baseinfo.creditweightall != 0 && cur_baseinfo.cweightin > 0}]"> {{ cur_baseinfo.jfweightin }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditweightall != 0 && cur_baseinfo.cweightin > 0">
                <span class="label red">超出重量：</span>
                <span class="content red"> {{ cur_baseinfo.cweightin }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">预设单票重量：</span>
                <span class="content"> {{ cur_baseinfo.creditweight }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生单票重量：</span>
                <span :class="['content',{'red': cur_baseinfo.creditweight != 0 && cur_baseinfo.cweight > 0}]"> {{ cur_baseinfo.weight }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditweight != 0 && cur_baseinfo.cweight > 0">
                <span class="label red">单票超出重量：</span>
                <span class="content red"> {{ cur_baseinfo.cweight }} </span>
              </el-col>
            </el-row>
             
            <!-- <newFormCmpt :view-data.sync="homeInformation" :model-data.sync="cur_baseinfo"
              :pagetype="2" :area="inputModelDataInfoList.area" :system="inputModelDataInfoList.system">
            </newFormCmpt> -->
          </div>
      </div>
      <div class="detail basic-information" style="max-width:1300" >
         <div class="detail-title">
            <p>欠款明细</p>
          </div>
          <div class="detail-c" >
            <commonTable class="commonTable" :head="creditlist_table_head" :table-data="creditlist_table_data" :tableIndex="0"      v-if="creditlist_table_data" style="margin-top:20px;">
            </commonTable>
          </div>
      </div>
      <!-- <div class="OrderDetail">
        <div class="detail">
          <div class="detail-title">
            <p>公司信息</p>
          </div>
          <div class="detail-c">
            <el-row>
              <el-col :span="24">
                <span class="label">公司名称：</span>
                <span class="content"> {{ cur_baseinfo.fusr_name }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">销售员：</span>
                <span class="content"> {{ cur_baseinfo.salesname }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">合同状态：</span>
                <span :class="['content',{'red': cur_baseinfo.iscontract != '1'}]"> {{ cur_baseinfo.iscontract == '1' ? '有有效合同' : '无有效合同' }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">信用等级：</span>
                <span class="content"> {{ cur_baseinfo.typename }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">当月信用额度(元)：</span>
                <span class="content"> {{ cur_baseinfo.creditlimit_month }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生额度(元)：</span> -->
                <!-- && cur_baseinfo.cmonth > 0 --> 
               <!--  <span :class="['content',{'red': cur_baseinfo.realwageall != 0 }]"> {{ cur_baseinfo.realwageall }} </span>
              </el-col>
              <el-col :span="6" v-if="cur_baseinfo.creditlimit_month != 0 && cur_baseinfo.cmonth > 0">
                <span class="label red">当月超出额度：</span>
                <span class="content red"> {{ cur_baseinfo.cmonth }} </span>
              </el-col>
              <el-col :span="1">
                <span @click="creditlistVisible = true" style="color:#7894F1;cursor:pointer;">更多...</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">信用天数(天)：</span>
                <span class="content"> {{ cur_baseinfo.creditdays }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生天数(天)：</span>
                <span :class="['content',{'red': cur_baseinfo.creditdays != 0 && cur_baseinfo.cdate > 0}]"> {{ cur_baseinfo.date }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditdays != 0 && cur_baseinfo.cdate > 0">
                <span class="label red">超出天数：</span>
                <span class="content red"> {{ cur_baseinfo.cdate }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">预设总重量：</span>
                <span class="content"> {{ cur_baseinfo.creditweightall }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生总重量：</span>
                <span :class="['content',{'red': cur_baseinfo.creditweightall != 0 && cur_baseinfo.cweightin > 0}]"> {{ cur_baseinfo.jfweightin }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditweightall != 0 && cur_baseinfo.cweightin > 0">
                <span class="label red">超出重量：</span>
                <span class="content red"> {{ cur_baseinfo.cweightin }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">预设单票重量：</span>
                <span class="content"> {{ cur_baseinfo.creditweight }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">发生单票重量：</span>
                <span :class="['content',{'red': cur_baseinfo.creditweight != 0 && cur_baseinfo.cweight > 0}]"> {{ cur_baseinfo.weight }} </span>
              </el-col>
              <el-col :span="7" v-if="cur_baseinfo.creditweight != 0 && cur_baseinfo.cweight > 0">
                <span class="label red">单票超出重量：</span>
                <span class="content red"> {{ cur_baseinfo.cweight }} </span>
              </el-col>
            </el-row>
          </div>
        </div> -->

        <!-- <div class="detail">
          <div class="detail-title">
            <p>业务信息</p>
          </div>
          <div class="detail-c">
            <el-row>
              <el-col :span="28">
                <span class="label">客户名称：</span>
                <span class="content"> {{ cur_baseinfo.usr_name }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">状态：</span>
                <span class="content"> {{ cur_baseinfo.creditisbackstatusCn }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">区域：</span>
                <span class="content"> {{ cur_baseinfo.jobarea }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">操作类型：</span>
                <span class="content"> {{ cur_baseinfo.czlx }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">工作号：</span>
                <span class="content"> {{ cur_baseinfo.jobno }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">总运单号：</span>
                <span class="content"> {{ cur_baseinfo.mawb }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">上榜人：</span>
                <span class="content"> {{ cur_baseinfo.addman }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">上榜时间：</span>
                <span class="content"> {{ cur_baseinfo.adddate }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">工作号类型：</span>
                <span class="content"> {{ cur_baseinfo.jobdom }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">节点：</span>
                <span class="content"> {{ cur_baseinfo.node }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">件/重/体：</span>
                <span class="content"> {{ cur_baseinfo.pwv }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">始发港：</span>
                <span class="content"> {{ cur_baseinfo.sfg }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">目的港：</span>
                <span class="content"> {{ cur_baseinfo.mawbmdg }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">航班日期：</span>
                <span class="content"> {{ cur_baseinfo.hbrq }} </span>
              </el-col>
              <el-col :span="7">
                <span class="label">航班号：</span>
                <span class="content"> {{ cur_baseinfo.hbh }} </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <span class="label">锁定描述：</span>
                <span class="content red"> {{ cur_baseinfo.locktitle }} </span>
              </el-col>
            </el-row>
          </div>
        </div> -->

        <el-row class="footer">
          <el-col :span="4">
            <span>创建人：{{ cur_baseinfo.addman }}</span>
          </el-col>
          <el-col :span="7">
            <span>创建时间：{{ cur_baseinfo.adddate }}</span>
          </el-col>
        </el-row>

        <div class="btn-c">
          <el-button @click="OrderVisible = false" style="float:left">返回</el-button>
          <div v-if="!hideOperateBtn" style="float:right">
            <el-button @click="orderPass(cur_baseinfo.id, cur_baseinfo.jobdom, cur_index)" type="primary">通过</el-button>
            <el-button @click="orderBackVisible = true" type="danger">驳回</el-button>
          </div>
        </div>
 

    </el-dialog>

    <el-dialog
      width="800px"
      top="6%"
      center
      :visible.sync="orderBackVisible"
      v-if="orderBackVisible"
      append-to-body
      custom-class="reason">

      <div>
        <h3>驳回原因</h3>
        <p class="orderNo">
          <span>{{ cur_row.jobno }}</span>
        </p>
        <ul>
          <li>总运单号</li>
          <li>始发港</li>
          <li>目的港</li>
          <li>航班号</li>
          <li>航班日期</li>
        </ul>
        <ul>
          <li>{{ cur_row.mawb }}</li>
          <li>{{ cur_row.sfg }}</li>
          <li>{{ cur_row.mawbmdg }}</li>
          <li>{{ cur_row.hbh }}</li>
          <li>{{ cur_row.hbrq ? cur_row.hbrq.substring(0,10) : '' }}</li>
        </ul>
        <div class="reason-history" v-if="cur_baseinfo.creditcontent.length">
          <p v-for="(content, index) in cur_baseinfo.creditcontent" :key="index">
            <span>{{ content.adddate }}</span>
            <span>驳回人： {{ content.addman }}</span>
            <span>驳回原因： {{ content.content }}</span>
          </p>
        </div>

        <el-input type="textarea" v-model="orderBackReason" class="input-required" :autosize="{minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="驳回原因输入框"></el-input>

        <p style="margin-top:18px;text-align:right">
          <el-button type="primary" @click="orderBack(cur_row)">确定</el-button>
          <el-button @click="orderBackVisible = false">取消</el-button>
        </p>
      </div>

    </el-dialog>

    <!-- <el-dialog
      width="800px"
      top="6%"
      center
      :visible.sync="creditlistVisible"
      v-if="creditlistVisible"
      append-to-body
      custom-class="reason">

      <commonTable class="commonTable" :head="creditlist_table_head" :table-data="creditlist_table_data" :tableIndex="0">
      </commonTable>

    </el-dialog> -->

    
    <el-dialog title="综合查询" v-if="orderShow" center :visible.sync="orderShow" class="dialogPage"
      :close-on-click-modal="false" :close-on-press-escape="false" width="100%" top="0px" :modal="false">
      <mawbaddput :visible.sync="orderShow" :pagetype="20" :boguid="inputModelDataInfoList.boguid" :area="inputModelDataInfoList.area"
        :mawbguid="inputModelDataInfoList.guid" :orderdom="inputModelDataInfoList.orderdom"></mawbaddput>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'frmCustomJob',
  props:{
    showListInfo: {//显示摘要
        type: Boolean,
        default: true
      },
  },
  data () {
    return {
      name:"frmCustomJob.vue",
      cur_row: {},
      cur_index: -1,
      cur_baseinfo: {},

      cur_creditlist: [],

      OrderVisible: false,
      orderBackVisible: false,
      //creditlistVisible: false,
      orderBackReason: '',  // 驳回原因
      tableDataRes: [],

      inputViewData: {
         system: {title: '所属系统', type: 5, whereStr: 'in', options: []},  // groupid: 57
         //czlx: {title: '操作类型', type: 5, whereStr: 'in', options: []},
      },
      newFormCmptShow: true,
      inputModelData: {
        approvalstatus: '1'
      },
      searchData: {},

      creditlist_table_data: [],
      creditlist_table_head: [
        { field: "area", title: "区域/系统"},
      ],
      inputModelDataInfoList:{},//摘要明细
      orderShow:false,//mawbAddput显示隐藏
      // homeInformation:{
      //   fusr_name:{
      //     title:'公司名称：',
      //     type: 1,
      //   },
      //   salesname:{
      //     title:'销售员：',
      //     type: 1,
      //   },
      //   iscontract:{
      //     title:'合同状态：',
      //     type: 1,
      //   },
      //   typename:{
      //     title:'信用等级：',
      //     type: 1,
      //   },
      //   creditlimit_month:{
      //     title:'当月信用额度(元)：',
      //     type: 1,
      //   },
      //   realwageall:{
      //     title:'发生额度(元)：',
      //     type: 1,
      //   },
      //   cmonth:{
      //     title:'当月超出额度：',
      //     type: 1,
      //     //hidden:()=>{return this.cur_baseinfo.creditlimit_month != 0 && this.cur_baseinfo.cmonth > 0}
      //   },
      //   more:{
      //     title:'更多'
      //   },
      //   creditdays:{
      //     title:'信用天数(天)：',
      //     type:1
      //   },
      //   creditdays:{
      //     title:'发生天数(天)：',
      //     type:1,
      //     //contentStyle:{color:(this.cur_baseinfo.creditdays != 0 && this.cur_baseinfo.cdate > 0?'red':'')}
      //   },
      //   cdate:{
      //     title:'超出天数：',
      //     type:1,
      //      //hidden:()=>{return this.cur_baseinfo.creditdays != 0 && this.cur_baseinfo.cdate > 0}
      //   },
      //   creditweightall:{
      //     title:'预设总重量：',
      //     type:1,
      //   },
      //   jfweightin:{
      //     title:'发生总重量：',
      //     type:1,
      //      //contentStyle:{color:(this.cur_baseinfo.creditweightall != 0 && this.cur_baseinfo.cweightin > 0?'red':'')}
      //   },
      //   cweightin:{
      //     title:'超出重量：',
      //     type:1,
      //   },
      //   creditweight:{
      //      title:'预设单票重量：',
      //     type:1,
      //   },
      //   weight:{
      //     title:'发生单票重量：',
      //     type:1,
      //     //contentStyle:{color:(this.cur_baseinfo.creditweight != 0 && this.cur_baseinfo.cweight > 0?'red':'')}
      //   },
      //   cweight:{
      //     title:'单票超出重量：',
      //     type:1,
      //       //hidden:()=>{return this.cur_baseinfo.creditweight != 0 && this.cur_baseinfo.cweight > 0}
      //   }
      // }
    }
  },
  created () {
    this.inputViewData.system.options = JSON.parse(localStorage.groupType).filter(i => i.groupid == 57).map(i => {
      return { label: i.typename, value: i.typename }
    })

    // this.$axios({method:'get',url:this.$store.state.wcWebApi+'api/OperaType',params: {},loading:false,tip:false})
    // .then(result => {
    //   if (result.data.length != 0) {
    //     this.czlxOptionsBackup = result.data.map(i => {
    //       return {label: i.typename, value: i.typename}
    //     })
    //     this.inputViewData.czlx.options = this.czlxOptionsBackup
    //   }
    // })
  },
  computed: {
    hideOperateBtn () {
      // isdel等于1 并且状态不等于已通过和已驳回时显示驳回和通过按钮
      // || this.cur_baseinfo.creditisbackstatus == 1 || this.cur_baseinfo.creditisbackstatus == 3 || this.cur_baseinfo.creditisbackstatus == 5
      return this.cur_baseinfo.isdel != 1 || this.cur_row.approvalstatus != 1
    }
  },
  watch: {
    orderBackVisible () {
      this.orderBackReason = ''
    }
  },
  methods: {
    reset(){
      this.inputModelData = {}
    },
    search () {
      var jsonArr2={
        where: {
          jobarea: {'in': this.$store.state.areaState},
          logname:localStorage.usrname,
          ...this.searchData
        },
        order: "id desc"
      }

      jsonArr2.where.isdel = 1
      // lockstatus选择已删除时isdel等于2
      if (jsonArr2.where.lockstatus) {
        let statusArr = jsonArr2.where.lockstatus.in.split(',')
        if (statusArr.includes('3')) {
          jsonArr2.where.isdel = 2
          jsonArr2.where.lockstatus.in = statusArr.filter(i => i != 3).join(',')
        }
      }

      var json={'json':JSON.stringify(jsonArr2)}

      this.$axios({method:'get',url:this.$store.state.wcWebApi+'api/CustomJob/GetCreditOrderList',params:json,loading:true,tip:false,noarea:true})
      .then(result=>{
        if (result.data.length == 0) {
          this.tableDataRes = []
          return this.$message('无查询结果')
        }

        this.tableDataRes = result.data

        setTimeout(() => {
          this.newFormCmptShow = false
        }, 100)
      })
    },
    openDetail (row, index,type) {
      this.creditlist_table_data=[]
      this.creditlist_table_head=[{field: "area", title: "区域/系统"}]
      this.$axios({method:'get',url:this.$store.state.wcWebApi+'api/CustomJob/details',params:{id: row.id},loading:true,tip:false})
      .then(result=>{
        if (result.data.baseinfo == null) {
          return this.$message.error('获取信息出错')
        }
        this.getmawbdetail(result.data.baseinfo.sid).then(res=>{
          this.inputModelDataInfoList=res
        })
        this.cur_row = row
        this.cur_index = index
        this.cur_baseinfo = result.data.baseinfo
        this.cur_creditlist= result.data.credittotallist
        //this.cur_creditlist=result.data.creditlist
      
        let itemList=[]
        this.cur_creditlist.forEach(item=>{
          if(!itemList.includes(item.system)){
            itemList.push(item.system)
            this.creditlist_table_head.push({field:item.system,title:item.system})
          }
        })
        Array.from(new Set(this.cur_creditlist.map(i=>i.area))).forEach(item=>{
          this.creditlist_table_data.push({area:item})
          this.cur_creditlist.filter(i=>i.area==item).forEach(list=>{
            this.$set(this.creditlist_table_data[this.creditlist_table_data.length-1],list.system,Number(list.total).toFixed(2))
          })
        })
        
        //this.creditlist_table_head=this.creditlist_table_head.concat(this.cur_creditlist.map(i=>))
        // let month_obj = {}
        // this.cur_creditlist.forEach(item => {
        //   this.creditlist_table_head.push({
        //     field: item.area, title: item.area
        //   })
        //   item.monthmoneylist.forEach(listitem => {
        //     month_obj[listitem.month] = month_obj[listitem.month] || {}
        //     month_obj[listitem.month][item.area] = listitem.money
        //   })
        // })
        // this.creditlist_table_data = Object.keys(month_obj).map(key => {
        //   let total = Object.values(month_obj[key]).reduce((p, v) => p += (v * 10000), 0) / 10000
        //   return {...month_obj[key], month: key, total}
        // })

        try {
          this.cur_baseinfo.creditcontent = this.cur_baseinfo.creditcontent ? JSON.parse(this.cur_baseinfo.creditcontent) : []
        } catch (error) {
          this.cur_baseinfo.creditcontent = []
        }
        this.cur_baseinfo.adddate = new Date(this.cur_baseinfo.adddate).Format('yyyy-MM-dd hh:mm:ss')
        this.cur_baseinfo.hbrq = this.cur_baseinfo.hbrq ? this.cur_baseinfo.hbrq.split('T')[0] : ''
        this.cur_baseinfo.lockdate = this.cur_baseinfo.lockdate.includes('1900-01-01') ? '' : new Date(this.cur_baseinfo.lockdate).Format('yyyy-MM-dd hh:mm:ss')
        if(type=='2'){
           this.OrderVisible = true
        }else{
           this.orderShow=true
        }
        

        /////////
        //this.cur_baseinfo.cmonth = this.cur_baseinfo.monthwageall - this.cur_baseinfo.creditlimit_month

        this.cur_baseinfo.cmoney = this.cur_baseinfo.realwageall - this.cur_baseinfo.creditlimit
      })

    },
    async getmawbdetail(boguid) {//获取订单明细
        if (boguid == -1) return false
        return await this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: { boguid: boguid },
          loading: true,
          tip: false
        }).then(result => {
          return result.data
        })
    },
    orderPass (id, jobdom, index) {
      let data = {
        id,
        jobdom
      }
      //data.czman='罗明'
      this.$axios({method:'post',url:this.$store.state.wcWebApi+'api/CustomJob/Pass',data,loading:true,tip:false,noarea:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.$message.success(result.data.resultmessage)
          this.tableDataRes.splice(index, 1)
          this.OrderVisible = false
        } else {
          this.$message.error(result.data.resultmessage)
        }
      })
    },
    showOrderBack (row, index) {
      this.$axios({method:'get',url:this.$store.state.wcWebApi+'api/CustomJob/details',params:{id: row.id},loading:true,tip:false})
      .then(result=>{
        if (result.data.baseinfo == null) {
          return this.$message.error('获取信息出错')
        }
        this.cur_row = row
        this.cur_index = index
        this.cur_baseinfo = result.data.baseinfo
        try {
          this.cur_baseinfo.creditcontent = this.cur_baseinfo.creditcontent ? JSON.parse(this.cur_baseinfo.creditcontent) : []
        } catch (error) {
          this.cur_baseinfo.creditcontent = []
        }
        this.orderBackVisible = true
      })
    },
    orderBack (row) {
      if (this.orderBackReason == '') {
        return this.$message.error('请填写驳回原因')
      }
      let data = {
        sid: row.sid,
        jobdom: row.jobdom,
        content:this.orderBackReason
        // content: JSON.stringify({
        //   addman: localStorage.usrname,
        //   adddate: new Date().Format('yyyy-MM-dd hh:mm:ss'),
        //   content: this.orderBackReason
        // })
      }

      this.$axios({method:'post',url:this.$store.state.wcWebApi+'api/CustomJob/Back',data,loading:true,tip:true,noarea:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          this.orderBackVisible = false
          this.OrderVisible = false
          this.search()
        }
      })
    },
    transCibsCn (status) {
      let style = ''
      switch (status) {
        case '已通过无异常':
          style = 'color: green;'
          break
        default:
          style = 'color: red;'
          break
      }
      return `<span style="${style}">${status}</span>`
    }
  }
}
</script>

<style lang="less" scoped>
.frmCustomJob {
  .tableCompt {
    td i {
      margin: 0 3px;
    }
  }

  .detail {
    margin-bottom: 20px;
    margin-top:20px;
    border: 1px solid #e8e8e8;
    &:last-child {
      margin-bottom: 0;
    }
    .detail-title {
      display: flex;
      align-items: center;
      height: 32px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      background: #f8f8f8;
      border-bottom: 1px solid #e8e8e8;
    }
    .detail-c {
      padding: 20px;
      .el-row {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .label {
          display: inline-block;
          width: 105px;
        }
        .content {
          color: green;
        }
        .red {
          color: red;
        }
        p {
          color: green;
          &.red {
            color: red;
          }
          span {
            display: inline-block;
            width: 80px;
            text-align: right;
            margin-right: 5px;
            color: #606266;
          }
        }
  }
    }

    /deep/.el-form-item__content{
      width:60px;
    }
  }

    .footer {
      margin-bottom: 20px;
    }
    .testtable {
      td {
        border: 1px solid #ccc;
        margin: 3px;
      }
    }
}

.reason{
  .el-dialog__body{
    padding: 8px 40px;
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
  .reason-history {
    margin-top: 10px;
    padding: 15px 0 10px;
    border-top: 1px solid #e8e8e8;
    color: #999;
    p {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        margin-right: 15px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
