import type { Conversation, ConversationMode, Network } from '../domain/types';
import { addParticipant, canSwitchMode, others } from '../domain/conversation';
import { effectiveScreenshotDate, effectiveStatusTime } from '../domain/layout';

interface Props {
  conversation: Conversation;
  onChange: (fn: (c: Conversation) => Conversation) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

export function SettingsPanel({ conversation: c, onChange }: Props) {
  const set = (patch: Partial<Conversation>) => onChange(x => ({ ...x, ...patch }));
  const setMode = (mode: ConversationMode) => {
    if (mode === 'personal' && !canSwitchMode(c, 'personal')) return;
    onChange(x => {
      // 群組至少要兩位對方，不夠就自動補一位
      let y = mode === 'group' && others(x).length < 2 ? addParticipant(x, `成員 ${x.participants.length}`) : x;
      y = { ...y, mode, groupName: mode === 'group' && !y.groupName ? '新群組' : y.groupName };
      return { ...y, groupSize: Math.max(y.groupSize, y.participants.length) };
    });
  };

  return (
    <section className="panel">
      <h2>對話設定</h2>
      <div className="grid3">
        <label className="f">模式
          <select value={c.mode} onChange={e => setMode(e.target.value as ConversationMode)}>
            <option value="personal" disabled={!canSwitchMode(c, 'personal')}>{canSwitchMode(c, 'personal') ? '個人對話' : '個人對話（只能有一位對方）'}</option>
            <option value="group">群組對話</option>
          </select>
        </label>
        <label className="f">外觀
          <select value={c.theme} onChange={e => set({ theme: e.target.value as Conversation['theme'] })}>
            <option value="light">淺色</option><option value="dark">深色</option>
          </select>
        </label>
        <label className="f">時間制
          <select value={c.hour24 ? '24' : '12'} onChange={e => set({ hour24: e.target.value === '24' })}>
            <option value="24">24 小時</option><option value="12">12 小時</option>
          </select>
        </label>
      </div>
      {c.mode === 'group' && (
        <div className="grid-name">
          <label className="f">群組名稱<input type="text" value={c.groupName} onChange={e => set({ groupName: e.target.value })} /></label>
          <label className="f">人數<input type="number" min={c.participants.length} value={c.groupSize} onChange={e => set({ groupSize: clamp(+e.target.value, c.participants.length, 9999) })} /></label>
        </div>
      )}
      <label className="f">截圖日期（判斷今天、昨天）
        <input type="date" value={effectiveScreenshotDate(c)} onChange={e => set({ screenshotDate: e.target.value })} />
      </label>

      <h3>單頁截圖才有</h3>
      <div className="grid3 wide-first">
        <label className="f">狀態列時間<input type="time" value={effectiveStatusTime(c)} onChange={e => set({ statusTime: e.target.value })} /></label>
        <label className="f">電量<input type="number" min={0} max={100} value={c.battery} onChange={e => set({ battery: clamp(+e.target.value, 0, 100) })} /></label>
        <label className="f">訊號
          <select value={c.signal} onChange={e => set({ signal: +e.target.value })}>
            {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} 格</option>)}
          </select>
        </label>
        <label className="f">網路
          <select value={c.network} onChange={e => set({ network: e.target.value as Network })}>
            <option value="wifi">Wi-Fi</option><option value="5g">5G</option><option value="4g">4G</option><option value="none">不顯示</option>
          </select>
        </label>
        <label className="f">未讀數<input type="number" min={0} max={999} value={c.unread} onChange={e => set({ unread: clamp(+e.target.value, 0, 999) })} /></label>
      </div>
      <div className="checks">
        <label className="radio"><input type="checkbox" checked={c.mute} onChange={e => set({ mute: e.target.checked })} />靜音</label>
        <label className="radio"><input type="checkbox" checked={c.showInput} onChange={e => set({ showInput: e.target.checked })} />輸入框</label>
      </div>
    </section>
  );
}
