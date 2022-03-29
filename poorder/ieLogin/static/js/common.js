//时间格式化
 function formatDate(date, format) {


    if (!date || String(date).indexOf('1900') >= 0 || String(date).indexOf('0001') >= 0) {
        return ''
    } else {
        if (String(date).indexOf('GMT') >= 0) {
            return getNowFormatDate()
        } else {
            return (new Date(date)).Format(format)

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
