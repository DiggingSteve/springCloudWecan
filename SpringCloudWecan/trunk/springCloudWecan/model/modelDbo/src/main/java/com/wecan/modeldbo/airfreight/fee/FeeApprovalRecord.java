/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/18 14:22
 */
package com.wecan.modeldbo.airfreight.fee;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_FeeApprovalRecord")
@Table(name = "Ex_FeeApprovalRecord")
@Entity
public class FeeApprovalRecord extends Parent {

    @Column(columnDefinition = "varchar(50)")
    private String addman;

    @Column(columnDefinition = "int")
    private Integer approvalStatus;

    private LocalDateTime addtime;

    @Column(columnDefinition = "varchar(200)")
    private String remark;
    //pending表的feeid
    private Long feeid;

}
