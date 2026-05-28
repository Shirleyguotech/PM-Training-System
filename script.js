// 阶段数据：页面中点击“售前交接 / 项目启动”等按钮时，会显示这里对应的内容。
const stages = {
  handoff: {
    title: "售前交接",
    goal: "把销售承诺转成可交付信息，确认项目是否真的可以启动。",
    tags: ["PM 必须参与", "启动前完成", "重点看范围和风险"],
    actions: ["阅读售前材料、合同和报价", "确认客户目标、范围、时间和关键承诺", "识别不清楚或高风险内容", "与售前和技术负责人内部交接"],
    outputs: ["售前交接确认表", "初步风险清单", "待确认问题清单"],
    ai: ["总结售前材料", "提取明确需求和隐含需求", "识别范围不清或时间不合理的地方", "生成客户澄清问题"],
    escalate: ["销售承诺与交付能力不匹配", "客户期望与合同范围不一致", "缺少关键资料", "排期明显不可实现"],
  },
  kickoff: {
    title: "项目启动",
    goal: "让客户、PM 和团队对项目目标、规则、里程碑和验收方式达成一致。",
    tags: ["Kickoff", "建立规则", "确认验收"],
    actions: ["组织内部启动会", "组织客户 Kickoff", "确认项目目标、范围和里程碑", "建立任务看板和项目文档空间"],
    outputs: ["项目章程", "里程碑计划", "沟通机制说明", "初版验收标准"],
    ai: ["生成项目章程初稿", "生成 Kickoff 议程", "生成客户确认问题", "生成里程碑计划草稿"],
    escalate: ["客户提出重大新增需求", "客户无法确认验收标准", "项目关键资源未到位"],
  },
  planning: {
    title: "规划拆解",
    goal: "把项目目标拆成团队可以执行、可以跟踪、可以验收的任务。",
    tags: ["任务拆解", "Sprint 计划", "风险识别"],
    actions: ["与产品、设计、技术负责人拆解功能", "建立阶段计划或 Sprint 计划", "确认每个阶段交付物", "确认依赖关系和关键风险"],
    outputs: ["项目计划", "任务看板", "需求与范围确认表", "风险与问题日志"],
    ai: ["生成 WBS 草稿", "拆解用户故事和开发任务", "生成测试点和验收点", "识别任务依赖和风险"],
    escalate: ["工作量超出原估算", "关键依赖无法按时获得", "技术方案存在重大不确定性"],
  },
  delivery: {
    title: "实施推进",
    goal: "保持项目按计划推进，尽早暴露问题，并控制范围变更。",
    tags: ["日常推进", "周报", "风险控制"],
    actions: ["每日或隔日检查任务看板", "每周更新项目状态", "组织客户同步会", "跟踪阻塞、风险和变更"],
    outputs: ["每周项目周报", "会议纪要", "行动项记录", "风险与问题日志", "变更记录"],
    ai: ["根据任务状态生成周报", "根据会议录音生成纪要", "总结当前风险", "起草客户沟通消息"],
    escalate: ["里程碑可能延期", "客户连续不反馈", "需求频繁变化", "资源不足或质量问题影响交付"],
  },
  acceptance: {
    title: "验收交付",
    goal: "按照明确标准完成交付，不依赖客户主观感觉。",
    tags: ["UAT", "缺陷修复", "验收确认"],
    actions: ["组织内部验收", "组织客户 UAT", "跟踪缺陷修复", "确认交付物清单", "获得客户验收确认"],
    outputs: ["验收清单", "缺陷清单", "交付包清单", "客户验收确认记录"],
    ai: ["生成验收清单", "生成缺陷优先级建议", "生成交付说明", "起草客户验收邮件"],
    escalate: ["客户以新增需求阻止验收", "关键缺陷无法按期修复", "验收标准与客户期待不一致"],
  },
  closing: {
    title: "关闭复盘",
    goal: "正式关闭项目，并把经验沉淀成公司资产。",
    tags: ["项目关闭", "复盘", "资产沉淀"],
    actions: ["确认交付物已移交", "确认客户验收或阶段关闭", "整理项目文件", "组织内部复盘", "沉淀模板、组件、提示词和经验"],
    outputs: ["项目关闭确认", "项目复盘总结", "可复用资产清单"],
    ai: ["生成项目复盘初稿", "总结延期、返工和变更原因", "提取可复用方案", "生成改进建议"],
    escalate: ["客户拒绝关闭但无明确缺陷依据", "存在未结算款项风险", "项目出现重大客户投诉"],
  },
};

const stageResources = {
  handoff: {
    checklist: ["售前材料、报价和合同已阅读", "客户目标、范围和关键承诺已确认", "明显风险和缺口已记录", "待客户确认问题已整理", "PM 判断项目可以进入启动阶段"],
    templates: [["售前交接确认表", "handoff-template"], ["风险与问题日志", "risk-template"]],
    prompts: [["需求澄清问题生成", "clarify-prompt"], ["会议纪要与行动项", "meeting-prompt"], ["项目风险识别", "risk-prompt"]],
    roles: [
      ["售前负责人", "合同范围、报价承诺、客户背景、已承诺时间、商务注意事项", "交接缺口、初步风险、待客户确认问题"],
      ["技术负责人", "技术可行性判断、关键技术风险、资源需求、估时意见", "客户目标、合同范围、关键交付物、疑问清单"],
      ["客户负责人", "业务目标、决策人、时间优先级、已有资料", "澄清问题清单、启动会安排、需要客户准备的资料"],
    ],
    gate: ["售前承诺与交付范围一致", "关键资料已到位", "高风险事项已有处理方案", "售前、PM、技术负责人对启动没有异议"],
    endStandard: ["售前资料、合同范围、报价假设已完成内部交接", "PM 已识别范围、时间、资源和客户期望中的主要风险", "关键待确认问题已有负责人和下一步", "PM 明确判断项目是否允许进入启动阶段"],
    deliverables: [
      ["售前交接确认表", "PM", "售前负责人 / 技术负责人", "合同范围、报价承诺、客户目标、承诺时间和风险已记录", "必须"],
      ["初步风险清单", "PM", "技术负责人 / 管理层", "高风险事项有影响说明、负责人和建议处理方式", "必须"],
      ["待确认问题清单", "PM", "客户负责人 / 售前负责人", "客户必须补充或确认的问题已列清并准备对外沟通", "必须"],
    ],
  },
  kickoff: {
    checklist: ["内部启动会已完成", "客户 Kickoff 已完成", "项目目标和不包含范围已说明", "里程碑和沟通机制已确认", "初版验收标准已同步"],
    templates: [["项目章程", "charter-template"], ["项目计划 / 里程碑表", "milestone-template"]],
    prompts: [["项目计划 / 里程碑生成", "plan-prompt"], ["客户沟通消息生成", "client-message-prompt"], ["会议纪要与行动项", "meeting-prompt"]],
    roles: [
      ["客户负责人", "项目目标确认、沟通节奏、验收偏好、关键决策人", "项目章程、Kickoff 议程、里程碑计划、客户确认事项"],
      ["技术负责人", "技术方案判断、资源可用性、关键依赖、技术风险", "项目目标、范围边界、里程碑、第一阶段交付要求"],
      ["设计 / 产品负责人", "需求理解、用户流程疑问、设计输入资料", "项目背景、目标用户、范围边界、设计确认节点"],
      ["内部团队", "资源安排、请假或冲突、第一阶段执行依赖", "项目计划、沟通规则、任务看板入口、角色责任"],
    ],
    gate: ["项目章程已确认", "客户知道每个阶段需要确认什么", "团队知道第一阶段要交付什么", "任务看板和项目文档空间已建立"],
    endStandard: ["客户和内部团队已确认项目目标、范围和不包含范围", "主要里程碑、沟通机制和验收方式已同步", "第一阶段交付物、负责人和客户确认点清楚", "项目文档空间和任务看板已建立"],
    deliverables: [
      ["项目章程", "PM", "客户负责人 / 技术负责人", "目标、范围、不包含范围、角色、里程碑和验收方式已确认", "必须"],
      ["里程碑计划", "PM", "客户负责人 / 技术负责人", "每阶段时间、交付物、客户确认点和依赖事项清楚", "必须"],
      ["沟通机制说明", "PM", "客户负责人 / 内部团队", "会议节奏、沟通群、反馈时限和决策人明确", "必须"],
      ["初版验收标准", "PM / QA", "客户负责人", "验收范围、验收方式和关键标准已有初步确认", "必须"],
    ],
  },
  planning: {
    checklist: ["功能模块已拆解", "任务已进入看板", "需求范围和不包含范围已确认", "依赖事项已标记", "风险与问题日志已建立"],
    templates: [["项目计划 / 里程碑表", "milestone-template"], ["需求与范围确认表", "scope-template"], ["风险与问题日志", "risk-template"]],
    prompts: [["需求拆解为任务", "task-prompt"], ["需求澄清问题生成", "clarify-prompt"], ["项目风险识别", "risk-prompt"]],
    roles: [
      ["产品 / BA", "需求细节、用户故事、业务规则、待确认问题", "范围确认表、优先级建议、客户反馈记录"],
      ["设计负责人", "页面清单、交互风险、设计排期、客户确认依赖", "功能范围、用户流程、里程碑、设计验收标准"],
      ["技术负责人", "任务拆解、技术依赖、开发估时、技术风险", "需求范围、优先级、客户确认点、上线时间要求"],
      ["QA / 测试", "测试范围、测试资源、验收关注点", "需求说明、验收标准、里程碑计划、风险清单"],
    ],
    gate: ["任务拆解足够让团队执行", "客户确认范围没有重大遗漏", "关键依赖有负责人和截止日期", "团队认可当前计划可执行"],
    endStandard: ["功能和任务已拆解到团队可执行粒度", "需求范围、不包含范围和优先级已确认", "关键依赖、风险和客户确认点已进入看板或日志", "团队认可当前计划可以进入实施"],
    deliverables: [
      ["项目计划 / Sprint 计划", "PM", "技术负责人 / 内部团队", "任务、负责人、时间、依赖和阶段目标清楚", "必须"],
      ["任务看板", "PM / 技术负责人", "内部团队", "核心任务已入板，状态和负责人明确", "必须"],
      ["需求与范围确认表", "PM / 产品", "客户负责人", "本期范围、不包含范围、优先级和验收标准已确认", "必须"],
      ["风险与问题日志", "PM", "技术负责人 / 管理层", "关键风险有严重程度、负责人、应对措施和截止日期", "必须"],
    ],
  },
  delivery: {
    checklist: ["任务看板持续更新", "阻塞事项有人跟进", "周报已发送或准备发送", "新增需求已判断是否变更", "Yellow / Red 风险已有恢复计划"],
    templates: [["每周项目周报", "weekly-template"], ["风险与问题日志", "risk-template"], ["变更请求记录", "change-template"]],
    prompts: [["每周项目周报生成", "weekly-prompt"], ["项目风险识别", "risk-prompt"], ["客户沟通消息生成", "client-message-prompt"], ["会议纪要与行动项", "meeting-prompt"]],
    roles: [
      ["开发负责人", "任务进度、阻塞事项、技术风险、延期预警", "优先级调整、客户确认结果、变更记录、里程碑压力点"],
      ["设计 / 产品负责人", "设计交付状态、需求变动影响、客户反馈处理结果", "开发反馈、客户确认事项、范围变化提醒"],
      ["QA / 测试", "缺陷趋势、测试阻塞、质量风险", "最新功能范围、版本计划、验收标准、缺陷优先级"],
      ["客户负责人", "反馈、确认、资料、变更决策", "周报、会议纪要、风险说明、需要客户确认的行动项"],
    ],
    gate: ["本阶段交付物已完成", "关键缺陷和风险已处理或有计划", "客户需要确认的事项已明确", "下一阶段进入条件已满足"],
    endStandard: ["本阶段承诺交付物已完成或达到可验收状态", "阻塞、风险、变更和缺陷已有处理结论", "客户需要确认的事项已记录并完成沟通", "下一阶段进入条件已满足或剩余事项已明确"],
    deliverables: [
      ["阶段交付物", "开发 / 设计 / QA", "PM / 客户负责人", "符合本阶段范围和验收点，可以演示、测试或移交", "必须"],
      ["每周项目周报", "PM", "客户负责人 / 管理层", "完成、计划、风险、客户待确认和状态判断清楚", "必须"],
      ["会议纪要与行动项", "PM", "参会关键人", "结论、负责人、截止日期和未决问题记录完整", "视会议情况"],
      ["变更记录", "PM", "客户负责人 / 管理层", "新增需求有范围判断、影响评估和确认结果", "必须"],
    ],
  },
  acceptance: {
    checklist: ["内部验收已完成", "客户 UAT 已安排或完成", "缺陷清单已分级", "交付包和移交资料已准备", "客户验收确认已获得或正在推进"],
    templates: [["验收与关闭清单", "acceptance-template"], ["风险与问题日志", "risk-template"], ["变更请求记录", "change-template"]],
    prompts: [["客户沟通消息生成", "client-message-prompt"], ["项目风险识别", "risk-prompt"], ["会议纪要与行动项", "meeting-prompt"]],
    roles: [
      ["QA / 测试", "测试报告、缺陷清单、质量风险、回归结果", "验收范围、缺陷优先级、客户反馈、交付时间要求"],
      ["开发负责人", "缺陷修复计划、技术遗留项、部署风险", "缺陷清单、验收优先级、客户确认结果"],
      ["客户负责人", "UAT 反馈、验收意见、签收确认、剩余问题判断", "验收清单、交付包说明、缺陷处理计划、关闭确认请求"],
      ["运维 / 部署负责人", "部署计划、环境状态、上线风险、回滚方案", "交付版本、上线时间、验收要求、客户窗口期"],
    ],
    gate: ["验收标准已逐项确认", "关键缺陷已关闭", "新增需求没有混入验收范围", "客户已确认交付结果或明确剩余事项"],
    endStandard: ["内部验收和客户 UAT 已完成或剩余事项已明确", "关键缺陷已关闭或有双方认可的处理计划", "交付包、交付说明和移交资料已准备完成", "客户已确认验收结果或阶段交付结果"],
    deliverables: [
      ["验收清单", "PM / QA", "客户负责人", "验收项、结果、未完成事项和确认意见清楚", "必须"],
      ["缺陷清单", "QA / PM", "客户负责人 / 开发负责人", "缺陷优先级、处理结果和遗留项有记录", "必须"],
      ["交付包清单", "PM / 技术负责人", "客户负责人 / 运维负责人", "代码、账号、部署说明、文档或培训材料已列清", "必须"],
      ["客户验收确认记录", "PM", "客户负责人", "客户以邮件、表单、签字或聊天记录确认验收", "必须"],
    ],
  },
  closing: {
    checklist: ["客户验收或阶段关闭已记录", "项目文件已整理归档", "未结事项已列清楚", "内部复盘已完成", "可复用资产已沉淀"],
    templates: [["验收与关闭清单", "acceptance-template"], ["风险与问题日志", "risk-template"]],
    prompts: [["项目复盘总结", "retro-prompt"], ["客户沟通消息生成", "client-message-prompt"]],
    roles: [
      ["客户负责人", "最终验收确认、后续支持需求、满意度反馈", "关闭确认、交付资料索引、后续支持边界"],
      ["财务 / 商务", "收款状态、合同关闭要求、未结事项", "验收记录、变更记录、客户确认文件"],
      ["内部团队", "复盘反馈、可复用资产、遗留风险", "复盘议程、项目结果、问题清单、改进建议"],
      ["管理层", "客户关系判断、利润和风险反馈、后续机会", "关闭报告、复盘结论、重大经验和改进计划"],
    ],
    gate: ["交付物和资料已移交", "结算或后续支持事项清楚", "复盘结论已沉淀", "类似项目的可复用模板、组件或提示词已记录"],
    endStandard: ["客户验收、阶段关闭或交付移交已留痕", "未结事项、后续支持边界和结算风险已说明", "项目文件已归档，内部复盘已完成", "可复用资产、模板或经验已沉淀"],
    deliverables: [
      ["项目关闭确认", "PM", "客户负责人 / 管理层", "交付物、验收、未结事项和后续支持边界已确认", "必须"],
      ["项目复盘总结", "PM", "管理层 / 内部团队", "结果、问题、原因、经验和改进建议清楚", "必须"],
      ["可复用资产清单", "PM / 技术负责人", "管理层 / 内部团队", "可复用组件、模板、提示词和方案已记录", "建议"],
    ],
  },
};

