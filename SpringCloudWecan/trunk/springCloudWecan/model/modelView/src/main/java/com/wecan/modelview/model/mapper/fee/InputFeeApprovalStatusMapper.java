package com.wecan.modelview.model.mapper.fee;

import com.wecan.modeldbo.airfreight.fee.FeeApprovalRecord;
import com.wecan.modelview.model.mapper.IBaseModelMapper;

import com.wecan.modelview.model.vo.fee.input.InputApprovalRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;
@Mapper(componentModel = "spring")
public interface InputFeeApprovalStatusMapper  extends IBaseModelMapper<InputApprovalRecord> {
    public final static InputFeeApprovalStatusMapper INSTANCES = Mappers.getMapper(InputFeeApprovalStatusMapper.class);

    @Mappings({
            @Mapping(source = "czman", target = "addman"),
            @Mapping(source = "cztime", target = "addtime"),
    })
    FeeApprovalRecord toApprovalRecord(InputApprovalRecord vo);
}
