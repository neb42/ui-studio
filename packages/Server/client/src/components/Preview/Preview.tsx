import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { InitFunctions, Component } from '@ui-builder/types';
import { Store$Page, Store$Layout, Store$Widget, Store$Variable } from 'types/store';
import { makeGetElements, getVariables, getPages } from 'selectors/element';
import { initComponents, initFunctions, initClient, selectPage } from 'actions/element';

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
  const pages = Object.values(useSelector(getPages));
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [previewServer, setPreviewServer] = React.useState<{
    host: string;
    clientPort: number;
    serverPort: number;
  } | null>(null);

  const socket = React.useMemo(() => io('/'), []);

  const elements = useSelector(React.useMemo(makeGetElements, []));
  const variables = useSelector(getVariables);

  React.useEffect(() => {
    socket.on(
      'init-client',
      async (client: {
        pages: Store$Page;
        layouts: Store$Layout;
        widgets: Store$Widget;
        variables: Store$Variable;
      }) => {
        await dispatch(initClient(client));
        setIsLoaded(true);
      },
    );

    socket.on('set-server', setPreviewServer);

    socket.on(
      'init-builder',
      ({ functions, components }: { functions: InitFunctions; components: Component[] }) => {
        dispatch(initFunctions(functions));
        dispatch(initComponents(components));
      },
    );
  }, []);

  React.useEffect(() => {
    socket.on('navigate-page', (response: { url: string }) => {
      const newPageName = response.url.replace('/', '');
      if (newPageName !== pageName) {
        const newPageId = pages.find((p) => p.name === newPageName)?.id;
        if (newPageId) dispatch(selectPage(newPageId));
      }
    });
  }, [JSON.stringify(pages), pageName]);

  React.useEffect(() => {
    if (isLoaded) socket.emit('elements-updated', { ...elements, variables });
  }, [JSON.stringify(elements), JSON.stringify(variables)]);

  React.useEffect(() => {
    socket.emit('navigate-page', { url: pageName });
  }, [pageName]);

  if (!previewServer) return <div />;

  return <Styles.Iframe src={`${previewServer.host}:${previewServer.clientPort}`} />;
};
