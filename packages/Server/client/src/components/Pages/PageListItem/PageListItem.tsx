import * as React from 'react';

import * as Styles from './PageListItem.styles';

interface Props {
  name: string;
  active: boolean;
  onClick: () => void;
}

export const PageListItem = ({ name, active, onClick }: Props): JSX.Element => {
  return (
    <Styles.Container onClick={onClick} active={active}>
      {name}
    </Styles.Container>
  );
};
