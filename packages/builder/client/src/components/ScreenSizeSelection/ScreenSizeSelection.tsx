import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import { DesktopMac, LaptopMac, TabletMac, PhoneIphone } from '@mui/icons-material';
import grey from '@mui/material/colors/grey';
import { updatePreviewSize } from 'actions/view';
import { getPreviewSize } from 'selectors/view';
import { ScreenSize } from 'types/store';

import * as Styles from './ScreenSizeSelection.styles';

export const ScreenSizeSelection = () => {
  const dispatch = useDispatch();
  const previewSize = useSelector(getPreviewSize);

  const handleScreenSizeChange = (size: ScreenSize) => () => {
    dispatch(updatePreviewSize(size));
  };

  const getColor = (size: ScreenSize) => (size === previewSize ? '#fff' : grey[300]);

  return (
    <Styles.Container>
      <IconButton onClick={handleScreenSizeChange('monitor')} size="large">
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
