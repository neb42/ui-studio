import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Widget, Variable, Page, Layout, Component } from '@ui-builder/types';

import { KeyedObject } from './types/store';
import { updateTree } from './actions/updateTree';
import { Functions } from 'functions-pkg';
import { Components } from './Components';

const removeNullParent = (n: KeyedObject<any>) =>
  Object.keys(n).reduce((acc, cur) => {
    if (n[cur].parent === null) return acc;
    return { ...acc, [cur]: n[cur] };
  }, {});

export const DevCommunicator = () => {
  const dispatch = useDispatch()
  const socket = React.useMemo(() => io('http://localhost:3002'), []);
  const location = useLocation();
  const history = useHistory();
  
  React.useEffect(() => {
    ['init-client', 'update-tree'].forEach(e => {
      socket.on(e, (tree: {
        widgets: KeyedObject<Widget>; 
        pages: KeyedObject<Page>; 
        layouts: KeyedObject<Layout>; 
        variables: KeyedObject<Variable>; 
      }) => dispatch(updateTree({
        ...tree,
        widgets: removeNullParent(tree.widgets),
        layouts: removeNullParent(tree.layouts),
      })));
    });

    socket.emit('init-builder', {
      functions: new Functions().registered,
      components: Object.keys(Components)
        .reduce<Component[]>((acc, cur) => {
          if (cur === 'functions-pkg') return acc;
          return [
            ...acc,
            ...Object.values(Components[cur]).map(({ component: _, ...cc }: Component & { component: React.FC }) => ({
              ...cc,
              library: cc.library || 'custom',
            })),
          ];
        }, []),
    });

    socket.on('navigate-page', (response: { url: string }) => {
      if (response.url !== location.pathname) {
        history.push(response.url);
      }
    });
  }, []);
  
  React.useEffect(() => {
    socket.emit('navigate-page', { url: location.pathname });
  }, [location.pathname]);

  return null;
};