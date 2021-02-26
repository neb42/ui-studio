import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const Name = styled.span`
  font-weight: 500;
  text-transform: capitalize;
`;

export const Cell = styled.div<{ showValueControl: boolean }>`
  display: grid;
  grid-template-columns: ${({ showValueControl }) =>
    showValueControl ? '32px 1fr auto' : '1fr auto'};
  justify-content: space-between;
  grid-column-gap: 8px;
  align-items: end;
  margin-bottom: 8px;

  & *:last-child {
    align-self: center;
  }
`;
