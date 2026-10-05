import { useRef, useState } from 'react';
import type { Conversation } from '../domain/types';
import { headerTitle, participant } from '../domain/conversation';
import { exportFile, importFile } from '../domain/storage';

interface Props {
  conversations: Conversation[];
  current: Conversation;
  onSelect: (id: string) => void;
  onNewPersonal: () => void;
  onNewGroup: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onImport: (cs: Conversation[]) => void;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function ConversationList(p: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      p.onImport(importFile(await f.text()));
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <section className="panel conv-list">
      <h2>對話清單</h2>
      <div className="conv-items">
        {p.conversations.map(c => (
          <button key={c.id} className={`conv-item${c.id === p.current.id ? ' on' : ''}`} onClick={() => p.onSelect(c.id)}>
            <b>{headerTitle(c) || '（還沒有名字）'}</b>
            <small>我方：{participant(c, c.meId)?.name}・{new Date(c.updatedAt).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} 修改</small>
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button onClick={p.onNewPersonal}>＋ 個人對話</button>
        <button onClick={p.onNewGroup}>＋ 群組</button>
        <button onClick={p.onDuplicate}>複製</button>
        {confirming ? (
          <span className="confirm">
            確定刪除「{headerTitle(p.current)}」？
            <button className="danger" onClick={() => { p.onRemove(); setConfirming(false); }}>刪除</button>
            <button onClick={() => setConfirming(false)}>取消</button>
          </span>
        ) : (
          <button onClick={() => setConfirming(true)}>刪除</button>
        )}
      </div>
      <div className="btn-row">
        <button onClick={() => download(`${headerTitle(p.current)}-${stamp()}.json`, exportFile([p.current]))}>匯出這段</button>
        <button onClick={() => download(`fake-message-全部-${stamp()}.json`, exportFile(p.conversations))}>匯出全部</button>
        <button onClick={() => fileRef.current?.click()}>匯入</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => onFile(e.target.files?.[0])} />
      </div>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
