package com.wecan.commonutils.commonClass.util;

import java.util.function.Consumer;

/**
 * @ClassName: ThrowingConsumer
 * @Description: 重写Java8的Consumer中的异常抛出
 * @author:Erwin.Zhang
 * @date: 2021-03-01 10:59:19
 */
@FunctionalInterface
public interface ThrowingConsumer<T> extends Consumer<T> {

    @Override
    default void accept(final T e) {
        try {
            accept0(e);
        } catch (Throwable ex) {
            Throwing.sneakyThrow(ex);
        }
    }

    void accept0(T e) throws Throwable;

}