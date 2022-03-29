package com.wecan.commonutils.commonClass.yml;


import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
public class GateWay {
    private String test;
    private Map<String,String> area;
}
