/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 16:34
 */
package com.wecan.fee.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wecan.commonutils.commonClass.aop.response.ResponseResultBody;
import com.wecan.fee.base.BaseApiController;
import com.wecan.fee.service.ITruckFee;

import com.wecan.modeldbo.airfreight.fee.TruckFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckFee;
import com.wecan.modelview.model.vo.fee.input.Insert;

import com.wecan.modelview.model.vo.fee.output.OutputTruckDetail;
import com.wecan.modelview.model.vo.fee.output.OutputTruckFee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.util.List;

@ResponseResultBody
@RestController
@RequestMapping("/TruckFee")
public class TruckFeeController extends BaseApiController {
    @Autowired
    ITruckFee feeService;

    @RequestMapping("/save")
    @POST
    public List<TruckFee> save(@RequestBody @Validated(Insert.class) List<InputTruckFee> data) throws JsonProcessingException {
      return   feeService.saveFee(data,false);
    }
    @RequestMapping("/edit")
    @POST
    public  List<TruckFee>  edit(@RequestBody @Validated(Insert.class) List<InputTruckFee> data) throws JsonProcessingException {
        return feeService.editFee(data,false);

    }

    @RequestMapping("/del")
    @POST
    public String del(@RequestBody @Validated(Insert.class) List<InputTruckFee> data) throws JsonProcessingException {
        feeService.delFee(data);
        return "";
    }

    @RequestMapping("/getList")
    @GET
    public List<OutputTruckFee> getList(@RequestParam(name = "json", required = true) String json) {
        return feeService.getList(json);
    }

    /**
     *
     *
     * @description:
     * @param json 在应收费用中查找应收id对应的记录
     * @return: OutputTruckDetail
     * @author: yaodui

     */
    @RequestMapping("/getFeeDetail")
    @GET
    public OutputTruckDetail loadFee(@RequestParam(name = "json") String json) {
        return feeService.getFeeDetail(json);
    }

    @RequestMapping("/syncToWagein")
    @POST
    public String syncToWagein(@RequestBody @Validated(Insert.class) List<InputTruckFee> data) throws JsonProcessingException {
        feeService.syncToWagein(data);
        return "";
    }
}
