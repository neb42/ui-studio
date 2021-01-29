import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
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
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  height: 100%;
`;

export const Field = styled.div`
  flex-grow: 1;
  overflow: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 16px;
  padding: 16px;
`;
