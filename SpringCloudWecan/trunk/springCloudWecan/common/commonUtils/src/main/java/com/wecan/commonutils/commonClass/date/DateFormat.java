package com.wecan.commonutils.commonClass.date;

import lombok.Data;
import lombok.var;

import java.text.SimpleDateFormat;
import java.util.Date;

@Data
public class DateFormat {
    public static String getDateNowStr(String format) {
        var now = new Date();
        var sdf = new SimpleDateFormat(format);
        var dateNowStr = sdf.format(now);
        return dateNowStr;
    }
}
