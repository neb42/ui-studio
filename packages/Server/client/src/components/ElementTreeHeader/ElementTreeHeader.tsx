import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import { TextField, Menu, IconButton, Select, MenuItem, makeStyles } from '@material-ui/core';
import { AddSharp, EditSharp, DeleteSharp } from '@material-ui/icons';
import { selectPage, updateElementName } from 'actions/element';
import { addPage, removePage } from 'actions/page';
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
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedPageId = useSelector(getSelectedPageId);
  const pages = useSelector(getPages);
  const overlays = useSelector(getOverlays);
  // const components = {};

  const [edit, setEdit] = React.useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);
  const handleOpenAddMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseAddMenu = () => setAnchorEl(null);

  // TODO: handle overlay and components
  const handleOnChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => dispatch(selectPage(event.target.value as string));

  const handleAddPage = () => {
    dispatch(addPage());
    setAnchorEl(null);
  };

  // TODO handle overlay and components
  const handleRemovePage = () => {
    if (selectedPageId) dispatch(removePage(selectedPageId));
  };

  const handleToggleEditName = () => setEdit(!edit);

  const handleEditName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPageId) dispatch(updateElementName(selectedPageId, 'page', event.target.value));
  };

  // TODO handle overlay and components
  if (!selectedPageId) return <div />;

  // TODO handle overlay and components
  const element = pages[selectedPageId];

  return (
    <Styles.Container>
      {!edit && (
        <Select value={selectedPageId} classes={classes} onChange={handleOnChange}>
          <MenuItem disabled>Pages</MenuItem>
          {Object.values(pages).map((p) => (
            <MenuItem key={p.name} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
          <MenuItem disabled>Overlays</MenuItem>
          {Object.values(overlays).map((o) => (
            <MenuItem key={o.name} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
          <MenuItem disabled>Components</MenuItem>
          {/* {Object.values(components).map((c) => (
          <MenuItem key={c.name} value={c.id}>
            {c.name}
          </MenuItem>
        ))} */}
        </Select>
      )}
      {edit && <TextField onChange={handleEditName} value={element.name} />}
      <div />
      <IconButton onClick={handleOpenAddMenu} size="small" style={{ color: '#fff' }}>
        <AddSharp />
      </IconButton>
      <IconButton
        onClick={handleToggleEditName}
        size="small"
        style={{ color: edit ? theme.colors.brand500 : '#fff' }}
      >
        <EditSharp />
      </IconButton>
      <IconButton
        onClick={handleRemovePage}
        disabled={Object.keys(pages).length === 1}
        size="small"
        style={{ color: '#fff' }}
      >
        <DeleteSharp />
      </IconButton>
      <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAddMenu}>
        <MenuItem onClick={handleAddPage}>Page</MenuItem>
        <MenuItem onClick={() => {}}>Overlay</MenuItem>
        <MenuItem onClick={() => {}}>Component</MenuItem>
      </Menu>
    </Styles.Container>
  );
};
