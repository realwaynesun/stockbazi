# 市相 (ShiXiang) Marketing Plan - Execution Steps

## Phase 1: Foundation (Week 1-2)

### Step 1: 注册微信公众号
**Owner**: User (requires personal ID verification)
**Status**: [ ] Pending

**Actions**:
1. Go to https://mp.weixin.qq.com/
2. Register 订阅号 (Subscription Account) - free, suitable for content
3. Name: "市相ShiXiang" or "市相"
4. Complete real-name verification
5. Set up auto-reply with consent prompt (see Section 2 of plan)

**Deliverable**: 公众号 QR code ready for use

---

### Step 2: 配置公众号同意流程
**Owner**: User
**Status**: [ ] Pending
**Depends on**: Step 1

**Actions**:
1. Go to 公众号后台 → 自动回复 → 关注后自动回复
2. Set up consent prompt message:
```
欢迎关注市相！🎉

如需加入产品等候名单并接收更新通知，请回复【同意】。

回复【同意】即表示您已阅读并同意我们的隐私政策：
- 我们收集您的微信昵称用于等候名单管理
- 我们会向您发送产品更新通知
- 您可随时回复【取消】退出等候名单
- 回复【删除】可要求删除您的所有数据

如只想浏览内容，无需回复，直接查看即可。

🔮 市相仅供娱乐，不构成投资建议
```
3. Set up keyword auto-reply for "同意", "取消", "删除", "八字"
4. Add privacy policy to 公众号 menu

**Deliverable**: Consent flow working

---

### Step 3: 注册小红书账号
**Owner**: User
**Status**: [ ] Pending

**Actions**:
1. Download 小红书 app
2. Register with phone number
3. Set up profile:
   - Name: 市相
   - Bio: 用八字看股票 | 新中式金融玄学 | 仅供娱乐
   - Add 公众号 QR code to profile (after Step 1)
4. Complete account verification if possible

**Deliverable**: 小红书 account ready

---

### Step 4: 创建八字卡片模板 (Figma/Canva)
**Owner**: User or CC
**Status**: [x] Completed (CC implemented as React component with image export)

**Actions**:
1. Design card template with:
   - Stock name (中文 + 代码)
   - IPO date and bazi (八字)
   - Five Elements radar chart
   - Cultural interpretation text
   - Disclaimer: "🔮 仅供娱乐，不构成投资建议"
   - Branding: 市相 logo/watermark
2. Create variations:
   - Single card (1080x1350 for 小红书)
   - Carousel card (1080x1350, 3-5 slides)
   - Story format (1080x1920)
3. Save as reusable template

**Deliverable**: Card template files

---

### Step 5: 生成首批10张八字卡片
**Owner**: User or CC
**Status**: [x] Completed (CC generated cards + Xiaohongshu copy)
**Depends on**: Step 4

**Actions**:
1. ✅ Selected 10 popular stocks (A股/美股/港股)
2. ✅ Verified all data available via API
3. ✅ Card links generated for all 10 stocks
4. ✅ Compliant Xiaohongshu copy written for each
5. ✅ Compliance checklist included

**Deliverables**:
- Card links: `.ai-collab/content/batch1-cards.md`
- 10 stocks: AAPL, TSLA, NVDA, 600519, 002594, 300750, 0700, 9988, MSFT, AMZN
- Xiaohongshu copy with hashtags for each

---

### Step 6: 设置百度统计
**Owner**: User or CC
**Status**: [x] Code ready (User needs to register and add site ID)

**Actions**:
1. ✅ BaiduAnalytics component created
2. ✅ Integrated into layout.tsx
3. [ ] User: Register at https://tongji.baidu.com/
4. [ ] User: Add site shixiang.vercel.app
5. [ ] User: Get site ID (hm.js?后面的字符串)
6. [ ] User: Add to Vercel env: NEXT_PUBLIC_BAIDU_ANALYTICS_ID=你的id
7. [ ] Redeploy to activate

**Files created**:
- `src/components/analytics/BaiduAnalytics.tsx`
- Updated `src/app/layout.tsx`

**Deliverable**: 百度统计 dashboard accessible (after user completes steps 3-7)

---

### Step 7: 设置草料活码
**Owner**: User
**Status**: [ ] Pending
**Depends on**: Step 1

**Actions**:
1. Go to https://cli.im/ (草料二维码)
2. Register account
3. Create "活码" for:
   - 公众号 QR (main waitlist capture)
   - 微信群 QR (if using groups)
4. Get permanent QR code URL
5. Add to website and card templates

**Deliverable**: Permanent QR codes ready

---

