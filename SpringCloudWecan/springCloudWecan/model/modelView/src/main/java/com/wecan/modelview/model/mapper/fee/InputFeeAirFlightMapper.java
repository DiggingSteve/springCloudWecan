package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FeeAirFlight;
import com.wecan.modeldbo.airfreight.fee.FixedFreightFee;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.vo.fee.input.InputFeeAirFlight;
import com.wecan.modelview.model.vo.fee.input.InputFixedFreightFee;
import lombok.var;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InputFeeAirFlightMapper extends IBaseModelMapper<InputFeeAirFlight> {

    public final static InputFeeAirFlightMapper INSTANCES = Mappers.getMapper(InputFeeAirFlightMapper.class);

    /**
     * 价格参数vo转换航司
     **/
    @Mappings({

    })
    FeeAirFlight toFlight(InputFeeAirFlight data);

    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<FeeAirFlight> toFlight(List<InputFeeAirFlight> data, @Context Long feeid);

    @AfterMapping
    default void afterMapFlightList(@MappingTarget List<FeeAirFlight> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }
}
