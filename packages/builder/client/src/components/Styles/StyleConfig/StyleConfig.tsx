import * as React from 'react';
import { Element } from '@ui-studio/types';
import { FlexParentStyle } from 'components/Flex/FlexParentStyle';
import { GridParentStyle } from 'components/Grid/GridParentStyle';
import { CSSInput } from 'components/Styles/CSSInput';
import { ClassNamesInput } from 'components/Styles/ClassNamesInput';
import { BackgroundColor } from 'components/Styles/BackgroundColor';
import { Overflow } from 'components/Styles/Overflow';

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
      <BackgroundColor element={element} />
      <Overflow element={element} />
      <ClassNamesInput element={element} />
      <CSSInput element={element} />
    </>
  );
};
