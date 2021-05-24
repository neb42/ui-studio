import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Element } from '@ui-studio/types';
import { updateStyle } from 'actions/styles';

import { OverflowComponent } from './Overflow.component';

type Props = {
  element: Element;
};

export const OverflowContainer = ({ element }: Props) => {
  const dispatch = useDispatch();

  const handleOverflowChange = (overflow: Element['style']['properties']['overflow']) => {
    dispatch(
      updateStyle({
        ...element.style,
        properties: {
          ...element.style.properties,
          overflow,
        },
      }),
    );
  };
  return (
    <OverflowComponent
      overflow={element.style.properties.overflow}
      onOverflowChange={handleOverflowChange}
    />
  );
};
