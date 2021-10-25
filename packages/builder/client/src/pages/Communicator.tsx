import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { OpenAPIV3 } from 'openapi-types';
import { Component } from '@ui-studio/types';
import { Store$Tree, Store$Variable, Store, Store$Configuration } from 'types/store';
import { getVariables } from 'selectors/variable';
import { getRoots, getRawTree, getSelectedRootElement } from 'selectors/tree';
import { getColorConfig } from 'selectors/configuration';
import { getSelectedElementId, getHoverElementId, getPreviewSize } from 'selectors/view';
import { initComponents, initApi } from 'actions/configuration';
import { initClient } from 'actions/init';
import { selectRootElement, selectElement, setPreviewReady, setPreviewServer } from 'actions/view';

const getUrl = (state: Store) => {
  const root = getSelectedRootElement(state);
  if (!root) return '';
  if (root.type === 'page') return `/${root.name}`;
  return `/__customComponent/${root.id}`;
};

export const Communicator = (): null => {
  const dispatch = useDispatch();
  const url = useSelector(getUrl);
  const roots = useSelector(getRoots);
  const colorConfig = useSelector(getColorConfig);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  const selectedElementId = useSelector(getSelectedElementId);
  const hoverElementId = useSelector(getHoverElementId);

  const socket = React.useMemo(() => io('/'), []);

  const tree = useSelector(getRawTree);
  const variables = useSelector(getVariables);

  React.useEffect(() => {
    socket.on(
      'init-client',
      async (client: {
        tree: Store$Tree;
        variables: Store$Variable;
        colors: Store$Configuration['colors'];
      }) => {
        await dispatch(initClient(client));
        setIsLoaded(true);
      },
    );

    socket.on('client-ready', () => dispatch(setPreviewReady(true)));

    socket.on('set-server', ({ host, clientPort }: { host: string; clientPort: number }) =>
      dispatch(setPreviewServer(host, clientPort)),
    );

    socket.on(
      'init-builder',
      ({ components }: { components: Component[]; colors: Store$Configuration['colors'] }) => {
        dispatch(initComponents(components));
      },
    );

    socket.on('init-api', (openAPIDef: OpenAPIV3.Document) => {
      dispatch(initApi(openAPIDef));
    });

    socket.on('select-element', (response: { id: string | null }) => {
      if (response.id !== selectedElementId) dispatch(selectElement(response.id));
    });
  }, []);

  React.useEffect(() => {
    socket.on('navigate-page', (response: { url: string }) => {
      if (url) {
        const currentRootIdentifier = url.replace('/__customComponent', '').replace('/', '');
        const nextRootIdentifier = response.url.replace('/__customComponent', '').replace('/', '');
        if (currentRootIdentifier !== nextRootIdentifier) {
          // TODO check if page or component
          const nextRootId = roots.find((p) => p.name === nextRootIdentifier)?.id;
          if (nextRootId) dispatch(selectRootElement(nextRootId));
        }
      }
    });
  }, [JSON.stringify(roots), url]);

  React.useEffect(() => {
    if (isLoaded) socket.emit('elements-updated', { tree, variables, colors: colorConfig });
  }, [JSON.stringify(tree), JSON.stringify(variables)]);

  React.useEffect(() => {
    socket.emit('navigate-page', { url });
  }, [url]);

  React.useEffect(() => {
    socket.emit('select-element', { id: selectedElementId });
  }, [selectedElementId]);

  React.useEffect(() => {
    socket.emit('hover-element', { id: hoverElementId });
  }, [hoverElementId]);

  return null;
};
