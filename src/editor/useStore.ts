import { useEffect, useState } from 'react';
import type { Conversation } from '../domain/types';
import { loadStore, saveStore, type Store } from '../domain/storage';
import { sampleConversations } from '../domain/samples';
import { createConversation, duplicateConversation } from '../domain/conversation';

function initialStore(): Store {
  const saved = loadStore();
  if (saved) {
    // 打開網站時顯示最後修改的那一段
    const latest = [...saved.conversations].sort((a, b) => b.updatedAt - a.updatedAt)[0];
    return { ...saved, currentId: latest.id };
  }
  const samples = sampleConversations();
  return { conversations: samples, currentId: samples[0].id };
}

export function useStore() {
  const [store, setStore] = useState<Store>(initialStore);
  useEffect(() => saveStore(store), [store]);

  const current = store.conversations.find(c => c.id === store.currentId) ?? store.conversations[0];

  /** 修改目前這段對話，順便更新最後修改時間 */
  const update = (fn: (c: Conversation) => Conversation) =>
    setStore(s => ({
      ...s,
      conversations: s.conversations.map(c => (c.id === current.id ? { ...fn(c), updatedAt: Date.now() } : c)),
    }));

  const select = (id: string) => setStore(s => ({ ...s, currentId: id }));

  const add = (cs: Conversation[]) =>
    setStore(s => ({ conversations: [...s.conversations, ...cs], currentId: cs[cs.length - 1]?.id ?? s.currentId }));

  const actions = {
    update,
    select,
    newPersonal: () => add([createConversation('personal')]),
    newGroup: () => add([createConversation('group')]),
    duplicate: () => add([duplicateConversation(current)]),
    importConversations: add,
    remove: () =>
      setStore(s => {
        const rest = s.conversations.filter(c => c.id !== current.id);
        if (!rest.length) {
          const fresh = createConversation('personal');
          return { conversations: [fresh], currentId: fresh.id };
        }
        return { conversations: rest, currentId: rest[0].id };
      }),
  };
  return { store, current, actions };
}
