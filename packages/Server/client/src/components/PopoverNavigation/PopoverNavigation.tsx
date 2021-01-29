import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedView } from 'selectors/element';
import { selectView } from 'actions/element';
import { Variables } from 'components/Variables';

import * as Styles from './PopoverNavigation.styles';

export const PopoverNavigation = (): JSX.Element => {
  const dispatch = useDispatch();
  const view = useSelector(getSelectedView);

  const handleSelectView = (v: 'preview' | 'variable' | 'css') => () => dispatch(selectView(v));

  return (
    <>
      <Styles.Container>
        <Styles.NavItem active={view === 'preview'} onClick={handleSelectView('preview')}>
          Preview
        </Styles.NavItem>
        <Styles.NavItem active={view === 'variable'} onClick={handleSelectView('variable')}>
          Variables
        </Styles.NavItem>
        <Styles.NavItem active={view === 'css'} onClick={handleSelectView('css')}>
          CSS
        </Styles.NavItem>
      </Styles.Container>
      {view === 'variable' && (
        <Styles.PopoverContainer>
          <Variables />
        </Styles.PopoverContainer>
      )}
      {view === 'css' && <Styles.PopoverContainer>CSS Modules</Styles.PopoverContainer>}
    </>
  );
};
