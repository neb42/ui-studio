import * as React from 'react';
import { useTheme } from 'styled-components';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ReactComponent as AlignCenter } from 'icons/align-center.svg';
import { ReactComponent as AlignEnd } from 'icons/align-end.svg';
import { ReactComponent as AlignStart } from 'icons/align-start.svg';
import { ReactComponent as AlignStretch } from 'icons/align-stretch.svg';
import { ReactComponent as JustifyCenter } from 'icons/justify-center.svg';
import { ReactComponent as JustifyEnd } from 'icons/justify-end.svg';
import { ReactComponent as JustifyStart } from 'icons/justify-start.svg';
import { ReactComponent as JustifySpaceBetween } from 'icons/justify-space-between.svg';
import { ReactComponent as SelfAuto } from 'icons/self-auto.svg';
import { ReactComponent as SelfCenter } from 'icons/self-center.svg';
import { ReactComponent as SelfEnd } from 'icons/self-end.svg';
import { ReactComponent as SelfStart } from 'icons/self-start.svg';
import { ReactComponent as SelfStretch } from 'icons/self-stretch.svg';

import * as Styles from './AlignmentButton.styles';
import { Outline } from 'components/Outline';

const options: {
  [layoutType: string]: {
    [alignmentType: string]: { [value: string]: { icon: any; tooltip: string } };
  };
} = {
  flex: {
    align: {
      start: {
        icon: AlignStart,
        tooltip: '',
      },
      center: {
        icon: AlignCenter,
        tooltip: '',
      },
      end: {
        icon: AlignEnd,
        tooltip: '',
      },
      stretch: {
        icon: AlignStretch,
        tooltip: '',
      },
    },
    justify: {
      start: {
        icon: JustifyStart,
        tooltip: '',
      },
      center: {
        icon: JustifyCenter,
        tooltip: '',
      },
      end: {
        icon: JustifyEnd,
        tooltip: '',
      },
      'space-between': {
        icon: JustifySpaceBetween,
        tooltip: '',
      },
    },
    self: {
      auto: {
        icon: SelfAuto,
        tooltip: '',
      },
      start: {
        icon: SelfStart,
        tooltip: '',
      },
      center: {
        icon: SelfCenter,
        tooltip: '',
      },
      end: {
        icon: SelfEnd,
        tooltip: '',
      },
      stretch: {
        icon: SelfStretch,
        tooltip: '',
      },
    },
  },
  grid: {
    align: {
      start: {
        icon: AlignStart,
        tooltip: '',
      },
      center: {
        icon: AlignCenter,
        tooltip: '',
      },
      end: {
        icon: AlignEnd,
        tooltip: '',
      },
      stretch: {
        icon: AlignStretch,
        tooltip: '',
      },
    },
    justify: {
      start: {
        icon: JustifyStart,
        tooltip: '',
      },
      center: {
        icon: JustifyCenter,
        tooltip: '',
      },
      end: {
        icon: JustifyEnd,
        tooltip: '',
      },
      stretch: {
        icon: JustifySpaceBetween,
        tooltip: '',
      },
    },
    self: {
      auto: {
        icon: SelfAuto,
        tooltip: '',
      },
      start: {
        icon: SelfStart,
        tooltip: '',
      },
      center: {
        icon: SelfCenter,
        tooltip: '',
      },
      end: {
        icon: SelfEnd,
        tooltip: '',
      },
      stretch: {
        icon: SelfStretch,
        tooltip: '',
      },
    },
  },
};

type Props = {
  label: string;
  layoutType: 'flex' | 'grid';
  alignmentType: string;
  value: string;
  direction: 'row' | 'column';
  onChange: (value: string) => any;
};

export const AlignmentButton = ({
  label,
  layoutType,
  alignmentType,
  value: rawValue,
  direction,
  onChange,
}: Props): JSX.Element => {
  const theme = useTheme();

  const value = rawValue.replace('flex-', '');

  const handleOnClick = (_: React.MouseEvent<HTMLElement>, newValue: string): void => {
    // For some reason "end" doesn't work with flex so we set it to flex end
    if (newValue !== null) {
      if (layoutType === 'flex' && newValue === 'end') {
        onChange('flex-end');
      } else {
        onChange(newValue);
      }
    }
  };

  const config = options[layoutType][alignmentType];

  return (
    <Outline label={label}>
      <ToggleButtonGroup value={value} exclusive onChange={handleOnClick} fullWidth color="primary">
        {Object.entries(config).map(([key, { icon: Icon, tooltip }]) => (
          <ToggleButton key={key} value={key}>
            <Icon
              width={18}
              height={18}
              fill="currentColor"
              style={
                direction === 'column'
                  ? {
                      transform: 'rotate(90deg) scaleY(-1)',
                    }
                  : {}
              }
            />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Outline>
  );
};
