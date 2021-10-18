import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedView } from 'selectors/view';
import { selectView } from 'actions/view';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import StyleIcon from '@mui/icons-material/Style';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import * as Styles from './PopoverNavigation.styles';

export const PopoverNavigation = (): JSX.Element => {
  const dispatch = useDispatch();
  const view = useSelector(getSelectedView);

  const handleSelectView = (_: any, value: string) =>
    dispatch(selectView(value as 'preview' | 'variable' | 'css'));

  return (
    <>
      <Styles.Container>
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleSelectView}
        >
          <ToggleButton value="preview">
            <AccountTreeIcon />
          </ToggleButton>
          <ToggleButton value="variable">
            <FunctionsIcon />
          </ToggleButton>
          <ToggleButton value="css">
            <StyleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Styles.Container>
    </>
  );
};
