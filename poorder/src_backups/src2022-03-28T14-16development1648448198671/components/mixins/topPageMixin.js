export const searchCmptMixins = {
  //查询列表页重置按钮,每个查询列表页都要引入
  data() {
    return {
      initSearchData: {}
    }
  },
  created() {

  },
  mounted() {
    //this.initSearchData = JSON.parse(JSON.stringify(this.inputModelData));
    //空出、联运、报关的订单新增和综合查询不进行自动搜索
    let exclude_search = [
      "newOrderSearch",
      "orderSearch",
      "LyOrderDetail",
      "LyOrderOperateSearch",
      "BgOrderDetail",
      "BgOrderOperateSearch"
    ];
    // console.log(this.navData)
    if (this.$store.getters.userSetting.autoSearch && !exclude_search.includes(this.navData.temp)) { //只应该在第一次初始化的时候查询，而不是每次切换路由
      setTimeout(() => {
        this.search();
      }, 400);
    }
    this.$nextTick(()=>{
      this.initSearchData = JSON.parse(JSON.stringify(this.inputModelData));
    })
  },
 
  methods: {
    reset() {
      this.inputModelData = JSON.parse(JSON.stringify(this.initSearchData))
    }
  },
  computed: {
    navData() {
      if (this.$route.params && this.$route.params.id) {
        return this.$store.state.navDataById[this.$route.params.id]
      }
    }
  }
}


export const openZimessage = {
  data() {
    return {
      pageshow: true,
      dialogShow: false,
      showTotal: {
        all: true,
        ybjzt: true,
        sjjzt: true,
        zdjzt: true,
        wageprofit: true,
        realwageall: false,
        billwageall: false,
        wageall: false,
        finishwageall: false,
        finishwageall_checkbill: false
      },
      mawbguid: null,
      boguid: null,
      orderdom: '',
      area: '',
      tableDataRes: [],
      ziTableData: [],
      searchData: {},
      chineseWhere: [],
      selectTableIndex: '-1',
      ziTableIndex: '-1',
      putIndex: -1 //点击打开展开分单索引
    }
  },
  methods: {
    getZimessage(msg) {
      console.log(msg)
      if (!msg.hpoType) {
        this.getHawbList(msg);
      } else {
        let data = this.ziTableData[msg.index]
        this.mawbguid = data.hpoid;
        this.boguid = data.oldboguid;
        this.orderdom = data.orderdom;
        this.area = data.area;
        this.dialogShow = true;
      }
    },
    getHawbList(msg) {
      this.putIndex = msg.index;
      //获取分单列表
      this.ziTableData = [];
      let guid = this.tableDataRes[msg.index].guid;
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAxpline",
        params: {
          hpoidHawbList: guid,
          boguid: this.tableDataRes[msg.index].boguid
        },
        loading: false,
        tip: false
      }).then(results => {
        if (results.data.length == 0) {
          this.$message("无查询结果！");
          return;
        } else {
          results.data = getChangeValue(results.data, "空出");
          setTimeout(() => {
            this.ziTableData = results.data;
          }, 10);
        }
      });
    }
  }
}

//切换系统时，动态设置条件
export const systemCheck = {
  data() {
    return {}
  },
  watch: {
    '$store.state.systemCheck': {
      handler(val) {
        //console.log(val)
        this.$nextTick(() => {
          if (this.$store.state.isWorkUnFinish && (['gnSearch.vue', 'gnCostConfirm.vue', 'gnSearchMonitor.vue', 'gnCostConfirmMonitor.vue', 'gnUnfinish.vue'].includes(this.name))) {
            return
          }

          // 所有费用确认页面不设置查询条件
          let costPageArr = ['costConfirmation.vue', 'costConfirmationMonitor.vue', 'costConfirmationhx.vue', 'costConfirmationkf.vue', 'gnCostConfirm.vue', 'gnCostConfirmMonitor.vue',
            'costConfirmStation.vue', 'costConfirmationCancel.vue'
          ]
          if (!costPageArr.includes(this.name)&&this.name!='applicationDocuments.vue'&&this.name!='asignSearch.vue') {
            let flag = (val && val == '国内服务');
            if (this.inputViewData.adddate) {
              // this.inputViewData.adddate.defaultVal = true;
              //  this.inputViewData.adddate.begintype = flag ? '' : 2;
            }
            if (this.inputViewData.hbrq) {
              this.inputViewData.hbrq.defaultVal = !flag;
            }
          }
        })
      },
      immediate: true
    }
  }
}


