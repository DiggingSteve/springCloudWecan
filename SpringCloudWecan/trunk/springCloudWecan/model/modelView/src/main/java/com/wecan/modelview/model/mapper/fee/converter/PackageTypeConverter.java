package com.wecan.modelview.model.mapper.fee.converter;

import com.wecan.modeldbo.airfreight.fee.enums.PackageTypeEnum;
import com.wecan.modelview.model.mapper.IEnumConverter;

public interface PackageTypeConverter extends IEnumConverter<PackageTypeEnum> {

    @Override
   default PackageTypeEnum toEnum(String code) throws NoSuchMethodException{
        return this.toEnum(code,PackageTypeEnum.class);
    }
}
