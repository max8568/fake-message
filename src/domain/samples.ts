import type { Conversation } from './types';
import { addDays, toYmd } from './format';
import { createConversation, newId } from './conversation';

/** 第一次打開網站時放好的兩段範例對話 */
export function sampleConversations(now = new Date()): Conversation[] {
  const today = toYmd(now);
  const yesterday = addDays(today, -1);

  const personal = createConversation('personal', ['我', '小美']);
  const [me, mei] = personal.participants;
  personal.messages = [
    { from: mei.id, text: '明天要不要去看展？', date: yesterday, time: '21:40' },
    { from: me.id, text: '好啊！幾點？', date: yesterday, time: '21:42' },
    { from: mei.id, text: '下午兩點信義區', date: yesterday, time: '21:43' },
    { from: mei.id, text: '我先買票 🎫', date: yesterday, time: '21:43' },
    { from: me.id, text: '出門了', date: today, time: '13:20' },
    { from: me.id, text: '大概 30 分鐘到', date: today, time: '13:20' },
  ].map(m => ({ ...m, id: newId(), read: true, readCount: 0 }));

  const group = createConversation('group', ['我', '阿傑', '小美', '媽媽'], '週末烤肉');
  group.groupSize = 5;
  const [gMe, jie, gMei, mom] = group.participants;
  group.messages = [
    { from: jie.id, text: '這週六誰要來烤肉？', time: '10:02' },
    { from: gMei.id, text: '我可以！', time: '10:05' },
    { from: gMei.id, text: '要帶什麼嗎', time: '10:05' },
    { from: mom.id, text: '我負責飲料 🍉', time: '10:11' },
    { from: gMe.id, text: '我帶肉跟炭', time: '10:12' },
  ].map(m => ({ ...m, id: newId(), date: today, read: true, readCount: 4 }));

  return [personal, group];
}
