/**
 * @description:
 * @author: yaodui
 * @time: 2021/12/2 14:28
 */
package com.wecan.fee.rabbitmq;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wecan.commonutils.commonClass.http.HttpClient;
import com.wecan.commonutils.commonClass.util.LambdaUtil;
import com.wecan.daofee.service.impl.FeeAircompanyServiceImpl;
import com.wecan.fee.model.dto.MycMscDto;
import com.wecan.fee.model.dto.MycResultDto;
import com.wecan.modeldbo.airfreight.fee.FeeAircompany;
import lombok.var;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.List;


public class Consumer {

    @Autowired
    FeeAircompanyServiceImpl airComDao;

    @Value("${mycUrl}")
    private String updateMycUrl;


    @RabbitListener(queues = "${spring.rabbitmq.fee.updateMsc}")
    public void msg(String msg) {
        MycMscDto data = JSON.parseObject(msg, MycMscDto.class);
        String url = "";
        var threeCodeArr=data.getThreeCode().split(",");
        for(int i=0;i<threeCodeArr.length;i++){
            String trheeCode=threeCodeArr[i];
             url = updateMycUrl;
            url = url + String.join("&", "area=" + data.getArea(), "mawbthreecode=" + trheeCode, "sfg=" + data.getSfg(), "mawbmdg=" + data.getMdg(), "hbrq=" + data.getHbrq());
            String result=HttpClient.getDataByUrl(url, null);
            List<MycResultDto> list=(ArrayList<MycResultDto>) JSON.parseObject(result, new TypeReference<List<MycResultDto>>(){});
            if(list.stream().count()==0)return;
            var obj=new FeeAircompany();
            LambdaUtil.forEach(0,list,(item,index)->{
                MycResultDto r=list.get(index);

                if(r.itemsename.equals("MYC")){


                }
                else if(r.itemsename.equals("MSC")){

                }

            });
            var query=new LambdaQueryWrapper<FeeAircompany>();
            query.eq(FeeAircompany::getFeeid,data.getFeeid());
            airComDao.update(obj,query);
        }

    }
}
