package com.wecan.commonfeign.feign.service.impl;

import com.wecan.commonfeign.feign.service.ImageClientService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modeldbo.image.Image;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * feign触发熔断后的返回值重写方法
 */
@Component
@Slf4j
public class ImageClientFallImpl implements ImageClientService {
    @Override
    public ReturnResult postImage(Image image) {
        log.error("ImageClientFallImpl", image);
        var result = ReturnResult.error();
        result.setResultmessage("feignError");
        return result;
    }
}
