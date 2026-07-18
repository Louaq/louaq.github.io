---
title: nnUNetv2数据集转换
published: 2025-08-18 14:30:00
expires: 2025-08-21 23:59:59
mathjax: true
excerpt: "nnUNetv2数据集转换"
category: nnUNet
tags: [nnUNet]
---

本文nnunetv2实验中BraTS数据集转换成MSD数据集格式的代码, nnunetv1的dataset.json与nnunetv2略有不同

# BraTS数据集转换成MSD数据集

## BraTS2019:

```python
// BraTS2019.py
import os
import shutil
import json
import nibabel as nib
import numpy as np
from collections import OrderedDict

def convert_brats2019_to_nnunet(brats_root, nnunet_raw_data_base):
    """
    将BraTS2019数据集转换为nnUNet格式，处理标签映射
    
    Args:
        brats_root: BraTS2019原始数据根目录路径
        nnunet_raw_data_base: nnUNet原始数据基础目录路径
    """
    
    # 设置路径
    task_name = "Dataset001_BraTS2019"
    task_folder = os.path.join(nnunet_raw_data_base, "nnUNet_raw_data", task_name)
    
    # 创建必要的目录
    imagesTr_folder = os.path.join(task_folder, "imagesTr")
    imagesTs_folder = os.path.join(task_folder, "imagesTs")
    labelsTr_folder = os.path.join(task_folder, "labelsTr")
    labelsTs_folder = os.path.join(task_folder, "labelsTs")
    
    for folder in [imagesTr_folder, imagesTs_folder, labelsTr_folder, labelsTs_folder]:
        os.makedirs(folder, exist_ok=True)
    
    # 获取训练数据和测试数据路径
    hgg_folder = os.path.join(brats_root, "HGG")
    lgg_folder = os.path.join(brats_root, "LGG")
    
    # 收集所有训练病例
    train_cases = []
    
    # 处理HGG数据
    if os.path.exists(hgg_folder):
        hgg_cases = [d for d in os.listdir(hgg_folder) if os.path.isdir(os.path.join(hgg_folder, d))]
        for case in hgg_cases:
            train_cases.append(("HGG", case))
    
    # 处理LGG数据
    if os.path.exists(lgg_folder):
        lgg_cases = [d for d in os.listdir(lgg_folder) if os.path.isdir(os.path.join(lgg_folder, d))]
        for case in lgg_cases:
            train_cases.append(("LGG", case))
    
    print(f"找到 {len(train_cases)} 个训练病例")
    
    # 模态映射
    modality_mapping = {
        'flair': '0000',
        't1ce': '0001', 
        't1': '0002',
        't2': '0003'
    }
    
    def process_label(label_path, output_path):
        """
        处理BraTS标签，将原始标签映射为连续的标签
        BraTS原始标签: 0(背景), 1(坏死/非增强肿瘤), 2(水肿), 4(增强肿瘤)
        映射后标签: 0(背景), 1(坏死/非增强肿瘤), 2(水肿), 3(增强肿瘤)
        """
        # 加载标签数据
        label_nii = nib.load(label_path)
        label_data = label_nii.get_fdata().astype(np.uint8)
        
        # 检查原始标签值
        unique_labels = np.unique(label_data)
        print(f"处理 {os.path.basename(label_path)}，原始标签值: {unique_labels}")
        
        # 创建新的标签数组
        new_label_data = np.zeros_like(label_data)
        
        # 标签映射: 0->0, 1->1, 2->2, 4->3
        new_label_data[label_data == 0] = 0  # 背景
        new_label_data[label_data == 1] = 1  # 坏死和非增强肿瘤
        new_label_data[label_data == 2] = 2  # 水肿  
        new_label_data[label_data == 4] = 3  # 增强肿瘤
        
        # 检查映射后的标签值
        new_unique_labels = np.unique(new_label_data)
        print(f"映射后标签值: {new_unique_labels}")
        
        # 保存新的标签文件
        new_label_nii = nib.Nifti1Image(new_label_data, label_nii.affine, label_nii.header)
        nib.save(new_label_nii, output_path)
    
    training_cases = []
    test_cases = []
    
    for i, (grade, case_name) in enumerate(train_cases):
        case_folder = os.path.join(brats_root, grade, case_name)
        
        if not os.path.exists(case_folder):
            print(f"警告: 病例文件夹不存在 {case_folder}")
            continue
        
        # 检查所有必需的文件是否存在
        required_files = {
            'flair': f"{case_name}_flair.nii",
            't1ce': f"{case_name}_t1ce.nii", 
            't1': f"{case_name}_t1.nii",
            't2': f"{case_name}_t2.nii",
            'seg': f"{case_name}_seg.nii"
        }
        
        # 检查.nii.gz格式
        for key, filename in required_files.items():
            if not os.path.exists(os.path.join(case_folder, filename)):
                # 尝试.nii.gz格式
                gz_filename = filename + ".gz"
                if os.path.exists(os.path.join(case_folder, gz_filename)):
                    required_files[key] = gz_filename
                else:
                    print(f"警告: 文件 {filename} 或 {gz_filename} 不存在于 {case_folder}")
                    break
        else:
            # 所有文件都存在，处理这个病例
            
            # 决定这个病例是用于训练还是测试（这里简单地将前80%用于训练）
            if i < len(train_cases) * 0.8:
                # 训练数据
                for modality, suffix in modality_mapping.items():
                    src_file = os.path.join(case_folder, required_files[modality])
                    dst_file = os.path.join(imagesTr_folder, f"{case_name}_{suffix}.nii.gz")
                    
                    # 如果源文件不是.gz格式，需要压缩
                    if not src_file.endswith('.gz'):
                        img = nib.load(src_file)
                        nib.save(img, dst_file)
                    else:
                        shutil.copy2(src_file, dst_file)
                
                # 处理分割标签（重要：进行标签映射）
                src_seg = os.path.join(case_folder, required_files['seg'])
                dst_seg = os.path.join(labelsTr_folder, f"{case_name}.nii.gz")
                process_label(src_seg, dst_seg)
                
                training_cases.append(case_name)
                
            else:
                # 测试数据
                for modality, suffix in modality_mapping.items():
                    src_file = os.path.join(case_folder, required_files[modality])
                    dst_file = os.path.join(imagesTs_folder, f"{case_name}_{suffix}.nii.gz")
                    
                    if not src_file.endswith('.gz'):
                        img = nib.load(src_file)
                        nib.save(img, dst_file)
                    else:
                        shutil.copy2(src_file, dst_file)
                
                # 测试数据的标签（同样进行标签映射）
                src_seg = os.path.join(case_folder, required_files['seg'])
                dst_seg = os.path.join(labelsTs_folder, f"{case_name}.nii.gz")
                process_label(src_seg, dst_seg)
                
                test_cases.append(case_name)
    
    print(f"处理完成: {len(training_cases)} 个训练病例, {len(test_cases)} 个测试病例")
    
    # 创建dataset.json文件
    dataset_json = OrderedDict()
    dataset_json['name'] = "BraTS2019"
    dataset_json['description'] = "Brain Tumor Segmentation Challenge 2019"
    dataset_json['tensorImageSize'] = "4D"
    dataset_json['reference'] = "https://www.med.upenn.edu/cbica/brats2019/"
    dataset_json['licence'] = "see BraTS2019 website"
    dataset_json['release'] = "1.0"
    
    # 模态信息
    dataset_json['channel_names'] = {
        "0": "FLAIR",
        "1": "T1ce", 
        "2": "T1",
        "3": "T2"
    }
    
    # 标签信息 - 修正为包含所有必要的标签
    dataset_json['labels'] = {
        "background": 0,
        "necrotic/non-enhancing tumor": 1, 
        "edema": 2,
        "enhancing tumor": 3
    }
    dataset_json['file_ending'] = ".nii.gz"   #按需修改 .nii或.nii.gz
    # 训练和测试数据列表
    dataset_json['numTraining'] = len(training_cases)
    dataset_json['numTest'] = len(test_cases)
    
    dataset_json['training'] = []
    for case in training_cases:
        case_dict = {
            "image": f"./imagesTr/{case}.nii.gz",
            "label": f"./labelsTr/{case}.nii.gz"
        }
        dataset_json['training'].append(case_dict)
    
    dataset_json['test'] = []
    for case in test_cases:
        dataset_json['test'].append(f"./imagesTs/{case}.nii.gz")
    
    # 保存dataset.json
    json_file_path = os.path.join(task_folder, "dataset.json")
    with open(json_file_path, 'w') as f:
        json.dump(dataset_json, f, indent=4)
    
    print(f"dataset.json 已保存到: {json_file_path}")
    print("数据转换完成！标签已正确映射：0(背景) -> 0, 1(坏死) -> 1, 2(水肿) -> 2, 4(增强肿瘤) -> 3")
    
    return task_folder

# 使用示例
if __name__ == "__main__":
    # 设置路径
    brats_root = "/root/autodl-tmp/nnUNet_raw_data_base/BraTS2019"  # 您的BraTS2019数据根目录
    nnunet_raw_data_base = "/root/autodl-tmp/nnUNet_raw_data_base"  # nnUNet原始数据基础目录
    
    # 执行转换
    convert_brats2019_to_nnunet(brats_root, nnunet_raw_data_base)
```



