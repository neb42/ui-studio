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

const messages = {
  builder: {
    registerBuilder: 'REGISTER-BUILDER',
    initClient: 'BUILDER: INIT-CLIENT',
    clientReady: 'BUILDER: CLIENT-READY',
    setServer: 'BUILDER: SET-SERVER',
    initBuilder: 'BUILDER: INIT-BUILDER',
    initApi: 'BUILDER: INIT-API',
    navigatePage: 'BUILDER: NAVIGATE-PAGE',
  },
  client: {
    registerClient: 'REGISTER-CLIENT',
    initClient: 'CLIENT: INIT-CLIENT',
    updateTree: 'CLIENT: UPDATE-TREE',
    setOpenApiEndpoint: 'CLIENT: SET-OPEN-API-ENDPOINT',
    reloadOpenApi: 'CLIENT: RELOAD-OPEN-API',
    reloadComponents: 'CLIENT: RELOAD-COMPONENTS',
    navigatePage: 'CLIENT: NAVIGATE-PAGE',
    selectElement: 'CLIENT: SELECT-ELEMENT',
    hoverElement: 'CLIENT: HOVER-ELEMENT',
  },
};

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
    socket.on('connect', () => {
      socket.emit(messages.builder.registerBuilder);
    });

    socket.on(
      messages.builder.initClient,
      async (client: {
        tree: Store$Tree;
        variables: Store$Variable;
        colors: Store$Configuration['colors'];
      }) => {
        await dispatch(initClient(client));
        setIsLoaded(true);
      },
    );

    socket.on(messages.builder.clientReady, () => dispatch(setPreviewReady(true)));

    socket.on(
      messages.builder.setServer,
      ({ host, clientPort }: { host: string; clientPort: number }) =>
        dispatch(setPreviewServer(host, clientPort)),
    );

    socket.on(
      messages.builder.initBuilder,
      ({ components }: { components: Component[]; colors: Store$Configuration['colors'] }) => {
        dispatch(initComponents(components));
      },
    );

    socket.on(messages.builder.initApi, (openAPIDef: OpenAPIV3.Document) => {
      dispatch(initApi(openAPIDef));
    });
  }, []);

  React.useEffect(() => {
    socket.on(messages.builder.navigatePage, (response: { url: string }) => {
      if (url) {
        const currentRootIdentifier = url.replace('/__customComponent', '').replace('/', '');
        const nextRootIdentifier = response.url.replace('/__customComponent', '').replace('/', '');
        if (currentRootIdentifier !== nextRootIdentifier) {
          const nextRootId = roots.find((p) => p.name === nextRootIdentifier)?.id;
          if (nextRootId) dispatch(selectRootElement(nextRootId));
        }
      }
    });
  }, [JSON.stringify(roots), url]);

  React.useEffect(() => {
    if (isLoaded) socket.emit(messages.client.updateTree, { tree, variables, colors: colorConfig });
  }, [JSON.stringify(tree), JSON.stringify(variables)]);

  React.useEffect(() => {
    socket.emit(messages.client.navigatePage, { url });
  }, [url]);

  React.useEffect(() => {
    socket.emit(messages.client.selectElement, { id: selectedElementId });
  }, [selectedElementId]);

  React.useEffect(() => {
    socket.emit(messages.client.hoverElement, { id: hoverElementId });
  }, [hoverElementId]);

  return null;
};
