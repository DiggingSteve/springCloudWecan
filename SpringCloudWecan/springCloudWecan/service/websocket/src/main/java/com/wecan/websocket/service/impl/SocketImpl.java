package com.wecan.websocket.service.impl;

import com.google.common.base.Splitter;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.websocket.model.CallUser;
import com.wecan.websocket.model.FileByteBuffer;
import com.wecan.websocket.model.OnlineSession;
import com.wecan.websocket.service.MongoDbService;
import com.wecan.websocket.service.SocketService;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.adapter.standard.StandardWebSocketSession;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class SocketImpl implements SocketService {

    private static MongoDbService mongoDbService;

    @Autowired
    public void setMongoDbService(MongoDbService mongoDbService) {
        this.mongoDbService = mongoDbService;
    }


    private List<OnlineSession> onlineSessionList = new ArrayList<>();
    final Object lockObj = new Object();


    public OnlineSession insertOnlineSession(WebSocketSession session) {

        var sessionId = session.getId();
        var onlineSession = new OnlineSession();
        var logName = getParam(session.getUri().toString(), "logname");
        onlineSession.setSessionId(sessionId);
        onlineSession.setSession(session);
        onlineSession.setLogName(logName);
        try {
            if (onlineSession != null) {
                synchronized (lockObj) {
                    onlineSessionList.add(onlineSession);
                }
            }
        } catch (Exception e) {
        }
        sendOnlineMessage(onlineSession);
        return onlineSession;
    }

    public void changeSessionGuid(WebSocketSession session, long guid) {
        for (OnlineSession onlineSession : onlineSessionList) {
            if (!onlineSession.getSessionId().equals(session.getId())) continue;
            onlineSession.setGuid(guid);
        }
    }

    //删除离线连接
    public void removeOnlineSession(WebSocketSession session) throws IOException {
        session.close();
        try {
            var removeList = new ArrayList<OnlineSession>();
            for (OnlineSession onlineSession : onlineSessionList) {
                if (onlineSession.getSessionId().equals(session.getId())) {
                    removeList.add(onlineSession);
                } else if (!((StandardWebSocketSession) onlineSession.session).getNativeSession().isOpen()) {
                    removeList.add(onlineSession);
                }
            }

            synchronized (lockObj) {
                if (removeList.size() > 0) {
                    onlineSessionList.removeAll(removeList);
                }
            }

            for (OnlineSession onlineSession : removeList) {
                sendOfflineMessage(onlineSession);
            }
        } catch (Exception e) {
        }

        System.gc();
    }

    public boolean callOnlineSessionByLogname(String callLogname, Map<String, Object> msgMap) {
        var isCall = false;
        for (OnlineSession onlineSession : onlineSessionList) {
            if (!onlineSession.getLogName().equals(callLogname)) continue;

            isCall = true;
            msgMap.put("logname", callLogname);
            msgMap.put("pushtype", "call");
            sendSuccessMapMessage(onlineSession.session, msgMap);
        }
        return isCall;
    }

    public boolean callOnlineSessionByLogname(String callLogname, Map<String, Object> msgMap, long readGuid) {
        var isRead = false;
        for (OnlineSession onlineSession : onlineSessionList) {
            if (!onlineSession.getLogName().equals(callLogname)) continue;

            var sessionGuid = onlineSession.getGuid();
            if (readGuid > 0  && sessionGuid != null && sessionGuid.equals(readGuid)  ) {
                isRead = true;
                continue;
            }
            msgMap.put("logname", callLogname);
            sendSuccessMapMessage(onlineSession.session, msgMap);
        }
        return isRead;
    }

    //返回文件消息
    public void sendFileByteMessage(WebSocketSession session, FileByteBuffer fileByteBufferInfo) {
        var result = fileByteBufferInfo.getIsError() ? ReturnResult.error() : ReturnResult.success();
        var msgMap = DataTypeConversion.objectToMapFormats(fileByteBufferInfo);
        msgMap.put("messagetype", "bufferpercent");
        result.setResultdata(msgMap);
        sendMessage(session, result);
    }

    //推送guid 相关消息
    public void sendMessageByGuid(WebSocketSession session, Map<String, Object> msgMap, ArrayList<CallUser> callUserArrayList) {
        if (msgMap == null) return;
        var guidObj = msgMap.get("guid");
        if (guidObj == null) return;
        var sessionGuid = session == null ? "-1" : session.getId();
        var guid = Long.parseLong(guidObj.toString());
        for (OnlineSession onlineSession : onlineSessionList) {
            var onlineSessionGuid = onlineSession.getGuid();
            var onlineSessionName = onlineSession.getLogName();
            if (onlineSessionGuid != null
                    && onlineSessionGuid.equals(guid)
                    && !onlineSession.getSessionId().equals(sessionGuid)
                    && (callUserArrayList == null || !callUserArrayList.stream().anyMatch(a -> a.getLogname().equals(onlineSessionName)))) {
                sendSuccessMapMessage(onlineSession.session, msgMap);
            }
        }
    }

    //发送map消息
    public void sendSuccessMapMessage(WebSocketSession session, Map<String, Object> msgMap) {
        var result = ReturnResult.success();
        result.setResultdata(msgMap);
        sendMessage(session, result);
    }

    //发送map消息
    public void sendErrorMapMessage(WebSocketSession session, Map<String, Object> msgMap) {
        var result = ReturnResult.error();
        result.setResultdata(msgMap);
        sendMessage(session, result);
    }

    //封装方法发送消息到客户端
    private void sendMessage(WebSocketSession session, ReturnResult sendMessage) {
        try {
            var messageStr = DataTypeConversion.objectToStringFormats(sendMessage);
            session.sendMessage(new TextMessage(messageStr));
        } catch (Exception e) {
        }
    }

    //推送离线信息
    private void sendOfflineMessage(OnlineSession offLineSession) {
//        var sessionId = offLineSession.getSessionId();
//        var resultData = new HashMap<String, Object>();
//        resultData.put("logname", offLineSession.getLogName());
//        resultData.put("sessionId", offLineSession.getSessionId());
//        resultData.put("messagetype", "offlinemessage");
//
//        var onlineSessionCount = onlineSessionList.size();
//        for (OnlineSession onlineSession : onlineSessionList) {
//            if (((StandardWebSocketSession) onlineSession.session).getNativeSession().isOpen()) {
//                var sendMessage = ReturnResult.success();
//                sendMessage.setResultmessage("server  总人数:" + onlineSessionCount + "  提示用户" + sessionId + "离线 发送给" + onlineSession.getLogName() + onlineSession.getSessionId());
//                sendMessage.setResultdata(resultData);
//                sendMessage(onlineSession.session, sendMessage);
//            }
//        }
    }

    //推送在线信息
    private void sendOnlineMessage(OnlineSession onLineSession) {
        var listMap = mongoDbService.getMongoNodeMessage(onLineSession.getLogName());
        var msgMap = new HashMap<String, Object>();
        msgMap.put("messagetype", "historyjoblistmessage");
        msgMap.put("joblist", listMap);
        sendSuccessMapMessage(onLineSession.session, msgMap);

//        var sessionId = onLineSession.getSessionId();
//        var resultData = new HashMap<String, Object>();
//        resultData.put("logname", onLineSession.getLogName());
//        resultData.put("sessionId", onLineSession.getSessionId());
//        resultData.put("messagetype", "onlinemessage");
//
//        var onlineSessionCount = onlineSessionList.size();
//        for (OnlineSession onlineSession : onlineSessionList) {
//            if (onlineSession.getSessionId() != sessionId) {
//                if (((StandardWebSocketSession) onlineSession.session).getNativeSession().isOpen()) {
//                    var sendMessage = ReturnResult.success();
//                    sendMessage.setResultmessage("server 总人数:" + onlineSessionCount + " 提示用户" + sessionId + "上线 发送给" + onlineSession.getLogName() + onlineSession.getSessionId());
//                    sendMessage.setResultdata(resultData);
//                    sendMessage(onlineSession.session, sendMessage);
//                }
//            }
//        }
    }

    //获取参数
    private static String getParam(String url, String name) {
        try {
            if (!url.contains("?")) return null;
            url = URLDecoder.decode(url, "utf-8");
            var params = url.substring(url.indexOf("?") + 1);
            if (params.isEmpty()) return null;
            var split = Splitter.on("&").withKeyValueSeparator("=").split(params);
            return split.get(name);
        } catch (Exception e) {
        }
        return "";
    }
}
