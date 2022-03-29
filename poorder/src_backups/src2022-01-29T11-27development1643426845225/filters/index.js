//时间格式化
  function formatDate(date, format) {
    if (!date || String(date).indexOf('1900') >= 0 || String(date).indexOf('0001') >= 0) {
      return ''
    }else{
      // if (String(date).indexOf('GMT') >= 0) {
      //   return new Date(getNowFormatDate()).Format(format)
      // }else{
      //   return (new Date(date.replace(/-/g, '/'))).Format(format)
      // }
          if (String(date).indexOf('GMT') >= 0) {
            return new Date(getNowFormatDate(date)).Format(format)
          } else if (date.indexOf("T") >= 0) {
            return dateFormat(date, format)
          } else {
            return (new Date(date.replace(/-/g, '/'))).Format(format)
          }
    }

}
  function dateFormat(dateval, format) {
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
// value = value.DateFormat(isDate);
/*  String.prototype.DateFormat = function (format) {
  var date = new Date(Date.parse(this.toString().replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d*[1-9]\d/, "").substr(0, 19)));
  return date.Format(format);
}; */

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

Number.prototype.toFixed=function (d) {
    var s=this+"";
    if(!d)d=0;
    if(s.indexOf(".")==-1)s+=".";
    s+=new Array(d+1).join("0");
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
        var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g);
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

        }if(b)s=s.substr(1);
        return (pm+s).replace(/\.$/,"");
    }return this+"";

}

 function dateFilter(value) {
  if (!value) return ''
  return value.indexOf('1900') !== -1 ? '' : value
}

//将航班日期转为 “24MAY18”这种格式“日期月份年”

 function formatTime(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
 function airdate(value,segmentation='') {
 if(value){
         var arr = (new Date(value.replace(/-/g, '/')) + '').split(' ')
         return arr[2] + segmentation + arr[1].toUpperCase() + segmentation+ arr[3].substr(2, 2)
 }

}

export {
  formatDate, dateFilter, getNowFormatDate, airdate, formatNumber
}
