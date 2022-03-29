package com.wecan.modelview.logger;

import lombok.Data;

import java.io.Serializable;

@Data
public class LogData implements Serializable {

    public String logger;

    public String level;

    public String thread;

    public String message;

    public String context;

    public String thrown;

    public String application;

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



}
