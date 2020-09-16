import * as React from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { makeGetElements } from 'selectors/element';

import * as Styles from './Preview.styles';

export const Preview = (): JSX.Element => {
  const socket = React.useMemo(() => io('http://localhost:3002'), []);
  const getElements = React.useMemo(makeGetElements, []);
  const elements = useSelector(getElements);

  React.useEffect(() => {
    socket.emit('elements-updated', elements);
  }, [elements]);

  return <Styles.Iframe src="http://localhost:3000" />;
};
