package com.wecan.commonlog.log;

import lombok.var;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class Slf4jLogUtil {
    private final static String fileName = Slf4jLogUtil.class.getSimpleName() + ".java";
    private final static String prefix = "com.wecan";

    public static final Logger LOGGER = LoggerFactory.getLogger(Slf4jLogUtil.class);

    public static void exception(Exception ex, String text, Object... params) {
        error(tag(), ex, "text", params);
    }

    private static void exception(String tag, Exception ex, String text, Object... params) {
        LOGGER.error(tag + " -t:`" + text + "`", ex);
    }

    public static void error(String text, Object... params) {
        error(tag(), "text", params);
    }

    private static void error(String tag, String text, Object... params) {
        LOGGER.error(tag + " -t:`" + text + "`");
    }

    public static void warn(String text, Object... params) {
        warn(tag(), "text", params);
    }

    private static void warn(String tag, String text, Object... params) {
        LOGGER.warn(tag + " -t:`" + text + "`");
    }

    public static void info(String text, Object... params) {
        info(tag(), "text", params);
    }

    public static void info2in(String tag, Object... params) {
        info(tag(), "IN", params);
    }

    public static void info2out(String tag, Object... params) {
        info(tag(), "OUT", params);
    }

    private static void info(String tag, String text, Object... params) {
        LOGGER.info(tag + " -t:`" + text + "` ");
    }

    private static String tag(StackTraceElement ste) {
        var arrays = ste.getFileName().split("\\.");
        String tag;
        if (arrays != null && arrays.length > 0) {
            return arrays[0] + "." + ste.getMethodName() + ":" + ste.getLineNumber();
        } else {
            tag = "uk";
        }
        return tag;
    }

    private static String tag() {
        var sites = Thread.currentThread().getStackTrace();

        if (!sites[3].getFileName().equals(fileName) && sites[3].getClassName().contains(prefix)) {
            return tag(sites[3]);
        }

        for (StackTraceElement ste : sites) {
            if (ste.getFileName().equals(fileName)) {
                continue;
            }
            if (ste.getClassName().contains(prefix)) {
                return tag(ste);
            }
        }
        return "tag:nil";
    }
}