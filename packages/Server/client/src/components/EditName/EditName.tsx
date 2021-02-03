import * as React from 'react';
import { useDispatch } from 'react-redux';
import { StyledComponent, DefaultTheme } from 'styled-components';
import Input from '@faculty/adler-web-components/atoms/Input';
import { Widget, Layout, Page } from '@ui-builder/types';
import { updateElementName } from 'actions/element';

interface EditNameProps {
  element: Page | Layout | Widget;
  component?: StyledComponent<any, DefaultTheme, {}, never>;
}

export const EditName = ({ element, component }: EditNameProps) => {
  const dispatch = useDispatch();
  const input = React.useRef<Input | null>(null);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const handleOnChange = (value: string) => {
    dispatch(updateElementName(element.id, element.type, value));
  };

  const Component = component || 'span';

  return (
    <Component onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover || focus ? (
        <Input
          ref={input}
          value={element.name}
          onChange={handleOnChange}
          onFocus={() => {
            setFocus(true);
            setHover(false);
            if (input.current) input.current.setSelectionRange(0, element.name.length);
          }}
          onBlur={() => setFocus(false)}
        />
      ) : (
        element.name
      )}
    </Component>
  );
};
