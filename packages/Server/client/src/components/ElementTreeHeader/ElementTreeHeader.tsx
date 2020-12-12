import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem, makeStyles } from '@material-ui/core';
import { selectPage } from 'actions/element';
import { getOverlays, getPages, getSelectedPageId } from 'selectors/element';

import * as Styles from './ElementTreeHeader.styles';

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

export const ElementTreeHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedPageId = useSelector(getSelectedPageId);
  const pages = useSelector(getPages);
  const overlays = useSelector(getOverlays);
  // const components = {};

  // TODO: handle overlay and components
  const handleOnChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => dispatch(selectPage(event.target.value as string));

  return (
    <Styles.Container>
      <Select value={selectedPageId} classes={classes} onChange={handleOnChange}>
        <MenuItem disabled>Pages</MenuItem>
        {Object.values(pages).map((p) => (
          <MenuItem key={p.name} value={p.name}>
            {p.name}
          </MenuItem>
        ))}
        <MenuItem disabled>Overlays</MenuItem>
        {Object.values(overlays).map((o) => (
          <MenuItem key={o.name} value={o.name}>
            {o.name}
          </MenuItem>
        ))}
        <MenuItem disabled>Components</MenuItem>
        {/* {Object.values(components).map((c) => (
          <MenuItem key={c.name} value={c.name}>
            {c.name}
          </MenuItem>
        ))} */}
      </Select>
    </Styles.Container>
  );
};
