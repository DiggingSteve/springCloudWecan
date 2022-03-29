/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/23 17:05
 */
package com.wecan.shardingTest;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan({"com.wecan.modeldbo.sharding"})
@MapperScan("com.wecan.daofee")
@ComponentScan(value = "com.wecan")
public class ShardingTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShardingTestApplication.class, args);
    }
}
