import type { Conversation, ConversationMode, Message, Participant } from './types';
import { toHm, toYmd } from './format';

export const AVATAR_COUNT = 12;

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** 挑一個這段對話裡還沒人用的頭像；12 個都用掉就允許重複 */
export function pickAvatar(used: number[]): number {
  for (let i = 0; i < AVATAR_COUNT; i++) if (!used.includes(i)) return i;
  return used.length % AVATAR_COUNT;
}

export function makeParticipants(names: string[]): Participant[] {
  const ps: Participant[] = [];
  for (const name of names) ps.push({ id: newId(), name, avatar: pickAvatar(ps.map(p => p.avatar)) });
  return ps;
}

export function createConversation(mode: ConversationMode, names?: string[], groupName = ''): Conversation {
  const ps = makeParticipants(names ?? (mode === 'personal' ? ['我', '朋友'] : ['我', '朋友 A', '朋友 B']));
  return {
    id: newId(), mode, participants: ps, meId: ps[0].id, messages: [],
    groupName: mode === 'group' ? groupName || '新群組' : '', groupSize: ps.length,
    theme: 'light', hour24: true, screenshotDate: '', statusTime: '',
    mute: false, battery: 100, signal: 4, network: 'wifi', unread: 0, showInput: true, output: 'single',
    updatedAt: Date.now(),
  };
}

export const others = (c: Conversation) => c.participants.filter(p => p.id !== c.meId);
export const participant = (c: Conversation, id: string) => c.participants.find(p => p.id === id);

/** 標題列上的名字：個人對話是對方名字，群組是「群組名稱 (人數)」 */
export function headerTitle(c: Conversation): string {
  if (c.mode === 'personal') return others(c)[0]?.name ?? '';
  return `${c.groupName} (${c.groupSize})`;
}

export const maxReadCount = (c: Conversation) => Math.max(0, c.groupSize - 1);

/** 新訊息的預設日期時間：跟前一則相同；沒有前一則就用現在 */
export function defaultDateTime(prev: Message | undefined, now = new Date()) {
  return prev ? { date: prev.date, time: prev.time } : { date: toYmd(now), time: toHm(now) };
}

/** 在 index 位置插入一則訊息（預設加在最後） */
export function insertMessage(c: Conversation, from: string, text: string, index = c.messages.length, now = new Date()): Conversation {
  const { date, time } = defaultDateTime(c.messages[index - 1], now);
  const m: Message = { id: newId(), from, text, date, time, read: true, readCount: maxReadCount(c) };
  const messages = [...c.messages];
  messages.splice(index, 0, m);
  return { ...c, messages };
}

export function moveMessage(c: Conversation, fromIndex: number, toIndex: number): Conversation {
  if (toIndex < 0 || toIndex >= c.messages.length || fromIndex === toIndex) return c;
  const messages = [...c.messages];
  const [m] = messages.splice(fromIndex, 1);
  messages.splice(toIndex, 0, m);
  return { ...c, messages };
}

/** 可以切換成這個模式嗎：個人對話只能有一位對方，群組至少兩位對方 */
export function canSwitchMode(c: Conversation, mode: ConversationMode): boolean {
  const n = others(c).length;
  return mode === 'personal' ? n === 1 : n >= 2;
}

export function canRemoveParticipant(c: Conversation): boolean {
  return c.mode === 'group' && others(c).length > 2;
}

/** 移除參與者，這個人發的訊息一起刪除 */
export function removeParticipant(c: Conversation, id: string): Conversation {
  const participants = c.participants.filter(p => p.id !== id);
  return {
    ...c, participants,
    meId: c.meId === id ? participants[0].id : c.meId,
    messages: c.messages.filter(m => m.from !== id),
  };
}

export function addParticipant(c: Conversation, name: string): Conversation {
  const p: Participant = { id: newId(), name, avatar: pickAvatar(c.participants.map(x => x.avatar)) };
  const participants = [...c.participants, p];
  return { ...c, participants, groupSize: Math.max(c.groupSize, participants.length) };
}

/** 複製一段對話（給「換我方看另一個角度」用） */
export function duplicateConversation(c: Conversation): Conversation {
  return { ...structuredClone(c), id: newId(), updatedAt: Date.now() };
}
