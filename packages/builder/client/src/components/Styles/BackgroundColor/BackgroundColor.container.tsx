import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Element } from '@ui-studio/types';
import { updateStyle } from 'actions/styles';
import { ColorPicker } from 'components/ColorPicker';

type Props = {
  element: Element;
};

export const BackgroundColorContainer = ({ element }: Props) => {
  const dispatch = useDispatch();

  const handleColorChange = (color: string) => {
    dispatch(
      updateStyle({
        ...element.style,
        properties: {
          ...element.style.properties,
          backgroundColor: color,
        },
      }),
    );
  };
  return (
    <ColorPicker
      header="Background color"
      color={element.style.properties.backgroundColor ?? ''}
      onColorChange={handleColorChange}
    />
  );
};
