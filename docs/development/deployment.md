# 测试与部署

本文档介绍如何使用GitHub Actions自动化测试和部署VitePress文档网站。

## 自动化测试流程

我们使用GitHub Actions实现自动化测试，确保每次代码变更都不会破坏现有功能。

### 测试内容

1. **构建验证**：确保VitePress能够成功构建网站
2. **链接检查**：验证网站内部链接的有效性
3. **性能检测**：基本的性能指标监控

### 测试工作流

测试工作流在以下情况下自动触发：
- 提交Pull Request到main分支
- 手动触发workflow_dispatch事件

## 自动化部署流程

部署流程也使用GitHub Actions实现，当代码合并到main分支后自动触发。

### 部署步骤

1. **代码检出**：获取最新版本的代码
2. **环境设置**：配置Node.js运行环境
3. **依赖安装**：安装项目依赖
4. **构建网站**：执行VitePress构建
5. **发布**：将构建结果部署到GitHub Pages

### 配置文件说明

工作流配置位于`.github/workflows/`目录：

```yaml
# deploy.yml - 部署配置
name: Deploy VitePress site to GitHub Pages

on:
  push:
    branches: [main] # 当推送到main分支时触发
  workflow_dispatch:  # 允许手动触发

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      # 设置Node.js环境
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'npm'
      
      # 安装依赖
      - name: Install dependencies
        run: npm ci
      
      # 构建网站
      - name: Build
        run: npm run build
      
      # 上传构建结果
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: docs/.vitepress/dist

  # 部署到GitHub Pages
  deploy:
    needs: build
    runs-on: ubuntu-latest
    # ...部署配置
```

## 如何手动触发部署

1. 访问GitHub仓库
2. 点击"Actions"选项卡
3. 选择"Deploy VitePress site to GitHub Pages"工作流
4. 点击"Run workflow"按钮
5. 选择分支，然后点击"Run workflow"确认

## 部署后验证

每次成功部署后，应执行以下验证：

1. 访问部署网址，确认网站可以正常访问
2. 检查最新内容是否已更新
3. 随机测试几个页面的功能和链接
4. 验证移动端显示是否正常

## 回滚流程

如果部署后发现严重问题，可以通过以下步骤回滚：

1. 还原代码到上一个稳定版本
2. 推送到main分支或手动触发部署工作流
3. 等待新部署完成

## 性能优化建议

为确保网站加载速度，请注意以下几点：

1. 图片应适当压缩
2. 使用合适的字体子集
3. 避免不必要的JavaScript代码
4. 定期检查并更新依赖 