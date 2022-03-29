package com.wecan.test.service.impl;

import com.wecan.test.entity.Db;
import com.wecan.test.mapper.DbMapper;
import com.wecan.test.service.IDbService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Database privileges 服务实现类
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Service
public class DbServiceImpl extends ServiceImpl<DbMapper, Db> implements IDbService {

}
