---
title: 多边形的扫描转化算法
date: 2024-09-21 11:19:00
expires: 2024-09-30 23:59:59
mathjax: true
excerpt: "多边形的扫描转化算法"
thumbnail: "https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/44_Stella_4k.jpg"


---

**实验目的**

实现从多边形顶点表示到点阵]表示的转换，从多边形给定的边界出发，通过扫描线的方式求出位于其内部各个像素，从而达到对多边形填充的作用。

* * *

**算法思想**

按扫描线顺序，计算扫描线与多边形的相交的交点，这些交点将扫描线分割成落在多边形内部的线段和落在多边形外部的线段，并且二者相间排列。再用要求的颜色显示这些区间的所有象素。

_有效边：_指与当前扫描线相交的多边形的边，也称为活性边。

_有效边表（AET）：_把有效边按与扫描线交点 x 坐标递增的顺序存在一个链表中，此链表称为有效边表。只需对当前扫描线的活动边表作更新，即可得到下一条扫描线的活动边表。

为了方便灵活边表的建立与更新，我们为每一条扫描线建立一个新边表NET，用来存放在该扫描线第一次出现的边。

存储内容为： 
ymax：边的上端点的 y 坐标； 
x：在 ET 中表示边的下端点的 x 坐标，在 AEL 中则表示边与扫描线的交点的坐标； 
Δx：边的斜率的倒数；next：指向下一条边的指针。

* * *

**算法步骤**

1、大致确定多边形的范围，进而确定扫描线的范围

2、初始化并建立 NET 表

3、遍历每一条扫描建立 ET：对于每一个多边形点，寻找与其构成边的 两点，如果寻找到的点在此点的上方（即 y0小于y1）,则将此边加入到ET\[i\]中（i 对应的 y0 的坐标）。这样每次加入的边都是向上，不会重复。

4、置 AET 为空；

5、执行下列步骤直至 NET 和 AET 都为空． 
A.更新。如 ET 中的 y 非空，则将其中所有边取出并插入 AET 中； 
B.填充。对 AEL 中的边两两配对，每对边中 x 坐标按规则取整，获得有效的填充区段，再填充． 
C.排序。如果有新边插入 AET，则对 AET 中各边排序； 
D.删除。将 AEL 中满足 y=ymax 边删去（因为每条边被看作闭上开的） 
E.对 AEL 中剩下的每一条边的 x 递增Δx，即 x = x+Δx; 
F.将当前扫描线纵坐标 y 值递值 1；

* * *

**测试代码**

根据多边形的分类，用凹多边形测试更具代表性，而且选取的图像具有水平线段，这样更具有良好的测试作用

凹： 
polygon=\[ 
\[20,20\], 
\[70,100\], 
\[50,80\], 
\[30,120\], 
\[20,50\], 
\[50,50\] 
\]

* * *

