---
title: 代码复现记录nnUNet
date: 2025-08-02 21:05:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "云想衣裳花想容，春风拂槛露华浓"
categories: 代码复现记录
tags: [代码复现记录]
---



## 数据集

BraTS2021 脑肿瘤分割



## 所需指令
```bash
nnUNetv2_convert_MSD_dataset -i D:\nnunet\nnUNet_raw\Task44_example

nnUNetv2_plan_and_preprocess -d 1 --verify_dataset_integrity

nnUNetv2_train 2 3d_fullres all -tr nnUNetTrainer_250epochs

nnUNetv2_predict -i D:/nnunet/nnUNet_raw/Dataset044_example /imagesTs -o output -d 44 -c 2d -f all
```



## 方法1：通过命令行参数（部分参数）

```python
# 基本训练命令
nnUNetv2_train DATASET_ID CONFIG FOLD [其他参数]

# 一些可用的命令行参数：
nnUNetv2_train 001 2d 0 --npz  # 使用npz格式保存
nnUNetv2_train 001 2d 0 --c    # 继续之前的训练
nnUNetv2_train 001 2d 0 --val  # 同时进行验证
```

## 方法2：修改配置文件中的默认参数

找到并编辑nnUNetTrainer类文件：

```bash
vim /root/autodl-tmp/nnUNet/nnunetv2/training/nnUNetTrainer/nnUNetTrainer.py
```

在`__init__`方法中修改默认参数：

```python
def __init__(self, plans: dict, configuration: str, fold: int, dataset_json: dict, unpack_dataset: bool = True,
             device: torch.device = torch.device('cuda')):
    # 修改学习率
    self.initial_lr = 1e-2  # 默认是1e-2，可以修改为其他值
    
    # 修改批次大小会在后面的方法中设置
    
    # 修改训练轮数
    self.num_epochs = 1000  # 默认1000个epoch
```

## 方法3：创建自定义Trainer类（推荐）

创建一个新的trainer类继承自nnUNetTrainer：

```bash
# 创建自定义trainer文件
vim /root/autodl-tmp/nnUNet/nnunetv2/training/nnUNetTrainer/MyCustomTrainer.py
```

```python
from nnunetv2.training.nnUNetTrainer.nnUNetTrainer import nnUNetTrainer

class MyCustomTrainer(nnUNetTrainer):
    def __init__(self, plans: dict, configuration: str, fold: int, dataset_json: dict, unpack_dataset: bool = True,
                 device: torch.device = torch.device('cuda')):
        super().__init__(plans, configuration, fold, dataset_json, unpack_dataset, device)
        
        # 自定义学习率
        self.initial_lr = 5e-3  # 修改初始学习率
        
        # 自定义训练轮数
        self.num_epochs = 500
        
        # 自定义权重衰减
        self.weight_decay = 3e-5
    
    def configure_optimizers(self):
        # 自定义优化器参数
        optimizer = torch.optim.SGD(
            self.network.parameters(),
            lr=self.initial_lr,
            weight_decay=self.weight_decay,
            momentum=0.99,
            nesterov=True
        )
        return optimizer
    
    def configure_rotation_dummyDA_mirroring_and_inital_patch_size(self):
        # 修改数据增强参数
        rotation_for_DA, do_dummy_2d_data_aug, initial_patch_size, mirror_axes = \
            super().configure_rotation_dummyDA_mirroring_and_inital_patch_size()
        
        # 可以在这里修改patch size等参数
        return rotation_for_DA, do_dummy_2d_data_aug, initial_patch_size, mirror_axes
```

## 方法4：修改batch size

batch size通常由硬件内存自动确定，但可以通过修改plans文件或代码强制设置：

```python
# 在自定义trainer中重写方法
def configure_optimizers(self):
    # 强制设置batch size
    self.batch_size = 4  # 设置你想要的batch size
    
    # 重新计算相关参数
    optimizer = torch.optim.SGD(
        self.network.parameters(),
        lr=self.initial_lr,
        weight_decay=self.weight_decay,
        momentum=0.99,
        nesterov=True
    )
    return optimizer
```

## 方法5：使用自定义trainer进行训练

```python
# 使用自定义trainer训练
nnUNetv2_train DATASET_ID CONFIG FOLD -tr MyCustomTrainer
```

## 常用参数修改示例

```python
class MyCustomTrainer(nnUNetTrainer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # 学习率相关
        self.initial_lr = 1e-3           # 初始学习率
        self.lr_scheduler_eps = 1e-8     # 学习率调度器参数
        self.lr_scheduler_patience = 30  # 学习率调度器耐心值
        
        # 训练相关
        self.num_epochs = 500            # 训练轮数
        self.num_iterations_per_epoch = 250  # 每个epoch的迭代次数
        self.save_every = 25             # 每多少个epoch保存一次
        self.validate_every = 5          # 每多少个epoch验证一次
        
        # 优化器相关
        self.weight_decay = 3e-5         # 权重衰减
        
        # 损失函数相关参数
        self.deep_supervision_scales = [1, 0.5, 0.25, 0.125]  # 深度监督的尺度
```

## 使用环境变量

某些参数也可以通过环境变量设置：

```python
export nnUNet_n_proc_DA=8  # 数据增强进程数
nnUNetv2_train 001 2d 0
```

推荐使用方法3创建自定义trainer类，这样可以保持原始代码不变，同时实现参数的灵活修改。

