package com.wecan.modelview.pushmsg;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@ApiModel(description = "Mail表单")
@Data
public class MailData implements Serializable {

    @ApiModelProperty(value = "地址", name = "to", required = true)
    @NotEmpty(message = "地址不允许为空,请输入")
    public String to;

    @ApiModelProperty(value = "主题", name = "subject", required = true)
    @NotEmpty(message = "主题不允许为空,请输入")
    public String subject;

    @ApiModelProperty(value = "内容", name = "content", required = true)
    @NotEmpty(message = "内容不允许为空,请输入")
    public String content;

}
