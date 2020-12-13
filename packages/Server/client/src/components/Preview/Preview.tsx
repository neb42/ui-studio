import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { TInitFunctions } from '@ui-builder/types';
import { IComponent } from 'types/store';
import { makeGetElements } from 'selectors/element';
import { initComponents, initFunctions } from 'actions/element';

import * as Styles from './Preview.styles';

interface IPreview {
  pageId: string;
}

/*
 Hot reloading doesn't seem to work in iframes
 Instead we set a random key when
*/
export const Preview = ({ pageId }: IPreview): JSX.Element => {
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
  const getElements = React.useMemo(makeGetElements, []);
  const elements = useSelector(getElements);

  // TODO
  const pageName = pageId;

  React.useEffect(() => {
    serverSocket.on('set-server', setPreviewServer);
    serverSocket.on('code-updated', () => setRandom(Math.random()));
  }, []);

  React.useEffect(() => {
    if (previewSocket) {
      previewSocket.on('init-functions', (functions: TInitFunctions) =>
        dispatch(initFunctions(functions)),
      );
      previewSocket.on('init-components', (components: IComponent[]) =>
        dispatch(initComponents(components)),
      );
    }
  }, [previewSocket]);

  React.useEffect(() => {
    serverSocket.emit('elements-updated', elements);
  }, [elements]);

  if (!previewServer) return <div />;

  return (
    <Styles.Iframe key={random} src={`${previewServer.host}:${previewServer.port}/${pageName}`} />
  );
};
