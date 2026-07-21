---
title: Git 基础知识：从入门到日常开发 
published: 2026-07-21 19:16:00
expires: 2026-09-21 23:59:59
mathjax: true
categories: Git基础
tags: [Git]
---

Git 是目前使用最广泛的分布式版本控制系统之一。无论是个人项目、科研代码，还是多人协作开发，Git 都可以帮助我们记录文件变化、恢复历史版本、管理不同开发分支，并与 GitHub、GitLab、Gitee 等代码托管平台协同使用。

------

## 一、Git 能解决什么问题？

在没有版本控制工具时，我们可能会用下面的方式保存代码：

```text
项目最终版
项目最终版2
项目最终版_真的不改了
项目最终版_修复版
项目最终版_最终版
```

这种方式不仅难以管理，也无法清楚地知道每次修改了什么。Git 可以帮助我们：

- 记录项目的每一次修改；
- 查看不同版本之间的差异；
- 恢复误删或错误修改的文件；
- 创建多个分支并行开发；
- 合并不同开发者的代码；
- 将本地代码同步到远程仓库。

需要注意的是，Git 和 GitHub 并不是同一个概念：

- **Git**：安装在本地的版本控制工具；
- **GitHub/GitLab/Gitee**：用于存储和协作管理 Git 仓库的在线平台。

即使没有网络，也可以在本地正常使用 Git。

------

## 二、Git 的三个核心区域

理解 Git 的关键，是理解文件在三个区域之间的流转。

| 区域     | 作用                 | 常用命令                 |
| -------- | -------------------- | ------------------------ |
| 工作区   | 实际编辑文件的位置   | `git status`、`git diff` |
| 暂存区   | 保存准备提交的修改   | `git add`                |
| 本地仓库 | 永久记录一次版本快照 | `git commit`             |

一次标准的代码提交流程如下：

```text
修改文件 → git add → git commit → git push
```

其中：

- `git add` 将修改放入暂存区；
- `git commit` 将暂存内容保存到本地仓库；
- `git push` 将本地提交上传到远程仓库。

------

## 三、安装与基本配置

安装 Git 后，可以使用以下命令检查是否安装成功：

```bash
git --version
```

第一次使用 Git，需要设置用户名和邮箱。这些信息会记录在每一次提交中。

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

查看当前配置：

```bash
git config --list
```

如果只想为当前项目设置用户名和邮箱，可以去掉 `--global`：

```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

------

## 四、创建 Git 仓库

### 1. 初始化本地仓库

进入项目目录后执行：

```bash
git init
```

该命令会在当前目录中创建一个隐藏的 `.git` 文件夹，用于保存提交记录、分支及配置信息。

初始化后查看仓库状态：

```bash
git status
```

### 2. 克隆远程仓库

如果远程平台已经存在项目，可以直接克隆：

```bash
git clone <仓库地址>
```

例如：

```bash
git clone https://github.com/username/project.git
cd project
```

克隆操作通常会同时下载代码、提交历史和远程仓库配置。

------

## 五、文件的基本操作

### 1. 查看仓库状态

```bash
git status
```

该命令可以查看：

- 哪些文件被修改；
- 哪些文件尚未跟踪；
- 哪些修改已经进入暂存区；
- 当前所在的分支。

建议在执行提交、切换分支或撤销操作前先运行一次 `git status`。

### 2. 将文件加入暂存区

添加单个文件：

```bash
git add README.md
```

添加多个文件：

```bash
git add README.md main.py
```

添加当前目录中的全部修改：

```bash
git add .
```

### 3. 提交修改

```bash
git commit -m "添加项目说明"
```

提交信息应简洁、清楚地说明本次修改。例如：

```bash
git commit -m "修复数据读取异常"
git commit -m "新增模型训练脚本"
git commit -m "更新环境安装说明"
```

不建议使用“修改一下”“update”或“最终版”等含义不明确的信息。

------

## 六、查看提交记录与文件差异

### 1. 查看提交历史

查看完整历史：

```bash
git log
```

以简洁形式显示：

```bash
git log --oneline
```

查看分支图：

```bash
git log --oneline --graph --decorate --all
```

每次提交都有一个唯一的哈希值，例如：

```text
8f39a21 修复数据加载错误
```

后续可以通过该哈希值查看、撤销或恢复指定提交。

### 2. 查看文件差异

查看工作区中尚未暂存的修改：

```bash
git diff
```

查看已经暂存、但尚未提交的修改：

```bash
git diff --staged
```

查看某个文件的修改：

```bash
git diff main.py
```

查看两个提交之间的差异：

```bash
git diff <commit1> <commit2>
```

------

## 七、分支管理

分支可以让我们在不影响主分支的情况下开发新功能或修复问题。

### 1. 查看分支

```bash
git branch
```

当前分支前会显示 `*`：

```text
* main
  dev
