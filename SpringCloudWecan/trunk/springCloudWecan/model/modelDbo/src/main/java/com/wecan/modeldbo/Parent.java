package com.wecan.modeldbo;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * model公共方法 guid/timestamp
 */
@Data
@MappedSuperclass//一定要写这个不然父类中的字段注解不会被子类实例扫描到
public abstract class Parent implements Serializable {

    @TableId(value = "guid", type = IdType.NONE)
    @Id
    private Long guid;

    public Long getGuid() {
        if (guid == null) {
            this.guid = SnowflakeIdWorker.generateId();
            return this.guid;
        }
        return guid;
    }

    public void setGuid(Long guid) {
        this.guid = guid == null ? SnowflakeIdWorker.generateId() : guid;
    }

    private Long timestamp;

    public Long getTimestamp() {
        if (timestamp == null) {
            return System.currentTimeMillis();
        }
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp == null ? System.currentTimeMillis() : timestamp;
    }

    @TableField(value = "isdel", fill = FieldFill.INSERT) // 这是mybatis-plus 用的注解
    @Column(name = "isdel", columnDefinition = "int COMMENT '1是2否'") // jpa用的注释
    @TableLogic
    private int isdel;



}
