import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Page } from '@ui-studio/types';

import { PageBuilder } from './builders/page';
import { Store } from './types/store';

export const Router = (): JSX.Element => {
  const pages = Object.values(useSelector((state: Store) => state.root.config)).filter(
    (e): e is Page => e.type === 'page',
  );

  if (pages.length === 0) return <div />;

  return (
    <Switch>
      {pages.map((page) => {
        return (
          <Route key={`route-${page.id}`} path={`/${page.name}`}>
            <PageBuilder pageId={page.id} />
          </Route>
        );
      })}
      <Redirect to={`/${pages[0].name}`} />
    </Switch>
  );
};
