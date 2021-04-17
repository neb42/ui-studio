import { Element, BaseStyle, IGridStyle, IFlexStyle, TStyle } from '@ui-studio/types';

export class StylesModel {
  static getDefaultStyle = (parent: Element | null): TStyle => {
    if (parent) {
      if (parent.type === 'widget') {
        if (parent.layout?.type === 'grid') {
          return StylesModel.getDefaultGridStyle();
        }
        if (parent.layout?.type === 'flex') {
          return StylesModel.getDefaultFlexStyle();
        }
      }
      return StylesModel.getDefaultBaseStyle();
    }
    throw Error();
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
    };
  };

  static getDefaultFlexStyle = (): IFlexStyle => {
    return {
      type: 'flex',
      align: 'auto',
      grow: 0,
      css: '',
      classNames: '',
    };
  };

  static getDefaultBaseStyle = (): BaseStyle => {
    return {
      type: 'base',
      css: '',
      classNames: '',
    };
  };
}