//分单合并 综合查询 订单未分配页面
import mergeBill from "../orderDetails/mergeBill";
export const mergeFunc = {
  data() {
    return {
      mergeDialog: false
    }
  },
  components: {
    mergeBill
  },
  computed: {
    margeTableData() {
      return this.tableDataRes.filter(i => i.checked);
    },
  },
  methods: {
    openMergeDialog() {
      if (!this.$store.state.areaState || this.$store.state.areaState.split(',').length > 1) {
        return this.$message.error('请选择地域！');
      }
      let arr = this.tableDataRes.filter(i => i.checked);
      if (arr.length < 1) {
        return this.$message.error('请选择至少一条数据！');
      }
      if (arr.filter(i => i.orderdom == '总单' || i.orderdom == '直单').length >= 2) {
        return this.$message.error('包含有两个及两个以上的总单或直单，不能合并！');
      }

      let obj = {
        // fid: {
        //   cname: '委托客户'
        // },
        // gid: {
        //   cname: '委托项目'
        // },
        companytitle_shr_mawb: {
          cname: '总单收货人'
        },
        companytitle_fhr_mawb: {
          cname: '总单发货人'
        },
        companytitle_shr_hawb: {
          cname: '分单收货人'
        },
        companytitle_fhr_hawb: {
          cname: '分单发货人'
        },
        hwlx: {
          cname: '货物类型'
        },
        hwxz: {
          cname: '货物性质'
        },
        sfg: {
          cname: '始发港'
        },
        hbzl: {
          cname: '航班种类'
        },
        status: {
          cname: '订单状态'
        },
        dzstatus: {
          cname: '单证状态'
        },
        // orderdom: {
        //   cname: '订单类型'
        // },
        area: {
          cname: '地域'
        },
      }
      let arr2 = Object.keys(obj);
      for (let e in arr2) {
        for (let i in arr) {
          let k = arr2[e]
          if (i == 0) {
            obj[k].val = arr[0][k]
          } else {
            if (arr[i][k] != obj[k].val) {
              return this.$message.error(obj[k].cname + '必须相同才能合并');
            }
          }
        }

      }
      this.mergeDialog = true;
    },
    mergeSuc() {
      this.mergeDialog = false;
      this.search()
    },
    async changeOrderdom(guid) {
      console.log(this.name)

      let confirm = await this.$confirm("请确认操作？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      });

      if (!confirm) return;


      let json = {
        czman: localStorage.usrname,
        hpoguid: guid
      }
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + "api/changeOrderdom",
        data: json,
        loading: true,
        tip: false,
        nofield: 1
      }).then(results => {
        console.log(results);
        if (results.data.resultstatus == 0) {
          this.$message.success(results.data.resultmessage);
          if (this.name == 'mawbAddPut.vue') {
            this.$emit("update:visible", false);
            this.$emit("success", true);
          } else {
            this.addBillDialog = false;
            this.$emit("success", true);
            this.mergeSuc()
          }

        } else {
          this.$message.error(results.data.resultmessage);
        }
      });
    }
  },
  watch: {

  }
}

import {
  searCondition,
  getChangeValue,
  computedWeight,
  formatDate
} from "../../api/localStorage.js";



