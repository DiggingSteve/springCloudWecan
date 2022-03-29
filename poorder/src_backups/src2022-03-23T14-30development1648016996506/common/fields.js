//可以在mergeBill.vue中查看应用方式;用来统一维护字段
/* import * as fields from '@/common/fields' //从src 目录下引入
      inputViewData: {
        ...fields.sfg,
        ...fields.mdg,
        ...fields.zzg,
        deliverydate: {
          ...fields.deliverydate.deliverydate,
          format: "yyyy-MM-dd HH:mm:ss" //修改单独的某个属性
        },
        ...fields.ybpiece,
        ...fields.ybweight,
        ...fields.ybvolume,
        ...fields.smallpiece,
        ...fields.hbh,
        ...fields.hbrq,
        ...fields.qfsj,
        ...fields.yqqcts,
        ...fields.hbzl,
        ...fields.exForm1,
        ...fields.paymode,
        ...fields.englishpm,
        ...fields.remark,
        ...fields.ispay_pre
      } */
export let fid = {
  fid: {
    title: "委托客户：",
    type: 11,
    required: true,
    contentStyle: {
      display: "flex"
    },
    itemStyle: {
      width: "560px"
    },
    linkage: "gid",
    disabled: false
  }
};
export let gid = {
  gid: {
    title: "项目：",
    type: 10,
    required: true,
    itemStyle: {
      width: "560px"
    },
    contentStyle: {
      display: "flex"
    },
    required: true,
    disabled: false,
    showCustomerRel: true
  }
};
export let sfg = {
  sfg: {
    title: "始发港：",
    type: 1,
    required: true,
    disabled: true
  }
};
export let mdg = {
  // mdg: {
  //   title: "目的港：",
  //   type: 4,
  //   required: true,
  //   options: []
  // }
  mdg: {
    title: "目的港：",
    type: 20,
    required: true,
    pagetype: 6
  }
};
export let zzg = {
  zzg: {
    title: "中转港：",
    type: 20,
    verify: "uppercase",
    pagetype: 6
  }
};
export let deliverydate = {
  deliverydate: {
    title: "货好日期：",
    type: 12,
    format: "yyyy-MM-dd HH:mm"
  }
};
export let ybpiece = {
  ybpiece: {
    title: "预报件数：",
    type: 1,
    disabled: true,
    verify: "integer"
  }
};
export let ybweight = {
  ybweight: {
    title: "预报重量：",
    type: 1,
    lass: "width289",
    disabled: true,
    verify: "fixedTwo"
  }
};
export let ybvolume = {
  ybvolume: {
    title: "预报体积：",
    type: 1,
    disabled: true,
    verify: "fixedThree"
  }
};
export let smallpiece = {
  smallpiece: {
    title: "小件数：",
    type: 1,
    verify: "integer"
  }
};
export let hbh = {
  hbh: {
    title: "要求航班号：",
    type: 1,
    verify: "uppercase",
    required: true,
    elEvent: {
      eventName: 'blur',
      funcName: 'getQfsj',
    },
  }
};
export let hbrq = {
  hbrq: {
    title: "要求航班日期：",
    required: true,
    type: 6,
    elEvent: {
      eventName: 'blur',
      funcName: 'getQfsj',
    },
  }
};
export let qfsj = {
  qfsj: {
    title: "预计起飞时间：",
    type: 34
  }
};
export let yqqcts = {
  yqqcts: {
    title: "要求全程天数：",
    type: 1
  }
};
export let hbzl = {
  hbzl: {
    title: "要求航班种类：",
    type: 3,
    groupid: "6",
    idStyle: {
      width: "100%"
    },
    itemStyle: {
      width: "100%"
    },
    disabled: true
  }
};
export let exForm1 = {
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
    },
    disabled: true
  }
};
export let paymode = {
  paymode: {
    title: "运费条款：",
    type: 3,
    groupid: "125",
    idStyle: {
      width: "100%"
    },
    itemStyle: {
      width: "100%"
    },
    disabled: true
  }
};
export let tradeterm = {
  tradeterm: {
    title: "贸易方式：",
    type: 16,
    idStyle: {
      width: "100%"
    },
    itemStyle: {
      width: "100%"
    },
    options: [{
        title: "Freight  Prepaid",
        detailS: []
      },
      {
        title: "Freight  Collect",
        detailS: []
      }
    ]
  }
};
export let englishpm = {
  englishpm: {
    title: "英文品名：",
    type: 17,
    verify: "uppercase",
    itemStyle: {
      width: "560px"
    },
    disabled: true
  }
};
export let chinesepm = {
  chinesepm: {
    title: "中文品名：",
    type: 17,
    itemStyle: {
      width: "560px"
    },
    hidden: true
  }
};
export let remark = {
  remark: {
    title: "备注：",
    type: 17,
    itemStyle: {
      width: "560px"
    }
  }
};

