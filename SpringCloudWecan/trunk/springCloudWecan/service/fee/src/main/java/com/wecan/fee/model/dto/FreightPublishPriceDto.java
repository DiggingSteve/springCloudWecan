package com.wecan.fee.model.dto;

import com.wecan.modeldbo.airfreight.fee.FeeAirFlight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class FreightPublishPriceDto {
    public  String sfg;
    public  String mdg;
    public  String twocode;
    public  String publishMan;
    public String addman;
    public LocalDateTime publishDate;
    public  String zzg;
    public  String ddg;
    public  String area;
    //public  Integer gid;
    public String packageType;
    public String remark;
    public BigDecimal price;
    public  BigDecimal change;

    public  String hbh;

    public List<FeeAirFlight> flightList;

}
