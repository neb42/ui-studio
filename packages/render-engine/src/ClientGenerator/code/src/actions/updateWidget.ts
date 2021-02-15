export interface UpdateWidget {
  type: 'UPDATE_WIDGET';
  payload: {
    id: string;
    exposedProperties: any;
  };
}

export const UPDATE_WIDGET = 'UPDATE_WIDGET';

export const updateWidget = (
  id: string,
  exposedProperties: { [key: string]: any },
): UpdateWidget => ({
  type: UPDATE_WIDGET,
  payload: {
    id,
    exposedProperties,
  },
});
