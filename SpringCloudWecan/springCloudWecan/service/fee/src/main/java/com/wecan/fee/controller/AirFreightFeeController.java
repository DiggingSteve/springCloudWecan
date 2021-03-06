package com.wecan.fee.controller;

import com.wecan.commonutils.commonClass.aop.response.ResponseResultBody;
import com.wecan.fee.base.BaseApiController;
import com.wecan.modeldbo.airfreight.fee.FreightFee;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.modelview.model.vo.fee.input.InputDelFee;
import com.wecan.modelview.model.vo.fee.input.InputQueryFeeRouting;
import com.wecan.modelview.model.vo.fee.input.Insert;
import com.wecan.fee.service.IAirFreightFee;
import com.wecan.modelview.model.vo.fee.output.OutputFreightFeeList;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.util.HashMap;
import java.util.List;

@ResponseResultBody
@RestController
@RequestMapping("/AirFreightFee")
public class AirFreightFeeController extends BaseApiController {

    final
    IAirFreightFee feeService;

    public AirFreightFeeController(IAirFreightFee feeService) {
        this.feeService = feeService;
    }


    @RequestMapping("/save")
    @POST
    public InputAirFreightFee save(@RequestBody @Validated(Insert.class) InputAirFreightFee data)  {
        feeService.saveFee(data);
        return data;
    }

    @RequestMapping("/edit")
    @POST
    public InputAirFreightFee edit(@RequestBody @Validated(Insert.class) InputAirFreightFee data)  {
        feeService.editFee(data);
        return data;
    }

    @RequestMapping("/delete")
    @POST
    public Boolean delete(@RequestBody InputDelFee data){
        feeService.deleteFee(data.feeid);
        return true;
    }

    @RequestMapping("/deleteByJson")
    @POST
    public Boolean deleteByJson(@RequestBody InputDelFee data){
        feeService.deleteFee(data.json);
        return true;
    }

    @RequestMapping("/getList")
    @GET
    public List<OutputFreightFeeList> getList(@RequestParam(name = "json") String json, @RequestParam(name="pageType",required = false) String pageType) {
        if(StringUtils.isNotEmpty(pageType)){
             return feeService.getList(json, pageType);
        }
        else return feeService.getList(json);
    }

    /***
     * ?????????????????????
     */

    @RequestMapping("/getFeeGroup")
    @GET
    public HashMap<Long, HashMap<String, Object>> getFeeGroup(@RequestParam(name = "json") String json) {
        return feeService.getDetail(json);
    }

    /**
     * ???????????????
     */

    @RequestMapping("/getDirectFee")
    @GET
    public FreightFee getDirectFee(@RequestParam(name = "json") String json) {
        return feeService.getDirectFee(json);
    }

    // ????????????orlist???????????????[] ??? [] ???url??????????????? ???????????????post
    @RequestMapping("/getRouting")
    @POST
    public List<OutputFreightRouting> getRouting(
            @RequestBody InputQueryFeeRouting data

                                                ){
        return feeService.getRouting(data.getJson());
    }
}
