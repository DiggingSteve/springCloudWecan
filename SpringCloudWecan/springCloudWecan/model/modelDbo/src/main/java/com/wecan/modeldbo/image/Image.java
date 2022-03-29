package com.wecan.modeldbo.image;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Image {
    public String dom;

    public String mawb;

    public String hawb;

    public String jobno;

    public String ftpaddress;

    public String fileaddress;

    public String filename;

    public String rel_filename;

    public String addman;

    public LocalDateTime adddate;

    public String ready01;

    public Integer fileType;

    public String source;
}
