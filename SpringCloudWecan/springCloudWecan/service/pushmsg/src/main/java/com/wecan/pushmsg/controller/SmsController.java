package com.wecan.pushmsg.controller;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.SmsData;
import com.wecan.pushmsg.service.SmsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@Api(value = "API - SmsController")
@Data
@RestController
public class SmsController {
    @Autowired
    private SmsService smsService;

    @ApiOperation(value = "发送短信", notes = "发送短信")
    @RequestMapping(value = "/postSms", method = RequestMethod.GET)
    @ApiImplicitParam(name = "smsData", value = "Sms表单", required = true, dataType = "SmsData")
    public ReturnResult getSmsData(@Valid SmsData smsData) {
        return smsService.sendPublicSms(smsData);
    }

    @ApiOperation(value = "发送短信", notes = "发送短信")
    @RequestMapping(value = "/postSms", method = RequestMethod.POST)
    @ApiImplicitParam(name = "smsData", value = "Sms表单", required = true, dataType = "SmsData")
    public ReturnResult postSmsData(@Valid @RequestBody SmsData smsData) {
        return smsService.sendPublicSms(smsData);
    }
}


