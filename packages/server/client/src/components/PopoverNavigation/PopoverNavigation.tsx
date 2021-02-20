import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedView } from 'selectors/element';
import { selectView } from 'actions/element';
import { Variables } from 'components/Variables';

import * as Styles from './PopoverNavigation.styles';

const foo = {
  preview: {
    idx: 0,
    name: 'Preview',
  },
  variable: {
    idx: 1,
    name: 'Variable',
  },
  css: {
    idx: 2,
    name: 'CSS',
  },
};

export const PopoverNavigation = (): JSX.Element => {
  const dispatch = useDispatch();
  const view = useSelector(getSelectedView);

  // const handleSelectView = (v: 'preview' | 'variable' | 'css') => () => dispatch(selectView(v));
  const handleSelectView = (event: React.ChangeEvent<HTMLInputElement>) => dispatch(selectView(event.target.value as 'preview' | 'variable' | 'css'));

  return (
    <>
      <Styles.SegmentedControl onChange={handleSelectView}>
        <Styles.HiddenRadio type="radio" value="preview" id="preview" checked={view === 'preview'} />
        <Styles.HiddenRadio type="radio" value="variable" id="variable" checked={view === 'variable'} />
        <Styles.HiddenRadio type="radio" value="css" id="css" checked={view === 'css'} />
        <Styles.Label htmlFor="preview">Preview</Styles.Label>
        <Styles.Label htmlFor="variable">Variables</Styles.Label>
        <Styles.Label htmlFor="css">CSS</Styles.Label>
        <Styles.ActiveSegment activeIdx={foo[view].idx} text={foo[view].name} />
      </Styles.SegmentedControl>
      {view !== 'preview' && <Styles.Mask onClick={() => dispatch(selectView('preview'))} />}
      {view === 'variable' && (
        <Styles.PopoverContainer>
          <Variables />
        </Styles.PopoverContainer>
      )}
      {view === 'css' && <Styles.PopoverContainer>CSS Modules</Styles.PopoverContainer>}
    </>
  );
};
