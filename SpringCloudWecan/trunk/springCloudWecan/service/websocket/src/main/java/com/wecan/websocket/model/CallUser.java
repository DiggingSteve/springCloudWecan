package com.wecan.websocket.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;

@Data
public class CallUser {
    @ApiModelProperty(position = 1, example = "admin")
    public String logname;
    @ApiModelProperty(position = 10, example = "[1,2,3]")
    public ArrayList<Long> sidList;
}
