package com.minibyte.aop;

import lombok.Data;

/**
 * @author
 */
@Data
public class AsyncReqData {
    /**
     * 请求ID
     */
    private String requestId;

    /**
     * 状态 1；执行中 2；成功 3：失败
     */
    private int status;

    /**
     * 任务返回值
     */
    private Object retData;

    /**
     * 报错信息
     */
    private String errMsg;

    /**
     * 请求发起时间戳
     */
    private long timestamp;
}
