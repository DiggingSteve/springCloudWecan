package com.wecan.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class GlobalConfig {
    //@Bean
    //@Order(-1)
    public GlobalFilter filterOne() {
        return (exchange, chain) -> {
            System.out.println("First pre filter");
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                System.out.println("third post filter");
            }));
        };
    }
}
