package com.wecan.file.utils;

import com.wecan.commonpool.ftp.FTPClientConfig;
import com.wecan.commonpool.ftp.FTPClientFactory;
import com.wecan.commonpool.ftp.FTPClientPool;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FtpClientPoolSingleton {
    @Autowired
    private FTPClientConfig conf;
    @Getter
    private static FTPClientPool pool;

    @Autowired
    private FTPClientFactory factory;

    @Autowired
    private void init() {
        conf.setMaxTotal(conf.getTotal());
        pool = new FTPClientPool(factory, conf);
    }

}
