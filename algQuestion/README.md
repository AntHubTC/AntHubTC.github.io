# 深度优先

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



# 动态规划

> 问题：上台阶可以一步上，也可以两步上，求第N个台阶有几种方法。

分析：

要求第N个台阶有几种方法，可以使用动态规划的方法来解决。设dp[i]表示到达第i个台阶的方法数，则有以下递推关系：

- 当i = 1时，只有一种方法到达第一个台阶，即dp[1] = 1；
- 当i = 2时，有两种方法到达第二个台阶，可以一步一步上或者一次性上两步，即dp[2] = 2；
- 当i > 2时，到达第i个台阶的方法数为到达第i-1个台阶的方法数加上到达第i-2个台阶的方法数，即dp[i] = dp[i-1] + dp[i-2]。

因此，可以通过填充数组dp来求解第N个台阶的方法数。

```java
public class Staircase {
    // 定义一个方法来计算到达第N个台阶的方法数
    public static int countWaysToNthStair(int n) {
        // 如果N为1，只有一种方法到达第一个台阶
        if (n == 1)
            return 1;
        // 如果N为2，有两种方法到达第二个台阶
        else if (n == 2)
            return 2;

        // 创建一个数组来存储每个台阶的方法数
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;

        // 使用循环填充数组，根据递推关系dp[i] = dp[i-1] + dp[i-2]来计算到达每个台阶的方法数
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }

        // 返回第N个台阶的方法数
        return dp[n];
    }

    public static void main(String[] args) {
        // 输入第N个台阶的值
        int N = 10; // 可以根据需要更改N的值
        System.out.println("到达第 " + N + " 个台阶的方法数为：" + countWaysToNthStair(N));
    }
}
```

