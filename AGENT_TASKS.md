# CHI Program 原型：设计意见与执行任务

> 来源：Zia 的白板总意见（2026-11-08），对照对象为 CHI 2026 官方 Program 页 https://programs.sigchi.org/chi/2026/program/all
> 配合 `CLAUDE_CONTEXT.md` 阅读。已确定的前提：Card 形式 = Topics + 下方渐隐渐现的 For you；界面去除不必要的次级标签和说明，由布局自己解释。

## 1. 问题

用户能看到论文标题、摘要、作者、视频，却很难在**同一视图**中回答：

1. 这篇论文属于哪个 Session？
2. 同场论文之间有什么主题联系？
3. 这篇研究与我已经收藏的论文之间有什么关联？
4. 如果我关注某个话题，还有哪些不同 Session 涉及它？

现有设计支持查找某个条目，但缺乏对 **relationships between information objects** 的展示。

## 1.5 现有网站的信息层级审计

依据 Zia 对官方站点的截图与整理（Session/Content 的 List 与 Gallery 视图、⋮ 菜单、侧栏的 People / Maps / My Schedule / My Lists / My Notes）：

```text
program
├─ date
├─ session
│   ├─ time
│   ├─ schedule          → 属于 My 区
│   ├─ go to session page
│   ├─ share
│   ├─ location          → 属于 Map
│   └─ navigate presenter→ 属于 People
└─ content
    ├─ time
    ├─ add to reading list → 属于 My 区
    ├─ schedule            → 属于 My 区
    ├─ add to note/list    → 属于 My 区
    ├─ navigate author     → 属于 People
    └─ abstract
```

观察：
1. **二级信息异常多**：每张 Session / Content 卡片上挂着时钟图标、⋮ 菜单、分享、"N items / 0 added"、Awards、Media 状态、地点等，一级信息（这是什么、讲什么）被稀释。
2. **二级信息各自孤立**：地点其实属于 Map，演讲者/作者属于 People，加入阅读列表、日程、笔记属于 My 区。但在 Program 里它们只是一个文字、一个图标或一个藏在 ⋮ 里的动作，需要跳出去才能看到关联；而 Map / People / My 在侧栏里是互不相连的独立栏目。
3. **同一份数据被拆成两个视图**：顶部 Session / Content 切换把"论文属于哪个 Session"这个关系切断了（对应第 1 节问题 1、2）。

结论：问题不只是"信息太多"，而是"该连在一起的信息被当成孤立标签摆放"。设计思路是**让二级信息回到它所属的栏目，并在 Program 里以预览的形式连接回来**，而不是在卡片上再堆图标。这也正是 access preview 的内容来源：

| 二级信息 | 所属栏目 | 在 Program 里的呈现思路 |
|---|---|---|
| location | Map | 位置预览（楼层/区域的小示意），而不是一个文字 |
| presenter / author | People | 可展开的人物预览，显示其在其他 Session 的出现 |
| schedule / reading list / notes | My | 卡片上直接体现"已在我的列表/日程"和时间冲突，替代 ⋮ 菜单里的动作 |

## 2. 设计方向

两条线最终汇合为一个 **access preview**（在进入详情之前，用户在当前视图就能拿到的预览）：

- **A. 用户的个性化信息**：把用户的兴趣、已收藏内容，与 Session / Content 的关系呈现出来。
- **B. 帮助决策**：提前呈现用户需要确认的信息，包括环境条件、内容难度、时间冲突、未知信息。

设计原则：关系要靠布局和位置表达，不靠额外的文字说明。

## 3. 任务

按依赖顺序排列。每项完成后运行 `npm run build`。

### T1 关系数据层（先做，其余依赖它）
- `src/types.ts` 的 Content 加 `sessionId`（或在查询层反查）；Session 之间的关系不手写，由共享 keywords 推导。
- `src/lib/relevance.ts` 新增纯函数：
  - `getRelatedContents(content, session)`：同场论文中共享 keyword 的条目，返回共享的词。
  - `getRelatedSessions(topic, sessions)`：某个话题在哪些 Session 出现（跨日期）。
  - `getSavedLinks(content, saved)`：与已收藏论文共享的 keyword。
- 保持确定性关键词匹配，不做推荐引擎。

### T2 同一视图内回答"属于哪个 Session / 同场论文联系"（对应问题 1、2）
- 在 Session 详情里，每篇 Content 与同场其他 Content 的主题联系用布局表达，例如共享 keyword 作为 chips，点选后高亮同场所有共享该词的论文。
- 不新增独立 Content 页面（范围边界不变）。Content 的 Session 归属在展开 Abstract 时仍然可见。