// 经理审核页面方法
export const manageShMethod={
  data(){
    return{
      OrderVisible:false,//WFF详细页面
      cur_id:'',
      cur_wagedom:'', 
      cur_area:'',
      cur_row:{},
      listBillChangeJob: [//关联的调账
        ],
      listBillChangeJobWage: {},//关联的调账的费用
      listBillChecked: 0,
      listbillCheckedRow: {},
      listBillOpened: [],
      ponoDetail: {},
    }
  },
  methods:{
    getWffDetail(data){//获取详细

    this.listBillChecked = 0
    this.listBillOpened = []
    this.listbillCheckedRow = {}
    this.listBillChangeJob = []

     this.cur_row=data
     this.cur_id=data.sett_axpid
     this.cur_area=data.area
     this.cur_wagedom='调账'
     
     let params = {
          sid: data.sett_axpid,
          wagedom: '调账'
     };

      this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/Details",
          params: params,
          loading: true,
          tip: false
     })
      .then(results=>{
        
        this.getmawbdetail(results.data.basicInfo.oldid).then(res => {
            if(res){
              this.ponoDetail = res;
              this.ponoDetail.boguid = results.data.basicInfo.oldid;
            }else{
              this.ponoDetail = {}
            }
              if (data.pono && !data.pono.includes('TZTS') && !data.pono.includes('TZCW') && !data.pono.includes('TZ2') && !data.pono.includes('TZYW')) {
                this.getTzList(params).then(res => {
                  this.OrderVisible = true;
                });
              } else {
                this.OrderVisible = true;
              }
          
          })
      })

    },

    async getmawbdetail(boguid) {//获取调账列表
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

     async getTzList(data) {//获取调账列表
        return await this.$axios({
          method: "get",
          url: this.$store.state.wcWebApi + "api/ExAxpline/GetChangeBill",
          params: data,
          loading: true,
          tip: false
        }).then(result => {
          this.listBillChangeJob = result.data.tzinfo
          this.listBillChangeJobWage = result.data.wageinfo
          this.$nextTick(() => {
            this.handleClickJob({ index: this.listBillChangeJob.findIndex(i => i.billno == this.cur_row.pono) })
          })
          return result.data
        })
    },
    handleClickJob(tab) {
        let index = Number(tab.index || 0)
        this.listBillChecked = index
        if (!this.listBillOpened.includes(index)) {
          this.listBillOpened.push(index)
        }
    },

  }
}



