package com.wecan.gateway.filter;

import lombok.var;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import static org.springframework.cloud.gateway.support.ServerWebExchangeUtils.*;

@Component
public class HttpPublicFilter implements GatewayFilter, Ordered {

    @Override
    public int getOrder() {
        return 1;
    }


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getAttributes().put(GATEWAY_ALREADY_PREFIXED_ATTR, true);

        ServerHttpRequest req = exchange.getRequest();
        addOriginalRequestUrl(exchange, req.getURI());

        var newPath = "/" + req.getURI().getRawPath();

        ServerHttpRequest request = req.mutate()
                .path(newPath)
                .build();

        exchange.getAttributes().put(GATEWAY_REQUEST_URL_ATTR, request.getURI());

        var build = exchange.mutate().request(request).build();
        return chain.filter(build);
    }
}