export let bglx = {
  bglx: {
    title: "报关类型：",
    type: 4,
    groupid: 19,
  }
}

export let bgpiece = {
  bgpiece: {
    title: "报关件数：",
    type: 1,
    verify: "integer",
    hidden: false,
    required: false
  }
}
export let bgweight = {
  bgweight: {
    title: "报关重量：",
    type: 1,
    verify: "fixedTwo",
    hidden: false,
    required: false
  }
}

export let ispay_pre = {
  ispay_pre: {
    title: "是否需要预付款：",
    type: "3",
    options: [{
        label: "是",
        value: 1
      },
      {
        label: "否",
        value: 2
      }
    ],
    default: 2,
    titleStyle: {
      "font-size": "12px",
      "font-weight": "bold",
      color: "red"
    },
    idStyle: {
      width: "100%"
    },
    itemStyle: {
      width: "560px"
    },
    expInfo: true
  }
};
//基础数据层，以html方式引入的页面
export const basicDataPages={
  iataAirPriceManager: 'frmIataAirPriceManager',
  airCompanyData: 'frmAirCompanyData',
  portData: 'frmPortData',
  airComPrice:'frmAirComPrice',
  flightManager:'frmFlightManager',
  //mawbManager:'frmMawbManager',
  fcustomerManager:'frmFCustomerManager',
}
/* 
 *当不配置componentname，代表找当前的路由组件为模板注入，比如costConfirmationkf，会去找本地的costConfirmationkf.vue,然后生成两个页面
 *reconMngFirFob 只配置了second,所以first就是reconMngFirFob.vue,second即credentialMngSec.vue
 *superiorDirectory,当前文件上一级目录，默认是从src下的components目录找组件，如果不是，需要传入上级目录
 *
 */
