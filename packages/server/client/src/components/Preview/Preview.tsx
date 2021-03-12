import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { InitFunctions, Component } from 'canvas-types';
import { Store$Page, Store$Widget, Store$Variable } from 'types/store';
import {
  makeGetElements,
  getVariables,
  getPages,
  getSelectedElementId,
  getHoverElementId,
  getPreviewSize,
} from 'selectors/element';
import {
  initComponents,
  initFunctions,
  initClient,
  selectPage,
  selectElement,
} from 'actions/element';

import * as Styles from './Preview.styles';

interface IPreview {
  pageName: string;
}

export const Preview = ({ pageName }: IPreview): JSX.Element => {
  const dispatch = useDispatch();
  const pages = Object.values(useSelector(getPages));
  const previewSize = useSelector(getPreviewSize);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [previewServer, setPreviewServer] = React.useState<{
    host: string;
    clientPort: number;
    serverPort: number;
  } | null>(null);

  const selectedElementId = useSelector(getSelectedElementId);
  const hoverElementId = useSelector(getHoverElementId);

  const socket = React.useMemo(() => io('/'), []);

  const elements = useSelector(React.useMemo(makeGetElements, []));
  const variables = useSelector(getVariables);

  React.useEffect(() => {
    socket.on(
      'init-client',
      async (client: { pages: Store$Page; widgets: Store$Widget; variables: Store$Variable }) => {
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

    socket.on('select-element', (response: { id: string | null }) => {
      if (response.id !== selectedElementId) dispatch(selectElement(response.id));
    });
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

  React.useEffect(() => {
    socket.emit('select-element', { id: selectedElementId });
  }, [selectedElementId]);

  React.useEffect(() => {
    socket.emit('hover-element', { id: hoverElementId });
  }, [hoverElementId]);

  if (!previewServer) return <div />;

  return (
    <Styles.Container>
      <Styles.Iframe
        previewSize={previewSize}
        src={`${previewServer.host}:${previewServer.clientPort}`}
      />
    </Styles.Container>
  );
};
