package com.wecan.gateway.controller;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.commonutils.commonClass.result.TimeoutReturnData;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wecan.daoroutes.mapper.RoutesMapper;


@Data
@Slf4j
@RestController
public class FallbackController {
    @Autowired
    private RoutesMapper routesMapper;

    @RequestMapping("/fallback")
    public ReturnResult fallback() {
        return TimeoutReturnData.fallBack();
    }
}