```

### 2. 创建并切换分支

创建分支：

```bash
git branch dev
```

切换分支：

```bash
git switch dev
```

创建并立即切换：

```bash
git switch -c dev
```

旧版本 Git 也可以使用：

```bash
git checkout -b dev
```

### 3. 合并分支

假设需要将 `dev` 分支合并到 `main`，首先切换到接收修改的 `main` 分支：

```bash
git switch main
git merge dev
```

合并完成后，可以删除不再使用的分支：

```bash
git branch -d dev
```

强制删除尚未合并的分支：

```bash
git branch -D dev
```

`-D` 可能导致未合并内容丢失，使用前应确认分支中的修改已经不再需要。

------

## 八、远程仓库操作

### 1. 查看远程仓库

```bash
git remote -v
```

常见的远程仓库名称是 `origin`。

### 2. 添加远程仓库

```bash
git remote add origin <仓库地址>
```

例如：

```bash
git remote add origin https://github.com/username/project.git
```

如果地址填写错误，可以修改：

```bash
git remote set-url origin <新仓库地址>
```

### 3. 推送代码

首次推送当前分支：

```bash
git push -u origin main
```

其中，`-u` 会建立本地分支与远程分支的跟踪关系。以后可以直接使用：

```bash
git push
```

现在多数新仓库的默认分支为 `main`，部分旧项目仍然使用 `master`，应根据实际分支名称选择。

### 4. 获取远程更新

拉取远程更新并自动合并：

```bash
git pull
```

在多人协作中，也可以使用变基方式同步：

```bash
git pull --rebase origin main
```

只下载远程更新但暂不合并：

```bash
git fetch
```

`fetch` 与 `pull` 的主要区别是：

- `git fetch`：只获取远程信息，不修改当前工作分支；
- `git pull`：获取远程信息后，继续合并或变基。

------

## 九、撤销与回退操作

撤销操作需要区分修改是否已经暂存、提交或推送。

### 1. 撤销工作区修改

恢复单个文件：

```bash
git restore <文件名>
```

例如：

```bash
git restore main.py
```

这会丢弃该文件尚未暂存的修改，执行前应谨慎确认。

### 2. 取消暂存

如果误执行了 `git add`：

```bash
git restore --staged <文件名>
```

该命令只会把文件移出暂存区，不会删除工作区中的修改。

### 3. 修改最近一次提交

需要补充遗漏文件或修改提交说明时，可以使用：

```bash
git commit --amend
```

如果只修改提交信息：

```bash
git commit --amend -m "新的提交说明"
```

### 4. 回退本地提交

撤销最近一次提交，但保留修改和暂存状态：

```bash
git reset --soft HEAD~1
```

撤销最近一次提交，同时取消暂存，但保留文件修改：

```bash
git reset HEAD~1
```

彻底回退并丢弃文件修改：

```bash
git reset --hard HEAD~1
```

`--hard` 会直接删除未保存的修改，应谨慎使用。

### 5. 安全撤销已推送的提交

如果提交已经推送到共享仓库，建议使用：

```bash
git revert <commit_id>
```

它不会删除原来的提交记录，而是创建一个新的反向提交，因此更适合多人协作。

------

## 十、使用 `.gitignore` 忽略文件

项目中经常存在不需要提交的文件，例如：

- 缓存文件；
- 编译产物；
- 虚拟环境；
- 日志文件；
- 密钥和环境变量；
- 编辑器配置。

可以在项目根目录创建 `.gitignore` 文件：

```gitignore
# Python 缓存
__pycache__/
*.pyc

# Python 虚拟环境
venv/
.venv/

# Node.js 依赖
node_modules/

# 日志文件
*.log

# 环境变量
.env

# 编辑器配置
.vscode/
.idea/

