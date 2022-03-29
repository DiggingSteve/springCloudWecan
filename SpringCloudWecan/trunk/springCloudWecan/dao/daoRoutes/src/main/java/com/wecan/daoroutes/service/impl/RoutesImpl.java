package com.wecan.daoroutes.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wecan.daoroutes.mapper.RoutesMapper;
import com.wecan.daoroutes.service.RoutesService;
import com.wecan.modeldbo.routes.Routes;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author wujingjing
 * @since 2021-05-07
 */
@Service
public class RoutesImpl extends ServiceImpl<RoutesMapper, Routes> implements RoutesService {

}
