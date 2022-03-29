package com.wecan.websocket.model;

import lombok.Data;

import java.nio.ByteBuffer;

@Data
public class FileByteBuffer {
    public String sessionId;

    public String fileName;

    public String fileAddress;

    public String ftpAddress;

    public Integer currentChunk;

    public Integer chunkCount;

    public Integer chunkSize;

    public Integer percent;

    public Boolean isError;
}
