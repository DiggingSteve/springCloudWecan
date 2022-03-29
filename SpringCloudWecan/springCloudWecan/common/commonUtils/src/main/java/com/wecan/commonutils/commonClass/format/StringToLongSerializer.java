package com.wecan.commonutils.commonClass.format;

import com.alibaba.fastjson.parser.DefaultJSONParser;
import com.alibaba.fastjson.parser.deserializer.ObjectDeserializer;
import com.alibaba.fastjson.serializer.JSONSerializer;
import com.alibaba.fastjson.serializer.ObjectSerializer;
import com.alibaba.fastjson.serializer.SerializeWriter;

import java.io.IOException;
import java.lang.reflect.Type;

public class StringToLongSerializer implements ObjectSerializer {
    public static final StringToLongSerializer instance = new StringToLongSerializer();

    @Override
    public void write(JSONSerializer serializer, Object object, Object fieldName, Type fieldType, int features) throws IOException {
        SerializeWriter out = serializer.out;
        if (object == null) {
            out.writeNull();
            return;
        }
        if (object instanceof Long) {
            Long longVal = ((Long) object).longValue();
            out.writeLong(longVal);
        } else {
            String strVal = object.toString();
            out.writeString(strVal);
        }
    }

}
