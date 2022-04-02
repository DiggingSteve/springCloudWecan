package com.wecan.fee.controller;

import com.wecan.commonutils.commonClass.aop.response.ResponseResultBody;
import com.wecan.fee.base.BaseApiController;
import com.wecan.fee.service.IAirFreightFee;
import com.wecan.modeldbo.airfreight.fee.FreightFee;
import com.wecan.modelview.model.vo.fee.input.*;
import com.wecan.modelview.model.vo.fee.output.OutputFreightFeeList;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import java.util.HashMap;
import java.util.List;

@ResponseResultBody
@RestController
@RequestMapping("/AirFreightFee")
@Api(value = "AirFreightFeeApi")
public class AirFreightFeeController extends BaseApiController {

    final
    IAirFreightFee feeService;

    public AirFreightFeeController(IAirFreightFee feeService) {
        this.feeService = feeService;
    }


    @RequestMapping(value = "/save", method = RequestMethod.POST)
    @ApiOperation(value = "保存", notes = "保存")
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
     * 编辑页获取信息
     */

    @RequestMapping("/getFeeGroup")
    @GET
    public HashMap<Long, HashMap<String, Object>> getFeeGroup(@RequestParam(name = "json") String json) {
        return feeService.getDetail(json);
    }

    /**
     * 获取直达价
     */

    @RequestMapping("/getDirectFee")
    @GET
    public FreightFee getDirectFee(@RequestParam(name = "json") String json) {
        return feeService.getDirectFee(json);
    }

    //第一版 因为传了orlist是个数组带[] 而 [] 是url保留字符串 所以只能用post
    //第二版 测试发现卡车段如果基于基港关联数据过多的话 查询传的时候会造成重复数据过多 视图中会重复查 所以将mdg额外传入
    //      先匹配mdg 再匹配ddg 否则对数据库不友好
    @RequestMapping("/getRouting")
    @POST
    public List<OutputFreightRouting> getRouting(
            @RequestBody InputQueryFeeRouting data

                                                ){
        return feeService.getRouting(data.getJson(),data.getMdg());
    }



    @ApiOperation(value = "经理审批", notes = "经理审批")
    @RequestMapping(value = "/approve",method = RequestMethod.POST)

    public Boolean approve(@RequestBody InputApprovalRecord data){
        return feeService.approve(data);
    }
}
