import { Layout, GridLayout, FlexLayout } from 'canvas-types';

export class LayoutModel {
  static getDefaultLayout = (type: 'basic' | 'flex' | 'grid'): Layout => {
    switch (type) {
      case 'basic':
        return null;
      case 'flex':
        return LayoutModel.getDefaultFlexConfig();
      case 'grid':
        return LayoutModel.getDefaultGridConfig();
      default:
        throw Error();
    }
  };

  static getDefaultFlexConfig = (): FlexLayout => {
    return {
      type: 'flex',
      direction: 'row' as const,
      align: 'start' as const,
      justify: 'start' as const,
      wrap: false,
    };
  };

  static getDefaultGridConfig = (): GridLayout => {
    return {
      type: 'grid',
      rows: [{ value: null, unit: 'auto' }],
      columns: [{ value: null, unit: 'auto' }],
      columnGap: 0,
      rowGap: 0,
      rowAlignment: 'stretch' as const,
      columnAlignment: 'stretch' as const,
    };
  };
}
