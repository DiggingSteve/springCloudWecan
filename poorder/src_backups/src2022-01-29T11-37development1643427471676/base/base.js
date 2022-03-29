//基础业务信息封装

import {
    Message,
    
} from 'element-ui';
import BusinessError from '../base/baseError'
class BaseService{
    
    constructor(v){
        this.vueInstance=v;
        this.axios = v.$axios;
        this.feeUrl = v.$store.state.feeWebApi;
    }
    axios=null;
    /**vue实例 */
    vueInstance=null;

    feeUrl="";
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
                    throw new BusinessError(result.data.resultmessage);
                }
                resolve(result)
            }
            else {
                reject(  new BusinessError(result.data.resultmessage));
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
        return getCookie('usrname');
    }

    get area(){
        return localStorage.getItem("realarea");
    }

    get currentDate(){
        return new Date().Format("yyyy-MM-dd");
    }
}

export { BaseService} 