export interface Source {
  title: string;
  uri: string;
  sourceType: 'web' | 'maps' | 'unknown';
}

export interface GeneratedDocument {
  content: string;
  sources: Source[];
}

export enum AppState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}