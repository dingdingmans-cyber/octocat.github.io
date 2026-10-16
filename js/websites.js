/** 浏览器内可访问的仿真网页 */
const WEB_SITES = {
  'about:history': {
    title: '历史记录',
    render(state) {
      const items = GAME_DATA.browser.history;
      return `
        <div class="web-page web-history-page">
          <h2>浏览历史</h2>
          <p class="web-muted">点击条目重新打开页面</p>
          ${items.map(item => `
            <a class="web-history-item" href="#" data-browser-url="${item.url}">
              <strong>${item.title}</strong>
              <span>${item.url}</span>
              <em>${item.time}</em>
            </a>
          `).join('')}
          ${state.visitedUrls?.includes('file:///shadow-readme.html') ? '' : `
            <p class="web-muted" style="margin-top:1.5rem;padding:0 1rem">
              书签栏：
              <a class="web-link" href="#" data-browser-url="file:///shadow-readme.html">file:///shadow-readme.html</a>
              <span class="web-muted">（幽影说明文档缓存）</span>
            </p>
          `}
        </div>`;
    },
  },

  'https://fcwy.com/': {
    title: '翡翠湾物业',
    render() {
      return `
        <div class="web-page web-fcwy">
          <header class="web-site-header fcwy-header">
            <div class="web-logo">翡翠湾物业</div>
            <nav><a href="#" data-browser-url="https://fcwy.com/">首页</a><a href="#" data-browser-url="https://fcwy.com/resident">住户服务</a><a href="#" data-browser-url="https://fcwy.com/notice">公告</a></nav>
          </header>
          <div class="web-hero" style="background-image:url('assets/web/web-fcwy-building.jpg')">
            <div class="web-hero-overlay"><h1>翡翠湾 · 智慧社区</h1><p>您的安全，我们的责任</p></div>
          </div>
          <div class="web-body fcwy-body">
            <h2>最新公告</h2>
            <article class="web-card">
              <h3>A栋住户水电费缴纳通知</h3>
              <p class="web-date">2024年3月12日</p>
              <p>尊敬的业主：A栋各单元本月水电费已出账。请住户于3月15日前完成缴纳。</p>
              <a class="web-link" href="#" data-browser-url="https://fcwy.com/resident/1024">查看 A栋1024室 账单详情 →</a>
            </article>
            <article class="web-card creepy-card">
              <h3>B2停车场监控维护通知</h3>
              <p class="web-date">2024年3月11日</p>
              <p>地下停车场B2区域将于3月14日-16日进行监控设备维护。部分时段录像可能缺失。</p>
            </article>
          </div>
        </div>`;
    },
  },

  'https://fcwy.com/resident': {
    title: '住户服务 - 翡翠湾',
    render() {
      return `
        <div class="web-page web-fcwy">
          <header class="web-site-header fcwy-header">
            <div class="web-logo">翡翠湾物业</div>
            <nav><a href="#" data-browser-url="https://fcwy.com/">首页</a><a href="#" data-browser-url="https://fcwy.com/resident">住户服务</a></nav>
          </header>
          <div class="web-body fcwy-body">
            <h2>住户服务</h2>
            <ul class="web-list">
              <li><a href="#" data-browser-url="https://fcwy.com/resident/1024">A栋 1024室 · 林雨</a> — 水电费待缴</li>
              <li>A栋 905室 · 王先生 — 已缴清</li>
              <li>B栋 1201室 · 李女士 — 已缴清</li>
            </ul>
          </div>
        </div>`;
    },
  },

  'https://fcwy.com/resident/1024': {
    title: 'A栋1024室 - 翡翠湾',
    render() {
      return `
        <div class="web-page web-fcwy">
          <header class="web-site-header fcwy-header">
            <div class="web-logo">翡翠湾物业</div>
          </header>
          <div class="web-body fcwy-body">
            <h2>A栋 1024室</h2>
            <table class="web-table">
              <tr><th>业主</th><td>林雨</td></tr>
              <tr><th>楼栋</th><td>A栋</td></tr>
              <tr><th>房号</th><td><strong>1024</strong></td></tr>
              <tr><th>本月水电</th><td>￥186.40（待缴）</td></tr>
              <tr><th>最近门禁记录</th><td>3月14日 23:52 进入</td></tr>
            </table>
            <p class="web-note">※ 业主可通过房号登录个人门户（部分老住户习惯用房号作电脑密码）。</p>
          </div>
        </div>`;
    },
  },

  'https://fcwy.com/notice': {
    title: '公告 - 翡翠湾',
    render() {
      return `
        <div class="web-page web-fcwy">
          <header class="web-site-header fcwy-header"><div class="web-logo">翡翠湾物业</div></header>
          <div class="web-body fcwy-body">
            <h2>社区公告</h2>
            <article class="web-card"><h3>关于近期独居住户安全提醒</h3><p>请住户注意陌生人尾随，发现可疑情况联系保安室。</p></article>
            <article class="web-card"><h3>B2停车场照明检修</h3><p>3月13日凌晨B2西侧照明故障，已于当日下午修复。</p></article>
          </div>
        </div>`;
    },
  },

  'https://news.citydaily.cn/local/2024/0315-missing': {
    title: '女子停车场失联 - 城市日报',
    render() {
      return `
        <div class="web-page web-news">
          <header class="web-news-header">
            <span class="web-news-brand">城市日报</span>
            <span class="web-news-section">本地 · 社会</span>
          </header>
          <article class="web-news-article">
            <h1>翡翠湾地下停车场一女子失联，警方呼吁提供线索</h1>
            <p class="web-news-meta">记者 赵琳 · 2024年3月15日 09:42 · 阅读 12,847</p>
            <img class="web-news-img" src="assets/web/web-news-parking.jpg" alt="停车场现场">
            <p><strong>本报讯</strong> 3月15日凌晨，翡翠湾小区地下停车场B2层发生一起失联事件。住户林某（26岁，平面设计师）于凌晨3时许被监控拍到进入停车场，此后手机信号消失，至今下落不明。</p>
            <p>警方表示，已调取周边监控。值得注意的是，<strong>B2西侧摄像头在3月14日凌晨至3月15日凌晨3:20之间存在维护造成的录像空白</strong>，给调查带来困难。</p>
            <p>小区居民反映，林某近期与前任同事陈某存在感情纠纷。陈某所在公司恒瑞科技回应称正在配合调查。</p>
            <blockquote>「她最近总说自己被人盯着，晚上不敢关灯。」——邻居</blockquote>
            <p>警方称本案与2月以来多起失踪案<strong>并案侦查</strong>。
              <a class="web-link" href="#" data-browser-url="https://news.citydaily.cn/local/2024/serial-missing">阅读连环失踪专题 →</a>
            </p>
            <p>如有线索请拨打 110。
              <a class="web-link" href="#" data-browser-url="https://www.baidu.com/s?q=翡翠湾+停车场+失联">相关搜索</a>
            </p>
          </article>
        </div>`;
    },
  },

  'https://news.citydaily.cn/local/2024/serial-missing': {
    title: '翡翠湾连环失踪专题 - 城市日报',
    render() {
      const imgMap = { 方晓: 'fangxiao', 赵婷: 'zhaoting', 周岚: 'zhoulan', 林雨: 'linyu' };
      const rows = SERIAL_VICTIMS.map(v => {
        const slug = imgMap[v.name];
        const thumb = slug ? `<img src="assets/caseboard/victim-${slug}.png" alt="" style="width:36px;height:44px;object-fit:cover;border-radius:2px;vertical-align:middle;margin-right:6px">` : '';
        return `<tr>
          <td>${thumb}<strong>${v.name}</strong></td>
          <td>${v.date}</td>
          <td>${v.job}</td>
          <td>${v.unit}</td>
        </tr>`;
      }).join('');
      return `
        <div class="web-page web-news">
          <header class="web-news-header">
            <span class="web-news-brand">城市日报</span>
            <span class="web-news-section">专题 · 深度</span>
          </header>
          <article class="web-news-article">
            <h1>翡翠湾连环失踪：一个月四名年轻女性，谁在凌晨三点带走她们？</h1>
            <p class="web-news-meta">专题组 · 2024年3月14日 · 阅读 48,291</p>
            <img class="web-news-img" src="assets/web/web-news-parking.jpg" alt="停车场">
            <p><strong>【编者按】</strong> 自2月22日起，翡翠湾小区 B2 地下停车场接连发生年轻女性失联事件。警方已成立专案组，但至今未公布嫌疑人身份。</p>
            <h3>已知失联者（部分）</h3>
            <table class="web-table web-victim-table">
              <tr><th>姓名</th><th>时间</th><th>职业</th><th>备注</th></tr>
              ${rows}
            </table>
            <h3>案件共同点</h3>
            <ul class="web-list" style="padding:0 1rem">
              <li>均在 B2 停车场，凌晨 <strong>03:0X</strong> 前后</li>
              <li>间隔约 <strong>7 天</strong> 一人</li>
              <li>监控均有维护或故障造成的<strong>录像空白</strong></li>
              <li>现场遗留手机，相册最后一张照片背景多为停车场或后视镜</li>
              <li>多名住户称受害者失踪前抱怨「总觉得被盯着」「镜子里不对」</li>
            </ul>
            <blockquote>「我女儿方晓失踪前说，电梯镜子里的人眨眼比她慢半拍。」——方晓母亲</blockquote>
            <p>警方呼吁：夜间尽量避免单独前往地下停车场。
              <a class="web-link" href="#" data-browser-url="https://news.citydaily.cn/local/2024/0315-missing">最新：林雨案报道</a> ·
              <a class="web-link" href="#" data-browser-url="https://www.baidu.com/s?q=翡翠湾+连环失踪">百度搜索</a>
            </p>
            <p class="web-note">※ 周岚案尚未获警方正式确认，信息来自业主群流传。</p>
          </article>
        </div>`;
    },
  },

  'https://www.baidu.com/s?q=翡翠湾+连环失踪': {
    title: '翡翠湾 连环失踪 - 百度',
    render() {
      return `
        <div class="web-page web-baidu">
          <div class="web-baidu-bar">
            <span class="web-baidu-logo">百度</span>
            <input class="web-baidu-input" value="翡翠湾 连环失踪" readonly>
            <button class="web-baidu-btn">搜索</button>
          </div>
          <div class="web-baidu-results">
            <div class="web-result">
              <a href="#" data-browser-url="https://news.citydaily.cn/local/2024/serial-missing">翡翠湾连环失踪专题 - 城市日报</a>
              <p class="web-result-url">news.citydaily.cn/local/2024/serial-missing</p>
              <p>一个月四名年轻女性，均在 B2 停车场凌晨失联……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://news.citydaily.cn/local/2024/0315-missing">女子停车场失联 - 林雨案</a>
              <p>最新一名受害者，平面设计师，3月15日 03:17……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://www.baidu.com/s?q=陈默+恒瑞科技">陈默 恒瑞科技</a>
              <p>多名受害者前男友/同事，但有不在场证明……</p>
            </div>
          </div>
        </div>`;
    },
  },

  'https://www.baidu.com/s?q=翡翠湾+停车场+失联': {
    title: '百度一下',
    render() {
      return `
        <div class="web-page web-baidu">
          <div class="web-baidu-bar">
            <span class="web-baidu-logo">百度</span>
            <input class="web-baidu-input" value="翡翠湾 停车场 失联" readonly>
            <button class="web-baidu-btn">搜索</button>
          </div>
          <div class="web-baidu-results">
            <div class="web-result">
              <a href="#" data-browser-url="https://news.citydaily.cn/local/2024/serial-missing">翡翠湾连环失踪专题</a>
              <p class="web-result-url">news.citydaily.cn/local/2024/serial-missing</p>
              <p>一个月四名年轻女性，B2停车场凌晨失联……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://news.citydaily.cn/local/2024/0315-missing">女子停车场失联 - 城市日报</a>
              <p class="web-result-url">news.citydaily.cn/local/2024/0315-missing</p>
              <p>翡翠湾小区地下停车场B2层，26岁平面设计师林某凌晨失联……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://www.baidu.com/s?q=陈默+恒瑞科技">陈默 恒瑞科技 - 相关人物</a>
              <p class="web-result-url">baike.baidu.com/...</p>
              <p>恒瑞科技后端工程师陈默，林某前男友……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://www.baidu.com/s?q=陈默+航班+3月15">陈默 航班 3月15 - 搜索结果</a>
              <p class="web-result-url">flights.example.cn/...</p>
              <p>3月15日 CA1832 上海虹桥出发航班旅客名单……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://zhihu.com/question/stalker-software">公司监控软件合法吗 - 知乎</a>
              <p class="web-result-url">zhihu.com/question/...</p>
            </div>
          </div>
        </div>`;
    },
  },

  'https://www.baidu.com/s?q=陈默+恒瑞科技': {
    title: '陈默 恒瑞科技 - 百度',
    render() {
      return `
        <div class="web-page web-baidu">
          <div class="web-baidu-bar"><span class="web-baidu-logo">百度</span><input class="web-baidu-input" value="陈默 恒瑞科技" readonly></div>
          <div class="web-baidu-results">
            <div class="web-result">
              <a href="#" data-browser-url="https://hengrui-tech.com/about/team">恒瑞科技 · 团队介绍</a>
              <p>后端安全组工程师陈默，入职于2021年……</p>
            </div>
            <div class="web-result">
              <a href="#" data-browser-url="https://news.citydaily.cn/local/2024/0315-missing">翡翠湾停车场失联案</a>
              <p>警方称陈某系重要关系人，但否认其为嫌疑人……</p>
            </div>
          </div>
        </div>`;
    },
  },

  'https://www.baidu.com/s?q=陈默+航班+3月15': {
    title: '陈默 航班 - 百度',
    render() {
      return `
        <div class="web-page web-baidu">
          <div class="web-baidu-bar"><span class="web-baidu-logo">百度</span><input class="web-baidu-input" value="陈默 航班 3月15" readonly></div>
          <div class="web-baidu-results">
            <div class="web-result">
              <a href="#" data-browser-url="https://flights.example.cn/track/CA1832">航班 CA1832 实时动态</a>
              <p>3月15日 06:40 上海虹桥起飞，旅客舱单……</p>
            </div>
          </div>
        </div>`;
    },
  },

  'https://hengrui-tech.com/about/team': {
    title: '团队介绍 - 恒瑞科技',
    render() {
      return `
        <div class="web-page web-corp">
          <header class="web-corp-header">
            <span class="web-corp-logo">恒瑞科技 HENGRUI</span>
            <nav><a href="#" data-browser-url="https://hengrui-tech.com/about/team">团队</a><a href="#" data-browser-url="https://hengrui-tech.com/products/security">产品</a></nav>
          </header>
          <div class="web-body">
            <h2>安全与运维组</h2>
            <div class="web-team-card">
              <div class="web-avatar">默</div>
              <div>
                <h3>陈默</h3>
                <p>后端工程师 · 入职2021年</p>
                <p class="web-muted">负责内部终端安全套件部署与维护。3月14日起出差深圳（至3月17日）。</p>
              </div>
            </div>
            <p class="web-note">公司声明：员工私人行为与公司无关。任何未经授权的监控行为均属违规。</p>
            <a class="web-link" href="#" data-browser-url="https://hengrui-tech.com/products/security">查看「终端安全套件」产品页 →</a>
          </div>
        </div>`;
    },
  },

  'https://hengrui-tech.com/products/security': {
    title: '终端安全套件 - 恒瑞科技',
    render() {
      return `
        <div class="web-page web-corp">
          <header class="web-corp-header"><span class="web-corp-logo">恒瑞科技</span></header>
          <div class="web-body">
            <h2>终端安全套件 v2.1</h2>
            <p>企业级终端监控解决方案，支持屏幕录制、文件审计、远程管理。</p>
            <p class="web-muted">内部代号曾被称为「Shadow」。2023年起已停止对外销售，仅限遗留客户维护。</p>
            <p>卸载需管理员密钥。技术支持文档：
              <a class="web-link" href="#" data-browser-url="file:///shadow-readme.html">本地缓存副本</a>
            </p>
          </div>
        </div>`;
    },
  },

  'https://flights.example.cn/track/CA1832': {
    title: 'CA1832 航班动态',
    render() {
      return `
        <div class="web-page web-flight">
          <header class="web-flight-header">✈ 航班查询</header>
          <div class="web-body">
            <h2>CA1832 · 上海虹桥 → 深圳宝安</h2>
            <table class="web-table">
              <tr><th>日期</th><td>2024年3月15日</td></tr>
              <tr><th>计划起飞</th><td>06:40</td></tr>
              <tr><th>实际起飞</th><td>06:52</td></tr>
              <tr><th>状态</th><td><span class="web-tag green">已起飞</span></td></tr>
            </table>
            <h3>旅客舱单（部分公开）</h3>
            <table class="web-table">
              <tr><th>姓名</th><th>座位</th><th>证件</th></tr>
              <tr><td><strong>陈默</strong></td><td>24C</td><td>310***</td></tr>
              <tr><td>张伟</td><td>18A</td><td>320***</td></tr>
            </table>
            <p class="web-highlight">※ 陈默在林雨失联时段（凌晨3:17）已在数千公里外的航班上。</p>
            <p class="web-muted">但停车场照片里的人影，仍然和他的体型一致……</p>
          </div>
        </div>`;
    },
  },

  'https://zhihu.com/question/stalker-software': {
    title: '公司监控软件合法吗 - 知乎',
    render() {
      return `
        <div class="web-page web-zhihu">
          <div class="web-zhihu-q">
            <h1>前男友在公司电脑上装了监控软件，我该怎么办？</h1>
            <p class="web-muted">327 个回答 · 1,892 关注</p>
          </div>
          <div class="web-zhihu-a">
            <div class="web-zhihu-user">匿名用户</div>
            <p>我也是设计师，前男友是安全组的。他说装的是「公司合规软件」，结果能看我屏幕、录音、甚至开摄像头。卸载要管理员密码，我根本删不掉。</p>
            <p>后来才发现数据发到一个早就注销的域名 shadow-7.local ……</p>
          </div>
          <div class="web-zhihu-a">
            <div class="web-zhihu-user">法律从业者</div>
            <p>私自安装属于侵犯隐私，建议保留日志并报警。安装日志和同步地址是关键证据。</p>
          </div>
        </div>`;
    },
  },

  'file:///shadow-readme.html': {
    title: '幽影 - 本地说明',
    render() {
      return `
        <div class="web-page web-shadow-doc">
          <h1>幽影 Shadow v2.1</h1>
          <p class="web-tag red">内部工具 · 非公开</p>
          <h2>功能</h2>
          <ul>
            <li>后台屏幕录制</li>
            <li>摄像头/麦克风访问</li>
            <li>文件变更监控</li>
            <li>远程同步至 shadow-7.local</li>
          </ul>
          <h2>卸载</h2>
          <p>需要访问密码。管理员提示：密码与安装时设置的「层级」有关。</p>
          <p class="web-muted">林雨曾在备忘录里记录过一个反复出现的梦——不断下楼，到某一层时看见自己的背影。</p>
          <p class="creepy-text">检测到第二张人脸时，同步不会停止。</p>
        </div>`;
    },
  },
};
