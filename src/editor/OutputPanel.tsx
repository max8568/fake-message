import { useLayoutEffect, useRef, useState } from 'react';
import type { Conversation, OutputStyle } from '../domain/types';
import { headerTitle } from '../domain/conversation';
import { LinePhone } from '../phone/LinePhone';
import { downloadPng, exceedsLimit } from '../export/exportPng';

interface Props {
  conversation: Conversation;
  onOutput: (o: OutputStyle) => void;
}

export function OutputPanel({ conversation: c, onOutput }: Props) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exportHeight, setExportHeight] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // 量輸出用那一份的實際高度，判斷長截圖有沒有超過上限
  useLayoutEffect(() => {
    setExportHeight(exportRef.current?.firstElementChild?.getBoundingClientRect().height ?? 0);
  });

  const tooLong = exceedsLimit(c, exportHeight);
  const download = async () => {
    const el = exportRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    setBusy(true);
    setError('');
    try {
      const kind = c.output === 'single' ? '單頁' : '長截圖';
      await downloadPng(el, c, `${headerTitle(c) || 'LINE'}-${kind}.png`);
    } catch (e) {
      setError('輸出失敗：' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel output">
      <h2>輸出</h2>
      <div className="output-row">
        <div className="seg">
          <button className={c.output === 'single' ? 'on' : ''} onClick={() => onOutput('single')}>單頁截圖</button>
          <button className={c.output === 'long' ? 'on' : ''} onClick={() => onOutput('long')}>長截圖</button>
        </div>
        <button className="primary" disabled={busy || tooLong || !c.messages.length} onClick={download}>{busy ? '輸出中…' : '下載 PNG'}</button>
      </div>
      {tooLong && <p className="error">對話太長，請複製成兩段</p>}
      {error && <p className="error">{error}</p>}
      {/* 輸出用的那一份：原尺寸、沒有互動提示，放在畫面外 */}
      <div ref={exportRef} className="export-host" aria-hidden>
        <LinePhone conversation={c} />
      </div>
    </section>
  );
}
