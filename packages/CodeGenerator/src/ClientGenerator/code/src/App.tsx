import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { PageBuilder } from './builders/page';
import { Store } from './types/store';

export const App = (): JSX.Element => {
  const pages = useSelector((state: Store) => state.page.config);

  if (Object.keys(pages).length === 0) return <div />;

  return (
    <Switch>
      {Object.values(pages).map((page) => {
        return (
          <Route key={`route-${page.id}`} path={`/${page.name}`}>
            <PageBuilder pageId={page.id} />
          </Route>
        );
      })}
      <Redirect to={`/${Object.values(pages)[0].name}`} />
    </Switch>
  );
};
