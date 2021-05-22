import { v4 as uuidv4 } from 'uuid';
import { Page, BaseStyle } from '@ui-studio/types';
import { generateDefaultName } from 'selectors/element';
import { Store } from 'types/store';
import { StylesModel } from 'models/styles';

export class PageModel {
  static getDefaultPage = (state: Store): Page => {
    return {
      id: uuidv4(),
      rootElement: true,
      type: 'page',
      name: generateDefaultName(state, 'Page'),
      props: {},
      style: StylesModel.getDefaultStyle() as BaseStyle,
    };
  };
}
