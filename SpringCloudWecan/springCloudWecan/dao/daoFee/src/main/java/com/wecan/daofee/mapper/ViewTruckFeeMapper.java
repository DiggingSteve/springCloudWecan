package com.wecan.daofee.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.wecan.modelview.model.vo.fee.view.ViewTruckFee;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ViewTruckFeeMapper  extends BaseMapper<ViewTruckFee> {
    @Select("select ${ew.sqlSelect} from(select truck.guid as feeid, truck.mdg,truck.ddg, " +
            "hs.twocode,\n" +
           "truck.wageinout "+
            "from Ex_TruckFee as truck\n" +
            "LEFT JOIN Ex_TruckFeeAircompany as hs on hs.feeid=truck.guid\n" +

            " where  truck.isdel=1 and hs.isdel=1 \n" +
            ")as a " +
            "${ew.customSqlSegment}\n" )
        //"${orderby}")
    List<ViewTruckFee> getList(
            @Param(Constants.WRAPPER) Wrapper<ViewTruckFee> wrapper);
}
