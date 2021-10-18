import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import Select from '@faculty/adler-web-components/atoms/Select';
import Button from '@faculty/adler-web-components/atoms/Button';
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

  const handleOnChange = ({ value }: any) => {
    onRootChange(value as string);
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
      <Select
        value={{ label: rootElement.name, value: rootElement.id }}
        onChange={handleOnChange}
        options={[
          {
            label: 'Pages',
            options: pages.map((p) => ({ value: p.id, label: p.name })),
          },
          {
            label: 'Components',
            options: customComponents.map((p) => ({ value: p.id, label: p.name })),
          },
        ]}
      />
      <div />
      <Button
        icon="add"
        style={Button.styles.naked}
        color={Button.colors.secondary}
        size={Button.sizes.medium}
        onClick={handleOpenAddMenu}
      />
      <Button
        icon="delete"
        style={Button.styles.naked}
        color={Button.colors.secondary}
        size={Button.sizes.medium}
        onClick={handleRemove}
        disabled={rootElement.type === 'page' && Object.keys(pages).length === 1}
      />
      <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAddMenu}>
        <MenuItem onClick={handleAddPage}>Page</MenuItem>
        <MenuItem onClick={handleAddCustomComponent}>Component</MenuItem>
      </Menu>
    </Styles.Container>
  );
};
