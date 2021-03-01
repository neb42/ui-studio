import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Widget, Variable, Page, Layout, Component } from 'canvas-types';
import Functions from 'functions-pkg/build/Functions';

import { KeyedObject, Store } from './types/store';
import { updateTree } from './actions/updateTree';
import { updateHoverElement, updateSelectedElement } from './actions/development';
import { Components } from './Components';

const removeNullParent = (n: KeyedObject<any>) =>
  Object.keys(n).reduce((acc, cur) => {
    if (n[cur].parent === null) return acc;
    return { ...acc, [cur]: n[cur] };
  }, {});

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
        (tree: {
          widgets: KeyedObject<Widget>;
          pages: KeyedObject<Page>;
          layouts: KeyedObject<Layout>;
          variables: KeyedObject<Variable>;
        }) =>
          dispatch(
            updateTree({
              ...tree,
              widgets: removeNullParent(tree.widgets),
              layouts: removeNullParent(tree.layouts),
            }),
          ),
      );
    });

    socket.emit('init-builder', {
      functions: new Functions().registered,
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
