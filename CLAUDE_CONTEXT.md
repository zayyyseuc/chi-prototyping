# CHI Program Session-First Prototype — Claude Handoff Context

> 更新时间：2026-11-08  
> 项目目录：`/Users/chen/Documents/chi/chi-program-prototype`  
> 原始需求文档：`/Users/chen/.codex/attachments/0723bb29-6243-40f1-9302-511f31061e76/Pasted text.txt`

> 最新设计意见与待执行任务见 `AGENT_TASKS.md`（2026-11-08 起，Card 已改为 Topics + 渐隐 For you，不再有三模式切换；第 6 节为旧描述）。

## 1. 项目目标

这是一个面向 CHI 学术会议 Program 的 session-first 信息架构交互原型，用于比较参会者在浏览会议日程时理解 Session 的三种方式。

核心浏览路径：

```text
Program → Date → Session Gallery → Session Details → Individual Contents
```

Session 是唯一的顶层浏览单元。单篇论文、报告或 presentation 作为 Contents 嵌套在所属 Session 内，不应增加独立的 Content 顶层页面。

主要研究问题：不同的 Session 内容呈现方式，是否能帮助参会者更快理解 Session 主题、判断个人相关性，并决定是否继续进入详情？

## 2. 当前完成状态

当前版本已经是可运行的 React 原型，不是静态占位页面。

已完成：

- React + TypeScript + Vite 项目结构。
- 三个会议日期，每天 5 个 Session，共 15 个 Session。
- 每个 Session 包含 3–5 个虚构但连贯的 Contents。
- Contents、Topics、For You 三种 Session Card 预览模式。
- 日期切换，且 Session 顺序保持不变。
- Interest Selector，可修改用户研究兴趣。
- 基于关键词的透明、确定性兴趣匹配，没有伪装成 AI 推荐系统。
- 无匹配兴趣时显示中性的 Topic Overview，不虚构相关性。
- Session 详情页，包括元数据、Session 描述、全部 Contents、作者和 Abstract。
- Abstract 展开/收起交互。
- 返回 Program 时保留日期、预览模式、兴趣和滚动位置。
- 浏览器 Back 操作支持。
- Desktop / Tablet / Mobile 响应式布局。
- 键盘可访问按钮、可见焦点样式、语义化 HTML、reduced-motion 处理。
- README 使用与测试说明。
- 生产构建验证通过。

本次交接时的构建结果：

```text
npm run build
✓ 28 modules transformed
✓ built successfully
```

开发服务器在交接时仍可通过以下地址访问：

```text
http://127.0.0.1:5173/
```

## 3. 运行方式

进入项目目录：

```bash
cd /Users/chen/Documents/chi/chi-program-prototype
npm install
npm run dev
```

然后打开 Vite 输出的本地地址，默认是：

```text
http://127.0.0.1:5173/
```

构建与生产预览：

```bash
npm run build
npm run preview
```

重要：不要通过 VS Code HTML Preview 或 `file://` 直接打开根目录的 `index.html`。该文件引用 `/src/main.tsx`，必须由 Vite 编译 TSX。此前用户看到空白页就是因为使用了静态 HTML 预览。

现在 `index.html` 内加入了一个 fallback 提示。如果 React 没有挂载，页面会提示运行 `npm run dev`，而不是保持空白。

## 4. 技术栈

- React
- TypeScript
- Vite
- 原生 CSS，无 Tailwind
- 本地 mock data
- 无后端、无登录、无外部业务 API

依赖与脚本见 `package.json`。当前存在 `package-lock.json`，虽然 `package.json` 使用了 `latest`，安装时会优先遵循 lockfile 中的已解析版本。

## 5. 项目结构

```text
chi-program-prototype/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── README.md
├── CLAUDE_CONTEXT.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── types.ts
    ├── components/
    │   ├── ProgramPage.tsx
    │   ├── DateNavigation.tsx
    │   ├── DisplayModeSwitcher.tsx
    │   ├── SessionGallery.tsx
    │   ├── SessionCard.tsx
    │   ├── SessionDetail.tsx
    │   ├── ContentItem.tsx
    │   ├── InterestSelector.tsx
    │   └── RelevanceExplanation.tsx
    ├── data/
    │   ├── sessions.ts
    │   └── interests.ts
    └── lib/
        └── relevance.ts
```

### 关键文件

- `src/data/sessions.ts`
  - 独立的虚构会议数据集。
  - 包含日期、Session 和 Content 数据。
  - 后续接入真实 CHI 数据时，应优先替换这一层，不要把数据写进组件。

- `src/data/interests.ts`
  - 可选择的兴趣列表和默认兴趣。

- `src/lib/relevance.ts`
  - For You 模式的确定性关键词匹配逻辑。
  - `interestSignals` 定义每个兴趣对应的信号词。
  - `getMatchingInterests()` 负责匹配。
  - `getRelevanceExplanation()` 负责生成可解释文案。

- `src/App.tsx`
  - 管理当前日期、Card 模式、兴趣、当前 Session、Interest Modal。
  - 保存 Gallery 滚动位置。
  - 使用 History API 支持 Session 详情与浏览器 Back。

- `src/styles.css`
  - 完整视觉系统和响应式规则。
  - 宽屏三列、Tablet 两列、Mobile 单列。
  - Mobile 日期栏横向滚动。

## 6. 三种实验模式的实现

### Contents

- 每张 Session Card 显示最多三个 Content 标题。
- 剩余数量以 `+ N more papers` 表示。
- 目标是测试具体论文标题能否帮助用户判断 Session。

