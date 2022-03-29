package com.wecan.commonfeign.feign.service.impl;

import com.wecan.commonfeign.feign.service.FileUploadClientService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.model.vo.file.output.UploadStatus;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * feign触发熔断后的返回值重写方法
 */
@Component
@Slf4j
public class FileUploadClientFallImpl implements FileUploadClientService {
    @Override
    public ReturnResult up(MultipartFile file, String fileName, String path, int currentChunk, int chunkCount, int chunkSize) {
        log.error("FileUploadClientFallImpl", path + fileName);
        var result = ReturnResult.error();
        result.setResultmessage("feignError");
        return result;
    }
}
