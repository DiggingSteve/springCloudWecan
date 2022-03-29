package com.wecan.commonmongo.mongo;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;
import lombok.var;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.*;

@Component
public class MongoDB {
    private static MongoClient client;
    private static MongoDatabase db;
    private static MongoCollection<DBObject> collection;

    private static MongoDB mongoDB;

    private static String host;

    @Value("${mongoDB.host}")
    public void setHost(String host) {
        this.host = host;
    }

    private static Integer port;

    @Value("${mongoDB.port}")
    public void setPort(Integer port) {
        this.port = port;
    }

    private static String databaseName;

    @Value("${mongoDB.databaseName}")
    public void setDatabaseName(String databaseName) {

        this.databaseName = databaseName;
    }

    private static String collectionName;

    @Value("${mongoDB.collectionName}")
    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }

    public static MongoDB getInstance() {
        return getInstance(collectionName);
    }

    public static MongoDB getInstance(@Nullable String collectionNameChange) {
        if (mongoDB == null) {
            synchronized (MongoDB.class) {
                var builder = new MongoClientOptions.Builder();
                builder.connectionsPerHost(100);
                builder.connectTimeout(1000 * 60 * 20);
                builder.maxWaitTime(100 * 60 * 5);
                builder.threadsAllowedToBlockForConnectionMultiplier(100);
                builder.maxConnectionIdleTime(288000000);
                builder.maxConnectionLifeTime(0);
                builder.socketTimeout(0);
                builder.socketKeepAlive(true);
                var options = builder.build();
                client = new MongoClient(new ServerAddress(host, port), options);
                db = client.getDatabase(databaseName);
                collection = db.getCollection(collectionNameChange, DBObject.class);
            }
        } else {
            collection = db.getCollection(collectionNameChange, DBObject.class);
        }
        return mongoDB;
    }

    public static FindIterable<DBObject> mongoConditionQuery(String key, Object value) {
        var object = new BasicDBObject(key, value);
        var documents = collection.find(object);
        return documents;
    }

    public static FindIterable<DBObject> mongoConditionQuery(Map<String, Object> objectMap) {
        var filters = new ArrayList<Bson>();
        for (Map.Entry<String, Object> entryMap : objectMap.entrySet()) {
            filters.add(Filters.eq(entryMap.getKey(), entryMap.getValue()));
        }
        var documents = collection.find(Filters.and(filters));
        return documents;
    }


    public static boolean mongoExists(String key, Object value) {
        var object = new BasicDBObject(key, value);
        return collection.count(object) > 0;
    }

    public static boolean mongoExists(Map<String, Object> objectMap) {
        var filters = new ArrayList<Bson>();
        for (Map.Entry<String, Object> entryMap : objectMap.entrySet()) {
            filters.add(Filters.eq(entryMap.getKey(), entryMap.getValue()));
        }
        return collection.count(Filters.and(filters)) > 0;
    }

    public static void mongoInsert(String jsonStr) {
        var jsonObj = (DBObject) JSON.parse(jsonStr);
        jsonObj.put("sysDate", new Date());
        collection.insertOne(jsonObj);
    }

    public static void mongoInsert(Map<String, Object> objectMap) {
        var jsonObj = new BasicDBObject(objectMap);
        jsonObj.put("sysDate", new Date());
        collection.insertOne(jsonObj);
    }

    public static void mongoInsertList(ArrayList<Map<String, Object>> mapList) {
        var jsonObj = new ArrayList<DBObject>();
        for (Map<String, Object> objectMap : mapList) {
            objectMap.put("sysDate", new Date());
            jsonObj.add(new BasicDBObject(objectMap));
        }
        if (jsonObj.size() > 0) {
            collection.insertMany(jsonObj);
        }
    }

    public static void mongoDelete(String key, Object value) {
        collection.deleteMany(Filters.eq(key, value));
    }

    public static void mongoDelete(Map<String, Object> objectMap) {
        var filters = new ArrayList<Bson>();
        for (Map.Entry<String, Object> entryMap : objectMap.entrySet()) {
            filters.add(Filters.eq(entryMap.getKey(), entryMap.getValue()));
        }
        collection.deleteMany(Filters.and(filters));
    }
}
