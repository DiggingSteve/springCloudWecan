/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/14 16:42
 */
package com.wecan.file.controller;

import com.wecan.commonutils.commonClass.lock.ResourceManage;

import java.util.concurrent.CountDownLatch;

public class SemaphoreTest implements Runnable {

    private ResourceManage resourceManage;
    private int userId;
    private CountDownLatch countDownLatch;

    public SemaphoreTest(ResourceManage resourceManage, int userId, CountDownLatch countDownLatch) {
        this.resourceManage = resourceManage;
        this.userId = userId;
        this.countDownLatch = countDownLatch;
    }

    public void run() {
        try {
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.print("userId:" + userId + "准备使用资源...\n");
        //resourceManage.useResource(userId);
        System.out.print("userId:" + userId + "使用资源完毕...\n");
    }
}