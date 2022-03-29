package com.wecan.fee.controller;

import com.wecan.commonutils.commonClass.aop.response.ResponseResultBody;
import com.wecan.fee.base.BaseApiController;
import com.wecan.fee.model.dto.FreightFlyPriceDto;
import com.wecan.fee.service.IFreightRate;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.var;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Service
@ResponseResultBody
@RestController
@RequestMapping("/FreightRate")
@Api(value = "FreightRate")
public class FreightRateController extends BaseApiController {

    private final IFreightRate fr;
    public FreightRateController(IFreightRate fr) {
        this.fr = fr;
    }

    @GetMapping("/GetFlyPrice")
    @ApiOperation(value = "运价查询", notes = "")
    //@ApiImplicitParam(name = "dt", value = "日期", required = true, dataType = "datetime yyyy-MM-dd HH:mm:ss")
    //@ApiImplicitParam(name = "type", value = "类型:0.减,1.加", required = true, dataType = "int ")
    public FreightFlyPriceDto GetFlayPrice(@RequestParam @ApiParam("始发港") String sfg,
                                           @RequestParam @ApiParam("目的港") String mdg,
                                           @RequestParam @ApiParam(value = "时间格式:yyyy-MM-dd HH:mm:ss")
                                   @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime dt,
                                           @RequestParam @ApiParam(value = "时间类型:-1.减 0.减1加1,1.加") Integer type,
                                           @RequestParam(required = false,defaultValue ="-1" ) @ApiParam(value = "gid") Integer gid,
                                           @RequestParam @ApiParam(value ="客户等级:A类,B类,C类,散客" ) String level){
        var result=fr.getFlyPrice(sfg,mdg,dt,type,gid,level);
        return  result;
    }

    @GetMapping("/GetPublishPrice")
    @ApiOperation(value = "新发布运价对比查询", notes = "")
    public Object GetUpateFee(@RequestParam(required = false,defaultValue ="-1" ) @ApiParam(value = "gid") Integer gid,
                              @RequestParam @ApiParam(value ="客户等级:A类,B类,C类,散客" ) String level)
    {
        return  fr.getUpdatePrice(gid,level);
    }
}
