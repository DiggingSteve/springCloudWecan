package com.wecan.commonfeign.feign.service;

import com.wecan.commonfeign.feign.service.impl.PushMsgClientFallImpl;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.MailData;
import com.wecan.modelview.pushmsg.SmsData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@FeignClient(value = "pushmsg", fallback = PushMsgClientFallImpl.class)
@Service
public interface PushMsgClientService {
    @RequestMapping(value = "/postSms", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    ReturnResult sendPublicSms(SmsData sms);

    @RequestMapping(value = "/postMail", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    ReturnResult sendPublicMail(MailData mailData);
}
