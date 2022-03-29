/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/25 13:51
 */
package com.wecan.daofee.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daofee.mapper.EmailNotifyMapper;
import com.wecan.daofee.service.IEmailNotifyService;
import com.wecan.modeldbo.airfreight.fee.EmailNotify;
import org.springframework.stereotype.Service;

@Service
public class EmailNotifyServiceImpl extends ServiceImpl<EmailNotifyMapper, EmailNotify> implements IEmailNotifyService {
}
