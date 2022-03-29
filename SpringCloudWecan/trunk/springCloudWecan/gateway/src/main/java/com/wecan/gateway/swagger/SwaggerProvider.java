package com.wecan.gateway.swagger;

import com.wecan.daoroutes.mapper.RoutesMapper;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

/**
 * 重写Swagger配置类,用来聚合不同服务的Swagger Url
 */
@Component
@Primary
public class SwaggerProvider implements SwaggerResourcesProvider {

    public static final String API_URI = "/v2/api-docs";

    @Autowired
    private RoutesMapper routesMapper;

    @Override
    public List<SwaggerResource> get() {

        var gatewayRouteList = routesMapper.selectList(null);
        List<SwaggerResource> swaggerResourceList = new ArrayList<>();

        gatewayRouteList.forEach(route -> {
            var uri = route.getUri();
            if (uri.contains("lb:")) {
                var pathName = route.getPath().replace("/**", "");
                var path = pathName + API_URI;

                var swaggerResource = new SwaggerResource();
                swaggerResource.setName(pathName);
                swaggerResource.setLocation(path);
                swaggerResource.setSwaggerVersion("2.0");
                swaggerResourceList.add(swaggerResource);
            }
        });

        return swaggerResourceList;
    }
}
