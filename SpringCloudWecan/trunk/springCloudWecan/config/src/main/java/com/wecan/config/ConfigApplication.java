package com.wecan.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@EnableConfigServer
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.wecan"})
@ComponentScan(basePackages = {"com.wecan"})
public class ConfigApplication {
    public static void main(String[] args) {

        SpringApplication.run(ConfigApplication.class, args);
    }
}
