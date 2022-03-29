/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/14 16:31
 */
package com.wecan.commonutils.commonClass.lock;

import com.wecan.commonutils.commonClass.exception.BusinessException;
import com.wecan.commonutils.commonClass.util.ThrowingConsumer;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Consumer;

/**
 * 信号量锁
 * **/
public class ResourceManage {
    private final Semaphore semaphore;
    private Boolean             resourceArray[];
    private final ReentrantLock lock;


    private int resourceCount=1; //同资源能有多少线程同时访问
    public ResourceManage(int r){
        this.resourceCount=r;
        this.resourceArray = new Boolean[resourceCount];// 资源
        this.semaphore = new Semaphore(resourceCount, true);// 控制10个共享资源的使用，使用先进先出的公平模式进行共享;公平模式的信号量，先来的先获得信号量
        this.lock = new ReentrantLock(true);// 公平模式的锁，先来的先选
        for (int i = 0; i < resourceCount; i++) {
            resourceArray[i] = true;// 初始化为资源可用的情况
        }
    }

    public void useResource(ThrowingConsumer act) throws BusinessException {


       boolean a= semaphore.tryAcquire();
       if(!a)throw new BusinessException("资源已用完");

        act.accept(null);

    }

    public void returnResource()  {
            semaphore.release();//还锁
    }




}