// 复制内容：按钮上用 data-copy-target 指定要复制哪一段。
const copyContent = {
  "daily-review-template": `日期：
PM：

项目状态检查：
1. 项目名称：
   当前状态：Green / Yellow / Red
   状态原因：
   今天最重要的推进事项：
   影响里程碑的风险：
   需要客户确认：
   需要内部支持：
   下一步动作：

2. 项目名称：
   当前状态：Green / Yellow / Red
   状态原因：
   今天最重要的推进事项：
   影响里程碑的风险：
   需要客户确认：
   需要内部支持：
   下一步动作：

今日练习动作：
- 

今日练习备注：
- 

需要升级：
- `,
  "manager-daily-summary-template": `日期：
PM：

今日练习概览：
- Green 项目：
- Yellow 项目：
- Red 项目：

需要总经理关注：
1. 项目：
   问题：
   影响：
   PM 已采取动作：
   需要支持：

客户侧卡点：
- 

内部资源或质量风险：
- 

明天优先事项：
- `,
  "scenario-client-no-reply": `您好，当前项目有一个事项需要您确认：

待确认事项：
【填写事项】

这个事项会影响：
【填写影响，例如排期 / 开发任务 / 验收 / 上线准备】

为了不影响后续进度，麻烦您在【日期/时间】前确认。如果暂时无法确认，也请告知预计反馈时间，我们会据此调整计划。`,
  "scenario-scope-change": `您好，您刚提出的需求我们已经记录。

为了避免影响当前项目范围和排期，我们会先做一次变更评估，主要确认：
1. 是否属于原合同 / 本期范围
2. 对排期的影响
3. 对成本和测试范围的影响
4. 建议放入本期还是后续阶段

评估完成后我们会给您确认，确认前不会直接进入开发。`,
  "scenario-delay": `您好，当前项目存在一个排期风险，需要提前同步：

风险事项：
【填写延期原因】

可能影响：
【填写影响范围和里程碑】

我们正在采取的动作：
【填写恢复计划】

需要您确认 / 配合：
【填写客户需要做的决定或提供的资料】`,
  "scenario-acceptance-blocked": `您好，关于当前验收事项，我们建议先按已确认的本期范围推进验收。

已完成交付：
【填写交付物】

当前新增需求：
【填写新增需求】

新增需求我们可以记录为变更或后续阶段内容，但建议不要和本期验收混在一起，否则会影响项目关闭和后续安排。请您确认本期已完成内容是否可以先进入验收确认。`,
  "notion-project-template": `# 项目首页

## 1. 项目基本信息
- 项目名称：
- 客户名称：
- PM：
- 售前负责人：
- 技术负责人：
- 项目周期：
- 当前状态：Green / Yellow / Red

## 2. 项目目标
- 客户核心目标：
- 本期必须交付：
- 本期不包含范围：

## 3. 里程碑
| 阶段 | 时间 | 交付物 | 客户确认点 | 状态 |
| --- | --- | --- | --- | --- |
| 售前交接 |  |  |  |  |
| 项目启动 |  |  |  |  |
| 规划拆解 |  |  |  |  |
| 实施推进 |  |  |  |  |
| 验收交付 |  |  |  |  |
| 关闭复盘 |  |  |  |  |

## 4. 任务看板
建议状态：待处理 / 进行中 / 等待客户 / 等待内部 / 测试中 / 已完成

## 5. 客户确认事项
| 事项 | 负责人 | 截止日期 | 当前状态 | 影响 |
| --- | --- | --- | --- | --- |

## 6. 风险与问题
| 类型 | 描述 | 严重程度 | 负责人 | 应对措施 | 是否升级 |
| --- | --- | --- | --- | --- | --- |

## 7. 变更记录
| 变更 | 提出方 | 是否原范围 | 排期影响 | 成本影响 | 客户确认 |
| --- | --- | --- | --- | --- | --- |

## 8. 周报记录
- 本周完成：
- 下周计划：
- 当前风险：
- 需要客户确认：
- PM 判断：

## 9. 验收与关闭
- 交付物清单：
- 验收标准：
- 未关闭缺陷：
- 移交资料：
- 关闭确认：

## 10. 复盘沉淀
- 做得好的地方：
- 出现的问题：
- 可复用模板 / 组件 / 提示词：
- 下次改进：`,
  "handoff-template": `项目名称：
客户名称：
售前负责人：
PM：
合同范围：
客户核心目标：
关键交付物：
承诺时间：
已知风险：
待确认问题：
是否允许启动：是 / 否`,
  "charter-template": `项目名称：
项目背景：
客户核心目标：
项目范围：
不包含范围：
关键角色：
主要里程碑：
沟通机制：
验收方式：
主要风险：
启动确认：`,
  "milestone-template": `阶段名称：
时间范围：
核心目标：
关键任务：
负责人：
交付物：
客户确认点：
依赖事项：
风险提示：
完成状态：`,
  "scope-template": `功能模块：
需求描述：
用户目标：
验收标准：
优先级：Must / Should / Could
是否属于本期范围：是 / 否
不包含内容：
待确认问题：
客户确认人：
确认日期：`,
  "weekly-template": `项目状态：Green / Yellow / Red
本周完成：
下周计划：
当前风险：
需要客户确认：
需要管理层支持：
下一里程碑：
PM 判断：`,
  "risk-template": `编号：
类型：风险 / 问题
描述：
影响范围：
严重程度：高 / 中 / 低
负责人：
应对措施：
截止日期：
当前状态：
是否需要升级：`,
  "change-template": `变更名称：
提出方：
提出日期：
变更描述：
是否属于原范围：
对排期影响：
对成本影响：
对质量或风险影响：
建议处理方式：
客户确认：`,
  "acceptance-template": `项目 / 阶段名称：
交付物清单：
验收标准：
已完成测试：
未关闭缺陷：
客户反馈：
移交资料：
是否完成验收：是 / 否
后续支持事项：
关闭确认人：
确认日期：`,
  "meeting-prompt": `你是一个软件外包公司的高级项目经理。请根据下面的会议记录，整理出：
1. 会议结论
2. 客户确认事项
3. 待确认问题
4. 行动项，包含负责人和截止日期
5. 项目风险
6. PM 下一步建议

会议记录：
【粘贴内容】`,
  "task-prompt": `你是一个熟悉 AI 辅助开发的软件项目经理。请把下面的需求拆解成适合开发团队执行的任务列表。

请输出：
1. 功能模块
2. 用户故事
3. 前端任务
4. 后端任务
5. 测试任务
6. 依赖关系
7. 风险点
8. 建议里程碑

需求内容：
【粘贴内容】`,
  "clarify-prompt": `你是一个软件外包公司的资深项目经理。请根据下面的客户需求材料，帮我找出不清楚、不完整、容易导致返工的问题。

请输出：
1. 需求中已经明确的内容
2. 需求中不明确的内容
3. 必须向客户确认的问题
4. 可能影响报价或排期的问题
5. 可能导致范围争议的问题
6. 建议 PM 在下一次会议中优先询问的 10 个问题

客户需求材料：
【粘贴内容】`,
  "plan-prompt": `你是一个擅长短周期软件交付的项目经理。请根据下面的项目背景和需求，生成一个适合约 1 个月开发周期的项目计划。

请输出：
1. 项目阶段划分
2. 每个阶段的目标
3. 每个阶段的关键任务
4. 每个阶段的交付物
5. 客户确认点
6. 团队依赖事项
7. 主要风险
8. 建议的周计划

项目背景和需求：
【粘贴内容】`,
  "weekly-prompt": `你是一个软件外包公司的项目经理。请根据下面的任务进展、会议记录和风险信息，生成一份可以发给客户的项目周报。

要求：
1. 语言专业、简洁、让客户容易理解
2. 不夸大进展，不隐藏风险
3. 明确需要客户确认或配合的事项
4. 给出 Green / Yellow / Red 项目状态判断

请输出：
1. 项目状态
2. 本周完成
3. 下周计划
4. 当前风险
5. 需要客户确认
6. PM 建议

项目材料：
【粘贴内容】`,
  "risk-prompt": `你是一个非常严格的软件项目交付审查专家。请根据下面的项目资料，识别可能导致延期、返工、成本超支或客户不满的风险。

请输出：
1. 风险清单
2. 每个风险的严重程度：高 / 中 / 低
3. 风险原因
4. 可能造成的影响
5. PM 应采取的预防措施
6. 哪些风险需要升级给管理层
7. 哪些问题需要客户尽快确认

项目资料：
【粘贴内容】`,
  "client-message-prompt": `你是一个专业、清楚、不过度承诺的软件外包项目经理。请根据下面的情况，帮我起草一段发给客户的沟通消息。

要求：
1. 语气专业、友好、直接
2. 清楚说明当前情况
3. 明确需要客户做什么决定或提供什么资料
4. 不承诺未经团队确认的时间或范围
5. 如果有风险，要表达清楚但不要制造恐慌

当前情况：
【粘贴内容】

希望客户采取的行动：
【粘贴内容】`,
  "retro-prompt": `你是一个软件外包公司的交付负责人。请根据下面的项目资料，生成一份项目复盘总结，用于公司内部改进。

请输出：
1. 项目基本情况
2. 做得好的地方
3. 出现的问题
4. 延期、返工或变更的原因
5. 客户沟通经验
6. AI 使用效果
7. 可以沉淀的模板、组件或提示词
8. 下次类似项目的改进建议

项目资料：
【粘贴内容】`,
};

