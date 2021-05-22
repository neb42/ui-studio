import * as React from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { Edit, Functions, Widgets, Settings, ViewComfy, AppsSharp } from '@material-ui/icons';
import { Mode } from '@ui-studio/types';

const iconMap = {
  complex: Settings,
  list: Settings,
  static: Edit,
  variable: Functions,
  widget: Widgets,
  iterable: ViewComfy,
  customComponentConfig: AppsSharp,
};

const nameMap = {
  complex: 'Form',
  list: 'Form',
  static: 'Static',
  variable: 'Variable',
  widget: 'Widget property',
  iterable: 'Iterable',
  customComponentConfig: 'Custom component config',
};

// const allModes: Mode[] = ['complex', 'list', 'static', 'variable', 'widget'];
const allModes: Mode[] = [
  'customComponentConfig',
  'iterable',
  'widget',
  'variable',
  'static',
  'list',
  'complex',
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
      ariaLabel="SpeedDial example"
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
