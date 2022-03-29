/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/13 16:48
 */
package com.wecan.modelview.model.vo.file.output;

import lombok.Data;

@Data
public class UploadStatus {

    public UploadStatus() {
        success = true;
        message = "";
        ftpaddress = "";
        fileaddress = "";
        percent = 0;
    }

    public UploadStatus(Boolean success, String message, int percent) {
        this.success = success;
        this.message = message;
        this.percent = percent;
    }

    ///百分比
    public int percent;

    public Boolean success;

    public String message;

    public String ftpaddress;

    public String fileaddress;
}
