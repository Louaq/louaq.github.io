---
title: LA Train
published: 2026-03-10 11:03:00
expires: 2026-08-21 23:59:59
description: "LA数据集半监督训练"
category: 半监督医学图像分割
tags: [LA数据集]
---

> BraTS2019 dataset

```python
// brats.py
import os
import torch
import numpy as np
from glob import glob
from torch.utils.data import Dataset
import h5py
import itertools
from torch.utils.data.sampler import Sampler


class BraTS2019(Dataset):
    """ BraTS2019 Dataset """

    def __init__(self, base_dir=None, split='train', num=None, transform=None):
        self._base_dir = base_dir
        self.transform = transform
        self.sample_list = []

        train_path = self._base_dir+'/train.txt'
        test_path = self._base_dir+'/val.txt'

        if split == 'train':
            with open(train_path, 'r') as f:
                self.image_list = f.readlines()
        elif split == 'test':
            with open(test_path, 'r') as f:
                self.image_list = f.readlines()

        self.image_list = [item.replace('\n', '').split(",")[0] for item in self.image_list]
        if num is not None:
            self.image_list = self.image_list[:num]
        print("total {} samples".format(len(self.image_list)))

    def __len__(self):
        return len(self.image_list)

    def __getitem__(self, idx):
        image_name = self.image_list[idx]
        h5f = h5py.File(self._base_dir + "/data/{}.h5".format(image_name), 'r')
        image = h5f['image'][:]
        label = h5f['label'][:]
        sample = {'image': image, 'label': label.astype(np.uint8)}
        if self.transform:
            sample = self.transform(sample)
        return sample


class CenterCrop(object):
    def __init__(self, output_size):
        self.output_size = output_size

    def __call__(self, sample):
        image, label = sample['image'], sample['label']

        # pad the sample if necessary
        if label.shape[0] <= self.output_size[0] or label.shape[1] <= self.output_size[1] or label.shape[2] <= \
                self.output_size[2]:
            pw = max((self.output_size[0] - label.shape[0]) // 2 + 3, 0)
            ph = max((self.output_size[1] - label.shape[1]) // 2 + 3, 0)
            pd = max((self.output_size[2] - label.shape[2]) // 2 + 3, 0)
            image = np.pad(image, [(pw, pw), (ph, ph), (pd, pd)],
                           mode='constant', constant_values=0)
            label = np.pad(label, [(pw, pw), (ph, ph), (pd, pd)],
                           mode='constant', constant_values=0)

        (w, h, d) = image.shape

        w1 = int(round((w - self.output_size[0]) / 2.))
        h1 = int(round((h - self.output_size[1]) / 2.))
        d1 = int(round((d - self.output_size[2]) / 2.))

        label = label[w1:w1 + self.output_size[0], h1:h1 +
                      self.output_size[1], d1:d1 + self.output_size[2]]
        image = image[w1:w1 + self.output_size[0], h1:h1 +
                      self.output_size[1], d1:d1 + self.output_size[2]]

        return {'image': image, 'label': label}


class RandomCrop(object):
    """
    Crop randomly the image in a sample
    Args:
    output_size (int): Desired output size
    """

    def __init__(self, output_size, with_sdf=False):
        self.output_size = output_size
        self.with_sdf = with_sdf

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        if self.with_sdf:
            sdf = sample['sdf']

        # pad the sample if necessary
        if label.shape[0] <= self.output_size[0] or label.shape[1] <= self.output_size[1] or label.shape[2] <= \
                self.output_size[2]:
            pw = max((self.output_size[0] - label.shape[0]) // 2 + 3, 0)
            ph = max((self.output_size[1] - label.shape[1]) // 2 + 3, 0)
            pd = max((self.output_size[2] - label.shape[2]) // 2 + 3, 0)
            image = np.pad(image, [(pw, pw), (ph, ph), (pd, pd)],
                           mode='constant', constant_values=0)
            label = np.pad(label, [(pw, pw), (ph, ph), (pd, pd)],
                           mode='constant', constant_values=0)
            if self.with_sdf:
                sdf = np.pad(sdf, [(pw, pw), (ph, ph), (pd, pd)],
                             mode='constant', constant_values=0)

        (w, h, d) = image.shape
        # if np.random.uniform() > 0.33:
        #     w1 = np.random.randint((w - self.output_size[0])//4, 3*(w - self.output_size[0])//4)
        #     h1 = np.random.randint((h - self.output_size[1])//4, 3*(h - self.output_size[1])//4)
        # else:
        w1 = np.random.randint(0, w - self.output_size[0])
        h1 = np.random.randint(0, h - self.output_size[1])
        d1 = np.random.randint(0, d - self.output_size[2])

        label = label[w1:w1 + self.output_size[0], h1:h1 +
                      self.output_size[1], d1:d1 + self.output_size[2]]
        image = image[w1:w1 + self.output_size[0], h1:h1 +
                      self.output_size[1], d1:d1 + self.output_size[2]]
        if self.with_sdf:
            sdf = sdf[w1:w1 + self.output_size[0], h1:h1 +
                      self.output_size[1], d1:d1 + self.output_size[2]]
            return {'image': image, 'label': label, 'sdf': sdf}
        else:
            return {'image': image, 'label': label}


class RandomRotFlip(object):
    """
    Crop randomly flip the dataset in a sample
    Args:
    output_size (int): Desired output size
    """

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        k = np.random.randint(0, 4)
        image = np.rot90(image, k)
        label = np.rot90(label, k)
        axis = np.random.randint(0, 2)
        image = np.flip(image, axis=axis).copy()
        label = np.flip(label, axis=axis).copy()

        return {'image': image, 'label': label}


class RandomNoise(object):
    def __init__(self, mu=0, sigma=0.1):
        self.mu = mu
        self.sigma = sigma

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        noise = np.clip(self.sigma * np.random.randn(
            image.shape[0], image.shape[1], image.shape[2]), -2*self.sigma, 2*self.sigma)
        noise = noise + self.mu
        image = image + noise
        return {'image': image, 'label': label}


class CreateOnehotLabel(object):
    def __init__(self, num_classes):
        self.num_classes = num_classes

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        onehot_label = np.zeros(
            (self.num_classes, label.shape[0], label.shape[1], label.shape[2]), dtype=np.float32)
        for i in range(self.num_classes):
            onehot_label[i, :, :, :] = (label == i).astype(np.float32)
        return {'image': image, 'label': label, 'onehot_label': onehot_label}


class ToTensor(object):
    """Convert ndarrays in sample to Tensors."""

    def __call__(self, sample):
        image = sample['image']
        image = image.reshape(
            1, image.shape[0], image.shape[1], image.shape[2]).astype(np.float32)
        if 'onehot_label' in sample:
            return {'image': torch.from_numpy(image), 'label': torch.from_numpy(sample['label']).long(),
                    'onehot_label': torch.from_numpy(sample['onehot_label']).long()}
        else:
            return {'image': torch.from_numpy(image), 'label': torch.from_numpy(sample['label']).long()}


class TwoStreamBatchSampler(Sampler):
    """Iterate two sets of indices

    An 'epoch' is one iteration through the primary indices.
    During the epoch, the secondary indices are iterated through
    as many times as needed.
    """

    def __init__(self, primary_indices, secondary_indices, batch_size, secondary_batch_size):
        self.primary_indices = primary_indices
        self.secondary_indices = secondary_indices
        self.secondary_batch_size = secondary_batch_size
        self.primary_batch_size = batch_size - secondary_batch_size

        assert len(self.primary_indices) >= self.primary_batch_size > 0
        assert len(self.secondary_indices) >= self.secondary_batch_size > 0

    def __iter__(self):
        primary_iter = iterate_once(self.primary_indices)
        secondary_iter = iterate_eternally(self.secondary_indices)
        return (
            primary_batch + secondary_batch
            for (primary_batch, secondary_batch)
            in zip(grouper(primary_iter, self.primary_batch_size),
                   grouper(secondary_iter, self.secondary_batch_size))
        )

    def __len__(self):
        return len(self.primary_indices) // self.primary_batch_size


def iterate_once(iterable):
    return np.random.permutation(iterable)


def iterate_eternally(indices):
    def infinite_shuffles():
        while True:
            yield np.random.permutation(indices)
    return itertools.chain.from_iterable(infinite_shuffles())


def grouper(iterable, n):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3) --> ABC DEF"
    args = [iter(iterable)] * n
    return zip(*args)



```












