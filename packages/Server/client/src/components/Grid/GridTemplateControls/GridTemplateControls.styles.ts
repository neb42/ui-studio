import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
`;

export const Name = styled.span`
  font-weight: 500;
  text-transform: capitalize;
`;

export const Cell = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-column-gap: 8px;
  align-items: end;
  margin-bottom: 8px;

  & *:last-child {
    align-self: center;
  }
`;
