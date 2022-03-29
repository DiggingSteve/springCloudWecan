package com.wecan.websocket.service;

import com.fasterxml.jackson.databind.*;
import com.wecan.commonfeign.feign.service.ImageClientService;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.modeldbo.image.Image;
import com.wecan.modelview.model.vo.file.output.UploadStatus;
import com.wecan.websocket.model.*;
import com.wecan.websocket.service.impl.FileUploadImpl;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class WebSocket extends TextWebSocketHandler implements WebSocketHandler {
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

    private static ImageClientService imageClientService;

    @Autowired
    public void setImageClientService(ImageClientService imageClientService) {
        this.imageClientService = imageClientService;
    }

    Map<String, FileByteBuffer> fileByteBufferMap = new Hashtable<String, FileByteBuffer>();

    /**
     * webSocket连接创建后调用
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        var onlineSession = socketService.insertOnlineSession(session);
        sendOnlineMessage(onlineSession);
    }

    /**
     * 接收到消息会调用
     */
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        if (message instanceof TextMessage) {
            handleTextMessage(session, (TextMessage) message);
        } else if (message instanceof BinaryMessage) {
            handleBinaryMessage(session, (BinaryMessage) message);
        }
    }

    //普通消息
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        var sessionId = session.getId();
        var msgStr = message.getPayload();
        var msgMap = DataTypeConversion.stringToMapFormats(msgStr);
        var receiveMessageInfo = DataTypeConversion.stringToViewModel(msgStr, ReceiveMessage.class);
        if (receiveMessageInfo != null) {
            var messageType = receiveMessageInfo.messagetype;
            if (messageType != null) {
                switch (messageType) {
                    case "historymessage":
                        historyMessage(session, receiveMessageInfo);
                        return;
                    case "closehistorymessage":
                        closehistorymessage(session, receiveMessageInfo);
                        return;
                    case "bufferfile":
                        bufferFileTextMessage(session, sessionId, msgMap, receiveMessageInfo);
                        callNode(session, receiveMessageInfo);
                        return;
                    case "textmessage":
                        socketService.sendSuccessMapMessage(session, msgMap);
                        callOther(session, msgMap, receiveMessageInfo);
                        mongoDbService.insertMongoMessage(msgMap);
                        callNode(session, receiveMessageInfo);
                        return;
                }
            }
        }
        mongoDbService.insertMongoMessage(msgMap);
    }

    //处理历史记录
    private void historyMessage(WebSocketSession session, ReceiveMessage receiveMessageInfo) {
        var guid = receiveMessageInfo.getGuid();
        var boguid = receiveMessageInfo.getBoguid();
        var logname = receiveMessageInfo.getCzman();
        var listMap = new ArrayList<Map<String, Object>>();
        if (boguid != null && guid != null) {
            mongoDbService.deleteMongoNodeMessage(logname, boguid, guid);
            listMap = mongoDbService.getMongoMessageByGuid(boguid, guid);
            socketService.changeSessionGuid(session, guid);
        }
        var msgMap = new HashMap<String, Object>();
        msgMap.put("boguid", boguid);
        msgMap.put("guid", guid);
        msgMap.put("messagetype", "historymessage");
        msgMap.put("datalist", listMap);
        socketService.sendSuccessMapMessage(session, msgMap);
    }

    //关闭历史记录
    private void closehistorymessage(WebSocketSession session, ReceiveMessage receiveMessageInfo) {
        var guid = receiveMessageInfo.getGuid();
        var boguid = receiveMessageInfo.getBoguid();
        var listMap = new ArrayList<Map<String, Object>>();
        if (boguid != null && guid != null) {
            socketService.changeSessionGuid(session, -1);
        }
    }

    //at在线用户
    private void callOther(WebSocketSession session, Map<String, Object> msgMap, ReceiveMessage receiveMessageInfo) {
        var callList = receiveMessageInfo.getCalllist();
        socketService.sendMessageByGuid(session, msgMap, callList);

        if (callList != null) {
            var callListNew = new ArrayList<>(new HashSet<>(callList));
            for (CallUser callUser : callListNew) {
                var callLogname = callUser.getLogname();
                var isCall = socketService.callOnlineSessionByLogname(callLogname, msgMap);
                if (!isCall) {
                    mongoDbService.insertMongoCallMessage(callLogname, msgMap);
                }
            }
        }
    }

    //at节点用户
    private void callNode(WebSocketSession session, ReceiveMessage receiveMessageInfo) {
        var nodeList = receiveMessageInfo.getNodelist();
        if (nodeList != null && nodeList.size() > 0) {
            var guid = receiveMessageInfo.getGuid();
            var boguid = receiveMessageInfo.getBoguid();
            var czman = receiveMessageInfo.getCzman();
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("guid", guid);
            msgMap.put("boguid", boguid);
            msgMap.put("messagetype", "jobinfomessage");

            var nodeListNew = new ArrayList<>(new HashSet<>(nodeList));
            for (NodeUser nodeUser : nodeListNew) {
                var nodeLogname = nodeUser.getLogname();
                if (nodeLogname != czman) {
                    msgMap.put("logname", nodeLogname);
                    var isRead = socketService.callOnlineSessionByLogname(nodeLogname, msgMap, guid);
                    if (!isRead) {
                        if (!mongoDbService.existsMongoNodeMessage(nodeLogname, boguid, guid)) {
                            mongoDbService.insertMongoNodeMessage(nodeLogname, boguid, guid);
                        }
                    }
                }
            }
        }
    }

    //region 文件消息
    //文件类消息
    private void bufferFileTextMessage(WebSocketSession session, String sessionId, Map<String, Object> msgMap, ReceiveMessage receiveMessageInfo) {
        var process = receiveMessageInfo.process;
        if (process == null) return;

        switch (process) {
            case "begin":
                while (fileByteBufferMap.containsKey(sessionId)) {
                    try {
                        Thread.sleep(1000);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                var fileByteBufferInfo = new FileByteBuffer();
                fileByteBufferInfo.setFileName(receiveMessageInfo.fileName);
                fileByteBufferInfo.setSessionId(sessionId);
                fileByteBufferInfo.setCurrentChunk(0);
                fileByteBufferInfo.setChunkCount(receiveMessageInfo.chunkCount);
                fileByteBufferInfo.setChunkSize(receiveMessageInfo.chunkSize);
                fileByteBufferInfo.setIsError(false);
                fileByteBufferInfo.setPercent(0);
                fileByteBufferMap.put(sessionId, fileByteBufferInfo);
                return;
            case "end":
                var fileByteBufferOldInfo = fileByteBufferMap.get(sessionId);
                if (fileByteBufferOldInfo != null) {
                    if (fileByteBufferOldInfo.getIsError()) {
                        msgMap.put("messagetype", "bufferfile");
                        socketService.sendSuccessMapMessage(session, msgMap);
                    } else {

                        msgMap.put("fileAddress", fileByteBufferOldInfo.getFileAddress());
                        mongoDbService.insertMongoMessage(msgMap);

                        SaveImageToApi(fileByteBufferOldInfo, receiveMessageInfo);

                        msgMap.put("messagetype", "bufferfile");
                        socketService.sendSuccessMapMessage(session, msgMap);
                        socketService.sendMessageByGuid(session, msgMap, null);
                    }
                    fileByteBufferMap.remove(sessionId);
                }
                return;
        }
    }

    //保存文件到api
    private void SaveImageToApi(FileByteBuffer fileByteBufferOldInfo, ReceiveMessage receiveMessageInfo) {
        var source = receiveMessageInfo.getTypename();
        if (source == null || source == "") return;

        var image = new Image();
        image.setDom("kcdoc");
        image.setMawb(receiveMessageInfo.getMawb());
        image.setHawb("");
        image.setJobno(receiveMessageInfo.getPono());
        image.setFileaddress(fileByteBufferOldInfo.getFileAddress());
        image.setFtpaddress(fileByteBufferOldInfo.getFtpAddress());
        image.setFilename(fileByteBufferOldInfo.getFileName());
        image.setRel_filename(fileByteBufferOldInfo.getFileName());
        image.setAddman(receiveMessageInfo.getCzman());
        image.setAdddate(LocalDateTime.now());
        image.setReady01(receiveMessageInfo.getGroupid());
        image.setFileType(40);
        image.setSource(source);
        imageClientService.postImage(image);
    }

    //文件流
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        var sessionId = session.getId();
        var binaryMsg = (BinaryMessage) message;
        var binary = binaryMsg.getPayload();
        var fileByteBufferInfo = fileByteBufferMap.get(sessionId);
        if (fileByteBufferInfo != null && !fileByteBufferInfo.getIsError()) {
            try {
                var uploadStatus = SaveFtpFile(fileByteBufferInfo, binary);
                {
                    if (uploadStatus.getSuccess()) {
                        var currentChunk = fileByteBufferInfo.getCurrentChunk();
                        fileByteBufferInfo.setCurrentChunk(currentChunk + 1);
                        var percentNew = uploadStatus.getPercent() == 100 ? 100 : (uploadStatus.getPercent() / 10 % 10) * 10;
                        var percentOld = fileByteBufferInfo.getPercent();
                        if (percentNew != percentOld) {
                            fileByteBufferInfo.setPercent(percentNew);
                            fileByteBufferInfo.setFileAddress(uploadStatus.getFileaddress());
                            fileByteBufferInfo.setFtpAddress(uploadStatus.getFtpaddress());
                            socketService.sendFileByteMessage(session, fileByteBufferInfo);
                        }
                    } else {
                        fileByteBufferInfo.setIsError(true);
                        socketService.sendFileByteMessage(session, fileByteBufferInfo);
                    }
                }
            } catch (Exception e) {
                fileByteBufferInfo.setIsError(true);
                socketService.sendFileByteMessage(session, fileByteBufferInfo);
            }
        }
    }

    //保存追加Ftp文件
    private UploadStatus SaveFtpFile(FileByteBuffer fileByteBuffer, ByteBuffer binary) {
        var result = new UploadStatus();
        result.setSuccess(false);
        var fileName = fileByteBuffer.fileName;
        var chunkSize = fileByteBuffer.getChunkSize();
        var chunkCount = fileByteBuffer.getChunkCount();
        var currentChunk = fileByteBuffer.getCurrentChunk();
        try {
            var toMultipartFile = new MockMultipartFile(fileName, binary.array());
            var returnResult = FileUploadImpl.saveFile(toMultipartFile, fileName, currentChunk, chunkCount, chunkSize);
            if (returnResult != null) {
                var objectMapper = new ObjectMapper();
                result = objectMapper.convertValue(returnResult.getResultdata(), UploadStatus.class);
            }
        } catch (Exception e) {
            result.setMessage(e.toString());
        }
        return result;
    }

    //保存追加文件
    private void SaveFile(FileByteBuffer fileByteBuffer, ByteBuffer binary) {
        try {
            var tmpPathArr = new String[]{System.getProperty("user.dir"), "static", "socketFile", String.valueOf(System.currentTimeMillis()), fileByteBuffer.fileName};
            var destNew = String.join("\\", tmpPathArr);
            var dest = fileByteBuffer.fileAddress == null ? destNew : fileByteBuffer.fileAddress;
            fileByteBuffer.fileAddress = dest;
            SaveFilePath(dest);

            RandomAccessFile raf = new RandomAccessFile(dest, "rw");
            long fileLength = raf.length();
            raf.seek(fileLength);
            raf.write(binary.array());
            raf.close();
            binary.clear();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //保存文件目录
    private void SaveFilePath(String address) {
        var path = Paths.get(address).getParent().toAbsolutePath().normalize();
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    //endregion

    /**
     * 连接出错会调用
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws IOException {
        socketService.removeOnlineSession(session);
    }

    /**
     * 连接关闭会调用
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws IOException {
        socketService.removeOnlineSession(session);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private void sendOnlineMessage(OnlineSession onLineSession) {
        var listMap = mongoDbService.getMongoCallMessage(onLineSession.getLogName());
        for (Map<String, Object> msgMap : listMap) {
            socketService.sendSuccessMapMessage(onLineSession.session, msgMap);
        }
    }

}