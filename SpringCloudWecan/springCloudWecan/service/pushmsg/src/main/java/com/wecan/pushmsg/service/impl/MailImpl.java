package com.wecan.pushmsg.service.impl;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.pushmsg.service.MailService;
import com.wecan.modelview.pushmsg.MailData;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;

@Service
public class MailImpl implements MailService {

    @Autowired
    private JavaMailSenderImpl javaMailSenderImpl;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${mail.username}")
    private String username;

    public ReturnResult sendPublicMail(MailData mailData) {

        try {
            var message = javaMailSenderImpl.createMimeMessage();
            var helper = new MimeMessageHelper(message, true);
            helper.setFrom(username);
            helper.setTo(mailData.to);
            helper.setSubject(mailData.subject);

            var ctx = new Context();
            ctx.setVariable("content", mailData.content);
            var htmlContent = templateEngine.process("publicMail.html", ctx);
            helper.setText(htmlContent, true);

            javaMailSenderImpl.send(message);


            return ReturnResult.success();
        } catch (MessagingException e) {
            return ReturnResult.error().putMessage(e.getMessage());
        }
    }
}
