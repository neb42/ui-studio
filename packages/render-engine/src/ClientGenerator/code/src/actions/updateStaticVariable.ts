export interface UpdateStaticVariable {
  type: 'UPDATE_STATIC_VARIABLE';
  payload: {
    id: string;
    value: any;
  };
}

export const UPDATE_STATIC_VARIABLE = 'UPDATE_STATIC_VARIABLE';

export const updateStaticVariable = (id: string, value: any): UpdateStaticVariable => ({
  type: UPDATE_STATIC_VARIABLE,
  payload: {
    id,
    value,
  },
});