> Dataset

```python
// LA.py
import os
import torch
import numpy as np
from glob import glob
from torch.utils.data import Dataset
import h5py
import itertools
from scipy import ndimage
import random
from torch.utils.data.sampler import Sampler
from skimage import transform as sk_trans
from scipy.ndimage import rotate, zoom
import pdb
import matplotlib.pyplot as plt



class BaseDataSets(Dataset):
    def __init__(self, base_dir=None, split='train', num=None, transform=None):
        self._base_dir = base_dir
        self.sample_list = []
        self.split = split
        self.transform = transform
        if self.split == 'train':
            with open(self._base_dir + '/train_slices.list', 'r') as f1:
                self.sample_list = f1.readlines()
            self.sample_list = [item.replace('\n', '') for item in self.sample_list]

        elif self.split == 'val':
            with open(self._base_dir + '/val.list', 'r') as f:
                self.sample_list = f.readlines()
            self.sample_list = [item.replace('\n', '') for item in self.sample_list]
        if num is not None and self.split == "train":
            self.sample_list = self.sample_list[:num]
        print("total {} samples".format(len(self.sample_list)))

    def __len__(self):
        return len(self.sample_list)

    def __getitem__(self, idx):
        case = self.sample_list[idx]
        if self.split == "train":
            h5f = h5py.File(self._base_dir + "/data/slices/{}.h5".format(case), 'r')
        else:
            h5f = h5py.File(self._base_dir + "/data/{}.h5".format(case), 'r')
        image = h5f['image'][:]
        label = h5f['label'][:]
        sample = {'image': image, 'label': label}
        if self.split == "train":
            sample = self.transform(sample)
        # sample["idx"] = idx
        sample['case'] = case
        return sample

def random_rot_flip(image, label):
    k = np.random.randint(0, 4)
    image = np.rot90(image, k)
    label = np.rot90(label, k)
    axis = np.random.randint(0, 2)
    image = np.flip(image, axis=axis).copy()
    label = np.flip(label, axis=axis).copy()
    return image, label


def random_rotate(image, label):
    angle = np.random.randint(-20, 20)
    image = ndimage.rotate(image, angle, order=0, reshape=False)
    label = ndimage.rotate(label, angle, order=0, reshape=False)
    return image, label


class RandomGenerator(object):
    def __init__(self, output_size):
        self.output_size = output_size

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        # ind = random.randrange(0, img.shape[0])
        # image = img[ind, ...]
        # label = lab[ind, ...]
        if random.random() > 0.5:
            image, label = random_rot_flip(image, label)
        elif random.random() > 0.5:
            image, label = random_rotate(image, label)
        x, y = image.shape
        image = zoom(image, (self.output_size[0] / x, self.output_size[1] / y), order=0)
        label = zoom(label, (self.output_size[0] / x, self.output_size[1] / y), order=0)
        image = torch.from_numpy(image.astype(np.float32)).unsqueeze(0)
        label = torch.from_numpy(label.astype(np.uint8))
        sample = {'image': image, 'label': label}
        return sample


class LAHeart(Dataset):
    """ LA Dataset """
    def __init__(self, base_dir=None, split='train', num=None, transform=None):
        self._base_dir = base_dir
        self.transform = transform
        self.sample_list = []

        train_path = self._base_dir+'/train.list'
        test_path = self._base_dir+'/test.list'

        if split=='train':
            with open(train_path, 'r') as f:
                self.image_list = f.readlines()
        elif split == 'test':
            with open(test_path, 'r') as f:
                self.image_list = f.readlines()

        self.image_list = [item.replace('\n','') for item in self.image_list]
        if num is not None:
            self.image_list = self.image_list[:num]
        print("total {} samples".format(len(self.image_list)))

    def __len__(self):
        return len(self.image_list)

    def __getitem__(self, idx):
        image_name = self.image_list[idx]
        h5f = h5py.File(self._base_dir + "/2018LA_Seg_Training Set/" + image_name + "/mri_norm2.h5", 'r')
        # h5f = h5py.File(self._base_dir+"/"+image_name+"/mri_norm2.h5", 'r')
        image = h5f['image'][:]
        label = h5f['label'][:]
        sample = {'image': image, 'label': label}
        if self.transform:
            sample = self.transform(sample)

        return sample

class Pancreas(Dataset):
    """ Pancreas Dataset """
    def __init__(self, base_dir=None, split='train', num=None, transform=None):
        self._base_dir = base_dir
        self.transform = transform
        self.sample_list = []

        train_path = self._base_dir+'/train.list'
        test_path = self._base_dir+'/test.list'

        if split=='train':
            with open(train_path, 'r') as f:
                self.image_list = f.readlines()
        elif split == 'test':
            with open(test_path, 'r') as f:
                self.image_list = f.readlines()

        self.image_list = [item.replace('\n','') for item in self.image_list]
        if num is not None:
            self.image_list = self.image_list[:num]
        print("total {} samples".format(len(self.image_list)))

    def __len__(self):
        return len(self.image_list)

    def __getitem__(self, idx):
        image_name = self.image_list[idx]
        h5f = h5py.File(self._base_dir + "/data/" + image_name, 'r')
        image = h5f['image'][:]
        label = h5f['label'][:]
        sample = {'image': image, 'label': label}
        if self.transform:
            sample = self.transform(sample)

        return sample



class Resize(object):

    def __init__(self, output_size):
        self.output_size = output_size

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        (w, h, d) = image.shape
        label = label.astype(np.bool)
        image = sk_trans.resize(image, self.output_size, order = 1, mode = 'constant', cval = 0)
        label = sk_trans.resize(label, self.output_size, order = 0)
        assert(np.max(label) == 1 and np.min(label) == 0)
        assert(np.unique(label).shape[0] == 2)
        
        return {'image': image, 'label': label}
    
    
class CenterCrop(object):
    def __init__(self, output_size):
        self.output_size = output_size

    def __call__(self, sample):
        image, label = sample['image'], sample['label']

        # pad the sample if necessary
        if label.shape[0] <= self.output_size[0] or label.shape[1] <= self.output_size[1] or label.shape[2] <= \
                self.output_size[2]:
            pw = max((self.output_size[0] - label.shape[0]) // 2 + 3, 0)
            ph = max((self.output_size[1] - label.shape[1]) // 2 + 3, 0)
            pd = max((self.output_size[2] - label.shape[2]) // 2 + 3, 0)
            image = np.pad(image, [(pw, pw), (ph, ph), (pd, pd)], mode='constant', constant_values=0)
            label = np.pad(label, [(pw, pw), (ph, ph), (pd, pd)], mode='constant', constant_values=0)

        (w, h, d) = image.shape

        w1 = int(round((w - self.output_size[0]) / 2.))
        h1 = int(round((h - self.output_size[1]) / 2.))
        d1 = int(round((d - self.output_size[2]) / 2.))

        label = label[w1:w1 + self.output_size[0], h1:h1 + self.output_size[1], d1:d1 + self.output_size[2]]
        image = image[w1:w1 + self.output_size[0], h1:h1 + self.output_size[1], d1:d1 + self.output_size[2]]

        return {'image': image, 'label': label}


class RandomCrop(object):
    """
    Crop randomly the image in a sample
    Args:
    output_size (int): Desired output size
    """

    def __init__(self, output_size, with_sdf=False):
        self.output_size = output_size
        self.with_sdf = with_sdf

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        if self.with_sdf:
            sdf = sample['sdf']

        # pad the sample if necessary
        if label.shape[0] <= self.output_size[0] or label.shape[1] <= self.output_size[1] or label.shape[2] <= \
                self.output_size[2]:
            pw = max((self.output_size[0] - label.shape[0]) // 2 + 3, 0)
            ph = max((self.output_size[1] - label.shape[1]) // 2 + 3, 0)
            pd = max((self.output_size[2] - label.shape[2]) // 2 + 3, 0)
            image = np.pad(image, [(pw, pw), (ph, ph), (pd, pd)], mode='constant', constant_values=0)
            label = np.pad(label, [(pw, pw), (ph, ph), (pd, pd)], mode='constant', constant_values=0)
            if self.with_sdf:
                sdf = np.pad(sdf, [(pw, pw), (ph, ph), (pd, pd)], mode='constant', constant_values=0)

        (w, h, d) = image.shape

        w1 = np.random.randint(0, w - self.output_size[0])
        h1 = np.random.randint(0, h - self.output_size[1])
        d1 = np.random.randint(0, d - self.output_size[2])

        label = label[w1:w1 + self.output_size[0], h1:h1 + self.output_size[1], d1:d1 + self.output_size[2]]
        image = image[w1:w1 + self.output_size[0], h1:h1 + self.output_size[1], d1:d1 + self.output_size[2]]
        if self.with_sdf:
            sdf = sdf[w1:w1 + self.output_size[0], h1:h1 + self.output_size[1], d1:d1 + self.output_size[2]]
            return {'image': image, 'label': label, 'sdf': sdf}
        else:
            return {'image': image, 'label': label}


class RandomRotFlip(object):
    """
    Crop randomly flip the dataset in a sample
    Args:
    output_size (int): Desired output size
    """

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        image, label = random_rot_flip(image, label)

        return {'image': image, 'label': label}

class RandomRot(object):
    """
    Crop randomly flip the dataset in a sample
    Args:
    output_size (int): Desired output size
    """

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        image, label = random_rotate(image, label)

        return {'image': image, 'label': label}


class RandomNoise(object):
    def __init__(self, mu=0, sigma=0.1):
        self.mu = mu
        self.sigma = sigma

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        noise = np.clip(self.sigma * np.random.randn(image.shape[0], image.shape[1], image.shape[2]), -2*self.sigma, 2*self.sigma)
        noise = noise + self.mu
        image = image + noise
        return {'image': image, 'label': label}


class CreateOnehotLabel(object):
    def __init__(self, num_classes):
        self.num_classes = num_classes

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        # print(label.shape)
        onehot_label = np.zeros((self.num_classes, label.shape[0], label.shape[1]), dtype=np.float32)
        for i in range(self.num_classes):
            onehot_label[i, :, :] = (label == i).type(torch.float32)
        return {'image': image, 'label': label, 'onehot_label': onehot_label}

class CreateOnehotLabel3D(object):
    def __init__(self, num_classes):
        self.num_classes = num_classes

    def __call__(self, sample):
        image, label = sample['image'], sample['label']
        onehot_label = np.zeros((self.num_classes, label.shape[0], label.shape[1], label.shape[2]), dtype=np.float32)
        for i in range(self.num_classes):
            onehot_label[i, :, :, :] = (label == i).astype(np.float32)
        return {'image': image, 'label': label,'onehot_label':onehot_label}

class ToTensor(object):
    """Convert ndarrays in sample to Tensors."""

    def __call__(self, sample):
        image = sample['image']
        image = image.reshape(1, image.shape[0], image.shape[1], image.shape[2]).astype(np.float32)
        if 'onehot_label' in sample:
            return {'image': torch.from_numpy(image), 'label': torch.from_numpy(sample['label']).long(),
                    'onehot_label': torch.from_numpy(sample['onehot_label']).long()}
        else:
            return {'image': torch.from_numpy(image), 'label': torch.from_numpy(sample['label']).long()}



class TwoStreamBatchSampler(Sampler):
    """Iterate two sets of indices

    An 'epoch' is one iteration through the primary indices.
    During the epoch, the secondary indices are iterated through
    as many times as needed.
    """
    def __init__(self, primary_indices, secondary_indices, batch_size, secondary_batch_size):
        self.primary_indices = primary_indices
        self.secondary_indices = secondary_indices
        self.secondary_batch_size = secondary_batch_size
        self.primary_batch_size = batch_size - secondary_batch_size

        assert len(self.primary_indices) >= self.primary_batch_size > 0
        assert len(self.secondary_indices) >= self.secondary_batch_size > 0

    def __iter__(self):
        primary_iter = iterate_once(self.primary_indices)
        secondary_iter = iterate_eternally(self.secondary_indices)
        return (
            primary_batch + secondary_batch
            for (primary_batch, secondary_batch)
            in zip(grouper(primary_iter, self.primary_batch_size),
                    grouper(secondary_iter, self.secondary_batch_size))
        )

    def __len__(self):
        return len(self.primary_indices) // self.primary_batch_size


class ThreeStreamBatchSampler(Sampler):
    """Iterate two sets of indices

    An 'epoch' is one iteration through the primary indices.
    During the epoch, the secondary indices are iterated through
    as many times as needed.
    """
    def __init__(self, primary_indices, secondary_indices, batch_size, secondary_batch_size):
        self.primary_indices = primary_indices
        self.secondary_indices = secondary_indices
        self.secondary_batch_size = secondary_batch_size
        self.primary_batch_size = batch_size - secondary_batch_size

        assert len(self.primary_indices) >= self.primary_batch_size > 0
        assert len(self.secondary_indices) >= self.secondary_batch_size > 0

    def __iter__(self):
        primary_iter = iterate_once(self.primary_indices)
        secondary_iter = iterate_eternally(self.secondary_indices)
        return (
            primary_batch + secondary_batch + primary_batch
            for (primary_batch, secondary_batch, primary_batch)
            in zip(grouper(primary_iter, self.primary_batch_size),
                    grouper(secondary_iter, self.secondary_batch_size),
                    grouper(primary_iter, self.primary_batch_size))
        )

    def __len__(self):
        return len(self.primary_indices) // self.primary_batch_size

def iterate_once(iterable):
    return np.random.permutation(iterable)


def iterate_eternally(indices):
    def infinite_shuffles():
        while True:
            yield np.random.permutation(indices)
    return itertools.chain.from_iterable(infinite_shuffles())


def grouper(iterable, n):
    "Collect data into fixed-length chunks or blocks"
    # grouper('ABCDEFG', 3) --> ABC DEF"
    args = [iter(iterable)] * n
    return zip(*args)
```

