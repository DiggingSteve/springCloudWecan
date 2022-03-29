package com.wecan.gateway.filter;

import com.ctc.wstx.util.StringUtil;
import com.wecan.commonutils.commonClass.format.DataTypeConversion;
import com.wecan.commonutils.commonClass.util.JwtUtils;
import lombok.var;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.xml.bind.DatatypeConverter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Component
public class TokenCheckFilter implements GatewayFilter, Ordered {

    @Override
    public int getOrder() {
        return 0;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerWebExchange build;
        {
//            var token = exchange.getRequest().getHeaders().getFirst("token");
//            var verifyTokenResult = JwtUtils.verifyToken(token);
//            try {
//                var userObj = verifyTokenResult.getDataByKey("user");
//                var userStr = userObj == null ? "" : userObj.toString();
//
//                ServerHttpRequest host = exchange.getRequest().mutate()
//                        .header("X-User-Info", userStr)
//                        // 中文字符需要编码
//                        .header("X-Real-Name", URLEncoder.encode("", "utf-8"))
//                        .build();
//                build = exchange.mutate().request(host).build();
//            } catch (UnsupportedEncodingException e) {
//                build = exchange;
//            }
            build = exchange;
        }
        return chain.filter(build);
    }
}