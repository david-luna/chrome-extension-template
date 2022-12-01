export type EventWithTarget<T = HTMLElement> = Event & {
  currentTarget: EventTarget & T;
};
