import styled from 'styled-components';

export const Container = styled.div<{ nested: boolean }>`
  ${({ nested }) =>
    nested
      ? `
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
     `
      : `
    display: grid;
    grid-template-rows: auto;
  `}
  row-gap: 8px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.div`
  flex: 1;
  font-weight: 500;
`;

export const ModeButtons = styled.div``;
