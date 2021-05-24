import { Element, BaseStyle, IGridStyle, IFlexStyle, TStyle } from '@ui-studio/types';

export class StylesModel {
  static getDefaultStyle = (parent?: Element | null): TStyle => {
    if (parent) {
      if (!parent.rootElement) {
        if (parent.layout?.type === 'grid') {
          return StylesModel.getDefaultGridStyle();
        }
        if (parent.layout?.type === 'flex') {
          return StylesModel.getDefaultFlexStyle();
        }
      }
    }
    return StylesModel.getDefaultBaseStyle();
  };

  static getDefaultGridStyle = (): IGridStyle => {
    return {
      type: 'grid',
      css: '',
      classNames: '',
      layout: [
        [0, 0],
        [0, 0],
      ],
      rowAlignment: 'auto',
      columnAlignment: 'auto',
      properties: {
        backgroundColor: null,
        overflow: 'visible',
      },
    };
  };

  static getDefaultFlexStyle = (): IFlexStyle => {
    return {
      type: 'flex',
      align: 'auto',
      grow: 0,
      css: '',
      classNames: '',
      properties: {
        backgroundColor: null,
        overflow: 'visible',
      },
    };
  };

  static getDefaultBaseStyle = (): BaseStyle => {
    return {
      type: 'base',
      css: '',
      classNames: '',
      properties: {
        backgroundColor: null,
        overflow: 'visible',
      },
    };
  };
}
