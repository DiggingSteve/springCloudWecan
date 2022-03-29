package com.wecan.daolog.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wecan.modeldbo.log.Log4j2;
import org.apache.ibatis.annotations.Param;

/**
 * 继承Mapper接口 实现crud
 */
public interface LogDataMapper extends BaseMapper<Log4j2> {
    void createTable(@Param("tableName") String tableName);
}