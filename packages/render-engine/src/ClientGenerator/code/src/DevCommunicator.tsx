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
  CustomComponent,
  CustomComponentInstance,
} from '@ui-studio/types';

import { KeyedObject, Store } from './types/store';
import { updateTree } from './actions/updateTree';
import { updateHoverElement, updateSelectedElement } from './actions/development';
import { initApi } from './actions/initApi';
import { Components } from './Components';

export const DevCommunicator = () => {
  const dispatch = useDispatch();
  const socket = React.useMemo(() => io('http://localhost:3002'), []);
  const location = useLocation();
  const history = useHistory();
  const selectedElementId = useSelector((state: Store) => state.development.selectedElement);

  React.useEffect(() => {
    ['init-client', 'update-tree'].forEach((e) => {
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

    socket.on('set-open-api-endpoint', async (endpoint: string) => {
      const { data: openAPIDef } = await axios.get(endpoint);
      socket.emit('init-api', openAPIDef);
      dispatch(initApi(openAPIDef));
    });

    socket.emit('init-builder', {
      components: Object.keys(Components).reduce<Component[]>((acc, cur) => {
        if (cur === 'functions-pkg') return acc;
        return [
          ...acc,
          ...Object.values(Components[cur]).map(
            ({ component: _, ...cc }: Component & { component: React.FC }) => ({
              ...cc,
              library: cc.library || 'custom',
            }),
          ),
        ];
      }, []),
    });

    socket.on('navigate-page', (response: { url: string }) => {
      if (response.url !== location.pathname) {
        history.push(response.url);
      }
    });

    socket.on('select-element', (response: { id: string | null }) => {
      if (response.id !== selectedElementId) dispatch(updateSelectedElement(response.id));
    });

    socket.on('hover-element', (response: { id: string | null }) => {
      dispatch(updateHoverElement(response.id));
    });
  }, []);

  React.useEffect(() => {
    socket.emit('navigate-page', { url: location.pathname });
  }, [location.pathname]);

  React.useEffect(() => {
    socket.emit('select-element', { id: selectedElementId });
  }, [selectedElementId]);

  return null;
};