const stageRules = {
  handoff: {
    title: "售前交接",
    question: "项目是否还在确认能不能启动？",
    standard: "合同、报价、售前承诺、客户目标和关键风险还没交接清楚，项目就仍然属于售前交接。",
    gray: "老板要求先启动，但资料不全。",
    action: "先列待确认问题和风险，让售前、技术、管理层确认是否带风险启动。",
  },
  kickoff: {
    title: "项目启动",
    question: "项目是否已接手，但规则还没对齐？",
    standard: "PM 已接手项目，但目标、范围、沟通机制、里程碑或验收方式还没确认，属于项目启动。",
    gray: "客户急着开始开发。",
    action: "可以准备任务，但必须先确认范围、不包含范围和第一阶段交付物。",
  },
  planning: {
    title: "规划拆解",
    question: "目标是否清楚，但团队还不能稳定执行？",
    standard: "项目目标和范围基本清楚，但任务、依赖、风险、优先级和验收点还没拆清楚，属于规划拆解。",
    gray: "开发已经开始，但范围还在变。",
    action: "把当前开发限定为已确认范围，未确认内容进入待确认或变更记录。",
  },
  delivery: {
    title: "实施推进",
    question: "团队是否正在交付阶段成果？",
    standard: "任务已进入执行，PM 主要在跟进进度、阻塞、客户反馈、风险和变更，属于实施推进。",
    gray: "一边开发一边补需求。",
    action: "每天确认新增内容是否属于原范围，影响排期或成本就走变更。",
  },
  acceptance: {
    title: "验收交付",
    question: "核心成果是否已经可测试或可交付？",
    standard: "核心功能或阶段成果已完成，重点转为测试、缺陷、UAT、交付包和客户确认，属于验收交付。",
    gray: "客户用新增需求阻止验收。",
    action: "把新增需求和本期验收分开，先按已确认标准推进验收。",
  },
  closing: {
    title: "关闭复盘",
    question: "交付是否已确认，重点是否转为收尾？",
    standard: "客户已验收或阶段关闭条件已满足，重点是归档、未结事项、支持边界、结算和复盘。",
    gray: "客户不签字但也提不出缺陷。",
    action: "整理交付记录和验收依据，发关闭确认并同步管理层。",
  },
};

const statusFocus = {
  green: {
    label: "Green",
    summary: "项目正常推进，今天重点是确认关键事项没有掉线。",
    actions: ["更新任务和客户确认事项", "确认下一里程碑没有新风险", "保留必要沟通记录"],
    tone: "正常推进，不需要制造紧张感。",
  },
  yellow: {
    label: "Yellow",
    summary: "项目存在风险，今天必须明确原因、负责人和恢复动作。",
    actions: ["写清 Yellow 原因和影响", "给每个风险指定负责人和截止时间", "向客户或内部负责人推动确认", "准备恢复计划"],
    tone: "主动提醒风险，但不要过度承诺恢复时间。",
  },
  red: {
    label: "Red",
    summary: "项目已影响交付或关系，今天必须升级并形成决策。",
    actions: ["写清 Red 原因、影响范围和当前证据", "准备给管理层的升级说明", "暂停未经确认的新增承诺", "推动客户或内部做关键决策"],
    tone: "直接、清楚、留痕，先控制风险再推进细节。",
  },
};

const dailyActionTemplates = {
  handoff: {
    green: [
      ["阅读合同、报价和售前沟通记录", "15min"],
      ["与技术负责人确认可行性和初步排期", "20min"],
      ["列出待客户确认的问题清单", "15min"],
    ],
    yellow: [
      ["阅读合同、报价和售前沟通记录", "15min"],
      ["与技术负责人确认可行性和初步排期", "20min"],
      ["列出待客户确认的问题清单", "15min"],
      ["重新评估范围、排期或承诺风险并记录", "15min"],
      ["向售前或管理层同步关键风险", "10min"],
    ],
    red: [
      ["暂停直接启动项目", "5min"],
      ["整理合同范围、售前承诺和交付能力冲突", "20min"],
      ["准备给管理层的升级说明", "15min"],
      ["推动售前、技术和管理层做是否启动的决策", "20min"],
    ],
  },
  kickoff: {
    green: [
      ["确认客户 Kickoff 时间和参会人", "10min"],
      ["补齐项目目标、范围和不包含范围", "20min"],
      ["确认第一阶段交付物和客户确认点", "15min"],
    ],
    yellow: [
      ["确认客户 Kickoff 时间和参会人", "10min"],
      ["补齐项目目标、范围和不包含范围", "20min"],
      ["确认第一阶段交付物和客户确认点", "15min"],
      ["记录未确认的验收标准或资源风险", "15min"],
      ["提醒客户或内部负责人今天必须确认的事项", "10min"],
    ],
    red: [
      ["暂停新增承诺和未经确认的启动动作", "5min"],
      ["整理无法启动的关键原因", "15min"],
      ["准备升级说明并明确需要谁决策", "15min"],
      ["推动客户或管理层确认范围、资源或验收标准", "20min"],
    ],
  },
  planning: {
    green: [
      ["把需求拆成可执行任务", "25min"],
      ["确认每个任务负责人和依赖", "20min"],
      ["同步客户确认范围和优先级", "15min"],
    ],
    yellow: [
      ["把需求拆成可执行任务", "25min"],
      ["确认每个任务负责人和依赖", "20min"],
      ["同步客户确认范围和优先级", "15min"],
      ["记录估时超出、依赖不清或范围不稳的风险", "15min"],
      ["准备调整范围或排期的建议", "20min"],
    ],
    red: [
      ["停止把未确认需求继续拆给团队", "5min"],
      ["整理范围、估时或依赖失控的证据", "20min"],
      ["准备变更或重新排期说明", "25min"],
      ["推动客户或管理层做范围和排期决策", "20min"],
    ],
  },
  delivery: {
    green: [
      ["检查影响里程碑的任务进展", "15min"],
      ["确认团队阻塞是否有人处理", "15min"],
      ["同步客户待确认事项和截止时间", "10min"],
    ],
    yellow: [
      ["检查影响里程碑的任务进展", "15min"],
      ["确认团队阻塞是否有人处理", "15min"],
      ["同步客户待确认事项和截止时间", "10min"],
      ["写清 Yellow 原因、影响和恢复动作", "15min"],
      ["提醒客户或内部负责人今天必须反馈", "10min"],
    ],
    red: [
      ["准备升级说明", "15min"],
      ["暂停未经确认的新增承诺", "5min"],
      ["整理延期、范围或资源问题的事实", "20min"],
      ["推动客户或内部做关键决策", "20min"],
    ],
  },
  acceptance: {
    green: [
      ["确认内部验收和客户 UAT 状态", "15min"],
      ["检查关键缺陷是否关闭", "15min"],
      ["准备交付包和验收确认请求", "20min"],
    ],
    yellow: [
      ["确认内部验收和客户 UAT 状态", "15min"],
      ["检查关键缺陷是否关闭", "15min"],
      ["准备交付包和验收确认请求", "20min"],
      ["记录影响验收的缺陷或客户反馈", "15min"],
      ["明确缺陷负责人和修复截止时间", "10min"],
    ],
    red: [
      ["区分本期验收问题和新增需求", "20min"],
      ["整理阻塞验收的事实和依据", "20min"],
      ["准备升级说明或验收推进话术", "15min"],
      ["推动客户确认验收结论或剩余事项", "20min"],
    ],
  },
  closing: {
    green: [
      ["确认客户验收或阶段关闭记录", "10min"],
      ["整理交付物、账号和项目资料", "20min"],
      ["安排内部复盘并记录经验", "20min"],
    ],
    yellow: [
      ["确认客户验收或阶段关闭记录", "10min"],
      ["整理交付物、账号和项目资料", "20min"],
      ["安排内部复盘并记录经验", "20min"],
      ["记录未结事项、支持边界或结算风险", "15min"],
      ["同步商务或管理层关注事项", "10min"],
    ],
    red: [
      ["整理客户拒绝关闭或投诉的事实", "20min"],
      ["确认未结款项、支持边界或重大遗留问题", "20min"],
      ["准备给管理层的关闭风险说明", "15min"],
      ["推动客户、商务或管理层做关闭决策", "20min"],
    ],
  },
};

const stageGateTemplates = {
  handoff: {
    expectedDays: 3,
    checks: [
      { id: "handoff-materials", text: "售前资料、合同和报价已阅读" },
      { id: "handoff-risks", text: "明显风险和缺口已记录" },
      { id: "handoff-questions", text: "待客户确认问题已整理" },
    ],
  },
  kickoff: {
    expectedDays: 2,
    checks: [
      { id: "kickoff-internal", text: "内部启动会已完成" },
      { id: "kickoff-client", text: "客户 Kickoff 已完成或已安排" },
      { id: "kickoff-scope", text: "项目目标、范围和不包含范围已说明" },
      { id: "kickoff-milestones", text: "里程碑和沟通机制已确认" },
    ],
  },
  planning: {
    expectedDays: 4,
    checks: [
      { id: "planning-breakdown", text: "核心需求已拆成可执行任务" },
      { id: "planning-owners", text: "任务负责人和关键依赖已明确" },
      { id: "planning-scope", text: "本期范围和优先级已确认" },
      { id: "planning-risks", text: "风险与问题已记录" },
    ],
  },
  delivery: {
    expectedDays: 10,
    checks: [
      { id: "delivery-progress", text: "影响里程碑的任务进展已检查" },
      { id: "delivery-blockers", text: "团队阻塞已有负责人跟进" },
      { id: "delivery-client", text: "客户待确认事项已同步" },
      { id: "delivery-changes", text: "新增需求已判断是否变更" },
    ],
  },
  acceptance: {
    expectedDays: 4,
    checks: [
      { id: "acceptance-internal", text: "内部验收已完成" },
      { id: "acceptance-uat", text: "客户 UAT 已完成或安排" },
      { id: "acceptance-defects", text: "关键缺陷已关闭" },
      { id: "acceptance-package", text: "交付包和验收确认请求已准备" },
    ],
  },
  closing: {
    expectedDays: 2,
    checks: [
      { id: "closing-confirmation", text: "客户验收或阶段关闭记录已确认" },
      { id: "closing-assets", text: "交付物和项目资料已归档" },
      { id: "closing-open-items", text: "未结事项和支持边界已说明" },
      { id: "closing-review", text: "内部复盘已完成或安排" },
    ],
  },
};

