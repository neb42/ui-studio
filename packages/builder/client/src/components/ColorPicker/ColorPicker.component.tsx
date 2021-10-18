import * as React from 'react';
import ReactDOM from 'react-dom';
import { ColorResult, ChromePicker, TwitterPicker, SwatchesPicker } from 'react-color';
import { Store$Configuration } from 'types/store';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorizeIcon from '@mui/icons-material/Colorize';

import * as Styles from './ColorPicker.styles';

type Props = {
  header: string;
  color: string;
  colorConfig: Store$Configuration['colors'];
  onColorChange: (color: string) => any;
};

const usePortal = (id: string) => {
  const rootElemRef = React.useRef(document.createElement('div'));

  React.useEffect(() => {
    const parentElem = document.getElementById(id);
    if (parentElem) parentElem.appendChild(rootElemRef.current);
    return () => {
      rootElemRef.current.remove();
    };
  }, [id]);

  return rootElemRef.current;
};

export const ColorPickerComponent = ({ header, color, colorConfig, onColorChange }: Props) => {
  const portalRef = React.useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = React.useState<string>(color);
  const [colorPickerType, setColorPickerType] = React.useState<
    'swatch' | 'block' | 'picker' | null
  >(null);
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const target = usePortal('root');

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!portalRef.current || portalRef.current.contains(e.target as Node)) {
        return;
      }
      setColorPickerType(null);
    };

    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  React.useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (c: ColorResult) => {
    setCurrentColor(c.hex);
  };

  const handleColorChangeComplete = (c: ColorResult) => {
    onColorChange(c.hex);
    setCurrentColor(c.hex);
  };

  const handleOpenColorPicker = (type: 'swatch' | 'block' | 'picker') => (
    event: React.MouseEvent,
  ) => {
    const { clientX: x, clientY: y } = event;
    setPos({ x, y });
    setColorPickerType(type);
  };

  return (
    <>
      <Styles.Container>
        <Styles.Header>{header}</Styles.Header>
        <Styles.Swatch color={color} />
        <Styles.Value>{color}</Styles.Value>
        {colorConfig && <PaletteIcon onClick={handleOpenColorPicker(colorConfig.type)} />}
        <ColorizeIcon onClick={handleOpenColorPicker('picker')} />
      </Styles.Container>
      {colorPickerType &&
        ReactDOM.createPortal(
          <Styles.ColorPickerWrapper ref={portalRef} x={pos.x} y={pos.y}>
            {colorPickerType === 'swatch' && colorConfig?.type === 'swatch' && (
              <SwatchesPicker
                onChange={handleColorChange}
                onChangeComplete={handleColorChangeComplete}
                color={currentColor}
                colors={colorConfig.colors}
              />
            )}
            {colorPickerType === 'block' && colorConfig?.type === 'block' && (
              <TwitterPicker
                onChange={handleColorChange}
                onChangeComplete={handleColorChangeComplete}
                color={currentColor}
                colors={colorConfig.colors}
              />
            )}
            {colorPickerType === 'picker' && (
              <ChromePicker
                onChange={handleColorChange}
                onChangeComplete={handleColorChangeComplete}
                color={currentColor}
              />
            )}
          </Styles.ColorPickerWrapper>,
          target,
        )}
    </>
  );
};
