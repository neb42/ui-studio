import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2),
    0 2px 6px rgba(16, 22, 26, 0.2);
  overflow: hidden;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 20px auto;
  grid-column-gap: ${({ theme }) => theme.spacing.px.small}px;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.px.small}px ${({ theme }) => theme.spacing.px.regular}px;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};

  & > *:last-child {
    grid-column: 1/-1;
  }

  & button {
    padding: ${({ theme }) => theme.spacing.px.small}px;
  }
`;

export const ComponentName = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  font-size: 16px;
`;

export const Body = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  row-gap: 24px;
  padding: 16px 24px;
  overflow: auto;
`;
