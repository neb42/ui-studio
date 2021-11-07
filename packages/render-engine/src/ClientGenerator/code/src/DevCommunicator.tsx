import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import {
  Widget,
  Variable,
  Page,
  Component,
  ComponentDefinition,
  CustomComponent,
  CustomComponentInstance,
} from '@ui-studio/types';

import { KeyedObject, Store } from './types/store';
import { updateTree } from './actions/updateTree';
import { updateHoverElement, updateSelectedElement } from './actions/development';
import { initApi } from './actions/initApi';
import { Components } from './Components';

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

export const DevCommunicator = () => {
  const dispatch = useDispatch();
  const socket = React.useMemo(() => io('http://localhost:3002'), []);
  const location = useLocation();
  const history = useHistory();
  const selectedElementId = useSelector((state: Store) => state.development.selectedElement);

  React.useEffect(() => {
    socket.emit(messages.client.registerClient);

    [messages.client.initClient, messages.client.updateTree].forEach((e) => {
      socket.on(
        e,
        (client: {
          tree: KeyedObject<{
            root: Page | CustomComponent;
            widgets: KeyedObject<Widget | CustomComponentInstance>;
          }>;
          variables: KeyedObject<Variable>;
        }) => dispatch(updateTree(client)),
      );
    });

    const emitSetOpenApiEndpoint = () => {
      socket.on(messages.client.setOpenApiEndpoint, async (endpoint: string) => {
        const { data: openAPIDef } = await axios.get(endpoint);
        socket.emit(messages.builder.initApi, openAPIDef);
        dispatch(initApi(openAPIDef));
      });
    };

    const emitInitBuilder = () => {
      socket.emit(messages.builder.initBuilder, {
        components: Object.keys(Components).reduce<Component[]>((acc, cur) => {
          if (cur === 'functions-pkg') return acc;
          return [
            ...acc,
            ...Object.values(Components[cur]).map(
              ({ component: _, ...cc }: ComponentDefinition) => ({
                ...cc,
                library: cur,
              }),
            ),
          ];
        }, []),
      });
    };

    emitSetOpenApiEndpoint();
    emitInitBuilder();

    socket.on(messages.client.reloadOpenApi, emitSetOpenApiEndpoint);
    socket.on(messages.client.reloadComponents, emitInitBuilder);

    socket.on(messages.client.navigatePage, (response: { url: string }) => {
      if (response.url !== location.pathname) {
        history.push(response.url);
      }
    });

    socket.on(messages.client.selectElement, (response: { id: string | null }) => {
      if (response.id !== selectedElementId) dispatch(updateSelectedElement(response.id));
    });

    socket.on(messages.client.hoverElement, (response: { id: string | null }) => {
      dispatch(updateHoverElement(response.id));
    });
  }, []);

  React.useEffect(() => {
    socket.emit(messages.builder.navigatePage, { url: location.pathname });
  }, [location.pathname]);

  return null;
};
