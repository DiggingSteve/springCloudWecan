
import {
    Message,
    MessageBox
} from 'element-ui';
class BaseService{
    
    constructor(v){
        this.vueInstance=v;
        this.axios = v.$axios;
        this.feeUrl = v.$store.state.feeWebApi;
        this.pubUrl=v.$store.state.publicWebApi 
    }
    axios=null;
    /**vue实例 */
    vueInstance=null;

    feeUrl="";

    pubUrl="";
    async request(method, url, data,opt) {
        let postData = {
            method: method,
            url: url,
            noarea: true,
            noselect: true,
            loading: true,
            changeOrigin: true, //允许跨域
        }
        if(!!opt){
           postData.loading= opt.loading;
        }
        if (method == "post") {
            postData.data = data;
        }
        else if (method == "get") {
            postData.params = data // 需要序列化
        }
        let result = await this.axios(postData);
    
        return  new Promise((resolve, reject) => {
            
            if (result.status==200) {
                if((url.indexOf("fee")>0||url.indexOf("File")>0)&&result.data.resultstatus!=0){
                    throw new Error(result.data.resultmessage);
                }
                resolve(result)
            }
            else {
                reject(  new Error(result.data.resultmessage));
            }
        }).catch((e)=>{
            //异步方法 的异常并不会给全局异常处理给捕获 需要手动提示一下 再抛出 后续方法会中断
            Message({
              type: 'error',
              message: e.message,
              duration: 1000
          })
          throw e;
        })
        
    }

    ok(message){
        Message({
            type: 'success',
            message: message,
            duration: 1000
        })
    }

    get addman(){
        return localStorage.getItem('usrname');
    }

   

    get currentDate(){
        return new Date().Format("yyyy-MM-dd");
    }

    
    //当前数据的地区
    currentArea=null;

    get area(){
        if(!!this.currentArea)return this.currentArea;
        var area=this.vueInstance.$store.state.areaState
        if(area.indexOf(',')>-1)return "";
        return area;
    }
    // 定义一个深拷贝函数  接收目标target参数
 deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
    // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
         // 判断如果当前的值是null的话；直接赋值为null
        } else if(target===null) {
            result = null;
         // 判断如果当前的值是一个RegExp对象的话，直接赋值    
        } else if(target.constructor===RegExp){
            result = target;
        }else {
         // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
     // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
     // 返回最终结果
    return result;
}

}

export { BaseService} 