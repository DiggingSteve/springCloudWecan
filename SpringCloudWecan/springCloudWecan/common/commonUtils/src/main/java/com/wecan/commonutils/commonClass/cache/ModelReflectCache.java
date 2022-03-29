package com.wecan.commonutils.commonClass.cache;

import com.wecan.commonutils.commonModel.ModelCache;
import lombok.var;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 实体类缓存
 */
public class ModelReflectCache {
    private static Map<String, List<ModelCache>> concurrentHashMap = new ConcurrentHashMap<>();

    public static List<ModelCache> getObjectByClass(Class<?> modelClass) {
        var modelClassName = modelClass.getName();

        if (concurrentHashMap.containsKey(modelClassName)) {
            return concurrentHashMap.get(modelClassName);
        } else {
            var returnList = getListByClass(modelClass);
            concurrentHashMap.put(modelClassName, returnList);
            return returnList;
        }
    }

    private static List<ModelCache> getListByClass(Class<?> modelClass) {

        List<ModelCache> modelCacheList = new ArrayList<>();
        GetClass(modelClass, modelCacheList);
        return modelCacheList;
    }

    private static void GetClass(Class<?> modelClass, List<ModelCache> modelCacheList) {
        var parentClass = modelClass.getSuperclass();
        if (parentClass != null) GetClass(modelClass.getSuperclass(), modelCacheList);

        Field[] fields = modelClass.getDeclaredFields();
        for (Field field : fields) {
            var modelCache = new ModelCache();
            modelCache.name = field.getName();
            modelCache.type = field.getType();
            modelCacheList.add(modelCache);
        }
    }
}
