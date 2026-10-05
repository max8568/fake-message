import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '../domain/types';
import { Avatar } from '../phone/Avatar';

interface Props {
  conversation: Conversation;
  onSend: (from: string, text: string) => void;
}

export function Composer({ conversation: c, onSend }: Props) {
  const [sender, setSender] = useState(c.meId);
  const [text, setText] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  // 換對話或發話者被移除時，回到我方
  const senderId = c.participants.some(p => p.id === sender) ? sender : c.meId;
  useEffect(() => setSender(c.meId), [c.id, c.meId]);

  const send = () => {
    if (!text.trim()) return;
    onSend(senderId, text.replace(/\s+$/, ''));
    setText('');
  };
  const nextSender = () => {
    const ps = c.participants;
    setSender(ps[(ps.findIndex(p => p.id === senderId) + 1) % ps.length].id);
  };

  return (
    <section className="panel composer">
      <h2>輸入訊息</h2>
      <div className="chips">
        {c.participants.map(p => (
          <button key={p.id} className={`chip${p.id === senderId ? ' on' : ''}`} onClick={() => { setSender(p.id); ref.current?.focus(); }}>
            <Avatar index={p.avatar} size={22} />
            {p.name}{p.id === c.meId && '（我方）'}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        value={text}
        placeholder="輸入訊息，Enter 送出，Shift+Enter 換行"
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          // 注音選字時按的 Enter 不送出
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); }
          if (e.key === 'Tab') { e.preventDefault(); nextSender(); }
        }}
      />
      <div className="composer-foot">
        <span className="hint">Tab 換下一位發話者</span>
        <button className="primary" onClick={send}>送出</button>
      </div>
      <p className="hint">點預覽裡的訊息可以修改，拖拉可以排序</p>
    </section>
  );
}
