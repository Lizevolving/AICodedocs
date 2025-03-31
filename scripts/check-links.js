#!/usr/bin/env node

/**
 * 简单的链接检查工具
 * 在CI流程中使用，检查站点的内部链接是否正常
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// 查找目录中的所有markdown文件
async function findMarkdownFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      await findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// 从markdown文件中提取链接
async function extractLinks(filePath) {
  const content = await readFile(filePath, 'utf8');
  const links = [];
  
  // 匹配markdown链接语法 [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    links.push({
      text: match[1],
      url,
      filePath
    });
  }
  
  return links;
}

// 验证内部链接
function validateInternalLink(url, filePath) {
  // 如果是外部链接，跳过
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return { valid: true, url, filePath };
  }
  
  // 如果是锚点链接，暂时认为是有效的
  if (url.startsWith('#')) {
    return { valid: true, url, filePath };
  }
  
  // 解析相对路径
  let targetPath;
  if (url.startsWith('/')) {
    // 从项目根目录开始的绝对路径
    targetPath = path.join(process.cwd(), 'docs', url.replace(/^\//, ''));
  } else {
    // 相对于当前文件的路径
    const dir = path.dirname(filePath);
    targetPath = path.join(dir, url);
  }
  
  // 如果链接没有扩展名，尝试添加.md
  if (!path.extname(targetPath)) {
    if (targetPath.endsWith('/')) {
      targetPath = path.join(targetPath, 'index.md');
    } else {
      targetPath += '.md';
    }
  }
  
  const exists = fs.existsSync(targetPath);
  return {
    valid: exists,
    url,
    filePath,
    targetPath
  };
}

// 主函数
async function main() {
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const mdFiles = await findMarkdownFiles(docsDir);
    console.log(`找到 ${mdFiles.length} 个 Markdown 文件`);
    
    let allLinks = [];
    for (const file of mdFiles) {
      const links = await extractLinks(file);
      allLinks = allLinks.concat(links);
    }
    console.log(`找到 ${allLinks.length} 个链接`);
    
    const brokenLinks = [];
    for (const link of allLinks) {
      const result = validateInternalLink(link.url, link.filePath);
      if (!result.valid) {
        brokenLinks.push(result);
      }
    }
    
    if (brokenLinks.length > 0) {
      console.error('发现无效链接:');
      brokenLinks.forEach(link => {
        console.error(`文件 ${link.filePath} 中的链接 ${link.url} 无效`);
      });
      process.exit(1);
    } else {
      console.log('所有链接有效!');
    }
  } catch (error) {
    console.error('检查链接时出错:', error);
    process.exit(1);
  }
}

main(); 