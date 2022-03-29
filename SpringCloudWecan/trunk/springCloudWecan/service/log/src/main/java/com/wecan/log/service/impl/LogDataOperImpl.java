package com.wecan.log.service.impl;

import com.wecan.commonmongo.mongo.MongoDB;
import com.wecan.commonutils.commonClass.date.DateFormat;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.log.service.LogDataOperService;
import com.wecan.modelview.logger.LogData;
import lombok.var;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service("logDataOperate")
public class LogDataOperImpl implements LogDataOperService {

//    private static LogDataAdoService logDataAdoService;
//
//    @Resource(name = "logDataAdo")
//    public void setLogDataAdoService(LogDataAdoService logDataAdoService) {
//
//        this.logDataAdoService = logDataAdoService;
//    }
//
//    public ReturnResult insertLogToDb(LogData logData) {
//        if (logData != null) {
//            var application = logData.getApplication();
//            var tableName = String.join("_", "log4j2", application, DateFormat.getDateNowStr("YY_MM"));
//            logDataAdoService.saveTable(tableName);
//            var log4j2 = new Log4j2();
//            log4j2.setLogger(logData.getLogger());
//            log4j2.setMessage(logData.getMessage());
//            log4j2.setContext(logData.getContext());
//            log4j2.setLevel(logData.getLevel());
//            log4j2.setThread(logData.getThread());
//            log4j2.setThrown(logData.getThrown());
//            return logDataAdoService.insertLog(tableName, log4j2);
//        }
//        return ReturnResult.success();
//    }

    private static Integer Throughput;

    @Value("${mongoDB.throughput}")
    public void setThroughput(Integer throughput) {
        Throughput = throughput;
    }

    public Map<String, ArrayList<Map<String, Object>>> dicLogData = new ConcurrentHashMap<>();

    public ReturnResult insertLogToMongoDb(LogData logData) {
        if (logData != null) {
            var application = logData.getApplication();
            var tableName = String.join("", application, DateFormat.getDateNowStr("YYMM"));
            var msgMap = DataTypeConversion.objectToMap(logData);

            var mapKeyExists = dicLogData.containsKey(tableName);
            if (!mapKeyExists) {
                var newList = new ArrayList<Map<String, Object>>();
                newList.add(msgMap);
                dicLogData.put(tableName, newList);
            } else {
                var mapList = dicLogData.get(tableName);
                mapList.add(msgMap);
                dicLogData.put(tableName, mapList);
            }
        }
        ClearDicToDb();
        return ReturnResult.success();
    }

    public void ClearDicToDb() {
        for (var entry : dicLogData.entrySet()) {
            var key = (String) entry.getKey();
            var list = (ArrayList<Map<String, Object>>) entry.getValue();
            var throughput = (Throughput == null || Throughput == 0) ? 100 : Throughput;
            if (list.size() > throughput) {
                MongoDB.getInstance(key).mongoInsertList(list);
                dicLogData.put(key, new ArrayList<>());
            }
        }
    }
}
