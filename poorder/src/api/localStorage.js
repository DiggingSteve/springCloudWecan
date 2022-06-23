import html2Canvas from 'html2canvas'
//import JsPDF from 'jspdf'
import store from "../store"
import router from '../router'

//用户名usrname  票据ticket   地区area    基础数据groupType   货币currencyData   服务serviceData
const setStorage = function setStorage(name, val) {
  localStorage.setItem(name, val)
}
const getStorage = function getStorage(name) {
  return localStorage.getItem(name)
}
const clearStorage = function clearStorage(name) {
  localStorage.removeItem(name)
}
const searCondition = function searCondition(condition) {
  //  //console.log(condition)
  let scondition = {};
  let val = ""
  for (let i in condition) {
    if (condition[i].model && condition[i].model != "[]" && JSON.stringify(condition[i].model) != "[]") {
      if (condition[i].sear == 1) { //是否搜索页面查询
        if (condition[i].whereC) { //是否存在“in”，“like”
          if (condition[i].whereC == "like") {
            scondition[condition[i].id] = {
              "like": $.trim(condition[i].model)
            }
          } else if (condition[i].whereC == "in") {
            if (condition[i].model.length > 0) {
              let selS = ""
              let sel = condition[i].model
              for (let i in sel) {
                selS += sel[i] + ","
              }
              scondition[condition[i].id] = {
                "in": selS.substring(0, selS.length - 1)
              }
            }
          }
        } else {
          if (condition[i].type == 7) { //查询中日期赋值
            let time = condition[i].model
            //console.log(time)
            scondition[condition[i].id] = {
              "begin": time[0].getFullYear() + "-" + (time[0].getMonth() + 1) + "-" + time[0].getDate(),
              "end": time[1].getFullYear() + "-" + (time[1].getMonth() + 1) + "-" + time[1].getDate()
            }
          } else if (condition[i].type == 5) { //查询中下拉赋值
            if (condition[i].model.length > 0) {
              let selS = ""
              let sel = condition[i].model
              for (let i in sel) {
                selS += sel[i] + ","
              }
              scondition[condition[i].id] = selS.substring(0, selS.length - 1)

            }

          } else {
            scondition[condition[i].id] = condition[i].model
          }
        }
      } else {
        if (condition[i].type == 5) { //多选
          if (condition[i].model.length > 0) {
            let selS = ""
            let sel = condition[i].model
            for (let i in sel) {
              selS += sel[i] + ","
            }
            scondition[condition[i].id] = selS.substring(0, selS.length - 1)

          }
        } else if (condition[i].type == 11) {
          scondition[condition[i].id] = condition[i].model
          scondition['gid'] = condition[i].modelId
        } else {
          ////console.log(condition[i].type)
          scondition[condition[i].id] = condition[i].model
        }

      }
    } else if (condition[i].type == 9) {
      var tem = condition[i].options
      for (var j in tem) {
        scondition[tem[j].id] = $.trim(tem[j].model)
      }
    }
  }
  return scondition
}

const reset = function (data) {
  if (data.length > 0) {
    for (var i in data) {
      data[i].model = data[i].defaultModel
    }
    return data
  }

}

const filterGroupid = function (inputData) {
  let groupData = JSON.parse(localStorage.getItem('groupType'))
  let currencyData = JSON.parse(localStorage.getItem('currencyData'))
  for (let i in inputData) {
    if (inputData[i].id != "currency") {
      for (let j in groupData) {
        if (inputData[i].groupid) {
          if (inputData[i].groupid == groupData[j].groupid) {
            let item = groupData[j]
            inputData[i].options.push({
              'value': item.ready01,
              'label': item.typename,
              ready02: item.ready02,
              id: item.id,
              key: item.typename + item.ready02
            })

          }
        }

      }
    } else {
      for (let j in currencyData) {
        inputData[i].options.push({
          'value': currencyData[j].cname,
          'label': currencyData[j].cname
        })
      }
    }
  }
}

const evaluationModel = function (resdata, viewdata) {
  for (let i in viewdata) {
    let item = viewdata[i]
    item.model = resdata[item.id]
  }
}

//时间格式化
const formatDate = function (date, format) {


  if (!date || String(date).indexOf('1900') >= 0 || String(date).indexOf('0001') >= 0 || String(date).indexOf('9999') >= 0) {
    return ''
  } else {
    if (String(date).indexOf('GMT') >= 0) {
      return new Date(getNowFormatDate(date)).Format(format)
    } else if (date.indexOf("T") >= 0) {
      return dateFormat(date, format)
    } else {
      return (new Date(date.replace(/-/g, '/'))).Format(format)
    }

  }

}

function getNowFormatDate(date) {
  var date = date || new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var min = date.getMinutes()
  var sec = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (min >= 0 && min <= 9) {
    min = "0" + min;
  }
  if (sec >= 0 && sec <= 9) {
    sec = "0" + sec;
  }


  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + min +
    seperator2 + sec
  return currentdate;
}

String.prototype.DateFormat = function (format, addHours) {
  var date = new Date(Date.parse(this.toString().replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d*[1-9]\d/, "").substr(0, 19)));
  if (addHours) {
    date.setHours(date.getHours() + addHours);
  }
  //console.log(date)
  return date

}

Date.prototype.Format = function (format) {
  var obj = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var index in obj) {
    if (new RegExp("(" + index + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[index]) : (("00" + obj[index]).substr(("" + obj[index]).length)));
    }
  }
  return format;
};



// 时间转换
const dateFormat = function (dateval, format) {
  if (!dateval || dateval.toString().indexOf('1900') > -1) {
    return "";
  }
  var date = dateval.split('T');
  var hms = (format.split(" "))[1];
  if (hms) {
    var hmsArr = hms.split(":");
    if (hmsArr[2]) {
      return date[0] + " " + date[1].substr(0, 8)
    } else if (hmsArr[1]) {
      return date[0] + " " + date[1].substr(0, 5)
    } else {
      return date[0] + " " + date[1].substr(0, 2)
    }

  } else {
    return date[0];
  }
}

//获取当前时间
const getMomentDate = function (type) { //1 获取下一个月  2获取上一个月
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var year = date.getFullYear()


  if (type == '1') {
    if (month == 12) {
      year = year + 1
      month = 1
    } else {
      month = month + 1
    }
  } else if (type == '2') {
    if (month == 1) {
      year = year - 1
      month = 12
    } else {
      month = month - 1
    }
  }

  var strDates = new Date(year, month, 0) //加一个月的时间，判断日期是否超过当月

  var strDate2 = strDates.getDate()
  var strDate = date.getDate();

  var min = date.getMinutes()
  var sec = date.getSeconds()

  if (strDate > strDate2) {
    strDate = strDate2
  }





  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (min >= 0 && min <= 9) {
    min = "0" + min;
  }
  if (sec >= 0 && sec <= 9) {
    sec = "0" + sec;
  }


  var currentdate = year + seperator1 + month + seperator1 + strDate +
    " " + date.getHours() + seperator2 + min +
    seperator2 + sec
  return currentdate;
}






