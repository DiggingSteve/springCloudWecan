/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/10 18:58
 */
package com.wecan.commonutils.commonClass.util;

import java.math.BigDecimal;
import java.util.Formatter;

public class NumberUtil {

    public static String format(BigDecimal value,String format){
         Formatter formatter=new Formatter();
        return formatter.format(format,value).toString();
    }
}
