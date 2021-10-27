import { Element, BaseStyle, IGridStyle, IFlexStyle, TStyle } from '@ui-studio/types';

export class StylesModel {
  static getDefaultStyle = (parent?: Element | null, existingStyle?: TStyle): TStyle => {
    const style = (() => {
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
    })();

    if (existingStyle) return StylesModel.mergeStyles(style, existingStyle);
    return style;
  };

  static mergeStyles = <T extends TStyle>(style: T, existingStyle: TStyle): T => {
    return {
      ...style,
      css: existingStyle.css,
      classNames: existingStyle.classNames,
      properties: existingStyle.properties,
    };
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
