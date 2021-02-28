import * as React from 'react';
import { useTheme } from 'styled-components';
import { IconButton } from '@material-ui/core';
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

  const handleToggleMode = (m: Mode) => () => onModeChange(m);

  const getColor = (m: Mode) => (mode === m ? theme.colors.brand500 : theme.colors.secondary500);

  if (modeOptions.length === 0) return null;

  return (
    <Styles.ModeButtons>
      {allModes.map((m) => {
        if (!modeOptions.includes(m)) return null;
        const Icon = iconMap[m];
        return (
          <IconButton key={m} onClick={handleToggleMode(m)} size="small">
            <Icon style={{ color: getColor(m) }} />
          </IconButton>
        );
      })}
    </Styles.ModeButtons>
  );
};
