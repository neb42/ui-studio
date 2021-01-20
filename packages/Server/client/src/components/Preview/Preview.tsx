import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { InitFunctions, Component } from '@ui-builder/types';
import { makeGetElements, getVariables } from 'selectors/element';
import { initComponents, initFunctions } from 'actions/element';

import * as Styles from './Preview.styles';

interface IPreview {
  pageName: string;
}

/*
 Hot reloading doesn't seem to work in iframes
 Instead we set a random key when
*/
export const Preview = ({ pageName }: IPreview): JSX.Element => {
  const dispatch = useDispatch();
  const [previewServer, setPreviewServer] = React.useState<{ host: string; port: string } | null>(
    null,
  );
  const [random, setRandom] = React.useState(Math.random());
  const serverSocket = React.useMemo(() => io('/'), []);
  const previewSocket = React.useMemo(() => {
    if (previewServer) {
      return io(`${previewServer.host}:${previewServer.port + 1}`);
    }
    return null;
  }, [JSON.stringify(previewServer)]);

  const elements = useSelector(React.useMemo(makeGetElements, []));
  const variables = useSelector(getVariables);

  React.useEffect(() => {
    serverSocket.on('set-server', setPreviewServer);
    serverSocket.on('code-updated', () => setRandom(Math.random()));
  }, []);

  React.useEffect(() => {
    if (previewSocket) {
      previewSocket.on('init-functions', (functions: InitFunctions[]) =>
        dispatch(initFunctions(functions)),
      );
      previewSocket.on('init-components', (components: Component[]) =>
        dispatch(initComponents(components)),
      );
    }
  }, [previewSocket]);

  React.useEffect(() => {
    serverSocket.emit('elements-updated', { ...elements, variables });
  }, [JSON.stringify(elements), JSON.stringify(variables)]);

  if (!previewServer) return <div />;

  return (
    <Styles.Iframe key={random} src={`${previewServer.host}:${previewServer.port}/${pageName}`} />
  );
};
