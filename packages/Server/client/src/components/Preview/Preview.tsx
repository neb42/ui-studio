import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { InitFunctions, Component } from '@ui-builder/types';
import { makeGetElements, getVariables } from 'selectors/element';
import { initComponents, initFunctions, selectPage } from 'actions/element';

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
  // TODO set properly
  const serverSocket = React.useMemo(() => io('http://localhost:3002'), []);
  const previewSocket = React.useMemo(() => {
    if (previewServer) {
      // TODO set properly
      // return io(`${previewServer.host}:${previewServer.port + 1}`);
      return io('http://localhost:3001');
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
      previewSocket.on('init-functions', (functions: InitFunctions) =>
        dispatch(initFunctions(functions)),
      );
      previewSocket.on('init-components', (components: Component[]) =>
        dispatch(initComponents(components)),
      );
      previewSocket.on('navigate-page', (response: { url: string }) => {
        const url = response.url.replace('/', '');
        if (url !== pageName) {
          dispatch(selectPage(url));
        }
      });
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
