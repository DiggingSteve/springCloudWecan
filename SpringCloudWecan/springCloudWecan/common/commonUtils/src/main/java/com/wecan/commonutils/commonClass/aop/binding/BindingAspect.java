package com.wecan.commonutils.commonClass.aop.binding;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import lombok.var;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;


@Component
@Aspect
@Order(1)
public class BindingAspect {

    @Pointcut("@annotation(com.wecan.commonutils.commonClass.aop.binding.BindingValid) ")
    public void validAop() {
    }

    @Around("validAop()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {

        var args = joinPoint.getArgs();
        for (var arg : args) {
            if (arg instanceof BindingResult) {
                var bindingResult = (BindingResult) arg;
                if (bindingResult.hasErrors()) {
                    for (ObjectError error : bindingResult.getAllErrors()) {
                        return ReturnResult.error().putMessage(error.getDefaultMessage());
                    }
                }
            }
        }
        return joinPoint.proceed();
    }
}