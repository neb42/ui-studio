import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Radio } from '@material-ui/core';
import { Widget, ComponentConfig$Radio } from '@ui-builder/types';
import { ConfigOption } from 'components/ConfigOption';

interface RadioConfigProps {
  widget: Widget;
  config: ComponentConfig$Radio;
}

export const RadioConfig = ({ widget, config }: RadioConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  const [radio, setRadio] = React.useState(
    config.options.find((o) => widget.props[config.key].radioKey === o.key) ||
      config.options[0].key,
  );

  const selectedConfigOption = config.options.find((o) => o.key === radio);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadio(event.target.value);
  };

  return (
    <>
      {config.options.map((o) => (
        <Radio key={o.key} checked={radio === o.key} onChange={handleRadioChange} value={o.key} />
      ))}
      {selectedConfigOption && (
        <ConfigOption
          widget={widget}
          config={{ ...selectedConfigOption, key: config.key }}
          radioKey={selectedConfigOption.key}
        />
      )}
    </>
  );
};
