import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '市相 - 股票八字分析';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #f59e0b, #8b5cf6, #3b82f6)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '48px' }}>☯</span>
          <span style={{ fontSize: '36px', color: '#f59e0b', fontWeight: 'bold' }}>市相</span>
        </div>

        {/* Stock Symbol */}
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
          {upperSymbol}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '28px', color: '#94a3b8' }}>
          股票八字分析 · 四柱五行大运
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '18px',
            color: '#64748b',
          }}
        >
          新中式金融玄学 · 仅供娱乐
        </div>
      </div>
    ),
    { ...size }
  );
}
