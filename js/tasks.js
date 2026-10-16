/** 调查任务 — 驱动玩法与悬疑节奏 */
const INVESTIGATION_TASKS = [
  {
    id: 'task-login',
    phase: '序章',
    title: '登录林雨的电脑',
    hint: '包裹里的物业单复印件上有门牌号',
    check: s => s.loggedIn,
  },
  {
    id: 'task-chenmo',
    phase: '第一章',
    title: '弄清陈默与林雨的关系',
    hint: '阅读陈默发来的威胁邮件，并查看讯息记录',
    check: s => s.milestones?.includes('read-chenmo-mail'),
  },
  {
    id: 'task-linyu-news',
    phase: '第二章',
    title: '还原林雨失联当晚',
    hint: '在浏览器历史中打开「停车场失联」新闻',
    check: s => s.visitedUrls?.includes('https://news.citydaily.cn/local/2024/0315-missing'),
  },
  {
    id: 'task-serial',
    phase: '第三章',
    title: '调查翡翠湾连环失踪案',
    hint: '从林雨案新闻点击相关链接，或搜索「翡翠湾 连环失踪」',
    check: s => s.visitedUrls?.includes('https://news.citydaily.cn/local/2024/serial-missing'),
  },
  {
    id: 'task-caseboard',
    phase: '第三章',
    title: '查看线索墙上的四名受害者',
    hint: '打开桌面「线索墙」，点击每张照片阅读林雨的备注',
    check: s => s.milestones?.includes('caseboard-all-victims'),
  },
  {
    id: 'task-cctv',
    phase: '第三章',
    title: '回放 B2 停车场监控',
    hint: '追查连环案后解锁「监控回放」，播放到最后一帧',
    check: s => s.milestones?.includes('cctv-glitch-seen'),
  },
  {
    id: 'task-pattern',
    phase: '第三章',
    title: '比对多名受害者的共同规律',
    hint: '解锁私密文件夹，阅读「案件对比表」',
    check: s => s.viewedFiles?.includes('case-compare') || s.milestones?.includes('found-pattern'),
  },
  {
    id: 'task-shadow-info',
    phase: '第四章',
    title: '追查监控软件「幽影」',
    hint: '浏览恒瑞科技产品页，或打开本地幽影说明文档',
    check: s => s.visitedUrls?.includes('file:///shadow-readme.html') ||
      s.visitedUrls?.includes('https://hengrui-tech.com/products/security'),
  },
  {
    id: 'task-alibi',
    phase: '第四章',
    title: '核实陈默的不在场证明',
    hint: '在百度搜索陈默航班，查看 CA1832 舱单',
    check: s => s.visitedUrls?.includes('https://flights.example.cn/track/CA1832'),
  },
  {
    id: 'task-encrypted',
    phase: '第五章',
    title: '解锁林雨的私密档案',
    hint: '密码：陈默邮件里的号码 + 林雨名字拼音',
    check: s => s.encryptedUnlocked,
  },
  {
    id: 'task-phone',
    phase: '第五章',
    title: '检查林雨的手机',
    hint: '锁屏密码是失联那天的月日（四位数字）',
    check: s => s.phoneUnlocked,
  },
  {
    id: 'task-shadow',
    phase: '终章',
    title: '揭开幽影后台的最终记录',
    hint: '密码与林雨梦中「下楼」的层数有关',
    check: s => s.shadowUnlocked,
  },
];

const SERIAL_VICTIMS = [
  { name: '方晓', date: '2月22日 03:12', job: '幼师', unit: 'A栋605', note: '后视镜里拍到第二张脸，监控缺失23分钟' },
  { name: '赵婷', date: '3月1日 03:09', job: '外卖员', unit: '常至B2取餐', note: '手机相册最后一张为自拍，背景是停车场' },
  { name: '周岚', date: '3月8日 03:14', job: '护士', unit: 'C栋802', note: '警方未公开，林雨从业主群截图整理' },
  { name: '林雨', date: '3月15日 03:17', job: '设计师', unit: 'A栋1024', note: '本案当事人，镜中人首次被幽影明确记录' },
];

function isTaskDone(task, state) {
  return task.check(state);
}

function getTaskProgress(state) {
  const tasks = INVESTIGATION_TASKS.map(t => ({ ...t, done: isTaskDone(t, state) }));
  const done = tasks.filter(t => t.done).length;
  return { tasks, done, total: tasks.length };
}

function getNextTaskHint(state) {
  const next = INVESTIGATION_TASKS.find(t => !isTaskDone(t, state));
  return next ? next.hint : null;
}
