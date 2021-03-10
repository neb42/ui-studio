import * as React from 'react';
import { useTheme } from 'styled-components';
import { Menu, ListItemIcon, MenuItem, IconButton } from '@material-ui/core';
import { Edit, Functions, Widgets, Settings } from '@material-ui/icons';
import { Mode } from 'canvas-types';

import * as Styles from './ConfigOption.styles';

const iconMap = {
  complex: Settings,
  list: Settings,
  static: Edit,
  variable: Functions,
  widget: Widgets,
};

const allModes: Mode[] = ['complex', 'list', 'static', 'variable', 'widget'];

interface ModeButtonsProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  modeOptions: Mode[];
}

export const ModeButtons = ({
  mode,
  onModeChange,
  modeOptions,
}: ModeButtonsProps): JSX.Element | null => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleToggleMode = (m: Mode) => () => {
    onModeChange(m);
    handleCloseMenu();
  };

  if (modeOptions.length === 0) return null;

  const CurrentIcon = iconMap[mode];

  return (
    <Styles.ModeButtons>
      <IconButton onClick={handleOpenMenu} size="small">
        <CurrentIcon style={{ color: theme.colors.brand500 }} />
      </IconButton>
      <Menu keepMounted anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {allModes.map((m) => {
          if (!modeOptions.includes(m)) return null;
          const Icon = iconMap[m];
          return (
            <MenuItem key={m} onClick={handleToggleMode(m)}>
              <ListItemIcon>
                <Icon style={{ color: theme.colors.secondary500 }} />
              </ListItemIcon>
              {m}
            </MenuItem>
          );
        })}
      </Menu>
    </Styles.ModeButtons>
  );
};
