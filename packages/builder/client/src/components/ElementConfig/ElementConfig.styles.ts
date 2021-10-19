import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.colors.secondary300};
  overflow: hidden;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: 20px auto;
  grid-column-gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.header.background.color};
  box-shadow: 0 5px 10px 0 ${({ theme }) => theme.header.boxshadow.color};

  & > *:last-child {
    grid-column: 1/-1;
  }

  & button {
    padding: ${({ theme }) => theme.spacing(2)};
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
  padding: 16px;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.background.lightAlt};
`;
