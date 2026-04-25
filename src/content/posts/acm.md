---
title: ACM MM 2026
published: 2026-03-25 18:36:00
expires: 2026-08-21 23:59:59
description: "ACM模板调整"
category: ACM
tags: [ACM]
homeCarousel: true
homeCarouselOrder: 2
homeCarouselImage: https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb11.jpg
---

删除图中的1，2处信息：
![](https://pic1.imgdb.cn/item/69c3bae236bbc571055c8665.webp)

```txt
\settopmatter{printacmref=false} % Removes citation information below abstract
\renewcommand\footnotetextcopyrightpermission[1]{} % removes footnote with conference information in first column
\pagestyle{plain} % removes running headers

```

删除acmSubmissionID后面的```*```，注释\authornotemark[1]，大概138行左右
```txt
%\authornotemark[1]
```