const selfTestBank = {
  handoff: [
    {
      id: "handoff-self-test-1",
      question: "售前说“客户只是顺便要一个数据迁移”，合同没有写。PM 第一反应应该是什么？",
      options: ["A. 记录为待确认范围并评估影响", "B. 直接答应客户，避免影响关系", "C. 让开发先做着看", "D. 等客户以后再提"],
      answer: "A",
      explanation: "未写入合同的承诺不能直接进入交付范围。新人 PM 要先留痕、确认边界、评估排期和成本影响。",
    },
    {
      id: "handoff-self-test-2",
      question: "售前资料缺少客户决策人和验收方式，项目又很急。最合适的动作是？",
      options: ["A. 整理缺口，推动售前和客户补充确认", "B. 先开开发任务，后面再说", "C. 只问技术负责人", "D. 默认客户负责人就是验收人"],
      answer: "A",
      explanation: "启动前缺少决策人和验收方式，会在后续确认、变更、验收阶段放大风险。",
    },
    {
      id: "handoff-self-test-3",
      question: "技术负责人判断第三方接口有不确定性，但销售承诺两周上线。PM 应该如何处理？",
      options: ["A. 记录技术风险并推动重新确认排期假设", "B. 让技术先按两周承诺开发", "C. 对客户保证不会延期", "D. 不写进风险清单，避免影响启动"],
      answer: "A",
      explanation: "售前交接阶段要把承诺和交付能力对齐。技术不确定性必须转成风险、假设和待确认事项。",
    },
  ],
  kickoff: [
    {
      id: "kickoff-self-test-1",
      question: "Kickoff 会上客户一直讲新想法，没有确认本期范围。PM 应该怎么收口？",
      options: ["A. 把新想法记录为待评估，回到本期范围和验收标准", "B. 全部加入本期计划", "C. 会后不记录，避免麻烦", "D. 让客户直接找开发沟通"],
      answer: "A",
      explanation: "启动会的核心是建立共同规则。新想法可以记录，但必须和本期范围分开。",
    },
    {
      id: "kickoff-self-test-2",
      question: "客户说“验收标准后面边做边看”。新人 PM 应该判断为什么状态？",
      options: ["A. Yellow，因为验收标准不清会影响交付闭环", "B. Green，因为客户态度积极", "C. Red，因为项目必须停止", "D. 不需要标状态"],
      answer: "A",
      explanation: "验收标准不清通常还未失控，但已经形成返工和验收争议风险，应按 Yellow 推动确认。",
    },
    {
      id: "kickoff-self-test-3",
      question: "客户 Kickoff 只有业务联系人参加，真正决策人没有出现。PM 应该补做什么？",
      options: ["A. 明确决策链路和关键确认人", "B. 默认业务联系人可以拍板", "C. 跳过角色确认直接排开发", "D. 只把会议纪要发给内部团队"],
      answer: "A",
      explanation: "启动阶段必须确认谁反馈、谁拍板、谁验收。否则后续范围、变更和验收都可能反复。",
    },
  ],
  planning: [
    {
      id: "planning-self-test-1",
      question: "需求清单已有 20 个功能，但没有负责人、依赖和验收点。当前最缺的是什么？",
      options: ["A. 可执行的任务拆解", "B. 更漂亮的周报", "C. 更多会议", "D. 直接进入验收"],
      answer: "A",
      explanation: "规划拆解不是列功能名，而是让团队知道谁做、先后顺序、验收标准和风险。",
    },
    {
      id: "planning-self-test-2",
      question: "技术估时明显超过原报价排期，PM 不应该做什么？",
      options: ["A. 隐瞒风险继续按原计划推进", "B. 记录估时差异", "C. 准备范围或排期调整建议", "D. 找售前和技术复核假设"],
      answer: "A",
      explanation: "估时差异是典型 Yellow/Red 来源。新人 PM 要暴露问题，不要用乐观假设盖住风险。",
    },
    {
      id: "planning-self-test-3",
      question: "设计、前端、后端都依赖客户提供品牌素材，但客户还没给。规划阶段应该怎么处理？",
      options: ["A. 把素材作为依赖项，明确负责人和截止时间", "B. 让团队先随便找素材占位", "C. 不写进计划，等客户想起来", "D. 把所有任务都标记为已就绪"],
      answer: "A",
      explanation: "规划拆解要把依赖显性化。客户资料、权限、接口、素材都应进入计划或风险日志。",
    },
  ],
  delivery: [
    {
      id: "delivery-self-test-1",
      question: "客户连续两天不确认接口字段，开发被卡住。PM 今日优先动作是？",
      options: ["A. 写清影响并给出确认截止时间", "B. 只在群里催一句", "C. 让开发随便猜字段", "D. 等客户有空"],
      answer: "A",
      explanation: "交付阶段的客户阻塞要明确事项、影响、截止时间和下一步处理方式。",
    },
    {
      id: "delivery-self-test-2",
      question: "客户提出新增审批流程，可能影响上线日期。PM 应该先做什么？",
      options: ["A. 记录变更并评估范围、排期、成本和测试影响", "B. 直接安排开发", "C. 告诉客户完全不能做", "D. 放到周报里但不处理"],
      answer: "A",
      explanation: "新增需求不一定拒绝，但必须先走变更评估，避免范围失控。",
    },
    {
      id: "delivery-self-test-3",
      question: "开发说核心功能明天能提测，但测试负责人反馈测试环境账号还没开。PM 应该优先确认什么？",
      options: ["A. 环境账号阻塞、负责人和解决时间", "B. 只记录开发明天能提测", "C. 让测试自己解决账号", "D. 等提测失败后再同步客户"],
      answer: "A",
      explanation: "实施推进阶段要主动暴露阻塞。只看开发完成不够，还要检查测试、环境、资料等交付链路。",
    },
  ],
  acceptance: [
    {
      id: "acceptance-self-test-1",
      question: "客户 UAT 提了 12 条反馈，里面混有缺陷、优化和新需求。PM 应该先做什么？",
      options: ["A. 分类并标记是否影响本期验收", "B. 全部当缺陷处理", "C. 全部当新需求拒绝", "D. 让开发自己判断"],
      answer: "A",
      explanation: "验收阶段最重要的是把缺陷、优化、新需求分开，避免新增内容阻塞本期关闭。",
    },
    {
      id: "acceptance-self-test-2",
      question: "关键缺陷还没关闭，但客户要求先上线。PM 应该输出什么？",
      options: ["A. 风险说明、处理计划和需要客户确认的决策", "B. 口头答应上线", "C. 隐藏缺陷", "D. 删除验收清单"],
      answer: "A",
      explanation: "带风险上线必须有事实、影响、责任和确认记录，不能只靠口头承诺。",
    },
    {
      id: "acceptance-self-test-3",
      question: "客户用新增报表需求拒绝签阶段验收。PM 最合理的处理方式是？",
      options: ["A. 区分本期验收项和新增需求，先推进本期确认", "B. 同意所有新增报表做完再验收", "C. 让开发私下加报表", "D. 不再跟进验收"],
      answer: "A",
      explanation: "验收阶段要防止新增需求阻塞已完成范围。新增内容可进入变更或后续迭代。",
    },
  ],
  closing: [
    {
      id: "closing-self-test-1",
      question: "客户口头说“差不多可以了”，但没有确认记录。PM 应该怎么做？",
      options: ["A. 发关闭确认并列清交付物、未结事项和支持边界", "B. 直接停止跟进", "C. 删除项目资料", "D. 只告诉开发结束了"],
      answer: "A",
      explanation: "关闭阶段需要留痕。口头认可不能替代验收、移交、支持边界和未结事项记录。",
    },
    {
      id: "closing-self-test-2",
      question: "项目结束后团队没有复盘，新人 PM 最容易失去什么？",
      options: ["A. 可复用经验和下次避坑依据", "B. 客户联系方式", "C. 页面视觉效果", "D. 开发工具"],
      answer: "A",
      explanation: "复盘的价值是把一次项目经验变成模板、话术、风险清单和训练案例。",
    },
    {
      id: "closing-self-test-3",
      question: "项目已上线，但客户持续在群里提小优化。PM 在关闭阶段应明确什么？",
      options: ["A. 免费修复、售后支持和新需求的边界", "B. 所有小优化都免费做", "C. 退出项目群不再回应", "D. 让开发自行判断是否处理"],
      answer: "A",
      explanation: "关闭复盘阶段要明确支持边界，避免项目无限拖尾，也保护团队资源和客户预期。",
    },
  ],
};

const statusRules = [
  {
    key: "green",
    label: "Green",
    title: "正常推进",
    standard: "项目按当前计划推进，没有影响里程碑、质量、范围或客户关系的关键阻塞。",
    useWhen: ["当前里程碑没有延期风险", "客户确认、资料、权限基本按时提供", "团队没有影响交付的阻塞", "新增需求或变化在可控范围内"],
    action: "保持正常跟进，更新任务、客户确认事项和必要沟通记录。",
  },
  {
    key: "yellow",
    label: "Yellow",
    title: "存在风险",
    standard: "项目还没有失控，但已经出现可能影响里程碑、范围、质量或客户满意度的风险。",
    useWhen: ["关键任务可能影响里程碑", "客户反馈延迟，已影响下一步安排", "出现新增需求但影响尚未确认", "资源、质量或依赖问题需要持续跟进"],
    action: "写清风险原因、影响、负责人、截止时间和恢复动作，必要时提醒客户或内部负责人。",
  },
  {
    key: "red",
    label: "Red",
    title: "必须升级",
    standard: "项目已经影响交付、验收、成本、客户关系或内部资源，PM 无法只靠日常跟进解决。",
    useWhen: ["里程碑已经或大概率无法按期完成", "范围、成本、验收或客户关系出现重大风险", "关键资源缺失，PM 无法独立解决", "客户拒绝确认或以新增需求阻止验收"],
    action: "立即准备升级说明，写清事实、影响、已采取动作和需要管理层或客户做的决策。",
  },
];

const storageKey = "pm-workflow-data";
let appData = { projects: [], learningProgress: {} };
let activeProjectId = null;

const stageBadges = {
  handoff: "售前交接通关者",
  kickoff: "项目启动指挥官",
  planning: "规划拆解能手",
  delivery: "实施推进掌舵者",
  acceptance: "验收交付守门人",
  closing: "关闭复盘沉淀者",
};

const trainingCaseProfiles = {
  ecommerceScope: {
    title: "电商 App 首期范围确认",
    background: "客户要做商品浏览、购物车、下单支付和后台订单管理。售前口头提到优惠券、积分、历史订单导入，但合同只写核心交易闭环。",
    learnerRole: "你是刚接手项目的 PM，需要判断哪些内容能进入首期，哪些必须先确认或评估。",
    stakeholders: [
      ["客户负责人", "优惠券和积分不是很复杂吧？我们以为首期肯定包含，不然运营没法用。"],
      ["售前", "当时只是口头聊过，没有写进报价。我觉得可以先帮客户做一点，关系比较重要。"],
      ["技术负责人", "支付和订单没问题，但历史订单导入、积分规则和库存同步都需要额外评估。"],
      ["老板", "客户预算不大，别一上来就吵范围，但风险要提前讲清楚。"],
    ],
    traps: ["把口头承诺当合同范围", "为了客户关系直接答应新增内容", "没有让技术评估数据迁移和积分规则", "没有留下范围确认记录"],
    expectedOutput: "输出一份待确认问题清单，明确首期范围、待评估项和可能影响排期/成本的事项。",
  },
  websiteDeadline: {
    title: "企业官网展会前上线",
    background: "客户官网要在展会前上线，原范围包含首页、产品页、案例页和线索表单。设计确认后，客户提出新增多语言和会员下载专区。",
    learnerRole: "你是推进阶段的 PM，需要判断新增需求是否影响上线，并给出可执行的处理方案。",
    stakeholders: [
      ["客户市场负责人", "展会前必须上线，多语言最好也一起有，不然海外客户看不了。"],
      ["设计负责人", "多语言会影响页面长度和部分版式，已经确认的设计要调整。"],
      ["前端开发", "会员下载专区要登录、权限和文件管理，不是简单加页面。"],
      ["老板", "上线日期不能丢，能拆二期就拆二期，但要让客户接受。"],
    ],
    traps: ["把新增需求直接塞进原计划", "只催开发加班，不评估范围和测试影响", "没有给客户可选择方案", "周报只写进度不写决策点"],
    expectedOutput: "输出一段变更评估说明，列出对时间、成本、测试和上线目标的影响，并建议拆分首期/二期。",
  },
  approvalUat: {
    title: "内部审批系统 UAT 卡住",
    background: "客户审批系统进入 UAT，覆盖请假、报销、采购三类流程。客户一次性反馈 12 条意见，其中混有缺陷、优化建议和新增报表需求。",
    learnerRole: "你是验收阶段的 PM，需要把反馈分类，推动本期验收关闭，而不是让项目无限拖尾。",
    stakeholders: [
      ["客户业务负责人", "这些都影响体验，最好验收前一起改完。"],
      ["客户 IT", "关键缺陷只有 3 个，其他多是流程优化和新增统计报表。"],
      ["测试负责人", "缺陷可以两天内回归，但新增报表没有需求说明和测试用例。"],
      ["商务", "尾款依赖验收确认，不能让新增需求一直卡住关闭。"],
    ],
    traps: ["把所有反馈都当缺陷", "让新增需求阻塞本期验收", "没有缺陷分级和验收影响判断", "没有同步尾款和关闭风险"],
    expectedOutput: "输出一份 UAT 反馈分类表，把缺陷、优化、新需求分开，并标记是否影响本期验收。",
  },
};

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function getLocalDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function clampStageProgress(value) {
  const progress = Number.parseInt(value, 10);

  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, progress));
}

function createProject(name, options = {}) {
  const stage = options.stage && stages[options.stage] ? options.stage : "handoff";
  const status = options.status && statusFocus[options.status] ? options.status : "green";

  return {
    id: options.id || Date.now(),
    name,
    caseId: options.caseId || "",
    stage,
    status,
    stageChecks: {},
    todayActionsDone: {},
    actionStatus: {},
    customActions: [],
    selfTestProgress: {},
    stageStartDate: { [stage]: getLocalDateString() },
    stageProgress: {},
    manualStageProgress: {},
    nextPaymentDate: "",
    blockedMilestone: "",
    customerRisk: "",
    lastUpdated: getLocalDateString(),
  };
}

function createTrainingCases() {
  return [
    createProject("案例 1：电商 App 首期范围确认", { id: 1001, caseId: "ecommerceScope", stage: "handoff", status: "yellow" }),
    createProject("案例 2：企业官网展会前上线", { id: 1002, caseId: "websiteDeadline", stage: "delivery", status: "yellow" }),
    createProject("案例 3：内部审批系统 UAT 卡住", { id: 1003, caseId: "approvalUat", stage: "acceptance", status: "red" }),
  ];
}

function inferCaseId(project) {
  if (project.caseId && trainingCaseProfiles[project.caseId]) {
    return project.caseId;
  }

  const projectName = String(project.name || "");

  if (projectName.includes("电商")) {
    return "ecommerceScope";
  }

  if (projectName.includes("官网")) {
    return "websiteDeadline";
  }

  if (projectName.includes("审批") || projectName.includes("UAT")) {
    return "approvalUat";
  }

  return "";
}

function normalizeActionStatus(project) {
  if (project.actionStatus && typeof project.actionStatus === "object" && Object.keys(project.actionStatus).length) {
    return Object.fromEntries(
      Object.entries(project.actionStatus).map(([key, value]) => {
        const status = value && typeof value === "object" ? value : {};
        return [
          key,
          {
            completed: Boolean(status.completed),
            completedAt: status.completedAt || null,
            actionText: status.actionText || "",
            skipped: Boolean(status.skipped),
            blocked: Boolean(status.blocked),
            blockReason: status.blockReason || "",
            blockedSince: status.blockedSince || "",
          },
        ];
      }),
    );
  }

  const legacyDone = project.todayActionsDone && typeof project.todayActionsDone === "object" ? project.todayActionsDone : {};

  return Object.fromEntries(
    Object.entries(legacyDone).map(([key, value]) => [
      key,
      {
        completed: Boolean(value),
        completedAt: null,
        actionText: "",
        skipped: false,
        blocked: false,
        blockReason: "",
        blockedSince: "",
      },
    ]),
  );
}