//重量体积小数转化
const pointChange = function (val, count) {
  return Number(val).toFixed(count)
}


//收发货人取值
const revsendPerson = function (insert, data) {
  for (var i in insert) {
    if (i != "title" && i != "jsonArr" && i != "model") {
      data[i] = insert[i]
    }
  }
  return data
}



// 清关、抽单、仓库、卡车取值
const otherService = function (insert, data) {
  for (var i in insert) {
    data[i] = insert[i]
  }
  ////console.log(insert)
  return data
}

// 清关、抽单、仓库、卡车、收发货人赋值
const ServiceFZ = function (insert, data) {
  for (var i in data) {
    for (var j in insert) {
      if (i == j) {
        insert[j] = data[i]
      }
    }
  }
  return insert
}

//货币汇率赋值
const getChangeRate = function (val) {
  var currencyData = JSON.parse(localStorage.getItem('currencyData'))
  var changerate
  for (var i in currencyData) {
    if (currencyData[i].cname == val) {
      changerate = Number(currencyData[i].basicprice).toFixed(4)
    }
  }
  // //console.log(changerate)
  return changerate
}

//取英文货币
const getEnglishCurrency = function (val) {
  var currencyData = JSON.parse(localStorage.getItem('currencyData'))
  var englishCurrency
  for (var i in currencyData) {
    if (currencyData[i].cname == val) {
      englishCurrency = currencyData[i].fcode
    }
  }
  // //console.log(changerate)
  return englishCurrency
}

//取英文服务项目

const getEnglishService = function (val) {
  var currencyData = JSON.parse(localStorage.getItem('fwxm'))
  var englishService
  for (var i in currencyData) {
    if (currencyData[i].s_name == val) {
      englishService = currencyData[i].dname
    }
  }
  // //console.log(changerate)
  return englishService
}

//中文日期时间转化英文
const ceDataChange = function (val) {

  if (val != " ") {
    var date = val;
    var monthDay = [{
      "cMonth": "01",
      "eMonth": "January"
    }, {
      "cMonth": "02",
      "eMonth": "February"
    }, {
      "cMonth": "03",
      "eMonth": "March"
    }, {
      "cMonth": "04",
      "eMonth": "April"
    }, {
      "cMonth": "05",
      "eMonth": "May"
    }, {
      "cMonth": "06",
      "eMonth": "June"
    }, {
      "cMonth": "07",
      "eMonth": "July"
    }, {
      "cMonth": "08",
      "eMonth": "August"
    }, {
      "cMonth": "09",
      "eMonth": "September"
    }, {
      "cMonth": "10",
      "eMonth": "October"
    }, {
      "cMonth": "11",
      "eMonth": "November"
    }, {
      "cMonth": "12",
      "eMonth": "December"
    }]
    //console.log(date.split('-'))
    var newYeay = date.split("-")[0]
    var newDay = date.split("-")[2].substring(0, 2)
    //console.log(newDay)
    var newMonth = date.split("-")[1]

    //console.log(newDay.length)
    if (newDay.length == 1) {
      //console.log(newMonth)
      //console.log(newDay.indexOf('8'))
      newDay = '0' + newDay
    }

    // if(date.split(' ')[1].substring())

    $.each(monthDay, function (index, item) {
      if (item.cMonth == newMonth) {
        newMonth = item.eMonth
      }
    })
    var newtime = newMonth + " " + newDay + "," + newYeay
    //console.log(newtime)
    return newtime
  }
}




// 判定输入值
//1、二字码  2、邮编  3、电话  4、传真  5、邮键 6、英文品名 7、数字(整数)
// const yanzhenzz=function yanzhenzz(val,type){

//     switch(type){
//       case 1:
//         // val.toUpperCase()

//       var reg=/^[A-Za-z]{2}$/g
//       if(val&&!reg.test(val)){
//       this.$message.error('请输入正确国家二字码');
//       val=''
//       }else{
//         val=val.toUpperCase()
//         //$(el).val(val.toUpperCase())
//       }
//       break;
//     case 2:
//       var reg=/^[1-9][0-9]{5}$/
//       if(val&&!reg.test(val)){
//          this.$message.error('请输入正确邮编')
//       }
//       break;
//     case 3:
//       var reg=/^0\d{2,3}-?\d{7,8}$/
//       if(val&&!reg.test(val)){
//         this.$message.error('请输入正确电话')
//       }
//       break;
//     case 4:
//       var reg=/^(\d{3,4}-)?\d{7,8}$/
//       if(val&&!reg.test(val)){
//         this.$message.error('请输入正确传真')
//       }
//       break;
//     case 5:
//       var reg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
//       if(val&&!reg.test(val)){
//         this.$message.error('请输入正确邮箱')
//       }
//       break;
//       case 6:
//     var reg=/[\u4e00-\u9fa5]+/g
//     if(val&&!reg.test(val)){
//      this.$message.error('请输入英文或数字')
//      val=''
//     }
//       break;
//       case 7:
//       ////console.log(val)
//       var reg=/^[1-9]\d*$/
//       if(val&&!reg.test(val)){
//         //alert('1')
//        //this.$message.error('请输入整数')
//        val=''
//       }
//       break;

//     }
// }


