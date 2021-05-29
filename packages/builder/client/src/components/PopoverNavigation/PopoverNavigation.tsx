import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedView } from 'selectors/view';
import { selectView } from 'actions/view';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FunctionsIcon from '@material-ui/icons/Functions';
import StyleIcon from '@material-ui/icons/Style';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

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
