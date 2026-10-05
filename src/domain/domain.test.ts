import { describe, expect, it } from 'vitest';
import { dateSeparatorLabel, messageTimeLabel, statusTimeLabel } from './format';
import { buildChatRows } from './layout';
import { canSwitchMode, createConversation, insertMessage, pickAvatar, removeParticipant } from './conversation';
import { exportFile, importFile } from './storage';
import type { Conversation, Message } from './types';

describe('日期分隔線的寫法', () => {
  const shot = '2026-10-05';
  it('截圖日期當天是今天，前一天是昨天', () => {
    expect(dateSeparatorLabel('2026-10-05', shot)).toBe('今天');
    expect(dateSeparatorLabel('2026-10-04', shot)).toBe('昨天');
  });
  it('同一年寫月/日 (週幾)，不補零，含比截圖日期晚的日子', () => {
    expect(dateSeparatorLabel('2026-08-31', shot)).toBe('8/31 (週一)');
    expect(dateSeparatorLabel('2026-12-25', shot)).toBe('12/25 (週五)');
  });
  it('不同年加上年份', () => {
    expect(dateSeparatorLabel('2025-08-31', shot)).toBe('2025/8/31 (週日)');
  });
  it('跨年時的昨天', () => {
    expect(dateSeparatorLabel('2025-12-31', '2026-01-01')).toBe('昨天');
  });
});

describe('時間的寫法', () => {
  it('24 小時制補零', () => {
    expect(messageTimeLabel('09:05', true)).toBe('09:05');
  });
  it('12 小時制寫上午、下午，中午和午夜是 12', () => {
    expect(messageTimeLabel('10:01', false)).toBe('上午 10:01');
    expect(messageTimeLabel('15:45', false)).toBe('下午 3:45');
    expect(messageTimeLabel('12:00', false)).toBe('下午 12:00');
    expect(messageTimeLabel('00:30', false)).toBe('上午 12:30');
  });
  it('狀態列在 12 小時制不寫上午、下午', () => {
    expect(statusTimeLabel('13:25', false)).toBe('1:25');
    expect(statusTimeLabel('13:25', true)).toBe('13:25');
  });
});

function conv(mode: 'personal' | 'group', msgs: Partial<Message>[]): Conversation {
  const c = createConversation(mode, mode === 'personal' ? ['我', '小美'] : ['我', 'A', 'B']);
  c.groupSize = 5;
  c.screenshotDate = '2026-10-05';
  c.messages = msgs.map((m, i) => ({ id: 'm' + i, from: c.participants[0].id, text: 't', date: '2026-10-05', time: '10:00', read: true, readCount: 4, ...m }));
  return c;
}
const messageRows = (c: Conversation) => buildChatRows(c).filter(r => r.kind === 'message');

describe('日期分隔線的位置', () => {
  it('第一則前面一定有，日期變了才再插，往回跳也插', () => {
    const c = conv('personal', [{ date: '2026-10-04' }, { date: '2026-10-04' }, { date: '2026-10-05' }, { date: '2026-10-04' }]);
    const kinds = buildChatRows(c).map(r => r.kind === 'separator' ? r.label : 'msg');
    expect(kinds).toEqual(['昨天', 'msg', 'msg', '今天', 'msg', '昨天', 'msg']);
  });
});

describe('連續訊息的合併', () => {
  it('同一個人、同一分鐘才合併：只有第一則有頭像，只有最後一則有時間', () => {
    const c = conv('group', [{}, {}, { time: '10:01' }]);
    const rows = messageRows(c);
    expect(rows.map(r => r.kind === 'message' && [r.runStart, r.runEnd])).toEqual([[true, false], [false, true], [true, true]]);
  });
  it('不同人不合併', () => {
    const c = conv('group', [{}, {}]);
    c.messages[1].from = c.participants[1].id;
    expect(messageRows(c).every(r => r.kind === 'message' && r.runStart && r.runEnd)).toBe(true);
  });
  it('中間有日期分隔線就不合併', () => {
    const c = conv('group', [{ date: '2026-10-04' }, { date: '2026-10-05' }]);
    expect(messageRows(c).every(r => r.kind === 'message' && r.runStart && r.runEnd)).toBe(true);
  });
});

describe('已讀', () => {
  it('個人對話寫已讀，群組寫已讀 N，N 是 0 不顯示', () => {
    expect(messageRows(conv('personal', [{}]))[0]).toMatchObject({ readLabel: '已讀' });
    expect(messageRows(conv('group', [{ readCount: 3 }]))[0]).toMatchObject({ readLabel: '已讀 3' });
    expect(messageRows(conv('group', [{ readCount: 0 }]))[0]).toMatchObject({ readLabel: null });
  });
  it('對方的訊息不顯示已讀；換我方後原本的已讀被藏起來，換回來又出現', () => {
    const c = conv('personal', [{}]);
    const original = c.meId;
    c.meId = c.participants[1].id;
    expect(messageRows(c)[0]).toMatchObject({ mine: false, readLabel: null });
    c.meId = original;
    expect(messageRows(c)[0]).toMatchObject({ mine: true, readLabel: '已讀' });
  });
});

describe('對話的操作', () => {
  it('新訊息跟前一則同一分鐘', () => {
    const c = insertMessage(conv('personal', [{ time: '21:43' }]), 'x', 'hi');
    expect(c.messages[1]).toMatchObject({ date: '2026-10-05', time: '21:43', read: true });
  });
  it('頭像先挑沒用過的，12 個都用掉才重複', () => {
    expect(pickAvatar([0, 1, 3])).toBe(2);
    expect(pickAvatar([...Array(12).keys()])).toBe(0);
  });
  it('個人對話只能有一位對方', () => {
    const g = conv('group', []);
    expect(canSwitchMode(g, 'personal')).toBe(false);
    const p = removeParticipant(g, g.participants[2].id);
    expect(canSwitchMode(p, 'personal')).toBe(true);
  });
  it('移除參與者時，他的訊息一起刪掉', () => {
    const c = conv('group', [{}, {}]);
    c.messages[1].from = c.participants[2].id;
    expect(removeParticipant(c, c.participants[2].id).messages).toHaveLength(1);
  });
});

describe('匯出和匯入', () => {
  it('匯出再匯入，內容一樣但 id 換新', () => {
    const c = conv('group', [{ text: '你好 😂' }]);
    const back = importFile(exportFile([c]));
    expect(back[0].messages[0].text).toBe('你好 😂');
    expect(back[0].id).not.toBe(c.id);
  });
  it('匯出檔有格式版本號', () => {
    expect(JSON.parse(exportFile([]))).toMatchObject({ format: 'fake-message', version: 1 });
  });
  it('不是這個網站的檔案會被擋下', () => {
    expect(() => importFile('{"a":1}')).toThrow('不是這個網站匯出的檔案');
    expect(() => importFile('not json')).toThrow('JSON 格式錯誤');
  });
});
