package com.wecan.fee.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Fee")
public class FeeController {

    @RequestMapping("/test")
    public String test() {
        return "跨域";
    }
}
