import { useLayoutEffect, useRef, useState } from 'react';
import type { Conversation } from '../domain/types';
import { LinePhone } from '../phone/LinePhone';

interface Props {
  conversation: Conversation;
  selectedId: string | null;
  onSelect: (id: string, bubble: HTMLElement) => void;
  onMove: (from: number, to: number) => void;
}

export function PreviewStage({ conversation: c, selectedId, onSelect, onMove }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // 預覽依中間欄的大小縮放，整支手機一次看得完
  useLayoutEffect(() => {
    const fit = () => {
      const box = boxRef.current;
      if (!box) return;
      const byWidth = box.clientWidth / 440;
      const byHeight = c.output === 'single' ? box.clientHeight / 956 : 1;
      setScale(Math.max(0.4, Math.min(1, byWidth, byHeight)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [c.output]);

  return (
    <section className="stage" ref={boxRef}>
      <div className={`stage-frame ${c.output}`} style={{ width: 440 * scale, height: c.output === 'single' ? 956 * scale : undefined }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 440 }}>
          <LinePhone conversation={c} interaction={{ selectedId, onSelect, onMove }} />
        </div>
      </div>
    </section>
  );
}