### Step 8: 准备微信群及群规
**Owner**: User
**Status**: [ ] Pending

**Actions**:
1. Create WeChat group "市相交流群1"
2. Set group rules in announcement:
```
欢迎加入市相交流群！

群规：
1. 本群仅供八字文化交流
2. 禁止任何投资建议或荐股
3. 禁止广告、外链
4. 违规者移出群聊

🔮 市相仅供娱乐，不构成投资建议
```
3. Prepare backup group "市相交流群2"
4. Configure 活码 to point to current group

**Deliverable**: WeChat group ready with rules

---

## Phase 2: Content Seeding (Week 3-4)

### Step 9: 发布首周内容 (3篇)
**Owner**: User
**Status**: [ ] Pending
**Depends on**: Steps 3, 5

**Actions**:
1. Monday: Post 1st stock bazi card
2. Wednesday: Post educational carousel (八字基础知识)
3. Friday: Post 2nd stock bazi card
4. Each post includes:
   - Engaging caption (compliant language)
   - Hashtags: #股票八字 #市相 #新中式玄学 #八字 #命理
   - Disclaimer in image
   - QR code in comments or bio reference
5. Reply to all comments within 2 hours

**Deliverable**: 3 posts published, engagement metrics recorded

---

### Step 10: 加入小红书社区
**Owner**: User
**Status**: [ ] Pending

**Actions**:
1. Search and join relevant communities:
   - 投资理财交流
   - 传统文化爱好者
   - 八字命理
2. Engage genuinely (not spam)
3. Share relevant content when appropriate

**Deliverable**: 3-5 communities joined

---

## Phase 3: Waitlist Push (Week 5-6)

### Step 11: 首轮KOL合作外联
**Owner**: User
**Status**: [ ] Pending

**Actions**:
1. Identify 5 micro-influencers (5K-50K followers):
   - 2 传统文化/玄学类
   - 2 理财/投资类 (educational, not advice)
   - 1 lifestyle类
2. Prepare outreach message
3. Send DM with value proposition
4. For interested partners:
   - Send compliance briefing
   - Provide approved copy templates
   - Review their draft before posting

**Deliverable**: 2-3 partnership agreements

---

### Step 12: 启动推荐计划
**Owner**: User
**Status**: [ ] Pending
**Depends on**: Step 2

**Actions**:
1. Create referral海报 template
2. Set up keyword reply in 公众号:
   - Reply "邀请" → Get referral poster
3. Announce in 微信群
4. Track referrals manually (飞书表格)

**Deliverable**: Referral program live

---

## Progress Tracking

| Step | Description | Status | Owner | Completed |
|------|-------------|--------|-------|-----------|
| 1 | 注册微信公众号 | Pending | User | |
| 2 | 配置公众号同意流程 | Pending | User | |
| 3 | 注册小红书账号 | Pending | User | |
| 4 | 创建八字卡片模板 | ✅ Done | CC | React + html-to-image |
| 5 | 生成首批10张卡片 | ✅ Done | CC | 10 cards + copy |
| 6 | 设置百度统计 | ⏳ Code ready | CC/User | 等待用户注册 |
| 7 | 设置草料活码 | Pending | User | |
| 8 | 准备微信群及群规 | Pending | User | |
| 9 | 发布首周内容 | ⏳ 材料已备 | User | 轮播内容已创建 |
| 10 | 加入小红书社区 | Pending | User | |
| 11 | 首轮KOL合作外联 | ⏳ 模板已备 | User | 外联模板已创建 |
| 12 | 启动推荐计划 | ⏳ 规格已备 | User | 海报规格已创建 |

---

## Notes

- Steps 1, 2, 3, 7, 8 require user action (account registration, ID verification)
- Steps 4, 5, 6 can be assisted by CC
- Steps 9-12 are ongoing activities

## Supporting Materials Created by CC

| Material | Location | For Step |
|----------|----------|----------|
| 首批10张卡片文案 | `.ai-collab/content/batch1-cards.md` | Step 5, 9 |
| 教育类轮播内容 | `.ai-collab/content/educational-carousel.md` | Step 9 |
| KOL外联模板 | `.ai-collab/content/kol-outreach-templates.md` | Step 11 |
| 推荐海报规格 | `.ai-collab/content/referral-poster-spec.md` | Step 12 |

## Next Action

Start with **Step 1: 注册微信公众号** - this is the foundation for the entire waitlist system.

Once 公众号 is ready, you can immediately:
1. Post batch1 cards on 小红书 (content ready)
2. Use educational carousel content (content ready)
3. Start KOL outreach (templates ready)
