import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { useBuildTree } from './builders/tree';
import { PageBuilder } from './builders/page';

export const App = () => {
  const tree = useBuildTree();

  if (tree.length === 0) return <div />;

  return (
    <Switch>
      {tree.map((node) => {
        const Page = () => React.createElement(PageBuilder, { pageNode: node });
        return <Route key={`route-${node.id}`} path={`/${node.element.name}`} component={Page} />;
      })}
      <Redirect to={`/${tree[0].name}`} />
    </Switch>
  );
};
