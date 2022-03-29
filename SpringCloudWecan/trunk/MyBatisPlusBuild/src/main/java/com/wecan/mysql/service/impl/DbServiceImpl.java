package com.wecan.mysql.service.impl;

import com.wecan.mysql.entity.Db;
import com.wecan.mysql.mapper.DbMapper;
import com.wecan.mysql.service.IDbService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Database privileges 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-04-28
 */
@Service
public class DbServiceImpl extends ServiceImpl<DbMapper, Db> implements IDbService {

}
