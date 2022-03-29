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
import java.util.stream.Collectors;

@Service
public class CustomerCache implements CommandLineRunner {
   private PublicClientService _pubApi;
   @Autowired
   public CustomerCache(PublicClientService pubapi){
       _pubApi=pubapi;
   }

    @Autowired
    Cache<String, Object> cache;

    public  static final String key = "客户缓存";

    @Override
    public void run(String... args) throws Exception {
       var data= _pubApi.getFidCache();
       data=data.stream().filter(f->{return f.comxz==1;}).collect(Collectors.toList());
       cache.put(key,data);
    }

    public  List<OutputFidCache>getCache(){
        return (List<OutputFidCache>) cache.asMap().get(key);
    }



}
