/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/5 15:36
 */
package com.wecan.commonutils.commonClass.lock;



import com.wecan.commonutils.commonClass.exception.BusinessException;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * 顺序自旋锁
 */

public class QueueSpinLock {

    //当期线程能占用的锁的序号
    private Integer ticketNum = 0;

    //锁进行到的序号
    private AtomicInteger ownerNo = new AtomicInteger(0);


    public void lock(Integer ticket) throws InterruptedException {
        int time = 0;
        ticketNum = ticket;
        while (!ticket.equals(ownerNo.get()) ) {
            //开始自旋
            time++;
            Thread.sleep(1000);
            if(time==5){
                throw new BusinessException("远程文件被占用,执行超时,请稍后重试");
            }
        }
        System.out.println(ticket.toString()+"获得了锁");
    }

    public void unlock() {
        ownerNo.incrementAndGet();
    }


}
