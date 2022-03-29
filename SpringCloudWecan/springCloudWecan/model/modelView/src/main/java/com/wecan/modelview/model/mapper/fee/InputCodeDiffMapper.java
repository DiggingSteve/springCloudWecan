package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.mapper.fee.converter.PackageTypeConverter;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.output.OutputCodeDiff;
import lombok.var;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InputCodeDiffMapper extends IBaseModelMapper<InputCodeDiff>, PackageTypeConverter {
    public final static InputCodeDiffMapper INSTANCES = Mappers.getMapper(InputCodeDiffMapper.class);

    /**
     * 价格参数vo转换航司
     **/
    @Mappings({

    })
    FeeAircompany toFeeAircompany(InputCodeDiff data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<FeeAircompany> toFeeAircompany(List<InputCodeDiff> data, @Context Long feeid);

    @AfterMapping
    default void afterMapAircompanyList(@MappingTarget List<FeeAircompany> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }

    /**
     * 价格参数vo转换客户等级
     **/
    @Mappings({

    })
    FeeCuslevel toFeeCuslevel(InputCodeDiff data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<FeeCuslevel> toFeeCuslevel(List<InputCodeDiff> data, @Context Long feeid);

    @AfterMapping
    default void afterMapCuslevelList(@MappingTarget List<FeeCuslevel> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }

    /**
     * 价格参数vo转换包装类型
     **/
    @Mappings({
        @Mapping(source = "code",target = "code")
    })
    FeePackageType toPackageType(InputCodeDiff data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<FeePackageType> toPackageType(List<InputCodeDiff> data, @Context Long feeid);
    @AfterMapping
    default void afterMapPackageTypeList(@MappingTarget List<FeePackageType> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }
    /**
     * 价格参数vo转换体积参数
     **/
    @Mappings({

    })
    FeeVolRatio toVol(InputCodeDiff data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({})
    List<FeeVolRatio> toVol(List<InputCodeDiff> data, @Context Long feeid);
    @AfterMapping
    default void afterMapVolList(@MappingTarget List<FeeVolRatio> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }

    /**
     * 价格参数vo转换重量参数
     **/
    @Mappings({

    })
    FeeWeight toWeight(InputCodeDiff data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({})
    List<FeeWeight> toWeight(List<InputCodeDiff> data, @Context Long feeid);

    @AfterMapping
    default void afterMapWeightList(@MappingTarget List<FeeWeight> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }



}
