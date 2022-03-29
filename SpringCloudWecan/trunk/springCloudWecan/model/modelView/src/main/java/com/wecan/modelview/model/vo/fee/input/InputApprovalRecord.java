/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/18 15:06
 */
package com.wecan.modelview.model.vo.fee.input;

import com.wecan.modeldbo.airfreight.fee.FeeApprovalRecord;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDateTime;

// 审批前端入参
@Data
@ApiModel
public class InputApprovalRecord extends InputBaseVo {




    @ApiModelProperty("状态")
    private Integer approvalStatus;


    private String remark;

    private Long feeid;

}
