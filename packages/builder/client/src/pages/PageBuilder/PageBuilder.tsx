import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRoots, getSelectedRootElement } from 'selectors/tree';
import { selectRootElement } from 'actions/view';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';
import { PopoverNavigation } from 'components/PopoverNavigation';
import { Preview } from 'components/Preview';
import { Header } from 'components/Header';

import * as Styles from './PageBuilder.styles';

export const PageBuilder = (): JSX.Element => {
  const dispatch = useDispatch();
  const roots = useSelector(getRoots);
  const rootElement = useSelector(getSelectedRootElement);

  React.useEffect(() => {
    if (!rootElement) {
      dispatch(selectRootElement(Object.keys(roots)[0]));
    }
  }, [JSON.stringify(rootElement)]);

  return (
    <Styles.Container>
      <Header />
      <Styles.Body>
        <Styles.ColLeft>
          {rootElement && <ElementTree />}
          <PopoverNavigation />
        </Styles.ColLeft>
        <Preview />
        <ElementConfig key={rootElement?.id} />
      </Styles.Body>
    </Styles.Container>
  );
};
