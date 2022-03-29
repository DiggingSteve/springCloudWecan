package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FeeCuslevel;
import com.wecan.modeldbo.airfreight.fee.FeePackageType;
import com.wecan.modeldbo.airfreight.fee.FeeVolRatio;
import com.wecan.modeldbo.airfreight.fee.FeeWeight;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.mapper.fee.converter.PackageTypeConverter;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.output.OutputCodeDiff;
import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;
@Mapper(componentModel = "spring")
public interface OutputCodeDiffMapper extends IBaseModelMapper<OutputCodeDiff>, PackageTypeConverter {

    public final static OutputCodeDiffMapper INSTANCES = Mappers.getMapper(OutputCodeDiffMapper.class);
    /**
     * 包装类型转换成参数
     **/
    @Mappings({

    })
    OutputCodeDiff toCodeDiff(FeePackageType data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({})
    List<OutputCodeDiff> toCodeDiffPackageList(List<FeePackageType> data);

    /**
     * 客户等级
     **/
    @Mappings({

    })
    OutputCodeDiff toCodeDiff(FeeCuslevel data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<OutputCodeDiff> toCodeDiffCusList(List<FeeCuslevel> data);

    /**
     * 重量
     **/
    @Mappings({

    })
    OutputCodeDiff toCodeDiff(FeeWeight data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<OutputCodeDiff> toCodeDiffWeightList(List<FeeWeight> data);

    /**
     * 体积
     **/
    @Mappings({

    })
    OutputCodeDiff toCodeDiff(FeeVolRatio data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<OutputCodeDiff> toCodeDiffVolList(List<FeeVolRatio> data);
}
