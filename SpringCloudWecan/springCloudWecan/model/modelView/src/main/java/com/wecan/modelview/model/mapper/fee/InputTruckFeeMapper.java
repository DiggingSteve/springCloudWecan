/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 15:01
 */
package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FreightFee;
import com.wecan.modeldbo.airfreight.fee.TruckFee;
import com.wecan.modeldbo.airfreight.fee.TruckFeeWeight;
import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckWeightDiff;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(
        componentModel = "spring"
)
public interface InputTruckFeeMapper extends IBaseModelMapper<InputTruckFee> {
    public final static InputTruckFeeMapper INSTANCES = Mappers.getMapper(InputTruckFeeMapper.class);
    /**
     * 获取该类自动生成的实现类的实例
     * 接口中的属性都是 public static final 的 方法都是public abstract的
     */


    /**
     * 这个方法就是用于实现对象属性复制的方法
     *
     * @param vo 这个参数就是源对象，也就是需要被复制的对象
     * @return 返回的是目标对象，就是最终的结果对象
     * @Mapping 用来定义属性复制规则 source 指定源对象属性 target指定目标对象属性
     */
    @Mappings({
            @Mapping(source = "feeid",target = "guid"),
            @Mapping(source = "addman", target = "addman"),
            @Mapping(source = "addtime", target = "addtime"),
    })
    TruckFee toTruckFee(InputTruckFee vo);

    @Mappings({

    })
    List<TruckFee> toList(List<InputTruckFee> data);
}
