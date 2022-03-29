package com.wecan.test.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author test
 * @since 2021-04-29
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("Ex_FeeAircompany")
public class FeeAircompany implements Serializable {

    private static final long serialVersionUID = 1L;

    private String twocode;

    private Long feeid;


}
