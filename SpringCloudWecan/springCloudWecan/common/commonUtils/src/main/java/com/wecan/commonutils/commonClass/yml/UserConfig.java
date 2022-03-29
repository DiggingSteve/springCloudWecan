package com.wecan.commonutils.commonClass.yml;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "userconfig")
public class UserConfig {
    private GateWay gateway;

    private String test;

    private String test2;

}



