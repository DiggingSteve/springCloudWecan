package com.wecan.modeldbo.log;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("log4j2")
public class Log4j2 implements Serializable {

    public String logger;

    public String level;

    public String thread;

    public String message;

    public String context;

    public String thrown;

}
