// * GDK Application Shell Default File
export class EventListenerErrorEvent {
  constructor(
    public sourceEvent: string,
    public sourceHandlerName: string,
    public errorMeta: any,
  ) {}
}
