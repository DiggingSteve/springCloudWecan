package com.wecan.websocket.config;

import com.wecan.websocket.service.WebSocket;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketAutoConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // 注册websocket组件 添加处理器和拦截器
        // websocket是websocket服务器的请求路径可以自己定义
        registry.addHandler(new WebSocket(), "/websocket")
                // 指定自定义拦截器
                // .addInterceptors(new WebSocketInterceptor())
                // 允许跨域
                .setAllowedOrigins("*");
        // 在某些低版本的浏览器中不支持websocket可以用sock-js替代
        registry.addHandler(new WebSocket(), "/sock-js")
                //.addInterceptors(new WebSocketInterceptor())
                .setAllowedOrigins("*")
                // 开启sockJs支持
                .withSockJS();
    }
}