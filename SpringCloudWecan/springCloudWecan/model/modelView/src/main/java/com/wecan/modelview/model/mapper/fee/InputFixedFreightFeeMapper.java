package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FeeAircompany;
import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.mapper.fee.converter.PackageTypeConverter;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.input.InputFixedFreightFee;
import lombok.var;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InputFixedFreightFeeMapper  extends IBaseModelMapper<InputFixedFreightFee> {

    public final static InputFixedFreightFeeMapper INSTANCES = Mappers.getMapper(InputFixedFreightFeeMapper.class);

    /**
     * 价格参数vo转换航司
     **/
    @Mappings({

    })
    FixedFreightFee toFixedPrice(InputFixedFreightFee data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<FixedFreightFee> toFixedPrice(List<InputFixedFreightFee> data, @Context Long feeid);

    @AfterMapping
    default void afterMapAircompanyList(@MappingTarget List<FixedFreightFee> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }
}
