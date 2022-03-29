package com.wecan.pushmsg.service;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.pushmsg.MailData;

public interface MailService {
    ReturnResult sendPublicMail(MailData mailData);
}
