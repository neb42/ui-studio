import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { useBuildTree } from './builders/tree';

export const App = () => {
  const tree = useBuildTree();

  return (
    <Switch>
      {tree.map((page) => (
        <Route path={`/${page.name}`} component={page.component} />
      ))}
      <Redirect to={`/${tree.find((p) => p.default)?.name}`} />
    </Switch>
  );
};
