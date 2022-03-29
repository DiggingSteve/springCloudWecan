package com.wecan.modeldbo.airfreight.fee.enums;

import lombok.Getter;


public interface IMapStructBaseEnum {
    //返回枚举的标识代码
   default   Integer getCode(){
       return 1;
   };

   default String getStrCode(){
       return "";
   }

}
