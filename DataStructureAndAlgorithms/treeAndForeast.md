# 树与森林

## 树和森林的定义	

树(Tree)是n(n>=0)个节点的有限集。

​			若 n = 0,称为空树；

​			若 n > 0，则它满足如下两个条件：

1. 有且仅有一个特定的称为根(Root)的节点；
2. 其余节点可分为m(m>=0)个互不想交的有限集T1，T2，T3，....,Tm，其中每一个集合本身又是一棵树，并称为根的子树(SubTree)。

森林：是m(m>=0)颗互不相交的树的集合。

## 树的存储结构

### 双亲表示法

实现：定义结构数组存放树的节点，每个节点包含两个域：

- 数据域：存放节点本身信息；
- 双亲域：指示本节点的双亲节点在数组中的位置；

eg:

| 0    | R    | -1   |
| ---- | ---- | ---- |
| 1    | A    | 0    |
| 2    | B    | 0    |
| 3    | C    | 0    |
| 4    | D    | 1    |
| 5    | E    | 1    |
| 6    | F    | 3    |
| 7    | G    | 6    |
| 8    | H    | 6    |
| 9    | K    | 6    |

```c
#define MAX_TREE_SIZE 100
typedef struct PTNode {
    TElemType data;
    int parent; // 双亲位置域
} PTNode;
typedef stuct {
    PTNode nodes[MAX_TREE_SIZE];
    int r,n; // 根结点的位置和节点个数
} PTree;
```

### 孩子链表

​		把每个节点的孩子节点排列起来，看成一个线性表，用单链表存储。则n个节点有n个孩子链表（叶子的孩子链表为空表）。而n个头指针又组成一个线性表，用顺序表（含n个元素的结构数组）存储。

​	

| 0    | A    | -->  | 3    | -->  | 5    | ^    |      |      |      |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 1    | B    | ^    |      |      |      |      |      |      |      |
| 2    | C    | -->  | 6    | ^    |      |      |      |      |      |
| 3    | D    | ^    |      |      |      |      |      |      |      |
| 4    | R    | -->  | 0    | -->  | 1    | -->  | 2    | ^    |      |
| 5    | E    | ^    |      |      |      |      |      |      |      |
| 6    | F    | -->  | 7    | -->  | 8    | -->  | 9    | ^    |      |
| 7    | G    | ^    |      |      |      |      |      |      |      |
| 8    | H    | ^    |      |      |      |      |      |      |      |
| 9    | K    | ^    |      |      |      |      |      |      |      |

```c
// 孩子节点结构
typedef struct CTNode {
    int child;
    struct CTNode *next;
} *ChildPtr;
// 双亲节点结构
typedef struct {
    TElemType data;
    ChildPtr firstChild;
} CTBox;
// 树结构
typedef struct {
    CTBox nodes[MAX_TREE_SIZE];
    int n,r; // 节点数和根结点位置
} CTree;
```

​		孩子链表找孩子容易，但是找双亲不容易。可以将上面两种存储结合一下，节点不仅存储孩子节点链表，还要存储一个双亲节点，这种存储叫带双亲的孩子链表。

### 孩子兄弟表示法（二叉树表示法，二叉链表表示法）

​	实现：用二叉链表作树的存储结构，链表中每个节点的两个指针域分别指向其第一个孩子节点和下一个兄弟节点。

```c
typedef struct CSNode {
	ElemType data;
	struct CSNode *firstcchild, *nextsibling;
} CSNode, *CSTree;
```

[视频](https://www.bilibili.com/vidtree.left = leftTreeeo/BV1nJ411V7bd?p=92)