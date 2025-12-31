# 相册使用说明

## 配置方式

相册采用**集中配置**方式，所有相册信息在 `src/config/albumsConfig.ts` 中统一管理。

## 目录结构

```
项目根目录/
├── src/
│   └── config/
│       └── albumsConfig.ts    # 相册配置文件（统一配置所有相册）
└── public/
    └── albums/
        ├── example-album/     # 相册文件夹（仅存放图片）
        │   ├── cover.jpg
        │   ├── photo1.jpg
        │   ├── photo2.jpg
        │   └── ...
        └── my-trip-2024/
            ├── cover.jpg
            └── ...
```

## 配置文件说明 (src/config/albumsConfig.ts)

```typescript
export const albumsConfig: Album[] = [
  {
    id: "example-album",                    // 相册ID（必需，对应文件夹名）
    title: "示例相册",                       // 相册标题（必需）
    description: "相册描述",                 // 相册描述（可选）
    cover: "/albums/example-album/cover.jpg", // 封面图片路径（必需）
    date: "2024-01-01",                     // 相册日期（必需）
    location: "杭州",                        // 拍摄地点（可选）
    tags: ["风景", "旅行"],                   // 标签（可选）
    photos: [
      {
        id: "photo1",                       // 照片ID（必需）
        src: "/albums/example-album/photo1.jpg",  // 照片路径（必需）
        thumbnail: "/albums/example-album/photo1.jpg", // 缩略图（可选）
        title: "美丽的日落",                 // 照片标题（可选）
        description: "在海边拍摄的美丽日落",  // 照片描述（可选）
        date: "2024-01-01",                 // 拍摄日期（可选）
        location: "杭州西湖",                // 拍摄地点（可选）
        tags: ["日落", "风景"],              // 标签（可选）
        width: 1920,                        // 宽度（可选，用于灯箱显示）
        height: 1080,                       // 高度（可选）
      },
      // 更多照片...
    ],
  },
  // 更多相册...
];
```

## 创建新相册

### 步骤 1：创建图片文件夹

在 `public/albums/` 下创建新文件夹，例如 `my-trip-2024`：

```bash
mkdir public/albums/my-trip-2024
```

### 步骤 2：放置图片文件

将照片和封面图放入文件夹：

```
public/albums/my-trip-2024/
├── cover.jpg
├── photo1.jpg
├── photo2.jpg
└── photo3.jpg
```

### 步骤 3：配置相册信息

打开 `src/config/albumsConfig.ts`，添加新相册配置：

```typescript
export const albumsConfig: Album[] = [
  // ... 现有相册 ...
  
  {
    id: "my-trip-2024",
    title: "2024年旅行",
    description: "记录2024年的旅行足迹",
    cover: "/albums/my-trip-2024/cover.jpg",
    date: "2024-06-01",
    location: "北京",
    tags: ["旅行", "2024"],
    photos: [
      {
        id: "photo1",
        src: "/albums/my-trip-2024/photo1.jpg",
        title: "天安门广场",
        description: "清晨的天安门广场",
        date: "2024-06-01",
        location: "北京天安门",
        tags: ["北京", "建筑"],
        width: 1920,
        height: 1080,
      },
      {
        id: "photo2",
        src: "/albums/my-trip-2024/photo2.jpg",
        title: "故宫",
        date: "2024-06-02",
        width: 1920,
        height: 1080,
      },
      // 更多照片...
    ],
  },
];
```

### 步骤 4：重新构建项目

```bash
npm run build
# 或
npm run dev
```

## 支持的图片格式

- .jpg / .jpeg
- .png
- .webp
- .gif

## 注意事项

1. **相册 ID**：需要与文件夹名称一致，建议使用小写字母、数字和连字符
2. **图片路径**：必须以 `/albums/相册ID/` 开头，例如 `/albums/my-trip-2024/photo1.jpg`
3. **封面图片**：建议使用 4:3 比例的图片以获得最佳显示效果
4. **照片顺序**：照片会按照配置文件中的顺序显示
5. **日期格式**：使用 ISO 8601 格式，例如 `2024-01-01`
6. **集中管理**：所有配置都在 `src/config/albumsConfig.ts` 中，方便统一管理和修改

## 优势

✅ **集中配置**：所有相册信息在一个文件中管理，方便维护  
✅ **类型安全**：TypeScript 提供类型检查，减少配置错误  
✅ **版本控制**：配置文件纳入 Git，便于追踪修改历史  
✅ **灵活扩展**：可以轻松添加自定义字段和功能  

## 控制相册功能显示

在 `src/config/siteConfig.ts` 中：

```typescript
pages: {
  albums: true, // 设为 false 则隐藏相册功能
}
```

