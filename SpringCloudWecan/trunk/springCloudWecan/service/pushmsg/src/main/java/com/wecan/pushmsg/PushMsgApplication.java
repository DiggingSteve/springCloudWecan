package com.wecan.pushmsg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.wecan.commonfeign.feign"})
@ComponentScan(value = "com.wecan")
public class PushMsgApplication {

    public static void main(String[] args) {
        SpringApplication.run(PushMsgApplication.class, args);
    }

}
