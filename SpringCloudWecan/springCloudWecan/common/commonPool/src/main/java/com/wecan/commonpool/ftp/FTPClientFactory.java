package com.wecan.commonpool.ftp;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.DestroyMode;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
@Lazy
public class FTPClientFactory extends BasePooledObjectFactory<FTPClient> {
    @Autowired
    private FTPClientConfig config;

    @Override
    public PooledObject<FTPClient> makeObject() throws Exception {
        return super.makeObject();
    }

    @Override
    public FTPClient create() throws Exception {
        FTPClient ftpClient = new FTPClient();
        ftpClient.setConnectTimeout(config.getConnectTimeOut());
        try {
         //  logger.info("连接ftp服务器:" + config.getHost() + ":" + config.getPort());
            ftpClient.connect(config.getHost());
            int reply = ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                ftpClient.disconnect();
              //  logger.error("FTPServer 拒绝连接!");
                return null;
            }
            boolean result = ftpClient.login(config.getUsername(), config.getPassword());
            if (!result) {
              //  logger.error("ftpClient登录失败!");
                throw new Exception(
                        "ftpClient登录失败! userName:" + config.getUsername() + ", password:" + config.getPassword());
            }

            ftpClient.setControlEncoding(config.getControlEncoding());
            ftpClient.setBufferSize(config.getBufferSize());
            ftpClient.setFileType(config.getFileType());
            ftpClient.setDataTimeout(config.getDataTimeout());
            ftpClient.setUseEPSVwithIPv4(config.isUseEPSVwithIPv4());
            if (config.isPassiveMode()) {
              //  logger.info("进入ftp被动模式");
                ftpClient.enterLocalPassiveMode();// 进入被动模式
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ftpClient;
    }

    @Override
    public PooledObject<FTPClient> wrap(FTPClient ftpClient) {
        return new DefaultPooledObject<FTPClient>(ftpClient);
    }

    /**
     * 销毁对象
     */
    @Override
    public void destroyObject(PooledObject<FTPClient> p) throws Exception {
        FTPClient ftpClient = p.getObject();
        if (ftpClient != null) {
            super.destroyObject(p);
        }
    }




    /**
     * 验证对象
     */
    @Override
    public boolean validateObject(PooledObject<FTPClient> p) {
        FTPClient ftpClient = p.getObject();
        boolean connect = false;
        try {
            connect = ftpClient.sendNoOp();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return connect;
    }

    /**
     * No-op.
     *
     * @param p ignored
     */
    @Override
    public void activateObject(PooledObject<FTPClient> p) throws Exception {
        // The default implementation is a no-op.
    }

    /**
     * No-op.
     *
     * @param p ignored
     */
    @Override
    public void passivateObject(PooledObject<FTPClient> p) throws Exception {
        // The default implementation is a no-op.
    }

}