## BraTS2023

```python
// BraTS2023.py
import os
import shutil
import json
import nibabel as nib
import numpy as np
from collections import OrderedDict

def convert_brats2023_to_nnunet(brats_root, nnunet_raw_data_base):
    """
    将BraTS2023数据集转换为nnUNet格式，保持原始标签不变
    
    Args:
        brats_root: BraTS2023原始数据根目录路径
        nnunet_raw_data_base: nnUNet原始数据基础目录路径
    """
    
    # 错误记录列表
    errors = []
    
    # 设置路径
    task_name = "Dataset001_BraTS2023"
    task_folder = os.path.join(nnunet_raw_data_base, "nnUNet_raw_data", task_name)
    
    # 创建必要的目录
    imagesTr_folder = os.path.join(task_folder, "imagesTr")
    imagesTs_folder = os.path.join(task_folder, "imagesTs")
    labelsTr_folder = os.path.join(task_folder, "labelsTr")
    labelsTs_folder = os.path.join(task_folder, "labelsTs")
    
    for folder in [imagesTr_folder, imagesTs_folder, labelsTr_folder, labelsTs_folder]:
        os.makedirs(folder, exist_ok=True)
    
    # 收集所有病例文件夹
    all_cases = []
    for item in os.listdir(brats_root):
        case_path = os.path.join(brats_root, item)
        if os.path.isdir(case_path) and item.startswith('BraTS-GLI-'):
            all_cases.append(item)
    
    all_cases.sort()  # 确保顺序一致
    print(f"找到 {len(all_cases)} 个病例")
    
    # 模态映射 - BraTS2023使用t1c而不是t1ce
    modality_mapping = {
        't1n': '0000',  # T1 native (非增强T1)
        't1c': '0001',  # T1 contrast enhanced (增强T1)
        't2f': '0002',  # T2 FLAIR
        't2w': '0003'   # T2 weighted
    }
    
    def safe_copy_image(src_path, dst_path, case_name, modality):
        """
        安全地复制图像文件，处理可能的错误
        """
        try:
            if not src_path.endswith('.gz'):
                img = nib.load(src_path)
                nib.save(img, dst_path)
            else:
                shutil.copy2(src_path, dst_path)
            return True
        except Exception as e:
            error_msg = f"复制图像失败 - 病例: {case_name}, 模态: {modality}, 文件: {src_path}, 错误: {str(e)}"
            print(f"错误: {error_msg}")
            errors.append(error_msg)
            return False
    
    def safe_copy_label(src_path, dst_path, case_name):
        """
        安全地复制标签文件，处理可能的错误
        """
        try:
            # 加载标签数据以检查标签值
            label_nii = nib.load(src_path)
            label_data = label_nii.get_fdata().astype(np.uint8)
            
            # 检查原始标签值
            unique_labels = np.unique(label_data)
            print(f"处理 {os.path.basename(src_path)}，标签值: {unique_labels}")
            
            # 直接保存，不进行任何修改
            if not src_path.endswith('.gz'):
                # 如果源文件不是.gz格式，保存为.gz格式
                nib.save(label_nii, dst_path)
            else:
                # 如果已经是.gz格式，直接复制
                shutil.copy2(src_path, dst_path)
            return True
        except Exception as e:
            error_msg = f"复制标签失败 - 病例: {case_name}, 文件: {src_path}, 错误: {str(e)}"
            print(f"错误: {error_msg}")
            errors.append(error_msg)
            return False
    
    def check_file_validity(file_path):
        """
        检查文件是否有效（非空且可读取）
        """
        try:
            if not os.path.exists(file_path):
                return False, "文件不存在"
            
            if os.path.getsize(file_path) == 0:
                return False, "文件为空"
            
            # 尝试加载文件头信息
            nib.load(file_path)
            return True, "文件有效"
        except Exception as e:
            return False, f"文件无效: {str(e)}"
    
    training_cases = []
    test_cases = []
    skipped_cases = []
    
    for i, case_name in enumerate(all_cases):
        case_folder = os.path.join(brats_root, case_name)
        
        if not os.path.exists(case_folder):
            error_msg = f"病例文件夹不存在: {case_folder}"
            print(f"警告: {error_msg}")
            errors.append(error_msg)
            skipped_cases.append(case_name)
            continue
        
        # 构建文件名模式 - 根据BraTS2023的命名规范
        base_name = case_name  # BraTS-GLI-00000-000
        
        required_files = {
            't1n': f"{base_name}-t1n.nii",
            't1c': f"{base_name}-t1c.nii", 
            't2f': f"{base_name}-t2f.nii",
            't2w': f"{base_name}-t2w.nii",
            'seg': f"{base_name}-seg.nii"
        }
        
        # 检查文件存在性，支持.nii和.nii.gz格式
        files_exist = True
        invalid_files = []
        
        for key, filename in required_files.items():
            file_path = os.path.join(case_folder, filename)
            gz_file_path = file_path + ".gz"
            
            if os.path.exists(file_path):
                # 检查文件有效性
                is_valid, msg = check_file_validity(file_path)
                if not is_valid:
                    invalid_files.append(f"{filename}: {msg}")
                    files_exist = False
            elif os.path.exists(gz_file_path):
                required_files[key] = filename + ".gz"
                # 检查文件有效性
                is_valid, msg = check_file_validity(gz_file_path)
                if not is_valid:
                    invalid_files.append(f"{filename}.gz: {msg}")
                    files_exist = False
            else:
                error_msg = f"文件缺失 - 病例: {case_name}, 文件: {filename} 或 {filename}.gz"
                print(f"警告: {error_msg}")
                errors.append(error_msg)
                files_exist = False
        
        if invalid_files:
            for invalid_file in invalid_files:
                error_msg = f"文件无效 - 病例: {case_name}, {invalid_file}"
                print(f"警告: {error_msg}")
                errors.append(error_msg)
        
        if not files_exist:
            skipped_cases.append(case_name)
            continue
        
        # 决定这个病例是用于训练还是测试（前80%用于训练）
        case_success = True
        
        if i < len(all_cases) * 0.8:
            # 训练数据
            print(f"处理训练病例: {case_name}")
            
            # 复制图像文件
            for modality, suffix in modality_mapping.items():
                src_file = os.path.join(case_folder, required_files[modality])
                dst_file = os.path.join(imagesTr_folder, f"{case_name}_{suffix}.nii.gz")
                
                if not safe_copy_image(src_file, dst_file, case_name, modality):
                    case_success = False
            
            # 复制分割标签
            src_seg = os.path.join(case_folder, required_files['seg'])
            dst_seg = os.path.join(labelsTr_folder, f"{case_name}.nii.gz")
            if not safe_copy_label(src_seg, dst_seg, case_name):
                case_success = False
            
            if case_success:
                training_cases.append(case_name)
                print(f"训练病例 {case_name} 处理成功")
            else:
                skipped_cases.append(case_name)
                print(f"训练病例 {case_name} 处理失败，已跳过")
                
        else:
            # 测试数据
            print(f"处理测试病例: {case_name}")
            
            # 复制图像文件
            for modality, suffix in modality_mapping.items():
                src_file = os.path.join(case_folder, required_files[modality])
                dst_file = os.path.join(imagesTs_folder, f"{case_name}_{suffix}.nii.gz")
                
                if not safe_copy_image(src_file, dst_file, case_name, modality):
                    case_success = False
            
            # 复制测试数据的标签
            src_seg = os.path.join(case_folder, required_files['seg'])
            dst_seg = os.path.join(labelsTs_folder, f"{case_name}.nii.gz")
            if not safe_copy_label(src_seg, dst_seg, case_name):
                case_success = False
            
            if case_success:
                test_cases.append(case_name)
                print(f"测试病例 {case_name} 处理成功")
            else:
                skipped_cases.append(case_name)
                print(f"测试病例 {case_name} 处理失败，已跳过")
    
    print(f"处理完成: {len(training_cases)} 个训练病例, {len(test_cases)} 个测试病例")
    print(f"跳过的病例数量: {len(skipped_cases)}")
    
    # 写入错误日志
    error_file_path = os.path.join(os.path.dirname(__file__), "error.txt")
    with open(error_file_path, 'w', encoding='utf-8') as f:
        f.write(f"BraTS2023数据转换错误报告\n")
        f.write(f"生成时间: {str(os.path.getctime(error_file_path)) if os.path.exists(error_file_path) else 'N/A'}\n")
        f.write(f"="*80 + "\n\n")
        f.write(f"总计处理: {len(all_cases)} 个病例\n")
        f.write(f"成功处理: {len(training_cases) + len(test_cases)} 个病例\n")
        f.write(f"跳过病例: {len(skipped_cases)} 个病例\n")
        f.write(f"错误数量: {len(errors)} 个错误\n\n")
        
        if skipped_cases:
            f.write("跳过的病例列表:\n")
            for case in skipped_cases:
                f.write(f"  - {case}\n")
            f.write("\n")
        
        if errors:
            f.write("详细错误信息:\n")
            for i, error in enumerate(errors, 1):
                f.write(f"{i}. {error}\n")
        else:
            f.write("没有发现错误。\n")
    
    print(f"错误日志已保存到: {error_file_path}")
    
    # 只有成功处理的病例数量大于0时才创建dataset.json
    if len(training_cases) + len(test_cases) > 0:
        # 创建dataset.json文件
        dataset_json = OrderedDict()
        dataset_json['name'] = "BraTS2023"
        dataset_json['description'] = "Brain Tumor Segmentation Challenge 2023"
        dataset_json['tensorImageSize'] = "4D"
        dataset_json['reference'] = "https://www.synapse.org/#!Synapse:syn51156910"
        dataset_json['licence'] = "see BraTS2023 website"
        dataset_json['release'] = "1.0"
        
        # 模态信息 - 更新为BraTS2023的模态
        dataset_json['channel_names'] = {
            "0": "T1n",    # T1 native
            "1": "T1c",    # T1 contrast enhanced
            "2": "T2f",    # T2 FLAIR  
            "3": "T2w"     # T2 weighted
        }
        
        # 标签信息 - 保持BraTS原始标签值
        dataset_json['labels'] = {
            "background": 0,
            "necrotic/non-enhancing tumor": 1, 
            "edema": 2,
            "enhancing tumor": 3  # 保持原始标签值3
        }
        dataset_json["file_ending"] = ".nii.gz"
        # 训练和测试数据列表
        dataset_json['numTraining'] = len(training_cases)
        dataset_json['numTest'] = len(test_cases)
        
        dataset_json['training'] = []
        for case in training_cases:
            case_dict = {
                "image": f"./imagesTr/{case}.nii.gz",
                "label": f"./labelsTr/{case}.nii.gz"
            }
            dataset_json['training'].append(case_dict)
        
        dataset_json['test'] = []
        for case in test_cases:
            dataset_json['test'].append(f"./imagesTs/{case}.nii.gz")
        
        # 保存dataset.json
        json_file_path = os.path.join(task_folder, "dataset.json")
        with open(json_file_path, 'w') as f:
            json.dump(dataset_json, f, indent=4)
        
        print(f"dataset.json 已保存到: {json_file_path}")
        print("BraTS2023数据转换完成！标签保持原始值不变：0(背景), 1(坏死), 2(水肿), 4(增强肿瘤)")
        
        return task_folder
    else:
        print("警告: 没有成功处理任何病例，未生成dataset.json文件")
        return None

# 使用示例
if __name__ == "__main__":
    # 设置路径
    brats_root = "/root/autodl-tmp/nnUNet_raw_data_base/BraTS2023"  # 您的BraTS2023数据根目录
    nnunet_raw_data_base = "/root/autodl-tmp/nnUNet_raw_data_base"  # nnUNet原始数据基础目录
    
    # 执行转换
    try:
        result = convert_brats2023_to_nnunet(brats_root, nnunet_raw_data_base)
        if result:
            print(f"\n转换成功完成！输出目录: {result}")
            print("可以继续进行nnUNet的预处理和训练步骤。")
        else:
            print("\n转换失败，请查看错误日志了解详细信息。")
    except Exception as e:
        print(f"程序执行失败: {str(e)}")
        # 即使主程序失败，也要记录错误
        error_file_path = os.path.join(os.path.dirname(__file__), "error.txt")
        with open(error_file_path, 'w', encoding='utf-8') as f:
            f.write(f"程序执行失败: {str(e)}\n")
        print(f"错误已记录到: {error_file_path}")
```


