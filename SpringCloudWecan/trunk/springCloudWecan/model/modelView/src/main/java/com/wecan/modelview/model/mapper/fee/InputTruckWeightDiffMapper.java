package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.TruckFeeWeight;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.input.InputTruckWeightDiff;
import lombok.var;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;
@Mapper(
        componentModel = "spring"
)
public interface InputTruckWeightDiffMapper  extends IBaseModelMapper<InputTruckWeightDiff> {

    public final static InputTruckWeightDiffMapper INSTANCES = Mappers.getMapper(InputTruckWeightDiffMapper.class);
    /**
     * 获取该类自动生成的实现类的实例
     * 接口中的属性都是 public static final 的 方法都是public abstract的
     */

    /**
     * 价格参数vo转换航司
     **/
    @Mappings({

    })
    TruckFeeWeight toCode(InputCodeDiff data);
    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<TruckFeeWeight> toCodeArr(List<InputTruckWeightDiff> data, @Context Long feeid);

    @AfterMapping
    default void afterMapping(@MappingTarget List<TruckFeeWeight> list, @Context Long feeid) {
        for (var item : list) {
            item.setFeeid(feeid);
        }
    }

}