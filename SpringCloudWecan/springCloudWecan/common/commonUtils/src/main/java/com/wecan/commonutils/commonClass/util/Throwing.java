/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/15 10:02
 */
package com.wecan.commonutils.commonClass.util;
import  javax.annotation.Nonnull;

import java.util.function.Consumer;

public class Throwing {
    private Throwing() {}

    @Nonnull
    public static <T> Consumer<T> rethrow(@Nonnull final ThrowingConsumer<T> consumer) {
        return consumer;
    }

    /**
     * The compiler sees the signature with the throws T inferred to a RuntimeException type, so it allows the unchecked
     * exception to propagate.
     *
     * http://www.baeldung.com/java-sneaky-throws
     */
    @SuppressWarnings("unchecked")
    @Nonnull
    public static <E extends Throwable> void sneakyThrow(@Nonnull final Throwable ex) throws E {
        throw (E)ex;
    }
}
