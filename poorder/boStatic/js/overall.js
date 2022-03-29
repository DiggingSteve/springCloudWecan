function getxmdata(type) {

  let arr = ['xmdata', 'wtxm', 'wtxmNoname', 'gysxm', 'jsxm', 'boardgys', "gysxmUseful", 'wtxmBasic', 'tzjs']
  if (arr.includes(type)) {

    if (!window.xmdata) {
      // console.log("取xmdata数据错误！");
      return;
    }
    let data = JSON.parse(window.xmdata)
    if (type == 'xmdata') {
      return data
    }
    //console.log(data)
    if (type == 'wtxm') {
      return data.filter(i => i.comxz == 1)
    }

    if (type == 'wtxmNoname') {
      return data.filter(i =>
        i.comxz == 1
      ).map(e => {
        e.usr_name = e.usr_name.split("-")[0];
        e.usr_code = e.usr_code.split("-")[1];
        return e;
      })
    }

    if (type == 'gysxm' || type == 'jsxm' || type == 'boardgys') {
      return data.filter(i => i.comxz == 2)
    }
    if (type == 'gysxmUseful') {
      return data.filter(i => i.comxz == 2 && i.usr_status == 1)
    }

    if (type == 'wtxmBasic') {
      return data.filter(i => i.comxz == 1 && i.isbasic == 1)
    }

    if (type == 'tzjs') {
      return data.filter(i => i.isbasic == 1 && i.usr_status_cw == 1)
    }

  }else if(type=='tzxm'){
    if(!window.tzxm){
      return
    }
    let data=JSON.parse(window.tzxm)
     return data.filter(i => i.isbasic == 1 && i.usr_status_cw == 1)
  } else {

    if (!window.wtkhData) {
      // console.log("取wtkhData数据错误！");
      return;
    }
    let data = JSON.parse(window.wtkhData)
    if (type == 'wtkhData') {
      return data
    }
    if (type == 'wtkh') {
      return data.filter(i => i.customxz != 2)
    }

    if (type == 'wtkhUseful') {
      return data.filter(i => i.usr_status == 1 && i.iscommit == 2 && i.customxz != 2)
    }



  }

}

/* (function (global, undefined) {
  global._sessionStorage = {
    prefix : "bo_",
    setItem: function (key, value, cb) {
      value = value || '';
      key = this.prefix+key
      cb = cb || function () {};
      if (Array.isArray(value)) {
        sessionStorage.setItem(`${key}`, `arrya_${JSON.stringify(value)}`);
      }
      if (typeof value === 'object') {
        sessionStorage.setItem(`${key}`, `object_${JSON.stringify(value)}`);
      }
      if (typeof value === 'string') {
        sessionStorage.setItem(`${key}`, `string_${value}`);
      }
      if (typeof value === 'boolean') {
        sessionStorage.setItem(`${key}`, `boolean_${value}`);
      }
      if (typeof value === 'number') {
        sessionStorage.setItem(`${key}`, `number_${value}`);
      }
      cb();
      return value;
    },
    getItem: function (key, cb) {
      value = sessionStorage.getItem(this.prefix + key) || '';
      cb = cb || function () {};
      var type = value.split('_')[0];
      let res = value.match(/_([\s\S]*)/)[1];
      if (type === 'array' || type === 'object') {
        res = JSON.parse(res);
      }
      if (type === 'boolean') {
        res = Boolean(res);
      }
      if (type === 'number') {
        res = Number(res);
      }
      cb(null, res);
      return res;
    },
    removeItem: function (key, cb) {
      cb = cb || function () {};
      sessionStorage.removeItem(this.prefix + key);
      cb();
    },
    clear: function (cb) {
      cb = cb || function () {};
       Object.keys(sessionStorage).forEach(i=>{
         if (i.includes(this.prefix)){
           sessionStorage.removeItem(i)
         }
       })
      cb();
    }
  }
}(window)) */


function getHrefParams(type) { //获取链接参数
  //type 1对象格式 2数组格式 3字符串格式
  type = type || 1;
  let paramsObj = {}
  if (window.location.hash.includes('?')) {
    let arr = window.location.hash.split('?')[1].split('&');
    arr.forEach(i => {
      if (i.split('=').length == 2) {
        paramsObj[i.split('=')[0]] = i.split('=')[1]
      }
    })
    if (type == 2) {
      return arr
    }
    if (type == 3) {
      return window.location.hash.split('?')[1]
    }
    return paramsObj
  }
  return ''
}