function normalizeProject(project) {
  const actionStatus = normalizeActionStatus(project);
  const stageStartDate = project.stageStartDate && typeof project.stageStartDate === "object" ? project.stageStartDate : {};
  const stageProgress = project.stageProgress && typeof project.stageProgress === "object" ? project.stageProgress : {};
  const manualStageProgress = project.manualStageProgress && typeof project.manualStageProgress === "object" ? project.manualStageProgress : {};
  const selfTestProgress = project.selfTestProgress && typeof project.selfTestProgress === "object" ? project.selfTestProgress : {};
  const normalizedStage = stages[project.stage] ? project.stage : "handoff";
  const customActions = Array.isArray(project.customActions)
    ? project.customActions
        .filter((item) => item && item.id && item.text)
        .map((item) => ({
          id: String(item.id),
          text: String(item.text),
          time: item.time || "15min",
          createdAt: item.createdAt || getLocalDateString(),
        }))
    : [];

  return {
    id: project.id || Date.now(),
    name: project.name || "未命名练习案例",
    caseId: inferCaseId(project),
    stage: normalizedStage,
    status: statusFocus[project.status] ? project.status : "green",
    stageChecks: project.stageChecks && typeof project.stageChecks === "object" ? project.stageChecks : {},
    todayActionsDone: project.todayActionsDone && typeof project.todayActionsDone === "object" ? project.todayActionsDone : {},
    actionStatus,
    customActions,
    selfTestProgress,
    stageStartDate: {
      ...stageStartDate,
      [normalizedStage]: stageStartDate[normalizedStage] || project.lastUpdated || getLocalDateString(),
    },
    stageProgress: Object.fromEntries(
      Object.entries(stageProgress)
        .filter(([key]) => stages[key])
        .map(([key, value]) => [key, clampStageProgress(value)]),
    ),
    manualStageProgress: Object.fromEntries(
      Object.entries(manualStageProgress)
        .filter(([key]) => stages[key])
        .map(([key, value]) => [key, clampStageProgress(value)])
        .filter(([, value]) => value > 0),
    ),
    nextPaymentDate: project.nextPaymentDate || "",
    blockedMilestone: project.blockedMilestone || "",
    customerRisk: project.customerRisk || "",
    lastUpdated: project.lastUpdated || getLocalDateString(),
  };
}

function normalizeLearningProgress(progress) {
  const source = progress && typeof progress === "object" ? progress : {};

  return Object.fromEntries(
    Object.keys(stages).map((stageKey) => [
      stageKey,
      {
        completed: Boolean(source[stageKey] && source[stageKey].completed),
        completedAt: (source[stageKey] && source[stageKey].completedAt) || "",
      },
    ]),
  );
}

function resetStaleTodayActions(project) {
  return false;
}

function loadData() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
    const projects = Array.isArray(parsed.projects) ? parsed.projects.map(normalizeProject) : [];
    appData = {
      projects: projects.length ? projects : createTrainingCases(),
      learningProgress: normalizeLearningProgress(parsed.learningProgress),
    };
  } catch (error) {
    appData = {
      projects: createTrainingCases(),
      learningProgress: normalizeLearningProgress({}),
    };
  }

  appData.projects.forEach((project) => {
    if (project.name === "示例项目" || project.name === "示例项目：某电商APP") {
      project.name = "案例 1：电商 App 首期范围确认";
    }
  });

  appData.projects.forEach(resetStaleTodayActions);
  appData.projects.forEach((project) => ensureStageStartDate(project, project.stage));
  activeProjectId = appData.projects[0].id;
  saveData();
}

function saveData() {
  window.localStorage.setItem(storageKey, JSON.stringify(appData));
}

function getActiveProject() {
  return appData.projects.find((project) => project.id === activeProjectId) || appData.projects[0];
}

function touchProject(project) {
  project.lastUpdated = getLocalDateString();
  saveData();
}

function ensureStageStartDate(project, stageKey) {
  project.stageStartDate = project.stageStartDate || {};

  if (!project.stageStartDate[stageKey]) {
    project.stageStartDate[stageKey] = project.lastUpdated || getLocalDateString();
    return true;
  }

  return false;
}

function getActionStatus(project, actionId) {
  const status = project.actionStatus && project.actionStatus[actionId];

  return {
    completed: Boolean(status && status.completed),
    completedAt: (status && status.completedAt) || null,
    actionText: (status && status.actionText) || "",
    skipped: Boolean(status && status.skipped),
    blocked: Boolean(status && status.blocked),
    blockReason: (status && status.blockReason) || "",
    blockedSince: (status && status.blockedSince) || "",
  };
}

function setActionStatus(project, actionId, nextStatus) {
  const status = {
    ...getActionStatus(project, actionId),
    ...nextStatus,
  };

  if (status.completed && !status.completedAt) {
    status.completedAt = getLocalDateString();
  }

  if (!status.completed && Object.prototype.hasOwnProperty.call(nextStatus, "completed")) {
    status.completedAt = null;
  }

  project.actionStatus = project.actionStatus || {};
  project.todayActionsDone = project.todayActionsDone || {};
  project.actionStatus[actionId] = status;
  project.todayActionsDone[actionId] = status.completed;
}

function clearDailyActionStatus(project) {
  project.todayActionsDone = {};
  project.actionStatus = Object.fromEntries(
    Object.entries(project.actionStatus || {})
      .filter(([, status]) => status && (status.blocked || status.completedAt))
      .map(([key, status]) => [
        key,
        {
          completed: false,
          completedAt: status.completedAt || null,
          actionText: status.actionText || "",
          skipped: Boolean(status.skipped),
          blocked: Boolean(status.blocked),
          blockReason: status.blockReason || "",
          blockedSince: status.blocked ? status.blockedSince || getLocalDateString() : "",
        },
      ]),
  );
}

function getTodayActionItems(stageKey, statusKey) {
  return dailyActionTemplates[stageKey][statusKey].map(([text, time], index) => ({
    id: `${stageKey}-${statusKey}-${index}`,
    text,
    time,
    source: "template",
  }));
}

function getProjectActionItems(project) {
  const templateActions = getTodayActionItems(project.stage, project.status);
  const customActions = (project.customActions || [])
    .map((item) => ({
      id: item.id,
      text: item.text,
      time: item.time || "15min",
      source: "custom",
    }))
    .filter((item) => !getActionStatus(project, item.id).completed);

  return [...templateActions, ...customActions];
}

function getProjectReportActionItems(project) {
  const templateActions = getTodayActionItems(project.stage, project.status);
  const customActions = (project.customActions || []).map((item) => ({
    id: item.id,
    text: item.text,
    time: item.time || "15min",
    source: "custom",
  }));

  return [...templateActions, ...customActions];
}

function getActionTotalMinutes(actionItems) {
  return actionItems.reduce((total, item) => {
    const minutes = Number.parseInt(item.time, 10);
    return Number.isNaN(minutes) ? total : total + minutes;
  }, 0);
}

function getStageExpectedDays(stageKey, actionItems) {
  const template = stageGateTemplates[stageKey];
  return template && template.expectedDays ? template.expectedDays : actionItems.length;
}

function getStageProgress(project) {
  ensureStageStartDate(project, project.stage);

  const actionItems = getTodayActionItems(project.stage, project.status);
  const expectedDays = getStageExpectedDays(project.stage, actionItems);
  const usedDays = getDateDiffInDays(project.stageStartDate[project.stage], getLocalDateString());
  const isOverdue = usedDays > expectedDays * 1.2;

  return {
    expectedDays,
    usedDays,
    isOverdue,
  };
}

function getStageActionCompletion(project, stageKey) {
  const actionItems = getTodayActionItems(stageKey, project.status);

  if (!actionItems.length) {
    return { completed: 0, total: 0, percent: 0 };
  }

  const completed = actionItems.filter((item) => getActionStatus(project, item.id).completed).length;
  return {
    completed,
    total: actionItems.length,
    percent: Math.round((completed / actionItems.length) * 100),
  };
}

function getStageGateCompletion(project, stageKey) {
  const checks = stageGateTemplates[stageKey] ? stageGateTemplates[stageKey].checks : [];

  if (!checks.length) {
    return { completed: 0, total: 0, percent: 0 };
  }

  const completed = checks.filter((item) => project.stageChecks && project.stageChecks[item.id]).length;
  return {
    completed,
    total: checks.length,
    percent: Math.round((completed / checks.length) * 100),
  };
}

function getStageSelfTestCompletion(project, stageKey) {
  const total = (selfTestBank[stageKey] || []).length;
  const completed = getCompletedSelfTestCount(project, stageKey);

  if (!total) {
    return { completed: 0, total: 0, percent: 0 };
  }

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  };
}

function getAutoStageProgress(project, stageKey) {
  const action = getStageActionCompletion(project, stageKey);
  const gate = getStageGateCompletion(project, stageKey);
  const selfTest = getStageSelfTestCompletion(project, stageKey);

  return Math.round(action.percent * 0.4 + gate.percent * 0.4 + selfTest.percent * 0.2);
}

function hasManualStageProgress(project, stageKey) {
  return Boolean(
    project &&
      project.manualStageProgress &&
      Object.prototype.hasOwnProperty.call(project.manualStageProgress, stageKey),
  );
}

function getManualStageProgress(project, stageKey) {
  project.manualStageProgress = project.manualStageProgress || {};
  return hasManualStageProgress(project, stageKey) ? clampStageProgress(project.manualStageProgress[stageKey]) : null;
}

function getDisplayedStageProgress(project, stageKey) {
  const manualProgress = getManualStageProgress(project, stageKey);
  return manualProgress === null ? getAutoStageProgress(project, stageKey) : manualProgress;
}

function getOverallLearningProgress(project) {
  if (!project) {
    return 0;
  }

  const stageKeys = Object.keys(stages);
  const totalProgress = stageKeys.reduce((total, stageKey) => total + getDisplayedStageProgress(project, stageKey), 0);
  return Math.round(totalProgress / stageKeys.length);
}

function getCompletedSelfTestCount(project, stageKey) {
  if (!project || !stageKey) {
    return 0;
  }

  const progress = project.selfTestProgress && project.selfTestProgress[stageKey];

  if (Array.isArray(progress)) {
    return progress.filter(Boolean).length;
  }

  if (progress && typeof progress === "object") {
    return Object.values(progress).filter((item) => {
      if (item && typeof item === "object") {
        return Boolean(item.answeredAt || item.selected);
      }

      return Boolean(item);
    }).length;
  }

  if (typeof progress === "number") {
    return Math.max(0, Math.min(progress, (selfTestBank[stageKey] || []).length));
  }

  return 0;
}

function getSelfTestAnswerRecord(project, stageKey, questionId) {
  const stageProgress = project && project.selfTestProgress && project.selfTestProgress[stageKey];

  if (!stageProgress || typeof stageProgress !== "object" || Array.isArray(stageProgress)) {
    return null;
  }

  const record = stageProgress[questionId];
  return record && typeof record === "object" ? record : null;
}

function saveSelfTestAnswer(project, stageKey, questionId, selectedAnswer) {
  const question = (selfTestBank[stageKey] || []).find((item) => item.id === questionId);

  if (!project || !question) {
    return;
  }

  project.selfTestProgress = project.selfTestProgress || {};
  project.selfTestProgress[stageKey] =
    project.selfTestProgress[stageKey] && typeof project.selfTestProgress[stageKey] === "object" && !Array.isArray(project.selfTestProgress[stageKey])
      ? project.selfTestProgress[stageKey]
      : {};
  project.selfTestProgress[stageKey][questionId] = {
    selected: selectedAnswer,
    correct: selectedAnswer === question.answer,
    answeredAt: new Date().toISOString(),
  };
  touchProject(project);
}

function setManualStageProgress(project, stageKey, value) {
  const progress = clampStageProgress(value);
  project.manualStageProgress = project.manualStageProgress || {};

  if (progress > 0) {
    project.manualStageProgress[stageKey] = progress;
  } else {
    delete project.manualStageProgress[stageKey];
  }

  project.stageProgress = {
    ...(project.stageProgress || {}),
    [stageKey]: progress,
  };
  saveData();
}

function syncStageProgressControls(stageKey, value) {
  document.querySelectorAll(`[data-stage-progress="${stageKey}"]`).forEach((control) => {
    control.value = value;
  });
}

function shouldSuggestYellow(project) {
  const progress = getStageProgress(project);
  return progress.isOverdue && project.status === "green";
}

function getUnfinishedActionCount(project) {
  const items = getProjectActionItems(project);
  return items.filter((item) => {
    const status = getActionStatus(project, item.id);
    return !status.completed;
  }).length;
}

