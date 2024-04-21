export type IEventListenerFactoryEmitBack<T> = {
  payload: T | null;
  eventName: string;
  isTimeout: boolean;
  isError: boolean;
};
