/** 游戏数据与谜题配置 */
const GAME_DATA = {
  passwords: {
    desktop: '1024',
    encryptedFolder: 'linyu748',
    phone: '0315',
    shadowApp: ['第7层', '第七层', '7', '7层'],
  },

  desktopApps: [
    { id: 'journal', name: '调查手记', icon: '📋', color: '#e8a838' },
    { id: 'caseboard', name: '线索墙', icon: '📌', color: '#c44' },
    { id: 'calendar', name: '日历', icon: '📅', color: '#ff9500' },
    { id: 'mail', name: '邮件', icon: '✉️', color: '#4a9eff' },
    { id: 'messages', name: '讯息', icon: '💬', color: '#34c759' },
    { id: 'notes', name: '备忘录', icon: '📝', color: '#ffd60a' },
    { id: 'photos', name: '相册', icon: '🖼️', color: '#ff6b9d' },
    { id: 'browser', name: '浏览器', icon: '🌐', color: '#5ac8fa' },
    { id: 'cctv', name: '监控回放', icon: '📹', color: '#333', locked: true, unlockMilestone: 'visit-serial' },
    { id: 'files', name: '文件', icon: '📁', color: '#64d2ff' },
    { id: 'trash', name: '回收站', icon: '🗑️', color: '#8e8e93' },
    { id: 'settings', name: '设置', icon: '⚙️', color: '#aeaeb2' },
    { id: 'shadow', name: '???', icon: '👁️', color: '#ff3b30', locked: true },
  ],

  phoneApps: [
    { id: 'phone-messages', name: '信息', icon: '💬', iosBg: 'linear-gradient(180deg,#5edb5e,#28a828)' },
    { id: 'phone-community', name: '业主群', icon: '👥', iosBg: 'linear-gradient(180deg,#5ac8fa,#007aff)' },
    { id: 'phone-map', name: '地图', icon: '🗺️', iosBg: 'linear-gradient(180deg,#7ec8e3,#34aadc)' },
    { id: 'phone-voice', name: '语音备忘录', icon: '🎙️', iosBg: 'linear-gradient(180deg,#ff6b6b,#e03030)' },
    { id: 'phone-camera', name: '相机', icon: '📷', iosBg: 'linear-gradient(180deg,#8e8e93,#636366)' },
    { id: 'phone-gallery', name: '照片', icon: '🖼️', iosBg: 'linear-gradient(180deg,#fff176,#ffb300)' },
  ],

  caseboard: {
    victims: [
      { id: 'fangxiao', name: '方晓', date: '2月22日 03:12', job: '幼师 · A栋605', img: 'assets/caseboard/victim-fangxiao.png', rot: -2,
        detail: '第一名失联者。母亲称她失踪前说「电梯镜子里的人眨眼比她慢半拍」。监控缺失23分钟。' },
      { id: 'zhaoting', name: '赵婷', date: '3月1日 03:09', job: '外卖员', img: 'assets/caseboard/victim-zhaoting.png', rot: 1.5,
        detail: '手机遗留在 B2 车位旁。相册最后一张自拍，背景是停车场立柱——和陈默邮件提到的 B2 一致。' },
      { id: 'zhoulan', name: '周岚', date: '3月8日 03:14', job: '护士 · C栋802', img: 'assets/caseboard/victim-zhoulan.png', rot: -1,
        detail: '警方未公开。业主群有人看到她凌晨独自走向 B2。林雨在对比表中记录了她的案子。' },
      { id: 'linyu', name: '林雨', date: '3月15日 03:17', job: '设计师 · A栋1024', img: 'assets/caseboard/victim-linyu.png', rot: 2,
        detail: '本案当事人。幽影记录她在拍照时检测到「第二张人脸」。她是第七个目标。' },
    ],
    footer: '红线 = 每7天一人 · 均在 B2 · 均在 03:0X',
  },

  cctv: {
    cameras: [
      {
        id: 'b2-west',
        name: 'B2 西侧',
        frames: [
          { src: 'assets/cctv/cctv-b2-normal.jpg', time: '2024-03-14  02:58:11', label: '无异常' },
          { src: 'assets/cctv/cctv-b2-glitch.jpg', time: '2024-03-15  03:17:44', label: '检测到第二张人脸', creepy: true },
        ],
      },
    ],
  },

  calendar: {
    year: 2024,
    month: 3,
    monthLabel: '2024年3月',
    prevEvents: [{ date: '2月22日', label: '方晓失联', type: 'victim' }],
    days: [
      { day: 1, type: 'victim', label: '赵婷失联', detail: '3月1日 03:09，B2停车场。外卖员，手机遗留现场。' },
      { day: 8, type: 'victim', label: '周岚失联', detail: '3月8日 03:14，B2停车场。护士，业主群流传，警方未证实。' },
      { day: 10, type: 'note', label: '陈默威胁邮件', detail: '陈默发邮件提到 B2 储物柜 748 号。' },
      { day: 11, type: 'note', label: '改手机密码', detail: '林雨向阿瑶求助，锁屏改为 0315。' },
      { day: 13, type: 'note', label: '未知邮件', detail: '「数到第六次，第七次去找你。」' },
      { day: 15, type: 'victim', label: '林雨失联', detail: '3月15日 03:17，B2停车场。拍照 IMG_0315 后失联。' },
    ],
  },

  phoneCommunity: [
    { user: '605妈妈', avatar: '妈', time: '3月9日 08:12', text: '我女儿方晓2月22日就没了！！警察说是走失？？？' },
    { user: '1203王姐', avatar: '王', time: '3月9日 08:25', text: '又一个是赵婷，也是停车场……这个月好几起了，物业能不能加强巡逻？' },
    { user: '物业小王', avatar: '物', time: '3月9日 08:40', text: '请大家不要造谣，以警方通报为准。B2监控正在维护。' },
    { user: '阿瑶', avatar: '瑶', time: '3月12日 21:30', text: '雨雨最近很害怕，总说电梯镜子不对。有人遇到过吗？' },
    { user: 'C栋邻居', avatar: '邻', time: '3月13日 07:15', text: '昨晚B2有怪声，像有人在数数……一、二、三……', creepy: true },
    { user: '林雨', avatar: '雨', time: '3月14日 23:55', text: '我把调查资料贴在线索墙上了。如果我不在了，请帮我把对比表交给警察。', image: 'assets/maps/b2-parking-map.png' },
  ],

  mail: [
    {
      id: 'mail-1',
      from: '物业管理处',
      subject: '关于A栋1024室水电费通知',
      date: '3月12日',
      read: false,
      body: `尊敬的林雨女士：

您位于A栋<strong>1024</strong>室的本月水电费已出账，请于3月15日前缴纳。

如有疑问请联系前台，或访问
<a class="web-link" href="#">fcwy.com</a> 查询。

—— 翡翠湾物业`,
      clue: true,
    },
    {
      id: 'mail-2',
      from: '陈默 <chenmo@work.com>',
      subject: 'Re: 那天晚上的事',
      date: '3月10日',
      read: false,
      body: `林雨，我知道你在躲我。

地下停车场B2的监控我已经删了，但你别以为这样就结束了。
<strong>748</strong>号储物柜里的东西，你最好自己处理干净。

别再回公司了。`,
      flagged: true,
    },
    {
      id: 'mail-3',
      from: '妈妈',
      subject: '记得吃饭',
      date: '3月8日',
      read: true,
      body: `雨雨，好久没打电话了。你爸说梦见你在哭。

你从小怕黑，记得床头灯别关。
密码别再用生日了，不安全。

爱你，妈妈。`,
    },
    {
      id: 'mail-4',
      from: '未知发件人',
      subject: '你在看着我吗',
      date: '3月13日 03:17',
      read: false,
      body: `<span class="creepy-text">我已经数到第六次了。</span>

第七次的时候，我会去找你。

<span class="creepy-text">不要打开那个应用。</span>`,
      creepy: true,
    },
    {
      id: 'mail-5',
      from: '阿瑶',
      subject: 'Fwd: 你看到这个新闻了吗',
      date: '3月15日 10:22',
      read: false,
      body: `雨雨，你失踪的消息上新闻了……

我转发给你自己看（你肯定看不到）：
<a class="web-link" href="#">城市日报 · 停车场失联</a>

警察来问过陈默。他说那天出差了。
你千万别出事啊。`,
    },
    {
      id: 'mail-7',
      from: '城市日报订阅',
      subject: '翡翠湾连环失踪案专题推送',
      date: '3月14日 08:00',
      read: false,
      body: `您关注的关键词「翡翠湾」有新报道：

<strong>《翡翠湾连环失踪：一个月四名年轻女性，警方呼吁夜间勿独行》</strong>

摘要：2月22日起，翡翠湾 B2 停车场已发生 4 起年轻女性失联事件，间隔约 7 天，均在凌晨 3 时许。警方称正在排查，尚未锁定嫌疑人。

<a class="web-link" href="#">阅读专题报道 →</a>`,
    },
    {
      id: 'mail-6',
      from: '恒瑞科技 HR',
      subject: '离职手续提醒',
      date: '3月9日',
      read: true,
      body: `林雨女士：

您已提交离职申请。请于3月12日前归还公司设备。

另：IT部门检测到您电脑上有未授权软件，请联系陈默（安全组）协助卸载。

如有疑问请回复本邮件。`,
    },
  ],

  messages: [
    {
      contact: '阿瑶',
      avatar: '瑶',
      chats: [
        { from: 'them', text: '雨雨！！你怎么突然不回消息了', time: '3月11日 21:03' },
        { from: 'them', text: '陈默刚才给我打电话问你住址，我没说', time: '3月11日 21:05' },
        { from: 'me', text: '别告诉他任何事。我可能要换地方住。', time: '3月11日 21:12' },
        { from: 'me', text: '帮我把手机相册里3月15拍的那张删掉，求你了', time: '3月11日 21:14' },
        { from: 'them', text: '那张照片怎么了？？', time: '3月11日 21:16' },
        { from: 'me', text: '别问。锁屏我改成<strong>那个日子</strong>了，月日四位数，你记得的。', time: '3月11日 21:18' },
        { from: 'them', text: '……3月15？好，我记住了。你保重。', time: '3月11日 21:20' },
        { from: 'them', text: '方晓和赵婷你记得吗？业主群都在传，一个月四个人了……', time: '3月12日 09:10' },
        { from: 'me', text: '我在查。每7天一个，下一个可能就是15号。', time: '3月12日 09:15' },
        { from: 'them', text: '（三天后）雨雨，我把你电脑快递给帮忙的朋友了。密码物业单上有。拜托找出真相。', time: '3月18日 19:30' },
      ],
    },
    {
      contact: '陈默',
      avatar: '默',
      blocked: true,
      chats: [
        { from: 'them', text: '我知道你在看。', time: '3月13日 02:44' },
        { from: 'them', text: '748。你以为换个密码就安全了？', time: '3月13日 02:45' },
        { from: 'them', text: '<span class="creepy-text">我就在门外。</span>', time: '3月13日 02:46' },
        { from: 'them', text: '公司软件是为你好。别删。', time: '3月13日 02:48' },
      ],
    },
    {
      contact: '物业小王',
      avatar: '物',
      chats: [
        { from: 'them', text: '林女士，您的水电费还没缴哦', time: '3月13日 14:00' },
        { from: 'me', text: '好的，我这两天忙，网上查账单', time: '3月13日 14:22' },
        { from: 'them', text: '您可以在 fcwy.com 住户服务里查，房号登录', time: '3月13日 14:25' },
      ],
    },
  ],

  notes: [
    {
      title: '待办',
      date: '3月9日',
      content: `- 交水电费（物业网站查账单）
- 买安眠药
- 备份文件到加密文件夹
- 把陈默提过的那个号码记下来
- 查一下「第七层」是什么意思`,
    },
    {
      title: '奇怪的梦',
      date: '3月10日',
      content: `梦见自己站在一栋楼里，一层一层往下走。
每下一层，走廊的灯就暗一点。
到第七层的时候，看见了自己的背影。

醒来发现床头灯是关着的。我明明记得没关。`,
    },
    {
      title: '录音整理',
      date: '3月11日',
      content: `语音备忘录03: "如果你找到了这个，说明你已经看到了不该看的东西。"

"那个应用叫【幽影】，是陈默装的。别打开。"

"如果不得不打开——去翻「奇怪的梦」那条备忘录。她一直在数层数。"`,
    },
    {
      title: '调查笔记',
      date: '3月12日',
      content: `查了陈默的航班——他说明天去深圳出差。
恒瑞科技官网上写他3月14日起出差。

但3月13日凌晨，讯息里他说在门外。

到底哪个是真的？`,
    },
    {
      title: '手机密码备忘',
      date: '3月11日',
      content: `锁屏已改。不要用生日。
用失联那天——月+日，四位。
照片文件名也会用这个编号。`,
    },
    {
      title: '连环案调查',
      date: '3月12日',
      content: `方晓 2/22 → 赵婷 3/1 → 周岚 3/8 → 我 3/15？
每7天一人，全是 B2，全是凌晨3点出头。
陈默有航班记录，不可能是他亲手做的。
但幽影的数据……四个人电脑上都装过。

「第七次」——那封邮件是在数受害者人数吗？`,
    },
  ],

  photos: [
    {
      id: 'photo-1',
      title: '日常',
      date: '3月5日',
      src: 'assets/photos/photo-1-sunset.jpg',
      caption: '窗外的晚霞',
    },
    {
      id: 'photo-2',
      title: '公司聚餐',
      date: '3月7日',
      src: 'assets/photos/photo-2-dinner.jpg',
      caption: '陈默坐在角落，一直没说话',
    },
    {
      id: 'photo-3',
      title: 'IMG_0315',
      date: '3月15日 03:17',
      src: 'assets/photos/photo-3-parking.jpg',
      caption: '地下停车场B2',
      creepy: true,
      metadata: `拍摄时间: 2024-03-15 03:17:44
设备: iPhone
位置: B2停车场

备注: 镜子里有第二个人影`,
    },
    {
      id: 'photo-4',
      title: 'IMG_elevator',
      date: '3月14日 23:51',
      src: 'assets/photos/photo-4-mirror.jpg',
      caption: '电梯镜子自拍',
      creepy: true,
      unlockMilestone: 'visit-serial',
      metadata: `拍摄时间: 2024-03-14 23:51:08
位置: A栋电梯

备注: 镜子里的倒影…眨眼好像慢了一拍`,
    },
    {
      id: 'photo-5',
      title: 'B2入口',
      date: '3月12日',
      src: 'assets/photos/photo-5-b2-sign.jpg',
      caption: '停车场指示牌——她常走西侧入口',
    },
  ],

  browser: {
    history: [
      { title: '翡翠湾连环失踪案专题 - 城市日报', url: 'https://news.citydaily.cn/local/2024/serial-missing', time: '3月13日' },
      { title: '翡翠湾物业 - A栋1024室', url: 'https://fcwy.com/resident/1024', time: '3月12日' },
      { title: '女子停车场失联 - 城市日报', url: 'https://news.citydaily.cn/local/2024/0315-missing', time: '3月14日' },
      { title: '陈默 恒瑞科技 - 百度', url: 'https://www.baidu.com/s?q=陈默+恒瑞科技', time: '3月12日' },
      { title: '航班 CA1832 实时动态', url: 'https://flights.example.cn/track/CA1832', time: '3月12日' },
      { title: '公司监控软件合法吗 - 知乎', url: 'https://zhihu.com/question/stalker-software', time: '3月11日' },
      { title: '第七层 是什么意思 - 搜索', url: 'https://www.baidu.com/s?q=翡翠湾+停车场+失联', time: '3月11日' },
    ],
    bookmark: {
      title: '幽影 - 本地应用说明',
      url: 'file:///shadow-readme.html',
    },
  },

  files: {
    folders: [
      { name: '文档', type: 'folder', children: [
        { name: '简历.pdf', type: 'file', content: '林雨 - 平面设计师 - 2023\n前雇主：恒瑞科技（2021-2024）' },
        { name: '合同扫描件.pdf', type: 'file', content: '保密协议 - 不得泄露公司内部监控系统部署细节\n签署人：林雨、陈默（见证）' },
      ]},
      { name: '工作', type: 'folder', children: [
        { name: '项目稿.psd', type: 'file', content: '设计文件（已损坏）' },
        { name: '浏览器书签导出.html', type: 'file', content: '书签：\n- 翡翠湾物业 fcwy.com\n- 幽影说明 file:///shadow-readme.html\n（从已卸载软件的缓存里恢复的）' },
      ]},
      { name: '🔒 私密', type: 'folder', encrypted: true, children: [
        { id: 'case-compare', name: '案件对比表.txt', type: 'file', content: `【翡翠湾 B2 连环失踪 · 林雨整理】

姓名    日期          时间      职业      共同点
方晓    2月22日      03:12     幼师      后视镜第二张脸 / 监控缺失23分钟
赵婷    3月1日       03:09     外卖员    最后自拍背景为B2 / 手机遗留现场
周岚    3月8日       03:14     护士      业主群流传，警方未公开
林雨    3月15日      03:17     设计师    幽影记录「第二张人脸」

间隔：7天 · 均在03:0X · 均与「幽影」或陈默有间接关联
陈默航班：3/15 06:40 起飞 — 物理上不可能在场

推论：凶手不是陈默本人。是「镜中的那个人」——每7天替换一个。` },
        { name: '录音备份.m4a', type: 'file', content: '【语音转文字】"...他们来了，别信陈默说的第七层是比喻..."\n"...镜子里的人不是我..."\n"...方晓和赵婷也是这样消失的..."' },
        { name: '监控截图.png', type: 'file', content: 'B2停车场 03:17 — 画面中有两个人，但现场只有林雨一人。与方晓案（2/22）监控截图构图几乎一致。' },
        { name: '手机备份指引.txt', type: 'file', content: '手机锁屏密码已改。\n提示：失联那天的月日，四位数字（和照片文件名后缀一样）。\n电脑右下角可以连接我的手机。' },
        { name: '储物柜收据.jpg', type: 'file', content: 'B2层 748号储物柜 · 月租\n租户：林雨\n备注：陈默知道这个位置。' },
      ]},
    ],
  },

  trash: [
    { name: '已删除短信.txt', content: '陈默: 明天来公司一趟，我们谈谈。\n林雨: 我不会去的。你再靠近我报警。' },
    { name: '安装日志.txt', content: '幽影 v2.1 安装成功\n后台服务已启动\n同步地址: shadow-7.local\n安装者: chenmo@work.com' },
    { name: '草稿邮件.txt', content: '致警方：\n陈默在我电脑里装了监控。我有截图。\n方晓和赵婷的案子里也有同样的软件残留。\n但我害怕。如果我出事了，请查 B2 停车场 3月15日 03:17 的监控。\n—— 林雨（未发送）' },
    { name: '业主群截图.txt', content: '【翡翠湾业主群 3月9日】\n605方晓妈妈：我女儿2月22日就没了，警察说是走失？\n1203王姐：又一个是赵婷，也是停车场……\n物业：请大家不要造谣，以警方通报为准。' },
  ],

  phoneMessages: [
    { from: '10086', text: '您的话费余额不足，请及时充值。', time: '3月14日' },
    { from: '阿瑶', text: '雨雨你还好吗？？？', time: '3月13日' },
    { from: '阿瑶', text: '锁屏密码我记住了，你放心', time: '3月11日' },
    { from: '未知号码', text: '<span class="creepy-text">第七次了。</span>', time: '3月15日 03:17', creepy: true },
  ],

  phoneVoice: [
    { title: '录音 001', duration: '0:42', text: '只是日常工作记录...不对，这不对，镜子里的人不是我...' },
    { title: '录音 002', duration: '1:15', text: '陈默在门外。我听见他在数数。一、二、三...到六了。' },
    { title: '录音 003', duration: '0:08', text: '<span class="creepy-text">七。</span>', creepy: true },
    { title: '录音 004', duration: '0:31', text: '如果你听到这个，去电脑浏览器看新闻。陈默不在场，但照片里的人……和他一样。' },
  ],

  settings: {
    wallpaper: '翡翠湾夜景',
    lastLogin: '3月13日 03:16',
    devices: ['林雨的 iPhone（已连接）'],
    security: '文件加密: 已启用',
  },

  shadowApp: {
    logs: [
      '[03:10:12] 屏幕录制开始',
      '[03:12:44] 检测到异常窗口: 相册',
      '[03:15:01] 用户打开 备忘录',
      '[03:16:33] 摄像头访问请求 — 已允许',
      '[03:17:44] 拍照: IMG_0315',
      '[03:17:45] <span class="creepy-text">检测到第二张人脸</span>',
      '[03:17:46] 同步至 shadow-7.local — 成功',
      '[03:18:00] 用户状态: 失联',
      '[03:18:01] <span class="creepy-text">镜像进程仍在运行</span>',
    ],
  },

  milestones: [
    { id: 'read-chenmo-mail', notify: '任务完成：弄清陈默与林雨的关系' },
    { id: 'visit-news', notify: '任务完成：还原林雨失联当晚' },
    { id: 'visit-serial', notify: '任务完成：翡翠湾连环失踪案 — 调查手记已更新', creepy: true },
    { id: 'found-pattern', notify: '任务完成：已找出七天规律 — 林雨是第七个目标', creepy: true },
    { id: 'visit-shadow-doc', notify: '任务完成：追查幽影软件来源' },
    { id: 'visit-flight', notify: '任务完成：陈默不在场证明已核实' },
    { id: 'open-browser', notify: '提示：按调查手记任务清单，从浏览器历史开始' },
    { id: 'read-notes-dream', notify: '备忘录里记录了林雨对连环案的调查……' },
    { id: 'caseboard-opened', notify: '线索墙上贴着林雨整理的受害者资料' },
    { id: 'caseboard-all-victims', notify: '四名受害者的资料已全部查看', creepy: true },
    { id: 'cctv-glitch-seen', notify: '监控画面：检测到第二张人脸', creepy: true },
    { id: 'cctv-unlocked', notify: '桌面上出现「监控回放」应用（物业授权）' },
  ],

  endings: {
    truth: {
      title: '真相',
      text: `【连环失踪案回顾】
2月22日起，翡翠湾 B2 停车场连续四名年轻女性失联：
方晓 → 赵婷 → 周岚 → 林雨。间隔 7 天，均在凌晨 3 点出头。

【幽影的记录】
每人的设备上都曾安装「幽影」。林雨生命最后几分钟：
她打开相册、备忘录，然后拍照——后视镜里出现第二个人影。

【令人不安的矛盾】
人影与陈默体型一致，但他有航班不在场证明。
陈默只是安装者，不是凶手。

【真相】
连环案的真凶是<strong>镜中的复制体</strong>——
每 7 天，它从镜子里走出来，取代一个人。
林雨是第七个。未知邮件「数到第六次，第七次去找你」说的就是这个。

而你现在正在查看的这台电脑——
是林雨故意留下的<strong>第八个诱饵</strong>。

<span class="creepy-text">你数过屏幕反光里有几张脸吗？</span>

<span class="creepy-text">下一个七天，会轮到谁？</span>`,
    },
  },
};
