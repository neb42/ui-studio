import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Edit, Functions, Widgets, Settings, ViewComfy, AppsSharp } from '@mui/icons-material';
import { Mode } from '@ui-studio/types';

const iconMap = {
  form: Settings,
  static: Edit,
  variable: Functions,
  widget: Widgets,
  iterable: ViewComfy,
  customComponentConfig: AppsSharp,
};

const nameMap = {
  form: 'Form',
  static: 'Static',
  variable: 'Variable',
  widget: 'Widget property',
  iterable: 'Iterable',
  customComponentConfig: 'Custom component config',
};

const allModes: Mode[] = [
  'customComponentConfig',
  'iterable',
  'widget',
  'variable',
  'static',
  'form',
];

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
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleToggleMode = (m: Mode) => () => {
    if (mode !== m) {
      onModeChange(m);
    }
    handleClose();
  };

  if (modeOptions.length === 0) return null;

  const CurrentIcon = iconMap[mode];

  return (
    <SpeedDial
      ariaLabel="Mode speed dial"
      icon={<CurrentIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="left"
    >
      {allModes
        .filter((m) => modeOptions.includes(m))
        .map((m) => {
          const Icon = iconMap[m];
          return (
            <SpeedDialAction
              key={m}
              icon={<Icon />}
              tooltipTitle={nameMap[m]}
              onClick={handleToggleMode(m)}
            />
          );
        })}
    </SpeedDial>
  );
};
