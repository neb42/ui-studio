import * as React from 'react';
import { useDispatch } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Widget, CustomComponentInstance } from '@ui-studio/types';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig';
import { FlexLayoutConfig } from 'components/Flex/FlexLayoutConfig';
import { updateWidgetLayoutType } from 'actions/layout';

const layoutTypeOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'flex', label: 'Flex' },
  { value: 'grid', label: 'Grid' },
];

interface Props {
  widget: Widget | CustomComponentInstance;
}

export const LayoutConfig = ({ widget }: Props): JSX.Element | null => {
  const dispatch = useDispatch();

  const handleLayoutTypeChange = (event: SelectChangeEvent) => {
    dispatch(updateWidgetLayoutType(widget.id, event.target.value as 'grid' | 'flex' | 'basic'));
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Layout type</InputLabel>
        <Select value={widget.layout?.type} label="Layout type" onChange={handleLayoutTypeChange}>
          {layoutTypeOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {widget.layout?.type === 'grid' && <GridLayoutConfig widget={widget} />}
      {widget.layout?.type === 'flex' && <FlexLayoutConfig widget={widget} />}
    </>
  );
};
