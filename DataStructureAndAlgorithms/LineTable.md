# 线性表

## 定义

​	由**零个或多个**数据元素组成的有限**序列**。

- 序列：有序的列表。
- 若元素存在多个，则第一个元素无前驱，而最后一个元素无后继，其它元素都有且只有一个前驱和后继。
- 线性表强调是有限的，事实上无论计算机发展到多强大，它所处理的元素都是有限的。

## 线性表顺序存储结构

### 存储结构介绍

顺序存储结构封装需要三个属性：

1. 存储空间的起始位置，**数组**data，它的存储位置就是线性表存储空间的存储位置。
2. 线性表的最大存储容量：数组的长度MaxSize
3. 线性表的当前长度length

> 数组的长度与线性表的当前长度需要区分一下：数组的长度是存放线性表的存储空间的总长度，一般初始化后不变。而线性表的当前长度是线性表中元素的个数，是会变化的。

### 数据结构优缺点

优点：

- 无须为表示表中元素之间的逻辑关系而增加额外的存储空间。
- 可以快速地存取表中任意位置的元素。

缺点：

- 插入和删除操作需要移动大量元素。
- 当线性表长度变化较大时，难以确定存储空间的容量。
- 容易造成存储空间的“碎片”。

### 练习代码

![1569809828662](.\img\1569809828662.png)

List.java

```java
package com.tc.dsa.line.list;

public interface List<E> {

    /**
     * 获取一个元素
     * @param pos 从0开始到len-1
     * @return
     */
    public E getElem(int pos);

    /**
     * 新增一个元素
     * @param elem
     */
    public List<E> insert(E elem);

    /**
     * 删除一个元素
     * @param elem
     */
    public List<E> delete(E elem);

    /**
     * 检查是否为空
     *
     * @return
     */
    public boolean isEmpty();

    /**
     * 清空一个列表
     */
    public void emptyList();

    /**
     * 检测元素在列表中的位置，查找成功返回第一个匹配元素的位置，否则-1
     *
     * @param elem
     * @return 从0开始到len-1的位置
     */
    public int locateElem(E elem);

    /**
     * 序列转换为数组
     * @return
     */
    public Object[] toArray();

    /**
     * 序列转换为数组
     * @param a
     * @param <T>
     * @return
     */
    public <T> T[] toArray(T[] a);

    /**
     * 获取序列当前的大小
     * @return
     */
    public int size();
}
```

ArrayList.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;

public class ArrayList <E> implements List<E>, Serializable {
    // 存放元素的数组
    private Object[] elementData;

    // 当前已经存储元素的大小
    private int size = 0;

    /**
     * 初始容量
     */
    private static final int INIT_CAPACITY = 10;

    private static final Object[] EMPTY_OBJECTS = new Object[0];

    public ArrayList() {
        this.elementData = new Object[INIT_CAPACITY];
    }

    /**
     * 创建一个list，分配容量为capacity
     * @param capacity
     */
    public ArrayList(int capacity) {
        // 虚拟机对数组的大小是有限制的，如果给一个Integer.MAX_VALUE，那么会报java.lang.OutOfMemoryError: Requested array size exceeds VM limit
        // 所以去看JDK中ArrayList的源码能看到对这个最大数组大小的控制。
        this.elementData = new Object[capacity];
    }

    /**
     * 从数组创建一个list
     * @param list
     */
    public ArrayList(E[] list) {
        int capacity = list.length > INIT_CAPACITY ? list.length : INIT_CAPACITY;
        this.elementData = new Object[capacity];
        System.arraycopy(list, 0, this.elementData, 0, list.length);
    }

    public ArrayList(List<? extends E> list) {
        this.elementData = list.toArray();
        this.size = list.size();
        elementData = Arrays.copyOf(elementData, size, Object[].class);
    }

    public E getElem(int pos) {
        if (pos < 0 && pos >= size) {
            throw new IndexOutOfBoundsException();
        }
        return (E) this.elementData[pos];
    }

    public List<E> insert(E elem) { // 时间复杂度为1
        if (this.size > this.elementData.length - 1) {
            Object[] newDataElems = new Object[this.elementData.length + INIT_CAPACITY * 2];
            System.arraycopy(this.elementData, 0, newDataElems, 0, this.elementData.length);
            this.elementData = newDataElems;
        }
        this.elementData[this.size ++] = elem;

        return this;
    }

