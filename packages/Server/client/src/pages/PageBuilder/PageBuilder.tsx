import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPages, getSelectedPageId, getSelectedElementId } from 'selectors/element';
import { selectPage } from 'actions/element';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';
import { PopoverNavigation } from 'components/PopoverNavigation';
import { Preview } from 'components/Preview';
import { Header } from 'components/Header';

import * as Styles from './PageBuilder.styles';

export const PageBuilder = (): JSX.Element => {
  const dispatch = useDispatch();
  const pageId = useSelector(getSelectedPageId);
  const elementId = useSelector(getSelectedElementId);
  const pages = useSelector(getPages);

  React.useEffect(() => {
    if (pageId === null) {
      dispatch(selectPage(Object.keys(pages)[0]));
    }
  }, [pageId]);

  const pageName = pageId ? pages[pageId].name : '';

  return (
    <Styles.Container>
      <Header />
      <Styles.Body>
        <Styles.ColLeft>
          {pageId && <ElementTree pageId={pageId} />}
          <PopoverNavigation />
        </Styles.ColLeft>
        <Preview pageName={pageName} />
        <Styles.ColRight>
          <ElementConfig key={elementId} />
        </Styles.ColRight>
      </Styles.Body>
    </Styles.Container>
  );
};
