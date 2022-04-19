package com.wecan.daofee.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ViewFreightRoutingMapper extends BaseMapper<ViewFreightRouting> {

    @Select("select ${ew.sqlSelect} from( select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,hs.twocode, \n" +
            "           '' as truckFeeid, \n" +
            "            fee.startdate, \n" +
            "            fee.enddate, \n" +
            "            fee.wffAreaid, \n" +
            "            fee.addman, \n" +
            "            fee.addtime, \n" +
            "            fee.jfType, \n" +
            "            fee.area, \n" +
            "            fee.gid, \n" +
            "            fee.remark, \n" +
            "           # case when truckHs.twocode is  null then '' else truck.ddg end ddg , \n" +
            "           '' as ddg,\n" +
            "            '' as truckTwocode, \n" +
            "            fee.hbh,  \n" +
            "            0 as truckMin,  \n" +
            "            0 as truckFixedMin,  \n" +
            "           0 as truckMinDiff  \n" +
            "            from Ex_FreightFee as fee \n" +
            "           LEFT JOIN Ex_FeeAircompany as hs on hs.feeid=fee.guid AND fee.isdel=1\n" +
            "             where  fee.isdel=1 and hs.isdel=1   \n" + //到达港和航司是必选条件 因为ddg匹配上fee的数据 会混入二字码为null的数据需要剔除
            ")as a " +
            "${ew.customSqlSegment}\n")

    List<ViewFreightRouting> getRoutingList(
            @Param(Constants.WRAPPER) Wrapper<ViewFreightRouting> wrapper);


    @Select("select ${ew.sqlSelect} from(select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,hs.twocode,\n" +
            "            truck.guid as truckFeeid, \n" +
            "            fee.startdate, \n" +
            "            fee.enddate, \n" +
            "            fee.wffAreaid, \n" +
            "            fee.addman, \n" +
            "            fee.addtime, \n" +
            "            fee.jfType, \n" +
            "            fee.area, \n" +
            "            fee.gid, \n" +
            "            fee.remark, \n" +
            "            truck.ddg  , \n" +
            "            truck.twocode as truckTwocode, \n" +
            "            fee.hbh,  \n" +
            "            truck.min as truckMin,  \n" +
            "            truck.fixedMin as truckFixedMin,  \n" +
            "            truck.minDiff as truckMinDiff  \n" +
            "            from Ex_FreightFee as fee \n" +
            "            LEFT JOIN Ex_FeeAircompany as hs on hs.feeid=fee.guid AND fee.isdel=1\n" +
            "left join\n" +
            "(select t.guid, t.mdg , t.ddg as ddg ,a.twocode  ,t.min ,t.fixedMin ,t.minDiff  from Ex_TruckFee as t\n" +
            " left join Ex_TruckFeeAircompany as a on a.feeid=t.guid and a.isdel=1\n" +
            " where t.isdel=1 \n" +
            ") as truck on truck.mdg=fee.mdg and truck.twocode = hs.twocode\n" +
            "     \n" +
            "             where  fee.isdel=1 and hs.isdel=1  AND truck.ddg is not null \n" + //到达港和航司是必选条件 因为ddg匹配上fee的数据 会混入二字码为null的数据需要剔除
            ")as a " +
            "${ew.customSqlSegment}\n")
    List<ViewFreightRouting> getTruckRoutingList(
            @Param(Constants.WRAPPER) Wrapper<ViewFreightRouting> wrapper);



}