(function (global, undefined) {

  global._sessionStorage = {
    prefix: "bo_",
    setItem: function (key, value, cb) {
      value = JSON.stringify(value);
      value = value || '';
      sessionStorage.setItem(this.prefix + key, value);
      _sessionStorage[key] = this.getItem(key);
      cb && cb();
      return value;
    },
    getItem: function (key, cb) {
      value = sessionStorage.getItem(this.prefix + key) || '';
      value = value == '' ? '' : JSON.parse(value);
      cb && cb(null, value);
      return value;
    },
    removeItem: function (key, cb) {
      sessionStorage.removeItem(this.prefix + key);
      cb && cb();
    },
    clear: function (cb) {
      Object.keys(sessionStorage).forEach(i => {
        if (i.includes(this.prefix)) {
          sessionStorage.removeItem(i)
        }
      })
      cb && cb();
    }
  };

  global._localStorage = {
    prefix: "bo_",
    setItem: function (key, value, cb) {
      value = JSON.stringify(value);
      value = value || '';
      localStorage.setItem(this.prefix + key, value);
      _localStorage[key] = this.getItem(key);
      cb && cb();
      return value;
    },
    getItem: function (key, cb) {
      value = localStorage.getItem(this.prefix + key) || '';
      value = value == '' ? '' : JSON.parse(value);
      cb && cb(null, value);
      return value;
    },
    removeItem: function (key, cb) {
      localStorage.removeItem(this.prefix + key);
      cb && cb();
    },
    clear: function (cb) {
      Object.keys(localStorage).forEach(i => {
        if (i.includes(this.prefix)) {
          localStorage.removeItem(i)
        }
      })
      cb && cb();
    }
  }
}(window))





// function deepClone(target) {
//   // 获取数据类型
//   function getType(target) {
//     return Object.prototype.toString.call(target)
//   }
//   //判断数据是不是引用类型
//   function isObject(target) {
//     return target !== null && (typeof target === 'object' || typeof target === 'function');
//   }
//   //处理不需要遍历的应引用类型数据
//   function handleOherData(target) {
//     const type = getType(target);
//     switch (type) {
//       case "[object Date]":
//         return new Date(target)
//       case "[object RegExp]":
//         return cloneReg(target)
//       case "[object Function]":
//         return cloneFunction(target)

//     }
//   }
//   //拷贝Symbol类型数据
//   function cloneSymbol(targe) {
//     const a = String(targe); //把Symbol字符串化
//     const b = a.substring(7, a.length - 1); //取出Symbol()的参数
//     return Symbol(b); //用原先的Symbol()的参数创建一个新的Symbol
//   }
//   //拷贝正则类型数据
//   function cloneReg(target) {
//     const reFlags = /\w*$/;
//     const result = new target.constructor(target.source, reFlags.exec(target));
//     result.lastIndex = target.lastIndex;
//     return result;
//   }
//   //拷贝函数
//   function cloneFunction(targe) {
//     //匹配函数体的正则
//     const bodyReg = /(?<={)(.|\n)+(?=})/m;
//     //匹配函数参数的正则
//     const paramReg = /(?<=\().+(?=\)\s+{)/;
//     const targeString = targe.toString();
//     //利用prototype来区分下箭头函数和普通函数，箭头函数是没有prototype的
//     if (targe.prototype) { //普通函数
//       const param = paramReg.exec(targeString);
//       const body = bodyReg.exec(targeString);
//       if (body) {
//         if (param) {
//           const paramArr = param[0].split(',');
//           //使用 new Function 重新构造一个新的函数
//           return new Function(...paramArr, body[0]);
//         } else {
//           return new Function(body[0]);
//         }
//       } else {
//         return null;
//       }
//     } else { //箭头函数
//       //eval和函数字符串来重新生成一个箭头函数
//       return eval(targeString);
//     }
//   }
//   /**
//    * 遍历数据处理函数
//    * @array 要处理的数据
//    * @callback 回调函数，接收两个参数 value 每一项的值 index 每一项的下标或者key。
//    */
//   function handleWhile(array, callback) {
//     let index = -1;
//     const length = array.length;
//     while (++index < length) {
//       callback(array[index], index);
//     }
//   }

//   function clone(target, map) {
//     if (isObject(target)) {
//       let result = null;
//       if (getType(target) === "[object Array]") {
//         result = []
//       } else if (getType(target) === "[object Object]") {
//         result = {}
//       } else if (getType(target) === "[object Map]") {
//         result = new Map();
//       } else if (getType(target) === "[object Set]") {
//         result = new Set();
//       }

//       //解决循环引用
//       if (map[target]) {
//         return map[target];
//       }
//       map[target] = result;

//       if (getType(target) === "[object Map]") {
//         target.forEach((value, key) => {
//           result.set(key, clone(value, map));
//         });
//         return result;
//       } else if (getType(target) === "[object Set]") {
//         target.forEach(value => {
//           result.add(clone(value, map));
//         });
//         return result;
//       } else if (getType(target) === "[object Object]" || getType(target) === "[object Array]") {
//         const keys = getType(target) === "[object Array]" ? undefined : Object.keys(target);

//         function callback(value, key) {
//           if (keys) {
//             // 如果keys存在则说明value是一个对象的key，不存在则说明key就是数组的下标。
//             key = value
//           }
//           result[key] = clone(target[key], map)
//         }
//         handleWhile(keys || target, callback)
//       } else {
//         result = handleOherData(target)
//       }
//       return result;
//     } else {
//       if (getType(target) === "[object Symbol]") {
//         return cloneSymbol(target)
//       } else {
//         return target;
//       }
//     }
//   }
//   let map = {}
//   const result = clone(target, map);
//   map = null;
//   return result
// }
/* 

function deepClone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  // Handle Function
  if (obj instanceof Function) {
    copy = function () {
      return obj.apply(this, arguments);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
} */



function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

	function clearAllCookie() {
	  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	  if (keys) {
	    for (var i = keys.length; i--;)
	      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
	  }
  }

function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    alert("欢迎 " + user + " 再次访问");
  } else {
    user = prompt("请输入你的名字:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 30);
    }
  }
}

