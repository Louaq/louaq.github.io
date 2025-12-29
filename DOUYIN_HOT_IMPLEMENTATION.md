# 抖音热搜组件实施完成说明

## ✅ 已完成的所有步骤

参考 [Firefly Issue #105](https://github.com/CuteLeaf/Firefly/issues/105) 的标准流程，所有必要步骤已完成：

### 步骤一：创建组件文件 ✅
**文件**: `src/components/widget/DouyinHot.astro`

- 使用 WidgetLayout 包裹内容保持统一样式
- 接收 `class` 和 `style` props 用于外部控制
- 实现了实时获取抖音热搜数据的功能
- 支持自动刷新（每5分钟）
- 响应式设计，支持深色/浅色主题

### 步骤二：注册组件类型 ✅
**文件**: `src/types/config.ts`

在 `WidgetComponentType` 类型定义中添加了 `"douyinHot"` 类型：

```typescript
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "sidebarToc"
	| "advertisement"
	| "stats"
	| "calendar"
	| "countdown"
	| "douyinHot"  // ✅ 新增
	| "custom";
```

### 步骤三：更新组件映射表 ✅
在三个侧边栏文件中分别完成更新：

#### 1. `src/components/layout/SideBar.astro` ✅
- ✅ 导入 DouyinHot 组件
- ✅ 添加到 componentTypeToId 映射
- ✅ 添加到 componentMap 映射表

#### 2. `src/components/layout/LeftSideBar.astro` ✅
- ✅ 导入 DouyinHot 组件
- ✅ 添加到 componentMap 映射表

#### 3. `src/components/layout/RightSideBar.astro` ✅
- ✅ 导入 DouyinHot 组件
- ✅ 添加到 componentTypeToId 映射
- ✅ 添加到 componentMap 映射表

### 步骤四：更新组件管理器 ✅
**文件**: `src/utils/widget-manager.ts`

在 `WIDGET_COMPONENT_MAP` 常量中添加了映射关系：

```typescript
export const WIDGET_COMPONENT_MAP = {
	// ... 其他组件
	douyinHot: "../components/widget/DouyinHot.astro",  // ✅ 新增
	custom: null,
} as const;
```

### 步骤五：配置启用组件 ✅
**文件**: `src/config/sidebarConfig.ts`

在 `rightComponents` 数组中添加了配置：

```typescript
{
	type: "douyinHot",
	enable: true,
	order: 1.5,
	position: "sticky",
	showOnPostPage: false,
	class: "onload-animation",
	animationDelay: 250,
}
```

## 📋 组件特性

- **实时数据**: 使用 xxapi (v2.xxapi.cn) 获取最新抖音热搜
- **稳定接口**: 采用可靠的第三方API服务
- **自动刷新**: 每5分钟自动更新一次
- **排名着色**: 前3名分别用红色、橙色、黄色高亮
- **热度显示**: 显示浏览量，自动转换为万/亿单位
- **响应式设计**: 适配各种屏幕尺寸
- **主题适配**: 自动适配深色/浅色主题
- **可折叠**: 支持展开/折叠功能
- **点击跳转**: 点击热搜项可跳转到抖音页面
- **错误处理**: 完善的错误处理和日志输出

## 🔌 API 接口说明

### 当前使用的API
```
https://v2.xxapi.cn/api/douyinhot
```

### API 调用方式
```javascript
// 使用 fetch API（参考 axios 实现）
fetch("https://v2.xxapi.cn/api/douyinhot", {
  method: "GET",
  headers: {
    "Accept": "application/json",
  },
})
```

### 返回数据格式

实际API返回的数据结构：

```json
{
  "code": 200,
  "msg": "数据请求成功",
  "data": [
    {
      "word": "解放军无人机俯瞰台北101大厦",
      "hot_value": 11873754,
      "position": 1,
      "group_id": "7587741839425819958",
      "sentence_id": "2351188",
      "label": 1,
      "word_cover": {
        "url_list": ["图片URL1", "图片URL2"]
      }
    }
  ]
}
```

### 字段映射

| API字段 | 组件字段 | 说明 |
|--------|---------|------|
| `word` | `title` | 热搜标题 |
| `hot_value` | `hot` | 热度值（格式化为万/亿） |
| `position` | `index` | 排名位置 |
| `group_id` | 用于生成链接 | 话题ID |

组件会自动将API数据转换为适合显示的格式。

## 🚀 启动和查看

运行以下命令启动开发服务器：

```bash
pnpm dev
```

打开浏览器访问 `http://localhost:4321`，你将在右侧边栏看到抖音热搜组件。

### 查看调试信息

按 F12 打开浏览器控制台，可以看到：

```javascript
抖音热搜数据: { code: 200, data: [...] }
```

如果看到错误信息，检查：
1. 网络连接是否正常
2. API 接口是否可访问
3. 返回的数据格式是否正确

## 🔧 配置说明

### 启用/禁用组件
在 `src/config/sidebarConfig.ts` 中修改：
```typescript
{
	type: "douyinHot",
	enable: true,  // true=启用，false=禁用
	// ...
}
```

### 调整显示位置
- **order**: 数值越小越靠前（当前为 1.5）
- **position**: 
  - `"top"` - 固定在顶部
  - `"sticky"` - 跟随滚动（当前配置）

### 调整显示页面
- **showOnPostPage**: 
  - `true` - 所有页面显示
  - `false` - 仅非文章页显示（当前配置）

### 自定义刷新频率
编辑 `src/components/widget/DouyinHot.astro`：
```typescript
// 修改这一行的数值（单位：毫秒）
setInterval(() => this.fetchDouyinHot(), 5 * 60 * 1000);
```

## 🔍 故障排查

### 组件不显示？

1. **检查配置是否启用**
   ```typescript
   enable: true  // 确保为 true
   ```

2. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 是否有错误信息
   - 查看 Network 标签页，确认 API 请求成功

3. **检查网络连接**
   - 确保能访问 `https://api.vvhan.com`
   - 尝试在浏览器直接访问: `https://api.vvhan.com/api/hotlist/douyinHot`

4. **清除缓存重新构建**
   ```bash
   pnpm clean  # 如果有清理命令
   pnpm dev
   ```

### API 返回错误？

当前使用 **xxapi (v2.xxapi.cn)** 接口。

如果遇到问题：

1. **检查控制台日志**
   ```
   抖音热搜获取失败: HTTP 404: Not Found
   ```

2. **尝试手动访问API**
   在浏览器中打开: `https://v2.xxapi.cn/api/douyinhot`
   
3. **更换备用API**
   如果当前API不可用，可以修改代码中的URL：
   ```typescript
   // 方案1: 韩小韩API
   const response = await fetch("https://api.vvhan.com/api/hotlist/douyinHot");
   
   // 方案2: tenapi
   const response = await fetch("https://tenapi.cn/v2/douyinhot");
   
   // 方案3: alapi（可能需要token）
   const response = await fetch("https://v2.alapi.cn/api/toutiao/douyin");
   ```

4. **检查CORS问题**
   如果是跨域问题，可以考虑：
   - 使用支持CORS的API
   - 通过后端代理请求
   - 使用浏览器插件临时解决（仅开发环境）

## 📚 相关文档

- [组件使用说明](src/components/widget/DouyinHot.README.md)
- [Firefly 自定义组件指南](https://github.com/CuteLeaf/Firefly/issues/105)
- [韩小韩 API 文档](https://api.vvhan.com/)

## 📝 更新日志

- 2025-01-29: 完成抖音热搜组件的完整实施
  - 创建组件文件
  - 注册组件类型
  - 更新所有侧边栏文件
  - 更新组件管理器
  - 配置并启用组件

