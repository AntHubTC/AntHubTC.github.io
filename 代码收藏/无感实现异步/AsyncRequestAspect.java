package com.xinchao.trade.aop;

import cn.hutool.core.lang.UUID;
import com.xinchao.trade.api.common.Code;
import com.xinchao.trade.api.common.RespData;
import com.xinchao.trade.api.exception.BizException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.util.concurrent.ListenableFutureTask;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.Callable;
import java.util.concurrent.Executor;

import static org.springframework.core.Ordered.HIGHEST_PRECEDENCE;

/**
 * @author XC16775
 */
@Aspect
@Component
@Slf4j
@Order(HIGHEST_PRECEDENCE)
public class AsyncRequestAspect {

    @Autowired
    private AsyncRequestDataService asyncRequestDataService;
    @Autowired
    private Executor executor;

    @Pointcut("@annotation(com.xinchao.trade.aop.AsyncHandler)")
    public void annoCheck() {
    }

    @Around("annoCheck()")
    public Object doAround(ProceedingJoinPoint joinPoint){
        HttpServletRequest request = getHttpRequestArgs(joinPoint.getArgs());
        String async = request.getParameter("async");
        if(!"true".equals(async)){
            try {
                return joinPoint.proceed();
            } catch (Throwable throwable) {
                log.error("同步调用报错:",throwable);
                return RespData.failed();
            }
        }
        log.info("异步接口");
        String requestId = UUID.randomUUID(true).toString(true);
        request.setAttribute("asyncTaskId",requestId);
        AsyncReqData asyncReqData = asyncRequestDataService.addTaskData(requestId);
        ListenableFutureTask<Object> task = new ListenableFutureTask(new Callable() {
            @SneakyThrows
            @Override
            public Object call() {
                Object proceed = joinPoint.proceed();
                return proceed;
            }
        });
        task.addCallback(new ListenableFutureCallback<Object>(){
            @Override
            public void onSuccess(Object resp) {
                asyncRequestDataService.success(requestId,resp);
            }

            @Override
            public void onFailure(Throwable throwable) {
                asyncRequestDataService.failure(requestId,throwable);
            }
        });
        executor.execute(task);
        return RespData.news(asyncReqData.getRequestId());
    }



    private HttpServletRequest getHttpRequestArgs(Object[] args) {
        if(args != null && args.length>0){
            for (int i = 0; i < args.length; i++) {
                if(args[i] instanceof HttpServletRequest){
                    return (HttpServletRequest)args[i];
                }
            }
        }
        log.error("异步处理接口必须包含HttpServletRequest类型参数");
        throw new BizException(Code.SYSTEM_ERROR);
    }
}
