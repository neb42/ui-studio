import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.light};
`;

export const Header = styled.div`
  grid-column: 1/-1;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 55px;
  padding: ${({ theme }) => theme.spacing.px.small}px ${({ theme }) => theme.spacing.px.regular}px;
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};
`;

export const HeaderTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;
