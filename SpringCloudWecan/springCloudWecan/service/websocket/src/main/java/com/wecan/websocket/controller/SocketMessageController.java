package com.wecan.websocket.controller;

import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.websocket.model.CallMessage;
import com.wecan.websocket.service.SocketMessageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@Api(value = "API - SocketMessageController")
@Data
@RestController
@Slf4j
public class SocketMessageController {
    private static SocketMessageService socketMessageService;

    @Autowired
    public void setSocketMessageService(SocketMessageService socketMessageService) {
        this.socketMessageService = socketMessageService;
    }


    @ApiOperation(value = "发送socket", notes = "发送socket")
    @RequestMapping(value = "/postSocket", method = RequestMethod.POST)
    @ApiImplicitParam(name = "CallMessage", value = "message表单", dataType = "CallMessage")
    public ReturnResult postSocket(@RequestBody CallMessage callMessage) {
        var result = socketMessageService.postSocket(callMessage);
        result.setResultdata(DataTypeConversion.objectToMapFormats(callMessage));
        return result;
    }
}


