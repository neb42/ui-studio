import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, MenuItem } from '@material-ui/core';
import { selectPage, updateElementName } from 'actions/element';
import { addPage, removePage } from 'actions/page';
import { getOverlays, getPages, getSelectedPageId } from 'selectors/element';
import Select from '@faculty/adler-web-components/atoms/Select';
import Button from '@faculty/adler-web-components/atoms/Button';
import Input from '@faculty/adler-web-components/atoms/Input';

import * as Styles from './ElementTreeHeader.styles';

export const ElementTreeHeader = (): JSX.Element => {
  const dispatch = useDispatch();
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
  const handleOnChange = ({ value }: any) => {
    dispatch(selectPage(value as string));
  };

  const handleAddPage = () => {
    dispatch(addPage());
    setAnchorEl(null);
  };

  // TODO handle overlay and components
  const handleRemovePage = () => {
    if (selectedPageId) dispatch(removePage(selectedPageId));
  };

  const handleToggleEditName = () => setEdit(!edit);

  const handleEditName = (value: string) => {
    if (selectedPageId) dispatch(updateElementName(selectedPageId, 'page', value));
  };

  // TODO handle overlay and components
  if (!selectedPageId) return <div />;

  // TODO handle overlay and components
  const element = pages[selectedPageId];

  return (
    <Styles.Container>
      {!edit && (
        <Select
          value={{ label: element.name, value: element.id }}
          onChange={handleOnChange}
          options={[
            {
              label: 'Pages',
              options: Object.values(pages).map((p) => ({ value: p.id, label: p.name })),
            },
            {
              label: 'Overlays',
              options: Object.values(overlays).map((o) => ({ value: o.id, label: o.name })),
            },
            { label: 'Components', options: [] },
          ]}
        />
      )}
      {edit && <Input onChange={handleEditName} value={element.name} />}
      <div />
      <Button
        icon="add"
        style={Button.styles.naked}
        color={Button.colors.secondary}
        size={Button.sizes.medium}
        onClick={handleOpenAddMenu}
      />
      <Button
        icon="edit"
        style={Button.styles.naked}
        color={edit ? Button.colors.brand : Button.colors.secondary}
        size={Button.sizes.medium}
        onClick={handleToggleEditName}
      />
      <Button
        icon="delete"
        style={Button.styles.naked}
        color={Button.colors.secondary}
        size={Button.sizes.medium}
        onClick={handleRemovePage}
        disabled={Object.keys(pages).length === 1}
      />
      <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAddMenu}>
        <MenuItem onClick={handleAddPage}>Page</MenuItem>
        <MenuItem onClick={() => {}}>Overlay</MenuItem>
        <MenuItem onClick={() => {}}>Component</MenuItem>
      </Menu>
    </Styles.Container>
  );
};
