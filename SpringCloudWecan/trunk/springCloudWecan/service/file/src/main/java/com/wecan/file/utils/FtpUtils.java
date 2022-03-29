package com.wecan.file.utils;

import com.wecan.commonpool.ftp.FTPClientPool;
import lombok.var;

import java.io.InputStream;
import java.util.UUID;


public class FtpUtils {


    public static void Upload(String path, InputStream stream) throws Exception {
        var pool = FtpClientPoolSingleton.getPool();
        var ftp = pool.borrowObject();
        String[] dirs = path.split("/");
        for (String dir : dirs) {
            boolean isExistsDir = ftp.changeWorkingDirectory(dir);
            if (!isExistsDir) {
                ftp.makeDirectory(dir);
                ftp.changeWorkingDirectory(dir);
            }
        }
        ftp.storeFile(UUID.randomUUID().toString() + ".png", stream);
        pool.returnObject(ftp);
    }


}
