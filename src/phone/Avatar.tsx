const files = import.meta.glob('../assets/avatars/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/** 12 個匿名頭像的圖檔網址，順序照檔名的編號 */
export const AVATAR_URLS = Object.keys(files).sort().map(k => files[k]);
export const AVATAR_NAMES = ['鉛筆', '火箭', '蜜蜂', '電燈泡', '棕櫚樹', '栗子', '企鵝', '霜淇淋', '星球', '鬱金香', '畫框', '彎月'];
const BACKGROUNDS = ['#FFE3E3', '#E3F0FF', '#FFF4D6', '#E6F7EA', '#F1E6FF', '#FFEBD9'];

export function Avatar({ index, size }: { index: number; size: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: '50%', background: BACKGROUNDS[index % 6], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', overflow: 'hidden' }}>
      <img src={AVATAR_URLS[index]} alt={AVATAR_NAMES[index]} style={{ width: '62%', height: '62%', display: 'block' }} draggable={false} />
    </span>
  );
}
