package com.wecan.websocket.model;

import lombok.Data;

import java.util.ArrayList;

@Data
public class ReceiveMessage {
    public String messagetype;

    public Long boguid;

    public Long guid;

    public String mawb;

    public String pono;

    public String czman;

    public String logExtraData;
    //文件类型
    public String fileName;

    public Integer fileSize;

    public String fileAddress;

    public String process;

    public Integer chunkCount;

    public Integer chunkSize;


    //文本类型
    public String content;

    public String groupid;

    public String typename;

    public ArrayList<CallUser> calllist;

    public ArrayList<NodeUser> nodelist;

}

