/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 17:51
 */
package com.wecan.commonutils.commonClass.util;

import java.util.Objects;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class LambdaUtil {
    /**
     * @param <T>
     * @param startIndex 开始遍历的索引
     * @param elements   集合
     * @param action
     */
    public static <T> void forEach(int startIndex, Iterable<? extends T> elements, BiConsumer<? super T, Integer> action) {
        Objects.requireNonNull(elements);
        Objects.requireNonNull(action);
        if (startIndex < 0) {
            startIndex = 0;
        }
        int index = 0;
        for (T element : elements) {
            index++;
            if (index <= startIndex) {
                continue;
            }

            action.accept(element, index - 1);
        }
    }
}

