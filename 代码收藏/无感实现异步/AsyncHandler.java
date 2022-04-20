package com.minibyte.aop;

import java.lang.annotation.*;

/**
 * @author
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Target(ElementType.METHOD)
public @interface AsyncHandler {
}
