package com.wecan.websocket.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class NodeUser {
    @ApiModelProperty(position = 1, example = "admin")
    public String logname;
}
