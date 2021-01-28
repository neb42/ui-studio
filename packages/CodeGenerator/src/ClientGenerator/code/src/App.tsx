import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Store } from './types/store';
import { useBuildTree } from './builders/tree';
import { PageBuilder } from './builders/page';
import { WidgetBuilder } from './builders/widget';

export const App = () => {
  const { widgets, pages, layouts } = useSelector((state: Store) => ({
    widgets: state.widget.config,
    pages: state.page.config,
    layouts: state.layout.config,
  }));
  const tree = useBuildTree();

  return (
    <div>
      {Object.values(widgets).map((w) => (
        <WidgetBuilder widget={w} />
      ))}
    </div>
  );

  return (
    <Switch>
      {tree.map((node) => {
        const page = pages[node.id];
        const Page = () =>
          React.createElement(PageBuilder, {
            page,
            widgets,
            layouts,
            pageNode: node,
          });
        return <Route path={`/${page.name}`} component={Page} />;
      })}
      {/* <Redirect to={`/${tree.find((p) => p.default)?.name}`} /> */}
    </Switch>
  );
};
