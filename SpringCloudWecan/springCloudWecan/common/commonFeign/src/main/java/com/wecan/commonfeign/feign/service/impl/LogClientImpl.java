package com.wecan.commonfeign.feign.service.impl;

import com.wecan.commonfeign.feign.service.LogClientService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.logger.LogData;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LogClientImpl {
    private static LogClientService client;

    @Autowired
    public void setLogClientService(LogClientService client) {
        this.client = client;
    }

    private static String applicationName;

    @Value("${spring.application.name}")
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public static ReturnResult insertLogData(LogData logData) {
        try {
            if (applicationName == null) return ReturnResult.error();
            if (client == null) return ReturnResult.error();

            if (logData.thread.equals("main"))
                return ReturnResult.error();
            if (logData.logger.equals("com.netflix.discovery.DiscoveryClient"))
                return ReturnResult.error();
            if (logData.logger.equals("org.springframework.web.servlet.DispatcherServlet"))
                return ReturnResult.error();
            if (logData.logger.equals("com.wecan.log.impl.LogImpl"))
                return ReturnResult.error();
            if (logData.logger.equals("com.netflix.discovery.TimedSupervisorTask"))
                return ReturnResult.error();
            if (logData.thrown.contains("org.apache.logging.log4j.core.appender.AppenderLoggingException"))
                return ReturnResult.error();

            logData.application = applicationName;
            var resultData = client.insertLogData(logData);
            return resultData;
        } catch (Exception e) {
            return ReturnResult.error();
        }
    }
}