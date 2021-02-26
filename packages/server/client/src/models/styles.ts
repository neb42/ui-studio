import { Element, BaseStyle, IGridStyle, IFlexStyle, IPageStyle, TStyle } from 'canvs-types';

export class Styles {
  static getDefaultStyle = (parent: Element | null): TStyle => {
    if (parent) {
      if (parent.type === 'layout') {
        if (parent.layoutType === 'grid') {
          return Styles.getDefaultGridStyle();
        }
        if (parent.layoutType === 'flex') {
          return Styles.getDefaultFlexStyle();
        }
      }
      if (parent.type === 'page') {
        return Styles.getDefaultPageStyle();
      }
      return Styles.getDefaultBaseStyle();
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
