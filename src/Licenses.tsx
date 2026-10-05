import fluent from './licenses/fluent-emoji.txt?raw';
import lucide from './licenses/lucide.txt?raw';
import snapdom from './licenses/snapdom.txt?raw';
import react from './licenses/react.txt?raw';

const ITEMS = [
  { name: 'Microsoft Fluent Emoji', use: '12 個匿名頭像的圖案', url: 'https://github.com/microsoft/fluentui-emoji', text: fluent },
  { name: 'Lucide', use: '標題列、輸入框、靜音的圖示', url: 'https://lucide.dev', text: lucide },
  { name: 'snapdom', use: '把畫面轉成 PNG', url: 'https://github.com/zumerlab/snapdom', text: snapdom },
  { name: 'React、React DOM、scheduler', use: '網站介面', url: 'https://react.dev', text: react },
];

const FONTS = [
  { name: 'Noto Sans TC', url: 'https://fonts.google.com/noto/specimen/Noto+Sans+TC' },
  { name: 'Inter', url: 'https://fonts.google.com/specimen/Inter' },
  { name: 'Noto Color Emoji', url: 'https://fonts.google.com/noto/specimen/Noto+Color+Emoji' },
];

export function Licenses() {
  return (
    <main className="licenses">
      <p><a href="#/">← 回到對話產生器</a></p>
      <h1>開源授權</h1>
      <p>這個網站用到下面這些開源素材和套件。輸出的截圖上不需要標示出處。</p>
      <h2>字型</h2>
      <p>
        {FONTS.map((f, i) => <span key={f.name}>{i > 0 && '、'}<a href={f.url} target="_blank" rel="noreferrer">{f.name}</a></span>)}
        ，由 Google Fonts 提供，採用 <a href="https://openfontlicense.org" target="_blank" rel="noreferrer">SIL Open Font License 1.1</a>。
      </p>
      {ITEMS.map(it => (
        <section key={it.name}>
          <h2><a href={it.url} target="_blank" rel="noreferrer">{it.name}</a></h2>
          <p className="hint">用在：{it.use}</p>
          <pre>{it.text.replace(/^ {4}/gm, '').trim()}</pre>
        </section>
      ))}
    </main>
  );
}
