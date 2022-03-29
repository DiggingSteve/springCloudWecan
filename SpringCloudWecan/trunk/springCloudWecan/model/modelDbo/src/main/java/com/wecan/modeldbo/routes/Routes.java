package com.wecan.modeldbo.routes;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@Data
@TableName("routes")
public class Routes {

    @TableId(value = "id", type = IdType.NONE)
    private Integer id;

    private String path;

    private String uri;

    private String hystrix;

    private String fallback;

    private Integer checkToken;

    private Integer stripPrefix;

    private String Filter;
}
