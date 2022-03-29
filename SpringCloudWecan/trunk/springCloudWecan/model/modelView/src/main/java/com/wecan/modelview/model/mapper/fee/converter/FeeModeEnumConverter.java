/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/21 16:38
 */
package com.wecan.modelview.model.mapper.fee.converter;

import com.wecan.modeldbo.airfreight.fee.enums.FeeModeEnum;
import com.wecan.modelview.model.mapper.IEnumConverter;


public interface FeeModeEnumConverter extends IEnumConverter<FeeModeEnum> {


    @Override
    default FeeModeEnum toEunm(Integer code) throws NoSuchMethodException {
        return  this.toEunm(code,FeeModeEnum.class);
    }


}
