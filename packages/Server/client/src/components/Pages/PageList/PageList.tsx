import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPage } from 'actions/element';
import { getOverlays, getPages, getSelectedPageId } from 'selectors/element';
import { PageListItem } from 'components/Pages/PageListItem';

import * as Styles from './PageList.styles';

export const PageList = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedPageId = useSelector(getSelectedPageId);
  const pages = useSelector(getPages);
  const overlays = useSelector(getOverlays);

  const handleSelectPage = (name: string) => () => dispatch(selectPage(name));
  const handleSelectOverlay = (name: string) => () => {};

  return (
    <Styles.Container>
      <Styles.Header>Pages + Overlays</Styles.Header>
      <Styles.List>
        {Object.values(pages).map((p) => (
          <PageListItem
            key={p.name}
            name={p.name}
            active={selectedPageId === p.name}
            onClick={handleSelectPage(p.name)}
          />
        ))}
      </Styles.List>
      <Styles.Divider />
      <Styles.List>
        {Object.values(overlays).map((o) => (
          <PageListItem
            key={o.name}
            name={o.name}
            active={selectedPageId === o.name}
            onClick={handleSelectOverlay(o.name)}
          />
        ))}
      </Styles.List>
    </Styles.Container>
  );
};
