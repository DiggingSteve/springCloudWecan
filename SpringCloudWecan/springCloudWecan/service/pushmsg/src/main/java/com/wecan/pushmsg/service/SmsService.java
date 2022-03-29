package com.wecan.pushmsg.service;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.SmsData;

public interface SmsService {
    ReturnResult sendPublicSms(SmsData sms);
}
