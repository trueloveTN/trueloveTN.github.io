#!/bin/bash

# 设置变量
SITE_DIR=$(pwd)  # 当前目录
BRANCH="gh-pages"
REMOTE="origin"

# 生成 Hugo 网站
echo "正在构建 Hugo 网站..."
hugo

# 切换到 gh-pages 分支（如果当前不在该分支）
git checkout $BRANCH || git checkout --orphan $BRANCH

# 删除所有文件（准备部署新内容）
git rm -rf .

# 将 public 目录中的文件复制到根目录
cp -r public/* ./

# 添加和提交更改
git add .
git commit -m "Deploy Hugo site to GitHub Pages"

# 推送到 GitHub
git push $REMOTE $BRANCH --force



