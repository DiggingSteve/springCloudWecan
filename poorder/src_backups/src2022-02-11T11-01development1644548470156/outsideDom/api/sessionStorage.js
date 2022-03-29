import html2Canvas from 'html2canvas'
// import JsPDF from 'jspdf'

//用户名usrname  票据ticket   地区area    基础数据groupType   货币currencyData   服务serviceData



let groupData = JSON.parse(localStorage.getItem('groupType'))

let currency = JSON.parse(localStorage.getItem('currencyData'))


const searCondition = function (condition) {
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

  //let groupData = JSON.parse(sessionStorage.getItem('groupType'))
  //let currencyData=JSON.parse(sessionStorage.getItem('currencyData'))
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
      for (let j in currency) {
        inputData[i].options.push({
          'value': currency[j].cname,
          'label': currency[j].cname
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


  if (!date || String(date).indexOf('1900') >= 0 || String(date).indexOf('0001') >= 0) {
    return ''
  } else {
    if (String(date).indexOf('GMT') >= 0) {
      return new Date(getNowFormatDate()).Format(format)
    } else {
      return (new Date(date.replace(/-/g, '/'))).Format(format)
    }

  }

}

function getNowFormatDate() {
  var date = new Date();
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
  //var currencyData=JSON.parse(sessionStorage.getItem('currencyData'))
  var changerate
  for (var i in currency) {
    if (currency[i].cname == val) {
      changerate = Number(currency[i].basicprice).toFixed(4)
    }
  }
  // //console.log(changerate)
  return changerate
}

//取英文货币
const getEnglishCurrency = function (val) {
  //var currencyData=JSON.parse(sessionStorage.getItem('currencyData'))
  var englishCurrency
  for (var i in currency) {
    if (currency[i].cname == val) {
      englishCurrency = currency[i].fcode
    }
  }
  // //console.log(changerate)
  return englishCurrency
}

//取英文服务项目

const getEnglishService = function (val) {
  var currencyData = JSON.parse(sessionStorage.getItem('out_fwxm'))
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

function computedWeight(volume, weight) {

  var jfweight = 0
  if (weight && volume) {
    jfweight = (volume / 0.006 > weight) ? volume / 0.006 : weight

  }
  var wc = jfweight - parseInt(jfweight)
  if (wc == 0 || wc == 0.5) {
    jfweight = jfweight
  } else {
    jfweight = wc > 0.5 ? (parseInt(jfweight) + 1) : parseInt(jfweight) + 0.5
  }
  return !jfweight ? 0 : Number(jfweight).toFixed(2)

}

//let currencyData=JSON.parse(sessionStorage.getItem('currencyData'))
//let groupData = JSON.parse(sessionStorage.getItem("groupType"));

//处理查询数据
const getChangeValue = function (data, system, language, field) {


  groupData = groupData && groupData.length > 0 ? groupData : (sessionStorage.out_groupType ? JSON.parse(sessionStorage.out_groupType) : store.state.groupData)

  var newdata = data
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
    '港币': '$',
    '日元': '￥',
    '欧元': '€',
    '英镑': '£'
  }

  setTimeout(() => {
    // newdata.forEach((item2,index2)=>{
    //  field.forEach((item,index)=>{

    //      if(item=='commitstatus'){
    //       item2['commitstatus']=item2['commitstatus']=='100'?'申请中':item2['commitstatus']=='200'?'已驳回':item2['commitstatus']=='500'?'已通过':''
    //     }else if(item=='inwageallinprice'){
    //       item2['inwageallinprice'] = item2['inwageallinprice'] == 666666 ? '0.00' : item2['inwageallinprice']
    //     }else if(item=='outwageallinprice'){
    //       item2['outwageallinprice'] = item2['outwageallinprice'] == 666666 ? '--' : item2['outwageallinprice']
    //     }else if(item=='inwageallinprice_trans'){
    //       item2['outwageallinprice_trans'] = item2['outwageallinprice_trans'] == 666666 ? '--' : item2['outwageallinprice_trans']
    //     }else if(item=='fpbl_in'){
    //      item2['fpbl_in']= `${item2['self_real_bp_freight_in']}(w)/${item2['cus_real_bp_freight_in']}(k)`
    //     }else if(item=='fpbl_out'){
    //      item2['fpbl_out']= `${item2['self_real_bp_freight_out']}(w)/${item2['cus_real_bp_freight_out']}(k)`
    //    }else if(item=='freightfee_in'){
    //      item2['freightfee_in']=  (currencyChars[item2['currencyin']] || '') + Number(item2['inwageallinprice']).toFixed(2)
    //    }else if(item=='freightfee_out'){
    //      item2['freightfee_in']=  (currencyChars[item2['currencyout']] || '') + Number(item2['outwageallinprice']).toFixed(2)
    //    }else if(item=='isinwageallin'){
    //       item2['isinwageallin']=  isinwagealltext[item2['isinwageallin']] || '--'
    //     }else if(item=='isoutwageallin'){
    //      item2['isoutwageallin']=  isinwagealltext[item2['isoutwageallin']] || '--'
    //    }else if(item=='hbrq'){
    //        if(item2['hbrq']&&item2['hbrq'].indexOf('1900')==-1&&item2['hbrq'].indexOf('0001')==-1){
    //          item2['hbrq'] = formatDate(item2['hbrq'], 'yyyy-MM-dd')
    //        }else{
    //          item2['hbrq']='--'
    //        }
    //    }else if(item=='qfsj'){
    //       if (item2['qfsj'] && item2['qfsj'].indexOf('1900') == -1 && item2['qfsj'].indexOf('0001') == -1) {
    //          if(item2['qfsj'].length>10){
    //            item2['qfsj'] = formatDate(item2['qfsj'], 'hh:mm')
    //          }
    //          else {
    //          item2['qfsj'] = '--'
    //          }
    //       }
    //    }else if(item=='yqhbrq'){
    //         if(item2['yqhbrq']&&item2['yqhbrq'].indexOf('1900')==-1&&item2['yqhbrq'].indexOf('0001')==-1){
    //            item2['yqhbrq'] = formatDate(item2['yqhbrq'], 'yyyy-MM-dd')
    //        }else{
    //            item2['yqhbrq']='--'
    //        }
    //    }else if(item=='confirmdate'){
    //         if(item2['confirmdate']&&item2['confirmdate'].indexOf('1900')==-1&&item2['confirmdate'].indexOf('0001')==-1){
    //           item2['confirmdate'] = formatDate(item2['confirmdate'], 'yyyy-MM-dd hh:mm')
    //        }else{
    //           item2['confirmdate']='--'
    //         }
    //    }else if(item=='adddate'){
    //       if(item2['adddate']&&item2['adddate'].indexOf('1900')==-1&&item2['adddate'].indexOf('0001')==-1){
    //            item2['adddate'] = formatDate(item2['adddate'], 'yyyy-MM-dd')
    //        }else{
    //            item2['adddate']='--'
    //        }
    //    }else if(item=='modifydate'){
    //        if(item2['modifydate']&&item2['modifydate'].indexOf('1900')==-1&&item2['modifydate'].indexOf('0001')==-1){
    //            item2['modifydate'] = formatDate(item2['modifydate'], 'yyyy-MM-dd')
    //        }else{
    //            item2['modifydate']='--'
    //        }
    //    }else if(item=='deliverydate'){
    //       if(item2['deliverydate']&&item2['deliverydate'].indexOf('1900')==-1&&item2['deliverydate'].indexOf('0001')==-1){
    //           item2['deliverydate'] = formatDate(item2['deliverydate'], 'yyyy-MM-dd hh:mm')
    //        }else{
    //           item2['deliverydate']='--'
    //         }
    //    }else if(item=='sjqcts'){
    //        item2['sjqcts']= item2['sjqcts']|| 0
    //    }else if(item=='qcts'){
    //        item2['qcts']= item2['qcts']|| 0
    //    }else if(item=='modifyman'){
    //        item2['modifyman']= item2['modifyman']|| '--'
    //    }else if(item=='chinesepm'){
    //      item2['chinesepm']= item2['chinesepm']|| '--'
    //    }else if(item=='batterymodel'){
    //      item2['batterymodel']= item2['batterymodel']|| '--'
    //    }else if(item=='orderno'){
    //      item2['orderno']= item2['orderno']|| '--'
    //    }else if(item=='accountweightin'){
    //      item2['accountweightin']= item2['accountweightin'] ? Number(item2['accountweightin']).toFixed(2) : 0
    //    }else if(item=='accountweightout'){
    //      item2['accountweightout']= item2['accountweightout'] ? Number(item2['accountweightout']).toFixed(2) : 0

    //    }else if(item=='ourconfirmdate'){
    //      if(item2['ourconfirmdate']&&item2['ourconfirmdate'].indexOf('1900')==-1&&item2['ourconfirmdate'].indexOf('0001')==-1){
    //         item2['ourconfirmdate'] = formatDate(item2['ourconfirmdate'], 'yyyy-MM-dd hh:mm')
    //       }else{
    //         item2['ourconfirmdate']='--'
    //       }
    //    }else if(item=='deldate'){
    //      if(item2['deldate']&&item2['deldate'].indexOf('1900')==-1&&item2['deldate'].indexOf('0001')==-1){
    //         item2['deldate'] = formatDate(item2['deldate'], 'yyyy-MM-dd')
    //       }else{
    //         item2['deldate']='--'
    //       }
    //    }else if(item=='billstatus'){
    //      item2['billstatus']=item2['billstatus']=='900'?'对账中':'已对账'

    //    }else if(item=='hwxz'){
    //      item2['hwxz']=getLanguage('115',item2['hwxz'],language)
    //    }else if(item=='hwlx'){
    //      item2['hwlx']=getLanguage('109',item2['hwlx'],language)
    //    }else if(item=='accountweightin'){
    //      item2['accountweightin']=item2['accountweightin']?pointChange(item2['accountweightin'],2):"--"
    //    }else if(item=='ybjzt'){
    //      item2['ybjzt']=(item2['ybpiece']?item2['ybpiece']:"--")+"/"+(item2['ybweight']?pointChange(item2['ybweight'],2):"--")+"/"+(item2['ybvolume']?pointChange(item2['ybvolume'],3):"--")
    //    }else if(item=='realjzt'){
    //      item2['realjzt']=(item2['realpiece']?item2['realpiece']:"--")+"/"+(item2['realweight']?pointChange(item2['realweight'],2):"--")+"/"+(item2['realvolume']?pointChange(item2['realvolume'],3):"--")
    //    }else if(item=='zdjzt'){
    //      item2['zdjzt']=(item2['zdpiece']?item2['zdpiece']:"--")+"/"+(item2['zdweight']?pointChange(item2['zdweight'],2):"--")+"/"+(item2['zdvolume']?pointChange(item2['zdvolume'],3):"--")
    //    }else if(item=='ports'){

    //      item2['ports']=(item2['sfg']?item2['sfg']:'--')+"/"+(item2['mdg']?item2['mdg']:'--')
    //    }else if(item=='areadom'){
    //      item2['areadom']=item2['orginarea']+item2['orgindom']
    //    }else if(item=='abnormity'){
    //      item2['abnormity']='破损'+item2['breakpiece']+',潮湿'+item2['moistpiece']+',变形'+item2['deformpiece']
    //    }else if(item=='fpbl_in'){
    //      item2['fpbl_in']=item2['czlx']=='代操作'?'--/--':item2['czlx']=='自货'?item2['fpbl_in']:''
    //    }     
    //  })
    //    })

    newdata.forEach((item, index) => {

      if (item.commitstatus) {
        item.commitstatus = item.commitstatus == '100' ? '申请中' : item.commitstatus == '200' ? '已驳回' : item.commitstatus == '500' ? '已通过' : ''
      }
      item.inwageallinprice = item.inwageallinprice == 666666 ? '0.00' : item.inwageallinprice
      item.outwageallinprice = item.outwageallinprice == 666666 ? '--' : item.outwageallinprice
      item.outwageallinprice_trans = item.outwageallinprice_trans == 666666 ? '--' : item.outwageallinprice_trans
      item.inwageallinprice_trans = item.inwageallinprice_trans == 666666 ? '--' : item.inwageallinprice_trans


      item.fpbl_in = `${item.self_real_bp_freight_in}(w)/${item.cus_real_bp_freight_in}(k)`
      item.fpbl_out = `${item.self_real_bp_freight_out}(w)/${item.cus_real_bp_freight_out}(k)`

      //item.freightfee=

      item.freightfee_in = (currencyChars[item.currencyin] || '') + Number(item.inwageallinprice).toFixed(2)

      item.freightfee_out = (currencyChars[item.currencyout] || '') + Number(item.outwageallinprice).toFixed(2)

      if (item.isinwageallin) {
        item.isinwageallin = isinwagealltext[item.isinwageallin] || '--'
      }

      if (item.isoutwageallin) {
        item.isoutwageallin = isinwagealltext[item.isoutwageallin] || '--'
      }

      if (item.hbrq && item.hbrq.indexOf('1900') == -1 && item.hbrq.indexOf('0001') == -1) {
        item.hbrq = formatDate(item.hbrq, 'yyyy-MM-dd')

      } else {
        item.hbrq = '--'
      }

      if (item.qfsj && item.qfsj.indexOf('1900') == -1 && item.qfsj.indexOf('0001') == -1) {
        if (item.qfsj.length > 10) {
          item.qfsj = formatDate(item.qfsj, 'hh:mm')
        }

      } else {
        item.qfsj = '--'
      }


      if (item.yqhbrq && item.yqhbrq.indexOf('1900') == -1 && item.yqhbrq.indexOf('0001') == -1) {
        item.yqhbrq = formatDate(item.yqhbrq, 'yyyy-MM-dd')

      } else {
        item.yqhbrq = '--'
      }


      if (item.confirmdate && item.confirmdate.indexOf('1900') == -1 && item.confirmdate.indexOf('0001') == -1) {
        item.confirmdate = formatDate(item.confirmdate, 'yyyy-MM-dd hh:mm')

      } else {
        item.confirmdate = '--'
      }

      if (item.adddate && item.adddate.indexOf('1900') == -1 && item.adddate.indexOf('0001') == -1) {
        item.adddate = formatDate(item.adddate, 'yyyy-MM-dd')

      } else {
        item.adddate = '--'
      }

      if (item.modifydate && item.modifydate.indexOf('1900') == -1 && item.modifydate.indexOf('0001') == -1) {
        item.modifydate = formatDate(item.modifydate, 'yyyy-MM-dd')

      } else {
        item.modifydate = '--'
      }


      if (item.deliverydate && item.deliverydate.indexOf('1900') == -1 && item.deliverydate.indexOf('0001') == -1) {
        item.deliverydate = formatDate(item.deliverydate, 'yyyy-MM-dd hh:mm')

      } else {
        item.deliverydate = '--'
      }


      item.sjqcts = item.sjqcts || 0
      item.qcts = item.qcts || 0
      item.modifyman = item.modifyman || '--'
      item.chinesepm = item.chinesepm || '--'
      item.batterymodel = item.batterymodel || '--'
      item.orderno = item.orderno || '--'
      //  item.accountweightin = item.accountweightin ? Number(item.accountweightin).toFixed(2) : 0
      //  item.accountweightout = item.accountweightout ? Number(item.accountweightout).toFixed(2) : 0


      if (item.ourconfirmdate && item.ourconfirmdate.indexOf('1900') == -1 && item.ourconfirmdate.indexOf('0001') == -1) {
        item.ourconfirmdate = formatDate(item.ourconfirmdate, 'yyyy-MM-dd hh:mm')


      } else {
        item.ourconfirmdate = '--'
      }

      if (item.deldate && item.deldate.indexOf('1900') == -1 && item.deldate.indexOf('0001') == -1) {
        item.deldate = formatDate(item.deldate, 'yyyy-MM-dd')


      } else {
        item.deldate = '--'
      }


      if (item.billstatus) {
        item.billstatus = item.billstatus == '900' ? '对账中' : '已对账'

      }



      if (item.realwageall) {
        item.realwageall = Number(item.realwageall).toFixed(2)
      } else {
        item.realwageall = '--'
      }
      item.billwageall = Number(item.billwageall).toFixed(2)
      // if(item.billwageall){
      //   item.billwageall=Number(item.billwageall).toFixed(2)
      // }else{
      //   item.billwageall="--"
      // }
      //item.wageall=item.wageall?Number(item.wageall).toFixed(2):''
      if (item.wageall) {
        item.wageall = Number(item.wageall).toFixed(2)
      } else {
        item.wageall = "--"
      }

      if (item.finishwageall_checkbill) {
        item.finishwageall_checkbill = Number(item.finishwageall_checkbill).toFixed(2)
      } else {
        item.finishwageall_checkbill = "--"
      }

      if (item.finishwageall) {
        item.finishwageall = Number(item.finishwageall).toFixed(2)
      } else {
        item.finishwageall = "--"
      }

      if (item.realwageallrmb) {
        //item.realwageallrmb='￥'+Number(item.realwageallrmb).toFixed(2)
        item.realwageallrmb = Number(item.realwageallrmb).toFixed(2)
      } else {
        item.realwageallrmb = "--"
      }

      if (item.pzfinishwageall) {
        item.pzfinishwageall = Number(item.pzfinishwageall).toFixed(2)
      } else {
        item.pzfinishwageall = "--"
      }
      item.billwageallrmb = '￥' + Number(item.billwageallrmb).toFixed(2)


      if (item.pzfinishwageallrmb) {
        item.pzfinishwageallrmb = '￥' + Number(item.pzfinishwageallrmb).toFixed(2)
      } else {
        item.pzfinishwageallrmb = "--"
      }

      if (item.wageallrmb) {

        item.wageallrmb = Number(item.wageallrmb).toFixed(2)
      } else {
        item.wageallrmb = "--"
      }

      if (item.finishwageallrmb) {
        item.finishwageallrmb = '￥' + Number(item.finishwageallrmb).toFixed(2)
      } else {
        item.finishwageallrmb = "--"
      }


      if (item.finishwageall_checkbillrmb) {
        item.finishwageall_checkbillrmb = '￥' + Number(item.finishwageall_checkbillrmb).toFixed(2)
      } else {
        item.finishwageall_checkbillrmb = "--"
      }

      if (item.thisfinishwageall_checkbillrmb) {
        item.thisfinishwageall_checkbillrmb = '￥' + Number(item.thisfinishwageall_checkbillrmb).toFixed(2)
      } else {
        item.thisfinishwageall_checkbillrmb = "--"
      }



      item.hwxz = getLanguage('115', item.hwxz, language)
      item.hwlx = getLanguage('109', item.hwlx, language, '1')

      item.accountweightin = item.accountweightin ? pointChange(item.accountweightin, 2) : "--"
      item.ybjzt = (item.ybpiece ? item.ybpiece : "--") + "/" + (item.ybweight ? pointChange(item.ybweight, 2) : "--") + "/" + (item.ybvolume ? pointChange(item.ybvolume, 3) : "--")
      item.realjzt = (item.realpiece ? item.realpiece : '--') + "/" + (item.realweight ? pointChange(item.realweight, 2) : '--') + "/" + (item.realvolume ? pointChange(item.realvolume, 3) : '--')
      item.zdjzt = (item.zdpiece ? item.zdpiece : '--') + "/" + (item.zdweight ? pointChange(item.zdweight, 2) : '--') + "/" + (item.zdvolume ? pointChange(item.zdvolume, 3) : '--')
      item.alljzt = (item.piece ? item.piece : '--') + "/" + (item.weight ? pointChange(item.weight, 2) : '未称重') + "/" + (item.volume ? item.volume : '--')
      item.piece = item.piece ? item.piece : '--'
      item.weight = item.weight ? pointChange(item.weight, 2) : '--'
      item.volume = item.volume ? pointChange(item.volume, 3) : '--'
      item.ports = (item.sfg ? item.sfg : '--') + "/" + (item.mdg ? item.mdg : '--')
      item.areadom = item.orginarea + item.orgindom


      item.abnormity = '破损' + item.breakpiece + ',潮湿' + item.moistpiece + ',变形' + item.deformpiece
      item.fpbl_in = item.czlx == '代操作' ? '--/--' : item.czlx == '自货' ? item.fpbl_in : ''


      item.czlx = item.czlx && (item.czlx == '自货' ? '唯凯配舱' : '唯凯代操作')
      item.islocal = item.islocal && (item.islocal == '1' ? '是' : '否')
      item.profitmode = item.profitmode || '本站'



      if (item.currency) {
        var currency = ""
        for (let m in currency) {
          if (currency[m].cname == item.currency) {
            currency = currency[m].fcode
          }
        }
        item.currency = currency ? currency : item.currency
      }

      if (item.profitmode && item.profitmode.indexOf("Co-Load") != '-1') {
        item.profitquota = Number(item.profitprice).toFixed(2) + item.currency
      }

      if (item.profitmode && item.profitmode.indexOf('利润') != '-1') {
        if (item.pono.indexOf('-') >= 0) {
          item.profitquota = Number(item.self_profitvalue).toFixed(0) + "(" + item.pono.split('-')[0].substr(-3) + ')/' + Number(item.cus_profitvalue).toFixed(0) + "(" + item.pono.split('-')[1] + ")"
        } else if (item.pono.indexOf('(') >= 0) {
          item.profitquota = Number(item.self_profitvalue).toFixed(0) + "(" + item.pono.split('(')[0].substr(-3) + ')/' + Number(item.cus_profitvalue).toFixed(0) + "(" + item.pono.split('(')[1].substr(0, 3) + ")"
        } else {
          item.profitquota = Number(item.self_profitvalue).toFixed(0) + '/' + Number(item.cus_profitvalue).toFixed(0)
        }

      }

      if (String(item.statusBk).length) {
        var status = ''

        for (let j in groupData) {
          if (groupData[j].groupid == '144') {
            if (item.statusBk == groupData[j].ready01) {
              status = language == 'Chinese' || !language ? groupData[j].typename : groupData[j].entypename
            }
          }
        }
        item.status = status
      }

      if (String(item.statusHwBk).length) {

        var status = ''

        for (let j in groupData) {
          if (groupData[j].groupid == '145') {
            if (item.statusHwBk == groupData[j].ready01) {
              status = language == 'Chinese' || !language ? groupData[j].typename : groupData[j].entypename
            }
          }
        }
        item.hwstatus = status
      }

      if (item.cancelreason) {
        if (item.cancelreason[0] == '[') {
          var data = []
          JSON.parse(item.cancelreason).forEach(item => {
            data.push(item.canceltype)
          })
          item.cancelreason = data.join(',')
        } else {
          item.cancelreason = item.cancelreason
        }

      }


      if (String(item.creditisbackstatus).length) {
        if (item.creditisbackstatus == 3) {
          item.creditisbackstatus = '已通过'
        } else if (item.creditisbackstatus == 4) {
          item.creditisbackstatus = '待通过'
        } else if (item.creditisbackstatus == 5) {
          item.creditisbackstatus = '已驳回'
        } else if (item.creditisbackstatus == 6) {
          item.creditisbackstatus = '无异常'
        } else if (item.creditisbackstatus == 5) {
          item.creditisbackstatus = '已驳回'
        }
      }

      if (item.wageList && item.wageList.length > 0) {
        item.wageList.forEach(item2 => {
          item2.hbrq = item2.hbrq.substring(0, 10)

          item2.price = Number(item2.price).toFixed(2)
          if (item2.realwageall) {
            item2.realwageall = Number(item2.realwageall).toFixed(2)
          } else {
            item2.realwageall = '--'
          }

          if (item2.realwageallrmb) {
            item2.realwageallrmb = '￥' + Number(item2.realwageallrmb).toFixed(2)
          } else {
            item2.realwageallrmb = "--"
          }

          if (item2.wageall) {
            item2.wageall = Number(item2.wageall).toFixed(2)
          } else {
            item2.wageall = "--"
          }

          if (item2.wageallrmb) {
            item2.wageallrmb = Number(item2.wageallrmb).toFixed(2)
          } else {
            item2.wageallrmb = "--"
          }


          if (item2.thisfinishwageall_checkbill) {
            item2.thisfinishwageall_checkbill = Number(item2.thisfinishwageall_checkbill).toFixed(2)
          } else {
            item2.thisfinishwageall_checkbill = "--"
          }


          if (item2.thisfinishwageall_checkbillrmb) {
            item2.thisfinishwageall_checkbillrmb = '￥' + Number(item2.thisfinishwageall_checkbillrmb).toFixed(2)
          } else {
            item2.thisfinishwageall_checkbillrmb = "--"
          }
        })
      }


      item.wtkhname = item.wtkhname || '--'
      if (item.area != '市场部' && item.area != '海外部') {
        item.realwtkhname = '--'
      }

    })
  }, 10)
  return newdata
}



const getValByGrouid = function (groupid, val) { //匹配groupid的值
  //var groupType=JSON.parse(sessionStorage.groupType)
  var data = ''
  groupData.forEach(item => {
    if (item.groupid == groupid && item.ready01 == val) {
      data = item.typename
    }
  })
  return data
}


const getLanguage = function (groupid, val, language, mul) { //中英文数据
  var data = ''
  var tmpList = []
  if (val) {
    groupData.forEach(item => {
      if (!mul) {
        if (item.groupid == groupid && item.ready01 == val) {
          data = language == 'Chinese' ? item.typename : item.entypename
        }
      } else {


        val.split(',').forEach(item2 => {
          if (item.groupid == groupid && item.ready01 == item2) {
            //data+=language=='Chinese'?item.typename:item.entypename+','
            tmpList.push(language == 'Chinese' ? item.typename : item.entypename)
          }
        })
        data = tmpList.join(',')
        //console.log(data)
        //console.log(tmpList)
        //data=tmpList.join(',')
      }

    })
    return data
  }

}

function setHtmlHead(iswecan) {
  if (iswecan) {
    document.title = "唯凯信息管理系统"
    $('head').append('<link rel="SHORTCUT ICON" href="./static/images/favicon_wecan.ico">')
  } else {
    document.title = "恒丰信息管理系统"
    $('head').append('<link rel="SHORTCUT ICON" href="./static/images/favicon_hengfeng.ico">')
  }
}
export {
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
  computedWeight,
  getChangeValue,
  getEnglishCurrency,
  getEnglishService,
  ceDataChange,
  getValByGrouid,
  getLanguage,
  setHtmlHead
}
