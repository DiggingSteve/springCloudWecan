package com.wecan.websocket.model;

import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

@Data
public class OnlineSession {
    public String sessionId;

    public String logName;

    public Long guid;

    public WebSocketSession session;
}
