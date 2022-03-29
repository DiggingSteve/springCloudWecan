package com.wecan.commonutils.commonClass.format;

import com.alibaba.fastjson.serializer.*;
import lombok.var;

import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.text.DecimalFormat;

public class BigDecimalToStringSerializer implements ObjectSerializer {
    private final DecimalFormat decimalFormat;

    public BigDecimalToStringSerializer(DecimalFormat decimalFormat) {
        this.decimalFormat = decimalFormat;
    }

    @Override
    public void write(JSONSerializer serializer, Object object, Object fieldName, Type fieldType, int features) throws IOException {
        SerializeWriter out = serializer.out;
        if (object == null) {
            out.writeNull();
            return;
        }
        out.writeString(object.toString());
    }
}