function getBlockedActionCount(project) {
  const items = getProjectActionItems(project);
  return items.filter((item) => getActionStatus(project, item.id).blocked).length;
}

function getDateDiffInDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  return Math.max(0, Math.ceil((end - start) / 86400000));
}

function getBlockedWarnings(project, actionItems) {
  const today = getLocalDateString();

  return actionItems
    .map((item) => {
      const status = getActionStatus(project, item.id);
      const blockedDays = status.blocked && status.blockedSince ? getDateDiffInDays(status.blockedSince, today) : 0;
      return { item, status, blockedDays };
    })
    .filter(({ blockedDays }) => blockedDays >= 2);
}

function getSkippedTemplateActions(project) {
  return getTodayActionItems(project.stage, project.status).filter((item) => getActionStatus(project, item.id).skipped);
}

function setActionSkipped(project, actionId, skipped) {
  const action = getTodayActionItems(project.stage, project.status).find((item) => item.id === actionId);

  if (!action) {
    return;
  }

  setActionStatus(project, actionId, {
    completed: false,
    completedAt: null,
    actionText: action.text,
    skipped,
    blocked: false,
    blockReason: "",
    blockedSince: "",
  });
  touchProject(project);
  renderStage(project.stage);
  renderDailyWorkbench();
  renderProjectList();
}

function closeBlockReasonPicker() {
  const existingPicker = document.querySelector("#block-reason-picker");

  if (existingPicker) {
    existingPicker.remove();
  }

  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleBlockReasonPickerKeydown);
}

function handleBlockReasonPickerKeydown(event) {
  if (event.key === "Escape") {
    closeBlockReasonPicker();
  }
}

function applyActionBlockReason(actionId, reason, currentBlockedStatus) {
  const project = getActiveProject();
  const previousStatus = currentBlockedStatus || {};

  if (!project) {
    return;
  }

  const currentStatus = getActionStatus(project, actionId);
  const action = getProjectActionItems(project).find((item) => item.id === actionId);

  if (!reason) {
    setActionStatus(project, actionId, {
      actionText: action ? action.text : currentStatus.actionText,
      blocked: false,
      blockReason: "",
      blockedSince: "",
    });
  } else {
    setActionStatus(project, actionId, {
      completed: false,
      actionText: action ? action.text : currentStatus.actionText,
      blocked: true,
      blockReason: reason,
      blockedSince: currentStatus.blockedSince || previousStatus.blockedSince || getLocalDateString(),
    });
  }

  touchProject(project);
  renderDailyWorkbench();
  renderProjectList();
}

function showBlockReasonPicker(actionId, currentBlockedStatus) {
  closeBlockReasonPicker();

  const overlay = document.createElement("div");
  overlay.id = "block-reason-picker";
  overlay.className = "block-picker-backdrop";

  const dialog = document.createElement("div");
  dialog.className = "block-picker-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "block-picker-title");

  dialog.innerHTML = `
    <div class="block-picker-header">
      <h2 id="block-picker-title">选择阻塞原因</h2>
      <button class="block-picker-close" type="button" aria-label="关闭">×</button>
    </div>
    <div class="block-picker-options">
      <button class="block-picker-option" data-block-reason="等待客户" type="button">等待客户</button>
      <button class="block-picker-option" data-block-reason="等待内部" type="button">等待内部</button>
      <button class="block-picker-option" data-block-reason="等待资料/权限" type="button">等待资料/权限</button>
      <button class="block-picker-option clear" data-block-reason="" type="button">不阻塞</button>
    </div>
  `;

  overlay.append(dialog);
  document.body.append(overlay);
  document.body.style.overflow = "hidden";

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest(".block-picker-close")) {
      closeBlockReasonPicker();
      return;
    }

    const option = event.target.closest("[data-block-reason]");

    if (!option) {
      return;
    }

    applyActionBlockReason(actionId, option.dataset.blockReason, currentBlockedStatus);
    closeBlockReasonPicker();
  });

  document.addEventListener("keydown", handleBlockReasonPickerKeydown);
  dialog.querySelector(".block-picker-close").focus();
}

function updateActionBlockStatus(project, actionId) {
  showBlockReasonPicker(actionId, getActionStatus(project, actionId));
}

function addCustomAction(project, text) {
  const action = {
    id: `custom-${Date.now()}`,
    text,
    time: "15min",
    createdAt: getLocalDateString(),
  };

  project.customActions = project.customActions || [];
  project.customActions.push(action);
  touchProject(project);
  renderDailyWorkbench();
  renderProjectList();
}

