import { useState } from 'react';
import { BellOff, Calendar, Camera, ChevronLeft, Image, Menu, Mic, Phone, Plus, Search, Smile } from 'lucide-react';
import type { Conversation } from '../domain/types';
import { buildChatRows, effectiveStatusTime } from '../domain/layout';
import { messageTimeLabel, statusTimeLabel } from '../domain/format';
import { headerTitle, participant } from '../domain/conversation';
import { Avatar } from './Avatar';
import './LinePhone.css';

interface Props {
  conversation: Conversation;
  /** 編輯時才傳；輸出圖片用的那一份不傳，畫面上就不會有任何互動提示 */
  interaction?: {
    selectedId: string | null;
    onSelect: (id: string, bubble: HTMLElement) => void;
    onMove: (fromIndex: number, toIndex: number) => void;
  };
}

export function LinePhone({ conversation: c, interaction }: Props) {
  const single = c.output === 'single';
  const cls = ['lp', single ? 'single' : 'long', c.theme === 'dark' && 'dark', single && !c.showInput && 'no-input', interaction && 'interactive'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      {single && <StatusBar c={c} />}
      {single && <Header c={c} />}
      <Chat c={c} interaction={interaction} />
      {single && c.showInput && <InputBar />}
    </div>
  );
}

function Chat({ c, interaction }: Pick<Props, 'interaction'> & { c: Conversation }) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const rows = buildChatRows(c);
  const indexOf = (id: string) => c.messages.findIndex(m => m.id === id);
  return (
    <div className="lp-chat">
      <div className="lp-chat-inner">
        {rows.map(r => {
          if (r.kind === 'separator') return <div key={r.key} className="lp-pill">{r.label}</div>;
          const m = r.message;
          const p = participant(c, m.from);
          const idx = indexOf(m.id);
          const meta = r.runEnd && (
            <div className="lp-meta">{r.readLabel && <>{r.readLabel}<br /></>}{messageTimeLabel(m.time, c.hour24)}</div>
          );
          const bubble = (
            <div className="lp-bubble">
              {r.runStart && <Tail />}
              {m.text}
            </div>
          );
          const rowCls = ['lp-msg', r.mine ? 'mine' : 'theirs', !r.runStart && 'cont', interaction?.selectedId === m.id && 'selected', dropAt === idx && dragFrom !== idx && 'drop-before'].filter(Boolean).join(' ');
          const handlers = interaction ? {
            draggable: true,
            onClick: (e: React.MouseEvent<HTMLDivElement>) => interaction.onSelect(m.id, e.currentTarget.querySelector('.lp-bubble') as HTMLElement),
            onDragStart: (e: React.DragEvent) => { setDragFrom(idx); e.dataTransfer.effectAllowed = 'move'; },
            onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDropAt(idx); },
            onDragEnd: () => { setDragFrom(null); setDropAt(null); },
            onDrop: (e: React.DragEvent) => {
              e.preventDefault();
              if (dragFrom !== null && dragFrom !== idx) interaction.onMove(dragFrom, dragFrom < idx ? idx - 1 : idx);
              setDragFrom(null); setDropAt(null);
            },
          } : {};
          return r.mine ? (
            <div key={r.key} className={rowCls} {...handlers}>
              {meta}
              <div className="lp-col">{bubble}</div>
            </div>
          ) : (
            <div key={r.key} className={rowCls} {...handlers}>
              <div className="lp-avslot">{r.runStart && p && <Avatar index={p.avatar} size={30} />}</div>
              <div className="lp-col">
                {r.runStart && c.mode === 'group' && <div className="lp-name">{p?.name}</div>}
                {bubble}
              </div>
              {meta}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** 氣泡角落的小勾。畫成我方的方向（右上），對方用 CSS 左右翻轉 */
function Tail() {
  return (
    <svg className="lp-tail" viewBox="0 0 12 13" aria-hidden>
      <path d="M0 0 H12 C9.5 1.2 7.6 4 7 13 H0 Z" fill="currentColor" />
    </svg>
  );
}

function StatusBar({ c }: { c: Conversation }) {
  return (
    <div className="lp-status">
      <div className="lp-status-time">
        {statusTimeLabel(effectiveStatusTime(c), c.hour24)}
        {c.mute && <BellOff size={15} strokeWidth={2.6} />}
      </div>
      <div className="lp-status-right">
        <SignalBars level={c.signal} />
        {c.network === 'wifi' && <WifiIcon />}
        {(c.network === '5g' || c.network === '4g') && <span className="lp-net-text">{c.network.toUpperCase()}</span>}
        <div className={`lp-battery${c.battery < 20 ? ' low' : ''}`}>
          <div className="lp-battery-body"><span>{c.battery}</span></div>
          <div className="lp-battery-cap" />
        </div>
      </div>
    </div>
  );
}

function SignalBars({ level }: { level: number }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={i * 4.8} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.8" fill="currentColor" opacity={i < level ? 1 : 0.3} />
      ))}
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden>
      <path d="M8.5 2.2c2.5 0 4.8 1 6.5 2.6l1.3-1.3C14.2 1.4 11.5.3 8.5.3S2.8 1.4.7 3.5L2 4.8c1.7-1.6 4-2.6 6.5-2.6z" fill="currentColor" />
      <path d="M8.5 5.6c1.6 0 3 .6 4.1 1.6l1.3-1.3C12.5 4.5 10.6 3.7 8.5 3.7S4.5 4.5 3.1 5.9l1.3 1.3c1.1-1 2.5-1.6 4.1-1.6z" fill="currentColor" />
      <path d="M8.5 9c.7 0 1.3.3 1.8.7l1.4-1.4C10.9 7.5 9.7 7 8.5 7s-2.4.5-3.2 1.3l1.4 1.4c.5-.4 1.1-.7 1.8-.7z" fill="currentColor" />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function Header({ c }: { c: Conversation }) {
  const unread = c.unread > 0 ? String(c.unread) : '';
  const titleLeft = unread ? 42 + unread.length * 10.5 + 12 : 44;
  return (
    <div className="lp-header">
      <ChevronLeft className="lp-back" size={26} strokeWidth={2.4} style={{ left: 12 }} />
      {unread && <span className="lp-unread">{unread}</span>}
      <span className="lp-title" style={{ left: titleLeft }}>{headerTitle(c)}</span>
      <div className="lp-header-icons">
        <Search size={22} strokeWidth={2} />
        <Phone size={22} strokeWidth={2} />
        <span className="lp-cal"><Calendar size={22} strokeWidth={2} /><span>31</span></span>
        <Menu size={22} strokeWidth={2} />
      </div>
    </div>
  );
}

function InputBar() {
  return (
    <div className="lp-input">
      <Plus size={24} strokeWidth={1.6} style={{ left: 13 }} />
      <Camera size={24} strokeWidth={1.6} style={{ left: 54 }} />
      <Image size={24} strokeWidth={1.6} style={{ left: 95 }} />
      <div className="lp-field">
        <span className="lp-field-text">Aa</span>
        <Smile size={22} strokeWidth={1.6} />
      </div>
      <Mic size={24} strokeWidth={1.6} style={{ left: 402 }} />
    </div>
  );
}
