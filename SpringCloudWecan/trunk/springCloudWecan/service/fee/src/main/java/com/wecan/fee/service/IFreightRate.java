package com.wecan.fee.service;

import com.wecan.fee.model.dto.FreightFlyPriceDto;

import java.time.LocalDateTime;

public interface IFreightRate extends IBaseService {

    /**
     * @param sfg:sfg
     * @param mdg:sfg
     * @param dt: 时间格式:yyyy-MM-dd HH:mm:ss
     * @param type: 时间类型:-1.减 0.减1加1,1.加
     * @param gid:gysid
     * @param level: 客户等级
     * @description: 运价查询
     * @return:
     * @author: hzh
     */
    FreightFlyPriceDto getFlyPrice(String sfg, String mdg, LocalDateTime dt, Integer type, Integer gid, String level);

    /**
    *
    * @param gid: aaa
    * */
    Object getUpdatePrice(Integer gid, String level);

}
