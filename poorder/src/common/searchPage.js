import {
  commonSearchPage
} from "@/components/mixins/topPageMixin"
import asignSearch from "@/components/asignSearch.vue"
// import orderTaking from "@/components/orderTaking.vue"
import acceptPage from "@/components/acceptPage.vue"
import newOrderAdd from '@/components/newOrderAdd.vue'

// import priceFreight from '@/priceSystem/priceFreight.vue'


import {
  cassifyObj,
  basicDataPages
} from "@/common/fields"
export const createPage = function (name) {
  let html = {};

  if (name == "outMawbAdd") {
    return {
      name: name,
      mixins: [newOrderAdd],
      data() {
        return {
          name: "outMawbAdd.vue",
        }
      }
    }
  }

  if (name == "asignSpaceSearch") {
    return {
      name: name,
      mixins: [asignSearch],
      data() {
        return {
          name: "asignSpaceSearch.vue",
        }
      }
    }
  }

  if (name == "asignSearchMonitor") {
    return {
      name: name,
      mixins: [asignSearch],
      data() {
        return {
          name: "asignSearch.vue",
          monitor: 2
        }
      }
    }
  }

  if (Object.keys(basicDataPages).includes(name)) { //基础数据层页面
    return {
      name: name,
      data() {
        return {
          name: `${name}.vue`,
        }
      },
      computed: {
        src() {
          return `${this.$store.state.imgWebApi}basicData/iframe/${basicDataPages[name]}/?usrname=${localStorage.usrname}`
        }
      },
      mounted() {
        this.$nextTick(() => {
          this.$store.state.showloading = true
          this.$refs.iframe.onload = () => {//加载完成
            this.$store.state.showloading = false;
          }
        })
      },
      template: `
       <div>
        <iframe :src="src"  frameborder="0" ref="iframe" allowtransparency="true" style="width: 100%; height: 100%; border: 0px none;" ></iframe>
        </div>
      `
    }
  }

  if (name == 'outerAccount' || name == "dataAnaly" ) { //外网对账和订舱显示正在开发中
    return {
      name: name,
      data() {
        return {
          name: `${name}.vue`,
        }
      },
      template: `
       <div style="display: grid;place-items: center">
        <svg t="1599471618624" class="icon" viewBox="0 0 1658 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2716" width="500" height="500"><path d="M116.303139 786.479504c0 112.412717 308.981404 203.530494 690.447511 203.735253 381.466107 0 690.857029-91.117776 691.061788-203.530494v-0.204759c0-112.412717-309.186163-203.530494-690.65227-203.530494-381.466107-0.204759-690.857029 90.913017-690.857029 203.530494z" fill="#EDE6D6" p-id="2717"></path><path d="M0 706.418716c0 12.080784 26.004399 21.909218 58.15157 21.909218s58.15157-9.828434 58.151569-21.909218c0-12.080784-26.004399-21.909218-58.151569-21.909218S0 694.542691 0 706.418716z m1512.35033 123.674465c0 15.971206 32.556689 29.075785 72.689462 29.075785s72.689462-12.89982 72.689462-29.075785c0-15.971206-32.556689-29.075785-72.689462-29.075784s-72.689462 12.89982-72.689462 29.075784z" fill="#EFEAD5" p-id="2718"></path><path d="M247.144171 227.896821v535.240152c0 17.814037 14.128374 33.170966 33.990002 37.061387l524.797441 103.40332V290.34833c-372.456709-47.29934-558.787443-68.184763-558.787443-62.451509z" fill="#FBE8D7" p-id="2719"></path><path d="M1358.576285 227.896821v535.240152c0 17.609278-14.128374 32.966207-33.785243 37.061387l-519.064187 103.608079-5.938013-613.458109c372.661468-47.29934 558.787443-68.184763 558.787443-62.451509z" fill="#E8C3A0" p-id="2720"></path><path d="M101.765247 426.308338l148.245551-211.925615 556.125575 67.980004-129.612478 253.082184-574.758648-109.136573z" fill="#FEF6EF" p-id="2721"></path><path d="M793.236553 278.472306L929.606079 532.987802l572.711058-116.917416-137.188563-203.735253L799.379324 278.472306h-6.142771z" fill="#F9DBC0" p-id="2722"></path><path d="M750.237153 159.09778h-32.556689c-44.023195 0-79.65127-35.628074-79.65127-79.651269C638.029194 35.628074 673.657269 0 717.680464 0h363.242551c44.023195 0 79.65127 35.628074 79.65127 79.65127s-35.628074 79.65127-79.65127 79.651269H827.226555" fill="#2878FF" opacity=".5" p-id="2723"></path><path d="M739.384923 108.727055c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461508-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256749 29.485303z m159.916817 0c-15.971206 0.204759-29.280544-12.490302-29.690062-28.461508s12.490302-29.280544 28.461507-29.690062c15.971206-0.204759 29.280544 12.490302 29.485303 28.666267 0.409518 15.971206-12.285543 29.075785-28.256748 29.485303z m159.916816 0c-15.971206 0-29.075785-13.104579-29.075785-29.075785s13.104579-29.075785 29.075785-29.075785c15.971206 0 29.075785 13.104579 29.075785 29.075785 0 15.971206-13.104579 29.075785-29.075785 29.075785z" fill="#FFFFFF" p-id="2724"></path><path d="M1042.428314 486.302739l2.661868-11.466506s-18.837832-15.561688-17.609278-33.170966c1.433313-17.609278 12.89982-28.256749 12.89982-28.256749h35.013797l-5.323735 59.380124 0.614277 10.033194-28.256749 3.480903z m43.20416 508.416717l0.614277 8.804639h12.080783l-2.04759-11.466507-10.64747 2.661868z" fill="#F6D0C3" p-id="2725"></path><path d="M1058.604279 1011.714457s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757048c0 1.433313-0.614277 2.04759-2.047591 2.047591H1058.604279v-2.866627z" fill="#333333" p-id="2726"></path><path d="M1021.542891 1004.138372l0.614278 8.804639h11.466506l-1.433313-11.466506-10.647471 2.661867z" fill="#F6D0C3" p-id="2727"></path><path d="M994.514697 1021.133373s1.433313-8.804639 7.371326-9.418916c5.323735-0.614277 26.413917 0.614277 32.351929 1.433313 0.614277 0 2.04759 0.614277 2.047591 2.047591v6.757049c0 1.433313-0.614277 2.04759-2.047591 2.04759h-39.928014v-2.866627z m89.889222-25.594881h13.514097l5.323736-143.126574c0-7.371326 1.433313-14.128374 2.661867-20.885423 6.757049-27.642472 21.704459-106.679464 17.609278-142.512298l-12.080783-20.885423-74.327535 4.095181s9.418916 87.022595 20.271146 121.422116c2.04759 6.757049 4.095181 13.514097 4.709458 20.271146l22.318736 181.621275z" fill="#333333" p-id="2728"></path><path d="M982.433913 663.214557l37.061388 342.971406h14.94741l7.371326-140.464707c0.614277-8.190362 2.04759-16.380724 4.095181-24.366327 8.190362-31.123375 30.304339-108.112777 28.256749-154.593081l-91.732054-23.547291z" fill="#3A3A3A" p-id="2729"></path><path d="M1144.39832 557.354129s12.080784 39.108978 10.85223 55.284943c-1.433313 14.128374-10.033193 51.394521-33.170966 56.103979l-0.614277-87.841631 21.704459-22.933014 1.228554-0.614277z m-180.802239 2.661868s-12.080784 39.108978-10.85223 55.284943c1.433313 14.128374 10.033193 51.394521 33.170966 56.103979l0.614277-87.841632-21.704459-22.933013-1.228554-0.614277z m74.122775-128.998201s6.142771-6.142771 10.85223-4.095181c5.323735 2.04759 6.142771 12.89982 3.276145 27.028195-2.661868 14.128374-15.561688-9.418916-15.561688-9.418916l1.433313-13.514098z" fill="#F6D0C3" p-id="2730"></path><path d="M1043.861628 427.741652c-4.095181 0.614277-8.804639-0.614277-11.466507-4.095181-4.095181-5.323735-8.804639-13.514097-4.095181-19.656869 7.371326-10.033193 27.642472-17.609278 45.866027-7.371326 18.223555 10.033193 20.271146 33.170966 20.271146 33.170966s-1.433313 41.770846-25.594881 41.770846h-6.142772c-2.661868 0-5.323735-2.04759-6.142771-4.095181-3.276145-8.804639-4.709458-18.223555-4.095181-27.642471v-6.142772c-0.614277-5.938012-4.504699-6.757049-8.59988-5.938012z" fill="#333333" p-id="2731"></path><path d="M1146.445911 557.968406c-16.995001-35.013797-46.480304-59.175365-60.813437-69.413317-3.890422-3.071386-6.961808-4.914217-8.190362-5.528494-4.709458-2.04759-27.642472 0-37.061388 2.04759-1.842831 0.409518-4.914217 2.25235-8.804639 4.709458-14.742651 8.59988-52.623075 33.170966-70.846631 70.846631l22.318736 36.447111 0.204759-0.20476-0.819036 73.918017c0 4.095181 2.04759 8.190362 5.323735 8.804639 71.665667 34.39952 121.422116 16.790242 134.321936 10.852229 2.04759-0.614277 4.095181-2.661868 4.095181-4.709458 3.685663-24.571086 3.071386-62.45151 1.023795-95.008198l19.247351-32.761448z" fill="#2878FF" p-id="2732"></path><path d="M250.010798 214.382723l466.85063 71.05139v-118.760248l-4.29994-0.409518z" fill="#E0BC9C" p-id="2733"></path><path d="M785.865227 289.119776l579.468106-76.784643L712.561488 166.264347V284.615077l73.303739 4.504699z" fill="#FBECDA" p-id="2734"></path></svg>
        <h1>正开发中...</h1>
        </div>
      `
    }
  }


  if (["listConfirmOut", "orderTaking", "orderTakingOverDate",  'listConfirmOverDate'].includes(name)) {
    return {
      name: name,
      mixins: [acceptPage],
      data() {
        return {
          name: "listConfirm.vue",
          realPageName: name,
        }
      }
    }
  }

  // if (["norAirlineFee", "souAirlineFee", "eurAirlineFee", "japAirlineFee", 'estAirlineFee'].includes(name)) {
  //   return {
  //     name: name,
  //     mixins: [priceFreight],
  //     data() {
  //       return {
  //         name: 'norAirlineFee.vue',
  //         realPageName: name
  //       }
  //     }
  //   }
  // }





  //原来的单个路由页面分为两个tab,在外面拦截路由，用一个新页面包裹，里面的tab还是用原来的页面;。
  // console.log(cassifyObj)
  if (Object.keys(cassifyObj).includes(name)) {
    
    let obj = cassifyObj[name];
    let routername = obj.routername;
    let first = obj.first;
    let second = obj.second;
    var third = ""
    obj.third ? third = obj.third : ""
    // if (name == 'reconMngFirFob') {
    //   let component = require(`@/components/${routername}.vue`).default;
    //   return {
    //     name: routername,
    //     mixins: [component],
    //     data() {
    //       return {
    //         name: `${routername}.vue`,
    //       }
    //     }
    //   }
    // }
    let firstComponentName = first.componentname || ""
    let secondComponentName = second.componentname || ""
    let thirdComponentName = third.componentname || ""
    let pagefirst = require(`@/${first.superiorDirectory||'components'}/${firstComponentName||name}.vue`).default;
    // console.log(pagefirst)
    //second组件如果没传组件名，默认以第一个组件为模板混入
    let pagesecond = secondComponentName ? require(`@/${second.superiorDirectory||'components'}/${secondComponentName}.vue`).default : {
      name: routername + 'Sec', //当两个组件实际上引入的是同一个组件的时候，而这个组件配置了name选项(注意是与data同级的name,而不是定义在data中的name)，这将导致缓存的实际上是同一个页面，所以需要区分name属性使页面独立缓存。
      mixins: [pagefirst],
    };

    let pagethird = thirdComponentName ? require(`@/${third.superiorDirectory||'components'}/${thirdComponentName}.vue`).default : {
      name: routername + 'Thir', 
    };


    return {
      name: routername,
      components: {
        pagefirst,
        pagesecond,
        pagethird
      },
      data() {
        return {
          name: `${routername}.vue`,
          mng: 1,
          tableData: null,
        }
      },

      // note: 打开单证制作已修改tab，查询列表接口，获取数据，有数据则在tab上显示红点图标
      mounted(){
        this.$nextTick(() => {
          const self = this;
          if (second.isDot && this.$refs.secBack) {
            setTimeout(() => {
              this.$refs.secBack.search(null, false)
            }, 100)
          }
        })
      },

      methods: {
        search() {
          if (this.mng=='1') {
            this.$refs.fir.search()
          } else if(this.mng=='2') {
            this.$refs.sec.search()
          }
        },

		// 获取单证制作已修改tab数据，显示红点图标
        handleData(data) {
          this.tableData = data;
        
        },
        // handleTagStatus(val){
        //   this.mng = val
        //   this.$store.commit('setMngstatus',val)
        // },

      },

      template: `
      <div class="reconciliationMng">
      <el-button-group  class="buttonTabs" >
      
        <el-button  :class="[mng == 1 ?'active':'']" @click="mng=1" class="orderBadge">
          <el-badge :value="$store.state.acceptPageDot"  v-if="${first.title == '订单待受理'} && $store.state.acceptPageDot != 0 " >
          ${first.title} 
          </el-badge>
          <span v-else>${first.title}</span>
        </el-button>

      <el-button  :class="[mng == 2?'active':'']" @click="mng=2">
            <el-badge :is-dot="tableData&&tableData.length"  :value="$store.state.businessUqueryDot"  class="orderBadge" v-if="tableData&&tableData.length || (${second.title == '订单待处理'} && $store.state.businessUqueryDot != 0)" >
            ${second.title}
            </el-badge>
            <span v-else> ${second.title}</span>
      </el-button>
          <el-button  :class="[mng == 3 ?'active':'']"  v-if="${third.title !== undefined}" @click="mng=3">${third.title}</el-button>
      </el-button-group>
      
      <keep-alive>
        <pagefirst class="cre" pagetype="1" :monitor="${!first.nomonitor}?'1':''" ${first.propsStr} v-if="mng == 1" ref="fir"></pagefirst>
        <pagesecond class="cre" pagetype="2" :monitor="${!second.nomonitor}?'2':''" ${second.propsStr}  v-if="mng == 2" ref="sec" @getTableData="handleData"></pagesecond>
        <pagethird  class="cre" pagetype="3" :monitor="${!third.nomonitor}?'3':''" ${third.propsStr}  v-if="mng == 3" ref="tip"   @getTableData="handleData"></pagethird>
      </keep-alive>
      <pagesecond class="cre" pagetype="2" :monitor="${!second.nomonitor}?'2':''" ${second.propsStr}  v-if="${second.isDot}" ref="secBack" @getTableData="handleData"  style="display: none"></pagesecond>
      
      </div>
      `
    }
  }


  if (name == "gnUnfinish") {
    html = {
      name: name,
      searchApi: 'api/ExHpoServiceGeneral',
      pagetype: '14'
    }
    return {
      mixins: [commonSearchPage(html)],
      data() {
        return {
          inputViewData: {
            status: {
              title: "订单状态",
              type: 5,
              dom: "订单状态",
              whereStr: "in",
              hidden: true
            },
            adddate: {
              title: '创建时间',
              type: 15,
              defaultVal: false,
              begintype: 4
            },
            hbrq: {
              title: "航班日期",
              type: 15
            },
          },
          inputModelData: {
            status: "AO5030,AO5020,AO5040,AO5050"
          },
        }
      }

    }
  }

  if (name == "customerSearch") { //测试扩展基础模板的功能，需要在首页配置该组件以方法方式解析而不是引入本地.vue文件
    let html = {
      name: name,
      components: ['jiedian'],
      searchApi: 'api/ExHpoboAxplineCustomerGeneral',
      pagetype: '14',
      tableSlot: `
           <template slot="display" slot-scope="props">
              <i class="el-icon-map-location" title="节点信息"  @click="jiedianShow=true;displayIndex=props.data.index"></i>
              <i class='el-icon-picture' title="本票照片"   @click="showImgFunc(props.data.index)"></i>
            </template>
          <template slot="pono" slot-scope="props"><span   :class="[props.data.row.status==600|| props.data.row.status=='已撤单'? 'redColor' : 'poczColor',{underlineRred:props.data.index==selectTableIndex}]" @click="openDialog(props.data.index)">{{props.data.value}}</span></template>
          `,
      dialog: `
              <el-dialog
          :visible.sync="jiedianShow"
          width="90%"
          title="节点状态信息"
          top="4%"
          center
          v-if="jiedianShow"
          :close-on-press-escape="false"
          append-to-body>
            <jiedian :mawbinfo="tableDataRes[displayIndex]" :orderdom="tableDataRes[displayIndex].orderdom"></jiedian>
        </el-dialog>

      <el-dialog :visible.sync="imgShow" class="dialogImgDoc" :close-on-click-modal="false" v-if="imgShow"  width="980px"  append-to-body  top="0">
        <iframe :src="imgUrl"  frameborder="0" allowtransparency="true" style="width: 100%; height: 100%; border: 0px none;" ></iframe>
      </el-dialog>

      <el-dialog
            title="费用未确认"
            :visible.sync="costMakingVisible"
            width="100%"
            top="0"
            v-if="costMakingVisible"
            @close="uncostMaking"
            :close-on-press-escape="false"
            class="dialogPage"
            :modal="false"
            center>
            <costmaking :mawbguid="mawbguid" @unvisible="uncostMaking" :boguid="boguid"  ref="costDialog" pagetype="2" costDom="客服" :showSuggestWage="true"></costmaking>
      </el-dialog>
          `
    }

    return {
      mixins: [commonSearchPage(html)],
      data() {
        return {
          displayIndex: -1, //点击照片节点的索引
          imgUrl: '',
          selectTableIndex: -1,
          costMakingVisible: false,
          jiedianShow: false,
          imgShow: false,
        }
      },
      methods: {
        showImgFunc(index) {
          this.imgShow = true;
          let data = this.tableDataRes[index]
          let mawbtype = data.orderdom == '直单' ? 1 : 2
          let usrname = localStorage.usrname
          this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?jobno=${data.pono}&username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&cwid=${data.shipaceid}&area=${this.area}`;
        },
      }
    }
  }
  return commonSearchPage({
    name: name
  }) //如果不需要扩展功能，可以直接返回基础模板
}
