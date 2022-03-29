package com.wecan.daolog.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.commonutils.commonClass.result.ReturnResult;
import com.wecan.daolog.MybatisPlusConfig;
import com.wecan.daolog.mapper.LogDataMapper;
import com.wecan.daolog.service.LogDataAdoService;
import com.wecan.modeldbo.log.Log4j2;
import lombok.var;
import org.springframework.stereotype.Service;

/**
 * 继承ServiceImpl mapper接口  实现 ILogDataService
 */
@Service("logDataAdo")
public class LogDataAdoImpl extends ServiceImpl<LogDataMapper, Log4j2> implements LogDataAdoService {

    public void saveTable(String tableName) {
        try {
            var logDataMapperService = this.baseMapper;
            logDataMapperService.createTable(tableName);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public ReturnResult insertLog(String tableName, Log4j2 log4j2) {
        MybatisPlusConfig.TABLE_NAME.set(tableName);
        var changeBool = this.save(log4j2);
        return changeBool ? ReturnResult.success() : ReturnResult.error();
    }
}
