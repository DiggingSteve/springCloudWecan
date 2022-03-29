package com.wecan.commonfeign.feign.service;

import com.wecan.commonfeign.feign.service.impl.ImageClientFallImpl;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modeldbo.image.Image;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Service
@FeignClient(name = "image", url = "${url.gatewayUrl}", fallback = ImageClientFallImpl.class)
public interface ImageClientService {
    @RequestMapping(value = "/image/api/image", method = RequestMethod.POST)
    ReturnResult postImage(Image image);
}
