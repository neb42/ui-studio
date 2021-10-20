import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'styled-components';
import IconButton from '@mui/material/IconButton';
import { DesktopMac, LaptopMac, TabletMac, PhoneIphone } from '@mui/icons-material';
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
    size === previewSize ? theme.palette.info.light : theme.palette.info.main;

  return (
    <Styles.Container>
      <IconButton onClick={handleScreenSizeChange('monitor')} size="large" color="info">
        <DesktopMac style={{ color: getColor('monitor') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('laptop')} size="large">
        <LaptopMac style={{ color: getColor('laptop') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('tablet')} size="large">
        <TabletMac style={{ color: getColor('tablet') }} />
      </IconButton>
      <IconButton onClick={handleScreenSizeChange('mobile')} size="large">
        <PhoneIphone style={{ color: getColor('mobile') }} />
      </IconButton>
    </Styles.Container>
  );
};
