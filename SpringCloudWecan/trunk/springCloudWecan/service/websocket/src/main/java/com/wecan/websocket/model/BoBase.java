package com.wecan.websocket.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class BoBase {

    @ApiModelProperty(position = 15)
    public String area;

    @ApiModelProperty(position = 20)
    public Long boguid;

    @ApiModelProperty(position = 20, example = "订单号")
    public String pono;

    @ApiModelProperty(position = 30)
    public Long guid;

    @ApiModelProperty(position = 30, example = "总单号")
    public String mawb;
}
