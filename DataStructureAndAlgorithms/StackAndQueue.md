# 栈和队列

## 栈

### 介绍

​		栈(Stack)是一个**后进先出**(Last in first out,LIFO)的线性表(顺序表、链表)， 它要求只在**表尾**进行删除和插入操作。

​		对于栈来说，这个表尾称为栈的**栈顶**(top)，相应的表头称为**栈底**(bottom)。

​		栈的**插入操作**(Push)，叫做**进栈**，也称为压栈，入栈。类似子弹放入弹夹的动作。

​		栈的**删除操作**(Pop)，叫做**出栈**，也称为弹栈。类似弹夹中的子弹出夹。

​		因为栈的本质是一个线性表，线性表有两种存储形式，那么栈也有分为栈的顺序存储结构和栈的链式存储结构。

​		最开始栈中不含有任何数据，叫做**空栈**，此时栈顶就是栈底。然后数据从栈顶进入，栈顶栈底分离，整个栈的当前容量变大。数据出栈时从栈顶弹出，栈顶下移，整个栈的当前容量变小。

![栈的示意图](.\img\1570601158831.png)

### 存储结构练习代码

Stack.java

```java
package com.tc.dsa.stack;

public interface Stack<E> {
    public E push(E item);

    public E pop();

    public int size();
}
```

ArrayStack.java

```java
package com.tc.dsa.stack;

import java.util.Arrays;

/**
 * 基于数组的栈
 */
public class ArrayStack<E> implements Stack<E>{
    // 初始容量
    private static final int INIT_CAPACITY = 10;
    // 增长容量
    private static final int INCREMENT_CAPACITY = 10;

    private Object[] elements;

    // 栈顶
    private int top;
    // 栈底(如果栈底没有特殊要求需要动的情况，我们是可以不使用这个栈底编号的，默认是0就可以了)
    private int bottom;

    public ArrayStack() {
        this.elements = new Object[INIT_CAPACITY];
        this.top = this.bottom = 0;
    }

    @Override
    public E push(E item) {
        int stackCapacity = elements.length;
        if (top - bottom >= stackCapacity) {
            this.elements = Arrays.copyOf(this.elements, stackCapacity + INCREMENT_CAPACITY);
        }
        this.elements[this.top] = item;
        this.top ++;

        return item;
    }

    @Override
    public E pop() {
        Object item = this.elements[this.top - 1];
        this.top --;
        return (E) item;
    }

    @Override
    public int size() {
        return top - bottom;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("[");
        int size = size();
        for (int i = 0; i < size; i++) {
            builder.append(elements[i]);
            if (i != size - 1) {
                builder.append(",");
            }
        }
        builder.append("]");
        return "ArrayStack=" + builder.toString();
    }
}

```

StackTest.java

```java
	public void testStack(Stack<String> stack) {
        for (int i = 0; i < 26; i++) {
            stack.push(String.valueOf((char)('A' + i)));
        }
        System.out.println("栈的大小：");
        System.out.println(stack.size());
        System.out.println("栈的内容:");
        System.out.println(stack);
        System.out.println("弹出栈：");
        while (stack.size() != 0) {
            String str = stack.pop();
            System.out.print(str + " ");
        }
        System.out.println();
        System.out.println("栈的大小：");
        System.out.println(stack.size());
    }

    // 栈的顺序存储结构
    @Test
    public void testArrayStack() {
        Stack<String> stack = new ArrayStack<String>();
        testStack(stack);
    }
```

### 链式结构练习代码

ListStack.java

```java
package com.tc.dsa.stack;

import java.io.Serializable;

/**
 * 基于链表的栈
 */
public class LinkStack<E> implements Stack<E>{
    private Node<E> top; // 栈顶

    // 为了不去遍历累加得到栈的大小，直接维护一个栈的大小变量
    int size;

    public LinkStack() {
    }

    @Override
    public E push(E item) {
        Node<E> node = new Node<E>(item);
        if (top == null) {
            top = node;
        } else {
            node.next = top;
            top = node;
        }
        size++;
        return item;
    }

    @Override
    public E pop() {
        if (top == null) {
            return null;
        }
        E item = top.data;
        top = top.next; // 弹出
        size--; // 大小改变
        return item;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        Node<E> node = this.top;
        while (null != node) {
            builder.append(node.data);
            if (node.next != null) {
                builder.append(",");
            }
            node = node.next;
        }

        // 为了要看出入栈顺序，将字符反转
        builder = builder.reverse();

        return "ArrayStack=[" + builder + "]";
    }

    private static class Node<E> implements Serializable{
        E data;
        Node<E> next;

        public Node() {
        }

        public Node(E data) {
            this.data = data;
        }
    }
}
```

StackTest.java

```java
	// 栈的链式存储结构
    @Test
    public void testLinkStack() {
        Stack<String> stack = new LinkStack<String>();
        testStack(stack);
    }
```

