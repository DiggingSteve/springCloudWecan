/**
 * @description:
 * @author: yaodui
 * @time: 2022/3/25 11:02
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
import java.util.Objects;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("Ex_EmailNotify")
@Table(name = "Ex_EmailNotify")
@Entity
public class EmailNotify extends Parent {
    @Column(name = "lastTimestamp",columnDefinition = "bigint COMMENT '发送邮件前的最后一次更新时间戳'")
    public Long lastTimestamp;

    public Integer fid;

    @Column(name = "area",columnDefinition = "VARCHAR(20) COMMENT '地区'")
    public String area;

    @Column(name = "isSend",columnDefinition = "int COMMENT '1是2否'")
    public Integer isSend;

    @Override
    public int hashCode() {
        return Objects.hash(this.fid)^Objects.hash(this.area);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (obj instanceof EmailNotify) {
            EmailNotify d = (EmailNotify) obj;
            return Objects.equals(this.fid, d.getFid())&&Objects.equals(this.area,d.getArea());
        }
        return false;


    }

}