function formatReportDate(dateString) {
  if (!dateString) {
    return "";
  }

  const [, month, day] = dateString.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function getDateNDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCompletedGateCount(project, stageKey) {
  const checks = stageGateTemplates[stageKey] ? stageGateTemplates[stageKey].checks : [];
  const completed = checks.filter((item) => project.stageChecks && project.stageChecks[item.id]).length;

  return {
    completed,
    total: checks.length,
  };
}

function getLearningSummaryAdvice(overallProgress, completedActionTotal, completedSelfTestTotal, completedGateTotal, gateTotal) {
  if (!completedActionTotal) {
    return "建议先选择一个内置案例，从当前阶段的 3-5 个训练动作开始，不要只看资料。";
  }

  if (overallProgress < 30) {
    return "当前还处于起步阶段，建议每天固定完成一个案例阶段，优先勾选练习动作和阶段门检查。";
  }

  if (completedGateTotal < Math.ceil(gateTotal * 0.4)) {
    return "练习动作已有积累，但阶段门检查偏少。建议对照通关标准补齐关键交付物和判断依据。";
  }

  if (!completedSelfTestTotal) {
    return "动作和阶段进度已有记录，下一步建议完成自测题，并对照解析修正判断习惯。";
  }

  if (overallProgress < 70) {
    return "学习节奏正常。建议继续补齐低进度阶段，重点练习 Yellow / Red 场景下的升级和变更处理。";
  }

  return "整体进度较好。建议开始复盘输出物质量，重点检查话术、风险说明和验收边界是否足够清楚。";
}

function getWeeklyReportText() {
  const startDate = getDateNDaysAgo(6);
  const lines = [];
  let completedTotal = 0;
  let completedSelfTestTotal = 0;
  let selfTestTotal = 0;
  let completedGateTotal = 0;
  let gateTotal = 0;
  let overallProgressTotal = 0;
  const projectCount = appData.projects.length || 1;

  lines.push("个人学习总结");
  lines.push(`统计范围：${formatReportDate(startDate)} - ${formatReportDate(getLocalDateString())}`);
  lines.push("");
  lines.push("一、最近 7 天完成的练习动作");

  appData.projects.forEach((project) => {
    const actions = getProjectReportActionItems(project);
    const completedActions = [];

    actions.forEach((action) => {
      const status = getActionStatus(project, action.id);

      if (status.completedAt && status.completedAt >= startDate) {
        completedActions.push(`- ${status.actionText || action.text}（${formatReportDate(status.completedAt)}）`);
        completedTotal += 1;
      }
    });

    if (completedActions.length) {
      lines.push(`【${project.name}】`);
      lines.push(completedActions.join("\n"));
      lines.push("");
    }
  });

  if (!completedTotal) {
    lines.push("- 最近 7 天暂无已完成练习动作。");
    lines.push("");
  }

  lines.push("二、各阶段学习进度");

  appData.projects.forEach((project) => {
    overallProgressTotal += getOverallLearningProgress(project);

    lines.push(`【${project.name}】`);
    Object.entries(stages).forEach(([stageKey, stage]) => {
      const stagePercent = getDisplayedStageProgress(project, stageKey);
      lines.push(`- ${stage.title}：${stagePercent}%`);
    });
    lines.push("");
  });

  lines.push("三、阶段门检查项完成情况");

  appData.projects.forEach((project) => {
    lines.push(`【${project.name}】`);
    Object.entries(stages).forEach(([stageKey, stage]) => {
      const gateCount = getCompletedGateCount(project, stageKey);
      completedGateTotal += gateCount.completed;
      gateTotal += gateCount.total;
      lines.push(`- ${stage.title}：${gateCount.completed}/${gateCount.total}`);
    });
    lines.push("");
  });

  lines.push("四、自测题完成情况");

  appData.projects.forEach((project) => {
    lines.push(`【${project.name}】`);
    Object.entries(stages).forEach(([stageKey, stage]) => {
      const completed = getCompletedSelfTestCount(project, stageKey);
      const total = (selfTestBank[stageKey] || []).length;
      completedSelfTestTotal += completed;
      selfTestTotal += total;
      lines.push(`- ${stage.title}：${completed}/${total}`);
    });
    lines.push("");
  });

  const averageOverallProgress = Math.round(overallProgressTotal / projectCount);
  const advice = getLearningSummaryAdvice(averageOverallProgress, completedTotal, completedSelfTestTotal, completedGateTotal, gateTotal);

  lines.push("五、总体学习建议");
  lines.push(`- 最近 7 天完成练习动作：${completedTotal} 个`);
  lines.push(`- 平均学习进度：${averageOverallProgress}%`);
  lines.push(`- 阶段门检查完成：${completedGateTotal}/${gateTotal}`);
  lines.push(`- 自测题完成：${completedSelfTestTotal}/${selfTestTotal}`);
  lines.push(`- 建议：${advice}`);

  return lines.join("\n");
}

function openWeeklyReportModal() {
  const modal = document.querySelector("#weekly-report-modal");
  const output = document.querySelector("#weekly-report-output");

  if (!modal || !output) {
    return;
  }

  output.textContent = getWeeklyReportText();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeWeeklyReportModal() {
  const modal = document.querySelector("#weekly-report-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function resourceButtons(items) {
  return items
    .map(
      ([label, target]) => `
        <button class="resource-button copy-button" data-copy-target="${target}" type="button">
          ${label}
        </button>
      `,
    )
    .join("");
}

function renderLearningProgress() {
  const container = document.querySelector("#learning-progress");

  if (!container) {
    return;
  }

  const project = getActiveProject();
  const entries = Object.entries(stages);
  const currentStageKey = project && stages[project.stage] ? project.stage : "handoff";
  const currentStage = stages[currentStageKey];
  const actionItems = project ? getProjectActionItems(project) : [];
  const completedActions = project
    ? actionItems.filter((item) => getActionStatus(project, item.id).completed).length
    : 0;
  const displayedStageProgress = project ? getDisplayedStageProgress(project, currentStageKey) : 0;
  const selfTestTotal = (selfTestBank[currentStageKey] || []).length;
  const completedSelfTests = project ? getCompletedSelfTestCount(project, currentStageKey) : 0;
  const overallProgress = project ? getOverallLearningProgress(project) : 0;
  const completedStages = entries.filter(([stageKey]) => appData.learningProgress[stageKey] && appData.learningProgress[stageKey].completed);

  container.innerHTML = `
    <div class="learning-progress-heading">
      <div>
        <p class="eyebrow">学习进度</p>
        <h3>${project ? escapeHtml(project.name) : "未选择练习案例"}</h3>
        <p>当前阶段：${currentStage.title}。所有进度保存在本机浏览器中。</p>
      </div>
      <strong>${overallProgress}%</strong>
    </div>
    <div class="learning-progress-bar" aria-label="总体学习进度 ${overallProgress}%">
      <span style="width: ${overallProgress}%"></span>
    </div>
    <div class="learning-progress-metrics">
      <article>
        <span>当前阶段</span>
        <strong>${currentStage.title}</strong>
      </article>
      <article>
        <span>练习动作</span>
        <strong>${completedActions}/${actionItems.length}</strong>
      </article>
      <article>
        <span>阶段进度</span>
        <strong>${displayedStageProgress}%</strong>
      </article>
      <article>
        <span>自测题</span>
        <strong>${completedSelfTests}/${selfTestTotal}</strong>
      </article>
    </div>
    <div class="learning-stage-summary">
      <span>6 阶段平均进度</span>
      <strong>${overallProgress}%</strong>
      <small>默认按练习动作 40%、阶段门 40%、自测题 20% 自动计算；手动修正后以修正值为准。</small>
    </div>
    <div class="learning-stage-list">
      ${entries
        .map(([stageKey, stage]) => {
          const progress = appData.learningProgress[stageKey] || {};
          const completed = Boolean(progress.completed);
          const stagePercent = project ? getDisplayedStageProgress(project, stageKey) : 0;
          const manualLabel = project && hasManualStageProgress(project, stageKey) ? "手动修正" : "自动计算";

          return `
            <article class="learning-stage-card${completed ? " completed" : ""}">
              <div>
                <span>${stage.title}</span>
                <strong>${stagePercent}% · ${completed ? stageBadges[stageKey] : "未通关"}</strong>
                <small>${manualLabel}</small>
                ${completed && progress.completedAt ? `<small>完成于 ${progress.completedAt}</small>` : ""}
              </div>
              <button class="copy-button secondary-copy" data-learning-complete="${stageKey}" type="button">
                ${completed ? "取消完成" : "标记完成"}
              </button>
            </article>
          `;
        })
        .join("")}
    </div>
    ${
      completedStages.length
        ? `<div class="learning-badge-list">
            ${completedStages.map(([stageKey]) => `<span>${stageBadges[stageKey]}</span>`).join("")}
          </div>`
        : ""
    }
  `;
}

function toggleLearningStageComplete(stageKey) {
  if (!stages[stageKey]) {
    return;
  }

  appData.learningProgress = appData.learningProgress || normalizeLearningProgress({});
  const currentProgress = appData.learningProgress[stageKey] || {};
  const completed = !currentProgress.completed;

  appData.learningProgress[stageKey] = {
    completed,
    completedAt: completed ? getLocalDateString() : "",
  };
  saveData();
  renderLearningProgress();
  showToast(completed ? `获得勋章：${stageBadges[stageKey]}` : `已取消：${stageBadges[stageKey]}`);
}

function renderProjectList() {
  const list = document.querySelector("#project-list");

  if (!list) {
    return;
  }

  list.innerHTML = appData.projects
    .map((project) => {
      const unfinished = getUnfinishedActionCount(project);
      const stageProgress = getStageProgress(project);
      const suggestYellow = shouldSuggestYellow(project);
      const activeClass = project.id === activeProjectId ? " active" : "";

      return `
        <article class="project-card${activeClass}" data-project-id="${project.id}">
          <button class="project-card-main" data-project-switch="${project.id}" type="button">
            <strong>${escapeHtml(project.name)}</strong>
            <span>${stages[project.stage].title}</span>
            <small class="project-status ${project.status}">
              <i></i>${statusFocus[project.status].label}
            </small>
            <small>${unfinished} 个训练动作待完成</small>
            ${stageProgress.isOverdue ? `<small class="project-overdue-count">${suggestYellow ? "建议改 Yellow" : "学习节奏偏慢"}</small>` : ""}
          </button>
          <button class="project-delete" data-project-delete="${project.id}" type="button" aria-label="删除 ${escapeHtml(project.name)}">×</button>
        </article>
      `;
    })
    .join("");
}

function renderSelfTestPanel(stageKey) {
  const questions = selfTestBank[stageKey] || [];

  return `
    <details class="self-test-panel">
      <summary>自测题</summary>
      <div class="self-test-list">
        ${questions
          .map(
            (item, questionIndex) => `
              <fieldset class="self-test-question">
                <legend>${questionIndex + 1}. ${escapeHtml(item.question)}</legend>
                ${item.options
                  .map(
                    (option, optionIndex) => `
                      <label>
                        <input name="${item.id}" type="radio" value="${optionIndex}" />
                        <span>${escapeHtml(option)}</span>
                      </label>
                    `,
                  )
                  .join("")}
              </fieldset>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function renderCaseSimulation(project) {
  const caseProfile = trainingCaseProfiles[inferCaseId(project)];

  if (!caseProfile) {
    return `
      <section class="case-simulation-panel custom-case-simulation">
        <div class="case-simulation-heading">
          <p class="eyebrow">场景模拟</p>
          <h4>自定义案例还没有干系人脚本</h4>
          <p>自定义案例只适合带教 PM 补充材料后使用。新人初学建议先练 3 个内置案例，因为它们已经提供客户、销售、技术和管理层反应。</p>
        </div>
        <div class="simulation-empty-guide">
          <strong>如果要补成可训练案例，请至少写清：</strong>
          <ul>
            <li>客户怎么表达诉求或施压。</li>
            <li>售前是否有口头承诺或范围灰区。</li>
            <li>技术、设计、测试分别担心什么。</li>
            <li>老板或商务关注时间、成本、回款还是客户关系。</li>
          </ul>
        </div>
      </section>
    `;
  }

  return `
    <section class="case-simulation-panel">
      <div class="case-simulation-heading">
        <p class="eyebrow">场景模拟</p>
        <h4>${escapeHtml(caseProfile.title)}</h4>
        <p>${escapeHtml(caseProfile.background)}</p>
      </div>
      <div class="learner-role">
        <strong>你的角色</strong>
        <span>${escapeHtml(caseProfile.learnerRole)}</span>
      </div>
      <div class="stakeholder-grid" aria-label="主要干系人反应">
        ${caseProfile.stakeholders
          .map(
            ([role, quote]) => `
              <article class="stakeholder-card">
                <strong>${escapeHtml(role)}</strong>
                <p>${escapeHtml(quote)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="case-coaching-grid">
        <article>
          <h5>容易踩的坑</h5>
          <ul>${listItems(caseProfile.traps.map(escapeHtml))}</ul>
        </article>
        <article>
          <h5>本轮应产出</h5>
          <p>${escapeHtml(caseProfile.expectedOutput)}</p>
        </article>
      </div>
    </section>
  `;
}

function renderStageGate(stageKey) {
  const project = getActiveProject();
  const template = stageGateTemplates[stageKey];
  const checks = template.checks;
  const progress = getStageProgress(project);
  const suggestYellow = shouldSuggestYellow(project);
  const progressPercent = getDisplayedStageProgress(project, stageKey);
  const manualProgress = getManualStageProgress(project, stageKey);
  const progressMode = manualProgress === null ? "自动计算" : "手动修正";

  return `
    <div class="detail-box stage-gate-box simple-stage-gate">
      <div class="stage-gate-heading">
        <div>
          <h3>${stages[stageKey].title}阶段通关检查</h3>
          <p>确认你是否掌握了当前阶段的关键判断和标准动作。</p>
        </div>
        <span>通关标准</span>
      </div>
      <div class="stage-progress-box${progress.isOverdue ? " overdue" : ""}">
        <div>
          <strong>阶段进度</strong>
          <span>${progressMode} · 练习动作 40% + 阶段门 40% + 自测题 20% · 已用 ${progress.usedDays} 天 / 建议 ${progress.expectedDays} 天</span>
        </div>
        <div class="stage-progress-control">
          <input data-stage-progress="${stageKey}" data-progress-control="range" type="range" min="0" max="100" value="${progressPercent}" />
          <label>
            <input data-stage-progress="${stageKey}" data-progress-control="number" type="number" min="0" max="100" value="${progressPercent}" />
            <span>%</span>
          </label>
        </div>
        ${progress.isOverdue ? `<p>这个阶段学习时间已经偏长，建议回看资料库和自测解析。${suggestYellow ? "如果案例风险已变高，可以练习把状态改为 Yellow。" : ""}</p>` : ""}
      </div>
      <div class="simple-gate-list">
        ${checks
          .map(
            (item) => `
              <label class="gate-check-item">
                <input data-gate-check="${stageKey}" data-gate-id="${item.id}" type="checkbox" ${project && project.stageChecks[item.id] ? "checked" : ""} />
                <span>
                  <strong>${item.text}</strong>
                </span>
              </label>
            `,
          )
          .join("")}
      </div>
      ${renderSelfTestPanel(stageKey)}
    </div>
  `;
}

function renderStage(stageKey) {
  const stage = stages[stageKey];
  const panel = document.querySelector("#stage-panel");

  panel.innerHTML = `
	    <div class="stage-summary">
	      <p class="eyebrow">当前学习阶段</p>
	      <h2>${stage.title}</h2>
	      <p>${stage.goal}</p>
	      <div class="stage-meta">
	        ${stage.tags.map((tag) => `<span>${tag}</span>`).join("")}
	      </div>
		    </div>
		    <div class="stage-details">
		      ${renderStageGate(stageKey)}
		    </div>
		  `;
}

function renderDailyWorkbench() {
  const output = document.querySelector("#daily-output");
  const project = getActiveProject();

  if (!project || !output) {
    return;
  }

  const stage = stages[project.stage];
  const status = statusFocus[project.status];
  const stageProgress = getStageProgress(project);
  const suggestYellow = shouldSuggestYellow(project);
  const actionItems = getProjectActionItems(project);
  const totalMinutes = getActionTotalMinutes(actionItems);
  const actionListHtml = actionItems
    .map((item) => {
      const itemStatus = getActionStatus(project, item.id);

      return `
        <div class="today-action-item">
          <input data-today-action="${item.id}" type="checkbox" ${itemStatus.completed ? "checked" : ""} />
          <span>
            <strong>${item.text}</strong>
            ${item.source === "custom" ? `<em>自定义练习</em>` : ""}
          </span>
          <small>${item.time}</small>
        </div>
      `;
    })
    .join("");

  output.innerHTML = `
    <article class="daily-result-summary today-action-panel ${project.status}">
      <div class="today-panel-header">
        <div>
          <span>${escapeHtml(project.name)}</span>
          <h3>今日训练任务</h3>
          <div class="today-project-meta">
            <strong>${stage.title}</strong>
            <small class="project-status ${project.status}"><i></i>${status.label}</small>
            <small>案例练习进度</small>
          </div>
        </div>
        <div class="today-panel-actions">
          <button class="copy-button secondary-copy" id="edit-stage-status" type="button">调整练习难度</button>
        </div>
      </div>
      <div class="stage-status-editor" id="stage-status-editor" hidden>
        <label>
          <span>练习阶段</span>
          <select id="project-stage-select">
            ${Object.entries(stages).map(([key, item]) => `<option value="${key}" ${project.stage === key ? "selected" : ""}>${item.title}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>风险状态</span>
          <select id="project-status-select">
            ${Object.entries(statusFocus).map(([key, item]) => `<option value="${key}" ${project.status === key ? "selected" : ""}>${item.label}</option>`).join("")}
          </select>
        </label>
      </div>
      ${renderCaseSimulation(project)}
      <div class="today-action-list">
        <p class="today-time-summary">
          建议训练总耗时：${totalMinutes} 分钟。勾选只记录个人学习进度，不代表真实项目推进。
        </p>
        ${
          stageProgress.isOverdue
            ? `<div class="stage-overdue-warning">
                <p>这个阶段学习时间偏长，建议先看自测解析再继续。${suggestYellow ? "如果案例风险已经升高，可以练习改为 Yellow。" : ""}</p>
              </div>`
            : ""
        }
        ${actionListHtml}
      </div>
      <button class="copy-button" id="copy-current-daily" type="button">复制今日训练记录</button>
    </article>
  `;
}

function getCurrentDailyActionText() {
  const project = getActiveProject();

  if (!project) {
    return "";
  }

  const stage = stages[project.stage];
  const status = statusFocus[project.status];
  const actions = getProjectActionItems(project);
  const header = `练习案例：${project.name} | 阶段：${stage.title} | 状态：${status.label}`;
  const actionLines = actions.map((item) => {
    const itemStatus = getActionStatus(project, item.id);
    const doneLabel = itemStatus.completed ? "已练习" : "待练习";
    return `- [${doneLabel}] ${item.text}（${item.time}）`;
  });

  return [header, ...actionLines].join("\n");
}

function renderStageRuleModal() {
  const content = document.querySelector("#stage-rule-content");

  if (!content) {
    return;
  }

  content.innerHTML = `
    <p class="eyebrow">阶段判断</p>
    <h2 id="stage-rule-title">如何判断案例属于哪个阶段</h2>
    <div class="status-rule-list">
      ${Object.values(stageRules)
        .map(
          (rule) => `
            <article class="modal-rule-block">
              <span>${rule.title}</span>
              <h3>${rule.question}</h3>
              <p>${rule.standard}</p>
              <h4>常见灰色状态</h4>
              <p>${rule.gray}</p>
              <h4>建议处理</h4>
              <p>${rule.action}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function openStageRuleModal() {
  const modal = document.querySelector("#stage-rule-modal");

  if (!modal) {
    return;
  }

  renderStageRuleModal();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeStageRuleModal() {
  const modal = document.querySelector("#stage-rule-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function renderStatusRuleModal() {
  const content = document.querySelector("#status-rule-content");

  if (!content) {
    return;
  }

  content.innerHTML = `
    <p class="eyebrow">状态判断</p>
    <h2 id="status-rule-title">Green / Yellow / Red 怎么选</h2>
    <div class="status-rule-list">
      ${statusRules
        .map(
          (rule) => `
            <article class="modal-rule-block ${rule.key}">
              <span>${rule.label}</span>
              <h3>${rule.title}</h3>
              <p>${rule.standard}</p>
              <h4>适用情况</h4>
              <ul>${listItems(rule.useWhen)}</ul>
              <h4>PM 动作</h4>
              <p>${rule.action}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function openStatusRuleModal() {
  const modal = document.querySelector("#status-rule-modal");

  if (!modal) {
    return;
  }

  renderStatusRuleModal();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeStatusRuleModal() {
  const modal = document.querySelector("#status-rule-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function openLearningRoadmapModal() {
  const modal = document.querySelector("#learning-roadmap-modal");

  if (!modal) {
    return;
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeLearningRoadmapModal() {
  const modal = document.querySelector("#learning-roadmap-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function renderSelfTests() {
  const selfTestContainer = document.querySelector("#reference-self-tests");

  if (!selfTestContainer) {
    return;
  }

  const project = getActiveProject();

  selfTestContainer.innerHTML = Object.entries(selfTestBank)
    .map(([stageKey, questions]) => {
      const completedCount = project ? getCompletedSelfTestCount(project, stageKey) : 0;

      return `
        <article class="modal-rule-block self-test-reference-block">
          <span>${stages[stageKey].title} · 已完成 ${completedCount}/${questions.length}</span>
          ${questions
            .map((item, index) => {
              const record = project ? getSelfTestAnswerRecord(project, stageKey, item.id) : null;
              const selected = record ? record.selected : "";
              const isAnswered = Boolean(record && record.selected);
              const isCorrect = Boolean(record && record.correct);

              return `
                <fieldset class="self-test-answer${isAnswered ? " answered" : ""}${isAnswered && isCorrect ? " correct" : ""}${isAnswered && !isCorrect ? " incorrect" : ""}">
                  <legend>${index + 1}. ${escapeHtml(item.question)}</legend>
                  <div class="self-test-option-list">
                    ${item.options
                      .map((option) => {
                        const optionText = option.replace(/^[A-D]\.?\s*/, "");
                        const optionValue = option.slice(0, 1);
                        const inputId = `${item.id}-${optionValue}`;

                        return `
                          <label class="self-test-option" for="${inputId}">
                            <input
                              id="${inputId}"
                              type="radio"
                              name="${item.id}"
                              value="${escapeHtml(optionValue)}"
                              data-self-test-stage="${stageKey}"
                              data-self-test-question="${item.id}"
                              ${selected === optionValue ? "checked" : ""}
                            />
                            <strong>${escapeHtml(optionValue)}</strong>
                            <span>${escapeHtml(optionText)}</span>
                          </label>
                        `;
                      })
                      .join("")}
                  </div>
                  ${
                    isAnswered
                      ? `
                        <div class="self-test-feedback ${isCorrect ? "correct" : "incorrect"}">
                          <strong>${isCorrect ? "回答正确" : `回答不正确，正确答案是 ${escapeHtml(item.answer)}`}</strong>
                          <p>${escapeHtml(item.explanation)}</p>
                        </div>
                      `
                      : `<p class="self-test-prompt">选择一个答案后，将显示结果和解析，并计入学习进度。</p>`
                  }
                </fieldset>
              `;
            })
            .join("")}
        </article>
      `;
    })
    .join("");
}

function setupSelfTests() {
  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-self-test-question]")) {
      return;
    }

    const project = getActiveProject();

    if (!project) {
      return;
    }

    saveSelfTestAnswer(
      project,
      event.target.dataset.selfTestStage,
      event.target.dataset.selfTestQuestion,
      event.target.value,
    );
    renderSelfTests();
    renderLearningProgress();
    showToast("自测题记录已更新");
  });
}

function renderReferenceRules() {
  const stageRuleContainer = document.querySelector("#reference-stage-rules");
  const statusRuleContainer = document.querySelector("#reference-status-rules");

  if (stageRuleContainer) {
    stageRuleContainer.innerHTML = Object.values(stageRules)
      .map(
        (rule) => `
          <article class="modal-rule-block">
            <span>${rule.title}</span>
            <h4>${rule.question}</h4>
            <p>${rule.standard}</p>
            <strong>常见灰色状态</strong>
            <p>${rule.gray}</p>
            <strong>建议处理</strong>
            <p>${rule.action}</p>
          </article>
        `,
      )
      .join("");
  }

  if (statusRuleContainer) {
    statusRuleContainer.innerHTML = statusRules
      .map(
        (rule) => `
          <article class="modal-rule-block ${rule.key}">
            <span>${rule.label}</span>
            <h4>${rule.title}</h4>
            <p>${rule.standard}</p>
            <strong>适用情况</strong>
            <ul>${listItems(rule.useWhen)}</ul>
            <strong>PM 动作</strong>
            <p>${rule.action}</p>
          </article>
        `,
      )
      .join("");
  }

  renderSelfTests();
}

function openReferenceDrawer() {
  const drawer = document.querySelector("#reference-drawer");

  if (!drawer) {
    return;
  }

  renderReferenceRules();
  drawer.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
}

function closeReferenceDrawer() {
  const drawer = document.querySelector("#reference-drawer");

  if (!drawer) {
    return;
  }

  drawer.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}

function setActiveStage(stageKey) {
  const project = getActiveProject();

  if (project) {
    project.stage = stageKey;
    ensureStageStartDate(project, stageKey);
    touchProject(project);
  }

  document.querySelectorAll(".workbench-stage").forEach((button) => {
    button.classList.toggle("active", button.dataset.dailyStage === stageKey);
  });

  renderStage(stageKey);
  renderDailyWorkbench();
  renderProjectList();
  renderLearningProgress();
}

function setActiveStatus(statusKey) {
  const project = getActiveProject();

  if (project) {
    project.status = statusKey;
    touchProject(project);
  }

  document.querySelectorAll(".workbench-status").forEach((button) => {
    button.classList.toggle("active", button.dataset.dailyStatus === statusKey);
  });

  renderStage(project.stage);
  renderDailyWorkbench();
  renderProjectList();
  renderLearningProgress();
}

function switchProject(projectId) {
  const project = appData.projects.find((item) => item.id === projectId);

  if (!project) {
    return;
  }

  if (resetStaleTodayActions(project)) {
    saveData();
  }

  if (ensureStageStartDate(project, project.stage)) {
    saveData();
  }

  activeProjectId = project.id;
  document.querySelectorAll(".workbench-stage").forEach((button) => {
    button.classList.toggle("active", button.dataset.dailyStage === project.stage);
  });
  document.querySelectorAll(".workbench-status").forEach((button) => {
    button.classList.toggle("active", button.dataset.dailyStatus === project.status);
  });
  renderProjectList();
  renderStage(project.stage);
  renderDailyWorkbench();
  renderLearningProgress();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function setupDailyWorkbench() {
  const stageButtons = document.querySelectorAll(".workbench-stage");
  const statusButtons = document.querySelectorAll(".workbench-status");

  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveStage(button.dataset.dailyStage);
    });
  });

  statusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveStatus(button.dataset.dailyStatus);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#edit-stage-status")) {
      const editor = document.querySelector("#stage-status-editor");

      if (editor) {
        editor.hidden = !editor.hidden;
      }
    }

    if (event.target.closest("#generate-weekly-report")) {
      openWeeklyReportModal();
    }

    if (event.target.closest("#close-weekly-report")) {
      closeWeeklyReportModal();
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-project-business-field]")) {
      const project = getActiveProject();

      if (!project) {
        return;
      }

      project[event.target.dataset.projectBusinessField] = event.target.value.trim();
      saveData();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("#project-stage-select")) {
      setActiveStage(event.target.value);
    }

    if (event.target.matches("#project-status-select")) {
      setActiveStatus(event.target.value);
    }

    if (event.target.matches("[data-project-business-field]")) {
      const project = getActiveProject();

      if (!project) {
        return;
      }

      project[event.target.dataset.projectBusinessField] = event.target.value.trim();
      saveData();
    }
  });

  document.addEventListener("submit", (event) => {
    if (!event.target.matches("#custom-action-form")) {
      return;
    }

    event.preventDefault();
    const project = getActiveProject();
    const input = document.querySelector("#custom-action-input");
    const text = input ? input.value.trim() : "";

    if (!project || !text) {
      return;
    }

    addCustomAction(project, text);
  });
}

function setupLearningProgress() {
  document.addEventListener("click", (event) => {
    const completeButton = event.target.closest("[data-learning-complete]");

    if (!completeButton) {
      return;
    }

    toggleLearningStageComplete(completeButton.dataset.learningComplete);
  });
}

function setupStageGate() {
  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-stage-progress]")) {
      const project = getActiveProject();

      if (!project) {
        return;
      }

      const stageKey = event.target.dataset.stageProgress;
      const progress = clampStageProgress(event.target.value);
      setManualStageProgress(project, stageKey, progress);
      syncStageProgressControls(stageKey, progress);
      renderLearningProgress();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-stage-progress]")) {
      const project = getActiveProject();

      if (!project) {
        return;
      }

      const stageKey = event.target.dataset.stageProgress;
      const progress = clampStageProgress(event.target.value);
      setManualStageProgress(project, stageKey, progress);
      syncStageProgressControls(stageKey, progress);
      renderLearningProgress();
    }

    if (event.target.matches("[data-gate-check]")) {
      const project = getActiveProject();
      if (project) {
        project.stageChecks[event.target.dataset.gateId] = event.target.checked;
        touchProject(project);
        renderStage(project.stage);
        renderProjectList();
        renderLearningProgress();
      }
    }

    if (event.target.matches("[data-today-action]")) {
      const project = getActiveProject();
      if (project) {
        const action = getProjectActionItems(project).find((item) => item.id === event.target.dataset.todayAction);
        setActionStatus(project, event.target.dataset.todayAction, {
          completed: event.target.checked,
          actionText: action ? action.text : "",
        });
        touchProject(project);
        renderStage(project.stage);
        renderDailyWorkbench();
        renderProjectList();
        renderLearningProgress();
      }
    }
  });

}

