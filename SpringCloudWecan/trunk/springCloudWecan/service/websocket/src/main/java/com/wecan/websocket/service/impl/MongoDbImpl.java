package com.wecan.websocket.service.impl;

import com.mongodb.DBObject;
import com.mongodb.client.FindIterable;
import com.wecan.commonmongo.mongo.MongoDB;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.websocket.service.MongoDbService;
import lombok.var;
import org.bson.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Service
public class MongoDbImpl implements MongoDbService {

    //region callMessage
    //获取未发送成功的消息
    public ArrayList<Map<String, Object>> getMongoCallMessage(String logname) {
        var key = "logname";
        var collection = "callMessage";
        var documents = MongoDB.getInstance(collection).mongoConditionQuery(key, logname);
        var callList = changeDocumentToList(documents);
        MongoDB.getInstance(collection).mongoDelete(key, logname);
        return callList;
    }

    //插入未发送成功的消息
    public void insertMongoCallMessage(String callLogname, Map<String, Object> msgMap) {
        var collection = "callMessage";
        var msgMapMongo = changeMsgMap(msgMap);
        msgMapMongo.put("logname", callLogname);
        msgMapMongo.put("pushtype", "call");
        MongoDB.getInstance(collection).mongoInsert(msgMapMongo);
    }
    //endregion

    //region nodeMessage
    //获取节点提醒消息
    public ArrayList<Map<String, Object>> getMongoNodeMessage(String nodeLogname) {
        var key = "logname";
        var collection = "nodeMessage";
        var documents = MongoDB.getInstance(collection).mongoConditionQuery(key, nodeLogname);
        return changeDocumentToList(documents);
    }

    //是否存在
    public boolean existsMongoNodeMessage(String nodeLogname, long boguid, long guid) {
        var collection = "nodeMessage";
        var msgMapMongo = getMap(nodeLogname, -1, guid);
        return MongoDB.getInstance(collection).mongoExists(msgMapMongo);
    }

    //新增节点提醒消息
    public void insertMongoNodeMessage(String nodeLogname, long boguid, long guid) {
        var collection = "nodeMessage";
        var msgMapMongo = getMap(nodeLogname, boguid, guid);
        MongoDB.getInstance(collection).mongoInsert(msgMapMongo);
    }

    //删除节点提醒消息
    public void deleteMongoNodeMessage(String nodeLogname, long boguid, long guid) {
        var collection = "nodeMessage";
        var msgMapMongo = getMap(nodeLogname, -1, guid);
        MongoDB.getInstance(collection).mongoDelete(msgMapMongo);
    }

    private Map<String, Object> getMap(String nodeLogname, long boguid, long guid) {
        Map<String, Object> msgMapMongo = new HashMap<>();
        msgMapMongo.put("logname", nodeLogname);
        msgMapMongo.put("guid", guid);
        if (boguid > 0) {
            msgMapMongo.put("boguid", boguid);
        }
        return msgMapMongo;
    }
    //endregion

    //region message
    //获取消息
    public ArrayList<Map<String, Object>> getMongoMessageByGuid(long boguid, long guid) {
        var collection = "websocket";
        var guidStr = Long.toString(guid);
        collection += guidStr.length() >= 4 ? guidStr.substring(0, 4) : guidStr;
        var documents = MongoDB.getInstance(collection).mongoConditionQuery("guid", guid);
        return changeDocumentToList(documents);
    }

    //插入消息
    public void insertMongoMessage(Map<String, Object> msgMap) {
        var collection = "websocket";
        var guidObj = msgMap.get("guid");
        if (guidObj != null) {
            var guidStr = guidObj.toString();
            collection += guidStr.length() >= 4 ? guidStr.substring(0, 4) : guidStr;
        }
        var msgMapMongo = changeMsgMap(msgMap);
        MongoDB.getInstance(collection).mongoInsert(msgMapMongo);
    }

    //endregion


    //region 公共代码
    private Map<String, Object> changeMsgMap(Map<String, Object> msgMap) {
        Map<String, Object> msgMapMongo = new HashMap<String, Object>();
        for (String key : msgMap.keySet()) {
            var obj = msgMap.get(key);
            if (key.equals("boguid") || key.equals("guid")) {
                msgMapMongo.put(key, Long.valueOf(String.valueOf(obj)));
            } else {
                msgMapMongo.put(key, obj);
            }
        }
        return msgMapMongo;
    }

    private ArrayList<Map<String, Object>> changeDocumentToList(FindIterable<DBObject> jsonObjList) {
        var listMap = new ArrayList<Map<String, Object>>();
        for (DBObject jsonObj : jsonObjList) {
            var msgMap = DataTypeConversion.objectToMapFormats(jsonObj);
            msgMap.remove("_id");
            listMap.add(msgMap);
        }
        return listMap;
    }
    //endregion
}
