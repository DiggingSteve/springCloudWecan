package com.wecan.modelview.pushmsg;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@ApiModel(description = "Sms表单")
@Data
public class SmsData implements Serializable {

    @ApiModelProperty(value = "地址", name = "to", required = true)
    @NotBlank(message = "地址不允许为空,请输入")
    public String to;

    @ApiModelProperty(value = "内容", name = "content", required = true)
    @NotBlank(message = "内容不允许为空,请输入")
    public String content;

}
