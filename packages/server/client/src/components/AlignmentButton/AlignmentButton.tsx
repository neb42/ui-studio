import * as React from 'react';
import { useTheme } from 'styled-components';
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
  layoutType: 'flex' | 'grid';
  alignmentType: string;
  value: string;
  direction: 'row' | 'column';
  onChange: (value: string) => any;
};

export const AlignmentButton = ({
  layoutType,
  alignmentType,
  value: rawValue,
  direction,
  onChange,
}: Props): JSX.Element => {
  const theme = useTheme();

  const value = rawValue.replace('flex-', '');

  const handleOnClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const v = event.target.value;
    // For some reason "end" doesn't work with flex so we set it to flex end
    if (layoutType === 'flex' && v === 'end') {
      onChange('flex-end');
    } else {
      onChange(v);
    }
  };

  const config = options[layoutType][alignmentType];

  const SelectedIcon = config[value].icon;
  return (
    <Styles.SegmentedControl onChange={handleOnClick}>
      {Object.keys(config).map((key) => (
        <Styles.HiddenRadio
          key={key}
          type="radio"
          value={key}
          id={`${direction}-${alignmentType}-${key}`}
          name={alignmentType}
          checked={value === key}
        />
      ))}
      {Object.entries(config).map(([key, { icon: Icon, tooltip }]) => (
        <Styles.Label
          key={key}
          htmlFor={`${direction}-${alignmentType}-${key}`}
          count={Object.keys(config).length}
          rotate={direction === 'column'}
        >
          <Icon width={16} height={16} fill={theme.colors.secondary900} />
        </Styles.Label>
      ))}
      <Styles.ActiveSegment
        activeIdx={Object.keys(config).findIndex((k) => k === value)}
        count={Object.keys(config).length}
        rotate={direction === 'column'}
      >
        <SelectedIcon width={16} height={16} fill="#fff" />
      </Styles.ActiveSegment>
    </Styles.SegmentedControl>
  );
};