export const commonSearchPage = function (html = {}) {



  let str =
    `<div><div class="page-container-box">
      <newSearchComp
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :chinese-where.sync="chineseWhere"
        :pageshow.sync="pageshow"
        :pagetype="1"
        @reset = "reset"
      ></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
          ${html.button||''}
      </div>
    </div>
    <tableCompt
      :name="name"
      :table-data-res="tableDataRes"
      :nestedTableType="2"
      @transSelIndex="openDialog"
      v-on:transmitMsg="getZimessage"
      @transmitZiMsg="transmitZiMsg"
      :ziTableData="ziTableData"
      :chinese-where="chineseWhere"
      showZiConfig
      :showTotal="showTotal"
      @wageConfirmStatus="openDialog2"
    >
    ${
      html.tableSlot||''
    }
    </tableCompt>
    <el-dialog
      title="综合查询"
      v-if="dialogShow"
      center
      :visible.sync="dialogShow"
      class="dialogPage"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="100%"
      top="0px"
      :modal="false"
    >
      <mawbaddput
        :visible.sync="dialogShow"
        :pagetype="${html.pagetype||6}"
        :mawbguid="mawbguid"
        :boguid="boguid"
        :area="area"
        :orderdom="orderdom"
        @update="delTableIndex"
        @success="mergeSuc"
      ></mawbaddput>
    </el-dialog>
    ${html.dialog||''}
    </div>`

  let components = {}; //只注册当前页面需要的;也可提前全局注册
  if (html.components) {
    html.components.forEach(i => {
      components[i] = resolve => require([`../orderDetails/${i}.vue`], resolve)
    })
  }
  return {
    template: str,
    name: html.name,
    components: components,
    mixins: [openZimessage, searchCmptMixins],
    data() {
      return {
        name: (html.name + '.vue'),
        showTotal: {
          all: true,
          ybjzt: true,
          sjjzt: true,
          zdjzt: true,
          wageprofit: true,
          realwageall: false,
          billwageall: false,
          wageall: false,
          finishwageall: false,
          finishwageall_checkbill: false
        },
        dialogShow: false,
        dialogPeicang: false,
        addPcShow: false,
        mawbguid: null,
        boguid: null,
        orderdom: "",
        area: "",
        tableDataRes: [],
        ziTableData: [],
        inputViewData: {
          //hbrq: { title: "航班日期", type: 15, defaultVal: true,},
        },
        inputModelData: {},
        searchData: {},
        chineseWhere: [],
        pageshow: true,
        mawbDetail: {},
        printIndex: -1,
        putIndex: -1, //点击打开展开分单索引
        selectTableIndex: "",
      }
    },
    computed: {
      navData() {
        if (this.$route.params && this.$route.params.id) {
          return this.$store.state.navDataById[this.$route.params.id]
        }
      }
    },
    created() {
      //console.log(html)
      // alert(this.name)
    },
    methods: {
      getChangeValue(data) {
        return getChangeValue(data, 'system');
      },
      openDialog2(indexData) {
        this.selectedTableIndex = indexData
        this.mawbguid = this.tableDataRes[indexData].guid
        this.boguid = this.tableDataRes[indexData].boguid
        this.costMakingVisible = true
      },
      delTableIndex(data) {
        this.dialogShow = false;
      },
      transmitZiMsg(msg) {
        this.printIndex = msg.index;

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExHpoAxpline",
          params: {
            boguid: this.tableDataRes[this.putIndex].boguid
          },
          loading: false,
          tip: false
        }).then(results => {
          var data = results.data;
          this.$axios({
            method: "get",
            url: this.$store.state.webApi + "api/ExAxpline",
            params: {
              guid: this.ziTableData[msg.index].guid
            },
            loading: true,
            tip: false
          }).then(res => {
            var hawbdata = res.data;
            data.mdg = hawbdata.mdg;
            data.zdpiece = hawbdata.zdpiece;
            data.zdweight = hawbdata.zdweight;
            data.zdvolume = hawbdata.zdvolume;
            data.smallpiece = hawbdata.smallpiece;
            data.englishpm = hawbdata.englishpm;
            data.jfweight = computedWeight(hawbdata.zdvolume, hawbdata.zdweight);
            data.hawb = hawbdata.hawb;
            data.guid = hawbdata.guid;
            data.orderdom = "分单";
            this.mawbDetail = data;
            setTimeout(() => {
              this.$refs.makingbill && this.$refs.makingbill.printFunc();
              this.printIndex = -1;
            }, 500);
          });
        });
      },
      search() {
        this.selectTableIndex = -1;
        this.tableDataRes = [];
        this.ziTableData = [];

        if (this.name == 'gnUnfinish.vue') {
          this.searchData.canceling = 0;
        }
        let jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };
        let json = {
          json: JSON.stringify(jsonArr2)
        };

        this.$axios({
            method: "get",
            url: this.$store.state.webApi + (html.searchApi || "api/ExHpoboAxplineGeneral"),
            params: json,
            loading: true,
            tip: false
          })
          .then(results => {
            //console.log(results)

            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            setTimeout(() => {
              this.tableDataRes = getChangeValue(results.data, "空出");
              console.log('查询成功！')
            }, 0);
          })
          .catch(errors => {});
      },
      openDialog(indexData) {
        this.selectTableIndex = indexData;
        this.mawbguid = this.tableDataRes[indexData].guid;
        this.boguid = this.tableDataRes[indexData].boguid;
        this.orderdom = this.tableDataRes[indexData].orderdom;
        this.area = this.tableDataRes[indexData].area;
        this.dialogShow = true;
      },
      mergeSuc() {
        this.mergeDialog = false;
        this.search()
      }

    },
    watch: {

    }
  }
}
// 经理审核页面混入组件
export const htmlTemplateStr = function (type,configOptions) { //返回模板字符串
  if (type == 1) {
    return `
    <el-dialog title="${configOptions.title}" :visible.sync="OrderVisible" v-if="OrderVisible" :close-on-press-escape="false" :close-on-click-modal="false"
      class="dialogPage" width="100%" top="20px" :modal="false" center>
      <div v-if="listBillChangeJob.length">
        <infoList style="margin-bottom:25px" v-if="ponoDetail&&ponoDetail.guid" :inputModelData="ponoDetail"
          :pono="listbillCheckedRow.basicInfo&&listbillCheckedRow.basicInfo.jobno" name="详细">
          <template slot="exinfo">
            <div class="showpaneinfo" style="width:100%">
              <div>
                <span>销售员：</span>
                <span>{{ponoDetail.salesname||'--'}}</span>
              </div>
              <div>
                <span>单证状态：</span>
                <span>{{ponoDetail.dzstatusCn }}</span>
              </div>
              <div>
                <span>审单人：</span>
                <span>{{ponoDetail.submitman_2_sett}}</span>
              </div>
              <div>
                <span>审单日期：</span>
                <span>{{ponoDetail.submitdate_2_sett}}</span>
              </div>
            </div>
          </template>
        </infoList>
        <commonTabs :list="listBillChangeJob" :checkedIndex.sync="listBillChecked" titlefield="billno"
          :opendIndex.sync="listBillOpened">
          <template v-for="(item,index) in listBillChangeJob">
            <managerDetailTz v-if="listBillOpened.includes(index)" :showListInfo="false"
              :listBillChangeJob="listBillChangeJob" :listBillChecked="listBillChecked"
              :showBtnfoot="listBillOpened[0]==index" v-show="index==listBillChecked"
              :listbillCheckedRow.sync="listbillCheckedRow" :id="item.billsid" :jobnosid="item.jobnosid"
              :visible.sync="OrderVisible" :wagedom="item.billwagedom" :area="cur_area"
              @dzstatusChange="status => {cur_row.dzstatus = status}" @backOrder="removeOrderFromTable(cur_rowindex)"
              ref="listBohui" :initiator="initiator" origin="${configOptions.origin}">
            </managerDetailTz>
          </template>
        </commonTabs>
      </div>
      <managerDetail v-if="listBillChangeJob.length==0" :id="cur_id" :wagedom="cur_wagedom" :area="cur_area"
        :visible.sync="OrderVisible" @dzstatusChange="status => {cur_row.dzstatus = status}" :initiator="initiator"
        @backOrder="removeOrderFromTable(cur_rowindex)" :wageRejectin="wageRejectin" :wageRejectout="wageRejectout" origin="${configOptions.origin}">
      </managerDetail>
    </el-dialog>
    `
  }

}

