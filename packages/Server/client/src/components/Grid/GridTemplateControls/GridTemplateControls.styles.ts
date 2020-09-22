import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
`;

export const Name = styled.span``;

export const Cell = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 8px;
  align-items: center;
  margin-bottom: 8px;
`;
