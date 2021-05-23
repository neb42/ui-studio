import * as React from 'react';
import { useSelector } from 'react-redux';
import { getColorConfig } from 'selectors/configuration';

import { ColorPickerComponent } from './ColorPicker.component';

type Props = {
  header: string;
  color: string;
  onColorChange: (color: string) => any;
};

export const ColorPickerContainer = ({ header, color, onColorChange }: Props) => {
  const colorConfig = useSelector(getColorConfig);
  return (
    <ColorPickerComponent
      header={header}
      color={color}
      onColorChange={onColorChange}
      colorConfig={colorConfig}
    />
  );
};
