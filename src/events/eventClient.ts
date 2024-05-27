type EventListener = (...args: any[]) => void;

// 一个简单的事件订阅发布模式的实现
export class EventClient {
  private _events: Map<string, Set<EventListener>> = new Map();

  // 监听事件
  public on(event: string, listener: EventListener) {
    if (!this._events.has(event)) {
      this._events.set(event, new Set());
    }
    this._events.get(event)!.add(listener);
  }

  public once(event: string, listener: EventListener) {
    const onceListener = (...args: any[]) => {
      listener(...args);
      this.off(event, onceListener);
    };
    this.on(event, onceListener);
  }

  // 触发事件
  public emit(event: string, ...args: any[]) {
    if (this._events.has(event)) {
      this._events.get(event)!.forEach((listener) => {
        listener(...args);
      });
    }
  }

  // 移除事件
  public off(event: string, listener: EventListener) {
    if (this._events.has(event)) {
      this._events.get(event)!.delete(listener);
    }
  }

  public offAll(event: string) {
    if (this._events.has(event)) {
      this._events.delete(event);
    }
  }

  public offAllEvents() {
    this._events.clear();
  }
}
