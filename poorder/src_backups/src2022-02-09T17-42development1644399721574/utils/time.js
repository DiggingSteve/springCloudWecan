var date = new Date();
			
var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)

var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)   


export  var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;