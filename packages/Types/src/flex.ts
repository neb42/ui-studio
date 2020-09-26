import { TStyle } from './style';

export interface FlexLayout {
  id: string;
  type: 'layout';
  layoutType: 'flex';
  name: string;
  parent: string;
  props: { [key: string]: any };
  position: number;
  style: TStyle;
}
