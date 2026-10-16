/** 开场漫画过场 */
const PROLOGUE_DATA = {
  title: '遗落的屏幕',
  subtitle: '— 林雨失踪事件 —',
  panels: [
    {
      image: null,
      bg: '#000',
      speaker: null,
      text: '3月15日，凌晨 3:17。\n平面设计师林雨，在地下停车场失联。\n她是翡翠湾一个月内第四名失踪的年轻女性。\n至今，已经三天。',
      style: 'title-card',
    },
    {
      image: 'assets/prologue/prologue-1-package.jpg',
      speaker: '旁白',
      text: '三天后的傍晚，你收到一个快递。\n里面是林雨留下的笔记本电脑——\n屏幕还亮着，像是从未关过机。',
    },
    {
      image: 'assets/prologue/prologue-2-worried-friend.jpg',
      speaker: '阿瑶（林雨的闺蜜）',
      text: '「雨雨失踪三天了……这个月已经有四个人在停车场出事了。」\n「警察说是连环案，但什么都查不出来。我不敢一个人看她的电脑。」\n「拜托你，帮我找出她到底经历了什么——还有，下一个会不会是我们？」',
    },
    {
      image: 'assets/prologue/prologue-3-linyu.jpg',
      speaker: '旁白',
      text: '林雨，26岁，独居在翡翠湾。\n一个月前她和同事陈默分手。\n之后她开始失眠，总觉得有人在暗处看着她。',
    },
    {
      image: 'assets/prologue/prologue-4-stalker.jpg',
      speaker: '旁白',
      text: '陈默不肯放手。\n他曾以「公司安全软件」为名，在林雨电脑里安装了监控程序——【幽影】。\n林雨试图删除证据、躲开他，但恐惧越来越深……',
    },
    {
      image: 'assets/prologue/prologue-5-laptop.jpg',
      speaker: '旁白',
      text: '现在，这台电脑在你手中。\n登录系统，查看她的邮件、讯息、相册和文件。\n还原她失联前最后的几个小时。',
    },
    {
      image: null,
      bg: '#0a0a12',
      speaker: null,
      text: '',
      style: 'mission-card',
      mission: {
        title: '调查目标',
        items: [
          '登录林雨的电脑，按「调查手记」中的任务清单逐步推进',
          '使用线索墙、日历、浏览器追查连环失踪案',
          '解锁监控回放，查看 B2 停车场事发画面',
          '在相册、手机业主群与私密文件中还原真相',
          '揭开【幽影】与「第七次」背后真正的凶手',
        ],
        hint: '登录密码藏在物业单里。完成每项任务后，调查手记会自动更新进度与下一项提示。',
      },
    },
  ],
};

const STORY_JOURNAL = {
  overview: `【案件概述】
林雨，26岁平面设计师，3月15日凌晨在翡翠湾 B2 停车场失联。
她是近一个月内该小区第四名失踪的年轻女性——警方内部称「翡翠湾连环失踪案」。

【已知受害者（部分）】
• 方晓 — 2月22日 03:12 · 幼师
• 赵婷 — 3月1日 03:09 · 外卖员
• 周岚 — 3月8日 03:14 · 护士（业主群流传，警方未证实）
• 林雨 — 3月15日 03:17 · 本案当事人

【人物关系】
• 林雨 — 最新受害者，独居 A栋1024
• 陈默 — 前男友/恒瑞科技安全组，有不在场证明，但与多起案件间接相关
• 阿瑶 — 林雨闺蜜，委托你调查

【你的任务】
按下方任务清单调查。每完成一项，故事与线索会自动更新。`,
  clues: [
    { id: 'desktop-login', text: '电脑密码与她的门牌号有关' },
    { id: 'encrypted', text: '私密文件夹：陈默邮件里的号码 + 她的名字拼音' },
    { id: 'phone', text: '手机锁屏：失联那天的月日（四位数字）' },
    { id: 'shadow', text: '幽影应用：密码与林雨梦中「下楼」的层数有关' },
  ],
};

