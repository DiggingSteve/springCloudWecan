package com.wecan.modeldbo.price;

import com.baomidou.mybatisplus.annotation.TableName;
import com.wecan.modeldbo.Parent;
import lombok.Data;
import lombok.extern.log4j.Log4j;

import java.sql.Timestamp;

@Data
@TableName("price")
public class Price extends Parent {
    private String price;

    private String remark;

    private Timestamp hbrq;
}
