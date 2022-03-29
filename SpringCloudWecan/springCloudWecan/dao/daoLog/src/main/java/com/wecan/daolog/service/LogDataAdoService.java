package com.wecan.daolog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.modeldbo.log.Log4j2;
import org.apache.ibatis.annotations.Param;

/**
 * 继承IService接口
 */
public interface LogDataAdoService extends IService<Log4j2> {
    void saveTable(@Param("tableName") String tableName);

    ReturnResult insertLog(String tableName, Log4j2 log4j2);
}