const STORY_CHAPTERS = [
  {
    id: 'ch-login',
    title: '第一章 · 遗落的屏幕',
    check: s => s.loggedIn,
    content: '你打开了林雨的电脑。屏幕上的时间停在 3月13日——她失联前两天。桌面整洁，但邮件图标上有未读提示。阿瑶说：先弄清她和陈默之间到底发生了什么。',
  },
  {
    id: 'ch-chenmo',
    title: '第二章 · 纠缠',
    check: s => s.milestones?.includes('read-chenmo-mail') || s.visitedUrls?.includes('https://hengrui-tech.com/about/team'),
    content: '陈默是林雨的前男友，恒瑞科技安全组工程师。分手后他不断骚扰，还在她电脑里装了监控软件「幽影」。邮件里提到 B2 储物柜「748」号——这个数字反复出现。',
  },
  {
    id: 'ch-news',
    title: '第三章 · 停车场',
    check: s => s.visitedUrls?.includes('https://news.citydaily.cn/local/2024/0315-missing'),
    content: '3月15日凌晨，林雨在翡翠湾 B2 停车场失联。新闻称监控在事发时段有维护空白。邻居说她最近总觉得自己被盯着。警方把陈默列为关系人，但尚未定性。',
  },
  {
    id: 'ch-serial',
    title: '第三章 · 连环失踪',
    check: s => s.visitedUrls?.includes('https://news.citydaily.cn/local/2024/serial-missing'),
    content: '这不是第一起。方晓、赵婷、周岚——均在 B2 停车场凌晨 3 点前后失联，间隔约 7 天。共同点：年轻女性、监控空白、现场留下手机、后视镜或玻璃上有「第二张脸」的传闻。林雨在失踪前已独自调查此案。',
  },
  {
    id: 'ch-pattern',
    title: '第四章 · 七天规律',
    check: s => s.viewedFiles?.includes('case-compare') || s.milestones?.includes('found-pattern'),
    content: '案件对比表显示：每 7 天一人，均在「第 7 分钟」前后（03:0X）。未知邮件写道「数到第六次，第七次去找你」——林雨正是第七个目标。但陈默有航班不在场证明，真正的凶手可能根本不是「人」。',
  },
  {
    id: 'ch-shadow',
    title: '第五章 · 幽影',
    check: s => s.visitedUrls?.includes('file:///shadow-readme.html') || s.visitedUrls?.includes('https://hengrui-tech.com/products/security'),
    content: '「幽影」能录屏、开摄像头、同步到 shadow-7.local。林雨在备忘录里写道：卸载需要管理员密码，和安装时设的「层级」有关。她反复梦见下楼，到第七层看见自己的背影。',
  },
  {
    id: 'ch-alibi',
    title: '第六章 · 不在场',
    check: s => s.visitedUrls?.includes('https://flights.example.cn/track/CA1832'),
    content: '航班记录显示：陈默 3月15日 06:40 从上海飞往深圳，失联时刻他已在飞机上。他有不在场证明——但停车场照片里的人影，体型仍与他一致。',
  },
  {
    id: 'ch-phone',
    title: '第七章 · 最后的手机',
    check: s => s.phoneUnlocked,
    content: '手机里只剩一张未删照片：IMG_0315，拍摄于 3月15日 03:17。语音备忘录里，林雨在数数——「六」之后，是一个令人不寒而栗的「七」。',
  },
  {
    id: 'ch-truth',
    title: '终章 · 镜中人',
    check: s => s.shadowUnlocked,
    content: '幽影的日志显示：拍照时检测到「第二张人脸」。连环案的真相同步揭晓——每一位受害者都在镜中见过「自己」，而那个倒影会取代本人走出停车场。林雨是第七个。而你正在查看的这台电脑……是第八个诱饵。',
  },
];

function isChapterUnlocked(chapter, state) {
  return chapter.check(state);
}
