import * as React from 'react';
import { Element } from '@ui-studio/types';
import { FlexParentStyle } from 'components/Flex/FlexParentStyle';
import { GridParentStyle } from 'components/Grid/GridParentStyle';
import { CSSInput } from 'components/CSSInput';
import { ClassNamesInput } from 'components/ClassNamesInput';

interface Props {
  element: Element;
  parentElement: Element | null;
}
export const StyleConfig = ({ element, parentElement }: Props): JSX.Element | null => {
  return (
    <>
      {!element.rootElement &&
        !parentElement?.rootElement &&
        parentElement?.layout?.type === 'grid' && (
          <GridParentStyle element={element} parent={parentElement} />
        )}
      {!element.rootElement &&
        !parentElement?.rootElement &&
        parentElement?.layout?.type === 'flex' && (
          <FlexParentStyle element={element} parent={parentElement} />
        )}
      <ClassNamesInput element={element} />
      <CSSInput element={element} />
    </>
  );
};
