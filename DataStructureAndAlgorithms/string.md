# 串

## 串的定义

​	串（String）----零个或多个任意字符组成的有限序列。

​	空串----长度为0的串。

​	子串-----一个串中任意个连续字符组成的子序列（含空串）称为改串的子串。

​	真子串----是指不包含自身的所有子串。  

​	主串----包含子串的串相应地称为主串。

​	 字符位置---字符在序列中的序号为该字符在串中的位置。

​     子串位置----子串第一个字符在主串中的位置。

​      空格串-----由一个或多个空格组成的串，与空串不同。

​      串相等-----当且仅当两个串的长度相等并且各个对应位置上的字符都相同时，这两个串才是相等的。

​	  所有空串都是相等的。

## 串的存储结构

​		串的存储结构可以采用顺序存储结构（顺序串）或者链式存储结构（链串）。

### 串的顺序存储结构

​		实际当中，对串的插入删除很少，实际匹配查找更多，所以顺序存储结构用的更多

```c
#define MAXLEN 255
typedef struct {
	char ch[MAXlEN]; // 存储串的一维数组
	int length; // 串的当前长度
} SString;
```

### 串的链式存储结构--块链结构

```c
#define CHUNKSIZE 80 // 块的大小可由用户自定义
typedef struct Chunk{
    char ch[CHUNKSIZE];
    struct Chunk *next;
} Chunk;

typedef struct{
    Chunk *head, *tail; // 串的头指针和尾指针
    int curlen; // 串的当前长度
} LString; // 字符串的块链结构
```

## 串的匹配算法

​		**算法目的：**

​				确定串中所含子串（模式串）第一次出现的位置（定位）。

​		**算法应用：**

​				搜索引擎、拼写检查、语言翻译、数据压缩等。

​		**算法种类：**

- ​		BF算法（Brute-Force，又称古典的、经典的、朴素的、穷举的）
- ​         KMP算法（特点：速度快）

## BF算法

​		Brute-Force简称为BF算法，也成为简单匹配算法。采用穷举法的思路。

​		算法的思路是从S的每一个字符开始依次与T的字符进行匹配。

```java
	/**
     * BF算法字符串匹配
     * @param str 主串
     * @param subStr 子串
     * @param pos 开始查找位置
     * @return
     */
    public static int index_BF(String str, String subStr, int pos) {
        if (str.length() < subStr.length()) {
            return -1;
        }

        // BF 算法  算法复杂度： T(n)=O(n*m)
        for (int i = pos, j = 0; i < str.length() && j < subStr.length(); i++, j++) {
            if (str.charAt(i) != subStr.charAt(j)) {
                i = i - j;
                j = -1;
            } else if (j == subStr.length() - 1) {
                return i - j; // 返回匹配下标
            }
        }

        return -1;
    }

    public static int index_BF(String str, String subStr) {
        return index_BF(str, subStr, 0);
    }

    public static void main(String[] args) {
        System.out.println(index_BF("hjadhjdfuadhjfdoaoiewo", "hjd"));
    }
```

## KMP算法

​	KMP算法是D.E.**K**nuth、J.H.**M**orris和V.R.**P**rattg共同提出的，简称**KMP算法**。

​	该算法较BF算法有较大改进，从而使算法效率有了某种程度的提高。

​	这个算法理解起来稍微有点困难，多看哈视频还是能够理解的。[地址](https://www.bilibili.com/video/BV1nJ411V7bd?p=67)

### 设计思想

​	利用已经部分匹配的结果而加快模式串的滑动速度，且主串S的指针i不必回溯！可提速到O(n+m)!

​	定义next[j]函数，表明当模式中第j个字符与主串中相应字符“失配”时，在模式中需重新和主串中该字符进行比较的字符的位置。

​						  |  max{k|1<k<j，且"p1....pk-1" = "pj-k+1....pj-1"}

​		next[j] =   |  0    当j=1时

​						  | 1    其他情况
$$
p_1 ... p_{k-1} 从头开始的k-1个元素 \\
p_{j-k+1} ... p_{j-1} j前面的k-1个元素
$$

| j       | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   | 16   | 17   |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 模式串  | a    | b    | c    | a    | a    | b    | b    | c    | a    | b    | c    | a    | a    | b    | d    | a    | b    |
| next[j] | 0    | 1    | 1    | 1    | 2    | 2    | 3    | 1    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 1    | 2    |

```java

    /**
     * BF算法字符串匹配
     * @param str 主串
     * @param subStr 子串
     * @param pos 开始查找位置
     * @return
     */
    public static int index_KMP(String str, String subStr, int pos) {
        if (str.length() < subStr.length()) {
            return -1;
        }

        int[] nextJ = getKmpNextJ(subStr);

        // BF 算法  算法复杂度： T(n)=O(n*m)
        for (int i = pos, j = 0; i < str.length() && j < subStr.length(); i++, j++) {
            if (str.charAt(i) != subStr.charAt(j)) {
                j = nextJ[j];
            } else if (j == subStr.length() - 1) {
                return i - j; // 返回匹配下标
            }
        }

        return -1;
    }

    public static int index_KMP(String str, String subStr) {
        return index_KMP(str, subStr, 0);
    }

    public static int[] getKmpNextJ(String ps) {
        char[] p = ps.toCharArray();
        int[] next = new int[p.length];
        next[0] = -1;
        int j = 0;
        int k = -1;
        while (j < p.length - 1) {
            if (k == -1 || p[j] == p[k]) {
                next[++j] = ++k;
            } else {
                k = next[k];
            }
        }
        return next;
    }

    public static void main(String[] args) {
        String str = "hjadhjdfuadhjfdoaoiewo";
        String subStr = "hjd";
        // System.out.println(index_BF(str, subStr));
        System.out.println(index_KMP(str, subStr));
    }
```

改进:

```java
    public static int[] getKmpNextJ(String ps) {
        char[] p = ps.toCharArray();
        int[] next = new int[p.length];
        next[0] = -1;
        int j = 0;
        int k = -1;
        while (j < p.length - 1) {
            if (k == -1 || p[j] == p[k]) {
                if (p[++j] == p[++k]) { // 当两个字符相等时要跳过
                    next[j] = next[k];
                } else {
                    next[j] = k;
                }
            } else {
                k = next[k];
            }
        }
        return next;
    }
```

