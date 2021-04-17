import * as React from 'react';
import { useDispatch } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import { Widget } from '@ui-studio/types';
import { GridLayoutConfig } from 'components/Grid/GridLayoutConfig';
import { FlexLayoutConfig } from 'components/Flex/FlexLayoutConfig';
import { updateWidgetLayoutType } from 'actions/widget';

const layoutTypeOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'flex', label: 'Flex' },
  { value: 'grid', label: 'Grid' },
];

interface Props {
  widget: Widget;
}

export const LayoutConfig = ({ widget }: Props): JSX.Element | null => {
  const dispatch = useDispatch();

  const handleLayoutTypeChange = ({ value }: any) => {
    dispatch(updateWidgetLayoutType(widget.id, value));
  };

  return (
    <>
      <Select
        label="Layout type"
        value={layoutTypeOptions.find((o) => o.value === widget.layout?.type)}
        options={layoutTypeOptions}
        onChange={handleLayoutTypeChange}
      />
      {widget.layout?.type === 'grid' && <GridLayoutConfig widget={widget} />}
      {widget.layout?.type === 'flex' && <FlexLayoutConfig widget={widget} />}
    </>
  );
};
