package com.wecan.commonpool.ftp;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.pool2.DestroyMode;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.PooledObjectFactory;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.IOException;


public class FTPClientPool extends GenericObjectPool<FTPClient> {


    public FTPClientPool(PooledObjectFactory<FTPClient> factory, GenericObjectPoolConfig<FTPClient> config) {
        super(factory, config);
    }

    /**
     * 借 获取一个连接对象
     *
     * @return
     * @throws Exception
     */
    @Override
    public FTPClient borrowObject() throws Exception {
        FTPClient client = super.borrowObject();
        boolean isHealth = isHealth(client);
        if (!isHealth) {
            this.addObject();
            client=this.getFactory().makeObject().getObject(); //此实例不在池中无法返还
        }
        return client;

    }

    private boolean isHealth(FTPClient client) throws Exception {
        try {
            return client.sendNoOp();
        } catch (IOException e) {
            e.printStackTrace();
            super.invalidateObject(client, DestroyMode.NORMAL);
            return false;
        }
    }


    /**
     * 还 归还一个连接对象
     *
     * @param ftpClient
     */
    @Override
    public void returnObject(FTPClient ftpClient) {

        if (ftpClient != null) {
            try {
                boolean flag = ftpClient.changeWorkingDirectory("/");
                if (!flag) {
                    ftpClient.logout();
                    ftpClient.disconnect();
                    super.invalidateObject(ftpClient, DestroyMode.NORMAL);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                long aa=super.getDestroyedCount();
                System.out.println("销毁了"+aa+"实例");
                System.out.println("全部实例总数"+super.listAllObjects().stream().count());
                super.returnObject(ftpClient);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }


}
