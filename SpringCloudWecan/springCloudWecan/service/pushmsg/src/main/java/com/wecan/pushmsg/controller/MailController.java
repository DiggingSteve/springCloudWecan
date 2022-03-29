package com.wecan.pushmsg.controller;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.pushmsg.service.MailService;
import com.wecan.modelview.pushmsg.MailData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@Api(value = "API - MailController")
@Data
public class MailController {

    @Autowired
    private MailService mailService;

    @ApiOperation(value = "发送邮件", notes = "发送邮件")
    @RequestMapping(value = "/postMail", method = RequestMethod.GET)
    @ApiImplicitParam(name = "mailData", value = "Mail表单", required = true, dataType = "MailData")
    public ReturnResult getMailData(@Valid MailData mailData) {

        return mailService.sendPublicMail(mailData);
    }

    @ApiOperation(value = "发送邮件", notes = "发送邮件")
    @RequestMapping(value = "/postMail", method = RequestMethod.POST)
    @ApiImplicitParam(name = "mailData", value = "Mail表单", required = true, dataType = "MailData")
    public ReturnResult postMailData(@Valid @RequestBody MailData mailData) {
        return mailService.sendPublicMail(mailData);
    }
}


