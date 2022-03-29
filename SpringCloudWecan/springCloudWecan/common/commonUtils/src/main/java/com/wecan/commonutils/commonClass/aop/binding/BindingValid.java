package com.wecan.commonutils.commonClass.aop.binding;

import java.lang.annotation.*;


@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface BindingValid {
}