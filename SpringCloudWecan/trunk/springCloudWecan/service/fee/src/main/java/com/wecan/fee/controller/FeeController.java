package com.wecan.fee.controller;

import com.wecan.fee.cache.CustomerCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.GET;

@RestController
@RequestMapping("/Fee")
public class FeeController {
    @Autowired
    CustomerCache cache;

    @RequestMapping("/test")
    public String test() {
        return "1";
    }

    @RequestMapping("testCache")
    @GET
    public Object get(){
        return cache.getCache().stream().filter(f->{return f.id>0;}).toArray();}
}
