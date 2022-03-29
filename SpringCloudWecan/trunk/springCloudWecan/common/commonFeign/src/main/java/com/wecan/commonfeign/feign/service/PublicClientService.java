package com.wecan.commonfeign.feign.service;

import com.wecan.modelview.model.vo.customer.output.OutputFidCache;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@Service
@FeignClient(name = "public", url = "${url.gatewayUrl}")
public interface PublicClientService {
    @RequestMapping(value = "/public/api/PubBank", method = RequestMethod.GET)
    String getPubBank();

    @RequestMapping(value = "/public/api/PubCustom?type=inputall&comxz=-1&area=&timestamp=0&system=", method = RequestMethod.GET)
    List<OutputFidCache> getFidCache();

}