## BraTS2024

```python
// BraTS2024.py
import os
import shutil
import json
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

import nibabel as nib
import numpy as np
from collections import OrderedDict


def convert_brats2024_to_nnunet(brats_root, nnunet_raw_data_base, max_workers=8):
    """
    将BraTS2024数据集转换为nnUNet格式，保持原始标签不变（多线程加速版）

    Args:
        brats_root: BraTS2024原始数据根目录路径
        nnunet_raw_data_base: nnUNet原始数据基础目录路径
        max_workers: 并行线程数（I/O 密集，建议 4~16，视磁盘性能而定）
    """

    # 设置路径
    task_name = "Dataset001_BraTS2024"
    task_folder = os.path.join(nnunet_raw_data_base, "nnUNet_raw", task_name)

    imagesTr_folder = os.path.join(task_folder, "imagesTr")
    imagesTs_folder = os.path.join(task_folder, "imagesTs")
    labelsTr_folder = os.path.join(task_folder, "labelsTr")
    labelsTs_folder = os.path.join(task_folder, "labelsTs")

    for folder in [imagesTr_folder, imagesTs_folder, labelsTr_folder, labelsTs_folder]:
        os.makedirs(folder, exist_ok=True)

    # 收集所有病例文件夹
    all_cases = []
    for item in os.listdir(brats_root):
        case_path = os.path.join(brats_root, item)
        if os.path.isdir(case_path) and item.startswith('BraTS-'):
            all_cases.append(item)

    all_cases.sort()  # 确保顺序一致，训练/测试划分才可复现
    total = len(all_cases)
    print(f"找到 {total} 个病例，使用 {max_workers} 个线程处理")

    # 模态映射 - BraTS2024模态
    modality_mapping = {
        't1n': '0000',  # T1 native (非增强T1)
        't1c': '0001',  # T1 contrast enhanced (增强T1)
        't2f': '0002',  # T2 FLAIR
        't2w': '0003'   # T2 weighted
    }

    # 训练/测试划分点（前80%训练），事先算好，保证并行下划分与原逻辑一致
    split_index = total * 0.8

    # ---------- 纯函数式辅助：只返回结果，绝不修改外部共享变量 ----------

    def check_file_validity(file_path):
        """检查文件是否有效（非空且可读取），返回 (bool, msg)"""
        try:
            if not os.path.exists(file_path):
                return False, "文件不存在"
            if os.path.getsize(file_path) == 0:
                return False, "文件为空"
            nib.load(file_path)  # 只读文件头，验证可解析
            return True, "文件有效"
        except Exception as e:
            return False, f"文件无效: {str(e)}"

    def copy_image(src_path, dst_path, case_name, modality, errors):
        """复制图像文件，出错时把错误追加到本病例的局部 errors 列表"""
        try:
            if not src_path.endswith('.gz'):
                nib.save(nib.load(src_path), dst_path)
            else:
                shutil.copy2(src_path, dst_path)
            return True
        except Exception as e:
            errors.append(
                f"复制图像失败 - 病例: {case_name}, 模态: {modality}, "
                f"文件: {src_path}, 错误: {str(e)}"
            )
            return False

    def copy_label(src_path, dst_path, case_name, errors, logs):
        """复制标签文件并检查标签值分布，错误/日志写入局部列表"""
        try:
            label_nii = nib.load(src_path)
            label_data = label_nii.get_fdata().astype(np.uint8)

            unique_labels = np.unique(label_data)
            logs.append(f"  {os.path.basename(src_path)} 标签值: {unique_labels}")

            # 验证标签值是否符合BraTS2024规范（0, 1, 2, 3, 4）
            valid_labels = {0, 1, 2, 3, 4}
            unexpected_labels = set(int(x) for x in unique_labels) - valid_labels
            if unexpected_labels:
                errors.append(
                    f"发现意外标签值 - 病例: {case_name}, 标签值: {unexpected_labels}"
                )

            # 统计各标签的体素数量
            label_counts = {int(l): int(np.sum(label_data == l)) for l in unique_labels}
            logs.append(f"  标签分布: {label_counts}")

            # 直接保存，不做任何标签修改
            if not src_path.endswith('.gz'):
                nib.save(label_nii, dst_path)
            else:
                shutil.copy2(src_path, dst_path)
            return True
        except Exception as e:
            errors.append(
                f"复制标签失败 - 病例: {case_name}, 文件: {src_path}, 错误: {str(e)}"
            )
            return False

    # ---------- 单个病例的完整处理逻辑（在工作线程中运行）----------

    def process_case(i, case_name):
        """
        处理单个病例，返回一个结果字典：
        {'case_name', 'status': 'train'/'test'/'skip', 'errors': [...], 'logs': [...]}
        整个函数只读取外部只读变量，产出全部装进返回值，线程安全。
        """
        errors = []
        logs = []
        case_folder = os.path.join(brats_root, case_name)

        if not os.path.exists(case_folder):
            errors.append(f"病例文件夹不存在: {case_folder}")
            return {'case_name': case_name, 'status': 'skip', 'errors': errors, 'logs': logs}

        base_name = case_name  # 例如: BraTS-GLI-00000-000
        required_files = {
            't1n': f"{base_name}-t1n.nii",
            't1c': f"{base_name}-t1c.nii",
            't2f': f"{base_name}-t2f.nii",
            't2w': f"{base_name}-t2w.nii",
            'seg': f"{base_name}-seg.nii",
        }

        # 检查文件存在性与有效性，支持 .nii / .nii.gz
        files_ok = True
        for key, filename in required_files.items():
            file_path = os.path.join(case_folder, filename)
            gz_file_path = file_path + ".gz"

            if os.path.exists(file_path):
                valid, msg = check_file_validity(file_path)
                if not valid:
                    errors.append(f"文件无效 - 病例: {case_name}, {filename}: {msg}")
                    files_ok = False
            elif os.path.exists(gz_file_path):
                required_files[key] = filename + ".gz"
                valid, msg = check_file_validity(gz_file_path)
                if not valid:
                    errors.append(f"文件无效 - 病例: {case_name}, {filename}.gz: {msg}")
                    files_ok = False
            else:
                errors.append(f"文件缺失 - 病例: {case_name}, 文件: {filename} 或 {filename}.gz")
                files_ok = False

        if not files_ok:
            return {'case_name': case_name, 'status': 'skip', 'errors': errors, 'logs': logs}

        # 决定训练还是测试（前80%训练）
        is_training = i < split_index
        img_dst_folder = imagesTr_folder if is_training else imagesTs_folder
        lbl_dst_folder = labelsTr_folder if is_training else labelsTs_folder

        case_success = True

        # 复制四个模态图像
        for modality, suffix in modality_mapping.items():
            src_file = os.path.join(case_folder, required_files[modality])
            dst_file = os.path.join(img_dst_folder, f"{case_name}_{suffix}.nii.gz")
            if not copy_image(src_file, dst_file, case_name, modality, errors):
                case_success = False

        # 复制分割标签
        src_seg = os.path.join(case_folder, required_files['seg'])
        dst_seg = os.path.join(lbl_dst_folder, f"{case_name}.nii.gz")
        if not copy_label(src_seg, dst_seg, case_name, errors, logs):
            case_success = False

        if case_success:
            status = 'train' if is_training else 'test'
        else:
            status = 'skip'
        return {'case_name': case_name, 'status': status, 'errors': errors, 'logs': logs}

    # ---------- 并行调度 ----------

    training_cases = []
    test_cases = []
    skipped_cases = []
    errors = []

    done = 0
    progress_lock = threading.Lock()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(process_case, i, case_name): case_name
            for i, case_name in enumerate(all_cases)
        }

        for future in as_completed(futures):
            case_name = futures[future]
            try:
                result = future.result()
            except Exception as e:
                # 兜底：worker 内部未捕获的异常
                errors.append(f"病例 {case_name} 处理时发生未捕获异常: {str(e)}")
                skipped_cases.append(case_name)
                result = None

            if result is not None:
                errors.extend(result['errors'])
                status = result['status']
                if status == 'train':
                    training_cases.append(result['case_name'])
                elif status == 'test':
                    test_cases.append(result['case_name'])
                else:
                    skipped_cases.append(result['case_name'])

            # 线程安全地更新并打印进度
            with progress_lock:
                done += 1
                print(f"[{done}/{total}] {case_name} -> "
                      f"{result['status'] if result else 'skip'}")

    # 结果列表排序，保证输出稳定（并行完成顺序是乱的）
    training_cases.sort()
    test_cases.sort()
    skipped_cases.sort()

    print(f"\n处理完成: {len(training_cases)} 个训练病例, {len(test_cases)} 个测试病例")
    print(f"跳过的病例数量: {len(skipped_cases)}")

    # ---------- 写入错误日志 ----------
    error_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "error.txt")
    with open(error_file_path, 'w', encoding='utf-8') as f:
        f.write("BraTS2024数据转换错误报告\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"总计处理: {total} 个病例\n")
        f.write(f"成功处理: {len(training_cases) + len(test_cases)} 个病例\n")
        f.write(f"跳过病例: {len(skipped_cases)} 个病例\n")
        f.write(f"错误数量: {len(errors)} 个错误\n\n")

        if skipped_cases:
            f.write("跳过的病例列表:\n")
            for case in skipped_cases:
                f.write(f"  - {case}\n")
            f.write("\n")

        if errors:
            f.write("详细错误信息:\n")
            for idx, error in enumerate(errors, 1):
                f.write(f"{idx}. {error}\n")
        else:
            f.write("没有发现错误。\n")

    print(f"错误日志已保存到: {error_file_path}")

    # ---------- 生成 dataset.json（nnU-Net v2 格式）----------
    if len(training_cases) + len(test_cases) > 0:
        dataset_json = OrderedDict()

        # v2: channel_names 取代 v1 的 modality，键为通道索引字符串
        dataset_json['channel_names'] = {
            "0": "T1n",
            "1": "T1c",
            "2": "T2f",
            "3": "T2w",
        }

        # v2: labels 是 名称 -> 整数值（与 v1 正好相反）
        dataset_json['labels'] = {
            "background": 0,
            "NETC": 1,   # Non-Enhancing Tumor Core
            "SNFH": 2,   # Surrounding Non-enhancing FLAIR Hyperintensity
            "ET": 3,     # Enhancing Tumor
            "RC": 4,     # Resection Cavity (BraTS2024 新增)
        }

        # v2 必需字段
        dataset_json['numTraining'] = len(training_cases)
        dataset_json['file_ending'] = ".nii.gz"

        # 以下为可选元信息，nnU-Net 不使用但不会报错，仅方便追溯
        dataset_json['name'] = "BraTS2024"
        dataset_json['description'] = "Brain Tumor Segmentation Challenge 2024"
        dataset_json['reference'] = "https://www.synapse.org/#!Synapse:syn53708249"
        dataset_json['licence'] = "see BraTS2024 website"
        dataset_json['release'] = "1.0"

        json_file_path = os.path.join(task_folder, "dataset.json")
        with open(json_file_path, 'w') as f:
            json.dump(dataset_json, f, indent=4)

        print(f"dataset.json 已保存到: {json_file_path}")
        print("BraTS2024数据转换完成！标签保持原始值不变：")
        print("  0 - background (背景)")
        print("  1 - NETC - 非增强肿瘤核心")
        print("  2 - SNFH - 周围非增强FLAIR高信号")
        print("  3 - ET - 增强肿瘤")
        print("  4 - RC - 切除腔")
        return task_folder
    else:
        print("警告: 没有成功处理任何病例，未生成dataset.json文件")
        return None


# 使用示例
if __name__ == "__main__":
    brats_root = "BraTS2024"       # 您的BraTS2024数据根目录
    nnunet_raw_data_base = "data"  # nnUNet原始数据基础目录

    try:
        result = convert_brats2024_to_nnunet(brats_root, nnunet_raw_data_base, max_workers=8)
        if result:
            print(f"\n转换成功完成！输出目录: {result}")
            print("可以继续进行nnUNet的预处理和训练步骤。")
            print("\n注意：BraTS2024引入了新的切除腔（RC）标签（标签值4）。")
        else:
            print("\n转换失败，请查看错误日志了解详细信息。")
    except Exception as e:
        print(f"程序执行失败: {str(e)}")
        error_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "error.txt")
        with open(error_file_path, 'w', encoding='utf-8') as f:
            f.write(f"程序执行失败: {str(e)}\n")
        print(f"错误已记录到: {error_file_path}")
```










