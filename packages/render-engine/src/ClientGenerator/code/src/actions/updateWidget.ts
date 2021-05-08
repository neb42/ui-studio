export interface UpdateWidget {
  type: 'UPDATE_WIDGET';
  payload: {
    widgetId: string;
    rootId: string | null;
    exposedProperties: any;
  };
}

export const UPDATE_WIDGET = 'UPDATE_WIDGET';

export const updateWidget = (
  widgetId: string,
  rootId: string | null,
  exposedProperties: { [key: string]: any },
): UpdateWidget => ({
  type: UPDATE_WIDGET,
  payload: {
    widgetId,
    rootId,
    exposedProperties,
  },
});
