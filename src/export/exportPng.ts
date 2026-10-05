import type { Conversation } from '../domain/types';

/** 長截圖輸出的 PNG 最高 16,384px（spec 6.8） */
export const LONG_MAX_PX = 16384;

export const exportScale = (c: Conversation) => (c.output === 'single' ? 3 : 2);

export function exceedsLimit(c: Conversation, heightPt: number): boolean {
  return c.output === 'long' && heightPt * exportScale(c) > LONG_MAX_PX;
}

/** 等對話裡用到的字都載入完成，否則轉出來會是預設字型 */
async function waitForFonts(c: Conversation) {
  await document.fonts.ready;
  const text = c.messages.map(m => m.text).join('') + c.participants.map(p => p.name).join('') + c.groupName + '今天昨天已讀上午下午週日一二三四五六0123456789:/() Aa';
  const families = ['"Inter"', '"Noto Sans TC"', '"Noto Color Emoji"'];
  const weights = ['400', '600', '700'];
  await Promise.all(families.flatMap(f => weights.map(w => document.fonts.load(`${w} 16px ${f}`, text).catch(() => []))));
}

/** 把畫好的 LINE 畫面轉成 PNG 並下載 */
export async function downloadPng(el: HTMLElement, c: Conversation, filename: string) {
  await waitForFonts(c);
  // 只有按下載時才載入 snapdom，網站打開比較快
  const { snapdom } = await import('@zumer/snapdom');
  const capture = await snapdom(el, { scale: exportScale(c), dpr: 1, embedFonts: true });
  const blob = await capture.toBlob({ format: 'png', scale: exportScale(c), dpr: 1 });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
