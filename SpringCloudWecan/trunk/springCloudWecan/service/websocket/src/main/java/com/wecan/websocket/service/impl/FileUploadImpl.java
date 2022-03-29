package com.wecan.websocket.service.impl;

import com.wecan.commonfeign.feign.service.FileUploadClientService;
import com.wecan.commonutils.commonClass.date.DateFormat;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadImpl {

    private static FileUploadClientService fileUploadClientService;

    @Autowired
    public void setFileUploadClientService(FileUploadClientService fileUploadClientService) {
        this.fileUploadClientService = fileUploadClientService;
    }

    public static ReturnResult saveFile(MultipartFile file, String fileName, int currentChunk, int chunkCount, int chunkSize) {
        var dateStr = DateFormat.getDateNowStr("yyyyMMdd");
        return fileUploadClientService.up(file, fileName, "Images/Socket/" + dateStr, currentChunk, chunkCount, chunkSize);
    }
}