import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';
import { InitFunctions, Component, Page } from '@ui-studio/types';

import { Store$Tree, Store$Variable } from 'types/store';
import { getVariables } from 'selectors/variable';
import { getRoots, getRawTree } from 'selectors/tree';
import { getSelectedElementId, getHoverElementId, getPreviewSize } from 'selectors/view';
import { initComponents, initFunctions } from 'actions/configuration';
import { initClient } from 'actions/tree/init';
import { selectRootElement, selectElement } from 'actions/view';

import * as Styles from './Preview.styles';

interface Props {
  pageName: string;
}

export const Preview = ({ pageName }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const pages = useSelector(getRoots).filter((e): e is Page => e.type === 'page');
  const previewSize = useSelector(getPreviewSize);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [previewServer, setPreviewServer] = React.useState<{
    host: string;
    clientPort: number;
    serverPort: number;
  } | null>(null);
  const [previewClientReady, setPreviewClientReady] = React.useState<boolean>(false);

  const selectedElementId = useSelector(getSelectedElementId);
  const hoverElementId = useSelector(getHoverElementId);

  const socket = React.useMemo(() => io('/'), []);

  const tree = useSelector(getRawTree);
  const variables = useSelector(getVariables);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const checkPreviewClient = async () => {
      const { status } = await axios.get('/preview-client-ready');
      if (status === 200) {
        setPreviewClientReady(true);
      } else {
        timeout = setTimeout(checkPreviewClient, 500);
      }
    };
    checkPreviewClient();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  React.useEffect(() => {
    socket.on('init-client', async (client: { tree: Store$Tree; variables: Store$Variable }) => {
      await dispatch(initClient(client));
      setIsLoaded(true);
    });

    socket.on('set-server', setPreviewServer);

    socket.on(
      'init-builder',
      ({ functions, components }: { functions: InitFunctions; components: Component[] }) => {
        dispatch(initFunctions(functions));
        dispatch(initComponents(components));
      },
    );

    socket.on('select-element', (response: { id: string | null }) => {
      if (response.id !== selectedElementId) dispatch(selectElement(response.id));
    });
  }, []);

  React.useEffect(() => {
    socket.on('navigate-page', (response: { url: string }) => {
      const newPageName = response.url.replace('/', '');
      if (newPageName !== pageName) {
        const newPageId = pages.find((p) => p.name === newPageName)?.id;
        if (newPageId) dispatch(selectRootElement(newPageId));
      }
    });
  }, [JSON.stringify(pages), pageName]);

  React.useEffect(() => {
    if (isLoaded) socket.emit('elements-updated', { tree, variables });
  }, [JSON.stringify(tree), JSON.stringify(variables)]);

  React.useEffect(() => {
    socket.emit('navigate-page', { url: pageName });
  }, [pageName]);

  React.useEffect(() => {
    socket.emit('select-element', { id: selectedElementId });
  }, [selectedElementId]);

  React.useEffect(() => {
    socket.emit('hover-element', { id: hoverElementId });
  }, [hoverElementId]);

  if (!previewServer) return <div />;

  return (
    <Styles.Container>
      {previewClientReady && (
        <Styles.Iframe
          previewSize={previewSize}
          src={`${previewServer.host}:${previewServer.clientPort}`}
        />
      )}
    </Styles.Container>
  );
};
