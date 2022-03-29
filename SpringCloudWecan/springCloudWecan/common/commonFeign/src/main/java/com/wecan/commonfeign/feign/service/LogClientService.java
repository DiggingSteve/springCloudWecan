package com.wecan.commonfeign.feign.service;

import com.wecan.commonfeign.feign.service.impl.LogClientFallImpl;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modelview.logger.LogData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@FeignClient(value = "log", fallback = LogClientFallImpl.class)
@Service
public interface LogClientService {
    @RequestMapping(value = "postLog", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
    ReturnResult insertLogData(LogData logData);
}
