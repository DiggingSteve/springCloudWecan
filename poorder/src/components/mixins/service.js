//注意在原新增页面mawbAddNew.vue 和 修改页面mawbAddPut.vue 使用;
//也在newOrderAdd.vue 使用

//serviceViewData
//listView
//homeInformation
let pickerOptions = {
  disabledDate(time) {
    return time.getTime() + 3600 * 1000 * 24 < Date.now();
  }
}

let clpmggList = {
  materialpm: {
    title: "材料品名：",
    type: 4,
    groupid: -10,
    initialField: "materialstd",
    bindValue: "typename",
    filterable: true,
  },
  materialstd: {
    title: "材料规格：",
    type: 27,
    linkage: "materialpm"
  },
  num: {
    title: "数量：",
    type: 1,
    verify: "integer"
  },
  wagetype: {
    title: "结算方式：",
    type: 4,
    groupid: 33
  },
  costwage: {
    title: "成本价：",
    type: 1
  },
  saleswage: {
    title: "销售价：",
    type: 1
  },
  btn: {
    titleStyle: {
      display: "none"
    },
    idStyle: {
      width: "60px"
    }
  }
}


export const getServiceView = function (mixpagetype) {
  //type1 新增页面 2修改页面
  let isaddpage = mixpagetype == 1;
  //延伸服务展开多条的操作
  var listViewSlot = {
    props: {
      code: String
    },
    created() {
    },
    data() {
      return {
        parent: isaddpage ? this.$parent.$parent : this.$parent.$parent.$parent.$parent
      }
    },
    template: `<div>
               <newFormCmpt
                  :view-data.sync="parent.listView[code+'View']"
                  v-for="(item,index) in parent.inputModelData[parent.listView[code]]"
                  :model-data.sync="item"
                  pagetype="2"
                  :key="index"
                >
                  <slot slot="btn">
                    <i
                      @click="parent.listform(index,code)"
                      class="listViewBtn"
                      :style="{color:index!=0?'red':'#67C23A'}"
                      :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
                      :title="index!=0?'删除此条':'新增一条'"
                    ></i>
                  </slot>
                </newFormCmpt>
   </div>
  `
  }



  return {
    components: {
      listViewSlot
    },
    data() {
      return {
        basicInformation: {
          orderdom: {
            title: "订单类型：",
            type: 3,
            options: [{
                label: "总分单(货代委托)",
                value: "总单"
              },
              {
                label: "总直单(货代委托)",
                value: "直单"
              },
            ],
            hidden: isaddpage,
            itemStyle: {
              width: '560px'
            }
          },
          mawbAe: {
            title: "总运单号：",
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            },
            verify: "mawb",
            hidden: false
          },
          mawb: {
            title: "总运单号：",
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "280px"
            },
            type: 1,
            hidden: true
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
            hidden: true
          },
          zddlcode: {
            title: "制单代理代码：",
            type: 1,
            hidden: !isaddpage
          },
          zddlzh: {
            title: "制单代理账号：",
            type: 1,
            hidden: !isaddpage
          },
          zdiatacode: {
            title: "制单IATA代码：",
            type: 1,
            hidden: !isaddpage
          },
          czlx: {
            title: "配舱操作：",
            type: 3,
            //groupid: "132",
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
            disabled: true
          },
          orderno: {
            title: "订单来源号：",
            type: 1,
            itemStyle: {
              width: "280px"
            }
          },
          comboine: {
            title: "可否拼单：",
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
          fid: {
            title: "委托客户：",
            type: 11,
            required: true,
            itemStyle: {
              width: "560px"
            },
            contentStyle: {
              display: "flex"
            },
            linkage: "gid",
            pagetype: isaddpage ? 8 : 1,
            disabled: !isaddpage || this.isMawbImport
          },
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
            disabled: !isaddpage || this.isMawbImport,
            showCustomerRel: isaddpage
          },
          sfg: {
            title: "始发港：",
            type: 20,
            pagetype: 6,
            required: true
          },
          mdg: {
            title: "目的港：",
            type: 20,
            pagetype: 6,
            required: true
          },
          zzg: {
            title: "中转港：",
            type: 20,
            verify: "uppercase",
            pagetype: 6
          },
          deliverydate: {
            title: "货好日期：",
            type: 12,
            format: "yyyy-MM-dd HH:mm"
          },
          ybpiece: {
            title: "预报件数：",
            type: 1,
            required: true,
            verify: "integer",
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
            required: true,
            verify: "fixedThree"
          },
          smallpiece: {
            title: "小件数：",
            type: 1,
            verify: "integer"
          },
          zzdate: {
            title: "装载日期：",
            type: 12,
            hidden: true,
            required: true
          },
          realpiece: {
            title: "实际件数：",
            type: 18,
            required: true,
            hidden: isaddpage
          },
          realweight: {
            title: "实际重量：",
            type: 18,
            verify: "fixedTwo",
            required: true,
            hidden: isaddpage
          },
          realvolume: {
            title: "实际体积：",
            type: 18,
            required: true,
            verify: "fixedThree",
            idStyle: {
              width: isaddpage ? "0px" : "560px"
            },
            hidden: isaddpage
          },
          signpiece: {
            title: "签单件数：",
            type: 18,
            required: true,
            hidden: isaddpage
          },
          signweight: {
            title: "签单重量：",
            type: 18,
            verify: "fixedTwo",
            required: true,
            hidden: isaddpage
          },
          signvolume: {
            title: "签单体积：",
            type: 18,
            required: true,
            verify: "fixedThree",
            idStyle: {
              width: isaddpage ? "0px" : "560px"
            },
            hidden: isaddpage
          },
          zdpiece: {
            title: "制单件数：",
            type: 18,
            verify: "integer",
            hidden: isaddpage
          },
          zdweight: {
            title: "制单重量：",
            type: 18,
            verify: "fixedTwo",
            hidden: isaddpage
          },
          zdvolume: {
            title: "制单体积：",
            type: 18,
            verify: "fixedThree",
            hidden: isaddpage
          },
          jfweight: {
            title: "计费重量：",
            type: 18,
            hidden: isaddpage
          },
          yqhbh: {
            title: "要求航班号：",
            hidden: isaddpage,
            type: 1,
            verify: "uppercase",
            elEvent: {
              eventName: 'blur',
              eventFunc: this.getQfsj,
              params: 1
            },
          },
          yqhbrq: {
            title: "要求航班日期：",
            hidden: isaddpage,
            type: 6,
            format: "yyyy-MM-dd HH:mm",
            pickerOptions: pickerOptions,
            elEvent: {
              eventName: 'change',
              eventFunc: this.getQfsj,
              params: 1
            },
          },
          yjqfsj: {
            title: "预计起飞时间：",
            hidden: isaddpage
          },
          // yqqcts: {
          //   title: "要求全程天数：",
          //   type: 1,
          //   verify: "integer",
          //   hidden: !isaddpage,
          //   order:35
          // },
          hbh: {
            title: isaddpage ? "要求航班号：" : "实际航班号：",
            type: isaddpage ? 1 : '',
            verify: "uppercase",
            elEvent: {
              eventName: 'blur',
              funcName: 'getQfsj',
            },
          },
          hbrq: {
            title: isaddpage ? "要求航班日期：" : "实际航班日期：",
            format: "yyyy-MM-dd HH:mm",
            required: true,
            type: isaddpage ? 6 : '',
            pickerOptions: isaddpage ? pickerOptions : {},
            // elEvent: {
            //   eventName: 'change',
            //   funcName:'getQfsj',//当方法写在newFromCmpt中时，直接传入方法名，在里面执行
            //   params: 1 //多个参数用数组
            // },
            elEvent: {
              eventName: 'change',
              eventFunc: this.getQfsj, //传入方法和参数
            },
          },
          qfsj: {
            title: isaddpage ? "预计起飞时间：" : "实际起飞时间：",
            type: isaddpage ? 34 : ''
          },
          //这里通过order控制排序位置
          yqqcts: {
            title: "要求全程天数：",
            type: 1,
            verify: "integer",
            hidden: !isaddpage,
            order: isaddpage ? 35 : 33
          },
          qcts: {
            title: "实际全程天数：",
            verify: "integer",
            hidden: isaddpage
          },
          yjstorearea: {
            title: "入库区域：",
            disabled: true,
            hidden: true,
            type: 24
          },
          yjstorename: {
            title: "预计入库仓库：",
            type: 25,
            hidden: true,
            linkage: "yjstorearea"
          },
          yjstoredate: {
            title: "预计入库日期：",
            type: 6,
            hidden: true,
            format: "yyyy-MM-dd"
          },
          bglx: {
            title: "报关类型：",
            type: 4,
            groupid: "19",
            hidden: false,
            filterable: true
          },
          bgpiece: {
            title: "报关件数：",
            type: 1,
            verify: "integer",
            hidden: false,
            required: false
          },
          bgweight: {
            title: "报关重量：",
            type: 1,
            verify: "fixedTwo",
            hidden: false,
            required: false
          },
          hbzl: {
            title: "要求航班种类：",
            type: 3,
            groupid: "6",
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            }
          },
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
          },
          paymode: {
            title: "运费条款：",
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
            title: "英文品名：",
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
            hidden: isaddpage
          },
          remark: {
            title: "备注：",
            type: 17,
            itemStyle: {
              width: "560px"
            }
          },
          ybvolumeremark: {
            title: "预报尺寸备注：",
            type: 17,
            itemStyle: {
              width: "560px"
            }
          },
          ispay_pre: {
            title: "是否需要预付款：",
            type: "3",
            options: [{
              label: '是',
              value: 1
            }, {
              label: '否',
              value: 2
            }, ],
            default: 2,
            titleStyle: {
              'font-size': '12px',
              'font-weight': 'bold',
              'color': 'red'
            },
            //hidden:true,
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "560px"
            },
            expInfo: true
          },
        },
        //国内服务表单字段
        homeInformation: {
          fid: {
            title: "委托客户：",
            type: 11,
            required: true,
            itemStyle: {
              width: "560px"
            },
            contentStyle: {
              display: "flex"
            },
            linkage: "gid",
            pagetype: isaddpage ? 8 : 1,
            disabled: !isaddpage || this.isMawbImport,
            hidden: false
          },
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
            disabled: !isaddpage || this.isMawbImport,
            showCustomerRel: isaddpage,
            hidden: false
          },
          khjcno: {
            title: "进仓编号：",
            type: 1,
            required: true,
            titleStyle: {
              fontWeight: "700"
            },
            placeholder: "与其他业务可自动关联",
            hidden: true
          },
          piece: {
            title: "件数：",
            type: 1,
            required: true,
            verify: "integer",
            hidden: true
          },
          weight: {
            title: "重量：",
            type: 1,
            required: true,
            verify: "float",
            hidden: true
          },
          volume: {
            title: "体积：",
            type: 1,
            verify: "float",
            hidden: true
          },
          khjcnolist: {
            idStyle: {
              width: '100%'
            },
            itemStyle: {
              width: '100%'
            },
            titleStyle: {
              display: 'none'
            }
          },
          mawb: {
            title: "总运单号：",
            type: 1,
            required: false
          },
          hawb: {
            title: "分运单号：",
            type: 1,
            required: false
          },
          sfg: {
            title: "始发港：",
            type: 20,
            verify: "sfgmdg",
            pagetype: 6
          },
          mdg: {
            title: "目的港：",
            type: 20,
            verify: "sfgmdg",
            pagetype: 6
          },
          dzlx: {
            title: "单证类型：",
            type: 3,
            options: [{
                label: "总单",
                value: "总单"
              },
              {
                label: "直单",
                value: "直单"
              }
            ]
          },
          jfweight: {
            title: "计费重量：",
            type: 1
          },
          accountweightin: {
            title: "结算重量：",
            type: 1
          },
          // reorderman: {
          //   title: "接单人：",
          //   type: 1
          // },
          // ifws: {
          //   title: "操作地：",
          //   type: 3,
          //   options: [{
          //     label: "我司",
          //     value: 1
          //   }, {
          //     label: "非我司",
          //     value: 2
          //   }],
          //   default: 2
          // },
          // ysthwage: {
          //   title: "建议应收提货费：",
          //   type: 1,
          //   required: true,
          //   titleStyle: {
          //     fontSize: '12px'
          //   },
          //   verify: "float",
          //   append: "CNY"
          // },
          // truckgid: {
          //   title: "卡车供应商：",
          //   type: 20,
          //   pagetype: 3,
          //   required: true,
          // },
        },
        //空进总单表单信息 @@进口更改
        basicInformationAi:{
            orderdom: {
              title: '订单类型：',
              type: 3,
              options: [//@@@进口改动
                {label:'总分单(货代委托)',value:'总单'},
                {label:'总直单(货代委托)',value:'直单'}
              ],
              idStyle: { width: '100%' },
              itemStyle: { width: '100%' },
              hidden: false,
              required: true
            },
            mawb:{
              title:'总运单号：',
              idStyle: { width: '100%' },
              itemStyle: { width: '380px' },
              type:1,
              disabled:true
            },
            fid: {
              title: "委托客户：",
              type: 11,
              required: true,
              itemStyle: {
                width: "560px"
              },
              contentStyle: {
                display: "flex"
              },
              linkage: "gid",
              pagetype: isaddpage ? 8 : 1,
              disabled: true
            },
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
              disabled: true,
              showCustomerRel: isaddpage
            },
            sfg: {
              title: "始发港：",
              type: 20,
              pagetype: 6,
              required:true
            },
            mdg: {
              title: "到达港：",
              type: 20,
              pagetype: 6,
              required:true,
              occupyRestSpace: true
            },
            ybpiece: {
              title: "预报件数：",
              type: 1,
              required: true,
              verify: "integer",
            },
            ybweight: {
              title: "预报重量：",
              type: 1,
              lass: "width289",
              required: true,
              verify: "fixedTwo"
            },
            jfweight: {
              title: "计费重量：",
              type: 1,
              verify: "fixedTwo"
            },
            // smallpiece:{
            //   title:'小件数：',
            //   type: 1,
            //   verify: "integer",
            //   occupyRestSpace: true
            // },
            realpiece:{
              title:'实际件数：',
              type: 18,
            },
            realweight:{
              title:'实际重量：',
              type: 18,
            },
            hbh:{
              title:'航班号：',
              type:1,
              required:true
            },
            hbrq:{
              title:'到港日期：',
              type: 6,
              required:true
            },
            jjd:{
              title:'货物来源：',
              type: 3,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              options:[]
            },
            ysfs:{
              title:'入境方式：',
              type: 3,
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              groupid: 64,
              bindValue:'typename',
              bindLabel:'typename'
            }

        },
        //空进分单表单信息 @@进口更改
        basicInformationAiHawb:{
             hawb:{
               title:'分运单号：',
               type: 1,
               required:true,
               idStyle: {
                width: "100%"
                },
               verify:"uppercase"
             },
             sfg: {
              title: "始发港：",
              type: 20,
              pagetype: 6,
              required:true
            },
            mdg: {
              title: "到达港：",
              type: 20,
              pagetype: 6,
              required:true,
              occupyRestSpace: true
            },
            ybpiece: {
              title: "预报件数：",
              type: 1,
              required: true,
              verify: "integer",
            },
            ybweight: {
              title: "预报重量：",
              type: 1,
              lass: "width289",
              required: true,
              verify: "fixedTwo"
            },
            // smallpiece:{
            //   title:'小件数：',
            //   type: 1,
            //   verify: "integer",
            //   occupyRestSpace: true
            // },
            realpiece:{
              title:'实际件数：',
              type: 18,
            },
            realweight:{
              title:'实际重量：',
              type: 18,
            },
            jfweight: {
              title: "计费重量：",
              type: 1,
              verify: "fixedTwo"
            },
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
              hidden:false,
            },
            hwplace:{
              title:'收货人所在地：',
              type:3,
              occupyRestSpace: true,
              groupid:212,
              hidden:false,
            },
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
                detailS: [

                ]
              },
              {
                title: "Freight  Collect",
                detailS: [

                ]
              }
              ],
              hidden:false,
            },
            jsfs:{
              title:'结算方式：',
              type:3,
              occupyRestSpace: true,
              options:[
                {label:'月结',value:'2'},
                {label:'现结',value:'1'}
              ],
              hidden:false,
              disabled:false,
            },
            yjStoredatetype:{
              title:'计费方式：',
              type:3,
              occupyRestSpace: true,
              itemStyle:{width:'100%'},
              options:[
              {
               label:'以实际最早进仓日期为计费方式',
               value:'1'
              },
              {
              label:'以最晚实际进仓日期为计费方式',
              value:'2'
              }],
              hidden:false,
            },
            hasdjh:{
              title:'有无大件货：',
              type:3,
              idStyle:{width:'100%'},
              options:[
              {
                label:'无',
                value:'2'
              },
              {
                label:'有',
                value:'1'
              }
              ],
              hidden:false,
            },
            hascdjh:{
              title:'有无超限货：',
              idStyle:{width:'100%'},
              type:3,
              options:[
              {
                label:'无',
                value:'2'
              },
              {
                label:'有',
                value:'1'
              }
              ],
              hidden:false,
            },
            hastzcx:{
              title:'有无特种超限货：',
              idStyle:{width:'100%'},
              titleStyle:{width:'120px',marginLeft:'-10px'},
              type:3,
              options:[
              {
                label:'无',
                value:'2'
              },
              {
                label:'有',
                value:'1'
              }
             ],
              hidden:false,
            },
            hasjmyq:{
              title:'有无精密仪器：',
              idStyle:{width:'100%'},
              type:3,
              options:[
              {
                label:'无',
                value:'2'
              },  
              {
                label:'有',
                value:'1'
              }
              ],
              hidden:false,
            },
            exForm2:{
              idStyle: {
                width: "100%",
              },
              itemStyle: {
                width: "100%"
              },
              titleStyle: {
                display: "none"
              },
              hidden:false,
            },
            englishpm: {
              title: "英文品名：",
              type: 17,
              verify: "uppercase",
              itemStyle: {
                width: "560px"
              },
              required:true,
              hidden:false,
            },
            sizeremark:{
              title:'尺寸备注',
              type: 17,
              itemStyle: {
                width: "560px"
              },
              //required:true,
              hidden:false,
            }
        },
        //应收表单
        fareInputViewData: {
          currency: {
            title: "运费币种：",
            type: 3,
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            },
            options: [] //需要
          },
          yfstdin: {
            title: "运费标准：",
            type: 3,
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            },
            groupid: 167,
            expInfo: true
          },
          isinwageallin: {
            title: "运费价格：",
            itemStyle: {
              width: isaddpage ? "400px" : "530px"
            },
            type: 3,
            options: [{
              label: "单价ALLIN",
              value: "1"
            }, {
              label: "单价++",
              value: "3"
            }, {
              label: "M级++",
              value: "2"
            }, {
              label: "Cost++",
              value: "4"
            }]
          },
          inwageallinprice: {
            title: "",
            contentStyle: {
              minWidth: "240px",
              marginLeft: "20px"
            },
            required: true,
            titleStyle: {
              display: "none"
            },
            type: 35,
            realBindField: isaddpage ? 'inwageallinprice' : 'inwagecostprice' //实际绑定的字段
          },
          first: {
            title: "分泡比例：",
            itemStyle: {
              width: "560px"
            },
            type: 9,
            options: [{
                title: "WFF",
                linkage: "cus_real_bp_freight_in",
                id: "self_real_bp_freight_in"
              },
              {
                title: "客户",
                linkage: "self_real_bp_freight_in",
                id: "cus_real_bp_freight_in"
              }
            ],
            seque: "first"
          },
          isinwageallin_trans: {
            title: "中转费：",
            itemStyle: {
              width: isaddpage ? "400px" : "530px"
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
            ]
          },
          inwageallinprice_trans: {
            title: "",
            type: "1",
            contentStyle: {
              maxWidth: "180px",
              marginLeft: "20px"
            },
            titleStyle: {
              display: "none"
            }
          },
          second: {
            title: isaddpage ? "分泡比例：" : "中转费分泡：",
            itemStyle: {
              width: "560px"
            },
            type: 9,
            options: [{
                title: "WFF",
                linkage: "cus_real_bp_trans_in",
                id: "self_real_bp_trans_in"
              },
              {
                title: "客户",
                linkage: "self_real_bp_trans_in",
                id: "cus_real_bp_trans_in"
              }
            ],
            seque: "second"
          },
          zhanwei: {
            idStyle: {
              width: "810px"
            },
            hidden: isaddpage
          },
          accountweightin: {
            title: "结算重量：",
            idStyle: {
              width: "560px"
            },
            itemStyle: {
              width: "506px"
            },
            titleStyle: {
              marginTop: "-22px",
              marginRight: "26px"
            },
            hidden: isaddpage,
            type: 36
          }
        },
        //应付
        yingfuViewData: {
          currency_out: {
            title: "运费币种：",
            type: 3,
            idStyle: {
              width: "100%"
            },
            itemStyle: {
              width: "100%"
            },
            options: []
          },
          isoutwageallin: {
            title: "运费价格：",
            itemStyle: {
              width: "430px"
            },
            type: 3,
            options: [{
              label: "单价ALLIN",
              value: "1"
            }, {
              label: "单价++",
              value: "3"
            }, {
              label: "M级++",
              value: "2"
            }]
          },
          outwageallinprice: {
            title: "",
            type: 1,
            contentStyle: {
              maxWidth: "180px",
              marginLeft: "20px"
            },
            required: true,
            titleStyle: {
              display: "none"
            }
          },
          first: {
            title: "运费分泡：",
            itemStyle: {
              width: "560px"
            },
            type: 9,
            options: [{
                title: "WFF",
                linkage: "cus_real_bp_freight_out",
                id: "self_real_bp_freight_out"
              },
              {
                title: "供应商",
                linkage: "self_real_bp_freight_out",
                id: "cus_real_bp_freight_out"
              }
            ],
            seque: "first"
          },
          isoutwageallin_trans: {
            title: "中转费：",
            itemStyle: {
              width: "430px"
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
            ]
          },
          outwageallinprice_trans: {
            title: "",
            type: "1",
            contentStyle: {
              maxWidth: "180px",
              marginLeft: "20px"
            },
            titleStyle: {
              display: "none"
            }
          },
          second: {
            title: "中转费分泡：",
            itemStyle: {
              width: "560px"
            },
            type: 9,
            options: [{
                title: "WFF",
                linkage: "cus_real_bp_trans_out",
                id: "self_real_bp_trans_out"
              },
              {
                title: "供应商",
                linkage: "self_real_bp_trans_out",
                id: "cus_real_bp_trans_out"
              }
            ],
            seque: "second"
          },
          zhanwei: {
            idStyle: {
              width: "710px"
            }
          },
          accountweightout: {
            title: "结算重量：",
            idStyle: {
              width: "560px"
            },
            itemStyle: {
              width: "506px"
            },
            titleStyle: {
              marginTop: "-22px",
              marginRight: "26px"
            },
            type: 36
          }
        },
        mawbConfigHead: [
          //配置总单表头数据
          {
            title: "总运单号",
            field: "mawb"
          },
          {
            title: "供应商",
            field: "gysname"
          },
          {
            title: "总运单所属",
            field: "mawbss"
          },
          {
            title: "总运单类型",
            field: "mawblx"
          },
          {
            title: "总运单形式",
            field: "mawbxs"
          },
          {
            title: "总运单性质",
            field: "mawbxz"
          },
          {
            title: "运输分类",
            field: "ysfl"
          },
          {
            title: "运输条件",
            field: "ystj"
          },
          {
            title: "操作类型",
            field: "czlx"
          },
          {
            title: "始发港",
            field: "sfg"
          },
          {
            title: "备注",
            field: "remark"
          }
        ],
        mawbConfigtableData: [
          //配置总单表格数据
        ],
        hawbForm: {
          hawb: "",
          khjcno: [],
          mdg: "",
          ybpiece: "",
          ybweight: "",
          ybvolume: "",
          realpiece: "",
          realweight: "",
          realvolume: ""
        },
        hawbTableHead: [{
            title: "操作",
            field: "operate"
          },
          {
            title: "分运单号",
            field: "hawb"
          },
          {
            title: "目的港",
            field: "mdg"
          },
          {
            title: "件数",
            field: "ybpiece"
          },
          {
            title: "重量",
            field: "ybweight"
          },
          {
            title: "体积",
            field: "ybvolume"
          },
          {
            title: "进仓编号",
            field: "khjcno"
          }
        ],
        hawbTableData: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() + 3600 * 1000 * 24 < Date.now();
          }
        },
      }
    },
    methods: {
      getQfsj() {
        this.$refs.formCompt.getQfsj()
      },
      getZzg() {
        if (this.inputModelData.zzg) return;
        let sfg = this.inputModelData.sfg;
        let hbh = this.inputModelData.hbh;
        let hbrq = this.inputModelData.hbrq;

        if (hbh && hbh.length < 2) {
          return;
        }
        let json = {
          area: this.$store.state.areaState,
          sfg: sfg,
          hbh: hbh,
          hbrq: hbrq,
          jid: ""
        };
        if (this.inputModelData.sfg && this.inputModelData.hbh && this.inputModelData.hbrq) {
          this.$axios({
            method: "get",
            url: this.$store.state.publicWebApi + "api/PubTakeOffTime",
            params: json,
            loading: false,
            tip: false
          }).then(results => {
            // console.log(3333333333)
            // console.log(results.data.resultdic)
            let zzg = results.data && results.data.resultdic && results.data.resultdic.zzg
            if (zzg) {
              if (results.data.resultdic.zzg.indexOf(',') >= 0) {
                // this.inputModelData.zzg = results.data.resultdic.mdg
                this.basicInformation.zzg.servicecode = zzg
                this.inputModelData.zzglist = zzg
              } else {
                this.inputModelData.zzg = zzg
              }
            }
          });
        }
      },
      dealList(mawbInfo) { //过滤多条服务数据
        mawbInfo.gbzlist =
          mawbInfo.gbzlist &&
          mawbInfo.gbzlist.filter(i => i.packagetype && i.packagestyle)

        if (mawbInfo.gbzlist && mawbInfo.gbzlist.length > 0) { //防止未赋值servicecode
          mawbInfo.gbzlist.forEach(i => {
            i.servicecode = 'AG0120'
          })
        }

        mawbInfo.gbzlistpm =
          mawbInfo.gbzlistpm &&
          mawbInfo.gbzlistpm.filter(
            i => i.materialpm && i.materialstd && i.num && i.wagetype
          )
        if (mawbInfo.gbzlistpm && mawbInfo.gbzlistpm.length > 0) {
          mawbInfo.gbzlistpm.forEach(i => {
            i.servicecode = 'AG0120'
          });
        }


        mawbInfo.gylist =
          mawbInfo.gylist &&
          mawbInfo.gylist.filter(i => i.clothtype && i.clothstd);


        if (mawbInfo.gylist && mawbInfo.gylist.length > 0) {
          mawbInfo.gylist.forEach(i => {
            i.servicecode = 'AG0130'
          });
        }
        mawbInfo.gylistpm =
          mawbInfo.gylistpm &&
          mawbInfo.gylistpm.filter(
            i => i.materialpm && i.materialstd && i.num && i.wagetype
          )

        if (mawbInfo.gylistpm && mawbInfo.gylistpm.length > 0) {
          mawbInfo.gylistpm.forEach(i => {
            i.servicecode = 'AG0130'
          });
        }

        mawbInfo.cltglist =
          mawbInfo.cltglist &&
          mawbInfo.cltglist.filter(
            i => i.materialpm && i.materialstd && i.num && i.wagetype
          )

        if (mawbInfo.cltglist && mawbInfo.cltglist.length > 0) {
          mawbInfo.cltglist.forEach(i => {
            i.servicecode = 'AA0810'
          });
        }
        return mawbInfo
      },
      gnFieldDisplay() {
        // console.log(this.serviceSelArr)
        this.homeInformation.volume.required = false;
        this.homeInformation.mawb.required = false;
        this.homeInformation.hawb.required = false;

        if (this.serviceSelArr.includes("AA0410") || this.serviceSelArr.includes("AG0145")) {
          this.homeInformation.volume.required = true;
        }
        if (this.serviceSelArr.includes("AA0610") || this.serviceSelArr.includes("AG0150")) {
          //  this.homeInformation.mawb.required = true;
          if (this.inputModelData.dzlx == "总单") {
            this.homeInformation.hawb.required = true;
          } else {
            this.homeInformation.hawb.required = false;
            this.homeInformation.mawb.required = true;
          }
        }
        if (
          this.serviceSelArr.includes("AA0110") ||
          this.serviceSelArr.includes("AA0120") ||
          this.serviceSelArr.includes("AA0130")
        ) {
          this.homeInformation.volume.required = true;
          // this.homeInformation.mawb.required = true;
        }


        // this.homeInformation.reorderman.hidden = !this.serviceSelArr.includes("AA0510");
        // this.homeInformation.ifws.hidden = !this.serviceSelArr.includes("AA0510");
        // this.homeInformation.ysthwage.hidden = !(this.serviceSelArr.includes("AA0510") && this.inputModelData.ifws == 1);
        // this.homeInformation.truckgid.hidden = !(this.serviceSelArr.includes("AA0510") && this.inputModelData.ifws == 2);
        this.serviceViewData.AA0510ViewData.reorderman.hidden = !this.serviceSelArr.includes("AA0510");
        this.serviceViewData.AA0510ViewData.ifws.hidden = !this.serviceSelArr.includes("AA0510");
        this.serviceViewData.AA0510ViewData.ysthwage.hidden = !(this.serviceSelArr.includes("AA0510") && this.inputModelData.ifws == 1);
        this.serviceViewData.AA0510ViewData.truckgid.hidden = !(this.serviceSelArr.includes("AA0510") && this.inputModelData.ifws == 2);
        console.log("=========")
        console.log(this.serviceSelArr)
        if (
          this.serviceSelArr.length == 1 &&
          this.serviceSelArr[0] == "AG0110" && 
          (this.inputModelData.opersystem == "国内" || this.inputModelData.opersystem == "国内服务"|| this.inputModelData.opersystemdom == '其它')
        ) {
          // this.homeInformation.fid.required = false;
          // this.homeInformation.gid.required = false;
          // alert(this.inputModelData.opersystemdom)
          // alert(this.inputModelData.opersystemdom)
          // alert(222)
          this.basicinfoView.fid.required = false;
          this.basicinfoView.gid.required = false;
        } else {
          this.basicinfoView.fid.required = true;
          this.basicinfoView.gid.required = true;
        }
      }

    },
    watch: {
      'inputModelData.ifws': {
        handler(val) {
          this.serviceViewData.AA0510ViewData.ysthwage.hidden = val !== 1
          this.serviceViewData.AA0510ViewData.truckgid.hidden = val == 1
        },
        immediate: true
      },
      'inputModelData.opersystem' : {
        handler(val){

        if(val == "国内" || this.inputModelData.opersystemdom == "其它") {
            this.homeInformation.fid.hidden = true
            this.homeInformation.gid.hidden = true
          } 
        }
      }

    }

  }

}



