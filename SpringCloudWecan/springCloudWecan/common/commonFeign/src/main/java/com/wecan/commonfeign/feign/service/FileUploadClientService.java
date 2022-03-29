package com.wecan.commonfeign.feign.service;

import com.wecan.commonfeign.feign.config.MultipartSupportConfig;
import com.wecan.commonfeign.feign.service.impl.FileUploadClientFallImpl;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.model.vo.file.output.UploadStatus;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(value = "FILE", fallback = FileUploadClientFallImpl.class, configuration = MultipartSupportConfig.class)
@Service
public interface FileUploadClientService {
    @RequestMapping(value = "/File/uploadFilePath",method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ReturnResult up(@RequestPart("file") MultipartFile file, @RequestParam("fileName") String fileName, @RequestParam("path") String path, @RequestParam("currentChunk") int currentChunk, @RequestParam("chunkCount") int chunkCount, @RequestParam("chunkSize") int chunkSize);
}