export const renderHtml = function (parentComponent, type, configOptions) { //@parentComponent 父组件; @type 模板类型 ,@configOptions配置选项
  /* 
   使用方法 该方法返回一个子组件然后动态注入父组件，在父组件做如下配置:
   1.
   import {
     renderHtml
   } from "@/components/mixins/topPageMixin";
   
   2.父组件template模板中引用子组件：
         <component :is="childrenComponent"></component>
   3.childrenComponent 在mounted中赋值：
    mounted() {
         this.childrenComponent = renderHtml.call(
           this,
           parentComponent,
           1
         );
    }
    4. parentComponent是父组件对象，需要把原来的父组件options命名后再导出
  */

  // console.log(this)
  // console.log(parentComponent)
  let templatestr = htmlTemplateStr(type, configOptions);
  // let variableStr = ''; //可能作为变量存在的字符串,提取出来减少后面的遍历；问题在于判断哪里是自定义组件名
  // let quotationLen = false; //是否需要将该字符并入newStr
  // for (let i = 0; i < templates.length; i++) {
  //   let str = templates[i];
  //   if (str == '"') {
  //     quotationLen = !quotationLen
  //   }
  //   if (quotationLen) {
  //     variableStr += str
  //   }
  // }
  // console.log(variableStr)
  let _this = this;
  let childrenComponent = {
    data() {
      return _this.$data
    },
    template: templatestr
  }
  const filterParent = (field) => { //过滤掉不需要的方法和组件
      childrenComponent[field] = {};
      Object.keys(parentComponent[field]).filter(i => templatestr.includes(i)).every(i => childrenComponent[field][i] = parentComponent[field][i]);
    }
    ['methods', 'components', 'computed'].forEach(i => {
      filterParent(i);
    })
  return childrenComponent;

}
