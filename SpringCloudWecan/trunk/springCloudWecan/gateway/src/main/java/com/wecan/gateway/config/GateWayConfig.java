package com.wecan.gateway.config;

import com.wecan.daoroutes.mapper.RoutesMapper;
import com.wecan.gateway.filter.HttpPublicFilter;
import com.wecan.gateway.filter.ImageWebapiFilter;
import com.wecan.gateway.filter.PublicWebapiFilter;
import com.wecan.gateway.filter.TokenCheckFilter;
import com.wecan.modeldbo.routes.Routes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.GatewayFilterSpec;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;


@Configuration

public class GateWayConfig {
    @Autowired
    private RoutesMapper routesMapper;

    @Autowired
    private TokenCheckFilter tokenGatewayFilter;

    @Autowired
    private PublicWebapiFilter publicWebapiFilter;

    @Autowired
    private ImageWebapiFilter imageWebapiFilter;

    @Autowired
    private HttpPublicFilter httpPublicFilter;

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {

        List<Routes> gatewayRouteList = routesMapper.selectList(null);
        RouteLocatorBuilder.Builder routes = builder.routes();
        gatewayRouteList.forEach(gatewayRoute -> {
            routes.route(r -> r.path(gatewayRoute.getPath())
                    .filters(f -> changeFilters(f, gatewayRoute))
                    .uri(gatewayRoute.getUri())
            );
        });
        return routes.build();
    }

    private GatewayFilterSpec changeFilters(GatewayFilterSpec f, Routes gatewayRoute) {

        f.stripPrefix(gatewayRoute.getStripPrefix());

        Integer checkToken = gatewayRoute.getCheckToken();
        if (checkToken == 1) {
            f.filter(tokenGatewayFilter);
        }

        String filter = gatewayRoute.getFilter();
        if (!filter.equals("")) {
            Arrays.asList(filter.split(",")).forEach(filterName -> {
                switch (filterName) {
                    case "publicWebapiFilter":
                        f.filter(publicWebapiFilter);
                        break;
                    case "imageWebapiFilter":
                        f.filter(imageWebapiFilter);
                        break;
                    case "httpPublicFilter":
                        f.filter(httpPublicFilter);
                        break;
                }
            });
        }

        String hystrix = gatewayRoute.getHystrix();
        String fallback = gatewayRoute.getFallback();
        if (!hystrix.equals("")) {
            f.hystrix(config -> config.setName(hystrix).setFallbackUri(fallback));
        }
        return f;
    }

}
