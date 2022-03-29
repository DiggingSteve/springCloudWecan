import { fromPairs } from "lodash";

const queueKey = { feeToSubShipace: "运价查询订舱",openBo:"打开Bo窗口" ,gotoNav:"跳转指定路由"}
//采用发布订阅的模式处理跨系统之间的消息 
class SystemMessage {
    mq = {};
    boState={};//记录bo共享变量 包含窗口是否已打开信息
    constructor(){
       this.initBoState();
    }
 
    publish(key, data) {
        this.mq[key] = this.mq[key] || {};
        this.mq[key].messageQueue=this.mq[key].messageQueue||[];
        this.mq[key].subClients=this.mq[key].subClients||{};
        var message=new Message(data)
        this.mq[key].messageQueue.push(message);
        var length=this.mq[key].messageQueue.length;
        var fns = this.mq[key].subClients;
        
        for (var name in fns) {
           var fn=fns[name];
            fn(data);
            message.consume();
            this.deleteMessage(key,length-1);
        }


    }

    deleteMessage(key,index){
       var arr= this.mq[key].messageQueue;
       var clients=this.mq[key].subClients;
       var message=arr[index];
       var count = 0;
       for(var i in clients) {
           if(clients.hasOwnProperty(i)) {  // 建议加上判断,如果没有扩展对象属性可以不加
               count++;
           }
       }
       if(message.consumeCount>=count&&count>=1){
           arr.splice(index,1);
           return true
       }
       return false
    }

    /**
     * 
     * @param {*} key 
     * @param {*} pageName  保证同一个queue 同一个页面只有一个订阅方法
     * @param {*} fn 
     */
    subscribe(key,pageName, fn) {
        this.mq[key] = this.mq[key] || {};
        this.mq[key].messageQueue=this.mq[key].messageQueue||[];
        this.mq[key].subClients=this.mq[key].subClients||{};
        var subClients= this.mq[key].subClients;
        if(this.mq[key].subClients[pageName]) throw new Error("重复订阅");
        this.mq[key].subClients[pageName]=fn;
        var messageQueue=this.mq[key].messageQueue;
        for (var i = 0; i<messageQueue.length; i++) {
            var  message=this.mq[key].messageQueue[i];
            fn(message.data);
            message.consume();
            var isDelete=this.deleteMessage(key,i);
            if(isDelete)i--;
        }
    }

    cancelSubscribe(key,pageName){
       delete this.mq[key].subClients[pageName];
    }

    initBoState(){
        this.boState["isOpen"]=false;//bo是否是打开状态
        this.boState["gotoNav"]="";//跳转导航 如果存在需要直接跳转
    }
    

}

class Message {
    constructor(data) {
        this.data = data;
    }

    consumeCount = 0;// 消息被消费计数 consumeCount>=subClientCount && subClientCount>0 时才能删除消息


    data = null; // 消息载体

    consume(){
        this.consumeCount++;
    }

}

 

export { queueKey, SystemMessage }