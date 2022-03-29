package com.wecan.websocket.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;

@Data
public class CallMessage {
    @ApiModelProperty(position = 10, value = "消息类型",example = "nodemessage" )
    public String messagetype;

    @ApiModelProperty(position = 15, value = "区域",example = "上海")
    public String area;

    @ApiModelProperty(position = 20, value = "订单guid",example = "11111111")
    public Long boguid;

    @ApiModelProperty(position = 20, value = "订单号",example = "BO202101020001PVG")
    public String pono;

    @ApiModelProperty(position = 20, value = "委托客户id",example = "1719")
    public Integer fid;

    @ApiModelProperty(position = 20, value = "委托项目id",example = "1719")
    public Integer gid;

    @ApiModelProperty(position = 30, value = "hpo-guid",example = "11111111")
    public Long guid;

    @ApiModelProperty(position = 30, value = "总单号",example = "112-11111111")
    public String mawb;

    @ApiModelProperty(position = 30, value = "始发港",example = "PAV")
    public String sfg;

    @ApiModelProperty(position = 30, value = "目的港",example = "LAX")
    public String mdg;

    @ApiModelProperty(position = 30, value = "航班号",example = "CA999")
    public String hbh;

    @ApiModelProperty(position = 30, value = "航班日期",example = "2021-01-02")
    public String hbrq;

    @ApiModelProperty(position = 30, value = "起飞时间",example = "2021-01-02 03:04:05")
    public String qfsj;

    @ApiModelProperty(position = 35, value = "预报件数",example = "1")
    public String ybpiece;

    @ApiModelProperty(position = 35, value = "预报重量",example = "11")
    public String ybweight;

    @ApiModelProperty(position = 35, value = "预报体积",example = "0.11")
    public String ybvolume;

    @ApiModelProperty(position = 38, value = "实际件数",example = "1")
    public String realpiece;

    @ApiModelProperty(position = 38, value = "实际重量",example = "10")
    public String realweight;

    @ApiModelProperty(position = 38, value = "实际体积",example = "0.1")
    public String realvolume;

    @ApiModelProperty(position = 40, value = "消息内容",example = "系统测试")
    public String inputConent;

    @ApiModelProperty(position = 50, value = "系统",example = "系统")
    public String loginName;

    @ApiModelProperty(position = 60)
    public String time;

    @ApiModelProperty(position = 70)
    public ArrayList<CallUser> calllist;

    @ApiModelProperty(position = 70)
    public ArrayList<BoBase> bobaseList;
}
