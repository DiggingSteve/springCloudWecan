package com.wecan.commonlog.log;

import com.wecan.commonfeign.feign.service.impl.LogClientImpl;
import com.wecan.modelview.logger.LogData;
import lombok.var;
import org.apache.logging.log4j.core.Filter;
import org.apache.logging.log4j.core.Layout;
import org.apache.logging.log4j.core.LogEvent;
import org.apache.logging.log4j.core.appender.AbstractAppender;
import org.apache.logging.log4j.core.config.plugins.Plugin;
import org.apache.logging.log4j.core.config.plugins.PluginAttribute;
import org.apache.logging.log4j.core.config.plugins.PluginElement;
import org.apache.logging.log4j.core.config.plugins.PluginFactory;
import org.apache.logging.log4j.core.impl.MutableLogEvent;
import org.apache.logging.log4j.core.layout.PatternLayout;
import org.springframework.beans.factory.annotation.Value;

import java.io.Serializable;

@Plugin(name = "FileAppender", category = "Core", elementType = "appender", printObject = true)
public class FileAppender extends AbstractAppender {

    private static String applicationName;

    @Value("${spring.application.name}")
    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    /* 构造函数 */
    public FileAppender(String name, Filter filter, Layout<? extends Serializable> layout, boolean ignoreExceptions) {
        super(name, filter, layout, ignoreExceptions);
    }

    /*  接收配置文件中的参数 */
    @PluginFactory
    public static FileAppender createAppender(@PluginAttribute("name") String name,
                                              @PluginElement("Filter") final Filter filter,
                                              @PluginElement("Layout") Layout<? extends Serializable> layout,
                                              @PluginAttribute("ignoreExceptions") boolean ignoreExceptions) {
        if (layout == null) {
            layout = PatternLayout.createDefaultLayout();
        }
        return new FileAppender(name, filter, layout, ignoreExceptions);
    }


    @Override
    public void append(LogEvent event) {

        var logData = new LogData();
        logData.application = applicationName;
        logData.thread = event.getThreadName();
        logData.logger = event.getLoggerName();
        logData.level = event.getLevel() == null ? "" : event.getLevel().name();
        logData.message = event.getMessage() == null ? "" : event.getMessage().toString();
        logData.context = event.getContextData() == null ? "" : event.getContextData().toString();
        logData.thrown = event.getThrown() == null ? "" : event.getThrown().toString();

        if (logData.level.equals("INFO") && !logData.logger.contains("com.wecan")) return;

        if (MutableLogEvent.class.isInstance(event)) {
            var logEvent = (MutableLogEvent) event;
            var loggerName = logEvent.getLoggerName();
            if (loggerName.equals(Slf4jLogUtil.class.getName())) {
                logData.message = logEvent.getFormattedMessage();
            }
        }
        LogClientImpl.insertLogData(logData);
    }
}
