package com.wecan.commonutils.commonClass.exception;

import com.wecan.commonutils.commonClass.result.ReturnResult;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 全局异常处理类
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ReturnResult exceptionHandler(Exception e) {

        //Valid验证
        BindingResult bindingResult = null;
        if (e instanceof MethodArgumentNotValidException) {
            bindingResult = ((MethodArgumentNotValidException) e).getBindingResult();
        }
        if (e instanceof BindException) {
            bindingResult = ((BindException) e).getBindingResult();
        }
        if (bindingResult != null) {
            if (bindingResult.hasErrors()) {
                for (ObjectError error : bindingResult.getAllErrors()) {
                    return ReturnResult.error().changeMessage(error.getDefaultMessage());
                }
            }
        }

        if (e instanceof BusinessException) {
            return ReturnResult.error().changeMessage(e.getMessage());
        }

        log.error("GlobalException",e);
        return ReturnResult.error().changeMessage(e.getMessage());
    }
}
