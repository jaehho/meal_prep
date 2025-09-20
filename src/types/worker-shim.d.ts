// Minimal global Worker shim to satisfy Vite type defs without enabling lib.webworker
// This avoids DOM/WebWorker lib conflicts in TS 5.x.
declare class Worker {
  constructor(stringUrl: string | URL, options?: any);
  postMessage(message: any, transfer?: any[]): void;
  terminate(): void;
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
}
