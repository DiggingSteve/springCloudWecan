/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/21 17:42
 */
package com.wecan.modelview.model.mapper;


import com.wecan.modeldbo.airfreight.fee.enums.FeeModeEnum;
import com.wecan.modeldbo.airfreight.fee.enums.IMapStructBaseEnum;

public interface IEnumConverter<T extends Enum<T> & IMapStructBaseEnum> {


    default Integer toInt(IMapStructBaseEnum baseEnum) {
        return baseEnum.getCode();
    }

    default String toStr(IMapStructBaseEnum baseEnum) {
        return baseEnum.getStrCode();
    }

    default T toEunm(Integer code, Class<T> c) throws NoSuchMethodException {
        return EnumUtils.valueOf(c, code, IMapStructBaseEnum.class.getMethod("getCode"));
    }

    default T toEnum(String code, Class<T> c) throws NoSuchMethodException {
        return EnumUtils.valueOf(c, code, IMapStructBaseEnum.class.getMethod("getStrCode"));
    }

    /**
     * 子接口实现该接口才能实现枚举自定义code用于反射 此处实现没意义 只是为了不报错 具体枚举对应的转换需要在对应的接口实现
     **/
    default T toEunm(Integer code) throws NoSuchMethodException, IllegalAccessException, InstantiationException {
        T a = null;
        Class c = a.getClass();
        return (T) c.newInstance();
    }

    /**
     * 子接口实现该接口才能实现枚举自定义code用于反射此处实现没意义 只是为了不报错 具体枚举对应的转换需要在对应的接口实现
     **/
    default T toEnum(String code) throws NoSuchMethodException, IllegalAccessException, InstantiationException {
        T a = null;
        Class c = a.getClass();
        return (T) c.newInstance();
    }


}
