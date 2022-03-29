package com.wecan.commonutils.commonClass.mybatis;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.cache.ModelReflectCache;
import lombok.var;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

/**
 * 生成mybatis-plus相关query方法
 */
public class GetQueryWrapper {

    public static QueryWrapper getQueryWrapperByJsonStr(String jsonStr, Class<?> modelClass) {
        var queryWrapper = new QueryWrapper();
        var jsonObject = DataTypeConversion.stringToObject(jsonStr);
        for (Map.Entry<String, Object> entry : jsonObject.entrySet()) {
            var key = entry.getKey();
            var value = entry.getValue();
            switch (key.toLowerCase(Locale.ROOT)) {
                case "where":
                    getWhereByJsonObject((JSONObject) value, queryWrapper, modelClass);
                    break;
                case "select":
                    getSelectByJsonObject(value, queryWrapper, modelClass);
                    break;
                case "order":
                    getOrderByJsonObject(value, queryWrapper, modelClass);
                    break;
            }
        }
        if (queryWrapper.getSqlSelect() == null) {
            queryWrapper.select("*");
        }
        if (queryWrapper.isEmptyOfWhere()) {
            queryWrapper.eq("1", "1");
        }
        return queryWrapper;
    }

    private static void getWhereByJsonObject(JSONObject jsonObject, QueryWrapper<Object> queryWrapper, Class<?> modelClass) {
        var modelCacheList = ModelReflectCache.getObjectByClass(modelClass);
        for (Map.Entry<String, Object> entry : jsonObject.entrySet()) {
            var key = entry.getKey();
            var modelCacheInfo = modelCacheList.stream().filter(item -> item.name.equals(key)).findFirst();
            if (modelCacheInfo.equals(Optional.empty()) && !(key.toLowerCase(Locale.ROOT).equals("orlist"))) continue;

            var value = entry.getValue();
            getColumnByJsonObject(key, value, queryWrapper, modelClass);
        }
    }

    private static void getColumnByJsonObject(String column, Object colVal, QueryWrapper<Object> queryWrapper, Class<?> modelClass) {
        if (colVal instanceof JSONObject) {
            column = ChangeColName(column);
            var jsonObject = (JSONObject) colVal;
            for (Map.Entry<String, Object> entry : jsonObject.entrySet()) {
                var key = entry.getKey();
                var value = entry.getValue();
                switch (key.toLowerCase(Locale.ROOT)) {
                    case "begin":
                        queryWrapper.ge(column, value);
                        break;
                    case "end":
                        queryWrapper.le(column, value);
                        break;
                    case "more":
                        queryWrapper.gt(column, value);
                        break;
                    case "less":
                        queryWrapper.lt(column, value);
                        break;
                    case "unequal":
                        queryWrapper.ne(column, value);
                        break;
                    case "equal":
                        queryWrapper.eq(column, value);
                        break;
                    case "like":
                        queryWrapper.like(column, value);
                        break;
                    case "beginlike":
                        queryWrapper.likeRight(column, value);
                        break;
                    case "endlike":
                        queryWrapper.likeLeft(column, value);
                        break;
                    case "notlike":
                        queryWrapper.notLike(column, value);
                        break;
                    case "in":
                        queryWrapper.in(column, ((String) value).split(","));
                        break;
                    case "not":
                        queryWrapper.notIn(column, ((String) value).split(","));
                        break;
                    default:
                        queryWrapper.eq(column, value);
                        break;
                }
            }
        } else if (colVal instanceof JSONArray) {
            switch (column.toLowerCase(Locale.ROOT)) {
                case "orlist":
                    queryWrapper.and(item -> {
                        getOrListByJsonList((JSONArray) colVal, item, modelClass);
                    });
                    break;
            }
        } else {
            column = ChangeColName(column);
            queryWrapper.eq(column, colVal);
        }
    }

    public static void getOrListByJsonList(JSONArray valueArr, QueryWrapper<Object> queryWrapper, Class<?> modelClass) {
        var isfirst = new AtomicBoolean(true);
        valueArr.stream().forEach(orValueObject -> {
            if (!isfirst.get()) {
                queryWrapper.or();
            }

            var orValue = (JSONObject) orValueObject;
            for (Map.Entry<String, Object> entry : orValue.entrySet()) {
                var key = entry.getKey();
                var value = entry.getValue();
                getColumnByJsonObject(key, value, queryWrapper, modelClass);
                isfirst.set(false);
            }
        });
    }

    private static void getSelectByJsonObject(Object value, QueryWrapper queryWrapper, Class<?> modelClass) {
        var modelCacheList = ModelReflectCache.getObjectByClass(modelClass);
        var selectArr = ((String) value).split(",");
        StringBuffer selectSb = new StringBuffer();
        for (String selectStr : selectArr) {
            var modelCacheInfo = modelCacheList.stream().filter(item -> item.name.equals(selectStr)).findFirst();
            if (modelCacheInfo.equals(Optional.empty())) continue;
            if (selectSb.length() != 0) selectSb.append(",");
            selectSb.append(ChangeColName(selectStr));
        }
        if (selectSb.length() != 0) queryWrapper.select(selectSb.toString());
    }

    private static void getOrderByJsonObject(Object value, QueryWrapper queryWrapper, Class<?> modelClass) {
        var modelCacheList = ModelReflectCache.getObjectByClass(modelClass);
        var orderArr = ((String) value).split(",");
        for (String orderStr : orderArr) {
            var orderKey = orderStr.split(" ")[0];
            var finalOrderKey = orderKey;
            var modelCacheInfo = modelCacheList.stream().filter(item -> item.name.equals(finalOrderKey)).findFirst();
            if (modelCacheInfo.equals(Optional.empty())) continue;

            orderKey = ChangeColName(orderKey);
            if (orderStr.contains("desc")) {
                queryWrapper.orderByDesc(orderKey);
            } else {
                queryWrapper.orderByAsc(orderKey);
            }
        }
    }

    private static String ChangeColName(String key) {
        return String.join("", "`", key, "`");
    }
}