**实验结果与分析**  
![](https://yangyang666.oss-cn-chengdu.aliyuncs.com/images/20171207204511359.png)

_空间复杂度：_数据结构为链表，链表中存放的是多边形的边长，当多形边数较少时，空间复杂度可忽略不计  
_时间复杂度：_初始化建立 NET 时，需要两个 for 循环遍历每条扫描线与多边形的边长数，O((ymax-ymin)\*多边形边长数)，当多边形边数较少时，时间复杂度近似为 O(n)。

* * *

**注意的问题与解决方法**

多边形的扫描转化算法是按照扫描线顺序，计算扫描线与多边形的相交区间，来完成填充工作，因为原理比较简单，比较需要考虑的是对一些情况的规定注意的问题：若扫描线与多边形相交的边分处扫描线的两侧，遵循左开右闭的原则，配对交点；若扫描线与多边形顶点相交，则判断此顶点左右两个顶点y1 坐标与此顶点 y 坐标的大小，选择上方顶点（即 y1>y）与此顶点构成的边加入 NET；若扫描线与多边形边界重合，则计一个交点等等。在此编写代码期间，忽略一些简单的编译错误，最值得注意的问题是：

在建立 NET 时，需要通过遍历每条扫描线与多边形的顶点 y 坐标进行匹配，选择其左右顶点坐标 y1>y 的顶点构成的边。这个时候就需要使用 if 语句来判断 y1 与 y 的关系。因为一个顶点与两条边相关联，所以需要用两个 if 做分别来判断。然而我在进行两个 if 判断的时候，没有考虑到重复问题，重复将 NET\[i\] = SingleLinkList()链表。以至于在扫描线 i 的情况下，同一个 NET\[i\]链表化了

* * *

**代码**

```
'''
多边形扫描转换算法
class SingleLinkList:用类代替链表
PoliFill(image, polygon, color):扫描转换

'''


import numpy as np
import matplotlib.pyplot as plt

class Node:
    # 定义节点

    def __init__(self, data):
        self._data = data
        self._next = None

    def get_data(self):
        return self._data

    def get_next(self):
        return self._next

    def set_data(self, ddata):
        self._data = ddata

    def set_next(self, nnext):
        self._next = nnext

class SingleLinkList:
    # 定义链表

    def __init__(self):
        #初始化链表为空
        self._head = None
        self._size = 0

    def get_head(self):
        #获取链表头
        return self._head

    def is_empty(self):
        #判断链表是否为空
        return self._head is None

    def append(self, data):
        #在链表尾部追加一个节点
        temp = Node(data)
        if self._head is None:
            self._head = temp
        else:
            node = self._head
            while node.get_next() is not None:
                node = node.get_next()
            node.set_next(temp)
        self._size += 1

    def remove(self, data):
        # 在链表尾部删除一个节点
        node = self._head
        prev = None
        while node is not None:
            if node.get_data() == data:
                if not prev:
                    # 父节点为None
                    self._head = node.get_next()
                else:
                    prev.set_next(node.get_next())
                break
            else:
                prev = node
                node = node.get_next()
        self._size -= 1


def PoliFill(image, polygon, color):
    l = len(polygon)
    Ymax=0
    Ymin=np.shape(image)[1]
    (width, height) = np.shape(image)
    #求最大最小边
    for [x, y] in enumerate(polygon):
        if y[1] < Ymin:
            Ymin=y[1]
        if y[1] > Ymax:
            Ymax=y[1]

    #初始化并建立NET表
    NET = []
    for i in range(height):
        NET.append(None)


    for i in range(Ymin, Ymax + 1):
        for j in range(0, l):
            if polygon[j][1]==i:
                #左边顶点y是否大于y0
                if(polygon[(j-1+l)%l][1])>polygon[j][1]:
                    [x1,y1]=polygon[(j-1+l)%l]
                    [x0,y0]=polygon[j]
                    delta_x=(x1-x0)/(y1-y0)
                    NET[i] = SingleLinkList()
                    NET[i].append([x0, delta_x, y1])

                # 右边顶点y是否大于y0
                if (polygon[(j+1+l)%l][1])>polygon[j][1]:
                    [x1, y1] = polygon[(j + 1 + l) % l]
                    [x0, y0] = polygon[j]
                    delta_x = (x1 - x0) / (y1 - y0)
                    if(NET[i] is not None):
                        NET[i].append([x0, delta_x, y1])
                    else:
                        NET[i] = SingleLinkList()
                        NET[i].append([x0, delta_x, y1])


    #建立活性边表
    AET = SingleLinkList()
    for y in range(Ymin , Ymax+1):
        # 更新 start_x
        if not AET.is_empty():
            node = AET.get_head()
            while True:
                [start_x,delta_x,ymax] = node.get_data()
                start_x += delta_x
                node.set_data([start_x,delta_x,ymax])
                node = node.get_next()
                if node is None:
                    break

        # 填充
        if not AET.is_empty():
            node = AET.get_head()
            x_list = []
            # 获取所有交点的x坐标
            while True:
                [start_x,_,_] = node.get_data()
                x_list.append(start_x)
                node = node.get_next()
                if node is None:
                    break

            # 排序
            x_list.sort()
            # 两两配对填充
            for i in range(0,len(x_list),2):
                x1 = x_list[i]
                x2 = x_list[i+1]
                for pixel in range(int(x1),int(x2)+1):
                    image[y][pixel] = color

        if not AET.is_empty():
            # 删除非活性边
            node = AET.get_head()
            while True:
                [start_x,delta_x,ymax] = node.get_data()
                if ymax == y:
                    AET.remove([start_x,delta_x,ymax])
                node = node.get_next()
                if node is None:
                    break

        # 添加活性边
        if NET[y] is not None:
            node = NET[y].get_head()
            while True:
                AET.append(node.get_data())
                node = node.get_next()
                if node is None:
                    break


if __name__ == '__main__':
    image = np.ones([150, 150])

    plt.xlim(0,150)
    plt.ylim(0,150)
    polygon = [
        [20, 20],
        [120, 20],
        [70, 100],
        [50, 80],
        [30, 120],
        [20, 50],
        [50, 50]
     ]
    PoliFill(image, polygon,False)
    plt.imshow(image, plt.cm.magma)
    plt.show()
```

 

文章知识点与官方知识档案匹配，可进一步学习相关知识

[算法技能树](https://edu.csdn.net/skill/algorithm/?utm_source=csdn_ai_skill_tree_blog)[首页](https://edu.csdn.net/skill/algorithm/?utm_source=csdn_ai_skill_tree_blog)[概览](https://edu.csdn.net/skill/algorithm/?utm_source=csdn_ai_skill_tree_blog)63732 人正在系统学习中

本文转自 <https://blog.csdn.net/sinat_34686158/article/details/78745670>，如有侵权，请联系删除。