import * as React from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { makeGetElements } from 'selectors/element';

import * as Styles from './Preview.styles';

interface IPreview {
  pageName: string;
}

/*
 Hot reloading doesn't seem to work in iframes
 Instead we set a random key when
*/
export const Preview = ({ pageName }: IPreview): JSX.Element => {
  const [previewServer, setPreviewServer] = React.useState({ host: '', port: '' });
  const [random, setRandom] = React.useState(Math.random());
  const socket = React.useMemo(() => io('/'), []);
  const getElements = React.useMemo(makeGetElements, []);
  const elements = useSelector(getElements);

  React.useEffect(() => {
    socket.on('set-server', setPreviewServer);
    socket.on('code-updated', () => setRandom(Math.random()));
  }, []);

  React.useEffect(() => {
    socket.emit('elements-updated', elements);
  }, [elements]);

  return (
    <Styles.Iframe key={random} src={`${previewServer.host}:${previewServer.port}/${pageName}`} />
  );
};
