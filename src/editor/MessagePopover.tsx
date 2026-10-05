import { useLayoutEffect, useRef, useState } from 'react';
import type { Conversation, Message } from '../domain/types';
import { maxReadCount, moveMessage } from '../domain/conversation';

interface Props {
  conversation: Conversation;
  messageId: string;
  /** 手機預覽的外框；小視窗固定在它左側、靠下對齊，不蓋到聊天畫面 */
  frame: DOMRect;
  onChange: (fn: (c: Conversation) => Conversation) => void;
  onClose: () => void;
}

export function MessagePopover({ conversation: c, messageId, frame, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: frame.left, top: frame.bottom });
  const index = c.messages.findIndex(m => m.id === messageId);
  const m = c.messages[index];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    // 固定在手機預覽左側、底部對齊，不跟著被點的訊息上下移動
    const left = Math.max(8, frame.left - 16 - w);
    const top = Math.max(8, Math.min(window.innerHeight - h - 8, frame.bottom - h));
    setPos({ left, top });
  }, [frame]);

  if (!m) return null;
  const mine = m.from === c.meId;
  const setM = (patch: Partial<Message>) => onChange(x => ({ ...x, messages: x.messages.map(y => (y.id === m.id ? { ...y, ...patch } : y)) }));

  return (
    <div className="popover" ref={ref} style={pos} onMouseDown={e => e.stopPropagation()}>
      <label className="f">發話者
        <select value={m.from} onChange={e => setM({ from: e.target.value })}>
          {c.participants.map(p => <option key={p.id} value={p.id}>{p.name}{p.id === c.meId ? '（我方）' : ''}</option>)}
        </select>
      </label>
      <label className="f">內容<textarea rows={3} value={m.text} onChange={e => setM({ text: e.target.value })} autoFocus /></label>
      <div className="grid2">
        <label className="f">日期<input type="date" value={m.date} onChange={e => e.target.value && setM({ date: e.target.value })} /></label>
        <label className="f">時間<input type="time" value={m.time} onChange={e => e.target.value && setM({ time: e.target.value })} /></label>
      </div>
      <div className="read-row">
      {mine ? (
        <div className="checks">
          <label className="radio"><input type="checkbox" checked={m.read} onChange={e => setM({ read: e.target.checked })} />已讀</label>
          {c.mode === 'group' && (
            <label className="radio">人數
              <input type="number" min={0} max={maxReadCount(c)} value={m.readCount} disabled={!m.read}
                onChange={e => setM({ readCount: Math.min(maxReadCount(c), Math.max(0, +e.target.value || 0)) })} />
            </label>
          )}
        </div>
      ) : (
        <span className="hint">對方的訊息不會顯示已讀。</span>
      )}
      </div>
      <div className="pop-foot">
        <span className="btn-row">
          <button disabled={index === 0} onClick={() => onChange(x => moveMessage(x, index, index - 1))}>上移</button>
          <button disabled={index === c.messages.length - 1} onClick={() => onChange(x => moveMessage(x, index, index + 1))}>下移</button>
        </span>
        <span className="btn-row">
          <button className="danger" onClick={() => { onChange(x => ({ ...x, messages: x.messages.filter(y => y.id !== m.id) })); onClose(); }}>刪除</button>
          <button className="primary" onClick={onClose}>完成</button>
        </span>
      </div>
    </div>
  );
}
