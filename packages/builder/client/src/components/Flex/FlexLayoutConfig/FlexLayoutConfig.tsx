import * as React from 'react';
import { useDispatch } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Widget,
  FlexJustification,
  FlexAlignment,
  CustomComponentInstance,
} from '@ui-studio/types';
import { updateWidgetLayoutConfig } from 'actions/layout';
import { AlignmentButton } from 'components/AlignmentButton';

import * as Styles from './FlexLayoutConfig.styles';

const directionOptions = [
  { value: 'row', label: 'Row' },
  { value: 'column', label: 'Column' },
];

interface FlexLayoutConfigProps {
  widget: Widget | CustomComponentInstance;
}

export const FlexLayoutConfig = ({ widget }: FlexLayoutConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  if (widget.layout?.type !== 'flex') throw Error();

  const handleUpdateDirection = (event: SelectChangeEvent) => {
    dispatch(updateWidgetLayoutConfig('direction', event.target.value as 'row' | 'column'));
  };

  const handleUpdateAlignment = (value: string) => {
    dispatch(updateWidgetLayoutConfig('align', value as FlexAlignment));
  };

  const handleUpdateJustification = (value: string) => {
    dispatch(updateWidgetLayoutConfig('justify', value as FlexJustification));
  };

  const handleUpdateWrap = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateWidgetLayoutConfig('wrap', event.target.checked));
  };

  const { direction } = widget.layout;
  return (
    <Styles.Container>
      <Styles.Field>
        <Styles.FieldHeader>Direction</Styles.FieldHeader>
        <FormControl fullWidth>
          <Select value={direction} onChange={handleUpdateDirection}>
            {directionOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Alignment</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={direction}
          alignmentType="align"
          value={widget.layout.align}
          onChange={handleUpdateAlignment}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Justification</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={direction}
          alignmentType="justify"
          value={widget.layout.justify}
          onChange={handleUpdateJustification}
        />
      </Styles.Field>
      <Styles.Field>
        <FormControlLabel
          label="Wrap"
          control={<Checkbox checked={widget.layout.wrap} onChange={handleUpdateWrap} />}
        />
      </Styles.Field>
    </Styles.Container>
  );
};