export const cassifyObj = {
  cabinUnconfirmed:{
    routername: 'cabinUnconfirmedCassify',
    first: {
      title: '待受理',
      componentname: "acceptPage",
      nomonitor:true,
      propsStr:`realPage=cabinUnconfirmed`
    },
    second: {
      title: '逾期待受理',
     // componentname: "acceptPage",
      nomonitor:true,
      propsStr:`realPage=orderTakingOverDate`
    }
  },
  costConfirmationkf: {
    routername: 'kfCostCassify',
    first: {
      title: '正常未确认'
    },
    second: {
      title: '已驳回未确认'
    },
    third: {
      title: '情况补充说明',
      propsStr: `routername="kfCostCassify"`,
      componentname: 'conditionExplain'
    }
  },
  costConfirmationhx: {
    routername: 'hxCostCassify',
    first: {
      title: '正常未确认'
    },
    second: {
      title: '已驳回未确认'
    },
    third: {
      title: '情况补充说明',
      propsStr: `routername="hxCostCassify"`,
      componentname: 'conditionExplain'
    }
  },
  costConfirmFob: {
    routername: 'hwzzCostCassify',
    first: {
      title: '待制作'
    },
    second: {
      title: '已制作'
    }
  },
  costCheckFob: {
    routername: 'hwshCostCassify',
    first: {
      title: '待审核'
    },
    second: {
      title: '已审核'
    }
  },
  reconMngFirFob: {
    routername: 'hwkjCostCassify',
    first: {
      title: '待开具'
    },
    second: {
      title: '已开具',
      componentname: "credentialMngSec"
    }
  },
  gnCostConfirm: {
    routername: 'gnCostCassify',
    first: {
      title: '正常未确认'
    },
    second: {
      title: '已驳回未确认'
    }
  },
  tzOperation: { //调账新增
    routername: 'tzSearchClassify',
    first: {
      title: '调账操作'
    },
    second: {
      title: '调账监控'
    }
  },
  gnmonitor: { //国内服务的订单监控
    routername: 'gnmonitor',
    first: {
      title: '操作未完成',
      // componentname: "gnSearchMonitor",
      componentname: "gnSearch",
      propsStr: "isMonitor",
    },
    second: {
      title: '已驳回未确认',
      // componentname: "gnCostConfirmMonitor",
      componentname: "gnCostConfirm",
      propsStr: "isMonitor",
    }
  },
  settleSearch: { //应收对账凭证综合查询
    routername: 'settleSearch',
    first: {
      title: '对账查询',
      componentname: "reconMngThd",
      nomonitor:true
    },
    second: {
      title: '已开凭证查询',
      componentname: "credentialMngSec",
      nomonitor:true
    }
  },
  settleSearchOut: { //应付对账凭证综合查询
    routername: 'settleSearchOut',
    first: {
      title: '对账查询',
      componentname: "reconMngThd",
      propsStr: `wageinout="2"`,
      nomonitor:true
    },
    second: {
      title: '已开凭证查询',
      componentname: "credentialMngSec",
      propsStr: `wageinout="2"`,
      nomonitor:true
    }
  },
  credentialMng: {
    routername: 'credentialMng',
    first: {
      title: '可开凭证',
      componentname: "credentialMngFir",
      nomonitor:true
    },
    second: {
      title: '已开凭证',
      componentname: "credentialMngSec",
      nomonitor:true
    }
  },
  credentialMngOut: {
    routername: 'credentialMngOut',
    first: {
      title: '可收凭证',
      componentname: "credentialMngFir",
      propsStr: `wageinout="2"`,
      nomonitor:true
    },
    second: {
      title: '已收凭证',
      componentname: "credentialMngSec",
      propsStr: `wageinout="2"`,
      nomonitor:true
    }
  },
  outerAccount: { //外网项目中外网对账
    routername: 'outerAccount',
    first: {
      title: '未对账',
      componentname: "reconciliationMng",
      superiorDirectory: "outsideDom"
    },
    second: {
      title: '已对账',
      componentname: "reconMngSec",
      superiorDirectory: "outsideDom"
    }
  },
  amsSendDirect: { //AMS直连
    routername: 'amsSendDirect',
    first: {
      title: '正常发送',
      componentname: "amsSendDirectNormal"
    },
    second: {
      title: '已修改',
      componentname: "amsSendDirectRevised"
    }
  },
  amsSendManual: { //AMS人工
    routername: 'amsSendManual',
    first: {
      title: '正常发送',
      componentname: "amsSendManualNormal"
    },
    second: {
      title: '已修改',
      componentname: "amsSendManualRevised"
    }
  },
  portSearch: { //货站发送
    routername: 'portSearch',
    first: {
      title: '天运通',
      componentname: "pfreportSearch",
      propsStr: `sendtype=1 name="pfreportSearch.vue"`,

    },
    second: {
      title: '东航平台',
      componentname: "pfreportSearch",
      propsStr: `sendtype=2 name="txdreportSearch.vue"`,
    }
  },
  monitor: { //空出操作层的订单监控
    routername: 'monitor',
    first: {
      title: '操作未完成',
      componentname: "orderSearch",
      propsStr: "isMonitor",

    },
    second: {
      title: '费用未确认',
      componentname: "costConfirmation",
      propsStr: "isMonitor",
    }
  },
  axplineDzHawbSearch: { //单证制作
    routername: 'axplineDzHawbSearch',
    first: {
      title: '正常制作',
      componentname: "dzmakeNormal",
    },
    second: {
      title: '已修改',
      componentname: "dzmakeRevised",
      isDot: true, // 在tab上显示数据红点标识
    }
  },
  mawbManageNew:{//总运单管理
   routername: 'mawbManagerClassify',
    first: {
      title: '唯凯本站运单'
    },
    second: {
      title: '非唯凯本站运单'
    }
  },
  customsContactSend:{//客服操作海关联系单
    routername: 'customsClassify',
    first: {
      title: '未发送'
    },
    second: {
      title: '已发送'
    }
  },
  applicationDocuments:{//客服操作签单申请
    routername: 'applicationClassify',
    first: {
      title: '未申请'
    },
    second: {
      title: '已申请'
    }
  },
  asignSearch:{//签单确认
    routername: 'asignSearchClassify',
    first: {
      title: '未签单',
      propsStr:`realname=asignSearch.vue realmonitor=1`
    },
    second: {
      title: '已签单',
      propsStr:`realname=asignSearch.vue realmonitor=2`
    }
  },
  // asignSpaceSearch:{//配舱操作
  //   routername: 'asignSearchClassify',
  //   first: {
  //     title: '未配舱',
  //     componentname:"asignSearch",
  //     propsStr:`realname=asignSpaceSearch.vue realmonitor=1`
  //   },
  //   second: {
  //     title: '已配舱',
  //     propsStr:`realname=asignSpaceSearch.vue realmonitor=2`
  //   }
  // },
  listConfirm:{//上榜确认
    routername: 'listConfirmClassify',
    first:{
      title: '未受理',
      componentname:"acceptPage",
      propsStr:`realname=listConfirm`
    },
    second:{
      title: '已受理',
      propsStr:`realname=listConfirm`
    }
  }


}
