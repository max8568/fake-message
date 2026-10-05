import type { Conversation, Message } from './types';
import { dateSeparatorLabel } from './format';

export type ChatRow =
  | { kind: 'separator'; key: string; label: string }
  | {
      kind: 'message';
      key: string;
      message: Message;
      mine: boolean;
      /** 合併的第一則：顯示頭像、名字、尾巴 */
      runStart: boolean;
      /** 合併的最後一則：顯示時間、已讀 */
      runEnd: boolean;
      /** 要顯示的已讀文字；不顯示時是 null */
      readLabel: string | null;
    };

const sameMinuteSameSender = (a: Message, b: Message) =>
  a.from === b.from && a.date === b.date && a.time === b.time;

export function effectiveScreenshotDate(c: Conversation): string {
  return c.screenshotDate || c.messages[c.messages.length - 1]?.date || '';
}

export function effectiveStatusTime(c: Conversation): string {
  return c.statusTime || c.messages[c.messages.length - 1]?.time || '09:41';
}

/** 把訊息排成畫面上的一列一列：插入日期分隔線、判斷合併、算出已讀文字 */
export function buildChatRows(c: Conversation): ChatRow[] {
  const rows: ChatRow[] = [];
  const shot = effectiveScreenshotDate(c);
  const ms = c.messages;
  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    const prev = ms[i - 1];
    const next = ms[i + 1];
    const separatorBefore = !prev || prev.date !== m.date;
    if (separatorBefore) rows.push({ kind: 'separator', key: `sep-${m.id}`, label: dateSeparatorLabel(m.date, shot) });
    // 日期不同就一定有分隔線，所以「同一天」已經包含在 sameMinuteSameSender 裡
    const runStart = separatorBefore || !sameMinuteSameSender(prev, m);
    const runEnd = !next || !sameMinuteSameSender(m, next);
    const mine = m.from === c.meId;
    rows.push({ kind: 'message', key: m.id, message: m, mine, runStart, runEnd, readLabel: readLabel(c, m, mine) });
  }
  return rows;
}

function readLabel(c: Conversation, m: Message, mine: boolean): string | null {
  if (!mine || !m.read) return null;
  if (c.mode === 'personal') return '已讀';
  return m.readCount > 0 ? `已讀 ${m.readCount}` : null;
}
