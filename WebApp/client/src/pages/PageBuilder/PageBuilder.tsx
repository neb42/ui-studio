import * as React from 'react';
import { ElementTree } from 'components/ElementTree';
import { ElementConfig } from 'components/ElementConfig';

import * as Styles from './PageBuilder.styles';

interface Props {
  pageName: string;
}

export const PageBuilder = ({ pageName }: Props): JSX.Element => {
  return (
    <Styles.Container>
      <ElementTree pageName={pageName} />
      <div>iframe</div>
      <ElementConfig />
    </Styles.Container>
  );
};
