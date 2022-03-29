package com.wecan.daofee.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface ViewFreightRoutingMapper extends BaseMapper<ViewFreightRouting> {

    @Select("select ${ew.sqlSelect} from(select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,fee.feeMode,hs.twocode,\n" +
            "truck.guid as truckFeeid,"+
            "fee.standardPrice,\n" +
            "fee.startdate,\n" +
            "fee.enddate,\n" +
            "fee.wffAreaid,\n" +
            "fee.addman,\n" +
            "fee.jfType,\n"+
            "fee.minPrice,\n"+
            "fee.area,\n"+
            "fee.gid,\n"+
            "fee.remark,\n"+
            "truck.ddg ,\n"+
            "truckHs.twocode as truckTwocode,\n"+
            "fee.hbh "+
            "from Ex_FreightFee as fee\n" +
            "LEFT JOIN Ex_FeeAircompany as hs on hs.feeid=fee.guid\n" +
            "left join Ex_TruckFee as truck on truck.mdg=fee.mdg  and  truck.isdel=1 and truck.wageinout= 1\n"+
            "left join Ex_TruckFeeAircompany as truckHs on truckHs.feeid=truck.guid and truckHs.twocode=hs.twocode and truckHs.isdel=1  \n"+
            " where  fee.isdel=1 and hs.isdel=1 \n" + //到达港和航司是必选条件 因为ddg匹配上fee的数据 会混入二字码为null的数据需要剔除
            ")as a " +
            "${ew.customSqlSegment}\n" )
        //"${orderby}")
    List<ViewFreightRouting> getRoutingList(
            @Param(Constants.WRAPPER) Wrapper<ViewFreightRouting> wrapper);

}
