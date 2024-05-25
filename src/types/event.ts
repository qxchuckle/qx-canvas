import { EventObject } from "../events";

export type EventMap = {
  click: EventObject;
  mousedown: EventObject;
  mouseup: EventObject;
  mouseenter: EventObject;
  mouseleave: EventObject;
  mousemove: EventObject;
  mouseout: EventObject;
  mouseover: EventObject;
};
export type EventType = keyof EventMap;

export type EventListener = (e: EventObject) => any;
export type EventOptions = Pick<AddEventListenerOptions, "capture" | "once">;
