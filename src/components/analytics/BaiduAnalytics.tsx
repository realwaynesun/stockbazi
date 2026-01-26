'use client';

/**
 * 市相 - 百度统计组件
 * 用于集成百度统计 (tongji.baidu.com)
 *
 * 使用方法：
 * 1. 在 https://tongji.baidu.com/ 注册账号
 * 2. 添加网站，获取 site ID (hm.js?后面的那串字符)
 * 3. 在 .env.local 中设置 NEXT_PUBLIC_BAIDU_ANALYTICS_ID=你的site_id
 */

import Script from 'next/script';

const BAIDU_ANALYTICS_ID = process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID;

export function BaiduAnalytics() {
  // 如果没有配置百度统计 ID，不渲染任何内容
  if (!BAIDU_ANALYTICS_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="baidu-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?${BAIDU_ANALYTICS_ID}";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `,
        }}
      />
    </>
  );
}
