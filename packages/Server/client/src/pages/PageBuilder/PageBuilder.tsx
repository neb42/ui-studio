import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPages, getSelectedPageId } from 'selectors/element';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';
import { Preview } from 'components/Preview';
import { selectPage } from 'actions/element';

import * as Styles from './PageBuilder.styles';

export const PageBuilder = (): JSX.Element => {
  const dispatch = useDispatch();
  const pageId = useSelector(getSelectedPageId);
  const pages = useSelector(getPages);

  React.useEffect(() => {
    if (pageId === null) {
      dispatch(selectPage(Object.keys(pages)[0]));
    }
  }, [pageId]);

  if (!pageId) return <div />;

  return (
    <>
      <Styles.Container>
        <Styles.ColLeft>
          <ElementTree pageId={pageId} />
        </Styles.ColLeft>
        <Preview pageId={pageId} />
        <Styles.ColRight>
          <ElementConfig />
        </Styles.ColRight>
      </Styles.Container>
    </>
  );
};
