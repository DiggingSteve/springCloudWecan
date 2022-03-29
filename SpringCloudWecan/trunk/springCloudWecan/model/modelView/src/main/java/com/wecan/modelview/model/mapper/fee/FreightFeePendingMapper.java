package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FreightFee;
import com.wecan.modeldbo.airfreight.fee.FreightFeePending;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.mapper.fee.converter.FeeModeEnumConverter;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(
        componentModel = "spring"
)
public interface FreightFeePendingMapper extends IBaseModelMapper<FreightFeePending> {
    public final static FreightFeePendingMapper INSTANCES = Mappers.getMapper(FreightFeePendingMapper.class);

    FreightFee toFreightFee(FreightFeePending data);

}
