package com.wecan.commonfeign.feign.service.impl;

import com.wecan.commonfeign.feign.service.PushMsgClientService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.MailData;
import com.wecan.modelview.pushmsg.SmsData;
import org.springframework.stereotype.Component;

/**
 * feign触发熔断后的返回值重写方法
 */
@Component
public class PushMsgClientFallImpl implements PushMsgClientService {
    @Override
    public ReturnResult sendPublicSms(SmsData sms) {

        return ReturnResult.error();
    }

    @Override
    public ReturnResult sendPublicMail(MailData mailData) {
        return ReturnResult.error();
    }
}
