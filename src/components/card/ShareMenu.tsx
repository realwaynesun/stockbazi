'use client';

/**
 * 市相 - Platform Share Menu
 * 社交平台分享菜单 - 微信、微博、小红书、QQ
 */

import { useState, useRef, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareMenuProps {
  title: string;
  description: string;
  url: string;
}

type ShareStrategy = 'web' | 'clipboard';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  strategy: ShareStrategy;
  appScheme?: string;
  getWebUrl?: (p: ShareMenuProps) => string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'wechat',
    name: '微信',
    icon: <WeChatIcon />,
    color: 'hover:bg-green-500/20',
    strategy: 'clipboard',
    appScheme: 'weixin://',
  },
  {
    id: 'weibo',
    name: '微博',
    icon: <WeiboIcon />,
    color: 'hover:bg-red-500/20',
    strategy: 'web',
    getWebUrl: ({ title, description, url }) => {
      const params = new URLSearchParams({
        url,
        title: `${title} ${description}`,
      });
      return `https://service.weibo.com/share/share.php?${params}`;
    },
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: <XiaohongshuIcon />,
    color: 'hover:bg-red-400/20',
    strategy: 'clipboard',
    appScheme: 'xhsdiscover://',
  },
  {
    id: 'qq',
    name: 'QQ',
    icon: <QQIcon />,
    color: 'hover:bg-blue-500/20',
    strategy: 'web',
    getWebUrl: ({ title, description, url }) => {
      const params = new URLSearchParams({ url, title, desc: description });
      return `https://connect.qq.com/widget/shareqq/index.html?${params}`;
    },
  },
];

export function ShareMenu({ title, description, url }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handlePlatformClick = (platform: Platform) => {
    const params: ShareMenuProps = { title, description, url };

    if (platform.strategy === 'web' && platform.getWebUrl) {
      window.open(platform.getWebUrl(params), '_blank');
    } else {
      const shareText = `${title}\n${description}\n${url}`;
      navigator.clipboard.writeText(shareText).catch(() => {});
      setToast(`已复制，正在打开${platform.name}...`);
      if (platform.appScheme) {
        setTimeout(() => { window.location.href = platform.appScheme!; }, 300);
      }
      setTimeout(() => setToast(''), 3000);
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all',
          isOpen
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
        )}
      >
        {isOpen ? <X size={18} /> : <Share2 size={18} />}
        <span className="text-sm">分享</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 p-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 min-w-[200px]">
          <p className="text-xs text-slate-500 mb-2 px-1">分享到</p>
          <div className="grid grid-cols-4 gap-1">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors',
                  platform.color
                )}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center">
                  {platform.icon}
                </div>
                <span className="text-xs text-slate-400">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-xs whitespace-nowrap z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function WeChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#07C160">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.527 6.527 0 0 1-.255-1.79c0-3.58 3.387-6.47 7.58-6.47.265 0 .52.023.78.05C16.828 4.768 13.142 2.188 8.691 2.188zm-2.6 4.17c.58 0 1.049.47 1.049 1.049 0 .58-.47 1.049-1.049 1.049a1.049 1.049 0 0 1 0-2.098zm5.226 0c.58 0 1.049.47 1.049 1.049 0 .58-.47 1.049-1.049 1.049a1.049 1.049 0 0 1 0-2.098zM15.82 8.56c-3.627 0-6.593 2.578-6.593 5.69 0 3.112 2.966 5.69 6.593 5.69.65 0 1.283-.089 1.886-.252a.72.72 0 0 1 .599.08l1.5.876a.272.272 0 0 0 .14.046c.133 0 .242-.11.242-.245 0-.06-.024-.119-.04-.178l-.305-1.161a.492.492 0 0 1 .178-.554C21.74 17.573 22.813 15.802 22.813 14.25c0-3.112-2.966-5.69-6.593-5.69h-.4zm-2.108 3.27c.486 0 .88.393.88.879a.879.879 0 1 1-.88-.88zm4.61 0c.486 0 .88.393.88.879a.879.879 0 1 1-.88-.88z" />
    </svg>
  );
}

function WeiboIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#E6162D">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM8.343 17.307c-.542 1.327-2.108 2.022-3.455 1.558-1.319-.45-1.893-1.88-1.326-3.152.558-1.254 2.06-1.952 3.367-1.565 1.335.404 1.953 1.84 1.414 3.16zm1.467-1.673c-.222.494-.81.726-1.307.514-.49-.213-.695-.76-.484-1.24.217-.493.8-.725 1.296-.522.492.2.713.738.495 1.248zM20.69 11.142c.238.69-.347 1.413-1.298 1.615-.95.2-1.888-.18-2.115-.878-.238-.7.346-1.434 1.285-1.635.96-.204 1.89.168 2.128.898zM17.373 9.1c-.6-.165-1.279.076-1.52.558-.245.485.016 1.016.606 1.194.6.181 1.313-.06 1.55-.546.235-.49-.036-1.035-.636-1.206zm-3.82.93c-2.395-.516-5.107.645-6.157 2.645-1.078 2.053-.095 4.33 2.322 5.04 2.504.736 5.46-.447 6.503-2.63 1.018-2.135-.156-4.524-2.668-5.055zM22.54 4.073c-1.815-2.015-4.49-2.717-6.716-2.106-.663.183-.994.895-.74 1.594.253.695.95 1.082 1.615.878 1.366-.375 3.02.04 4.135 1.275 1.113 1.236 1.304 2.942.587 4.27-.367.677-.056 1.524.691 1.89.75.37 1.664.044 2.04-.632 1.165-2.15.89-4.904-.612-6.877z" />
    </svg>
  );
}

function XiaohongshuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FE2C55">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-3v3c0 .276-.224.5-.5.5h-2a.5.5 0 0 1-.5-.5v-3h-3a.5.5 0 0 1-.5-.5v-2c0-.276.224-.5.5-.5h3v-3c0-.276.224-.5.5-.5h2c.276 0 .5.224.5.5v3h3c.276 0 .5.224.5.5v2a.5.5 0 0 1-.5.5z" />
    </svg>
  );
}

function QQIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#12B7F5">
      <path d="M21.395 15.035a39.548 39.548 0 0 0-1.089-2.186c.017-.207.025-.414.025-.623C20.331 6.886 16.596 2.4 12 2.4c-4.596 0-8.331 4.486-8.331 9.826 0 .209.008.416.025.623a39.548 39.548 0 0 0-1.089 2.186c-.443 1.002-.755 1.949-.82 2.604-.107 1.073.077 1.724.459 1.914.265.131.588.036 1.037-.209.135.477.337.929.59 1.343.495.812 1.167 1.372 1.974 1.633-.218.36-.277.763-.108 1.142.263.59.917.87 1.717.713a4.74 4.74 0 0 0 1.29-.48c.796.302 1.726.474 2.73.517l.526.012.527-.012c1.003-.043 1.934-.215 2.73-.517.371.217.815.383 1.29.48.8.157 1.454-.123 1.717-.713.169-.379.11-.782-.108-1.142.807-.261 1.479-.821 1.974-1.633.253-.414.455-.866.59-1.343.449.245.772.34 1.037.209.382-.19.566-.841.46-1.914-.066-.655-.378-1.602-.821-2.604z" />
    </svg>
  );
}
