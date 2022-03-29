/**
 * @description:
 * @author: yaodui
 * @time: 2021/11/25 13:45
 */
package com.wecan.modeldbo.sharding;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@TableName("t_order")
@Table(name = "t_order")
@Entity
public class Order extends Parent {
}
