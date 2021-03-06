import { Element, BaseStyle, IGridStyle, IFlexStyle, IPageStyle, TStyle } from 'canvas-types';

export class StylesModel {
  static getDefaultStyle = (parent: Element | null): TStyle => {
    if (parent) {
      if (parent.type === 'layout') {
        if (parent.layoutType === 'grid') {
          return StylesModel.getDefaultGridStyle();
        }
        if (parent.layoutType === 'flex') {
          return StylesModel.getDefaultFlexStyle();
        }
      }
      if (parent.type === 'page') {
        return StylesModel.getDefaultPageStyle();
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

  static getDefaultPageStyle = (): IPageStyle => {
    return {
      type: 'page',
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
