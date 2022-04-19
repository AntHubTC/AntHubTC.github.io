package com.xinchao.trade.aop;

import java.lang.annotation.*;

/**
 * @author XC16775
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Target(ElementType.METHOD)
public @interface AsyncHandler {
}
