import type { Conversation } from './types';
import { newId } from './conversation';

/** 匯出檔的格式版本。資料格式改變時加 1，並在 MIGRATIONS 補上舊版轉新版的函式 */
export const FORMAT_VERSION = 1;

const MIGRATIONS: Record<number, (data: unknown) => unknown> = {
  // 例：2: v1 => ({ ...v1, 新欄位: 預設值 }),
};

export interface Store {
  conversations: Conversation[];
  currentId: string;
}

interface ExportFile {
  format: 'fake-message';
  version: number;
  conversations: Conversation[];
}

const STORAGE_KEY = 'fake-message:store';

export function loadStore(): Store | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version: number; store: Store };
    const store = migrate(parsed.version, parsed.store) as Store;
    return store.conversations.length ? store : null;
  } catch {
    return null;
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: FORMAT_VERSION, store }));
  } catch {
    // 瀏覽器不給存（例如無痕模式額度用完）：畫面照常運作，只是不會記住
  }
}

function migrate(version: number, data: unknown): unknown {
  if (version > FORMAT_VERSION) throw new Error('這個檔案是用比較新的版本匯出的，請重新整理網頁再試一次');
  let d = data;
  for (let v = version + 1; v <= FORMAT_VERSION; v++) d = MIGRATIONS[v](d);
  return d;
}

export function exportFile(conversations: Conversation[]): string {
  const file: ExportFile = { format: 'fake-message', version: FORMAT_VERSION, conversations };
  return JSON.stringify(file, null, 2);
}

/** 讀匯出檔。匯入的對話一律換新 id，新增成新的對話 */
export function importFile(text: string): Conversation[] {
  let parsed: ExportFile;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('這不是正確的匯出檔（JSON 格式錯誤）');
  }
  if (parsed?.format !== 'fake-message' || typeof parsed.version !== 'number' || !Array.isArray(parsed.conversations)) {
    throw new Error('這不是這個網站匯出的檔案');
  }
  const { conversations } = migrate(parsed.version, parsed) as ExportFile;
  return conversations.map(c => ({ ...c, id: newId(), updatedAt: Date.now() }));
}
