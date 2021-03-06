import { v4 as uuidv4 } from 'uuid';
import { Element, Layout, GridLayout, FlexLayout } from 'canvas-types';
import { generateDefaultName, getNextPosition } from 'selectors/element';
import { StylesModel } from 'models/styles';
import { Store } from 'types/store';

export class LayoutModel {
  static getDefaultLayout = (
    state: Store,
    parentElement: Element,
    layoutType: 'grid' | 'flex',
  ): Layout => {
    const name = LayoutModel.getDefaultName(state, layoutType);
    const defaultConfig = LayoutModel.getDefaultConfig(layoutType);
    const position = LayoutModel.getNextPosition(state, parentElement.id);
    const defaultStyle = StylesModel.getDefaultStyle(parentElement);
    return {
      id: uuidv4(),
      type: 'layout',
      name,
      parent: parentElement.id,
      position,
      style: defaultStyle,
      ...defaultConfig,
    };
  };

  static getDefaultName = (state: Store, layoutType: 'grid' | 'flex') => {
    return generateDefaultName(
      state,
      layoutType.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
    );
  };

  static getDefaultConfig = (
    layoutType: 'grid' | 'flex',
  ):
    | {
        layoutType: 'grid';
        props: GridLayout['props'];
      }
    | {
        layoutType: 'flex';
        props: FlexLayout['props'];
      } => {
    if (layoutType === 'grid') {
      return {
        layoutType,
        props: {
          rows: [{ value: null, unit: 'auto' }],
          columns: [{ value: null, unit: 'auto' }],
          columnGap: 0,
          rowGap: 0,
          rowAlignment: 'stretch' as const,
          columnAlignment: 'stretch' as const,
        },
      };
    }
    if (layoutType === 'flex') {
      return {
        layoutType,
        props: {
          direction: 'row' as const,
          align: 'start' as const,
          justify: 'start' as const,
          wrap: false,
        },
      };
    }
    throw Error();
  };

  static getNextPosition = (state: Store, parentId: string) => {
    return getNextPosition(state, parentId);
  };
}
