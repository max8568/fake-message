import { useState } from 'react';
import type { Conversation } from '../domain/types';
import { addParticipant, canRemoveParticipant, removeParticipant } from '../domain/conversation';
import { Avatar, AVATAR_NAMES, AVATAR_URLS } from '../phone/Avatar';

interface Props {
  conversation: Conversation;
  onChange: (fn: (c: Conversation) => Conversation) => void;
}

export function ParticipantsPanel({ conversation: c, onChange }: Props) {
  const [picking, setPicking] = useState<string | null>(null);
  const setP = (id: string, patch: Partial<{ name: string; avatar: number }>) =>
    onChange(x => ({ ...x, participants: x.participants.map(p => (p.id === id ? { ...p, ...patch } : p)) }));

  return (
    <section className="panel">
      <h2>參與者</h2>
      <div className="stack">
        {c.participants.map(p => (
          <div key={p.id}>
            <div className="p-row">
              <button className="avatar-btn" title="換頭像" onClick={() => setPicking(picking === p.id ? null : p.id)}>
                <Avatar index={p.avatar} size={34} />
              </button>
              <input type="text" value={p.name} onChange={e => setP(p.id, { name: e.target.value })} aria-label="名字" />
              <label className="radio">
                <input type="radio" name="me" checked={p.id === c.meId} onChange={() => onChange(x => ({ ...x, meId: p.id }))} />我方
              </label>
              {canRemoveParticipant(c) && (
                <button className="icon-btn" title="移除（這個人的訊息會一起刪除）" onClick={() => onChange(x => removeParticipant(x, p.id))}>✕</button>
              )}
            </div>
            {picking === p.id && (
              <div className="avatar-grid">
                {AVATAR_URLS.map((_, i) => (
                  <button key={i} className={`avatar-btn${i === p.avatar ? ' on' : ''}`} title={AVATAR_NAMES[i]} onClick={() => { setP(p.id, { avatar: i }); setPicking(null); }}>
                    <Avatar index={i} size={32} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {c.mode === 'group' && (
        <button className="add-btn" onClick={() => onChange(x => addParticipant(x, `成員 ${x.participants.length}`))}>＋ 新增參與者</button>
      )}
      <p className="hint">新增參與者時，會自動挑一個還沒人用的頭像。</p>
    </section>
  );
}
