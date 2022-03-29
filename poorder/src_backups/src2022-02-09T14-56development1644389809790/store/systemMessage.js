import { fromPairs } from "lodash";

const queueKey = { feeToSubShipace: "运价查询订舱" }
//采用发布订阅的模式处理跨系统之间的消息 
class SystemMessage {
    mq = {};
    publish(key, data) {
        this.mq[key] = this.mq[key] || {};
        this.mq[key].messageQueue=[];
        this.mq[key].subClients=[];
        var message=new Message(data)
        this.mq[key].messageQueue.push(message);
        var length=this.mq[key].messageQueue.length;
        var fns = this.mq[key].subClients;
        if (!!!fns || fns.length == 0) {
            return false;
        }
        var fn = fns[0];
        for (var i = 0; fn; fn = fns[i++]) {
            fn(data);
            message.consume();
            this.deleteMessage(key,length-1);
        }


    }

    deleteMessage(key,index){
       var arr= this.mq[key].messageQueue;
       var clients=this.mq[key].subClients;
       var message=arr[index];
       if(message.consumeCount>=clients.length){
           arr.splice(index,1);
       }
    }

    subscribe(key, fn) {
        this.mq[key] = this.mq[key] || {};
        this.mq[key].subClients=[];
        this.mq[key].subClients.push(fn);
        message=this.mq[key].messageQueue[0];
        var messageQueue=this.mq[key].messageQueue;
        for (var i = 0; message; message = messageQueue[i++]) {
            fn(message.data);
            message.consume();
            this.deleteMessage(key,i);
        }
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