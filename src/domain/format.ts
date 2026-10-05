const WEEKDAYS = '日一二三四五六';

const pad2 = (n: number) => String(n).padStart(2, '0');

function parseDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toYmd(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function toHm(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function addDays(ymd: string, days: number): string {
  const d = parseDate(ymd);
  d.setDate(d.getDate() + days);
  return toYmd(d);
}

/** 日期分隔線的文字：今天、昨天、8/31 (週一)、2025/8/31 (週日) */
export function dateSeparatorLabel(date: string, screenshotDate: string): string {
  if (date === screenshotDate) return '今天';
  if (date === addDays(screenshotDate, -1)) return '昨天';
  const d = parseDate(date);
  const md = `${d.getMonth() + 1}/${d.getDate()} (週${WEEKDAYS[d.getDay()]})`;
  return d.getFullYear() === parseDate(screenshotDate).getFullYear() ? md : `${d.getFullYear()}/${md}`;
}

/** 訊息旁的時間：24 小時制 10:01；12 小時制 上午 10:01、下午 3:45 */
export function messageTimeLabel(time: string, hour24: boolean): string {
  const [h, m] = time.split(':').map(Number);
  if (hour24) return `${pad2(h)}:${pad2(m)}`;
  return `${h < 12 ? '上午' : '下午'} ${h % 12 || 12}:${pad2(m)}`;
}

/** 狀態列的時間：12 小時制時不寫上午、下午 */
export function statusTimeLabel(time: string, hour24: boolean): string {
  const [h, m] = time.split(':').map(Number);
  return hour24 ? `${pad2(h)}:${pad2(m)}` : `${h % 12 || 12}:${pad2(m)}`;
}
