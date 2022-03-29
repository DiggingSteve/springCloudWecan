package com.wecan.websocket.service.impl;

import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.websocket.model.*;
import com.wecan.websocket.service.MongoDbService;
import com.wecan.websocket.service.SocketMessageService;
import com.wecan.websocket.service.SocketService;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SocketMessageImpl implements SocketMessageService {

    private static SocketService socketService;

    @Autowired
    public void setSocketService(SocketService socketService) {
        this.socketService = socketService;
    }

    private static MongoDbService mongoDbService;

    @Autowired
    public void setMongoDbService(MongoDbService mongoDbService) {
        this.mongoDbService = mongoDbService;
    }


    public ReturnResult postSocket(CallMessage callMessage) {
        if (callMessage == null) return ReturnResult.error();
        var callList = callMessage.getCalllist();
        var boBaseList = callMessage.getBobaseList();
        if (callList != null) {
            for (CallUser callUser : callList) {
                var callLogname = callUser.getLogname();
                if (callLogname.equals("系统")) {
                    continue;
                }
                if (boBaseList == null || boBaseList.size() == 1) {
                    sendCallMessage(callLogname, callMessage);
                } else {
                    var sidList = callUser.getSidList();
                    for (BoBase boBase : boBaseList) {
                        if (sidList.contains(boBase.getBoguid()) && sidList.contains(boBase.getGuid())) {
                            callMessage.setArea(boBase.getArea());
                            callMessage.setBoguid(boBase.getBoguid());
                            callMessage.setPono(boBase.getPono());
                            callMessage.setGuid(boBase.getGuid());
                            callMessage.setMawb(boBase.getMawb());
                            sendCallMessage(callLogname, callMessage);
                            break;
                        }
                        if (sidList.contains(boBase.getBoguid()) || sidList.contains(boBase.getGuid())) {
                            callMessage.setArea(boBase.getArea());
                            callMessage.setBoguid(boBase.getBoguid());
                            callMessage.setPono(boBase.getPono());
                            callMessage.setGuid(boBase.getGuid());
                            callMessage.setMawb(boBase.getMawb());
                            sendCallMessage(callLogname, callMessage);
                        }
                    }
                }
            }
        }
        var msgMap = DataTypeConversion.objectToMapFormats(callMessage);
        var loginName = msgMap.get("loginName");
        if (loginName == null || !loginName.toString().equals("系统")) {
            socketService.sendMessageByGuid(null, msgMap, callList);
            mongoDbService.insertMongoMessage(msgMap);
        }
        return ReturnResult.success();
    }

    private void sendCallMessage(String callLogname, CallMessage callMessage) {
        var msgMap = DataTypeConversion.objectToMapFormats(callMessage);
        var isSuccess = socketService.callOnlineSessionByLogname(callLogname, msgMap);
        if (!isSuccess) {
            mongoDbService.insertMongoCallMessage(callLogname, msgMap);
        }
    }

    public ReturnResult getSessionCount() {
        return socketService.getSessionCount();
    }

}
