package com.wecan.websocket.service;

import com.wecan.commonmongo.mongo.MongoDB;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import lombok.var;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Map;

public interface MongoDbService {

    //region callMessage
    //获取未发送成功的消息
    ArrayList<Map<String, Object>> getMongoCallMessage(String logname);

    //插入未发送成功的消息
    void insertMongoCallMessage(String callLogname, Map<String, Object> msgMap);
    //endregion

    //region nodeMessage
    //获取节点提醒消息
    ArrayList<Map<String, Object>> getMongoNodeMessage(String nodeLogname);

    //是否已存在
    boolean existsMongoNodeMessage(String nodeLogname, long boguid, long guid);

    //新增节点提醒消息
    void insertMongoNodeMessage(String nodeLogname, long boguid, long guid);

    //删除节点提醒消息
    void deleteMongoNodeMessage(String nodeLogname, long boguid, long guid);
    //endregion

    //region  Message
    //获取消息
    ArrayList<Map<String, Object>> getMongoMessageByGuid(long boguid, long guid);

    //插入消息
    void insertMongoMessage(Map<String, Object> msgMap);

    //endregion

}
