import * as React from 'react';
import { useSelector } from 'react-redux';
import { getPreviewSize, getPreviewUrl } from 'selectors/view';

import * as Styles from './Preview.styles';

export const Preview = (): JSX.Element => {
  const url = useSelector(getPreviewUrl);
  const previewSize = useSelector(getPreviewSize);

  return (
    <Styles.Container>
      <Styles.Iframe previewSize={previewSize} src={url} />
    </Styles.Container>
  );
};
