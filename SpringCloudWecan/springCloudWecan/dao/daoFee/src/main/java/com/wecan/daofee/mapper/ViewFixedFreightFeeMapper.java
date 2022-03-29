package com.wecan.daofee.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.wecan.modelview.model.vo.fee.view.ViewFixedFreightFee;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ViewFixedFreightFeeMapper extends BaseMapper<ViewFixedFreightFee> {

    @Select("select ${ew.sqlSelect} from(select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,fee.feeMode,fee.twocode,\n" +
            "fee.standardPrice,\n" +
            "fee.startdate,\n" +
            "fee.enddate,\n" +
            "fee.wffAreaid,\n" +
            "fee.addman,\n" +
            "fee.jfType,\n"+
            "fee.minPrice,\n"+
            "fee.area,\n"+
            "fee.gid,\n"+
            "fixed.cus,"+
            "fixed.packageType,"+
            "fixed.vol,"+
            "fixed.weight, "+
            "fixed.diff ,"+
            "fee.hbh "+
            "from Ex_FreightFee as fee\n" +

            "left join Ex_FixedFreightFee as fixed on fixed.feeid=fee.guid and fixed.isdel=1 "+
            " where  fee.isdel=1  and fixed.cus is not null \n" +
            ")as a " +
            "${ew.customSqlSegment}\n" )
        //"${orderby}")
    List<ViewFixedFreightFee> getFeeList(
            @Param(Constants.WRAPPER) Wrapper<ViewFixedFreightFee> wrapper);

}