// 货币中文转换
const convertCurrency = function (money) {
  //汉字的数字
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  //基本单位
  var cnIntRadice = new Array('', '拾', '佰', '仟');
  //对应整数部分扩展单位
  var cnIntUnits = new Array('', '万', '亿', '兆');
  //对应小数部分单位
  var cnDecUnits = new Array('角', '分', '毫', '厘');
  //整数金额时后面跟的字符
  var cnInteger = '';
  //整型完以后的单位
  var cnIntLast = '元';
  //最大处理的数字
  var maxNum = 999999999999999.9999;
  //金额整数部分
  var integerNum;
  //金额小数部分
  var decimalNum;
  //输出的中文金额字符串
  var chineseStr = '';
  //分离金额后用的数组，预定义
  var parts;
  if (money == '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    //超出最大处理数字
    return '';
  }
  if (money == 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger;
    return chineseStr;
  }
  //转换为字符串
  money = money.toString();
  if (money.indexOf('.') == -1) {
    integerNum = money;
    decimalNum = '';
  } else {
    parts = money.split('.');
    integerNum = parts[0];
    decimalNum = parts[1].substr(0, 4);
  }
  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    var zeroCount = 0;
    var IntLen = integerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = integerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        //归零
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    chineseStr += cnIntLast;
  }
  //小数部分
  if (decimalNum != '') {
    var decLen = decimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = decimalNum.substr(i, 1);
      if (n != '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (chineseStr == '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (decimalNum == '') {
    chineseStr += cnInteger;
  }
  return chineseStr;
}

// 转pdf

const getPdf = function (title, dom) {

  html2Canvas(document.querySelector('#' + dom), {
    allowTaint: true
  }).then(function (canvas) {
    let contentWidth = canvas.width
    let contentHeight = canvas.height
    let pageHeight = contentWidth / 592.28 * 841.89
    let leftHeight = contentHeight
    let position = 0
    let imgWidth = 595.28
    let imgHeight = 592.28 / contentWidth * contentHeight
    let pageData = canvas.toDataURL('image/jpeg', 1.0)
    let PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 10, 10, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 10, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(title + '.pdf')
  })


}

function computedWeight(volume, weight, ifRound) {

  var jfweight = 0
  if (weight && volume) {
    jfweight = (volume / 0.006 > weight) ? volume / 0.006 : weight

  }
  return Number(jfweight).toFixed(0)
  // var wc = jfweight - parseInt(jfweight)
  // if (wc == 0 || wc == 0.5) {
  //   jfweight = jfweight
  // } else {
  //   jfweight = wc > 0.5 ? (parseInt(jfweight) + 1) : parseInt(jfweight) + 0.5
  // }
  // return !jfweight ? 0 : (ifRound ? Math.round(jfweight) : Number(jfweight).toFixed(2))
  // }

}


//处理查询数据
const getChangeValue = function (newdata, system, routerName, setdisablefunc) {
  console.time("gettime");

  // 处理日期和件重体
  let isinwagealltext = {
    1: '单价ALLIN',
    2: '总价ALLIN',
    3: '单价++',
    4: 'Cost+'
  }
  let currencyChars = {
    '人民币': '￥',
    '美元': '$',
    '港币': 'HK$',
    '日元': 'JPY￥',
    '欧元': '€',
    '英镑': '£'
  }
  let areaname = [{
      label: '南美航线',
      value: '2'
    },
    {
      label: '欧洲航线',
      value: '3'
    },
    {
      label: '亚洲航线',
      value: '4'
    },
    {
      label: '北美航线',
      value: '7'
    },
    {
      label: '非洲航线',
      value: '8'
    },
    {
      label: '澳洲航线',
      value: '9'
    },
    {
      label: '印巴中东航线',
      value: '10'
    }
  ]

  let statusData = JSON.parse(localStorage.getItem('statusData'))
  let currencyData = JSON.parse(localStorage.getItem('currencyData'))
  let groupTypeCode = JSON.parse(localStorage.getItem('groupTypeCode'))

  let currentRoute = '',
    allfields = [];
  let gysxm = getxmdata('gysxm') || []
  let wtxm = getxmdata("wtxm");
  let wtkh = getxmdata("wtkh");

  currentRoute = routerName || router.currentRoute.name
  if (currentRoute == 'documentConfirmation') {
    currentRoute = localStorage.documentConfirmation || 'danhaoConfirm'
  }

  if (store.state.tablePageTmp[currentRoute]) {

    if (store.state.childrenTablePageTmp[currentRoute]) {
      //console.log(store.state.childrenTablePageTmp[currentRoute].map(i=>i.field))
      allfields = (store.state.tablePageTmp[currentRoute][0].concat(store.state.tablePageTmp[currentRoute][1]).concat(store.state.childrenTablePageTmp[currentRoute])).map(i => i.field)
    } else {
      allfields = (store.state.tablePageTmp[currentRoute][0].concat(store.state.tablePageTmp[currentRoute][1])).map(i => i.field)
    }
    // console.log(allfields)
  }

  system = system || '空出'

  let showField = function (field) {
    return allfields.includes(field) || allfields.length == 0
  }


  for (let i = 0; i < newdata.length; i++) {

    let item = newdata[i]
    if (item.areaname !== undefined) {
      for (let i of areaname) {
        if (item.areaname == i.value) {
          item.areaname = i.label
          break
        }
      }
    }


    if (showField('commitstatus')) {
      item.commitstatus = item.commitstatus == '100' ? '申请中' : item.commitstatus == '200' ? '已驳回' : item.commitstatus == '500' ? '已通过' : ''
    }


    item.inwageallinprice = item.inwageallinprice == 666666 ? '' : Number(item.inwageallinprice).toFixed(2)


    item.outwageallinprice = item.outwageallinprice == 666666 ? '--' : Number(item.outwageallinprice).toFixed(2)


    item.outwageallinprice_trans = item.outwageallinprice_trans == 666666 ? '--' : item.outwageallinprice_trans


    item.inwageallinprice_trans = item.inwageallinprice_trans == 666666 ? '--' : item.inwageallinprice_trans

    /*   if (item.sendtype) {
        item.sendtype = item.sendtype == 1 ? '天运通' : '天信达'
      } */

    if (showField('fpbl_in')) {
      item.fpbl_in = `${item.self_real_bp_freight_in}(w)/${item.cus_real_bp_freight_in}(k)`
    }

    if (showField('wagein_pre')) {
      item.wagein_pre = item.wagein_pre == 666666 ? '--' : Number(item.wagein_pre||0).toFixed(2)
    }

    if (showField('wagein_pre_real')) {
      item.wagein_pre_real = item.wagein_pre_real == 666666 ? '--' : Number(item.wagein_pre_real).toFixed(2)
    }


    if (showField('fpbl_out')) {
      item.fpbl_out = `${item.self_real_bp_freight_out}(w)/${item.cus_real_bp_freight_out}(k)`
    }


    if (currentRoute != 'listConfirm') {
      item.freightfee_in = (currencyChars[item.currencyin] || '') + item.inwageallinprice
    }

    if (showField('freightfee_out')) {
      item.freightfee_out = (currencyChars[item.currencyout] || '') + item.outwageallinprice
    }


    if (showField('isinwageallin')) {
      item.isinwageallinNumber = item.isinwageallin
      item.isinwageallin = isinwagealltext[item.isinwageallin] || ''
    }

    if (showField('confirmstatus_wageout')) {
      item.confirmstatus_wageout = item.wageall_out
    }

    if (showField('cargodate')) {
      item.cargodate = item.cargodate
    }


    if (showField('confirmstatus_wagein')) {
      item.confirmstatus_wagein = item.wageall_in
    }
    if (showField('bindboae')) {
      item.bindboae = item.bindboae == 1 ? '是' : '否'
    }



    if (showField('isoutwageallin')) {
      item.isoutwageallin = isinwagealltext[item.isoutwageallin] || '--'
    }

    if (showField('sjqcts')) {
      item.sjqcts = item.sjqcts || 0

    }

    if (showField('qcts')) {
      item.qcts = item.qcts || 0

    }
    if (showField('modifyman')) {
      item.modifyman = item.modifyman || '--'

    }
    if (showField('chinesepm')) {
      item.chinesepm = item.chinesepm || '--'

    }
    if (showField('batterymodel')) {
      item.batterymodel = item.batterymodel || '--'

    }
    if (showField('orderno')) {
      item.orderno = item.orderno || '--'
    }


    if (showField('areadom')) {
      item.areadom = item.orginarea + item.orgindom
    }


    // if (showField('islocal')) {
    item.islocal = item.islocal && (item.islocal == '1' ? '是' : '否')
    // }
    if (showField('pdfinishstatus')) {
      item.pdfinishstatusNumber = item.pdfinishstatus
      item.pdfinishstatus = item.pdfinishstatus == 100 ? '已完成' : '未完成'
    }
    if (showField('thprint')) {
      item.thprintNumber = item.thprint;
      item.thprint = item.thprint && (item.thprint == '1' ? '已打印' : '未打印') || '--'
    }

    if (showField('profitmode')) {
      item.profitmode = item.profitmode || '本站'
    }




    if (String(item.creditisbackstatus).length) {
      item.creditisbackstatusNumber = item.creditisbackstatus
      if (item.creditisbackstatus == 3) {
        item.creditisbackstatus = '已通过'
      } else if (item.creditisbackstatus == 4) {
        item.creditisbackstatus = '待通过'
      } else if (item.creditisbackstatus == 5) {
        item.creditisbackstatus = '已驳回'
      } else if (item.creditisbackstatus == 6) {
        item.creditisbackstatus = '无异常'
      }
    }

    if (showField('isclock')) {
      item.isclockNumber = item.isclock;
      if (item.isclock == '0') {
        item.isclock = '未锁定'
      } else if (item.isclock == '1') {
        item.isclock = '已锁定'
      } else if (item.isclock == '2') {
        item.isclock = '对账单已发送'
      } else if (item.isclock == '3') {
        item.isclock = '已解锁'
      }
    }


    //     if (showField.indexOf('pactlsendstatus') >= 0) {
    //item.pactlsendstatusNumber=item.pactlsendstatus
    //     if (item.pactlsendstatus == '-1') {
    //       item.pactlsendstatus = '已忽略'
    //     } else if (item.pactlsendstatus == 0) {
    //       item.pactlsendstatus = '未发送'
    //     } else if (item.pactlsendstatus == 1) {
    //       item.pactlsendstatus = '已发送'
    //     } else if (item.pactlsendstatus == 2) {
    //       item.pactlsendstatus = '发送失败'
    //     }else if (item.pactlsendstatus == 5) {
    //       item.pactlsendstatus = '已二次修改'
    //     }else if (item.pactlsendstatus == 10) {
    //       item.pactlsendstatus = '虚拟发送'
    //     }

    // }

    if (showField('wtkhname')) {
      //console.log(wtkh)
      //console.log(wtkh.filter(i=>i.id==item.gid)[0]['usr_name'])
      if (item.fid > 0) {
        item.wtkhname = wtkh.filter(i => i.id == item.fid).length && wtkh.filter(i => i.id == item.fid)[0]['usr_name'] || '--'
      } else {
        item.wtkhname = item.wtkhname || '--'
      }

    }
    if (showField('wtxmname')) {
      //console.log(wtxm)
      if (item.gid > 0) {
        item.wtxmname = wtxm.filter(i => i.id == item.gid).length && wtxm.filter(i => i.id == item.gid)[0]['usr_name'].split('-')[0] || '--'
      } else {
        item.wtxmname = '--'
      }
    }
    if (showField('realwtkhname')) {
      if (item.area != '市场部' && item.area != '海外部') {
        item.realwtkhname = '--'
      }
    }

    if (showField('bggysname')) {
     if (item.bggys > 0) {
        item.bggysname = gysxm.filter(i => i.id == item.bggys).length && gysxm.filter(i => i.id == item.bggys)[0]['usr_name'].split('-')[1] || '--'
      } else {
        item.bggysname = '--'
      }
    }

    if (showField('shipperno')) {
      item.shipperno = item.shipperno || '--'
    }

    if (showField('czlx')) {
      if (item.czlx || item.czlx == '0') {
        if(item.czlx!='全部'){
          item.czlx = getValByGrouid(132, item.czlx, groupTypeCode)
        }
      }
    }

    if (item.mawbconfirmstatus || item.mawbconfirmstatus == '0') {
      item.mawbconfirmstatusNumber = item.mawbconfirmstatus
      item.mawbconfirmstatus = getValByGrouid(195, item.mawbconfirmstatus, groupTypeCode)
    }

    if (showField('kfconfirmstatus')) {
      item.kfconfirmstatus = item.kfconfirmstatus == 1 ? '费用未确认' : (item.kfconfirmstatus == 700 ? '费用已确认' : '--')
    }

    if (showField('hxconfirmstatus')) {
      item.hxconfirmstatus = item.hxconfirmstatus == 1 ? '费用未确认' : (item.hxconfirmstatus == 700 ? '费用已确认' : '--')
    }
    if (showField('jsconfirmstatus')) {
      item.jsconfirmstatus = item.jsconfirmstatus == 1 ? '费用未确认' : (item.jsconfirmstatus == 700 ? '费用已确认' : '--')
    }

    if (item.mawbnoconfirmstatus || item.mawbnoconfirmstatus == '0') {
      item.mawbnoconfirmstatusNumber = item.mawbnoconfirmstatus
      item.mawbnoconfirmstatus = getValByGrouid(195, item.mawbnoconfirmstatus, groupTypeCode)
    }


    if (item.hawbconfirmstatus) {
      item.hawbconfirmstatusNumber = item.hawbconfirmstatus
      item.hawbconfirmstatus = getValByGrouid(195, item.hawbconfirmstatus, groupTypeCode)
    }

    if (item.hawbdzmodifystatusdz) {
      item.hawbdzmodifystatusdzNumber = item.hawbdzmodifystatusdz
      item.hawbdzmodifystatusdz = getValByGrouid(164, item.hawbdzmodifystatusdz, groupTypeCode)
    }

    if (item.hawbnoconfirmstatus) {
      item.hawbnoconfirmstatusNumber = item.hawbnoconfirmstatus
      item.hawbnoconfirmstatus = getValByGrouid(195, item.hawbnoconfirmstatus, groupTypeCode)
    }

    if (item.kfconfirmstatus_in) {
      item.kfconfirmstatus_inNumber = item.kfconfirmstatus_in
      item.kfconfirmstatus_in = getValByGrouid(196, item.kfconfirmstatus_in, groupTypeCode) || '--'
    }

    if (item.kfconfirmstatus_out) {
      item.kfconfirmstatus_outNumber = item.kfconfirmstatus_out
      item.kfconfirmstatus_out = getValByGrouid(196, item.kfconfirmstatus_out, groupTypeCode) || '--'
    }

    if (item.hxconfirmstatus_in) {
      item.hxconfirmstatus_inNumber = item.hxconfirmstatus_in
      item.hxconfirmstatus_in = getValByGrouid(196, item.hxconfirmstatus_in, groupTypeCode) || '--'
    }
    if (item.hxconfirmstatus_out) {
      item.hxconfirmstatus_outNumber = item.hxconfirmstatus_out
      item.hxconfirmstatus_out = getValByGrouid(196, item.hxconfirmstatus_out, groupTypeCode) || '--'
    }
    if (item.workconfirmstatus) {
      item.workconfirmstatusNumber = item.workconfirmstatus
      item.workconfirmstatus = getValByGrouid(196, item.workconfirmstatus, groupTypeCode) || '--'
    }


    if (showField('sendstatus')) {
      item.sendstatusNumber = item.sendstatus //保留数字

      if (item.sendstatus || item.sendstatus == '0') {
        item.sendstatusNumber = item.sendstatus
        item.sendstatus = getValByGrouid(146, item.sendstatus, groupTypeCode)
      }
    }
    if (showField('hawbsendstatus')) {
      item.hawbsendstatusNumber = item.hawbsendstatus
      item.hawbsendstatus = getValByGrouid(146, item.hawbsendstatus, groupTypeCode) || '--'
    }

    if (showField('docstatus')) {
      item.docstatusNumber = item.docstatus
      item.docstatus = {
        1: '已上传',
        5: '已预发送'
      } [item.docstatus] || '--'
    }

    if (showField('rejectarea')) {
      if (item.rejectarea || item.rejectarea == '0') {
        item.rejectareaNumber = item.rejectarea
        item.rejectarea = getValByGrouid(141, item.rejectarea, groupTypeCode)
      }
    }
    if (showField('dzmodifystatusdz')) {
      if (item.dzmodifystatusdz || item.dzmodifystatusdz == '0') {
        item.dzmodifystatusdzNumber = item.dzmodifystatusdz
        item.dzmodifystatusdz = getValByGrouid(164, item.dzmodifystatusdz, groupTypeCode)
      }
    }
    if (showField('dzmodifystatusams')) {
      if (item.dzmodifystatusams || item.dzmodifystatusams == '0') {
        item.dzmodifystatusamsNumber = item.dzmodifystatusams
        item.dzmodifystatusams = getValByGrouid(164, item.dzmodifystatusams, groupTypeCode)
      }
    }

    if (showField('truckgid')) {
      if (item.truckgid <= 0) {
        item.truckgid = ''
      } else {
        gysxm.forEach(i => {
          if (i.id == item.truckgid) {
            item.truckgid = i.usr_name
          }
        })
      }
    }


    if (showField('commbillmodifystatus')) {
      if (item.commbillmodifystatus || item.commbillmodifystatus == '0') {
        item.commbillmodifystatusNumber = item.commbillmodifystatus
        item.commbillmodifystatus = getValByGrouid(159, item.commbillmodifystatus, groupTypeCode)
      }
    }


    if (item.customstatus || item.customstatus == '0') {
      item.customstatusNumber = item.customstatus; //保留原值
      item.customstatus = getValByGrouid(148, item.customstatus || 2, groupTypeCode)
    }



    if (showField('hbrq')) {
      item.hbrq = formatDate(item.hbrq, 'yyyy-MM-dd') || '--'
    }
    if (showField('qfsj')) {
      if (item.qfsj && item.qfsj.length > 10) {
        item.qfsj = formatDate(item.qfsj, 'hh:mm') || '--'
      }
    }
    if (showField('begindate')) {
      item.begindate = formatDate(item.begindate, 'yyyy-MM-dd') || '--'
    }
    if (showField('enddate')) {
      item.enddate = formatDate(item.enddate, 'yyyy-MM-dd') || '--'
    }
    if (showField('yqhbrq') || item.yqhbrq) {
      item.yqhbrq = formatDate(item.yqhbrq, 'yyyy-MM-dd')
    }
    if (showField('ddrq') || item.ddrq) {
      item.ddrq = formatDate(item.ddrq, 'yyyy-MM-dd')
    }

    if (showField('orderfinishdate')) {
      item.orderfinishdate = formatDate(item.orderfinishdate, 'yyyy-MM-dd hh:mm')
    }

    if (showField('releasedate')) {
      item.releasedate = formatDate(item.releasedate, 'yyyy-MM-dd hh:mm') || '--'
    }



    if (showField('wagein_pre_date')) {
      item.wagein_pre_date = formatDate(item.wagein_pre_date, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('wagein_pre_accountdate')) {
      item.wagein_pre_accountdate = formatDate(item.wagein_pre_accountdate, 'yyyy-MM-dd hh:mm') || '--'
    }

    if (showField('confirmdate')) {
      item.confirmdate = formatDate(item.confirmdate, 'yyyy-MM-dd hh:mm') || '--'

    }


    if (showField('adddate')) {
      item.adddate = formatDate(item.adddate, 'yyyy-MM-dd') || '--'

    }

    if (showField('jydate')) {
      item.jydate = formatDate(item.jydate, 'yyyy-MM-dd') || '--'
    }

    if (showField('pdfinishdate')) {
      item.pdfinishdate = formatDate(item.pdfinishdate, 'yyyy-MM-dd hh:mm') || '--'

    }

    if (showField('modifydate')) {
      item.modifydate = formatDate(item.modifydate, 'yyyy-MM-dd') || '--'

    }
    if (showField('deliverydate')) {
      item.deliverydate = formatDate(item.deliverydate, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('pickupdate_org')) {
      item.pickupdate_org = formatDate(item.pickupdate_org, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('pickupdate_mdg')) {
      item.pickupdate_mdg = formatDate(item.pickupdate_mdg, 'yyyy-MM-dd hh:mm') || '--'

    }

    if (showField('finishdate_org')) {
      item.finishdate_org = formatDate(item.finishdate_org, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('finishdate_mdg')) {
      item.finishdate_mdg = formatDate(item.finishdate_mdg, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqfinishdate_org')) {
      item.yqfinishdate_org = formatDate(item.yqfinishdate_org, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqfinishdate_mdg')) {
      item.yqfinishdate_mdg = formatDate(item.yqfinishdate_mdg, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yjjcdate_mdg')) {
      item.yjjcdate_mdg = formatDate(item.yjjcdate_mdg, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqdate_deli')) {
      item.yqdate_deli = formatDate(item.yqdate_deli, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqdate_inspect')) {
      item.yqdate_inspect = formatDate(item.yqdate_inspect, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqdate_pack')) {
      item.yqdate_pack = formatDate(item.yqdate_pack, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqdate_chem')) {
      item.yqdate_chem = formatDate(item.yqdate_chem, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('yqdate_safe')) {
      item.yqdate_safe = formatDate(item.yqdate_safe, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('senddate')) {
      item.senddate = formatDate(item.senddate, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('ourconfirmdate')) {
      item.ourconfirmdate = formatDate(item.ourconfirmdate, 'yyyy-MM-dd hh:mm') || '--'

    }
    if (showField('deldate')) {
      item.deldate = formatDate(item.deldate, 'yyyy-MM-dd') || '--'

    }
    if (showField('setshipacedate')) {
      item.setshipacedate = formatDate(item.setshipacedate, 'yyyy-MM-dd') || '--'
    }

    if (showField('signdate')) {
      item.signdate = formatDate(item.signdate, 'yyyy-MM-dd') || '--'
    }

    if (showField('orderconfirmdate')) {
      item.orderconfirmdate = formatDate(item.orderconfirmdate, 'yyyy-MM-dd') || '--'
    }

    if (showField('applysigndate')) {
      item.applysigndate = formatDate(item.applysigndate, 'yyyy-MM-dd') || '--'
    }

    if (showField('safetydate')) {
      item.safetydate = formatDate(item.safetydate, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('trundate')) {
      item.trundate = formatDate(item.trundate, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('djdate')) {
      item.djdate = formatDate(item.djdate, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('bookingdate')) {
      item.bookingdate = formatDate(item.bookingdate, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('deprecatedate')) {
      item.deprecatedate = formatDate(item.deprecatedate, 'yyyy-MM-dd hh:mm') || '--'
    }
    if (showField('ckdate')) {
      item.ckdate = formatDate(item.ckdate, 'yyyy-MM-dd hh:mm') || '--'
    }

    




    if (item.realwageall) {
      item.realwageall = Number(item.realwageall).toFixed(2)
    }
    if (item.billwageall) {
      item.billwageall = Number(item.billwageall).toFixed(2)
    }


    if (item.wageall) {
      item.wageall = Number(item.wageall).toFixed(2)
    }

    if (item.finishwageall_checkbill) {
      item.finishwageall_checkbill = Number(item.finishwageall_checkbill).toFixed(2)
    }

    if (item.finishwageall) {
      item.finishwageall = Number(item.finishwageall).toFixed(2)
    }

    if (item.pzfinishwageall) {
      item.pzfinishwageall = Number(item.pzfinishwageall).toFixed(2)
    }
    if (item.billwageallrmb) {
      item.billwageallrmb = '￥' + Number(item.billwageallrmb).toFixed(2)
    }

    if (item.jfweight || item.jfweight == 0) {
      item.jfweight = Number(item.jfweight).toFixed(1)
    }

    if (item.pzfinishwageallrmb) {
      item.pzfinishwageallrmb = '￥' + Number(item.pzfinishwageallrmb).toFixed(2)
    }

    if (item.billstatus) {
      item.billstatusNumber = item.billstatus
      item.billstatus = item.billstatus == '900' ? '对账中' : '已对账'
    }

    if (item.wageallrmb) {
      item.wageallrmb = '￥' + Number(item.wageallrmb).toFixed(2)
    }

    if (item.finishwageallrmb) {
      item.finishwageallrmb = '￥' + Number(item.finishwageallrmb).toFixed(2)
    }


    if (item.finishwageall_checkbillrmb) {
      item.finishwageall_checkbillrmb = '￥' + Number(item.finishwageall_checkbillrmb).toFixed(2)
    }



    if (showField('ybjzt')) {
      item.ybjzt = (item.ybpiece ? item.ybpiece : "--") + "/" + (item.ybweight ? pointChange(item.ybweight, 2) : "--") + "/" + (item.ybvolume ? pointChange(item.ybvolume, 3) : "--")
    }
    if (showField('signjzt')) {
      item.signjzt = (item.ybpiece ? item.signpiece : "--") + "/" + (item.signweight ? pointChange(item.signweight, 2) : "--") + "/" + (item.signvolume ? pointChange(item.signvolume, 3) : "--")
    }
    if (showField('sjjzt')) {
      item.sjjzt = (item.realpiece ? item.realpiece : '--') + "/" + (item.realweight ? pointChange(item.realweight, 2) : '--') + "/" + (item.realvolume ? pointChange(item.realvolume, 3) : '--')
    }
    if (showField('zdjzt')) {
      item.zdjzt = (item.zdpiece ? item.zdpiece : '--') + "/" + (item.zdweight ? pointChange(item.zdweight, 2) : '--') + "/" + (item.zdvolume ? pointChange(item.zdvolume, 3) : '--')
    }


    if (showField('dzjzt')) {
      item.dzjzt = (item.zdpiece ? item.zdpiece : '--') + "/" + (item.zdweight ? pointChange(item.zdweight, 2) : '--') + "/" + (item.zdvolume ? pointChange(item.zdvolume, 3) : '--')
    }


    if (showField('mawbjzt')) {
      item.mawbjzt = item.mawbzdpiece + '/' + Number(item.mawbzdweight).toFixed(2)
    }

    if (showField('mawbjz')) {
      item.mawbjz = item.zdpiece + '/' + Number(item.zdweight).toFixed(2)
    }

    if (showField('hawbjzt')) {
      item.hawbjzt = item.hawbzdpiece + '/' + Number(item.hawbzdweight).toFixed(2)
    }

    if(showField('hawbjzj')){
      item.hawbjzj = item.hawbpiece + '/' + Number(item.hawbweight).toFixed(2)+'/'+Number(item.hawbjfweight).toFixed(2)
    }

    if(showField('mawbjzj')){
      item.mawbjzj = item.ybpiece + '/' + Number(item.ybweight).toFixed(2)+'/'+Number(item.jfweight).toFixed(2)
    }

    if (showField('trackstatus')) {
      item.trackstatusNumber = item.trackstatus
      let status = ""
      if (item.trackstatus == '1') {
        status = "不可装车"
      } else if (item.trackstatus == '2') {
        status = "可装车"
      } else if (item.trackstatus == '3') {
        status = "已装车"
      }
      item.trackstatus = status
    }




    if (item.profitmode && item.profitmode.indexOf("Co-Load") != '-1') {
      item.profitquota = Number(item.profitprice).toFixed(2) + item.currency
    }

    if (item.profitmode && item.profitmode.indexOf('利润') != '-1') {
      if (item.pono.indexOf('-') >= 0) {
        item.profitquota = Number(item.cus_profitvalue).toFixed(0) + "(" + item.pono.split('-')[0].substr(-3) + ')/' + Number(item.self_profitvalue).toFixed(0) + "(" + item.pono.split('-')[1] + ")"
      } else if (item.pono.indexOf('(') >= 0) {
        item.profitquota = Number(item.self_profitvalue).toFixed(0) + "(" + item.pono.split('(')[0].substr(-3) + ')/' + Number(item.cus_profitvalue).toFixed(0) + "(" + item.pono.split('(')[1].substr(0, 3) + ")"
      } else {
        item.profitquota = Number(item.self_profitvalue).toFixed(0) + '/' + Number(item.cus_profitvalue).toFixed(0)
      }

    }

    if (item.currency) {
      var currency = ""
      for (let m in currencyData) {
        if (currencyData[m].cname == item.currency) {
          currency = currencyData[m].fcode
        }
      }
      item.currency = currency ? currency : item.currency
    }
    //console.log(currentRoute)
    if ((item.status || item.status == '0')&&currentRoute!='mawbManageNew') {
      item.statusNumber = item.status
      var status = statusData.filter(i=>i.dom=='订单状态'&&item.status==i.nodeindex)[0]['nodename']

      // for (let m in statusData) {
      //   if (statusData[m].dom == "订单状态" && system == statusData[m].system) {
      //     if (item.status == statusData[m].nodeindex) {
      //       status = statusData[m].nodename
      //     } else if (item.status == 0 || item.status == -1) {
      //       status = '--'
      //     }

      //   }
      // }
      item.status = status?status:'--'
    }

    // if (item.trackstatus || item.trackstatus=='0') {
    //   var status = ""
    //   if(item.status=='1'){
    //     status="无"
    //   }else if(item.status=='2'){
    //     status="可装车"
    //   }else if(item.status=='3'){
    //     status="已装车"
    //   }
    //   item.status = status
    // }

    if (item.pcstatus || item.pcstatus == '0') {
      item.pcstatusNumber = item.pcstatus
      var pcstatus = ""
      for (let m in statusData) {
        if (statusData[m].dom == "配舱状态" && system == statusData[m].system) {
          if (item.pcstatus == statusData[m].nodeindex) {
            pcstatus = statusData[m].nodename
          } else if (item.pcstatus == 0 || item.pcstatus == -1) {
            pcstatus = '--'
          }

        }
      }
      item.pcstatus = pcstatus
    }

    if (item.dzstatus || item.dzstatus == 0) {
      item.dzstatusNumber = item.dzstatus
      var dzstatus = ""
      for (let m in statusData) {
        if (statusData[m].dom == "单证状态" && system == statusData[m].system) {
          if (item.dzstatus == statusData[m].nodeindex) {
            dzstatus = statusData[m].nodename
          } else if (item.dzstatus == 0 || item.dzstatus == -1) {
            dzstatus = '--'
          }

        }
      }
      item.dzstatus = dzstatus
    }

    if (item.hwstatus || item.hwstatus == 0) {
      item.hwstatusNumber = item.hwstatus
      var hwstatus = ""
      for (let m in statusData) {
        if (statusData[m].dom == "货物状态" && system == statusData[m].system) {
          // if (item.hwstatus == statusData[m].nodeindex) {
          //   hwstatus = statusData[m].nodename
          // } else if (item.hwstatus == 0) {
          //   hwstatus = '--'
          // } else if (item.hwstatus == -1) {
          //   hwstatus = '自送外场'
          // } else if (item.hwstatus == 290) {
          //   hwstatus = '货未到'
          // }
          if (item.hwstatus < 200) {
            hwstatus = '未配货'
          } else {
            if (item.hwstatus == statusData[m].nodeindex) {
              hwstatus = statusData[m].nodename
            }
          }

        }
      }
      item.hwstatus = hwstatus
    }

    if (item.bgstatus || item.bgstatus == '0') {
      item.bgstatusNumber = item.bgstatus
      var bgstatus = ""
      for (let m in statusData) {
        if (statusData[m].dom == "报关状态" && system == statusData[m].system) {
          if (item.bgstatus == statusData[m].nodeindex) {
            bgstatus = statusData[m].nodename
          } else if (item.bgstatus == 0) {
            bgstatus = '--'
          } else if (item.bgstatus == -1) {
            bgstatus = '客户自报'
          }

        }
      }
      item.bgstatus = bgstatus
    }

    if (setdisablefunc) {
      setdisablefunc(item)
    }
  }
  console.timeEnd("gettime")
  return newdata
}

const getValByGrouid = function (groupid, val, groupTypeCode) { //匹配groupid的值
  if (val === undefined || val === null) return '';
  var groupType = (groupTypeCode || JSON.parse(localStorage.groupTypeCode))[groupid]
  var data = ''
  groupType.forEach(item => {
    if (item.ready01 == val) {
      data = item.typename
    }
  })
  return data
}

const getValByStatus = function (status, val) {
  var statusData = JSON.parse(localStorage.statusData)
  var returnstatus = ""
  for (let m in statusData) {
    if (statusData[m].dom == status && statusData[m].system == '空出') {
      if (val == statusData[m].nodeindex) {
        returnstatus = statusData[m].nodename
      } else if (val == 0) {
        returnstatus = '--'
      } else if (val == -1) {
        returnstatus = '自送外场'
      }

    }
  }
  return returnstatus


}

const getWtkhname = function (fid) {
  let wt = getxmdata("wtkh");
  let name = "";
  for (let n in wt) {
    let i = wt[n];
    if (i.id == fid) {
      name = i.usr_name;
    }
  }
  return name
}

const getGysname = function (fid) {
  let wt = getxmdata("gysxm");
  let name = "";
  for (let n in wt) {
    let i = wt[n];
    if (i.id == fid) {
      name = i.usr_name;
    }
  }
  return name.split('-')[1]
}

const getWtxmname = function (gid, index = 0, ifsplit = true) {
  let wt = getxmdata("wtxm");
  let name = "";
  for (let n in wt) {
    let i = wt[n];
    if (i.id == gid) {
      name = i.usr_name;
    }
  }
  //console.log(name)
  return (name && ifsplit) ? name.split('-')[index] : name;
}

const configData = function (type) {
  let data = {
    OA0010: {
      title: '配舱服务', //服务列表显示标题
      label: '配舱操作', //tab窗口显示标题
      wagedom: '配舱服务', //服务费用的wagedom
      itemsname: '配舱服务' //服务费用的items
    },
    AA0410: {
      title: '入唯凯仓', //服务列表显示标题
      label: '仓库服务', //tab窗口显示标题
      wagedom: '仓库', //服务费用的wagedom
      itemsname: '仓储费' //服务费用的items
    },
    AG0145: {
      title: '入唯凯仓', //服务列表显示标题
      label: '仓库服务', //tab窗口显示标题
      wagedom: '仓库', //服务费用的wagedom
      itemsname: '仓储费' //服务费用的items
    },
    AA0510: {
      title: '唯凯提货',
      label: '提货服务',
      wagedom: '提货',
      itemsname: '卡车费'
    },
    AA0610: {
      title: '唯凯报关',
      label: '报关服务',
      wagedom: '报关',
      itemsname: '报关费'
    },
    AG0150: {
      title: '唯凯报关',
      label: '报关服务',
      wagedom: '报关',
      itemsname: '报关费'
    },
    AA0110: {
      title: '唯凯制作总单',
      label: '总单制作',
      wagedom: '总单制作',
      itemsname: '总单制作'
    },
    AA0120: {
      title: '唯凯制作分单',
      label: '分单制作',
      wagedom: '分单制作',
      itemsname: '分单制作'
    },
    AA0130: {
      title: '唯凯制作Manifest',
      label: 'Manifest制作',
      wagedom: 'Manifest制作',
      itemsname: 'Manifest制作'
    },
    AA0310: {
      title: '唯凯制作总标签',
      label: '总单标签',
      wagedom: '总单标签',
      itemsname: '总单标签'
    },
    AA0320: {
      title: '唯凯制作分标签',
      label: '分单标签',
      wagedom: '分单标签',
      itemsname: '分单标签'
    },
    AA0230: {
      title: '唯凯安检',
      label: '唯凯安检',
      wagedom: '安检',
      itemsname: '安检费'
    },
    AA0240: {
      title: '打板服务',
      label: '打板服务',
      wagedom: '打板',
      itemsname: '打板费'
    },
    AG0110: {
      title: '快递服务',
      label: '快递服务',
      wagedom: '快递',
      itemsname: '快递费'
    },
    AG0115: {
      title: '磁检服务',
      label: '磁检服务',
      wagedom: '磁检',
      itemsname: '磁检费'
    },
    AG0120: {
      title: '改包装服务',
      label: '改包装服务',
      wagedom: '改包装',
      itemsname: '改包装费'
    },
    AG0125: {
      title: '化工鉴定',
      label: '化工鉴定',
      wagedom: '化工鉴定',
      itemsname: '化工鉴定'
    },
    AG0130: {
      title: '挂衣服务',
      label: '挂衣服务',
      wagedom: '挂衣',
      itemsname: '挂衣费'
    },
    AG0135: {
      title: '贴签服务',
      label: '贴签服务',
      wagedom: '贴签服务',
      itemsname: '贴签服务'
    },
    AB0420: {
      title: '送唯凯仓',
      label: '送唯凯仓',
      wagedom: '送唯凯仓',
      itemsname: '送唯凯仓'
    },
    AB0520: {
      title: '唯凯送货',
      label: '唯凯送货',
      wagedom: '唯凯送货',
      itemsname: '送货费'
    },
    AB0620: {
      title: '唯凯清关',
      label: '唯凯清关',
      wagedom: '唯凯清关',
      itemsname: '清关费'
    },
    AA0810: {
      title: '材料提供服务',
      label: '材料提供服务',
      wagedom: '材料提供',
      itemsname: '材料提供费'
    },
    AA0830: {
      title: '特种铲车服务',
      label: '特种铲车服务',
      wagedom: '特种铲车',
      itemsname: '特种铲车费'
    },
    AA0840: {
      title: '分货服务',
      label: '分货服务',
      wagedom: '分货',
      itemsname: '分货费'
    },
    AA0850: {
      title: '装卸服务',
      label: '装卸服务',
      wagedom: '装卸',
      itemsname: '装卸费'
    },
    AG0138:{
      title: '标签重制',
      label: '标签重制',
      wagedom: '标签重制',
      itemsname: '标签重制费'
    }

  }
  if (type == 1) {

    return data

  } else if (type == 2) {
    data.OA0010 = {
      title: '订舱服务',
      label: '订舱服务',
      wagedom: '订舱',
      itemsname: '订舱费'
    }
    return data

  } else {
    return ''
  }

}

/**
 * 根据所属系统获取对应需要显示的操作类型选项
 * 所有出口系统返回 => ['自货','代操作']
 * 其他系统返回同名的操作类型
 * @param {Array} systems
 * @returns {Array} - 操作类型
 */
function getCzlxOptionBySystem(systems) {
  let outSystem = ['空出', '海出', '陆出', '铁出']

  let result = new Set()
  systems.forEach(system => {
    if (outSystem.includes(system)) {
      result.add('自货')
      result.add('代操作')
    } else {
      result.add(system)
    }
  })

  return [...result]
}

/**
 * 退出登录
 */
function Logout() {
  localStorage.clear()
  sessionStorage.clear()

  // alert(window.opener && window.opener.name)
  if (window.opener && window.opener.name == 'login') {
    //  window.opener.close() //关闭登录窗口

    if (window.opener.closedialog) {
      window.opener.closedialog()
      window.opener.location.reload(true);
    } else {
      window.opener.close()
      window.location.href = window.location.origin + `/BoManagement/index.html?r=${new Date().getTime()}/#/login`
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      // 生产模式时没有登录直接跳转到Bo登录页面
      window.location.href = window.location.origin + `/BoManagement/index.html?r=${new Date().getTime()}/#/login`
      // window.open(window.location.origin + `/BoManagement/index.html?r=${new Date().getTime()}/#/login`, "_blank")
    } else {
      // 跳转到本地Bo
      window.location.href = window.location.origin
      // window.open(window.location.origin, "_blank")
    }
  }


}

function setHtmlHead(iswecan) {
  if (iswecan) {
    document.title = ("唯凯信息管理系统" + (window.location.host.includes('192.168.0.113') ? '--测试' : ''))
    $('head').append('<link rel="SHORTCUT ICON" href="./boStatic/images/favicon_wecan.ico">')
  } else {
    document.title = "恒丰信息管理系统"
    $('head').append('<link rel="SHORTCUT ICON" href="./boStatic/images/favicon_hengfeng.ico">')
  }
}

function getCharCol(n) {
  if (n == 0) return 'A'
  let temCol = '',
    s = '',
    m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}

function getLastDay(year, month) {
  var new_year = year; //取当前的年份
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) //如果当前大于12月，则年份转到下一年
  {
    new_month -= 12; //月份减
    new_year++; //年份增
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
}

function setTabTitleStyle(list, checkedIndex, color = 'rgb(15, 90, 140)', gradual = false) {
  let arr = []
  let c = color.replace(/[rgb|(|)]/ig, '')
  if (list && list.length) {
    let maxtitlelength = Math.max(...list.map(i => i.title&&i.title.length||0));
    let minwidth='180px';
    if(maxtitlelength>16){
      minwidth = maxtitlelength*10+6+'px'
    }
    list.forEach((i, k) => {
     
      if (checkedIndex == k) {
        arr.push({
          background: color,
          color: '#fff',
          margin: '1px 2px',
          height: '40px',
          minWidth: minwidth
        })
      } else {
        arr.push({
          background: gradual ? `rgba(${c},${1 / (list.length + 1) * (k + 1)})` : `rgba(${c},0.4)`,
          color: '#fff',
          minWidth: minwidth
        })
      }
    })
  }
  return arr
}

const JudgeBubblesFunc = function (weight, volume) {
  //console.log(weight,volume)//返回>0重货，<0泡货
  return Number(weight).toFixed(0) - Number(volume / 0.006).toFixed(0)
}

function moneyFormat(number, fixed = 2) { //货币数值格式化
  let str = number.toFixed(fixed)
  // 保存小数点后的数字
  let dotSuffix = str.split('.')[1]

  str = str.split('.')[0] + ','

  let re = /(\d)(\d{3},)/
  while (re.test(str)) {
    str = str.replace(re, '$1,$2')
  }
  str = str.replace(/,$/, '')

  if (fixed === 0) {
    return str
  } else {
    return str + '.' + dotSuffix
  }
}

function isNumber(val){//是否是包含0的自然数
   return val||val===0||val==="0"
}

    //浮点数   
function StringNum(num,fixed){
   var returnNum=num.toLocaleString();               
       returnNum = returnNum.replace(/[,]/g, '');
   return Number(returnNum).toFixed(String(fixed)?fixed:2)
}


export {
  setStorage,
  getStorage,
  clearStorage,
  searCondition,
  reset,
  filterGroupid,
  evaluationModel,
  formatDate,
  dateFormat,
  pointChange,
  revsendPerson,
  otherService,
  getChangeRate,
  getMomentDate,
  convertCurrency,
  getPdf,
  yanzhenzz,
  isNumber,
  computedWeight,
  getChangeValue,
  getEnglishCurrency,
  getEnglishService,
  ceDataChange,
  getValByGrouid,
  configData,
  getCzlxOptionBySystem,
  getValByStatus,
  Logout,
  setHtmlHead,
  getCharCol,
  getWtkhname,
  getWtxmname,
  getLastDay,
  setTabTitleStyle,
  JudgeBubblesFunc,
  getGysname,
  moneyFormat,
  StringNum,
}
