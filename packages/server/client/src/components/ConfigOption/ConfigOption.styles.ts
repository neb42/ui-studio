import styled from 'styled-components';

export const Container = styled.div<{ nested?: boolean }>`
  ${({ nested, theme }) =>
    nested
      ? `
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      padding: 8px;
      background-color: ${theme.colors.secondary100};

      & > *:last-child {
        flex-grow: 1;
        margin-right: 24px;
      }
     `
      : `
    display: grid;
    grid-template-rows: auto;
  `}
  row-gap: 8px;
`;

export const ComplexContainer = styled.div<{ listItem?: boolean }>`
  ${({ listItem, theme }) =>
    listItem
      ? `
      padding: 8px;
      background-color: ${theme.colors.secondary100};
     `
      : `
  `}
  display: grid;
  grid-template-rows: auto;
  row-gap: 8px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.div<{ leftIcon?: boolean }>`
  flex: 1;
  font-weight: 500;
  ${({ leftIcon }) => (leftIcon ? 'margin-left: 8px;' : '')}
`;

export const ModeButtons = styled.div``;
