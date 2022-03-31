package com.wecan.daofee.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.wecan.modelview.model.vo.fee.view.ViewFreightFee;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ViewFreightFeeMapper extends BaseMapper<ViewFreightFee> {
    @Select("select ${ew.sqlSelect} from(select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,fee.twocode, \n" +
            "            cus.`code` as cusLevel, \n" +
            "            cus.diff as cusDiff,\n" +
            "            package.`code` as packageType, \n" +
            "            package.diff as packageTypeDiff,\n" +
            "            weight.`code` as weight, \n" +
            "            weight.diff as weightDiff,\n" +
            "            vol.`code` as volRatio, \n" +
            "            vol.diff as volRatioDiff,\n" +
            "            fee.startdate, \n" +
            "            fee.enddate, \n" +
            "            fee.wffAreaid, \n" +
            "            fee.addman, \n" +
            "            fee.addtime, \n" +
            "            fee.jfType,\n" +
            "            fee.area,\n" +
            "            fee.gid,\n" +
            "            fee.approvalStatus,\n" +
            "            fee.hbh ,\n" +
            "            approval.addtime as approvalTime, \n" +
            "            approval.addman as approvalMan\n" +
            "            from Ex_FreightFeePending as fee \n" +
            "            LEFT JOIN Ex_FeeVolRatio as vol on vol.feeid=fee.guid and vol.isDefault=1 and vol.isdel=1  \n" +
            "            LEFT JOIN Ex_FeeWeight as weight on weight.feeid=fee.guid and weight.isDefault=1 and weight.isdel=1 \n" +
            "            left join Ex_FeeCuslevel as cus on cus.feeid=fee.guid and cus.isDefault=1 and cus.isdel=1 \n" +
            "            LEFT JOIN Ex_FeePackageType as package on package.feeid=fee.guid and package.isDefault=1 and package.isdel=1\n" +
            "            left join (select max(addtime) as addtime,max(addman) as addman,feeid from Ex_FeeApprovalRecord where isdel=1 group by feeid) as approval on approval.feeid=fee.guid  \n" +
            "             where  fee.isdel=1  \n" +
            ")as a " +
            "${ew.customSqlSegment}\n" )
            //"${orderby}")
    List<ViewFreightFee> getDefaultFreightFee(
            @Param(Constants.WRAPPER) Wrapper<ViewFreightFee> wrapper);

//     List<ViewFreightFee> getDefaultFreightFee(
//             @Param(Constants.WRAPPER) Wrapper<ViewFreightFee> wrapper,
//             @Param("orderby") @Nullable String orderby) ;

    @Select("select ${ew.sqlSelect} from(select fee.guid as feeid, fee.sfg,fee.mdg,fee.zzg,hs.twocode,\n" +
            "cus.`code` as cusLevel,\n" +
            "cus.diff as cusDiff,\n"+
            "package.`code` as packageType,\n" +
            "package.diff as packageTypeDiff,\n"+
            "weight.`code` as weight,\n" +
            "weight.diff as weightDiff,\n"+
            "vol.`code` as volRatio,\n" +
            "vol.diff as volRatioDiff,\n"+
            "fee.standardPrice,\n" +
            "fee.startdate,\n" +
            "fee.enddate,\n" +
            "fee.remark,\n" +
            "fee.approvalStatus,\n" +
            "package.isDefault as isDefaultPackage,\n" +
            "weight.isDefault as isDefaultWeight,\n" +
            "vol.isDefault as isDefaultVol,\n" +
            "cus.isDefault as  isDefaultCus\n" +
            "from Ex_FreightFeePending as fee\n" +
            "LEFT JOIN Ex_FeeAircompany as hs on hs.feeid=fee.guid\n" +
            "LEFT JOIN Ex_FeeVolRatio as vol on vol.feeid=fee.guid  \n "+
            "LEFT JOIN Ex_FeeWeight as weight on weight.feeid=fee.guid \n" +
            "left join Ex_FeeCuslevel as cus on cus.feeid=fee.guid \n" +
            "LEFT JOIN Ex_FeePackageType as package on package.feeid=fee.guid \n"+
            " and fee.isdel=1 and hs.isdel=1 and vol.isdel=1 and weight.isdel=1 and package.isdel=1 and cus.isdel=1)as a " +
            "${ew.customSqlSegment}")
    List<ViewFreightFee> getAllFreightFee(@Param(Constants.WRAPPER) Wrapper<ViewFreightFee> wrapper) ;
}
