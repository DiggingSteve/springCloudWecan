/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/10 11:14
 */
package com.wecan.fee.global;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.wecan.commonutils.commonClass.exception.BusinessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    /**
     * 配置url忽略大小写
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        AntPathMatcher matcher = new AntPathMatcher();
        matcher.setCaseSensitive(false);
        configurer.setPathMatcher(matcher);
    }

    /**
     * 跨域策略
     **/
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "DELETE", "PUT", "PATCH")
                .maxAge(3600);
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = converter.getObjectMapper();
        // 生成JSON时,将所有Date转换成Long
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        // LocalDateTime 序列化设置
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeToStrSerializer());
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeToStrDeserializer());


        //Long序列化设置
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(Long.class, new LongToStrSerializer());
        simpleModule.addDeserializer(Long.class, new LongToStrDeserializer());
        simpleModule.addSerializer(BigDecimal.class,new BigDecimalToStr());

        // 把“忽略重复的模块注册”禁用，否则下面的注册不生效
        objectMapper.disable(MapperFeature.IGNORE_DUPLICATE_MODULE_REGISTRATIONS);
        objectMapper.registerModule(javaTimeModule);
        objectMapper.registerModule(simpleModule);
        // 然后再设置为生效，避免被其他地方覆盖
        objectMapper.enable(MapperFeature.IGNORE_DUPLICATE_MODULE_REGISTRATIONS);
        // 设置格式化内容
        converter.setObjectMapper(objectMapper);
        converters.add(0, converter);
    }


    /**
     * Str 反序列化到LocalDateTime
     **/
    public class LocalDateTimeToStrDeserializer extends JsonDeserializer<LocalDateTime> {

        @Override
        public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws JsonProcessingException, IOException {
            String s = jsonParser.getValueAsString();
            if (s.matches("^\\d{4}-\\d{2}-\\d{2} {1}\\d{2}:\\d{2}:\\d{2}$")) {

            } else if (s.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                s = s + " 00:00:00";
            } else {
                throw new BusinessException("非法的时间格式");
            }
            return LocalDateTime.parse(s, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        }

    }

    /**
     * LocalDateTime 转换字符串
     **/
    public class LocalDateTimeToStrSerializer extends JsonSerializer<LocalDateTime> {
        @Override
        public void serialize(LocalDateTime date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            String localTime = df.format(date);
            if (date.getHour() == 0 && date.getMinute() == 0 && date.getSecond() == 0) {
                localTime = localTime.substring(0, 10);
            }
            jsonGenerator.writeString(localTime);


        }
    }


    /**
     * long 类型转换成string
     **/
    public class LongToStrSerializer extends JsonSerializer<Long> {

        @Override
        public void serialize(Long aLong, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            String value = String.valueOf(aLong);
            jsonGenerator.writeString(value);
        }
    }

    /**
     * String 类型反序列化成 long
     **/
    public class LongToStrDeserializer extends JsonDeserializer<Long> {
        @Override
        public Long deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JsonProcessingException {
            String s=jsonParser.getValueAsString();
            Long value=Long.valueOf(s);
            return value;
        }


    }

    public class BigDecimalToStr extends JsonSerializer<BigDecimal>{

        @Override
        public void serialize(BigDecimal value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            BigDecimal val= value.setScale(2,BigDecimal.ROUND_DOWN);
            gen.writeNumber(val);
        }
    }


}