//在三个地方需要使用的服务
export const serviceSplit = function (mixpagetype) {
  //mixpagetype 1新增mawbAddNew  2修改页面，mawbAddPut  3boae延伸服务 increaseServiceSplit.vue
  let isczpage = mixpagetype == 1 || mixpagetype == 2
  let isaddpage = mixpagetype == 1;
  let ysServiceContent = { //boae延伸服务 时使用
    servicecontent: {
      title: "服务内容：",
      type: 17,
      idStyle: {
        width: "560px"
      },
      itemStyle: {
        width: "100%"
      },
      required: true,
      hidden: isczpage
    },
    yqdate: {
      title: "要求完成时间：",
      type: 12,
      idStyle: {
        width: "660px"
      },
      required: true,
      hidden: isczpage
    },
  };



  return {
    data() {
      return {
        //延伸服务表单
        serviceViewData: {
          AA0410ViewData: {
            //始发港入唯凯仓
            yjstorearea_org: {
              title: "入库区域：",
              required: true,
              type: 24
            },
            yjstore_org: {
              title: "仓库名称：",
              required: true,
              type: 25,
              linkage: "yjstorearea_org"
            },
            yjjcdate_org: {
              title: "进仓时间：",
              type: 12,
              required: true
            },
            // khjcno: { title: "进仓编号：", type: 1, required: true },
            shdw: {
              title: "送货单位：",
              type: 1
            },
            hzdno: {
              title: "回执单号：",
              type: 1
            },
            carno: {
              title: "车牌号：",
              type: 1
            },
            goodsmark: {
              title: "货物唛头：",
              type: 1
            },
            gfweight: {
              title: "关封重量：",
              type: 1,
              verify: "fixedTwo"
            },
            breakpiece: {
              title: "破损件数：",
              type: 1,
              verify: "integer"
            },
            moistpiece: {
              title: "潮湿件数：",
              type: 1,
              verify: "integer"
            },
            deformpiece: {
              title: "变形件数：",
              type: 1,
              verify: "integer"
            },
            fdocument: {
              title: "随货单证备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            },
            goodsremark: {
              title: "货物备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            }
          },
          AG0145ViewData: {
            //始发港入唯凯仓
            yjstorearea_org: {
              title: "入库区域：",
              required: true,
              type: 24
            },
            yjstore_org: {
              title: "仓库名称：",
              required: true,
              type: 25,
              linkage: "yjstorearea_org"
            },
            yjjcdate_org: {
              title: "进仓时间：",
              type: 12,
              required: true
            },
            // khjcno: { title: "进仓编号：", type: 1, required: true },
            shdw: {
              title: "送货单位：",
              type: 1
            },
            hzdno: {
              title: "回执单号：",
              type: 1
            },
            carno: {
              title: "车牌号：",
              type: 1
            },
            goodsmark: {
              title: "货物唛头：",
              type: 1
            },
            gfweight: {
              title: "关封重量：",
              type: 1,
              verify: "fixedTwo"
            },
            breakpiece: {
              title: "破损件数：",
              type: 1,
              verify: "integer"
            },
            moistpiece: {
              title: "潮湿件数：",
              type: 1,
              verify: "integer"
            },
            deformpiece: {
              title: "变形件数：",
              type: 1,
              verify: "integer"
            },
            fdocument: {
              title: "随货单证备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            },
            goodsremark: {
              title: "货物备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            }
          },
          AB0420ViewData: {
            //目的港入唯凯仓
            yjstorearea_mdg: {
              title: "入库区域：",
              required: true,
              type: 24
            },
            yjstore_mdg: {
              title: "仓库名称：",
              required: true,
              type: 25,
              linkage: "yjstorearea_mdg"
            },
            yjjcdate_mdg: {
              title: "进仓时间：",
              type: 12,
              required: true
            },
            // khjcno_mdg: { title: "进仓编号：", type: 1, required: true },
            shdw_mdg: {
              title: "送货单位：",
              type: 1
            },
            hzdno_mdg: {
              title: "回执单号：",
              type: 1
            },
            carno_mdg: {
              title: "车牌号：",
              type: 1
            },
            goodsmark_mdg: {
              title: "货物唛头：",
              type: 1
            },
            gfweight_mdg: {
              title: "关封重量：",
              type: 1,
              verify: "fixedTwo"
            },
            breakpiece_mdg: {
              title: "破损件数：",
              type: 1,
              verify: "integer"
            },
            moistpiece_mdg: {
              title: "潮湿件数：",
              type: 1,
              verify: "integer"
            },
            deformpiece_mdg: {
              title: "变形件数：",
              type: 1,
              verify: "integer"
            },
            fdocument_mdg: {
              title: "随货单证备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            },
            goodsremark_mdg: {
              title: "货物备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            }
          },
          AA0510ViewData: {
            //始发港提货
            reorderman: {
              title: "接单人：",
              type: 1
            },
            ifws: {
              title: "操作地：",
              type: 3,
              options: [{
                label: "我司",
                value: 1
              }, {
                label: "非我司",
                value: 2
              }],
              default: 2
            },
            ysthwage: {
              title: "建议应收提货费：",
              type: 1,
              required: true,
              titleStyle: {
                fontSize: '12px'
              },
              verify: "float",
              append: "CNY",
              idStyle: {
                transform: 'translateY(-3px)'
              }
            },
            truckgid: {
              title: "卡车供应商：",
              type: 20,
              pagetype: 3,
              required: true,
            },
            pickupdate_org: {
              title: "要求提货时间：",
              type: 12,
              required: true
            },
            yqfinishdate_org: {
              title: "要求完成时间：",
              type: 12,
              required: true
            },
            truckgid: {
              title: "卡车供应商：",
              type: 20,
              pagetype: 3,
              hidden: true
            },
            remark: {
              title: "备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            }
          },
          AB0520ViewData: {
            //目的港提货
            pickupdate_mdg: {
              title: "要求提货时间：",
              type: 12,
              required: true
            },
            yqfinishdate_mdg: {
              title: "要求完成时间：",
              type: 12,
              required: true
            },
            truckgid_mdg: {
              title: "卡车供应商：",
              type: 20,
              pagetype: 3,
              hidden: true
            },

            remark_mdg: {
              title: "备注：",
              type: 1,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              }
            }
          },
          AA0610ViewData: {
            //唯凯报关
            //  ywlx:{"title":"业务类型：",type:3,idStyle:{width:'100%'},itemStyle:{width:'100%'},options:[{label: '出口报关', value: '出口报关'}, {label: '进口清关', value: '进口清关'}]},
            // status_bg:{title:'报关状态',type:5,dom:'报关状态',whereStr:"in",fieldtype:5},
            // dzlx: {
            //   title: "单证类型：",
            //   type: 3,
            //   options: [
            //     { label: "总单", value: "总单" },
            //     { label: "直单", value: "直单" }
            //   ]
            // },
            // hawb: { title: "分运单号：", type: 1, required: true },
            bglx: {
              title: "报关类型：",
              type: 4,
              groupid: 19,
              required: true
            },
            hbrq: {
              title: "航班日期：",
              type: 6
            },
            bgremark: {
              title: "备注：",
              type: 1
            }
          },
          AG0150ViewData: {
            bglx: {
              title: "报关类型：",
              type: 4,
              groupid: 19,
              required: true
            },
            hbrq: {
              title: "航班日期：",
              type: 6
            },
            bgremark: {
              title: "备注：",
              type: 1
            }
          },
          AB0620ViewData: {
            //唯凯清关
            // dzlx: {
            //   title: "单证类型：",
            //   type: 3,
            //   options: [
            //     { label: "总单", value: "总单" },
            //     { label: "直单", value: "直单" }
            //   ]
            // },
            // hawb: { title: "分运单号：", type: 1, required: true },
            bglx_mdg: {
              title: "报关类型：",
              type: 4,
              groupid: 19,
              required: true
            },
            hbrq: {
              title: "航班日期：",
              type: 6
            },
            bgremark_mdg: {
              title: "备注：",
              type: 1
            }
          },
          AA0230ViewData: {
            servicecontent_wkaj: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_wkaj: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent
          },

          AA0240ViewData: {
            servicecontent_wkjd: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_wkjd: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent
          },

          AG0110ViewData: {
            servicecontent_deli: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_deli: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            courienum_deli: {
              title: "快递单号：",
              required: true,
              type: 1
            },
            destinat_deli: {
              title: "目的地：",
              type: 1
            },
            relshr_deli: {
              title: "收件人：",
              type: 20,
              pagetype: 9,
              required: true
            }
          },
          AG0115ViewData: {
            servicecontent_inspect: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_inspect: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            bzlx_inspect: {
              title: "包装类型：",
              type: 4,
              required: true,
              groupid: 31,
              bindValue: "typename",
              filterable: true
            },
            isstore_inspect: {
              title: "是否我司仓库：",
              type: 3,
              options: [{
                label: "是",
                value: 1
              }, {
                label: "否",
                value: 2
              }]
            },
            storearea_inspect: {
              title: "仓库区域：",
              type: 24,
              required: true
            },
            store_inspect: {
              title: "仓库名称：",
              type: 25,
              required: true,
              linkage: "storearea_inspect"
            },
            appraisal_inspect: {
              title: "鉴定机构：",
              type: 4,
              required: true,
              groupid: 106,
              bindLabel: "ready01"
            }
            // chinesepm_inspect: { title: "中文品名：", type: 17, required: true ,itemStyle: { width: "560px" }}
          },
          AG0120ViewData: {
            servicecontent_pack: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_pack: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            gbzlist: {
              titleStyle: {
                display: "none"
              },
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              hidden: isaddpage
            },
            gbzlistpm: {
              titleStyle: {
                display: "none"
              },
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              hidden: isaddpage
            }
          },
          AA0810ViewData: {
            servicecontent_cltg: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_cltg: {
              title: "要求完成时间：",
              type: 12,
              idStyle: {
                width: "660px"
              },
              hidden: !isczpage
            },
            ...ysServiceContent,
            flowarea_cltg: {
              title: "流向区域：",
              type: 4,
              options: [{
                  label: "外场",
                  value: "外场"
                },
                {
                  label: "仓库",
                  value: "仓库"
                }
              ],
              initialField: "flowpoint_cltg"
            },
            flowpoint_cltg: {
              title: "流向点：",
              type: 26,
              linkage: "flowarea_cltg"
            },
            cltglist: {
              titleStyle: {
                display: "none"
              },
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              hidden: isaddpage
            }
          },
          AA0830ViewData: {
            servicecontent_tzcc: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_tzcc: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            cranetype_tzcc: {
              title: "吊车类型：",
              type: 4,
              groupid: 180
            }
          },
          AA0840ViewData: {
            servicecontent_fh: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_fh: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
          },
          AA0850ViewData: {
            servicecontent_zx: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_zx: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            storearea_zx: {
              title: "仓库区域：",
              type: 24,
              required: true
            },
            store_zx: {
              title: "仓库名称：",
              type: 25,
              linkage: "storearea_zx",
              required: true
            },
            bzlx_zx: {
              title: "包装类型：",
              type: 4,
              groupid: 31,
              required: true,
              bindValue: "typename",
              filterable: true
            }
          },

          AG0125ViewData: {
            servicecontent_chem: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_chem: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            appraisaltype_chem: {
              title: "鉴定类型：",
              type: 3,
              groupid: 143,
              contentStyle: {
                display: "flex"
              },
              bindValue: "typename",
              labelStyle: {
                marginRight: '4px'
              }
            },
            isstore_chem: {
              title: "是否我司仓库：",
              type: 3,
              options: [{
                label: "是",
                value: 1
              }, {
                label: "否",
                value: 2
              }]
            },
            storearea_chem: {
              title: "仓库区域：",
              type: 24
            },
            store_chem: {
              title: "仓库名称：",
              type: 25,
              linkage: "storearea_chem",
              required: true
            },
            bzlx_chem: {
              title: "包装类型：",
              type: 4,
              groupid: 31,
              required: true,
              bindValue: "typename",
              hidden: true,
              filterable: true
            },
            num_chem: {
              title: "化工鉴定份数：",
              type: 1,
              required: true
            },

            appraisal_chem: {
              title: "鉴定机构：",
              type: 4,
              groupid: 106,
              bindLabel: "ready01",
              required: true
            },
            appraisalnum_chem: {
              title: "鉴定编号：",
              type: 1,
              required: true
            },
            makecom_chem: {
              title: "生产厂家：",
              type: 1,
              required: true
            }
            // chinesepm_chem: { title: "中文品名：", type: 17, required: true,itemStyle: { width: "560px" } },
            // englishpm_chem: { title: "英文品名：", type: 17 ,itemStyle: { width: "560px" }}
          },
          AG0130ViewData: {
            servicecontent_safe: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_safe: {
              title: "要求完成时间：",
              type: 12,
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            gylist: {
              titleStyle: {
                display: "none"
              },
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              hidden: isaddpage
            },
            gylistpm: {
              titleStyle: {
                display: "none"
              },
              idStyle: {
                width: "100%"
              },
              itemStyle: {
                width: "100%"
              },
              hidden: isaddpage
            }
          },
          AG0135ViewData: {
            servicecontent_stick: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_stick: {
              title: "要求完成时间：",
              type: 12,
              idStyle: {
                width: "560px"
              },
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            goodsmark_stick: {
              title: "唛头：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "560px"
              }
            }
          },
          //@@ 进口更改
          AG0138ViewData: {
            servicecontent_stick: {
              title: "服务内容：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "100%"
              },
              required: true,
              hidden: !isczpage
            },
            yqdate_stick: {
              title: "要求完成时间：",
              type: 12,
              idStyle: {
                width: "560px"
              },
              required: true,
              hidden: !isczpage
            },
            ...ysServiceContent,
            goodsmark_stick: {
              title: "唛头：",
              type: 17,
              idStyle: {
                width: "560px"
              },
              itemStyle: {
                width: "560px"
              }
            }
          }
        },
        listView: {
          //延伸服务需要添加多条数据的补充
          AG0130: isczpage ? "gylist" : "servicecontentlist",
          AG0130View: {
            clothtype: {
              title: "挂衣类型：",
              type: 4,
              groupid: 162,
              initialField: "clothstd"
            },
            clothstd: {
              title: "挂衣规格：",
              type: 28,
              linkage: "clothtype"
            },
            btn: {
              titleStyle: {
                display: "none"
              }
            }
          },
          AG0130TableHead: [{
              title: "挂衣类型",
              field: "clothtype",
              style: {
                border: "none"
              }
            },
            {
              title: "挂衣规格",
              field: "clothstd",
              style: {
                border: "none"
              }
            },
            {
              title: "材料品名",
              field: "materialpm",
              style: {
                border: "none",
                minWidth: "100px"
              }
            }, {
              title: "材料规格",
              field: "materialstd",
              style: {
                border: "none",
                minWidth: "200px"
              }
            }, {
              title: "数量",
              field: "num",
              style: {
                border: "none",
                minWidth: "30px"
              }
            }, {
              title: "结算方式",
              field: "wagetype",
              style: {
                border: "none",
                minWidth: "80px"
              }
            }, {
              title: "成本价",
              field: "costwage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            }, {
              title: "销售价",
              field: "saleswage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            },
          ],
          AG0130pm: "gylistpm",
          AG0130pmView: clpmggList,
          AG0120: isczpage ? "gbzlist" : "servicecontentlist",
          AG0120View: {
            packagetype: {
              title: "改包装方式：",
              type: 4,
              groupid: 181,
              initialField: "packagestyle"
            },
            packagestyle: {
              title: "改包装类型：",
              type: 31,
              linkage: "packagetype"
            },
            btn: {
              titleStyle: {
                display: "none"
              }
            }
          },
          AG0120pm: isczpage ? "gbzlistpm" : "servicecontentlist",
          AG0120pmView: clpmggList,
          AG0120TableHead: [{
              title: "改包装方式",
              field: "packagetype",
              style: {
                border: "none"
              }
            },
            {
              title: "改包装类型",
              field: "packagestyle",
              style: {
                border: "none"
              }
            }, {
              title: "材料品名",
              field: "materialpm",
              style: {
                border: "none",
                minWidth: "100px"
              }
            }, {
              title: "材料规格",
              field: "materialstd",
              style: {
                border: "none",
                minWidth: "200px"
              }
            }, {
              title: "数量",
              field: "num",
              style: {
                border: "none",
                minWidth: "30px"
              }
            }, {
              title: "结算方式",
              field: "wagetype",
              style: {
                border: "none",
                minWidth: "80px"
              }
            }, {
              title: "成本价",
              field: "costwage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            }, {
              title: "销售价",
              field: "saleswage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            },
          ],
          AA0810: isczpage ? "cltglist" : "servicecontentlist",
          AA0810View: clpmggList,
          AA0810TableHead: [{
              title: "材料品名",
              field: "materialpm",
              style: {
                border: "none",
                minWidth: "100px"
              }
            },
            {
              title: "材料规格",
              field: "materialstd",
              style: {
                border: "none",
                minWidth: "200px"
              }
            },
            {
              title: "数量",
              field: "num",
              style: {
                border: "none",
                minWidth: "30px"
              }
            },
            {
              title: "结算方式",
              field: "wagetype",
              style: {
                border: "none",
                minWidth: "80px"
              }
            },
            {
              title: "成本价",
              field: "costwage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            },
            {
              title: "销售价",
              field: "saleswage",
              style: {
                border: "none",
                minWidth: "30px"
              }
            },
            // {title:'操作',field:'operate',style:{'border':'none'}}
          ]
        },

      }
    },
    methods: {
      async listform(index, servicecode) {
        //多条数据的处理
        let field = (isczpage ? this.listView[servicecode] : "servicecontentlist")
        let data = this.inputModelData[field];

        if (index == 0) {
          if (servicecode == "AG0120") {
            if (
              !data[data.length - 1].packagetype ||
              !data[data.length - 1].packagestyle
            ) {
              return this.$message.error("请选择改包装方式和改包装类型！");
            } else {
              data.push({
                packagetype: "",
                packagestyle: "",
                servicecode: 'AG0120'
              });
            }
          }

          if (servicecode == "AG0120pm") {
            if (
              !data[data.length - 1].materialpm ||
              !data[data.length - 1].materialstd ||
              !data[data.length - 1].num ||
              !data[data.length - 1].wagetype
            ) {
              return this.$message.error(
                "请选择材料品名,材料规格,数量,结算方式！"
              );
            } else {
              data.push({
                materialpm: "",
                materialstd: "",
                num: "",
                wagetype: "",
                servicecode: 'AG0120',
                costwage: '',
                saleswage: ''
              });
            }
          }


          if (servicecode == "AG0130") {
            if (
              !data[data.length - 1].clothtype ||
              !data[data.length - 1].clothstd
            ) {
              return this.$message.error("请选择挂衣类型和挂衣规格！");
            } else {
              data.push({
                clothtype: "",
                clothstd: "",
                servicecode: 'AG0130'
              });
            }
          }

          if (servicecode == "AG0130pm") {
            if (
              !data[data.length - 1].materialpm ||
              !data[data.length - 1].materialstd ||
              !data[data.length - 1].num ||
              !data[data.length - 1].wagetype
            ) {
              return this.$message.error(
                "请选择材料品名,材料规格,数量,结算方式！"
              );
            } else {
              data.push({
                materialpm: "",
                materialstd: "",
                num: "",
                wagetype: "",
                servicecode: 'AG0130',
                costwage: '',
                saleswage: ''
              });
            }
          }



          if (servicecode == "AA0810") {
            if (
              !data[data.length - 1].materialpm ||
              !data[data.length - 1].materialstd ||
              !data[data.length - 1].num ||
              !data[data.length - 1].wagetype
            ) {
              return this.$message.error(
                "请选择材料品名,材料规格,数量,结算方式！"
              );
            } else {
              data.push({
                materialpm: "",
                materialstd: "",
                num: "",
                wagetype: "",
                servicecode: 'AA0810',
                costwage: '',
                saleswage: ''
              });
            }
          }
        } else {
          if (data[index].isdel) {
            let confirm = await this.$confirm("是否确认删除？", "提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            });

            if (!confirm) return;
            console.log(data)
            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + (isczpage ? "api/ExHpoServiceType" : "api/ExYsServiceType"),
              data: {
                guid: data[index].guid,
                czman: localStorage.usrname
              },
              loading: false,
              tip: false
            }).then(results => {
              if (results.data.resultstatus == 0) {
                data.splice(index, 1);
                if (!isczpage) {
                  this.tableData[this.putIndex][field].splice(index, 1)
                }
              } else {
                return this.$message.error(results.data.resultmessage);
              }
            });
          } else {
            data.splice(index, 1);
          }
        }
      },
      watchYsService() {
        if (this.homeInformation && this.homeInformation.hawb) { //新增与修改有，延伸服务里面没有
          this.$watch(
            function () {
              return this.inputModelData.dzlx;
            },
            function (val) {
              if (val == "总单" && (this.serviceSelArr.includes("AA0610") || this.serviceSelArr.includes("AG0150"))) {
                this.homeInformation.hawb.required = true;
              } else {
                this.homeInformation.hawb.required = false;
              }
            }, {
              immediate: true
            }
          );
        }

        this.$watch(
          function () {
            return this.inputModelData.isstore_inspect;
          },
          function (val) {
            this.serviceViewData.AG0115ViewData.storearea_inspect.hidden = val != 1;
            this.serviceViewData.AG0115ViewData.store_inspect.type = val == 1 ? 25 : 1;
          }, {
            immediate: true
          }
        );

        this.$watch(
          function () {
            return this.inputModelData.isstore_chem;
          },
          function (val) {
            this.serviceViewData.AG0125ViewData.storearea_chem.hidden = val != 1;
            this.serviceViewData.AG0125ViewData.store_chem.type = val == 1 ? 25 : 1;
          }, {
            immediate: true
          }
        );

        this.$watch(
          function () {
            return this.inputModelData.appraisaltype_chem;
          },
          function (val) {
            let arr = [
                "appraisalnum_chem",
                "makecom_chem",
                //  "appraisal_chem"
              ],
              arr1 = [
                "appraisalnum_chem",
                "makecom_chem",
                //  "appraisal_chem",
                "num_chem"
              ],
              arr2 = [
                "isstore_chem",
                "storearea_chem",
                "store_chem",
                "bzlx_chem"
              ];

            arr.forEach(i => {
              this.serviceViewData.AG0125ViewData[i].required = val == "代取鉴定";
            });

            arr1.forEach(i => {
              this.serviceViewData.AG0125ViewData[i].hidden = val !== "代取鉴定";
            });

            arr2.forEach(i => {
              this.serviceViewData.AG0125ViewData[i].hidden = val == "代取鉴定";
            });
          }, {
            immediate: true
          }
        );
      }
    }
  }
}
