import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CustomComponent, Page } from '@ui-studio/types';

import { PageBuilder } from './builders/page';
import { Store } from './types/store';

const DEV = true;

export const Router = (): JSX.Element => {
  const roots = Object.values(useSelector((state: Store) => state.root.config));
  const pages = roots.filter((e): e is Page => e.type === 'page');
  const customComponents = roots.filter((e): e is CustomComponent => e.type === 'customComponent');

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
      {DEV &&
        customComponents.map((customComponent) => (
          <Route
            key={`custom-component-${customComponent.id}`}
            path={`/__customComponent/${customComponent.id}`}
          >
            <PageBuilder pageId={customComponent.id} />
          </Route>
        ))}
      <Redirect to={`/${pages[0].name}`} />
    </Switch>
  );
};