> ACDC测试


```python
// test_ACDC.py
import os
import argparse
import torch
import numpy as np
import h5py
import nibabel as nib
from tqdm import tqdm
from medpy import metric

from networks.net_factory import net_factory
from utils import val_2d

try:
    from thop import profile, clever_format
    HAS_THOP = True
except ImportError:
    HAS_THOP = False
    print("[Warning] thop not installed. Run: pip install thop  "
          "FLOPs calculation will be skipped.")

parser = argparse.ArgumentParser()
parser.add_argument('--root_path',   type=str,   default='../data/ACDC',  help='Root path of dataset')
parser.add_argument('--exp',         type=str,   default='CPAM',          help='Experiment name')
parser.add_argument('--model',       type=str,   default='unet',          help='Model name')
parser.add_argument('--gpu',         type=str,   default='0',             help='GPU to use')
parser.add_argument('--detail',      type=int,   default=1,               help='Print metrics for every sample?')
parser.add_argument('--nms',         type=int,   default=1,               help='Apply NMS (LargestCC) post-processing?')
parser.add_argument('--labelnum',    type=int,   default=3,               help='Number of labeled patients used in training')
parser.add_argument('--stage_name',  type=str,   default='self_train',    help='Stage: self_train or pre_train')
FLAGS = parser.parse_args()

os.environ['CUDA_VISIBLE_DEVICES'] = FLAGS.gpu

# ── Paths (mirror the training script conventions) ──────────────────────────
snapshot_path  = "./model/CPAM/ACDC_{}_{}_labeled/{}".format(
    FLAGS.exp, FLAGS.labelnum, FLAGS.stage_name)
test_save_path = "./model/CPAM/ACDC_{}_{}_labeled/{}_predictions/".format(
    FLAGS.exp, FLAGS.labelnum, FLAGS.model)

num_classes = 4   # background(0) + RV(1) + Myo(2) + LV(3)

if not os.path.exists(test_save_path):
    os.makedirs(test_save_path)
print("Predictions will be saved to:", test_save_path)

# ── Load test list ────────────────────────────────────────────────────────────
# test.list entries look like: "patient001_frame01"  (one per line)
with open(os.path.join(FLAGS.root_path, 'test.list'), 'r') as f:
    image_list = [line.strip() for line in f.readlines() if line.strip()]

# Full path to each patient .h5 file, e.g.  ../data/ACDC/data/patient001_frame01.h5
image_list = [os.path.join(FLAGS.root_path, "data", item + ".h5")
              for item in image_list]

print("Total test cases:", len(image_list))


# ── NIfTI saving ─────────────────────────────────────────────────────────────
def save_nii(array, save_path, dtype=np.float32):
    """Save a numpy array (D, H, W) as a .nii.gz file."""
    nii_img = nib.Nifti1Image(array.astype(dtype), affine=np.eye(4))
    nib.save(nii_img, save_path)


# ── Metric helpers ────────────────────────────────────────────────────────────
def calculate_metric_percase(pred, gt):
    """Return (dice, jc, hd, asd) for a single binary foreground mask."""
    if pred.sum() > 0 and gt.sum() > 0:
        dice = metric.binary.dc(pred, gt)
        jc   = metric.binary.jc(pred, gt)
        hd   = metric.binary.hd95(pred, gt)
        asd  = metric.binary.asd(pred, gt)
    elif pred.sum() == 0 and gt.sum() == 0:
        dice, jc, hd, asd = 1.0, 1.0, 0.0, 0.0
    else:
        dice, jc, hd, asd = 0.0, 0.0, 100.0, 100.0
    return dice, jc, hd, asd


# ── Model complexity ──────────────────────────────────────────────────────────
def compute_model_complexity(model, input_size=(1, 1, 256, 256)):
    """
    Print parameter count and FLOPs for a single 2-D slice (B=1, C=1, H, W).
    Uses thop if available, otherwise falls back to manual param counting.
    """
    print("\n" + "=" * 50)
    print("Model Complexity")
    print("-" * 50)

    # ── Parameters ──────────────────────────────────────────────────────────
    total_params     = sum(p.numel() for p in model.parameters())
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"  Total params    : {total_params:,}  "
          f"({total_params / 1e6:.2f} M)")
    print(f"  Trainable params: {trainable_params:,}  "
          f"({trainable_params / 1e6:.2f} M)")

    # ── FLOPs via thop ───────────────────────────────────────────────────────
    if HAS_THOP:
        dummy = torch.randn(input_size).cuda()
        model.eval()
        with torch.no_grad():
            try:
                flops, _ = profile(model, inputs=(dummy,), verbose=False)
                flops_str, _ = clever_format([flops, total_params], "%.3f")
                print(f"  FLOPs (per slice): {flops_str}  "
                      f"({flops / 1e9:.3f} GFLOPs)")
            except Exception as e:
                print(f"  FLOPs calculation failed: {e}")
    else:
        print("  FLOPs: skipped (install thop: pip install thop)")

    print("=" * 50 + "\n")


# ── Main evaluation ───────────────────────────────────────────────────────────
def test_calculate_metric():
    # Load model
    model = net_factory(net_type=FLAGS.model, in_chns=1,
                        class_num=num_classes, mode="train")
    save_model_path = os.path.join(snapshot_path,
                                   '{}_best_model.pth'.format(FLAGS.model))
    model.load_state_dict(torch.load(save_model_path))
    print("Loaded weights from:", save_model_path)
    model.eval()

    # ── Parameters & FLOPs ───────────────────────────────────────────────────
    compute_model_complexity(model, input_size=(1, 1, 256, 256))

    # Accumulate metrics across all test cases  (3 foreground classes)
    # Shape: [num_cases, num_fg_classes, 4_metrics]
    all_metrics = []

    for case_path in tqdm(image_list, desc="Testing"):
        # ── Read h5 ──────────────────────────────────────────────────────────
        with h5py.File(case_path, 'r') as f:
            image = f['image'][:]   # (H, W, D) or (D, H, W) — adjust if needed
            label = f['label'][:]   # same shape, integer class labels

        # ── Save dir ─────────────────────────────────────────────────────────
        case_name = os.path.basename(case_path).replace('.h5', '')
        case_save_dir = os.path.join(test_save_path, case_name)
        os.makedirs(case_save_dir, exist_ok=True)

        # ── Inference: build full prediction volume slice-by-slice ────────────
        from scipy.ndimage import zoom as scipy_zoom
        patch_size = [256, 256]
        prediction = np.zeros_like(label)
        for ind in range(image.shape[0]):
            slc = image[ind, :, :]
            x, y = slc.shape
            slc_resized = scipy_zoom(slc, (patch_size[0] / x, patch_size[1] / y), order=0)
            inp = torch.from_numpy(slc_resized).unsqueeze(0).unsqueeze(0).float().cuda()
            with torch.no_grad():
                output = model(inp)
                if len(output) > 1:
                    output = output[0]
                out = torch.argmax(torch.softmax(output, dim=1), dim=1).squeeze(0)
                out = out.cpu().numpy()
                pred_slc = scipy_zoom(out, (x / patch_size[0], y / patch_size[1]), order=0)
                prediction[ind] = pred_slc

        # ── Save .nii.gz ─────────────────────────────────────────────────────
        save_nii(image,      os.path.join(case_save_dir, "image.nii.gz"), dtype=np.float32)
        save_nii(label,      os.path.join(case_save_dir, "gt.nii.gz"),    dtype=np.uint8)
        save_nii(prediction, os.path.join(case_save_dir, "pred.nii.gz"),  dtype=np.uint8)

        # ── Compute 4 metrics per foreground class ────────────────────────────
        metric_i = []
        for c in range(1, num_classes):
            pred_c = (prediction == c)
            gt_c   = (label == c)
            if pred_c.sum() > 0 and gt_c.sum() > 0:
                dice = metric.binary.dc(pred_c, gt_c)
                jc   = metric.binary.jc(pred_c, gt_c)
                hd95 = metric.binary.hd95(pred_c, gt_c)
                asd  = metric.binary.asd(pred_c, gt_c)
            elif pred_c.sum() == 0 and gt_c.sum() == 0:
                dice, jc, hd95, asd = 1.0, 1.0, 0.0, 0.0
            else:
                dice, jc, hd95, asd = 0.0, 0.0, 100.0, 100.0
            metric_i.append((dice, jc, hd95, asd))

        if FLAGS.detail:
            for c_idx, (dice, jc, hd95, asd) in enumerate(metric_i, start=1):
                print(f"  {case_name}  class {c_idx}: "
                      f"Dice={dice:.4f}  Jaccard={jc:.4f}  "
                      f"HD95={hd95:.2f}  ASD={asd:.2f}")

        all_metrics.append(metric_i)   # list of 3 tuples

    # ── Aggregate ─────────────────────────────────────────────────────────────
    all_metrics = np.array(all_metrics)   # (N, 3, 4)
    mean_metrics = all_metrics.mean(axis=0)   # (3, 4)

    class_names = ['RV (class 1)', 'Myo (class 2)', 'LV (class 3)']
    print("\n" + "=" * 70)
    print(f"{'Class':<20} {'Dice':>8} {'Jaccard':>10} {'HD95':>8} {'ASD':>8}")
    print("-" * 70)
    for name, m in zip(class_names, mean_metrics):
        print(f"{name:<20} {m[0]:>8.4f} {m[1]:>10.4f} {m[2]:>8.2f} {m[3]:>8.2f}")
    print("=" * 70)
    mean_dice    = mean_metrics[:, 0].mean()
    mean_jaccard = mean_metrics[:, 1].mean()
    mean_hd95    = mean_metrics[:, 2].mean()
    mean_asd     = mean_metrics[:, 3].mean()
    print(f"{'Mean':<20} {mean_dice:>8.4f} {mean_jaccard:>10.4f} "
          f"{mean_hd95:>8.2f} {mean_asd:>8.2f}")

    return mean_metrics


if __name__ == '__main__':
    metric_result = test_calculate_metric()
    print("\nFinal mean metrics (Dice / Jaccard / HD95 / ASD):")
    print(metric_result)

# ── Example usage ─────────────────────────────────────────────────────────────
# python ACDC_CPAM_test.py --model unet --labelnum 3 --stage_name self_train --gpu 0
# python ACDC_CPAM_test.py --model unet --labelnum 7 --stage_name self_train --gpu 0 --detail 0
```











