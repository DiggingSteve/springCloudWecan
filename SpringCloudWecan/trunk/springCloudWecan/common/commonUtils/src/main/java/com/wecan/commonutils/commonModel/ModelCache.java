package com.wecan.commonutils.commonModel;

import lombok.Data;

import java.io.Serializable;
import java.lang.reflect.Type;

@Data
/**
 * 缓存方法
 */
public class ModelCache implements Serializable {
    public String name;

    public Type type;
}
