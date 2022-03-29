package com.wecan.pushmsg.service.impl;

import com.wecan.commonutils.commonClass.http.HttpClient;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.SmsData;
import com.wecan.pushmsg.service.SmsService;
import lombok.var;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;


@Service
public class SmsImpl implements SmsService {

    @Value("${sms.url}")
    private String url;

    @Value("${sms.tmpl}")
    private String tmpl;

    @Value("${sms.account}")
    private String account;

    @Value("${sms.password}")
    private String password;


    public ReturnResult sendPublicSms(SmsData sms) {
        try {
            var content = String.join("", tmpl, sms.content);
            var map = new HashMap<String, String>();
            map.put("account", account);
            map.put("password", password);
            map.put("phone", sms.to);
            map.put("msg", content);
            map.put("report", "false");
            var resultStr = HttpClient.postDataByUrl(url, map);
            return ReturnResult.success().putMessage(resultStr);
        } catch (Exception e) {
            return ReturnResult.error().putMessage(e.getMessage());
        }
    }
}