### T3 话题跨 Session 视图（对应问题 4）
- 点击任意 keyword，在 Program 页高亮所有涉及该话题的 Session（保持时间顺序，不重排），跨三天可见。
- 需要一个全局的"当前话题"状态，加在 `App.tsx`。
- 视觉上用 Card 的强调边框或标记，不加说明文字。

### T4 与已收藏论文的关联（对应问题 3）
- 需要先有"已收藏"这个数据来源。**与 `CLAUDE_CONTEXT.md` 第 11 节的范围边界冲突，见第 4 节问题 1，等 Zia 确认后再做。**
- 最小做法：Interests 弹窗里预置一组"已收藏论文"，不做收藏交互；Card 与详情复用 `getSavedLinks` 显示关联。

### T5 决策信息（方向 B）
Card 上提前呈现四类需要用户确认的信息：
- **时间冲突**：同一时间段内用户已选内容与该 Session 重叠。
- **内容难度**：Session / Content 的难度等级。
- **环境条件**：待定义，见第 4 节问题 2。
- **未知信息**：数据缺失时明确标出（例如未定房间、未公布作者），而不是留空。
- 数据层：`sessions.ts` 给 Session 增加 `level`、环境相关字段，并故意让少数条目缺失，用来测试"未知信息"的呈现。
- 呈现原则：只在有风险或需要确认时出现；没有问题的 Card 保持干净。

### T5.5 二级信息归位（依据第 1.5 节）
- 先做一份清单：原型里现有每一个二级信息（时间、房间、作者、关键词、Abstract），标明它属于 Map / People / My 的哪一个，以及是否可以删掉。
- 房间、作者不再只是文字：定义它们的预览形态（见 1.5 表格），数据放在 `src/data/` 的独立文件（rooms、people），Session / Content 只引用 id。
- 删除没有关联价值的二级信息，不新增图标按钮和 ⋮ 菜单。

### T6 汇合为 access preview
- 在 Card 上把 A 和 B 合并成一个预览区域，现有 For you 渐隐区域是起点。
- 预览内容按优先级：时间冲突 > 与兴趣/收藏的关联 > 难度/环境 > 未知信息。
- 先出方案草图或一版实现，让 Zia 看过再细化，不要一次做完。

## 3.5 已确认的决定（2026-11-08）

- **范围**：不做收藏/日程交互，用预置的 "My" 数据（`src/data/mine.ts`）驱动预览。
- **环境条件**：指场馆（房间）层面的体验信息，例如是否拥挤、是否适合神经多样性人群（感官友好）、无障碍设施、室温等。它属于 Map 栏目的房间数据，放在独立的 `rooms` 数据里，Session 只引用房间 id；在 access preview 里以预览形式出现，没有问题时不显示。
- **难度**：不作为标签展示，也不加隐藏的用户等级设定。For you 保持现在的形式：每个 Session 下方渐隐渐现地轮播推荐词，难度/适合度只是其中一种推荐词（例如 "a gentle entry point to Accessibility"），和匹配兴趣的论文标题轮流出现。
- 因此 T5 中"内容难度"一项改为：不单独呈现，并入 For you；"环境条件"改为房间数据（见上）。

## 4. 需要 Zia 确认的问题

1. **收藏与个人日程**：问题 3 需要"已收藏论文"，时间冲突需要"用户已选的时间"。这两项正是 `CLAUDE_CONTEXT.md` 里划出范围的"日程收藏 / 个人 schedule"。你的审计又把 "My" 区、Map、People 列为二级信息的归属地，所以这几个栏目的数据在原型里至少要有。要放宽范围，还是用预置数据模拟（我倾向后者：不做交互，只预置一份"我的"数据来驱动预览）？
2. ~~环境条件~~ 已确认（见 3.5）。~~原问题：~~ **"环境条件"具体指什么？** 我的猜测是房间/线上线下/语言/是否有录像，但白板上没写，不想自己定义。
3. **"access preview"**是指 Card 上的预览区域，还是 hover/点击后出现的预览层？我的理解是：它把 Map / People / My 的信息以预览形式带回 Program（第 1.5 节表格），请确认是否符合你的意思。
4. ~~内容难度~~ 已决定：并入 For you 的推荐词（见 3.5）。仍待定：这类推荐词的数据来源，已决定：现在手写少量 `forYouNotes` 放在 Session 数据里。注意：真实产品里这类推荐词需要推断（根据用户背景和内容算出来），原型用手写代替；渲染层只读数据，之后换成推断函数不需要改界面。

## 5. 不要做

- 不改变 session-first 的主路径。
- 不引入 AI 生成摘要、实时推荐、地图、登录、社交。
- 不新增独立 Content 页面。
- 不为解释而加文字标签。如果一个关系需要文字说明才看得懂，说明布局要改。
