package com.wecan.commonutils.commonClass.format;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alibaba.fastjson.serializer.ToStringSerializer;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import lombok.var;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.Map;

/**
 * 数据类型相互转换方法
 */
public class DataTypeConversion {
    public static JSONObject stringToObject(String str) {
        var jsonObject = JSONObject.parseObject(str);
        return jsonObject;
    }

    public static Map<String, Object> stringToMap(String str) {
        return stringToMapFormats(str, false, false);
    }

    public static Map<String, Object> stringToMapFormats(String str) {
        return stringToMapFormats(str, true, false);
    }

    public static Map<String, Object> stringToMapFormats(String str, boolean isFormatLong, boolean isFormatBigDecimal) {
        var obj = JSONObject.parse(str);
        var config = getConfig(isFormatLong, isFormatBigDecimal);
        var jsonObject = (JSONObject) JSONObject.toJSON(obj, config);
        Map<String, Object> jsonMap = JSONObject.toJavaObject(jsonObject, Map.class);
        return jsonMap;
    }

    public static <T> T stringToViewModel(String str, Class<T> modelClass) {
        JSONObject jsonObject = JSONObject.parseObject(str);
        return JSON.toJavaObject(jsonObject, modelClass);
    }

    public static Map<String, Object> objectToMap(Object obj) {
        return objectToMapFormats(obj, false, false);
    }

    public static Map<String, Object> objectToMapFormats(Object obj) {
        return objectToMapFormats(obj, true, false);
    }

    public static Map<String, Object> objectToMapFormats(Object obj, boolean isFormatLong, boolean isFormatBigDecimal) {
        var config = getConfig(isFormatLong, isFormatBigDecimal);
        var jsonObject = (JSONObject) JSONObject.toJSON(obj, config);
        Map<String, Object> jsonMap = JSONObject.toJavaObject(jsonObject, Map.class);
        return jsonMap;
    }

    public static String objectToString(Object obj) {
        return objectToStringFormats(obj, false, false);
    }

    public static String objectToStringFormats(Object obj) {
        return objectToStringFormats(obj, true, false);
    }

    public static String objectToStringFormats(Object obj, boolean isFormatLong, boolean isFormatBigDecimal) {
        var config = getConfig(isFormatLong, isFormatBigDecimal);
        var jsonString = JSONObject.toJSONString(obj, config);
        return jsonString;
    }

    private static SerializeConfig getConfig(boolean isFormatLong, boolean isFormatBigDecimal) {
        var config = SerializeConfig.getGlobalInstance();
        config.clearSerializers();
        if (isFormatLong) {
            config.put(Long.class, LongToStringSerializer.instance);
            config.put(Long.TYPE, LongToStringSerializer.instance);
        }

        if (isFormatBigDecimal) {
            config.put(BigDecimal.class, new BigDecimalToStringSerializer(new DecimalFormat("")));
        }
        return config;
    }
}