输出结果:

> 栈的大小：
> 26
> 栈的内容:
> ArrayStack=[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]
> 弹出栈：
> Z Y X W V U T S R Q P O N M L K J I H G F E D C B A 
> 栈的大小：
> 0

### 实战：二进制转十进制（栈）

利用栈的数据结构特点，将二进制转换为十进制数。

分析：

​	二进制转十进制方法：![1570613697518](.\img\1570613697518.png)

一个二进制数要转换为相应的十进制数，就是从最低位起用每一位去乘以对应位的积，也就是说用第n位去乘以2^(n-1)，然后全部加起来。相关知识了解[二进制、八进制、十进制、十六进制之间的转换](https://jingyan.baidu.com/article/495ba84109665338b30ede98.html)

代码（代码中使用了上面现有的Stack代码。）：

```java

    // 通过二进制字符串生成栈
    public static Stack<Integer> genStackByBinStr (String binStr) {
        Stack<Integer> stack = new LinkStack<Integer>();
        for (int i = 0; i < binStr.length(); i++) {
            Integer num = Integer.valueOf(String.valueOf(binStr.charAt(i)));
            stack.push(num);
        }
        return stack;
    }

    // 二进制转十进制
    public static String binToDec (Stack<Integer> stack) {
        int sum = 0, n = 0;
        Integer curNum;
        while ((curNum = stack.pop()) != null) {
            sum += curNum * Math.pow(2, n++);
        }
        return String.valueOf(sum);
    }

    // 二进制转八进制    将三位二进制转换为10进制然后拼接起来就是八进制
    public static String binToOct (Stack<Integer> stack) {
        StringBuilder resultBuilder = new StringBuilder();
        Integer curNum = null;
        int n = 0, sum = 0;
        while ((curNum = stack.pop()) != null) {
            sum += curNum * Math.pow(2, n);
            n = (n + 1) % 3;
            if (n % 3 == 0) {
                resultBuilder.insert(0, sum); // 在头部插入,后面的插入在前面
                sum = 0;
            }
        }
        if (n % 3 != 0) {
            resultBuilder.insert(0, sum); // 在头部插入,后面的插入在前面
            sum = 0;
        }
//        方法二：
//        while (true) {
//            int sum = 0;
//            if ((curNum = stack.pop()) != null) {
//                sum += curNum * Math.pow(2, 0);
//                if ((curNum = stack.pop()) != null) {
//                    sum += curNum * Math.pow(2, 1);
//                    if ((curNum = stack.pop()) != null) {
//                        sum += curNum * Math.pow(2, 2);
//                        resultBuilder.insert(0, sum);
//                    } else {
//                        resultBuilder.insert(0, sum);
//                        break;
//                    }
//                } else {
//                    resultBuilder.insert(0, sum);
//                    break;
//                }
//            } else {
//                break;
//            }
//        }
        return resultBuilder.toString();
    }

    // 二进制转16进制    将四位二进制转换为10进制然后拼接起来就是十六进制
    public static String binToHex (Stack<Integer> stack) {
        StringBuilder resultBuilder = new StringBuilder();
        Integer curNum = null;
        int n = 0, sum = 0, binBitNum = 4;
        while ((curNum = stack.pop()) != null) {
            sum += curNum * Math.pow(2, n);
            n = (n + 1) % binBitNum;
            if (n % binBitNum == 0) {
                String str = String.valueOf((sum >= 10) ? (char)('A' + sum - 10): String.valueOf(sum));
                resultBuilder.insert(0, str); // 在头部插入,后面的插入在前面
                sum = 0;
            }
        }
        if (n % binBitNum != 0) {
            String str = String.valueOf((sum >= 10) ? (char)('A' + sum - 10): String.valueOf(sum));
            resultBuilder.insert(0, str); // 在头部插入,后面的插入在前面
            sum = 0;
        }

        return resultBuilder.toString();
    }

    @Test
    public void testBinToDec() {
        String binStr = "11011111001";
        Stack<Integer> stack = null;

        System.out.print("二进制:");
        System.out.println(binStr);

        System.out.print("十进制:");
        stack = genStackByBinStr(binStr);
        String decStr = binToDec(stack);
        System.out.println(decStr);

        System.out.print("八进制:");
        stack = genStackByBinStr(binStr);
        String octStr = binToOct(stack);
        System.out.println(octStr);

        System.out.print("十六进制:");
        stack = genStackByBinStr(binStr);
        String hexStr = binToHex(stack);
        System.out.println(hexStr);
    }
```

输出结果(下面的结果可以使用windows自带的calc计算器来验证)：

> 二进制:11011111001
> 十进制:1785
> 八进制:3371
> 十六进制:6F9

### 实战：使用栈实现带括号的加减乘除



https://blog.csdn.net/zdluffy/article/details/98887407