function setupProjects() {
  const createButton = document.querySelector("#create-project");
  const list = document.querySelector("#project-list");

  if (createButton) {
    createButton.addEventListener("click", () => {
      const name = window.prompt("请输入自定义练习案例名称（建议由带教 PM 补充干系人脚本）");
      const trimmedName = name ? name.trim() : "";

      if (!trimmedName) {
        return;
      }

      const project = createProject(trimmedName);
      appData.projects.push(project);
      activeProjectId = project.id;
      saveData();
      switchProject(project.id);
    });
  }

  if (list) {
    list.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-project-delete]");
      const switchButton = event.target.closest("[data-project-switch]");

      if (deleteButton) {
        const projectId = Number(deleteButton.dataset.projectDelete);
        const project = appData.projects.find((item) => item.id === projectId);

        if (!project) {
          return;
        }

        if (!window.confirm(`确认删除「${project.name}」吗？`)) {
          return;
        }

        appData.projects = appData.projects.filter((item) => item.id !== projectId);

        if (!appData.projects.length) {
          appData.projects.push(createTrainingCases()[0]);
        }

        activeProjectId = appData.projects[0].id;
        saveData();
        switchProject(activeProjectId);
        return;
      }

      if (switchButton) {
        switchProject(Number(switchButton.dataset.projectSwitch));
      }
    });
  }
}

function setupStageRuleModal() {
  const openButton = document.querySelector("#open-stage-rule");
  const closeButton = document.querySelector("#close-stage-rule");
  const modal = document.querySelector("#stage-rule-modal");

  if (openButton) {
    openButton.addEventListener("click", openStageRuleModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeStageRuleModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeStageRuleModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeStageRuleModal();
      closeStatusRuleModal();
    }
  });
}

function setupStatusRuleModal() {
  const openButton = document.querySelector("#open-status-rule");
  const closeButton = document.querySelector("#close-status-rule");
  const modal = document.querySelector("#status-rule-modal");

  if (openButton) {
    openButton.addEventListener("click", openStatusRuleModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeStatusRuleModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeStatusRuleModal();
      }
    });
  }
}

function setupLearningRoadmapModal() {
  const openButton = document.querySelector("#open-learning-roadmap");
  const closeButton = document.querySelector("#close-learning-roadmap");
  const modal = document.querySelector("#learning-roadmap-modal");

  if (openButton) {
    openButton.addEventListener("click", openLearningRoadmapModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeLearningRoadmapModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeLearningRoadmapModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLearningRoadmapModal();
    }
  });
}

function setupReferenceDrawer() {
  const drawer = document.querySelector("#reference-drawer");
  const closeButton = document.querySelector("#close-reference");

  document.addEventListener("click", (event) => {
    if (event.target.closest("#open-reference, .open-reference-trigger")) {
      openReferenceDrawer();
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeReferenceDrawer);
  }

  if (drawer) {
    drawer.addEventListener("click", (event) => {
      if (event.target === drawer) {
        closeReferenceDrawer();
      }
    });
  }

  const weeklyReportModal = document.querySelector("#weekly-report-modal");

  if (weeklyReportModal) {
    weeklyReportModal.addEventListener("click", (event) => {
      if (event.target === weeklyReportModal) {
        closeWeeklyReportModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeReferenceDrawer();
      closeWeeklyReportModal();
    }
  });
}

function setupCopyButtons() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-button");

    if (!button) {
      return;
    }

    if (button.classList.contains("open-reference-trigger")) {
      return;
    }

    if (["create-project", "edit-stage-status"].includes(button.id)) {
      return;
    }

    const content =
      button.id === "copy-weekly-report"
        ? getWeeklyReportText()
        : button.id === "copy-current-daily"
        ? getCurrentDailyActionText()
        : copyContent[button.dataset.copyTarget];

    if (!content) {
      showToast("未找到可复制内容");
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      showToast("已复制，可以粘贴使用");
    } catch (error) {
      showToast("复制失败，请手动选中文字复制");
    }
  });
}

loadData();
renderLearningProgress();
setupLearningProgress();
setupSelfTests();
setupProjects();
switchProject(activeProjectId);
setupDailyWorkbench();
setupStageGate();
setupLearningRoadmapModal();
setupReferenceDrawer();
setupCopyButtons();
