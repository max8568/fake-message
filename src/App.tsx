import { useEffect, useState } from 'react';
import { insertMessage, moveMessage } from './domain/conversation';
import { useStore } from './editor/useStore';
import { ConversationList } from './editor/ConversationList';
import { Composer } from './editor/Composer';
import { ParticipantsPanel } from './editor/ParticipantsPanel';
import { SettingsPanel } from './editor/SettingsPanel';
import { PreviewStage } from './editor/PreviewStage';
import { OutputPanel } from './editor/OutputPanel';
import { MessagePopover } from './editor/MessagePopover';
import { Licenses } from './Licenses';

function useHashRoute() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export function App() {
  const route = useHashRoute();
  if (route === '#/licenses') return <Licenses />;
  return <Editor />;
}

function Editor() {
  const { store, current: c, actions } = useStore();
  const [selected, setSelected] = useState<{ id: string; frame: DOMRect } | null>(null);

  // 換對話、或選到的訊息被刪掉時，關掉小視窗
  const selectedExists = selected && c.messages.some(m => m.id === selected.id);
  useEffect(() => setSelected(null), [c.id]);
  useEffect(() => {
    if (!selected) return;
    const close = () => setSelected(null);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('mousedown', close); window.removeEventListener('keydown', onKey); };
  }, [selected]);

  return (
    <div className="editor">
      <div className="col-left">
        <ConversationList
          conversations={store.conversations}
          current={c}
          onSelect={actions.select}
          onNewPersonal={actions.newPersonal}
          onNewGroup={actions.newGroup}
          onDuplicate={actions.duplicate}
          onRemove={actions.remove}
          onImport={actions.importConversations}
        />
        <Composer conversation={c} onSend={(from, text) => actions.update(x => insertMessage(x, from, text))} />
      </div>
      <PreviewStage
        conversation={c}
        selectedId={selectedExists ? selected.id : null}
        onSelect={(id, bubble) => setSelected({ id, frame: (bubble.closest('.stage-frame') ?? bubble).getBoundingClientRect() })}
        onMove={(from, to) => actions.update(x => moveMessage(x, from, to))}
      />
      <div className="col-right">
        <OutputPanel conversation={c} onOutput={output => actions.update(x => ({ ...x, output }))} />
        <ParticipantsPanel conversation={c} onChange={actions.update} />
        <SettingsPanel conversation={c} onChange={actions.update} />
        <p className="foot"><a href="#/licenses">開源授權</a></p>
      </div>
      {selectedExists && (
        <MessagePopover conversation={c} messageId={selected.id} frame={selected.frame} onChange={actions.update} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
