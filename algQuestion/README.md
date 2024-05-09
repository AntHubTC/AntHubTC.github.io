# 首页

## 递归

### 斐波那契数列

问题：斐波那契数列指的是这样一个数列 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233，377，610，987，1597，2584，4181，6765，10946，17711，28657，46368……

特别指出：第0项是0，第1项是第一个1。

这个数列从第三项开始，每一项都等于前两项之和。

以下实例演示了 Java 斐波那契数列的实现：

```java
public class MainClass {
    public static void main(String[] args) {
        for (int counter = 0; counter <= 10; counter++){
            System.out.printf("Fibonacci of %d is: %d\n", counter, fibonacci(counter));
        }
    }
 
    public static long fibonacci(long number) {
        if ((number == 0) || (number == 1))
            return number;
        else
            return fibonacci(number - 1) + fibonacci(number - 2);
    }
}
```

动画版本：[algQuestion](https://github.com/AntHubTC/algQuestion)工程 com.tc.alg.recursion.FibonacciIssue

![FibonacciIssue](./img/FibonacciIssue.gif)

**带记忆的优化版本：**

![带记忆的优化版本)](./img/FibonacciIssue_v2.gif)

## 深度优先

### 求感染面积

> 问题：给一个感染矩阵，1代表感染，0代表没感染，求最大感染区的面积

```java
public class MaxInfectionArea {
    
    // 主函数，计算最大感染区的面积
    public static int maxInfectionArea(int[][] grid) {
        int maxArea = 0; // 初始化最大感染区的面积为0
        int rows = grid.length; // 获取矩阵的行数
        int cols = grid[0].length; // 获取矩阵的列数
        
        // 遍历整个矩阵
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                // 如果当前位置为感染区（值为1），进行深度优先搜索（DFS）
                if (grid[i][j] == 1) {
                    int area = dfs(grid, i, j); // 计算当前感染区的面积
                    maxArea = Math.max(maxArea, area); // 更新最大感染区的面积
                }
            }
        }
        
        return maxArea; // 返回最大感染区的面积
    }
    
    // 深度优先搜索函数，用于计算感染区的面积
    public static int dfs(int[][] grid, int i, int j) {
        int rows = grid.length; // 获取矩阵的行数
        int cols = grid[0].length; // 获取矩阵的列数
        
        // 如果当前位置超出矩阵范围或者当前位置不是感染区（值为0），返回面积0
        if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] == 0) {
            return 0;
        }
        
        grid[i][j] = 0; // 将当前位置标记为已访问
        
        int area = 1; // 初始化当前感染区的面积为1（当前位置已经是感染区）
        // 分别向上、下、左、右四个方向进行深度优先搜索，并累加面积
        area += dfs(grid, i+1, j);
        area += dfs(grid, i-1, j);
        area += dfs(grid, i, j+1);
        area += dfs(grid, i, j-1);
        
        return area; // 返回当前感染区的面积
    }
    
    // 主函数，用于测试
    public static void main(String[] args) {
        int[][] grid = { // 给定的感染矩阵
            {1, 1, 0, 0, 1},
            {1, 0, 0, 1, 0},
            {0, 1, 1, 1, 1},
            {0, 0, 1, 1, 1},
            {1, 0, 1, 0, 0}
        };
        
        // 输出最大感染区的面积
        System.out.println("最大感染区的面积为: " + maxInfectionArea(grid));
    }
}
```

动画版本：[algQuestion](https://github.com/AntHubTC/algQuestion)工程 com.tc.alg.dfs.MaximumInfectionArea

![](img/MaximumInfectionArea.gif)



## 动态规划

### 上台阶问题

> 问题：上台阶可以一步上，也可以两步上，求第N个台阶有几种方法。

分析：

要求第N个台阶有几种方法，可以使用动态规划的方法来解决。设dp[i]表示到达第i个台阶的方法数，则有以下递推关系：

- 当i = 1时，只有一种方法到达第一个台阶，即dp[1] = 1；
- 当i = 2时，有两种方法到达第二个台阶，可以一步一步上或者一次性上两步，即dp[2] = 2；
- 当i > 2时，到达第i个台阶的方法数为到达第i-1个台阶的方法数加上到达第i-2个台阶的方法数，即dp[i] = dp[i-1] + dp[i-2]。

因此，可以通过填充数组dp来求解第N个台阶的方法数。 其实这个问题就是斐波那契数列问题类似。

> 斐波那契数列指的是这样一个数列 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233，377，610，987，1597，2584，4181，6765，10946，17711，28657，46368……
>
> 特别指出：第0项是0，第1项是第一个1。
>
> **这个数列从第三项开始，每一项都等于前两项之和。**

```java
package com.tc.alg.dfs;

public class StairAlgIssue {

    public static void main(String[] args) {
        /**
         * 问题：上台阶可以一步上，也可以两步上，求第N个台阶有几种方法。
         *
         * 拿到问题开始分析：
         * 要求第N个台阶有几种方法，可以使用动态规划的方法来解决。设dp[i]表示到达第i个台阶的方法数，则有以下递推关系：
         * 当i = 1时，只有一种方法到达第一个台阶，即dp[1] = 1；
         * 当i = 2时，有两种方法到达第二个台阶，可以一步一步上或者一次性上两步，即dp[2] = 2；
         * 当i > 2时，到达第i个台阶的方法数为到达第i-1个台阶的方法数加上到达第i-2个台阶的方法数，即dp[i] = dp[i-1] + dp[i-2]。
         * 因此，可以通过填充数组dp来求解第N个台阶的方法数。
         */
        int targetNth = 10;
        // long result = countWaysToNthStair1(targetNth);
        long result = countWaysToNthStair2(targetNth);
        System.out.printf("到达第%s个台阶有%s种方法%n", targetNth, result);
    }


    // 递归求解(效率不高，会有很多重复计算)
    public static long countWaysToNthStair1(int n) {
        // 如果N为1，只有一种方法到达第一个台阶
        if (n == 1) return 1;
        // 如果N为2，有两种方法到达第二个台阶
        if (n == 2) return 2;

        return countWaysToNthStair1(n - 1) + countWaysToNthStair1(n - 2);
    }

    // 递推求解
    public static long countWaysToNthStair2(int n) {
        // 如果N为1，只有一种方法到达第一个台阶
        if (n == 1) return 1;
        // 如果N为2，有两种方法到达第二个台阶
        if (n == 2) return 2;

        // 创建一个数组来存储每个台阶的方法数(最好使用long来进行存储，int很快就要超长)
        long[] dp = new long[n + 1];
        dp[1] = 1;
        dp[2] = 2;

        // 使用循环填充数组，根据递推关系dp[i] = dp[i-1] + dp[i-2]来计算到达每个台阶的方法数
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        // 返回第N个台阶的方法数
        return dp[n];
    }

}
```

动画版本：[algQuestion](https://github.com/AntHubTC/algQuestion)工程 com.tc.alg.derivation.StairAlgIssue

![StairAlgIssue](./img/StairAlgIssue.gif)
