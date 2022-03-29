package com.wecan.websocket.service;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.websocket.model.CallMessage;
import com.wecan.websocket.model.CallUser;
import com.wecan.websocket.model.FileByteBuffer;
import com.wecan.websocket.model.OnlineSession;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

public interface SocketMessageService {

    ReturnResult postSocket(CallMessage callMessage);
}
