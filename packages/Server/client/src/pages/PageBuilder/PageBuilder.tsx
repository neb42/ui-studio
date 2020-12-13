import * as React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedPageId } from 'selectors/element';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';
import { Preview } from 'components/Preview';

import * as Styles from './PageBuilder.styles';

export const PageBuilder = (): JSX.Element => {
  const pageName = useSelector(getSelectedPageId);

  if (!pageName) return <div />;

  return (
    <>
      <Styles.Container>
        <Styles.ColLeft>
          <ElementTree pageName={pageName} />
        </Styles.ColLeft>
        <Preview pageName={pageName} />
        <Styles.ColRight>
          <ElementConfig />
        </Styles.ColRight>
      </Styles.Container>
    </>
  );
};
