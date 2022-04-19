/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/24 16:30
 */
package com.wecan.fee.cache;

import com.github.benmanes.caffeine.cache.Cache;
import com.wecan.commonfeign.feign.service.PublicClientService;
import com.wecan.modelview.model.vo.customer.output.OutputFidCache;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
public class CustomerCache implements CommandLineRunner {

    Lock l = new ReentrantLock();
   private PublicClientService _pubApi;
   @Autowired
   public CustomerCache(PublicClientService pubapi){
       _pubApi=pubapi;
   }

    @Autowired
    Cache<String, Object> cache;

    public  static final String key = "客户缓存";
    public static final String isAlive="检测";

    @Override
    public void run(String... args) throws Exception {
       initCache();
    }
    private void initCache(){
        var data= _pubApi.getFidCache();
        data=data.stream().filter(f->{return f.comxz==1;}).collect(Collectors.toList());
        cache.put(key,data);
        cache.put(isAlive,true);
    }

    public  List<OutputFidCache>getCache(){

        if(cache.getIfPresent(isAlive)==null){
            l.lock();
            initCache();
            l.unlock();
        }
        return (List<OutputFidCache>) cache.asMap().get(key);
    }



}