### Topics

- 显示 Session-level description。
- 显示 3–4 个 Session keywords。
- 目标是测试抽象主题摘要是否减少认知负担。

### For You

- 将已选兴趣与 Session title、description、keywords，以及 Contents title/keywords 拼接后进行关键词匹配。
- 匹配后显示相关兴趣和确定性解释。
- 无匹配时显示中性 Topic Overview。
- 不按相关性重新排序，始终保持原始日程顺序。
- UI 中明确提示匹配基于关键词，而非推荐引擎。

## 7. Mock 数据

数据全部是虚构的 prototype data，代码中已有明确注释和页面 footer 标签。

当前数据范围：

- 3 天：Monday May 10、Tuesday May 11、Wednesday May 12, 2027。
- 每天 5 个 Session。
- Session 涵盖 Human-AI Interaction、Accessibility、Tangible Interaction、Social Computing、Health、HRI、Learning Technology、Climate、Privacy 等方向。
- 每个 Session 有 3–5 个 Contents。

数据类型在 `src/types.ts` 中定义：

```ts
type DisplayMode = 'contents' | 'topics' | 'for-you'

interface ConferenceContent {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
}

interface Session {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  room: string
  category: string
  description: string
  keywords: string[]
  contents: ConferenceContent[]
}
```

## 8. 视觉方向

当前设计是低保真但可用的 editorial / academic program 风格：

- 暖灰背景、黑白主体、克制的绿色强调色。
- 大字号标题和清晰的信息层级。
- Session Card 使用轻边框，避免重品牌和装饰性效果。
- Gallery 使用正常 CSS Grid 和少量垂直错位形成 masonry-inspired 感觉。
- 没有使用 CSS columns，DOM 顺序仍然保持时间顺序，避免屏幕阅读器和键盘浏览顺序混乱。

CSS 中通过 Google Fonts `@import` 尝试加载 DM Sans 和 Manrope；网络不可用时会回退到系统 sans-serif，不影响功能。

## 9. 已验证内容

- `npm install` 成功。
- `npm run build` 成功。
- Vite dev server 返回 HTTP 200。
- 已在桌面 Chrome 中实际打开并确认 React 页面正常渲染。
- 页面 Accessibility Tree 中可以识别日期按钮、三种模式按钮、兴趣按钮和全部 Session Card。
- 修复了直接预览 `index.html` 时仅显示空白的问题：现在会显示 Vite 启动说明。

## 10. 尚未完整验证或可继续改进的内容

以下不是当前已知的阻断错误，但适合作为下一轮工作：

1. 尚未完成系统性的 Mobile 真实设备/浏览器交互回归；目前主要依赖响应式 CSS 实现。
2. 尚未建立自动化测试。可以增加 Vitest + React Testing Library，重点覆盖：
   - 日期切换。
   - 三种模式切换。
   - 兴趣匹配与无匹配 fallback。
   - Session 打开、返回与滚动恢复。
   - Abstract 展开/收起。
3. Interest modal 支持 Escape 和初始焦点，但尚未实现完整 focus trap。
4. 没有专门进行浏览器 console error 的自动捕获测试。
5. `tsconfig`/早期构建曾留下 `vite.config.js`、`vite.config.d.ts` 和 `*.tsbuildinfo` 等生成文件；它们不影响运行，但可以评估是否加入 `.gitignore` 并清理。
6. 当前没有 `.openai/hosting.json`，也没有部署到公开 URL；目前是本地项目。
7. 可考虑把当前 URL query 中的 `session` 与初始 App state 双向同步，以便直接打开带 `?session=...` 的地址时立即进入对应详情。目前 History API 主要服务于从 Gallery 内部打开和返回。

## 11. 当前范围边界

请继续遵守原始需求，不要扩展以下功能：

- 地图或导航。
- 日程收藏或个人 schedule。
- 登录与账户。
- 社交或 networking。
- AI 生成摘要。
- 实时推荐。
- 独立 Content 浏览页。
- 完整会议网站导航。

重点始终是 session-first discovery 与三种 Card preview strategy 的对比。

## 12. 建议 Claude 接手后的第一步

```bash
cd /Users/chen/Documents/chi/chi-program-prototype
npm install
npm run build
npm run dev
```

然后依次检查：

1. 三个日期是否各显示 5 个 Session。
2. Contents / Topics / For You 是否立即更新全部 Card，且顺序不变。
3. 修改 Interests 后 For You 文案是否更新。
4. 无关键词匹配的 Session 是否显示中性 Topic Overview。
5. Session Detail 是否展示正确的 Contents。
6. Abstract 是否能展开。
7. 返回 Gallery 后日期、模式、兴趣和滚动位置是否保持。
8. 在约 1440px、Tablet 宽度和 390px 下检查无横向溢出。

如果要修改代码，应尽量保持 mock data、matching logic 和 UI components 三层分离。

## 13. 可直接发给 Claude 的任务开场白

```text
请先阅读项目根目录的 CLAUDE_CONTEXT.md 和原始需求文件：
/Users/chen/.codex/attachments/0723bb29-6243-40f1-9302-511f31061e76/Pasted text.txt

项目目录：
/Users/chen/Documents/chi/chi-program-prototype

这是一个已经可以运行和构建的 React/TypeScript/Vite 原型。请不要从头重建，也不要改变 session-first 的研究范围。先运行 npm run build 和 npm run dev，验证当前行为，再基于我的下一条具体要求继续修改。
```
