import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, makeStyles } from '@material-ui/core';
import { Page, IOverlay } from '@ui-builder/types';
import { selectPage } from 'actions/element';
import { getOverlays, getPages, getSelectedPageId } from 'selectors/element';
import { PageListItem } from 'components/Pages/PageListItem';

import * as Styles from './PageList.styles';

const useStyles = makeStyles({
  input: {
    borderColor: '#fff',
    '&:before': {
      borderColor: '#fff',
    },
    '&:after': {
      borderColor: '#fff',
    },
  },
  select: {
    color: '#fff',
  },
  icon: {
    fill: '#fff',
  },
});

export const PageList = (): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [mode, setMode] = React.useState<'page' | 'overlay' | 'component'>('page');
  const selectedPageId = useSelector(getSelectedPageId);
  const pages = useSelector(getPages);
  const overlays = useSelector(getOverlays);

  const handleModeChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => setMode(event.target.value as 'page' | 'overlay' | 'component');

  const objectSet: Page[] | IOverlay[] = (() => {
    if (mode === 'page') return Object.values(pages);
    if (mode === 'overlay') return Object.values(overlays);
    if (mode === 'component') return [];
    return [];
  })();

  const handleOnClick = (name: string) => () => {
    if (mode === 'page') return dispatch(selectPage(name));
    if (mode === 'overlay') return undefined;
    if (mode === 'component') return undefined;
    return undefined;
  };

  return (
    <Styles.Container>
      <Styles.Header>
        <Select value={mode} classes={classes} onChange={handleModeChange}>
          <MenuItem disabled>Pages</MenuItem>
          <MenuItem value="page-one">Pages one</MenuItem>
          <MenuItem value="page-one">Pages one</MenuItem>
          <MenuItem value="page-one">Pages one</MenuItem>
          <MenuItem value="page">Pages</MenuItem>
          <MenuItem value="page">Pages</MenuItem>
          <MenuItem value="overlay">Overlays</MenuItem>
          <MenuItem value="component">Components</MenuItem>
        </Select>
      </Styles.Header>
      <Styles.List>
        {(objectSet as Array<Page | IOverlay>).map((p) => (
          <PageListItem
            key={p.name}
            name={p.name}
            active={selectedPageId === p.name}
            onClick={handleOnClick(p.name)}
          />
        ))}
      </Styles.List>
    </Styles.Container>
  );
};
