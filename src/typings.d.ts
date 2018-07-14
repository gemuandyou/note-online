/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface Element {
  offsetTop: number;
}

interface GMCalendar {
    element: any,
    settings: any,
    on: any,
    refreshSetting: any
}

declare var GMCalendar: {
    prototype: GMCalendar;
    new(element, settings): GMCalendar;
    element: any;
    settings: any;
};
