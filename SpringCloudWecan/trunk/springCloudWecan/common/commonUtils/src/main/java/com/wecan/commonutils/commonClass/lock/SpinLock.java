/**
 * @description:
 * @author: yaodui
 * @time: 2021/8/5 15:03
 */
package com.wecan.commonutils.commonClass.lock;

import java.util.concurrent.atomic.AtomicReference;

/**
 * 自旋锁
 * 使用了CAS原子操作，lock函数将owner设置为当前线程，并且预测原来的值为空。unlock函数将owner设置为null，并且预测值为当前线程。
 * <p>
 * 当有第二个线程调用lock操作时由于owner值不为空，导致循环一直被执行，直至第一个线程调用unlock函数将owner设置为null，第二个线程才能进入临界区。
 * <p>
 * 由于自旋锁只是将当前线程不停地执行循环体，不进行线程状态的改变，所以响应速度更快。但当线程数不停增加时，性能下降明显，因为每个线程都需要执行，占用CPU时间。如果线程竞争不激烈，并且保持锁的时间段。适合使用自旋锁。
 * <p>
 * 注：该例子为非公平锁，获得锁的先后顺序，不会按照进入lock的先后顺序进行。
 */

public class SpinLock {
    private AtomicReference<Thread> sign = new AtomicReference<>();


    public void lock() {

        Thread current = Thread.currentThread();

        while (!sign.compareAndSet(null, current)) {

        }

    }


    public void unlock() {

        Thread current = Thread.currentThread();

        sign.compareAndSet(current, null);

    }

}