# 系统文件
.DS_Store
```

需要注意：如果文件已经被 Git 跟踪，之后再加入 `.gitignore` 并不会自动取消跟踪。可以执行：

```bash
git rm --cached <文件名>
```

取消整个目录的跟踪：

```bash
git rm -r --cached <目录名>
```

`.env`、访问令牌、私钥等敏感信息不应提交到仓库。如果敏感信息已经推送，应立即撤销或轮换对应凭据。

------

## 十一、标签管理

标签通常用于标记重要版本，例如 `v1.0.0`。

查看所有标签：

```bash
git tag
```

创建轻量标签：

```bash
git tag v1.0.0
```

创建带说明的标签：

```bash
git tag -a v1.0.0 -m "发布第一个正式版本"
```

推送指定标签：

```bash
git push origin v1.0.0
```

推送全部标签：

```bash
git push origin --tags
```

删除本地标签：

```bash
git tag -d v1.0.0
```

删除远程标签：

```bash
git push origin --delete v1.0.0
```

------

## 十二、保存未完成的修改

有时当前功能尚未完成，但需要临时切换到其他分支。此时可以使用 `stash` 保存修改：

```bash
git stash
```

查看保存记录：

```bash
git stash list
```

恢复最近一次保存：

```bash
git stash pop
```

恢复但不删除保存记录：

```bash
git stash apply
```

添加说明后保存：

```bash
git stash push -m "尚未完成的数据预处理修改"
```

------

## 十三、多人协作中的冲突处理

当两个人修改了同一文件的相同位置，Git 可能无法自动决定保留哪一份内容，从而产生冲突。

冲突文件中通常会出现：

```text
<<<<<<< HEAD
当前分支中的内容
=======
另一个分支中的内容
>>>>>>> dev
```

处理步骤如下：

1. 打开冲突文件；
2. 判断需要保留的内容；
3. 删除 `<<<<<<<`、`=======` 和 `>>>>>>>` 标记；
4. 保存文件；
5. 将处理后的文件加入暂存区；
6. 完成合并提交。

```bash
git add <冲突文件>
git commit -m "解决合并冲突"
```

如果想取消本次合并：

```bash
git merge --abort
```

------

## 十四、一个完整的日常使用流程

### 场景一：从远程仓库下载项目并提交修改

```bash
# 克隆仓库
git clone https://github.com/username/project.git

# 进入项目目录
cd project

# 创建开发分支
git switch -c feature/data-loader

# 修改代码后查看状态
git status

# 查看具体差异
git diff

# 添加修改
git add .

# 提交修改
git commit -m "新增医学图像数据加载模块"

# 推送分支
git push -u origin feature/data-loader
```

### 场景二：已有本地项目，首次上传远程仓库

```bash
# 进入项目目录并初始化仓库
git init

# 添加文件
git add .

# 创建首次提交
git commit -m "初始化项目"

# 设置主分支名称
git branch -M main

# 关联远程仓库
git remote add origin https://github.com/username/project.git

# 推送到远程仓库
git push -u origin main
```

### 场景三：同步团队成员的最新修改

```bash
# 确认当前状态
git status

# 切换到主分支
git switch main

# 拉取最新代码
git pull --rebase origin main
```

如果工作区存在未提交修改，应先提交修改，或者使用 `git stash` 临时保存。

------

## 十五、Git 常用命令速查表

| 操作           | 命令                          |
| -------------- | ----------------------------- |
| 初始化仓库     | `git init`                    |
| 克隆仓库       | `git clone <url>`             |
| 查看状态       | `git status`                  |
| 添加文件       | `git add <file>`              |
| 添加全部修改   | `git add .`                   |
| 提交修改       | `git commit -m "说明"`        |
| 查看提交记录   | `git log --oneline`           |
| 查看修改       | `git diff`                    |
| 查看分支       | `git branch`                  |
| 创建并切换分支 | `git switch -c <branch>`      |
| 合并分支       | `git merge <branch>`          |
| 查看远程仓库   | `git remote -v`               |
| 拉取更新       | `git pull`                    |
| 获取远程信息   | `git fetch`                   |
| 推送代码       | `git push`                    |
| 取消暂存       | `git restore --staged <file>` |
| 撤销文件修改   | `git restore <file>`          |
| 临时保存修改   | `git stash`                   |
| 恢复临时修改   | `git stash pop`               |
| 安全撤销提交   | `git revert <commit>`         |

------

## 十六、使用 Git 的几点建议

1. **提交前先查看状态和差异**

   ```bash
   git status
   git diff
   git diff --staged
   ```

2. **一次提交只完成一类修改**

   不要把功能开发、错误修复和格式调整全部混在一次提交中。

3. **使用有意义的提交信息**

   提交信息应说明“做了什么”，必要时说明“为什么这样做”。

4. **重要功能尽量在独立分支开发**

   完成并测试后，再合并到主分支。

5. **不要提交密码、令牌和私钥**

   即使之后删除，敏感信息也可能仍然存在于 Git 历史中。

6. **谨慎使用 `reset --hard` 和强制推送**

   这些命令可能造成难以恢复的数据丢失，尤其不应随意用于多人共享分支。

------

## 总结

学习 Git 不需要一开始记住所有命令。对于初学者，首先掌握下面这条主线即可：

```bash
git status
git add .
git commit -m "提交说明"
git pull --rebase
git push
```

在此基础上，再逐步学习分支管理、冲突处理、版本回退和标签管理。Git 的核心并不是记忆命令，而是理解文件如何在工作区、暂存区、本地仓库和远程仓库之间流转。只要建立了这一概念，面对不同的 Git 操作就会更加清晰。