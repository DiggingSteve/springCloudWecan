package com.wecan.modelview.model.mapper.fee;

import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.mapper.fee.converter.FeeModeEnumConverter;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.modeldbo.airfreight.fee.FreightFee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

/**
 * 命名方式 model name + mapper 表示该model的映射处理
 **/
@Mapper(
        componentModel = "spring"
)
public interface InputAirFreightFeeMapper extends IBaseModelMapper<InputAirFreightFee>,FeeModeEnumConverter {
    public final static InputAirFreightFeeMapper INSTANCES = Mappers.getMapper(InputAirFreightFeeMapper.class);
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
            @Mapping(source = "feeMode", target = "feeMode"),
            @Mapping(source = "czman", target = "addman"),
            @Mapping(source = "cztime", target = "addtime"),
    })
    FreightFee toFreightFee(InputAirFreightFee vo);


    //默认赋值
    @Override
    default InputAirFreightFee defaultObj(Class<InputAirFreightFee> c) throws IllegalAccessException, InstantiationException {
        InputAirFreightFee obj = new InputAirFreightFee();
        obj.setSfg("pvg");
        return obj;
    }
}
