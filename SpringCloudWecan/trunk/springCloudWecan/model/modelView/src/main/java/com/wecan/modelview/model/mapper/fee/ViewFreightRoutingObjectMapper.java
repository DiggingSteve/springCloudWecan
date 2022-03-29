package com.wecan.modelview.model.mapper.fee;

import com.wecan.modelview.model.mapper.IBaseModelMapper;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;
@Mapper(componentModel = "spring")
public interface ViewFreightRoutingObjectMapper extends IBaseModelMapper<ViewFreightRouting> {
    public final static ViewFreightRoutingObjectMapper INSTANCES = Mappers.getMapper(ViewFreightRoutingObjectMapper.class);

    /**
     * 价格参数vo转换航司
     **/
    @Mappings({

    })
    OutputFreightRouting toObj(ViewFreightRouting data);
    /**
     * 价格参数List vo转换
     **/
    @Mappings({

    })
    List<OutputFreightRouting> toList(List<ViewFreightRouting> data);
}