    public List<E> delete(E elem) { // 时间复杂度为1
        int loc = locateElem(elem);
        if (loc != -1) {
            System.arraycopy(this.elementData, loc + 1, this.elementData, loc, this.elementData.length - loc - 1);
            this.elementData[--this.size] = null;
        }

        return this;
    }

    public boolean isEmpty() {
        return this.size == 0;
    }

    public void emptyList() {
        this.elementData = EMPTY_OBJECTS;
        this.size = 0;
    }

    public int locateElem(E elem) {
        for (int i = 0; i < size; i++) {
            if (this.elementData[i] == elem) {
                return i;
            }
        }

        return -1;
    }

    public Object[] toArray() {
        return Arrays.copyOf(this.elementData, size);
    }

    public <T> T[] toArray(T[] a) {
        if (a.length < size) {
            return (T[]) Arrays.copyOf(this.elementData, size, a.getClass());
        }
        System.arraycopy(this.elementData, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

    @Override
    public int size() {
        return this.size;
    }

    @Override
    public String toString() {
        return "ArrayList{" +
                "elementData=" + Arrays.toString(elementData) +
                ", size=" + size +
                '}';
    }
}
```

App.java测试

```java
package com.tc.dsa.line.list.test;

import org.junit.Test;

import java.util.Arrays;

public class App {
    @Test
    public void ArrayListTest() {
        System.out.println("基本构建测试");
        List<Integer> list = new ArrayList<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印测试");
        System.out.println(list.toString());

        System.out.println("超过容量测试");
        list.insert(7).insert(33).insert(37).insert(22).insert(98).insert(28).insert(48);
        System.out.println(list);

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        list.delete(100);
        list.delete(99);
        System.out.println(list);

        new java.util.ArrayList<String>(0x7fffffff);
    }
}
```



### 思考

​		顺序存储结构中，删除和在指定位置新增都需要移动大量的元素，是否能在基于数组上优化成一个不需要大量移动的结构。



## 线性表的链式存储结构

### 单链表

#### 存储结构介绍

​		线性表的链式存储结构的特点是用一组任意的存储单元存储线性表的元素,这组存储单元可以存储在内存中未被占用的任意位置。

​		比起顺序存储结构每个数据元素只需要存储一个位置就可以了。现在链式存储结构中，除了要存储数据元素信息外，还要存储它的后继元素的存储地址。

​		我们把存储数据元素信息的域称为数据域,把存储直接后继位置的域称为指针域。指针域中存储的信息称为指针或链。这两部分信息组成数据元素称为存储映像,称为结点(Node)。

​		n个节点链接成一个链表，即为线性表(a1, a2, a3,..., an)的链式存储结构。

​		因为此链表的每个节点中只包含一个指针域，所以叫做单链表。

#### 头指针与头节点的异同

**头指针**

- 头指针是指链表指向第一个节点的指针，若链表有头节点，则指向头节点的指针。
- 头指针具有标识作用，所以常用头指针冠以链表的名字（指针变量的名字）。
- 无论链表是否为空，头指针均不为空。
- 头指针是链表的必要元素。

**单链表图例**

![1569812222196](.\img\1569812222196.png)

**空链表图例**

![1569812267479](.\img\1569812267479.png)

#### 带头节点的单向链表练习

List.java

```java
package com.tc.dsa.line.list;

public interface List<E> {

    /**
     * 获取一个元素
     * @param pos 从0开始到len-1
     * @return
     */
    public E getElem(int pos);

    /**
     * 新增一个元素
     * @param elem
     */
    public List<E> insert(E elem);

    /**
     * 删除一个元素
     * @param elem
     */
    public List<E> delete(E elem);

    /**
     * 检查是否为空
     *
     * @return
     */
    public boolean isEmpty();

    /**
     * 清空一个列表
     */
    public void emptyList();

    /**
     * 检测元素在列表中的位置，查找成功返回第一个匹配元素的位置，否则-1
     *
     * @param elem
     * @return 从0开始到len-1的位置
     */
    public int locateElem(E elem);

    /**
     * 序列转换为数组
     * @return
     */
    public Object[] toArray();

    /**
     * 序列转换为数组
     * @param a
     * @param <T>
     * @return
     */
    public <T> T[] toArray(T[] a);

    /**
     * 获取序列当前的大小
     * @return
     */
    public int size();
}
```

LinkedList.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * 线性表-单向链表(带链表头节点)
 *
 */
public class LinkedList<E> implements List<E>, Serializable {
    // 头指针
    private Node<E> first;

    // 尾部指针
    private Node<E> last; // 始终指向链条末尾

    // 大小
    private int size;

    public LinkedList() {
        last = first = new Node<E>(null);
        size = 0;
    }

    private void checkIndex(int index) {
        if (!(index >= 0 && index < size)) {
            throw new IndexOutOfBoundsException();
        }
    }

    @Override
    public E getElem(int pos) {
        checkIndex(pos);

        Node<E> tNode = first.next;
        for (int i = 0; i < pos; i ++) {
            tNode = tNode.next;
        }
        return tNode.nodeData;
    }

    @Override
    public List<E> insert(E elem) {
        // 当前链表最后一个节点指向新的节点
        last.next = new Node<E>(elem);
        last = last.next; // 尾指针指向最新元素
        size ++; // 节点数变更

        return this;
    }

    @Override
    public List<E> delete(E elem) {
        Node<E> node1 = first;
        Node<E> node2 = first.next; // node2比node1快一步
        boolean isFind = false;
        while (node2 != null) {
            isFind = (node2.nodeData == null && elem == null) || node2.nodeData.equals(elem);
            if (isFind) break;
            node1 = node2;
            node2 = node2.next;
        }
        if (isFind) {
            if (last == node2) {
                // 如果删除的节点就是最后一个节点，那么当前尾指针应该指向当前元素的前一个元素。
                last = node1; // 尾部指针发生改变
            }
            // 去掉当前匹配到的节点
            node1.next = node2.next;
            size--;// 节点数量减少
        } else {
            throw new NoSuchElementException();
        }
        return this;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public void emptyList() {
        first.next = null;
        last = first;
        size = 0;
    }

    @Override
    public int locateElem(E elem) {
        int loc = -1;
        Node<E> tNode = first.next;
        for (int i = 0; null != tNode; i++, tNode = tNode.next) {
            if (tNode.nodeData == elem) {
                loc = i;
                break;
            }
        }
        return loc;
    }

    @Override
    public Object[] toArray() {
        int i = 0;
        Object[] result = new Object[size];
        for (Node<E> x = first.next; x != null; x = x.next)
            result[i++] = x.nodeData;

        return result;
    }

    @Override
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            a = (T[])java.lang.reflect.Array.newInstance(
                    a.getClass().getComponentType(), size);
        int i = 0;
        Object[] result = a;
        for (Node<E> x = first.next; x != null; x = x.next)
            result[i++] = x.nodeData;

        if (a.length > size)
            a[size] = null;

        return a;
    }

    @Override
    public int size() {
        return size;
    }

    // JDK源码中的实现是通过双向链表的形式实现的, 这里我使用的是单链表
    private static class Node<E> implements Serializable{
        E nodeData;
        Node<E> next;

        Node(E nodeData) {
            this.nodeData = nodeData;
        }

        Node(E nodeData, Node<E> next) {
            this.nodeData = nodeData;
            this.next = next;
        }
    }

    @Override
    public String toString() {
        return "LinkedList{nodes=" + Arrays.toString(this.toArray()) + "}";
    }
}
```

测试代码：

```java
	@Test
    public void LinkedListWithHead() {
        // 带头结点的单向链表
        List<Integer> list = new LinkedList<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印");
        System.out.println(list.toString());

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        System.out.println(list);
        list.delete(10);
        System.out.println(list);
        list.delete(58);
//        list.delete(99);
        System.out.println(list);
    }
```

#### 不带头节点的单向链表练习(尾部插入法)

下面是采用**尾部插入法**。

LinkedListNoHead.java

```java
package com.tc.dsa.line.list;

import java.io.Serializable;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * 线性表-单向链表(无链表头节点)
 *
 * 代码中使用了头部尾部指针，但是没有使用头节点。
 */
public class LinkedListNoHead<E> implements List<E>, Serializable{

    // 头指针
    private Node<E> first;

    // 尾部指针
    private Node<E> last; // 始终指向最后一个

    // 大小
    private int size;

    public LinkedListNoHead() {
    }

    private void checkIndex(int index) {
        if (!(index >= 0 && index < size)) {
            throw new IndexOutOfBoundsException();
        }
    }

    @Override
    public E getElem(int pos) {
        checkIndex(pos);

        Node<E> tNode = first;
        for (int i = 0; i < pos; i ++) {
            tNode = tNode.next;
        }
        return tNode.nodeData;
    }

    @Override
    public List<E> insert(E elem) {
        Node<E> newNode = new Node<E>(elem);
        if (null == last) { // 检测是否是空链表
            first = newNode; // 头指针指向第一个节点
        } else {
            // 当前链表最后一个节点指向新的节点
            last.next = newNode;
        }
        last = newNode; // 尾指针指向最新元素
        size ++; // 节点数变更

        return this;
    }

    @Override
    public List delete(Object elem) {
        if (size == 0) {
            throw new NoSuchElementException();
        }
        Node<E> node1 = first;
        Node<E> node2 = first; // node2比node1快一步
        boolean isFind = false;
        while (node2 != null) {
            isFind = (node2.nodeData == null && elem == null) || node2.nodeData.equals(elem);
            if (isFind) break;
            node1 = node2;
            node2 = node2.next;
        }
        if (isFind) {
            // 如果使用了单链表的头部节点，那么下面就不会有这么多判断
            // 匹配到的内容是否是第一个节点
            if (node2 == first) {
                first = node2.next;
            } else if (node2 == last) {
                // 如果删除的节点就是最后一个节点，那么当前尾指针应该指向当前元素的前一个元素。
                last = node1; // 尾部指针发生改变
                node1.next = node2.next;
            } else {
                // 去掉当前匹配到的节点
                node1.next = node2.next;
            }

            size--;// 节点数量减少
        } else {
            throw new NoSuchElementException();
        }

        return this;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public void emptyList() {
        first = last = null;
        size = 0;
    }

    @Override
    public int locateElem(Object elem) {
        int loc = -1;
        Node<E> tNode = first;
        for (int i = 0; null != tNode; i++, tNode = tNode.next) {
            if (tNode.nodeData == elem) {
                loc = i;
                break;
            }
        }
//        int i = 0;
//        while (null != tNode) {
//            if (tNode.nodeData == elem) {
//               loc = i;
//               break;
//            }
//            i++;
//            tNode = tNode.next;
//        }
        return loc;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public Object[] toArray() {
        int i = 0;
        Object[] result = new Object[size];
        for (Node<E> x = first; x != null; x = x.next)
            result[i++] = x.nodeData;

        return result;
    }

    @Override
    public <T> T[] toArray(T[] a) {
        if (a.length < size)
            a = (T[])java.lang.reflect.Array.newInstance(
                    a.getClass().getComponentType(), size);
        int i = 0;
        Object[] result = a;
        for (Node<E> x = first; x != null; x = x.next)
            result[i++] = x.nodeData;

        if (a.length > size)
            a[size] = null;

        return a;
    }

    // JDK源码中的实现是通过双向链表的形式实现的, 这里我使用的是单链表
    private static class Node<E> implements Serializable{
        E nodeData;
        Node<E> next;

        Node(E nodeData) {
            this.nodeData = nodeData;
        }

        Node(E nodeData, Node<E> next) {
            this.nodeData = nodeData;
            this.next = next;
        }
    }

    @Override
    public String toString() {
        return "LinkedList{nodes=" + Arrays.toString(this.toArray()) + "}";
    }
}
```

测试代码：

```java
	@Test
    public void LinkedListNoHead() {
        List<Integer> list = new LinkedListNoHead<Integer>();
        System.out.println("插入测试");
        list.insert(4).insert(9).insert(1).insert(15).insert(10);
        System.out.println("打印");
        System.out.println(list.toString());

        System.out.println("清空测试");
        list.emptyList();
        System.out.println(list);

        boolean isEmpty = list.isEmpty();
        System.out.println("isEmpty:" + isEmpty);

        System.out.println("清空后数据重新新增测试");
        list.insert(10).insert(100).insert(44).insert(5).insert(58);
        System.out.println(list);
        System.out.println("size:" +list.size());

        System.out.println("to array测试");
        Object[] objects = list.toArray();
        System.out.println("objects:" + Arrays.toString(objects));

        System.out.println("to array测试");
        Integer[] objectArr = list.toArray(new Integer[2]);
        System.out.println("objectArr:" + Arrays.toString(objectArr));

        System.out.println("定位元素测试");
        int pos = list.locateElem(5);
        System.out.println("pos:" + pos);
        pos = list.locateElem(99999);
        System.out.println("pos:" + pos);

        System.out.println("getElem测试");
        Integer elem = list.getElem(2);
        System.out.println(elem);

        System.out.println("delete测试");
        System.out.println(list);
        list.delete(44);
        System.out.println(list);
        list.delete(10);
        System.out.println(list);
        list.delete(58);
//        list.delete(99);
        System.out.println(list);
    }
```

