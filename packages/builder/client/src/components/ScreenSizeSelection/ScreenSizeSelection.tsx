import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import { DesktopMac, LaptopMac, TabletMac, PhoneIphone } from '@material-ui/icons';

import { updatePreviewSize } from 'actions/view';
import { getPreviewSize } from 'selectors/view';
import { ScreenSize } from 'types/store';

import * as Styles from './ScreenSizeSelection.styles';

export const ScreenSizeSelection = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const previewSize = useSelector(getPreviewSize);

  const handleScreenSizeChange = (size: ScreenSize) => () => {
    dispatch(updatePreviewSize(size));
  };

  const getColor = (size: ScreenSize) =>
    size === previewSize ? theme.colors.brand500 : theme.colors.secondary500;

  return (
    <Styles.Container>
      <IconButton onClick={handleScreenSizeChange('monitor')}>
        <DesktopMac style={{ color: getColor('monitor') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('laptop')}>
        <LaptopMac style={{ color: getColor('laptop') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('tablet')}>
        <TabletMac style={{ color: getColor('tablet') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('mobile')}>
        <PhoneIphone style={{ color: getColor('mobile') }} />
      </IconButton>
    </Styles.Container>
  );
};
