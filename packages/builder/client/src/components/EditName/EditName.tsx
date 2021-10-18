import * as React from 'react';
import { useDispatch } from 'react-redux';
import { StyledComponent, DefaultTheme } from 'styled-components';
import TextField from '@mui/material/TextField';
import { Element } from '@ui-studio/types';
import { updateElementName } from 'actions/name';

interface EditNameProps {
  element: Element;
  component?: StyledComponent<any, DefaultTheme, {}, never>;
}

export const EditName = ({ element, component }: EditNameProps) => {
  const dispatch = useDispatch();
  const input = React.useRef<TextField | null>(null);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateElementName(event.target.value));
  };

  const Component = component || 'span';

  return (
    <Component onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover || focus ? (
        <TextField
          ref={input}
          value={element.name}
          onChange={handleOnChange}
          onFocus={(event) => {
            setFocus(true);
            setHover(false);
            event.target.select();
          }}
          onBlur={() => setFocus(false)}
        />
      ) : (
        element.name
      )}
    </Component>
  );
};
