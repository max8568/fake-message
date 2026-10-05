// 用詞照 CONTEXT.md：對話、參與者、我方、訊息、截圖日期……

export type ConversationMode = 'personal' | 'group';
export type Theme = 'light' | 'dark';
export type Network = 'wifi' | '5g' | '4g' | 'none';
export type OutputStyle = 'single' | 'long';

export interface Participant {
  id: string;
  name: string;
  /** 匿名頭像編號 0–11 */
  avatar: number;
}

export interface Message {
  id: string;
  from: string;
  text: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM，24 小時制 */
  time: string;
  /** 每則訊息自己的已讀開關，只有我方的訊息會顯示 */
  read: boolean;
  /** 群組的已讀人數，0 到「群組人數減 1」 */
  readCount: number;
}

export interface Conversation {
  id: string;
  mode: ConversationMode;
  participants: Participant[];
  meId: string;
  messages: Message[];
  groupName: string;
  /** 標題列括號裡的人數，不能比參與者人數少 */
  groupSize: number;
  theme: Theme;
  hour24: boolean;
  /** YYYY-MM-DD；空字串表示用最後一則訊息的日期 */
  screenshotDate: string;
  /** HH:MM；空字串表示用最後一則訊息的時間 */
  statusTime: string;
  mute: boolean;
  battery: number;
  signal: number;
  network: Network;
  unread: number;
  showInput: boolean;
  output: OutputStyle;
  updatedAt: number;
}
