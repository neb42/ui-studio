import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import AddSharp from '@mui/icons-material/AddSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import { Page, CustomComponent } from '@ui-studio/types';

import * as Styles from './ElementTreeHeader.styles';

type Props = {
  pages: Page[];
  customComponents: CustomComponent[];
  rootElement: Page | CustomComponent;
  onRootChange: (rootId: string) => any;
  onAddPage: () => any;
  onAddCustomComponent: () => any;
  onRemove: () => any;
};

export const ElementTreeHeaderComponent = ({
  pages,
  customComponents,
  rootElement,
  onRootChange,
  onAddPage,
  onAddCustomComponent,
  onRemove,
}: Props): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);
  const handleOpenAddMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseAddMenu = () => setAnchorEl(null);

  const handleOnChange = (event: SelectChangeEvent) => {
    onRootChange(event.target.value as string);
  };

  const handleAddPage = () => {
    onAddPage();
    setAnchorEl(null);
  };

  const handleAddCustomComponent = () => {
    onAddCustomComponent();
    setAnchorEl(null);
  };

  const handleRemove = () => {
    onRemove();
  };

  if (!rootElement) return <div />;

  return (
    <Styles.Container>
      <FormControl fullWidth>
        <Select value={rootElement.id} onChange={handleOnChange}>
          <ListSubheader>Pages</ListSubheader>
          {pages.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
          <ListSubheader>Components</ListSubheader>
          {customComponents.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div />
      <IconButton onClick={handleOpenAddMenu} size="small">
        <AddSharp />
      </IconButton>
      <IconButton
        onClick={handleRemove}
        disabled={rootElement.type === 'page' && Object.keys(pages).length === 1}
        size="small"
      >
        <DeleteSharp />
      </IconButton>
      <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAddMenu}>
        <MenuItem onClick={handleAddPage}>Page</MenuItem>
        <MenuItem onClick={handleAddCustomComponent}>Component</MenuItem>
      </Menu>
    </Styles.Container>
  );
};
