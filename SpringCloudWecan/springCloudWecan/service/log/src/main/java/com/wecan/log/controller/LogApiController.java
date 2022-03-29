package com.wecan.log.controller;

import com.wecan.commonbase.base.BaseController;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.log.service.LogDataOperService;
import com.wecan.modelview.logger.LogData;
import lombok.Data;
import lombok.var;
import org.springframework.web.bind.annotation.*;
import io.swagger.annotations.*;

import javax.annotation.Resource;
import javax.validation.Valid;

@Api(value = "LogApi")
@RestController
@Data
public class LogApiController extends BaseController {
    private LogDataOperService logDataOperService;

    @Resource(name = "logDataOperate")
    public void setLogDataOperService(LogDataOperService logDataOperService) {
        this.logDataOperService = logDataOperService;
    }

    @RequestMapping(value = "postLog", method = RequestMethod.GET)
    public ReturnResult getLogData() throws InterruptedException {
        var logData = new LogData();
        logData.setLogger("test");
        logData.setThread("test");
        logData.setLevel("test");
        logData.setMessage("test");
        logData.setContext("test");
        logData.setThrown("test");
        logData.setApplication("test");
        return logDataOperService.insertLogToMongoDb(logData);
    }

    @ApiOperation(value = "日志", notes = "日志写入接口")
    @RequestMapping(value = "postLog", method = RequestMethod.POST)
    @ApiImplicitParam(name = "LogData", value = "日志表单", required = true, dataType = "LogData")
    public ReturnResult insert(@Valid @RequestBody LogData logData) {

        return logDataOperService.insertLogToMongoDb(logData);
    }
}


