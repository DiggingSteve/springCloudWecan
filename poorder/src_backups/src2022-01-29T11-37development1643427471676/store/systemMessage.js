const queueKey={feeToSubShipace:"运价查询订舱"}
//采用发布订阅的模式处理跨系统之间的消息 
class SystemMessage{
    queueObject={};
    publish(key,data){
        this.queueObject[key]=this.queueObject[key]||[];
        var fns=this.queueObject[key];
        if(!!!fns||fns.length==0){
            return false;
        }
        var fn=fns[0];
        for(var i=0;fn;fn=fns[i++]){
            debugger
            fn(data);
        }


    }

    subscribe(key,fn){
        this.queueObject[key]=this.queueObject[key]||[];
        this.queueObject[key].push(fn);
    }
 
}

export {queueKey,SystemMessage}