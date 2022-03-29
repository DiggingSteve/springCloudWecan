package com.wecan.commonfeign.feign.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Service
@FeignClient(name = "public", url = "${url.gatewayUrl}" )
public interface PublicClientService {
    @RequestMapping(value = "/public/api/PubBank", method = RequestMethod.GET)
    String getPubBank();
}
