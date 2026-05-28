# 发布检查清单

本文档用于将“新人 PM 30 天训练系统”发布为公开可访问项目之前的检查。

## 1. 本地功能检查

打开 `index.html`，逐项确认：

- 首页正常显示，首屏文案能说明这是新人 PM 训练工具。
- “公开说明”区域能说明适合谁、不适合谁。
- 学习进度面板正常显示当前案例、阶段、动作、自测和总体进度。
- 默认练习案例可以切换。
- 今日训练任务可以勾选。
- 勾选训练任务后，阶段百分比会自动变化。
- 阶段通关检查项可以勾选。
- 勾选阶段门后，阶段百分比会自动变化。
- 阶段进度条可以手动修正百分比。
- 刷新页面后，localStorage 中的学习记录仍然保留。
- 资料库可以打开和关闭。
- 模板复制按钮可用。
- AI 提示词复制按钮可用。
- 自测题参考答案与解析能正常显示。
- 学习总结可以生成。
- 学习总结可以复制。

## 2. 移动端检查

用浏览器开发者工具或手机打开页面，确认：

- 导航按钮可点击。
- 项目卡片可点击。
- 今日训练任务复选框足够大。
- 阶段进度输入控件可操作。
- 资料库抽屉可阅读、可关闭。
- 弹窗宽度适合手机屏幕。
- 文字没有明显溢出或重叠。

## 3. 文件检查

发布前确认仓库根目录包含：

```text
index.html
styles.css
script.js
README.md
PROJECT_BRIEF.md
LICENSE
.gitignore
RELEASE_CHECKLIST.md
```

确认不要提交：

```text
.env
node_modules/
dist/
build/
*.log
```

## 4. README 检查

确认 README 包含：

- 项目名称和标语。
- 公开定位。
- 适合谁使用。
- 不适合谁使用。
- 项目背景。
- 功能截图占位。
- 技术栈。
- 本地运行方式。
- 数据与隐私说明。
- 学习路径概览。
- 主要功能。
- AI 生成声明。
- 如何贡献。
- MIT License。
- 作者信息。

## 5. GitHub 仓库建议

建议仓库名：

```text
new-pm-30-day-training
```

建议仓库描述：

```text
A 30-day scenario-based training tool for new software outsourcing PMs.
```

建议 topics：

```text
project-management
pm-training
software-outsourcing
ai-assisted-development
static-site
localstorage
```

## 6. GitHub Pages 发布步骤

1. 创建 GitHub public repository。
2. 上传本目录所有文件。
3. 进入仓库 Settings。
4. 打开 Pages。
5. Source 选择 `Deploy from a branch`。
6. Branch 选择 `main`。
7. Folder 选择 `/root`。
8. 保存并等待 GitHub Pages 生成链接。

## 7. 公开链接验收

拿到 GitHub Pages 链接后检查：

- 页面可以打开。
- CSS 正常加载。
- JS 正常执行。
- 学习进度面板正常渲染。
- 勾选动作后进度变化。
- 刷新后学习记录保留。
- 复制按钮在 HTTPS 页面中可用。
- 手机端可阅读、可点击。

## 8. 发布文案

可用于 GitHub / 社交平台：

```text
我开源了一个“新人 PM 30 天训练系统”。

它不是项目管理系统，而是一个给软件外包新人 PM 使用的场景化训练工具。

新人可以通过虚拟外包案例练习：
- 判断项目阶段
- 判断 Green / Yellow / Red 风险状态
- 阅读客户、售前、技术和老板的不同反应
- 完成每日 PM 训练动作
- 做阶段门检查和自测题
- 生成个人学习总结

项目是纯前端静态网站，不需要登录、不需要后端，学习记录只保存在浏览器 localStorage 中。

这个项目 90% 的代码由 AI 辅助生成，我负责产品定位、需求拆解、提示词迭代、内容设计和交互判断。
```

## 9. 发布后待办

- 补充真实截图到 README。
- 给每个内置案例增加更完整的案例资料。
- 支持自测题即时判分。
- 支持资料库搜索。
- 支持自定义案例填写干系人脚本。
- 增加导出 / 导入学习记录功能。

