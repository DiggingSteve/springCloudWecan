package com.wecan.websocket.service;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.websocket.model.CallUser;
import com.wecan.websocket.model.FileByteBuffer;
import com.wecan.websocket.model.OnlineSession;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public interface SocketService {

    OnlineSession insertOnlineSession(WebSocketSession session);

    void changeSessionGuid(WebSocketSession session, long guid);

    void removeOnlineSession(WebSocketSession session) throws IOException;
    
    void sendMessageByGuid(WebSocketSession session, Map<String, Object> msgMap, ArrayList<CallUser> callUserArrayList);

    void sendSuccessMapMessage(WebSocketSession session, Map<String, Object> msgMap);

    void sendErrorMapMessage(WebSocketSession session, Map<String, Object> msgMap);

    void sendFileByteMessage(WebSocketSession session, FileByteBuffer fileByteBufferInfo);

    boolean callOnlineSessionByLogname(String callLogname, Map<String, Object> msgMap);

    boolean callOnlineSessionByLogname(String callLogname, Map<String, Object> msgMap, long readGuid);

    ReturnResult getSessionCount();
}
